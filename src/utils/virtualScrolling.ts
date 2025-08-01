import { useState, useEffect, useMemo } from 'react';

interface VirtualScrollingOptions {
  itemHeight: number;
  containerHeight: number;
  overscan?: number;
}

interface VirtualScrollingResult<T> {
  visibleItems: T[];
  totalHeight: number;
  startIndex: number;
  endIndex: number;
  offsetY: number;
}

export function useVirtualScrolling<T>(
  items: T[],
  options: VirtualScrollingOptions
): VirtualScrollingResult<T> {
  const { itemHeight, containerHeight, overscan = 5 } = options;
  const [scrollTop, setScrollTop] = useState(0);

  const result = useMemo(() => {
    const totalHeight = items.length * itemHeight;
    const visibleCount = Math.ceil(containerHeight / itemHeight);
    
    const startIndex = Math.max(0, Math.floor(scrollTop / itemHeight) - overscan);
    const endIndex = Math.min(
      items.length - 1,
      startIndex + visibleCount + overscan * 2
    );
    
    const visibleItems = items.slice(startIndex, endIndex + 1);
    const offsetY = startIndex * itemHeight;

    return {
      visibleItems,
      totalHeight,
      startIndex,
      endIndex,
      offsetY,
    };
  }, [items, itemHeight, containerHeight, scrollTop, overscan]);

  return result;
}

export const virtualScrolling = {
  useVirtualScrolling,
};
