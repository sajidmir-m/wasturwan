-- ============================================
-- COMPREHENSIVE DIAGNOSTIC FOR BOOKINGS RLS
-- ============================================
-- Run this to diagnose the exact issue
-- ============================================

-- ============================================
-- PART 1: CHECK RLS STATUS
-- ============================================

SELECT '=== RLS STATUS ===' as section;

SELECT 
  tablename,
  rowsecurity as rls_enabled,
  CASE WHEN rowsecurity THEN 'RLS is ON' ELSE 'RLS is OFF' END as status
FROM pg_tables 
WHERE schemaname = 'public' AND tablename = 'bookings';

-- ============================================
-- PART 2: CHECK ALL POLICIES
-- ============================================

SELECT '=== ALL POLICIES ===' as section;

SELECT 
  policyname,
  cmd as operation,
  roles::text as applies_to_roles,
  qual as using_clause,
  with_check as with_check_clause,
  CASE 
    WHEN cmd = 'INSERT' AND 'anon' = ANY(roles) AND with_check::text = 'true' 
    THEN 'CORRECT ✓'
    WHEN cmd = 'INSERT' AND 'anon' = ANY(roles) 
    THEN 'MISSING WITH CHECK ✗'
    WHEN cmd = 'INSERT' 
    THEN 'MISSING ANON ROLE ✗'
    ELSE 'OK'
  END as validation
FROM pg_policies 
WHERE schemaname = 'public' AND tablename = 'bookings'
ORDER BY cmd, policyname;

-- ============================================
-- PART 3: CHECK GRANTS
-- ============================================

SELECT '=== TABLE GRANTS ===' as section;

SELECT 
  grantee as role,
  privilege_type as permission,
  is_grantable,
  CASE 
    WHEN grantee = 'anon' AND privilege_type = 'INSERT' 
    THEN 'CRITICAL ✓'
    WHEN grantee = 'anon' 
    THEN 'OK'
    ELSE 'OK'
  END as importance
FROM information_schema.table_privileges
WHERE table_schema = 'public' 
  AND table_name = 'bookings'
  AND grantee IN ('anon', 'authenticated', 'public')
ORDER BY grantee, privilege_type;

-- ============================================
-- PART 4: CHECK SCHEMA PERMISSIONS
-- ============================================

SELECT '=== SCHEMA PERMISSIONS ===' as section;

SELECT 
  grantee as role,
  privilege_type as permission
FROM information_schema.usage_privileges
WHERE object_schema = 'public' 
  AND grantee IN ('anon', 'authenticated')
ORDER BY grantee, privilege_type;

-- ============================================
-- PART 5: TEST ANON PERMISSIONS
-- ============================================

SELECT '=== ANON PERMISSION CHECKS ===' as section;

SELECT 
  'Anon can INSERT' as check_type,
  has_table_privilege('anon', 'public.bookings', 'INSERT') as result,
  CASE 
    WHEN has_table_privilege('anon', 'public.bookings', 'INSERT') 
    THEN 'YES ✓'
    ELSE 'NO ✗ - THIS IS THE PROBLEM!'
  END as status

UNION ALL

SELECT 
  'Anon has schema USAGE' as check_type,
  has_schema_privilege('anon', 'public', 'USAGE') as result,
  CASE 
    WHEN has_schema_privilege('anon', 'public', 'USAGE') 
    THEN 'YES ✓'
    ELSE 'NO ✗ - GRANT USAGE ON SCHEMA public TO anon;'
  END as status;

-- ============================================
-- PART 6: CHECK FOR POLICY CONFLICTS
-- ============================================

SELECT '=== POLICY CONFLICTS CHECK ===' as section;

-- Check if there are multiple INSERT policies (should only be one)
SELECT 
  COUNT(*) as insert_policy_count,
  CASE 
    WHEN COUNT(*) = 0 THEN 'NO INSERT POLICY ✗'
    WHEN COUNT(*) = 1 THEN 'ONE POLICY ✓'
    ELSE 'MULTIPLE POLICIES - MAY CAUSE CONFLICTS ⚠'
  END as status
FROM pg_policies 
WHERE schemaname = 'public' 
  AND tablename = 'bookings' 
  AND cmd = 'INSERT';

-- ============================================
-- PART 7: DETAILED POLICY ANALYSIS
-- ============================================

SELECT '=== DETAILED INSERT POLICY ===' as section;

SELECT 
  policyname,
  permissive,
  roles::text,
  cmd,
  CASE 
    WHEN qual IS NULL THEN 'No USING clause'
    ELSE 'Has USING clause: ' || qual::text
  END as using_info,
  CASE 
    WHEN with_check IS NULL THEN 'No WITH CHECK clause ✗'
    WHEN with_check::text = 'true' THEN 'WITH CHECK = true ✓'
    ELSE 'WITH CHECK: ' || with_check::text
  END as with_check_info
FROM pg_policies 
WHERE schemaname = 'public' 
  AND tablename = 'bookings' 
  AND cmd = 'INSERT';

-- ============================================
-- PART 8: RECOMMENDED FIX
-- ============================================

SELECT '=== RECOMMENDED FIX ===' as section;

-- Show what needs to be done
SELECT 
  CASE 
    WHEN NOT EXISTS (
      SELECT 1 FROM pg_policies 
      WHERE schemaname = 'public' 
        AND tablename = 'bookings' 
        AND cmd = 'INSERT'
        AND 'anon' = ANY(roles)
        AND with_check::text = 'true'
    )
    THEN 'Run: supabase/fix-bookings-rls-absolute-final.sql'
    WHEN NOT has_table_privilege('anon', 'public.bookings', 'INSERT')
    THEN 'Run: GRANT INSERT ON TABLE public.bookings TO anon;'
    WHEN NOT has_schema_privilege('anon', 'public', 'USAGE')
    THEN 'Run: GRANT USAGE ON SCHEMA public TO anon;'
    ELSE 'Everything looks correct - issue might be in code or environment variables'
  END as recommendation;

-- ============================================
-- END OF DIAGNOSTIC
-- ============================================

