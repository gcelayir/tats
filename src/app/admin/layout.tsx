'use client';
import Link from 'next/link';
import { Users, Settings, LogOut, LayoutDashboard, Menu, X, Wrench, Shield } from 'lucide-react';
import { usePathname } from 'next/navigation';
import SignOutButton from '@/components/sign-out-button';
import AuthGuard from '@/components/auth-guard';
import { useState } from 'react';

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const navigation = [
        { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
        { name: 'Servisler', href: '/admin/services', icon: Wrench },
        { name: 'Müşteriler', href: '/admin/customers', icon: Users },
        { name: 'Kullanıcılar', href: '/admin/users', icon: Shield },
        { name: 'Ayarlar', href: '/admin/settings', icon: Settings },
    ];

    return (
        <AuthGuard requireAuth={true} requireAdmin={true}>
            <div className="min-h-screen bg-slate-950">
                {/* Mobile sidebar overlay */}
                {sidebarOpen && (
                    <div className="fixed inset-0 z-40 lg:hidden">
                        <div className="fixed inset-0 bg-slate-900/80" onClick={() => setSidebarOpen(false)} />
                        <div className="fixed inset-y-0 left-0 z-50 w-64 bg-slate-900 border-r border-slate-800">
                            <div className="flex items-center justify-between h-16 px-4 border-b border-slate-800">
                                <h1 className="text-xl font-bold text-slate-100">TATS Admin</h1>
                                <button
                                    onClick={() => setSidebarOpen(false)}
                                    className="p-2 rounded-lg text-slate-400 hover:text-slate-100 hover:bg-slate-800"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>
                            <nav className="mt-4 px-4 space-y-2">
                                {navigation.map((item) => {
                                    const isActive = pathname === item.href;
                                    return (
                                        <Link
                                            key={item.name}
                                            href={item.href}
                                            onClick={() => setSidebarOpen(false)}
                                            className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                                                isActive
                                                    ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                                                    : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800'
                                            }`}
                                        >
                                            <item.icon className="w-5 h-5" />
                                            {item.name}
                                        </Link>
                                    );
                                })}
                            </nav>
                            <div className="absolute bottom-4 left-4 right-4">
                                <SignOutButton />
                            </div>
                        </div>
                    </div>
                )}

                {/* Desktop sidebar */}
                <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col">
                    <div className="flex flex-col flex-grow bg-slate-900 border-r border-slate-800">
                        <div className="flex items-center h-16 px-4 border-b border-slate-800">
                            <h1 className="text-xl font-bold text-slate-100">TATS Admin</h1>
                        </div>
                        <nav className="mt-4 flex-1 px-4 space-y-2">
                            {navigation.map((item) => {
                                const isActive = pathname === item.href;
                                return (
                                    <Link
                                        key={item.name}
                                        href={item.href}
                                        className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                                            isActive
                                                ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                                                : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800'
                                        }`}
                                    >
                                        <item.icon className="w-5 h-5" />
                                        {item.name}
                                    </Link>
                                );
                            })}
                        </nav>
                        <div className="p-4 border-t border-slate-800">
                            <SignOutButton />
                        </div>
                    </div>
                </div>

                {/* Main content */}
                <div className="lg:pl-64">
                    {/* Mobile header */}
                    <div className="lg:hidden flex items-center justify-between h-16 px-4 bg-slate-900 border-b border-slate-800">
                        <button
                            onClick={() => setSidebarOpen(true)}
                            className="p-2 rounded-lg text-slate-400 hover:text-slate-100 hover:bg-slate-800"
                        >
                            <Menu className="w-5 h-5" />
                        </button>
                        <h1 className="text-lg font-semibold text-slate-100">TATS Admin</h1>
                        <div className="w-9" /> {/* Spacer */}
                    </div>

                    {/* Page content */}
                    <main className="p-4 lg:p-8">
                        {children}
                    </main>
                </div>
            </div>
        </AuthGuard>
    );
}