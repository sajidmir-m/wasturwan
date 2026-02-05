-- ============================================
-- TEST ANONYMOUS BOOKING INSERT DIRECTLY
-- ============================================
-- Run this to test if anonymous inserts work at database level
-- ============================================

-- Test 1: Check current user role
SELECT 
  'Current Role' as test,
  current_user as role,
  session_user as session_role;

-- Test 2: Check if we can insert as anon (simulate)
-- This uses SECURITY DEFINER to test as anon role
DO $$
BEGIN
  -- Try to insert as if we're anon
  PERFORM set_config('request.jwt.claim.role', 'anon', true);
  
  -- Attempt insert
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
    'Test Direct SQL',
    'test@example.com',
    '1234567890',
    CURRENT_DATE,
    2,
    'pending'
  );
  
  RAISE NOTICE 'Insert succeeded!';
EXCEPTION
  WHEN OTHERS THEN
    RAISE NOTICE 'Insert failed: %', SQLERRM;
END $$;

-- Test 3: Check grants
SELECT 
  grantee,
  privilege_type,
  is_grantable
FROM information_schema.table_privileges
WHERE table_schema = 'public' 
  AND table_name = 'bookings'
  AND grantee IN ('anon', 'authenticated', 'public')
ORDER BY grantee, privilege_type;

-- Test 4: Check RLS policies
SELECT 
  policyname,
  cmd,
  roles,
  qual as using_clause,
  with_check
FROM pg_policies 
WHERE schemaname = 'public' 
  AND tablename = 'bookings'
ORDER BY cmd, policyname;

-- Test 5: Verify anon can insert (using has_table_privilege)
SELECT 
  'Anon INSERT Check' as test,
  has_table_privilege('anon', 'public.bookings', 'INSERT') as can_insert,
  has_schema_privilege('anon', 'public', 'USAGE') as has_schema_usage;

