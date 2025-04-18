
import React, { createContext, useContext, useState, useEffect } from "react";
import { useAuth } from "./AuthContext";
import { ChatConversation, ChatMessage } from "@/types/user";
import { useToast } from "@/components/ui/use-toast";

// Mock data for conversations
const mockConversations: ChatConversation[] = [
  {
    id: "1",
    last_message: "Meta has introduced the Movie Gen I - model for video generation",
    last_message_time: "11:23",
    unread_count: 1,
    participant: {
      id: "101",
      name: "Mike Planton",
      username: "mikeplanton",
      avatar: "https://randomuser.me/api/portraits/men/32.jpg",
      is_verified: true,
      last_seen: "2 hours ago"
    }
  },
  {
    id: "2",
    last_message: "Hey, did you receive the news?",
    last_message_time: "09:31",
    unread_count: 1,
    participant: {
      id: "102",
      name: "Alicia Wernet",
      username: "aliciaw",
      avatar: "https://randomuser.me/api/portraits/women/44.jpg",
      is_verified: true,
      last_seen: "3 hours ago"
    }
  },
  {
    id: "3",
    last_message: "Photo",
    last_message_time: "08:11",
    unread_count: 0,
    participant: {
      id: "103",
      name: "ION Community",
      username: "ioncommunity",
      avatar: "https://cdn-icons-png.flaticon.com/512/3820/3820331.png",
      is_verified: true,
      last_seen: "1 day ago"
    }
  },
  {
    id: "4",
    last_message: "Are you sure? I haven't heard of.",
    last_message_time: "30.09",
    unread_count: 0,
    participant: {
      id: "104",
      name: "Diedo Shonli",
      username: "diedoshonli",
      avatar: "https://randomuser.me/api/portraits/men/42.jpg",
      is_verified: false,
      last_seen: "2 days ago"
    }
  },
  {
    id: "5",
    last_message: "Hi ☃️ Snowman, 📣 Join us for an",
    last_message_time: "31.09",
    unread_count: 0,
    participant: {
      id: "105",
      name: "Ice Open Network",
      username: "iceopennetwork",
      avatar: "https://cdn-icons-png.flaticon.com/512/6639/6639786.png",
      is_verified: false,
      last_seen: "5 days ago"
    }
  }
];

// Mock messages for a chat
const mockMessages: Record<string, ChatMessage[]> = {
  "1": [
    {
      id: "1",
      sender_id: "101",
      recipient_id: "current-user",
      content: "Hi there! How are you doing?",
      is_read: true,
      created_at: "2023-04-15T10:30:00Z",
      sender: {
        name: "Mike Planton",
        avatar: "https://randomuser.me/api/portraits/men/32.jpg",
        username: "mikeplanton",
        is_verified: true
      }
    },
    {
      id: "2",
      sender_id: "current-user",
      recipient_id: "101",
      content: "I'm good, thanks! Just checking out the new features on Softchat.",
      is_read: true,
      created_at: "2023-04-15T10:35:00Z"
    },
    {
      id: "3",
      sender_id: "101",
      recipient_id: "current-user",
      content: "Meta has introduced the Movie Gen I - model for video generation. It's amazing what they're doing with AI these days.",
      is_read: false,
      created_at: "2023-04-15T10:40:00Z",
      sender: {
        name: "Mike Planton",
        avatar: "https://randomuser.me/api/portraits/men/32.jpg",
        username: "mikeplanton",
        is_verified: true
      }
    }
  ],
  "2": [
    {
      id: "1",
      sender_id: "102",
      recipient_id: "current-user",
      content: "Hey, did you hear about the new feature release?",
      is_read: true,
      created_at: "2023-04-16T09:30:00Z",
      sender: {
        name: "Alicia Wernet",
        avatar: "https://randomuser.me/api/portraits/women/44.jpg",
        username: "aliciaw",
        is_verified: true
      }
    },
    {
      id: "2",
      sender_id: "current-user",
      recipient_id: "102",
      content: "No, what's new?",
      is_read: true,
      created_at: "2023-04-16T09:32:00Z"
    },
    {
      id: "3",
      sender_id: "102",
      recipient_id: "current-user",
      content: "Hey, did you receive the news?",
      is_read: false,
      created_at: "2023-04-16T09:35:00Z",
      sender: {
        name: "Alicia Wernet",
        avatar: "https://randomuser.me/api/portraits/women/44.jpg",
        username: "aliciaw",
        is_verified: true
      }
    }
  ]
};

// Define context type
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

// Create context
const ChatContext = createContext<ChatContextType>({} as ChatContextType);

// Custom hook to use the chat context
export const useChat = () => useContext(ChatContext);

// Provider component
export const ChatProvider = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [conversations, setConversations] = useState<ChatConversation[]>([]);
  const [messages, setMessages] = useState<Record<string, ChatMessage[]>>({});
  const [selectedChat, setSelectedChat] = useState<ChatConversation | null>(null);
  const [messageInput, setMessageInput] = useState("");
  
  // Load initial data
  useEffect(() => {
    // In a real app, we would fetch conversations from an API
    setConversations(mockConversations);
    setMessages(mockMessages);
  }, []);
  
  // Calculate unread count
  const unreadCount = conversations.reduce((count, conv) => count + (conv.unread_count || 0), 0);
  
  // Send a message
  const sendMessage = (content: string) => {
    if (!selectedChat || !content.trim()) return;
    
    const newMessage: ChatMessage = {
      id: `new-${Date.now()}`,
      sender_id: "current-user",
      recipient_id: selectedChat.participant.id,
      content: content.trim(),
      is_read: false,
      created_at: new Date().toISOString()
    };
    
    // Update messages
    const chatMessages = messages[selectedChat.id] || [];
    const updatedMessages = {
      ...messages,
      [selectedChat.id]: [...chatMessages, newMessage]
    };
    setMessages(updatedMessages);
    
    // Update conversation
    const updatedConversations = conversations.map(conv => 
      conv.id === selectedChat.id 
        ? {
            ...conv,
            last_message: content.trim(),
            last_message_time: "Just now"
          }
        : conv
    );
    
    setConversations(updatedConversations);
    setMessageInput("");
    
    // In a real app, we would send the message to the API
    toast({
      title: "Message Sent",
      description: "Your message has been sent",
    });
  };
  
  // Mark conversation as read
  const markAsRead = (chatId: string) => {
    // Update conversations
    const updatedConversations = conversations.map(conv => 
      conv.id === chatId 
        ? { ...conv, unread_count: 0 }
        : conv
    );
    
    setConversations(updatedConversations);
    
    // Update messages
    const chatMessages = messages[chatId] || [];
    const updatedMessages = chatMessages.map(msg => ({
      ...msg,
      is_read: true
    }));
    
    setMessages({
      ...messages,
      [chatId]: updatedMessages
    });
  };
  
  // Start a new chat
  const startNewChat = (userId: string, initialMessage?: string) => {
    // Check if chat already exists
    const existingChat = conversations.find(conv => conv.participant.id === userId);
    
    if (existingChat) {
      setSelectedChat(existingChat);
      if (initialMessage) {
        setMessageInput(initialMessage);
      }
      return;
    }
    
    // Create a new conversation
    const newChat: ChatConversation = {
      id: `new-${Date.now()}`,
      last_message: initialMessage || "",
      last_message_time: "Just now",
      unread_count: 0,
      participant: {
        id: userId,
        name: "New Contact",
        username: "newcontact",
        avatar: "https://ui-avatars.com/api/?name=New+Contact",
        is_verified: false,
        last_seen: "Online"
      }
    };
    
    setConversations([newChat, ...conversations]);
    setSelectedChat(newChat);
    
    if (initialMessage) {
      setMessageInput(initialMessage);
    }
  };
  
  // Search conversations
  const searchConversations = (query: string) => {
    if (!query) return conversations;
    
    const normalizedQuery = query.toLowerCase();
    return conversations.filter(conv => 
      conv.participant.name.toLowerCase().includes(normalizedQuery) ||
      conv.participant.username.toLowerCase().includes(normalizedQuery) ||
      (conv.last_message && conv.last_message.toLowerCase().includes(normalizedQuery))
    );
  };
  
  // Context value
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
