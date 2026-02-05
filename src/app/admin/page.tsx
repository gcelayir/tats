'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Users, Wrench, Calendar, TrendingUp, BarChart3, Activity, Loader2 } from 'lucide-react';

export default function AdminDashboard() {
    const [stats, setStats] = useState({
        totalCustomers: 0,
        totalServices: 0,
        completedServices: 0,
        activeServices: 0
    });
    const [recentServices, setRecentServices] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [
                { count: totalCustomers },
                { count: totalServices },
                { count: completedServices },
                { count: activeServices }
            ] = await Promise.all([
                supabase.from('customers').select('*', { count: 'exact', head: true }),
                supabase.from('services').select('*', { count: 'exact', head: true }),
                supabase.from('services').select('*, service_stages!inner(name)', { count: 'exact', head: true }).eq('service_stages.name', 'Kapanış'),
                supabase.from('services').select('*, service_stages!inner(name)', { count: 'exact', head: true }).neq('service_stages.name', 'Kapanış')
            ]);

            setStats({
                totalCustomers: totalCustomers || 0,
                totalServices: totalServices || 0,
                completedServices: completedServices || 0,
                activeServices: activeServices || 0
            });

            const { data: servicesData } = await supabase
                .from('services')
                .select(`
                    *,
                    customers (full_name),
                    service_types (name),
                    service_stages (name)
                `)
                .order('created_at', { ascending: false })
                .limit(5);

            setRecentServices(servicesData || []);
        } catch (error) {
            console.error('Error fetching dashboard data:', error);
        } finally {
            setLoading(false);
        }
    };

    const statsCards = [
        {
            name: 'Toplam Müşteri',
            value: stats.totalCustomers,
            icon: Users,
            color: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
            iconBg: 'bg-blue-500/20'
        },
        {
            name: 'Toplam Servis',
            value: stats.totalServices,
            icon: Wrench,
            color: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
            iconBg: 'bg-emerald-500/20'
        },
        {
            name: 'Tamamlanan Servis',
            value: stats.completedServices,
            icon: TrendingUp,
            color: 'bg-green-500/10 text-green-400 border-green-500/20',
            iconBg: 'bg-green-500/20'
        },
        {
            name: 'Aktif Servis',
            value: stats.activeServices,
            icon: Activity,
            color: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
            iconBg: 'bg-yellow-500/20'
        }
    ];

    const getStatusColor = (stageName: string, completionCompletedAt: string | null, isCancelled: boolean) => {
        if (isCancelled) {
            return 'bg-red-500/10 text-red-400 border-red-500/20';
        }
        
        if (stageName === 'Kapanış') {
            return completionCompletedAt 
                ? 'bg-teal-500/10 text-teal-400 border-teal-500/20'
                : 'bg-green-500/10 text-green-400 border-green-500/20';
        }
        
        const colors: any = {
            'Kayıt': 'bg-blue-500/10 text-blue-400 border-blue-500/20',
            'Tespit': 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20'
        };
        return colors[stageName] || colors['Kayıt'];
    };

    const getStatusText = (stageName: string, completionCompletedAt: string | null, isCancelled: boolean) => {
        if (isCancelled) {
            return 'İptal';
        }
        
        if (stageName === 'Kapanış') {
            return completionCompletedAt ? 'Tamamlandı' : 'Kapanış';
        }
        return stageName;
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-64">
                <div className="flex items-center gap-3 text-slate-400">
                    <Loader2 className="w-6 h-6 animate-spin" />
                    <span>Yükleniyor...</span>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div>
                <h1 className="text-3xl font-bold text-slate-100 tracking-tight">Admin Dashboard</h1>
                <p className="text-slate-400 mt-1">Sistem genel durumu ve istatistikler.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                {statsCards.map((stat) => (
                    <div key={stat.name} className="bg-slate-900/50 border border-slate-800 rounded-xl p-4 md:p-6 backdrop-blur-sm">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-slate-400">{stat.name}</p>
                                <p className="text-2xl md:text-3xl font-bold text-slate-100 mt-2">{stat.value}</p>
                            </div>
                            <div className={`p-2 md:p-3 rounded-lg ${stat.iconBg}`}>
                                <stat.icon className="w-5 h-5 md:w-6 md:h-6 text-slate-100" />
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-4 md:p-6 backdrop-blur-sm">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-lg md:text-xl font-semibold text-slate-100">Son Servisler</h2>
                    <BarChart3 className="w-5 h-5 text-slate-400" />
                </div>

                {recentServices && recentServices.length > 0 ? (
                    <div className="space-y-3 md:space-y-4">
                        {recentServices.map((service) => (
                            <div key={service.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-3 md:p-4 bg-slate-950/50 rounded-lg border border-slate-800 gap-3 sm:gap-4">
                                <div className="flex items-center gap-3 md:gap-4">
                                    <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-blue-500/10 flex items-center justify-center border border-blue-500/20 flex-shrink-0">
                                        <Wrench className="w-4 h-4 md:w-5 md:h-5 text-blue-400" />
                                    </div>
                                    <div className="min-w-0">
                                        <p className="font-medium text-slate-200 truncate">{service.customers?.full_name}</p>
                                        <p className="text-sm text-slate-400 truncate">{service.service_types?.name}</p>
                                    </div>
                                </div>
                                <div className="flex items-center justify-between sm:justify-end gap-3 sm:gap-3">
                                    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${getStatusColor(service.service_stages?.name, service.completion_completed_at, service.is_cancelled)}`}>
                                        {getStatusText(service.service_stages?.name, service.completion_completed_at, service.is_cancelled)}
                                    </span>
                                    <div className="flex items-center gap-1 text-xs text-slate-500 flex-shrink-0">
                                        <Calendar className="w-3 h-3" />
                                        <span className="hidden sm:inline">{new Date(service.created_at).toLocaleDateString('tr-TR')}</span>
                                        <span className="sm:hidden">{new Date(service.created_at).toLocaleDateString('tr-TR', { day: '2-digit', month: '2-digit' })}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-8 text-slate-500">
                        <Wrench className="w-8 h-8 mx-auto mb-3 opacity-50" />
                        <p>Henüz servis kaydı yok.</p>
                    </div>
                )}
            </div>
        </div>
    );
}