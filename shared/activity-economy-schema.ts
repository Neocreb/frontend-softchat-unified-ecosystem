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
  real,
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { users } from "./schema";

// =============================================================================
// ACTIVITY ECONOMY 2.0 - COMPREHENSIVE REWARD SYSTEM
// =============================================================================

// User Trust Scores and Activity Metrics
export const trustScores = pgTable("trust_scores", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),

  // Trust Score Metrics (0-100)
  currentScore: decimal("current_score", { precision: 5, scale: 2 }).default(
    "50",
  ),
  previousScore: decimal("previous_score", { precision: 5, scale: 2 }).default(
    "50",
  ),
  maxScore: decimal("max_score", { precision: 5, scale: 2 }).default("100"),

  // Trust Level and Multipliers
  trustLevel: text("trust_level").default("bronze"), // bronze, silver, gold, platinum, diamond
  rewardMultiplier: decimal("reward_multiplier", {
    precision: 3,
    scale: 2,
  }).default("1.0"),
  dailySoftPointsCap: integer("daily_soft_points_cap").default(100),

  // Activity Metrics
  totalActivities: integer("total_activities").default(0),
  diversityScore: decimal("diversity_score", {
    precision: 5,
    scale: 2,
  }).default("0"), // 0-100
  consistencyScore: decimal("consistency_score", {
    precision: 5,
    scale: 2,
  }).default("0"), // 0-100

  // Fraud Detection Flags
  suspiciousActivityCount: integer("suspicious_activity_count").default(0),
  lastSuspiciousActivity: timestamp("last_suspicious_activity"),
  isFrozen: boolean("is_frozen").default(false),
  freezeReason: text("freeze_reason"),
  frozenUntil: timestamp("frozen_until"),

  // Score History
  scoreHistory:
    jsonb("score_history").$type<
      Array<{ date: string; score: number; reason: string }>
    >(),

  // Calculation Metadata
  lastCalculatedAt: timestamp("last_calculated_at").defaultNow(),
  nextCalculationAt: timestamp("next_calculation_at"),

  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Activity Tracking and Rewards
export const activityLogs = pgTable("activity_logs", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),

  // Activity Details
  actionType: text("action_type").notNull(), // like_post, comment, share, post_content, list_product, etc.
  targetId: uuid("target_id"), // ID of the target (post, product, user, etc.)
  targetType: text("target_type"), // post, product, user, job, trade, etc.

  // Reward Calculation
  baseSoftPoints: decimal("base_soft_points", {
    precision: 10,
    scale: 2,
  }).default("0"),
  finalSoftPoints: decimal("final_soft_points", {
    precision: 10,
    scale: 2,
  }).default("0"),
  walletBonus: decimal("wallet_bonus", { precision: 20, scale: 8 }).default(
    "0",
  ),
  currency: text("currency").default("USDT"),

  // Decay and Multipliers
  decayFactor: decimal("decay_factor", { precision: 5, scale: 4 }).default(
    "1.0",
  ),
  trustMultiplier: decimal("trust_multiplier", {
    precision: 3,
    scale: 2,
  }).default("1.0"),
  qualityScore: decimal("quality_score", { precision: 3, scale: 2 }).default(
    "1.0",
  ),

  // Context and Fraud Detection
  context: jsonb("context").$type<{
    ip?: string;
    deviceId?: string;
    sessionId?: string;
    userAgent?: string;
    location?: string;
    timeSpent?: number;
    clickDepth?: number;
    referrer?: string;
  }>(),

  // Status and Processing
  status: text("status").default("confirmed"), // pending, confirmed, rejected, suspicious
  processedAt: timestamp("processed_at"),
  reviewedBy: uuid("reviewed_by").references(() => users.id),
  reviewNotes: text("review_notes"),

  // Daily Limits and Tracking
  dailyCount: integer("daily_count").default(1), // Count for this action type today
  weeklyCount: integer("weekly_count").default(1), // Count for this action type this week
  monthlyCount: integer("monthly_count").default(1), // Count for this action type this month

  // Metadata
  metadata: jsonb("metadata"), // Additional activity-specific data

  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Daily Activity Summaries (for performance optimization)
export const dailyActivitySummaries = pgTable(
  "daily_activity_summaries",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),

    date: timestamp("date").notNull(), // Date for this summary

    // Activity Counts
    totalActivities: integer("total_activities").default(0),
    uniqueActionTypes: integer("unique_action_types").default(0),
    socialActivities: integer("social_activities").default(0), // likes, comments, shares
    commercialActivities: integer("commercial_activities").default(0), // purchases, sales
    contentActivities: integer("content_activities").default(0), // posts, reels
    freelanceActivities: integer("freelance_activities").default(0), // bids, completions

    // Rewards Earned
    totalSoftPointsEarned: decimal("total_soft_points_earned", {
      precision: 15,
      scale: 2,
    }).default("0"),
    totalWalletBonusEarned: decimal("total_wallet_bonus_earned", {
      precision: 20,
      scale: 8,
    }).default("0"),

    // Quality Metrics
    averageQualityScore: decimal("average_quality_score", {
      precision: 3,
      scale: 2,
    }).default("0"),
    suspiciousActivities: integer("suspicious_activities").default(0),

    // Streak Tracking
    loginStreak: integer("login_streak").default(0),
    activityStreak: integer("activity_streak").default(0),

    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow(),
  },
  (table) => ({
    // Unique constraint for one summary per user per day
    unique: unique().on(table.userId, table.date),
  }),
);

// Referral System
export const referralLinks = pgTable("referral_links", {
  id: uuid("id").primaryKey().defaultRandom(),
  referrerId: uuid("referrer_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),

  // Referral Code and Link
  referralCode: text("referral_code").notNull().unique(),
  referralUrl: text("referral_url").notNull(),

  // Referral Type
  type: text("type").default("general"), // general, partner, campaign
  campaignId: uuid("campaign_id"), // For specific campaigns

  // Tracking
  clickCount: integer("click_count").default(0),
  signupCount: integer("signup_count").default(0),
  conversionCount: integer("conversion_count").default(0),

  // Rewards Configuration
  referrerReward: decimal("referrer_reward", {
    precision: 10,
    scale: 2,
  }).default("10"),
  refereeReward: decimal("referee_reward", { precision: 10, scale: 2 }).default(
    "5",
  ),
  revenueSharePercentage: decimal("revenue_share_percentage", {
    precision: 5,
    scale: 2,
  }).default("0"),

  // Status and Limits
  isActive: boolean("is_active").default(true),
  maxUses: integer("max_uses"), // null = unlimited
  currentUses: integer("current_uses").default(0),
  expiresAt: timestamp("expires_at"),

  // Metadata
  description: text("description"),
  metadata: jsonb("metadata"),

  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Referral Tracking
export const referralEvents = pgTable("referral_events", {
  id: uuid("id").primaryKey().defaultRandom(),
  referralLinkId: uuid("referral_link_id")
    .notNull()
    .references(() => referralLinks.id, { onDelete: "cascade" }),
  referrerId: uuid("referrer_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  refereeId: uuid("referee_id").references(() => users.id), // null until signup

  // Event Details
  eventType: text("event_type").notNull(), // click, signup, first_purchase, milestone_reached
  eventData: jsonb("event_data"), // Additional event information

  // Tracking Context
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  referrerUrl: text("referrer_url"),

  // Rewards
  referrerReward: decimal("referrer_reward", {
    precision: 10,
    scale: 2,
  }).default("0"),
  refereeReward: decimal("referee_reward", { precision: 10, scale: 2 }).default(
    "0",
  ),
  rewardStatus: text("reward_status").default("pending"), // pending, paid, cancelled

  // Processing
  processedAt: timestamp("processed_at"),
  paidAt: timestamp("paid_at"),

  createdAt: timestamp("created_at").defaultNow(),
});

// Daily Challenges and Quests
export const dailyChallenges = pgTable("daily_challenges", {
  id: uuid("id").primaryKey().defaultRandom(),

  // Challenge Details
  title: text("title").notNull(),
  description: text("description").notNull(),
  challengeType: text("challenge_type").notNull(), // daily, weekly, monthly, special

  // Requirements
  targetAction: text("target_action").notNull(), // post_content, like_posts, purchase_product, etc.
  targetCount: integer("target_count").default(1),
  targetValue: decimal("target_value", { precision: 15, scale: 2 }), // For value-based challenges

  // Rewards
  softPointsReward: decimal("soft_points_reward", {
    precision: 10,
    scale: 2,
  }).default("0"),
  walletReward: decimal("wallet_reward", { precision: 20, scale: 8 }).default(
    "0",
  ),
  specialReward: jsonb("special_reward"), // Badges, boosts, etc.

  // Timing
  startDate: timestamp("start_date").notNull(),
  endDate: timestamp("end_date").notNull(),
  resetPeriod: text("reset_period").default("daily"), // daily, weekly, monthly, none

  // Participation Limits
  maxParticipants: integer("max_participants"),
  currentParticipants: integer("current_participants").default(0),
  eligibilityCriteria: jsonb("eligibility_criteria"), // Trust score, activity level, etc.

  // Status
  isActive: boolean("is_active").default(true),
  isVisible: boolean("is_visible").default(true),

  // Admin
  createdBy: uuid("created_by").references(() => users.id),

  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// User Challenge Progress
export const challengeProgress = pgTable(
  "challenge_progress",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    challengeId: uuid("challenge_id")
      .notNull()
      .references(() => dailyChallenges.id, { onDelete: "cascade" }),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),

    // Progress Tracking
    currentProgress: integer("current_progress").default(0),
    currentValue: decimal("current_value", { precision: 15, scale: 2 }).default(
      "0",
    ),
    isCompleted: boolean("is_completed").default(false),
    completedAt: timestamp("completed_at"),

    // Reward Status
    rewardClaimed: boolean("reward_claimed").default(false),
    rewardClaimedAt: timestamp("reward_claimed_at"),

    // Metadata
    progressData: jsonb("progress_data"), // Detailed progress information

    // Reset Tracking (for recurring challenges)
    lastResetAt: timestamp("last_reset_at"),
    completionCount: integer("completion_count").default(0), // How many times completed

    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow(),
  },
  (table) => ({
    // Unique constraint for one progress per user per challenge
    unique: unique().on(table.userId, table.challengeId),
  }),
);

// Reward Rules Configuration (Admin controlled)
export const rewardRules = pgTable("reward_rules", {
  id: uuid("id").primaryKey().defaultRandom(),

  // Rule Identification
  actionType: text("action_type").notNull().unique(),
  displayName: text("display_name").notNull(),
  description: text("description"),

  // Base Rewards
  baseSoftPoints: decimal("base_soft_points", {
    precision: 10,
    scale: 2,
  }).default("0"),
  baseWalletBonus: decimal("base_wallet_bonus", {
    precision: 20,
    scale: 8,
  }).default("0"),
  currency: text("currency").default("USDT"),

  // Limits and Conditions
  dailyLimit: integer("daily_limit"), // null = unlimited
  weeklyLimit: integer("weekly_limit"),
  monthlyLimit: integer("monthly_limit"),
  minimumTrustScore: decimal("minimum_trust_score", {
    precision: 5,
    scale: 2,
  }).default("0"),
  minimumValue: decimal("minimum_value", { precision: 15, scale: 2 }), // For value-based rewards

  // Decay Configuration
  decayEnabled: boolean("decay_enabled").default(true),
  decayStart: integer("decay_start").default(1), // After how many actions decay starts
  decayRate: decimal("decay_rate", { precision: 5, scale: 4 }).default("0.1"), // Exponential decay rate
  minMultiplier: decimal("min_multiplier", { precision: 3, scale: 2 }).default(
    "0.1",
  ), // Minimum decay multiplier

  // Quality Requirements
  requiresModeration: boolean("requires_moderation").default(false),
  qualityThreshold: decimal("quality_threshold", {
    precision: 3,
    scale: 2,
  }).default("0"),

  // Special Conditions
  conditions: jsonb("conditions"), // Complex conditions as JSON

  // Status
  isActive: boolean("is_active").default(true),
  activeFrom: timestamp("active_from"),
  activeTo: timestamp("active_to"),

  // Admin
  createdBy: uuid("created_by").references(() => users.id),
  lastModifiedBy: uuid("last_modified_by").references(() => users.id),

  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Fraud Detection Logs
export const fraudDetectionLogs = pgTable("fraud_detection_logs", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),

  // Detection Details
  riskScore: decimal("risk_score", { precision: 5, scale: 2 }).notNull(), // 0-100
  riskLevel: text("risk_level").notNull(), // low, medium, high, critical
  detectionMethod: text("detection_method").notNull(), // rule_based, ml_model, manual_review

  // Flagged Activity
  activityLogId: uuid("activity_log_id").references(() => activityLogs.id),
  flaggedActions: jsonb("flagged_actions").$type<string[]>(), // Array of action types

  // Risk Factors
  riskFactors: jsonb("risk_factors").$type<
    Array<{
      factor: string;
      weight: number;
      description: string;
    }>
  >(),

  // Patterns Detected
  patterns: jsonb("patterns").$type<
    Array<{
      pattern: string;
      confidence: number;
      description: string;
    }>
  >(),

  // Action Taken
  actionTaken: text("action_taken"), // none, flag, reduce_rewards, freeze_account, manual_review
  actionReason: text("action_reason"),
  actionTakenBy: uuid("action_taken_by").references(() => users.id),
  actionTakenAt: timestamp("action_taken_at"),

  // Review Status
  reviewStatus: text("review_status").default("pending"), // pending, reviewing, resolved, false_positive
  reviewedBy: uuid("reviewed_by").references(() => users.id),
  reviewNotes: text("review_notes"),
  reviewedAt: timestamp("reviewed_at"),

  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Boost Shop Items
export const boostShopItems = pgTable("boost_shop_items", {
  id: uuid("id").primaryKey().defaultRandom(),

  // Item Details
  name: text("name").notNull(),
  description: text("description").notNull(),
  category: text("category").notNull(), // content_boost, profile_boost, reward_multiplier, etc.

  // Pricing
  softPointsCost: decimal("soft_points_cost", {
    precision: 10,
    scale: 2,
  }).default("0"),
  walletCost: decimal("wallet_cost", { precision: 20, scale: 8 }).default("0"),
  currency: text("currency").default("USDT"),

  // Boost Effects
  boostType: text("boost_type").notNull(), // multiplier, reach, visibility, etc.
  boostValue: decimal("boost_value", { precision: 10, scale: 4 }).notNull(),
  duration: integer("duration"), // Duration in hours, null = permanent

  // Availability
  isActive: boolean("is_active").default(true),
  stockQuantity: integer("stock_quantity"), // null = unlimited
  maxPurchasesPerUser: integer("max_purchases_per_user"), // null = unlimited
  requiredTrustScore: decimal("required_trust_score", {
    precision: 5,
    scale: 2,
  }).default("0"),

  // Display
  iconUrl: text("icon_url"),
  imageUrl: text("image_url"),
  sortOrder: integer("sort_order").default(0),

  // Admin
  createdBy: uuid("created_by").references(() => users.id),

  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// User Boost Purchases
export const userBoosts = pgTable("user_boosts", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  boostItemId: uuid("boost_item_id")
    .notNull()
    .references(() => boostShopItems.id),

  // Purchase Details
  pricePaid: decimal("price_paid", { precision: 20, scale: 8 }).notNull(),
  currency: text("currency").notNull(),
  paymentMethod: text("payment_method").notNull(), // soft_points, wallet

  // Boost Status
  isActive: boolean("is_active").default(true),
  activatedAt: timestamp("activated_at"),
  expiresAt: timestamp("expires_at"),

  // Usage Tracking
  usageCount: integer("usage_count").default(0),
  maxUsage: integer("max_usage"), // null = unlimited

  // Effects Applied
  boostData: jsonb("boost_data"), // Specific boost configuration

  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// =============================================================================
// TYPE EXPORTS
// =============================================================================

export type TrustScore = typeof trustScores.$inferSelect;
export type ActivityLog = typeof activityLogs.$inferSelect;
export type DailyActivitySummary = typeof dailyActivitySummaries.$inferSelect;
export type ReferralLink = typeof referralLinks.$inferSelect;
export type ReferralEvent = typeof referralEvents.$inferSelect;
export type DailyChallenge = typeof dailyChallenges.$inferSelect;
export type ChallengeProgress = typeof challengeProgress.$inferSelect;
export type RewardRule = typeof rewardRules.$inferSelect;
export type FraudDetectionLog = typeof fraudDetectionLogs.$inferSelect;
export type BoostShopItem = typeof boostShopItems.$inferSelect;
export type UserBoost = typeof userBoosts.$inferSelect;

export type InsertTrustScore = typeof trustScores.$inferInsert;
export type InsertActivityLog = typeof activityLogs.$inferInsert;
export type InsertDailyActivitySummary =
  typeof dailyActivitySummaries.$inferInsert;
export type InsertReferralLink = typeof referralLinks.$inferInsert;
export type InsertReferralEvent = typeof referralEvents.$inferInsert;
export type InsertDailyChallenge = typeof dailyChallenges.$inferInsert;
export type InsertChallengeProgress = typeof challengeProgress.$inferInsert;
export type InsertRewardRule = typeof rewardRules.$inferInsert;
export type InsertFraudDetectionLog = typeof fraudDetectionLogs.$inferInsert;
export type InsertBoostShopItem = typeof boostShopItems.$inferInsert;
export type InsertUserBoost = typeof userBoosts.$inferInsert;

// =============================================================================
// VALIDATION SCHEMAS
// =============================================================================

export const insertTrustScoreSchema = createInsertSchema(trustScores).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertActivityLogSchema = createInsertSchema(activityLogs).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertRewardRuleSchema = createInsertSchema(rewardRules).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

// Activity types enum for validation
export const ACTIVITY_TYPES = [
  "sign_up",
  "daily_login",
  "complete_profile",
  "post_content",
  "like_post",
  "comment_post",
  "share_content",
  "receive_like",
  "receive_comment",
  "list_product",
  "purchase_product",
  "sell_product",
  "bid_job",
  "complete_freelance_milestone",
  "hire_freelancer",
  "p2p_trade",
  "convert_crypto",
  "refer_user",
  "subscribe_creator",
  "tip_creator",
  "watch_video",
  "join_community",
  "participate_challenge",
] as const;

export type ActivityType = (typeof ACTIVITY_TYPES)[number];
