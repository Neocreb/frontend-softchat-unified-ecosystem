import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Truck,
  Package,
  Clock,
  MapPin,
  Star,
  Shield,
  Search,
  Plus,
  TrendingUp,
  Users,
  DollarSign,
  CheckCircle,
  ArrowRight,
  Phone,
  Mail,
  Globe,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/components/ui/use-toast";

export default function DeliveryHub() {
  const [trackingNumber, setTrackingNumber] = useState("");
  const [deliveryStats, setDeliveryStats] = useState({
    totalDeliveries: 1247,
    activeProviders: 23,
    averageRating: 4.8,
    onTimeRate: 94.2,
  });
  const { user } = useAuth();
  const { toast } = useToast();

  const handleTrackDelivery = () => {
    if (!trackingNumber.trim()) {
      toast({
        title: "Enter Tracking Number",
        description: "Please enter a tracking number to track your delivery.",
        variant: "destructive",
      });
      return;
    }
    // Navigate to tracking page with the tracking number
    window.location.href = `/app/delivery/track/${trackingNumber}`;
  };

  const features = [
    {
      icon: Shield,
      title: "Verified Providers",
      description: "All delivery providers are verified with proper documentation and insurance.",
    },
    {
      icon: Clock,
      title: "Real-Time Tracking",
      description: "Track your deliveries in real-time with live updates and notifications.",
    },
    {
      icon: Star,
      title: "Quality Service",
      description: "High-rated providers with excellent customer satisfaction scores.",
    },
    {
      icon: DollarSign,
      title: "Competitive Pricing",
      description: "Compare prices from multiple providers to get the best deal.",
    },
  ];

  const howItWorks = [
    {
      step: 1,
      title: "Place Your Order",
      description: "Add physical items to your cart and proceed to checkout.",
    },
    {
      step: 2,
      title: "Choose Provider",
      description: "Select from verified delivery providers in your area.",
    },
    {
      step: 3,
      title: "Track Delivery",
      description: "Follow your package in real-time from pickup to delivery.",
    },
    {
      step: 4,
      title: "Receive & Review",
      description: "Confirm delivery and rate your experience.",
    },
  ];

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-8">
      {/* Header Section */}
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center gap-2 mb-4">
          <Truck className="h-8 w-8 text-primary" />
          <h1 className="text-4xl font-bold">Delivery Hub</h1>
        </div>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Professional delivery services for your marketplace purchases. Fast, reliable, and trackable.
        </p>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Track Delivery */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Search className="h-5 w-5" />
              Track Your Delivery
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="tracking">Tracking Number</Label>
              <Input
                id="tracking"
                value={trackingNumber}
                onChange={(e) => setTrackingNumber(e.target.value)}
                placeholder="Enter tracking number"
              />
            </div>
            <Button onClick={handleTrackDelivery} className="w-full">
              <Search className="h-4 w-4 mr-2" />
              Track Package
            </Button>
            <Link to="/app/delivery/track" className="block">
              <Button variant="outline" className="w-full">
                View All My Deliveries
              </Button>
            </Link>
          </CardContent>
        </Card>

        {/* Become a Provider */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Plus className="h-5 w-5" />
              Become a Provider
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-gray-600">
              Join our delivery network and start earning by providing delivery services.
            </p>
            <Link to="/app/delivery/provider/register">
              <Button className="w-full">
                <Plus className="h-4 w-4 mr-2" />
                Apply Now
              </Button>
            </Link>
            <div className="text-xs text-gray-500">
              <CheckCircle className="h-3 w-3 inline mr-1" />
              Background check required
            </div>
          </CardContent>
        </Card>

        {/* Provider Dashboard */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Provider Dashboard
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-gray-600">
              Manage your delivery assignments and track your earnings.
            </p>
            <Link to="/app/delivery/provider/dashboard">
              <Button variant="outline" className="w-full">
                <TrendingUp className="h-4 w-4 mr-2" />
                Access Dashboard
              </Button>
            </Link>
            <div className="text-xs text-gray-500">
              For verified providers only
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Stats Section */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6 text-center">
            <div className="text-2xl font-bold text-primary">{deliveryStats.totalDeliveries.toLocaleString()}</div>
            <div className="text-sm text-gray-600">Total Deliveries</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 text-center">
            <div className="text-2xl font-bold text-primary">{deliveryStats.activeProviders}</div>
            <div className="text-sm text-gray-600">Active Providers</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 text-center">
            <div className="text-2xl font-bold text-primary">{deliveryStats.averageRating}</div>
            <div className="text-sm text-gray-600">Average Rating</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 text-center">
            <div className="text-2xl font-bold text-primary">{deliveryStats.onTimeRate}%</div>
            <div className="text-sm text-gray-600">On-Time Rate</div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="features" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="features">Features</TabsTrigger>
          <TabsTrigger value="how-it-works">How It Works</TabsTrigger>
          <TabsTrigger value="support">Support</TabsTrigger>
        </TabsList>

        <TabsContent value="features" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {features.map((feature, index) => (
              <Card key={index}>
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="h-12 w-12 bg-primary/10 rounded-lg flex items-center justify-center">
                      <feature.icon className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-2">{feature.title}</h3>
                      <p className="text-gray-600 text-sm">{feature.description}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="how-it-works" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {howItWorks.map((step, index) => (
              <Card key={index} className="text-center">
                <CardContent className="p-6">
                  <div className="h-12 w-12 bg-primary rounded-full flex items-center justify-center text-white font-bold text-lg mx-auto mb-4">
                    {step.step}
                  </div>
                  <h3 className="font-semibold mb-2">{step.title}</h3>
                  <p className="text-gray-600 text-sm">{step.description}</p>
                  {index < howItWorks.length - 1 && (
                    <ArrowRight className="h-5 w-5 text-gray-400 mx-auto mt-4 hidden lg:block" />
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="support" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Phone className="h-5 w-5" />
                  Phone Support
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">
                  Get immediate help from our customer service team.
                </p>
                <Button variant="outline" className="w-full">
                  Call Support
                </Button>
                <p className="text-xs text-gray-500 mt-2">
                  Available 24/7 for urgent delivery issues
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Mail className="h-5 w-5" />
                  Email Support
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">
                  Send us an email for detailed assistance and documentation.
                </p>
                <Button variant="outline" className="w-full">
                  Send Email
                </Button>
                <p className="text-xs text-gray-500 mt-2">
                  Response within 2-4 business hours
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="h-5 w-5" />
                  Help Center
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">
                  Browse our comprehensive help articles and FAQs.
                </p>
                <Button variant="outline" className="w-full">
                  Visit Help Center
                </Button>
                <p className="text-xs text-gray-500 mt-2">
                  Self-service support resources
                </p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Frequently Asked Questions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-medium mb-1">How do I track my delivery?</h4>
                <p className="text-sm text-gray-600">
                  Use the tracking number provided when your order ships. Enter it in the tracking section above or visit the tracking page.
                </p>
              </div>
              <div>
                <h4 className="font-medium mb-1">How do I become a delivery provider?</h4>
                <p className="text-sm text-gray-600">
                  Click "Apply Now" in the Become a Provider section. You'll need to complete our verification process including background checks and document verification.
                </p>
              </div>
              <div>
                <h4 className="font-medium mb-1">What if my delivery is delayed?</h4>
                <p className="text-sm text-gray-600">
                  Contact the delivery provider directly through the tracking page or reach out to our support team for assistance.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
