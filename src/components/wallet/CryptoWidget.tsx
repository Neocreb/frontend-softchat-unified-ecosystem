
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronRight, TrendingUp, TrendingDown, RefreshCw } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { Link } from "react-router-dom";

type CryptoCurrency = {
  id: string;
  name: string;
  symbol: string;
  price: number;
  change24h: number;
  sparkline: number[];
};

const mockCryptoData: CryptoCurrency[] = [
  {
    id: "bitcoin",
    name: "Bitcoin",
    symbol: "BTC",
    price: 65432.89,
    change24h: 2.45,
    sparkline: [62000, 63100, 63500, 62700, 64000, 65000, 65432],
  },
  {
    id: "ethereum",
    name: "Ethereum",
    symbol: "ETH",
    price: 3218.76,
    change24h: -1.23,
    sparkline: [3300, 3250, 3200, 3180, 3150, 3210, 3218],
  },
  {
    id: "solana",
    name: "Solana",
    symbol: "SOL",
    price: 143.52,
    change24h: 5.82,
    sparkline: [135, 138, 140, 142, 141, 142, 143],
  },
];

const CryptoWidget = () => {
  const [cryptoData, setCryptoData] = useState<CryptoCurrency[]>(mockCryptoData);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const { toast } = useToast();

  const refreshPrices = () => {
    setIsRefreshing(true);
    
    // Simulate API call to refresh prices
    setTimeout(() => {
      // Update with slightly different values to simulate market movement
      const updatedData = cryptoData.map(crypto => {
        const priceChange = crypto.price * (Math.random() * 0.02 - 0.01); // -1% to +1%
        const newPrice = crypto.price + priceChange;
        const newChange = crypto.change24h + (Math.random() * 0.4 - 0.2); // -0.2% to +0.2%
        
        // Update sparkline with new price at the end
        const newSparkline = [...crypto.sparkline.slice(1), newPrice];
        
        return {
          ...crypto,
          price: newPrice,
          change24h: newChange,
          sparkline: newSparkline,
        };
      });
      
      setCryptoData(updatedData);
      setIsRefreshing(false);
      
      toast({
        title: "Prices updated",
        description: "Latest crypto prices have been fetched",
      });
    }, 1500);
  };

  // Simple sparkline component using SVG
  const Sparkline = ({ data, color }: { data: number[], color: string }) => {
    const min = Math.min(...data);
    const max = Math.max(...data);
    const range = max - min || 1;
    
    // Normalize data to fit in the available height (30px)
    const normalizedData = data.map(value => 30 - ((value - min) / range) * 30);
    
    // Create path points
    const points = normalizedData.map((value, index) => {
      const x = (index / (data.length - 1)) * 100;
      return `${x},${value}`;
    }).join(' ');
    
    return (
      <svg width="100" height="30" viewBox="0 0 100 30" className="overflow-visible">
        <polyline
          points={points}
          fill="none"
          stroke={color}
          strokeWidth="1.5"
        />
      </svg>
    );
  };

  return (
    <Card>
      <CardHeader className="pb-3 flex flex-row items-center justify-between">
        <CardTitle className="text-base font-medium flex items-center gap-2">
          <TrendingUp className="h-4 w-4" />
          Crypto Markets
        </CardTitle>
        <Button 
          variant="ghost" 
          size="sm" 
          className="h-8 w-8 p-0" 
          onClick={refreshPrices}
          disabled={isRefreshing}
        >
          <RefreshCw className={`h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`} />
        </Button>
      </CardHeader>
      <CardContent className="px-2 pb-2">
        <div className="space-y-1">
          {cryptoData.map((crypto) => (
            <div 
              key={crypto.id}
              className="flex items-center justify-between p-2 rounded-md hover:bg-muted transition-colors"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                  <span className="text-xs font-bold">{crypto.symbol.charAt(0)}</span>
                </div>
                <div className="min-w-0">
                  <div className="text-sm font-medium truncate">{crypto.name}</div>
                  <div className="text-xs text-muted-foreground">{crypto.symbol}</div>
                </div>
              </div>
              
              <div className="flex-1 px-4 hidden sm:block">
                <Sparkline
                  data={crypto.sparkline}
                  color={crypto.change24h >= 0 ? "#22c55e" : "#ef4444"}
                />
              </div>
              
              <div className="text-right flex-shrink-0">
                <div className="text-sm font-medium">${crypto.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
                <div className={`text-xs flex items-center justify-end ${
                  crypto.change24h >= 0 ? "text-green-500" : "text-red-500"
                }`}>
                  {crypto.change24h >= 0 ? (
                    <TrendingUp className="mr-1 h-3 w-3" />
                  ) : (
                    <TrendingDown className="mr-1 h-3 w-3" />
                  )}
                  {Math.abs(crypto.change24h).toFixed(2)}%
                </div>
              </div>
              
              <Button variant="ghost" size="icon" className="ml-2 h-8 w-8 flex-shrink-0">
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
        
        <div className="pt-2 flex justify-center">
          <Button variant="outline" size="sm" className="w-full" asChild>
            <Link to="/crypto">Go to Crypto Trading</Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default CryptoWidget;
