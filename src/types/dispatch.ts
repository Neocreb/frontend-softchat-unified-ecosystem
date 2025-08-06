export interface DispatchPartner {
  id: string;
  userId: string;
  
  // Application Info
  applicationStatus: "pending" | "approved" | "rejected" | "suspended";
  applicationDate: string;
  approvalDate?: string;
  rejectionReason?: string;
  
  // Personal Information
  fullName: string;
  phoneNumber: string;
  dateOfBirth?: string;
  idNumber?: string;
  idDocumentUrl?: string;
  
  // Address Information
  address: string;
  city: string;
  state: string;
  postalCode?: string;
  country: string;
  location?: { lat: number; lng: number };
  
  // Vehicle Information
  vehicleType: VehicleType;
  vehicleModel?: string;
  vehicleYear?: number;
  licensePlate?: string;
  vehiclePhotos?: string[];
  
  // Documentation
  driverLicenseNumber?: string;
  driverLicenseUrl?: string;
  insuranceNumber?: string;
  insuranceUrl?: string;
  backgroundCheckStatus?: "pending" | "approved" | "rejected";
  backgroundCheckDate?: string;
  
  // Service Information
  serviceAreas?: ServiceArea[];
  deliveryTypes?: DeliveryType[];
  workingHours?: WorkingHours[];
  maxDeliveryDistance?: number;
  
  // Status & Availability
  isActive: boolean;
  isOnline: boolean;
  currentLocation?: { lat: number; lng: number };
  lastLocationUpdate?: string;
  
  // Performance Metrics
  totalDeliveries: number;
  completedDeliveries: number;
  cancelledDeliveries: number;
  averageRating: number;
  totalRatings: number;
  onTimeDeliveryRate: number;
  
  // Financial Information
  totalEarnings: number;
  pendingPayouts: number;
  commissionRate: number;
  preferredPaymentMethod?: string;
  bankAccountDetails?: BankAccountDetails;
  
  // Verification & Compliance
  isVerified: boolean;
  verificationLevel: "basic" | "standard" | "premium";
  complianceScore: number;
  lastComplianceCheck?: string;
  
  // Additional Information
  bio?: string;
  languages?: string[];
  specializations?: string[];
  emergencyContact?: EmergencyContact;
  
  // Timestamps
  createdAt: string;
  updatedAt: string;
}

export interface DeliveryOrder {
  id: string;
  orderId: string;
  partnerId?: string;
  customerId: string;
  sellerId: string;
  
  // Delivery Information
  deliveryType: DeliveryType;
  priority: "express" | "standard" | "scheduled";
  instructions?: string;
  
  // Pickup Information
  pickupAddress: string;
  pickupLocation?: { lat: number; lng: number };
  pickupContactName?: string;
  pickupContactPhone?: string;
  pickupWindowStart?: string;
  pickupWindowEnd?: string;
  actualPickupTime?: string;
  
  // Delivery Information
  deliveryAddress: string;
  deliveryLocation?: { lat: number; lng: number };
  deliveryContactName?: string;
  deliveryContactPhone?: string;
  deliveryWindowStart?: string;
  deliveryWindowEnd?: string;
  actualDeliveryTime?: string;
  
  // Package Information
  packageDetails?: PackageDetails;
  
  // Status & Tracking
  status: DeliveryStatus;
  estimatedDeliveryTime?: string;
  trackingUpdates?: TrackingUpdate[];
  
  // Financial Information
  deliveryFee: number;
  partnerEarnings?: number;
  platformCommission?: number;
  tips?: number;
  
  // Quality & Feedback
  customerRating?: number;
  customerFeedback?: string;
  partnerRating?: number;
  partnerFeedback?: string;
  issuesReported?: DeliveryIssue[];
  
  // Proof of Delivery
  deliveryPhotos?: string[];
  customerSignature?: string;
  deliveryConfirmationCode?: string;
  
  // Timestamps
  createdAt: string;
  updatedAt: string;
}

export interface PartnerAvailability {
  id: string;
  partnerId: string;
  date: string;
  isAvailable: boolean;
  startTime?: string;
  endTime?: string;
  maxDeliveries?: number;
  currentDeliveries: number;
  breakPeriods?: BreakPeriod[];
  createdAt: string;
  updatedAt: string;
}

export interface PartnerEarnings {
  id: string;
  partnerId: string;
  deliveryOrderId?: string;
  
  // Earnings Breakdown
  baseEarnings: number;
  distanceBonus: number;
  timeBonus: number;
  priorityBonus: number;
  performanceBonus: number;
  tips: number;
  totalEarnings: number;
  
  // Deductions
  platformCommission: number;
  fuelDeduction: number;
  otherDeductions: number;
  netEarnings: number;
  
  // Payment Information
  paymentStatus: "pending" | "paid" | "failed";
  paymentDate?: string;
  paymentMethod?: string;
  paymentReference?: string;
  
  // Period Information
  earningsDate: string;
  payoutPeriod?: "daily" | "weekly" | "monthly";
  
  createdAt: string;
  updatedAt: string;
}

// Supporting Types
export type VehicleType = "motorcycle" | "bicycle" | "car" | "van" | "truck";

export type DeliveryType = "food" | "package" | "document" | "express" | "standard" | "fragile" | "bulk";

export type DeliveryStatus = 
  | "pending" 
  | "assigned" 
  | "pickup_in_progress" 
  | "picked_up" 
  | "delivery_in_progress" 
  | "delivered" 
  | "cancelled" 
  | "failed";

export interface ServiceArea {
  city: string;
  areas: string[];
  radius: number;
}

export interface WorkingHours {
  day: string;
  startTime: string;
  endTime: string;
  isAvailable: boolean;
}

export interface BankAccountDetails {
  accountName: string;
  accountNumber: string;
  bankName: string;
  bankCode: string;
}

export interface EmergencyContact {
  name: string;
  relationship: string;
  phone: string;
}

export interface PackageDetails {
  weight: number;
  dimensions: {
    length: number;
    width: number;
    height: number;
  };
  value: number;
  description: string;
  fragile: boolean;
  requiresSignature: boolean;
}

export interface TrackingUpdate {
  timestamp: string;
  status: string;
  location?: { lat: number; lng: number };
  note?: string;
}

export interface DeliveryIssue {
  type: string;
  description: string;
  reportedBy: string;
  timestamp: string;
}

export interface BreakPeriod {
  startTime: string;
  endTime: string;
  type: "lunch" | "rest" | "maintenance";
}

// Application Form Types
export interface DispatchApplicationData {
  // Personal Information
  fullName: string;
  phoneNumber: string;
  dateOfBirth: string;
  idNumber: string;
  idDocument: File | null;
  
  // Address Information
  address: string;
  city: string;
  state: string;
  postalCode: string;
  
  // Vehicle Information
  vehicleType: VehicleType;
  vehicleModel: string;
  vehicleYear: number;
  licensePlate: string;
  vehiclePhotos: File[];
  
  // Documentation
  driverLicenseNumber: string;
  driverLicenseDocument: File | null;
  insuranceNumber: string;
  insuranceDocument: File | null;
  
  // Service Preferences
  serviceAreas: string[];
  deliveryTypes: DeliveryType[];
  maxDeliveryDistance: number;
  preferredWorkingHours: WorkingHours[];
  
  // Banking Information
  bankAccountName: string;
  bankAccountNumber: string;
  bankName: string;
  
  // Emergency Contact
  emergencyContactName: string;
  emergencyContactRelationship: string;
  emergencyContactPhone: string;
  
  // Terms & Conditions
  agreeToTerms: boolean;
  agreeToBackgroundCheck: boolean;
}

// Dashboard Statistics
export interface DispatchStats {
  totalEarnings: number;
  thisMonthEarnings: number;
  totalDeliveries: number;
  completedDeliveries: number;
  averageRating: number;
  onTimeRate: number;
  activeOrders: number;
  pendingPayouts: number;
}

// Real-time Location Update
export interface LocationUpdate {
  partnerId: string;
  location: {
    lat: number;
    lng: number;
  };
  timestamp: string;
  accuracy?: number;
  heading?: number;
  speed?: number;
}

// Delivery Request
export interface DeliveryRequest {
  id: string;
  orderId: string;
  pickupAddress: string;
  deliveryAddress: string;
  estimatedDistance: number;
  estimatedDuration: number;
  deliveryFee: number;
  priority: "express" | "standard" | "scheduled";
  packageDetails: PackageDetails;
  customerInfo: {
    name: string;
    phone: string;
  };
  pickupTime?: string;
  deliveryTime?: string;
}

// Partner Matching Criteria
export interface PartnerMatchingCriteria {
  location: { lat: number; lng: number };
  deliveryType: DeliveryType;
  vehicleType?: VehicleType;
  maxDistance: number;
  priority: "express" | "standard" | "scheduled";
  requiredRating?: number;
  specializations?: string[];
}
