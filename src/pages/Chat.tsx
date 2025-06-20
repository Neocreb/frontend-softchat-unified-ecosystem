import React, { useState, useEffect } from "react";
import { useChat } from "@/contexts/ChatContext";
import { useAuth } from "@/contexts/AuthContext";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Search,
  Send,
  CheckCheck,
  Phone,
  Video,
  MoreVertical,
  PlusCircle,
} from "lucide-react";
import { format } from "date-fns";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Chat = () => {
  const { user } = useAuth();
  const {
    conversations,
    messages,
    selectedChat,
    setSelectedChat,
    sendMessage,
    messageInput,
    setMessageInput,
    markAsRead,
    searchConversations,
    startNewChat,
  } = useChat();

  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("all");

  // Filter conversations based on search and active tab
  const filteredConversations = React.useMemo(() => {
    let filtered = searchQuery
      ? searchConversations(searchQuery)
      : conversations;

    if (activeTab === "unread") {
      filtered = filtered.filter((conv) => (conv.unread_count || 0) > 0);
    }

    return filtered;
  }, [conversations, searchQuery, activeTab, searchConversations]);

  // Mark messages as read when selecting a chat
  useEffect(() => {
    if (selectedChat) {
      markAsRead(selectedChat.id);
    }
  }, [selectedChat, markAsRead]);

  // Function to format message date
  const formatMessageDate = (date: string) => {
    const messageDate = new Date(date);
    const today = new Date();

    if (messageDate.toDateString() === today.toDateString()) {
      return format(messageDate, "h:mm a");
    } else {
      return format(messageDate, "MMM d");
    }
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (messageInput.trim()) {
      sendMessage(messageInput);
    }
  };

  if (!user) return null;

  return (
    <div className="max-w-7xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
        {/* Conversations List */}
        <Card className="lg:col-span-1">
          <CardHeader className="pb-3">
            <div className="flex justify-between items-center mb-2">
              <CardTitle>Messages</CardTitle>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                    <span className="sr-only">Open menu</span>
                    <PlusCircle className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem
                    onClick={() => {
                      /* Add new chat functionality */
                    }}
                  >
                    New Message
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search messages..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Tabs
              defaultValue="all"
              value={activeTab}
              onValueChange={setActiveTab}
              className="mt-2"
            >
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="unread">Unread</TabsTrigger>
              </TabsList>
            </Tabs>
          </CardHeader>
          <CardContent className="p-0">
            <ScrollArea className="h-[300px] sm:h-[400px] lg:h-[500px]">
              {filteredConversations.length > 0 ? (
                filteredConversations.map((conv) => (
                  <div
                    key={conv.id}
                    className={`flex items-start gap-3 p-3 cursor-pointer ${
                      selectedChat?.id === conv.id
                        ? "bg-muted"
                        : "hover:bg-muted/50"
                    }`}
                    onClick={() => setSelectedChat(conv)}
                  >
                    <Avatar>
                      <AvatarImage src={conv.participant_profile?.avatar} />
                      <AvatarFallback>
                        {conv.participant_profile?.name?.charAt(0) || "?"}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start">
                        <h4 className="text-sm font-medium truncate">
                          {conv.participant_profile?.name}
                        </h4>
                        <p className="text-xs text-muted-foreground">
                          {conv.last_message?.created_at &&
                            formatMessageDate(conv.last_message.created_at)}
                        </p>
                      </div>
                      <p className="text-sm text-muted-foreground truncate">
                        {conv.last_message?.content || "No messages yet"}
                      </p>
                    </div>
                    {conv.unread_count ? (
                      <Badge className="ml-1">{conv.unread_count}</Badge>
                    ) : null}
                  </div>
                ))
              ) : (
                <div className="p-4 text-center text-muted-foreground">
                  {searchQuery ? "No results found" : "No conversations yet"}
                </div>
              )}
            </ScrollArea>
          </CardContent>
        </Card>

        {/* Chat Area */}
        <Card className="lg:col-span-2">
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
                        {selectedChat.participant_profile?.name?.charAt(0) ||
                          "?"}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <CardTitle className="text-base">
                        {selectedChat.participant_profile?.name}
                      </CardTitle>
                      <p className="text-xs text-muted-foreground">
                        {selectedChat.participant_profile?.is_online
                          ? "Online"
                          : "Offline"}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="icon">
                      <Phone className="h-4 w-4" />
                      <span className="sr-only">Call</span>
                    </Button>
                    <Button variant="ghost" size="icon">
                      <Video className="h-4 w-4" />
                      <span className="sr-only">Video</span>
                    </Button>
                    <Button variant="ghost" size="icon">
                      <MoreVertical className="h-4 w-4" />
                      <span className="sr-only">More</span>
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
                          className={`flex ${
                            msg.sender_id === user.id
                              ? "justify-end"
                              : "justify-start"
                          }`}
                        >
                          <div
                            className={`flex items-start gap-2 max-w-[80%] ${
                              msg.sender_id === user.id
                                ? "flex-row-reverse"
                                : ""
                            }`}
                          >
                            {msg.sender_id !== user.id && (
                              <Avatar className="h-8 w-8">
                                <AvatarImage src={msg.sender?.avatar} />
                                <AvatarFallback>
                                  {msg.sender?.name?.charAt(0) || "?"}
                                </AvatarFallback>
                              </Avatar>
                            )}
                            <div>
                              <div
                                className={`rounded-lg p-3 ${
                                  msg.sender_id === user.id
                                    ? "bg-primary text-primary-foreground"
                                    : "bg-muted"
                                }`}
                              >
                                <p className="text-sm">{msg.content}</p>
                              </div>
                              <div className="flex items-center justify-end mt-1 gap-1">
                                <p className="text-xs text-muted-foreground">
                                  {formatMessageDate(msg.created_at)}
                                </p>
                                {msg.sender_id === user.id && (
                                  <CheckCheck
                                    className={`h-3 w-3 ${
                                      msg.read
                                        ? "text-blue-500"
                                        : "text-muted-foreground"
                                    }`}
                                  />
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center p-4 text-muted-foreground">
                        No messages yet. Say hello!
                      </div>
                    )}
                  </div>
                </ScrollArea>
              </CardContent>
              <CardFooter className="p-3">
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
              </CardFooter>
            </>
          ) : (
            <div className="h-[600px] flex flex-col items-center justify-center p-4">
              <div className="text-center space-y-2">
                <h3 className="text-lg font-medium">Select a conversation</h3>
                <p className="text-muted-foreground">
                  Choose a conversation from the list or start a new one
                </p>
              </div>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};

export default Chat;
