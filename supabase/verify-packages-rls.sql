-- ============================================
-- VERIFY PACKAGES RLS POLICY FOR PUBLIC ACCESS
-- ============================================
-- Run this to check if packages are accessible to anonymous users
-- ============================================

-- Check RLS status
SELECT 
  'RLS Status' as check_type,
  CASE WHEN rowsecurity THEN 'ENABLED ✓' ELSE 'DISABLED ✗' END as status
FROM pg_tables 
WHERE schemaname = 'public' AND tablename = 'packages';

-- Check SELECT policy exists
SELECT 
  'SELECT Policy' as check_type,
  CASE 
    WHEN COUNT(*) > 0 THEN 'EXISTS ✓' 
    ELSE 'MISSING ✗' 
  END as status
FROM pg_policies 
WHERE schemaname = 'public' 
  AND tablename = 'packages' 
  AND cmd = 'SELECT';

-- Check if anon can SELECT
SELECT 
  'Anon SELECT Permission' as check_type,
  CASE 
    WHEN has_table_privilege('anon', 'public.packages', 'SELECT') 
    THEN 'GRANTED ✓' 
    ELSE 'NOT GRANTED ✗' 
  END as status;

-- View the SELECT policy details
SELECT 
  policyname,
  cmd,
  roles,
  qual as using_clause,
  with_check
FROM pg_policies 
WHERE schemaname = 'public' 
  AND tablename = 'packages' 
  AND cmd = 'SELECT';

-- Count active packages
SELECT 
  'Active Packages Count' as check_type,
  COUNT(*)::text || ' packages' as status
FROM public.packages 
WHERE status = 'active';

-- List all packages with their status
SELECT 
  id,
  title,
  status,
  created_at
FROM public.packages
ORDER BY created_at DESC
LIMIT 10;

-- ============================================
-- EXPECTED RESULTS:
-- ============================================
-- 1. RLS Status: ENABLED ✓
-- 2. SELECT Policy: EXISTS ✓
-- 3. Anon SELECT Permission: GRANTED ✓
-- 4. Policy should allow: status = 'active' OR is_admin()
-- ============================================

