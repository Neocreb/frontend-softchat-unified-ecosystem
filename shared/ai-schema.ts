import { pgTable, text, timestamp, integer, boolean, uuid, decimal, jsonb, varchar, index } from 'drizzle-orm/pg-core';
import { sql } from 'drizzle-orm';

// AI content analysis results
export const aiContentAnalysis = pgTable('ai_content_analysis', {
  id: uuid('id').defaultRandom().primaryKey(),
  contentType: varchar('content_type', { length: 20 }).notNull(), // post, video, image, comment
  contentId: uuid('content_id').notNull(),
  analysisType: varchar('analysis_type', { length: 30 }).notNull(), // sentiment, moderation, topics, quality
  results: jsonb('results').$type<any>().notNull(),
  confidence: decimal('confidence', { precision: 5, scale: 2 }).notNull(),
  modelVersion: varchar('model_version', { length: 20 }).notNull(),
  processingTime: integer('processing_time'), // milliseconds
  flags: jsonb('flags').$type<string[]>().default([]), // inappropriate, spam, etc.
  score: decimal('score', { precision: 5, scale: 2 }),
  metadata: jsonb('metadata').$type<any>(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
}, (table) => ({
  contentIdx: index('ai_content_analysis_content_idx').on(table.contentType, table.contentId),
  analysisTypeIdx: index('ai_content_analysis_analysis_type_idx').on(table.analysisType),
  createdAtIdx: index('ai_content_analysis_created_at_idx').on(table.createdAt),
}));

// AI recommendation history
export const aiRecommendations = pgTable('ai_recommendations', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id').notNull(),
  recommendationType: varchar('recommendation_type', { length: 30 }).notNull(), // content, users, hashtags, products
  itemType: varchar('item_type', { length: 20 }).notNull(), // video, post, user, product
  itemId: uuid('item_id').notNull(),
  score: decimal('score', { precision: 8, scale: 4 }).notNull(),
  reasons: jsonb('reasons').$type<string[]>().default([]),
  context: varchar('context', { length: 30 }), // feed, explore, search, profile
  position: integer('position'),
  clicked: boolean('clicked').default(false),
  liked: boolean('liked').default(false),
  shared: boolean('shared').default(false),
  watchTime: integer('watch_time'), // seconds, for video content
  engagement: decimal('engagement', { precision: 5, scale: 2 }).default('0.00'),
  modelVersion: varchar('model_version', { length: 20 }).notNull(),
  experimentGroup: varchar('experiment_group', { length: 30 }),
  createdAt: timestamp('created_at').defaultNow().notNull(),
}, (table) => ({
  userIdx: index('ai_recommendations_user_idx').on(table.userId),
  typeIdx: index('ai_recommendations_type_idx').on(table.recommendationType),
  itemIdx: index('ai_recommendations_item_idx').on(table.itemType, table.itemId),
  scoreIdx: index('ai_recommendations_score_idx').on(table.score),
  createdAtIdx: index('ai_recommendations_created_at_idx').on(table.createdAt),
}));

// AI chat conversations
export const aiChatConversations = pgTable('ai_chat_conversations', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id').notNull(),
  title: text('title'),
  assistantType: varchar('assistant_type', { length: 30 }).notNull(), // general, crypto, content, business
  status: varchar('status', { length: 20 }).notNull().default('active'), // active, archived, deleted
  messageCount: integer('message_count').notNull().default(0),
  lastMessageAt: timestamp('last_message_at'),
  context: jsonb('context').$type<any>(), // conversation context and memory
  settings: jsonb('settings').$type<any>(), // user preferences for this conversation
  metadata: jsonb('metadata').$type<any>(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
}, (table) => ({
  userIdx: index('ai_chat_conversations_user_idx').on(table.userId),
  assistantTypeIdx: index('ai_chat_conversations_assistant_type_idx').on(table.assistantType),
  statusIdx: index('ai_chat_conversations_status_idx').on(table.status),
  lastMessageAtIdx: index('ai_chat_conversations_last_message_at_idx').on(table.lastMessageAt),
}));

// AI chat messages
export const aiChatMessages = pgTable('ai_chat_messages', {
  id: uuid('id').defaultRandom().primaryKey(),
  conversationId: uuid('conversation_id').notNull(),
  role: varchar('role', { length: 10 }).notNull(), // user, assistant, system
  content: text('content').notNull(),
  metadata: jsonb('metadata').$type<any>(), // token counts, model info, etc.
  attachments: jsonb('attachments').$type<any>(), // files, images, etc.
  feedback: varchar('feedback', { length: 20 }), // helpful, not_helpful, inappropriate
  edited: boolean('edited').default(false),
  tokenCount: integer('token_count'),
  processingTime: integer('processing_time'), // milliseconds
  modelVersion: varchar('model_version', { length: 20 }),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
}, (table) => ({
  conversationIdx: index('ai_chat_messages_conversation_idx').on(table.conversationId),
  roleIdx: index('ai_chat_messages_role_idx').on(table.role),
  createdAtIdx: index('ai_chat_messages_created_at_idx').on(table.createdAt),
}));

// AI personalization profiles
export const aiPersonalizationProfiles = pgTable('ai_personalization_profiles', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id').notNull().unique(),
  interests: jsonb('interests').$type<any>(), // categorized interests with weights
  preferences: jsonb('preferences').$type<any>(), // content type preferences
  behaviorPattern: jsonb('behavior_pattern').$type<any>(), // usage patterns, active times
  engagementHistory: jsonb('engagement_history').$type<any>(), // aggregated engagement data
  demographicData: jsonb('demographic_data').$type<any>(), // age group, location, etc.
  contentAffinities: jsonb('content_affinities').$type<any>(), // preferred topics, creators
  socialGraph: jsonb('social_graph').$type<any>(), // friend/follower influence
  sessionData: jsonb('session_data').$type<any>(), // recent session patterns
  lastUpdated: timestamp('last_updated').defaultNow().notNull(),
  profileVersion: integer('profile_version').notNull().default(1),
  createdAt: timestamp('created_at').defaultNow().notNull(),
}, (table) => ({
  userIdx: index('ai_personalization_profiles_user_idx').on(table.userId),
  lastUpdatedIdx: index('ai_personalization_profiles_last_updated_idx').on(table.lastUpdated),
}));

// AI content moderation
export const aiContentModeration = pgTable('ai_content_moderation', {
  id: uuid('id').defaultRandom().primaryKey(),
  contentType: varchar('content_type', { length: 20 }).notNull(),
  contentId: uuid('content_id').notNull(),
  moderationResult: varchar('moderation_result', { length: 20 }).notNull(), // approved, flagged, rejected
  flagReasons: jsonb('flag_reasons').$type<string[]>().default([]),
  confidenceScore: decimal('confidence_score', { precision: 5, scale: 2 }).notNull(),
  toxicityScore: decimal('toxicity_score', { precision: 5, scale: 2 }),
  spamScore: decimal('spam_score', { precision: 5, scale: 2 }),
  violenceScore: decimal('violence_score', { precision: 5, scale: 2 }),
  adultScore: decimal('adult_score', { precision: 5, scale: 2 }),
  hateSpeechScore: decimal('hate_speech_score', { precision: 5, scale: 2 }),
  actionTaken: varchar('action_taken', { length: 30 }), // none, warning, hidden, removed
  reviewedBy: uuid('reviewed_by'), // human moderator if reviewed
  reviewedAt: timestamp('reviewed_at'),
  appealStatus: varchar('appeal_status', { length: 20 }), // none, pending, approved, denied
  modelVersion: varchar('model_version', { length: 20 }).notNull(),
  metadata: jsonb('metadata').$type<any>(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
}, (table) => ({
  contentIdx: index('ai_content_moderation_content_idx').on(table.contentType, table.contentId),
  resultIdx: index('ai_content_moderation_result_idx').on(table.moderationResult),
  confidenceIdx: index('ai_content_moderation_confidence_idx').on(table.confidenceScore),
  createdAtIdx: index('ai_content_moderation_created_at_idx').on(table.createdAt),
}));

// AI trend analysis
export const aiTrendAnalysis = pgTable('ai_trend_analysis', {
  id: uuid('id').defaultRandom().primaryKey(),
  trendType: varchar('trend_type', { length: 30 }).notNull(), // hashtag, topic, music, creator
  identifier: text('identifier').notNull(), // hashtag name, topic, etc.
  category: varchar('category', { length: 50 }),
  currentScore: decimal('current_score', { precision: 10, scale: 2 }).notNull(),
  previousScore: decimal('previous_score', { precision: 10, scale: 2 }),
  velocityScore: decimal('velocity_score', { precision: 10, scale: 2 }),
  peakScore: decimal('peak_score', { precision: 10, scale: 2 }),
  engagement: jsonb('engagement').$type<any>(), // likes, shares, comments breakdown
  demographics: jsonb('demographics').$type<any>(), // age, location breakdown
  timeFrame: varchar('time_frame', { length: 20 }).notNull(), // hourly, daily, weekly
  predictions: jsonb('predictions').$type<any>(), // future trend predictions
  relatedTrends: jsonb('related_trends').$type<string[]>().default([]),
  modelVersion: varchar('model_version', { length: 20 }).notNull(),
  calculatedAt: timestamp('calculated_at').defaultNow().notNull(),
}, (table) => ({
  trendTypeIdx: index('ai_trend_analysis_trend_type_idx').on(table.trendType),
  identifierIdx: index('ai_trend_analysis_identifier_idx').on(table.identifier),
  currentScoreIdx: index('ai_trend_analysis_current_score_idx').on(table.currentScore),
  timeFrameIdx: index('ai_trend_analysis_time_frame_idx').on(table.timeFrame),
  calculatedAtIdx: index('ai_trend_analysis_calculated_at_idx').on(table.calculatedAt),
}));

// AI smart notifications
export const aiSmartNotifications = pgTable('ai_smart_notifications', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id').notNull(),
  notificationType: varchar('notification_type', { length: 30 }).notNull(),
  priority: varchar('priority', { length: 10 }).notNull(), // low, medium, high, urgent
  title: text('title').notNull(),
  message: text('message').notNull(),
  data: jsonb('data').$type<any>(),
  personalizedData: jsonb('personalized_data').$type<any>(), // user-specific customizations
  deliveryMethod: jsonb('delivery_method').$type<string[]>(), // push, email, sms, in_app
  optimalSendTime: timestamp('optimal_send_time'),
  actualSendTime: timestamp('actual_send_time'),
  opened: boolean('opened').default(false),
  clicked: boolean('clicked').default(false),
  dismissed: boolean('dismissed').default(false),
  engagementScore: decimal('engagement_score', { precision: 5, scale: 2 }),
  relevanceScore: decimal('relevance_score', { precision: 5, scale: 2 }),
  sentimentScore: decimal('sentiment_score', { precision: 5, scale: 2 }),
  modelVersion: varchar('model_version', { length: 20 }),
  abTestGroup: varchar('ab_test_group', { length: 30 }),
  createdAt: timestamp('created_at').defaultNow().notNull(),
}, (table) => ({
  userIdx: index('ai_smart_notifications_user_idx').on(table.userId),
  typeIdx: index('ai_smart_notifications_type_idx').on(table.notificationType),
  priorityIdx: index('ai_smart_notifications_priority_idx').on(table.priority),
  sendTimeIdx: index('ai_smart_notifications_send_time_idx').on(table.optimalSendTime),
}));

// AI crypto analysis
export const aiCryptoAnalysis = pgTable('ai_crypto_analysis', {
  id: uuid('id').defaultRandom().primaryKey(),
  symbol: varchar('symbol', { length: 20 }).notNull(),
  analysisType: varchar('analysis_type', { length: 30 }).notNull(), // price_prediction, sentiment, market_analysis
  timeframe: varchar('timeframe', { length: 20 }).notNull(), // 1h, 24h, 7d, 30d
  prediction: jsonb('prediction').$type<any>(), // price predictions, trend analysis
  sentiment: varchar('sentiment', { length: 20 }), // bullish, bearish, neutral
  confidenceScore: decimal('confidence_score', { precision: 5, scale: 2 }),
  accuracy: decimal('accuracy', { precision: 5, scale: 2 }), // historical accuracy
  marketFactors: jsonb('market_factors').$type<any>(), // influencing factors
  riskLevel: varchar('risk_level', { length: 20 }), // low, medium, high
  recommendation: varchar('recommendation', { length: 20 }), // buy, sell, hold
  priceAtAnalysis: decimal('price_at_analysis', { precision: 15, scale: 8 }),
  targetPrice: decimal('target_price', { precision: 15, scale: 8 }),
  stopLoss: decimal('stop_loss', { precision: 15, scale: 8 }),
  modelVersion: varchar('model_version', { length: 20 }).notNull(),
  dataSource: varchar('data_source', { length: 30 }),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  expiresAt: timestamp('expires_at'),
}, (table) => ({
  symbolIdx: index('ai_crypto_analysis_symbol_idx').on(table.symbol),
  analysisTypeIdx: index('ai_crypto_analysis_analysis_type_idx').on(table.analysisType),
  timeframeIdx: index('ai_crypto_analysis_timeframe_idx').on(table.timeframe),
  confidenceIdx: index('ai_crypto_analysis_confidence_idx').on(table.confidenceScore),
  createdAtIdx: index('ai_crypto_analysis_created_at_idx').on(table.createdAt),
}));

// AI model performance tracking
export const aiModelPerformance = pgTable('ai_model_performance', {
  id: uuid('id').defaultRandom().primaryKey(),
  modelName: varchar('model_name', { length: 50 }).notNull(),
  modelVersion: varchar('model_version', { length: 20 }).notNull(),
  taskType: varchar('task_type', { length: 30 }).notNull(), // recommendation, moderation, analysis
  accuracy: decimal('accuracy', { precision: 5, scale: 2 }),
  precision: decimal('precision', { precision: 5, scale: 2 }),
  recall: decimal('recall', { precision: 5, scale: 2 }),
  f1Score: decimal('f1_score', { precision: 5, scale, }),
  auc: decimal('auc', { precision: 5, scale: 2 }),
  processingTime: integer('processing_time'), // milliseconds
  throughput: integer('throughput'), // requests per second
  errorRate: decimal('error_rate', { precision: 5, scale: 2 }),
  memoryUsage: integer('memory_usage'), // MB
  cpuUsage: decimal('cpu_usage', { precision: 5, scale: 2 }), // percentage
  testDataset: varchar('test_dataset', { length: 50 }),
  evaluationPeriod: varchar('evaluation_period', { length: 20 }),
  deploymentStatus: varchar('deployment_status', { length: 20 }),
  metadata: jsonb('metadata').$type<any>(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
}, (table) => ({
  modelIdx: index('ai_model_performance_model_idx').on(table.modelName, table.modelVersion),
  taskTypeIdx: index('ai_model_performance_task_type_idx').on(table.taskType),
  accuracyIdx: index('ai_model_performance_accuracy_idx').on(table.accuracy),
  createdAtIdx: index('ai_model_performance_created_at_idx').on(table.createdAt),
}));

// AI user insights
export const aiUserInsights = pgTable('ai_user_insights', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id').notNull(),
  insightType: varchar('insight_type', { length: 30 }).notNull(), // behavior, preference, prediction
  category: varchar('category', { length: 30 }), // content, social, commerce, crypto
  insights: jsonb('insights').$type<any>().notNull(),
  actionableRecommendations: jsonb('actionable_recommendations').$type<any>(),
  confidenceScore: decimal('confidence_score', { precision: 5, scale: 2 }),
  impactScore: decimal('impact_score', { precision: 5, scale: 2 }),
  timeframe: varchar('timeframe', { length: 20 }), // daily, weekly, monthly
  validUntil: timestamp('valid_until'),
  applied: boolean('applied').default(false),
  effectiveness: decimal('effectiveness', { precision: 5, scale: 2 }),
  modelVersion: varchar('model_version', { length: 20 }),
  createdAt: timestamp('created_at').defaultNow().notNull(),
}, (table) => ({
  userIdx: index('ai_user_insights_user_idx').on(table.userId),
  insightTypeIdx: index('ai_user_insights_insight_type_idx').on(table.insightType),
  categoryIdx: index('ai_user_insights_category_idx').on(table.category),
  confidenceIdx: index('ai_user_insights_confidence_idx').on(table.confidenceScore),
  validUntilIdx: index('ai_user_insights_valid_until_idx').on(table.validUntil),
}));
