
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Search, X } from "lucide-react";

const categories = [
  { id: "all", name: "All Categories" },
  { id: "electronics", name: "Electronics" },
  { id: "clothing", name: "Clothing" },
  { id: "accessories", name: "Accessories" },
  { id: "beauty", name: "Beauty & Health" },
  { id: "home", name: "Home & Kitchen" },
  { id: "footwear", name: "Footwear" },
];

interface ProductFiltersProps {
  activeCategory: string;
  onCategoryChange: (category: string) => void;
  onSearch: (query: string) => void;
}

const ProductFilters = ({ 
  activeCategory, 
  onCategoryChange, 
  onSearch 
}: ProductFiltersProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [priceRange, setPriceRange] = useState([0, 500]);
  
  const handleSearch = () => {
    onSearch(searchQuery);
  };
  
  const handleClearSearch = () => {
    setSearchQuery("");
    onSearch("");
  };
  
  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };
  
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Search</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Input
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={handleKeyPress}
                className="pr-8"
              />
              {searchQuery && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-0 top-0 h-full w-8 p-0"
                  onClick={handleClearSearch}
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
            <Button onClick={handleSearch} className="shrink-0">
              <Search className="h-4 w-4 mr-1" />
              Search
            </Button>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Categories</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <Badge
                key={category.id}
                variant={activeCategory === category.id ? "default" : "outline"}
                className="cursor-pointer"
                onClick={() => onCategoryChange(category.id)}
              >
                {category.name}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Price Range</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Slider
              defaultValue={priceRange}
              min={0}
              max={1000}
              step={10}
              value={priceRange}
              onValueChange={(value) => setPriceRange(value as number[])}
            />
            <div className="flex justify-between">
              <span>${priceRange[0]}</span>
              <span>${priceRange[1]}</span>
            </div>
            <Button 
              size="sm" 
              className="w-full"
              onClick={() => console.log("Apply price filter", priceRange)}
            >
              Apply
            </Button>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="in-stock"
                className="h-4 w-4 rounded border-gray-300"
              />
              <label htmlFor="in-stock" className="ml-2 text-sm">
                In Stock Only
              </label>
            </div>
            <div className="flex items-center">
              <input
                type="checkbox"
                id="on-sale"
                className="h-4 w-4 rounded border-gray-300"
              />
              <label htmlFor="on-sale" className="ml-2 text-sm">
                On Sale
              </label>
            </div>
            <div className="flex items-center">
              <input
                type="checkbox"
                id="new-arrivals"
                className="h-4 w-4 rounded border-gray-300"
              />
              <label htmlFor="new-arrivals" className="ml-2 text-sm">
                New Arrivals
              </label>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProductFilters;
