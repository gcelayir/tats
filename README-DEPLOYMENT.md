# TATS Uygulaması Deployment Rehberi

## 🎯 Hedef URL
`https://teknoasteknoloji.com/ts`

## 📦 Deployment Adımları

### 1. Build ve Package Hazırlama
```bash
# Projeyi build et
npm run build

# Deploy scripti çalıştır (Linux/Mac)
./deploy.sh

# Windows için manuel:
npm run build
mkdir deploy-package
# Dosyaları kopyala (aşağıda detay)
```

### 2. Sunucuya Upload
`deploy-package` klasörünün içeriğini sunucudaki `/var/www/html/ts/` klasörüne yükle.

### 3. Sunucuda Kurulum
```bash
cd /var/www/html/ts
npm install --production
pm2 start ecosystem.config.js
```

### 4. Nginx Konfigürasyonu
`/etc/nginx/sites-available/default` dosyasına ekle:

```nginx
location /ts/ {
    proxy_pass http://localhost:3001/ts/;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection 'upgrade';
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
    proxy_cache_bypass $http_upgrade;
}
```

Nginx'i yeniden başlat:
```bash
sudo nginx -t
sudo systemctl reload nginx
```

## 📁 Deploy Package İçeriği
- `.next/` - Build çıktısı
- `public/` - Static dosyalar
- `package.json` - Dependencies
- `package-lock.json` - Lock file
- `next.config.ts` - Next.js config
- `.env.local` - Environment variables
- `ecosystem.config.js` - PM2 config
- `server.js` - Custom server

## 🔧 Konfigürasyon Detayları

### Next.js Config
- `basePath: '/ts'` - URL path prefix
- `assetPrefix: '/ts'` - Asset URL prefix
- `output: 'standalone'` - Standalone build
- `images.unoptimized: true` - Optimizasyon kapalı

### PM2 Config
- Port: 3001
- Process name: tats-app
- Auto restart: enabled
- Memory limit: 1GB

## 🚀 Hızlı Deployment
1. `npm run build`
2. `deploy-package` klasörünü sunucuya yükle
3. `cd /var/www/html/ts && npm install --production`
4. `pm2 start ecosystem.config.js`
5. Nginx config ekle ve reload

## 🔍 Troubleshooting
- PM2 status: `pm2 status`
- PM2 logs: `pm2 logs tats-app`
- Nginx test: `sudo nginx -t`
- Port kontrolü: `netstat -tlnp | grep 3001`

## 📱 Test
Deployment sonrası test et:
- `https://teknoasteknoloji.com/ts` - Ana sayfa
- `https://teknoasteknoloji.com/ts/login` - Login
- `https://teknoasteknoloji.com/ts/admin` - Admin panel