
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Building, TrendingUp, Users, Award, CreditCard, History } from "lucide-react";

interface WalletHeaderProps {
  activeTab: string;
  setActiveTab: (value: string) => void;
}

const WalletHeader = ({ activeTab, setActiveTab }: WalletHeaderProps) => {
  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
      <div>
        <h1 className="text-2xl font-bold">Financial Hub</h1>
        <p className="text-muted-foreground">Manage your portfolio, trading, rewards, and banking</p>
      </div>
      <div className="mt-4 md:mt-0 w-full md:w-auto">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <div className="overflow-x-auto">
            <TabsList className="grid grid-cols-6 w-full min-w-[600px]">
              <TabsTrigger value="portfolio" className="flex items-center gap-1 text-xs md:text-sm">
                <CreditCard className="h-3 w-3 md:h-4 md:w-4" />
                Portfolio
              </TabsTrigger>
              <TabsTrigger value="trading" className="flex items-center gap-1 text-xs md:text-sm">
                <TrendingUp className="h-3 w-3 md:h-4 md:w-4" />
                Trading
              </TabsTrigger>
              <TabsTrigger value="p2p" className="flex items-center gap-1 text-xs md:text-sm">
                <Users className="h-3 w-3 md:h-4 md:w-4" />
                P2P
              </TabsTrigger>
              <TabsTrigger value="rewards" className="flex items-center gap-1 text-xs md:text-sm">
                <Award className="h-3 w-3 md:h-4 md:w-4" />
                Rewards
              </TabsTrigger>
              <TabsTrigger value="bank" className="flex items-center gap-1 text-xs md:text-sm">
                <Building className="h-3 w-3 md:h-4 md:w-4" />
                Bank
              </TabsTrigger>
              <TabsTrigger value="transactions" className="flex items-center gap-1 text-xs md:text-sm">
                <History className="h-3 w-3 md:h-4 md:w-4" />
                History
              </TabsTrigger>
            </TabsList>
          </div>
        </Tabs>
      </div>
    </div>
  );
};

export default WalletHeader;
