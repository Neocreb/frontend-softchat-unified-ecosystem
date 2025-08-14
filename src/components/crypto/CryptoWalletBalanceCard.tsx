import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Wallet,
  Sparkles,
  Shield,
  Eye,
  EyeOff,
  ArrowDownLeft,
  ArrowUpRight,
  TrendingUp,
  TrendingDown,
  Bitcoin,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface CryptoWalletBalanceCardProps {
  totalBalance: number;
  totalBalance24hChange: number;
  totalBalance24hPercent: number;
  primaryAsset: {
    symbol: string;
    name: string;
    balance: number;
    value: number;
    change24h: number;
  };
  onDeposit: () => void;
  onWithdraw: () => void;
  className?: string;
}

const CryptoWalletBalanceCard: React.FC<CryptoWalletBalanceCardProps> = ({
  totalBalance,
  totalBalance24hChange,
  totalBalance24hPercent,
  primaryAsset,
  onDeposit,
  onWithdraw,
  className,
}) => {
  const [showBalance, setShowBalance] = useState(true);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  };

  const formatCrypto = (amount: number, decimals = 6) => {
    return new Intl.NumberFormat("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: decimals,
    }).format(amount);
  };

  const formatPercentage = (value: number) => {
    return `${value >= 0 ? "+" : ""}${value.toFixed(2)}%`;
  };

  const getChangeColor = (value: number) => {
    return value >= 0 ? "text-green-600" : "text-red-600";
  };

  const getChangeIcon = (value: number) => {
    return value >= 0 ? (
      <TrendingUp className="h-4 w-4 text-green-600" />
    ) : (
      <TrendingDown className="h-4 w-4 text-red-600" />
    );
  };

  return (
    <Card
      className={cn(
        "relative overflow-hidden transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/25 hover:scale-[1.01]",
        "rounded-2xl border-0",
        // Strong blue/purple gradient background
        "bg-[linear-gradient(110deg,#2951d6_0%,#8145e6_100%)]",
        className
      )}
      style={{
        background: "linear-gradient(110deg,#2951d6 0%,#8145e6 100%)",
      }}
    >
      <CardContent className="relative z-10 p-4 sm:p-8 h-full flex flex-col justify-between">
        {/* Top Section */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                <Wallet className="h-5 w-5 sm:h-6 sm:w-6 text-gray-900" />
              </div>
              <Sparkles className="absolute -top-1 -right-1 h-3 w-3 sm:h-4 sm:w-4 text-yellow-400" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-gray-900">Crypto Wallet</h2>
              <p className="text-sm text-gray-700">Digital asset portfolio</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowBalance(!showBalance)}
              className="text-gray-700 hover:text-gray-900 hover:bg-white/20 p-1 h-8 w-8"
            >
              {showBalance ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
            </Button>
            <Badge className="bg-gradient-to-r from-fuchsia-500 to-purple-500 text-white border-0 text-xs font-semibold">
              <Shield className="h-3 w-3 mr-1" />
              Secured
            </Badge>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex items-center justify-between mt-8">
          {/* Left: Main Balance */}
          <div className="space-y-3">
            <div className="space-y-1">
              <div className="text-xs font-medium text-gray-600">Total Portfolio Value</div>
              <div className="flex items-center gap-2">
                <span className="text-3xl sm:text-5xl font-extrabold text-gray-900 drop-shadow-lg">
                  {showBalance ? formatCurrency(totalBalance) : "****.**"}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-2 mt-2">
              {getChangeIcon(totalBalance24hPercent)}
              <span className={cn("text-lg sm:text-xl font-semibold", getChangeColor(totalBalance24hPercent))}>
                {showBalance ? formatCurrency(totalBalance24hChange) : "**.**"}
              </span>
              <span className={cn("text-base", getChangeColor(totalBalance24hPercent))}>
                ({showBalance ? formatPercentage(totalBalance24hPercent) : "**%"}) 24h
              </span>
            </div>
          </div>

          {/* Right: Primary Asset & Actions */}
          <div className="text-right space-y-3">
            <div className="space-y-1">
              <div className="text-xs text-gray-600">Primary Asset</div>
              <div className="text-base font-bold text-gray-900">
                {showBalance ? formatCrypto(primaryAsset.balance, 4) : "**.**"} {primaryAsset.symbol}
              </div>
              <div className="text-xs text-gray-700">
                ≈ {showBalance ? formatCurrency(primaryAsset.value) : "****"}
              </div>
            </div>
            <div className="flex gap-2">
              <Button
                onClick={onDeposit}
                className="bg-green-600 hover:bg-green-700 text-white border-0 backdrop-blur-sm transition-all duration-200 hover:scale-105 text-xs px-3 py-1.5"
                size="sm"
              >
                <ArrowDownLeft className="h-3 w-3 mr-1" />
                Deposit
              </Button>
              <Button
                onClick={onWithdraw}
                className="bg-orange-500 hover:bg-orange-600 text-white border-0 backdrop-blur-sm transition-all duration-200 hover:scale-105 text-xs px-3 py-1.5"
                size="sm"
              >
                <ArrowUpRight className="h-3 w-3 mr-1" />
                Withdraw
              </Button>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="flex justify-between items-center border-t border-white/20 pt-3 mt-10">
          <div className="text-gray-700 text-xs font-mono">
            **** **** **** {showBalance ? String(Math.floor(totalBalance)).slice(-4) : "****"}
          </div>
          <div className="flex items-center gap-4 text-gray-700 text-xs">
            <span>Last updated: {new Date().toLocaleTimeString()}</span>
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span>Live</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CryptoWalletBalanceCard;
