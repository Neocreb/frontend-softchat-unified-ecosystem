import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuCheckboxItem,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Filter,
  Search,
  X,
  MapPin,
  DollarSign,
  Clock,
  Star,
  Briefcase,
  Users,
  Calendar,
  Target,
  Zap,
  ChevronDown,
  SlidersHorizontal,
  RefreshCw,
  Bookmark,
  TrendingUp,
  Award,
  Shield,
  Globe,
  Coffee,
  Sparkles,
} from "lucide-react";

interface FilterState {
  searchQuery: string;
  category: string[];
  skillLevel: string[];
  budgetRange: [number, number];
  projectDuration: string[];
  location: string[];
  clientRating: number;
  projectType: string[];
  urgency: string[];
  verification: string[];
  skills: string[];
  sortBy: string;
  sortOrder: "asc" | "desc";
}

interface AdvancedFreelanceFiltersProps {
  onFiltersChange: (filters: FilterState) => void;
  initialFilters?: Partial<FilterState>;
}

const AdvancedFreelanceFilters: React.FC<AdvancedFreelanceFiltersProps> = ({
  onFiltersChange,
  initialFilters = {},
}) => {
  const [filters, setFilters] = useState<FilterState>({
    searchQuery: "",
    category: [],
    skillLevel: [],
    budgetRange: [0, 10000],
    projectDuration: [],
    location: [],
    clientRating: 0,
    projectType: [],
    urgency: [],
    verification: [],
    skills: [],
    sortBy: "relevance",
    sortOrder: "desc",
    ...initialFilters,
  });

  const [isAdvancedOpen, setIsAdvancedOpen] = useState(false);
  const [savedSearches, setSavedSearches] = useState<string[]>([
    "React Developer Remote",
    "UI/UX Design $50-100/hr",
    "Mobile App Development",
  ]);

  const categories = [
    { id: "web-dev", label: "Web Development", count: 1247 },
    { id: "mobile-dev", label: "Mobile Development", count: 856 },
    { id: "design", label: "Design & Creative", count: 723 },
    { id: "writing", label: "Writing & Translation", count: 567 },
    { id: "marketing", label: "Digital Marketing", count: 445 },
    { id: "data", label: "Data Science & Analytics", count: 334 },
    { id: "video", label: "Video & Animation", count: 289 },
    { id: "engineering", label: "Engineering & Architecture", count: 234 },
  ];

  const skillLevels = [
    { id: "entry", label: "Entry Level", icon: <Coffee className="w-4 h-4" /> },
    {
      id: "intermediate",
      label: "Intermediate",
      icon: <Target className="w-4 h-4" />,
    },
    { id: "expert", label: "Expert", icon: <Award className="w-4 h-4" /> },
  ];

  const projectTypes = [
    {
      id: "fixed",
      label: "Fixed Price",
      icon: <DollarSign className="w-4 h-4" />,
    },
    { id: "hourly", label: "Hourly Rate", icon: <Clock className="w-4 h-4" /> },
    {
      id: "contest",
      label: "Contest",
      icon: <TrendingUp className="w-4 h-4" />,
    },
  ];

  const durations = [
    {
      id: "short",
      label: "Less than 1 month",
      icon: <Zap className="w-4 h-4" />,
    },
    {
      id: "medium",
      label: "1-3 months",
      icon: <Calendar className="w-4 h-4" />,
    },
    {
      id: "long",
      label: "3-6 months",
      icon: <Briefcase className="w-4 h-4" />,
    },
    {
      id: "ongoing",
      label: "Ongoing",
      icon: <RefreshCw className="w-4 h-4" />,
    },
  ];

  const popularSkills = [
    "React",
    "Node.js",
    "Python",
    "JavaScript",
    "TypeScript",
    "AWS",
    "MongoDB",
    "PostgreSQL",
    "Docker",
    "Kubernetes",
    "GraphQL",
    "Vue.js",
    "Angular",
    "React Native",
    "Flutter",
    "Swift",
    "Kotlin",
    "Java",
    "C#",
    ".NET",
    "PHP",
    "Laravel",
    "WordPress",
    "Shopify",
  ];

  const updateFilters = (newFilters: Partial<FilterState>) => {
    const updatedFilters = { ...filters, ...newFilters };
    setFilters(updatedFilters);
    onFiltersChange(updatedFilters);
  };

  const clearFilters = () => {
    const clearedFilters: FilterState = {
      searchQuery: "",
      category: [],
      skillLevel: [],
      budgetRange: [0, 10000],
      projectDuration: [],
      location: [],
      clientRating: 0,
      projectType: [],
      urgency: [],
      verification: [],
      skills: [],
      sortBy: "relevance",
      sortOrder: "desc",
    };
    setFilters(clearedFilters);
    onFiltersChange(clearedFilters);
  };

  const saveCurrentSearch = () => {
    if (filters.searchQuery.trim()) {
      setSavedSearches([filters.searchQuery, ...savedSearches.slice(0, 4)]);
    }
  };

  const getActiveFilterCount = () => {
    let count = 0;
    if (filters.category.length > 0) count++;
    if (filters.skillLevel.length > 0) count++;
    if (filters.budgetRange[0] > 0 || filters.budgetRange[1] < 10000) count++;
    if (filters.projectDuration.length > 0) count++;
    if (filters.location.length > 0) count++;
    if (filters.clientRating > 0) count++;
    if (filters.projectType.length > 0) count++;
    if (filters.urgency.length > 0) count++;
    if (filters.verification.length > 0) count++;
    if (filters.skills.length > 0) count++;
    return count;
  };

  return (
    <div className="space-y-4">
      {/* Main Search Bar */}
      <Card className="shadow-sm">
        <CardContent className="p-4">
          <div className="flex gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input
                placeholder="Search jobs, skills, companies, or keywords..."
                value={filters.searchQuery}
                onChange={(e) => updateFilters({ searchQuery: e.target.value })}
                className="pl-10 pr-12 h-12 text-lg"
              />
              {filters.searchQuery && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => updateFilters({ searchQuery: "" })}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0"
                >
                  <X className="w-4 h-4" />
                </Button>
              )}
            </div>

            <Button
              onClick={saveCurrentSearch}
              variant="outline"
              size="lg"
              disabled={!filters.searchQuery.trim()}
            >
              <Bookmark className="w-4 h-4 mr-2" />
              Save
            </Button>

            <Popover open={isAdvancedOpen} onOpenChange={setIsAdvancedOpen}>
              <PopoverTrigger asChild>
                <Button variant="outline" size="lg" className="relative">
                  <SlidersHorizontal className="w-4 h-4 mr-2" />
                  Advanced Filters
                  {getActiveFilterCount() > 0 && (
                    <Badge
                      variant="destructive"
                      className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 text-xs"
                    >
                      {getActiveFilterCount()}
                    </Badge>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-96 p-0" align="end">
                <div className="max-h-96 overflow-y-auto">
                  <div className="p-4 border-b">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold">Advanced Filters</h3>
                      <Button variant="ghost" size="sm" onClick={clearFilters}>
                        <RefreshCw className="w-4 h-4 mr-1" />
                        Clear All
                      </Button>
                    </div>
                  </div>

                  <div className="p-4 space-y-4">
                    {/* Budget Range */}
                    <div>
                      <Label className="text-sm font-medium mb-2 block">
                        Budget Range: ${filters.budgetRange[0]} - $
                        {filters.budgetRange[1]}
                      </Label>
                      <Slider
                        value={filters.budgetRange}
                        onValueChange={(value) =>
                          updateFilters({
                            budgetRange: value as [number, number],
                          })
                        }
                        max={10000}
                        min={0}
                        step={100}
                        className="w-full"
                      />
                    </div>

                    {/* Client Rating */}
                    <div>
                      <Label className="text-sm font-medium mb-2 block">
                        Minimum Client Rating
                      </Label>
                      <div className="flex gap-1">
                        {[1, 2, 3, 4, 5].map((rating) => (
                          <Button
                            key={rating}
                            variant={
                              filters.clientRating >= rating
                                ? "default"
                                : "outline"
                            }
                            size="sm"
                            onClick={() =>
                              updateFilters({ clientRating: rating })
                            }
                            className="p-2"
                          >
                            <Star
                              className={`w-4 h-4 ${filters.clientRating >= rating ? "fill-current" : ""}`}
                            />
                          </Button>
                        ))}
                      </div>
                    </div>

                    {/* Categories */}
                    <div>
                      <Label className="text-sm font-medium mb-2 block">
                        Categories
                      </Label>
                      <div className="space-y-2 max-h-32 overflow-y-auto">
                        {categories.map((category) => (
                          <div
                            key={category.id}
                            className="flex items-center justify-between"
                          >
                            <div className="flex items-center space-x-2">
                              <Checkbox
                                id={category.id}
                                checked={filters.category.includes(category.id)}
                                onCheckedChange={(checked) => {
                                  if (checked) {
                                    updateFilters({
                                      category: [
                                        ...filters.category,
                                        category.id,
                                      ],
                                    });
                                  } else {
                                    updateFilters({
                                      category: filters.category.filter(
                                        (c) => c !== category.id,
                                      ),
                                    });
                                  }
                                }}
                              />
                              <Label htmlFor={category.id} className="text-sm">
                                {category.label}
                              </Label>
                            </div>
                            <Badge variant="secondary" className="text-xs">
                              {category.count}
                            </Badge>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Skills */}
                    <div>
                      <Label className="text-sm font-medium mb-2 block">
                        Required Skills
                      </Label>
                      <div className="flex flex-wrap gap-1 max-h-24 overflow-y-auto">
                        {popularSkills.map((skill) => (
                          <Button
                            key={skill}
                            variant={
                              filters.skills.includes(skill)
                                ? "default"
                                : "outline"
                            }
                            size="sm"
                            onClick={() => {
                              if (filters.skills.includes(skill)) {
                                updateFilters({
                                  skills: filters.skills.filter(
                                    (s) => s !== skill,
                                  ),
                                });
                              } else {
                                updateFilters({
                                  skills: [...filters.skills, skill],
                                });
                              }
                            }}
                            className="h-7 text-xs"
                          >
                            {skill}
                          </Button>
                        ))}
                      </div>
                    </div>

                    {/* Project Types */}
                    <div>
                      <Label className="text-sm font-medium mb-2 block">
                        Project Type
                      </Label>
                      <div className="grid grid-cols-3 gap-2">
                        {projectTypes.map((type) => (
                          <Button
                            key={type.id}
                            variant={
                              filters.projectType.includes(type.id)
                                ? "default"
                                : "outline"
                            }
                            size="sm"
                            onClick={() => {
                              if (filters.projectType.includes(type.id)) {
                                updateFilters({
                                  projectType: filters.projectType.filter(
                                    (t) => t !== type.id,
                                  ),
                                });
                              } else {
                                updateFilters({
                                  projectType: [
                                    ...filters.projectType,
                                    type.id,
                                  ],
                                });
                              }
                            }}
                            className="flex flex-col items-center gap-1 h-auto py-2"
                          >
                            {type.icon}
                            <span className="text-xs">{type.label}</span>
                          </Button>
                        ))}
                      </div>
                    </div>

                    {/* Duration */}
                    <div>
                      <Label className="text-sm font-medium mb-2 block">
                        Project Duration
                      </Label>
                      <div className="grid grid-cols-2 gap-2">
                        {durations.map((duration) => (
                          <Button
                            key={duration.id}
                            variant={
                              filters.projectDuration.includes(duration.id)
                                ? "default"
                                : "outline"
                            }
                            size="sm"
                            onClick={() => {
                              if (
                                filters.projectDuration.includes(duration.id)
                              ) {
                                updateFilters({
                                  projectDuration:
                                    filters.projectDuration.filter(
                                      (d) => d !== duration.id,
                                    ),
                                });
                              } else {
                                updateFilters({
                                  projectDuration: [
                                    ...filters.projectDuration,
                                    duration.id,
                                  ],
                                });
                              }
                            }}
                            className="flex items-center gap-1 justify-start h-auto py-2 px-3"
                          >
                            {duration.icon}
                            <span className="text-xs">{duration.label}</span>
                          </Button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </PopoverContent>
            </Popover>
          </div>

          {/* Quick Filters Row */}
          <div className="flex items-center gap-2 mt-3 flex-wrap">
            <span className="text-sm text-gray-600">Quick filters:</span>

            <Button
              variant="outline"
              size="sm"
              onClick={() => updateFilters({ urgency: ["urgent"] })}
            >
              <Zap className="w-3 h-3 mr-1" />
              Urgent
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={() => updateFilters({ verification: ["verified"] })}
            >
              <Shield className="w-3 h-3 mr-1" />
              Verified Clients
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={() => updateFilters({ location: ["remote"] })}
            >
              <Globe className="w-3 h-3 mr-1" />
              Remote Only
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={() => updateFilters({ budgetRange: [1000, 10000] })}
            >
              <DollarSign className="w-3 h-3 mr-1" />
              High Budget
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  Sort: {filters.sortBy}
                  <ChevronDown className="w-3 h-3 ml-1" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem
                  onClick={() => updateFilters({ sortBy: "relevance" })}
                >
                  Relevance
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => updateFilters({ sortBy: "newest" })}
                >
                  Newest First
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => updateFilters({ sortBy: "budget" })}
                >
                  Highest Budget
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => updateFilters({ sortBy: "rating" })}
                >
                  Client Rating
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Saved Searches */}
          {savedSearches.length > 0 && (
            <div className="mt-3 pt-3 border-t">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-sm text-gray-600">Saved searches:</span>
                {savedSearches.map((search, index) => (
                  <Button
                    key={index}
                    variant="ghost"
                    size="sm"
                    onClick={() => updateFilters({ searchQuery: search })}
                    className="h-7 text-xs bg-blue-50 hover:bg-blue-100 text-blue-700"
                  >
                    {search}
                  </Button>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Active Filters Display */}
      {getActiveFilterCount() > 0 && (
        <Card className="shadow-sm">
          <CardContent className="p-3">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-sm font-medium text-gray-700">
                Active filters:
              </span>

              {filters.category.map((cat) => (
                <Badge key={cat} variant="secondary" className="gap-1">
                  {categories.find((c) => c.id === cat)?.label}
                  <X
                    className="w-3 h-3 cursor-pointer"
                    onClick={() =>
                      updateFilters({
                        category: filters.category.filter((c) => c !== cat),
                      })
                    }
                  />
                </Badge>
              ))}

              {filters.skills.map((skill) => (
                <Badge key={skill} variant="secondary" className="gap-1">
                  {skill}
                  <X
                    className="w-3 h-3 cursor-pointer"
                    onClick={() =>
                      updateFilters({
                        skills: filters.skills.filter((s) => s !== skill),
                      })
                    }
                  />
                </Badge>
              ))}

              {(filters.budgetRange[0] > 0 ||
                filters.budgetRange[1] < 10000) && (
                <Badge variant="secondary" className="gap-1">
                  ${filters.budgetRange[0]} - ${filters.budgetRange[1]}
                  <X
                    className="w-3 h-3 cursor-pointer"
                    onClick={() => updateFilters({ budgetRange: [0, 10000] })}
                  />
                </Badge>
              )}

              {filters.clientRating > 0 && (
                <Badge variant="secondary" className="gap-1">
                  {filters.clientRating}+ stars
                  <X
                    className="w-3 h-3 cursor-pointer"
                    onClick={() => updateFilters({ clientRating: 0 })}
                  />
                </Badge>
              )}

              <Button
                variant="ghost"
                size="sm"
                onClick={clearFilters}
                className="ml-auto"
              >
                <RefreshCw className="w-3 h-3 mr-1" />
                Clear all
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default AdvancedFreelanceFilters;
