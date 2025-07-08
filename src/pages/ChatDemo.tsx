import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  MessageCircle,
  Briefcase,
  ShoppingCart,
  TrendingUp,
  Users,
  ArrowRight,
  Zap,
} from "lucide-react";
import { useChatIntegration } from "@/chat/utils/chatIntegration";
import { useAuth } from "@/contexts/AuthContext";

export const ChatDemo: React.FC = () => {
  const { user } = useAuth();
  const {
    openFreelanceChat,
    openMarketplaceChat,
    openP2PChat,
    openSocialChat,
    goToInbox,
  } = useChatIntegration();

  const handleStartFreelanceChat = () => {
    openFreelanceChat(
      "job_demo_123",
      "E-commerce Website Development",
      "client_demo",
      user?.id || "user_1",
      5000,
    );
  };

  const handleStartMarketplaceChat = () => {
    openMarketplaceChat(
      "product_demo_456",
      "MacBook Pro 16-inch",
      2500,
      "seller_demo",
      user?.id || "user_1",
      "https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=400",
    );
  };

  const handleStartP2PChat = () => {
    openP2PChat(
      "trade_demo_789",
      0.5,
      "BTC",
      user?.id || "user_1",
      "trader_demo",
    );
  };

  const handleStartSocialChat = () => {
    openSocialChat("friend_demo", user?.id || "user_1", "friend");
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="space-y-6">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-4">
            🚀 Unified Chat System Demo
          </h1>
          <p className="text-lg text-muted-foreground mb-6">
            Experience SoftChat's intelligent chat system that adapts to
            different contexts
          </p>
          <Button onClick={goToInbox} size="lg" className="mb-8">
            <MessageCircle className="w-5 h-5 mr-2" />
            Go to Messages Inbox
          </Button>
        </div>

        {/* Chat Types Demo */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Freelance Chat */}
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Briefcase className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    Freelance Chat
                    <Badge className="bg-blue-100 text-blue-800">💼 Work</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground font-normal">
                    Client ↔ Freelancer communication
                  </p>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-medium mb-2">Demo Project</h4>
                  <p className="text-sm text-muted-foreground mb-2">
                    E-commerce Website Development
                  </p>
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <span>Budget: $5,000</span>
                    <span>Status: Negotiation</span>
                  </div>
                </div>
                <Button
                  onClick={handleStartFreelanceChat}
                  className="w-full"
                  variant="outline"
                >
                  Start Freelance Chat
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Marketplace Chat */}
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <ShoppingCart className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    Marketplace Chat
                    <Badge className="bg-green-100 text-green-800">
                      🛒 Market
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground font-normal">
                    Buyer ↔ Seller communication
                  </p>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-medium mb-2">Demo Product</h4>
                  <p className="text-sm text-muted-foreground mb-2">
                    MacBook Pro 16-inch
                  </p>
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <span>Price: $2,500</span>
                    <span>Condition: Like New</span>
                  </div>
                </div>
                <Button
                  onClick={handleStartMarketplaceChat}
                  className="w-full"
                  variant="outline"
                >
                  Start Marketplace Chat
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* P2P Crypto Chat */}
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <div className="p-2 bg-yellow-100 rounded-lg">
                  <TrendingUp className="w-6 h-6 text-yellow-600" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    P2P Crypto Chat
                    <Badge className="bg-yellow-100 text-yellow-800">
                      💱 Crypto
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground font-normal">
                    Trader ↔ Trader communication
                  </p>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-medium mb-2">Demo Trade</h4>
                  <p className="text-sm text-muted-foreground mb-2">
                    Bitcoin Trade
                  </p>
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <span>Amount: 0.5 BTC</span>
                    <span>Status: Pending</span>
                  </div>
                </div>
                <Button
                  onClick={handleStartP2PChat}
                  className="w-full"
                  variant="outline"
                >
                  Start P2P Chat
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Social Chat */}
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <Users className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    Social Chat
                    <Badge className="bg-purple-100 text-purple-800">
                      💬 Social
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground font-normal">
                    Friend ↔ Friend communication
                  </p>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-medium mb-2">Demo Friend</h4>
                  <p className="text-sm text-muted-foreground mb-2">
                    Personal conversation
                  </p>
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <span>Type: Friend</span>
                    <span>Status: Online</span>
                  </div>
                </div>
                <Button
                  onClick={handleStartSocialChat}
                  className="w-full"
                  variant="outline"
                >
                  Start Social Chat
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Features Overview */}
        <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="w-6 h-6 text-blue-600" />
              Chat System Features
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <MessageCircle className="w-6 h-6 text-blue-600" />
                </div>
                <h4 className="font-medium mb-2">Context-Aware</h4>
                <p className="text-sm text-muted-foreground">
                  Chats adapt to different contexts: work, marketplace, crypto,
                  and social
                </p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Users className="w-6 h-6 text-green-600" />
                </div>
                <h4 className="font-medium mb-2">Unified Inbox</h4>
                <p className="text-sm text-muted-foreground">
                  All conversations in one place with smart filtering and
                  organization
                </p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Zap className="w-6 h-6 text-purple-600" />
                </div>
                <h4 className="font-medium mb-2">Real-time</h4>
                <p className="text-sm text-muted-foreground">
                  Instant messaging with read receipts, typing indicators, and
                  file sharing
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Links */}
        <div className="text-center">
          <h3 className="text-lg font-semibold mb-4">Quick Navigation</h3>
          <div className="flex flex-wrap justify-center gap-4">
            <Button variant="outline" onClick={goToInbox}>
              📥 View All Messages
            </Button>
            <Button
              variant="outline"
              onClick={() => (window.location.href = "/freelance")}
            >
              💼 Browse Freelance Jobs
            </Button>
            <Button
              variant="outline"
              onClick={() => (window.location.href = "/marketplace")}
            >
              🛒 Explore Marketplace
            </Button>
            <Button
              variant="outline"
              onClick={() => (window.location.href = "/crypto")}
            >
              💱 Crypto Trading
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatDemo;
