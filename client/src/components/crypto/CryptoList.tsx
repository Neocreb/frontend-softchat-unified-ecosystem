
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/utils/utils";
import { ArrowDown, ArrowUp } from "lucide-react";
import type { Crypto } from "@/pages/CryptoMarket";

interface CryptoListProps {
  cryptos: Crypto[];
  selectedCryptoId: string;
  onSelectCrypto: (crypto: Crypto) => void;
  isLoading: boolean;
}

const CryptoList = ({ cryptos, selectedCryptoId, onSelectCrypto, isLoading }: CryptoListProps) => {
  return (
    <div>
      <div className="grid grid-cols-12 gap-2 px-4 py-2 text-sm font-medium text-muted-foreground border-b">
        <div className="col-span-6 sm:col-span-4">Asset</div>
        <div className="col-span-3 sm:col-span-2 text-right">Price</div>
        <div className="col-span-3 sm:col-span-2 text-right">24h Change</div>
        <div className="hidden sm:block sm:col-span-2 text-right">Market Cap</div>
        <div className="hidden sm:block sm:col-span-2 text-right">Volume</div>
      </div>

      <div className="max-h-[400px] overflow-auto">
        {isLoading ? (
          <>
            {[1, 2, 3, 4, 5].map((index) => (
              <div key={index} className="grid grid-cols-12 gap-2 px-4 py-3 border-b">
                <div className="col-span-6 sm:col-span-4 flex items-center gap-2">
                  <Skeleton className="h-8 w-8 rounded-full" />
                  <div className="space-y-1">
                    <Skeleton className="h-4 w-16" />
                    <Skeleton className="h-3 w-10" />
                  </div>
                </div>
                <Skeleton className="col-span-3 sm:col-span-2 h-4 w-full ml-auto" />
                <Skeleton className="col-span-3 sm:col-span-2 h-4 w-full ml-auto" />
                <Skeleton className="hidden sm:block sm:col-span-2 h-4 w-full ml-auto" />
                <Skeleton className="hidden sm:block sm:col-span-2 h-4 w-full ml-auto" />
              </div>
            ))}
          </>
        ) : (
          <>
            {cryptos.length === 0 ? (
              <div className="py-6 text-center text-muted-foreground">
                No cryptocurrencies found
              </div>
            ) : (
              cryptos.map((crypto) => (
                <div
                  key={crypto.id}
                  className={cn(
                    "grid grid-cols-12 gap-2 px-4 py-3 border-b cursor-pointer hover:bg-muted/50 transition-colors",
                    selectedCryptoId === crypto.id && "bg-muted"
                  )}
                  onClick={() => onSelectCrypto(crypto)}
                >
                  <div className="col-span-6 sm:col-span-4 flex items-center gap-2">
                    <img
                      src={crypto.image}
                      alt={crypto.name}
                      className="h-8 w-8 rounded-full flex-shrink-0"
                    />
                    <div className="min-w-0 truncate">
                      <div className="font-medium truncate">{crypto.name}</div>
                      <div className="text-xs text-muted-foreground">
                        {crypto.symbol.toUpperCase()}
                      </div>
                    </div>
                  </div>

                  <div className="col-span-3 sm:col-span-2 text-right self-center truncate">
                    ${crypto.current_price.toLocaleString()}
                  </div>

                  <div
                    className={cn(
                      "col-span-3 sm:col-span-2 text-right self-center flex items-center justify-end",
                      crypto.price_change_percentage_24h > 0
                        ? "text-green-500"
                        : "text-red-500"
                    )}
                  >
                    {crypto.price_change_percentage_24h > 0 ? (
                      <ArrowUp className="h-3 w-3 mr-1 flex-shrink-0" />
                    ) : (
                      <ArrowDown className="h-3 w-3 mr-1 flex-shrink-0" />
                    )}
                    <span className="truncate">
                      {Math.abs(crypto.price_change_percentage_24h).toFixed(2)}%
                    </span>
                  </div>

                  <div className="hidden sm:block sm:col-span-2 text-right self-center truncate">
                    ${(crypto.market_cap / 1000000000).toFixed(2)}B
                  </div>

                  <div className="hidden sm:block sm:col-span-2 text-right self-center truncate">
                    ${(crypto.total_volume / 1000000).toFixed(2)}M
                  </div>
                </div>
              ))
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default CryptoList;
