import React, { useState, useEffect } from "react";
import {
  Crown,
  Star,
  Zap,
  Trophy,
  Target,
  TrendingUp,
  Users,
  Eye,
  Heart,
  MessageCircle,
  Share2,
  Gift,
  Coins,
  Award,
  Calendar,
  Clock,
  ChevronRight,
  ChevronUp,
  ChevronDown,
  Plus,
  Sparkles,
  Fire,
  CheckCircle,
  X,
  Info,
  ExternalLink,
  BarChart3,
  Bookmark,
  Play,
  Timer,
  Hash,
  ArrowUp,
  Medal,
  Flame,
  Shield,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import creatorTierService, { 
  CreatorTier, 
  DuetChallenge, 
  ChallengeParticipant,
  TierUpgradeHistory,
  CreatorTierUtils 
} from "@/services/creatorTierService";
import { formatDistanceToNow } from "date-fns";

interface CreatorTierDashboardProps {
  isOpen: boolean;
  onClose: () => void;
  userId?: string;
}

const CreatorTierDashboard: React.FC<CreatorTierDashboardProps> = ({
  isOpen,
  onClose,
  userId,
}) => {
  const { toast } = useToast();
  
  // State
  const [currentTier, setCurrentTier] = useState<CreatorTier | null>(null);
  const [activeChallenges, setActiveChallenges] = useState<DuetChallenge[]>([]);
  const [featuredChallenges, setFeaturedChallenges] = useState<DuetChallenge[]>([]);
  const [tierHistory, setTierHistory] = useState<TierUpgradeHistory[]>([]);
  const [challengeHistory, setChallengeHistory] = useState<ChallengeParticipant[]>([]);
  const [tierLeaderboard, setTierLeaderboard] = useState<any[]>([]);
  const [selectedChallenge, setSelectedChallenge] = useState<DuetChallenge | null>(null);
  const [showChallengeDetails, setShowChallengeDetails] = useState(false);
  const [showTierUpgradeCelebration, setShowTierUpgradeCelebration] = useState(false);
  const [pendingUpgrade, setPendingUpgrade] = useState<TierUpgradeHistory | null>(null);
  
  // UI State
  const [activeTab, setActiveTab] = useState("overview");
  const [isLoading, setIsLoading] = useState(false);
  
  // Load data when component opens
  useEffect(() => {
    if (isOpen) {
      loadDashboardData();
    }
  }, [isOpen, userId]);
  
  const loadDashboardData = async () => {
    setIsLoading(true);
    try {
      await Promise.all([
        loadUserTier(),
        loadActiveChallenges(),
        loadFeaturedChallenges(),
        loadTierHistory(),
        loadChallengeHistory(),
        loadTierLeaderboard(),
      ]);
    } catch (error) {
      console.error("Failed to load dashboard data:", error);
      toast({
        title: "Failed to Load Dashboard",
        description: "Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const loadUserTier = async () => {
    try {
      const tier = await creatorTierService.getUserTier(userId);
      setCurrentTier(tier);
      
      // Check for pending upgrades
      const history = await creatorTierService.getTierUpgradeHistory(userId);
      const recentUpgrade = history.find(h => !h.celebrationShown);
      if (recentUpgrade) {
        setPendingUpgrade(recentUpgrade);
        setShowTierUpgradeCelebration(true);
      }
    } catch (error) {
      console.error("Failed to load user tier:", error);
    }
  };
  
  const loadActiveChallenges = async () => {
    try {
      const challenges = await creatorTierService.getActiveChallenges(10);
      setActiveChallenges(challenges);
    } catch (error) {
      console.error("Failed to load active challenges:", error);
    }
  };
  
  const loadFeaturedChallenges = async () => {
    try {
      const challenges = await creatorTierService.getFeaturedChallenges(5);
      setFeaturedChallenges(challenges);
    } catch (error) {
      console.error("Failed to load featured challenges:", error);
    }
  };
  
  const loadTierHistory = async () => {
    try {
      const history = await creatorTierService.getTierUpgradeHistory(userId);
      setTierHistory(history);
    } catch (error) {
      console.error("Failed to load tier history:", error);
    }
  };
  
  const loadChallengeHistory = async () => {
    try {
      const { participations } = await creatorTierService.getUserChallengeHistory(userId, 10);
      setChallengeHistory(participations);
    } catch (error) {
      console.error("Failed to load challenge history:", error);
    }
  };
  
  const loadTierLeaderboard = async () => {
    try {
      const { leaderboard } = await creatorTierService.getTierLeaderboard(undefined, "weekly", 10);
      setTierLeaderboard(leaderboard);
    } catch (error) {
      console.error("Failed to load tier leaderboard:", error);
    }
  };
  
  const handleChallengeClick = async (challenge: DuetChallenge) => {
    try {
      const detailedChallenge = await creatorTierService.getChallenge(challenge.id);
      setSelectedChallenge(detailedChallenge);
      setShowChallengeDetails(true);
    } catch (error) {
      console.error("Failed to load challenge details:", error);
      toast({
        title: "Failed to Load Challenge",
        description: "Please try again later.",
        variant: "destructive",
      });
    }
  };
  
  const handleTierUpgradeCelebrationClose = async () => {
    if (pendingUpgrade) {
      try {
        await creatorTierService.markCelebrationShown(pendingUpgrade.id);
        setShowTierUpgradeCelebration(false);
        setPendingUpgrade(null);
      } catch (error) {
        console.error("Failed to mark celebration as shown:", error);
      }
    }
  };
  
  const getTierIcon = (tier: string) => {
    switch (tier) {
      case "legend": return <Crown className="w-6 h-6 text-yellow-400" />;
      case "pro_creator": return <Star className="w-6 h-6 text-purple-400" />;
      case "rising_star": return <Zap className="w-6 h-6 text-blue-400" />;
      default: return <Users className="w-6 h-6 text-gray-400" />;
    }
  };
  
  const getTierColor = (tier: string) => {
    switch (tier) {
      case "legend": return "from-yellow-400 to-orange-500";
      case "pro_creator": return "from-purple-400 to-pink-500";
      case "rising_star": return "from-blue-400 to-cyan-500";
      default: return "from-gray-400 to-gray-500";
    }
  };
  
  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };
  
  const formatCurrency = (amount: number) => {
    return amount.toLocaleString();
  };
  
  const getUpgradeRequirements = () => {
    if (!currentTier) return {};
    return CreatorTierUtils.calculateUpgradeRequirements(
      currentTier.currentTier,
      currentTier
    );
  };
  
  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="bg-gray-900 border-gray-800 text-white max-w-6xl max-h-[90vh] overflow-hidden">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {currentTier && getTierIcon(currentTier.currentTier)}
              Creator Dashboard
              {currentTier && (
                <Badge className={cn(
                  "ml-2 bg-gradient-to-r text-white",
                  getTierColor(currentTier.currentTier)
                )}>
                  {CreatorTierUtils.formatTierName(currentTier.currentTier)}
                </Badge>
              )}
            </DialogTitle>
            <DialogDescription>
              Track your progress, join challenges, and level up your creator journey
            </DialogDescription>
          </DialogHeader>
          
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-4 bg-gray-800">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="challenges">Challenges</TabsTrigger>
              <TabsTrigger value="progress">Progress</TabsTrigger>
              <TabsTrigger value="leaderboard">Leaderboard</TabsTrigger>
            </TabsList>
            
            {/* Overview Tab */}
            <TabsContent value="overview" className="space-y-4">
              <ScrollArea className="h-[500px]">
                <div className="space-y-4 pr-4">
                  {/* Current Tier Card */}
                  {currentTier && (
                    <Card className="bg-gray-800 border-gray-700">
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center gap-4">
                            <div className={cn(
                              "w-16 h-16 rounded-full bg-gradient-to-r flex items-center justify-center",
                              getTierColor(currentTier.currentTier)
                            )}>
                              {getTierIcon(currentTier.currentTier)}
                            </div>
                            <div>
                              <h3 className="text-2xl font-bold">
                                {CreatorTierUtils.formatTierName(currentTier.currentTier)}
                              </h3>
                              <p className="text-gray-400">Level {currentTier.tierLevel}</p>
                              <p className="text-sm text-gray-500">
                                {currentTier.daysInCurrentTier} days in tier
                              </p>
                            </div>
                          </div>
                          
                          <div className="text-right">
                            <div className="text-sm text-gray-400 mb-1">Progress to Next Tier</div>
                            <div className="text-2xl font-bold text-purple-400">
                              {currentTier.progressToNextTier.toFixed(1)}%
                            </div>
                          </div>
                        </div>
                        
                        <Progress value={currentTier.progressToNextTier} className="h-3 mb-4" />
                        
                        <div className="grid grid-cols-3 gap-4">
                          <div className="text-center">
                            <div className="text-lg font-bold">{formatNumber(currentTier.totalViews)}</div>
                            <div className="text-xs text-gray-400">Total Views</div>
                          </div>
                          <div className="text-center">
                            <div className="text-lg font-bold">{currentTier.duetsCreated}</div>
                            <div className="text-xs text-gray-400">Duets Created</div>
                          </div>
                          <div className="text-center">
                            <div className="text-lg font-bold">{currentTier.battlesWon}</div>
                            <div className="text-xs text-gray-400">Battles Won</div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )}
                  
                  {/* Benefits Card */}
                  {currentTier && (
                    <Card className="bg-gray-800 border-gray-700">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Gift className="w-5 h-5 text-purple-400" />
                          Your Benefits
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div className="grid grid-cols-2 gap-4">
                          <div className="flex items-center gap-2">
                            <Coins className="w-4 h-4 text-yellow-400" />
                            <span className="text-sm">
                              +{(currentTier.softPointsBonus * 100).toFixed(0)}% SoftPoints Bonus
                            </span>
                          </div>
                          
                          {currentTier.prioritySupport && (
                            <div className="flex items-center gap-2">
                              <Shield className="w-4 h-4 text-blue-400" />
                              <span className="text-sm">Priority Support</span>
                            </div>
                          )}
                          
                          {currentTier.earlyAccess && (
                            <div className="flex items-center gap-2">
                              <Sparkles className="w-4 h-4 text-purple-400" />
                              <span className="text-sm">Early Access Features</span>
                            </div>
                          )}
                          
                          {currentTier.hasBlueCheckmark && (
                            <div className="flex items-center gap-2">
                              <CheckCircle className="w-4 h-4 text-blue-400" />
                              <span className="text-sm">Verified Badge</span>
                            </div>
                          )}
                        </div>
                        
                        {currentTier.specialBadges.length > 0 && (
                          <div>
                            <div className="text-sm text-gray-400 mb-2">Special Badges</div>
                            <div className="flex flex-wrap gap-2">
                              {currentTier.specialBadges.map((badge, index) => (
                                <Badge key={index} variant="secondary" className="text-xs">
                                  {badge}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  )}
                  
                  {/* Featured Challenges */}
                  <Card className="bg-gray-800 border-gray-700">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Fire className="w-5 h-5 text-orange-400" />
                        Featured Challenges
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {featuredChallenges.slice(0, 3).map((challenge) => (
                          <div
                            key={challenge.id}
                            onClick={() => handleChallengeClick(challenge)}
                            className="flex items-center justify-between p-3 bg-gray-700 rounded-lg cursor-pointer hover:bg-gray-600 transition-colors"
                          >
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                                <Hash className="w-5 h-5 text-white" />
                              </div>
                              <div>
                                <div className="font-medium">{challenge.title}</div>
                                <div className="text-sm text-gray-400">
                                  {challenge.totalParticipants} participants
                                </div>
                              </div>
                            </div>
                            
                            <div className="text-right">
                              <div className="text-sm font-medium text-green-400">
                                {formatCurrency(challenge.topParticipantReward)} SP
                              </div>
                              <div className="text-xs text-gray-400">Top Prize</div>
                            </div>
                          </div>
                        ))}
                        
                        <Button
                          variant="outline"
                          className="w-full"
                          onClick={() => setActiveTab("challenges")}
                        >
                          View All Challenges
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                  
                  {/* Recent Achievements */}
                  <Card className="bg-gray-800 border-gray-700">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Award className="w-5 h-5 text-yellow-400" />
                        Recent Achievements
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {tierHistory.slice(0, 3).map((upgrade) => (
                          <div key={upgrade.id} className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
                              <Trophy className="w-4 h-4 text-white" />
                            </div>
                            <div>
                              <div className="font-medium">Tier Upgrade</div>
                              <div className="text-sm text-gray-400">
                                {upgrade.fromTier ? `${CreatorTierUtils.formatTierName(upgrade.fromTier)} → ` : ""}
                                {CreatorTierUtils.formatTierName(upgrade.toTier)}
                              </div>
                              <div className="text-xs text-gray-500">
                                {formatDistanceToNow(new Date(upgrade.upgradedAt))} ago
                              </div>
                            </div>
                          </div>
                        ))}
                        
                        {tierHistory.length === 0 && (
                          <div className="text-center text-gray-400 py-4">
                            No achievements yet. Start creating to earn your first tier upgrade!
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </ScrollArea>
            </TabsContent>
            
            {/* Challenges Tab */}
            <TabsContent value="challenges" className="space-y-4">
              <ScrollArea className="h-[500px]">
                <div className="space-y-4 pr-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {activeChallenges.map((challenge) => (
                      <Card
                        key={challenge.id}
                        className="bg-gray-800 border-gray-700 cursor-pointer hover:bg-gray-750 transition-colors"
                        onClick={() => handleChallengeClick(challenge)}
                      >
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex items-center gap-2">
                              <Badge className="bg-purple-500/20 text-purple-400">
                                {challenge.hashtag}
                              </Badge>
                              {challenge.featuredOnHomepage && (
                                <Badge className="bg-orange-500/20 text-orange-400">
                                  <Fire className="w-3 h-3 mr-1" />
                                  Featured
                                </Badge>
                              )}
                            </div>
                            <div className="text-right">
                              <div className="text-sm font-medium text-green-400">
                                {formatCurrency(challenge.topParticipantReward)} SP
                              </div>
                              <div className="text-xs text-gray-400">Top Prize</div>
                            </div>
                          </div>
                          
                          <h3 className="font-semibold mb-2">{challenge.title}</h3>
                          <p className="text-sm text-gray-400 mb-3 line-clamp-2">
                            {challenge.description}
                          </p>
                          
                          <div className="flex items-center justify-between text-sm">
                            <div className="flex items-center gap-4">
                              <div className="flex items-center gap-1">
                                <Users className="w-4 h-4 text-gray-400" />
                                <span>{challenge.totalParticipants}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Eye className="w-4 h-4 text-gray-400" />
                                <span>{formatNumber(challenge.totalViews)}</span>
                              </div>
                            </div>
                            
                            <div className="flex items-center gap-1 text-gray-400">
                              <Timer className="w-4 h-4" />
                              <span>
                                {formatDistanceToNow(new Date(challenge.endDate))} left
                              </span>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              </ScrollArea>
            </TabsContent>
            
            {/* Progress Tab */}
            <TabsContent value="progress" className="space-y-4">
              <ScrollArea className="h-[500px]">
                <div className="space-y-4 pr-4">
                  {/* Tier Progress */}
                  <Card className="bg-gray-800 border-gray-700">
                    <CardHeader>
                      <CardTitle>Next Tier Requirements</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {Object.entries(getUpgradeRequirements()).map(([key, requirement]) => (
                        <div key={key} className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span className="capitalize">
                              {key.replace(/([A-Z])/g, ' $1').toLowerCase()}
                            </span>
                            <span>
                              {formatNumber(requirement.current)} / {formatNumber(requirement.required)}
                            </span>
                          </div>
                          <Progress value={requirement.progress} className="h-2" />
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                  
                  {/* Challenge History */}
                  <Card className="bg-gray-800 border-gray-700">
                    <CardHeader>
                      <CardTitle>Challenge History</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {challengeHistory.map((participation) => (
                          <div key={participation.id} className="flex items-center justify-between p-3 bg-gray-700 rounded-lg">
                            <div>
                              <div className="font-medium">Challenge #{participation.challengeId.slice(-8)}</div>
                              <div className="text-sm text-gray-400">
                                Rank: #{participation.currentRank || "TBD"}
                              </div>
                            </div>
                            
                            <div className="text-right">
                              <div className="text-sm font-medium text-green-400">
                                +{formatCurrency(participation.rewardEarned)} SP
                              </div>
                              <Badge className={cn(
                                participation.status === "winner" && "bg-green-500/20 text-green-400",
                                participation.status === "active" && "bg-blue-500/20 text-blue-400",
                                participation.status === "disqualified" && "bg-red-500/20 text-red-400"
                              )}>
                                {participation.status}
                              </Badge>
                            </div>
                          </div>
                        ))}
                        
                        {challengeHistory.length === 0 && (
                          <div className="text-center text-gray-400 py-4">
                            No challenge history yet. Join a challenge to get started!
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </ScrollArea>
            </TabsContent>
            
            {/* Leaderboard Tab */}
            <TabsContent value="leaderboard" className="space-y-4">
              <ScrollArea className="h-[500px]">
                <div className="space-y-3 pr-4">
                  {tierLeaderboard.map((creator, index) => (
                    <Card key={creator.userId} className="bg-gray-800 border-gray-700">
                      <CardContent className="p-4">
                        <div className="flex items-center gap-4">
                          <div className={cn(
                            "w-8 h-8 rounded-full flex items-center justify-center font-bold",
                            index === 0 && "bg-yellow-500 text-black",
                            index === 1 && "bg-gray-400 text-black",
                            index === 2 && "bg-orange-600 text-white",
                            index > 2 && "bg-gray-600 text-white"
                          )}>
                            {index + 1}
                          </div>
                          
                          <Avatar className="w-10 h-10">
                            <AvatarImage src={creator.avatar} />
                            <AvatarFallback>{creator.displayName[0]}</AvatarFallback>
                          </Avatar>
                          
                          <div className="flex-1">
                            <div className="font-medium">{creator.displayName}</div>
                            <div className="text-sm text-gray-400">@{creator.username}</div>
                          </div>
                          
                          <div className="text-right">
                            <div className="flex items-center gap-1">
                              {getTierIcon(creator.tier)}
                              <span className="text-sm">
                                {CreatorTierUtils.formatTierName(creator.tier)}
                              </span>
                            </div>
                            <div className="text-xs text-gray-400">
                              {formatNumber(creator.totalViews)} views
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </ScrollArea>
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>
      
      {/* Challenge Details Modal */}
      <Dialog open={showChallengeDetails} onOpenChange={setShowChallengeDetails}>
        <DialogContent className="bg-gray-900 border-gray-800 text-white max-w-2xl">
          {selectedChallenge && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <Hash className="w-5 h-5 text-purple-400" />
                  {selectedChallenge.title}
                </DialogTitle>
                <DialogDescription>
                  {selectedChallenge.description}
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <Badge className="bg-purple-500/20 text-purple-400">
                    {selectedChallenge.hashtag}
                  </Badge>
                  <Badge className="bg-green-500/20 text-green-400">
                    {formatCurrency(selectedChallenge.topParticipantReward)} SP Top Prize
                  </Badge>
                  <Badge className="bg-blue-500/20 text-blue-400">
                    {selectedChallenge.totalParticipants} Participants
                  </Badge>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-sm text-gray-400 mb-1">Starts</div>
                    <div className="font-medium">
                      {new Date(selectedChallenge.startDate).toLocaleDateString()}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-400 mb-1">Ends</div>
                    <div className="font-medium">
                      {new Date(selectedChallenge.endDate).toLocaleDateString()}
                    </div>
                  </div>
                </div>
                
                <div className="flex gap-2">
                  <Button className="flex-1 bg-purple-600 hover:bg-purple-700">
                    <Plus className="w-4 h-4 mr-2" />
                    Join Challenge
                  </Button>
                  <Button variant="outline" onClick={() => setShowChallengeDetails(false)}>
                    Close
                  </Button>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
      
      {/* Tier Upgrade Celebration Modal */}
      <Dialog open={showTierUpgradeCelebration} onOpenChange={() => {}}>
        <DialogContent className="bg-gray-900 border-gray-800 text-white max-w-md text-center">
          {pendingUpgrade && (
            <>
              <div className="py-6">
                <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
                  <Crown className="w-10 h-10 text-white" />
                </div>
                
                <h2 className="text-2xl font-bold mb-2">Congratulations! 🎉</h2>
                <p className="text-gray-400 mb-4">
                  You've been upgraded to{" "}
                  <span className="font-bold text-purple-400">
                    {CreatorTierUtils.formatTierName(pendingUpgrade.toTier)}
                  </span>
                  !
                </p>
                
                <div className="bg-gray-800 rounded-lg p-4 mb-4">
                  <div className="text-sm text-gray-400 mb-2">Upgrade Reward</div>
                  <div className="text-xl font-bold text-green-400">
                    +{formatCurrency(pendingUpgrade.rewardAmount)} {pendingUpgrade.rewardCurrency}
                  </div>
                </div>
              </div>
              
              <Button 
                onClick={handleTierUpgradeCelebrationClose}
                className="w-full bg-purple-600 hover:bg-purple-700"
              >
                Awesome! Continue
              </Button>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default CreatorTierDashboard;
