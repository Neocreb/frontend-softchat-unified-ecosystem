import React, { useState, useEffect } from 'react';
import {
  Target,
  TrendingUp,
  TrendingDown,
  Coins,
  Timer,
  Users,
  Trophy,
  AlertTriangle,
  Lock,
  Unlock,
  Zap,
  Star,
  Crown,
  Flame,
  Calculator,
  History,
  Wallet,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Slider } from '@/components/ui/slider';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

interface Creator {
  id: string;
  username: string;
  displayName: string;
  avatar: string;
  tier: 'rising_star' | 'pro_creator' | 'legend';
  verified: boolean;
  currentScore: number;
  winRate: number;
  totalBets: number;
  isLeading: boolean;
}

interface Bet {
  id: string;
  amount: number;
  creatorId: string;
  odds: number;
  potentialWinning: number;
  timestamp: Date;
  status: 'active' | 'won' | 'lost' | 'refunded';
}

interface BattleBettingProps {
  battleId: string;
  creator1: Creator;
  creator2: Creator;
  isLive: boolean;
  timeRemaining: number;
  userBalance: number;
  onPlaceBet: (bet: Omit<Bet, 'id' | 'timestamp' | 'status'>) => void;
  userBets: Bet[];
  bettingPool: {
    creator1Total: number;
    creator2Total: number;
    totalPool: number;
    totalBettors: number;
  };
}

const quickBetAmounts = [10, 20, 50, 100, 250];

const BattleBetting: React.FC<BattleBettingProps> = ({
  battleId,
  creator1,
  creator2,
  isLive,
  timeRemaining,
  userBalance,
  onPlaceBet,
  userBets,
  bettingPool,
}) => {
  const [selectedCreator, setSelectedCreator] = useState<Creator | null>(null);
  const [betAmount, setBetAmount] = useState(20);
  const [customAmount, setCustomAmount] = useState('');
  const [showBetConfirm, setShowBetConfirm] = useState(false);
  const [bettingLocked, setBettingLocked] = useState(false);
  const [activeTab, setActiveTab] = useState('bet');
  
  const { toast } = useToast();

  // Lock betting 30 seconds before battle ends
  useEffect(() => {
    if (timeRemaining <= 30 && isLive) {
      setBettingLocked(true);
    }
  }, [timeRemaining, isLive]);

  const calculateOdds = (creator: Creator) => {
    const totalBets = bettingPool.creator1Total + bettingPool.creator2Total;
    if (totalBets === 0) return 2.0;
    
    const creatorBets = creator.id === creator1.id ? bettingPool.creator1Total : bettingPool.creator2Total;
    const opponentBets = creator.id === creator1.id ? bettingPool.creator2Total : bettingPool.creator1Total;
    
    if (creatorBets === 0) return 3.0;
    
    const odds = (totalBets * 0.9) / creatorBets; // 90% of pool for winners, 10% platform fee
    return Math.max(1.1, Math.min(odds, 5.0)); // Cap between 1.1x and 5.0x
  };

  const calculatePotentialWinning = (amount: number, creator: Creator) => {
    const odds = calculateOdds(creator);
    return amount * odds;
  };

  const getCreatorPopularity = (creator: Creator) => {
    const creatorBets = creator.id === creator1.id ? bettingPool.creator1Total : bettingPool.creator2Total;
    const totalBets = bettingPool.creator1Total + bettingPool.creator2Total;
    return totalBets > 0 ? (creatorBets / totalBets) * 100 : 50;
  };

  const placeBet = () => {
    if (!selectedCreator || betAmount <= 0 || betAmount > userBalance) {
      toast({
        title: 'Invalid Bet',
        description: 'Please check your bet amount and selected creator',
        variant: 'destructive',
      });
      return;
    }

    if (bettingLocked) {
      toast({
        title: 'Betting Locked',
        description: 'Betting is locked for the final 30 seconds',
        variant: 'destructive',
      });
      return;
    }

    const bet = {
      amount: betAmount,
      creatorId: selectedCreator.id,
      odds: calculateOdds(selectedCreator),
      potentialWinning: calculatePotentialWinning(betAmount, selectedCreator),
    };

    onPlaceBet(bet);
    setShowBetConfirm(false);
    setSelectedCreator(null);
    setBetAmount(20);

    toast({
      title: 'Bet Placed! 🎯',
      description: `${betAmount} SP on ${selectedCreator.displayName}`,
    });
  };

  const getTierIcon = (tier: string) => {
    switch (tier) {
      case 'legend':
        return <Crown className="w-4 h-4 text-yellow-400" />;
      case 'pro_creator':
        return <Trophy className="w-4 h-4 text-purple-400" />;
      case 'rising_star':
        return <Star className="w-4 h-4 text-blue-400" />;
      default:
        return null;
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getTotalUserBets = () => {
    return userBets.reduce((sum, bet) => sum + bet.amount, 0);
  };

  const getPotentialWinnings = () => {
    return userBets
      .filter(bet => bet.status === 'active')
      .reduce((sum, bet) => sum + bet.potentialWinning, 0);
  };

  return (
    <div className="space-y-4">
      {/* Battle Status */}
      <Card className="bg-gradient-to-r from-blue-600/20 to-red-600/20 border-gray-700">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Badge className={cn(
                "animate-pulse",
                isLive ? "bg-red-500" : "bg-gray-500"
              )}>
                {isLive ? (
                  <>
                    <Flame className="w-3 h-3 mr-1" />
                    LIVE
                  </>
                ) : (
                  'ENDED'
                )}
              </Badge>
              
              {isLive && (
                <div className="flex items-center gap-1 text-white text-sm">
                  <Timer className="w-3 h-3" />
                  {formatTime(timeRemaining)}
                </div>
              )}
            </div>

            <div className="text-right">
              <div className="text-sm text-gray-400">Total Pool</div>
              <div className="text-lg font-bold text-yellow-400">
                {bettingPool.totalPool.toLocaleString()} SP
              </div>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            {/* Creator 1 */}
            <div className={cn(
              "p-3 rounded-lg cursor-pointer transition-all hover:bg-white/5",
              selectedCreator?.id === creator1.id && "ring-2 ring-blue-400 bg-blue-400/10"
            )}
            onClick={() => !bettingLocked && setSelectedCreator(creator1)}
            >
              <div className="flex items-center gap-3 mb-3">
                <Avatar className="w-12 h-12">
                  <AvatarImage src={creator1.avatar} />
                  <AvatarFallback>{creator1.displayName[0]}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-white">{creator1.displayName}</span>
                    {creator1.verified && <div className="w-3 h-3 bg-blue-500 rounded-full" />}
                    {getTierIcon(creator1.tier)}
                  </div>
                  <div className="text-xs text-gray-400">@{creator1.username}</div>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Odds</span>
                  <span className="font-bold text-green-400">{calculateOdds(creator1).toFixed(2)}x</span>
                </div>
                
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Win Rate</span>
                  <span className="text-white">{creator1.winRate}%</span>
                </div>
                
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Current Score</span>
                  <span className="text-white">{creator1.currentScore} SP</span>
                </div>

                <div className="mt-2">
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-gray-400">Bet Distribution</span>
                    <span className="text-blue-400">{getCreatorPopularity(creator1).toFixed(1)}%</span>
                  </div>
                  <Progress value={getCreatorPopularity(creator1)} className="h-1" />
                </div>
              </div>
            </div>

            {/* Creator 2 */}
            <div className={cn(
              "p-3 rounded-lg cursor-pointer transition-all hover:bg-white/5",
              selectedCreator?.id === creator2.id && "ring-2 ring-red-400 bg-red-400/10"
            )}
            onClick={() => !bettingLocked && setSelectedCreator(creator2)}
            >
              <div className="flex items-center gap-3 mb-3">
                <Avatar className="w-12 h-12">
                  <AvatarImage src={creator2.avatar} />
                  <AvatarFallback>{creator2.displayName[0]}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-white">{creator2.displayName}</span>
                    {creator2.verified && <div className="w-3 h-3 bg-blue-500 rounded-full" />}
                    {getTierIcon(creator2.tier)}
                  </div>
                  <div className="text-xs text-gray-400">@{creator2.username}</div>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Odds</span>
                  <span className="font-bold text-green-400">{calculateOdds(creator2).toFixed(2)}x</span>
                </div>
                
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Win Rate</span>
                  <span className="text-white">{creator2.winRate}%</span>
                </div>
                
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Current Score</span>
                  <span className="text-white">{creator2.currentScore} SP</span>
                </div>

                <div className="mt-2">
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-gray-400">Bet Distribution</span>
                    <span className="text-red-400">{getCreatorPopularity(creator2).toFixed(1)}%</span>
                  </div>
                  <Progress value={getCreatorPopularity(creator2)} className="h-1" />
                </div>
              </div>
            </div>
          </div>

          {bettingLocked && (
            <div className="mt-4 p-3 bg-yellow-400/10 border border-yellow-400 rounded-lg">
              <div className="flex items-center gap-2 text-yellow-400 text-sm">
                <Lock className="w-4 h-4" />
                <span className="font-medium">Betting Locked</span>
              </div>
              <div className="text-xs text-gray-300 mt-1">
                Betting closes 30 seconds before battle ends
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Betting Interface */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3 bg-gray-800">
          <TabsTrigger value="bet">Place Bet</TabsTrigger>
          <TabsTrigger value="mybets">My Bets ({userBets.length})</TabsTrigger>
          <TabsTrigger value="leaderboard">Leaderboard</TabsTrigger>
        </TabsList>

        <TabsContent value="bet" className="space-y-4">
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="w-5 h-5" />
                Place Your Bet
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {selectedCreator ? (
                <>
                  <div className="bg-gray-700/50 p-4 rounded-lg">
                    <div className="flex items-center gap-3 mb-3">
                      <Avatar className="w-8 h-8">
                        <AvatarImage src={selectedCreator.avatar} />
                        <AvatarFallback>{selectedCreator.displayName[0]}</AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium">Betting on {selectedCreator.displayName}</div>
                        <div className="text-sm text-gray-400">
                          Odds: {calculateOdds(selectedCreator).toFixed(2)}x
                        </div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <Label className="text-sm text-gray-300">Bet Amount</Label>
                    <div className="grid grid-cols-5 gap-2 mt-2">
                      {quickBetAmounts.map((amount) => (
                        <Button
                          key={amount}
                          variant={betAmount === amount ? "default" : "outline"}
                          size="sm"
                          onClick={() => setBetAmount(amount)}
                          disabled={amount > userBalance}
                        >
                          {amount}
                        </Button>
                      ))}
                    </div>
                    
                    <div className="mt-3">
                      <Input
                        type="number"
                        placeholder="Custom amount"
                        value={customAmount}
                        onChange={(e) => {
                          setCustomAmount(e.target.value);
                          setBetAmount(parseInt(e.target.value) || 0);
                        }}
                        className="bg-gray-700 border-gray-600"
                      />
                    </div>

                    <div className="mt-3">
                      <Slider
                        value={[betAmount]}
                        onValueChange={([value]) => {
                          setBetAmount(value);
                          setCustomAmount(value.toString());
                        }}
                        max={Math.min(userBalance, 500)}
                        min={10}
                        step={5}
                        className="w-full"
                      />
                      <div className="flex justify-between text-xs text-gray-400 mt-1">
                        <span>10 SP</span>
                        <span>{Math.min(userBalance, 500)} SP</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-700/50 p-4 rounded-lg space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Bet Amount</span>
                      <span className="text-white">{betAmount} SP</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Odds</span>
                      <span className="text-green-400">{calculateOdds(selectedCreator).toFixed(2)}x</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Potential Winning</span>
                      <span className="text-yellow-400 font-bold">
                        {calculatePotentialWinning(betAmount, selectedCreator).toFixed(0)} SP
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Your Balance</span>
                      <span className="text-white">{userBalance} SP</span>
                    </div>
                  </div>

                  <Button
                    onClick={placeBet}
                    disabled={bettingLocked || betAmount <= 0 || betAmount > userBalance}
                    className="w-full bg-green-600 hover:bg-green-700"
                  >
                    {bettingLocked ? (
                      <>
                        <Lock className="w-4 h-4 mr-2" />
                        Betting Locked
                      </>
                    ) : (
                      <>
                        <Zap className="w-4 h-4 mr-2" />
                        Place Bet ({betAmount} SP)
                      </>
                    )}
                  </Button>
                </>
              ) : (
                <div className="text-center py-8">
                  <Target className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                  <h3 className="font-medium text-gray-300 mb-2">Select a Creator</h3>
                  <p className="text-sm text-gray-400">
                    Choose which creator you think will win to place your bet
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="mybets" className="space-y-4">
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Wallet className="w-5 h-5" />
                  My Bets
                </div>
                <Badge variant="secondary">
                  {getTotalUserBets()} SP total
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {userBets.length > 0 ? (
                <div className="space-y-3">
                  {userBets.map((bet) => {
                    const creator = bet.creatorId === creator1.id ? creator1 : creator2;
                    return (
                      <div key={bet.id} className="bg-gray-700/50 p-3 rounded-lg">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <Avatar className="w-8 h-8">
                              <AvatarImage src={creator.avatar} />
                              <AvatarFallback>{creator.displayName[0]}</AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="font-medium">{creator.displayName}</div>
                              <div className="text-xs text-gray-400">
                                {bet.amount} SP at {bet.odds.toFixed(2)}x odds
                              </div>
                            </div>
                          </div>
                          
                          <div className="text-right">
                            <div className="text-yellow-400 font-medium">
                              +{bet.potentialWinning.toFixed(0)} SP
                            </div>
                            <Badge
                              variant={
                                bet.status === 'won' ? 'default' :
                                bet.status === 'lost' ? 'destructive' :
                                bet.status === 'refunded' ? 'secondary' : 'outline'
                              }
                              className="text-xs"
                            >
                              {bet.status.toUpperCase()}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                  
                  <div className="border-t border-gray-600 pt-3 mt-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Total Bet</span>
                      <span className="text-white">{getTotalUserBets()} SP</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Potential Winnings</span>
                      <span className="text-yellow-400 font-bold">
                        {getPotentialWinnings().toFixed(0)} SP
                      </span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <History className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                  <h3 className="font-medium text-gray-300 mb-2">No Bets Yet</h3>
                  <p className="text-sm text-gray-400">
                    Place your first bet to start earning!
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="leaderboard" className="space-y-4">
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5" />
                Top Bettors
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {/* Mock leaderboard data */}
                {[
                  { username: 'lucky_bettor', amount: 2500, winRate: 78 },
                  { username: 'crypto_king', amount: 1800, winRate: 65 },
                  { username: 'battle_pro', amount: 1200, winRate: 82 },
                  { username: 'risk_taker', amount: 950, winRate: 45 },
                  { username: 'smart_money', amount: 800, winRate: 90 },
                ].map((bettor, index) => (
                  <div key={bettor.username} className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-700/50">
                    <div className={cn(
                      "w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold",
                      index === 0 && "bg-yellow-400 text-black",
                      index === 1 && "bg-gray-400 text-black",
                      index === 2 && "bg-amber-600 text-white",
                      index > 2 && "bg-gray-600 text-white"
                    )}>
                      {index + 1}
                    </div>
                    
                    <div className="flex-1">
                      <div className="font-medium">{bettor.username}</div>
                      <div className="text-xs text-gray-400">
                        {bettor.winRate}% win rate
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <div className="font-bold text-yellow-400">
                        {bettor.amount.toLocaleString()} SP
                      </div>
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

export default BattleBetting;
