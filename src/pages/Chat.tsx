
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { ChatConversation, ChatMessage } from "@/types/user";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, Send, Plus, Check } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { useNotification } from "@/hooks/use-notification";
import { Badge } from "@/components/ui/badge";
import FooterNav from "@/components/layout/FooterNav";

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
const mockMessages: ChatMessage[] = [
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
];

const Chat = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("all");
  const [conversations, setConversations] = useState<ChatConversation[]>(mockConversations);
  const [selectedChat, setSelectedChat] = useState<ChatConversation | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [messageInput, setMessageInput] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const notify = useNotification();

  useEffect(() => {
    // In a real app, we would fetch conversations from the API
    setConversations(mockConversations);
  }, []);

  useEffect(() => {
    if (selectedChat) {
      // In a real app, we would fetch messages for the selected chat
      setMessages(mockMessages);
      
      // Mark messages as read
      const updatedMessages = mockMessages.map(msg => ({
        ...msg,
        is_read: true
      }));
      
      setMessages(updatedMessages);
    }
  }, [selectedChat]);

  const handleSendMessage = () => {
    if (!messageInput.trim() || !selectedChat) return;
    
    // Create a new message
    const newMessage: ChatMessage = {
      id: `new-${Date.now()}`,
      sender_id: "current-user",
      recipient_id: selectedChat.participant.id,
      content: messageInput,
      is_read: false,
      created_at: new Date().toISOString()
    };
    
    // Add the message to the chat
    setMessages([...messages, newMessage]);
    
    // Update last message in conversations list
    const updatedConversations = conversations.map(conv => 
      conv.id === selectedChat.id 
        ? {
            ...conv,
            last_message: messageInput,
            last_message_time: "Just now"
          }
        : conv
    );
    
    setConversations(updatedConversations);
    
    // Clear the input
    setMessageInput("");
    
    // In a real app, we would send the message to the API
    notify.success("Message sent");
  };

  const filteredConversations = conversations.filter(conv => 
    conv.participant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    conv.participant.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (conv.last_message && conv.last_message.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const handleSelectChat = (conversation: ChatConversation) => {
    setSelectedChat(conversation);
    
    // Update the unread count
    const updatedConversations = conversations.map(conv => 
      conv.id === conversation.id 
        ? { ...conv, unread_count: 0 }
        : conv
    );
    
    setConversations(updatedConversations);
  };

  const handleBackToList = () => {
    setSelectedChat(null);
  };

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
                            <AvatarImage src={conversation.participant.avatar} alt={conversation.participant.name} />
                            <AvatarFallback>{conversation.participant.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                          </Avatar>
                          {conversation.participant.is_verified && (
                            <div className="absolute bottom-0 right-0 bg-blue-500 text-white rounded-full p-0.5 border-2 border-white">
                              <Check className="h-2 w-2" />
                            </div>
                          )}
                        </div>
                        
                        <div className="flex-1">
                          <div className="flex justify-between items-center">
                            <span className="font-medium">{conversation.participant.name}</span>
                            <span className="text-xs text-muted-foreground">{conversation.last_message_time}</span>
                          </div>
                          
                          <div className="flex justify-between items-center">
                            <p className="text-sm text-muted-foreground truncate max-w-[180px]">
                              {conversation.last_message}
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
                      {/* Same conversation content as above */}
                      <div className="flex items-center gap-3">
                        <div className="relative">
                          <Avatar className="h-12 w-12">
                            <AvatarImage src={conversation.participant.avatar} alt={conversation.participant.name} />
                            <AvatarFallback>{conversation.participant.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                          </Avatar>
                          {conversation.participant.is_verified && (
                            <div className="absolute bottom-0 right-0 bg-blue-500 text-white rounded-full p-0.5 border-2 border-white">
                              <Check className="h-2 w-2" />
                            </div>
                          )}
                        </div>
                        
                        <div className="flex-1">
                          <div className="flex justify-between items-center">
                            <span className="font-medium">{conversation.participant.name}</span>
                            <span className="text-xs text-muted-foreground">{conversation.last_message_time}</span>
                          </div>
                          
                          <div className="flex justify-between items-center">
                            <p className="text-sm text-muted-foreground truncate max-w-[180px]">
                              {conversation.last_message}
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
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="m15 18-6-6 6-6" />
              </svg>
            </Button>
            
            <div className="flex items-center gap-3">
              <Avatar className="h-10 w-10">
                <AvatarImage src={selectedChat.participant.avatar} alt={selectedChat.participant.name} />
                <AvatarFallback>{selectedChat.participant.name.substring(0, 2).toUpperCase()}</AvatarFallback>
              </Avatar>
              
              <div>
                <div className="flex items-center">
                  <span className="font-medium">{selectedChat.participant.name}</span>
                  {selectedChat.participant.is_verified && (
                    <Badge variant="outline" className="ml-1 bg-blue-500 p-0">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-white" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </Badge>
                  )}
                </div>
                <p className="text-xs text-muted-foreground">
                  {selectedChat.participant.last_seen ? `Last seen ${selectedChat.participant.last_seen}` : "Online"}
                </p>
              </div>
            </div>
          </div>
          
          {/* Chat messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.sender_id === "current-user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[70%] px-4 py-2 rounded-2xl ${
                    message.sender_id === "current-user"
                      ? "bg-blue-500 text-white rounded-br-none"
                      : "bg-gray-100 rounded-bl-none"
                  }`}
                >
                  <p>{message.content}</p>
                  <div
                    className={`text-xs mt-1 ${
                      message.sender_id === "current-user" ? "text-blue-100" : "text-gray-500"
                    }`}
                  >
                    {new Date(message.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    {message.sender_id === "current-user" && (
                      <span className="ml-1">
                        {message.is_read ? "✓✓" : "✓"}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {/* Chat input */}
          <div className="p-3 border-t flex items-center gap-2">
            <Input
              placeholder="Type a message..."
              value={messageInput}
              onChange={(e) => setMessageInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
              className="flex-1"
            />
            <Button onClick={handleSendMessage} size="icon" className="rounded-full">
              <Send className="h-5 w-5" />
            </Button>
          </div>
        </div>
      )}
      
      <FooterNav />
    </div>
  );
};

export default Chat;
