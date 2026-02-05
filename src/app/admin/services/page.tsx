'use client';

import { Plus, Search, Trash2, Calendar, User as UserIcon, Wrench, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { showToast } from '@/components/toast';
import { SimpleModal } from '@/components/simple-modal';

export default function ServicesPage() {
    const [services, setServices] = useState<any[]>([]);
    const [filteredServices, setFilteredServices] = useState<any[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
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
        if (searchTerm) {
            filtered = filtered.filter(service =>
                service.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                service.service_type?.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }
        setFilteredServices(filtered);
    }, [services, searchTerm]);

    const fetchServices = async () => {
        try {
            const { data, error } = await supabase
                .from('services')
                .select(`
                    *,
                    customers (name, phone)
                `)
                .order('created_at', { ascending: false });

            if (error) {
                console.error('Supabase error:', error);
                throw error;
            }
            
            console.log('Services data:', data);
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

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-64">
                <div className="flex items-center gap-3 text-gray-400">
                    <Loader2 className="w-6 h-6 animate-spin" />
                    <span>Yükleniyor...</span>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-white">Servisler</h1>
                    <p className="text-gray-400 mt-1">Tüm servis kayıtlarını görüntüle ve yönet.</p>
                </div>
                <Link
                    href="/admin/services/new"
                    className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors"
                >
                    <Plus className="w-4 h-4" />
                    Yeni Servis
                </Link>
            </div>

            {/* Search */}
            <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-4 h-4" />
                <input
                    type="text"
                    placeholder="Servis türü veya açıklama ara..."
                    className="w-full pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder:text-gray-500 focus:border-green-500 focus:ring-1 focus:ring-green-500"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            {/* Services List */}
            <div className="bg-gray-800 border border-gray-700 rounded-xl overflow-hidden">
                {filteredServices.length === 0 ? (
                    <div className="text-center py-12">
                        <Wrench className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-gray-400 mb-2">Servis bulunamadı</h3>
                        <p className="text-gray-500">
                            {searchTerm 
                                ? 'Arama kriterlerinize uygun servis bulunamadı.'
                                : 'Henüz hiç servis kaydı yok.'
                            }
                        </p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-700 border-b border-gray-600">
                                <tr>
                                    <th className="text-left py-3 px-4 font-medium text-gray-300">Müşteri</th>
                                    <th className="text-left py-3 px-4 font-medium text-gray-300">Servis Türü</th>
                                    <th className="text-left py-3 px-4 font-medium text-gray-300">Paket</th>
                                    <th className="text-left py-3 px-4 font-medium text-gray-300">Tarih</th>
                                    <th className="text-right py-3 px-4 font-medium text-gray-300">İşlemler</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-700">
                                {filteredServices.map((service) => (
                                    <tr key={service.id} className="hover:bg-gray-700 transition-colors">
                                        <td className="py-3 px-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center">
                                                    <UserIcon className="w-4 h-4 text-white" />
                                                </div>
                                                <div>
                                                    <p className="font-medium text-white">{service.customers?.name || 'Bilinmeyen'}</p>
                                                    <p className="text-sm text-gray-400">{service.customers?.phone || '-'}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="py-3 px-4">
                                            <p className="text-gray-300">{service.service_type || '-'}</p>
                                        </td>
                                        <td className="py-3 px-4">
                                            <p className="text-gray-300">{service.package_type || '-'}</p>
                                        </td>
                                        <td className="py-3 px-4">
                                            <div className="flex items-center gap-1 text-sm text-gray-400">
                                                <Calendar className="w-4 h-4" />
                                                {service.created_at ? new Date(service.created_at).toLocaleDateString('tr-TR') : '-'}
                                            </div>
                                        </td>
                                        <td className="py-3 px-4">
                                            <div className="flex items-center justify-end gap-2">
                                                <button
                                                    onClick={() => setDeleteModal({
                                                        isOpen: true,
                                                        serviceId: service.id,
                                                        customerName: service.customers?.name || 'Bilinmeyen'
                                                    })}
                                                    className="p-2 text-gray-400 hover:text-red-400 hover:bg-gray-700 rounded-lg transition-colors"
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