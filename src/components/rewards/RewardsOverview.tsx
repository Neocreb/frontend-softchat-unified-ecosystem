
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ArrowRight, Award, CheckCircle, Clock } from "lucide-react";

interface RewardsOverviewProps {
  user: any;
  currentLevel: string;
  nextLevel: string | null;
  progress: number;
  levelColors: Record<string, string>;
  availableRewards: any[];
  setActiveTab: (value: string) => void;
}

const RewardsOverview = ({ 
  user, 
  currentLevel, 
  nextLevel, 
  progress, 
  levelColors, 
  availableRewards, 
  setActiveTab 
}: RewardsOverviewProps) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2">
        <Card>
          <CardHeader>
            <CardTitle>Your Rewards Status</CardTitle>
            <CardDescription>
              Track your progress and unlock new benefits
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center space-x-4">
              <div className={`h-16 w-16 rounded-full ${levelColors[currentLevel]} flex items-center justify-center`}>
                <Award className="h-8 w-8 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-semibold capitalize">{currentLevel} Level</h3>
                <p className="text-sm text-muted-foreground">
                  <span className="font-medium">{user.points.toLocaleString()}</span> points earned
                </p>
              </div>
            </div>
            
            {nextLevel && (
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Progress to {nextLevel}</span>
                  <span className="font-medium">{progress}%</span>
                </div>
                <Progress value={progress} className="h-2" />
                <p className="text-xs text-muted-foreground">
                  Keep earning points to reach {nextLevel} level and unlock new rewards
                </p>
              </div>
            )}
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="bg-muted/50">
                <CardHeader className="py-3 px-4">
                  <CardTitle className="text-sm">Current Points</CardTitle>
                </CardHeader>
                <CardContent className="py-2 px-4">
                  <div className="text-2xl font-bold">{user.points.toLocaleString()}</div>
                </CardContent>
              </Card>
              
              <Card className="bg-muted/50">
                <CardHeader className="py-3 px-4">
                  <CardTitle className="text-sm">Rewards Redeemed</CardTitle>
                </CardHeader>
                <CardContent className="py-2 px-4">
                  <div className="text-2xl font-bold">2</div>
                </CardContent>
              </Card>
              
              <Card className="bg-muted/50">
                <CardHeader className="py-3 px-4">
                  <CardTitle className="text-sm">Rewards Available</CardTitle>
                </CardHeader>
                <CardContent className="py-2 px-4">
                  <div className="text-2xl font-bold">{availableRewards.length}</div>
                </CardContent>
              </Card>
            </div>
          </CardContent>
          <CardFooter>
            <Button onClick={() => setActiveTab("earn")}>
              Earn more points
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </CardFooter>
        </Card>
      </div>
      
      <div>
        <Card>
          <CardHeader>
            <CardTitle>Member Benefits</CardTitle>
            <CardDescription>
              Current benefits for {currentLevel} level
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-4">
              {[
                { title: "Marketplace Discounts", description: "Up to 10% off on selected items", active: true },
                { title: "Premium Support", description: "Priority customer service", active: currentLevel !== "bronze" },
                { title: "Free Shipping", description: "On orders over $50", active: currentLevel !== "bronze" },
                { title: "Early Access", description: "Shop new items before anyone else", active: ["gold", "platinum"].includes(currentLevel) },
                { title: "Exclusive Events", description: "Invitations to member-only events", active: currentLevel === "platinum" },
              ].map((benefit, index) => (
                <div key={index} className="flex items-start space-x-3">
                  {benefit.active ? (
                    <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                  ) : (
                    <Clock className="h-5 w-5 text-muted-foreground mt-0.5" />
                  )}
                  <div>
                    <p className={`font-medium ${!benefit.active && "text-muted-foreground"}`}>
                      {benefit.title}
                    </p>
                    <p className="text-xs text-muted-foreground">{benefit.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" size="sm" onClick={() => setActiveTab("redeem")}>
              View all rewards
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default RewardsOverview;
