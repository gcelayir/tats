'use client';

import { supabase } from '@/lib/supabase';
import { showToast } from '@/components/toast';

export async function createUser(email: string, password: string, role: string) {
  try {
    const { data: user, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { role }
      }
    });

    if (error) {
      throw error;
    }

    showToast('Kullanıcı oluşturuldu.', 'success');
    return { success: true };
  } catch (error: any) {
    showToast('Kullanıcı oluşturulurken hata: ' + error.message, 'error');
    return { success: false, error: error.message };
  }
}

export async function deleteUser(userId: string) {
  try {
    const { error } = await supabase
      .from('profiles')
      .delete()
      .eq('id', userId);

    if (error) {
      throw error;
    }

    showToast('Kullanıcı silindi.', 'success');
    return { success: true };
  } catch (error: any) {
    showToast('Kullanıcı silinirken hata: ' + error.message, 'error');
    return { success: false, error: error.message };
  }
}

export async function createCustomer(customerData: any) {
  try {
    const { error } = await supabase.from('customers').insert(customerData);

    if (error) {
      throw error;
    }

    showToast('Müşteri kaydedildi.', 'success');
    return { success: true };
  } catch (error: any) {
    showToast('Müşteri kaydedilirken hata: ' + error.message, 'error');
    return { success: false, error: error.message };
  }
}

export async function updateCustomer(customerId: string, customerData: any) {
  try {
    const { error } = await supabase
      .from('customers')
      .update(customerData)
      .eq('id', customerId);

    if (error) {
      throw error;
    }

    showToast('Müşteri güncellendi.', 'success');
    return { success: true };
  } catch (error: any) {
    showToast('Müşteri güncellenirken hata: ' + error.message, 'error');
    return { success: false, error: error.message };
  }
}

export async function createService(serviceData: any, devices: any[] = []) {
  try {
    const { data: service, error: serviceError } = await supabase
      .from('services')
      .insert(serviceData)
      .select()
      .single();

    if (serviceError) {
      throw serviceError;
    }

    if (devices.length > 0) {
      const devicesWithServiceId = devices.map(device => ({
        ...device,
        service_id: service.id
      }));

      const { error: devicesError } = await supabase
        .from('service_devices')
        .insert(devicesWithServiceId);

      if (devicesError) {
        console.error('Cihaz ekleme hatası:', devicesError);
      }
    }

    showToast('Servis kaydedildi.', 'success');
    return { success: true, serviceId: service.id };
  } catch (error: any) {
    showToast('Servis kaydedilirken hata: ' + error.message, 'error');
    return { success: false, error: error.message };
  }
}

export async function signOut() {
  try {
    const { error } = await supabase.auth.signOut();
    if (error) {
      throw error;
    }
    showToast('Çıkış yapıldı.', 'success');
    return { success: true };
  } catch (error: any) {
    showToast('Çıkış yapılırken hata: ' + error.message, 'error');
    return { success: false, error: error.message };
  }
}

export async function updateProfile(profileData: any) {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Kullanıcı bulunamadı');

    const { error } = await supabase
      .from('profiles')
      .update(profileData)
      .eq('id', user.id);

    if (error) {
      throw error;
    }

    showToast('Profil güncellendi.', 'success');
    return { success: true };
  } catch (error: any) {
    showToast('Profil güncellenirken hata: ' + error.message, 'error');
    return { success: false, error: error.message };
  }
}

export async function updatePassword(currentPassword: string, newPassword: string) {
  try {
    const { error } = await supabase.auth.updateUser({
      password: newPassword
    });

    if (error) {
      throw error;
    }

    showToast('Şifre güncellendi.', 'success');
    return { success: true };
  } catch (error: any) {
    showToast('Şifre güncellenirken hata: ' + error.message, 'error');
    return { success: false, error: error.message };
  }
}