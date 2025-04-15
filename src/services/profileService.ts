
import { supabase } from "@/integrations/supabase/client";
import { UserProfile, UserLevel } from "@/types/user";

// Function to fetch user profile from the profiles table
export const fetchUserProfile = async (userId: string): Promise<UserProfile | null> => {
  try {
    // Using any to bypass TypeScript issues with Supabase types
    const { data: profile, error } = await (supabase as any)
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) {
      console.error("Error fetching user profile:", error);
      return null;
    }

    return profile as UserProfile;
  } catch (error) {
    console.error("Error in fetchUserProfile:", error);
    return null;
  }
};

// Function to update user profile data
export const updateUserProfile = async (userId: string, profileData: Partial<UserProfile>): Promise<UserProfile | null> => {
  try {
    // Using any to bypass TypeScript issues with Supabase types
    const { data, error } = await (supabase as any)
      .from('profiles')
      .update(profileData)
      .eq('id', userId)
      .select()
      .single();

    if (error) {
      console.error("Error updating user profile:", error);
      throw error;
    }

    return data as UserProfile;
  } catch (error) {
    console.error("Error in updateUserProfile:", error);
    throw error;
  }
};

// Helper function to get points and level for the user
export const getUserPointsAndLevel = async (userId: string): Promise<{ points: number; level: UserLevel }> => {
  try {
    // Using any to bypass TypeScript issues with Supabase types
    const { data: rewardPoints, error: pointsError } = await (supabase as any).rpc('get_user_points', { user_uuid: userId });
    
    if (pointsError) {
      console.error("Error fetching user points:", pointsError);
      return { points: 0, level: 'bronze' };
    }

    // Get tier thresholds
    const { data: tierSettings, error: settingsError } = await (supabase as any)
      .from('app_settings')
      .select('value')
      .eq('key', 'loyalty_tiers')
      .single();

    if (settingsError) {
      console.error("Error fetching tier settings:", settingsError);
      return { points: rewardPoints || 0, level: 'bronze' };
    }

    const tiers = tierSettings?.value as Record<string, number>;
    
    // Determine user level based on points
    let level: UserLevel = 'bronze';
    if (rewardPoints && tiers) {
      if (rewardPoints >= tiers.platinum) {
        level = 'platinum';
      } else if (rewardPoints >= tiers.gold) {
        level = 'gold';
      } else if (rewardPoints >= tiers.silver) {
        level = 'silver';
      }
    }

    return { points: rewardPoints || 0, level };
  } catch (error) {
    console.error("Error in getUserPointsAndLevel:", error);
    return { points: 0, level: 'bronze' };
  }
};
