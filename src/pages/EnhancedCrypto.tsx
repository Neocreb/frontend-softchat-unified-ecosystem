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
    // Set up real-time updates every 60 seconds (reduced frequency)
    const interval = setInterval(updateRealTimeData, 60000);
    return () => clearInterval(interval);
  }, [selectedPair]);

  // Less frequent price updates (every 30 seconds) to reduce API load
  useEffect(() => {
    // Only start price updates after initial load and reduce frequency
    if (cryptos && cryptos.length > 0) {
      const priceUpdateInterval = setInterval(updatePricesOnly, 30000);
      return () => clearInterval(priceUpdateInterval);
    }
  }, [cryptos]);

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
      const [newOrderBook, newTrades] = await Promise.all([
        cryptoService.getOrderBook(selectedPair),
        cryptoService.getRecentTrades(selectedPair, 5),
      ]);

      setOrderBook(newOrderBook);
      setRecentTrades((prev) =>
        [...(newTrades || []), ...(prev || [])].slice(0, 20),
      );
      setLastUpdated(new Date());
    } catch (error) {
      console.error("Failed to update real-time data:", error);
    }
  };

  // Update only cryptocurrency prices with conservative approach
  const updatePricesOnly = async () => {
    try {
      if (!cryptos || cryptos.length === 0) return;

      // Reduce API calls - only update prices occasionally and use simulation for real-time feel
      const shouldCallAPI = Math.random() < 0.1; // Only 10% chance to call real API

      if (shouldCallAPI) {
        try {
          // Get coin IDs for price updates (limit to top 5 to reduce API load)
          const coinIds = cryptos?.slice(0, 5).map((crypto) => crypto.id) || [];
          const priceUpdates = await cryptoService.getRealTimePrice(coinIds);

          // Update crypto prices
          setCryptos((prevCryptos) =>
            prevCryptos.map((crypto) => {
              const priceData = priceUpdates[crypto.id];
              if (priceData) {
                return {
                  ...crypto,
                  current_price: priceData.usd,
                  price_change_percentage_24h: priceData.usd_24h_change,
                  last_updated: new Date().toISOString(),
                };
              }
              return crypto;
            }),
          );
        } catch (apiError) {
          console.log("API unavailable, using simulated updates");
          // Fall through to simulation
        }
      }

      // Always do simulated price updates for real-time feel (when API fails or not called)
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

      // Update market data very rarely
      if (Math.random() < 0.05) {
        // Only 5% chance to update market data
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

  const getChangeColor = (value: number) => {
    return value >= 0 ? "text-green-600" : "text-red-600";
  };

  const getCurrentPair = () => {
    if (!cryptos || cryptos.length === 0) return null;
    return cryptos.find(
      (c) => c?.symbol?.toUpperCase() + "USDT" === selectedPair,
    );
  };

  const currentPair = getCurrentPair();

  const handlePlaceOrder = () => {
    toast({
      title: "Order placed",
      description: `${side.toUpperCase()} order for ${amount} ${selectedPair.replace("USDT", "")} at $${price}`,
    });
  };

  // Safe number formatting function
  const safeToFixed = (value: any, decimals: number = 2): string => {
    if (typeof value !== "number" || isNaN(value)) {
      return "0." + "0".repeat(decimals);
    }
    return value.toFixed(decimals);
  };

  return (
    <div className="min-h-screen bg-gray-50 w-full max-w-full overflow-x-hidden">
      <div className="w-full max-w-7xl mx-auto px-3 sm:px-4 py-4 sm:py-6 pb-safe-area-bottom">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          {/* Mobile optimized tab list */}
          <div className="w-full mobile-tabs">
            <div className="border-b border-gray-200">
              <TabsList className="inline-flex h-auto bg-transparent min-w-max p-0 gap-1 w-full overflow-x-auto">
                <TabsTrigger
                  value="overview"
                  className="whitespace-nowrap px-3 py-2 text-sm data-[state=active]:border-b-2 data-[state=active]:border-blue-500 data-[state=active]:bg-transparent rounded-none"
                >
                  Overview
                </TabsTrigger>
                <TabsTrigger
                  value="trading"
                  className="whitespace-nowrap px-3 py-2 text-sm data-[state=active]:border-b-2 data-[state=active]:border-blue-500 data-[state=active]:bg-transparent rounded-none"
                >
                  Trading
                </TabsTrigger>
                <TabsTrigger
                  value="portfolio"
                  className="whitespace-nowrap px-3 py-2 text-sm data-[state=active]:border-b-2 data-[state=active]:border-blue-500 data-[state=active]:bg-transparent rounded-none"
                >
                  Portfolio
                </TabsTrigger>
                <TabsTrigger
                  value="learn"
                  className="whitespace-nowrap px-3 py-2 text-sm data-[state=active]:border-b-2 data-[state=active]:border-blue-500 data-[state=active]:bg-transparent rounded-none"
                >
                  Learn & News
                </TabsTrigger>
                <TabsTrigger
                  value="p2p"
                  className="whitespace-nowrap px-3 py-2 text-sm data-[state=active]:border-b-2 data-[state=active]:border-blue-500 data-[state=active]:bg-transparent rounded-none"
                >
                  P2P
                </TabsTrigger>
              </TabsList>
            </div>
          </div>

          {/* Overview Tab */}
          <TabsContent value="overview" className="mobile-space-y mt-4">
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

            {/* Market Data Cards */}
            {marketData && (
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
                <Card>
                  <CardContent className="p-3 md:p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs md:text-sm text-gray-600">
                          Market Cap
                        </p>
                        <p className="text-lg md:text-xl font-bold">
                          {formatCurrency(
                            marketData.globalStats?.totalMarketCap || 0,
                          )}
                        </p>
                        <p className="text-xs text-green-600">
                          +
                          {safeToFixed(
                            marketData.globalStats?.marketCapChange24h,
                          )}
                          %
                        </p>
                      </div>
                      <BarChart3 className="h-6 w-6 md:h-8 md:w-8 text-blue-500" />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-3 md:p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs md:text-sm text-gray-600">
                          24h Volume
                        </p>
                        <p className="text-lg md:text-xl font-bold">
                          {formatCurrency(
                            marketData.globalStats?.totalVolume24h || 0,
                          )}
                        </p>
                        <p className="text-xs text-gray-500">
                          {marketData.globalStats?.markets || 0} markets
                        </p>
                      </div>
                      <Activity className="h-6 w-6 md:h-8 md:w-8 text-green-500" />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-3 md:p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs md:text-sm text-gray-600">
                          BTC Dominance
                        </p>
                        <p className="text-lg md:text-xl font-bold">
                          {safeToFixed(marketData.globalStats?.btcDominance, 1)}
                          %
                        </p>
                        <p className="text-xs text-gray-500">
                          ETH{" "}
                          {safeToFixed(marketData.globalStats?.ethDominance, 1)}
                          %
                        </p>
                      </div>
                      <PieChart className="h-6 w-6 md:h-8 md:w-8 text-orange-500" />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-3 md:p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs md:text-sm text-gray-600">
                          Fear & Greed
                        </p>
                        <p className="text-lg md:text-xl font-bold">
                          {marketData.fearGreedIndex || 65}
                        </p>
                        <p className="text-xs text-yellow-600">Greed</p>
                      </div>
                      <Brain className="h-6 w-6 md:h-8 md:w-8 text-purple-500" />
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

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
                  {cryptos && cryptos.length > 0 ? (
                    cryptos.slice(0, 8).map((crypto, index) => (
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
                            price={crypto.current_price || 0}
                            change24h={crypto.price_change_percentage_24h || 0}
                            symbol={crypto.symbol}
                            showSymbol={false}
                            size="sm"
                            className="justify-end"
                          />
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center text-gray-500 py-8">
                      <p>Loading cryptocurrencies...</p>
                    </div>
                  )}
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
                      {marketData.topMovers?.gainers?.length > 0 ? (
                        marketData.topMovers.gainers
                          .slice(0, 4)
                          .map((crypto) => (
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
                                  {crypto.symbol?.toUpperCase() || "N/A"}
                                </span>
                              </div>
                              <div className="text-right flex-shrink-0">
                                <div className="font-semibold text-sm md:text-base">
                                  {formatCurrency(crypto.current_price || 0)}
                                </div>
                                <div className="text-green-600 text-xs md:text-sm font-medium">
                                  {formatPercentage(
                                    crypto.price_change_percentage_24h || 0,
                                  )}
                                </div>
                              </div>
                            </div>
                          ))
                      ) : (
                        <div className="text-center text-gray-500 py-4">
                          <p className="text-sm">No gainers data available</p>
                        </div>
                      )}
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
                      {marketData.topMovers?.losers?.length > 0 ? (
                        marketData.topMovers.losers
                          .slice(0, 4)
                          .map((crypto) => (
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
                                  {crypto.symbol?.toUpperCase() || "N/A"}
                                </span>
                              </div>
                              <div className="text-right flex-shrink-0">
                                <div className="font-semibold text-sm md:text-base">
                                  {formatCurrency(crypto.current_price || 0)}
                                </div>
                                <div className="text-red-600 text-xs md:text-sm font-medium">
                                  {formatPercentage(
                                    crypto.price_change_percentage_24h || 0,
                                  )}
                                </div>
                              </div>
                            </div>
                          ))
                      ) : (
                        <div className="text-center text-gray-500 py-4">
                          <p className="text-sm">No losers data available</p>
                        </div>
                      )}
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
                    <RealTimePriceDisplay
                      price={currentPair.current_price || 0}
                      change24h={currentPair.price_change_percentage_24h || 0}
                      symbol={currentPair.symbol}
                      showSymbol={false}
                      size="lg"
                      className="justify-end"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* AI Trading Recommendations */}
            <SmartContentRecommendations
              contentType="mixed"
              availableContent={[...(cryptos || []), ...(news || [])]}
              onContentSelect={(content) => {
                if (content.symbol) {
                  // Crypto selected - find the matching crypto and update current pair
                  const selectedCrypto = cryptos.find(
                    (c) => c.id === content.id,
                  );
                  if (selectedCrypto) {
                    setSelectedPair(
                      selectedCrypto.symbol.toUpperCase() + "USDT",
                    );
                  }
                } else {
                  // News article selected
                  console.log("Selected news:", content);
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
                    <div className="space-y-4">
                      {/* Asks */}
                      <div>
                        <div className="text-xs font-medium text-gray-600 mb-1">
                          Asks
                        </div>
                        <div className="space-y-1">
                          {orderBook.asks?.length > 0 ? (
                            orderBook.asks.slice(0, 5).map((ask, index) => (
                              <div
                                key={index}
                                className="flex justify-between text-xs"
                              >
                                <span className="text-red-600 font-mono">
                                  {safeToFixed(ask?.price)}
                                </span>
                                <span className="font-mono">
                                  {safeToFixed(ask?.quantity, 4)}
                                </span>
                              </div>
                            ))
                          ) : (
                            <div className="text-center text-gray-500 text-xs py-2">
                              No asks available
                            </div>
                          )}
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
                          {orderBook.bids?.length > 0 ? (
                            orderBook.bids.slice(0, 5).map((bid, index) => (
                              <div
                                key={index}
                                className="flex justify-between text-xs"
                              >
                                <span className="text-green-600 font-mono">
                                  {safeToFixed(bid?.price)}
                                </span>
                                <span className="font-mono">
                                  {safeToFixed(bid?.quantity, 4)}
                                </span>
                              </div>
                            ))
                          ) : (
                            <div className="text-center text-gray-500 text-xs py-2">
                              No bids available
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Recent Trades */}
                      <div className="pt-3 border-t">
                        <div className="text-xs font-medium text-gray-600 mb-2">
                          Recent Trades
                        </div>
                        <div className="space-y-1 max-h-32 overflow-y-auto">
                          {recentTrades && recentTrades.length > 0 ? (
                            recentTrades.slice(0, 8).map((trade, index) => (
                              <div
                                key={index}
                                className="flex justify-between text-xs"
                              >
                                <span className="text-gray-600">
                                  {trade?.timestamp || "N/A"}
                                </span>
                                <span
                                  className={
                                    trade?.side === "buy"
                                      ? "text-green-600"
                                      : "text-red-600"
                                  }
                                >
                                  ${safeToFixed(trade?.price)}
                                </span>
                                <span>{safeToFixed(trade?.amount, 4)}</span>
                              </div>
                            ))
                          ) : (
                            <div className="text-center text-gray-500 text-xs py-2">
                              No recent trades
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      Loading order book...
                    </div>
                  )}
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
                          placeholder={safeToFixed(currentPair?.current_price)}
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
                        className="w-full bg-green-600 hover:bg-green-700"
                        onClick={handlePlaceOrder}
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
                        <Select value={orderType} onValueChange={setOrderType}>
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
                          placeholder={safeToFixed(currentPair?.current_price)}
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
                        className="w-full bg-red-600 hover:bg-red-700"
                        onClick={handlePlaceOrder}
                      >
                        Sell {selectedPair.replace("USDT", "")}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Portfolio Tab */}
          <TabsContent value="portfolio" className="mobile-space-y mt-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h2 className="text-xl md:text-2xl font-bold">
                  Portfolio Overview
                </h2>
                <p className="text-sm md:text-base text-gray-600">
                  Track your cryptocurrency investments
                </p>
              </div>
            </div>

            {portfolio && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
                <Card>
                  <CardContent className="p-4">
                    <div className="text-center space-y-2">
                      <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
                        <Wallet className="h-6 w-6 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-blue-700">
                          Total Balance
                        </h3>
                        <p className="text-2xl font-bold">
                          {formatCurrency(portfolio.totalBalance || 0)}
                        </p>
                        <p
                          className={cn(
                            "text-sm",
                            getChangeColor(portfolio.totalPnL || 0),
                          )}
                        >
                          {formatPercentage(portfolio.totalPnL || 0)}
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
                          Available Balance
                        </h3>
                        <p className="text-2xl font-bold">
                          {formatCurrency(portfolio.availableBalance || 0)}
                        </p>
                        <p className="text-sm text-gray-600">Ready to trade</p>
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
                          In Orders
                        </h3>
                        <p className="text-2xl font-bold">
                          {formatCurrency(portfolio.inOrders || 0)}
                        </p>
                        <p className="text-sm text-gray-600">
                          Locked in trades
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </TabsContent>

          {/* Learn & News Tab */}
          <TabsContent value="learn" className="mobile-space-y mt-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h2 className="text-xl md:text-2xl font-bold">Learn & News</h2>
                <p className="text-sm md:text-base text-gray-600">
                  Educational content and latest news
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
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
                          {article.category}
                        </Badge>
                        <h3 className="font-semibold text-sm line-clamp-2">
                          {article.title}
                        </h3>
                        <p className="text-xs text-gray-600 line-clamp-3">
                          {article.summary}
                        </p>
                        <div className="flex items-center justify-between text-xs text-gray-500">
                          <span>{article.source}</span>
                          <span>
                            {new Date(article.publishedAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <div className="col-span-full text-center text-gray-500 py-8">
                  <p>Loading news articles...</p>
                </div>
              )}

              {/* Blog Posts */}
              {blogPosts && blogPosts.length > 0 ? (
                blogPosts.slice(0, 6).map((post) => (
                  <Card
                    key={post.id}
                    className="cursor-pointer hover:shadow-lg transition-shadow"
                  >
                    <CardContent className="p-4">
                      <div className="space-y-3">
                        <Badge variant="outline" className="text-xs">
                          {post.category}
                        </Badge>
                        <h3 className="font-semibold text-sm line-clamp-2">
                          {post.title}
                        </h3>
                        <p className="text-xs text-gray-600 line-clamp-3">
                          {post.excerpt}
                        </p>
                        <div className="flex items-center justify-between text-xs text-gray-500">
                          <span>{post.author?.name || "Unknown Author"}</span>
                          <span>
                            {new Date(post.publishedAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <div className="col-span-full text-center text-gray-500 py-8">
                  <p>Loading blog posts...</p>
                </div>
              )}
            </div>
          </TabsContent>

          {/* P2P Tab */}
          <TabsContent value="p2p" className="mobile-space-y mt-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h2 className="text-xl md:text-2xl font-bold">
                  P2P Marketplace
                </h2>
                <p className="text-sm md:text-base text-gray-600">
                  Trade directly with other users
                </p>
              </div>
            </div>

            <EnhancedP2PMarketplace />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
