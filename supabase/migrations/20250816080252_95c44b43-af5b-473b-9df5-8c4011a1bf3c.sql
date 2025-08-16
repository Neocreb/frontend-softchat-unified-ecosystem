-- Harden profiles access: remove public table reads, expose safe public view only

-- 1) Remove overly permissive public read policies on profiles
DROP POLICY IF EXISTS "Public can view safe profile info only" ON public.profiles;
DROP POLICY IF EXISTS "Public can view basic profile info only" ON public.profiles;

-- 2) Ensure anonymous users cannot read the raw profiles table
REVOKE SELECT ON public.profiles FROM anon;

-- 3) Create/refresh a safe, public view with minimal, non-sensitive fields
CREATE OR REPLACE VIEW public.public_profiles AS
SELECT 
  user_id,
  username,
  COALESCE(full_name, name) AS display_name,
  avatar_url,
  is_verified,
  created_at
FROM public.profiles;

-- Add a security barrier so filters are applied before joins/projections
ALTER VIEW public.public_profiles SET (security_barrier = true);

-- Allow both anonymous and authenticated clients to read the SAFE view only
GRANT SELECT ON public.public_profiles TO anon, authenticated;

-- 4) Keep full-profile visibility only for owners and admins on the base table
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname='public' AND tablename='profiles' AND policyname='Users can view their own full profile'
  ) THEN
    CREATE POLICY "Users can view their own full profile"
    ON public.profiles
    FOR SELECT
    USING (auth.uid() = user_id);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname='public' AND tablename='profiles' AND policyname='Admins can view all profiles'
  ) THEN
    CREATE POLICY "Admins can view all profiles"
    ON public.profiles
    FOR SELECT
    USING (public.is_admin());
  END IF;
END$$;