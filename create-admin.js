
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

async function createAdmin() {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !serviceRoleKey) {
        console.error('HATA: .env.local dosyasında keyler eksik!');
        return;
    }

    const supabase = createClient(supabaseUrl, serviceRoleKey);

    const email = 'teknik@teknoasteknoloji.com';
    const password = '123456';

    console.log(`Kullanıcı oluşturuluyor: ${email}...`);

    const { data, error } = await supabase.auth.admin.createUser({
        email,
        password,
        email_confirm: true,
        user_metadata: { full_name: 'Teknik Admin' }
    });

    if (error) {
        console.error('HATA:', error.message);
    } else {
        console.log('✅ Kullanıcı oluşturuldu! ID:', data.user.id);

        // Rolü admin yap
        const { error: profileError } = await supabase
            .from('profiles')
            .update({ role: 'admin' })
            .eq('id', data.user.id);

        if (profileError) {
            console.log('Profil güncelleme hatası (Manuel yapmanız gerekebilir):', profileError.message);
        } else {
            console.log('✅ Profil rolü "Admin" yapıldı.');
        }
    }
}

createAdmin();
