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
import AdvancedTradingInterface from "@/components/crypto/AdvancedTradingInterface";
import { cn } from "@/lib/utils";

// Keep existing components for compatibility
import CryptoChart from "@/components/crypto/CryptoChart";
import CryptoList from "@/components/crypto/CryptoList";
import CryptoPortfolio from "@/components/crypto/CryptoPortfolio";
import SoftPointExchange from "@/components/crypto/SoftPointExchange";
import CryptoWalletActions from "@/components/crypto/CryptoWalletActions";

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
    return `${value >= 0 ? "+" : ""}${value.toFixed(2)}%`;
  };

  const getChangeColor = (value: number) => {
    return value >= 0 ? "text-green-600" : "text-red-600";
  };

  const getFearGreedColor = (value: number) => {
    if (value <= 25) return "text-red-600";
    if (value <= 45) return "text-orange-600";
    if (value <= 55) return "text-yellow-600";
    if (value <= 75) return "text-green-600";
    return "text-blue-600";
  };

  const getFearGreedLabel = (value: number) => {
    if (value <= 25) return "Extreme Fear";
    if (value <= 45) return "Fear";
    if (value <= 55) return "Neutral";
    if (value <= 75) return "Greed";
    return "Extreme Greed";
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Enhanced Crypto Platform</h1>
          <p className="text-gray-600 mt-1">
            Complete cryptocurrency trading, DeFi, and education platform
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
                    {marketData.globalStats.btcDominance.toFixed(1)}%
                  </div>
                  <div className="text-sm text-gray-600">
                    ETH: {marketData.globalStats.ethDominance.toFixed(1)}%
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
          <TabsList className="min-w-max grid grid-cols-10">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="trading">Trading</TabsTrigger>
            <TabsTrigger value="advanced">Pro Trading</TabsTrigger>
            <TabsTrigger value="p2p">P2P</TabsTrigger>
            <TabsTrigger value="defi">DeFi</TabsTrigger>
            <TabsTrigger value="portfolio">Portfolio</TabsTrigger>
            <TabsTrigger value="news">News</TabsTrigger>
            <TabsTrigger value="education">Learn</TabsTrigger>
            <TabsTrigger value="wallet">Wallet</TabsTrigger>
            <TabsTrigger value="legacy">Legacy</TabsTrigger>
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

            {/* Portfolio Summary */}
            {portfolio && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <PieChart className="h-5 w-5" />
                    Portfolio Summary
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="text-center">
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

                    <div className="space-y-3">
                      {portfolio.assets.slice(0, 3).map((asset) => (
                        <div
                          key={asset.asset}
                          className="flex items-center justify-between"
                        >
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                            <span className="font-medium">{asset.asset}</span>
                          </div>
                          <div className="text-right">
                            <div className="font-semibold">
                              {formatCurrency(asset.usdValue)}
                            </div>
                            <div className="text-sm text-gray-600">
                              {asset.allocation.toFixed(1)}%
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    <Button
                      className="w-full"
                      onClick={() => setActiveTab("portfolio")}
                    >
                      View Full Portfolio
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
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

          {/* Latest News */}
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

        {/* Trading Dashboard Tab */}
        <TabsContent value="trading" className="space-y-6">
          <EnhancedTradingDashboard
            selectedPair={selectedPair}
            onPairSelect={setSelectedPair}
          />
        </TabsContent>

        {/* Advanced Trading Tab */}
        <TabsContent value="advanced" className="space-y-6">
          <AdvancedTradingInterface />
        </TabsContent>

        {/* P2P Marketplace Tab */}
        <TabsContent value="p2p" className="space-y-6">
          <EnhancedP2PMarketplace />
        </TabsContent>

        {/* DeFi Dashboard Tab */}
        <TabsContent value="defi" className="space-y-6">
          <DeFiDashboard />
        </TabsContent>

        {/* Portfolio Tab */}
        <TabsContent value="portfolio" className="space-y-6">
          {portfolio ? (
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
                            <div
                              className="w-2 h-2 rounded-full"
                              style={{ backgroundColor: "#F7931A" }}
                            ></div>
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

              <Card>
                <CardHeader>
                  <CardTitle>Asset Allocation</CardTitle>
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
                            {item.percentage.toFixed(1)}%
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
          ) : (
            <Card>
              <CardContent className="p-12 text-center">
                <PieChart className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">
                  No Portfolio Data
                </h3>
                <p className="text-gray-600 mb-4">
                  Start trading to see your portfolio here
                </p>
                <Button onClick={() => setActiveTab("trading")}>
                  Start Trading
                </Button>
              </CardContent>
            </Card>
          )}
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
                Crypto Education Hub
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {educationContent.map((content) => (
                  <Card
                    key={content.id}
                    className="hover:shadow-md transition-shadow cursor-pointer"
                  >
                    {content.thumbnail && (
                      <img
                        src={content.thumbnail}
                        alt={content.title}
                        className="w-full h-32 object-cover rounded-t-lg"
                      />
                    )}
                    <CardContent className="p-4">
                      <div className="space-y-3">
                        <div className="flex items-center gap-2">
                          <Badge
                            variant={
                              content.level === "BEGINNER"
                                ? "default"
                                : content.level === "INTERMEDIATE"
                                  ? "secondary"
                                  : "destructive"
                            }
                          >
                            {content.level}
                          </Badge>
                          <Badge variant="outline">{content.type}</Badge>
                        </div>

                        <h3 className="font-semibold line-clamp-2">
                          {content.title}
                        </h3>
                        <p className="text-sm text-gray-600 line-clamp-2">
                          {content.description}
                        </p>

                        <div className="flex items-center justify-between text-sm text-gray-500">
                          <div className="flex items-center gap-4">
                            <div className="flex items-center gap-1">
                              <Eye className="h-4 w-4" />
                              <span>{content.views.toLocaleString()}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                              <span>{content.rating.toFixed(1)}</span>
                            </div>
                          </div>
                          {content.duration && (
                            <div className="flex items-center gap-1">
                              <Clock className="h-4 w-4" />
                              <span>{content.duration}min</span>
                            </div>
                          )}
                        </div>

                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">
                            By {content.author}
                          </span>
                          <Button size="sm">
                            {content.type === "VIDEO" ? "Watch" : "Read"}
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Wallet Tab */}
        <TabsContent value="wallet" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <CryptoWalletActions onKYCSubmit={() => {}} />
            <SoftPointExchange />
          </div>
        </TabsContent>

        {/* Legacy Tab - Keep existing components for backward compatibility */}
        <TabsContent value="legacy" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            <div className="lg:col-span-1">
              <CryptoList
                cryptos={cryptos}
                selectedCryptoId={cryptos[0]?.id || ""}
                onSelectCrypto={() => {}}
                isLoading={isLoading}
              />
            </div>

            <div className="lg:col-span-2">
              {cryptos[0] && <CryptoChart crypto={cryptos[0]} />}
            </div>

            <div className="lg:col-span-1">
              <CryptoPortfolio />
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
