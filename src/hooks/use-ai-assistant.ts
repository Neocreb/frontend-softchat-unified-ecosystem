import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/contexts/AuthContext";
import {
  aiPersonalAssistantService,
  type AIInsight,
  type ContentSuggestion,
  type TradingInsight,
  type PerformanceAnalysis,
  type SchedulingOptimization,
  type AIPersonalAssistant,
} from "@/services/aiPersonalAssistantService";

export interface UseAIAssistantReturn {
  // Data
  assistant: AIPersonalAssistant | null;
  insights: AIInsight[];
  contentSuggestions: ContentSuggestion[];
  tradingInsights: TradingInsight[];
  performance: PerformanceAnalysis | null;
  scheduling: SchedulingOptimization | null;
  dashboardSummary: any;

  // Loading states
  isLoading: boolean;
  isLoadingInsights: boolean;
  isLoadingContent: boolean;
  isLoadingTrading: boolean;
  isLoadingPerformance: boolean;

  // Actions
  initializeAssistant: () => Promise<void>;
  refreshInsights: () => Promise<void>;
  refreshContentSuggestions: () => Promise<void>;
  refreshTradingInsights: () => Promise<void>;
  refreshPerformance: () => Promise<void>;
  refreshScheduling: () => Promise<void>;
  refreshAll: () => Promise<void>;

  // Interactions
  acceptSuggestion: (suggestionId: string, type: string) => Promise<void>;
  dismissSuggestion: (suggestionId: string, type: string) => Promise<void>;
  trackInteraction: (type: string, data: any) => Promise<void>;

  // Configuration
  updateAssistantPreferences: (
    preferences: Partial<AIPersonalAssistant["preferences"]>,
  ) => Promise<boolean>;

  // Chat
  chatMessages: any[];
  sendChatMessage: (message: string) => Promise<void>;
  clearChat: () => void;

  // Utilities
  getInsightsByType: (type: string) => AIInsight[];
  getInsightsByPriority: (priority: string) => AIInsight[];
  getTopPerformingContent: () => ContentSuggestion[];
  getUrgentInsights: () => AIInsight[];

  // Error handling
  error: string | null;
  clearError: () => void;
}

export const useAIAssistant = (): UseAIAssistantReturn => {
  const { user } = useAuth();

  // Data state
  const [assistant, setAssistant] = useState<AIPersonalAssistant | null>(null);
  const [insights, setInsights] = useState<AIInsight[]>([]);
  const [contentSuggestions, setContentSuggestions] = useState<
    ContentSuggestion[]
  >([]);
  const [tradingInsights, setTradingInsights] = useState<TradingInsight[]>([]);
  const [performance, setPerformance] = useState<PerformanceAnalysis | null>(
    null,
  );
  const [scheduling, setScheduling] = useState<SchedulingOptimization | null>(
    null,
  );
  const [dashboardSummary, setDashboardSummary] = useState<any>(null);
  const [chatMessages, setChatMessages] = useState<any[]>([]);

  // Loading states
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingInsights, setIsLoadingInsights] = useState(false);
  const [isLoadingContent, setIsLoadingContent] = useState(false);
  const [isLoadingTrading, setIsLoadingTrading] = useState(false);
  const [isLoadingPerformance, setIsLoadingPerformance] = useState(false);

  // Error state
  const [error, setError] = useState<string | null>(null);

  // Initialize assistant on mount
  useEffect(() => {
    if (user?.id) {
      initializeAssistant();
    }
  }, [user?.id]);

  const initializeAssistant = useCallback(async () => {
    if (!user?.id) return;

    setIsLoading(true);
    setError(null);

    try {
      // Initialize assistant
      const assistantData =
        await aiPersonalAssistantService.initializeAssistant(user.id);
      setAssistant(assistantData);

      // Initialize chat with welcome message
      setChatMessages([
        {
          id: "welcome",
          type: "assistant",
          content: `Hi ${user.username || user.email}! I'm ${assistantData.name}, your AI personal assistant. I'm here to help you optimize your content, trading, and overall platform performance. What would you like to work on today?`,
          timestamp: new Date(),
        },
      ]);

      // Load initial data
      await refreshAll();
    } catch (err) {
      setError("Failed to initialize AI assistant");
      console.error("Error initializing AI assistant:", err);
    } finally {
      setIsLoading(false);
    }
  }, [user?.id]);

  const refreshInsights = useCallback(async () => {
    if (!user?.id) return;

    setIsLoadingInsights(true);
    try {
      const data = await aiPersonalAssistantService.getAIInsights(user.id);
      setInsights(data);
    } catch (err) {
      setError("Failed to load AI insights");
      console.error("Error loading insights:", err);
    } finally {
      setIsLoadingInsights(false);
    }
  }, [user?.id]);

  const refreshContentSuggestions = useCallback(async () => {
    if (!user?.id) return;

    setIsLoadingContent(true);
    try {
      const data = await aiPersonalAssistantService.generateContentSuggestions(
        user.id,
      );
      setContentSuggestions(data);
    } catch (err) {
      setError("Failed to load content suggestions");
      console.error("Error loading content suggestions:", err);
    } finally {
      setIsLoadingContent(false);
    }
  }, [user?.id]);

  const refreshTradingInsights = useCallback(async () => {
    if (!user?.id) return;

    setIsLoadingTrading(true);
    try {
      const data = await aiPersonalAssistantService.generateTradingInsights(
        user.id,
      );
      setTradingInsights(data);
    } catch (err) {
      setError("Failed to load trading insights");
      console.error("Error loading trading insights:", err);
    } finally {
      setIsLoadingTrading(false);
    }
  }, [user?.id]);

  const refreshPerformance = useCallback(async () => {
    if (!user?.id) return;

    setIsLoadingPerformance(true);
    try {
      const data = await aiPersonalAssistantService.generatePerformanceAnalysis(
        user.id,
      );
      setPerformance(data);
    } catch (err) {
      setError("Failed to load performance analysis");
      console.error("Error loading performance:", err);
    } finally {
      setIsLoadingPerformance(false);
    }
  }, [user?.id]);

  const refreshScheduling = useCallback(async () => {
    if (!user?.id) return;

    try {
      const data =
        await aiPersonalAssistantService.generateSchedulingOptimization(
          user.id,
        );
      setScheduling(data);
    } catch (err) {
      setError("Failed to load scheduling optimization");
      console.error("Error loading scheduling:", err);
    }
  }, [user?.id]);

  const refreshAll = useCallback(async () => {
    if (!user?.id) return;

    await Promise.all([
      refreshInsights(),
      refreshContentSuggestions(),
      refreshTradingInsights(),
      refreshPerformance(),
      refreshScheduling(),
    ]);

    // Load dashboard summary
    try {
      const summary = await aiPersonalAssistantService.getDashboardSummary(
        user.id,
      );
      setDashboardSummary(summary);
    } catch (err) {
      console.error("Error loading dashboard summary:", err);
    }
  }, [
    user?.id,
    refreshInsights,
    refreshContentSuggestions,
    refreshTradingInsights,
    refreshPerformance,
    refreshScheduling,
  ]);

  const acceptSuggestion = useCallback(
    async (suggestionId: string, type: string) => {
      if (!user?.id) return;

      try {
        await trackInteraction("accept_suggestion", { suggestionId, type });

        // Remove suggestion from list if it's a content suggestion
        if (type === "content") {
          setContentSuggestions((prev) =>
            prev.filter((s) => s.id !== suggestionId),
          );
        }
      } catch (err) {
        setError("Failed to accept suggestion");
        console.error("Error accepting suggestion:", err);
      }
    },
    [user?.id],
  );

  const dismissSuggestion = useCallback(
    async (suggestionId: string, type: string) => {
      if (!user?.id) return;

      try {
        await trackInteraction("dismiss_suggestion", { suggestionId, type });

        // Remove suggestion from appropriate list
        if (type === "content") {
          setContentSuggestions((prev) =>
            prev.filter((s) => s.id !== suggestionId),
          );
        } else if (type === "insight") {
          setInsights((prev) => prev.filter((i) => i.id !== suggestionId));
        }
      } catch (err) {
        setError("Failed to dismiss suggestion");
        console.error("Error dismissing suggestion:", err);
      }
    },
    [user?.id],
  );

  const trackInteraction = useCallback(
    async (type: string, data: any) => {
      if (!user?.id) return;

      try {
        await aiPersonalAssistantService.trackInteraction(user.id, type, data);
      } catch (err) {
        console.error("Error tracking interaction:", err);
      }
    },
    [user?.id],
  );

  const updateAssistantPreferences = useCallback(
    async (preferences: Partial<AIPersonalAssistant["preferences"]>) => {
      if (!user?.id) return false;

      try {
        const success =
          await aiPersonalAssistantService.updateAssistantPreferences(
            user.id,
            preferences,
          );
        if (success) {
          setAssistant((prev) =>
            prev
              ? {
                  ...prev,
                  preferences: { ...prev.preferences, ...preferences },
                }
              : null,
          );
        }
        return success;
      } catch (err) {
        setError("Failed to update assistant preferences");
        console.error("Error updating preferences:", err);
        return false;
      }
    },
    [user?.id],
  );

  const sendChatMessage = useCallback(
    async (message: string) => {
      if (!user?.id || !message.trim()) return;

      const userMessage = {
        id: `msg-${Date.now()}`,
        type: "user",
        content: message,
        timestamp: new Date(),
      };

      setChatMessages((prev) => [...prev, userMessage]);

      // Track chat interaction
      await trackInteraction("chat", { message });

      // Simulate AI response (in a real app, this would call an AI service)
      setTimeout(() => {
        const aiResponse = {
          id: `ai-${Date.now()}`,
          type: "assistant",
          content: generateAIResponse(message),
          timestamp: new Date(),
        };
        setChatMessages((prev) => [...prev, aiResponse]);
      }, 1000);
    },
    [user?.id, trackInteraction],
  );

  const generateAIResponse = (input: string): string => {
    const lowerInput = input.toLowerCase();

    // Platform feature questions
    if (
      lowerInput.includes("what") &&
      (lowerInput.includes("platform") || lowerInput.includes("softchat"))
    ) {
      return "SoftChat is a comprehensive social platform combining social media, crypto trading, freelance marketplace, video content creation, and rewards system. You can create posts, trade cryptocurrencies, hire freelancers, sell products, stream live videos, and earn SoftPoints for activities. What specific feature would you like to know more about?";
    }

    if (lowerInput.includes("feature") || lowerInput.includes("what can")) {
      return "Here are SoftChat's main features: 📱 Social Feed & Stories, 💰 Crypto Trading & Portfolio, 🛒 Marketplace for products, 💼 Freelance services, 🎥 Video creation & streaming, 🏆 Rewards & achievements, 💬 Real-time messaging, 🌍 Community events. Which feature interests you most?";
    }

    // Content and social media questions
    if (
      lowerInput.includes("content") ||
      lowerInput.includes("post") ||
      lowerInput.includes("social")
    ) {
      return "I can help optimize your content strategy! Best performing content types: React tutorials (high engagement), crypto analysis (2x revenue), video content (34% better than static posts). Optimal posting times: Tuesday 7PM, Sunday 6PM for crypto. Want me to generate specific content ideas or analyze your recent posts?";
    }

    // Crypto and trading questions
    if (
      lowerInput.includes("trading") ||
      lowerInput.includes("crypto") ||
      lowerInput.includes("bitcoin") ||
      lowerInput.includes("ethereum")
    ) {
      return "I'm tracking crypto markets 24/7! Current insights: Bitcoin support at $43,500, Ethereum showing strong fundamentals. You can trade 50+ cryptocurrencies, set up automated trading, join copy trading, stake for rewards, and create crypto content. Your trading posts generate 2x more engagement. Need specific analysis or trading guidance?";
    }

    // Marketplace questions
    if (
      lowerInput.includes("marketplace") ||
      lowerInput.includes("sell") ||
      lowerInput.includes("buy") ||
      lowerInput.includes("product")
    ) {
      return "The SoftChat Marketplace has electronics, fashion, home goods, digital products, and more. You can list products, manage inventory, process orders, and track sales. Sellers earn SoftPoints for each sale. Need help listing a product, managing orders, or boosting your listings?";
    }

    // Freelance questions
    if (
      lowerInput.includes("freelance") ||
      lowerInput.includes("job") ||
      lowerInput.includes("hire") ||
      lowerInput.includes("work")
    ) {
      return "Our freelance platform connects you with opportunities in development, design, marketing, writing, and more. You can create proposals, manage projects, use escrow protection, and build your reputation. Completed projects earn SoftPoints and reviews. Are you looking to hire someone or find freelance work?";
    }

    // Video and streaming questions
    if (
      lowerInput.includes("video") ||
      lowerInput.includes("stream") ||
      lowerInput.includes("live")
    ) {
      return "SoftChat's video features include: content creation tools, live streaming, video monetization, audience engagement, and analytics. Live streams can earn donations and SoftPoints. Video content gets 34% more engagement than posts. Want help with video creation, streaming setup, or monetization strategies?";
    }

    // Rewards and points questions
    if (
      lowerInput.includes("points") ||
      lowerInput.includes("reward") ||
      lowerInput.includes("earn") ||
      lowerInput.includes("softpoint")
    ) {
      return "SoftPoints reward your platform activity! Earn points for: posting content (100pts), crypto trading (200pts), marketplace sales (500pts), completing freelance jobs (300pts), daily visits (25pts), and more. Redeem for marketplace credits, trading bonuses, or premium features. Current balance and earning tips?";
    }

    // Analytics and performance questions
    if (
      lowerInput.includes("analytics") ||
      lowerInput.includes("performance") ||
      lowerInput.includes("stats")
    ) {
      return "Your performance is trending up! Views +18.5%, engagement +12.3% this week. Video content strategy is highly effective. I track all metrics: post performance, crypto portfolio, marketplace sales, freelance earnings, and SoftPoints. Which metrics would you like to analyze in detail?";
    }

    // Scheduling and timing questions
    if (
      lowerInput.includes("schedule") ||
      lowerInput.includes("time") ||
      lowerInput.includes("when")
    ) {
      return "Optimal timing based on your audience: Tuesday 7PM (max engagement), Sunday 6PM (crypto analysis), Wednesday 12PM (B2B content), Thursday 8PM (video content). Avoid Saturday afternoons. I can create automated posting schedules and send reminders. Want a custom schedule?";
    }

    // Wallet and financial questions
    if (
      lowerInput.includes("wallet") ||
      lowerInput.includes("money") ||
      lowerInput.includes("earnings") ||
      lowerInput.includes("withdraw")
    ) {
      return "Your SoftChat wallet manages all earnings: crypto trading profits, marketplace sales, freelance payments, video monetization, and SoftPoints. Support for 20+ payment methods including crypto, bank transfers, and mobile money. Need help with deposits, withdrawals, or financial tracking?";
    }

    // Help and navigation questions
    if (
      lowerInput.includes("help") ||
      lowerInput.includes("how") ||
      lowerInput.includes("guide")
    ) {
      return "I'm here to help with everything! Main areas I assist with: 📈 Content optimization, 💹 Trading strategies, 🛒 Marketplace management, 💼 Freelance success, 🎥 Video creation, 📊 Analytics insights, 💰 Earnings optimization. What specific help do you need?";
    }

    // General platform questions
    if (
      lowerInput.includes("community") ||
      lowerInput.includes("event") ||
      lowerInput.includes("people")
    ) {
      return "SoftChat has an active community with live events, competitions, networking opportunities, and collaborative projects. Join community events to earn bonus SoftPoints and connect with other creators, traders, and entrepreneurs. Check the Community Events tab for upcoming activities!";
    }

    // Default response with platform overview
    return "Hi! I'm Edith, your AI assistant for SoftChat. I help with content creation, crypto trading, marketplace sales, freelance work, video content, rewards optimization, and performance analytics. I can answer questions about any platform feature, provide personalized recommendations, and help you maximize your success. What would you like to explore today?";
  };

  const clearChat = useCallback(() => {
    setChatMessages([]);
  }, []);

  // Utility functions
  const getInsightsByType = useCallback(
    (type: string) => {
      return insights.filter((insight) => insight.type === type);
    },
    [insights],
  );

  const getInsightsByPriority = useCallback(
    (priority: string) => {
      return insights.filter((insight) => insight.priority === priority);
    },
    [insights],
  );

  const getTopPerformingContent = useCallback(() => {
    return contentSuggestions
      .sort((a, b) => b.confidence - a.confidence)
      .slice(0, 3);
  }, [contentSuggestions]);

  const getUrgentInsights = useCallback(() => {
    return insights.filter(
      (insight) => insight.priority === "urgent" || insight.priority === "high",
    );
  }, [insights]);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    // Data
    assistant,
    insights,
    contentSuggestions,
    tradingInsights,
    performance,
    scheduling,
    dashboardSummary,

    // Loading states
    isLoading,
    isLoadingInsights,
    isLoadingContent,
    isLoadingTrading,
    isLoadingPerformance,

    // Actions
    initializeAssistant,
    refreshInsights,
    refreshContentSuggestions,
    refreshTradingInsights,
    refreshPerformance,
    refreshScheduling,
    refreshAll,

    // Interactions
    acceptSuggestion,
    dismissSuggestion,
    trackInteraction,

    // Configuration
    updateAssistantPreferences,

    // Chat
    chatMessages,
    sendChatMessage,
    clearChat,

    // Utilities
    getInsightsByType,
    getInsightsByPriority,
    getTopPerformingContent,
    getUrgentInsights,

    // Error handling
    error,
    clearError,
  };
};

export default useAIAssistant;
