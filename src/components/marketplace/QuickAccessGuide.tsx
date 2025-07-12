import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  ArrowRight,
  Sparkles,
  ShoppingBag,
  Search,
  BarChart,
  Smartphone,
  User,
  LogIn,
  Navigation,
  Eye,
  MousePointer,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

interface QuickAccessGuideProps {
  onClose?: () => void;
}

export default function QuickAccessGuide({ onClose }: QuickAccessGuideProps) {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const handleNavigateToMarketplace = () => {
    if (isAuthenticated) {
      navigate("/app/marketplace");
    } else {
      navigate("/auth?redirect=/app/marketplace");
    }
    onClose?.();
  };

  const steps = [
    {
      step: 1,
      title: isAuthenticated ? "You're signed in!" : "Sign in to your account",
      description: isAuthenticated
        ? "You're ready to access the enhanced marketplace features"
        : "Create an account or sign in to access all marketplace features",
      icon: isAuthenticated ? (
        <User className="h-5 w-5 text-green-600" />
      ) : (
        <LogIn className="h-5 w-5 text-blue-600" />
      ),
      action: isAuthenticated ? null : (
        <Button size="sm" onClick={() => navigate("/auth")}>
          Sign In
        </Button>
      ),
      completed: isAuthenticated,
    },
    {
      step: 2,
      title: "Navigate to Marketplace",
      description:
        "Click on the marketplace section in the navigation or use the direct link",
      icon: <Navigation className="h-5 w-5 text-purple-600" />,
      action: (
        <Button size="sm" onClick={handleNavigateToMarketplace}>
          <ShoppingBag className="h-4 w-4 mr-2" />
          Go to Marketplace
        </Button>
      ),
      completed: false,
    },
    {
      step: 3,
      title: "Enable Enhanced Mode",
      description:
        "Toggle the 'Enhanced Mode' button to access all advanced features",
      icon: <Sparkles className="h-5 w-5 text-yellow-600" />,
      action: null,
      completed: false,
    },
    {
      step: 4,
      title: "Explore Enhanced Features",
      description:
        "Try AI search, advanced filters, analytics dashboard, and mobile view",
      icon: <Eye className="h-5 w-5 text-green-600" />,
      action: null,
      completed: false,
    },
  ];

  const enhancedFeatures = [
    {
      name: "AI-Powered Search",
      description: "Smart suggestions and auto-complete",
      icon: <Search className="h-4 w-4 text-blue-600" />,
    },
    {
      name: "Advanced Analytics",
      description: "Real-time marketplace insights",
      icon: <BarChart className="h-4 w-4 text-purple-600" />,
    },
    {
      name: "Mobile Experience",
      description: "Touch-optimized interface",
      icon: <Smartphone className="h-4 w-4 text-green-600" />,
    },
    {
      name: "Enhanced UX",
      description: "Modern design and interactions",
      icon: <Sparkles className="h-4 w-4 text-yellow-600" />,
    },
  ];

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
            <Sparkles className="h-5 w-5 text-white" />
          </div>
          <div>
            <CardTitle className="text-xl">
              Enhanced Marketplace Guide
            </CardTitle>
            <p className="text-sm text-gray-600 mt-1">
              Quick steps to access our new enhanced marketplace features
            </p>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Quick Access Steps */}
        <div className="space-y-4">
          <h3 className="font-semibold text-lg">
            How to Access Enhanced Features
          </h3>

          {steps.map((step, index) => (
            <div key={step.step} className="flex items-start gap-4">
              <div
                className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                  step.completed
                    ? "bg-green-100 text-green-700 border-2 border-green-300"
                    : "bg-gray-100 text-gray-600 border-2 border-gray-300"
                }`}
              >
                {step.completed ? "✓" : step.step}
              </div>

              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  {step.icon}
                  <h4 className="font-medium">{step.title}</h4>
                  {step.completed && (
                    <Badge
                      variant="secondary"
                      className="text-xs bg-green-100 text-green-700"
                    >
                      Completed
                    </Badge>
                  )}
                </div>
                <p className="text-sm text-gray-600 mb-2">{step.description}</p>
                {step.action}
              </div>
            </div>
          ))}
        </div>

        <Separator />

        {/* Enhanced Features Overview */}
        <div className="space-y-4">
          <h3 className="font-semibold text-lg">What's New in Enhanced Mode</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {enhancedFeatures.map((feature, index) => (
              <div
                key={index}
                className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg"
              >
                <div className="flex-shrink-0">{feature.icon}</div>
                <div>
                  <h4 className="font-medium text-sm">{feature.name}</h4>
                  <p className="text-xs text-gray-600">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <Separator />

        {/* Quick Actions */}
        <div className="flex flex-wrap gap-3">
          <Button
            onClick={handleNavigateToMarketplace}
            className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
          >
            <ShoppingBag className="h-4 w-4 mr-2" />
            Access Enhanced Marketplace
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        </div>

        {/* Navigation Paths */}
        <div className="bg-blue-50 p-4 rounded-lg">
          <h4 className="font-medium text-blue-900 mb-2 flex items-center gap-2">
            <MousePointer className="h-4 w-4" />
            Navigation Paths
          </h4>
          <div className="text-sm text-blue-800 space-y-1">
            <div>
              • <strong>Direct URL:</strong> /app/marketplace
            </div>
            <div>
              • <strong>From Auth:</strong> Sign in → App → Marketplace
            </div>
            <div>
              • <strong>From Home:</strong> Navigation → Marketplace
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
