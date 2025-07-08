import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Star,
  MapPin,
  DollarSign,
  Users,
  Award,
  Search,
  Filter,
  Verified,
  Clock,
  Heart,
  MessageCircle,
  Eye,
} from "lucide-react";

export interface Talent {
  id: string;
  name: string;
  avatar: string;
  title: string;
  description: string;
  skills: string[];
  hourlyRate: number;
  rating: number;
  reviewCount: number;
  location: string;
  availability: "available" | "busy" | "offline";
  verified: boolean;
  completedJobs: number;
  responseTime: string;
  successRate: number;
  portfolio: {
    id: string;
    title: string;
    image: string;
    category: string;
  }[];
  badges: string[];
  languages: string[];
  joinedDate: string;
  lastSeen: string;
}

interface TalentsListProps {
  onTalentSelect?: (talent: Talent) => void;
  filters?: {
    category?: string;
    skills?: string[];
    minRating?: number;
    maxRate?: number;
    availability?: string;
  };
  showFilters?: boolean;
}

// Mock talents data
const mockTalents: Talent[] = [
  {
    id: "1",
    name: "Sarah Chen",
    avatar:
      "https://images.unsplash.com/photo-1494790108755-2616b612b547?w=100&h=100&fit=crop&crop=face",
    title: "Full-Stack React Developer",
    description:
      "Experienced developer specializing in React, Node.js, and modern web technologies. I help businesses build scalable applications.",
    skills: ["React", "Node.js", "TypeScript", "PostgreSQL", "AWS"],
    hourlyRate: 85,
    rating: 4.9,
    reviewCount: 127,
    location: "San Francisco, CA",
    availability: "available",
    verified: true,
    completedJobs: 89,
    responseTime: "1 hour",
    successRate: 98,
    portfolio: [
      {
        id: "1",
        title: "E-commerce Platform",
        image:
          "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=300&h=200&fit=crop",
        category: "Web Development",
      },
      {
        id: "2",
        title: "Mobile Banking App",
        image:
          "https://images.unsplash.com/photo-1551650975-87deedd944c3?w=300&h=200&fit=crop",
        category: "Mobile Development",
      },
    ],
    badges: ["Top Rated", "Rising Talent"],
    languages: ["English", "Mandarin"],
    joinedDate: "2022-03-15",
    lastSeen: "Online now",
  },
  {
    id: "2",
    name: "Marcus Rodriguez",
    avatar:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face",
    title: "UI/UX Designer & Brand Specialist",
    description:
      "Creative designer with 8 years of experience crafting beautiful and functional digital experiences for startups and enterprises.",
    skills: [
      "Figma",
      "Adobe Creative Suite",
      "UI/UX Design",
      "Branding",
      "Prototyping",
    ],
    hourlyRate: 75,
    rating: 4.8,
    reviewCount: 94,
    location: "Austin, TX",
    availability: "available",
    verified: true,
    completedJobs: 156,
    responseTime: "30 minutes",
    successRate: 96,
    portfolio: [
      {
        id: "3",
        title: "SaaS Dashboard Design",
        image:
          "https://images.unsplash.com/photo-1551650975-87deedd944c3?w=300&h=200&fit=crop",
        category: "UI/UX Design",
      },
    ],
    badges: ["Top Rated", "Design Expert"],
    languages: ["English", "Spanish"],
    joinedDate: "2021-08-22",
    lastSeen: "2 hours ago",
  },
  {
    id: "3",
    name: "Emma Thompson",
    avatar:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face",
    title: "Digital Marketing Strategist",
    description:
      "Data-driven marketing expert helping businesses grow through strategic campaigns, SEO optimization, and conversion rate optimization.",
    skills: [
      "SEO",
      "Google Ads",
      "Content Marketing",
      "Analytics",
      "Social Media",
    ],
    hourlyRate: 65,
    rating: 4.7,
    reviewCount: 73,
    location: "London, UK",
    availability: "busy",
    verified: false,
    completedJobs: 67,
    responseTime: "2 hours",
    successRate: 94,
    portfolio: [
      {
        id: "4",
        title: "E-commerce Growth Campaign",
        image:
          "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=300&h=200&fit=crop",
        category: "Digital Marketing",
      },
    ],
    badges: ["Marketing Pro"],
    languages: ["English", "French"],
    joinedDate: "2022-01-10",
    lastSeen: "1 day ago",
  },
  {
    id: "4",
    name: "Alex Johnson",
    avatar:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face",
    title: "Mobile App Developer (React Native)",
    description:
      "Specialized in cross-platform mobile development with React Native. Built 50+ apps with millions of downloads.",
    skills: ["React Native", "Flutter", "Swift", "Kotlin", "Firebase"],
    hourlyRate: 90,
    rating: 4.9,
    reviewCount: 112,
    location: "Toronto, Canada",
    availability: "available",
    verified: true,
    completedJobs: 78,
    responseTime: "1 hour",
    successRate: 99,
    portfolio: [
      {
        id: "5",
        title: "Fitness Tracking App",
        image:
          "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=300&h=200&fit=crop",
        category: "Mobile Development",
      },
    ],
    badges: ["Top Rated", "Mobile Expert"],
    languages: ["English", "French"],
    joinedDate: "2020-11-05",
    lastSeen: "Online now",
  },
  {
    id: "5",
    name: "Lisa Wang",
    avatar:
      "https://images.unsplash.com/photo-1544725176-7c40e5a71c5e?w=100&h=100&fit=crop&crop=face",
    title: "Data Scientist & ML Engineer",
    description:
      "PhD in Computer Science with expertise in machine learning, data analysis, and AI model development for business solutions.",
    skills: ["Python", "TensorFlow", "PyTorch", "SQL", "Machine Learning"],
    hourlyRate: 120,
    rating: 5.0,
    reviewCount: 45,
    location: "Seattle, WA",
    availability: "available",
    verified: true,
    completedJobs: 34,
    responseTime: "3 hours",
    successRate: 100,
    portfolio: [
      {
        id: "6",
        title: "Predictive Analytics Model",
        image:
          "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=300&h=200&fit=crop",
        category: "Data Science",
      },
    ],
    badges: ["Top Rated", "AI Specialist"],
    languages: ["English", "Mandarin"],
    joinedDate: "2023-02-18",
    lastSeen: "4 hours ago",
  },
];

const categories = [
  "All Categories",
  "Web Development",
  "Mobile Development",
  "UI/UX Design",
  "Digital Marketing",
  "Data Science",
  "Writing & Content",
  "DevOps & Cloud",
];

const availabilityOptions = [
  { value: "all", label: "All Availability" },
  { value: "available", label: "Available Now" },
  { value: "busy", label: "Busy" },
  { value: "offline", label: "Offline" },
];

export const TalentsList: React.FC<TalentsListProps> = ({
  onTalentSelect,
  filters,
  showFilters = true,
}) => {
  const [talents, setTalents] = useState<Talent[]>(mockTalents);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  const [selectedAvailability, setSelectedAvailability] = useState("all");
  const [sortBy, setSortBy] = useState("rating");

  // Filter and sort talents
  useEffect(() => {
    let filtered = [...mockTalents];

    // Apply search filter
    if (searchQuery) {
      filtered = filtered.filter(
        (talent) =>
          talent.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          talent.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          talent.skills.some((skill) =>
            skill.toLowerCase().includes(searchQuery.toLowerCase()),
          ),
      );
    }

    // Apply category filter
    if (selectedCategory !== "All Categories") {
      filtered = filtered.filter(
        (talent) =>
          talent.skills.some((skill) =>
            skill.toLowerCase().includes(selectedCategory.toLowerCase()),
          ) ||
          talent.title.toLowerCase().includes(selectedCategory.toLowerCase()),
      );
    }

    // Apply availability filter
    if (selectedAvailability !== "all") {
      filtered = filtered.filter(
        (talent) => talent.availability === selectedAvailability,
      );
    }

    // Apply external filters
    if (filters) {
      if (filters.minRating) {
        filtered = filtered.filter(
          (talent) => talent.rating >= filters.minRating!,
        );
      }
      if (filters.maxRate) {
        filtered = filtered.filter(
          (talent) => talent.hourlyRate <= filters.maxRate!,
        );
      }
      if (filters.skills) {
        filtered = filtered.filter((talent) =>
          filters.skills!.some((skill) =>
            talent.skills.some((ts) =>
              ts.toLowerCase().includes(skill.toLowerCase()),
            ),
          ),
        );
      }
    }

    // Sort talents
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "rating":
          return b.rating - a.rating;
        case "rate":
          return a.hourlyRate - b.hourlyRate;
        case "experience":
          return b.completedJobs - a.completedJobs;
        case "recent":
          return (
            new Date(b.joinedDate).getTime() - new Date(a.joinedDate).getTime()
          );
        default:
          return 0;
      }
    });

    setTalents(filtered);
  }, [searchQuery, selectedCategory, selectedAvailability, sortBy, filters]);

  const getAvailabilityBadge = (availability: string) => {
    switch (availability) {
      case "available":
        return <Badge className="bg-green-100 text-green-800">Available</Badge>;
      case "busy":
        return <Badge className="bg-yellow-100 text-yellow-800">Busy</Badge>;
      case "offline":
        return <Badge className="bg-gray-100 text-gray-800">Offline</Badge>;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {showFilters && (
        <Card>
          <CardHeader>
            <div className="flex flex-col lg:flex-row gap-4">
              {/* Search */}
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                  <Input
                    placeholder="Search talents by name, skills, or title..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              {/* Filters */}
              <div className="flex gap-2">
                <Select
                  value={selectedCategory}
                  onValueChange={setSelectedCategory}
                >
                  <SelectTrigger className="w-48">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select
                  value={selectedAvailability}
                  onValueChange={setSelectedAvailability}
                >
                  <SelectTrigger className="w-48">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {availabilityOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-48">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="rating">Highest Rated</SelectItem>
                    <SelectItem value="rate">Lowest Rate</SelectItem>
                    <SelectItem value="experience">Most Experience</SelectItem>
                    <SelectItem value="recent">Recently Joined</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardHeader>
        </Card>
      )}

      {/* Results Count */}
      <div className="flex items-center justify-between">
        <p className="text-muted-foreground">
          {talents.length} talent{talents.length !== 1 ? "s" : ""} found
        </p>
        <Button variant="outline" size="sm">
          <Filter className="w-4 h-4 mr-2" />
          More Filters
        </Button>
      </div>

      {/* Talents Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {talents.map((talent) => (
          <Card
            key={talent.id}
            className="hover:shadow-lg transition-shadow cursor-pointer"
          >
            <CardContent className="p-6">
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <Avatar className="w-12 h-12">
                    <AvatarImage src={talent.avatar} alt={talent.name} />
                    <AvatarFallback>
                      {talent.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold">{talent.name}</h3>
                      {talent.verified && (
                        <Verified className="w-4 h-4 text-blue-600" />
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {talent.title}
                    </p>
                  </div>
                </div>
                {getAvailabilityBadge(talent.availability)}
              </div>

              {/* Description */}
              <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                {talent.description}
              </p>

              {/* Skills */}
              <div className="flex flex-wrap gap-2 mb-4">
                {talent.skills.slice(0, 4).map((skill) => (
                  <Badge key={skill} variant="secondary" className="text-xs">
                    {skill}
                  </Badge>
                ))}
                {talent.skills.length > 4 && (
                  <Badge variant="outline" className="text-xs">
                    +{talent.skills.length - 4} more
                  </Badge>
                )}
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="flex items-center gap-2">
                  <Star className="w-4 h-4 text-yellow-500 fill-current" />
                  <span className="text-sm font-medium">{talent.rating}</span>
                  <span className="text-sm text-muted-foreground">
                    ({talent.reviewCount} reviews)
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <DollarSign className="w-4 h-4 text-green-600" />
                  <span className="text-sm font-medium">
                    ${talent.hourlyRate}/hr
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-blue-600" />
                  <span className="text-sm">{talent.completedJobs} jobs</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-purple-600" />
                  <span className="text-sm">
                    {talent.responseTime} response
                  </span>
                </div>
              </div>

              {/* Location and badges */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                  <MapPin className="w-4 h-4" />
                  {talent.location}
                </div>
                <div className="flex gap-1">
                  {talent.badges.map((badge) => (
                    <Badge
                      key={badge}
                      className="text-xs bg-blue-100 text-blue-800"
                    >
                      {badge}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Portfolio Preview */}
              {talent.portfolio.length > 0 && (
                <div className="mb-4">
                  <p className="text-sm font-medium mb-2">Recent Work</p>
                  <div className="flex gap-2">
                    {talent.portfolio.slice(0, 2).map((item) => (
                      <img
                        key={item.id}
                        src={item.image}
                        alt={item.title}
                        className="w-16 h-12 rounded object-cover"
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-2">
                <Button
                  className="flex-1"
                  onClick={() => onTalentSelect?.(talent)}
                >
                  <Eye className="w-4 h-4 mr-2" />
                  View Profile
                </Button>
                <Button variant="outline" size="icon">
                  <MessageCircle className="w-4 h-4" />
                </Button>
                <Button variant="outline" size="icon">
                  <Heart className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Load More */}
      {talents.length > 0 && (
        <div className="text-center">
          <Button variant="outline">Load More Talents</Button>
        </div>
      )}

      {/* No Results */}
      {talents.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <Users className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-lg font-medium mb-2">No talents found</h3>
            <p className="text-muted-foreground mb-4">
              Try adjusting your search criteria or filters
            </p>
            <Button
              variant="outline"
              onClick={() => {
                setSearchQuery("");
                setSelectedCategory("All Categories");
                setSelectedAvailability("all");
              }}
            >
              Clear Filters
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default TalentsList;
