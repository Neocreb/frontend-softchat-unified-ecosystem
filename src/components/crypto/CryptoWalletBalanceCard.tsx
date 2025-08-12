import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  CreditCard,
  ArrowUpRight,
  ArrowDownLeft,
  Wallet,
  TrendingUp,
  TrendingDown,
  Bitcoin,
  Sparkles,
  Shield,
  Eye,
  EyeOff,
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
  const [isHovered, setIsHovered] = useState(false);
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
    return value >= 0 ? "text-green-400" : "text-red-400";
  };

  const getChangeIcon = (value: number) => {
    return value >= 0 ? (
      <TrendingUp className="h-4 w-4" />
    ) : (
      <TrendingDown className="h-4 w-4" />
    );
  };

  return (
    <Card
      className={cn(
        "relative overflow-hidden transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/25 hover:scale-[1.01]",
        "bg-gradient-to-br from-slate-900 via-blue-900 to-purple-900",
        "border-0 text-white aspect-[3/2] max-w-md mx-auto sm:max-w-none sm:aspect-[5/2]",
        className
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div
          className={cn(
            "absolute -top-4 -right-4 w-24 h-24 bg-white/10 rounded-full transition-transform duration-700",
            isHovered ? "scale-150 rotate-45" : "scale-100"
          )}
        />
        <div
          className={cn(
            "absolute -bottom-8 -left-8 w-32 h-32 bg-white/5 rounded-full transition-transform duration-500",
            isHovered ? "scale-125 -rotate-12" : "scale-100"
          )}
        />
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-transparent via-white/5 to-transparent animate-pulse" />
        
        {/* Floating crypto symbols */}
        <div className="absolute top-4 right-8 opacity-10">
          <Bitcoin className="h-8 w-8 animate-spin-slow" />
        </div>
        <div className="absolute bottom-8 left-12 opacity-5">
          <div className="text-4xl font-bold">₿</div>
        </div>
      </div>

      <CardContent className="relative z-10 p-4 sm:p-6 h-full flex flex-col justify-between">
        {/* Top Section */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                <Wallet className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
              </div>
              <Sparkles className="absolute -top-1 -right-1 h-3 w-3 sm:h-4 sm:w-4 text-yellow-300" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-white">Crypto Wallet</h2>
              <p className="text-white/80 text-xs sm:text-sm">Digital asset portfolio</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowBalance(!showBalance)}
              className="text-white/60 hover:text-white hover:bg-white/10 p-1 h-8 w-8"
            >
              {showBalance ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
            </Button>
            <Badge className="bg-gradient-to-r from-green-500 to-emerald-600 text-white border-white/20 text-xs">
              <Shield className="h-3 w-3 mr-1" />
              Secured
            </Badge>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex items-center justify-between">
          {/* Left: Main Balance */}
          <div className="space-y-2">
            <div className="space-y-1">
              <div className="text-white/70 text-xs font-medium">Total Portfolio Value</div>
              <div className="flex items-center gap-2">
                <span className="text-2xl sm:text-4xl font-bold text-white">
                  {showBalance ? formatCurrency(totalBalance) : "****.**"}
                </span>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              {getChangeIcon(totalBalance24hPercent)}
              <span className={cn("text-sm sm:text-base font-semibold", getChangeColor(totalBalance24hPercent))}>
                {showBalance ? formatCurrency(totalBalance24hChange) : "**.**"}
              </span>
              <span className={cn("text-sm", getChangeColor(totalBalance24hPercent))}>
                ({showBalance ? formatPercentage(totalBalance24hPercent) : "**%"}) 24h
              </span>
            </div>
          </div>

          {/* Right: Primary Asset & Actions */}
          <div className="text-right space-y-3">
            <div className="space-y-1">
              <div className="text-white/70 text-xs">Primary Asset</div>
              <div className="text-sm font-bold text-white">
                {showBalance ? formatCrypto(primaryAsset.balance, 4) : "**.**"} {primaryAsset.symbol}
              </div>
              <div className="text-xs text-white/70">
                ≈ {showBalance ? formatCurrency(primaryAsset.value) : "****"}
              </div>
            </div>
            
            <div className="flex gap-2">
              <Button
                onClick={onDeposit}
                className="bg-green-600/80 hover:bg-green-600 text-white border-0 backdrop-blur-sm transition-all duration-200 hover:scale-105 text-xs px-3 py-1.5"
                size="sm"
              >
                <ArrowDownLeft className="h-3 w-3 mr-1" />
                Deposit
              </Button>
              <Button
                onClick={onWithdraw}
                className="bg-orange-600/80 hover:bg-orange-600 text-white border-0 backdrop-blur-sm transition-all duration-200 hover:scale-105 text-xs px-3 py-1.5"
                size="sm"
              >
                <ArrowUpRight className="h-3 w-3 mr-1" />
                Withdraw
              </Button>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="flex justify-between items-center border-t border-white/20 pt-3">
          <div className="text-white/60 text-xs font-mono">
            **** **** **** {showBalance ? String(Math.floor(totalBalance)).slice(-4) : "****"}
          </div>
          <div className="flex items-center gap-4 text-white/60 text-xs">
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
