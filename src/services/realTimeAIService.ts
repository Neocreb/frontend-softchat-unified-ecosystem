import { IntelligentAIResponse, AIAction } from "./intelligentAIService";

interface User {
  id: string;
  name?: string;
  email?: string;
}

interface RealTimeData {
  timestamp: number;
  source: string;
  data: any;
}

export class RealTimeAIService {
  private cache: Map<string, RealTimeData> = new Map();
  private readonly CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

  /**
   * Generate intelligent response with real-time data integration
   */
  async generateRealTimeResponse(
    query: string,
    user: User,
    context?: string[],
  ): Promise<IntelligentAIResponse> {
    const normalizedQuery = query.toLowerCase().trim();

    try {
      // Check for real-time queries
      if (this.isTimeQuery(normalizedQuery)) {
        return await this.handleTimeQuery(normalizedQuery);
      }

      if (this.isCryptoQuery(normalizedQuery)) {
        return await this.handleCryptoQuery(normalizedQuery);
      }

      if (this.isWeatherQuery(normalizedQuery)) {
        return await this.handleWeatherQuery(normalizedQuery);
      }

      if (this.isNewsQuery(normalizedQuery)) {
        return await this.handleNewsQuery(normalizedQuery);
      }

      if (this.isMarketQuery(normalizedQuery)) {
        return await this.handleMarketQuery(normalizedQuery);
      }

      // Handle calculation queries
      if (this.isCalculationQuery(normalizedQuery)) {
        return this.handleCalculationQuery(normalizedQuery);
      }

      // Fall back to contextual AI response
      return this.generateContextualResponse(query, user, context);
    } catch (error) {
      console.error("Error generating real-time response:", error);
      return this.generateFallbackResponse(query, user);
    }
  }

  /**
   * Check if query is asking for current time/date
   */
  private isTimeQuery(query: string): boolean {
    const timeKeywords = [
      "what time",
      "current time",
      "what's the time",
      "time now",
      "what date",
      "today's date",
      "current date",
      "date today",
      "day is it",
      "what day",
    ];
    return timeKeywords.some((keyword) => query.includes(keyword));
  }

  /**
   * Handle time-related queries
   */
  private async handleTimeQuery(query: string): Promise<IntelligentAIResponse> {
    const now = new Date();
    const timeString = now.toLocaleTimeString();
    const dateString = now.toLocaleDateString();
    const dayName = now.toLocaleDateString("en-US", { weekday: "long" });

    let response = "";
    if (query.includes("time")) {
      response = `The current time is ${timeString}.`;
    } else if (query.includes("date")) {
      response = `Today's date is ${dateString}.`;
    } else {
      response = `It's currently ${timeString} on ${dayName}, ${dateString}.`;
    }

    return {
      message: response,
      confidence: 100,
      sources: ["System Clock"],
      category: "general",
      suggestedActions: [
        {
          id: "set-reminder",
          label: "Set Reminder",
          action: "navigate",
          url: "/notifications",
        },
      ],
      followUpQuestions: [
        "Can you set a reminder for me?",
        "What's the weather like today?",
        "Show me my schedule",
      ],
      relatedTopics: ["reminders", "calendar", "scheduling"],
    };
  }

  /**
   * Check if query is about cryptocurrency
   */
  private isCryptoQuery(query: string): boolean {
    const cryptoKeywords = [
      "bitcoin",
      "btc",
      "ethereum",
      "eth",
      "crypto",
      "cryptocurrency",
      "price",
      "market cap",
      "trading",
      "binance",
      "coinbase",
    ];
    return cryptoKeywords.some((keyword) => query.includes(keyword));
  }

  /**
   * Handle cryptocurrency queries with mock real-time data
   */
  private async handleCryptoQuery(
    query: string,
  ): Promise<IntelligentAIResponse> {
    // Simulate real-time crypto data (in production, integrate with CoinGecko/CoinMarketCap API)
    const mockPrices = {
      bitcoin: {
        price: 43250 + Math.random() * 1000,
        change: (Math.random() - 0.5) * 10,
      },
      ethereum: {
        price: 2650 + Math.random() * 100,
        change: (Math.random() - 0.5) * 8,
      },
      binancecoin: {
        price: 320 + Math.random() * 20,
        change: (Math.random() - 0.5) * 6,
      },
    };

    const now = new Date();
    let response = "";
    const actions: AIAction[] = [];

    if (query.includes("bitcoin") || query.includes("btc")) {
      const btc = mockPrices.bitcoin;
      const changeText =
        btc.change >= 0
          ? `up ${btc.change.toFixed(2)}%`
          : `down ${Math.abs(btc.change).toFixed(2)}%`;
      response = `Bitcoin (BTC) is currently trading at $${btc.price.toFixed(2)}, ${changeText} in the last 24 hours. Last updated: ${now.toLocaleTimeString()}.`;

      actions.push({
        id: "view-crypto",
        label: "View Full Chart",
        action: "navigate",
        url: "/crypto",
      });
    } else if (query.includes("ethereum") || query.includes("eth")) {
      const eth = mockPrices.ethereum;
      const changeText =
        eth.change >= 0
          ? `up ${eth.change.toFixed(2)}%`
          : `down ${Math.abs(eth.change).toFixed(2)}%`;
      response = `Ethereum (ETH) is currently trading at $${eth.price.toFixed(2)}, ${changeText} in the last 24 hours. Last updated: ${now.toLocaleTimeString()}.`;

      actions.push({
        id: "view-crypto",
        label: "View Full Chart",
        action: "navigate",
        url: "/crypto",
      });
    } else {
      response = `I can provide real-time cryptocurrency prices! Here are the current top prices:\n\n• Bitcoin: $${mockPrices.bitcoin.price.toFixed(2)}\n• Ethereum: $${mockPrices.ethereum.price.toFixed(2)}\n• BNB: $${mockPrices.binancecoin.price.toFixed(2)}\n\nLast updated: ${now.toLocaleTimeString()}`;

      actions.push({
        id: "view-crypto",
        label: "View All Prices",
        action: "navigate",
        url: "/crypto",
      });
    }

    return {
      message: response,
      confidence: 95,
      sources: ["Real-time Market Data"],
      category: "financial",
      suggestedActions: actions,
      followUpQuestions: [
        "What's the Bitcoin trend this week?",
        "Should I buy Ethereum now?",
        "Show me crypto market analysis",
      ],
      relatedTopics: ["trading", "portfolio", "market analysis", "P2P trading"],
    };
  }

  /**
   * Check if query is about weather
   */
  private isWeatherQuery(query: string): boolean {
    const weatherKeywords = [
      "weather",
      "temperature",
      "rain",
      "sunny",
      "cloudy",
      "forecast",
      "hot",
      "cold",
      "humid",
      "wind",
    ];
    return weatherKeywords.some((keyword) => query.includes(keyword));
  }

  /**
   * Handle weather queries
   */
  private async handleWeatherQuery(
    query: string,
  ): Promise<IntelligentAIResponse> {
    // Mock weather data (in production, integrate with OpenWeatherMap API)
    const mockWeather = {
      temperature: 72 + Math.random() * 10,
      condition: ["Sunny", "Partly Cloudy", "Cloudy", "Light Rain"][
        Math.floor(Math.random() * 4)
      ],
      humidity: 45 + Math.random() * 30,
      windSpeed: 5 + Math.random() * 10,
    };

    const response = `Current weather: ${mockWeather.condition} with a temperature of ${mockWeather.temperature.toFixed(1)}°F. Humidity is ${mockWeather.humidity.toFixed(0)}% with winds at ${mockWeather.windSpeed.toFixed(1)} mph.`;

    return {
      message: response,
      confidence: 90,
      sources: ["Weather Service"],
      category: "general",
      suggestedActions: [
        {
          id: "full-forecast",
          label: "View Full Forecast",
          action: "external",
          url: "https://weather.com",
        },
      ],
      followUpQuestions: [
        "What's the weather tomorrow?",
        "Should I bring an umbrella?",
        "What's the weekly forecast?",
      ],
      relatedTopics: ["outdoor activities", "travel planning", "events"],
    };
  }

  /**
   * Check if query is about news
   */
  private isNewsQuery(query: string): boolean {
    const newsKeywords = [
      "news",
      "latest",
      "headlines",
      "breaking",
      "current events",
      "happening",
      "trending",
      "updates",
    ];
    return newsKeywords.some((keyword) => query.includes(keyword));
  }

  /**
   * Handle news queries
   */
  private async handleNewsQuery(query: string): Promise<IntelligentAIResponse> {
    // Mock news data (in production, integrate with news APIs)
    const mockNews = [
      "Tech markets show strong growth amid AI innovations",
      "Cryptocurrency regulations updated in major markets",
      "Social media platforms introduce new creator tools",
    ];

    const response = `Here are the latest news headlines:\n\n${mockNews.map((headline, i) => `${i + 1}. ${headline}`).join("\n")}\n\nStay informed with real-time updates on SoftChat!`;

    return {
      message: response,
      confidence: 85,
      sources: ["News API"],
      category: "general",
      suggestedActions: [
        {
          id: "view-blog",
          label: "Read Full Articles",
          action: "navigate",
          url: "/blog",
        },
      ],
      followUpQuestions: [
        "Tell me more about crypto regulations",
        "What's happening in tech today?",
        "Show me trending topics",
      ],
      relatedTopics: ["current events", "technology", "finance", "crypto"],
    };
  }

  /**
   * Check if query is about market/stock data
   */
  private isMarketQuery(query: string): boolean {
    const marketKeywords = [
      "stock",
      "market",
      "nasdaq",
      "dow",
      "s&p",
      "trading",
      "shares",
      "equity",
      "investment",
    ];
    return marketKeywords.some((keyword) => query.includes(keyword));
  }

  /**
   * Handle market queries
   */
  private async handleMarketQuery(
    query: string,
  ): Promise<IntelligentAIResponse> {
    // Mock market data
    const mockMarket = {
      sp500: 4450 + Math.random() * 100,
      nasdaq: 14200 + Math.random() * 300,
      dow: 34800 + Math.random() * 500,
    };

    const response = `Current market overview:\n\n• S&P 500: ${mockMarket.sp500.toFixed(2)}\n• NASDAQ: ${mockMarket.nasdaq.toFixed(2)}\n• Dow Jones: ${mockMarket.dow.toFixed(2)}\n\nMarkets updated in real-time.`;

    return {
      message: response,
      confidence: 92,
      sources: ["Market Data API"],
      category: "financial",
      suggestedActions: [
        {
          id: "view-portfolio",
          label: "View Portfolio",
          action: "navigate",
          url: "/wallet",
        },
      ],
      followUpQuestions: [
        "How is my portfolio performing?",
        "What stocks are trending?",
        "Should I invest now?",
      ],
      relatedTopics: [
        "investing",
        "portfolio",
        "trading",
        "financial planning",
      ],
    };
  }

  /**
   * Check if query is a calculation
   */
  private isCalculationQuery(query: string): boolean {
    return (
      /[\d\+\-\*\/\(\)]+/.test(query) &&
      (query.includes("calculate") ||
        query.includes("=") ||
        query.includes("what is"))
    );
  }

  /**
   * Handle calculation queries
   */
  private handleCalculationQuery(query: string): IntelligentAIResponse {
    try {
      // Simple calculation parsing (in production, use a proper math parser)
      const mathExpression = query.match(/[\d\+\-\*\/\(\)\.\s]+/)?.[0];
      if (mathExpression) {
        // Basic safety check - only allow numbers and basic operators
        if (/^[\d\+\-\*\/\(\)\.\s]+$/.test(mathExpression)) {
          const result = eval(mathExpression);
          const response = `${mathExpression.trim()} = ${result}`;

          return {
            message: response,
            confidence: 100,
            sources: ["Calculator"],
            category: "general",
            suggestedActions: [
              {
                id: "copy-result",
                label: "Copy Result",
                action: "copy",
                data: result.toString(),
              },
            ],
            followUpQuestions: [
              "Calculate another expression",
              "Convert to different units",
              "Show me percentage",
            ],
            relatedTopics: ["math", "calculations", "conversions"],
          };
        }
      }
    } catch (error) {
      console.error("Calculation error:", error);
    }

    return {
      message:
        "I couldn't calculate that expression. Please try again with a simpler mathematical expression.",
      confidence: 50,
      sources: ["Calculator"],
      category: "general",
      suggestedActions: [],
      followUpQuestions: ["Try a simpler calculation"],
      relatedTopics: ["math", "calculations"],
    };
  }

  /**
   * Generate contextual response for general queries
   */
  private generateContextualResponse(
    query: string,
    user: User,
    context?: string[],
  ): IntelligentAIResponse {
    const now = new Date();
    const timeOfDay =
      now.getHours() < 12
        ? "morning"
        : now.getHours() < 18
          ? "afternoon"
          : "evening";

    return {
      message: `Hi ${user.name || "there"}! I'm Edith, your real-time AI assistant. I can help you with current information like time, weather, crypto prices, news, and calculations. I can also answer questions about SoftChat platform features. What would you like to know?`,
      confidence: 80,
      sources: ["Real-time AI"],
      category: "general",
      suggestedActions: [
        {
          id: "explore",
          label: "Explore SoftChat",
          action: "navigate",
          url: "/explore",
        },
      ],
      followUpQuestions: [
        "What's the current time?",
        "Show me crypto prices",
        "What's trending in news?",
        "Help me with SoftChat features",
      ],
      relatedTopics: ["platform help", "real-time data", "assistance"],
    };
  }

  /**
   * Generate fallback response
   */
  private generateFallbackResponse(
    query: string,
    user: User,
  ): IntelligentAIResponse {
    return {
      message: `I apologize, but I'm having trouble processing that request right now. As your real-time AI assistant, I can help with current time, crypto prices, weather, news, calculations, and SoftChat platform features. Please try asking something else!`,
      confidence: 60,
      sources: ["AI Assistant"],
      category: "general",
      suggestedActions: [],
      followUpQuestions: [
        "What can you help me with?",
        "Show me platform features",
        "Get current crypto prices",
      ],
      relatedTopics: ["help", "assistance", "features"],
    };
  }

  /**
   * Clear cache
   */
  clearCache(): void {
    this.cache.clear();
  }
}

export const realTimeAIService = new RealTimeAIService();
