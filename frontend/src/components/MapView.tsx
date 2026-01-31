import { useState, useCallback, useMemo, useEffect } from 'react';
import Map, { Marker, Popup, NavigationControl, ScaleControl } from 'react-map-gl/maplibre';
import type { StationFeature } from '../types/station';
import { useLanguage } from '../hooks/useLanguage';
import StationPopup from './StationPopup';
import 'maplibre-gl/dist/maplibre-gl.css';

interface MapViewProps {
    stations: StationFeature[];
    dataUpdatedAt?: number;
}

// Montreal center coordinates
const MONTREAL_CENTER = {
    longitude: -73.5673,
    latitude: 45.5017,
    zoom: 13,
};

// CyclOSM - cycling-focused basemap showing bike lanes, paths, and infrastructure
const MAP_STYLE = {
    version: 8 as const,
    sources: {
        cyclosm: {
            type: 'raster' as const,
            tiles: [
                'https://a.tile-cyclosm.openstreetmap.fr/cyclosm/{z}/{x}/{y}.png',
                'https://b.tile-cyclosm.openstreetmap.fr/cyclosm/{z}/{x}/{y}.png',
                'https://c.tile-cyclosm.openstreetmap.fr/cyclosm/{z}/{x}/{y}.png',
            ],
            tileSize: 256,
            attribution: '&copy; <a href="https://www.cyclosm.org">CyclOSM</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        },
    },
    layers: [
        {
            id: 'cyclosm-tiles',
            type: 'raster' as const,
            source: 'cyclosm',
            minzoom: 0,
            maxzoom: 20,
        },
    ],
};

export default function MapView({ stations, dataUpdatedAt }: MapViewProps) {
    const [selectedStation, setSelectedStation] = useState<StationFeature | null>(null);
    const [viewState, setViewState] = useState(MONTREAL_CENTER);
    const { t } = useLanguage();

    // Close popup when data updates (station might have moved or changed)
    useEffect(() => {
        if (selectedStation && dataUpdatedAt) {
            // Find updated station data
            const updated = stations.find(
                s => s.properties.station_id === selectedStation.properties.station_id
            );
            if (updated) {
                setSelectedStation(updated);
            }
        }
    }, [dataUpdatedAt, stations, selectedStation]);

    const handleMarkerClick = useCallback((station: StationFeature) => {
        setSelectedStation(station);
    }, []);

    const handlePopupClose = useCallback(() => {
        setSelectedStation(null);
    }, []);

    // Memoize markers to prevent unnecessary re-renders
    const markers = useMemo(() => {
        return stations.map((station) => {
            const { station_id, marker_color, bikes_available, availability_status } = station.properties;
            const [lng, lat] = station.geometry.coordinates;

            // Determine marker size based on availability
            const size = availability_status === 'empty' ? 14 :
                availability_status === 'low' ? 16 :
                    availability_status === 'medium' ? 18 : 20;

            return (
                <Marker
                    key={station_id}
                    longitude={lng}
                    latitude={lat}
                    anchor="center"
                    onClick={(e) => {
                        e.originalEvent.stopPropagation();
                        handleMarkerClick(station);
                    }}
                >
                    <div
                        className="cursor-pointer transition-all duration-200 hover:scale-125 hover:z-10 relative group"
                        style={{ width: size, height: size }}
                    >
                        {/* Main circle */}
                        <div
                            className="absolute inset-0 rounded-full border-2 border-white shadow-md flex items-center justify-center"
                            style={{ backgroundColor: marker_color }}
                        >
                            {bikes_available > 0 && size >= 18 && (
                                <span className="text-[8px] font-bold text-white">
                                    {bikes_available > 99 ? '99+' : bikes_available}
                                </span>
                            )}
                        </div>
                    </div>
                </Marker>
            );
        });
    }, [stations, handleMarkerClick]);

    return (
        <Map
            {...viewState}
            onMove={(evt) => setViewState(evt.viewState)}
            style={{ width: '100%', height: '100%' }}
            mapStyle={MAP_STYLE}
            minZoom={10}
            maxZoom={18}
        >
            {/* Navigation controls */}
            <NavigationControl position="bottom-right" />
            <ScaleControl position="bottom-left" unit="metric" />

            {/* Station markers */}
            {markers}

            {/* Selected station popup */}
            {selectedStation && (
                <Popup
                    longitude={selectedStation.geometry.coordinates[0]}
                    latitude={selectedStation.geometry.coordinates[1]}
                    anchor="bottom"
                    onClose={handlePopupClose}
                    closeOnClick={false}
                    offset={15}
                    maxWidth="none"
                >
                    <StationPopup station={selectedStation.properties} />
                </Popup>
            )}

            {/* Legend */}
            <div className="absolute bottom-12 left-4 bg-white rounded-xl p-4 shadow-lg border border-slate-200">
                <h4 className="text-xs font-semibold text-slate-700 uppercase tracking-wider mb-3">
                    {t('availability')}
                </h4>
                <div className="space-y-2">
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-green-500 border border-white shadow-sm" />
                        <span className="text-xs text-slate-600">{t('high')} (&gt;50%)</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-yellow-500 border border-white shadow-sm" />
                        <span className="text-xs text-slate-600">{t('medium')} (10-50%)</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-orange-500 border border-white shadow-sm" />
                        <span className="text-xs text-slate-600">{t('low')} (&lt;10%)</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-red-500 border border-white shadow-sm" />
                        <span className="text-xs text-slate-600">{t('empty')}</span>
                    </div>
                </div>
            </div>
        </Map>
    );
}
