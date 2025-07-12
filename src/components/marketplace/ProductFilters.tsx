import { useState, useEffect, useMemo } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import {
  Search,
  Filter,
  X,
  Star,
  TrendingUp,
  Clock,
  SortAsc,
  Sparkles,
  Package,
  Truck,
  Tag,
} from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { Card } from "@/components/ui/card";
import { useMarketplace } from "@/contexts/MarketplaceContext";

interface ProductFiltersProps {
  activeCategory: string;
  onCategoryChange: (category: string) => void;
  onSearch: (query: string) => void;
  onSortChange?: (sortBy: string, sortOrder: string) => void;
}

interface SearchSuggestion {
  type: "product" | "category" | "brand" | "recent";
  value: string;
  count?: number;
  icon?: React.ReactNode;
}

const ProductFilters = ({
  activeCategory,
  onCategoryChange,
  onSearch,
  onSortChange,
}: ProductFiltersProps) => {
  const [searchInput, setSearchInput] = useState("");
  const [priceRange, setPriceRange] = useState([0, 1000]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [selectedRating, setSelectedRating] = useState<number | null>(null);
  const [inStock, setInStock] = useState(false);
  const [freeShipping, setFreeShipping] = useState(false);
  const [onSale, setOnSale] = useState(false);
  const [sortBy, setSortBy] = useState("relevance");
  const [sortOrder, setSortOrder] = useState("desc");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const { setFilter, products } = useMarketplace();

  const productTags = [
    "wireless",
    "audio",
    "electronics",
    "wearable",
    "fitness",
    "apparel",
    "casual",
    "fashion",
    "skincare",
    "kitchen",
    "home",
    "organic",
    "sports",
    "premium",
    "eco-friendly",
    "new",
  ];

  const brands = [
    "Apple",
    "Samsung",
    "Sony",
    "Nike",
    "Adidas",
    "L'Oreal",
    "KitchenAid",
    "Organic Valley",
  ];

  const sortOptions = [
    { value: "relevance", label: "Most Relevant" },
    { value: "price", label: "Price" },
    { value: "rating", label: "Customer Rating" },
    { value: "newest", label: "Newest First" },
    { value: "popularity", label: "Most Popular" },
    { value: "discount", label: "Highest Discount" },
  ];

  // Search suggestions based on input
  const searchSuggestions = useMemo(() => {
    if (!searchInput.trim()) {
      // Show recent searches when no input
      return recentSearches.map((search) => ({
        type: "recent" as const,
        value: search,
        icon: <Clock className="h-4 w-4" />,
      }));
    }

    const suggestions: SearchSuggestion[] = [];
    const query = searchInput.toLowerCase();

    // Product name suggestions
    products?.forEach((product) => {
      if (product.name.toLowerCase().includes(query)) {
        suggestions.push({
          type: "product",
          value: product.name,
          icon: <Package className="h-4 w-4" />,
        });
      }
    });

    // Category suggestions
    const categories = [
      "Electronics",
      "Fashion",
      "Home & Garden",
      "Sports",
      "Beauty",
    ];
    categories.forEach((category) => {
      if (category.toLowerCase().includes(query)) {
        suggestions.push({
          type: "category",
          value: category,
          icon: <Tag className="h-4 w-4" />,
        });
      }
    });

    // Brand suggestions
    brands.forEach((brand) => {
      if (brand.toLowerCase().includes(query)) {
        suggestions.push({
          type: "brand",
          value: brand,
          icon: <Sparkles className="h-4 w-4" />,
        });
      }
    });

    return suggestions.slice(0, 6);
  }, [searchInput, products, recentSearches]);

  // Load recent searches from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("marketplace-recent-searches");
    if (saved) {
      setRecentSearches(JSON.parse(saved));
    }
  }, []);

  // Save search to recent searches
  const saveRecentSearch = (query: string) => {
    if (!query.trim()) return;

    const updated = [query, ...recentSearches.filter((s) => s !== query)].slice(
      0,
      5,
    );
    setRecentSearches(updated);
    localStorage.setItem(
      "marketplace-recent-searches",
      JSON.stringify(updated),
    );
  };

  const handleSearch = (query?: string) => {
    const searchQuery = query || searchInput;
    onSearch(searchQuery);
    saveRecentSearch(searchQuery);
    setShowSuggestions(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSearch();
    } else if (e.key === "Escape") {
      setShowSuggestions(false);
    }
  };

  const handleClearSearch = () => {
    setSearchInput("");
    onSearch("");
    setShowSuggestions(false);
  };

  const updateFilters = (newFilters: any) => {
    const filters = {
      ...newFilters,
      tags: selectedTags.length > 0 ? selectedTags : undefined,
      brands: selectedBrands.length > 0 ? selectedBrands : undefined,
      minRating: selectedRating,
      inStock,
      freeShipping,
      onSale,
    };
    setFilter(filters);
  };

  const handlePriceChange = (value: number[]) => {
    setPriceRange(value);
    updateFilters({ minPrice: value[0], maxPrice: value[1] });
  };

  const handleSortChange = (value: string) => {
    setSortBy(value);
    onSortChange?.(value, sortOrder);
  };

  const toggleSortOrder = () => {
    const newOrder = sortOrder === "asc" ? "desc" : "asc";
    setSortOrder(newOrder);
    onSortChange?.(sortBy, newOrder);
  };

  const handleTagToggle = (tag: string) => {
    const newTags = selectedTags.includes(tag)
      ? selectedTags.filter((t) => t !== tag)
      : [...selectedTags, tag];

    setSelectedTags(newTags);
    updateFilters({ tags: newTags.length > 0 ? newTags : undefined });
  };

  const handleBrandToggle = (brand: string) => {
    const newBrands = selectedBrands.includes(brand)
      ? selectedBrands.filter((b) => b !== brand)
      : [...selectedBrands, brand];

    setSelectedBrands(newBrands);
    updateFilters({ brands: newBrands.length > 0 ? newBrands : undefined });
  };

  const handleRatingFilter = (rating: number) => {
    const newRating = selectedRating === rating ? null : rating;
    setSelectedRating(newRating);
    updateFilters({ minRating: newRating });
  };

  const handleAdvancedFilter = (type: string, value: boolean) => {
    switch (type) {
      case "inStock":
        setInStock(value);
        updateFilters({ inStock: value });
        break;
      case "freeShipping":
        setFreeShipping(value);
        updateFilters({ freeShipping: value });
        break;
      case "onSale":
        setOnSale(value);
        updateFilters({ onSale: value });
        break;
    }
  };

  const handleClearFilters = () => {
    setPriceRange([0, 1000]);
    setSelectedTags([]);
    setSelectedBrands([]);
    setSelectedRating(null);
    setInStock(false);
    setFreeShipping(false);
    setOnSale(false);
    setSearchInput("");
    onSearch("");
    onCategoryChange("all");
    setSortBy("relevance");
    setSortOrder("desc");
    setFilter({});
  };

  const getActiveFiltersCount = () => {
    let count = 0;
    if (selectedTags.length > 0) count++;
    if (selectedBrands.length > 0) count++;
    if (selectedRating) count++;
    if (inStock) count++;
    if (freeShipping) count++;
    if (onSale) count++;
    if (priceRange[0] > 0 || priceRange[1] < 1000) count++;
    return count;
  };

  const handleSuggestionSelect = (suggestion: SearchSuggestion) => {
    setSearchInput(suggestion.value);
    handleSearch(suggestion.value);
  };

  return (
    <div className="space-y-6">
      {/* Enhanced Search with Autocomplete */}
      <div className="relative">
        <div className="relative">
          <Input
            placeholder="Search products, brands, categories..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            onKeyPress={handleKeyPress}
            onFocus={() => setShowSuggestions(true)}
            className="pl-9 pr-9"
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          {searchInput && (
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-1 top-1/2 transform -translate-y-1/2 h-6 w-6"
              onClick={handleClearSearch}
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>

        {/* Search Suggestions Dropdown */}
        {showSuggestions && searchSuggestions.length > 0 && (
          <Card className="absolute top-full left-0 right-0 z-50 mt-1 p-2 shadow-lg">
            <div className="space-y-1">
              {!searchInput && recentSearches.length > 0 && (
                <div className="text-xs text-muted-foreground mb-2 flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  Recent searches
                </div>
              )}
              {searchSuggestions.map((suggestion, index) => (
                <Button
                  key={index}
                  variant="ghost"
                  className="w-full justify-start h-auto p-2 text-sm"
                  onClick={() => handleSuggestionSelect(suggestion)}
                >
                  <div className="flex items-center gap-2">
                    {suggestion.icon}
                    <span>{suggestion.value}</span>
                    <Badge variant="secondary" className="ml-auto text-xs">
                      {suggestion.type}
                    </Badge>
                  </div>
                </Button>
              ))}
            </div>
          </Card>
        )}
      </div>

      {/* Sort Options */}
      <div className="flex items-center gap-2">
        <Select value={sortBy} onValueChange={handleSortChange}>
          <SelectTrigger className="flex-1">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {sortOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Button
          variant="outline"
          size="icon"
          onClick={toggleSortOrder}
          className="shrink-0"
        >
          <SortAsc
            className={`h-4 w-4 ${sortOrder === "desc" ? "rotate-180" : ""} transition-transform`}
          />
        </Button>
      </div>

      <Accordion
        type="multiple"
        defaultValue={["price", "tags", "advanced"]}
        className="w-full"
      >
        {/* Price Range */}
        <AccordionItem value="price">
          <AccordionTrigger>Price Range</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-4">
              <Slider
                defaultValue={[0, 1000]}
                value={priceRange}
                max={1000}
                step={10}
                onValueChange={handlePriceChange}
              />
              <div className="flex justify-between text-sm">
                <span>${priceRange[0]}</span>
                <span>${priceRange[1]}</span>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Customer Rating */}
        <AccordionItem value="rating">
          <AccordionTrigger>Customer Rating</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-2">
              {[5, 4, 3, 2, 1].map((rating) => (
                <Button
                  key={rating}
                  variant={selectedRating === rating ? "default" : "ghost"}
                  className="w-full justify-start"
                  onClick={() => handleRatingFilter(rating)}
                >
                  <div className="flex items-center gap-2">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`h-4 w-4 ${
                          i < rating
                            ? "fill-yellow-400 text-yellow-400"
                            : "text-gray-300"
                        }`}
                      />
                    ))}
                    <span className="ml-2">{rating}+ stars</span>
                  </div>
                </Button>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Brands */}
        <AccordionItem value="brands">
          <AccordionTrigger>Brands</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-2">
              {brands.map((brand) => (
                <div key={brand} className="flex items-center space-x-2">
                  <Checkbox
                    id={`brand-${brand}`}
                    checked={selectedBrands.includes(brand)}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        handleBrandToggle(brand);
                      } else {
                        handleBrandToggle(brand);
                      }
                    }}
                  />
                  <label
                    htmlFor={`brand-${brand}`}
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                  >
                    {brand}
                  </label>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Tags */}
        <AccordionItem value="tags">
          <AccordionTrigger>Tags</AccordionTrigger>
          <AccordionContent>
            <div className="flex flex-wrap gap-2">
              {productTags.map((tag) => (
                <Badge
                  key={tag}
                  variant={selectedTags.includes(tag) ? "default" : "outline"}
                  className="cursor-pointer capitalize"
                  onClick={() => handleTagToggle(tag)}
                >
                  {tag}
                </Badge>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Advanced Filters */}
        <AccordionItem value="advanced">
          <AccordionTrigger>Advanced Filters</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="in-stock"
                  checked={inStock}
                  onCheckedChange={(checked) =>
                    handleAdvancedFilter("inStock", !!checked)
                  }
                />
                <label
                  htmlFor="in-stock"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer flex items-center gap-2"
                >
                  <Package className="h-4 w-4" />
                  In Stock Only
                </label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="free-shipping"
                  checked={freeShipping}
                  onCheckedChange={(checked) =>
                    handleAdvancedFilter("freeShipping", !!checked)
                  }
                />
                <label
                  htmlFor="free-shipping"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer flex items-center gap-2"
                >
                  <Truck className="h-4 w-4" />
                  Free Shipping
                </label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="on-sale"
                  checked={onSale}
                  onCheckedChange={(checked) =>
                    handleAdvancedFilter("onSale", !!checked)
                  }
                />
                <label
                  htmlFor="on-sale"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer flex items-center gap-2"
                >
                  <Tag className="h-4 w-4" />
                  On Sale
                </label>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      {/* Clear Filters Button */}
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          className="flex-1"
          onClick={handleClearFilters}
        >
          <Filter className="h-4 w-4 mr-2" />
          Clear All Filters
          {getActiveFiltersCount() > 0 && (
            <Badge variant="secondary" className="ml-2">
              {getActiveFiltersCount()}
            </Badge>
          )}
        </Button>
      </div>

      {/* Active Filters Summary */}
      {getActiveFiltersCount() > 0 && (
        <div className="space-y-2">
          <Separator />
          <div className="text-sm text-muted-foreground">Active filters:</div>
          <div className="flex flex-wrap gap-1">
            {selectedTags.map((tag) => (
              <Badge key={tag} variant="secondary" className="text-xs">
                {tag}
                <X
                  className="h-3 w-3 ml-1 cursor-pointer"
                  onClick={() => handleTagToggle(tag)}
                />
              </Badge>
            ))}
            {selectedBrands.map((brand) => (
              <Badge key={brand} variant="secondary" className="text-xs">
                {brand}
                <X
                  className="h-3 w-3 ml-1 cursor-pointer"
                  onClick={() => handleBrandToggle(brand)}
                />
              </Badge>
            ))}
            {selectedRating && (
              <Badge variant="secondary" className="text-xs">
                {selectedRating}+ stars
                <X
                  className="h-3 w-3 ml-1 cursor-pointer"
                  onClick={() => handleRatingFilter(selectedRating)}
                />
              </Badge>
            )}
            {(inStock || freeShipping || onSale) && (
              <div className="flex gap-1">
                {inStock && (
                  <Badge variant="secondary" className="text-xs">
                    In Stock
                    <X
                      className="h-3 w-3 ml-1 cursor-pointer"
                      onClick={() => handleAdvancedFilter("inStock", false)}
                    />
                  </Badge>
                )}
                {freeShipping && (
                  <Badge variant="secondary" className="text-xs">
                    Free Shipping
                    <X
                      className="h-3 w-3 ml-1 cursor-pointer"
                      onClick={() =>
                        handleAdvancedFilter("freeShipping", false)
                      }
                    />
                  </Badge>
                )}
                {onSale && (
                  <Badge variant="secondary" className="text-xs">
                    On Sale
                    <X
                      className="h-3 w-3 ml-1 cursor-pointer"
                      onClick={() => handleAdvancedFilter("onSale", false)}
                    />
                  </Badge>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductFilters;
