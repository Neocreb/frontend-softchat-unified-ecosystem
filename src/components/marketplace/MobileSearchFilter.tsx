import React, { useState, useEffect } from "react";
import {
  Search,
  Filter,
  X,
  ChevronDown,
  Star,
  DollarSign,
  Package,
  MapPin,
} from "lucide-react";

interface FilterOption {
  id: string;
  label: string;
  value: string;
  count?: number;
}

interface MobileSearchFilterProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onFiltersChange: (filters: Record<string, any>) => void;
  categories: FilterOption[];
  isLoading?: boolean;
  resultCount?: number;
}

export const MobileSearchFilter: React.FC<MobileSearchFilterProps> = ({
  searchQuery,
  onSearchChange,
  onFiltersChange,
  categories,
  isLoading = false,
  resultCount = 0,
}) => {
  const [showFilters, setShowFilters] = useState(false);
  const [activeFilters, setActiveFilters] = useState<Record<string, any>>({});
  const [expandedSections, setExpandedSections] = useState<
    Record<string, boolean>
  >({
    category: true,
    price: false,
    rating: false,
    type: false,
    location: false,
  });

  const priceRanges = [
    { id: "under-25", label: "Under $25", min: 0, max: 25 },
    { id: "25-50", label: "$25 - $50", min: 25, max: 50 },
    { id: "50-100", label: "$50 - $100", min: 50, max: 100 },
    { id: "100-200", label: "$100 - $200", min: 100, max: 200 },
    { id: "over-200", label: "Over $200", min: 200, max: 999999 },
  ];

  const ratingOptions = [
    { id: "4-plus", label: "4+ Stars", value: 4 },
    { id: "3-plus", label: "3+ Stars", value: 3 },
    { id: "2-plus", label: "2+ Stars", value: 2 },
    { id: "1-plus", label: "1+ Stars", value: 1 },
  ];

  const productTypes = [
    { id: "physical", label: "Physical Products", value: "physical" },
    { id: "digital", label: "Digital Products", value: "digital" },
    { id: "service", label: "Services", value: "service" },
    {
      id: "freelance",
      label: "Freelance Services",
      value: "freelance_service",
    },
  ];

  const handleFilterChange = (filterType: string, value: any) => {
    const newFilters = { ...activeFilters };

    if (filterType === "category") {
      newFilters.category = newFilters.category === value ? null : value;
    } else if (filterType === "priceRange") {
      if (newFilters.priceRange === value.id) {
        delete newFilters.minPrice;
        delete newFilters.maxPrice;
        delete newFilters.priceRange;
      } else {
        newFilters.priceRange = value.id;
        newFilters.minPrice = value.min;
        newFilters.maxPrice = value.max;
      }
    } else if (filterType === "rating") {
      newFilters.rating = newFilters.rating === value ? null : value;
    } else if (filterType === "productType") {
      newFilters.productType = newFilters.productType === value ? null : value;
    } else if (filterType === "inStock") {
      newFilters.inStock = newFilters.inStock ? null : true;
    } else if (filterType === "freeShipping") {
      newFilters.freeShipping = newFilters.freeShipping ? null : true;
    } else if (filterType === "onSale") {
      newFilters.onSale = newFilters.onSale ? null : true;
    }

    setActiveFilters(newFilters);
    onFiltersChange(newFilters);
  };

  const clearAllFilters = () => {
    setActiveFilters({});
    onFiltersChange({});
  };

  const toggleSection = (section: string) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const activeFilterCount = Object.values(activeFilters).filter(Boolean).length;

  const FilterSection: React.FC<{
    title: string;
    icon: React.ComponentType<any>;
    sectionKey: string;
    children: React.ReactNode;
  }> = ({ title, icon: Icon, sectionKey, children }) => (
    <div className="border-b border-gray-200">
      <button
        onClick={() => toggleSection(sectionKey)}
        className="w-full flex items-center justify-between p-4 text-left"
      >
        <div className="flex items-center space-x-3">
          <Icon className="w-5 h-5 text-gray-500" />
          <span className="font-medium text-gray-900">{title}</span>
        </div>
        <ChevronDown
          className={`w-5 h-5 text-gray-500 transition-transform ${
            expandedSections[sectionKey] ? "rotate-180" : ""
          }`}
        />
      </button>
      {expandedSections[sectionKey] && (
        <div className="px-4 pb-4">{children}</div>
      )}
    </div>
  );

  return (
    <>
      {/* Search Bar */}
      <div className="bg-white p-4 border-b border-gray-200">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search products..."
            className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <button
            onClick={() => setShowFilters(true)}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 rounded-lg hover:bg-gray-100"
          >
            <div className="relative">
              <Filter className="w-5 h-5 text-gray-500" />
              {activeFilterCount > 0 && (
                <span className="absolute -top-2 -right-2 w-4 h-4 bg-blue-600 text-white text-xs rounded-full flex items-center justify-center">
                  {activeFilterCount}
                </span>
              )}
            </div>
          </button>
        </div>

        {/* Active Filters */}
        {activeFilterCount > 0 && (
          <div className="mt-3 flex flex-wrap gap-2">
            {activeFilters.category && (
              <div className="flex items-center bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                <span>
                  Category:{" "}
                  {
                    categories.find((c) => c.value === activeFilters.category)
                      ?.label
                  }
                </span>
                <button
                  onClick={() =>
                    handleFilterChange("category", activeFilters.category)
                  }
                  className="ml-2 hover:bg-blue-200 rounded-full p-0.5"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            )}
            {activeFilters.priceRange && (
              <div className="flex items-center bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">
                <span>
                  {
                    priceRanges.find((p) => p.id === activeFilters.priceRange)
                      ?.label
                  }
                </span>
                <button
                  onClick={() =>
                    handleFilterChange("priceRange", {
                      id: activeFilters.priceRange,
                    })
                  }
                  className="ml-2 hover:bg-green-200 rounded-full p-0.5"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            )}
            {activeFilters.rating && (
              <div className="flex items-center bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm">
                <span>{activeFilters.rating}+ Stars</span>
                <button
                  onClick={() =>
                    handleFilterChange("rating", activeFilters.rating)
                  }
                  className="ml-2 hover:bg-yellow-200 rounded-full p-0.5"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            )}
            <button
              onClick={clearAllFilters}
              className="text-red-600 text-sm font-medium hover:text-red-800"
            >
              Clear all
            </button>
          </div>
        )}

        {/* Results Count */}
        {!isLoading && (
          <div className="mt-2 text-sm text-gray-600">
            {resultCount} {resultCount === 1 ? "result" : "results"} found
          </div>
        )}
      </div>

      {/* Filter Panel */}
      {showFilters && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50">
          <div className="bg-white h-full w-full max-w-sm ml-auto">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Filters</h2>
              <button
                onClick={() => setShowFilters(false)}
                className="p-2 rounded-lg hover:bg-gray-100"
              >
                <X className="w-6 h-6 text-gray-600" />
              </button>
            </div>

            {/* Filter Content */}
            <div className="overflow-y-auto h-full pb-20">
              {/* Categories */}
              <FilterSection
                title="Category"
                icon={Package}
                sectionKey="category"
              >
                <div className="space-y-2">
                  {categories.map((category) => (
                    <label
                      key={category.id}
                      className="flex items-center space-x-3 cursor-pointer"
                    >
                      <input
                        type="radio"
                        name="category"
                        checked={activeFilters.category === category.value}
                        onChange={() =>
                          handleFilterChange("category", category.value)
                        }
                        className="w-4 h-4 text-blue-600"
                      />
                      <span className="text-sm text-gray-700 flex-1">
                        {category.label}
                      </span>
                      {category.count && (
                        <span className="text-xs text-gray-500">
                          ({category.count})
                        </span>
                      )}
                    </label>
                  ))}
                </div>
              </FilterSection>

              {/* Price Range */}
              <FilterSection
                title="Price Range"
                icon={DollarSign}
                sectionKey="price"
              >
                <div className="space-y-2">
                  {priceRanges.map((range) => (
                    <label
                      key={range.id}
                      className="flex items-center space-x-3 cursor-pointer"
                    >
                      <input
                        type="radio"
                        name="priceRange"
                        checked={activeFilters.priceRange === range.id}
                        onChange={() => handleFilterChange("priceRange", range)}
                        className="w-4 h-4 text-blue-600"
                      />
                      <span className="text-sm text-gray-700">
                        {range.label}
                      </span>
                    </label>
                  ))}
                </div>
              </FilterSection>

              {/* Rating */}
              <FilterSection
                title="Customer Rating"
                icon={Star}
                sectionKey="rating"
              >
                <div className="space-y-2">
                  {ratingOptions.map((rating) => (
                    <label
                      key={rating.id}
                      className="flex items-center space-x-3 cursor-pointer"
                    >
                      <input
                        type="radio"
                        name="rating"
                        checked={activeFilters.rating === rating.value}
                        onChange={() =>
                          handleFilterChange("rating", rating.value)
                        }
                        className="w-4 h-4 text-blue-600"
                      />
                      <div className="flex items-center space-x-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            className={`w-4 h-4 ${
                              star <= rating.value
                                ? "text-yellow-400 fill-current"
                                : "text-gray-300"
                            }`}
                          />
                        ))}
                        <span className="text-sm text-gray-700 ml-1">& up</span>
                      </div>
                    </label>
                  ))}
                </div>
              </FilterSection>

              {/* Product Type */}
              <FilterSection
                title="Product Type"
                icon={Package}
                sectionKey="type"
              >
                <div className="space-y-2">
                  {productTypes.map((type) => (
                    <label
                      key={type.id}
                      className="flex items-center space-x-3 cursor-pointer"
                    >
                      <input
                        type="radio"
                        name="productType"
                        checked={activeFilters.productType === type.value}
                        onChange={() =>
                          handleFilterChange("productType", type.value)
                        }
                        className="w-4 h-4 text-blue-600"
                      />
                      <span className="text-sm text-gray-700">
                        {type.label}
                      </span>
                    </label>
                  ))}
                </div>
              </FilterSection>

              {/* Additional Filters */}
              <div className="border-b border-gray-200 p-4">
                <h3 className="font-medium text-gray-900 mb-3">
                  Additional Filters
                </h3>
                <div className="space-y-3">
                  <label className="flex items-center space-x-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={activeFilters.inStock || false}
                      onChange={() => handleFilterChange("inStock", true)}
                      className="w-4 h-4 text-blue-600"
                    />
                    <span className="text-sm text-gray-700">In Stock Only</span>
                  </label>
                  <label className="flex items-center space-x-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={activeFilters.freeShipping || false}
                      onChange={() => handleFilterChange("freeShipping", true)}
                      className="w-4 h-4 text-blue-600"
                    />
                    <span className="text-sm text-gray-700">Free Shipping</span>
                  </label>
                  <label className="flex items-center space-x-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={activeFilters.onSale || false}
                      onChange={() => handleFilterChange("onSale", true)}
                      className="w-4 h-4 text-blue-600"
                    />
                    <span className="text-sm text-gray-700">On Sale</span>
                  </label>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="absolute bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4">
              <div className="flex space-x-3">
                <button
                  onClick={clearAllFilters}
                  className="flex-1 py-3 px-4 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50"
                >
                  Clear All
                </button>
                <button
                  onClick={() => setShowFilters(false)}
                  className="flex-1 py-3 px-4 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700"
                >
                  Apply Filters
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
