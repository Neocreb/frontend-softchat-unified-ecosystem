import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Target,
  Trophy,
  Clock,
  Star,
  Users,
  Zap,
  Gift,
  TrendingUp,
  ArrowRight,
  Calendar,
  CheckCircle,
  Play
} from "lucide-react";
import { formatCurrency } from "@/utils/formatters";
import { rewardsNotificationService } from "@/services/rewardsNotificationService";

interface Challenge {
  id: string;
  title: string;
  description: string;
  reward: number;
  progress: number;
  target: number;
  timeLeft: string;
  difficulty: 'easy' | 'medium' | 'hard';
  category: string;
  status: 'active' | 'completed' | 'locked';
  featured?: boolean;
}

const RewardsChallengesTab = () => {
  const [selectedCategory, setSelectedCategory] = useState("all");

  const challenges: Challenge[] = [
    {
      id: "daily-1",
      title: "Daily Post Creator",
      description: "Create and publish 1 quality post",
      reward: 15,
      progress: 1,
      target: 1,
      timeLeft: "18h 32m",
      difficulty: "easy",
      category: "Content",
      status: "completed",
      featured: true
    },
    {
      id: "weekly-1",
      title: "Engagement Master",
      description: "Get 100 total interactions on your content",
      reward: 50,
      progress: 73,
      target: 100,
      timeLeft: "4d 12h",
      difficulty: "medium",
      category: "Engagement",
      status: "active"
    },
    {
      id: "weekly-2",
      title: "Marketplace Seller",
      description: "Make 3 sales on the marketplace",
      reward: 75,
      progress: 1,
      target: 3,
      timeLeft: "5d 8h",
      difficulty: "medium",
      category: "Sales",
      status: "active"
    },
    {
      id: "monthly-1",
      title: "Creator Streak",
      description: "Maintain a 30-day posting streak",
      reward: 200,
      progress: 12,
      target: 30,
      timeLeft: "18d",
      difficulty: "hard",
      category: "Consistency",
      status: "active"
    },
    {
      id: "special-1",
      title: "Referral Champion",
      description: "Invite 5 friends to join the platform",
      reward: 150,
      progress: 2,
      target: 5,
      timeLeft: "No limit",
      difficulty: "medium",
      category: "Community",
      status: "active",
      featured: true
    },
    {
      id: "bonus-1",
      title: "Quality Content Bonus",
      description: "Create content with 90%+ quality score",
      reward: 30,
      progress: 0,
      target: 1,
      timeLeft: "23h 45m",
      difficulty: "hard",
      category: "Quality",
      status: "active"
    }
  ];

  const suggestedChallenges: Challenge[] = [
    {
      id: "suggested-1",
      title: "Live Stream Explorer",
      description: "Host your first live stream session",
      reward: 100,
      progress: 0,
      target: 1,
      timeLeft: "7d",
      difficulty: "medium",
      category: "Live",
      status: "locked"
    },
    {
      id: "suggested-2",
      title: "Community Helper",
      description: "Help 10 users with comments/tips",
      reward: 40,
      progress: 0,
      target: 10,
      timeLeft: "7d",
      difficulty: "easy",
      category: "Community",
      status: "locked"
    },
    {
      id: "suggested-3",
      title: "Crypto Trader",
      description: "Complete 5 P2P crypto trades",
      reward: 80,
      progress: 0,
      target: 5,
      timeLeft: "14d",
      difficulty: "hard",
      category: "Trading",
      status: "locked"
    }
  ];

  const categories = [
    { value: "all", label: "All Challenges", icon: Target },
    { value: "Content", label: "Content", icon: Zap },
    { value: "Engagement", label: "Engagement", icon: TrendingUp },
    { value: "Sales", label: "Sales", icon: Gift },
    { value: "Community", label: "Community", icon: Users },
    { value: "Consistency", label: "Consistency", icon: Calendar }
  ];

  const filteredChallenges = selectedCategory === "all" 
    ? challenges 
    : challenges.filter(challenge => challenge.category === selectedCategory);

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'hard': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'active': return <Play className="h-4 w-4 text-blue-500" />;
      case 'locked': return <Clock className="h-4 w-4 text-gray-400" />;
      default: return null;
    }
  };

  const totalActiveRewards = challenges
    .filter(c => c.status === 'active')
    .reduce((sum, c) => sum + c.reward, 0);

  const completedToday = challenges.filter(c => c.status === 'completed').length;

  return (
    <div className="space-y-6">
      {/* Challenge Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Active Challenges</p>
                <p className="text-2xl font-bold">{challenges.filter(c => c.status === 'active').length}</p>
              </div>
              <Target className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Completed Today</p>
                <p className="text-2xl font-bold">{completedToday}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Potential Rewards</p>
                <p className="text-2xl font-bold">{formatCurrency(totalActiveRewards)}</p>
              </div>
              <Gift className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Success Rate</p>
                <p className="text-2xl font-bold">87%</p>
              </div>
              <Trophy className="h-8 w-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Category Filter */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <Button
                key={category.value}
                variant={selectedCategory === category.value ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(category.value)}
                className="flex items-center gap-2"
              >
                <category.icon className="h-4 w-4" />
                {category.label}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Active Challenges */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            Active Challenges
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredChallenges.map((challenge) => (
              <Card key={challenge.id} className={`relative ${challenge.featured ? 'ring-2 ring-blue-500' : ''}`}>
                {challenge.featured && (
                  <Badge className="absolute -top-2 left-4 bg-blue-500">
                    <Star className="h-3 w-3 mr-1" />
                    Featured
                  </Badge>
                )}
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg mb-1">{challenge.title}</h3>
                      <p className="text-muted-foreground text-sm mb-3">{challenge.description}</p>
                      
                      <div className="flex items-center gap-2 mb-3">
                        <Badge variant="secondary" className={getDifficultyColor(challenge.difficulty)}>
                          {challenge.difficulty.charAt(0).toUpperCase() + challenge.difficulty.slice(1)}
                        </Badge>
                        <Badge variant="outline">{challenge.category}</Badge>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center gap-1 mb-1">
                        {getStatusIcon(challenge.status)}
                        <span className="text-sm capitalize">{challenge.status}</span>
                      </div>
                      <div className="text-green-600 font-bold">
                        +{formatCurrency(challenge.reward)}
                      </div>
                    </div>
                  </div>

                  {challenge.status !== 'locked' && (
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Progress: {challenge.progress}/{challenge.target}</span>
                        <span>{Math.round((challenge.progress / challenge.target) * 100)}%</span>
                      </div>
                      <Progress 
                        value={(challenge.progress / challenge.target) * 100} 
                        className="h-2"
                      />
                    </div>
                  )}

                  <div className="flex items-center justify-between mt-4">
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Clock className="h-4 w-4 mr-1" />
                      {challenge.timeLeft}
                    </div>
                    <Button
                      size="sm"
                      variant={challenge.status === 'completed' ? "secondary" : "default"}
                      disabled={challenge.status === 'completed' || challenge.status === 'locked'}
                      onClick={() => {
                        if (challenge.status === 'active') {
                          // Simulate challenge completion for demo
                          rewardsNotificationService.notifyChallengeCompleted(
                            challenge.title,
                            challenge.reward
                          );
                        }
                      }}
                    >
                      {challenge.status === 'completed' ? 'Completed' :
                       challenge.status === 'locked' ? 'Locked' : 'View Details'}
                      {challenge.status === 'active' && <ArrowRight className="h-4 w-4 ml-1" />}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Suggested Challenges */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Star className="h-5 w-5" />
              Suggested for You
            </CardTitle>
            <Badge variant="secondary">New Opportunities</Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {suggestedChallenges.map((challenge) => (
              <Card key={challenge.id} className="border-dashed">
                <CardContent className="p-4">
                  <h4 className="font-medium mb-2">{challenge.title}</h4>
                  <p className="text-sm text-muted-foreground mb-3">{challenge.description}</p>
                  
                  <div className="flex items-center justify-between mb-3">
                    <Badge variant="outline" className={getDifficultyColor(challenge.difficulty)}>
                      {challenge.difficulty}
                    </Badge>
                    <span className="text-green-600 font-semibold">
                      +{formatCurrency(challenge.reward)}
                    </span>
                  </div>

                  <Button size="sm" variant="outline" className="w-full">
                    Unlock Challenge
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
          
          <div className="mt-6 text-center">
            <Button variant="outline">
              <TrendingUp className="h-4 w-4 mr-2" />
              View More Challenges
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default RewardsChallengesTab;
