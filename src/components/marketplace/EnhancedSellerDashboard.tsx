import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  Package,
  Users,
  Star,
  Eye,
  ShoppingCart,
  Calendar,
  Target,
  Award,
  AlertCircle,
  Zap,
  ArrowUpRight,
  ArrowDownRight,
  BarChart3,
  PieChart as PieChartIcon,
  Activity,
  Clock,
  ThumbsUp,
  MessageCircle,
  RefreshCw,
} from "lucide-react";
import { Product, Order, SellerProfile } from "@/types/marketplace";
import { useMarketplace } from "@/contexts/MarketplaceContext";
import { useAuth } from "@/contexts/AuthContext";
import { cn } from "@/lib/utils";

interface AnalyticsData {
  revenue: number;
  orders: number;
  products: number;
  views: number;
  conversionRate: number;
  avgOrderValue: number;
  topProducts: Array<{ name: string; sales: number; revenue: number }>;
  revenueByMonth: Array<{ month: string; revenue: number; orders: number }>;
  categoryPerformance: Array<{
    category: string;
    sales: number;
    percentage: number;
  }>;
  customerMetrics: {
    newCustomers: number;
    returningCustomers: number;
    customerSatisfaction: number;
  };
  competitorAnalysis: {
    marketShare: number;
    priceCompetitiveness: number;
    qualityRating: number;
  };
}

interface EnhancedSellerDashboardProps {
  sellerId?: string;
}

const EnhancedSellerDashboard = ({
  sellerId,
}: EnhancedSellerDashboardProps) => {
  const [timeRange, setTimeRange] = useState("30d");
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(
    null,
  );
  const [loading, setLoading] = useState(true);
  const [selectedView, setSelectedView] = useState("overview");

  const { products, orders, user } = useMarketplace();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // Mock analytics data generation
  const generateAnalyticsData = (): AnalyticsData => {
    const currentDate = new Date();
    const daysBack = timeRange === "7d" ? 7 : timeRange === "30d" ? 30 : 90;

    // Generate revenue by month data
    const revenueByMonth = [];
    for (let i = daysBack; i >= 0; i -= Math.floor(daysBack / 6)) {
      const date = new Date(currentDate);
      date.setDate(date.getDate() - i);
      revenueByMonth.push({
        month: date.toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
        }),
        revenue: Math.floor(Math.random() * 5000) + 1000,
        orders: Math.floor(Math.random() * 50) + 10,
      });
    }

    return {
      revenue: 24580,
      orders: 342,
      products: products?.length || 12,
      views: 15420,
      conversionRate: 3.2,
      avgOrderValue: 71.87,
      topProducts: [
        { name: "Wireless Headphones", sales: 45, revenue: 2250 },
        { name: "Smart Watch", sales: 32, revenue: 1920 },
        { name: "Bluetooth Speaker", sales: 28, revenue: 1400 },
        { name: "Phone Case", sales: 56, revenue: 1120 },
        { name: "Wireless Charger", sales: 23, revenue: 920 },
      ],
      revenueByMonth,
      categoryPerformance: [
        { category: "Electronics", sales: 156, percentage: 45 },
        { category: "Accessories", sales: 98, percentage: 28 },
        { category: "Audio", sales: 67, percentage: 19 },
        { category: "Wearables", sales: 21, percentage: 8 },
      ],
      customerMetrics: {
        newCustomers: 127,
        returningCustomers: 215,
        customerSatisfaction: 4.6,
      },
      competitorAnalysis: {
        marketShare: 12.5,
        priceCompetitiveness: 85,
        qualityRating: 4.7,
      },
    };
  };

  useEffect(() => {
    const loadAnalytics = async () => {
      setLoading(true);
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setAnalyticsData(generateAnalyticsData());
      setLoading(false);
    };

    loadAnalytics();
  }, [timeRange, products, orders]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + "M";
    }
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + "K";
    }
    return num.toString();
  };

  const getPercentageChange = (current: number, previous: number) => {
    return ((current - previous) / previous) * 100;
  };

  const renderMetricCard = (
    title: string,
    value: string | number,
    change?: number,
    icon: React.ReactNode,
    format?: "currency" | "number" | "percentage",
  ) => {
    const formattedValue =
      format === "currency"
        ? formatCurrency(Number(value))
        : format === "percentage"
          ? `${value}%`
          : format === "number"
            ? formatNumber(Number(value))
            : value;

    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                {title}
              </p>
              <p className="text-2xl font-bold">{formattedValue}</p>
              {change !== undefined && (
                <div className="flex items-center mt-1">
                  {change >= 0 ? (
                    <ArrowUpRight className="w-4 h-4 text-green-500 mr-1" />
                  ) : (
                    <ArrowDownRight className="w-4 h-4 text-red-500 mr-1" />
                  )}
                  <span
                    className={cn(
                      "text-sm font-medium",
                      change >= 0 ? "text-green-600" : "text-red-600",
                    )}
                  >
                    {Math.abs(change).toFixed(1)}%
                  </span>
                  <span className="text-sm text-muted-foreground ml-1">
                    vs last period
                  </span>
                </div>
              )}
            </div>
            <div className="h-12 w-12 bg-primary/10 rounded-full flex items-center justify-center">
              {icon}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  if (loading || !analyticsData) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h2 className="text-2xl font-bold">Seller Dashboard</h2>
            <p className="text-muted-foreground">
              Analytics and insights for your store
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
            <span className="text-sm text-muted-foreground">
              Loading analytics...
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <div className="space-y-2">
                  <div className="h-4 bg-muted rounded animate-pulse" />
                  <div className="h-8 bg-muted rounded animate-pulse" />
                  <div className="h-4 w-24 bg-muted rounded animate-pulse" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  const COLORS = ["#8884d8", "#82ca9d", "#ffc658", "#ff7300", "#8dd1e1"];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="space-y-1">
          <h2 className="text-2xl font-bold">Seller Dashboard</h2>
          <p className="text-muted-foreground">
            Analytics and insights for your store
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="90d">Last 90 days</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="sm">
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {renderMetricCard(
          "Total Revenue",
          analyticsData.revenue,
          12.5,
          <DollarSign className="w-6 h-6 text-primary" />,
          "currency",
        )}
        {renderMetricCard(
          "Total Orders",
          analyticsData.orders,
          8.3,
          <ShoppingCart className="w-6 h-6 text-primary" />,
          "number",
        )}
        {renderMetricCard(
          "Total Products",
          analyticsData.products,
          undefined,
          <Package className="w-6 h-6 text-primary" />,
          "number",
        )}
        {renderMetricCard(
          "Store Views",
          analyticsData.views,
          15.7,
          <Eye className="w-6 h-6 text-primary" />,
          "number",
        )}
      </div>

      {/* Secondary Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {renderMetricCard(
          "Conversion Rate",
          analyticsData.conversionRate,
          2.1,
          <Target className="w-6 h-6 text-primary" />,
          "percentage",
        )}
        {renderMetricCard(
          "Avg Order Value",
          analyticsData.avgOrderValue,
          -1.2,
          <BarChart3 className="w-6 h-6 text-primary" />,
          "currency",
        )}
        {renderMetricCard(
          "Customer Rating",
          analyticsData.customerMetrics.customerSatisfaction,
          0.3,
          <Star className="w-6 h-6 text-primary" />,
        )}
      </div>

      {/* Analytics Tabs */}
      <Tabs
        value={selectedView}
        onValueChange={setSelectedView}
        className="space-y-6"
      >
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="products">Products</TabsTrigger>
          <TabsTrigger value="customers">Customers</TabsTrigger>
          <TabsTrigger value="insights">Insights</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Revenue Chart */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5" />
                  Revenue Trend
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={analyticsData.revenueByMonth}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip
                      formatter={(value) => [
                        formatCurrency(Number(value)),
                        "Revenue",
                      ]}
                    />
                    <Area
                      type="monotone"
                      dataKey="revenue"
                      stroke="#8884d8"
                      fill="#8884d8"
                      fillOpacity={0.6}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Category Performance */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <PieChartIcon className="w-5 h-5" />
                  Sales by Category
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={analyticsData.categoryPerformance}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={5}
                      dataKey="sales"
                    >
                      {analyticsData.categoryPerformance.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => [value, "Sales"]} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* Top Products */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="w-5 h-5" />
                Top Performing Products
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {analyticsData.topProducts.map((product, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 border rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                        <span className="text-sm font-medium">{index + 1}</span>
                      </div>
                      <div>
                        <p className="font-medium">{product.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {product.sales} sales
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">
                        {formatCurrency(product.revenue)}
                      </p>
                      <p className="text-sm text-muted-foreground">revenue</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="products" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Product Performance Chart */}
            <Card>
              <CardHeader>
                <CardTitle>Product Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={analyticsData.topProducts}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                      dataKey="name"
                      angle={-45}
                      textAnchor="end"
                      height={80}
                    />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="sales" fill="#8884d8" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Product Insights */}
            <Card>
              <CardHeader>
                <CardTitle>Product Insights</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Best converting product</span>
                    <span className="font-medium">Wireless Headphones</span>
                  </div>
                  <Progress value={75} className="h-2" />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Most viewed product</span>
                    <span className="font-medium">Smart Watch</span>
                  </div>
                  <Progress value={60} className="h-2" />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Highest rated product</span>
                    <span className="font-medium">Bluetooth Speaker</span>
                  </div>
                  <Progress value={90} className="h-2" />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Fastest growing product</span>
                    <span className="font-medium">Phone Case</span>
                  </div>
                  <Progress value={45} className="h-2" />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="customers" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  New Customers
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {analyticsData.customerMetrics.newCustomers}
                </div>
                <div className="flex items-center mt-2 text-sm">
                  <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                  <span className="text-green-600">+18.2%</span>
                  <span className="text-muted-foreground ml-1">
                    vs last period
                  </span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <RefreshCw className="w-5 h-5" />
                  Returning Customers
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {analyticsData.customerMetrics.returningCustomers}
                </div>
                <div className="flex items-center mt-2 text-sm">
                  <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                  <span className="text-green-600">+12.5%</span>
                  <span className="text-muted-foreground ml-1">
                    vs last period
                  </span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ThumbsUp className="w-5 h-5" />
                  Satisfaction Score
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {analyticsData.customerMetrics.customerSatisfaction}/5
                </div>
                <div className="flex items-center mt-2">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={cn(
                        "w-4 h-4",
                        i <
                          Math.floor(
                            analyticsData.customerMetrics.customerSatisfaction,
                          )
                          ? "fill-yellow-400 text-yellow-400"
                          : "text-gray-300",
                      )}
                    />
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Customer Acquisition Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Customer Acquisition</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={analyticsData.revenueByMonth}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="orders"
                    stroke="#8884d8"
                    strokeWidth={2}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="insights" className="space-y-6">
          {/* Competitive Analysis */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="w-5 h-5" />
                  Market Share
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {analyticsData.competitorAnalysis.marketShare}%
                </div>
                <Progress
                  value={analyticsData.competitorAnalysis.marketShare}
                  className="mt-2"
                />
                <p className="text-sm text-muted-foreground mt-2">
                  Your share of the total market
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="w-5 h-5" />
                  Price Competitiveness
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {analyticsData.competitorAnalysis.priceCompetitiveness}%
                </div>
                <Progress
                  value={analyticsData.competitorAnalysis.priceCompetitiveness}
                  className="mt-2"
                />
                <p className="text-sm text-muted-foreground mt-2">
                  Compared to similar sellers
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Star className="w-5 h-5" />
                  Quality Rating
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {analyticsData.competitorAnalysis.qualityRating}/5
                </div>
                <div className="flex items-center mt-2">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={cn(
                        "w-4 h-4",
                        i <
                          Math.floor(
                            analyticsData.competitorAnalysis.qualityRating,
                          )
                          ? "fill-yellow-400 text-yellow-400"
                          : "text-gray-300",
                      )}
                    />
                  ))}
                </div>
                <p className="text-sm text-muted-foreground mt-2">
                  Based on customer reviews
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Recommendations */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="w-5 h-5" />
                AI-Powered Recommendations
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 border rounded-lg bg-blue-50">
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2" />
                  <div>
                    <h4 className="font-medium text-blue-900">
                      Optimize Pricing
                    </h4>
                    <p className="text-sm text-blue-700 mt-1">
                      Consider reducing prices on "Wireless Charger" by 10% to
                      increase sales volume based on competitor analysis.
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-4 border rounded-lg bg-green-50">
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2" />
                  <div>
                    <h4 className="font-medium text-green-900">
                      Inventory Alert
                    </h4>
                    <p className="text-sm text-green-700 mt-1">
                      "Smart Watch" is performing well. Consider increasing
                      inventory to meet demand.
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-4 border rounded-lg bg-orange-50">
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-orange-500 rounded-full mt-2" />
                  <div>
                    <h4 className="font-medium text-orange-900">
                      Marketing Opportunity
                    </h4>
                    <p className="text-sm text-orange-700 mt-1">
                      "Bluetooth Speaker" has high engagement but low
                      conversion. Try adding more product images or customer
                      reviews.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default EnhancedSellerDashboard;
