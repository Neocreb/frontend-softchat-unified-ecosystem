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

// Function to follow or unfollow a user
export const toggleFollow = async (userId: string, targetUserId: string, isFollowing: boolean): Promise<boolean> => {
  try {
    if (isFollowing) {
      // Unfollow the target user
      await supabase.from('followers').delete().eq('follower_id', userId).eq('following_id', targetUserId);
    } else {
      // Follow the target user
      await supabase.from('followers').insert({ 
        follower_id: userId,
        following_id: targetUserId,
        created_at: new Date().toISOString()
      });
    }
    return true;
  } catch (error) {
    console.error("Error in toggleFollow:", error);
    throw error;
  }
};

// Function to get followers count
export const getFollowersCount = async (userId: string): Promise<number> => {
  try {
    const { count, error } = await supabase
      .from('followers')
      .select('*', { count: 'exact', head: true })
      .eq('following_id', userId);
    
    if (error) {
      throw error;
    }
    
    return count || 0;
  } catch (error) {
    console.error("Error in getFollowersCount:", error);
    return 0;
  }
};

// Function to get following count
export const getFollowingCount = async (userId: string): Promise<number> => {
  try {
    const { count, error } = await supabase
      .from('followers')
      .select('*', { count: 'exact', head: true })
      .eq('follower_id', userId);
    
    if (error) {
      throw error;
    }
    
    return count || 0;
  } catch (error) {
    console.error("Error in getFollowingCount:", error);
    return 0;
  }
};

// Function to check if user is following another user
export const isFollowing = async (userId: string, targetUserId: string): Promise<boolean> => {
  try {
    const { data, error } = await supabase
      .from('followers')
      .select('id')
      .eq('follower_id', userId)
      .eq('following_id', targetUserId)
      .single();
    
    if (error && error.code !== 'PGRST116') {
      throw error;
    }
    
    return !!data;
  } catch (error) {
    console.error("Error in isFollowing:", error);
    return false;
  }
};

// Function to get user's posts
export const getUserPosts = async (userId: string) => {
  try {
    const { data, error } = await supabase
      .from('posts')
      .select(`
        id, 
        content,
        image_url,
        created_at,
        likes:post_likes(count),
        comments:post_comments(count),
        user_id,
        author:profiles!inner(*)
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
      
    if (error) {
      throw error;
    }
    
    return data || [];
  } catch (error) {
    console.error("Error in getUserPosts:", error);
    return [];
  }
};

// Function to get user's products
export const getUserProducts = async (userId: string) => {
  try {
    const { data, error } = await supabase
      .from('products')
      .select(`
        *,
        seller:profiles!inner(*)
      `)
      .eq('seller_id', userId)
      .order('created_at', { ascending: false });
      
    if (error) {
      throw error;
    }
    
    return data || [];
  } catch (error) {
    console.error("Error in getUserProducts:", error);
    return [];
  }
};

// Function to get user by username
export const getUserByUsername = async (username: string) => {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('username', username)
      .single();
      
    if (error) {
      throw error;
    }
    
    return data;
  } catch (error) {
    console.error("Error in getUserByUsername:", error);
    return null;
  }
};
