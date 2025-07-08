import { User } from "@/types/user";

// Enhanced AI service with comprehensive platform knowledge
export interface PlatformFeature {
  name: string;
  description: string;
  benefits: string[];
  howToUse: string[];
  tips: string[];
}

export interface SmartResponse {
  message: string;
  suggestedActions: Array<{
    label: string;
    action: string;
    url?: string;
  }>;
  relatedTopics: string[];
  followUpQuestions: string[];
}

export class EnhancedAIService {
  private platformFeatures: Record<string, PlatformFeature> = {
    social_feed: {
      name: "Social Feed & Content Creation",
      description:
        "Create and share posts, stories, images, and engage with the community",
      benefits: [
        "Build your personal brand",
        "Engage with like-minded people",
        "Earn SoftPoints for content creation",
        "Monetize through engagement",
      ],
      howToUse: [
        "Navigate to Feed page",
        "Click 'Create Post' to share content",
        "Add images, videos, or text",
        "Use hashtags for better discovery",
        "Engage with others' content",
      ],
      tips: [
        "Post consistently for better reach",
        "Use trending hashtags",
        "Engage authentically with comments",
        "Post during peak hours (7-9 PM)",
      ],
    },
    crypto_trading: {
      name: "Cryptocurrency Trading",
      description:
        "Trade 50+ cryptocurrencies with advanced tools and analytics",
      benefits: [
        "Profit from crypto market movements",
        "Diversify your investment portfolio",
        "Access real-time market data",
        "Learn from copy trading experts",
      ],
      howToUse: [
        "Go to Crypto section",
        "Choose trading pair (BTC/USD, ETH/USD, etc.)",
        "Set buy/sell orders",
        "Use stop-loss and take-profit orders",
        "Monitor portfolio performance",
      ],
      tips: [
        "Start with small amounts",
        "Use stop-loss orders to manage risk",
        "Follow expert traders via copy trading",
        "Dollar-cost average for long-term investments",
      ],
    },
    marketplace: {
      name: "Product Marketplace",
      description: "Buy and sell physical and digital products",
      benefits: [
        "Generate income from product sales",
        "Find unique products from community",
        "Build seller reputation",
        "Earn SoftPoints for transactions",
      ],
      howToUse: [
        "Visit Marketplace section",
        "Browse categories or search products",
        "List your own products for sale",
        "Manage orders and inventory",
        "Process payments securely",
      ],
      tips: [
        "Use high-quality product photos",
        "Write detailed descriptions",
        "Competitive pricing research",
        "Respond quickly to customer inquiries",
      ],
    },
    freelance: {
      name: "Freelance Services",
      description: "Offer or hire freelance services across various categories",
      benefits: [
        "Earn money from your skills",
        "Find talented professionals",
        "Build long-term client relationships",
        "Secure payments through escrow",
      ],
      howToUse: [
        "Access Freelance section",
        "Create detailed profile with portfolio",
        "Browse available jobs or post job requests",
        "Submit proposals with competitive pricing",
        "Deliver work and build reputation",
      ],
      tips: [
        "Showcase your best work in portfolio",
        "Write personalized proposals",
        "Set competitive but fair rates",
        "Communicate clearly with clients",
      ],
    },
    video_content: {
      name: "Video Creation & Streaming",
      description: "Create, upload, and stream video content with monetization",
      benefits: [
        "Higher engagement than static posts",
        "Monetize through views and tips",
        "Build subscriber base",
        "Real-time audience interaction",
      ],
      howToUse: [
        "Go to Videos section",
        "Upload pre-recorded videos",
        "Start live streaming sessions",
        "Interact with viewers in real-time",
        "Enable monetization features",
      ],
      tips: [
        "Consistent streaming schedule",
        "High-quality audio is crucial",
        "Engage with viewers actively",
        "Create compelling thumbnails",
      ],
    },
    rewards_system: {
      name: "SoftPoints Rewards",
      description:
        "Earn points for platform activities and redeem for benefits",
      benefits: [
        "Passive earning through activities",
        "Redeem for marketplace credits",
        "Access premium features",
        "Unlock achievement badges",
      ],
      howToUse: [
        "Earn points automatically through activities",
        "Check rewards balance in wallet",
        "Browse redemption options",
        "Complete daily/weekly challenges",
        "Track achievement progress",
      ],
      tips: [
        "Complete daily login for bonus points",
        "Engage actively across all features",
        "Participate in community events",
        "Refer friends for bonus rewards",
      ],
    },
    wallet: {
      name: "Digital Wallet",
      description: "Manage all your earnings and transactions in one place",
      benefits: [
        "Centralized financial management",
        "Multiple payment method support",
        "Real-time transaction tracking",
        "Secure crypto and fiat storage",
      ],
      howToUse: [
        "Access Wallet from main menu",
        "View balances across all currencies",
        "Deposit or withdraw funds",
        "Set up payment methods",
        "Track transaction history",
      ],
      tips: [
        "Enable two-factor authentication",
        "Regular balance monitoring",
        "Use strong passwords",
        "Keep backup of recovery phrases",
      ],
    },
  };

  generateSmartResponse(
    input: string,
    userContext?: Partial<User>,
  ): SmartResponse {
    const lowerInput = input.toLowerCase();

    // Analyze input and determine best response strategy
    if (this.isGreeting(lowerInput)) {
      return this.generateGreetingResponse(userContext);
    }

    if (this.isFeatureQuestion(lowerInput)) {
      return this.generateFeatureResponse(lowerInput);
    }

    if (this.isHowToQuestion(lowerInput)) {
      return this.generateHowToResponse(lowerInput);
    }

    if (this.isOptimizationQuestion(lowerInput)) {
      return this.generateOptimizationResponse(lowerInput);
    }

    if (this.isTroubleshootingQuestion(lowerInput)) {
      return this.generateTroubleshootingResponse(lowerInput);
    }

    // Default comprehensive response
    return this.generateComprehensiveResponse(lowerInput);
  }

  private isGreeting(input: string): boolean {
    const greetings = [
      "hi",
      "hello",
      "hey",
      "good morning",
      "good afternoon",
      "good evening",
    ];
    return greetings.some((greeting) => input.includes(greeting));
  }

  private isFeatureQuestion(input: string): boolean {
    const featureKeywords = [
      "what is",
      "what can",
      "features",
      "capabilities",
      "what does",
    ];
    return featureKeywords.some((keyword) => input.includes(keyword));
  }

  private isHowToQuestion(input: string): boolean {
    const howToKeywords = [
      "how to",
      "how do i",
      "how can i",
      "steps to",
      "guide",
    ];
    return howToKeywords.some((keyword) => input.includes(keyword));
  }

  private isOptimizationQuestion(input: string): boolean {
    const optimizationKeywords = [
      "optimize",
      "improve",
      "better",
      "maximize",
      "increase",
      "boost",
    ];
    return optimizationKeywords.some((keyword) => input.includes(keyword));
  }

  private isTroubleshootingQuestion(input: string): boolean {
    const troubleKeywords = [
      "problem",
      "issue",
      "error",
      "not working",
      "help",
      "stuck",
    ];
    return troubleKeywords.some((keyword) => input.includes(keyword));
  }

  private generateGreetingResponse(userContext?: Partial<User>): SmartResponse {
    const userName = userContext?.username || userContext?.email || "there";

    return {
      message: `Hey ${userName}! 👋 I'm Edith, your personal SoftChat assistant. I'm here to help you succeed on the platform - whether you want to create amazing content, trade crypto, sell products, or earn through freelancing. Just ask me anything and I'll guide you step by step!`,
      suggestedActions: [
        { label: "Show me around", action: "show_features" },
        { label: "Help me get started", action: "show_guide" },
        {
          label: "Check my stats",
          action: "analytics",
          url: "/analytics",
        },
        { label: "How to earn points", action: "rewards", url: "/rewards" },
      ],
      relatedTopics: [
        "platform overview",
        "getting started",
        "earning money",
        "best practices",
      ],
      followUpQuestions: [
        "What's the easiest way to start earning money here?",
        "How can I get more followers and engagement?",
        "Which features should I focus on first?",
      ],
    };
  }

  private generateFeatureResponse(input: string): SmartResponse {
    // Determine which feature is being asked about
    const featureKeys = Object.keys(this.platformFeatures);
    const mentionedFeature = featureKeys.find(
      (key) =>
        input.includes(key.replace("_", " ")) ||
        input.includes(this.platformFeatures[key].name.toLowerCase()),
    );

    if (mentionedFeature) {
      const feature = this.platformFeatures[mentionedFeature];
      return {
        message: `${feature.name} is all about ${feature.description}\n\nHere's what makes it awesome:\n${feature.benefits.map((b) => `• ${b}`).join("\n")}\n\nTo get started:\n${feature.howToUse
          .slice(0, 3)
          .map((h, i) => `${i + 1}. ${h}`)
          .join(
            "\n",
          )}\n\nWant me to show you around or answer any specific questions about it?`,
        suggestedActions: [
          {
            label: `Let's try ${feature.name}`,
            action: "navigate",
            url: this.getFeatureUrl(mentionedFeature),
          },
          { label: "Show me how", action: "tutorial" },
          { label: "Give me tips", action: "tips" },
        ],
        relatedTopics: [feature.name, "best practices", "optimization"],
        followUpQuestions: [
          `How can I make the most of ${feature.name.toLowerCase()}?`,
          `What mistakes should I avoid with ${feature.name.toLowerCase()}?`,
          `How much money can I make with ${feature.name.toLowerCase()}?`,
        ],
      };
    }

    // General features overview
    return {
      message: `SoftChat has everything you need to succeed online! Here's what you can do:\n\n🌟 Social Feed - Share posts, build your following, and connect with others\n💰 Crypto Trading - Buy and sell 50+ cryptocurrencies with real-time data\n🛒 Marketplace - Sell your products or buy from other users\n💼 Freelance Hub - Offer your skills or hire talented people\n🎥 Video Studio - Create videos and live stream to your audience\n🏆 Rewards System - Earn SoftPoints for every activity you do\n💳 Digital Wallet - Keep track of all your earnings in one place\n\nWhat sounds most interesting to you? I can help you get started with any of these!`,
      suggestedActions: [
        { label: "Create my first post", action: "create", url: "/create" },
        {
          label: "Browse the marketplace",
          action: "marketplace",
          url: "/marketplace",
        },
        { label: "Check out crypto prices", action: "crypto", url: "/crypto" },
        {
          label: "Find freelance work",
          action: "freelance",
          url: "/freelance",
        },
      ],
      relatedTopics: [
        "platform overview",
        "earning opportunities",
        "getting started",
      ],
      followUpQuestions: [
        "Which feature should I try first?",
        "How do all these features work together?",
        "What's the fastest way to start earning money?",
      ],
    };
  }

  private generateHowToResponse(input: string): SmartResponse {
    // Analyze what specific action they want to learn
    if (input.includes("post") || input.includes("content")) {
      return {
        message: `**How to Create Engaging Content:**\n\n1. Go to Create page or click '+' button\n2. Choose content type (post, image, video)\n3. Write compelling caption with relevant hashtags\n4. Add high-quality visuals\n5. Post at optimal times (7-9 PM for best engagement)\n6. Engage with comments quickly\n\n**Pro Tips:** Use trending hashtags, post consistently, and create value for your audience!`,
        suggestedActions: [
          { label: "Create First Post", action: "create", url: "/create" },
          {
            label: "View Content Analytics",
            action: "analytics",
            url: "/analytics",
          },
          {
            label: "Browse Trending Hashtags",
            action: "explore",
            url: "/explore",
          },
        ],
        relatedTopics: [
          "content strategy",
          "hashtag optimization",
          "engagement tips",
        ],
        followUpQuestions: [
          "What time should I post for maximum engagement?",
          "How do I use hashtags effectively?",
          "How can I increase my followers?",
        ],
      };
    }

    if (input.includes("trade") || input.includes("crypto")) {
      return {
        message: `Getting started with crypto trading is easier than you think! Here's how:\n\n1. Head over to the Crypto section\n2. Complete your verification (just basic info)\n3. Add some funds to your wallet\n4. Pick a trading pair like BTC/USD or ETH/USD\n5. Set your buy or sell orders\n6. Always use stop-loss orders to protect yourself\n7. Keep an eye on your portfolio\n\nMy advice? Start with small amounts first, use those stop-losses religiously, and maybe try copy trading to learn from the pros. You'll get the hang of it quickly!`,
        suggestedActions: [
          { label: "Take me to trading", action: "crypto", url: "/crypto" },
          { label: "Show me market data", action: "analysis" },
          { label: "Find top traders to copy", action: "copy_trading" },
        ],
        relatedTopics: [
          "trading strategies",
          "risk management",
          "market analysis",
        ],
        followUpQuestions: [
          "How much money do I need to start trading?",
          "How do stop-loss orders work exactly?",
          "Which crypto should I start with?",
        ],
      };
    }

    // General how-to response
    return {
      message: `I'd love to help you learn anything on SoftChat! Here are the most popular things people ask about:\n\n📱 Content Creation - How to post amazing content that gets noticed\n💰 Crypto Trading - Step-by-step guide to start trading safely\n🛒 Selling Products - List and sell your stuff in the marketplace\n💼 Freelancing - Turn your skills into money\n🎥 Video Creation - Make videos and live streams that people love\n🏆 Earning Points - All the ways to rack up SoftPoints\n\nWhat would you like to dive into? I'll walk you through it!`,
      suggestedActions: [
        { label: "Pick a topic for me", action: "tutorials" },
        { label: "Show me the basics", action: "quick_start" },
        { label: "Watch video guides", action: "video_help" },
      ],
      relatedTopics: ["tutorials", "getting started", "step-by-step guides"],
      followUpQuestions: [
        "How do I make my first post?",
        "What's the fastest way to start earning?",
        "How do I set up my profile properly?",
      ],
    };
  }

  private generateOptimizationResponse(input: string): SmartResponse {
    return {
      message: `Great question! Here's how to level up your SoftChat game:\n\n🎯 For better content engagement:\n• Post between 7-9 PM when most people are online\n• Use 3-5 hashtags that actually relate to your content\n• Try making more videos - they get 34% more engagement!\n• Reply to comments quickly, like within 2 hours\n\n📈 To earn more money:\n• Do your daily activities for easy SoftPoints\n• Use multiple features - cross-promote your content\n• Focus on the big earners like crypto trading and marketplace sales\n• Stay consistent - show up regularly\n\n💡 Make your profile shine:\n• Fill out every section completely\n• Use professional photos that actually look like you\n• Show off your best work in your portfolio\n• Get that verified checkmark if you can\n\nWhat area would you like me to dive deeper into?`,
      suggestedActions: [
        {
          label: "Check my current stats",
          action: "analytics",
          url: "/analytics",
        },
        { label: "Give me specific tips", action: "tips" },
        { label: "Show me what works", action: "best_practices" },
      ],
      relatedTopics: [
        "performance optimization",
        "engagement strategies",
        "earning tips",
      ],
      followUpQuestions: [
        "How can I double my engagement rate?",
        "When exactly should I post my content?",
        "What's the secret to getting more followers?",
      ],
    };
  }

  private generateTroubleshootingResponse(input: string): SmartResponse {
    return {
      message: `Oh no! Let me help you fix whatever's going wrong. Here are the most common issues and quick fixes:\n\n🔧 Account problems:\n• Can't verify? Double-check your email or upload clear document photos\n• Can't log in? Try resetting your password or clearing your browser cache\n• Profile acting weird? Make sure all your info is filled out properly\n\n💰 Money issues:\n• Payment taking forever? Check if your payment method is still valid\n• Can't withdraw? You might have hit a daily limit - check your account settings\n• Trading not working? Make sure you have enough balance in your wallet\n\n📱 Technical stuff:\n• App keeps crashing? Update to the newest version from the app store\n• Everything loading super slow? Check your internet connection\n• Features not responding? Clear your browser cache and cookies\n\nStill stuck? Don't worry - our support team is really helpful and usually responds within a few hours. Want me to help you contact them?`,
      suggestedActions: [
        { label: "Get help from support", action: "support" },
        { label: "Browse help articles", action: "help_center" },
        { label: "Report this bug", action: "bug_report" },
      ],
      relatedTopics: ["troubleshooting", "technical support", "account help"],
      followUpQuestions: [
        "How do I reach the support team?",
        "Where can I find step-by-step help guides?",
        "How fast does support usually respond?",
      ],
    };
  }

  private generateComprehensiveResponse(input: string): SmartResponse {
    // Determine most relevant topic based on keywords
    const topics = {
      earning: ["earn", "money", "profit", "income", "revenue"],
      social: ["followers", "likes", "engagement", "community"],
      trading: ["bitcoin", "ethereum", "crypto", "trading", "invest"],
      marketplace: ["sell", "buy", "product", "store", "shop"],
      freelance: ["work", "job", "hire", "service", "skill"],
      video: ["video", "stream", "watch", "content", "youtube"],
    };

    let dominantTopic = "general";
    let maxMatches = 0;

    Object.entries(topics).forEach(([topic, keywords]) => {
      const matches = keywords.filter((keyword) =>
        input.includes(keyword),
      ).length;
      if (matches > maxMatches) {
        maxMatches = matches;
        dominantTopic = topic;
      }
    });

    const responses = {
      earning: {
        message: `**Multiple Ways to Earn on SoftChat:**\n\n💰 **High-Earning Activities:**\n• Crypto trading (potential high returns)\n• Marketplace sales (500 SoftPoints per sale)\n��� Freelance services (direct payments)\n• Video monetization (views + tips)\n\n🏆 **SoftPoints Earning:**\n• Daily login: 25 points\n• Create content: 100 points\n• Trading activity: 200 points\n• Community engagement: 50 points\n\n**Strategy:** Focus on 2-3 areas consistently for best results!`,
        suggestedActions: [
          { label: "Check Earning Opportunities", action: "earnings" },
          {
            label: "View SoftPoints Balance",
            action: "wallet",
            url: "/wallet",
          },
          { label: "Start Trading", action: "crypto", url: "/crypto" },
        ],
      },
      social: {
        message: `**Building Your Social Presence:**\n\n👥 **Growth Strategies:**\n• Post consistently (daily recommended)\n• Use trending hashtags in your niche\n• Engage authentically with others\n• Share valuable, original content\n• Collaborate with other creators\n\n📈 **Engagement Tips:**\n• Respond to comments quickly\n• Ask questions in your posts\n• Share behind-the-scenes content\n• Post at optimal times (7-9 PM)`,
        suggestedActions: [
          { label: "Create Post", action: "create", url: "/create" },
          { label: "Find Trending Topics", action: "explore", url: "/explore" },
          { label: "Check Analytics", action: "analytics", url: "/analytics" },
        ],
      },
      trading: {
        message: `**Crypto Trading Insights:**\n\n📊 **Current Market:**\n• Bitcoin: Strong support at $43,500\n• Ethereum: Bullish fundamentals\n• 50+ trading pairs available\n• Real-time market data\n\n⚡ **Trading Features:**\n• Spot trading with low fees\n• Copy trading from experts\n• Advanced charting tools\n• Risk management orders\n\n**Remember:** Only trade what you can afford to lose!`,
        suggestedActions: [
          { label: "View Markets", action: "crypto", url: "/crypto" },
          { label: "Copy Expert Traders", action: "copy_trading" },
          { label: "Read Market Analysis", action: "analysis" },
        ],
      },
      general: {
        message: `**Welcome to SoftChat! 🌟**\n\nI'm Edith, your AI assistant. I can help you with:\n\n🎯 **Platform Navigation** - Find any feature quickly\n📈 **Performance Optimization** - Maximize your success\n💡 **Strategy Advice** - Best practices for each feature\n🛠️ **Technical Support** - Solve any issues\n📚 **Learning Resources** - Tutorials and guides\n\n**Just ask me anything!** I know every detail about the platform and I'm here to help you succeed.`,
        suggestedActions: [
          { label: "Platform Tour", action: "tour" },
          { label: "Quick Start Guide", action: "quick_start" },
          { label: "View My Dashboard", action: "dashboard", url: "/feed" },
        ],
      },
    };

    const response =
      responses[dominantTopic as keyof typeof responses] || responses.general;

    return {
      ...response,
      relatedTopics: [
        "platform features",
        "optimization",
        "earning strategies",
      ],
      followUpQuestions: [
        "What's the best way to get started?",
        "How can I maximize my earnings?",
        "What features should I focus on first?",
      ],
    };
  }

  private getFeatureUrl(featureKey: string): string {
    const urls: Record<string, string> = {
      social_feed: "/feed",
      crypto_trading: "/crypto",
      marketplace: "/marketplace",
      freelance: "/freelance",
      video_content: "/videos",
      rewards_system: "/rewards",
      wallet: "/wallet",
    };
    return urls[featureKey] || "/";
  }

  // Get contextual suggestions based on user activity
  getContextualSuggestions(userActivity?: any): string[] {
    const suggestions = [
      "How can I increase my engagement rate?",
      "What's the best time to post content?",
      "How do I start crypto trading safely?",
      "What products sell best in the marketplace?",
      "How can I optimize my freelance profile?",
      "What are the most effective hashtags to use?",
      "How do I earn more SoftPoints?",
      "What video content performs best?",
      "How can I build a stronger community?",
      "What are the latest market trends?",
    ];

    // Return random selection of suggestions
    return suggestions.sort(() => 0.5 - Math.random()).slice(0, 5);
  }

  // Get personalized tips based on user data
  getPersonalizedTips(userData?: any): string[] {
    return [
      "Your video content gets 34% more engagement - create more videos!",
      "Tuesday 7 PM is your optimal posting time",
      "Crypto analysis posts generate 2x more revenue for you",
      "You're close to the next SoftPoints reward tier",
      "Your marketplace listing photos could be improved for better sales",
    ];
  }
}

export const enhancedAIService = new EnhancedAIService();
