import {
  pgTable,
  text,
  serial,
  integer,
  boolean,
  timestamp,
  uuid,
  decimal,
  jsonb,
  unique,
  index,
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { users } from "./schema";

// =============================================================================
// LIVE STREAMING SESSIONS (General Live Streams)
// =============================================================================

export const liveSessions = pgTable("live_sessions", {
  id: uuid("id").primaryKey().defaultRandom(),
  creatorId: uuid("creator_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  
  // Session details
  title: text("title").notNull(),
  description: text("description"),
  category: text("category"), // 'gaming', 'music', 'talk', 'education', etc.
  
  // Stream configuration
  maxParticipants: integer("max_participants").default(6),
  currentParticipants: integer("current_participants").default(1),
  isPrivate: boolean("is_private").default(false),
  requiresApproval: boolean("requires_approval").default(false),
  
  // Technical details
  streamUrl: text("stream_url"),
  streamKey: text("stream_key"),
  quality: text("quality").default("720p"), // '480p', '720p', '1080p'
  
  // Session status
  status: text("status").default("waiting"), // 'waiting', 'live', 'ended', 'cancelled'
  startedAt: timestamp("started_at"),
  endedAt: timestamp("ended_at"),
  
  // Statistics
  peakViewers: integer("peak_viewers").default(0),
  totalViews: integer("total_views").default(0),
  totalLikes: integer("total_likes").default(0),
  totalGifts: integer("total_gifts").default(0),
  totalGiftValue: decimal("total_gift_value", { precision: 20, scale: 2 }).default("0"),
  
  // Monetization
  enableGifts: boolean("enable_gifts").default(true),
  enableTips: boolean("enable_tips").default(true),
  minimumTip: decimal("minimum_tip", { precision: 10, scale: 2 }).default("1.00"),
  
  // Moderation
  chatEnabled: boolean("chat_enabled").default(true),
  moderatedChat: boolean("moderated_chat").default(false),
  bannedWords: jsonb("banned_words"), // Array of banned words
  
  // Recording and highlights
  recordSession: boolean("record_session").default(false),
  recordingUrl: text("recording_url"),
  highlightClips: jsonb("highlight_clips"), // Array of highlight timestamps
  
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// =============================================================================
// LIVE SESSION PARTICIPANTS
// =============================================================================

export const liveSessionParticipants = pgTable("live_session_participants", {
  id: uuid("id").primaryKey().defaultRandom(),
  sessionId: uuid("session_id")
    .notNull()
    .references(() => liveSessions.id, { onDelete: "cascade" }),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  
  // Participant role and permissions
  role: text("role").notNull(), // 'host', 'co-host', 'guest', 'viewer'
  canSpeak: boolean("can_speak").default(false),
  canVideo: boolean("can_video").default(false),
  canInvite: boolean("can_invite").default(false),
  canModerate: boolean("can_moderate").default(false),
  
  // Current status
  isActive: boolean("is_active").default(true),
  micEnabled: boolean("mic_enabled").default(true),
  videoEnabled: boolean("video_enabled").default(true),
  
  // Participation stats
  joinedAt: timestamp("joined_at").defaultNow(),
  leftAt: timestamp("left_at"),
  totalSpeakTime: integer("total_speak_time").default(0), // seconds
  messagesCount: integer("messages_count").default(0),
  
  createdAt: timestamp("created_at").defaultNow(),
});

// =============================================================================
// LIVE CHAT MESSAGES
// =============================================================================

export const liveChatMessages = pgTable("live_chat_messages", {
  id: uuid("id").primaryKey().defaultRandom(),
  sessionId: uuid("session_id")
    .notNull()
    .references(() => liveSessions.id, { onDelete: "cascade" }),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  
  // Message content
  message: text("message").notNull(),
  messageType: text("message_type").default("text"), // 'text', 'emoji', 'sticker', 'system'
  
  // Message metadata
  isSystemMessage: boolean("is_system_message").default(false),
  isPinned: boolean("is_pinned").default(false),
  isDeleted: boolean("is_deleted").default(false),
  deletedBy: uuid("deleted_by").references(() => users.id),
  deleteReason: text("delete_reason"),
  
  // Reply functionality
  replyToMessageId: uuid("reply_to_message_id").references(() => liveChatMessages.id),
  
  // Moderation
  isModerated: boolean("is_moderated").default(false),
  moderatedBy: uuid("moderated_by").references(() => users.id),
  moderationReason: text("moderation_reason"),
  
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// =============================================================================
// GIFT TYPES CATALOG
// =============================================================================

export const giftTypes = pgTable("gift_types", {
  id: uuid("id").primaryKey().defaultRandom(),
  
  // Gift details
  name: text("name").notNull(),
  emoji: text("emoji").notNull(),
  description: text("description"),
  
  // Pricing and rarity
  softPointsValue: decimal("soft_points_value", { precision: 10, scale: 2 }).notNull(),
  rarity: text("rarity").notNull(), // 'common', 'rare', 'epic', 'legendary'
  color: text("color"), // CSS color class
  
  // Gift behavior
  hasAnimation: boolean("has_animation").default(false),
  animationType: text("animation_type"), // 'sparkle', 'fireworks', 'hearts', etc.
  soundEffect: text("sound_effect"),
  comboMultiplier: decimal("combo_multiplier", { precision: 3, scale: 2 }).default("1.00"),
  
  // Availability
  isActive: boolean("is_active").default(true),
  isLimited: boolean("is_limited").default(false),
  limitedUntil: timestamp("limited_until"),
  requiresMinimumTier: text("requires_minimum_tier"), // Minimum creator tier to receive
  
  // Special effects
  addsToScore: boolean("adds_to_score").default(true), // For battles
  scoreMultiplier: decimal("score_multiplier", { precision: 3, scale: 2 }).default("1.00"),
  
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// =============================================================================
// LIVE GIFTS (Sent during streams/battles)
// =============================================================================

export const liveGifts = pgTable("live_gifts", {
  id: uuid("id").primaryKey().defaultRandom(),
  sessionId: uuid("session_id")
    .notNull()
    .references(() => liveSessions.id, { onDelete: "cascade" }),
  giftTypeId: uuid("gift_type_id")
    .notNull()
    .references(() => giftTypes.id),
  
  // Gift transaction
  senderId: uuid("sender_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  recipientId: uuid("recipient_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  
  // Gift details
  quantity: integer("quantity").default(1),
  totalValue: decimal("total_value", { precision: 10, scale: 2 }).notNull(),
  
  // Combo system
  isCombo: boolean("is_combo").default(false),
  comboCount: integer("combo_count").default(1),
  comboMultiplier: decimal("combo_multiplier", { precision: 3, scale: 2 }).default("1.00"),
  
  // Message associated with gift
  message: text("message"),
  isAnonymous: boolean("is_anonymous").default(false),
  
  // Battle-specific (if in battle)
  battleId: uuid("battle_id"), // Reference to live_battles table
  addedToScore: decimal("added_to_score", { precision: 10, scale: 2 }).default("0"),
  
  createdAt: timestamp("created_at").defaultNow(),
});

// =============================================================================
// BATTLE VOTES (SoftPoints Voting System)
// =============================================================================

export const battleVotes = pgTable("battle_votes", {
  id: uuid("id").primaryKey().defaultRandom(),
  battleId: uuid("battle_id")
    .notNull()
    .references(() => liveSessions.id, { onDelete: "cascade" }), // Battles are also live sessions
  voterId: uuid("voter_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  
  // Vote details
  votedFor: uuid("voted_for")
    .notNull()
    .references(() => users.id), // Which participant they voted for
  amountSP: decimal("amount_sp", { precision: 10, scale: 2 }).notNull(),
  
  // Odds and potential payout
  oddsAtTimeOfVote: decimal("odds_at_time_of_vote", { precision: 5, scale: 2 }),
  potentialPayout: decimal("potential_payout", { precision: 10, scale: 2 }),
  
  // Vote status and result
  status: text("status").default("active"), // 'active', 'won', 'lost', 'refunded'
  actualPayout: decimal("actual_payout", { precision: 10, scale: 2 }).default("0"),
  
  // Voting metadata
  votingRound: integer("voting_round").default(1), // For multi-round battles
  confidence: text("confidence"), // 'low', 'medium', 'high'
  
  createdAt: timestamp("created_at").defaultNow(),
  processedAt: timestamp("processed_at"),
});

// =============================================================================
// LIVE SESSION ANALYTICS
// =============================================================================

export const liveSessionAnalytics = pgTable("live_session_analytics", {
  id: uuid("id").primaryKey().defaultRandom(),
  sessionId: uuid("session_id")
    .notNull()
    .references(() => liveSessions.id, { onDelete: "cascade" }),
  
  // Engagement metrics
  averageViewTime: integer("average_view_time"), // seconds
  chatMessagesPerMinute: decimal("chat_messages_per_minute", { precision: 5, scale: 2 }),
  giftsPerMinute: decimal("gifts_per_minute", { precision: 5, scale: 2 }),
  likesPerMinute: decimal("likes_per_minute", { precision: 5, scale: 2 }),
  
  // Audience analytics
  uniqueViewers: integer("unique_viewers"),
  returningViewers: integer("returning_viewers"),
  newFollowers: integer("new_followers"),
  peakConcurrentViewers: integer("peak_concurrent_viewers"),
  
  // Geographic and demographic data
  topCountries: jsonb("top_countries"), // Array of country stats
  ageDistribution: jsonb("age_distribution"), // Age bracket statistics
  genderDistribution: jsonb("gender_distribution"),
  
  // Revenue analytics
  totalRevenue: decimal("total_revenue", { precision: 10, scale: 2 }).default("0"),
  revenueFromGifts: decimal("revenue_from_gifts", { precision: 10, scale: 2 }).default("0"),
  revenueFromTips: decimal("revenue_from_tips", { precision: 10, scale: 2 }).default("0"),
  topGifters: jsonb("top_gifters"), // Top gift senders
  
  // Performance metrics
  streamQuality: text("stream_quality"), // 'excellent', 'good', 'fair', 'poor'
  bufferingEvents: integer("buffering_events").default(0),
  disconnections: integer("disconnections").default(0),
  averageLatency: integer("average_latency"), // milliseconds
  
  // Battle-specific analytics (if applicable)
  votingParticipation: decimal("voting_participation", { precision: 5, scale: 2 }), // percentage
  totalVotingPool: decimal("total_voting_pool", { precision: 10, scale: 2 }),
  averageVoteAmount: decimal("average_vote_amount", { precision: 10, scale: 2 }),
  
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// =============================================================================
// CREATOR RANKINGS (Weekly/Monthly Leaderboards)
// =============================================================================

export const creatorRankings = pgTable("creator_rankings", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  
  // Ranking period
  rankingType: text("ranking_type").notNull(), // 'weekly', 'monthly', 'all_time'
  periodStart: timestamp("period_start").notNull(),
  periodEnd: timestamp("period_end").notNull(),
  
  // Rankings
  overallRank: integer("overall_rank"),
  categoryRank: integer("category_rank"),
  category: text("category"), // 'gaming', 'music', 'talk', etc.
  
  // Metrics for ranking
  totalStreams: integer("total_streams").default(0),
  totalViewers: integer("total_viewers").default(0),
  totalWatchTime: integer("total_watch_time").default(0), // minutes
  totalRevenue: decimal("total_revenue", { precision: 15, scale: 2 }).default("0"),
  
  // Engagement metrics
  averageViewerCount: decimal("average_viewer_count", { precision: 8, scale: 2 }),
  engagementRate: decimal("engagement_rate", { precision: 5, scale: 2 }), // likes + comments / views
  chatActivity: decimal("chat_activity", { precision: 8, scale: 2 }), // messages per stream
  
  // Battle-specific metrics
  battlesWon: integer("battles_won").default(0),
  battlesLost: integer("battles_lost").default(0),
  winRate: decimal("win_rate", { precision: 5, scale = 2 }),
  averageBattleScore: decimal("average_battle_score", { precision: 10, scale = 2 }),
  
  // Scoring and weights
  engagementScore: decimal("engagement_score", { precision = 10, scale = 2 }),
  consistencyScore: decimal("consistency_score", { precision = 10, scale = 2 }),
  revenueScore: decimal("revenue_score", { precision = 10, scale = 2 }),
  totalScore: decimal("total_score", { precision = 10, scale = 2 }),
  
  // Achievements and badges
  achievements: jsonb("achievements"), // Array of achievement IDs
  newBadges: jsonb("new_badges"), // Badges earned this period
  
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// =============================================================================
// LIVE REACTIONS (Real-time reactions during streams)
// =============================================================================

export const liveReactions = pgTable("live_reactions", {
  id: uuid("id").primaryKey().defaultRandom(),
  sessionId: uuid("session_id")
    .notNull()
    .references(() => liveSessions.id, { onDelete: "cascade" }),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  
  // Reaction details
  reactionType: text("reaction_type").notNull(), // 'heart', 'fire', 'clap', 'wow', etc.
  emoji: text("emoji").notNull(),
  
  // Position for floating animation
  positionX: decimal("position_x", { precision: 5, scale: 2 }),
  positionY: decimal("position_y", { precision: 5, scale: 2 }),
  
  // Reaction context
  timestamp: integer("timestamp"), // Timestamp within the stream
  contextMessage: text("context_message"), // What triggered the reaction
  
  createdAt: timestamp("created_at").defaultNow(),
});

// =============================================================================
// INDEXES FOR PERFORMANCE
// =============================================================================

// Live sessions indexes
index("idx_live_sessions_creator_status").on(liveSessions.creatorId, liveSessions.status);
index("idx_live_sessions_status_created").on(liveSessions.status, liveSessions.createdAt);
index("idx_live_sessions_category_status").on(liveSessions.category, liveSessions.status);

// Chat messages indexes
index("idx_chat_messages_session_created").on(liveChatMessages.sessionId, liveChatMessages.createdAt);
index("idx_chat_messages_user_session").on(liveChatMessages.userId, liveChatMessages.sessionId);

// Gifts indexes
index("idx_live_gifts_session_created").on(liveGifts.sessionId, liveGifts.createdAt);
index("idx_live_gifts_recipient_created").on(liveGifts.recipientId, liveGifts.createdAt);

// Battle votes indexes
index("idx_battle_votes_battle_voter").on(battleVotes.battleId, battleVotes.voterId);
index("idx_battle_votes_voted_for").on(battleVotes.votedFor, battleVotes.createdAt);

// Rankings indexes
index("idx_creator_rankings_period_rank").on(creatorRankings.rankingType, creatorRankings.periodStart, creatorRankings.overallRank);
index("idx_creator_rankings_user_period").on(creatorRankings.userId, creatorRankings.rankingType, creatorRankings.periodStart);

// =============================================================================
// VALIDATION SCHEMAS
// =============================================================================

export const insertLiveSessionSchema = createInsertSchema(liveSessions);
export const insertLiveSessionParticipantSchema = createInsertSchema(liveSessionParticipants);
export const insertLiveChatMessageSchema = createInsertSchema(liveChatMessages);
export const insertGiftTypeSchema = createInsertSchema(giftTypes);
export const insertLiveGiftSchema = createInsertSchema(liveGifts);
export const insertBattleVoteSchema = createInsertSchema(battleVotes);
export const insertLiveSessionAnalyticsSchema = createInsertSchema(liveSessionAnalytics);
export const insertCreatorRankingSchema = createInsertSchema(creatorRankings);
export const insertLiveReactionSchema = createInsertSchema(liveReactions);

// Type exports
export type LiveSession = typeof liveSessions.$inferSelect;
export type NewLiveSession = typeof liveSessions.$inferInsert;
export type LiveSessionParticipant = typeof liveSessionParticipants.$inferSelect;
export type NewLiveSessionParticipant = typeof liveSessionParticipants.$inferInsert;
export type LiveChatMessage = typeof liveChatMessages.$inferSelect;
export type NewLiveChatMessage = typeof liveChatMessages.$inferInsert;
export type GiftType = typeof giftTypes.$inferSelect;
export type NewGiftType = typeof giftTypes.$inferInsert;
export type LiveGift = typeof liveGifts.$inferSelect;
export type NewLiveGift = typeof liveGifts.$inferInsert;
export type BattleVote = typeof battleVotes.$inferSelect;
export type NewBattleVote = typeof battleVotes.$inferInsert;
export type LiveSessionAnalytics = typeof liveSessionAnalytics.$inferSelect;
export type NewLiveSessionAnalytics = typeof liveSessionAnalytics.$inferInsert;
export type CreatorRanking = typeof creatorRankings.$inferSelect;
export type NewCreatorRanking = typeof creatorRankings.$inferInsert;
export type LiveReaction = typeof liveReactions.$inferSelect;
export type NewLiveReaction = typeof liveReactions.$inferInsert;
