import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
  Truck,
  Package,
  Clock,
  MapPin,
  Phone,
  CheckCircle,
  AlertCircle,
  Navigation,
  Camera,
  MessageCircle,
  Star,
  User,
  Calendar,
  Route,
  Search,
  Shield,
  Zap,
  Globe,
  ArrowRight,
  Download,
  TrendingUp,
} from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { cn } from "@/lib/utils";
import Header from "@/home/Header";
import Footer from "@/home/Footer";

interface TrackingEvent {
  id: string;
  eventType: string;
  description: string;
  timestamp: string;
  location?: {
    latitude: number;
    longitude: number;
    address: string;
  };
  photos?: string[];
  metadata?: any;
}

interface DeliveryAssignment {
  id: string;
  orderId: string;
  orderNumber: string;
  status: string;
  trackingNumber: string;
  pickupAddress: any;
  deliveryAddress: any;
  packageDetails: any;
  deliveryFee: number;
  estimatedDeliveryTime: string;
  actualPickupTime?: string;
  actualDeliveryTime?: string;
  driverNotes?: string;
  customerNotes?: string;
  pickupPhotos?: string[];
  deliveryPhotos?: string[];
  signatureUrl?: string;
  recipientName?: string;
  createdAt: string;
}

interface DeliveryProvider {
  businessName: string;
  contactPhone: string;
  rating: number;
  reviewCount: number;
}

const mockTrackingData = {
  assignment: {
    id: "1",
    orderId: "order-1",
    orderNumber: "SC240001",
    status: "in_transit",
    trackingNumber: "SC240001ABC",
    pickupAddress: {
      name: "TechStore Inc",
      address: "123 Business St, Downtown",
      phone: "+1-555-0123",
    },
    deliveryAddress: {
      name: "John Smith",
      address: "456 Residential Ave, Suburbs",
      phone: "+1-555-0456",
    },
    packageDetails: {
      weight: 2.5,
      dimensions: { length: 30, width: 20, height: 15 },
      value: 299.99,
      description: "Electronics - Smartphone",
      fragile: true,
    },
    deliveryFee: 12.50,
    estimatedDeliveryTime: "2024-01-15T16:00:00Z",
    actualPickupTime: "2024-01-15T14:15:00Z",
    customerNotes: "Please ring doorbell, leave at door if no answer",
    createdAt: "2024-01-15T10:30:00Z",
  },
  provider: {
    businessName: "FastTrack Delivery",
    contactPhone: "+1-555-0123",
    rating: 4.8,
    reviewCount: 247,
  },
  trackingEvents: [
    {
      id: "1",
      eventType: "created",
      description: "Delivery assignment created",
      timestamp: "2024-01-15T10:30:00Z",
      location: {
        latitude: 40.7128,
        longitude: -74.0060,
        address: "Business District, New York",
      },
    },
    {
      id: "2",
      eventType: "accepted",
      description: "Delivery accepted by FastTrack Delivery",
      timestamp: "2024-01-15T11:00:00Z",
    },
    {
      id: "3",
      eventType: "picked_up",
      description: "Package picked up from TechStore Inc",
      timestamp: "2024-01-15T14:15:00Z",
      location: {
        latitude: 40.7580,
        longitude: -73.9855,
        address: "123 Business St, Downtown",
      },
      photos: ["/pickup-photo-1.jpg"],
    },
    {
      id: "4",
      eventType: "in_transit",
      description: "Package is on the way to destination",
      timestamp: "2024-01-15T14:30:00Z",
      location: {
        latitude: 40.7505,
        longitude: -73.9934,
        address: "En route to delivery address",
      },
    },
  ],
};

const trackingTips = [
  {
    icon: Package,
    title: "Package Preparation",
    description: "Ensure your package is properly labeled and sealed for safe delivery.",
  },
  {
    icon: Clock,
    title: "Delivery Windows",
    description: "Track estimated delivery times and receive real-time updates.",
  },
  {
    icon: Shield,
    title: "Secure Delivery",
    description: "All deliveries include photo confirmation and digital signatures.",
  },
  {
    icon: Phone,
    title: "Direct Communication",
    description: "Contact your delivery provider directly through our platform.",
  },
];

const networkStats = [
  { label: "Active Providers", value: "1,250+", icon: Truck },
  { label: "Cities Covered", value: "85", icon: Globe },
  { label: "Average Rating", value: "4.8★", icon: Star },
  { label: "Packages Delivered", value: "50K+", icon: Package },
];

export default function DeliveryTrackingPublic() {
  const [trackingNumber, setTrackingNumber] = useState("");
  const [trackingData, setTrackingData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showTips, setShowTips] = useState(true);
  const { toast } = useToast();

  const handleTrackDelivery = async () => {
    if (!trackingNumber.trim()) {
      setError("Please enter a tracking number");
      return;
    }

    setLoading(true);
    setError(null);
    setShowTips(false);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      if (trackingNumber === "SC240001ABC") {
        setTrackingData(mockTrackingData);
      } else {
        setError("Tracking number not found. Please check your tracking number and try again.");
      }
    } catch (err) {
      setError("Failed to fetch tracking information. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "accepted":
        return "bg-blue-100 text-blue-800";
      case "picked_up":
        return "bg-purple-100 text-purple-800";
      case "in_transit":
        return "bg-orange-100 text-orange-800";
      case "delivered":
        return "bg-green-100 text-green-800";
      case "failed":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return <Clock className="h-4 w-4" />;
      case "accepted":
        return <CheckCircle className="h-4 w-4" />;
      case "picked_up":
        return <Package className="h-4 w-4" />;
      case "in_transit":
        return <Truck className="h-4 w-4" />;
      case "delivered":
        return <CheckCircle className="h-4 w-4" />;
      case "failed":
        return <AlertCircle className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  const getEventIcon = (eventType: string) => {
    switch (eventType) {
      case "created":
        return <Package className="h-4 w-4 text-blue-500" />;
      case "accepted":
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case "picked_up":
        return <Package className="h-4 w-4 text-purple-500" />;
      case "in_transit":
        return <Truck className="h-4 w-4 text-orange-500" />;
      case "delivered":
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      default:
        return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  const getNextExpectedEvent = (currentStatus: string) => {
    switch (currentStatus) {
      case "pending":
        return "Awaiting pickup";
      case "accepted":
        return "Pickup scheduled";
      case "picked_up":
        return "In transit to destination";
      case "in_transit":
        return "Out for delivery";
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-6">
            <div className="bg-blue-100 p-4 rounded-full">
              <Search className="h-12 w-12 text-blue-600" />
            </div>
          </div>
          <h1 className="text-4xl font-bold mb-4">Track Your Package</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Enter your tracking number to get real-time updates on your delivery status, 
            location, and estimated arrival time.
          </p>
        </div>

        {/* Network Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          {networkStats.map((stat, index) => (
            <Card key={index} className="text-center p-4">
              <div className="flex justify-center mb-2">
                <stat.icon className="h-6 w-6 text-blue-600" />
              </div>
              <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
              <div className="text-sm text-gray-600">{stat.label}</div>
            </Card>
          ))}
        </div>

        {/* Tracking Input */}
        <Card className="max-w-2xl mx-auto mb-12">
          <CardContent className="p-8">
            <div className="space-y-4">
              <div>
                <Label htmlFor="tracking-number" className="text-lg font-medium">
                  Tracking Number
                </Label>
                <p className="text-sm text-gray-600 mt-1">
                  Your tracking number was provided in your confirmation email
                </p>
              </div>
              <div className="flex gap-4">
                <Input
                  id="tracking-number"
                  value={trackingNumber}
                  onChange={(e) => setTrackingNumber(e.target.value)}
                  placeholder="Enter tracking number (e.g., SC240001ABC)"
                  className="flex-1 text-lg py-6"
                />
                <Button
                  onClick={handleTrackDelivery}
                  disabled={loading}
                  className="px-8 py-6 text-lg"
                >
                  {loading ? (
                    <>
                      <Clock className="h-5 w-5 mr-2 animate-spin" />
                      Tracking...
                    </>
                  ) : (
                    <>
                      <Search className="h-5 w-5 mr-2" />
                      Track
                    </>
                  )}
                </Button>
              </div>
              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <div className="flex items-center">
                    <AlertCircle className="h-5 w-5 text-red-600 mr-2" />
                    <p className="text-red-700">{error}</p>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Loading State */}
        {loading && (
          <Card className="max-w-2xl mx-auto mb-12">
            <CardContent className="p-12 text-center">
              <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto mb-6"></div>
              <h3 className="text-xl font-medium mb-2">Searching for your package...</h3>
              <p className="text-gray-600">Please wait while we locate your delivery information</p>
            </CardContent>
          </Card>
        )}

        {/* Tracking Results */}
        {trackingData && !loading && (
          <div className="space-y-8 mb-12">
            {/* Status Overview */}
            <Card className="max-w-4xl mx-auto">
              <CardContent className="p-8">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-2xl font-bold mb-2">Order #{trackingData.assignment.orderNumber}</h2>
                    <div className="flex items-center gap-3">
                      <Badge className={cn(getStatusColor(trackingData.assignment.status), "text-lg px-4 py-2")}>
                        {getStatusIcon(trackingData.assignment.status)}
                        <span className="ml-2 capitalize">
                          {trackingData.assignment.status.replace('_', ' ')}
                        </span>
                      </Badge>
                      <span className="text-sm text-gray-500">
                        Tracking: {trackingData.assignment.trackingNumber}
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-500">Delivery Fee</p>
                    <p className="text-2xl font-bold text-green-600">
                      {formatCurrency(trackingData.assignment.deliveryFee)}
                    </p>
                  </div>
                </div>

                {/* Next Expected Update */}
                {getNextExpectedEvent(trackingData.assignment.status) && (
                  <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-xl border border-blue-200">
                    <div className="flex items-center gap-3">
                      <div className="bg-blue-600 p-2 rounded-lg">
                        <Clock className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <p className="font-medium text-blue-900 text-lg">
                          {getNextExpectedEvent(trackingData.assignment.status)}
                        </p>
                        <p className="text-blue-700">
                          Expected delivery: {formatDateTime(trackingData.assignment.estimatedDeliveryTime)}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {/* Tracking Timeline */}
              <div className="lg:col-span-2">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-xl">
                      <Route className="h-6 w-6" />
                      Delivery Timeline
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-8">
                      {trackingData.trackingEvents.map((event: TrackingEvent, index: number) => (
                        <div key={event.id} className="flex gap-4">
                          <div className="flex flex-col items-center">
                            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-gray-100 border-2 border-white shadow-lg">
                              {getEventIcon(event.eventType)}
                            </div>
                            {index < trackingData.trackingEvents.length - 1 && (
                              <div className="w-0.5 h-16 bg-gray-200 mt-2"></div>
                            )}
                          </div>
                          <div className="flex-1 pb-8">
                            <div className="flex items-center justify-between mb-2">
                              <h4 className="font-medium text-lg">{event.description}</h4>
                              <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                                {formatDateTime(event.timestamp)}
                              </span>
                            </div>
                            {event.location && (
                              <p className="text-gray-600 flex items-center gap-2 mb-3">
                                <MapPin className="h-4 w-4" />
                                {event.location.address}
                              </p>
                            )}
                            {event.photos && event.photos.length > 0 && (
                              <Button variant="outline" size="sm">
                                <Camera className="h-4 w-4 mr-2" />
                                View Photos ({event.photos.length})
                              </Button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Delivery Details */}
              <div className="space-y-6">
                {/* Package Information */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Package className="h-5 w-5" />
                      Package Details
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <p className="text-sm font-medium">Description</p>
                      <p className="text-gray-600">{trackingData.assignment.packageDetails.description}</p>
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="font-medium">Weight</p>
                        <p className="text-gray-600">{trackingData.assignment.packageDetails.weight}kg</p>
                      </div>
                      <div>
                        <p className="font-medium">Value</p>
                        <p className="text-gray-600">
                          {formatCurrency(trackingData.assignment.packageDetails.value)}
                        </p>
                      </div>
                    </div>
                    {trackingData.assignment.packageDetails.fragile && (
                      <Badge variant="destructive" className="text-xs">
                        <AlertCircle className="h-3 w-3 mr-1" />
                        Fragile Item
                      </Badge>
                    )}
                  </CardContent>
                </Card>

                {/* Delivery Provider */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Truck className="h-5 w-5" />
                      Delivery Provider
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <p className="font-medium text-lg">{trackingData.provider.businessName}</p>
                      <div className="flex items-center gap-1 mt-1">
                        <Star className="h-4 w-4 text-yellow-500 fill-current" />
                        <span className="font-medium">{trackingData.provider.rating}</span>
                        <span className="text-sm text-gray-500">
                          ({trackingData.provider.reviewCount} reviews)
                        </span>
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full"
                      onClick={() => {
                        toast({
                          title: "Contact Information",
                          description: "Contact details will be available once delivery is in progress.",
                        });
                      }}
                    >
                      <Phone className="h-4 w-4 mr-2" />
                      Contact Provider
                    </Button>
                  </CardContent>
                </Card>

                {/* Addresses */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <MapPin className="h-5 w-5" />
                      Addresses
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <p className="text-sm font-medium text-red-600 mb-1">From</p>
                      <p className="font-medium">{trackingData.assignment.pickupAddress.name}</p>
                      <p className="text-sm text-gray-600">{trackingData.assignment.pickupAddress.address}</p>
                    </div>
                    <Separator />
                    <div>
                      <p className="text-sm font-medium text-green-600 mb-1">To</p>
                      <p className="font-medium">{trackingData.assignment.deliveryAddress.name}</p>
                      <p className="text-sm text-gray-600">{trackingData.assignment.deliveryAddress.address}</p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        )}

        {/* Tracking Tips */}
        {showTips && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-center mb-8">Delivery Tips & Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {trackingTips.map((tip, index) => (
                <Card key={index} className="text-center p-6 hover:shadow-lg transition-shadow">
                  <div className="bg-blue-50 p-3 rounded-full w-fit mx-auto mb-4">
                    <tip.icon className="h-6 w-6 text-blue-600" />
                  </div>
                  <h3 className="font-medium mb-2">{tip.title}</h3>
                  <p className="text-sm text-gray-600">{tip.description}</p>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Call to Action */}
        <div className="text-center">
          <Card className="max-w-2xl mx-auto bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
            <CardContent className="p-8">
              <h2 className="text-2xl font-bold mb-4">Need Help with Your Delivery?</h2>
              <p className="mb-6 opacity-90">
                Our customer support team is here to help with any questions about your package.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button variant="secondary" size="lg">
                  <MessageCircle className="h-5 w-5 mr-2" />
                  Contact Support
                </Button>
                <Button variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-blue-600">
                  <Download className="h-5 w-5 mr-2" />
                  Download App
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <Footer />
    </div>
  );
}
