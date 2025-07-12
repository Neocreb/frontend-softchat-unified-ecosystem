import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Star,
  ShoppingCart,
  Heart,
  Share2,
  ArrowLeft,
  ArrowRight,
  Truck,
  Shield,
  RotateCcw,
  Zap,
  Eye,
  Plus,
  Minus,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface ProductQuickViewProps {
  product: {
    id: string;
    name: string;
    image: string;
    images?: string[];
    originalPrice: number;
    salePrice?: number;
    discount?: number;
    rating: number;
    reviews: number;
    inStock: boolean;
    description?: string;
    highlights?: string[];
    seller?: {
      name: string;
      rating: number;
      verified: boolean;
    };
    shipping?: {
      freeShipping: boolean;
      estimatedDays: number;
    };
    warranty?: string;
    returnPolicy?: string;
  };
  isOpen: boolean;
  onClose: () => void;
  onAddToCart: (productId: string, quantity: number) => void;
  onAddToWishlist: (productId: string) => void;
  isInWishlist?: boolean;
  isInCart?: boolean;
}

export const ProductQuickView: React.FC<ProductQuickViewProps> = ({
  product,
  isOpen,
  onClose,
  onAddToCart,
  onAddToWishlist,
  isInWishlist = false,
  isInCart = false,
}) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(product.image);

  const images = product.images || [product.image];

  const nextImage = () => {
    const nextIndex = (currentImageIndex + 1) % images.length;
    setCurrentImageIndex(nextIndex);
    setSelectedImage(images[nextIndex]);
  };

  const prevImage = () => {
    const prevIndex = (currentImageIndex - 1 + images.length) % images.length;
    setCurrentImageIndex(prevIndex);
    setSelectedImage(images[prevIndex]);
  };

  const handleAddToCart = () => {
    onAddToCart(product.id, quantity);
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: product.name,
        text: `Check out this amazing product: ${product.name}`,
        url: window.location.href,
      });
    } else {
      // Fallback for desktop
      navigator.clipboard.writeText(window.location.href);
    }
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
          "h-4 w-4",
          i < Math.floor(rating)
            ? "fill-yellow-400 text-yellow-400"
            : "text-gray-300",
        )}
      />
    ));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden p-0">
        <div className="grid grid-cols-1 md:grid-cols-2 h-full">
          {/* Image Section */}
          <div className="relative bg-gray-50 p-6">
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-4 right-4 z-10 bg-white/80 hover:bg-white"
              onClick={onClose}
            >
              <X className="h-4 w-4" />
            </Button>

            {/* Main Image */}
            <div className="relative aspect-square mb-4 overflow-hidden rounded-lg bg-white">
              <img
                src={selectedImage}
                alt={product.name}
                className="w-full h-full object-cover"
              />

              {images.length > 1 && (
                <>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white"
                    onClick={prevImage}
                  >
                    <ArrowLeft className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white"
                    onClick={nextImage}
                  >
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </>
              )}

              {product.discount && (
                <Badge className="absolute top-3 left-3 bg-red-500 text-white">
                  -{product.discount}%
                </Badge>
              )}
            </div>

            {/* Thumbnail Images */}
            {images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto">
                {images.map((img, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      setCurrentImageIndex(index);
                      setSelectedImage(img);
                    }}
                    className={cn(
                      "flex-shrink-0 w-16 h-16 rounded-md overflow-hidden border-2 transition-colors",
                      selectedImage === img
                        ? "border-primary"
                        : "border-gray-200",
                    )}
                  >
                    <img
                      src={img}
                      alt={`${product.name} ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Details Section */}
          <div className="p-6 overflow-y-auto">
            <DialogHeader className="text-left space-y-0 pb-4">
              <DialogTitle className="text-xl font-bold leading-tight">
                {product.name}
              </DialogTitle>
            </DialogHeader>

            {/* Rating and Reviews */}
            <div className="flex items-center gap-2 mb-4">
              <div className="flex items-center">
                {renderStars(product.rating)}
              </div>
              <span className="text-sm text-gray-600">
                {product.rating} ({product.reviews} reviews)
              </span>
            </div>

            {/* Pricing */}
            <div className="flex items-center gap-3 mb-4">
              <span className="text-2xl font-bold text-primary">
                {formatPrice(product.salePrice || product.originalPrice)}
              </span>
              {product.salePrice && (
                <span className="text-lg text-gray-500 line-through">
                  {formatPrice(product.originalPrice)}
                </span>
              )}
              {product.discount && (
                <Badge variant="destructive">Save {product.discount}%</Badge>
              )}
            </div>

            {/* Stock Status */}
            <div className="mb-4">
              {product.inStock ? (
                <Badge variant="default" className="bg-green-500">
                  In Stock
                </Badge>
              ) : (
                <Badge variant="destructive">Out of Stock</Badge>
              )}
            </div>

            {/* Description */}
            {product.description && (
              <div className="mb-4">
                <p className="text-gray-700 text-sm leading-relaxed">
                  {product.description}
                </p>
              </div>
            )}

            {/* Product Highlights */}
            {product.highlights && product.highlights.length > 0 && (
              <div className="mb-4">
                <h4 className="font-semibold mb-2">Key Features:</h4>
                <ul className="space-y-1 text-sm text-gray-700">
                  {product.highlights.map((highlight, index) => (
                    <li key={index} className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 bg-primary rounded-full" />
                      {highlight}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <Separator className="my-4" />

            {/* Seller Info */}
            {product.seller && (
              <div className="mb-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Sold by</p>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{product.seller.name}</span>
                      {product.seller.verified && (
                        <Badge variant="secondary" className="text-xs">
                          <Shield className="h-3 w-3 mr-1" />
                          Verified
                        </Badge>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    {renderStars(product.seller.rating)}
                    <span className="text-sm text-gray-600 ml-1">
                      {product.seller.rating}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Shipping & Policies */}
            <div className="mb-6 space-y-2">
              {product.shipping?.freeShipping && (
                <div className="flex items-center gap-2 text-sm text-green-600">
                  <Truck className="h-4 w-4" />
                  Free shipping • Arrives in {
                    product.shipping.estimatedDays
                  }{" "}
                  days
                </div>
              )}
              {product.warranty && (
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Shield className="h-4 w-4" />
                  {product.warranty} warranty
                </div>
              )}
              {product.returnPolicy && (
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <RotateCcw className="h-4 w-4" />
                  {product.returnPolicy}
                </div>
              )}
            </div>

            {/* Quantity Selector */}
            <div className="mb-6">
              <label className="block text-sm font-medium mb-2">Quantity</label>
              <div className="flex items-center gap-3">
                <div className="flex items-center border rounded-md">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    disabled={quantity <= 1}
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <span className="w-12 text-center">{quantity}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setQuantity(quantity + 1)}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              <Button
                className="w-full"
                size="lg"
                onClick={handleAddToCart}
                disabled={!product.inStock}
              >
                <ShoppingCart className="h-4 w-4 mr-2" />
                {isInCart ? "Update Cart" : "Add to Cart"}
              </Button>

              <div className="flex gap-2">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => onAddToWishlist(product.id)}
                >
                  <Heart
                    className={cn(
                      "h-4 w-4 mr-2",
                      isInWishlist ? "fill-red-500 text-red-500" : "",
                    )}
                  />
                  {isInWishlist ? "Remove from Wishlist" : "Add to Wishlist"}
                </Button>
                <Button variant="outline" size="icon" onClick={handleShare}>
                  <Share2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ProductQuickView;
