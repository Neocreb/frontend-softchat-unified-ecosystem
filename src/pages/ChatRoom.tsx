import React, { useState, useEffect } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/components/ui/use-toast";
import {
  ArrowLeft,
  Phone,
  Video,
  Settings,
  Users,
  Crown,
  MoreVertical,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";

// Import chat components
import { EnhancedMessage, EnhancedChatMessage } from "@/components/chat/EnhancedMessage";
import WhatsAppChatInput from "@/components/chat/WhatsAppChatInput";
import { VoiceVideoCall } from "@/components/chat/VoiceVideoCall";
import { TypingIndicator } from "@/components/chat/TypingIndicator";
import { OnlineStatusIndicator } from "@/components/chat/OnlineStatusIndicator";
import { GroupInfoModal } from "@/components/chat/group/GroupInfoModal";

// Types
import { UnifiedChatThread, UnifiedChatType } from "@/types/unified-chat";
import { GroupChatThread } from "@/types/group-chat";

const ChatRoom = () => {
  const { threadId } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user } = useAuth();
  const { toast } = useToast();
  const isMobile = useIsMobile();

  const chatType = (searchParams.get("type") as UnifiedChatType) || "social";

  // Debug logging
  console.log("ChatRoom - threadId:", threadId, "chatType:", chatType, "user:", user?.id);
  console.log("ChatRoom - searchParams:", Object.fromEntries(searchParams.entries()));
  console.log("ChatRoom - window.location:", window.location.href);

  // State
  const [chat, setChat] = useState<UnifiedChatThread | null>(null);
  const [messages, setMessages] = useState<EnhancedChatMessage[]>([]);
  const [messageInput, setMessageInput] = useState("");
  const [loading, setLoading] = useState(true);
  const [showGroupInfo, setShowGroupInfo] = useState(false);
  const [replyToMessage, setReplyToMessage] = useState<EnhancedChatMessage | null>(null);

  // Call state
  const [activeCall, setActiveCall] = useState<{
    type: "voice" | "video" | "group";
    participants: any[];
    currentUser: any;
    chatInfo: any;
  } | null>(null);

  // Typing state
  const [typingUsers, setTypingUsers] = useState<Array<{id: string, name: string, avatar?: string}>>([]);

  // Load chat data
  useEffect(() => {
    if (!chatId) {
      setLoading(false);
      return;
    }

    // Set loading state and simulate API call
    setLoading(true);

    // Add timeout protection
    const timeoutId = setTimeout(() => {
      console.error("Chat loading timeout");
      setLoading(false);
      toast({
        title: "Loading Timeout",
        description: "Chat took too long to load. Please try again.",
        variant: "destructive",
      });
    }, 5000); // 5 second timeout

    // Simulate API delay with timeout protection
    const loadChatData = async () => {
      try {
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 300));

        // Mock chat data - in real app, fetch from API
        const mockChat: UnifiedChatThread = {
          id: chatId,
          type: chatType,
          referenceId: null,
          participant_profile: chatType !== "social" ? {
            id: "user_1",
            name: chatType === "freelance" ? "Tech Client Inc" :
                  chatType === "marketplace" ? "Electronics Store" :
                  chatType === "crypto" ? "Bitcoin Trader" : "Alice Johnson",
            avatar: "https://images.unsplash.com/photo-1494790108755-2616b9a5f4b0?w=100",
            is_online: true,
          } : {
            id: "user_1",
            name: "Alice Johnson",
            avatar: "https://images.unsplash.com/photo-1494790108755-2616b9a5f4b0?w=100",
            is_online: true,
          },
          lastMessage: "Hey! How are you?",
          lastMessageAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          isGroup: false,
          unreadCount: 0,
        };

        const mockMessages: EnhancedChatMessage[] = [
          {
            id: "msg_1",
            senderId: mockChat.participant_profile?.id || "user_1",
            senderName: mockChat.participant_profile?.name || "User",
            senderAvatar: mockChat.participant_profile?.avatar,
            content: getContextualMessage(chatType),
            type: "text",
            timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
            status: "read",
            reactions: [],
          },
          {
            id: "msg_2",
            senderId: user?.id || "current_user",
            senderName: user?.profile?.full_name || user?.email || "You",
            senderAvatar: user?.profile?.avatar_url,
            content: "Hello! I'm interested in discussing this further.",
            type: "text",
            timestamp: new Date(Date.now() - 25 * 60 * 1000).toISOString(),
            status: "read",
            reactions: [],
          },
        ];

        setChat(mockChat);
        setMessages(mockMessages);
        setLoading(false);
        clearTimeout(timeoutId); // Clear timeout on success
      } catch (error) {
        console.error("Error loading chat:", error);
        setLoading(false);
        clearTimeout(timeoutId); // Clear timeout on error
        toast({
          title: "Error",
          description: "Failed to load chat. Please try again.",
          variant: "destructive",
        });
      }
    };

    loadChatData();

    // Cleanup timeout on unmount
    return () => {
      clearTimeout(timeoutId);
    };
  }, [chatId, chatType, user?.id, toast]);

  const getContextualMessage = (type: UnifiedChatType) => {
    switch (type) {
      case "freelance":
        return "Hi! I saw your application for the web development project. Let's discuss the requirements.";
      case "marketplace":
        return "Hello! I'm interested in the laptop you have listed. Is it still available?";
      case "crypto":
        return "Hey! I'd like to trade some Bitcoin. Are you interested in the offer I posted?";
      default:
        return "Hey! How are you doing?";
    }
  };

  const getPageTitle = () => {
    if (!chat) return "Chat | Softchat";
    
    const contextPrefix = chatType === "freelance" ? "Work Chat" :
                         chatType === "marketplace" ? "Marketplace Chat" :
                         chatType === "crypto" ? "P2P Chat" : "Chat";
    
    return `${contextPrefix} with ${chat.participant_profile?.name} | Softchat`;
  };

  const handleSendMessage = async () => {
    if (!messageInput.trim() || !chat) return;

    const newMessage: EnhancedChatMessage = {
      id: `msg_${Date.now()}`,
      senderId: user?.id || "current-user",
      senderName: user?.profile?.full_name || user?.email || "You",
      senderAvatar: user?.profile?.avatar_url,
      content: messageInput.trim(),
      type: "text",
      timestamp: new Date().toISOString(),
      status: "sent",
      reactions: [],
      replyTo: replyToMessage,
    };

    setMessages(prev => [...prev, newMessage]);
    setMessageInput("");
    setReplyToMessage(null);

    // Simulate delivery
    setTimeout(() => {
      setMessages(prev => prev.map(msg => 
        msg.id === newMessage.id ? { ...msg, status: "delivered" } : msg
      ));
    }, 1000);
  };

  const handleCall = (type: 'voice' | 'video') => {
    if (!chat) return;

    setActiveCall({
      type: type,
      participants: [{ id: user?.id, name: user?.profile?.full_name || "You" }],
      currentUser: { id: user?.id, name: user?.profile?.full_name || "You" },
      chatInfo: chat,
    });
  };

  const handleReplyToMessage = (message: EnhancedChatMessage) => {
    setReplyToMessage(message);
  };

  const handleReactToMessage = (messageId: string, emoji: string) => {
    setMessages(prev => prev.map(msg => 
      msg.id === messageId 
        ? {
            ...msg,
            reactions: [
              ...(msg.reactions || []),
              {
                userId: user?.id || "",
                emoji,
                timestamp: new Date().toISOString(),
              },
            ],
          }
        : msg
    ));
  };

  // Early return if no chatId
  if (!chatId) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-lg font-semibold mb-2">No chat selected</h2>
          <Button onClick={() => navigate("/app/chat")}>
            Back to Chats
          </Button>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4" />
          <p className="text-sm text-muted-foreground">Loading chat...</p>
        </div>
      </div>
    );
  }

  if (!chat) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-lg font-semibold mb-2">Chat not found</h2>
          <p className="text-sm text-muted-foreground mb-4">
            The chat you're looking for doesn't exist or has been removed.
          </p>
          <Button onClick={() => navigate("/app/chat")}>
            Back to Chats
          </Button>
        </div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>{getPageTitle()}</title>
        <meta
          name="description"
          content={`Chat conversation with ${chat.participant_profile?.name}`}
        />
      </Helmet>

      <div className="h-screen bg-background flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b bg-card">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate("/app/chat")}
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <h3 className="font-semibold">
                  {chat.participant_profile?.name}
                </h3>
                {chatType !== "social" && (
                  <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">
                    {chatType === "freelance" ? "💼 Work" :
                     chatType === "marketplace" ? "🛒 Market" : "🪙 P2P"}
                  </span>
                )}
              </div>
              
              <p className="text-sm text-muted-foreground">
                {chat.participant_profile?.is_online ? "Online" : "Last seen recently"}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => handleCall('voice')}
            >
              <Phone className="h-4 w-4" />
            </Button>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => handleCall('video')}
            >
              <Video className="h-4 w-4" />
            </Button>
            {chat.isGroup && (
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => setShowGroupInfo(true)}
              >
                <Settings className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>

        {/* Messages */}
        <ScrollArea className="flex-1 p-4">
          <div className="space-y-4">
            {messages.map((message) => (
              <EnhancedMessage
                key={message.id}
                message={message}
                currentUserId={user?.id || ""}
                onReact={(emoji) => handleReactToMessage(message.id, emoji)}
                onReply={() => handleReplyToMessage(message)}
                onEdit={() => {}}
                onDelete={() => {}}
                showAvatar={false}
                isGroupMessage={false}
              />
            ))}
          </div>
        </ScrollArea>

        {/* Typing Indicator */}
        {typingUsers.length > 0 && (
          <div className="px-4 pb-2">
            <TypingIndicator users={typingUsers} />
          </div>
        )}

        {/* Online Status */}
        {chat.participant_profile && (
          <div className="px-4 pb-2">
            <OnlineStatusIndicator 
              isOnline={chat.participant_profile.is_online || false}
              lastSeen={chat.lastMessageAt}
            />
          </div>
        )}

        {/* Message Input */}
        <div className="bg-background">
          <WhatsAppChatInput
            messageInput={messageInput}
            setMessageInput={setMessageInput}
            onSendMessage={(type, content, metadata) => {
              if (type === "text") {
                handleSendMessage();
              } else {
                // Handle other message types
                const newMessage: EnhancedChatMessage = {
                  id: `msg_${Date.now()}`,
                  senderId: user?.id || "current-user",
                  senderName: user?.profile?.full_name || user?.email || "You",
                  senderAvatar: user?.profile?.avatar_url,
                  content: content,
                  type: type === "voice" ? "voice" : type === "sticker" ? "sticker" : "media",
                  timestamp: new Date().toISOString(),
                  status: "sent",
                  reactions: [],
                  metadata: metadata,
                };

                setMessages(prev => [...prev, newMessage]);
              }
            }}
            isMobile={isMobile}
            placeholder={`Message ${chat.participant_profile?.name}...`}
            currentUserId={user?.id}
          />
        </div>
      </div>

      {/* Active Call */}
      {activeCall && (
        <VoiceVideoCall
          type={activeCall.type}
          participants={activeCall.participants}
          currentUser={activeCall.currentUser}
          chatInfo={activeCall.chatInfo}
          onEndCall={() => setActiveCall(null)}
          isAudioMuted={false}
          isVideoEnabled={true}
          onToggleAudio={() => {}}
          onToggleVideo={() => {}}
        />
      )}

      {/* Group Info Modal */}
      {chat.isGroup && (
        <GroupInfoModal
          trigger={<div />}
          group={chat as GroupChatThread}
          currentUserId={user?.id || ""}
          onUpdateGroup={() => {}}
          isOpen={showGroupInfo}
          onOpenChange={setShowGroupInfo}
        />
      )}
    </>
  );
};

export default ChatRoom;
