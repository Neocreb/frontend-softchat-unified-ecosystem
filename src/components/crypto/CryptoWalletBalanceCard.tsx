import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Sparkles, TrendingUp, TrendingDown, Eye, EyeOff, Shield } from "lucide-react";
import { cn } from "@/lib/utils";

interface CryptoWalletBalanceCardProps {
  totalBalance: number;
  totalBalance24hChange: number;
  totalBalance24hPercent: number;
  primaryAsset: {
    symbol: string;
    balance: number;
    value: number;
  };
  onDeposit?: () => void;
  onWithdraw?: () => void;
  className?: string;
}

export default function CryptoWalletBalanceCard({
  totalBalance,
  totalBalance24hChange,
  totalBalance24hPercent,
  primaryAsset,
  onDeposit,
  onWithdraw,
  className
}: CryptoWalletBalanceCardProps) {
  const [showBalance, setShowBalance] = useState(true);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  };

  const formatPercentage = (value: number) => {
    return `${value >= 0 ? "+" : ""}${value.toFixed(2)}%`;
  };

  const isPositive = totalBalance24hPercent >= 0;

  return (
    <Card
      className={cn(
        "relative overflow-hidden border-0 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-[1.01]",
        "bg-gradient-to-br from-eloity-primary/90 to-eloity-600/90 dark:from-eloity-primary/80 dark:to-eloity-700/80",
        "w-full max-w-5xl mx-auto backdrop-blur-sm",
        "min-h-[280px] sm:min-h-[320px] lg:min-h-[360px]",
        "transform-gpu", // Enable GPU acceleration for better performance
        className
      )}
    >
      {/* Enhanced professional gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-black/10" />

      {/* Subtle geometric pattern overlay */}
      <div
        className="absolute inset-0 opacity-[0.08] dark:opacity-[0.06]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='white' fill-opacity='0.4'%3E%3Cpath d='M20 20L0 0h40L20 20z'/%3E%3Cpath d='M20 20L40 40H0L20 20z'/%3E%3C/g%3E%3C/svg%3E")`
        }}
      />

      {/* Additional subtle texture for depth */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/5 to-transparent" />

      <CardContent className="relative z-10 p-4 sm:p-6 h-full flex flex-col justify-between">
        {/* Header Row */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="p-2 sm:p-2.5 bg-white/25 backdrop-blur-md rounded-xl shadow-lg ring-1 ring-white/20 hover:bg-white/30 transition-all duration-200">
              <Sparkles className="h-5 w-5 sm:h-6 sm:w-6 text-white drop-shadow-sm" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-white drop-shadow-lg tracking-tight">
                Crypto Wallet
              </h2>
              <p className="text-white/95 text-xs sm:text-sm font-medium drop-shadow tracking-wide">
                Digital asset portfolio
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 sm:gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowBalance(!showBalance)}
              className="text-white hover:bg-white/25 rounded-xl p-1.5 sm:p-2 transition-all duration-200 backdrop-blur-md ring-1 ring-white/10 hover:ring-white/20 hover:scale-105"
            >
              {showBalance ? (
                <EyeOff className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
              ) : (
                <Eye className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
              )}
            </Button>

            <Badge className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 backdrop-blur-md text-white border border-green-400/30 px-2.5 sm:px-3 py-1.5 text-2xs sm:text-xs font-bold shadow-lg ring-1 ring-green-400/20 hover:from-green-500/25 hover:to-emerald-500/25 transition-all duration-200">
              <Shield className="h-2.5 w-2.5 sm:h-3 sm:w-3 mr-1.5 drop-shadow-sm" />
              <span className="drop-shadow-sm">Secured</span>
            </Badge>
          </div>
        </div>

        {/* Main Content Row */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-6">
          {/* Left: Balance */}
          <div className="space-y-3 flex-1">
            <div>
              <p className="text-white/90 text-2xs sm:text-xs font-semibold uppercase tracking-wider mb-2 drop-shadow-sm">
                Total Portfolio Value
              </p>
              <div className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold text-white drop-shadow-lg tracking-tight">
                {showBalance ? formatCurrency(totalBalance) : "••••••••"}
              </div>
            </div>

            {/* 24h Change */}
            <div className="flex items-center gap-3">
              <div className={cn(
                "flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl font-semibold text-xs sm:text-sm backdrop-blur-md shadow-lg ring-1 transition-all duration-200 hover:scale-105",
                isPositive
                  ? "bg-gradient-to-r from-green-500/25 to-emerald-500/25 text-green-50 border border-green-400/30 ring-green-400/20"
                  : "bg-gradient-to-r from-red-500/25 to-rose-500/25 text-red-50 border border-red-400/30 ring-red-400/20"
              )}>
                {isPositive ? (
                  <TrendingUp className="h-3.5 w-3.5 sm:h-4 sm:w-4 drop-shadow-sm" />
                ) : (
                  <TrendingDown className="h-3.5 w-3.5 sm:h-4 sm:w-4 drop-shadow-sm" />
                )}
                <span className="font-bold drop-shadow-sm">
                  {showBalance ? formatCurrency(Math.abs(totalBalance24hChange)) : "••••"}
                </span>
                <span className="text-xs font-medium opacity-90">
                  ({showBalance ? formatPercentage(totalBalance24hPercent) : "••••"})
                </span>
              </div>
              <span className="text-white/85 text-xs sm:text-sm font-medium tracking-wide drop-shadow-sm">24h change</span>
            </div>
          </div>

          {/* Right: Primary Asset & Actions */}
          <div className="text-left sm:text-right space-y-3 sm:space-y-4 w-full sm:w-auto sm:min-w-[280px]">
            <div className="space-y-1">
              <p className="text-white/90 text-2xs sm:text-xs font-semibold uppercase tracking-wider mb-2 drop-shadow-sm">
                Primary Asset
              </p>
              <div className="text-lg sm:text-xl lg:text-2xl font-bold text-white drop-shadow-lg tracking-tight">
                {showBalance ? `${primaryAsset.balance} ${primaryAsset.symbol}` : "••••••"}
              </div>
              <p className="text-white/95 text-sm sm:text-base font-medium drop-shadow-sm">
                ≈ {showBalance ? formatCurrency(primaryAsset.value) : "••••••"}
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2.5 w-full sm:w-auto">
              <Button
                onClick={onDeposit}
                className="bg-white/25 hover:bg-white/35 text-white border border-white/30 backdrop-blur-md font-bold px-4 sm:px-6 py-2.5 rounded-xl shadow-lg transition-all duration-200 hover:scale-105 hover:shadow-xl flex-1 sm:flex-none text-sm sm:text-base ring-1 ring-white/20 hover:ring-white/30"
              >
                Deposit
              </Button>
              <Button
                onClick={onWithdraw}
                className="bg-white text-eloity-primary hover:bg-white/95 border border-white font-bold px-4 sm:px-6 py-2.5 rounded-xl shadow-lg transition-all duration-200 hover:scale-105 hover:shadow-xl flex-1 sm:flex-none text-sm sm:text-base hover:ring-2 hover:ring-white/50"
              >
                Withdraw
              </Button>
            </div>
          </div>
        </div>

        {/* Footer Row */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4 pt-2 border-t border-white/10">
          <div className="font-mono text-white/85 text-xs sm:text-sm tracking-wider drop-shadow-sm font-medium">
            **** **** **** {String(Math.floor(totalBalance)).slice(-4)}
          </div>

          <div className="flex items-center gap-3 sm:gap-4 text-white/85 text-2xs sm:text-xs">
            <div className="flex items-center gap-1.5 sm:gap-2 px-2 py-1 bg-white/10 rounded-lg backdrop-blur-sm">
              <div className="w-2 h-2 sm:w-2.5 sm:h-2.5 bg-green-400 rounded-full animate-pulse shadow-lg shadow-green-400/50" />
              <span className="font-semibold tracking-wide drop-shadow-sm">Live</span>
            </div>
            <div className="hidden sm:flex items-center text-white/75 font-medium">
              <span>Updated: {new Date().toLocaleTimeString()}</span>
            </div>
            <div className="sm:hidden text-white/75 font-medium">
              {new Date().toLocaleTimeString()}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
