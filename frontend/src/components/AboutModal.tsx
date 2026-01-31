import { useState } from 'react';
import { useLanguage } from '../hooks/useLanguage';

export default function AboutModal() {
    const [isOpen, setIsOpen] = useState(false);
    const { t } = useLanguage();

    return (
        <>
            {/* Trigger Button */}
            <button
                onClick={() => setIsOpen(true)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-600 hover:text-slate-800 transition-colors"
                title={t('about')}
            >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            </button>

            {/* Modal Overlay */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/30 flex items-center justify-center z-50 p-4"
                    onClick={() => setIsOpen(false)}
                >
                    <div
                        className="bg-white rounded-xl shadow-2xl max-w-sm w-full p-6"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="flex items-start justify-between mb-4">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-red-700 to-red-900 flex items-center justify-center">
                                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <circle cx="12" cy="12" r="10" strokeWidth="2" />
                                        <circle cx="12" cy="12" r="3" strokeWidth="2" />
                                    </svg>
                                </div>
                                <h2 className="text-lg font-semibold text-slate-900">{t('aboutTitle')}</h2>
                            </div>
                            <button
                                onClick={() => setIsOpen(false)}
                                className="text-slate-400 hover:text-slate-600 transition-colors"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                        <p className="text-slate-600 text-sm leading-relaxed mb-4">
                            {t('aboutText')}
                        </p>
                        <button
                            onClick={() => setIsOpen(false)}
                            className="w-full py-2 px-4 bg-red-800 hover:bg-red-900 text-white rounded-lg font-medium transition-colors"
                        >
                            {t('close')}
                        </button>
                    </div>
                </div>
            )}
        </>
    );
}
