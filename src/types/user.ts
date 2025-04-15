
import { User as SupabaseUser } from "@supabase/supabase-js";

// Extended user type that includes profile data
export interface UserProfile {
  id: string;
  username?: string;
  full_name?: string;
  bio?: string;
  avatar_url?: string;
  wallet_balance?: number;
  crypto_balance?: number;
  bank_account_number?: string;
  bank_account_name?: string;
  bank_name?: string;
  is_verified?: boolean;
  privacy_setting?: string;
  created_at?: string;
  updated_at?: string;
  points?: number;
  level?: string;
}

// Combined user type with auth and profile data
export interface ExtendedUser extends SupabaseUser {
  profile?: UserProfile;
  // Computed properties for convenience
  name?: string;
  avatar?: string;
  points?: number;
  level?: string;
}
