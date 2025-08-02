import React, { useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import {
  // Analytics & Charts
  BarChart3,
  PieChart,
  TrendingUp,
  TrendingDown,
  Activity,
  Eye,
  Target,
  Zap,
  
  // Platform Features
  House,
  Search,
  Video,
  ShoppingBag,
  Briefcase,
  Coins,
  Gift,
  Calendar,
  MessageSquare,
  Users,
  Building,
  Radio,
  Megaphone,
  Award,
  Star,
  
  // Actions
  Download,
  RefreshCw,
  Filter,
  Settings,
  Plus,
  ExternalLink,
  MoreHorizontal,
  Bell,
  Heart,
  Share2,
  Play,
  
  // UI Elements
  ChevronRight,
  ChevronDown,
  ArrowUpRight,
  ArrowDownRight,
  Layers,
  Grid3X3,
  List,
  
  // Money & Revenue
  DollarSign,
  CreditCard,
  Wallet,
  HandCoins,
  
  // Content & Media
  FileText,
  Image,
  Film,
  Mic,
  Camera,
  
  // Social
  ThumbsUp,
  MessageCircle,
  UserPlus,
  Crown,
  
  // Time & Date
  Clock,
  Calendar as CalendarIcon,
  Timer,
  
  // Status & Growth
  CheckCircle,
  XCircle,
  AlertCircle,
  Info,
  
  // Navigation
  Menu,
  X,
  ChevronLeft,
  Home,
} from "lucide-react";

interface MetricCard {
  title: string;
  value: string | number;
  change: number;
  trend: "up" | "down" | "neutral";
  icon: React.ElementType;
  color: string;
  description?: string;
}

interface FeatureAnalytics {
  name: string;
  icon: React.ElementType;
  color: string;
  metrics: MetricCard[];
  growth: number;
  active: boolean;
}

const EnhancedCreatorDashboard: React.FC = () => {
  const [timeRange, setTimeRange] = useState("30d");
  const [activeSection, setActiveSection] = useState("overview");
  const [selectedFeature, setSelectedFeature] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  // Mock data for comprehensive analytics
  const platformFeatures: FeatureAnalytics[] = [
    {
      name: "Feed & Social",
      icon: House,
      color: "bg-blue-500",
      growth: 23.5,
      active: true,
      metrics: [
        { title: "Total Posts", value: "1,247", change: 18.2, trend: "up", icon: FileText, color: "text-blue-600" },
        { title: "Engagement Rate", value: "8.4%", change: 12.3, trend: "up", icon: Heart, color: "text-pink-600" },
        { title: "Followers", value: "45.2K", change: 15.7, trend: "up", icon: Users, color: "text-green-600" },
        { title: "Reach", value: "892K", change: 28.1, trend: "up", icon: Eye, color: "text-purple-600" },
      ]
    },
    {
      name: "Video Content",
      icon: Video,
      color: "bg-red-500",
      growth: 31.8,
      active: true,
      metrics: [
        { title: "Videos Created", value: "156", change: 22.4, trend: "up", icon: Film, color: "text-red-600" },
        { title: "Total Views", value: "2.1M", change: 35.2, trend: "up", icon: Play, color: "text-blue-600" },
        { title: "Watch Time", value: "45.2h", change: 18.9, trend: "up", icon: Clock, color: "text-green-600" },
        { title: "Avg Duration", value: "3:24", change: 8.1, trend: "up", icon: Timer, color: "text-orange-600" },
      ]
    },
    {
      name: "Marketplace",
      icon: ShoppingBag,
      color: "bg-green-500",
      growth: 45.2,
      active: true,
      metrics: [
        { title: "Products Sold", value: "389", change: 52.1, trend: "up", icon: ShoppingBag, color: "text-green-600" },
        { title: "Revenue", value: "$12,450", change: 38.7, trend: "up", icon: DollarSign, color: "text-emerald-600" },
        { title: "Conversion Rate", value: "3.2%", change: 15.4, trend: "up", icon: Target, color: "text-blue-600" },
        { title: "Avg Order Value", value: "$32", change: 8.9, trend: "up", icon: CreditCard, color: "text-purple-600" },
      ]
    },
    {
      name: "Freelance",
      icon: Briefcase,
      color: "bg-orange-500",
      growth: 28.9,
      active: true,
      metrics: [
        { title: "Projects Completed", value: "47", change: 31.2, trend: "up", icon: CheckCircle, color: "text-green-600" },
        { title: "Client Rating", value: "4.9", change: 2.1, trend: "up", icon: Star, color: "text-yellow-600" },
        { title: "Earnings", value: "$8,920", change: 25.3, trend: "up", icon: Wallet, color: "text-green-600" },
        { title: "Response Time", value: "2.1h", change: -12.4, trend: "down", icon: Clock, color: "text-blue-600" },
      ]
    },
    {
      name: "Crypto Trading",
      icon: Coins,
      color: "bg-yellow-500",
      growth: 18.7,
      active: true,
      metrics: [
        { title: "Portfolio Value", value: "$24,567", change: 22.8, trend: "up", icon: TrendingUp, color: "text-green-600" },
        { title: "Trading Volume", value: "$156K", change: 45.1, trend: "up", icon: BarChart3, color: "text-blue-600" },
        { title: "Win Rate", value: "72%", change: 8.3, trend: "up", icon: Target, color: "text-emerald-600" },
        { title: "P&L Today", value: "+$342", change: 0, trend: "up", icon: HandCoins, color: "text-green-600" },
      ]
    },
    {
      name: "Messages & Chat",
      icon: MessageSquare,
      color: "bg-purple-500",
      growth: 19.4,
      active: true,
      metrics: [
        { title: "Messages Sent", value: "2,341", change: 15.6, trend: "up", icon: MessageCircle, color: "text-blue-600" },
        { title: "Active Chats", value: "89", change: 12.8, trend: "up", icon: Users, color: "text-green-600" },
        { title: "Response Rate", value: "94%", change: 3.2, trend: "up", icon: CheckCircle, color: "text-emerald-600" },
        { title: "Avg Response", value: "5min", change: -8.1, trend: "down", icon: Timer, color: "text-orange-600" },
      ]
    },
    {
      name: "Live Streaming",
      icon: Radio,
      color: "bg-pink-500",
      growth: 67.3,
      active: true,
      metrics: [
        { title: "Live Sessions", value: "23", change: 83.2, trend: "up", icon: Radio, color: "text-pink-600" },
        { title: "Peak Viewers", value: "1,247", change: 45.7, trend: "up", icon: Eye, color: "text-blue-600" },
        { title: "Stream Time", value: "34.2h", change: 28.9, trend: "up", icon: Clock, color: "text-green-600" },
        { title: "Super Chats", value: "$445", change: 92.1, trend: "up", icon: Gift, color: "text-yellow-600" },
      ]
    },
    {
      name: "Events & Calendar",
      icon: Calendar,
      color: "bg-indigo-500",
      growth: 34.6,
      active: true,
      metrics: [
        { title: "Events Created", value: "12", change: 50.0, trend: "up", icon: CalendarIcon, color: "text-indigo-600" },
        { title: "Attendees", value: "2,134", change: 42.3, trend: "up", icon: Users, color: "text-blue-600" },
        { title: "Event Revenue", value: "$3,240", change: 67.8, trend: "up", icon: DollarSign, color: "text-green-600" },
        { title: "Avg Rating", value: "4.7", change: 8.7, trend: "up", icon: Star, color: "text-yellow-600" },
      ]
    },
  ];

  const quickActions = [
    { name: "Create Post", icon: Plus, color: "bg-blue-500", href: "/feed" },
    { name: "New Video", icon: Video, color: "bg-red-500", href: "/videos" },
    { name: "List Product", icon: ShoppingBag, color: "bg-green-500", href: "/marketplace" },
    { name: "Find Job", icon: Briefcase, color: "bg-orange-500", href: "/freelance" },
    { name: "Trade Crypto", icon: Coins, color: "bg-yellow-500", href: "/crypto" },
    { name: "Go Live", icon: Radio, color: "bg-pink-500", href: "/live" },
    { name: "Create Event", icon: Calendar, color: "bg-indigo-500", href: "/events" },
    { name: "Start Chat", icon: MessageSquare, color: "bg-purple-500", href: "/chat" },
  ];

  const recentActivities = [
    { type: "video", content: "Your video 'How to Trade Crypto' reached 10K views", time: "2 hours ago", icon: Video, color: "text-red-500" },
    { type: "marketplace", content: "Product 'Digital Art Collection' sold for $89", time: "4 hours ago", icon: ShoppingBag, color: "text-green-500" },
    { type: "freelance", content: "New project proposal received from TechCorp", time: "6 hours ago", icon: Briefcase, color: "text-orange-500" },
    { type: "social", content: "Your post received 500+ likes and 50 comments", time: "8 hours ago", icon: Heart, color: "text-pink-500" },
    { type: "crypto", content: "Portfolio gained $234 from BTC trade", time: "12 hours ago", icon: TrendingUp, color: "text-green-500" },
  ];

  const topPerformingContent = [
    { title: "Crypto Trading Tutorial", type: "Video", views: "45.2K", engagement: "12.4%", revenue: "$234" },
    { title: "Digital Art Masterpiece", type: "Product", views: "23.1K", engagement: "8.7%", revenue: "$450" },
    { title: "Web Development Guide", type: "Post", views: "18.9K", engagement: "15.2%", revenue: "$89" },
    { title: "Live Q&A Session", type: "Stream", views: "12.7K", engagement: "23.1%", revenue: "$156" },
  ];

  const formatNumber = (num: number): string => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + "M";
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + "K";
    }
    return num.toString();
  };

  const formatCurrency = (amount: string | number): string => {
    const numAmount = typeof amount === 'string' ? parseFloat(amount.replace(/[^0-9.-]/g, '')) : amount;
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
    }).format(numAmount);
  };

  const getTrendIcon = (trend: "up" | "down" | "neutral") => {
    switch (trend) {
      case "up":
        return <TrendingUp className="w-3 h-3 text-green-500" />;
      case "down":
        return <TrendingDown className="w-3 h-3 text-red-500" />;
      default:
        return <Activity className="w-3 h-3 text-gray-500" />;
    }
  };

  const filteredFeatures = platformFeatures.filter(feature =>
    feature.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
    (selectedFeatures.length === 0 || selectedFeatures.includes(feature.name))
  );

  const totalRevenue = platformFeatures.reduce((sum, feature) => {
    const revenueMetric = feature.metrics.find(m => m.title.includes("Revenue") || m.title.includes("Earnings"));
    if (revenueMetric && typeof revenueMetric.value === 'string') {
      return sum + parseFloat(revenueMetric.value.replace(/[^0-9.-]/g, ''));
    }
    return sum;
  }, 0);

  const totalGrowth = platformFeatures.reduce((sum, feature) => sum + feature.growth, 0) / platformFeatures.length;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Helmet>
        <title>Unified Creator Studio - Analytics Dashboard | SoftChat</title>
        <meta
          name="description"
          content="Comprehensive analytics dashboard for all platform features - social media, videos, marketplace, freelance, crypto, and more"
        />
      </Helmet>

      {/* Header */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between py-4 gap-4">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center shadow-lg">
                  <BarChart3 className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-xl lg:text-2xl font-bold text-gray-900 dark:text-white">
                    Unified Creator Studio
                  </h1>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Complete analytics across all platform features
                  </p>
                </div>
              </div>
              <Badge variant="secondary" className="bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200">
                Pro Analytics
              </Badge>
            </div>

            <div className="flex items-center gap-3 w-full lg:w-auto">
              <div className="flex-1 lg:flex-none lg:w-64">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    placeholder="Search features..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              
              <Select value={timeRange} onValueChange={setTimeRange}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="7d">Last 7 days</SelectItem>
                  <SelectItem value="30d">Last 30 days</SelectItem>
                  <SelectItem value="90d">Last 3 months</SelectItem>
                  <SelectItem value="1y">Last year</SelectItem>
                </SelectContent>
              </Select>

              <div className="flex items-center gap-1 border rounded-lg p-1">
                <Button
                  variant={viewMode === "grid" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("grid")}
                  className="h-8 w-8 p-0"
                >
                  <Grid3X3 className="w-4 h-4" />
                </Button>
                <Button
                  variant={viewMode === "list" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("list")}
                  className="h-8 w-8 p-0"
                >
                  <List className="w-4 h-4" />
                </Button>
              </div>

              <Button variant="outline" size="sm">
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>

              <Button variant="outline" size="sm">
                <RefreshCw className="w-4 h-4 mr-2" />
                Refresh
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Stats Overview */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="bg-gradient-to-r from-blue-50 to-blue-100 border-blue-200">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-blue-700">Total Revenue</p>
                    <p className="text-2xl font-bold text-blue-900">{formatCurrency(totalRevenue)}</p>
                  </div>
                  <DollarSign className="w-8 h-8 text-blue-600" />
                </div>
                <div className="flex items-center mt-2 text-sm">
                  <TrendingUp className="w-3 h-3 text-green-500 mr-1" />
                  <span className="text-green-600">+{totalGrowth.toFixed(1)}%</span>
                  <span className="text-gray-600 ml-1">vs last period</span>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-r from-green-50 to-green-100 border-green-200">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-green-700">Active Features</p>
                    <p className="text-2xl font-bold text-green-900">{platformFeatures.filter(f => f.active).length}</p>
                  </div>
                  <Zap className="w-8 h-8 text-green-600" />
                </div>
                <div className="flex items-center mt-2 text-sm">
                  <CheckCircle className="w-3 h-3 text-green-500 mr-1" />
                  <span className="text-green-600">All systems operational</span>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-r from-purple-50 to-purple-100 border-purple-200">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-purple-700">Avg Growth</p>
                    <p className="text-2xl font-bold text-purple-900">{totalGrowth.toFixed(1)}%</p>
                  </div>
                  <TrendingUp className="w-8 h-8 text-purple-600" />
                </div>
                <div className="flex items-center mt-2 text-sm">
                  <ArrowUpRight className="w-3 h-3 text-purple-500 mr-1" />
                  <span className="text-purple-600">Across all features</span>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-r from-orange-50 to-orange-100 border-orange-200">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-orange-700">Performance</p>
                    <p className="text-2xl font-bold text-orange-900">Excellent</p>
                  </div>
                  <Target className="w-8 h-8 text-orange-600" />
                </div>
                <div className="flex items-center mt-2 text-sm">
                  <Star className="w-3 h-3 text-orange-500 mr-1" />
                  <span className="text-orange-600">Above benchmarks</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs value={activeSection} onValueChange={setActiveSection} className="space-y-6">
          <div className="w-full overflow-x-auto pb-2">
            <TabsList className="inline-flex h-10 items-center justify-start rounded-md bg-muted p-1 text-muted-foreground min-w-fit">
              <TabsTrigger value="overview" className="flex items-center gap-2 whitespace-nowrap px-3">
                <Eye className="w-4 h-4" />
                <span>Overview</span>
              </TabsTrigger>
              <TabsTrigger value="features" className="flex items-center gap-2 whitespace-nowrap px-3">
                <Layers className="w-4 h-4" />
                <span>Features</span>
              </TabsTrigger>
              <TabsTrigger value="content" className="flex items-center gap-2 whitespace-nowrap px-3">
                <FileText className="w-4 h-4" />
                <span>Content</span>
              </TabsTrigger>
              <TabsTrigger value="revenue" className="flex items-center gap-2 whitespace-nowrap px-3">
                <DollarSign className="w-4 h-4" />
                <span>Revenue</span>
              </TabsTrigger>
              <TabsTrigger value="audience" className="flex items-center gap-2 whitespace-nowrap px-3">
                <Users className="w-4 h-4" />
                <span>Audience</span>
              </TabsTrigger>
              <TabsTrigger value="insights" className="flex items-center gap-2 whitespace-nowrap px-3">
                <BarChart3 className="w-4 h-4" />
                <span>Insights</span>
              </TabsTrigger>
            </TabsList>
          </div>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="w-5 h-5 text-yellow-500" />
                  Quick Actions
                </CardTitle>
                <CardDescription>
                  Jump to any platform feature to create content or manage your presence
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
                  {quickActions.map((action, index) => {
                    const Icon = action.icon;
                    return (
                      <Button
                        key={index}
                        variant="outline"
                        className="h-auto p-4 flex flex-col items-center gap-2 hover:shadow-md transition-all duration-200"
                        onClick={() => window.open(action.href, '_blank')}
                      >
                        <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center", action.color)}>
                          <Icon className="w-4 h-4 text-white" />
                        </div>
                        <span className="text-xs font-medium text-center">{action.name}</span>
                      </Button>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Platform Features Grid */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Platform Analytics</h2>
                <div className="flex items-center gap-2">
                  <Filter className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    {filteredFeatures.length} of {platformFeatures.length} features
                  </span>
                </div>
              </div>

              <div className={cn(
                "grid gap-6",
                viewMode === "grid" ? "grid-cols-1 lg:grid-cols-2" : "grid-cols-1"
              )}>
                {filteredFeatures.map((feature, index) => {
                  const Icon = feature.icon;
                  return (
                    <Card key={index} className="hover:shadow-lg transition-all duration-200 group">
                      <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center", feature.color)}>
                              <Icon className="w-5 h-5 text-white" />
                            </div>
                            <div>
                              <CardTitle className="text-lg">{feature.name}</CardTitle>
                              <div className="flex items-center gap-2 mt-1">
                                <Badge variant={feature.active ? "default" : "secondary"} className="text-xs">
                                  {feature.active ? "Active" : "Inactive"}
                                </Badge>
                                <div className="flex items-center gap-1 text-sm">
                                  <TrendingUp className="w-3 h-3 text-green-500" />
                                  <span className="text-green-600">+{feature.growth}%</span>
                                </div>
                              </div>
                            </div>
                          </div>
                          <Button variant="ghost" size="sm" className="opacity-0 group-hover:opacity-100 transition-opacity">
                            <ExternalLink className="w-4 h-4" />
                          </Button>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-2 gap-4">
                          {feature.metrics.map((metric, metricIndex) => {
                            const MetricIcon = metric.icon;
                            return (
                              <div key={metricIndex} className="space-y-2">
                                <div className="flex items-center gap-2">
                                  <MetricIcon className={cn("w-4 h-4", metric.color)} />
                                  <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                                    {metric.title}
                                  </span>
                                </div>
                                <div className="space-y-1">
                                  <div className="text-xl font-bold text-gray-900 dark:text-white">
                                    {typeof metric.value === 'string' && metric.value.includes('$') 
                                      ? metric.value 
                                      : metric.value
                                    }
                                  </div>
                                  <div className="flex items-center gap-1 text-sm">
                                    {getTrendIcon(metric.trend)}
                                    <span className={cn(
                                      "font-medium",
                                      metric.trend === "up" ? "text-green-600" : 
                                      metric.trend === "down" ? "text-red-600" : "text-gray-600"
                                    )}>
                                      {metric.change > 0 ? '+' : ''}{metric.change}%
                                    </span>
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>

            {/* Recent Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="w-5 h-5 text-blue-500" />
                    Recent Activity
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recentActivities.map((activity, index) => {
                      const Icon = activity.icon;
                      return (
                        <div key={index} className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                          <div className="flex-shrink-0">
                            <Icon className={cn("w-5 h-5", activity.color)} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900 dark:text-white">
                              {activity.content}
                            </p>
                            <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                              {activity.time}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Crown className="w-5 h-5 text-yellow-500" />
                    Top Performing Content
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {topPerformingContent.map((content, index) => (
                      <div key={index} className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="text-sm font-medium text-gray-900 dark:text-white truncate">
                              {content.title}
                            </h4>
                            <Badge variant="outline" className="text-xs">
                              {content.type}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-4 text-xs text-gray-600 dark:text-gray-400">
                            <span className="flex items-center gap-1">
                              <Eye className="w-3 h-3" />
                              {content.views}
                            </span>
                            <span className="flex items-center gap-1">
                              <Heart className="w-3 h-3" />
                              {content.engagement}
                            </span>
                            <span className="flex items-center gap-1">
                              <DollarSign className="w-3 h-3" />
                              {content.revenue}
                            </span>
                          </div>
                        </div>
                        <Button variant="ghost" size="sm">
                          <ChevronRight className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Features Tab */}
          <TabsContent value="features" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {platformFeatures.map((feature, index) => {
                const Icon = feature.icon;
                return (
                  <Card key={index} className="hover:shadow-lg transition-all duration-200">
                    <CardHeader>
                      <div className="flex items-center gap-3">
                        <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center", feature.color)}>
                          <Icon className="w-4 h-4 text-white" />
                        </div>
                        <div>
                          <CardTitle className="text-base">{feature.name}</CardTitle>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge variant={feature.active ? "default" : "secondary"} className="text-xs">
                              {feature.active ? "Active" : "Inactive"}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-600 dark:text-gray-400">Growth Rate</span>
                          <div className="flex items-center gap-1">
                            <TrendingUp className="w-3 h-3 text-green-500" />
                            <span className="text-green-600 font-medium">+{feature.growth}%</span>
                          </div>
                        </div>
                        <Progress value={feature.growth} className="h-2" />
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm" className="flex-1">
                            View Details
                          </Button>
                          <Button size="sm" className="flex-1">
                            Manage
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </TabsContent>

          {/* Content Tab */}
          <TabsContent value="content" className="space-y-6">
            <div className="text-center py-12">
              <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Content Analytics</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Detailed content performance metrics across all platforms
              </p>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Analyze Content
              </Button>
            </div>
          </TabsContent>

          {/* Revenue Tab */}
          <TabsContent value="revenue" className="space-y-6">
            <div className="text-center py-12">
              <DollarSign className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Revenue Analytics</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Comprehensive revenue tracking and forecasting
              </p>
              <Button>
                <BarChart3 className="w-4 h-4 mr-2" />
                View Revenue Dashboard
              </Button>
            </div>
          </TabsContent>

          {/* Audience Tab */}
          <TabsContent value="audience" className="space-y-6">
            <div className="text-center py-12">
              <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Audience Analytics</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Deep insights into your audience across all platforms
              </p>
              <Button>
                <Eye className="w-4 h-4 mr-2" />
                Analyze Audience
              </Button>
            </div>
          </TabsContent>

          {/* Insights Tab */}
          <TabsContent value="insights" className="space-y-6">
            <div className="text-center py-12">
              <BarChart3 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">AI-Powered Insights</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Smart recommendations and predictive analytics
              </p>
              <Button>
                <Target className="w-4 h-4 mr-2" />
                Get Insights
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default EnhancedCreatorDashboard;
