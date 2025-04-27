import { User } from "@supabase/supabase-js";

export interface UserProfile {
  id: string;
  username?: string;
  full_name?: string;
  avatar_url?: string;
  bio?: string;
  is_verified?: boolean;
  points?: number;
  level?: string;
  role?: string;
  bank_account_name?: string;
  bank_account_number?: string;
  bank_name?: string;
}

export interface ExtendedUser extends User {
  name: string;
  avatar: string;
  points: number;
  level: string;
  role: string;
  profile?: UserProfile;
  app_metadata: {
    provider?: string;
    [key: string]: any;
  };
}
