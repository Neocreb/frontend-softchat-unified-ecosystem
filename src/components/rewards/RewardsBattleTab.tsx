import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import {
  Play,
  Clock,
  Trophy,
  Users,
  Flame,
  Target,
  Star,
  DollarSign,
  TrendingUp,
  ArrowRight,
  Crown,
  Zap,
  Eye
} from "lucide-react";
import { formatCurrency } from "@/utils/formatters";
import BattleVoting from "@/components/voting/BattleVoting";

interface Creator {
  id: string;
  username: string;
  displayName: string;
  avatar: string;
  verified: boolean;
  tier: 'rising_star' | 'pro_creator' | 'legend';
  winRate: number;
  totalVotes: number;
  isLeading: boolean;
  currentScore: number;
  followers: string;
}

interface Battle {
  id: string;
  title: string;
  status: 'live' | 'upcoming' | 'ended';
  timeRemaining: number;
  viewerCount: number;
  creator1: Creator;
  creator2: Creator;
  votingPool: {
    creator1Total: number;
    creator2Total: number;
    totalPool: number;
    totalVoters: number;
  };
  potentialEarnings: number;
  featured?: boolean;
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

const RewardsBattleTab = () => {
  const [selectedBattle, setSelectedBattle] = useState<Battle | null>(null);
  const [showVotingModal, setShowVotingModal] = useState(false);
  const [userVotes, setUserVotes] = useState<Vote[]>([]);
  const [userBalance] = useState(2500); // Mock user balance
  const [filter, setFilter] = useState<'all' | 'live' | 'upcoming'>('all');

  const mockBattles: Battle[] = [
    {
      id: "battle-1",
      title: "Creator Showdown #1",
      status: "live",
      timeRemaining: 1847, // 30 minutes
      viewerCount: 15420,
      creator1: {
        id: "creator-1",
        username: "alexdance",
        displayName: "Alex Dance",
        avatar: "https://i.pravatar.cc/150?u=alex",
        verified: true,
        tier: "pro_creator",
        winRate: 78,
        totalVotes: 145,
        isLeading: true,
        currentScore: 2340,
        followers: "125K"
      },
      creator2: {
        id: "creator-2",
        username: "musicmike",
        displayName: "Music Mike",
        avatar: "https://i.pravatar.cc/150?u=mike",
        verified: false,
        tier: "rising_star",
        winRate: 65,
        totalVotes: 98,
        isLeading: false,
        currentScore: 1890,
        followers: "89K"
      },
      votingPool: {
        creator1Total: 850,
        creator2Total: 620,
        totalPool: 1470,
        totalVoters: 42
      },
      potentialEarnings: 125,
      featured: true
    },
    {
      id: "battle-2",
      title: "Comedy Battle Royale",
      status: "live",
      timeRemaining: 892,
      viewerCount: 8930,
      creator1: {
        id: "creator-3",
        username: "funnygirl",
        displayName: "Sarah Comedy",
        avatar: "https://i.pravatar.cc/150?u=sarah",
        verified: true,
        tier: "legend",
        winRate: 85,
        totalVotes: 201,
        isLeading: false,
        currentScore: 1560,
        followers: "340K"
      },
      creator2: {
        id: "creator-4",
        username: "jokester",
        displayName: "Jake Jokes",
        avatar: "https://i.pravatar.cc/150?u=jake",
        verified: true,
        tier: "pro_creator",
        winRate: 72,
        totalVotes: 156,
        isLeading: true,
        currentScore: 1680,
        followers: "201K"
      },
      votingPool: {
        creator1Total: 420,
        creator2Total: 590,
        totalPool: 1010,
        totalVoters: 28
      },
      potentialEarnings: 95
    },
    {
      id: "battle-3",
      title: "Talent vs Experience",
      status: "upcoming",
      timeRemaining: 3600, // 1 hour
      viewerCount: 0,
      creator1: {
        id: "creator-5",
        username: "newtalent",
        displayName: "Rising Star",
        avatar: "https://i.pravatar.cc/150?u=rising",
        verified: false,
        tier: "rising_star",
        winRate: 55,
        totalVotes: 45,
        isLeading: false,
        currentScore: 0,
        followers: "12K"
      },
      creator2: {
        id: "creator-6",
        username: "veteran",
        displayName: "Pro Creator",
        avatar: "https://i.pravatar.cc/150?u=veteran",
        verified: true,
        tier: "legend",
        winRate: 92,
        totalVotes: 389,
        isLeading: false,
        currentScore: 0,
        followers: "567K"
      },
      votingPool: {
        creator1Total: 150,
        creator2Total: 340,
        totalPool: 490,
        totalVoters: 12
      },
      potentialEarnings: 75
    }
  ];

  const filteredBattles = filter === 'all' 
    ? mockBattles 
    : mockBattles.filter(battle => battle.status === filter);

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m ${secs}s`;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'live': return 'bg-red-500 text-white animate-pulse';
      case 'upcoming': return 'bg-blue-500 text-white';
      case 'ended': return 'bg-gray-500 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  const getTierIcon = (tier: string) => {
    switch (tier) {
      case 'legend': return <Crown className="w-4 h-4 text-yellow-400" />;
      case 'pro_creator': return <Trophy className="w-4 h-4 text-purple-400" />;
      case 'rising_star': return <Star className="w-4 h-4 text-blue-400" />;
      default: return null;
    }
  };

  const handleVoteBattle = (battle: Battle) => {
    setSelectedBattle(battle);
    setShowVotingModal(true);
  };

  const handlePlaceVote = (vote: Omit<Vote, 'id' | 'timestamp' | 'status'>) => {
    const newVote: Vote = {
      ...vote,
      id: Date.now().toString(),
      timestamp: new Date(),
      status: 'active',
    };

    setUserVotes(prev => [...prev, newVote]);
    setShowVotingModal(false);
  };

  const totalEarnings = userVotes
    .filter(vote => vote.status === 'won')
    .reduce((sum, vote) => sum + vote.potentialWinning, 0);

  const activeBets = userVotes.filter(vote => vote.status === 'active').length;

  return (
    <div className="space-y-6">
      {/* Battle Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Live Battles</p>
                <p className="text-2xl font-bold">{mockBattles.filter(b => b.status === 'live').length}</p>
              </div>
              <Flame className="h-8 w-8 text-red-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Active Bets</p>
                <p className="text-2xl font-bold">{activeBets}</p>
              </div>
              <Target className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Earnings</p>
                <p className="text-2xl font-bold">{formatCurrency(totalEarnings)}</p>
              </div>
              <DollarSign className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Balance</p>
                <p className="text-2xl font-bold">{formatCurrency(userBalance)}</p>
              </div>
              <Trophy className="h-8 w-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filter Buttons */}
      <Card>
        <CardContent className="p-4">
          <div className="flex gap-2">
            {[
              { value: 'all', label: 'All Battles', icon: Trophy },
              { value: 'live', label: 'Live Now', icon: Flame },
              { value: 'upcoming', label: 'Upcoming', icon: Clock }
            ].map((option) => (
              <Button
                key={option.value}
                variant={filter === option.value ? "default" : "outline"}
                size="sm"
                onClick={() => setFilter(option.value as any)}
                className="flex items-center gap-2"
              >
                <option.icon className="h-4 w-4" />
                {option.label}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Battle List */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredBattles.map((battle) => (
          <Card key={battle.id} className={`relative ${battle.featured ? 'ring-2 ring-yellow-500' : ''}`}>
            {battle.featured && (
              <Badge className="absolute -top-2 left-4 bg-yellow-500">
                <Star className="h-3 w-3 mr-1" />
                Featured
              </Badge>
            )}
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">{battle.title}</CardTitle>
                <Badge className={getStatusColor(battle.status)}>
                  {battle.status === 'live' && <Flame className="h-3 w-3 mr-1" />}
                  {battle.status.toUpperCase()}
                </Badge>
              </div>
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  {battle.status === 'upcoming' ? `Starts in ${formatTime(battle.timeRemaining)}` : 
                   battle.status === 'live' ? `${formatTime(battle.timeRemaining)} left` : 'Ended'}
                </div>
                {battle.status !== 'upcoming' && (
                  <div className="flex items-center gap-1">
                    <Eye className="h-4 w-4" />
                    {battle.viewerCount.toLocaleString()} viewers
                  </div>
                )}
              </div>
            </CardHeader>

            <CardContent className="space-y-4">
              {/* Creators Comparison */}
              <div className="grid grid-cols-2 gap-4">
                {/* Creator 1 */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Avatar className="w-8 h-8">
                      <AvatarImage src={battle.creator1.avatar} />
                      <AvatarFallback>{battle.creator1.displayName[0]}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1">
                        <span className="font-medium text-sm truncate">{battle.creator1.displayName}</span>
                        {battle.creator1.verified && <Badge variant="secondary" className="h-4 w-4 p-0">✓</Badge>}
                        {getTierIcon(battle.creator1.tier)}
                      </div>
                      <div className="text-xs text-muted-foreground">{battle.creator1.followers}</div>
                    </div>
                  </div>
                  <div className="text-xs space-y-1">
                    <div className="flex justify-between">
                      <span>Win Rate:</span>
                      <span className="font-medium">{battle.creator1.winRate}%</span>
                    </div>
                    {battle.status === 'live' && (
                      <div className="flex justify-between">
                        <span>Score:</span>
                        <span className="font-medium">{battle.creator1.currentScore}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* VS Divider */}
                <div className="flex items-center justify-center">
                  <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
                    <span className="text-xs font-bold">VS</span>
                  </div>
                </div>

                {/* Creator 2 */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Avatar className="w-8 h-8">
                      <AvatarImage src={battle.creator2.avatar} />
                      <AvatarFallback>{battle.creator2.displayName[0]}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1">
                        <span className="font-medium text-sm truncate">{battle.creator2.displayName}</span>
                        {battle.creator2.verified && <Badge variant="secondary" className="h-4 w-4 p-0">✓</Badge>}
                        {getTierIcon(battle.creator2.tier)}
                      </div>
                      <div className="text-xs text-muted-foreground">{battle.creator2.followers}</div>
                    </div>
                  </div>
                  <div className="text-xs space-y-1">
                    <div className="flex justify-between">
                      <span>Win Rate:</span>
                      <span className="font-medium">{battle.creator2.winRate}%</span>
                    </div>
                    {battle.status === 'live' && (
                      <div className="flex justify-between">
                        <span>Score:</span>
                        <span className="font-medium">{battle.creator2.currentScore}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Voting Pool Info */}
              <div className="bg-gray-50 p-3 rounded-lg space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Total Voting Pool</span>
                  <span className="font-bold text-green-600">
                    {formatCurrency(battle.votingPool.totalPool)}
                  </span>
                </div>
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>{battle.votingPool.totalVoters} voters</span>
                  <span>Potential: +{formatCurrency(battle.potentialEarnings)}</span>
                </div>
                {battle.status !== 'ended' && (
                  <Progress 
                    value={(battle.votingPool.creator1Total / battle.votingPool.totalPool) * 100} 
                    className="h-2"
                  />
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2">
                {battle.status === 'live' && (
                  <Button size="sm" variant="outline" className="flex-1">
                    <Play className="h-4 w-4 mr-2" />
                    Watch Live
                  </Button>
                )}
                {battle.status !== 'ended' && (
                  <Button 
                    size="sm" 
                    className="flex-1 bg-green-600 hover:bg-green-700"
                    onClick={() => handleVoteBattle(battle)}
                  >
                    <Target className="h-4 w-4 mr-2" />
                    Vote & Earn
                  </Button>
                )}
                {battle.status === 'ended' && (
                  <Button size="sm" variant="secondary" className="flex-1" disabled>
                    <Trophy className="h-4 w-4 mr-2" />
                    Battle Ended
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* How Battle Voting Works */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            How Battle Voting Works
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Target className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="font-semibold mb-2">Choose Your Creator</h3>
              <p className="text-sm text-muted-foreground">
                Select which creator you think will win the battle based on their stats and performance.
              </p>
            </div>
            <div className="text-center p-4">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <DollarSign className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="font-semibold mb-2">Place Your Bet</h3>
              <p className="text-sm text-muted-foreground">
                Vote with your SoftPoints. Higher odds mean higher potential rewards.
              </p>
            </div>
            <div className="text-center p-4">
              <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Trophy className="h-6 w-6 text-yellow-600" />
              </div>
              <h3 className="font-semibold mb-2">Earn Rewards</h3>
              <p className="text-sm text-muted-foreground">
                Win based on odds calculation. Winners share 90% of the pool, 10% platform fee.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Battle Voting Modal */}
      {showVotingModal && selectedBattle && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-4 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-white font-semibold text-lg">Battle Voting: {selectedBattle.title}</h3>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowVotingModal(false)}
                className="text-gray-400 hover:text-white"
              >
                ×
              </Button>
            </div>

            <div className="bg-gray-900 rounded-lg p-4">
              <BattleVoting
                battleId={selectedBattle.id}
                creator1={selectedBattle.creator1}
                creator2={selectedBattle.creator2}
                isLive={selectedBattle.status === 'live'}
                timeRemaining={selectedBattle.timeRemaining}
                userBalance={userBalance}
                onPlaceVote={handlePlaceVote}
                userVotes={userVotes.filter(vote => 
                  vote.creatorId === selectedBattle.creator1.id || 
                  vote.creatorId === selectedBattle.creator2.id
                )}
                votingPool={selectedBattle.votingPool}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RewardsBattleTab;
