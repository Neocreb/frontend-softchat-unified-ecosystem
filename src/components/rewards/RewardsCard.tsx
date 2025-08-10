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
        "relative overflow-hidden transition-all duration-300 hover:shadow-xl hover:scale-[1.01]",
        "bg-gradient-to-br from-softchat-primary via-purple-600 to-blue-700",
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
      </div>

      <CardContent className="relative z-10 p-4 sm:p-6 h-full flex flex-col justify-between">
        {/* Top Section */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="relative">
              <CreditCard className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
              <Sparkles className="absolute -top-1 -right-1 h-3 w-3 sm:h-4 sm:w-4 text-yellow-300" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-white">SoftChat Rewards</h2>
              <p className="text-white/80 text-xs sm:text-sm">Quality-based earnings</p>
            </div>
          </div>
          <Badge
            className={cn(
              "bg-gradient-to-r text-white border-white/20 text-xs",
              getTierColor(trustScore.level)
            )}
          >
            {getTierIcon(trustScore.level)}
            <span className="ml-1">{trustScore.level}</span>
          </Badge>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex items-center justify-between">
          {/* Left: Main Balance */}
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Star className="h-5 w-5 text-yellow-300" />
              <span className="text-2xl sm:text-3xl font-bold text-white">
                {formatNumber(currentSoftPoints)}
              </span>
              <span className="text-sm text-white/80 font-medium">SP</span>
            </div>
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-green-300" />
              <span className="text-lg sm:text-xl font-semibold text-white">
                {formatCurrency(availableToWithdraw, currency)}
              </span>
              <span className="text-white/80 text-xs">available</span>
            </div>
          </div>

          {/* Right: Stats and Action */}
          <div className="text-right space-y-2">
            <div className="space-y-1">
              <div className="text-sm font-bold text-white">
                {formatCurrency(totalEarnings, currency)}
              </div>
              <div className="text-xs text-white/70">Total Earned</div>
            </div>
            <Button
              onClick={onWithdraw}
              className="bg-white/20 hover:bg-white/30 text-white border border-white/30 backdrop-blur-sm transition-all duration-200 hover:scale-105 text-xs px-3 py-1.5"
              size="sm"
            >
              <Wallet className="h-3 w-3 mr-1" />
              Withdraw
            </Button>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="flex justify-between items-center border-t border-white/20 pt-2">
          <div className="text-white/60 text-xs font-mono">
            **** **** **** {String(currentSoftPoints).slice(-4)}
          </div>
          <div className="text-white/60 text-xs">
            Trust: {trustScore.current} ({trustScore.multiplier}x)
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default RewardsCard;
