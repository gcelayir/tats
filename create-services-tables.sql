-- Servis Türleri
CREATE TABLE IF NOT EXISTS service_types (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL UNIQUE,
    description TEXT,
    created_at TIMESTAMP DEFAULT NOW()
);

INSERT INTO service_types (name, description) VALUES
    ('Montaj', 'Cihaz kurulum ve montaj hizmetleri'),
    ('Arıza', 'Arıza teşhis ve onarım'),
    ('Bakım', 'Periyodik bakım ve kontrol'),
    ('Diğer', 'Diğer servis türleri')
ON CONFLICT DO NOTHING;

-- Servis Durumları
CREATE TABLE IF NOT EXISTS service_statuses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL UNIQUE,
    color TEXT,
    created_at TIMESTAMP DEFAULT NOW()
);

INSERT INTO service_statuses (name, color) VALUES
    ('Açık', 'emerald'),
    ('İşlemde', 'blue'),
    ('Tamamlandı', 'green'),
    ('İptal', 'red')
ON CONFLICT DO NOTHING;

-- Servis Paket Türleri
CREATE TABLE IF NOT EXISTS service_packages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL UNIQUE,
    description TEXT,
    created_at TIMESTAMP DEFAULT NOW()
);

INSERT INTO service_packages (name, description) VALUES
    ('Ücretli', 'Ücretli servis'),
    ('Garanti Kapsamında', 'Garanti kapsamında ücretsiz servis'),
    ('Bakım Anlaşması', 'Bakım anlaşması kapsamında servis')
ON CONFLICT DO NOTHING;

-- Servis Aşamaları
CREATE TABLE IF NOT EXISTS service_stages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL UNIQUE,
    order_num INT NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);

INSERT INTO service_stages (name, order_num) VALUES
    ('Kayıt', 1),
    ('Tespit', 2),
    ('Kapanış', 3)
ON CONFLICT DO NOTHING;

-- Ana Servisler Tablosu
CREATE TABLE IF NOT EXISTS services (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    customer_id UUID NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
    service_type_id UUID NOT NULL REFERENCES service_types(id),
    service_package_id UUID NOT NULL REFERENCES service_packages(id),
    
    current_stage_id UUID NOT NULL REFERENCES service_stages(id),
    
    notification_date DATE NOT NULL,
    customer_request TEXT NOT NULL,
    
    -- Tespit Aşaması
    technical_assessment TEXT,
    assessment_completed_at TIMESTAMP,
    
    -- Kapanış Aşaması
    start_date TIMESTAMP,
    end_date TIMESTAMP,
    works_performed TEXT,
    physical_form_number TEXT,
    completion_notes TEXT,
    completion_completed_at TIMESTAMP,
    
    -- İptal Durumu
    is_cancelled BOOLEAN DEFAULT FALSE,
    
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Servis Cihazları (Bir serviste birden fazla cihaz olabilir)
CREATE TABLE IF NOT EXISTS service_devices (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    service_id UUID NOT NULL REFERENCES services(id) ON DELETE CASCADE,
    device_brand TEXT NOT NULL,
    device_model TEXT NOT NULL,
    device_serial TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Servis Fotoları (Tespit Aşaması)
CREATE TABLE IF NOT EXISTS service_photos_assessment (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    service_id UUID NOT NULL REFERENCES services(id) ON DELETE CASCADE,
    photo_url TEXT NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Servis Fotoları (Kapanış Aşaması)
CREATE TABLE IF NOT EXISTS service_photos_completion (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    service_id UUID NOT NULL REFERENCES services(id) ON DELETE CASCADE,
    photo_url TEXT NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT NOW()
);

-- RLS Politikaları (Tüm tablolar için)
ALTER TABLE service_types DISABLE ROW LEVEL SECURITY;
ALTER TABLE service_statuses DISABLE ROW LEVEL SECURITY;
ALTER TABLE service_packages DISABLE ROW LEVEL SECURITY;
ALTER TABLE service_stages DISABLE ROW LEVEL SECURITY;
ALTER TABLE services DISABLE ROW LEVEL SECURITY;
ALTER TABLE service_devices DISABLE ROW LEVEL SECURITY;
ALTER TABLE service_photos_assessment DISABLE ROW LEVEL SECURITY;
ALTER TABLE service_photos_completion DISABLE ROW LEVEL SECURITY;
