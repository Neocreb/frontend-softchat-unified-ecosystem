import { useState, useRef, useEffect } from "react";
import { Search, Filter, X, TrendingUp, Hash, Users } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";

interface SearchBarProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

const SearchBar = ({ searchQuery, setSearchQuery }: SearchBarProps) => {
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [searchHistory, setSearchHistory] = useState<string[]>([]);
  const [searchFilter, setSearchFilter] = useState<
    "all" | "people" | "posts" | "hashtags"
  >("all");
  const inputRef = useRef<HTMLInputElement>(null);

  const trendingSearches = [
    "crypto trading",
    "freelance jobs",
    "marketplace deals",
    "AI tools",
    "web3 development",
    "digital art",
    "investment tips",
    "remote work",
  ];

  const quickFilters = [
    { value: "all", label: "All", icon: Search },
    { value: "people", label: "People", icon: Users },
    { value: "posts", label: "Posts", icon: TrendingUp },
    { value: "hashtags", label: "Hashtags", icon: Hash },
  ];

  useEffect(() => {
    const saved = localStorage.getItem("search_history");
    if (saved) {
      setSearchHistory(JSON.parse(saved));
    }
  }, []);

  const handleSearch = (query: string) => {
    if (!query.trim()) return;

    setSearchQuery(query);

    // Save to history
    const updated = [query, ...searchHistory.filter((q) => q !== query)].slice(
      0,
      10,
    );
    setSearchHistory(updated);
    localStorage.setItem("search_history", JSON.stringify(updated));
    setShowSuggestions(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch(searchQuery);
    }
  };

  const clearHistory = () => {
    setSearchHistory([]);
    localStorage.removeItem("search_history");
  };

  const removeFromHistory = (query: string) => {
    const updated = searchHistory.filter((q) => q !== query);
    setSearchHistory(updated);
    localStorage.setItem("search_history", JSON.stringify(updated));
  };

  return (
    <div className="relative w-full max-w-2xl mx-auto">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4 z-10" />
        <Input
          ref={inputRef}
          placeholder="Search for topics, people, posts, or hashtags..."
          className="pl-9 pr-20 bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 rounded-full h-12 text-base"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onFocus={() => setShowSuggestions(true)}
          onKeyDown={handleKeyDown}
        />

        <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center gap-1">
          {searchQuery && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSearchQuery("")}
              className="h-6 w-6 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600"
            >
              <X className="h-3 w-3" />
            </Button>
          )}

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 rounded-full"
              >
                <Filter className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuLabel>Search in</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {quickFilters.map((filter) => (
                <DropdownMenuItem
                  key={filter.value}
                  onClick={() => setSearchFilter(filter.value as any)}
                  className="flex items-center gap-2"
                >
                  <filter.icon className="h-4 w-4" />
                  {filter.label}
                  {searchFilter === filter.value && (
                    <Badge variant="default" className="ml-auto h-4 text-xs">
                      ✓
                    </Badge>
                  )}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Search Filter Pills */}
      {searchFilter !== "all" && (
        <div className="flex items-center gap-2 mt-2">
          <span className="text-sm text-gray-600">Searching in:</span>
          <Badge variant="secondary" className="flex items-center gap-1">
            {quickFilters.find((f) => f.value === searchFilter)?.label}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSearchFilter("all")}
              className="h-3 w-3 ml-1 p-0 hover:bg-transparent"
            >
              <X className="h-2 w-2" />
            </Button>
          </Badge>
        </div>
      )}

      {/* Search Suggestions Dropdown */}
      {showSuggestions && (
        <Card className="absolute top-full left-0 right-0 mt-2 z-50 max-h-96 overflow-y-auto">
          <CardContent className="p-4 space-y-4">
            {searchQuery ? (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium text-sm text-gray-700 dark:text-gray-300">
                    Search for "{searchQuery}"
                  </h4>
                  <Button
                    size="sm"
                    onClick={() => handleSearch(searchQuery)}
                    className="h-6 text-xs"
                  >
                    Search
                  </Button>
                </div>

                {/* Smart Suggestions based on input */}
                <div className="space-y-1">
                  {trendingSearches
                    .filter((term) =>
                      term.toLowerCase().includes(searchQuery.toLowerCase()),
                    )
                    .slice(0, 3)
                    .map((suggestion) => (
                      <Button
                        key={suggestion}
                        variant="ghost"
                        className="w-full justify-start h-8 text-sm"
                        onClick={() => handleSearch(suggestion)}
                      >
                        <Search className="h-3 w-3 mr-2 text-gray-400" />
                        {suggestion}
                      </Button>
                    ))}
                </div>
              </div>
            ) : (
              <>
                {/* Recent Searches */}
                {searchHistory.length > 0 && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium text-sm text-gray-700 dark:text-gray-300">
                        Recent Searches
                      </h4>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={clearHistory}
                        className="h-6 text-xs text-gray-500"
                      >
                        Clear
                      </Button>
                    </div>
                    {searchHistory.slice(0, 5).map((query) => (
                      <div key={query} className="flex items-center group">
                        <Button
                          variant="ghost"
                          className="flex-1 justify-start h-8 text-sm text-gray-600"
                          onClick={() => handleSearch(query)}
                        >
                          <Search className="h-3 w-3 mr-2 text-gray-400" />
                          {query}
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => removeFromHistory(query)}
                          className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}

                {/* Trending Searches */}
                <div className="space-y-2">
                  <h4 className="font-medium text-sm text-gray-700 dark:text-gray-300 flex items-center gap-1">
                    <TrendingUp className="h-3 w-3" />
                    Trending
                  </h4>
                  <div className="flex flex-wrap gap-1">
                    {trendingSearches.slice(0, 6).map((trend) => (
                      <Badge
                        key={trend}
                        variant="secondary"
                        className="cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-600 text-xs"
                        onClick={() => handleSearch(trend)}
                      >
                        {trend}
                      </Badge>
                    ))}
                  </div>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      )}

      {/* Click outside to close */}
      {showSuggestions && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setShowSuggestions(false)}
        />
      )}
    </div>
  );
};

export default SearchBar;
