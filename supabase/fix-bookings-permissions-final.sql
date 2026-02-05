-- ============================================
-- FINAL FIX FOR BOOKINGS PERMISSIONS & RLS
-- ============================================
-- This script fixes "permission denied for table bookings" error
-- Run this ENTIRE script in Supabase SQL Editor
-- ============================================

-- ============================================
-- STEP 1: COMPLETELY RESET BOOKINGS TABLE PERMISSIONS
-- ============================================

-- Disable RLS temporarily to reset everything
ALTER TABLE public.bookings DISABLE ROW LEVEL SECURITY;

-- Drop ALL existing policies
DROP POLICY IF EXISTS "Public can create bookings" ON public.bookings;
DROP POLICY IF EXISTS "Users can view own bookings" ON public.bookings;
DROP POLICY IF EXISTS "Admins can view all bookings" ON public.bookings;
DROP POLICY IF EXISTS "Admins can update bookings" ON public.bookings;
DROP POLICY IF EXISTS "Admins can delete bookings" ON public.bookings;
DROP POLICY IF EXISTS "Allow anonymous bookings" ON public.bookings;
DROP POLICY IF EXISTS "anon_insert_bookings" ON public.bookings;

-- Revoke ALL permissions from all roles
REVOKE ALL ON TABLE public.bookings FROM anon;
REVOKE ALL ON TABLE public.bookings FROM authenticated;
REVOKE ALL ON TABLE public.bookings FROM public;
REVOKE ALL ON TABLE public.bookings FROM postgres;

-- ============================================
-- STEP 2: GRANT PERMISSIONS (CRITICAL!)
-- ============================================

-- Grant INSERT permission to anon role (MOST IMPORTANT!)
GRANT INSERT ON TABLE public.bookings TO anon;
GRANT INSERT ON TABLE public.bookings TO authenticated;

-- Grant SELECT permission to authenticated users
GRANT SELECT ON TABLE public.bookings TO authenticated;

-- Grant UPDATE/DELETE to authenticated users (for admins)
GRANT UPDATE ON TABLE public.bookings TO authenticated;
GRANT DELETE ON TABLE public.bookings TO authenticated;

-- Also grant USAGE on the schema (sometimes needed)
GRANT USAGE ON SCHEMA public TO anon;
GRANT USAGE ON SCHEMA public TO authenticated;

-- ============================================
-- STEP 3: RE-ENABLE RLS
-- ============================================

ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;

-- ============================================
-- STEP 4: CREATE RLS POLICIES
-- ============================================

-- Policy 1: Allow anonymous users to INSERT bookings
-- This is the MOST PERMISSIVE policy possible
CREATE POLICY "Public can create bookings"
  ON public.bookings 
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- Policy 2: Allow authenticated users to view their own bookings
CREATE POLICY "Users can view own bookings"
  ON public.bookings 
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Policy 3: Allow admins to view all bookings
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

-- Policy 4: Allow admins to UPDATE bookings
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

-- Policy 5: Allow admins to DELETE bookings
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
-- STEP 5: VERIFICATION QUERIES
-- ============================================

-- Check RLS is enabled
SELECT 
  'RLS Enabled' as check_type,
  CASE WHEN rowsecurity THEN 'YES ✓' ELSE 'NO ✗' END as status
FROM pg_tables 
WHERE schemaname = 'public' AND tablename = 'bookings'

UNION ALL

-- Check INSERT policy exists
SELECT 
  'INSERT Policy Exists' as check_type,
  CASE 
    WHEN EXISTS (
      SELECT 1 FROM pg_policies 
      WHERE schemaname = 'public' 
        AND tablename = 'bookings' 
        AND cmd = 'INSERT'
        AND 'anon' = ANY(roles)
    )
    THEN 'YES ✓'
    ELSE 'NO ✗'
  END as status

UNION ALL

-- Check anon has INSERT permission
SELECT 
  'Anon INSERT Permission' as check_type,
  CASE 
    WHEN has_table_privilege('anon', 'public.bookings', 'INSERT')
    THEN 'GRANTED ✓'
    ELSE 'NOT GRANTED ✗'
  END as status

UNION ALL

-- Check anon has USAGE on schema
SELECT 
  'Anon Schema USAGE' as check_type,
  CASE 
    WHEN has_schema_privilege('anon', 'public', 'USAGE')
    THEN 'GRANTED ✓'
    ELSE 'NOT GRANTED ✗'
  END as status

UNION ALL

-- View the INSERT policy details
SELECT 
  'Policy Details' as check_type,
  CONCAT(
    'Policy: ', policyname, 
    ', Roles: ', array_to_string(roles, ','),
    ', WITH CHECK: ', COALESCE(with_check::text, 'null')
  ) as status
FROM pg_policies 
WHERE schemaname = 'public' 
  AND tablename = 'bookings' 
  AND cmd = 'INSERT'
LIMIT 1;

-- ============================================
-- STEP 6: TEST INSERT (Uncomment to test)
-- ============================================
/*
-- This should work for anonymous users
INSERT INTO public.bookings (
  user_id,
  package_id,
  name,
  email,
  phone,
  date,
  persons,
  status,
  message
)
VALUES (
  NULL,
  NULL,
  'Test Anonymous User',
  'test@example.com',
  '1234567890',
  CURRENT_DATE,
  2,
  'pending',
  'Test booking from SQL'
)
RETURNING *;
*/

-- ============================================
-- EXPECTED RESULTS:
-- ============================================
-- All checks should show ✓:
-- 1. RLS Enabled: YES ✓
-- 2. INSERT Policy Exists: YES ✓
-- 3. Anon INSERT Permission: GRANTED ✓
-- 4. Anon Schema USAGE: GRANTED ✓
-- 5. Policy Details: Should show anon in roles and WITH CHECK = true
-- ============================================

