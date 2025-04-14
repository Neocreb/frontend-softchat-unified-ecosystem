
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface WalletHeaderProps {
  activeTab: string;
  setActiveTab: (value: string) => void;
}

const WalletHeader = ({ activeTab, setActiveTab }: WalletHeaderProps) => {
  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
      <div>
        <h1 className="text-2xl font-bold">Financial Hub</h1>
        <p className="text-muted-foreground">Manage your wallet, rewards, and investments</p>
      </div>
      <div className="mt-4 md:mt-0">
        <TabsList>
          <TabsTrigger 
            value="overview" 
            onClick={() => setActiveTab("overview")}
          >
            Overview
          </TabsTrigger>
          <TabsTrigger 
            value="rewards" 
            onClick={() => setActiveTab("rewards")}
          >
            Rewards
          </TabsTrigger>
          <TabsTrigger 
            value="transactions" 
            onClick={() => setActiveTab("transactions")}
          >
            Transactions
          </TabsTrigger>
        </TabsList>
      </div>
    </div>
  );
};

export default WalletHeader;
