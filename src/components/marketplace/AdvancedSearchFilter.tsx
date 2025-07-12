import React, {
  useState,
  useEffect,
  useMemo,
  useCallback,
  useRef,
} from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Search,
  Filter,
  X,
  ChevronDown,
  MapPin,
  Star,
  Truck,
  Shield,
  Zap,
  Tag,
  Calendar,
  TrendingUp,
  Award,
  Users,
  Clock,
  DollarSign,
  Package,
  Globe,
  Sparkles,
  Target,
  Bookmark,
  History,
  Sliders,
  ChevronRight,
  Check,
  ChevronsUpDown,
  SortAsc,
  SortDesc,
  RotateCcw,
  Save,
  Share2,
  Download,
  Upload,
  Eye,
  EyeOff,
  Plus,
  Minus,
} from "lucide-react";
import { useMarketplace } from "@/contexts/MarketplaceContext";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/components/ui/use-toast";
import { Product } from "@/types/marketplace";
import { cn } from "@/lib/utils";
import { debounce } from "lodash";

interface SearchFilters {
  query: string;
  categories: string[];
  priceRange: [number, number];
  rating: number;
  condition: string[];
  shipping: string[];
  brands: string[];
  sellers: string[];
  location: string;
  availability: string[];
  features: string[];
  dateRange: {
    from: Date | null;
    to: Date | null;
  };
  sortBy: string;
  sortOrder: "asc" | "desc";
  includeOutOfStock: boolean;
  verifiedSellersOnly: boolean;
  freeShippingOnly: boolean;
  newArrivalsOnly: boolean;
  onSaleOnly: boolean;
  localDeliveryOnly: boolean;
  customFields: Record<string, any>;
}

interface SavedSearch {
  id: string;
  name: string;
  filters: SearchFilters;
  alertEnabled: boolean;
  createdAt: Date;
  lastUsed: Date;
}

interface SearchSuggestion {
  type: "product" | "category" | "brand" | "query";
  value: string;
  label: string;
  count?: number;
  recent?: boolean;
}

interface AdvancedSearchFilterProps {
  onFiltersChange: (filters: SearchFilters) => void;
  initialFilters?: Partial<SearchFilters>;
  showSaveSearch?: boolean;
  compactMode?: boolean;
  className?: string;
}

const DEFAULT_FILTERS: SearchFilters = {
  query: "",
  categories: [],
  priceRange: [0, 1000],
  rating: 0,
  condition: [],
  shipping: [],
  brands: [],
  sellers: [],
  location: "",
  availability: [],
  features: [],
  dateRange: { from: null, to: null },
  sortBy: "relevance",
  sortOrder: "desc",
  includeOutOfStock: false,
  verifiedSellersOnly: false,
  freeShippingOnly: false,
  newArrivalsOnly: false,
  onSaleOnly: false,
  localDeliveryOnly: false,
  customFields: {},
};

export default function AdvancedSearchFilter({
  onFiltersChange,
  initialFilters = {},
  showSaveSearch = true,
  compactMode = false,
  className,
}: AdvancedSearchFilterProps) {
  const { products } = useMarketplace();
  const { isAuthenticated, user } = useAuth();
  const { toast } = useToast();

  const [filters, setFilters] = useState<SearchFilters>({
    ...DEFAULT_FILTERS,
    ...initialFilters,
  });

  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [searchSuggestions, setSearchSuggestions] = useState<
    SearchSuggestion[]
  >([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [savedSearches, setSavedSearches] = useState<SavedSearch[]>([]);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [popularSearches] = useState<string[]>([
    "wireless headphones",
    "smartphone case",
    "laptop stand",
    "fitness tracker",
    "coffee maker",
  ]);
  const [isFilterSheetOpen, setIsFilterSheetOpen] = useState(false);
  const [filterPresets] = useState([
    { name: "Best Deals", filters: { onSaleOnly: true, rating: 4 } },
    {
      name: "New & Popular",
      filters: { newArrivalsOnly: true, sortBy: "popular" },
    },
    {
      name: "Premium Products",
      filters: { verifiedSellersOnly: true, priceRange: [100, 1000] },
    },
    {
      name: "Quick Delivery",
      filters: { freeShippingOnly: true, shipping: ["Express", "Same Day"] },
    },
  ]);

  const searchInputRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);

  // Extract filter options from products
  const filterOptions = useMemo(() => {
    const categories = [...new Set(products.map((p) => p.category))];
    const brands = [...new Set(products.map((p) => p.sellerName))];
    const sellers = [...new Set(products.map((p) => p.sellerName))];
    const conditions = ["new", "used", "refurbished", "open-box"];
    const shippingOptions = [
      "Free Shipping",
      "Express",
      "Same Day",
      "Local Pickup",
      "International",
    ];
    const features = [
      "Best Seller",
      "Editor's Choice",
      "Eco-Friendly",
      "Premium Quality",
      "Limited Edition",
      "Exclusive",
      "Trending",
      "Award Winner",
    ];
    const availability = [
      "In Stock",
      "Limited Stock",
      "Pre-Order",
      "Back Order",
    ];
    const sortOptions = [
      { value: "relevance", label: "Best Match" },
      { value: "price", label: "Price" },
      { value: "rating", label: "Customer Rating" },
      { value: "newest", label: "Newest First" },
      { value: "popular", label: "Most Popular" },
      { value: "discount", label: "Biggest Discount" },
      { value: "sales", label: "Best Selling" },
      { value: "reviews", label: "Most Reviewed" },
    ];

    return {
      categories,
      brands,
      sellers,
      conditions,
      shippingOptions,
      features,
      availability,
      sortOptions,
    };
  }, [products]);

  // Debounced search function
  const debouncedSearch = useCallback(
    debounce((query: string) => {
      if (query.length >= 2) {
        generateSearchSuggestions(query);
      } else {
        setSearchSuggestions([]);
      }
    }, 300),
    [products],
  );

  // Generate search suggestions
  const generateSearchSuggestions = useCallback(
    (query: string) => {
      const suggestions: SearchSuggestion[] = [];
      const lowerQuery = query.toLowerCase();

      // Product name suggestions
      products.forEach((product) => {
        if (product.name.toLowerCase().includes(lowerQuery)) {
          suggestions.push({
            type: "product",
            value: product.name,
            label: product.name,
            count: 1,
          });
        }
      });

      // Category suggestions
      filterOptions.categories.forEach((category) => {
        if (category.toLowerCase().includes(lowerQuery)) {
          const count = products.filter((p) => p.category === category).length;
          suggestions.push({
            type: "category",
            value: category,
            label: `${category} (${count} products)`,
            count,
          });
        }
      });

      // Brand suggestions
      filterOptions.brands.forEach((brand) => {
        if (brand.toLowerCase().includes(lowerQuery)) {
          const count = products.filter((p) => p.sellerName === brand).length;
          suggestions.push({
            type: "brand",
            value: brand,
            label: `${brand} (${count} products)`,
            count,
          });
        }
      });

      // Recent searches
      recentSearches
        .filter((search) => search.toLowerCase().includes(lowerQuery))
        .forEach((search) => {
          suggestions.push({
            type: "query",
            value: search,
            label: search,
            recent: true,
          });
        });

      setSearchSuggestions(suggestions.slice(0, 8));
    },
    [products, filterOptions, recentSearches],
  );

  // Update filters and notify parent
  const updateFilters = useCallback(
    (newFilters: Partial<SearchFilters>) => {
      const updated = { ...filters, ...newFilters };
      setFilters(updated);
      onFiltersChange(updated);
    },
    [filters, onFiltersChange],
  );

  // Handle search input change
  const handleSearchChange = (value: string) => {
    updateFilters({ query: value });
    debouncedSearch(value);
    if (value.length >= 2) {
      setShowSuggestions(true);
    } else {
      setShowSuggestions(false);
    }
  };

  // Handle search submission
  const handleSearchSubmit = (query?: string) => {
    const searchQuery = query || filters.query;
    if (searchQuery && !recentSearches.includes(searchQuery)) {
      setRecentSearches((prev) => [searchQuery, ...prev.slice(0, 4)]);
    }
    setShowSuggestions(false);

    // Auto-apply smart filters based on search query
    const smartFilters = getSmartFilters(searchQuery);
    if (Object.keys(smartFilters).length > 0) {
      updateFilters(smartFilters);
      toast({
        title: "Smart filters applied",
        description:
          "We've automatically applied relevant filters based on your search.",
      });
    }
  };

  // Get smart filters based on search query
  const getSmartFilters = (query: string): Partial<SearchFilters> => {
    const smartFilters: Partial<SearchFilters> = {};
    const lowerQuery = query.toLowerCase();

    // Price-based keywords
    if (
      ["cheap", "budget", "affordable", "under"].some((word) =>
        lowerQuery.includes(word),
      )
    ) {
      smartFilters.priceRange = [0, 50];
      smartFilters.sortBy = "price";
      smartFilters.sortOrder = "asc";
    } else if (
      ["premium", "luxury", "expensive", "high-end"].some((word) =>
        lowerQuery.includes(word),
      )
    ) {
      smartFilters.priceRange = [200, 1000];
      smartFilters.verifiedSellersOnly = true;
    }

    // Quality-based keywords
    if (
      ["best", "top", "highest rated", "excellent"].some((word) =>
        lowerQuery.includes(word),
      )
    ) {
      smartFilters.rating = 4;
      smartFilters.sortBy = "rating";
    }

    // Speed-based keywords
    if (
      ["fast", "quick", "express", "urgent"].some((word) =>
        lowerQuery.includes(word),
      )
    ) {
      smartFilters.freeShippingOnly = true;
      smartFilters.shipping = ["Express", "Same Day"];
    }

    // New/trending keywords
    if (
      ["new", "latest", "trending", "recent"].some((word) =>
        lowerQuery.includes(word),
      )
    ) {
      smartFilters.newArrivalsOnly = true;
      smartFilters.sortBy = "newest";
    }

    // Sale keywords
    if (
      ["sale", "discount", "deal", "offer"].some((word) =>
        lowerQuery.includes(word),
      )
    ) {
      smartFilters.onSaleOnly = true;
      smartFilters.sortBy = "discount";
    }

    return smartFilters;
  };

  // Save current search
  const saveCurrentSearch = () => {
    if (!isAuthenticated) {
      toast({
        title: "Authentication required",
        description: "Please sign in to save searches",
        variant: "destructive",
      });
      return;
    }

    const searchName =
      filters.query || `Search ${new Date().toLocaleDateString()}`;
    const newSavedSearch: SavedSearch = {
      id: Date.now().toString(),
      name: searchName,
      filters: { ...filters },
      alertEnabled: false,
      createdAt: new Date(),
      lastUsed: new Date(),
    };

    setSavedSearches((prev) => [newSavedSearch, ...prev.slice(0, 9)]);
    toast({
      title: "Search saved",
      description: `"${searchName}" has been saved to your searches`,
    });
  };

  // Load saved search
  const loadSavedSearch = (savedSearch: SavedSearch) => {
    setFilters(savedSearch.filters);
    onFiltersChange(savedSearch.filters);

    // Update last used
    setSavedSearches((prev) =>
      prev.map((search) =>
        search.id === savedSearch.id
          ? { ...search, lastUsed: new Date() }
          : search,
      ),
    );

    toast({
      title: "Search loaded",
      description: `"${savedSearch.name}" filters have been applied`,
    });
  };

  // Apply filter preset
  const applyPreset = (preset: (typeof filterPresets)[0]) => {
    const newFilters = { ...DEFAULT_FILTERS, ...preset.filters };
    setFilters(newFilters);
    onFiltersChange(newFilters);

    toast({
      title: "Preset applied",
      description: `"${preset.name}" filters have been applied`,
    });
  };

  // Clear all filters
  const clearAllFilters = () => {
    setFilters(DEFAULT_FILTERS);
    onFiltersChange(DEFAULT_FILTERS);
    setShowSuggestions(false);

    toast({
      title: "Filters cleared",
      description: "All search filters have been reset",
    });
  };

  // Toggle array filter
  const toggleArrayFilter = (key: keyof SearchFilters, value: string) => {
    const currentArray = filters[key] as string[];
    const newArray = currentArray.includes(value)
      ? currentArray.filter((item) => item !== value)
      : [...currentArray, value];

    updateFilters({ [key]: newArray });
  };

  // Count active filters
  const activeFiltersCount = useMemo(() => {
    let count = 0;
    if (filters.query) count++;
    if (filters.categories.length > 0) count++;
    if (filters.priceRange[0] > 0 || filters.priceRange[1] < 1000) count++;
    if (filters.rating > 0) count++;
    if (filters.condition.length > 0) count++;
    if (filters.shipping.length > 0) count++;
    if (filters.brands.length > 0) count++;
    if (filters.location) count++;
    if (filters.availability.length > 0) count++;
    if (filters.features.length > 0) count++;
    if (filters.verifiedSellersOnly) count++;
    if (filters.freeShippingOnly) count++;
    if (filters.newArrivalsOnly) count++;
    if (filters.onSaleOnly) count++;
    return count;
  }, [filters]);

  // Format price
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(price);
  };

  // Render filter section
  const FilterSection = ({
    title,
    children,
    collapsible = true,
    defaultOpen = false,
    icon,
  }: {
    title: string;
    children: React.ReactNode;
    collapsible?: boolean;
    defaultOpen?: boolean;
    icon?: React.ReactNode;
  }) => {
    const [isOpen, setIsOpen] = useState(defaultOpen);

    if (!collapsible) {
      return (
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            {icon}
            <h3 className="font-medium text-sm">{title}</h3>
          </div>
          {children}
        </div>
      );
    }

    return (
      <div className="border-b pb-4 last:border-b-0">
        <button
          className="flex items-center justify-between w-full text-left mb-3"
          onClick={() => setIsOpen(!isOpen)}
        >
          <div className="flex items-center gap-2">
            {icon}
            <h3 className="font-medium text-sm">{title}</h3>
          </div>
          <ChevronDown
            className={cn(
              "h-4 w-4 transition-transform",
              isOpen && "rotate-180",
            )}
          />
        </button>
        {isOpen && <div className="space-y-3">{children}</div>}
      </div>
    );
  };

  return (
    <TooltipProvider>
      <div className={cn("space-y-4", className)}>
        {/* Main Search Bar */}
        <Card>
          <CardContent className="p-4">
            <div className="space-y-4">
              {/* Search Input with Suggestions */}
              <div className="relative">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    ref={searchInputRef}
                    placeholder="Search for products, brands, categories..."
                    value={filters.query}
                    onChange={(e) => handleSearchChange(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        handleSearchSubmit();
                      }
                      if (e.key === "Escape") {
                        setShowSuggestions(false);
                      }
                    }}
                    onFocus={() => {
                      if (filters.query.length >= 2) {
                        setShowSuggestions(true);
                      }
                    }}
                    className="pl-10 pr-10 h-12"
                  />
                  {filters.query && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="absolute right-2 top-2"
                      onClick={() => {
                        updateFilters({ query: "" });
                        setShowSuggestions(false);
                        searchInputRef.current?.focus();
                      }}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>

                {/* Search Suggestions */}
                {showSuggestions &&
                  (searchSuggestions.length > 0 ||
                    recentSearches.length > 0 ||
                    popularSearches.length > 0) && (
                    <div
                      ref={suggestionsRef}
                      className="absolute top-full left-0 right-0 z-50 mt-1 bg-white border rounded-lg shadow-lg max-h-80 overflow-y-auto"
                    >
                      {searchSuggestions.length > 0 && (
                        <div className="p-2">
                          <div className="text-xs font-medium text-gray-500 mb-2 px-2">
                            Suggestions
                          </div>
                          {searchSuggestions.map((suggestion, index) => (
                            <button
                              key={index}
                              className="w-full text-left px-3 py-2 text-sm hover:bg-gray-50 rounded flex items-center gap-2"
                              onClick={() => {
                                if (suggestion.type === "category") {
                                  updateFilters({
                                    query: "",
                                    categories: [suggestion.value],
                                  });
                                } else if (suggestion.type === "brand") {
                                  updateFilters({
                                    query: "",
                                    brands: [suggestion.value],
                                  });
                                } else {
                                  updateFilters({ query: suggestion.value });
                                }
                                handleSearchSubmit(suggestion.value);
                              }}
                            >
                              {suggestion.type === "product" && (
                                <Package className="h-4 w-4 text-gray-400" />
                              )}
                              {suggestion.type === "category" && (
                                <Tag className="h-4 w-4 text-gray-400" />
                              )}
                              {suggestion.type === "brand" && (
                                <Award className="h-4 w-4 text-gray-400" />
                              )}
                              {suggestion.type === "query" &&
                                (suggestion.recent ? (
                                  <History className="h-4 w-4 text-gray-400" />
                                ) : (
                                  <Search className="h-4 w-4 text-gray-400" />
                                ))}
                              <span className="flex-1">{suggestion.label}</span>
                              {suggestion.recent && (
                                <Badge variant="outline" className="text-xs">
                                  Recent
                                </Badge>
                              )}
                            </button>
                          ))}
                        </div>
                      )}

                      {recentSearches.length > 0 &&
                        !searchSuggestions.length && (
                          <div className="p-2">
                            <div className="text-xs font-medium text-gray-500 mb-2 px-2">
                              Recent Searches
                            </div>
                            {recentSearches.map((search, index) => (
                              <button
                                key={index}
                                className="w-full text-left px-3 py-2 text-sm hover:bg-gray-50 rounded flex items-center gap-2"
                                onClick={() => {
                                  updateFilters({ query: search });
                                  handleSearchSubmit(search);
                                }}
                              >
                                <History className="h-4 w-4 text-gray-400" />
                                {search}
                              </button>
                            ))}
                          </div>
                        )}

                      {popularSearches.length > 0 &&
                        !searchSuggestions.length &&
                        !recentSearches.length && (
                          <div className="p-2">
                            <div className="text-xs font-medium text-gray-500 mb-2 px-2">
                              Popular Searches
                            </div>
                            {popularSearches.map((search, index) => (
                              <button
                                key={index}
                                className="w-full text-left px-3 py-2 text-sm hover:bg-gray-50 rounded flex items-center gap-2"
                                onClick={() => {
                                  updateFilters({ query: search });
                                  handleSearchSubmit(search);
                                }}
                              >
                                <TrendingUp className="h-4 w-4 text-gray-400" />
                                {search}
                              </button>
                            ))}
                          </div>
                        )}
                    </div>
                  )}
              </div>

              {/* Filter Presets */}
              <div className="flex flex-wrap gap-2">
                {filterPresets.map((preset, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    size="sm"
                    onClick={() => applyPreset(preset)}
                    className="flex items-center gap-1"
                  >
                    <Sparkles className="h-3 w-3" />
                    {preset.name}
                  </Button>
                ))}
              </div>

              {/* Controls Row */}
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                  {/* Mobile Filters */}
                  <Sheet
                    open={isFilterSheetOpen}
                    onOpenChange={setIsFilterSheetOpen}
                  >
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
                    <SheetContent side="left" className="w-80 overflow-y-auto">
                      <SheetHeader>
                        <SheetTitle>Search Filters</SheetTitle>
                        <SheetDescription>
                          Refine your search to find exactly what you're looking
                          for
                        </SheetDescription>
                      </SheetHeader>
                      <div className="mt-6 space-y-6">
                        {/* Mobile Categories */}
                        <FilterSection
                          title="Categories"
                          icon={<Tag className="h-4 w-4" />}
                          defaultOpen
                        >
                          <div className="space-y-2 max-h-40 overflow-y-auto">
                            {filterOptions.categories.map((category) => (
                              <label
                                key={category}
                                className="flex items-center space-x-2 cursor-pointer"
                              >
                                <Checkbox
                                  checked={filters.categories.includes(
                                    category,
                                  )}
                                  onCheckedChange={() =>
                                    toggleArrayFilter("categories", category)
                                  }
                                />
                                <span className="text-sm capitalize">
                                  {category}
                                </span>
                              </label>
                            ))}
                          </div>
                        </FilterSection>

                        {/* Mobile Price Range */}
                        <FilterSection
                          title="Price Range"
                          icon={<DollarSign className="h-4 w-4" />}
                          defaultOpen
                        >
                          <div className="space-y-3">
                            <div className="px-2">
                              <Slider
                                value={filters.priceRange}
                                onValueChange={(value) =>
                                  updateFilters({
                                    priceRange: value as [number, number],
                                  })
                                }
                                max={1000}
                                step={10}
                                className="w-full"
                              />
                            </div>
                            <div className="flex items-center justify-between text-sm text-gray-600">
                              <span>{formatPrice(filters.priceRange[0])}</span>
                              <span>{formatPrice(filters.priceRange[1])}</span>
                            </div>
                          </div>
                        </FilterSection>

                        {/* Mobile Quick Filters */}
                        <FilterSection
                          title="Quick Filters"
                          icon={<Zap className="h-4 w-4" />}
                          defaultOpen
                        >
                          <div className="space-y-2">
                            <label className="flex items-center space-x-2 cursor-pointer">
                              <Checkbox
                                checked={filters.freeShippingOnly}
                                onCheckedChange={(checked) =>
                                  updateFilters({ freeShippingOnly: !!checked })
                                }
                              />
                              <span className="text-sm">
                                Free shipping only
                              </span>
                            </label>
                            <label className="flex items-center space-x-2 cursor-pointer">
                              <Checkbox
                                checked={filters.verifiedSellersOnly}
                                onCheckedChange={(checked) =>
                                  updateFilters({
                                    verifiedSellersOnly: !!checked,
                                  })
                                }
                              />
                              <span className="text-sm">
                                Verified sellers only
                              </span>
                            </label>
                            <label className="flex items-center space-x-2 cursor-pointer">
                              <Checkbox
                                checked={filters.onSaleOnly}
                                onCheckedChange={(checked) =>
                                  updateFilters({ onSaleOnly: !!checked })
                                }
                              />
                              <span className="text-sm">On sale only</span>
                            </label>
                          </div>
                        </FilterSection>
                      </div>
                    </SheetContent>
                  </Sheet>

                  {/* Desktop Advanced Filters Toggle */}
                  <Button
                    variant="outline"
                    onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
                    className="hidden lg:flex items-center gap-2"
                  >
                    <Sliders className="h-4 w-4" />
                    Advanced Filters
                    {activeFiltersCount > 0 && (
                      <Badge
                        variant="destructive"
                        className="h-5 w-5 p-0 text-xs"
                      >
                        {activeFiltersCount}
                      </Badge>
                    )}
                  </Button>

                  {/* Sort Controls */}
                  <div className="flex items-center gap-2">
                    <Select
                      value={filters.sortBy}
                      onValueChange={(value) =>
                        updateFilters({ sortBy: value })
                      }
                    >
                      <SelectTrigger className="w-[160px]">
                        <SelectValue placeholder="Sort by" />
                      </SelectTrigger>
                      <SelectContent>
                        {filterOptions.sortOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        updateFilters({
                          sortOrder:
                            filters.sortOrder === "asc" ? "desc" : "asc",
                        })
                      }
                    >
                      {filters.sortOrder === "asc" ? (
                        <SortAsc className="h-4 w-4" />
                      ) : (
                        <SortDesc className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {/* Save Search */}
                  {showSaveSearch && isAuthenticated && (
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={saveCurrentSearch}
                        >
                          <Save className="h-4 w-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>Save Search</TooltipContent>
                    </Tooltip>
                  )}

                  {/* Clear Filters */}
                  {activeFiltersCount > 0 && (
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={clearAllFilters}
                        >
                          <RotateCcw className="h-4 w-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>Clear All Filters</TooltipContent>
                    </Tooltip>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Advanced Filters Panel */}
        {showAdvancedFilters && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Advanced Filters</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowAdvancedFilters(false)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {/* Categories */}
                <FilterSection
                  title="Categories"
                  icon={<Tag className="h-4 w-4" />}
                >
                  <div className="space-y-2 max-h-40 overflow-y-auto">
                    {filterOptions.categories.map((category) => (
                      <label
                        key={category}
                        className="flex items-center space-x-2 cursor-pointer"
                      >
                        <Checkbox
                          checked={filters.categories.includes(category)}
                          onCheckedChange={() =>
                            toggleArrayFilter("categories", category)
                          }
                        />
                        <span className="text-sm capitalize">{category}</span>
                        <span className="text-xs text-gray-500">
                          (
                          {
                            products.filter((p) => p.category === category)
                              .length
                          }
                          )
                        </span>
                      </label>
                    ))}
                  </div>
                </FilterSection>

                {/* Price Range */}
                <FilterSection
                  title="Price Range"
                  icon={<DollarSign className="h-4 w-4" />}
                >
                  <div className="space-y-3">
                    <div className="px-2">
                      <Slider
                        value={filters.priceRange}
                        onValueChange={(value) =>
                          updateFilters({
                            priceRange: value as [number, number],
                          })
                        }
                        max={1000}
                        step={10}
                        className="w-full"
                      />
                    </div>
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
                          updateFilters({
                            priceRange: [
                              Number(e.target.value) || 0,
                              filters.priceRange[1],
                            ],
                          })
                        }
                        className="text-sm"
                      />
                      <Input
                        type="number"
                        placeholder="Max"
                        value={filters.priceRange[1]}
                        onChange={(e) =>
                          updateFilters({
                            priceRange: [
                              filters.priceRange[0],
                              Number(e.target.value) || 1000,
                            ],
                          })
                        }
                        className="text-sm"
                      />
                    </div>
                  </div>
                </FilterSection>

                {/* Rating */}
                <FilterSection
                  title="Customer Rating"
                  icon={<Star className="h-4 w-4" />}
                >
                  <RadioGroup
                    value={filters.rating.toString()}
                    onValueChange={(value) =>
                      updateFilters({ rating: Number(value) })
                    }
                  >
                    {[4, 3, 2, 1, 0].map((rating) => (
                      <div key={rating} className="flex items-center space-x-2">
                        <RadioGroupItem
                          value={rating.toString()}
                          id={`rating-${rating}`}
                        />
                        <Label
                          htmlFor={`rating-${rating}`}
                          className="flex items-center space-x-1 cursor-pointer"
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

                {/* Quick Toggles */}
                <FilterSection
                  title="Quick Filters"
                  icon={<Zap className="h-4 w-4" />}
                >
                  <div className="space-y-2">
                    <label className="flex items-center space-x-2 cursor-pointer">
                      <Checkbox
                        checked={filters.freeShippingOnly}
                        onCheckedChange={(checked) =>
                          updateFilters({ freeShippingOnly: !!checked })
                        }
                      />
                      <span className="text-sm">Free shipping only</span>
                    </label>
                    <label className="flex items-center space-x-2 cursor-pointer">
                      <Checkbox
                        checked={filters.verifiedSellersOnly}
                        onCheckedChange={(checked) =>
                          updateFilters({ verifiedSellersOnly: !!checked })
                        }
                      />
                      <span className="text-sm">Verified sellers only</span>
                    </label>
                    <label className="flex items-center space-x-2 cursor-pointer">
                      <Checkbox
                        checked={filters.newArrivalsOnly}
                        onCheckedChange={(checked) =>
                          updateFilters({ newArrivalsOnly: !!checked })
                        }
                      />
                      <span className="text-sm">New arrivals only</span>
                    </label>
                    <label className="flex items-center space-x-2 cursor-pointer">
                      <Checkbox
                        checked={filters.onSaleOnly}
                        onCheckedChange={(checked) =>
                          updateFilters({ onSaleOnly: !!checked })
                        }
                      />
                      <span className="text-sm">On sale only</span>
                    </label>
                    <label className="flex items-center space-x-2 cursor-pointer">
                      <Checkbox
                        checked={filters.includeOutOfStock}
                        onCheckedChange={(checked) =>
                          updateFilters({ includeOutOfStock: !!checked })
                        }
                      />
                      <span className="text-sm">Include out of stock</span>
                    </label>
                  </div>
                </FilterSection>
              </div>

              {/* Additional filter sections can be added here */}
            </CardContent>
          </Card>
        )}

        {/* Active Filters Display */}
        {activeFiltersCount > 0 && (
          <Card>
            <CardContent className="p-4">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-sm font-medium text-gray-600">
                  Active filters:
                </span>

                {filters.query && (
                  <Badge variant="secondary" className="gap-1">
                    <Search className="h-3 w-3" />"{filters.query}"
                    <X
                      className="h-3 w-3 cursor-pointer"
                      onClick={() => updateFilters({ query: "" })}
                    />
                  </Badge>
                )}

                {filters.categories.map((category) => (
                  <Badge key={category} variant="secondary" className="gap-1">
                    <Tag className="h-3 w-3" />
                    {category}
                    <X
                      className="h-3 w-3 cursor-pointer"
                      onClick={() => toggleArrayFilter("categories", category)}
                    />
                  </Badge>
                ))}

                {(filters.priceRange[0] > 0 ||
                  filters.priceRange[1] < 1000) && (
                  <Badge variant="secondary" className="gap-1">
                    <DollarSign className="h-3 w-3" />
                    {formatPrice(filters.priceRange[0])} -{" "}
                    {formatPrice(filters.priceRange[1])}
                    <X
                      className="h-3 w-3 cursor-pointer"
                      onClick={() => updateFilters({ priceRange: [0, 1000] })}
                    />
                  </Badge>
                )}

                {filters.rating > 0 && (
                  <Badge variant="secondary" className="gap-1">
                    <Star className="h-3 w-3" />
                    {filters.rating}+ stars
                    <X
                      className="h-3 w-3 cursor-pointer"
                      onClick={() => updateFilters({ rating: 0 })}
                    />
                  </Badge>
                )}

                {filters.freeShippingOnly && (
                  <Badge variant="secondary" className="gap-1">
                    <Truck className="h-3 w-3" />
                    Free shipping
                    <X
                      className="h-3 w-3 cursor-pointer"
                      onClick={() => updateFilters({ freeShippingOnly: false })}
                    />
                  </Badge>
                )}

                {filters.verifiedSellersOnly && (
                  <Badge variant="secondary" className="gap-1">
                    <Shield className="h-3 w-3" />
                    Verified sellers
                    <X
                      className="h-3 w-3 cursor-pointer"
                      onClick={() =>
                        updateFilters({ verifiedSellersOnly: false })
                      }
                    />
                  </Badge>
                )}

                <Button
                  variant="outline"
                  size="sm"
                  onClick={clearAllFilters}
                  className="ml-2"
                >
                  <RotateCcw className="h-4 w-4 mr-1" />
                  Clear all
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Saved Searches */}
        {savedSearches.length > 0 && showSaveSearch && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bookmark className="h-5 w-5" />
                Saved Searches
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {savedSearches.map((savedSearch) => (
                  <div
                    key={savedSearch.id}
                    className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 cursor-pointer"
                    onClick={() => loadSavedSearch(savedSearch)}
                  >
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-sm truncate">
                        {savedSearch.name}
                      </div>
                      <div className="text-xs text-gray-500">
                        Last used: {savedSearch.lastUsed.toLocaleDateString()}
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSavedSearches((prev) =>
                          prev.filter((s) => s.id !== savedSearch.id),
                        );
                      }}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </TooltipProvider>
  );
}
