import { useLanguage } from '../hooks/useLanguage';

export default function LoadingOverlay() {
    const { t } = useLanguage();

    return (
        <div className="absolute inset-0 flex items-center justify-center bg-slate-50 z-50">
            <div className="text-center">
                <div className="relative w-16 h-16 mx-auto mb-6">
                    {/* Outer ring */}
                    <div className="absolute inset-0 border-4 border-slate-200 rounded-full" />
                    {/* Spinning ring */}
                    <div className="absolute inset-0 border-4 border-transparent border-t-red-800 rounded-full animate-spin" />
                    {/* Inner icon */}
                    <div className="absolute inset-0 flex items-center justify-center">
                        <svg className="w-6 h-6 text-red-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <circle cx="12" cy="12" r="10" strokeWidth="2" />
                            <circle cx="12" cy="12" r="3" strokeWidth="2" />
                        </svg>
                    </div>
                </div>
                <h2 className="text-lg font-semibold text-slate-800 mb-2">{t('loadingTitle')}</h2>
                <p className="text-slate-500">{t('loadingText')}</p>
            </div>
        </div>
    );
}
