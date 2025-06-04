
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabase/client";

interface Conversation {
  id: string;
  participants: string[];
  updated_at: string;
  last_message?: {
    content: string;
    sender_id: string;
    created_at: string;
    message_type: string;
  };
  other_user?: {
    name: string;
    avatar: string;
  };
  unread_count: number;
}

export const useEnhancedMessaging = () => {
  const { user } = useAuth();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConversation, setActiveConversation] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchConversations();
      subscribeToConversations();
    }
  }, [user]);

  const fetchConversations = async () => {
    if (!user) return;

    const { data: conversations, error } = await supabase
      .from('chat_conversations')
      .select(`
        *,
        chat_messages!inner (
          content,
          sender_id,
          created_at,
          message_type,
          read
        )
      `)
      .contains('participants', [user.id])
      .order('updated_at', { ascending: false });

    if (conversations) {
      // Process conversations to get last message and unread count
      const processedConversations = await Promise.all(
        conversations.map(async (conv) => {
          // Get last message
          const { data: lastMessage } = await supabase
            .from('chat_messages')
            .select('*')
            .eq('conversation_id', conv.id)
            .order('created_at', { ascending: false })
            .limit(1)
            .single();

          // Get unread count
          const { count: unreadCount } = await supabase
            .from('chat_messages')
            .select('*', { count: 'exact' })
            .eq('conversation_id', conv.id)
            .eq('read', false)
            .neq('sender_id', user.id);

          // Get other user info
          const otherUserId = conv.participants.find(p => p !== user.id);
          const { data: otherUser } = await supabase
            .from('profiles')
            .select('name, avatar_url')
            .eq('user_id', otherUserId)
            .single();

          return {
            ...conv,
            last_message: lastMessage,
            unread_count: unreadCount || 0,
            other_user: otherUser ? {
              name: otherUser.name || 'Unknown',
              avatar: otherUser.avatar_url || '/placeholder.svg'
            } : undefined
          };
        })
      );

      setConversations(processedConversations);
    }
    setIsLoading(false);
  };

  const subscribeToConversations = () => {
    if (!user) return;

    const subscription = supabase
      .channel('user-conversations')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'chat_messages'
      }, () => {
        fetchConversations();
      })
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  };

  const createConversation = async (otherUserId: string) => {
    if (!user) return null;

    // Check if conversation already exists
    const { data: existingConv } = await supabase
      .from('chat_conversations')
      .select('id')
      .contains('participants', [user.id, otherUserId])
      .single();

    if (existingConv) {
      return existingConv.id;
    }

    // Create new conversation
    const { data: newConv, error } = await supabase
      .from('chat_conversations')
      .insert({
        participants: [user.id, otherUserId]
      })
      .select('id')
      .single();

    if (newConv) {
      fetchConversations();
      return newConv.id;
    }

    return null;
  };

  const markConversationAsRead = async (conversationId: string) => {
    if (!user) return;

    await supabase
      .from('chat_messages')
      .update({ read: true })
      .eq('conversation_id', conversationId)
      .neq('sender_id', user.id);

    fetchConversations();
  };

  return {
    conversations,
    activeConversation,
    setActiveConversation,
    isLoading,
    createConversation,
    markConversationAsRead,
    refreshConversations: fetchConversations
  };
};
