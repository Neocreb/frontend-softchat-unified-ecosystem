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
    <div className="mobile-container mobile-space-y">
      {/* Enhanced Header */}
      <div className="mobile-flex sm:items-center sm:justify-between">
        <div className="min-w-0 flex-1">
          <h1 className="text-3xl font-bold text-gray-900">
            Enhanced Wallet Dashboard
          </h1>
          <p className="text-base text-gray-600">
            Complete financial management with advanced security
          </p>
        </div>
      </div>

      {/* Total Balance Card - Now at the top */}
      <Card className="relative overflow-hidden transition-all duration-300 hover:shadow-xl hover:scale-[1.01] bg-gradient-to-br from-blue-600 via-purple-600 to-blue-700 border-0 text-white w-full max-w-5xl mx-auto">
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-4 -right-4 w-24 h-24 bg-white/10 rounded-full" />
          <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-white/5 rounded-full" />
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-transparent via-white/5 to-transparent animate-pulse" />
        </div>

        <CardContent className="relative z-10 p-4 sm:p-6 lg:p-8">
          {/* Header Row */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <div className="flex items-center gap-3">
              <div className="relative">
                <Wallet className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
                <TrendingUp className="absolute -top-1 -right-1 h-3 w-3 sm:h-4 sm:w-4 text-green-300" />
              </div>
              <div>
                <h2 className="text-lg sm:text-xl font-bold text-white">SoftChat Wallet</h2>
                <p className="text-white/80 text-sm">Total Balance</p>
              </div>
            </div>
            <Badge className="bg-white/20 text-white border-white/30 self-start sm:self-center">
              <Shield className="h-4 w-4 mr-1" />
              Secure
            </Badge>
          </div>

          {/* Main Content Row */}
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            {/* Left: Balance Display */}
            <div className="text-center lg:text-left">
              <div className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-2">
                ${walletBalance?.total.toFixed(2) || "0.00"}
              </div>

              {/* Action Buttons - Mobile/Tablet */}
              <div className="flex gap-3 justify-center lg:justify-start mt-4 lg:mt-6">
                <Button
                  onClick={() => setShowDepositModal(true)}
                  className="bg-white/20 hover:bg-white/30 text-white border border-white/30 backdrop-blur-sm transition-all duration-200 hover:scale-105"
                  data-action="deposit"
                >
                  <ArrowUpDown className="h-4 w-4 mr-2" />
                  Deposit
                </Button>
                <Button
                  onClick={() => setShowWithdrawModal(true)}
                  className="bg-white/20 hover:bg-white/30 text-white border border-white/30 backdrop-blur-sm transition-all duration-200 hover:scale-105"
                  data-action="withdraw"
                >
                  <Wallet className="h-4 w-4 mr-2" />
                  Withdraw
                </Button>
              </div>
            </div>

            {/* Right: Quick Stats Grid */}
            <div className="flex-1 max-w-lg">
              <div className="grid grid-cols-2 gap-3 sm:gap-4">
                {[
                  { name: "E-commerce", value: walletBalance?.ecommerce || 0 },
                  { name: "Crypto", value: walletBalance?.crypto || 0 },
                  { name: "Rewards", value: walletBalance?.rewards || 0 },
                  { name: "Freelance", value: walletBalance?.freelance || 0 },
                ].map((source) => (
                  <div key={source.name} className="text-center lg:text-left bg-white/10 rounded-lg p-3">
                    <div className="text-base sm:text-lg font-semibold text-white">
                      ${source.value.toFixed(2)}
                    </div>
                    <div className="text-xs text-white/70">
                      {source.name}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Bottom info */}
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 border-t border-white/20 pt-3 mt-6">
            <div className="text-white/60 text-xs font-mono">
              **** **** **** {String(Math.round(walletBalance?.total || 0)).slice(-4)}
            </div>
            <div className="text-white/60 text-xs">
              Last Updated: {new Date().toLocaleTimeString()}
            </div>
          </div>
        </CardContent>
      </Card>

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

        {/* Overview Tab - Now simplified since balance is already shown at top */}
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
            <h2 className="text-2xl font-bold text-gray-900">Transaction Management</h2>
            <p className="text-gray-600">View, filter, and generate secure receipts for your transactions</p>
          </div>
          <AdvancedTransactionManager />
        </TabsContent>

        {/* Currency Conversion Tab */}
        <TabsContent value="currency" className="space-y-6">
          <div className="mb-4">
            <h2 className="text-2xl font-bold text-gray-900">Currency Conversion</h2>
            <p className="text-gray-600">Real-time currency rates and conversion tools for all your financial needs</p>
          </div>
          <CurrencyDemo />
        </TabsContent>

        {/* Security Center Tab */}
        <TabsContent value="security" className="space-y-6">
          <div className="mb-4">
            <h2 className="text-2xl font-bold text-gray-900">Security Center</h2>
            <p className="text-gray-600">Manage your account security and verification settings</p>
          </div>
          <WalletSecurityCenter />
        </TabsContent>

        {/* Integrations Tab */}
        <TabsContent value="integrations" className="space-y-6">
          <div className="mb-4">
            <h2 className="text-2xl font-bold text-gray-900">Financial Integrations</h2>
            <p className="text-gray-600">Connect banks, manage bills, and track subscriptions</p>
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
