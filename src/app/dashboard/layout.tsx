'use client';
import Link from 'next/link';
import { User, Key, LogOut, Home } from 'lucide-react';
import { usePathname } from 'next/navigation';
import SignOutButton from '@/components/sign-out-button';
import AuthGuard from '@/components/auth-guard';

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();

    const navigation = [
        { name: 'Profil', href: '/dashboard', icon: User },
        // { name: 'Şifre Değiştir', href: '/dashboard/security', icon: Key }, // Şimdilik sadece profil
    ];

    return (
        <AuthGuard requireAuth={true}>
            <div className="flex min-h-screen bg-slate-950 text-slate-100">
                <aside className="w-64 border-r border-slate-800 bg-slate-950 p-4 hidden md:flex md:flex-col fixed inset-y-0 left-0">
                    <div className="flex items-center gap-2 px-4 py-4 mb-8 border-b border-slate-800/50 pb-6">
                        <div className="bg-emerald-500/10 p-2 rounded-lg">
                            <Home className="w-6 h-6 text-emerald-500" />
                        </div>
                        <span className="text-lg font-bold tracking-tight">Hesabım</span>
                    </div>

                    <nav className="flex-1 space-y-1">
                        {navigation.map((item) => {
                            const isActive = pathname === item.href;
                            return (
                                <Link
                                    key={item.name}
                                    href={item.href}
                                    className={`flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg transition-all ${isActive
                                        ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20'
                                        : 'text-slate-400 hover:text-slate-100 hover:bg-slate-900 border border-transparent'
                                        }`}
                                >
                                    <item.icon className="w-5 h-5" />
                                    {item.name}
                                </Link>
                            );
                        })}
                    </nav>

                    <div className="border-t border-slate-800 pt-4 mt-auto">
                        <SignOutButton />
                    </div>
                </aside>

                <main className="flex-1 md:pl-64">
                    <div className="p-4 md:p-8 max-w-4xl mx-auto">
                        {children}
                    </div>
                </main>
            </div>
        </AuthGuard>
    );
}
