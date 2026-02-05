'use client';

import { useState } from 'react';
import { updateProfile } from '@/lib/client-actions';
import { Loader2 } from 'lucide-react';

export default function ProfileForm({ user, profile }: { user: any, profile: any }) {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        const formData = new FormData(e.currentTarget);
        const profileData = {
            full_name: formData.get('fullName') as string,
            phone: formData.get('phone') as string,
        };

        const result = await updateProfile(profileData);
        
        if (!result.success) {
            setError(result.error || 'Bir hata oluştu');
        }
        
        setLoading(false);
    };

    return (
        <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6 backdrop-blur-sm">
            <h2 className="text-xl font-semibold text-slate-100 mb-6">Profil Bilgileri</h2>

            {error && (
                <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm">
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <label className="block text-sm font-medium text-slate-400 mb-2">E-posta</label>
                    <input 
                        type="email" 
                        value={user?.email || ''} 
                        disabled 
                        className="w-full bg-slate-950/50 border border-slate-800 rounded-lg px-4 py-2.5 text-slate-500 cursor-not-allowed" 
                    />
                    <p className="text-xs text-slate-500 mt-1">E-posta adresi değiştirilemez</p>
                </div>

                <div>
                    <label className="block text-sm font-medium text-slate-400 mb-2">Ad Soyad</label>
                    <input 
                        name="fullName"
                        type="text" 
                        defaultValue={profile?.full_name || ''} 
                        className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2.5 text-slate-100 focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50 outline-none transition-all" 
                        placeholder="Adınız ve soyadınız"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-slate-400 mb-2">Telefon</label>
                    <input 
                        name="phone"
                        type="tel" 
                        defaultValue={profile?.phone || ''} 
                        className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2.5 text-slate-100 focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50 outline-none transition-all" 
                        placeholder="05XX XXX XX XX"
                    />
                </div>

                <div className="pt-4 border-t border-slate-800 flex justify-end">
                    <button 
                        disabled={loading} 
                        type="submit" 
                        className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2.5 rounded-lg text-sm font-medium transition-all shadow-lg shadow-emerald-900/20 hover:shadow-emerald-900/40 disabled:opacity-50 flex items-center gap-2"
                    >
                        {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                        Güncelle
                    </button>
                </div>
            </form>
        </div>
    );
}