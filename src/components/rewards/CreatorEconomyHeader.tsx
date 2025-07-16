import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DollarSign,
  TrendingUp,
  Users,
  Zap,
  BarChart3,
  History,
  Handshake,
  ArrowUpDown,
} from "lucide-react";

interface CreatorEconomyHeaderProps {
  activeTab: string;
  setActiveTab: (value: string) => void;
}

const CreatorEconomyHeader = ({
  activeTab,
  setActiveTab,
}: CreatorEconomyHeaderProps) => {
  const tabs = [
    { id: "overview", label: "Overview", icon: BarChart3 },
    { id: "content", label: "Content", icon: TrendingUp },
    { id: "boosts", label: "Boosts", icon: Zap },
    { id: "subscribers", label: "Subscribers", icon: Users },
    { id: "withdraw", label: "Withdraw", icon: ArrowUpDown },
    { id: "history", label: "History", icon: History },
    { id: "partnerships", label: "Partnerships", icon: Handshake },
  ];

  return (
    <div className="mb-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">Creator Economy</h1>
              <p className="text-muted-foreground">
                Monetize your content and grow your audience
              </p>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Badge
            variant="outline"
            className="bg-purple-50 text-purple-700 border-purple-200"
          >
            Creator Program
          </Badge>
          <Badge
            variant="outline"
            className="bg-green-50 text-green-700 border-green-200"
          >
            Active
          </Badge>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex flex-wrap gap-2">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <Button
              key={tab.id}
              variant={activeTab === tab.id ? "default" : "outline"}
              size="sm"
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 ${
                activeTab === tab.id
                  ? "bg-purple-600 hover:bg-purple-700"
                  : "hover:bg-purple-50"
              }`}
            >
              <Icon className="w-4 h-4" />
              <span className="hidden sm:inline">{tab.label}</span>
            </Button>
          );
        })}
      </div>
    </div>
  );
};

export default CreatorEconomyHeader;
