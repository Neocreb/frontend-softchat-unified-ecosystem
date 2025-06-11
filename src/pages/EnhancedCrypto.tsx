import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
  ArrowUpDown,
  Plus,
  Minus,
  Bell,
  Star,
} from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { cryptoService } from "@/services/cryptoService";
import {
  Cryptocurrency,
  MarketData,
  Portfolio,
  OrderBook,
  Trade,
} from "@/types/crypto";
import { cn } from "@/lib/utils";

export default function EnhancedCrypto() {
  const [cryptos, setCryptos] = useState<Cryptocurrency[]>([]);
  const [marketData, setMarketData] = useState<MarketData | null>(null);
  const [portfolio, setPortfolio] = useState<Portfolio | null>(null);
  const [orderBook, setOrderBook] = useState<OrderBook | null>(null);
  const [recentTrades, setRecentTrades] = useState<Trade[]>([]);
  const [selectedPair, setSelectedPair] = useState("BTCUSDT");
  const [orderType, setOrderType] = useState("limit");
  const [side, setSide] = useState<"buy" | "sell">("buy");
  const [price, setPrice] = useState("");
  const [amount, setAmount] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  const { toast } = useToast();

  useEffect(() => {
    loadCryptoData();
    const interval = setInterval(updateRealTimeData, 3000);
    return () => clearInterval(interval);
  }, [selectedPair]);

  const loadCryptoData = async () => {
    setIsLoading(true);
    try {
      const [
        cryptosData,
        marketDataResult,
        portfolioData,
        orderBookData,
        tradesData,
      ] = await Promise.all([
        cryptoService.getCryptocurrencies(15),
        cryptoService.getMarketData(),
        cryptoService.getPortfolio(),
        cryptoService.getOrderBook(selectedPair),
        cryptoService.getRecentTrades(selectedPair, 10),
      ]);

      setCryptos(cryptosData);
      setMarketData(marketDataResult);
      setPortfolio(portfolioData);
      setOrderBook(orderBookData);
      setRecentTrades(tradesData);
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
      const [newOrderBook, newTrades] = await Promise.all([
        cryptoService.getOrderBook(selectedPair),
        cryptoService.getRecentTrades(selectedPair, 5),
      ]);
      setOrderBook(newOrderBook);
      setRecentTrades((prev) => [...newTrades, ...prev].slice(0, 10));
    } catch (error) {
      console.error("Failed to update real-time data:", error);
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

  if (isLoading) {
    return (
      <div className="mobile-container mobile-space-y">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/3"></div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-24 bg-gray-200 rounded"></div>
            ))}
          </div>
          <div className="h-96 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="mobile-container mobile-space-y">
      {/* Header with Market Overview */}
      <div className="mobile-flex lg:items-center lg:justify-between">
        <div className="min-w-0 flex-1">
          <h1 className="text-xl md:text-2xl lg:text-3xl font-bold">
            Crypto Trading
          </h1>
          <p className="mobile-text text-gray-600 mt-1">
            Trade cryptocurrencies with real-time market data
          </p>
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

      {/* Market Stats */}
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

      {/* Main Trading Interface */}
      <div className="grid grid-cols-1 xl:grid-cols-4 gap-4 md:gap-6">
        {/* Cryptocurrency List & Pair Selection */}
        <Card className="xl:col-span-1">
          <CardHeader className="pb-3">
            <CardTitle className="text-base md:text-lg">Markets</CardTitle>
          </CardHeader>
          <CardContent className="px-3 md:px-6">
            <div className="space-y-2">
              {cryptos.map((crypto) => {
                const pairSymbol = crypto.symbol.toUpperCase() + "USDT";
                const isSelected = selectedPair === pairSymbol;
                return (
                  <div
                    key={crypto.id}
                    className={cn(
                      "flex items-center justify-between p-2 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors",
                      isSelected && "bg-blue-50 border border-blue-200",
                    )}
                    onClick={() => setSelectedPair(pairSymbol)}
                  >
                    <div className="flex items-center gap-2 min-w-0 flex-1">
                      <img
                        src={crypto.image}
                        alt={crypto.name}
                        className="w-6 h-6 rounded-full flex-shrink-0"
                      />
                      <div className="min-w-0">
                        <div className="font-medium text-sm truncate">
                          {crypto.symbol.toUpperCase()}
                        </div>
                        <div className="text-xs text-gray-600 truncate">
                          {crypto.name}
                        </div>
                      </div>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <div className="font-semibold text-sm">
                        {formatCurrency(crypto.current_price)}
                      </div>
                      <div
                        className={cn(
                          "text-xs",
                          getChangeColor(crypto.price_change_percentage_24h),
                        )}
                      >
                        {formatPercentage(crypto.price_change_percentage_24h)}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Order Book & Recent Trades */}
        <Card className="xl:col-span-1">
          <CardHeader className="pb-3">
            <CardTitle className="text-base md:text-lg">Order Book</CardTitle>
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
                      <div key={index} className="flex justify-between text-xs">
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
                      <div key={index} className="flex justify-between text-xs">
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
                      <div key={index} className="flex justify-between text-xs">
                        <span
                          className={cn(
                            "font-mono",
                            trade.isBuyerMaker
                              ? "text-red-600"
                              : "text-green-600",
                          )}
                        >
                          {trade.price.toFixed(2)}
                        </span>
                        <span className="font-mono">
                          {trade.quantity.toFixed(4)}
                        </span>
                        <span className="text-gray-500">
                          {new Date(trade.time).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">Loading...</div>
            )}
          </CardContent>
        </Card>

        {/* Trading Panel */}
        <Card className="xl:col-span-1">
          <CardHeader className="pb-3">
            <CardTitle className="text-base md:text-lg">Place Order</CardTitle>
          </CardHeader>
          <CardContent className="px-3 md:px-6">
            <div className="space-y-4">
              {/* Buy/Sell Toggle */}
              <div className="grid grid-cols-2 gap-2">
                <Button
                  variant={side === "buy" ? "default" : "outline"}
                  onClick={() => setSide("buy")}
                  className={cn(
                    "w-full",
                    side === "buy" && "bg-green-600 hover:bg-green-700",
                  )}
                >
                  Buy
                </Button>
                <Button
                  variant={side === "sell" ? "default" : "outline"}
                  onClick={() => setSide("sell")}
                  className={cn(
                    "w-full",
                    side === "sell" && "bg-red-600 hover:bg-red-700",
                  )}
                >
                  Sell
                </Button>
              </div>

              {/* Order Type */}
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

              {/* Price */}
              <div>
                <label className="text-xs font-medium mb-1 block">
                  Price (USDT)
                </label>
                <input
                  type="number"
                  placeholder="0.00"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm font-mono"
                />
              </div>

              {/* Amount */}
              <div>
                <label className="text-xs font-medium mb-1 block">
                  Amount ({selectedPair.replace("USDT", "")})
                </label>
                <input
                  type="number"
                  placeholder="0.00000000"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm font-mono"
                />
              </div>

              {/* Total */}
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
                className={cn(
                  "w-full",
                  side === "buy"
                    ? "bg-green-600 hover:bg-green-700"
                    : "bg-red-600 hover:bg-red-700",
                )}
              >
                {side === "buy" ? "Buy" : "Sell"}{" "}
                {selectedPair.replace("USDT", "")}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Portfolio */}
        <Card className="xl:col-span-1">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base md:text-lg">
              <Wallet className="h-4 w-4 md:h-5 md:w-5" />
              Portfolio
            </CardTitle>
          </CardHeader>
          <CardContent className="px-3 md:px-6">
            {portfolio ? (
              <div className="space-y-4">
                <div className="text-center">
                  <div className="text-2xl font-bold">
                    {formatCurrency(portfolio.totalValue)}
                  </div>
                  <div
                    className={cn(
                      "text-sm font-medium",
                      getChangeColor(portfolio.totalChangePercent24h),
                    )}
                  >
                    {formatPercentage(portfolio.totalChangePercent24h)} (24h)
                  </div>
                </div>

                <div className="space-y-2">
                  {portfolio.assets.slice(0, 6).map((asset) => (
                    <div
                      key={asset.asset}
                      className="flex items-center justify-between p-2 rounded-lg bg-gray-50"
                    >
                      <div className="flex items-center gap-2 min-w-0 flex-1">
                        <div className="w-2 h-2 rounded-full bg-blue-500 flex-shrink-0"></div>
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

                <div className="pt-3 border-t">
                  <div className="text-xs text-gray-600 mb-2">
                    Quick Actions
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <Button variant="outline" size="sm" className="text-xs">
                      <Plus className="h-3 w-3 mr-1" />
                      Deposit
                    </Button>
                    <Button variant="outline" size="sm" className="text-xs">
                      <Minus className="h-3 w-3 mr-1" />
                      Withdraw
                    </Button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <Wallet className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                <p className="text-sm text-gray-600">No portfolio data</p>
                <Button size="sm" className="mt-2">
                  Start Trading
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
