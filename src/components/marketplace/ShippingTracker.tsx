import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Truck,
  Package,
  MapPin,
  Clock,
  CheckCircle,
  AlertCircle,
  Plane,
  Ship,
  Home,
  Search,
  RefreshCw,
  Bell,
  ExternalLink,
  Navigation,
} from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { cn } from "@/lib/utils";

interface ShippingTrackingData {
  id: string;
  orderId: string;
  trackingNumber: string;
  carrier: string;
  service: string;
  status:
    | "pending"
    | "picked_up"
    | "in_transit"
    | "out_for_delivery"
    | "delivered"
    | "failed"
    | "returned";
  estimatedDelivery: string;
  actualDelivery?: string;
  origin: Location;
  destination: Location;
  currentLocation?: Location;
  events: TrackingEvent[];
  weight: number;
  dimensions: string;
  recipient: {
    name: string;
    phone?: string;
    email?: string;
  };
}

interface Location {
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
}

interface TrackingEvent {
  id: string;
  timestamp: string;
  status: string;
  description: string;
  location: Location;
  facility?: string;
}

interface ShippingTrackerProps {
  orderId?: string;
  trackingNumber?: string;
  showSearch?: boolean;
}

const ShippingTracker = ({
  orderId,
  trackingNumber: initialTrackingNumber,
  showSearch = true,
}: ShippingTrackerProps) => {
  const [trackingData, setTrackingData] = useState<ShippingTrackingData[]>([]);
  const [loading, setLoading] = useState(false);
  const [trackingNumber, setTrackingNumber] = useState(
    initialTrackingNumber || "",
  );
  const [selectedShipment, setSelectedShipment] =
    useState<ShippingTrackingData | null>(null);
  const [realTimeEnabled, setRealTimeEnabled] = useState(true);

  const { toast } = useToast();

  // Mock tracking data
  const mockTrackingData: ShippingTrackingData[] = [
    {
      id: "ship_1",
      orderId: "order_123",
      trackingNumber: "1Z999AA1234567890",
      carrier: "UPS",
      service: "UPS Ground",
      status: "in_transit",
      estimatedDelivery: "2024-01-25T17:00:00Z",
      origin: {
        address: "123 Warehouse St",
        city: "Los Angeles",
        state: "CA",
        zipCode: "90210",
        country: "USA",
      },
      destination: {
        address: "456 Customer Ave",
        city: "New York",
        state: "NY",
        zipCode: "10001",
        country: "USA",
      },
      currentLocation: {
        address: "UPS Facility",
        city: "Denver",
        state: "CO",
        zipCode: "80202",
        country: "USA",
      },
      weight: 2.5,
      dimensions: "12x8x4 inches",
      recipient: {
        name: "John Doe",
        phone: "+1-555-123-4567",
        email: "john.doe@example.com",
      },
      events: [
        {
          id: "event_1",
          timestamp: "2024-01-24T14:30:00Z",
          status: "In Transit",
          description: "Package is in transit to the next facility",
          location: {
            address: "UPS Facility",
            city: "Denver",
            state: "CO",
            zipCode: "80202",
            country: "USA",
          },
          facility: "Denver Distribution Center",
        },
        {
          id: "event_2",
          timestamp: "2024-01-24T08:15:00Z",
          status: "Departed Facility",
          description: "Package has departed from the facility",
          location: {
            address: "UPS Facility",
            city: "Las Vegas",
            state: "NV",
            zipCode: "89101",
            country: "USA",
          },
          facility: "Las Vegas Processing Center",
        },
        {
          id: "event_3",
          timestamp: "2024-01-23T16:45:00Z",
          status: "Arrived at Facility",
          description: "Package has arrived at the processing facility",
          location: {
            address: "UPS Facility",
            city: "Las Vegas",
            state: "NV",
            zipCode: "89101",
            country: "USA",
          },
          facility: "Las Vegas Processing Center",
        },
        {
          id: "event_4",
          timestamp: "2024-01-23T10:30:00Z",
          status: "Picked Up",
          description: "Package has been picked up by the carrier",
          location: {
            address: "123 Warehouse St",
            city: "Los Angeles",
            state: "CA",
            zipCode: "90210",
            country: "USA",
          },
          facility: "Origin Warehouse",
        },
      ],
    },
    {
      id: "ship_2",
      orderId: "order_456",
      trackingNumber: "9400109699937859123456",
      carrier: "USPS",
      service: "Priority Mail Express",
      status: "delivered",
      estimatedDelivery: "2024-01-23T12:00:00Z",
      actualDelivery: "2024-01-23T11:45:00Z",
      origin: {
        address: "456 Sender Blvd",
        city: "Chicago",
        state: "IL",
        zipCode: "60601",
        country: "USA",
      },
      destination: {
        address: "789 Recipient Lane",
        city: "Miami",
        state: "FL",
        zipCode: "33101",
        country: "USA",
      },
      weight: 1.2,
      dimensions: "8x6x2 inches",
      recipient: {
        name: "Jane Smith",
        email: "jane.smith@example.com",
      },
      events: [
        {
          id: "event_5",
          timestamp: "2024-01-23T11:45:00Z",
          status: "Delivered",
          description: "Package delivered to recipient",
          location: {
            address: "789 Recipient Lane",
            city: "Miami",
            state: "FL",
            zipCode: "33101",
            country: "USA",
          },
        },
        {
          id: "event_6",
          timestamp: "2024-01-23T09:30:00Z",
          status: "Out for Delivery",
          description: "Package is out for delivery",
          location: {
            address: "USPS Miami",
            city: "Miami",
            state: "FL",
            zipCode: "33101",
            country: "USA",
          },
          facility: "Miami Post Office",
        },
      ],
    },
  ];

  useEffect(() => {
    if (orderId || initialTrackingNumber) {
      handleTrackShipment(initialTrackingNumber || "");
    }
  }, [orderId, initialTrackingNumber]);

  useEffect(() => {
    // Simulate real-time updates
    if (realTimeEnabled) {
      const interval = setInterval(() => {
        setTrackingData((prev) =>
          prev.map((shipment) => {
            if (shipment.status === "in_transit" && Math.random() < 0.1) {
              // Simulate location updates
              return {
                ...shipment,
                events: [
                  {
                    id: `event_${Date.now()}`,
                    timestamp: new Date().toISOString(),
                    status: "Location Update",
                    description: "Package location updated",
                    location: shipment.currentLocation || shipment.origin,
                  },
                  ...shipment.events,
                ],
              };
            }
            return shipment;
          }),
        );
      }, 30000); // Update every 30 seconds

      return () => clearInterval(interval);
    }
  }, [realTimeEnabled]);

  const handleTrackShipment = async (trackingNum?: string) => {
    const numberToTrack = trackingNum || trackingNumber;
    if (!numberToTrack) {
      toast({
        title: "Missing tracking number",
        description: "Please enter a tracking number",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // Find matching shipment or return mock data
    const foundShipment = mockTrackingData.find(
      (shipment) => shipment.trackingNumber === numberToTrack,
    );

    if (foundShipment) {
      setTrackingData([foundShipment]);
      setSelectedShipment(foundShipment);
    } else {
      setTrackingData(mockTrackingData);
    }

    setLoading(false);

    toast({
      title: "Tracking information loaded",
      description: `Found ${foundShipment ? 1 : mockTrackingData.length} shipment(s)`,
    });
  };

  const getStatusColor = (status: ShippingTrackingData["status"]) => {
    switch (status) {
      case "delivered":
        return "bg-green-100 text-green-800";
      case "out_for_delivery":
        return "bg-blue-100 text-blue-800";
      case "in_transit":
        return "bg-yellow-100 text-yellow-800";
      case "picked_up":
        return "bg-purple-100 text-purple-800";
      case "failed":
      case "returned":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status: ShippingTrackingData["status"]) => {
    switch (status) {
      case "delivered":
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case "out_for_delivery":
        return <Truck className="w-4 h-4 text-blue-600" />;
      case "in_transit":
        return <Navigation className="w-4 h-4 text-yellow-600" />;
      case "picked_up":
        return <Package className="w-4 h-4 text-purple-600" />;
      case "failed":
      case "returned":
        return <AlertCircle className="w-4 h-4 text-red-600" />;
      default:
        return <Clock className="w-4 h-4 text-gray-600" />;
    }
  };

  const getCarrierIcon = (carrier: string) => {
    switch (carrier.toLowerCase()) {
      case "ups":
        return "🚚";
      case "fedex":
        return "✈️";
      case "usps":
        return "📬";
      case "dhl":
        return "🚛";
      default:
        return "📦";
    }
  };

  const getProgressPercentage = (shipment: ShippingTrackingData) => {
    const statusOrder = [
      "pending",
      "picked_up",
      "in_transit",
      "out_for_delivery",
      "delivered",
    ];
    const currentIndex = statusOrder.indexOf(shipment.status);
    return ((currentIndex + 1) / statusOrder.length) * 100;
  };

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Shipping Tracker</h2>
          <p className="text-muted-foreground">
            Real-time package tracking and delivery updates
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button
            variant={realTimeEnabled ? "default" : "outline"}
            onClick={() => setRealTimeEnabled(!realTimeEnabled)}
          >
            <Bell className="w-4 h-4 mr-2" />
            Live Updates {realTimeEnabled ? "ON" : "OFF"}
          </Button>
        </div>
      </div>

      {/* Search */}
      {showSearch && (
        <Card>
          <CardContent className="p-6">
            <div className="flex gap-3">
              <div className="flex-1">
                <Input
                  placeholder="Enter tracking number (e.g., 1Z999AA1234567890)"
                  value={trackingNumber}
                  onChange={(e) => setTrackingNumber(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleTrackShipment()}
                />
              </div>
              <Button onClick={() => handleTrackShipment()} disabled={loading}>
                {loading ? (
                  <RefreshCw className="w-4 h-4 animate-spin" />
                ) : (
                  <Search className="w-4 h-4" />
                )}
                Track Package
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Tracking Results */}
      {trackingData.length > 0 && (
        <div className="space-y-4">
          {trackingData.map((shipment) => (
            <Card key={shipment.id} className="overflow-hidden">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">
                      {getCarrierIcon(shipment.carrier)}
                    </span>
                    <div>
                      <CardTitle className="text-lg">
                        {shipment.carrier} - {shipment.service}
                      </CardTitle>
                      <p className="text-sm text-muted-foreground">
                        Tracking #{shipment.trackingNumber}
                      </p>
                    </div>
                  </div>
                  <Badge className={getStatusColor(shipment.status)}>
                    {getStatusIcon(shipment.status)}
                    <span className="ml-1 capitalize">
                      {shipment.status.replace("_", " ")}
                    </span>
                  </Badge>
                </div>
              </CardHeader>

              <CardContent className="space-y-6">
                {/* Progress Bar */}
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Delivery Progress</span>
                    <span>{Math.round(getProgressPercentage(shipment))}%</span>
                  </div>
                  <Progress
                    value={getProgressPercentage(shipment)}
                    className="h-2"
                  />
                </div>

                {/* Delivery Info */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      Estimated Delivery
                    </p>
                    <p className="font-semibold">
                      {formatDateTime(shipment.estimatedDelivery)}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      Current Location
                    </p>
                    <p className="font-semibold">
                      {shipment.currentLocation
                        ? `${shipment.currentLocation.city}, ${shipment.currentLocation.state}`
                        : "In Transit"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      Recipient
                    </p>
                    <p className="font-semibold">{shipment.recipient.name}</p>
                  </div>
                </div>

                {/* Route */}
                <div className="flex items-center gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-green-600" />
                    <span>
                      {shipment.origin.city}, {shipment.origin.state}
                    </span>
                  </div>
                  <div className="flex-1 border-t border-dashed" />
                  {shipment.currentLocation && (
                    <>
                      <div className="flex items-center gap-2">
                        <Truck className="w-4 h-4 text-blue-600" />
                        <span>
                          {shipment.currentLocation.city},{" "}
                          {shipment.currentLocation.state}
                        </span>
                      </div>
                      <div className="flex-1 border-t border-dashed" />
                    </>
                  )}
                  <div className="flex items-center gap-2">
                    <Home className="w-4 h-4 text-red-600" />
                    <span>
                      {shipment.destination.city}, {shipment.destination.state}
                    </span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-3">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button
                        variant="outline"
                        onClick={() => setSelectedShipment(shipment)}
                      >
                        View Details
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-2xl max-h-[80vh] overflow-y-auto">
                      <DialogHeader>
                        <DialogTitle>Shipping Details</DialogTitle>
                        <DialogDescription>
                          Complete tracking information for{" "}
                          {shipment.trackingNumber}
                        </DialogDescription>
                      </DialogHeader>

                      {selectedShipment && (
                        <div className="space-y-6">
                          {/* Package Details */}
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <label className="text-sm font-medium text-muted-foreground">
                                Weight
                              </label>
                              <p className="font-semibold">
                                {selectedShipment.weight} lbs
                              </p>
                            </div>
                            <div>
                              <label className="text-sm font-medium text-muted-foreground">
                                Dimensions
                              </label>
                              <p className="font-semibold">
                                {selectedShipment.dimensions}
                              </p>
                            </div>
                            <div>
                              <label className="text-sm font-medium text-muted-foreground">
                                Service
                              </label>
                              <p className="font-semibold">
                                {selectedShipment.carrier}{" "}
                                {selectedShipment.service}
                              </p>
                            </div>
                            <div>
                              <label className="text-sm font-medium text-muted-foreground">
                                Order ID
                              </label>
                              <p className="font-semibold">
                                #{selectedShipment.orderId}
                              </p>
                            </div>
                          </div>

                          {/* Addresses */}
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <h4 className="font-medium">From</h4>
                              <div className="p-3 border rounded-lg bg-muted/20">
                                <p className="text-sm">
                                  {selectedShipment.origin.address}
                                </p>
                                <p className="text-sm">
                                  {selectedShipment.origin.city},{" "}
                                  {selectedShipment.origin.state}{" "}
                                  {selectedShipment.origin.zipCode}
                                </p>
                                <p className="text-sm">
                                  {selectedShipment.origin.country}
                                </p>
                              </div>
                            </div>
                            <div className="space-y-2">
                              <h4 className="font-medium">To</h4>
                              <div className="p-3 border rounded-lg bg-muted/20">
                                <p className="text-sm font-medium">
                                  {selectedShipment.recipient.name}
                                </p>
                                <p className="text-sm">
                                  {selectedShipment.destination.address}
                                </p>
                                <p className="text-sm">
                                  {selectedShipment.destination.city},{" "}
                                  {selectedShipment.destination.state}{" "}
                                  {selectedShipment.destination.zipCode}
                                </p>
                                <p className="text-sm">
                                  {selectedShipment.destination.country}
                                </p>
                              </div>
                            </div>
                          </div>

                          {/* Tracking Events */}
                          <div>
                            <h4 className="font-medium mb-3">
                              Tracking History
                            </h4>
                            <div className="space-y-3">
                              {selectedShipment.events.map((event, index) => (
                                <div key={event.id} className="flex gap-4">
                                  <div className="flex flex-col items-center">
                                    <div
                                      className={cn(
                                        "w-3 h-3 rounded-full border-2",
                                        index === 0
                                          ? "bg-primary border-primary"
                                          : "bg-muted border-muted",
                                      )}
                                    />
                                    {index <
                                      selectedShipment.events.length - 1 && (
                                      <div className="w-px h-8 bg-muted mt-2" />
                                    )}
                                  </div>
                                  <div className="flex-1 pb-6">
                                    <div className="flex items-center gap-2 mb-1">
                                      <span className="font-medium text-sm">
                                        {event.status}
                                      </span>
                                      <span className="text-xs text-muted-foreground">
                                        {formatDateTime(event.timestamp)}
                                      </span>
                                    </div>
                                    <p className="text-sm text-muted-foreground mb-1">
                                      {event.description}
                                    </p>
                                    <p className="text-xs text-muted-foreground">
                                      {event.location.city},{" "}
                                      {event.location.state}
                                      {event.facility && ` - ${event.facility}`}
                                    </p>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      )}
                    </DialogContent>
                  </Dialog>

                  <Button variant="outline">
                    <ExternalLink className="w-4 h-4 mr-2" />
                    Carrier Site
                  </Button>

                  <Button variant="outline">
                    <Bell className="w-4 h-4 mr-2" />
                    Set Alerts
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Empty State */}
      {trackingData.length === 0 && !loading && (
        <Card>
          <CardContent className="p-12 text-center">
            <Package className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-lg font-semibold mb-2">
              No tracking information
            </h3>
            <p className="text-muted-foreground mb-4">
              Enter a tracking number above to get real-time shipping updates
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ShippingTracker;
