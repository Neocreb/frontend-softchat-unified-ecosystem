
import AchievementSystem from "@/components/gamification/AchievementSystem";

const GamificationPage = () => {
  return (
    <div className="container mx-auto py-6 px-4">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Progress & Achievements</h1>
        <p className="text-muted-foreground mt-2">
          Track your achievements, complete daily challenges, and maintain your streaks
        </p>
      </div>
      
      <AchievementSystem />
    </div>
  );
};

export default GamificationPage;
