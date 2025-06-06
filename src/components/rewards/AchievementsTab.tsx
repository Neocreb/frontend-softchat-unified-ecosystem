
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Trophy, Star, Target, Zap, Users, Heart } from "lucide-react";

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  progress: number;
  maxProgress: number;
  points: number;
  unlocked: boolean;
  category: "social" | "engagement" | "milestones" | "special";
}

const AchievementsTab = () => {
  const achievements: Achievement[] = [
    {
      id: "1",
      title: "First Post",
      description: "Create your first post",
      icon: "star",
      progress: 1,
      maxProgress: 1,
      points: 50,
      unlocked: true,
      category: "milestones"
    },
    {
      id: "2",
      title: "Social Butterfly",
      description: "Follow 10 users",
      icon: "users",
      progress: 7,
      maxProgress: 10,
      points: 100,
      unlocked: false,
      category: "social"
    },
    {
      id: "3",
      title: "Engagement Master",
      description: "Get 100 likes on your posts",
      icon: "heart",
      progress: 45,
      maxProgress: 100,
      points: 200,
      unlocked: false,
      category: "engagement"
    },
    {
      id: "4",
      title: "Content Creator",
      description: "Upload 5 videos",
      icon: "zap",
      progress: 2,
      maxProgress: 5,
      points: 150,
      unlocked: false,
      category: "milestones"
    }
  ];

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case "star": return <Star className="h-6 w-6" />;
      case "users": return <Users className="h-6 w-6" />;
      case "heart": return <Heart className="h-6 w-6" />;
      case "zap": return <Zap className="h-6 w-6" />;
      default: return <Trophy className="h-6 w-6" />;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "social": return "bg-blue-500";
      case "engagement": return "bg-pink-500";
      case "milestones": return "bg-yellow-500";
      case "special": return "bg-purple-500";
      default: return "bg-gray-500";
    }
  };

  const unlockedAchievements = achievements.filter(a => a.unlocked);
  const lockedAchievements = achievements.filter(a => !a.unlocked);

  return (
    <div className="space-y-6">
      {/* Achievement Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-6 text-center">
            <div className="flex items-center justify-center mb-2">
              <Trophy className="h-8 w-8 text-yellow-500" />
            </div>
            <h3 className="text-2xl font-bold">{unlockedAchievements.length}</h3>
            <p className="text-muted-foreground">Achievements Unlocked</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6 text-center">
            <div className="flex items-center justify-center mb-2">
              <Target className="h-8 w-8 text-blue-500" />
            </div>
            <h3 className="text-2xl font-bold">{achievements.length}</h3>
            <p className="text-muted-foreground">Total Achievements</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6 text-center">
            <div className="flex items-center justify-center mb-2">
              <Star className="h-8 w-8 text-purple-500" />
            </div>
            <h3 className="text-2xl font-bold">
              {unlockedAchievements.reduce((sum, a) => sum + a.points, 0)}
            </h3>
            <p className="text-muted-foreground">Points Earned</p>
          </CardContent>
        </Card>
      </div>

      {/* Unlocked Achievements */}
      {unlockedAchievements.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <Trophy className="h-5 w-5 text-yellow-500" />
            Unlocked Achievements
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {unlockedAchievements.map((achievement) => (
              <Card key={achievement.id} className="border-yellow-200 bg-yellow-50/50">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-full ${getCategoryColor(achievement.category)} text-white`}>
                        {getIcon(achievement.icon)}
                      </div>
                      <div>
                        <CardTitle className="text-lg">{achievement.title}</CardTitle>
                        <p className="text-sm text-muted-foreground">{achievement.description}</p>
                      </div>
                    </div>
                    <Badge variant="default" className="bg-yellow-500">
                      +{achievement.points} pts
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-green-600 font-medium">✓ Completed</span>
                    <span className="text-muted-foreground">
                      {achievement.progress}/{achievement.maxProgress}
                    </span>
                  </div>
                  <Progress value={100} className="mt-2" />
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* In Progress Achievements */}
      {lockedAchievements.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <Target className="h-5 w-5 text-blue-500" />
            In Progress
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {lockedAchievements.map((achievement) => (
              <Card key={achievement.id}>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-full ${getCategoryColor(achievement.category)} text-white opacity-60`}>
                        {getIcon(achievement.icon)}
                      </div>
                      <div>
                        <CardTitle className="text-lg">{achievement.title}</CardTitle>
                        <p className="text-sm text-muted-foreground">{achievement.description}</p>
                      </div>
                    </div>
                    <Badge variant="outline">
                      +{achievement.points} pts
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="flex items-center justify-between text-sm mb-2">
                    <span className="text-muted-foreground">Progress</span>
                    <span className="text-muted-foreground">
                      {achievement.progress}/{achievement.maxProgress}
                    </span>
                  </div>
                  <Progress 
                    value={(achievement.progress / achievement.maxProgress) * 100} 
                    className="mt-2" 
                  />
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default AchievementsTab;
