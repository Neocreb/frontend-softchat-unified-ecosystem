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
        "relative overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300",
        "bg-gradient-to-br from-slate-800 to-purple-900 dark:from-slate-800 dark:to-purple-900",
        "w-full max-w-2xl mx-auto backdrop-blur-sm",
        "min-h-[240px]",
        className
      )}
    >
      {/* Subtle gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-black/20" />

      <CardContent className="relative z-10 p-5 h-full flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/20 rounded-lg">
              <Sparkles className="h-5 w-5 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">
                Crypto Wallet
              </h2>
              <p className="text-white/80 text-sm">
                Digital asset portfolio
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowBalance(!showBalance)}
              className="text-white hover:bg-white/20 rounded-lg p-2"
            >
              {showBalance ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </Button>

            <Badge className="bg-green-500/20 text-green-300 border border-green-400/30 px-2 py-1 text-xs">
              <Shield className="h-3 w-3 mr-1" />
              Secured
            </Badge>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex items-center justify-between flex-1">
          {/* Left: Total Value */}
          <div className="space-y-3">
            <div>
              <p className="text-white/70 text-sm mb-1">
                Total Portfolio Value
              </p>
              <div className="text-3xl font-bold text-white">
                {showBalance ? formatCurrency(totalBalance) : "••••••••"}
              </div>
            </div>

            {/* 24h Change */}
            <div className="flex items-center gap-2">
              <div className={cn(
                "flex items-center gap-1 px-2 py-1 rounded-lg text-sm font-semibold",
                isPositive
                  ? "bg-green-500/20 text-green-300"
                  : "bg-red-500/20 text-red-300"
              )}>
                {isPositive ? (
                  <TrendingUp className="h-4 w-4" />
                ) : (
                  <TrendingDown className="h-4 w-4" />
                )}
                <span>
                  {showBalance ? formatCurrency(Math.abs(totalBalance24hChange)) : "••••"}
                </span>
                <span className="text-xs">
                  ({showBalance ? formatPercentage(totalBalance24hPercent) : "••••"})
                </span>
              </div>
              <span className="text-white/60 text-sm">24h</span>
            </div>
          </div>

          {/* Right: Primary Asset */}
          <div className="text-right space-y-4">
            <div>
              <p className="text-white/70 text-sm mb-1">
                Primary Asset
              </p>
              <div className="text-xl font-bold text-white">
                {showBalance ? `${primaryAsset.balance} ${primaryAsset.symbol}` : "••••••"}
              </div>
              <p className="text-white/80 text-sm">
                ≈ {showBalance ? formatCurrency(primaryAsset.value) : "••••••"}
              </p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 mt-4">
          <Button
            onClick={onDeposit}
            className="bg-green-600 hover:bg-green-700 text-white font-semibold px-6 py-2 rounded-lg transition-all duration-200 flex-1"
          >
            Deposit
          </Button>
          <Button
            onClick={onWithdraw}
            className="bg-orange-600 hover:bg-orange-700 text-white font-semibold px-6 py-2 rounded-lg transition-all duration-200 flex-1"
          >
            Withdraw
          </Button>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between mt-4 pt-3 border-t border-white/10">
          <div className="font-mono text-white/70 text-sm">
            **** **** **** {String(Math.floor(totalBalance)).slice(-4)}
          </div>

          <div className="flex items-center gap-3 text-white/70 text-xs">
            <span>Last updated: {new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
              <span>Live</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
