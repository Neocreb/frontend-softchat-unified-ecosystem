import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { WalletProvider, useWalletContext } from "@/contexts/WalletContext";
import WalletSourceCard from "./WalletSourceCard";
import WithdrawModal from "./WithdrawModal";
import DepositModal from "./DepositModal";
import TransactionItem from "./TransactionItem";
import { useToast } from "@/components/ui/use-toast";
import {
  ArrowDownLeft,
  ArrowUpRight,
  TrendingUp,
  Wallet,
  RefreshCw,
  Eye,
  EyeOff,
} from "lucide-react";

const WalletDashboardContent = () => {
  const {
    walletBalance,
    transactions: allTransactions,
    isLoading,
    refreshWallet,
    getTransactionsBySource,
    getTotalEarnings,
  } = useWalletContext();

  const [activeTab, setActiveTab] = useState("all");
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [showDepositModal, setShowDepositModal] = useState(false);
  const [balanceVisible, setBalanceVisible] = useState(true);
  const { toast } = useToast();

  const walletSources = [
    {
      id: "ecommerce",
      name: "E-Commerce Earnings",
      icon: "🛒",
      color: "bg-gradient-to-r from-green-500 to-green-600",
      description: "Marketplace sales and commissions",
    },
    {
      id: "crypto",
      name: "Crypto Portfolio",
      icon: "💹",
      color: "bg-gradient-to-r from-orange-500 to-orange-600",
      description: "Trading profits and investments",
    },
    {
      id: "rewards",
      name: "Rewards System",
      icon: "🎁",
      color: "bg-gradient-to-r from-purple-500 to-purple-600",
      description: "Points, bonuses, and achievements",
    },
    {
      id: "freelance",
      name: "Freelance Income",
      icon: "💼",
      color: "bg-gradient-to-r from-indigo-500 to-indigo-600",
      description: "Project payments and milestones",
    },
  ];

  const refreshData = async () => {
    setIsRefreshing(true);
    try {
      await refreshWallet();
      toast({
        title: "Updated",
        description: "Wallet data refreshed successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to refresh data",
        variant: "destructive",
      });
    } finally {
      setIsRefreshing(false);
    }
  };

  const getTransactionsForSource = (sourceId: string) => {
    if (sourceId === "all") return allTransactions;
    return getTransactionsBySource(sourceId);
  };

  if (isLoading) {
    return (
      <div className="container mx-auto p-6 space-y-6">
        {/* Header Skeleton */}
        <div className="flex items-center justify-between">
          <Skeleton className="h-8 w-48" />
          <div className="flex gap-2">
            <Skeleton className="h-10 w-24" />
            <Skeleton className="h-10 w-24" />
          </div>
        </div>

        {/* Balance Card Skeleton */}
        <Card>
          <CardContent className="p-8">
            <Skeleton className="h-12 w-64 mx-auto mb-4" />
            <Skeleton className="h-6 w-32 mx-auto" />
          </CardContent>
        </Card>

        {/* Tabs Skeleton */}
        <div className="space-y-4">
          <div className="flex gap-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <Skeleton key={i} className="h-10 w-24" />
            ))}
          </div>
          <Skeleton className="h-64 w-full" />
        </div>
      </div>
    );
  }

  if (!walletBalance) return null;

  const earningsGrowth = getTotalEarnings(30);

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Unified Wallet</h1>
          <p className="text-gray-600">
            Manage all your earnings and funds in one place
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={refreshData}
            disabled={isRefreshing}
            className="flex items-center gap-2"
          >
            <RefreshCw
              className={`h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`}
            />
            Refresh
          </Button>
          <Button
            onClick={() => setShowDepositModal(true)}
            className="bg-green-600 hover:bg-green-700 flex items-center gap-2"
          >
            <ArrowDownLeft className="h-4 w-4" />
            Deposit
          </Button>
          <Button
            onClick={() => setShowWithdrawModal(true)}
            variant="outline"
            className="border-red-200 text-red-600 hover:bg-red-50 flex items-center gap-2"
          >
            <ArrowUpRight className="h-4 w-4" />
            Withdraw
          </Button>
        </div>
      </div>

      {/* Total Balance Card */}
      <Card className="overflow-hidden">
        <CardContent className="p-8 bg-gradient-to-r from-blue-600 to-blue-700 text-white">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-white/20 rounded-full">
                <Wallet className="h-6 w-6" />
              </div>
              <div>
                <h2 className="text-lg font-medium text-blue-100">
                  Total Balance
                </h2>
                <p className="text-blue-200 text-sm">All sources combined</p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setBalanceVisible(!balanceVisible)}
              className="text-white hover:bg-white/20"
            >
              {balanceVisible ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </Button>
          </div>

          <div className="text-center space-y-4">
            <div className="text-5xl font-bold">
              {balanceVisible ? `$${walletBalance.total.toFixed(2)}` : "••••••"}
            </div>
            {earningsGrowth > 0 && (
              <div className="flex items-center justify-center gap-2 text-green-200">
                <TrendingUp className="h-4 w-4" />
                <span className="text-sm">
                  +${earningsGrowth.toFixed(2)} earned this month
                </span>
              </div>
            )}
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
            {walletSources.map((source) => {
              const balance = walletBalance[
                source.id as keyof WalletBalance
              ] as number;
              return (
                <div key={source.id} className="text-center">
                  <div className="text-2xl mb-1">{source.icon}</div>
                  <div className="text-lg font-semibold">
                    {balanceVisible ? `$${balance.toFixed(2)}` : "••••"}
                  </div>
                  <div className="text-xs text-blue-200">{source.name}</div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Tabbed Interface */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-5 h-auto">
          <TabsTrigger
            value="all"
            className="flex flex-col sm:flex-row items-center gap-1 sm:gap-2 text-xs sm:text-sm p-2 sm:p-3"
          >
            <span className="text-lg">💰</span>
            <span className="text-[10px] sm:text-xs">All</span>
          </TabsTrigger>
          {walletSources.map((source) => (
            <TabsTrigger
              key={source.id}
              value={source.id}
              className="flex flex-col sm:flex-row items-center gap-1 sm:gap-2 text-xs sm:text-sm p-2 sm:p-3"
            >
              <span className="text-lg">{source.icon}</span>
              <span className="text-[10px] sm:text-xs text-center leading-tight">
                <span className="sm:hidden">{source.name.split(" ")[0]}</span>
                <span className="hidden sm:inline">{source.name}</span>
              </span>
            </TabsTrigger>
          ))}
        </TabsList>

        {/* All Transactions Tab */}
        <TabsContent value="all" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <span className="text-lg">💰</span>
                  All Transactions
                </span>
                <Badge variant="outline">
                  {allTransactions.length} transactions
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              {allTransactions.length > 0 ? (
                <div className="divide-y divide-gray-100">
                  {allTransactions.slice(0, 10).map((transaction) => (
                    <TransactionItem
                      key={transaction.id}
                      transaction={transaction}
                    />
                  ))}
                </div>
              ) : (
                <div className="p-8 text-center text-gray-500">
                  <div className="text-3xl mb-2">💸</div>
                  <p>No transactions yet</p>
                  <p className="text-sm text-gray-400 mt-1">
                    Your transaction history will appear here
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Individual Source Tabs */}
        {walletSources.map((source) => {
          const sourceTransactions = getTransactionsForSource(source.id);
          const sourceBalance = walletBalance[
            source.id as keyof WalletBalance
          ] as number;

          return (
            <TabsContent key={source.id} value={source.id}>
              <WalletSourceCard
                title={source.name}
                balance={sourceBalance}
                icon={source.icon}
                color={source.color}
                transactions={sourceTransactions}
                onViewAll={() => {
                  // Could implement a detailed transaction modal here
                  toast({
                    title: "View All Transactions",
                    description: `Showing all ${sourceTransactions.length} transactions for ${source.name}`,
                  });
                }}
              />
            </TabsContent>
          );
        })}
      </Tabs>

      {/* Modals */}
      <WithdrawModal
        isOpen={showWithdrawModal}
        onClose={() => setShowWithdrawModal(false)}
        walletBalance={walletBalance}
        onSuccess={refreshData}
      />

      <DepositModal
        isOpen={showDepositModal}
        onClose={() => setShowDepositModal(false)}
        onSuccess={refreshData}
      />
    </div>
  );
};

const UnifiedWalletDashboard = () => {
  return (
    <WalletProvider>
      <WalletDashboardContent />
    </WalletProvider>
  );
};

export default UnifiedWalletDashboard;
