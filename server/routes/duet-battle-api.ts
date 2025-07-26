import express from "express";
import { z } from "zod";
import { eq, and, desc, sql } from "drizzle-orm";
import { db } from "../db";
import { 
  videoDuets, 
  duetInteractions, 
  liveBattles, 
  battleParticipants, 
  battleGifts, 
  battleStats,
  battleLeaderboards,
  battleInvitations,
} from "../../shared/duet-battle-schema";
import { 
  walletTransactions, 
  softPointsLog, 
  wallets 
} from "../../shared/enhanced-schema";
import { users } from "../../shared/schema";
import { requireAuth } from "../middleware/auth";

const router = express.Router();

// Validation schemas
const createDuetSchema = z.object({
  originalVideoId: z.string().uuid(),
  originalCreatorId: z.string().uuid(),
  duetTitle: z.string().max(200),
  duetDescription: z.string().max(1000).optional(),
  duetType: z.enum(["side_by_side", "split_screen", "reaction", "green_screen"]),
  layoutPosition: z.enum(["left", "right", "top", "bottom"]).default("right"),
  audioMix: z.enum(["original_only", "duet_only", "both", "custom"]).default("both"),
  revenueSharePercentage: z.number().min(0).max(100).default(50),
  isPublic: z.boolean().default(true),
  allowComments: z.boolean().default(true),
  allowRemixes: z.boolean().default(true),
  isMonetized: z.boolean().default(true),
});

const createBattleSchema = z.object({
  creator2Id: z.string().uuid(),
  battleTitle: z.string().max(200),
  battleDescription: z.string().max(1000).optional(),
  battleType: z.enum(["live_duel", "talent_show", "dance_off", "singing_battle"]).default("live_duel"),
  duration: z.number().min(60).max(600), // 1-10 minutes
  entryFee: z.number().min(0).max(1000).default(0),
  scoringMethod: z.enum(["gifts", "votes", "hybrid"]).default("hybrid"),
  allowVoting: z.boolean().default(true),
  allowGifts: z.boolean().default(true),
  scheduledStartTime: z.string().datetime().optional(),
});

const sendGiftSchema = z.object({
  battleId: z.string().uuid(),
  recipientId: z.string().uuid(),
  giftType: z.string(),
  giftName: z.string(),
  softPointsValue: z.number().positive(),
  quantity: z.number().int().positive().default(1),
  message: z.string().max(200).optional(),
});

const tipDuetSchema = z.object({
  duetId: z.string().uuid(),
  amount: z.number().positive(),
  currency: z.enum(["SOFT_POINTS", "USDT", "ETH", "BTC"]).default("SOFT_POINTS"),
  message: z.string().max(200).optional(),
});

// ============================================================================
// DUET ENDPOINTS
// ============================================================================

/**
 * Create a new video duet
 */
router.post("/duet/create", requireAuth, async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ error: "Authentication required" });
    }

    const validatedData = createDuetSchema.parse(req.body);

    // Check if original video exists and allows duets
    const originalVideo = await db.query.posts.findFirst({
      where: eq(posts.id, validatedData.originalVideoId),
    });

    if (!originalVideo || !originalVideo.allowDuets) {
      return res.status(400).json({ error: "Original video not found or duets not allowed" });
    }

    // Create duet record
    const [newDuet] = await db.insert(videoDuets).values({
      originalVideoId: validatedData.originalVideoId,
      originalCreatorId: validatedData.originalCreatorId,
      duetCreatorId: userId,
      duetTitle: validatedData.duetTitle,
      duetDescription: validatedData.duetDescription,
      duetType: validatedData.duetType,
      layoutPosition: validatedData.layoutPosition,
      audioMix: validatedData.audioMix,
      revenueSharePercentage: validatedData.revenueSharePercentage,
      isPublic: validatedData.isPublic,
      allowComments: validatedData.allowComments,
      allowRemixes: validatedData.allowRemixes,
      isMonetized: validatedData.isMonetized,
      processingStatus: "pending",
    }).returning();

    // Award SoftPoints for creating duet
    const duetReward = 10; // Base reward for creating duet
    await db.insert(softPointsLog).values({
      userId,
      type: "earned",
      amount: duetReward,
      balanceAfter: 0, // This would be calculated properly
      sourceType: "duet_creation",
      sourceId: newDuet.id,
      description: "Created a duet video",
    });

    res.json({
      success: true,
      duet: newDuet,
      reward: duetReward,
    });
  } catch (error) {
    console.error("Error creating duet:", error);
    res.status(500).json({ error: "Failed to create duet" });
  }
});

/**
 * Send tip to duet creators
 */
router.post("/duet/tip", requireAuth, async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ error: "Authentication required" });
    }

    const validatedData = tipDuetSchema.parse(req.body);

    // Get duet information
    const duet = await db.query.videoDuets.findFirst({
      where: eq(videoDuets.id, validatedData.duetId),
    });

    if (!duet) {
      return res.status(404).json({ error: "Duet not found" });
    }

    // Check sender's balance
    const senderWallet = await db.query.wallets.findFirst({
      where: eq(wallets.userId, userId),
    });

    if (!senderWallet || parseFloat(senderWallet.softPointsBalance) < validatedData.amount) {
      return res.status(400).json({ error: "Insufficient balance" });
    }

    // Calculate revenue distribution
    const platformFeePercentage = 5;
    const platformFee = validatedData.amount * (platformFeePercentage / 100);
    const netAmount = validatedData.amount - platformFee;
    
    const originalCreatorShare = netAmount * (duet.revenueSharePercentage / 100);
    const duetCreatorShare = netAmount * ((100 - duet.revenueSharePercentage) / 100);

    // Start transaction
    await db.transaction(async (tx) => {
      // Deduct from sender
      await tx.update(wallets)
        .set({
          softPointsBalance: sql`${wallets.softPointsBalance} - ${validatedData.amount}`,
        })
        .where(eq(wallets.userId, userId));

      // Add to original creator
      await tx.update(wallets)
        .set({
          softPointsBalance: sql`${wallets.softPointsBalance} + ${originalCreatorShare}`,
        })
        .where(eq(wallets.userId, duet.originalCreatorId));

      // Add to duet creator
      await tx.update(wallets)
        .set({
          softPointsBalance: sql`${wallets.softPointsBalance} + ${duetCreatorShare}`,
        })
        .where(eq(wallets.userId, duet.duetCreatorId));

      // Log transactions
      await tx.insert(softPointsLog).values([
        {
          userId,
          type: "spent",
          amount: -validatedData.amount,
          balanceAfter: 0,
          sourceType: "duet_tip",
          sourceId: duet.id,
          description: `Tipped duet: ${duet.duetTitle}`,
        },
        {
          userId: duet.originalCreatorId,
          type: "earned",
          amount: originalCreatorShare,
          balanceAfter: 0,
          sourceType: "duet_tip",
          sourceId: duet.id,
          description: "Received tip from duet",
        },
        {
          userId: duet.duetCreatorId,
          type: "earned",
          amount: duetCreatorShare,
          balanceAfter: 0,
          sourceType: "duet_tip",
          sourceId: duet.id,
          description: "Received tip from duet",
        },
      ]);

      // Create interaction record
      await tx.insert(duetInteractions).values({
        duetId: duet.id,
        userId,
        interactionType: "tip",
        tipAmount: validatedData.amount,
        tipCurrency: validatedData.currency,
        tipMessage: validatedData.message,
      });

      // Update duet statistics
      await tx.update(videoDuets)
        .set({
          totalTipsReceived: sql`${videoDuets.totalTipsReceived} + ${validatedData.amount}`,
          tipCount: sql`${videoDuets.tipCount} + 1`,
          originalCreatorEarnings: sql`${videoDuets.originalCreatorEarnings} + ${originalCreatorShare}`,
          duetCreatorEarnings: sql`${videoDuets.duetCreatorEarnings} + ${duetCreatorShare}`,
        })
        .where(eq(videoDuets.id, duet.id));
    });

    res.json({
      success: true,
      transactionId: `tip_${Date.now()}`,
      originalCreatorShare,
      duetCreatorShare,
      platformFee,
    });
  } catch (error) {
    console.error("Error processing duet tip:", error);
    res.status(500).json({ error: "Failed to process tip" });
  }
});

/**
 * Get duet details
 */
router.get("/duet/:id", async (req, res) => {
  try {
    const duetId = req.params.id;

    const duet = await db.query.videoDuets.findFirst({
      where: eq(videoDuets.id, duetId),
      with: {
        originalCreator: {
          columns: { id: true, username: true, displayName: true, avatar: true },
        },
        duetCreator: {
          columns: { id: true, username: true, displayName: true, avatar: true },
        },
      },
    });

    if (!duet) {
      return res.status(404).json({ error: "Duet not found" });
    }

    res.json({ duet });
  } catch (error) {
    console.error("Error fetching duet:", error);
    res.status(500).json({ error: "Failed to fetch duet" });
  }
});

// ============================================================================
// BATTLE ENDPOINTS
// ============================================================================

/**
 * Create battle invitation
 */
router.post("/battle/invite", requireAuth, async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ error: "Authentication required" });
    }

    const validatedData = createBattleSchema.parse(req.body);

    // Check if entry fee can be paid
    if (validatedData.entryFee > 0) {
      const wallet = await db.query.wallets.findFirst({
        where: eq(wallets.userId, userId),
      });

      if (!wallet || parseFloat(wallet.softPointsBalance) < validatedData.entryFee) {
        return res.status(400).json({ error: "Insufficient balance for entry fee" });
      }
    }

    // Create battle invitation
    const [invitation] = await db.insert(battleInvitations).values({
      inviterId: userId,
      inviteeId: validatedData.creator2Id,
      battleType: validatedData.battleType,
      proposedDuration: validatedData.duration,
      entryFee: validatedData.entryFee,
      prizeAmount: validatedData.entryFee * 20, // 20x entry fee as prize
      proposedTime: validatedData.scheduledStartTime ? new Date(validatedData.scheduledStartTime) : null,
      expiresAt: new Date(Date.now() + 10 * 60 * 1000), // 10 minutes to respond
    }).returning();

    res.json({
      success: true,
      invitation,
    });
  } catch (error) {
    console.error("Error creating battle invitation:", error);
    res.status(500).json({ error: "Failed to create battle invitation" });
  }
});

/**
 * Accept battle invitation and start battle
 */
router.post("/battle/accept/:invitationId", requireAuth, async (req, res) => {
  try {
    const userId = req.user?.id;
    const invitationId = req.params.invitationId;

    if (!userId) {
      return res.status(401).json({ error: "Authentication required" });
    }

    // Get invitation
    const invitation = await db.query.battleInvitations.findFirst({
      where: and(
        eq(battleInvitations.id, invitationId),
        eq(battleInvitations.inviteeId, userId),
        eq(battleInvitations.status, "pending")
      ),
    });

    if (!invitation) {
      return res.status(404).json({ error: "Invitation not found or already processed" });
    }

    // Check if invitation is expired
    if (invitation.expiresAt && invitation.expiresAt < new Date()) {
      return res.status(400).json({ error: "Invitation has expired" });
    }

    // Check entry fee
    if (invitation.entryFee > 0) {
      const wallet = await db.query.wallets.findFirst({
        where: eq(wallets.userId, userId),
      });

      if (!wallet || parseFloat(wallet.softPointsBalance) < invitation.entryFee) {
        return res.status(400).json({ error: "Insufficient balance for entry fee" });
      }
    }

    // Start transaction to create battle
    const [battle] = await db.transaction(async (tx) => {
      // Update invitation status
      await tx.update(battleInvitations)
        .set({
          status: "accepted",
          respondedAt: new Date(),
        })
        .where(eq(battleInvitations.id, invitationId));

      // Deduct entry fees
      if (invitation.entryFee > 0) {
        await tx.update(wallets)
          .set({
            softPointsBalance: sql`${wallets.softPointsBalance} - ${invitation.entryFee}`,
          })
          .where(eq(wallets.userId, invitation.inviterId));

        await tx.update(wallets)
          .set({
            softPointsBalance: sql`${wallets.softPointsBalance} - ${invitation.entryFee}`,
          })
          .where(eq(wallets.userId, userId));
      }

      // Create battle
      const [newBattle] = await tx.insert(liveBattles).values({
        creator1Id: invitation.inviterId,
        creator2Id: userId,
        battleTitle: `Battle: Creator vs Creator`,
        battleType: invitation.battleType,
        duration: invitation.proposedDuration,
        entryFee: invitation.entryFee,
        prizePot: invitation.prizeAmount,
        roomId: `battle_${Date.now()}`,
        status: "waiting",
        scoringMethod: "hybrid",
        allowVoting: true,
        allowGifts: true,
      }).returning();

      return newBattle;
    });

    res.json({
      success: true,
      battle,
    });
  } catch (error) {
    console.error("Error accepting battle:", error);
    res.status(500).json({ error: "Failed to accept battle" });
  }
});

/**
 * Send gift during battle
 */
router.post("/battle/gift", requireAuth, async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ error: "Authentication required" });
    }

    const validatedData = sendGiftSchema.parse(req.body);
    const totalValue = validatedData.softPointsValue * validatedData.quantity;

    // Check battle status
    const battle = await db.query.liveBattles.findFirst({
      where: eq(liveBattles.id, validatedData.battleId),
    });

    if (!battle || battle.status !== "live") {
      return res.status(400).json({ error: "Battle is not active" });
    }

    // Check sender's balance
    const senderWallet = await db.query.wallets.findFirst({
      where: eq(wallets.userId, userId),
    });

    if (!senderWallet || parseFloat(senderWallet.softPointsBalance) < totalValue) {
      return res.status(400).json({ error: "Insufficient balance" });
    }

    // Calculate combo multiplier (simplified)
    const comboMultiplier = 1.0; // This would be calculated based on recent gifts
    const finalValue = totalValue * comboMultiplier;
    const platformFee = finalValue * 0.05; // 5% platform fee
    const netAmount = finalValue - platformFee;

    // Process transaction
    await db.transaction(async (tx) => {
      // Deduct from sender
      await tx.update(wallets)
        .set({
          softPointsBalance: sql`${wallets.softPointsBalance} - ${totalValue}`,
        })
        .where(eq(wallets.userId, userId));

      // Add to recipient
      await tx.update(wallets)
        .set({
          softPointsBalance: sql`${wallets.softPointsBalance} + ${netAmount}`,
        })
        .where(eq(wallets.userId, validatedData.recipientId));

      // Create gift record
      await tx.insert(battleGifts).values({
        battleId: validatedData.battleId,
        giftType: validatedData.giftType,
        giftName: validatedData.giftName,
        senderId: userId,
        recipientId: validatedData.recipientId,
        softPointsValue: validatedData.softPointsValue,
        quantity: validatedData.quantity,
        comboMultiplier,
        finalValue,
        message: validatedData.message,
        timeFromBattleStart: Date.now() - (battle.actualStartTime?.getTime() || Date.now()),
      });

      // Update battle scores
      if (validatedData.recipientId === battle.creator1Id) {
        await tx.update(liveBattles)
          .set({
            creator1Score: sql`${liveBattles.creator1Score} + ${netAmount}`,
            creator1Gifts: sql`${liveBattles.creator1Gifts} + ${netAmount}`,
          })
          .where(eq(liveBattles.id, validatedData.battleId));
      } else {
        await tx.update(liveBattles)
          .set({
            creator2Score: sql`${liveBattles.creator2Score} + ${netAmount}`,
            creator2Gifts: sql`${liveBattles.creator2Gifts} + ${netAmount}`,
          })
          .where(eq(liveBattles.id, validatedData.battleId));
      }

      // Log SoftPoints transactions
      await tx.insert(softPointsLog).values([
        {
          userId,
          type: "spent",
          amount: -totalValue,
          balanceAfter: 0,
          sourceType: "battle_gift",
          sourceId: validatedData.battleId,
          description: `Sent ${validatedData.giftName} in battle`,
        },
        {
          userId: validatedData.recipientId,
          type: "earned",
          amount: netAmount,
          balanceAfter: 0,
          sourceType: "battle_gift",
          sourceId: validatedData.battleId,
          description: `Received ${validatedData.giftName} in battle`,
        },
      ]);
    });

    res.json({
      success: true,
      transactionId: `gift_${Date.now()}`,
      comboMultiplier,
      finalValue,
      netAmount,
    });
  } catch (error) {
    console.error("Error sending battle gift:", error);
    res.status(500).json({ error: "Failed to send gift" });
  }
});

/**
 * End battle and distribute prizes
 */
router.post("/battle/end/:battleId", requireAuth, async (req, res) => {
  try {
    const userId = req.user?.id;
    const battleId = req.params.battleId;

    if (!userId) {
      return res.status(401).json({ error: "Authentication required" });
    }

    // Get battle
    const battle = await db.query.liveBattles.findFirst({
      where: eq(liveBattles.id, battleId),
    });

    if (!battle) {
      return res.status(404).json({ error: "Battle not found" });
    }

    // Check if user is a participant
    if (battle.creator1Id !== userId && battle.creator2Id !== userId) {
      return res.status(403).json({ error: "Not authorized to end this battle" });
    }

    // Determine winner
    const winnerId = parseFloat(battle.creator1Score) > parseFloat(battle.creator2Score) ? 
      battle.creator1Id : battle.creator2Id;
    const runnerUpId = winnerId === battle.creator1Id ? battle.creator2Id : battle.creator1Id;

    // Calculate prizes
    const winnerPrize = parseFloat(battle.prizePot) * 0.6; // 60% to winner
    const runnerUpPrize = parseFloat(battle.prizePot) * 0.3; // 30% to runner-up
    const participationPool = parseFloat(battle.prizePot) * 0.1; // 10% for active viewers

    // Distribute prizes
    await db.transaction(async (tx) => {
      // Award prizes to creators
      await tx.update(wallets)
        .set({
          softPointsBalance: sql`${wallets.softPointsBalance} + ${winnerPrize}`,
        })
        .where(eq(wallets.userId, winnerId));

      await tx.update(wallets)
        .set({
          softPointsBalance: sql`${wallets.softPointsBalance} + ${runnerUpPrize}`,
        })
        .where(eq(wallets.userId, runnerUpId));

      // Log prize transactions
      await tx.insert(softPointsLog).values([
        {
          userId: winnerId,
          type: "earned",
          amount: winnerPrize,
          balanceAfter: 0,
          sourceType: "battle_prize",
          sourceId: battleId,
          description: "Won battle prize",
        },
        {
          userId: runnerUpId,
          type: "earned",
          amount: runnerUpPrize,
          balanceAfter: 0,
          sourceType: "battle_prize",
          sourceId: battleId,
          description: "Runner-up battle prize",
        },
      ]);

      // Update battle status
      await tx.update(liveBattles)
        .set({
          status: "ended",
          winnerId,
          winnerScore: Math.max(parseFloat(battle.creator1Score), parseFloat(battle.creator2Score)),
          marginOfVictory: Math.abs(parseFloat(battle.creator1Score) - parseFloat(battle.creator2Score)),
          actualEndTime: new Date(),
          winnerPrize,
          runnerUpPrize,
          creator1Earnings: winnerId === battle.creator1Id ? winnerPrize : runnerUpPrize,
          creator2Earnings: winnerId === battle.creator2Id ? winnerPrize : runnerUpPrize,
        })
        .where(eq(liveBattles.id, battleId));
    });

    res.json({
      success: true,
      winnerId,
      winnerPrize,
      runnerUpPrize,
      participationPool,
    });
  } catch (error) {
    console.error("Error ending battle:", error);
    res.status(500).json({ error: "Failed to end battle" });
  }
});

/**
 * Get battle leaderboard
 */
router.get("/battle/leaderboard/:type/:period", async (req, res) => {
  try {
    const { type, period } = req.params;

    const leaderboard = await db.query.battleLeaderboards.findMany({
      where: and(
        eq(battleLeaderboards.leaderboardType, type),
        eq(battleLeaderboards.period, period)
      ),
      orderBy: [desc(battleLeaderboards.rank)],
      limit: 50,
      with: {
        user: {
          columns: { id: true, username: true, displayName: true, avatar: true },
        },
      },
    });

    res.json({ leaderboard });
  } catch (error) {
    console.error("Error fetching leaderboard:", error);
    res.status(500).json({ error: "Failed to fetch leaderboard" });
  }
});

/**
 * Get user's battle statistics
 */
router.get("/battle/stats/:userId", async (req, res) => {
  try {
    const userId = req.params.userId;

    // Get user's battle statistics
    const stats = await db.select({
      totalBattles: sql<number>`count(*)`,
      totalWins: sql<number>`count(*) filter (where winner_id = ${userId})`,
      totalEarnings: sql<number>`sum(case when creator1_id = ${userId} then creator1_earnings when creator2_id = ${userId} then creator2_earnings else 0 end)`,
      averageScore: sql<number>`avg(case when creator1_id = ${userId} then creator1_score when creator2_id = ${userId} then creator2_score else 0 end)`,
    })
    .from(liveBattles)
    .where(
      and(
        sql`(creator1_id = ${userId} or creator2_id = ${userId})`,
        eq(liveBattles.status, "ended")
      )
    );

    const userStats = stats[0];
    const winRate = userStats.totalBattles > 0 ? 
      (userStats.totalWins / userStats.totalBattles) * 100 : 0;

    res.json({
      ...userStats,
      winRate: Math.round(winRate * 100) / 100,
    });
  } catch (error) {
    console.error("Error fetching battle stats:", error);
    res.status(500).json({ error: "Failed to fetch battle stats" });
  }
});

export default router;
