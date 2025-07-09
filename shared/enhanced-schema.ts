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
// WALLET & TRANSACTION SYSTEM
// =============================================================================

export const wallets = pgTable("wallets", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  // Multi-currency support
  usdtBalance: decimal("usdt_balance", { precision: 20, scale: 8 }).default(
    "0",
  ),
  ethBalance: decimal("eth_balance", { precision: 20, scale: 8 }).default("0"),
  btcBalance: decimal("btc_balance", { precision: 20, scale: 8 }).default("0"),
  softPointsBalance: decimal("soft_points_balance", {
    precision: 20,
    scale: 2,
  }).default("0"),

  // Wallet security
  isActive: boolean("is_active").default(true),
  isFrozen: boolean("is_frozen").default(false),
  freezeReason: text("freeze_reason"),
  frozenBy: uuid("frozen_by").references(() => users.id),
  frozenAt: timestamp("frozen_at"),

  // Backup and recovery
  backupSeed: text("backup_seed"), // Encrypted seed phrase
  lastBackupAt: timestamp("last_backup_at"),

  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const walletTransactions = pgTable("wallet_transactions", {
  id: uuid("id").primaryKey().defaultRandom(),
  walletId: uuid("wallet_id")
    .notNull()
    .references(() => wallets.id, { onDelete: "cascade" }),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),

  // Transaction details
  type: text("type").notNull(), // 'deposit', 'withdrawal', 'transfer', 'trade', 'escrow_lock', 'escrow_release', 'fee', 'boost_payment', 'premium_payment'
  currency: text("currency").notNull(), // 'USDT', 'ETH', 'BTC', 'SOFT_POINTS'
  amount: decimal("amount", { precision: 20, scale: 8 }).notNull(),
  fee: decimal("fee", { precision: 20, scale: 8 }).default("0"),
  netAmount: decimal("net_amount", { precision: 20, scale: 8 }).notNull(),

  // References
  referenceType: text("reference_type"), // 'freelance_job', 'marketplace_order', 'p2p_trade', 'boost', 'premium'
  referenceId: uuid("reference_id"),
  relatedUserId: uuid("related_user_id").references(() => users.id), // Other party in transaction

  // External transaction data
  externalTxHash: text("external_tx_hash"), // Blockchain transaction hash
  externalTxId: text("external_tx_id"), // Payment processor transaction ID

  // Status and confirmation
  status: text("status").default("pending"), // 'pending', 'confirmed', 'failed', 'cancelled'
  confirmations: integer("confirmations").default(0),
  requiredConfirmations: integer("required_confirmations").default(1),

  // Metadata
  description: text("description"),
  metadata: jsonb("metadata"), // Additional transaction data

  createdAt: timestamp("created_at").defaultNow(),
  confirmedAt: timestamp("confirmed_at"),
});

// =============================================================================
// ESCROW SYSTEM (Enhanced for all modules)
// =============================================================================

export const escrowContracts = pgTable("escrow_contracts", {
  id: uuid("id").primaryKey().defaultRandom(),

  // Parties involved
  payerId: uuid("payer_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  payeeId: uuid("payee_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),

  // Contract details
  type: text("type").notNull(), // 'freelance', 'marketplace', 'p2p_trade'
  referenceId: uuid("reference_id").notNull(), // ID of the related job, order, or trade

  // Financial details
  currency: text("currency").notNull(),
  amount: decimal("amount", { precision: 20, scale: 8 }).notNull(),
  platformFee: decimal("platform_fee", { precision: 20, scale: 8 }).default(
    "0",
  ),
  feePercentage: decimal("fee_percentage", { precision: 5, scale: 2 }).default(
    "0",
  ),

  // Terms and conditions
  terms: text("terms").notNull(),
  autoReleaseHours: integer("auto_release_hours").default(72), // Auto-release after X hours

  // Status tracking
  status: text("status").default("created"), // 'created', 'funded', 'disputed', 'released', 'refunded', 'expired'
  fundedAt: timestamp("funded_at"),
  releasedAt: timestamp("released_at"),
  refundedAt: timestamp("refunded_at"),
  expiresAt: timestamp("expires_at"),

  // Release conditions
  releaseCondition: text("release_condition").default("manual"), // 'manual', 'auto', 'milestone'
  releaseApprovedBy: uuid("release_approved_by").references(() => users.id),
  releaseNotes: text("release_notes"),

  // Dispute handling
  disputeId: uuid("dispute_id"),
  disputeReason: text("dispute_reason"),

  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const escrowMilestones = pgTable("escrow_milestones", {
  id: uuid("id").primaryKey().defaultRandom(),
  escrowId: uuid("escrow_id")
    .notNull()
    .references(() => escrowContracts.id, { onDelete: "cascade" }),

  title: text("title").notNull(),
  description: text("description"),
  amount: decimal("amount", { precision: 20, scale: 8 }).notNull(),
  dueDate: timestamp("due_date"),

  status: text("status").default("pending"), // 'pending', 'submitted', 'approved', 'released'
  submittedAt: timestamp("submitted_at"),
  approvedAt: timestamp("approved_at"),
  releasedAt: timestamp("released_at"),

  deliverables: jsonb("deliverables"), // Array of file URLs or descriptions
  reviewNotes: text("review_notes"),

  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// =============================================================================
// BOOST & PREMIUM SYSTEM
// =============================================================================

export const boosts = pgTable("boosts", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),

  // Boost target
  type: text("type").notNull(), // 'freelance_job', 'product', 'post', 'profile'
  referenceId: uuid("reference_id").notNull(),

  // Boost configuration
  boostType: text("boost_type").notNull(), // 'featured', 'top_listing', 'premium_placement', 'highlight'
  duration: integer("duration").notNull(), // Duration in hours
  priority: integer("priority").default(1), // Higher number = higher priority

  // Financial details
  cost: decimal("cost", { precision: 10, scale: 2 }).notNull(),
  currency: text("currency").default("SOFT_POINTS"), // 'SOFT_POINTS', 'USDT'
  paymentMethod: text("payment_method").notNull(), // 'wallet', 'premium_credits'

  // Status and timing
  status: text("status").default("pending"), // 'pending', 'active', 'completed', 'cancelled', 'rejected'
  approvedBy: uuid("approved_by").references(() => users.id),
  approvedAt: timestamp("approved_at"),
  startDate: timestamp("start_date"),
  endDate: timestamp("end_date"),

  // Performance tracking
  impressions: integer("impressions").default(0),
  clicks: integer("clicks").default(0),
  conversions: integer("conversions").default(0),

  // Admin notes
  adminNotes: text("admin_notes"),
  rejectionReason: text("rejection_reason"),

  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const premiumSubscriptions = pgTable("premium_subscriptions", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),

  // Subscription details
  tier: text("tier").notNull(), // 'silver', 'gold', 'pro'
  status: text("status").default("active"), // 'active', 'cancelled', 'expired', 'paused'

  // Billing
  billingType: text("billing_type").notNull(), // 'monthly', 'yearly'
  price: decimal("price", { precision: 10, scale: 2 }).notNull(),
  currency: text("currency").default("USDT"),

  // Period tracking
  startDate: timestamp("start_date").notNull(),
  endDate: timestamp("end_date").notNull(),
  nextBillingDate: timestamp("next_billing_date"),

  // Benefits tracking
  monthlyBoostCredits: integer("monthly_boost_credits").default(0),
  usedBoostCredits: integer("used_boost_credits").default(0),
  feeDiscountPercentage: decimal("fee_discount_percentage", {
    precision: 5,
    scale: 2,
  }).default("0"),

  // Cancellation
  cancelledAt: timestamp("cancelled_at"),
  cancellationReason: text("cancellation_reason"),

  // Payment tracking
  lastPaymentAt: timestamp("last_payment_at"),
  paymentFailures: integer("payment_failures").default(0),

  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const premiumBenefits = pgTable("premium_benefits", {
  id: uuid("id").primaryKey().defaultRandom(),
  tier: text("tier").notNull(),
  benefit: text("benefit").notNull(),
  value: text("value"), // JSON string for complex benefits
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

// =============================================================================
// UNIFIED CHAT SYSTEM (Enhanced)
// =============================================================================

export const chatThreads = pgTable("chat_threads", {
  id: uuid("id").primaryKey().defaultRandom(),

  // Thread classification
  type: text("type").notNull(), // 'freelance', 'marketplace', 'p2p_trade', 'social', 'support'
  referenceId: uuid("reference_id"), // Related job, order, trade, or null for social

  // Participants
  participants: jsonb("participants").$type<string[]>().notNull(), // Array of user IDs
  createdBy: uuid("created_by")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),

  // Thread metadata
  title: text("title"),
  description: text("description"),
  isGroup: boolean("is_group").default(false),
  isArchived: boolean("is_archived").default(false),

  // Message settings
  lastMessageId: uuid("last_message_id"),
  lastMessageAt: timestamp("last_message_at"),
  messageCount: integer("message_count").default(0),

  // Security and moderation
  isEncrypted: boolean("is_encrypted").default(false),
  isMuted: boolean("is_muted").default(false),
  mutedBy: uuid("muted_by").references(() => users.id),
  mutedReason: text("muted_reason"),

  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const chatMessages = pgTable("chat_messages", {
  id: uuid("id").primaryKey().defaultRandom(),
  threadId: uuid("thread_id")
    .notNull()
    .references(() => chatThreads.id, { onDelete: "cascade" }),
  senderId: uuid("sender_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),

  // Message content
  content: text("content").notNull(),
  messageType: text("message_type").default("text"), // 'text', 'image', 'file', 'audio', 'video', 'system', 'payment', 'contract'

  // File attachments
  attachments: jsonb("attachments"), // Array of file objects

  // Message status
  isEdited: boolean("is_edited").default(false),
  editedAt: timestamp("edited_at"),
  isDeleted: boolean("is_deleted").default(false),
  deletedAt: timestamp("deleted_at"),

  // Read receipts
  readBy: jsonb("read_by").$type<Record<string, string>>(), // userId -> timestamp
  deliveredTo: jsonb("delivered_to").$type<Record<string, string>>(),

  // Reply threading
  replyToId: uuid("reply_to_id").references(() => chatMessages.id),

  // Moderation
  isFlagged: boolean("is_flagged").default(false),
  flaggedReason: text("flagged_reason"),
  flaggedBy: uuid("flagged_by").references(() => users.id),

  // Metadata
  metadata: jsonb("metadata"), // Additional message data (e.g., location, payment info)

  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// =============================================================================
// ENHANCED P2P CRYPTO SYSTEM
// =============================================================================

export const p2pTrades = pgTable("p2p_trades", {
  id: uuid("id").primaryKey().defaultRandom(),
  offerId: uuid("offer_id")
    .notNull()
    .references(() => p2pOffers.id, { onDelete: "cascade" }),

  // Trade parties
  buyerId: uuid("buyer_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  sellerId: uuid("seller_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),

  // Trade details
  cryptoType: text("crypto_type").notNull(), // 'USDT', 'ETH', 'BTC'
  amount: decimal("amount", { precision: 20, scale: 8 }).notNull(),
  pricePerUnit: decimal("price_per_unit", {
    precision: 10,
    scale: 2,
  }).notNull(),
  totalAmount: decimal("total_amount", { precision: 15, scale: 2 }).notNull(),

  // Payment details
  paymentMethod: text("payment_method").notNull(),
  paymentWindow: integer("payment_window").default(30), // Minutes to complete payment

  // Trade flow
  status: text("status").default("pending"), // 'pending', 'payment_pending', 'payment_confirmed', 'completed', 'cancelled', 'disputed'

  // Escrow integration
  escrowId: uuid("escrow_id").references(() => escrowContracts.id),
  escrowAddress: text("escrow_address"), // Smart contract or custody wallet
  escrowTxHash: text("escrow_tx_hash"),

  // Chat integration
  chatThreadId: uuid("chat_thread_id").references(() => chatThreads.id),

  // Timing
  paymentDeadline: timestamp("payment_deadline"),
  releaseDeadline: timestamp("release_deadline"),

  // Confirmation tracking
  paymentConfirmedAt: timestamp("payment_confirmed_at"),
  paymentConfirmedBy: uuid("payment_confirmed_by").references(() => users.id),
  cryptoReleasedAt: timestamp("crypto_released_at"),

  // Dispute handling
  disputeId: uuid("dispute_id"),

  // Platform fees
  platformFee: decimal("platform_fee", { precision: 10, scale: 2 }).default(
    "0",
  ),
  feePercentage: decimal("fee_percentage", { precision: 5, scale: 2 }).default(
    "0.3",
  ),

  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
  completedAt: timestamp("completed_at"),
});

export const p2pDisputes = pgTable("p2p_disputes", {
  id: uuid("id").primaryKey().defaultRandom(),
  tradeId: uuid("trade_id")
    .notNull()
    .references(() => p2pTrades.id, { onDelete: "cascade" }),

  // Dispute details
  raisedBy: uuid("raised_by")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  reason: text("reason").notNull(), // 'payment_not_received', 'crypto_not_released', 'fraud_suspected', 'technical_issue'
  description: text("description").notNull(),

  // Evidence
  evidence: jsonb("evidence"), // Array of file URLs, screenshots, etc.

  // Status and resolution
  status: text("status").default("open"), // 'open', 'investigating', 'resolved', 'closed'
  priority: text("priority").default("medium"), // 'low', 'medium', 'high', 'urgent'

  // Admin handling
  assignedTo: uuid("assigned_to").references(() => users.id), // Admin user
  adminNotes: text("admin_notes"),
  resolution: text("resolution"),
  resolutionType: text("resolution_type"), // 'buyer_favor', 'seller_favor', 'partial_refund', 'mediation'

  // Timeline
  resolvedAt: timestamp("resolved_at"),

  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// =============================================================================
// ENHANCED MARKETPLACE SYSTEM
// =============================================================================

export const marketplaceOrders = pgTable("marketplace_orders", {
  id: uuid("id").primaryKey().defaultRandom(),

  // Order parties
  buyerId: uuid("buyer_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  sellerId: uuid("seller_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),

  // Order details
  orderNumber: text("order_number").notNull().unique(),
  items: jsonb("items").notNull(), // Array of product items with quantities

  // Financial details
  subtotal: decimal("subtotal", { precision: 10, scale: 2 }).notNull(),
  shippingCost: decimal("shipping_cost", { precision: 10, scale: 2 }).default(
    "0",
  ),
  tax: decimal("tax", { precision: 10, scale: 2 }).default("0"),
  discount: decimal("discount", { precision: 10, scale: 2 }).default("0"),
  total: decimal("total", { precision: 10, scale: 2 }).notNull(),

  // Payment and escrow
  paymentMethod: text("payment_method").notNull(), // 'wallet', 'crypto', 'soft_points'
  paymentStatus: text("payment_status").default("pending"), // 'pending', 'paid', 'failed', 'refunded'
  escrowId: uuid("escrow_id").references(() => escrowContracts.id),

  // Shipping details
  shippingAddress: jsonb("shipping_address").notNull(),
  shippingMethod: text("shipping_method"),
  trackingNumber: text("tracking_number"),
  estimatedDelivery: timestamp("estimated_delivery"),

  // Order status
  status: text("status").default("pending"), // 'pending', 'confirmed', 'shipped', 'delivered', 'cancelled', 'disputed'

  // Chat integration
  chatThreadId: uuid("chat_thread_id").references(() => chatThreads.id),

  // Timeline
  confirmedAt: timestamp("confirmed_at"),
  shippedAt: timestamp("shipped_at"),
  deliveredAt: timestamp("delivered_at"),

  // Platform fees
  platformFee: decimal("platform_fee", { precision: 10, scale: 2 }).default(
    "0",
  ),
  feePercentage: decimal("fee_percentage", { precision: 5, scale: 2 }).default(
    "5.0",
  ),

  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const marketplaceReviews = pgTable("marketplace_reviews", {
  id: uuid("id").primaryKey().defaultRandom(),
  orderId: uuid("order_id")
    .notNull()
    .references(() => marketplaceOrders.id, { onDelete: "cascade" }),
  productId: uuid("product_id")
    .notNull()
    .references(() => products.id, { onDelete: "cascade" }),

  // Review details
  reviewerId: uuid("reviewer_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  sellerId: uuid("seller_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),

  // Ratings
  overallRating: integer("overall_rating").notNull(), // 1-5 stars
  qualityRating: integer("quality_rating").notNull(),
  shippingRating: integer("shipping_rating").notNull(),
  serviceRating: integer("service_rating").notNull(),

  // Review content
  title: text("title"),
  comment: text("comment"),
  pros: text("pros").array(),
  cons: text("cons").array(),

  // Media
  images: text("images").array(),
  videos: text("videos").array(),

  // Verification
  isVerifiedPurchase: boolean("is_verified_purchase").default(true),

  // Moderation
  isFlagged: boolean("is_flagged").default(false),
  flaggedReason: text("flagged_reason"),
  moderationStatus: text("moderation_status").default("approved"), // 'pending', 'approved', 'rejected'

  // Helpful votes
  helpfulVotes: integer("helpful_votes").default(0),
  totalVotes: integer("total_votes").default(0),

  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// =============================================================================
// PLATFORM EARNINGS & ANALYTICS
// =============================================================================

export const platformEarnings = pgTable("platform_earnings", {
  id: uuid("id").primaryKey().defaultRandom(),

  // Source of earnings
  sourceType: text("source_type").notNull(), // 'freelance', 'marketplace', 'p2p_trade', 'boost', 'premium'
  referenceId: uuid("reference_id").notNull(),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),

  // Financial details
  grossAmount: decimal("gross_amount", { precision: 20, scale: 8 }).notNull(),
  feeAmount: decimal("fee_amount", { precision: 20, scale: 8 }).notNull(),
  feePercentage: decimal("fee_percentage", {
    precision: 5,
    scale: 2,
  }).notNull(),
  currency: text("currency").notNull(),

  // Conversion to USD for reporting
  usdAmount: decimal("usd_amount", { precision: 15, scale: 2 }),
  exchangeRate: decimal("exchange_rate", { precision: 15, scale: 8 }),

  // Metadata
  description: text("description"),
  metadata: jsonb("metadata"),

  earnedAt: timestamp("earned_at").defaultNow(),
  createdAt: timestamp("created_at").defaultNow(),
});

// =============================================================================
// ENHANCED ADMIN SYSTEM
// =============================================================================

export const adminUsers = pgTable("admin_users", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),

  // Admin roles
  roles: text("roles").array().notNull(), // Multiple roles: ['super_admin', 'finance_admin', 'content_admin']
  permissions: jsonb("permissions").$type<string[]>().notNull(),

  // Admin details
  employeeId: text("employee_id").unique(),
  department: text("department"),
  position: text("position"),

  // Security
  isActive: boolean("is_active").default(true),
  lastLoginAt: timestamp("last_login_at"),
  loginAttempts: integer("login_attempts").default(0),
  lockedUntil: timestamp("locked_until"),

  // Access restrictions
  ipWhitelist: text("ip_whitelist").array(),
  accessHours: jsonb("access_hours"), // Working hours restrictions

  // Settings
  settings: jsonb("settings"),
  notificationPreferences: jsonb("notification_preferences"),

  // Audit trail
  createdBy: uuid("created_by").references(() => adminUsers.id),
  modifiedBy: uuid("modified_by").references(() => adminUsers.id),

  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const adminActivityLogs = pgTable("admin_activity_logs", {
  id: uuid("id").primaryKey().defaultRandom(),
  adminId: uuid("admin_id")
    .notNull()
    .references(() => adminUsers.id, { onDelete: "cascade" }),

  // Activity details
  action: text("action").notNull(), // 'login', 'logout', 'user_ban', 'dispute_resolve', 'boost_approve'
  targetType: text("target_type"), // 'user', 'order', 'trade', 'dispute', 'boost'
  targetId: uuid("target_id"),

  // Context
  description: text("description"),
  oldValues: jsonb("old_values"), // Before state
  newValues: jsonb("new_values"), // After state

  // Request info
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  sessionId: text("session_id"),

  // Impact assessment
  severity: text("severity").default("low"), // 'low', 'medium', 'high', 'critical'
  affectedUsers: integer("affected_users").default(0),

  createdAt: timestamp("created_at").defaultNow(),
});

export const adminSessions = pgTable("admin_sessions", {
  id: uuid("id").primaryKey().defaultRandom(),
  adminId: uuid("admin_id")
    .notNull()
    .references(() => adminUsers.id, { onDelete: "cascade" }),

  sessionToken: text("session_token").notNull().unique(),
  refreshToken: text("refresh_token").unique(),

  // Session details
  ipAddress: text("ip_address").notNull(),
  userAgent: text("user_agent").notNull(),
  location: text("location"), // Geolocation info

  // Security
  isActive: boolean("is_active").default(true),
  lastActivityAt: timestamp("last_activity_at").defaultNow(),
  expiresAt: timestamp("expires_at").notNull(),

  // Device info
  deviceFingerprint: text("device_fingerprint"),
  deviceType: text("device_type"), // 'desktop', 'mobile', 'tablet'

  createdAt: timestamp("created_at").defaultNow(),
});

// =============================================================================
// CONTENT MODERATION & REPORTING
// =============================================================================

export const contentReports = pgTable("content_reports", {
  id: uuid("id").primaryKey().defaultRandom(),

  // Reporter info
  reporterId: uuid("reporter_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),

  // Content being reported
  contentType: text("content_type").notNull(), // 'post', 'comment', 'product', 'message', 'profile'
  contentId: uuid("content_id").notNull(),
  contentOwnerId: uuid("content_owner_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),

  // Report details
  reason: text("reason").notNull(), // 'spam', 'harassment', 'fraud', 'inappropriate', 'copyright'
  description: text("description"),
  evidence: jsonb("evidence"), // Screenshots, URLs, etc.

  // Status and handling
  status: text("status").default("pending"), // 'pending', 'reviewing', 'resolved', 'dismissed'
  priority: text("priority").default("medium"), // 'low', 'medium', 'high', 'urgent'

  // Admin handling
  assignedTo: uuid("assigned_to").references(() => adminUsers.id),
  reviewedBy: uuid("reviewed_by").references(() => adminUsers.id),
  reviewNotes: text("review_notes"),
  resolution: text("resolution"),
  actionTaken: text("action_taken"), // 'no_action', 'warning', 'content_removed', 'user_suspended'

  // Timeline
  reviewedAt: timestamp("reviewed_at"),
  resolvedAt: timestamp("resolved_at"),

  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const userSuspensions = pgTable("user_suspensions", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),

  // Suspension details
  type: text("type").notNull(), // 'warning', 'temporary', 'permanent'
  reason: text("reason").notNull(),
  description: text("description"),

  // Duration
  duration: integer("duration"), // Days for temporary suspension
  expiresAt: timestamp("expires_at"),

  // Restrictions
  restrictions: jsonb("restrictions"), // What the user can't do

  // Admin info
  suspendedBy: uuid("suspended_by")
    .notNull()
    .references(() => adminUsers.id),
  adminNotes: text("admin_notes"),

  // Status
  isActive: boolean("is_active").default(true),
  liftedBy: uuid("lifted_by").references(() => adminUsers.id),
  liftedAt: timestamp("lifted_at"),
  liftReason: text("lift_reason"),

  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// =============================================================================
// INDEXES FOR PERFORMANCE
// =============================================================================

// Wallet transaction indexes
// Temporarily commented out due to index issue
// export const walletTransactionUserIdx = index("wallet_transaction_user_idx").on(
//   walletTransactions.userId,
// );
// export const walletTransactionStatusIdx = index(
//   "wallet_transaction_status_idx",
// ).on(walletTransactions.status);
// export const walletTransactionTypeIdx = index("wallet_transaction_type_idx").on(
//   walletTransactions.type,
// );

// Chat indexes
export const chatThreadTypeIdx = index("chat_thread_type_idx").on(
  chatThreads.type,
);
export const chatMessageThreadIdx = index("chat_message_thread_idx").on(
  chatMessages.threadId,
);

// Trade indexes
export const p2pTradeStatusIdx = index("p2p_trade_status_idx").on(
  p2pTrades.status,
);
export const p2pTradeBuyerIdx = index("p2p_trade_buyer_idx").on(
  p2pTrades.buyerId,
);
export const p2pTradeSellerIdx = index("p2p_trade_seller_idx").on(
  p2pTrades.sellerId,
);

// Admin activity indexes
export const adminActivityAdminIdx = index("admin_activity_admin_idx").on(
  adminActivityLogs.adminId,
);
export const adminActivityActionIdx = index("admin_activity_action_idx").on(
  adminActivityLogs.action,
);

// Report indexes
export const contentReportStatusIdx = index("content_report_status_idx").on(
  contentReports.status,
);
export const contentReportTypeIdx = index("content_report_type_idx").on(
  contentReports.contentType,
);

// =============================================================================
// INSERT SCHEMAS FOR VALIDATION
// =============================================================================

export const insertWalletSchema = createInsertSchema(wallets).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertWalletTransactionSchema = createInsertSchema(
  walletTransactions,
).omit({
  id: true,
  createdAt: true,
  confirmedAt: true,
});

export const insertEscrowContractSchema = createInsertSchema(
  escrowContracts,
).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  fundedAt: true,
  releasedAt: true,
  refundedAt: true,
});

export const insertBoostSchema = createInsertSchema(boosts).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  approvedAt: true,
  impressions: true,
  clicks: true,
  conversions: true,
});

export const insertPremiumSubscriptionSchema = createInsertSchema(
  premiumSubscriptions,
).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  cancelledAt: true,
  lastPaymentAt: true,
});

export const insertChatThreadSchema = createInsertSchema(chatThreads).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  lastMessageAt: true,
  messageCount: true,
});

export const insertChatMessageSchema = createInsertSchema(chatMessages).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  editedAt: true,
  deletedAt: true,
});

export const insertP2pTradeSchema = createInsertSchema(p2pTrades).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  completedAt: true,
  paymentConfirmedAt: true,
  cryptoReleasedAt: true,
});

export const insertMarketplaceOrderSchema = createInsertSchema(
  marketplaceOrders,
).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  confirmedAt: true,
  shippedAt: true,
  deliveredAt: true,
});

export const insertContentReportSchema = createInsertSchema(
  contentReports,
).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  reviewedAt: true,
  resolvedAt: true,
});

export const insertAdminUserSchema = createInsertSchema(adminUsers).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  lastLoginAt: true,
});

// =============================================================================
// TYPE EXPORTS
// =============================================================================

export type Wallet = typeof wallets.$inferSelect;
export type WalletTransaction = typeof walletTransactions.$inferSelect;
export type EscrowContract = typeof escrowContracts.$inferSelect;
export type Boost = typeof boosts.$inferSelect;
export type PremiumSubscription = typeof premiumSubscriptions.$inferSelect;
export type ChatThread = typeof chatThreads.$inferSelect;
export type ChatMessage = typeof chatMessages.$inferSelect;
export type P2pTrade = typeof p2pTrades.$inferSelect;
export type MarketplaceOrder = typeof marketplaceOrders.$inferSelect;
export type ContentReport = typeof contentReports.$inferSelect;
export type AdminUser = typeof adminUsers.$inferSelect;
export type AdminActivityLog = typeof adminActivityLogs.$inferSelect;

export type InsertWallet = typeof wallets.$inferInsert;
export type InsertWalletTransaction = typeof walletTransactions.$inferInsert;
export type InsertEscrowContract = typeof escrowContracts.$inferInsert;
export type InsertBoost = typeof boosts.$inferInsert;
export type InsertPremiumSubscription =
  typeof premiumSubscriptions.$inferInsert;
export type InsertChatThread = typeof chatThreads.$inferInsert;
export type InsertChatMessage = typeof chatMessages.$inferInsert;
export type InsertP2pTrade = typeof p2pTrades.$inferInsert;
export type InsertMarketplaceOrder = typeof marketplaceOrders.$inferInsert;
export type InsertContentReport = typeof contentReports.$inferInsert;
export type InsertAdminUser = typeof adminUsers.$inferInsert;
