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
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

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
        <div className="flex items-center justify-between py-4">
          <h1 className="text-2xl font-bold text-gray-900">Marketplace</h1>

          <div className="flex items-center gap-4">
            {/* Search Bar */}
            <form onSubmit={handleSearch} className="relative flex-1 max-w-md">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4"
                />
              </div>
            </form>

            {/* Action Buttons */}
            <Button variant="ghost" size="icon">
              <Search className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon">
              <Filter className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon">
              <MoreHorizontal className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Category Filters */}
        <div className="pb-4">
          <div className="flex items-center gap-2 mb-4">
            {categoryFilters.map((category) => (
              <Button
                key={category.id}
                variant={activeCategory === category.id ? "default" : "outline"}
                size="sm"
                onClick={() => handleCategoryClick(category.id)}
                className={cn(
                  "flex items-center gap-2 rounded-full px-4 py-2",
                  activeCategory === category.id
                    ? "bg-blue-600 text-white hover:bg-blue-700"
                    : "bg-gray-50 text-gray-700 hover:bg-gray-100",
                )}
              >
                {category.icon}
                {category.name}
              </Button>
            ))}
          </div>

          {/* Feature Filters */}
          <div className="flex items-center gap-2 flex-wrap">
            {featureFilters.map((filter) => (
              <Button
                key={filter.id}
                variant={
                  activeFilters.includes(filter.id) ? "default" : "outline"
                }
                size="sm"
                onClick={() => handleFilterClick(filter.id)}
                className={cn(
                  "flex items-center gap-2 rounded-full px-3 py-1.5 text-sm",
                  activeFilters.includes(filter.id)
                    ? "bg-gray-900 text-white hover:bg-gray-800"
                    : "bg-white text-gray-600 hover:bg-gray-50 border-gray-300",
                )}
              >
                {filter.icon}
                {filter.name}
              </Button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
