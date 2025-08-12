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
import { Input } from "@/components/ui/input";
import {
  ArrowUpDown,
  Plus,
  Minus,
  DollarSign,
  Banknote,
  ArrowLeft,
} from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { cryptoService } from "@/services/cryptoService";
import { Cryptocurrency } from "@/types/crypto";
import { cn } from "@/lib/utils";

export default function CryptoTrading() {
  const [cryptos, setCryptos] = useState<Cryptocurrency[]>([]);
  const [selectedPair, setSelectedPair] = useState("BTCUSDT");
  const [orderType, setOrderType] = useState("limit");
  const [price, setPrice] = useState("");
  const [amount, setAmount] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  const { toast } = useToast();

  useEffect(() => {
    loadCryptoData();
  }, []);

  const loadCryptoData = async () => {
    setIsLoading(true);
    try {
      const cryptoData = await cryptoService.getCryptocurrencies(20);
      setCryptos(cryptoData || []);
    } catch (error) {
      console.error("Failed to load crypto data:", error);
    } finally {
      setIsLoading(false);
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
      description: `Order for ${amount} ${selectedPair.replace("USDT", "")} at $${price}`,
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
            <p className="text-muted-foreground">Loading trading interface...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50/30 dark:from-slate-900 dark:to-blue-950/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
        <div className="space-y-4 sm:space-y-6 lg:space-y-8">
          {/* Header with Back Navigation */}
          <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-xl border border-white/20 shadow-lg p-4 sm:p-6">
            <div className="flex items-center gap-4 mb-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => window.history.back()}
                className="flex items-center gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to Overview
              </Button>
            </div>
            
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-green-600 to-red-600 bg-clip-text text-transparent">
                  Trading Dashboard
                </h1>
                <p className="text-sm sm:text-base lg:text-lg text-muted-foreground">
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
                        getChangeColor(currentPair.price_change_percentage_24h),
                      )}
                    >
                      {formatPercentage(currentPair.price_change_percentage_24h)}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Trading Interface */}
          <Card className="overflow-hidden border-0 shadow-xl bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm">
            <CardHeader className="bg-gradient-to-r from-slate-50 to-gray-50 dark:from-slate-800 dark:to-slate-700 border-b">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg sm:text-xl font-bold flex items-center gap-2">
                  <div className="p-2 bg-gradient-to-r from-green-500 to-red-500 rounded-lg">
                    <ArrowUpDown className="h-5 w-5 text-white" />
                  </div>
                  Place Order
                </CardTitle>
                <Badge variant="outline" className="text-xs">
                  Simulated Trading
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="p-4 sm:p-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
                {/* Buy Panel */}
                <div className="space-y-4 p-4 sm:p-5 bg-gradient-to-br from-green-50 to-green-100/50 dark:from-green-900/20 dark:to-green-800/20 rounded-xl border border-green-200/50 dark:border-green-700/30">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-green-500 rounded-lg">
                      <Plus className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <h3 className="font-bold text-green-700 dark:text-green-300 text-base sm:text-lg">
                        Buy {selectedPair.replace("USDT", "")}
                      </h3>
                      <p className="text-xs text-green-600/70 dark:text-green-400/70">
                        Long position
                      </p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-semibold mb-2 block text-green-700 dark:text-green-300">
                        Order Type
                      </label>
                      <Select value={orderType} onValueChange={setOrderType}>
                        <SelectTrigger className="h-11 bg-white dark:bg-slate-800 border-green-200 dark:border-green-700">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="market">
                            <div className="flex items-center gap-2">
                              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                              Market Order
                            </div>
                          </SelectItem>
                          <SelectItem value="limit">
                            <div className="flex items-center gap-2">
                              <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                              Limit Order
                            </div>
                          </SelectItem>
                          <SelectItem value="stop">
                            <div className="flex items-center gap-2">
                              <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                              Stop Order
                            </div>
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <label className="text-sm font-semibold mb-2 block text-green-700 dark:text-green-300 flex items-center gap-2">
                        <DollarSign className="w-4 h-4" />
                        Price (USDT)
                      </label>
                      <Input
                        type="number"
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                        placeholder={safeToFixed(currentPair?.current_price)}
                        className="h-11 bg-white dark:bg-slate-800 border-green-200 dark:border-green-700 focus:ring-green-500 focus:border-green-500"
                      />
                    </div>

                    <div>
                      <label className="text-sm font-semibold mb-2 block text-green-700 dark:text-green-300 flex items-center gap-2">
                        <Banknote className="w-4 h-4" />
                        Amount ({selectedPair.replace("USDT", "")})
                      </label>
                      <Input
                        type="number"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        placeholder="0.00"
                        className="h-11 bg-white dark:bg-slate-800 border-green-200 dark:border-green-700 focus:ring-green-500 focus:border-green-500"
                      />
                    </div>

                    <Button
                      className="w-full h-12 bg-gradient-to-r from-green-600 to-green-500 hover:from-green-700 hover:to-green-600 text-white font-bold shadow-lg hover:shadow-xl transition-all duration-200 flex items-center gap-2"
                      onClick={handlePlaceOrder}
                    >
                      <Plus className="w-4 h-4" />
                      Buy {selectedPair.replace("USDT", "")}
                    </Button>
                  </div>
                </div>

                {/* Sell Panel */}
                <div className="space-y-4 p-4 sm:p-5 bg-gradient-to-br from-red-50 to-red-100/50 dark:from-red-900/20 dark:to-red-800/20 rounded-xl border border-red-200/50 dark:border-red-700/30">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-red-500 rounded-lg">
                      <Minus className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <h3 className="font-bold text-red-700 dark:text-red-300 text-base sm:text-lg">
                        Sell {selectedPair.replace("USDT", "")}
                      </h3>
                      <p className="text-xs text-red-600/70 dark:text-red-400/70">
                        Short position
                      </p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-semibold mb-2 block text-red-700 dark:text-red-300">
                        Order Type
                      </label>
                      <Select value={orderType} onValueChange={setOrderType}>
                        <SelectTrigger className="h-11 bg-white dark:bg-slate-800 border-red-200 dark:border-red-700">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="market">
                            <div className="flex items-center gap-2">
                              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                              Market Order
                            </div>
                          </SelectItem>
                          <SelectItem value="limit">
                            <div className="flex items-center gap-2">
                              <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                              Limit Order
                            </div>
                          </SelectItem>
                          <SelectItem value="stop">
                            <div className="flex items-center gap-2">
                              <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                              Stop Order
                            </div>
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <label className="text-sm font-semibold mb-2 block text-red-700 dark:text-red-300 flex items-center gap-2">
                        <DollarSign className="w-4 h-4" />
                        Price (USDT)
                      </label>
                      <Input
                        type="number"
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                        placeholder={safeToFixed(currentPair?.current_price)}
                        className="h-11 bg-white dark:bg-slate-800 border-red-200 dark:border-red-700 focus:ring-red-500 focus:border-red-500"
                      />
                    </div>

                    <div>
                      <label className="text-sm font-semibold mb-2 block text-red-700 dark:text-red-300 flex items-center gap-2">
                        <Banknote className="w-4 h-4" />
                        Amount ({selectedPair.replace("USDT", "")})
                      </label>
                      <Input
                        type="number"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        placeholder="0.00"
                        className="h-11 bg-white dark:bg-slate-800 border-red-200 dark:border-red-700 focus:ring-red-500 focus:border-red-500"
                      />
                    </div>

                    <Button
                      className="w-full h-12 bg-gradient-to-r from-red-600 to-red-500 hover:from-red-700 hover:to-red-600 text-white font-bold shadow-lg hover:shadow-xl transition-all duration-200 flex items-center gap-2"
                      onClick={handlePlaceOrder}
                    >
                      <Minus className="w-4 h-4" />
                      Sell {selectedPair.replace("USDT", "")}
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
