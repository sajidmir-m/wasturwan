-- ============================================
-- COMPLETE FIX FOR BOOKINGS RLS POLICY
-- ============================================
-- Run this ENTIRE script in Supabase SQL Editor
-- This will completely reset and fix the bookings RLS policy
-- ============================================

-- Step 1: Ensure RLS is enabled
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;

-- Step 2: Drop ALL existing policies on bookings table
DROP POLICY IF EXISTS "Public can create bookings" ON public.bookings;
DROP POLICY IF EXISTS "Users can view own bookings" ON public.bookings;
DROP POLICY IF EXISTS "Admins can view all bookings" ON public.bookings;
DROP POLICY IF EXISTS "Admins can update bookings" ON public.bookings;
DROP POLICY IF EXISTS "Admins can delete bookings" ON public.bookings;
DROP POLICY IF EXISTS "Allow anonymous bookings" ON public.bookings;
DROP POLICY IF EXISTS "anon_insert_bookings" ON public.bookings;

-- Step 3: Grant necessary permissions
-- CRITICAL: Ensure anon role has INSERT permission
REVOKE ALL ON TABLE public.bookings FROM anon;
REVOKE ALL ON TABLE public.bookings FROM authenticated;
GRANT INSERT ON TABLE public.bookings TO anon;
GRANT INSERT ON TABLE public.bookings TO authenticated;
GRANT SELECT ON TABLE public.bookings TO authenticated;
GRANT UPDATE ON TABLE public.bookings TO authenticated;
GRANT DELETE ON TABLE public.bookings TO authenticated;

-- Step 4: Create INSERT policy for anonymous users
-- This is the MOST PERMISSIVE policy - allows ANYONE to insert
CREATE POLICY "Public can create bookings"
  ON public.bookings 
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- Step 5: Create SELECT policy for authenticated users (their own bookings)
CREATE POLICY "Users can view own bookings"
  ON public.bookings 
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Step 6: Create SELECT policy for admins (all bookings)
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

-- Step 9: Verify the setup
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

-- Step 10: Test insert (uncomment to test)
/*
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
  'Test User',
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
-- ============================================

