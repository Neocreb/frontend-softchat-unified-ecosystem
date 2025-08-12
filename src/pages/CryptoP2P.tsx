import React, { useEffect, useState } from "react";
import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ArrowLeft, Users, Shield, Clock, Filter, History, Plus } from "lucide-react";
import { BannerAd } from "@/components/ads/BannerAd";
import EnhancedP2PMarketplace from "@/components/crypto/EnhancedP2PMarketplace";

const CryptoP2P = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("market");
  const [selectedCurrency, setSelectedCurrency] = useState("NGN");
  const [tradingMode, setTradingMode] = useState("buy");
  const [triggerCreateOffer, setTriggerCreateOffer] = useState(false);

  useEffect(() => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to access the P2P marketplace.",
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
        <title>Crypto P2P Trading - Peer-to-Peer Marketplace | Softchat</title>
        <meta name="description" content="Trade cryptocurrencies directly with other users in a secure peer-to-peer environment." />
      </Helmet>

      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50/30 dark:from-slate-900 dark:to-blue-950/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header Navigation */}
          <div className="flex items-center justify-between py-3 border-b border-gray-200 dark:border-gray-700 overflow-x-auto">
            {/* Left side - Back button and Navigation Tabs */}
            <div className="flex items-center gap-3 min-w-0 flex-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleBackToCrypto}
                className="flex items-center gap-2 text-gray-600 hover:text-gray-900 flex-shrink-0"
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>

              <div className="flex items-center gap-4 overflow-x-auto scrollbar-hide">
                <button
                  onClick={() => setActiveTab("market")}
                  className={`text-sm font-medium transition-colors hover:text-blue-600 whitespace-nowrap ${
                    activeTab === "market" ? "text-blue-600 border-b-2 border-blue-600 pb-1" : "text-gray-600"
                  }`}
                >
                  Market
                </button>
                <button
                  onClick={() => setActiveTab("orders")}
                  className={`text-sm font-medium transition-colors hover:text-blue-600 whitespace-nowrap ${
                    activeTab === "orders" ? "text-blue-600 border-b-2 border-blue-600 pb-1" : "text-gray-600"
                  }`}
                >
                  Orders
                </button>
                <button
                  onClick={() => setActiveTab("my-offers")}
                  className={`text-sm font-medium transition-colors hover:text-blue-600 whitespace-nowrap ${
                    activeTab === "my-offers" ? "text-blue-600 border-b-2 border-blue-600 pb-1" : "text-gray-600"
                  }`}
                >
                  My Offers
                </button>
                <button
                  onClick={() => setActiveTab("neoai")}
                  className={`text-sm font-medium transition-colors hover:text-blue-600 whitespace-nowrap ${
                    activeTab === "neoai" ? "text-blue-600 border-b-2 border-blue-600 pb-1" : "text-gray-600"
                  }`}
                >
                  NeoAi
                </button>
                <button
                  onClick={() => setActiveTab("history")}
                  className={`text-sm font-medium transition-colors hover:text-blue-600 flex items-center gap-1 whitespace-nowrap ${
                    activeTab === "history" ? "text-blue-600 border-b-2 border-blue-600 pb-1" : "text-gray-600"
                  }`}
                >
                  <History className="h-3 w-3" />
                  History
                </button>
              </div>
            </div>

            {/* Right side - Security indicator */}
            <div className="flex items-center gap-2 flex-shrink-0 ml-3">
              <div className="p-1 bg-green-100 dark:bg-green-900/30 rounded">
                <Shield className="h-3 w-3 text-green-600" />
              </div>
              <span className="text-xs font-medium text-green-700 dark:text-green-300">
                Secure
              </span>
            </div>
          </div>

          {/* Banner Ad */}
          <div className="py-6">
            <BannerAd position="top" />
          </div>

          {/* Trading Controls */}
          <div className="flex flex-col sm:flex-row items-center justify-between py-4 gap-4">
            {/* Mobile: Stack vertically, Desktop: Side by side */}
            <div className="flex items-center justify-between w-full sm:w-auto">
              {/* Left side - Buy/Sell Buttons */}
              <div className="flex items-center">
                <Tabs value={tradingMode} onValueChange={setTradingMode}>
                  <TabsList className="grid grid-cols-2 h-9 w-28">
                    <TabsTrigger value="buy" className="text-green-600 data-[state=active]:text-green-700 data-[state=active]:bg-green-50 text-sm">
                      Buy
                    </TabsTrigger>
                    <TabsTrigger value="sell" className="text-red-600 data-[state=active]:text-red-700 data-[state=active]:bg-red-50 text-sm">
                      Sell
                    </TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>

              {/* Right side - Currency Selector (Mobile: same row) */}
              <div className="flex items-center gap-2 sm:hidden">
                <span className="text-sm text-gray-600">Currency:</span>
                <Select value={selectedCurrency} onValueChange={setSelectedCurrency}>
                  <SelectTrigger className="w-20 h-9">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="NGN">NGN</SelectItem>
                    <SelectItem value="USD">USD</SelectItem>
                    <SelectItem value="EUR">EUR</SelectItem>
                    <SelectItem value="GBP">GBP</SelectItem>
                    <SelectItem value="KES">KES</SelectItem>
                    <SelectItem value="GHS">GHS</SelectItem>
                    <SelectItem value="ZAR">ZAR</SelectItem>
                    <SelectItem value="EGP">EGP</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Center - Create Offer Button */}
            <div className="flex justify-center w-full sm:flex-1">
              <Button
                onClick={() => setTriggerCreateOffer(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 h-9 w-full sm:w-auto"
              >
                <Plus className="h-4 w-4 mr-2" />
                Create Offer
              </Button>
            </div>

            {/* Right side - Currency Selector (Desktop only) */}
            <div className="hidden sm:flex items-center gap-2">
              <span className="text-sm text-gray-600 whitespace-nowrap">Currency:</span>
              <Select value={selectedCurrency} onValueChange={setSelectedCurrency}>
                <SelectTrigger className="w-24 h-9">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="NGN">NGN</SelectItem>
                  <SelectItem value="USD">USD</SelectItem>
                  <SelectItem value="EUR">EUR</SelectItem>
                  <SelectItem value="GBP">GBP</SelectItem>
                  <SelectItem value="KES">KES</SelectItem>
                  <SelectItem value="GHS">GHS</SelectItem>
                  <SelectItem value="ZAR">ZAR</SelectItem>
                  <SelectItem value="EGP">EGP</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Tab Content */}
          <div className="pb-8">
            {activeTab === "market" && (
              <EnhancedP2PMarketplace
                triggerCreateOffer={triggerCreateOffer}
                onCreateOfferTriggered={() => setTriggerCreateOffer(false)}
              />
            )}

            {activeTab === "orders" && (
              <Card>
                <CardContent className="p-12 text-center">
                  <Clock className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Active Orders</h3>
                  <p className="text-gray-600">
                    Your active P2P orders will appear here
                  </p>
                </CardContent>
              </Card>
            )}

            {activeTab === "my-offers" && (
              <Card>
                <CardContent className="p-12 text-center">
                  <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">My Offers</h3>
                  <p className="text-gray-600">
                    Create and manage your buy/sell offers
                  </p>
                  <Button className="mt-4">Create Offer</Button>
                </CardContent>
              </Card>
            )}

            {activeTab === "neoai" && (
              <Card>
                <CardContent className="p-12 text-center">
                  <div className="w-12 h-12 mx-auto mb-4 rounded-lg bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center">
                    <Shield className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">NeoAi Matching</h3>
                  <p className="text-gray-600">
                    AI-powered smart matching for optimal P2P trades
                  </p>
                  <Button className="mt-4">Enable Smart Matching</Button>
                </CardContent>
              </Card>
            )}

            {activeTab === "history" && (
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-semibold">Trade History</h3>
                    <div className="flex items-center gap-3">
                      <Select defaultValue="all">
                        <SelectTrigger className="w-32">
                          <SelectValue placeholder="Filter" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Trades</SelectItem>
                          <SelectItem value="completed">Completed</SelectItem>
                          <SelectItem value="cancelled">Cancelled</SelectItem>
                          <SelectItem value="disputed">Disputed</SelectItem>
                        </SelectContent>
                      </Select>
                      <Select defaultValue="30d">
                        <SelectTrigger className="w-32">
                          <SelectValue placeholder="Period" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="7d">Last 7 days</SelectItem>
                          <SelectItem value="30d">Last 30 days</SelectItem>
                          <SelectItem value="90d">Last 90 days</SelectItem>
                          <SelectItem value="all">All time</SelectItem>
                        </SelectContent>
                      </Select>
                      <Button variant="outline" size="sm">
                        <Filter className="h-4 w-4 mr-2" />
                        More Filters
                      </Button>
                    </div>
                  </div>

                  <div className="text-center py-12">
                    <History className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h4 className="text-lg font-semibold mb-2">No Trade History</h4>
                    <p className="text-gray-600">
                      Your completed trades will appear here with detailed transaction history
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default CryptoP2P;
