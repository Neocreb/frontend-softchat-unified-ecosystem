import { useState, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";

interface LazyImageProps {
  src: string;
  alt: string;
  className?: string;
  loading?: "eager" | "lazy";
  priority?: boolean;
  width?: number;
  height?: number;
  onLoad?: () => void;
  onError?: () => void;
  placeholder?: string;
  fallback?: React.ReactNode;
}

const LazyImage = ({
  src,
  alt,
  className,
  loading = "lazy",
  priority = false,
  width,
  height,
  onLoad,
  onError,
  placeholder,
  fallback,
}: LazyImageProps) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [imageSrc, setImageSrc] = useState(priority ? src : placeholder || "");
  const imgRef = useRef<HTMLImageElement>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    if (priority) {
      // Load immediately for priority images
      setImageSrc(src);
      return;
    }

    if (loading === "lazy" && !imageSrc) {
      // Setup intersection observer for lazy loading
      observerRef.current = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting) {
            setImageSrc(src);
            if (observerRef.current && imgRef.current) {
              observerRef.current.unobserve(imgRef.current);
            }
          }
        },
        {
          rootMargin: "50px 0px", // Start loading 50px before entering viewport
          threshold: 0.1,
        },
      );

      if (imgRef.current) {
        observerRef.current.observe(imgRef.current);
      }
    } else {
      setImageSrc(src);
    }

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [src, loading, priority, imageSrc]);

  const handleLoad = () => {
    setImageLoaded(true);
    onLoad?.();
  };

  const handleError = () => {
    setImageError(true);
    onError?.();
  };

  if (imageError && fallback) {
    return <>{fallback}</>;
  }

  return (
    <div className="relative w-full h-full">
      {/* Loading placeholder */}
      {!imageLoaded && !imageError && (
        <div
          className={cn(
            "absolute inset-0 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 animate-pulse",
            "bg-[length:200%_100%] animate-[shimmer_1.5s_ease-in-out_infinite]",
          )}
        />
      )}

      {/* Actual image */}
      {!imageError && (
        <img
          ref={imgRef}
          src={imageSrc}
          alt={alt}
          width={width}
          height={height}
          loading={loading}
          decoding={priority ? "sync" : "async"}
          className={cn(
            "w-full h-full object-cover transition-opacity duration-300",
            imageLoaded ? "opacity-100" : "opacity-0",
            className,
          )}
          onLoad={handleLoad}
          onError={handleError}
        />
      )}

      {/* Error fallback */}
      {imageError && !fallback && (
        <div className="absolute inset-0 bg-gray-200 flex items-center justify-center">
          <div className="text-center">
            <div className="w-8 h-8 mx-auto mb-2 bg-gray-300 rounded" />
            <span className="text-gray-400 text-xs">Image unavailable</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default LazyImage;
