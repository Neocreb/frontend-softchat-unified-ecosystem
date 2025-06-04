
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import WalletHeader from "@/components/wallet/WalletHeader";
import WalletCard from "@/components/wallet/WalletCard";
import CryptoWidget from "@/components/wallet/CryptoWidget";
import TradingSection from "@/components/wallet/TradingSection";
import EnhancedP2PMarketplace from "@/components/crypto/EnhancedP2PMarketplace";
import WalletRewards from "@/components/wallet/WalletRewards";
import BankAccountSettings from "@/components/wallet/BankAccountSettings";
import WalletTransactions from "@/components/wallet/WalletTransactions";
import RewardsOverview from "@/components/rewards/RewardsOverview";
import EarnPoints from "@/components/rewards/EarnPoints";
import RedeemRewards from "@/components/rewards/RedeemRewards";
import AchievementSystem from "@/components/gamification/AchievementSystem";
import RewardsHistory from "@/components/rewards/RewardsHistory";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { calculateNextLevelProgress, getAvailableRewards, REWARD_ACTIONS, getPointsForAction, getDescriptionForAction } from "@/services/rewardsService";

const Wallet = () => {
  const [searchParams] = useSearchParams();
  const initialTab = searchParams.get('tab') || 'portfolio';
  const [activeTab, setActiveTab] = useState(initialTab);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    // Update tab from URL params
    const tabFromUrl = searchParams.get('tab');
    if (tabFromUrl) {
      setActiveTab(tabFromUrl);
    }
  }, [searchParams]);

  useEffect(() => {
    // Simulate data loading
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <div className="container py-6">
        {/* Header Skeleton */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <Skeleton className="h-8 w-48" />
          <div className="flex gap-2 overflow-x-auto">
            {Array(6).fill(0).map((_, i) => (
              <Skeleton key={i} className="h-10 w-24 flex-shrink-0" />
            ))}
          </div>
        </div>

        {/* Content Skeleton */}
        <div className="grid grid-cols-1 gap-6">
          <div className="rounded-xl border bg-card text-card-foreground shadow p-6">
            <Skeleton className="h-6 w-32 mb-6" />
            <div className="space-y-4">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Rewards-related functions
  const userPoints = user?.points || 0;
  const userLevel = user?.level?.toLowerCase() as "bronze" | "silver" | "gold" | "platinum";
  const { currentLevel, nextLevel, progress } = calculateNextLevelProgress(userPoints);
  const availableRewards = getAvailableRewards(userLevel);
  const levelColors = {
    bronze: "bg-orange-600",
    silver: "bg-slate-400",
    gold: "bg-yellow-500",
    platinum: "bg-gradient-to-r from-purple-500 to-indigo-500"
  };

  const earnPoints = (action: typeof REWARD_ACTIONS[number]) => {
    toast({
      title: "Points earned!",
      description: `You earned ${getPointsForAction(action)} points for ${getDescriptionForAction(action)}`,
    });
  };

  const redeemReward = (rewardName: string, points: number) => {
    toast({
      title: "Reward redeemed!",
      description: `You've successfully redeemed ${rewardName} for ${points} points`,
    });
  };

  return (
    <div className="container py-6">
      <WalletHeader activeTab={activeTab} setActiveTab={setActiveTab} />

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsContent value="portfolio" className="mt-0">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <WalletCard />
            </div>
            <div>
              <CryptoWidget />
            </div>
          </div>
        </TabsContent>

        <TabsContent value="trading" className="mt-0">
          <TradingSection />
        </TabsContent>

        <TabsContent value="p2p" className="mt-0">
          <EnhancedP2PMarketplace />
        </TabsContent>

        <TabsContent value="rewards" className="mt-0">
          <Tabs defaultValue="overview" className="space-y-4">
            <div className="border-b">
              <div className="flex space-x-8">
                <button className="border-b-2 border-primary py-2 px-1 text-sm font-medium text-primary">
                  Overview
                </button>
                <button className="border-b-2 border-transparent py-2 px-1 text-sm font-medium text-muted-foreground hover:text-foreground">
                  Earn Points
                </button>
                <button className="border-b-2 border-transparent py-2 px-1 text-sm font-medium text-muted-foreground hover:text-foreground">
                  Redeem
                </button>
                <button className="border-b-2 border-transparent py-2 px-1 text-sm font-medium text-muted-foreground hover:text-foreground">
                  Achievements
                </button>
                <button className="border-b-2 border-transparent py-2 px-1 text-sm font-medium text-muted-foreground hover:text-foreground">
                  History
                </button>
              </div>
            </div>
            
            <div className="space-y-6">
              {user && (
                <RewardsOverview
                  user={{ ...user, points: userPoints, level: userLevel }}
                  currentLevel={currentLevel}
                  nextLevel={nextLevel}
                  progress={progress}
                  levelColors={levelColors}
                  availableRewards={availableRewards}
                  setActiveTab={() => {}}
                />
              )}
            </div>
          </Tabs>
        </TabsContent>

        <TabsContent value="bank" className="mt-0">
          <BankAccountSettings />
        </TabsContent>

        <TabsContent value="transactions" className="mt-0">
          <WalletTransactions />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Wallet;
