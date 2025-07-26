import {
  pgTable,
  text,
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
import { users, posts } from "./schema";

// =============================================================================
// VIDEO DUET SYSTEM
// =============================================================================

export const videoDuets = pgTable("video_duets", {
  id: uuid("id").primaryKey().defaultRandom(),
  
  // Original video reference
  originalVideoId: uuid("original_video_id")
    .notNull()
    .references(() => posts.id, { onDelete: "cascade" }),
  originalCreatorId: uuid("original_creator_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  
  // Duet creator
  duetCreatorId: uuid("duet_creator_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  
  // Duet video details
  duetVideoId: uuid("duet_video_id")
    .notNull()
    .references(() => posts.id, { onDelete: "cascade" }),
  duetVideoUrl: text("duet_video_url").notNull(),
  duetThumbnail: text("duet_thumbnail"),
  
  // Duet configuration
  duetType: text("duet_type").notNull().default("side_by_side"), // 'side_by_side', 'react_respond', 'picture_in_picture'
  layout: text("layout").default("original_left"), // 'original_left', 'original_right', 'original_top', 'original_bottom'
  duration: integer("duration").notNull(), // Duration in seconds
  
  // Audio settings
  audioMix: text("audio_mix").default("both"), // 'original_only', 'duet_only', 'both', 'mixed'
  originalAudioVolume: decimal("original_audio_volume", { precision: 3, scale: 2 }).default("0.5"),
  duetAudioVolume: decimal("duet_audio_volume", { precision: 3, scale: 2 }).default("0.5"),
  
  // Sync settings
  syncToOriginal: boolean("sync_to_original").default(true),
  startOffset: integer("start_offset").default(0), // Seconds to offset start
  
  // Status and approval
  status: text("status").default("active"), // 'active', 'hidden', 'removed', 'pending_approval'
  isApproved: boolean("is_approved").default(true),
  approvedBy: uuid("approved_by").references(() => users.id),
  approvedAt: timestamp("approved_at"),
  
  // Privacy settings
  allowComments: boolean("allow_comments").default(true),
  allowDuets: boolean("allow_duets").default(true), // Allow duets of this duet
  
  // Performance metrics
  viewCount: integer("view_count").default(0),
  likeCount: integer("like_count").default(0),
  shareCount: integer("share_count").default(0),
  duetCount: integer("duet_count").default(0), // How many duets this has spawned
  
  // Monetization
  tipsReceived: decimal("tips_received", { precision: 20, scale: 8 }).default("0"),
  softPointsEarned: decimal("soft_points_earned", { precision: 20, scale: 2 }).default("0"),
  
  // Metadata
  metadata: jsonb("metadata"), // Additional duet-specific data
  
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Duet challenges (admin-created viral campaigns)
export const duetChallenges = pgTable("duet_challenges", {
  id: uuid("id").primaryKey().defaultRandom(),
  
  // Challenge details
  title: text("title").notNull(),
  description: text("description").notNull(),
  hashtag: text("hashtag").notNull().unique(), // e.g., "#GlowUpChallenge"
  
  // Challenge video (the one to duet)
  originalVideoId: uuid("original_video_id")
    .notNull()
    .references(() => posts.id, { onDelete: "cascade" }),
  createdBy: uuid("created_by")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  
  // Challenge configuration
  isActive: boolean("is_active").default(true),
  featuredOnHomepage: boolean("featured_on_homepage").default(false),
  maxParticipants: integer("max_participants"), // null = unlimited
  
  // Duration
  startDate: timestamp("start_date").notNull(),
  endDate: timestamp("end_date").notNull(),
  
  // Rewards
  topParticipantReward: decimal("top_participant_reward", { precision: 10, scale: 2 }).default("0"),
  participationReward: decimal("participation_reward", { precision: 10, scale: 2 }).default("0"),
  currency: text("currency").default("SOFT_POINTS"), // 'SOFT_POINTS', 'USDT'
  
  // Challenge media
  bannerImage: text("banner_image"),
  promoVideo: text("promo_video"),
  
  // Performance tracking
  totalParticipants: integer("total_participants").default(0),
  totalViews: integer("total_views").default(0),
  totalEngagement: integer("total_engagement").default(0),
  
  // Admin settings
  requiresApproval: boolean("requires_approval").default(false),
  moderatedBy: uuid("moderated_by").references(() => users.id),
  
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Challenge participation tracking
export const challengeParticipants = pgTable("challenge_participants", {
  id: uuid("id").primaryKey().defaultRandom(),
  challengeId: uuid("challenge_id")
    .notNull()
    .references(() => duetChallenges.id, { onDelete: "cascade" }),
  duetId: uuid("duet_id")
    .notNull()
    .references(() => videoDuets.id, { onDelete: "cascade" }),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  
  // Performance in challenge
  viewCount: integer("view_count").default(0),
  likeCount: integer("like_count").default(0),
  engagementScore: decimal("engagement_score", { precision: 10, scale: 2 }).default("0"),
  
  // Ranking
  currentRank: integer("current_rank"),
  bestRank: integer("best_rank"),
  
  // Rewards
  rewardEarned: decimal("reward_earned", { precision: 10, scale: 2 }).default("0"),
  rewardPaid: boolean("reward_paid").default(false),
  
  // Status
  status: text("status").default("active"), // 'active', 'disqualified', 'winner'
  
  participatedAt: timestamp("participated_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
}, (table) => ({
  unique: unique().on(table.challengeId, table.userId),
}));

// =============================================================================
// LIVE BATTLE SYSTEM
// =============================================================================

export const liveBattles = pgTable("live_battles", {
  id: uuid("id").primaryKey().defaultRandom(),
  
  // Battle participants
  participant1Id: uuid("participant_1_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  participant2Id: uuid("participant_2_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  
  // Battle details
  title: text("title"),
  description: text("description"),
  battleType: text("battle_type").default("live_stream"), // 'live_stream', 'video_submission', 'talent_show'
  
  // Battle configuration
  duration: integer("duration").notNull().default(180), // Duration in seconds (3 minutes default)
  maxViewers: integer("max_viewers"), // null = unlimited
  requiresInvite: boolean("requires_invite").default(false),
  
  // Battle room settings
  roomId: text("room_id").notNull().unique(), // For live streaming service
  streamKey1: text("stream_key_1"), // Stream key for participant 1
  streamKey2: text("stream_key_2"), // Stream key for participant 2
  
  // Status and timing
  status: text("status").default("pending"), // 'pending', 'live', 'completed', 'cancelled', 'abandoned'
  scheduledFor: timestamp("scheduled_for"),
  startedAt: timestamp("started_at"),
  endedAt: timestamp("ended_at"),
  
  // Scoring system
  scoringMethod: text("scoring_method").default("tips"), // 'tips', 'votes', 'judges', 'hybrid'
  participant1Score: decimal("participant_1_score", { precision: 20, scale: 8 }).default("0"),
  participant2Score: decimal("participant_2_score", { precision: 20, scale: 8 }).default("0"),
  
  // Winner determination
  winnerId: uuid("winner_id").references(() => users.id),
  winnerDetermined: boolean("winner_determined").default(false),
  winMethod: text("win_method"), // 'score', 'forfeit', 'time_limit', 'admin_decision'
  
  // Battle metrics
  peakViewerCount: integer("peak_viewer_count").default(0),
  totalViews: integer("total_views").default(0),
  totalTips: decimal("total_tips", { precision: 20, scale: 8 }).default("0"),
  totalBets: decimal("total_bets", { precision: 20, scale: 8 }).default("0"),
  
  // Platform revenue
  platformFee: decimal("platform_fee", { precision: 20, scale: 8 }).default("0"),
  feePercentage: decimal("fee_percentage", { precision: 5, scale: 2 }).default("10.0"),
  
  // Battle replay
  replayUrl: text("replay_url"),
  highlightsUrl: text("highlights_url"),
  thumbnailUrl: text("thumbnail_url"),
  
  // Moderation
  isFlagged: boolean("is_flagged").default(false),
  flaggedReason: text("flagged_reason"),
  moderatedBy: uuid("moderated_by").references(() => users.id),
  
  // Metadata
  metadata: jsonb("metadata"), // Additional battle data, rules, etc.
  
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Battle viewer tracking
export const battleViewers = pgTable("battle_viewers", {
  id: uuid("id").primaryKey().defaultRandom(),
  battleId: uuid("battle_id")
    .notNull()
    .references(() => liveBattles.id, { onDelete: "cascade" }),
  userId: uuid("user_id").references(() => users.id), // null for anonymous viewers
  
  // Viewer details
  sessionId: text("session_id").notNull(),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  
  // Engagement tracking
  joinedAt: timestamp("joined_at").defaultNow(),
  leftAt: timestamp("left_at"),
  watchDuration: integer("watch_duration").default(0), // Seconds watched
  
  // Interaction tracking
  tipsGiven: decimal("tips_given", { precision: 20, scale: 8 }).default("0"),
  betsPlaced: decimal("bets_placed", { precision: 20, scale: 8 }).default("0"),
  messagesPosted: integer("messages_posted").default(0),
  reactionsGiven: integer("reactions_given").default(0),
  
  // Device info
  deviceType: text("device_type"), // 'desktop', 'mobile', 'tablet'
  platform: text("platform"), // 'web', 'ios', 'android'
  
  updatedAt: timestamp("updated_at").defaultNow(),
}, (table) => ({
  unique: unique().on(table.battleId, table.sessionId),
}));

// Battle betting system
export const battleBets = pgTable("battle_bets", {
  id: uuid("id").primaryKey().defaultRandom(),
  battleId: uuid("battle_id")
    .notNull()
    .references(() => liveBattles.id, { onDelete: "cascade" }),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  
  // Bet details
  betOnParticipant: uuid("bet_on_participant")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  betAmount: decimal("bet_amount", { precision: 20, scale: 8 }).notNull(),
  currency: text("currency").default("SOFT_POINTS"), // 'SOFT_POINTS', 'USDT'
  
  // Odds and potential payout
  oddsWhenPlaced: decimal("odds_when_placed", { precision: 10, scale: 2 }),
  potentialPayout: decimal("potential_payout", { precision: 20, scale: 8 }),
  
  // Bet status
  status: text("status").default("active"), // 'active', 'won', 'lost', 'cancelled', 'refunded'
  isWinning: boolean("is_winning"),
  actualPayout: decimal("actual_payout", { precision: 20, scale: 8 }).default("0"),
  
  // Payout details
  payoutProcessed: boolean("payout_processed").default(false),
  payoutAt: timestamp("payout_at"),
  
  // Bet timing
  placedAt: timestamp("placed_at").defaultNow(),
  lockedAt: timestamp("locked_at"), // When betting was locked for this bet
  
  // Metadata
  metadata: jsonb("metadata"),
});

// Battle tips/gifts during live stream
export const battleTips = pgTable("battle_tips", {
  id: uuid("id").primaryKey().defaultRandom(),
  battleId: uuid("battle_id")
    .notNull()
    .references(() => liveBattles.id, { onDelete: "cascade" }),
  
  // Tip details
  fromUserId: uuid("from_user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  toParticipantId: uuid("to_participant_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  
  // Tip amount and type
  amount: decimal("amount", { precision: 20, scale: 8 }).notNull(),
  currency: text("currency").default("SOFT_POINTS"),
  giftType: text("gift_type"), // 'rose', 'crown', 'rocket', 'custom'
  giftName: text("gift_name"),
  
  // Display settings
  message: text("message"), // Optional message with tip
  isAnonymous: boolean("is_anonymous").default(false),
  showInStream: boolean("show_in_stream").default(true),
  
  // Animation and effects
  animationType: text("animation_type").default("standard"), // 'standard', 'fireworks', 'confetti'
  effectDuration: integer("effect_duration").default(3), // Seconds
  
  // Scoring impact
  scoreContribution: decimal("score_contribution", { precision: 20, scale: 8 }),
  multiplier: decimal("multiplier", { precision: 5, scale: 2 }).default("1.0"),
  
  // Combo tracking (multiple tips in short time)
  comboCount: integer("combo_count").default(1),
  comboMultiplier: decimal("combo_multiplier", { precision: 5, scale: 2 }).default("1.0"),
  
  // Processing status
  processed: boolean("processed").default(false),
  processedAt: timestamp("processed_at"),
  
  sentAt: timestamp("sent_at").defaultNow(),
});

// Battle leaderboards (daily, weekly, monthly)
export const battleLeaderboards = pgTable("battle_leaderboards", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  
  // Leaderboard period
  period: text("period").notNull(), // 'daily', 'weekly', 'monthly', 'all_time'
  periodStart: timestamp("period_start").notNull(),
  periodEnd: timestamp("period_end").notNull(),
  
  // Battle statistics
  battlesParticipated: integer("battles_participated").default(0),
  battlesWon: integer("battles_won").default(0),
  battlesLost: integer("battles_lost").default(0),
  winRate: decimal("win_rate", { precision: 5, scale: 2 }).default("0"),
  
  // Earnings and tips
  totalEarnings: decimal("total_earnings", { precision: 20, scale: 8 }).default("0"),
  totalTipsReceived: decimal("total_tips_received", { precision: 20, scale: 8 }).default("0"),
  averageEarningsPerBattle: decimal("average_earnings_per_battle", { precision: 20, scale: 8 }).default("0"),
  
  // Engagement metrics
  totalViewersAttracted: integer("total_viewers_attracted").default(0),
  averageViewerCount: decimal("average_viewer_count", { precision: 10, scale: 2 }).default("0"),
  totalWatchTime: integer("total_watch_time").default(0), // Total seconds watched by all viewers
  
  // Ranking
  currentRank: integer("current_rank"),
  previousRank: integer("previous_rank"),
  rankChange: integer("rank_change").default(0),
  
  // Streak tracking
  currentWinStreak: integer("current_win_streak").default(0),
  longestWinStreak: integer("longest_win_streak").default(0),
  
  // Creator tier progression
  creatorTier: text("creator_tier").default("rising_star"), // 'rising_star', 'pro_creator', 'legend'
  tierProgress: decimal("tier_progress", { precision: 5, scale: 2 }).default("0"), // 0-100%
  
  // Achievement tracking
  achievements: text("achievements").array(), // Array of achievement IDs earned
  
  calculatedAt: timestamp("calculated_at").defaultNow(),
  createdAt: timestamp("created_at").defaultNow(),
}, (table) => ({
  unique: unique().on(table.userId, table.period, table.periodStart),
}));

// Battle highlights and clips
export const battleHighlights = pgTable("battle_highlights", {
  id: uuid("id").primaryKey().defaultRandom(),
  battleId: uuid("battle_id")
    .notNull()
    .references(() => liveBattles.id, { onDelete: "cascade" }),
  
  // Highlight details
  title: text("title").notNull(),
  description: text("description"),
  highlightType: text("highlight_type").notNull(), // 'auto_generated', 'manual', 'user_requested'
  
  // Video details
  videoUrl: text("video_url").notNull(),
  thumbnailUrl: text("thumbnail_url"),
  duration: integer("duration").notNull(), // Duration in seconds
  
  // Source timing from original battle
  startTime: integer("start_time").notNull(), // Start time in seconds from battle start
  endTime: integer("end_time").notNull(), // End time in seconds from battle start
  
  // Content details
  featuredMoments: jsonb("featured_moments"), // Key moments in the highlight
  participants: text("participants").array(), // Participant IDs featured
  
  // Generation metadata
  generatedBy: text("generated_by"), // 'ai', 'admin', 'user'
  generationAlgorithm: text("generation_algorithm"), // Details of how it was generated
  confidence: decimal("confidence", { precision: 5, scale: 2 }), // AI confidence score
  
  // Sharing and discovery
  isPublic: boolean("is_public").default(true),
  allowSharing: boolean("allow_sharing").default(true),
  tags: text("tags").array(),
  
  // Performance metrics
  viewCount: integer("view_count").default(0),
  shareCount: integer("share_count").default(0),
  likeCount: integer("like_count").default(0),
  
  // Monetization
  monetizationEnabled: boolean("monetization_enabled").default(false),
  revenueGenerated: decimal("revenue_generated", { precision: 20, scale: 8 }).default("0"),
  
  // Status
  status: text("status").default("active"), // 'active', 'hidden', 'processing', 'failed'
  processingStatus: text("processing_status"), // 'queued', 'processing', 'completed', 'failed'
  
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// =============================================================================
// CREATOR TIER SYSTEM
// =============================================================================

export const creatorTiers = pgTable("creator_tiers", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" })
    .unique(),
  
  // Current tier information
  currentTier: text("current_tier").default("rising_star"), // 'rising_star', 'pro_creator', 'legend'
  tierLevel: integer("tier_level").default(1), // Numeric level for easier comparison
  
  // Progress tracking
  progressToNextTier: decimal("progress_to_next_tier", { precision: 5, scale: 2 }).default("0"), // 0-100%
  
  // Metrics for tier calculation
  totalViews: integer("total_views").default(0),
  duetsCreated: integer("duets_created").default(0),
  battlesWon: integer("battles_won").default(0),
  battlesParticipated: integer("battles_participated").default(0),
  totalEarnings: decimal("total_earnings", { precision: 20, scale: 8 }).default("0"),
  followerCount: integer("follower_count").default(0),
  engagementRate: decimal("engagement_rate", { precision: 5, scale: 2 }).default("0"),
  
  // Special achievements
  isVerified: boolean("is_verified").default(false),
  hasBlueCheckmark: boolean("has_blue_checkmark").default(false),
  specialBadges: text("special_badges").array(), // Array of special badge IDs
  
  // Tier benefits
  benefits: jsonb("benefits"), // JSON object with tier-specific benefits
  softPointsBonus: decimal("soft_points_bonus", { precision: 5, scale: 2 }).default("0"), // Multiplier
  prioritySupport: boolean("priority_support").default(false),
  earlyAccess: boolean("early_access").default(false),
  
  // Tier history
  previousTier: text("previous_tier"),
  tierUpgradeDate: timestamp("tier_upgrade_date"),
  daysInCurrentTier: integer("days_in_current_tier").default(0),
  
  // Rewards earned
  tierRewardsEarned: decimal("tier_rewards_earned", { precision: 20, scale: 8 }).default("0"),
  lifetimeRewards: decimal("lifetime_rewards", { precision: 20, scale: 8 }).default("0"),
  
  // Next tier requirements
  nextTierRequirements: jsonb("next_tier_requirements"), // What they need to reach next tier
  
  lastCalculatedAt: timestamp("last_calculated_at").defaultNow(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Tier upgrade history
export const tierUpgradeHistory = pgTable("tier_upgrade_history", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  
  // Upgrade details
  fromTier: text("from_tier"),
  toTier: text("to_tier").notNull(),
  upgradeReason: text("upgrade_reason"), // What triggered the upgrade
  
  // Metrics at time of upgrade
  metricsSnapshot: jsonb("metrics_snapshot"), // User's metrics when they upgraded
  
  // Rewards given
  rewardAmount: decimal("reward_amount", { precision: 20, scale: 8 }).default("0"),
  rewardCurrency: text("reward_currency").default("SOFT_POINTS"),
  specialRewards: jsonb("special_rewards"), // Additional rewards (badges, benefits, etc.)
  
  // Celebration
  celebrationShown: boolean("celebration_shown").default(false),
  celebrationData: jsonb("celebration_data"), // Data for tier upgrade celebration
  
  upgradedAt: timestamp("upgraded_at").defaultNow(),
});

// =============================================================================
// ABUSE PREVENTION & MODERATION
// =============================================================================

export const contentModerationActions = pgTable("content_moderation_actions", {
  id: uuid("id").primaryKey().defaultRandom(),
  
  // Content being moderated
  contentType: text("content_type").notNull(), // 'duet', 'battle', 'battle_message', 'highlight'
  contentId: uuid("content_id").notNull(),
  contentOwnerId: uuid("content_owner_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  
  // Action details
  action: text("action").notNull(), // 'flag', 'remove', 'age_restrict', 'demonetize', 'ban_user'
  reason: text("reason").notNull(),
  description: text("description"),
  
  // Severity and impact
  severity: text("severity").default("medium"), // 'low', 'medium', 'high', 'critical'
  autoDetected: boolean("auto_detected").default(false),
  aiConfidence: decimal("ai_confidence", { precision: 5, scale: 2 }), // AI detection confidence
  
  // Moderator info
  moderatorId: uuid("moderator_id").references(() => users.id),
  moderatorType: text("moderator_type"), // 'human', 'ai', 'community'
  
  // User appeal
  appealable: boolean("appealable").default(true),
  appealSubmitted: boolean("appeal_submitted").default(false),
  appealedAt: timestamp("appealed_at"),
  appealReason: text("appeal_reason"),
  appealStatus: text("appeal_status"), // 'pending', 'approved', 'denied'
  
  // Status
  status: text("status").default("active"), // 'active', 'appealed', 'reversed', 'expired'
  expiresAt: timestamp("expires_at"), // For temporary actions
  
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// User behavior tracking for abuse detection
export const userBehaviorLogs = pgTable("user_behavior_logs", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  
  // Behavior tracking
  action: text("action").notNull(), // 'duet_created', 'battle_joined', 'tip_sent', 'bet_placed'
  frequency: integer("frequency").default(1), // How many times in time window
  timeWindow: text("time_window").default("hour"), // 'minute', 'hour', 'day'
  
  // Rate limiting
  hourlyCount: integer("hourly_count").default(0),
  dailyCount: integer("daily_count").default(0),
  weeklyCount: integer("weekly_count").default(0),
  
  // Abuse indicators
  suspiciousPattern: boolean("suspicious_pattern").default(false),
  riskScore: decimal("risk_score", { precision: 5, scale: 2 }).default("0"), // 0-100
  
  // Related entities
  relatedContentId: uuid("related_content_id"),
  relatedUserId: uuid("related_user_id").references(() => users.id),
  
  // Context
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  deviceFingerprint: text("device_fingerprint"),
  
  // Metadata
  metadata: jsonb("metadata"),
  
  createdAt: timestamp("created_at").defaultNow(),
  windowStart: timestamp("window_start").defaultNow(),
  windowEnd: timestamp("window_end"),
});

// Rate limiting rules
export const rateLimitRules = pgTable("rate_limit_rules", {
  id: uuid("id").primaryKey().defaultRandom(),
  
  // Rule configuration
  actionType: text("action_type").notNull(), // 'duet_creation', 'battle_participation', 'tip_sending'
  userTier: text("user_tier"), // null = applies to all, or specific tier
  
  // Limits
  maxPerMinute: integer("max_per_minute").default(0),
  maxPerHour: integer("max_per_hour").default(0),
  maxPerDay: integer("max_per_day").default(0),
  maxPerWeek: integer("max_per_week").default(0),
  
  // Trusted user overrides
  trustedUserMultiplier: decimal("trusted_user_multiplier", { precision: 5, scale: 2 }).default("1.0"),
  verifiedUserMultiplier: decimal("verified_user_multiplier", { precision: 5, scale: 2 }).default("1.0"),
  
  // Rule metadata
  description: text("description"),
  isActive: boolean("is_active").default(true),
  
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// =============================================================================
// INSERT SCHEMAS FOR VALIDATION
// =============================================================================

export const insertVideoDuetSchema = createInsertSchema(videoDuets).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  approvedAt: true,
  viewCount: true,
  likeCount: true,
  shareCount: true,
  duetCount: true,
  tipsReceived: true,
  softPointsEarned: true,
});

export const insertDuetChallengeSchema = createInsertSchema(duetChallenges).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  totalParticipants: true,
  totalViews: true,
  totalEngagement: true,
});

export const insertLiveBattleSchema = createInsertSchema(liveBattles).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  startedAt: true,
  endedAt: true,
  peakViewerCount: true,
  totalViews: true,
  totalTips: true,
  totalBets: true,
});

export const insertBattleBetSchema = createInsertSchema(battleBets).omit({
  id: true,
  placedAt: true,
  lockedAt: true,
  payoutAt: true,
});

export const insertBattleTipSchema = createInsertSchema(battleTips).omit({
  id: true,
  sentAt: true,
  processedAt: true,
});

export const insertCreatorTierSchema = createInsertSchema(creatorTiers).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  lastCalculatedAt: true,
  tierUpgradeDate: true,
  daysInCurrentTier: true,
});

export const insertContentModerationActionSchema = createInsertSchema(contentModerationActions).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  appealedAt: true,
});

// =============================================================================
// TYPE EXPORTS
// =============================================================================

export type VideoDuet = typeof videoDuets.$inferSelect;
export type DuetChallenge = typeof duetChallenges.$inferSelect;
export type LiveBattle = typeof liveBattles.$inferSelect;
export type BattleViewer = typeof battleViewers.$inferSelect;
export type BattleBet = typeof battleBets.$inferSelect;
export type BattleTip = typeof battleTips.$inferSelect;
export type BattleLeaderboard = typeof battleLeaderboards.$inferSelect;
export type BattleHighlight = typeof battleHighlights.$inferSelect;
export type CreatorTier = typeof creatorTiers.$inferSelect;
export type TierUpgradeHistory = typeof tierUpgradeHistory.$inferSelect;
export type ContentModerationAction = typeof contentModerationActions.$inferSelect;
export type UserBehaviorLog = typeof userBehaviorLogs.$inferSelect;
export type RateLimitRule = typeof rateLimitRules.$inferSelect;

export type InsertVideoDuet = typeof videoDuets.$inferInsert;
export type InsertDuetChallenge = typeof duetChallenges.$inferInsert;
export type InsertLiveBattle = typeof liveBattles.$inferInsert;
export type InsertBattleViewer = typeof battleViewers.$inferInsert;
export type InsertBattleBet = typeof battleBets.$inferInsert;
export type InsertBattleTip = typeof battleTips.$inferInsert;
export type InsertBattleLeaderboard = typeof battleLeaderboards.$inferInsert;
export type InsertBattleHighlight = typeof battleHighlights.$inferInsert;
export type InsertCreatorTier = typeof creatorTiers.$inferInsert;
export type InsertTierUpgradeHistory = typeof tierUpgradeHistory.$inferInsert;
export type InsertContentModerationAction = typeof contentModerationActions.$inferInsert;
export type InsertUserBehaviorLog = typeof userBehaviorLogs.$inferInsert;
export type InsertRateLimitRule = typeof rateLimitRules.$inferInsert;
