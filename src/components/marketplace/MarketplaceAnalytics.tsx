import React, { useState, useEffect, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Separator } from "@/components/ui/separator";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  AreaChart,
  Area,
} from "recharts";
import {
  TrendingUp,
  TrendingDown,
  Eye,
  ShoppingCart,
  Heart,
  Star,
  Users,
  Package,
  DollarSign,
  Target,
  Award,
  Clock,
  Zap,
  Flame,
  Crown,
  Sparkles,
  ThumbsUp,
  MessageCircle,
  Share2,
  ArrowRight,
  ChevronDown,
  Filter,
  Download,
  RefreshCw,
  Calendar,
  MapPin,
  Globe,
  Smartphone,
  Monitor,
  Tablet,
  Activity,
  AlertTriangle,
  CheckCircle,
  Info,
} from "lucide-react";
import { useMarketplace } from "@/contexts/MarketplaceContext";
import { useAuth } from "@/contexts/AuthContext";
import { Product } from "@/types/marketplace";
import { cn } from "@/lib/utils";

interface AnalyticsData {
  totalViews: number;
  totalSales: number;
  totalRevenue: number;
  conversionRate: number;
  averageOrderValue: number;
  topCategories: Array<{ name: string; value: number; percentage: number }>;
  topProducts: Array<{
    product: Product;
    views: number;
    sales: number;
    revenue: number;
  }>;
  salesTrend: Array<{
    date: string;
    sales: number;
    revenue: number;
    views: number;
  }>;
  categoryPerformance: Array<{
    category: string;
    sales: number;
    revenue: number;
    growth: number;
  }>;
  userBehavior: {
    deviceTypes: Array<{ device: string; percentage: number }>;
    trafficSources: Array<{ source: string; percentage: number }>;
    averageSessionDuration: number;
    bounceRate: number;
  };
  recommendations: {
    trending: Product[];
    similar: Product[];
    personalizedForUser: Product[];
    frequentlyBoughtTogether: Array<{ products: Product[]; frequency: number }>;
    newArrivals: Product[];
    onSale: Product[];
    topRated: Product[];
    recommendedForYou: Product[];
  };
}

interface MarketplaceAnalyticsProps {
  showRecommendations?: boolean;
  timeRange?: "7d" | "30d" | "90d" | "1y";
  className?: string;
}

export default function MarketplaceAnalytics({
  showRecommendations = true,
  timeRange = "30d",
  className,
}: MarketplaceAnalyticsProps) {
  const { products } = useMarketplace();
  const { isAuthenticated, user } = useAuth();

  const [selectedTimeRange, setSelectedTimeRange] = useState(timeRange);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(
    null,
  );
  const [isLoading, setIsLoading] = useState(true);

  // Generate mock analytics data
  const generateAnalyticsData = useMemo((): AnalyticsData => {
    const totalViews = Math.floor(Math.random() * 50000) + 10000;
    const totalSales = Math.floor(Math.random() * 1000) + 200;
    const totalRevenue = totalSales * (Math.random() * 200 + 50);
    const conversionRate = (totalSales / totalViews) * 100;
    const averageOrderValue = totalRevenue / totalSales;

    // Top categories
    const categories = ["electronics", "clothing", "home", "beauty", "sports"];
    const topCategories = categories
      .map((category) => ({
        name: category,
        value: Math.floor(Math.random() * 1000) + 100,
        percentage: Math.random() * 100,
      }))
      .sort((a, b) => b.value - a.value);

    // Normalize percentages
    const totalCategoryValue = topCategories.reduce(
      (sum, cat) => sum + cat.value,
      0,
    );
    topCategories.forEach((cat) => {
      cat.percentage = (cat.value / totalCategoryValue) * 100;
    });

    // Top products
    const topProducts = products
      .slice(0, 10)
      .map((product) => ({
        product,
        views: Math.floor(Math.random() * 5000) + 100,
        sales: Math.floor(Math.random() * 100) + 10,
        revenue:
          (Math.floor(Math.random() * 100) + 10) *
          (product.discountPrice || product.price),
      }))
      .sort((a, b) => b.revenue - a.revenue);

    // Sales trend (last 30 days)
    const salesTrend = Array.from({ length: 30 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - (29 - i));
      return {
        date: date.toISOString().split("T")[0],
        sales: Math.floor(Math.random() * 50) + 10,
        revenue: Math.floor(Math.random() * 5000) + 1000,
        views: Math.floor(Math.random() * 500) + 100,
      };
    });

    // Category performance
    const categoryPerformance = categories.map((category) => ({
      category,
      sales: Math.floor(Math.random() * 500) + 50,
      revenue: Math.floor(Math.random() * 10000) + 2000,
      growth: (Math.random() - 0.5) * 100, // -50% to +50%
    }));

    // User behavior
    const userBehavior = {
      deviceTypes: [
        { device: "Mobile", percentage: 65 },
        { device: "Desktop", percentage: 25 },
        { device: "Tablet", percentage: 10 },
      ],
      trafficSources: [
        { source: "Direct", percentage: 40 },
        { source: "Search", percentage: 30 },
        { source: "Social", percentage: 20 },
        { source: "Referral", percentage: 10 },
      ],
      averageSessionDuration: 245, // seconds
      bounceRate: 35.5, // percentage
    };

    // Recommendations
    const shuffledProducts = [...products].sort(() => 0.5 - Math.random());
    const recommendations = {
      trending: shuffledProducts.slice(0, 6),
      similar: shuffledProducts.slice(6, 12),
      personalizedForUser: shuffledProducts.slice(12, 18),
      frequentlyBoughtTogether: [
        { products: shuffledProducts.slice(0, 3), frequency: 85 },
        { products: shuffledProducts.slice(3, 6), frequency: 72 },
        { products: shuffledProducts.slice(6, 9), frequency: 68 },
      ],
      newArrivals: shuffledProducts.filter((p) => p.isNew).slice(0, 6),
      onSale: shuffledProducts.filter((p) => p.discountPrice).slice(0, 6),
      topRated: shuffledProducts.filter((p) => p.rating >= 4.5).slice(0, 6),
      recommendedForYou: shuffledProducts.slice(18, 24),
    };

    return {
      totalViews,
      totalSales,
      totalRevenue,
      conversionRate,
      averageOrderValue,
      topCategories,
      topProducts,
      salesTrend,
      categoryPerformance,
      userBehavior,
      recommendations,
    };
  }, [products, selectedTimeRange, selectedCategory]);

  useEffect(() => {
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setAnalyticsData(generateAnalyticsData);
      setIsLoading(false);
    }, 1000);
  }, [generateAnalyticsData]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat("en-US").format(num);
  };

  const formatPercentage = (num: number) => {
    return `${num.toFixed(1)}%`;
  };

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8"];

  if (isLoading || !analyticsData) {
    return (
      <div className={cn("space-y-6", className)}>
        {Array.from({ length: 6 }).map((_, i) => (
          <Card key={i}>
            <CardContent className="p-6">
              <div className="animate-pulse space-y-4">
                <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                <div className="h-32 bg-gray-200 rounded"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <TooltipProvider>
      <div className={cn("space-y-6", className)}>
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold">Marketplace Analytics</h2>
            <p className="text-gray-600">
              Performance insights and recommendations
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Select
              value={selectedTimeRange}
              onValueChange={setSelectedTimeRange}
            >
              <SelectTrigger className="w-[120px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7d">Last 7 days</SelectItem>
                <SelectItem value="30d">Last 30 days</SelectItem>
                <SelectItem value="90d">Last 90 days</SelectItem>
                <SelectItem value="1y">Last year</SelectItem>
              </SelectContent>
            </Select>

            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>

            <Button variant="outline" size="sm">
              <RefreshCw className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Total Views
                  </p>
                  <p className="text-2xl font-bold">
                    {formatNumber(analyticsData.totalViews)}
                  </p>
                  <p className="text-xs text-green-600 flex items-center gap-1 mt-1">
                    <TrendingUp className="h-3 w-3" />
                    +12.5% from last period
                  </p>
                </div>
                <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Eye className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Total Sales
                  </p>
                  <p className="text-2xl font-bold">
                    {formatNumber(analyticsData.totalSales)}
                  </p>
                  <p className="text-xs text-green-600 flex items-center gap-1 mt-1">
                    <TrendingUp className="h-3 w-3" />
                    +8.2% from last period
                  </p>
                </div>
                <div className="h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <ShoppingCart className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Revenue</p>
                  <p className="text-2xl font-bold">
                    {formatCurrency(analyticsData.totalRevenue)}
                  </p>
                  <p className="text-xs text-green-600 flex items-center gap-1 mt-1">
                    <TrendingUp className="h-3 w-3" />
                    +15.3% from last period
                  </p>
                </div>
                <div className="h-12 w-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                  <DollarSign className="h-6 w-6 text-yellow-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Conversion Rate
                  </p>
                  <p className="text-2xl font-bold">
                    {formatPercentage(analyticsData.conversionRate)}
                  </p>
                  <p className="text-xs text-red-600 flex items-center gap-1 mt-1">
                    <TrendingDown className="h-3 w-3" />
                    -2.1% from last period
                  </p>
                </div>
                <div className="h-12 w-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Target className="h-6 w-6 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Sales Trend */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5" />
                Sales Trend
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={analyticsData.salesTrend}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    dataKey="date"
                    tickFormatter={(value) =>
                      new Date(value).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                      })
                    }
                  />
                  <YAxis />
                  <RechartsTooltip
                    labelFormatter={(value) =>
                      new Date(value).toLocaleDateString()
                    }
                    formatter={(value, name) => [
                      name === "revenue"
                        ? formatCurrency(value as number)
                        : formatNumber(value as number),
                      name,
                    ]}
                  />
                  <Area
                    type="monotone"
                    dataKey="sales"
                    stackId="1"
                    stroke="#8884d8"
                    fill="#8884d8"
                  />
                  <Area
                    type="monotone"
                    dataKey="views"
                    stackId="2"
                    stroke="#82ca9d"
                    fill="#82ca9d"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Category Performance */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <PieChart className="h-5 w-5" />
                Category Distribution
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={analyticsData.topCategories}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percentage }) =>
                      `${name} ${percentage.toFixed(1)}%`
                    }
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {analyticsData.topCategories.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <RechartsTooltip
                    formatter={(value) => formatNumber(value as number)}
                  />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Top Products */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="h-5 w-5" />
              Top Performing Products
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {analyticsData.topProducts.slice(0, 5).map((item, index) => (
                <div
                  key={item.product.id}
                  className="flex items-center gap-4 p-4 border rounded-lg"
                >
                  <div className="flex items-center justify-center w-8 h-8 bg-gray-100 rounded-full text-sm font-bold">
                    {index + 1}
                  </div>

                  <img
                    src={item.product.image}
                    alt={item.product.name}
                    className="w-12 h-12 object-cover rounded"
                  />

                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium truncate">
                      {item.product.name}
                    </h4>
                    <p className="text-sm text-gray-600">
                      {item.product.category}
                    </p>
                  </div>

                  <div className="text-right space-y-1">
                    <div className="flex items-center gap-4 text-sm">
                      <div>
                        <span className="text-gray-600">Views:</span>
                        <span className="font-medium ml-1">
                          {formatNumber(item.views)}
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-600">Sales:</span>
                        <span className="font-medium ml-1">
                          {formatNumber(item.sales)}
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-600">Revenue:</span>
                        <span className="font-medium ml-1">
                          {formatCurrency(item.revenue)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* User Behavior */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Device Types */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Smartphone className="h-5 w-5" />
                Device Usage
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {analyticsData.userBehavior.deviceTypes.map((device) => (
                  <div
                    key={device.device}
                    className="flex items-center justify-between"
                  >
                    <div className="flex items-center gap-2">
                      {device.device === "Mobile" && (
                        <Smartphone className="h-4 w-4" />
                      )}
                      {device.device === "Desktop" && (
                        <Monitor className="h-4 w-4" />
                      )}
                      {device.device === "Tablet" && (
                        <Tablet className="h-4 w-4" />
                      )}
                      <span className="font-medium">{device.device}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Progress value={device.percentage} className="w-20" />
                      <span className="text-sm font-medium w-12">
                        {device.percentage}%
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Traffic Sources */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="h-5 w-5" />
                Traffic Sources
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {analyticsData.userBehavior.trafficSources.map((source) => (
                  <div
                    key={source.source}
                    className="flex items-center justify-between"
                  >
                    <span className="font-medium">{source.source}</span>
                    <div className="flex items-center gap-2">
                      <Progress value={source.percentage} className="w-20" />
                      <span className="text-sm font-medium w-12">
                        {source.percentage}%
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              <Separator className="my-4" />

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-600">Avg. Session Duration</p>
                  <p className="font-medium">
                    {Math.floor(
                      analyticsData.userBehavior.averageSessionDuration / 60,
                    )}
                    m {analyticsData.userBehavior.averageSessionDuration % 60}s
                  </p>
                </div>
                <div>
                  <p className="text-gray-600">Bounce Rate</p>
                  <p className="font-medium">
                    {analyticsData.userBehavior.bounceRate}%
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recommendations Section */}
        {showRecommendations && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="h-5 w-5" />
                Product Recommendations
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="trending" className="w-full">
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="trending">Trending</TabsTrigger>
                  <TabsTrigger value="personalized">For You</TabsTrigger>
                  <TabsTrigger value="new">New Arrivals</TabsTrigger>
                  <TabsTrigger value="sale">On Sale</TabsTrigger>
                </TabsList>

                <TabsContent value="trending" className="mt-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {analyticsData.recommendations.trending.map((product) => (
                      <Card key={product.id} className="overflow-hidden">
                        <div className="aspect-square bg-gray-100">
                          <img
                            src={product.image}
                            alt={product.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <CardContent className="p-4">
                          <h4 className="font-medium text-sm line-clamp-2 mb-2">
                            {product.name}
                          </h4>
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-green-600">
                              {formatCurrency(
                                product.discountPrice || product.price,
                              )}
                            </span>
                            <div className="flex items-center gap-1">
                              <TrendingUp className="h-3 w-3 text-orange-500" />
                              <span className="text-xs text-orange-600">
                                Trending
                              </span>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </TabsContent>

                <TabsContent value="personalized" className="mt-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {analyticsData.recommendations.recommendedForYou.map(
                      (product) => (
                        <Card key={product.id} className="overflow-hidden">
                          <div className="aspect-square bg-gray-100">
                            <img
                              src={product.image}
                              alt={product.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <CardContent className="p-4">
                            <h4 className="font-medium text-sm line-clamp-2 mb-2">
                              {product.name}
                            </h4>
                            <div className="flex items-center justify-between">
                              <span className="font-bold text-green-600">
                                {formatCurrency(
                                  product.discountPrice || product.price,
                                )}
                              </span>
                              <div className="flex items-center gap-1">
                                <Target className="h-3 w-3 text-blue-500" />
                                <span className="text-xs text-blue-600">
                                  For You
                                </span>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ),
                    )}
                  </div>
                </TabsContent>

                <TabsContent value="new" className="mt-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {analyticsData.recommendations.newArrivals.map(
                      (product) => (
                        <Card key={product.id} className="overflow-hidden">
                          <div className="aspect-square bg-gray-100 relative">
                            <img
                              src={product.image}
                              alt={product.name}
                              className="w-full h-full object-cover"
                            />
                            <Badge className="absolute top-2 left-2 bg-green-600">
                              New
                            </Badge>
                          </div>
                          <CardContent className="p-4">
                            <h4 className="font-medium text-sm line-clamp-2 mb-2">
                              {product.name}
                            </h4>
                            <div className="flex items-center justify-between">
                              <span className="font-bold text-green-600">
                                {formatCurrency(
                                  product.discountPrice || product.price,
                                )}
                              </span>
                              <div className="flex items-center gap-1">
                                <Zap className="h-3 w-3 text-green-500" />
                                <span className="text-xs text-green-600">
                                  New
                                </span>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ),
                    )}
                  </div>
                </TabsContent>

                <TabsContent value="sale" className="mt-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {analyticsData.recommendations.onSale.map((product) => (
                      <Card key={product.id} className="overflow-hidden">
                        <div className="aspect-square bg-gray-100 relative">
                          <img
                            src={product.image}
                            alt={product.name}
                            className="w-full h-full object-cover"
                          />
                          {product.discountPrice && (
                            <Badge
                              variant="destructive"
                              className="absolute top-2 left-2"
                            >
                              {Math.round(
                                ((product.price - product.discountPrice) /
                                  product.price) *
                                  100,
                              )}
                              % OFF
                            </Badge>
                          )}
                        </div>
                        <CardContent className="p-4">
                          <h4 className="font-medium text-sm line-clamp-2 mb-2">
                            {product.name}
                          </h4>
                          <div className="flex items-center justify-between">
                            <div className="space-x-2">
                              <span className="font-bold text-green-600">
                                {formatCurrency(
                                  product.discountPrice || product.price,
                                )}
                              </span>
                              {product.discountPrice && (
                                <span className="text-xs text-gray-500 line-through">
                                  {formatCurrency(product.price)}
                                </span>
                              )}
                            </div>
                            <div className="flex items-center gap-1">
                              <Flame className="h-3 w-3 text-red-500" />
                              <span className="text-xs text-red-600">Sale</span>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        )}

        {/* Insights and Alerts */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5" />
              Insights & Alerts
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-start gap-3 p-4 bg-green-50 border-l-4 border-green-400 rounded">
                <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                <div>
                  <h4 className="font-medium text-green-800">
                    Strong Performance
                  </h4>
                  <p className="text-sm text-green-700">
                    Your electronics category is performing 25% above average
                    this month. Consider expanding your inventory.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-4 bg-yellow-50 border-l-4 border-yellow-400 rounded">
                <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5" />
                <div>
                  <h4 className="font-medium text-yellow-800">
                    Attention Needed
                  </h4>
                  <p className="text-sm text-yellow-700">
                    Mobile conversion rate has dropped by 5% this week. Consider
                    optimizing your mobile experience.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-4 bg-blue-50 border-l-4 border-blue-400 rounded">
                <Info className="h-5 w-5 text-blue-600 mt-0.5" />
                <div>
                  <h4 className="font-medium text-blue-800">
                    Optimization Tip
                  </h4>
                  <p className="text-sm text-blue-700">
                    Products with videos have 3x higher conversion rates.
                    Consider adding product videos to boost sales.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </TooltipProvider>
  );
}
