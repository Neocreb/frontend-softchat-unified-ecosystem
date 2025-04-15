
import { supabase } from "@/integrations/supabase/client";
import { User } from "@supabase/supabase-js";
import { ExtendedUser } from "@/types/user";
import { fetchUserProfile, getUserPointsAndLevel } from "./profileService";

// Function to enhance the user object with profile data
export const enhanceUserWithProfile = async (supabaseUser: User | null): Promise<ExtendedUser | null> => {
  if (!supabaseUser) return null;

  try {
    const profile = await fetchUserProfile(supabaseUser.id);
    const { points, level } = await getUserPointsAndLevel(supabaseUser.id);

    const enhancedUser: ExtendedUser = {
      ...supabaseUser,
      profile,
      // Add convenience properties
      name: profile?.full_name || supabaseUser.email?.split('@')[0] || 'User',
      avatar: profile?.avatar_url || '/placeholder.svg',
      points,
      level
    };

    return enhancedUser;
  } catch (error) {
    console.error("Error enhancing user:", error);
    return supabaseUser as ExtendedUser;
  }
};

export const signIn = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  
  if (error) {
    throw error;
  }
  
  return data;
};

export const signUp = async (name: string, email: string, password: string) => {
  const { data, error } = await supabase.auth.signUp({ 
    email, 
    password,
    options: {
      data: {
        full_name: name,
      }
    }
  });
  
  if (error) {
    throw error;
  }
  
  return data;
};

export const signOut = async () => {
  const { error } = await supabase.auth.signOut();
  
  if (error) {
    throw error;
  }
};

export const getCurrentSession = async () => {
  const { data } = await supabase.auth.getSession();
  return data.session;
};
