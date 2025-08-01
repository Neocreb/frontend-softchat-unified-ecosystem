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
          >
            Deposit
          </Button>
          <Button
            onClick={() => setShowWithdrawModal(true)}
            variant="outline"
            className="border-red-200 text-red-600 hover:bg-red-50"
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
        <div className="overflow-x-auto">
          <TabsList className="grid w-full grid-cols-3 lg:grid-cols-7 min-w-max">
            <TabsTrigger value="overview" className="flex items-center gap-2">
              <Wallet className="h-4 w-4" />
              <span className="hidden sm:inline">Overview</span>
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              <span className="hidden sm:inline">Analytics</span>
            </TabsTrigger>
            <TabsTrigger value="transactions" className="flex items-center gap-2">
              <Search className="h-4 w-4" />
              <span className="hidden sm:inline">Transactions</span>
            </TabsTrigger>
            <TabsTrigger value="security" className="flex items-center gap-2">
              <Shield className="h-4 w-4" />
              <span className="hidden sm:inline">Security</span>
            </TabsTrigger>
            <TabsTrigger value="integrations" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              <span className="hidden sm:inline">Integrations</span>
            </TabsTrigger>
            <TabsTrigger value="receipts" className="flex items-center gap-2">
              <Receipt className="h-4 w-4" />
              <span className="hidden sm:inline">Receipts</span>
            </TabsTrigger>
            <TabsTrigger value="performance" className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              <span className="hidden sm:inline">Performance</span>
            </TabsTrigger>
          </TabsList>
        </div>

        {/* Overview Tab - Enhanced with Quick Actions */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Balance Card */}
            <div className="lg:col-span-2">
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
            <div>
              <QuickActionsWidget />
            </div>
          </div>
        </TabsContent>

        {/* Analytics Tab */}
        <TabsContent value="analytics">
          <WalletAnalyticsDashboard />
        </TabsContent>

        {/* Advanced Transactions Tab */}
        <TabsContent value="transactions">
          <AdvancedTransactionManager />
        </TabsContent>

        {/* Security Center Tab */}
        <TabsContent value="security">
          <WalletSecurityCenter />
        </TabsContent>

        {/* Integrations Tab */}
        <TabsContent value="integrations">
          <IntegrationManager />
        </TabsContent>

        {/* Secure Receipts Tab */}
        <TabsContent value="receipts">
          <SecureReceiptGenerator />
        </TabsContent>

        {/* Performance Tab */}
        <TabsContent value="performance">
          <PerformanceOptimizedWallet />
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
