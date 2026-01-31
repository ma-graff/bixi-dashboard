export interface StationProperties {
    station_id: string;
    name: string;
    short_name: string;
    capacity: number;
    bikes_available: number;
    classic_bikes: number;
    ebikes_available: number;
    docks_available: number;
    is_installed: number;
    is_renting: number;
    is_returning: number;
    is_charging: boolean;
    availability_status: 'high' | 'medium' | 'low' | 'empty' | 'unknown';
    marker_color: string;
    last_reported: number | null;
}

export interface StationFeature {
    type: 'Feature';
    geometry: {
        type: 'Point';
        coordinates: [number, number]; // [longitude, latitude]
    };
    properties: StationProperties;
}

export interface SystemStats {
    total_bikes: number;
    total_ebikes: number;
    total_docks: number;
    station_count: number;
}

export interface StationsResponse {
    type: 'FeatureCollection';
    features: StationFeature[];
    metadata: {
        last_updated: string | null;
        stats: SystemStats;
    };
}
