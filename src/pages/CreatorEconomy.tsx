import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  DollarSign,
  TrendingUp,
  Users,
  Zap,
  BarChart3,
  History,
  Handshake,
  ArrowUpDown,
  Gift,
  Eye,
  Star,
} from "lucide-react";

export default function CreatorEconomy() {
  const [activeTab, setActiveTab] = useState("overview");
  const [revenueData] = useState({
    totalEarnings: 15200,
    earningsByType: {
      tips: 4800,
      subscriptions: 5000,
      views: 2100,
      boosts: 0,
      services: 1300,
    },
    softPointsEarned: 630,
    availableToWithdraw: 9700,
  });

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + "M";
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + "K";
    }
    return num.toString();
  };

  return (
    <div className="max-w-7xl mx-auto p-4">
      {/* Header */}
      <div className="mb-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">Creator Economy</h1>
                <p className="text-muted-foreground">
                  Monetize your content and grow your audience
                </p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge
              variant="outline"
              className="bg-purple-50 text-purple-700 border-purple-200"
            >
              Creator Program
            </Badge>
            <Badge
              variant="outline"
              className="bg-green-50 text-green-700 border-green-200"
            >
              Active
            </Badge>
          </div>
        </div>

        {/* Tab Navigation */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-7">
            <TabsTrigger value="overview" className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4" />
              <span className="hidden sm:inline">Overview</span>
            </TabsTrigger>
            <TabsTrigger value="content" className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              <span className="hidden sm:inline">Content</span>
            </TabsTrigger>
            <TabsTrigger value="boosts" className="flex items-center gap-2">
              <Zap className="w-4 h-4" />
              <span className="hidden sm:inline">Boosts</span>
            </TabsTrigger>
            <TabsTrigger
              value="subscribers"
              className="flex items-center gap-2"
            >
              <Users className="w-4 h-4" />
              <span className="hidden sm:inline">Subscribers</span>
            </TabsTrigger>
            <TabsTrigger value="withdraw" className="flex items-center gap-2">
              <ArrowUpDown className="w-4 h-4" />
              <span className="hidden sm:inline">Withdraw</span>
            </TabsTrigger>
            <TabsTrigger value="history" className="flex items-center gap-2">
              <History className="w-4 h-4" />
              <span className="hidden sm:inline">History</span>
            </TabsTrigger>
            <TabsTrigger
              value="partnerships"
              className="flex items-center gap-2"
            >
              <Handshake className="w-4 h-4" />
              <span className="hidden sm:inline">Partnerships</span>
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6 mt-6">
            {/* Earnings Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">
                        Total Earnings
                      </p>
                      <p className="text-2xl font-bold">
                        {formatCurrency(revenueData.totalEarnings)}
                      </p>
                      <p className="text-xs flex items-center gap-1 mt-1 text-green-600">
                        <TrendingUp className="w-3 h-3" />
                        +15.8%
                      </p>
                    </div>
                    <div className="p-3 rounded-full bg-green-100">
                      <DollarSign className="w-6 h-6 text-green-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">
                        SoftPoints
                      </p>
                      <p className="text-2xl font-bold">
                        {formatNumber(revenueData.softPointsEarned)}
                      </p>
                      <p className="text-xs flex items-center gap-1 mt-1 text-green-600">
                        <TrendingUp className="w-3 h-3" />
                        +23.5%
                      </p>
                    </div>
                    <div className="p-3 rounded-full bg-purple-100">
                      <Star className="w-6 h-6 text-purple-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">
                        Available to Withdraw
                      </p>
                      <p className="text-2xl font-bold">
                        {formatCurrency(revenueData.availableToWithdraw)}
                      </p>
                      <p className="text-xs flex items-center gap-1 mt-1 text-green-600">
                        <TrendingUp className="w-3 h-3" />
                        +12.3%
                      </p>
                    </div>
                    <div className="p-3 rounded-full bg-blue-100">
                      <ArrowUpDown className="w-6 h-6 text-blue-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">
                        Tips Received
                      </p>
                      <p className="text-2xl font-bold">
                        {formatCurrency(revenueData.earningsByType.tips)}
                      </p>
                      <p className="text-xs flex items-center gap-1 mt-1 text-green-600">
                        <TrendingUp className="w-3 h-3" />
                        +8.7%
                      </p>
                    </div>
                    <div className="p-3 rounded-full bg-pink-100">
                      <Gift className="w-6 h-6 text-pink-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Revenue Breakdown */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Revenue Breakdown</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {[
                    {
                      source: "Subscriptions",
                      amount: revenueData.earningsByType.subscriptions,
                      color: "bg-blue-500",
                      icon: Users,
                    },
                    {
                      source: "Tips",
                      amount: revenueData.earningsByType.tips,
                      color: "bg-pink-500",
                      icon: Gift,
                    },
                    {
                      source: "Views",
                      amount: revenueData.earningsByType.views,
                      color: "bg-green-500",
                      icon: Eye,
                    },
                    {
                      source: "Services",
                      amount: revenueData.earningsByType.services,
                      color: "bg-yellow-500",
                      icon: Zap,
                    },
                  ].map((item) => {
                    const Icon = item.icon;
                    return (
                      <div
                        key={item.source}
                        className="flex items-center justify-between"
                      >
                        <div className="flex items-center gap-3">
                          <div className={`p-2 rounded-lg ${item.color}`}>
                            <Icon className="w-4 h-4 text-white" />
                          </div>
                          <div>
                            <p className="font-medium text-sm">{item.source}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">
                            {formatCurrency(item.amount)}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button
                    className="w-full justify-start gap-3 h-12"
                    variant="outline"
                  >
                    <ArrowUpDown className="w-5 h-5" />
                    <div className="text-left">
                      <p className="font-medium">Withdraw Earnings</p>
                      <p className="text-xs text-muted-foreground">
                        {formatCurrency(revenueData.availableToWithdraw)}{" "}
                        available
                      </p>
                    </div>
                  </Button>

                  <Button
                    className="w-full justify-start gap-3 h-12"
                    variant="outline"
                  >
                    <Zap className="w-5 h-5" />
                    <div className="text-left">
                      <p className="font-medium">Boost Content</p>
                      <p className="text-xs text-muted-foreground">
                        Increase your reach and earnings
                      </p>
                    </div>
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Other tabs with placeholder content */}
          {[
            "content",
            "boosts",
            "subscribers",
            "withdraw",
            "history",
            "partnerships",
          ].map((tab) => (
            <TabsContent key={tab} value={tab} className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle className="capitalize">{tab}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8">
                    <p className="text-muted-foreground">
                      {tab.charAt(0).toUpperCase() + tab.slice(1)} features
                      coming soon!
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </div>
  );
}
