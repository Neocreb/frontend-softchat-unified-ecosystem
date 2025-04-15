
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Bank } from "lucide-react";

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
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="overview">
              Overview
            </TabsTrigger>
            <TabsTrigger value="rewards">
              Rewards
            </TabsTrigger>
            <TabsTrigger value="transactions">
              Transactions
            </TabsTrigger>
            <TabsTrigger value="bank">
              <Bank className="h-4 w-4 mr-1" />
              Bank
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
    </div>
  );
};

export default WalletHeader;
