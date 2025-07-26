// Duet and Battle Monetization Service
// Handles SoftPoints transactions, revenue sharing, and reward distribution

import { z } from "zod";

// Types
export interface DuetTipTransaction {
  duetId: string;
  tipperId: string;
  amount: number;
  currency: "SOFT_POINTS" | "USDT" | "ETH" | "BTC";
  message?: string;
  originalCreatorShare: number; // Calculated based on revenue share percentage
  duetCreatorShare: number;
}

export interface BattleGiftTransaction {
  battleId: string;
  giftId: string;
  senderId: string;
  recipientId: string;
  quantity: number;
  softPointsValue: number;
  totalValue: number;
  comboMultiplier?: number;
  hasSpecialEffect: boolean;
}

export interface BattlePrizeDistribution {
  battleId: string;
  winnerId: string;
  runnerUpId: string;
  winnerPrize: number;
  runnerUpPrize: number;
  participationRewards: Record<string, number>; // userId -> reward amount
  platformFee: number;
}

export interface RevenueShareConfig {
  originalCreatorPercentage: number; // 0-100
  duetCreatorPercentage: number; // 0-100
  platformFeePercentage: number; // Usually 5-10%
}

export interface BattleRewardConfig {
  entryFee: number;
  prizePotDistribution: {
    winnerPercentage: number; // e.g., 60%
    runnerUpPercentage: number; // e.g., 30%
    participationPercentage: number; // e.g., 10%
  };
  bonusRewards: {
    viewerEngagement: number; // Bonus for high engagement
    giftReceived: number; // Bonus for receiving gifts
    votesReceived: number; // Bonus per vote received
  };
}

// Validation schemas
const duetTipSchema = z.object({
  duetId: z.string().uuid(),
  tipperId: z.string().uuid(),
  amount: z.number().positive(),
  currency: z.enum(["SOFT_POINTS", "USDT", "ETH", "BTC"]),
  message: z.string().optional(),
});

const battleGiftSchema = z.object({
  battleId: z.string().uuid(),
  giftId: z.string(),
  senderId: z.string().uuid(),
  recipientId: z.string().uuid(),
  quantity: z.number().int().positive(),
  softPointsValue: z.number().positive(),
});

class DuetBattleMonetizationService {
  private readonly platformFeePercentage = 5; // 5% platform fee
  private readonly apiBaseUrl = "/api/monetization";

  // =========================================================================
  // DUET MONETIZATION
  // =========================================================================

  /**
   * Process a tip transaction for a duet video
   */
  async processDuetTip(tipData: DuetTipTransaction): Promise<{
    success: boolean;
    transactionId?: string;
    error?: string;
  }> {
    try {
      // Validate input
      const validatedData = duetTipSchema.parse({
        duetId: tipData.duetId,
        tipperId: tipData.tipperId,
        amount: tipData.amount,
        currency: tipData.currency,
        message: tipData.message,
      });

      // Get duet information and revenue sharing config
      const duetInfo = await this.getDuetInfo(tipData.duetId);
      if (!duetInfo) {
        return { success: false, error: "Duet not found" };
      }

      // Calculate revenue distribution
      const platformFee = tipData.amount * (this.platformFeePercentage / 100);
      const netAmount = tipData.amount - platformFee;
      
      const originalCreatorShare = netAmount * (duetInfo.revenueSharePercentage / 100);
      const duetCreatorShare = netAmount * ((100 - duetInfo.revenueSharePercentage) / 100);

      // Create transaction records
      const transactionData = {
        type: "duet_tip",
        duetId: tipData.duetId,
        tipperId: tipData.tipperId,
        amount: tipData.amount,
        currency: tipData.currency,
        platformFee,
        originalCreatorId: duetInfo.originalCreatorId,
        originalCreatorShare,
        duetCreatorId: duetInfo.duetCreatorId,
        duetCreatorShare,
        message: tipData.message,
        timestamp: new Date().toISOString(),
      };

      // Process the transaction
      const response = await this.makeApiCall("/duet/tip", "POST", transactionData);
      
      if (response.success) {
        // Update user balances
        await this.updateUserBalance(duetInfo.originalCreatorId, originalCreatorShare, "SOFT_POINTS");
        await this.updateUserBalance(duetInfo.duetCreatorId, duetCreatorShare, "SOFT_POINTS");
        await this.deductUserBalance(tipData.tipperId, tipData.amount, tipData.currency);

        // Log SoftPoints transactions
        await this.logSoftPointsTransaction(duetInfo.originalCreatorId, originalCreatorShare, "earned", "duet_tip");
        await this.logSoftPointsTransaction(duetInfo.duetCreatorId, duetCreatorShare, "earned", "duet_tip");
        await this.logSoftPointsTransaction(tipData.tipperId, -tipData.amount, "spent", "duet_tip");

        // Update duet statistics
        await this.updateDuetStats(tipData.duetId, {
          totalTipsReceived: tipData.amount,
          tipCount: 1,
          originalCreatorEarnings: originalCreatorShare,
          duetCreatorEarnings: duetCreatorShare,
        });

        return { 
          success: true, 
          transactionId: response.transactionId 
        };
      } else {
        return { success: false, error: response.error };
      }
    } catch (error) {
      console.error("Error processing duet tip:", error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : "Unknown error" 
      };
    }
  }

  /**
   * Calculate duet creator rewards based on engagement
   */
  async calculateDuetRewards(duetId: string): Promise<{
    originalCreatorReward: number;
    duetCreatorReward: number;
    breakdown: Record<string, number>;
  }> {
    const duetStats = await this.getDuetStats(duetId);
    const duetInfo = await this.getDuetInfo(duetId);
    
    if (!duetStats || !duetInfo) {
      return {
        originalCreatorReward: 0,
        duetCreatorReward: 0,
        breakdown: {},
      };
    }

    // Calculate rewards based on engagement metrics
    const baseReward = 10; // Base SoftPoints for creating/participating in duet
    const viewReward = Math.floor(duetStats.viewCount / 100) * 2; // 2 SP per 100 views
    const likeReward = duetStats.likeCount * 0.5; // 0.5 SP per like
    const shareReward = duetStats.shareCount * 2; // 2 SP per share
    const commentReward = duetStats.commentCount * 1; // 1 SP per comment

    const totalEngagementReward = baseReward + viewReward + likeReward + shareReward + commentReward;

    // Split based on revenue share percentage
    const originalCreatorReward = totalEngagementReward * (duetInfo.revenueSharePercentage / 100);
    const duetCreatorReward = totalEngagementReward * ((100 - duetInfo.revenueSharePercentage) / 100);

    return {
      originalCreatorReward,
      duetCreatorReward,
      breakdown: {
        base: baseReward,
        views: viewReward,
        likes: likeReward,
        shares: shareReward,
        comments: commentReward,
      },
    };
  }

  // =========================================================================
  // BATTLE MONETIZATION
  // =========================================================================

  /**
   * Process a gift transaction during a live battle
   */
  async processBattleGift(giftData: BattleGiftTransaction): Promise<{
    success: boolean;
    transactionId?: string;
    comboMultiplier?: number;
    error?: string;
  }> {
    try {
      // Validate input
      const validatedData = battleGiftSchema.parse({
        battleId: giftData.battleId,
        giftId: giftData.giftId,
        senderId: giftData.senderId,
        recipientId: giftData.recipientId,
        quantity: giftData.quantity,
        softPointsValue: giftData.softPointsValue,
      });

      // Check if battle is active
      const battleInfo = await this.getBattleInfo(giftData.battleId);
      if (!battleInfo || battleInfo.status !== "live") {
        return { success: false, error: "Battle is not active" };
      }

      // Check sender's balance
      const senderBalance = await this.getUserBalance(giftData.senderId, "SOFT_POINTS");
      if (senderBalance < giftData.totalValue) {
        return { success: false, error: "Insufficient balance" };
      }

      // Calculate combo multiplier
      const comboMultiplier = await this.calculateComboMultiplier(
        giftData.battleId,
        giftData.senderId,
        giftData.giftId
      );

      const finalValue = giftData.totalValue * comboMultiplier;
      const platformFee = finalValue * (this.platformFeePercentage / 100);
      const netAmount = finalValue - platformFee;

      // Create transaction record
      const transactionData = {
        type: "battle_gift",
        battleId: giftData.battleId,
        giftId: giftData.giftId,
        senderId: giftData.senderId,
        recipientId: giftData.recipientId,
        quantity: giftData.quantity,
        baseValue: giftData.totalValue,
        comboMultiplier,
        finalValue,
        platformFee,
        netAmount,
        hasSpecialEffect: giftData.hasSpecialEffect,
        timestamp: new Date().toISOString(),
      };

      // Process the transaction
      const response = await this.makeApiCall("/battle/gift", "POST", transactionData);
      
      if (response.success) {
        // Update balances
        await this.deductUserBalance(giftData.senderId, giftData.totalValue, "SOFT_POINTS");
        await this.updateUserBalance(giftData.recipientId, netAmount, "SOFT_POINTS");

        // Log SoftPoints transactions
        await this.logSoftPointsTransaction(giftData.senderId, -giftData.totalValue, "spent", "battle_gift");
        await this.logSoftPointsTransaction(giftData.recipientId, netAmount, "earned", "battle_gift");

        // Update battle scores in real-time
        await this.updateBattleScore(giftData.battleId, giftData.recipientId, netAmount);

        // Track combo for future calculations
        await this.trackGiftCombo(giftData.battleId, giftData.senderId, giftData.giftId);

        return { 
          success: true, 
          transactionId: response.transactionId,
          comboMultiplier 
        };
      } else {
        return { success: false, error: response.error };
      }
    } catch (error) {
      console.error("Error processing battle gift:", error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : "Unknown error" 
      };
    }
  }

  /**
   * Process battle end and distribute prizes
   */
  async processBattleEnd(battleId: string): Promise<{
    success: boolean;
    prizeDistribution?: BattlePrizeDistribution;
    error?: string;
  }> {
    try {
      const battleInfo = await this.getBattleInfo(battleId);
      if (!battleInfo) {
        return { success: false, error: "Battle not found" };
      }

      // Determine winner and calculate prizes
      const winnerId = battleInfo.creator1Score > battleInfo.creator2Score ? 
        battleInfo.creator1Id : battleInfo.creator2Id;
      const runnerUpId = winnerId === battleInfo.creator1Id ? 
        battleInfo.creator2Id : battleInfo.creator1Id;

      const rewardConfig: BattleRewardConfig = {
        entryFee: battleInfo.entryFee,
        prizePotDistribution: {
          winnerPercentage: 60,
          runnerUpPercentage: 30,
          participationPercentage: 10,
        },
        bonusRewards: {
          viewerEngagement: 50, // Bonus for high viewer engagement
          giftReceived: 0.1, // 10% bonus on gifts received
          votesReceived: 5, // 5 SP per vote received
        },
      };

      // Calculate base prizes
      const winnerPrize = battleInfo.prizePot * (rewardConfig.prizePotDistribution.winnerPercentage / 100);
      const runnerUpPrize = battleInfo.prizePot * (rewardConfig.prizePotDistribution.runnerUpPercentage / 100);
      const participationPool = battleInfo.prizePot * (rewardConfig.prizePotDistribution.participationPercentage / 100);

      // Calculate bonus rewards
      const winnerBonuses = await this.calculateBattleBonuses(battleId, winnerId, rewardConfig);
      const runnerUpBonuses = await this.calculateBattleBonuses(battleId, runnerUpId, rewardConfig);

      const finalWinnerPrize = winnerPrize + winnerBonuses;
      const finalRunnerUpPrize = runnerUpPrize + runnerUpBonuses;

      // Calculate participation rewards for viewers
      const participationRewards = await this.calculateParticipationRewards(battleId, participationPool);

      // Distribute prizes
      await this.updateUserBalance(winnerId, finalWinnerPrize, "SOFT_POINTS");
      await this.updateUserBalance(runnerUpId, finalRunnerUpPrize, "SOFT_POINTS");

      // Log transactions
      await this.logSoftPointsTransaction(winnerId, finalWinnerPrize, "earned", "battle_prize");
      await this.logSoftPointsTransaction(runnerUpId, finalRunnerUpPrize, "earned", "battle_prize");

      // Distribute participation rewards
      for (const [userId, reward] of Object.entries(participationRewards)) {
        await this.updateUserBalance(userId, reward, "SOFT_POINTS");
        await this.logSoftPointsTransaction(userId, reward, "earned", "battle_participation");
      }

      // Update battle leaderboards
      await this.updateBattleLeaderboards(battleId, winnerId, runnerUpId);

      const prizeDistribution: BattlePrizeDistribution = {
        battleId,
        winnerId,
        runnerUpId,
        winnerPrize: finalWinnerPrize,
        runnerUpPrize: finalRunnerUpPrize,
        participationRewards,
        platformFee: battleInfo.prizePot * (this.platformFeePercentage / 100),
      };

      // Update battle record with final results
      await this.updateBattleResults(battleId, prizeDistribution);

      return { success: true, prizeDistribution };
    } catch (error) {
      console.error("Error processing battle end:", error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : "Unknown error" 
      };
    }
  }

  /**
   * Calculate combo multiplier for consecutive gifts
   */
  private async calculateComboMultiplier(
    battleId: string, 
    senderId: string, 
    giftId: string
  ): Promise<number> {
    try {
      // Get recent gift history for this sender
      const recentGifts = await this.getRecentGifts(battleId, senderId, 60000); // Last 60 seconds
      
      // Count consecutive gifts of the same type
      let consecutiveCount = 0;
      for (let i = recentGifts.length - 1; i >= 0; i--) {
        if (recentGifts[i].giftId === giftId) {
          consecutiveCount++;
        } else {
          break;
        }
      }

      // Calculate multiplier based on consecutive count
      if (consecutiveCount >= 10) return 3.0; // 10+ consecutive: 3x multiplier
      if (consecutiveCount >= 5) return 2.0;  // 5+ consecutive: 2x multiplier
      if (consecutiveCount >= 3) return 1.5;  // 3+ consecutive: 1.5x multiplier
      
      return 1.0; // No multiplier
    } catch (error) {
      console.error("Error calculating combo multiplier:", error);
      return 1.0;
    }
  }

  /**
   * Calculate bonus rewards for battle participants
   */
  private async calculateBattleBonuses(
    battleId: string, 
    userId: string, 
    config: BattleRewardConfig
  ): Promise<number> {
    try {
      const battleStats = await this.getBattleParticipantStats(battleId, userId);
      if (!battleStats) return 0;

      let totalBonus = 0;

      // Engagement bonus (based on viewer interaction)
      if (battleStats.engagementScore > 80) {
        totalBonus += config.bonusRewards.viewerEngagement;
      }

      // Gift bonus (percentage of gifts received)
      totalBonus += battleStats.giftsReceived * config.bonusRewards.giftReceived;

      // Vote bonus
      totalBonus += battleStats.votesReceived * config.bonusRewards.votesReceived;

      return Math.floor(totalBonus);
    } catch (error) {
      console.error("Error calculating battle bonuses:", error);
      return 0;
    }
  }

  /**
   * Calculate participation rewards for active viewers
   */
  private async calculateParticipationRewards(
    battleId: string, 
    totalPool: number
  ): Promise<Record<string, number>> {
    try {
      const participants = await this.getBattleParticipants(battleId);
      
      // Filter to active participants (sent messages, gifts, or votes)
      const activeParticipants = participants.filter(p => 
        p.messagesCount > 0 || p.giftsGiven > 0 || p.votesGiven > 0
      );

      if (activeParticipants.length === 0) return {};

      // Simple equal distribution for now
      // Could be enhanced to weight by engagement level
      const rewardPerParticipant = Math.floor(totalPool / activeParticipants.length);
      
      const rewards: Record<string, number> = {};
      for (const participant of activeParticipants) {
        rewards[participant.userId] = rewardPerParticipant;
      }

      return rewards;
    } catch (error) {
      console.error("Error calculating participation rewards:", error);
      return {};
    }
  }

  // =========================================================================
  // UTILITY METHODS
  // =========================================================================

  private async makeApiCall(endpoint: string, method: string, data?: any): Promise<any> {
    try {
      const response = await fetch(`${this.apiBaseUrl}${endpoint}`, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: data ? JSON.stringify(data) : undefined,
      });

      if (!response.ok) {
        throw new Error(`API call failed: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error("API call error:", error);
      throw error;
    }
  }

  private async getDuetInfo(duetId: string): Promise<any> {
    // Mock implementation - replace with actual API call
    return {
      id: duetId,
      originalCreatorId: "creator1",
      duetCreatorId: "creator2",
      revenueSharePercentage: 50,
      isMonetized: true,
    };
  }

  private async getDuetStats(duetId: string): Promise<any> {
    // Mock implementation - replace with actual API call
    return {
      viewCount: 1000,
      likeCount: 150,
      shareCount: 25,
      commentCount: 50,
    };
  }

  private async getBattleInfo(battleId: string): Promise<any> {
    // Mock implementation - replace with actual API call
    return {
      id: battleId,
      status: "live",
      creator1Id: "creator1",
      creator2Id: "creator2",
      creator1Score: 500,
      creator2Score: 450,
      prizePot: 1000,
      entryFee: 10,
    };
  }

  private async updateUserBalance(userId: string, amount: number, currency: string): Promise<void> {
    // Mock implementation - replace with actual API call
    console.log(`Updating ${userId} balance: +${amount} ${currency}`);
  }

  private async deductUserBalance(userId: string, amount: number, currency: string): Promise<void> {
    // Mock implementation - replace with actual API call
    console.log(`Deducting from ${userId} balance: -${amount} ${currency}`);
  }

  private async getUserBalance(userId: string, currency: string): Promise<number> {
    // Mock implementation - replace with actual API call
    return 1000; // Return mock balance
  }

  private async logSoftPointsTransaction(
    userId: string, 
    amount: number, 
    type: string, 
    source: string
  ): Promise<void> {
    // Mock implementation - replace with actual API call
    console.log(`SoftPoints log: ${userId} ${type} ${amount} from ${source}`);
  }

  private async updateDuetStats(duetId: string, stats: any): Promise<void> {
    // Mock implementation - replace with actual API call
    console.log(`Updating duet ${duetId} stats:`, stats);
  }

  private async updateBattleScore(battleId: string, userId: string, points: number): Promise<void> {
    // Mock implementation - replace with actual API call
    console.log(`Updating battle ${battleId} score for ${userId}: +${points}`);
  }

  private async trackGiftCombo(battleId: string, senderId: string, giftId: string): Promise<void> {
    // Mock implementation - replace with actual API call
    console.log(`Tracking combo: ${battleId} ${senderId} ${giftId}`);
  }

  private async getRecentGifts(battleId: string, senderId: string, timeWindow: number): Promise<any[]> {
    // Mock implementation - replace with actual API call
    return [];
  }

  private async getBattleParticipantStats(battleId: string, userId: string): Promise<any> {
    // Mock implementation - replace with actual API call
    return {
      engagementScore: 85,
      giftsReceived: 50,
      votesReceived: 10,
    };
  }

  private async getBattleParticipants(battleId: string): Promise<any[]> {
    // Mock implementation - replace with actual API call
    return [];
  }

  private async updateBattleLeaderboards(battleId: string, winnerId: string, runnerUpId: string): Promise<void> {
    // Mock implementation - replace with actual API call
    console.log(`Updating leaderboards for battle ${battleId}`);
  }

  private async updateBattleResults(battleId: string, prizeDistribution: BattlePrizeDistribution): Promise<void> {
    // Mock implementation - replace with actual API call
    console.log(`Updating battle ${battleId} results:`, prizeDistribution);
  }
}

// Export singleton instance
export const duetBattleMonetizationService = new DuetBattleMonetizationService();

// Export utility functions
export const formatCurrency = (amount: number, currency: string = "SP"): string => {
  if (amount >= 1000000) {
    return `${(amount / 1000000).toFixed(1)}M ${currency}`;
  } else if (amount >= 1000) {
    return `${(amount / 1000).toFixed(1)}K ${currency}`;
  }
  return `${amount.toLocaleString()} ${currency}`;
};

export const calculateRevenueShare = (
  totalAmount: number, 
  originalCreatorPercentage: number
): { originalCreatorShare: number; duetCreatorShare: number; platformFee: number } => {
  const platformFeePercentage = 5; // 5% platform fee
  const platformFee = totalAmount * (platformFeePercentage / 100);
  const netAmount = totalAmount - platformFee;
  
  const originalCreatorShare = netAmount * (originalCreatorPercentage / 100);
  const duetCreatorShare = netAmount * ((100 - originalCreatorPercentage) / 100);
  
  return {
    originalCreatorShare,
    duetCreatorShare,
    platformFee,
  };
};
