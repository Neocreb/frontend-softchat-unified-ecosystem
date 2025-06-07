import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
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
  Bell
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface OrderBookEntry {
  price: number;
  amount: number;
  total: number;
}

interface Trade {
  id: string;
  price: number;
  amount: number;
  time: string;
  type: 'buy' | 'sell';
}

interface Order {
  id: string;
  type: 'market' | 'limit' | 'stop-loss' | 'take-profit';
  side: 'buy' | 'sell';
  amount: number;
  price?: number;
  stopPrice?: number;
  status: 'pending' | 'filled' | 'cancelled';
  filled: number;
  timestamp: string;
}

interface CandlestickData {
  time: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

const AdvancedTradingInterface: React.FC = () => {
  const [selectedPair, setSelectedPair] = useState('BTC/USDT');
  const [orderType, setOrderType] = useState<'market' | 'limit' | 'stop-loss'>('limit');
  const [orderSide, setOrderSide] = useState<'buy' | 'sell'>('buy');
  const [amount, setAmount] = useState('');
  const [price, setPrice] = useState('');
  const [stopPrice, setStopPrice] = useState('');
  const [orderBook, setOrderBook] = useState<{asks: OrderBookEntry[], bids: OrderBookEntry[]}>({
    asks: [],
    bids: []
  });
  const [recentTrades, setRecentTrades] = useState<Trade[]>([]);
  const [openOrders, setOpenOrders] = useState<Order[]>([]);
  const [orderHistory, setOrderHistory] = useState<Order[]>([]);
  const [currentPrice, setCurrentPrice] = useState(43250.50);
  const [priceChange, setPriceChange] = useState(2.34);
  const [priceChangePercent, setPriceChangePercent] = useState(0.054);
  const [volume24h, setVolume24h] = useState(1234567890);
  const [chartTimeframe, setChartTimeframe] = useState('1h');
  const [isWatchlisted, setIsWatchlisted] = useState(false);
  const chartRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  // Trading pairs data
  const tradingPairs = [
    { symbol: 'BTC/USDT', price: 43250.50, change: 2.34, changePercent: 0.054 },
    { symbol: 'ETH/USDT', price: 2650.75, change: -45.25, changePercent: -1.68 },
    { symbol: 'BNB/USDT', price: 315.80, change: 8.90, changePercent: 2.90 },
    { symbol: 'ADA/USDT', price: 0.4852, change: 0.0123, changePercent: 2.60 },
    { symbol: 'SOL/USDT', price: 98.45, change: -2.15, changePercent: -2.14 }
  ];

  const [orderBookData, setOrderBookData] = useState([
    { price: 43200, amount: 0.5, type: 'buy' },
    { price: 43250, amount: 0.3, type: 'sell' },
    { price: 43180, amount: 0.7, type: 'buy' },
    { price: 43270, amount: 0.4, type: 'sell' },
  ]);

  useEffect(() => {
    generateMockData();
    initializeChart();

    // Simulate real-time updates
    const interval = setInterval(() => {
      updateMarketData();
    }, 1000);

    return () => clearInterval(interval);
  }, [selectedPair]);

  const generateMockData = () => {
    // Generate order book data
    const basePrice = currentPrice;
    const asks: OrderBookEntry[] = [];
    const bids: OrderBookEntry[] = [];

    for (let i = 0; i < 15; i++) {
      const askPrice = basePrice + (i + 1) * 10;
      const bidPrice = basePrice - (i + 1) * 10;
      const askAmount = Math.random() * 2 + 0.1;
      const bidAmount = Math.random() * 2 + 0.1;

      asks.push({
        price: askPrice,
        amount: askAmount,
        total: askPrice * askAmount
      });

      bids.push({
        price: bidPrice,
        amount: bidAmount,
        total: bidPrice * bidAmount
      });
    }

    setOrderBook({ asks, bids });

    // Generate recent trades
    const trades: Trade[] = [];
    for (let i = 0; i < 20; i++) {
      const price = basePrice + (Math.random() - 0.5) * 100;
      const amount = Math.random() * 0.5 + 0.01;
      const time = new Date(Date.now() - i * 60000).toLocaleTimeString();

      trades.push({
        id: `trade-${i}`,
        price,
        amount,
        time,
        type: Math.random() > 0.5 ? 'buy' : 'sell'
      });
    }

    setRecentTrades(trades);

    // Generate sample orders
    const sampleOrders: Order[] = [
      {
        id: 'order-1',
        type: 'limit',
        side: 'buy',
        amount: 0.1,
        price: 43000,
        status: 'pending',
        filled: 0,
        timestamp: new Date().toISOString()
      },
      {
        id: 'order-2',
        type: 'limit',
        side: 'sell',
        amount: 0.05,
        price: 43500,
        status: 'filled',
        filled: 0.05,
        timestamp: new Date(Date.now() - 3600000).toISOString()
      }
    ];

    setOpenOrders(sampleOrders.filter(o => o.status === 'pending'));
    setOrderHistory(sampleOrders);
  };

  const updateMarketData = () => {
    const change = (Math.random() - 0.5) * 10;
    setCurrentPrice(prev => Math.max(prev + change, 1000));
    setPriceChange(change);
    setPriceChangePercent((change / currentPrice) * 100);
  };

  const initializeChart = () => {
    // In a real implementation, this would initialize TradingView or Chart.js
    if (chartRef.current) {
      chartRef.current.innerHTML = `
        <div class="flex items-center justify-center h-full bg-gray-900 rounded">
          <div class="text-center text-gray-400">
            <BarChart3 class="w-16 h-16 mx-auto mb-4" />
            <p>Advanced Trading Chart</p>
            <p class="text-sm">TradingView Integration</p>
          </div>
        </div>
      `;
    }
  };

  const handlePlaceOrder = () => {
    if (!amount || (orderType !== 'market' && !price)) {
      toast({
        title: "Invalid Order",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    const newOrder: Order = {
      id: `order-${Date.now()}`,
      type: orderType,
      side: orderSide,
      amount: parseFloat(amount),
      price: orderType !== 'market' ? parseFloat(price) : undefined,
      stopPrice: orderType === 'stop-loss' ? parseFloat(stopPrice) : undefined,
      status: 'pending',
      filled: 0,
      timestamp: new Date().toISOString()
    };

    setOpenOrders(prev => [...prev, newOrder]);
    setOrderHistory(prev => [...prev, newOrder]);

    toast({
      title: "Order Placed",
      description: `${orderSide.toUpperCase()} ${amount} ${selectedPair.split('/')[0]} at ${orderType === 'market' ? 'market price' : `$${price}`}`
    });

    // Reset form
    setAmount('');
    setPrice('');
    setStopPrice('');
  };

  const handleCancelOrder = (orderId: string) => {
    setOpenOrders(prev => prev.filter(order => order.id !== orderId));
    toast({
      title: "Order Cancelled",
      description: "Your order has been cancelled successfully"
    });
  };

  const formatNumber = (num: number, decimals: number = 2) => {
    return new Intl.NumberFormat('en-US', {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals
    }).format(num);
  };

  const formatVolume = (volume: number) => {
    if (volume >= 1e9) return `${(volume / 1e9).toFixed(2)}B`;
    if (volume >= 1e6) return `${(volume / 1e6).toFixed(2)}M`;
    if (volume >= 1e3) return `${(volume / 1e3).toFixed(2)}K`;
    return volume.toString();
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white p-4">
      <div className="grid grid-cols-12 gap-4 h-screen">

        {/* Trading Pairs Sidebar */}
        <div className="col-span-2 space-y-4">
          <Card className="bg-gray-900 border-gray-700">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <Activity className="w-5 h-5" />
                Markets
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {tradingPairs.map((pair) => (
                <div
                  key={pair.symbol}
                  className={`p-2 rounded cursor-pointer transition-colors ${
                    selectedPair === pair.symbol ? 'bg-blue-600' : 'hover:bg-gray-800'
                  }`}
                  onClick={() => setSelectedPair(pair.symbol)}
                >
                  <div className="flex justify-between items-center">
                    <span className="font-medium text-sm">{pair.symbol}</span>
                    <div className="text-right">
                      <div className="text-sm">${formatNumber(pair.price)}</div>
                      <div className={`text-xs ${pair.change >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                        {pair.change >= 0 ? '+' : ''}{pair.changePercent.toFixed(2)}%
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Main Trading Area */}
        <div className="col-span-7 space-y-4">
          {/* Price Header */}
          <Card className="bg-gray-900 border-gray-700">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <h1 className="text-2xl font-bold">{selectedPair}</h1>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setIsWatchlisted(!isWatchlisted)}
                    className={isWatchlisted ? 'text-yellow-400' : 'text-gray-400'}
                  >
                    <Bookmark className="w-4 h-4" />
                  </Button>
                </div>
                <div className="flex items-center gap-6">
                  <div>
                    <div className="text-2xl font-bold">${formatNumber(currentPrice)}</div>
                    <div className={`flex items-center gap-1 ${priceChange >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                      {priceChange >= 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                      <span>{priceChange >= 0 ? '+' : ''}{formatNumber(priceChange)} ({priceChangePercent >= 0 ? '+' : ''}{formatNumber(priceChangePercent, 3)}%)</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-gray-400">24h Volume</div>
                    <div className="font-medium">{formatVolume(volume24h)} USDT</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Chart */}
          <Card className="bg-gray-900 border-gray-700">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">Price Chart</CardTitle>
                <div className="flex items-center gap-2">
                  <Select value={chartTimeframe} onValueChange={setChartTimeframe}>
                    <SelectTrigger className="w-20 bg-gray-800 border-gray-600">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-800 border-gray-600">
                      <SelectItem value="1m">1m</SelectItem>
                      <SelectItem value="5m">5m</SelectItem>
                      <SelectItem value="15m">15m</SelectItem>
                      <SelectItem value="1h">1h</SelectItem>
                      <SelectItem value="4h">4h</SelectItem>
                      <SelectItem value="1d">1d</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button variant="ghost" size="icon">
                    <Settings className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div ref={chartRef} className="h-96 bg-gray-800 rounded"></div>
            </CardContent>
          </Card>

          {/* Recent Trades */}
          <Card className="bg-gray-900 border-gray-700">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Recent Trades</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-1 max-h-40 overflow-y-auto">
                <div className="grid grid-cols-4 text-xs text-gray-400 pb-2 border-b border-gray-700">
                  <span>Price</span>
                  <span>Amount</span>
                  <span>Total</span>
                  <span>Time</span>
                </div>
                {recentTrades.map((trade) => (
                  <div key={trade.id} className="grid grid-cols-4 text-sm py-1">
                    <span className={trade.type === 'buy' ? 'text-green-400' : 'text-red-400'}>
                      ${formatNumber(trade.price)}
                    </span>
                    <span>{formatNumber(trade.amount, 4)}</span>
                    <span>${formatNumber(trade.price * trade.amount)}</span>
                    <span className="text-gray-400">{trade.time}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Order Book & Trading Panel */}
        <div className="col-span-3 space-y-4">
          {/* Order Book */}
          <Card className="bg-gray-900 border-gray-700">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Order Book</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {/* Asks */}
                <div className="space-y-1">
                  <div className="grid grid-cols-3 text-xs text-gray-400 pb-1">
                    <span>Price</span>
                    <span>Amount</span>
                    <span>Total</span>
                  </div>
                  {orderBook.asks.slice(0, 8).reverse().map((ask, index) => (
                    <div key={index} className="grid grid-cols-3 text-xs py-0.5 hover:bg-gray-800 cursor-pointer">
                      <span className="text-red-400">${formatNumber(ask.price)}</span>
                      <span>{formatNumber(ask.amount, 4)}</span>
                      <span>{formatNumber(ask.total)}</span>
                    </div>
                  ))}
                </div>

                {/* Spread */}
                <div className="py-2 text-center border-y border-gray-700">
                  <span className="text-lg font-bold">${formatNumber(currentPrice)}</span>
                  <div className="text-xs text-gray-400">Spread: ${formatNumber(orderBook.asks[0]?.price - orderBook.bids[0]?.price || 0)}</div>
                </div>

                {/* Bids */}
                <div className="space-y-1">
                  {orderBook.bids.slice(0, 8).map((bid, index) => (
                    <div key={index} className="grid grid-cols-3 text-xs py-0.5 hover:bg-gray-800 cursor-pointer">
                      <span className="text-green-400">${formatNumber(bid.price)}</span>
                      <span>{formatNumber(bid.amount, 4)}</span>
                      <span>{formatNumber(bid.total)}</span>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Trading Panel */}
          <Card className="bg-gray-900 border-gray-700">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Place Order</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Order Type */}
              <Tabs value={orderType} onValueChange={(value) => setOrderType(value as any)}>
                <TabsList className="grid w-full grid-cols-3 bg-gray-800">
                  <TabsTrigger value="limit" className="text-xs">Limit</TabsTrigger>
                  <TabsTrigger value="market" className="text-xs">Market</TabsTrigger>
                  <TabsTrigger value="stop-loss" className="text-xs">Stop</TabsTrigger>
                </TabsList>
              </Tabs>

              {/* Buy/Sell Toggle */}
              <div className="grid grid-cols-2 gap-2">
                <Button
                  variant={orderSide === 'buy' ? 'default' : 'outline'}
                  onClick={() => setOrderSide('buy')}
                  className={orderSide === 'buy' ? 'bg-green-600 hover:bg-green-700' : ''}
                >
                  Buy
                </Button>
                <Button
                  variant={orderSide === 'sell' ? 'default' : 'outline'}
                  onClick={() => setOrderSide('sell')}
                  className={orderSide === 'sell' ? 'bg-red-600 hover:bg-red-700' : ''}
                >
                  Sell
                </Button>
              </div>

              {/* Order Inputs */}
              <div className="space-y-3">
                {orderType !== 'market' && (
                  <div>
                    <label className="text-sm text-gray-400">Price (USDT)</label>
                    <Input
                      type="number"
                      placeholder="0.00"
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      className="bg-gray-800 border-gray-600"
                    />
                  </div>
                )}

                {orderType === 'stop-loss' && (
                  <div>
                    <label className="text-sm text-gray-400">Stop Price (USDT)</label>
                    <Input
                      type="number"
                      placeholder="0.00"
                      value={stopPrice}
                      onChange={(e) => setStopPrice(e.target.value)}
                      className="bg-gray-800 border-gray-600"
                    />
                  </div>
                )}

                <div>
                  <label className="text-sm text-gray-400">Amount ({selectedPair.split('/')[0]})</label>
                  <Input
                    type="number"
                    placeholder="0.00"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="bg-gray-800 border-gray-600"
                  />
                </div>

                {/* Percentage Buttons */}
                <div className="grid grid-cols-4 gap-1">
                  {[25, 50, 75, 100].map((percent) => (
                    <Button
                      key={percent}
                      variant="outline"
                      size="sm"
                      className="text-xs"
                      onClick={() => {
                        // Calculate amount based on percentage of available balance
                        const mockBalance = 1.5; // Mock balance
                        setAmount((mockBalance * percent / 100).toFixed(4));
                      }}
                    >
                      {percent}%
                    </Button>
                  ))}
                </div>
              </div>

              {/* Total */}
              <div className="p-3 bg-gray-800 rounded">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Total:</span>
                  <span>
                    {amount && price ? 
                      `${formatNumber(parseFloat(amount) * parseFloat(price))} USDT` : 
                      '0.00 USDT'
                    }
                  </span>
                </div>
              </div>

              {/* Place Order Button */}
              <Button
                onClick={handlePlaceOrder}
                className={`w-full ${
                  orderSide === 'buy' 
                    ? 'bg-green-600 hover:bg-green-700' 
                    : 'bg-red-600 hover:bg-red-700'
                }`}
              >
                {orderSide === 'buy' ? 'Buy' : 'Sell'} {selectedPair.split('/')[0]}
              </Button>
            </CardContent>
          </Card>

          {/* Open Orders */}
          <Card className="bg-gray-900 border-gray-700">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Open Orders</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 max-h-40 overflow-y-auto">
                {openOrders.length > 0 ? (
                  openOrders.map((order) => (
                    <div key={order.id} className="p-2 bg-gray-800 rounded text-xs">
                      <div className="flex justify-between items-center mb-1">
                        <Badge variant={order.side === 'buy' ? 'default' : 'destructive'}>
                          {order.side.toUpperCase()}
                        </Badge>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleCancelOrder(order.id)}
                          className="text-red-400 hover:text-red-300 h-6 px-2"
                        >
                          Cancel
                        </Button>
                      </div>
                      <div className="space-y-1">
                        <div className="flex justify-between">
                          <span className="text-gray-400">Type:</span>
                          <span>{order.type.toUpperCase()}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Amount:</span>
                          <span>{formatNumber(order.amount, 4)}</span>
                        </div>
                        {order.price && (
                          <div className="flex justify-between">
                            <span className="text-gray-400">Price:</span>
                            <span>${formatNumber(order.price)}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center text-gray-400 py-4">
                    <p>No open orders</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AdvancedTradingInterface;