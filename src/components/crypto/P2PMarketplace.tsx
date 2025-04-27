
import { useState, useEffect } from "react";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardDescription 
} from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { 
  ArrowDown, 
  ArrowUp, 
  Search, 
  Info, 
  Plus 
} from "lucide-react";
import UserRatingBadge from "./UserRatingBadge";

interface P2POffer {
  id: string;
  type: 'buy' | 'sell';
  user: {
    id: string;
    name: string;
    avatar: string;
    rating: number;
    completedTrades: number;
    kycLevel: number;
  };
  crypto: {
    symbol: string;
    amount: number;
  };
  price: number;
  minOrder: number;
  maxOrder: number;
  payment: string[];
  createdAt: string;
}

const P2PMarketplace = () => {
  const [activeTab, setActiveTab] = useState<'buy' | 'sell'>('buy');
  const [selectedCrypto, setSelectedCrypto] = useState("btc");
  const [selectedPayment, setSelectedPayment] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [offers, setOffers] = useState<P2POffer[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  // Fetch offers based on type, crypto, payment method, etc.
  useEffect(() => {
    const fetchOffers = async () => {
      setIsLoading(true);

      try {
        // Simulating API call with mock data
        await new Promise((resolve) => setTimeout(resolve, 1000));

        // Generate mock data based on filters
        const mockOffers: P2POffer[] = Array.from({ length: 12 }, (_, i) => {
          const price = selectedCrypto === 'btc' 
            ? 52800 + Math.random() * 1000 
            : selectedCrypto === 'eth' 
              ? 3140 + Math.random() * 100
              : selectedCrypto === 'usdt'
                ? 0.99 + Math.random() * 0.02
                : 157 + Math.random() * 5;

          const amount = selectedCrypto === 'btc'
            ? 0.1 + Math.random() * 0.9
            : selectedCrypto === 'eth'
              ? 1 + Math.random() * 9
              : selectedCrypto === 'usdt'
                ? 100 + Math.random() * 9900
                : 5 + Math.random() * 45;

          const minOrder = price * (amount * 0.1);
          const maxOrder = price * amount;
          
          const payments = ['Bank Transfer', 'PayPal', 'Revolut', 'Wise', 'Cash'];
          const randomPayments = [];
          const numPayments = 1 + Math.floor(Math.random() * 3); // 1-3 payment methods
          
          for (let j = 0; j < numPayments; j++) {
            const randomIndex = Math.floor(Math.random() * payments.length);
            randomPayments.push(payments[randomIndex]);
            payments.splice(randomIndex, 1);
          }

          return {
            id: `offer-${i}`,
            type: Math.random() > 0.5 ? 'buy' : 'sell',
            user: {
              id: `user-${i}`,
              name: `Trader${i + 1}`,
              avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${i}`,
              rating: 3 + Math.random() * 2,
              completedTrades: Math.floor(10 + Math.random() * 990),
              kycLevel: Math.floor(1 + Math.random() * 3)
            },
            crypto: {
              symbol: selectedCrypto,
              amount: parseFloat(amount.toFixed(selectedCrypto === 'btc' ? 3 : 2))
            },
            price: parseFloat(price.toFixed(2)),
            minOrder: parseFloat(minOrder.toFixed(2)),
            maxOrder: parseFloat(maxOrder.toFixed(2)),
            payment: randomPayments,
            createdAt: new Date(Date.now() - Math.random() * 86400000 * 7).toISOString() // Within last 7 days
          };
        });

        // Filter to match the active tab
        const filteredOffers = mockOffers.filter(offer => {
          const matchesType = activeTab === 'buy' ? offer.type === 'sell' : offer.type === 'buy';
          const matchesPayment = selectedPayment === 'all' || offer.payment.includes(selectedPayment);
          const matchesSearch = !searchQuery || 
                               offer.user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                               offer.payment.some(p => p.toLowerCase().includes(searchQuery.toLowerCase()));
          
          return matchesType && matchesPayment && matchesSearch;
        });

        // Sort by best price first (lowest for buy, highest for sell)
        const sortedOffers = filteredOffers.sort((a, b) => {
          if (activeTab === 'buy') {
            return a.price - b.price; // Lowest price first when buying
          } else {
            return b.price - a.price; // Highest price first when selling
          }
        });

        setOffers(sortedOffers);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching P2P offers:", error);
        toast({
          title: "Error",
          description: "Failed to load P2P offers. Please try again later.",
          variant: "destructive",
        });
        setIsLoading(false);
      }
    };

    fetchOffers();
  }, [activeTab, selectedCrypto, selectedPayment, searchQuery, toast]);

  const handleOfferAction = (offer: P2POffer) => {
    const action = activeTab === 'buy' ? 'buy' : 'sell';
    const cryptoSymbol = offer.crypto.symbol.toUpperCase();
    
    toast({
      title: `${action === 'buy' ? 'Buy' : 'Sell'} Order Initiated`,
      description: `You're about to ${action} ${cryptoSymbol} at ${offer.price} USD per ${cryptoSymbol}`,
    });
  };

  const handleCreateOffer = () => {
    toast({
      title: "Create New Offer",
      description: "Create offer feature coming soon!",
    });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="pb-3">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
            <div>
              <CardTitle className="text-xl">P2P Trading</CardTitle>
              <CardDescription>Buy and sell crypto directly with other users</CardDescription>
            </div>
            <Button 
              className="mt-2 sm:mt-0"
              onClick={handleCreateOffer}
            >
              <Plus className="mr-2 h-4 w-4" />
              Create Offer
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as 'buy' | 'sell')}>
            <div className="flex flex-col sm:flex-row gap-4 mb-4 items-start sm:items-center">
              <TabsList className="w-full sm:w-auto">
                <TabsTrigger value="buy">Buy</TabsTrigger>
                <TabsTrigger value="sell">Sell</TabsTrigger>
              </TabsList>
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 flex-1">
                <Select value={selectedCrypto} onValueChange={setSelectedCrypto}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Cryptocurrency" />
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
                  <SelectTrigger>
                    <SelectValue placeholder="Payment Method" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Payment Methods</SelectItem>
                    <SelectItem value="Bank Transfer">Bank Transfer</SelectItem>
                    <SelectItem value="PayPal">PayPal</SelectItem>
                    <SelectItem value="Revolut">Revolut</SelectItem>
                    <SelectItem value="Wise">Wise</SelectItem>
                    <SelectItem value="Cash">Cash</SelectItem>
                  </SelectContent>
                </Select>
                
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search traders or payments..."
                    className="pl-9"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>
            </div>
            
            <div>
              <div className="grid grid-cols-12 gap-2 py-3 px-4 font-medium text-sm text-muted-foreground border-b">
                <div className="col-span-3">Price</div>
                <div className="col-span-3">Limit / Available</div>
                <div className="col-span-3">Payment</div>
                <div className="col-span-2">Trader</div>
                <div className="col-span-1"></div>
              </div>
              
              {isLoading ? (
                <div className="py-12 text-center">
                  <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
                  <p className="text-muted-foreground">Loading offers...</p>
                </div>
              ) : offers.length === 0 ? (
                <div className="py-12 text-center">
                  <Info className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                  <p className="text-lg font-medium">No offers found</p>
                  <p className="text-muted-foreground">
                    Try adjusting your filters or create your own offer
                  </p>
                </div>
              ) : (
                <div className="divide-y">
                  {offers.map((offer) => (
                    <div key={offer.id} className="grid grid-cols-12 gap-2 py-4 px-4 items-center">
                      {/* Price */}
                      <div className="col-span-3">
                        <div className="font-medium text-lg">${offer.price.toLocaleString()}</div>
                        <div className="text-xs text-muted-foreground">
                          per {offer.crypto.symbol.toUpperCase()}
                        </div>
                      </div>
                      
                      {/* Limits */}
                      <div className="col-span-3">
                        <div>${offer.minOrder.toLocaleString()} - ${offer.maxOrder.toLocaleString()}</div>
                        <div className="text-xs text-muted-foreground">
                          {offer.crypto.amount} {offer.crypto.symbol.toUpperCase()} available
                        </div>
                      </div>
                      
                      {/* Payment */}
                      <div className="col-span-3">
                        <div className="flex flex-wrap gap-1">
                          {offer.payment.slice(0, 2).map((method) => (
                            <Badge key={method} variant="outline" className="whitespace-nowrap">
                              {method}
                            </Badge>
                          ))}
                          {offer.payment.length > 2 && (
                            <Badge variant="outline">+{offer.payment.length - 2}</Badge>
                          )}
                        </div>
                      </div>
                      
                      {/* Trader */}
                      <div className="col-span-2 flex items-center gap-2">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={offer.user.avatar} alt={offer.user.name} />
                          <AvatarFallback>{offer.user.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium text-sm truncate max-w-[100px]">
                            {offer.user.name}
                          </div>
                          <UserRatingBadge 
                            rating={offer.user.rating} 
                            trades={offer.user.completedTrades} 
                            kycLevel={offer.user.kycLevel} 
                          />
                        </div>
                      </div>
                      
                      {/* Action */}
                      <div className="col-span-1 text-right">
                        <Button 
                          onClick={() => handleOfferAction(offer)}
                          variant="default"
                          size="sm"
                          className={activeTab === 'buy' ? 'bg-green-500 hover:bg-green-600' : 'bg-blue-500 hover:bg-blue-600'}
                        >
                          {activeTab === 'buy' ? (
                            <ArrowDown className="h-4 w-4 mr-1" />
                          ) : (
                            <ArrowUp className="h-4 w-4 mr-1" />
                          )}
                          {activeTab === 'buy' ? 'Buy' : 'Sell'}
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default P2PMarketplace;
