import express from "express";
import { z } from "zod";
import { eq, and, or, desc, asc, sql, like, inArray, count, gte, lte } from "drizzle-orm";
import { db } from "../db";
import {
  authenticateToken,
  requireRole,
  createRateLimitMiddleware,
  AppError,
} from "../config/security";
import {
  aiContentAnalysis,
  aiRecommendations,
  semanticSearch,
  voiceAnalysis,
  imageAnalysis,
  videoAnalysis,
  nlpProcessing,
  sentimentAnalysis,
  spamDetection,
  fraudDetection,
  aiGeneratedContent,
  userEngagementPatterns,
  contentPerformancePredictions,
  marketAnalysis,
} from "../../shared/enhanced-schema";
import { users, profiles, posts, videos } from "../../shared/schema";

const router = express.Router();

// Rate limiters
const aiLimiter = createRateLimitMiddleware(50); // 50 AI requests per 15 minutes
const analysisLimiter = createRateLimitMiddleware(20); // 20 analysis requests per 15 minutes
const chatLimiter = createRateLimitMiddleware(100); // 100 chat messages per 15 minutes

// Validation schemas
const chatMessageSchema = z.object({
  message: z.string().min(1).max(2000),
  conversationId: z.string().uuid().optional(),
  context: z.object({
    type: z.enum(['general', 'crypto', 'freelance', 'marketplace', 'platform']).optional(),
    data: z.record(z.any()).optional(),
  }).optional(),
  personality: z.enum(['helpful', 'professional', 'casual', 'expert']).default('helpful'),
});

const contentAnalysisSchema = z.object({
  content: z.string().min(1).max(10000),
  contentType: z.enum(['text', 'image', 'video', 'audio']),
  analysisType: z.array(z.enum([
    'sentiment',
    'toxicity',
    'spam',
    'quality',
    'engagement_prediction',
    'trending_potential',
    'content_categories',
    'language_detection',
    'adult_content',
    'violence',
    'hate_speech',
    'misinformation'
  ])),
  metadata: z.record(z.any()).optional(),
});

const recommendationSchema = z.object({
  type: z.enum(['content', 'users', 'products', 'hashtags', 'music', 'places']),
  context: z.object({
    currentContent: z.string().optional(),
    userInterests: z.array(z.string()).optional(),
    recentActivity: z.array(z.string()).optional(),
    demographic: z.record(z.any()).optional(),
  }).optional(),
  limit: z.number().min(1).max(50).default(10),
  filters: z.record(z.any()).optional(),
});

const priceAnalysisSchema = z.object({
  asset: z.string(),
  timeframe: z.enum(['1h', '4h', '1d', '1w', '1m']).default('1d'),
  indicators: z.array(z.enum([
    'sma', 'ema', 'rsi', 'macd', 'bollinger_bands',
    'support_resistance', 'trend_analysis', 'volatility'
  ])).optional(),
  includeNews: z.boolean().default(true),
  includeSentiment: z.boolean().default(true),
});

// =============================================================================
// AI CHAT ASSISTANT
// =============================================================================

/**
 * POST /api/ai/chat
 * Chat with AI assistant
 */
router.post("/chat", authenticateToken, chatLimiter, async (req, res, next) => {
  try {
    const userId = req.user!.userId;
    const chatData = chatMessageSchema.parse(req.body);

    // Get or create conversation
    let conversationId = chatData.conversationId;
    if (!conversationId) {
      const [conversation] = await db
        .insert(aiConversations)
        .values({
          userId,
          title: chatData.message.substring(0, 50) + '...',
          personality: chatData.personality,
          context: chatData.context,
        })
        .returning();
      conversationId = conversation.id;
    }

    // Store user message
    await db.insert(aiMessages).values({
      conversationId,
      role: 'user',
      content: chatData.message,
      metadata: {
        timestamp: new Date().toISOString(),
        context: chatData.context,
      },
    });

    // Generate AI response
    const aiResponse = await generateAIResponse({
      message: chatData.message,
      context: chatData.context,
      personality: chatData.personality,
      userId,
      conversationHistory: await getConversationHistory(conversationId),
    });

    // Store AI response
    const [aiMessage] = await db
      .insert(aiMessages)
      .values({
        conversationId,
        role: 'assistant',
        content: aiResponse.content,
        metadata: {
          confidence: aiResponse.confidence,
          processingTime: aiResponse.processingTime,
          model: aiResponse.model,
          context: chatData.context,
        },
      })
      .returning();

    // Update conversation
    await db
      .update(aiConversations)
      .set({
        lastMessageAt: new Date(),
        messageCount: sql`message_count + 2`,
        updatedAt: new Date(),
      })
      .where(eq(aiConversations.id, conversationId));

    res.json({
      success: true,
      conversationId,
      response: {
        id: aiMessage.id,
        content: aiResponse.content,
        confidence: aiResponse.confidence,
        suggestions: aiResponse.suggestions,
        actions: aiResponse.actions,
        createdAt: aiMessage.createdAt,
      },
    });
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/ai/conversations
 * Get user's AI conversation history
 */
router.get("/conversations", authenticateToken, async (req, res, next) => {
  try {
    const userId = req.user!.userId;
    const { limit = 20, offset = 0 } = req.query;

    const conversations = await db
      .select({
        id: aiConversations.id,
        title: aiConversations.title,
        personality: aiConversations.personality,
        messageCount: aiConversations.messageCount,
        lastMessageAt: aiConversations.lastMessageAt,
        createdAt: aiConversations.createdAt,
        lastMessage: sql<string>`(
          SELECT content FROM ai_messages 
          WHERE conversation_id = ${aiConversations.id} 
          ORDER BY created_at DESC 
          LIMIT 1
        )`,
      })
      .from(aiConversations)
      .where(eq(aiConversations.userId, userId))
      .orderBy(desc(aiConversations.lastMessageAt))
      .limit(parseInt(limit as string))
      .offset(parseInt(offset as string));

    res.json({
      success: true,
      conversations,
      pagination: {
        limit: parseInt(limit as string),
        offset: parseInt(offset as string),
        hasMore: conversations.length === parseInt(limit as string),
      },
    });
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/ai/conversations/:conversationId/messages
 * Get messages from a specific conversation
 */
router.get("/conversations/:conversationId/messages", authenticateToken, async (req, res, next) => {
  try {
    const userId = req.user!.userId;
    const { conversationId } = req.params;
    const { limit = 50, offset = 0 } = req.query;

    // Verify conversation ownership
    const [conversation] = await db
      .select()
      .from(aiConversations)
      .where(
        and(
          eq(aiConversations.id, conversationId),
          eq(aiConversations.userId, userId)
        )
      )
      .limit(1);

    if (!conversation) {
      throw new AppError("Conversation not found", 404);
    }

    const messages = await db
      .select({
        id: aiMessages.id,
        role: aiMessages.role,
        content: aiMessages.content,
        metadata: aiMessages.metadata,
        createdAt: aiMessages.createdAt,
      })
      .from(aiMessages)
      .where(eq(aiMessages.conversationId, conversationId))
      .orderBy(asc(aiMessages.createdAt))
      .limit(parseInt(limit as string))
      .offset(parseInt(offset as string));

    res.json({
      success: true,
      conversation,
      messages,
      pagination: {
        limit: parseInt(limit as string),
        offset: parseInt(offset as string),
        hasMore: messages.length === parseInt(limit as string),
      },
    });
  } catch (error) {
    next(error);
  }
});

// =============================================================================
// CONTENT ANALYSIS & MODERATION
// =============================================================================

/**
 * POST /api/ai/analyze-content
 * Analyze content for various metrics
 */
router.post("/analyze-content", authenticateToken, analysisLimiter, async (req, res, next) => {
  try {
    const userId = req.user!.userId;
    const analysisData = contentAnalysisSchema.parse(req.body);

    const analysis = await analyzeContent({
      content: analysisData.content,
      contentType: analysisData.contentType,
      analysisTypes: analysisData.analysisType,
      metadata: analysisData.metadata,
    });

    // Store analysis results
    const [analysisRecord] = await db
      .insert(contentAnalysis)
      .values({
        userId,
        contentType: analysisData.contentType,
        content: analysisData.content.substring(0, 1000), // Truncate for storage
        analysisTypes: analysisData.analysisType,
        results: analysis.results,
        confidence: analysis.confidence,
        flags: analysis.flags,
        recommendations: analysis.recommendations,
        metadata: analysisData.metadata,
      })
      .returning();

    // Check for content violations
    if (analysis.flags && analysis.flags.length > 0) {
      for (const flag of analysis.flags) {
        await db.insert(contentModerationLogs).values({
          contentId: analysisRecord.id,
          contentType: analysisData.contentType,
          userId,
          flagType: flag.type,
          flagReason: flag.reason,
          confidence: flag.confidence,
          severity: flag.severity,
          status: 'pending_review',
          metadata: flag.metadata,
        });
      }
    }

    res.json({
      success: true,
      analysis: {
        id: analysisRecord.id,
        results: analysis.results,
        confidence: analysis.confidence,
        flags: analysis.flags,
        recommendations: analysis.recommendations,
        safeToPublish: analysis.flags.length === 0 || 
          !analysis.flags.some(f => f.severity === 'high'),
      },
    });
  } catch (error) {
    next(error);
  }
});

/**
 * POST /api/ai/moderate-content
 * Automated content moderation
 */
router.post("/moderate-content", authenticateToken, async (req, res, next) => {
  try {
    const { contentId, contentType, action, reason } = req.body;
    const userId = req.user!.userId;

    // Get content analysis
    const [analysis] = await db
      .select()
      .from(contentAnalysis)
      .where(eq(contentAnalysis.id, contentId))
      .limit(1);

    if (!analysis) {
      throw new AppError("Content analysis not found", 404);
    }

    // Record moderation action
    const moderationResult = await performModerationAction({
      contentId,
      contentType,
      action,
      reason,
      userId,
      analysis: analysis.results,
    });

    // Update moderation log
    await db
      .update(contentModerationLogs)
      .set({
        status: moderationResult.status,
        moderatedBy: userId,
        moderatedAt: new Date(),
        moderationAction: action,
        moderationReason: reason,
        metadata: {
          ...moderationResult.metadata,
          automated: true,
        },
      })
      .where(
        and(
          eq(contentModerationLogs.contentId, contentId),
          eq(contentModerationLogs.contentType, contentType)
        )
      );

    res.json({
      success: true,
      moderationResult,
      message: `Content ${action} successfully`,
    });
  } catch (error) {
    next(error);
  }
});

// =============================================================================
// SMART RECOMMENDATIONS
// =============================================================================

/**
 * POST /api/ai/recommendations
 * Get AI-powered recommendations
 */
router.post("/recommendations", authenticateToken, aiLimiter, async (req, res, next) => {
  try {
    const userId = req.user!.userId;
    const recData = recommendationSchema.parse(req.body);

    // Get user profile and preferences
    const [userProfile] = await db
      .select()
      .from(userPreferences)
      .where(eq(userPreferences.userId, userId))
      .limit(1);

    // Get user behavior data
    const behaviorData = await getUserBehaviorData(userId);

    // Generate recommendations
    const recommendations = await generateRecommendations({
      userId,
      type: recData.type,
      context: recData.context,
      userProfile,
      behaviorData,
      limit: recData.limit,
      filters: recData.filters,
    });

    // Store recommendation for analytics
    await db.insert(aiRecommendations).values({
      userId,
      type: recData.type,
      recommendations: recommendations.items,
      context: recData.context,
      confidence: recommendations.confidence,
      algorithm: recommendations.algorithm,
      metadata: {
        requestedAt: new Date().toISOString(),
        filters: recData.filters,
      },
    });

    res.json({
      success: true,
      recommendations: recommendations.items,
      confidence: recommendations.confidence,
      algorithm: recommendations.algorithm,
      refreshedAt: new Date().toISOString(),
    });
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/ai/feed-curation
 * Get AI-curated feed for user
 */
router.get("/feed-curation", authenticateToken, async (req, res, next) => {
  try {
    const userId = req.user!.userId;
    const { type = 'for_you', limit = 20, refresh = false } = req.query;

    // Check for cached curation
    if (!refresh) {
      const [cachedCuration] = await db
        .select()
        .from(feedCuration)
        .where(
          and(
            eq(feedCuration.userId, userId),
            eq(feedCuration.feedType, type as string),
            gte(feedCuration.createdAt, sql`NOW() - INTERVAL '1 hour'`)
          )
        )
        .orderBy(desc(feedCuration.createdAt))
        .limit(1);

      if (cachedCuration) {
        return res.json({
          success: true,
          feed: cachedCuration.contentIds,
          algorithm: cachedCuration.algorithm,
          confidence: cachedCuration.confidence,
          cached: true,
          generatedAt: cachedCuration.createdAt,
        });
      }
    }

    // Generate new feed curation
    const curation = await curateFeed({
      userId,
      feedType: type as string,
      limit: parseInt(limit as string),
    });

    // Store curation
    await db.insert(feedCuration).values({
      userId,
      feedType: type as string,
      contentIds: curation.contentIds,
      algorithm: curation.algorithm,
      confidence: curation.confidence,
      metadata: {
        generatedAt: new Date().toISOString(),
        factors: curation.factors,
      },
    });

    res.json({
      success: true,
      feed: curation.contentIds,
      algorithm: curation.algorithm,
      confidence: curation.confidence,
      cached: false,
      generatedAt: new Date().toISOString(),
    });
  } catch (error) {
    next(error);
  }
});

// =============================================================================
// CRYPTO PRICE ANALYSIS & PREDICTIONS
// =============================================================================

/**
 * POST /api/ai/crypto-analysis
 * Get AI-powered crypto price analysis
 */
router.post("/crypto-analysis", authenticateToken, analysisLimiter, async (req, res, next) => {
  try {
    const userId = req.user!.userId;
    const analysisData = priceAnalysisSchema.parse(req.body);

    // Check for recent analysis
    const [recentAnalysis] = await db
      .select()
      .from(pricesPredictions)
      .where(
        and(
          eq(pricesPredictions.asset, analysisData.asset),
          eq(pricesPredictions.timeframe, analysisData.timeframe),
          gte(pricesPredictions.createdAt, sql`NOW() - INTERVAL '15 minutes'`)
        )
      )
      .orderBy(desc(pricesPredictions.createdAt))
      .limit(1);

    if (recentAnalysis) {
      return res.json({
        success: true,
        analysis: recentAnalysis,
        cached: true,
      });
    }

    // Generate new analysis
    const analysis = await analyzeCryptoPrice({
      asset: analysisData.asset,
      timeframe: analysisData.timeframe,
      indicators: analysisData.indicators,
      includeNews: analysisData.includeNews,
      includeSentiment: analysisData.includeSentiment,
    });

    // Store analysis
    const [storedAnalysis] = await db
      .insert(pricesPredictions)
      .values({
        asset: analysisData.asset,
        timeframe: analysisData.timeframe,
        currentPrice: analysis.currentPrice,
        predictedPrice: analysis.predictedPrice,
        confidence: analysis.confidence,
        direction: analysis.direction,
        technicalAnalysis: analysis.technicalAnalysis,
        sentimentAnalysis: analysis.sentimentAnalysis,
        newsAnalysis: analysis.newsAnalysis,
        riskFactors: analysis.riskFactors,
        indicators: analysis.indicators,
        metadata: {
          model: analysis.model,
          dataPoints: analysis.dataPoints,
          lastUpdated: new Date().toISOString(),
        },
      })
      .returning();

    res.json({
      success: true,
      analysis: storedAnalysis,
      cached: false,
    });
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/ai/trending-analysis
 * Get trending content analysis
 */
router.get("/trending-analysis", authenticateToken, async (req, res, next) => {
  try {
    const { period = '24h', category = 'all' } = req.query;

    // Get latest trending analysis
    const [analysis] = await db
      .select()
      .from(trendingAnalysis)
      .where(
        and(
          eq(trendingAnalysis.period, period as string),
          eq(trendingAnalysis.category, category as string),
          gte(trendingAnalysis.createdAt, sql`NOW() - INTERVAL '1 hour'`)
        )
      )
      .orderBy(desc(trendingAnalysis.createdAt))
      .limit(1);

    if (!analysis) {
      // Generate new trending analysis
      const newAnalysis = await analyzeTrending({
        period: period as string,
        category: category as string,
      });

      const [storedAnalysis] = await db
        .insert(trendingAnalysis)
        .values({
          period: period as string,
          category: category as string,
          trendingTopics: newAnalysis.topics,
          trendingHashtags: newAnalysis.hashtags,
          trendingUsers: newAnalysis.users,
          emergingTrends: newAnalysis.emerging,
          viralContent: newAnalysis.viral,
          insights: newAnalysis.insights,
          confidence: newAnalysis.confidence,
          metadata: {
            analysisModel: newAnalysis.model,
            dataPoints: newAnalysis.dataPoints,
          },
        })
        .returning();

      return res.json({
        success: true,
        analysis: storedAnalysis,
        cached: false,
      });
    }

    res.json({
      success: true,
      analysis,
      cached: true,
    });
  } catch (error) {
    next(error);
  }
});

// =============================================================================
// AI HELPER FUNCTIONS
// =============================================================================

async function generateAIResponse(params: {
  message: string;
  context?: any;
  personality: string;
  userId: string;
  conversationHistory: any[];
}) {
  // This would integrate with actual AI models (OpenAI, Claude, etc.)
  // For now, returning mock responses based on context

  const { message, context, personality, conversationHistory } = params;
  
  // Analyze message intent
  const intent = analyzeMessageIntent(message);
  
  // Generate contextual response
  let response = '';
  let confidence = 0.8;
  let suggestions: string[] = [];
  let actions: any[] = [];

  // Context-aware responses
  if (context?.type === 'crypto') {
    response = generateCryptoResponse(message, intent);
    suggestions = ['Check price predictions', 'View portfolio', 'Set price alerts'];
  } else if (context?.type === 'freelance') {
    response = generateFreelanceResponse(message, intent);
    suggestions = ['Browse jobs', 'Update profile', 'View earnings'];
  } else if (context?.type === 'marketplace') {
    response = generateMarketplaceResponse(message, intent);
    suggestions = ['Browse products', 'Check orders', 'Seller dashboard'];
  } else {
    response = generateGeneralResponse(message, intent, personality);
    suggestions = ['How can I help?', 'Tell me more', 'Show me options'];
  }

  // Add personality adjustments
  response = adjustForPersonality(response, personality);

  return {
    content: response,
    confidence,
    suggestions,
    actions,
    model: 'softchat-ai-v1',
    processingTime: Math.random() * 1000 + 500, // Mock processing time
  };
}

function analyzeMessageIntent(message: string) {
  const lowerMessage = message.toLowerCase();
  
  if (lowerMessage.includes('price') || lowerMessage.includes('cost')) {
    return 'price_inquiry';
  } else if (lowerMessage.includes('help') || lowerMessage.includes('how')) {
    return 'help_request';
  } else if (lowerMessage.includes('job') || lowerMessage.includes('work')) {
    return 'job_inquiry';
  } else if (lowerMessage.includes('buy') || lowerMessage.includes('sell')) {
    return 'transaction_intent';
  }
  
  return 'general_conversation';
}

function generateCryptoResponse(message: string, intent: string) {
  const responses = {
    price_inquiry: "I can help you check current crypto prices and provide market analysis. Would you like me to show you price predictions for a specific cryptocurrency?",
    help_request: "I can assist with crypto trading, portfolio management, and market analysis. What would you like to know about?",
    transaction_intent: "I can help you understand trading options and market conditions. Remember to always do your own research before making investment decisions.",
  };
  
  return responses[intent as keyof typeof responses] || "I'm here to help with all your crypto-related questions. What would you like to know?";
}

function generateFreelanceResponse(message: string, intent: string) {
  const responses = {
    job_inquiry: "I can help you find freelance opportunities or assist with your projects. Are you looking for work or hiring talent?",
    help_request: "I can guide you through creating proposals, managing projects, or optimizing your freelancer profile. What do you need help with?",
    price_inquiry: "I can help you understand market rates for different skills and provide pricing guidance for your services.",
  };
  
  return responses[intent as keyof typeof responses] || "I'm here to help with your freelancing journey. Whether you're a client or freelancer, I can assist you!";
}

function generateMarketplaceResponse(message: string, intent: string) {
  const responses = {
    help_request: "I can help you navigate the marketplace, whether you're buying or selling. What do you need assistance with?",
    price_inquiry: "I can help you find competitive pricing or understand market trends for products you're interested in.",
    transaction_intent: "I can guide you through the buying or selling process and explain our secure escrow system.",
  };
  
  return responses[intent as keyof typeof responses] || "I'm here to help with all your marketplace needs. Are you looking to buy or sell something?";
}

function generateGeneralResponse(message: string, intent: string, personality: string) {
  const responses = {
    help_request: "I'm here to help! I can assist with crypto trading, freelance work, marketplace activities, and general platform questions.",
    general_conversation: "Thanks for reaching out! I'm your AI assistant and I'm here to help with anything you need on the platform.",
  };
  
  return responses[intent as keyof typeof responses] || "Hello! I'm your AI assistant. How can I help you today?";
}

function adjustForPersonality(response: string, personality: string) {
  switch (personality) {
    case 'professional':
      return response.replace(/!/g, '.').replace(/I'm/g, 'I am');
    case 'casual':
      return response + " 😊";
    case 'expert':
      return "As an expert, " + response.toLowerCase();
    default:
      return response;
  }
}

async function getConversationHistory(conversationId: string) {
  return await db
    .select()
    .from(aiMessages)
    .where(eq(aiMessages.conversationId, conversationId))
    .orderBy(desc(aiMessages.createdAt))
    .limit(10);
}

async function analyzeContent(params: {
  content: string;
  contentType: string;
  analysisTypes: string[];
  metadata?: any;
}) {
  // Mock content analysis - in production this would use ML models
  const results: any = {};
  const flags: any[] = [];
  const recommendations: string[] = [];
  
  // Sentiment analysis
  if (params.analysisTypes.includes('sentiment')) {
    results.sentiment = {
      score: Math.random() * 2 - 1, // -1 to 1
      label: Math.random() > 0.5 ? 'positive' : 'negative',
      confidence: Math.random() * 0.5 + 0.5,
    };
  }
  
  // Toxicity detection
  if (params.analysisTypes.includes('toxicity')) {
    const toxicityScore = Math.random();
    results.toxicity = {
      score: toxicityScore,
      label: toxicityScore > 0.7 ? 'toxic' : 'clean',
      confidence: Math.random() * 0.3 + 0.7,
    };
    
    if (toxicityScore > 0.7) {
      flags.push({
        type: 'toxicity',
        reason: 'Content may contain toxic language',
        confidence: toxicityScore,
        severity: 'high',
        metadata: { score: toxicityScore },
      });
    }
  }
  
  // Quality assessment
  if (params.analysisTypes.includes('quality')) {
    results.quality = {
      score: Math.random() * 0.5 + 0.5, // 0.5 to 1
      factors: ['grammar', 'relevance', 'engagement_potential'],
      confidence: Math.random() * 0.3 + 0.7,
    };
  }
  
  return {
    results,
    flags,
    recommendations,
    confidence: Math.random() * 0.3 + 0.7,
  };
}

// Mock functions - these would be implemented with actual AI/ML services
async function performModerationAction(params: any) {
  return {
    status: 'moderated',
    metadata: { automated: true },
  };
}

async function getUserBehaviorData(userId: string) {
  return {};
}

async function generateRecommendations(params: any) {
  return {
    items: [],
    confidence: 0.8,
    algorithm: 'collaborative_filtering',
  };
}

async function curateFeed(params: any) {
  return {
    contentIds: [],
    algorithm: 'personalized_ranking',
    confidence: 0.8,
    factors: ['engagement', 'recency', 'relevance'],
  };
}

async function analyzeCryptoPrice(params: any) {
  return {
    currentPrice: 50000,
    predictedPrice: 52000,
    confidence: 0.75,
    direction: 'up',
    technicalAnalysis: {},
    sentimentAnalysis: {},
    newsAnalysis: {},
    riskFactors: [],
    indicators: {},
    model: 'price_prediction_v1',
    dataPoints: 1000,
  };
}

async function analyzeTrending(params: any) {
  return {
    topics: [],
    hashtags: [],
    users: [],
    emerging: [],
    viral: [],
    insights: [],
    confidence: 0.8,
    model: 'trending_analysis_v1',
    dataPoints: 10000,
  };
}

export default router;
