
import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import CryptoList from "@/components/crypto/CryptoList";
import CryptoChart from "@/components/crypto/CryptoChart";
import CryptoTradePanel from "@/components/crypto/CryptoTradePanel";
import CryptoPortfolio from "@/components/crypto/CryptoPortfolio";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

export type Crypto = {
  id: string;
  name: string;
  symbol: string;
  current_price: number;
  price_change_percentage_24h: number;
  image: string;
  market_cap: number;
  total_volume: number;
};

const CryptoMarket = () => {
  const [cryptos, setCryptos] = useState<Crypto[]>([]);
  const [selectedCrypto, setSelectedCrypto] = useState<Crypto | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const { toast } = useToast();

  useEffect(() => {
    // Simulate fetching crypto data
    const fetchCryptos = async () => {
      setIsLoading(true);
      try {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        // Mock data - in a real app, this would be fetched from CoinGecko or similar API
        const mockData: Crypto[] = [
          {
            id: "bitcoin",
            name: "Bitcoin",
            symbol: "btc",
            current_price: 52835.42,
            price_change_percentage_24h: 2.34,
            image: "https://assets.coingecko.com/coins/images/1/large/bitcoin.png",
            market_cap: 1032456789012,
            total_volume: 28765432198
          },
          {
            id: "ethereum",
            name: "Ethereum",
            symbol: "eth",
            current_price: 3145.79,
            price_change_percentage_24h: -1.23,
            image: "https://assets.coingecko.com/coins/images/279/large/ethereum.png",
            market_cap: 378965432198,
            total_volume: 16784321567
          },
          {
            id: "cardano",
            name: "Cardano",
            symbol: "ada",
            current_price: 0.57,
            price_change_percentage_24h: 3.45,
            image: "https://assets.coingecko.com/coins/images/975/large/cardano.png",
            market_cap: 20145632789,
            total_volume: 532897645
          },
          {
            id: "solana",
            name: "Solana",
            symbol: "sol",
            current_price: 157.83,
            price_change_percentage_24h: 5.67,
            image: "https://assets.coingecko.com/coins/images/4128/large/solana.png",
            market_cap: 65412789456,
            total_volume: 2145678923
          },
          {
            id: "dogecoin",
            name: "Dogecoin",
            symbol: "doge",
            current_price: 0.16,
            price_change_percentage_24h: -2.78,
            image: "https://assets.coingecko.com/coins/images/5/large/dogecoin.png",
            market_cap: 22456789123,
            total_volume: 1234567890
          }
        ];
        
        setCryptos(mockData);
        setSelectedCrypto(mockData[0]);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching crypto data:", error);
        toast({
          title: "Error",
          description: "Failed to fetch cryptocurrency data. Please try again later.",
          variant: "destructive",
        });
        setIsLoading(false);
      }
    };

    fetchCryptos();
  }, [toast]);

  const handleSelectCrypto = (crypto: Crypto) => {
    setSelectedCrypto(crypto);
  };

  const handleTrade = (type: 'buy' | 'sell', amount: number) => {
    if (!selectedCrypto) return;
    
    toast({
      title: `${type === 'buy' ? 'Bought' : 'Sold'} ${selectedCrypto.name}`,
      description: `Successfully ${type === 'buy' ? 'purchased' : 'sold'} ${amount} ${selectedCrypto.symbol.toUpperCase()} at $${selectedCrypto.current_price.toFixed(2)}`,
    });
  };

  const filteredCryptos = cryptos.filter(crypto => 
    crypto.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    crypto.symbol.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="container py-6 space-y-6 max-w-full">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h1 className="text-2xl font-bold">Cryptocurrency Market</h1>
        <div className="relative w-full md:w-64">
          <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search cryptocurrencies"
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {isLoading ? (
            <Skeleton className="h-[400px] w-full" />
          ) : (
            <>
              {selectedCrypto && (
                <CryptoChart crypto={selectedCrypto} />
              )}
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Market Overview</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <CryptoList 
                    cryptos={filteredCryptos} 
                    selectedCryptoId={selectedCrypto?.id || ""}
                    onSelectCrypto={handleSelectCrypto}
                    isLoading={isLoading}
                  />
                </CardContent>
              </Card>
            </>
          )}
        </div>
        
        <div className="space-y-6">
          <Tabs defaultValue="trade" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="trade">Trade</TabsTrigger>
              <TabsTrigger value="portfolio">Portfolio</TabsTrigger>
            </TabsList>
            
            <TabsContent value="trade" className="mt-4">
              {isLoading ? (
                <Skeleton className="h-[300px] w-full" />
              ) : (
                <CryptoTradePanel 
                  crypto={selectedCrypto} 
                  onTrade={handleTrade}
                />
              )}
            </TabsContent>
            
            <TabsContent value="portfolio" className="mt-4">
              <CryptoPortfolio />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default CryptoMarket;
