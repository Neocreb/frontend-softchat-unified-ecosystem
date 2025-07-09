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
} from "lucide-react";
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
    <div className={cn("max-w-7xl mx-auto", className)}>
      {/* Chat Tabs */}
      <div className="mb-4">
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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
        {/* Conversations List */}
        <Card className="lg:col-span-1">
          <CardHeader className="pb-3">
            <div className="flex justify-between items-center mb-2">
              <CardTitle className="flex items-center gap-2">
                {getTypeIcon(activeTab)}
                {activeTab === "ai_assistant"
                  ? "AI Assistant"
                  : activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}{" "}
                Chat
              </CardTitle>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
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
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search conversations..."
                    className="pl-8"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <div className="flex justify-between items-center mt-2">
                  <Button
                    variant={showUnreadOnly ? "default" : "outline"}
                    size="sm"
                    onClick={() => setShowUnreadOnly(!showUnreadOnly)}
                  >
                    <Filter className="h-3 w-3 mr-1" />
                    {showUnreadOnly ? "All" : "Unread"}
                  </Button>
                  <span className="text-xs text-muted-foreground">
                    {filteredConversations.length} conversation
                    {filteredConversations.length !== 1 ? "s" : ""}
                  </span>
                </div>
              </>
            )}
          </CardHeader>

          {activeTab === "ai_assistant" ? (
            <CardContent className="p-0">
              <div className="p-4 text-center">
                <AIAssistantChat isMinimized />
                <p className="text-sm text-muted-foreground mt-2">
                  AI Assistant is always available in the main chat area
                </p>
              </div>
            </CardContent>
          ) : (
            <CardContent className="p-0">
              <ScrollArea className="h-[300px] sm:h-[400px] lg:h-[500px]">
                {loading ? (
                  <div className="p-4 text-center">
                    <div className="animate-pulse space-y-3">
                      {[...Array(3)].map((_, i) => (
                        <div key={i} className="flex items-center gap-3 p-3">
                          <div className="w-10 h-10 bg-muted rounded-full" />
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
                        "flex items-start gap-3 p-3 cursor-pointer transition-colors",
                        selectedChat?.id === conv.id
                          ? "bg-muted"
                          : "hover:bg-muted/50",
                      )}
                      onClick={() => handleChatSelect(conv)}
                    >
                      <Avatar>
                        <AvatarImage src={conv.participant_profile?.avatar} />
                        <AvatarFallback>
                          {conv.participant_profile?.name?.charAt(0) || "?"}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start mb-1">
                          <div className="flex items-center gap-1">
                            {getTypeIcon(conv.type)}
                            <h4 className="text-sm font-medium truncate">
                              {conv.participant_profile?.name}
                            </h4>
                          </div>
                          <p className="text-xs text-muted-foreground">
                            {formatMessageDate(conv.lastMessageAt)}
                          </p>
                        </div>

                        {/* Context info */}
                        {getContextInfo(conv) && (
                          <p className="text-xs text-purple-600 mb-1">
                            {getContextInfo(conv)}
                          </p>
                        )}

                        <p className="text-sm text-muted-foreground truncate">
                          {conv.lastMessage || "No messages yet"}
                        </p>
                      </div>

                      {(conv.unreadCount || 0) > 0 && (
                        <Badge variant="destructive" className="ml-1">
                          {conv.unreadCount}
                        </Badge>
                      )}
                    </div>
                  ))
                ) : (
                  <div className="p-4 text-center text-muted-foreground">
                    {searchQuery
                      ? "No conversations found"
                      : `No ${activeTab} conversations yet`}
                  </div>
                )}
              </ScrollArea>
            </CardContent>
          )}
        </Card>

        {/* Chat Area */}
        <Card className="lg:col-span-2">
          <Tabs value={activeTab} className="h-full">
            <TabsContent value="ai_assistant" className="h-full mt-0">
              <AIAssistantChat />
            </TabsContent>

            {/* Other chat types */}
            {["social", "freelance", "marketplace", "p2p"].map((chatType) => (
              <TabsContent
                key={chatType}
                value={chatType}
                className="h-full mt-0"
              >
                {selectedChat ? (
                  <>
                    <CardHeader className="pb-3">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-3">
                          <Avatar>
                            <AvatarImage
                              src={selectedChat.participant_profile?.avatar}
                            />
                            <AvatarFallback>
                              {selectedChat.participant_profile?.name?.charAt(
                                0,
                              ) || "?"}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="flex items-center gap-2">
                              {getTypeIcon(selectedChat.type)}
                              <CardTitle className="text-base">
                                {selectedChat.participant_profile?.name}
                              </CardTitle>
                            </div>
                            <p className="text-xs text-muted-foreground">
                              {selectedChat.participant_profile?.is_online
                                ? "Online"
                                : "Offline"}
                            </p>
                            {getContextInfo(selectedChat) && (
                              <p className="text-xs text-purple-600">
                                {getContextInfo(selectedChat)}
                              </p>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button variant="ghost" size="icon">
                            <Phone className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon">
                            <Video className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardHeader>

                    <CardContent className="p-0">
                      <ScrollArea className="h-[250px] sm:h-[350px] lg:h-[400px] px-4">
                        <div className="flex flex-col gap-4 py-4">
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
                                    "flex items-start gap-2 max-w-[80%]",
                                    msg.senderId === user.id
                                      ? "flex-row-reverse"
                                      : "",
                                  )}
                                >
                                  {msg.senderId !== user.id && (
                                    <Avatar className="h-8 w-8">
                                      <AvatarImage src={msg.sender?.avatar} />
                                      <AvatarFallback>
                                        {msg.sender?.name?.charAt(0) || "?"}
                                      </AvatarFallback>
                                    </Avatar>
                                  )}
                                  <div>
                                    <div
                                      className={cn(
                                        "rounded-lg p-3",
                                        msg.senderId === user.id
                                          ? "bg-primary text-primary-foreground"
                                          : "bg-muted",
                                      )}
                                    >
                                      <p className="text-sm">{msg.content}</p>
                                    </div>
                                    <div className="flex items-center justify-end mt-1 gap-1">
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
                            <div className="text-center p-4 text-muted-foreground">
                              No messages yet. Start the conversation!
                            </div>
                          )}
                        </div>
                      </ScrollArea>
                    </CardContent>

                    <div className="p-3 border-t">
                      <form
                        onSubmit={handleSendMessage}
                        className="flex w-full gap-2"
                      >
                        <Input
                          placeholder="Type a message..."
                          value={messageInput}
                          onChange={(e) => setMessageInput(e.target.value)}
                          className="flex-1"
                        />
                        <Button type="submit" size="sm">
                          <Send className="h-4 w-4 mr-1" />
                          Send
                        </Button>
                      </form>
                    </div>
                  </>
                ) : (
                  <div className="h-[600px] flex flex-col items-center justify-center p-4">
                    <div className="text-center space-y-2">
                      <div className="w-16 h-16 mx-auto mb-4 bg-muted rounded-full flex items-center justify-center">
                        {getTypeIcon(activeTab as UnifiedChatType)}
                      </div>
                      <h3 className="text-lg font-medium">
                        Select a {activeTab} conversation
                      </h3>
                      <p className="text-muted-foreground">
                        Choose a conversation from the list or start a new one
                      </p>
                    </div>
                  </div>
                )}
              </TabsContent>
            ))}
          </Tabs>
        </Card>
      </div>
    </div>
  );
};
