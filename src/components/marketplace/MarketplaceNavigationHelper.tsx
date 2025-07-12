import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  ArrowRight,
  Sparkles,
  ShoppingBag,
  Search,
  BarChart,
  Smartphone,
  X,
  Navigation,
  Zap,
} from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

export default function MarketplaceNavigationHelper() {
  const [isVisible, setIsVisible] = useState(false);
  const [hasVisitedMarketplace, setHasVisitedMarketplace] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    // Show helper if user hasn't visited marketplace and is on home page
    const visited = localStorage.getItem("hasVisitedEnhancedMarketplace");
    setHasVisitedMarketplace(!!visited);

    // Show helper on home page if they haven't visited marketplace
    if (
      !visited &&
      (location.pathname === "/" || location.pathname === "/home")
    ) {
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 2000); // Show after 2 seconds

      return () => clearTimeout(timer);
    }
  }, [location.pathname]);

  const handleVisitMarketplace = () => {
    localStorage.setItem("hasVisitedEnhancedMarketplace", "true");
    setIsVisible(false);

    if (isAuthenticated) {
      navigate("/app/marketplace");
    } else {
      // Navigate to auth first, then marketplace
      navigate("/auth?redirect=/app/marketplace");
    }
  };

  const handleDismiss = () => {
    setIsVisible(false);
    localStorage.setItem("marketplaceHelperDismissed", "true");
  };

  if (!isVisible || hasVisitedMarketplace) {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 max-w-sm">
      <Card className="border-2 border-blue-200 shadow-xl bg-gradient-to-br from-blue-50 to-purple-50">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 bg-blue-100 rounded-full flex items-center justify-center">
                <Sparkles className="h-4 w-4 text-blue-600" />
              </div>
              <CardTitle className="text-lg text-blue-900">
                Enhanced Marketplace
              </CardTitle>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleDismiss}
              className="text-gray-500 hover:text-gray-700"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="space-y-2">
            <p className="text-sm text-blue-800">
              🎉 <strong>New!</strong> Experience our enhanced marketplace with:
            </p>

            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="flex items-center gap-1">
                <Search className="h-3 w-3 text-blue-600" />
                <span>AI Search</span>
              </div>
              <div className="flex items-center gap-1">
                <BarChart className="h-3 w-3 text-purple-600" />
                <span>Analytics</span>
              </div>
              <div className="flex items-center gap-1">
                <Smartphone className="h-3 w-3 text-green-600" />
                <span>Mobile UX</span>
              </div>
              <div className="flex items-center gap-1">
                <Zap className="h-3 w-3 text-yellow-600" />
                <span>Advanced Filters</span>
              </div>
            </div>
          </div>

          <div className="flex gap-2">
            <Button
              onClick={handleVisitMarketplace}
              className="flex-1 bg-blue-600 hover:bg-blue-700"
              size="sm"
            >
              <ShoppingBag className="h-4 w-4 mr-2" />
              Visit Marketplace
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </div>

          <div className="text-center">
            <Badge variant="secondary" className="text-xs">
              <Navigation className="h-3 w-3 mr-1" />
              {isAuthenticated
                ? "Navigate to /app/marketplace"
                : "Sign in to access"}
            </Badge>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
