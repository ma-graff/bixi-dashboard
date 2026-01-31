import { Link, useLocation } from 'react-router-dom';
import type { SystemStats } from '../types/station';
import { useLanguage } from '../hooks/useLanguage';
import LanguageSwitcher from './LanguageSwitcher';
import AboutModal from './AboutModal';
import SettingsModal from './SettingsModal';

interface HeaderProps {
    stats?: SystemStats;
    lastUpdated?: string | null;
    isLoading: boolean;
}

export default function Header({ stats, lastUpdated, isLoading }: HeaderProps) {
    const { t } = useLanguage();
    const location = useLocation();

    const formatTime = (isoString: string) => {
        const date = new Date(isoString);
        return date.toLocaleTimeString('en-CA', {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        });
    };

    const isActive = (path: string) => location.pathname === path;

    return (
        <header className="bg-white border-b border-slate-200 px-6 py-3 z-10 shadow-sm">
            <div className="flex items-center justify-between max-w-screen-2xl mx-auto">
                {/* Logo, Title & Navigation */}
                <div className="flex items-center gap-6">
                    {/* Logo */}
                    <Link to="/" className="flex items-center gap-3">
                        <span className="text-3xl">🚲</span>
                        <div>
                            <h1 className="text-lg font-bold text-slate-900 tracking-tight">
                                {t('title')}
                            </h1>
                            <p className="text-xs text-slate-500">{t('subtitle')}</p>
                        </div>
                    </Link>

                    {/* Navigation */}
                    <nav className="flex items-center gap-1 ml-4">
                        <Link
                            to="/"
                            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${isActive('/')
                                ? 'bg-red-50 text-red-800'
                                : 'text-slate-600 hover:bg-slate-100'
                                }`}
                        >
                            {t('dashboard')}
                        </Link>
                        <Link
                            to="/past-data"
                            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${isActive('/past-data')
                                ? 'bg-red-50 text-red-800'
                                : 'text-slate-600 hover:bg-slate-100'
                                }`}
                        >
                            {t('pastData')}
                        </Link>
                    </nav>
                </div>

                {/* Stats & Controls */}
                <div className="flex items-center gap-6">
                    {/* Stats - only show on dashboard */}
                    {location.pathname === '/' && (
                        <div className="flex items-center gap-6">
                            {/* Bikes */}
                            <div className="text-center">
                                <div className="text-xl font-bold text-emerald-600">
                                    {isLoading ? '—' : stats?.total_bikes.toLocaleString()}
                                </div>
                                <div className="text-[10px] text-slate-500 uppercase tracking-wider">{t('bikes')}</div>
                            </div>

                            {/* E-Bikes */}
                            <div className="text-center">
                                <div className="text-xl font-bold text-blue-600">
                                    {isLoading ? '—' : stats?.total_ebikes.toLocaleString()}
                                </div>
                                <div className="text-[10px] text-slate-500 uppercase tracking-wider">{t('ebikes')}</div>
                            </div>

                            {/* Docks */}
                            <div className="text-center">
                                <div className="text-xl font-bold text-amber-600">
                                    {isLoading ? '—' : stats?.total_docks.toLocaleString()}
                                </div>
                                <div className="text-[10px] text-slate-500 uppercase tracking-wider">{t('docks')}</div>
                            </div>

                            {/* Stations */}
                            <div className="text-center">
                                <div className="text-xl font-bold text-slate-700">
                                    {isLoading ? '—' : stats?.station_count.toLocaleString()}
                                </div>
                                <div className="text-[10px] text-slate-500 uppercase tracking-wider">{t('stations')}</div>
                            </div>

                            {/* Divider */}
                            <div className="h-8 w-px bg-slate-200" />

                            {/* Live Status */}
                            <div className="text-right">
                                <div className="flex items-center gap-2">
                                    <div className={`w-2 h-2 rounded-full ${isLoading ? 'bg-amber-500 animate-pulse' : 'bg-green-500'}`} />
                                    <span className="text-sm text-slate-600">
                                        {isLoading ? t('updating') : t('live')}
                                    </span>
                                </div>
                                <div className="text-[10px] text-slate-400">
                                    {lastUpdated ? `${t('updated')}: ${formatTime(lastUpdated)}` : t('connecting')}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Divider */}
                    <div className="h-8 w-px bg-slate-200" />

                    {/* Controls */}
                    <div className="flex items-center gap-2">
                        <LanguageSwitcher />
                        <SettingsModal />
                        <AboutModal />
                    </div>
                </div>
            </div>
        </header>
    );
}
