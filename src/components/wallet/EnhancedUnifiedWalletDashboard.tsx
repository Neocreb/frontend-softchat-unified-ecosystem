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
        <div className="flex gap-2 flex-shrink-0">
          <Button
            onClick={() => setShowDepositModal(true)}
            className="bg-green-600 hover:bg-green-700"
            data-action="deposit"
          >
            Deposit
          </Button>
          <Button
            onClick={() => setShowWithdrawModal(true)}
            variant="outline"
            className="border-red-200 text-red-600 hover:bg-red-50"
            data-action="withdraw"
          >
            Withdraw
          </Button>
        </div>
      </div>

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

        {/* Overview Tab - Enhanced with Quick Actions */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
            {/* Main Balance Card */}
            <div className="xl:col-span-3">
              <Card className="overflow-hidden">
                <CardContent className="p-6 md:p-8 bg-gradient-to-r from-blue-600 to-blue-700 text-white">
                  <div className="text-center space-y-4">
                    <div>
                      <h2 className="text-lg font-medium text-blue-100">
                        Total Balance
                      </h2>
                      <div className="text-4xl md:text-5xl font-bold">
                        ${walletBalance?.total.toFixed(2) || "0.00"}
                      </div>
                    </div>

                    {/* Quick Stats */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6">
                      {[
                        { name: "E-commerce", value: walletBalance?.ecommerce || 0 },
                        { name: "Crypto", value: walletBalance?.crypto || 0 },
                        { name: "Rewards", value: walletBalance?.rewards || 0 },
                        { name: "Freelance", value: walletBalance?.freelance || 0 },
                      ].map((source) => (
                        <div key={source.name} className="text-center">
                          <div className="text-lg md:text-xl font-semibold">
                            ${source.value.toFixed(2)}
                          </div>
                          <div className="text-xs text-blue-200">
                            {source.name}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Quick Actions Sidebar */}
            <div className="xl:col-span-1">
              <QuickActionsWidget />
            </div>
          </div>
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
