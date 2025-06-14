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
import EnhancedP2PMarketplace from "@/components/crypto/EnhancedP2PMarketplace";
import ApiStatusIndicator from "@/components/crypto/ApiStatusIndicator";
import CryptoDetailModal from "@/components/crypto/CryptoDetailModal";
import BlogRSSFeed from "@/components/crypto/BlogRSSFeed";
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
  const [selectedCrypto, setSelectedCrypto] = useState<Cryptocurrency | null>(
    null,
  );
  const [isCryptoDetailOpen, setIsCryptoDetailOpen] = useState(false);

  const { toast } = useToast();

  useEffect(() => {
    loadCryptoData();
  }, []);

  // Real-time updates every 30 seconds
  useEffect(() => {
    const interval = setInterval(updateRealTimeData, 30000);
    return () => clearInterval(interval);
  }, [selectedPair]);

  const loadCryptoData = async () => {
    setIsLoading(true);
    try {
      // Load data with individual error handling to prevent total failure
      const results = await Promise.allSettled([
        cryptoService.getCryptocurrencies(20),
        cryptoService.getMarketData(),
        cryptoService.getPortfolio(),
        cryptoService.getOrderBook(selectedPair),
        cryptoService.getRecentTrades(selectedPair, 10),
        cryptoService.getNews(6),
        cryptoService.getEducationContent(),
        blogService.getBlogPosts({ limit: 6 }),
      ]);

      // Handle each result individually
      if (results[0].status === "fulfilled") setCryptos(results[0].value || []);
      if (results[1].status === "fulfilled") setMarketData(results[1].value);
      if (results[2].status === "fulfilled") setPortfolio(results[2].value);
      if (results[3].status === "fulfilled") setOrderBook(results[3].value);
      if (results[4].status === "fulfilled")
        setRecentTrades(results[4].value || []);
      if (results[5].status === "fulfilled") setNews(results[5].value || []);
      if (results[6].status === "fulfilled")
        setEducationContent(results[6].value || []);
      if (results[7].status === "fulfilled")
        setBlogPosts(results[7].value?.posts || []);

      setLastUpdated(new Date());

      // Show warning if some services failed
      const failedServices = results.filter(
        (r) => r.status === "rejected",
      ).length;
      if (failedServices > 0) {
        console.log(
          `${failedServices} services failed to load, using cached/mock data`,
        );
        toast({
          title: "Partial data loaded",
          description:
            "Some services are unavailable. Using cached data where possible.",
          variant: "default",
        });
      }
    } catch (error) {
      console.error("Failed to load crypto data:", error);
      toast({
        title: "Loading error",
        description:
          "Some data services are unavailable. The app will use simulated data.",
        variant: "default",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const updateRealTimeData = async () => {
    try {
      // Simulate price fluctuations for real-time feel
      setCryptos((prevCryptos) =>
        prevCryptos.map((crypto) => {
          // Small random price fluctuations (±0.1%)
          const fluctuation = (Math.random() - 0.5) * 0.002;
          const newPrice = crypto.current_price * (1 + fluctuation);
          return {
            ...crypto,
            current_price: parseFloat(newPrice.toFixed(8)),
            last_updated: new Date().toISOString(),
          };
        }),
      );

      // Update market data occasionally
      if (Math.random() < 0.1) {
        try {
          const newMarketData = await cryptoService.getMarketData();
          setMarketData(newMarketData);
        } catch (error) {
          console.log("Market data API unavailable, keeping cached data");
        }
      }
    } catch (error) {
      console.error("Error in price update system:", error);
    }
  };

  const formatCurrency = (value: number) => {
    if (typeof value !== "number" || isNaN(value)) {
      return "$0.00";
    }

    if (value >= 1000000000) {
      return `$${(value / 1000000000).toFixed(2)}B`;
    } else if (value >= 1000000) {
      return `$${(value / 1000000).toFixed(2)}M`;
    } else if (value >= 1000) {
      return `$${(value / 1000).toFixed(2)}K`;
    }
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
      maximumFractionDigits: value < 1 ? 6 : 2,
    }).format(value);
  };

  const formatPercentage = (value: number) => {
    if (typeof value !== "number" || isNaN(value)) {
      return "0.00%";
    }
    return `${value >= 0 ? "+" : ""}${value.toFixed(2)}%`;
  };

  const safeToFixed = (value: number | undefined, decimals = 2) => {
    if (typeof value !== "number" || isNaN(value)) {
      return "0.00";
    }
    return value.toFixed(decimals);
  };

  const getChangeColor = (value: number) => {
    if (typeof value !== "number" || isNaN(value)) {
      return "text-gray-500";
    }
    return value >= 0 ? "text-green-600" : "text-red-600";
  };

  const handlePlaceOrder = () => {
    toast({
      title: "Order Placed",
      description: `${side.toUpperCase()} order for ${amount} ${selectedPair.replace("USDT", "")} at $${price}`,
    });
    setPrice("");
    setAmount("");
  };

  const currentPair = cryptos.find(
    (c) => c.symbol.toUpperCase() + "USDT" === selectedPair,
  );

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-96">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading crypto data...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-2 sm:px-4 py-4 sm:py-8 space-y-4 sm:space-y-6">
      <div className="space-y-4 sm:space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:gap-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold">
                Cryptocurrency Hub
              </h1>
              <p className="text-sm sm:text-base text-muted-foreground">
                Trade, learn, and manage your crypto portfolio
              </p>
            </div>
            <ApiStatusIndicator showDetails={true} />
          </div>

          {/* Tabs Navigation */}
          <div className="border-b">
            <Tabs
              value={activeTab}
              onValueChange={setActiveTab}
              className="w-full"
            >
              <TabsList className="grid w-full grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 h-auto p-1">
                <TabsTrigger
                  value="overview"
                  className="text-xs sm:text-sm py-2 px-2 sm:px-4"
                >
                  Overview
                </TabsTrigger>
                <TabsTrigger
                  value="trading"
                  className="text-xs sm:text-sm py-2 px-2 sm:px-4"
                >
                  Trading
                </TabsTrigger>
                <TabsTrigger
                  value="p2p"
                  className="text-xs sm:text-sm py-2 px-2 sm:px-4"
                >
                  P2P
                </TabsTrigger>
                <TabsTrigger
                  value="portfolio"
                  className="text-xs sm:text-sm py-2 px-2 sm:px-4"
                >
                  Portfolio
                </TabsTrigger>
                <TabsTrigger
                  value="learn"
                  className="text-xs sm:text-sm py-2 px-2 sm:px-4"
                >
                  Learn
                </TabsTrigger>
              </TabsList>

              {/* Overview Tab */}
              <TabsContent
                value="overview"
                className="mt-4 sm:mt-6 space-y-4 sm:space-y-6"
              >
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div>
                    <h2 className="text-lg sm:text-xl font-bold">
                      Market Overview
                    </h2>
                    <div className="flex items-center gap-2">
                      <p className="text-sm text-muted-foreground">
                        Real-time market data and analytics
                      </p>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      Last updated: {lastUpdated.toLocaleTimeString()}
                    </p>
                  </div>
                </div>

                {/* Global Market Stats */}
                {marketData && (
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                    <Card>
                      <CardContent className="p-3 sm:p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-xs sm:text-sm text-muted-foreground">
                              Market Cap
                            </p>
                            <p className="text-lg sm:text-xl font-bold">
                              {formatCurrency(
                                marketData.globalStats?.totalMarketCap || 0,
                              )}
                            </p>
                            <p
                              className={cn(
                                "text-xs",
                                getChangeColor(
                                  marketData.globalStats?.marketCapChange24h ||
                                    0,
                                ),
                              )}
                            >
                              {formatPercentage(
                                marketData.globalStats?.marketCapChange24h || 0,
                              )}
                            </p>
                          </div>
                          <Globe className="h-6 w-6 sm:h-8 sm:w-8 text-blue-500" />
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardContent className="p-3 sm:p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-xs sm:text-sm text-muted-foreground">
                              24h Volume
                            </p>
                            <p className="text-lg sm:text-xl font-bold">
                              {formatCurrency(
                                marketData.globalStats?.totalVolume24h || 0,
                              )}
                            </p>
                            <p className="text-xs text-green-600">+2.4%</p>
                          </div>
                          <BarChart3 className="h-6 w-6 sm:h-8 sm:w-8 text-green-500" />
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardContent className="p-3 sm:p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-xs sm:text-sm text-muted-foreground">
                              BTC Dominance
                            </p>
                            <p className="text-lg sm:text-xl font-bold">
                              {safeToFixed(
                                marketData.globalStats?.btcDominance,
                                1,
                              )}
                              %
                            </p>
                            <p className="text-xs text-muted-foreground">
                              ETH{" "}
                              {safeToFixed(
                                marketData.globalStats?.ethDominance,
                                1,
                              )}
                              %
                            </p>
                          </div>
                          <PieChart className="h-6 w-6 sm:h-8 sm:w-8 text-orange-500" />
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardContent className="p-3 sm:p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-xs sm:text-sm text-muted-foreground">
                              Fear & Greed
                            </p>
                            <p className="text-lg sm:text-xl font-bold">
                              {marketData.fearGreedIndex || 65}
                            </p>
                            <p className="text-xs text-yellow-600">Greed</p>
                          </div>
                          <Brain className="h-6 w-6 sm:h-8 sm:w-8 text-purple-500" />
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                )}

                {/* Top Cryptocurrencies */}
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base sm:text-lg">
                      Top Cryptocurrencies
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-2 sm:p-4">
                    <div className="space-y-1 sm:space-y-2">
                      {cryptos.slice(0, 10).map((crypto) => (
                        <div
                          key={crypto.id}
                          onClick={() => {
                            setSelectedCrypto(crypto);
                            setIsCryptoDetailOpen(true);
                          }}
                          className="flex items-center justify-between p-2 sm:p-3 rounded-lg border hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors cursor-pointer touch-manipulation mobile-focus"
                        >
                          <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
                            <img
                              src={crypto.image}
                              alt={crypto.name}
                              className="w-6 h-6 sm:w-8 sm:h-8 rounded-full flex-shrink-0"
                            />
                            <div className="min-w-0 flex-1">
                              <div className="flex items-center gap-1 sm:gap-2">
                                <p className="font-medium text-xs sm:text-sm truncate">
                                  {crypto.name}
                                </p>
                                <span className="text-xs text-muted-foreground bg-muted px-1 py-0.5 rounded flex-shrink-0">
                                  {crypto.symbol}
                                </span>
                              </div>
                              <p className="text-xs text-muted-foreground hidden sm:block">
                                Rank #{crypto.market_cap_rank}
                              </p>
                            </div>
                          </div>
                          <div className="text-right flex-shrink-0 min-w-0">
                            <p className="font-medium text-xs sm:text-sm text-responsive">
                              {formatCurrency(crypto.current_price)}
                            </p>
                            <div
                              className={cn(
                                "text-xs flex items-center gap-1 justify-end",
                                getChangeColor(
                                  crypto.price_change_percentage_24h,
                                ),
                              )}
                            >
                              {crypto.price_change_percentage_24h >= 0 ? (
                                <TrendingUp className="h-2.5 w-2.5 sm:h-3 sm:w-3 flex-shrink-0" />
                              ) : (
                                <TrendingDown className="h-2.5 w-2.5 sm:h-3 sm:w-3 flex-shrink-0" />
                              )}
                              <span className="truncate">
                                {Math.abs(
                                  crypto.price_change_percentage_24h,
                                ).toFixed(2)}
                                %
                              </span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Market Movers */}
                {marketData && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                    <Card>
                      <CardHeader className="pb-3">
                        <CardTitle className="flex items-center gap-2 text-green-600 text-base sm:text-lg">
                          <TrendingUp className="h-4 w-4 sm:h-5 sm:w-5" />
                          Top Gainers (24h)
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2 sm:space-y-3">
                          {marketData.topMovers?.gainers?.length > 0 ? (
                            marketData.topMovers.gainers
                              .slice(0, 4)
                              .map((crypto) => (
                                <div
                                  key={crypto.id}
                                  className="flex items-center justify-between"
                                >
                                  <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
                                    <img
                                      src={crypto.image}
                                      alt={crypto.name}
                                      className="w-5 h-5 sm:w-6 sm:h-6 rounded-full flex-shrink-0"
                                    />
                                    <span className="font-medium text-sm sm:text-base truncate">
                                      {crypto.symbol?.toUpperCase() || "N/A"}
                                    </span>
                                  </div>
                                  <div className="text-right flex-shrink-0">
                                    <div className="font-semibold text-sm sm:text-base">
                                      {formatCurrency(
                                        crypto.current_price || 0,
                                      )}
                                    </div>
                                    <div className="text-green-600 text-xs sm:text-sm font-medium">
                                      {formatPercentage(
                                        crypto.price_change_percentage_24h || 0,
                                      )}
                                    </div>
                                  </div>
                                </div>
                              ))
                          ) : (
                            <div className="text-center text-muted-foreground py-4">
                              <p className="text-sm">
                                No gainers data available
                              </p>
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader className="pb-3">
                        <CardTitle className="flex items-center gap-2 text-red-600 text-base sm:text-lg">
                          <TrendingDown className="h-4 w-4 sm:h-5 sm:w-5" />
                          Top Losers (24h)
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2 sm:space-y-3">
                          {marketData.topMovers?.losers?.length > 0 ? (
                            marketData.topMovers.losers
                              .slice(0, 4)
                              .map((crypto) => (
                                <div
                                  key={crypto.id}
                                  className="flex items-center justify-between"
                                >
                                  <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
                                    <img
                                      src={crypto.image}
                                      alt={crypto.name}
                                      className="w-5 h-5 sm:w-6 sm:h-6 rounded-full flex-shrink-0"
                                    />
                                    <span className="font-medium text-sm sm:text-base truncate">
                                      {crypto.symbol?.toUpperCase() || "N/A"}
                                    </span>
                                  </div>
                                  <div className="text-right flex-shrink-0">
                                    <div className="font-semibold text-sm sm:text-base">
                                      {formatCurrency(
                                        crypto.current_price || 0,
                                      )}
                                    </div>
                                    <div className="text-red-600 text-xs sm:text-sm font-medium">
                                      {formatPercentage(
                                        crypto.price_change_percentage_24h || 0,
                                      )}
                                    </div>
                                  </div>
                                </div>
                              ))
                          ) : (
                            <div className="text-center text-muted-foreground py-4">
                              <p className="text-sm">
                                No losers data available
                              </p>
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                )}
              </TabsContent>

              {/* Trading Tab */}
              <TabsContent
                value="trading"
                className="mt-4 sm:mt-6 space-y-4 sm:space-y-6"
              >
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div>
                    <h2 className="text-lg sm:text-xl font-bold">
                      Trading Dashboard
                    </h2>
                    <p className="text-sm text-muted-foreground">
                      Professional trading interface with simulated data
                    </p>
                  </div>
                  {currentPair && (
                    <div className="flex items-center gap-3 flex-shrink-0">
                      <Badge
                        variant="outline"
                        className="text-sm sm:text-lg px-2 sm:px-3 py-1"
                      >
                        {currentPair.symbol.toUpperCase()}/USDT
                      </Badge>
                      <div className="text-right">
                        <div className="font-bold text-sm sm:text-base">
                          {formatCurrency(currentPair.current_price)}
                        </div>
                        <div
                          className={cn(
                            "text-xs",
                            getChangeColor(
                              currentPair.price_change_percentage_24h,
                            ),
                          )}
                        >
                          {formatPercentage(
                            currentPair.price_change_percentage_24h,
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Trading Interface */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base sm:text-lg">
                      Place Order
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                      {/* Buy Panel */}
                      <div className="space-y-4">
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 bg-green-600 rounded-full"></div>
                          <h3 className="font-semibold text-green-600">
                            Buy {selectedPair.replace("USDT", "")}
                          </h3>
                        </div>

                        <div className="space-y-3">
                          <div>
                            <label className="text-xs font-medium mb-1 block">
                              Order Type
                            </label>
                            <Select
                              value={orderType}
                              onValueChange={setOrderType}
                            >
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="market">Market</SelectItem>
                                <SelectItem value="limit">Limit</SelectItem>
                                <SelectItem value="stop">Stop</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>

                          <div>
                            <label className="text-xs font-medium mb-1 block">
                              Price (USDT)
                            </label>
                            <Input
                              type="number"
                              value={price}
                              onChange={(e) => setPrice(e.target.value)}
                              placeholder={safeToFixed(
                                currentPair?.current_price,
                              )}
                            />
                          </div>

                          <div>
                            <label className="text-xs font-medium mb-1 block">
                              Amount ({selectedPair.replace("USDT", "")})
                            </label>
                            <Input
                              type="number"
                              value={amount}
                              onChange={(e) => setAmount(e.target.value)}
                              placeholder="0.00"
                            />
                          </div>

                          <Button
                            className="w-full bg-green-600 hover:bg-green-700 mobile-button-size"
                            onClick={handlePlaceOrder}
                          >
                            Buy {selectedPair.replace("USDT", "")}
                          </Button>
                        </div>
                      </div>

                      {/* Sell Panel */}
                      <div className="space-y-4">
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 bg-red-600 rounded-full"></div>
                          <h3 className="font-semibold text-red-600">
                            Sell {selectedPair.replace("USDT", "")}
                          </h3>
                        </div>

                        <div className="space-y-3">
                          <div>
                            <label className="text-xs font-medium mb-1 block">
                              Order Type
                            </label>
                            <Select
                              value={orderType}
                              onValueChange={setOrderType}
                            >
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="market">Market</SelectItem>
                                <SelectItem value="limit">Limit</SelectItem>
                                <SelectItem value="stop">Stop</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>

                          <div>
                            <label className="text-xs font-medium mb-1 block">
                              Price (USDT)
                            </label>
                            <Input
                              type="number"
                              value={price}
                              onChange={(e) => setPrice(e.target.value)}
                              placeholder={safeToFixed(
                                currentPair?.current_price,
                              )}
                            />
                          </div>

                          <div>
                            <label className="text-xs font-medium mb-1 block">
                              Amount ({selectedPair.replace("USDT", "")})
                            </label>
                            <Input
                              type="number"
                              value={amount}
                              onChange={(e) => setAmount(e.target.value)}
                              placeholder="0.00"
                            />
                          </div>

                          <Button
                            className="w-full bg-red-600 hover:bg-red-700 mobile-button-size"
                            onClick={handlePlaceOrder}
                          >
                            Sell {selectedPair.replace("USDT", "")}
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* P2P Tab */}
              <TabsContent
                value="p2p"
                className="mt-4 sm:mt-6 space-y-4 sm:space-y-6"
              >
                <EnhancedP2PMarketplace />
              </TabsContent>

              {/* Portfolio Tab */}
              <TabsContent
                value="portfolio"
                className="mt-4 sm:mt-6 space-y-4 sm:space-y-6"
              >
                <div>
                  <h2 className="text-lg sm:text-xl font-bold">
                    Portfolio Overview
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    Track your cryptocurrency investments
                  </p>
                </div>

                {portfolio && (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
                    <Card>
                      <CardContent className="p-4">
                        <div className="text-center space-y-2">
                          <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
                            <Wallet className="h-6 w-6 text-blue-600" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-blue-700">
                              Total Value
                            </h3>
                            <p className="text-xl sm:text-2xl font-bold">
                              {formatCurrency(portfolio.totalValue || 0)}
                            </p>
                            <p
                              className={cn(
                                "text-sm",
                                getChangeColor(
                                  portfolio.totalChangePercent24h || 0,
                                ),
                              )}
                            >
                              {formatPercentage(
                                portfolio.totalChangePercent24h || 0,
                              )}
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardContent className="p-4">
                        <div className="text-center space-y-2">
                          <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                            <Plus className="h-6 w-6 text-green-600" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-green-700">
                              24h Change
                            </h3>
                            <p className="text-xl sm:text-2xl font-bold">
                              {formatCurrency(portfolio.totalChange24h || 0)}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              Today's gain/loss
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardContent className="p-4">
                        <div className="text-center space-y-2">
                          <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto">
                            <Target className="h-6 w-6 text-purple-600" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-purple-700">
                              Assets
                            </h3>
                            <p className="text-xl sm:text-2xl font-bold">
                              {portfolio.assets?.length || 0}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              Different coins
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                )}
              </TabsContent>

              {/* Learn Tab */}
              <TabsContent
                value="learn"
                className="mt-4 sm:mt-6 space-y-4 sm:space-y-6"
              >
                <div>
                  <h2 className="text-lg sm:text-xl font-bold">Learn & News</h2>
                  <p className="text-sm text-muted-foreground">
                    Educational content, blog articles, and latest
                    cryptocurrency news
                  </p>
                </div>

                {/* Blog Posts Section */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-base sm:text-lg font-semibold flex items-center gap-2">
                      <BookOpen className="h-4 w-4 sm:h-5 sm:w-5" />
                      Latest from SoftChat Blog
                    </h3>
                    <Button variant="outline" size="sm" asChild>
                      <a href="/blog" target="_blank" rel="noopener noreferrer">
                        View All Articles
                      </a>
                    </Button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                    {blogPosts && blogPosts.length > 0 ? (
                      blogPosts.slice(0, 6).map((post) => (
                        <Card
                          key={post.id}
                          className="cursor-pointer hover:shadow-lg transition-shadow group"
                          onClick={() =>
                            window.open(`/blog/${post.slug}`, "_blank")
                          }
                        >
                          {post.featuredImage && (
                            <div className="relative h-32 sm:h-40 overflow-hidden rounded-t-lg">
                              <img
                                src={post.featuredImage}
                                alt={post.title}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                              />
                              <div className="absolute top-2 right-2">
                                <Badge
                                  className={cn(
                                    "text-white text-xs",
                                    post.category.color,
                                  )}
                                >
                                  {post.category.name}
                                </Badge>
                              </div>
                              {post.difficulty && (
                                <div className="absolute top-2 left-2">
                                  <Badge
                                    variant="secondary"
                                    className={cn(
                                      "text-xs",
                                      post.difficulty === "BEGINNER" &&
                                        "bg-green-100 text-green-800",
                                      post.difficulty === "INTERMEDIATE" &&
                                        "bg-yellow-100 text-yellow-800",
                                      post.difficulty === "ADVANCED" &&
                                        "bg-red-100 text-red-800",
                                    )}
                                  >
                                    {post.difficulty}
                                  </Badge>
                                </div>
                              )}
                            </div>
                          )}
                          <CardContent className="p-4">
                            <div className="space-y-3">
                              <div className="space-y-2">
                                <h3 className="font-semibold text-sm line-clamp-2 group-hover:text-blue-600 transition-colors">
                                  {post.title}
                                </h3>
                                <p className="text-xs text-muted-foreground line-clamp-2">
                                  {post.excerpt}
                                </p>
                              </div>

                              {/* Tags */}
                              <div className="flex flex-wrap gap-1">
                                {post.tags.slice(0, 3).map((tag) => (
                                  <Badge
                                    key={tag}
                                    variant="outline"
                                    className="text-xs"
                                  >
                                    {tag}
                                  </Badge>
                                ))}
                                {post.tags.length > 3 && (
                                  <Badge variant="outline" className="text-xs">
                                    +{post.tags.length - 3}
                                  </Badge>
                                )}
                              </div>

                              <div className="flex items-center justify-between text-xs text-muted-foreground border-t pt-2">
                                <div className="flex items-center gap-2">
                                  <img
                                    src={post.author.avatar}
                                    alt={post.author.name}
                                    className="w-4 h-4 rounded-full"
                                  />
                                  <span className="truncate">
                                    {post.author.name}
                                  </span>
                                </div>
                                <div className="flex items-center gap-3 flex-shrink-0">
                                  <div className="flex items-center gap-1">
                                    <Clock className="h-3 w-3" />
                                    <span>{post.readingTime}m</span>
                                  </div>
                                  <span>
                                    {new Date(
                                      post.publishedAt,
                                    ).toLocaleDateString()}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))
                    ) : (
                      <div className="col-span-full text-center text-muted-foreground py-8">
                        <BookOpen className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                        <p>Loading blog articles...</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* News & Education Section */}
                <div className="space-y-4">
                  <h3 className="text-base sm:text-lg font-semibold">
                    News & Market Updates
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                    {/* News Articles */}
                    {news && news.length > 0 ? (
                      news.slice(0, 6).map((article) => (
                        <Card
                          key={article.id}
                          className="cursor-pointer hover:shadow-lg transition-shadow"
                        >
                          <CardContent className="p-4">
                            <div className="space-y-3">
                              <Badge variant="outline" className="text-xs">
                                News
                              </Badge>
                              <h3 className="font-semibold text-sm line-clamp-2">
                                {article.title}
                              </h3>
                              <p className="text-xs text-muted-foreground line-clamp-3">
                                {article.summary}
                              </p>
                              <div className="flex items-center justify-between text-xs text-muted-foreground">
                                <span>{article.source}</span>
                                <span>
                                  {new Date(
                                    article.publishedAt,
                                  ).toLocaleDateString()}
                                </span>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))
                    ) : (
                      <div className="col-span-full text-center text-muted-foreground py-8">
                        <p>Loading news articles...</p>
                      </div>
                    )}

                    {/* Education Content */}
                    {educationContent && educationContent.length > 0
                      ? educationContent.slice(0, 3).map((content) => (
                          <Card
                            key={content.id}
                            className="cursor-pointer hover:shadow-lg transition-shadow"
                          >
                            <CardContent className="p-4">
                              <div className="space-y-3">
                                <Badge variant="outline" className="text-xs">
                                  Education
                                </Badge>
                                <h3 className="font-semibold text-sm line-clamp-2">
                                  {content.title}
                                </h3>
                                <p className="text-xs text-muted-foreground line-clamp-3">
                                  {content.description}
                                </p>
                                <div className="flex items-center justify-between text-xs text-muted-foreground">
                                  <span>{content.author}</span>
                                  <span>{content.duration} min read</span>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        ))
                      : null}
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>

          {/* Crypto Detail Modal */}
          <CryptoDetailModal
            crypto={selectedCrypto}
            isOpen={isCryptoDetailOpen}
            onClose={() => {
              setIsCryptoDetailOpen(false);
              setSelectedCrypto(null);
            }}
          />
        </div>
      </div>
    </div>
  );
}
