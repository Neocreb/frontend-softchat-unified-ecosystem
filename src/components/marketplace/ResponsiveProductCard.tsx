import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  ResponsiveDialog,
  ResponsiveDialogContent,
  ResponsiveDialogHeader,
  ResponsiveDialogTitle,
  ResponsiveDialogScrollArea,
} from "@/components/ui/responsive-dialog";
import {
  Heart,
  Star,
  ShoppingCart,
  Eye,
  Share,
  MapPin,
  Calendar,
  User,
  Shield,
  Truck,
  RotateCcw,
} from "lucide-react";

interface Product {
  id: string;
  title: string;
  price: number;
  originalPrice?: number;
  image: string;
  images?: string[];
  rating: number;
  reviews: number;
  seller: {
    name: string;
    avatar?: string;
    rating: number;
    isVerified: boolean;
  };
  category: string;
  condition: "New" | "Used" | "Refurbished";
  location: string;
  description: string;
  specifications?: Record<string, string>;
  shipping: {
    cost: number;
    estimatedDays: string;
    freeShipping?: boolean;
  };
  returnPolicy: string;
  inStock: boolean;
  stockCount?: number;
  isLiked?: boolean;
  discount?: number;
}

interface ResponsiveProductCardProps {
  product: Product;
  onAddToCart?: (product: Product) => void;
  onToggleFavorite?: (product: Product) => void;
  className?: string;
}

const ResponsiveProductCard: React.FC<ResponsiveProductCardProps> = ({
  product,
  onAddToCart,
  onToggleFavorite,
  className = "",
}) => {
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isLiked, setIsLiked] = useState(product.isLiked || false);

  const handleToggleFavorite = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsLiked(!isLiked);
    onToggleFavorite?.(product);
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    onAddToCart?.(product);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(price);
  };

  const getDiscountPercentage = () => {
    if (!product.originalPrice) return null;
    return Math.round(
      ((product.originalPrice - product.price) / product.originalPrice) * 100,
    );
  };

  const productImages = product.images || [product.image];

  return (
    <>
      <Card
        className={`group cursor-pointer transition-all duration-200 hover:shadow-md hover:scale-105 mobile-card-spacing ${className}`}
        onClick={() => setIsDetailOpen(true)}
      >
        <CardContent className="p-2 sm:p-4">
          {/* Image Section */}
          <div className="relative aspect-square mb-2 sm:mb-3 overflow-hidden rounded-lg bg-gray-100">
            <img
              src={product.image}
              alt={product.title}
              className="w-full h-full object-cover transition-transform duration-200 group-hover:scale-110"
            />

            {/* Discount Badge */}
            {getDiscountPercentage() && (
              <Badge
                variant="destructive"
                className="absolute top-2 left-2 text-xs font-bold"
              >
                -{getDiscountPercentage()}%
              </Badge>
            )}

            {/* Condition Badge */}
            <Badge
              variant={product.condition === "New" ? "default" : "secondary"}
              className="absolute top-2 right-2 text-xs"
            >
              {product.condition}
            </Badge>

            {/* Favorite Button */}
            <Button
              variant="ghost"
              size="sm"
              className="absolute bottom-2 right-2 h-8 w-8 p-0 bg-white/80 hover:bg-white touch-target"
              onClick={handleToggleFavorite}
            >
              <Heart
                className={`h-4 w-4 ${
                  isLiked ? "fill-red-500 text-red-500" : "text-gray-600"
                }`}
              />
            </Button>
          </div>

          {/* Product Info */}
          <div className="space-y-1 sm:space-y-2">
            {/* Title */}
            <h3 className="font-medium text-sm sm:text-base line-clamp-2 text-responsive">
              {product.title}
            </h3>

            {/* Rating */}
            <div className="flex items-center gap-1">
              <div className="flex items-center">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`h-3 w-3 ${
                      star <= product.rating
                        ? "fill-yellow-400 text-yellow-400"
                        : "text-gray-300"
                    }`}
                  />
                ))}
              </div>
              <span className="text-xs text-muted-foreground">
                ({product.reviews})
              </span>
            </div>

            {/* Price */}
            <div className="flex items-center gap-2">
              <span className="font-bold text-sm sm:text-base">
                {formatPrice(product.price)}
              </span>
              {product.originalPrice && (
                <span className="text-xs text-muted-foreground line-through">
                  {formatPrice(product.originalPrice)}
                </span>
              )}
            </div>

            {/* Seller & Location */}
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span className="truncate">{product.seller.name}</span>
              <span className="flex items-center gap-1 flex-shrink-0">
                <MapPin className="h-3 w-3" />
                {product.location}
              </span>
            </div>

            {/* Add to Cart Button */}
            <Button
              className="w-full mt-2 mobile-button-size"
              onClick={handleAddToCart}
              disabled={!product.inStock}
            >
              <ShoppingCart className="h-4 w-4 mr-2" />
              {product.inStock ? "Add to Cart" : "Out of Stock"}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Product Detail Modal */}
      <ResponsiveDialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
        <ResponsiveDialogContent
          size="xl"
          mobileFullScreen={true}
          className="p-0 gap-0"
        >
          <ResponsiveDialogHeader className="p-4 sm:p-6 pb-0">
            <ResponsiveDialogTitle className="text-lg sm:text-xl text-left">
              {product.title}
            </ResponsiveDialogTitle>
          </ResponsiveDialogHeader>

          <ResponsiveDialogScrollArea className="flex-1 p-4 sm:p-6">
            <div className="space-y-4 sm:space-y-6">
              {/* Image Gallery */}
              <div className="space-y-3">
                <div className="aspect-square overflow-hidden rounded-lg bg-gray-100">
                  <img
                    src={productImages[currentImageIndex]}
                    alt={product.title}
                    className="w-full h-full object-cover"
                  />
                </div>

                {productImages.length > 1 && (
                  <div className="flex gap-2 overflow-x-auto">
                    {productImages.map((image, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentImageIndex(index)}
                        className={`flex-shrink-0 w-16 h-16 sm:w-20 sm:h-20 rounded-lg overflow-hidden border-2 transition-colors ${
                          index === currentImageIndex
                            ? "border-blue-500"
                            : "border-gray-200"
                        }`}
                      >
                        <img
                          src={image}
                          alt={`${product.title} ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Price & Actions */}
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-2xl sm:text-3xl font-bold">
                      {formatPrice(product.price)}
                    </span>
                    {product.originalPrice && (
                      <span className="text-lg text-muted-foreground line-through">
                        {formatPrice(product.originalPrice)}
                      </span>
                    )}
                  </div>
                  {getDiscountPercentage() && (
                    <Badge variant="destructive" className="mt-1">
                      Save {getDiscountPercentage()}%
                    </Badge>
                  )}
                </div>

                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleToggleFavorite}
                  >
                    <Heart
                      className={`h-4 w-4 ${
                        isLiked ? "fill-red-500 text-red-500" : ""
                      }`}
                    />
                  </Button>
                  <Button variant="outline" size="sm">
                    <Share className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Product Details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Condition:</span>
                    <Badge
                      variant={
                        product.condition === "New" ? "default" : "secondary"
                      }
                    >
                      {product.condition}
                    </Badge>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Category:</span>
                    <span className="font-medium">{product.category}</span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Stock:</span>
                    <span
                      className={`font-medium ${product.inStock ? "text-green-600" : "text-red-600"}`}
                    >
                      {product.inStock
                        ? `${product.stockCount || "In"} Stock`
                        : "Out of Stock"}
                    </span>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Shipping:</span>
                    <span className="font-medium">
                      {product.shipping.freeShipping
                        ? "Free"
                        : formatPrice(product.shipping.cost)}
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Delivery:</span>
                    <span className="font-medium">
                      {product.shipping.estimatedDays}
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Returns:</span>
                    <span className="font-medium">{product.returnPolicy}</span>
                  </div>
                </div>
              </div>

              {/* Seller Info */}
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    {product.seller.avatar ? (
                      <img
                        src={product.seller.avatar}
                        alt={product.seller.name}
                        className="w-10 h-10 rounded-full"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                        <User className="h-5 w-5 text-gray-500" />
                      </div>
                    )}

                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">
                          {product.seller.name}
                        </span>
                        {product.seller.isVerified && (
                          <Shield className="h-4 w-4 text-blue-500" />
                        )}
                      </div>

                      <div className="flex items-center gap-1">
                        <div className="flex items-center">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                              key={star}
                              className={`h-3 w-3 ${
                                star <= product.seller.rating
                                  ? "fill-yellow-400 text-yellow-400"
                                  : "text-gray-300"
                              }`}
                            />
                          ))}
                        </div>
                        <span className="text-xs text-muted-foreground">
                          {product.seller.rating}/5
                        </span>
                      </div>
                    </div>

                    <Button variant="outline" size="sm">
                      View Store
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Description */}
              <div>
                <h4 className="font-semibold mb-2">Description</h4>
                <p className="text-sm text-muted-foreground leading-relaxed text-responsive">
                  {product.description}
                </p>
              </div>

              {/* Specifications */}
              {product.specifications && (
                <div>
                  <h4 className="font-semibold mb-3">Specifications</h4>
                  <div className="grid grid-cols-1 gap-2 text-sm">
                    {Object.entries(product.specifications).map(
                      ([key, value]) => (
                        <div
                          key={key}
                          className="flex justify-between py-2 border-b border-gray-100 last:border-b-0"
                        >
                          <span className="text-muted-foreground capitalize">
                            {key}:
                          </span>
                          <span className="font-medium text-right">
                            {value}
                          </span>
                        </div>
                      ),
                    )}
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-4 border-t">
                <Button
                  variant="outline"
                  className="w-full mobile-button-size"
                  onClick={() => setIsDetailOpen(false)}
                >
                  <Eye className="h-4 w-4 mr-2" />
                  Continue Browsing
                </Button>
                <Button
                  className="w-full mobile-button-size"
                  onClick={(e) => {
                    handleAddToCart(e);
                    setIsDetailOpen(false);
                  }}
                  disabled={!product.inStock}
                >
                  <ShoppingCart className="h-4 w-4 mr-2" />
                  {product.inStock ? "Add to Cart" : "Out of Stock"}
                </Button>
              </div>
            </div>
          </ResponsiveDialogScrollArea>
        </ResponsiveDialogContent>
      </ResponsiveDialog>
    </>
  );
};

export default ResponsiveProductCard;
