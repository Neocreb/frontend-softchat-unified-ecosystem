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
        "relative overflow-hidden border-0 shadow-2xl",
        "bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600",
        "w-full max-w-5xl mx-auto",
        "min-h-[280px] sm:min-h-[320px] lg:min-h-[360px]", // Responsive height instead of aspect ratio
        className
      )}
    >
      {/* Credit card styling overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-black/20 via-transparent to-white/10" />
      
      {/* Subtle mesh pattern */}
      <div className="absolute inset-0 opacity-10" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='white' fill-opacity='0.2'%3E%3Cpath d='M20 20.5V18H40v-2H20v-2.5L23.5 16l-3.5-4-3.5 4L20 13.5V16H0v2h20v2.5L16.5 24l3.5 4 3.5-4L20 20.5z'/%3E%3C/g%3E%3C/svg%3E")`
      }} />

      <CardContent className="relative z-10 p-4 sm:p-6 h-full flex flex-col justify-between">
        {/* Header Row */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="p-1.5 sm:p-2 bg-yellow-400 rounded-xl shadow-lg">
              <Sparkles className="h-5 w-5 sm:h-6 sm:w-6 text-gray-900" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-gray-900 drop-shadow-lg">
                Crypto Wallet
              </h2>
              <p className="text-gray-800 text-xs sm:text-sm font-medium drop-shadow">
                Digital asset portfolio
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1 sm:gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowBalance(!showBalance)}
              className="text-white hover:bg-white/20 rounded-lg p-1.5 sm:p-2"
            >
              {showBalance ? (
                <EyeOff className="h-3 w-3 sm:h-4 sm:w-4" />
              ) : (
                <Eye className="h-3 w-3 sm:h-4 sm:w-4" />
              )}
            </Button>

            <Badge className="bg-emerald-500 text-white px-2 sm:px-3 py-1 text-2xs sm:text-xs font-semibold shadow-lg">
              <Shield className="h-2.5 w-2.5 sm:h-3 sm:w-3 mr-1" />
              Secured
            </Badge>
          </div>
        </div>

        {/* Main Content Row */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-2">
          {/* Left: Balance */}
          <div className="space-y-2 flex-1">
            <div>
              <p className="text-gray-200 text-2xs sm:text-xs font-medium uppercase tracking-wide mb-1">
                Total Portfolio Value
              </p>
              <div className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold text-white drop-shadow-lg">
                {showBalance ? formatCurrency(totalBalance) : "••••••••"}
              </div>
            </div>

            {/* 24h Change */}
            <div className="flex items-center gap-2">
              <div className={cn(
                "flex items-center gap-1 sm:gap-1.5 px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg font-medium text-2xs sm:text-sm",
                isPositive
                  ? "bg-emerald-100 text-emerald-800"
                  : "bg-red-100 text-red-800"
              )}>
                {isPositive ? (
                  <TrendingUp className="h-3 w-3 sm:h-4 sm:w-4" />
                ) : (
                  <TrendingDown className="h-3 w-3 sm:h-4 sm:w-4" />
                )}
                <span className="text-2xs sm:text-sm">
                  {showBalance ? formatCurrency(Math.abs(totalBalance24hChange)) : "••••"}
                </span>
                <span className="text-2xs sm:text-xs">
                  ({showBalance ? formatPercentage(totalBalance24hPercent) : "••••"})
                </span>
              </div>
              <span className="text-gray-200 text-2xs sm:text-xs font-medium">24h</span>
            </div>
          </div>

          {/* Right: Primary Asset & Actions */}
          <div className="text-left sm:text-right space-y-2 sm:space-y-3 w-full sm:w-auto">
            <div>
              <p className="text-gray-200 text-2xs sm:text-xs font-medium uppercase tracking-wide mb-1">
                Primary Asset
              </p>
              <div className="text-lg sm:text-xl lg:text-2xl font-bold text-white drop-shadow">
                {showBalance ? `${primaryAsset.balance} ${primaryAsset.symbol}` : "••••••"}
              </div>
              <p className="text-gray-200 text-xs sm:text-sm font-medium">
                ≈ {showBalance ? formatCurrency(primaryAsset.value) : "••••••"}
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2 w-full sm:w-auto">
              <Button
                onClick={onDeposit}
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-3 sm:px-6 py-2 rounded-lg shadow-lg transition-all duration-200 hover:scale-105 flex-1 sm:flex-none text-sm sm:text-base"
              >
                Deposit
              </Button>
              <Button
                onClick={onWithdraw}
                className="bg-orange-600 hover:bg-orange-700 text-white font-semibold px-3 sm:px-6 py-2 rounded-lg shadow-lg transition-all duration-200 hover:scale-105 flex-1 sm:flex-none text-sm sm:text-base"
              >
                Withdraw
              </Button>
            </div>
          </div>
        </div>

        {/* Footer Row */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-4">
          <div className="font-mono text-gray-200 text-xs sm:text-sm tracking-wider drop-shadow">
            **** **** **** {String(Math.floor(totalBalance)).slice(-4)}
          </div>

          <div className="flex items-center gap-2 sm:gap-4 text-gray-200 text-2xs sm:text-xs">
            <div className="flex items-center gap-1 sm:gap-1.5">
              <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-emerald-500 rounded-full animate-pulse" />
              <span className="font-medium">Live</span>
            </div>
            <span className="hidden sm:inline">Last updated: {new Date().toLocaleTimeString()}</span>
            <span className="sm:hidden">{new Date().toLocaleTimeString()}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
