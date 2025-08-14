import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Sparkles, TrendingUp, Eye, Shield } from "lucide-react";
import { cn } from "@/lib/utils";

export default function CryptoWalletBalanceCard() {
  // Example data
  const totalBalance = 125670.45;
  const totalBalance24hChange = 3240.78;
  const totalBalance24hPercent = 2.64;
  const primaryAsset = { symbol: "BTC", balance: 2.5, value: 108126.68 };
  const [showBalance, setShowBalance] = useState(true);

  return (
    <div
      className="
        flex justify-center items-center w-full
        min-h-screen
        bg-gray-100
        "
      // optional: for demo, gives a neutral background
    >
      {/* Responsive scale wrapper */}
      <div
        className="
          transition-transform duration-300
          origin-top
          sm:scale-100
          scale-[0.92]
          xs:scale-[0.86]
          [@media(max-width:430px)]:scale-[0.80]
          [@media(max-width:370px)]:scale-[0.72]
        "
        style={{
          // fallback for custom breakpoints
          width: "100%",
          display: "flex",
          justifyContent: "center",
        }}
      >
        <Card
          className={cn(
            "rounded-3xl shadow-xl border-0 bg-[linear-gradient(110deg,#2951d6_0%,#8145e6_100%)] w-[500px] max-w-full p-0"
          )}
          style={{
            background: "linear-gradient(110deg,#2951d6 0%,#8145e6 100%)",
          }}
        >
          <CardContent className="p-6 sm:p-8 flex flex-col h-full w-full">
            {/* Top: Brand & Secured */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-2">
                <Sparkles className="text-yellow-400 h-7 w-7" />
                <div>
                  <h2 className="text-xl font-bold text-gray-900">Crypto Wallet</h2>
                  <p className="text-base text-gray-700">Digital asset portfolio</p>
                </div>
              </div>
              <div className="flex flex-col items-center gap-2">
                <button
                  aria-label="Toggle Balance"
                  onClick={() => setShowBalance((v) => !v)}
                  className="text-gray-700 hover:text-gray-900"
                >
                  <Eye className="h-6 w-6" />
                </button>
                <span className="flex items-center rounded-full px-5 py-2 font-semibold text-white text-base bg-gradient-to-r from-purple-500 to-fuchsia-500">
                  <Shield className="h-4 w-4 mr-2" />
                  Secured
                </span>
              </div>
            </div>
            {/* Main: Value & Asset */}
            <div className="flex flex-row items-center justify-between w-full gap-4">
              <div>
                <div className="text-gray-600 text-sm font-medium">Total Portfolio Value</div>
                <div className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-gray-900">
                  {showBalance ? `$${totalBalance.toLocaleString()}` : "****.**"}
                </div>
                <div className="flex flex-wrap items-center gap-2 mt-2">
                  <TrendingUp className="h-4 w-4 text-green-600" />
                  <span className="text-green-600 text-lg font-bold">
                    {showBalance ? `$${totalBalance24hChange.toLocaleString()}` : "**.**"}
                  </span>
                  <span className="text-green-600 text-base font-semibold">
                    ({showBalance ? `+${totalBalance24hPercent}%` : "**%"}) 24h
                  </span>
                </div>
              </div>
              <div className="text-right">
                <div className="text-gray-600 text-sm">Primary Asset</div>
                <div className="text-xl font-bold text-gray-900">
                  {showBalance ? `${primaryAsset.balance} ${primaryAsset.symbol}` : "**.**"}
                </div>
                <div className="text-sm text-gray-700">
                  ≈ {showBalance ? `$${primaryAsset.value.toLocaleString()}` : "****"}
                </div>
              </div>
            </div>
            {/* Actions */}
            <div className="flex gap-4 mt-8">
              <Button className="bg-green-600 hover:bg-green-700 text-white flex-1 py-4 rounded-xl text-lg font-semibold">
                Deposit
              </Button>
              <Button className="bg-orange-500 hover:bg-orange-600 text-white flex-1 py-4 rounded-xl text-lg font-semibold">
                Withdraw
              </Button>
            </div>
            {/* Bottom: Card number & status */}
            <div className="flex flex-row justify-between items-center gap-2 mt-8">
              <span className="font-mono text-gray-700 text-base tracking-widest">
                **** **** **** 5670
              </span>
              <div className="flex items-center gap-2 text-gray-700 text-base">
                <span>Last updated: 10:50:45 PM</span>
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" /> Live
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
