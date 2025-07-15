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
import { users, profiles } from "./schema";

// =============================================================================
// CREATOR ECONOMY SYSTEM - REVENUE & SOFT POINTS
// =============================================================================

// Creator earnings tracking - all monetized actions
export const creatorEarnings = pgTable("creator_earnings", {
  id: uuid("id").primaryKey().defaultRandom(),
  creatorId: uuid("creator_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),

  // Revenue source and details
  revenueType: text("revenue_type").notNull(), // 'views', 'tips', 'subscriptions', 'boosts', 'services', 'marketplace'
  sourceId: uuid("source_id"), // ID of the related content/service/transaction
  contentId: uuid("content_id"), // Related post/video ID if applicable

  // Financial amounts
  grossAmount: decimal("gross_amount", { precision: 20, scale: 8 }).notNull(),
  platformFee: decimal("platform_fee", { precision: 20, scale: 8 }).default(
    "0",
  ),
  netAmount: decimal("net_amount", { precision: 20, scale: 8 }).notNull(),
  currency: text("currency").default("USD"),

  // SoftPoints earned
  softPointsEarned: decimal("soft_points_earned", {
    precision: 20,
    scale: 2,
  }).default("0"),

  // Context and metadata
  description: text("description"),
  metadata: jsonb("metadata"), // Additional flexible data

  // Related user (tipper, subscriber, etc.)
  fromUserId: uuid("from_user_id").references(() => users.id),

  // Calculation details
  calculationBase: jsonb("calculation_base"), // Base metrics used (views, tips, etc.)
  calculationRate: decimal("calculation_rate", { precision: 10, scale: 4 }), // Rate used for calculation

  // Status
  status: text("status").default("pending"), // 'pending', 'confirmed', 'paid', 'disputed'
  confirmedAt: timestamp("confirmed_at"),
  paidAt: timestamp("paid_at"),

  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// SoftPoints transaction log
export const softPointsLog = pgTable("soft_points_log", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),

  // Transaction details
  transactionType: text("transaction_type").notNull(), // 'earned', 'spent', 'bonus', 'penalty', 'transfer'
  amount: decimal("amount", { precision: 20, scale: 2 }).notNull(),

  // Source of SoftPoints
  sourceType: text("source_type"), // 'views', 'tips', 'subscriptions', 'boost_payment', 'referral', 'bonus'
  sourceId: uuid("source_id"), // Related earnings or transaction ID
  contentId: uuid("content_id"), // Related content if applicable

  // Balance tracking
  balanceBefore: decimal("balance_before", {
    precision: 20,
    scale: 2,
  }).notNull(),
  balanceAfter: decimal("balance_after", { precision: 20, scale: 2 }).notNull(),

  // Description and metadata
  description: text("description"),
  metadata: jsonb("metadata"),

  // Admin fields
  adminId: uuid("admin_id").references(() => users.id), // If manually adjusted by admin
  adminNotes: text("admin_notes"),

  createdAt: timestamp("created_at").defaultNow(),
});

// Content monetization tracking
export const monetizedContent = pgTable("monetized_content", {
  id: uuid("id").primaryKey().defaultRandom(),
  contentId: uuid("content_id").notNull(), // Post/video ID
  creatorId: uuid("creator_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),

  // Content details
  contentType: text("content_type").notNull(), // 'post', 'video', 'story', 'reel'
  title: text("title"),

  // Monetization settings
  isMonetized: boolean("is_monetized").default(true),
  monetizationTypes: text("monetization_types").array(), // ['views', 'tips', 'subscriptions']

  // Performance metrics
  totalViews: integer("total_views").default(0),
  uniqueViews: integer("unique_views").default(0),
  totalTips: decimal("total_tips", { precision: 10, scale: 2 }).default("0"),
  tipCount: integer("tip_count").default(0),
  totalRevenue: decimal("total_revenue", { precision: 10, scale: 2 }).default(
    "0",
  ),
  totalSoftPoints: decimal("total_soft_points", {
    precision: 20,
    scale: 2,
  }).default("0"),

  // Engagement metrics
  likes: integer("likes").default(0),
  comments: integer("comments").default(0),
  shares: integer("shares").default(0),
  bookmarks: integer("bookmarks").default(0),

  // Boost/promotion
  isBoosted: boolean("is_boosted").default(false),
  boostedUntil: timestamp("boosted_until"),
  boostType: text("boost_type"), // 'basic', 'premium', 'featured'

  // Revenue calculation
  lastRevenueCalculation: timestamp("last_revenue_calculation"),
  nextCalculationDue: timestamp("next_calculation_due"),

  // Admin moderation
  isApproved: boolean("is_approved").default(true),
  moderationStatus: text("moderation_status").default("approved"), // 'pending', 'approved', 'rejected', 'flagged'
  moderatedBy: uuid("moderated_by").references(() => users.id),
  moderationNotes: text("moderation_notes"),

  publishedAt: timestamp("published_at").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Creator subscriptions system
export const creatorSubscriptions = pgTable("creator_subscriptions", {
  id: uuid("id").primaryKey().defaultRandom(),
  creatorId: uuid("creator_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  subscriberId: uuid("subscriber_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),

  // Subscription details
  tier: text("tier").notNull(), // 'basic', 'premium', 'vip'
  monthlyPrice: decimal("monthly_price", { precision: 10, scale: 2 }).notNull(),
  currency: text("currency").default("USD"),

  // Billing
  billingCycle: text("billing_cycle").default("monthly"), // 'monthly', 'yearly'
  status: text("status").default("active"), // 'active', 'paused', 'cancelled', 'expired'

  // Subscription period
  startDate: timestamp("start_date").notNull(),
  endDate: timestamp("end_date"),
  nextBillingDate: timestamp("next_billing_date"),

  // Payment tracking
  lastPaymentAt: timestamp("last_payment_at"),
  totalPaid: decimal("total_paid", { precision: 15, scale: 2 }).default("0"),
  paymentFailures: integer("payment_failures").default(0),

  // Benefits
  benefits: jsonb("benefits"), // Access to exclusive content, etc.
  softPointsBonus: decimal("soft_points_bonus", {
    precision: 10,
    scale: 2,
  }).default("0"),

  // Cancellation
  cancelledAt: timestamp("cancelled_at"),
  cancellationReason: text("cancellation_reason"),

  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Creator boost campaigns
export const creatorBoosts = pgTable("creator_boosts", {
  id: uuid("id").primaryKey().defaultRandom(),
  creatorId: uuid("creator_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),

  // Boost target
  targetType: text("target_type").notNull(), // 'content', 'profile', 'all_content'
  targetId: uuid("target_id"), // Content ID if targeting specific content

  // Boost configuration
  boostType: text("boost_type").notNull(), // 'basic', 'premium', 'featured', 'trending'
  duration: integer("duration").notNull(), // Duration in hours
  priority: integer("priority").default(1),

  // Cost and payment
  cost: decimal("cost", { precision: 10, scale: 2 }).notNull(),
  paymentMethod: text("payment_method").notNull(), // 'soft_points', 'wallet_usd', 'wallet_crypto'
  paymentTransactionId: uuid("payment_transaction_id"),

  // Status and timing
  status: text("status").default("pending"), // 'pending', 'active', 'completed', 'cancelled', 'rejected'
  startDate: timestamp("start_date"),
  endDate: timestamp("end_date"),

  // Performance metrics
  impressions: integer("impressions").default(0),
  clicks: integer("clicks").default(0),
  engagements: integer("engagements").default(0),
  conversions: integer("conversions").default(0),

  // ROI tracking
  additionalViews: integer("additional_views").default(0),
  additionalRevenue: decimal("additional_revenue", {
    precision: 10,
    scale: 2,
  }).default("0"),
  roi: decimal("roi", { precision: 10, scale: 2 }), // Return on investment percentage

  // Admin approval
  requiresApproval: boolean("requires_approval").default(false),
  approvedBy: uuid("approved_by").references(() => users.id),
  approvedAt: timestamp("approved_at"),
  rejectionReason: text("rejection_reason"),

  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Revenue history for detailed tracking
export const revenueHistory = pgTable("revenue_history", {
  id: uuid("id").primaryKey().defaultRandom(),
  creatorId: uuid("creator_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),

  // Time period
  period: text("period").notNull(), // 'daily', 'weekly', 'monthly'
  periodStart: timestamp("period_start").notNull(),
  periodEnd: timestamp("period_end").notNull(),

  // Revenue breakdown
  totalRevenue: decimal("total_revenue", { precision: 15, scale: 2 }).default(
    "0",
  ),
  tipsRevenue: decimal("tips_revenue", { precision: 15, scale: 2 }).default(
    "0",
  ),
  subscriptionsRevenue: decimal("subscriptions_revenue", {
    precision: 15,
    scale: 2,
  }).default("0"),
  viewsRevenue: decimal("views_revenue", { precision: 15, scale: 2 }).default(
    "0",
  ),
  servicesRevenue: decimal("services_revenue", {
    precision: 15,
    scale: 2,
  }).default("0"),
  boostsSpent: decimal("boosts_spent", { precision: 15, scale: 2 }).default(
    "0",
  ),

  // SoftPoints summary
  softPointsEarned: decimal("soft_points_earned", {
    precision: 20,
    scale: 2,
  }).default("0"),
  softPointsSpent: decimal("soft_points_spent", {
    precision: 20,
    scale: 2,
  }).default("0"),
  softPointsBalance: decimal("soft_points_balance", {
    precision: 20,
    scale: 2,
  }).default("0"),

  // Performance metrics
  totalViews: integer("total_views").default(0),
  totalTips: integer("total_tips").default(0),
  activeSubscribers: integer("active_subscribers").default(0),
  contentPublished: integer("content_published").default(0),

  // Calculations
  calculatedAt: timestamp("calculated_at").defaultNow(),
  calculationVersion: text("calculation_version").default("1.0"),

  createdAt: timestamp("created_at").defaultNow(),
});

// Platform revenue settings and rates
export const revenueSettings = pgTable("revenue_settings", {
  id: uuid("id").primaryKey().defaultRandom(),

  // Setting identification
  category: text("category").notNull(), // 'views', 'tips', 'subscriptions', 'boosts'
  settingKey: text("setting_key").notNull(),

  // Rate configuration
  rate: decimal("rate", { precision: 10, scale: 6 }).notNull(), // Rate per unit (views, tip, etc.)
  currency: text("currency").default("USD"),
  softPointsRate: decimal("soft_points_rate", { precision: 10, scale: 2 }), // SoftPoints per unit

  // Conditions
  minThreshold: decimal("min_threshold", { precision: 15, scale: 2 }).default(
    "0",
  ),
  maxThreshold: decimal("max_threshold", { precision: 15, scale: 2 }),
  tierConditions: jsonb("tier_conditions"), // Creator tier requirements

  // Status
  isActive: boolean("is_active").default(true),
  effectiveFrom: timestamp("effective_from").notNull(),
  effectiveTo: timestamp("effective_to"),

  // Admin
  createdBy: uuid("created_by")
    .notNull()
    .references(() => users.id),
  description: text("description"),

  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Creator payout requests
export const creatorPayouts = pgTable("creator_payouts", {
  id: uuid("id").primaryKey().defaultRandom(),
  creatorId: uuid("creator_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),

  // Payout details
  amount: decimal("amount", { precision: 15, scale: 2 }).notNull(),
  currency: text("currency").default("USD"),
  payoutMethod: text("payout_method").notNull(), // 'bank_transfer', 'crypto_wallet', 'paypal'

  // Payment destination
  paymentDetails: jsonb("payment_details"), // Bank account, wallet address, etc.

  // Status tracking
  status: text("status").default("pending"), // 'pending', 'processing', 'completed', 'failed', 'cancelled'
  requestedAt: timestamp("requested_at").defaultNow(),
  processedAt: timestamp("processed_at"),
  completedAt: timestamp("completed_at"),

  // Processing details
  processingFee: decimal("processing_fee", { precision: 10, scale: 2 }).default(
    "0",
  ),
  netAmount: decimal("net_amount", { precision: 15, scale: 2 }).notNull(),
  transactionId: text("transaction_id"), // External transaction ID

  // Admin processing
  processedBy: uuid("processed_by").references(() => users.id),
  adminNotes: text("admin_notes"),
  rejectionReason: text("rejection_reason"),

  // Metadata
  metadata: jsonb("metadata"),

  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Creator tiers and benefits
export const creatorTiers = pgTable("creator_tiers", {
  id: uuid("id").primaryKey().defaultRandom(),
  creatorId: uuid("creator_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),

  // Tier information
  currentTier: text("current_tier").default("bronze"), // 'bronze', 'silver', 'gold', 'platinum', 'diamond'
  previousTier: text("previous_tier"),

  // Tier requirements tracking
  totalRevenue: decimal("total_revenue", { precision: 15, scale: 2 }).default(
    "0",
  ),
  totalViews: integer("total_views").default(0),
  totalSubscribers: integer("total_subscribers").default(0),
  contentCount: integer("content_count").default(0),
  averageRating: decimal("average_rating", { precision: 3, scale: 2 }).default(
    "0",
  ),

  // Tier benefits
  revenueBonus: decimal("revenue_bonus", { precision: 5, scale: 2 }).default(
    "0",
  ), // % bonus
  softPointsMultiplier: decimal("soft_points_multiplier", {
    precision: 3,
    scale: 2,
  }).default("1.0"),
  prioritySupport: boolean("priority_support").default(false),
  customBadge: text("custom_badge"),

  // Calculation
  lastCalculated: timestamp("last_calculated").defaultNow(),
  nextReview: timestamp("next_review"),
  tierAchievedAt: timestamp("tier_achieved_at"),

  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// =============================================================================
// WALLET INTEGRATION FOR CREATOR EARNINGS
// =============================================================================

// Enhanced wallet transactions for creator economy
export const creatorWalletTransactions = pgTable(
  "creator_wallet_transactions",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),

    // Transaction classification
    transactionType: text("transaction_type").notNull(), // 'earnings_deposit', 'payout_withdrawal', 'boost_payment', 'tip_received', 'subscription_payment'
    category: text("category").notNull(), // 'creator_economy', 'marketplace', 'crypto', 'freelance'

    // Amounts
    amount: decimal("amount", { precision: 20, scale: 8 }).notNull(),
    currency: text("currency").notNull(),
    platformFee: decimal("platform_fee", { precision: 20, scale: 8 }).default(
      "0",
    ),
    netAmount: decimal("net_amount", { precision: 20, scale: 8 }).notNull(),

    // SoftPoints
    softPointsAmount: decimal("soft_points_amount", {
      precision: 20,
      scale: 2,
    }).default("0"),

    // References
    sourceType: text("source_type"), // 'creator_earnings', 'tip_transaction', 'subscription', 'boost'
    sourceId: uuid("source_id"),
    relatedUserId: uuid("related_user_id").references(() => users.id),

    // Status
    status: text("status").default("pending"), // 'pending', 'confirmed', 'failed', 'cancelled'

    // Metadata
    description: text("description"),
    metadata: jsonb("metadata"),

    createdAt: timestamp("created_at").defaultNow(),
    confirmedAt: timestamp("confirmed_at"),
  },
);

// =============================================================================
// INDEXES FOR PERFORMANCE
// =============================================================================

// Creator earnings indexes
export const creatorEarningsCreatorIdx = index(
  "creator_earnings_creator_idx",
).on(creatorEarnings.creatorId);
export const creatorEarningsTypeIdx = index("creator_earnings_type_idx").on(
  creatorEarnings.revenueType,
);
export const creatorEarningsDateIdx = index("creator_earnings_date_idx").on(
  creatorEarnings.createdAt,
);

// SoftPoints log indexes
export const softPointsLogUserIdx = index("soft_points_log_user_idx").on(
  softPointsLog.userId,
);
export const softPointsLogTypeIdx = index("soft_points_log_type_idx").on(
  softPointsLog.transactionType,
);

// Monetized content indexes
export const monetizedContentCreatorIdx = index(
  "monetized_content_creator_idx",
).on(monetizedContent.creatorId);
export const monetizedContentIdx = index("monetized_content_content_idx").on(
  monetizedContent.contentId,
);

// =============================================================================
// INSERT SCHEMAS FOR VALIDATION
// =============================================================================

export const insertCreatorEarningsSchema = createInsertSchema(
  creatorEarnings,
).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  confirmedAt: true,
  paidAt: true,
});

export const insertSoftPointsLogSchema = createInsertSchema(softPointsLog).omit(
  {
    id: true,
    createdAt: true,
  },
);

export const insertMonetizedContentSchema = createInsertSchema(
  monetizedContent,
).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  lastRevenueCalculation: true,
});

export const insertCreatorSubscriptionSchema = createInsertSchema(
  creatorSubscriptions,
).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  lastPaymentAt: true,
  cancelledAt: true,
});

export const insertCreatorBoostSchema = createInsertSchema(creatorBoosts).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  approvedAt: true,
});

export const insertCreatorPayoutSchema = createInsertSchema(
  creatorPayouts,
).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  processedAt: true,
  completedAt: true,
});

export const insertRevenueSettingsSchema = createInsertSchema(
  revenueSettings,
).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

// =============================================================================
// TYPE EXPORTS
// =============================================================================

export type CreatorEarnings = typeof creatorEarnings.$inferSelect;
export type SoftPointsLog = typeof softPointsLog.$inferSelect;
export type MonetizedContent = typeof monetizedContent.$inferSelect;
export type CreatorSubscription = typeof creatorSubscriptions.$inferSelect;
export type CreatorBoost = typeof creatorBoosts.$inferSelect;
export type RevenueHistory = typeof revenueHistory.$inferSelect;
export type RevenueSettings = typeof revenueSettings.$inferSelect;
export type CreatorPayout = typeof creatorPayouts.$inferSelect;
export type CreatorTier = typeof creatorTiers.$inferSelect;
export type CreatorWalletTransaction =
  typeof creatorWalletTransactions.$inferSelect;

export type InsertCreatorEarnings = typeof creatorEarnings.$inferInsert;
export type InsertSoftPointsLog = typeof softPointsLog.$inferInsert;
export type InsertMonetizedContent = typeof monetizedContent.$inferInsert;
export type InsertCreatorSubscription =
  typeof creatorSubscriptions.$inferInsert;
export type InsertCreatorBoost = typeof creatorBoosts.$inferInsert;
export type InsertCreatorPayout = typeof creatorPayouts.$inferInsert;
export type InsertRevenueSettings = typeof revenueSettings.$inferInsert;
