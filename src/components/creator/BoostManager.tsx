import React, { useState, useEffect } from "react";
import {
  Zap,
  TrendingUp,
  Eye,
  Users,
  Target,
  Clock,
  DollarSign,
  Coins,
  BarChart3,
  Calendar,
  Plus,
  Edit,
  Pause,
  Play,
  RefreshCw,
  AlertCircle,
  CheckCircle,
  Star,
  Crown,
  Flame,
  ArrowUp,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Slider } from "@/components/ui/slider";
import { cn } from "@/lib/utils";
import { formatDistanceToNow, addHours } from "date-fns";
import { api } from "@/lib/api";

interface BoostCampaign {
  id: string;
  targetType: "content" | "profile" | "all_content";
  targetId?: string;
  targetTitle?: string;
  boostType: "basic" | "premium" | "featured" | "trending";
  duration: number;
  cost: number;
  paymentMethod: "soft_points" | "wallet_usd" | "wallet_crypto";
  status: "pending" | "active" | "completed" | "cancelled" | "rejected";
  startDate?: string;
  endDate?: string;
  impressions: number;
  clicks: number;
  engagements: number;
  conversions: number;
  additionalViews: number;
  additionalRevenue: number;
  roi: number;
  createdAt: string;
}

interface BoostOption {
  type: "basic" | "premium" | "featured" | "trending";
  name: string;
  description: string;
  icon: React.ReactNode;
  baseCost: number;
  softPointsCost: number;
  features: string[];
  estimatedReach: string;
  color: string;
}

interface ContentItem {
  id: string;
  type: "post" | "video" | "reel";
  title: string;
  views: number;
  engagement: number;
  revenue: number;
  publishedAt: string;
  isEligible: boolean;
}

const BoostManager: React.FC = () => {
  const [activeCampaigns, setActiveCampaigns] = useState<BoostCampaign[]>([]);
  const [pastCampaigns, setPastCampaigns] = useState<BoostCampaign[]>([]);
  const [contentItems, setContentItems] = useState<ContentItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("active");
  const [showCreateBoost, setShowCreateBoost] = useState(false);
  const [selectedContent, setSelectedContent] = useState<string>("");
  const [selectedBoostType, setSelectedBoostType] = useState<string>("basic");
  const [boostDuration, setBoostDuration] = useState([24]);
  const [softPointsBalance, setSoftPointsBalance] = useState(5000);

  const boostOptions: BoostOption[] = [
    {
      type: "basic",
      name: "Basic Boost",
      description: "Increase visibility in feeds",
      icon: <ArrowUp className="w-4 h-4" />,
      baseCost: 10,
      softPointsCost: 500,
      features: ["2x feed visibility", "Standard placement", "Basic analytics"],
      estimatedReach: "1K - 5K",
      color: "bg-blue-100 text-blue-800",
    },
    {
      type: "premium",
      name: "Premium Boost",
      description: "Featured placement with priority",
      icon: <Star className="w-4 h-4" />,
      baseCost: 25,
      softPointsCost: 1200,
      features: [
        "5x feed visibility",
        "Priority placement",
        "Advanced analytics",
        "Cross-platform promotion",
      ],
      estimatedReach: "5K - 15K",
      color: "bg-purple-100 text-purple-800",
    },
    {
      type: "featured",
      name: "Featured Boost",
      description: "Top placement in category",
      icon: <Crown className="w-4 h-4" />,
      baseCost: 50,
      softPointsCost: 2500,
      features: [
        "10x feed visibility",
        "Featured section placement",
        "Premium analytics",
        "Influencer network",
      ],
      estimatedReach: "15K - 50K",
      color: "bg-yellow-100 text-yellow-800",
    },
    {
      type: "trending",
      name: "Trending Boost",
      description: "Maximum exposure and viral potential",
      icon: <Flame className="w-4 h-4" />,
      baseCost: 100,
      softPointsCost: 5000,
      features: [
        "25x feed visibility",
        "Trending page placement",
        "Full analytics suite",
        "Celebrity endorsements",
      ],
      estimatedReach: "50K+",
      color: "bg-red-100 text-red-800",
    },
  ];

  useEffect(() => {
    loadBoostData();
  }, []);

  const loadBoostData = async () => {
    setIsLoading(true);
    try {
      // Load active campaigns
      const activeCampaignsData: BoostCampaign[] = [
        {
          id: "1",
          targetType: "content",
          targetId: "post_123",
          targetTitle: "My Latest Art Tutorial",
          boostType: "premium",
          duration: 48,
          cost: 25,
          paymentMethod: "soft_points",
          status: "active",
          startDate: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
          endDate: addHours(new Date(), 36).toISOString(),
          impressions: 45230,
          clicks: 2341,
          engagements: 892,
          conversions: 43,
          additionalViews: 12450,
          additionalRevenue: 156.75,
          roi: 627,
          createdAt: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
        },
        {
          id: "2",
          targetType: "profile",
          boostType: "basic",
          duration: 24,
          cost: 10,
          paymentMethod: "wallet_usd",
          status: "active",
          startDate: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
          endDate: addHours(new Date(), 18).toISOString(),
          impressions: 18900,
          clicks: 567,
          engagements: 234,
          conversions: 12,
          additionalViews: 4230,
          additionalRevenue: 42.3,
          roi: 423,
          createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
        },
      ];

      // Load past campaigns
      const pastCampaignsData: BoostCampaign[] = [
        {
          id: "3",
          targetType: "content",
          targetId: "video_456",
          targetTitle: "Quick Recipe Video",
          boostType: "featured",
          duration: 72,
          cost: 50,
          paymentMethod: "soft_points",
          status: "completed",
          startDate: new Date(
            Date.now() - 5 * 24 * 60 * 60 * 1000,
          ).toISOString(),
          endDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
          impressions: 156780,
          clicks: 8934,
          engagements: 3456,
          conversions: 234,
          additionalViews: 45670,
          additionalRevenue: 892.45,
          roi: 1785,
          createdAt: new Date(
            Date.now() - 5 * 24 * 60 * 60 * 1000,
          ).toISOString(),
        },
      ];

      // Load content items
      const contentData: ContentItem[] = [
        {
          id: "post_789",
          type: "post",
          title: "Digital Art Techniques",
          views: 2340,
          engagement: 8.5,
          revenue: 23.45,
          publishedAt: new Date(
            Date.now() - 2 * 24 * 60 * 60 * 1000,
          ).toISOString(),
          isEligible: true,
        },
        {
          id: "video_012",
          type: "video",
          title: "Speed Drawing Session",
          views: 5670,
          engagement: 12.3,
          revenue: 89.23,
          publishedAt: new Date(
            Date.now() - 1 * 24 * 60 * 60 * 1000,
          ).toISOString(),
          isEligible: true,
        },
        {
          id: "reel_345",
          type: "reel",
          title: "Art Tips in 60 Seconds",
          views: 12450,
          engagement: 15.7,
          revenue: 156.78,
          publishedAt: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
          isEligible: true,
        },
      ];

      setActiveCampaigns(activeCampaignsData);
      setPastCampaigns(pastCampaignsData);
      setContentItems(contentData);
    } catch (error) {
      console.error("Error loading boost data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
    }).format(amount);
  };

  const formatNumber = (num: number): string => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + "M";
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + "K";
    }
    return num.toString();
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-100 text-green-800">Active</Badge>;
      case "pending":
        return <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>;
      case "completed":
        return <Badge className="bg-gray-100 text-gray-800">Completed</Badge>;
      case "cancelled":
        return <Badge className="bg-red-100 text-red-800">Cancelled</Badge>;
      case "rejected":
        return <Badge className="bg-red-100 text-red-800">Rejected</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const getBoostIcon = (type: string) => {
    const option = boostOptions.find((opt) => opt.type === type);
    return option?.icon || <Zap className="w-4 h-4" />;
  };

  const calculateBoostCost = (type: string, duration: number) => {
    const option = boostOptions.find((opt) => opt.type === type);
    if (!option) return { usd: 0, softPoints: 0 };

    const hourlyMultiplier = duration / 24;
    return {
      usd: option.baseCost * hourlyMultiplier,
      softPoints: option.softPointsCost * hourlyMultiplier,
    };
  };

  const calculateTimeRemaining = (endDate: string) => {
    const now = new Date();
    const end = new Date(endDate);
    const diff = end.getTime() - now.getTime();

    if (diff <= 0) return "Expired";

    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

    if (hours > 0) {
      return `${hours}h ${minutes}m remaining`;
    }
    return `${minutes}m remaining`;
  };

  const handleCreateBoost = async () => {
    try {
      const selectedOption = boostOptions.find(
        (opt) => opt.type === selectedBoostType,
      );
      if (!selectedOption) return;

      const cost = calculateBoostCost(selectedBoostType, boostDuration[0]);

      const boostData = {
        targetType: selectedContent ? "content" : "profile",
        targetId: selectedContent || undefined,
        boostType: selectedBoostType,
        duration: boostDuration[0],
        paymentMethod: "soft_points",
        cost: cost.softPoints,
      };

      console.log("Creating boost:", boostData);
      // API call would go here

      setShowCreateBoost(false);
      await loadBoostData();
    } catch (error) {
      console.error("Error creating boost:", error);
    }
  };

  const handlePauseCampaign = async (id: string) => {
    try {
      console.log("Pausing campaign:", id);
      // API call would go here
      await loadBoostData();
    } catch (error) {
      console.error("Error pausing campaign:", error);
    }
  };

  const handleResumeCampaign = async (id: string) => {
    try {
      console.log("Resuming campaign:", id);
      // API call would go here
      await loadBoostData();
    } catch (error) {
      console.error("Error resuming campaign:", error);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...Array(3)].map((_, i) => (
              <Card key={i}>
                <CardContent className="p-6">
                  <div className="space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                    <div className="h-8 bg-gray-200 rounded w-3/4"></div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg flex items-center justify-center">
            <Zap className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold">Boost Manager</h2>
            <p className="text-gray-600 dark:text-gray-400">
              Amplify your content reach and engagement
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="text-right">
            <div className="text-sm text-gray-600 dark:text-gray-400">
              SoftPoints Balance
            </div>
            <div className="font-medium">
              {formatNumber(softPointsBalance)} SP
            </div>
          </div>
          <Dialog open={showCreateBoost} onOpenChange={setShowCreateBoost}>
            <DialogTrigger asChild>
              <Button className="flex items-center gap-2">
                <Plus className="w-4 h-4" />
                Create Boost
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Create New Boost Campaign</DialogTitle>
                <DialogDescription>
                  Boost your content or profile to reach more people and
                  increase engagement.
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-6">
                {/* Content Selection */}
                <div>
                  <Label className="text-sm font-medium">Boost Target</Label>
                  <Select
                    value={selectedContent}
                    onValueChange={setSelectedContent}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select content to boost or leave empty for profile boost" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">
                        Profile Boost (All Content)
                      </SelectItem>
                      {contentItems
                        .filter((item) => item.isEligible)
                        .map((item) => (
                          <SelectItem key={item.id} value={item.id}>
                            {item.title} ({item.type})
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Boost Type Selection */}
                <div>
                  <Label className="text-sm font-medium mb-3 block">
                    Boost Type
                  </Label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {boostOptions.map((option) => {
                      const cost = calculateBoostCost(
                        option.type,
                        boostDuration[0],
                      );
                      const isSelected = selectedBoostType === option.type;
                      const canAfford = cost.softPoints <= softPointsBalance;

                      return (
                        <div
                          key={option.type}
                          className={cn(
                            "border rounded-lg p-4 cursor-pointer transition-all",
                            isSelected &&
                              "border-blue-500 bg-blue-50 dark:bg-blue-900/20",
                            !canAfford && "opacity-50 cursor-not-allowed",
                          )}
                          onClick={() =>
                            canAfford && setSelectedBoostType(option.type)
                          }
                        >
                          <div className="flex items-center gap-2 mb-2">
                            {option.icon}
                            <span className="font-medium">{option.name}</span>
                            <Badge className={option.color}>
                              {option.estimatedReach}
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                            {option.description}
                          </p>
                          <div className="text-sm">
                            <div className="font-medium">
                              {formatNumber(cost.softPoints)} SP /{" "}
                              {formatCurrency(cost.usd)}
                            </div>
                            <div className="text-gray-500">
                              for {boostDuration[0]} hours
                            </div>
                          </div>
                          <div className="mt-2">
                            <ul className="text-xs text-gray-600 dark:text-gray-400 space-y-1">
                              {option.features
                                .slice(0, 2)
                                .map((feature, idx) => (
                                  <li key={idx}>• {feature}</li>
                                ))}
                            </ul>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Duration Selection */}
                <div>
                  <Label className="text-sm font-medium">
                    Duration: {boostDuration[0]} hours
                  </Label>
                  <div className="mt-2">
                    <Slider
                      value={boostDuration}
                      onValueChange={setBoostDuration}
                      max={168}
                      min={1}
                      step={1}
                      className="w-full"
                    />
                    <div className="flex justify-between text-xs text-gray-500 mt-1">
                      <span>1 hour</span>
                      <span>1 week (168 hours)</span>
                    </div>
                  </div>
                </div>

                {/* Cost Summary */}
                <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                  <h3 className="font-medium mb-2">Cost Summary</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Base Cost:</span>
                      <span>
                        {formatNumber(
                          calculateBoostCost(
                            selectedBoostType,
                            boostDuration[0],
                          ).softPoints,
                        )}{" "}
                        SP
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Duration:</span>
                      <span>{boostDuration[0]} hours</span>
                    </div>
                    <div className="flex justify-between font-medium border-t pt-2">
                      <span>Total Cost:</span>
                      <span>
                        {formatNumber(
                          calculateBoostCost(
                            selectedBoostType,
                            boostDuration[0],
                          ).softPoints,
                        )}{" "}
                        SP
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end gap-2">
                  <Button
                    variant="outline"
                    onClick={() => setShowCreateBoost(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleCreateBoost}
                    disabled={
                      calculateBoostCost(selectedBoostType, boostDuration[0])
                        .softPoints > softPointsBalance
                    }
                  >
                    Create Boost
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Campaign Tabs */}
      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="space-y-6"
      >
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="active">
            Active Campaigns ({activeCampaigns.length})
          </TabsTrigger>
          <TabsTrigger value="history">Campaign History</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        {/* Active Campaigns */}
        <TabsContent value="active" className="space-y-6">
          {activeCampaigns.length === 0 ? (
            <Card>
              <CardContent className="p-12 text-center">
                <Zap className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">
                  No Active Campaigns
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  Create your first boost campaign to increase your reach and
                  engagement.
                </p>
                <Button onClick={() => setShowCreateBoost(true)}>
                  <Plus className="w-4 h-4 mr-2" />
                  Create First Boost
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {activeCampaigns.map((campaign) => (
                <Card key={campaign.id}>
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {getBoostIcon(campaign.boostType)}
                        <CardTitle className="text-lg">
                          {campaign.targetTitle || "Profile Boost"}
                        </CardTitle>
                      </div>
                      {getStatusBadge(campaign.status)}
                    </div>
                    <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {campaign.endDate &&
                          calculateTimeRemaining(campaign.endDate)}
                      </span>
                      <Badge variant="outline" className="capitalize">
                        {campaign.boostType}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Progress Bar */}
                    {campaign.startDate && campaign.endDate && (
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>Campaign Progress</span>
                          <span>
                            {Math.round(
                              ((new Date().getTime() -
                                new Date(campaign.startDate).getTime()) /
                                (new Date(campaign.endDate).getTime() -
                                  new Date(campaign.startDate).getTime())) *
                                100,
                            )}
                            %
                          </span>
                        </div>
                        <Progress
                          value={Math.round(
                            ((new Date().getTime() -
                              new Date(campaign.startDate).getTime()) /
                              (new Date(campaign.endDate).getTime() -
                                new Date(campaign.startDate).getTime())) *
                              100,
                          )}
                        />
                      </div>
                    )}

                    {/* Performance Metrics */}
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                        <div className="text-lg font-bold">
                          {formatNumber(campaign.impressions)}
                        </div>
                        <div className="text-xs text-gray-600 dark:text-gray-400">
                          Impressions
                        </div>
                      </div>
                      <div className="text-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                        <div className="text-lg font-bold">
                          {formatNumber(campaign.clicks)}
                        </div>
                        <div className="text-xs text-gray-600 dark:text-gray-400">
                          Clicks
                        </div>
                      </div>
                      <div className="text-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                        <div className="text-lg font-bold">
                          {formatNumber(campaign.engagements)}
                        </div>
                        <div className="text-xs text-gray-600 dark:text-gray-400">
                          Engagements
                        </div>
                      </div>
                      <div className="text-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                        <div className="text-lg font-bold text-green-600">
                          {campaign.roi}%
                        </div>
                        <div className="text-xs text-gray-600 dark:text-gray-400">
                          ROI
                        </div>
                      </div>
                    </div>

                    {/* Revenue Impact */}
                    <div className="border-t pt-3">
                      <div className="flex justify-between items-center text-sm">
                        <span>Additional Revenue:</span>
                        <span className="font-medium text-green-600">
                          {formatCurrency(campaign.additionalRevenue)}
                        </span>
                      </div>
                      <div className="flex justify-between items-center text-sm">
                        <span>Additional Views:</span>
                        <span className="font-medium">
                          {formatNumber(campaign.additionalViews)}
                        </span>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2 pt-2">
                      <Button variant="outline" size="sm" className="flex-1">
                        <BarChart3 className="w-4 h-4 mr-2" />
                        View Details
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handlePauseCampaign(campaign.id)}
                      >
                        <Pause className="w-4 h-4" />
                      </Button>
                      <Button variant="outline" size="sm">
                        <Edit className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        {/* Campaign History */}
        <TabsContent value="history" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Campaign History</CardTitle>
            </CardHeader>
            <CardContent>
              {pastCampaigns.length === 0 ? (
                <div className="text-center py-8">
                  <Clock className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 dark:text-gray-400">
                    No completed campaigns yet.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {pastCampaigns.map((campaign) => (
                    <div
                      key={campaign.id}
                      className="border rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-gray-800"
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          {getBoostIcon(campaign.boostType)}
                          <span className="font-medium">
                            {campaign.targetTitle || "Profile Boost"}
                          </span>
                          <Badge variant="outline" className="capitalize">
                            {campaign.boostType}
                          </Badge>
                        </div>
                        {getStatusBadge(campaign.status)}
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <div className="text-gray-600 dark:text-gray-400">
                            Impressions
                          </div>
                          <div className="font-medium">
                            {formatNumber(campaign.impressions)}
                          </div>
                        </div>
                        <div>
                          <div className="text-gray-600 dark:text-gray-400">
                            Clicks
                          </div>
                          <div className="font-medium">
                            {formatNumber(campaign.clicks)}
                          </div>
                        </div>
                        <div>
                          <div className="text-gray-600 dark:text-gray-400">
                            ROI
                          </div>
                          <div className="font-medium text-green-600">
                            {campaign.roi}%
                          </div>
                        </div>
                        <div>
                          <div className="text-gray-600 dark:text-gray-400">
                            Revenue
                          </div>
                          <div className="font-medium">
                            {formatCurrency(campaign.additionalRevenue)}
                          </div>
                        </div>
                      </div>

                      <div className="text-xs text-gray-500 mt-2">
                        {formatDistanceToNow(new Date(campaign.createdAt), {
                          addSuffix: true,
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Analytics */}
        <TabsContent value="analytics" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-2 mb-2">
                  <Eye className="w-4 h-4 text-blue-500" />
                  <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    Total Reach
                  </span>
                </div>
                <div className="text-2xl font-bold">
                  {formatNumber(
                    activeCampaigns.reduce((sum, c) => sum + c.impressions, 0) +
                      pastCampaigns.reduce((sum, c) => sum + c.impressions, 0),
                  )}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-2 mb-2">
                  <Target className="w-4 h-4 text-green-500" />
                  <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    Avg. ROI
                  </span>
                </div>
                <div className="text-2xl font-bold text-green-600">
                  {Math.round(
                    [...activeCampaigns, ...pastCampaigns].reduce(
                      (sum, c) => sum + c.roi,
                      0,
                    ) / [...activeCampaigns, ...pastCampaigns].length || 0,
                  )}
                  %
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-2 mb-2">
                  <DollarSign className="w-4 h-4 text-purple-500" />
                  <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    Total Revenue
                  </span>
                </div>
                <div className="text-2xl font-bold">
                  {formatCurrency(
                    activeCampaigns.reduce(
                      (sum, c) => sum + c.additionalRevenue,
                      0,
                    ) +
                      pastCampaigns.reduce(
                        (sum, c) => sum + c.additionalRevenue,
                        0,
                      ),
                  )}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-2 mb-2">
                  <Coins className="w-4 h-4 text-yellow-500" />
                  <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    SP Invested
                  </span>
                </div>
                <div className="text-2xl font-bold">
                  {formatNumber(
                    [...activeCampaigns, ...pastCampaigns]
                      .filter((c) => c.paymentMethod === "soft_points")
                      .reduce((sum, c) => sum + c.cost, 0),
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Performance Trends</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center">
                <span className="text-gray-500">
                  Analytics Chart Placeholder
                </span>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default BoostManager;
