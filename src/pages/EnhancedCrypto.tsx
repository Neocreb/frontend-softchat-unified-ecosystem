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
  Globe,
  Activity,
  Target,
  Brain,
  Wallet,
  LineChart,
  BookOpen,
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
        cryptoService.getNews(6),
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
    <div className="mobile-container mobile-space-y">
      {/* Header */}
      <div className="mobile-flex lg:items-start lg:justify-between">
        <div className="min-w-0 flex-1">
          <h1 className="text-xl md:text-2xl lg:text-3xl font-bold truncate">
            Crypto Trading
          </h1>
          <p className="mobile-text text-gray-600 mt-1">
            Trade cryptocurrencies with real-time market data
          </p>
        </div>

        {marketData && (
          <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6 text-sm overflow-x-auto">
            <div className="text-center min-w-0 flex-shrink-0">
              <div className="text-gray-600 text-xs md:text-sm">Market Cap</div>
              <div className="font-bold text-sm md:text-base truncate">
                {formatCurrency(marketData.globalStats.totalMarketCap)}
              </div>
            </div>
            <div className="text-center min-w-0 flex-shrink-0">
              <div className="text-gray-600 text-xs md:text-sm">
                Fear & Greed
              </div>
              <div
                className={cn(
                  "font-bold text-sm md:text-base",
                  getFearGreedColor(marketData?.fearGreedIndex?.value || 50),
                )}
              >
                {marketData?.fearGreedIndex?.value || 50}
                <span className="hidden sm:inline">
                  {" "}
                  ({getFearGreedLabel(marketData?.fearGreedIndex?.value || 50)})
                </span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Quick Stats Cards - Simplified */}
      {marketData && (
        <div className="mobile-grid-2">
          <Card>
            <CardContent className="p-3 md:p-4">
              <div className="flex items-center gap-2 md:gap-3">
                <div className="p-1.5 md:p-2 bg-blue-100 rounded-lg flex-shrink-0">
                  <BarChart3 className="h-4 w-4 md:h-5 md:w-5 text-blue-600" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-xs md:text-sm text-gray-600">
                    Market Cap
                  </div>
                  <div className="text-lg md:text-xl font-bold truncate">
                    {formatCurrency(marketData.globalStats.totalMarketCap)}
                  </div>
                  <div
                    className={cn(
                      "text-xs md:text-sm font-medium",
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
            <CardContent className="p-3 md:p-4">
              <div className="flex items-center gap-2 md:gap-3">
                <div className="p-1.5 md:p-2 bg-green-100 rounded-lg flex-shrink-0">
                  <Activity className="h-4 w-4 md:h-5 md:w-5 text-green-600" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-xs md:text-sm text-gray-600">
                    24h Volume
                  </div>
                  <div className="text-lg md:text-xl font-bold truncate">
                    {formatCurrency(marketData.globalStats.totalVolume24h)}
                  </div>
                  <div className="text-xs md:text-sm text-gray-600 truncate">
                    {marketData.globalStats.markets.toLocaleString()} markets
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-3 md:p-4">
              <div className="flex items-center gap-2 md:gap-3">
                <div className="p-1.5 md:p-2 bg-orange-100 rounded-lg flex-shrink-0">
                  <Target className="h-4 w-4 md:h-5 md:w-5 text-orange-600" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-xs md:text-sm text-gray-600">
                    BTC Dominance
                  </div>
                  <div className="text-lg md:text-xl font-bold">
                    {(marketData.globalStats.btcDominance || 0).toFixed(1)}%
                  </div>
                  <div className="text-xs md:text-sm text-gray-600">
                    ETH: {(marketData.globalStats.ethDominance || 0).toFixed(1)}
                    %
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-3 md:p-4">
              <div className="flex items-center gap-2 md:gap-3">
                <div className="p-1.5 md:p-2 bg-purple-100 rounded-lg flex-shrink-0">
                  <Brain className="h-4 w-4 md:h-5 md:w-5 text-purple-600" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-xs md:text-sm text-gray-600">
                    Fear & Greed
                  </div>
                  <div
                    className={cn(
                      "text-lg md:text-xl font-bold",
                      getFearGreedColor(
                        marketData?.fearGreedIndex?.value || 50,
                      ),
                    )}
                  >
                    {marketData?.fearGreedIndex?.value || 50}
                  </div>
                  <div
                    className={cn(
                      "text-xs md:text-sm font-medium truncate",
                      getFearGreedColor(
                        marketData?.fearGreedIndex?.value || 50,
                      ),
                    )}
                  >
                    {getFearGreedLabel(marketData?.fearGreedIndex?.value || 50)}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        {/* Simplified tab list */}
        <div className="w-full mobile-tabs">
          <div className="border-b border-gray-200">
            <TabsList className="inline-flex h-auto bg-transparent min-w-max p-0 gap-1">
              <TabsTrigger
                value="overview"
                className="mobile-tab data-[state=active]:border-b-2 data-[state=active]:border-blue-500 data-[state=active]:bg-transparent rounded-none touch-target"
              >
                Overview
              </TabsTrigger>
              <TabsTrigger
                value="trading"
                className="mobile-tab data-[state=active]:border-b-2 data-[state=active]:border-blue-500 data-[state=active]:bg-transparent rounded-none touch-target"
              >
                Trading
              </TabsTrigger>
              <TabsTrigger
                value="portfolio"
                className="mobile-tab data-[state=active]:border-b-2 data-[state=active]:border-blue-500 data-[state=active]:bg-transparent rounded-none touch-target"
              >
                Portfolio
              </TabsTrigger>
              <TabsTrigger
                value="learn"
                className="mobile-tab data-[state=active]:border-b-2 data-[state=active]:border-blue-500 data-[state=active]:bg-transparent rounded-none touch-target"
              >
                Learn
              </TabsTrigger>
            </TabsList>
          </div>
        </div>

        {/* Overview Tab */}
        <TabsContent value="overview" className="mobile-space-y mt-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
            {/* Top Cryptocurrencies */}
            <Card className="lg:col-span-2">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-base md:text-lg">
                  <TrendingUp className="h-4 w-4 md:h-5 md:w-5" />
                  Top Cryptocurrencies
                </CardTitle>
              </CardHeader>
              <CardContent className="px-3 md:px-6">
                <div className="space-y-2 md:space-y-3">
                  {cryptos.slice(0, 8).map((crypto, index) => (
                    <div
                      key={crypto.id}
                      className="flex items-center justify-between p-2 md:p-3 rounded-lg hover:bg-gray-50"
                    >
                      <div className="flex items-center gap-2 md:gap-3 min-w-0 flex-1">
                        <div className="w-4 md:w-6 text-xs md:text-sm font-medium text-gray-500 flex-shrink-0">
                          #{index + 1}
                        </div>
                        <img
                          src={crypto.image}
                          alt={crypto.name}
                          className="w-6 h-6 md:w-8 md:h-8 rounded-full flex-shrink-0"
                        />
                        <div className="min-w-0 flex-1">
                          <div className="font-medium text-sm md:text-base truncate">
                            {crypto.name}
                          </div>
                          <div className="text-xs md:text-sm text-gray-600">
                            {crypto.symbol.toUpperCase()}
                          </div>
                        </div>
                      </div>

                      <div className="text-right min-w-0 flex-shrink-0">
                        <div className="font-semibold text-sm md:text-base">
                          {formatCurrency(crypto.current_price)}
                        </div>
                        <div
                          className={cn(
                            "text-xs md:text-sm",
                            getChangeColor(crypto.price_change_percentage_24h),
                          )}
                        >
                          {formatPercentage(crypto.price_change_percentage_24h)}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Market Sentiment */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-base md:text-lg">
                  <Brain className="h-4 w-4 md:h-5 md:w-5" />
                  Market Sentiment
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="text-center">
                    <div
                      className={cn(
                        "text-2xl md:text-3xl font-bold",
                        getFearGreedColor(
                          marketData?.fearGreedIndex.value || 50,
                        ),
                      )}
                    >
                      {marketData?.fearGreedIndex.value || 50}
                    </div>
                    <div className="text-xs md:text-sm text-gray-600">
                      Fear & Greed Index
                    </div>
                    <div
                      className={cn(
                        "text-xs md:text-sm font-medium",
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
                      <div className="flex justify-between text-xs md:text-sm">
                        <span>24h Volume</span>
                        <span className="font-medium truncate ml-2">
                          {formatCurrency(
                            marketData.globalStats.totalVolume24h,
                          )}
                        </span>
                      </div>
                      <div className="flex justify-between text-xs md:text-sm">
                        <span>Active Markets</span>
                        <span className="font-medium">
                          {marketData.globalStats.markets.toLocaleString()}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Market Movers - Simplified */}
          {marketData && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-green-600 text-base md:text-lg">
                    <TrendingUp className="h-4 w-4 md:h-5 md:w-5" />
                    Top Gainers (24h)
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 md:space-y-3">
                    {marketData.topMovers.gainers.slice(0, 4).map((crypto) => (
                      <div
                        key={crypto.id}
                        className="flex items-center justify-between"
                      >
                        <div className="flex items-center gap-2 md:gap-3 min-w-0 flex-1">
                          <img
                            src={crypto.image}
                            alt={crypto.name}
                            className="w-5 h-5 md:w-6 md:h-6 rounded-full flex-shrink-0"
                          />
                          <span className="font-medium text-sm md:text-base truncate">
                            {crypto.symbol.toUpperCase()}
                          </span>
                        </div>
                        <div className="text-right flex-shrink-0">
                          <div className="font-semibold text-sm md:text-base">
                            {formatCurrency(crypto.current_price)}
                          </div>
                          <div className="text-green-600 text-xs md:text-sm font-medium">
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
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-red-600 text-base md:text-lg">
                    <TrendingDown className="h-4 w-4 md:h-5 md:w-5" />
                    Top Losers (24h)
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 md:space-y-3">
                    {marketData.topMovers.losers.slice(0, 4).map((crypto) => (
                      <div
                        key={crypto.id}
                        className="flex items-center justify-between"
                      >
                        <div className="flex items-center gap-2 md:gap-3 min-w-0 flex-1">
                          <img
                            src={crypto.image}
                            alt={crypto.name}
                            className="w-5 h-5 md:w-6 md:h-6 rounded-full flex-shrink-0"
                          />
                          <span className="font-medium text-sm md:text-base truncate">
                            {crypto.symbol.toUpperCase()}
                          </span>
                        </div>
                        <div className="text-right flex-shrink-0">
                          <div className="font-semibold text-sm md:text-base">
                            {formatCurrency(crypto.current_price)}
                          </div>
                          <div className="text-red-600 text-xs md:text-sm font-medium">
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

          {/* Latest News - Simplified */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base md:text-lg">
                <Globe className="h-4 w-4 md:h-5 md:w-5" />
                Latest Crypto News
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {news.map((article) => (
                  <div
                    key={article.id}
                    className="border rounded-lg p-3 md:p-4 hover:shadow-md transition-shadow cursor-pointer"
                  >
                    {article.image && (
                      <img
                        src={article.image}
                        alt={article.title}
                        className="w-full h-24 md:h-28 object-cover rounded mb-3"
                      />
                    )}
                    <div className="space-y-2">
                      <h3 className="font-semibold text-sm md:text-base line-clamp-2">
                        {article.title}
                      </h3>
                      <p className="text-xs md:text-sm text-gray-600 line-clamp-2">
                        {article.summary}
                      </p>
                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <span className="truncate flex-1 mr-2">
                          {article.source}
                        </span>
                        <span className="flex-shrink-0">
                          {new Date(article.publishedAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Trading Tab */}
        <TabsContent value="trading" className="mobile-space-y mt-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h2 className="text-xl md:text-2xl font-bold">
                Trading Dashboard
              </h2>
              <p className="text-sm md:text-base text-gray-600">
                Professional trading interface
              </p>
            </div>
          </div>

          <EnhancedTradingDashboard
            selectedPair={selectedPair}
            onPairSelect={setSelectedPair}
          />
        </TabsContent>

        {/* Portfolio Tab - Simplified */}
        <TabsContent value="portfolio" className="mobile-space-y mt-4">
          <div className="flex items-center gap-2 mb-4 md:mb-6">
            <Wallet className="h-5 w-5 md:h-6 md:w-6" />
            <h2 className="text-xl md:text-2xl font-bold">Portfolio</h2>
          </div>

          {portfolio ? (
            <div className="space-y-4 md:space-y-6">
              {/* Portfolio Overview */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-base md:text-lg">
                    <LineChart className="h-4 w-4 md:h-5 md:w-5" />
                    Portfolio Overview
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4 md:space-y-6">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                      <div>
                        <div className="text-2xl md:text-3xl font-bold">
                          {formatCurrency(portfolio.totalValue)}
                        </div>
                        <div
                          className={cn(
                            "text-base md:text-lg font-medium",
                            getChangeColor(portfolio.totalChangePercent24h),
                          )}
                        >
                          {formatPercentage(portfolio.totalChangePercent24h)}{" "}
                          (24h)
                        </div>
                      </div>
                      <div className="text-left sm:text-right">
                        <div className="text-xs md:text-sm text-gray-600">
                          P&L (24h)
                        </div>
                        <div
                          className={cn(
                            "text-lg md:text-xl font-bold",
                            getChangeColor(portfolio.totalChange24h),
                          )}
                        >
                          {formatCurrency(portfolio.totalChange24h)}
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2 md:space-y-3">
                      {portfolio.assets.slice(0, 5).map((asset) => (
                        <div
                          key={asset.asset}
                          className="flex items-center justify-between p-2 md:p-3 rounded-lg bg-gray-50"
                        >
                          <div className="flex items-center gap-2 md:gap-3 min-w-0 flex-1">
                            <div className="w-2 h-2 rounded-full bg-blue-500 flex-shrink-0"></div>
                            <div className="min-w-0">
                              <div className="font-medium text-sm md:text-base">
                                {asset.asset}
                              </div>
                              <div className="text-xs md:text-sm text-gray-600 truncate">
                                {asset.total} {asset.asset}
                              </div>
                            </div>
                          </div>
                          <div className="text-right flex-shrink-0">
                            <div className="font-semibold text-sm md:text-base">
                              {formatCurrency(asset.usdValue)}
                            </div>
                            <div
                              className={cn(
                                "text-xs md:text-sm",
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
            </div>
          ) : (
            <div className="text-center py-8 md:py-12">
              <Wallet className="h-10 w-10 md:h-12 md:w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-base md:text-lg font-semibold mb-2">
                No Portfolio Data
              </h3>
              <p className="text-sm md:text-base text-gray-600">
                Start trading to see your portfolio here
              </p>
              <Button className="mt-4">Start Trading</Button>
            </div>
          )}
        </TabsContent>

        {/* Learn Tab - Educational Content */}
        <TabsContent value="learn" className="mobile-space-y mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base md:text-lg">
                <BookOpen className="h-4 w-4 md:h-5 md:w-5" />
                Crypto Education
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                {educationContent.slice(0, 6).map((content) => (
                  <div
                    key={content.id}
                    className="border rounded-lg p-3 md:p-4 hover:shadow-md transition-shadow cursor-pointer"
                  >
                    <div className="space-y-2 md:space-y-3">
                      <div className="flex items-center gap-1 md:gap-2 flex-wrap">
                        <Badge variant="outline" className="text-xs">
                          {content.category}
                        </Badge>
                        <Badge
                          variant={
                            content.difficulty === "BEGINNER"
                              ? "secondary"
                              : content.difficulty === "INTERMEDIATE"
                                ? "default"
                                : "destructive"
                          }
                          className="text-xs"
                        >
                          {content.difficulty}
                        </Badge>
                      </div>

                      <h3 className="font-semibold text-base md:text-lg line-clamp-2">
                        {content.title}
                      </h3>
                      <p className="text-sm md:text-base text-gray-600 line-clamp-2">
                        {content.summary}
                      </p>

                      <div className="flex items-center justify-between text-xs md:text-sm text-gray-500">
                        <span>{content.readTime} min read</span>
                        <div className="flex items-center gap-1">
                          <span>⭐ {content.rating}</span>
                        </div>
                      </div>
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
