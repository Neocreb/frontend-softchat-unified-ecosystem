import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  TrendingUp,
  TrendingDown,
  BarChart3,
  DollarSign,
  Users,
  Zap,
  Shield,
  BookOpen,
  Award,
  Target,
  Globe,
  Coins,
  LineChart,
  PieChart,
  Smartphone,
  Brain,
  Rocket,
  Clock,
  Star,
  Eye,
  Activity,
  Lock,
  Unlock,
  Gift,
  Wallet,
  Settings,
  ArrowUpDown,
  CreditCard,
  Banknote,
  TrendingUpIcon,
} from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { cryptoService } from "@/services/cryptoService";
import {
  Cryptocurrency,
  MarketData,
  Portfolio,
  News,
  EducationContent,
} from "@/types/crypto";
import EnhancedTradingDashboard from "@/components/crypto/EnhancedTradingDashboard";
import DeFiDashboard from "@/components/crypto/DeFiDashboard";
import EnhancedP2PMarketplace from "@/components/crypto/EnhancedP2PMarketplace";
import { cn } from "@/lib/utils";

export default function EnhancedCrypto() {
  const [activeTab, setActiveTab] = useState("overview");
  const [cryptos, setCryptos] = useState<Cryptocurrency[]>([]);
  const [marketData, setMarketData] = useState<MarketData | null>(null);
  const [portfolio, setPortfolio] = useState<Portfolio | null>(null);
  const [news, setNews] = useState<News[]>([]);
  const [educationContent, setEducationContent] = useState<EducationContent[]>(
    [],
  );
  const [selectedPair, setSelectedPair] = useState("BTCUSDT");
  const [tradingMode, setTradingMode] = useState<"basic" | "advanced">("basic");
  const [isLoading, setIsLoading] = useState(true);

  const { toast } = useToast();

  useEffect(() => {
    loadCryptoData();
  }, []);

  const loadCryptoData = async () => {
    setIsLoading(true);
    try {
      const [
        cryptosData,
        marketDataResult,
        portfolioData,
        newsData,
        educationData,
      ] = await Promise.all([
        cryptoService.getCryptocurrencies(20),
        cryptoService.getMarketData(),
        cryptoService.getPortfolio(),
        cryptoService.getNews(10),
        cryptoService.getEducationContent(),
      ]);

      setCryptos(cryptosData);
      setMarketData(marketDataResult);
      setPortfolio(portfolioData);
      setNews(newsData);
      setEducationContent(educationData);
    } catch (error) {
      console.error("Failed to load crypto data:", error);
      toast({
        title: "Error",
        description: "Failed to load crypto data",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      notation: amount >= 1e9 ? "compact" : "standard",
      maximumFractionDigits: 2,
    }).format(amount);
  };

  const formatPercentage = (value: number) => {
    const safeValue = value || 0;
    return `${safeValue >= 0 ? "+" : ""}${safeValue.toFixed(2)}%`;
  };

  const getChangeColor = (value: number) => {
    return value >= 0 ? "text-green-600" : "text-red-600";
  };

  const getFearGreedColor = (value: number) => {
    const safeValue = value || 50;
    if (safeValue <= 25) return "text-red-600";
    if (safeValue <= 45) return "text-orange-600";
    if (safeValue <= 55) return "text-yellow-600";
    if (safeValue <= 75) return "text-green-600";
    return "text-blue-600";
  };

  const getFearGreedLabel = (value: number) => {
    const safeValue = value || 50;
    if (safeValue <= 25) return "Extreme Fear";
    if (safeValue <= 45) return "Fear";
    if (safeValue <= 55) return "Neutral";
    if (safeValue <= 75) return "Greed";
    return "Extreme Greed";
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Crypto Platform</h1>
          <p className="text-gray-600 mt-1">
            Complete cryptocurrency trading, DeFi, and portfolio management
          </p>
        </div>

        {marketData && (
          <div className="flex items-center gap-6 text-sm">
            <div className="text-center">
              <div className="text-gray-600">Market Cap</div>
              <div className="font-bold">
                {formatCurrency(marketData.globalStats.totalMarketCap)}
              </div>
            </div>
            <div className="text-center">
              <div className="text-gray-600">24h Volume</div>
              <div className="font-bold">
                {formatCurrency(marketData.globalStats.totalVolume24h)}
              </div>
            </div>
            <div className="text-center">
              <div className="text-gray-600">Fear & Greed</div>
              <div
                className={cn(
                  "font-bold",
                  getFearGreedColor(marketData.fearGreedIndex.value),
                )}
              >
                {marketData.fearGreedIndex.value} (
                {getFearGreedLabel(marketData.fearGreedIndex.value)})
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Quick Stats Cards */}
      {marketData && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Globe className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <div className="text-sm text-gray-600">Total Market Cap</div>
                  <div className="text-xl font-bold">
                    {formatCurrency(marketData.globalStats.totalMarketCap)}
                  </div>
                  <div
                    className={cn(
                      "text-sm font-medium",
                      getChangeColor(marketData.globalStats.marketCapChange24h),
                    )}
                  >
                    {formatPercentage(
                      marketData.globalStats.marketCapChange24h,
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <Activity className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <div className="text-sm text-gray-600">24h Volume</div>
                  <div className="text-xl font-bold">
                    {formatCurrency(marketData.globalStats.totalVolume24h)}
                  </div>
                  <div className="text-sm text-gray-600">
                    Across {marketData.globalStats.markets.toLocaleString()}{" "}
                    markets
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-orange-100 rounded-lg">
                  <Target className="h-5 w-5 text-orange-600" />
                </div>
                <div>
                  <div className="text-sm text-gray-600">BTC Dominance</div>
                  <div className="text-xl font-bold">
                    {(marketData.globalStats.btcDominance || 0).toFixed(1)}%
                  </div>
                  <div className="text-sm text-gray-600">
                    ETH: {(marketData.globalStats.ethDominance || 0).toFixed(1)}
                    %
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <Brain className="h-5 w-5 text-purple-600" />
                </div>
                <div>
                  <div className="text-sm text-gray-600">
                    Fear & Greed Index
                  </div>
                  <div
                    className={cn(
                      "text-xl font-bold",
                      getFearGreedColor(marketData.fearGreedIndex.value),
                    )}
                  >
                    {marketData.fearGreedIndex.value}
                  </div>
                  <div
                    className={cn(
                      "text-sm font-medium",
                      getFearGreedColor(marketData.fearGreedIndex.value),
                    )}
                  >
                    {getFearGreedLabel(marketData.fearGreedIndex.value)}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <div className="overflow-x-auto pb-2">
          <TabsList className="min-w-max grid grid-cols-7">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="trading">Trading</TabsTrigger>
            <TabsTrigger value="wallet">Portfolio & Wallet</TabsTrigger>
            <TabsTrigger value="p2p">P2P</TabsTrigger>
            <TabsTrigger value="defi">DeFi</TabsTrigger>
            <TabsTrigger value="news">News</TabsTrigger>
            <TabsTrigger value="education">Learn</TabsTrigger>
          </TabsList>
        </div>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Top Cryptocurrencies */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Top Cryptocurrencies
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {cryptos.slice(0, 10).map((crypto, index) => (
                    <div
                      key={crypto.id}
                      className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-6 text-sm font-medium text-gray-500">
                          #{index + 1}
                        </div>
                        <img
                          src={crypto.image}
                          alt={crypto.name}
                          className="w-8 h-8 rounded-full"
                        />
                        <div>
                          <div className="font-medium">{crypto.name}</div>
                          <div className="text-sm text-gray-600">
                            {crypto.symbol.toUpperCase()}
                          </div>
                        </div>
                      </div>

                      <div className="text-right">
                        <div className="font-semibold">
                          {formatCurrency(crypto.current_price)}
                        </div>
                        <div
                          className={cn(
                            "text-sm",
                            getChangeColor(crypto.price_change_percentage_24h),
                          )}
                        >
                          {formatPercentage(crypto.price_change_percentage_24h)}
                        </div>
                      </div>

                      <div className="text-right text-sm text-gray-600 w-20">
                        <div>Vol: {formatCurrency(crypto.total_volume)}</div>
                        <div>MCap: {formatCurrency(crypto.market_cap)}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Market Sentiment */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Brain className="h-5 w-5" />
                  Market Sentiment
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="text-center">
                    <div
                      className={cn(
                        "text-3xl font-bold",
                        getFearGreedColor(
                          marketData?.fearGreedIndex.value || 50,
                        ),
                      )}
                    >
                      {marketData?.fearGreedIndex.value || 50}
                    </div>
                    <div className="text-sm text-gray-600">
                      Fear & Greed Index
                    </div>
                    <div
                      className={cn(
                        "text-sm font-medium",
                        getFearGreedColor(
                          marketData?.fearGreedIndex.value || 50,
                        ),
                      )}
                    >
                      {getFearGreedLabel(
                        marketData?.fearGreedIndex.value || 50,
                      )}
                    </div>
                  </div>

                  {marketData && (
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Volatility</span>
                        <span className="font-medium">
                          {(
                            marketData.globalStats.dominanceChange24h || 0
                          ).toFixed(1)}
                          %
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Market Volume</span>
                        <span className="font-medium">
                          {formatCurrency(
                            marketData.globalStats.totalVolume24h,
                          )}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Market Movers */}
          {marketData && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-green-600">
                    <TrendingUp className="h-5 w-5" />
                    Top Gainers (24h)
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {marketData.topMovers.gainers.map((crypto) => (
                      <div
                        key={crypto.id}
                        className="flex items-center justify-between"
                      >
                        <div className="flex items-center gap-3">
                          <img
                            src={crypto.image}
                            alt={crypto.name}
                            className="w-6 h-6 rounded-full"
                          />
                          <span className="font-medium">
                            {crypto.symbol.toUpperCase()}
                          </span>
                        </div>
                        <div className="text-right">
                          <div className="font-semibold">
                            {formatCurrency(crypto.current_price)}
                          </div>
                          <div className="text-green-600 text-sm font-medium">
                            {formatPercentage(
                              crypto.price_change_percentage_24h,
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-red-600">
                    <TrendingDown className="h-5 w-5" />
                    Top Losers (24h)
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {marketData.topMovers.losers.map((crypto) => (
                      <div
                        key={crypto.id}
                        className="flex items-center justify-between"
                      >
                        <div className="flex items-center gap-3">
                          <img
                            src={crypto.image}
                            alt={crypto.name}
                            className="w-6 h-6 rounded-full"
                          />
                          <span className="font-medium">
                            {crypto.symbol.toUpperCase()}
                          </span>
                        </div>
                        <div className="text-right">
                          <div className="font-semibold">
                            {formatCurrency(crypto.current_price)}
                          </div>
                          <div className="text-red-600 text-sm font-medium">
                            {formatPercentage(
                              crypto.price_change_percentage_24h,
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Latest News Preview */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="h-5 w-5" />
                Latest Crypto News
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {news.slice(0, 6).map((article) => (
                  <div
                    key={article.id}
                    className="border rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
                  >
                    {article.image && (
                      <img
                        src={article.image}
                        alt={article.title}
                        className="w-full h-32 object-cover rounded mb-3"
                      />
                    )}
                    <div className="space-y-2">
                      <h3 className="font-semibold line-clamp-2">
                        {article.title}
                      </h3>
                      <p className="text-sm text-gray-600 line-clamp-2">
                        {article.summary}
                      </p>
                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <span>{article.source}</span>
                        <span>
                          {new Date(article.publishedAt).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Badge
                          variant={
                            article.sentiment === "POSITIVE"
                              ? "default"
                              : article.sentiment === "NEGATIVE"
                                ? "destructive"
                                : "secondary"
                          }
                          className="text-xs"
                        >
                          {article.sentiment}
                        </Badge>
                        {article.relatedAssets?.map((asset) => (
                          <Badge
                            key={asset}
                            variant="outline"
                            className="text-xs"
                          >
                            {asset}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Unified Trading Tab */}
        <TabsContent value="trading" className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold">Trading Dashboard</h2>
              <p className="text-gray-600">
                Professional trading interface with advanced tools
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">Trading Mode:</span>
              <Select
                value={tradingMode}
                onValueChange={(value: "basic" | "advanced") =>
                  setTradingMode(value)
                }
              >
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="basic">Basic</SelectItem>
                  <SelectItem value="advanced">Advanced</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <EnhancedTradingDashboard
            selectedPair={selectedPair}
            onPairSelect={setSelectedPair}
          />
        </TabsContent>

        {/* Portfolio & Wallet Tab - Consolidated */}
        <TabsContent value="wallet" className="space-y-6">
          <div className="flex items-center gap-2 mb-6">
            <Wallet className="h-6 w-6" />
            <h2 className="text-2xl font-bold">Portfolio & Wallet</h2>
          </div>

          {portfolio ? (
            <div className="space-y-6">
              {/* Portfolio Overview */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <Card className="lg:col-span-2">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <PieChart className="h-5 w-5" />
                      Portfolio Overview
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="text-3xl font-bold">
                            {formatCurrency(portfolio.totalValue)}
                          </div>
                          <div
                            className={cn(
                              "text-lg font-medium",
                              getChangeColor(portfolio.totalChangePercent24h),
                            )}
                          >
                            {formatPercentage(portfolio.totalChangePercent24h)}{" "}
                            (24h)
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm text-gray-600">P&L (24h)</div>
                          <div
                            className={cn(
                              "text-xl font-bold",
                              getChangeColor(portfolio.totalChange24h),
                            )}
                          >
                            {formatCurrency(portfolio.totalChange24h)}
                          </div>
                        </div>
                      </div>

                      <div className="space-y-3">
                        {portfolio.assets.map((asset) => (
                          <div
                            key={asset.asset}
                            className="flex items-center justify-between p-3 rounded-lg bg-gray-50"
                          >
                            <div className="flex items-center gap-3">
                              <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                              <div>
                                <div className="font-medium">{asset.asset}</div>
                                <div className="text-sm text-gray-600">
                                  {asset.total} {asset.asset}
                                </div>
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="font-semibold">
                                {formatCurrency(asset.usdValue)}
                              </div>
                              <div
                                className={cn(
                                  "text-sm",
                                  getChangeColor(asset.changePercent24h),
                                )}
                              >
                                {formatPercentage(asset.changePercent24h)}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Asset Allocation */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <PieChart className="h-5 w-5" />
                      Allocation
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {portfolio.allocation.map((item) => (
                        <div key={item.asset} className="space-y-2">
                          <div className="flex justify-between">
                            <span className="text-sm font-medium">
                              {item.asset}
                            </span>
                            <span className="text-sm">
                              {(item.percentage || 0).toFixed(1)}%
                            </span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                              className="h-2 rounded-full"
                              style={{
                                width: `${item.percentage}%`,
                                backgroundColor: item.color,
                              }}
                            ></div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Wallet Actions */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card>
                  <CardContent className="p-4 text-center">
                    <div className="p-3 bg-green-100 rounded-lg mx-auto w-fit mb-3">
                      <ArrowUpDown className="h-6 w-6 text-green-600" />
                    </div>
                    <h3 className="font-semibold mb-2">Buy Crypto</h3>
                    <p className="text-sm text-gray-600 mb-3">
                      Purchase crypto with credit card or bank transfer
                    </p>
                    <Button className="w-full">Buy Now</Button>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4 text-center">
                    <div className="p-3 bg-blue-100 rounded-lg mx-auto w-fit mb-3">
                      <CreditCard className="h-6 w-6 text-blue-600" />
                    </div>
                    <h3 className="font-semibold mb-2">Deposit</h3>
                    <p className="text-sm text-gray-600 mb-3">
                      Add funds to your wallet
                    </p>
                    <Button variant="outline" className="w-full">
                      Deposit
                    </Button>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4 text-center">
                    <div className="p-3 bg-orange-100 rounded-lg mx-auto w-fit mb-3">
                      <Banknote className="h-6 w-6 text-orange-600" />
                    </div>
                    <h3 className="font-semibold mb-2">Withdraw</h3>
                    <p className="text-sm text-gray-600 mb-3">
                      Transfer funds to external wallet
                    </p>
                    <Button variant="outline" className="w-full">
                      Withdraw
                    </Button>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4 text-center">
                    <div className="p-3 bg-purple-100 rounded-lg mx-auto w-fit mb-3">
                      <TrendingUpIcon className="h-6 w-6 text-purple-600" />
                    </div>
                    <h3 className="font-semibold mb-2">Earn</h3>
                    <p className="text-sm text-gray-600 mb-3">
                      Stake and earn rewards
                    </p>
                    <Button variant="outline" className="w-full">
                      Start Earning
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          ) : (
            <div className="text-center py-12">
              <Wallet className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No Portfolio Data</h3>
              <p className="text-gray-600">
                Start trading to see your portfolio here
              </p>
              <Button className="mt-4">Start Trading</Button>
            </div>
          )}
        </TabsContent>

        {/* P2P Marketplace Tab */}
        <TabsContent value="p2p" className="space-y-6">
          <EnhancedP2PMarketplace />
        </TabsContent>

        {/* DeFi Dashboard Tab */}
        <TabsContent value="defi" className="space-y-6">
          <DeFiDashboard />
        </TabsContent>

        {/* News Tab */}
        <TabsContent value="news" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="h-5 w-5" />
                Crypto News & Analysis
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {news.map((article) => (
                  <div
                    key={article.id}
                    className="border rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
                  >
                    {article.image && (
                      <img
                        src={article.image}
                        alt={article.title}
                        className="w-full h-40 object-cover rounded mb-4"
                      />
                    )}
                    <div className="space-y-3">
                      <h3 className="font-semibold text-lg line-clamp-2">
                        {article.title}
                      </h3>
                      <p className="text-gray-600 line-clamp-3">
                        {article.summary}
                      </p>

                      <div className="flex items-center justify-between text-sm text-gray-500">
                        <div className="flex items-center gap-2">
                          <span>{article.source}</span>
                          <span>•</span>
                          <span>{article.author}</span>
                        </div>
                        <span>
                          {new Date(article.publishedAt).toLocaleDateString()}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <Badge
                          variant={
                            article.sentiment === "POSITIVE"
                              ? "default"
                              : article.sentiment === "NEGATIVE"
                                ? "destructive"
                                : "secondary"
                          }
                        >
                          {article.sentiment}
                        </Badge>
                        {article.relatedAssets?.map((asset) => (
                          <Badge key={asset} variant="outline">
                            {asset}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Education Tab */}
        <TabsContent value="education" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="h-5 w-5" />
                Crypto Education Center
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {educationContent.map((content) => (
                  <div
                    key={content.id}
                    className="border rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
                  >
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline">{content.category}</Badge>
                        <Badge
                          variant={
                            content.difficulty === "BEGINNER"
                              ? "secondary"
                              : content.difficulty === "INTERMEDIATE"
                                ? "default"
                                : "destructive"
                          }
                        >
                          {content.difficulty}
                        </Badge>
                      </div>

                      <h3 className="font-semibold text-lg">{content.title}</h3>
                      <p className="text-gray-600 line-clamp-2">
                        {content.summary}
                      </p>

                      <div className="flex items-center justify-between text-sm text-gray-500">
                        <span>{content.readTime} min read</span>
                        <div className="flex items-center gap-1">
                          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                          <span>{content.rating}</span>
                        </div>
                      </div>

                      {content.tags && (
                        <div className="flex items-center gap-1">
                          {content.tags.slice(0, 3).map((tag) => (
                            <Badge
                              key={tag}
                              variant="outline"
                              className="text-xs"
                            >
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
