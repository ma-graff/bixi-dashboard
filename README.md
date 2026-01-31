# Bixi System Dashboard

Real-time bike availability dashboard for Montreal's Bixi bike-sharing system.

## Features

- **Interactive Map**: MapLibre GL powered map centered on Montreal
- **Real-time Data**: Station availability updates every 3 minutes
- **Color-coded Markers**: Green (high), Yellow (medium), Orange (low), Red (empty)
- **System Stats**: Total bikes, e-bikes, docks, and stations displayed in header
- **Station Details**: Click any marker for detailed breakdown of classic vs e-bikes
- **Light Theme**: Clean design with dark red accents

## Tech Stack

### Backend
- **FastAPI** - Modern Python web framework
- **httpx** - Async HTTP client for GBFS data fetching
- **APScheduler** - Background job scheduler (120-second polling)

### Frontend
- **React 18** with TypeScript
- **Vite** - Fast build tool
- **TanStack Query** - Data fetching and caching
- **MapLibre GL** + react-map-gl - Map visualization
- **Tailwind CSS** - Styling

## Prerequisites

- Python 3.11+
- Node.js 18+
- npm or yarn

## Getting Started

### 1. Backend Setup

```bash
# Navigate to backend directory
cd backend

# Create virtual environment (optional but recommended)
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Start the server
uvicorn main:app --reload --port 8000
```

The API will be available at http://localhost:8000

### 2. Frontend Setup

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

The dashboard will be available at http://localhost:5173

## API Endpoints

### GET `/api/v1/stations`

Returns all Bixi stations as a GeoJSON FeatureCollection.

**Response:**
```json
{
  "type": "FeatureCollection",
  "features": [
    {
      "type": "Feature",
      "geometry": {
        "type": "Point",
        "coordinates": [-73.5673, 45.5017]
      },
      "properties": {
        "station_id": "123",
        "name": "Station Name",
        "bikes_available": 10,
        "classic_bikes": 8,
        "ebikes_available": 2,
        "docks_available": 15,
        "availability_status": "high",
        "marker_color": "#22c55e"
      }
    }
  ],
  "metadata": {
    "last_updated": "2024-01-15T10:30:00Z",
    "stats": {
      "total_bikes": 5000,
      "total_ebikes": 1000,
      "total_docks": 8000,
      "station_count": 800
    }
  }
}
```

### GET `/api/v1/health`

Health check endpoint.

## Data Source

This dashboard uses Bixi's General Bikeshare Feed Specification (GBFS) endpoints:
- `station_information.json` - Static station data (coordinates, names, capacity)
- `station_status.json` - Real-time availability data

## Project Structure

```
bixi-dashboard/
├── backend/
│   ├── main.py           # FastAPI app with scheduler
│   └── requirements.txt  # Python dependencies
├── frontend/
│   ├── src/
│   │   ├── components/   # React components
│   │   │   ├── Header.tsx
│   │   │   ├── LoadingOverlay.tsx
│   │   │   ├── MapView.tsx
│   │   │   └── StationPopup.tsx
│   │   ├── hooks/        # Custom hooks
│   │   │   └── useStations.ts
│   │   ├── types/        # TypeScript types
│   │   │   └── station.ts
│   │   ├── App.tsx
│   │   ├── main.tsx
│   │   └── index.css
│   ├── package.json
│   └── vite.config.ts
└── README.md
```

## License

MIT
