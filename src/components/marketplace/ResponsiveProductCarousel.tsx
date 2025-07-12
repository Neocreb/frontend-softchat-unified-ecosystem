import React, { useState, useRef, useEffect } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Heart,
  ShoppingCart,
  Star,
  Eye,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface Product {
  id: string;
  name: string;
  image: string;
  originalPrice: number;
  salePrice?: number;
  discount?: number;
  rating: number;
  reviews: number;
  inStock: boolean;
  isFeatured?: boolean;
  isNew?: boolean;
  category?: string;
}

interface ResponsiveProductCarouselProps {
  products: Product[];
  title?: string;
  subtitle?: string;
  onProductClick?: (product: Product) => void;
  onAddToCart?: (productId: string) => void;
  onAddToWishlist?: (productId: string) => void;
  onQuickView?: (product: Product) => void;
  showPagination?: boolean;
  autoplay?: boolean;
  autoplayInterval?: number;
  className?: string;
  itemsPerView?: {
    mobile: number;
    tablet: number;
    desktop: number;
  };
}

const defaultItemsPerView = {
  mobile: 1.2,
  tablet: 2.5,
  desktop: 4,
};

export const ResponsiveProductCarousel: React.FC<
  ResponsiveProductCarouselProps
> = ({
  products,
  title,
  subtitle,
  onProductClick,
  onAddToCart,
  onAddToWishlist,
  onQuickView,
  showPagination = true,
  autoplay = false,
  autoplayInterval = 5000,
  className,
  itemsPerView = defaultItemsPerView,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(autoplay);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const [itemWidth, setItemWidth] = useState(0);
  const [visibleItems, setVisibleItems] = useState(itemsPerView.mobile);

  const carouselRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const autoplayRef = useRef<NodeJS.Timeout>();

  // Calculate visible items based on screen size
  useEffect(() => {
    const calculateVisibleItems = () => {
      if (!containerRef.current) return;

      const containerWidth = containerRef.current.offsetWidth;

      if (containerWidth >= 1024) {
        setVisibleItems(itemsPerView.desktop);
      } else if (containerWidth >= 768) {
        setVisibleItems(itemsPerView.tablet);
      } else {
        setVisibleItems(itemsPerView.mobile);
      }

      setItemWidth(containerWidth / visibleItems);
    };

    calculateVisibleItems();
    window.addEventListener("resize", calculateVisibleItems);
    return () => window.removeEventListener("resize", calculateVisibleItems);
  }, [itemsPerView]);

  // Autoplay functionality
  useEffect(() => {
    if (isAutoPlaying && products.length > visibleItems) {
      autoplayRef.current = setInterval(() => {
        setCurrentIndex((prev) => {
          const maxIndex = Math.max(
            0,
            products.length - Math.floor(visibleItems),
          );
          return prev >= maxIndex ? 0 : prev + 1;
        });
      }, autoplayInterval);
    }

    return () => {
      if (autoplayRef.current) {
        clearInterval(autoplayRef.current);
      }
    };
  }, [isAutoPlaying, products.length, visibleItems, autoplayInterval]);

  const maxIndex = Math.max(0, products.length - Math.floor(visibleItems));

  const goToNext = () => {
    setCurrentIndex((prev) => Math.min(prev + 1, maxIndex));
  };

  const goToPrevious = () => {
    setCurrentIndex((prev) => Math.max(prev - 1, 0));
  };

  const goToSlide = (index: number) => {
    setCurrentIndex(Math.max(0, Math.min(index, maxIndex)));
  };

  // Touch/mouse drag handlers
  const handleStart = (clientX: number) => {
    setIsDragging(true);
    setStartX(clientX);
    setScrollLeft(currentIndex * itemWidth);
    setIsAutoPlaying(false);
  };

  const handleMove = (clientX: number) => {
    if (!isDragging) return;

    const diff = startX - clientX;
    const newScrollLeft = scrollLeft + diff;
    const newIndex = Math.round(newScrollLeft / itemWidth);

    setCurrentIndex(Math.max(0, Math.min(newIndex, maxIndex)));
  };

  const handleEnd = () => {
    setIsDragging(false);
    if (autoplay) {
      setTimeout(() => setIsAutoPlaying(true), 2000);
    }
  };

  // Mouse events
  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    handleStart(e.clientX);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    handleMove(e.clientX);
  };

  const handleMouseUp = () => {
    handleEnd();
  };

  // Touch events
  const handleTouchStart = (e: React.TouchEvent) => {
    handleStart(e.touches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    handleMove(e.touches[0].clientX);
  };

  const handleTouchEnd = () => {
    handleEnd();
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(price);
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={cn(
          "w-3 h-3",
          i < Math.floor(rating)
            ? "text-yellow-400 fill-yellow-400"
            : "text-gray-300",
        )}
      />
    ));
  };

  return (
    <div className={cn("w-full", className)}>
      {/* Header */}
      {(title || subtitle) && (
        <div className="mb-6">
          {title && (
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
              {title}
            </h2>
          )}
          {subtitle && (
            <p className="text-gray-600 text-sm md:text-base">{subtitle}</p>
          )}
        </div>
      )}

      {/* Carousel Container */}
      <div
        ref={containerRef}
        className="relative"
        onMouseLeave={() => setIsAutoPlaying(autoplay)}
        onMouseEnter={() => setIsAutoPlaying(false)}
      >
        {/* Navigation Arrows */}
        <Button
          variant="outline"
          size="icon"
          className={cn(
            "absolute left-2 top-1/2 -translate-y-1/2 z-10 bg-white/90 hover:bg-white shadow-lg",
            "hidden md:flex",
            currentIndex === 0 && "opacity-50 cursor-not-allowed",
          )}
          onClick={goToPrevious}
          disabled={currentIndex === 0}
        >
          <ChevronLeft className="w-4 h-4" />
        </Button>

        <Button
          variant="outline"
          size="icon"
          className={cn(
            "absolute right-2 top-1/2 -translate-y-1/2 z-10 bg-white/90 hover:bg-white shadow-lg",
            "hidden md:flex",
            currentIndex >= maxIndex && "opacity-50 cursor-not-allowed",
          )}
          onClick={goToNext}
          disabled={currentIndex >= maxIndex}
        >
          <ChevronRight className="w-4 h-4" />
        </Button>

        {/* Products Carousel */}
        <div
          ref={carouselRef}
          className="overflow-hidden cursor-grab active:cursor-grabbing"
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          <div
            className="flex transition-transform duration-300 ease-out"
            style={{
              transform: `translateX(-${currentIndex * (100 / visibleItems)}%)`,
            }}
          >
            {products.map((product) => (
              <div
                key={product.id}
                className="flex-shrink-0 px-2"
                style={{ width: `${100 / visibleItems}%` }}
              >
                <div className="group bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-300 h-full">
                  {/* Product Image */}
                  <div className="relative aspect-square bg-gray-50 overflow-hidden">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      onClick={() => onProductClick?.(product)}
                    />

                    {/* Badges */}
                    <div className="absolute top-2 left-2 flex flex-col gap-1">
                      {product.discount && (
                        <Badge className="bg-red-500 text-white text-xs">
                          -{product.discount}%
                        </Badge>
                      )}
                      {product.isNew && (
                        <Badge className="bg-green-500 text-white text-xs">
                          New
                        </Badge>
                      )}
                      {product.isFeatured && (
                        <Badge className="bg-blue-500 text-white text-xs">
                          <Zap className="w-3 h-3 mr-1" />
                          Featured
                        </Badge>
                      )}
                    </div>

                    {/* Quick Actions */}
                    <div className="absolute top-2 right-2 flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button
                        variant="outline"
                        size="icon"
                        className="bg-white/90 hover:bg-white w-8 h-8"
                        onClick={(e) => {
                          e.stopPropagation();
                          onAddToWishlist?.(product.id);
                        }}
                      >
                        <Heart className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        className="bg-white/90 hover:bg-white w-8 h-8"
                        onClick={(e) => {
                          e.stopPropagation();
                          onQuickView?.(product);
                        }}
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                    </div>

                    {/* Stock Status */}
                    {!product.inStock && (
                      <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                        <span className="text-white font-semibold text-sm">
                          Out of Stock
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Product Info */}
                  <div className="p-3">
                    <h3
                      className="font-medium text-sm md:text-base text-gray-900 line-clamp-2 mb-2 cursor-pointer hover:text-blue-600"
                      onClick={() => onProductClick?.(product)}
                    >
                      {product.name}
                    </h3>

                    {/* Rating */}
                    <div className="flex items-center gap-1 mb-2">
                      <div className="flex items-center">
                        {renderStars(product.rating)}
                      </div>
                      <span className="text-xs text-gray-500">
                        ({product.reviews})
                      </span>
                    </div>

                    {/* Price */}
                    <div className="flex items-center gap-2 mb-3">
                      <span className="font-bold text-red-500 text-sm md:text-base">
                        {formatPrice(
                          product.salePrice || product.originalPrice,
                        )}
                      </span>
                      {product.salePrice && (
                        <span className="text-xs md:text-sm text-gray-500 line-through">
                          {formatPrice(product.originalPrice)}
                        </span>
                      )}
                    </div>

                    {/* Add to Cart Button */}
                    <Button
                      className="w-full bg-black hover:bg-gray-800 text-white text-xs md:text-sm"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        onAddToCart?.(product.id);
                      }}
                      disabled={!product.inStock}
                    >
                      <ShoppingCart className="w-4 h-4 mr-2" />
                      Add to Cart
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Pagination Dots */}
        {showPagination && products.length > Math.floor(visibleItems) && (
          <div className="flex justify-center gap-2 mt-6">
            {Array.from({ length: maxIndex + 1 }, (_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={cn(
                  "w-2 h-2 rounded-full transition-all duration-200",
                  index === currentIndex
                    ? "bg-black w-6"
                    : "bg-gray-300 hover:bg-gray-400",
                )}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ResponsiveProductCarousel;
