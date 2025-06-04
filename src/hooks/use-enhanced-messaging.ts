
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

    try {
      // Use mock data for now since the enhanced messaging tables aren't fully ready
      const mockConversations: Conversation[] = [
        {
          id: '1',
          participants: [user.id, 'user2'],
          updated_at: new Date().toISOString(),
          last_message: {
            content: 'Hey! How are you doing?',
            sender_id: 'user2',
            created_at: new Date().toISOString(),
            message_type: 'text'
          },
          unread_count: 2,
          other_user: {
            name: 'Alice Johnson',
            avatar: '/placeholder.svg'
          }
        },
        {
          id: '2',
          participants: [user.id, 'user3'],
          updated_at: new Date(Date.now() - 3600000).toISOString(),
          last_message: {
            content: 'Thanks for the trade!',
            sender_id: 'user3',
            created_at: new Date(Date.now() - 3600000).toISOString(),
            message_type: 'text'
          },
          unread_count: 0,
          other_user: {
            name: 'Bob Smith',
            avatar: '/placeholder.svg'
          }
        }
      ];
      setConversations(mockConversations);
    } catch (error) {
      console.error('Error fetching conversations:', error);
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
    const existingConv = conversations.find(conv => 
      conv.participants.includes(otherUserId)
    );

    if (existingConv) {
      return existingConv.id;
    }

    // Create new conversation (mock for now)
    const newConvId = Date.now().toString();
    const newConv: Conversation = {
      id: newConvId,
      participants: [user.id, otherUserId],
      updated_at: new Date().toISOString(),
      unread_count: 0,
      other_user: {
        name: 'New User',
        avatar: '/placeholder.svg'
      }
    };

    setConversations(prev => [newConv, ...prev]);
    return newConvId;
  };

  const markConversationAsRead = async (conversationId: string) => {
    if (!user) return;

    setConversations(prev => prev.map(conv => 
      conv.id === conversationId 
        ? { ...conv, unread_count: 0 }
        : conv
    ));
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
