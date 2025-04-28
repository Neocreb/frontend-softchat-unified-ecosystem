
import { supabase } from '@/integrations/supabase/client';
import { UserProfile } from '@/types/user';

export const getUserByUsername = async (username: string) => {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('username', username)
    .single();
    
  if (error) throw error;
  return data;
};

export const getFollowersCount = async (userId: string): Promise<number> => {
  const { count, error } = await supabase
    .from('followers')
    .select('*', { count: 'exact', head: true })
    .eq('following_id', userId);
    
  if (error) throw error;
  return count || 0;
};

export const getFollowingCount = async (userId: string): Promise<number> => {
  const { count, error } = await supabase
    .from('followers')
    .select('*', { count: 'exact', head: true })
    .eq('follower_id', userId);
    
  if (error) throw error;
  return count || 0;
};

export const isFollowing = async (followerId: string, followingId: string): Promise<boolean> => {
  const { data, error } = await supabase
    .from('followers')
    .select('*')
    .eq('follower_id', followerId)
    .eq('following_id', followingId)
    .maybeSingle();
    
  if (error) throw error;
  return !!data;
};

export const toggleFollow = async (followerId: string, followingId: string, currentlyFollowing: boolean): Promise<void> => {
  if (currentlyFollowing) {
    const { error } = await supabase
      .from('followers')
      .delete()
      .eq('follower_id', followerId)
      .eq('following_id', followingId);
      
    if (error) throw error;
  } else {
    const { error } = await supabase
      .from('followers')
      .insert({ follower_id: followerId, following_id: followingId });
      
    if (error) throw error;
  }
};

export const getUserPosts = async (userId: string) => {
  const { data, error } = await supabase
    .from('posts')
    .select(`
      *,
      profiles (*)
    `)
    .eq('user_id', userId)
    .order('created_at', { ascending: false });
    
  if (error) throw error;
  return data;
};

export const getUserProducts = async (userId: string) => {
  const { data, error } = await supabase
    .from('products')
    .select(`
      *,
      profiles (*)
    `)
    .eq('seller_id', userId)
    .order('created_at', { ascending: false });
    
  if (error) throw error;
  return data;
};

export const fetchUserProfile = async (userId: string) => {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();
    
  if (error) throw error;
  return data;
};

export const getUserPointsAndLevel = async (userId: string) => {
  const { data, error } = await supabase
    .from('profiles')
    .select('points, level')
    .eq('id', userId)
    .single();
    
  if (error) throw error;
  return {
    points: data?.points || 0,
    level: data?.level || 'bronze'
  };
};

export const updateUserProfile = async (userId: string, profileData: Partial<UserProfile>) => {
  const { data, error } = await supabase
    .from('profiles')
    .update(profileData)
    .eq('id', userId)
    .select()
    .single();
    
  if (error) throw error;
  return data;
};
