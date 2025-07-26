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
import { walletTransactions, softPointsLog } from "./enhanced-schema";

// =============================================================================
// VIDEO DUET SYSTEM
// =============================================================================

// Video Duets Table
export const videoDuets = pgTable("video_duets", {
  id: uuid("id").primaryKey().defaultRandom(),
  
  // Original video reference
  originalVideoId: uuid("original_video_id").notNull(),
  originalCreatorId: uuid("original_creator_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  
  // Duet creator
  duetCreatorId: uuid("duet_creator_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  
  // Video details
  duetVideoId: uuid("duet_video_id").notNull(), // Reference to the final duet video
  duetTitle: text("duet_title"),
  duetDescription: text("duet_description"),
  
  // Technical details
  duetType: text("duet_type").notNull(), // 'side_by_side', 'split_screen', 'reaction', 'green_screen'
  layoutPosition: text("layout_position").default("right"), // 'left', 'right', 'top', 'bottom'
  audioMix: text("audio_mix").default("both"), // 'original_only', 'duet_only', 'both', 'custom'
  
  // Video processing
  originalVideoUrl: text("original_video_url").notNull(),
  duetVideoUrl: text("duet_video_url").notNull(),
  finalVideoUrl: text("final_video_url"), // Merged/processed video
  thumbnailUrl: text("thumbnail_url"),
  
  // Duration and sync
  originalDuration: integer("original_duration").notNull(), // seconds
  duetDuration: integer("duet_duration").notNull(), // seconds
  syncOffset: integer("sync_offset").default(0), // milliseconds offset for sync
  
  // Processing status
  processingStatus: text("processing_status").default("pending"), // 'pending', 'processing', 'completed', 'failed'
  processingProgress: integer("processing_progress").default(0), // 0-100%
  processingError: text("processing_error"),
  
  // Visibility and permissions
  isPublic: boolean("is_public").default(true),
  allowComments: boolean("allow_comments").default(true),
  allowRemixes: boolean("allow_remixes").default(true),
  
  // Engagement metrics
  viewCount: integer("view_count").default(0),
  likeCount: integer("like_count").default(0),
  shareCount: integer("share_count").default(0),
  commentCount: integer("comment_count").default(0),
  
  // Monetization
  isMonetized: boolean("is_monetized").default(true),
  softPointsEarned: decimal("soft_points_earned", { precision: 15, scale: 2 }).default("0"),
  totalTipsReceived: decimal("total_tips_received", { precision: 20, scale: 8 }).default("0"),
  tipCount: integer("tip_count").default(0),
  
  // Revenue sharing between original and duet creators
  revenueSharePercentage: decimal("revenue_share_percentage", { precision: 5, scale: 2 }).default("50.00"), // % to original creator
  originalCreatorEarnings: decimal("original_creator_earnings", { precision: 20, scale: 8 }).default("0"),
  duetCreatorEarnings: decimal("duet_creator_earnings", { precision: 20, scale: 8 }).default("0"),
  
  // Admin moderation
  moderationStatus: text("moderation_status").default("approved"), // 'pending', 'approved', 'rejected', 'flagged'
  moderatedBy: uuid("moderated_by").references(() => users.id),
  moderatedAt: timestamp("moderated_at"),
  rejectionReason: text("rejection_reason"),
  
  // Metadata
  metadata: jsonb("metadata"), // Additional flexible data
  tags: text("tags").array(),
  
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Duet Interactions (likes, tips, etc.)
export const duetInteractions = pgTable("duet_interactions", {
  id: uuid("id").primaryKey().defaultRandom(),
  duetId: uuid("duet_id")
    .notNull()
    .references(() => videoDuets.id, { onDelete: "cascade" }),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  
  // Interaction type
  interactionType: text("interaction_type").notNull(), // 'like', 'tip', 'share', 'comment', 'favorite'
  
  // Tip details (if applicable)
  tipAmount: decimal("tip_amount", { precision: 20, scale: 8 }),
  tipCurrency: text("tip_currency"), // 'USDT', 'ETH', 'BTC', 'SOFT_POINTS'
  tipMessage: text("tip_message"),
  
  // Associated transaction
  transactionId: uuid("transaction_id").references(() => walletTransactions.id),
  softPointsLogId: uuid("soft_points_log_id").references(() => softPointsLog.id),
  
  metadata: jsonb("metadata"),
  
  createdAt: timestamp("created_at").defaultNow(),
}, (table) => ({
  // Unique constraint to prevent duplicate likes/favorites
  uniqueInteraction: unique().on(table.duetId, table.userId, table.interactionType),
}));

// =============================================================================
// LIVE BATTLE SYSTEM
// =============================================================================

// Live Battles Table
export const liveBattles = pgTable("live_battles", {
  id: uuid("id").primaryKey().defaultRandom(),
  
  // Battle participants
  creator1Id: uuid("creator1_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  creator2Id: uuid("creator2_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  
  // Battle details
  battleTitle: text("battle_title").notNull(),
  battleDescription: text("battle_description"),
  battleType: text("battle_type").default("live_duel"), // 'live_duel', 'talent_show', 'dance_off', 'singing_battle'
  
  // Battle configuration
  duration: integer("duration").notNull(), // Battle duration in seconds
  maxViewers: integer("max_viewers").default(1000),
  entryFee: decimal("entry_fee", { precision: 10, scale: 2 }).default("0"), // SoftPoints entry fee
  prizePot: decimal("prize_pot", { precision: 20, scale: 8 }).default("0"), // Total prize pool
  
  // Timing
  scheduledStartTime: timestamp("scheduled_start_time"),
  actualStartTime: timestamp("actual_start_time"),
  actualEndTime: timestamp("actual_end_time"),
  
  // Battle status
  status: text("status").default("scheduled"), // 'scheduled', 'waiting', 'live', 'ended', 'cancelled'
  
  // Live stream details
  streamUrl1: text("stream_url1"), // Creator 1 stream
  streamUrl2: text("stream_url2"), // Creator 2 stream
  combinedStreamUrl: text("combined_stream_url"), // Split-screen combined stream
  
  // Battle room
  roomId: text("room_id").unique(), // Unique room identifier for real-time features
  chatThreadId: uuid("chat_thread_id"), // Associated chat room
  
  // Scoring system
  scoringMethod: text("scoring_method").default("gifts"), // 'gifts', 'votes', 'hybrid'
  allowVoting: boolean("allow_voting").default(true),
  allowGifts: boolean("allow_gifts").default(true),
  voteWeight: decimal("vote_weight", { precision: 5, scale: 2 }).default("1.00"), // Weight for votes in scoring
  giftWeight: decimal("gift_weight", { precision: 5, scale: 2 }).default("1.00"), // Weight for gifts in scoring
  
  // Real-time scores
  creator1Score: decimal("creator1_score", { precision: 15, scale: 2 }).default("0"),
  creator2Score: decimal("creator2_score", { precision: 15, scale: 2 }).default("0"),
  
  // Gift totals
  creator1Gifts: decimal("creator1_gifts", { precision: 20, scale: 8 }).default("0"),
  creator2Gifts: decimal("creator2_gifts", { precision: 20, scale: 8 }).default("0"),
  
  // Vote totals
  creator1Votes: integer("creator1_votes").default(0),
  creator2Votes: integer("creator2_votes").default(0),
  
  // Battle results
  winnerId: uuid("winner_id").references(() => users.id),
  winnerScore: decimal("winner_score", { precision: 15, scale: 2 }),
  marginOfVictory: decimal("margin_of_victory", { precision: 15, scale: 2 }),
  wasCompetitive: boolean("was_competitive"), // Auto-calculated based on score difference
  
  // Viewership metrics
  peakViewers: integer("peak_viewers").default(0),
  totalViewers: integer("total_viewers").default(0),
  averageViewTime: integer("average_view_time").default(0), // seconds
  engagementRate: decimal("engagement_rate", { precision: 5, scale: 2 }).default("0"),
  
  // Monetization
  totalGiftsReceived: decimal("total_gifts_received", { precision: 20, scale: 8 }).default("0"),
  platformRevenue: decimal("platform_revenue", { precision: 20, scale: 8 }).default("0"),
  creator1Earnings: decimal("creator1_earnings", { precision: 20, scale: 8 }).default("0"),
  creator2Earnings: decimal("creator2_earnings", { precision: 20, scale: 8 }).default("0"),
  
  // Prize distribution
  winnerPrize: decimal("winner_prize", { precision: 20, scale: 8 }).default("0"),
  runnerUpPrize: decimal("runner_up_prize", { precision: 20, scale: 8 }).default("0"),
  participationReward: decimal("participation_reward", { precision: 20, scale: 8 }).default("0"),
  
  // Recording and replay
  recordingUrl: text("recording_url"), // Full battle recording
  highlightsUrl: text("highlights_url"), // Auto-generated highlights
  thumbnailUrl: text("thumbnail_url"),
  
  // Administrative
  isPrivate: boolean("is_private").default(false),
  requiresApproval: boolean("requires_approval").default(false),
  moderatedBy: uuid("moderated_by").references(() => users.id),
  
  // Metadata
  metadata: jsonb("metadata"),
  tags: text("tags").array(),
  
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Battle Participants (viewers and their interactions)
export const battleParticipants = pgTable("battle_participants", {
  id: uuid("id").primaryKey().defaultRandom(),
  battleId: uuid("battle_id")
    .notNull()
    .references(() => liveBattles.id, { onDelete: "cascade" }),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  
  // Participation details
  joinedAt: timestamp("joined_at").defaultNow(),
  leftAt: timestamp("left_at"),
  totalWatchTime: integer("total_watch_time").default(0), // seconds
  
  // User's battle activity
  votesGiven: integer("votes_given").default(0),
  giftsGiven: integer("gifts_given").default(0),
  totalGiftValue: decimal("total_gift_value", { precision: 20, scale: 8 }).default("0"),
  messagesCount: integer("messages_count").default(0),
  
  // User's vote (if voting is enabled)
  votedFor: uuid("voted_for").references(() => users.id), // Which creator they voted for
  voteTimestamp: timestamp("vote_timestamp"),
  
  // Engagement score for this battle
  engagementScore: decimal("engagement_score", { precision: 10, scale: 2 }).default("0"),
  
  metadata: jsonb("metadata"),
}, (table) => ({
  // Unique constraint to prevent duplicate participation records
  uniqueParticipant: unique().on(table.battleId, table.userId),
}));

// Battle Gifts/Tips (real-time gifts during battles)
export const battleGifts = pgTable("battle_gifts", {
  id: uuid("id").primaryKey().defaultRandom(),
  battleId: uuid("battle_id")
    .notNull()
    .references(() => liveBattles.id, { onDelete: "cascade" }),
  
  // Gift details
  senderId: uuid("sender_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  recipientId: uuid("recipient_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }), // Creator receiving the gift
  
  // Gift information
  giftType: text("gift_type").notNull(), // 'rose', 'heart', 'crown', 'diamond', 'rocket', 'custom'
  giftName: text("gift_name").notNull(),
  giftIcon: text("gift_icon"), // Emoji or icon identifier
  
  // Value and payment
  softPointsValue: decimal("soft_points_value", { precision: 10, scale: 2 }).notNull(),
  usdValue: decimal("usd_value", { precision: 10, scale: 2 }), // Equivalent USD value
  quantity: integer("quantity").default(1), // Number of this gift sent
  
  // Combo and multipliers
  isCombo: boolean("is_combo").default(false), // Part of a gift combo
  comboMultiplier: decimal("combo_multiplier", { precision: 5, scale: 2 }).default("1.00"),
  finalValue: decimal("final_value", { precision: 20, scale: 8 }).notNull(), // After multipliers
  
  // Visual effects
  hasSpecialEffect: boolean("has_special_effect").default(false),
  effectType: text("effect_type"), // 'fireworks', 'confetti', 'spotlight', 'rainbow'
  displayDuration: integer("display_duration").default(3), // seconds to display
  
  // Transaction tracking
  transactionId: uuid("transaction_id").references(() => walletTransactions.id),
  softPointsLogId: uuid("soft_points_log_id").references(() => softPointsLog.id),
  
  // Message with gift
  message: text("message"),
  
  // Timing (important for real-time scoring)
  giftTimestamp: timestamp("gift_timestamp").defaultNow(),
  timeFromBattleStart: integer("time_from_battle_start"), // milliseconds from battle start
  
  metadata: jsonb("metadata"),
  
  createdAt: timestamp("created_at").defaultNow(),
});

// Battle Statistics and Analytics
export const battleStats = pgTable("battle_stats", {
  id: uuid("id").primaryKey().defaultRandom(),
  battleId: uuid("battle_id")
    .notNull()
    .references(() => liveBattles.id, { onDelete: "cascade" }),
  
  // Time-based metrics (captured at regular intervals)
  timestamp: timestamp("timestamp").notNull(),
  
  // Real-time metrics
  currentViewers: integer("current_viewers").default(0),
  creator1CurrentScore: decimal("creator1_current_score", { precision: 15, scale: 2 }).default("0"),
  creator2CurrentScore: decimal("creator2_current_score", { precision: 15, scale: 2 }).default("0"),
  
  // Activity metrics
  messagesPerMinute: decimal("messages_per_minute", { precision: 8, scale: 2 }).default("0"),
  giftsPerMinute: decimal("gifts_per_minute", { precision: 8, scale: 2 }).default("0"),
  newViewersCount: integer("new_viewers_count").default(0),
  
  // Engagement metrics
  chatActivity: decimal("chat_activity", { precision: 5, scale: 2 }).default("0"), // 0-100 scale
  giftActivity: decimal("gift_activity", { precision: 5, scale: 2 }).default("0"), // 0-100 scale
  overallEngagement: decimal("overall_engagement", { precision: 5, scale: 2 }).default("0"), // 0-100 scale
  
  createdAt: timestamp("created_at").defaultNow(),
});

// Battle Leaderboards
export const battleLeaderboards = pgTable("battle_leaderboards", {
  id: uuid("id").primaryKey().defaultRandom(),
  
  // Leaderboard configuration
  leaderboardType: text("leaderboard_type").notNull(), // 'daily', 'weekly', 'monthly', 'all_time'
  period: text("period").notNull(), // '2024-01-15' for daily, '2024-W03' for weekly, etc.
  
  // User ranking
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  rank: integer("rank").notNull(),
  previousRank: integer("previous_rank"),
  
  // Battle performance metrics
  battlesParticipated: integer("battles_participated").default(0),
  battlesWon: integer("battles_won").default(0),
  battlesLost: integer("battles_lost").default(0),
  winRate: decimal("win_rate", { precision: 5, scale: 2 }).default("0"),
  
  // Scoring metrics
  totalScore: decimal("total_score", { precision: 20, scale: 2 }).default("0"),
  averageScore: decimal("average_score", { precision: 15, scale: 2 }).default("0"),
  highestScore: decimal("highest_score", { precision: 15, scale: 2 }).default("0"),
  
  // Engagement metrics
  totalGiftsReceived: decimal("total_gifts_received", { precision: 20, scale: 8 }).default("0"),
  totalViewers: integer("total_viewers").default(0),
  averageViewers: integer("average_viewers").default(0),
  totalWatchTime: integer("total_watch_time").default(0), // Total minutes watched by all viewers
  
  // Earnings
  totalEarnings: decimal("total_earnings", { precision: 20, scale: 8 }).default("0"),
  
  // Streak tracking
  currentWinStreak: integer("current_win_streak").default(0),
  longestWinStreak: integer("longest_win_streak").default(0),
  
  // Activity tracking
  lastBattleAt: timestamp("last_battle_at"),
  
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
}, (table) => ({
  // Unique constraint for user+period combination
  uniqueUserPeriod: unique().on(table.userId, table.leaderboardType, table.period),
}));

// Battle Invitations
export const battleInvitations = pgTable("battle_invitations", {
  id: uuid("id").primaryKey().defaultRandom(),
  
  // Invitation details
  inviterId: uuid("inviter_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  inviteeId: uuid("invitee_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  
  // Battle configuration
  battleType: text("battle_type").default("live_duel"),
  proposedDuration: integer("proposed_duration").default(180), // seconds
  proposedTime: timestamp("proposed_time"),
  
  // Stakes (optional)
  entryFee: decimal("entry_fee", { precision: 10, scale: 2 }).default("0"),
  prizeAmount: decimal("prize_amount", { precision: 20, scale: 8 }).default("0"),
  
  // Status
  status: text("status").default("pending"), // 'pending', 'accepted', 'declined', 'cancelled', 'expired'
  
  // Response
  respondedAt: timestamp("responded_at"),
  responseMessage: text("response_message"),
  
  // Auto-expiry
  expiresAt: timestamp("expires_at"),
  
  // Associated battle (if accepted)
  battleId: uuid("battle_id").references(() => liveBattles.id),
  
  metadata: jsonb("metadata"),
  
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
}, (table) => ({
  // Unique constraint to prevent duplicate invitations
  uniqueInvitation: unique().on(table.inviterId, table.inviteeId, table.status),
}));

// =============================================================================
// INDEXES FOR PERFORMANCE
// =============================================================================

// Video Duets indexes
export const duetOriginalVideoIdx = index("duet_original_video_idx").on(
  videoDuets.originalVideoId,
);
export const duetCreatorIdx = index("duet_creator_idx").on(
  videoDuets.duetCreatorId,
);
export const duetStatusIdx = index("duet_status_idx").on(
  videoDuets.processingStatus,
);

// Live Battles indexes
export const battleStatusIdx = index("battle_status_idx").on(
  liveBattles.status,
);
export const battleCreator1Idx = index("battle_creator1_idx").on(
  liveBattles.creator1Id,
);
export const battleCreator2Idx = index("battle_creator2_idx").on(
  liveBattles.creator2Id,
);
export const battleStartTimeIdx = index("battle_start_time_idx").on(
  liveBattles.actualStartTime,
);

// Battle Gifts indexes
export const battleGiftsBattleIdx = index("battle_gifts_battle_idx").on(
  battleGifts.battleId,
);
export const battleGiftsTimestampIdx = index("battle_gifts_timestamp_idx").on(
  battleGifts.giftTimestamp,
);

// =============================================================================
// INSERT SCHEMAS FOR VALIDATION
// =============================================================================

export const insertVideoDuetSchema = createInsertSchema(videoDuets).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  viewCount: true,
  likeCount: true,
  shareCount: true,
  commentCount: true,
  softPointsEarned: true,
  totalTipsReceived: true,
  tipCount: true,
});

export const insertLiveBattleSchema = createInsertSchema(liveBattles).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  creator1Score: true,
  creator2Score: true,
  creator1Gifts: true,
  creator2Gifts: true,
  creator1Votes: true,
  creator2Votes: true,
  peakViewers: true,
  totalViewers: true,
});

export const insertBattleGiftSchema = createInsertSchema(battleGifts).omit({
  id: true,
  createdAt: true,
  giftTimestamp: true,
});

export const insertBattleParticipantSchema = createInsertSchema(battleParticipants).omit({
  id: true,
  joinedAt: true,
  totalWatchTime: true,
  votesGiven: true,
  giftsGiven: true,
  totalGiftValue: true,
  messagesCount: true,
});

// =============================================================================
// TYPE EXPORTS
// =============================================================================

export type VideoDuet = typeof videoDuets.$inferSelect;
export type DuetInteraction = typeof duetInteractions.$inferSelect;
export type LiveBattle = typeof liveBattles.$inferSelect;
export type BattleParticipant = typeof battleParticipants.$inferSelect;
export type BattleGift = typeof battleGifts.$inferSelect;
export type BattleStats = typeof battleStats.$inferSelect;
export type BattleLeaderboard = typeof battleLeaderboards.$inferSelect;
export type BattleInvitation = typeof battleInvitations.$inferSelect;

export type InsertVideoDuet = typeof videoDuets.$inferInsert;
export type InsertDuetInteraction = typeof duetInteractions.$inferInsert;
export type InsertLiveBattle = typeof liveBattles.$inferInsert;
export type InsertBattleParticipant = typeof battleParticipants.$inferInsert;
export type InsertBattleGift = typeof battleGifts.$inferInsert;
export type InsertBattleStats = typeof battleStats.$inferInsert;
export type InsertBattleLeaderboard = typeof battleLeaderboards.$inferInsert;
export type InsertBattleInvitation = typeof battleInvitations.$inferInsert;
