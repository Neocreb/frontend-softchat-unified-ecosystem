import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Award, Gift, ArrowRight, CheckCircle, Clock, ChevronRight, Plus } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/components/ui/use-toast";
import { calculateNextLevelProgress, getAvailableRewards, REWARD_ACTIONS, getPointsForAction, getDescriptionForAction } from "@/services/rewardsService";

const Rewards = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("overview");
  
  if (!user) return null;
  
  const { currentLevel, nextLevel, progress } = calculateNextLevelProgress(user.points);
  const availableRewards = getAvailableRewards(user.level);
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
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Rewards & Benefits</h1>
          <p className="text-muted-foreground">Earn points and unlock exclusive rewards</p>
        </div>
        <div className="mt-4 md:mt-0">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList>
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="earn">Earn Points</TabsTrigger>
              <TabsTrigger value="redeem">Redeem</TabsTrigger>
              <TabsTrigger value="history">History</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsContent value="overview" className="mt-0">
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
        </TabsContent>
        
        <TabsContent value="earn" className="mt-0">
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
        </TabsContent>
        
        <TabsContent value="redeem" className="mt-0">
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
        </TabsContent>
        
        <TabsContent value="history" className="mt-0">
          <Card>
            <CardHeader>
              <CardTitle>Rewards History</CardTitle>
              <CardDescription>
                Track your rewards activity
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { type: "earned", description: "Created a post", points: 10, date: "Apr 13, 2025" },
                  { type: "earned", description: "Daily login", points: 5, date: "Apr 13, 2025" },
                  { type: "earned", description: "Referred a friend", points: 200, date: "Apr 12, 2025" },
                  { type: "redeemed", description: "10% Discount", points: 500, date: "Apr 10, 2025" },
                  { type: "earned", description: "Made a purchase", points: 50, date: "Apr 8, 2025" },
                  { type: "earned", description: "Traded cryptocurrency", points: 25, date: "Apr 5, 2025" },
                ].map((item, index) => (
                  <div key={index} className="flex items-center justify-between border-b pb-3 last:border-0 last:pb-0">
                    <div className="flex items-center">
                      <div className={`rounded-full p-2 mr-3 ${
                        item.type === "earned" ? "bg-green-100 text-green-600" : "bg-orange-100 text-orange-600"
                      }`}>
                        {item.type === "earned" ? (
                          <Plus className="h-4 w-4" />
                        ) : (
                          <Gift className="h-4 w-4" />
                        )}
                      </div>
                      <div>
                        <p className="font-medium">{item.description}</p>
                        <p className="text-xs text-muted-foreground">{item.date}</p>
                      </div>
                    </div>
                    <div className={`font-medium ${
                      item.type === "earned" ? "text-green-600" : "text-orange-600"
                    }`}>
                      {item.type === "earned" ? "+" : "-"}{item.points}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Rewards;
