'use client';

import { useState, useEffect } from 'react';
import { CheckCircle, AlertCircle, XCircle, Info, X } from 'lucide-react';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

interface Toast {
    id: string;
    message: string;
    type: ToastType;
}

let toastId = 0;
const listeners: Set<(toast: Toast) => void> = new Set();

export function showToast(message: string, type: ToastType = 'info', duration = 4000) {
    const id = `toast-${++toastId}`;
    const toast: Toast = { id, message, type };
    
    listeners.forEach(listener => listener(toast));
    
    if (duration > 0) {
        setTimeout(() => {
            removeToast(id);
        }, duration);
    }
    
    return id;
}

export function removeToast(id: string) {
    listeners.forEach(listener => listener({ id, message: '', type: 'info' }));
}

export function ToastContainer() {
    const [toasts, setToasts] = useState<Toast[]>([]);

    useEffect(() => {
        const handleToast = (toast: Toast) => {
            if (toast.message === '') {
                setToasts(prev => prev.filter(t => t.id !== toast.id));
            } else {
                setToasts(prev => {
                    const exists = prev.find(t => t.id === toast.id);
                    if (exists) return prev;
                    return [...prev, toast];
                });
            }
        };

        listeners.add(handleToast);
        return () => {
            listeners.delete(handleToast);
        };
    }, []);

    return (
        <div className="fixed bottom-4 right-4 z-50 space-y-3 pointer-events-none">
            {toasts.map(toast => (
                <Toast key={toast.id} toast={toast} onClose={() => removeToast(toast.id)} />
            ))}
        </div>
    );
}

function Toast({ toast, onClose }: { toast: Toast; onClose: () => void }) {
    const icons = {
        success: <CheckCircle className="w-5 h-5 text-emerald-400" />,
        error: <XCircle className="w-5 h-5 text-red-400" />,
        warning: <AlertCircle className="w-5 h-5 text-yellow-400" />,
        info: <Info className="w-5 h-5 text-blue-400" />,
    };

    const bgColors = {
        success: 'bg-emerald-950/80 border-emerald-900/50',
        error: 'bg-red-950/80 border-red-900/50',
        warning: 'bg-yellow-950/80 border-yellow-900/50',
        info: 'bg-blue-950/80 border-blue-900/50',
    };

    const textColors = {
        success: 'text-emerald-200',
        error: 'text-red-200',
        warning: 'text-yellow-200',
        info: 'text-blue-200',
    };

    return (
        <div
            className={`${bgColors[toast.type]} border rounded-lg p-4 flex items-start gap-3 backdrop-blur-sm pointer-events-auto animate-in fade-in slide-in-from-right-4 duration-300`}
        >
            {icons[toast.type]}
            <div className="flex-1">
                <p className={`text-sm font-medium ${textColors[toast.type]}`}>
                    {toast.message}
                </p>
            </div>
            <button
                onClick={onClose}
                className="text-slate-400 hover:text-slate-200 transition-colors shrink-0"
            >
                <X className="w-4 h-4" />
            </button>
        </div>
    );
}
