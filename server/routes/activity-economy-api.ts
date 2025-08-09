import express from "express";
import { z } from "zod";
import { eq, and, desc, gte, lte, sql, count, sum } from "drizzle-orm";
import { db } from "../db";
import { authenticateToken, AppError } from "../config/security";
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
} from "../../shared/enhanced-schema";
import { users } from "../../shared/schema";

const router = express.Router();

// =============================================================================
// SMART REWARD ENGINE
// =============================================================================

// Log Activity and Calculate Rewards
const logActivitySchema = z.object({
  userId: z.string().uuid(),
  actionType: z.enum(ACTIVITY_TYPES),
  targetId: z.string().uuid().optional(),
  targetType: z.string().optional(),
  value: z.number().optional(), // For value-based rewards (purchase amount, etc.)
  context: z
    .object({
      ip: z.string().optional(),
      deviceId: z.string().optional(),
      sessionId: z.string().optional(),
      userAgent: z.string().optional(),
      location: z.string().optional(),
      timeSpent: z.number().optional(),
      clickDepth: z.number().optional(),
      referrer: z.string().optional(),
    })
    .optional(),
  metadata: z.record(z.any()).optional(),
});

router.post("/creator/reward", authenticateToken, async (req, res, next) => {
  try {
    const validatedData = logActivitySchema.parse(req.body);
    const {
      userId,
      actionType,
      targetId,
      targetType,
      value,
      context,
      metadata,
    } = validatedData;

    // Verify user exists and get trust score
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.id, userId))
      .limit(1);

    if (!user) {
      throw new AppError("User not found", 404);
    }

    // Get or create trust score
    let [trustScore] = await db
      .select()
      .from(trustScores)
      .where(eq(trustScores.userId, userId))
      .limit(1);

    if (!trustScore) {
      [trustScore] = await db
        .insert(trustScores)
        .values({ userId })
        .returning();
    }

    // Get reward rules for this action
    const [rewardRule] = await db
      .select()
      .from(rewardRules)
      .where(
        and(
          eq(rewardRules.actionType, actionType),
          eq(rewardRules.isActive, true),
        ),
      )
      .limit(1);

    if (!rewardRule) {
      return res.json({
        success: false,
        message: "No reward rule found for this action",
        softPoints: 0,
        walletBonus: 0,
        newTrustScore: parseFloat(trustScore.currentScore),
      });
    }

    // Check if user meets minimum requirements
    if (
      parseFloat(trustScore.currentScore) <
      parseFloat(rewardRule.minimumTrustScore)
    ) {
      throw new AppError("Trust score too low for this action", 403);
    }

    // Smart rate limiting - get recent activity for time-based decay
    const timeWindow = actionType === "post_content" ? 4 : 24; // 4 hours for posts, 24 for others
    const recentCutoff = new Date(Date.now() - timeWindow * 60 * 60 * 1000);

    const recentActivities = await db
      .select({
        count: count(),
        createdAt: activityLogs.createdAt
      })
      .from(activityLogs)
      .where(
        and(
          eq(activityLogs.userId, userId),
          eq(activityLogs.actionType, actionType),
          gte(activityLogs.createdAt, recentCutoff),
          eq(activityLogs.status, "confirmed"),
        ),
      );

    const recentCount = recentActivities[0]?.count || 0;

    // Check for daily limits for non-post activities (keep limits for actions prone to abuse)
    if (rewardRule.dailyLimit && actionType !== "post_content") {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const todayActivities = await db
        .select({ count: count() })
        .from(activityLogs)
        .where(
          and(
            eq(activityLogs.userId, userId),
            eq(activityLogs.actionType, actionType),
            gte(activityLogs.createdAt, today),
            eq(activityLogs.status, "confirmed"),
          ),
        );

      const dailyCount = todayActivities[0]?.count || 0;

      if (dailyCount >= rewardRule.dailyLimit) {
        return res.json({
          success: false,
          message: "Daily limit reached for this action",
          softPoints: 0,
          walletBonus: 0,
          newTrustScore: parseFloat(trustScore.currentScore),
        });
      }
    }

    // Calculate decay factor based on recent activity
    let decayFactor = 1.0;
    const activityCount = actionType === "post_content" ? recentCount :
                         (recentActivities[0]?.count || 0); // Use recent count for posts, daily for others

    if (rewardRule.decayEnabled && activityCount >= rewardRule.decayStart) {
      const decayExponent =
        (activityCount - rewardRule.decayStart + 1) *
        parseFloat(rewardRule.decayRate);
      decayFactor = Math.max(
        parseFloat(rewardRule.minMultiplier),
        Math.exp(-decayExponent),
      );
    }

    // Apply trust score multiplier
    const trustMultiplier = parseFloat(trustScore.rewardMultiplier);

    // Calculate final rewards
    const baseSoftPoints = parseFloat(rewardRule.baseSoftPoints);
    const baseWalletBonus = parseFloat(rewardRule.baseWalletBonus);

    // Apply value-based scaling if applicable
    let valueMultiplier = 1.0;
    if (value && rewardRule.minimumValue) {
      if (value < parseFloat(rewardRule.minimumValue)) {
        return res.json({
          success: false,
          message: "Value too low for reward",
          softPoints: 0,
          walletBonus: 0,
          newTrustScore: parseFloat(trustScore.currentScore),
        });
      }
      // Scale rewards based on value (e.g., for purchases)
      valueMultiplier = Math.min(
        value / parseFloat(rewardRule.minimumValue),
        10,
      ); // Cap at 10x
    }

    const finalSoftPoints =
      baseSoftPoints * decayFactor * trustMultiplier * valueMultiplier;
    const finalWalletBonus =
      baseWalletBonus * decayFactor * trustMultiplier * valueMultiplier;

    // Quality score calculation (placeholder for AI integration)
    const qualityScore = await calculateQualityScore(
      actionType,
      targetId,
      context,
    );

    // Apply quality multiplier
    const qualityMultiplier = Math.max(0.1, qualityScore);
    let adjustedSoftPoints = finalSoftPoints * qualityMultiplier;
    let adjustedWalletBonus = finalWalletBonus * qualityMultiplier;

    // Apply modest display mode quality adjustment for post creation
    if (actionType === "post_content" && metadata?.displayMode) {
      // Very small quality bonus that respects the existing reward structure
      let displayModeQualityBonus = 1.0;

      switch (metadata.displayMode) {
        case "both":
          displayModeQualityBonus = 1.1; // +10% for both feeds (better reach)
          break;
        case "thread":
        case "classic":
          displayModeQualityBonus = 1.05; // +5% for targeted content
          break;
        default:
          displayModeQualityBonus = 1.0;
      }

      // Apply only if within reasonable bounds and doesn't exceed quality threshold
      const maxQualityMultiplier = 1.2; // Cap total quality bonus at +20%
      const currentMultiplier = qualityMultiplier * displayModeQualityBonus;

      if (currentMultiplier <= maxQualityMultiplier) {
        adjustedSoftPoints = finalSoftPoints * currentMultiplier;
        adjustedWalletBonus = finalWalletBonus * currentMultiplier;
      }
    }

    // Fraud detection
    const riskScore = await calculateRiskScore(
      userId,
      actionType,
      context,
      dailyCount,
    );

    let status = "confirmed";
    if (riskScore > 70) {
      status = "suspicious";
      // Log fraud detection
      await db.insert(fraudDetectionLogs).values({
        userId,
        riskScore: riskScore.toString(),
        riskLevel: riskScore > 90 ? "critical" : "high",
        detectionMethod: "rule_based",
        flaggedActions: [actionType],
        riskFactors: [
          {
            factor: "high_frequency",
            weight: 0.3,
            description: "Unusually high activity frequency",
          },
          {
            factor: "suspicious_context",
            weight: 0.4,
            description: "Context indicators suggest automation",
          },
        ],
      });
    }

    // Database transaction for reward processing
    await db.transaction(async (tx) => {
      // Log the activity
      const [activityLog] = await tx
        .insert(activityLogs)
        .values({
          userId,
          actionType,
          targetId,
          targetType,
          baseSoftPoints: baseSoftPoints.toString(),
          finalSoftPoints: adjustedSoftPoints.toString(),
          walletBonus: adjustedWalletBonus.toString(),
          currency: rewardRule.currency,
          decayFactor: decayFactor.toString(),
          trustMultiplier: trustMultiplier.toString(),
          qualityScore: qualityScore.toString(),
          context,
          status,
          dailyCount: dailyCount + 1,
          metadata,
        })
        .returning();

      if (
        status === "confirmed" &&
        (adjustedSoftPoints > 0 || adjustedWalletBonus > 0)
      ) {
        // Update user wallet
        const [wallet] = await tx
          .select()
          .from(wallets)
          .where(eq(wallets.userId, userId))
          .limit(1);

        if (wallet) {
          // Add SoftPoints
          if (adjustedSoftPoints > 0) {
            await tx
              .update(wallets)
              .set({
                softPointsBalance: sql`soft_points_balance + ${adjustedSoftPoints}`,
              })
              .where(eq(wallets.userId, userId));

            // Log SoftPoints transaction
            await tx.insert(softPointsLog).values({
              userId,
              type: "earned",
              amount: adjustedSoftPoints.toString(),
              balanceAfter: sql`${wallet.softPointsBalance} + ${adjustedSoftPoints}`,
              sourceType: actionType,
              sourceId: activityLog.id,
              calculationRule: `Base: ${baseSoftPoints}, Decay: ${decayFactor.toFixed(4)}, Trust: ${trustMultiplier}, Quality: ${qualityScore.toFixed(2)}`,
              description: `Earned from ${actionType}`,
            });
          }

          // Add wallet bonus
          if (adjustedWalletBonus > 0) {
            const updateField =
              rewardRule.currency === "USDT"
                ? { usdtBalance: sql`usdt_balance + ${adjustedWalletBonus}` }
                : {
                    softPointsBalance: sql`soft_points_balance + ${adjustedWalletBonus}`,
                  };

            await tx
              .update(wallets)
              .set(updateField)
              .where(eq(wallets.userId, userId));

            // Log wallet transaction
            await tx.insert(walletTransactions).values({
              walletId: wallet.id,
              userId,
              type: "activity_reward",
              currency: rewardRule.currency,
              amount: adjustedWalletBonus.toString(),
              fee: "0",
              netAmount: adjustedWalletBonus.toString(),
              referenceType: "activity",
              referenceId: activityLog.id,
              status: "confirmed",
              description: `Activity reward: ${actionType}`,
            });
          }
        }

        // Update daily summary
        await updateDailyActivitySummary(
          tx,
          userId,
          adjustedSoftPoints,
          adjustedWalletBonus,
        );

        // Update trust score
        const newTrustScore = await updateTrustScore(
          tx,
          userId,
          actionType,
          qualityScore,
        );

        // Check and update challenges
        await updateChallengeProgress(tx, userId, actionType, value);
      }
    });

    res.json({
      success: true,
      status,
      softPoints: Math.round(adjustedSoftPoints * 100) / 100,
      walletBonus: Math.round(adjustedWalletBonus * 100000000) / 100000000,
      newTrustScore: parseFloat(trustScore.currentScore),
      riskScore: Math.round(riskScore),
      message:
        status === "suspicious"
          ? "Activity flagged for review"
          : "Reward processed successfully",
    });
  } catch (error) {
    next(error);
  }
});

// Get Reward Summary
router.get(
  "/creator/reward-summary",
  authenticateToken,
  async (req, res, next) => {
    try {
      const userId = req.user!.userId;
      const { period = "all" } = req.query;

      let dateFilter;
      const now = new Date();
      if (period === "7d") {
        dateFilter = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      } else if (period === "30d") {
        dateFilter = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      }

      // Get wallet balance
      const [wallet] = await db
        .select()
        .from(wallets)
        .where(eq(wallets.userId, userId))
        .limit(1);

      // Get activity summary
      let activityQuery = db
        .select({
          totalSoftPoints: sum(activityLogs.finalSoftPoints),
          totalWalletBonus: sum(activityLogs.walletBonus),
          totalActivities: count(activityLogs.id),
        })
        .from(activityLogs)
        .where(
          and(
            eq(activityLogs.userId, userId),
            eq(activityLogs.status, "confirmed"),
            dateFilter ? gte(activityLogs.createdAt, dateFilter) : undefined,
          ),
        );

      const [summary] = await activityQuery;

      // Get breakdown by action type
      let breakdownQuery = db
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

      const breakdown = await breakdownQuery;

      // Get trust score
      const [trustScore] = await db
        .select()
        .from(trustScores)
        .where(eq(trustScores.userId, userId))
        .limit(1);

      res.json({
        success: true,
        data: {
          currentSoftPoints: wallet ? parseFloat(wallet.softPointsBalance) : 0,
          currentWalletBalance: {
            usdt: wallet ? parseFloat(wallet.usdtBalance) : 0,
            eth: wallet ? parseFloat(wallet.ethBalance) : 0,
            btc: wallet ? parseFloat(wallet.btcBalance) : 0,
          },
          period: {
            totalSoftPointsEarned: summary?.totalSoftPoints
              ? parseFloat(summary.totalSoftPoints)
              : 0,
            totalWalletBonusEarned: summary?.totalWalletBonus
              ? parseFloat(summary.totalWalletBonus)
              : 0,
            totalActivities: summary?.totalActivities || 0,
          },
          breakdown: breakdown.map((item) => ({
            actionType: item.actionType,
            softPointsEarned: item.totalSoftPoints
              ? parseFloat(item.totalSoftPoints)
              : 0,
            walletBonusEarned: item.totalWalletBonus
              ? parseFloat(item.totalWalletBonus)
              : 0,
            activityCount: item.count,
          })),
          trustScore: trustScore
            ? {
                current: parseFloat(trustScore.currentScore),
                level: trustScore.trustLevel,
                multiplier: parseFloat(trustScore.rewardMultiplier),
                dailyCap: trustScore.dailySoftPointsCap,
              }
            : null,
        },
      });
    } catch (error) {
      next(error);
    }
  },
);

// Get Reward History
router.get(
  "/creator/reward-history",
  authenticateToken,
  async (req, res, next) => {
    try {
      const userId = req.user!.userId;
      const { type, page = 1, limit = 20 } = req.query;
      const offset = (parseInt(page as string) - 1) * parseInt(limit as string);

      let query = db
        .select({
          id: activityLogs.id,
          actionType: activityLogs.actionType,
          targetId: activityLogs.targetId,
          targetType: activityLogs.targetType,
          softPoints: activityLogs.finalSoftPoints,
          walletBonus: activityLogs.walletBonus,
          currency: activityLogs.currency,
          status: activityLogs.status,
          qualityScore: activityLogs.qualityScore,
          createdAt: activityLogs.createdAt,
        })
        .from(activityLogs)
        .where(
          and(
            eq(activityLogs.userId, userId),
            type ? eq(activityLogs.actionType, type as string) : undefined,
          ),
        )
        .orderBy(desc(activityLogs.createdAt))
        .limit(parseInt(limit as string))
        .offset(offset);

      const history = await query;

      res.json({
        success: true,
        data: history.map((item) => ({
          ...item,
          softPoints: parseFloat(item.softPoints),
          walletBonus: parseFloat(item.walletBonus),
          qualityScore: parseFloat(item.qualityScore),
        })),
        pagination: {
          page: parseInt(page as string),
          limit: parseInt(limit as string),
          hasMore: history.length === parseInt(limit as string),
        },
      });
    } catch (error) {
      next(error);
    }
  },
);

// Get Trust Score
router.get(
  "/creator/trust-score",
  authenticateToken,
  async (req, res, next) => {
    try {
      const userId = req.user!.userId;

      const [trustScore] = await db
        .select()
        .from(trustScores)
        .where(eq(trustScores.userId, userId))
        .limit(1);

      if (!trustScore) {
        // Create initial trust score
        const [newTrustScore] = await db
          .insert(trustScores)
          .values({ userId })
          .returning();

        return res.json({
          success: true,
          data: {
            trustScore: parseFloat(newTrustScore.currentScore),
            level: newTrustScore.trustLevel,
            multiplier: parseFloat(newTrustScore.rewardMultiplier),
            dailySPcap: newTrustScore.dailySoftPointsCap,
            diversityScore: parseFloat(newTrustScore.diversityScore),
            consistencyScore: parseFloat(newTrustScore.consistencyScore),
            totalActivities: newTrustScore.totalActivities,
            isFrozen: newTrustScore.isFrozen,
          },
        });
      }

      res.json({
        success: true,
        data: {
          trustScore: parseFloat(trustScore.currentScore),
          level: trustScore.trustLevel,
          multiplier: parseFloat(trustScore.rewardMultiplier),
          dailySPcap: trustScore.dailySoftPointsCap,
          diversityScore: parseFloat(trustScore.diversityScore),
          consistencyScore: parseFloat(trustScore.consistencyScore),
          totalActivities: trustScore.totalActivities,
          isFrozen: trustScore.isFrozen,
          freezeReason: trustScore.freezeReason,
          scoreHistory: trustScore.scoreHistory || [],
        },
      });
    } catch (error) {
      next(error);
    }
  },
);

// =============================================================================
// HELPER FUNCTIONS
// =============================================================================

async function calculateQualityScore(
  actionType: ActivityType,
  targetId: string | undefined,
  context: any,
): Promise<number> {
  // Placeholder for AI-based quality scoring
  // This would integrate with content analysis, user behavior analysis, etc.

  let baseScore = 1.0;

  // Time-based quality (longer engagement = higher quality)
  if (context?.timeSpent) {
    const timeScore = Math.min(context.timeSpent / 30, 2.0); // Max 2x for 30+ seconds
    baseScore *= timeScore;
  }

  // Engagement depth
  if (context?.clickDepth) {
    const depthScore = 1 + context.clickDepth * 0.1;
    baseScore *= Math.min(depthScore, 1.5);
  }

  // Action-specific quality factors
  switch (actionType) {
    case "post_content":
      // Would analyze content quality, originality, etc.
      baseScore *= 1.2;
      break;
    case "comment_post":
      // Would analyze comment length, sentiment, relevance
      baseScore *= 1.1;
      break;
    case "like_post":
      // Simple action, lower base quality
      baseScore *= 0.8;
      break;
  }

  return Math.max(0.1, Math.min(2.0, baseScore));
}

async function calculateRiskScore(
  userId: string,
  actionType: ActivityType,
  context: any,
  dailyCount: number,
): Promise<number> {
  let riskScore = 0;

  // High frequency risk
  if (dailyCount > 50) {
    riskScore += 40;
  } else if (dailyCount > 20) {
    riskScore += 20;
  }

  // IP/Device pattern analysis
  if (!context?.ip || !context?.deviceId) {
    riskScore += 15;
  }

  // User agent analysis
  if (!context?.userAgent || context.userAgent.includes("bot")) {
    riskScore += 25;
  }

  // Rapid actions (would need session tracking)
  if (context?.timeSpent && context.timeSpent < 2) {
    riskScore += 20;
  }

  return Math.min(100, riskScore);
}

async function updateDailyActivitySummary(
  tx: any,
  userId: string,
  softPoints: number,
  walletBonus: number,
): Promise<void> {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const [summary] = await tx
    .select()
    .from(dailyActivitySummaries)
    .where(
      and(
        eq(dailyActivitySummaries.userId, userId),
        eq(dailyActivitySummaries.date, today),
      ),
    )
    .limit(1);

  if (summary) {
    await tx
      .update(dailyActivitySummaries)
      .set({
        totalActivities: summary.totalActivities + 1,
        totalSoftPointsEarned: sql`total_soft_points_earned + ${softPoints}`,
        totalWalletBonusEarned: sql`total_wallet_bonus_earned + ${walletBonus}`,
        updatedAt: new Date(),
      })
      .where(eq(dailyActivitySummaries.id, summary.id));
  } else {
    await tx.insert(dailyActivitySummaries).values({
      userId,
      date: today,
      totalActivities: 1,
      totalSoftPointsEarned: softPoints.toString(),
      totalWalletBonusEarned: walletBonus.toString(),
    });
  }
}

async function updateTrustScore(
  tx: any,
  userId: string,
  actionType: ActivityType,
  qualityScore: number,
): Promise<number> {
  const [trustScore] = await tx
    .select()
    .from(trustScores)
    .where(eq(trustScores.userId, userId))
    .limit(1);

  if (!trustScore) return 50; // Default score

  // Simple trust score calculation (would be more sophisticated)
  let scoreChange = 0;

  if (qualityScore > 1.5) {
    scoreChange = 0.1;
  } else if (qualityScore > 1.0) {
    scoreChange = 0.05;
  } else if (qualityScore < 0.5) {
    scoreChange = -0.1;
  }

  const newScore = Math.max(
    0,
    Math.min(100, parseFloat(trustScore.currentScore) + scoreChange),
  );

  await tx
    .update(trustScores)
    .set({
      previousScore: trustScore.currentScore,
      currentScore: newScore.toString(),
      totalActivities: trustScore.totalActivities + 1,
      lastCalculatedAt: new Date(),
      updatedAt: new Date(),
    })
    .where(eq(trustScores.userId, userId));

  return newScore;
}

async function updateChallengeProgress(
  tx: any,
  userId: string,
  actionType: ActivityType,
  value?: number,
): Promise<void> {
  // Get active challenges for this action type
  const activeChallenges = await tx
    .select()
    .from(dailyChallenges)
    .where(
      and(
        eq(dailyChallenges.targetAction, actionType),
        eq(dailyChallenges.isActive, true),
        lte(dailyChallenges.startDate, new Date()),
        gte(dailyChallenges.endDate, new Date()),
      ),
    );

  for (const challenge of activeChallenges) {
    // Get or create progress
    let [progress] = await tx
      .select()
      .from(challengeProgress)
      .where(
        and(
          eq(challengeProgress.challengeId, challenge.id),
          eq(challengeProgress.userId, userId),
        ),
      )
      .limit(1);

    if (!progress) {
      [progress] = await tx
        .insert(challengeProgress)
        .values({
          challengeId: challenge.id,
          userId,
        })
        .returning();
    }

    // Update progress
    const newProgress = progress.currentProgress + 1;
    const newValue = value
      ? parseFloat(progress.currentValue) + value
      : parseFloat(progress.currentValue);

    const isCompleted = challenge.targetValue
      ? newValue >= parseFloat(challenge.targetValue)
      : newProgress >= challenge.targetCount;

    await tx
      .update(challengeProgress)
      .set({
        currentProgress: newProgress,
        currentValue: newValue.toString(),
        isCompleted,
        completedAt:
          isCompleted && !progress.isCompleted
            ? new Date()
            : progress.completedAt,
        updatedAt: new Date(),
      })
      .where(eq(challengeProgress.id, progress.id));
  }
}

export default router;
