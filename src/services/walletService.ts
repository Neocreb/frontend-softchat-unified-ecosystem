import {
  WalletBalance,
  Transaction,
  WithdrawalRequest,
  DepositRequest,
  BankAccount,
} from "@/types/wallet";

// Mock data for development
const mockWalletBalance: WalletBalance = {
  total: 23847.65,
  ecommerce: 8450.32,
  crypto: 12245.18,
  rewards: 1876.5,
  freelance: 1275.65,
};

const mockTransactions: Transaction[] = [
  {
    id: "1",
    type: "earned",
    amount: 245.75,
    source: "crypto",
    description: "Bitcoin trading profit",
    timestamp: "2024-01-15T10:30:00Z",
    status: "completed",
    sourceIcon: "💹",
  },
  {
    id: "2",
    type: "earned",
    amount: 125.0,
    source: "freelance",
    description: "Web design project completion",
    timestamp: "2024-01-14T16:45:00Z",
    status: "completed",
    sourceIcon: "💼",
  },
  {
    id: "3",
    type: "earned",
    amount: 89.5,
    source: "ecommerce",
    description: "Product sale commission",
    timestamp: "2024-01-14T09:15:00Z",
    status: "completed",
    sourceIcon: "🛒",
  },
  {
    id: "4",
    type: "earned",
    amount: 35.5,
    source: "rewards",
    description: "Daily check-in bonus",
    timestamp: "2024-01-13T12:00:00Z",
    status: "completed",
    sourceIcon: "🎁",
  },
  {
    id: "5",
    type: "withdrawal",
    amount: -500.0,
    source: "bank",
    description: "Bank withdrawal",
    timestamp: "2024-01-12T14:20:00Z",
    status: "completed",
    sourceIcon: "🏦",
  },
  {
    id: "6",
    type: "deposit",
    amount: 1000.0,
    source: "card",
    description: "Credit card deposit",
    timestamp: "2024-01-10T11:30:00Z",
    status: "completed",
    sourceIcon: "💳",
  },
];

const mockBankAccounts: BankAccount[] = [
  {
    id: "1",
    name: "Primary Checking",
    accountNumber: "****1234",
    routingNumber: "123456789",
    bankName: "Chase Bank",
    isDefault: true,
  },
  {
    id: "2",
    name: "Savings Account",
    accountNumber: "****5678",
    routingNumber: "987654321",
    bankName: "Bank of America",
    isDefault: false,
  },
];

export const walletService = {
  // Get wallet balance
  async getWalletBalance(): Promise<WalletBalance> {
    try {
      const response = await fetch("/api/wallet");
      if (!response.ok) {
        throw new Error("Failed to fetch wallet balance");
      }
      return await response.json();
    } catch (error) {
      console.error("Error fetching wallet balance:", error);
      // Fallback to mock data in case of error
      return mockWalletBalance;
    }
  },

  // Get transactions
  async getTransactions(
    source?: string,
    limit?: number,
  ): Promise<Transaction[]> {
    try {
      const params = new URLSearchParams();
      if (source) params.append("source", source);
      if (limit) params.append("limit", limit.toString());

      const response = await fetch(`/api/wallet/transactions?${params}`);
      if (!response.ok) {
        throw new Error("Failed to fetch transactions");
      }

      const transactions = await response.json();
      return transactions.sort(
        (a: Transaction, b: Transaction) =>
          new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime(),
      );
    } catch (error) {
      console.error("Error fetching transactions:", error);
      // Fallback to mock data in case of error
      let transactions = [...mockTransactions];

      if (source && source !== "all") {
        transactions = transactions.filter((t) => t.source === source);
      }

      if (limit) {
        transactions = transactions.slice(0, limit);
      }

      return transactions.sort(
        (a, b) =>
          new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime(),
      );
    }
  },

  // Process withdrawal
  async processWithdrawal(
    request: WithdrawalRequest,
  ): Promise<{ success: boolean; transactionId?: string; message: string }> {
    try {
      const response = await fetch("/api/wallet/withdraw", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(request),
      });

      const result = await response.json();

      if (!response.ok) {
        return {
          success: false,
          message: result.error || "Withdrawal failed",
        };
      }

      return result;
    } catch (error) {
      console.error("Error processing withdrawal:", error);
      return {
        success: false,
        message: "Network error occurred",
      };
    }
  },

  // Process deposit
  async processDeposit(
    request: DepositRequest,
  ): Promise<{ success: boolean; transactionId?: string; message: string }> {
    try {
      const response = await fetch("/api/wallet/deposit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(request),
      });

      const result = await response.json();

      if (!response.ok) {
        return {
          success: false,
          message: result.error || "Deposit failed",
        };
      }

      return result;
    } catch (error) {
      console.error("Error processing deposit:", error);
      return {
        success: false,
        message: "Network error occurred",
      };
    }
  },

  // Get bank accounts
  async getBankAccounts(): Promise<BankAccount[]> {
    try {
      const response = await fetch("/api/wallet/bank-accounts");
      if (!response.ok) {
        throw new Error("Failed to fetch bank accounts");
      }
      return await response.json();
    } catch (error) {
      console.error("Error fetching bank accounts:", error);
      // Fallback to mock data in case of error
      return mockBankAccounts;
    }
  },

  // Add bank account
  async addBankAccount(account: Omit<BankAccount, "id">): Promise<BankAccount> {
    await new Promise((resolve) => setTimeout(resolve, 500));

    const newAccount: BankAccount = {
      ...account,
      id: `bank_${Date.now()}`,
    };

    mockBankAccounts.push(newAccount);
    return newAccount;
  },
};
