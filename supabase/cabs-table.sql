-- ============================================
-- CABS TABLE SETUP WITH SEED DATA
-- ============================================
-- Run this in Supabase SQL Editor to create the cabs table
-- ============================================

-- ============================================
-- STEP 1: CREATE CABS TABLE
-- ============================================

CREATE TABLE IF NOT EXISTS public.cabs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  category TEXT,
  models TEXT[] DEFAULT '{}',
  capacity_min INTEGER,
  capacity_max INTEGER,
  description TEXT,
  tags TEXT[] DEFAULT '{}',
  status TEXT CHECK (status IN ('active', 'inactive')) DEFAULT 'active' NOT NULL,
  ordering INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- ============================================
-- STEP 2: ENABLE RLS
-- ============================================

ALTER TABLE public.cabs ENABLE ROW LEVEL SECURITY;

-- ============================================
-- STEP 3: CREATE TRIGGER FOR updated_at
-- ============================================

CREATE TRIGGER IF NOT EXISTS update_cabs_updated_at
  BEFORE UPDATE ON public.cabs
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- ============================================
-- STEP 4: CREATE RLS POLICIES
-- ============================================

-- Public can view active cabs
CREATE POLICY IF NOT EXISTS "Public can view cabs"
  ON public.cabs FOR SELECT
  USING (status = 'active' OR is_admin());

-- Admins can manage cabs (all operations)
CREATE POLICY IF NOT EXISTS "Admins can manage cabs"
  ON public.cabs FOR ALL
  USING (is_admin());

-- ============================================
-- STEP 5: CREATE INDEXES
-- ============================================

CREATE INDEX IF NOT EXISTS idx_cabs_status ON public.cabs(status);
CREATE INDEX IF NOT EXISTS idx_cabs_slug ON public.cabs(slug);
CREATE INDEX IF NOT EXISTS idx_cabs_category ON public.cabs(category);

-- ============================================
-- STEP 6: GRANT PERMISSIONS
-- ============================================

GRANT SELECT ON TABLE public.cabs TO anon, authenticated;
GRANT ALL ON TABLE public.cabs TO authenticated;

-- ============================================
-- STEP 7: INSERT SEED DATA
-- ============================================

INSERT INTO public.cabs (name, slug, category, models, capacity_min, capacity_max, description, tags, status, ordering)
VALUES
  (
    'Sedan Cabs',
    'sedan',
    'Sedan',
    ARRAY['Swift Dzire', 'Toyota Etios', 'Honda Amaze'],
    2,
    3,
    'Comfortable sedans for airport transfers, Srinagar sightseeing and point‑to‑point travel across Kashmir.',
    ARRAY['AC', 'Point‑to‑point', 'Budget friendly'],
    'active',
    1
  ),
  (
    'Innova',
    'innova',
    'MPV',
    ARRAY['Toyota Innova'],
    4,
    6,
    'Spacious Innova for families and small groups who want extra legroom and luggage space on long drives.',
    ARRAY['6–7 Seater', 'AC', 'Long routes'],
    'active',
    2
  ),
  (
    'Innova Crysta',
    'innova-crysta',
    'MPV',
    ARRAY['Innova Crysta'],
    4,
    6,
    'Top‑end Crysta fleet for premium airport pickups, Gulmarg, Pahalgam and Sonamarg circuits.',
    ARRAY['Premium', 'Comfort', 'Family trips'],
    'active',
    3
  ),
  (
    'Tempo Traveller',
    'tempo-traveller',
    'Tempo Traveller',
    ARRAY['9 Seater', '12 Seater', '17 Seater'],
    8,
    17,
    'Tempo Travellers for groups, corporate movements and large family trips across Jammu & Kashmir.',
    ARRAY['Group travel', 'Sightseeing', 'Multi‑day tours'],
    'active',
    4
  )
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  category = EXCLUDED.category,
  models = EXCLUDED.models,
  capacity_min = EXCLUDED.capacity_min,
  capacity_max = EXCLUDED.capacity_max,
  description = EXCLUDED.description,
  tags = EXCLUDED.tags,
  status = EXCLUDED.status,
  ordering = EXCLUDED.ordering,
  updated_at = TIMEZONE('utc'::text, NOW());

-- ============================================
-- VERIFICATION QUERIES
-- ============================================

-- Check if table was created
SELECT 
  'Table Created' as check_type,
  CASE WHEN EXISTS (
    SELECT 1 FROM information_schema.tables 
    WHERE table_schema = 'public' AND table_name = 'cabs'
  ) THEN 'YES ✓' ELSE 'NO ✗' END as status;

-- Check RLS is enabled
SELECT 
  'RLS Enabled' as check_type,
  CASE WHEN rowsecurity THEN 'YES ✓' ELSE 'NO ✗' END as status
FROM pg_tables 
WHERE schemaname = 'public' AND tablename = 'cabs';

-- Check policies exist
SELECT 
  'Policies Created' as check_type,
  CASE WHEN COUNT(*) >= 2 THEN 'YES ✓' ELSE 'NO ✗' END as status
FROM pg_policies 
WHERE schemaname = 'public' AND tablename = 'cabs';

-- Check seed data
SELECT 
  'Seed Data' as check_type,
  CASE WHEN COUNT(*) >= 4 THEN 'YES ✓ (' || COUNT(*) || ' rows)' ELSE 'NO ✗' END as status
FROM public.cabs;

-- View all cabs
SELECT 
  id,
  name,
  slug,
  category,
  models,
  capacity_min,
  capacity_max,
  status,
  ordering
FROM public.cabs
ORDER BY ordering, name;

-- ============================================
-- COMPLETE!
-- ============================================
-- The cabs table is now ready with seed data.
-- You can manage cabs from the admin panel at /admin/cabs
-- ============================================

