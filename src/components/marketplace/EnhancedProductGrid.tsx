import { useState, useEffect, useMemo, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Product } from "@/types/marketplace";
import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MessageCircle, Grid, List, TrendingUp, Clock } from "lucide-react";
import EnhancedProductCard from "./EnhancedProductCard";
import { useMarketplace } from "@/contexts/MarketplaceContext";
import { useAuth } from "@/contexts/AuthContext";
import { cn } from "@/lib/utils";

interface ProductGridProps {
  category?: string;
  searchQuery?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  onAddToCart: (productId: string) => void;
  onAddToWishlist: (productId: string) => void;
  limit?: number;
  products?: Product[];
  viewMode?: "grid" | "list";
  onViewModeChange?: (mode: "grid" | "list") => void;
}

const ITEMS_PER_PAGE = 20;
const VIRTUAL_ITEM_HEIGHT = 300; // Approximate height of each item

const EnhancedProductGrid = ({
  category = "all",
  searchQuery = "",
  sortBy = "relevance",
  sortOrder = "desc",
  onAddToCart,
  onAddToWishlist,
  limit,
  products: propProducts,
  viewMode = "grid",
  onViewModeChange,
}: ProductGridProps) => {
  const [loading, setLoading] = useState(true);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [displayedProducts, setDisplayedProducts] = useState<Product[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMoreProducts, setHasMoreProducts] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const loadMoreRef = useRef<HTMLDivElement>(null);

  const {
    products: contextProducts,
    setActiveProduct,
    filter,
  } = useMarketplace();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // Use the products prop if provided, otherwise use products from context
  const sourceProducts = propProducts || contextProducts;

  // Memoized filtering and sorting logic
  const processedProducts = useMemo(() => {
    let filtered = [...sourceProducts];

    // Apply marketplace context filters
    if (filter) {
      // Category filter
      if (filter.category && filter.category !== "all") {
        filtered = filtered.filter(
          (product) => product.category === filter.category,
        );
      }

      // Price range filter
      if (filter.minPrice !== undefined || filter.maxPrice !== undefined) {
        filtered = filtered.filter((product) => {
          const price = product.discountPrice || product.price;
          const minPrice = filter.minPrice ?? 0;
          const maxPrice = filter.maxPrice ?? Infinity;
          return price >= minPrice && price <= maxPrice;
        });
      }

      // Rating filter
      if (filter.minRating) {
        filtered = filtered.filter(
          (product) => product.rating >= filter.minRating!,
        );
      }

      // Brand filter
      if (filter.brands && filter.brands.length > 0) {
        filtered = filtered.filter((product) =>
          filter.brands!.includes(product.brand || ""),
        );
      }

      // Tags filter
      if (filter.tags && filter.tags.length > 0) {
        filtered = filtered.filter((product) =>
          product.tags?.some((tag) => filter.tags!.includes(tag)),
        );
      }

      // Stock filter
      if (filter.inStock) {
        filtered = filtered.filter((product) => product.inStock);
      }

      // Free shipping filter
      if (filter.freeShipping) {
        filtered = filtered.filter(
          (product) => product.shippingInfo?.freeShipping,
        );
      }

      // On sale filter
      if (filter.onSale) {
        filtered = filtered.filter((product) => product.discountPrice);
      }
    }

    // Apply category filter from props
    if (category !== "all") {
      filtered = filtered.filter((product) => product.category === category);
    }

    // Apply search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (product) =>
          product.name.toLowerCase().includes(query) ||
          product.description.toLowerCase().includes(query) ||
          product.category.toLowerCase().includes(query) ||
          product.brand?.toLowerCase().includes(query) ||
          (product.tags &&
            product.tags.some((tag) => tag.toLowerCase().includes(query))),
      );
    }

    // Sort products
    const sortedProducts = [...filtered];
    switch (sortBy) {
      case "relevance":
        // Keep original order for relevance
        break;
      case "newest":
      case "recent":
        sortedProducts.sort((a, b) => {
          const aTime = new Date(a.createdAt).getTime();
          const bTime = new Date(b.createdAt).getTime();
          return sortOrder === "asc" ? aTime - bTime : bTime - aTime;
        });
        break;
      case "popularity":
      case "popular":
        sortedProducts.sort((a, b) => {
          const aScore = a.rating * (a.reviewCount || 1);
          const bScore = b.rating * (b.reviewCount || 1);
          return sortOrder === "asc" ? aScore - bScore : bScore - aScore;
        });
        break;
      case "price":
        sortedProducts.sort((a, b) => {
          const aPrice = a.discountPrice || a.price;
          const bPrice = b.discountPrice || b.price;
          return sortOrder === "asc" ? aPrice - bPrice : bPrice - aPrice;
        });
        break;
      case "rating":
        sortedProducts.sort((a, b) => {
          return sortOrder === "asc"
            ? a.rating - b.rating
            : b.rating - a.rating;
        });
        break;
      case "discount":
        sortedProducts.sort((a, b) => {
          const aDiscount = a.discountPrice
            ? ((a.price - a.discountPrice) / a.price) * 100
            : 0;
          const bDiscount = b.discountPrice
            ? ((b.price - b.discountPrice) / b.price) * 100
            : 0;
          return sortOrder === "asc"
            ? aDiscount - bDiscount
            : bDiscount - aDiscount;
        });
        break;
    }

    return sortedProducts;
  }, [sourceProducts, category, searchQuery, sortBy, sortOrder, filter]);

  // Load more products with pagination
  const loadMoreProducts = useCallback(() => {
    if (isLoadingMore || !hasMoreProducts) return;

    setIsLoadingMore(true);

    // Simulate network delay
    setTimeout(() => {
      const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
      const endIndex = startIndex + ITEMS_PER_PAGE;
      const newProducts = processedProducts.slice(startIndex, endIndex);

      if (newProducts.length === 0) {
        setHasMoreProducts(false);
      } else {
        setDisplayedProducts((prev) => [...prev, ...newProducts]);
        setCurrentPage((prev) => prev + 1);

        // Check if there are more products
        if (endIndex >= processedProducts.length) {
          setHasMoreProducts(false);
        }
      }

      setIsLoadingMore(false);
    }, 500);
  }, [currentPage, processedProducts, isLoadingMore, hasMoreProducts]);

  // Intersection Observer for infinite scroll
  useEffect(() => {
    if (observerRef.current) {
      observerRef.current.disconnect();
    }

    observerRef.current = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMoreProducts && !isLoadingMore) {
          loadMoreProducts();
        }
      },
      { threshold: 0.1 },
    );

    if (loadMoreRef.current) {
      observerRef.current.observe(loadMoreRef.current);
    }

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [loadMoreProducts, hasMoreProducts, isLoadingMore]);

  // Reset pagination when filters change
  useEffect(() => {
    setLoading(true);
    setCurrentPage(1);
    setHasMoreProducts(true);

    // Load initial products
    const initialProducts = processedProducts.slice(0, ITEMS_PER_PAGE);
    setDisplayedProducts(initialProducts);
    setFilteredProducts(processedProducts);

    if (initialProducts.length < ITEMS_PER_PAGE) {
      setHasMoreProducts(false);
    }

    // Simulate loading delay
    setTimeout(() => {
      setLoading(false);
    }, 300);
  }, [processedProducts]);

  const handleViewProduct = useCallback(
    (product: Product) => {
      setActiveProduct(product);
      navigate(`/app/marketplace/product/${product.id}`);
    },
    [setActiveProduct, navigate],
  );

  const handleMessageSeller = useCallback(
    (sellerId: string, productId: string) => {
      if (!isAuthenticated) {
        navigate("/auth");
        return;
      }
      navigate("/app/chat");
    },
    [isAuthenticated, navigate],
  );

  // Memoized grid layout class
  const gridClass = useMemo(() => {
    if (viewMode === "list") {
      return "flex flex-col gap-4";
    }
    return "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4";
  }, [viewMode]);

  if (loading) {
    return (
      <div className="space-y-4">
        {/* View mode toggle skeleton */}
        <div className="flex justify-between items-center">
          <Skeleton className="h-6 w-32" />
          <Skeleton className="h-9 w-20" />
        </div>

        {/* Product grid skeleton */}
        <div className={gridClass}>
          {Array.from({ length: 8 }).map((_, index) => (
            <Card key={index} className="overflow-hidden">
              <div className="pt-[100%] relative">
                <Skeleton className="absolute inset-0" />
              </div>
              <div className="p-4 space-y-3">
                <Skeleton className="h-4 w-1/3" />
                <Skeleton className="h-5 w-full" />
                <Skeleton className="h-4 w-1/2" />
                <div className="flex justify-between">
                  <Skeleton className="h-5 w-1/4" />
                  <Skeleton className="h-9 w-1/3" />
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (filteredProducts.length === 0) {
    return (
      <div className="text-center py-16 border rounded-lg bg-muted/20">
        <div className="max-w-md mx-auto px-4">
          <div className="w-16 h-16 mx-auto mb-4 bg-muted rounded-full flex items-center justify-center">
            <Package className="h-8 w-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-semibold mb-2">No products found</h3>
          <p className="text-muted-foreground mb-6">
            Try adjusting your search criteria or browse different categories
          </p>
          <div className="flex flex-col sm:flex-row gap-2 justify-center">
            <Button
              variant="outline"
              onClick={() => navigate("/app/marketplace")}
            >
              Browse all products
            </Button>
            <Button
              variant="ghost"
              onClick={() => {
                // Clear search and filters
                window.location.reload();
              }}
            >
              Clear filters
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6" ref={containerRef}>
      {/* Results header with view toggle */}
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-4">
          <div className="text-sm text-muted-foreground">
            {filteredProducts.length} products found
          </div>
          {filteredProducts.length > displayedProducts.length && (
            <Badge variant="secondary" className="text-xs">
              Showing {displayedProducts.length} of {filteredProducts.length}
            </Badge>
          )}
        </div>

        {onViewModeChange && (
          <div className="flex items-center border rounded-md">
            <Button
              variant={viewMode === "grid" ? "default" : "ghost"}
              size="sm"
              className="rounded-r-none border-r"
              onClick={() => onViewModeChange("grid")}
            >
              <Grid className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === "list" ? "default" : "ghost"}
              size="sm"
              className="rounded-l-none"
              onClick={() => onViewModeChange("list")}
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>

      {/* Product grid */}
      <div className={gridClass}>
        {displayedProducts.map((product, index) => (
          <EnhancedProductCard
            key={`${product.id}-${index}`}
            product={product}
            onAddToCart={onAddToCart}
            onAddToWishlist={onAddToWishlist}
            onViewProduct={handleViewProduct}
            onMessageSeller={handleMessageSeller}
            showSellerInfo={true}
            viewMode={viewMode}
            loading="lazy"
            priority={index < 4} // Priority load for first 4 items
          />
        ))}
      </div>

      {/* Loading more indicator */}
      {hasMoreProducts && (
        <div ref={loadMoreRef} className="py-8 flex justify-center">
          {isLoadingMore ? (
            <div className="flex items-center gap-2 text-muted-foreground">
              <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
              Loading more products...
            </div>
          ) : (
            <Button
              variant="outline"
              onClick={loadMoreProducts}
              className="min-w-32"
            >
              Load More
            </Button>
          )}
        </div>
      )}

      {/* End of results indicator */}
      {!hasMoreProducts && displayedProducts.length > ITEMS_PER_PAGE && (
        <div className="text-center py-8 text-muted-foreground">
          <div className="inline-flex items-center gap-2">
            <div className="w-12 h-px bg-border" />
            <span className="text-sm">You've seen all products</span>
            <div className="w-12 h-px bg-border" />
          </div>
        </div>
      )}
    </div>
  );
};

export default EnhancedProductGrid;
