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
  Eye,
  Heart,
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
import EnhancedCryptoPortfolio from "@/components/crypto/EnhancedCryptoPortfolio";
import ApiStatusIndicator from "@/components/crypto/ApiStatusIndicator";
import CryptoDetailModal from "@/components/crypto/CryptoDetailModal";
import CryptoDepositModal from "@/components/crypto/CryptoDepositModal";
import CryptoWithdrawModal from "@/components/crypto/CryptoWithdrawModal";
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
  const [showCryptoDepositModal, setShowCryptoDepositModal] = useState(false);
  const [showCryptoWithdrawModal, setShowCryptoWithdrawModal] = useState(false);

  const { toast } = useToast();

  useEffect(() => {
    loadCryptoData();
  }, []);

  // Real-time updates every 30 seconds
  useEffect(() => {
    const interval = setInterval(updateRealTimeData, 30000);
    return () => clearInterval(interval);
  }, [selectedPair]);

  // Listen for P2P navigation events from portfolio
  useEffect(() => {
    const handleNavigateToP2P = () => {
      setActiveTab("p2p");
    };

    window.addEventListener('navigate-to-p2p', handleNavigateToP2P);
    return () => {
      window.removeEventListener('navigate-to-p2p', handleNavigateToP2P);
    };
  }, []);

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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50/30 dark:from-slate-900 dark:to-blue-950/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
        <div className="space-y-4 sm:space-y-6 lg:space-y-8">
          {/* Enhanced Header */}
          <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-xl border border-white/20 shadow-lg p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg">
                    <TrendingUp className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                  </div>
                  <div>
                    <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                      Cryptocurrency Hub
                    </h1>
                    <p className="text-sm sm:text-base lg:text-lg text-muted-foreground">
                      Trade, learn, and manage your crypto portfolio with
                      professional tools
                    </p>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <ApiStatusIndicator showDetails={true} />
                <div className="hidden sm:flex items-center gap-2 px-3 py-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-xs font-medium text-green-700 dark:text-green-300">
                    Live Market
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Overview Content - Direct Layout */}
          <div className="space-y-4 sm:space-y-6">

            {/* Total Assets Balance Card - Credit Card Design */}
            <Card className="relative overflow-hidden transition-all duration-300 hover:shadow-xl hover:scale-[1.01] bg-gradient-to-br from-blue-600 via-purple-600 to-blue-700 border-0 text-white w-full max-w-5xl mx-auto">
              {/* Animated background elements */}
              <div className="absolute inset-0 overflow-hidden">
                <div className="absolute -top-4 -right-4 w-24 h-24 bg-white/10 rounded-full" />
                <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-white/5 rounded-full" />
                <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-transparent via-white/5 to-transparent animate-pulse" />
              </div>

              <CardContent className="relative z-10 p-6 sm:p-8">
                {/* Header Row */}
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <CreditCard className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
                      <TrendingUp className="absolute -top-1 -right-1 h-3 w-3 sm:h-4 sm:w-4 text-green-300" />
                    </div>
                    <div>
                      <h2 className="text-lg sm:text-xl font-bold text-white">Crypto Portfolio</h2>
                      <p className="text-white/80 text-sm">Total Assets Value</p>
                    </div>
                  </div>
                  <Badge className="bg-white/20 text-white border-white/30">
                    <Shield className="h-4 w-4 mr-1" />
                    Secure
                  </Badge>
                </div>

                {/* Main Content Row - Horizontal Layout */}
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 mb-6">
                  {/* Left: Balance Display */}
                  <div className="text-center lg:text-left">
                    <div className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white">
                      $47,852.36
                    </div>
                    <p className="text-white/70 text-sm mt-2">Total Value</p>
                  </div>

                  {/* Right: Action Buttons */}
                  <div className="flex gap-3 justify-center lg:justify-end">
                    <Button
                      onClick={() => setShowCryptoDepositModal(true)}
                      className="bg-white/20 hover:bg-white/30 text-white border border-white/30 backdrop-blur-sm transition-all duration-200 hover:scale-105"
                    >
                      <ArrowUpDown className="h-4 w-4 mr-2" />
                      Deposit
                    </Button>
                    <Button
                      onClick={() => setShowCryptoWithdrawModal(true)}
                      className="bg-white/20 hover:bg-white/30 text-white border border-white/30 backdrop-blur-sm transition-all duration-200 hover:scale-105"
                    >
                      <Wallet className="h-4 w-4 mr-2" />
                      Withdraw
                    </Button>
                  </div>
                </div>

                {/* Bottom info */}
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 border-t border-white/20 pt-4">
                  <div className="text-white/60 text-xs font-mono">
                    **** **** **** 8536
                  </div>
                  <div className="text-white/60 text-xs">
                    Last Updated: {lastUpdated.toLocaleTimeString()}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions Links */}
            <div className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm rounded-xl border border-white/20 shadow-lg p-4 sm:p-6">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Quick Actions</h3>

                {/* Mobile Quick Links - Horizontal Scroll */}
                <div className="block sm:hidden">
                  <div className="flex overflow-x-auto scrollbar-hide gap-3 pb-2">
                    <Button
                      onClick={() => window.open('/app/crypto/trading', '_blank')}
                      className="flex items-center gap-2 text-sm py-3 px-4 min-w-max bg-green-500 hover:bg-green-600 text-white rounded-lg transition-all whitespace-nowrap"
                    >
                      <ArrowUpDown className="h-4 w-4 flex-shrink-0" />
                      <span>Trading</span>
                    </Button>
                    <Button
                      onClick={() => window.open('/app/crypto/p2p', '_blank')}
                      className="flex items-center gap-2 text-sm py-3 px-4 min-w-max bg-purple-500 hover:bg-purple-600 text-white rounded-lg transition-all whitespace-nowrap"
                    >
                      <Users className="h-4 w-4 flex-shrink-0" />
                      <span>P2P</span>
                    </Button>
                    <Button
                      onClick={() => window.open('/app/crypto/portfolio', '_blank')}
                      className="flex items-center gap-2 text-sm py-3 px-4 min-w-max bg-orange-500 hover:bg-orange-600 text-white rounded-lg transition-all whitespace-nowrap"
                    >
                      <PieChart className="h-4 w-4 flex-shrink-0" />
                      <span>Portfolio</span>
                    </Button>
                    <Button
                      onClick={() => window.open('/app/crypto/learn', '_blank')}
                      className="flex items-center gap-2 text-sm py-3 px-4 min-w-max bg-indigo-500 hover:bg-indigo-600 text-white rounded-lg transition-all whitespace-nowrap"
                    >
                      <BookOpen className="h-4 w-4 flex-shrink-0" />
                      <span>Learn</span>
                    </Button>
                  </div>
                </div>

                {/* Desktop Quick Links - Grid Layout */}
                <div className="hidden sm:block">
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    <Button
                      onClick={() => window.open('/app/crypto/trading', '_blank')}
                      className="flex flex-col items-center gap-3 p-6 h-auto bg-green-500 hover:bg-green-600 text-white rounded-xl transition-all hover:scale-105 shadow-lg"
                    >
                      <ArrowUpDown className="h-8 w-8" />
                      <div className="text-center">
                        <div className="font-semibold">Trading</div>
                        <div className="text-xs text-green-100">Buy & Sell</div>
                      </div>
                    </Button>
                    <Button
                      onClick={() => window.open('/app/crypto/p2p', '_blank')}
                      className="flex flex-col items-center gap-3 p-6 h-auto bg-purple-500 hover:bg-purple-600 text-white rounded-xl transition-all hover:scale-105 shadow-lg"
                    >
                      <Users className="h-8 w-8" />
                      <div className="text-center">
                        <div className="font-semibold">P2P Trading</div>
                        <div className="text-xs text-purple-100">Peer to Peer</div>
                      </div>
                    </Button>
                    <Button
                      onClick={() => window.open('/app/crypto/portfolio', '_blank')}
                      className="flex flex-col items-center gap-3 p-6 h-auto bg-orange-500 hover:bg-orange-600 text-white rounded-xl transition-all hover:scale-105 shadow-lg"
                    >
                      <PieChart className="h-8 w-8" />
                      <div className="text-center">
                        <div className="font-semibold">Portfolio</div>
                        <div className="text-xs text-orange-100">Manage Assets</div>
                      </div>
                    </Button>
                    <Button
                      onClick={() => window.open('/app/crypto/learn', '_blank')}
                      className="flex flex-col items-center gap-3 p-6 h-auto bg-indigo-500 hover:bg-indigo-600 text-white rounded-xl transition-all hover:scale-105 shadow-lg"
                    >
                      <BookOpen className="h-8 w-8" />
                      <div className="text-center">
                        <div className="font-semibold">Learn</div>
                        <div className="text-xs text-indigo-100">Education</div>
                      </div>
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            {/* Enhanced Top Cryptocurrencies */}
            <Card className="overflow-hidden border-0 shadow-xl bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
              <CardHeader className="pb-3 bg-gradient-to-r from-slate-50 to-gray-50 dark:from-slate-800 dark:to-slate-700">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg sm:text-xl font-bold flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-blue-500" />
                    Top Cryptocurrencies
                  </CardTitle>
                  <Badge variant="outline" className="text-xs">
                    Live Prices
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <div className="divide-y divide-gray-100 dark:divide-gray-700">
                  {cryptos.slice(0, 10).map((crypto, index) => (
                    <div
                      key={crypto.id}
                      onClick={() => {
                        setSelectedCrypto(crypto);
                        setIsCryptoDetailOpen(true);
                      }}
                      className="flex items-center justify-between p-3 sm:p-4 hover:bg-gradient-to-r hover:from-blue-50/50 hover:to-purple-50/50 dark:hover:from-blue-900/20 dark:hover:to-purple-900/20 transition-all duration-200 cursor-pointer group relative"
                    >
                      {/* Rank Badge */}
                      <div className="absolute left-1 top-1 sm:relative sm:left-auto sm:top-auto">
                        <Badge
                          variant="outline"
                          className={cn(
                            "text-xs px-1.5 py-0.5 font-bold",
                            index < 3 &&
                              "bg-gradient-to-r from-yellow-400 to-orange-500 text-white border-0",
                            index >= 3 &&
                              index < 10 &&
                              "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300",
                          )}
                        >
                          #{crypto.market_cap_rank}
                        </Badge>
                      </div>

                      <div className="flex items-center gap-3 sm:gap-4 flex-1 min-w-0 pl-12 sm:pl-0">
                        <div className="relative">
                          <img
                            src={crypto.image}
                            alt={crypto.name}
                            className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 rounded-full flex-shrink-0 ring-2 ring-white dark:ring-gray-700 shadow-sm group-hover:ring-blue-200 transition-all"
                          />
                          <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white dark:border-gray-800 hidden sm:block"></div>
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2">
                            <p className="font-semibold text-sm sm:text-base lg:text-lg truncate group-hover:text-blue-600 transition-colors">
                              {crypto.name}
                            </p>
                            <span className="text-xs sm:text-sm text-muted-foreground bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded-full font-medium flex-shrink-0">
                              {crypto.symbol.toUpperCase()}
                            </span>
                          </div>
                          <p className="text-xs sm:text-sm text-muted-foreground mt-1 hidden sm:block">
                            Market Cap:{" "}
                            {formatCurrency(crypto.market_cap || 0)}
                          </p>
                        </div>
                      </div>
                      <div className="text-right flex-shrink-0 space-y-1">
                        <p className="font-bold text-sm sm:text-base lg:text-lg">
                          {formatCurrency(crypto.current_price)}
                        </p>
                        <div
                          className={cn(
                            "flex items-center gap-1 justify-end px-2 py-1 rounded-full text-xs sm:text-sm font-semibold",
                            crypto.price_change_percentage_24h >= 0
                              ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300"
                              : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300",
                          )}
                        >
                          {crypto.price_change_percentage_24h >= 0 ? (
                            <TrendingUp className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
                          ) : (
                            <TrendingDown className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
                          )}
                          <span>
                            {formatPercentage(
                              crypto.price_change_percentage_24h,
                            )}
                          </span>
                        </div>
                      </div>

                      {/* Hover Effect Arrow */}
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity ml-2">
                        <ArrowUpDown className="h-4 w-4 text-blue-500" />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Market Movers - Tabbed Interface */}
            {marketData && (
              <Card className="overflow-hidden border-0 shadow-xl bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
                <Tabs defaultValue="gainers" className="w-full">
                  <div className="flex items-center justify-between p-4 border-b">
                    <h3 className="text-lg font-semibold">Market Movers (24h)</h3>
                    <TabsList className="grid w-48 grid-cols-2">
                      <TabsTrigger value="gainers" className="flex items-center gap-1">
                        <TrendingUp className="h-4 w-4 text-green-600" />
                        Gainers
                      </TabsTrigger>
                      <TabsTrigger value="losers" className="flex items-center gap-1">
                        <TrendingDown className="h-4 w-4 text-red-600" />
                        Losers
                      </TabsTrigger>
                    </TabsList>
                  </div>

                  <TabsContent value="gainers" className="m-0">
                    <CardContent className="p-4">
                      <div className="space-y-3">
                        {marketData.topMovers?.gainers?.length > 0 ? (
                          marketData.topMovers.gainers
                            .slice(0, 6)
                            .map((crypto) => (
                              <div
                                key={crypto.id}
                                className="flex items-center justify-between p-3 rounded-lg hover:bg-green-50 dark:hover:bg-green-900/20 transition-colors"
                              >
                                <div className="flex items-center gap-3 min-w-0 flex-1">
                                  <img
                                    src={crypto.image}
                                    alt={crypto.name}
                                    className="w-8 h-8 rounded-full flex-shrink-0"
                                  />
                                  <span className="font-medium text-base truncate">
                                    {crypto.symbol?.toUpperCase() || "N/A"}
                                  </span>
                                </div>
                                <div className="text-right flex-shrink-0">
                                  <div className="font-semibold text-base">
                                    {formatCurrency(crypto.current_price || 0)}
                                  </div>
                                  <div className="text-green-600 text-sm font-medium">
                                    {formatPercentage(crypto.price_change_percentage_24h || 0)}
                                  </div>
                                </div>
                              </div>
                            ))
                        ) : (
                          <div className="text-center text-muted-foreground py-8">
                            <p>No gainers data available</p>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </TabsContent>

                  <TabsContent value="losers" className="m-0">
                    <CardContent className="p-4">
                      <div className="space-y-3">
                        {marketData.topMovers?.losers?.length > 0 ? (
                          marketData.topMovers.losers
                            .slice(0, 6)
                            .map((crypto) => (
                              <div
                                key={crypto.id}
                                className="flex items-center justify-between p-3 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                              >
                                <div className="flex items-center gap-3 min-w-0 flex-1">
                                  <img
                                    src={crypto.image}
                                    alt={crypto.name}
                                    className="w-8 h-8 rounded-full flex-shrink-0"
                                  />
                                  <span className="font-medium text-base truncate">
                                    {crypto.symbol?.toUpperCase() || "N/A"}
                                  </span>
                                </div>
                                <div className="text-right flex-shrink-0">
                                  <div className="font-semibold text-base">
                                    {formatCurrency(crypto.current_price || 0)}
                                  </div>
                                  <div className="text-red-600 text-sm font-medium">
                                    {formatPercentage(crypto.price_change_percentage_24h || 0)}
                                  </div>
                                </div>
                              </div>
                            ))
                        ) : (
                          <div className="text-center text-muted-foreground py-8">
                            <p>No losers data available</p>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </TabsContent>
                </Tabs>
              </Card>
            )}
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

          {/* Crypto Deposit Modal */}
          <CryptoDepositModal
            isOpen={showCryptoDepositModal}
            onClose={() => setShowCryptoDepositModal(false)}
            selectedCrypto="BTC"
            onSuccess={() => {
              toast({
                title: "Deposit Successful",
                description: "Your crypto deposit has been processed.",
              });
              setShowCryptoDepositModal(false);
            }}
          />

          {/* Crypto Withdraw Modal */}
          <CryptoWithdrawModal
            isOpen={showCryptoWithdrawModal}
            onClose={() => setShowCryptoWithdrawModal(false)}
            selectedCrypto="BTC"
            onSuccess={() => {
              toast({
                title: "Withdrawal Successful",
                description: "Your crypto withdrawal has been processed.",
              });
              setShowCryptoWithdrawModal(false);
            }}
          />
        </div>
      </div>
    </div>
  );
}
