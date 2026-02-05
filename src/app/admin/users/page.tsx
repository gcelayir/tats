'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Plus, Search, Trash2, Shield, ShieldAlert, User, Database, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { showToast } from '@/components/toast';
import { SimpleModal } from '@/components/simple-modal';

export default function UsersPage() {
    const [users, setUsers] = useState<any[]>([]);
    const [filteredUsers, setFilteredUsers] = useState<any[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(true);
    const [deleteModal, setDeleteModal] = useState<{ isOpen: boolean; userId: string; userEmail: string }>({
        isOpen: false,
        userId: '',
        userEmail: ''
    });

    useEffect(() => {
        fetchUsers();
    }, []);

    useEffect(() => {
        let filtered = users;

        if (searchTerm) {
            filtered = filtered.filter(user =>
                user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                user.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                user.role?.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        setFilteredUsers(filtered);
    }, [users, searchTerm]);

    const fetchUsers = async () => {
        try {
            const { data, error } = await supabase
                .from('profiles')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) throw error;
            setUsers(data || []);
        } catch (error) {
            console.error('Error fetching users:', error);
            showToast('Kullanıcılar yüklenirken hata oluştu', 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (userId: string) => {
        try {
            const { error } = await supabase
                .from('profiles')
                .delete()
                .eq('id', userId);

            if (error) throw error;

            setUsers(users.filter(u => u.id !== userId));
            showToast('Kullanıcı silindi', 'success');
        } catch (error) {
            console.error('Error deleting user:', error);
            showToast('Kullanıcı silinirken hata oluştu', 'error');
        } finally {
            setDeleteModal({ isOpen: false, userId: '', userEmail: '' });
        }
    };

    const getRoleColor = (role: string) => {
        const colors: any = {
            'admin': 'bg-red-500/10 text-red-400 border-red-500/20',
            'user': 'bg-blue-500/10 text-blue-400 border-blue-500/20'
        };
        return colors[role] || colors['user'];
    };

    const getRoleIcon = (role: string) => {
        return role === 'admin' ? ShieldAlert : Shield;
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
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-100">Kullanıcılar</h1>
                    <p className="text-slate-400 mt-1">Sistem kullanıcılarını görüntüle ve yönet.</p>
                </div>
                <Link
                    href="/admin/users/new"
                    className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-medium transition-colors"
                >
                    <Plus className="w-4 h-4" />
                    Yeni Kullanıcı
                </Link>
            </div>

            {/* Search */}
            <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-500 w-4 h-4" />
                <input
                    type="text"
                    placeholder="Email, ad veya rol ara..."
                    className="w-full pl-10 pr-4 py-2 bg-slate-900/50 border border-slate-800 rounded-lg text-slate-100 placeholder:text-slate-500 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            {/* Users List */}
            <div className="bg-slate-900/50 border border-slate-800 rounded-xl overflow-hidden">
                {filteredUsers.length === 0 ? (
                    <div className="text-center py-12">
                        <User className="w-12 h-12 text-slate-600 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-slate-400 mb-2">Kullanıcı bulunamadı</h3>
                        <p className="text-slate-500">
                            {searchTerm 
                                ? 'Arama kriterlerinize uygun kullanıcı bulunamadı.'
                                : 'Henüz hiç kullanıcı kaydı yok.'
                            }
                        </p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-slate-800/50 border-b border-slate-700">
                                <tr>
                                    <th className="text-left py-3 px-4 font-medium text-slate-300">Kullanıcı</th>
                                    <th className="text-left py-3 px-4 font-medium text-slate-300">Email</th>
                                    <th className="text-left py-3 px-4 font-medium text-slate-300">Rol</th>
                                    <th className="text-left py-3 px-4 font-medium text-slate-300">Kayıt Tarihi</th>
                                    <th className="text-right py-3 px-4 font-medium text-slate-300">İşlemler</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-800">
                                {filteredUsers.map((user) => {
                                    const RoleIcon = getRoleIcon(user.role);
                                    return (
                                        <tr key={user.id} className="hover:bg-slate-800/30 transition-colors">
                                            <td className="py-3 px-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 rounded-full bg-blue-500/10 flex items-center justify-center">
                                                        <span className="text-blue-400 font-medium text-sm">
                                                            {user.full_name?.charAt(0)?.toUpperCase() || user.email?.charAt(0)?.toUpperCase()}
                                                        </span>
                                                    </div>
                                                    <div>
                                                        <p className="font-medium text-slate-200">{user.full_name || 'İsimsiz'}</p>
                                                        <p className="text-sm text-slate-500">ID: {user.id.slice(0, 8)}...</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="py-3 px-4">
                                                <p className="text-slate-300">{user.email}</p>
                                            </td>
                                            <td className="py-3 px-4">
                                                <div className="flex items-center gap-2">
                                                    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium border ${getRoleColor(user.role)}`}>
                                                        <RoleIcon className="w-3 h-3" />
                                                        {user.role === 'admin' ? 'Admin' : 'Kullanıcı'}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="py-3 px-4">
                                                <p className="text-sm text-slate-400">
                                                    {new Date(user.created_at).toLocaleDateString('tr-TR')}
                                                </p>
                                            </td>
                                            <td className="py-3 px-4">
                                                <div className="flex items-center justify-end gap-2">
                                                    <button
                                                        onClick={() => setDeleteModal({
                                                            isOpen: true,
                                                            userId: user.id,
                                                            userEmail: user.email || ''
                                                        })}
                                                        className="p-2 text-slate-400 hover:text-red-400 hover:bg-slate-800 rounded-lg transition-colors"
                                                        title="Sil"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Delete Modal */}
            <SimpleModal
                isOpen={deleteModal.isOpen}
                onClose={() => setDeleteModal({ isOpen: false, userId: '', userEmail: '' })}
                title="Kullanıcıyı Sil"
                message={`${deleteModal.userEmail} kullanıcısını silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.`}
                confirmText="Sil"
                cancelText="İptal"
                onConfirm={() => handleDelete(deleteModal.userId)}
            />
        </div>
    );
}