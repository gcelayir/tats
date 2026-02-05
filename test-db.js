
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

async function testConnection() {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseKey) {
        console.error('Kritik: .env.local dosyasında URL veya Key eksik!');
        return;
    }

    console.log('Bağlantı deneniyor:', supabaseUrl);
    const supabase = createClient(supabaseUrl, supabaseKey);

    try {
        const { data, error } = await supabase.from('profiles').select('count', { count: 'exact', head: true });

        if (error) {
            console.error('Supabase Hatası:', error.message);
            console.error('Hata Detayı:', error);
        } else {
            console.log('Bağlantı Başarılı! Profiles tablosuna erişildi.');
        }
    } catch (err) {
        console.error('Beklenmeyen Hata:', err.message);
    }
}

testConnection();
