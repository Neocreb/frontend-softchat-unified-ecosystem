
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";
import { Shield, TrendingUp, Filter, Plus } from "lucide-react";
import { P2POffer } from "@/types/user";
import P2POfferCard from "./P2POfferCard";
import TradeCard from "../trading/TradeCard";
import KYCVerificationModal from "../kyc/KYCVerificationModal";
import { tradingService, Trade } from "@/services/tradingService";
import { kycService } from "@/services/kycService";

const EnhancedP2PMarketplace = () => {
  const [activeTab, setActiveTab] = useState<'marketplace' | 'my_trades' | 'create_offer'>('marketplace');
  const [marketplaceSubTab, setMarketplaceSubTab] = useState<'buy' | 'sell'>('buy');
  const [selectedCrypto, setSelectedCrypto] = useState("btc");
  const [selectedPayment, setSelectedPayment] = useState("all");
  const [priceRange, setPriceRange] = useState({ min: '', max: '' });
  const [offers, setOffers] = useState<P2POffer[]>([]);
  const [userTrades, setUserTrades] = useState<Trade[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [kycLevel, setKycLevel] = useState(0);
  const [tradingLimits, setTradingLimits] = useState<any>(null);
  const { toast } = useToast();

  // Generate a proper UUID for demo purposes
  const currentUserId = crypto.randomUUID();

  useEffect(() => {
    loadData();
  }, [activeTab, marketplaceSubTab, selectedCrypto, selectedPayment]);

  const loadData = async () => {
    setIsLoading(true);
    try {
      if (activeTab === 'marketplace') {
        await loadOffers();
      } else if (activeTab === 'my_trades') {
        await loadUserTrades();
      }
      
      // Load user KYC and trading data
      await loadUserData();
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadOffers = async () => {
    // Simulate API call with enhanced mock data
    await new Promise((resolve) => setTimeout(resolve, 1000));
    
    const mockOffers: P2POffer[] = Array.from({ length: 12 }, (_, i) => ({
      id: `offer-${i}`,
      type: Math.random() > 0.5 ? 'buy' : 'sell',
      crypto_amount: selectedCrypto === 'btc' ? 0.1 + Math.random() * 0.9 : 10 + Math.random() * 90,
      crypto_symbol: selectedCrypto.toUpperCase(),
      fiat_price: selectedCrypto === 'btc' ? 52000 + Math.random() * 1000 : 3000 + Math.random() * 100,
      fiat_currency: 'USD',
      min_order: 100 + Math.random() * 900,
      max_order: 10000 + Math.random() * 40000,
      payment_methods: ['Bank Transfer', 'Wise', 'Revolut', 'PayPal'].sort(() => Math.random() - 0.5).slice(0, 1 + Math.floor(Math.random() * 3)),
      seller: {
        id: `user-${i}`,
        name: `Trader${i + 1}`,
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${i}`,
        is_verified: Math.random() > 0.3,
        rating: 3.5 + Math.random() * 1.5,
        total_trades: Math.floor(10 + Math.random() * 990),
        completion_rate: 85 + Math.random() * 15,
        avg_release_time: Math.floor(5 + Math.random() * 25)
      },
      created_at: new Date().toISOString(),
      status: 'active'
    }));

    // Apply filters
    const filteredOffers = mockOffers.filter(offer => {
      const matchesType = marketplaceSubTab === 'buy' ? offer.type === 'sell' : offer.type === 'buy';
      const matchesPayment = selectedPayment === 'all' || 
                           offer.payment_methods.includes(selectedPayment);
      const matchesPrice = (!priceRange.min || offer.fiat_price >= parseFloat(priceRange.min)) &&
                          (!priceRange.max || offer.fiat_price <= parseFloat(priceRange.max));
      
      return matchesType && matchesPayment && matchesPrice;
    }).sort((a, b) => {
      if (marketplaceSubTab === 'buy') {
        return a.fiat_price - b.fiat_price;
      } else {
        return b.fiat_price - a.fiat_price;
      }
    });

    setOffers(filteredOffers);
  };

  const loadUserTrades = async () => {
    try {
      const trades = await tradingService.getUserTrades(currentUserId);
      setUserTrades(trades);
    } catch (error) {
      console.error('Error loading user trades:', error);
    }
  };

  const loadUserData = async () => {
    try {
      const limits = await kycService.getUserTradingLimits(currentUserId);
      setTradingLimits(limits);
      setKycLevel(limits?.kyc_level || 0);
    } catch (error) {
      console.error('Error loading user data:', error);
    }
  };

  const handleOfferAction = async (offer: P2POffer) => {
    // Check KYC requirements
    if (kycLevel === 0) {
      toast({
        title: "KYC Verification Required",
        description: "Please complete KYC verification to start trading.",
        variant: "destructive",
      });
      return;
    }

    // Check trading limits
    const tradeAmount = offer.min_order;
    if (tradingLimits && tradeAmount > tradingLimits.daily_limit - tradingLimits.current_daily_volume) {
      toast({
        title: "Trading Limit Exceeded",
        description: "This trade would exceed your daily trading limit.",
        variant: "destructive",
      });
      return;
    }

    try {
      // Create trade
      const newTrade = await tradingService.createTrade({
        buyer_id: marketplaceSubTab === 'buy' ? currentUserId : offer.seller.id,
        seller_id: marketplaceSubTab === 'buy' ? offer.seller.id : currentUserId,
        offer_id: offer.id,
        amount: offer.crypto_amount,
        price_per_unit: offer.fiat_price,
        total_amount: offer.crypto_amount * offer.fiat_price,
        payment_method: offer.payment_methods[0],
        status: 'pending'
      });

      if (newTrade) {
        toast({
          title: "Trade Created",
          description: `Trade order created successfully. Trade ID: ${newTrade.id.slice(0, 8)}`,
        });
        setActiveTab('my_trades');
      }
    } catch (error) {
      console.error('Error creating trade:', error);
      toast({
        title: "Trade Creation Failed",
        description: "Please try again later.",
        variant: "destructive",
      });
    }
  };

  const handleTradeAction = async (trade: Trade, action: string) => {
    try {
      switch (action) {
        case 'confirm_payment':
          await tradingService.updateTradeStatus(trade.id, 'in_progress');
          toast({ title: "Payment confirmed", description: "Trade is now in progress." });
          break;
        case 'accept_trade':
          await tradingService.updateTradeStatus(trade.id, 'in_progress');
          toast({ title: "Trade accepted", description: "Trade is now in progress." });
          break;
        case 'decline_trade':
          await tradingService.updateTradeStatus(trade.id, 'cancelled');
          toast({ title: "Trade declined", description: "Trade has been cancelled." });
          break;
        case 'mark_complete':
          await tradingService.updateTradeStatus(trade.id, 'completed');
          toast({ title: "Trade completed", description: "Trade has been marked as complete." });
          break;
        case 'raise_dispute':
          // In real app, open dispute modal
          toast({ title: "Dispute raised", description: "A dispute has been created for this trade." });
          break;
        case 'rate_trader':
          // In real app, open rating modal
          toast({ title: "Rating submitted", description: "Thank you for your feedback." });
          break;
      }
      
      loadUserTrades(); // Reload trades
    } catch (error) {
      console.error('Error handling trade action:', error);
      toast({
        title: "Action Failed",
        description: "Please try again later.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Header with KYC Status */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Enhanced P2P Trading
            </CardTitle>
            <div className="flex items-center gap-3">
              <KYCVerificationModal 
                userId={currentUserId}
                currentLevel={kycLevel}
                onLevelUpdate={setKycLevel}
              />
              {tradingLimits && (
                <Badge variant="outline">
                  Daily: ${tradingLimits.current_daily_volume.toLocaleString()} / ${tradingLimits.daily_limit.toLocaleString()}
                </Badge>
              )}
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Main Tabs */}
      <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as any)} className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="marketplace">Marketplace</TabsTrigger>
          <TabsTrigger value="my_trades">My Trades</TabsTrigger>
          <TabsTrigger value="create_offer">Create Offer</TabsTrigger>
        </TabsList>

        {/* Marketplace Tab */}
        <TabsContent value="marketplace" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex flex-col sm:flex-row gap-4">
                <Tabs value={marketplaceSubTab} onValueChange={(v) => setMarketplaceSubTab(v as any)} className="flex-1">
                  <TabsList className="w-full sm:w-auto">
                    <TabsTrigger value="buy">Buy Crypto</TabsTrigger>
                    <TabsTrigger value="sell">Sell Crypto</TabsTrigger>
                  </TabsList>
                </Tabs>
                
                <div className="flex flex-1 gap-4">
                  <Select value={selectedCrypto} onValueChange={setSelectedCrypto}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Select Crypto" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectItem value="btc">Bitcoin (BTC)</SelectItem>
                        <SelectItem value="eth">Ethereum (ETH)</SelectItem>
                        <SelectItem value="usdt">Tether (USDT)</SelectItem>
                        <SelectItem value="sol">Solana (SOL)</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                  
                  <Select value={selectedPayment} onValueChange={setSelectedPayment}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Payment Method" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectItem value="all">All Methods</SelectItem>
                        <SelectItem value="Bank Transfer">Bank Transfer</SelectItem>
                        <SelectItem value="Wise">Wise</SelectItem>
                        <SelectItem value="Revolut">Revolut</SelectItem>
                        <SelectItem value="PayPal">PayPal</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Price Filter */}
              <div className="flex items-center gap-4">
                <Filter className="h-4 w-4" />
                <div className="flex items-center gap-2">
                  <Label htmlFor="minPrice">Min Price:</Label>
                  <Input
                    id="minPrice"
                    type="number"
                    placeholder="0"
                    value={priceRange.min}
                    onChange={(e) => setPriceRange(prev => ({ ...prev, min: e.target.value }))}
                    className="w-24"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <Label htmlFor="maxPrice">Max Price:</Label>
                  <Input
                    id="maxPrice"
                    type="number"
                    placeholder="∞"
                    value={priceRange.max}
                    onChange={(e) => setPriceRange(prev => ({ ...prev, max: e.target.value }))}
                    className="w-24"
                  />
                </div>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setPriceRange({ min: '', max: '' })}
                >
                  Clear
                </Button>
              </div>
            </CardHeader>
            
            <CardContent>
              {isLoading ? (
                <div className="py-12 text-center">
                  <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
                  <p className="text-muted-foreground">Loading offers...</p>
                </div>
              ) : offers.length === 0 ? (
                <div className="py-12 text-center">
                  <TrendingUp className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                  <p className="text-lg font-medium">No offers found</p>
                  <p className="text-muted-foreground">
                    Try adjusting your filters or check back later
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {offers.map((offer) => (
                    <P2POfferCard 
                      key={offer.id}
                      offer={offer}
                      onAction={handleOfferAction}
                    />
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* My Trades Tab */}
        <TabsContent value="my_trades" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Your Active Trades</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="py-12 text-center">
                  <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
                  <p className="text-muted-foreground">Loading trades...</p>
                </div>
              ) : userTrades.length === 0 ? (
                <div className="py-12 text-center">
                  <TrendingUp className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                  <p className="text-lg font-medium">No trades yet</p>
                  <p className="text-muted-foreground">
                    Start trading to see your orders here
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  {userTrades.map((trade) => (
                    <TradeCard
                      key={trade.id}
                      trade={trade}
                      onAction={handleTradeAction}
                      currentUserId={currentUserId}
                    />
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Create Offer Tab */}
        <TabsContent value="create_offer" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Plus className="h-5 w-5" />
                Create New Offer
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <p className="text-muted-foreground">
                  Offer creation form coming soon...
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default EnhancedP2PMarketplace;
