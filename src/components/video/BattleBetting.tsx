import React, { useState, useEffect } from "react";
import {
  TrendingUp,
  TrendingDown,
  Target,
  DollarSign,
  Coins,
  AlertTriangle,
  CheckCircle,
  X,
  Info,
  Calculator,
  History,
  Trophy,
  Timer,
  Lock,
  Unlock,
  BarChart3,
  Users,
  Crown,
  Star,
  Zap,
  Shield,
  Award,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
import battleBettingService, { BattleBet, LiveBattleOdds, BettingUtils } from "@/services/battleBettingService";

interface BattleParticipant {
  id: string;
  username: string;
  displayName: string;
  avatar: string;
  isVerified: boolean;
  level: number;
  tier: "rising_star" | "pro_creator" | "legend";
  battlesWon: number;
  battlesLost: number;
  totalEarnings: number;
  recentForm: ("W" | "L")[];
}

interface BattleBettingProps {
  battleId: string;
  participant1: BattleParticipant;
  participant2: BattleParticipant;
  userSoftPoints: number;
  onBetPlaced?: (bet: BattleBet) => void;
  onClose: () => void;
  isOpen: boolean;
  battleStatus: "waiting" | "starting" | "live" | "ended";
}

const BattleBetting: React.FC<BattleBettingProps> = ({
  battleId,
  participant1,
  participant2,
  userSoftPoints,
  onBetPlaced,
  onClose,
  isOpen,
  battleStatus,
}) => {
  const { toast } = useToast();
  
  // Betting state
  const [selectedParticipant, setSelectedParticipant] = useState<string | null>(null);
  const [betAmount, setBetAmount] = useState<number>(10);
  const [liveOdds, setLiveOdds] = useState<LiveBattleOdds | null>(null);
  const [userBet, setUserBet] = useState<BattleBet | null>(null);
  const [isPlacingBet, setIsPlacingBet] = useState(false);
  
  // UI state
  const [showCalculator, setShowCalculator] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [activeTab, setActiveTab] = useState("place-bet");
  
  // Quick bet amounts
  const quickAmounts = [5, 10, 25, 50, 100, 250];
  
  // Mock user betting history
  const [bettingHistory, setBettingHistory] = useState<BattleBet[]>([]);
  const [bettingStats, setBettingStats] = useState({
    totalBetsPlaced: 0,
    totalAmountBet: 0,
    winRate: 0,
    totalWinnings: 0,
    biggestWin: 0,
    currentStreak: 0,
    longestStreak: 0,
  });
  
  // Load initial data
  useEffect(() => {
    if (isOpen) {
      loadBattleOdds();
      loadUserBet();
      loadBettingHistory();
    }
  }, [isOpen, battleId]);
  
  // Subscribe to live odds updates
  useEffect(() => {
    if (isOpen && battleStatus === "waiting") {
      const handleOddsUpdate = (odds: LiveBattleOdds) => {
        setLiveOdds(odds);
      };
      
      battleBettingService.subscribeToOddsUpdates(battleId, handleOddsUpdate);
      
      return () => {
        battleBettingService.unsubscribeFromOddsUpdates(handleOddsUpdate);
      };
    }
  }, [isOpen, battleId, battleStatus]);
  
  const loadBattleOdds = async () => {
    try {
      const odds = await battleBettingService.getBattleOdds(battleId);
      setLiveOdds(odds);
    } catch (error) {
      console.error("Failed to load battle odds:", error);
    }
  };
  
  const loadUserBet = async () => {
    try {
      const bet = await battleBettingService.getUserBet(battleId);
      setUserBet(bet);
    } catch (error) {
      console.error("Failed to load user bet:", error);
    }
  };
  
  const loadBettingHistory = async () => {
    try {
      const { bets, stats } = await battleBettingService.getUserBettingHistory(10);
      setBettingHistory(bets);
      setBettingStats(stats);
    } catch (error) {
      console.error("Failed to load betting history:", error);
    }
  };
  
  const placeBet = async () => {
    if (!selectedParticipant || !liveOdds) return;
    
    setIsPlacingBet(true);
    
    try {
      // Validate bet
      const validation = battleBettingService.validateBet(
        betAmount,
        userSoftPoints,
        {
          minimumBet: liveOdds.minimumBet,
          maximumBet: liveOdds.maximumBet,
          dailyLimit: 1000, // Mock daily limit
          currentDailySpent: 200, // Mock current daily spent
        }
      );
      
      if (!validation.isValid) {
        toast({
          title: "Invalid Bet",
          description: validation.errors.join(", "),
          variant: "destructive",
        });
        return;
      }
      
      const bet = await battleBettingService.placeBet(
        battleId,
        selectedParticipant,
        betAmount,
        "SOFT_POINTS"
      );
      
      setUserBet(bet);
      onBetPlaced?.(bet);
      
      toast({
        title: "Bet Placed Successfully!",
        description: `You bet ${betAmount} SoftPoints on ${getParticipantById(selectedParticipant)?.displayName}`,
      });
      
      // Switch to bet status tab
      setActiveTab("bet-status");
      
    } catch (error: any) {
      toast({
        title: "Failed to Place Bet",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsPlacingBet(false);
    }
  };
  
  const getParticipantById = (id: string) => {
    return id === participant1.id ? participant1 : participant2;
  };
  
  const calculatePotentialPayout = () => {
    if (!selectedParticipant || !liveOdds) return 0;
    
    const odds = selectedParticipant === participant1.id 
      ? liveOdds.odds.participant1Odds 
      : liveOdds.odds.participant2Odds;
    
    return BettingUtils.calculatePayout(betAmount, odds);
  };
  
  const calculatePotentialProfit = () => {
    if (!selectedParticipant || !liveOdds) return 0;
    
    const odds = selectedParticipant === participant1.id 
      ? liveOdds.odds.participant1Odds 
      : liveOdds.odds.participant2Odds;
    
    return BettingUtils.calculateProfit(betAmount, odds);
  };
  
  const getWinProbability = (participantId: string) => {
    if (!liveOdds) return 50;
    
    const odds = participantId === participant1.id 
      ? liveOdds.odds.participant1Odds 
      : liveOdds.odds.participant2Odds;
    
    return (BettingUtils.calculateImpliedProbability(odds) * 100);
  };
  
  const getParticipantForm = (participant: BattleParticipant) => {
    const winRate = participant.battlesWon / (participant.battlesWon + participant.battlesLost) || 0;
    return {
      winRate: winRate * 100,
      form: participant.recentForm || [],
      isHot: participant.recentForm?.filter(result => result === "W").length >= 3,
    };
  };
  
  const getTierColor = (tier: string) => {
    switch (tier) {
      case "legend": return "text-yellow-400";
      case "pro_creator": return "text-purple-400";
      case "rising_star": return "text-blue-400";
      default: return "text-gray-400";
    }
  };
  
  const getTierIcon = (tier: string) => {
    switch (tier) {
      case "legend": return <Crown className="w-4 h-4" />;
      case "pro_creator": return <Star className="w-4 h-4" />;
      case "rising_star": return <Zap className="w-4 h-4" />;
      default: return <Users className="w-4 h-4" />;
    }
  };
  
  const formatCurrency = (amount: number) => {
    return amount.toLocaleString();
  };
  
  const isValidBetAmount = () => {
    if (!liveOdds) return false;
    return betAmount >= liveOdds.minimumBet && 
           betAmount <= liveOdds.maximumBet && 
           betAmount <= userSoftPoints;
  };
  
  const isBettingLocked = () => {
    return liveOdds?.bettingLocked || battleStatus !== "waiting" || !!userBet;
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-gray-900 border-gray-800 text-white max-w-4xl max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Target className="w-5 h-5 text-purple-400" />
            Battle Betting
            {liveOdds?.bettingLocked && (
              <Badge variant="destructive" className="ml-2">
                <Lock className="w-3 h-3 mr-1" />
                Locked
              </Badge>
            )}
          </DialogTitle>
          <DialogDescription>
            Predict the winner and earn SoftPoints! Betting closes when the battle starts.
          </DialogDescription>
        </DialogHeader>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4 bg-gray-800">
            <TabsTrigger value="place-bet">Place Bet</TabsTrigger>
            <TabsTrigger value="bet-status">My Bet</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="history">History</TabsTrigger>
          </TabsList>
          
          {/* Place Bet Tab */}
          <TabsContent value="place-bet" className="space-y-4">
            <ScrollArea className="h-[500px]">
              <div className="space-y-4 pr-4">
                {/* Battle Info */}
                <Card className="bg-gray-800 border-gray-700">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg">Battle Overview</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Current Odds */}
                    {liveOdds && (
                      <div className="grid grid-cols-2 gap-4">
                        <div className="text-center">
                          <div className="text-2xl font-bold text-purple-400">
                            {BettingUtils.formatOdds(liveOdds.odds.participant1Odds)}
                          </div>
                          <div className="text-sm text-gray-400">
                            {getWinProbability(participant1.id).toFixed(1)}% chance
                          </div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-pink-400">
                            {BettingUtils.formatOdds(liveOdds.odds.participant2Odds)}
                          </div>
                          <div className="text-sm text-gray-400">
                            {getWinProbability(participant2.id).toFixed(1)}% chance
                          </div>
                        </div>
                      </div>
                    )}
                    
                    {/* Betting Pool */}
                    {liveOdds && (
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Total Pool:</span>
                          <span className="font-medium">{formatCurrency(liveOdds.odds.totalPool)} SP</span>
                        </div>
                        
                        <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                          <div className="h-full flex">
                            <div
                              className="bg-purple-500"
                              style={{ width: `${liveOdds.odds.participant1Percentage}%` }}
                            />
                            <div
                              className="bg-pink-500"
                              style={{ width: `${liveOdds.odds.participant2Percentage}%` }}
                            />
                          </div>
                        </div>
                        
                        <div className="flex justify-between text-xs text-gray-400">
                          <span>{liveOdds.odds.participant1Percentage.toFixed(1)}%</span>
                          <span>{liveOdds.odds.participant2Percentage.toFixed(1)}%</span>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
                
                {/* Participant Selection */}
                <div className="grid grid-cols-2 gap-4">
                  {[participant1, participant2].map((participant) => {
                    const form = getParticipantForm(participant);
                    const isSelected = selectedParticipant === participant.id;
                    
                    return (
                      <Card
                        key={participant.id}
                        className={cn(
                          "cursor-pointer transition-all border-2",
                          isSelected
                            ? "bg-purple-500/20 border-purple-500"
                            : "bg-gray-800 border-gray-700 hover:border-gray-600",
                          isBettingLocked() && "opacity-50 cursor-not-allowed"
                        )}
                        onClick={() => !isBettingLocked() && setSelectedParticipant(participant.id)}
                      >
                        <CardContent className="p-4">
                          <div className="flex items-center gap-3 mb-3">
                            <Avatar className="w-12 h-12">
                              <AvatarImage src={participant.avatar} />
                              <AvatarFallback>{participant.displayName[0]}</AvatarFallback>
                            </Avatar>
                            
                            <div className="flex-1">
                              <div className="flex items-center gap-2">
                                <span className="font-semibold">{participant.displayName}</span>
                                {participant.isVerified && (
                                  <CheckCircle className="w-4 h-4 text-blue-400" />
                                )}
                              </div>
                              <div className="text-sm text-gray-400">@{participant.username}</div>
                            </div>
                            
                            <div className={cn("flex items-center gap-1", getTierColor(participant.tier))}>
                              {getTierIcon(participant.tier)}
                              <span className="text-xs capitalize">
                                {participant.tier.replace("_", " ")}
                              </span>
                            </div>
                          </div>
                          
                          {/* Stats */}
                          <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                              <span className="text-gray-400">Level:</span>
                              <span>{participant.level}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span className="text-gray-400">Record:</span>
                              <span>{participant.battlesWon}W - {participant.battlesLost}L</span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span className="text-gray-400">Win Rate:</span>
                              <span className={form.winRate >= 60 ? "text-green-400" : form.winRate >= 40 ? "text-yellow-400" : "text-red-400"}>
                                {form.winRate.toFixed(1)}%
                              </span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span className="text-gray-400">Earnings:</span>
                              <span>{formatCurrency(participant.totalEarnings)} SP</span>
                            </div>
                          </div>
                          
                          {/* Recent Form */}
                          <div className="mt-3">
                            <div className="text-xs text-gray-400 mb-1">Recent Form:</div>
                            <div className="flex gap-1">
                              {form.form.map((result, index) => (
                                <div
                                  key={index}
                                  className={cn(
                                    "w-6 h-6 rounded text-xs font-bold flex items-center justify-center",
                                    result === "W" ? "bg-green-500 text-white" : "bg-red-500 text-white"
                                  )}
                                >
                                  {result}
                                </div>
                              ))}
                              {form.isHot && (
                                <Badge variant="secondary" className="bg-orange-500/20 text-orange-400 text-xs">
                                  🔥 Hot
                                </Badge>
                              )}
                            </div>
                          </div>
                          
                          {isSelected && (
                            <div className="mt-3 p-2 bg-purple-500/20 rounded">
                              <div className="text-xs text-purple-400 text-center font-medium">
                                Selected for betting
                              </div>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
                
                {/* Bet Amount Selection */}
                {selectedParticipant && !isBettingLocked() && (
                  <Card className="bg-gray-800 border-gray-700">
                    <CardHeader>
                      <CardTitle className="text-lg">Bet Amount</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {/* Quick Amount Buttons */}
                      <div className="grid grid-cols-3 gap-2">
                        {quickAmounts.map((amount) => (
                          <Button
                            key={amount}
                            variant={betAmount === amount ? "default" : "outline"}
                            size="sm"
                            onClick={() => setBetAmount(amount)}
                            disabled={amount > userSoftPoints}
                            className={betAmount === amount ? "bg-purple-600" : ""}
                          >
                            {amount} SP
                          </Button>
                        ))}
                      </div>
                      
                      {/* Custom Amount Input */}
                      <div className="space-y-2">
                        <Label htmlFor="bet-amount">Custom Amount</Label>
                        <div className="relative">
                          <Input
                            id="bet-amount"
                            type="number"
                            value={betAmount}
                            onChange={(e) => setBetAmount(Number(e.target.value))}
                            min={liveOdds?.minimumBet || 1}
                            max={Math.min(liveOdds?.maximumBet || userSoftPoints, userSoftPoints)}
                            className="bg-gray-800 border-gray-700 pr-12"
                          />
                          <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm">
                            SP
                          </span>
                        </div>
                        <div className="flex justify-between text-xs text-gray-400">
                          <span>Min: {liveOdds?.minimumBet || 1} SP</span>
                          <span>Max: {Math.min(liveOdds?.maximumBet || userSoftPoints, userSoftPoints)} SP</span>
                        </div>
                        <div className="text-sm text-gray-400">
                          Available: {formatCurrency(userSoftPoints)} SoftPoints
                        </div>
                      </div>
                      
                      {/* Bet Summary */}
                      <div className="bg-gray-700 rounded-lg p-3 space-y-2">
                        <div className="flex justify-between">
                          <span className="text-gray-400">Bet Amount:</span>
                          <span className="font-medium">{formatCurrency(betAmount)} SP</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Potential Payout:</span>
                          <span className="font-medium text-green-400">
                            {formatCurrency(calculatePotentialPayout())} SP
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Potential Profit:</span>
                          <span className="font-medium text-green-400">
                            +{formatCurrency(calculatePotentialProfit())} SP
                          </span>
                        </div>
                        <Separator className="bg-gray-600" />
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-400">Platform Fee:</span>
                          <span>{liveOdds?.platformFeePercentage || 5}%</span>
                        </div>
                      </div>
                      
                      {/* Place Bet Button */}
                      <Button
                        onClick={placeBet}
                        disabled={!isValidBetAmount() || isPlacingBet}
                        className="w-full bg-purple-600 hover:bg-purple-700"
                        size="lg"
                      >
                        {isPlacingBet ? (
                          "Placing Bet..."
                        ) : (
                          `Place Bet - ${formatCurrency(betAmount)} SP`
                        )}
                      </Button>
                      
                      {/* Responsible Gambling Notice */}
                      <div className="flex items-start gap-2 p-3 bg-yellow-500/10 border border-yellow-500/20 rounded">
                        <AlertTriangle className="w-4 h-4 text-yellow-400 mt-0.5 flex-shrink-0" />
                        <div className="text-xs text-yellow-200">
                          <strong>Responsible Gambling:</strong> Only bet what you can afford to lose. 
                          Gambling can be addictive. Set limits and take breaks.
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            </ScrollArea>
          </TabsContent>
          
          {/* My Bet Tab */}
          <TabsContent value="bet-status" className="space-y-4">
            <div className="h-[500px] flex items-center justify-center">
              {userBet ? (
                <Card className="bg-gray-800 border-gray-700 w-full max-w-md">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <CheckCircle className="w-5 h-5 text-green-400" />
                      Bet Placed
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="text-center">
                      <div className="text-lg font-semibold">
                        {formatCurrency(userBet.betAmount)} SoftPoints
                      </div>
                      <div className="text-sm text-gray-400">
                        on {getParticipantById(userBet.betOnParticipant)?.displayName}
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-gray-400">Odds:</span>
                        <span>{BettingUtils.formatOdds(userBet.oddsWhenPlaced)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Potential Payout:</span>
                        <span className="text-green-400">
                          {formatCurrency(userBet.potentialPayout)} SP
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Status:</span>
                        <Badge className={cn(
                          userBet.status === "active" && "bg-blue-500/20 text-blue-400",
                          userBet.status === "won" && "bg-green-500/20 text-green-400",
                          userBet.status === "lost" && "bg-red-500/20 text-red-400"
                        )}>
                          {userBet.status}
                        </Badge>
                      </div>
                    </div>
                    
                    {battleStatus === "waiting" && (
                      <div className="text-center text-sm text-gray-400">
                        Your bet is locked in! Good luck! 🍀
                      </div>
                    )}
                  </CardContent>
                </Card>
              ) : (
                <div className="text-center">
                  <Target className="w-16 h-16 text-gray-500 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No Bet Placed</h3>
                  <p className="text-gray-400 mb-4">
                    You haven't placed a bet on this battle yet.
                  </p>
                  <Button
                    onClick={() => setActiveTab("place-bet")}
                    className="bg-purple-600 hover:bg-purple-700"
                  >
                    Place a Bet
                  </Button>
                </div>
              )}
            </div>
          </TabsContent>
          
          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-4">
            <div className="h-[500px]">
              <div className="grid grid-cols-2 gap-4 h-full">
                <Card className="bg-gray-800 border-gray-700">
                  <CardHeader>
                    <CardTitle className="text-lg">Your Betting Stats</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-purple-400">
                          {bettingStats.totalBetsPlaced}
                        </div>
                        <div className="text-xs text-gray-400">Total Bets</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-green-400">
                          {bettingStats.winRate.toFixed(1)}%
                        </div>
                        <div className="text-xs text-gray-400">Win Rate</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-blue-400">
                          {formatCurrency(bettingStats.totalWinnings)}
                        </div>
                        <div className="text-xs text-gray-400">Total Winnings</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-yellow-400">
                          {bettingStats.currentStreak}
                        </div>
                        <div className="text-xs text-gray-400">Current Streak</div>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="text-sm text-gray-400">ROI</div>
                      <div className="text-lg font-bold text-green-400">
                        +{BettingUtils.calculateROI(bettingStats.totalWinnings, bettingStats.totalAmountBet).toFixed(1)}%
                      </div>
                      <Progress 
                        value={Math.min(100, Math.max(0, 50 + (bettingStats.winRate - 50)))} 
                        className="h-2"
                      />
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="bg-gray-800 border-gray-700">
                  <CardHeader>
                    <CardTitle className="text-lg">Battle Analytics</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="text-sm text-gray-400">
                      Historical performance analysis for similar battles
                    </div>
                    
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-400">Similar Matchups:</span>
                        <span>7 battles</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Avg. Total Pool:</span>
                        <span>2,450 SP</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Most Likely Winner:</span>
                        <span className="text-purple-400">{participant1.displayName}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Confidence:</span>
                        <span className="text-green-400">67%</span>
                      </div>
                    </div>
                    
                    <div className="p-3 bg-blue-500/10 border border-blue-500/20 rounded">
                      <div className="flex items-center gap-2 mb-2">
                        <Info className="w-4 h-4 text-blue-400" />
                        <span className="text-sm font-medium text-blue-400">AI Recommendation</span>
                      </div>
                      <div className="text-xs text-blue-200">
                        Based on historical data, {participant1.displayName} has a slight edge 
                        due to recent form and tier advantage.
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>
          
          {/* History Tab */}
          <TabsContent value="history" className="space-y-4">
            <ScrollArea className="h-[500px]">
              <div className="space-y-3 pr-4">
                {bettingHistory.length > 0 ? (
                  bettingHistory.map((bet) => (
                    <Card key={bet.id} className="bg-gray-800 border-gray-700">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <Badge className={cn(
                              bet.status === "won" && "bg-green-500/20 text-green-400",
                              bet.status === "lost" && "bg-red-500/20 text-red-400",
                              bet.status === "active" && "bg-blue-500/20 text-blue-400"
                            )}>
                              {bet.status}
                            </Badge>
                            <span className="text-sm text-gray-400">
                              {new Date(bet.placedAt).toLocaleDateString()}
                            </span>
                          </div>
                          <div className="text-right">
                            <div className="font-medium">
                              {bet.status === "won" ? "+" : "-"}{formatCurrency(bet.betAmount)} SP
                            </div>
                            {bet.status === "won" && (
                              <div className="text-sm text-green-400">
                                +{formatCurrency(bet.actualPayout - bet.betAmount)}
                              </div>
                            )}
                          </div>
                        </div>
                        
                        <div className="text-sm text-gray-400">
                          Battle #{bet.battleId.slice(-8)} • Odds: {BettingUtils.formatOdds(bet.oddsWhenPlaced)}
                        </div>
                      </CardContent>
                    </Card>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <History className="w-16 h-16 text-gray-500 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">No Betting History</h3>
                    <p className="text-gray-400">
                      Your betting history will appear here once you place your first bet.
                    </p>
                  </div>
                )}
              </div>
            </ScrollArea>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default BattleBetting;
