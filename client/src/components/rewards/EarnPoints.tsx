
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus } from "lucide-react";
import { REWARD_ACTIONS, getDescriptionForAction, getPointsForAction } from "@/services/rewardsService";

interface EarnPointsProps {
  earnPoints: (action: typeof REWARD_ACTIONS[number]) => void;
}

const EarnPoints = ({ earnPoints }: EarnPointsProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Ways to Earn Points</CardTitle>
        <CardDescription>Complete these actions to earn more points</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {REWARD_ACTIONS.map((action, index) => (
            <Card key={index} className="overflow-hidden">
              <div className="flex justify-between p-4">
                <div>
                  <h3 className="font-medium">{getDescriptionForAction(action)}</h3>
                  <p className="text-sm text-muted-foreground">
                    Earn {getPointsForAction(action)} points
                  </p>
                </div>
                <Button 
                  size="sm" 
                  onClick={() => earnPoints(action)}
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Earn
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default EarnPoints;
