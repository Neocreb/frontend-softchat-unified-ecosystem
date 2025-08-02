import React, { useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";
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
  ArrowUpRight,
  ArrowDownRight,
  AlertCircle,
  CheckCircle,
  Lightbulb,
  Brain,
  Rocket,
  Crown,
  Flame,
  ChevronRight,
  MoreHorizontal,
  Plus,
  Minus,
  Equal,
  X,
  Trophy,
  Shield,
  ShoppingCart,
  Briefcase,
  TrendingUpIcon,
  Layers,
  BarChart,
  PieChartIcon,
  Timer,
  Package,
  Store,
  Wallet,
  Bitcoin,
  CandlestickChart,
  AreaChart,
  TrendingDownIcon,
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
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { formatDistanceToNow } from "date-fns";
import { unifiedAnalyticsService, type PlatformMetrics } from "@/services/unifiedAnalyticsService";
import { mobileOptimization, responsiveModal, responsiveCharts } from "@/utils/mobileOptimization";
import { MobileResponsiveWrapper } from "@/components/shared/MobileResponsiveWrapper";

interface FeatureToggle {
  social: boolean;
  ecommerce: boolean;
  freelance: boolean;
  crypto: boolean;
  creatorEconomy: boolean;
  crossPlatform: boolean;
}

const UnifiedCreatorStudio: React.FC = () => {
  const [timeRange, setTimeRange] = useState("30d");
  const [activeTab, setActiveTab] = useState("overview");
  const [selectedMetric, setSelectedMetric] = useState<string | null>(null);
  const [showInsights, setShowInsights] = useState(true);
  const [platformMetrics, setPlatformMetrics] = useState<PlatformMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [exportFormat, setExportFormat] = useState<'csv' | 'pdf' | 'json'>('csv');
  const [featureToggles, setFeatureToggles] = useState<FeatureToggle>({
    social: true,
    ecommerce: true,
    freelance: true,
    crypto: true,
    creatorEconomy: true,
    crossPlatform: true,
  });

  // Mobile optimization hooks
  const isMobile = mobileOptimization.isMobile();
  const isTablet = mobileOptimization.isTablet();
  const getResponsiveGrid = (base: string, md?: string, lg?: string) => {
    if (isMobile) return "grid-cols-1";
    if (isTablet && md) return md;
    return lg || base;
  };

  useEffect(() => {
    loadPlatformMetrics();
  }, [timeRange]);

  const loadPlatformMetrics = async () => {
    setLoading(true);
    try {
      const metrics = await unifiedAnalyticsService.getPlatformMetrics('user-123', timeRange);
      setPlatformMetrics(metrics);
    } catch (error) {
      console.error('Failed to load platform metrics:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleExport = async () => {
    try {
      const exportData = await unifiedAnalyticsService.exportAnalytics('user-123', exportFormat, timeRange);
      
      if (exportFormat === 'json' || exportFormat === 'csv') {
        const blob = new Blob([exportData], { 
          type: exportFormat === 'json' ? 'application/json' : 'text/csv' 
        });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `creator-studio-analytics-${timeRange}.${exportFormat}`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      }
    } catch (error) {
      console.error('Export failed:', error);
    }
  };

  const formatNumber = (num: number, format: string = "number"): string => {
    switch (format) {
      case "currency":
        return new Intl.NumberFormat("en-US", {
          style: "currency",
          currency: "USD",
          minimumFractionDigits: 0,
        }).format(num);
      case "percentage":
        return `${num.toFixed(1)}%`;
      case "duration":
        const minutes = Math.floor(num / 60);
        const seconds = num % 60;
        return `${minutes}:${seconds.toString().padStart(2, "0")}`;
      default:
        if (num >= 1000000) {
          return (num / 1000000).toFixed(1) + "M";
        } else if (num >= 1000) {
          return (num / 1000).toFixed(1) + "K";
        }
        return num.toString();
    }
  };

  const getChangeIndicator = (change: number, type: string = "increase") => {
    const isPositive = change > 0;
    const isNegative = change < 0;

    return (
      <div
        className={cn(
          "flex items-center gap-1 text-sm",
          isPositive && "text-green-500",
          isNegative && "text-red-500",
          change === 0 && "text-gray-500",
        )}
      >
        {isPositive && <TrendingUp className="w-3 h-3" />}
        {isNegative && <TrendingDown className="w-3 h-3" />}
        {change === 0 && <Equal className="w-3 h-3" />}
        <span>{Math.abs(change)}%</span>
      </div>
    );
  };

  const toggleFeature = (feature: keyof FeatureToggle) => {
    setFeatureToggles(prev => ({
      ...prev,
      [feature]: !prev[feature]
    }));
  };

  if (loading || !platformMetrics) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400">Loading analytics...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Helmet>
        <title>Unified Creator Studio | Softchat</title>
        <meta
          name="description"
          content="Comprehensive analytics dashboard across all platform features"
        />
      </Helmet>

      {/* Header */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between py-4 sm:h-16 gap-4">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                  <Layers className="w-5 h-5 text-white" />
                </div>
                <h1 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">
                  Unified Creator Studio
                </h1>
              </div>
              <Badge
                variant="secondary"
                className="bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200 text-xs sm:text-sm"
              >
                Pro Analytics
              </Badge>
            </div>

            <div className="flex items-center gap-2 sm:gap-3 w-full sm:w-auto">
              <Select value={timeRange} onValueChange={setTimeRange}>
                <SelectTrigger className="w-28 sm:w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="7d">Last 7 days</SelectItem>
                  <SelectItem value="30d">Last 30 days</SelectItem>
                  <SelectItem value="90d">Last 3 months</SelectItem>
                  <SelectItem value="1y">Last year</SelectItem>
                </SelectContent>
              </Select>
              
              <Select value={exportFormat} onValueChange={(value: 'csv' | 'pdf' | 'json') => setExportFormat(value)}>
                <SelectTrigger className="w-20 sm:w-24">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="csv">CSV</SelectItem>
                  <SelectItem value="json">JSON</SelectItem>
                  <SelectItem value="pdf">PDF</SelectItem>
                </SelectContent>
              </Select>

              <Button variant="outline" size="sm" className="hidden sm:flex" onClick={handleExport}>
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
              <Button variant="outline" size="sm" className="sm:hidden" onClick={handleExport}>
                <Download className="w-4 h-4" />
              </Button>
              <Button variant="outline" size="sm" className="hidden sm:flex" onClick={loadPlatformMetrics}>
                <RefreshCw className="w-4 h-4 mr-2" />
                Refresh
              </Button>
              <Button variant="outline" size="sm" className="sm:hidden" onClick={loadPlatformMetrics}>
                <RefreshCw className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Feature Toggles */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-sm text-gray-600 dark:text-gray-400 mr-2">Show:</span>
            {Object.entries(featureToggles).map(([feature, enabled]) => (
              <Badge
                key={feature}
                variant={enabled ? "default" : "outline"}
                className={cn(
                  "cursor-pointer text-xs",
                  enabled ? "bg-purple-600 text-white" : "text-gray-600"
                )}
                onClick={() => toggleFeature(feature as keyof FeatureToggle)}
              >
                {feature === 'creatorEconomy' ? 'Creator Economy' : 
                 feature === 'crossPlatform' ? 'Cross-Platform' :
                 feature.charAt(0).toUpperCase() + feature.slice(1)}
              </Badge>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8 py-4 sm:py-8">
        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="space-y-6"
        >
          <div className="w-full overflow-x-auto pb-2">
            <TabsList className={cn(
              "grid min-w-fit",
              isMobile ? "grid-cols-3 gap-1" : "grid-cols-6 lg:grid-cols-8 lg:w-auto"
            )}>
              <TabsTrigger
                value="overview"
                className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm"
              >
                <Eye className="w-4 h-4" />
                <span className="hidden sm:inline">Overview</span>
              </TabsTrigger>
              
              {featureToggles.social && (
                <TabsTrigger
                  value="social"
                  className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm"
                >
                  <Heart className="w-4 h-4" />
                  <span className="hidden sm:inline">Social</span>
                </TabsTrigger>
              )}
              
              {featureToggles.ecommerce && (
                <TabsTrigger
                  value="ecommerce"
                  className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm"
                >
                  <ShoppingCart className="w-4 h-4" />
                  <span className="hidden sm:inline">E-commerce</span>
                </TabsTrigger>
              )}
              
              {featureToggles.freelance && (
                <TabsTrigger
                  value="freelance"
                  className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm"
                >
                  <Briefcase className="w-4 h-4" />
                  <span className="hidden sm:inline">Freelance</span>
                </TabsTrigger>
              )}
              
              {featureToggles.crypto && (
                <TabsTrigger
                  value="crypto"
                  className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm"
                >
                  <Bitcoin className="w-4 h-4" />
                  <span className="hidden sm:inline">Crypto</span>
                </TabsTrigger>
              )}
              
              {featureToggles.creatorEconomy && (
                <TabsTrigger
                  value="creator"
                  className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm"
                >
                  <Crown className="w-4 h-4" />
                  <span className="hidden sm:inline">Creator</span>
                </TabsTrigger>
              )}
              
              {featureToggles.crossPlatform && (
                <TabsTrigger
                  value="insights"
                  className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm"
                >
                  <Brain className="w-4 h-4" />
                  <span className="hidden sm:inline">Insights</span>
                </TabsTrigger>
              )}
              
              <TabsTrigger
                value="compare"
                className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm"
              >
                <BarChart3 className="w-4 h-4" />
                <span className="hidden sm:inline">Compare</span>
              </TabsTrigger>
            </TabsList>
          </div>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            {/* Unified Key Metrics */}
            <div className={cn(
              "grid gap-3 sm:gap-4",
              getResponsiveGrid("grid-cols-1", "grid-cols-2", "grid-cols-4")
            )}>
              <Card className="hover:shadow-lg transition-shadow cursor-pointer bg-gradient-to-r from-purple-50 to-purple-100 border-purple-200">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-sm font-medium text-purple-700">
                      Total Revenue
                    </p>
                    {getChangeIndicator(16.8)}
                  </div>
                  <p className="text-2xl font-bold text-purple-900">
                    {formatNumber(platformMetrics.crossPlatform.unified.totalRevenue, "currency")}
                  </p>
                  <p className="text-xs text-purple-600 mt-1">
                    Across all platforms
                  </p>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow cursor-pointer bg-gradient-to-r from-blue-50 to-blue-100 border-blue-200">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-sm font-medium text-blue-700">
                      Total Views
                    </p>
                    {getChangeIndicator(23.5)}
                  </div>
                  <p className="text-2xl font-bold text-blue-900">
                    {formatNumber(platformMetrics.crossPlatform.unified.totalViews)}
                  </p>
                  <p className="text-xs text-blue-600 mt-1">
                    Social + Video content
                  </p>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow cursor-pointer bg-gradient-to-r from-green-50 to-green-100 border-green-200">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-sm font-medium text-green-700">
                      Cross-Platform Users
                    </p>
                    {getChangeIndicator(12.3)}
                  </div>
                  <p className="text-2xl font-bold text-green-900">
                    {formatNumber(platformMetrics.crossPlatform.unified.crossPlatformUsers)}
                  </p>
                  <p className="text-xs text-green-600 mt-1">
                    Multi-feature users
                  </p>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow cursor-pointer bg-gradient-to-r from-orange-50 to-orange-100 border-orange-200">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-sm font-medium text-orange-700">
                      Total Engagement
                    </p>
                    {getChangeIndicator(8.7)}
                  </div>
                  <p className="text-2xl font-bold text-orange-900">
                    {formatNumber(platformMetrics.crossPlatform.unified.totalEngagement)}
                  </p>
                  <p className="text-xs text-orange-600 mt-1">
                    All platforms combined
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Revenue Distribution */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <PieChart className="w-5 h-5 text-purple-500" />
                  Revenue Distribution Across Platforms
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {platformMetrics.crossPlatform.insights.revenueDistribution.map((item, index) => (
                    <div
                      key={item.source}
                      className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg"
                    >
                      <div className="flex items-center gap-3 mb-2">
                        {item.source === 'E-commerce' && <ShoppingCart className="w-5 h-5 text-blue-500" />}
                        {item.source === 'Freelance' && <Briefcase className="w-5 h-5 text-green-500" />}
                        {item.source === 'Crypto' && <Bitcoin className="w-5 h-5 text-orange-500" />}
                        {item.source === 'Creator Economy' && <Crown className="w-5 h-5 text-purple-500" />}
                        <h4 className="font-medium">{item.source}</h4>
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600 dark:text-gray-400">Revenue</span>
                          <span className="font-medium">{formatNumber(item.amount, "currency")}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600 dark:text-gray-400">Share</span>
                          <span className="font-medium">{item.percentage}%</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600 dark:text-gray-400">Growth</span>
                          <span className={cn(
                            "font-medium",
                            item.growth > 0 ? "text-green-600" : "text-red-600"
                          )}>
                            {item.growth > 0 ? '+' : ''}{item.growth}%
                          </span>
                        </div>
                        <Progress value={item.percentage} className="h-2" />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Feature Adoption */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="w-5 h-5 text-blue-500" />
                  Feature Adoption & Retention
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {platformMetrics.crossPlatform.unified.featureAdoption.map((feature) => (
                    <div
                      key={feature.feature}
                      className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg"
                    >
                      <div className="flex items-center gap-3">
                        {feature.feature === 'Social Media' && <Heart className="w-5 h-5 text-pink-500" />}
                        {feature.feature === 'E-commerce' && <ShoppingCart className="w-5 h-5 text-blue-500" />}
                        {feature.feature === 'Freelance' && <Briefcase className="w-5 h-5 text-green-500" />}
                        {feature.feature === 'Crypto' && <Bitcoin className="w-5 h-5 text-orange-500" />}
                        <div>
                          <div className="font-medium">{feature.feature}</div>
                          <div className="text-sm text-gray-600 dark:text-gray-400">
                            {formatNumber(feature.users)} users
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-medium">{feature.retention}% retention</div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                          {formatNumber(feature.usage)} interactions
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Social Media Tab */}
          {featureToggles.social && (
            <TabsContent value="social" className="space-y-6">
              {/* Social Media Metrics */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                        Total Posts
                      </p>
                      <FileText className="w-4 h-4 text-blue-500" />
                    </div>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                      {formatNumber(platformMetrics.social.posts.totalPosts)}
                    </p>
                    <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                      {platformMetrics.social.posts.engagementRate}% avg engagement
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                        Total Followers
                      </p>
                      <Users className="w-4 h-4 text-green-500" />
                    </div>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                      {formatNumber(platformMetrics.social.audience.totalFollowers)}
                    </p>
                    <p className="text-xs text-green-600 mt-1">
                      +{formatNumber(platformMetrics.social.audience.newFollowers)} this month
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                        Video Views
                      </p>
                      <Play className="w-4 h-4 text-purple-500" />
                    </div>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                      {formatNumber(platformMetrics.social.videos.avgViews * platformMetrics.social.videos.totalVideos)}
                    </p>
                    <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                      {platformMetrics.social.videos.retentionRate}% retention
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                        Engagement Rate
                      </p>
                      <Heart className="w-4 h-4 text-red-500" />
                    </div>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                      {platformMetrics.social.engagement.engagementRate}%
                    </p>
                    <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                      {formatNumber(platformMetrics.social.engagement.totalEngagements)} total
                    </p>
                  </CardContent>
                </Card>
              </div>

              {/* Top Performing Content */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Top Performing Posts</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {platformMetrics.social.posts.topPerformingPosts.map((post, index) => (
                        <div
                          key={post.id}
                          className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg"
                        >
                          <div className="text-sm font-medium text-gray-500 w-6">
                            #{index + 1}
                          </div>
                          <div className="flex-1">
                            <h4 className="font-medium text-sm mb-1">
                              {post.content}
                            </h4>
                            <div className="flex items-center gap-4 text-xs text-gray-600 dark:text-gray-400">
                              <span className="flex items-center gap-1">
                                <Heart className="w-3 h-3" />
                                {formatNumber(post.likes)}
                              </span>
                              <span className="flex items-center gap-1">
                                <MessageCircle className="w-3 h-3" />
                                {formatNumber(post.comments)}
                              </span>
                              <span className="flex items-center gap-1">
                                <Share2 className="w-3 h-3" />
                                {formatNumber(post.shares)}
                              </span>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-sm font-medium">
                              {post.engagementRate}%
                            </div>
                            <div className="text-xs text-gray-600 dark:text-gray-400">
                              engagement
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Audience Demographics */}
                <Card>
                  <CardHeader>
                    <CardTitle>Audience Demographics</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-medium mb-2">Age Groups</h4>
                        <div className="space-y-2">
                          {platformMetrics.social.audience.demographics.ageGroups.map((age) => (
                            <div key={age.range} className="flex items-center justify-between">
                              <span className="text-sm">{age.range}</span>
                              <div className="flex items-center gap-2 flex-1 mx-3">
                                <Progress value={age.percentage} className="flex-1" />
                                <span className="text-sm w-8">{age.percentage}%</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="font-medium mb-2">Top Locations</h4>
                        <div className="space-y-2">
                          {platformMetrics.social.audience.demographics.locationDistribution.slice(0, 3).map((location) => (
                            <div key={location.location} className="flex items-center justify-between">
                              <span className="text-sm">{location.location}</span>
                              <span className="text-sm font-medium">{location.percentage}%</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          )}

          {/* E-commerce Tab */}
          {featureToggles.ecommerce && (
            <TabsContent value="ecommerce" className="space-y-6">
              {/* E-commerce Metrics */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card className="bg-gradient-to-r from-blue-50 to-blue-100 border-blue-200">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-sm font-medium text-blue-700">
                        Total Revenue
                      </p>
                      <DollarSign className="w-4 h-4 text-blue-600" />
                    </div>
                    <p className="text-2xl font-bold text-blue-900">
                      {formatNumber(platformMetrics.ecommerce.sales.totalRevenue, "currency")}
                    </p>
                    <p className="text-xs text-blue-600 mt-1">
                      {formatNumber(platformMetrics.ecommerce.sales.totalOrders)} orders
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                        Conversion Rate
                      </p>
                      <Target className="w-4 h-4 text-green-500" />
                    </div>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                      {platformMetrics.ecommerce.sales.conversionRate}%
                    </p>
                    <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                      ${formatNumber(platformMetrics.ecommerce.sales.avgOrderValue)} avg order
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                        Total Products
                      </p>
                      <Package className="w-4 h-4 text-purple-500" />
                    </div>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                      {formatNumber(platformMetrics.ecommerce.products.totalProducts)}
                    </p>
                    <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                      {formatNumber(platformMetrics.ecommerce.products.activeListings)} active
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                        Customer Rating
                      </p>
                      <Star className="w-4 h-4 text-yellow-500" />
                    </div>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                      {platformMetrics.ecommerce.products.avgRating}
                    </p>
                    <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                      {formatNumber(platformMetrics.ecommerce.products.totalReviews)} reviews
                    </p>
                  </CardContent>
                </Card>
              </div>

              {/* Top Selling Products */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Trophy className="w-5 h-5 text-yellow-500" />
                    Top Selling Products
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {platformMetrics.ecommerce.sales.topSellingProducts.map((product, index) => (
                      <div
                        key={product.id}
                        className="flex items-center gap-4 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg"
                      >
                        <div className="text-sm font-medium text-gray-500 w-6">
                          #{index + 1}
                        </div>
                        <div className="w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded object-cover flex items-center justify-center">
                          <Package className="w-6 h-6 text-gray-400" />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium text-sm mb-1">
                            {product.name}
                          </h4>
                          <div className="flex items-center gap-4 text-xs text-gray-600 dark:text-gray-400">
                            <span>{formatNumber(product.sales)} sales</span>
                            <span>{formatNumber(product.revenue, "currency")} revenue</span>
                            <span>{product.rating} ⭐ ({formatNumber(product.reviews)} reviews)</span>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-medium text-green-600">
                            {product.conversionRate}%
                          </div>
                          <div className="text-xs text-gray-600 dark:text-gray-400">
                            conversion
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Customer Analytics */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Customer Insights</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                        <span className="text-sm font-medium">Total Customers</span>
                        <span className="text-lg font-bold">{formatNumber(platformMetrics.ecommerce.customers.totalCustomers)}</span>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                        <span className="text-sm font-medium">New Customers</span>
                        <span className="text-lg font-bold text-green-600">+{formatNumber(platformMetrics.ecommerce.customers.newCustomers)}</span>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                        <span className="text-sm font-medium">Retention Rate</span>
                        <span className="text-lg font-bold">{platformMetrics.ecommerce.customers.customerRetention}%</span>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                        <span className="text-sm font-medium">Avg Lifetime Value</span>
                        <span className="text-lg font-bold">{formatNumber(platformMetrics.ecommerce.customers.avgLifetimeValue, "currency")}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Marketing Performance</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                        <span className="text-sm font-medium">Ad Spend</span>
                        <span className="text-lg font-bold">{formatNumber(platformMetrics.ecommerce.marketing.adSpend, "currency")}</span>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                        <span className="text-sm font-medium">ROAS</span>
                        <span className="text-lg font-bold text-green-600">{platformMetrics.ecommerce.marketing.roas}x</span>
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Organic Traffic</span>
                          <span>{platformMetrics.ecommerce.marketing.organicTraffic}%</span>
                        </div>
                        <Progress value={platformMetrics.ecommerce.marketing.organicTraffic} className="h-2" />
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Paid Traffic</span>
                          <span>{platformMetrics.ecommerce.marketing.paidTraffic}%</span>
                        </div>
                        <Progress value={platformMetrics.ecommerce.marketing.paidTraffic} className="h-2" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          )}

          {/* Freelance Tab */}
          {featureToggles.freelance && (
            <TabsContent value="freelance" className="space-y-6">
              {/* Freelance Metrics */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card className="bg-gradient-to-r from-green-50 to-green-100 border-green-200">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-sm font-medium text-green-700">
                        Total Earnings
                      </p>
                      <DollarSign className="w-4 h-4 text-green-600" />
                    </div>
                    <p className="text-2xl font-bold text-green-900">
                      {formatNumber(platformMetrics.freelance.earnings.totalEarnings, "currency")}
                    </p>
                    <p className="text-xs text-green-600 mt-1">
                      +{platformMetrics.freelance.earnings.earningsGrowth}% growth
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                        Projects Completed
                      </p>
                      <CheckCircle className="w-4 h-4 text-blue-500" />
                    </div>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                      {formatNumber(platformMetrics.freelance.projects.completedProjects)}
                    </p>
                    <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                      {platformMetrics.freelance.projects.completionRate}% completion rate
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                        Hourly Rate
                      </p>
                      <Timer className="w-4 h-4 text-purple-500" />
                    </div>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                      {formatNumber(platformMetrics.freelance.earnings.avgHourlyRate, "currency")}
                    </p>
                    <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                      Average hourly rate
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                        Client Rating
                      </p>
                      <Star className="w-4 h-4 text-yellow-500" />
                    </div>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                      {platformMetrics.freelance.clients.avgClientRating}
                    </p>
                    <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                      {formatNumber(platformMetrics.freelance.clients.totalClients)} clients
                    </p>
                  </CardContent>
                </Card>
              </div>

              {/* Top Skills & Performance */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Award className="w-5 h-5 text-yellow-500" />
                      Top Performing Skills
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {platformMetrics.freelance.projects.topSkills.map((skill, index) => (
                        <div
                          key={skill.skill}
                          className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg"
                        >
                          <div className="text-sm font-medium text-gray-500 w-6">
                            #{index + 1}
                          </div>
                          <div className="flex-1">
                            <h4 className="font-medium text-sm mb-1">
                              {skill.skill}
                            </h4>
                            <div className="flex items-center gap-4 text-xs text-gray-600 dark:text-gray-400">
                              <span>{skill.projects} projects</span>
                              <span>{skill.avgRating} ⭐</span>
                              <span>Demand: {skill.demand}%</span>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-sm font-medium">
                              {formatNumber(skill.avgPrice, "currency")}
                            </div>
                            <div className="text-xs text-gray-600 dark:text-gray-400">
                              avg price
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Performance Metrics</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Overall Rating</span>
                          <span className="font-medium">{platformMetrics.freelance.performance.overallRating}/5.0</span>
                        </div>
                        <Progress value={platformMetrics.freelance.performance.overallRating * 20} className="h-2" />
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>On-Time Delivery</span>
                          <span className="font-medium">{platformMetrics.freelance.performance.deliveryTime}%</span>
                        </div>
                        <Progress value={platformMetrics.freelance.performance.deliveryTime} className="h-2" />
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Client Retention</span>
                          <span className="font-medium">{platformMetrics.freelance.clients.clientRetention}%</span>
                        </div>
                        <Progress value={platformMetrics.freelance.clients.clientRetention} className="h-2" />
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Success Score</span>
                          <span className="font-medium">{platformMetrics.freelance.performance.successScore}%</span>
                        </div>
                        <Progress value={platformMetrics.freelance.performance.successScore} className="h-2" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Client & Project Analytics */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Project Statistics</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Total Projects</span>
                        <span className="font-medium">{platformMetrics.freelance.projects.totalProjects}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Active Projects</span>
                        <span className="font-medium text-blue-600">{platformMetrics.freelance.projects.activeProjects}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Avg Project Value</span>
                        <span className="font-medium">{formatNumber(platformMetrics.freelance.projects.avgProjectValue, "currency")}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Response Time</span>
                        <span className="font-medium">{platformMetrics.freelance.performance.responseTime}h</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Client Analytics</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Total Clients</span>
                        <span className="font-medium">{platformMetrics.freelance.clients.totalClients}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Repeat Clients</span>
                        <span className="font-medium text-green-600">{platformMetrics.freelance.clients.repeatClients}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Client Satisfaction</span>
                        <span className="font-medium">{platformMetrics.freelance.clients.clientSatisfaction}%</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Client Growth</span>
                        <span className="font-medium text-blue-600">+{platformMetrics.freelance.clients.clientGrowth}%</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Earnings Breakdown</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Monthly Recurring</span>
                        <span className="font-medium">{formatNumber(platformMetrics.freelance.earnings.monthlyRecurring, "currency")}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Payment Success</span>
                        <span className="font-medium text-green-600">{platformMetrics.freelance.earnings.paymentSuccess}%</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Revision Rate</span>
                        <span className="font-medium">{platformMetrics.freelance.performance.revisionRate}%</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Dispute Rate</span>
                        <span className="font-medium text-orange-600">{platformMetrics.freelance.performance.disputeRate}%</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          )}

          {/* Crypto Tab */}
          {featureToggles.crypto && (
            <TabsContent value="crypto" className="space-y-6">
              {/* Crypto Metrics */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card className="bg-gradient-to-r from-orange-50 to-orange-100 border-orange-200">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-sm font-medium text-orange-700">
                        Portfolio Value
                      </p>
                      <Wallet className="w-4 h-4 text-orange-600" />
                    </div>
                    <p className="text-2xl font-bold text-orange-900">
                      {formatNumber(platformMetrics.crypto.portfolio.totalValue, "currency")}
                    </p>
                    <p className="text-xs text-orange-600 mt-1">
                      {platformMetrics.crypto.portfolio.totalPnL > 0 ? '+' : ''}{formatNumber(platformMetrics.crypto.portfolio.totalPnL, "currency")} P&L
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                        Trading Win Rate
                      </p>
                      <CandlestickChart className="w-4 h-4 text-green-500" />
                    </div>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                      {platformMetrics.crypto.trading.winRate}%
                    </p>
                    <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                      {formatNumber(platformMetrics.crypto.trading.totalTrades)} total trades
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                        P2P Rating
                      </p>
                      <Handshake className="w-4 h-4 text-blue-500" />
                    </div>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                      {platformMetrics.crypto.p2p.userRating}
                    </p>
                    <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                      {formatNumber(platformMetrics.crypto.p2p.totalP2PTrades)} P2P trades
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                        Staking APY
                      </p>
                      <Coins className="w-4 h-4 text-purple-500" />
                    </div>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                      {platformMetrics.crypto.staking.avgAPY}%
                    </p>
                    <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                      {formatNumber(platformMetrics.crypto.staking.totalStaked, "currency")} staked
                    </p>
                  </CardContent>
                </Card>
              </div>

              {/* Portfolio Performance */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <TrendingUp className="w-5 h-5 text-green-500" />
                      Best Performing Assets
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {platformMetrics.crypto.portfolio.bestPerforming.map((coin, index) => (
                        <div
                          key={coin.symbol}
                          className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg"
                        >
                          <div className="w-8 h-8 bg-orange-100 dark:bg-orange-900 rounded-full flex items-center justify-center">
                            <span className="text-xs font-bold text-orange-600">{coin.symbol}</span>
                          </div>
                          <div className="flex-1">
                            <h4 className="font-medium text-sm mb-1">
                              {coin.name}
                            </h4>
                            <div className="text-xs text-gray-600 dark:text-gray-400">
                              {coin.holdings} {coin.symbol}
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-sm font-medium">
                              {formatNumber(coin.value, "currency")}
                            </div>
                            <div className="text-xs text-green-600">
                              +{coin.pnlPercentage}%
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Trading Analytics</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="text-center p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                          <div className="text-sm text-green-600 dark:text-green-400">Avg Profit</div>
                          <div className="text-lg font-bold text-green-700 dark:text-green-300">
                            {formatNumber(platformMetrics.crypto.trading.avgProfit, "currency")}
                          </div>
                        </div>
                        <div className="text-center p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
                          <div className="text-sm text-red-600 dark:text-red-400">Avg Loss</div>
                          <div className="text-lg font-bold text-red-700 dark:text-red-300">
                            {formatNumber(platformMetrics.crypto.trading.avgLoss, "currency")}
                          </div>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-sm">Total Volume</span>
                          <span className="font-medium">{formatNumber(platformMetrics.crypto.trading.totalVolume, "currency")}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm">Trading Frequency</span>
                          <span className="font-medium">{platformMetrics.crypto.trading.tradingFrequency}/week</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm">Risk Score</span>
                          <span className="font-medium">{platformMetrics.crypto.portfolio.riskScore}/100</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm">Diversification</span>
                          <span className="font-medium">{platformMetrics.crypto.portfolio.diversificationScore}%</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* P2P & Staking */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Handshake className="w-5 h-5 text-blue-500" />
                      P2P Trading
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                        <span className="text-sm font-medium">Completion Rate</span>
                        <span className="text-lg font-bold text-green-600">{platformMetrics.crypto.p2p.completionRate}%</span>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                        <span className="text-sm font-medium">Trust Score</span>
                        <span className="text-lg font-bold">{platformMetrics.crypto.p2p.trustScore}/100</span>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                        <span className="text-sm font-medium">Avg Trade Time</span>
                        <span className="text-lg font-bold">{platformMetrics.crypto.p2p.avgTradeTime}min</span>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                        <span className="text-sm font-medium">Total P2P Volume</span>
                        <span className="text-lg font-bold">{formatNumber(platformMetrics.crypto.p2p.totalP2PVolume, "currency")}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Coins className="w-5 h-5 text-purple-500" />
                      Staking Rewards
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="text-center p-4 bg-gradient-to-r from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 rounded-lg">
                        <div className="text-sm text-purple-600 dark:text-purple-400 mb-1">Total Rewards</div>
                        <div className="text-2xl font-bold text-purple-700 dark:text-purple-300">
                          {formatNumber(platformMetrics.crypto.staking.stakingRewards, "currency")}
                        </div>
                      </div>

                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-sm">Average APY</span>
                          <span className="font-medium">{platformMetrics.crypto.staking.avgAPY}%</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm">Staking Duration</span>
                          <span className="font-medium">{platformMetrics.crypto.staking.stakingDuration} days</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm">Total Transactions</span>
                          <span className="font-medium">{formatNumber(platformMetrics.crypto.transactions.totalTransactions)}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm">Avg Transaction Fee</span>
                          <span className="font-medium">{formatNumber(platformMetrics.crypto.transactions.avgFees, "currency")}</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          )}

          {/* Creator Economy Tab */}
          {featureToggles.creatorEconomy && (
            <TabsContent value="creator" className="space-y-6">
              {/* Creator Economy Metrics */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card className="bg-gradient-to-r from-purple-50 to-purple-100 border-purple-200">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-sm font-medium text-purple-700">
                        Total Revenue
                      </p>
                      <Crown className="w-4 h-4 text-purple-600" />
                    </div>
                    <p className="text-2xl font-bold text-purple-900">
                      {formatNumber(platformMetrics.creatorEconomy.revenue.totalRevenue, "currency")}
                    </p>
                    <p className="text-xs text-purple-600 mt-1">
                      Creator earnings
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                        Tips Received
                      </p>
                      <Gift className="w-4 h-4 text-pink-500" />
                    </div>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                      {formatNumber(platformMetrics.creatorEconomy.revenue.tipsReceived, "currency")}
                    </p>
                    <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                      {formatNumber(platformMetrics.creatorEconomy.monetization.tipsCount)} tips
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                        Subscribers
                      </p>
                      <Users className="w-4 h-4 text-blue-500" />
                    </div>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                      {formatNumber(platformMetrics.creatorEconomy.monetization.subscriptionCount)}
                    </p>
                    <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                      {formatNumber(platformMetrics.creatorEconomy.revenue.subscriptionRevenue, "currency")} revenue
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                        Creator Score
                      </p>
                      <Star className="w-4 h-4 text-yellow-500" />
                    </div>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                      {platformMetrics.creatorEconomy.creator.creatorScore}
                    </p>
                    <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                      Performance rating
                    </p>
                  </CardContent>
                </Card>
              </div>

              {/* Revenue Streams */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="w-5 h-5 text-purple-500" />
                    Revenue Streams
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {[
                      { name: 'Tips', amount: platformMetrics.creatorEconomy.revenue.tipsReceived, icon: Gift, color: 'text-pink-500' },
                      { name: 'Subscriptions', amount: platformMetrics.creatorEconomy.revenue.subscriptionRevenue, icon: Users, color: 'text-blue-500' },
                      { name: 'Ad Revenue', amount: platformMetrics.creatorEconomy.revenue.adRevenue, icon: Eye, color: 'text-green-500' },
                      { name: 'Sponsorships', amount: platformMetrics.creatorEconomy.revenue.sponsorshipDeals, icon: Handshake, color: 'text-purple-500' },
                    ].map((stream) => {
                      const Icon = stream.icon;
                      return (
                        <div
                          key={stream.name}
                          className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg text-center"
                        >
                          <Icon className={cn("w-8 h-8 mx-auto mb-2", stream.color)} />
                          <div className="text-xl font-bold">{formatNumber(stream.amount, "currency")}</div>
                          <div className="text-sm text-gray-600 dark:text-gray-400">{stream.name}</div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>

              {/* Creator Analytics */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Content Performance</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                        <span className="text-sm font-medium">Content Created</span>
                        <span className="text-lg font-bold">{platformMetrics.creatorEconomy.creator.contentCreated}</span>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                        <span className="text-sm font-medium">Monetized Content</span>
                        <span className="text-lg font-bold text-green-600">{platformMetrics.creatorEconomy.creator.monetizedContent}</span>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                        <span className="text-sm font-medium">Fanbase</span>
                        <span className="text-lg font-bold">{formatNumber(platformMetrics.creatorEconomy.creator.fanbase)}</span>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                        <span className="text-sm font-medium">Superfans</span>
                        <span className="text-lg font-bold text-purple-600">{formatNumber(platformMetrics.creatorEconomy.creator.superfans)}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Monetization Metrics</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Conversion Rate</span>
                          <span className="font-medium">{platformMetrics.creatorEconomy.monetization.conversionRate}%</span>
                        </div>
                        <Progress value={platformMetrics.creatorEconomy.monetization.conversionRate} className="h-2" />
                      </div>

                      <div className="flex justify-between items-center">
                        <span className="text-sm">Avg Tip Amount</span>
                        <span className="font-medium">{formatNumber(platformMetrics.creatorEconomy.monetization.avgTipAmount, "currency")}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Avg Subscription Value</span>
                        <span className="font-medium">{formatNumber(platformMetrics.creatorEconomy.monetization.avgSubscriptionValue, "currency")}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Churn Rate</span>
                        <span className="font-medium text-orange-600">{platformMetrics.creatorEconomy.monetization.churRate}%</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Activity & Rewards</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="text-center p-4 bg-gradient-to-r from-yellow-50 to-yellow-100 dark:from-yellow-900/20 dark:to-yellow-800/20 rounded-lg">
                        <div className="text-sm text-yellow-600 dark:text-yellow-400 mb-1">Reward Points</div>
                        <div className="text-2xl font-bold text-yellow-700 dark:text-yellow-300">
                          {formatNumber(platformMetrics.creatorEconomy.activity.rewardPoints)}
                        </div>
                      </div>

                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-sm">Activity Streak</span>
                          <span className="font-medium">{platformMetrics.creatorEconomy.activity.activityStreak} days</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm">Level Progress</span>
                          <span className="font-medium">{platformMetrics.creatorEconomy.activity.levelProgress}%</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm">Achievements</span>
                          <span className="font-medium">{platformMetrics.creatorEconomy.activity.achievements}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm">Referral Earnings</span>
                          <span className="font-medium text-green-600">{formatNumber(platformMetrics.creatorEconomy.activity.referralEarnings, "currency")}</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Partnerships */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Handshake className="w-5 h-5 text-blue-500" />
                    Brand Partnerships
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="text-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <div className="text-2xl font-bold text-blue-600">{platformMetrics.creatorEconomy.partnerships.activePartnerships}</div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">Active</div>
                    </div>
                    <div className="text-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <div className="text-2xl font-bold text-green-600">{platformMetrics.creatorEconomy.partnerships.completedDeals}</div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">Completed</div>
                    </div>
                    <div className="text-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <div className="text-2xl font-bold">{formatNumber(platformMetrics.creatorEconomy.partnerships.avgDealValue, "currency")}</div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">Avg Deal</div>
                    </div>
                    <div className="text-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <div className="text-2xl font-bold text-purple-600">{platformMetrics.creatorEconomy.partnerships.partnershipSuccess}%</div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">Success Rate</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          )}

          {/* Cross-Platform Insights Tab */}
          {featureToggles.crossPlatform && (
            <TabsContent value="insights" className="space-y-6">
              {/* AI Insights & Predictions */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Brain className="w-5 h-5 text-purple-500" />
                    AI-Powered Insights & Predictions
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-medium mb-3">Revenue Forecasts</h4>
                      <div className="space-y-3">
                        {platformMetrics.crossPlatform.predictions.revenueForecasts.map((forecast, index) => (
                          <div
                            key={index}
                            className="p-4 bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-lg"
                          >
                            <div className="flex justify-between items-center mb-2">
                              <span className="font-medium">{forecast.period}</span>
                              <span className="text-lg font-bold text-blue-600">
                                {formatNumber(forecast.predictedRevenue, "currency")}
                              </span>
                            </div>
                            <div className="flex items-center gap-2 text-sm">
                              <Progress value={forecast.confidence} className="flex-1 h-1" />
                              <span className="text-gray-600 dark:text-gray-400">{forecast.confidence}% confidence</span>
                            </div>
                            <div className="mt-2">
                              <div className="text-xs text-gray-600 dark:text-gray-400">Key factors:</div>
                              <div className="text-xs text-gray-500 dark:text-gray-500">
                                {forecast.factors.join(', ')}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h4 className="font-medium mb-3">Growth Opportunities</h4>
                      <div className="space-y-3">
                        {platformMetrics.crossPlatform.predictions.opportunities.map((opportunity, index) => (
                          <div
                            key={index}
                            className="p-4 bg-gradient-to-r from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 rounded-lg"
                          >
                            <div className="flex justify-between items-start mb-2">
                              <h5 className="font-medium">{opportunity.opportunity}</h5>
                              <Badge
                                variant="secondary"
                                className={cn(
                                  "text-xs",
                                  opportunity.priority > 80 && "bg-red-100 text-red-800",
                                  opportunity.priority > 60 && opportunity.priority <= 80 && "bg-yellow-100 text-yellow-800",
                                  opportunity.priority <= 60 && "bg-green-100 text-green-800"
                                )}
                              >
                                Priority: {opportunity.priority}
                              </Badge>
                            </div>
                            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                              {opportunity.description}
                            </p>
                            <div className="flex justify-between text-xs">
                              <span>Potential: {opportunity.potential}%</span>
                              <span>Effort: {opportunity.effort}%</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Cross-Platform Performance */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Top Performing Platform</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center p-6">
                      <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Heart className="w-8 h-8 text-white" />
                      </div>
                      <h3 className="text-2xl font-bold mb-2">
                        {platformMetrics.crossPlatform.insights.topPerformingFeature}
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400 text-sm">
                        Your highest performing platform this month
                      </p>
                      <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
                        <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                          <div className="font-bold text-lg">{formatNumber(platformMetrics.social.engagement.totalEngagements)}</div>
                          <div className="text-gray-600 dark:text-gray-400">Engagements</div>
                        </div>
                        <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                          <div className="font-bold text-lg">{platformMetrics.social.engagement.engagementRate}%</div>
                          <div className="text-gray-600 dark:text-gray-400">Rate</div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Platform Comparison</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {[
                        { name: 'Social Media', value: 89, revenue: 35240, color: 'bg-pink-500' },
                        { name: 'E-commerce', value: 78, revenue: 125400, color: 'bg-blue-500' },
                        { name: 'Freelance', value: 95, revenue: 72450, color: 'bg-green-500' },
                        { name: 'Crypto', value: 67, revenue: 54834, color: 'bg-orange-500' },
                      ].map((platform) => (
                        <div key={platform.name} className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span className="font-medium">{platform.name}</span>
                            <span className="text-gray-600 dark:text-gray-400">
                              {formatNumber(platform.revenue, "currency")}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Progress value={platform.value} className="flex-1" />
                            <span className="text-sm w-8">{platform.value}%</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Cross-Platform Recommendations */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Lightbulb className="w-5 h-5 text-yellow-500" />
                    Smart Recommendations
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {[
                      {
                        title: "Cross-Platform Content Strategy",
                        description: "Leverage your social media success to drive e-commerce sales by creating product showcase videos",
                        impact: "High",
                        difficulty: "Medium"
                      },
                      {
                        title: "Crypto Payment Integration",
                        description: "Enable crypto payments in your marketplace to tap into your crypto user base",
                        impact: "Medium",
                        difficulty: "Low"
                      },
                      {
                        title: "Freelance Service Promotion",
                        description: "Promote your freelance services through social content to increase project bookings",
                        impact: "High",
                        difficulty: "Low"
                      }
                    ].map((rec, index) => (
                      <div
                        key={index}
                        className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:shadow-md transition-shadow"
                      >
                        <h4 className="font-medium mb-2">{rec.title}</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                          {rec.description}
                        </p>
                        <div className="flex gap-2">
                          <Badge
                            variant="secondary"
                            className={cn(
                              "text-xs",
                              rec.impact === "High" && "bg-red-100 text-red-800",
                              rec.impact === "Medium" && "bg-yellow-100 text-yellow-800"
                            )}
                          >
                            {rec.impact} Impact
                          </Badge>
                          <Badge
                            variant="outline"
                            className={cn(
                              "text-xs",
                              rec.difficulty === "Low" && "border-green-300 text-green-700",
                              rec.difficulty === "Medium" && "border-yellow-300 text-yellow-700"
                            )}
                          >
                            {rec.difficulty} Effort
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          )}

          {/* Compare Tab */}
          <TabsContent value="compare" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-blue-500" />
                  Cross-Platform Performance Comparison
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8 text-gray-500">
                  <BarChart3 className="w-12 h-12 mx-auto mb-4" />
                  <p className="text-lg font-medium mb-2">Advanced Comparison Tools</p>
                  <p className="text-sm mb-4">
                    Compare your performance across platforms, benchmark against industry standards, and identify optimization opportunities
                  </p>
                  <Button>
                    <Plus className="w-4 h-4 mr-2" />
                    Set Up Comparisons
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
        </Tabs>
      </div>
    </div>
  );
};

export default UnifiedCreatorStudio;
