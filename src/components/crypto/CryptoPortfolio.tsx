
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowDown, ArrowUp } from "lucide-react";
import { cn } from "@/lib/utils";

type PortfolioCrypto = {
  id: string;
  name: string;
  symbol: string;
  amount: number;
  price: number;
  value: number;
  change: number;
  image: string;
};

const mockPortfolio: PortfolioCrypto[] = [
  {
    id: "bitcoin",
    name: "Bitcoin",
    symbol: "btc",
    amount: 0.25,
    price: 52835.42,
    value: 13208.86,
    change: 2.34,
    image: "https://assets.coingecko.com/coins/images/1/large/bitcoin.png"
  },
  {
    id: "ethereum",
    name: "Ethereum",
    symbol: "eth",
    amount: 2.5,
    price: 3145.79,
    value: 7864.48,
    change: -1.23,
    image: "https://assets.coingecko.com/coins/images/279/large/ethereum.png"
  },
  {
    id: "solana",
    name: "Solana",
    symbol: "sol",
    amount: 15,
    price: 157.83,
    value: 2367.45,
    change: 5.67,
    image: "https://assets.coingecko.com/coins/images/4128/large/solana.png"
  }
];

const CryptoPortfolio = () => {
  const totalBalance = mockPortfolio.reduce((total, crypto) => total + crypto.value, 0);
  
  // Calculate total change percentage (weighted average)
  const totalChange = mockPortfolio.reduce((total, crypto) => {
    return total + (crypto.change * crypto.value);
  }, 0) / totalBalance;
  
  return (
    <Card className="h-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">Your Portfolio</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-6">
          <div className="text-sm text-muted-foreground">Total Balance</div>
          <div className="flex items-center gap-2">
            <div className="text-2xl font-bold">${totalBalance.toLocaleString()}</div>
            <div 
              className={cn(
                "text-sm font-medium",
                totalChange > 0 ? "text-green-500" : "text-red-500"
              )}
            >
              {totalChange > 0 ? "+" : ""}{totalChange.toFixed(2)}%
            </div>
          </div>
        </div>
        
        <div className="space-y-3">
          {mockPortfolio.map((crypto) => (
            <div key={crypto.id} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <img 
                  src={crypto.image} 
                  alt={crypto.name} 
                  className="h-8 w-8 rounded-full"
                />
                <div>
                  <div className="font-medium">{crypto.name}</div>
                  <div className="text-xs text-muted-foreground">
                    {crypto.amount} {crypto.symbol.toUpperCase()}
                  </div>
                </div>
              </div>
              
              <div className="text-right">
                <div>${crypto.value.toLocaleString()}</div>
                <div 
                  className={cn(
                    "text-xs flex items-center justify-end",
                    crypto.change > 0 ? "text-green-500" : "text-red-500"
                  )}
                >
                  {crypto.change > 0 ? (
                    <ArrowUp className="h-3 w-3 mr-1" />
                  ) : (
                    <ArrowDown className="h-3 w-3 mr-1" />
                  )}
                  {Math.abs(crypto.change).toFixed(2)}%
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-4 p-3 bg-muted rounded-md text-sm">
          <div className="font-medium mb-1">Transaction History</div>
          <div className="space-y-2 text-xs">
            <div className="flex justify-between">
              <span>Bought 0.1 BTC</span>
              <span>3 days ago</span>
            </div>
            <div className="flex justify-between">
              <span>Sold 0.5 ETH</span>
              <span>1 week ago</span>
            </div>
            <div className="flex justify-between">
              <span>Bought 10 SOL</span>
              <span>2 weeks ago</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CryptoPortfolio;
