import React, { useState } from "react";
import {
  Search,
  Filter,
  MoreHorizontal,
  Grid,
  Zap,
  Home,
  Star,
  Truck,
  Tag,
  Sparkles,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Link } from "react-router-dom";

interface CategoryFilter {
  id: string;
  name: string;
  icon: React.ReactNode;
  active?: boolean;
}

interface FeatureFilter {
  id: string;
  name: string;
  icon: React.ReactNode;
  active?: boolean;
}

interface EnhancedMarketplaceHeaderProps {
  onSearch?: (query: string) => void;
  onCategoryChange?: (categoryId: string) => void;
  onFilterChange?: (filterId: string) => void;
  className?: string;
}

const categoryFilters: CategoryFilter[] = [
  { id: "all", name: "All", icon: <Grid className="w-4 h-4" />, active: true },
  { id: "electronics", name: "Electronics", icon: <Zap className="w-4 h-4" /> },
  { id: "fashion", name: "Fashion", icon: <Star className="w-4 h-4" /> },
  { id: "home", name: "Home", icon: <Home className="w-4 h-4" /> },
  { id: "books", name: "Books", icon: <Sparkles className="w-4 h-4" /> },
];

const featureFilters: FeatureFilter[] = [
  {
    id: "free-shipping",
    name: "Free Shipping",
    icon: <Truck className="w-4 h-4" />,
  },
  { id: "4-stars", name: "4+ Stars", icon: <Star className="w-4 h-4" /> },
  { id: "on-sale", name: "On Sale", icon: <Tag className="w-4 h-4" /> },
  { id: "new", name: "New", icon: <Sparkles className="w-4 h-4" /> },
];

export const EnhancedMarketplaceHeader: React.FC<
  EnhancedMarketplaceHeaderProps
> = ({ onSearch, onCategoryChange, onFilterChange, className }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch?.(searchQuery);
  };

  const handleCategoryClick = (categoryId: string) => {
    setActiveCategory(categoryId);
    onCategoryChange?.(categoryId);
  };

  const handleFilterClick = (filterId: string) => {
    const newFilters = activeFilters.includes(filterId)
      ? activeFilters.filter((id) => id !== filterId)
      : [...activeFilters, filterId];

    setActiveFilters(newFilters);
    onFilterChange?.(filterId);
  };

  return (
    <div className={cn("bg-white border-b border-gray-200", className)}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header with Search */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 py-4">
          <div className="flex items-center gap-3 flex-shrink-0">
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Marketplace</h1>
            <Button variant="outline" size="sm" asChild>
              <Link to="/app/marketplace/my">Dashboard</Link>
            </Button>
          </div>

          <div className="flex items-center gap-2 sm:gap-4 flex-1 max-w-full">
            {/* Search Bar */}
            <form onSubmit={handleSearch} className="relative flex-1 max-w-md">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 w-full"
                />
              </div>
            </form>

            {/* Action Buttons */}
            <div className="flex items-center gap-1 flex-shrink-0">
              {/* Mobile Filter Button */}
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowMobileFilters(true)}
                className="md:hidden relative"
              >
                <Filter className="h-5 w-5" />
                {activeFilters.length > 0 && (
                  <span className="absolute -top-1 -right-1 w-3 h-3 bg-blue-600 text-white text-xs rounded-full flex items-center justify-center">
                    {activeFilters.length}
                  </span>
                )}
              </Button>
              <Button variant="ghost" size="icon" className="hidden md:flex">
                <MoreHorizontal className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>

        {/* Desktop Category Filters */}
        <div className="hidden md:block pb-4">
          <div className="flex items-center gap-2 mb-4 overflow-x-auto scrollbar-hide">
            {categoryFilters.map((category) => (
              <Button
                key={category.id}
                variant={activeCategory === category.id ? "default" : "outline"}
                size="sm"
                onClick={() => handleCategoryClick(category.id)}
                className={cn(
                  "flex items-center gap-2 rounded-full px-4 py-2 whitespace-nowrap flex-shrink-0",
                  activeCategory === category.id
                    ? "bg-blue-600 text-white hover:bg-blue-700"
                    : "bg-gray-50 text-gray-700 hover:bg-gray-100",
                )}
              >
                {category.icon}
                <span>{category.name}</span>
              </Button>
            ))}
          </div>

          {/* Desktop Feature Filters */}
          <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide">
            {featureFilters.map((filter) => (
              <Button
                key={filter.id}
                variant={
                  activeFilters.includes(filter.id) ? "default" : "outline"
                }
                size="sm"
                onClick={() => handleFilterClick(filter.id)}
                className={cn(
                  "flex items-center gap-2 rounded-full px-3 py-1.5 text-sm whitespace-nowrap flex-shrink-0",
                  activeFilters.includes(filter.id)
                    ? "bg-gray-900 text-white hover:bg-gray-800"
                    : "bg-white text-gray-600 hover:bg-gray-50 border-gray-300",
                )}
              >
                {filter.icon}
                <span>{filter.name}</span>
              </Button>
            ))}
          </div>
        </div>

        {/* Mobile Category Pills */}
        <div className="md:hidden pb-4">
          <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide">
            {categoryFilters.map((category) => (
              <Button
                key={category.id}
                variant={activeCategory === category.id ? "default" : "outline"}
                size="sm"
                onClick={() => handleCategoryClick(category.id)}
                className={cn(
                  "flex items-center gap-1 rounded-full px-3 py-2 whitespace-nowrap flex-shrink-0 text-xs",
                  activeCategory === category.id
                    ? "bg-blue-600 text-white"
                    : "bg-gray-50 text-gray-700",
                )}
              >
                {category.icon}
              </Button>
            ))}
          </div>
        </div>
      </div>

      {/* Mobile Filter Modal */}
      {showMobileFilters && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div className="fixed inset-0 bg-black bg-opacity-50" onClick={() => setShowMobileFilters(false)} />
          <div className="fixed bottom-0 left-0 right-0 bg-white rounded-t-lg max-h-[80vh] overflow-hidden">
            <div className="p-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Filters</h3>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setShowMobileFilters(false)}
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>
            </div>
            <div className="p-4 overflow-y-auto">
              {/* Mobile Filter Content */}
              <div className="space-y-4">
                {/* Categories */}
                <div>
                  <h4 className="font-medium mb-3">Categories</h4>
                  <div className="grid grid-cols-2 gap-2">
                    {categoryFilters.map((category) => (
                      <Button
                        key={category.id}
                        variant={activeCategory === category.id ? "default" : "outline"}
                        size="sm"
                        onClick={() => {
                          handleCategoryClick(category.id);
                          setShowMobileFilters(false);
                        }}
                        className="justify-start text-left"
                      >
                        {category.icon}
                        <span className="ml-2">{category.name}</span>
                      </Button>
                    ))}
                  </div>
                </div>

                {/* Features */}
                <div>
                  <h4 className="font-medium mb-3">Features</h4>
                  <div className="grid grid-cols-1 gap-2">
                    {featureFilters.map((filter) => (
                      <Button
                        key={filter.id}
                        variant={activeFilters.includes(filter.id) ? "default" : "outline"}
                        size="sm"
                        onClick={() => handleFilterClick(filter.id)}
                        className="justify-start text-left"
                      >
                        {filter.icon}
                        <span className="ml-2">{filter.name}</span>
                      </Button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            <div className="p-4 border-t border-gray-200">
              <Button
                onClick={() => setShowMobileFilters(false)}
                className="w-full"
              >
                Apply Filters
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
