import React, { useState, useEffect, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Search,
  Filter,
  MapPin,
  Star,
  Truck,
  Package,
  Clock,
  DollarSign,
  Phone,
  MessageCircle,
  Navigation,
  MoreHorizontal,
  User,
  Calendar,
  Award,
  Shield,
  Zap,
  TrendingUp,
  CheckCircle2,
  Globe,
  Users,
  Target,
  Sparkles,
} from "lucide-react";
import { DispatchPartner, VehicleType, DeliveryType } from "@/types/dispatch";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

// Mock data for partners
const mockPartners: DispatchPartner[] = [
  {
    id: "dp_001",
    userId: "user_001",
    applicationStatus: "approved",
    applicationDate: "2024-01-10T10:00:00Z",
    fullName: "John Doe",
    phoneNumber: "+234 801 234 5678",
    address: "Ikeja, Lagos",
    city: "Lagos",
    state: "Lagos",
    country: "Nigeria",
    vehicleType: "motorcycle",
    vehicleModel: "Honda CB125F",
    vehicleYear: 2022,
    isActive: true,
    isOnline: true,
    totalDeliveries: 145,
    completedDeliveries: 138,
    cancelledDeliveries: 7,
    averageRating: 4.8,
    totalRatings: 120,
    onTimeDeliveryRate: 94.5,
    totalEarnings: 45250,
    pendingPayouts: 3450,
    isVerified: true,
    verificationLevel: "standard",
    complianceScore: 95,
    bio: "Professional delivery partner with 2+ years experience. Fast, reliable, and customer-focused.",
    languages: ["English", "Yoruba"],
    specializations: ["express_delivery", "fragile_items"],
    createdAt: "2024-01-10T10:00:00Z",
    updatedAt: "2024-01-15T16:45:00Z",
  },
  {
    id: "dp_002",
    userId: "user_002",
    applicationStatus: "approved",
    applicationDate: "2024-01-12T09:15:00Z",
    fullName: "Sarah Johnson",
    phoneNumber: "+234 802 345 6789",
    address: "Victoria Island, Lagos",
    city: "Lagos",
    state: "Lagos",
    country: "Nigeria",
    vehicleType: "bicycle",
    vehicleModel: "Mountain Bike",
    vehicleYear: 2023,
    isActive: true,
    isOnline: true,
    totalDeliveries: 89,
    completedDeliveries: 85,
    cancelledDeliveries: 4,
    averageRating: 4.9,
    totalRatings: 78,
    onTimeDeliveryRate: 97.2,
    totalEarnings: 28750,
    pendingPayouts: 2100,
    isVerified: true,
    verificationLevel: "premium",
    complianceScore: 98,
    bio: "Eco-friendly delivery specialist focusing on short-distance deliveries. Available 7 days a week.",
    languages: ["English", "French"],
    specializations: ["eco_friendly", "document_delivery"],
    createdAt: "2024-01-12T09:15:00Z",
    updatedAt: "2024-01-15T18:30:00Z",
  },
  {
    id: "dp_003",
    userId: "user_003",
    applicationStatus: "approved",
    applicationDate: "2024-01-08T14:20:00Z",
    fullName: "Mike Chen",
    phoneNumber: "+234 803 456 7890",
    address: "Lekki, Lagos",
    city: "Lagos",
    state: "Lagos",
    country: "Nigeria",
    vehicleType: "car",
    vehicleModel: "Toyota Corolla",
    vehicleYear: 2020,
    isActive: true,
    isOnline: false,
    totalDeliveries: 203,
    completedDeliveries: 195,
    cancelledDeliveries: 8,
    averageRating: 4.7,
    totalRatings: 167,
    onTimeDeliveryRate: 92.1,
    totalEarnings: 67800,
    pendingPayouts: 4200,
    isVerified: true,
    verificationLevel: "premium",
    complianceScore: 88,
    bio: "Bulk delivery specialist with spacious vehicle. Perfect for large orders and multiple drop-offs.",
    languages: ["English", "Mandarin"],
    specializations: ["bulk_orders", "multiple_stops"],
    createdAt: "2024-01-08T14:20:00Z",
    updatedAt: "2024-01-15T12:00:00Z",
  },
];

const VEHICLE_TYPE_LABELS: Record<VehicleType, string> = {
  motorcycle: "Motorcycle",
  bicycle: "Bicycle",
  car: "Car",
  van: "Van",
  truck: "Truck",
};

const VERIFICATION_LEVELS = {
  basic: { label: "Basic", color: "bg-gray-100 text-gray-800" },
  standard: { label: "Standard", color: "bg-blue-100 text-blue-800" },
  premium: { label: "Premium", color: "bg-purple-100 text-purple-800" },
};

export const DispatchPartners: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [partners, setPartners] = useState<DispatchPartner[]>(mockPartners);
  const [filteredPartners, setFilteredPartners] = useState<DispatchPartner[]>(mockPartners);
  const [searchTerm, setSearchTerm] = useState("");
  const [locationFilter, setLocationFilter] = useState("all");
  const [vehicleFilter, setVehicleFilter] = useState("all");
  const [availabilityFilter, setAvailabilityFilter] = useState("all");
  const [ratingFilter, setRatingFilter] = useState("all");
  const [selectedPartner, setSelectedPartner] = useState<DispatchPartner | null>(null);
  const [activeTab, setActiveTab] = useState("all");

  // Filter partners based on search and filters
  useEffect(() => {
    let filtered = partners;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(partner =>
        partner.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        partner.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
        partner.specializations?.some(spec => 
          spec.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    }

    // Location filter
    if (locationFilter !== "all") {
      filtered = filtered.filter(partner => 
        partner.city.toLowerCase() === locationFilter.toLowerCase()
      );
    }

    // Vehicle filter
    if (vehicleFilter !== "all") {
      filtered = filtered.filter(partner => partner.vehicleType === vehicleFilter);
    }

    // Availability filter
    if (availabilityFilter !== "all") {
      filtered = filtered.filter(partner => 
        availabilityFilter === "online" ? partner.isOnline : !partner.isOnline
      );
    }

    // Rating filter
    if (ratingFilter !== "all") {
      const minRating = parseFloat(ratingFilter);
      filtered = filtered.filter(partner => partner.averageRating >= minRating);
    }

    // Tab filter
    if (activeTab !== "all") {
      switch (activeTab) {
        case "top-rated":
          filtered = filtered.filter(partner => partner.averageRating >= 4.7);
          break;
        case "verified":
          filtered = filtered.filter(partner => partner.isVerified);
          break;
        case "online":
          filtered = filtered.filter(partner => partner.isOnline);
          break;
      }
    }

    setFilteredPartners(filtered);
  }, [partners, searchTerm, locationFilter, vehicleFilter, availabilityFilter, ratingFilter, activeTab]);

  const handleContactPartner = (partner: DispatchPartner, method: "call" | "message") => {
    if (method === "call") {
      window.open(`tel:${partner.phoneNumber}`);
    } else {
      toast.info("Messaging feature coming soon");
    }
  };

  const StatCard: React.FC<{
    title: string;
    value: string | number;
    icon: React.ComponentType<{ className?: string }>;
    color: string;
  }> = ({ title, value, icon: Icon, color }) => (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{title}</p>
            <p className="text-3xl font-bold text-gray-900 dark:text-white">{value}</p>
          </div>
          <div className={`p-3 rounded-lg ${color}`}>
            <Icon className="w-6 h-6 text-white" />
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const PartnerCard: React.FC<{ partner: DispatchPartner }> = ({ partner }) => (
    <Card className="hover:shadow-lg transition-shadow cursor-pointer group">
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-4">
            <Avatar className="w-16 h-16">
              <AvatarFallback className="text-lg font-bold bg-gradient-to-br from-blue-500 to-purple-600 text-white">
                {partner.fullName[0]}
              </AvatarFallback>
            </Avatar>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h3 className="font-bold text-lg text-gray-900 dark:text-white">
                  {partner.fullName}
                </h3>
                {partner.isVerified && (
                  <CheckCircle2 className="w-5 h-5 text-blue-500" />
                )}
              </div>
              <div className="flex items-center gap-2 mb-2">
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  <span className="font-medium">{partner.averageRating}</span>
                  <span className="text-sm text-gray-500">({partner.totalRatings})</span>
                </div>
                <div className={`w-2 h-2 rounded-full ${partner.isOnline ? 'bg-green-500' : 'bg-gray-400'}`} />
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  {partner.isOnline ? 'Online' : 'Offline'}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-gray-400" />
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  {partner.city}, {partner.state}
                </span>
              </div>
            </div>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="opacity-0 group-hover:opacity-100 transition-opacity">
                <MoreHorizontal className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setSelectedPartner(partner)}>
                <User className="w-4 h-4 mr-2" />
                View Profile
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleContactPartner(partner, "call")}>
                <Phone className="w-4 h-4 mr-2" />
                Call Partner
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleContactPartner(partner, "message")}>
                <MessageCircle className="w-4 h-4 mr-2" />
                Send Message
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="space-y-3">
          {/* Vehicle Info */}
          <div className="flex items-center gap-3 p-2 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <Truck className="w-5 h-5 text-gray-600" />
            <div>
              <p className="font-medium text-sm">{VEHICLE_TYPE_LABELS[partner.vehicleType]}</p>
              <p className="text-xs text-gray-600 dark:text-gray-400">
                {partner.vehicleModel} • {partner.vehicleYear}
              </p>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-3 text-center">
            <div>
              <p className="font-bold text-lg">{partner.totalDeliveries}</p>
              <p className="text-xs text-gray-600 dark:text-gray-400">Deliveries</p>
            </div>
            <div>
              <p className="font-bold text-lg">{partner.onTimeDeliveryRate}%</p>
              <p className="text-xs text-gray-600 dark:text-gray-400">On-time</p>
            </div>
            <div>
              <p className="font-bold text-lg">{partner.complianceScore}</p>
              <p className="text-xs text-gray-600 dark:text-gray-400">Score</p>
            </div>
          </div>

          {/* Specializations */}
          {partner.specializations && partner.specializations.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {partner.specializations.slice(0, 3).map((spec, index) => (
                <Badge key={index} variant="secondary" className="text-xs">
                  {spec.replace('_', ' ')}
                </Badge>
              ))}
              {partner.specializations.length > 3 && (
                <Badge variant="outline" className="text-xs">
                  +{partner.specializations.length - 3} more
                </Badge>
              )}
            </div>
          )}

          {/* Verification Level */}
          <div className="flex items-center justify-between">
            <Badge className={VERIFICATION_LEVELS[partner.verificationLevel].color}>
              {VERIFICATION_LEVELS[partner.verificationLevel].label}
            </Badge>
            <div className="flex gap-2">
              <Button size="sm" variant="outline" onClick={() => handleContactPartner(partner, "call")}>
                <Phone className="w-4 h-4" />
              </Button>
              <Button size="sm" onClick={() => setSelectedPartner(partner)}>
                View Profile
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-700 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Our Delivery Partners
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-blue-100">
              Professional, verified delivery partners across Nigeria
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                className="bg-white text-blue-600 hover:bg-gray-100"
                onClick={() => navigate("/app/dispatch/apply")}
              >
                <Truck className="w-5 h-5 mr-2" />
                Become a Partner
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="border-white text-white hover:bg-white hover:text-blue-600"
                onClick={() => document.getElementById("partners-section")?.scrollIntoView({ behavior: 'smooth' })}
              >
                <Search className="w-5 h-5 mr-2" />
                Find Partners
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          <StatCard
            title="Active Partners"
            value="150+"
            icon={Users}
            color="bg-gradient-to-br from-blue-500 to-cyan-600"
          />
          <StatCard
            title="Cities Covered"
            value="25+"
            icon={Globe}
            color="bg-gradient-to-br from-green-500 to-emerald-600"
          />
          <StatCard
            title="Deliveries Made"
            value="50K+"
            icon={Package}
            color="bg-gradient-to-br from-purple-500 to-violet-600"
          />
          <StatCard
            title="Average Rating"
            value="4.8"
            icon={Star}
            color="bg-gradient-to-br from-yellow-500 to-orange-600"
          />
        </div>

        {/* Filters and Search */}
        <div id="partners-section" className="mb-8">
          <Card>
            <CardHeader>
              <CardTitle>Find the Perfect Delivery Partner</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Search */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    placeholder="Search by name, location, or specialization..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>

                {/* Filters */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <Select value={locationFilter} onValueChange={setLocationFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder="Location" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Cities</SelectItem>
                      <SelectItem value="lagos">Lagos</SelectItem>
                      <SelectItem value="abuja">Abuja</SelectItem>
                      <SelectItem value="kano">Kano</SelectItem>
                      <SelectItem value="port harcourt">Port Harcourt</SelectItem>
                    </SelectContent>
                  </Select>

                  <Select value={vehicleFilter} onValueChange={setVehicleFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder="Vehicle Type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Vehicles</SelectItem>
                      <SelectItem value="motorcycle">Motorcycle</SelectItem>
                      <SelectItem value="bicycle">Bicycle</SelectItem>
                      <SelectItem value="car">Car</SelectItem>
                      <SelectItem value="van">Van</SelectItem>
                      <SelectItem value="truck">Truck</SelectItem>
                    </SelectContent>
                  </Select>

                  <Select value={availabilityFilter} onValueChange={setAvailabilityFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder="Availability" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Partners</SelectItem>
                      <SelectItem value="online">Online Now</SelectItem>
                      <SelectItem value="offline">Offline</SelectItem>
                    </SelectContent>
                  </Select>

                  <Select value={ratingFilter} onValueChange={setRatingFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder="Minimum Rating" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Any Rating</SelectItem>
                      <SelectItem value="4.5">4.5+ Stars</SelectItem>
                      <SelectItem value="4.0">4.0+ Stars</SelectItem>
                      <SelectItem value="3.5">3.5+ Stars</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-8">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="all">All Partners ({filteredPartners.length})</TabsTrigger>
            <TabsTrigger value="top-rated">
              <Star className="w-4 h-4 mr-2" />
              Top Rated
            </TabsTrigger>
            <TabsTrigger value="verified">
              <Shield className="w-4 h-4 mr-2" />
              Verified
            </TabsTrigger>
            <TabsTrigger value="online">
              <Zap className="w-4 h-4 mr-2" />
              Online Now
            </TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab} className="mt-6">
            {filteredPartners.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredPartners.map((partner) => (
                  <PartnerCard key={partner.id} partner={partner} />
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="p-12 text-center">
                  <Package className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                    No Partners Found
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-4">
                    Try adjusting your filters or search terms
                  </p>
                  <Button variant="outline" onClick={() => {
                    setSearchTerm("");
                    setLocationFilter("all");
                    setVehicleFilter("all");
                    setAvailabilityFilter("all");
                    setRatingFilter("all");
                    setActiveTab("all");
                  }}>
                    Clear Filters
                  </Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>

        {/* CTA Section */}
        <Card className="bg-gradient-to-r from-green-500 to-blue-600 text-white border-0">
          <CardContent className="p-8 text-center">
            <h2 className="text-2xl font-bold mb-4">Ready to Join Our Network?</h2>
            <p className="text-lg mb-6 text-green-100">
              Become a verified delivery partner and start earning money today
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                className="bg-white text-green-600 hover:bg-gray-100"
                onClick={() => navigate("/app/dispatch/apply")}
              >
                <Sparkles className="w-5 h-5 mr-2" />
                Apply Now
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="border-white text-white hover:bg-white hover:text-green-600"
                onClick={() => navigate("/app/feed")}
              >
                Learn More
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Partner Detail Dialog */}
      {selectedPartner && (
        <Dialog open={!!selectedPartner} onOpenChange={() => setSelectedPartner(null)}>
          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Partner Profile</DialogTitle>
            </DialogHeader>
            
            <div className="space-y-6">
              {/* Partner Info */}
              <div className="flex items-center gap-4">
                <Avatar className="w-20 h-20">
                  <AvatarFallback className="text-xl font-bold bg-gradient-to-br from-blue-500 to-purple-600 text-white">
                    {selectedPartner.fullName[0]}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h2 className="text-2xl font-bold">{selectedPartner.fullName}</h2>
                    {selectedPartner.isVerified && (
                      <CheckCircle2 className="w-6 h-6 text-blue-500" />
                    )}
                  </div>
                  <div className="flex items-center gap-4 mb-2">
                    <div className="flex items-center gap-1">
                      <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                      <span className="font-bold text-lg">{selectedPartner.averageRating}</span>
                      <span className="text-gray-500">({selectedPartner.totalRatings} reviews)</span>
                    </div>
                    <div className={`flex items-center gap-2 px-2 py-1 rounded-full ${
                      selectedPartner.isOnline ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                    }`}>
                      <div className={`w-2 h-2 rounded-full ${selectedPartner.isOnline ? 'bg-green-500' : 'bg-gray-400'}`} />
                      <span className="text-sm font-medium">
                        {selectedPartner.isOnline ? 'Online' : 'Offline'}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                    <MapPin className="w-4 h-4" />
                    <span>{selectedPartner.city}, {selectedPartner.state}</span>
                  </div>
                </div>
              </div>

              {/* Bio */}
              {selectedPartner.bio && (
                <div>
                  <h3 className="font-semibold mb-2">About</h3>
                  <p className="text-gray-700 dark:text-gray-300">{selectedPartner.bio}</p>
                </div>
              )}

              {/* Performance Stats */}
              <div>
                <h3 className="font-semibold mb-4">Performance Statistics</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                    <Package className="w-6 h-6 mx-auto mb-2 text-blue-600" />
                    <p className="font-bold text-lg">{selectedPartner.totalDeliveries}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Total Deliveries</p>
                  </div>
                  <div className="text-center p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                    <CheckCircle2 className="w-6 h-6 mx-auto mb-2 text-green-600" />
                    <p className="font-bold text-lg">{selectedPartner.completedDeliveries}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Completed</p>
                  </div>
                  <div className="text-center p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                    <Clock className="w-6 h-6 mx-auto mb-2 text-purple-600" />
                    <p className="font-bold text-lg">{selectedPartner.onTimeDeliveryRate}%</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">On-time Rate</p>
                  </div>
                  <div className="text-center p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                    <Award className="w-6 h-6 mx-auto mb-2 text-orange-600" />
                    <p className="font-bold text-lg">{selectedPartner.complianceScore}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Compliance Score</p>
                  </div>
                </div>
              </div>

              {/* Vehicle Information */}
              <div>
                <h3 className="font-semibold mb-4">Vehicle Information</h3>
                <div className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <Truck className="w-8 h-8 text-gray-600" />
                  <div>
                    <p className="font-medium">{VEHICLE_TYPE_LABELS[selectedPartner.vehicleType]}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {selectedPartner.vehicleModel} • {selectedPartner.vehicleYear}
                    </p>
                  </div>
                </div>
              </div>

              {/* Specializations */}
              {selectedPartner.specializations && selectedPartner.specializations.length > 0 && (
                <div>
                  <h3 className="font-semibold mb-4">Specializations</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedPartner.specializations.map((spec, index) => (
                      <Badge key={index} variant="secondary">
                        {spec.replace('_', ' ')}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* Languages */}
              {selectedPartner.languages && selectedPartner.languages.length > 0 && (
                <div>
                  <h3 className="font-semibold mb-4">Languages</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedPartner.languages.map((lang, index) => (
                      <Badge key={index} variant="outline">
                        {lang}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* Contact Actions */}
              <div className="flex gap-3 pt-4 border-t">
                <Button 
                  className="flex-1"
                  onClick={() => handleContactPartner(selectedPartner, "call")}
                >
                  <Phone className="w-4 h-4 mr-2" />
                  Call Partner
                </Button>
                <Button 
                  variant="outline" 
                  className="flex-1"
                  onClick={() => handleContactPartner(selectedPartner, "message")}
                >
                  <MessageCircle className="w-4 h-4 mr-2" />
                  Send Message
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default DispatchPartners;
