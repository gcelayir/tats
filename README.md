# 🔧 TATS - Teknik Servis Yönetim Sistemi

Modern, responsive ve kullanıcı dostu teknik servis yönetim uygulaması.

## ✨ Özellikler

- 🔐 **Güvenli Authentication** - Supabase Auth
- 📱 **Responsive Tasarım** - Mobile-first approach
- ⚡ **Real-time Updates** - Optimistic UI
- 🎯 **3-Stage Service Management** - Kayıt → Tespit → Kapanış
- 👥 **Customer Management** - Müşteri kayıt ve takip
- 📊 **Dashboard & Analytics** - İstatistik ve raporlama
- 🌙 **Dark Theme** - Modern arayüz

## 🚀 Teknolojiler

- **Framework**: Next.js 16 (App Router)
- **Database**: Supabase (PostgreSQL)
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Deployment**: Vercel
- **Language**: TypeScript

## 📦 Kurulum

### 1. Repository'yi Clone Et
```bash
git clone https://github.com/your-username/tats.git
cd tats
```

### 2. Dependencies Yükle
```bash
npm install
```

### 3. Environment Variables
`.env.local` dosyası oluştur:
```bash
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 4. Development Server
```bash
npm run dev
```

Uygulama `http://localhost:3000` adresinde çalışacak.

## 🌐 Vercel Deployment

### 1. GitHub'a Push
```bash
git add .
git commit -m "Ready for deployment"
git push origin main
```

### 2. Vercel'e Deploy
1. [vercel.com](https://vercel.com) → Sign up with GitHub
2. Import project → Select repository
3. Environment variables ekle:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
4. Deploy!

## 📊 Database Schema

### Tables
- `customers` - Müşteri bilgileri
- `services` - Servis kayıtları
- `service_types` - Servis türleri
- `service_packages` - Servis paketleri
- `service_stages` - Servis aşamaları
- `service_devices` - Cihaz bilgileri
- `profiles` - Kullanıcı profilleri

## 🔧 Scripts

```bash
npm run dev      # Development server
npm run build    # Production build
npm run start    # Production server
npm run lint     # ESLint check
```

## 📱 Responsive Breakpoints

- **Mobile**: < 640px
- **Tablet**: 640px - 1024px
- **Desktop**: > 1024px

## 🎯 Kullanım

### Admin Panel
- Dashboard: Genel istatistikler
- Servisler: 3-aşamalı servis yönetimi
- Müşteriler: Müşteri kayıt ve düzenleme
- Kullanıcılar: Sistem kullanıcı yönetimi

### User Dashboard
- Profil yönetimi
- Servis geçmişi
- Bildirimler

## 🔐 Authentication

- Email/Password ile giriş
- Role-based access (admin/user)
- Supabase RLS policies
- Client-side auth guard

## 📄 License

MIT License - Detaylar için `LICENSE` dosyasına bakın.

## 🤝 Contributing

1. Fork the project
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## 📞 İletişim

- **Website**: https://teknoasteknoloji.com
- **Email**: info@teknoasteknoloji.com

---

**TATS** ile teknik servis süreçlerinizi dijitalleştirin! 🚀