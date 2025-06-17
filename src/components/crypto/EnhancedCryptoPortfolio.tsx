import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  LineChart,
  Line,
} from "recharts";
import {
  Wallet,
  TrendingUp,
  TrendingDown,
  ArrowUpRight,
  ArrowDownLeft,
  PieChart as PieChartIcon,
  BarChart3,
  Calculator,
  Download,
  RefreshCw,
  Eye,
  EyeOff,
  Target,
  DollarSign,
  Percent,
  Calendar,
  FileText,
  Plus,
  Minus,
} from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { useWalletContext, WalletProvider } from "@/contexts/WalletContext";
import DepositModal from "@/components/wallet/DepositModal";
import WithdrawModal from "@/components/wallet/WithdrawModal";
import { cn } from "@/lib/utils";

interface PortfolioAsset {
  id: string;
  symbol: string;
  name: string;
  amount: number;
  value: number;
  avgBuyPrice: number;
  currentPrice: number;
  pnl: number;
  pnlPercent: number;
  allocation: number;
  color: string;
  lastUpdated: string;
}

interface PerformanceData {
  date: string;
  totalValue: number;
  btcValue: number;
  ethValue: number;
  altcoinsValue: number;
  pnl: number;
  pnlPercent: number;
}

interface Transaction {
  id: string;
  type: "BUY" | "SELL" | "DEPOSIT" | "WITHDRAW" | "TRANSFER";
  asset: string;
  amount: number;
  price: number;
  value: number;
  fee: number;
  timestamp: string;
  status: "PENDING" | "COMPLETED" | "FAILED";
}

const COLORS = [
  "#0088FE",
  "#00C49F",
  "#FFBB28",
  "#FF8042",
  "#8884D8",
  "#82CA9D",
];

const mockPortfolioAssets: PortfolioAsset[] = [
  {
    id: "bitcoin",
    symbol: "BTC",
    name: "Bitcoin",
    amount: 0.5,
    value: 21625.34,
    avgBuyPrice: 41500,
    currentPrice: 43250.67,
    pnl: 875.34,
    pnlPercent: 4.22,
    allocation: 65.2,
    color: "#F7931A",
    lastUpdated: new Date().toISOString(),
  },
  {
    id: "ethereum",
    symbol: "ETH",
    name: "Ethereum",
    amount: 4.2,
    value: 10866.83,
    avgBuyPrice: 2400,
    currentPrice: 2587.34,
    pnl: 786.83,
    pnlPercent: 7.8,
    allocation: 32.8,
    color: "#627EEA",
    lastUpdated: new Date().toISOString(),
  },
  {
    id: "solana",
    symbol: "SOL",
    name: "Solana",
    amount: 6.8,
    value: 669.46,
    avgBuyPrice: 95,
    currentPrice: 98.45,
    pnl: 23.46,
    pnlPercent: 3.6,
    allocation: 2.0,
    color: "#9945FF",
    lastUpdated: new Date().toISOString(),
  },
];

const mockPerformanceData: PerformanceData[] = Array.from(
  { length: 30 },
  (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (29 - i));
    const baseValue = 30000 + Math.sin(i / 5) * 2000 + Math.random() * 1000;

    return {
      date: date.toISOString().split("T")[0],
      totalValue: baseValue,
      btcValue: baseValue * 0.65,
      ethValue: baseValue * 0.33,
      altcoinsValue: baseValue * 0.02,
      pnl: baseValue - 30000,
      pnlPercent: ((baseValue - 30000) / 30000) * 100,
    };
  },
);

const mockTransactions: Transaction[] = [
  {
    id: "1",
    type: "BUY",
    asset: "BTC",
    amount: 0.1,
    price: 43250,
    value: 4325,
    fee: 21.63,
    timestamp: "2024-01-15T10:30:00Z",
    status: "COMPLETED",
  },
  {
    id: "2",
    type: "SELL",
    asset: "ETH",
    amount: 0.5,
    price: 2587,
    value: 1293.5,
    fee: 6.47,
    timestamp: "2024-01-14T15:20:00Z",
    status: "COMPLETED",
  },
  {
    id: "3",
    type: "DEPOSIT",
    asset: "USDT",
    amount: 1000,
    price: 1,
    value: 1000,
    fee: 0,
    timestamp: "2024-01-13T09:15:00Z",
    status: "COMPLETED",
  },
];

function EnhancedCryptoPortfolioContent() {
  const [portfolioAssets, setPortfolioAssets] =
    useState<PortfolioAsset[]>(mockPortfolioAssets);
  const [performanceData, setPerformanceData] =
    useState<PerformanceData[]>(mockPerformanceData);
  const [transactions, setTransactions] =
    useState<Transaction[]>(mockTransactions);
  const [timeframe, setTimeframe] = useState("30D");
  const [activeTab, setActiveTab] = useState("overview");
  const [showValues, setShowValues] = useState(true);
  const [showDepositModal, setShowDepositModal] = useState(false);
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Add fallback handling for wallet context
  const fallbackWalletBalance = {
    total: 0,
    ecommerce: 0,
    crypto: 0,
    rewards: 0,
    freelance: 0,
  };

  let walletBalance = fallbackWalletBalance;
  let refreshWallet: () => Promise<void> = async () => {
    console.warn("Wallet refresh disabled - no WalletProvider available");
  };

  try {
    const walletContext = useWalletContext();
    walletBalance = walletContext.walletBalance || fallbackWalletBalance;
    refreshWallet = walletContext.refreshWallet;
  } catch (error) {
    console.warn(
      "EnhancedCryptoPortfolio: Wallet context not available, using fallback",
      error,
    );
    // Use fallback values defined above
  }

  const { toast } = useToast();

  const totalValue = portfolioAssets.reduce(
    (sum, asset) => sum + asset.value,
    0,
  );
  const totalPnl = portfolioAssets.reduce((sum, asset) => sum + asset.pnl, 0);
  const totalPnlPercent = (totalPnl / (totalValue - totalPnl)) * 100;
  const last24hChange = performanceData[performanceData.length - 1]?.pnl || 0;
  const last24hChangePercent =
    performanceData[performanceData.length - 1]?.pnlPercent || 0;

  const refreshPortfolio = async () => {
    setIsRefreshing(true);
    try {
      await refreshWallet();
      // Simulate portfolio refresh
      await new Promise((resolve) => setTimeout(resolve, 1000));

      toast({
        title: "Portfolio Updated",
        description: "Your portfolio data has been refreshed.",
      });
    } catch (error) {
      toast({
        title: "Refresh Failed",
        description: "Failed to refresh portfolio data.",
        variant: "destructive",
      });
    } finally {
      setIsRefreshing(false);
    }
  };

  const formatCurrency = (value: number, currency = "USD") => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);
  };

  const formatPercent = (value: number) => {
    const sign = value >= 0 ? "+" : "";
    return `${sign}${value.toFixed(2)}%`;
  };

  const formatCrypto = (amount: number, symbol: string) => {
    return `${amount.toFixed(8)} ${symbol}`;
  };

  const getChangeColor = (value: number) => {
    return value >= 0 ? "text-green-600" : "text-red-600";
  };

  const getChangeIcon = (value: number) => {
    return value >= 0 ? TrendingUp : TrendingDown;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold">Portfolio Dashboard</h2>
          <p className="text-gray-600">
            Track your cryptocurrency investments and performance
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={() => setShowValues(!showValues)}
            size="sm"
          >
            {showValues ? (
              <EyeOff className="h-4 w-4" />
            ) : (
              <Eye className="h-4 w-4" />
            )}
          </Button>
          <Button
            variant="outline"
            onClick={refreshPortfolio}
            disabled={isRefreshing}
            size="sm"
          >
            <RefreshCw
              className={cn("h-4 w-4", isRefreshing && "animate-spin")}
            />
          </Button>
          <Button
            onClick={() => setShowDepositModal(true)}
            className="bg-green-600 hover:bg-green-700"
          >
            <ArrowDownLeft className="h-4 w-4 mr-2" />
            Deposit
          </Button>
          <Button onClick={() => setShowWithdrawModal(true)} variant="outline">
            <ArrowUpRight className="h-4 w-4 mr-2" />
            Withdraw
          </Button>
        </div>
      </div>

      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="space-y-6"
      >
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="assets">Assets</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="transactions">Transactions</TabsTrigger>
          <TabsTrigger value="tax">Tax Report</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          {/* Portfolio Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Total Value</p>
                    <p className="text-2xl font-bold">
                      {showValues ? formatCurrency(totalValue) : "••••••"}
                    </p>
                    <div
                      className={cn(
                        "flex items-center gap-1 text-sm",
                        getChangeColor(totalPnlPercent),
                      )}
                    >
                      {React.createElement(getChangeIcon(totalPnlPercent), {
                        className: "h-4 w-4",
                      })}
                      {showValues ? formatPercent(totalPnlPercent) : "••••"}
                    </div>
                  </div>
                  <Wallet className="h-8 w-8 text-blue-500" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">24h Change</p>
                    <p className="text-2xl font-bold">
                      {showValues ? formatCurrency(last24hChange) : "••••••"}
                    </p>
                    <div
                      className={cn(
                        "flex items-center gap-1 text-sm",
                        getChangeColor(last24hChangePercent),
                      )}
                    >
                      {React.createElement(
                        getChangeIcon(last24hChangePercent),
                        { className: "h-4 w-4" },
                      )}
                      {showValues
                        ? formatPercent(last24hChangePercent)
                        : "••••"}
                    </div>
                  </div>
                  <TrendingUp className="h-8 w-8 text-green-500" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Total P&L</p>
                    <p className="text-2xl font-bold">
                      {showValues ? formatCurrency(totalPnl) : "••••••"}
                    </p>
                    <div
                      className={cn(
                        "flex items-center gap-1 text-sm",
                        getChangeColor(totalPnlPercent),
                      )}
                    >
                      {React.createElement(getChangeIcon(totalPnlPercent), {
                        className: "h-4 w-4",
                      })}
                      {showValues ? formatPercent(totalPnlPercent) : "••••"}
                    </div>
                  </div>
                  <Target className="h-8 w-8 text-purple-500" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Assets Count</p>
                    <p className="text-2xl font-bold">
                      {portfolioAssets.length}
                    </p>
                    <p className="text-sm text-gray-500">Different tokens</p>
                  </div>
                  <PieChartIcon className="h-8 w-8 text-orange-500" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Portfolio Performance Chart */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Portfolio Performance</CardTitle>
                <Select value={timeframe} onValueChange={setTimeframe}>
                  <SelectTrigger className="w-[100px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="7D">7D</SelectItem>
                    <SelectItem value="30D">30D</SelectItem>
                    <SelectItem value="90D">90D</SelectItem>
                    <SelectItem value="1Y">1Y</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={performanceData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                      dataKey="date"
                      tick={{ fontSize: 12 }}
                      tickFormatter={(value) =>
                        new Date(value).toLocaleDateString()
                      }
                    />
                    <YAxis tick={{ fontSize: 12 }} />
                    <Tooltip
                      formatter={(value: number) => [
                        formatCurrency(value),
                        "Portfolio Value",
                      ]}
                      labelFormatter={(label) =>
                        new Date(label).toLocaleDateString()
                      }
                    />
                    <Area
                      type="monotone"
                      dataKey="totalValue"
                      stroke="#8884d8"
                      fill="#8884d8"
                      fillOpacity={0.3}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Asset Allocation */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Asset Allocation</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={portfolioAssets}
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="allocation"
                        label={({ symbol, allocation }) =>
                          `${symbol} ${allocation.toFixed(1)}%`
                        }
                      >
                        {portfolioAssets.map((entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={COLORS[index % COLORS.length]}
                          />
                        ))}
                      </Pie>
                      <Tooltip
                        formatter={(value: number) => [
                          `${value.toFixed(1)}%`,
                          "Allocation",
                        ]}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Top Holdings</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {portfolioAssets.slice(0, 5).map((asset) => (
                    <div
                      key={asset.id}
                      className="flex items-center justify-between"
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: asset.color }}
                        />
                        <div>
                          <div className="font-medium">{asset.symbol}</div>
                          <div className="text-sm text-gray-600">
                            {asset.name}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-medium">
                          {showValues ? formatCurrency(asset.value) : "••••••"}
                        </div>
                        <div className="text-sm text-gray-600">
                          {asset.allocation.toFixed(1)}%
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Assets Tab */}
        <TabsContent value="assets" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Your Assets</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-2">Asset</th>
                      <th className="text-right py-2">Amount</th>
                      <th className="text-right py-2">Value</th>
                      <th className="text-right py-2">Avg Buy Price</th>
                      <th className="text-right py-2">Current Price</th>
                      <th className="text-right py-2">P&L</th>
                      <th className="text-right py-2">Allocation</th>
                    </tr>
                  </thead>
                  <tbody>
                    {portfolioAssets.map((asset) => (
                      <tr key={asset.id} className="border-b hover:bg-gray-50">
                        <td className="py-3">
                          <div className="flex items-center gap-2">
                            <div
                              className="w-3 h-3 rounded-full"
                              style={{ backgroundColor: asset.color }}
                            />
                            <div>
                              <div className="font-medium">{asset.symbol}</div>
                              <div className="text-sm text-gray-600">
                                {asset.name}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="text-right py-3">
                          {formatCrypto(asset.amount, asset.symbol)}
                        </td>
                        <td className="text-right py-3 font-medium">
                          {showValues ? formatCurrency(asset.value) : "••••••"}
                        </td>
                        <td className="text-right py-3">
                          {formatCurrency(asset.avgBuyPrice)}
                        </td>
                        <td className="text-right py-3">
                          {formatCurrency(asset.currentPrice)}
                        </td>
                        <td
                          className={cn(
                            "text-right py-3",
                            getChangeColor(asset.pnl),
                          )}
                        >
                          <div>
                            {showValues ? formatCurrency(asset.pnl) : "••••••"}
                          </div>
                          <div className="text-sm">
                            {formatPercent(asset.pnlPercent)}
                          </div>
                        </td>
                        <td className="text-right py-3">
                          <div className="flex items-center justify-end gap-2">
                            <span>{asset.allocation.toFixed(1)}%</span>
                            <Progress
                              value={asset.allocation}
                              className="w-12 h-2"
                            />
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Performance Tab */}
        <TabsContent value="performance" className="space-y-6">
          {/* Performance Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardContent className="p-6 text-center">
                <div className="text-2xl font-bold text-green-600">+24.7%</div>
                <div className="text-sm text-gray-600">30-Day Return</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6 text-center">
                <div className="text-2xl font-bold text-blue-600">1.85</div>
                <div className="text-sm text-gray-600">Sharpe Ratio</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6 text-center">
                <div className="text-2xl font-bold text-red-600">-8.4%</div>
                <div className="text-sm text-gray-600">Max Drawdown</div>
              </CardContent>
            </Card>
          </div>

          {/* P&L Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Profit & Loss Analysis</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={performanceData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                      dataKey="date"
                      tick={{ fontSize: 12 }}
                      tickFormatter={(value) =>
                        new Date(value).toLocaleDateString()
                      }
                    />
                    <YAxis tick={{ fontSize: 12 }} />
                    <Tooltip
                      formatter={(value: number) => [
                        formatCurrency(value),
                        "P&L",
                      ]}
                      labelFormatter={(label) =>
                        new Date(label).toLocaleDateString()
                      }
                    />
                    <Line
                      type="monotone"
                      dataKey="pnl"
                      stroke="#8884d8"
                      strokeWidth={2}
                      dot={false}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Asset Performance */}
          <Card>
            <CardHeader>
              <CardTitle>Asset Performance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={portfolioAssets}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="symbol" />
                    <YAxis />
                    <Tooltip
                      formatter={(value: number) => [
                        `${value.toFixed(2)}%`,
                        "P&L %",
                      ]}
                    />
                    <Bar dataKey="pnlPercent" fill="#8884d8" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Transactions Tab */}
        <TabsContent value="transactions" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Transaction History</CardTitle>
                <Button variant="outline" size="sm">
                  <Download className="h-4 w-4 mr-2" />
                  Export
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-2">Date</th>
                      <th className="text-left py-2">Type</th>
                      <th className="text-left py-2">Asset</th>
                      <th className="text-right py-2">Amount</th>
                      <th className="text-right py-2">Price</th>
                      <th className="text-right py-2">Value</th>
                      <th className="text-right py-2">Fee</th>
                      <th className="text-center py-2">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {transactions.map((tx) => (
                      <tr key={tx.id} className="border-b hover:bg-gray-50">
                        <td className="py-3">
                          {new Date(tx.timestamp).toLocaleDateString()}
                        </td>
                        <td className="py-3">
                          <Badge
                            variant={
                              tx.type === "BUY"
                                ? "default"
                                : tx.type === "SELL"
                                  ? "secondary"
                                  : "outline"
                            }
                          >
                            {tx.type}
                          </Badge>
                        </td>
                        <td className="py-3 font-medium">{tx.asset}</td>
                        <td className="text-right py-3">{tx.amount}</td>
                        <td className="text-right py-3">
                          {formatCurrency(tx.price)}
                        </td>
                        <td className="text-right py-3">
                          {formatCurrency(tx.value)}
                        </td>
                        <td className="text-right py-3">
                          {formatCurrency(tx.fee)}
                        </td>
                        <td className="text-center py-3">
                          <Badge
                            variant={
                              tx.status === "COMPLETED"
                                ? "default"
                                : tx.status === "PENDING"
                                  ? "outline"
                                  : "destructive"
                            }
                          >
                            {tx.status}
                          </Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tax Report Tab */}
        <TabsContent value="tax" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calculator className="h-5 w-5" />
                Tax Reporting Tools
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Tax Summary */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 border rounded-lg">
                  <div className="text-sm text-gray-600">
                    Total Realized Gains
                  </div>
                  <div className="text-xl font-bold text-green-600">
                    {formatCurrency(2456.78)}
                  </div>
                </div>
                <div className="p-4 border rounded-lg">
                  <div className="text-sm text-gray-600">
                    Total Realized Losses
                  </div>
                  <div className="text-xl font-bold text-red-600">
                    {formatCurrency(567.23)}
                  </div>
                </div>
                <div className="p-4 border rounded-lg">
                  <div className="text-sm text-gray-600">Net Capital Gains</div>
                  <div className="text-xl font-bold text-green-600">
                    {formatCurrency(1889.55)}
                  </div>
                </div>
              </div>

              <Separator />

              {/* Tax Actions */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Generate Reports</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card className="p-4">
                    <div className="flex items-center gap-3 mb-3">
                      <FileText className="h-8 w-8 text-blue-500" />
                      <div>
                        <h4 className="font-medium">8949 Form</h4>
                        <p className="text-sm text-gray-600">
                          Capital gains and losses report
                        </p>
                      </div>
                    </div>
                    <Button variant="outline" className="w-full">
                      <Download className="h-4 w-4 mr-2" />
                      Generate 8949
                    </Button>
                  </Card>

                  <Card className="p-4">
                    <div className="flex items-center gap-3 mb-3">
                      <Calculator className="h-8 w-8 text-green-500" />
                      <div>
                        <h4 className="font-medium">Tax Summary</h4>
                        <p className="text-sm text-gray-600">
                          Complete tax overview
                        </p>
                      </div>
                    </div>
                    <Button variant="outline" className="w-full">
                      <Download className="h-4 w-4 mr-2" />
                      Generate Summary
                    </Button>
                  </Card>
                </div>
              </div>

              <Separator />

              {/* Tax Settings */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Settings</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium">Accounting Method</div>
                      <div className="text-sm text-gray-600">
                        FIFO (First In, First Out)
                      </div>
                    </div>
                    <Select defaultValue="fifo">
                      <SelectTrigger className="w-[200px]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="fifo">FIFO</SelectItem>
                        <SelectItem value="lifo">LIFO</SelectItem>
                        <SelectItem value="specific">Specific ID</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium">Tax Year</div>
                      <div className="text-sm text-gray-600">
                        Current reporting year
                      </div>
                    </div>
                    <Select defaultValue="2024">
                      <SelectTrigger className="w-[200px]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="2024">2024</SelectItem>
                        <SelectItem value="2023">2023</SelectItem>
                        <SelectItem value="2022">2022</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Modals */}
      <DepositModal
        isOpen={showDepositModal}
        onClose={() => setShowDepositModal(false)}
        onSuccess={refreshPortfolio}
      />

      <WithdrawModal
        isOpen={showWithdrawModal}
        onClose={() => setShowWithdrawModal(false)}
        walletBalance={walletBalance}
        onSuccess={refreshPortfolio}
      />
    </div>
  );
}

export default function EnhancedCryptoPortfolio() {
  return (
    <WalletProvider>
      <EnhancedCryptoPortfolioContent />
    </WalletProvider>
  );
}
