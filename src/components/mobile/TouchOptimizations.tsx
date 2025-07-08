import { useState, useEffect, useRef, useCallback } from "react";
import { RefreshCw, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

// Pull-to-refresh component
interface PullToRefreshProps {
  onRefresh: () => Promise<void>;
  children: React.ReactNode;
  threshold?: number;
  className?: string;
}

export function PullToRefresh({
  onRefresh,
  children,
  threshold = 80,
  className,
}: PullToRefreshProps) {
  const [isPulling, setIsPulling] = useState(false);
  const [pullDistance, setPullDistance] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const startY = useRef(0);

  const handleTouchStart = useCallback((e: TouchEvent) => {
    if (window.scrollY === 0) {
      startY.current = e.touches[0].clientY;
    }
  }, []);

  const handleTouchMove = useCallback(
    (e: TouchEvent) => {
      if (window.scrollY > 0 || isRefreshing) return;

      const currentY = e.touches[0].clientY;
      const distance = currentY - startY.current;

      if (distance > 0) {
        setIsPulling(true);
        setPullDistance(Math.min(distance, threshold + 50));

        // Prevent default scrolling when pulling down
        if (distance > 10) {
          e.preventDefault();
        }
      }
    },
    [threshold, isRefreshing],
  );

  const handleTouchEnd = useCallback(async () => {
    if (pullDistance > threshold && !isRefreshing) {
      setIsRefreshing(true);
      try {
        await onRefresh();
      } catch (error) {
        console.error("Refresh failed:", error);
      } finally {
        setIsRefreshing(false);
      }
    }

    setIsPulling(false);
    setPullDistance(0);
  }, [pullDistance, threshold, onRefresh, isRefreshing]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Store refs to handlers for cleanup
    const startHandler = handleTouchStart;
    const moveHandler = handleTouchMove;
    const endHandler = handleTouchEnd;

    container.addEventListener("touchstart", startHandler, {
      passive: true,
    });
    container.addEventListener("touchmove", moveHandler, {
      passive: false,
    });
    container.addEventListener("touchend", endHandler, { passive: true });

    return () => {
      // Use the stored refs for cleanup to prevent errors
      if (container) {
        container.removeEventListener("touchstart", startHandler);
        container.removeEventListener("touchmove", moveHandler);
        container.removeEventListener("touchend", endHandler);
      }
    };
  }, [handleTouchStart, handleTouchMove, handleTouchEnd]);

  const refreshOpacity = Math.min(pullDistance / threshold, 1);
  const refreshRotation = (pullDistance / threshold) * 180;

  return (
    <div ref={containerRef} className={cn("relative", className)}>
      {/* Pull indicator */}
      <div
        className={cn(
          "absolute top-0 left-0 right-0 flex items-center justify-center transition-all duration-200 z-10",
          isPulling || isRefreshing ? "opacity-100" : "opacity-0",
        )}
        style={{
          transform: `translateY(${Math.max(0, pullDistance - 40)}px)`,
        }}
      >
        <div className="bg-white dark:bg-gray-800 rounded-full p-2 shadow-lg border">
          <RefreshCw
            className={cn(
              "w-5 h-5 text-blue-500 transition-transform duration-200",
              isRefreshing && "animate-spin",
            )}
            style={{
              transform: `rotate(${refreshRotation}deg)`,
              opacity: refreshOpacity,
            }}
          />
        </div>
      </div>

      {/* Content */}
      <div
        style={{
          transform: `translateY(${isPulling || isRefreshing ? Math.min(pullDistance, 60) : 0}px)`,
          transition: isPulling ? "none" : "transform 0.3s ease-out",
        }}
      >
        {children}
      </div>
    </div>
  );
}

// Swipe gesture detector
interface SwipeDetectorProps {
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  onSwipeUp?: () => void;
  onSwipeDown?: () => void;
  threshold?: number;
  children: React.ReactNode;
  className?: string;
}

export function SwipeDetector({
  onSwipeLeft,
  onSwipeRight,
  onSwipeUp,
  onSwipeDown,
  threshold = 50,
  children,
  className,
}: SwipeDetectorProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const startTouch = useRef<{ x: number; y: number } | null>(null);
  const [isDisabled, setIsDisabled] = useState(false);

  const handleTouchStart = useCallback((e: TouchEvent) => {
    // Don't interfere with scrollable content
    const target = e.target as HTMLElement;
    if (target.closest("[data-swipe-disabled]")) {
      setIsDisabled(true);
      return;
    }

    setIsDisabled(false);
    startTouch.current = {
      x: e.touches[0].clientX,
      y: e.touches[0].clientY,
    };
  }, []);

  const handleTouchEnd = useCallback(
    (e: TouchEvent) => {
      if (!startTouch.current || isDisabled) return;

      const endX = e.changedTouches[0].clientX;
      const endY = e.changedTouches[0].clientY;
      const deltaX = endX - startTouch.current.x;
      const deltaY = endY - startTouch.current.y;

      // Determine if this is a swipe gesture
      const absDeltaX = Math.abs(deltaX);
      const absDeltaY = Math.abs(deltaY);

      if (absDeltaX > threshold || absDeltaY > threshold) {
        // Horizontal swipe takes precedence if both are above threshold
        if (absDeltaX > absDeltaY) {
          if (deltaX > 0 && onSwipeRight) {
            onSwipeRight();
          } else if (deltaX < 0 && onSwipeLeft) {
            onSwipeLeft();
          }
        } else {
          if (deltaY > 0 && onSwipeDown) {
            onSwipeDown();
          } else if (deltaY < 0 && onSwipeUp) {
            onSwipeUp();
          }
        }
      }

      startTouch.current = null;
    },
    [onSwipeLeft, onSwipeRight, onSwipeUp, onSwipeDown, threshold, isDisabled],
  );

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    container.addEventListener("touchstart", handleTouchStart, {
      passive: true,
    });
    container.addEventListener("touchend", handleTouchEnd, { passive: true });

    return () => {
      container.removeEventListener("touchstart", handleTouchStart);
      container.removeEventListener("touchend", handleTouchEnd);
    };
  }, [handleTouchStart, handleTouchEnd]);

  return (
    <div ref={containerRef} className={className}>
      {children}
    </div>
  );
}

// Infinite scroll component
interface InfiniteScrollProps {
  hasMore: boolean;
  isLoading: boolean;
  onLoadMore: () => void;
  children: React.ReactNode;
  threshold?: number;
  loader?: React.ReactNode;
  className?: string;
}

export function InfiniteScroll({
  hasMore,
  isLoading,
  onLoadMore,
  children,
  threshold = 200,
  loader,
  className,
}: InfiniteScrollProps) {
  const sentinelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry.isIntersecting && hasMore && !isLoading) {
          onLoadMore();
        }
      },
      {
        rootMargin: `${threshold}px`,
      },
    );

    observer.observe(sentinel);

    return () => {
      observer.unobserve(sentinel);
    };
  }, [hasMore, isLoading, onLoadMore, threshold]);

  return (
    <div className={className}>
      {children}

      {/* Intersection sentinel */}
      <div ref={sentinelRef} className="h-1" />

      {/* Loading indicator */}
      {isLoading && (
        <div className="flex justify-center py-4">
          {loader || (
            <div className="flex items-center gap-2 text-gray-500">
              <RefreshCw className="w-4 h-4 animate-spin" />
              <span className="text-sm">Loading more...</span>
            </div>
          )}
        </div>
      )}

      {/* End indicator */}
      {!hasMore && !isLoading && (
        <div className="text-center py-4 text-gray-500 text-sm">
          No more content to load
        </div>
      )}
    </div>
  );
}

// Touch-optimized button component
interface TouchButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: "default" | "ghost" | "outline";
  size?: "sm" | "md" | "lg";
  className?: string;
  disabled?: boolean;
}

export function TouchButton({
  children,
  onClick,
  variant = "default",
  size = "md",
  className,
  disabled = false,
}: TouchButtonProps) {
  const [isPressed, setIsPressed] = useState(false);

  const baseClasses =
    "relative overflow-hidden transition-all duration-150 font-medium touch-manipulation select-none";

  const variantClasses = {
    default: "bg-blue-500 text-white hover:bg-blue-600 active:bg-blue-700",
    ghost: "text-gray-700 hover:bg-gray-100 active:bg-gray-200",
    outline:
      "border border-gray-300 text-gray-700 hover:bg-gray-50 active:bg-gray-100",
  };

  const sizeClasses = {
    sm: "px-3 py-2 text-sm min-h-[36px] min-w-[64px]",
    md: "px-4 py-3 text-base min-h-[44px] min-w-[80px]",
    lg: "px-6 py-4 text-lg min-h-[52px] min-w-[96px]",
  };

  const disabledClasses = "opacity-50 cursor-not-allowed";

  return (
    <button
      className={cn(
        baseClasses,
        variantClasses[variant],
        sizeClasses[size],
        isPressed && !disabled && "scale-95",
        disabled && disabledClasses,
        className,
      )}
      onTouchStart={() => !disabled && setIsPressed(true)}
      onTouchEnd={() => setIsPressed(false)}
      onTouchCancel={() => setIsPressed(false)}
      onMouseDown={() => !disabled && setIsPressed(true)}
      onMouseUp={() => setIsPressed(false)}
      onMouseLeave={() => setIsPressed(false)}
      onClick={disabled ? undefined : onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
}

// Mobile-optimized modal/sheet component
interface MobileSheetProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title?: string;
  snapPoints?: string[];
}

export function MobileSheet({
  isOpen,
  onClose,
  children,
  title,
  snapPoints = ["400px", "100%"],
}: MobileSheetProps) {
  const [currentSnapPoint, setCurrentSnapPoint] = useState(0);
  const sheetRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startY, setStartY] = useState(0);
  const [currentY, setCurrentY] = useState(0);

  const handleTouchStart = (e: React.TouchEvent) => {
    setIsDragging(true);
    setStartY(e.touches[0].clientY);
    setCurrentY(e.touches[0].clientY);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return;

    const newY = e.touches[0].clientY;
    const deltaY = newY - startY;

    if (deltaY > 0) {
      // Only allow downward drag
      setCurrentY(newY);
    }
  };

  const handleTouchEnd = () => {
    if (!isDragging) return;

    const deltaY = currentY - startY;
    const threshold = 100;

    if (deltaY > threshold) {
      if (currentSnapPoint < snapPoints.length - 1) {
        setCurrentSnapPoint(currentSnapPoint + 1);
      } else {
        onClose();
      }
    }

    setIsDragging(false);
    setStartY(0);
    setCurrentY(0);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 lg:hidden">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />

      {/* Sheet */}
      <div
        ref={sheetRef}
        className="absolute bottom-0 left-0 right-0 bg-white dark:bg-gray-900 rounded-t-xl shadow-xl transform transition-transform duration-300"
        style={{
          height: snapPoints[currentSnapPoint],
          transform: isDragging
            ? `translateY(${Math.max(0, currentY - startY)}px)`
            : "translateY(0)",
        }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {/* Handle */}
        <div className="flex justify-center pt-2 pb-1">
          <div className="w-8 h-1 bg-gray-300 rounded-full" />
        </div>

        {/* Header */}
        {title && (
          <div className="px-4 py-3 border-b">
            <h3 className="font-semibold text-center">{title}</h3>
          </div>
        )}

        {/* Content */}
        <div className="flex-1 overflow-y-auto" data-swipe-disabled>
          {children}
        </div>
      </div>
    </div>
  );
}
