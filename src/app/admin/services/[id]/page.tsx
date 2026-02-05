'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Loader2, Calendar, User, Package } from 'lucide-react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { showToast } from '@/components/toast';

export default function ServiceDetailPage() {
    const params = useParams();
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [service, setService] = useState<any>(null);
    const [customer, setCustomer] = useState<any>(null);

    useEffect(() => {
        if (params?.id) {
            fetchService(params.id as string);
        }
    }, [params?.id]);

    const fetchService = async (id: string) => {
        try {
            const { data, error } = await supabase
                .from('services')
                .select(`
                    *,
                    customers (*)
                `)
                .eq('id', id)
                .single();

            if (error) throw error;

            setService(data);
            setCustomer(data.customers);
        } catch (error) {
            console.error('Error fetching service:', error);
            showToast('Servis yüklenirken hata oluştu', 'error');
            router.push('/admin/services');
        } finally {
            setLoading(false);
        }
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

    if (!service) {
        return (
            <div className="text-center py-12">
                <h3 className="text-lg font-medium text-slate-400 mb-2">Servis bulunamadı</h3>
                <Link
                    href="/admin/services"
                    className="text-emerald-400 hover:text-emerald-300"
                >
                    Servis listesine dön
                </Link>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-4">
                <Link
                    href="/admin/services"
                    className="p-2 text-slate-400 hover:text-slate-100 hover:bg-slate-800 rounded-lg transition-colors"
                >
                    <ArrowLeft className="w-5 h-5" />
                </Link>
                <div>
                    <h1 className="text-2xl font-bold text-slate-100">Servis Detayı</h1>
                    <p className="text-slate-400 mt-1">Servis bilgilerini görüntüle.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Müşteri Bilgileri */}
                <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
                            <User className="w-5 h-5 text-blue-400" />
                        </div>
                        <h2 className="text-lg font-semibold text-slate-100">Müşteri</h2>
                    </div>
                    {customer && (
                        <div className="space-y-3">
                            <div>
                                <label className="block text-sm text-slate-500 mb-1">Ad Soyad</label>
                                <p className="text-slate-200">{customer.name}</p>
                            </div>
                            <div>
                                <label className="block text-sm text-slate-500 mb-1">Telefon</label>
                                <p className="text-slate-200">{customer.phone}</p>
                            </div>
                            {customer.email && (
                                <div>
                                    <label className="block text-sm text-slate-500 mb-1">Email</label>
                                    <p className="text-slate-200">{customer.email}</p>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* Servis Bilgileri */}
                <div className="lg:col-span-2 bg-slate-900/50 border border-slate-800 rounded-xl p-6">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                            <Package className="w-5 h-5 text-emerald-400" />
                        </div>
                        <h2 className="text-lg font-semibold text-slate-100">Servis Detayları</h2>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm text-slate-500 mb-1">Servis Türü</label>
                            <p className="text-slate-200">{service.service_type || '-'}</p>
                        </div>
                        <div>
                            <label className="block text-sm text-slate-500 mb-1">Paket Türü</label>
                            <p className="text-slate-200">{service.package_type || '-'}</p>
                        </div>
                        <div>
                            <label className="block text-sm text-slate-500 mb-1">Bildirim Tarihi</label>
                            <div className="flex items-center gap-2 text-slate-200">
                                <Calendar className="w-4 h-4 text-slate-500" />
                                {service.notification_date ? new Date(service.notification_date).toLocaleDateString('tr-TR') : '-'}
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm text-slate-500 mb-1">Kayıt Tarihi</label>
                            <div className="flex items-center gap-2 text-slate-200">
                                <Calendar className="w-4 h-4 text-slate-500" />
                                {new Date(service.created_at).toLocaleDateString('tr-TR')}
                            </div>
                        </div>
                        {service.description && (
                            <div className="md:col-span-2">
                                <label className="block text-sm text-slate-500 mb-1">Açıklama</label>
                                <p className="text-slate-200 whitespace-pre-wrap">{service.description}</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}