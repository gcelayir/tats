'use client';

import { Plus, Search, Eye, Trash2, Calendar, User as UserIcon, Wrench, AlertCircle } from 'lucide-react';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { showToast } from '@/components/toast';
import { SimpleModal } from '@/components/simple-modal';

export default function ServicesPage() {
    const [services, setServices] = useState<any[]>([]);
    const [filteredServices, setFilteredServices] = useState<any[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [loading, setLoading] = useState(true);
    const [deleteModal, setDeleteModal] = useState<{ isOpen: boolean; serviceId: string; customerName: string }>({
        isOpen: false,
        serviceId: '',
        customerName: ''
    });

    useEffect(() => {
        fetchServices();
    }, []);

    useEffect(() => {
        let filtered = services;

        // Arama filtresi
        if (searchTerm) {
            filtered = filtered.filter(service =>
                service.customers?.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                service.service_types?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                service.service_packages?.name?.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        // Durum filtresi
        if (statusFilter !== 'all') {
            filtered = filtered.filter(service => {
                if (statusFilter === 'completed') {
                    return service.completion_completed_at;
                } else if (statusFilter === 'cancelled') {
                    return service.is_cancelled;
                } else if (statusFilter === 'active') {
                    return !service.completion_completed_at && !service.is_cancelled;
                }
                return true;
            });
        }

        setFilteredServices(filtered);
    }, [services, searchTerm, statusFilter]);

    const fetchServices = async () => {
        try {
            const { data, error } = await supabase
                .from('services')
                .select(`
                    *,
                    customers (id, full_name, phone),
                    service_types (name),
                    service_packages (name),
                    service_stages (name)
                `)
                .order('created_at', { ascending: false });

            if (error) throw error;
            setServices(data || []);
        } catch (error) {
            console.error('Error fetching services:', error);
            showToast('Servisler yüklenirken hata oluştu', 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (serviceId: string) => {
        try {
            const { error } = await supabase
                .from('services')
                .delete()
                .eq('id', serviceId);

            if (error) throw error;

            setServices(services.filter(s => s.id !== serviceId));
            showToast('Servis silindi', 'success');
        } catch (error) {
            console.error('Error deleting service:', error);
            showToast('Servis silinirken hata oluştu', 'error');
        } finally {
            setDeleteModal({ isOpen: false, serviceId: '', customerName: '' });
        }
    };

    const getStatusColor = (service: any) => {
        if (service.is_cancelled) {
            return 'bg-red-500/10 text-red-400 border-red-500/20';
        }
        if (service.completion_completed_at) {
            return 'bg-teal-500/10 text-teal-400 border-teal-500/20';
        }
        const colors: any = {
            'Kayıt': 'bg-blue-500/10 text-blue-400 border-blue-500/20',
            'Tespit': 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
            'Kapanış': 'bg-green-500/10 text-green-400 border-green-500/20'
        };
        return colors[service.service_stages?.name] || colors['Kayıt'];
    };

    const getStatusText = (service: any) => {
        if (service.is_cancelled) return 'İptal';
        if (service.completion_completed_at) return 'Tamamlandı';
        return service.service_stages?.name || 'Kayıt';
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-64">
                <div className="flex items-center gap-3 text-slate-400">
                    <div className="w-6 h-6 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
                    <span>Yükleniyor...</span>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-100">Servisler</h1>
                    <p className="text-slate-400 mt-1">Tüm servis kayıtlarını görüntüle ve yönet.</p>
                </div>
                <Link
                    href="/admin/services/new"
                    className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-medium transition-colors"
                >
                    <Plus className="w-4 h-4" />
                    Yeni Servis
                </Link>
            </div>

            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-500 w-4 h-4" />
                    <input
                        type="text"
                        placeholder="Müşteri, servis türü veya paket ara..."
                        className="w-full pl-10 pr-4 py-2 bg-slate-900/50 border border-slate-800 rounded-lg text-slate-100 placeholder:text-slate-500 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <select
                    className="px-4 py-2 bg-slate-900/50 border border-slate-800 rounded-lg text-slate-100 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                >
                    <option value="all">Tüm Durumlar</option>
                    <option value="active">Aktif</option>
                    <option value="completed">Tamamlanan</option>
                    <option value="cancelled">İptal</option>
                </select>
            </div>

            {/* Services List */}
            <div className="bg-slate-900/50 border border-slate-800 rounded-xl overflow-hidden">
                {filteredServices.length === 0 ? (
                    <div className="text-center py-12">
                        <Wrench className="w-12 h-12 text-slate-600 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-slate-400 mb-2">Servis bulunamadı</h3>
                        <p className="text-slate-500">
                            {searchTerm || statusFilter !== 'all' 
                                ? 'Arama kriterlerinize uygun servis bulunamadı.'
                                : 'Henüz hiç servis kaydı yok.'
                            }
                        </p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-slate-800/50 border-b border-slate-700">
                                <tr>
                                    <th className="text-left py-3 px-4 font-medium text-slate-300">Müşteri</th>
                                    <th className="text-left py-3 px-4 font-medium text-slate-300">Servis</th>
                                    <th className="text-left py-3 px-4 font-medium text-slate-300">Durum</th>
                                    <th className="text-left py-3 px-4 font-medium text-slate-300">Tarih</th>
                                    <th className="text-right py-3 px-4 font-medium text-slate-300">İşlemler</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-800">
                                {filteredServices.map((service) => (
                                    <tr key={service.id} className="hover:bg-slate-800/30 transition-colors">
                                        <td className="py-3 px-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-full bg-blue-500/10 flex items-center justify-center">
                                                    <UserIcon className="w-4 h-4 text-blue-400" />
                                                </div>
                                                <div>
                                                    <p className="font-medium text-slate-200">{service.customers?.full_name}</p>
                                                    <p className="text-sm text-slate-500">{service.customers?.phone}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="py-3 px-4">
                                            <div>
                                                <p className="font-medium text-slate-200">{service.service_types?.name}</p>
                                                <p className="text-sm text-slate-500">{service.service_packages?.name}</p>
                                            </div>
                                        </td>
                                        <td className="py-3 px-4">
                                            <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${getStatusColor(service)}`}>
                                                {getStatusText(service)}
                                            </span>
                                        </td>
                                        <td className="py-3 px-4">
                                            <div className="flex items-center gap-1 text-sm text-slate-400">
                                                <Calendar className="w-4 h-4" />
                                                {new Date(service.created_at).toLocaleDateString('tr-TR')}
                                            </div>
                                        </td>
                                        <td className="py-3 px-4">
                                            <div className="flex items-center justify-end gap-2">
                                                <Link
                                                    href={`/admin/services/${service.id}`}
                                                    className="p-2 text-slate-400 hover:text-emerald-400 hover:bg-slate-800 rounded-lg transition-colors"
                                                    title="Görüntüle"
                                                >
                                                    <Eye className="w-4 h-4" />
                                                </Link>
                                                <button
                                                    onClick={() => setDeleteModal({
                                                        isOpen: true,
                                                        serviceId: service.id,
                                                        customerName: service.customers?.full_name || ''
                                                    })}
                                                    className="p-2 text-slate-400 hover:text-red-400 hover:bg-slate-800 rounded-lg transition-colors"
                                                    title="Sil"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Delete Modal */}
            <SimpleModal
                isOpen={deleteModal.isOpen}
                onClose={() => setDeleteModal({ isOpen: false, serviceId: '', customerName: '' })}
                title="Servisi Sil"
                message={`${deleteModal.customerName} müşterisinin servisini silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.`}
                confirmText="Sil"
                cancelText="İptal"
                onConfirm={() => handleDelete(deleteModal.serviceId)}
            />
        </div>
    );
}