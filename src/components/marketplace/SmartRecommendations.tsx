import React, { useState, useEffect } from "react";
import {
  Sparkles,
  TrendingUp,
  Clock,
  Users,
  Heart,
  ShoppingCart,
  Star,
  Eye,
  ArrowRight,
  Zap,
  Target,
  Brain,
  RefreshCw,
  Package,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { ProductImage } from "@/components/ui/image-placeholder";

interface Product {
  id: string;
  name: string;
  image?: string;
  originalPrice: number;
  salePrice?: number;
  rating: number;
  reviews: number;
  category: string;
  tags: string[];
  viewCount?: number;
  soldCount?: number;
}

interface RecommendationReason {
  type:
    | "trending"
    | "similar_users"
    | "recently_viewed"
    | "category_based"
    | "price_drop"
    | "high_rated"
    | "personalized";
  text: string;
  confidence: number;
}

interface RecommendedProduct extends Product {
  reason: RecommendationReason;
  score: number;
}

interface SmartRecommendationsProps {
  userId?: string;
  currentProduct?: Product;
  recentlyViewed?: Product[];
  userPreferences?: {
    categories: string[];
    priceRange: [number, number];
    brands: string[];
  };
  onProductClick?: (product: Product) => void;
  onAddToCart?: (productId: string) => void;
  onAddToWishlist?: (productId: string) => void;
  onQuickView?: (product: Product) => void;
  className?: string;
  maxItems?: number;
  enableRealTimeUpdates?: boolean;
}

const SmartRecommendations: React.FC<SmartRecommendationsProps> = ({
  userId,
  currentProduct,
  recentlyViewed = [],
  userPreferences,
  onProductClick,
  onAddToCart,
  onAddToWishlist,
  onQuickView,
  className,
  maxItems = 8,
  enableRealTimeUpdates = false,
}) => {
  const [recommendations, setRecommendations] = useState<RecommendedProduct[]>([]);
  const [activeTab, setActiveTab] = useState("trending");
  const [isLoading, setIsLoading] = useState(false);

  // Fetch recommendations from API
  const fetchRecommendations = async () => {
    try {
      setIsLoading(true);
      
      // In production, this would make an API call
      const response = await fetch('/api/marketplace/recommendations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId,
          currentProduct,
          recentlyViewed,
          userPreferences,
          maxItems,
          type: activeTab,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setRecommendations(data.recommendations || []);
      } else {
        // For now, show empty state in production
        setRecommendations([]);
      }
    } catch (error) {
      console.error('Error fetching recommendations:', error);
      setRecommendations([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRecommendations();
  }, [activeTab, userId, currentProduct]);

  useEffect(() => {
    if (enableRealTimeUpdates) {
      const interval = setInterval(fetchRecommendations, 30000); // Refresh every 30 seconds
      return () => clearInterval(interval);
    }
  }, [enableRealTimeUpdates]);

  const getReasonIcon = (type: RecommendationReason['type']) => {
    const icons = {
      trending: TrendingUp,
      similar_users: Users,
      recently_viewed: Clock,
      category_based: Target,
      price_drop: Zap,
      high_rated: Star,
      personalized: Brain,
    };
    return icons[type] || Sparkles;
  };

  const getReasonColor = (type: RecommendationReason['type']) => {
    const colors = {
      trending: "text-orange-500",
      similar_users: "text-blue-500",
      recently_viewed: "text-gray-500",
      category_based: "text-green-500",
      price_drop: "text-red-500",
      high_rated: "text-yellow-500",
      personalized: "text-purple-500",
    };
    return colors[type] || "text-gray-500";
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(price);
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-3 h-3 ${
          i < Math.floor(rating)
            ? "text-yellow-400 fill-yellow-400"
            : "text-gray-300"
        }`}
      />
    ));
  };

  const EmptyState = ({ type }: { type: string }) => (
    <div className="text-center py-12">
      <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
        <Sparkles className="w-8 h-8 text-gray-400" />
      </div>
      <h3 className="text-lg font-semibold text-gray-900 mb-2">
        No {type} recommendations yet
      </h3>
      <p className="text-gray-600 text-sm mb-4">
        Check back soon as we learn more about your preferences!
      </p>
      <Button variant="outline" size="sm" onClick={fetchRecommendations}>
        <RefreshCw className="w-4 h-4 mr-2" />
        Refresh
      </Button>
    </div>
  );

  const ProductCard = ({ product }: { product: RecommendedProduct }) => {
    const ReasonIcon = getReasonIcon(product.reason.type);
    const discount = product.salePrice
      ? Math.round(((product.originalPrice - product.salePrice) / product.originalPrice) * 100)
      : 0;

    return (
      <div className="group bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-300">
        <div className="relative aspect-square bg-gray-50">
          {/* Product Image */}
          <ProductImage
            src={product.image}
            alt={product.name}
            className="w-full h-full"
            fallback={
              <div className="w-full h-full flex items-center justify-center">
                <Package className="w-16 h-16 text-gray-300" />
              </div>
            }
          />

          {/* Discount Badge */}
          {discount > 0 && (
            <div className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded text-xs font-medium">
              -{discount}%
            </div>
          )}

          {/* Recommendation Reason */}
          <div className="absolute top-2 right-2">
            <div className={cn(
              "p-1.5 rounded-full bg-white shadow-sm",
              getReasonColor(product.reason.type)
            )}>
              <ReasonIcon className="w-3 h-3" />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="absolute bottom-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <Button
              size="sm"
              variant="outline"
              className="h-8 w-8 p-0 bg-white"
              onClick={(e) => {
                e.stopPropagation();
                onAddToWishlist?.(product.id);
              }}
            >
              <Heart className="w-3 h-3" />
            </Button>
            <Button
              size="sm"
              variant="outline"
              className="h-8 w-8 p-0 bg-white"
              onClick={(e) => {
                e.stopPropagation();
                onQuickView?.(product);
              }}
            >
              <Eye className="w-3 h-3" />
            </Button>
          </div>
        </div>

        <div className="p-3">
          <h3 className="font-medium text-sm text-gray-900 mb-1 line-clamp-2 group-hover:text-blue-600 transition-colors">
            {product.name}
          </h3>

          <div className="flex items-center gap-1 mb-2">
            {renderStars(product.rating)}
            <span className="text-xs text-gray-500 ml-1">({product.reviews})</span>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {product.salePrice ? (
                <>
                  <span className="font-semibold text-green-600 text-sm">
                    {formatPrice(product.salePrice)}
                  </span>
                  <span className="text-xs text-gray-500 line-through">
                    {formatPrice(product.originalPrice)}
                  </span>
                </>
              ) : (
                <span className="font-semibold text-gray-900 text-sm">
                  {formatPrice(product.originalPrice)}
                </span>
              )}
            </div>
            <Button
              size="sm"
              variant="outline"
              className="h-7 px-2"
              onClick={(e) => {
                e.stopPropagation();
                onAddToCart?.(product.id);
              }}
            >
              <ShoppingCart className="w-3 h-3" />
            </Button>
          </div>

          {/* Recommendation Reason */}
          <div className="mt-2 pt-2 border-t border-gray-100">
            <div className="flex items-center gap-1">
              <ReasonIcon className={cn("w-3 h-3", getReasonColor(product.reason.type))} />
              <span className="text-xs text-gray-600">{product.reason.text}</span>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className={cn("w-full", className)}>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-purple-500" />
              <CardTitle>Smart Recommendations</CardTitle>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={fetchRecommendations}
              disabled={isLoading}
            >
              <RefreshCw className={cn("w-4 h-4", isLoading && "animate-spin")} />
            </Button>
          </div>
        </CardHeader>

        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="trending">Trending</TabsTrigger>
              <TabsTrigger value="similar">Similar</TabsTrigger>
              <TabsTrigger value="recent">Recent</TabsTrigger>
              <TabsTrigger value="personalized">For You</TabsTrigger>
            </TabsList>

            <div className="mt-6">
              {isLoading ? (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className="animate-pulse">
                      <div className="aspect-square bg-gray-200 rounded-lg mb-3"></div>
                      <div className="h-4 bg-gray-200 rounded mb-2"></div>
                      <div className="h-3 bg-gray-200 rounded w-3/4"></div>
                    </div>
                  ))}
                </div>
              ) : (
                <>
                  <TabsContent value="trending">
                    {recommendations.length > 0 ? (
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {recommendations.map((product) => (
                          <div
                            key={product.id}
                            onClick={() => onProductClick?.(product)}
                            className="cursor-pointer"
                          >
                            <ProductCard product={product} />
                          </div>
                        ))}
                      </div>
                    ) : (
                      <EmptyState type="trending" />
                    )}
                  </TabsContent>

                  <TabsContent value="similar">
                    <EmptyState type="similar product" />
                  </TabsContent>

                  <TabsContent value="recent">
                    <EmptyState type="recently viewed" />
                  </TabsContent>

                  <TabsContent value="personalized">
                    <EmptyState type="personalized" />
                  </TabsContent>
                </>
              )}
            </div>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default SmartRecommendations;
