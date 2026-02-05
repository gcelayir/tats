'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';

export default function ServiceDetailPage() {
    const router = useRouter();

    useEffect(() => {
        // Dinamik route'lar static export'ta çalışmadığı için ana sayfaya yönlendir
        router.push('/admin/services');
    }, [router]);

    return (
        <div className="flex items-center justify-center min-h-64">
            <div className="flex items-center gap-3 text-slate-400">
                <Loader2 className="w-6 h-6 animate-spin" />
                <span>Yönlendiriliyor...</span>
            </div>
        </div>
    );
}