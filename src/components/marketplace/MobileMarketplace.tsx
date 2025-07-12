import React, { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
  Search,
  Filter,
  Grid,
  List,
  Star,
  Heart,
  ShoppingCart,
  Eye,
  Share2,
  MapPin,
  Truck,
  Shield,
  Zap,
  ChevronDown,
  ChevronUp,
  ChevronLeft,
  ChevronRight,
  X,
  Plus,
  Minus,
  Menu,
  ArrowUp,
  Bookmark,
  GitCompare as Compare,
  ScanLine,
  Camera,
  Mic,
  MessageCircle,
  Phone,
  Mail,
  ExternalLink,
  MoreVertical,
  Maximize,
  Tag,
  Clock,
  Package,
  Award,
  Users,
  TrendingUp,
  DollarSign,
  RotateCcw,
  Settings,
  Download,
  Upload,
  Info,
  AlertCircle,
  CheckCircle,
  Home,
  User,
  ShoppingBag,
  Archive,
} from "lucide-react";
import { useMarketplace } from "@/contexts/MarketplaceContext";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/components/ui/use-toast";
import { Product } from "@/types/marketplace";
import { cn } from "@/lib/utils";

interface MobileMarketplaceProps {
  onProductSelect?: (product: Product) => void;
  className?: string;
}

interface QuickFilter {
  id: string;
  label: string;
  icon: React.ReactNode;
  filter: any;
}

export default function MobileMarketplace({
  onProductSelect,
  className,
}: MobileMarketplaceProps) {
  const { products, isLoading, addToCart, addToWishlist } = useMarketplace();
  const { isAuthenticated } = useAuth();
  const { toast } = useToast();

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [sortBy, setSortBy] = useState("relevance");
  const [showFilters, setShowFilters] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [showQuickActions, setShowQuickActions] = useState(false);
  const [recentlyViewed, setRecentlyViewed] = useState<string[]>([]);
  const [compareList, setCompareList] = useState<string[]>([]);
  const [scrollY, setScrollY] = useState(0);
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [cartItems, setCartItems] = useState<string[]>([]);
  const [wishlistItems, setWishlistItems] = useState<string[]>([]);

  const searchInputRef = useRef<HTMLInputElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Categories with icons
  const categories = [
    { id: "all", label: "All", icon: <Grid className="h-4 w-4" /> },
    {
      id: "electronics",
      label: "Electronics",
      icon: <Zap className="h-4 w-4" />,
    },
    {
      id: "clothing",
      label: "Fashion",
      icon: <ShoppingBag className="h-4 w-4" />,
    },
    { id: "home", label: "Home", icon: <Home className="h-4 w-4" /> },
    { id: "beauty", label: "Beauty", icon: <Star className="h-4 w-4" /> },
    { id: "sports", label: "Sports", icon: <TrendingUp className="h-4 w-4" /> },
    { id: "books", label: "Books", icon: <Archive className="h-4 w-4" /> },
  ];

  // Quick filters for mobile
  const quickFilters: QuickFilter[] = [
    {
      id: "free-shipping",
      label: "Free Shipping",
      icon: <Truck className="h-3 w-3" />,
      filter: { freeShipping: true },
    },
    {
      id: "top-rated",
      label: "4+ Stars",
      icon: <Star className="h-3 w-3" />,
      filter: { rating: 4 },
    },
    {
      id: "on-sale",
      label: "On Sale",
      icon: <Tag className="h-3 w-3" />,
      filter: { onSale: true },
    },
    {
      id: "new-arrivals",
      label: "New",
      icon: <Zap className="h-3 w-3" />,
      filter: { newArrivals: true },
    },
    {
      id: "verified",
      label: "Verified",
      icon: <Shield className="h-3 w-3" />,
      filter: { verified: true },
    },
  ];

  // Sort options
  const sortOptions = [
    { value: "relevance", label: "Best Match" },
    { value: "price_low", label: "Price: Low to High" },
    { value: "price_high", label: "Price: High to Low" },
    { value: "rating", label: "Highest Rated" },
    { value: "newest", label: "Newest First" },
    { value: "popular", label: "Most Popular" },
  ];

  // Handle scroll events
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setScrollY(currentScrollY);
      setShowBackToTop(currentScrollY > 500);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Filter products based on current filters
  const filteredProducts = products.filter((product) => {
    if (selectedCategory !== "all" && product.category !== selectedCategory)
      return false;
    if (
      searchQuery &&
      !product.name.toLowerCase().includes(searchQuery.toLowerCase())
    )
      return false;
    return true;
  });

  // Sort products
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case "price_low":
        return (a.discountPrice || a.price) - (b.discountPrice || b.price);
      case "price_high":
        return (b.discountPrice || b.price) - (a.discountPrice || a.price);
      case "rating":
        return b.rating - a.rating;
      case "newest":
        return (
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
      case "popular":
        return (b.reviewCount || 0) - (a.reviewCount || 0);
      default:
        return 0;
    }
  });

  const handleProductView = (product: Product) => {
    setSelectedProduct(product);
    setRecentlyViewed((prev) => [
      product.id,
      ...prev.filter((id) => id !== product.id).slice(0, 9),
    ]);
    onProductSelect?.(product);
  };

  const handleAddToCart = (productId: string) => {
    if (!isAuthenticated) {
      toast({
        title: "Sign in required",
        description: "Please sign in to add items to your cart",
        variant: "destructive",
      });
      return;
    }

    addToCart(productId);
    setCartItems((prev) => [...prev, productId]);
    toast({
      title: "Added to cart",
      description: "Item has been added to your cart",
    });
  };

  const handleAddToWishlist = (productId: string) => {
    if (!isAuthenticated) {
      toast({
        title: "Sign in required",
        description: "Please sign in to save items",
        variant: "destructive",
      });
      return;
    }

    addToWishlist(productId);
    setWishlistItems((prev) =>
      prev.includes(productId)
        ? prev.filter((id) => id !== productId)
        : [...prev, productId],
    );

    toast({
      title: wishlistItems.includes(productId)
        ? "Removed from wishlist"
        : "Added to wishlist",
      description: wishlistItems.includes(productId)
        ? "Item removed from your wishlist"
        : "Item saved to your wishlist",
    });
  };

  const handleAddToCompare = (productId: string) => {
    if (compareList.length >= 4) {
      toast({
        title: "Compare limit reached",
        description: "You can compare up to 4 products",
        variant: "destructive",
      });
      return;
    }

    setCompareList((prev) => [...prev, productId]);
    toast({
      title: "Added to compare",
      description: "Product added to comparison list",
    });
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
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
            : "text-gray-300",
        )}
      />
    ));
  };

  // Mobile Product Card Component
  const MobileProductCard = ({ product }: { product: Product }) => {
    const isInWishlist = wishlistItems.includes(product.id);
    const isInCart = cartItems.includes(product.id);
    const discountPercentage = product.discountPrice
      ? Math.round(
          ((product.price - product.discountPrice) / product.price) * 100,
        )
      : 0;

    return (
      <Card className="overflow-hidden">
        <div className="relative">
          <div
            className="aspect-square bg-gray-100 cursor-pointer"
            onClick={() => handleProductView(product)}
          >
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-cover"
            />

            {/* Product Badges */}
            <div className="absolute top-2 left-2 flex flex-col gap-1">
              {product.isNew && (
                <Badge
                  variant="secondary"
                  className="text-xs bg-green-100 text-green-800"
                >
                  New
                </Badge>
              )}
              {discountPercentage > 0 && (
                <Badge variant="destructive" className="text-xs">
                  -{discountPercentage}%
                </Badge>
              )}
            </div>

            {/* Quick Actions */}
            <div className="absolute top-2 right-2 flex flex-col gap-1">
              <Button
                size="sm"
                variant="secondary"
                className="h-8 w-8 p-0 bg-white/80 backdrop-blur-sm"
                onClick={(e) => {
                  e.stopPropagation();
                  handleAddToWishlist(product.id);
                }}
              >
                <Heart
                  className={cn(
                    "h-3 w-3",
                    isInWishlist && "fill-red-500 text-red-500",
                  )}
                />
              </Button>
              <Button
                size="sm"
                variant="secondary"
                className="h-8 w-8 p-0 bg-white/80 backdrop-blur-sm"
                onClick={(e) => {
                  e.stopPropagation();
                  handleAddToCompare(product.id);
                }}
              >
                <Compare className="h-3 w-3" />
              </Button>
            </div>

            {/* Out of Stock Overlay */}
            {!product.inStock && (
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                <Badge variant="destructive">Out of Stock</Badge>
              </div>
            )}
          </div>

          <CardContent className="p-3">
            <div className="space-y-2">
              <h3
                className="font-medium text-sm line-clamp-2 cursor-pointer hover:text-blue-600"
                onClick={() => handleProductView(product)}
              >
                {product.name}
              </h3>

              <div className="flex items-center gap-1">
                <div className="flex">{renderStars(product.rating)}</div>
                <span className="text-xs text-gray-600">
                  ({product.reviewCount || 0})
                </span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-green-600">
                    {formatPrice(product.discountPrice || product.price)}
                  </span>
                  {product.discountPrice && (
                    <span className="text-xs text-gray-500 line-through">
                      {formatPrice(product.price)}
                    </span>
                  )}
                </div>

                {product.shippingInfo?.freeShipping && (
                  <Badge variant="outline" className="text-xs">
                    <Truck className="h-3 w-3 mr-1" />
                    Free
                  </Badge>
                )}
              </div>

              <Button
                onClick={() => handleAddToCart(product.id)}
                disabled={!product.inStock || isInCart}
                className="w-full h-8 text-xs"
                size="sm"
              >
                {!product.inStock ? (
                  "Out of Stock"
                ) : isInCart ? (
                  "In Cart"
                ) : (
                  <>
                    <ShoppingCart className="h-3 w-3 mr-1" />
                    Add to Cart
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </div>
      </Card>
    );
  };

  return (
    <div className={cn("min-h-screen bg-gray-50", className)}>
      {/* Mobile Header */}
      <div className="sticky top-0 z-40 bg-white border-b shadow-sm">
        <div className="flex items-center justify-between p-4">
          <h1 className="text-lg font-bold">Marketplace</h1>

          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowSearch(!showSearch)}
            >
              <Search className="h-4 w-4" />
            </Button>

            <Sheet open={showFilters} onOpenChange={setShowFilters}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="sm">
                  <Filter className="h-4 w-4" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-80">
                <SheetHeader>
                  <SheetTitle>Filters & Sort</SheetTitle>
                  <SheetDescription>
                    Refine your search results
                  </SheetDescription>
                </SheetHeader>

                <div className="mt-6 space-y-6">
                  {/* Sort Options */}
                  <div>
                    <h3 className="font-medium mb-3">Sort by</h3>
                    <div className="space-y-2">
                      {sortOptions.map((option) => (
                        <Button
                          key={option.value}
                          variant={
                            sortBy === option.value ? "default" : "outline"
                          }
                          size="sm"
                          onClick={() => setSortBy(option.value)}
                          className="w-full justify-start"
                        >
                          {option.label}
                        </Button>
                      ))}
                    </div>
                  </div>

                  <Separator />

                  {/* View Mode */}
                  <div>
                    <h3 className="font-medium mb-3">View</h3>
                    <div className="flex gap-2">
                      <Button
                        variant={viewMode === "grid" ? "default" : "outline"}
                        size="sm"
                        onClick={() => setViewMode("grid")}
                        className="flex-1"
                      >
                        <Grid className="h-4 w-4 mr-2" />
                        Grid
                      </Button>
                      <Button
                        variant={viewMode === "list" ? "default" : "outline"}
                        size="sm"
                        onClick={() => setViewMode("list")}
                        className="flex-1"
                      >
                        <List className="h-4 w-4 mr-2" />
                        List
                      </Button>
                    </div>
                  </div>
                </div>
              </SheetContent>
            </Sheet>

            <Button variant="ghost" size="sm">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Search Bar (Expandable) */}
        {showSearch && (
          <div className="px-4 pb-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                ref={searchInputRef}
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-10"
                autoFocus
              />
              {searchQuery && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="absolute right-2 top-2"
                  onClick={() => setSearchQuery("")}
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>
        )}

        {/* Category Tabs */}
        <ScrollArea>
          <div className="flex gap-2 px-4 pb-4">
            {categories.map((category) => (
              <Button
                key={category.id}
                variant={
                  selectedCategory === category.id ? "default" : "outline"
                }
                size="sm"
                onClick={() => setSelectedCategory(category.id)}
                className="flex items-center gap-2 whitespace-nowrap"
              >
                {category.icon}
                {category.label}
              </Button>
            ))}
          </div>
        </ScrollArea>

        {/* Quick Filters */}
        <ScrollArea>
          <div className="flex gap-2 px-4 pb-4">
            {quickFilters.map((filter) => (
              <Button
                key={filter.id}
                variant="outline"
                size="sm"
                className="flex items-center gap-2 whitespace-nowrap"
              >
                {filter.icon}
                {filter.label}
              </Button>
            ))}
          </div>
        </ScrollArea>
      </div>

      {/* Main Content */}
      <div className="flex-1" ref={scrollContainerRef}>
        {/* Results Header */}
        <div className="flex items-center justify-between p-4 bg-white border-b">
          <span className="text-sm text-gray-600">
            {sortedProducts.length} products found
          </span>

          <div className="flex items-center gap-2">
            {compareList.length > 0 && (
              <Button variant="outline" size="sm">
                <Compare className="h-4 w-4 mr-1" />
                Compare ({compareList.length})
              </Button>
            )}
          </div>
        </div>

        {/* Products Grid */}
        {isLoading ? (
          <div className="p-4">
            <div className="grid grid-cols-2 gap-4">
              {Array.from({ length: 6 }).map((_, index) => (
                <Card key={index} className="overflow-hidden">
                  <div className="aspect-square bg-gray-200 animate-pulse" />
                  <CardContent className="p-3">
                    <div className="space-y-2">
                      <div className="h-4 bg-gray-200 rounded animate-pulse" />
                      <div className="h-3 bg-gray-200 rounded w-2/3 animate-pulse" />
                      <div className="h-8 bg-gray-200 rounded animate-pulse" />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        ) : sortedProducts.length > 0 ? (
          <div className="p-4">
            <div
              className={cn(
                "grid gap-4",
                viewMode === "grid" ? "grid-cols-2" : "grid-cols-1",
              )}
            >
              {sortedProducts.map((product) => (
                <MobileProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-16 px-4">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <Search className="h-6 w-6 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold mb-2">No products found</h3>
            <p className="text-gray-600 text-center mb-4">
              Try adjusting your search or filters to find what you're looking
              for
            </p>
            <Button
              variant="outline"
              onClick={() => {
                setSearchQuery("");
                setSelectedCategory("all");
              }}
            >
              Clear Filters
            </Button>
          </div>
        )}

        {/* Recently Viewed */}
        {recentlyViewed.length > 0 && (
          <div className="mt-8 bg-white border-t">
            <div className="p-4">
              <h3 className="font-medium mb-4 flex items-center gap-2">
                <Clock className="h-4 w-4" />
                Recently Viewed
              </h3>
              <ScrollArea>
                <div className="flex gap-3 pb-2">
                  {recentlyViewed.slice(0, 6).map((productId) => {
                    const product = products.find((p) => p.id === productId);
                    if (!product) return null;

                    return (
                      <div
                        key={productId}
                        className="flex-shrink-0 w-20 cursor-pointer"
                        onClick={() => handleProductView(product)}
                      >
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-20 h-20 object-cover rounded"
                        />
                        <p className="text-xs mt-1 truncate">{product.name}</p>
                      </div>
                    );
                  })}
                </div>
              </ScrollArea>
            </div>
          </div>
        )}
      </div>

      {/* Floating Action Buttons */}
      <div className="fixed bottom-4 right-4 flex flex-col gap-2 z-30">
        {/* Back to Top */}
        {showBackToTop && (
          <Button
            onClick={scrollToTop}
            className="h-12 w-12 rounded-full shadow-lg"
            size="sm"
          >
            <ArrowUp className="h-4 w-4" />
          </Button>
        )}

        {/* Quick Actions */}
        <Drawer open={showQuickActions} onOpenChange={setShowQuickActions}>
          <DrawerTrigger asChild>
            <Button className="h-12 w-12 rounded-full shadow-lg">
              <Plus className="h-4 w-4" />
            </Button>
          </DrawerTrigger>
          <DrawerContent>
            <DrawerHeader>
              <DrawerTitle>Quick Actions</DrawerTitle>
              <DrawerDescription>What would you like to do?</DrawerDescription>
            </DrawerHeader>

            <div className="grid grid-cols-2 gap-4 p-4">
              <Button variant="outline" className="flex flex-col gap-2 h-20">
                <ScanLine className="h-6 w-6" />
                Scan Product
              </Button>
              <Button variant="outline" className="flex flex-col gap-2 h-20">
                <Camera className="h-6 w-6" />
                Image Search
              </Button>
              <Button variant="outline" className="flex flex-col gap-2 h-20">
                <Mic className="h-6 w-6" />
                Voice Search
              </Button>
              <Button variant="outline" className="flex flex-col gap-2 h-20">
                <Bookmark className="h-6 w-6" />
                Saved Items
              </Button>
            </div>

            <DrawerFooter>
              <DrawerClose asChild>
                <Button variant="outline">Close</Button>
              </DrawerClose>
            </DrawerFooter>
          </DrawerContent>
        </Drawer>
      </div>

      {/* Product Detail Sheet */}
      {selectedProduct && (
        <Sheet
          open={!!selectedProduct}
          onOpenChange={() => setSelectedProduct(null)}
        >
          <SheetContent side="bottom" className="h-[80vh] overflow-y-auto">
            <SheetHeader>
              <SheetTitle>{selectedProduct.name}</SheetTitle>
              <SheetDescription>
                Product details and purchase options
              </SheetDescription>
            </SheetHeader>

            <div className="mt-6 space-y-6">
              {/* Product Image */}
              <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
                <img
                  src={selectedProduct.image}
                  alt={selectedProduct.name}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Price and Rating */}
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="text-2xl font-bold text-green-600">
                    {formatPrice(
                      selectedProduct.discountPrice || selectedProduct.price,
                    )}
                  </span>
                  {selectedProduct.discountPrice && (
                    <span className="text-lg text-gray-500 line-through">
                      {formatPrice(selectedProduct.price)}
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <div className="flex">
                    {renderStars(selectedProduct.rating)}
                  </div>
                  <span className="text-sm text-gray-600">
                    {selectedProduct.rating} ({selectedProduct.reviewCount || 0}{" "}
                    reviews)
                  </span>
                </div>
              </div>

              {/* Description */}
              <div>
                <h3 className="font-medium mb-2">Description</h3>
                <p className="text-gray-700 text-sm">
                  {selectedProduct.description}
                </p>
              </div>

              {/* Actions */}
              <div className="grid grid-cols-2 gap-3">
                <Button
                  onClick={() => handleAddToCart(selectedProduct.id)}
                  disabled={!selectedProduct.inStock}
                  className="flex items-center gap-2"
                >
                  <ShoppingCart className="h-4 w-4" />
                  Add to Cart
                </Button>
                <Button variant="outline" className="flex items-center gap-2">
                  <Zap className="h-4 w-4" />
                  Buy Now
                </Button>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleAddToWishlist(selectedProduct.id)}
                >
                  <Heart className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="sm">
                  <Share2 className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="sm">
                  <MessageCircle className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      )}
    </div>
  );
}
