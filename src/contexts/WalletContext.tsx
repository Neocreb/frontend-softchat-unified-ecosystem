import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { WalletBalance, Transaction } from "@/types/wallet";
import { walletService } from "@/services/walletService";

interface WalletContextType {
  walletBalance: WalletBalance | null;
  transactions: Transaction[];
  isLoading: boolean;
  error: string | null;
  refreshWallet: () => Promise<void>;
  getTransactionsBySource: (source: string) => Transaction[];
  getTotalEarnings: (days?: number) => number;
  getSourceBalance: (source: keyof WalletBalance) => number;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

interface WalletProviderProps {
  children: ReactNode;
}

export const WalletProvider: React.FC<WalletProviderProps> = ({ children }) => {
  const [walletBalance, setWalletBalance] = useState<WalletBalance | null>(
    null,
  );
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadWalletData = async () => {
    try {
      console.log("WalletContext: Starting loadWalletData");
      setIsLoading(true);
      setError(null);

      console.log("WalletContext: Calling wallet service methods");
      const [balance, transactionHistory] = await Promise.all([
        walletService.getWalletBalance(),
        walletService.getTransactions(),
      ]);

      console.log("WalletContext: Setting wallet data", {
        balance,
        transactionHistory,
      });
      setWalletBalance(balance);
      setTransactions(transactionHistory);
      console.log("WalletContext: Wallet data loaded successfully");
    } catch (err) {
      const errorMessage = "Failed to load wallet data";
      console.error("WalletContext: Wallet data loading error:", err);
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const refreshWallet = async () => {
    await loadWalletData();
  };

  const getTransactionsBySource = (source: string) => {
    return transactions.filter((t) => t.source === source);
  };

  const getTotalEarnings = (days: number = 30) => {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);

    return transactions
      .filter((t) => new Date(t.timestamp) >= cutoffDate && t.amount > 0)
      .reduce((sum, t) => sum + t.amount, 0);
  };

  const getSourceBalance = (source: keyof WalletBalance) => {
    return walletBalance?.[source] || 0;
  };

  useEffect(() => {
    loadWalletData();
  }, []);

  const contextValue: WalletContextType = {
    walletBalance,
    transactions,
    isLoading,
    error,
    refreshWallet,
    getTransactionsBySource,
    getTotalEarnings,
    getSourceBalance,
  };

  return (
    <WalletContext.Provider value={contextValue}>
      {children}
    </WalletContext.Provider>
  );
};

export const useWalletContext = () => {
  const context = useContext(WalletContext);
  if (context === undefined) {
    throw new Error("useWalletContext must be used within a WalletProvider");
  }
  return context;
};

export default WalletContext;
