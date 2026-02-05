'use client';

import { Plus, Search, Trash2, Loader2, User } from 'lucide-react';
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
                customer.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                customer.phone?.includes(searchTerm) ||
                customer.email?.toLowerCase().includes(searchTerm.toLowerCase())
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

            if (error) {
                console.error('Supabase error:', error);
                throw error;
            }
            
            console.log('Customers data:', data);
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
                    <h1 className="text-2xl font-bold text-white">Müşteriler</h1>
                    <p className="text-gray-400 mt-1">Tüm müşteri kayıtlarını görüntüle ve yönet.</p>
                </div>
                <Link
                    href="/admin/customers/new"
                    className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors"
                >
                    <Plus className="w-4 h-4" />
                    Yeni Müşteri
                </Link>
            </div>

            {/* Search */}
            <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-4 h-4" />
                <input
                    type="text"
                    placeholder="Ad, telefon veya email ara..."
                    className="w-full pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder:text-gray-500 focus:border-green-500 focus:ring-1 focus:ring-green-500"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            {/* Customers List */}
            <div className="bg-gray-800 border border-gray-700 rounded-xl overflow-hidden">
                {filteredCustomers.length === 0 ? (
                    <div className="text-center py-12">
                        <User className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-gray-400 mb-2">Müşteri bulunamadı</h3>
                        <p className="text-gray-500">
                            {searchTerm 
                                ? 'Arama kriterlerinize uygun müşteri bulunamadı.'
                                : 'Henüz hiç müşteri kaydı yok.'
                            }
                        </p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-700 border-b border-gray-600">
                                <tr>
                                    <th className="text-left py-3 px-4 font-medium text-gray-300">Ad Soyad</th>
                                    <th className="text-left py-3 px-4 font-medium text-gray-300">Telefon</th>
                                    <th className="text-left py-3 px-4 font-medium text-gray-300">Email</th>
                                    <th className="text-left py-3 px-4 font-medium text-gray-300">Kayıt Tarihi</th>
                                    <th className="text-right py-3 px-4 font-medium text-gray-300">İşlemler</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-700">
                                {filteredCustomers.map((customer) => (
                                    <tr key={customer.id} className="hover:bg-gray-700 transition-colors">
                                        <td className="py-3 px-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center">
                                                    <span className="text-white font-medium text-sm">
                                                        {customer.name?.charAt(0)?.toUpperCase() || 'M'}
                                                    </span>
                                                </div>
                                                <p className="font-medium text-white">{customer.name || 'İsimsiz'}</p>
                                            </div>
                                        </td>
                                        <td className="py-3 px-4">
                                            <p className="text-gray-300">{customer.phone || '-'}</p>
                                        </td>
                                        <td className="py-3 px-4">
                                            <p className="text-gray-300">{customer.email || '-'}</p>
                                        </td>
                                        <td className="py-3 px-4">
                                            <p className="text-sm text-gray-400">
                                                {customer.created_at ? new Date(customer.created_at).toLocaleDateString('tr-TR') : '-'}
                                            </p>
                                        </td>
                                        <td className="py-3 px-4">
                                            <div className="flex items-center justify-end gap-2">
                                                <button
                                                    onClick={() => setDeleteModal({
                                                        isOpen: true,
                                                        customerId: customer.id,
                                                        customerName: customer.name || 'İsimsiz'
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