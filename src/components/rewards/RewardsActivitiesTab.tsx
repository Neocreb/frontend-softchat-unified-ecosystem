import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import {
  BarChart3,
  TrendingUp,
  Search,
  Filter,
  Calendar,
  DollarSign,
  Activity,
  ArrowUpRight,
  ArrowDownRight,
  Zap
} from "lucide-react";
import { formatCurrency, formatNumber } from "@/utils/formatters";

interface ActivityItem {
  id: string;
  type: string;
  description: string;
  amount: number;
  timestamp: string;
  category: string;
  status: 'completed' | 'pending' | 'failed';
}

interface RewardsActivitiesTabProps {
  earningsByType: {
    contentCreation: number;
    engagement: number;
    marketplace: number;
    freelance: number;
    p2pTrading: number;
    referrals: number;
    challenges: number;
  };
  recentActivity: Array<{
    id: string;
    type: string;
    description: string;
    amount: number;
    timestamp: string;
  }>;
}

const RewardsActivitiesTab = ({ earningsByType, recentActivity }: RewardsActivitiesTabProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [dateRange, setDateRange] = useState("7days");

  // Enhanced activity data with more details
  const enhancedActivities: ActivityItem[] = [
    { id: "1", type: "post_creation", description: "Quality post with media", amount: 15.5, timestamp: "2024-01-20T10:00:00Z", category: "Content Creation", status: "completed" },
    { id: "2", type: "marketplace_sale", description: "Product sold - Premium Template", amount: 25.0, timestamp: "2024-01-20T09:30:00Z", category: "Marketplace", status: "completed" },
    { id: "3", type: "referral_bonus", description: "New referral signup", amount: 50.0, timestamp: "2024-01-19T18:15:00Z", category: "Referrals", status: "completed" },
    { id: "4", type: "engagement", description: "Video reached 1K views", amount: 8.75, timestamp: "2024-01-19T16:30:00Z", category: "Engagement", status: "completed" },
    { id: "5", type: "freelance_payment", description: "Project completion bonus", amount: 125.0, timestamp: "2024-01-19T14:20:00Z", category: "Freelance", status: "completed" },
    { id: "6", type: "challenge_complete", description: "Daily streak challenge", amount: 12.5, timestamp: "2024-01-19T12:10:00Z", category: "Challenges", status: "completed" },
    { id: "7", type: "crypto_trading", description: "P2P trading commission", amount: 3.25, timestamp: "2024-01-18T20:45:00Z", category: "P2P Trading", status: "completed" },
    { id: "8", type: "quality_bonus", description: "High engagement rate bonus", amount: 20.0, timestamp: "2024-01-18T15:30:00Z", category: "Content Creation", status: "completed" },
  ];

  const activityTypes = [
    { value: "all", label: "All Activities" },
    { value: "content_creation", label: "Content Creation" },
    { value: "engagement", label: "Engagement" },
    { value: "marketplace", label: "Marketplace" },
    { value: "freelance", label: "Freelance" },
    { value: "referrals", label: "Referrals" },
    { value: "challenges", label: "Challenges" },
    { value: "p2p_trading", label: "P2P Trading" }
  ];

  const filteredActivities = enhancedActivities.filter(activity => {
    const matchesSearch = activity.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         activity.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === "all" || activity.type.includes(filterType);
    return matchesSearch && matchesType;
  });

  const totalEarnings = Object.values(earningsByType).reduce((sum, value) => sum + value, 0);

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'post_creation':
      case 'quality_bonus':
        return <Zap className="h-4 w-4 text-blue-500" />;
      case 'marketplace_sale':
        return <DollarSign className="h-4 w-4 text-green-500" />;
      case 'referral_bonus':
        return <ArrowUpRight className="h-4 w-4 text-purple-500" />;
      case 'engagement':
        return <TrendingUp className="h-4 w-4 text-orange-500" />;
      case 'freelance_payment':
        return <BarChart3 className="h-4 w-4 text-indigo-500" />;
      case 'challenge_complete':
        return <Activity className="h-4 w-4 text-red-500" />;
      default:
        return <ArrowDownRight className="h-4 w-4 text-gray-500" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Analytics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Earnings</p>
                <p className="text-2xl font-bold">{formatCurrency(totalEarnings)}</p>
              </div>
              <DollarSign className="h-8 w-8 text-green-500" />
            </div>
            <p className="text-xs text-muted-foreground mt-2">+12.3% from last month</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Top Category</p>
                <p className="text-2xl font-bold">Content</p>
              </div>
              <Zap className="h-8 w-8 text-blue-500" />
            </div>
            <p className="text-xs text-muted-foreground mt-2">{formatCurrency(earningsByType.contentCreation)}</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Activities</p>
                <p className="text-2xl font-bold">{enhancedActivities.length}</p>
              </div>
              <Activity className="h-8 w-8 text-purple-500" />
            </div>
            <p className="text-xs text-muted-foreground mt-2">Last 7 days</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Avg per Activity</p>
                <p className="text-2xl font-bold">{formatCurrency(totalEarnings / enhancedActivities.length)}</p>
              </div>
              <TrendingUp className="h-8 w-8 text-orange-500" />
            </div>
            <p className="text-xs text-muted-foreground mt-2">+5.7% improvement</p>
          </CardContent>
        </Card>
      </div>

      {/* Earnings Breakdown Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Earnings Breakdown by Category
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {Object.entries(earningsByType).map(([category, amount]) => {
              const percentage = totalEarnings > 0 ? (amount / totalEarnings) * 100 : 0;
              const categoryLabels: { [key: string]: string } = {
                contentCreation: "Content Creation",
                engagement: "Engagement",
                marketplace: "Marketplace",
                freelance: "Freelance",
                p2pTrading: "P2P Trading",
                referrals: "Referrals",
                challenges: "Challenges"
              };

              return (
                <div key={category} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">{categoryLabels[category] || category}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-muted-foreground">{percentage.toFixed(1)}%</span>
                      <span className="font-semibold">{formatCurrency(amount)}</span>
                    </div>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Filters and Search */}
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              Activity History
            </CardTitle>
            <div className="flex flex-col sm:flex-row gap-2">
              <div className="relative">
                <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <Input
                  placeholder="Search activities..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-full sm:w-64"
                />
              </div>
              <Select value={filterType} onValueChange={setFilterType}>
                <SelectTrigger className="w-full sm:w-48">
                  <SelectValue placeholder="Filter by type" />
                </SelectTrigger>
                <SelectContent>
                  {activityTypes.map(type => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={dateRange} onValueChange={setDateRange}>
                <SelectTrigger className="w-full sm:w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="7days">7 Days</SelectItem>
                  <SelectItem value="30days">30 Days</SelectItem>
                  <SelectItem value="90days">90 Days</SelectItem>
                  <SelectItem value="all">All Time</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredActivities.length > 0 ? (
              filteredActivities.map((activity) => (
                <div key={activity.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="flex items-center gap-3">
                    {getActivityIcon(activity.type)}
                    <div>
                      <p className="font-medium">{activity.description}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="secondary" className="text-xs">
                          {activity.category}
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          {new Date(activity.timestamp).toLocaleDateString()} at{" "}
                          {new Date(activity.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge 
                      variant={activity.status === 'completed' ? 'default' : activity.status === 'pending' ? 'secondary' : 'destructive'}
                      className="text-xs"
                    >
                      {activity.status}
                    </Badge>
                    <span className="font-semibold text-green-600">
                      +{formatCurrency(activity.amount)}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8">
                <Activity className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No activities found</h3>
                <p className="text-gray-600">Try adjusting your search or filter criteria.</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default RewardsActivitiesTab;
