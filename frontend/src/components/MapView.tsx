import { useState, useCallback, useMemo, useEffect, useRef } from 'react';
import Map, { Marker, Popup, NavigationControl, ScaleControl, MapRef } from 'react-map-gl/maplibre';
import type { StationFeature } from '../types/station';
import { useLanguage } from '../hooks/useLanguage';
import { useSettings, BASEMAP_STYLES } from '../hooks/useSettings';
import StationPopup from './StationPopup';
import maplibregl from 'maplibre-gl';
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

export default function MapView({ stations, dataUpdatedAt }: MapViewProps) {
    const mapRef = useRef<MapRef>(null);
    const [selectedStation, setSelectedStation] = useState<StationFeature | null>(null);
    const [viewState, setViewState] = useState(MONTREAL_CENTER);
    const { t } = useLanguage();
    const { basemap } = useSettings();

    // Get the current map style based on settings
    const mapStyle = BASEMAP_STYLES[basemap];

    // Track mouse position to distinguish clicks from drags
    const mouseDownPos = useRef<{ x: number; y: number } | null>(null);

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

        // Smart pan: only adjust if popup would be cut off
        if (mapRef.current) {
            const map = mapRef.current.getMap();
            const [lng, lat] = station.geometry.coordinates;

            // Get the screen position of the clicked station
            const point = map.project([lng, lat]);
            const container = map.getContainer();
            const containerRect = container.getBoundingClientRect();

            // Popup dimensions (approximate) - popup appears ABOVE the marker (anchor="bottom")
            // The popup content is w-72 (~288px) with padding, and the height varies but ~320px
            const popupHeight = 340;
            const popupWidth = 300;
            const popupOffset = 15; // The offset prop on the Popup component
            const padding = 30; // Extra padding from edges

            // Calculate how much we need to pan (if any)
            let offsetX = 0;
            let offsetY = 0;

            // Space available above the station marker for the popup
            const spaceAbove = point.y;
            const neededAbove = popupHeight + popupOffset + padding;

            // Check if popup would be cut off at top (popup appears above the marker)
            if (spaceAbove < neededAbove) {
                // Need to pan the map down (move viewport so station is lower on screen)
                // In screen coords, we want the station at a higher Y value
                offsetY = neededAbove - spaceAbove;
            }

            // Check if popup would be cut off at left
            const spaceLeft = point.x;
            const neededLeft = popupWidth / 2 + padding;
            if (spaceLeft < neededLeft) {
                offsetX = neededLeft - spaceLeft;
            }

            // Check if popup would be cut off at right
            const spaceRight = containerRect.width - point.x;
            const neededRight = popupWidth / 2 + padding;
            if (spaceRight < neededRight) {
                offsetX = -(neededRight - spaceRight);
            }

            // Only pan if needed - move the map center so the station ends up at the right position
            if (offsetX !== 0 || offsetY !== 0) {
                // Calculate where the new center should be by offsetting the current center
                const currentCenter = map.getCenter();
                const currentCenterScreen = map.project([currentCenter.lng, currentCenter.lat]);
                const newCenterScreen = {
                    x: currentCenterScreen.x - offsetX,
                    y: currentCenterScreen.y - offsetY
                };
                const newCenter = map.unproject([newCenterScreen.x, newCenterScreen.y]);

                map.easeTo({
                    center: newCenter,
                    duration: 300,
                });
            }
        }
    }, []);

    const handlePopupClose = useCallback(() => {
        setSelectedStation(null);
    }, []);

    // Track mouse position on mousedown to detect drags vs clicks
    const handleMouseDown = useCallback((e: maplibregl.MapMouseEvent) => {
        mouseDownPos.current = { x: e.point.x, y: e.point.y };
    }, []);

    // Close popup on click (but not on drag)
    const handleMapClick = useCallback((e: maplibregl.MapMouseEvent) => {
        // Check if this was a drag (mouse moved significantly)
        if (mouseDownPos.current) {
            const dx = Math.abs(e.point.x - mouseDownPos.current.x);
            const dy = Math.abs(e.point.y - mouseDownPos.current.y);
            // If mouse moved more than 5px, it's a drag, not a click
            if (dx > 5 || dy > 5) {
                mouseDownPos.current = null;
                return;
            }
        }
        mouseDownPos.current = null;

        // Close popup if clicking away from any marker
        if (selectedStation) {
            setSelectedStation(null);
        }
    }, [selectedStation]);

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
            ref={mapRef}
            {...viewState}
            onMove={(evt) => setViewState(evt.viewState)}
            onMouseDown={handleMouseDown}
            onClick={handleMapClick}
            style={{ width: '100%', height: '100%' }}
            mapStyle={mapStyle}
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

            {/* Availability Legend */}
            <div className="absolute bottom-12 left-4 bg-white rounded-xl p-4 shadow-lg border border-slate-200 z-50">
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

            {/* CycloSM Legend - only shown when CycloSM basemap is active */}
            {basemap === 'cyclosm' && (
                <div className="absolute bottom-12 right-14 bg-white rounded-xl p-4 shadow-lg border border-slate-200 z-50">
                    <h4 className="text-xs font-semibold text-slate-700 uppercase tracking-wider mb-3">
                        {t('cyclingInfrastructure')}
                    </h4>
                    <div className="space-y-2">
                        <div className="flex items-center gap-2">
                            <div className="w-6 h-1 rounded" style={{ backgroundColor: '#0000ff' }} />
                            <span className="text-xs text-slate-600">{t('cycleway')}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-6 h-1 rounded" style={{ backgroundColor: '#5555ff' }} />
                            <span className="text-xs text-slate-600">{t('cycleTrack')}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-6 h-0.5 rounded" style={{ backgroundColor: '#0000ff', border: '1px dashed #0000ff' }} />
                            <span className="text-xs text-slate-600">{t('cycleLane')}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-6 h-0.5 rounded" style={{ backgroundColor: '#8888ff' }} />
                            <span className="text-xs text-slate-600">{t('sharedLane')}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-6 h-1.5 rounded opacity-60" style={{ backgroundColor: '#aa00ff' }} />
                            <span className="text-xs text-slate-600">{t('bikeRoute')}</span>
                        </div>
                    </div>
                    <a
                        href="https://www.cyclosm.org/legend.html"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-3 block text-xs text-blue-600 hover:text-blue-800 hover:underline"
                    >
                        {t('fullLegend')} →
                    </a>
                </div>
            )}
        </Map>
    );
}
