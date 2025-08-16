import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Search,
  ShoppingCart,
  Heart,
  User,
  ChevronRight,
  ChevronLeft,
  Star,
  Eye,
  ArrowRight,
  Bell,
  Globe,
  ChevronDown,
  Package,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useEnhancedMarketplace } from "@/contexts/EnhancedMarketplaceContext";
import { EnhancedMarketplaceHeader } from "@/components/marketplace/EnhancedMarketplaceHeader";
import { CampaignBanners } from "@/components/marketplace/CampaignBanners";
import { OptimizedSmartRecommendations } from "@/components/marketplace/OptimizedSmartRecommendations";
import ProductQuickView from "@/components/marketplace/ProductQuickView";
import ResponsiveProductCarousel from "@/components/marketplace/ResponsiveProductCarousel";
import CategoryBrowser from "@/components/marketplace/CategoryBrowser";
import { ProductImage } from "@/components/ui/image-placeholder";

interface FlashSaleProduct {
  id: string;
  name: string;
  image?: string;
  originalPrice: number;
  salePrice: number;
  discount: number;
  rating: number;
  reviews: number;
  inStock: boolean;
}

const EnhancedMarketplaceHomepage: React.FC = () => {
  const { products, categories, featuredProducts, addToCart, addToWishlist } =
    useEnhancedMarketplace();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");
  const [activeFilters, setActiveFilters] = useState<string[]>([]);

  const [currentHeroSlide, setCurrentHeroSlide] = useState(0);
  const [timeLeft, setTimeLeft] = useState({
    days: 3,
    hours: 23,
    minutes: 19,
    seconds: 56,
  });
  const [selectedProduct, setSelectedProduct] = useState<FlashSaleProduct | null>(null);
  const [showQuickView, setShowQuickView] = useState(false);
  const [flashSaleProducts, setFlashSaleProducts] = useState<FlashSaleProduct[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch flash sale products from API
  useEffect(() => {
    const fetchFlashSaleProducts = async () => {
      try {
        setIsLoading(true);
        const response = await fetch('/api/marketplace/flash-sales');
        if (response.ok) {
          const data = await response.json();
          setFlashSaleProducts(data);
        } else {
          // In production, show empty state when no API data
          setFlashSaleProducts([]);
        }
      } catch (error) {
        console.error('Error fetching flash sale products:', error);
        setFlashSaleProducts([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchFlashSaleProducts();
  }, []);

  // Countdown timer effect
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        } else if (prev.hours > 0) {
          return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 };
        } else if (prev.days > 0) {
          return {
            ...prev,
            days: prev.days - 1,
            hours: 23,
            minutes: 59,
            seconds: 59,
          };
        }
        return prev;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Quick view handlers
  const handleProductQuickView = (product: FlashSaleProduct) => {
    setSelectedProduct(product);
    setShowQuickView(true);
  };

  const handleAddToCart = (productId: string, quantity: number = 1) => {
    addToCart?.(productId, quantity);
  };

  const handleAddToWishlist = (productId: string) => {
    addToWishlist?.(productId);
  };

  const formatPrice = (price: number) => {
    return `$${price.toFixed(0)}`;
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${
          i < Math.floor(rating)
            ? "text-yellow-400 fill-yellow-400"
            : "text-gray-300"
        }`}
      />
    ));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Enhanced Marketplace Header */}
      <EnhancedMarketplaceHeader />

      {/* Campaign Banners */}
      <CampaignBanners />

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* Sidebar Categories */}
          <div className="hidden lg:block lg:col-span-1">
            <div className="sticky top-8">
              <CategoryBrowser
                categories={categories}
                layout="sidebar"
                onCategorySelect={(category) => {
                  setActiveCategory(category.id);
                }}
              />
            </div>
          </div>

          {/* Main Content Area */}
          <div className="lg:col-span-4 space-y-8">
            {/* Hero Section */}
            <div className="relative bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl overflow-hidden h-64 lg:h-80">
              <div className="flex flex-col lg:flex-row h-full">
                <div className="flex-1 flex flex-col justify-center px-8 lg:px-16 text-white py-6 lg:py-0">
                  <div className="flex items-center gap-6 mb-6">
                    <span className="text-3xl">🛍️</span>
                    <span className="text-white/80">Marketplace</span>
                  </div>
                  <h2 className="text-3xl lg:text-5xl font-bold mb-8 leading-tight">
                    Discover Amazing
                    <br />
                    Products
                  </h2>
                  <Link
                    to="/marketplace/explore"
                    className="flex items-center gap-2 text-white border-b border-white pb-1 w-fit hover:border-white/60"
                  >
                    <span>Explore Now</span>
                    <ArrowRight className="w-5 h-5" />
                  </Link>
                </div>
                <div className="flex-1 relative hidden lg:block">
                  <div className="absolute right-0 top-1/2 transform -translate-y-1/2 h-full w-auto flex items-center justify-center">
                    <div className="text-center text-white/80">
                      <div className="w-32 h-32 mx-auto mb-4 bg-white/10 rounded-lg flex items-center justify-center">
                        <Package className="w-16 h-16" />
                      </div>
                      <p className="text-sm">Featured Products</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Flash Sales Section */}
            <section className="bg-white rounded-2xl p-6 lg:p-8 shadow-sm">
              <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between mb-8 gap-6">
                {/* Section Title */}
                <div className="space-y-6">
                  <div className="flex items-center gap-4">
                    <div className="w-5 h-10 bg-red-500 rounded" />
                    <span className="text-red-500 font-semibold">Today's</span>
                  </div>
                  <h2 className="text-2xl lg:text-4xl font-bold tracking-wide">
                    Flash Sales
                  </h2>
                </div>

                {/* Countdown Timer */}
                <div className="flex items-center gap-4">
                  <div className="text-center">
                    <div className="text-xs text-gray-600 mb-1">Days</div>
                    <div className="text-2xl lg:text-3xl font-bold">
                      {timeLeft.days.toString().padStart(2, "0")}
                    </div>
                  </div>
                  <div className="flex flex-col gap-2">
                    <div className="w-1 h-1 bg-red-400 rounded-full" />
                    <div className="w-1 h-1 bg-red-400 rounded-full" />
                  </div>
                  <div className="text-center">
                    <div className="text-xs text-gray-600 mb-1">Hours</div>
                    <div className="text-2xl lg:text-3xl font-bold">
                      {timeLeft.hours.toString().padStart(2, "0")}
                    </div>
                  </div>
                  <div className="flex flex-col gap-2">
                    <div className="w-1 h-1 bg-red-400 rounded-full" />
                    <div className="w-1 h-1 bg-red-400 rounded-full" />
                  </div>
                  <div className="text-center">
                    <div className="text-xs text-gray-600 mb-1">Minutes</div>
                    <div className="text-2xl lg:text-3xl font-bold">
                      {timeLeft.minutes.toString().padStart(2, "0")}
                    </div>
                  </div>
                  <div className="flex flex-col gap-2">
                    <div className="w-1 h-1 bg-red-400 rounded-full" />
                    <div className="w-1 h-1 bg-red-400 rounded-full" />
                  </div>
                  <div className="text-center">
                    <div className="text-xs text-gray-600 mb-1">Seconds</div>
                    <div className="text-2xl lg:text-3xl font-bold">
                      {timeLeft.seconds.toString().padStart(2, "0")}
                    </div>
                  </div>
                </div>
              </div>

              {/* Flash Sale Products Grid */}
              {isLoading ? (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                  {[...Array(4)].map((_, index) => (
                    <div key={index} className="animate-pulse">
                      <div className="aspect-square bg-gray-200 rounded-lg mb-4"></div>
                      <div className="h-4 bg-gray-200 rounded mb-2"></div>
                      <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    </div>
                  ))}
                </div>
              ) : flashSaleProducts.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                  {flashSaleProducts.map((product) => (
                    <div key={product.id} className="group">
                      <div className="relative bg-gray-100 rounded-xl overflow-hidden aspect-square mb-4">
                        {/* Discount Badge */}
                        <div className="absolute top-3 left-3 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-medium z-10">
                          -{product.discount}%
                        </div>

                        {/* Action Buttons */}
                        <div className="absolute top-3 right-3 flex flex-col gap-2 z-10">
                          <Button
                            variant="outline"
                            size="icon"
                            className="bg-white w-8 h-8 rounded-full shadow-sm opacity-0 group-hover:opacity-100 transition-opacity"
                            onClick={() => handleAddToWishlist(product.id)}
                          >
                            <Heart className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="icon"
                            className="bg-white w-8 h-8 rounded-full shadow-sm opacity-0 group-hover:opacity-100 transition-opacity"
                            onClick={() => handleProductQuickView(product)}
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                        </div>

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

                        {/* Add to Cart Button */}
                        <div 
                          className="absolute bottom-0 left-0 right-0 bg-black text-white py-3 text-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                          onClick={() => handleAddToCart(product.id, 1)}
                        >
                          <span className="text-sm font-medium">Add To Cart</span>
                        </div>
                      </div>

                      {/* Product Info */}
                      <div className="space-y-2">
                        <h3 className="font-medium text-gray-900 line-clamp-2">
                          {product.name}
                        </h3>
                        <div className="flex items-center gap-3">
                          <span className="text-red-500 font-semibold">
                            {formatPrice(product.salePrice)}
                          </span>
                          <span className="text-gray-500 line-through">
                            {formatPrice(product.originalPrice)}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="flex items-center">
                            {renderStars(product.rating)}
                          </div>
                          <span className="text-sm text-gray-500">
                            ({product.reviews})
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-16">
                  <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                    <Bell className="w-12 h-12 text-gray-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    No Flash Sales Available
                  </h3>
                  <p className="text-gray-600 mb-4">
                    Check back soon for exciting flash sale deals!
                  </p>
                  <Button asChild>
                    <Link to="/marketplace/products">
                      Browse All Products
                    </Link>
                  </Button>
                </div>
              )}
            </section>

            {/* Category Browser Section */}
            <section className="bg-white rounded-2xl p-6 lg:p-8 shadow-sm">
              <div className="mb-8">
                <h2 className="text-2xl lg:text-4xl font-bold tracking-wide mb-4">
                  Browse Categories
                </h2>
                <p className="text-gray-600">
                  Discover products across our most popular categories
                </p>
              </div>
              <CategoryBrowser
                categories={categories}
                onCategorySelect={(category) => {
                  setActiveCategory(category.id);
                }}
                showSubcategories={true}
                layout="grid"
              />
            </section>

            {/* Smart Recommendations Section */}
            <section className="bg-white rounded-2xl p-6 lg:p-8 shadow-sm">
              <OptimizedSmartRecommendations
                userId="current-user"
                maxItems={8}
                enableRealTimeUpdates={true}
                onProductClick={(product) => handleProductQuickView(product as FlashSaleProduct)}
                onAddToCart={(productId) => handleAddToCart(productId, 1)}
                onAddToWishlist={handleAddToWishlist}
                onQuickView={(product) => handleProductQuickView(product as FlashSaleProduct)}
              />
            </section>

            {/* Featured Products Section */}
            {featuredProducts && featuredProducts.length > 0 && (
              <section className="bg-white rounded-2xl p-6 lg:p-8 shadow-sm">
                <ResponsiveProductCarousel
                  title="Featured Products"
                  subtitle="Handpicked by our experts"
                  products={featuredProducts.slice(0, 8)}
                  onProductClick={(product) => handleProductQuickView(product as FlashSaleProduct)}
                  onAddToCart={(productId) => handleAddToCart(productId, 1)}
                  onAddToWishlist={handleAddToWishlist}
                  onQuickView={(product) => handleProductQuickView(product as FlashSaleProduct)}
                  autoplay={false}
                  itemsPerView={{
                    mobile: 1.3,
                    tablet: 2.8,
                    desktop: 4.5,
                  }}
                />
              </section>
            )}
          </div>
        </div>
      </div>

      {/* Product Quick View Modal */}
      {selectedProduct && (
        <ProductQuickView
          product={{
            ...selectedProduct,
            description: `High-quality ${selectedProduct.name} with excellent features and great value for money.`,
            highlights: [
              "Premium quality materials",
              "Fast shipping available",
              "30-day return policy",
              "Customer satisfaction guaranteed",
            ],
            seller: {
              name: "Verified Seller",
              rating: 4.8,
              verified: true,
            },
            shipping: {
              freeShipping: true,
              estimatedDays: 3,
            },
            warranty: "Standard warranty included",
            returnPolicy: "30-day hassle-free returns",
          }}
          isOpen={showQuickView}
          onClose={() => {
            setShowQuickView(false);
            setSelectedProduct(null);
          }}
          onAddToCart={handleAddToCart}
          onAddToWishlist={handleAddToWishlist}
          isInWishlist={false}
          isInCart={false}
        />
      )}
    </div>
  );
};

export default EnhancedMarketplaceHomepage;
