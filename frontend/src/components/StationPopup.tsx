import type { StationProperties } from '../types/station';
import { useLanguage } from '../hooks/useLanguage';

interface StationPopupProps {
    station: StationProperties;
}

export default function StationPopup({ station }: StationPopupProps) {
    const { t } = useLanguage();

    const availabilityColors: Record<string, string> = {
        high: 'bg-green-100 text-green-800 border-green-200',
        medium: 'bg-amber-100 text-amber-800 border-amber-200',
        low: 'bg-orange-100 text-orange-800 border-orange-200',
        empty: 'bg-red-100 text-red-800 border-red-200',
        unknown: 'bg-slate-100 text-slate-800 border-slate-200',
    };

    const getAvailabilityLabel = (status: string) => {
        switch (status) {
            case 'high': return t('highAvailability');
            case 'medium': return t('moderate');
            case 'low': return t('lowAvailability');
            case 'empty': return t('empty');
            default: return t('unknown');
        }
    };

    const formatLastReported = (timestamp: number | null) => {
        if (!timestamp) return t('unknown');
        const date = new Date(timestamp * 1000);
        return date.toLocaleTimeString('en-CA', {
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    const capacityPercent = station.capacity > 0
        ? Math.round((station.bikes_available / station.capacity) * 100)
        : 0;

    return (
        <div className="p-4 w-72">
            {/* Header */}
            <div className="mb-3 pb-3 border-b border-slate-200">
                <h3 className="text-base font-semibold text-slate-900 leading-tight mb-1">
                    {station.name}
                </h3>
                <div className="flex items-center justify-between">
                    <span className="text-xs text-slate-500">{t('stationId')}: {station.short_name}</span>
                    <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium border ${availabilityColors[station.availability_status]}`}>
                        <span
                            className="w-1.5 h-1.5 rounded-full"
                            style={{ backgroundColor: station.marker_color }}
                        />
                        {getAvailabilityLabel(station.availability_status)}
                    </span>
                </div>
            </div>

            {/* Bike Counts */}
            <div className="grid grid-cols-3 gap-2 mb-3">
                <div className="bg-slate-50 rounded-lg p-2 text-center border border-slate-100">
                    <div className="text-lg font-bold text-slate-900">{station.classic_bikes}</div>
                    <div className="text-[10px] text-slate-500 uppercase tracking-wide">{t('classic')}</div>
                </div>
                <div className="bg-slate-50 rounded-lg p-2 text-center border border-slate-100">
                    <div className="text-lg font-bold text-slate-900">{station.ebikes_available}</div>
                    <div className="text-[10px] text-slate-500 uppercase tracking-wide">{t('ebikes')}</div>
                </div>
                <div className="bg-slate-50 rounded-lg p-2 text-center border border-slate-100">
                    <div className="text-lg font-bold text-slate-900">{station.docks_available}</div>
                    <div className="text-[10px] text-slate-500 uppercase tracking-wide">{t('docks')}</div>
                </div>
            </div>

            {/* Capacity Bar */}
            <div className="mb-3">
                <div className="flex justify-between text-xs text-slate-600 mb-1">
                    <span>{t('capacity')}</span>
                    <span className="font-medium">{station.bikes_available} / {station.capacity} ({capacityPercent}%)</span>
                </div>
                <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div
                        className="h-full rounded-full transition-all duration-300"
                        style={{
                            width: `${Math.min(100, capacityPercent)}%`,
                            backgroundColor: station.marker_color
                        }}
                    />
                </div>
            </div>

            {/* Station Status */}
            <div className="grid grid-cols-2 gap-2 mb-3 text-xs">
                <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${station.is_installed ? 'bg-green-500' : 'bg-red-500'}`} />
                    <span className="text-slate-600">{station.is_installed ? t('installed') : t('notInstalled')}</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${station.is_renting ? 'bg-green-500' : 'bg-red-500'}`} />
                    <span className="text-slate-600">{station.is_renting ? t('renting') : t('notRenting')}</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${station.is_returning ? 'bg-green-500' : 'bg-red-500'}`} />
                    <span className="text-slate-600">{station.is_returning ? t('returning') : t('noReturns')}</span>
                </div>
                {station.is_charging && (
                    <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-blue-500" />
                        <span className="text-slate-600">{t('chargingStation')}</span>
                    </div>
                )}
            </div>

            {/* Additional Info */}
            <div className="pt-3 border-t border-slate-200 text-xs text-slate-500 space-y-1">
                <div className="flex justify-between">
                    <span>{t('totalBikes')}</span>
                    <span className="font-medium text-slate-700">{station.bikes_available}</span>
                </div>
                <div className="flex justify-between">
                    <span>{t('stationCapacity')}</span>
                    <span className="font-medium text-slate-700">{station.capacity}</span>
                </div>
                <div className="flex justify-between">
                    <span>{t('lastReported')}</span>
                    <span className="font-medium text-slate-700">{formatLastReported(station.last_reported)}</span>
                </div>
            </div>
        </div>
    );
}
