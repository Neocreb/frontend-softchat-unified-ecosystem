import { apiCall } from "@/lib/api";
import { WalletBalance, Transaction } from "@/types/wallet";

export interface Wallet {
  id: string;
  userId: string;
  usdtBalance: string;
  ethBalance: string;
  btcBalance: string;
  softPointsBalance: string;
  isFrozen: boolean;
  createdAt: string;
}

export interface SendMoneyRequest {
  recipientId: string;
  amount: string;
  currency: string;
  description?: string;
}

class WalletServiceClass {
  async getWallet(): Promise<Wallet> {
    try {
      const response = await apiCall("/api/wallet");
      return response.wallet;
    } catch (error) {
      // Return mock data for development
      return {
        id: "1",
        userId: "1",
        usdtBalance: "1250.50",
        ethBalance: "0.5",
        btcBalance: "0.0125",
        softPointsBalance: "5000",
        isFrozen: false,
        createdAt: new Date().toISOString(),
      };
    }
  }

  async getWalletBalance(): Promise<WalletBalance> {
    try {
      // Try to get actual wallet data
      const wallet = await this.getWallet();
      const usdtBalance = parseFloat(wallet.usdtBalance);
      const creatorEconomyBalance = parseFloat(wallet.softPointsBalance) / 100; // Convert SP to USD equivalent

      return {
        total: usdtBalance + creatorEconomyBalance + 500 + 250, // Add mock ecommerce and freelance
        ecommerce: 500, // Mock ecommerce earnings
        crypto: usdtBalance,
        creator_economy: creatorEconomyBalance,
        freelance: 250, // Mock freelance earnings
      };
    } catch (error) {
      // Return mock data for development
      return {
        total: 2000,
        ecommerce: 500,
        crypto: 1250,
        creator_economy: 50, // SoftPoints converted to USD
        freelance: 200,
      };
    }
  }

  async getTransactions(): Promise<Transaction[]> {
    try {
      const response = await apiCall("/api/wallet/history");
      return response.transactions;
    } catch (error) {
      // Return mock transactions for development
      return [
        {
          id: "1",
          type: "earned",
          amount: 50,
          source: "creator_economy",
          description: "SoftPoints earned from content views",
          timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
          status: "completed",
        },
        {
          id: "2",
          type: "earned",
          amount: 25,
          source: "creator_economy",
          description: "Tips received from followers",
          timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
          status: "completed",
        },
        {
          id: "3",
          type: "earned",
          amount: 200,
          source: "freelance",
          description: "Project payment received",
          timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
          status: "completed",
        },
        {
          id: "4",
          type: "earned",
          amount: 150,
          source: "ecommerce",
          description: "Product sale commission",
          timestamp: new Date(
            Date.now() - 2 * 24 * 60 * 60 * 1000,
          ).toISOString(),
          status: "completed",
        },
      ];
    }
  }

  async sendMoney(
    data: SendMoneyRequest,
  ): Promise<{ success: boolean; transactionId: string }> {
    const response = await apiCall("/api/wallet/send", {
      method: "POST",
      body: JSON.stringify(data),
    });
    return response;
  }

  async getTransactionHistory(params?: {
    limit?: number;
    offset?: number;
    type?: string;
    currency?: string;
  }): Promise<Transaction[]> {
    const queryParams = new URLSearchParams();
    if (params?.limit) queryParams.append("limit", params.limit.toString());
    if (params?.offset) queryParams.append("offset", params.offset.toString());
    if (params?.type) queryParams.append("type", params.type);
    if (params?.currency) queryParams.append("currency", params.currency);

    const response = await apiCall(
      `/api/wallet/history?${queryParams.toString()}`,
    );
    return response.transactions;
  }

  async refreshWallet(): Promise<void> {
    // Force refresh of wallet data
    try {
      await this.getWalletBalance();
    } catch (error) {
      console.log("Error refreshing wallet:", error);
    }
  }

  static formatBalance(balance: string, currency: string): string {
    const amount = parseFloat(balance);

    switch (currency) {
      case "USDT":
        return `$${amount.toLocaleString()}`;
      case "ETH":
        return `${amount.toFixed(4)} ETH`;
      case "BTC":
        return `${amount.toFixed(6)} BTC`;
      case "SOFT_POINTS":
        return `${amount.toLocaleString()} SP`;
      default:
        return `${amount} ${currency}`;
    }
  }

  static getCurrencyIcon(currency: string): string {
    switch (currency) {
      case "USDT":
        return "💵";
      case "ETH":
        return "💎";
      case "BTC":
        return "₿";
      case "SOFT_POINTS":
        return "⭐";
      default:
        return "💰";
    }
  }
}

// Export both class and instance to support existing and new code
export const WalletService = WalletServiceClass;
export const walletService = new WalletServiceClass();
