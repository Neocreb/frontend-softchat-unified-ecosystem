import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  DollarSign,
  TrendingUp,
  Eye,
  Gift,
  Users,
  Zap,
  RefreshCw,
  ArrowUpRight,
  Star,
  Trophy,
} from "lucide-react";
import { formatCurrency, formatNumber } from "@/utils/formatters";

interface EarningsOverviewProps {
  revenueData: any;
  user: any;
  setActiveTab: (tab: string) => void;
  onRefresh: () => void;
}

const EarningsOverview = ({
  revenueData,
  user,
  setActiveTab,
  onRefresh,
}: EarningsOverviewProps) => {
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await onRefresh();
    setTimeout(() => setIsRefreshing(false), 1000);
  };

  const earningsCards = [
    {
      title: "Total Earnings",
      value: revenueData?.totalEarnings || 0,
      format: "currency",
      icon: DollarSign,
      color: "text-green-600",
      bgColor: "bg-green-100",
      change: "+15.8%",
      changeType: "positive" as const,
    },
    {
      title: "SoftPoints",
      value: revenueData?.softPointsEarned || 0,
      format: "number",
      icon: Star,
      color: "text-purple-600",
      bgColor: "bg-purple-100",
      change: "+23.5%",
      changeType: "positive" as const,
    },
    {
      title: "Available to Withdraw",
      value: revenueData?.availableToWithdraw || 0,
      format: "currency",
      icon: ArrowUpRight,
      color: "text-blue-600",
      bgColor: "bg-blue-100",
      change: "+12.3%",
      changeType: "positive" as const,
    },
    {
      title: "Tips Received",
      value: revenueData?.earningsByType?.tips || 0,
      format: "currency",
      icon: Gift,
      color: "text-pink-600",
      bgColor: "bg-pink-100",
      change: "+8.7%",
      changeType: "positive" as const,
    },
  ];

  const revenueBreakdown = [
    {
      source: "Subscriptions",
      amount: revenueData?.earningsByType?.subscriptions || 0,
      percentage: Math.round(
        ((revenueData?.earningsByType?.subscriptions || 0) /
          (revenueData?.totalEarnings || 1)) *
          100,
      ),
      icon: Users,
      color: "bg-blue-500",
    },
    {
      source: "Tips",
      amount: revenueData?.earningsByType?.tips || 0,
      percentage: Math.round(
        ((revenueData?.earningsByType?.tips || 0) /
          (revenueData?.totalEarnings || 1)) *
          100,
      ),
      icon: Gift,
      color: "bg-pink-500",
    },
    {
      source: "View Rewards",
      amount: revenueData?.earningsByType?.views || 0,
      percentage: Math.round(
        ((revenueData?.earningsByType?.views || 0) /
          (revenueData?.totalEarnings || 1)) *
          100,
      ),
      icon: Eye,
      color: "bg-green-500",
    },
    {
      source: "Services",
      amount: revenueData?.earningsByType?.services || 0,
      percentage: Math.round(
        ((revenueData?.earningsByType?.services || 0) /
          (revenueData?.totalEarnings || 1)) *
          100,
      ),
      icon: Zap,
      color: "bg-yellow-500",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Earnings Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {earningsCards.map((card) => {
          const Icon = card.icon;
          const changeColorClass =
            card.changeType === "positive" ? "text-green-600" : "text-red-600";
          return (
            <Card
              key={card.title}
              className="hover:shadow-lg transition-shadow"
            >
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      {card.title}
                    </p>
                    <p className="text-2xl font-bold">
                      {card.format === "currency"
                        ? formatCurrency(card.value)
                        : formatNumber(card.value)}
                    </p>
                    <p
                      className={`text-xs flex items-center gap-1 mt-1 ${changeColorClass}`}
                    >
                      <TrendingUp className="w-3 h-3" />
                      {card.change}
                    </p>
                  </div>
                  <div className={`p-3 rounded-full ${card.bgColor}`}>
                    <Icon className={`w-6 h-6 ${card.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Breakdown */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Revenue Breakdown</CardTitle>
            <Button
              variant="outline"
              size="sm"
              onClick={handleRefresh}
              disabled={isRefreshing}
            >
              <RefreshCw
                className={`w-4 h-4 mr-2 ${isRefreshing ? "animate-spin" : ""}`}
              />
              Refresh
            </Button>
          </CardHeader>
          <CardContent className="space-y-4">
            {revenueBreakdown.map((item) => {
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
                      <p className="text-xs text-muted-foreground">
                        {item.percentage}% of total
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">{formatCurrency(item.amount)}</p>
                    <Progress
                      value={item.percentage}
                      className="w-16 h-2 mt-1"
                    />
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button
              onClick={() => setActiveTab("withdraw")}
              className="w-full justify-start gap-3 h-12"
              variant="outline"
            >
              <ArrowUpRight className="w-5 h-5" />
              <div className="text-left">
                <p className="font-medium">Withdraw Earnings</p>
                <p className="text-xs text-muted-foreground">
                  {formatCurrency(revenueData?.availableToWithdraw || 0)}{" "}
                  available
                </p>
              </div>
            </Button>

            <Button
              onClick={() => setActiveTab("boosts")}
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

            <Button
              onClick={() => setActiveTab("content")}
              className="w-full justify-start gap-3 h-12"
              variant="outline"
            >
              <TrendingUp className="w-5 h-5" />
              <div className="text-left">
                <p className="font-medium">Monetized Content</p>
                <p className="text-xs text-muted-foreground">
                  View your earning content
                </p>
              </div>
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Creator Program Status */}
      <Card className="bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-purple-100 rounded-full">
                <Trophy className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <h3 className="font-semibold text-purple-900">
                  Creator Program Member
                </h3>
                <p className="text-sm text-purple-700">
                  You're earning through the Softchat Creator Economy
                </p>
                <div className="flex items-center gap-4 mt-2">
                  <Badge
                    variant="secondary"
                    className="bg-purple-100 text-purple-800"
                  >
                    Active Status
                  </Badge>
                  <Badge
                    variant="secondary"
                    className="bg-green-100 text-green-800"
                  >
                    Tier: Gold
                  </Badge>
                </div>
              </div>
            </div>
            <Button
              onClick={() => setActiveTab("partnerships")}
              className="bg-purple-600 hover:bg-purple-700"
            >
              View Partnerships
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default EarningsOverview;
