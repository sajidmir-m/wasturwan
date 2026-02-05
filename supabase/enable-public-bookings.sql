-- ============================================
-- ENABLE PUBLIC BOOKINGS (NO AUTH REQUIRED)
-- ============================================
-- Run this ENTIRE script in Supabase SQL Editor
-- This allows anonymous users to create bookings
-- ============================================

-- Step 1: Ensure RLS is enabled on bookings table
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;

-- Step 2: Grant schema usage to anonymous users (CRITICAL!)
GRANT USAGE ON SCHEMA public TO anon;
GRANT USAGE ON SCHEMA public TO authenticated;

-- Step 3: Grant specific permissions (not ALL, for security)
GRANT INSERT ON TABLE public.bookings TO anon;
GRANT INSERT ON TABLE public.bookings TO authenticated;
GRANT SELECT ON TABLE public.bookings TO authenticated;
GRANT UPDATE ON TABLE public.bookings TO authenticated;
GRANT DELETE ON TABLE public.bookings TO authenticated;

-- Step 4: Grant sequence usage for UUID generation
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO anon;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO authenticated;

-- Step 5: Drop existing restrictive policies (clean slate)
DROP POLICY IF EXISTS "Public can create bookings" ON public.bookings;
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON public.bookings;
DROP POLICY IF EXISTS "Allow anonymous bookings" ON public.bookings;
DROP POLICY IF EXISTS "anon_insert_bookings" ON public.bookings;
DROP POLICY IF EXISTS "Users can view own bookings" ON public.bookings;
DROP POLICY IF EXISTS "Admins can view all bookings" ON public.bookings;
DROP POLICY IF EXISTS "Admins can update bookings" ON public.bookings;
DROP POLICY IF EXISTS "Admins can delete bookings" ON public.bookings;

-- Step 6: Create the INSERT policy for anonymous users
-- This allows ANYONE (including anonymous users) to insert bookings
-- WITH CHECK (true) means no restrictions on what can be inserted
CREATE POLICY "Public can create bookings"
  ON public.bookings 
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- Step 7: Create SELECT policy for authenticated users (their own bookings)
CREATE POLICY "Users can view own bookings"
  ON public.bookings 
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Step 8: Create SELECT policy for admins (all bookings)
CREATE POLICY "Admins can view all bookings"
  ON public.bookings 
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.users 
      WHERE id = auth.uid() 
      AND role = 'admin'
    )
  );

-- Step 9: Create UPDATE policy for admins
CREATE POLICY "Admins can update bookings"
  ON public.bookings 
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.users 
      WHERE id = auth.uid() 
      AND role = 'admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.users 
      WHERE id = auth.uid() 
      AND role = 'admin'
    )
  );

-- Step 10: Create DELETE policy for admins
CREATE POLICY "Admins can delete bookings"
  ON public.bookings 
  FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.users 
      WHERE id = auth.uid() 
      AND role = 'admin'
    )
  );

-- Step 11: Verify the setup
SELECT 
  'RLS Status' as check_type,
  CASE WHEN rowsecurity THEN 'ENABLED ✓' ELSE 'DISABLED ✗' END as status
FROM pg_tables 
WHERE schemaname = 'public' AND tablename = 'bookings'

UNION ALL

SELECT 
  'INSERT Policy' as check_type,
  CASE 
    WHEN COUNT(*) > 0 THEN 'EXISTS ✓' 
    ELSE 'MISSING ✗' 
  END as status
FROM pg_policies 
WHERE schemaname = 'public' 
  AND tablename = 'bookings' 
  AND cmd = 'INSERT'
  AND 'anon' = ANY(roles)

UNION ALL

SELECT 
  'Grants to anon' as check_type,
  CASE 
    WHEN has_table_privilege('anon', 'public.bookings', 'INSERT') 
    THEN 'GRANTED ✓' 
    ELSE 'NOT GRANTED ✗' 
  END as status;

-- ============================================
-- EXPECTED RESULTS:
-- ============================================
-- After running this script, you should see:
-- 1. RLS Status: ENABLED ✓
-- 2. INSERT Policy: EXISTS ✓
-- 3. Grants to anon: GRANTED ✓
-- ============================================
