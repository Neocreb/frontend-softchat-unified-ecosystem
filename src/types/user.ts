
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
  role?: 'user' | 'admin';
}

// Combined user type with auth and profile data
export interface ExtendedUser extends SupabaseUser {
  profile?: UserProfile;
  // Computed properties for convenience
  name?: string;
  avatar?: string;
  points?: number;
  level?: UserLevel;
  role?: 'user' | 'admin';
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

// Chat message type
export interface ChatMessage {
  id: string;
  sender_id: string;
  recipient_id: string;
  content: string;
  is_read: boolean;
  created_at: string;
  sender?: {
    name: string;
    avatar: string;
    username: string;
    is_verified: boolean;
  };
}

// Chat conversation type
export interface ChatConversation {
  id: string;
  last_message?: string;
  last_message_time?: string;
  unread_count: number;
  participant: {
    id: string;
    name: string;
    username: string;
    avatar: string;
    is_verified: boolean;
    last_seen?: string;
  };
}

// Post comment type
export interface PostComment {
  id: string;
  post_id: string;
  user_id: string;
  content: string;
  created_at: string;
  user: {
    name: string;
    username: string;
    avatar: string;
    is_verified: boolean;
  };
}
