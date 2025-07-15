import React, { useState, useEffect } from "react";
import {
  Brain,
  Lightbulb,
  TrendingUp,
  Clock,
  Target,
  Zap,
  DollarSign,
  Users,
  Eye,
  MessageCircle,
  X,
  CheckCircle,
  AlertCircle,
  Calendar,
  Sparkles,
  Bot,
  Send,
  ThumbsUp,
  ThumbsDown,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { formatDistanceToNow } from "date-fns";

interface AITip {
  id: string;
  type:
    | "opportunity"
    | "optimization"
    | "engagement"
    | "monetization"
    | "timing"
    | "content";
  title: string;
  message: string;
  actionText?: string;
  confidence: number;
  priority: "low" | "medium" | "high" | "urgent";
  category: string;
  metadata?: Record<string, any>;
  createdAt: string;
  isRead: boolean;
  isActionable: boolean;
  estimatedImpact?: string;
}

interface AIChat {
  id: string;
  message: string;
  sender: "user" | "ai";
  timestamp: string;
  suggestions?: string[];
}

interface PerformanceMetrics {
  recentEarnings: number;
  recentViews: number;
  engagementRate: number;
  followerGrowth: number;
  contentPerformance: number;
}

const CreatorAIAssistant: React.FC = () => {
  const [aiTips, setAiTips] = useState<AITip[]>([]);
  const [chatHistory, setChatHistory] = useState<AIChat[]>([]);
  const [showChat, setShowChat] = useState(false);
  const [chatInput, setChatInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [dismissedTips, setDismissedTips] = useState<string[]>([]);
  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    recentEarnings: 156.75,
    recentViews: 12450,
    engagementRate: 8.7,
    followerGrowth: 4.2,
    contentPerformance: 85,
  });

  useEffect(() => {
    loadAITips();
    initializeChat();
  }, []);

  const loadAITips = () => {
    // Simulate AI-generated tips based on performance data
    const tips: AITip[] = [
      {
        id: "1",
        type: "opportunity",
        title: "Boost Opportunity Detected",
        message:
          "Your recent art tutorial earned 10 SP today. Want to boost it for more reach? Similar content gets 3x engagement when boosted.",
        actionText: "Boost Content",
        confidence: 87,
        priority: "high",
        category: "monetization",
        metadata: { contentId: "post_123", expectedReach: "15K-25K" },
        createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        isRead: false,
        isActionable: true,
        estimatedImpact: "+200% reach",
      },
      {
        id: "2",
        type: "engagement",
        title: "Thank Your Top Supporter",
        message:
          "@Ada just tipped you ₦500 — sending a personal thank-you message could strengthen your relationship and encourage future tips.",
        actionText: "Send Thank You",
        confidence: 92,
        priority: "medium",
        category: "relationship",
        metadata: { supporterId: "user_ada", tipAmount: 500 },
        createdAt: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
        isRead: false,
        isActionable: true,
        estimatedImpact: "+15% tip retention",
      },
      {
        id: "3",
        type: "timing",
        title: "Optimal Posting Time Alert",
        message:
          "Views dropping on recent posts. Try posting again around 7PM EST. Your audience is most active then with 40% higher engagement.",
        actionText: "Schedule Post",
        confidence: 78,
        priority: "medium",
        category: "optimization",
        metadata: { optimalTime: "19:00", timezone: "EST" },
        createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
        isRead: true,
        isActionable: true,
        estimatedImpact: "+40% engagement",
      },
      {
        id: "4",
        type: "content",
        title: "Trending Topic Opportunity",
        message:
          "AI art tutorials are trending 340% this week. Creating content in this niche could significantly boost your reach.",
        actionText: "Get Content Ideas",
        confidence: 94,
        priority: "high",
        category: "content strategy",
        metadata: { trend: "ai_art", growthRate: 340 },
        createdAt: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
        isRead: false,
        isActionable: true,
        estimatedImpact: "+300% visibility",
      },
      {
        id: "5",
        type: "monetization",
        title: "Subscription Milestone Reached",
        message:
          "Congratulations! You've reached 100 subscribers. Consider creating exclusive content to increase subscriber value and retention.",
        actionText: "Create Exclusive Content",
        confidence: 85,
        priority: "medium",
        category: "growth",
        metadata: { subscriberCount: 100, milestone: true },
        createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
        isRead: false,
        isActionable: true,
        estimatedImpact: "+25% subscriber retention",
      },
    ];

    setAiTips(tips.filter((tip) => !dismissedTips.includes(tip.id)));
  };

  const initializeChat = () => {
    const initialChat: AIChat[] = [
      {
        id: "1",
        message:
          "Hi! I'm Edith, your AI assistant. I'm here to help you maximize your creator earnings and engagement. What would you like to know?",
        sender: "ai",
        timestamp: new Date().toISOString(),
        suggestions: [
          "How can I increase my earnings?",
          "When should I post for maximum reach?",
          "What content performs best?",
          "How do I get more tips?",
        ],
      },
    ];
    setChatHistory(initialChat);
  };

  const getTipIcon = (type: string) => {
    switch (type) {
      case "opportunity":
        return <Zap className="w-4 h-4 text-orange-500" />;
      case "optimization":
        return <TrendingUp className="w-4 h-4 text-blue-500" />;
      case "engagement":
        return <Users className="w-4 h-4 text-green-500" />;
      case "monetization":
        return <DollarSign className="w-4 h-4 text-purple-500" />;
      case "timing":
        return <Clock className="w-4 h-4 text-yellow-500" />;
      case "content":
        return <Lightbulb className="w-4 h-4 text-pink-500" />;
      default:
        return <Brain className="w-4 h-4 text-gray-500" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "urgent":
        return "bg-red-100 text-red-800 border-red-200";
      case "high":
        return "bg-orange-100 text-orange-800 border-orange-200";
      case "medium":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "low":
        return "bg-blue-100 text-blue-800 border-blue-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const handleDismissTip = (tipId: string) => {
    setDismissedTips((prev) => [...prev, tipId]);
    setAiTips((prev) => prev.filter((tip) => tip.id !== tipId));
  };

  const handleTipAction = (tip: AITip) => {
    console.log("Taking action on tip:", tip);

    // Simulate different actions based on tip type
    switch (tip.type) {
      case "opportunity":
        if (tip.metadata?.contentId) {
          // Open boost modal for the content
          console.log(
            "Opening boost modal for content:",
            tip.metadata.contentId,
          );
        }
        break;
      case "engagement":
        if (tip.metadata?.supporterId) {
          // Open thank you message composer
          console.log(
            "Opening thank you message for:",
            tip.metadata.supporterId,
          );
        }
        break;
      case "timing":
        // Open post scheduler
        console.log(
          "Opening post scheduler for optimal time:",
          tip.metadata?.optimalTime,
        );
        break;
      case "content":
        // Open content ideas generator
        console.log("Opening content ideas for trend:", tip.metadata?.trend);
        break;
      default:
        console.log("General action for tip:", tip.id);
    }

    // Mark tip as read
    setAiTips((prev) =>
      prev.map((t) => (t.id === tip.id ? { ...t, isRead: true } : t)),
    );
  };

  const handleSendMessage = async () => {
    if (!chatInput.trim()) return;

    const userMessage: AIChat = {
      id: Date.now().toString(),
      message: chatInput,
      sender: "user",
      timestamp: new Date().toISOString(),
    };

    setChatHistory((prev) => [...prev, userMessage]);
    setChatInput("");
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      const aiResponse = generateAIResponse(chatInput);
      setChatHistory((prev) => [...prev, aiResponse]);
      setIsTyping(false);
    }, 1500);
  };

  const generateAIResponse = (userMessage: string): AIChat => {
    const message = userMessage.toLowerCase();

    let response = "";
    let suggestions: string[] = [];

    if (
      message.includes("earnings") ||
      message.includes("money") ||
      message.includes("revenue")
    ) {
      response = `Based on your current performance, here are ways to increase earnings:

1. **Boost high-performing content** - Your art tutorial is doing well, boosting it could increase earnings by 200%
2. **Post during peak hours** (7-9 PM EST) - 40% higher engagement
3. **Create exclusive subscriber content** - Can increase subscriber retention by 25%
4. **Use trending topics** - AI art content is up 340% this week

Your current SoftPoints balance of 5,000 SP could fund several boosts for maximum impact.`;

      suggestions = [
        "How do I boost my content?",
        "What are the best posting times?",
        "How can I get more subscribers?",
        "Show me trending topics",
      ];
    } else if (
      message.includes("post") ||
      message.includes("content") ||
      message.includes("when")
    ) {
      response = `For maximum reach and engagement:

**Best posting times for you:**
- Weekdays: 7:00 PM - 9:00 PM EST
- Weekends: 12:00 PM - 2:00 PM EST

**Content that performs best:**
- Tutorial-style posts (avg 15% higher engagement)
- Behind-the-scenes content
- Quick tips and tricks

**Current trending topics in your niche:**
- AI art creation (+340% growth)
- Digital painting techniques
- Art tool reviews`;

      suggestions = [
        "How do I create trending content?",
        "What tools should I use?",
        "How often should I post?",
        "Content ideas for this week?",
      ];
    } else if (
      message.includes("tips") ||
      message.includes("donations") ||
      message.includes("support")
    ) {
      response = `To increase tips and supporter engagement:

**Proven strategies:**
1. **Thank supporters personally** - Increases tip retention by 15%
2. **Show your process** - Fans love behind-the-scenes content
3. **Set tip goals** for specific projects or equipment
4. **Create tip tiers** with different perks

**Recent opportunity:** @Ada tipped you ₦500 recently. A personal thank you could strengthen this relationship!`;

      suggestions = [
        "How do I thank supporters?",
        "What tip goals work best?",
        "How to create tip tiers?",
        "Send thank you to @Ada",
      ];
    } else {
      response = `I'm here to help you grow your creator business! I can provide insights on:

• **Earnings optimization** - Boost strategies, timing, monetization
• **Content strategy** - Trending topics, best practices, scheduling  
• **Audience engagement** - Building relationships, increasing tips
• **Performance analytics** - Understanding your metrics and growth

What specific area would you like to focus on?`;

      suggestions = [
        "Increase my earnings",
        "Optimize my content strategy",
        "Improve audience engagement",
        "Analyze my performance",
      ];
    }

    return {
      id: Date.now().toString(),
      message: response,
      sender: "ai",
      timestamp: new Date().toISOString(),
      suggestions,
    };
  };

  const handleSuggestionClick = (suggestion: string) => {
    setChatInput(suggestion);
  };

  const unreadTips = aiTips.filter((tip) => !tip.isRead);
  const urgentTips = aiTips.filter(
    (tip) => tip.priority === "urgent" || tip.priority === "high",
  );

  return (
    <div className="space-y-6">
      {/* AI Assistant Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold">AI Creator Assistant</h2>
            <p className="text-gray-600 dark:text-gray-400">
              Edith • Your personal creator growth assistant
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="bg-green-100 text-green-800">
            {unreadTips.length} new insights
          </Badge>
          <Button
            onClick={() => setShowChat(true)}
            className="flex items-center gap-2"
          >
            <MessageCircle className="w-4 h-4" />
            Chat with Edith
          </Button>
        </div>
      </div>

      {/* Quick Stats Overview */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <DollarSign className="w-6 h-6 text-green-500 mx-auto mb-2" />
            <div className="text-lg font-bold">${metrics.recentEarnings}</div>
            <div className="text-xs text-gray-600">Recent Earnings</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <Eye className="w-6 h-6 text-blue-500 mx-auto mb-2" />
            <div className="text-lg font-bold">
              {metrics.recentViews.toLocaleString()}
            </div>
            <div className="text-xs text-gray-600">Recent Views</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <Target className="w-6 h-6 text-purple-500 mx-auto mb-2" />
            <div className="text-lg font-bold">{metrics.engagementRate}%</div>
            <div className="text-xs text-gray-600">Engagement Rate</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <TrendingUp className="w-6 h-6 text-orange-500 mx-auto mb-2" />
            <div className="text-lg font-bold">+{metrics.followerGrowth}%</div>
            <div className="text-xs text-gray-600">Follower Growth</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <Brain className="w-6 h-6 text-pink-500 mx-auto mb-2" />
            <div className="text-lg font-bold">
              {metrics.contentPerformance}
            </div>
            <div className="text-xs text-gray-600">Performance Score</div>
          </CardContent>
        </Card>
      </div>

      {/* AI Tips and Recommendations */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">AI Recommendations</h3>

        {aiTips.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <Brain className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">
                No new recommendations
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Edith is analyzing your content performance. Check back soon for
                personalized insights!
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {aiTips.map((tip) => (
              <Card
                key={tip.id}
                className={cn(
                  "transition-all duration-200",
                  !tip.isRead &&
                    "ring-2 ring-blue-200 bg-blue-50/50 dark:bg-blue-900/10",
                  tip.priority === "urgent" &&
                    "ring-2 ring-red-200 bg-red-50/50 dark:bg-red-900/10",
                )}
              >
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0">{getTipIcon(tip.type)}</div>

                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h4 className="font-medium">{tip.title}</h4>
                        <Badge
                          className={getPriorityColor(tip.priority)}
                          variant="outline"
                        >
                          {tip.priority}
                        </Badge>
                        <Badge variant="secondary" className="text-xs">
                          {tip.confidence}% confidence
                        </Badge>
                        {tip.estimatedImpact && (
                          <Badge
                            variant="outline"
                            className="text-xs bg-green-50 text-green-700"
                          >
                            {tip.estimatedImpact}
                          </Badge>
                        )}
                      </div>

                      <p className="text-gray-700 dark:text-gray-300 mb-3">
                        {tip.message}
                      </p>

                      <div className="flex items-center gap-2">
                        {tip.isActionable && tip.actionText && (
                          <Button
                            size="sm"
                            onClick={() => handleTipAction(tip)}
                          >
                            <CheckCircle className="w-4 h-4 mr-2" />
                            {tip.actionText}
                          </Button>
                        )}
                        <Button variant="outline" size="sm">
                          <Eye className="w-4 h-4 mr-2" />
                          View Details
                        </Button>
                      </div>

                      <div className="flex items-center justify-between mt-3 text-xs text-gray-500">
                        <span className="flex items-center gap-1">
                          <Brain className="w-3 h-3" />
                          {tip.category}
                        </span>
                        <span>
                          {formatDistanceToNow(new Date(tip.createdAt), {
                            addSuffix: true,
                          })}
                        </span>
                      </div>
                    </div>

                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDismissTip(tip.id)}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Chat Dialog */}
      <Dialog open={showChat} onOpenChange={setShowChat}>
        <DialogContent className="max-w-2xl h-[600px] flex flex-col">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Avatar className="w-8 h-8">
                <AvatarFallback className="bg-gradient-to-r from-purple-500 to-pink-500 text-white">
                  E
                </AvatarFallback>
              </Avatar>
              Chat with Edith
            </DialogTitle>
            <DialogDescription>
              Get personalized advice to grow your creator business
            </DialogDescription>
          </DialogHeader>

          <div className="flex-1 flex flex-col">
            {/* Chat Messages */}
            <div className="flex-1 overflow-y-auto space-y-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
              {chatHistory.map((chat) => (
                <div
                  key={chat.id}
                  className={cn(
                    "flex gap-3",
                    chat.sender === "user" ? "justify-end" : "justify-start",
                  )}
                >
                  {chat.sender === "ai" && (
                    <Avatar className="w-8 h-8">
                      <AvatarFallback className="bg-gradient-to-r from-purple-500 to-pink-500 text-white">
                        E
                      </AvatarFallback>
                    </Avatar>
                  )}

                  <div
                    className={cn(
                      "max-w-[80%] rounded-lg p-3 text-sm",
                      chat.sender === "user"
                        ? "bg-blue-500 text-white"
                        : "bg-white dark:bg-gray-700 border",
                    )}
                  >
                    <div className="whitespace-pre-wrap">{chat.message}</div>

                    {chat.suggestions && (
                      <div className="mt-3 space-y-2">
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          Try asking:
                        </div>
                        <div className="space-y-1">
                          {chat.suggestions.map((suggestion, idx) => (
                            <button
                              key={idx}
                              onClick={() => handleSuggestionClick(suggestion)}
                              className="block w-full text-left p-2 text-xs bg-gray-100 dark:bg-gray-600 rounded hover:bg-gray-200 dark:hover:bg-gray-500 transition-colors"
                            >
                              {suggestion}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {chat.sender === "user" && (
                    <Avatar className="w-8 h-8">
                      <AvatarFallback>You</AvatarFallback>
                    </Avatar>
                  )}
                </div>
              ))}

              {isTyping && (
                <div className="flex gap-3">
                  <Avatar className="w-8 h-8">
                    <AvatarFallback className="bg-gradient-to-r from-purple-500 to-pink-500 text-white">
                      E
                    </AvatarFallback>
                  </Avatar>
                  <div className="bg-white dark:bg-gray-700 border rounded-lg p-3">
                    <div className="flex items-center gap-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-100" />
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-200" />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Chat Input */}
            <div className="flex gap-2 mt-4">
              <Input
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                placeholder="Ask Edith anything about growing your creator business..."
                onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                className="flex-1"
              />
              <Button onClick={handleSendMessage} disabled={!chatInput.trim()}>
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CreatorAIAssistant;
