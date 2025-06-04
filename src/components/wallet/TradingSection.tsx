import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import CryptoChart from "@/components/crypto/CryptoChart";
import CryptoList from "@/components/crypto/CryptoList";
import CryptoTradePanel from "@/components/crypto/CryptoTradePanel";
import CryptoPortfolio from "@/components/crypto/CryptoPortfolio";
import { useToast } from "@/components/ui/use-toast";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export interface Crypto {
  id: string;
  name: string;
  symbol: string;
  current_price: number;
  market_cap: number;
  total_volume: number;
  price_change_percentage_24h: number;
  image: string;
}

const TradingSection = () => {
  const [cryptos, setCryptos] = useState<Crypto[]>([]);
  const [selectedCrypto, setSelectedCrypto] = useState<Crypto | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchCryptos = async () => {
      try {
        // Mock crypto data
        const mockData: Crypto[] = [
          {
            id: "bitcoin",
            name: "Bitcoin",
            symbol: "btc",
            current_price: 52835.42,
            market_cap: 1034278909176,
            total_volume: 25982611987,
            price_change_percentage_24h: 2.34,
            image: "https://assets.coingecko.com/coins/images/1/large/bitcoin.png"
          },
          {
            id: "ethereum",
            name: "Ethereum",
            symbol: "eth",
            current_price: 3145.79,
            market_cap: 377339750529,
            total_volume: 18245920134,
            price_change_percentage_24h: -1.23,
            image: "https://assets.coingecko.com/coins/images/279/large/ethereum.png"
          },
          {
            id: "tether",
            name: "Tether",
            symbol: "usdt",
            current_price: 1.00,
            market_cap: 99258852784,
            total_volume: 47895732908,
            price_change_percentage_24h: 0.02,
            image: "https://assets.coingecko.com/coins/images/325/large/Tether.png"
          },
          {
            id: "solana",
            name: "Solana",
            symbol: "sol",
            current_price: 157.83,
            market_cap: 69573985610,
            total_volume: 2945801497,
            price_change_percentage_24h: 5.67,
            image: "https://assets.coingecko.com/coins/images/4128/large/solana.png"
          },
          {
            id: "cardano",
            name: "Cardano",
            symbol: "ada",
            current_price: 0.57,
            market_cap: 20187657290,
            total_volume: 591872345,
            price_change_percentage_24h: -2.15,
            image: "https://assets.coingecko.com/coins/images/975/large/cardano.png"
          },
          {
            id: "dogecoin",
            name: "Dogecoin",
            symbol: "doge",
            current_price: 0.17,
            market_cap: 24753982341,
            total_volume: 1389752043,
            price_change_percentage_24h: 3.42,
            image: "https://assets.coingecko.com/coins/images/5/large/dogecoin.png"
          },
          {
            id: "polkadot",
            name: "Polkadot",
            symbol: "dot",
            current_price: 7.92,
            market_cap: 10982365923,
            total_volume: 343298712,
            price_change_percentage_24h: -3.78,
            image: "https://assets.coingecko.com/coins/images/12171/large/polkadot.png"
          },
          {
            id: "chainlink",
            name: "Chainlink",
            symbol: "link",
            current_price: 18.37,
            market_cap: 10754982713,
            total_volume: 589371285,
            price_change_percentage_24h: 0.87,
            image: "https://assets.coingecko.com/coins/images/877/large/chainlink-new-logo.png"
          }
        ];

        setCryptos(mockData);
        setSelectedCrypto(mockData[0]);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching crypto data:", error);
        setIsLoading(false);
      }
    };

    fetchCryptos();
  }, []);

  const handleCryptoSelect = (crypto: Crypto) => {
    setSelectedCrypto(crypto);
  };

  const handleTrade = (type: 'buy' | 'sell', amount: number) => {
    if (!selectedCrypto) return;

    toast({
      title: "Order Placed",
      description: `Successfully ${type === 'buy' ? 'bought' : 'sold'} ${amount} ${selectedCrypto.symbol.toUpperCase()}`,
    });
  };

  return (
    <Tabs defaultValue="market" className="space-y-6">
      <TabsList>
        <TabsTrigger value="market">Market</TabsTrigger>
        <TabsTrigger value="portfolio">Portfolio</TabsTrigger>
      </TabsList>

      <TabsContent value="market" className="space-y-6">
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
          <div className="xl:col-span-3">
            {isLoading || !selectedCrypto ? (
              <Card>
                <CardContent className="p-0">
                  <Skeleton className="h-[400px] w-full" />
                </CardContent>
              </Card>
            ) : (
              <CryptoChart crypto={selectedCrypto} />
            )}
          </div>

          <div className="xl:col-span-1">
            {isLoading || !selectedCrypto ? (
              <Card>
                <CardContent className="p-0">
                  <Skeleton className="h-[400px] w-full" />
                </CardContent>
              </Card>
            ) : (
              <CryptoTradePanel crypto={selectedCrypto} onTrade={handleTrade} />
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
          <div className="xl:col-span-4">
            <Card>
              <CardContent className="p-0">
                {isLoading ? (
                  <Skeleton className="h-[400px] w-full" />
                ) : (
                  <CryptoList
                    cryptos={cryptos}
                    selectedCryptoId={selectedCrypto?.id || ''}
                    onSelectCrypto={handleCryptoSelect}
                    isLoading={isLoading}
                  />
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </TabsContent>

      <TabsContent value="portfolio">
        <CryptoPortfolio />
      </TabsContent>
    </Tabs>
  );
};

export default TradingSection;
