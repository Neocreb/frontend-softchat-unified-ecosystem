
import { User as SupabaseUser } from "@supabase/supabase-js";

// Define the user level type
export type UserLevel = 'bronze' | 'silver' | 'gold' | 'platinum';

// Extended user profile type with profile data
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
  level?: UserLevel;
  contacts?: string[];
}

// Combined user type with auth and profile data
export interface ExtendedUser extends SupabaseUser {
  profile?: UserProfile;
  // Computed properties for convenience
  name?: string;
  avatar?: string;
  points?: number;
  level?: UserLevel;
}

// Contact type for wallet
export interface Contact {
  id: string;
  user_id: string;
  contact_id: string;
  name: string;
  username: string;
  avatar: string;
  created_at: string;
}

// Transaction type
export interface Transaction {
  id: string;
  user_id: string;
  recipient_id?: string;
  amount: number;
  type: 'deposit' | 'withdrawal' | 'transfer' | 'reward';
  status: 'pending' | 'completed' | 'failed';
  description?: string;
  created_at: string;
}
