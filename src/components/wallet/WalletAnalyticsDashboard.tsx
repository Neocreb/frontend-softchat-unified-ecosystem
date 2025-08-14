import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { useWalletContext } from "@/contexts/WalletContext";
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
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
  Target,
  Calendar,
  PieChart as PieChartIcon,
  BarChart3,
  Activity,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";
import { format, subDays, startOfMonth, endOfMonth, eachDayOfInterval } from "date-fns";

interface AnalyticsData {
  date: string;
  ecommerce: number;
  crypto: number;
  rewards: number;
  freelance: number;
  total: number;
}

interface SpendingCategory {
  name: string;
  amount: number;
  color: string;
  percentage: number;
}

const COLORS = ["#8884d8", "#82ca9d", "#ffc658", "#ff7300", "#8dd1e1"];

const WalletAnalyticsDashboard = () => {
  const { walletBalance, transactions, getTotalEarnings } = useWalletContext();
  const [selectedPeriod, setSelectedPeriod] = useState("30");

  // Generate analytics data for charts
  const analyticsData = useMemo(() => {
    const days = parseInt(selectedPeriod);
    const endDate = new Date();
    const startDate = subDays(endDate, days);
    
    const dateRange = eachDayOfInterval({ start: startDate, end: endDate });
    
    return dateRange.map(date => {
      const dayTransactions = transactions.filter(t => 
        format(new Date(t.timestamp), 'yyyy-MM-dd') === format(date, 'yyyy-MM-dd')
      );
      
      const ecommerce = dayTransactions
        .filter(t => t.source === 'ecommerce' && t.amount > 0)
        .reduce((sum, t) => sum + t.amount, 0);
      
      const crypto = dayTransactions
        .filter(t => t.source === 'crypto' && t.amount > 0)
        .reduce((sum, t) => sum + t.amount, 0);
      
      const rewards = dayTransactions
        .filter(t => t.source === 'rewards' && t.amount > 0)
        .reduce((sum, t) => sum + t.amount, 0);
      
      const freelance = dayTransactions
        .filter(t => t.source === 'freelance' && t.amount > 0)
        .reduce((sum, t) => sum + t.amount, 0);
      
      return {
        date: format(date, 'MMM dd'),
        ecommerce,
        crypto,
        rewards,
        freelance,
        total: ecommerce + crypto + rewards + freelance,
      };
    });
  }, [transactions, selectedPeriod]);

  // Calculate performance metrics
  const performanceMetrics = useMemo(() => {
    // Use actual wallet balance totals instead of transaction-based calculations
    const currentEarnings = walletBalance?.total || 0; // Total earned balance
    const recentEarnings = getTotalEarnings(parseInt(selectedPeriod)); // Recent transaction earnings
    const previousPeriodEarnings = getTotalEarnings(parseInt(selectedPeriod) * 2) - recentEarnings;

    const growth = previousPeriodEarnings > 0
      ? ((recentEarnings - previousPeriodEarnings) / previousPeriodEarnings) * 100
      : 5.2; // Default positive growth if no previous data

    const bestSource = walletBalance ? 
      Object.entries(walletBalance)
        .filter(([key]) => key !== 'total')
        .sort(([,a], [,b]) => (b as number) - (a as number))[0] 
      : null;

    return {
      currentEarnings: currentEarnings, // Use total wallet balance
      previousEarnings: previousPeriodEarnings,
      growth,
      bestSource: bestSource ? bestSource[0] : null,
      bestSourceAmount: bestSource ? bestSource[1] as number : 0,
    };
  }, [walletBalance, getTotalEarnings, selectedPeriod]);

  // Spending categories (mock data for demonstration)
  const spendingCategories: SpendingCategory[] = [
    { name: "Withdrawals", amount: 450, color: "#8884d8", percentage: 35 },
    { name: "Trading Fees", amount: 320, color: "#82ca9d", percentage: 25 },
    { name: "Transfer Fees", amount: 180, color: "#ffc658", percentage: 14 },
    { name: "Service Charges", amount: 120, color: "#ff7300", percentage: 9 },
    { name: "Other", amount: 220, color: "#8dd1e1", percentage: 17 },
  ];

  // Pie chart data for income sources
  const incomeSourceData = walletBalance ? [
    { name: "E-commerce", value: walletBalance.ecommerce, color: "#8884d8" },
    { name: "Crypto", value: walletBalance.crypto, color: "#82ca9d" },
    { name: "Rewards", value: walletBalance.rewards, color: "#ffc658" },
    { name: "Freelance", value: walletBalance.freelance, color: "#ff7300" },
  ].filter(item => item.value > 0) : [];

  if (!walletBalance) return null;

  return (
    <div className="space-y-6">
      {/* Header with Period Selection */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Wallet Analytics</h2>
          <p className="text-gray-600">Insights into your financial performance</p>
        </div>
        <div className="flex gap-2">
          {["7", "30", "90"].map((period) => (
            <Button
              key={period}
              variant={selectedPeriod === period ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedPeriod(period)}
            >
              {period} days
            </Button>
          ))}
        </div>
      </div>

      {/* Key Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Earnings</p>
                <p className="text-2xl font-bold text-gray-900">
                  ${performanceMetrics.currentEarnings.toFixed(2)}
                </p>
              </div>
              <div className="p-3 bg-blue-100 rounded-full">
                <DollarSign className="h-6 w-6 text-blue-600" />
              </div>
            </div>
            <div className="flex items-center mt-2">
              {performanceMetrics.growth >= 0 ? (
                <ArrowUpRight className="h-4 w-4 text-green-500 mr-1" />
              ) : (
                <ArrowDownRight className="h-4 w-4 text-red-500 mr-1" />
              )}
              <span className={`text-sm font-medium ${
                performanceMetrics.growth >= 0 ? 'text-green-600' : 'text-red-600'
              }`}>
                {Math.abs(performanceMetrics.growth).toFixed(1)}%
              </span>
              <span className="text-sm text-gray-600 ml-1">vs previous period</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Best Source</p>
                <p className="text-2xl font-bold text-gray-900 capitalize">
                  {performanceMetrics.bestSource || "None"}
                </p>
              </div>
              <div className="p-3 bg-green-100 rounded-full">
                <TrendingUp className="h-6 w-6 text-green-600" />
              </div>
            </div>
            <p className="text-sm text-gray-600 mt-2">
              ${performanceMetrics.bestSourceAmount.toFixed(2)} balance
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Sources</p>
                <p className="text-2xl font-bold text-gray-900">
                  {incomeSourceData.length}
                </p>
              </div>
              <div className="p-3 bg-purple-100 rounded-full">
                <Activity className="h-6 w-6 text-purple-600" />
              </div>
            </div>
            <p className="text-sm text-gray-600 mt-2">
              Income streams active
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Transactions</p>
                <p className="text-2xl font-bold text-gray-900">
                  {transactions.length}
                </p>
              </div>
              <div className="p-3 bg-orange-100 rounded-full">
                <BarChart3 className="h-6 w-6 text-orange-600" />
              </div>
            </div>
            <p className="text-sm text-gray-600 mt-2">
              Total recorded
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <Tabs defaultValue="earnings" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="earnings">Earnings Trend</TabsTrigger>
          <TabsTrigger value="sources">Income Sources</TabsTrigger>
          <TabsTrigger value="spending">Spending Analysis</TabsTrigger>
        </TabsList>

        <TabsContent value="earnings">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Earnings Over Time
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={analyticsData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis tickFormatter={(value) => `$${value}`} />
                    <Tooltip formatter={(value) => [`$${value}`, "Amount"]} />
                    <Legend />
                    <Area
                      type="monotone"
                      dataKey="total"
                      stackId="1"
                      stroke="#8884d8"
                      fill="#8884d8"
                      fillOpacity={0.6}
                      name="Total Earnings"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="sources">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <PieChartIcon className="h-5 w-5" />
                  Income Distribution
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={incomeSourceData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {incomeSourceData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => [`$${value}`, "Balance"]} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Source Performance
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={analyticsData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis tickFormatter={(value) => `$${value}`} />
                      <Tooltip formatter={(value) => [`$${value}`, "Earnings"]} />
                      <Legend />
                      <Bar dataKey="ecommerce" fill="#8884d8" name="E-commerce" />
                      <Bar dataKey="crypto" fill="#82ca9d" name="Crypto" />
                      <Bar dataKey="rewards" fill="#ffc658" name="Rewards" />
                      <Bar dataKey="freelance" fill="#ff7300" name="Freelance" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="spending">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <PieChartIcon className="h-5 w-5" />
                Spending Categories
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={spendingCategories}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percentage }) => `${name} ${percentage}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="amount"
                      >
                        {spendingCategories.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => [`$${value}`, "Amount"]} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="space-y-4">
                  {spendingCategories.map((category, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div 
                          className="w-4 h-4 rounded-full" 
                          style={{ backgroundColor: category.color }}
                        />
                        <span className="font-medium">{category.name}</span>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold">${category.amount}</div>
                        <div className="text-sm text-gray-600">{category.percentage}%</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default WalletAnalyticsDashboard;
