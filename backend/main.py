"""
Bixi System Dashboard - Backend API

FastAPI backend that fetches and caches Bixi GBFS data with background polling.
"""

from contextlib import asynccontextmanager
from datetime import datetime
from typing import Any

import os

from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import httpx
from apscheduler.schedulers.asyncio import AsyncIOScheduler
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded

# Rate limiter - 30 requests per minute per IP
limiter = Limiter(key_func=get_remote_address)

# Allowed origins for CORS (add your GitHub Pages URL)
ALLOWED_ORIGINS = os.environ.get(
    "ALLOWED_ORIGINS",
    "https://ma-graff.github.io"
).split(",")

# GBFS v2.2 Endpoints (English)
GBFS_BASE_URL = "https://gbfs.velobixi.com/gbfs/2-2/en"
STATION_INFO_URL = f"{GBFS_BASE_URL}/station_information.json"
STATION_STATUS_URL = f"{GBFS_BASE_URL}/station_status.json"

# In-memory cache
cache: dict[str, Any] = {
    "geojson": None,
    "last_updated": None,
    "stats": {
        "total_bikes": 0,
        "total_ebikes": 0,
        "total_docks": 0,
        "station_count": 0,
    }
}

# Scheduler instance
scheduler = AsyncIOScheduler()


def get_availability_status(bikes_available: int, capacity: int) -> str:
    """Determine availability status based on bike count vs capacity."""
    if capacity == 0:
        return "unknown"
    ratio = bikes_available / capacity
    if bikes_available == 0:
        return "empty"
    if ratio < 0.1:
        return "low"
    if ratio < 0.5:
        return "medium"
    return "high"


def get_marker_color(status: str) -> str:
    """Return hex color for marker based on availability status."""
    colors = {
        "high": "#22c55e",      # Green
        "medium": "#eab308",    # Yellow
        "low": "#f97316",       # Orange
        "empty": "#ef4444",     # Red
        "unknown": "#6b7280",   # Gray
    }
    return colors.get(status, "#6b7280")


async def fetch_and_cache_data():
    """Fetch GBFS data, merge, convert to GeoJSON, and cache."""
    try:
        async with httpx.AsyncClient(timeout=30.0) as client:
            # Fetch both feeds concurrently
            info_resp, status_resp = await asyncio.gather(
                client.get(STATION_INFO_URL),
                client.get(STATION_STATUS_URL),
            )
            
            info_resp.raise_for_status()
            status_resp.raise_for_status()
            
            info_data = info_resp.json()
            status_data = status_resp.json()
            
            info_stations = info_data["data"]["stations"]
            status_stations = status_data["data"]["stations"]
            
            # Create lookup map for status by station_id
            status_map = {s["station_id"]: s for s in status_stations}
            
            # Merge and convert to GeoJSON features
            features = []
            total_bikes = 0
            total_ebikes = 0
            total_docks = 0
            
            for station in info_stations:
                station_id = station["station_id"]
                status = status_map.get(station_id, {})
                
                # Extract counts with defaults
                bikes_available = status.get("num_bikes_available", 0)
                ebikes_available = status.get("num_ebikes_available", 0)
                docks_available = status.get("num_docks_available", 0)
                capacity = station.get("capacity", 0)
                
                # Calculate classic bikes (total - ebikes)
                classic_bikes = max(0, bikes_available - ebikes_available)
                
                # Determine availability status
                availability = get_availability_status(bikes_available, capacity)
                marker_color = get_marker_color(availability)
                
                # Build GeoJSON feature
                feature = {
                    "type": "Feature",
                    "geometry": {
                        "type": "Point",
                        "coordinates": [station["lon"], station["lat"]]
                    },
                    "properties": {
                        "station_id": station_id,
                        "name": station.get("name", "Unknown Station"),
                        "short_name": station.get("short_name", ""),
                        "capacity": capacity,
                        "bikes_available": bikes_available,
                        "classic_bikes": classic_bikes,
                        "ebikes_available": ebikes_available,
                        "docks_available": docks_available,
                        "is_installed": status.get("is_installed", 0),
                        "is_renting": status.get("is_renting", 0),
                        "is_returning": status.get("is_returning", 0),
                        "is_charging": station.get("is_charging", False),
                        "availability_status": availability,
                        "marker_color": marker_color,
                        "last_reported": status.get("last_reported"),
                    }
                }
                features.append(feature)
                
                # Accumulate totals
                total_bikes += bikes_available
                total_ebikes += ebikes_available
                total_docks += docks_available
            
            # Build GeoJSON FeatureCollection
            geojson = {
                "type": "FeatureCollection",
                "features": features,
            }
            
            # Update cache
            cache["geojson"] = geojson
            cache["last_updated"] = datetime.utcnow().isoformat() + "Z"
            cache["stats"] = {
                "total_bikes": total_bikes,
                "total_ebikes": total_ebikes,
                "total_docks": total_docks,
                "station_count": len(features),
            }
            
            print(f"[{cache['last_updated']}] Cache updated: {len(features)} stations")
            
    except Exception as e:
        print(f"Error fetching GBFS data: {e}")


import asyncio


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Application lifespan handler - starts/stops the scheduler."""
    # Initial data fetch
    await fetch_and_cache_data()
    
    # Schedule background job every 3 minutes
    scheduler.add_job(fetch_and_cache_data, "interval", seconds=180, id="fetch_bixi_data")
    scheduler.start()
    print("Background scheduler started - polling every 3 minutes")
    
    yield
    
    # Cleanup
    scheduler.shutdown()
    print("Background scheduler stopped")


# Create FastAPI app with lifespan
app = FastAPI(
    title="Bixi System Dashboard API",
    description="Real-time bike availability data for Montreal's Bixi system",
    version="1.0.0",
    lifespan=lifespan,
)

# Add rate limiter to app
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

# Enable CORS for frontend (restricted to allowed origins)
app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["GET"],
    allow_headers=["*"],
)


@app.get("/api/v1/stations")
@limiter.limit("30/minute")
async def get_stations(request: Request):
    """
    Get all Bixi stations as a GeoJSON FeatureCollection.
    
    Data is refreshed from GBFS feeds every 3 minutes.
    Each station includes availability status and color-coding for visualization.
    """
    return {
        "type": cache["geojson"]["type"] if cache["geojson"] else "FeatureCollection",
        "features": cache["geojson"]["features"] if cache["geojson"] else [],
        "metadata": {
            "last_updated": cache["last_updated"],
            "stats": cache["stats"],
        }
    }


@app.get("/api/v1/health")
@limiter.limit("60/minute")
async def health_check(request: Request):
    """Health check endpoint."""
    return {
        "status": "healthy",
        "last_updated": cache["last_updated"],
        "station_count": cache["stats"]["station_count"],
    }
