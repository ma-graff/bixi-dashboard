import { useQuery } from '@tanstack/react-query';
import type { StationsResponse } from '../types/station';

// API base URL - uses environment variable in production, relative path in development
const API_BASE_URL = import.meta.env.VITE_API_URL || '';

async function fetchStations(): Promise<StationsResponse> {
    const response = await fetch(`${API_BASE_URL}/api/v1/stations`);
    if (!response.ok) {
        throw new Error('Failed to fetch station data');
    }
    return response.json();
}

export function useStations() {
    return useQuery({
        queryKey: ['stations'],
        queryFn: fetchStations,
    });
}
