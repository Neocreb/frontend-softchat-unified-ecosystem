import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  usePerformanceMonitor,
  useMemoryMonitor,
  useNetworkStatus,
} from "@/hooks/use-performance";
import {
  Activity,
  Wifi,
  HardDrive,
  Clock,
  Zap,
  AlertTriangle,
  CheckCircle,
  X,
} from "lucide-react";

export function PerformanceMonitor() {
  const [isVisible, setIsVisible] = useState(false);
  const [isMinimized, setIsMinimized] = useState(true);
  const performanceMetrics = usePerformanceMonitor();
  const memoryInfo = useMemoryMonitor();
  const networkStatus = useNetworkStatus();

  // Show/hide with keyboard shortcut
  useEffect(() => {
    const handleKeyboard = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.shiftKey && e.key === "P") {
        e.preventDefault();
        setIsVisible(!isVisible);
      }
    };

    window.addEventListener("keydown", handleKeyboard);
    return () => window.removeEventListener("keydown", handleKeyboard);
  }, [isVisible]);

  const getPerformanceScore = () => {
    const { domContentLoaded, firstContentfulPaint, largestContentfulPaint } =
      performanceMetrics;

    let score = 100;
    if (domContentLoaded > 2000) score -= 20;
    if (firstContentfulPaint > 1500) score -= 20;
    if (largestContentfulPaint > 2500) score -= 30;

    return Math.max(0, score);
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600";
    if (score >= 60) return "text-yellow-600";
    return "text-red-600";
  };

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const formatTime = (ms: number) => {
    if (ms < 1000) return `${Math.round(ms)}ms`;
    return `${(ms / 1000).toFixed(2)}s`;
  };

  if (!isVisible) {
    return (
      <Button
        onClick={() => setIsVisible(true)}
        className="fixed bottom-4 right-4 z-50 rounded-full w-12 h-12 p-0 bg-blue-600 hover:bg-blue-700 shadow-lg"
        title="Open Performance Monitor (Ctrl+Shift+P)"
      >
        <Activity className="w-5 h-5" />
      </Button>
    );
  }

  if (isMinimized) {
    return (
      <Card className="fixed bottom-4 right-4 z-50 w-80 shadow-xl">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Activity className="w-4 h-4" />
              <CardTitle className="text-sm">Performance</CardTitle>
              <Badge
                variant="secondary"
                className={`text-xs ${getScoreColor(getPerformanceScore())}`}
              >
                {getPerformanceScore()}
              </Badge>
            </div>
            <div className="flex gap-1">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsMinimized(false)}
                className="h-6 w-6"
              >
                <Zap className="w-3 h-3" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsVisible(false)}
                className="h-6 w-6"
              >
                <X className="w-3 h-3" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="grid grid-cols-3 gap-2 text-xs">
            <div className="text-center">
              <div className="flex items-center justify-center gap-1">
                <Wifi className="w-3 h-3" />
                <span
                  className={
                    networkStatus.online ? "text-green-600" : "text-red-600"
                  }
                >
                  {networkStatus.online ? "Online" : "Offline"}
                </span>
              </div>
              <div className="text-gray-500">{networkStatus.effectiveType}</div>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center gap-1">
                <HardDrive className="w-3 h-3" />
                <span>Memory</span>
              </div>
              <div className="text-gray-500">
                {memoryInfo ? formatBytes(memoryInfo.usedJSHeapSize) : "N/A"}
              </div>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center gap-1">
                <Clock className="w-3 h-3" />
                <span>Load</span>
              </div>
              <div className="text-gray-500">
                {formatTime(performanceMetrics.domContentLoaded)}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="fixed bottom-4 right-4 z-50 w-96 max-h-[80vh] overflow-y-auto shadow-xl">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4" />
            <CardTitle className="text-sm">Performance Monitor</CardTitle>
          </div>
          <div className="flex gap-1">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMinimized(true)}
              className="h-6 w-6"
            >
              <Zap className="w-3 h-3" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsVisible(false)}
              className="h-6 w-6"
            >
              <X className="w-3 h-3" />
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4 text-sm">
        {/* Performance Score */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="font-medium">Performance Score</span>
            <span
              className={`font-bold ${getScoreColor(getPerformanceScore())}`}
            >
              {getPerformanceScore()}/100
            </span>
          </div>
          <Progress value={getPerformanceScore()} className="h-2" />
        </div>

        {/* Network Status */}
        <div>
          <h4 className="font-medium mb-2 flex items-center gap-1">
            <Wifi className="w-4 h-4" />
            Network
          </h4>
          <div className="space-y-1">
            <div className="flex justify-between">
              <span>Status:</span>
              <div className="flex items-center gap-1">
                {networkStatus.online ? (
                  <CheckCircle className="w-3 h-3 text-green-600" />
                ) : (
                  <AlertTriangle className="w-3 h-3 text-red-600" />
                )}
                <span>{networkStatus.online ? "Online" : "Offline"}</span>
              </div>
            </div>
            <div className="flex justify-between">
              <span>Type:</span>
              <span>{networkStatus.effectiveType}</span>
            </div>
            <div className="flex justify-between">
              <span>Downlink:</span>
              <span>{networkStatus.downlink} Mbps</span>
            </div>
            <div className="flex justify-between">
              <span>RTT:</span>
              <span>{networkStatus.rtt}ms</span>
            </div>
          </div>
        </div>

        {/* Memory Usage */}
        {memoryInfo && (
          <div>
            <h4 className="font-medium mb-2 flex items-center gap-1">
              <HardDrive className="w-4 h-4" />
              Memory
            </h4>
            <div className="space-y-1">
              <div className="flex justify-between">
                <span>Used:</span>
                <span>{formatBytes(memoryInfo.usedJSHeapSize)}</span>
              </div>
              <div className="flex justify-between">
                <span>Total:</span>
                <span>{formatBytes(memoryInfo.totalJSHeapSize)}</span>
              </div>
              <div className="flex justify-between">
                <span>Limit:</span>
                <span>{formatBytes(memoryInfo.jsHeapSizeLimit)}</span>
              </div>
              <Progress
                value={
                  (memoryInfo.usedJSHeapSize / memoryInfo.totalJSHeapSize) * 100
                }
                className="h-2"
              />
            </div>
          </div>
        )}

        {/* Loading Metrics */}
        <div>
          <h4 className="font-medium mb-2 flex items-center gap-1">
            <Clock className="w-4 h-4" />
            Loading Times
          </h4>
          <div className="space-y-1">
            <div className="flex justify-between">
              <span>DOM Ready:</span>
              <span
                className={
                  performanceMetrics.domContentLoaded > 2000
                    ? "text-red-600"
                    : "text-green-600"
                }
              >
                {formatTime(performanceMetrics.domContentLoaded)}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Page Load:</span>
              <span
                className={
                  performanceMetrics.loadComplete > 3000
                    ? "text-red-600"
                    : "text-green-600"
                }
              >
                {formatTime(performanceMetrics.loadComplete)}
              </span>
            </div>
            <div className="flex justify-between">
              <span>First Paint:</span>
              <span
                className={
                  performanceMetrics.firstContentfulPaint > 1500
                    ? "text-red-600"
                    : "text-green-600"
                }
              >
                {formatTime(performanceMetrics.firstContentfulPaint)}
              </span>
            </div>
            <div className="flex justify-between">
              <span>LCP:</span>
              <span
                className={
                  performanceMetrics.largestContentfulPaint > 2500
                    ? "text-red-600"
                    : "text-green-600"
                }
              >
                {formatTime(performanceMetrics.largestContentfulPaint)}
              </span>
            </div>
          </div>
        </div>

        {/* Tips */}
        <div className="text-xs text-gray-500 border-t pt-2">
          <p>💡 Press Ctrl+Shift+P to toggle this monitor</p>
          <p>💡 Green values indicate good performance</p>
          <p>💡 Red values indicate areas for optimization</p>
        </div>
      </CardContent>
    </Card>
  );
}

export default PerformanceMonitor;
