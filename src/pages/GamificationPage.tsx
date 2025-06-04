
import AchievementSystem from "@/components/gamification/AchievementSystem";

const GamificationPage = () => {
  return (
    <div className="container max-w-4xl mx-auto py-6 px-4">
      <h1 className="text-3xl font-bold mb-6">Achievements & Progress</h1>
      <AchievementSystem />
    </div>
  );
};

export default GamificationPage;
