import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { BrowserRouter } from 'react-router-dom'
import { LanguageProvider } from './hooks/useLanguage'
import maplibregl from 'maplibre-gl'
import { Protocol } from 'pmtiles'
import './index.css'
import App from './App.tsx'

// Register PMTiles protocol for MapLibre
const protocol = new Protocol()
maplibregl.addProtocol('pmtiles', protocol.tile)

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            refetchInterval: 180000, // Refetch every 3 minutes
            staleTime: 60000,
        },
    },
})

// Get base path for router (matches vite.config.ts base)
const basename = import.meta.env.PROD ? '/bixi-dashboard' : '';

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <BrowserRouter basename={basename}>
            <QueryClientProvider client={queryClient}>
                <LanguageProvider>
                    <App />
                </LanguageProvider>
            </QueryClientProvider>
        </BrowserRouter>
    </StrictMode>,
)
