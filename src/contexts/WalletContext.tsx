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
    setIsLoading(true);
    setError(null);

    try {
      // Load wallet balance - service handles errors internally with fallback data
      const balance = await walletService.getWalletBalance();
      setWalletBalance(balance);
    } catch (err) {
      console.log("Failed to load wallet balance, using fallback");
    }

    try {
      // Load transactions - service handles errors internally with fallback data
      const transactionHistory = await walletService.getTransactions();
      setTransactions(transactionHistory);
    } catch (err) {
      console.log("Failed to load transactions, using fallback");
    }

    setIsLoading(false);
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
