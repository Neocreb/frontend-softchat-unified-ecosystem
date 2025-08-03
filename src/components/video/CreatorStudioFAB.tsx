import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  BarChart3,
  TrendingUp,
  DollarSign,
  Eye,
  Users,
  Zap,
  X,
  ExternalLink,
  Crown,
  Star,
  ChevronUp,
  ChevronDown,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface CreatorStudioFABProps {
  className?: string;
}

const CreatorStudioFAB: React.FC<CreatorStudioFABProps> = ({ className }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // Don't show on certain pages
  const hiddenPaths = ["/app/unified-creator-studio", "/auth", "/"];
  if (hiddenPaths.some((path) => location.pathname.startsWith(path))) {
    return null;
  }

  const quickStats = [
    { label: "Views Today", value: "12.3K", icon: <Eye className="w-3 h-3" /> },
    {
      label: "Revenue",
      value: "$240",
      icon: <DollarSign className="w-3 h-3" />,
    },
    {
      label: "New Followers",
      value: "+127",
      icon: <Users className="w-3 h-3" />,
    },
  ];

  const quickActions = [
    {
      label: "Full Analytics",
      action: () => navigate("/app/unified-creator-studio"),
      icon: <BarChart3 className="w-4 h-4" />,
      primary: true,
    },
    {
      label: "Content Performance",
      action: () => navigate("/app/unified-creator-studio?tab=content"),
      icon: <TrendingUp className="w-4 h-4" />,
    },
    {
      label: "Revenue Tracking",
      action: () => navigate("/app/unified-creator-studio?tab=revenue"),
      icon: <DollarSign className="w-4 h-4" />,
    },
    {
      label: "AI Insights",
      action: () => navigate("/app/unified-creator-studio?tab=insights"),
      icon: <Zap className="w-4 h-4" />,
    },
  ];

  return (
    <div className={cn("fixed bottom-24 right-4 z-40", className)}>
      {/* Expanded Panel */}
      {isExpanded && (
        <Card className="mb-4 w-64 shadow-lg border">
          <CardContent className="p-4 space-y-4">
            {/* Header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 bg-gradient-to-r from-purple-500 to-pink-500 rounded flex items-center justify-center">
                  <BarChart3 className="w-3 h-3 text-white" />
                </div>
                <span className="font-semibold text-sm">Creator Studio</span>
              </div>
              <Badge
                variant="secondary"
                className="bg-purple-100 text-purple-800 text-xs"
              >
                <Crown className="w-2 h-2 mr-1" />
                Pro
              </Badge>
            </div>

            {/* Quick Stats */}
            <div className="space-y-2">
              <div className="text-xs font-medium text-muted-foreground">
                Today's Performance
              </div>
              {quickStats.map((stat, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between text-sm"
                >
                  <div className="flex items-center gap-2">
                    {stat.icon}
                    <span>{stat.label}</span>
                  </div>
                  <span className="font-medium">{stat.value}</span>
                </div>
              ))}
            </div>

            {/* Quick Actions */}
            <div className="space-y-2">
              <div className="text-xs font-medium text-muted-foreground">
                Quick Access
              </div>
              {quickActions.map((action, index) => (
                <Button
                  key={index}
                  variant={action.primary ? "default" : "ghost"}
                  size="sm"
                  className="w-full justify-start text-xs h-8"
                  onClick={() => {
                    action.action();
                    setIsExpanded(false);
                  }}
                >
                  {action.icon}
                  <span className="ml-2">{action.label}</span>
                  {action.primary && (
                    <ExternalLink className="w-3 h-3 ml-auto" />
                  )}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Main FAB Button */}
      <Button
        onClick={() => setIsExpanded(!isExpanded)}
        className={cn(
          "w-12 h-12 rounded-full shadow-lg transition-all duration-200 hover:scale-110",
          isExpanded
            ? "bg-gray-600 hover:bg-gray-700"
            : "bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600",
        )}
        aria-label={
          isExpanded
            ? "Close Creator Studio quick access"
            : "Open Creator Studio quick access"
        }
      >
        {isExpanded ? (
          <X className="w-6 h-6 text-white" />
        ) : (
          <BarChart3 className="w-6 h-6 text-white" />
        )}
      </Button>

      {/* New insights indicator */}
      {!isExpanded && (
        <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center">
          <Star className="w-2 h-2 text-white" />
        </div>
      )}
    </div>
  );
};

export default CreatorStudioFAB;
