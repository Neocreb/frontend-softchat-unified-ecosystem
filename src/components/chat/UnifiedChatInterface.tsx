import React, { useState, useEffect, useMemo } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import {
  Search,
  Send,
  CheckCheck,
  Phone,
  Video,
  MoreVertical,
  PlusCircle,
  Users,
  Briefcase,
  ShoppingBag,
  Coins,
  MessageSquare,
  Filter,
  ArrowLeft,
} from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import { format } from "date-fns";
import { useToast } from "@/components/ui/use-toast";
import { ChatTabs } from "./ChatTabs";
import { AIAssistantChat } from "./AIAssistantChat";
import { chatService } from "@/services/chatService";
import {
  UnifiedChatType,
  UnifiedChatTab,
  UnifiedChatThread,
  DEFAULT_CHAT_TABS,
} from "@/types/unified-chat";
import { ChatThread, ChatMessage, ChatFilter } from "@/types/chat";
import { cn } from "@/lib/utils";

interface UnifiedChatInterfaceProps {
  className?: string;
}

export const UnifiedChatInterface: React.FC<UnifiedChatInterfaceProps> = ({
  className,
}) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const isMobile = useIsMobile();

  // State management
  const [activeTab, setActiveTab] = useState<UnifiedChatType>("social");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedChat, setSelectedChat] = useState<UnifiedChatThread | null>(
    null,
  );
  const [conversations, setConversations] = useState<UnifiedChatThread[]>([]);
  const [messages, setMessages] = useState<Record<string, ChatMessage[]>>({});
  const [messageInput, setMessageInput] = useState("");
  const [loading, setLoading] = useState(true);
  const [showUnreadOnly, setShowUnreadOnly] = useState(false);

  // Handle URL parameters for direct navigation
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const typeParam = urlParams.get("type") as UnifiedChatType;
    const threadParam = urlParams.get("thread");

    if (typeParam && DEFAULT_CHAT_TABS.some((tab) => tab.id === typeParam)) {
      setActiveTab(typeParam);
    }

    if (threadParam && conversations.length > 0) {
      const targetChat = conversations.find((conv) => conv.id === threadParam);
      if (targetChat) {
        setSelectedChat(targetChat);
      }
    }
  }, [conversations]);

  // Enhanced tabs with unread counts
  const tabsWithCounts = useMemo<UnifiedChatTab[]>(() => {
    return DEFAULT_CHAT_TABS.map((tab) => {
      const count = conversations
        .filter((conv) => conv.type === tab.id)
        .reduce((total, conv) => total + (conv.unreadCount || 0), 0);

      return {
        ...tab,
        count,
      };
    });
  }, [conversations]);

  // Filter conversations based on active tab and search
  const filteredConversations = useMemo(() => {
    let filtered = conversations;

    // Filter by tab type (except AI assistant which is handled separately)
    if (activeTab !== "ai_assistant") {
      filtered = filtered.filter((conv) => conv.type === activeTab);
    }

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (conv) =>
          conv.participant_profile?.name?.toLowerCase().includes(query) ||
          conv.lastMessage.toLowerCase().includes(query) ||
          conv.contextData?.jobTitle?.toLowerCase().includes(query) ||
          conv.contextData?.productName?.toLowerCase().includes(query),
      );
    }

    // Filter by unread status
    if (showUnreadOnly) {
      filtered = filtered.filter((conv) => (conv.unreadCount || 0) > 0);
    }

    return filtered.sort(
      (a, b) =>
        new Date(b.lastMessageAt).getTime() -
        new Date(a.lastMessageAt).getTime(),
    );
  }, [conversations, activeTab, searchQuery, showUnreadOnly]);

  // Load conversations on mount
  useEffect(() => {
    if (user) {
      loadConversations();
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
        const threadMessages = await chatService.getMessages(thread.id);
        setMessages((prev) => ({
          ...prev,
          [thread.id]: threadMessages,
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

  const handleTabChange = (tab: UnifiedChatType) => {
    setActiveTab(tab);
    setSelectedChat(null);
    setSearchQuery("");
  };

  const handleChatSelect = (chat: UnifiedChatThread) => {
    setSelectedChat(chat);
    // Mark as read
    if (chat.unreadCount && chat.unreadCount > 0) {
      chatService.markAsRead(chat.id, user?.id || "");
      setConversations((prev) =>
        prev.map((conv) =>
          conv.id === chat.id ? { ...conv, unreadCount: 0 } : conv,
        ),
      );
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageInput.trim() || !selectedChat || !user) return;

    try {
      const newMessage = await chatService.sendMessage({
        threadId: selectedChat.id,
        content: messageInput.trim(),
        messageType: "text",
      });

      setMessages((prev) => ({
        ...prev,
        [selectedChat.id]: [...(prev[selectedChat.id] || []), newMessage],
      }));

      setMessageInput("");

      // Update conversation last message
      setConversations((prev) =>
        prev.map((conv) =>
          conv.id === selectedChat.id
            ? {
                ...conv,
                lastMessage: messageInput.trim(),
                lastMessageAt: newMessage.timestamp,
              }
            : conv,
        ),
      );
    } catch (error) {
      console.error("Error sending message:", error);
      toast({
        title: "Error",
        description: "Failed to send message",
        variant: "destructive",
      });
    }
  };

  const getContextInfo = (conversation: UnifiedChatThread) => {
    const { contextData, type } = conversation;
    if (!contextData) return null;

    switch (type) {
      case "freelance":
        return contextData.jobTitle;
      case "marketplace":
        return contextData.productName;
      case "p2p":
        return `${contextData.cryptoType} Trade`;
      default:
        return null;
    }
  };

  const getTypeIcon = (type: UnifiedChatType) => {
    switch (type) {
      case "freelance":
        return <Briefcase className="h-3 w-3" />;
      case "marketplace":
        return <ShoppingBag className="h-3 w-3" />;
      case "p2p":
        return <Coins className="h-3 w-3" />;
      case "social":
        return <Users className="h-3 w-3" />;
      default:
        return <MessageSquare className="h-3 w-3" />;
    }
  };

  const formatMessageDate = (date: string) => {
    const messageDate = new Date(date);
    const today = new Date();

    if (messageDate.toDateString() === today.toDateString()) {
      return format(messageDate, "h:mm a");
    } else {
      return format(messageDate, "MMM d");
    }
  };

  if (!user) return null;

  return (
    <div className={cn("h-full flex flex-col", className)}>
      {/* Chat Tabs - sticky top */}
      <div className="shrink-0 bg-background border-b px-4 py-3">
        <ChatTabs
          tabs={tabsWithCounts}
          activeTab={activeTab}
          onTabChange={handleTabChange}
          totalUnreadCount={tabsWithCounts.reduce(
            (total, tab) => total + (tab.count || 0),
            0,
          )}
        />
      </div>

      {/* Main chat area */}
      <div className="flex-1 overflow-hidden">
        <div className="h-full flex">
          {/* Conversations List - Responsive sidebar */}
          <div
            className={cn(
              "transition-all duration-300 ease-in-out bg-background border-r",
              "flex flex-col",
              // Mobile: full width when no chat selected, hidden when chat selected
              isMobile &&
                !selectedChat &&
                activeTab !== "ai_assistant" &&
                "w-full",
              isMobile &&
                (selectedChat || activeTab === "ai_assistant") &&
                "hidden",
              // Desktop: fixed sidebar width
              !isMobile && "w-80 xl:w-96",
            )}
          >
            <Card className="w-full h-full border-0 shadow-none bg-transparent flex flex-col">
              <CardHeader
                className={`pb-3 ${isMobile ? "px-3 py-3" : "px-4 py-4"}`}
              >
                <div className="flex justify-between items-center mb-2">
                  <CardTitle
                    className={`flex items-center gap-2 ${isMobile ? "text-base" : "text-lg"}`}
                  >
                    {getTypeIcon(activeTab)}
                    <span className="truncate">
                      {activeTab === "ai_assistant"
                        ? "AI Assistant"
                        : activeTab.charAt(0).toUpperCase() +
                          activeTab.slice(1)}{" "}
                      {isMobile ? "" : "Chat"}
                    </span>
                  </CardTitle>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size={isMobile ? "sm" : "default"}
                        className={isMobile ? "h-8 w-8 p-0" : "h-9 w-9 p-0"}
                      >
                        <span className="sr-only">Open menu</span>
                        <PlusCircle className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>New Chat</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem>Start Social Chat</DropdownMenuItem>
                      <DropdownMenuItem>Find Freelancer</DropdownMenuItem>
                      <DropdownMenuItem>Message Seller</DropdownMenuItem>
                      <DropdownMenuItem>P2P Trade Chat</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                {/* Search and Filter */}
                {activeTab !== "ai_assistant" && (
                  <>
                    <div className="relative">
                      <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder={
                          isMobile ? "Search..." : "Search conversations..."
                        }
                        className={`pl-10 ${isMobile ? "h-9" : "h-10"}`}
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                      />
                    </div>
                    <div className="flex justify-between items-center mt-2 gap-2">
                      <Button
                        variant={showUnreadOnly ? "default" : "outline"}
                        size="sm"
                        onClick={() => setShowUnreadOnly(!showUnreadOnly)}
                        className={isMobile ? "text-xs px-2" : ""}
                      >
                        <Filter className="h-3 w-3 mr-1" />
                        {showUnreadOnly ? "All" : "Unread"}
                      </Button>
                      <span
                        className={`text-muted-foreground ${isMobile ? "text-xs" : "text-sm"}`}
                      >
                        {filteredConversations.length}
                        {!isMobile && " conversation"}
                        {!isMobile && filteredConversations.length !== 1
                          ? "s"
                          : ""}
                      </span>
                    </div>
                  </>
                )}
              </CardHeader>

              {activeTab === "ai_assistant" ? (
                <CardContent className="p-0 flex-1">
                  <div className={`${isMobile ? "p-3" : "p-4"} text-center`}>
                    <AIAssistantChat isMinimized />
                    <p
                      className={`text-muted-foreground mt-2 ${isMobile ? "text-xs" : "text-sm"}`}
                    >
                      {isMobile
                        ? "AI Assistant available"
                        : "AI Assistant is always available in the main chat area"}
                    </p>
                  </div>
                </CardContent>
              ) : (
                <CardContent className="p-0 flex-1 overflow-hidden">
                  <ScrollArea
                    className={
                      isMobile
                        ? "h-[calc(100vh-200px)]"
                        : "h-[calc(100vh-240px)]"
                    }
                    style={{
                      height: isMobile
                        ? "calc(100vh - 200px)"
                        : "calc(100vh - 240px)",
                    }}
                  >
                    {loading ? (
                      <div
                        className={`${isMobile ? "p-3" : "p-4"} text-center`}
                      >
                        <div className="animate-pulse space-y-3">
                          {[...Array(3)].map((_, i) => (
                            <div
                              key={i}
                              className={`flex items-center gap-3 ${isMobile ? "p-2" : "p-3"}`}
                            >
                              <div
                                className={`bg-muted rounded-full ${isMobile ? "w-8 h-8" : "w-10 h-10"}`}
                              />
                              <div className="flex-1 space-y-2">
                                <div className="h-4 bg-muted rounded w-3/4" />
                                <div className="h-3 bg-muted rounded w-1/2" />
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ) : filteredConversations.length > 0 ? (
                      filteredConversations.map((conv) => (
                        <div
                          key={conv.id}
                          className={cn(
                            "flex items-start cursor-pointer transition-all duration-200 border-b border-border/30 last:border-b-0",
                            "active:bg-muted/70 touch-manipulation", // Touch optimizations
                            isMobile ? "gap-2 p-3" : "gap-3 p-4",
                            selectedChat?.id === conv.id
                              ? "bg-primary/5 border-l-2 border-l-primary"
                              : "hover:bg-muted/50 hover:border-l-2 hover:border-l-muted-foreground/20",
                          )}
                          onClick={() => handleChatSelect(conv)}
                        >
                          <div className="relative flex-shrink-0">
                            <Avatar
                              className={isMobile ? "h-10 w-10" : "h-12 w-12"}
                            >
                              <AvatarImage
                                src={conv.participant_profile?.avatar}
                              />
                              <AvatarFallback className="bg-gradient-to-br from-primary/20 to-primary/10 text-primary font-semibold">
                                {conv.participant_profile?.name?.charAt(0) ||
                                  "?"}
                              </AvatarFallback>
                            </Avatar>
                            {conv.participant_profile?.is_online && (
                              <div
                                className={`absolute bg-green-500 border-2 border-background rounded-full ${
                                  isMobile
                                    ? "-bottom-0.5 -right-0.5 w-2.5 h-2.5"
                                    : "-bottom-0.5 -right-0.5 w-3 h-3"
                                }`}
                              ></div>
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex justify-between items-start mb-1">
                              <div className="flex items-center gap-2 min-w-0 flex-1">
                                <div
                                  className={`rounded bg-muted/50 ${isMobile ? "p-0.5" : "p-1"}`}
                                >
                                  {getTypeIcon(conv.type)}
                                </div>
                                <h4
                                  className={`font-semibold truncate text-foreground ${
                                    isMobile ? "text-sm" : "text-sm"
                                  }`}
                                >
                                  {conv.participant_profile?.name}
                                </h4>
                              </div>
                              <div className="flex flex-col items-end gap-1 ml-2">
                                <p
                                  className={`text-muted-foreground ${
                                    isMobile ? "text-xs" : "text-xs"
                                  }`}
                                >
                                  {formatMessageDate(conv.lastMessageAt)}
                                </p>
                                {(conv.unreadCount || 0) > 0 && (
                                  <Badge
                                    variant="destructive"
                                    className={`text-xs ${
                                      isMobile
                                        ? "h-4 min-w-[16px] px-1"
                                        : "h-5 min-w-[20px] px-1.5"
                                    }`}
                                  >
                                    {conv.unreadCount > 99
                                      ? "99+"
                                      : conv.unreadCount}
                                  </Badge>
                                )}
                              </div>
                            </div>

                            {/* Context info */}
                            {getContextInfo(conv) && (
                              <div className="flex items-center gap-1 mb-1">
                                <div className="w-1 h-1 bg-primary rounded-full"></div>
                                <p
                                  className={`text-primary font-medium ${
                                    isMobile ? "text-xs" : "text-xs"
                                  }`}
                                >
                                  {getContextInfo(conv)}
                                </p>
                              </div>
                            )}

                            <p
                              className={`text-muted-foreground truncate leading-relaxed ${
                                isMobile ? "text-xs" : "text-sm"
                              }`}
                            >
                              {conv.lastMessage || "No messages yet"}
                            </p>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div
                        className={`${isMobile ? "p-3" : "p-4"} text-center text-muted-foreground`}
                      >
                        <div className="space-y-2">
                          <MessageSquare
                            className={`mx-auto text-muted-foreground/50 ${
                              isMobile ? "h-8 w-8" : "h-12 w-12"
                            }`}
                          />
                          <p className={isMobile ? "text-sm" : "text-base"}>
                            {searchQuery
                              ? "No conversations found"
                              : `No ${activeTab} conversations yet`}
                          </p>
                          {!searchQuery && (
                            <p
                              className={`text-muted-foreground/70 ${
                                isMobile ? "text-xs" : "text-sm"
                              }`}
                            >
                              Start a new conversation to get started
                            </p>
                          )}
                        </div>
                      </div>
                    )}
                  </ScrollArea>
                </CardContent>
              )}
            </Card>
          </div>

          {/* Chat Area - Responsive message area */}
          <div
            className={cn(
              "flex-1 bg-background flex flex-col",
              // Mobile: full width when chat selected or AI assistant, hidden otherwise
              isMobile &&
                !selectedChat &&
                activeTab !== "ai_assistant" &&
                "hidden",
              isMobile &&
                (selectedChat || activeTab === "ai_assistant") &&
                "w-full",
              // Desktop: always visible, takes remaining space
              !isMobile && "flex",
            )}
          >
            <Card className="w-full border-0 shadow-none h-full flex flex-col">
              <Tabs value={activeTab} className="h-full flex flex-col">
                <TabsContent
                  value="ai_assistant"
                  className="h-full mt-0 flex flex-col"
                >
                  <div className="flex flex-col h-full">
                    {/* Mobile back button for AI Assistant */}
                    {isMobile && (
                      <div className="border-b p-3 flex-shrink-0">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setActiveTab("social")}
                          className="flex items-center gap-2"
                        >
                          <ArrowLeft className="h-4 w-4" />
                          Back to chats
                        </Button>
                      </div>
                    )}
                    <div className="flex-1 min-h-0">
                      <AIAssistantChat />
                    </div>
                  </div>
                </TabsContent>

                {/* Other chat types */}
                {["social", "freelance", "marketplace", "p2p"].map(
                  (chatType) => (
                    <TabsContent
                      key={chatType}
                      value={chatType}
                      className="h-full mt-0 flex flex-col"
                    >
                      {selectedChat ? (
                        <>
                          <CardHeader
                            className={`pb-3 flex-shrink-0 ${isMobile ? "px-3 py-3" : "px-4 py-4"}`}
                          >
                            <div className="flex justify-between items-center">
                              <div className="flex items-center gap-3 min-w-0 flex-1">
                                {/* Mobile back button */}
                                {isMobile && (
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => setSelectedChat(null)}
                                    className="p-1 flex-shrink-0"
                                  >
                                    <ArrowLeft className="h-4 w-4" />
                                  </Button>
                                )}
                                <Avatar
                                  className={isMobile ? "h-8 w-8" : "h-10 w-10"}
                                >
                                  <AvatarImage
                                    src={
                                      selectedChat.participant_profile?.avatar
                                    }
                                  />
                                  <AvatarFallback>
                                    {selectedChat.participant_profile?.name?.charAt(
                                      0,
                                    ) || "?"}
                                  </AvatarFallback>
                                </Avatar>
                                <div className="min-w-0 flex-1">
                                  <div className="flex items-center gap-2">
                                    {getTypeIcon(selectedChat.type)}
                                    <CardTitle
                                      className={`truncate ${
                                        isMobile ? "text-sm" : "text-base"
                                      }`}
                                    >
                                      {selectedChat.participant_profile?.name}
                                    </CardTitle>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <p
                                      className={`text-muted-foreground ${
                                        isMobile ? "text-xs" : "text-sm"
                                      }`}
                                    >
                                      {selectedChat.participant_profile
                                        ?.is_online
                                        ? "Online"
                                        : "Offline"}
                                    </p>
                                    {getContextInfo(selectedChat) && (
                                      <>
                                        <div className="w-1 h-1 bg-muted-foreground rounded-full" />
                                        <p
                                          className={`text-primary font-medium truncate ${
                                            isMobile ? "text-xs" : "text-sm"
                                          }`}
                                        >
                                          {getContextInfo(selectedChat)}
                                        </p>
                                      </>
                                    )}
                                  </div>
                                </div>
                              </div>
                              {!isMobile && (
                                <div className="flex items-center gap-1">
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-8 w-8"
                                  >
                                    <Phone className="h-4 w-4" />
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-8 w-8"
                                  >
                                    <Video className="h-4 w-4" />
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-8 w-8"
                                  >
                                    <MoreVertical className="h-4 w-4" />
                                  </Button>
                                </div>
                              )}
                            </div>
                          </CardHeader>

                          <CardContent className="p-0 flex-1 overflow-hidden flex flex-col">
                            <ScrollArea
                              className={`flex-1 ${isMobile ? "px-3" : "px-4"}`}
                              style={{
                                height: isMobile
                                  ? "calc(100vh - 180px)"
                                  : "calc(100vh - 240px)",
                              }}
                            >
                              <div
                                className={`flex flex-col py-4 ${isMobile ? "gap-3" : "gap-4"}`}
                              >
                                {messages[selectedChat.id] &&
                                messages[selectedChat.id].length > 0 ? (
                                  messages[selectedChat.id].map((msg) => (
                                    <div
                                      key={msg.id}
                                      className={cn(
                                        "flex",
                                        msg.senderId === user.id
                                          ? "justify-end"
                                          : "justify-start",
                                      )}
                                    >
                                      <div
                                        className={cn(
                                          "flex items-start gap-2",
                                          isMobile
                                            ? "max-w-[85%]"
                                            : "max-w-[80%]",
                                          msg.senderId === user.id
                                            ? "flex-row-reverse"
                                            : "",
                                        )}
                                      >
                                        {msg.senderId !== user.id && (
                                          <Avatar
                                            className={
                                              isMobile
                                                ? "h-6 w-6 mt-1"
                                                : "h-8 w-8"
                                            }
                                          >
                                            <AvatarImage
                                              src={msg.sender?.avatar}
                                            />
                                            <AvatarFallback
                                              className={
                                                isMobile ? "text-xs" : "text-sm"
                                              }
                                            >
                                              {msg.sender?.name?.charAt(0) ||
                                                "?"}
                                            </AvatarFallback>
                                          </Avatar>
                                        )}
                                        <div className="flex-1">
                                          <div
                                            className={cn(
                                              "rounded-lg",
                                              isMobile ? "p-2.5" : "p-3",
                                              msg.senderId === user.id
                                                ? "bg-primary text-primary-foreground"
                                                : "bg-muted",
                                            )}
                                          >
                                            <p
                                              className={
                                                isMobile
                                                  ? "text-sm leading-relaxed"
                                                  : "text-sm"
                                              }
                                            >
                                              {msg.content}
                                            </p>
                                          </div>
                                          <div
                                            className={`flex items-center mt-1 gap-1 ${
                                              msg.senderId === user.id
                                                ? "justify-end"
                                                : "justify-start"
                                            }`}
                                          >
                                            <p className="text-xs text-muted-foreground">
                                              {formatMessageDate(msg.timestamp)}
                                            </p>
                                            {msg.senderId === user.id && (
                                              <CheckCheck
                                                className={cn(
                                                  "h-3 w-3",
                                                  msg.readBy.length > 1
                                                    ? "text-blue-500"
                                                    : "text-muted-foreground",
                                                )}
                                              />
                                            )}
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  ))
                                ) : (
                                  <div
                                    className={`text-center text-muted-foreground ${
                                      isMobile ? "p-6" : "p-8"
                                    }`}
                                  >
                                    <MessageSquare
                                      className={`mx-auto mb-3 text-muted-foreground/50 ${
                                        isMobile ? "h-8 w-8" : "h-12 w-12"
                                      }`}
                                    />
                                    <p
                                      className={
                                        isMobile ? "text-sm" : "text-base"
                                      }
                                    >
                                      No messages yet. Start the conversation!
                                    </p>
                                  </div>
                                )}
                              </div>
                            </ScrollArea>
                          </CardContent>

                          <div
                            className={`border-t flex-shrink-0 ${
                              isMobile ? "p-2.5" : "p-3"
                            }`}
                          >
                            <form
                              onSubmit={handleSendMessage}
                              className="flex w-full gap-2"
                            >
                              <Input
                                placeholder={
                                  isMobile
                                    ? "Type message..."
                                    : "Type a message..."
                                }
                                value={messageInput}
                                onChange={(e) =>
                                  setMessageInput(e.target.value)
                                }
                                className={`flex-1 ${isMobile ? "h-9" : "h-10"}`}
                                autoComplete="off"
                              />
                              <Button
                                type="submit"
                                size={isMobile ? "sm" : "default"}
                                className={isMobile ? "px-3" : "px-4"}
                                disabled={!messageInput.trim()}
                              >
                                <Send className="h-4 w-4" />
                                {!isMobile && (
                                  <span className="ml-1">Send</span>
                                )}
                              </Button>
                            </form>
                          </div>
                        </>
                      ) : (
                        <div className="flex-1 flex flex-col items-center justify-center p-4">
                          <div className="text-center space-y-3">
                            <div
                              className={`mx-auto mb-4 bg-muted rounded-full flex items-center justify-center ${
                                isMobile ? "w-12 h-12" : "w-16 h-16"
                              }`}
                            >
                              {getTypeIcon(activeTab as UnifiedChatType)}
                            </div>
                            <h3
                              className={`font-medium ${
                                isMobile ? "text-base" : "text-lg"
                              }`}
                            >
                              {isMobile
                                ? `Select ${activeTab} chat`
                                : `Select a ${activeTab} conversation`}
                            </h3>
                            <p
                              className={`text-muted-foreground ${
                                isMobile ? "text-sm" : "text-base"
                              }`}
                            >
                              {isMobile
                                ? "Choose a conversation or start new"
                                : "Choose a conversation from the list or start a new one"}
                            </p>
                          </div>
                        </div>
                      )}
                    </TabsContent>
                  ),
                )}
              </Tabs>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};
