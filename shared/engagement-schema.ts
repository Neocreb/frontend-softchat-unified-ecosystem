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
import { users, profiles, posts } from "./schema";

// =============================================================================
// LIVE BATTLES SYSTEM
// =============================================================================

export const liveBattles = pgTable("live_battles", {
  id: uuid("id").primaryKey().defaultRandom(),
  
  // Battle participants
  creator1Id: uuid("creator1_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  creator2Id: uuid("creator2_id")
    .references(() => users.id, { onDelete: "cascade" }),
  
  // Battle configuration
  title: text("title").notNull(),
  description: text("description"),
  duration: integer("duration").notNull().default(300), // seconds (5 mins default)
  battleType: text("battle_type").notNull().default("live"), // 'live', 'scheduled', 'instant'
  
  // Battle state
  status: text("status").notNull().default("waiting"), // 'waiting', 'live', 'ended', 'cancelled'
  startedAt: timestamp("started_at"),
  endedAt: timestamp("ended_at"),
  
  // Results
  winnerId: uuid("winner_id").references(() => users.id),
  creator1Score: integer("creator1_score").default(0), // SoftPoints received
  creator2Score: integer("creator2_score").default(0),
  totalGifts: decimal("total_gifts", { precision: 15, scale: 2 }).default("0"),
  totalViewers: integer("total_viewers").default(0),
  peakViewers: integer("peak_viewers").default(0),
  
  // Monetization
  totalBets: decimal("total_bets", { precision: 15, scale: 2 }).default("0"),
  betPool: decimal("bet_pool", { precision: 15, scale: 2 }).default("0"),
  
  // Media
  streamUrl: text("stream_url"),
  replayUrl: text("replay_url"),
  highlightUrl: text("highlight_url"),
  thumbnailUrl: text("thumbnail_url"),
  
  // Settings
  allowBetting: boolean("allow_betting").default(true),
  isPublic: boolean("is_public").default(true),
  isRecorded: boolean("is_recorded").default(true),
  
  // Metadata
  tags: text("tags").array(),
  metadata: jsonb("metadata"),
  
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Battle participants and invitations
export const battleInvitations = pgTable("battle_invitations", {
  id: uuid("id").primaryKey().defaultRandom(),
  battleId: uuid("battle_id")
    .notNull()
    .references(() => liveBattles.id, { onDelete: "cascade" }),
  inviterId: uuid("inviter_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  inviteeId: uuid("invitee_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  
  status: text("status").notNull().default("pending"), // 'pending', 'accepted', 'declined', 'expired'
  message: text("message"),
  
  sentAt: timestamp("sent_at").defaultNow(),
  respondedAt: timestamp("responded_at"),
  expiresAt: timestamp("expires_at").notNull(),
});

// Battle gifts and tips during live battles
export const battleGifts = pgTable("battle_gifts", {
  id: uuid("id").primaryKey().defaultRandom(),
  battleId: uuid("battle_id")
    .notNull()
    .references(() => liveBattles.id, { onDelete: "cascade" }),
  senderId: uuid("sender_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  recipientId: uuid("recipient_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }), // creator1 or creator2
  
  giftType: text("gift_type").notNull(), // 'rose', 'diamond', 'rocket', etc.
  quantity: integer("quantity").notNull().default(1),
  softPointsValue: decimal("soft_points_value", { precision: 10, scale: 2 }).notNull(),
  
  // Combo system
  isCombo: boolean("is_combo").default(false),
  comboCount: integer("combo_count").default(1),
  comboMultiplier: decimal("combo_multiplier", { precision: 5, scale: 2 }).default("1.0"),
  
  sentAt: timestamp("sent_at").defaultNow(),
});

// =============================================================================
// BETTING SYSTEM
// =============================================================================

export const battleBets = pgTable("battle_bets", {
  id: uuid("id").primaryKey().defaultRandom(),
  battleId: uuid("battle_id")
    .notNull()
    .references(() => liveBattles.id, { onDelete: "cascade" }),
  betterId: uuid("bettor_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  
  // Bet details
  creatorBetOn: uuid("creator_bet_on")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  betAmountSP: decimal("bet_amount_sp", { precision: 10, scale: 2 }).notNull(),
  odds: decimal("odds", { precision: 5, scale: 2 }).notNull().default("2.0"),
  
  // Results
  outcome: text("outcome"), // 'win', 'lose', 'refund'
  payoutSP: decimal("payout_sp", { precision: 10, scale: 2 }).default("0"),
  
  // Status
  status: text("status").notNull().default("active"), // 'active', 'locked', 'settled', 'cancelled'
  
  placedAt: timestamp("placed_at").defaultNow(),
  settledAt: timestamp("settled_at"),
});

// =============================================================================
// CREATOR TIER SYSTEM
// =============================================================================

export const creatorTiers = pgTable("creator_tiers", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id")
    .notNull()
    .unique()
    .references(() => users.id, { onDelete: "cascade" }),
  
  // Current tier
  currentTier: text("current_tier").notNull().default("rising_star"), // 'rising_star', 'pro_creator', 'legend'
  tierPoints: integer("tier_points").default(0),
  
  // Statistics for tier calculation
  totalViews: integer("total_views").default(0),
  totalDuets: integer("total_duets").default(0),
  battlesWon: integer("battles_won").default(0),
  battlesLost: integer("battles_lost").default(0),
  challengesWon: integer("challenges_won").default(0),
  totalEarnings: decimal("total_earnings", { precision: 15, scale: 2 }).default("0"),
  
  // Tier history
  tierHistory: jsonb("tier_history"), // Array of tier changes with timestamps
  
  // Achievements
  badges: text("badges").array(), // ['first_battle_win', 'viral_duet', 'challenge_master']
  achievements: jsonb("achievements"), // Detailed achievement data
  
  // Perks tracking
  monthlyBonus: decimal("monthly_bonus", { precision: 10, scale: 2 }).default("0"),
  featuredUntil: timestamp("featured_until"),
  hasLegendStatus: boolean("has_legend_status").default(false),
  
  lastCalculated: timestamp("last_calculated").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// =============================================================================
// DUET CHALLENGES SYSTEM
// =============================================================================

export const duetChallenges = pgTable("duet_challenges", {
  id: uuid("id").primaryKey().defaultRandom(),
  
  // Challenge details
  title: text("title").notNull(),
  description: text("description").notNull(),
  hashtag: text("hashtag").notNull().unique(), // e.g., "GlowUpChallenge"
  
  // Original post that started the challenge
  originalPostId: uuid("original_post_id")
    .notNull()
    .references(() => posts.id, { onDelete: "cascade" }),
  createdBy: uuid("created_by")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  
  // Challenge timing
  startDate: timestamp("start_date").notNull(),
  endDate: timestamp("end_date").notNull(),
  
  // Status
  status: text("status").notNull().default("active"), // 'draft', 'active', 'ended', 'archived'
  isSponsored: boolean("is_sponsored").default(false),
  isFeatured: boolean("is_featured").default(false),
  
  // Rewards
  firstPrize: decimal("first_prize", { precision: 10, scale: 2 }).default("100"),
  secondPrize: decimal("second_prize", { precision: 10, scale: 2 }).default("50"),
  thirdPrize: decimal("third_prize", { precision: 10, scale: 2 }).default("25"),
  participationReward: decimal("participation_reward", { precision: 10, scale: 2 }).default("5"),
  
  // Statistics
  totalSubmissions: integer("total_submissions").default(0),
  totalViews: integer("total_views").default(0),
  totalLikes: integer("total_likes").default(0),
  
  // Media
  bannerUrl: text("banner_url"),
  rules: text("rules"),
  
  // Metadata
  tags: text("tags").array(),
  metadata: jsonb("metadata"),
  
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Challenge submissions (links to duet posts)
export const challengeSubmissions = pgTable("challenge_submissions", {
  id: uuid("id").primaryKey().defaultRandom(),
  challengeId: uuid("challenge_id")
    .notNull()
    .references(() => duetChallenges.id, { onDelete: "cascade" }),
  postId: uuid("post_id")
    .notNull()
    .references(() => posts.id, { onDelete: "cascade" }),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  
  // Scoring
  score: decimal("score", { precision: 10, scale: 2 }).default("0"),
  ranking: integer("ranking"),
  
  // Engagement metrics at submission time
  views: integer("views").default(0),
  likes: integer("likes").default(0),
  comments: integer("comments").default(0),
  shares: integer("shares").default(0),
  
  // Status
  status: text("status").notNull().default("submitted"), // 'submitted', 'qualified', 'winner', 'disqualified'
  disqualificationReason: text("disqualification_reason"),
  
  // Rewards
  rewardEarned: decimal("reward_earned", { precision: 10, scale: 2 }).default("0"),
  rewardPaid: boolean("reward_paid").default(false),
  
  submittedAt: timestamp("submitted_at").defaultNow(),
  judgedAt: timestamp("judged_at"),
}, (table) => ({
  // Unique constraint: one submission per user per challenge
  unique: unique().on(table.challengeId, table.userId),
}));

// =============================================================================
// BATTLE HIGHLIGHTS & REPLAYS
// =============================================================================

export const battleHighlights = pgTable("battle_highlights", {
  id: uuid("id").primaryKey().defaultRandom(),
  battleId: uuid("battle_id")
    .notNull()
    .references(() => liveBattles.id, { onDelete: "cascade" }),
  
  // Highlight details
  title: text("title").notNull(),
  duration: integer("duration").notNull(), // seconds
  highlightUrl: text("highlight_url").notNull(),
  thumbnailUrl: text("thumbnail_url"),
  
  // Key moments included
  keyMoments: jsonb("key_moments"), // Array of timestamp + description
  topGifter: uuid("top_gifter_id").references(() => users.id),
  biggestGift: decimal("biggest_gift", { precision: 10, scale: 2 }),
  
  // Engagement
  views: integer("views").default(0),
  likes: integer("likes").default(0),
  shares: integer("shares").default(0),
  
  // Status
  status: text("status").notNull().default("processing"), // 'processing', 'ready', 'failed'
  isPublished: boolean("is_published").default(false),
  
  // Auto-generation metadata
  generatedAt: timestamp("generated_at").defaultNow(),
  processingTime: integer("processing_time"), // seconds
  
  createdAt: timestamp("created_at").defaultNow(),
});

// =============================================================================
// SOFTPOINTS REWARDS & TRANSACTIONS
// =============================================================================

export const rewardTransactions = pgTable("reward_transactions", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  
  // Transaction details
  type: text("type").notNull(), // 'battle_win', 'bet_win', 'challenge_win', 'tier_bonus', 'gift_received'
  amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
  description: text("description").notNull(),
  
  // Reference to source
  sourceType: text("source_type"), // 'battle', 'challenge', 'tier_upgrade', 'gift'
  sourceId: uuid("source_id"), // ID of the battle, challenge, etc.
  
  // Bonus multipliers
  baseAmount: decimal("base_amount", { precision: 10, scale: 2 }),
  multiplier: decimal("multiplier", { precision: 5, scale: 2 }).default("1.0"),
  bonusReason: text("bonus_reason"), // 'tier_bonus', 'combo_streak', 'first_win'
  
  // Status
  status: text("status").notNull().default("pending"), // 'pending', 'completed', 'failed'
  
  // Processing
  processedAt: timestamp("processed_at"),
  
  createdAt: timestamp("created_at").defaultNow(),
});

// =============================================================================
// ABUSE PREVENTION & LIMITS
// =============================================================================

export const userLimits = pgTable("user_limits", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id")
    .notNull()
    .unique()
    .references(() => users.id, { onDelete: "cascade" }),
  
  // Daily limits
  duetsToday: integer("duets_today").default(0),
  battlesToday: integer("battles_today").default(0),
  betsToday: integer("bets_today").default(0),
  
  // Trust score
  trustScore: integer("trust_score").default(100), // 0-100
  
  // Violation tracking
  flaggedContent: integer("flagged_content").default(0),
  warningsReceived: integer("warnings_received").default(0),
  
  // Restrictions
  isRestricted: boolean("is_restricted").default(false),
  restrictionReason: text("restriction_reason"),
  restrictionUntil: timestamp("restriction_until"),
  
  // Reset timestamps (for daily limits)
  lastDuetReset: timestamp("last_duet_reset").defaultNow(),
  lastBattleReset: timestamp("last_battle_reset").defaultNow(),
  lastBetReset: timestamp("last_bet_reset").defaultNow(),
  
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Content moderation flags
export const contentFlags = pgTable("content_flags", {
  id: uuid("id").primaryKey().defaultRandom(),
  
  // Flagged content
  contentType: text("content_type").notNull(), // 'post', 'battle', 'comment'
  contentId: uuid("content_id").notNull(),
  
  // Flagger info
  flaggedBy: uuid("flagged_by").references(() => users.id),
  flagType: text("flag_type").notNull(), // 'nsfw', 'spam', 'abuse', 'copyright'
  
  // AI detection
  aiConfidence: decimal("ai_confidence", { precision: 5, scale: 2 }),
  aiReason: text("ai_reason"),
  
  // Review status
  status: text("status").notNull().default("pending"), // 'pending', 'reviewed', 'approved', 'removed'
  reviewedBy: uuid("reviewed_by").references(() => users.id),
  reviewNotes: text("review_notes"),
  
  // Actions taken
  actionTaken: text("action_taken"), // 'none', 'warning', 'content_removed', 'user_suspended'
  
  flaggedAt: timestamp("flagged_at").defaultNow(),
  reviewedAt: timestamp("reviewed_at"),
});

// =============================================================================
// INDEXES FOR PERFORMANCE
// =============================================================================

// Battle indexes
export const battleStatusIdx = index("battle_status_idx").on(liveBattles.status);
export const battleCreator1Idx = index("battle_creator1_idx").on(liveBattles.creator1Id);
export const battleCreator2Idx = index("battle_creator2_idx").on(liveBattles.creator2Id);

// Betting indexes
export const battleBetsIdx = index("battle_bets_idx").on(battleBets.battleId);
export const bettorIdx = index("bettor_idx").on(battleBets.betterId);

// Challenge indexes
export const challengeStatusIdx = index("challenge_status_idx").on(duetChallenges.status);
export const challengeHashtagIdx = index("challenge_hashtag_idx").on(duetChallenges.hashtag);

// Tier indexes
export const tierUserIdx = index("tier_user_idx").on(creatorTiers.userId);
export const tierLevelIdx = index("tier_level_idx").on(creatorTiers.currentTier);

// =============================================================================
// INSERT SCHEMAS FOR VALIDATION
// =============================================================================

export const insertLiveBattleSchema = createInsertSchema(liveBattles).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  startedAt: true,
  endedAt: true,
});

export const insertBattleBetSchema = createInsertSchema(battleBets).omit({
  id: true,
  placedAt: true,
  settledAt: true,
});

export const insertCreatorTierSchema = createInsertSchema(creatorTiers).omit({
  id: true,
  lastCalculated: true,
  updatedAt: true,
});

export const insertDuetChallengeSchema = createInsertSchema(duetChallenges).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertChallengeSubmissionSchema = createInsertSchema(challengeSubmissions).omit({
  id: true,
  submittedAt: true,
  judgedAt: true,
});

export const insertRewardTransactionSchema = createInsertSchema(rewardTransactions).omit({
  id: true,
  createdAt: true,
  processedAt: true,
});

// =============================================================================
// TYPE EXPORTS
// =============================================================================

export type LiveBattle = typeof liveBattles.$inferSelect;
export type InsertLiveBattle = typeof liveBattles.$inferInsert;

export type BattleInvitation = typeof battleInvitations.$inferSelect;
export type InsertBattleInvitation = typeof battleInvitations.$inferInsert;

export type BattleGift = typeof battleGifts.$inferSelect;
export type InsertBattleGift = typeof battleGifts.$inferInsert;

export type BattleBet = typeof battleBets.$inferSelect;
export type InsertBattleBet = typeof battleBets.$inferInsert;

export type CreatorTier = typeof creatorTiers.$inferSelect;
export type InsertCreatorTier = typeof creatorTiers.$inferInsert;

export type DuetChallenge = typeof duetChallenges.$inferSelect;
export type InsertDuetChallenge = typeof duetChallenges.$inferInsert;

export type ChallengeSubmission = typeof challengeSubmissions.$inferSelect;
export type InsertChallengeSubmission = typeof challengeSubmissions.$inferInsert;

export type BattleHighlight = typeof battleHighlights.$inferSelect;
export type InsertBattleHighlight = typeof battleHighlights.$inferInsert;

export type RewardTransaction = typeof rewardTransactions.$inferSelect;
export type InsertRewardTransaction = typeof rewardTransactions.$inferInsert;

export type UserLimit = typeof userLimits.$inferSelect;
export type InsertUserLimit = typeof userLimits.$inferInsert;

export type ContentFlag = typeof contentFlags.$inferSelect;
export type InsertContentFlag = typeof contentFlags.$inferInsert;
