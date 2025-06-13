import React, { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AlertCircle, CheckCircle, RefreshCw } from "lucide-react";
import { getApiStatus, resetApiStatus } from "@/services/cryptoService";

interface ApiStatusIndicatorProps {
  showDebugControls?: boolean;
}

export const ApiStatusIndicator: React.FC<ApiStatusIndicatorProps> = ({
  showDebugControls = false,
}) => {
  const [apiStatus, setApiStatus] = useState(getApiStatus());

  useEffect(() => {
    // Update API status every 5 seconds
    const interval = setInterval(() => {
      setApiStatus(getApiStatus());
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const handleResetApi = () => {
    resetApiStatus();
    setApiStatus(getApiStatus());
  };

  const getStatusIcon = () => {
    if (apiStatus.isDisabled) {
      return <AlertCircle className="h-3 w-3" />;
    }
    return <CheckCircle className="h-3 w-3" />;
  };

  const getStatusColor = () => {
    if (apiStatus.isDisabled) {
      return "destructive";
    }
    if (apiStatus.failureCount > 0) {
      return "secondary";
    }
    return "default";
  };

  const getStatusText = () => {
    if (apiStatus.isDisabled) {
      return "Simulation Mode";
    }
    if (apiStatus.failureCount > 0) {
      return `API Warning (${apiStatus.failureCount}/${apiStatus.maxFailures})`;
    }
    return "Live Data";
  };

  if (!showDebugControls && !apiStatus.isDisabled) {
    return null; // Don't show when everything is working fine
  }

  return (
    <div className="flex items-center gap-2">
      <Badge variant={getStatusColor()} className="flex items-center gap-1">
        {getStatusIcon()}
        <span className="text-xs">{getStatusText()}</span>
      </Badge>

      {showDebugControls && (
        <Button
          size="sm"
          variant="outline"
          onClick={handleResetApi}
          className="h-6 px-2 text-xs"
          disabled={!apiStatus.isDisabled}
        >
          <RefreshCw className="h-3 w-3 mr-1" />
          Reset API
        </Button>
      )}
    </div>
  );
};

export default ApiStatusIndicator;
