import express from "express";
import { db } from "../db";
import {
  creatorEarnings,
  softPointsLog,
  monetizedContent,
  creatorSubscriptions,
  creatorBoosts,
  revenueHistory,
  revenueSettings,
  creatorPayouts,
  creatorTiers,
  creatorWalletTransactions,
} from "../../shared/creator-economy-schema";
import { users, profiles } from "../../shared/schema";
import { eq, desc, asc, and, gte, lte, sum, count, sql } from "drizzle-orm";
import { z } from "zod";
import { formatDistanceToNow } from "date-fns";

const router = express.Router();

// =============================================================================
// REVENUE API ENDPOINTS
// =============================================================================

// GET /api/creator/revenue/summary - Main revenue dashboard
router.get("/revenue/summary", async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    // Get current period (last 30 days)
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - 30);

    // Get earnings breakdown by type
    const earningsData = await db
      .select({
        revenueType: creatorEarnings.revenueType,
        totalAmount: sql<number>`COALESCE(SUM(${creatorEarnings.netAmount}), 0)`,
        softPointsEarned: sql<number>`COALESCE(SUM(${creatorEarnings.softPointsEarned}), 0)`,
        count: sql<number>`COUNT(*)`,
      })
      .from(creatorEarnings)
      .where(
        and(
          eq(creatorEarnings.creatorId, userId),
          gte(creatorEarnings.createdAt, startDate),
          lte(creatorEarnings.createdAt, endDate),
          eq(creatorEarnings.status, "confirmed"),
        ),
      )
      .groupBy(creatorEarnings.revenueType);

    // Calculate totals
    const totalEarnings = earningsData.reduce(
      (sum, item) => sum + Number(item.totalAmount),
      0,
    );
    const totalSoftPoints = earningsData.reduce(
      (sum, item) => sum + Number(item.softPointsEarned),
      0,
    );

    // Get earnings by type
    const earningsByType = {
      tips:
        earningsData.find((e) => e.revenueType === "tips")?.totalAmount || 0,
      subscriptions:
        earningsData.find((e) => e.revenueType === "subscriptions")
          ?.totalAmount || 0,
      views:
        earningsData.find((e) => e.revenueType === "views")?.totalAmount || 0,
      boosts:
        earningsData.find((e) => e.revenueType === "boosts")?.totalAmount || 0,
      services:
        earningsData.find((e) => e.revenueType === "services")?.totalAmount ||
        0,
    };

    // Get current SoftPoints balance
    const latestSoftPointsEntry = await db
      .select({ balanceAfter: softPointsLog.balanceAfter })
      .from(softPointsLog)
      .where(eq(softPointsLog.userId, userId))
      .orderBy(desc(softPointsLog.createdAt))
      .limit(1);

    const currentSoftPointsBalance =
      latestSoftPointsEntry[0]?.balanceAfter || 0;

    // Calculate available to withdraw (confirmed earnings minus pending payouts)
    const pendingPayouts = await db
      .select({
        totalPending: sql<number>`COALESCE(SUM(${creatorPayouts.amount}), 0)`,
      })
      .from(creatorPayouts)
      .where(
        and(
          eq(creatorPayouts.creatorId, userId),
          eq(creatorPayouts.status, "pending"),
        ),
      );

    const availableToWithdraw =
      totalEarnings - Number(pendingPayouts[0]?.totalPending || 0);

    res.json({
      totalEarnings,
      earningsByType,
      softPointsEarned: totalSoftPoints,
      softPointsBalance: currentSoftPointsBalance,
      availableToWithdraw: Math.max(0, availableToWithdraw),
      period: {
        startDate,
        endDate,
        days: 30,
      },
    });
  } catch (error) {
    console.error("Error fetching revenue summary:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// GET /api/creator/revenue/history - Revenue transaction history
router.get("/revenue/history", async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const {
      type = "all",
      page = "1",
      limit = "20",
      startDate,
      endDate,
    } = req.query as Record<string, string>;

    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const offset = (pageNum - 1) * limitNum;

    // Build where conditions
    let whereConditions = [eq(creatorEarnings.creatorId, userId)];

    if (type !== "all") {
      whereConditions.push(eq(creatorEarnings.revenueType, type));
    }

    if (startDate) {
      whereConditions.push(gte(creatorEarnings.createdAt, new Date(startDate)));
    }

    if (endDate) {
      whereConditions.push(lte(creatorEarnings.createdAt, new Date(endDate)));
    }

    // Get earnings history with user details
    const history = await db
      .select({
        id: creatorEarnings.id,
        type: creatorEarnings.revenueType,
        amount: creatorEarnings.netAmount,
        softPoints: creatorEarnings.softPointsEarned,
        description: creatorEarnings.description,
        status: creatorEarnings.status,
        date: creatorEarnings.createdAt,
        fromUser: {
          id: users.id,
          username: profiles.username,
          fullName: profiles.fullName,
          avatar: profiles.avatar,
        },
        metadata: creatorEarnings.metadata,
        contentId: creatorEarnings.contentId,
      })
      .from(creatorEarnings)
      .leftJoin(users, eq(creatorEarnings.fromUserId, users.id))
      .leftJoin(profiles, eq(users.id, profiles.userId))
      .where(and(...whereConditions))
      .orderBy(desc(creatorEarnings.createdAt))
      .limit(limitNum)
      .offset(offset);

    // Get total count for pagination
    const totalCount = await db
      .select({ count: sql<number>`COUNT(*)` })
      .from(creatorEarnings)
      .where(and(...whereConditions));

    const formattedHistory = history.map((item) => ({
      id: item.id,
      type: item.type,
      amount: Number(item.amount),
      softPoints: Number(item.softPoints || 0),
      description: item.description,
      status: item.status,
      date: item.date,
      fromUser: item.fromUser.id
        ? {
            id: item.fromUser.id,
            username:
              item.fromUser.username || `@user${item.fromUser.id.slice(-4)}`,
            fullName: item.fromUser.fullName,
            avatar: item.fromUser.avatar,
          }
        : null,
      metadata: item.metadata,
      contentId: item.contentId,
      timeAgo: formatDistanceToNow(new Date(item.date), { addSuffix: true }),
    }));

    res.json({
      history: formattedHistory,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total: Number(totalCount[0]?.count || 0),
        totalPages: Math.ceil(Number(totalCount[0]?.count || 0) / limitNum),
      },
    });
  } catch (error) {
    console.error("Error fetching revenue history:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// POST /api/creator/revenue/calculate-earnings - Calculate earnings for content
router.post("/revenue/calculate-earnings", async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const calculateEarningsSchema = z.object({
      contentId: z.string(),
      views: z.number().min(0),
      tips: z.number().min(0).optional(),
      subscriptionViews: z.number().min(0).optional(),
    });

    const {
      contentId,
      views,
      tips = 0,
      subscriptionViews = 0,
    } = calculateEarningsSchema.parse(req.body);

    // Get current revenue settings
    const viewSettings = await db
      .select()
      .from(revenueSettings)
      .where(
        and(
          eq(revenueSettings.category, "views"),
          eq(revenueSettings.settingKey, "standard_rate"),
          eq(revenueSettings.isActive, true),
        ),
      )
      .limit(1);

    // Default rates if no settings found
    const viewRate = Number(viewSettings[0]?.rate || 0.001); // $0.001 per view
    const softPointsPerView = Number(viewSettings[0]?.softPointsRate || 0.005); // 5 SP per view

    // Calculate earnings
    const calculations = {
      views: {
        count: views,
        rate: viewRate,
        earnings: views * viewRate,
        softPoints: Math.floor(views / 1000) * 5, // 5 SP per 1000 views
      },
      tips: {
        count: tips,
        earnings: tips * 1.0, // Direct tip amount
        softPoints: tips * 1, // 1 SP per tip
      },
      subscriptionViews: {
        count: subscriptionViews,
        rate: viewRate * 2, // 2x rate for subscription views
        earnings: subscriptionViews * (viewRate * 2),
        softPoints: subscriptionViews * 0.01, // Higher SP rate for subscription views
      },
    };

    const totalEarnings = Object.values(calculations).reduce(
      (sum, calc) => sum + calc.earnings,
      0,
    );
    const totalSoftPoints = Object.values(calculations).reduce(
      (sum, calc) => sum + calc.softPoints,
      0,
    );

    // Check if this content exists in monetized_content
    const existingContent = await db
      .select()
      .from(monetizedContent)
      .where(
        and(
          eq(monetizedContent.contentId, contentId),
          eq(monetizedContent.creatorId, userId),
        ),
      )
      .limit(1);

    // Update or create monetized content record
    if (existingContent.length > 0) {
      await db
        .update(monetizedContent)
        .set({
          totalViews: views,
          totalRevenue: sql`${monetizedContent.totalRevenue} + ${totalEarnings}`,
          totalSoftPoints: sql`${monetizedContent.totalSoftPoints} + ${totalSoftPoints}`,
          lastRevenueCalculation: new Date(),
          updatedAt: new Date(),
        })
        .where(eq(monetizedContent.id, existingContent[0].id));
    }

    res.json({
      contentId,
      calculations,
      totalEarnings,
      totalSoftPoints,
      processed: existingContent.length > 0,
      message:
        existingContent.length > 0
          ? "Earnings calculated and added to content record"
          : "Earnings calculated (content not yet registered)",
    });
  } catch (error) {
    console.error("Error calculating earnings:", error);
    if (error instanceof z.ZodError) {
      return res
        .status(400)
        .json({ error: "Invalid request data", details: error.errors });
    }
    res.status(500).json({ error: "Internal server error" });
  }
});

// GET /api/creator/revenue/chart-data - Chart data for revenue visualization
router.get("/revenue/chart-data", async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const { period = "7d" } = req.query as Record<string, string>;

    let days: number;
    switch (period) {
      case "7d":
        days = 7;
        break;
      case "30d":
        days = 30;
        break;
      case "90d":
        days = 90;
        break;
      default:
        days = 7;
    }

    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    // Get daily revenue data
    const dailyData = await db
      .select({
        date: sql<string>`DATE(${creatorEarnings.createdAt})`,
        tips: sql<number>`COALESCE(SUM(CASE WHEN ${creatorEarnings.revenueType} = 'tips' THEN ${creatorEarnings.netAmount} ELSE 0 END), 0)`,
        subscriptions: sql<number>`COALESCE(SUM(CASE WHEN ${creatorEarnings.revenueType} = 'subscriptions' THEN ${creatorEarnings.netAmount} ELSE 0 END), 0)`,
        views: sql<number>`COALESCE(SUM(CASE WHEN ${creatorEarnings.revenueType} = 'views' THEN ${creatorEarnings.netAmount} ELSE 0 END), 0)`,
        softPoints: sql<number>`COALESCE(SUM(${creatorEarnings.softPointsEarned}), 0)`,
      })
      .from(creatorEarnings)
      .where(
        and(
          eq(creatorEarnings.creatorId, userId),
          gte(creatorEarnings.createdAt, startDate),
          lte(creatorEarnings.createdAt, endDate),
          eq(creatorEarnings.status, "confirmed"),
        ),
      )
      .groupBy(sql`DATE(${creatorEarnings.createdAt})`)
      .orderBy(sql`DATE(${creatorEarnings.createdAt})`);

    // Fill in missing dates with zero values
    const labels: string[] = [];
    const tips: number[] = [];
    const subscriptions: number[] = [];
    const viewsSP: number[] = [];

    for (let i = 0; i < days; i++) {
      const date = new Date(startDate);
      date.setDate(date.getDate() + i);
      const dateStr = date.toISOString().split("T")[0];

      labels.push(
        date.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
      );

      const dayData = dailyData.find((d) => d.date === dateStr);
      tips.push(Number(dayData?.tips || 0));
      subscriptions.push(Number(dayData?.subscriptions || 0));
      viewsSP.push(Number(dayData?.softPoints || 0));
    }

    res.json({
      labels,
      tips,
      subscriptions,
      viewsSP,
      period,
      startDate,
      endDate,
    });
  } catch (error) {
    console.error("Error fetching chart data:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// =============================================================================
// SOFTPOINTS API ENDPOINTS
// =============================================================================

// GET /api/creator/softpoints/balance - Get current SoftPoints balance
router.get("/softpoints/balance", async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const latestEntry = await db
      .select({
        balance: softPointsLog.balanceAfter,
        lastTransaction: softPointsLog.createdAt,
      })
      .from(softPointsLog)
      .where(eq(softPointsLog.userId, userId))
      .orderBy(desc(softPointsLog.createdAt))
      .limit(1);

    const balance = Number(latestEntry[0]?.balance || 0);
    const lastTransaction = latestEntry[0]?.lastTransaction;

    // Get recent earning summary
    const recentEarnings = await db
      .select({
        totalEarned: sql<number>`COALESCE(SUM(${softPointsLog.amount}), 0)`,
      })
      .from(softPointsLog)
      .where(
        and(
          eq(softPointsLog.userId, userId),
          eq(softPointsLog.transactionType, "earned"),
          gte(
            softPointsLog.createdAt,
            new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
          ), // Last 7 days
        ),
      );

    res.json({
      balance,
      lastTransaction,
      weeklyEarnings: Number(recentEarnings[0]?.totalEarned || 0),
    });
  } catch (error) {
    console.error("Error fetching SoftPoints balance:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// GET /api/creator/softpoints/history - SoftPoints transaction history
router.get("/softpoints/history", async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const { page = "1", limit = "20" } = req.query as Record<string, string>;
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const offset = (pageNum - 1) * limitNum;

    const history = await db
      .select()
      .from(softPointsLog)
      .where(eq(softPointsLog.userId, userId))
      .orderBy(desc(softPointsLog.createdAt))
      .limit(limitNum)
      .offset(offset);

    const totalCount = await db
      .select({ count: sql<number>`COUNT(*)` })
      .from(softPointsLog)
      .where(eq(softPointsLog.userId, userId));

    const formattedHistory = history.map((item) => ({
      ...item,
      amount: Number(item.amount),
      balanceBefore: Number(item.balanceBefore),
      balanceAfter: Number(item.balanceAfter),
      timeAgo: formatDistanceToNow(new Date(item.createdAt), {
        addSuffix: true,
      }),
    }));

    res.json({
      history: formattedHistory,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total: Number(totalCount[0]?.count || 0),
        totalPages: Math.ceil(Number(totalCount[0]?.count || 0) / limitNum),
      },
    });
  } catch (error) {
    console.error("Error fetching SoftPoints history:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// =============================================================================
// CONTENT MONETIZATION API
// =============================================================================

// GET /api/creator/content/monetized - Get monetized content performance
router.get("/content/monetized", async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const {
      page = "1",
      limit = "20",
      type = "all",
    } = req.query as Record<string, string>;
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const offset = (pageNum - 1) * limitNum;

    let whereConditions = [eq(monetizedContent.creatorId, userId)];

    if (type !== "all") {
      whereConditions.push(eq(monetizedContent.contentType, type));
    }

    const content = await db
      .select()
      .from(monetizedContent)
      .where(and(...whereConditions))
      .orderBy(desc(monetizedContent.updatedAt))
      .limit(limitNum)
      .offset(offset);

    const totalCount = await db
      .select({ count: sql<number>`COUNT(*)` })
      .from(monetizedContent)
      .where(and(...whereConditions));

    const formattedContent = content.map((item) => ({
      ...item,
      totalRevenue: Number(item.totalRevenue),
      totalSoftPoints: Number(item.totalSoftPoints),
      totalTips: Number(item.totalTips),
      publishedAgo: formatDistanceToNow(new Date(item.publishedAt), {
        addSuffix: true,
      }),
      lastCalculationAgo: item.lastRevenueCalculation
        ? formatDistanceToNow(new Date(item.lastRevenueCalculation), {
            addSuffix: true,
          })
        : null,
    }));

    res.json({
      content: formattedContent,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total: Number(totalCount[0]?.count || 0),
        totalPages: Math.ceil(Number(totalCount[0]?.count || 0) / limitNum),
      },
    });
  } catch (error) {
    console.error("Error fetching monetized content:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// POST /api/creator/content/register - Register content for monetization
router.post("/content/register", async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const registerContentSchema = z.object({
      contentId: z.string(),
      contentType: z.enum(["post", "video", "story", "reel"]),
      title: z.string().optional(),
      monetizationTypes: z
        .array(z.enum(["views", "tips", "subscriptions"]))
        .default(["views", "tips"]),
    });

    const data = registerContentSchema.parse(req.body);

    // Check if content already registered
    const existing = await db
      .select()
      .from(monetizedContent)
      .where(
        and(
          eq(monetizedContent.contentId, data.contentId),
          eq(monetizedContent.creatorId, userId),
        ),
      )
      .limit(1);

    if (existing.length > 0) {
      return res
        .status(400)
        .json({ error: "Content already registered for monetization" });
    }

    // Register content
    const newContent = await db
      .insert(monetizedContent)
      .values({
        contentId: data.contentId,
        creatorId: userId,
        contentType: data.contentType,
        title: data.title,
        monetizationTypes: data.monetizationTypes,
        publishedAt: new Date(),
        nextCalculationDue: new Date(Date.now() + 24 * 60 * 60 * 1000), // Next day
      })
      .returning();

    res.json({
      success: true,
      content: newContent[0],
      message: "Content registered for monetization",
    });
  } catch (error) {
    console.error("Error registering content:", error);
    if (error instanceof z.ZodError) {
      return res
        .status(400)
        .json({ error: "Invalid request data", details: error.errors });
    }
    res.status(500).json({ error: "Internal server error" });
  }
});

// =============================================================================
// CREATOR TIER & ANALYTICS API
// =============================================================================

// GET /api/creator/tier/current - Get current creator tier and progress
router.get("/tier/current", async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const tier = await db
      .select()
      .from(creatorTiers)
      .where(eq(creatorTiers.creatorId, userId))
      .limit(1);

    if (tier.length === 0) {
      // Create initial tier record
      const newTier = await db
        .insert(creatorTiers)
        .values({
          creatorId: userId,
          currentTier: "bronze",
          tierAchievedAt: new Date(),
        })
        .returning();

      return res.json(newTier[0]);
    }

    const currentTier = tier[0];

    // Calculate progress to next tier
    const tierRequirements = {
      bronze: { revenue: 0, views: 0, subscribers: 0 },
      silver: { revenue: 1000, views: 100000, subscribers: 100 },
      gold: { revenue: 5000, views: 500000, subscribers: 500 },
      platinum: { revenue: 15000, views: 1500000, subscribers: 1500 },
      diamond: { revenue: 50000, views: 5000000, subscribers: 5000 },
    };

    const current = currentTier.currentTier as keyof typeof tierRequirements;
    const nextTiers = Object.keys(tierRequirements);
    const currentIndex = nextTiers.indexOf(current);
    const nextTier = nextTiers[currentIndex + 1];

    let progress = null;
    if (nextTier) {
      const requirements =
        tierRequirements[nextTier as keyof typeof tierRequirements];
      progress = {
        nextTier,
        requirements,
        current: {
          revenue: Number(currentTier.totalRevenue),
          views: currentTier.totalViews,
          subscribers: currentTier.totalSubscribers,
        },
        percentages: {
          revenue: Math.min(
            100,
            (Number(currentTier.totalRevenue) / requirements.revenue) * 100,
          ),
          views: Math.min(
            100,
            (currentTier.totalViews / requirements.views) * 100,
          ),
          subscribers: Math.min(
            100,
            (currentTier.totalSubscribers / requirements.subscribers) * 100,
          ),
        },
      };
    }

    res.json({
      ...currentTier,
      totalRevenue: Number(currentTier.totalRevenue),
      averageRating: Number(currentTier.averageRating),
      revenueBonus: Number(currentTier.revenueBonus),
      softPointsMultiplier: Number(currentTier.softPointsMultiplier),
      progress,
    });
  } catch (error) {
    console.error("Error fetching creator tier:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
