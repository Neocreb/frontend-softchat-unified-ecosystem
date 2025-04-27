import { useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { useToast } from "@/components/ui/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import CryptoChart from "@/components/crypto/CryptoChart";
import CryptoList from "@/components/crypto/CryptoList";
import CryptoTradePanel from "@/components/crypto/CryptoTradePanel";
import CryptoPortfolio from "@/components/crypto/CryptoPortfolio";
import P2PMarketplace from "@/components/crypto/P2PMarketplace";
import SoftPointExchange from "@/components/crypto/SoftPointExchange";
import CryptoWalletActions from "@/components/crypto/CryptoWalletActions";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
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

const CryptoMarket = () => {
  const [activeTab, setActiveTab] = useState("market");
  const [cryptos, setCryptos] = useState<Crypto[]>([]);
  const [selectedCrypto, setSelectedCrypto] = useState<Crypto | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const { user } = useAuth();

  useEffect(() => {
    const fetchCryptos = async () => {
      try {
        // In a real app, this would be fetched from a real API like CoinGecko
        // For now, we'll use mock data
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
        toast({
          title: "Error",
          description: "Failed to fetch cryptocurrency data. Please try again later.",
          variant: "destructive",
        });
        setIsLoading(false);
      }
    };

    fetchCryptos();
    
    // In a real app, we might set up a websocket or polling for real-time price updates
    const interval = setInterval(() => {
      // For demonstration purposes, we'll just add small random price changes to simulate live updates
      setCryptos(prev => 
        prev.map(crypto => ({
          ...crypto,
          current_price: crypto.current_price * (1 + (Math.random() * 0.01 - 0.005)),
          price_change_percentage_24h: crypto.price_change_percentage_24h + (Math.random() * 0.4 - 0.2)
        }))
      );
    }, 30000); // Update every 30 seconds
    
    return () => clearInterval(interval);
  }, [toast]);

  const handleCryptoSelect = (crypto: Crypto) => {
    setSelectedCrypto(crypto);
  };

  const handleTrade = (type: 'buy' | 'sell', amount: number) => {
    if (!selectedCrypto) return;
    
    // In a real app, this would call an API to place the trade
    console.log(`${type} ${amount} of ${selectedCrypto.name}`);
    
    toast({
      title: "Order Placed",
      description: `Successfully ${type === 'buy' ? 'bought' : 'sold'} ${amount} ${selectedCrypto.symbol.toUpperCase()}`,
    });
  };

  const handleKYCSubmit = async (data: any) => {
    try {
      // In a real app, this would upload documents and update the user's KYC status
      console.log("KYC data submitted:", data);
      
      // Simulate API call to update KYC status
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      toast({
        title: "KYC Submitted",
        description: "Your verification documents have been submitted for review.",
      });
      
      return { success: true };
    } catch (error) {
      console.error("Error submitting KYC:", error);
      toast({
        title: "Error",
        description: "Failed to submit verification documents. Please try again.",
        variant: "destructive",
      });
      return { success: false, error };
    }
  };

  return (
    <>
      <Helmet>
        <title>Crypto Market | Softchat</title>
      </Helmet>
      
      <div className="container px-4 py-4 mx-auto max-w-7xl">
        <h1 className="text-2xl font-bold mb-6">Crypto Market</h1>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="w-full grid grid-cols-4 mb-8">
            <TabsTrigger value="market">Market</TabsTrigger>
            <TabsTrigger value="p2p">P2P</TabsTrigger>
            <TabsTrigger value="convert">Convert</TabsTrigger>
            <TabsTrigger value="wallet">Wallet</TabsTrigger>
          </TabsList>
          
          <TabsContent value="market" className="w-full">
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
            
            <div className="mt-6 grid grid-cols-1 xl:grid-cols-4 gap-6">
              <div className="xl:col-span-3">
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
              
              <div className="xl:col-span-1">
                <CryptoPortfolio />
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="p2p">
            <P2PMarketplace />
          </TabsContent>
          
          <TabsContent value="convert">
            <SoftPointExchange />
          </TabsContent>
          
          <TabsContent value="wallet">
            <CryptoWalletActions onKYCSubmit={handleKYCSubmit} />
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
};

export default CryptoMarket;
