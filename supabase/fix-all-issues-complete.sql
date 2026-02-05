-- ============================================
-- COMPLETE FIX FOR PACKAGES & BOOKINGS RLS
-- ============================================
-- Run this ENTIRE script in Supabase SQL Editor
-- This fixes both packages dropdown and bookings RLS issues
-- ============================================

-- ============================================
-- PART 1: FIX PACKAGES RLS FOR ANONYMOUS ACCESS
-- ============================================

-- Step 1: Ensure RLS is enabled
ALTER TABLE public.packages ENABLE ROW LEVEL SECURITY;

-- Step 2: Drop existing SELECT policy
DROP POLICY IF EXISTS "Public can view packages" ON public.packages;

-- Step 3: Grant SELECT permission to anon role
GRANT SELECT ON TABLE public.packages TO anon;
GRANT SELECT ON TABLE public.packages TO authenticated;

-- Step 4: Create SELECT policy that explicitly allows anonymous users
-- This policy allows anyone to view active packages
CREATE POLICY "Public can view packages"
  ON public.packages 
  FOR SELECT
  TO anon, authenticated
  USING (status = 'active');

-- Step 5: Keep admin policy for managing packages
DROP POLICY IF EXISTS "Admins can manage packages" ON public.packages;
CREATE POLICY "Admins can manage packages"
  ON public.packages 
  FOR ALL
  USING (is_admin());

-- ============================================
-- PART 2: FIX BOOKINGS RLS FOR ANONYMOUS INSERT
-- ============================================

-- Step 1: Ensure RLS is enabled
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;

-- Step 2: Drop ALL existing policies
DROP POLICY IF EXISTS "Public can create bookings" ON public.bookings;
DROP POLICY IF EXISTS "Users can view own bookings" ON public.bookings;
DROP POLICY IF EXISTS "Admins can view all bookings" ON public.bookings;
DROP POLICY IF EXISTS "Admins can update bookings" ON public.bookings;
DROP POLICY IF EXISTS "Admins can delete bookings" ON public.bookings;

-- Step 3: Revoke and re-grant permissions
REVOKE ALL ON TABLE public.bookings FROM anon;
REVOKE ALL ON TABLE public.bookings FROM authenticated;

-- CRITICAL: Grant INSERT to anon role
GRANT INSERT ON TABLE public.bookings TO anon;
GRANT INSERT ON TABLE public.bookings TO authenticated;
GRANT SELECT ON TABLE public.bookings TO authenticated;
GRANT UPDATE ON TABLE public.bookings TO authenticated;
GRANT DELETE ON TABLE public.bookings TO authenticated;

-- Step 4: Create INSERT policy - MOST PERMISSIVE
CREATE POLICY "Public can create bookings"
  ON public.bookings 
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- Step 5: Create SELECT policy for authenticated users
CREATE POLICY "Users can view own bookings"
  ON public.bookings 
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Step 6: Create SELECT policy for admins
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

-- Step 7: Create UPDATE policy for admins
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

-- Step 8: Create DELETE policy for admins
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

-- ============================================
-- PART 3: VERIFICATION
-- ============================================

-- Verify Packages RLS
SELECT 
  'Packages RLS' as check_type,
  CASE WHEN rowsecurity THEN 'ENABLED ✓' ELSE 'DISABLED ✗' END as status
FROM pg_tables 
WHERE schemaname = 'public' AND tablename = 'packages'

UNION ALL

SELECT 
  'Packages SELECT Policy' as check_type,
  CASE 
    WHEN EXISTS (
      SELECT 1 FROM pg_policies 
      WHERE schemaname = 'public' 
        AND tablename = 'packages' 
        AND cmd = 'SELECT'
        AND 'anon' = ANY(roles)
    )
    THEN 'EXISTS ✓'
    ELSE 'MISSING ✗'
  END as status

UNION ALL

SELECT 
  'Packages Anon SELECT' as check_type,
  CASE 
    WHEN has_table_privilege('anon', 'public.packages', 'SELECT')
    THEN 'GRANTED ✓'
    ELSE 'NOT GRANTED ✗'
  END as status

UNION ALL

-- Verify Bookings RLS
SELECT 
  'Bookings RLS' as check_type,
  CASE WHEN rowsecurity THEN 'ENABLED ✓' ELSE 'DISABLED ✗' END as status
FROM pg_tables 
WHERE schemaname = 'public' AND tablename = 'bookings'

UNION ALL

SELECT 
  'Bookings INSERT Policy' as check_type,
  CASE 
    WHEN EXISTS (
      SELECT 1 FROM pg_policies 
      WHERE schemaname = 'public' 
        AND tablename = 'bookings' 
        AND cmd = 'INSERT'
        AND 'anon' = ANY(roles)
        AND with_check = 'true'
    )
    THEN 'EXISTS ✓'
    ELSE 'MISSING ✗'
  END as status

UNION ALL

SELECT 
  'Bookings Anon INSERT' as check_type,
  CASE 
    WHEN has_table_privilege('anon', 'public.bookings', 'INSERT')
    THEN 'GRANTED ✓'
    ELSE 'NOT GRANTED ✗'
  END as status;

-- ============================================
-- EXPECTED RESULTS:
-- ============================================
-- All checks should show ✓:
-- 1. Packages RLS: ENABLED ✓
-- 2. Packages SELECT Policy: EXISTS ✓
-- 3. Packages Anon SELECT: GRANTED ✓
-- 4. Bookings RLS: ENABLED ✓
-- 5. Bookings INSERT Policy: EXISTS ✓
-- 6. Bookings Anon INSERT: GRANTED ✓
-- ============================================

