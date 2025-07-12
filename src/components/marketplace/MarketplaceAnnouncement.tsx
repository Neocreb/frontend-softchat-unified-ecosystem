import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Sparkles,
  ShoppingBag,
  ArrowRight,
  X,
  Search,
  BarChart,
  Smartphone,
  Zap,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

export default function MarketplaceAnnouncement() {
  const [isVisible, setIsVisible] = useState(true);
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const handleVisitMarketplace = () => {
    if (isAuthenticated) {
      navigate("/app/marketplace");
    } else {
      navigate("/auth?redirect=/app/marketplace");
    }
  };

  if (!isVisible) {
    return null;
  }

  return (
    <Card className="bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 text-white border-0 overflow-hidden relative">
      <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
      <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full -ml-12 -mb-12"></div>

      <CardContent className="p-6 relative">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-3">
              <div className="h-10 w-10 bg-white/20 rounded-full flex items-center justify-center">
                <Sparkles className="h-5 w-5 text-yellow-300" />
              </div>
              <div>
                <Badge className="bg-yellow-400 text-yellow-900 mb-1">
                  🎉 NEW RELEASE
                </Badge>
                <h2 className="text-xl font-bold">
                  Enhanced Marketplace Experience
                </h2>
              </div>
            </div>

            <p className="text-blue-100 mb-4 max-w-2xl">
              Discover our completely redesigned marketplace with AI-powered
              search, advanced analytics, mobile-optimized interface, and
              premium shopping features.
            </p>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
              <div className="flex items-center gap-2 text-sm">
                <Search className="h-4 w-4 text-blue-200" />
                <span>Smart Search</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <BarChart className="h-4 w-4 text-purple-200" />
                <span>Analytics Dashboard</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Smartphone className="h-4 w-4 text-green-200" />
                <span>Mobile First</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Zap className="h-4 w-4 text-yellow-200" />
                <span>Advanced Filters</span>
              </div>
            </div>

            <div className="flex flex-wrap gap-3">
              <Button
                onClick={handleVisitMarketplace}
                className="bg-white text-blue-600 hover:bg-blue-50 font-semibold"
              >
                <ShoppingBag className="h-4 w-4 mr-2" />
                Explore Marketplace
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>

              <Button
                variant="outline"
                className="border-white/30 text-white hover:bg-white/10"
                onClick={() =>
                  window.open("https://github.com/your-repo", "_blank")
                }
              >
                View Features
              </Button>
            </div>
          </div>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsVisible(false)}
            className="text-white/60 hover:text-white hover:bg-white/10 absolute top-4 right-4"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
