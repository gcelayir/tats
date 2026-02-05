'use client';

import { LogOut } from 'lucide-react';
import { signOut } from '@/lib/client-actions';
import { useRouter } from 'next/navigation';

export default function SignOutButton() {
    const router = useRouter();

    const handleSignOut = async () => {
        const result = await signOut();
        if (result.success) {
            router.push('/login');
        }
    };

    return (
        <button
            onClick={handleSignOut}
            className="flex w-full items-center gap-3 px-4 py-3 text-sm font-medium text-slate-400 hover:text-red-400 hover:bg-red-950/20 rounded-lg transition-colors border border-transparent hover:border-red-900/30">
            <LogOut className="w-5 h-5" />
            Çıkış Yap
        </button>
    );
}
