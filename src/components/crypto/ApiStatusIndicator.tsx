import React, { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  AlertCircle,
  CheckCircle,
  RefreshCw,
  Wifi,
  WifiOff,
  TrendingUp,
} from "lucide-react";
import { getApiStatus, resetApiStatus } from "@/services/cryptoService";

interface ApiStatusIndicatorProps {
  className?: string;
  showDetails?: boolean;
}

const ApiStatusIndicator: React.FC<ApiStatusIndicatorProps> = ({
  className = "",
  showDetails = true,
}) => {
  const [status, setStatus] = useState(getApiStatus());
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    // Update status every 10 seconds
    const interval = setInterval(() => {
      setStatus(getApiStatus());
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      resetApiStatus();
      setStatus(getApiStatus());

      // Give a moment for the reset to take effect
      setTimeout(() => {
        setStatus(getApiStatus());
        setIsRefreshing(false);
      }, 1000);
    } catch (error) {
      console.error("Failed to reset API status:", error);
      setIsRefreshing(false);
    }
  };

  const getStatusConfig = () => {
    if (status.isDisabled) {
      const nextRetryIn = Math.max(
        0,
        Math.ceil((status.nextRetry - Date.now()) / 1000),
      );

      return {
        variant: "secondary" as const,
        icon: WifiOff,
        text: "Simulation Mode",
        description: `Using simulated data due to API issues. Auto-retry in ${nextRetryIn}s`,
        color: "text-yellow-600 dark:text-yellow-400",
        bgColor: "bg-yellow-50 dark:bg-yellow-900/20",
        borderColor: "border-yellow-200 dark:border-yellow-800",
      };
    } else if (status.failureCount > 0) {
      return {
        variant: "outline" as const,
        icon: AlertCircle,
        text: "Partial Issues",
        description: `${status.failureCount} recent API failures. Some data may be cached.`,
        color: "text-orange-600 dark:text-orange-400",
        bgColor: "bg-orange-50 dark:bg-orange-900/20",
        borderColor: "border-orange-200 dark:border-orange-800",
      };
    } else {
      return {
        variant: "default" as const,
        icon: CheckCircle,
        text: "Live Data",
        description: "All APIs are working normally. Real-time data available.",
        color: "text-green-600 dark:text-green-400",
        bgColor: "bg-green-50 dark:bg-green-900/20",
        borderColor: "border-green-200 dark:border-green-800",
      };
    }
  };

  const config = getStatusConfig();
  const Icon = config.icon;

  if (!showDetails) {
    // Compact mode - just an icon
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <div className={`inline-flex items-center ${className}`}>
              <Icon className={`h-4 w-4 ${config.color}`} />
            </div>
          </TooltipTrigger>
          <TooltipContent>
            <div className="text-sm">
              <div className="font-medium">{config.text}</div>
              <div className="text-xs text-muted-foreground mt-1">
                {config.description}
              </div>
            </div>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  // Full mode - badge with details
  return (
    <div className={`inline-flex items-center gap-2 ${className}`}>
      <Badge
        variant={config.variant}
        className={`
          inline-flex items-center gap-1.5 px-2.5 py-1
          ${config.bgColor} ${config.borderColor} ${config.color}
          transition-all duration-200
        `}
      >
        <Icon className="h-3.5 w-3.5" />
        <span className="text-xs font-medium">{config.text}</span>
        {status.isDisabled && <TrendingUp className="h-3 w-3 animate-pulse" />}
      </Badge>

      {(status.isDisabled || status.failureCount > 0) && (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleRefresh}
                disabled={isRefreshing}
                className="h-6 w-6 p-0 hover:bg-transparent"
              >
                <RefreshCw
                  className={`h-3.5 w-3.5 ${config.color} ${
                    isRefreshing ? "animate-spin" : ""
                  }`}
                />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <span className="text-xs">
                {isRefreshing ? "Resetting..." : "Reset API Status"}
              </span>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )}

      {showDetails && (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="inline-flex items-center">
                <AlertCircle className="h-3.5 w-3.5 text-muted-foreground cursor-help" />
              </div>
            </TooltipTrigger>
            <TooltipContent side="bottom" className="max-w-xs">
              <div className="text-sm space-y-1">
                <div className="font-medium">{config.text}</div>
                <div className="text-xs text-muted-foreground">
                  {config.description}
                </div>
                {status.isDisabled && (
                  <div className="text-xs text-muted-foreground pt-1 border-t border-border">
                    Failures: {status.failureCount}/{status.maxFailures}
                  </div>
                )}
              </div>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )}
    </div>
  );
};

export default ApiStatusIndicator;
