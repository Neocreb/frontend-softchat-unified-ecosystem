
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { ArrowDown, ArrowUp, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import type { Crypto } from "@/pages/CryptoMarket";

interface CryptoListProps {
  cryptos: Crypto[];
  selectedCryptoId: string;
  onSelectCrypto: (crypto: Crypto) => void;
  isLoading: boolean;
}

const CryptoList = ({ cryptos, selectedCryptoId, onSelectCrypto, isLoading }: CryptoListProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  
  const filteredCryptos = cryptos.filter(crypto => 
    crypto.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    crypto.symbol.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center justify-between">
          <span>Market Overview</span>
          <div className="relative w-48">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search"
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="grid grid-cols-5 gap-2 border-b px-4 py-2 text-sm font-medium text-muted-foreground">
          <div>Asset</div>
          <div className="text-right">Price</div>
          <div className="text-right">24h Change</div>
          <div className="text-right hidden md:block">Market Cap</div>
          <div className="text-right hidden md:block">Volume</div>
        </div>
        
        <div className="max-h-[400px] overflow-auto">
          {isLoading ? (
            <>
              {[1, 2, 3, 4, 5].map((index) => (
                <div key={index} className="grid grid-cols-5 gap-2 px-4 py-3 border-b">
                  <div className="flex items-center gap-2">
                    <Skeleton className="h-8 w-8 rounded-full" />
                    <div className="space-y-1">
                      <Skeleton className="h-4 w-16" />
                      <Skeleton className="h-3 w-10" />
                    </div>
                  </div>
                  <Skeleton className="h-4 w-20 ml-auto" />
                  <Skeleton className="h-4 w-16 ml-auto" />
                  <Skeleton className="h-4 w-24 ml-auto hidden md:block" />
                  <Skeleton className="h-4 w-20 ml-auto hidden md:block" />
                </div>
              ))}
            </>
          ) : (
            <>
              {filteredCryptos.length === 0 ? (
                <div className="py-6 text-center text-muted-foreground">
                  No cryptocurrencies found
                </div>
              ) : (
                filteredCryptos.map((crypto) => (
                  <div
                    key={crypto.id}
                    className={cn(
                      "grid grid-cols-5 gap-2 px-4 py-3 border-b cursor-pointer hover:bg-muted/50 transition-colors",
                      selectedCryptoId === crypto.id && "bg-muted"
                    )}
                    onClick={() => onSelectCrypto(crypto)}
                  >
                    <div className="flex items-center gap-2">
                      <img 
                        src={crypto.image} 
                        alt={crypto.name} 
                        className="h-8 w-8 rounded-full"
                      />
                      <div>
                        <div className="font-medium">{crypto.name}</div>
                        <div className="text-xs text-muted-foreground">
                          {crypto.symbol.toUpperCase()}
                        </div>
                      </div>
                    </div>
                    
                    <div className="text-right self-center">
                      ${crypto.current_price.toLocaleString()}
                    </div>
                    
                    <div 
                      className={cn(
                        "text-right self-center flex items-center justify-end",
                        crypto.price_change_percentage_24h > 0 
                          ? "text-green-500" 
                          : "text-red-500"
                      )}
                    >
                      {crypto.price_change_percentage_24h > 0 ? (
                        <ArrowUp className="h-3 w-3 mr-1" />
                      ) : (
                        <ArrowDown className="h-3 w-3 mr-1" />
                      )}
                      {Math.abs(crypto.price_change_percentage_24h).toFixed(2)}%
                    </div>
                    
                    <div className="text-right self-center hidden md:block">
                      ${(crypto.market_cap / 1000000000).toFixed(2)}B
                    </div>
                    
                    <div className="text-right self-center hidden md:block">
                      ${(crypto.total_volume / 1000000).toFixed(2)}M
                    </div>
                  </div>
                ))
              )}
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default CryptoList;
