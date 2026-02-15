-- Create Enums
CREATE TYPE user_role AS ENUM ('muazzin', 'restaurant_admin');
CREATE TYPE donation_status AS ENUM ('pending', 'approved', 'rejected');
CREATE TYPE collection_status AS ENUM ('pending', 'approved', 'collected', 'uncollected');

-- Profiles (extends Supabase Auth)
CREATE TABLE profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  role user_role NOT NULL,
  email TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Public Donations
CREATE TABLE donations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  quantity INTEGER NOT NULL CHECK (quantity > 0),
  proof_url TEXT NOT NULL,
  status donation_status DEFAULT 'pending',
  reviewed_by UUID REFERENCES profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Collection Requests (Muazzin -> Restaurant)
CREATE TABLE collection_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  quantity INTEGER NOT NULL CHECK (quantity > 0),
  target_date DATE NOT NULL,
  status collection_status DEFAULT 'pending',
  created_by UUID REFERENCES profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE donations ENABLE ROW LEVEL SECURITY;
ALTER TABLE collection_requests ENABLE ROW LEVEL SECURITY;

-- Note: For development, create permissive RLS policies for now.
CREATE POLICY "Allow all operations for now" ON donations FOR ALL USING (true);
CREATE POLICY "Allow all operations for now" ON collection_requests FOR ALL USING (true);
CREATE POLICY "Allow all operations for now" ON profiles FOR ALL USING (true);
