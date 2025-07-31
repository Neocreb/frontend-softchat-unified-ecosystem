import React, { useState } from "react";
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  Users,
  Eye,
  Heart,
  MessageCircle,
  Share2,
  DollarSign,
  Calendar,
  Clock,
  Target,
  Award,
  Zap,
  Globe,
  Download,
  Filter,
  RefreshCw,
  Settings,
  PieChart,
  LineChart,
  Activity,
  Smartphone,
  Monitor,
  MapPin,
  Play,
  Pause,
  SkipForward,
  UserPlus,
  UserMinus,
  Coins,
  CreditCard,
  Gift,
  Handshake,
  Video,
  Music,
  Hash,
  Star,
  ThumbsUp,
  Bookmark,
  FileText,
  ExternalLink,
  Sparkles,
  Brain,
  Gauge,
  ArrowUpRight,
  ArrowDownRight,
  Wifi,
  WifiOff,
  Bell,
  AlertCircle,
  CheckCircle,
  XCircle,
  Timer,
  Radio,
  Repeat,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";

interface AnalyticsData {
  views: {
    total: number;
    change: number;
    chartData: { date: string; value: number }[];
    realTime: number;
    peakHour: string;
  };
  engagement: {
    likes: number;
    comments: number;
    shares: number;
    saves: number;
    avgWatchTime: number;
    completionRate: number;
    engagementRate: number;
    clickThroughRate: number;
    retentionRate: number;
  };
  audience: {
    followers: number;
    newFollowers: number;
    unfollowers: number;
    demographics: {
      age: { range: string; percentage: number }[];
      gender: { type: string; percentage: number }[];
      location: { country: string; percentage: number }[];
    };
    deviceStats: {
      mobile: number;
      desktop: number;
      tablet: number;
    };
    trafficSources: {
      source: string;
      percentage: number;
      growth: number;
    }[];
  };
  monetization: {
    totalEarnings: number;
    tips: number;
    subscriptions: number;
    brandDeals: number;
    monthlyRevenue: { month: string; amount: number }[];
    predictedRevenue: number;
    conversionRate: number;
    avgRevenuePerUser: number;
  };
  topVideos: {
    id: string;
    title: string;
    views: number;
    engagement: number;
    thumbnail: string;
    viralScore: number;
    trendingPotential: number;
  }[];
  realTimeMetrics: {
    liveViewers: number;
    activeVideos: number;
    recentInteractions: number;
    currentTrends: string[];
  };
  aiInsights: {
    contentSuggestions: string[];
    bestPostingTimes: string[];
    audienceGrowthPrediction: number;
    viralPotentialScore: number;
  };
}

interface BrandPartnership {
  id: string;
  brand: string;
  logo: string;
  status: "pending" | "active" | "completed";
  campaign: string;
  value: number;
  deadline: string;
  requirements: string[];
}

const mockAnalyticsData: AnalyticsData = {
  views: {
    total: 2847291,
    change: 23.5,
    realTime: 1247,
    peakHour: "8:00 PM",
    chartData: [
      { date: "2024-01-01", value: 45000 },
      { date: "2024-01-02", value: 52000 },
      { date: "2024-01-03", value: 48000 },
      { date: "2024-01-04", value: 61000 },
      { date: "2024-01-05", value: 55000 },
      { date: "2024-01-06", value: 67000 },
      { date: "2024-01-07", value: 72000 },
    ],
  },
  engagement: {
    likes: 156789,
    comments: 23456,
    shares: 12890,
    saves: 8934,
    avgWatchTime: 32.4,
    completionRate: 68.7,
    engagementRate: 12.4,
    clickThroughRate: 3.2,
    retentionRate: 72.1,
  },
  audience: {
    followers: 89456,
    newFollowers: 1247,
    unfollowers: 98,
    demographics: {
      age: [
        { range: "18-24", percentage: 32 },
        { range: "25-34", percentage: 28 },
        { range: "35-44", percentage: 23 },
        { range: "45-54", percentage: 12 },
        { range: "55+", percentage: 5 },
      ],
      gender: [
        { type: "Female", percentage: 54 },
        { type: "Male", percentage: 44 },
        { type: "Other", percentage: 2 },
      ],
      location: [
        { country: "United States", percentage: 35 },
        { country: "United Kingdom", percentage: 18 },
        { country: "Canada", percentage: 12 },
        { country: "Australia", percentage: 8 },
        { country: "Germany", percentage: 7 },
      ],
    },
    deviceStats: {
      mobile: 78,
      desktop: 18,
      tablet: 4,
    },
    trafficSources: [
      { source: "For You Page", percentage: 45, growth: 12 },
      { source: "Search", percentage: 22, growth: -3 },
      { source: "Direct", percentage: 18, growth: 8 },
      { source: "External", percentage: 15, growth: 25 },
    ],
  },
  monetization: {
    totalEarnings: 12540,
    tips: 3240,
    subscriptions: 5670,
    brandDeals: 3630,
    monthlyRevenue: [
      { month: "Sep", amount: 8900 },
      { month: "Oct", amount: 10200 },
      { month: "Nov", amount: 11800 },
      { month: "Dec", amount: 12540 },
    ],
  },
  topVideos: [
    {
      id: "1",
      title: "Amazing Tech Tutorial",
      views: 456789,
      engagement: 89.2,
      thumbnail: "https://images.unsplash.com/photo-1518709268805-4e9042af2176",
    },
    {
      id: "2",
      title: "Cooking Masterclass",
      views: 234567,
      engagement: 76.8,
      thumbnail: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136",
    },
    {
      id: "3",
      title: "Travel Vlog Adventure",
      views: 189234,
      engagement: 82.4,
      thumbnail: "https://images.unsplash.com/photo-1488646953014-85cb44e25828",
    },
  ],
};

const brandPartnerships: BrandPartnership[] = [
  {
    id: "1",
    brand: "TechGadgets Co",
    logo: "https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=100",
    status: "active",
    campaign: "Smartphone Review Series",
    value: 2500,
    deadline: "2024-02-15",
    requirements: ["3 videos", "Instagram posts", "Story highlights"],
  },
  {
    id: "2",
    brand: "FashionForward",
    logo: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=100",
    status: "pending",
    campaign: "Summer Collection 2024",
    value: 1800,
    deadline: "2024-02-28",
    requirements: ["2 videos", "Try-on haul", "Styling tips"],
  },
  {
    id: "3",
    brand: "FitLife Nutrition",
    logo: "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=100",
    status: "completed",
    campaign: "Protein Powder Review",
    value: 1200,
    deadline: "2024-01-15",
    requirements: ["1 video", "Before/after posts"],
  },
];

interface CreatorDashboardProps {
  isOwnProfile?: boolean;
  userId?: string;
}

const CreatorDashboard: React.FC<CreatorDashboardProps> = ({
  isOwnProfile = true,
  userId,
}) => {
  const [timeRange, setTimeRange] = useState("30d");
  const [activeTab, setActiveTab] = useState("overview");
  const [isRealTimeEnabled, setIsRealTimeEnabled] = useState(true);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [refreshInterval, setRefreshInterval] = useState(30);
  const [showNotifications, setShowNotifications] = useState(true);
  const [selectedMetrics, setSelectedMetrics] = useState(['views', 'engagement', 'followers']);
  const [isLoading, setIsLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [connectionStatus, setConnectionStatus] = useState<'connected' | 'disconnected' | 'connecting'>('connected');

  const formatNumber = (num: number): string => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + "M";
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + "K";
    }
    return num.toString();
  };

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const getChangeIndicator = (change: number) => {
    const isPositive = change > 0;
    return (
      <div
        className={cn(
          "flex items-center gap-1 text-sm",
          isPositive ? "text-green-400" : "text-red-400",
        )}
      >
        {isPositive ? (
          <TrendingUp className="w-3 h-3" />
        ) : (
          <TrendingDown className="w-3 h-3" />
        )}
        <span>{Math.abs(change)}%</span>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Creator Dashboard</h1>
          <p className="text-gray-400">
            Track your content performance and earnings
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-32 bg-gray-800 border-gray-700 text-white">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="90d">Last 3 months</SelectItem>
              <SelectItem value="1y">Last year</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="ghost" size="icon" className="text-white">
            <RefreshCw className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="icon" className="text-white">
            <Settings className="w-4 h-4" />
          </Button>
        </div>
      </div>

      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="space-y-6"
      >
        <TabsList className="bg-gray-800 w-full sm:w-auto">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="monetization">Monetization</TabsTrigger>
          <TabsTrigger value="partnerships">Partnerships</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Key Metrics */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="bg-gray-900 border-gray-700">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-sm">Total Views</p>
                    <p className="text-2xl font-bold text-white">
                      {formatNumber(mockAnalyticsData.views.total)}
                    </p>
                  </div>
                  <div className="text-right">
                    <Eye className="w-6 h-6 text-blue-400 mb-2" />
                    {getChangeIndicator(mockAnalyticsData.views.change)}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gray-900 border-gray-700">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-sm">Followers</p>
                    <p className="text-2xl font-bold text-white">
                      {formatNumber(mockAnalyticsData.audience.followers)}
                    </p>
                  </div>
                  <div className="text-right">
                    <Users className="w-6 h-6 text-green-400 mb-2" />
                    <div className="flex items-center gap-1 text-sm text-green-400">
                      <UserPlus className="w-3 h-3" />
                      <span>
                        +{formatNumber(mockAnalyticsData.audience.newFollowers)}
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gray-900 border-gray-700">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-sm">Engagement</p>
                    <p className="text-2xl font-bold text-white">
                      {formatNumber(mockAnalyticsData.engagement.likes)}
                    </p>
                  </div>
                  <div className="text-right">
                    <Heart className="w-6 h-6 text-red-400 mb-2" />
                    <div className="text-sm text-gray-400">likes</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gray-900 border-gray-700">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-sm">Total Earnings</p>
                    <p className="text-2xl font-bold text-white">
                      {formatCurrency(
                        mockAnalyticsData.monetization.totalEarnings,
                      )}
                    </p>
                  </div>
                  <div className="text-right">
                    <DollarSign className="w-6 h-6 text-yellow-400 mb-2" />
                    <div className="text-sm text-green-400">this month</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Top Videos */}
          <Card className="bg-gray-900 border-gray-700">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white">
                <Video className="w-5 h-5" />
                Top Performing Videos
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockAnalyticsData.topVideos.map((video, index) => (
                  <div
                    key={video.id}
                    className="flex items-center gap-4 p-3 bg-gray-800 rounded-lg"
                  >
                    <div className="text-sm font-medium text-gray-400 w-6">
                      #{index + 1}
                    </div>
                    <img
                      src={video.thumbnail}
                      alt={video.title}
                      className="w-16 h-10 rounded object-cover"
                    />
                    <div className="flex-1">
                      <h4 className="font-medium text-white text-sm">
                        {video.title}
                      </h4>
                      <div className="flex items-center gap-4 text-xs text-gray-400 mt-1">
                        <span className="flex items-center gap-1">
                          <Eye className="w-3 h-3" />
                          {formatNumber(video.views)}
                        </span>
                        <span className="flex items-center gap-1">
                          <Activity className="w-3 h-3" />
                          {video.engagement}% engagement
                        </span>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm" className="text-gray-400">
                      <ExternalLink className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          {/* Audience Demographics */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="bg-gray-900 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">Age Demographics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {mockAnalyticsData.audience.demographics.age.map((age) => (
                    <div
                      key={age.range}
                      className="flex items-center justify-between"
                    >
                      <span className="text-gray-400 text-sm">{age.range}</span>
                      <div className="flex items-center gap-2 flex-1 mx-3">
                        <Progress value={age.percentage} className="flex-1" />
                        <span className="text-white text-sm w-8">
                          {age.percentage}%
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gray-900 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">Top Locations</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {mockAnalyticsData.audience.demographics.location.map(
                    (location) => (
                      <div
                        key={location.country}
                        className="flex items-center justify-between"
                      >
                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4 text-gray-400" />
                          <span className="text-gray-400 text-sm">
                            {location.country}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Progress
                            value={location.percentage}
                            className="w-20"
                          />
                          <span className="text-white text-sm w-8">
                            {location.percentage}%
                          </span>
                        </div>
                      </div>
                    ),
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Engagement Metrics */}
          <Card className="bg-gray-900 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">Engagement Breakdown</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="text-center p-4 bg-gray-800 rounded-lg">
                  <Heart className="w-8 h-8 text-red-400 mx-auto mb-2" />
                  <div className="text-xl font-bold text-white">
                    {formatNumber(mockAnalyticsData.engagement.likes)}
                  </div>
                  <div className="text-sm text-gray-400">Likes</div>
                </div>
                <div className="text-center p-4 bg-gray-800 rounded-lg">
                  <MessageCircle className="w-8 h-8 text-blue-400 mx-auto mb-2" />
                  <div className="text-xl font-bold text-white">
                    {formatNumber(mockAnalyticsData.engagement.comments)}
                  </div>
                  <div className="text-sm text-gray-400">Comments</div>
                </div>
                <div className="text-center p-4 bg-gray-800 rounded-lg">
                  <Share2 className="w-8 h-8 text-green-400 mx-auto mb-2" />
                  <div className="text-xl font-bold text-white">
                    {formatNumber(mockAnalyticsData.engagement.shares)}
                  </div>
                  <div className="text-sm text-gray-400">Shares</div>
                </div>
                <div className="text-center p-4 bg-gray-800 rounded-lg">
                  <Bookmark className="w-8 h-8 text-yellow-400 mx-auto mb-2" />
                  <div className="text-xl font-bold text-white">
                    {formatNumber(mockAnalyticsData.engagement.saves)}
                  </div>
                  <div className="text-sm text-gray-400">Saves</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Watch Time Analytics */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="bg-gray-900 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">Average Watch Time</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center">
                  <div className="text-3xl font-bold text-white mb-2">
                    {mockAnalyticsData.engagement.avgWatchTime}s
                  </div>
                  <div className="text-gray-400">per video</div>
                  <div className="mt-4 p-4 bg-gray-800 rounded-lg">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-400">Completion Rate</span>
                      <span className="text-white">
                        {mockAnalyticsData.engagement.completionRate}%
                      </span>
                    </div>
                    <Progress
                      value={mockAnalyticsData.engagement.completionRate}
                      className="mt-2"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gray-900 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">Device Types</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-gray-800 rounded-lg">
                    <div className="flex items-center gap-3">
                      <Smartphone className="w-5 h-5 text-blue-400" />
                      <span className="text-white">Mobile</span>
                    </div>
                    <div className="text-right">
                      <div className="text-white font-medium">73%</div>
                      <div className="text-gray-400 text-sm">primary</div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-800 rounded-lg">
                    <div className="flex items-center gap-3">
                      <Monitor className="w-5 h-5 text-green-400" />
                      <span className="text-white">Desktop</span>
                    </div>
                    <div className="text-right">
                      <div className="text-white font-medium">27%</div>
                      <div className="text-gray-400 text-sm">secondary</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="monetization" className="space-y-6">
          {/* Revenue Breakdown */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="bg-gray-900 border-gray-700">
              <CardContent className="p-4 text-center">
                <Gift className="w-8 h-8 text-pink-400 mx-auto mb-2" />
                <div className="text-xl font-bold text-white">
                  {formatCurrency(mockAnalyticsData.monetization.tips)}
                </div>
                <div className="text-sm text-gray-400">Tips & Donations</div>
              </CardContent>
            </Card>

            <Card className="bg-gray-900 border-gray-700">
              <CardContent className="p-4 text-center">
                <CreditCard className="w-8 h-8 text-blue-400 mx-auto mb-2" />
                <div className="text-xl font-bold text-white">
                  {formatCurrency(mockAnalyticsData.monetization.subscriptions)}
                </div>
                <div className="text-sm text-gray-400">Subscriptions</div>
              </CardContent>
            </Card>

            <Card className="bg-gray-900 border-gray-700">
              <CardContent className="p-4 text-center">
                <Handshake className="w-8 h-8 text-green-400 mx-auto mb-2" />
                <div className="text-xl font-bold text-white">
                  {formatCurrency(mockAnalyticsData.monetization.brandDeals)}
                </div>
                <div className="text-sm text-gray-400">Brand Deals</div>
              </CardContent>
            </Card>

            <Card className="bg-gray-900 border-gray-700">
              <CardContent className="p-4 text-center">
                <Coins className="w-8 h-8 text-yellow-400 mx-auto mb-2" />
                <div className="text-xl font-bold text-white">
                  {formatCurrency(mockAnalyticsData.monetization.totalEarnings)}
                </div>
                <div className="text-sm text-gray-400">Total Earnings</div>
              </CardContent>
            </Card>
          </div>

          {/* Revenue Chart */}
          <Card className="bg-gray-900 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">Monthly Revenue</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64 flex items-end justify-between gap-2">
                {mockAnalyticsData.monetization.monthlyRevenue.map(
                  (month, index) => (
                    <div
                      key={month.month}
                      className="flex-1 flex flex-col items-center"
                    >
                      <div
                        className="w-full bg-gradient-to-t from-green-500 to-green-400 rounded-t"
                        style={{
                          height: `${(month.amount / 15000) * 100}%`,
                          minHeight: "20px",
                        }}
                      />
                      <div className="text-xs text-gray-400 mt-2">
                        {month.month}
                      </div>
                      <div className="text-xs text-white font-medium">
                        {formatCurrency(month.amount)}
                      </div>
                    </div>
                  ),
                )}
              </div>
            </CardContent>
          </Card>

          {/* Monetization Tools */}
          <Card className="bg-gray-900 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">Monetization Tools</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Button
                  variant="ghost"
                  className="h-auto p-4 justify-start border border-gray-700"
                >
                  <div className="flex items-center gap-3">
                    <Gift className="w-6 h-6 text-pink-400" />
                    <div className="text-left">
                      <div className="font-medium text-white">Enable Tips</div>
                      <div className="text-sm text-gray-400">
                        Let fans support you directly
                      </div>
                    </div>
                  </div>
                </Button>

                <Button
                  variant="ghost"
                  className="h-auto p-4 justify-start border border-gray-700"
                >
                  <div className="flex items-center gap-3">
                    <Star className="w-6 h-6 text-yellow-400" />
                    <div className="text-left">
                      <div className="font-medium text-white">
                        Premium Content
                      </div>
                      <div className="text-sm text-gray-400">
                        Offer exclusive content
                      </div>
                    </div>
                  </div>
                </Button>

                <Button
                  variant="ghost"
                  className="h-auto p-4 justify-start border border-gray-700"
                >
                  <div className="flex items-center gap-3">
                    <Handshake className="w-6 h-6 text-green-400" />
                    <div className="text-left">
                      <div className="font-medium text-white">
                        Brand Partnerships
                      </div>
                      <div className="text-sm text-gray-400">
                        Connect with brands
                      </div>
                    </div>
                  </div>
                </Button>

                <Button
                  variant="ghost"
                  className="h-auto p-4 justify-start border border-gray-700"
                >
                  <div className="flex items-center gap-3">
                    <FileText className="w-6 h-6 text-blue-400" />
                    <div className="text-left">
                      <div className="font-medium text-white">Merchandise</div>
                      <div className="text-sm text-gray-400">
                        Sell your own products
                      </div>
                    </div>
                  </div>
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="partnerships" className="space-y-6">
          {/* Active Partnerships */}
          <Card className="bg-gray-900 border-gray-700">
            <CardHeader>
              <CardTitle className="flex items-center justify-between text-white">
                <span>Brand Partnerships</span>
                <Button
                  variant="outline"
                  size="sm"
                  className="border-gray-600 text-white"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  New Partnership
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {brandPartnerships.map((partnership) => (
                  <div
                    key={partnership.id}
                    className="p-4 bg-gray-800 rounded-lg"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <img
                          src={partnership.logo}
                          alt={partnership.brand}
                          className="w-12 h-12 rounded object-cover"
                        />
                        <div>
                          <h4 className="font-medium text-white">
                            {partnership.brand}
                          </h4>
                          <p className="text-sm text-gray-400">
                            {partnership.campaign}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <Badge
                          variant="secondary"
                          className={cn(
                            "mb-2",
                            partnership.status === "active" &&
                              "bg-green-500/20 text-green-400",
                            partnership.status === "pending" &&
                              "bg-yellow-500/20 text-yellow-400",
                            partnership.status === "completed" &&
                              "bg-blue-500/20 text-blue-400",
                          )}
                        >
                          {partnership.status}
                        </Badge>
                        <div className="text-lg font-bold text-white">
                          {formatCurrency(partnership.value)}
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-gray-400">Deadline: </span>
                        <span className="text-white">
                          {partnership.deadline}
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-400">Requirements:</span>
                        <ul className="text-white mt-1">
                          {partnership.requirements.map((req, index) => (
                            <li key={index} className="flex items-center gap-2">
                              <div className="w-1 h-1 bg-gray-400 rounded-full" />
                              {req}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    <div className="flex gap-2 mt-4">
                      <Button
                        variant="outline"
                        size="sm"
                        className="border-gray-600 text-white"
                      >
                        View Details
                      </Button>
                      {partnership.status === "pending" && (
                        <>
                          <Button
                            size="sm"
                            className="bg-green-600 hover:bg-green-700"
                          >
                            Accept
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="border-red-600 text-red-400"
                          >
                            Decline
                          </Button>
                        </>
                      )}
                      {partnership.status === "active" && (
                        <Button
                          size="sm"
                          className="bg-blue-600 hover:bg-blue-700"
                        >
                          Submit Content
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Partnership Opportunities */}
          <Card className="bg-gray-900 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">
                Partnership Opportunities
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <Handshake className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-white mb-2">
                  Grow Your Creator Business
                </h3>
                <p className="text-gray-400 mb-4">
                  Connect with brands that align with your content and audience
                </p>
                <Button className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600">
                  Explore Opportunities
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CreatorDashboard;
