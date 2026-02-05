-- ============================================
-- ULTIMATE FIX FOR BOOKINGS RLS POLICY
-- ============================================
-- This script completely resets and fixes the bookings RLS policy
-- Run this ENTIRE script in Supabase SQL Editor
-- ============================================

-- Step 1: Disable RLS temporarily to reset everything
ALTER TABLE public.bookings DISABLE ROW LEVEL SECURITY;

-- Step 2: Drop ALL existing policies
DROP POLICY IF EXISTS "Public can create bookings" ON public.bookings;
DROP POLICY IF EXISTS "Users can view own bookings" ON public.bookings;
DROP POLICY IF EXISTS "Admins can view all bookings" ON public.bookings;
DROP POLICY IF EXISTS "Admins can update bookings" ON public.bookings;
DROP POLICY IF EXISTS "Admins can delete bookings" ON public.bookings;
DROP POLICY IF EXISTS "Allow anonymous bookings" ON public.bookings;
DROP POLICY IF EXISTS "anon_insert_bookings" ON public.bookings;

-- Step 3: Revoke all existing grants
REVOKE ALL ON TABLE public.bookings FROM anon;
REVOKE ALL ON TABLE public.bookings FROM authenticated;
REVOKE ALL ON TABLE public.bookings FROM public;

-- Step 4: Re-enable RLS
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;

-- Step 5: Grant INSERT permission to anon role (CRITICAL!)
GRANT INSERT ON TABLE public.bookings TO anon;
GRANT INSERT ON TABLE public.bookings TO authenticated;
GRANT SELECT ON TABLE public.bookings TO authenticated;
GRANT UPDATE ON TABLE public.bookings TO authenticated;
GRANT DELETE ON TABLE public.bookings TO authenticated;

-- Step 6: Create the INSERT policy with the MOST PERMISSIVE check
-- This policy allows ANYONE (including anonymous) to insert bookings
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
  END as status

UNION ALL

SELECT 
  'Policy Check' as check_type,
  CASE 
    WHEN EXISTS (
      SELECT 1 FROM pg_policies 
      WHERE schemaname = 'public' 
        AND tablename = 'bookings' 
        AND cmd = 'INSERT' 
        AND policyname = 'Public can create bookings'
        AND 'anon' = ANY(roles)
        AND with_check = 'true'
    )
    THEN 'CORRECT ✓'
    ELSE 'INCORRECT ✗'
  END as status;

-- Step 12: Test insert (uncomment to test)
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
  status
)
VALUES (
  NULL,
  NULL,
  'Test Anonymous User',
  'test@example.com',
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
-- 1. RLS Status: ENABLED ✓
-- 2. INSERT Policy: EXISTS ✓
-- 3. Grants to anon: GRANTED ✓
-- 4. Policy Check: CORRECT ✓
-- ============================================

