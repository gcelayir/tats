# Database Düzeltme Adımları

## Sorun
Database'de tablo yapısı ile kod arasında uyumsuzluk var. Kod basit text alanlar bekliyor ama database ID'lerle çalışıyor.

## Çözüm

### 1. Supabase Dashboard'a Git
https://supabase.com/dashboard

### 2. SQL Editor'ü Aç
Sol menüden "SQL Editor" seçeneğine tıkla

### 3. Aşağıdaki SQL'i Çalıştır

```sql
-- Services tablosunu basitleştir
ALTER TABLE services 
DROP COLUMN IF EXISTS service_type_id CASCADE,
DROP COLUMN IF EXISTS service_package_id CASCADE,
DROP COLUMN IF EXISTS current_stage_id CASCADE;

ALTER TABLE services 
ADD COLUMN IF NOT EXISTS service_type TEXT DEFAULT 'Onarım',
ADD COLUMN IF NOT EXISTS package_type TEXT DEFAULT 'Standart',
ADD COLUMN IF NOT EXISTS description TEXT;

-- Customers tablosunu düzelt
ALTER TABLE customers 
ADD COLUMN IF NOT EXISTS name TEXT,
ADD COLUMN IF NOT EXISTS phone TEXT,
ADD COLUMN IF NOT EXISTS email TEXT,
ADD COLUMN IF NOT EXISTS address TEXT,
ADD COLUMN IF NOT EXISTS company TEXT;

-- Eski kolonları kaldır
ALTER TABLE customers 
DROP COLUMN IF EXISTS full_name CASCADE,
DROP COLUMN IF EXISTS company_name CASCADE;

-- RLS'i kapat (geliştirme için)
ALTER TABLE customers DISABLE ROW LEVEL SECURITY;
ALTER TABLE services DISABLE ROW LEVEL SECURITY;

-- Test verisi
INSERT INTO customers (name, phone, email) VALUES
('Test Müşteri', '0555 123 4567', 'test@example.com')
ON CONFLICT DO NOTHING;
```

### 4. "Run" Butonuna Bas

### 5. Sayfayı Yenile
Artık müşteriler ve servisler düzgün görünecek!

## Alternatif: Tabloları Sıfırdan Oluştur

Eğer yukarıdaki çalışmazsa, tabloları tamamen sil ve yeniden oluştur:

```sql
-- Önce bağımlı tabloları sil
DROP TABLE IF EXISTS service_devices CASCADE;
DROP TABLE IF EXISTS service_photos_assessment CASCADE;
DROP TABLE IF EXISTS service_photos_completion CASCADE;
DROP TABLE IF EXISTS services CASCADE;

-- Lookup tablolarını sil
DROP TABLE IF EXISTS service_types CASCADE;
DROP TABLE IF EXISTS service_statuses CASCADE;
DROP TABLE IF EXISTS service_packages CASCADE;
DROP TABLE IF EXISTS service_stages CASCADE;

-- Customers tablosunu düzelt
DROP TABLE IF EXISTS customers CASCADE;

CREATE TABLE customers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    phone TEXT NOT NULL,
    email TEXT,
    address TEXT,
    company TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Services tablosunu basit yap
CREATE TABLE services (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    customer_id UUID NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
    service_type TEXT DEFAULT 'Onarım',
    package_type TEXT DEFAULT 'Standart',
    notification_date DATE DEFAULT CURRENT_DATE,
    description TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- RLS'i kapat
ALTER TABLE customers DISABLE ROW LEVEL SECURITY;
ALTER TABLE services DISABLE ROW LEVEL SECURITY;

-- Test verisi
INSERT INTO customers (name, phone, email) VALUES
('Test Müşteri 1', '0555 123 4567', 'test1@example.com'),
('Test Müşteri 2', '0555 987 6543', 'test2@example.com');

INSERT INTO services (customer_id, service_type, package_type, description)
SELECT id, 'Onarım', 'Standart', 'Test servis kaydı'
FROM customers LIMIT 1;
```

## Kontrol Et

SQL Editor'de şunu çalıştır:
```sql
SELECT * FROM customers;
SELECT * FROM services;
```

Eğer veriler görünüyorsa başarılı! 🎉
