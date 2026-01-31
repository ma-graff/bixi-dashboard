import { useLanguage } from '../hooks/useLanguage';

export default function PastDataPage() {
    const { t } = useLanguage();

    return (
        <div className="flex-1 flex items-center justify-center bg-slate-50 p-8">
            <div className="text-center max-w-md">
                <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-slate-100 flex items-center justify-center">
                    <svg className="w-10 h-10 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                </div>
                <h1 className="text-2xl font-bold text-slate-800 mb-2">{t('pastDataTitle')}</h1>
                <div className="inline-block px-4 py-1.5 rounded-full bg-amber-100 text-amber-800 text-sm font-medium mb-4">
                    {t('comingSoon')}
                </div>
                <p className="text-slate-600">
                    {t('pastDataDescription')}
                </p>
            </div>
        </div>
    );
}
