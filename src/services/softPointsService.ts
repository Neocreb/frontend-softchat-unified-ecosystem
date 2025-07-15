import { api } from "@/lib/api";

export interface SoftPointsEarning {
  source: "views" | "tips" | "subscriptions" | "sales" | "referral" | "bonus";
  amount: number;
  description: string;
  metadata?: Record<string, any>;
}

export interface SoftPointsTransaction {
  id: string;
  userId: string;
  transactionType: "earned" | "spent" | "bonus" | "penalty" | "transfer";
  amount: number;
  sourceType: string;
  sourceId?: string;
  contentId?: string;
  balanceBefore: number;
  balanceAfter: number;
  description: string;
  metadata?: Record<string, any>;
  createdAt: string;
}

export interface SoftPointsBalance {
  balance: number;
  lastTransaction?: string;
  weeklyEarnings: number;
}

export class SoftPointsService {
  // SoftPoints Earning Rules (as specified)
  private static readonly EARNING_RULES = {
    VIEWS_PER_SOFTPOINT: 1000, // 1,000 Views = 5 SoftPoints
    VIEWS_SOFTPOINTS: 5,
    TIP_SOFTPOINTS: 1, // 1 Tip = 1 SoftPoint
    SUBSCRIPTION_SOFTPOINTS: 10, // 1 Subscription = 10 SoftPoints
    SALES_SOFTPOINTS_RATE: 10, // ₦1,000 Sale = 10 SoftPoints (10 SP per 1000 units)
    REFERRAL_BONUS: 50, // 50 SoftPoints for successful referral
    DAILY_LOGIN_BONUS: 5, // 5 SoftPoints for daily login
  };

  // Calculate SoftPoints for views
  static calculateViewsSoftPoints(views: number): number {
    return (
      Math.floor(views / this.EARNING_RULES.VIEWS_PER_SOFTPOINT) *
      this.EARNING_RULES.VIEWS_SOFTPOINTS
    );
  }

  // Calculate SoftPoints for tips
  static calculateTipsSoftPoints(tipCount: number): number {
    return tipCount * this.EARNING_RULES.TIP_SOFTPOINTS;
  }

  // Calculate SoftPoints for subscriptions
  static calculateSubscriptionSoftPoints(subscriptionCount: number): number {
    return subscriptionCount * this.EARNING_RULES.SUBSCRIPTION_SOFTPOINTS;
  }

  // Calculate SoftPoints for sales/transactions
  static calculateSalesSoftPoints(saleAmount: number): number {
    return (
      Math.floor(saleAmount / 1000) * this.EARNING_RULES.SALES_SOFTPOINTS_RATE
    );
  }

  // Get current SoftPoints balance
  async getCurrentBalance(): Promise<SoftPointsBalance> {
    try {
      const response = await api.get("/api/creator/softpoints/balance");
      return response.data;
    } catch (error) {
      console.error("Error fetching SoftPoints balance:", error);
      throw new Error("Failed to fetch SoftPoints balance");
    }
  }

  // Get SoftPoints transaction history
  async getTransactionHistory(
    page: number = 1,
    limit: number = 20,
  ): Promise<{
    history: SoftPointsTransaction[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
  }> {
    try {
      const response = await api.get("/api/creator/softpoints/history", {
        params: { page, limit },
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching SoftPoints history:", error);
      throw new Error("Failed to fetch SoftPoints history");
    }
  }

  // Award SoftPoints for content views
  async awardViewsSoftPoints(
    contentId: string,
    views: number,
  ): Promise<number> {
    const softPoints = SoftPointsService.calculateViewsSoftPoints(views);

    if (softPoints > 0) {
      await this.recordEarning({
        source: "views",
        amount: softPoints,
        description: `Earned ${softPoints} SoftPoints from ${views.toLocaleString()} views`,
        metadata: {
          contentId,
          views,
          rate: SoftPointsService.EARNING_RULES.VIEWS_SOFTPOINTS,
        },
      });
    }

    return softPoints;
  }

  // Award SoftPoints for tips received
  async awardTipSoftPoints(
    tipAmount: number,
    fromUserId: string,
    contentId?: string,
  ): Promise<number> {
    const softPoints = SoftPointsService.calculateTipsSoftPoints(1); // 1 SoftPoint per tip

    await this.recordEarning({
      source: "tips",
      amount: softPoints,
      description: `Earned ${softPoints} SoftPoint from tip of $${tipAmount}`,
      metadata: { tipAmount, fromUserId, contentId },
    });

    return softPoints;
  }

  // Award SoftPoints for new subscription
  async awardSubscriptionSoftPoints(
    subscriberId: string,
    subscriptionTier: string,
  ): Promise<number> {
    const softPoints = SoftPointsService.calculateSubscriptionSoftPoints(1);

    await this.recordEarning({
      source: "subscriptions",
      amount: softPoints,
      description: `Earned ${softPoints} SoftPoints from new ${subscriptionTier} subscription`,
      metadata: { subscriberId, subscriptionTier },
    });

    return softPoints;
  }

  // Award SoftPoints for sales
  async awardSalesSoftPoints(
    saleAmount: number,
    saleId: string,
    productName?: string,
  ): Promise<number> {
    const softPoints = SoftPointsService.calculateSalesSoftPoints(saleAmount);

    if (softPoints > 0) {
      await this.recordEarning({
        source: "sales",
        amount: softPoints,
        description: `Earned ${softPoints} SoftPoints from $${saleAmount} sale${productName ? ` - ${productName}` : ""}`,
        metadata: { saleAmount, saleId, productName },
      });
    }

    return softPoints;
  }

  // Award referral bonus
  async awardReferralBonus(referredUserId: string): Promise<number> {
    const softPoints = SoftPointsService.EARNING_RULES.REFERRAL_BONUS;

    await this.recordEarning({
      source: "referral",
      amount: softPoints,
      description: `Earned ${softPoints} SoftPoints from successful referral`,
      metadata: { referredUserId, bonusType: "referral" },
    });

    return softPoints;
  }

  // Award daily login bonus
  async awardDailyLoginBonus(): Promise<number> {
    const softPoints = SoftPointsService.EARNING_RULES.DAILY_LOGIN_BONUS;

    await this.recordEarning({
      source: "bonus",
      amount: softPoints,
      description: `Daily login bonus: ${softPoints} SoftPoints`,
      metadata: {
        bonusType: "daily_login",
        date: new Date().toISOString().split("T")[0],
      },
    });

    return softPoints;
  }

  // Spend SoftPoints for boosts
  async spendSoftPointsForBoost(
    amount: number,
    boostType: string,
    targetId: string,
  ): Promise<boolean> {
    try {
      const response = await api.post("/api/creator/softpoints/spend", {
        amount,
        purpose: "boost",
        description: `Spent ${amount} SoftPoints on ${boostType} boost`,
        metadata: { boostType, targetId },
      });

      return response.data.success;
    } catch (error) {
      console.error("Error spending SoftPoints:", error);
      throw new Error("Failed to spend SoftPoints");
    }
  }

  // Get earning rates and rules
  static getEarningRules() {
    return {
      ...this.EARNING_RULES,
      descriptions: {
        views: `${this.EARNING_RULES.VIEWS_SOFTPOINTS} SoftPoints per ${this.EARNING_RULES.VIEWS_PER_SOFTPOINT.toLocaleString()} views`,
        tips: `${this.EARNING_RULES.TIP_SOFTPOINTS} SoftPoint per tip received`,
        subscriptions: `${this.EARNING_RULES.SUBSCRIPTION_SOFTPOINTS} SoftPoints per new subscription`,
        sales: `${this.EARNING_RULES.SALES_SOFTPOINTS_RATE} SoftPoints per ₦1,000 in sales`,
        referrals: `${this.EARNING_RULES.REFERRAL_BONUS} SoftPoints per successful referral`,
        dailyLogin: `${this.EARNING_RULES.DAILY_LOGIN_BONUS} SoftPoints for daily login`,
      },
    };
  }

  // Calculate potential earnings for content
  static calculatePotentialEarnings(metrics: {
    views?: number;
    tips?: number;
    subscriptions?: number;
    sales?: number;
  }): {
    views: number;
    tips: number;
    subscriptions: number;
    sales: number;
    total: number;
  } {
    const earnings = {
      views: metrics.views ? this.calculateViewsSoftPoints(metrics.views) : 0,
      tips: metrics.tips ? this.calculateTipsSoftPoints(metrics.tips) : 0,
      subscriptions: metrics.subscriptions
        ? this.calculateSubscriptionSoftPoints(metrics.subscriptions)
        : 0,
      sales: metrics.sales ? this.calculateSalesSoftPoints(metrics.sales) : 0,
      total: 0,
    };

    earnings.total =
      earnings.views + earnings.tips + earnings.subscriptions + earnings.sales;

    return earnings;
  }

  // Format SoftPoints amount for display
  static formatSoftPoints(amount: number): string {
    if (amount >= 1000000) {
      return `${(amount / 1000000).toFixed(1)}M SP`;
    } else if (amount >= 1000) {
      return `${(amount / 1000).toFixed(1)}K SP`;
    } else {
      return `${amount.toLocaleString()} SP`;
    }
  }

  // Get SoftPoints value in USD (approximate)
  static getSoftPointsUSDValue(amount: number): number {
    // Approximate value: 100 SoftPoints = $1 USD
    return amount / 100;
  }

  // Private method to record earning
  private async recordEarning(earning: SoftPointsEarning): Promise<void> {
    try {
      await api.post("/api/creator/softpoints/earn", {
        source: earning.source,
        amount: earning.amount,
        description: earning.description,
        metadata: earning.metadata,
      });
    } catch (error) {
      console.error("Error recording SoftPoints earning:", error);
      throw new Error("Failed to record SoftPoints earning");
    }
  }

  // Batch calculate earnings for multiple actions
  async batchCalculateEarnings(
    actions: Array<{
      type: "views" | "tips" | "subscriptions" | "sales";
      amount: number;
      contentId?: string;
      metadata?: Record<string, any>;
    }>,
  ): Promise<{
    totalSoftPoints: number;
    breakdown: Array<{ type: string; amount: number; softPoints: number }>;
  }> {
    const breakdown: Array<{
      type: string;
      amount: number;
      softPoints: number;
    }> = [];
    let totalSoftPoints = 0;

    for (const action of actions) {
      let softPoints = 0;

      switch (action.type) {
        case "views":
          softPoints = SoftPointsService.calculateViewsSoftPoints(
            action.amount,
          );
          break;
        case "tips":
          softPoints = SoftPointsService.calculateTipsSoftPoints(action.amount);
          break;
        case "subscriptions":
          softPoints = SoftPointsService.calculateSubscriptionSoftPoints(
            action.amount,
          );
          break;
        case "sales":
          softPoints = SoftPointsService.calculateSalesSoftPoints(
            action.amount,
          );
          break;
      }

      if (softPoints > 0) {
        breakdown.push({
          type: action.type,
          amount: action.amount,
          softPoints,
        });
        totalSoftPoints += softPoints;

        // Record the earning
        await this.recordEarning({
          source: action.type,
          amount: softPoints,
          description: `Earned ${softPoints} SoftPoints from ${action.type}`,
          metadata: { ...action.metadata, batchCalculation: true },
        });
      }
    }

    return { totalSoftPoints, breakdown };
  }

  // Get SoftPoints leaderboard position
  async getLeaderboardPosition(): Promise<{
    position: number;
    totalUsers: number;
    percentile: number;
  }> {
    try {
      const response = await api.get(
        "/api/creator/softpoints/leaderboard/position",
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching leaderboard position:", error);
      return { position: 0, totalUsers: 0, percentile: 0 };
    }
  }

  // Get achievement milestones
  static getAchievementMilestones(): Array<{
    name: string;
    description: string;
    requiredSoftPoints: number;
    reward?: string;
  }> {
    return [
      {
        name: "First Steps",
        description: "Earn your first 100 SoftPoints",
        requiredSoftPoints: 100,
        reward: "Bronze Creator Badge",
      },
      {
        name: "Rising Star",
        description: "Accumulate 1,000 SoftPoints",
        requiredSoftPoints: 1000,
        reward: "Silver Creator Badge",
      },
      {
        name: "Content Master",
        description: "Reach 5,000 SoftPoints",
        requiredSoftPoints: 5000,
        reward: "Gold Creator Badge + 10% earnings boost",
      },
      {
        name: "Elite Creator",
        description: "Achieve 25,000 SoftPoints",
        requiredSoftPoints: 25000,
        reward: "Platinum Creator Badge + 25% earnings boost",
      },
      {
        name: "Legendary Creator",
        description: "Reach 100,000 SoftPoints",
        requiredSoftPoints: 100000,
        reward: "Diamond Creator Badge + 50% earnings boost + VIP support",
      },
    ];
  }
}

export const softPointsService = new SoftPointsService();
