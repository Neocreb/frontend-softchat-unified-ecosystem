import React, { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  MessageCircle,
  Send,
  Paperclip,
  Image,
  Package,
  DollarSign,
  FileText,
  Camera,
  Smile,
  MoreHorizontal,
  Phone,
  Video,
  Info,
  Star,
  Clock,
  CheckCircle,
  AlertCircle,
  Truck,
  Shield,
  X,
  ArrowLeft,
  Download,
  ExternalLink,
} from "lucide-react";
import { useEnhancedMarketplace } from "@/contexts/EnhancedMarketplaceContext";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/components/ui/use-toast";

// Mock chat data
interface ChatMessage {
  id: string;
  senderId: string;
  senderName: string;
  senderAvatar: string;
  content: string;
  messageType:
    | "text"
    | "image"
    | "file"
    | "system"
    | "order_update"
    | "payment"
    | "contract";
  timestamp: string;
  isRead: boolean;
  attachments?: Array<{
    type: "image" | "file" | "document";
    url: string;
    name: string;
    size?: number;
  }>;
  orderInfo?: {
    orderId: string;
    orderNumber: string;
    status: string;
    amount: number;
  };
}

interface ChatThread {
  id: string;
  orderId?: string;
  orderNumber?: string;
  participants: string[];
  type: "marketplace" | "general";
  title: string;
  lastMessage?: string;
  lastMessageAt: string;
  unreadCount: number;
  isActive: boolean;
  productInfo?: {
    id: string;
    name: string;
    image: string;
    price: number;
  };
  sellerInfo?: {
    id: string;
    name: string;
    avatar: string;
    isVerified: boolean;
    responseRate: number;
    responseTime: string;
  };
}

const mockChatThreads: ChatThread[] = [
  {
    id: "thread_1",
    orderId: "order_1",
    orderNumber: "ORD-2024-001",
    participants: ["buyer1", "seller1"],
    type: "marketplace",
    title: "Order Discussion - Wireless Headphones",
    lastMessage: "Thanks for the quick shipping!",
    lastMessageAt: "2024-01-17T15:30:00Z",
    unreadCount: 0,
    isActive: true,
    productInfo: {
      id: "1",
      name: "Wireless Noise Cancelling Headphones",
      image:
        "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&auto=format&fit=crop&q=60",
      price: 249.99,
    },
    sellerInfo: {
      id: "seller1",
      name: "AudioTech",
      avatar: "https://randomuser.me/api/portraits/men/32.jpg",
      isVerified: true,
      responseRate: 98,
      responseTime: "Usually responds within 2 hours",
    },
  },
  {
    id: "thread_2",
    orderId: "order_3",
    orderNumber: "ORD-2024-003",
    participants: ["buyer3", "seller4"],
    type: "marketplace",
    title: "Order Issue - Designer Sunglasses",
    lastMessage: "We understand your concern and will resolve this quickly",
    lastMessageAt: "2024-01-18T11:20:00Z",
    unreadCount: 2,
    isActive: true,
    productInfo: {
      id: "4",
      name: "Designer Sunglasses",
      image:
        "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=500&auto=format&fit=crop&q=60",
      price: 159.99,
    },
    sellerInfo: {
      id: "seller4",
      name: "LuxeStyle",
      avatar: "https://randomuser.me/api/portraits/men/42.jpg",
      isVerified: true,
      responseRate: 95,
      responseTime: "Usually responds within 4 hours",
    },
  },
];

const mockMessages: Record<string, ChatMessage[]> = {
  thread_1: [
    {
      id: "msg_1",
      senderId: "system",
      senderName: "System",
      senderAvatar: "",
      content:
        "Order chat created. You can now communicate with the seller about your order.",
      messageType: "system",
      timestamp: "2024-01-15T11:00:00Z",
      isRead: true,
    },
    {
      id: "msg_2",
      senderId: "buyer1",
      senderName: "John Doe",
      senderAvatar: "https://randomuser.me/api/portraits/men/15.jpg",
      content:
        "Hi! I just ordered the headphones. When can I expect them to ship?",
      messageType: "text",
      timestamp: "2024-01-15T11:15:00Z",
      isRead: true,
    },
    {
      id: "msg_3",
      senderId: "seller1",
      senderName: "AudioTech",
      senderAvatar: "https://randomuser.me/api/portraits/men/32.jpg",
      content:
        "Hello John! Thank you for your order. I'll ship it out today and you should receive it within 2-3 business days. I'll send you the tracking number once it's picked up.",
      messageType: "text",
      timestamp: "2024-01-15T11:45:00Z",
      isRead: true,
    },
    {
      id: "msg_4",
      senderId: "system",
      senderName: "System",
      senderAvatar: "",
      content: "Order status updated: Shipped",
      messageType: "order_update",
      timestamp: "2024-01-16T09:15:00Z",
      isRead: true,
      orderInfo: {
        orderId: "order_1",
        orderNumber: "ORD-2024-001",
        status: "shipped",
        amount: 269.99,
      },
    },
    {
      id: "msg_5",
      senderId: "seller1",
      senderName: "AudioTech",
      senderAvatar: "https://randomuser.me/api/portraits/men/32.jpg",
      content:
        "Your order has been shipped! Tracking number: 1Z999AA1012345675",
      messageType: "text",
      timestamp: "2024-01-16T09:20:00Z",
      isRead: true,
    },
    {
      id: "msg_6",
      senderId: "buyer1",
      senderName: "John Doe",
      senderAvatar: "https://randomuser.me/api/portraits/men/15.jpg",
      content: "Thanks for the quick shipping!",
      messageType: "text",
      timestamp: "2024-01-17T15:30:00Z",
      isRead: true,
    },
  ],
  thread_2: [
    {
      id: "msg_7",
      senderId: "system",
      senderName: "System",
      senderAvatar: "",
      content:
        "Order chat created. You can now communicate with the seller about your order.",
      messageType: "system",
      timestamp: "2024-01-16T13:00:00Z",
      isRead: true,
    },
    {
      id: "msg_8",
      senderId: "buyer3",
      senderName: "Bob Johnson",
      senderAvatar: "https://randomuser.me/api/portraits/men/25.jpg",
      content:
        "I received the sunglasses but they don't look like the photos. The frame seems to be a different material.",
      messageType: "text",
      timestamp: "2024-01-18T10:30:00Z",
      isRead: true,
    },
    {
      id: "msg_9",
      senderId: "buyer3",
      senderName: "Bob Johnson",
      senderAvatar: "https://randomuser.me/api/portraits/men/25.jpg",
      content: "Here are photos of what I received",
      messageType: "image",
      timestamp: "2024-01-18T10:32:00Z",
      isRead: true,
      attachments: [
        {
          type: "image",
          url: "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=300&auto=format",
          name: "received_sunglasses.jpg",
        },
      ],
    },
    {
      id: "msg_10",
      senderId: "seller4",
      senderName: "LuxeStyle",
      senderAvatar: "https://randomuser.me/api/portraits/men/42.jpg",
      content:
        "We understand your concern and will resolve this quickly. Can you please provide more details about the differences you notice?",
      messageType: "text",
      timestamp: "2024-01-18T11:20:00Z",
      isRead: false,
    },
  ],
};

interface MarketplaceChatIntegrationProps {
  orderId?: string;
  productId?: string;
  sellerId?: string;
  isOpen: boolean;
  onClose: () => void;
}

const MarketplaceChatIntegration: React.FC<MarketplaceChatIntegrationProps> = ({
  orderId,
  productId,
  sellerId,
  isOpen,
  onClose,
}) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const [chatThreads] = useState<ChatThread[]>(mockChatThreads);
  const [activeThreadId, setActiveThreadId] = useState<string>("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [showThreadList, setShowThreadList] = useState(true);

  // Find relevant thread based on props
  useEffect(() => {
    if (orderId) {
      const thread = chatThreads.find((t) => t.orderId === orderId);
      if (thread) {
        setActiveThreadId(thread.id);
        setShowThreadList(false);
      }
    } else if (sellerId) {
      const thread = chatThreads.find((t) => t.sellerInfo?.id === sellerId);
      if (thread) {
        setActiveThreadId(thread.id);
        setShowThreadList(false);
      }
    }
  }, [orderId, sellerId, chatThreads]);

  // Load messages for active thread
  useEffect(() => {
    if (activeThreadId && mockMessages[activeThreadId]) {
      setMessages(mockMessages[activeThreadId]);
    }
  }, [activeThreadId]);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const activeThread = chatThreads.find((t) => t.id === activeThreadId);

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !activeThread || !user) return;

    const message: ChatMessage = {
      id: `msg_${Date.now()}`,
      senderId: user.id || "current_user",
      senderName: user.user_metadata?.name || "You",
      senderAvatar:
        user.user_metadata?.avatar ||
        "https://ui-avatars.com/api/?name=User&background=random",
      content: newMessage,
      messageType: "text",
      timestamp: new Date().toISOString(),
      isRead: false,
    };

    setMessages((prev) => [...prev, message]);
    setNewMessage("");

    // Simulate typing indicator
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      // Simulate seller response
      if (activeThread.sellerInfo) {
        const response: ChatMessage = {
          id: `msg_${Date.now() + 1}`,
          senderId: activeThread.sellerInfo.id,
          senderName: activeThread.sellerInfo.name,
          senderAvatar: activeThread.sellerInfo.avatar,
          content: "Thank you for your message. I'll get back to you shortly!",
          messageType: "text",
          timestamp: new Date().toISOString(),
          isRead: false,
        };
        setMessages((prev) => [...prev, response]);
      }
    }, 2000);

    toast({
      title: "Message Sent",
      description: "Your message has been sent to the seller",
    });
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);

    if (diffInHours < 24) {
      return date.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
      });
    } else {
      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    }
  };

  const getMessageIcon = (messageType: string) => {
    switch (messageType) {
      case "order_update":
        return <Package className="h-4 w-4" />;
      case "payment":
        return <DollarSign className="h-4 w-4" />;
      case "contract":
        return <FileText className="h-4 w-4" />;
      case "system":
        return <Info className="h-4 w-4" />;
      default:
        return null;
    }
  };

  const renderMessage = (message: ChatMessage) => {
    const isCurrentUser = message.senderId === user?.id;
    const isSystem =
      message.messageType === "system" ||
      message.messageType === "order_update";

    if (isSystem) {
      return (
        <div key={message.id} className="flex justify-center my-4">
          <div className="bg-gray-100 px-4 py-2 rounded-full text-sm flex items-center gap-2">
            {getMessageIcon(message.messageType)}
            <span>{message.content}</span>
            {message.orderInfo && (
              <Badge variant="outline" className="ml-2">
                {message.orderInfo.status}
              </Badge>
            )}
          </div>
        </div>
      );
    }

    return (
      <div
        key={message.id}
        className={`flex gap-3 mb-4 ${isCurrentUser ? "flex-row-reverse" : ""}`}
      >
        <Avatar className="h-8 w-8 flex-shrink-0">
          <AvatarImage src={message.senderAvatar} />
          <AvatarFallback>{message.senderName.charAt(0)}</AvatarFallback>
        </Avatar>

        <div
          className={`max-w-[70%] ${isCurrentUser ? "items-end" : "items-start"} flex flex-col`}
        >
          <div
            className={`p-3 rounded-lg ${
              isCurrentUser
                ? "bg-blue-500 text-white"
                : "bg-gray-100 text-gray-900"
            }`}
          >
            <p className="text-sm">{message.content}</p>

            {message.attachments && message.attachments.length > 0 && (
              <div className="mt-2 space-y-2">
                {message.attachments.map((attachment, index) => (
                  <div key={index} className="border rounded p-2 bg-white/10">
                    {attachment.type === "image" ? (
                      <img
                        src={attachment.url}
                        alt={attachment.name}
                        className="max-w-full h-32 object-cover rounded"
                      />
                    ) : (
                      <div className="flex items-center gap-2">
                        <FileText className="h-4 w-4" />
                        <span className="text-xs">{attachment.name}</span>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-6 w-6 p-0"
                        >
                          <Download className="h-3 w-3" />
                        </Button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          <span className="text-xs text-muted-foreground mt-1">
            {formatTimestamp(message.timestamp)}
          </span>
        </div>
      </div>
    );
  };

  const renderThreadList = () => (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold">Order Conversations</h3>
      </div>

      {chatThreads.length === 0 ? (
        <div className="text-center py-8">
          <MessageCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium mb-2">No conversations yet</h3>
          <p className="text-muted-foreground">
            Start a conversation with a seller to see it here
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {chatThreads.map((thread) => (
            <Card
              key={thread.id}
              className={`cursor-pointer transition-all hover:shadow-sm ${
                thread.id === activeThreadId ? "border-blue-500 bg-blue-50" : ""
              }`}
              onClick={() => {
                setActiveThreadId(thread.id);
                setShowThreadList(false);
              }}
            >
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={thread.sellerInfo?.avatar} />
                    <AvatarFallback>
                      {thread.sellerInfo?.name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h4 className="font-medium truncate">
                        {thread.sellerInfo?.name}
                      </h4>
                      {thread.sellerInfo?.isVerified && (
                        <CheckCircle className="h-4 w-4 text-blue-500" />
                      )}
                      {thread.unreadCount > 0 && (
                        <Badge className="bg-red-500 text-white text-xs">
                          {thread.unreadCount}
                        </Badge>
                      )}
                    </div>

                    <p className="text-sm text-muted-foreground truncate">
                      {thread.lastMessage}
                    </p>

                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="outline" className="text-xs">
                        {thread.orderNumber}
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        {formatTimestamp(thread.lastMessageAt)}
                      </span>
                    </div>
                  </div>

                  {thread.productInfo && (
                    <img
                      src={thread.productInfo.image}
                      alt={thread.productInfo.name}
                      className="w-12 h-12 rounded object-cover"
                    />
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );

  const renderChatInterface = () => {
    if (!activeThread) return null;

    return (
      <div className="flex flex-col h-full">
        {/* Chat Header */}
        <div className="border-b p-4 flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setShowThreadList(true)}
            className="md:hidden"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>

          <Avatar className="h-10 w-10">
            <AvatarImage src={activeThread.sellerInfo?.avatar} />
            <AvatarFallback>
              {activeThread.sellerInfo?.name.charAt(0)}
            </AvatarFallback>
          </Avatar>

          <div className="flex-1">
            <div className="flex items-center gap-2">
              <h3 className="font-semibold">{activeThread.sellerInfo?.name}</h3>
              {activeThread.sellerInfo?.isVerified && (
                <CheckCircle className="h-4 w-4 text-blue-500" />
              )}
            </div>
            <p className="text-sm text-muted-foreground">
              {activeThread.sellerInfo?.responseTime}
            </p>
          </div>

          {activeThread.productInfo && (
            <div className="hidden md:flex items-center gap-2 bg-gray-50 p-2 rounded">
              <img
                src={activeThread.productInfo.image}
                alt={activeThread.productInfo.name}
                className="w-8 h-8 rounded object-cover"
              />
              <div className="text-sm">
                <p className="font-medium truncate max-w-32">
                  {activeThread.productInfo.name}
                </p>
                <p className="text-muted-foreground">
                  ${activeThread.productInfo.price}
                </p>
              </div>
            </div>
          )}

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Chat Options</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <Info className="h-4 w-4 mr-2" />
                Order Details
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Star className="h-4 w-4 mr-2" />
                Rate Seller
              </DropdownMenuItem>
              <DropdownMenuItem>
                <AlertCircle className="h-4 w-4 mr-2" />
                Report Issue
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map(renderMessage)}

          {isTyping && (
            <div className="flex gap-3">
              <Avatar className="h-8 w-8">
                <AvatarImage src={activeThread.sellerInfo?.avatar} />
                <AvatarFallback>
                  {activeThread.sellerInfo?.name.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <div className="bg-gray-100 p-3 rounded-lg">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                  <div
                    className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                    style={{ animationDelay: "0.1s" }}
                  ></div>
                  <div
                    className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                    style={{ animationDelay: "0.2s" }}
                  ></div>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Message Input */}
        <div className="border-t p-4">
          <div className="flex items-end gap-2">
            <div className="flex-1">
              <Textarea
                placeholder="Type your message..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                rows={1}
                className="resize-none"
              />
            </div>

            <div className="flex gap-1">
              <Button variant="ghost" size="icon">
                <Paperclip className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon">
                <Image className="h-4 w-4" />
              </Button>
              <Button onClick={handleSendMessage} disabled={!newMessage.trim()}>
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[800px] h-[600px] p-0">
        <DialogHeader className="p-6 pb-0">
          <DialogTitle className="flex items-center gap-2">
            <MessageCircle className="h-5 w-5" />
            {showThreadList ? "Order Conversations" : "Chat"}
          </DialogTitle>
          <DialogDescription>
            {showThreadList
              ? "Communicate with sellers about your orders"
              : "Chat with seller about your order"}
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-hidden">
          {showThreadList ? (
            <div className="p-6 pt-0">{renderThreadList()}</div>
          ) : (
            renderChatInterface()
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default MarketplaceChatIntegration;
