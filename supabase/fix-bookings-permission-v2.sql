-- ============================================
-- FIX BOOKINGS PERMISSIONS (Run this in Supabase SQL Editor)
-- ============================================

-- 1. Enable RLS on bookings table (if not already enabled)
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;

-- 2. Drop any existing policies that might be conflicting or restrictive
DROP POLICY IF EXISTS "Public can create bookings" ON public.bookings;
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON public.bookings;
DROP POLICY IF EXISTS "Admins can view all bookings" ON public.bookings;
DROP POLICY IF EXISTS "Users can view own bookings" ON public.bookings;

-- 3. Grant necessary table and schema permissions to the 'anon' role
-- This is often the missing piece for "permission denied" errors
GRANT USAGE ON SCHEMA public TO anon;
GRANT ALL ON TABLE public.bookings TO anon;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon;

-- 4. Create the INSERT policy for everyone (Anonymous + Authenticated)
-- The 'WITH CHECK (true)' is what allows the insert to succeed
CREATE POLICY "Public can create bookings"
ON public.bookings
FOR INSERT
TO anon, authenticated
WITH CHECK (true);

-- 5. Create SELECT policy for Admins (so they can see the bookings)
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

-- 6. Create SELECT policy for Users (to see their own bookings if they log in later)
CREATE POLICY "Users can view own bookings"
ON public.bookings
FOR SELECT
TO authenticated
USING (
  auth.uid() = user_id
);
