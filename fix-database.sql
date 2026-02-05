-- Services tablosunu basitleştir - ID'ler yerine direkt text kullan
ALTER TABLE services 
DROP COLUMN IF EXISTS service_type_id,
DROP COLUMN IF EXISTS service_package_id,
DROP COLUMN IF EXISTS current_stage_id;

-- Text kolonları ekle
ALTER TABLE services 
ADD COLUMN IF NOT EXISTS service_type TEXT DEFAULT 'Onarım',
ADD COLUMN IF NOT EXISTS package_type TEXT DEFAULT 'Standart',
ADD COLUMN IF NOT EXISTS description TEXT;

-- Customers tablosunu kontrol et ve düzelt
ALTER TABLE customers 
ADD COLUMN IF NOT EXISTS name TEXT,
ADD COLUMN IF NOT EXISTS phone TEXT,
ADD COLUMN IF NOT EXISTS email TEXT,
ADD COLUMN IF NOT EXISTS address TEXT,
ADD COLUMN IF NOT EXISTS company TEXT;

-- Eski kolonları kaldır (varsa)
ALTER TABLE customers 
DROP COLUMN IF EXISTS full_name,
DROP COLUMN IF EXISTS company_name;

-- RLS'i kapat
ALTER TABLE customers DISABLE ROW LEVEL SECURITY;
ALTER TABLE services DISABLE ROW LEVEL SECURITY;

-- Test verisi ekle
INSERT INTO customers (name, phone, email) VALUES
('Test Müşteri', '0555 123 4567', 'test@example.com')
ON CONFLICT DO NOTHING;
