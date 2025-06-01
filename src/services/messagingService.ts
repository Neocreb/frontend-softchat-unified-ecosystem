
import { supabase } from "@/lib/supabase/client";
import { useNotification } from "@/hooks/use-notification";

export interface ChatMessage {
  id: string;
  sender_id: string;
  conversation_id: string;
  content: string;
  created_at: string;
  read: boolean;
  sender?: {
    name: string;
    username: string;
    avatar: string;
  };
}

export interface ChatConversation {
  id: string;
  participants: string[];
  created_at: string;
  updated_at: string;
  last_message?: ChatMessage;
  unread_count?: number;
}

export const messagingService = {
  // Create or get existing conversation between two users
  async getOrCreateConversation(userId1: string, userId2: string): Promise<string | null> {
    try {
      // Check if conversation already exists
      const { data: existingConv, error: searchError } = await supabase
        .from('chat_conversations')
        .select('id')
        .contains('participants', [userId1])
        .contains('participants', [userId2])
        .single();

      if (existingConv) {
        return existingConv.id;
      }

      // Create new conversation
      const { data: newConv, error: createError } = await supabase
        .from('chat_conversations')
        .insert({
          participants: [userId1, userId2]
        })
        .select('id')
        .single();

      if (createError) throw createError;
      return newConv?.id || null;
    } catch (error) {
      console.error('Error getting/creating conversation:', error);
      return null;
    }
  },

  // Send a message
  async sendMessage(conversationId: string, senderId: string, content: string): Promise<ChatMessage | null> {
    try {
      const { data, error } = await supabase
        .from('chat_messages')
        .insert({
          conversation_id: conversationId,
          sender_id: senderId,
          content: content
        })
        .select(`
          *,
          sender:profiles!chat_messages_sender_id_fkey(
            name,
            username,
            avatar_url
          )
        `)
        .single();

      if (error) throw error;

      // Update conversation's updated_at timestamp
      await supabase
        .from('chat_conversations')
        .update({ updated_at: new Date().toISOString() })
        .eq('id', conversationId);

      return {
        id: data.id,
        sender_id: data.sender_id,
        conversation_id: data.conversation_id,
        content: data.content,
        created_at: data.created_at,
        read: data.read,
        sender: data.sender ? {
          name: data.sender.name || 'Unknown',
          username: data.sender.username || 'unknown',
          avatar: data.sender.avatar_url || '/placeholder.svg'
        } : undefined
      };
    } catch (error) {
      console.error('Error sending message:', error);
      return null;
    }
  },

  // Get messages for a conversation
  async getMessages(conversationId: string, limit: number = 50): Promise<ChatMessage[]> {
    try {
      const { data, error } = await supabase
        .from('chat_messages')
        .select(`
          *,
          sender:profiles!chat_messages_sender_id_fkey(
            name,
            username,
            avatar_url
          )
        `)
        .eq('conversation_id', conversationId)
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) throw error;

      return (data || []).map(msg => ({
        id: msg.id,
        sender_id: msg.sender_id,
        conversation_id: msg.conversation_id,
        content: msg.content,
        created_at: msg.created_at,
        read: msg.read,
        sender: msg.sender ? {
          name: msg.sender.name || 'Unknown',
          username: msg.sender.username || 'unknown',
          avatar: msg.sender.avatar_url || '/placeholder.svg'
        } : undefined
      })).reverse();
    } catch (error) {
      console.error('Error getting messages:', error);
      return [];
    }
  },

  // Get user's conversations
  async getUserConversations(userId: string): Promise<ChatConversation[]> {
    try {
      const { data, error } = await supabase
        .from('chat_conversations')
        .select(`
          *,
          messages:chat_messages(
            id,
            content,
            created_at,
            sender_id,
            read,
            sender:profiles!chat_messages_sender_id_fkey(
              name,
              username,
              avatar_url
            )
          )
        `)
        .contains('participants', [userId])
        .order('updated_at', { ascending: false });

      if (error) throw error;

      return (data || []).map(conv => {
        const messages = conv.messages || [];
        const lastMessage = messages.length > 0 ? messages[messages.length - 1] : null;
        const unreadCount = messages.filter(msg => !msg.read && msg.sender_id !== userId).length;

        return {
          id: conv.id,
          participants: conv.participants,
          created_at: conv.created_at,
          updated_at: conv.updated_at,
          last_message: lastMessage ? {
            id: lastMessage.id,
            sender_id: lastMessage.sender_id,
            conversation_id: conv.id,
            content: lastMessage.content,
            created_at: lastMessage.created_at,
            read: lastMessage.read,
            sender: lastMessage.sender ? {
              name: lastMessage.sender.name || 'Unknown',
              username: lastMessage.sender.username || 'unknown',
              avatar: lastMessage.sender.avatar_url || '/placeholder.svg'
            } : undefined
          } : undefined,
          unread_count: unreadCount
        };
      });
    } catch (error) {
      console.error('Error getting conversations:', error);
      return [];
    }
  },

  // Mark messages as read
  async markMessagesAsRead(conversationId: string, userId: string): Promise<void> {
    try {
      await supabase
        .from('chat_messages')
        .update({ read: true })
        .eq('conversation_id', conversationId)
        .neq('sender_id', userId)
        .eq('read', false);
    } catch (error) {
      console.error('Error marking messages as read:', error);
    }
  }
};
