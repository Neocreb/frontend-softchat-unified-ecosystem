import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Sparkles, TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";

export default function CryptoWalletBalanceCard() {
  // Example data, replace with your props or state as needed
  const totalBalance = 125670.45;
  const totalBalance24hChange = 3240.78;
  const totalBalance24hPercent = 2.64;
  const primaryAsset = { symbol: "BTC", balance: 2.5, value: 108126.68 };
  const [showBalance, setShowBalance] = useState(true);

  return (
    <Card
      className={cn(
        "rounded-2xl shadow-lg overflow-hidden border-0",
        "bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600",
        "w-full max-w-3xl mx-auto"
      )}
    >
      <CardContent className="p-4 sm:p-6 md:p-8 flex flex-col gap-5 h-full w-full">
        {/* Header */}
        <div className="flex flex-col sm:flex-row w-full items-start justify-between gap-2">
          <div className="flex items-center gap-3 flex-shrink-0">
            <Sparkles className="text-yellow-400 flex-shrink-0" />
            <div>
              <h2 className="text-lg font-bold text-white drop-shadow-sm leading-tight">Crypto Wallet</h2>
              <p className="text-sm text-white/90 drop-shadow-sm leading-tight">Digital asset portfolio</p>
            </div>
          </div>
          <div className="flex gap-2 mt-3 sm:mt-0">
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full text-white hover:bg-white/20 drop-shadow-sm"
              onClick={() => setShowBalance((s) => !s)}
              aria-label="Toggle Balance"
            >
              <span className="sr-only">Toggle Balance</span>
              <svg width="20" height="20" fill="none" viewBox="0 0 24 24">
                {showBalance ? (
                  <path stroke="currentColor" strokeWidth="2" d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7S1 12 1 12Zm11 3a3 3 0 100-6 3 3 0 000 6Z"/>
                ) : (
                  <path stroke="currentColor" strokeWidth="2" d="M17.94 17.94A10.06 10.06 0 0112 19c-7 0-11-7-11-7a20.03 20.03 0 014.22-5.94M22.54 16.88A19.97 19.97 0 0023 12s-4-7-11-7c-1.47 0-2.85.19-4.13.54M1 1l22 22"/>
                )}
              </svg>
            </Button>
            <span className="flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-gradient-to-r from-purple-500 to-fuchsia-500 text-white">
              <svg className="h-3 w-3 mr-1" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
              Secured
            </span>
          </div>
        </div>
        {/* Main */}
        <div className="flex flex-col md:flex-row w-full gap-5 md:gap-6">
          {/* Balance + change */}
          <div className="flex-1 flex flex-col justify-center min-w-[0]">
            <div className="text-xs text-white/80 drop-shadow-sm font-medium">Total Portfolio Value</div>
            <div className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white drop-shadow-md break-words">
              {showBalance ? `$${totalBalance.toLocaleString()}` : "****.**"}
            </div>
            <div className="flex flex-wrap items-center gap-x-2 gap-y-1 mt-2">
              <TrendingUp className="h-4 w-4 text-green-600" />
              <span className="text-green-600 text-lg font-semibold">
                {showBalance ? `$${totalBalance24hChange.toLocaleString()}` : "**.**"}
              </span>
              <span className="text-green-600 text-base">
                ({showBalance ? `+${totalBalance24hPercent}%` : "**%"}) 24h
              </span>
            </div>
          </div>
          {/* Primary Asset and Actions */}
          <div className="flex flex-col items-end min-w-[150px] max-w-full">
            <div className="mb-2 text-right">
              <div className="text-xs text-white/80 drop-shadow-sm font-medium">Primary Asset</div>
              <div className="text-xl font-bold text-white drop-shadow-sm break-words">
                {showBalance ? `${primaryAsset.balance} ${primaryAsset.symbol}` : "**.**"}
              </div>
              <div className="text-sm text-white/90 drop-shadow-sm break-words">
                ≈ {showBalance ? `$${primaryAsset.value.toLocaleString()}` : "****"}
              </div>
            </div>
            <div className="flex gap-2 w-full flex-wrap justify-end">
              <Button className="bg-green-600 hover:bg-green-700 text-white flex-1 min-w-[100px]">
                Deposit
              </Button>
              <Button className="bg-orange-500 hover:bg-orange-600 text-white flex-1 min-w-[100px]">
                Withdraw
              </Button>
            </div>
          </div>
        </div>
        {/* Bottom row */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-2 mt-2">
          <span className="font-mono text-white/90 drop-shadow-sm text-xs sm:text-base tracking-widest">
            **** **** **** 5670
          </span>
          <div className="flex items-center gap-2 text-white/80 drop-shadow-sm text-xs sm:text-base">
            <span>Last updated: 10:50:45 PM</span>
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" /> Live
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
