import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
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
import {
  Trophy,
  Gift,
  Coins,
  Star,
  Zap,
  Target,
  Award,
  DollarSign,
  CreditCard,
  Wallet,
  ShoppingCart,
  TrendingUp,
  Calendar,
  Users,
  Heart,
  MessageSquare,
  Share2,
  Eye,
  ThumbsUp,
  Clock,
  CheckCircle,
  ArrowRight,
  Crown,
  Gem,
  Sparkles,
  Banknote,
  PiggyBank,
  Receipt,
  History,
  Settings,
  ChevronRight,
  Plus,
  Minus,
  ExternalLink,
  RefreshCw,
  Download,
} from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { cn } from "@/lib/utils";
import { PartnershipSystem } from "@/components/rewards/PartnershipSystem";

// Types for SoftPoints system
interface Activity {
  id: string;
  type: "social" | "trading" | "marketplace" | "referral" | "daily" | "special";
  name: string;
  description: string;
  points: number;
  icon: any;
  color: string;
  frequency: "once" | "daily" | "unlimited" | "weekly" | "monthly";
  completed?: boolean;
  completedToday?: boolean;
  progress?: number;
  maxProgress?: number;
}

interface UserStats {
  totalEarned: number;
  totalSpent: number;
  currentBalance: number;
  level: string;
  levelProgress: number;
  nextLevelPoints: number;
  streakDays: number;
  rank: number;
  totalUsers: number;
}

interface Reward {
  id: string;
  type: "discount" | "cash" | "product" | "service" | "premium" | "exclusive";
  name: string;
  description: string;
  pointsRequired: number;
  value: string;
  icon: any;
  category: string;
  availability: number;
  featured?: boolean;
  discount?: number;
}

interface Transaction {
  id: string;
  type: "earned" | "spent" | "converted";
  amount: number;
  description: string;
  timestamp: string;
  category: string;
  status: "completed" | "pending" | "failed";
}

export default function EnhancedRewards() {
  const [activeTab, setActiveTab] = useState("overview");
  const [userStats, setUserStats] = useState<UserStats>({
    totalEarned: 12450,
    totalSpent: 3200,
    currentBalance: 9250,
    level: "Gold",
    levelProgress: 65,
    nextLevelPoints: 2750,
    streakDays: 7,
    rank: 234,
    totalUsers: 10000,
  });
  const [conversionAmount, setConversionAmount] = useState("");
  const [purchaseAmount, setPurchaseAmount] = useState("");
  const [showConvertDialog, setShowConvertDialog] = useState(false);
  const [showPurchaseDialog, setShowPurchaseDialog] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const { user } = useAuth();
  const { toast } = useToast();

  // Mock data for activities
  const activities: Activity[] = [
    {
      id: "daily_login",
      type: "daily",
      name: "Daily Login",
      description: "Login to your account daily",
      points: 50,
      icon: Calendar,
      color: "bg-blue-500",
      frequency: "daily",
      completed: true,
    },
    {
      id: "create_post",
      type: "social",
      name: "Create Post",
      description: "Share content with the community",
      points: 100,
      icon: MessageSquare,
      color: "bg-green-500",
      frequency: "unlimited",
    },
    {
      id: "like_posts",
      type: "social",
      name: "Like Posts",
      description: "Engage with community content",
      points: 10,
      icon: Heart,
      color: "bg-pink-500",
      frequency: "unlimited",
      progress: 15,
      maxProgress: 20,
    },
    {
      id: "crypto_trade",
      type: "trading",
      name: "Crypto Trading",
      description: "Trade cryptocurrencies",
      points: 200,
      icon: TrendingUp,
      color: "bg-orange-500",
      frequency: "unlimited",
    },
    {
      id: "marketplace_purchase",
      type: "marketplace",
      name: "Marketplace Purchase",
      description: "Buy products from marketplace",
      points: 500,
      icon: ShoppingCart,
      color: "bg-purple-500",
      frequency: "unlimited",
    },
    {
      id: "refer_friend",
      type: "referral",
      name: "Refer Friends",
      description: "Invite friends to join SoftChat",
      points: 1000,
      icon: Users,
      color: "bg-indigo-500",
      frequency: "unlimited",
    },
    {
      id: "complete_profile",
      type: "special",
      name: "Complete Profile",
      description: "Fill out all profile information",
      points: 300,
      icon: Star,
      color: "bg-yellow-500",
      frequency: "once",
      completed: true,
    },
    {
      id: "weekly_challenge",
      type: "special",
      name: "Weekly Challenge",
      description: "Complete weekly community challenge",
      points: 750,
      icon: Trophy,
      color: "bg-red-500",
      frequency: "weekly",
      progress: 3,
      maxProgress: 5,
    },
  ];

  // Mock data for rewards
  const rewards: Reward[] = [
    {
      id: "cash_5",
      type: "cash",
      name: "$5 Cash",
      description: "Convert SoftPoints to real money",
      pointsRequired: 500,
      value: "$5.00",
      icon: DollarSign,
      category: "Money",
      availability: 999,
      featured: true,
    },
    {
      id: "cash_25",
      type: "cash",
      name: "$25 Cash",
      description: "Convert SoftPoints to real money",
      pointsRequired: 2500,
      value: "$25.00",
      icon: Banknote,
      category: "Money",
      availability: 999,
      featured: true,
    },
    {
      id: "cash_100",
      type: "cash",
      name: "$100 Cash",
      description: "Convert SoftPoints to real money",
      pointsRequired: 10000,
      value: "$100.00",
      icon: PiggyBank,
      category: "Money",
      availability: 999,
      featured: true,
    },
    {
      id: "premium_month",
      type: "premium",
      name: "Premium Membership",
      description: "30 days of premium features",
      pointsRequired: 1500,
      value: "30 days",
      icon: Crown,
      category: "Premium",
      availability: 100,
      discount: 50,
    },
    {
      id: "marketplace_credit",
      type: "product",
      name: "Marketplace Credit",
      description: "$20 credit for marketplace purchases",
      pointsRequired: 1800,
      value: "$20.00",
      icon: ShoppingCart,
      category: "Shopping",
      availability: 50,
    },
    {
      id: "crypto_bonus",
      type: "service",
      name: "Trading Bonus",
      description: "0% trading fees for 1 week",
      pointsRequired: 1200,
      value: "7 days",
      icon: Zap,
      category: "Trading",
      availability: 75,
    },
    {
      id: "exclusive_nft",
      type: "exclusive",
      name: "Exclusive NFT",
      description: "Limited edition SoftChat NFT",
      pointsRequired: 5000,
      value: "Unique",
      icon: Gem,
      category: "Collectibles",
      availability: 10,
      featured: true,
    },
  ];

  // Mock transaction history
  const transactions: Transaction[] = [
    {
      id: "1",
      type: "earned",
      amount: 1000,
      description: "Referred a friend",
      timestamp: new Date().toISOString(),
      category: "Referral",
      status: "completed",
    },
    {
      id: "2",
      type: "spent",
      amount: 500,
      description: "Redeemed $5 cash",
      timestamp: new Date(Date.now() - 86400000).toISOString(),
      category: "Cash Conversion",
      status: "completed",
    },
    {
      id: "3",
      type: "earned",
      amount: 200,
      description: "Crypto trading activity",
      timestamp: new Date(Date.now() - 172800000).toISOString(),
      category: "Trading",
      status: "completed",
    },
    {
      id: "4",
      type: "converted",
      amount: 2500,
      description: "Converted to $25 cash",
      timestamp: new Date(Date.now() - 259200000).toISOString(),
      category: "Money",
      status: "pending",
    },
  ];

  const levelInfo = {
    Bronze: { min: 0, max: 5000, color: "bg-orange-600", next: "Silver" },
    Silver: { min: 5000, max: 15000, color: "bg-gray-400", next: "Gold" },
    Gold: { min: 15000, max: 50000, color: "bg-yellow-500", next: "Platinum" },
    Platinum: {
      min: 50000,
      max: 100000,
      color: "bg-purple-600",
      next: "Diamond",
    },
    Diamond: { min: 100000, max: Infinity, color: "bg-blue-600", next: null },
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  const formatPoints = (points: number) => {
    return new Intl.NumberFormat("en-US").format(points);
  };

  const calculateCashValue = (points: number) => {
    return formatCurrency(points / 100); // 100 SP = $1
  };

  const handleCompleteActivity = (activityId: string) => {
    const activity = activities.find((a) => a.id === activityId);
    if (!activity) return;

    setUserStats((prev) => ({
      ...prev,
      currentBalance: prev.currentBalance + activity.points,
      totalEarned: prev.totalEarned + activity.points,
    }));

    toast({
      title: "SoftPoints Earned!",
      description: `You earned ${activity.points} SP for ${activity.name}`,
    });
  };

  const handleConvertToCash = () => {
    const points = parseInt(conversionAmount);
    if (!points || points > userStats.currentBalance) return;

    setIsLoading(true);
    setTimeout(() => {
      setUserStats((prev) => ({
        ...prev,
        currentBalance: prev.currentBalance - points,
        totalSpent: prev.totalSpent + points,
      }));

      toast({
        title: "Conversion Successful!",
        description: `${points} SP converted to ${calculateCashValue(points)}`,
      });

      setConversionAmount("");
      setShowConvertDialog(false);
      setIsLoading(false);
    }, 2000);
  };

  const handleRedeemReward = (reward: Reward) => {
    if (userStats.currentBalance < reward.pointsRequired) {
      toast({
        title: "Insufficient Points",
        description: `You need ${reward.pointsRequired - userStats.currentBalance} more SP`,
        variant: "destructive",
      });
      return;
    }

    setUserStats((prev) => ({
      ...prev,
      currentBalance: prev.currentBalance - reward.pointsRequired,
      totalSpent: prev.totalSpent + reward.pointsRequired,
    }));

    toast({
      title: "Reward Redeemed!",
      description: `You've redeemed ${reward.name}`,
    });
  };

  const getLevelBadge = (level: string) => {
    const info = levelInfo[level as keyof typeof levelInfo];
    return <Badge className={cn("text-white", info.color)}>{level}</Badge>;
  };

  return (
    <div className="mobile-container mobile-space-y">
      {/* Header */}
      <div className="mobile-flex lg:items-start lg:justify-between">
        <div className="min-w-0 flex-1">
          <h1 className="text-2xl md:text-3xl font-bold">SoftPoints Rewards</h1>
          <p className="text-sm md:text-base text-gray-600 mt-1">
            Earn SoftPoints for every activity and convert them to real money
          </p>
        </div>

        <div className="flex items-center gap-4 flex-shrink-0">
          <Card className="bg-gradient-to-r from-blue-500 to-purple-600 text-white">
            <CardContent className="p-3 md:p-4 flex items-center gap-2 md:gap-3">
              <Coins className="h-6 w-6 md:h-8 md:w-8 flex-shrink-0" />
              <div className="min-w-0">
                <div className="text-xs md:text-sm opacity-90">
                  Your Balance
                </div>
                <div className="text-xl md:text-2xl font-bold">
                  {formatPoints(userStats.currentBalance)} SP
                </div>
                <div className="text-xs md:text-sm opacity-90 truncate">
                  ≈ {calculateCashValue(userStats.currentBalance)}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="mobile-grid-2">
        <Card>
          <CardContent className="p-3 md:p-4">
            <div className="flex items-center gap-2 md:gap-3">
              <div className="p-1.5 md:p-2 bg-green-100 rounded-lg flex-shrink-0">
                <TrendingUp className="h-4 w-4 md:h-5 md:w-5 text-green-600" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-xs md:text-sm text-gray-600">
                  Total Earned
                </div>
                <div className="text-lg md:text-xl font-bold">
                  {formatPoints(userStats.totalEarned)} SP
                </div>
                <div className="text-xs md:text-sm text-gray-500 truncate">
                  ≈ {calculateCashValue(userStats.totalEarned)}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-3 md:p-4">
            <div className="flex items-center gap-2 md:gap-3">
              <div className="p-1.5 md:p-2 bg-blue-100 rounded-lg flex-shrink-0">
                <Award className="h-4 w-4 md:h-5 md:w-5 text-blue-600" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-xs md:text-sm text-gray-600">
                  Current Level
                </div>
                <div className="flex items-center gap-2">
                  {getLevelBadge(userStats.level)}
                  <span className="text-xs md:text-sm text-gray-500">
                    #{userStats.rank}
                  </span>
                </div>
                <div className="text-xs md:text-sm text-gray-500 truncate">
                  {userStats.nextLevelPoints} SP to next level
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-3 md:p-4">
            <div className="flex items-center gap-2 md:gap-3">
              <div className="p-1.5 md:p-2 bg-orange-100 rounded-lg flex-shrink-0">
                <Target className="h-4 w-4 md:h-5 md:w-5 text-orange-600" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-xs md:text-sm text-gray-600">
                  Daily Streak
                </div>
                <div className="text-lg md:text-xl font-bold">
                  {userStats.streakDays} days
                </div>
                <div className="text-xs md:text-sm text-gray-500">
                  Keep it up!
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-3 md:p-4">
            <div className="flex items-center gap-2 md:gap-3">
              <div className="p-1.5 md:p-2 bg-purple-100 rounded-lg flex-shrink-0">
                <Users className="h-4 w-4 md:h-5 md:w-5 text-purple-600" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-xs md:text-sm text-gray-600">
                  Community Rank
                </div>
                <div className="text-lg md:text-xl font-bold">
                  #{userStats.rank}
                </div>
                <div className="text-xs md:text-sm text-gray-500 truncate">
                  of {formatPoints(userStats.totalUsers)} users
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        {/* Mobile optimized tab list */}
        <div className="w-full mobile-tabs">
          <div className="border-b border-gray-200">
            <TabsList className="inline-flex h-auto bg-transparent min-w-max p-0 gap-1">
              <TabsTrigger
                value="overview"
                className="whitespace-nowrap px-3 py-2 text-sm data-[state=active]:border-b-2 data-[state=active]:border-blue-500 data-[state=active]:bg-transparent rounded-none"
              >
                Overview
              </TabsTrigger>
              <TabsTrigger
                value="earn"
                className="whitespace-nowrap px-3 py-2 text-sm data-[state=active]:border-b-2 data-[state=active]:border-blue-500 data-[state=active]:bg-transparent rounded-none"
              >
                Earn Points
              </TabsTrigger>
              <TabsTrigger
                value="redeem"
                className="whitespace-nowrap px-3 py-2 text-sm data-[state=active]:border-b-2 data-[state=active]:border-blue-500 data-[state=active]:bg-transparent rounded-none"
              >
                Redeem
              </TabsTrigger>
              <TabsTrigger
                value="convert"
                className="whitespace-nowrap px-3 py-2 text-sm data-[state=active]:border-b-2 data-[state=active]:border-blue-500 data-[state=active]:bg-transparent rounded-none"
              >
                Convert
              </TabsTrigger>
              <TabsTrigger
                value="history"
                className="whitespace-nowrap px-3 py-2 text-sm data-[state=active]:border-b-2 data-[state=active]:border-blue-500 data-[state=active]:bg-transparent rounded-none"
              >
                History
              </TabsTrigger>
            </TabsList>
          </div>
        </div>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-4 md:space-y-6 mt-4">
          {/* Level Progress */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-base md:text-lg">
                <Crown className="h-4 w-4 md:h-5 md:w-5" />
                Level Progress
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 md:space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                  <div className="flex items-center gap-2 md:gap-3">
                    {getLevelBadge(userStats.level)}
                    <ArrowRight className="h-3 w-3 md:h-4 md:w-4 text-gray-400" />
                    {levelInfo[userStats.level as keyof typeof levelInfo]
                      .next && (
                      <Badge variant="outline">
                        {
                          levelInfo[userStats.level as keyof typeof levelInfo]
                            .next
                        }
                      </Badge>
                    )}
                  </div>
                  <div className="text-xs md:text-sm text-gray-600">
                    {userStats.levelProgress}% Complete
                  </div>
                </div>
                <Progress
                  value={userStats.levelProgress}
                  className="h-2 md:h-3"
                />
                <div className="text-xs md:text-sm text-gray-600">
                  {userStats.nextLevelPoints} more SP needed to reach the next
                  level
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
            <Card
              className="hover:shadow-lg transition-shadow cursor-pointer"
              onClick={() => setActiveTab("earn")}
            >
              <CardContent className="p-4 md:p-6 text-center">
                <div className="p-2 md:p-3 bg-green-100 rounded-full mx-auto w-fit mb-3 md:mb-4">
                  <Plus className="h-6 w-6 md:h-8 md:w-8 text-green-600" />
                </div>
                <h3 className="font-semibold text-base md:text-lg mb-2">
                  Earn More Points
                </h3>
                <p className="text-sm md:text-base text-gray-600 mb-3 md:mb-4">
                  Complete activities to earn SoftPoints
                </p>
                <Button className="w-full text-sm md:text-base">
                  Start Earning
                </Button>
              </CardContent>
            </Card>

            <Card
              className="hover:shadow-lg transition-shadow cursor-pointer"
              onClick={() => setActiveTab("convert")}
            >
              <CardContent className="p-4 md:p-6 text-center">
                <div className="p-2 md:p-3 bg-blue-100 rounded-full mx-auto w-fit mb-3 md:mb-4">
                  <DollarSign className="h-6 w-6 md:h-8 md:w-8 text-blue-600" />
                </div>
                <h3 className="font-semibold text-base md:text-lg mb-2">
                  Convert to Cash
                </h3>
                <p className="text-sm md:text-base text-gray-600 mb-3 md:mb-4">
                  Turn your SoftPoints into real money
                </p>
                <Button
                  variant="outline"
                  className="w-full text-sm md:text-base"
                >
                  Convert Now
                </Button>
              </CardContent>
            </Card>

            <Card
              className="hover:shadow-lg transition-shadow cursor-pointer"
              onClick={() => setActiveTab("redeem")}
            >
              <CardContent className="p-4 md:p-6 text-center">
                <div className="p-2 md:p-3 bg-purple-100 rounded-full mx-auto w-fit mb-3 md:mb-4">
                  <Gift className="h-6 w-6 md:h-8 md:w-8 text-purple-600" />
                </div>
                <h3 className="font-semibold text-base md:text-lg mb-2">
                  Redeem Rewards
                </h3>
                <p className="text-sm md:text-base text-gray-600 mb-3 md:mb-4">
                  Exchange points for exclusive rewards
                </p>
                <Button
                  variant="outline"
                  className="w-full text-sm md:text-base"
                >
                  Browse Rewards
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Featured Rewards */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base md:text-lg">
                <Sparkles className="h-4 w-4 md:h-5 md:w-5" />
                Featured Rewards
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4">
                {rewards
                  .filter((r) => r.featured)
                  .map((reward) => (
                    <div
                      key={reward.id}
                      className="border rounded-lg p-3 md:p-4 hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-center gap-2 md:gap-3 mb-3">
                        <div
                          className={cn(
                            "p-1.5 md:p-2 rounded-lg flex-shrink-0",
                            reward.type === "cash"
                              ? "bg-green-100"
                              : reward.type === "premium"
                                ? "bg-purple-100"
                                : "bg-blue-100",
                          )}
                        >
                          <reward.icon
                            className={cn(
                              "h-4 w-4 md:h-5 md:w-5",
                              reward.type === "cash"
                                ? "text-green-600"
                                : reward.type === "premium"
                                  ? "text-purple-600"
                                  : "text-blue-600",
                            )}
                          />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="font-semibold text-sm md:text-base truncate">
                            {reward.name}
                          </div>
                          <div className="text-xs md:text-sm text-gray-600">
                            {reward.value}
                          </div>
                        </div>
                      </div>
                      <div className="text-xs md:text-sm text-gray-600 mb-3">
                        {reward.description}
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-blue-600 text-sm md:text-base">
                          {formatPoints(reward.pointsRequired)} SP
                        </span>
                        <Button
                          size="sm"
                          onClick={() => handleRedeemReward(reward)}
                          disabled={
                            userStats.currentBalance < reward.pointsRequired
                          }
                          className="text-xs md:text-sm"
                        >
                          Redeem
                        </Button>
                      </div>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Earn Points Tab */}
        <TabsContent value="earn" className="space-y-4 md:space-y-6 mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base md:text-lg">
                <Target className="h-4 w-4 md:h-5 md:w-5" />
                Daily Activities
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
                {activities
                  .filter((a) => a.type === "daily")
                  .map((activity) => (
                    <div
                      key={activity.id}
                      className="border rounded-lg p-3 md:p-4"
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2 md:gap-3 min-w-0 flex-1">
                          <div
                            className={cn(
                              "p-1.5 md:p-2 rounded-lg flex-shrink-0",
                              activity.color,
                            )}
                          >
                            <activity.icon className="h-4 w-4 md:h-5 md:w-5 text-white" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="font-semibold text-sm md:text-base">
                              {activity.name}
                            </div>
                            <div className="text-xs md:text-sm text-gray-600">
                              {activity.description}
                            </div>
                          </div>
                        </div>
                        <div className="text-right flex-shrink-0">
                          <div className="font-semibold text-blue-600 text-sm md:text-base">
                            +{activity.points} SP
                          </div>
                          {activity.completed ? (
                            <CheckCircle className="h-4 w-4 md:h-5 md:w-5 text-green-500 ml-auto" />
                          ) : (
                            <Button
                              size="sm"
                              onClick={() =>
                                handleCompleteActivity(activity.id)
                              }
                              className="text-xs md:text-sm"
                            >
                              Complete
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base md:text-lg">
                <Zap className="h-4 w-4 md:h-5 md:w-5" />
                Social Activities
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
                {activities
                  .filter((a) => a.type === "social")
                  .map((activity) => (
                    <div
                      key={activity.id}
                      className="border rounded-lg p-3 md:p-4"
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2 md:gap-3 min-w-0 flex-1">
                          <div
                            className={cn(
                              "p-1.5 md:p-2 rounded-lg flex-shrink-0",
                              activity.color,
                            )}
                          >
                            <activity.icon className="h-4 w-4 md:h-5 md:w-5 text-white" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="font-semibold text-sm md:text-base">
                              {activity.name}
                            </div>
                            <div className="text-xs md:text-sm text-gray-600">
                              {activity.description}
                            </div>
                          </div>
                        </div>
                        <div className="text-right flex-shrink-0">
                          <div className="font-semibold text-blue-600 text-sm md:text-base">
                            +{activity.points} SP
                          </div>
                          <Button
                            size="sm"
                            onClick={() => handleCompleteActivity(activity.id)}
                            className="text-xs md:text-sm"
                          >
                            Do Now
                          </Button>
                        </div>
                      </div>
                      {activity.progress && activity.maxProgress && (
                        <div className="mt-3">
                          <div className="flex justify-between text-xs md:text-sm mb-1">
                            <span>Progress</span>
                            <span>
                              {activity.progress}/{activity.maxProgress}
                            </span>
                          </div>
                          <Progress
                            value={
                              (activity.progress / activity.maxProgress) * 100
                            }
                            className="h-2"
                          />
                        </div>
                      )}
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base md:text-lg">
                <Trophy className="h-4 w-4 md:h-5 md:w-5" />
                Platform Activities
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
                {activities
                  .filter((a) =>
                    ["trading", "marketplace", "referral"].includes(a.type),
                  )
                  .map((activity) => (
                    <div
                      key={activity.id}
                      className="border rounded-lg p-3 md:p-4"
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2 md:gap-3 min-w-0 flex-1">
                          <div
                            className={cn(
                              "p-1.5 md:p-2 rounded-lg flex-shrink-0",
                              activity.color,
                            )}
                          >
                            <activity.icon className="h-4 w-4 md:h-5 md:w-5 text-white" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="font-semibold text-sm md:text-base">
                              {activity.name}
                            </div>
                            <div className="text-xs md:text-sm text-gray-600">
                              {activity.description}
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-blue-600 text-sm md:text-base">
                          +{activity.points} SP
                        </span>
                        <Button
                          size="sm"
                          onClick={() => handleCompleteActivity(activity.id)}
                          className="text-xs md:text-sm"
                        >
                          Start
                        </Button>
                      </div>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Redeem Tab */}
        <TabsContent value="redeem" className="space-y-4 md:space-y-6 mt-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <h2 className="text-xl md:text-2xl font-bold">Redeem Rewards</h2>
            <Select defaultValue="all">
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Filter by category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="money">Money</SelectItem>
                <SelectItem value="premium">Premium</SelectItem>
                <SelectItem value="shopping">Shopping</SelectItem>
                <SelectItem value="trading">Trading</SelectItem>
                <SelectItem value="collectibles">Collectibles</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {rewards.map((reward) => (
              <Card
                key={reward.id}
                className="hover:shadow-lg transition-shadow"
              >
                <CardContent className="p-4 md:p-6">
                  <div className="flex items-center gap-2 md:gap-3 mb-3 md:mb-4">
                    <div
                      className={cn(
                        "p-2 md:p-3 rounded-lg flex-shrink-0",
                        reward.type === "cash"
                          ? "bg-green-100"
                          : reward.type === "premium"
                            ? "bg-purple-100"
                            : reward.type === "product"
                              ? "bg-blue-100"
                              : reward.type === "service"
                                ? "bg-orange-100"
                                : "bg-pink-100",
                      )}
                    >
                      <reward.icon
                        className={cn(
                          "h-5 w-5 md:h-6 md:w-6",
                          reward.type === "cash"
                            ? "text-green-600"
                            : reward.type === "premium"
                              ? "text-purple-600"
                              : reward.type === "product"
                                ? "text-blue-600"
                                : reward.type === "service"
                                  ? "text-orange-600"
                                  : "text-pink-600",
                        )}
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="font-semibold text-base md:text-lg truncate">
                        {reward.name}
                      </h3>
                      <div className="text-xs md:text-sm text-gray-600">
                        {reward.category}
                      </div>
                    </div>
                  </div>

                  <p className="text-sm md:text-base text-gray-600 mb-3 md:mb-4">
                    {reward.description}
                  </p>

                  <div className="space-y-2 md:space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs md:text-sm text-gray-600">
                        Value:
                      </span>
                      <span className="font-semibold text-sm md:text-base">
                        {reward.value}
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-xs md:text-sm text-gray-600">
                        Cost:
                      </span>
                      <span className="font-semibold text-blue-600 text-sm md:text-base">
                        {formatPoints(reward.pointsRequired)} SP
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-xs md:text-sm text-gray-600">
                        Available:
                      </span>
                      <span className="text-xs md:text-sm">
                        {reward.availability > 100
                          ? "100+"
                          : reward.availability}
                      </span>
                    </div>

                    {reward.discount && (
                      <Badge
                        variant="secondary"
                        className="w-full justify-center text-xs md:text-sm"
                      >
                        {reward.discount}% Off
                      </Badge>
                    )}
                  </div>

                  <Button
                    className="w-full mt-3 md:mt-4 text-sm md:text-base"
                    onClick={() => handleRedeemReward(reward)}
                    disabled={userStats.currentBalance < reward.pointsRequired}
                  >
                    {userStats.currentBalance < reward.pointsRequired
                      ? `Need ${formatPoints(reward.pointsRequired - userStats.currentBalance)} more SP`
                      : "Redeem Now"}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Convert to Cash Tab */}
        <TabsContent value="convert" className="space-y-4 md:space-y-6 mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base md:text-lg">
                <DollarSign className="h-4 w-4 md:h-5 md:w-5" />
                Convert SoftPoints to Cash
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
                <div className="space-y-4 md:space-y-6">
                  <div className="bg-blue-50 rounded-lg p-3 md:p-4">
                    <h3 className="font-semibold mb-2 text-sm md:text-base">
                      Conversion Rate
                    </h3>
                    <div className="text-xl md:text-2xl font-bold text-blue-600">
                      100 SP = $1.00
                    </div>
                    <p className="text-xs md:text-sm text-gray-600 mt-1">
                      Minimum conversion: 500 SP ($5.00)
                    </p>
                  </div>

                  <div className="space-y-3 md:space-y-4">
                    <div>
                      <label className="text-xs md:text-sm font-medium mb-2 block">
                        Enter SoftPoints to Convert
                      </label>
                      <Input
                        type="number"
                        placeholder="Enter amount (min 500 SP)"
                        value={conversionAmount}
                        onChange={(e) => setConversionAmount(e.target.value)}
                        min="500"
                        max={userStats.currentBalance}
                        className="text-sm md:text-base"
                      />
                    </div>

                    {conversionAmount && parseInt(conversionAmount) >= 500 && (
                      <div className="bg-green-50 rounded-lg p-3 md:p-4">
                        <div className="flex justify-between items-center">
                          <span className="text-sm md:text-base">
                            You will receive:
                          </span>
                          <span className="text-lg md:text-xl font-bold text-green-600">
                            {calculateCashValue(parseInt(conversionAmount))}
                          </span>
                        </div>
                      </div>
                    )}

                    <Button
                      className="w-full text-sm md:text-base"
                      onClick={() => setShowConvertDialog(true)}
                      disabled={
                        !conversionAmount ||
                        parseInt(conversionAmount) < 500 ||
                        parseInt(conversionAmount) > userStats.currentBalance
                      }
                    >
                      Convert to Cash
                    </Button>
                  </div>
                </div>

                <div className="space-y-3 md:space-y-4">
                  <h3 className="font-semibold text-sm md:text-base">
                    Quick Convert Options
                  </h3>

                  <div className="space-y-2 md:space-y-3">
                    {[
                      { sp: 500, cash: 5 },
                      { sp: 1000, cash: 10 },
                      { sp: 2500, cash: 25 },
                      { sp: 5000, cash: 50 },
                      { sp: 10000, cash: 100 },
                    ].map((option) => (
                      <div
                        key={option.sp}
                        className={cn(
                          "border rounded-lg p-2 md:p-3 cursor-pointer hover:bg-gray-50 transition-colors",
                          userStats.currentBalance < option.sp &&
                            "opacity-50 cursor-not-allowed",
                        )}
                        onClick={() =>
                          userStats.currentBalance >= option.sp &&
                          setConversionAmount(option.sp.toString())
                        }
                      >
                        <div className="flex justify-between items-center">
                          <span className="font-medium text-sm md:text-base">
                            {formatPoints(option.sp)} SP
                          </span>
                          <span className="text-green-600 font-semibold text-sm md:text-base">
                            ${option.cash}.00
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Payment Methods */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base md:text-lg">
                Payment Methods
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4">
                <div className="border rounded-lg p-3 md:p-4 text-center">
                  <CreditCard className="h-6 w-6 md:h-8 md:w-8 mx-auto mb-2 text-blue-600" />
                  <div className="font-semibold text-sm md:text-base">
                    Bank Transfer
                  </div>
                  <div className="text-xs md:text-sm text-gray-600">
                    2-3 business days
                  </div>
                </div>
                <div className="border rounded-lg p-3 md:p-4 text-center">
                  <Wallet className="h-6 w-6 md:h-8 md:w-8 mx-auto mb-2 text-green-600" />
                  <div className="font-semibold text-sm md:text-base">
                    Digital Wallet
                  </div>
                  <div className="text-xs md:text-sm text-gray-600">
                    Instant transfer
                  </div>
                </div>
                <div className="border rounded-lg p-3 md:p-4 text-center">
                  <Receipt className="h-6 w-6 md:h-8 md:w-8 mx-auto mb-2 text-purple-600" />
                  <div className="font-semibold text-sm md:text-base">
                    Check
                  </div>
                  <div className="text-xs md:text-sm text-gray-600">
                    5-7 business days
                  </div>
                </div>
          </div>
        </TabsContent>

        {/* Partnerships Tab */}
        <TabsContent value="partnerships" className="space-y-4 md:space-y-6 mt-4">
          <PartnershipSystem />
        </TabsContent>

        {/* History Tab */}
        <TabsContent value="history" className="space-y-4 md:space-y-6 mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base md:text-lg">
                <History className="h-4 w-4 md:h-5 md:w-5" />
                Transaction History
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 md:space-y-4">
                {transactions.map((transaction) => (
                  <div
                    key={transaction.id}
                    className="flex items-center justify-between p-3 md:p-4 border rounded-lg"
                  >
                    <div className="flex items-center gap-2 md:gap-3 min-w-0 flex-1">
                      <div
                        className={cn(
                          "p-1.5 md:p-2 rounded-lg flex-shrink-0",
                          transaction.type === "earned"
                            ? "bg-green-100"
                            : transaction.type === "spent"
                              ? "bg-red-100"
                              : "bg-blue-100",
                        )}
                      >
                        {transaction.type === "earned" ? (
                          <Plus
                            className={cn(
                              "h-4 w-4 md:h-5 md:w-5 text-green-600",
                            )}
                          />
                        ) : transaction.type === "spent" ? (
                          <Minus
                            className={cn("h-4 w-4 md:h-5 md:w-5 text-red-600")}
                          />
                        ) : (
                          <RefreshCw
                            className={cn(
                              "h-4 w-4 md:h-5 md:w-5 text-blue-600",
                            )}
                          />
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="font-semibold text-sm md:text-base">
                          {transaction.description}
                        </div>
                        <div className="text-xs md:text-sm text-gray-600">
                          {new Date(transaction.timestamp).toLocaleDateString()}{" "}
                          • {transaction.category}
                        </div>
                      </div>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <div
                        className={cn(
                          "font-semibold text-sm md:text-base",
                          transaction.type === "earned"
                            ? "text-green-600"
                            : transaction.type === "spent"
                              ? "text-red-600"
                              : "text-blue-600",
                        )}
                      >
                        {transaction.type === "earned" ? "+" : "-"}
                        {formatPoints(transaction.amount)} SP
                      </div>
                      <Badge
                        variant={
                          transaction.status === "completed"
                            ? "default"
                            : transaction.status === "pending"
                              ? "secondary"
                              : "destructive"
                        }
                        className="text-xs"
                      >
                        {transaction.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Convert Dialog */}
      <Dialog open={showConvertDialog} onOpenChange={setShowConvertDialog}>
        <DialogContent className="w-[95vw] max-w-md">
          <DialogHeader>
            <DialogTitle className="text-lg">
              Confirm Cash Conversion
            </DialogTitle>
            <DialogDescription className="text-sm">
              Are you sure you want to convert {conversionAmount} SoftPoints to{" "}
              {calculateCashValue(parseInt(conversionAmount || "0"))}?
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="bg-gray-50 rounded-lg p-3 md:p-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>SoftPoints:</span>
                  <span className="font-semibold">{conversionAmount} SP</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Cash Value:</span>
                  <span className="font-semibold text-green-600">
                    {calculateCashValue(parseInt(conversionAmount || "0"))}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Processing Fee:</span>
                  <span className="font-semibold">$0.00</span>
                </div>
                <hr />
                <div className="flex justify-between text-sm">
                  <span className="font-semibold">You'll Receive:</span>
                  <span className="font-semibold text-green-600">
                    {calculateCashValue(parseInt(conversionAmount || "0"))}
                  </span>
                </div>
              </div>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => setShowConvertDialog(false)}
                className="flex-1 text-sm"
              >
                Cancel
              </Button>
              <Button
                onClick={handleConvertToCash}
                disabled={isLoading}
                className="flex-1 text-sm"
              >
                {isLoading ? "Converting..." : "Confirm Conversion"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}