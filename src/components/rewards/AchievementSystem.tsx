import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Trophy,
  Star,
  Crown,
  Award,
  Target,
  Zap,
  Users,
  Calendar,
  TrendingUp,
  Gift,
  Shield,
  Flame,
  Lock,
  CheckCircle
} from "lucide-react";
import { formatCurrency, formatNumber } from "@/utils/formatters";
import { cn } from "@/lib/utils";

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  iconComponent: React.ComponentType<{ className?: string }>;
  category: 'earning' | 'social' | 'consistency' | 'battle' | 'quality' | 'milestone';
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  progress: number;
  target: number;
  reward: number;
  unlocked: boolean;
  unlockedAt?: Date;
  hidden?: boolean;
}

interface AchievementSystemProps {
  className?: string;
}

const AchievementSystem = ({ className }: AchievementSystemProps) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const achievements: Achievement[] = [
    {
      id: "first_earnings",
      title: "First Steps",
      description: "Earn your first SoftPoints",
      icon: "💰",
      iconComponent: Star,
      category: "earning",
      rarity: "common",
      progress: 1,
      target: 1,
      reward: 10,
      unlocked: true,
      unlockedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
    },
    {
      id: "battle_master",
      title: "Battle Master",
      description: "Win 5 battle votes in a row",
      icon: "⚔️",
      iconComponent: Target,
      category: "battle",
      rarity: "epic",
      progress: 5,
      target: 5,
      reward: 100,
      unlocked: true,
      unlockedAt: new Date(Date.now() - 2 * 60 * 60 * 1000)
    },
    {
      id: "content_creator",
      title: "Content Creator",
      description: "Create 50 pieces of quality content",
      icon: "🎨",
      iconComponent: Zap,
      category: "quality",
      rarity: "rare",
      progress: 32,
      target: 50,
      reward: 75,
      unlocked: false
    },
    {
      id: "streak_warrior",
      title: "Streak Warrior",
      description: "Maintain a 30-day activity streak",
      icon: "🔥",
      iconComponent: Flame,
      category: "consistency",
      rarity: "rare",
      progress: 12,
      target: 30,
      reward: 150,
      unlocked: false
    },
    {
      id: "millionaire",
      title: "SP Millionaire",
      description: "Earn 1,000,000 total SoftPoints",
      icon: "👑",
      iconComponent: Crown,
      category: "milestone",
      rarity: "legendary",
      progress: 123456,
      target: 1000000,
      reward: 5000,
      unlocked: false
    },
    {
      id: "gift_giver",
      title: "Generous Soul",
      description: "Send 100 gifts to other creators",
      icon: "🎁",
      iconComponent: Gift,
      category: "social",
      rarity: "rare",
      progress: 23,
      target: 100,
      reward: 200,
      unlocked: false
    },
    {
      id: "trust_builder",
      title: "Trusted Member",
      description: "Reach Gold trust level",
      icon: "🛡️",
      iconComponent: Shield,
      category: "quality",
      rarity: "epic",
      progress: 78,
      target: 90,
      reward: 300,
      unlocked: false
    },
    {
      id: "challenge_champion",
      title: "Challenge Champion",
      description: "Complete 100 challenges",
      icon: "🏆",
      iconComponent: Trophy,
      category: "consistency",
      rarity: "epic",
      progress: 45,
      target: 100,
      reward: 250,
      unlocked: false
    },
    {
      id: "secret_achievement",
      title: "???",
      description: "A mysterious achievement awaits...",
      icon: "❓",
      iconComponent: Lock,
      category: "milestone",
      rarity: "legendary",
      progress: 0,
      target: 1,
      reward: 1000,
      unlocked: false,
      hidden: true
    }
  ];

  const categories = [
    { value: 'all', label: 'All Achievements', icon: Trophy },
    { value: 'earning', label: 'Earning', icon: Star },
    { value: 'battle', label: 'Battle', icon: Target },
    { value: 'quality', label: 'Quality', icon: Award },
    { value: 'consistency', label: 'Consistency', icon: Calendar },
    { value: 'milestone', label: 'Milestone', icon: Crown }
  ];

  const filteredAchievements = selectedCategory === 'all' 
    ? achievements.filter(a => !a.hidden || a.unlocked)
    : achievements.filter(a => a.category === selectedCategory && (!a.hidden || a.unlocked));

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'common': return 'border-gray-300 bg-gray-50 text-gray-700';
      case 'rare': return 'border-blue-300 bg-blue-50 text-blue-700';
      case 'epic': return 'border-purple-300 bg-purple-50 text-purple-700';
      case 'legendary': return 'border-yellow-300 bg-yellow-50 text-yellow-700';
      default: return 'border-gray-300 bg-gray-50 text-gray-700';
    }
  };

  const getRarityBadgeColor = (rarity: string) => {
    switch (rarity) {
      case 'common': return 'bg-gray-500';
      case 'rare': return 'bg-blue-500';
      case 'epic': return 'bg-purple-500';
      case 'legendary': return 'bg-yellow-500';
      default: return 'bg-gray-500';
    }
  };

  const unlockedCount = achievements.filter(a => a.unlocked).length;
  const totalProgress = achievements.reduce((sum, a) => sum + (a.progress / a.target) * 100, 0) / achievements.length;
  const totalRewards = achievements.filter(a => a.unlocked).reduce((sum, a) => sum + a.reward, 0);

  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    
    if (days > 0) return `${days} days ago`;
    if (hours > 0) return `${hours} hours ago`;
    return 'Recently';
  };

  return (
    <div className={cn("space-y-6", className)}>
      {/* Achievement Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Unlocked</p>
                <p className="text-2xl font-bold">{unlockedCount}/{achievements.filter(a => !a.hidden).length}</p>
              </div>
              <Trophy className="h-8 w-8 text-yellow-500" />
            </div>
            <Progress value={(unlockedCount / achievements.filter(a => !a.hidden).length) * 100} className="h-2 mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Overall Progress</p>
                <p className="text-2xl font-bold">{totalProgress.toFixed(0)}%</p>
              </div>
              <TrendingUp className="h-8 w-8 text-blue-500" />
            </div>
            <Progress value={totalProgress} className="h-2 mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Rewards Earned</p>
                <p className="text-2xl font-bold">{formatCurrency(totalRewards)}</p>
              </div>
              <Award className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Achievements */}
      {achievements.filter(a => a.unlocked).length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Star className="h-5 w-5" />
              Recent Achievements
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {achievements
                .filter(a => a.unlocked)
                .sort((a, b) => (b.unlockedAt?.getTime() || 0) - (a.unlockedAt?.getTime() || 0))
                .slice(0, 3)
                .map((achievement) => (
                  <div key={achievement.id} className="flex items-center gap-3 p-3 bg-green-50 border border-green-200 rounded-lg">
                    <div className="text-2xl">{achievement.icon}</div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h4 className="font-semibold">{achievement.title}</h4>
                        <Badge className={getRarityBadgeColor(achievement.rarity)}>
                          {achievement.rarity}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{achievement.description}</p>
                      {achievement.unlockedAt && (
                        <p className="text-xs text-green-600 mt-1">
                          Unlocked {formatTimeAgo(achievement.unlockedAt)}
                        </p>
                      )}
                    </div>
                    <div className="text-right">
                      <div className="text-green-600 font-bold">
                        +{formatCurrency(achievement.reward)}
                      </div>
                      <CheckCircle className="h-5 w-5 text-green-500 mx-auto mt-1" />
                    </div>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>
      )}

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

      {/* Achievements Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredAchievements.map((achievement) => (
          <Card 
            key={achievement.id} 
            className={cn(
              "transition-all hover:shadow-md",
              achievement.unlocked 
                ? getRarityColor(achievement.rarity) 
                : "opacity-75 hover:opacity-100"
            )}
          >
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <div className={cn(
                  "text-3xl flex-shrink-0",
                  !achievement.unlocked && "grayscale opacity-50"
                )}>
                  {achievement.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className={cn(
                      "font-semibold text-sm",
                      achievement.unlocked ? "text-gray-900" : "text-gray-500"
                    )}>
                      {achievement.title}
                    </h3>
                    <Badge 
                      variant="secondary" 
                      className={cn(
                        "text-xs",
                        getRarityBadgeColor(achievement.rarity),
                        "text-white"
                      )}
                    >
                      {achievement.rarity}
                    </Badge>
                  </div>
                  
                  <p className={cn(
                    "text-xs mb-3",
                    achievement.unlocked ? "text-gray-600" : "text-gray-400"
                  )}>
                    {achievement.description}
                  </p>

                  {!achievement.unlocked && (
                    <div className="space-y-2">
                      <div className="flex justify-between text-xs">
                        <span>Progress: {formatNumber(achievement.progress)}/{formatNumber(achievement.target)}</span>
                        <span>{Math.round((achievement.progress / achievement.target) * 100)}%</span>
                      </div>
                      <Progress 
                        value={(achievement.progress / achievement.target) * 100} 
                        className="h-2"
                      />
                    </div>
                  )}

                  <div className="flex items-center justify-between mt-3">
                    <div className={cn(
                      "text-xs font-medium",
                      achievement.unlocked ? "text-green-600" : "text-gray-500"
                    )}>
                      Reward: {formatCurrency(achievement.reward)}
                    </div>
                    {achievement.unlocked && (
                      <CheckCircle className="h-4 w-4 text-green-500" />
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredAchievements.length === 0 && (
        <Card>
          <CardContent className="p-8 text-center">
            <Trophy className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No achievements found</h3>
            <p className="text-gray-600">Try selecting a different category or keep earning to unlock new achievements!</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default AchievementSystem;
