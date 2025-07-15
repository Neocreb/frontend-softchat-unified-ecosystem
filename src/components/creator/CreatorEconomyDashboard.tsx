import React, { useState, useEffect } from "react";
import {
  DollarSign,
  TrendingUp,
  TrendingDown,
  Eye,
  Gift,
  Users,
  Coins,
  Award,
  Zap,
  CreditCard,
  Download,
  RefreshCw,
  Calendar,
  BarChart3,
  PieChart,
  ArrowUpRight,
  ArrowDownRight,
  Clock,
  Target,
  Flame,
  Star,
  Crown,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { formatDistanceToNow } from "date-fns";
import {
  softPointsService,
  SoftPointsService,
} from "@/services/softPointsService";
import { api } from "@/lib/api";

interface RevenueData {
  totalEarnings: number;
  earningsByType: {
    tips: number;
    subscriptions: number;
    views: number;
    boosts: number;
    services: number;
  };
  softPointsEarned: number;
  softPointsBalance: number;
  availableToWithdraw: number;
  period: {
    startDate: string;
    endDate: string;
    days: number;
  };
}

interface ChartData {
  labels: string[];
  tips: number[];
  subscriptions: number[];
  viewsSP: number[];
}

interface ContentPerformance {
  id: string;
  contentId: string;
  contentType: string;
  title: string;
  totalViews: number;
  totalRevenue: number;
  totalSoftPoints: number;
  totalTips: number;
  tipCount: number;
  publishedAgo: string;
  isMonetized: boolean;
  isBoosted: boolean;
}

interface CreatorTier {
  currentTier: string;
  previousTier?: string;
  totalRevenue: number;
  totalViews: number;
  totalSubscribers: number;
  revenueBonus: number;
  softPointsMultiplier: number;
  progress?: {
    nextTier: string;
    requirements: {
      revenue: number;
      views: number;
      subscribers: number;
    };
    current: {
      revenue: number;
      views: number;
      subscribers: number;
    };
    percentages: {
      revenue: number;
      views: number;
      subscribers: number;
    };
  };
}

const CreatorEconomyDashboard: React.FC = () => {
  const [revenueData, setRevenueData] = useState<RevenueData | null>(null);
  const [chartData, setChartData] = useState<ChartData | null>(null);
  const [contentPerformance, setContentPerformance] = useState<
    ContentPerformance[]
  >([]);
  const [creatorTier, setCreatorTier] = useState<CreatorTier | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [timeRange, setTimeRange] = useState("30d");
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    loadDashboardData();
  }, [timeRange]);

  const loadDashboardData = async () => {
    setIsLoading(true);
    try {
      await Promise.all([
        loadRevenueData(),
        loadChartData(),
        loadContentPerformance(),
        loadCreatorTier(),
      ]);
    } catch (error) {
      console.error("Error loading dashboard data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadRevenueData = async () => {
    try {
      const response = await api.get("/api/creator/revenue/summary");
      setRevenueData(response.data);
    } catch (error) {
      console.error("Error loading revenue data:", error);
    }
  };

  const loadChartData = async () => {
    try {
      const response = await api.get("/api/creator/revenue/chart-data", {
        params: { period: timeRange },
      });
      setChartData(response.data);
    } catch (error) {
      console.error("Error loading chart data:", error);
    }
  };

  const loadContentPerformance = async () => {
    try {
      const response = await api.get("/api/creator/content/monetized", {
        params: { limit: 10 },
      });
      setContentPerformance(response.data.content || []);
    } catch (error) {
      console.error("Error loading content performance:", error);
    }
  };

  const loadCreatorTier = async () => {
    try {
      const response = await api.get("/api/creator/tier/current");
      setCreatorTier(response.data);
    } catch (error) {
      console.error("Error loading creator tier:", error);
    }
  };

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const formatNumber = (num: number): string => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + "M";
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + "K";
    }
    return num.toString();
  };

  const getTierIcon = (tier: string) => {
    switch (tier.toLowerCase()) {
      case "bronze":
        return <Award className="w-4 h-4 text-orange-600" />;
      case "silver":
        return <Award className="w-4 h-4 text-gray-400" />;
      case "gold":
        return <Award className="w-4 h-4 text-yellow-500" />;
      case "platinum":
        return <Crown className="w-4 h-4 text-purple-500" />;
      case "diamond":
        return <Star className="w-4 h-4 text-blue-500" />;
      default:
        return <Award className="w-4 h-4 text-gray-400" />;
    }
  };

  const getTierColor = (tier: string) => {
    switch (tier.toLowerCase()) {
      case "bronze":
        return "bg-orange-100 text-orange-800";
      case "silver":
        return "bg-gray-100 text-gray-800";
      case "gold":
        return "bg-yellow-100 text-yellow-800";
      case "platinum":
        return "bg-purple-100 text-purple-800";
      case "diamond":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getChangeIndicator = (current: number, previous: number) => {
    if (!previous) return null;
    const change = ((current - previous) / previous) * 100;
    const isPositive = change > 0;

    return (
      <div
        className={cn(
          "flex items-center gap-1 text-sm",
          isPositive ? "text-green-500" : "text-red-500",
        )}
      >
        {isPositive ? (
          <ArrowUpRight className="w-3 h-3" />
        ) : (
          <ArrowDownRight className="w-3 h-3" />
        )}
        <span>{Math.abs(change).toFixed(1)}%</span>
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <Card key={i}>
                <CardContent className="p-6">
                  <div className="space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                    <div className="h-8 bg-gray-200 rounded w-3/4"></div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-blue-500 rounded-lg flex items-center justify-center">
            <DollarSign className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold">Creator Economy</h2>
            <p className="text-gray-600 dark:text-gray-400">
              Manage your earnings, SoftPoints, and monetization
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="90d">Last 3 months</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="sm" onClick={loadDashboardData}>
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="space-y-6"
      >
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="earnings">Earnings</TabsTrigger>
          <TabsTrigger value="content">Content</TabsTrigger>
          <TabsTrigger value="softpoints">SoftPoints</TabsTrigger>
          <TabsTrigger value="growth">Growth</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <DollarSign className="w-4 h-4 text-green-500" />
                    <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                      Total Earnings
                    </span>
                  </div>
                </div>
                <div className="text-2xl font-bold">
                  {formatCurrency(revenueData?.totalEarnings || 0)}
                </div>
                <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                  Last {revenueData?.period.days} days
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Coins className="w-4 h-4 text-blue-500" />
                    <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                      SoftPoints
                    </span>
                  </div>
                </div>
                <div className="text-2xl font-bold">
                  {SoftPointsService.formatSoftPoints(
                    revenueData?.softPointsBalance || 0,
                  )}
                </div>
                <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                  Current balance
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <CreditCard className="w-4 h-4 text-purple-500" />
                    <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                      Available
                    </span>
                  </div>
                </div>
                <div className="text-2xl font-bold">
                  {formatCurrency(revenueData?.availableToWithdraw || 0)}
                </div>
                <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                  Ready for withdrawal
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    {creatorTier && getTierIcon(creatorTier.currentTier)}
                    <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                      Creator Tier
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2 mb-1">
                  <Badge
                    className={cn(
                      "text-xs",
                      getTierColor(creatorTier?.currentTier || "bronze"),
                    )}
                  >
                    {creatorTier?.currentTier?.toUpperCase() || "BRONZE"}
                  </Badge>
                  {creatorTier?.revenueBonus &&
                    creatorTier.revenueBonus > 0 && (
                      <Badge variant="secondary" className="text-xs">
                        +{creatorTier.revenueBonus}% bonus
                      </Badge>
                    )}
                </div>
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  {creatorTier?.progress
                    ? `${Math.round(Math.min(...Object.values(creatorTier.progress.percentages)))}% to ${creatorTier.progress.nextTier}`
                    : "Maximum tier reached"}
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Revenue Breakdown */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <PieChart className="w-5 h-5" />
                  Revenue Breakdown
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {revenueData &&
                    Object.entries(revenueData.earningsByType).map(
                      ([type, amount]) => {
                        const percentage =
                          revenueData.totalEarnings > 0
                            ? (amount / revenueData.totalEarnings) * 100
                            : 0;

                        return (
                          <div
                            key={type}
                            className="flex items-center justify-between"
                          >
                            <div className="flex items-center gap-3">
                              <div
                                className={cn(
                                  "w-3 h-3 rounded-full",
                                  type === "tips" && "bg-green-500",
                                  type === "subscriptions" && "bg-blue-500",
                                  type === "views" && "bg-purple-500",
                                  type === "boosts" && "bg-orange-500",
                                  type === "services" && "bg-pink-500",
                                )}
                              />
                              <span className="text-sm font-medium capitalize">
                                {type}
                              </span>
                            </div>
                            <div className="text-right">
                              <div className="text-sm font-medium">
                                {formatCurrency(amount)}
                              </div>
                              <div className="text-xs text-gray-500">
                                {percentage.toFixed(1)}%
                              </div>
                            </div>
                          </div>
                        );
                      },
                    )}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Flame className="w-5 h-5" />
                  Top Performing Content
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {contentPerformance.slice(0, 5).map((content, index) => (
                    <div
                      key={content.id}
                      className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800"
                    >
                      <div className="text-sm font-medium text-gray-500 w-6">
                        #{index + 1}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-medium text-sm line-clamp-1">
                            {content.title || `${content.contentType} content`}
                          </span>
                          <Badge variant="outline" className="text-xs">
                            {content.contentType}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-4 text-xs text-gray-600 dark:text-gray-400">
                          <span className="flex items-center gap-1">
                            <Eye className="w-3 h-3" />
                            {formatNumber(content.totalViews)}
                          </span>
                          <span className="flex items-center gap-1">
                            <DollarSign className="w-3 h-3" />
                            {formatCurrency(content.totalRevenue)}
                          </span>
                          <span className="flex items-center gap-1">
                            <Coins className="w-3 h-3" />
                            {formatNumber(content.totalSoftPoints)}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Button className="flex items-center gap-2" variant="outline">
                  <Download className="w-4 h-4" />
                  Request Withdrawal
                </Button>
                <Button className="flex items-center gap-2" variant="outline">
                  <Zap className="w-4 h-4" />
                  Boost Content
                </Button>
                <Button className="flex items-center gap-2" variant="outline">
                  <BarChart3 className="w-4 h-4" />
                  View Analytics
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Other tabs would go here... */}
        <TabsContent value="earnings">
          <Card>
            <CardHeader>
              <CardTitle>Detailed Earnings</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 dark:text-gray-400">
                Detailed earnings view coming soon...
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="content">
          <Card>
            <CardHeader>
              <CardTitle>Monetized Content</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 dark:text-gray-400">
                Content monetization dashboard coming soon...
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="softpoints">
          <Card>
            <CardHeader>
              <CardTitle>SoftPoints Management</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {/* SoftPoints Balance */}
                <div className="text-center p-6 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-lg">
                  <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                    {SoftPointsService.formatSoftPoints(
                      revenueData?.softPointsBalance || 0,
                    )}
                  </div>
                  <p className="text-gray-600 dark:text-gray-400 mt-1">
                    Current SoftPoints Balance
                  </p>
                  <p className="text-sm text-gray-500 mt-2">
                    ≈{" "}
                    {formatCurrency(
                      SoftPointsService.getSoftPointsUSDValue(
                        revenueData?.softPointsBalance || 0,
                      ),
                    )}{" "}
                    USD value
                  </p>
                </div>

                {/* Earning Rules */}
                <div>
                  <h3 className="font-semibold mb-4">How to Earn SoftPoints</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {Object.entries(
                      SoftPointsService.getEarningRules().descriptions,
                    ).map(([key, description]) => (
                      <div key={key} className="p-4 border rounded-lg">
                        <div className="flex items-center gap-2 mb-2">
                          <Coins className="w-4 h-4 text-blue-500" />
                          <span className="font-medium capitalize">{key}</span>
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {description}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="growth">
          <Card>
            <CardHeader>
              <CardTitle>Growth & Progress</CardTitle>
            </CardHeader>
            <CardContent>
              {creatorTier?.progress && (
                <div className="space-y-6">
                  <div>
                    <h3 className="font-semibold mb-4">
                      Progress to{" "}
                      {creatorTier.progress.nextTier.charAt(0).toUpperCase() +
                        creatorTier.progress.nextTier.slice(1)}{" "}
                      Tier
                    </h3>
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between text-sm mb-2">
                          <span>Total Revenue</span>
                          <span>
                            {formatCurrency(
                              creatorTier.progress.current.revenue,
                            )}{" "}
                            /{" "}
                            {formatCurrency(
                              creatorTier.progress.requirements.revenue,
                            )}
                          </span>
                        </div>
                        <Progress
                          value={creatorTier.progress.percentages.revenue}
                        />
                      </div>
                      <div>
                        <div className="flex justify-between text-sm mb-2">
                          <span>Total Views</span>
                          <span>
                            {formatNumber(creatorTier.progress.current.views)} /{" "}
                            {formatNumber(
                              creatorTier.progress.requirements.views,
                            )}
                          </span>
                        </div>
                        <Progress
                          value={creatorTier.progress.percentages.views}
                        />
                      </div>
                      <div>
                        <div className="flex justify-between text-sm mb-2">
                          <span>Subscribers</span>
                          <span>
                            {formatNumber(
                              creatorTier.progress.current.subscribers,
                            )}{" "}
                            /{" "}
                            {formatNumber(
                              creatorTier.progress.requirements.subscribers,
                            )}
                          </span>
                        </div>
                        <Progress
                          value={creatorTier.progress.percentages.subscribers}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CreatorEconomyDashboard;
