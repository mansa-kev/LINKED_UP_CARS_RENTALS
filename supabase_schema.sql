-- ===============================================================
-- Master Database Schema: LinkedUp Cars Rentals
-- ===============================================================

-- ENUMS
DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'user_role') THEN
        CREATE TYPE user_role AS ENUM ('admin', 'fleet_owner', 'client', 'driver');
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'car_status') THEN
        CREATE TYPE car_status AS ENUM ('available', 'rented', 'maintenance', 'unavailable');
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'maintenance_status') THEN
        CREATE TYPE maintenance_status AS ENUM ('ok', 'due', 'in_progress');
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'booking_status') THEN
        CREATE TYPE booking_status AS ENUM ('pending', 'confirmed', 'completed', 'cancelled', 'pending_payment_verification');
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'transaction_type') THEN
        CREATE TYPE transaction_type AS ENUM ('payment_in', 'payout_out', 'refund');
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'transaction_status') THEN
        CREATE TYPE transaction_status AS ENUM ('pending', 'completed', 'failed');
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'fleet_owner_status') THEN
        CREATE TYPE fleet_owner_status AS ENUM ('active', 'pending_verification', 'suspended');
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'pricing_rule_type') THEN
        CREATE TYPE pricing_rule_type AS ENUM ('seasonal', 'event', 'demand_multiplier');
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'pricing_rule_status') THEN
        CREATE TYPE pricing_rule_status AS ENUM ('active', 'inactive');
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'media_type') THEN
        CREATE TYPE media_type AS ENUM ('image', 'video');
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'payment_verification_status') THEN
        CREATE TYPE payment_verification_status AS ENUM ('submitted', 'verified', 'rejected');
    END IF;
END $$;

ALTER TYPE booking_status ADD VALUE IF NOT EXISTS 'on_trip';

-- TABLES

-- 1. User Profiles
CREATE TABLE IF NOT EXISTS user_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  phone_number TEXT,
  email TEXT,
  status TEXT DEFAULT 'active',
  last_login TIMESTAMPTZ,
  role user_role NOT NULL DEFAULT 'client',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Fleet Owner Settings
CREATE TABLE IF NOT EXISTS fleet_owner_settings (
  id UUID PRIMARY KEY REFERENCES user_profiles(id) ON DELETE CASCADE,
  company_name TEXT,
  commission_rate NUMERIC DEFAULT 0.15,
  payout_method TEXT,
  payout_details JSONB,
  status fleet_owner_status DEFAULT 'pending_verification',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Cars
CREATE TABLE IF NOT EXISTS cars (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  fleet_owner_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE,
  make TEXT NOT NULL,
  model TEXT NOT NULL,
  year INTEGER,
  color TEXT,
  license_plate TEXT UNIQUE NOT NULL,
  category TEXT,
  description TEXT,
  primary_image_url TEXT,
  photos TEXT[] DEFAULT '{}',
  video_url TEXT,
  transmission TEXT,
  fuel_type TEXT,
  seats INTEGER,
  features TEXT[] DEFAULT '{}',
  location_lat NUMERIC,
  location_lon NUMERIC,
  status car_status DEFAULT 'available',
  maintenance_status maintenance_status DEFAULT 'ok',
  last_maintenance_date DATE,
  next_service_date DATE,
  daily_rate NUMERIC NOT NULL,
  overtime_rate NUMERIC DEFAULT 0,
  security_deposit NUMERIC DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Bookings
CREATE TABLE IF NOT EXISTS bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  car_id UUID REFERENCES cars(id) ON DELETE CASCADE,
  client_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE,
  fleet_owner_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  total_amount NUMERIC NOT NULL,
  platform_commission NUMERIC NOT NULL,
  status booking_status DEFAULT 'pending',
  payment_status TEXT DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Transactions
CREATE TABLE IF NOT EXISTS transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id UUID REFERENCES bookings(id) ON DELETE SET NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  type transaction_type NOT NULL,
  amount NUMERIC NOT NULL,
  currency TEXT DEFAULT 'KES',
  status transaction_status DEFAULT 'pending',
  transaction_code TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. Expenses
CREATE TABLE IF NOT EXISTS expenses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  description TEXT NOT NULL,
  amount NUMERIC NOT NULL,
  category TEXT NOT NULL,
  date DATE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. Pricing Rules
CREATE TABLE IF NOT EXISTS pricing_rules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  rule_name TEXT NOT NULL,
  type pricing_rule_type NOT NULL,
  start_date DATE,
  end_date DATE,
  multiplier NUMERIC NOT NULL,
  car_type_filter TEXT,
  status pricing_rule_status DEFAULT 'active',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. Messages
CREATE TABLE IF NOT EXISTS messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sender_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE,
  receiver_id UUID REFERENCES user_profiles(id) ON DELETE SET NULL,
  booking_id UUID REFERENCES bookings(id) ON DELETE SET NULL,
  subject TEXT,
  content TEXT NOT NULL,
  status TEXT DEFAULT 'new', -- 'new', 'open', 'resolved'
  urgency TEXT DEFAULT 'low', -- 'low', 'medium', 'high'
  read_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8.1 Broadcasts
CREATE TABLE IF NOT EXISTS broadcasts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sender_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE,
  subject TEXT NOT NULL,
  content TEXT NOT NULL,
  target_group TEXT NOT NULL, -- 'all', 'clients', 'fleet_owners'
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 9. Settings
CREATE TABLE IF NOT EXISTS settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  key TEXT UNIQUE NOT NULL,
  value JSONB NOT NULL,
  description TEXT,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 10. Hero Content
CREATE TABLE IF NOT EXISTS hero_content (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  car_id UUID REFERENCES cars(id) ON DELETE SET NULL,
  media_url TEXT NOT NULL,
  media_type media_type NOT NULL,
  display_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  overlay_text TEXT,
  deep_link_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 11. Contracts Master
CREATE TABLE IF NOT EXISTS contracts_master (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  version TEXT NOT NULL,
  pdf_url TEXT NOT NULL,
  is_active BOOLEAN DEFAULT FALSE,
  uploaded_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 12. Pending Payments
CREATE TABLE IF NOT EXISTS pending_payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id UUID REFERENCES bookings(id) ON DELETE CASCADE,
  client_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE,
  amount NUMERIC NOT NULL,
  transaction_code TEXT NOT NULL,
  status payment_verification_status DEFAULT 'submitted',
  submitted_at TIMESTAMPTZ DEFAULT NOW(),
  verified_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  verified_at TIMESTAMPTZ
);

-- 13. Coupons
CREATE TABLE IF NOT EXISTS coupons (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code TEXT UNIQUE NOT NULL,
  discount_value NUMERIC NOT NULL,
  discount_type TEXT NOT NULL DEFAULT 'percentage', -- 'percentage' or 'fixed'
  expiry_date DATE NOT NULL,
  usage_limit INTEGER DEFAULT 100,
  usage_count INTEGER DEFAULT 0,
  status TEXT DEFAULT 'active', -- 'active', 'expired', 'disabled'
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 14. Reviews
CREATE TABLE IF NOT EXISTS reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id UUID REFERENCES bookings(id) ON DELETE CASCADE,
  user_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE,
  car_id UUID REFERENCES cars(id) ON DELETE CASCADE,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  status TEXT DEFAULT 'pending', -- 'pending', 'published', 'flagged'
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 15. Reports
CREATE TABLE IF NOT EXISTS reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  category TEXT NOT NULL, -- 'financial', 'operational', 'user'
  file_url TEXT,
  status TEXT DEFAULT 'ready', -- 'ready', 'generating'
  generated_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 16. Driver Profiles
CREATE TABLE IF NOT EXISTS driver_profiles (
  id UUID PRIMARY KEY REFERENCES user_profiles(id) ON DELETE CASCADE,
  license_number TEXT,
  license_expiry DATE,
  license_status TEXT DEFAULT 'pending', -- 'pending', 'verified', 'rejected'
  id_status TEXT DEFAULT 'pending', -- 'pending', 'verified', 'rejected'
  status TEXT DEFAULT 'pending_verification', -- 'active', 'suspended', 'pending_verification'
  rating NUMERIC DEFAULT 0,
  total_trips INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ===============================================================
-- RLS POLICIES
-- ===============================================================

ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE fleet_owner_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE cars ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE expenses ENABLE ROW LEVEL SECURITY;
ALTER TABLE pricing_rules ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE hero_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE contracts_master ENABLE ROW LEVEL SECURITY;
ALTER TABLE pending_payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE coupons ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE driver_profiles ENABLE ROW LEVEL SECURITY;

-- Helper function to check if user is admin
CREATE OR REPLACE FUNCTION is_admin() RETURNS BOOLEAN AS $$
BEGIN
  RETURN (SELECT role FROM user_profiles WHERE id = auth.uid()) = 'admin';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- User Profiles Policies
DROP POLICY IF EXISTS "Admins can view all profiles" ON user_profiles;
CREATE POLICY "Admins can view all profiles" ON user_profiles FOR SELECT USING (is_admin() OR auth.uid() = id);
DROP POLICY IF EXISTS "Users can update their own profile" ON user_profiles;
CREATE POLICY "Users can update their own profile" ON user_profiles FOR UPDATE USING (auth.uid() = id);
DROP POLICY IF EXISTS "Admins can update any profile" ON user_profiles;
CREATE POLICY "Admins can update any profile" ON user_profiles FOR UPDATE USING (is_admin());

-- Cars Policies
DROP POLICY IF EXISTS "Anyone can view available cars" ON cars;
CREATE POLICY "Anyone can view available cars" ON cars FOR SELECT USING (status = 'available' OR is_admin() OR fleet_owner_id = auth.uid());
DROP POLICY IF EXISTS "Admins can manage cars" ON cars;
CREATE POLICY "Admins can manage cars" ON cars FOR ALL USING (is_admin());
DROP POLICY IF EXISTS "Owners can manage their own cars" ON cars;
CREATE POLICY "Owners can manage their own cars" ON cars FOR ALL USING (fleet_owner_id = auth.uid());

-- Bookings Policies
DROP POLICY IF EXISTS "Admins can view all bookings" ON bookings;
CREATE POLICY "Admins can view all bookings" ON bookings FOR SELECT USING (is_admin());
DROP POLICY IF EXISTS "Owners can view their car bookings" ON bookings;
CREATE POLICY "Owners can view their car bookings" ON bookings FOR SELECT USING (fleet_owner_id = auth.uid());
DROP POLICY IF EXISTS "Clients can view their own bookings" ON bookings;
CREATE POLICY "Clients can view their own bookings" ON bookings FOR SELECT USING (client_id = auth.uid());
DROP POLICY IF EXISTS "Admins can update bookings" ON bookings;
CREATE POLICY "Admins can update bookings" ON bookings FOR UPDATE USING (is_admin());

-- Transactions Policies
DROP POLICY IF EXISTS "Admins can view all transactions" ON transactions;
CREATE POLICY "Admins can view all transactions" ON transactions FOR SELECT USING (is_admin());
DROP POLICY IF EXISTS "Users can view their own transactions" ON transactions;
CREATE POLICY "Users can view their own transactions" ON transactions FOR SELECT USING (user_id = auth.uid());

-- Messages Policies
DROP POLICY IF EXISTS "Users can view their own messages" ON messages;
CREATE POLICY "Users can view their own messages" ON messages FOR SELECT USING (sender_id = auth.uid() OR receiver_id = auth.uid() OR is_admin());
DROP POLICY IF EXISTS "Users can send messages" ON messages;
CREATE POLICY "Users can send messages" ON messages FOR INSERT WITH CHECK (auth.uid() = sender_id);

-- Settings Policies
DROP POLICY IF EXISTS "Anyone can view settings" ON settings;
CREATE POLICY "Anyone can view settings" ON settings FOR SELECT USING (TRUE);
DROP POLICY IF EXISTS "Admins can manage settings" ON settings;
CREATE POLICY "Admins can manage settings" ON settings FOR ALL USING (is_admin());

-- Coupons Policies
DROP POLICY IF EXISTS "Anyone can view active coupons" ON coupons;
CREATE POLICY "Anyone can view active coupons" ON coupons FOR SELECT USING (status = 'active' OR is_admin());
DROP POLICY IF EXISTS "Admins can manage coupons" ON coupons;
CREATE POLICY "Admins can manage coupons" ON coupons FOR ALL USING (is_admin());

-- Reviews Policies
DROP POLICY IF EXISTS "Anyone can view published reviews" ON reviews;
CREATE POLICY "Anyone can view published reviews" ON reviews FOR SELECT USING (status = 'published' OR is_admin() OR user_id = auth.uid());
DROP POLICY IF EXISTS "Users can create reviews" ON reviews;
CREATE POLICY "Users can create reviews" ON reviews FOR INSERT WITH CHECK (auth.uid() = user_id);
DROP POLICY IF EXISTS "Admins can manage reviews" ON reviews;
CREATE POLICY "Admins can manage reviews" ON reviews FOR ALL USING (is_admin());

-- Reports Policies
DROP POLICY IF EXISTS "Admins can view all reports" ON reports;
CREATE POLICY "Admins can view all reports" ON reports FOR SELECT USING (is_admin());
DROP POLICY IF EXISTS "Admins can manage reports" ON reports;
CREATE POLICY "Admins can manage reports" ON reports FOR ALL USING (is_admin());

-- Driver Profiles Policies
DROP POLICY IF EXISTS "Admins can view all driver profiles" ON driver_profiles;
CREATE POLICY "Admins can view all driver profiles" ON driver_profiles FOR SELECT USING (is_admin() OR auth.uid() = id);
DROP POLICY IF EXISTS "Drivers can update their own profile" ON driver_profiles;
CREATE POLICY "Drivers can update their own profile" ON driver_profiles FOR UPDATE USING (auth.uid() = id);
DROP POLICY IF EXISTS "Admins can update any driver profile" ON driver_profiles;
CREATE POLICY "Admins can update any driver profile" ON driver_profiles FOR UPDATE USING (is_admin());

-- 17. Incidents
CREATE TABLE IF NOT EXISTS incidents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id UUID REFERENCES bookings(id) ON DELETE SET NULL,
  car_id UUID REFERENCES cars(id) ON DELETE CASCADE,
  user_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE,
  type TEXT NOT NULL, -- 'accident', 'breakdown', 'theft', 'other'
  severity TEXT NOT NULL, -- 'low', 'medium', 'high', 'critical'
  status TEXT DEFAULT 'open', -- 'open', 'in_progress', 'resolved', 'closed'
  description TEXT,
  location_text TEXT,
  location_lat NUMERIC,
  location_lon NUMERIC,
  photos TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE incidents ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Admins can view all incidents" ON incidents;
CREATE POLICY "Admins can view all incidents" ON incidents FOR SELECT USING (is_admin());
DROP POLICY IF EXISTS "Users can view their own incidents" ON incidents;
CREATE POLICY "Users can view their own incidents" ON incidents FOR SELECT USING (user_id = auth.uid() OR is_admin());
DROP POLICY IF EXISTS "Admins can manage incidents" ON incidents;
CREATE POLICY "Admins can manage incidents" ON incidents FOR ALL USING (is_admin());

-- 18. Maintenance
CREATE TABLE IF NOT EXISTS maintenance (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  car_id UUID REFERENCES cars(id) ON DELETE CASCADE,
  cost NUMERIC NOT NULL,
  description TEXT,
  date DATE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE maintenance ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Admins can manage maintenance" ON maintenance;
CREATE POLICY "Admins can manage maintenance" ON maintenance FOR ALL USING (is_admin());
DROP POLICY IF EXISTS "Owners can view their car maintenance" ON maintenance;
CREATE POLICY "Owners can view their car maintenance" ON maintenance FOR SELECT USING (EXISTS (SELECT 1 FROM cars WHERE cars.id = maintenance.car_id AND cars.fleet_owner_id = auth.uid()));

DROP TRIGGER IF EXISTS update_incidents_updated_at ON incidents;
CREATE TRIGGER update_incidents_updated_at BEFORE UPDATE ON incidents FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

-- 19. Client Documents
CREATE TABLE IF NOT EXISTS client_documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE,
  document_type TEXT NOT NULL, -- 'id', 'license'
  document_url TEXT NOT NULL,
  status TEXT DEFAULT 'pending', -- 'pending', 'approved', 'rejected'
  rejection_reason TEXT,
  uploaded_at TIMESTAMPTZ DEFAULT NOW(),
  verified_at TIMESTAMPTZ,
  verified_by UUID REFERENCES auth.users(id) ON DELETE SET NULL
);

ALTER TABLE client_documents ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Admins can manage client documents" ON client_documents;
CREATE POLICY "Admins can manage client documents" ON client_documents FOR ALL USING (is_admin());
DROP POLICY IF EXISTS "Clients can view and upload their own documents" ON client_documents;
CREATE POLICY "Clients can view and upload their own documents" ON client_documents FOR ALL USING (client_id = auth.uid());

-- 20. Damage Reports
CREATE TABLE IF NOT EXISTS damage_reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  car_id UUID REFERENCES cars(id) ON DELETE CASCADE,
  fleet_owner_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE,
  description TEXT NOT NULL,
  photos TEXT[] DEFAULT '{}',
  status TEXT DEFAULT 'pending', -- 'pending', 'resolved'
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE damage_reports ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Fleet owners can manage their damage reports" ON damage_reports;
CREATE POLICY "Fleet owners can manage their damage reports" ON damage_reports FOR ALL USING (fleet_owner_id = auth.uid());
DROP POLICY IF EXISTS "Admins can manage damage reports" ON damage_reports;
CREATE POLICY "Admins can manage damage reports" ON damage_reports FOR ALL USING (is_admin());

DROP TRIGGER IF EXISTS update_user_profiles_updated_at ON user_profiles;
CREATE TRIGGER update_user_profiles_updated_at BEFORE UPDATE ON user_profiles FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
DROP TRIGGER IF EXISTS update_fleet_owner_settings_updated_at ON fleet_owner_settings;
CREATE TRIGGER update_fleet_owner_settings_updated_at BEFORE UPDATE ON fleet_owner_settings FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
DROP TRIGGER IF EXISTS update_pricing_rules_updated_at ON pricing_rules;
CREATE TRIGGER update_pricing_rules_updated_at BEFORE UPDATE ON pricing_rules FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
DROP TRIGGER IF EXISTS update_hero_content_updated_at ON hero_content;
CREATE TRIGGER update_hero_content_updated_at BEFORE UPDATE ON hero_content FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
DROP TRIGGER IF EXISTS update_contracts_master_updated_at ON contracts_master;
CREATE TRIGGER update_contracts_master_updated_at BEFORE UPDATE ON contracts_master FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
DROP TRIGGER IF EXISTS update_driver_profiles_updated_at ON driver_profiles;
CREATE TRIGGER update_driver_profiles_updated_at BEFORE UPDATE ON driver_profiles FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
