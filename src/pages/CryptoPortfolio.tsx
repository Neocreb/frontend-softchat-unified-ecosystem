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
                  Portfolio
                </h1>
                <p className="text-muted-foreground">
                  Manage your crypto investments
                </p>
              </div>
            </div>
          </div>

          {/* Portfolio Management Component */}
          <EnhancedCryptoPortfolio />
        </div>
      </div>
    </>
  );
};

export default CryptoPortfolio;
