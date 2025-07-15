import React, { useState } from "react";
import { Helmet } from "react-helmet-async";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import CreatorEconomyDashboard from "@/components/creator/CreatorEconomyDashboard";
import { PartnershipSystem } from "@/components/rewards/PartnershipSystem";
import { DollarSign, Users, Handshake, TrendingUp, Coins } from "lucide-react";

const EnhancedRewards: React.FC = () => {
  const [activeTab, setActiveTab] = useState("economy");

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Helmet>
        <title>Creator Economy | Softchat</title>
        <meta
          name="description"
          content="Manage your creator earnings, SoftPoints, monetization and partnerships on Softchat"
        />
      </Helmet>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-blue-500 rounded-lg flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold">
                Creator Economy
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Monetize your content, track earnings, and grow your creator
                business
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="text-right">
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Platform
              </div>
              <div className="font-semibold text-lg">Softchat</div>
            </div>
          </div>
        </div>

        {/* Main Content Tabs */}
        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="space-y-6"
        >
          <div className="w-full overflow-x-auto">
            <TabsList className="grid w-full grid-cols-2 lg:w-auto lg:grid-cols-2 min-w-fit">
              <TabsTrigger
                value="economy"
                className="flex items-center gap-2 text-sm sm:text-base"
              >
                <Coins className="w-4 h-4" />
                <span className="hidden sm:inline">Creator Economy</span>
                <span className="sm:hidden">Economy</span>
              </TabsTrigger>
              <TabsTrigger
                value="partnerships"
                className="flex items-center gap-2 text-sm sm:text-base"
              >
                <Handshake className="w-4 h-4" />
                <span className="hidden sm:inline">
                  Partnerships & Affiliates
                </span>
                <span className="sm:hidden">Partners</span>
              </TabsTrigger>
            </TabsList>
          </div>

          {/* Creator Economy Tab */}
          <TabsContent value="economy" className="space-y-6">
            <CreatorEconomyDashboard />
          </TabsContent>

          {/* Partnerships Tab */}
          <TabsContent value="partnerships" className="space-y-6">
            <div className="mb-6">
              <h2 className="text-xl font-bold mb-2">
                Partnerships & Affiliate Programs
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                Collaborate with brands, promote products, and earn through
                affiliate partnerships
              </p>
            </div>
            <PartnershipSystem />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default EnhancedRewards;
