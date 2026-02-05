'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import { Lock, Mail, Key, Loader2 } from 'lucide-react';
import Link from 'next/link';

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    useEffect(() => {
        // Sayfa yüklendiğinde önceki session'ı temizle
        const clearSession = async () => {
            await supabase.auth.signOut();
        };
        clearSession();
    }, []);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const { error } = await supabase.auth.signInWithPassword({
                email,
                password,
            });

            if (error) {
                throw error;
            }

            // Kullanıcı bilgisini al
            const { data: { user } } = await supabase.auth.getUser();
            
            if (user) {
                // Profil bilgisini al (rol bilgisi burada)
                const { data: profile } = await supabase
                    .from('profiles')
                    .select('role')
                    .eq('id', user.id)
                    .single();

                // Rolüne göre yönlendir
                if (profile?.role === 'admin') {
                    router.push('/admin');
                } else {
                    router.push('/dashboard');
                }
            }
            
            router.refresh();
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-slate-950 px-4">
            <div className="w-full max-w-sm space-y-8">
                <div className="text-center">
                    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-slate-900 border border-slate-800">
                        <Lock className="h-6 w-6 text-emerald-500" />
                    </div>
                    <h2 className="mt-6 text-3xl font-bold tracking-tight text-slate-100">
                        Giriş Yap
                    </h2>
                    <p className="mt-2 text-sm text-slate-400">
                        Yönetim paneline erişmek için bilgilerinizi girin.
                    </p>
                </div>

                <form onSubmit={handleLogin} className="mt-8 space-y-6">
                    <div className="space-y-4 rounded-md shadow-sm">
                        <div>
                            <label htmlFor="email" className="sr-only">Email</label>
                            <div className="relative">
                                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                                    <Mail className="h-5 w-5 text-slate-500" />
                                </div>
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    required
                                    className="block w-full rounded-lg border border-slate-800 bg-slate-900/50 py-3 pl-10 text-slate-100 placeholder:text-slate-500 focus:border-emerald-500 focus:ring-emerald-500 sm:text-sm transition-all focus:bg-slate-900"
                                    placeholder="ornek@sirket.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>
                        </div>
                        <div>
                            <label htmlFor="password" className="sr-only">Şifre</label>
                            <div className="relative">
                                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                                    <Key className="h-5 w-5 text-slate-500" />
                                </div>
                                <input
                                    id="password"
                                    name="password"
                                    type="password"
                                    required
                                    className="block w-full rounded-lg border border-slate-800 bg-slate-900/50 py-3 pl-10 text-slate-100 placeholder:text-slate-500 focus:border-emerald-500 focus:ring-emerald-500 sm:text-sm transition-all focus:bg-slate-900"
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                            </div>
                        </div>
                    </div>

                    {error && (
                        <div className="rounded-md bg-red-950/30 p-4 border border-red-900/50">
                            <div className="flex">
                                <div className="text-sm text-red-400">
                                    {error}
                                </div>
                            </div>
                        </div>
                    )}

                    <div>
                        <button
                            type="submit"
                            disabled={loading}
                            className="group relative flex w-full justify-center rounded-lg border border-transparent bg-emerald-600 py-3 px-4 text-sm font-medium text-white hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 focus:ring-offset-slate-950 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-emerald-900/20"
                        >
                            {loading ? (
                                <Loader2 className="h-5 w-5 animate-spin" />
                            ) : (
                                "Giriş Yap"
                            )}
                        </button>
                    </div>

                    <div className="text-center">
                        <Link href="/" className="text-sm font-medium text-slate-500 hover:text-emerald-500 transition-colors">
                            ← Ana Sayfa
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    );
}
