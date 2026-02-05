'use client';

import { createContext, useContext, useState, ReactNode } from 'react';
import { AlertCircle } from 'lucide-react';

interface DialogOptions {
    title: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
    isDangerous?: boolean;
}

interface ConfirmDialogContextType {
    showDialog: (options: DialogOptions) => Promise<boolean>;
}

const ConfirmDialogContext = createContext<ConfirmDialogContextType | undefined>(undefined);

export function ConfirmDialogProvider({ children }: { children: ReactNode }) {
    const [dialog, setDialog] = useState<DialogOptions | null>(null);
    const [resolvePromise, setResolvePromise] = useState<((value: boolean) => void) | null>(null);

    const showDialog = (options: DialogOptions): Promise<boolean> => {
        return new Promise((resolve) => {
            setDialog(options);
            setResolvePromise(() => resolve);
        });
    };

    const handleConfirm = () => {
        resolvePromise?.(true);
        setDialog(null);
        setResolvePromise(null);
    };

    const handleCancel = () => {
        resolvePromise?.(false);
        setDialog(null);
        setResolvePromise(null);
    };

    if (!dialog) {
        return <>{children}</>;
    }

    const iconBgColor = dialog.isDangerous ? 'bg-red-500/20' : 'bg-yellow-500/20';
    const iconColor = dialog.isDangerous ? 'text-red-400' : 'text-yellow-400';
    const confirmBgColor = dialog.isDangerous 
        ? 'bg-red-600 hover:bg-red-700 shadow-lg shadow-red-900/30' 
        : 'bg-emerald-600 hover:bg-emerald-700 shadow-lg shadow-emerald-900/30';

    return (
        <>
            {children}
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
                <div className="bg-slate-900 rounded-2xl max-w-sm w-full mx-4 shadow-2xl animate-in zoom-in-95 duration-300 overflow-hidden">
                    {/* Icon Container */}
                    <div className="flex justify-center pt-8">
                        <div className={`${iconBgColor} p-4 rounded-full animate-in bounce-in duration-500`}>
                            <AlertCircle className={`${iconColor} w-12 h-12`} />
                        </div>
                    </div>

                    {/* Content */}
                    <div className="px-8 py-6 text-center">
                        <h2 className="text-2xl font-bold text-slate-100 mb-3">{dialog.title}</h2>
                        <p className="text-slate-400 text-sm leading-relaxed">{dialog.message}</p>
                    </div>

                    {/* Buttons */}
                    <div className="flex gap-3 px-8 pb-8 justify-center">
                        <button
                            onClick={handleCancel}
                            className="px-6 py-2.5 rounded-lg text-sm font-semibold text-slate-300 bg-slate-800 hover:bg-slate-700 transition-all duration-200 border border-slate-700 hover:border-slate-600"
                        >
                            {dialog.cancelText || 'İptal'}
                        </button>
                        <button
                            onClick={handleConfirm}
                            className={`px-6 py-2.5 rounded-lg text-sm font-semibold text-white transition-all duration-200 ${confirmBgColor}`}
                        >
                            {dialog.confirmText || 'Onayla'}
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
}

export function useConfirmDialog() {
    const context = useContext(ConfirmDialogContext);
    if (!context) {
        throw new Error('useConfirmDialog must be used within ConfirmDialogProvider');
    }
    return context;
}

export const ConfirmDialogContext_Export = ConfirmDialogContext;
