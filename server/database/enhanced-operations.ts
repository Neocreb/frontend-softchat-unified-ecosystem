import {
  eq,
  and,
  or,
  desc,
  asc,
  count,
  sql,
  like,
  gte,
  lte,
  inArray,
  isNull,
  not,
} from "drizzle-orm";
import { db } from "../db";
import {
  wallets,
  walletTransactions,
  escrowContracts,
  escrowMilestones,
  boosts,
  premiumSubscriptions,
  chatThreads,
  chatMessages,
  p2pTrades,
  p2pDisputes,
  marketplaceOrders,
  marketplaceReviews,
  platformEarnings,
  adminUsers,
  adminActivityLogs,
  contentReports,
  userSuspensions,
  type InsertWallet,
  type InsertWalletTransaction,
  type InsertEscrowContract,
  type InsertBoost,
  type InsertPremiumSubscription,
  type InsertChatThread,
  type InsertChatMessage,
  type InsertP2pTrade,
  type InsertMarketplaceOrder,
  type InsertContentReport,
  type InsertAdminUser,
} from "../../shared/enhanced-schema";

// =============================================================================
// WALLET OPERATIONS
// =============================================================================

export const walletOperations = {
  // Create wallet for new user
  async create(data: InsertWallet) {
    const [wallet] = await db.insert(wallets).values(data).returning();
    return wallet;
  },

  // Get wallet by user ID
  async getByUserId(userId: string) {
    const [wallet] = await db
      .select()
      .from(wallets)
      .where(eq(wallets.userId, userId))
      .limit(1);
    return wallet;
  },

  // Update wallet balance
  async updateBalance(
    userId: string,
    currency: "USDT" | "ETH" | "BTC" | "SOFT_POINTS",
    amount: number,
    operation: "add" | "subtract",
  ) {
    const field = {
      USDT: "usdtBalance",
      ETH: "ethBalance",
      BTC: "btcBalance",
      SOFT_POINTS: "softPointsBalance",
    }[currency];

    const updateValue =
      operation === "add"
        ? sql`${wallets[field as keyof typeof wallets]} + ${amount}`
        : sql`${wallets[field as keyof typeof wallets]} - ${amount}`;

    const [wallet] = await db
      .update(wallets)
      .set({ [field]: updateValue })
      .where(eq(wallets.userId, userId))
      .returning();

    return wallet;
  },

  // Freeze/unfreeze wallet
  async setFrozenStatus(
    userId: string,
    isFrozen: boolean,
    reason?: string,
    adminId?: string,
  ) {
    const [wallet] = await db
      .update(wallets)
      .set({
        isFrozen,
        freezeReason: isFrozen ? reason : null,
        frozenBy: isFrozen ? adminId : null,
        frozenAt: isFrozen ? new Date() : null,
      })
      .where(eq(wallets.userId, userId))
      .returning();

    return wallet;
  },

  // Get wallet transaction history
  async getTransactionHistory(
    userId: string,
    options: {
      limit?: number;
      offset?: number;
      type?: string;
      currency?: string;
      status?: string;
    } = {},
  ) {
    const { limit = 50, offset = 0, type, currency, status } = options;

    let query = db
      .select()
      .from(walletTransactions)
      .where(eq(walletTransactions.userId, userId))
      .orderBy(desc(walletTransactions.createdAt))
      .limit(limit)
      .offset(offset);

    const conditions = [eq(walletTransactions.userId, userId)];

    if (type) conditions.push(eq(walletTransactions.type, type));
    if (currency) conditions.push(eq(walletTransactions.currency, currency));
    if (status) conditions.push(eq(walletTransactions.status, status));

    if (conditions.length > 1) {
      query = query.where(and(...conditions));
    }

    return await query;
  },

  // Create transaction record
  async createTransaction(data: InsertWalletTransaction) {
    const [transaction] = await db
      .insert(walletTransactions)
      .values(data)
      .returning();
    return transaction;
  },
};

// =============================================================================
// ESCROW OPERATIONS
// =============================================================================

export const escrowOperations = {
  // Create escrow contract
  async create(data: InsertEscrowContract) {
    const [escrow] = await db.insert(escrowContracts).values(data).returning();
    return escrow;
  },

  // Get escrow by ID
  async getById(id: string) {
    const [escrow] = await db
      .select()
      .from(escrowContracts)
      .where(eq(escrowContracts.id, id))
      .limit(1);
    return escrow;
  },

  // Update escrow status
  async updateStatus(
    id: string,
    status: string,
    additionalData?: {
      releasedAt?: Date;
      refundedAt?: Date;
      releaseApprovedBy?: string;
      releaseNotes?: string;
    },
  ) {
    const [escrow] = await db
      .update(escrowContracts)
      .set({
        status,
        ...additionalData,
      })
      .where(eq(escrowContracts.id, id))
      .returning();

    return escrow;
  },

  // Get escrows by user
  async getByUser(userId: string, role: "payer" | "payee" | "both" = "both") {
    let query = db.select().from(escrowContracts);

    if (role === "payer") {
      query = query.where(eq(escrowContracts.payerId, userId));
    } else if (role === "payee") {
      query = query.where(eq(escrowContracts.payeeId, userId));
    } else {
      query = query.where(
        or(
          eq(escrowContracts.payerId, userId),
          eq(escrowContracts.payeeId, userId),
        ),
      );
    }

    return await query.orderBy(desc(escrowContracts.createdAt));
  },

  // Get expired escrows (for auto-release)
  async getExpiredEscrows() {
    return await db
      .select()
      .from(escrowContracts)
      .where(
        and(
          eq(escrowContracts.status, "funded"),
          lte(escrowContracts.expiresAt, new Date()),
        ),
      );
  },

  // Add milestone to escrow
  async addMilestone(
    escrowId: string,
    milestone: {
      title: string;
      description: string;
      amount: string;
      dueDate: Date;
    },
  ) {
    const [newMilestone] = await db
      .insert(escrowMilestones)
      .values({
        escrowId,
        ...milestone,
      })
      .returning();

    return newMilestone;
  },

  // Update milestone status
  async updateMilestoneStatus(
    milestoneId: string,
    status: string,
    additionalData?: {
      submittedAt?: Date;
      approvedAt?: Date;
      releasedAt?: Date;
      deliverables?: any[];
      reviewNotes?: string;
    },
  ) {
    const [milestone] = await db
      .update(escrowMilestones)
      .set({
        status,
        ...additionalData,
      })
      .where(eq(escrowMilestones.id, milestoneId))
      .returning();

    return milestone;
  },
};

// =============================================================================
// CHAT OPERATIONS
// =============================================================================

export const chatOperations = {
  // Create chat thread
  async createThread(data: InsertChatThread) {
    const [thread] = await db.insert(chatThreads).values(data).returning();
    return thread;
  },

  // Get thread by ID
  async getThreadById(id: string) {
    const [thread] = await db
      .select()
      .from(chatThreads)
      .where(eq(chatThreads.id, id))
      .limit(1);
    return thread;
  },

  // Get user's threads
  async getUserThreads(userId: string, type?: string) {
    let query = db
      .select({
        id: chatThreads.id,
        type: chatThreads.type,
        referenceId: chatThreads.referenceId,
        participants: chatThreads.participants,
        title: chatThreads.title,
        description: chatThreads.description,
        isGroup: chatThreads.isGroup,
        isArchived: chatThreads.isArchived,
        lastMessageAt: chatThreads.lastMessageAt,
        messageCount: chatThreads.messageCount,
        createdAt: chatThreads.createdAt,
        lastMessage: {
          id: chatMessages.id,
          content: chatMessages.content,
          messageType: chatMessages.messageType,
          senderId: chatMessages.senderId,
          createdAt: chatMessages.createdAt,
        },
      })
      .from(chatThreads)
      .leftJoin(chatMessages, eq(chatMessages.id, chatThreads.lastMessageId))
      .where(sql`${userId} = ANY(${chatThreads.participants})`)
      .orderBy(desc(chatThreads.lastMessageAt));

    if (type) {
      query = query.where(
        and(
          sql`${userId} = ANY(${chatThreads.participants})`,
          eq(chatThreads.type, type),
        ),
      );
    }

    return await query;
  },

  // Send message
  async sendMessage(data: InsertChatMessage) {
    const [message] = await db.insert(chatMessages).values(data).returning();

    // Update thread metadata
    await db
      .update(chatThreads)
      .set({
        lastMessageId: message.id,
        lastMessageAt: message.createdAt,
        messageCount: sql`${chatThreads.messageCount} + 1`,
      })
      .where(eq(chatThreads.id, message.threadId));

    return message;
  },

  // Get thread messages
  async getThreadMessages(
    threadId: string,
    options: {
      limit?: number;
      offset?: number;
      beforeMessageId?: string;
    } = {},
  ) {
    const { limit = 50, offset = 0, beforeMessageId } = options;

    let query = db
      .select({
        id: chatMessages.id,
        threadId: chatMessages.threadId,
        senderId: chatMessages.senderId,
        content: chatMessages.content,
        messageType: chatMessages.messageType,
        attachments: chatMessages.attachments,
        isEdited: chatMessages.isEdited,
        editedAt: chatMessages.editedAt,
        isDeleted: chatMessages.isDeleted,
        readBy: chatMessages.readBy,
        replyToId: chatMessages.replyToId,
        createdAt: chatMessages.createdAt,
        sender: {
          name: profiles.name,
          fullName: profiles.fullName,
          avatar: profiles.avatar,
        },
      })
      .from(chatMessages)
      .leftJoin(profiles, eq(profiles.userId, chatMessages.senderId))
      .where(
        and(
          eq(chatMessages.threadId, threadId),
          eq(chatMessages.isDeleted, false),
        ),
      )
      .orderBy(desc(chatMessages.createdAt))
      .limit(limit)
      .offset(offset);

    if (beforeMessageId) {
      const [beforeMessage] = await db
        .select({ createdAt: chatMessages.createdAt })
        .from(chatMessages)
        .where(eq(chatMessages.id, beforeMessageId))
        .limit(1);

      if (beforeMessage) {
        query = query.where(
          and(
            eq(chatMessages.threadId, threadId),
            eq(chatMessages.isDeleted, false),
            lte(chatMessages.createdAt, beforeMessage.createdAt),
          ),
        );
      }
    }

    return await query;
  },

  // Mark messages as read
  async markMessagesRead(messageIds: string[], userId: string) {
    const timestamp = new Date().toISOString();

    for (const messageId of messageIds) {
      await db
        .update(chatMessages)
        .set({
          readBy: sql`COALESCE(${chatMessages.readBy}, '{}'::jsonb) || ${JSON.stringify({ [userId]: timestamp })}::jsonb`,
        })
        .where(eq(chatMessages.id, messageId));
    }
  },

  // Archive/unarchive thread
  async setThreadArchived(threadId: string, isArchived: boolean) {
    const [thread] = await db
      .update(chatThreads)
      .set({ isArchived })
      .where(eq(chatThreads.id, threadId))
      .returning();

    return thread;
  },
};

// =============================================================================
// P2P TRADING OPERATIONS
// =============================================================================

export const p2pOperations = {
  // Create P2P offer
  async createOffer(data: typeof p2pOffers.$inferInsert) {
    const [offer] = await db.insert(p2pOffers).values(data).returning();
    return offer;
  },

  // Get active offers
  async getActiveOffers(
    filters: {
      cryptoType?: string;
      offerType?: string;
      paymentMethod?: string;
      minAmount?: number;
      maxAmount?: number;
      limit?: number;
      offset?: number;
    } = {},
  ) {
    const {
      cryptoType,
      offerType,
      paymentMethod,
      minAmount,
      maxAmount,
      limit = 20,
      offset = 0,
    } = filters;

    let query = db
      .select({
        id: p2pOffers.id,
        userId: p2pOffers.userId,
        offerType: p2pOffers.offerType,
        cryptoType: p2pOffers.cryptoType,
        amount: p2pOffers.amount,
        pricePerUnit: p2pOffers.pricePerUnit,
        paymentMethod: p2pOffers.paymentMethod,
        notes: p2pOffers.notes,
        expiresAt: p2pOffers.expiresAt,
        createdAt: p2pOffers.createdAt,
        user: {
          name: profiles.name,
          fullName: profiles.fullName,
          isVerified: profiles.isVerified,
          level: profiles.level,
        },
      })
      .from(p2pOffers)
      .leftJoin(profiles, eq(profiles.userId, p2pOffers.userId))
      .where(
        and(
          eq(p2pOffers.status, "active"),
          gte(p2pOffers.expiresAt, new Date()),
        ),
      )
      .orderBy(desc(p2pOffers.createdAt))
      .limit(limit)
      .offset(offset);

    const conditions = [
      eq(p2pOffers.status, "active"),
      gte(p2pOffers.expiresAt, new Date()),
    ];

    if (cryptoType) conditions.push(eq(p2pOffers.cryptoType, cryptoType));
    if (offerType) conditions.push(eq(p2pOffers.offerType, offerType));
    if (paymentMethod)
      conditions.push(eq(p2pOffers.paymentMethod, paymentMethod));
    if (minAmount) conditions.push(gte(p2pOffers.amount, minAmount.toString()));
    if (maxAmount) conditions.push(lte(p2pOffers.amount, maxAmount.toString()));

    query = query.where(and(...conditions));

    return await query;
  },

  // Create trade from offer
  async createTrade(data: InsertP2pTrade) {
    const [trade] = await db.insert(p2pTrades).values(data).returning();
    return trade;
  },

  // Get trade by ID
  async getTradeById(id: string) {
    const [trade] = await db
      .select({
        id: p2pTrades.id,
        offerId: p2pTrades.offerId,
        buyerId: p2pTrades.buyerId,
        sellerId: p2pTrades.sellerId,
        cryptoType: p2pTrades.cryptoType,
        amount: p2pTrades.amount,
        pricePerUnit: p2pTrades.pricePerUnit,
        totalAmount: p2pTrades.totalAmount,
        paymentMethod: p2pTrades.paymentMethod,
        status: p2pTrades.status,
        escrowId: p2pTrades.escrowId,
        chatThreadId: p2pTrades.chatThreadId,
        paymentDeadline: p2pTrades.paymentDeadline,
        releaseDeadline: p2pTrades.releaseDeadline,
        createdAt: p2pTrades.createdAt,
        completedAt: p2pTrades.completedAt,
        buyer: {
          name: profiles.name,
          fullName: profiles.fullName,
          avatar: profiles.avatar,
          isVerified: profiles.isVerified,
        },
        seller: {
          name: profiles.name,
          fullName: profiles.fullName,
          avatar: profiles.avatar,
          isVerified: profiles.isVerified,
        },
      })
      .from(p2pTrades)
      .leftJoin(profiles, eq(profiles.userId, p2pTrades.buyerId))
      .leftJoin(profiles, eq(profiles.userId, p2pTrades.sellerId))
      .where(eq(p2pTrades.id, id))
      .limit(1);

    return trade;
  },

  // Update trade status
  async updateTradeStatus(
    id: string,
    status: string,
    additionalData?: {
      paymentConfirmedAt?: Date;
      paymentConfirmedBy?: string;
      cryptoReleasedAt?: Date;
      completedAt?: Date;
    },
  ) {
    const [trade] = await db
      .update(p2pTrades)
      .set({
        status,
        ...additionalData,
      })
      .where(eq(p2pTrades.id, id))
      .returning();

    return trade;
  },

  // Get user trades
  async getUserTrades(userId: string, role?: "buyer" | "seller") {
    let query = db.select().from(p2pTrades).orderBy(desc(p2pTrades.createdAt));

    if (role === "buyer") {
      query = query.where(eq(p2pTrades.buyerId, userId));
    } else if (role === "seller") {
      query = query.where(eq(p2pTrades.sellerId, userId));
    } else {
      query = query.where(
        or(eq(p2pTrades.buyerId, userId), eq(p2pTrades.sellerId, userId)),
      );
    }

    return await query;
  },

  // Create dispute
  async createDispute(data: typeof p2pDisputes.$inferInsert) {
    const [dispute] = await db.insert(p2pDisputes).values(data).returning();
    return dispute;
  },

  // Get disputes
  async getDisputes(
    filters: {
      status?: string;
      priority?: string;
      assignedTo?: string;
      limit?: number;
      offset?: number;
    } = {},
  ) {
    const { status, priority, assignedTo, limit = 50, offset = 0 } = filters;

    let query = db
      .select()
      .from(p2pDisputes)
      .orderBy(desc(p2pDisputes.createdAt))
      .limit(limit)
      .offset(offset);

    const conditions = [];

    if (status) conditions.push(eq(p2pDisputes.status, status));
    if (priority) conditions.push(eq(p2pDisputes.priority, priority));
    if (assignedTo) conditions.push(eq(p2pDisputes.assignedTo, assignedTo));

    if (conditions.length > 0) {
      query = query.where(and(...conditions));
    }

    return await query;
  },
};

// =============================================================================
// MARKETPLACE OPERATIONS
// =============================================================================

export const marketplaceOperations = {
  // Create order
  async createOrder(data: InsertMarketplaceOrder) {
    const [order] = await db.insert(marketplaceOrders).values(data).returning();
    return order;
  },

  // Get order by ID
  async getOrderById(id: string) {
    const [order] = await db
      .select()
      .from(marketplaceOrders)
      .where(eq(marketplaceOrders.id, id))
      .limit(1);
    return order;
  },

  // Get user orders
  async getUserOrders(
    userId: string,
    role: "buyer" | "seller" | "both" = "both",
  ) {
    let query = db
      .select()
      .from(marketplaceOrders)
      .orderBy(desc(marketplaceOrders.createdAt));

    if (role === "buyer") {
      query = query.where(eq(marketplaceOrders.buyerId, userId));
    } else if (role === "seller") {
      query = query.where(eq(marketplaceOrders.sellerId, userId));
    } else {
      query = query.where(
        or(
          eq(marketplaceOrders.buyerId, userId),
          eq(marketplaceOrders.sellerId, userId),
        ),
      );
    }

    return await query;
  },

  // Update order status
  async updateOrderStatus(
    id: string,
    status: string,
    additionalData?: {
      confirmedAt?: Date;
      shippedAt?: Date;
      deliveredAt?: Date;
      trackingNumber?: string;
    },
  ) {
    const [order] = await db
      .update(marketplaceOrders)
      .set({
        status,
        ...additionalData,
      })
      .where(eq(marketplaceOrders.id, id))
      .returning();

    return order;
  },

  // Create review
  async createReview(data: typeof marketplaceReviews.$inferInsert) {
    const [review] = await db
      .insert(marketplaceReviews)
      .values(data)
      .returning();

    // Update product rating
    const [ratingStats] = await db
      .select({
        avgRating: sql<number>`AVG(${marketplaceReviews.overallRating})`,
        reviewCount: count(),
      })
      .from(marketplaceReviews)
      .where(eq(marketplaceReviews.productId, data.productId!));

    await db
      .update(products)
      .set({
        rating: ratingStats.avgRating?.toString(),
        reviewCount: ratingStats.reviewCount,
      })
      .where(eq(products.id, data.productId!));

    return review;
  },

  // Get product reviews
  async getProductReviews(
    productId: string,
    options: {
      limit?: number;
      offset?: number;
      minRating?: number;
    } = {},
  ) {
    const { limit = 20, offset = 0, minRating } = options;

    let query = db
      .select({
        id: marketplaceReviews.id,
        overallRating: marketplaceReviews.overallRating,
        qualityRating: marketplaceReviews.qualityRating,
        shippingRating: marketplaceReviews.shippingRating,
        serviceRating: marketplaceReviews.serviceRating,
        title: marketplaceReviews.title,
        comment: marketplaceReviews.comment,
        pros: marketplaceReviews.pros,
        cons: marketplaceReviews.cons,
        images: marketplaceReviews.images,
        isVerifiedPurchase: marketplaceReviews.isVerifiedPurchase,
        helpfulVotes: marketplaceReviews.helpfulVotes,
        totalVotes: marketplaceReviews.totalVotes,
        createdAt: marketplaceReviews.createdAt,
        reviewer: {
          name: profiles.name,
          fullName: profiles.fullName,
          avatar: profiles.avatar,
        },
      })
      .from(marketplaceReviews)
      .leftJoin(profiles, eq(profiles.userId, marketplaceReviews.reviewerId))
      .where(
        and(
          eq(marketplaceReviews.productId, productId),
          eq(marketplaceReviews.moderationStatus, "approved"),
        ),
      )
      .orderBy(desc(marketplaceReviews.createdAt))
      .limit(limit)
      .offset(offset);

    if (minRating) {
      query = query.where(
        and(
          eq(marketplaceReviews.productId, productId),
          eq(marketplaceReviews.moderationStatus, "approved"),
          gte(marketplaceReviews.overallRating, minRating),
        ),
      );
    }

    return await query;
  },
};

// =============================================================================
// BOOST & PREMIUM OPERATIONS
// =============================================================================

export const boostOperations = {
  // Create boost request
  async createBoost(data: InsertBoost) {
    const [boost] = await db.insert(boosts).values(data).returning();
    return boost;
  },

  // Get boost by ID
  async getBoostById(id: string) {
    const [boost] = await db
      .select()
      .from(boosts)
      .where(eq(boosts.id, id))
      .limit(1);
    return boost;
  },

  // Get user boosts
  async getUserBoosts(userId: string, status?: string) {
    let query = db
      .select()
      .from(boosts)
      .where(eq(boosts.userId, userId))
      .orderBy(desc(boosts.createdAt));

    if (status) {
      query = query.where(
        and(eq(boosts.userId, userId), eq(boosts.status, status)),
      );
    }

    return await query;
  },

  // Update boost status
  async updateBoostStatus(
    id: string,
    status: string,
    additionalData?: {
      approvedBy?: string;
      approvedAt?: Date;
      startDate?: Date;
      endDate?: Date;
      adminNotes?: string;
      rejectionReason?: string;
    },
  ) {
    const [boost] = await db
      .update(boosts)
      .set({
        status,
        ...additionalData,
      })
      .where(eq(boosts.id, id))
      .returning();

    return boost;
  },

  // Get expired boosts
  async getExpiredBoosts() {
    return await db
      .select()
      .from(boosts)
      .where(and(eq(boosts.status, "active"), lte(boosts.endDate, new Date())));
  },

  // Update boost performance
  async updateBoostPerformance(
    id: string,
    metrics: {
      impressions?: number;
      clicks?: number;
      conversions?: number;
    },
  ) {
    const [boost] = await db
      .update(boosts)
      .set(metrics)
      .where(eq(boosts.id, id))
      .returning();

    return boost;
  },
};

export const premiumOperations = {
  // Create subscription
  async createSubscription(data: InsertPremiumSubscription) {
    const [subscription] = await db
      .insert(premiumSubscriptions)
      .values(data)
      .returning();
    return subscription;
  },

  // Get user subscription
  async getUserSubscription(userId: string) {
    const [subscription] = await db
      .select()
      .from(premiumSubscriptions)
      .where(
        and(
          eq(premiumSubscriptions.userId, userId),
          eq(premiumSubscriptions.status, "active"),
        ),
      )
      .orderBy(desc(premiumSubscriptions.createdAt))
      .limit(1);

    return subscription;
  },

  // Update subscription status
  async updateSubscriptionStatus(
    id: string,
    status: string,
    additionalData?: {
      cancelledAt?: Date;
      cancellationReason?: string;
      lastPaymentAt?: Date;
    },
  ) {
    const [subscription] = await db
      .update(premiumSubscriptions)
      .set({
        status,
        ...additionalData,
      })
      .where(eq(premiumSubscriptions.id, id))
      .returning();

    return subscription;
  },

  // Get expiring subscriptions
  async getExpiringSubscriptions(daysFromNow: number = 7) {
    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + daysFromNow);

    return await db
      .select()
      .from(premiumSubscriptions)
      .where(
        and(
          eq(premiumSubscriptions.status, "active"),
          lte(premiumSubscriptions.endDate, expiryDate),
        ),
      );
  },

  // Use boost credits
  async useBoostCredits(userId: string, credits: number) {
    const [subscription] = await db
      .update(premiumSubscriptions)
      .set({
        usedBoostCredits: sql`${premiumSubscriptions.usedBoostCredits} + ${credits}`,
      })
      .where(
        and(
          eq(premiumSubscriptions.userId, userId),
          eq(premiumSubscriptions.status, "active"),
        ),
      )
      .returning();

    return subscription;
  },
};

// =============================================================================
// ADMIN OPERATIONS
// =============================================================================

export const adminOperations = {
  // Create admin user
  async createAdmin(data: InsertAdminUser) {
    const [admin] = await db.insert(adminUsers).values(data).returning();
    return admin;
  },

  // Get admin by ID
  async getAdminById(id: string) {
    const [admin] = await db
      .select()
      .from(adminUsers)
      .where(eq(adminUsers.id, id))
      .limit(1);
    return admin;
  },

  // Get admin by user ID
  async getAdminByUserId(userId: string) {
    const [admin] = await db
      .select()
      .from(adminUsers)
      .where(and(eq(adminUsers.userId, userId), eq(adminUsers.isActive, true)))
      .limit(1);
    return admin;
  },

  // Log admin activity
  async logActivity(data: typeof adminActivityLogs.$inferInsert) {
    const [log] = await db.insert(adminActivityLogs).values(data).returning();
    return log;
  },

  // Get admin activity logs
  async getActivityLogs(
    filters: {
      adminId?: string;
      action?: string;
      severity?: string;
      limit?: number;
      offset?: number;
    } = {},
  ) {
    const { adminId, action, severity, limit = 100, offset = 0 } = filters;

    let query = db
      .select()
      .from(adminActivityLogs)
      .orderBy(desc(adminActivityLogs.createdAt))
      .limit(limit)
      .offset(offset);

    const conditions = [];

    if (adminId) conditions.push(eq(adminActivityLogs.adminId, adminId));
    if (action) conditions.push(eq(adminActivityLogs.action, action));
    if (severity) conditions.push(eq(adminActivityLogs.severity, severity));

    if (conditions.length > 0) {
      query = query.where(and(...conditions));
    }

    return await query;
  },

  // Create content report
  async createContentReport(data: InsertContentReport) {
    const [report] = await db.insert(contentReports).values(data).returning();
    return report;
  },

  // Get content reports
  async getContentReports(
    filters: {
      status?: string;
      contentType?: string;
      priority?: string;
      assignedTo?: string;
      limit?: number;
      offset?: number;
    } = {},
  ) {
    const {
      status,
      contentType,
      priority,
      assignedTo,
      limit = 50,
      offset = 0,
    } = filters;

    let query = db
      .select()
      .from(contentReports)
      .orderBy(desc(contentReports.createdAt))
      .limit(limit)
      .offset(offset);

    const conditions = [];

    if (status) conditions.push(eq(contentReports.status, status));
    if (contentType)
      conditions.push(eq(contentReports.contentType, contentType));
    if (priority) conditions.push(eq(contentReports.priority, priority));
    if (assignedTo) conditions.push(eq(contentReports.assignedTo, assignedTo));

    if (conditions.length > 0) {
      query = query.where(and(...conditions));
    }

    return await query;
  },

  // Platform earnings
  async getPlatformEarnings(
    filters: {
      sourceType?: string;
      currency?: string;
      startDate?: Date;
      endDate?: Date;
      limit?: number;
      offset?: number;
    } = {},
  ) {
    const {
      sourceType,
      currency,
      startDate,
      endDate,
      limit = 100,
      offset = 0,
    } = filters;

    let query = db
      .select()
      .from(platformEarnings)
      .orderBy(desc(platformEarnings.earnedAt))
      .limit(limit)
      .offset(offset);

    const conditions = [];

    if (sourceType)
      conditions.push(eq(platformEarnings.sourceType, sourceType));
    if (currency) conditions.push(eq(platformEarnings.currency, currency));
    if (startDate) conditions.push(gte(platformEarnings.earnedAt, startDate));
    if (endDate) conditions.push(lte(platformEarnings.earnedAt, endDate));

    if (conditions.length > 0) {
      query = query.where(and(...conditions));
    }

    return await query;
  },

  // Get platform statistics
  async getPlatformStats() {
    const [userStats] = await db
      .select({
        totalUsers: count(),
        activeUsers: sql<number>`count(*) filter (where ${profiles.status} = 'active')`,
        verifiedUsers: sql<number>`count(*) filter (where ${profiles.isVerified} = true)`,
        premiumUsers: sql<number>`count(*) filter (where ${profiles.role} in ('silver', 'gold', 'pro'))`,
      })
      .from(profiles);

    const [transactionStats] = await db
      .select({
        totalTransactions: count(),
        totalVolume: sql<number>`sum(cast(${walletTransactions.amount} as decimal))`,
        todayTransactions: sql<number>`count(*) filter (where ${walletTransactions.createdAt} >= current_date)`,
        todayVolume: sql<number>`sum(cast(${walletTransactions.amount} as decimal)) filter (where ${walletTransactions.createdAt} >= current_date)`,
      })
      .from(walletTransactions)
      .where(eq(walletTransactions.status, "confirmed"));

    const [earningsStats] = await db
      .select({
        totalEarnings: sql<number>`sum(cast(${platformEarnings.feeAmount} as decimal))`,
        todayEarnings: sql<number>`sum(cast(${platformEarnings.feeAmount} as decimal)) filter (where ${platformEarnings.earnedAt} >= current_date)`,
        monthEarnings: sql<number>`sum(cast(${platformEarnings.feeAmount} as decimal)) filter (where ${platformEarnings.earnedAt} >= date_trunc('month', current_date))`,
      })
      .from(platformEarnings);

    return {
      users: userStats,
      transactions: transactionStats,
      earnings: earningsStats,
    };
  },
};
