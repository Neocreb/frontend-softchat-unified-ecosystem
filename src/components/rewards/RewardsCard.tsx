import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  CreditCard,
  ArrowUpRight,
  Star,
  TrendingUp,
  Wallet,
  Shield,
  Sparkles,
} from "lucide-react";
import { formatCurrency, formatNumber } from "@/utils/formatters";
import { cn } from "@/lib/utils";

interface RewardsCardProps {
  currentSoftPoints: number;
  availableToWithdraw: number;
  totalEarnings: number;
  trustScore: {
    current: number;
    level: string;
    multiplier: number;
  };
  currency?: string;
  onWithdraw: () => void;
  className?: string;
}

const RewardsCard: React.FC<RewardsCardProps> = ({
  currentSoftPoints,
  availableToWithdraw,
  totalEarnings,
  trustScore,
  currency = "USD",
  onWithdraw,
  className,
}) => {
  const [isHovered, setIsHovered] = useState(false);

  const getTierColor = (level: string) => {
    switch (level.toLowerCase()) {
      case "gold":
        return "from-yellow-400 to-yellow-600";
      case "silver":
        return "from-gray-300 to-gray-500";
      case "platinum":
        return "from-purple-400 to-purple-600";
      case "diamond":
        return "from-blue-400 to-blue-600";
      default:
        return "from-orange-400 to-orange-600"; // Bronze
    }
  };

  const getTierIcon = (level: string) => {
    switch (level.toLowerCase()) {
      case "gold":
      case "platinum":
      case "diamond":
        return <Star className="h-4 w-4" />;
      default:
        return <Shield className="h-4 w-4" />;
    }
  };

  return (
    <Card
      className={cn(
        "relative overflow-hidden transition-all duration-300 hover:shadow-xl hover:scale-[1.02]",
        "bg-gradient-to-br from-softchat-primary via-purple-600 to-blue-700",
        "border-0 text-white",
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
      </div>

      <CardContent className="relative z-10 p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative">
              <CreditCard className="h-8 w-8 text-white" />
              <Sparkles className="absolute -top-1 -right-1 h-4 w-4 text-yellow-300" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">SoftChat Rewards</h2>
              <p className="text-white/80 text-sm">Quality-based earnings</p>
            </div>
          </div>
          <Badge
            className={cn(
              "bg-gradient-to-r text-white border-white/20",
              getTierColor(trustScore.level)
            )}
          >
            {getTierIcon(trustScore.level)}
            <span className="ml-1">{trustScore.level}</span>
          </Badge>
        </div>

        {/* Main Balance Display */}
        <div className="space-y-4">
          {/* SoftPoints */}
          <div className="text-center space-y-2">
            <div className="flex items-center justify-center gap-2">
              <Star className="h-6 w-6 text-yellow-300" />
              <span className="text-3xl md:text-4xl font-bold text-white">
                {formatNumber(currentSoftPoints)}
              </span>
              <span className="text-lg text-white/80 font-medium">SP</span>
            </div>
            <p className="text-white/70 text-sm">Current SoftPoints Balance</p>
          </div>

          {/* Conversion Value */}
          <div className="text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 rounded-full backdrop-blur-sm">
              <TrendingUp className="h-4 w-4 text-green-300" />
              <span className="text-xl font-semibold text-white">
                {formatCurrency(availableToWithdraw, currency)}
              </span>
              <span className="text-white/80 text-sm">available</span>
            </div>
          </div>

          {/* Quick Stats Row */}
          <div className="grid grid-cols-2 gap-4 pt-2">
            <div className="text-center">
              <div className="text-base md:text-lg font-bold text-white">
                {formatCurrency(totalEarnings, currency)}
              </div>
              <div className="text-xs text-white/70">Total Earned</div>
            </div>
            <div className="text-center">
              <div className="text-base md:text-lg font-bold text-white flex items-center justify-center gap-1">
                {trustScore.current}
                <span className="text-sm text-green-300">
                  ({trustScore.multiplier}x)
                </span>
              </div>
              <div className="text-xs text-white/70">Trust Score</div>
            </div>
          </div>
        </div>

        {/* Action Button */}
        <div className="pt-2">
          <Button
            onClick={onWithdraw}
            className="w-full bg-white/20 hover:bg-white/30 text-white border border-white/30 backdrop-blur-sm transition-all duration-200 hover:scale-105 font-semibold"
            size="lg"
          >
            <Wallet className="h-5 w-5 mr-2" />
            Withdraw to Wallet
            <ArrowUpRight className="h-4 w-4 ml-2" />
          </Button>
        </div>

        {/* Card Number Aesthetic */}
        <div className="flex justify-between items-center pt-2 border-t border-white/20">
          <div className="text-white/60 text-xs font-mono">
            **** **** **** {String(currentSoftPoints).slice(-4)}
          </div>
          <div className="text-white/60 text-xs">
            Valid until 12/99
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default RewardsCard;
