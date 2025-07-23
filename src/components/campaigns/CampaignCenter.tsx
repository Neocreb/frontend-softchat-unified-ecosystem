import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sparkles,
  TrendingUp,
  Target,
  Calendar,
  DollarSign,
  Eye,
  MousePointer,
  ShoppingCart,
  Clock,
  Plus,
  Zap,
  Award,
  BarChart3,
  Users,
  Megaphone,
  Star,
  Flame,
  Crown,
  Rocket,
  Diamond,
  Gift,
  PlusCircle,
  Settings,
  Play,
  Pause,
  MoreVertical,
  TrendingDown,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import CampaignCreationWizard from "./CampaignCreationWizard";
import CampaignAnalyticsDashboard from "./CampaignAnalyticsDashboard";
import SmartBoostSuggestions from "./SmartBoostSuggestions";
import { campaignSyncService } from "@/services/campaignSyncService";

// Campaign goals definition
export const CAMPAIGN_GOALS = {
  INCREASE_SALES: {
    id: "increase_sales",
    name: "🚀 Increase Sales",
    description: "Boost product sales and revenue",
    icon: ShoppingCart,
    color: "green",
    targets: ["marketplace_products", "services"],
    metrics: ["conversions", "revenue", "roi"],
  },
  GET_APPLICATIONS: {
    id: "get_applications", 
    name: "📥 Get Applications",
    description: "Attract more freelancer applications",
    icon: Users,
    color: "blue",
    targets: ["freelance_jobs"],
    metrics: ["applications", "qualified_applications", "hire_rate"],
  },
  PROMOTE_TALENT: {
    id: "promote_talent",
    name: "📣 Promote Talent", 
    description: "Showcase freelancer profiles and skills",
    icon: Award,
    color: "purple",
    targets: ["freelancer_profiles"],
    metrics: ["profile_views", "inquiries", "bookings"],
  },
  GET_MORE_VIEWS: {
    id: "get_more_views",
    name: "🎬 Get More Views",
    description: "Increase content visibility and engagement",
    icon: Eye,
    color: "orange",
    targets: ["posts", "videos", "content"],
    metrics: ["views", "engagement", "shares"],
  },
  DRIVE_CHATS: {
    id: "drive_chats",
    name: "💬 Drive Chats",
    description: "Generate more inquiries and conversations",
    icon: Megaphone,
    color: "pink",
    targets: ["products", "jobs", "profiles"],
    metrics: ["chat_initiated", "response_rate", "conversion_rate"],
  },
};

// Mock data for campaigns
const mockActiveCampaigns = [
  {
    id: "1",
    name: "Premium Product Promotion",
    goal: CAMPAIGN_GOALS.INCREASE_SALES,
    status: "active",
    budget: 250.00,
    spent: 127.50,
    remaining: 122.50,
    duration: 7,
    timeLeft: "4 days",
    performance: {
      impressions: 15420,
      clicks: 892,
      conversions: 23,
      ctr: 5.8,
      conversionRate: 2.6,
      costPerClick: 0.14,
      roi: 340,
    },
    boostedItems: [
      { type: "product", name: "Premium Headphones", image: "/placeholder.svg" }
    ],
    currency: "SOFT_POINTS",
    createdAt: "2024-01-15",
  },
  {
    id: "2", 
    name: "Freelance Profile Boost",
    goal: CAMPAIGN_GOALS.PROMOTE_TALENT,
    status: "active",
    budget: 100.00,
    spent: 45.30,
    remaining: 54.70,
    duration: 3,
    timeLeft: "1 day",
    performance: {
      impressions: 8750,
      clicks: 234,
      conversions: 12,
      ctr: 2.7,
      conversionRate: 5.1,
      costPerClick: 0.19,
      roi: 180,
    },
    boostedItems: [
      { type: "profile", name: "UI/UX Designer Profile", image: "/placeholder.svg" }
    ],
    currency: "USDT",
    createdAt: "2024-01-20",
  },
];

// Incentives and bonuses
const mockIncentives = [
  {
    id: "new_user_bonus",
    title: "New User Bonus",
    description: "Get ₦500 free campaign credits as a welcome gift!",
    icon: Gift,
    amount: 500,
    currency: "SOFT_POINTS",
    available: true,
    claimed: false,
  },
  {
    id: "performance_bonus",
    title: "High Performance Bonus", 
    description: "10% cashback for campaigns with 200%+ ROI",
    icon: Award,
    percentage: 10,
    threshold: 200,
    available: true,
  },
  {
    id: "loyalty_reward",
    title: "Loyalty Reward",
    description: "Monthly bonus boosts for top performers",
    icon: Crown,
    available: false,
    nextEligible: "2024-02-01",
  },
];

const CampaignCenter: React.FC = () => {
  const { toast } = useToast();
  const [activeCampaigns, setActiveCampaigns] = useState(mockActiveCampaigns);
  const [showCreationWizard, setShowCreationWizard] = useState(false);
  const [showIncentives, setShowIncentives] = useState(false);
  const [selectedCampaign, setSelectedCampaign] = useState<any>(null);

  // Calculate overview stats
  const totalSpent = activeCampaigns.reduce((sum, c) => sum + c.spent, 0);
  const totalBudget = activeCampaigns.reduce((sum, c) => sum + c.budget, 0);
  const totalImpressions = activeCampaigns.reduce((sum, c) => sum + c.performance.impressions, 0);
  const totalConversions = activeCampaigns.reduce((sum, c) => sum + c.performance.conversions, 0);
  const avgROI = activeCampaigns.length > 0 ? 
    activeCampaigns.reduce((sum, c) => sum + c.performance.roi, 0) / activeCampaigns.length : 0;

  const handlePauseCampaign = (campaignId: string) => {
    setActiveCampaigns(prev => 
      prev.map(c => 
        c.id === campaignId 
          ? { ...c, status: c.status === "active" ? "paused" : "active" }
          : c
      )
    );
    toast({
      title: "Campaign Updated",
      description: "Campaign status has been changed successfully",
    });
  };

  const handleClaimIncentive = (incentiveId: string) => {
    toast({
      title: "Incentive Claimed!",
      description: "Bonus credits have been added to your wallet",
    });
    setShowIncentives(false);
  };

  const getCampaignStatusColor = (status: string) => {
    switch (status) {
      case "active": return "bg-green-500";
      case "paused": return "bg-yellow-500";  
      case "ended": return "bg-gray-500";
      default: return "bg-blue-500";
    }
  };

  const getGoalIcon = (goal: any) => {
    const IconComponent = goal.icon;
    return <IconComponent className="h-4 w-4" />;
  };

  return (
    <div className="container px-4 py-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">Campaign Center</h1>
          <p className="text-muted-foreground text-sm md:text-base">
            Promote your content, products, and services to reach more people
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 w-full md:w-auto">
          <Button
            variant="outline"
            onClick={() => setShowIncentives(true)}
            className="w-full sm:w-auto"
          >
            <Gift className="h-4 w-4 mr-2" />
            <span className="hidden sm:inline">Incentives</span>
            <span className="sm:hidden">Bonuses</span>
          </Button>
          <Button onClick={() => setShowCreationWizard(true)} className="w-full sm:w-auto">
            <PlusCircle className="h-4 w-4 mr-2" />
            <span className="hidden sm:inline">Create Campaign</span>
            <span className="sm:hidden">Create</span>
          </Button>
        </div>
      </div>

      {/* Quick Stats Overview */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 md:gap-4">
        <Card>
          <CardContent className="p-3 md:p-4 text-center">
            <div className="text-xl md:text-2xl font-bold text-blue-600">
              {activeCampaigns.length}
            </div>
            <div className="text-xs md:text-sm text-muted-foreground">
              Active Campaigns
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-3 md:p-4 text-center">
            <div className="text-xl md:text-2xl font-bold text-green-600">
              ${totalSpent.toFixed(2)}
            </div>
            <div className="text-xs md:text-sm text-muted-foreground">
              Total Spent
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-3 md:p-4 text-center">
            <div className="text-xl md:text-2xl font-bold text-purple-600">
              {totalImpressions.toLocaleString()}
            </div>
            <div className="text-xs md:text-sm text-muted-foreground">
              Total Reach
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-3 md:p-4 text-center">
            <div className="text-xl md:text-2xl font-bold text-orange-600">
              {totalConversions}
            </div>
            <div className="text-xs md:text-sm text-muted-foreground">
              Conversions
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-3 md:p-4 text-center">
            <div className="text-xl md:text-2xl font-bold text-pink-600">
              {avgROI.toFixed(0)}%
            </div>
            <div className="text-xs md:text-sm text-muted-foreground">
              Average ROI
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="active-campaigns" className="w-full">
        <TabsList className="mb-6 grid grid-cols-2 md:grid-cols-4 h-auto">
          <TabsTrigger value="active-campaigns" className="text-xs md:text-sm px-2 py-2">Active</TabsTrigger>
          <TabsTrigger value="smart-suggestions" className="text-xs md:text-sm px-2 py-2">Suggestions</TabsTrigger>
          <TabsTrigger value="analytics" className="text-xs md:text-sm px-2 py-2">Analytics</TabsTrigger>
          <TabsTrigger value="campaign-goals" className="text-xs md:text-sm px-2 py-2">Goals</TabsTrigger>
        </TabsList>

        {/* Active Campaigns */}
        <TabsContent value="active-campaigns">
          <div className="space-y-6">
            {activeCampaigns.length === 0 ? (
              <Card className="bg-gradient-to-br from-blue-50 to-purple-50">
                <CardContent className="pt-8 pb-8 text-center">
                  <div className="space-y-4">
                    <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                      <Rocket className="h-8 w-8 text-blue-600" />
                    </div>
                    <h3 className="text-xl font-semibold">Start Your First Campaign</h3>
                    <p className="text-muted-foreground max-w-md mx-auto">
                      Boost your content, products, or services to reach more people and grow your business on Softchat.
                    </p>
                    <Button 
                      size="lg"
                      onClick={() => setShowCreationWizard(true)}
                    >
                      <PlusCircle className="h-4 w-4 mr-2" />
                      Create Your First Campaign
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {activeCampaigns.map((campaign) => (
                  <Card key={campaign.id} className="overflow-hidden">
                    <CardContent className="p-4 md:p-6">
                      <div className="flex flex-col md:flex-row items-start justify-between mb-4 gap-3">
                        <div className="flex items-center gap-3 flex-1">
                          <div className={`w-3 h-3 rounded-full ${getCampaignStatusColor(campaign.status)}`} />
                          <div className="flex-1">
                            <h3 className="font-semibold text-base md:text-lg">{campaign.name}</h3>
                            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 mt-1">
                              <Badge variant="outline" className="text-xs">
                                {getGoalIcon(campaign.goal)}
                                <span className="ml-1 hidden sm:inline">{campaign.goal.name}</span>
                                <span className="ml-1 sm:hidden">{campaign.goal.name.split(' ')[0]}</span>
                              </Badge>
                              <span className="text-sm text-muted-foreground">
                                {campaign.timeLeft} remaining
                              </span>
                            </div>
                          </div>
                        </div>

                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Campaign Actions</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem 
                              onClick={() => handlePauseCampaign(campaign.id)}
                            >
                              {campaign.status === "active" ? (
                                <>
                                  <Pause className="h-4 w-4 mr-2" />
                                  Pause Campaign
                                </>
                              ) : (
                                <>
                                  <Play className="h-4 w-4 mr-2" />
                                  Resume Campaign
                                </>
                              )}
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Settings className="h-4 w-4 mr-2" />
                              Edit Campaign
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <BarChart3 className="h-4 w-4 mr-2" />
                              View Analytics
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>

                      {/* Budget Progress */}
                      <div className="mb-4">
                        <div className="flex flex-col sm:flex-row justify-between text-sm mb-2 gap-1">
                          <span>Budget Progress</span>
                          <span className="text-xs sm:text-sm">
                            ${campaign.spent.toFixed(2)} / ${campaign.budget.toFixed(2)} {campaign.currency}
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${(campaign.spent / campaign.budget) * 100}%` }}
                          />
                        </div>
                      </div>

                      {/* Performance Metrics */}
                      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 md:gap-4 mb-4">
                        <div className="text-center">
                          <div className="text-sm md:text-lg font-semibold">
                            {campaign.performance.impressions.toLocaleString()}
                          </div>
                          <div className="text-xs text-muted-foreground">Impressions</div>
                        </div>
                        <div className="text-center">
                          <div className="text-sm md:text-lg font-semibold">
                            {campaign.performance.clicks.toLocaleString()}
                          </div>
                          <div className="text-xs text-muted-foreground">Clicks</div>
                        </div>
                        <div className="text-center">
                          <div className="text-sm md:text-lg font-semibold">
                            {campaign.performance.conversions}
                          </div>
                          <div className="text-xs text-muted-foreground">Conversions</div>
                        </div>
                        <div className="text-center">
                          <div className="text-sm md:text-lg font-semibold">
                            {campaign.performance.ctr}%
                          </div>
                          <div className="text-xs text-muted-foreground">CTR</div>
                        </div>
                        <div className="text-center">
                          <div className="text-sm md:text-lg font-semibold">
                            ${campaign.performance.costPerClick}
                          </div>
                          <div className="text-xs text-muted-foreground">CPC</div>
                        </div>
                        <div className="text-center">
                          <div className={`text-sm md:text-lg font-semibold ${campaign.performance.roi > 100 ? 'text-green-600' : 'text-red-600'}`}>
                            {campaign.performance.roi}%
                          </div>
                          <div className="text-xs text-muted-foreground">ROI</div>
                        </div>
                      </div>

                      {/* Boosted Items */}
                      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-3">
                        <span className="text-sm text-muted-foreground">Boosting:</span>
                        <div className="flex flex-wrap items-center gap-2">
                          {campaign.boostedItems.map((item, index) => (
                            <div key={index} className="flex items-center gap-2">
                              <img
                                src={item.image}
                                alt={item.name}
                                className="w-6 sm:w-8 h-6 sm:h-8 rounded-full object-cover"
                              />
                              <span className="text-xs sm:text-sm font-medium truncate max-w-32 sm:max-w-none">
                                {item.name}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </TabsContent>

        {/* Smart Suggestions */}
        <TabsContent value="smart-suggestions">
          <SmartBoostSuggestions />
        </TabsContent>

        {/* Analytics */}
        <TabsContent value="analytics">
          <CampaignAnalyticsDashboard campaigns={activeCampaigns} />
        </TabsContent>

        {/* Campaign Goals */}
        <TabsContent value="campaign-goals">
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold mb-2">Choose Your Campaign Goal</h2>
              <p className="text-muted-foreground">
                Select what you want to achieve to get the best results
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
              {Object.values(CAMPAIGN_GOALS).map((goal) => (
                <Card 
                  key={goal.id}
                  className="cursor-pointer transition-all hover:shadow-lg hover:scale-105"
                  onClick={() => {
                    setShowCreationWizard(true);
                  }}
                >
                  <CardHeader className="text-center pb-4">
                    <div className="mx-auto mb-4 p-4 rounded-full bg-gray-100 w-fit">
                      {getGoalIcon(goal)}
                    </div>
                    <h3 className="font-semibold text-lg">{goal.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      {goal.description}
                    </p>
                  </CardHeader>

                  <CardContent className="text-center space-y-3">
                    <div>
                      <h4 className="font-medium mb-2">Best for:</h4>
                      <div className="flex flex-wrap gap-1 justify-center">
                        {goal.targets.map((target, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {target.replace('_', ' ')}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h4 className="font-medium mb-2">Key Metrics:</h4>
                      <div className="text-sm text-muted-foreground">
                        {goal.metrics.join(", ")}
                      </div>
                    </div>
                  </CardContent>

                  <CardFooter>
                    <Button className="w-full">
                      <PlusCircle className="h-4 w-4 mr-2" />
                      Start Campaign
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </div>
        </TabsContent>
      </Tabs>

      {/* Incentives Modal */}
      <Dialog open={showIncentives} onOpenChange={setShowIncentives}>
        <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto mx-4">
          <DialogHeader>
            <DialogTitle>🎁 Incentives & Bonuses</DialogTitle>
            <DialogDescription>
              Claim your rewards and boost your campaigns for free
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            {mockIncentives.map((incentive) => (
              <Card key={incentive.id}>
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <incentive.icon className="h-5 w-5 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold">{incentive.title}</h4>
                      <p className="text-sm text-muted-foreground mb-2">
                        {incentive.description}
                      </p>
                      {incentive.amount && (
                        <Badge className="bg-green-100 text-green-800">
                          {incentive.amount} {incentive.currency}
                        </Badge>
                      )}
                      {incentive.percentage && (
                        <Badge className="bg-purple-100 text-purple-800">
                          {incentive.percentage}% cashback
                        </Badge>
                      )}
                    </div>
                    <div>
                      {incentive.available && !incentive.claimed ? (
                        <Button 
                          size="sm"
                          onClick={() => handleClaimIncentive(incentive.id)}
                        >
                          Claim
                        </Button>
                      ) : incentive.claimed ? (
                        <Badge className="bg-gray-100 text-gray-600">
                          <CheckCircle2 className="h-3 w-3 mr-1" />
                          Claimed
                        </Badge>
                      ) : (
                        <Badge variant="outline">
                          <Clock className="h-3 w-3 mr-1" />
                          Coming Soon
                        </Badge>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowIncentives(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Campaign Creation Wizard */}
      {showCreationWizard && (
        <CampaignCreationWizard 
          open={showCreationWizard}
          onClose={() => setShowCreationWizard(false)}
          onCampaignCreated={(newCampaign) => {
            setActiveCampaigns(prev => [...prev, newCampaign]);
            setShowCreationWizard(false);
            toast({
              title: "Campaign Created!",
              description: "Your campaign is now live and promoting your content",
            });
          }}
        />
      )}
    </div>
  );
};

export default CampaignCenter;
