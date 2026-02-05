-- ============================================
-- VERIFY AND FIX BOOKINGS RLS POLICY
-- ============================================
-- Run this in Supabase SQL Editor to ensure bookings INSERT works for anonymous users
-- ============================================

-- Step 1: Check current RLS status
SELECT 
  schemaname,
  tablename,
  rowsecurity as rls_enabled
FROM pg_tables 
WHERE schemaname = 'public' AND tablename = 'bookings';

-- Step 2: Ensure RLS is enabled
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;

-- Step 3: Drop existing INSERT policy if it exists (to recreate it cleanly)
DROP POLICY IF EXISTS "Public can create bookings" ON public.bookings;
DROP POLICY IF EXISTS "Allow anonymous bookings" ON public.bookings;
DROP POLICY IF EXISTS "anon_insert_bookings" ON public.bookings;

-- Step 4: Create the INSERT policy for anonymous users
-- This allows ANYONE (including anonymous users) to INSERT bookings
CREATE POLICY "Public can create bookings"
  ON public.bookings 
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- Step 5: Verify the policy was created
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual,
  with_check
FROM pg_policies 
WHERE schemaname = 'public' AND tablename = 'bookings'
ORDER BY policyname;

-- Step 6: Ensure proper grants
GRANT INSERT ON TABLE public.bookings TO anon;
GRANT INSERT ON TABLE public.bookings TO authenticated;
GRANT SELECT ON TABLE public.bookings TO authenticated;

-- Step 7: Test query (this should work for anonymous users)
-- Uncomment to test:
-- INSERT INTO public.bookings (name, email, phone, date, persons, status)
-- VALUES ('Test User', 'test@example.com', '1234567890', CURRENT_DATE, 2, 'pending');

-- ============================================
-- EXPECTED RESULT:
-- ============================================
-- You should see:
-- 1. RLS enabled: true
-- 2. A policy named "Public can create bookings" with:
--    - cmd: INSERT
--    - roles: {anon,authenticated}
--    - with_check: true
-- ============================================

