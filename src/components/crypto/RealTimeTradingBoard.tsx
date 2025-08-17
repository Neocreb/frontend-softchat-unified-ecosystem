import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { useRealTimeTrading } from '../../hooks/use-realtime';
import { formatCurrency, formatTime } from '../../utils/formatters';
import { Loader2, TrendingUp, TrendingDown, Clock, Shield } from 'lucide-react';

interface RealTimeTradingBoardProps {
  tradingPair: string;
  onTradeSelect?: (trade: any) => void;
}

export function RealTimeTradingBoard({ tradingPair, onTradeSelect }: RealTimeTradingBoardProps) {
  const { orders, priceData, recentTrades, subscribeToPrices, createOrder } = useRealTimeTrading(tradingPair);
  const [activeTab, setActiveTab] = useState<'buy' | 'sell'>('buy');
  const [orderForm, setOrderForm] = useState({
    amount: '',
    price: '',
    type: 'limit' as 'limit' | 'market'
  });

  useEffect(() => {
    // Subscribe to price updates for this trading pair
    subscribeToPrices([tradingPair]);
  }, [tradingPair, subscribeToPrices]);

  const currentPrice = priceData[tradingPair];
  const buyOrders = orders.filter(order => order.type === 'buy' && order.status === 'active');
  const sellOrders = orders.filter(order => order.type === 'sell' && order.status === 'active');

  const handleCreateOrder = async () => {
    try {
      await createOrder({
        tradingPair,
        type: activeTab,
        amount: parseFloat(orderForm.amount),
        price: orderForm.type === 'limit' ? parseFloat(orderForm.price) : undefined,
        orderType: orderForm.type
      });
      
      // Reset form
      setOrderForm({ amount: '', price: '', type: 'limit' });
    } catch (error) {
      console.error('Failed to create order:', error);
    }
  };

  return (
    <div className="space-y-6">
      {/* Real-time Price Display */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>{tradingPair} Price</span>
            {currentPrice?.change !== undefined && (
              <Badge variant={currentPrice.change >= 0 ? 'default' : 'destructive'}>
                {currentPrice.change >= 0 ? (
                  <TrendingUp className="w-4 h-4 mr-1" />
                ) : (
                  <TrendingDown className="w-4 h-4 mr-1" />
                )}
                {currentPrice.change > 0 ? '+' : ''}{currentPrice.change.toFixed(2)}%
              </Badge>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold">
            {currentPrice ? formatCurrency(currentPrice.price) : 'Loading...'}
          </div>
          {currentPrice && (
            <div className="text-sm text-muted-foreground">
              Last updated: {formatTime(currentPrice.timestamp)}
            </div>
          )}
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Order Book */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Order Book</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* Sell Orders */}
              <div>
                <h4 className="font-semibold text-red-600 mb-2">Sell Orders</h4>
                <div className="space-y-1 max-h-48 overflow-y-auto">
                  {sellOrders.map((order, index) => (
                    <div
                      key={order.id || index}
                      className="flex justify-between p-2 bg-red-50 rounded cursor-pointer hover:bg-red-100"
                      onClick={() => onTradeSelect?.(order)}
                    >
                      <span>{order.amount} {tradingPair.split('/')[0]}</span>
                      <span className="font-medium">{formatCurrency(order.price)}</span>
                    </div>
                  ))}
                  {sellOrders.length === 0 && (
                    <div className="text-center text-muted-foreground py-4">
                      No sell orders
                    </div>
                  )}
                </div>
              </div>

              {/* Current Price Separator */}
              <div className="border-t border-b py-2 text-center font-bold">
                {currentPrice ? formatCurrency(currentPrice.price) : '---'}
              </div>

              {/* Buy Orders */}
              <div>
                <h4 className="font-semibold text-green-600 mb-2">Buy Orders</h4>
                <div className="space-y-1 max-h-48 overflow-y-auto">
                  {buyOrders.map((order, index) => (
                    <div
                      key={order.id || index}
                      className="flex justify-between p-2 bg-green-50 rounded cursor-pointer hover:bg-green-100"
                      onClick={() => onTradeSelect?.(order)}
                    >
                      <span>{order.amount} {tradingPair.split('/')[0]}</span>
                      <span className="font-medium">{formatCurrency(order.price)}</span>
                    </div>
                  ))}
                  {buyOrders.length === 0 && (
                    <div className="text-center text-muted-foreground py-4">
                      No buy orders
                    </div>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Trading Panel */}
        <Card>
          <CardHeader>
            <div className="flex border rounded">
              <button
                className={`flex-1 py-2 px-4 ${activeTab === 'buy' ? 'bg-green-600 text-white' : 'bg-gray-100'}`}
                onClick={() => setActiveTab('buy')}
              >
                Buy
              </button>
              <button
                className={`flex-1 py-2 px-4 ${activeTab === 'sell' ? 'bg-red-600 text-white' : 'bg-gray-100'}`}
                onClick={() => setActiveTab('sell')}
              >
                Sell
              </button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Order Type</label>
                <select
                  value={orderForm.type}
                  onChange={(e) => setOrderForm(prev => ({ ...prev, type: e.target.value as any }))}
                  className="w-full p-2 border rounded"
                >
                  <option value="limit">Limit Order</option>
                  <option value="market">Market Order</option>
                </select>
              </div>

              {orderForm.type === 'limit' && (
                <div>
                  <label className="block text-sm font-medium mb-1">Price</label>
                  <Input
                    type="number"
                    placeholder="0.00"
                    value={orderForm.price}
                    onChange={(e) => setOrderForm(prev => ({ ...prev, price: e.target.value }))}
                  />
                </div>
              )}

              <div>
                <label className="block text-sm font-medium mb-1">Amount</label>
                <Input
                  type="number"
                  placeholder="0.00"
                  value={orderForm.amount}
                  onChange={(e) => setOrderForm(prev => ({ ...prev, amount: e.target.value }))}
                />
              </div>

              <Button
                onClick={handleCreateOrder}
                className={`w-full ${activeTab === 'buy' ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'}`}
                disabled={!orderForm.amount || (orderForm.type === 'limit' && !orderForm.price)}
              >
                {activeTab === 'buy' ? 'Place Buy Order' : 'Place Sell Order'}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Trades */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Trades</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {recentTrades.map((trade, index) => (
              <div key={trade.id || index} className="flex justify-between items-center p-2 border-b">
                <div className="flex items-center space-x-2">
                  <Badge variant={trade.type === 'buy' ? 'default' : 'destructive'}>
                    {trade.type}
                  </Badge>
                  <span>{trade.amount} {tradingPair.split('/')[0]}</span>
                </div>
                <div className="text-right">
                  <div className="font-medium">{formatCurrency(trade.price)}</div>
                  <div className="text-xs text-muted-foreground">
                    {formatTime(trade.timestamp)}
                  </div>
                </div>
              </div>
            ))}
            {recentTrades.length === 0 && (
              <div className="text-center text-muted-foreground py-4">
                No recent trades
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
