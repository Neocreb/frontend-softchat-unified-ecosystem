import React, { useState, useEffect, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Truck,
  Package,
  Clock,
  MapPin,
  Star,
  DollarSign,
  Zap,
  Calendar,
  Shield,
  Info,
  CheckCircle2,
  AlertTriangle,
  Navigation,
  Phone,
  MessageCircle,
  Timer,
  Route,
  UserCheck,
} from "lucide-react";
import { DispatchPartner, DeliveryRequest, PartnerMatchingCriteria } from "@/types/dispatch";
import { toast } from "sonner";

interface DeliveryOption {
  id: string;
  type: "standard" | "express" | "scheduled" | "dispatch_partner";
  name: string;
  description: string;
  estimatedTime: string;
  cost: number;
  icon: React.ComponentType<{ className?: string }>;
  features: string[];
  partnerId?: string;
  partner?: DispatchPartner;
}

interface DeliveryMethodSelectorProps {
  orderDetails: {
    items: any[];
    totalValue: number;
    weight: number;
    dimensions?: { length: number; width: number; height: number };
    pickupAddress: string;
    deliveryAddress: string;
    deliveryLocation?: { lat: number; lng: number };
    fragile?: boolean;
  };
  onMethodSelected: (method: DeliveryOption, scheduledTime?: string, instructions?: string) => void;
  selectedMethod?: DeliveryOption;
}

// Mock data for available partners
const mockAvailablePartners: DispatchPartner[] = [
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
    currentLocation: { lat: 6.6018, lng: 3.3515 },
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
    currentLocation: { lat: 6.4281, lng: 3.4219 },
    createdAt: "2024-01-12T09:15:00Z",
    updatedAt: "2024-01-15T18:30:00Z",
  },
];

export const DeliveryMethodSelector: React.FC<DeliveryMethodSelectorProps> = ({
  orderDetails,
  onMethodSelected,
  selectedMethod,
}) => {
  const [selectedOption, setSelectedOption] = useState<string>(selectedMethod?.id || "");
  const [scheduledDate, setScheduledDate] = useState("");
  const [scheduledTime, setScheduledTime] = useState("");
  const [deliveryInstructions, setDeliveryInstructions] = useState("");
  const [availablePartners, setAvailablePartners] = useState<DispatchPartner[]>([]);
  const [isLoadingPartners, setIsLoadingPartners] = useState(false);
  const [showPartnerDetails, setShowPartnerDetails] = useState(false);
  const [selectedPartner, setSelectedPartner] = useState<DispatchPartner | null>(null);

  // Calculate delivery cost based on distance and type
  const calculateDeliveryCost = useCallback((type: string, baseDistance = 10) => {
    const baseCost = 500; // Base delivery cost
    const distanceCost = baseDistance * 50; // Cost per km
    
    switch (type) {
      case "express":
        return Math.round((baseCost + distanceCost) * 2);
      case "dispatch_partner":
        return Math.round((baseCost + distanceCost) * 1.5);
      case "scheduled":
        return Math.round((baseCost + distanceCost) * 0.8);
      default:
        return Math.round(baseCost + distanceCost);
    }
  }, []);

  // Find available partners based on location and requirements
  const findAvailablePartners = useCallback(async () => {
    setIsLoadingPartners(true);
    try {
      // Simulate API call to find nearby partners
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Filter partners based on criteria
      const criteria: PartnerMatchingCriteria = {
        location: orderDetails.deliveryLocation || { lat: 6.5244, lng: 3.3792 },
        deliveryType: orderDetails.fragile ? "fragile" : "package",
        maxDistance: 20,
        priority: "standard",
        requiredRating: 4.0,
      };
      
      const filtered = mockAvailablePartners.filter(partner => 
        partner.isActive && 
        partner.isOnline && 
        partner.averageRating >= (criteria.requiredRating || 4.0)
      );
      
      setAvailablePartners(filtered);
    } catch (error) {
      console.error("Error finding partners:", error);
      toast.error("Failed to find available partners");
    } finally {
      setIsLoadingPartners(false);
    }
  }, [orderDetails]);

  useEffect(() => {
    findAvailablePartners();
  }, [findAvailablePartners]);

  const deliveryOptions: DeliveryOption[] = [
    {
      id: "standard",
      type: "standard",
      name: "Standard Delivery",
      description: "Regular delivery within 2-3 business days",
      estimatedTime: "2-3 business days",
      cost: calculateDeliveryCost("standard"),
      icon: Package,
      features: ["Free for orders over ₦10,000", "Tracking included", "Insurance covered"],
    },
    {
      id: "express",
      type: "express",
      name: "Express Delivery",
      description: "Same-day delivery within 4-6 hours",
      estimatedTime: "4-6 hours",
      cost: calculateDeliveryCost("express"),
      icon: Zap,
      features: ["Same-day delivery", "Priority handling", "Real-time tracking", "SMS updates"],
    },
    {
      id: "scheduled",
      type: "scheduled",
      name: "Scheduled Delivery",
      description: "Choose your preferred delivery date and time",
      estimatedTime: "Choose date & time",
      cost: calculateDeliveryCost("scheduled"),
      icon: Calendar,
      features: ["Pick your time slot", "Discounted rate", "Flexible scheduling"],
    },
    ...availablePartners.map(partner => ({
      id: `partner_${partner.id}`,
      type: "dispatch_partner" as const,
      name: `${partner.fullName} Delivery`,
      description: `Personal delivery by verified partner • ${partner.vehicleType}`,
      estimatedTime: "30-60 minutes",
      cost: calculateDeliveryCost("dispatch_partner"),
      icon: Truck,
      features: ["Real-time tracking", "Direct communication", "Verified partner", "Fast delivery"],
      partnerId: partner.id,
      partner,
    })),
  ];

  const handleMethodSelect = (optionId: string) => {
    setSelectedOption(optionId);
    const method = deliveryOptions.find(option => option.id === optionId);
    if (method) {
      if (method.type === "scheduled") {
        // Don't trigger selection until date/time is chosen
        return;
      }
      onMethodSelected(method, undefined, deliveryInstructions);
    }
  };

  const handleScheduledDelivery = () => {
    if (!scheduledDate || !scheduledTime) {
      toast.error("Please select both date and time for scheduled delivery");
      return;
    }
    
    const method = deliveryOptions.find(option => option.id === "scheduled");
    if (method) {
      const scheduledDateTime = `${scheduledDate}T${scheduledTime}`;
      onMethodSelected(method, scheduledDateTime, deliveryInstructions);
    }
  };

  const DeliveryOptionCard: React.FC<{ option: DeliveryOption }> = ({ option }) => (
    <div
      className={`border rounded-lg p-4 cursor-pointer transition-all hover:shadow-md ${
        selectedOption === option.id
          ? "border-primary bg-primary/5"
          : "border-gray-200 dark:border-gray-700 hover:border-primary/50"
      }`}
      onClick={() => handleMethodSelect(option.id)}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-lg ${
            selectedOption === option.id 
              ? "bg-primary/20" 
              : "bg-gray-100 dark:bg-gray-800"
          }`}>
            <option.icon className={`w-5 h-5 ${
              selectedOption === option.id ? "text-primary" : "text-gray-600"
            }`} />
          </div>
          <div>
            <h3 className="font-medium text-gray-900 dark:text-white">{option.name}</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">{option.description}</p>
          </div>
        </div>
        <div className="text-right">
          <p className="font-bold text-lg text-gray-900 dark:text-white">
            ₦{option.cost.toLocaleString()}
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400">{option.estimatedTime}</p>
        </div>
      </div>

      {option.partner && (
        <div className="flex items-center gap-3 mb-3 p-2 bg-gray-50 dark:bg-gray-800/50 rounded">
          <Avatar className="w-8 h-8">
            <AvatarFallback>{option.partner.fullName[0]}</AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <p className="font-medium text-sm">{option.partner.fullName}</p>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1">
                <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                <span className="text-xs">{option.partner.averageRating}</span>
              </div>
              <span className="text-xs text-gray-500">•</span>
              <span className="text-xs text-gray-500">{option.partner.totalDeliveries} deliveries</span>
              <span className="text-xs text-gray-500">•</span>
              <span className="text-xs text-green-600">Online</span>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              setSelectedPartner(option.partner!);
              setShowPartnerDetails(true);
            }}
          >
            <Info className="w-4 h-4" />
          </Button>
        </div>
      )}

      <div className="flex flex-wrap gap-2">
        {option.features.map((feature, index) => (
          <Badge key={index} variant="secondary" className="text-xs">
            {feature}
          </Badge>
        ))}
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Truck className="w-5 h-5" />
            Choose Delivery Method
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <RadioGroup value={selectedOption} onValueChange={setSelectedOption}>
              {deliveryOptions.map((option) => (
                <div key={option.id} className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem 
                      value={option.id} 
                      id={option.id}
                      onClick={() => handleMethodSelect(option.id)}
                    />
                    <Label htmlFor={option.id} className="sr-only">
                      {option.name}
                    </Label>
                  </div>
                  <DeliveryOptionCard option={option} />
                </div>
              ))}
            </RadioGroup>

            {/* Partner Loading State */}
            {isLoadingPartners && (
              <div className="flex items-center justify-center p-4 border border-dashed border-gray-300 rounded-lg">
                <div className="flex items-center gap-2 text-gray-600">
                  <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                  <span>Finding available delivery partners...</span>
                </div>
              </div>
            )}

            {/* No Partners Available */}
            {!isLoadingPartners && availablePartners.length === 0 && (
              <Alert>
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  No dispatch partners are currently available in your area. Please try standard or express delivery.
                </AlertDescription>
              </Alert>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Scheduled Delivery Options */}
      {selectedOption === "scheduled" && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              Schedule Your Delivery
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="scheduledDate">Delivery Date</Label>
                <Input
                  id="scheduledDate"
                  type="date"
                  value={scheduledDate}
                  onChange={(e) => setScheduledDate(e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                />
              </div>
              <div>
                <Label htmlFor="scheduledTime">Delivery Time</Label>
                <Select value={scheduledTime} onValueChange={setScheduledTime}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select time slot" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="09:00">9:00 AM - 12:00 PM</SelectItem>
                    <SelectItem value="13:00">1:00 PM - 4:00 PM</SelectItem>
                    <SelectItem value="17:00">5:00 PM - 8:00 PM</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <Button 
              onClick={handleScheduledDelivery}
              disabled={!scheduledDate || !scheduledTime}
              className="w-full"
            >
              Confirm Scheduled Delivery
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Delivery Instructions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageCircle className="w-5 h-5" />
            Delivery Instructions (Optional)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Textarea
            placeholder="Add any special instructions for the delivery (e.g., gate code, apartment number, preferred drop-off location)"
            value={deliveryInstructions}
            onChange={(e) => setDeliveryInstructions(e.target.value)}
            className="min-h-20"
          />
        </CardContent>
      </Card>

      {/* Order Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Delivery Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">Items ({orderDetails.items.length})</span>
              <span className="font-medium">₦{orderDetails.totalValue.toLocaleString()}</span>
            </div>
            {selectedOption && (
              <>
                <div className="flex justify-between">
                  <span className="text-gray-600">Delivery Fee</span>
                  <span className="font-medium">
                    ₦{deliveryOptions.find(o => o.id === selectedOption)?.cost.toLocaleString()}
                  </span>
                </div>
                <div className="border-t pt-3 flex justify-between text-lg font-bold">
                  <span>Total</span>
                  <span>
                    ₦{(orderDetails.totalValue + (deliveryOptions.find(o => o.id === selectedOption)?.cost || 0)).toLocaleString()}
                  </span>
                </div>
              </>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Partner Details Dialog */}
      <Dialog open={showPartnerDetails} onOpenChange={setShowPartnerDetails}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Partner Details</DialogTitle>
          </DialogHeader>
          
          {selectedPartner && (
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <Avatar className="w-16 h-16">
                  <AvatarFallback className="text-lg">{selectedPartner.fullName[0]}</AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-bold text-lg">{selectedPartner.fullName}</h3>
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      <span className="font-medium">{selectedPartner.averageRating}</span>
                      <span className="text-sm text-gray-500">({selectedPartner.totalRatings} reviews)</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    <UserCheck className="w-4 h-4 text-green-500" />
                    <span className="text-sm text-green-600">Verified Partner</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div className="text-center">
                  <p className="font-bold text-lg">{selectedPartner.totalDeliveries}</p>
                  <p className="text-sm text-gray-600">Total Deliveries</p>
                </div>
                <div className="text-center">
                  <p className="font-bold text-lg">{selectedPartner.onTimeDeliveryRate}%</p>
                  <p className="text-sm text-gray-600">On-Time Rate</p>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Truck className="w-4 h-4 text-gray-500" />
                  <span className="text-sm">Vehicle: {selectedPartner.vehicleType}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-gray-500" />
                  <span className="text-sm">Location: {selectedPartner.city}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Shield className="w-4 h-4 text-gray-500" />
                  <span className="text-sm">Verification: {selectedPartner.verificationLevel}</span>
                </div>
              </div>

              <div className="flex gap-2">
                <Button variant="outline" className="flex-1">
                  <Phone className="w-4 h-4 mr-2" />
                  Call
                </Button>
                <Button variant="outline" className="flex-1">
                  <MessageCircle className="w-4 h-4 mr-2" />
                  Message
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default DeliveryMethodSelector;
