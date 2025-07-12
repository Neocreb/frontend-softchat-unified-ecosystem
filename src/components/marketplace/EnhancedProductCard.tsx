import { useState } from "react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Heart,
  ShoppingCart,
  Eye,
  Star,
  Truck,
  Shield,
  Zap,
  MapPin,
  Users,
  Clock,
  Award,
  ArrowRight,
} from "lucide-react";
import { Product } from "@/types/marketplace";
import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface EnhancedProductCardProps {
  product: Product;
  onAddToCart: (productId: string) => void;
  onAddToWishlist: (productId: string) => void;
  onViewProduct: (product: Product) => void;
  onMessageSeller?: (sellerId: string, productId: string) => void;
  inWishlist?: boolean;
  inCart?: boolean;
  viewMode?: "grid" | "list";
  view?: "grid" | "list"; // Deprecated, use viewMode
  showSellerInfo?: boolean;
  className?: string;
  loading?: "eager" | "lazy";
  priority?: boolean;
}

export default function EnhancedProductCard({
  product,
  onAddToCart,
  onAddToWishlist,
  onViewProduct,
  inWishlist = false,
  inCart = false,
  view = "grid",
  showSellerInfo = true,
  className,
}: EnhancedProductCardProps) {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [isWishlisted, setIsWishlisted] = useState(inWishlist);

  const discountPercentage = product.discountPrice
    ? Math.round(
        ((product.price - product.discountPrice) / product.price) * 100,
      )
    : 0;

  const handleAddToWishlist = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsWishlisted(!isWishlisted);
    onAddToWishlist(product.id);
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    onAddToCart(product.id);
  };

  const handleViewProduct = () => {
    onViewProduct(product.id);
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
          "h-3 w-3",
          i < Math.floor(rating)
            ? "fill-yellow-400 text-yellow-400"
            : i < rating
              ? "fill-yellow-200 text-yellow-400"
              : "text-gray-300",
        )}
      />
    ));
  };

  if (view === "list") {
    return (
      <Card
        className={cn(
          "hover:shadow-lg transition-all duration-300 cursor-pointer border border-gray-200 hover:border-gray-300",
          className,
        )}
        onClick={handleViewProduct}
      >
        <CardContent className="p-4">
          <div className="flex gap-4">
            {/* Product Image */}
            <div className="relative w-32 h-32 flex-shrink-0 rounded-lg overflow-hidden bg-gray-100">
              {!imageLoaded && !imageError && (
                <div className="absolute inset-0 bg-gray-200 animate-pulse" />
              )}
              {!imageError ? (
                <img
                  src={product.image}
                  alt={product.name}
                  className={cn(
                    "w-full h-full object-cover transition-opacity duration-300",
                    imageLoaded ? "opacity-100" : "opacity-0",
                  )}
                  onLoad={() => setImageLoaded(true)}
                  onError={() => setImageError(true)}
                />
              ) : (
                <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                  <span className="text-gray-400 text-sm">No image</span>
                </div>
              )}

              {/* Badges */}
              <div className="absolute top-2 left-2 flex flex-col gap-1">
                {product.isNew && (
                  <Badge
                    variant="secondary"
                    className="text-xs bg-green-100 text-green-800"
                  >
                    New
                  </Badge>
                )}
                {product.isSponsored && (
                  <Badge
                    variant="secondary"
                    className="text-xs bg-amber-100 text-amber-800"
                  >
                    Sponsored
                  </Badge>
                )}
                {discountPercentage > 0 && (
                  <Badge variant="destructive" className="text-xs">
                    -{discountPercentage}%
                  </Badge>
                )}
              </div>
            </div>

            {/* Product Info */}
            <div className="flex-1 flex flex-col justify-between">
              <div>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <h3 className="font-semibold text-lg line-clamp-2 leading-tight">
                    {product.name}
                  </h3>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleAddToWishlist}
                    className="flex-shrink-0 p-2"
                  >
                    <Heart
                      className={cn(
                        "h-4 w-4 transition-colors",
                        isWishlisted
                          ? "fill-red-500 text-red-500"
                          : "text-gray-500 hover:text-red-500",
                      )}
                    />
                  </Button>
                </div>

                <p className="text-gray-600 text-sm line-clamp-2 mb-3">
                  {product.description}
                </p>

                {/* Price and Rating */}
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-xl text-primary">
                      {formatPrice(product.discountPrice || product.price)}
                    </span>
                    {product.discountPrice && (
                      <span className="text-gray-500 line-through text-sm">
                        {formatPrice(product.price)}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-1">
                    <div className="flex items-center">
                      {renderStars(product.rating)}
                    </div>
                    <span className="text-sm text-gray-600 ml-1">
                      {product.rating} ({product.reviewCount || 0})
                    </span>
                  </div>
                </div>

                {/* Features */}
                <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                  {product.shippingInfo?.freeShipping && (
                    <div className="flex items-center gap-1">
                      <Truck className="h-4 w-4" />
                      <span>Free Shipping</span>
                    </div>
                  )}
                  {product.condition === "new" && (
                    <div className="flex items-center gap-1">
                      <Shield className="h-4 w-4" />
                      <span>New</span>
                    </div>
                  )}
                  {product.shippingInfo?.expressAvailable && (
                    <div className="flex items-center gap-1">
                      <Zap className="h-4 w-4" />
                      <span>Express</span>
                    </div>
                  )}
                </div>

                {/* Seller Info */}
                {showSellerInfo && (
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <img
                      src={product.sellerAvatar}
                      alt={product.sellerName}
                      className="w-5 h-5 rounded-full"
                    />
                    <span>{product.sellerName}</span>
                    {product.sellerVerified && (
                      <Award className="h-4 w-4 text-blue-500" />
                    )}
                    {product.sellerRating && (
                      <span className="flex items-center gap-1">
                        <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                        {product.sellerRating}
                      </span>
                    )}
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 mt-4">
                <Button
                  onClick={handleAddToCart}
                  disabled={!product.inStock || inCart}
                  className="flex-1"
                >
                  {!product.inStock ? (
                    "Out of Stock"
                  ) : inCart ? (
                    "In Cart"
                  ) : (
                    <>
                      <ShoppingCart className="h-4 w-4 mr-2" />
                      Add to Cart
                    </>
                  )}
                </Button>
                <Button variant="outline" onClick={handleViewProduct}>
                  <Eye className="h-4 w-4 mr-2" />
                  View
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Grid view
  return (
    <TooltipProvider>
      <Card
        className={cn(
          "group hover:shadow-xl transition-all duration-300 cursor-pointer border border-gray-200 hover:border-gray-300 overflow-hidden",
          className,
        )}
        onClick={handleViewProduct}
      >
        <div className="relative">
          {/* Product Image */}
          <div className="relative h-48 w-full overflow-hidden bg-gray-100">
            {!imageLoaded && !imageError && (
              <div className="absolute inset-0 bg-gray-200 animate-pulse" />
            )}
            {!imageError ? (
              <img
                src={product.image}
                alt={product.name}
                className={cn(
                  "w-full h-full object-cover transition-all duration-300 group-hover:scale-105",
                  imageLoaded ? "opacity-100" : "opacity-0",
                )}
                onLoad={() => setImageLoaded(true)}
                onError={() => setImageError(true)}
              />
            ) : (
              <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                <span className="text-gray-400 text-sm">No image</span>
              </div>
            )}

            {/* Hover overlay */}
            <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

            {/* Quick action buttons */}
            <div className="absolute top-2 right-2 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={handleAddToWishlist}
                    className="p-2 bg-white/90 backdrop-blur-sm"
                  >
                    <Heart
                      className={cn(
                        "h-4 w-4 transition-colors",
                        isWishlisted
                          ? "fill-red-500 text-red-500"
                          : "text-gray-700",
                      )}
                    />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  {isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
                </TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleViewProduct();
                    }}
                    className="p-2 bg-white/90 backdrop-blur-sm"
                  >
                    <Eye className="h-4 w-4 text-gray-700" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Quick view</TooltipContent>
              </Tooltip>
            </div>

            {/* Badges */}
            <div className="absolute top-2 left-2 flex flex-col gap-1">
              {product.isNew && (
                <Badge
                  variant="secondary"
                  className="text-xs bg-green-100 text-green-800"
                >
                  New
                </Badge>
              )}
              {product.isSponsored && (
                <Badge
                  variant="secondary"
                  className="text-xs bg-amber-100 text-amber-800"
                >
                  <Zap className="h-3 w-3 mr-1" />
                  Sponsored
                </Badge>
              )}
              {discountPercentage > 0 && (
                <Badge variant="destructive" className="text-xs font-bold">
                  -{discountPercentage}%
                </Badge>
              )}
            </div>

            {/* Stock indicator */}
            {!product.inStock && (
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                <Badge variant="destructive" className="text-sm">
                  Out of Stock
                </Badge>
              </div>
            )}
          </div>
        </div>

        <CardContent className="p-4">
          {/* Product Info */}
          <div className="space-y-2">
            <h3 className="font-semibold text-base line-clamp-2 leading-tight group-hover:text-primary transition-colors">
              {product.name}
            </h3>

            {/* Price */}
            <div className="flex items-center gap-2">
              <span className="font-bold text-lg text-primary">
                {formatPrice(product.discountPrice || product.price)}
              </span>
              {product.discountPrice && (
                <span className="text-gray-500 line-through text-sm">
                  {formatPrice(product.price)}
                </span>
              )}
            </div>

            {/* Rating */}
            <div className="flex items-center gap-2">
              <div className="flex items-center">
                {renderStars(product.rating)}
              </div>
              <span className="text-sm text-gray-600">
                {product.rating} ({product.reviewCount || 0})
              </span>
            </div>

            {/* Features */}
            <div className="flex items-center gap-3 text-xs text-gray-600">
              {product.shippingInfo?.freeShipping && (
                <div className="flex items-center gap-1">
                  <Truck className="h-3 w-3" />
                  <span>Free Ship</span>
                </div>
              )}
              {product.shippingInfo?.expressAvailable && (
                <div className="flex items-center gap-1">
                  <Zap className="h-3 w-3" />
                  <span>Express</span>
                </div>
              )}
              {product.condition === "new" && (
                <div className="flex items-center gap-1">
                  <Shield className="h-3 w-3" />
                  <span>New</span>
                </div>
              )}
            </div>

            {/* Seller Info */}
            {showSellerInfo && (
              <div className="flex items-center gap-2 text-xs text-gray-600 pt-1">
                <img
                  src={product.sellerAvatar}
                  alt={product.sellerName}
                  className="w-4 h-4 rounded-full"
                />
                <span className="truncate">{product.sellerName}</span>
                {product.sellerVerified && (
                  <Award className="h-3 w-3 text-blue-500 flex-shrink-0" />
                )}
              </div>
            )}
          </div>
        </CardContent>

        <CardFooter className="p-4 pt-0">
          <Button
            onClick={handleAddToCart}
            disabled={!product.inStock || inCart}
            className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors"
            variant={inCart ? "outline" : "default"}
          >
            {!product.inStock ? (
              "Out of Stock"
            ) : inCart ? (
              "In Cart"
            ) : (
              <>
                <ShoppingCart className="h-4 w-4 mr-2" />
                Add to Cart
              </>
            )}
          </Button>
        </CardFooter>
      </Card>
    </TooltipProvider>
  );
}
