import React, { useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, PieChart, TrendingUp, BarChart3 } from "lucide-react";
import EnhancedCryptoPortfolio from "@/components/crypto/EnhancedCryptoPortfolio";

const CryptoPortfolio = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to view your crypto portfolio.",
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
        <title>Crypto Portfolio - Asset Management | Softchat</title>
        <meta name="description" content="Track your cryptocurrency investments, analyze performance, and manage your digital asset portfolio." />
      </Helmet>

      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50/30 dark:from-slate-900 dark:to-blue-950/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <Button
                variant="outline"
                size="sm"
                onClick={handleBackToCrypto}
                className="flex items-center gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to Crypto
              </Button>
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-purple-600 to-violet-600 bg-clip-text text-transparent">
                  Portfolio Management
                </h1>
                <p className="text-muted-foreground">
                  Track your investments and analyze your performance
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-sm font-medium text-green-700 dark:text-green-300">
                Real-time Updates
              </span>
            </div>
          </div>

          {/* Feature Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <Card className="bg-gradient-to-r from-purple-50 to-violet-50 dark:from-purple-900/20 dark:to-violet-900/20 border-purple-200 dark:border-purple-700">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 mx-auto mb-3 rounded-lg bg-purple-500 flex items-center justify-center">
                  <PieChart className="h-6 w-6 text-white" />
                </div>
                <h3 className="font-semibold text-purple-900 dark:text-purple-100 mb-2">Asset Allocation</h3>
                <p className="text-sm text-purple-700 dark:text-purple-300">
                  Visualize your portfolio distribution and balance
                </p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border-green-200 dark:border-green-700">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 mx-auto mb-3 rounded-lg bg-green-500 flex items-center justify-center">
                  <TrendingUp className="h-6 w-6 text-white" />
                </div>
                <h3 className="font-semibold text-green-900 dark:text-green-100 mb-2">Performance Tracking</h3>
                <p className="text-sm text-green-700 dark:text-green-300">
                  Monitor gains, losses, and overall portfolio performance
                </p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 border-blue-200 dark:border-blue-700">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 mx-auto mb-3 rounded-lg bg-blue-500 flex items-center justify-center">
                  <BarChart3 className="h-6 w-6 text-white" />
                </div>
                <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">Advanced Analytics</h3>
                <p className="text-sm text-blue-700 dark:text-blue-300">
                  Detailed analysis with charts and historical data
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Portfolio Management Component */}
          <EnhancedCryptoPortfolio />
        </div>
      </div>
    </>
  );
};

export default CryptoPortfolio;
