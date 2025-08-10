import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Trophy,
  RefreshCw,
  Star,
  UserPlus,
  BarChart3,
  Settings,
  Activity,
  Gift,
  Target,
  Wallet,
  Swords,
  ArrowRight
} from "lucide-react";
import { formatCurrency, formatNumber } from "@/utils/formatters";
import { fetchWithAuth } from "@/lib/fetch-utils";
import { cn } from "@/lib/utils";

// Test integration (only in development)
if (typeof window !== "undefined" && process.env.NODE_ENV === "development") {
  import("@/utils/testRewardsIntegration").catch(console.warn);
}

// Import new organized components
import RewardsCard from "@/components/rewards/RewardsCard";
import WithdrawalModal from "@/components/rewards/WithdrawalModal";
import RewardsStats from "@/components/rewards/RewardsStats";
import RewardsActivitiesTab from "@/components/rewards/RewardsActivitiesTab";
import RewardsChallengesTab from "@/components/rewards/RewardsChallengesTab";
import RewardsBattleTab from "@/components/rewards/RewardsBattleTab";
import SafeReferralManager from "@/components/rewards/SafeReferralManager";

interface RewardData {
  totalEarnings: number;
  availableToWithdraw: number;
  currentSoftPoints: number;
  trustScore: {
    current: number;
    level: string;
    multiplier: number;
    nextLevelAt: number;
  };
  activityStats: {
    totalActivities: number;
    contentCreated: number;
    qualityScore: number;
    streakDays: number;
  };
  earningsByType: {
    contentCreation: number;
    engagement: number;
    marketplace: number;
    freelance: number;
    p2pTrading: number;
    referrals: number;
    challenges: number;
    battleVoting: number;
    battleRewards: number;
    giftsAndTips: number;
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


// Demo data function to avoid duplication
const getDemoData = (): RewardData => ({
  totalEarnings: 3525.05,
  availableToWithdraw: 1523.25,
  currentSoftPoints: 18642,
  trustScore: {
    current: 78,
    level: "Silver",
    multiplier: 1.5,
    nextLevelAt: 90
  },
  activityStats: {
    totalActivities: 1456,
    contentCreated: 89,
    qualityScore: 1.8,
    streakDays: 12
  },
  earningsByType: {
    contentCreation: 1068.75, // 32.1%
    engagement: 355.94,       // 10.7%
    marketplace: 711.88,      // 21.4%
    freelance: 533.91,        // 16.1%
    p2pTrading: 106.78,       // 3.2%
    referrals: 71.19,         // 2.1%
    challenges: 0,            // 0%
    battleVoting: 285.50,     // 8.6% - earnings from voting on battles
    battleRewards: 178.25,    // 5.4% - rewards from battle participation
    giftsAndTips: 213.80      // 6.4% - earnings from gifts and tips
  },
  recentActivity: [
    { id: "1", type: "post_creation", description: "Quality post with media", amount: 15.5, timestamp: "2024-01-20T10:00:00Z" },
    { id: "2", type: "marketplace_sale", description: "Product sold", amount: 25.0, timestamp: "2024-01-20T09:30:00Z" },
    { id: "3", type: "referral_bonus", description: "New referral signup", amount: 50.0, timestamp: "2024-01-19T18:15:00Z" },
    { id: "4", type: "battle_voting_win", description: "Won battle vote on Alex Dance vs Music Mike", amount: 87.50, timestamp: "2024-01-20T08:45:00Z" },
    { id: "5", type: "battle_participation", description: "Battle performance bonus", amount: 32.25, timestamp: "2024-01-20T08:30:00Z" },
    { id: "6", type: "gift_received", description: "Received Crown gift from user123", amount: 25.0, timestamp: "2024-01-19T20:10:00Z" },
    { id: "7", type: "tip_received", description: "Video tip from premium viewer", amount: 12.75, timestamp: "2024-01-19T17:20:00Z" }
  ],
  referralStats: {
    totalReferrals: 23,
    totalEarnings: 340.50,
    activeReferrals: 18
  }
});

export default function EnhancedRewards() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [rewardData, setRewardData] = useState<RewardData | null>(null);
  const [showWithdrawalModal, setShowWithdrawalModal] = useState(false);

  useEffect(() => {
    if (user) {
      loadRewardData();
    }
  }, [user]);

  const loadRewardData = async () => {
    try {
      setIsLoading(true);

      // Check if user is authenticated
      if (!user) {
        setRewardData(getDemoData());
        toast({
          title: "Demo Mode",
          description: "Please sign in to view your actual rewards data",
          variant: "default"
        });
        return;
      }

      const response = await fetchWithAuth("/api/creator/reward-summary");

      if (response.ok) {
        const text = await response.text();

        if (!text.trim()) {
          setRewardData(getDemoData());
          return;
        }

        try {
          const data = JSON.parse(text);
          setRewardData(data.data || data);
          return; // Success - exit early
        } catch (jsonError) {
          console.warn("JSON parse error:", jsonError);
          setRewardData(getDemoData());
          return;
        }
      } else {
        console.warn("API request failed:", response.status, response.statusText);
        setRewardData(getDemoData());
        return;
      }
    } catch (error) {
      console.error("Failed to load reward data:", error);
      setRewardData(getDemoData());
      toast({
        title: "Connection Issue",
        description: "Using demo data. Please check your connection and try refreshing.",
        variant: "default"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const refreshData = async () => {
    setIsRefreshing(true);
    try {
      await loadRewardData();
      toast({
        title: "Data Updated",
        description: "Your rewards data has been refreshed"
      });
    } catch (error) {
      console.error("Refresh failed:", error);
      toast({
        title: "Refresh Failed",
        description: "Could not refresh data. Please try again later.",
        variant: "destructive"
      });
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleWithdrawalSuccess = (amount: number, method: string) => {
    toast({
      title: "Withdrawal Complete!",
      description: `${formatCurrency(amount)} has been added to your ${method}`,
    });
    // Refresh data to show updated balance
    refreshData();
  };

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
    <div className="max-w-7xl mx-auto p-4 space-y-8">
      {/* Enhanced Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="min-w-0 flex-1">
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
            <Trophy className="h-8 w-8 text-yellow-500" />
            Monetization
          </h1>
        </div>
      </div>

      {/* Rewards Credit Card */}
      {isLoading ? (
        <div className="animate-pulse">
          <div className="h-64 bg-gradient-to-br from-gray-200 to-gray-300 rounded-xl"></div>
        </div>
      ) : rewardData ? (
        <RewardsCard
          currentSoftPoints={rewardData.currentSoftPoints}
          availableToWithdraw={rewardData.availableToWithdraw}
          totalEarnings={rewardData.totalEarnings}
          trustScore={rewardData.trustScore}
          onWithdraw={() => setShowWithdrawalModal(true)}
          className="mb-8"
        />
      ) : null}


      {/* Tabbed Content */}
      <Tabs key="rewards-tabs" value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <div className="w-full relative">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8 overflow-x-auto scrollbar-hide" aria-label="Tabs">
              {[
                { id: "dashboard", label: "Dashboard", icon: BarChart3, description: "Overview and stats" },
                { id: "activities", label: "Activities", icon: Activity, description: "Earnings analysis" },
                { id: "challenges", label: "Challenges", icon: Target, description: "Complete challenges" },
                { id: "battles", label: "Battles", icon: Swords, description: "Vote and earn" },
                { id: "referrals", label: "Referral", icon: UserPlus, description: "Invite friends" },
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
                  {tab.id === "referrals" && rewardData?.referralStats.totalReferrals && (
                    <Badge variant="secondary" className="ml-1 text-xs h-4 w-4 rounded-full p-0 flex items-center justify-center">
                      {rewardData.referralStats.totalReferrals}
                    </Badge>
                  )}
                </button>
              ))}
            </nav>
            {/* Horizontal scroll indicator */}
            <div className="absolute right-2 top-1/2 transform -translate-y-1/2 pointer-events-none">
              <div className="flex items-center text-gray-400">
                <ArrowRight className="h-4 w-4 animate-pulse" />
              </div>
            </div>
          </div>
        </div>

        <TabsContent value="dashboard" className="mt-6">
          {isLoading ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 animate-pulse">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="h-32 bg-gray-200 rounded-xl"></div>
              ))}
            </div>
          ) : rewardData ? (
            <RewardsStats
              totalEarnings={rewardData.totalEarnings}
              currentSoftPoints={rewardData.currentSoftPoints}
              trustScore={rewardData.trustScore}
              activityStats={rewardData.activityStats}
              earningsByType={rewardData.earningsByType}
            />
          ) : (
            <div className="text-center py-12">
              <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Dashboard</h3>
              <p className="text-gray-600">Your rewards dashboard will appear here once data loads.</p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="activities" className="mt-6">
          {isLoading ? (
            <div className="animate-pulse space-y-6">
              <div className="h-12 bg-gray-200 rounded-xl"></div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="h-96 bg-gray-200 rounded-xl"></div>
                <div className="h-96 bg-gray-200 rounded-xl"></div>
              </div>
            </div>
          ) : rewardData ? (
            <RewardsActivitiesTab
              earningsByType={rewardData.earningsByType}
              recentActivity={rewardData.recentActivity}
            />
          ) : (
            <div className="text-center py-12">
              <Activity className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Activities</h3>
              <p className="text-gray-600">Your earnings activities will appear here once data loads.</p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="challenges" className="mt-6">
          <RewardsChallengesTab />
        </TabsContent>

        <TabsContent value="battles" className="mt-6">
          <RewardsBattleTab />
        </TabsContent>

        <TabsContent value="referrals" className="mt-6">
          {isLoading ? (
            <div className="animate-pulse space-y-6">
              <div className="h-8 bg-gray-200 rounded w-1/3"></div>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="h-32 bg-gray-200 rounded-xl"></div>
                ))}
              </div>
              <div className="h-64 bg-gray-200 rounded-xl"></div>
            </div>
          ) : (
            <SafeReferralManager />
          )}
        </TabsContent>
      </Tabs>

      {/* Withdrawal Modal */}
      {rewardData && (
        <WithdrawalModal
          isOpen={showWithdrawalModal}
          onClose={() => setShowWithdrawalModal(false)}
          currentSoftPoints={rewardData.currentSoftPoints}
          availableToWithdraw={rewardData.availableToWithdraw}
          trustScore={rewardData.trustScore}
          onWithdrawalSuccess={handleWithdrawalSuccess}
        />
      )}
    </div>
  );
}
