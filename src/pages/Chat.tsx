
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { ChatProvider, useChat } from "@/contexts/ChatContext";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, Send, Plus, Check, ChevronLeft } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const ChatInterface = () => {
  const { 
    conversations, 
    messages, 
    selectedChat, 
    messageInput, 
    setMessageInput, 
    setSelectedChat, 
    sendMessage, 
    markAsRead,
    searchConversations
  } = useChat();
  const [activeTab, setActiveTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  
  // Scroll to bottom when messages change
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [selectedChat, messages]);
  
  // Mark messages as read when selecting a chat
  useEffect(() => {
    if (selectedChat) {
      markAsRead(selectedChat.id);
    }
  }, [selectedChat]);
  
  const handleSendMessage = () => {
    if (!messageInput.trim() || !selectedChat) return;
    sendMessage(messageInput);
  };
  
  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };
  
  const handleSelectChat = (conversation: any) => {
    setSelectedChat(conversation);
  };
  
  const handleBackToList = () => {
    setSelectedChat(null);
  };
  
  const filteredConversations = searchQuery 
    ? searchConversations(searchQuery)
    : conversations;
  
  const getFilteredConversations = () => {
    if (activeTab === "all") return filteredConversations;
    if (activeTab === "unread") return filteredConversations.filter(conv => conv.unread_count > 0);
    return filteredConversations;
  };
  
  return (
    <div className="container pb-16 md:pb-0 pt-4 min-h-screen">
      {!selectedChat ? (
        <div className="space-y-4">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold">Chats</h1>
            <Button variant="ghost" size="icon" className="rounded-full">
              <Plus className="h-5 w-5" />
            </Button>
          </div>
          
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input 
              placeholder="Search" 
              className="pl-9 bg-gray-100 border-none rounded-full"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="all">All Chats</TabsTrigger>
              <TabsTrigger value="unread">Unread</TabsTrigger>
            </TabsList>
            
            <TabsContent value="all" className="mt-4">
              <div className="space-y-2">
                {getFilteredConversations().map((conversation) => (
                  <Card 
                    key={conversation.id} 
                    className={`cursor-pointer hover:bg-gray-50 transition-colors ${conversation.unread_count > 0 ? 'bg-blue-50' : ''}`}
                    onClick={() => handleSelectChat(conversation)}
                  >
                    <CardContent className="p-3">
                      <div className="flex items-center gap-3">
                        <div className="relative">
                          <Avatar className="h-12 w-12">
                            <AvatarImage src={conversation.participant_profile?.avatar} alt={conversation.participant_profile?.name} />
                            <AvatarFallback>{conversation.participant_profile?.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                          </Avatar>
                          {conversation.participant_profile?.is_online && (
                            <div className="absolute bottom-0 right-0 bg-green-500 text-white rounded-full p-1 border-2 border-white">
                              <div className="h-2 w-2" />
                            </div>
                          )}
                        </div>
                        
                        <div className="flex-1">
                          <div className="flex justify-between items-center">
                            <span className="font-medium">{conversation.participant_profile?.name}</span>
                            <span className="text-xs text-muted-foreground">
                              {conversation.last_message ? new Date(conversation.last_message.created_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : ''}
                            </span>
                          </div>
                          
                          <div className="flex justify-between items-center">
                            <p className="text-sm text-muted-foreground truncate max-w-[180px]">
                              {conversation.last_message?.content || 'No messages yet'}
                            </p>
                            {conversation.unread_count > 0 && (
                              <Badge variant="default" className="bg-blue-500 text-white">
                                {conversation.unread_count}
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
                
                {getFilteredConversations().length === 0 && (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground">No conversations found</p>
                  </div>
                )}
              </div>
            </TabsContent>
            
            <TabsContent value="unread" className="mt-4">
              <div className="space-y-2">
                {getFilteredConversations().map((conversation) => (
                  <Card 
                    key={conversation.id} 
                    className={`cursor-pointer hover:bg-gray-50 transition-colors ${conversation.unread_count > 0 ? 'bg-blue-50' : ''}`}
                    onClick={() => handleSelectChat(conversation)}
                  >
                    <CardContent className="p-3">
                      <div className="flex items-center gap-3">
                        <div className="relative">
                          <Avatar className="h-12 w-12">
                            <AvatarImage src={conversation.participant_profile?.avatar} alt={conversation.participant_profile?.name} />
                            <AvatarFallback>{conversation.participant_profile?.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                          </Avatar>
                          {conversation.participant_profile?.is_online && (
                            <div className="absolute bottom-0 right-0 bg-green-500 text-white rounded-full p-1 border-2 border-white">
                              <div className="h-2 w-2" />
                            </div>
                          )}
                        </div>
                        
                        <div className="flex-1">
                          <div className="flex justify-between items-center">
                            <span className="font-medium">{conversation.participant_profile?.name}</span>
                            <span className="text-xs text-muted-foreground">
                              {conversation.last_message ? new Date(conversation.last_message.created_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : ''}
                            </span>
                          </div>
                          
                          <div className="flex justify-between items-center">
                            <p className="text-sm text-muted-foreground truncate max-w-[180px]">
                              {conversation.last_message?.content || 'No messages yet'}
                            </p>
                            {conversation.unread_count > 0 && (
                              <Badge variant="default" className="bg-blue-500 text-white">
                                {conversation.unread_count}
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
                
                {getFilteredConversations().length === 0 && (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground">No unread conversations</p>
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      ) : (
        <div className="flex flex-col h-[calc(100vh-8rem)]">
          {/* Chat header */}
          <div className="flex items-center p-3 border-b">
            <Button variant="ghost" size="icon" onClick={handleBackToList} className="mr-2">
              <ChevronLeft className="h-5 w-5" />
            </Button>
            
            <div className="flex items-center gap-3">
              <Avatar className="h-10 w-10">
                <AvatarImage src={selectedChat.participant_profile?.avatar} alt={selectedChat.participant_profile?.name} />
                <AvatarFallback>{selectedChat.participant_profile?.name.substring(0, 2).toUpperCase()}</AvatarFallback>
              </Avatar>
              
              <div>
                <div className="flex items-center">
                  <span className="font-medium">{selectedChat.participant_profile?.name}</span>
                  {selectedChat.participant_profile?.is_online && (
                    <Badge variant="outline" className="ml-1 bg-green-500 p-0">
                      <div className="h-2 w-2" />
                    </Badge>
                  )}
                </div>
                <p className="text-xs text-muted-foreground">
                  {selectedChat.participant_profile?.is_online ? "Online" : "Offline"}
                </p>
              </div>
            </div>
          </div>
          
          {/* Chat messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages[selectedChat.id]?.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.sender_id === user?.id ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[70%] px-4 py-2 rounded-2xl ${
                    message.sender_id === user?.id
                      ? "bg-blue-500 text-white rounded-br-none"
                      : "bg-gray-100 rounded-bl-none"
                  }`}
                >
                  <p>{message.content}</p>
                  <div
                    className={`text-xs mt-1 ${
                      message.sender_id === user?.id ? "text-blue-100" : "text-gray-500"
                    }`}
                  >
                    {new Date(message.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    {message.sender_id === user?.id && (
                      <span className="ml-1">
                        {message.read ? "✓✓" : "✓"}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
          
          {/* Chat input */}
          <div className="p-3 border-t flex items-center gap-2">
            <Input
              placeholder="Type a message..."
              value={messageInput}
              onChange={(e) => setMessageInput(e.target.value)}
              onKeyDown={handleKeyPress}
              className="flex-1"
            />
            <Button onClick={handleSendMessage} size="icon" className="rounded-full">
              <Send className="h-5 w-5" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

const Chat = () => {
  return (
    <ChatProvider>
      <ChatInterface />
    </ChatProvider>
  );
};

export default Chat;
