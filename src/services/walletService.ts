import { apiCall } from "@/lib/api";
import { WalletBalance, Transaction as WalletTransaction } from "@/types/wallet";

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

export interface Transaction {
  id: string;
  type: string;
  currency: string;
  amount: string;
  description: string;
  status: string;
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
    const response = await apiCall("/api/wallet");
    return response.wallet;
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

  async getWalletBalance(): Promise<WalletBalance> {
    try {
      const wallet = await this.getWallet();

      // Convert string balances to numbers and aggregate them
      const usdtBalance = parseFloat(wallet.usdtBalance || "0");
      const ethBalance = parseFloat(wallet.ethBalance || "0");
      const btcBalance = parseFloat(wallet.btcBalance || "0");
      const softPointsBalance = parseFloat(wallet.softPointsBalance || "0");

      // For now, map all crypto balances to the crypto source
      // In a real implementation, you'd have separate tracking
      const cryptoTotal = usdtBalance + ethBalance + btcBalance;
      const rewardsTotal = softPointsBalance;

      return {
        total: cryptoTotal + rewardsTotal,
        ecommerce: 0, // Not tracked in current wallet structure
        crypto: cryptoTotal,
        rewards: rewardsTotal,
        freelance: 0, // Not tracked in current wallet structure
      };
    } catch (error) {
      console.error("Failed to get wallet balance:", error);
      return {
        total: 0,
        ecommerce: 0,
        crypto: 0,
        rewards: 0,
        freelance: 0,
      };
    }
  }

  async getTransactions(): Promise<WalletTransaction[]> {
    try {
      const transactions = await this.getTransactionHistory();

      // Transform the API transactions to match the expected format
      return transactions.map((tx): WalletTransaction => ({
        id: tx.id,
        type: this.mapTransactionType(tx.type),
        amount: parseFloat(tx.amount),
        source: this.mapCurrencyToSource(tx.currency),
        description: tx.description,
        timestamp: tx.createdAt,
        status: this.mapTransactionStatus(tx.status),
        sourceIcon: this.getCurrencyIcon(tx.currency),
      }));
    } catch (error) {
      console.error("Failed to get transactions:", error);
      return [];
    }
  }

  private mapTransactionType(type: string): "deposit" | "withdrawal" | "earned" | "transfer" {
    switch (type.toLowerCase()) {
      case "deposit":
        return "deposit";
      case "withdrawal":
        return "withdrawal";
      case "earned":
      case "reward":
        return "earned";
      case "transfer":
      case "send":
        return "transfer";
      default:
        return "transfer";
    }
  }

  private mapCurrencyToSource(currency: string): "ecommerce" | "crypto" | "rewards" | "freelance" | "bank" | "card" {
    switch (currency.toUpperCase()) {
      case "USDT":
      case "ETH":
      case "BTC":
        return "crypto";
      case "SOFT_POINTS":
        return "rewards";
      default:
        return "crypto";
    }
  }

  private mapTransactionStatus(status: string): "pending" | "completed" | "failed" {
    switch (status.toLowerCase()) {
      case "pending":
        return "pending";
      case "completed":
      case "success":
        return "completed";
      case "failed":
      case "error":
        return "failed";
      default:
        return "pending";
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

  getCurrencyIcon(currency: string): string {
    return WalletServiceClass.getCurrencyIcon(currency);
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
