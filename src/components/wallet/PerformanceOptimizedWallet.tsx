import { useState, useEffect, useMemo, useCallback, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useWalletContext } from "@/contexts/WalletContext";
import { Transaction } from "@/types/wallet";
import TransactionItem from "./TransactionItem";
import { useVirtualScrolling } from "@/utils/virtualScrolling";
import {
  Wifi,
  WifiOff,
  RefreshCw,
  Activity,
  Download,
  TrendingUp,
  AlertCircle,
  CheckCircle,
} from "lucide-react";

interface VirtualizedTransactionListProps {
  transactions: Transaction[];
  onLoadMore: () => void;
  hasMore: boolean;
  isLoading: boolean;
}

const VirtualizedTransactionList = ({ 
  transactions, 
  onLoadMore, 
  hasMore, 
  isLoading 
}: VirtualizedTransactionListProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerHeight, setContainerHeight] = useState(400);
  const itemHeight = 80; // Approximate height of each transaction item

  useEffect(() => {
    const updateHeight = () => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        setContainerHeight(Math.min(rect.height, 600));
      }
    };

    updateHeight();
    window.addEventListener('resize', updateHeight);
    return () => window.removeEventListener('resize', updateHeight);
  }, []);

  const {
    visibleItems,
    totalHeight,
    startIndex,
    endIndex,
    offsetY,
  } = useVirtualScrolling(transactions, {
    itemHeight,
    containerHeight,
    overscan: 3,
  });

  const handleScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
    const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
    
    // Load more when near bottom
    if (scrollHeight - scrollTop - clientHeight < 100 && hasMore && !isLoading) {
      onLoadMore();
    }
  }, [hasMore, isLoading, onLoadMore]);

  return (
    <div
      ref={containerRef}
      className="h-96 overflow-auto border rounded-lg"
      onScroll={handleScroll}
    >
      <div style={{ height: totalHeight, position: 'relative' }}>
        <div
          style={{
            transform: `translateY(${offsetY}px)`,
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
          }}
        >
          {visibleItems.map((transaction, index) => (
            <div
              key={transaction.id}
              style={{ height: itemHeight }}
              className="flex items-center px-4 border-b"
            >
              <TransactionItem transaction={transaction} />
            </div>
          ))}
        </div>
      </div>
      
      {isLoading && (
        <div className="p-4 text-center">
          <RefreshCw className="h-4 w-4 animate-spin mx-auto mb-2" />
          <p className="text-sm text-gray-600">Loading more transactions...</p>
        </div>
      )}
    </div>
  );
};

interface ProgressiveLoadingState {
  balance: boolean;
  transactions: boolean;
  analytics: boolean;
  recommendations: boolean;
}

const PerformanceOptimizedWallet = () => {
  const { walletBalance, transactions, isLoading, refreshWallet } = useWalletContext();
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [wsConnected, setWsConnected] = useState(false);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);
  const [loadingState, setLoadingState] = useState<ProgressiveLoadingState>({
    balance: true,
    transactions: true,
    analytics: true,
    recommendations: true,
  });
  
  const [displayedTransactions, setDisplayedTransactions] = useState<Transaction[]>([]);
  const [hasMoreTransactions, setHasMoreTransactions] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [realTimeUpdates, setRealTimeUpdates] = useState<Transaction[]>([]);
  
  const wsRef = useRef<WebSocket | null>(null);
  const batchSize = 20;

  // Progressive loading effect
  useEffect(() => {
    const loadData = async () => {
      // Load balance first (highest priority)
      await new Promise(resolve => setTimeout(resolve, 100));
      setLoadingState(prev => ({ ...prev, balance: false }));

      // Load initial transactions
      await new Promise(resolve => setTimeout(resolve, 200));
      setDisplayedTransactions(transactions.slice(0, batchSize));
      setLoadingState(prev => ({ ...prev, transactions: false }));

      // Load analytics
      await new Promise(resolve => setTimeout(resolve, 300));
      setLoadingState(prev => ({ ...prev, analytics: false }));

      // Load recommendations last
      await new Promise(resolve => setTimeout(resolve, 400));
      setLoadingState(prev => ({ ...prev, recommendations: false }));
    };

    if (!isLoading) {
      loadData();
    }
  }, [isLoading, transactions]);

  // Real-time WebSocket connection (Mock for demo)
  useEffect(() => {
    const simulateRealTimeUpdates = () => {
      setWsConnected(true);
      console.log('Mock WebSocket connected for real-time updates');

      // Simulate periodic updates
      const interval = setInterval(() => {
        if (Math.random() > 0.8) { // 20% chance of update
          const mockTransaction = {
            id: `mock_${Date.now()}`,
            type: "earned" as const,
            amount: Math.floor(Math.random() * 500) + 10,
            source: ["ecommerce", "crypto", "rewards", "freelance"][Math.floor(Math.random() * 4)] as any,
            description: `Mock transaction ${Math.floor(Math.random() * 1000)}`,
            timestamp: new Date().toISOString(),
            status: "completed" as const,
          };

          setRealTimeUpdates(prev => [mockTransaction, ...prev.slice(0, 4)]); // Keep only 5 updates
          setLastUpdate(new Date());
        }
      }, 10000); // Check every 10 seconds

      return () => {
        clearInterval(interval);
        setWsConnected(false);
      };
    };

    let cleanup: (() => void) | undefined;

    if (isOnline) {
      cleanup = simulateRealTimeUpdates();
    }

    return cleanup;
  }, [isOnline]);

  // Online/offline detection
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Load more transactions
  const loadMoreTransactions = useCallback(async () => {
    if (isLoadingMore || !hasMoreTransactions) return;

    setIsLoadingMore(true);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const currentLength = displayedTransactions.length;
    const nextBatch = transactions.slice(currentLength, currentLength + batchSize);
    
    if (nextBatch.length === 0) {
      setHasMoreTransactions(false);
    } else {
      setDisplayedTransactions(prev => [...prev, ...nextBatch]);
    }
    
    setIsLoadingMore(false);
  }, [displayedTransactions.length, transactions, isLoadingMore, hasMoreTransactions]);

  // Memoized calculations for performance
  const balanceAnalytics = useMemo(() => {
    if (!walletBalance) return null;

    const totalBalance = walletBalance.total;
    const sources = [
      { name: 'E-commerce', value: walletBalance.ecommerce, percentage: 0 },
      { name: 'Crypto', value: walletBalance.crypto, percentage: 0 },
      { name: 'Rewards', value: walletBalance.rewards, percentage: 0 },
      { name: 'Freelance', value: walletBalance.freelance, percentage: 0 },
    ];

    sources.forEach(source => {
      source.percentage = totalBalance > 0 ? (source.value / totalBalance) * 100 : 0;
    });

    return { totalBalance, sources };
  }, [walletBalance]);

  // Offline data caching
  useEffect(() => {
    if (walletBalance && transactions.length > 0) {
      localStorage.setItem('wallet_cache', JSON.stringify({
        balance: walletBalance,
        transactions: transactions.slice(0, 50), // Cache first 50 transactions
        timestamp: Date.now(),
      }));
    }
  }, [walletBalance, transactions]);

  // Load cached data when offline
  useEffect(() => {
    if (!isOnline && !walletBalance) {
      try {
        const cached = localStorage.getItem('wallet_cache');
        if (cached) {
          const { balance, transactions: cachedTransactions, timestamp } = JSON.parse(cached);
          // Use cached data if it's less than 1 hour old
          if (Date.now() - timestamp < 3600000) {
            // In a real app, you'd update the context with cached data
            console.log('Using cached wallet data');
          }
        }
      } catch (error) {
        console.error('Error loading cached data:', error);
      }
    }
  }, [isOnline, walletBalance]);

  const refreshData = useCallback(async () => {
    try {
      await refreshWallet();
      setLastUpdate(new Date());
    } catch (error) {
      console.error('Failed to refresh wallet data:', error);
    }
  }, [refreshWallet]);

  // Auto-refresh every 30 seconds when online
  useEffect(() => {
    if (!isOnline) return;

    const interval = setInterval(refreshData, 30000);
    return () => clearInterval(interval);
  }, [isOnline, refreshData]);

  return (
    <div className="space-y-6">
      {/* Connection Status */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                {isOnline ? (
                  <Wifi className="h-4 w-4 text-green-500" />
                ) : (
                  <WifiOff className="h-4 w-4 text-red-500" />
                )}
                <span className="text-sm font-medium">
                  {isOnline ? 'Online' : 'Offline'}
                </span>
              </div>
              
              <div className="flex items-center gap-2">
                {wsConnected ? (
                  <CheckCircle className="h-4 w-4 text-green-500" />
                ) : (
                  <AlertCircle className="h-4 w-4 text-yellow-500" />
                )}
                <span className="text-sm">
                  Real-time: {wsConnected ? 'Connected' : 'Disconnected'}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {lastUpdate && (
                <span className="text-xs text-gray-600">
                  Last update: {lastUpdate.toLocaleTimeString()}
                </span>
              )}
              <Button variant="outline" size="sm" onClick={refreshData}>
                <RefreshCw className="h-3 w-3 mr-1" />
                Refresh
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Progressive Loading: Balance */}
      <Card>
        <CardHeader>
          <CardTitle>Wallet Balance</CardTitle>
        </CardHeader>
        <CardContent>
          {loadingState.balance ? (
            <div className="space-y-3">
              <Skeleton className="h-12 w-48" />
              <Skeleton className="h-4 w-32" />
            </div>
          ) : balanceAnalytics ? (
            <div className="space-y-4">
              <div className="text-3xl font-bold">
                ${balanceAnalytics.totalBalance.toFixed(2)}
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {balanceAnalytics.sources.map((source) => (
                  <div key={source.name} className="text-center">
                    <div className="text-lg font-semibold">
                      ${source.value.toFixed(2)}
                    </div>
                    <div className="text-sm text-gray-600">{source.name}</div>
                    <div className="text-xs text-gray-500">
                      {source.percentage.toFixed(1)}%
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : null}
        </CardContent>
      </Card>

      {/* Real-time Updates Banner */}
      {realTimeUpdates.length > 0 && (
        <Card className="border-blue-200 bg-blue-50">
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Activity className="h-4 w-4 text-blue-500 animate-pulse" />
              <span className="text-sm font-medium text-blue-700">
                {realTimeUpdates.length} new transaction{realTimeUpdates.length > 1 ? 's' : ''} received
              </span>
              <Button 
                size="sm" 
                variant="outline" 
                onClick={() => {
                  setRealTimeUpdates([]);
                  refreshData();
                }}
              >
                Update
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Progressive Loading: Transactions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Recent Transactions</span>
            {!loadingState.transactions && (
              <Badge variant="outline">
                {displayedTransactions.length} of {transactions.length}
              </Badge>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loadingState.transactions ? (
            <div className="space-y-3">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="flex items-center gap-3 p-3">
                  <Skeleton className="h-10 w-10 rounded-full" />
                  <div className="space-y-2 flex-1">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-3 w-24" />
                  </div>
                  <Skeleton className="h-4 w-16" />
                </div>
              ))}
            </div>
          ) : (
            <VirtualizedTransactionList
              transactions={displayedTransactions}
              onLoadMore={loadMoreTransactions}
              hasMore={hasMoreTransactions}
              isLoading={isLoadingMore}
            />
          )}
        </CardContent>
      </Card>

      {/* Offline Mode Notice */}
      {!isOnline && (
        <Card className="border-yellow-200 bg-yellow-50">
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <WifiOff className="h-4 w-4 text-yellow-600" />
              <div>
                <p className="text-sm font-medium text-yellow-800">
                  You're currently offline
                </p>
                <p className="text-xs text-yellow-700">
                  Showing cached data. Data will sync when connection is restored.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Progressive Loading: Analytics */}
      {loadingState.analytics ? (
        <Card>
          <CardHeader>
            <CardTitle>Analytics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Skeleton className="h-32 w-full" />
              <div className="grid grid-cols-3 gap-4">
                <Skeleton className="h-16 w-full" />
                <Skeleton className="h-16 w-full" />
                <Skeleton className="h-16 w-full" />
              </div>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Performance Analytics
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8">
              <p className="text-gray-600">Analytics dashboard loaded</p>
              <p className="text-sm text-gray-500">Real-time performance metrics available</p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default PerformanceOptimizedWallet;
