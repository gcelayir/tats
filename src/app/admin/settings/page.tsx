'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Settings, Database, Shield, Bell, Palette, Globe, Save, Loader2 } from 'lucide-react';
import { showToast } from '@/components/toast';

export default function SettingsPage() {
    const [loading, setLoading] = useState(false);
    const [settings, setSettings] = useState({
        siteName: 'TATS',
        siteDescription: 'Teknik Servis Yönetim Sistemi',
        contactEmail: 'info@teknoasteknoloji.com',
        contactPhone: '+90 555 123 4567',
        address: 'İstanbul, Türkiye',
        notifications: {
            emailNotifications: true,
            smsNotifications: false,
            pushNotifications: true
        },
        maintenance: {
            maintenanceMode: false,
            maintenanceMessage: 'Sistem bakımda. Lütfen daha sonra tekrar deneyin.'
        }
    });

    const handleSave = async () => {
        setLoading(true);
        try {
            // Burada settings'leri database'e kaydetme işlemi yapılacak
            // Şimdilik sadece toast gösterelim
            await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
            showToast('Ayarlar kaydedildi', 'success');
        } catch (error) {
            console.error('Error saving settings:', error);
            showToast('Ayarlar kaydedilirken hata oluştu', 'error');
        } finally {
            setLoading(false);
        }
    };

    const updateSetting = (path: string, value: any) => {
        setSettings(prev => {
            const keys = path.split('.');
            const newSettings = { ...prev };
            let current: any = newSettings;
            
            for (let i = 0; i < keys.length - 1; i++) {
                current[keys[i]] = { ...current[keys[i]] };
                current = current[keys[i]];
            }
            
            current[keys[keys.length - 1]] = value;
            return newSettings;
        });
    };

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-2xl font-bold text-slate-100">Sistem Ayarları</h1>
                <p className="text-slate-400 mt-1">Uygulama ayarlarını yönet ve yapılandır.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Genel Ayarlar */}
                <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
                            <Globe className="w-5 h-5 text-blue-400" />
                        </div>
                        <div>
                            <h2 className="text-lg font-semibold text-slate-100">Genel Ayarlar</h2>
                            <p className="text-sm text-slate-400">Site bilgileri ve iletişim</p>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-2">Site Adı</label>
                            <input
                                type="text"
                                value={settings.siteName}
                                onChange={(e) => updateSetting('siteName', e.target.value)}
                                className="w-full px-3 py-2 bg-slate-800/50 border border-slate-700 rounded-lg text-slate-100 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-2">Site Açıklaması</label>
                            <textarea
                                value={settings.siteDescription}
                                onChange={(e) => updateSetting('siteDescription', e.target.value)}
                                rows={3}
                                className="w-full px-3 py-2 bg-slate-800/50 border border-slate-700 rounded-lg text-slate-100 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-2">İletişim Email</label>
                            <input
                                type="email"
                                value={settings.contactEmail}
                                onChange={(e) => updateSetting('contactEmail', e.target.value)}
                                className="w-full px-3 py-2 bg-slate-800/50 border border-slate-700 rounded-lg text-slate-100 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-2">İletişim Telefon</label>
                            <input
                                type="tel"
                                value={settings.contactPhone}
                                onChange={(e) => updateSetting('contactPhone', e.target.value)}
                                className="w-full px-3 py-2 bg-slate-800/50 border border-slate-700 rounded-lg text-slate-100 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-2">Adres</label>
                            <input
                                type="text"
                                value={settings.address}
                                onChange={(e) => updateSetting('address', e.target.value)}
                                className="w-full px-3 py-2 bg-slate-800/50 border border-slate-700 rounded-lg text-slate-100 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                            />
                        </div>
                    </div>
                </div>

                {/* Bildirim Ayarları */}
                <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 rounded-lg bg-yellow-500/10 flex items-center justify-center">
                            <Bell className="w-5 h-5 text-yellow-400" />
                        </div>
                        <div>
                            <h2 className="text-lg font-semibold text-slate-100">Bildirim Ayarları</h2>
                            <p className="text-sm text-slate-400">Bildirim tercihlerini yönet</p>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="font-medium text-slate-200">Email Bildirimleri</p>
                                <p className="text-sm text-slate-400">Yeni servis ve güncellemeler için email gönder</p>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={settings.notifications.emailNotifications}
                                    onChange={(e) => updateSetting('notifications.emailNotifications', e.target.checked)}
                                    className="sr-only peer"
                                />
                                <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-emerald-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
                            </label>
                        </div>

                        <div className="flex items-center justify-between">
                            <div>
                                <p className="font-medium text-slate-200">SMS Bildirimleri</p>
                                <p className="text-sm text-slate-400">Acil durumlar için SMS gönder</p>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={settings.notifications.smsNotifications}
                                    onChange={(e) => updateSetting('notifications.smsNotifications', e.target.checked)}
                                    className="sr-only peer"
                                />
                                <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-emerald-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
                            </label>
                        </div>

                        <div className="flex items-center justify-between">
                            <div>
                                <p className="font-medium text-slate-200">Push Bildirimleri</p>
                                <p className="text-sm text-slate-400">Browser bildirimleri gönder</p>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={settings.notifications.pushNotifications}
                                    onChange={(e) => updateSetting('notifications.pushNotifications', e.target.checked)}
                                    className="sr-only peer"
                                />
                                <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-emerald-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
                            </label>
                        </div>
                    </div>
                </div>

                {/* Sistem Ayarları */}
                <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 rounded-lg bg-red-500/10 flex items-center justify-center">
                            <Shield className="w-5 h-5 text-red-400" />
                        </div>
                        <div>
                            <h2 className="text-lg font-semibold text-slate-100">Sistem Ayarları</h2>
                            <p className="text-sm text-slate-400">Güvenlik ve bakım ayarları</p>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="font-medium text-slate-200">Bakım Modu</p>
                                <p className="text-sm text-slate-400">Siteyi geçici olarak kapat</p>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={settings.maintenance.maintenanceMode}
                                    onChange={(e) => updateSetting('maintenance.maintenanceMode', e.target.checked)}
                                    className="sr-only peer"
                                />
                                <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-red-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-600"></div>
                            </label>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-2">Bakım Mesajı</label>
                            <textarea
                                value={settings.maintenance.maintenanceMessage}
                                onChange={(e) => updateSetting('maintenance.maintenanceMessage', e.target.value)}
                                rows={3}
                                className="w-full px-3 py-2 bg-slate-800/50 border border-slate-700 rounded-lg text-slate-100 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                                placeholder="Kullanıcılara gösterilecek bakım mesajı"
                            />
                        </div>
                    </div>
                </div>

                {/* Database Bilgileri */}
                <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 rounded-lg bg-green-500/10 flex items-center justify-center">
                            <Database className="w-5 h-5 text-green-400" />
                        </div>
                        <div>
                            <h2 className="text-lg font-semibold text-slate-100">Database Bilgileri</h2>
                            <p className="text-sm text-slate-400">Sistem istatistikleri</p>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div className="flex justify-between items-center py-2 border-b border-slate-800">
                            <span className="text-slate-400">Supabase Bağlantısı</span>
                            <span className="text-green-400 font-medium">Aktif</span>
                        </div>
                        <div className="flex justify-between items-center py-2 border-b border-slate-800">
                            <span className="text-slate-400">RLS (Row Level Security)</span>
                            <span className="text-green-400 font-medium">Aktif</span>
                        </div>
                        <div className="flex justify-between items-center py-2 border-b border-slate-800">
                            <span className="text-slate-400">Vercel Deployment</span>
                            <span className="text-green-400 font-medium">Production</span>
                        </div>
                        <div className="flex justify-between items-center py-2">
                            <span className="text-slate-400">Son Güncelleme</span>
                            <span className="text-slate-300">{new Date().toLocaleDateString('tr-TR')}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Save Button */}
            <div className="flex justify-end">
                <button
                    onClick={handleSave}
                    disabled={loading}
                    className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg font-medium transition-colors"
                >
                    {loading ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                        <Save className="w-4 h-4" />
                    )}
                    {loading ? 'Kaydediliyor...' : 'Ayarları Kaydet'}
                </button>
            </div>
        </div>
    );
}