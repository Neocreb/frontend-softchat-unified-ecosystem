
import React, { createContext, useContext, useState, useEffect } from "react";
import { useAuth } from "./AuthContext";
import { ChatConversation, ChatMessage } from "@/types/user";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase/client";

type ChatContextType = {
  conversations: ChatConversation[];
  messages: Record<string, ChatMessage[]>;
  selectedChat: ChatConversation | null;
  messageInput: string;
  setMessageInput: (input: string) => void;
  setSelectedChat: (chat: ChatConversation | null) => void;
  sendMessage: (content: string) => void;
  markAsRead: (chatId: string) => void;
  startNewChat: (userId: string, initialMessage?: string) => void;
  searchConversations: (query: string) => ChatConversation[];
  unreadCount: number;
};

const ChatContext = createContext<ChatContextType>({} as ChatContextType);

export const useChat = () => useContext(ChatContext);

export const ChatProvider = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [conversations, setConversations] = useState<ChatConversation[]>([]);
  const [messages, setMessages] = useState<Record<string, ChatMessage[]>>({});
  const [selectedChat, setSelectedChat] = useState<ChatConversation | null>(null);
  const [messageInput, setMessageInput] = useState("");

  // Load conversations
  useEffect(() => {
    if (!user) return;

    const loadConversations = async () => {
      try {
        // Get all conversations where the current user is a participant
        const { data: conversationsData, error } = await supabase
          .from('chat_conversations')
          .select('*')
          .contains('participants', [user.id]);

        if (error) {
          console.error("Error loading conversations:", error);
          return;
        }

        // For each conversation, find the other participant's profile
        const formattedConversations: ChatConversation[] = [];

        for (const conv of conversationsData) {
          // Find the other participant (not the current user)
          const otherParticipantId = conv.participants.find(id => id !== user.id);

          if (!otherParticipantId) continue;

          // Get the other participant's profile
          const { data: profileData, error: profileError } = await supabase
            .from('profiles')
            .select('*')
            .eq('user_id', otherParticipantId)
            .single();

          if (profileError) {
            console.error("Error loading participant profile:", profileError);
            continue;
          }

          // Get unread count for this conversation
          const { count: unreadCount, error: countError } = await supabase
            .from('chat_messages')
            .select('*', { count: 'exact', head: true })
            .eq('conversation_id', conv.id)
            .eq('read', false)
            .neq('sender_id', user.id);

          if (countError) {
            console.error("Error getting unread count:", countError);
          }

          // Get the last message for this conversation
          const { data: lastMessageData, error: lastMessageError } = await supabase
            .from('chat_messages')
            .select('*')
            .eq('conversation_id', conv.id)
            .order('created_at', { ascending: false })
            .limit(1)
            .single();

          formattedConversations.push({
            id: conv.id,
            participants: conv.participants,
            created_at: conv.created_at,
            updated_at: conv.updated_at,
            unread_count: unreadCount || 0,
            last_message: lastMessageData ? {
              id: lastMessageData.id,
              content: lastMessageData.content,
              sender_id: lastMessageData.sender_id,
              conversation_id: lastMessageData.conversation_id,
              created_at: lastMessageData.created_at,
              read: lastMessageData.read,
            } : undefined,
            participant_profile: {
              id: otherParticipantId,
              name: profileData.full_name || profileData.username || 'User',
              avatar: profileData.avatar_url || '/placeholder.svg',
              is_online: false // TODO: Implement online status tracking
            }
          });
        }

        setConversations(formattedConversations);

        // Load messages for each conversation
        formattedConversations.forEach(conv => {
          loadMessages(conv.id);
        });
      } catch (error) {
        console.error("Error in loadConversations:", error);
      }
    };

    loadConversations();

    // Subscribe to new messages
    const channel = supabase
      .channel('chat_messages_channel')
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'chat_messages'
      }, payload => {
        const newMessage = payload.new as ChatMessage;

        // Only process messages for conversations the user is part of
        if (conversations.some(c => c.id === newMessage.conversation_id)) {
          handleNewMessage(newMessage);
        }
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  const loadMessages = async (conversationId: string) => {
    try {
      const { data, error } = await supabase
        .from('chat_messages')
        .select(`
          *,
          sender:profiles!chat_messages_sender_id_fkey(*)
        `)
        .eq('conversation_id', conversationId)
        .order('created_at', { ascending: true });

      if (error) {
        console.error("Error loading messages:", error);
        return;
      }

      const formattedMessages: ChatMessage[] = data.map(msg => {
        // Check if sender exists and handle possible errors
        let senderName = 'Unknown';
        let senderAvatar = '/placeholder.svg';

        if (msg.sender && typeof msg.sender === 'object') {
          // Make sure to use optional chaining for all properties
          const sender = msg.sender as Record<string, any>; // Type assertion to avoid null checks
          senderName = sender?.full_name || sender?.username || 'Unknown';
          senderAvatar = sender?.avatar_url || '/placeholder.svg';
        }

        return {
          id: msg.id,
          content: msg.content,
          sender_id: msg.sender_id,
          conversation_id: msg.conversation_id,
          created_at: msg.created_at,
          read: msg.read,
          sender: {
            name: senderName,
            avatar: senderAvatar
          }
        };
      });

      setMessages(prev => ({
        ...prev,
        [conversationId]: formattedMessages
      }));
    } catch (error) {
      console.error("Error in loadMessages:", error);
    }
  };

  const handleNewMessage = (message: ChatMessage) => {
    // Update messages
    setMessages(prev => ({
      ...prev,
      [message.conversation_id]: [...(prev[message.conversation_id] || []), message]
    }));

    // Update conversation
    setConversations(prev =>
      prev.map(conv =>
        conv.id === message.conversation_id
          ? {
            ...conv,
            last_message: message,
            unread_count: message.sender_id !== user?.id ? (conv.unread_count || 0) + 1 : conv.unread_count
          }
          : conv
      )
    );
  };

  // Calculate unread count
  const unreadCount = conversations.reduce((count, conv) => count + (conv.unread_count || 0), 0);

  const sendMessage = async (content: string) => {
    if (!selectedChat || !content.trim() || !user) return;

    try {
      const { data: message, error } = await supabase
        .from('chat_messages')
        .insert({
          content: content.trim(),
          sender_id: user.id,
          conversation_id: selectedChat.id,
          read: false
        })
        .select()
        .single();

      if (error) throw error;

      const newMessage: ChatMessage = {
        id: message.id,
        content: message.content,
        sender_id: message.sender_id,
        conversation_id: message.conversation_id,
        created_at: message.created_at,
        read: message.read,
        sender: {
          name: user.name || 'User',
          avatar: user.avatar || '/placeholder.svg'
        }
      };

      handleNewMessage(newMessage);
      setMessageInput("");
    } catch (error) {
      console.error("Error sending message:", error);
      toast({
        title: "Error",
        description: "Failed to send message",
        variant: "destructive",
      });
    }
  };

  const markAsRead = async (chatId: string) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('chat_messages')
        .update({ read: true })
        .eq('conversation_id', chatId)
        .neq('sender_id', user.id);

      if (error) throw error;

      setConversations(prev =>
        prev.map(conv =>
          conv.id === chatId
            ? { ...conv, unread_count: 0 }
            : conv
        )
      );
    } catch (error) {
      console.error("Error marking messages as read:", error);
    }
  };

  const startNewChat = async (userId: string, initialMessage?: string) => {
    if (!user) return;

    try {
      // Check if chat already exists
      const existingChat = conversations.find(conv =>
        conv.participants.includes(userId) && conv.participants.includes(user.id)
      );

      if (existingChat) {
        setSelectedChat(existingChat);
        if (initialMessage) {
          setMessageInput(initialMessage);
        }
        return;
      }

      // Get the other user's profile
      const { data: otherUserProfile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (profileError) {
        console.error("Error fetching user profile:", profileError);
        throw profileError;
      }

      // Create new conversation
      const { data: conversation, error } = await supabase
        .from('chat_conversations')
        .insert({
          participants: [user.id, userId],
        })
        .select()
        .single();

      if (error) throw error;

      const newChat: ChatConversation = {
        ...conversation,
        unread_count: 0,
        participant_profile: {
          id: userId,
          name: otherUserProfile.full_name || otherUserProfile.username || 'User',
          avatar: otherUserProfile.avatar_url || '/placeholder.svg',
          is_online: false
        }
      };

      setConversations(prev => [newChat, ...prev]);
      setSelectedChat(newChat);

      if (initialMessage) {
        setMessageInput(initialMessage);
      }
    } catch (error) {
      console.error("Error starting new chat:", error);
      toast({
        title: "Error",
        description: "Could not start new chat",
        variant: "destructive",
      });
    }
  };

  const searchConversations = (query: string) => {
    if (!query) return conversations;

    const normalizedQuery = query.toLowerCase();
    return conversations.filter(conv => {
      const participantName = conv.participant_profile?.name?.toLowerCase() || '';
      const lastMessageContent = conv.last_message?.content?.toLowerCase() || '';

      return participantName.includes(normalizedQuery) ||
        lastMessageContent.includes(normalizedQuery);
    });
  };

  const contextValue: ChatContextType = {
    conversations,
    messages,
    selectedChat,
    messageInput,
    setMessageInput,
    setSelectedChat,
    sendMessage,
    markAsRead,
    startNewChat,
    searchConversations,
    unreadCount
  };

  return (
    <ChatContext.Provider value={contextValue}>
      {children}
    </ChatContext.Provider>
  );
};
