import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Truck,
  Package,
  Clock,
  DollarSign,
  Star,
  MapPin,
  Camera,
  MessageCircle,
  CheckCircle,
  AlertCircle,
  Navigation,
  Phone,
  Calendar,
  TrendingUp,
  Eye,
} from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { cn } from "@/lib/utils";

interface DeliveryAssignment {
  id: string;
  orderId: string;
  orderNumber: string;
  status: string;
  pickupAddress: any;
  deliveryAddress: any;
  packageDetails: any;
  deliveryFee: number;
  estimatedDeliveryTime: string;
  actualPickupTime?: string;
  actualDeliveryTime?: string;
  trackingNumber: string;
  customerNotes?: string;
  specialInstructions?: string;
  createdAt: string;
}

interface ProviderStats {
  totalDeliveries: number;
  completedToday: number;
  totalEarnings: number;
  todayEarnings: number;
  rating: number;
  onTimeRate: number;
  activeAssignments: number;
}

const mockStats: ProviderStats = {
  totalDeliveries: 247,
  completedToday: 8,
  totalEarnings: 3420.50,
  todayEarnings: 156.75,
  rating: 4.8,
  onTimeRate: 94.2,
  activeAssignments: 3,
};

const mockAssignments: DeliveryAssignment[] = [
  {
    id: "1",
    orderId: "order-1",
    orderNumber: "SC240001",
    status: "accepted",
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
    trackingNumber: "SC240001ABC",
    customerNotes: "Please ring doorbell, leave at door if no answer",
    createdAt: "2024-01-15T10:30:00Z",
  },
  {
    id: "2",
    orderId: "order-2",
    orderNumber: "SC240002",
    status: "picked_up",
    pickupAddress: {
      name: "Fashion Boutique",
      address: "789 Style Blvd, Fashion District",
      phone: "+1-555-0789",
    },
    deliveryAddress: {
      name: "Sarah Johnson",
      address: "321 Home Street, City Center",
      phone: "+1-555-0321",
    },
    packageDetails: {
      weight: 1.2,
      dimensions: { length: 25, width: 15, height: 10 },
      value: 149.99,
      description: "Clothing - Designer Dress",
      fragile: false,
    },
    deliveryFee: 8.75,
    estimatedDeliveryTime: "2024-01-15T17:30:00Z",
    actualPickupTime: "2024-01-15T14:15:00Z",
    trackingNumber: "SC240002DEF",
    specialInstructions: "Express delivery requested",
    createdAt: "2024-01-15T13:45:00Z",
  },
];

export default function DeliveryProviderDashboard() {
  const [assignments, setAssignments] = useState<DeliveryAssignment[]>(mockAssignments);
  const [stats, setStats] = useState<ProviderStats>(mockStats);
  const [selectedAssignment, setSelectedAssignment] = useState<DeliveryAssignment | null>(null);
  const [showAssignmentDetails, setShowAssignmentDetails] = useState(false);
  const [isOnline, setIsOnline] = useState(true);
  const { toast } = useToast();

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

  const handleAcceptAssignment = async (assignmentId: string) => {
    try {
      // API call would go here
      setAssignments(prev =>
        prev.map(assignment =>
          assignment.id === assignmentId
            ? { ...assignment, status: "accepted" }
            : assignment
        )
      );
      
      toast({
        title: "Assignment Accepted",
        description: "You have successfully accepted this delivery assignment.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to accept assignment. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleUpdateStatus = async (assignmentId: string, newStatus: string) => {
    try {
      // API call would go here
      setAssignments(prev =>
        prev.map(assignment =>
          assignment.id === assignmentId
            ? { 
                ...assignment, 
                status: newStatus,
                actualPickupTime: newStatus === "picked_up" ? new Date().toISOString() : assignment.actualPickupTime,
                actualDeliveryTime: newStatus === "delivered" ? new Date().toISOString() : assignment.actualDeliveryTime,
              }
            : assignment
        )
      );
      
      toast({
        title: "Status Updated",
        description: `Delivery status updated to ${newStatus.replace('_', ' ')}.`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update status. Please try again.",
        variant: "destructive",
      });
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Delivery Dashboard</h1>
          <p className="text-gray-600">Manage your delivery assignments and track performance</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className={cn(
              "w-3 h-3 rounded-full",
              isOnline ? "bg-green-500" : "bg-red-500"
            )} />
            <span className="text-sm font-medium">
              {isOnline ? "Online" : "Offline"}
            </span>
          </div>
          <Button
            onClick={() => setIsOnline(!isOnline)}
            variant={isOnline ? "outline" : "default"}
          >
            {isOnline ? "Go Offline" : "Go Online"}
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Today's Earnings</p>
                <p className="text-2xl font-bold">{formatCurrency(stats.todayEarnings)}</p>
                <p className="text-xs text-gray-500">{stats.completedToday} deliveries</p>
              </div>
              <div className="h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center">
                <DollarSign className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Deliveries</p>
                <p className="text-2xl font-bold">{stats.activeAssignments}</p>
                <p className="text-xs text-gray-500">In progress</p>
              </div>
              <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Truck className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Rating</p>
                <div className="flex items-center gap-1">
                  <p className="text-2xl font-bold">{stats.rating}</p>
                  <Star className="h-5 w-5 text-yellow-500 fill-current" />
                </div>
                <p className="text-xs text-gray-500">{stats.totalDeliveries} total deliveries</p>
              </div>
              <div className="h-12 w-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                <Star className="h-6 w-6 text-yellow-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">On-Time Rate</p>
                <p className="text-2xl font-bold">{stats.onTimeRate}%</p>
                <p className="text-xs text-gray-500">Performance metric</p>
              </div>
              <div className="h-12 w-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <TrendingUp className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="active" className="space-y-6">
        <TabsList>
          <TabsTrigger value="active">Active Deliveries</TabsTrigger>
          <TabsTrigger value="pending">Pending Requests</TabsTrigger>
          <TabsTrigger value="completed">Completed</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="active" className="space-y-4">
          {assignments.filter(a => ["accepted", "picked_up", "in_transit"].includes(a.status)).map((assignment) => (
            <Card key={assignment.id} className="cursor-pointer hover:shadow-md transition-shadow"
              onClick={() => {
                setSelectedAssignment(assignment);
                setShowAssignmentDetails(true);
              }}
            >
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <Badge className={getStatusColor(assignment.status)}>
                      {getStatusIcon(assignment.status)}
                      <span className="ml-1 capitalize">{assignment.status.replace('_', ' ')}</span>
                    </Badge>
                    <span className="font-medium">#{assignment.orderNumber}</span>
                    <span className="text-sm text-gray-500">{assignment.trackingNumber}</span>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-green-600">{formatCurrency(assignment.deliveryFee)}</p>
                    <p className="text-xs text-gray-500">Delivery fee</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div className="flex items-start gap-2">
                      <MapPin className="h-4 w-4 text-red-500 mt-1 flex-shrink-0" />
                      <div>
                        <p className="font-medium text-sm">Pickup</p>
                        <p className="text-sm text-gray-600">{assignment.pickupAddress.name}</p>
                        <p className="text-xs text-gray-500">{assignment.pickupAddress.address}</p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-start gap-2">
                      <MapPin className="h-4 w-4 text-green-500 mt-1 flex-shrink-0" />
                      <div>
                        <p className="font-medium text-sm">Delivery</p>
                        <p className="text-sm text-gray-600">{assignment.deliveryAddress.name}</p>
                        <p className="text-xs text-gray-500">{assignment.deliveryAddress.address}</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-4 flex items-center justify-between">
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <span className="flex items-center gap-1">
                      <Package className="h-4 w-4" />
                      {assignment.packageDetails.weight}kg
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      ETA: {formatDateTime(assignment.estimatedDeliveryTime)}
                    </span>
                  </div>

                  <div className="flex gap-2">
                    {assignment.status === "accepted" && (
                      <Button
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleUpdateStatus(assignment.id, "picked_up");
                        }}
                      >
                        Mark Picked Up
                      </Button>
                    )}
                    {assignment.status === "picked_up" && (
                      <Button
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleUpdateStatus(assignment.id, "in_transit");
                        }}
                      >
                        Start Delivery
                      </Button>
                    )}
                    {assignment.status === "in_transit" && (
                      <Button
                        size="sm"
                        className="bg-green-600 hover:bg-green-700"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleUpdateStatus(assignment.id, "delivered");
                        }}
                      >
                        Mark Delivered
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="pending" className="space-y-4">
          {assignments.filter(a => a.status === "pending").map((assignment) => (
            <Card key={assignment.id}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <Badge className={getStatusColor(assignment.status)}>
                      {getStatusIcon(assignment.status)}
                      <span className="ml-1">New Request</span>
                    </Badge>
                    <span className="font-medium">#{assignment.orderNumber}</span>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-green-600">{formatCurrency(assignment.deliveryFee)}</p>
                    <p className="text-xs text-gray-500">Delivery fee</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div className="space-y-2">
                    <div className="flex items-start gap-2">
                      <MapPin className="h-4 w-4 text-red-500 mt-1 flex-shrink-0" />
                      <div>
                        <p className="font-medium text-sm">Pickup</p>
                        <p className="text-sm text-gray-600">{assignment.pickupAddress.name}</p>
                        <p className="text-xs text-gray-500">{assignment.pickupAddress.address}</p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-start gap-2">
                      <MapPin className="h-4 w-4 text-green-500 mt-1 flex-shrink-0" />
                      <div>
                        <p className="font-medium text-sm">Delivery</p>
                        <p className="text-sm text-gray-600">{assignment.deliveryAddress.name}</p>
                        <p className="text-xs text-gray-500">{assignment.deliveryAddress.address}</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <span className="flex items-center gap-1">
                      <Package className="h-4 w-4" />
                      {assignment.packageDetails.weight}kg
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      ETA: {formatDateTime(assignment.estimatedDeliveryTime)}
                    </span>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setSelectedAssignment(assignment);
                        setShowAssignmentDetails(true);
                      }}
                    >
                      <Eye className="h-4 w-4 mr-2" />
                      View Details
                    </Button>
                    <Button
                      size="sm"
                      onClick={() => handleAcceptAssignment(assignment.id)}
                    >
                      Accept Delivery
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="completed">
          <Card>
            <CardContent className="p-6">
              <p className="text-center text-gray-500">Completed deliveries will appear here</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Earnings Overview</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span>Total Earnings</span>
                    <span className="font-bold">{formatCurrency(stats.totalEarnings)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>This Week</span>
                    <span className="font-bold">{formatCurrency(stats.todayEarnings * 5)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Average per Delivery</span>
                    <span className="font-bold">{formatCurrency(stats.totalEarnings / stats.totalDeliveries)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Performance Metrics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span>Delivery Success Rate</span>
                    <span className="font-bold text-green-600">98.2%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Average Delivery Time</span>
                    <span className="font-bold">34 mins</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Customer Satisfaction</span>
                    <div className="flex items-center gap-1">
                      <span className="font-bold">{stats.rating}</span>
                      <Star className="h-4 w-4 text-yellow-500 fill-current" />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Assignment Details Dialog */}
      <Dialog open={showAssignmentDetails} onOpenChange={setShowAssignmentDetails}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Delivery Assignment Details</DialogTitle>
            <DialogDescription>
              Complete information for assignment #{selectedAssignment?.orderNumber}
            </DialogDescription>
          </DialogHeader>

          {selectedAssignment && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <Badge className={getStatusColor(selectedAssignment.status)}>
                  {getStatusIcon(selectedAssignment.status)}
                  <span className="ml-1 capitalize">{selectedAssignment.status.replace('_', ' ')}</span>
                </Badge>
                <span className="font-bold text-green-600">
                  {formatCurrency(selectedAssignment.deliveryFee)}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium mb-3 flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-red-500" />
                    Pickup Location
                  </h4>
                  <div className="space-y-2 text-sm">
                    <p className="font-medium">{selectedAssignment.pickupAddress.name}</p>
                    <p>{selectedAssignment.pickupAddress.address}</p>
                    <p className="flex items-center gap-1">
                      <Phone className="h-3 w-3" />
                      {selectedAssignment.pickupAddress.phone}
                    </p>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium mb-3 flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-green-500" />
                    Delivery Location
                  </h4>
                  <div className="space-y-2 text-sm">
                    <p className="font-medium">{selectedAssignment.deliveryAddress.name}</p>
                    <p>{selectedAssignment.deliveryAddress.address}</p>
                    <p className="flex items-center gap-1">
                      <Phone className="h-3 w-3" />
                      {selectedAssignment.deliveryAddress.phone}
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-medium mb-3 flex items-center gap-2">
                  <Package className="h-4 w-4" />
                  Package Details
                </h4>
                <div className="bg-gray-50 p-4 rounded-lg space-y-2 text-sm">
                  <p><span className="font-medium">Description:</span> {selectedAssignment.packageDetails.description}</p>
                  <p><span className="font-medium">Weight:</span> {selectedAssignment.packageDetails.weight}kg</p>
                  <p><span className="font-medium">Dimensions:</span> {selectedAssignment.packageDetails.dimensions.length} x {selectedAssignment.packageDetails.dimensions.width} x {selectedAssignment.packageDetails.dimensions.height} cm</p>
                  <p><span className="font-medium">Value:</span> {formatCurrency(selectedAssignment.packageDetails.value)}</p>
                  {selectedAssignment.packageDetails.fragile && (
                    <Badge variant="destructive" className="text-xs">Fragile</Badge>
                  )}
                </div>
              </div>

              {selectedAssignment.customerNotes && (
                <div>
                  <h4 className="font-medium mb-3 flex items-center gap-2">
                    <MessageCircle className="h-4 w-4" />
                    Customer Notes
                  </h4>
                  <p className="bg-blue-50 p-3 rounded-lg text-sm">{selectedAssignment.customerNotes}</p>
                </div>
              )}

              {selectedAssignment.specialInstructions && (
                <div>
                  <h4 className="font-medium mb-3 flex items-center gap-2">
                    <AlertCircle className="h-4 w-4" />
                    Special Instructions
                  </h4>
                  <p className="bg-yellow-50 p-3 rounded-lg text-sm">{selectedAssignment.specialInstructions}</p>
                </div>
              )}

              <div className="flex gap-2 pt-4">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => setShowAssignmentDetails(false)}
                >
                  Close
                </Button>
                {selectedAssignment.status === "pending" && (
                  <Button
                    className="flex-1"
                    onClick={() => {
                      handleAcceptAssignment(selectedAssignment.id);
                      setShowAssignmentDetails(false);
                    }}
                  >
                    Accept Delivery
                  </Button>
                )}
                {selectedAssignment.status !== "delivered" && selectedAssignment.status !== "failed" && (
                  <Button
                    className="flex-1"
                    onClick={() => {
                      // Navigate to or open maps for directions
                      toast({
                        title: "Opening Navigation",
                        description: "Opening maps app for directions...",
                      });
                    }}
                  >
                    <Navigation className="h-4 w-4 mr-2" />
                    Get Directions
                  </Button>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
