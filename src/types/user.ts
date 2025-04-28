
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

export interface ChatMessage {
  id: string;
  content: string;
  sender_id: string;
  conversation_id: string;
  created_at: string;
  read: boolean;
  sender?: {
    name: string;
    avatar: string;
  };
}

export interface ChatConversation {
  id: string;
  participants: string[];
  last_message?: ChatMessage;
  created_at: string;
  updated_at: string;
  unread_count: number;
  other_user?: {
    id: string;
    name: string;
    avatar: string;
    is_online: boolean;
  };
}

export enum UserLevel {
  BRONZE = 'bronze',
  SILVER = 'silver',
  GOLD = 'gold',
  PLATINUM = 'platinum',
  DIAMOND = 'diamond'
}
