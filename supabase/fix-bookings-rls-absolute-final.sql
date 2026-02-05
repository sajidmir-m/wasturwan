-- ============================================
-- ABSOLUTE FINAL FIX FOR BOOKINGS RLS
-- ============================================
-- This script completely resets and fixes bookings RLS
-- Run this ENTIRE script in Supabase SQL Editor
-- ============================================

-- ============================================
-- STEP 1: DIAGNOSTIC - Check current state
-- ============================================

SELECT '=== CURRENT STATE ===' as info;

-- Check RLS status
SELECT 'RLS Status' as check_type, rowsecurity as enabled
FROM pg_tables 
WHERE schemaname = 'public' AND tablename = 'bookings';

-- Check existing policies
SELECT 'Existing Policies' as check_type, policyname, cmd, roles::text
FROM pg_policies 
WHERE schemaname = 'public' AND tablename = 'bookings';

-- Check grants
SELECT 'Current Grants' as check_type, grantee, privilege_type
FROM information_schema.table_privileges
WHERE table_schema = 'public' 
  AND table_name = 'bookings'
  AND grantee IN ('anon', 'authenticated');

-- ============================================
-- STEP 2: COMPLETE RESET
-- ============================================

SELECT '=== RESETTING ===' as info;

-- Disable RLS
ALTER TABLE public.bookings DISABLE ROW LEVEL SECURITY;

-- Drop ALL policies
DO $$ 
DECLARE
  r RECORD;
BEGIN
  FOR r IN (SELECT policyname FROM pg_policies WHERE schemaname = 'public' AND tablename = 'bookings') LOOP
    EXECUTE format('DROP POLICY IF EXISTS %I ON public.bookings', r.policyname);
  END LOOP;
END $$;

-- Revoke ALL
REVOKE ALL ON TABLE public.bookings FROM anon;
REVOKE ALL ON TABLE public.bookings FROM authenticated;
REVOKE ALL ON TABLE public.bookings FROM public;

-- ============================================
-- STEP 3: GRANT PERMISSIONS
-- ============================================

SELECT '=== GRANTING PERMISSIONS ===' as info;

-- CRITICAL: Grant INSERT to anon
GRANT INSERT ON TABLE public.bookings TO anon;
GRANT INSERT ON TABLE public.bookings TO authenticated;

-- Grant other permissions
GRANT SELECT ON TABLE public.bookings TO authenticated;
GRANT UPDATE ON TABLE public.bookings TO authenticated;
GRANT DELETE ON TABLE public.bookings TO authenticated;

-- Grant schema usage
GRANT USAGE ON SCHEMA public TO anon;
GRANT USAGE ON SCHEMA public TO authenticated;

-- ============================================
-- STEP 4: RE-ENABLE RLS
-- ============================================

SELECT '=== ENABLING RLS ===' as info;

ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;

-- ============================================
-- STEP 5: CREATE POLICIES (IN CORRECT ORDER)
-- ============================================

SELECT '=== CREATING POLICIES ===' as info;

-- Policy 1: INSERT for anon and authenticated
-- This MUST be the most permissive - WITH CHECK (true) means allow everything
CREATE POLICY "Public can create bookings"
  ON public.bookings 
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- Policy 2: SELECT for authenticated users (own bookings)
CREATE POLICY "Users can view own bookings"
  ON public.bookings 
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Policy 3: SELECT for admins (all bookings)
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

-- Policy 4: UPDATE for admins
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

-- Policy 5: DELETE for admins
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
-- STEP 6: VERIFICATION
-- ============================================

SELECT '=== VERIFICATION ===' as info;

-- Check RLS
SELECT 
  'RLS Enabled' as check_type,
  CASE WHEN rowsecurity THEN 'YES ✓' ELSE 'NO ✗' END as status
FROM pg_tables 
WHERE schemaname = 'public' AND tablename = 'bookings'

UNION ALL

-- Check INSERT policy
SELECT 
  'INSERT Policy' as check_type,
  CASE 
    WHEN EXISTS (
      SELECT 1 FROM pg_policies 
      WHERE schemaname = 'public' 
        AND tablename = 'bookings' 
        AND cmd = 'INSERT'
        AND 'anon' = ANY(roles)
        AND with_check::text = 'true'
    )
    THEN 'EXISTS & CORRECT ✓'
    ELSE 'MISSING OR INCORRECT ✗'
  END as status

UNION ALL

-- Check anon INSERT permission
SELECT 
  'Anon INSERT Grant' as check_type,
  CASE 
    WHEN has_table_privilege('anon', 'public.bookings', 'INSERT')
    THEN 'GRANTED ✓'
    ELSE 'NOT GRANTED ✗'
  END as status

UNION ALL

-- Check schema usage
SELECT 
  'Anon Schema USAGE' as check_type,
  CASE 
    WHEN has_schema_privilege('anon', 'public', 'USAGE')
    THEN 'GRANTED ✓'
    ELSE 'NOT GRANTED ✗'
  END as status

UNION ALL

-- Show policy details
SELECT 
  'Policy Details' as check_type,
  CONCAT(
    'Name: ', policyname, 
    ' | Roles: ', array_to_string(roles, ','),
    ' | WITH CHECK: ', COALESCE(with_check::text, 'null')
  ) as status
FROM pg_policies 
WHERE schemaname = 'public' 
  AND tablename = 'bookings' 
  AND cmd = 'INSERT'
LIMIT 1;

-- ============================================
-- STEP 7: TEST INSERT (Uncomment to test)
-- ============================================
/*
-- This simulates what the REST API does
-- If this works, the REST API should also work
INSERT INTO public.bookings (
  user_id,
  package_id,
  name,
  email,
  phone,
  date,
  persons,
  status
)
VALUES (
  NULL,
  NULL,
  'SQL Test User',
  'sqltest@example.com',
  '1234567890',
  CURRENT_DATE,
  2,
  'pending'
)
RETURNING *;
*/

-- ============================================
-- EXPECTED RESULTS:
-- ============================================
-- All should show ✓:
-- 1. RLS Enabled: YES ✓
-- 2. INSERT Policy: EXISTS & CORRECT ✓
-- 3. Anon INSERT Grant: GRANTED ✓
-- 4. Anon Schema USAGE: GRANTED ✓
-- 5. Policy Details: Should show anon in roles and WITH CHECK = true
-- ============================================

