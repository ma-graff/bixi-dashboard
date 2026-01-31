import { useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { useStations } from './hooks/useStations';
import { useLanguage } from './hooks/useLanguage';
import MapView from './components/MapView';
import Header from './components/Header';
import LoadingOverlay from './components/LoadingOverlay';
import PastDataPage from './pages/PastDataPage';

// Set document title based on current route
function useDocumentTitle() {
    const location = useLocation();
    useEffect(() => {
        if (location.pathname === '/past-data') {
            document.title = 'BIXI Dashboard - Past Data';
        } else {
            document.title = 'BIXI Dashboard - Realtime';
        }
    }, [location.pathname]);
}

function DashboardPage() {
    const { data, isLoading, error, dataUpdatedAt } = useStations();
    const { t } = useLanguage();

    return (
        <main className="flex-1 relative">
            {isLoading && !data && <LoadingOverlay />}

            {error && (
                <div className="absolute inset-0 flex items-center justify-center bg-slate-50/90 z-50">
                    <div className="bg-white rounded-xl p-8 max-w-md text-center shadow-lg border border-slate-200">
                        <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-red-100 flex items-center justify-center">
                            <svg className="w-6 h-6 text-red-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                            </svg>
                        </div>
                        <div className="text-red-800 text-lg font-semibold mb-2">{t('connectionError')}</div>
                        <p className="text-slate-600">
                            {t('errorText')}
                        </p>
                    </div>
                </div>
            )}

            <MapView
                stations={data?.features || []}
                dataUpdatedAt={dataUpdatedAt}
            />
        </main>
    );
}

function App() {
    useDocumentTitle();
    const { data, isLoading } = useStations();

    return (
        <div className="flex flex-col h-screen bg-slate-50">
            <Header
                stats={data?.metadata.stats}
                lastUpdated={data?.metadata.last_updated}
                isLoading={isLoading}
            />

            <Routes>
                <Route path="/" element={<DashboardPage />} />
                <Route path="/past-data" element={<PastDataPage />} />
            </Routes>
        </div>
    );
}

export default App;
