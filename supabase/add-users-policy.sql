-- Add RLS policy to allow users to read their own record
-- This is needed for the login verification

-- Allow users to read their own record
CREATE POLICY "Users can read own record"
ON public.users
FOR SELECT
TO authenticated
USING (auth.uid() = id);

-- Allow users to update their own record (for name, etc.)
CREATE POLICY "Users can update own record"
ON public.users
FOR UPDATE
TO authenticated
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);

