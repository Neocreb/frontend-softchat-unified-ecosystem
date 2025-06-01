
import { supabase } from "@/lib/supabase/client";

export interface NotificationData {
  id: string;
  user_id: string;
  type: 'like' | 'comment' | 'follow' | 'message' | 'system';
  title: string;
  content: string;
  related_user_id?: string;
  related_post_id?: string;
  read: boolean;
  created_at: string;
}

export const notificationService = {
  // Create a notification using the database function
  async createNotification(
    userId: string,
    type: NotificationData['type'],
    title: string,
    content: string,
    relatedUserId?: string,
    relatedPostId?: string
  ): Promise<string | null> {
    try {
      const { data, error } = await supabase.rpc('create_notification', {
        p_user_id: userId,
        p_type: type,
        p_title: title,
        p_content: content,
        p_related_user_id: relatedUserId,
        p_related_post_id: relatedPostId
      });

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error creating notification:', error);
      return null;
    }
  },

  // Get user notifications using direct query since types aren't updated yet
  async getUserNotifications(userId: string, limit: number = 50): Promise<NotificationData[]> {
    try {
      // Using direct query to avoid TypeScript type issues
      const response = await supabase
        .rpc('get_user_notifications', { 
          user_id: userId, 
          notification_limit: limit 
        });

      if (response.error) {
        // Fallback to direct table access if RPC doesn't exist
        const { data, error } = await supabase
          .from('notifications' as any)
          .select('*')
          .eq('user_id', userId)
          .order('created_at', { ascending: false })
          .limit(limit);

        if (error) throw error;
        return data || [];
      }

      return response.data || [];
    } catch (error) {
      console.error('Error getting notifications:', error);
      // Try alternative approach
      try {
        const { data, error } = await supabase
          .from('notifications' as any)
          .select('*')
          .eq('user_id', userId)
          .order('created_at', { ascending: false })
          .limit(limit);

        if (error) throw error;
        return data || [];
      } catch (fallbackError) {
        console.error('Fallback error:', fallbackError);
        return [];
      }
    }
  },

  // Mark notification as read
  async markAsRead(notificationId: string): Promise<void> {
    try {
      await supabase
        .from('notifications' as any)
        .update({ read: true })
        .eq('id', notificationId);
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  },

  // Mark all notifications as read
  async markAllAsRead(userId: string): Promise<void> {
    try {
      await supabase
        .from('notifications' as any)
        .update({ read: true })
        .eq('user_id', userId)
        .eq('read', false);
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
    }
  },

  // Get unread count
  async getUnreadCount(userId: string): Promise<number> {
    try {
      const { count, error } = await supabase
        .from('notifications' as any)
        .select('*', { count: 'exact', head: true })
        .eq('user_id', userId)
        .eq('read', false);

      if (error) throw error;
      return count || 0;
    } catch (error) {
      console.error('Error getting unread count:', error);
      return 0;
    }
  }
};
