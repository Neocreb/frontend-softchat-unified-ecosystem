import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Wallet, Eye, EyeOff, TrendingUp, ArrowUpRight, ArrowDownLeft, Shield } from "lucide-react";
import { cn } from "@/lib/utils";

export default function CryptoWalletBalanceCard() {
  // Example data, replace with your props or state as needed
  const totalBalance = 24567.89;
  const totalBalance24hChange = 1234.56;
  const totalBalance24hPercent = 5.27;
  const primaryAsset = { symbol: "BTC", balance: 0.4523, value: 22150.45 };
  const [showBalance, setShowBalance] = useState(true);

  return (
    <Card
      className={cn(
        "rounded-2xl shadow-lg overflow-hidden border-0",
        "bg-gradient-to-br from-[#2B4FB5] via-[#4F6BD3] to-[#8B5CF6]",
        "w-full max-w-md mx-auto text-white",
        "dark:shadow-xl dark:shadow-blue-500/10"
      )}
    >
      <CardContent className="p-4 sm:p-6 md:p-8 flex flex-col gap-5 h-full w-full">
        {/* Header */}
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-center gap-3">
            <Wallet className="text-white h-6 w-6" />
            <div>
              <h2 className="text-lg font-bold text-white">Crypto Wallet</h2>
              <p className="text-sm text-white/80">Digital asset portfolio</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full text-white hover:bg-white/20 h-8 w-8"
              onClick={() => setShowBalance((s) => !s)}
            >
              {showBalance ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
            </Button>
            <Badge className="bg-green-500/20 text-green-300 border-green-400/30 hover:bg-green-500/30">
              <Shield className="h-3 w-3 mr-1" />
              Secured
            </Badge>
          </div>
        </div>
        {/* Main Content */}
        <div className="mb-6">
          {/* Total Portfolio Value */}
          <div className="mb-4">
            <div className="text-xs text-white/70 mb-1">Total Portfolio Value</div>
            <div className="text-3xl font-bold text-white mb-2">
              {showBalance ? `$${totalBalance.toLocaleString()}` : "$****.**"}
            </div>
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-green-400" />
              <span className="text-green-400 font-semibold">
                {showBalance ? `$${totalBalance24hChange.toLocaleString()}` : "$**.**"}
              </span>
              <span className="text-green-400 text-sm">
                ({showBalance ? `+${totalBalance24hPercent}%` : "+*%"}) 24h
              </span>
            </div>
          </div>

          {/* Primary Asset and Actions */}
          <div className="flex items-center justify-between">
            <div>
              <div className="text-xs text-white/70">Primary Asset</div>
              <div className="text-lg font-bold text-white">
                {showBalance ? `${primaryAsset.balance} ${primaryAsset.symbol}` : "*.*** ***"}
              </div>
              <div className="text-sm text-white/80">
                ≈ {showBalance ? `$${primaryAsset.value.toLocaleString()}` : "$****.**"}
              </div>
            </div>
            <div className="flex gap-2">
              <Button className="bg-green-500 hover:bg-green-600 text-white px-4 py-2">
                <ArrowDownLeft className="h-4 w-4 mr-1" />
                Deposit
              </Button>
              <Button className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2">
                <ArrowUpRight className="h-4 w-4 mr-1" />
                Withdraw
              </Button>
            </div>
          </div>
        </div>
        {/* Bottom row */}
        <div className="flex justify-between items-center border-t border-white/20 pt-3">
          <span className="font-mono text-white/70 text-sm tracking-wider">
            **** **** **** 4567
          </span>
          <div className="flex items-center gap-2 text-white/70 text-sm">
            <span>Last updated: 8:37:47 AM</span>
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" /> Live
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
