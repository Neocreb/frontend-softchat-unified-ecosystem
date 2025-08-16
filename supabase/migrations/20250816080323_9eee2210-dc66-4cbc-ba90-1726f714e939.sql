-- Fix profiles security vulnerability by properly restricting access

-- 1) Drop existing view completely to avoid column conflicts
DROP VIEW IF EXISTS public.public_profiles;

-- 2) Remove overly permissive policies
DROP POLICY IF EXISTS "Public can view safe profile info only" ON public.profiles;

-- 3) Ensure anonymous users cannot read the raw profiles table
REVOKE SELECT ON public.profiles FROM anon;

-- 4) Create a fresh, secure view with only safe, public fields
CREATE VIEW public.public_profiles AS
SELECT 
  user_id,
  username,
  COALESCE(full_name, name) AS display_name,
  avatar_url,
  is_verified,
  created_at
FROM public.profiles;

-- 5) Apply security barrier to the view
ALTER VIEW public.public_profiles SET (security_barrier = true);

-- 6) Grant limited access to the safe view only
GRANT SELECT ON public.public_profiles TO anon, authenticated;

-- 7) Ensure authenticated users can still access their own full profile
CREATE POLICY "Users can view their own full profile"
ON public.profiles
FOR SELECT
USING (auth.uid() = user_id);

-- 8) Allow admins to view all profiles  
CREATE POLICY "Admins can view all profiles"
ON public.profiles
FOR SELECT
USING (public.is_admin());