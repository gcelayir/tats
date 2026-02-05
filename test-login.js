
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

async function testLogin() {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseKey) {
        console.error('URL veya Key eksik.');
        return;
    }

    console.log('Login testi başlatılıyor...');
    console.log('URL:', supabaseUrl);

    const supabase = createClient(supabaseUrl, supabaseKey);

    const email = 'teknik@teknoasteknoloji.com';
    const password = '123456';

    console.log(`Giriş deneniyor: ${email}`);

    const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
    });

    if (error) {
        console.error('❌ GİRİŞ BAŞARISIZ!');
        console.error('Hata Mesajı:', error.message);
        console.error('Hata Kodu:', error.status);
        console.error('Tam Hata:', JSON.stringify(error, null, 2));

        if (error.message.includes('Database error')) {
            console.log('\n--- ANALİZ ---');
            console.log('Bu hata Supabase veritabanı veya Auth servisinde bir sorun olduğunu gösteriyor.');
            console.log('Kodunuzda bir sorun yok, sunucu tarafında bir bozukluk var.');
        }
    } else {
        console.log('✅ GİRİŞ BAŞARILI!');
        console.log('User ID:', data.user.id);
        console.log('Session alındı.');
    }
}

testLogin();
