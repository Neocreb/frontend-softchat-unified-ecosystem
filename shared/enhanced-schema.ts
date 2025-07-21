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
import { users, profiles, p2pOffers } from "./schema";

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

// Products table (Enhanced)
export const products = pgTable("products", {
  id: uuid("id").primaryKey().defaultRandom(),
  sellerId: uuid("seller_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),

  // Basic product info
  name: text("name").notNull(),
  description: text("description").notNull(),
  shortDescription: text("short_description"),

  // Product type: physical, digital, service
  productType: text("product_type").notNull().default("physical"), // 'physical', 'digital', 'service', 'freelance_service'

  // Pricing
  price: decimal("price", { precision: 10, scale: 2 }).notNull(),
  discountPrice: decimal("discount_price", { precision: 10, scale: 2 }),
  discountPercentage: decimal("discount_percentage", {
    precision: 5,
    scale: 2,
  }),

  // Category and classification
  category: text("category").notNull(),
  subcategory: text("subcategory"),
  tags: text("tags").array(),

  // Media
  images: text("images").array(), // Array of image URLs
  videos: text("videos").array(), // Array of video URLs
  thumbnailImage: text("thumbnail_image"),

  // Inventory and availability
  inStock: boolean("in_stock").default(true),
  stockQuantity: integer("stock_quantity"),
  limitedQuantity: boolean("limited_quantity").default(false),
  allowBackorder: boolean("allow_backorder").default(false),

  // Product status
  status: text("status").default("active"), // 'active', 'draft', 'suspended', 'out_of_stock'
  isDigital: boolean("is_digital").default(false),
  isFeatured: boolean("is_featured").default(false),
  isSponsored: boolean("is_sponsored").default(false),

  // SEO and discovery
  seoTitle: text("seo_title"),
  seoDescription: text("seo_description"),
  seoKeywords: text("seo_keywords").array(),

  // Ratings and reviews
  averageRating: decimal("average_rating", { precision: 3, scale: 2 }).default(
    "0",
  ),
  totalReviews: integer("total_reviews").default(0),
  totalSales: integer("total_sales").default(0),

  // Shipping and delivery
  shippingRequired: boolean("shipping_required").default(true),
  shippingWeight: decimal("shipping_weight", { precision: 8, scale: 3 }),
  shippingDimensions: jsonb("shipping_dimensions"), // {length, width, height, unit}
  deliveryMethods: text("delivery_methods").array(), // ['standard', 'express', 'pickup', 'digital']

  // Boost and campaign info
  boostLevel: integer("boost_level").default(0), // 0=none, 1=basic, 2=featured, 3=premium
  boostedUntil: timestamp("boosted_until"),
  campaignIds: text("campaign_ids").array(), // Array of campaign IDs this product is part of

  // Performance metrics
  viewCount: integer("view_count").default(0),
  clickCount: integer("click_count").default(0),
  favoriteCount: integer("favorite_count").default(0),

  // Digital product specific
  downloadUrl: text("download_url"), // For digital products
  licenseType: text("license_type"), // 'single', 'multiple', 'unlimited'
  downloadLimit: integer("download_limit"),

  // Service specific (for freelance services)
  serviceDeliveryTime: text("service_delivery_time"), // "1-3 days", "1 week", etc.
  serviceType: text("service_type"), // 'one_time', 'recurring', 'hourly'
  hourlyRate: decimal("hourly_rate", { precision: 10, scale: 2 }),

  // Metadata
  metadata: jsonb("metadata"), // Additional flexible data

  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Product variants (colors, sizes, etc.)
export const productVariants = pgTable("product_variants", {
  id: uuid("id").primaryKey().defaultRandom(),
  productId: uuid("product_id")
    .notNull()
    .references(() => products.id, { onDelete: "cascade" }),

  name: text("name").notNull(), // "Red XL", "Blue Medium", etc.
  sku: text("sku").unique(),

  // Variant-specific pricing
  priceAdjustment: decimal("price_adjustment", {
    precision: 10,
    scale: 2,
  }).default("0"),

  // Variant attributes
  attributes: jsonb("attributes").notNull(), // {color: 'red', size: 'xl', material: 'cotton'}

  // Inventory
  stockQuantity: integer("stock_quantity").default(0),
  inStock: boolean("in_stock").default(true),

  // Media
  images: text("images").array(),

  // Availability
  isActive: boolean("is_active").default(true),

  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Product categories (hierarchical)
export const productCategories = pgTable("product_categories", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  description: text("description"),

  // Hierarchy
  parentId: uuid("parent_id").references(() => productCategories.id),
  level: integer("level").default(0), // 0=root, 1=subcategory, etc.
  path: text("path"), // "/electronics/smartphones"

  // Display
  icon: text("icon"),
  image: text("image"),
  color: text("color"),
  sortOrder: integer("sort_order").default(0),

  // SEO
  seoTitle: text("seo_title"),
  seoDescription: text("seo_description"),

  // Status
  isActive: boolean("is_active").default(true),
  isFeatured: boolean("is_featured").default(false),

  // Stats
  productCount: integer("product_count").default(0),

  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Campaigns system
export const campaigns = pgTable("campaigns", {
  id: uuid("id").primaryKey().defaultRandom(),

  // Campaign details
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  description: text("description"),

  // Campaign type
  type: text("type").notNull(), // 'seasonal', 'flash_sale', 'featured', 'category_boost'

  // Timing
  startDate: timestamp("start_date").notNull(),
  endDate: timestamp("end_date").notNull(),

  // Display
  bannerImage: text("banner_image"),
  bannerText: text("banner_text"),
  backgroundColor: text("background_color"),
  textColor: text("text_color"),

  // Rules and criteria
  eligibilityCriteria: jsonb("eligibility_criteria"), // Rules for product inclusion
  discountType: text("discount_type"), // 'percentage', 'fixed_amount', 'buy_x_get_y'
  discountValue: decimal("discount_value", { precision: 10, scale: 2 }),
  maxDiscount: decimal("max_discount", { precision: 10, scale: 2 }),
  minOrderAmount: decimal("min_order_amount", { precision: 10, scale: 2 }),

  // Limits
  maxParticipants: integer("max_participants"),
  maxProductsPerSeller: integer("max_products_per_seller"),
  usageLimit: integer("usage_limit"),
  usageCount: integer("usage_count").default(0),

  // Status
  status: text("status").default("draft"), // 'draft', 'active', 'paused', 'ended'
  isPublic: boolean("is_public").default(true),
  requiresApproval: boolean("requires_approval").default(false),

  // Admin info
  createdBy: uuid("created_by")
    .notNull()
    .references(() => users.id),

  // Performance tracking
  viewCount: integer("view_count").default(0),
  clickCount: integer("click_count").default(0),
  conversionCount: integer("conversion_count").default(0),
  totalRevenue: decimal("total_revenue", { precision: 15, scale: 2 }).default(
    "0",
  ),

  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Campaign product participation
export const campaignProducts = pgTable("campaign_products", {
  id: uuid("id").primaryKey().defaultRandom(),
  campaignId: uuid("campaign_id")
    .notNull()
    .references(() => campaigns.id, { onDelete: "cascade" }),
  productId: uuid("product_id")
    .notNull()
    .references(() => products.id, { onDelete: "cascade" }),

  // Participation details
  requestedBy: uuid("requested_by")
    .notNull()
    .references(() => users.id),

  // Status
  status: text("status").default("pending"), // 'pending', 'approved', 'rejected', 'ended'
  approvedBy: uuid("approved_by").references(() => users.id),
  approvedAt: timestamp("approved_at"),

  // Campaign-specific settings
  customDiscount: decimal("custom_discount", { precision: 10, scale: 2 }),
  featuredOrder: integer("featured_order").default(0), // Display order in campaign

  // Performance within campaign
  campaignViews: integer("campaign_views").default(0),
  campaignClicks: integer("campaign_clicks").default(0),
  campaignSales: integer("campaign_sales").default(0),
  campaignRevenue: decimal("campaign_revenue", {
    precision: 15,
    scale: 2,
  }).default("0"),

  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Enhanced boost system for products and profiles
export const productBoosts = pgTable("product_boosts", {
  id: uuid("id").primaryKey().defaultRandom(),
  productId: uuid("product_id")
    .notNull()
    .references(() => products.id, { onDelete: "cascade" }),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),

  // Boost configuration
  boostType: text("boost_type").notNull(), // 'basic', 'featured', 'premium', 'homepage'
  duration: integer("duration").notNull(), // Duration in hours
  cost: decimal("cost", { precision: 10, scale: 2 }).notNull(),
  currency: text("currency").notNull(), // 'SOFT_POINTS', 'USDT', 'ETH', 'BTC'

  // Payment details
  paymentMethod: text("payment_method").notNull(), // 'wallet', 'premium_credits'
  transactionId: uuid("transaction_id").references(() => walletTransactions.id),

  // Status and timing
  status: text("status").default("pending"), // 'pending', 'active', 'completed', 'cancelled', 'rejected'
  startDate: timestamp("start_date"),
  endDate: timestamp("end_date"),

  // Admin approval
  requiresApproval: boolean("requires_approval").default(false),
  approvedBy: uuid("approved_by").references(() => users.id),
  approvedAt: timestamp("approved_at"),
  rejectionReason: text("rejection_reason"),

  // Performance metrics
  impressions: integer("impressions").default(0),
  clicks: integer("clicks").default(0),
  conversions: integer("conversions").default(0),
  conversionValue: decimal("conversion_value", {
    precision: 15,
    scale: 2,
  }).default("0"),

  // ROI tracking
  roi: decimal("roi", { precision: 10, scale: 2 }), // Return on investment percentage

  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

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
  orderType: text("order_type").default("marketplace"), // 'marketplace', 'digital', 'service'
  items: jsonb("items").notNull(), // Array of {productId, variantId?, quantity, price, name}

  // Financial details
  subtotal: decimal("subtotal", { precision: 10, scale: 2 }).notNull(),
  shippingCost: decimal("shipping_cost", { precision: 10, scale: 2 }).default(
    "0",
  ),
  tax: decimal("tax", { precision: 10, scale: 2 }).default("0"),
  discount: decimal("discount", { precision: 10, scale: 2 }).default("0"),
  discountCode: text("discount_code"),
  total: decimal("total", { precision: 10, scale: 2 }).notNull(),

  // Payment and escrow
  paymentMethod: text("payment_method").notNull(), // 'wallet_usdt', 'wallet_eth', 'wallet_btc', 'soft_points'
  paymentCurrency: text("payment_currency").notNull(), // 'USDT', 'ETH', 'BTC', 'SOFT_POINTS'
  paymentStatus: text("payment_status").default("pending"), // 'pending', 'paid', 'failed', 'refunded', 'partial_refund'
  escrowId: uuid("escrow_id").references(() => escrowContracts.id),
  paymentTransactionId: uuid("payment_transaction_id").references(
    () => walletTransactions.id,
  ),

  // Shipping details (for physical products)
  shippingAddress: jsonb("shipping_address"), // {name, address, city, state, zip, country, phone}
  billingAddress: jsonb("billing_address"),
  shippingMethod: text("shipping_method"), // 'standard', 'express', 'pickup', 'digital'
  trackingNumber: text("tracking_number"),
  trackingUrl: text("tracking_url"),
  estimatedDelivery: timestamp("estimated_delivery"),
  actualDelivery: timestamp("actual_delivery"),

  // Digital delivery (for digital products)
  downloadUrls: text("download_urls").array(),
  downloadExpiresAt: timestamp("download_expires_at"),
  downloadCount: integer("download_count").default(0),
  downloadLimit: integer("download_limit"),

  // Order status
  status: text("status").default("pending"), // 'pending', 'confirmed', 'processing', 'shipped', 'delivered', 'completed', 'cancelled', 'disputed', 'refunded'

  // Fulfillment tracking
  fulfillmentStatus: text("fulfillment_status").default("pending"), // 'pending', 'processing', 'fulfilled', 'cancelled'
  requiresShipping: boolean("requires_shipping").default(true),
  autoCompleteAfterDays: integer("auto_complete_after_days").default(7),

  // Chat integration
  chatThreadId: uuid("chat_thread_id").references(() => chatThreads.id),

  // Customer service
  customerNotes: text("customer_notes"), // Buyer's notes
  sellerNotes: text("seller_notes"), // Internal seller notes
  adminNotes: text("admin_notes"), // Admin notes for disputes/issues

  // Timeline
  confirmedAt: timestamp("confirmed_at"),
  processingAt: timestamp("processing_at"),
  shippedAt: timestamp("shipped_at"),
  deliveredAt: timestamp("delivered_at"),
  completedAt: timestamp("completed_at"),
  cancelledAt: timestamp("cancelled_at"),

  // Platform fees and revenue
  platformFee: decimal("platform_fee", { precision: 10, scale: 2 }).default(
    "0",
  ),
  feePercentage: decimal("fee_percentage", { precision: 5, scale: 2 }).default(
    "5.0",
  ),
  sellerRevenue: decimal("seller_revenue", { precision: 10, scale: 2 }),

  // Dispute handling
  disputeId: uuid("dispute_id"),
  disputeReason: text("dispute_reason"),

  // Return/refund tracking
  returnRequested: boolean("return_requested").default(false),
  returnRequestedAt: timestamp("return_requested_at"),
  returnReason: text("return_reason"),
  returnStatus: text("return_status"), // 'requested', 'approved', 'denied', 'returned', 'refunded'
  refundAmount: decimal("refund_amount", { precision: 10, scale: 2 }),
  refundedAt: timestamp("refunded_at"),

  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Order status history/logs
export const orderStatusLogs = pgTable("order_status_logs", {
  id: uuid("id").primaryKey().defaultRandom(),
  orderId: uuid("order_id")
    .notNull()
    .references(() => marketplaceOrders.id, { onDelete: "cascade" }),

  // Status change details
  fromStatus: text("from_status"),
  toStatus: text("to_status").notNull(),
  reason: text("reason"),
  notes: text("notes"),

  // Who made the change
  changedBy: uuid("changed_by")
    .notNull()
    .references(() => users.id),
  changedByType: text("changed_by_type").notNull(), // 'buyer', 'seller', 'admin', 'system'

  // Additional metadata
  metadata: jsonb("metadata"), // Additional data about the status change

  createdAt: timestamp("created_at").defaultNow(),
});

// Cart system for persistent shopping carts
export const shoppingCarts = pgTable("shopping_carts", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),

  // Cart metadata
  sessionId: text("session_id"), // For guest carts

  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const cartItems = pgTable("cart_items", {
  id: uuid("id").primaryKey().defaultRandom(),
  cartId: uuid("cart_id")
    .notNull()
    .references(() => shoppingCarts.id, { onDelete: "cascade" }),
  productId: uuid("product_id")
    .notNull()
    .references(() => products.id, { onDelete: "cascade" }),
  variantId: uuid("variant_id").references(() => productVariants.id),

  quantity: integer("quantity").notNull().default(1),

  // Price at time of adding to cart
  priceSnapshot: decimal("price_snapshot", {
    precision: 10,
    scale: 2,
  }).notNull(),

  // Custom options/notes
  customOptions: jsonb("custom_options"), // Custom attributes for the item
  notes: text("notes"), // Special instructions

  addedAt: timestamp("added_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Wishlist system
export const wishlists = pgTable("wishlists", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),

  name: text("name").default("My Wishlist"),
  description: text("description"),
  isPublic: boolean("is_public").default(false),
  isDefault: boolean("is_default").default(true),

  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const wishlistItems = pgTable("wishlist_items", {
  id: uuid("id").primaryKey().defaultRandom(),
  wishlistId: uuid("wishlist_id")
    .notNull()
    .references(() => wishlists.id, { onDelete: "cascade" }),
  productId: uuid("product_id")
    .notNull()
    .references(() => products.id, { onDelete: "cascade" }),

  // Preferences
  preferredVariant: uuid("preferred_variant_id").references(
    () => productVariants.id,
  ),
  notifyOnSale: boolean("notify_on_sale").default(false),
  notifyOnRestock: boolean("notify_on_restock").default(false),
  targetPrice: decimal("target_price", { precision: 10, scale: 2 }), // Price alert threshold

  // Price tracking
  priceWhenAdded: decimal("price_when_added", { precision: 10, scale: 2 }),
  lowestPriceSeen: decimal("lowest_price_seen", { precision: 10, scale: 2 }),

  notes: text("notes"),
  priority: integer("priority").default(1), // 1=low, 5=high

  addedAt: timestamp("added_at").defaultNow(),
});

// Product view/interaction tracking
export const productAnalytics = pgTable("product_analytics", {
  id: uuid("id").primaryKey().defaultRandom(),
  productId: uuid("product_id")
    .notNull()
    .references(() => products.id, { onDelete: "cascade" }),
  userId: uuid("user_id").references(() => users.id), // null for anonymous

  // Event details
  eventType: text("event_type").notNull(), // 'view', 'click', 'add_to_cart', 'add_to_wishlist', 'purchase', 'share'

  // Context
  referrerUrl: text("referrer_url"),
  source: text("source"), // 'search', 'category', 'featured', 'sponsored', 'direct'
  campaign: text("campaign"), // Campaign that led to this view

  // Technical details
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  deviceType: text("device_type"), // 'desktop', 'mobile', 'tablet'

  // Location (optional)
  country: text("country"),
  city: text("city"),

  // Session info
  sessionId: text("session_id"),
  sessionDuration: integer("session_duration"), // Seconds on product page

  // Additional metadata
  metadata: jsonb("metadata"),

  createdAt: timestamp("created_at").defaultNow(),
});

// Marketplace disputes
export const marketplaceDisputes = pgTable("marketplace_disputes", {
  id: uuid("id").primaryKey().defaultRandom(),
  orderId: uuid("order_id")
    .notNull()
    .references(() => marketplaceOrders.id, { onDelete: "cascade" }),

  // Dispute details
  raisedBy: uuid("raised_by")
    .notNull()
    .references(() => users.id),
  againstUserId: uuid("against_user_id")
    .notNull()
    .references(() => users.id),

  // Dispute information
  type: text("type").notNull(), // 'not_received', 'not_as_described', 'damaged', 'return_refused', 'refund_issue'
  reason: text("reason").notNull(),
  description: text("description").notNull(),

  // Evidence
  evidence: jsonb("evidence"), // Array of file URLs, screenshots, etc.

  // Amounts in dispute
  disputedAmount: decimal("disputed_amount", { precision: 10, scale: 2 }),
  requestedResolution: text("requested_resolution"), // 'full_refund', 'partial_refund', 'replacement', 'return'

  // Status tracking
  status: text("status").default("open"), // 'open', 'investigating', 'mediation', 'resolved', 'closed'
  priority: text("priority").default("medium"), // 'low', 'medium', 'high', 'urgent'

  // Admin handling
  assignedTo: uuid("assigned_to").references(() => users.id),
  mediatorNotes: text("mediator_notes"),
  resolution: text("resolution"),
  resolutionType: text("resolution_type"), // 'buyer_favor', 'seller_favor', 'partial_refund', 'no_action'
  resolutionAmount: decimal("resolution_amount", { precision: 10, scale: 2 }),

  // Timeline
  respondByDate: timestamp("respond_by_date"),
  resolvedAt: timestamp("resolved_at"),
  closedAt: timestamp("closed_at"),

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

  // Ratings (1-5 stars)
  overallRating: integer("overall_rating").notNull(),
  qualityRating: integer("quality_rating"),
  valueRating: integer("value_rating"), // Value for money
  shippingRating: integer("shipping_rating"),
  serviceRating: integer("service_rating"),

  // Detailed ratings for different product types
  deliveryRating: integer("delivery_rating"), // For digital products
  communicationRating: integer("communication_rating"), // For services
  accuracyRating: integer("accuracy_rating"), // How accurate was product description

  // Review content
  title: text("title"),
  comment: text("comment").notNull(),
  pros: text("pros").array(),
  cons: text("cons").array(),

  // Purchase context
  variantPurchased: text("variant_purchased"), // Which variant was purchased
  useCase: text("use_case"), // How they used the product
  wouldRecommend: boolean("would_recommend"),

  // Media
  images: text("images").array(),
  videos: text("videos").array(),

  // Verification and authenticity
  isVerifiedPurchase: boolean("is_verified_purchase").default(true),
  purchaseVerified: boolean("purchase_verified").default(false), // Admin verified
  reviewSource: text("review_source").default("marketplace"), // 'marketplace', 'imported', 'migrated'

  // Moderation and quality
  isFlagged: boolean("is_flagged").default(false),
  flaggedReason: text("flagged_reason"),
  moderationStatus: text("moderation_status").default("approved"), // 'pending', 'approved', 'rejected', 'auto_approved'
  moderatedBy: uuid("moderated_by").references(() => users.id),
  moderatedAt: timestamp("moderated_at"),

  // Quality scoring
  helpfulnessScore: decimal("helpfulness_score", {
    precision: 3,
    scale: 2,
  }).default("0"),
  qualityScore: decimal("quality_score", { precision: 3, scale: 2 }).default(
    "0",
  ), // AI-computed quality

  // Community interaction
  helpfulVotes: integer("helpful_votes").default(0),
  totalVotes: integer("total_votes").default(0),
  reportCount: integer("report_count").default(0),

  // Seller response
  sellerResponseId: uuid("seller_response_id"),

  // Incentivization
  rewardEarned: decimal("reward_earned", { precision: 10, scale: 2 }).default(
    "0",
  ), // SoftPoints earned for review

  // Additional metadata
  metadata: jsonb("metadata"), // Additional flexible data

  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Seller responses to reviews
export const reviewResponses = pgTable("review_responses", {
  id: uuid("id").primaryKey().defaultRandom(),
  reviewId: uuid("review_id")
    .notNull()
    .references(() => marketplaceReviews.id, { onDelete: "cascade" }),
  sellerId: uuid("seller_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),

  response: text("response").notNull(),

  // Moderation
  moderationStatus: text("moderation_status").default("approved"),
  moderatedBy: uuid("moderated_by").references(() => users.id),
  moderatedAt: timestamp("moderated_at"),

  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Review helpfulness tracking
export const reviewHelpfulness = pgTable(
  "review_helpfulness",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    reviewId: uuid("review_id")
      .notNull()
      .references(() => marketplaceReviews.id, { onDelete: "cascade" }),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),

    isHelpful: boolean("is_helpful").notNull(), // true = helpful, false = not helpful

    createdAt: timestamp("created_at").defaultNow(),
  },
  (table) => ({
    // Unique constraint to prevent duplicate votes
    unique: unique().on(table.reviewId, table.userId),
  }),
);

// =============================================================================
// CREATOR ECONOMY SYSTEM
// =============================================================================

export const creatorEarnings = pgTable("creator_earnings", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),

  // Revenue sources
  sourceType: text("source_type").notNull(), // 'views', 'tips', 'subscriptions', 'boosts', 'services'
  contentId: uuid("content_id"), // Reference to the content that generated revenue
  contentType: text("content_type"), // 'post', 'video', 'story', 'reel'

  // Earnings details
  amount: decimal("amount", { precision: 20, scale: 8 }).notNull(),
  currency: text("currency").notNull(), // 'USDT', 'SOFT_POINTS'
  softPointsEarned: decimal("soft_points_earned", {
    precision: 20,
    scale: 2,
  }).default("0"),

  // Metrics that generated the earning
  viewCount: integer("view_count").default(0),
  tipAmount: decimal("tip_amount", { precision: 20, scale: 8 }).default("0"),
  subscriptionAmount: decimal("subscription_amount", {
    precision: 20,
    scale: 8,
  }).default("0"),

  // Related user (who tipped, subscribed, etc.)
  fromUserId: uuid("from_user_id").references(() => users.id),

  // Status
  status: text("status").default("pending"), // 'pending', 'confirmed', 'paid_out'
  payoutId: uuid("payout_id"), // Reference to payout batch

  // Metadata
  description: text("description"),
  metadata: jsonb("metadata"),

  earnedAt: timestamp("earned_at").defaultNow(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const softPointsLog = pgTable("soft_points_log", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),

  // Transaction details
  type: text("type").notNull(), // 'earned', 'spent', 'bonus', 'penalty'
  amount: decimal("amount", { precision: 20, scale: 2 }).notNull(),
  balanceAfter: decimal("balance_after", { precision: 20, scale: 2 }).notNull(),

  // Source of points
  sourceType: text("source_type").notNull(), // 'views', 'tips', 'subscriptions', 'boost_purchase', 'referral'
  sourceId: uuid("source_id"), // Reference to the source

  // Calculation details
  calculationRule: text("calculation_rule"), // Description of how points were calculated
  multiplier: decimal("multiplier", { precision: 5, scale: 2 }).default("1"),

  // Status
  status: text("status").default("confirmed"), // 'pending', 'confirmed', 'reversed'

  description: text("description"),
  metadata: jsonb("metadata"),

  createdAt: timestamp("created_at").defaultNow(),
});

export const monetizedContent = pgTable("monetized_content", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),

  // Content details
  contentId: uuid("content_id").notNull(), // Reference to post, video, etc.
  contentType: text("content_type").notNull(), // 'post', 'video', 'story', 'reel'
  title: text("title"),
  description: text("description"),

  // Monetization settings
  isMonetized: boolean("is_monetized").default(true),
  monetizationType: text("monetization_type").notNull(), // 'ad_revenue', 'tips', 'subscriptions', 'pay_per_view'
  minTipAmount: decimal("min_tip_amount", { precision: 10, scale: 2 }).default(
    "1",
  ),
  subscriptionPrice: decimal("subscription_price", { precision: 10, scale: 2 }),
  payPerViewPrice: decimal("pay_per_view_price", { precision: 10, scale: 2 }),

  // Performance metrics
  totalViews: integer("total_views").default(0),
  totalEarnings: decimal("total_earnings", { precision: 20, scale: 8 }).default(
    "0",
  ),
  totalTips: decimal("total_tips", { precision: 20, scale: 8 }).default("0"),
  totalSoftPoints: decimal("total_soft_points", {
    precision: 20,
    scale: 2,
  }).default("0"),
  tipCount: integer("tip_count").default(0),
  subscriptionCount: integer("subscription_count").default(0),

  // Revenue breakdown
  revenueBreakdown: jsonb("revenue_breakdown"), // Detailed breakdown by source

  // Admin approval
  approvalStatus: text("approval_status").default("approved"), // 'pending', 'approved', 'rejected'
  approvedBy: uuid("approved_by").references(() => adminUsers.id),
  approvedAt: timestamp("approved_at"),
  rejectionReason: text("rejection_reason"),

  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const revenueHistory = pgTable("revenue_history", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),

  // Transaction details
  transactionType: text("transaction_type").notNull(), // 'tip_received', 'view_payment', 'subscription_payment', 'boost_deduction'
  amount: decimal("amount", { precision: 20, scale: 8 }).notNull(),
  currency: text("currency").notNull(),
  softPointsChange: decimal("soft_points_change", {
    precision: 20,
    scale: 2,
  }).default("0"),

  // Related entities
  contentId: uuid("content_id"),
  fromUserId: uuid("from_user_id").references(() => users.id),
  toUserId: uuid("to_user_id").references(() => users.id),

  // Revenue source details
  sourceDetails: jsonb("source_details"), // Detailed information about the revenue source

  // Platform fees
  platformFee: decimal("platform_fee", { precision: 20, scale: 8 }).default(
    "0",
  ),
  netAmount: decimal("net_amount", { precision: 20, scale: 8 }).notNull(),

  description: text("description"),
  metadata: jsonb("metadata"),

  createdAt: timestamp("created_at").defaultNow(),
});

export const subscriptions = pgTable("subscriptions", {
  id: uuid("id").primaryKey().defaultRandom(),

  // Subscription parties
  subscriberId: uuid("subscriber_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  creatorId: uuid("creator_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),

  // Subscription details
  tier: text("tier").notNull(), // 'basic', 'premium', 'vip'
  price: decimal("price", { precision: 10, scale: 2 }).notNull(),
  currency: text("currency").default("USDT"),
  billingCycle: text("billing_cycle").default("monthly"), // 'monthly', 'yearly'

  // Status and timing
  status: text("status").default("active"), // 'active', 'cancelled', 'expired', 'paused'
  startDate: timestamp("start_date").defaultNow(),
  endDate: timestamp("end_date"),
  nextBillingDate: timestamp("next_billing_date"),
  lastPaymentDate: timestamp("last_payment_date"),

  // Benefits
  benefits: jsonb("benefits"), // What the subscriber gets
  accessLevel: text("access_level").default("basic"), // 'basic', 'premium', 'exclusive'

  // Payment tracking
  totalPaid: decimal("total_paid", { precision: 20, scale: 8 }).default("0"),
  paymentFailures: integer("payment_failures").default(0),
  lastPaymentAttempt: timestamp("last_payment_attempt"),

  // Cancellation
  cancelledAt: timestamp("cancelled_at"),
  cancellationReason: text("cancellation_reason"),
  cancelledBy: uuid("cancelled_by").references(() => users.id),

  // Auto-renewal
  autoRenew: boolean("auto_renew").default(true),
  renewalAttempts: integer("renewal_attempts").default(0),

  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const creatorPayouts = pgTable("creator_payouts", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),

  // Payout details
  amount: decimal("amount", { precision: 20, scale: 8 }).notNull(),
  currency: text("currency").notNull(),
  softPointsAmount: decimal("soft_points_amount", {
    precision: 20,
    scale: 2,
  }).default("0"),

  // Period covered
  periodStart: timestamp("period_start").notNull(),
  periodEnd: timestamp("period_end").notNull(),

  // Payment method
  paymentMethod: text("payment_method").notNull(), // 'wallet', 'bank_transfer', 'crypto'
  paymentDetails: jsonb("payment_details"), // Bank account, wallet address, etc.

  // Status tracking
  status: text("status").default("pending"), // 'pending', 'processing', 'completed', 'failed', 'cancelled'
  processedAt: timestamp("processed_at"),
  completedAt: timestamp("completed_at"),
  failureReason: text("failure_reason"),

  // Admin processing
  processedBy: uuid("processed_by").references(() => adminUsers.id),
  adminNotes: text("admin_notes"),

  // Transaction references
  transactionIds: text("transaction_ids").array(), // IDs of earnings included in this payout
  externalTransactionId: text("external_transaction_id"), // Bank/payment processor reference

  // Fees and deductions
  processingFee: decimal("processing_fee", { precision: 10, scale: 2 }).default(
    "0",
  ),
  netAmount: decimal("net_amount", { precision: 20, scale: 8 }).notNull(),

  requestedAt: timestamp("requested_at").defaultNow(),
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
// SELLER PERFORMANCE & ANALYTICS
// =============================================================================

export const sellerAnalytics = pgTable("seller_analytics", {
  id: uuid("id").primaryKey().defaultRandom(),
  sellerId: uuid("seller_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),

  // Date for this analytics record
  analyticsDate: timestamp("analytics_date").notNull(),
  period: text("period").notNull(), // 'daily', 'weekly', 'monthly', 'yearly'

  // Sales metrics
  totalOrders: integer("total_orders").default(0),
  totalRevenue: decimal("total_revenue", { precision: 15, scale: 2 }).default(
    "0",
  ),
  totalUnitsSold: integer("total_units_sold").default(0),
  averageOrderValue: decimal("average_order_value", {
    precision: 10,
    scale: 2,
  }).default("0"),

  // Product metrics
  totalProducts: integer("total_products").default(0),
  activeProducts: integer("active_products").default(0),
  outOfStockProducts: integer("out_of_stock_products").default(0),

  // Customer metrics
  uniqueCustomers: integer("unique_customers").default(0),
  repeatCustomers: integer("repeat_customers").default(0),
  customerRetentionRate: decimal("customer_retention_rate", {
    precision: 5,
    scale: 2,
  }).default("0"),

  // Engagement metrics
  totalViews: integer("total_views").default(0),
  totalClicks: integer("total_clicks").default(0),
  conversionRate: decimal("conversion_rate", {
    precision: 5,
    scale: 2,
  }).default("0"),

  // Review metrics
  averageRating: decimal("average_rating", { precision: 3, scale: 2 }).default(
    "0",
  ),
  totalReviews: integer("total_reviews").default(0),
  positiveReviewRate: decimal("positive_review_rate", {
    precision: 5,
    scale: 2,
  }).default("0"),

  // Response metrics
  averageResponseTime: integer("average_response_time").default(0), // Minutes
  responseRate: decimal("response_rate", { precision: 5, scale: 2 }).default(
    "0",
  ),

  // Fulfillment metrics
  onTimeDeliveryRate: decimal("on_time_delivery_rate", {
    precision: 5,
    scale: 2,
  }).default("0"),
  averageShippingTime: decimal("average_shipping_time", {
    precision: 5,
    scale: 2,
  }).default("0"), // Days

  // Dispute metrics
  totalDisputes: integer("total_disputes").default(0),
  disputeResolutionRate: decimal("dispute_resolution_rate", {
    precision: 5,
    scale: 2,
  }).default("0"),

  // Boost performance
  totalBoosts: integer("total_boosts").default(0),
  boostROI: decimal("boost_roi", { precision: 10, scale: 2 }).default("0"),

  createdAt: timestamp("created_at").defaultNow(),
});

// Seller performance score tracking
export const sellerScores = pgTable("seller_scores", {
  id: uuid("id").primaryKey().defaultRandom(),
  sellerId: uuid("seller_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),

  // Overall performance score (0-100)
  overallScore: decimal("overall_score", { precision: 5, scale: 2 }).notNull(),

  // Component scores
  qualityScore: decimal("quality_score", { precision: 5, scale: 2 }).default(
    "0",
  ),
  serviceScore: decimal("service_score", { precision: 5, scale: 2 }).default(
    "0",
  ),
  deliveryScore: decimal("delivery_score", { precision: 5, scale: 2 }).default(
    "0",
  ),
  communicationScore: decimal("communication_score", {
    precision: 5,
    scale: 2,
  }).default("0"),

  // Score factors
  factors: jsonb("factors"), // Detailed breakdown of what influenced the score

  // Badge/tier information
  tier: text("tier").default("bronze"), // 'bronze', 'silver', 'gold', 'platinum'
  badges: text("badges").array(), // ['fast_shipper', 'top_rated', 'excellent_service']

  // Score history
  previousScore: decimal("previous_score", { precision: 5, scale: 2 }),
  scoreChange: decimal("score_change", { precision: 5, scale: 2 }).default("0"),

  // Calculation metadata
  calculatedAt: timestamp("calculated_at").defaultNow(),
  nextCalculationDate: timestamp("next_calculation_date"),

  createdAt: timestamp("created_at").defaultNow(),
});

// Price history tracking for products
export const productPriceHistory = pgTable("product_price_history", {
  id: uuid("id").primaryKey().defaultRandom(),
  productId: uuid("product_id")
    .notNull()
    .references(() => products.id, { onDelete: "cascade" }),

  // Price information
  price: decimal("price", { precision: 10, scale: 2 }).notNull(),
  discountPrice: decimal("discount_price", { precision: 10, scale: 2 }),
  discountPercentage: decimal("discount_percentage", {
    precision: 5,
    scale: 2,
  }),

  // Change context
  changeReason: text("change_reason"), // 'manual', 'campaign', 'automatic', 'competitor_match'
  changedBy: uuid("changed_by").references(() => users.id),

  // Effective period
  effectiveFrom: timestamp("effective_from").notNull(),
  effectiveTo: timestamp("effective_to"),

  createdAt: timestamp("created_at").defaultNow(),
});

// Product recommendations engine
export const productRecommendations = pgTable("product_recommendations", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),

  // Recommendation context
  sourceProductId: uuid("source_product_id").references(() => products.id), // Product that triggered recommendation
  recommendedProductId: uuid("recommended_product_id")
    .notNull()
    .references(() => products.id, { onDelete: "cascade" }),

  // Recommendation algorithm
  algorithm: text("algorithm").notNull(), // 'collaborative_filtering', 'content_based', 'popular', 'recently_viewed'
  confidence: decimal("confidence", { precision: 5, scale: 2 }).notNull(), // 0-100

  // Context
  context: text("context"), // 'product_page', 'checkout', 'home_feed', 'search_results'

  // Performance tracking
  shown: boolean("shown").default(false),
  clicked: boolean("clicked").default(false),
  purchased: boolean("purchased").default(false),

  // Timing
  shownAt: timestamp("shown_at"),
  clickedAt: timestamp("clicked_at"),
  purchasedAt: timestamp("purchased_at"),

  // Expiry
  expiresAt: timestamp("expires_at"), // When this recommendation becomes stale

  createdAt: timestamp("created_at").defaultNow(),
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
// Temporarily commented out due to index issue
// export const chatThreadTypeIdx = index("chat_thread_type_idx").on(
//   chatThreads.type,
// );
// export const chatMessageThreadIdx = index("chat_message_thread_idx").on(
//   chatMessages.threadId,
// );

// Trade indexes
// export const p2pTradeStatusIdx = index("p2p_trade_status_idx").on(
//   p2pTrades.status,
// );
// export const p2pTradeBuyerIdx = index("p2p_trade_buyer_idx").on(
//   p2pTrades.buyerId,
// );
// export const p2pTradeSellerIdx = index("p2p_trade_seller_idx").on(
//   p2pTrades.sellerId,
// );

// Admin activity indexes
// export const adminActivityAdminIdx = index("admin_activity_admin_idx").on(
//   adminActivityLogs.adminId,
// );
// export const adminActivityActionIdx = index("admin_activity_action_idx").on(
//   adminActivityLogs.action,
// );

// Report indexes
// export const contentReportStatusIdx = index("content_report_status_idx").on(
//   contentReports.status,
// );
// export const contentReportTypeIdx = index("content_report_type_idx").on(
//   contentReports.contentType,
// );

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

// Creator Economy types
export type CreatorEarning = typeof creatorEarnings.$inferSelect;
export type SoftPointsLog = typeof softPointsLog.$inferSelect;
export type MonetizedContent = typeof monetizedContent.$inferSelect;
export type RevenueHistory = typeof revenueHistory.$inferSelect;
export type Subscription = typeof subscriptions.$inferSelect;
export type CreatorPayout = typeof creatorPayouts.$inferSelect;

export type InsertCreatorEarning = typeof creatorEarnings.$inferInsert;
export type InsertSoftPointsLog = typeof softPointsLog.$inferInsert;
export type InsertMonetizedContent = typeof monetizedContent.$inferInsert;
export type InsertRevenueHistory = typeof revenueHistory.$inferInsert;
export type InsertSubscription = typeof subscriptions.$inferInsert;
export type InsertCreatorPayout = typeof creatorPayouts.$inferInsert;
