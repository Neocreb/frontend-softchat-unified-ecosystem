import React, { useState, useEffect } from 'react';
import {
  DollarSign,
  TrendingUp,
  Users,
  Clock,
  Trophy,
  Target,
  Coins,
  Star,
  Crown,
  Flame,
  Zap,
  CheckCircle,
  XCircle,
  AlertTriangle,
  ArrowUp,
  ArrowDown,
  Calculator,
  Percent,
  Award,
  ChevronRight,
} from 'lucide-react';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Badge } from '../ui/badge';
import { Input } from '../ui/input';
import { Progress } from '../ui/progress';
import { Slider } from '../ui/slider';
import { Label } from '../ui/label';
import { Separator } from '../ui/separator';
import { cn } from '../../lib/utils';
import { useToast } from '../../hooks/use-toast';

interface Creator {
  id: string;
  username: string;
  displayName: string;
  avatar: string;
  tier: 'rising_star' | 'pro_creator' | 'legend';
  verified: boolean;
  currentScore: number;
  winRate: number;
  totalVotes: number;
  isLeading: boolean;
}

interface VotingPool {
  creator1Total: number;
  creator2Total: number;
  totalPool: number;
  totalVoters: number;
}

interface Vote {
  id: string;
  amount: number;
  creatorId: string;
  odds: number;
  potentialWinning: number;
  timestamp: Date;
  status: 'active' | 'won' | 'lost' | 'refunded';
}

interface BattleVotingProps {
  battleId: string;
  creator1: Creator;
  creator2: Creator;
  isLive: boolean;
  timeRemaining: number;
  userBalance: number;
  onPlaceVote: (vote: Omit<Vote, 'id' | 'timestamp' | 'status'>) => void;
  userVotes: Vote[];
  votingPool: VotingPool;
  className?: string;
}

const predefinedAmounts = [10, 25, 50, 100, 250, 500];

export const EnhancedBattleVoting: React.FC<BattleVotingProps> = ({
  battleId,
  creator1,
  creator2,
  isLive,
  timeRemaining,
  userBalance,
  onPlaceVote,
  userVotes,
  votingPool,
  className,
}) => {
  const { toast } = useToast();
  
  // Voting state
  const [selectedCreator, setSelectedCreator] = useState<string | null>(null);
  const [voteAmount, setVoteAmount] = useState<number>(50);
  const [customAmount, setCustomAmount] = useState<string>('');
  const [useCustomAmount, setUseCustomAmount] = useState(false);
  const [confidence, setConfidence] = useState<'low' | 'medium' | 'high'>('medium');
  const [showConfirmation, setShowConfirmation] = useState(false);
  
  // Calculations
  const [odds, setOdds] = useState({ creator1: 1.5, creator2: 2.0 });
  const [potentialWinning, setPotentialWinning] = useState(0);
  const [distributionPercentage, setDistributionPercentage] = useState({ creator1: 50, creator2: 50 });

  // Calculate odds based on current pool distribution
  useEffect(() => {
    const total = votingPool.creator1Total + votingPool.creator2Total;
    if (total > 0) {
      const creator1Percentage = (votingPool.creator1Total / total) * 100;
      const creator2Percentage = (votingPool.creator2Total / total) * 100;
      
      setDistributionPercentage({
        creator1: creator1Percentage,
        creator2: creator2Percentage,
      });

      // Calculate odds (inverse of probability with house edge)
      const creator1Odds = total / Math.max(votingPool.creator1Total, 1) * 0.9; // 10% house edge
      const creator2Odds = total / Math.max(votingPool.creator2Total, 1) * 0.9;
      
      setOdds({
        creator1: Math.max(1.1, creator1Odds),
        creator2: Math.max(1.1, creator2Odds),
      });
    }
  }, [votingPool]);

  // Calculate potential winning when amount or selection changes
  useEffect(() => {
    if (selectedCreator) {
      const amount = useCustomAmount ? parseFloat(customAmount) || 0 : voteAmount;
      const creatorOdds = selectedCreator === creator1.id ? odds.creator1 : odds.creator2;
      setPotentialWinning(amount * creatorOdds);
    }
  }, [selectedCreator, voteAmount, customAmount, useCustomAmount, odds, creator1.id]);

  const formatNumber = (num: number): string => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num.toString();
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getTierColor = (tier: string) => {
    switch (tier) {
      case 'legend': return 'text-purple-400 border-purple-400';
      case 'pro_creator': return 'text-yellow-400 border-yellow-400';
      default: return 'text-blue-400 border-blue-400';
    }
  };

  const getTierIcon = (tier: string) => {
    switch (tier) {
      case 'legend': return <Crown className="w-4 h-4" />;
      case 'pro_creator': return <Star className="w-4 h-4" />;
      default: return <Zap className="w-4 h-4" />;
    }
  };

  const getCurrentAmount = () => {
    return useCustomAmount ? parseFloat(customAmount) || 0 : voteAmount;
  };

  const canPlaceVote = () => {
    const amount = getCurrentAmount();
    return (
      selectedCreator &&
      amount > 0 &&
      amount <= userBalance &&
      isLive &&
      timeRemaining > 30 &&
      userVotes.length === 0
    );
  };

  const handlePlaceVote = () => {
    if (!canPlaceVote()) return;

    const amount = getCurrentAmount();
    const creatorOdds = selectedCreator === creator1.id ? odds.creator1 : odds.creator2;

    const vote = {
      amount,
      creatorId: selectedCreator!,
      odds: creatorOdds,
      potentialWinning: amount * creatorOdds,
    };

    onPlaceVote(vote);
    setShowConfirmation(false);
    setSelectedCreator(null);
    setVoteAmount(50);
    setCustomAmount('');
    setUseCustomAmount(false);
  };

  const getVotingPhase = () => {
    if (timeRemaining <= 30) return 'closed';
    if (timeRemaining <= 60) return 'closing';
    return 'active';
  };

  const votingPhase = getVotingPhase();

  return (
    <div className={cn("space-y-6", className)}>
      {/* Battle Status Header */}
      <Card className="bg-gradient-to-r from-purple-900/20 to-blue-900/20 border-purple-500/30">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Target className="w-5 h-5 text-purple-400" />
              <CardTitle className="text-white">Battle Voting</CardTitle>
              <Badge 
                variant={votingPhase === 'active' ? 'default' : 'destructive'}
                className={cn(
                  votingPhase === 'active' && "bg-green-500",
                  votingPhase === 'closing' && "bg-yellow-500",
                  votingPhase === 'closed' && "bg-red-500"
                )}
              >
                {votingPhase === 'active' && 'Open'}
                {votingPhase === 'closing' && 'Closing Soon'}
                {votingPhase === 'closed' && 'Closed'}
              </Badge>
            </div>
            
            <div className="flex items-center gap-3 text-white">
              <div className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                <span className="font-mono">{formatTime(timeRemaining)}</span>
              </div>
              <div className="flex items-center gap-1">
                <Coins className="w-4 h-4 text-yellow-400" />
                <span className="font-bold">{formatNumber(votingPool.totalPool)} SP</span>
              </div>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Creator Selection */}
      <div className="grid grid-cols-2 gap-4">
        {[creator1, creator2].map((creator) => (
          <Card
            key={creator.id}
            className={cn(
              "cursor-pointer transition-all duration-200 hover:scale-105",
              selectedCreator === creator.id
                ? "border-blue-500 bg-blue-500/10 shadow-lg shadow-blue-500/20"
                : "border-gray-600 hover:border-gray-500",
              creator.isLeading && "ring-2 ring-yellow-400/50"
            )}
            onClick={() => votingPhase === 'active' && setSelectedCreator(creator.id)}
          >
            <CardContent className="p-4">
              <div className="space-y-3">
                {/* Creator Info */}
                <div className="flex items-center gap-3">
                  <Avatar className={cn("w-12 h-12 border-2", getTierColor(creator.tier))}>
                    <AvatarImage src={creator.avatar} />
                    <AvatarFallback>{creator.displayName[0]}</AvatarFallback>
                  </Avatar>
                  
                  <div className="flex-1">
                    <div className="flex items-center gap-1">
                      <span className="text-white font-semibold">{creator.displayName}</span>
                      {creator.verified && (
                        <div className="w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center">
                          <div className="w-2 h-2 bg-white rounded-full" />
                        </div>
                      )}
                      {creator.isLeading && (
                        <Crown className="w-4 h-4 text-yellow-400" />
                      )}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-400">
                      <span>@{creator.username}</span>
                      <div className={cn("flex items-center gap-1", getTierColor(creator.tier))}>
                        {getTierIcon(creator.tier)}
                        <span className="capitalize">{creator.tier.replace('_', ' ')}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div className="text-center p-2 bg-gray-800/50 rounded">
                    <div className="text-white font-bold text-lg">{creator.currentScore}</div>
                    <div className="text-gray-400">Current Score</div>
                  </div>
                  <div className="text-center p-2 bg-gray-800/50 rounded">
                    <div className="text-green-400 font-bold text-lg">{creator.winRate}%</div>
                    <div className="text-gray-400">Win Rate</div>
                  </div>
                </div>

                {/* Voting Stats */}
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Votes Received</span>
                    <span className="text-white font-semibold">
                      {formatNumber(creator.id === creator1.id ? votingPool.creator1Total : votingPool.creator2Total)} SP
                    </span>
                  </div>
                  
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span className="text-gray-500">Share</span>
                      <span className="text-gray-300">
                        {(creator.id === creator1.id ? distributionPercentage.creator1 : distributionPercentage.creator2).toFixed(1)}%
                      </span>
                    </div>
                    <Progress 
                      value={creator.id === creator1.id ? distributionPercentage.creator1 : distributionPercentage.creator2}
                      className="h-2"
                    />
                  </div>

                  {/* Odds Display */}
                  <div className="flex justify-between items-center p-2 bg-gray-700/50 rounded">
                    <span className="text-gray-400 text-sm">Odds</span>
                    <div className="text-right">
                      <div className="text-white font-bold">
                        {(creator.id === creator1.id ? odds.creator1 : odds.creator2).toFixed(2)}x
                      </div>
                      <div className="text-xs text-gray-400">multiplier</div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Voting Amount Selection */}
      {selectedCreator && votingPhase === 'active' && (
        <Card className="border-blue-500/30 bg-blue-500/5">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Calculator className="w-5 h-5" />
              Place Your Vote
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Balance Display */}
            <div className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg">
              <span className="text-gray-400">Your Balance</span>
              <div className="flex items-center gap-1">
                <Coins className="w-4 h-4 text-yellow-400" />
                <span className="text-white font-bold">{formatNumber(userBalance)} SP</span>
              </div>
            </div>

            {/* Amount Selection */}
            <div className="space-y-3">
              <Label className="text-white">Vote Amount</Label>
              
              {!useCustomAmount ? (
                <div className="space-y-3">
                  <div className="grid grid-cols-3 gap-2">
                    {predefinedAmounts.map((amount) => (
                      <Button
                        key={amount}
                        variant={voteAmount === amount ? "default" : "outline"}
                        size="sm"
                        onClick={() => setVoteAmount(amount)}
                        disabled={amount > userBalance}
                        className={cn(
                          voteAmount === amount && "bg-blue-600 border-blue-600",
                          amount > userBalance && "opacity-50"
                        )}
                      >
                        {amount} SP
                      </Button>
                    ))}
                  </div>
                  
                  <div className="space-y-2">
                    <Slider
                      value={[voteAmount]}
                      onValueChange={([value]) => setVoteAmount(value)}
                      max={Math.min(userBalance, 1000)}
                      min={1}
                      step={1}
                      className="w-full"
                    />
                    <div className="flex justify-between text-xs text-gray-400">
                      <span>1 SP</span>
                      <span className="text-white font-medium">{voteAmount} SP</span>
                      <span>{Math.min(userBalance, 1000)} SP</span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-2">
                  <Input
                    type="number"
                    value={customAmount}
                    onChange={(e) => setCustomAmount(e.target.value)}
                    placeholder="Enter custom amount..."
                    min="1"
                    max={userBalance}
                    className="bg-gray-800 border-gray-600 text-white"
                  />
                  <div className="text-xs text-gray-400">
                    Maximum: {formatNumber(userBalance)} SP
                  </div>
                </div>
              )}

              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setUseCustomAmount(!useCustomAmount);
                  if (!useCustomAmount) {
                    setCustomAmount(voteAmount.toString());
                  }
                }}
                className="text-blue-400 hover:text-blue-300"
              >
                {useCustomAmount ? 'Use Presets' : 'Custom Amount'}
              </Button>
            </div>

            {/* Confidence Level */}
            <div className="space-y-2">
              <Label className="text-white">Confidence Level</Label>
              <div className="grid grid-cols-3 gap-2">
                {(['low', 'medium', 'high'] as const).map((level) => (
                  <Button
                    key={level}
                    variant={confidence === level ? "default" : "outline"}
                    size="sm"
                    onClick={() => setConfidence(level)}
                    className={cn(
                      confidence === level && "bg-blue-600 border-blue-600"
                    )}
                  >
                    {level.charAt(0).toUpperCase() + level.slice(1)}
                  </Button>
                ))}
              </div>
            </div>

            {/* Voting Calculation */}
            <div className="space-y-3 p-4 bg-gray-800/50 rounded-lg">
              <div className="text-white font-medium">Vote Summary</div>
              
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-400">Voting for</span>
                  <span className="text-white">
                    {selectedCreator === creator1.id ? creator1.displayName : creator2.displayName}
                  </span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-400">Amount</span>
                  <span className="text-white font-medium">{getCurrentAmount()} SP</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-400">Odds</span>
                  <span className="text-green-400 font-medium">
                    {(selectedCreator === creator1.id ? odds.creator1 : odds.creator2).toFixed(2)}x
                  </span>
                </div>
                
                <Separator className="bg-gray-600" />
                
                <div className="flex justify-between">
                  <span className="text-gray-400">Potential Winning</span>
                  <span className="text-yellow-400 font-bold">
                    {potentialWinning.toFixed(0)} SP
                  </span>
                </div>
                
                <div className="flex justify-between text-xs">
                  <span className="text-gray-500">Profit if won</span>
                  <span className="text-green-400">
                    +{(potentialWinning - getCurrentAmount()).toFixed(0)} SP
                  </span>
                </div>
              </div>
            </div>

            {/* Place Vote Button */}
            <Button
              onClick={() => setShowConfirmation(true)}
              disabled={!canPlaceVote()}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold py-3"
            >
              {!selectedCreator ? (
                'Select a Creator'
              ) : getCurrentAmount() > userBalance ? (
                'Insufficient Balance'
              ) : userVotes.length > 0 ? (
                'Vote Already Placed'
              ) : votingPhase !== 'active' ? (
                'Voting Closed'
              ) : (
                <>
                  <DollarSign className="w-4 h-4 mr-2" />
                  Place Vote - {getCurrentAmount()} SP
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      )}

      {/* User's Active Votes */}
      {userVotes.length > 0 && (
        <Card className="border-green-500/30 bg-green-500/5">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-400" />
              Your Votes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {userVotes.map((vote) => {
                const votedCreator = vote.creatorId === creator1.id ? creator1 : creator2;
                return (
                  <div key={vote.id} className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <Avatar className="w-8 h-8">
                        <AvatarImage src={votedCreator.avatar} />
                        <AvatarFallback>{votedCreator.displayName[0]}</AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="text-white font-medium">{votedCreator.displayName}</div>
                        <div className="text-xs text-gray-400">
                          {vote.amount} SP at {vote.odds.toFixed(2)}x odds
                        </div>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <div className="text-yellow-400 font-bold">
                        {vote.potentialWinning.toFixed(0)} SP
                      </div>
                      <div className="text-xs text-gray-400">potential</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Voting Phase Warnings */}
      {votingPhase !== 'active' && (
        <Card className="border-yellow-500/30 bg-yellow-500/5">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 text-yellow-400">
              <AlertTriangle className="w-5 h-5" />
              <span className="font-medium">
                {votingPhase === 'closing' && 'Voting closes in 1 minute!'}
                {votingPhase === 'closed' && 'Voting is now closed. Results will be announced when the battle ends.'}
              </span>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Confirmation Modal */}
      {showConfirmation && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <Card className="w-full max-w-md mx-4 bg-gray-900 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">Confirm Your Vote</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center space-y-3">
                <div className="text-gray-300">You are voting</div>
                <div className="text-2xl font-bold text-yellow-400">{getCurrentAmount()} SP</div>
                <div className="text-gray-300">for</div>
                <div className="flex items-center justify-center gap-2">
                  <Avatar className="w-8 h-8">
                    <AvatarImage src={selectedCreator === creator1.id ? creator1.avatar : creator2.avatar} />
                    <AvatarFallback>
                      {selectedCreator === creator1.id ? creator1.displayName[0] : creator2.displayName[0]}
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-white font-bold">
                    {selectedCreator === creator1.id ? creator1.displayName : creator2.displayName}
                  </span>
                </div>
                
                <div className="p-3 bg-gray-800/50 rounded-lg">
                  <div className="text-sm text-gray-400">Potential winning</div>
                  <div className="text-xl font-bold text-green-400">{potentialWinning.toFixed(0)} SP</div>
                </div>
              </div>

              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => setShowConfirmation(false)}
                  className="flex-1 border-gray-600 text-white hover:bg-gray-700"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handlePlaceVote}
                  className="flex-1 bg-blue-600 hover:bg-blue-700"
                >
                  Confirm Vote
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default EnhancedBattleVoting;
