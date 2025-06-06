
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface RewardsHeaderProps {
  activeTab: string;
  setActiveTab: (value: string) => void;
}

const RewardsHeader = ({ activeTab, setActiveTab }: RewardsHeaderProps) => {
  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
      <div>
        <h1 className="text-2xl font-bold">Rewards & Achievements</h1>
        <p className="text-muted-foreground">Earn points, unlock achievements and redeem exclusive rewards</p>
      </div>
      <div className="mt-4 md:mt-0">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="earn">Earn Points</TabsTrigger>
            <TabsTrigger value="achievements">Achievements</TabsTrigger>
            <TabsTrigger value="redeem">Redeem</TabsTrigger>
            <TabsTrigger value="history">History</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
    </div>
  );
};

export default RewardsHeader;
