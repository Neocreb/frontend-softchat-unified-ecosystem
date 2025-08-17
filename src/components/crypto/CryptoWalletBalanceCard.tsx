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
        "relative overflow-hidden border-0 shadow-xl",
        "bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900",
        "w-full max-w-4xl mx-auto",
        className
      )}
    >
      {/* Professional gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 via-purple-600/10 to-indigo-800/20" />
      
      {/* Subtle pattern overlay */}
      <div className="absolute inset-0 opacity-5" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='7' cy='7' r='1'/%3E%3Ccircle cx='53' cy='53' r='1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
      }} />

      <CardContent className="relative z-10 p-8">
        {/* Header Section */}
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6 mb-8">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-2xl shadow-lg">
              <Sparkles className="h-8 w-8 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white mb-1">
                Crypto Portfolio
              </h2>
              <p className="text-blue-100/80 text-sm font-medium">
                Professional trading dashboard
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowBalance(!showBalance)}
              className="text-white hover:bg-white/10 transition-colors rounded-xl"
            >
              {showBalance ? (
                <EyeOff className="h-4 w-4 mr-2" />
              ) : (
                <Eye className="h-4 w-4 mr-2" />
              )}
              {showBalance ? "Hide" : "Show"}
            </Button>
            
            <Badge className="bg-gradient-to-r from-emerald-500 to-green-600 text-white border-0 px-3 py-1.5 shadow-lg">
              <Shield className="h-3 w-3 mr-1.5" />
              Secured
            </Badge>
          </div>
        </div>

        {/* Main Balance Section */}
        <div className="grid lg:grid-cols-2 gap-8 mb-8">
          {/* Portfolio Value */}
          <div className="space-y-4">
            <div>
              <p className="text-blue-100/70 text-sm font-medium uppercase tracking-wide mb-2">
                Total Portfolio Value
              </p>
              <div className="text-5xl lg:text-6xl font-bold text-white mb-2">
                {showBalance ? formatCurrency(totalBalance) : "••••••••"}
              </div>
            </div>

            {/* 24h Change */}
            <div className="flex items-center gap-3">
              <div className={cn(
                "flex items-center gap-2 px-3 py-2 rounded-xl font-medium",
                isPositive 
                  ? "bg-emerald-500/20 text-emerald-300" 
                  : "bg-red-500/20 text-red-300"
              )}>
                {isPositive ? (
                  <TrendingUp className="h-5 w-5" />
                ) : (
                  <TrendingDown className="h-5 w-5" />
                )}
                <span className="text-lg">
                  {showBalance ? formatCurrency(Math.abs(totalBalance24hChange)) : "••••"}
                </span>
                <span className="text-sm">
                  ({showBalance ? formatPercentage(totalBalance24hPercent) : "••••"})
                </span>
              </div>
              <span className="text-blue-100/60 text-sm font-medium">24h</span>
            </div>
          </div>

          {/* Primary Asset */}
          <div className="space-y-4">
            <div>
              <p className="text-blue-100/70 text-sm font-medium uppercase tracking-wide mb-2">
                Primary Asset
              </p>
              <div className="text-3xl font-bold text-white mb-1">
                {showBalance ? `${primaryAsset.balance} ${primaryAsset.symbol}` : "••••••"}
              </div>
              <p className="text-blue-100/80 text-lg">
                ≈ {showBalance ? formatCurrency(primaryAsset.value) : "••••••"}
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4">
              <Button
                onClick={onDeposit}
                className="flex-1 bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white font-semibold py-3 rounded-xl shadow-lg transition-all duration-200 hover:scale-[1.02]"
              >
                Deposit
              </Button>
              <Button
                onClick={onWithdraw}
                variant="outline"
                className="flex-1 border-2 border-white/20 text-white hover:bg-white/10 font-semibold py-3 rounded-xl transition-all duration-200 hover:scale-[1.02]"
              >
                Withdraw
              </Button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pt-6 border-t border-white/10">
          <div className="font-mono text-blue-100/60 text-sm tracking-wider">
            **** **** **** {String(Math.floor(totalBalance)).slice(-4)}
          </div>
          
          <div className="flex items-center gap-4 text-blue-100/60 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
              <span>Live Market Data</span>
            </div>
            <span>Updated: {new Date().toLocaleTimeString()}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
