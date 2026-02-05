'use client';

import { useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';

export default function SessionManager() {
    const router = useRouter();

    useEffect(() => {
        // Sunucu yeniden başladığında logout olması için
        const checkSession = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            
            if (!session) {
                // Oturum yoksa, localStorage'ı temizle
                localStorage.removeItem('supabase.auth.token');
                return;
            }

            // Oturum süresi kontrolü (5 dakika = 300 saniye)
            const sessionTimeout = 5 * 60 * 1000; // 5 dakika
            const createdAt = session.user.user_metadata?.created_at || Date.now();
            const now = Date.now();
            
            if (now - createdAt > sessionTimeout) {
                // Oturum süresi dolmuşsa logout yap
                await supabase.auth.signOut();
                router.push('/login');
            }
        };

        checkSession();

        // Her 1 dakikada bir kontrol et
        const interval = setInterval(checkSession, 60 * 1000);

        return () => clearInterval(interval);
    }, [router]);

    return null;
}
