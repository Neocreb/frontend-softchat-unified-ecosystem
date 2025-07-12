import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  MessageCircle,
  Send,
  Search,
  HelpCircle,
  Phone,
  Mail,
  Clock,
  CheckCircle,
  AlertCircle,
  User,
  Bot,
  Headphones,
  FileText,
  Star,
  ThumbsUp,
  ThumbsDown,
  ExternalLink,
  Paperclip,
  Image as ImageIcon,
  Minimize2,
  Maximize2,
  X,
} from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { cn } from "@/lib/utils";

interface ChatMessage {
  id: string;
  senderId: string;
  senderName: string;
  senderType: "user" | "agent" | "bot";
  message: string;
  timestamp: string;
  attachments?: string[];
  isRead: boolean;
}

interface SupportTicket {
  id: string;
  subject: string;
  description: string;
  status: "open" | "in_progress" | "resolved" | "closed";
  priority: "low" | "medium" | "high" | "urgent";
  category: string;
  createdAt: string;
  updatedAt: string;
  assignedAgent?: string;
  messages: ChatMessage[];
}

interface FAQ {
  id: string;
  question: string;
  answer: string;
  category: string;
  helpful: number;
  notHelpful: number;
  tags: string[];
}

interface CustomerSupportProps {
  orderId?: string;
  productId?: string;
  sellerId?: string;
  embedded?: boolean;
}

const CustomerSupport = ({
  orderId,
  productId,
  sellerId,
  embedded = false,
}: CustomerSupportProps) => {
  const [activeTab, setActiveTab] = useState("chat");
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [chatMinimized, setChatMinimized] = useState(false);
  const [supportTickets, setSupportTickets] = useState<SupportTicket[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { user } = useAuth();
  const { toast } = useToast();

  // Mock data
  const mockFAQs: FAQ[] = [
    {
      id: "faq_1",
      question: "How do I track my order?",
      answer:
        "You can track your order by clicking on 'My Orders' in your account dashboard and selecting the order you want to track. You'll see real-time updates on your package's location and estimated delivery time.",
      category: "shipping",
      helpful: 245,
      notHelpful: 12,
      tags: ["tracking", "orders", "shipping"],
    },
    {
      id: "faq_2",
      question: "What is your return policy?",
      answer:
        "We offer a 30-day return policy for most items. Items must be in original condition with tags attached. Digital products and personalized items cannot be returned. Shipping costs for returns are covered by us if the item is defective.",
      category: "returns",
      helpful: 189,
      notHelpful: 8,
      tags: ["returns", "refunds", "policy"],
    },
    {
      id: "faq_3",
      question: "How do I contact a seller?",
      answer:
        "You can contact a seller by clicking the 'Message Seller' button on any product page. You can also find seller contact information on their profile page. All messages are handled through our secure messaging system.",
      category: "sellers",
      helpful: 156,
      notHelpful: 5,
      tags: ["sellers", "contact", "messaging"],
    },
    {
      id: "faq_4",
      question: "Is my payment information secure?",
      answer:
        "Yes, we use industry-standard encryption to protect your payment information. We never store your full credit card details on our servers. All transactions are processed through secure payment gateways.",
      category: "payments",
      helpful: 298,
      notHelpful: 3,
      tags: ["security", "payments", "privacy"],
    },
    {
      id: "faq_5",
      question: "How do I become a verified seller?",
      answer:
        "To become a verified seller, go to your seller dashboard and complete the verification process. This includes providing business documentation, bank account verification, and identity confirmation. The process typically takes 2-3 business days.",
      category: "sellers",
      helpful: 134,
      notHelpful: 9,
      tags: ["verification", "sellers", "business"],
    },
  ];

  const mockChatHistory: ChatMessage[] = [
    {
      id: "msg_1",
      senderId: "bot_1",
      senderName: "Support Bot",
      senderType: "bot",
      message:
        "Hello! I'm here to help you with any questions you might have. How can I assist you today?",
      timestamp: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
      isRead: true,
    },
    {
      id: "msg_2",
      senderId: user?.id || "user_1",
      senderName: user?.username || "You",
      senderType: "user",
      message: "Hi, I have a question about my recent order",
      timestamp: new Date(Date.now() - 4 * 60 * 1000).toISOString(),
      isRead: true,
    },
    {
      id: "msg_3",
      senderId: "agent_1",
      senderName: "Sarah (Support Agent)",
      senderType: "agent",
      message:
        "I'd be happy to help you with your order! Could you please provide your order number?",
      timestamp: new Date(Date.now() - 3 * 60 * 1000).toISOString(),
      isRead: true,
    },
  ];

  useEffect(() => {
    setChatMessages(mockChatHistory);
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [chatMessages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;

    const message: ChatMessage = {
      id: `msg_${Date.now()}`,
      senderId: user?.id || "user_1",
      senderName: user?.username || "You",
      senderType: "user",
      message: newMessage,
      timestamp: new Date().toISOString(),
      isRead: false,
    };

    setChatMessages((prev) => [...prev, message]);
    setNewMessage("");

    // Simulate agent typing
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);

      const agentResponse: ChatMessage = {
        id: `msg_${Date.now() + 1}`,
        senderId: "agent_1",
        senderName: "Sarah (Support Agent)",
        senderType: "agent",
        message: getAutomaticResponse(newMessage),
        timestamp: new Date().toISOString(),
        isRead: false,
      };

      setChatMessages((prev) => [...prev, agentResponse]);
    }, 2000);
  };

  const getAutomaticResponse = (userMessage: string) => {
    const message = userMessage.toLowerCase();

    if (message.includes("order") || message.includes("track")) {
      return "I can help you track your order! Please provide your order number and I'll look up the current status for you.";
    } else if (message.includes("return") || message.includes("refund")) {
      return "I understand you'd like to return an item. Our return policy allows returns within 30 days. Would you like me to start the return process for you?";
    } else if (message.includes("payment") || message.includes("charge")) {
      return "I can help with payment-related questions. Could you provide more details about the specific payment issue you're experiencing?";
    } else if (message.includes("seller") || message.includes("vendor")) {
      return "For seller-related inquiries, I can help you contact the seller directly or address any concerns you might have. What specific issue are you experiencing?";
    } else {
      return "Thank you for your message. I'm looking into this for you. Is there any additional information you can provide to help me assist you better?";
    }
  };

  const filteredFAQs = mockFAQs.filter((faq) => {
    const matchesSearch =
      searchQuery === "" ||
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.tags.some((tag) =>
        tag.toLowerCase().includes(searchQuery.toLowerCase()),
      );

    const matchesCategory =
      selectedCategory === "all" || faq.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  const categories = [
    { value: "all", label: "All Categories" },
    { value: "shipping", label: "Shipping & Delivery" },
    { value: "returns", label: "Returns & Refunds" },
    { value: "payments", label: "Payments & Billing" },
    { value: "sellers", label: "Sellers & Marketplace" },
    { value: "account", label: "Account & Profile" },
  ];

  const contactMethods = [
    {
      icon: <MessageCircle className="w-6 h-6" />,
      title: "Live Chat",
      description: "Chat with our support team in real-time",
      availability: "Available 24/7",
      action: () => setActiveTab("chat"),
    },
    {
      icon: <Mail className="w-6 h-6" />,
      title: "Email Support",
      description: "Send us an email and we'll respond within 24 hours",
      availability: "Response within 24 hours",
      action: () => window.open("mailto:support@example.com"),
    },
    {
      icon: <Phone className="w-6 h-6" />,
      title: "Phone Support",
      description: "Call us for urgent issues",
      availability: "Mon-Fri 9AM-6PM EST",
      action: () => window.open("tel:+1-800-555-0123"),
    },
  ];

  const renderChatMessage = (message: ChatMessage) => (
    <div
      key={message.id}
      className={cn(
        "flex gap-3 mb-4",
        message.senderType === "user" ? "justify-end" : "justify-start",
      )}
    >
      {message.senderType !== "user" && (
        <Avatar className="w-8 h-8">
          <AvatarFallback>
            {message.senderType === "bot" ? (
              <Bot className="w-4 h-4" />
            ) : (
              <User className="w-4 h-4" />
            )}
          </AvatarFallback>
        </Avatar>
      )}
      <div
        className={cn(
          "max-w-xs lg:max-w-md px-4 py-2 rounded-lg",
          message.senderType === "user"
            ? "bg-primary text-primary-foreground"
            : message.senderType === "bot"
              ? "bg-blue-100 text-blue-900"
              : "bg-muted",
        )}
      >
        {message.senderType !== "user" && (
          <p className="text-xs font-medium mb-1">{message.senderName}</p>
        )}
        <p className="text-sm">{message.message}</p>
        <p className="text-xs opacity-70 mt-1">
          {new Date(message.timestamp).toLocaleTimeString()}
        </p>
      </div>
      {message.senderType === "user" && (
        <Avatar className="w-8 h-8">
          <AvatarFallback>
            <User className="w-4 h-4" />
          </AvatarFallback>
        </Avatar>
      )}
    </div>
  );

  if (embedded) {
    return (
      <div
        className={cn(
          "fixed bottom-4 right-4 z-50",
          chatMinimized ? "w-80" : "w-96",
        )}
      >
        <Card className="shadow-lg">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Headphones className="w-5 h-5 text-primary" />
                <CardTitle className="text-lg">Customer Support</CardTitle>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setChatMinimized(!chatMinimized)}
                >
                  {chatMinimized ? (
                    <Maximize2 className="w-4 h-4" />
                  ) : (
                    <Minimize2 className="w-4 h-4" />
                  )}
                </Button>
              </div>
            </div>
          </CardHeader>

          {!chatMinimized && (
            <CardContent className="space-y-4">
              {/* Chat Messages */}
              <div className="h-80 overflow-y-auto space-y-2">
                {chatMessages.map(renderChatMessage)}
                {isTyping && (
                  <div className="flex gap-3">
                    <Avatar className="w-8 h-8">
                      <AvatarFallback>
                        <User className="w-4 h-4" />
                      </AvatarFallback>
                    </Avatar>
                    <div className="bg-muted px-4 py-2 rounded-lg">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" />
                        <div
                          className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"
                          style={{ animationDelay: "0.1s" }}
                        />
                        <div
                          className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"
                          style={{ animationDelay: "0.2s" }}
                        />
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Message Input */}
              <div className="flex gap-2">
                <Input
                  placeholder="Type your message..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                />
                <Button
                  onClick={handleSendMessage}
                  disabled={!newMessage.trim()}
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          )}
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold">How can we help you?</h1>
        <p className="text-muted-foreground">
          Get instant answers to your questions or chat with our support team
        </p>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {contactMethods.map((method, index) => (
          <Card
            key={index}
            className="cursor-pointer hover:shadow-md transition-shadow"
          >
            <CardContent className="p-6 text-center" onClick={method.action}>
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                {method.icon}
              </div>
              <h3 className="font-semibold mb-2">{method.title}</h3>
              <p className="text-sm text-muted-foreground mb-3">
                {method.description}
              </p>
              <Badge variant="outline" className="text-xs">
                {method.availability}
              </Badge>
            </CardContent>
          </Card>
        ))}
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="faq">Help Center</TabsTrigger>
          <TabsTrigger value="chat">Live Chat</TabsTrigger>
          <TabsTrigger value="tickets">My Tickets</TabsTrigger>
        </TabsList>

        <TabsContent value="faq" className="space-y-6">
          {/* Search and Filters */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search help articles..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="w-full sm:w-48">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full h-10 px-3 border border-input bg-background rounded-md text-sm"
              >
                {categories.map((category) => (
                  <option key={category.value} value={category.value}>
                    {category.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* FAQ Results */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">
                {searchQuery
                  ? `Search Results (${filteredFAQs.length})`
                  : "Frequently Asked Questions"}
              </h3>
            </div>

            <Accordion type="single" collapsible className="w-full">
              {filteredFAQs.map((faq) => (
                <AccordionItem key={faq.id} value={faq.id}>
                  <AccordionTrigger className="text-left">
                    <div className="flex items-start gap-3">
                      <HelpCircle className="w-5 h-5 text-primary mt-1 shrink-0" />
                      <span>{faq.question}</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-4 pl-8">
                      <p className="text-muted-foreground">{faq.answer}</p>

                      {/* Tags */}
                      <div className="flex flex-wrap gap-2">
                        {faq.tags.map((tag) => (
                          <Badge
                            key={tag}
                            variant="outline"
                            className="text-xs"
                          >
                            {tag}
                          </Badge>
                        ))}
                      </div>

                      {/* Helpful buttons */}
                      <div className="flex items-center gap-4 pt-2 border-t">
                        <span className="text-sm text-muted-foreground">
                          Was this helpful?
                        </span>
                        <div className="flex items-center gap-2">
                          <Button variant="outline" size="sm">
                            <ThumbsUp className="w-4 h-4 mr-1" />
                            Yes ({faq.helpful})
                          </Button>
                          <Button variant="outline" size="sm">
                            <ThumbsDown className="w-4 h-4 mr-1" />
                            No ({faq.notHelpful})
                          </Button>
                        </div>
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>

            {filteredFAQs.length === 0 && (
              <div className="text-center py-12">
                <HelpCircle className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-lg font-semibold mb-2">
                  No articles found
                </h3>
                <p className="text-muted-foreground mb-4">
                  Try adjusting your search terms or browse our categories
                </p>
                <Button onClick={() => setActiveTab("chat")}>
                  <MessageCircle className="w-4 h-4 mr-2" />
                  Chat with Support
                </Button>
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="chat" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <CardTitle>Live Chat Support</CardTitle>
                    <p className="text-sm text-muted-foreground">
                      Connected - Average response time: 2 minutes
                    </p>
                  </div>
                </div>
                <Badge className="bg-green-100 text-green-800">Online</Badge>
              </div>
            </CardHeader>
            <CardContent>
              {/* Chat Container */}
              <div className="border rounded-lg p-4">
                {/* Messages */}
                <div className="h-96 overflow-y-auto mb-4">
                  {chatMessages.map(renderChatMessage)}
                  {isTyping && (
                    <div className="flex gap-3">
                      <Avatar className="w-8 h-8">
                        <AvatarFallback>
                          <User className="w-4 h-4" />
                        </AvatarFallback>
                      </Avatar>
                      <div className="bg-muted px-4 py-2 rounded-lg">
                        <div className="flex space-x-1">
                          <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" />
                          <div
                            className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"
                            style={{ animationDelay: "0.1s" }}
                          />
                          <div
                            className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"
                            style={{ animationDelay: "0.2s" }}
                          />
                        </div>
                      </div>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>

                {/* Message Input */}
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <Paperclip className="w-4 h-4" />
                  </Button>
                  <Input
                    placeholder="Type your message..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                    className="flex-1"
                  />
                  <Button
                    onClick={handleSendMessage}
                    disabled={!newMessage.trim()}
                  >
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="tickets" className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Support Tickets</h3>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              New Ticket
            </Button>
          </div>

          {supportTickets.length === 0 ? (
            <Card>
              <CardContent className="p-12 text-center">
                <FileText className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-lg font-semibold mb-2">
                  No support tickets
                </h3>
                <p className="text-muted-foreground mb-4">
                  You don't have any support tickets yet. If you need help, feel
                  free to create one.
                </p>
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Create Your First Ticket
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {supportTickets.map((ticket) => (
                <Card key={ticket.id}>
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <h4 className="font-semibold">{ticket.subject}</h4>
                          <Badge
                            className={cn(
                              ticket.status === "open"
                                ? "bg-blue-100 text-blue-800"
                                : ticket.status === "in_progress"
                                  ? "bg-yellow-100 text-yellow-800"
                                  : ticket.status === "resolved"
                                    ? "bg-green-100 text-green-800"
                                    : "bg-gray-100 text-gray-800",
                            )}
                          >
                            {ticket.status.replace("_", " ")}
                          </Badge>
                          <Badge
                            variant="outline"
                            className={cn(
                              ticket.priority === "urgent"
                                ? "border-red-200 text-red-800"
                                : ticket.priority === "high"
                                  ? "border-orange-200 text-orange-800"
                                  : ticket.priority === "medium"
                                    ? "border-yellow-200 text-yellow-800"
                                    : "border-green-200 text-green-800",
                            )}
                          >
                            {ticket.priority} priority
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {ticket.description}
                        </p>
                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                          <span>Ticket #{ticket.id}</span>
                          <span>
                            Created{" "}
                            {new Date(ticket.createdAt).toLocaleDateString()}
                          </span>
                          <span>Category: {ticket.category}</span>
                          {ticket.assignedAgent && (
                            <span>Assigned to: {ticket.assignedAgent}</span>
                          )}
                        </div>
                      </div>
                      <Button variant="outline" size="sm">
                        View Details
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CustomerSupport;
