'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Save, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { showToast } from '@/components/toast';

export default function NewServicePage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [customers, setCustomers] = useState<any[]>([]);
    const [formData, setFormData] = useState({
        customer_id: '',
        service_type: 'Onarım',
        package_type: 'Standart',
        description: '',
        notification_date: new Date().toISOString().split('T')[0]
    });

    useEffect(() => {
        fetchCustomers();
    }, []);

    const fetchCustomers = async () => {
        try {
            const { data, error } = await supabase
                .from('customers')
                .select('*')
                .order('name', { ascending: true });

            if (error) {
                console.error('Supabase error:', error);
                throw error;
            }
            
            console.log('Customers for service:', data);
            setCustomers(data || []);
        } catch (error) {
            console.error('Error fetching customers:', error);
            showToast('Müşteriler yüklenirken hata oluştu', 'error');
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const { data, error } = await supabase
                .from('services')
                .insert([formData])
                .select()
                .single();

            if (error) {
                console.error('Supabase error:', error);
                throw error;
            }

            console.log('Service created:', data);
            showToast('Servis başarıyla oluşturuldu', 'success');
            router.push('/admin/services');
        } catch (error) {
            console.error('Error creating service:', error);
            showToast('Servis oluşturulurken hata oluştu', 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setFormData(prev => ({
            ...prev,
            [e.target.name]: e.target.value
        }));
    };

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
                    <h1 className="text-2xl font-bold text-slate-100">Yeni Servis</h1>
                    <p className="text-slate-400 mt-1">Yeni servis kaydı oluştur.</p>
                </div>
            </div>

            <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6">
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-2">
                                Müşteri *
                            </label>
                            <select
                                name="customer_id"
                                value={formData.customer_id}
                                onChange={handleChange}
                                required
                                className="w-full px-3 py-2 bg-slate-800/50 border border-slate-700 rounded-lg text-slate-100 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                            >
                                <option value="">Müşteri seçin</option>
                                {customers.map((customer) => (
                                    <option key={customer.id} value={customer.id}>
                                        {customer.name} - {customer.phone}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-2">
                                Servis Türü *
                            </label>
                            <select
                                name="service_type"
                                value={formData.service_type}
                                onChange={handleChange}
                                required
                                className="w-full px-3 py-2 bg-slate-800/50 border border-slate-700 rounded-lg text-slate-100 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                            >
                                <option value="Onarım">Onarım</option>
                                <option value="Bakım">Bakım</option>
                                <option value="Kurulum">Kurulum</option>
                                <option value="Danışmanlık">Danışmanlık</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-2">
                                Paket Türü *
                            </label>
                            <select
                                name="package_type"
                                value={formData.package_type}
                                onChange={handleChange}
                                required
                                className="w-full px-3 py-2 bg-slate-800/50 border border-slate-700 rounded-lg text-slate-100 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                            >
                                <option value="Standart">Standart</option>
                                <option value="Hızlı">Hızlı</option>
                                <option value="Premium">Premium</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-2">
                                Bildirim Tarihi *
                            </label>
                            <input
                                type="date"
                                name="notification_date"
                                value={formData.notification_date}
                                onChange={handleChange}
                                required
                                className="w-full px-3 py-2 bg-slate-800/50 border border-slate-700 rounded-lg text-slate-100 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2">
                            Açıklama
                        </label>
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            rows={4}
                            className="w-full px-3 py-2 bg-slate-800/50 border border-slate-700 rounded-lg text-slate-100 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                            placeholder="Servis detayları ve müşteri talebi..."
                        />
                    </div>

                    <div className="flex justify-end gap-3">
                        <Link
                            href="/admin/services"
                            className="px-4 py-2 text-slate-400 hover:text-slate-100 hover:bg-slate-800 rounded-lg transition-colors"
                        >
                            İptal
                        </Link>
                        <button
                            type="submit"
                            disabled={loading}
                            className="inline-flex items-center gap-2 px-6 py-2 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg font-medium transition-colors"
                        >
                            {loading ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                                <Save className="w-4 h-4" />
                            )}
                            {loading ? 'Kaydediliyor...' : 'Kaydet'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}