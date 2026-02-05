'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { Loader2 } from 'lucide-react';

interface AuthGuardProps {
  children: React.ReactNode;
  requireAuth?: boolean;
  requireAdmin?: boolean;
}

export default function AuthGuard({ children, requireAuth = false, requireAdmin = false }: AuthGuardProps) {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [userRole, setUserRole] = useState<string | null>(null);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    checkAuth();
  }, [pathname]);

  const checkAuth = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user) {
        setUser(user);
        
        // Kullanıcı rolünü al
        const { data: profile } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', user.id)
          .single();
        
        setUserRole(profile?.role || 'user');
        
        // Admin sayfalarında admin kontrolü
        if (requireAdmin && profile?.role !== 'admin') {
          router.push('/dashboard');
          return;
        }
        
        // Login sayfasındaysa ve giriş yapmışsa yönlendir
        if (pathname === '/login') {
          if (profile?.role === 'admin') {
            router.push('/admin');
          } else {
            router.push('/dashboard');
          }
          return;
        }
      } else {
        setUser(null);
        setUserRole(null);
        
        // Auth gereken sayfalarda login'e yönlendir
        if (requireAuth && pathname !== '/login') {
          router.push('/login');
          return;
        }
      }
    } catch (error) {
      console.error('Auth check error:', error);
      setUser(null);
      setUserRole(null);
      
      if (requireAuth && pathname !== '/login') {
        router.push('/login');
      }
    } finally {
      setLoading(false);
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="flex items-center gap-3 text-slate-400">
          <Loader2 className="w-6 h-6 animate-spin" />
          <span>Yükleniyor...</span>
        </div>
      </div>
    );
  }

  // Auth gerekli ama kullanıcı yok
  if (requireAuth && !user) {
    return null; // Router.push çalışacak
  }

  // Admin gerekli ama kullanıcı admin değil
  if (requireAdmin && userRole !== 'admin') {
    return null; // Router.push çalışacak
  }

  return <>{children}</>;
}