import React, { useState, useEffect, useMemo, useCallback, Suspense, lazy } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import {
  Loader2,
  TrendingUp,
  AlertCircle,
  CheckCircle2,
  Clock,
  Zap,
  BarChart3,
  Eye,
  EyeOff,
} from "lucide-react";
import { cn } from "@/lib/utils";

// Lazy load heavy components
const HeavyAnalyticsChart = lazy(() => import("./HeavyAnalyticsChart"));
const DetailedProjectView = lazy(() => import("./DetailedProjectView"));

// Enhanced Skeleton Components
export const CardSkeleton: React.FC<{ className?: string }> = ({ className }) => (
  <Card className={cn("animate-pulse", className)}>
    <CardHeader className="space-y-2">
      <Skeleton className="h-4 w-1/3" />
      <Skeleton className="h-3 w-1/2" />
    </CardHeader>
    <CardContent className="space-y-3">
      <Skeleton className="h-8 w-full" />
      <div className="flex space-x-2">
        <Skeleton className="h-4 w-1/4" />
        <Skeleton className="h-4 w-1/4" />
      </div>
      <Skeleton className="h-2 w-full" />
    </CardContent>
  </Card>
);

export const TableSkeleton: React.FC<{ rows?: number; columns?: number }> = ({ 
  rows = 5, 
  columns = 4 
}) => (
  <div className="space-y-3">
    <div className="grid grid-cols-4 gap-4 pb-2 border-b">
      {Array.from({ length: columns }).map((_, i) => (
        <Skeleton key={i} className="h-4 w-3/4" />
      ))}
    </div>
    {Array.from({ length: rows }).map((_, i) => (
      <div key={i} className="grid grid-cols-4 gap-4">
        {Array.from({ length: columns }).map((_, j) => (
          <Skeleton key={j} className="h-6 w-full" />
        ))}
      </div>
    ))}
  </div>
);

export const DashboardSkeleton: React.FC = () => (
  <div className="space-y-6">
    {/* Stats Cards Skeleton */}
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {Array.from({ length: 4 }).map((_, i) => (
        <CardSkeleton key={i} />
      ))}
    </div>

    {/* Main Content Skeleton */}
    <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
      <div className="xl:col-span-2 space-y-6">
        <CardSkeleton className="h-96" />
        <CardSkeleton className="h-64" />
      </div>
      <div className="space-y-6">
        <CardSkeleton className="h-48" />
        <CardSkeleton className="h-32" />
        <CardSkeleton className="h-32" />
      </div>
    </div>
  </div>
);

// Optimistic UI Updates
interface OptimisticUpdateProps<T> {
  data: T;
  optimisticUpdate: T;
  isLoading: boolean;
  children: (data: T, isOptimistic: boolean) => React.ReactNode;
}

export function OptimisticUpdate<T>({ 
  data, 
  optimisticUpdate, 
  isLoading, 
  children 
}: OptimisticUpdateProps<T>) {
  const displayData = isLoading ? optimisticUpdate : data;
  return <>{children(displayData, isLoading)}</>;
}

// Infinite Scroll Hook
export const useInfiniteScroll = (
  fetchMore: () => Promise<void>,
  hasNextPage: boolean,
  isLoading: boolean
) => {
  const [isFetching, setIsFetching] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + document.documentElement.scrollTop 
        >= document.documentElement.offsetHeight - 1000 &&
        hasNextPage &&
        !isLoading &&
        !isFetching
      ) {
        setIsFetching(true);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [hasNextPage, isLoading, isFetching]);

  useEffect(() => {
    if (!isFetching) return;

    const fetchData = async () => {
      await fetchMore();
      setIsFetching(false);
    };

    fetchData();
  }, [isFetching, fetchMore]);

  return isFetching;
};

// Infinite Scroll Component
interface InfiniteScrollListProps<T> {
  items: T[];
  renderItem: (item: T, index: number) => React.ReactNode;
  fetchMore: () => Promise<void>;
  hasNextPage: boolean;
  isLoading: boolean;
  loadingComponent?: React.ReactNode;
  className?: string;
}

export function InfiniteScrollList<T>({
  items,
  renderItem,
  fetchMore,
  hasNextPage,
  isLoading,
  loadingComponent,
  className
}: InfiniteScrollListProps<T>) {
  const isFetchingMore = useInfiniteScroll(fetchMore, hasNextPage, isLoading);

  return (
    <div className={className}>
      {items.map((item, index) => (
        <div key={index}>{renderItem(item, index)}</div>
      ))}
      
      {isFetchingMore && (
        <div className="flex justify-center py-4">
          {loadingComponent || (
            <div className="flex items-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin" />
              <span className="text-sm text-gray-600">Loading more...</span>
            </div>
          )}
        </div>
      )}
      
      {!hasNextPage && items.length > 0 && (
        <div className="text-center py-4 text-sm text-gray-500">
          You've reached the end
        </div>
      )}
    </div>
  );
}

// Performance Monitor
export const PerformanceMonitor: React.FC = () => {
  const [metrics, setMetrics] = useState({
    loadTime: 0,
    renderTime: 0,
    memoryUsage: 0,
    isVisible: false,
  });

  useEffect(() => {
    // Measure page load time
    const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
    if (navigation) {
      setMetrics(prev => ({
        ...prev,
        loadTime: Math.round(navigation.loadEventEnd - navigation.loadEventStart),
      }));
    }

    // Measure render time
    const observer = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (entry.name === 'first-contentful-paint') {
          setMetrics(prev => ({
            ...prev,
            renderTime: Math.round(entry.startTime),
          }));
        }
      }
    });
    
    observer.observe({ entryTypes: ['paint'] });

    // Memory usage (if available)
    if ('memory' in performance) {
      const memory = (performance as any).memory;
      setMetrics(prev => ({
        ...prev,
        memoryUsage: Math.round(memory.usedJSHeapSize / 1024 / 1024),
      }));
    }

    return () => observer.disconnect();
  }, []);

  const getPerformanceStatus = (value: number, thresholds: { good: number; poor: number }) => {
    if (value <= thresholds.good) return "good";
    if (value <= thresholds.poor) return "fair";
    return "poor";
  };

  const loadTimeStatus = getPerformanceStatus(metrics.loadTime, { good: 100, poor: 300 });
  const renderTimeStatus = getPerformanceStatus(metrics.renderTime, { good: 1000, poor: 2500 });

  if (!metrics.isVisible) {
    return (
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setMetrics(prev => ({ ...prev, isVisible: true }))}
        className="fixed bottom-20 right-6 h-8 w-8 rounded-full bg-gray-600 hover:bg-gray-700 text-white z-30"
        title="Show Performance Metrics"
      >
        <Zap className="w-4 h-4" />
      </Button>
    );
  }

  return (
    <Card className="fixed bottom-20 right-6 w-64 z-30 shadow-lg">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium flex items-center gap-1">
            <BarChart3 className="w-4 h-4" />
            Performance
          </span>
          <Button
            variant="ghost"
            size="sm"
            className="h-6 w-6 p-0"
            onClick={() => setMetrics(prev => ({ ...prev, isVisible: false }))}
          >
            <EyeOff className="w-3 h-3" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-2 text-xs">
        <div className="flex items-center justify-between">
          <span>Load Time</span>
          <div className="flex items-center gap-1">
            <span>{metrics.loadTime}ms</span>
            {loadTimeStatus === "good" && <CheckCircle2 className="w-3 h-3 text-green-500" />}
            {loadTimeStatus === "fair" && <Clock className="w-3 h-3 text-yellow-500" />}
            {loadTimeStatus === "poor" && <AlertCircle className="w-3 h-3 text-red-500" />}
          </div>
        </div>
        
        <div className="flex items-center justify-between">
          <span>Render Time</span>
          <div className="flex items-center gap-1">
            <span>{metrics.renderTime}ms</span>
            {renderTimeStatus === "good" && <CheckCircle2 className="w-3 h-3 text-green-500" />}
            {renderTimeStatus === "fair" && <Clock className="w-3 h-3 text-yellow-500" />}
            {renderTimeStatus === "poor" && <AlertCircle className="w-3 h-3 text-red-500" />}
          </div>
        </div>
        
        {metrics.memoryUsage > 0 && (
          <div className="flex items-center justify-between">
            <span>Memory</span>
            <span>{metrics.memoryUsage}MB</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

// Lazy Loading Wrapper
interface LazyComponentProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  minHeight?: string;
}

export const LazyComponent: React.FC<LazyComponentProps> = ({ 
  children, 
  fallback,
  minHeight = "200px" 
}) => {
  const defaultFallback = (
    <div 
      className="flex items-center justify-center bg-gray-50 dark:bg-gray-800 rounded-lg"
      style={{ minHeight }}
    >
      <div className="flex items-center gap-2 text-gray-500">
        <Loader2 className="w-5 h-5 animate-spin" />
        <span>Loading component...</span>
      </div>
    </div>
  );

  return (
    <Suspense fallback={fallback || defaultFallback}>
      {children}
    </Suspense>
  );
};

// Virtualized List (for large datasets)
interface VirtualizedListProps<T> {
  items: T[];
  itemHeight: number;
  containerHeight: number;
  renderItem: (item: T, index: number) => React.ReactNode;
  overscan?: number;
}

export function VirtualizedList<T>({
  items,
  itemHeight,
  containerHeight,
  renderItem,
  overscan = 5
}: VirtualizedListProps<T>) {
  const [scrollTop, setScrollTop] = useState(0);

  const startIndex = Math.max(0, Math.floor(scrollTop / itemHeight) - overscan);
  const endIndex = Math.min(
    items.length - 1,
    Math.ceil((scrollTop + containerHeight) / itemHeight) + overscan
  );

  const visibleItems = items.slice(startIndex, endIndex + 1);

  const totalHeight = items.length * itemHeight;
  const offsetY = startIndex * itemHeight;

  return (
    <div
      className="overflow-auto"
      style={{ height: containerHeight }}
      onScroll={(e) => setScrollTop((e.target as HTMLElement).scrollTop)}
    >
      <div style={{ height: totalHeight, position: 'relative' }}>
        <div style={{ transform: `translateY(${offsetY}px)` }}>
          {visibleItems.map((item, index) => (
            <div key={startIndex + index} style={{ height: itemHeight }}>
              {renderItem(item, startIndex + index)}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// Memoized Component Wrapper
export const MemoizedCard = React.memo<{
  title: string;
  value: string | number;
  change?: string;
  icon: React.ReactNode;
  color: string;
}>(({ title, value, change, icon, color }) => (
  <Card className="hover:shadow-md transition-shadow">
    <CardContent className="p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
            {title}
          </p>
          <p className="text-2xl font-bold">{value}</p>
          {change && (
            <p className="text-sm text-green-600 flex items-center gap-1 mt-1">
              <TrendingUp className="w-3 h-3" />
              {change}
            </p>
          )}
        </div>
        <div className={`p-3 rounded-lg ${color}`}>
          {icon}
        </div>
      </div>
    </CardContent>
  </Card>
));

MemoizedCard.displayName = "MemoizedCard";

export default PerformanceMonitor;
