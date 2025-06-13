import { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import { cn } from "@/lib/utils";

interface RealTimePriceDisplayProps {
  price: number;
  change24h: number;
  symbol: string;
  showSymbol?: boolean;
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function RealTimePriceDisplay({
  price,
  change24h,
  symbol,
  showSymbol = true,
  size = "md",
  className,
}: RealTimePriceDisplayProps) {
  const [previousPrice, setPreviousPrice] = useState(price);
  const [priceDirection, setPriceDirection] = useState<"up" | "down" | "same">(
    "same",
  );
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (price !== previousPrice) {
      setIsAnimating(true);
      setPriceDirection(
        price > previousPrice ? "up" : price < previousPrice ? "down" : "same",
      );
      setPreviousPrice(price);

      // Reset animation after duration
      const timer = setTimeout(() => {
        setIsAnimating(false);
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, [price, previousPrice]);

  const formatPrice = (value: number): string => {
    if (value >= 1000) {
      return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(value);
    } else if (value >= 1) {
      return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
        minimumFractionDigits: 2,
        maximumFractionDigits: 4,
      }).format(value);
    } else {
      return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
        minimumFractionDigits: 6,
        maximumFractionDigits: 8,
      }).format(value);
    }
  };

  const formatChange = (value: number): string => {
    return `${value >= 0 ? "+" : ""}${value.toFixed(2)}%`;
  };

  const getChangeColor = (value: number): string => {
    if (value > 0) return "text-green-600";
    if (value < 0) return "text-red-600";
    return "text-gray-600";
  };

  const getChangeIcon = (value: number) => {
    if (value > 0) return <TrendingUp className="h-3 w-3" />;
    if (value < 0) return <TrendingDown className="h-3 w-3" />;
    return <Minus className="h-3 w-3" />;
  };

  const getSizeClasses = () => {
    switch (size) {
      case "sm":
        return {
          price: "text-sm font-semibold",
          change: "text-xs",
          symbol: "text-xs",
          gap: "gap-1",
        };
      case "lg":
        return {
          price: "text-2xl font-bold",
          change: "text-sm",
          symbol: "text-sm",
          gap: "gap-3",
        };
      default: // md
        return {
          price: "text-lg font-semibold",
          change: "text-sm",
          symbol: "text-sm",
          gap: "gap-2",
        };
    }
  };

  const sizeClasses = getSizeClasses();

  return (
    <div className={cn("flex items-center", sizeClasses.gap, className)}>
      {/* Symbol */}
      {showSymbol && (
        <Badge variant="outline" className={sizeClasses.symbol}>
          {symbol.toUpperCase()}
        </Badge>
      )}

      {/* Price with animation */}
      <div
        className={cn(
          sizeClasses.price,
          "transition-all duration-500 ease-in-out",
          isAnimating && priceDirection === "up" && "text-green-600 scale-105",
          isAnimating && priceDirection === "down" && "text-red-600 scale-105",
          !isAnimating && "text-gray-900",
        )}
      >
        {formatPrice(price)}
      </div>

      {/* 24h Change */}
      <div
        className={cn(
          "flex items-center gap-1",
          sizeClasses.change,
          getChangeColor(change24h),
        )}
      >
        {getChangeIcon(change24h)}
        <span>{formatChange(change24h)}</span>
      </div>

      {/* Live indicator */}
      <div className="flex items-center gap-1">
        <div
          className={cn(
            "w-1.5 h-1.5 rounded-full",
            isAnimating
              ? priceDirection === "up"
                ? "bg-green-500 animate-ping"
                : "bg-red-500 animate-ping"
              : "bg-blue-500 animate-pulse",
          )}
        />
        {size === "lg" && <span className="text-xs text-gray-500">LIVE</span>}
      </div>
    </div>
  );
}

// Hook for real-time price updates
export function useRealTimePrice(initialPrice: number, symbol: string) {
  const [price, setPrice] = useState(initialPrice);
  const [lastUpdate, setLastUpdate] = useState(new Date());

  useEffect(() => {
    // Simulate small price fluctuations for demo
    const interval = setInterval(
      () => {
        const fluctuation = (Math.random() - 0.5) * 0.02; // ±1%
        const newPrice = price * (1 + fluctuation);
        setPrice(parseFloat(newPrice.toFixed(8)));
        setLastUpdate(new Date());
      },
      2000 + Math.random() * 3000,
    ); // Random interval 2-5 seconds

    return () => clearInterval(interval);
  }, [price]);

  return { price, lastUpdate };
}

export default RealTimePriceDisplay;
