import { useState, useEffect, useCallback, useRef } from 'react';

interface VideoPerformanceMetrics {
  loadTime: number;
  bufferingEvents: number;
  averageBufferTime: number;
  qualityChanges: number;
  currentQuality: string;
  networkSpeed: 'slow' | 'medium' | 'fast';
  memoryUsage: number;
  cpuUsage: number;
  droppedFrames: number;
  playbackRate: number;
}

interface PerformanceOptimizations {
  preloadEnabled: boolean;
  adaptiveQuality: boolean;
  bufferSize: number;
  maxConcurrentVideos: number;
  lazyLoading: boolean;
  thumbnailPreloading: boolean;
  compressionLevel: number;
  cacheEnabled: boolean;
}

interface UseVideoPerformanceOptions {
  videoId?: string;
  enableMetrics?: boolean;
  enableOptimizations?: boolean;
  adaptiveQuality?: boolean;
  maxConcurrentVideos?: number;
}

export const useVideoPerformance = (options: UseVideoPerformanceOptions = {}) => {
  const {
    videoId,
    enableMetrics = true,
    enableOptimizations = true,
    adaptiveQuality = true,
    maxConcurrentVideos = 3,
  } = options;

  const [metrics, setMetrics] = useState<VideoPerformanceMetrics>({
    loadTime: 0,
    bufferingEvents: 0,
    averageBufferTime: 0,
    qualityChanges: 0,
    currentQuality: 'auto',
    networkSpeed: 'fast',
    memoryUsage: 0,
    cpuUsage: 0,
    droppedFrames: 0,
    playbackRate: 1,
  });

  const [optimizations, setOptimizations] = useState<PerformanceOptimizations>({
    preloadEnabled: true,
    adaptiveQuality: true,
    bufferSize: 30, // seconds
    maxConcurrentVideos: 3,
    lazyLoading: true,
    thumbnailPreloading: true,
    compressionLevel: 0.8,
    cacheEnabled: true,
  });

  const [isOptimizing, setIsOptimizing] = useState(false);
  const [performanceScore, setPerformanceScore] = useState(100);
  const [recommendations, setRecommendations] = useState<string[]>([]);
  
  const metricsRef = useRef<VideoPerformanceMetrics>(metrics);
  const startTimeRef = useRef<number>(0);
  const bufferStartRef = useRef<number>(0);
  const observerRef = useRef<IntersectionObserver | null>(null);

  // Network speed detection
  const detectNetworkSpeed = useCallback(async () => {
    if (!navigator.connection) {
      return 'fast';
    }

    const connection = navigator.connection as any;
    const effectiveType = connection.effectiveType;
    
    switch (effectiveType) {
      case 'slow-2g':
      case '2g':
        return 'slow';
      case '3g':
        return 'medium';
      case '4g':
      default:
        return 'fast';
    }
  }, []);

  // Memory usage monitoring
  const getMemoryUsage = useCallback(() => {
    if ('memory' in performance) {
      const memory = (performance as any).memory;
      return {
        used: memory.usedJSHeapSize / 1024 / 1024, // MB
        total: memory.totalJSHeapSize / 1024 / 1024, // MB
        limit: memory.jsHeapSizeLimit / 1024 / 1024, // MB
      };
    }
    return { used: 0, total: 0, limit: 0 };
  }, []);

  // Video quality optimization based on network and device
  const optimizeVideoQuality = useCallback(async (videoElement: HTMLVideoElement) => {
    const networkSpeed = await detectNetworkSpeed();
    const memory = getMemoryUsage();
    const devicePixelRatio = window.devicePixelRatio || 1;
    
    let recommendedQuality = '720p';
    
    // Adjust based on network speed
    if (networkSpeed === 'slow') {
      recommendedQuality = '360p';
    } else if (networkSpeed === 'medium') {
      recommendedQuality = '480p';
    } else if (devicePixelRatio > 1 && memory.used < memory.limit * 0.7) {
      recommendedQuality = '1080p';
    }
    
    // Update metrics
    setMetrics(prev => ({
      ...prev,
      networkSpeed,
      currentQuality: recommendedQuality,
      memoryUsage: memory.used,
    }));
    
    return recommendedQuality;
  }, [detectNetworkSpeed, getMemoryUsage]);

  // Preload optimization
  const optimizePreloading = useCallback((videoElements: HTMLVideoElement[]) => {
    const visibleVideos = videoElements.filter(video => {
      const rect = video.getBoundingClientRect();
      return rect.top < window.innerHeight && rect.bottom > 0;
    });
    
    // Limit concurrent preloading
    visibleVideos.slice(0, maxConcurrentVideos).forEach(video => {
      if (video.preload !== 'metadata') {
        video.preload = 'metadata';
      }
    });
    
    // Remove preload from non-visible videos
    videoElements.slice(maxConcurrentVideos).forEach(video => {
      if (video.preload !== 'none') {
        video.preload = 'none';
      }
    });
  }, [maxConcurrentVideos]);

  // Buffer optimization
  const optimizeBuffering = useCallback((videoElement: HTMLVideoElement) => {
    const targetBufferSize = optimizations.bufferSize;
    
    // Adjust buffer size based on network conditions
    if (metrics.networkSpeed === 'slow') {
      // Smaller buffer for slow connections
      videoElement.setAttribute('preload', 'metadata');
    } else if (metrics.networkSpeed === 'fast') {
      // Larger buffer for fast connections
      videoElement.setAttribute('preload', 'auto');
    }
  }, [optimizations.bufferSize, metrics.networkSpeed]);

  // Lazy loading implementation
  const setupLazyLoading = useCallback((videoElements: HTMLVideoElement[]) => {
    if (!optimizations.lazyLoading) return;

    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const video = entry.target as HTMLVideoElement;
          if (entry.isIntersecting) {
            // Load video when it comes into view
            if (video.dataset.src && !video.src) {
              video.src = video.dataset.src;
              video.load();
            }
          } else {
            // Pause and unload video when out of view
            if (!video.paused) {
              video.pause();
            }
          }
        });
      },
      {
        threshold: 0.25, // Start loading when 25% visible
        rootMargin: '100px', // Start loading 100px before entering viewport
      }
    );

    videoElements.forEach(video => {
      observerRef.current?.observe(video);
    });
  }, [optimizations.lazyLoading]);

  // Performance monitoring for video element
  const monitorVideoPerformance = useCallback((videoElement: HTMLVideoElement) => {
    if (!enableMetrics) return;

    const handleLoadStart = () => {
      startTimeRef.current = performance.now();
    };

    const handleCanPlay = () => {
      const loadTime = performance.now() - startTimeRef.current;
      setMetrics(prev => ({ ...prev, loadTime }));
    };

    const handleWaiting = () => {
      bufferStartRef.current = performance.now();
      setMetrics(prev => ({ ...prev, bufferingEvents: prev.bufferingEvents + 1 }));
    };

    const handlePlaying = () => {
      if (bufferStartRef.current > 0) {
        const bufferTime = performance.now() - bufferStartRef.current;
        setMetrics(prev => ({
          ...prev,
          averageBufferTime: (prev.averageBufferTime + bufferTime) / 2,
        }));
        bufferStartRef.current = 0;
      }
    };

    const handleRateChange = () => {
      setMetrics(prev => ({
        ...prev,
        playbackRate: videoElement.playbackRate,
      }));
    };

    const handleQualityChange = () => {
      setMetrics(prev => ({
        ...prev,
        qualityChanges: prev.qualityChanges + 1,
      }));
    };

    // Add event listeners
    videoElement.addEventListener('loadstart', handleLoadStart);
    videoElement.addEventListener('canplay', handleCanPlay);
    videoElement.addEventListener('waiting', handleWaiting);
    videoElement.addEventListener('playing', handlePlaying);
    videoElement.addEventListener('ratechange', handleRateChange);

    // Custom quality change listener (would need to be triggered by quality selector)
    videoElement.addEventListener('qualitychange', handleQualityChange);

    // Cleanup function
    return () => {
      videoElement.removeEventListener('loadstart', handleLoadStart);
      videoElement.removeEventListener('canplay', handleCanPlay);
      videoElement.removeEventListener('waiting', handleWaiting);
      videoElement.removeEventListener('playing', handlePlaying);
      videoElement.removeEventListener('ratechange', handleRateChange);
      videoElement.removeEventListener('qualitychange', handleQualityChange);
    };
  }, [enableMetrics]);

  // Calculate performance score
  useEffect(() => {
    const calculateScore = () => {
      let score = 100;
      
      // Deduct points for poor metrics
      if (metrics.loadTime > 3000) score -= 20; // > 3 seconds load time
      if (metrics.bufferingEvents > 3) score -= 15; // Too many buffer events
      if (metrics.averageBufferTime > 1000) score -= 15; // > 1 second average buffer
      if (metrics.memoryUsage > 500) score -= 10; // > 500MB memory usage
      if (metrics.droppedFrames > 10) score -= 10; // > 10 dropped frames
      
      // Bonus points for good performance
      if (metrics.loadTime < 1000) score += 5; // < 1 second load time
      if (metrics.bufferingEvents === 0) score += 5; // No buffering
      
      return Math.max(0, Math.min(100, score));
    };
    
    setPerformanceScore(calculateScore());
  }, [metrics]);

  // Generate performance recommendations
  useEffect(() => {
    const newRecommendations: string[] = [];
    
    if (metrics.loadTime > 3000) {
      newRecommendations.push('Consider enabling video preloading for faster load times');
    }
    
    if (metrics.bufferingEvents > 3) {
      newRecommendations.push('Enable adaptive quality to reduce buffering');
    }
    
    if (metrics.memoryUsage > 500) {
      newRecommendations.push('Limit concurrent videos to reduce memory usage');
    }
    
    if (metrics.networkSpeed === 'slow') {
      newRecommendations.push('Lower video quality recommended for your connection');
    }
    
    if (!optimizations.lazyLoading) {
      newRecommendations.push('Enable lazy loading to improve performance');
    }
    
    setRecommendations(newRecommendations);
  }, [metrics, optimizations]);

  // Auto-optimization based on metrics
  useEffect(() => {
    if (!enableOptimizations) return;
    
    const autoOptimize = async () => {
      setIsOptimizing(true);
      
      // Auto-adjust based on performance metrics
      const newOptimizations = { ...optimizations };
      
      if (metrics.bufferingEvents > 3 && !optimizations.adaptiveQuality) {
        newOptimizations.adaptiveQuality = true;
      }
      
      if (metrics.memoryUsage > 400 && optimizations.maxConcurrentVideos > 2) {
        newOptimizations.maxConcurrentVideos = 2;
      }
      
      if (metrics.networkSpeed === 'slow' && optimizations.bufferSize > 15) {
        newOptimizations.bufferSize = 15;
      }
      
      if (metrics.loadTime > 3000 && !optimizations.preloadEnabled) {
        newOptimizations.preloadEnabled = true;
      }
      
      setOptimizations(newOptimizations);
      setIsOptimizing(false);
    };
    
    // Debounce auto-optimization
    const timeoutId = setTimeout(autoOptimize, 2000);
    return () => clearTimeout(timeoutId);
  }, [metrics, enableOptimizations, optimizations]);

  // Network change detection
  useEffect(() => {
    const handleNetworkChange = async () => {
      const speed = await detectNetworkSpeed();
      setMetrics(prev => ({ ...prev, networkSpeed: speed }));
    };

    if (navigator.connection) {
      navigator.connection.addEventListener('change', handleNetworkChange);
      return () => {
        navigator.connection?.removeEventListener('change', handleNetworkChange);
      };
    }
  }, [detectNetworkSpeed]);

  // Cleanup intersection observer
  useEffect(() => {
    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, []);

  // Update metrics ref
  useEffect(() => {
    metricsRef.current = metrics;
  }, [metrics]);

  return {
    metrics,
    optimizations,
    setOptimizations,
    performanceScore,
    recommendations,
    isOptimizing,
    
    // Methods
    optimizeVideoQuality,
    optimizePreloading,
    optimizeBuffering,
    setupLazyLoading,
    monitorVideoPerformance,
    getMemoryUsage,
    detectNetworkSpeed,
  };
};

export type { VideoPerformanceMetrics, PerformanceOptimizations, UseVideoPerformanceOptions };
