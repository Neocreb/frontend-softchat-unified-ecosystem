import React, { useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/components/ui/use-toast";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, TrendingUp } from "lucide-react";
import AdvancedTradingInterface from "@/components/crypto/AdvancedTradingInterface";

const CryptoTrading = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const selectedPair = searchParams.get("pair") || "BTCUSDT";

  useEffect(() => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to access the trading platform.",
        variant: "destructive",
      });
      navigate("/auth");
      return;
    }
  }, [user, navigate, toast]);

  const handleBackToCrypto = () => {
    navigate("/app/crypto");
  };

  if (!user) {
    return null; // Will redirect to auth
  }

  return (
    <>
      <Helmet>
        <title>Crypto Trading - Professional Trading Platform | Softchat</title>
        <meta name="description" content="Professional cryptocurrency trading with advanced charts, real-time data, and comprehensive trading tools." />
      </Helmet>

      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50/30 dark:from-slate-900 dark:to-blue-950/30">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {/* Simplified Header */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="sm"
                onClick={handleBackToCrypto}
                className="flex items-center gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                Back
              </Button>
              <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                Trading
              </h1>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-sm font-medium text-green-700 dark:text-green-300">
                Live
              </span>
            </div>
          </div>

          {/* Trading Interface */}
          <div className="space-y-6">
            {selectedPair && (
              <Card className="bg-blue-50/50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-700">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-500 rounded-lg">
                      <TrendingUp className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-blue-900 dark:text-blue-100">
                        Trading Pair: {selectedPair}
                      </h3>
                      <p className="text-sm text-blue-700 dark:text-blue-300">
                        Real-time data and advanced charting tools
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Advanced Trading Interface */}
            <AdvancedTradingInterface />
          </div>
        </div>
      </div>
    </>
  );
};

export default CryptoTrading;
