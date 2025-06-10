import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  TrendingUp,
  TrendingDown,
  BarChart3,
  Activity,
  DollarSign,
  Shield,
  AlertTriangle,
  Settings,
  Bookmark,
  Eye,
  Bell,
  Target,
  Clock,
  Zap,
  Star,
  Users,
  PieChart,
  LineChart,
  CandlestickChart,
  Wallet,
} from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { cryptoService } from "@/services/cryptoService";
import {
  Cryptocurrency,
  TradingPair,
  OrderBook,
  Trade,
  Order,
  Portfolio,
  Alert,
  WatchlistItem,
} from "@/types/crypto";
import { cn } from "@/lib/utils";

interface EnhancedTradingDashboardProps {
  selectedPair?: string;
  onPairSelect?: (pair: string) => void;
}

export default function EnhancedTradingDashboard({
  selectedPair = "BTCUSDT",
  onPairSelect,
}: EnhancedTradingDashboardProps) {
  const [activeTab, setActiveTab] = useState("overview");
  const [cryptos, setCryptos] = useState<Cryptocurrency[]>([]);
  const [tradingPairs, setTradingPairs] = useState<TradingPair[]>([]);
  const [orderBook, setOrderBook] = useState<OrderBook | null>(null);
  const [recentTrades, setRecentTrades] = useState<Trade[]>([]);
  const [portfolio, setPortfolio] = useState<Portfolio | null>(null);
  const [watchlist, setWatchlist] = useState<WatchlistItem[]>([]);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [openOrders, setOpenOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [priceAlertValue, setPriceAlertValue] = useState("");
  const [showAlertDialog, setShowAlertDialog] = useState(false);

  const { toast } = useToast();

  // Load initial data
  useEffect(() => {
    loadDashboardData();
  }, []);

  // Real-time data updates
  useEffect(() => {
    const interval = setInterval(() => {
      updateRealTimeData();
    }, 2000);

    return () => clearInterval(interval);
  }, [selectedPair]);

  const loadDashboardData = async () => {
    setIsLoading(true);
    try {
      const [
        cryptosData,
        tradingPairsData,
        orderBookData,
        recentTradesData,
        portfolioData,
        watchlistData,
      ] = await Promise.all([
        cryptoService.getCryptocurrencies(50),
        cryptoService.getTradingPairs(),
        cryptoService.getOrderBook(selectedPair),
        cryptoService.getRecentTrades(selectedPair, 20),
        cryptoService.getPortfolio(),
        cryptoService.getWatchlist(),
      ]);

      setCryptos(cryptosData);
      setTradingPairs(tradingPairsData);
      setOrderBook(orderBookData);
      setRecentTrades(recentTradesData);
      setPortfolio(portfolioData);
      setWatchlist(watchlistData);
    } catch (error) {
      console.error("Failed to load dashboard data:", error);
      toast({
        title: "Error",
        description: "Failed to load trading data",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const updateRealTimeData = async () => {
    try {
      const [newOrderBook, newTrades] = await Promise.all([
        cryptoService.getOrderBook(selectedPair),
        cryptoService.getRecentTrades(selectedPair, 10),
      ]);

      setOrderBook(newOrderBook);
      setRecentTrades((prev) => [...newTrades, ...prev].slice(0, 50));
    } catch (error) {
      console.error("Failed to update real-time data:", error);
    }
  };

  const handleAddToWatchlist = async (asset: string) => {
    try {
      const newItem = await cryptoService.addToWatchlist(asset);
      setWatchlist((prev) => [...prev, newItem]);
      toast({
        title: "Added to Watchlist",
        description: `${asset} has been added to your watchlist`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add to watchlist",
        variant: "destructive",
      });
    }
  };

  const handleCreateAlert = async () => {
    if (!priceAlertValue) return;

    try {
      const currentPair = tradingPairs.find((p) => p.symbol === selectedPair);
      if (!currentPair) return;

      const newAlert = await cryptoService.createAlert({
        type: "PRICE",
        asset: currentPair.baseAsset,
        condition:
          parseFloat(priceAlertValue) > currentPair.price ? "ABOVE" : "BELOW",
        value: parseFloat(priceAlertValue),
        currentValue: currentPair.price,
        message: `${currentPair.baseAsset} price ${parseFloat(priceAlertValue) > currentPair.price ? "above" : "below"} $${priceAlertValue}`,
        isActive: true,
      });

      setAlerts((prev) => [...prev, newAlert]);
      setPriceAlertValue("");
      setShowAlertDialog(false);

      toast({
        title: "Alert Created",
        description: "You will be notified when the price condition is met",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create alert",
        variant: "destructive",
      });
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
      maximumFractionDigits: 6,
    }).format(price);
  };

  const formatPercentage = (value: number) => {
    return `${value >= 0 ? "+" : ""}${value.toFixed(2)}%`;
  };

  const getCurrentPair = () => {
    return tradingPairs.find((p) => p.symbol === selectedPair);
  };

  const currentPair = getCurrentPair();

  return (
    <div className="space-y-6">
      {/* Header with Pair Selection */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold">Trading Dashboard</h1>
            <p className="text-gray-600">
              Advanced crypto trading with real-time data
            </p>
          </div>

          {currentPair && (
            <div className="flex items-center gap-3">
              <Badge variant="outline" className="text-lg px-3 py-1">
                {currentPair.baseAsset}/{currentPair.quoteAsset}
              </Badge>
              <div className="text-right">
                <div className="text-2xl font-bold">
                  {formatPrice(currentPair.price)}
                </div>
                <div
                  className={cn(
                    "text-sm font-medium flex items-center gap-1",
                    currentPair.priceChangePercent >= 0
                      ? "text-green-600"
                      : "text-red-600",
                  )}
                >
                  {currentPair.priceChangePercent >= 0 ? (
                    <TrendingUp className="h-4 w-4" />
                  ) : (
                    <TrendingDown className="h-4 w-4" />
                  )}
                  {formatPercentage(currentPair.priceChangePercent)}
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="flex items-center gap-2">
          <Dialog open={showAlertDialog} onOpenChange={setShowAlertDialog}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm">
                <Bell className="h-4 w-4 mr-2" />
                Create Alert
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create Price Alert</DialogTitle>
                <DialogDescription>
                  Get notified when the price reaches your target level
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium">
                    Target Price (USD)
                  </label>
                  <Input
                    type="number"
                    placeholder="Enter price"
                    value={priceAlertValue}
                    onChange={(e) => setPriceAlertValue(e.target.value)}
                  />
                </div>
                <div className="flex justify-end gap-2">
                  <Button
                    variant="outline"
                    onClick={() => setShowAlertDialog(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleCreateAlert}
                    disabled={!priceAlertValue}
                  >
                    Create Alert
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>

          <Button
            variant="outline"
            size="sm"
            onClick={() =>
              currentPair && handleAddToWatchlist(currentPair.baseAsset)
            }
          >
            <Star className="h-4 w-4 mr-2" />
            Watch
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2 md:grid-cols-6">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="trading">Trading</TabsTrigger>
          <TabsTrigger value="portfolio">Portfolio</TabsTrigger>
          <TabsTrigger value="watchlist">Watchlist</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="alerts">Alerts</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Market Stats */}
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <BarChart3 className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <div className="text-sm text-gray-600">Market Cap</div>
                    <div className="text-xl font-bold">$1.75T</div>
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
                    <div className="text-xl font-bold">$85B</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <Target className="h-5 w-5 text-purple-600" />
                  </div>
                  <div>
                    <div className="text-sm text-gray-600">BTC Dominance</div>
                    <div className="text-xl font-bold">48.5%</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-orange-100 rounded-lg">
                    <Zap className="h-5 w-5 text-orange-600" />
                  </div>
                  <div>
                    <div className="text-sm text-gray-600">Fear & Greed</div>
                    <div className="text-xl font-bold">75 (Greed)</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Top Cryptocurrencies */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Top Cryptocurrencies
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {cryptos.slice(0, 10).map((crypto) => (
                  <div
                    key={crypto.id}
                    className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50"
                  >
                    <div className="flex items-center gap-3">
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
                        {formatPrice(crypto.current_price)}
                      </div>
                      <div
                        className={cn(
                          "text-sm",
                          crypto.price_change_percentage_24h >= 0
                            ? "text-green-600"
                            : "text-red-600",
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
        </TabsContent>

        {/* Trading Tab */}
        <TabsContent value="trading" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Order Book */}
            <Card>
              <CardHeader>
                <CardTitle>Order Book</CardTitle>
              </CardHeader>
              <CardContent>
                {orderBook ? (
                  <div className="space-y-4">
                    {/* Asks */}
                    <div>
                      <div className="text-sm font-medium text-gray-600 mb-2">
                        Asks
                      </div>
                      <div className="space-y-1">
                        {orderBook.asks.slice(0, 10).map((ask, index) => (
                          <div
                            key={index}
                            className="flex justify-between text-sm"
                          >
                            <span className="text-red-600">
                              {ask.price.toFixed(2)}
                            </span>
                            <span>{ask.quantity.toFixed(6)}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Current Price */}
                    {currentPair && (
                      <div className="text-center py-2 border-y">
                        <div className="text-lg font-bold">
                          {formatPrice(currentPair.price)}
                        </div>
                        <div className="text-sm text-gray-600">Last Price</div>
                      </div>
                    )}

                    {/* Bids */}
                    <div>
                      <div className="text-sm font-medium text-gray-600 mb-2">
                        Bids
                      </div>
                      <div className="space-y-1">
                        {orderBook.bids.slice(0, 10).map((bid, index) => (
                          <div
                            key={index}
                            className="flex justify-between text-sm"
                          >
                            <span className="text-green-600">
                              {bid.price.toFixed(2)}
                            </span>
                            <span>{bid.quantity.toFixed(6)}</span>
                          </div>
                        ))}
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

            {/* Recent Trades */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Trades</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm font-medium text-gray-600">
                    <span>Price</span>
                    <span>Amount</span>
                    <span>Time</span>
                  </div>
                  {recentTrades.slice(0, 15).map((trade) => (
                    <div
                      key={trade.id}
                      className="flex justify-between text-sm"
                    >
                      <span
                        className={cn(
                          "font-medium",
                          trade.isBuyerMaker
                            ? "text-red-600"
                            : "text-green-600",
                        )}
                      >
                        {trade.price.toFixed(2)}
                      </span>
                      <span>{trade.quantity.toFixed(6)}</span>
                      <span className="text-gray-500">
                        {new Date(trade.time).toLocaleTimeString()}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Trading Panel */}
            <Card>
              <CardHeader>
                <CardTitle>Place Order</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <Tabs defaultValue="buy" className="w-full">
                    <TabsList className="grid w-full grid-cols-2">
                      <TabsTrigger value="buy" className="text-green-600">
                        Buy
                      </TabsTrigger>
                      <TabsTrigger value="sell" className="text-red-600">
                        Sell
                      </TabsTrigger>
                    </TabsList>

                    <TabsContent value="buy" className="space-y-4">
                      <div>
                        <label className="text-sm font-medium">
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
                        <label className="text-sm font-medium">
                          Price (USDT)
                        </label>
                        <Input
                          type="number"
                          placeholder="0.00"
                          defaultValue={currentPair?.price.toFixed(2)}
                        />
                      </div>

                      <div>
                        <label className="text-sm font-medium">
                          Amount (BTC)
                        </label>
                        <Input type="number" placeholder="0.00000000" />
                      </div>

                      <div>
                        <label className="text-sm font-medium">
                          Total (USDT)
                        </label>
                        <Input type="number" placeholder="0.00" />
                      </div>

                      <Button className="w-full bg-green-600 hover:bg-green-700">
                        Buy {currentPair?.baseAsset}
                      </Button>
                    </TabsContent>

                    <TabsContent value="sell" className="space-y-4">
                      <div>
                        <label className="text-sm font-medium">
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
                        <label className="text-sm font-medium">
                          Price (USDT)
                        </label>
                        <Input
                          type="number"
                          placeholder="0.00"
                          defaultValue={currentPair?.price.toFixed(2)}
                        />
                      </div>

                      <div>
                        <label className="text-sm font-medium">
                          Amount (BTC)
                        </label>
                        <Input type="number" placeholder="0.00000000" />
                      </div>

                      <div>
                        <label className="text-sm font-medium">
                          Total (USDT)
                        </label>
                        <Input type="number" placeholder="0.00" />
                      </div>

                      <Button className="w-full bg-red-600 hover:bg-red-700">
                        Sell {currentPair?.baseAsset}
                      </Button>
                    </TabsContent>
                  </Tabs>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Portfolio Tab */}
        <TabsContent value="portfolio" className="space-y-6">
          {portfolio ? (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Portfolio Summary */}
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Wallet className="h-5 w-5" />
                    Portfolio Overview
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-3xl font-bold">
                          {formatPrice(portfolio.totalValue)}
                        </div>
                        <div
                          className={cn(
                            "text-lg font-medium",
                            portfolio.totalChangePercent24h >= 0
                              ? "text-green-600"
                              : "text-red-600",
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
                            portfolio.totalChange24h >= 0
                              ? "text-green-600"
                              : "text-red-600",
                          )}
                        >
                          {formatPrice(portfolio.totalChange24h)}
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
                              {formatPrice(asset.usdValue)}
                            </div>
                            <div
                              className={cn(
                                "text-sm",
                                asset.changePercent24h >= 0
                                  ? "text-green-600"
                                  : "text-red-600",
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
            <div className="text-center py-12">
              <Wallet className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No Portfolio Data</h3>
              <p className="text-gray-600">
                Start trading to see your portfolio here
              </p>
            </div>
          )}
        </TabsContent>

        {/* Watchlist Tab */}
        <TabsContent value="watchlist" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Star className="h-5 w-5" />
                My Watchlist
              </CardTitle>
            </CardHeader>
            <CardContent>
              {watchlist.length > 0 ? (
                <div className="space-y-3">
                  {watchlist.map((item) => {
                    const crypto = cryptos.find(
                      (c) => c.symbol === item.asset.toLowerCase(),
                    );
                    return (
                      <div
                        key={item.id}
                        className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50"
                      >
                        <div className="flex items-center gap-3">
                          {crypto && (
                            <img
                              src={crypto.image}
                              alt={crypto.name}
                              className="w-8 h-8 rounded-full"
                            />
                          )}
                          <div>
                            <div className="font-medium">{item.asset}</div>
                            {item.notes && (
                              <div className="text-sm text-gray-600">
                                {item.notes}
                              </div>
                            )}
                          </div>
                        </div>

                        {crypto && (
                          <div className="text-right">
                            <div className="font-semibold">
                              {formatPrice(crypto.current_price)}
                            </div>
                            <div
                              className={cn(
                                "text-sm",
                                crypto.price_change_percentage_24h >= 0
                                  ? "text-green-600"
                                  : "text-red-600",
                              )}
                            >
                              {formatPercentage(
                                crypto.price_change_percentage_24h,
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-12">
                  <Star className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">
                    No Watchlist Items
                  </h3>
                  <p className="text-gray-600">
                    Add cryptocurrencies to track their performance
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Analytics Tab */}
        <TabsContent value="analytics" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Performance Analytics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12 text-gray-500">
                  <LineChart className="h-12 w-12 mx-auto mb-4" />
                  <p>Advanced analytics coming soon...</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Trading Statistics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12 text-gray-500">
                  <BarChart3 className="h-12 w-12 mx-auto mb-4" />
                  <p>Trading stats will appear here</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Alerts Tab */}
        <TabsContent value="alerts" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                Price Alerts
              </CardTitle>
            </CardHeader>
            <CardContent>
              {alerts.length > 0 ? (
                <div className="space-y-3">
                  {alerts.map((alert) => (
                    <div
                      key={alert.id}
                      className="flex items-center justify-between p-3 rounded-lg border"
                    >
                      <div>
                        <div className="font-medium">{alert.message}</div>
                        <div className="text-sm text-gray-600">
                          Created{" "}
                          {new Date(alert.createdAt).toLocaleDateString()}
                        </div>
                      </div>
                      <Badge variant={alert.isActive ? "default" : "secondary"}>
                        {alert.isActive ? "Active" : "Inactive"}
                      </Badge>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <Bell className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">
                    No Active Alerts
                  </h3>
                  <p className="text-gray-600">
                    Create price alerts to stay informed
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
