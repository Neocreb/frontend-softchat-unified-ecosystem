
import React, { createContext, useContext, useState, useEffect } from "react";
import { useAuth } from "./AuthContext";
import { ChatConversation, ChatMessage } from "@/types/user";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

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
      const { data: conversationsData, error } = await supabase
        .from('chat_conversations')
        .select(`
          *,
          participant_details:profiles!chat_conversations_participants_fkey(*)
        `)
        .contains('participants', [user.id]);

      if (error) {
        console.error("Error loading conversations:", error);
        return;
      }

      const formattedConversations: ChatConversation[] = conversationsData.map(conv => ({
        id: conv.id,
        participants: conv.participants,
        participant_details: conv.participant_details,
        created_at: conv.created_at,
        updated_at: conv.updated_at,
        unread_count: 0 // This will be updated when we fetch messages
      }));

      setConversations(formattedConversations);

      // Load messages for each conversation
      formattedConversations.forEach(conv => {
        loadMessages(conv.id);
      });
    };

    loadConversations();

    // Subscribe to new messages
    const channel = supabase
      .channel('chat_messages')
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'chat_messages',
        filter: `conversation_id=in.(${conversations.map(c => c.id).join(',')})`
      }, payload => {
        const newMessage = payload.new as ChatMessage;
        handleNewMessage(newMessage);
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  const loadMessages = async (conversationId: string) => {
    const { data, error } = await supabase
      .from('chat_messages')
      .select(`
        *,
        sender:profiles(*)
      `)
      .eq('conversation_id', conversationId)
      .order('created_at', { ascending: true });

    if (error) {
      console.error("Error loading messages:", error);
      return;
    }

    const formattedMessages: ChatMessage[] = data.map(msg => ({
      id: msg.id,
      content: msg.content,
      sender_id: msg.sender_id,
      conversation_id: msg.conversation_id,
      created_at: msg.created_at,
      read: msg.read,
      sender: msg.sender ? {
        name: msg.sender.full_name || msg.sender.username || 'Unknown',
        avatar: msg.sender.avatar_url || '/placeholder.svg'
      } : undefined
    }));

    setMessages(prev => ({
      ...prev,
      [conversationId]: formattedMessages
    }));
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

      handleNewMessage(message as ChatMessage);
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
        unread_count: 0
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
      const participant = conv.participant_details;
      return participant &&
        (participant.name.toLowerCase().includes(normalizedQuery) ||
         conv.last_message?.content.toLowerCase().includes(normalizedQuery));
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
