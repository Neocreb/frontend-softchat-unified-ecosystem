import React, { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  MapPin,
  Navigation,
  Phone,
  MessageCircle,
  Clock,
  Package,
  CheckCircle2,
  Truck,
  Star,
  Camera,
  FileText,
  AlertTriangle,
  RefreshCw,
  Route,
  Timer,
  User,
  Shield,
  Zap,
  Calendar,
  Copy,
  ExternalLink,
  Share2,
  Bell,
} from "lucide-react";
import { DeliveryOrder, TrackingUpdate, DispatchPartner } from "@/types/dispatch";
import { toast } from "sonner";

interface LiveDeliveryTrackingProps {
  deliveryOrder: DeliveryOrder;
  onStatusUpdate?: (status: string) => void;
  compact?: boolean;
  showMap?: boolean;
}

// Mock real-time location updates
const mockLocationUpdates = [
  { lat: 6.6018, lng: 3.3515, timestamp: Date.now() - 1800000 }, // 30 min ago
  { lat: 6.6000, lng: 3.3500, timestamp: Date.now() - 1200000 }, // 20 min ago
  { lat: 6.5980, lng: 3.3480, timestamp: Date.now() - 600000 },  // 10 min ago
  { lat: 6.5964, lng: 3.3469, timestamp: Date.now() - 60000 },   // 1 min ago
];

export const LiveDeliveryTracking: React.FC<LiveDeliveryTrackingProps> = ({
  deliveryOrder,
  onStatusUpdate,
  compact = false,
  showMap = true,
}) => {
  const [currentLocation, setCurrentLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [estimatedArrival, setEstimatedArrival] = useState<string>("15 minutes");
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [showProofOfDelivery, setShowProofOfDelivery] = useState(false);
  const [trackingHistory, setTrackingHistory] = useState<TrackingUpdate[]>([
    {
      timestamp: "2024-01-15T14:00:00Z",
      status: "Order confirmed",
      note: "Your order has been confirmed and is being prepared",
    },
    {
      timestamp: "2024-01-15T14:15:00Z",
      status: "Package ready for pickup",
      note: "Package is ready and waiting for dispatch partner",
    },
    {
      timestamp: "2024-01-15T14:30:00Z",
      status: "Assigned to dispatch partner",
      note: `${deliveryOrder.partnerId ? 'Partner assigned' : 'Looking for partner'}`,
    },
    {
      timestamp: "2024-01-15T14:45:00Z",
      status: "Pickup in progress",
      location: { lat: 6.6018, lng: 3.3515 },
      note: "Dispatch partner is heading to pickup location",
    },
    {
      timestamp: "2024-01-15T15:00:00Z",
      status: "Package picked up",
      location: { lat: 6.6018, lng: 3.3515 },
      note: "Package has been picked up and is on the way",
    },
  ]);

  // Simulate real-time location updates
  useEffect(() => {
    if (deliveryOrder.status === "delivery_in_progress") {
      const interval = setInterval(() => {
        const randomUpdate = mockLocationUpdates[Math.floor(Math.random() * mockLocationUpdates.length)];
        setCurrentLocation({ lat: randomUpdate.lat, lng: randomUpdate.lng });
        
        // Update ETA randomly
        const etas = ["8 minutes", "12 minutes", "15 minutes", "20 minutes"];
        setEstimatedArrival(etas[Math.floor(Math.random() * etas.length)]);
      }, 30000); // Update every 30 seconds

      return () => clearInterval(interval);
    }
  }, [deliveryOrder.status]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300";
      case "assigned":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300";
      case "pickup_in_progress":
        return "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300";
      case "picked_up":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300";
      case "delivery_in_progress":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300";
      case "delivered":
        return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300";
      case "cancelled":
      case "failed":
        return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300";
    }
  };

  const getProgressPercentage = () => {
    switch (deliveryOrder.status) {
      case "pending":
        return 10;
      case "assigned":
        return 25;
      case "pickup_in_progress":
        return 40;
      case "picked_up":
        return 60;
      case "delivery_in_progress":
        return 80;
      case "delivered":
        return 100;
      default:
        return 0;
    }
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success("Tracking information updated");
    } catch (error) {
      toast.error("Failed to refresh tracking");
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleCallPartner = () => {
    if (deliveryOrder.partner?.phoneNumber) {
      window.open(`tel:${deliveryOrder.partner.phoneNumber}`);
    } else {
      toast.error("Partner contact not available");
    }
  };

  const handleMessagePartner = () => {
    toast.info("Messaging feature coming soon");
  };

  const copyTrackingNumber = () => {
    navigator.clipboard.writeText(deliveryOrder.id);
    toast.success("Tracking number copied to clipboard");
  };

  const shareTracking = () => {
    if (navigator.share) {
      navigator.share({
        title: "Delivery Tracking",
        text: `Track your delivery: Order #${deliveryOrder.orderId.slice(-6)}`,
        url: window.location.href,
      });
    } else {
      copyTrackingNumber();
    }
  };

  if (compact) {
    return (
      <Card className="border-l-4 border-l-blue-500">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                <Package className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="font-medium">Order #{deliveryOrder.orderId.slice(-6)}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {deliveryOrder.status.replace('_', ' ')}
                </p>
              </div>
            </div>
            <div className="text-right">
              <Badge className={getStatusColor(deliveryOrder.status)}>
                {deliveryOrder.status.replace('_', ' ')}
              </Badge>
              {deliveryOrder.status === "delivery_in_progress" && (
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  ETA: {estimatedArrival}
                </p>
              )}
            </div>
          </div>
          
          <Progress value={getProgressPercentage()} className="mt-3" />
          
          <div className="flex gap-2 mt-3">
            <Button size="sm" variant="outline" onClick={handleRefresh} disabled={isRefreshing}>
              <RefreshCw className={`w-4 h-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
            <Dialog>
              <DialogTrigger asChild>
                <Button size="sm">View Details</Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                <LiveDeliveryTracking 
                  deliveryOrder={deliveryOrder} 
                  onStatusUpdate={onStatusUpdate}
                  compact={false}
                />
              </DialogContent>
            </Dialog>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Package className="w-6 h-6" />
                Delivery Tracking
              </CardTitle>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                Order #{deliveryOrder.orderId.slice(-6)} • {deliveryOrder.deliveryType}
              </p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={copyTrackingNumber}>
                <Copy className="w-4 h-4 mr-2" />
                Copy ID
              </Button>
              <Button variant="outline" size="sm" onClick={shareTracking}>
                <Share2 className="w-4 h-4 mr-2" />
                Share
              </Button>
              <Button variant="outline" size="sm" onClick={handleRefresh} disabled={isRefreshing}>
                <RefreshCw className={`w-4 h-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Status and Progress */}
            <div className="flex items-center justify-between">
              <Badge className={`${getStatusColor(deliveryOrder.status)} text-base px-3 py-1`}>
                {deliveryOrder.status.replace('_', ' ')}
              </Badge>
              {deliveryOrder.estimatedDeliveryTime && (
                <div className="text-right">
                  <p className="text-sm text-gray-600 dark:text-gray-400">Estimated Delivery</p>
                  <p className="font-medium">
                    {new Date(deliveryOrder.estimatedDeliveryTime).toLocaleString()}
                  </p>
                </div>
              )}
            </div>

            <Progress value={getProgressPercentage()} className="h-3" />

            {/* Live Updates */}
            {deliveryOrder.status === "delivery_in_progress" && (
              <Alert>
                <Navigation className="h-4 w-4 animate-pulse" />
                <AlertDescription>
                  <strong>Your package is on the way!</strong> ETA: {estimatedArrival}
                  {currentLocation && (
                    <span className="block text-sm mt-1">
                      Last location update: {new Date().toLocaleTimeString()}
                    </span>
                  )}
                </AlertDescription>
              </Alert>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Dispatch Partner Info */}
      {deliveryOrder.partner && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Truck className="w-5 h-5" />
              Your Delivery Partner
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4">
              <Avatar className="w-16 h-16">
                <AvatarFallback className="text-lg">
                  {deliveryOrder.partner.fullName[0]}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <h3 className="font-bold text-lg">{deliveryOrder.partner.fullName}</h3>
                <div className="flex items-center gap-2 mb-2">
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span className="font-medium">{deliveryOrder.partner.averageRating}</span>
                    <span className="text-sm text-gray-500">
                      ({deliveryOrder.partner.totalRatings} reviews)
                    </span>
                  </div>
                  <Badge variant="outline" className="text-xs">
                    {deliveryOrder.partner.vehicleType}
                  </Badge>
                </div>
                <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                  <div className="flex items-center gap-1">
                    <Package className="w-4 h-4" />
                    <span>{deliveryOrder.partner.totalDeliveries} deliveries</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Shield className="w-4 h-4" />
                    <span>Verified partner</span>
                  </div>
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <Button variant="outline" size="sm" onClick={handleCallPartner}>
                  <Phone className="w-4 h-4 mr-2" />
                  Call
                </Button>
                <Button variant="outline" size="sm" onClick={handleMessagePartner}>
                  <MessageCircle className="w-4 h-4 mr-2" />
                  Message
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Delivery Addresses */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="w-5 h-5" />
            Delivery Route
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Pickup Address */}
            <div className="flex items-start gap-3 p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
              <div className="p-2 bg-red-100 dark:bg-red-900/40 rounded-full">
                <Package className="w-4 h-4 text-red-600" />
              </div>
              <div className="flex-1">
                <p className="font-medium text-red-700 dark:text-red-400">Pickup Location</p>
                <p className="text-sm">{deliveryOrder.pickupAddress}</p>
                {deliveryOrder.pickupContactName && (
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Contact: {deliveryOrder.pickupContactName} • {deliveryOrder.pickupContactPhone}
                  </p>
                )}
              </div>
              {deliveryOrder.status === "pickup_in_progress" && (
                <div className="text-red-600">
                  <Timer className="w-5 h-5 animate-pulse" />
                </div>
              )}
            </div>

            {/* Route Indicator */}
            <div className="flex justify-center">
              <div className="flex flex-col items-center gap-2">
                <Route className="w-6 h-6 text-gray-400" />
                <div className="h-8 w-px bg-gray-300 dark:bg-gray-600"></div>
              </div>
            </div>

            {/* Delivery Address */}
            <div className="flex items-start gap-3 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <div className="p-2 bg-green-100 dark:bg-green-900/40 rounded-full">
                <Navigation className="w-4 h-4 text-green-600" />
              </div>
              <div className="flex-1">
                <p className="font-medium text-green-700 dark:text-green-400">Delivery Location</p>
                <p className="text-sm">{deliveryOrder.deliveryAddress}</p>
                {deliveryOrder.deliveryContactName && (
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Contact: {deliveryOrder.deliveryContactName} • {deliveryOrder.deliveryContactPhone}
                  </p>
                )}
                {deliveryOrder.instructions && (
                  <p className="text-sm text-blue-600 dark:text-blue-400 mt-2">
                    📝 {deliveryOrder.instructions}
                  </p>
                )}
              </div>
              {deliveryOrder.status === "delivery_in_progress" && (
                <div className="text-green-600">
                  <Navigation className="w-5 h-5 animate-pulse" />
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Package Details */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="w-5 h-5" />
            Package Information
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {deliveryOrder.packageDetails?.weight && (
              <div className="text-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <p className="font-bold">{deliveryOrder.packageDetails.weight} kg</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Weight</p>
              </div>
            )}
            {deliveryOrder.packageDetails?.value && (
              <div className="text-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <p className="font-bold">₦{deliveryOrder.packageDetails.value.toLocaleString()}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Value</p>
              </div>
            )}
            <div className="text-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <p className="font-bold">{deliveryOrder.priority}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Priority</p>
            </div>
            <div className="text-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <p className="font-bold">₦{deliveryOrder.deliveryFee.toLocaleString()}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Delivery Fee</p>
            </div>
          </div>

          {deliveryOrder.packageDetails?.description && (
            <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <p className="text-sm">
                <strong>Description:</strong> {deliveryOrder.packageDetails.description}
              </p>
              {deliveryOrder.packageDetails.fragile && (
                <div className="flex items-center gap-2 mt-2 text-orange-600">
                  <AlertTriangle className="w-4 h-4" />
                  <span className="text-sm font-medium">Handle with care - Fragile item</span>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Tracking History */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="w-5 h-5" />
            Tracking History
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {trackingHistory.map((update, index) => (
              <div key={index} className="flex gap-4">
                <div className="flex flex-col items-center">
                  <div className="w-3 h-3 bg-blue-600 rounded-full"></div>
                  {index < trackingHistory.length - 1 && (
                    <div className="w-px h-8 bg-gray-300 dark:bg-gray-600 mt-2"></div>
                  )}
                </div>
                <div className="flex-1 pb-4">
                  <div className="flex items-center justify-between mb-1">
                    <p className="font-medium">{update.status}</p>
                    <p className="text-sm text-gray-500">
                      {new Date(update.timestamp).toLocaleString()}
                    </p>
                  </div>
                  {update.note && (
                    <p className="text-sm text-gray-600 dark:text-gray-400">{update.note}</p>
                  )}
                  {update.location && (
                    <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">
                      📍 Lat: {update.location.lat}, Lng: {update.location.lng}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Proof of Delivery */}
      {deliveryOrder.status === "delivered" && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-green-600" />
              Delivery Completed
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Alert>
              <CheckCircle2 className="h-4 w-4" />
              <AlertDescription>
                Your package has been successfully delivered!
                {deliveryOrder.actualDeliveryTime && (
                  <span className="block mt-1">
                    Delivered at: {new Date(deliveryOrder.actualDeliveryTime).toLocaleString()}
                  </span>
                )}
              </AlertDescription>
            </Alert>

            {(deliveryOrder.deliveryPhotos?.length || deliveryOrder.customerSignature) && (
              <div className="mt-4">
                <Button
                  variant="outline"
                  onClick={() => setShowProofOfDelivery(true)}
                  className="w-full"
                >
                  <Camera className="w-4 h-4 mr-2" />
                  View Proof of Delivery
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Proof of Delivery Dialog */}
      <Dialog open={showProofOfDelivery} onOpenChange={setShowProofOfDelivery}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Proof of Delivery</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            {deliveryOrder.deliveryPhotos?.map((photo, index) => (
              <div key={index} className="border rounded-lg overflow-hidden">
                <img 
                  src={photo} 
                  alt={`Delivery proof ${index + 1}`}
                  className="w-full h-48 object-cover"
                />
              </div>
            ))}
            
            {deliveryOrder.customerSignature && (
              <div className="border rounded-lg p-4">
                <p className="text-sm font-medium mb-2">Digital Signature</p>
                <div className="bg-gray-100 dark:bg-gray-800 rounded p-4 text-center">
                  <FileText className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                  <p className="text-sm text-gray-600">Signature on file</p>
                </div>
              </div>
            )}

            {deliveryOrder.deliveryConfirmationCode && (
              <div className="text-center p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <p className="text-sm text-gray-600 dark:text-gray-400">Confirmation Code</p>
                <p className="font-mono font-bold text-lg">{deliveryOrder.deliveryConfirmationCode}</p>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default LiveDeliveryTracking;
