import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { WalletProvider, useWalletContext } from "@/contexts/WalletContext";
import {
  Wallet,
  BarChart3,
  Search,
  Shield,
  Zap,
  Settings,
  Receipt,
  TrendingUp,
  ArrowUpDown,
} from "lucide-react";

// Import all the new components
import WalletAnalyticsDashboard from "./WalletAnalyticsDashboard";
import AdvancedTransactionManager from "./AdvancedTransactionManager";
import WalletSecurityCenter from "./WalletSecurityCenter";
import QuickActionsWidget from "./QuickActionsWidget";
import IntegrationManager from "./IntegrationManager";
import CryptoWalletBalanceCard from "@/components/crypto/CryptoWalletBalanceCard";

// Original components
import WithdrawModal from "./WithdrawModal";
import DepositModal from "./DepositModal";

// Currency components
import CurrencyDemo from "@/components/currency/CurrencyDemo";

const EnhancedWalletDashboardContent = () => {
  const {
    walletBalance,
    isLoading,
    refreshWallet,
  } = useWalletContext();

  const [activeTab, setActiveTab] = useState("overview");
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [showDepositModal, setShowDepositModal] = useState(false);

  // Calculate dynamic wallet metrics
  const totalBalance = walletBalance?.total || 1247.89;
  const yesterdayBalance = totalBalance * 0.97; // Simulate yesterday's balance
  const change24h = totalBalance - yesterdayBalance;
  const changePercent = ((change24h / yesterdayBalance) * 100);
  const cryptoBalance = walletBalance?.crypto || 567.89;
  const btcAmount = cryptoBalance / 42000; // Approximate BTC price

  if (isLoading) {
    return (
      <div className="mobile-container mobile-space-y">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 rounded w-1/3"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="h-32 bg-gray-200 rounded"></div>
            <div className="h-32 bg-gray-200 rounded"></div>
            <div className="h-32 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mobile-container mobile-space-y bg-platform min-h-screen">
      {/* Header */}
      <div className="text-center sm:text-left">
        <h1 className="text-2xl font-bold text-foreground">
          Wallet
        </h1>
      </div>

      {/* Enhanced Professional Balance Card */}
      <CryptoWalletBalanceCard
        totalBalance={walletBalance?.total || 1247.89}
        totalBalance24hChange={87.43}
        totalBalance24hPercent={3.24}
        primaryAsset={{
          symbol: "BTC",
          balance: 0.0234,
          value: (walletBalance?.crypto || 567.89)
        }}
        onDeposit={() => setShowDepositModal(true)}
        onWithdraw={() => setShowWithdrawModal(true)}
      />


      {/* Main Tabbed Interface */}
      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="space-y-6"
      >
        {/* Responsive Tab Navigation */}
        <div className="w-full">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8 overflow-x-auto scrollbar-hide" aria-label="Tabs">
              {[
                { id: "overview", label: "Overview", icon: Wallet, description: "Wallet summary" },
                { id: "analytics", label: "Analytics", icon: BarChart3, description: "Performance insights" },
                { id: "transactions", label: "Transactions", icon: Search, description: "Transaction history & receipts" },
                { id: "currency", label: "Currency", icon: ArrowUpDown, description: "Real-time currency conversion" },
                { id: "security", label: "Security", icon: Shield, description: "Security settings" },
                { id: "integrations", label: "Integrations", icon: Settings, description: "Bank & bill management" },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`
                    whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex flex-col items-center gap-1 min-w-20
                    ${activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }
                  `}
                  aria-current={activeTab === tab.id ? 'page' : undefined}
                >
                  <tab.icon className="h-5 w-5" />
                  <span className="text-xs font-medium">{tab.label}</span>
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Overview Tab - Enhanced with unified layout */}
        <TabsContent value="overview" className="space-y-6">
          {/* Quick Actions Section */}
          <QuickActionsWidget />
        </TabsContent>

        {/* Analytics Tab - Enhanced with Performance Metrics */}
        <TabsContent value="analytics" className="space-y-6">
          <WalletAnalyticsDashboard />
        </TabsContent>

        {/* Advanced Transactions Tab - Now includes receipt generation */}
        <TabsContent value="transactions" className="space-y-6">
          <div className="mb-4">
            <h2 className="text-2xl font-bold text-foreground">Transaction Management</h2>
            <p className="text-muted-foreground">View, filter, and generate secure receipts for your transactions</p>
          </div>
          <AdvancedTransactionManager />
        </TabsContent>

        {/* Currency Conversion Tab */}
        <TabsContent value="currency" className="space-y-6">
          <div className="mb-4">
            <h2 className="text-2xl font-bold text-foreground">Currency Conversion</h2>
            <p className="text-muted-foreground">Real-time currency rates and conversion tools for all your financial needs</p>
          </div>
          <CurrencyDemo />
        </TabsContent>

        {/* Security Center Tab */}
        <TabsContent value="security" className="space-y-6">
          <div className="mb-4">
            <h2 className="text-2xl font-bold text-foreground">Security Center</h2>
            <p className="text-muted-foreground">Manage your account security and verification settings</p>
          </div>
          <WalletSecurityCenter />
        </TabsContent>

        {/* Integrations Tab */}
        <TabsContent value="integrations" className="space-y-6">
          <div className="mb-4">
            <h2 className="text-2xl font-bold text-foreground">Financial Integrations</h2>
            <p className="text-muted-foreground">Connect banks, manage bills, and track subscriptions</p>
          </div>
          <IntegrationManager />
        </TabsContent>
      </Tabs>

      {/* Modals */}
      <WithdrawModal
        isOpen={showWithdrawModal}
        onClose={() => setShowWithdrawModal(false)}
        walletBalance={walletBalance}
        onSuccess={refreshWallet}
      />

      <DepositModal
        isOpen={showDepositModal}
        onClose={() => setShowDepositModal(false)}
        onSuccess={refreshWallet}
      />
    </div>
  );
};

const EnhancedUnifiedWalletDashboard = () => {
  return (
    <WalletProvider>
      <EnhancedWalletDashboardContent />
    </WalletProvider>
  );
};

export default EnhancedUnifiedWalletDashboard;
