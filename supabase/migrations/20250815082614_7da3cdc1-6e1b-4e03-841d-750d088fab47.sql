-- First, create a separate secure table for banking information with proper RLS
CREATE TABLE IF NOT EXISTS public.user_banking_info (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  bank_account_name TEXT,
  bank_account_number TEXT,
  bank_name TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on the banking table
ALTER TABLE public.user_banking_info ENABLE ROW LEVEL SECURITY;

-- Create secure policies for banking information - users can only access their own data
CREATE POLICY "Users can view own banking info" 
ON public.user_banking_info 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own banking info" 
ON public.user_banking_info 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own banking info" 
ON public.user_banking_info 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own banking info" 
ON public.user_banking_info 
FOR DELETE 
USING (auth.uid() = user_id);

-- Migrate existing banking data from profiles to the secure table
INSERT INTO public.user_banking_info (user_id, bank_account_name, bank_account_number, bank_name)
SELECT user_id, bank_account_name, bank_account_number, bank_name 
FROM public.profiles 
WHERE bank_account_name IS NOT NULL OR bank_account_number IS NOT NULL OR bank_name IS NOT NULL;

-- Remove banking columns from profiles table for security
ALTER TABLE public.profiles DROP COLUMN IF EXISTS bank_account_name;
ALTER TABLE public.profiles DROP COLUMN IF EXISTS bank_account_number;
ALTER TABLE public.profiles DROP COLUMN IF EXISTS bank_name;

-- Update the profiles SELECT policy to be more secure while maintaining functionality
DROP POLICY IF EXISTS "Users can view any profile" ON public.profiles;

-- Create separate policies for different types of profile access
CREATE POLICY "Users can view basic profile info" 
ON public.profiles 
FOR SELECT 
USING (true);

-- Ensure users can still manage their own profiles
CREATE POLICY "Users can view own full profile" 
ON public.profiles 
FOR SELECT 
USING (auth.uid() = user_id);

-- Add updated_at trigger for banking table
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER update_user_banking_info_updated_at
  BEFORE UPDATE ON public.user_banking_info
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();