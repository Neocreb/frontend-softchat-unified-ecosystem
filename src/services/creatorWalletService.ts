import { api } from "@/lib/api";
import { walletService } from "@/services/walletService";

export interface CreatorWalletBalance {
  totalBalance: number;
  availableBalance: number;
  pendingEarnings: number;
  softPointsBalance: number;
  currency: string;
  breakdown: {
    tips: number;
    subscriptions: number;
    views: number;
    services: number;
    boosts: number;
  };
}

export interface EarningsTransaction {
  id: string;
  type:
    | "earnings_deposit"
    | "payout_withdrawal"
    | "boost_payment"
    | "tip_received"
    | "subscription_payment";
  amount: number;
  currency: string;
  softPointsAmount?: number;
  description: string;
  status: "pending" | "confirmed" | "failed";
  createdAt: string;
  metadata?: Record<string, any>;
}

export interface WithdrawalRequest {
  amount: number;
  currency: string;
  payoutMethod: "bank_transfer" | "crypto_wallet" | "paypal";
  paymentDetails: Record<string, any>;
}

export interface WithdrawalResponse {
  id: string;
  status: "pending" | "processing" | "completed" | "failed";
  estimatedTime: string;
  fee: number;
  netAmount: number;
}

export class CreatorWalletService {
  // Get creator wallet balance with earnings breakdown
  async getCreatorWalletBalance(): Promise<CreatorWalletBalance> {
    try {
      const response = await api.get("/api/creator/wallet/balance");
      return response.data;
    } catch (error) {
      console.error("Error fetching creator wallet balance:", error);
      throw new Error("Failed to fetch creator wallet balance");
    }
  }

  // Get earnings transaction history
  async getEarningsHistory(
    page: number = 1,
    limit: number = 20,
  ): Promise<{
    transactions: EarningsTransaction[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
  }> {
    try {
      const response = await api.get("/api/creator/wallet/earnings-history", {
        params: { page, limit },
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching earnings history:", error);
      throw new Error("Failed to fetch earnings history");
    }
  }

  // Process earnings deposit from tips, views, subscriptions, etc.
  async depositEarnings(earnings: {
    sourceType: "tips" | "views" | "subscriptions" | "services";
    sourceId: string;
    amount: number;
    softPointsAmount?: number;
    description: string;
    metadata?: Record<string, any>;
  }): Promise<EarningsTransaction> {
    try {
      const response = await api.post(
        "/api/creator/wallet/deposit-earnings",
        earnings,
      );

      // Sync with main wallet service
      await this.syncWithMainWallet();

      return response.data;
    } catch (error) {
      console.error("Error depositing earnings:", error);
      throw new Error("Failed to deposit earnings");
    }
  }

  // Request withdrawal/payout
  async requestWithdrawal(
    request: WithdrawalRequest,
  ): Promise<WithdrawalResponse> {
    try {
      const response = await api.post(
        "/api/creator/wallet/request-withdrawal",
        request,
      );
      return response.data;
    } catch (error) {
      console.error("Error requesting withdrawal:", error);
      throw new Error("Failed to request withdrawal");
    }
  }

  // Get withdrawal/payout history
  async getWithdrawalHistory(
    page: number = 1,
    limit: number = 20,
  ): Promise<{
    withdrawals: Array<{
      id: string;
      amount: number;
      currency: string;
      payoutMethod: string;
      status: string;
      requestedAt: string;
      completedAt?: string;
      fee: number;
      netAmount: number;
    }>;
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
  }> {
    try {
      const response = await api.get("/api/creator/wallet/withdrawal-history", {
        params: { page, limit },
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching withdrawal history:", error);
      throw new Error("Failed to fetch withdrawal history");
    }
  }

  // Get available withdrawal methods and their fees
  async getWithdrawalMethods(): Promise<
    Array<{
      method: string;
      name: string;
      description: string;
      fee: number;
      feeType: "fixed" | "percentage";
      minAmount: number;
      maxAmount: number;
      processingTime: string;
      isAvailable: boolean;
    }>
  > {
    try {
      const response = await api.get("/api/creator/wallet/withdrawal-methods");
      return response.data;
    } catch (error) {
      console.error("Error fetching withdrawal methods:", error);
      throw new Error("Failed to fetch withdrawal methods");
    }
  }

  // Sync creator earnings with main wallet system
  private async syncWithMainWallet(): Promise<void> {
    try {
      // Refresh main wallet balance to include new earnings
      await walletService.refreshWallet();
    } catch (error) {
      console.error("Error syncing with main wallet:", error);
      // Don't throw error as this is a background sync
    }
  }

  // Calculate potential earnings for given metrics
  calculatePotentialEarnings(metrics: {
    views?: number;
    tips?: number;
    subscriptions?: number;
    salesAmount?: number;
  }): {
    estimatedEarnings: number;
    estimatedSoftPoints: number;
    breakdown: {
      views: { earnings: number; softPoints: number };
      tips: { earnings: number; softPoints: number };
      subscriptions: { earnings: number; softPoints: number };
      sales: { earnings: number; softPoints: number };
    };
  } {
    // Use the earning rates from SoftPointsService
    const breakdown = {
      views: {
        earnings: (metrics.views || 0) * 0.001, // $0.001 per view
        softPoints: Math.floor((metrics.views || 0) / 1000) * 5, // 5 SP per 1000 views
      },
      tips: {
        earnings: (metrics.tips || 0) * 1.0, // Full tip amount
        softPoints: (metrics.tips || 0) * 1, // 1 SP per tip
      },
      subscriptions: {
        earnings: (metrics.subscriptions || 0) * 10.0, // $10 per subscription
        softPoints: (metrics.subscriptions || 0) * 10, // 10 SP per subscription
      },
      sales: {
        earnings: (metrics.salesAmount || 0) * 0.05, // 5% commission
        softPoints: Math.floor((metrics.salesAmount || 0) / 1000) * 10, // 10 SP per $1000
      },
    };

    const estimatedEarnings = Object.values(breakdown).reduce(
      (sum, item) => sum + item.earnings,
      0,
    );

    const estimatedSoftPoints = Object.values(breakdown).reduce(
      (sum, item) => sum + item.softPoints,
      0,
    );

    return {
      estimatedEarnings,
      estimatedSoftPoints,
      breakdown,
    };
  }

  // Get earning analytics for a specific period
  async getEarningAnalytics(
    period: "7d" | "30d" | "90d" | "1y" = "30d",
  ): Promise<{
    totalEarnings: number;
    totalSoftPoints: number;
    averageDailyEarnings: number;
    earningsBySource: Record<string, number>;
    growthRate: number;
    projectedMonthly: number;
  }> {
    try {
      const response = await api.get("/api/creator/wallet/analytics", {
        params: { period },
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching earning analytics:", error);
      throw new Error("Failed to fetch earning analytics");
    }
  }

  // Get tax reporting data
  async getTaxReportData(year: number): Promise<{
    totalEarnings: number;
    earningsByCategory: Record<string, number>;
    platformFeesPaid: number;
    withdrawalFeesPaid: number;
    transactions: Array<{
      date: string;
      description: string;
      amount: number;
      category: string;
    }>;
  }> {
    try {
      const response = await api.get("/api/creator/wallet/tax-report", {
        params: { year },
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching tax report data:", error);
      throw new Error("Failed to fetch tax report data");
    }
  }

  // Set up automatic payouts
  async setupAutomaticPayouts(settings: {
    enabled: boolean;
    minAmount: number;
    frequency: "weekly" | "monthly";
    payoutMethod: string;
    paymentDetails: Record<string, any>;
  }): Promise<{ success: boolean; message: string }> {
    try {
      const response = await api.post(
        "/api/creator/wallet/setup-auto-payouts",
        settings,
      );
      return response.data;
    } catch (error) {
      console.error("Error setting up automatic payouts:", error);
      throw new Error("Failed to setup automatic payouts");
    }
  }

  // Get current automatic payout settings
  async getAutomaticPayoutSettings(): Promise<{
    enabled: boolean;
    minAmount: number;
    frequency: string;
    payoutMethod: string;
    nextPayoutDate?: string;
    lastPayoutDate?: string;
  } | null> {
    try {
      const response = await api.get(
        "/api/creator/wallet/auto-payout-settings",
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching automatic payout settings:", error);
      return null;
    }
  }

  // Convert SoftPoints to USD (for display purposes)
  convertSoftPointsToUSD(softPoints: number): number {
    // 100 SoftPoints = $1 USD (configurable rate)
    return softPoints / 100;
  }

  // Format currency amounts
  formatCurrency(amount: number, currency: string = "USD"): string {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency,
      minimumFractionDigits: 2,
    }).format(amount);
  }

  // Format SoftPoints
  formatSoftPoints(amount: number): string {
    if (amount >= 1000000) {
      return `${(amount / 1000000).toFixed(1)}M SP`;
    } else if (amount >= 1000) {
      return `${(amount / 1000).toFixed(1)}K SP`;
    }
    return `${amount.toLocaleString()} SP`;
  }

  // Validate withdrawal request
  validateWithdrawalRequest(
    request: WithdrawalRequest,
    balance: number,
  ): {
    isValid: boolean;
    errors: string[];
  } {
    const errors: string[] = [];

    if (request.amount <= 0) {
      errors.push("Withdrawal amount must be greater than 0");
    }

    if (request.amount > balance) {
      errors.push("Insufficient balance for withdrawal");
    }

    if (request.amount < 10) {
      errors.push("Minimum withdrawal amount is $10");
    }

    if (!request.payoutMethod) {
      errors.push("Payout method is required");
    }

    if (
      !request.paymentDetails ||
      Object.keys(request.paymentDetails).length === 0
    ) {
      errors.push("Payment details are required");
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  // Get earning milestones and achievements
  async getEarningMilestones(): Promise<
    Array<{
      id: string;
      name: string;
      description: string;
      targetAmount: number;
      currentAmount: number;
      isCompleted: boolean;
      completedAt?: string;
      reward?: string;
    }>
  > {
    try {
      const response = await api.get("/api/creator/wallet/milestones");
      return response.data;
    } catch (error) {
      console.error("Error fetching earning milestones:", error);
      return [];
    }
  }

  // Get wallet security settings
  async getWalletSecuritySettings(): Promise<{
    twoFactorEnabled: boolean;
    withdrawalNotifications: boolean;
    largeTransactionAlerts: boolean;
    autoLockPeriod: number;
  }> {
    try {
      const response = await api.get("/api/creator/wallet/security-settings");
      return response.data;
    } catch (error) {
      console.error("Error fetching wallet security settings:", error);
      return {
        twoFactorEnabled: false,
        withdrawalNotifications: true,
        largeTransactionAlerts: true,
        autoLockPeriod: 30,
      };
    }
  }

  // Update wallet security settings
  async updateWalletSecuritySettings(settings: {
    twoFactorEnabled?: boolean;
    withdrawalNotifications?: boolean;
    largeTransactionAlerts?: boolean;
    autoLockPeriod?: number;
  }): Promise<{ success: boolean; message: string }> {
    try {
      const response = await api.put(
        "/api/creator/wallet/security-settings",
        settings,
      );
      return response.data;
    } catch (error) {
      console.error("Error updating wallet security settings:", error);
      throw new Error("Failed to update wallet security settings");
    }
  }
}

export const creatorWalletService = new CreatorWalletService();
