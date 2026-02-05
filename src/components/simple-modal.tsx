'use client';

import { useState } from 'react';
import { AlertTriangle, X } from 'lucide-react';

interface SimpleModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
}

export function SimpleModal({ 
    isOpen, 
    onClose, 
    onConfirm, 
    title, 
    message, 
    confirmText = 'Sil', 
    cancelText = 'İptal' 
}: SimpleModalProps) {
    if (!isOpen) return null;

    const handleConfirm = () => {
        onConfirm();
        onClose();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
            <div className="bg-slate-900 rounded-2xl max-w-sm w-full mx-4 shadow-2xl border border-slate-800">
                {/* Icon */}
                <div className="flex justify-center pt-8">
                    <div className="bg-red-500/20 p-4 rounded-full">
                        <AlertTriangle className="text-red-400 w-12 h-12" />
                    </div>
                </div>

                {/* Content */}
                <div className="px-8 py-6 text-center">
                    <h2 className="text-2xl font-bold text-slate-100 mb-3">{title}</h2>
                    <p className="text-slate-400 text-sm leading-relaxed">{message}</p>
                </div>

                {/* Buttons */}
                <div className="flex gap-3 px-8 pb-8 justify-center">
                    <button
                        onClick={onClose}
                        className="px-6 py-2.5 rounded-lg text-sm font-semibold text-slate-300 bg-slate-800 hover:bg-slate-700 transition-all duration-200 border border-slate-700"
                    >
                        {cancelText}
                    </button>
                    <button
                        onClick={handleConfirm}
                        className="px-6 py-2.5 rounded-lg text-sm font-semibold text-white bg-red-600 hover:bg-red-700 transition-all duration-200 shadow-lg shadow-red-900/30"
                    >
                        {confirmText}
                    </button>
                </div>
            </div>
        </div>
    );
}