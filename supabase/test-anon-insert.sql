-- ============================================
-- TEST ANONYMOUS INSERT INTO BOOKINGS
-- ============================================
-- Run this in Supabase SQL Editor to test if anonymous inserts work
-- ============================================

-- This simulates what the REST API does for anonymous users
-- If this fails, the RLS policy is the issue
-- If this succeeds, the issue is in the API call format

-- Test 1: Direct INSERT as postgres (should always work)
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
  NULL, -- Explicitly null for anonymous
  NULL, -- No package
  'Test Anonymous User',
  'test@example.com',
  '1234567890',
  CURRENT_DATE,
  2,
  'pending',
  'Test booking from SQL'
)
RETURNING *;

-- Test 2: Check if the policy allows this
-- The policy "Public can create bookings" should allow this insert
-- If you get an RLS error here, the policy is not working correctly

-- Clean up test data (optional)
-- DELETE FROM public.bookings WHERE email = 'test@example.com' AND name = 'Test Anonymous User';

-- ============================================
-- EXPECTED RESULT:
-- ============================================
-- This should INSERT successfully and return the new booking row
-- If it fails with RLS error, check:
-- 1. RLS is enabled: SELECT tablename, rowsecurity FROM pg_tables WHERE tablename = 'bookings';
-- 2. Policy exists: SELECT * FROM pg_policies WHERE tablename = 'bookings' AND cmd = 'INSERT';
-- 3. Policy allows anon: The policy should have 'anon' in the roles array
-- ============================================

