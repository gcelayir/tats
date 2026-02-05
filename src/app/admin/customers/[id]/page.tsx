'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Save, Loader2, Phone, Mail, MapPin, Building } from 'lucide-react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { showToast } from '@/components/toast';

export default function CustomerDetailPage() {
    const params = useParams();
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [customer, setCustomer] = useState<any>(null);
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        address: '',
        company: ''
    });

    useEffect(() => {
        if (params?.id) {
            fetchCustomer(params.id as string);
        }
    }, [params?.id]);

    const fetchCustomer = async (id: string) => {
        try {
            const { data, error } = await supabase
                .from('customers')
                .select('*')
                .eq('id', id)
                .single();

            if (error) throw error;

            setCustomer(data);
            setFormData({
                name: data.name || '',
                email: data.email || '',
                phone: data.phone || '',
                address: data.address || '',
                company: data.company || ''
            });
        } catch (error) {
            console.error('Error fetching customer:', error);
            showToast('Müşteri yüklenirken hata oluştu', 'error');
            router.push('/admin/customers');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);

        try {
            const { error } = await supabase
                .from('customers')
                .update(formData)
                .eq('id', params?.id as string);

            if (error) throw error;

            setCustomer({ ...customer, ...formData });
            setIsEditing(false);
            showToast('Müşteri güncellendi', 'success');
        } catch (error) {
            console.error('Error updating customer:', error);
            showToast('Müşteri güncellenirken hata oluştu', 'error');
        } finally {
            setSaving(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData(prev => ({
            ...prev,
            [e.target.name]: e.target.value
        }));
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

    if (!customer) {
        return (
            <div className="text-center py-12">
                <h3 className="text-lg font-medium text-slate-400 mb-2">Müşteri bulunamadı</h3>
                <Link
                    href="/admin/customers"
                    className="text-emerald-400 hover:text-emerald-300"
                >
                    Müşteri listesine dön
                </Link>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Link
                        href="/admin/customers"
                        className="p-2 text-slate-400 hover:text-slate-100 hover:bg-slate-800 rounded-lg transition-colors"
                    >
                        <ArrowLeft className="w-5 h-5" />
                    </Link>
                    <div>
                        <h1 className="text-2xl font-bold text-slate-100">Müşteri Detayı</h1>
                        <p className="text-slate-400 mt-1">Müşteri bilgilerini görüntüle ve düzenle.</p>
                    </div>
                </div>
                {!isEditing && (
                    <button
                        onClick={() => setIsEditing(true)}
                        className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-medium transition-colors"
                    >
                        Düzenle
                    </button>
                )}
            </div>

            <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6">
                {isEditing ? (
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-slate-300 mb-2">
                                    Ad Soyad *
                                </label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-3 py-2 bg-slate-800/50 border border-slate-700 rounded-lg text-slate-100 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-300 mb-2">
                                    Email
                                </label>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 bg-slate-800/50 border border-slate-700 rounded-lg text-slate-100 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-300 mb-2">
                                    Telefon *
                                </label>
                                <input
                                    type="tel"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-3 py-2 bg-slate-800/50 border border-slate-700 rounded-lg text-slate-100 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-300 mb-2">
                                    Şirket
                                </label>
                                <input
                                    type="text"
                                    name="company"
                                    value={formData.company}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 bg-slate-800/50 border border-slate-700 rounded-lg text-slate-100 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-2">
                                Adres
                            </label>
                            <textarea
                                name="address"
                                value={formData.address}
                                onChange={handleChange}
                                rows={3}
                                className="w-full px-3 py-2 bg-slate-800/50 border border-slate-700 rounded-lg text-slate-100 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                            />
                        </div>

                        <div className="flex justify-end gap-3">
                            <button
                                type="button"
                                onClick={() => {
                                    setIsEditing(false);
                                    setFormData({
                                        name: customer.name || '',
                                        email: customer.email || '',
                                        phone: customer.phone || '',
                                        address: customer.address || '',
                                        company: customer.company || ''
                                    });
                                }}
                                className="px-4 py-2 text-slate-400 hover:text-slate-100 hover:bg-slate-800 rounded-lg transition-colors"
                            >
                                İptal
                            </button>
                            <button
                                type="submit"
                                disabled={saving}
                                className="inline-flex items-center gap-2 px-6 py-2 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg font-medium transition-colors"
                            >
                                {saving ? (
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                ) : (
                                    <Save className="w-4 h-4" />
                                )}
                                {saving ? 'Kaydediliyor...' : 'Kaydet'}
                            </button>
                        </div>
                    </form>
                ) : (
                    <div className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-slate-500 mb-2">Ad Soyad</label>
                                <div className="flex items-center gap-2 text-slate-100">
                                    <span className="text-lg">{customer.name}</span>
                                </div>
                            </div>

                            {customer.email && (
                                <div>
                                    <label className="block text-sm font-medium text-slate-500 mb-2">Email</label>
                                    <div className="flex items-center gap-2 text-slate-300">
                                        <Mail className="w-4 h-4 text-slate-500" />
                                        <span>{customer.email}</span>
                                    </div>
                                </div>
                            )}

                            <div>
                                <label className="block text-sm font-medium text-slate-500 mb-2">Telefon</label>
                                <div className="flex items-center gap-2 text-slate-300">
                                    <Phone className="w-4 h-4 text-slate-500" />
                                    <span>{customer.phone}</span>
                                </div>
                            </div>

                            {customer.company && (
                                <div>
                                    <label className="block text-sm font-medium text-slate-500 mb-2">Şirket</label>
                                    <div className="flex items-center gap-2 text-slate-300">
                                        <Building className="w-4 h-4 text-slate-500" />
                                        <span>{customer.company}</span>
                                    </div>
                                </div>
                            )}
                        </div>

                        {customer.address && (
                            <div>
                                <label className="block text-sm font-medium text-slate-500 mb-2">Adres</label>
                                <div className="flex items-start gap-2 text-slate-300">
                                    <MapPin className="w-4 h-4 text-slate-500 mt-1" />
                                    <span>{customer.address}</span>
                                </div>
                            </div>
                        )}

                        <div className="pt-4 border-t border-slate-800">
                            <label className="block text-sm font-medium text-slate-500 mb-2">Kayıt Tarihi</label>
                            <p className="text-slate-400">
                                {new Date(customer.created_at).toLocaleDateString('tr-TR', {
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric',
                                    hour: '2-digit',
                                    minute: '2-digit'
                                })}
                            </p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}