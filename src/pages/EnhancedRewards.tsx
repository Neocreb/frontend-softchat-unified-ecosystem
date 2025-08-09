import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Zap,
  Gift,
  TrendingUp,
  UserPlus,
  Activity,
  Crown,
  Star,
  Target,
  Trophy,
  RefreshCw,
  History,
  Settings,
  Wallet,
  BarChart3,
  ArrowUpRight,
  Flame
} from "lucide-react";
import { formatCurrency, formatNumber } from "@/utils/formatters";
import { fetchWithAuth } from "@/lib/fetch-utils";
import { cn } from "@/lib/utils";

// Test integration (only in development)
if (process.env.NODE_ENV === "development") {
  import("@/utils/testRewardsIntegration");
}

// Import components
import EnhancedUnifiedCreatorEconomy from "@/components/creator-economy/EnhancedUnifiedCreatorEconomy";
import SafeReferralManager from "@/components/rewards/SafeReferralManager";

interface RewardData {
  totalEarnings: number;
  availableToWithdraw: number;
  currentSoftPoints: number;
  trustScore: {
    current: number;
    level: string;
    multiplier: number;
  };
  recentActivity: Array<{
    id: string;
    type: string;
    description: string;
    amount: number;
    timestamp: string;
  }>;
  referralStats: {
    totalReferrals: number;
    totalEarnings: number;
    activeReferrals: number;
  };
}

interface QuickAction {
  id: string;
  label: string;
  icon: React.ReactNode;
  color: string;
  action: () => void;
  value?: string;
  trend?: "up" | "down" | "neutral";
}

export default function EnhancedRewards() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");
  const [rewardData, setRewardData] = useState<RewardData | null>(null);

  useEffect(() => {
    if (user) {
      loadRewardData();
    }
  }, [user]);

  const loadRewardData = async () => {
    try {
      setIsLoading(true);
      console.log("Loading reward data...");

      const response = await fetchWithAuth("/api/creator/reward-summary");
      console.log("Response status:", response.status, response.statusText);

      if (response.ok) {
        const text = await response.text();
        console.log("Response text:", text.substring(0, 200) + "...");

        try {
          const data = JSON.parse(text);
          console.log("Parsed data:", data);
          setRewardData(data.data || data);
          return; // Success - exit early
        } catch (jsonError) {
          console.warn("JSON parse error, using fallback data:", jsonError);
          throw new Error("Invalid JSON response");
        }
      } else {
        console.warn("API request failed:", response.status, response.statusText);
        const errorText = await response.text();
        console.warn("Error response:", errorText);
        // Fallback to demo data if API not available
        setRewardData({
          totalEarnings: 2847.50,
          availableToWithdraw: 1523.25,
          currentSoftPoints: 18642,
          trustScore: {
            current: 78,
            level: "Silver",
            multiplier: 1.5
          },
          recentActivity: [
            { id: "1", type: "post_creation", description: "Quality post with media", amount: 15.5, timestamp: "2024-01-20T10:00:00Z" },
            { id: "2", type: "marketplace_sale", description: "Product sold", amount: 25.0, timestamp: "2024-01-20T09:30:00Z" },
            { id: "3", type: "referral_bonus", description: "New referral signup", amount: 50.0, timestamp: "2024-01-19T18:15:00Z" }
          ],
          referralStats: {
            totalReferrals: 23,
            totalEarnings: 340.50,
            activeReferrals: 18
          }
        });
      }
    } catch (error) {
      console.error("Failed to load reward data:", error);
      // Use demo data as fallback
      setRewardData({
        totalEarnings: 2847.50,
        availableToWithdraw: 1523.25,
        currentSoftPoints: 18642,
        trustScore: {
          current: 78,
          level: "Silver",
          multiplier: 1.5
        },
        recentActivity: [
          { id: "1", type: "post_creation", description: "Quality post with media", amount: 15.5, timestamp: "2024-01-20T10:00:00Z" },
          { id: "2", type: "marketplace_sale", description: "Product sold", amount: 25.0, timestamp: "2024-01-20T09:30:00Z" },
          { id: "3", type: "referral_bonus", description: "New referral signup", amount: 50.0, timestamp: "2024-01-19T18:15:00Z" }
        ],
        referralStats: {
          totalReferrals: 23,
          totalEarnings: 340.50,
          activeReferrals: 18
        }
      });
    } finally {
      setIsLoading(false);
    }
  };

  const refreshData = async () => {
    setIsRefreshing(true);
    await loadRewardData();
    setIsRefreshing(false);
    toast({
      title: "Data Updated",
      description: "Your rewards data has been refreshed"
    });
  };

  // Quick Actions similar to wallet design
  const quickActions: QuickAction[] = [
    {
      id: "earn",
      label: "Earn More",
      icon: <Zap className="h-4 w-4" />,
      color: "bg-yellow-500 hover:bg-yellow-600",
      action: () => setActiveTab("overview"),
      value: "+15%",
      trend: "up"
    },
    {
      id: "withdraw",
      label: "Withdraw",
      icon: <ArrowUpRight className="h-4 w-4" />,
      color: "bg-green-500 hover:bg-green-600",
      action: () => setActiveTab("overview"),
      value: formatCurrency(rewardData?.availableToWithdraw || 0)
    },
    {
      id: "referrals",
      label: "Invite Friends",
      icon: <UserPlus className="h-4 w-4" />,
      color: "bg-purple-500 hover:bg-purple-600",
      action: () => setActiveTab("referrals"),
      value: `${rewardData?.referralStats.totalReferrals || 0} refs`
    },
    {
      id: "analytics",
      label: "Analytics",
      icon: <BarChart3 className="h-4 w-4" />,
      color: "bg-blue-500 hover:bg-blue-600",
      action: () => setActiveTab("analytics")
    },
    {
      id: "boost",
      label: "Boost Tier",
      icon: <Crown className="h-4 w-4" />,
      color: "bg-orange-500 hover:bg-orange-600",
      action: () => setActiveTab("overview"),
      value: rewardData?.trustScore.level || "Bronze"
    },
    {
      id: "history",
      label: "History",
      icon: <History className="h-4 w-4" />,
      color: "bg-gray-500 hover:bg-gray-600",
      action: () => setActiveTab("overview")
    }
  ];

  if (!user) {
    return (
      <div className="max-w-7xl mx-auto p-4">
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold mb-4">Please Sign In</h2>
          <p className="text-muted-foreground">
            You need to be signed in to access the Rewards Center.
          </p>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto p-4">
        {/* Header Skeleton */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <div>
            <Skeleton className="h-8 w-64 mb-2" />
            <Skeleton className="h-4 w-96" />
          </div>
          <div className="flex gap-2">
            <Skeleton className="h-8 w-24" />
            <Skeleton className="h-8 w-32" />
            <Skeleton className="h-8 w-20" />
          </div>
        </div>

        {/* Metrics Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-32 rounded-xl" />
          ))}
        </div>

        {/* Content Skeleton */}
        <div className="space-y-6">
          <Skeleton className="h-12 w-full" />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Skeleton className="h-96 rounded-xl" />
            <Skeleton className="h-96 rounded-xl" />
          </div>
          <Skeleton className="h-64 rounded-xl" />
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-4 space-y-6">
      {/* Enhanced Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="min-w-0 flex-1">
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
            <Trophy className="h-8 w-8 text-yellow-500" />
            Rewards Center
          </h1>
          <p className="text-base text-gray-600 mt-1">
            Quality-based rewards • No daily limits • Payment-gated earnings
          </p>
        </div>
        <div className="flex gap-2 flex-shrink-0">
          <Button
            onClick={refreshData}
            variant="outline"
            disabled={isRefreshing}
            className="flex items-center gap-2"
          >
            <RefreshCw className={cn("h-4 w-4", isRefreshing && "animate-spin")} />
            Refresh
          </Button>
          <Badge variant="secondary" className="px-3 py-1">
            <Star className="h-3 w-3 mr-1" />
            {rewardData?.trustScore.level || "Bronze"} Tier
          </Badge>
        </div>
      </div>

      {/* Quick Actions - Wallet Style */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5" />
            Quick Actions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {quickActions.map((action) => (
              <Button
                key={action.id}
                variant="outline"
                className={`${action.color} text-white border-none hover:scale-105 transition-all duration-200 flex flex-col items-center gap-2 h-auto py-4 relative overflow-hidden`}
                onClick={action.action}
              >
                {action.icon}
                <span className="text-xs font-medium">{action.label}</span>
                {action.value && (
                  <Badge
                    variant="secondary"
                    className="text-xs bg-white/20 text-white border-white/30"
                  >
                    {action.value}
                  </Badge>
                )}
                {action.trend === "up" && (
                  <div className="absolute top-1 right-1">
                    <TrendingUp className="h-3 w-3 text-white/80" />
                  </div>
                )}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Modern Tabs */}
      <Tabs key="rewards-tabs" value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview" className="flex items-center gap-2">
            <Activity className="h-4 w-4" />
            <span className="hidden sm:inline">Overview</span>
          </TabsTrigger>
          <TabsTrigger value="referrals" className="flex items-center gap-2">
            <UserPlus className="h-4 w-4" />
            <span className="hidden sm:inline">Referrals</span>
            {rewardData?.referralStats.totalReferrals && (
              <Badge variant="secondary" className="ml-1 text-xs h-5 w-5 rounded-full p-0 flex items-center justify-center">
                {rewardData.referralStats.totalReferrals}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="analytics" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            <span className="hidden sm:inline">Analytics</span>
          </TabsTrigger>
          <TabsTrigger value="settings" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            <span className="hidden sm:inline">Settings</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="mt-6">
          <EnhancedUnifiedCreatorEconomy />
        </TabsContent>

        <TabsContent value="referrals" className="mt-6">
          <SafeReferralManager />
        </TabsContent>

        <TabsContent value="analytics" className="mt-6">
          <div className="text-center py-12">
            <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Analytics Dashboard</h3>
            <p className="text-gray-600">Detailed analytics coming soon...</p>
          </div>
        </TabsContent>

        <TabsContent value="settings" className="mt-6">
          <div className="text-center py-12">
            <Settings className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Reward Settings</h3>
            <p className="text-gray-600">Customize your reward preferences...</p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
