
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { calculateNextLevelProgress, getAvailableRewards, REWARD_ACTIONS, getPointsForAction, getDescriptionForAction } from "@/services/rewardsService";
import RewardsHeader from "@/components/rewards/RewardsHeader";
import RewardsOverview from "@/components/rewards/RewardsOverview";
import EarnPoints from "@/components/rewards/EarnPoints";
import RedeemRewards from "@/components/rewards/RedeemRewards";
import RewardsHistory from "@/components/rewards/RewardsHistory";
import AchievementsTab from "@/components/rewards/AchievementsTab";
import { UserLevel } from "@/types/user";
import { Skeleton } from "@/components/ui/skeleton";

const Rewards = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("overview");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate data loading
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  if (!user) return null;

  if (isLoading) {
    return (
      <div className="container py-6">
        {/* Header Skeleton */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <Skeleton className="h-8 w-48" />
          <div className="flex gap-2">
            <Skeleton className="h-10 w-24" />
            <Skeleton className="h-10 w-24" />
            <Skeleton className="h-10 w-32" />
            <Skeleton className="h-10 w-24" />
            <Skeleton className="h-10 w-24" />
          </div>
        </div>

        {/* Overview Tab Skeleton */}
        <div className="space-y-6">
          {/* Level Progress Skeleton */}
          <div className="rounded-xl border bg-card text-card-foreground shadow p-6">
            <div className="flex justify-between items-center mb-4">
              <Skeleton className="h-6 w-32" />
              <Skeleton className="h-6 w-24" />
            </div>
            <Skeleton className="h-4 w-full mb-2" />
            <Skeleton className="h-4 w-3/4" />
            <div className="mt-6 grid grid-cols-4 gap-4">
              {[1, 2, 3, 4].map((i) => (
                <Skeleton key={i} className="h-24 rounded-lg" />
              ))}
            </div>
          </div>

          {/* Available Rewards Skeleton */}
          <div className="rounded-xl border bg-card text-card-foreground shadow p-6">
            <Skeleton className="h-6 w-48 mb-6" />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-32 rounded-lg" />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Use default values if points/level are not available yet
  const userPoints = user.points || 0;

  // Convert string level to compatible format
  const userLevel = user.level?.toLowerCase() as "bronze" | "silver" | "gold" | "platinum";

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
      <RewardsHeader activeTab={activeTab} setActiveTab={setActiveTab} />

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsContent value="overview" className="mt-0">
          <RewardsOverview
            user={{ ...user, points: userPoints, level: userLevel }}
            currentLevel={currentLevel}
            nextLevel={nextLevel}
            progress={progress}
            levelColors={levelColors}
            availableRewards={availableRewards}
            setActiveTab={setActiveTab}
          />
        </TabsContent>

        <TabsContent value="earn" className="mt-0">
          <EarnPoints earnPoints={earnPoints} />
        </TabsContent>

        <TabsContent value="achievements" className="mt-0">
          <AchievementsTab />
        </TabsContent>

        <TabsContent value="redeem" className="mt-0">
          <RedeemRewards
            user={{ ...user, points: userPoints }}
            availableRewards={availableRewards}
            redeemReward={redeemReward}
          />
        </TabsContent>

        <TabsContent value="history" className="mt-0">
          <RewardsHistory />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Rewards;
