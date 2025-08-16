import React, { useState, useEffect, useMemo } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/components/ui/use-toast";
import {
  Search,
  ArrowLeft,
  UserPlus,
  Users,
  Settings,
  Phone,
  Video,
  MoreVertical,
  Crown,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";

// Import our new group components
import { CreateGroupModal } from "./CreateGroupModal";
import { GroupInfoModal } from "./GroupInfoModal";
import { GroupChatFilters, ChatFilter } from "./GroupChatFilters";
import { ChatListItem } from "./ChatListItem";

// Import existing components
import { ChatTabs } from "../ChatTabs";
import { EnhancedMessage, EnhancedChatMessage } from "../EnhancedMessage";
import WhatsAppChatInput from "../WhatsAppChatInput";
import { VoiceVideoCall } from "../VoiceVideoCall";
import { TypingIndicator } from "../TypingIndicator";
import { AIAssistantChat } from "../AIAssistantChat";

// Types
import { 
  UnifiedChatType, 
  UnifiedChatTab, 
  UnifiedChatThread,
  DEFAULT_CHAT_TABS 
} from "@/types/unified-chat";
import { 
  GroupChatThread, 
  CreateGroupRequest,
  UpdateGroupRequest,
  GroupParticipant,
} from "@/types/group-chat";
import { ChatParticipant } from "@/types/chat";
import { chatService } from "@/services/chatService";

interface EnhancedChatInterfaceProps {
  className?: string;
}

export const EnhancedChatInterface: React.FC<EnhancedChatInterfaceProps> = ({
  className,
}) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const isMobile = useIsMobile();

  // Core state
  const [activeTab, setActiveTab] = useState<UnifiedChatType>("social");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedChat, setSelectedChat] = useState<UnifiedChatThread | null>(null);
  const [conversations, setConversations] = useState<UnifiedChatThread[]>([]);
  const [messages, setMessages] = useState<Record<string, EnhancedChatMessage[]>>({});
  const [messageInput, setMessageInput] = useState("");
  const [loading, setLoading] = useState(true);
  
  // Filter state
  const [chatFilter, setChatFilter] = useState<ChatFilter>({
    type: 'all',
    showUnread: false,
    showPinned: false,
    showMuted: false,
    showArchived: false,
  });

  // Group management state
  const [showCreateGroup, setShowCreateGroup] = useState(false);
  const [showGroupInfo, setShowGroupInfo] = useState(false);
  const [availableContacts, setAvailableContacts] = useState<ChatParticipant[]>([]);

  // Call state
  const [activeCall, setActiveCall] = useState<{
    type: "voice" | "video" | "group";
    participants: any[];
    currentUser: any;
    chatInfo: any;
  } | null>(null);

  // Typing state
  const [typingUsers, setTypingUsers] = useState<{
    [chatId: string]: Array<{id: string, name: string, avatar?: string}>
  }>({});

  // Reply state
  const [replyToMessage, setReplyToMessage] = useState<EnhancedChatMessage | null>(null);

  // Enhanced tabs with counts
  const tabsWithCounts = useMemo<UnifiedChatTab[]>(() => {
    return DEFAULT_CHAT_TABS.map((tab) => {
      const count = conversations
        .filter((conv) => conv.type === tab.id)
        .reduce((total, conv) => total + (conv.unreadCount || 0), 0);

      return { ...tab, count };
    });
  }, [conversations]);

  // Filter conversations
  const filteredConversations = useMemo(() => {
    let filtered = conversations;

    // Filter by tab type
    if (activeTab !== "ai_assistant") {
      filtered = filtered.filter((conv) => conv.type === activeTab);
    }

    // Apply chat filters
    if (chatFilter.type === 'groups') {
      filtered = filtered.filter((conv) => conv.isGroup);
    } else if (chatFilter.type === 'direct') {
      filtered = filtered.filter((conv) => !conv.isGroup);
    }

    if (chatFilter.showUnread) {
      filtered = filtered.filter((conv) => (conv.unreadCount || 0) > 0);
    }

    if (chatFilter.showPinned) {
      filtered = filtered.filter((conv) => conv.isPinned);
    }

    if (!chatFilter.showMuted) {
      filtered = filtered.filter((conv) => !conv.isMuted);
    }

    if (!chatFilter.showArchived) {
      filtered = filtered.filter((conv) => !conv.isArchived);
    }

    if (chatFilter.category) {
      filtered = filtered.filter((conv) => 
        conv.isGroup && (conv as GroupChatThread).category === chatFilter.category
      );
    }

    if (chatFilter.hasAdmin) {
      filtered = filtered.filter((conv) => {
        if (!conv.isGroup) return false;
        const groupChat = conv as GroupChatThread;
        return groupChat.participants?.some(p => p.id === user?.id && p.role === 'admin');
      });
    }

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter((conv) =>
        conv.groupName?.toLowerCase().includes(query) ||
        conv.participant_profile?.name?.toLowerCase().includes(query) ||
        conv.lastMessage.toLowerCase().includes(query)
      );
    }

    return filtered.sort(
      (a, b) =>
        new Date(b.lastMessageAt).getTime() - new Date(a.lastMessageAt).getTime()
    );
  }, [conversations, activeTab, chatFilter, searchQuery, user?.id]);

  // Calculate filter counts
  const filterCounts = useMemo(() => {
    const tabConversations = conversations.filter((conv) => 
      activeTab === "ai_assistant" ? true : conv.type === activeTab
    );

    return {
      groups: tabConversations.filter((conv) => conv.isGroup).length,
      direct: tabConversations.filter((conv) => !conv.isGroup).length,
      unread: tabConversations.filter((conv) => (conv.unreadCount || 0) > 0).length,
      pinned: tabConversations.filter((conv) => conv.isPinned).length,
    };
  }, [conversations, activeTab]);

  // Load conversations
  useEffect(() => {
    if (user) {
      loadConversations();
      loadContacts();
    }
  }, [user]);

  const loadConversations = async () => {
    setLoading(true);
    try {
      const threads = await chatService.getChatThreads();
      const unifiedThreads: UnifiedChatThread[] = threads.map((thread) => ({
        ...thread,
        type: thread.type as UnifiedChatType,
      }));

      setConversations(unifiedThreads);

      // Load messages for each conversation
      for (const thread of unifiedThreads) {
        const threadMessages = await chatService.getMessages(thread.id, 50, 0, user?.id);
        const enhancedMessages: EnhancedChatMessage[] = threadMessages.map((msg) => ({
          id: msg.id,
          senderId: msg.senderId,
          senderName: msg.senderName || "Unknown",
          senderAvatar: msg.senderAvatar,
          content: msg.content,
          type: msg.messageType === "voice" ? "voice" : 
                msg.messageType === "image" || msg.messageType === "file" ? "media" : "text",
          timestamp: msg.timestamp,
          status: msg.readBy.includes(user?.id || "") ? "read" : "delivered",
          reactions: msg.reactions?.map((reaction) => ({
            userId: reaction.userIds[0] || "unknown",
            emoji: reaction.emoji,
            timestamp: msg.timestamp,
          })) || [],
          replyTo: msg.replyTo ? {
            messageId: msg.replyTo,
            content: "Replied message",
            senderName: "Unknown",
          } : undefined,
        }));

        setMessages((prev) => ({
          ...prev,
          [thread.id]: enhancedMessages,
        }));
      }
    } catch (error) {
      console.error("Error loading conversations:", error);
      toast({
        title: "Error",
        description: "Failed to load conversations",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const loadContacts = async () => {
    try {
      // This would be replaced with actual contact loading
      const mockContacts: ChatParticipant[] = [
        {
          id: "user_1",
          name: "Alice Johnson",
          avatar: "https://images.unsplash.com/photo-1494790108755-2616b9a5f4b0?w=100",
          isOnline: true,
          username: "alicej",
          isVerified: true,
        },
        {
          id: "user_2", 
          name: "Bob Smith",
          avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100",
          isOnline: false,
          username: "bobsmith",
        },
        {
          id: "user_3",
          name: "Carol Williams",
          avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100",
          isOnline: true,
          username: "carolw",
          isVerified: true,
        },
      ];
      setAvailableContacts(mockContacts);
    } catch (error) {
      console.error("Error loading contacts:", error);
    }
  };

  // Group management functions
  const handleCreateGroup = async (request: CreateGroupRequest) => {
    try {
      // This would call the actual group creation service
      console.log("Creating group:", request);
      
      // Mock group creation
      const newGroup: GroupChatThread = {
        id: `group_${Date.now()}`,
        type: "social",
        referenceId: null,
        participants: request.participants.map(userId => ({
          id: userId,
          name: availableContacts.find(c => c.id === userId)?.name || "Unknown",
          avatar: availableContacts.find(c => c.id === userId)?.avatar,
          role: userId === user?.id ? 'admin' : 'member',
          joinedAt: new Date().toISOString(),
          addedBy: user?.id || '',
          isActive: true,
          isOnline: availableContacts.find(c => c.id === userId)?.isOnline || false,
        })),
        lastMessage: request.initialMessage || "Group created",
        lastMessageAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        isGroup: true,
        groupName: request.name,
        groupDescription: request.description,
        groupAvatar: request.avatar,
        createdBy: user?.id || '',
        createdAt: new Date().toISOString(),
        adminIds: [user?.id || ''],
        settings: request.settings || {
          whoCanSendMessages: 'everyone',
          whoCanAddMembers: 'everyone', 
          whoCanEditGroupInfo: 'admins_only',
          whoCanRemoveMembers: 'admins_only',
          disappearingMessages: false,
          allowMemberInvites: true,
          showMemberAddNotifications: true,
          showMemberExitNotifications: true,
          muteNonAdminMessages: false,
        },
        maxParticipants: 256,
        groupType: request.groupType || 'private',
        category: request.category || 'friends',
        totalMessages: 0,
      };

      setConversations(prev => [newGroup, ...prev]);
      await loadConversations(); // Refresh
    } catch (error) {
      console.error("Error creating group:", error);
      throw error;
    }
  };

  const handleUpdateGroup = async (request: UpdateGroupRequest) => {
    try {
      console.log("Updating group:", request);
      // Update local state and call API
      setConversations(prev => prev.map(conv => 
        conv.id === request.groupId 
          ? { ...conv, groupName: request.name || conv.groupName, groupDescription: request.description }
          : conv
      ));
    } catch (error) {
      console.error("Error updating group:", error);
      throw error;
    }
  };

  // Chat actions
  const handlePinChat = async (chatId: string, pin: boolean) => {
    setConversations(prev => prev.map(conv => 
      conv.id === chatId ? { ...conv, isPinned: pin } : conv
    ));
  };

  const handleMuteChat = async (chatId: string, mute: boolean) => {
    setConversations(prev => prev.map(conv => 
      conv.id === chatId ? { ...conv, isMuted: mute } : conv
    ));
  };

  const handleCall = (chatId: string, type: 'voice' | 'video') => {
    const chat = conversations.find(c => c.id === chatId);
    if (!chat) return;

    setActiveCall({
      type: type,
      participants: chat.isGroup 
        ? (chat as GroupChatThread).participants || []
        : [{ id: user?.id, name: user?.profile?.full_name || "You" }],
      currentUser: { id: user?.id, name: user?.profile?.full_name || "You" },
      chatInfo: chat,
    });
  };

  // Send message
  const handleSendMessage = async () => {
    if (!selectedChat || !messageInput.trim()) return;

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

    setMessages(prev => ({
      ...prev,
      [selectedChat.id]: [...(prev[selectedChat.id] || []), newMessage],
    }));

    setMessageInput("");
    setReplyToMessage(null);

    // Update last message in conversation
    setConversations(prev => prev.map(conv => 
      conv.id === selectedChat.id 
        ? { 
            ...conv, 
            lastMessage: messageInput.trim(),
            lastMessageAt: new Date().toISOString() 
          }
        : conv
    ));
  };

  // Render chat header
  const renderChatHeader = () => {
    if (!selectedChat) return null;

    const isGroup = selectedChat.isGroup;
    const groupChat = isGroup ? selectedChat as GroupChatThread : null;
    const currentUserInGroup = groupChat?.participants?.find(p => p.id === user?.id);
    const isAdmin = currentUserInGroup?.role === 'admin';

    return (
      <div className="flex items-center justify-between p-4 border-b bg-card">
        <div className="flex items-center gap-3">
          {isMobile && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSelectedChat(null)}
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
          )}
          
          <div 
            className="flex items-center gap-3 cursor-pointer"
            onClick={() => isGroup && setShowGroupInfo(true)}
          >
            {/* Chat avatar and info */}
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <h3 className="font-semibold">
                  {isGroup ? groupChat?.groupName : selectedChat.participant_profile?.name}
                </h3>
                {isGroup && isAdmin && (
                  <Crown className="h-4 w-4 text-yellow-500" />
                )}
              </div>
              
              {isGroup ? (
                <p className="text-sm text-muted-foreground">
                  {groupChat?.participants?.filter(p => p.isActive).length} members
                  {groupChat?.participants?.filter(p => p.isOnline && p.isActive).length > 0 && 
                    `, ${groupChat.participants.filter(p => p.isOnline && p.isActive).length} online`
                  }
                </p>
              ) : (
                <p className="text-sm text-muted-foreground">
                  {selectedChat.participant_profile?.is_online ? "Online" : "Last seen recently"}
                </p>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => handleCall(selectedChat.id, 'voice')}
          >
            <Phone className="h-4 w-4" />
          </Button>
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => handleCall(selectedChat.id, 'video')}
          >
            <Video className="h-4 w-4" />
          </Button>
          {isGroup && (
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
    );
  };

  if (activeTab === "ai_assistant") {
    return <AIAssistantChat className={className} />;
  }

  return (
    <div className={cn("flex h-full bg-background", className)}>
      {/* Sidebar */}
      <div className={cn(
        "flex flex-col border-r bg-card",
        isMobile ? (selectedChat ? "hidden" : "w-full") : "w-80"
      )}>
        {/* Header */}
        <div className={cn(
          "p-4 border-b space-y-4",
          isMobile && "px-3 py-3 space-y-3"
        )}>
          <div className="flex items-center justify-between">
            <h2 className={cn(
              "text-xl font-semibold",
              isMobile && "text-lg"
            )}>Messages</h2>
            {activeTab === "social" && (
              <CreateGroupModal
                trigger={
                  <Button size="sm" className="flex items-center gap-2">
                    <UserPlus className="h-4 w-4" />
                    <span className="hidden sm:inline">New Group</span>
                  </Button>
                }
                contacts={availableContacts}
                onCreateGroup={handleCreateGroup}
                isOpen={showCreateGroup}
                onOpenChange={setShowCreateGroup}
              />
            )}
          </div>

          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search conversations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Filters */}
          {activeTab === "social" && (
            <GroupChatFilters
              activeFilter={chatFilter}
              onFilterChange={setChatFilter}
              groupsCount={filterCounts.groups}
              directCount={filterCounts.direct}
              unreadCount={filterCounts.unread}
              pinnedCount={filterCounts.pinned}
            />
          )}
        </div>

        {/* Tabs */}
        <ChatTabs
          tabs={tabsWithCounts}
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />

        {/* Chat List */}
        <ScrollArea className="flex-1">
          <div className={cn(
            "p-2 space-y-1",
            isMobile && "p-1 space-y-0.5"
          )}>
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
              </div>
            ) : filteredConversations.length > 0 ? (
              filteredConversations.map((chat) => (
                <div
                  key={chat.id}
                  className={cn(
                    "transition-transform",
                    isMobile && "active:scale-95"
                  )}
                >
                  <ChatListItem
                    chat={chat}
                    isSelected={selectedChat?.id === chat.id}
                    currentUserId={user?.id || ""}
                    onClick={() => setSelectedChat(chat)}
                    onPin={handlePinChat}
                    onMute={handleMuteChat}
                    onCall={handleCall}
                  />
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No conversations found</p>
                {activeTab === "social" && (
                  <Button
                    variant="outline"
                    className="mt-4"
                    onClick={() => setShowCreateGroup(true)}
                  >
                    <UserPlus className="h-4 w-4 mr-2" />
                    Create Group
                  </Button>
                )}
              </div>
            )}
          </div>
        </ScrollArea>
      </div>

      {/* Main Chat Area */}
      <div className={cn(
        "flex flex-col flex-1",
        isMobile && !selectedChat && "hidden"
      )}>
        {selectedChat ? (
          <>
            {renderChatHeader()}
            
            {/* Messages */}
            <ScrollArea className={cn(
              "flex-1 p-4",
              isMobile && "p-3"
            )}>
              <div className={cn(
                "space-y-4",
                isMobile && "space-y-3"
              )}>
                {(messages[selectedChat.id] || []).map((message, index) => (
                  <div
                    key={message.id}
                    className={cn(
                      isMobile && "transition-transform active:scale-98"
                    )}
                  >
                    <EnhancedMessage
                      message={message}
                      currentUserId={user?.id || ""}
                      onReact={() => {}}
                      onReply={() => setReplyToMessage(message)}
                      onEdit={() => {}}
                      onDelete={() => {}}
                      showAvatar={selectedChat.isGroup}
                      isGroupMessage={selectedChat.isGroup}
                    />
                  </div>
                ))}
              </div>
            </ScrollArea>

            {/* Typing Indicator */}
            {typingUsers[selectedChat.id] && typingUsers[selectedChat.id].length > 0 && (
              <div className="px-4">
                <TypingIndicator users={typingUsers[selectedChat.id]} />
              </div>
            )}

            {/* Message Input */}
            <div className="border-t p-4">
              <WhatsAppChatInput
                value={messageInput}
                onChange={setMessageInput}
                onSend={handleSendMessage}
                onVoiceMessage={() => {}}
                onFileUpload={() => {}}
                placeholder={`Message ${selectedChat.isGroup ? selectedChat.groupName : selectedChat.participant_profile?.name}...`}
                replyTo={replyToMessage}
                onCancelReply={() => setReplyToMessage(null)}
              />
            </div>
          </>
        ) : (
          <div className="flex items-center justify-center h-full text-muted-foreground">
            <div className="text-center">
              <Users className="h-16 w-16 mx-auto mb-4 opacity-50" />
              <h3 className="text-lg font-medium mb-2">Select a conversation</h3>
              <p className="text-sm">Choose a chat to start messaging</p>
            </div>
          </div>
        )}
      </div>

      {/* Group Info Modal */}
      {selectedChat?.isGroup && (
        <GroupInfoModal
          trigger={<div />}
          group={selectedChat as GroupChatThread}
          currentUserId={user?.id || ""}
          onUpdateGroup={handleUpdateGroup}
          isOpen={showGroupInfo}
          onOpenChange={setShowGroupInfo}
        />
      )}

      {/* Active Call */}
      {activeCall && (
        <VoiceVideoCall
          type={activeCall.type}
          participants={activeCall.participants}
          currentUser={activeCall.currentUser}
          chatInfo={activeCall.chatInfo}
          onEndCall={() => setActiveCall(null)}
          onToggleMute={() => {}}
          onToggleVideo={() => {}}
          onToggleScreenShare={() => {}}
        />
      )}
    </div>
  );
};
