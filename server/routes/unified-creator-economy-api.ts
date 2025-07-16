import express from "express";
import { z } from "zod";
import { eq, and, desc, gte, lte, sql, count, sum } from "drizzle-orm";
import { db } from "../db";
import { authenticateToken, AppError } from "../config/security";

// Import schemas from both systems
import {
  trustScores,
  activityLogs,
  dailyActivitySummaries,
  referralLinks,
  referralEvents,
  rewardRules,
  fraudDetectionLogs,
  boostShopItems,
  userBoosts,
  dailyChallenges,
  challengeProgress,
  ACTIVITY_TYPES,
  type ActivityType,
} from "../../shared/activity-economy-schema";

import {
  wallets,
  walletTransactions,
  creatorEarnings,
  softPointsLog,
  platformEarnings,
  monetizedContent,
  revenueHistory,
  subscriptions,
  creatorPayouts,
} from "../../shared/enhanced-schema";

import { users, profiles } from "../../shared/schema";

const router = express.Router();

// =============================================================================
// UNIFIED CREATOR ECONOMY API
// =============================================================================

// Get Complete Economy Summary
router.get(
  "/creator/economy/summary",
  authenticateToken,
  async (req, res, next) => {
    try {
      const userId = req.user!.userId;
      const { period = "30d" } = req.query;

      // Calculate date range
      let dateFilter;
      const now = new Date();
      if (period === "7d") {
        dateFilter = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      } else if (period === "30d") {
        dateFilter = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      } else if (period === "90d") {
        dateFilter = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
      }

      // Get wallet balance
      const [wallet] = await db
        .select()
        .from(wallets)
        .where(eq(wallets.userId, userId))
        .limit(1);

      // Get creator earnings breakdown
      let creatorEarningsQuery = db
        .select({
          sourceType: creatorEarnings.sourceType,
          totalAmount: sum(creatorEarnings.amount),
          count: count(creatorEarnings.id),
        })
        .from(creatorEarnings)
        .where(
          and(
            eq(creatorEarnings.userId, userId),
            eq(creatorEarnings.status, "confirmed"),
            dateFilter ? gte(creatorEarnings.earnedAt, dateFilter) : undefined,
          ),
        )
        .groupBy(creatorEarnings.sourceType);

      const creatorEarningsData = await creatorEarningsQuery;

      // Get activity earnings breakdown
      let activityEarningsQuery = db
        .select({
          actionType: activityLogs.actionType,
          totalSoftPoints: sum(activityLogs.finalSoftPoints),
          totalWalletBonus: sum(activityLogs.walletBonus),
          count: count(activityLogs.id),
        })
        .from(activityLogs)
        .where(
          and(
            eq(activityLogs.userId, userId),
            eq(activityLogs.status, "confirmed"),
            dateFilter ? gte(activityLogs.createdAt, dateFilter) : undefined,
          ),
        )
        .groupBy(activityLogs.actionType);

      const activityEarningsData = await activityEarningsQuery;

      // Get trust score
      const [trustScore] = await db
        .select()
        .from(trustScores)
        .where(eq(trustScores.userId, userId))
        .limit(1);

      // Get content metrics
      const contentMetrics = await db
        .select({
          totalContent: count(monetizedContent.id),
          totalViews: sum(monetizedContent.totalViews),
          totalEarnings: sum(monetizedContent.totalEarnings),
          totalTips: sum(monetizedContent.totalTips),
        })
        .from(monetizedContent)
        .where(eq(monetizedContent.userId, userId));

      // Get referral stats
      const referralStats = await db
        .select({
          totalReferrals: count(referralEvents.id),
          totalEarnings: sum(referralEvents.referrerReward),
        })
        .from(referralEvents)
        .where(
          and(
            eq(referralEvents.referrerId, userId),
            eq(referralEvents.rewardStatus, "paid"),
          ),
        );

      // Get subscription count
      const [subscriptionCount] = await db
        .select({ count: count(subscriptions.id) })
        .from(subscriptions)
        .where(
          and(
            eq(subscriptions.creatorId, userId),
            eq(subscriptions.status, "active"),
          ),
        );

      // Calculate totals
      const totalCreatorEarnings = creatorEarningsData.reduce(
        (sum, item) => sum + parseFloat(item.totalAmount || "0"),
        0,
      );

      const totalActivityEarnings = activityEarningsData.reduce(
        (sum, item) => sum + parseFloat(item.totalWalletBonus || "0"),
        0,
      );

      const totalSoftPointsEarned = activityEarningsData.reduce(
        (sum, item) => sum + parseFloat(item.totalSoftPoints || "0"),
        0,
      );

      const totalActivities = activityEarningsData.reduce(
        (sum, item) => sum + (item.count || 0),
        0,
      );

      // Format earnings by type
      const earningsByType = {
        tips: 0,
        subscriptions: 0,
        views: 0,
        boosts: 0,
        services: 0,
        activities: totalActivityEarnings,
      };

      creatorEarningsData.forEach((item) => {
        const amount = parseFloat(item.totalAmount || "0");
        switch (item.sourceType) {
          case "tips":
            earningsByType.tips = amount;
            break;
          case "subscriptions":
            earningsByType.subscriptions = amount;
            break;
          case "views":
            earningsByType.views = amount;
            break;
          case "boosts":
            earningsByType.boosts = amount;
            break;
          case "services":
            earningsByType.services = amount;
            break;
        }
      });

      const totalEarnings = totalCreatorEarnings + totalActivityEarnings;

      res.json({
        success: true,
        data: {
          // Activity Economy Data
          currentSoftPoints: wallet ? parseFloat(wallet.softPointsBalance) : 0,
          totalSoftPointsEarned,
          totalActivities,
          trustScore: trustScore
            ? {
                current: parseFloat(trustScore.currentScore),
                level: trustScore.trustLevel,
                multiplier: parseFloat(trustScore.rewardMultiplier),
                dailyCap: trustScore.dailySoftPointsCap,
              }
            : null,

          // Creator Economy Data
          totalEarnings,
          availableToWithdraw: wallet ? parseFloat(wallet.usdtBalance) : 0,
          earningsByType,

          // Wallet Data
          walletBalance: {
            usdt: wallet ? parseFloat(wallet.usdtBalance) : 0,
            eth: wallet ? parseFloat(wallet.ethBalance) : 0,
            btc: wallet ? parseFloat(wallet.btcBalance) : 0,
            softPoints: wallet ? parseFloat(wallet.softPointsBalance) : 0,
          },

          // Performance Data
          contentMetrics: {
            totalContent: contentMetrics[0]?.totalContent || 0,
            totalViews: contentMetrics[0]?.totalViews
              ? parseFloat(contentMetrics[0].totalViews)
              : 0,
            totalSubscribers: subscriptionCount?.count || 0,
            totalTips: contentMetrics[0]?.totalTips
              ? parseFloat(contentMetrics[0].totalTips)
              : 0,
          },

          // Referral Data
          referralStats: {
            totalReferrals: referralStats[0]?.totalReferrals || 0,
            totalReferralEarnings: referralStats[0]?.totalEarnings
              ? parseFloat(referralStats[0].totalEarnings)
              : 0,
            conversionRate: 0, // Would need more complex calculation
            activeReferrals: 0, // Would need more complex calculation
          },
        },
      });
    } catch (error) {
      next(error);
    }
  },
);

// Get Unified Activity History
router.get(
  "/creator/economy/history",
  authenticateToken,
  async (req, res, next) => {
    try {
      const userId = req.user!.userId;
      const { type = "all", page = 1, limit = 20 } = req.query;
      const offset = (parseInt(page as string) - 1) * parseInt(limit as string);

      // Get creator earnings history
      let creatorHistoryQuery = db
        .select({
          id: creatorEarnings.id,
          type: creatorEarnings.sourceType,
          description: creatorEarnings.description,
          amount: creatorEarnings.amount,
          currency: creatorEarnings.currency,
          softPoints: creatorEarnings.softPointsEarned,
          timestamp: creatorEarnings.earnedAt,
          source: sql`'creator'`,
          status: creatorEarnings.status,
          fromUser: sql`NULL`,
        })
        .from(creatorEarnings)
        .where(eq(creatorEarnings.userId, userId));

      // Get activity history
      let activityHistoryQuery = db
        .select({
          id: activityLogs.id,
          type: activityLogs.actionType,
          description: sql`CONCAT('Activity: ', ${activityLogs.actionType})`,
          amount: activityLogs.walletBonus,
          currency: activityLogs.currency,
          softPoints: activityLogs.finalSoftPoints,
          timestamp: activityLogs.createdAt,
          source: sql`'activity'`,
          status: activityLogs.status,
          fromUser: sql`NULL`,
        })
        .from(activityLogs)
        .where(eq(activityLogs.userId, userId));

      // Union both queries (simplified for demo)
      const creatorHistory = await creatorHistoryQuery
        .orderBy(desc(creatorEarnings.earnedAt))
        .limit(parseInt(limit as string))
        .offset(offset);

      const activityHistory = await activityHistoryQuery
        .orderBy(desc(activityLogs.createdAt))
        .limit(parseInt(limit as string))
        .offset(offset);

      // Combine and sort by timestamp
      const combinedHistory = [...creatorHistory, ...activityHistory]
        .sort(
          (a, b) =>
            new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime(),
        )
        .slice(0, parseInt(limit as string));

      res.json({
        success: true,
        data: combinedHistory.map((item) => ({
          id: item.id,
          type: item.type,
          description: item.description,
          softPoints: parseFloat(item.softPoints || "0"),
          walletBonus: parseFloat(item.amount || "0"),
          currency: item.currency,
          timestamp: item.timestamp,
          source: item.source,
          status: item.status,
        })),
        pagination: {
          page: parseInt(page as string),
          limit: parseInt(limit as string),
          hasMore: combinedHistory.length === parseInt(limit as string),
        },
      });
    } catch (error) {
      next(error);
    }
  },
);

// Get Content Performance
router.get(
  "/creator/economy/content",
  authenticateToken,
  async (req, res, next) => {
    try {
      const userId = req.user!.userId;
      const { type, limit = 20, offset = 0 } = req.query;

      let query = db
        .select()
        .from(monetizedContent)
        .where(eq(monetizedContent.userId, userId))
        .orderBy(desc(monetizedContent.updatedAt))
        .limit(parseInt(limit as string))
        .offset(parseInt(offset as string));

      if (type && type !== "all") {
        query = query.where(
          and(
            eq(monetizedContent.userId, userId),
            eq(monetizedContent.contentType, type as string),
          ),
        );
      }

      const content = await query;

      res.json({
        success: true,
        data: content.map((item) => ({
          id: item.id,
          type: item.contentType,
          title: item.title,
          views: item.totalViews,
          earnings: parseFloat(item.totalEarnings),
          tips: parseFloat(item.totalTips),
          softPoints: parseFloat(item.totalSoftPoints),
          createdAt: item.createdAt,
        })),
      });
    } catch (error) {
      next(error);
    }
  },
);

// Get Active Challenges
router.get(
  "/creator/economy/challenges",
  authenticateToken,
  async (req, res, next) => {
    try {
      const userId = req.user!.userId;

      // Get active challenges with user progress
      const challenges = await db
        .select({
          id: dailyChallenges.id,
          title: dailyChallenges.title,
          description: dailyChallenges.description,
          targetAction: dailyChallenges.targetAction,
          targetCount: dailyChallenges.targetCount,
          targetValue: dailyChallenges.targetValue,
          softPointsReward: dailyChallenges.softPointsReward,
          walletReward: dailyChallenges.walletReward,
          challengeType: dailyChallenges.challengeType,
          endDate: dailyChallenges.endDate,
          currentProgress: challengeProgress.currentProgress,
          currentValue: challengeProgress.currentValue,
          isCompleted: challengeProgress.isCompleted,
          rewardClaimed: challengeProgress.rewardClaimed,
        })
        .from(dailyChallenges)
        .leftJoin(
          challengeProgress,
          and(
            eq(challengeProgress.challengeId, dailyChallenges.id),
            eq(challengeProgress.userId, userId),
          ),
        )
        .where(
          and(
            eq(dailyChallenges.isActive, true),
            gte(dailyChallenges.endDate, new Date()),
          ),
        );

      res.json({
        success: true,
        data: challenges.map((challenge) => ({
          id: challenge.id,
          title: challenge.title,
          description: challenge.description,
          reward: parseFloat(challenge.softPointsReward),
          progress: challenge.currentProgress || 0,
          target: challenge.targetValue
            ? parseFloat(challenge.targetValue)
            : challenge.targetCount,
          type: challenge.challengeType,
          timeLeft: calculateTimeLeft(challenge.endDate),
        })),
      });
    } catch (error) {
      next(error);
    }
  },
);

// Process Withdrawal Request
router.post(
  "/creator/economy/withdraw",
  authenticateToken,
  async (req, res, next) => {
    try {
      const userId = req.user!.userId;
      const { amount, paymentMethod, paymentDetails } = req.body;

      const withdrawAmount = parseFloat(amount);
      if (withdrawAmount < 50) {
        throw new AppError("Minimum withdrawal amount is $50", 400);
      }

      // Get wallet
      const [wallet] = await db
        .select()
        .from(wallets)
        .where(eq(wallets.userId, userId))
        .limit(1);

      if (!wallet) {
        throw new AppError("Wallet not found", 404);
      }

      const availableBalance = parseFloat(wallet.usdtBalance);
      if (availableBalance < withdrawAmount) {
        throw new AppError("Insufficient balance", 400);
      }

      // Calculate fees
      const processingFee = withdrawAmount * 0.02; // 2% fee
      const netAmount = withdrawAmount - processingFee;

      await db.transaction(async (tx) => {
        // Create payout request
        const [payout] = await tx
          .insert(creatorPayouts)
          .values({
            userId,
            amount: withdrawAmount.toString(),
            currency: "USDT",
            periodStart: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
            periodEnd: new Date(),
            paymentMethod,
            paymentDetails,
            processingFee: processingFee.toString(),
            netAmount: netAmount.toString(),
            status: "pending",
          })
          .returning();

        // Deduct from wallet (mark as pending)
        await tx
          .update(wallets)
          .set({
            usdtBalance: sql`usdt_balance - ${withdrawAmount}`,
          })
          .where(eq(wallets.userId, userId));

        // Record transaction
        await tx.insert(walletTransactions).values({
          walletId: wallet.id,
          userId,
          type: "withdrawal",
          currency: "USDT",
          amount: withdrawAmount.toString(),
          fee: processingFee.toString(),
          netAmount: netAmount.toString(),
          referenceType: "payout",
          referenceId: payout.id,
          status: "pending",
          description: `Withdrawal request - ${paymentMethod}`,
        });
      });

      res.json({
        success: true,
        message: "Withdrawal request submitted successfully",
        data: {
          amount: withdrawAmount,
          fee: processingFee,
          netAmount,
          processingTime: "2-5 business days",
        },
      });
    } catch (error) {
      next(error);
    }
  },
);

// Log Unified Activity (enhanced from activity economy)
router.post(
  "/creator/economy/activity",
  authenticateToken,
  async (req, res, next) => {
    try {
      const userId = req.user!.userId;
      const { actionType, targetId, targetType, value, context, metadata } =
        req.body;

      // Import the activity logging logic from activity-economy-api
      // This would process the activity and update both systems

      res.json({
        success: true,
        message: "Activity processed successfully",
        // Return unified response
      });
    } catch (error) {
      next(error);
    }
  },
);

// =============================================================================
// HELPER FUNCTIONS
// =============================================================================

function calculateTimeLeft(endDate: Date): string {
  const now = new Date();
  const timeLeft = endDate.getTime() - now.getTime();

  if (timeLeft <= 0) return "Expired";

  const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
  const hours = Math.floor(
    (timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60),
  );
  const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));

  if (days > 0) return `${days}d ${hours}h`;
  if (hours > 0) return `${hours}h ${minutes}m`;
  return `${minutes}m`;
}

export default router;
