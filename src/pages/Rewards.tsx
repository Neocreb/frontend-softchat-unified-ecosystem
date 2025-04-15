
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

const Rewards = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("overview");
  
  if (!user) return null;
  
  // Use default values if points/level are not available yet
  const userPoints = user.points || 0;
  const userLevel = user.level || 'bronze';
  
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
