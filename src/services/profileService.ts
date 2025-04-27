
import { supabase } from '@/integrations/supabase/client';

export const getUserByUsername = async (username: string) => {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('username', username)
    .single();
    
  if (error) throw error;
  return data;
};

export const getFollowersCount = async (userId: string) => {
  const { count, error } = await supabase
    .from('followers')
    .select('*', { count: 'exact', head: true })
    .eq('following_id', userId);
    
  if (error) throw error;
  return count || 0;
};

export const getFollowingCount = async (userId: string) => {
  const { count, error } = await supabase
    .from('followers')
    .select('*', { count: 'exact', head: true })
    .eq('follower_id', userId);
    
  if (error) throw error;
  return count || 0;
};

export const isFollowing = async (followerId: string, followingId: string) => {
  const { data, error } = await supabase
    .from('followers')
    .select('*')
    .eq('follower_id', followerId)
    .eq('following_id', followingId)
    .maybeSingle();
    
  if (error) throw error;
  return !!data;
};

export const toggleFollow = async (followerId: string, followingId: string, currentlyFollowing: boolean) => {
  if (currentlyFollowing) {
    // Unfollow
    const { error } = await supabase
      .from('followers')
      .delete()
      .eq('follower_id', followerId)
      .eq('following_id', followingId);
      
    if (error) throw error;
  } else {
    // Follow
    const { error } = await supabase
      .from('followers')
      .insert({ follower_id: followerId, following_id: followingId });
      
    if (error) throw error;
  }
};
