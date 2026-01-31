import { createContext, useContext, useState, ReactNode } from 'react';

export type BasemapType = 'cyclosm' | 'openfreemap';

interface SettingsContextType {
    basemap: BasemapType;
    setBasemap: (basemap: BasemapType) => void;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

const STORAGE_KEY = 'bixi-settings';

interface StoredSettings {
    basemap: BasemapType;
}

function loadSettings(): StoredSettings {
    try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
            const parsed = JSON.parse(stored);
            return {
                basemap: parsed.basemap || 'cyclosm',
            };
        }
    } catch (e) {
        console.warn('Failed to load settings from localStorage:', e);
    }
    return { basemap: 'cyclosm' };
}

function saveSettings(settings: StoredSettings) {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
    } catch (e) {
        console.warn('Failed to save settings to localStorage:', e);
    }
}

export function SettingsProvider({ children }: { children: ReactNode }) {
    const [basemap, setBasemapState] = useState<BasemapType>(() => loadSettings().basemap);

    const setBasemap = (newBasemap: BasemapType) => {
        setBasemapState(newBasemap);
        saveSettings({ basemap: newBasemap });
    };

    return (
        <SettingsContext.Provider value={{ basemap, setBasemap }}>
            {children}
        </SettingsContext.Provider>
    );
}

export function useSettings() {
    const context = useContext(SettingsContext);
    if (!context) {
        throw new Error('useSettings must be used within a SettingsProvider');
    }
    return context;
}

// Map style definitions
export const BASEMAP_STYLES = {
    cyclosm: {
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
    },
    openfreemap: {
        version: 8 as const,
        sources: {
            openfreemap: {
                type: 'raster' as const,
                tiles: [
                    'https://a.tile.openstreetmap.org/{z}/{x}/{y}.png',
                    'https://b.tile.openstreetmap.org/{z}/{x}/{y}.png',
                    'https://c.tile.openstreetmap.org/{z}/{x}/{y}.png',
                ],
                tileSize: 256,
                attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
            },
        },
        layers: [
            {
                id: 'openfreemap-tiles',
                type: 'raster' as const,
                source: 'openfreemap',
                minzoom: 0,
                maxzoom: 19,
            },
        ],
    },
};
