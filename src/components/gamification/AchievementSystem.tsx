
import { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Trophy, Star, Flame, Target, Award } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabase/client";
import { cn } from "@/utils/utils";

interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: string;
  points_reward: number;
  badge_color: string;
  requirements: any;
  earned?: boolean;
  progress?: number;
}

interface Challenge {
  id: string;
  title: string;
  description: string;
  type: string;
  target_value: number;
  points_reward: number;
  current_progress: number;
  completed: boolean;
}

interface UserStreak {
  streak_type: string;
  current_streak: number;
  longest_streak: number;
}

const AchievementSystem = () => {
  const { user } = useAuth();
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [streaks, setStreaks] = useState<UserStreak[]>([]);
  const [userPoints, setUserPoints] = useState(0);
  const [activeTab, setActiveTab] = useState<'achievements' | 'challenges' | 'streaks'>('achievements');

  useEffect(() => {
    if (user) {
      loadMockData();
      fetchUserPoints();
    }
  }, [user]);

  const loadMockData = () => {
    // Mock achievements data
    const mockAchievements: Achievement[] = [
      {
        id: '1',
        name: 'First Post',
        description: 'Create your first post',
        icon: 'star',
        category: 'content',
        points_reward: 10,
        badge_color: 'blue',
        requirements: {},
        earned: true,
        progress: 100
      },
      {
        id: '2',
        name: 'Social Butterfly',
        description: 'Get 100 likes on your posts',
        icon: 'heart',
        category: 'social',
        points_reward: 50,
        badge_color: 'pink',
        requirements: {},
        earned: false,
        progress: 65
      },
      {
        id: '3',
        name: 'Crypto Trader',
        description: 'Complete 10 trades',
        icon: 'trending-up',
        category: 'trading',
        points_reward: 100,
        badge_color: 'green',
        requirements: {},
        earned: false,
        progress: 30
      }
    ];

    // Mock challenges data
    const mockChallenges: Challenge[] = [
      {
        id: '1',
        title: 'Daily Login',
        description: 'Log in to the app',
        type: 'daily',
        target_value: 1,
        points_reward: 5,
        current_progress: 1,
        completed: true
      },
      {
        id: '2',
        title: 'Create 3 Posts',
        description: 'Share 3 posts today',
        type: 'daily',
        target_value: 3,
        points_reward: 15,
        current_progress: 1,
        completed: false
      },
      {
        id: '3',
        title: 'Like 10 Posts',
        description: 'Show some love to the community',
        type: 'daily',
        target_value: 10,
        points_reward: 10,
        current_progress: 7,
        completed: false
      }
    ];

    // Mock streaks data
    const mockStreaks: UserStreak[] = [
      {
        streak_type: 'posting',
        current_streak: 5,
        longest_streak: 12
      },
      {
        streak_type: 'login',
        current_streak: 15,
        longest_streak: 25
      },
      {
        streak_type: 'engagement',
        current_streak: 3,
        longest_streak: 8
      }
    ];

    setAchievements(mockAchievements);
    setChallenges(mockChallenges);
    setStreaks(mockStreaks);
  };

  const fetchUserPoints = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('points')
        .eq('user_id', user?.id)
        .single();

      if (error) {
        console.log('Profile not found, using default points');
        setUserPoints(0);
        return;
      }

      if (data) {
        setUserPoints(data.points || 0);
      }
    } catch (error) {
      console.error('Error fetching user points:', error);
      setUserPoints(0);
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'content': return <Star className="h-5 w-5" />;
      case 'social': return <Award className="h-5 w-5" />;
      case 'engagement': return <Target className="h-5 w-5" />;
      case 'trading': return <Trophy className="h-5 w-5" />;
      case 'consistency': return <Flame className="h-5 w-5" />;
      default: return <Trophy className="h-5 w-5" />;
    }
  };

  const getStreakIcon = (type: string) => {
    switch (type) {
      case 'posting': return '📝';
      case 'login': return '🗓️';
      case 'engagement': return '❤️';
      case 'trading': return '💰';
      default: return '🔥';
    }
  };

  return (
    <div className="space-y-6">
      {/* Points display */}
      <Card className="bg-gradient-to-r from-purple-500 to-blue-600 text-white">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold mb-2">Your Points</h2>
              <p className="text-3xl font-bold">{userPoints.toLocaleString()}</p>
            </div>
            <Trophy className="h-16 w-16 opacity-20" />
          </div>
        </CardContent>
      </Card>

      {/* Tabs */}
      <div className="flex space-x-1 bg-muted p-1 rounded-lg">
        {(['achievements', 'challenges', 'streaks'] as const).map((tab) => (
          <Button
            key={tab}
            variant={activeTab === tab ? "default" : "ghost"}
            className="flex-1 capitalize"
            onClick={() => setActiveTab(tab)}
          >
            {tab}
          </Button>
        ))}
      </div>

      {/* Achievements tab */}
      {activeTab === 'achievements' && (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {achievements.map((achievement) => (
            <Card key={achievement.id} className={cn(
              "transition-all duration-200",
              achievement.earned ? "bg-gradient-to-br from-yellow-50 to-orange-50 border-yellow-200" : ""
            )}>
              <CardHeader className="pb-3">
                <div className="flex items-center gap-3">
                  <div className={cn(
                    "p-2 rounded-full",
                    achievement.earned ? "bg-yellow-100" : "bg-muted"
                  )}>
                    {getCategoryIcon(achievement.category)}
                  </div>
                  <div className="flex-1">
                    <CardTitle className="text-base">{achievement.name}</CardTitle>
                    <Badge variant={achievement.earned ? "default" : "secondary"} className="mt-1">
                      {achievement.points_reward} points
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-3">{achievement.description}</p>
                {!achievement.earned && (
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Progress</span>
                      <span>{achievement.progress}%</span>
                    </div>
                    <Progress value={achievement.progress} className="h-2" />
                  </div>
                )}
                {achievement.earned && (
                  <div className="flex items-center gap-2 text-yellow-600">
                    <Trophy className="h-4 w-4" />
                    <span className="text-sm font-medium">Completed!</span>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Challenges tab */}
      {activeTab === 'challenges' && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Today's Challenges</h3>
          <div className="grid gap-4 md:grid-cols-2">
            {challenges.map((challenge) => (
              <Card key={challenge.id} className={cn(
                "transition-all duration-200",
                challenge.completed ? "bg-gradient-to-br from-green-50 to-emerald-50 border-green-200" : ""
              )}>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base">{challenge.title}</CardTitle>
                    <Badge variant={challenge.completed ? "default" : "secondary"}>
                      {challenge.points_reward} pts
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-3">{challenge.description}</p>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Progress</span>
                      <span>{challenge.current_progress} / {challenge.target_value}</span>
                    </div>
                    <Progress 
                      value={(challenge.current_progress / challenge.target_value) * 100} 
                      className="h-2" 
                    />
                  </div>
                  {challenge.completed && (
                    <div className="flex items-center gap-2 text-green-600 mt-3">
                      <Trophy className="h-4 w-4" />
                      <span className="text-sm font-medium">Completed!</span>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Streaks tab */}
      {activeTab === 'streaks' && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Your Streaks</h3>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {streaks.map((streak) => (
              <Card key={streak.streak_type}>
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{getStreakIcon(streak.streak_type)}</span>
                    <CardTitle className="capitalize">{streak.streak_type} Streak</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm text-muted-foreground">Current Streak</p>
                      <p className="text-2xl font-bold text-orange-500">{streak.current_streak} days</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Best Streak</p>
                      <p className="text-lg font-semibold">{streak.longest_streak} days</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default AchievementSystem;
