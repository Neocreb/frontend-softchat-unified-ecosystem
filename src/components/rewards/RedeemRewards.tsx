
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Gift } from "lucide-react";

interface RedeemRewardsProps {
  user: any;
  availableRewards: any[];
  redeemReward: (rewardName: string, points: number) => void;
}

const RedeemRewards = ({ user, availableRewards, redeemReward }: RedeemRewardsProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Redeem Your Points</CardTitle>
        <CardDescription>
          You have <span className="font-medium">{user.points.toLocaleString()}</span> points to redeem
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {availableRewards.map((reward) => (
            <Card key={reward.id} className="overflow-hidden">
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <CardTitle className="text-base">{reward.name}</CardTitle>
                  <Badge variant="secondary" className={reward.level !== "bronze" ? "capitalize bg-slate-800 text-white" : ""}>
                    {reward.level}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="py-2">
                <div className="text-sm text-muted-foreground mb-4">
                  <div className="flex items-center">
                    <Gift className="h-4 w-4 mr-2" />
                    <span>{reward.points.toLocaleString()} points</span>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button
                  className="w-full"
                  disabled={user.points < reward.points}
                  onClick={() => redeemReward(reward.name, reward.points)}
                >
                  {user.points >= reward.points ? "Redeem Now" : "Not Enough Points"}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default RedeemRewards;
