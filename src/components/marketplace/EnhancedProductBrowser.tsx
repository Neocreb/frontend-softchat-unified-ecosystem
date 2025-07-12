import { useState, useEffect, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Search,
  Filter,
  Grid,
  List,
  SlidersHorizontal,
  Star,
  Heart,
  Eye,
  ShoppingCart,
  MapPin,
  Truck,
  Shield,
  Zap,
  Clock,
  DollarSign,
  Tag,
  Users,
  TrendingUp,
  Award,
  CheckCircle,
  X,
  ChevronDown,
  RotateCcw,
  Bookmark,
  Share2,
  Compare,
  AlertCircle,
  Camera,
  Video,
  Headphones,
  Package,
  Globe,
  Lightning,
} from "lucide-react";
import { useMarketplace } from "@/contexts/MarketplaceContext";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/components/ui/use-toast";
import EnhancedProductCard from "./EnhancedProductCard";
import { Product } from "@/types/marketplace";
import { cn } from "@/lib/utils";

interface FilterState {
  categories: string[];
  priceRange: [number, number];
  rating: number;
  condition: string[];
  shipping: string[];
  brand: string[];
  features: string[];
  location: string;
  sellerType: string[];
  availability: string[];
  sortBy: string;
  viewMode: "grid" | "list";
  searchQuery: string;
}

interface EnhancedProductBrowserProps {
  onProductSelect?: (product: Product) => void;
  initialFilters?: Partial<FilterState>;
  showAdvanced?: boolean;
  compactMode?: boolean;
}

export default function EnhancedProductBrowser({
  onProductSelect,
  initialFilters = {},
  showAdvanced = true,
  compactMode = false,
}: EnhancedProductBrowserProps) {
  const { products, isLoading, addToCart, addToWishlist } = useMarketplace();
  const { isAuthenticated } = useAuth();
  const { toast } = useToast();

  const [filters, setFilters] = useState<FilterState>({
    categories: [],
    priceRange: [0, 1000],
    rating: 0,
    condition: [],
    shipping: [],
    brand: [],
    features: [],
    location: "",
    sellerType: [],
    availability: [],
    sortBy: "relevance",
    viewMode: "grid",
    searchQuery: "",
    ...initialFilters,
  });

  const [showFilters, setShowFilters] = useState(false);
  const [savedSearches, setSavedSearches] = useState<string[]>([]);
  const [compareList, setCompareList] = useState<string[]>([]);
  const [recentlyViewed, setRecentlyViewed] = useState<string[]>([]);
  const [quickFilters, setQuickFilters] = useState<string[]>([]);

  // Extract unique filter options from products
  const filterOptions = useMemo(() => {
    const categories = [...new Set(products.map((p) => p.category))];
    const brands = [...new Set(products.map((p) => p.sellerName))];
    const conditions = ["new", "used", "refurbished"];
    const features = [
      "Free Shipping",
      "Fast Delivery",
      "Verified Seller",
      "Best Seller",
      "Eco-Friendly",
      "Premium",
      "Sale",
      "New Arrival",
    ];
    const shippingOptions = [
      "Free Shipping",
      "Express",
      "Same Day",
      "Local Pickup",
    ];
    const sellerTypes = ["Individual", "Business", "Verified", "Power Seller"];
    const availability = [
      "In Stock",
      "Limited Stock",
      "Pre-Order",
      "Back Order",
    ];

    return {
      categories,
      brands,
      conditions,
      features,
      shippingOptions,
      sellerTypes,
      availability,
    };
  }, [products]);

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    let filtered = [...products];

    // Search query
    if (filters.searchQuery) {
      const query = filters.searchQuery.toLowerCase();
      filtered = filtered.filter(
        (product) =>
          product.name.toLowerCase().includes(query) ||
          product.description.toLowerCase().includes(query) ||
          product.category.toLowerCase().includes(query) ||
          product.sellerName.toLowerCase().includes(query) ||
          (product.tags &&
            product.tags.some((tag) => tag.toLowerCase().includes(query))),
      );
    }

    // Categories
    if (filters.categories.length > 0) {
      filtered = filtered.filter((product) =>
        filters.categories.includes(product.category),
      );
    }

    // Price range
    filtered = filtered.filter((product) => {
      const price = product.discountPrice || product.price;
      return price >= filters.priceRange[0] && price <= filters.priceRange[1];
    });

    // Rating
    if (filters.rating > 0) {
      filtered = filtered.filter((product) => product.rating >= filters.rating);
    }

    // Condition
    if (filters.condition.length > 0) {
      filtered = filtered.filter((product) =>
        filters.condition.includes(product.condition || "new"),
      );
    }

    // Shipping
    if (filters.shipping.length > 0) {
      filtered = filtered.filter((product) => {
        if (
          filters.shipping.includes("Free Shipping") &&
          product.shippingInfo?.freeShipping
        )
          return true;
        if (
          filters.shipping.includes("Express") &&
          product.shippingInfo?.expressAvailable
        )
          return true;
        return false;
      });
    }

    // Brand
    if (filters.brand.length > 0) {
      filtered = filtered.filter((product) =>
        filters.brand.includes(product.sellerName),
      );
    }

    // Availability
    if (filters.availability.length > 0) {
      filtered = filtered.filter((product) => {
        if (filters.availability.includes("In Stock") && product.inStock)
          return true;
        if (filters.availability.includes("Limited Stock") && product.inStock)
          return true;
        return false;
      });
    }

    // Sort products
    switch (filters.sortBy) {
      case "price_low":
        filtered.sort(
          (a, b) => (a.discountPrice || a.price) - (b.discountPrice || b.price),
        );
        break;
      case "price_high":
        filtered.sort(
          (a, b) => (b.discountPrice || b.price) - (a.discountPrice || a.price),
        );
        break;
      case "rating":
        filtered.sort((a, b) => b.rating - a.rating);
        break;
      case "newest":
        filtered.sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
        );
        break;
      case "popular":
        filtered.sort((a, b) => (b.reviewCount || 0) - (a.reviewCount || 0));
        break;
      case "discount":
        filtered.sort((a, b) => {
          const aDiscount = a.discountPrice
            ? ((a.price - a.discountPrice) / a.price) * 100
            : 0;
          const bDiscount = b.discountPrice
            ? ((b.price - b.discountPrice) / b.price) * 100
            : 0;
          return bDiscount - aDiscount;
        });
        break;
      default:
        // relevance - keep original order
        break;
    }

    return filtered;
  }, [products, filters]);

  const handleFilterChange = (key: keyof FilterState, value: any) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const handleArrayFilterToggle = (key: keyof FilterState, value: string) => {
    setFilters((prev) => {
      const currentArray = prev[key] as string[];
      const newArray = currentArray.includes(value)
        ? currentArray.filter((item) => item !== value)
        : [...currentArray, value];
      return { ...prev, [key]: newArray };
    });
  };

  const clearAllFilters = () => {
    setFilters({
      categories: [],
      priceRange: [0, 1000],
      rating: 0,
      condition: [],
      shipping: [],
      brand: [],
      features: [],
      location: "",
      sellerType: [],
      availability: [],
      sortBy: "relevance",
      viewMode: filters.viewMode,
      searchQuery: "",
    });
  };

  const saveSearch = () => {
    if (filters.searchQuery && !savedSearches.includes(filters.searchQuery)) {
      setSavedSearches((prev) => [filters.searchQuery, ...prev.slice(0, 4)]);
      toast({
        title: "Search saved",
        description: "Your search has been saved for quick access.",
      });
    }
  };

  const addToCompare = (productId: string) => {
    if (compareList.length >= 4) {
      toast({
        title: "Compare limit reached",
        description: "You can compare up to 4 products at once.",
        variant: "destructive",
      });
      return;
    }
    setCompareList((prev) => [...prev, productId]);
    toast({
      title: "Added to compare",
      description: "Product added to comparison list.",
    });
  };

  const removeFromCompare = (productId: string) => {
    setCompareList((prev) => prev.filter((id) => id !== productId));
  };

  const handleProductView = (product: Product) => {
    setRecentlyViewed((prev) => [
      product.id,
      ...prev.filter((id) => id !== product.id).slice(0, 9),
    ]);
    onProductSelect?.(product);
  };

  const activeFiltersCount = useMemo(() => {
    let count = 0;
    if (filters.categories.length > 0) count++;
    if (filters.priceRange[0] > 0 || filters.priceRange[1] < 1000) count++;
    if (filters.rating > 0) count++;
    if (filters.condition.length > 0) count++;
    if (filters.shipping.length > 0) count++;
    if (filters.brand.length > 0) count++;
    if (filters.location) count++;
    if (filters.sellerType.length > 0) count++;
    if (filters.availability.length > 0) count++;
    return count;
  }, [filters]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(price);
  };

  const FilterSection = ({
    title,
    children,
    defaultOpen = false,
  }: {
    title: string;
    children: React.ReactNode;
    defaultOpen?: boolean;
  }) => {
    const [isOpen, setIsOpen] = useState(defaultOpen);

    return (
      <div className="border-b pb-4 mb-4">
        <button
          className="flex items-center justify-between w-full text-left font-medium"
          onClick={() => setIsOpen(!isOpen)}
        >
          {title}
          <ChevronDown
            className={cn(
              "h-4 w-4 transition-transform",
              isOpen && "rotate-180",
            )}
          />
        </button>
        {isOpen && <div className="mt-3 space-y-2">{children}</div>}
      </div>
    );
  };

  const QuickFiltersBar = () => (
    <div className="flex flex-wrap gap-2 mb-4">
      <Button
        variant={
          filters.shipping.includes("Free Shipping") ? "default" : "outline"
        }
        size="sm"
        onClick={() => handleArrayFilterToggle("shipping", "Free Shipping")}
      >
        <Truck className="h-3 w-3 mr-1" />
        Free Shipping
      </Button>
      <Button
        variant={filters.rating >= 4 ? "default" : "outline"}
        size="sm"
        onClick={() =>
          handleFilterChange("rating", filters.rating >= 4 ? 0 : 4)
        }
      >
        <Star className="h-3 w-3 mr-1" />
        4+ Stars
      </Button>
      <Button
        variant={
          filters.availability.includes("In Stock") ? "default" : "outline"
        }
        size="sm"
        onClick={() => handleArrayFilterToggle("availability", "In Stock")}
      >
        <CheckCircle className="h-3 w-3 mr-1" />
        In Stock
      </Button>
      <Button
        variant={filters.sortBy === "discount" ? "default" : "outline"}
        size="sm"
        onClick={() =>
          handleFilterChange(
            "sortBy",
            filters.sortBy === "discount" ? "relevance" : "discount",
          )
        }
      >
        <Tag className="h-3 w-3 mr-1" />
        On Sale
      </Button>
    </div>
  );

  const FilterContent = () => (
    <div className="space-y-6">
      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
        <Input
          placeholder="Search products, brands, categories..."
          value={filters.searchQuery}
          onChange={(e) => handleFilterChange("searchQuery", e.target.value)}
          className="pl-10"
        />
        {filters.searchQuery && (
          <Button
            variant="ghost"
            size="sm"
            className="absolute right-2 top-2"
            onClick={saveSearch}
          >
            <Bookmark className="h-4 w-4" />
          </Button>
        )}
      </div>

      {/* Saved Searches */}
      {savedSearches.length > 0 && (
        <div>
          <Label className="text-sm font-medium mb-2 block">
            Saved Searches
          </Label>
          <div className="flex flex-wrap gap-1">
            {savedSearches.map((search, index) => (
              <Button
                key={index}
                variant="outline"
                size="sm"
                onClick={() => handleFilterChange("searchQuery", search)}
              >
                {search}
              </Button>
            ))}
          </div>
        </div>
      )}

      {/* Categories */}
      <FilterSection title="Categories" defaultOpen>
        <div className="grid grid-cols-2 gap-2">
          {filterOptions.categories.map((category) => (
            <div key={category} className="flex items-center space-x-2">
              <Checkbox
                id={`category-${category}`}
                checked={filters.categories.includes(category)}
                onCheckedChange={() =>
                  handleArrayFilterToggle("categories", category)
                }
              />
              <Label
                htmlFor={`category-${category}`}
                className="text-sm capitalize"
              >
                {category}
              </Label>
            </div>
          ))}
        </div>
      </FilterSection>

      {/* Price Range */}
      <FilterSection title="Price Range">
        <div className="space-y-3">
          <Slider
            value={filters.priceRange}
            onValueChange={(value) => handleFilterChange("priceRange", value)}
            max={1000}
            step={10}
            className="w-full"
          />
          <div className="flex items-center justify-between text-sm text-gray-600">
            <span>{formatPrice(filters.priceRange[0])}</span>
            <span>{formatPrice(filters.priceRange[1])}</span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <Input
              type="number"
              placeholder="Min"
              value={filters.priceRange[0]}
              onChange={(e) =>
                handleFilterChange("priceRange", [
                  Number(e.target.value) || 0,
                  filters.priceRange[1],
                ])
              }
            />
            <Input
              type="number"
              placeholder="Max"
              value={filters.priceRange[1]}
              onChange={(e) =>
                handleFilterChange("priceRange", [
                  filters.priceRange[0],
                  Number(e.target.value) || 1000,
                ])
              }
            />
          </div>
        </div>
      </FilterSection>

      {/* Rating */}
      <FilterSection title="Customer Rating">
        <RadioGroup
          value={filters.rating.toString()}
          onValueChange={(value) => handleFilterChange("rating", Number(value))}
        >
          {[4, 3, 2, 1, 0].map((rating) => (
            <div key={rating} className="flex items-center space-x-2">
              <RadioGroupItem
                value={rating.toString()}
                id={`rating-${rating}`}
              />
              <Label
                htmlFor={`rating-${rating}`}
                className="flex items-center space-x-1"
              >
                {rating > 0 ? (
                  <>
                    <div className="flex">
                      {Array.from({ length: 5 }, (_, i) => (
                        <Star
                          key={i}
                          className={cn(
                            "h-3 w-3",
                            i < rating
                              ? "fill-yellow-400 text-yellow-400"
                              : "text-gray-300",
                          )}
                        />
                      ))}
                    </div>
                    <span className="text-sm">& up</span>
                  </>
                ) : (
                  <span className="text-sm">All ratings</span>
                )}
              </Label>
            </div>
          ))}
        </RadioGroup>
      </FilterSection>

      {/* Condition */}
      <FilterSection title="Condition">
        {filterOptions.conditions.map((condition) => (
          <div key={condition} className="flex items-center space-x-2">
            <Checkbox
              id={`condition-${condition}`}
              checked={filters.condition.includes(condition)}
              onCheckedChange={() =>
                handleArrayFilterToggle("condition", condition)
              }
            />
            <Label
              htmlFor={`condition-${condition}`}
              className="text-sm capitalize"
            >
              {condition}
            </Label>
          </div>
        ))}
      </FilterSection>

      {/* Shipping */}
      <FilterSection title="Shipping Options">
        {filterOptions.shippingOptions.map((option) => (
          <div key={option} className="flex items-center space-x-2">
            <Checkbox
              id={`shipping-${option}`}
              checked={filters.shipping.includes(option)}
              onCheckedChange={() =>
                handleArrayFilterToggle("shipping", option)
              }
            />
            <Label htmlFor={`shipping-${option}`} className="text-sm">
              {option}
            </Label>
          </div>
        ))}
      </FilterSection>

      {/* Brand */}
      <FilterSection title="Brand">
        <div className="max-h-40 overflow-y-auto space-y-2">
          {filterOptions.brands.map((brand) => (
            <div key={brand} className="flex items-center space-x-2">
              <Checkbox
                id={`brand-${brand}`}
                checked={filters.brand.includes(brand)}
                onCheckedChange={() => handleArrayFilterToggle("brand", brand)}
              />
              <Label htmlFor={`brand-${brand}`} className="text-sm">
                {brand}
              </Label>
            </div>
          ))}
        </div>
      </FilterSection>

      {/* Clear Filters */}
      {activeFiltersCount > 0 && (
        <Button variant="outline" onClick={clearAllFilters} className="w-full">
          <RotateCcw className="h-4 w-4 mr-2" />
          Clear All Filters ({activeFiltersCount})
        </Button>
      )}
    </div>
  );

  return (
    <TooltipProvider>
      <div className="space-y-4">
        {/* Search and Controls Bar */}
        <Card>
          <CardContent className="p-4">
            <div className="flex flex-col space-y-4">
              {/* Main Search and Sort Row */}
              <div className="flex flex-col lg:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search products, brands, or categories..."
                    value={filters.searchQuery}
                    onChange={(e) =>
                      handleFilterChange("searchQuery", e.target.value)
                    }
                    className="pl-10 h-12"
                  />
                </div>

                <div className="flex gap-2">
                  <Select
                    value={filters.sortBy}
                    onValueChange={(value) =>
                      handleFilterChange("sortBy", value)
                    }
                  >
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Sort by" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="relevance">Best Match</SelectItem>
                      <SelectItem value="price_low">
                        Price: Low to High
                      </SelectItem>
                      <SelectItem value="price_high">
                        Price: High to Low
                      </SelectItem>
                      <SelectItem value="rating">Customer Rating</SelectItem>
                      <SelectItem value="newest">Newest First</SelectItem>
                      <SelectItem value="popular">Most Popular</SelectItem>
                      <SelectItem value="discount">Biggest Discount</SelectItem>
                    </SelectContent>
                  </Select>

                  {/* Mobile Filter Button */}
                  <Sheet open={showFilters} onOpenChange={setShowFilters}>
                    <SheetTrigger asChild>
                      <Button variant="outline" className="lg:hidden">
                        <Filter className="h-4 w-4 mr-2" />
                        Filters
                        {activeFiltersCount > 0 && (
                          <Badge
                            variant="destructive"
                            className="ml-2 h-5 w-5 p-0 text-xs"
                          >
                            {activeFiltersCount}
                          </Badge>
                        )}
                      </Button>
                    </SheetTrigger>
                    <SheetContent side="left" className="w-80">
                      <SheetHeader>
                        <SheetTitle>Filters</SheetTitle>
                        <SheetDescription>
                          Refine your search to find the perfect products
                        </SheetDescription>
                      </SheetHeader>
                      <div className="mt-6">
                        <FilterContent />
                      </div>
                    </SheetContent>
                  </Sheet>

                  {/* Desktop Filter Popover */}
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="hidden lg:flex items-center gap-2"
                      >
                        <SlidersHorizontal className="h-4 w-4" />
                        Filters
                        {activeFiltersCount > 0 && (
                          <Badge
                            variant="destructive"
                            className="h-5 w-5 p-0 text-xs"
                          >
                            {activeFiltersCount}
                          </Badge>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent
                      className="w-80 max-h-96 overflow-y-auto"
                      align="end"
                    >
                      <FilterContent />
                    </PopoverContent>
                  </Popover>

                  {/* View Mode Toggle */}
                  <div className="flex border rounded-lg">
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant={
                            filters.viewMode === "grid" ? "default" : "ghost"
                          }
                          size="sm"
                          onClick={() => handleFilterChange("viewMode", "grid")}
                        >
                          <Grid className="h-4 w-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>Grid View</TooltipContent>
                    </Tooltip>

                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant={
                            filters.viewMode === "list" ? "default" : "ghost"
                          }
                          size="sm"
                          onClick={() => handleFilterChange("viewMode", "list")}
                        >
                          <List className="h-4 w-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>List View</TooltipContent>
                    </Tooltip>
                  </div>
                </div>
              </div>

              {/* Quick Filters */}
              <QuickFiltersBar />

              {/* Active Filters Display */}
              {activeFiltersCount > 0 && (
                <div className="flex flex-wrap gap-2 items-center">
                  <span className="text-sm text-gray-600">Active filters:</span>
                  {filters.categories.map((category) => (
                    <Badge key={category} variant="secondary" className="gap-1">
                      {category}
                      <X
                        className="h-3 w-3 cursor-pointer"
                        onClick={() =>
                          handleArrayFilterToggle("categories", category)
                        }
                      />
                    </Badge>
                  ))}
                  {(filters.priceRange[0] > 0 ||
                    filters.priceRange[1] < 1000) && (
                    <Badge variant="secondary" className="gap-1">
                      {formatPrice(filters.priceRange[0])} -{" "}
                      {formatPrice(filters.priceRange[1])}
                      <X
                        className="h-3 w-3 cursor-pointer"
                        onClick={() =>
                          handleFilterChange("priceRange", [0, 1000])
                        }
                      />
                    </Badge>
                  )}
                  {filters.rating > 0 && (
                    <Badge variant="secondary" className="gap-1">
                      {filters.rating}+ Stars
                      <X
                        className="h-3 w-3 cursor-pointer"
                        onClick={() => handleFilterChange("rating", 0)}
                      />
                    </Badge>
                  )}
                  {filters.shipping.map((option) => (
                    <Badge key={option} variant="secondary" className="gap-1">
                      {option}
                      <X
                        className="h-3 w-3 cursor-pointer"
                        onClick={() =>
                          handleArrayFilterToggle("shipping", option)
                        }
                      />
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Compare Bar */}
        {compareList.length > 0 && (
          <Card className="bg-blue-50 border-blue-200">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Compare className="h-4 w-4 text-blue-600" />
                  <span className="text-blue-800 font-medium">
                    Comparing {compareList.length} products
                  </span>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline">
                    Compare Now
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => setCompareList([])}
                  >
                    Clear All
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Results Info */}
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-600">
            Showing {filteredProducts.length} of {products.length} products
            {filters.searchQuery && <span> for "{filters.searchQuery}"</span>}
          </div>
          {!compactMode && (
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                disabled={!filters.searchQuery}
                onClick={saveSearch}
              >
                <Bookmark className="h-4 w-4 mr-1" />
                Save Search
              </Button>
              <Button variant="outline" size="sm">
                <Share2 className="h-4 w-4 mr-1" />
                Share Results
              </Button>
            </div>
          )}
        </div>

        {/* Products Grid */}
        {isLoading ? (
          <div
            className={cn(
              "grid gap-4",
              filters.viewMode === "grid"
                ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
                : "grid-cols-1",
            )}
          >
            {Array.from({ length: 12 }).map((_, index) => (
              <Card key={index} className="h-80">
                <CardContent className="p-4 animate-pulse">
                  <div className="bg-gray-200 h-40 rounded mb-4"></div>
                  <div className="space-y-2">
                    <div className="bg-gray-200 h-4 rounded w-3/4"></div>
                    <div className="bg-gray-200 h-4 rounded w-1/2"></div>
                    <div className="bg-gray-200 h-6 rounded w-1/4"></div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : filteredProducts.length > 0 ? (
          <div
            className={cn(
              "grid gap-4",
              filters.viewMode === "grid"
                ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
                : "grid-cols-1",
            )}
          >
            {filteredProducts.map((product) => (
              <div key={product.id} className="relative group">
                <EnhancedProductCard
                  product={product}
                  onAddToCart={(id) => {
                    if (!isAuthenticated) {
                      toast({
                        title: "Authentication required",
                        description: "Please sign in to add items to your cart",
                        variant: "destructive",
                      });
                      return;
                    }
                    addToCart(id);
                  }}
                  onAddToWishlist={(id) => {
                    if (!isAuthenticated) {
                      toast({
                        title: "Authentication required",
                        description:
                          "Please sign in to add items to your wishlist",
                        variant: "destructive",
                      });
                      return;
                    }
                    addToWishlist(id);
                  }}
                  onViewProduct={() => handleProductView(product)}
                  view={filters.viewMode}
                  inWishlist={false}
                  inCart={false}
                />

                {/* Quick Actions Overlay */}
                <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity space-y-1">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        size="sm"
                        variant="secondary"
                        className="h-8 w-8 p-0"
                        onClick={() => addToCompare(product.id)}
                        disabled={compareList.includes(product.id)}
                      >
                        <Compare className="h-3 w-3" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Add to Compare</TooltipContent>
                  </Tooltip>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <Card className="py-12">
            <CardContent className="text-center">
              <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <Search className="h-6 w-6 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold mb-2">No products found</h3>
              <p className="text-gray-600 mb-4">
                Try adjusting your search criteria or filters
              </p>
              <div className="flex gap-2 justify-center">
                <Button variant="outline" onClick={clearAllFilters}>
                  Clear Filters
                </Button>
                <Button
                  variant="outline"
                  onClick={() => handleFilterChange("searchQuery", "")}
                >
                  Clear Search
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Recently Viewed */}
        {recentlyViewed.length > 0 && !compactMode && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Recently Viewed
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {recentlyViewed.slice(0, 6).map((productId) => {
                  const product = products.find((p) => p.id === productId);
                  if (!product) return null;

                  return (
                    <div
                      key={productId}
                      className="text-center cursor-pointer hover:shadow-md transition-shadow p-2 rounded"
                      onClick={() => handleProductView(product)}
                    >
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full aspect-square object-cover rounded mb-2"
                      />
                      <h4 className="text-sm font-medium truncate">
                        {product.name}
                      </h4>
                      <p className="text-sm text-green-600 font-semibold">
                        {formatPrice(product.discountPrice || product.price)}
                      </p>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </TooltipProvider>
  );
}
