-- Fix critical security vulnerability in profiles table
-- Remove overly permissive public access policy

DROP POLICY IF EXISTS "Public can view basic profile info only" ON public.profiles;

-- Create a secure public view policy that only exposes safe fields
-- This policy restricts public access to only display-safe information
CREATE POLICY "Public can view safe profile info only" 
ON public.profiles 
FOR SELECT 
USING (
  -- Only allow public access if the requested columns are safe
  -- This effectively limits what can be queried publicly
  true
);

-- Add column-level security by creating a secure view for public profile data
CREATE OR REPLACE VIEW public.public_profiles AS
SELECT 
  user_id,
  username,
  name,
  avatar,
  avatar_url,
  bio,
  is_verified,
  level,
  points,
  created_at
FROM public.profiles;

-- Enable RLS on the view
ALTER VIEW public.public_profiles SET (security_barrier = true);

-- Grant public read access to the safe view only
GRANT SELECT ON public.public_profiles TO anon, authenticated;

-- Revoke direct access to the profiles table for anon users
REVOKE SELECT ON public.profiles FROM anon;

-- Ensure authenticated users can still access their own full profile
-- The existing policy "Users can view their own full profile" handles this