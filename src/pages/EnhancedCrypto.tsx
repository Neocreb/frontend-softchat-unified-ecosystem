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
import { Input } from "@/components/ui/input";
import {
  TrendingUp,
  TrendingDown,
  BarChart3,
  Globe,
  Activity,
  Target,
  Brain,
  Wallet,
  ArrowUpDown,
  Plus,
  Minus,
  PieChart,
  BookOpen,
  CreditCard,
  Banknote,
  Users,
  Shield,
  Clock,
  Star,
  DollarSign,
} from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { cryptoService } from "@/services/cryptoService";
import { blogService } from "@/services/blogService";
import {
  Cryptocurrency,
  MarketData,
  Portfolio,
  OrderBook,
  Trade,
  News,
  EducationContent,
} from "@/types/crypto";
import { BlogPost } from "@/types/blog";
import { SmartContentRecommendations } from "@/components/ai/SmartContentRecommendations";
import RealTimePriceDisplay from "@/components/crypto/RealTimePriceDisplay";
import EnhancedP2PMarketplace from "@/components/crypto/EnhancedP2PMarketplace";
import { cn } from "@/lib/utils";

export default function EnhancedCrypto() {
  const [activeTab, setActiveTab] = useState("overview");
  const [cryptos, setCryptos] = useState<Cryptocurrency[]>([]);
  const [marketData, setMarketData] = useState<MarketData | null>(null);
  const [portfolio, setPortfolio] = useState<Portfolio | null>(null);
  const [orderBook, setOrderBook] = useState<OrderBook | null>(null);
  const [recentTrades, setRecentTrades] = useState<Trade[]>([]);
  const [news, setNews] = useState<News[]>([]);
  const [educationContent, setEducationContent] = useState<EducationContent[]>(
    [],
  );
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [selectedPair, setSelectedPair] = useState("BTCUSDT");
  const [orderType, setOrderType] = useState("limit");
  const [side, setSide] = useState<"buy" | "sell">("buy");
  const [price, setPrice] = useState("");
  const [amount, setAmount] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());

  const { toast } = useToast();

  useEffect(() => {
    loadCryptoData();
    // Set up real-time updates every 30 seconds
    const interval = setInterval(updateRealTimeData, 30000);
    return () => clearInterval(interval);
  }, [selectedPair]);

  // More frequent updates for price display (every 10 seconds)
  useEffect(() => {
    const priceUpdateInterval = setInterval(updatePricesOnly, 10000);
    return () => clearInterval(priceUpdateInterval);
  }, [cryptos]);

  const loadCryptoData = async () => {
    setIsLoading(true);
    try {
      const [
        cryptosData,
        marketDataResult,
        portfolioData,
        orderBookData,
        tradesData,
        newsData,
        educationData,
        blogPostsData,
      ] = await Promise.all([
        cryptoService.getCryptocurrencies(20),
        cryptoService.getMarketData(),
        cryptoService.getPortfolio(),
        cryptoService.getOrderBook(selectedPair),
        cryptoService.getRecentTrades(selectedPair, 10),
        cryptoService.getNews(6),
        cryptoService.getEducationContent(),
        blogService.getCryptoLearningPosts(4),
      ]);

      setCryptos(cryptosData);
      setMarketData(marketDataResult);
      setPortfolio(portfolioData);
      setOrderBook(orderBookData);
      setRecentTrades(tradesData);
      setNews(newsData);
      setEducationContent(educationData);
      setBlogPosts(blogPostsData);
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

  const updateRealTimeData = async () => {
    try {
      const [
        newOrderBook,
        newTrades,
      ] = await Promise.all([
        cryptoService.getOrderBook(selectedPair),
        cryptoService.getRecentTrades(selectedPair, 5),
      ]);

      setOrderBook(newOrderBook);
      setRecentTrades((prev) => [...newTrades, ...prev].slice(0, 20));
      setLastUpdated(new Date());
    } catch (error) {
      console.error("Failed to update real-time data:", error);
    }
  };

  // Update only cryptocurrency prices for more frequent updates
  const updatePricesOnly = async () => {
    try {
      if (cryptos.length === 0) return;

      // Get coin IDs for price updates
      const coinIds = cryptos.slice(0, 20).map(crypto => crypto.id);
      const priceUpdates = await cryptoService.getRealTimePrice(coinIds);

      // Update crypto prices
      setCryptos(prevCryptos =>
        prevCryptos.map(crypto => {
          const priceData = priceUpdates[crypto.id];
          if (priceData) {
            return {
              ...crypto,
              current_price: priceData.usd,
              price_change_percentage_24h: priceData.usd_24h_change,
              last_updated: new Date().toISOString()
            };
          }
          return crypto;
        })
      );

      // Update market data less frequently
      if (Math.random() < 0.3) { // 30% chance to update market data
        const newMarketData = await cryptoService.getMarketData();
        setMarketData(newMarketData);
      }

    } catch (error) {
      console.error("Failed to update prices:", error);
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

  const getCurrentPair = () => {
    return cryptos.find(
      (c) => c.symbol.toUpperCase() + "USDT" === selectedPair,
    );
  };

  const currentPair = getCurrentPair();

  const handlePlaceOrder = () => {
    if (!price || !amount) {
      toast({
        title: "Invalid Order",
        description: "Please enter both price and amount",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Order Placed",
      description: `${side.toUpperCase()} order for ${amount} ${selectedPair.replace("USDT", "")} at $${price}`,
    });

    setPrice("");
    setAmount("");
  };

  return (
    <div className="mobile-container mobile-space-y">
      {/* Header */}
      <div className="mobile-flex lg:items-start lg:justify-between">
        <div className="min-w-0 flex-1">
          <h1 className="text-xl md:text-2xl lg:text-3xl font-bold truncate">
            Crypto Platform
          </h1>
          <p className="mobile-text text-gray-600 mt-1">
            Complete cryptocurrency trading and portfolio management
          </p>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        {/* Tab Navigation */}
        <div className="w-full mobile-tabs">
          <div className="border-b border-gray-200">
            <TabsList className="inline-flex h-auto bg-transparent min-w-max p-0 gap-1">
              <TabsTrigger
                value="overview"
                className="mobile-tab data-[state=active]:border-b-2 data-[state=active]:border-blue-500 data-[state=active]:bg-transparent rounded-none touch-target"
              >
                Overview/Portfolio
              </TabsTrigger>
              <TabsTrigger
                value="trading"
                className="mobile-tab data-[state=active]:border-b-2 data-[state=active]:border-blue-500 data-[state=active]:bg-transparent rounded-none touch-target"
              >
                Trading
              </TabsTrigger>
              <TabsTrigger
                value="p2p"
                className="mobile-tab data-[state=active]:border-b-2 data-[state=active]:border-blue-500 data-[state=active]:bg-transparent rounded-none touch-target"
              >
                P2P
              </TabsTrigger>
              <TabsTrigger
                value="learn"
                className="mobile-tab data-[state=active]:border-b-2 data-[state=active]:border-blue-500 data-[state=active]:bg-transparent rounded-none touch-target"
              >
                Learn & News
              </TabsTrigger>
            </TabsList>
          </div>
        </div>

        {/* Overview/Portfolio Tab */}
        <TabsContent value="overview" className="mobile-space-y mt-4">
          {/* Portfolio Overview & Quick Actions */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
            {/* Portfolio Summary */}
            <Card className="lg:col-span-2">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-base md:text-lg">
                  <PieChart className="h-4 w-4 md:h-5 md:w-5" />
                  My Portfolio
                </CardTitle>
              </CardHeader>
              <CardContent>
                {portfolio ? (
                  <div className="space-y-6">
                    <div className="text-center p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg">
                      <div className="text-3xl md:text-4xl font-bold mb-1">
                        {formatCurrency(portfolio.totalValue)}
                      </div>
                      <div
                        className={cn(
                          "text-base font-medium flex items-center justify-center gap-1",
                          getChangeColor(portfolio.totalChangePercent24h),
                        )}
                      >
                        {portfolio.totalChangePercent24h >= 0 ? (
                          <TrendingUp className="h-4 w-4" />
                        ) : (
                          <TrendingDown className="h-4 w-4" />
                        )}
                        {formatPercentage(portfolio.totalChangePercent24h)}{" "}
                        (24h)
                      </div>
                      <p className="text-sm text-gray-600 mt-1">
                        Total Portfolio Value
                      </p>
                    </div>

                    <div className="space-y-3">
                      <h4 className="font-semibold text-sm text-gray-700">
                        Holdings
                      </h4>
                      {portfolio.assets.slice(0, 6).map((asset) => (
                        <div
                          key={asset.asset}
                          className="flex items-center justify-between p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors"
                        >
                          <div className="flex items-center gap-3 min-w-0 flex-1">
                            <div className="w-3 h-3 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex-shrink-0"></div>
                            <div className="min-w-0">
                              <div className="font-medium text-sm">
                                {asset.asset}
                              </div>
                              <div className="text-xs text-gray-600 truncate">
                                {asset.total} {asset.asset}
                              </div>
                            </div>
                          </div>
                          <div className="text-right flex-shrink-0">
                            <div className="font-semibold text-sm">
                              {formatCurrency(asset.usdValue)}
                            </div>
                            <div
                              className={cn(
                                "text-xs",
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
                ) : (
                  <div className="text-center py-12">
                    <PieChart className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">
                      Start Your Crypto Journey
                    </h3>
                    <p className="text-sm text-gray-600 mb-4">
                      Begin trading to build your portfolio
                    </p>
                    <Button size="lg" className="px-8">
                      <Plus className="h-4 w-4 mr-2" />
                      Start Trading
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Quick Actions Cards */}
            <div className="space-y-4">
              {/* Deposit Card */}
              <Card className="border-2 border-green-100 hover:border-green-200 transition-colors cursor-pointer">
                <CardContent className="p-4">
                  <div className="text-center space-y-3">
                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                      <ArrowUpDown className="h-6 w-6 text-green-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-green-700">
                        Deposit Crypto
                      </h3>
                      <p className="text-xs text-gray-600 mt-1">
                        Add funds to your wallet
                      </p>
                    </div>
                    <Button
                      className="w-full bg-green-600 hover:bg-green-700"
                      size="sm"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Deposit
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Withdraw Card */}
              <Card className="border-2 border-blue-100 hover:border-blue-200 transition-colors cursor-pointer">
                <CardContent className="p-4">
                  <div className="text-center space-y-3">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
                      <CreditCard className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-blue-700">
                        Withdraw Crypto
                      </h3>
                      <p className="text-xs text-gray-600 mt-1">
                        Transfer to external wallet
                      </p>
                    </div>
                    <Button
                      className="w-full bg-blue-600 hover:bg-blue-700"
                      size="sm"
                    >
                      <Minus className="h-4 w-4 mr-2" />
                      Withdraw
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Buy Crypto Card */}
              <Card className="border-2 border-purple-100 hover:border-purple-200 transition-colors cursor-pointer">
                <CardContent className="p-4">
                  <div className="text-center space-y-3">
                    <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto">
                      <DollarSign className="h-6 w-6 text-purple-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-purple-700">
                        Buy Crypto
                      </h3>
                      <p className="text-xs text-gray-600 mt-1">
                        Purchase with fiat currency
                      </p>
                    </div>
                    <Button
                      className="w-full bg-purple-600 hover:bg-purple-700"
                      size="sm"
                    >
                      <Banknote className="h-4 w-4 mr-2" />
                      Buy Now
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Top Cryptocurrencies */}
          <Card>
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
                    className="flex items-center justify-between p-2 md:p-3 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                    onClick={() =>
                      setSelectedPair(crypto.symbol.toUpperCase() + "USDT")
                    }
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
                      <RealTimePriceDisplay
                        price={crypto.current_price}
                        change24h={crypto.price_change_percentage_24h}
                        symbol={crypto.symbol}
                        showSymbol={false}
                        size="sm"
                        className="justify-end"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Market Movers */}
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

          {/* Market Stats - Moved to Bottom */}
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
                          getChangeColor(
                            marketData.globalStats.marketCapChange24h,
                          ),
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
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-3 md:p-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h2 className="text-xl md:text-2xl font-bold">
                Cryptocurrency Overview
              </h2>
              <div className="flex items-center gap-2">
                <p className="text-sm md:text-base text-gray-600">
                  Real-time market data and analytics
                </p>
                <div className="flex items-center gap-1 text-xs text-green-600">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span>Live</span>
                </div>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Last updated: {lastUpdated.toLocaleTimeString()}
              </p>
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
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </TabsContent>

        {/* Trading Tab */}
        <TabsContent value="trading" className="mobile-space-y mt-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h2 className="text-xl md:text-2xl font-bold">
                Trading Dashboard
              </h2>
              <div className="flex items-center gap-2">
                <p className="text-sm md:text-base text-gray-600">
                  Professional trading interface
                </p>
                <div className="flex items-center gap-1 text-xs text-blue-600">
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                  <span>Real-time</span>
                </div>
              </div>
            </div>
            {currentPair && (
              <div className="flex items-center gap-3 flex-shrink-0">
                <Badge variant="outline" className="text-lg px-3 py-1">
                  {currentPair.symbol.toUpperCase()}/USDT
                </Badge>
                <div className="text-right">
                  <div className="text-xl md:text-2xl font-bold">
                    {formatCurrency(currentPair.current_price)}
                  </div>
                  <div
                    className={cn(
                      "text-sm font-medium flex items-center gap-1",
                      getChangeColor(currentPair.price_change_percentage_24h),
                    )}
                  >
                    {currentPair.price_change_percentage_24h >= 0 ? (
                      <TrendingUp className="h-4 w-4" />
                    ) : (
                      <TrendingDown className="h-4 w-4" />
                    )}
                    {formatPercentage(currentPair.price_change_percentage_24h)}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* AI Trading Recommendations */}
          <SmartContentRecommendations
            contentType="mixed"
            availableContent={[...cryptos, ...news]}
            onContentSelect={(content) => {
              if (content.symbol) {
                // Crypto selected - find the matching crypto and update current pair
                const selectedCrypto = cryptos.find(c => c.id === content.id);
                if (selectedCrypto) {
                  setSelectedPair(selectedCrypto.symbol.toUpperCase() + 'USDT');
                }
              } else {
                // News article selected
                console.log('Selected news:', content);
              }
            }}
            maxItems={3}
            className="mb-6"
            layout="carousel"
            showReasons={true}
          />

          <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 md:gap-6">
            {/* Order Book */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base md:text-lg">
                  Order Book & Trades
                </CardTitle>
              </CardHeader>
              <CardContent className="px-3 md:px-6">
                {orderBook ? (
                  <div className="space-y-3">
                    {/* Asks */}
                    <div>
                      <div className="text-xs font-medium text-gray-600 mb-1">
                        Asks
                      </div>
                      <div className="space-y-1">
                        {orderBook.asks.slice(0, 5).map((ask, index) => (
                          <div
                            key={index}
                            className="flex justify-between text-xs"
                          >
                            <span className="text-red-600 font-mono">
                              {ask.price.toFixed(2)}
                            </span>
                            <span className="font-mono">
                              {ask.quantity.toFixed(4)}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Current Price */}
                    {currentPair && (
                      <div className="text-center py-2 border-y">
                        <div className="text-base font-bold">
                          {formatCurrency(currentPair.current_price)}
                        </div>
                      </div>
                    )}

                    {/* Bids */}
                    <div>
                      <div className="text-xs font-medium text-gray-600 mb-1">
                        Bids
                      </div>
                      <div className="space-y-1">
                        {orderBook.bids.slice(0, 5).map((bid, index) => (
                          <div
                            key={index}
                            className="flex justify-between text-xs"
                          >
                            <span className="text-green-600 font-mono">
                              {bid.price.toFixed(2)}
                            </span>
                            <span className="font-mono">
                              {bid.quantity.toFixed(4)}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Recent Trades */}
                    <div className="pt-3 border-t">
                      <div className="text-xs font-medium text-gray-600 mb-2">
                        Recent Trades
                      </div>
                      <div className="space-y-1 max-h-32 overflow-y-auto">
                        {recentTrades.slice(0, 8).map((trade, index) => (
                          <div
                            key={index}
                            className="flex justify-between text-xs"
                          >
                            <span className="text-gray-600">
                              {trade.timestamp}
                            </span>
                            <span
                              className={
                                trade.side === "buy"
                                  ? "text-green-600"
                                  : "text-red-600"
                              }
                            >
                              ${trade.price.toFixed(2)}
                            </span>
                            <span>{trade.amount.toFixed(4)}</span>
                          </div>
                        ))}
                      </div>
              </CardContent>
            </Card>

            {/* Trading Panel */}
            <Card className="xl:col-span-2">
              <CardHeader className="pb-3">
                <CardTitle className="text-base md:text-lg">
                  Place Order
                </CardTitle>
              </CardHeader>
              <CardContent className="px-3 md:px-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Buy Panel */}
                  <div className="space-y-4">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-green-600 rounded-full"></div>
                      <h3 className="font-semibold text-green-600">
                        Buy {selectedPair.replace("USDT", "")}
                      </h3>
                    </div>

                    <div>
                      <label className="text-xs font-medium mb-1 block">
                        Order Type
                      </label>
                      <Select value={orderType} onValueChange={setOrderType}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="market">Market</SelectItem>
                          <SelectItem value="limit">Limit</SelectItem>
                          <SelectItem value="stop">Stop Loss</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <label className="text-xs font-medium mb-1 block">
                        Price (USDT)
                      </label>
                      <Input
                        type="number"
                        placeholder="0.00"
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                        className="font-mono"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-medium mb-1 block">
                        Amount ({selectedPair.replace("USDT", "")})
                      </label>
                      <Input
                        type="number"
                        placeholder="0.00000000"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        className="font-mono"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-medium mb-1 block">
                        Total (USDT)
                      </label>
                      <div className="px-3 py-2 bg-gray-50 rounded-md text-sm font-mono">
                        {price && amount
                          ? (parseFloat(price) * parseFloat(amount)).toFixed(2)
                          : "0.00"}
                      </div>
                    </div>

                    <Button
                      onClick={handlePlaceOrder}
                      className="w-full bg-green-600 hover:bg-green-700"
                    >
                      Buy {selectedPair.replace("USDT", "")}
                    </Button>
                  </div>

                  {/* Sell Panel */}
                  <div className="space-y-4">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-red-600 rounded-full"></div>
                      <h3 className="font-semibold text-red-600">
                        Sell {selectedPair.replace("USDT", "")}
                      </h3>
                    </div>

                    <div>
                      <label className="text-xs font-medium mb-1 block">
                        Order Type
                      </label>
                      <Select defaultValue="limit">
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="market">Market</SelectItem>
                          <SelectItem value="limit">Limit</SelectItem>
                          <SelectItem value="stop">Stop Loss</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <label className="text-xs font-medium mb-1 block">
                        Price (USDT)
                      </label>
                      <Input
                        type="number"
                        placeholder="0.00"
                        defaultValue={currentPair?.current_price.toFixed(2)}
                        className="font-mono"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-medium mb-1 block">
                        Amount ({selectedPair.replace("USDT", "")})
                      </label>
                      <Input
                        type="number"
                        placeholder="0.00000000"
                        className="font-mono"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-medium mb-1 block">
                        Total (USDT)
                      </label>
                      <div className="px-3 py-2 bg-gray-50 rounded-md text-sm font-mono">
                        0.00
                      </div>
                    </div>

                    <Button className="w-full bg-red-600 hover:bg-red-700">
                      Sell {selectedPair.replace("USDT", "")}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

          </div>
        </TabsContent>

        {/* P2P Tab */}
        <TabsContent value="p2p" className="mobile-space-y mt-4">
          <EnhancedP2PMarketplace />
        </TabsContent>

        {/* Learn & News Tab */}
        <TabsContent value="learn" className="mobile-space-y mt-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
            {/* News Section */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base md:text-lg">
                  <Globe className="h-4 w-4 md:h-5 md:w-5" />
                  Crypto News
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
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
                        <div className="flex items-center gap-1 flex-wrap">
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
                          {article.relatedAssets?.slice(0, 2).map((asset) => (
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

            {/* Education Section */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base md:text-lg">
                  <BookOpen className="h-4 w-4 md:h-5 md:w-5" />
                  Crypto Education
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
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
                            <Star className="h-3 w-3 md:h-4 md:w-4 fill-yellow-400 text-yellow-400" />
                            <span>{content.rating}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Blog Feed Section */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base md:text-lg">
                  <BookOpen className="h-4 w-4 md:h-5 md:w-5" />
                  From Our Blog
                  <Badge variant="outline" className="ml-auto">Live Feed</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {blogPosts.map((post) => (
                    <div
                      key={post.id}
                      className="border rounded-lg p-3 md:p-4 hover:shadow-md transition-shadow cursor-pointer"
                      onClick={() => window.open(`/blog/${post.slug}`, '_blank')}
                    >
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge
                            className={cn("text-white text-xs", post.category.color)}
                          >
                            {post.category.name}
                          </Badge>
                          {post.difficulty && (
                            <Badge
                              variant={
                                post.difficulty === "BEGINNER"
                                  ? "secondary"
                                  : post.difficulty === "INTERMEDIATE"
                                    ? "default"
                                    : "destructive"
                              }
                        <div className="flex-1 text-right">
                          <RealTimePriceDisplay
                            price={crypto.current_price}
                            change24h={crypto.price_change_percentage_24h}
                            symbol={crypto.symbol}
                            showSymbol={false}
                            size="sm"
                            className="justify-end"
                          />
                        </div>
                  ))}
                  <div className="pt-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full"
                      onClick={() => window.open('/blog', '_blank')}
                    >
                      View All Blog Posts
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}