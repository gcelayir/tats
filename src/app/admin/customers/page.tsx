'use client';

import { Plus, Search, Eye, Trash2, Edit2, Phone, Mail, MapPin } from 'lucide-react';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { showToast } from '@/components/toast';
import { SimpleModal } from '@/components/simple-modal';

export default function CustomersPage() {
    const [customers, setCustomers] = useState<any[]>([]);
    const [filteredCustomers, setFilteredCustomers] = useState<any[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(true);
    const [deleteModal, setDeleteModal] = useState<{ isOpen: boolean; customerId: string; customerName: string }>({
        isOpen: false,
        customerId: '',
        customerName: ''
    });

    useEffect(() => {
        fetchCustomers();
    }, []);

    useEffect(() => {
        let filtered = customers;

        if (searchTerm) {
            filtered = filtered.filter(customer =>
                customer.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                customer.phone?.includes(searchTerm) ||
                customer.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                customer.company_name?.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        setFilteredCustomers(filtered);
    }, [customers, searchTerm]);

    const fetchCustomers = async () => {
        try {
            const { data, error } = await supabase
                .from('customers')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) throw error;
            setCustomers(data || []);
        } catch (error) {
            console.error('Error fetching customers:', error);
            showToast('Müşteriler yüklenirken hata oluştu', 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (customerId: string) => {
        try {
            const { error } = await supabase
                .from('customers')
                .delete()
                .eq('id', customerId);

            if (error) throw error;

            setCustomers(customers.filter(c => c.id !== customerId));
            showToast('Müşteri silindi', 'success');
        } catch (error) {
            console.error('Error deleting customer:', error);
            showToast('Müşteri silinirken hata oluştu', 'error');
        } finally {
            setDeleteModal({ isOpen: false, customerId: '', customerName: '' });
        }
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
                    <h1 className="text-2xl font-bold text-slate-100">Müşteriler</h1>
                    <p className="text-slate-400 mt-1">Tüm müşteri kayıtlarını görüntüle ve yönet.</p>
                </div>
                <Link
                    href="/admin/customers/new"
                    className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-medium transition-colors"
                >
                    <Plus className="w-4 h-4" />
                    Yeni Müşteri
                </Link>
            </div>

            {/* Search */}
            <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-500 w-4 h-4" />
                <input
                    type="text"
                    placeholder="Ad, telefon, email veya şirket ara..."
                    className="w-full pl-10 pr-4 py-2 bg-slate-900/50 border border-slate-800 rounded-lg text-slate-100 placeholder:text-slate-500 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            {/* Customers List */}
            <div className="bg-slate-900/50 border border-slate-800 rounded-xl overflow-hidden">
                {filteredCustomers.length === 0 ? (
                    <div className="text-center py-12">
                        <div className="w-12 h-12 text-slate-600 mx-auto mb-4">👥</div>
                        <h3 className="text-lg font-medium text-slate-400 mb-2">Müşteri bulunamadı</h3>
                        <p className="text-slate-500">
                            {searchTerm 
                                ? 'Arama kriterlerinize uygun müşteri bulunamadı.'
                                : 'Henüz hiç müşteri kaydı yok.'
                            }
                        </p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-slate-800/50 border-b border-slate-700">
                                <tr>
                                    <th className="text-left py-3 px-4 font-medium text-slate-300">Müşteri</th>
                                    <th className="text-left py-3 px-4 font-medium text-slate-300">İletişim</th>
                                    <th className="text-left py-3 px-4 font-medium text-slate-300">Şirket</th>
                                    <th className="text-left py-3 px-4 font-medium text-slate-300">Kayıt Tarihi</th>
                                    <th className="text-right py-3 px-4 font-medium text-slate-300">İşlemler</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-800">
                                {filteredCustomers.map((customer) => (
                                    <tr key={customer.id} className="hover:bg-slate-800/30 transition-colors">
                                        <td className="py-3 px-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-full bg-blue-500/10 flex items-center justify-center">
                                                    <span className="text-blue-400 font-medium text-sm">
                                                        {customer.full_name?.charAt(0)?.toUpperCase()}
                                                    </span>
                                                </div>
                                                <div>
                                                    <p className="font-medium text-slate-200">{customer.full_name}</p>
                                                    {customer.address && (
                                                        <div className="flex items-center gap-1 text-xs text-slate-500 mt-1">
                                                            <MapPin className="w-3 h-3" />
                                                            <span className="truncate max-w-32">{customer.address}</span>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="py-3 px-4">
                                            <div className="space-y-1">
                                                {customer.phone && (
                                                    <div className="flex items-center gap-1 text-sm text-slate-400">
                                                        <Phone className="w-3 h-3" />
                                                        <span>{customer.phone}</span>
                                                    </div>
                                                )}
                                                {customer.email && (
                                                    <div className="flex items-center gap-1 text-sm text-slate-400">
                                                        <Mail className="w-3 h-3" />
                                                        <span className="truncate max-w-32">{customer.email}</span>
                                                    </div>
                                                )}
                                            </div>
                                        </td>
                                        <td className="py-3 px-4">
                                            <p className="text-sm text-slate-300">{customer.company_name || '-'}</p>
                                        </td>
                                        <td className="py-3 px-4">
                                            <p className="text-sm text-slate-400">
                                                {new Date(customer.created_at).toLocaleDateString('tr-TR')}
                                            </p>
                                        </td>
                                        <td className="py-3 px-4">
                                            <div className="flex items-center justify-end gap-2">
                                                <Link
                                                    href={`/admin/customers/${customer.id}`}
                                                    className="p-2 text-slate-400 hover:text-blue-400 hover:bg-slate-800 rounded-lg transition-colors"
                                                    title="Görüntüle"
                                                >
                                                    <Eye className="w-4 h-4" />
                                                </Link>
                                                <Link
                                                    href={`/admin/customers/${customer.id}?mode=edit`}
                                                    className="p-2 text-slate-400 hover:text-emerald-400 hover:bg-slate-800 rounded-lg transition-colors"
                                                    title="Düzenle"
                                                >
                                                    <Edit2 className="w-4 h-4" />
                                                </Link>
                                                <button
                                                    onClick={() => setDeleteModal({
                                                        isOpen: true,
                                                        customerId: customer.id,
                                                        customerName: customer.full_name || ''
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
                onClose={() => setDeleteModal({ isOpen: false, customerId: '', customerName: '' })}
                title="Müşteriyi Sil"
                message={`${deleteModal.customerName} müşterisini silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.`}
                confirmText="Sil"
                cancelText="İptal"
                onConfirm={() => handleDelete(deleteModal.customerId)}
            />
        </div>
    );
}