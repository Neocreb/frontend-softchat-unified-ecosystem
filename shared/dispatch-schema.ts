import { pgTable, uuid, varchar, text, integer, decimal, timestamp, boolean, jsonb, point } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { users } from "./schema";

// Dispatch Partners Table
export const dispatchPartners = pgTable("dispatch_partners", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  
  // Application Info
  applicationStatus: varchar("application_status", { length: 20 }).notNull().default("pending"), // pending, approved, rejected, suspended
  applicationDate: timestamp("application_date").notNull().defaultNow(),
  approvalDate: timestamp("approval_date"),
  rejectionReason: text("rejection_reason"),
  
  // Personal Information
  fullName: varchar("full_name", { length: 100 }).notNull(),
  phoneNumber: varchar("phone_number", { length: 20 }).notNull(),
  dateOfBirth: timestamp("date_of_birth"),
  idNumber: varchar("id_number", { length: 50 }),
  idDocumentUrl: text("id_document_url"),
  
  // Address Information
  address: text("address").notNull(),
  city: varchar("city", { length: 50 }).notNull(),
  state: varchar("state", { length: 50 }).notNull(),
  postalCode: varchar("postal_code", { length: 10 }),
  country: varchar("country", { length: 50 }).notNull().default("Nigeria"),
  location: point("location"), // For GPS coordinates
  
  // Vehicle Information
  vehicleType: varchar("vehicle_type", { length: 30 }).notNull(), // motorcycle, bicycle, car, van, truck
  vehicleModel: varchar("vehicle_model", { length: 50 }),
  vehicleYear: integer("vehicle_year"),
  licensePlate: varchar("license_plate", { length: 20 }),
  vehiclePhotos: jsonb("vehicle_photos").$type<string[]>(),
  
  // Documentation
  driverLicenseNumber: varchar("driver_license_number", { length: 50 }),
  driverLicenseUrl: text("driver_license_url"),
  insuranceNumber: varchar("insurance_number", { length: 50 }),
  insuranceUrl: text("insurance_url"),
  backgroundCheckStatus: varchar("background_check_status", { length: 20 }).default("pending"),
  backgroundCheckDate: timestamp("background_check_date"),
  
  // Service Information
  serviceAreas: jsonb("service_areas").$type<{
    city: string;
    areas: string[];
    radius: number; // in kilometers
  }[]>(),
  deliveryTypes: jsonb("delivery_types").$type<string[]>(), // food, package, document, express, standard
  workingHours: jsonb("working_hours").$type<{
    day: string;
    startTime: string;
    endTime: string;
    isAvailable: boolean;
  }[]>(),
  maxDeliveryDistance: integer("max_delivery_distance").default(20), // in kilometers
  
  // Status & Availability
  isActive: boolean("is_active").default(false),
  isOnline: boolean("is_online").default(false),
  currentLocation: point("current_location"),
  lastLocationUpdate: timestamp("last_location_update"),
  
  // Performance Metrics
  totalDeliveries: integer("total_deliveries").default(0),
  completedDeliveries: integer("completed_deliveries").default(0),
  cancelledDeliveries: integer("cancelled_deliveries").default(0),
  averageRating: decimal("average_rating", { precision: 3, scale: 2 }).default("0.00"),
  totalRatings: integer("total_ratings").default(0),
  onTimeDeliveryRate: decimal("on_time_delivery_rate", { precision: 5, scale: 2 }).default("0.00"),
  
  // Financial Information
  totalEarnings: decimal("total_earnings", { precision: 10, scale: 2 }).default("0.00"),
  pendingPayouts: decimal("pending_payouts", { precision: 10, scale: 2 }).default("0.00"),
  commissionRate: decimal("commission_rate", { precision: 3, scale: 2 }).default("15.00"), // Platform commission %
  preferredPaymentMethod: varchar("preferred_payment_method", { length: 30 }).default("wallet"),
  bankAccountDetails: jsonb("bank_account_details").$type<{
    accountName: string;
    accountNumber: string;
    bankName: string;
    bankCode: string;
  }>(),
  
  // Verification & Compliance
  isVerified: boolean("is_verified").default(false),
  verificationLevel: varchar("verification_level", { length: 20 }).default("basic"), // basic, standard, premium
  complianceScore: integer("compliance_score").default(100),
  lastComplianceCheck: timestamp("last_compliance_check"),
  
  // Additional Information
  bio: text("bio"),
  languages: jsonb("languages").$type<string[]>(),
  specializations: jsonb("specializations").$type<string[]>(), // fragile_items, express_delivery, bulk_orders
  emergencyContact: jsonb("emergency_contact").$type<{
    name: string;
    relationship: string;
    phone: string;
  }>(),
  
  // Timestamps
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

// Delivery Orders Table
export const deliveryOrders = pgTable("delivery_orders", {
  id: uuid("id").primaryKey().defaultRandom(),
  orderId: uuid("order_id").notNull(), // Reference to marketplace order
  partnerId: uuid("partner_id").references(() => dispatchPartners.id),
  customerId: uuid("customer_id").notNull().references(() => users.id),
  sellerId: uuid("seller_id").notNull().references(() => users.id),
  
  // Delivery Information
  deliveryType: varchar("delivery_type", { length: 30 }).notNull(),
  priority: varchar("priority", { length: 20 }).default("standard"), // express, standard, scheduled
  instructions: text("instructions"),
  
  // Pickup Information
  pickupAddress: text("pickup_address").notNull(),
  pickupLocation: point("pickup_location"),
  pickupContactName: varchar("pickup_contact_name", { length: 100 }),
  pickupContactPhone: varchar("pickup_contact_phone", { length: 20 }),
  pickupWindowStart: timestamp("pickup_window_start"),
  pickupWindowEnd: timestamp("pickup_window_end"),
  actualPickupTime: timestamp("actual_pickup_time"),
  
  // Delivery Information
  deliveryAddress: text("delivery_address").notNull(),
  deliveryLocation: point("delivery_location"),
  deliveryContactName: varchar("delivery_contact_name", { length: 100 }),
  deliveryContactPhone: varchar("delivery_contact_phone", { length: 20 }),
  deliveryWindowStart: timestamp("delivery_window_start"),
  deliveryWindowEnd: timestamp("delivery_window_end"),
  actualDeliveryTime: timestamp("actual_delivery_time"),
  
  // Package Information
  packageDetails: jsonb("package_details").$type<{
    weight: number;
    dimensions: { length: number; width: number; height: number };
    value: number;
    description: string;
    fragile: boolean;
    requiresSignature: boolean;
  }>(),
  
  // Status & Tracking
  status: varchar("status", { length: 30 }).notNull().default("pending"), 
  // pending, assigned, pickup_in_progress, picked_up, delivery_in_progress, delivered, cancelled, failed
  estimatedDeliveryTime: timestamp("estimated_delivery_time"),
  trackingUpdates: jsonb("tracking_updates").$type<{
    timestamp: string;
    status: string;
    location?: { lat: number; lng: number };
    note?: string;
  }[]>(),
  
  // Financial Information
  deliveryFee: decimal("delivery_fee", { precision: 8, scale: 2 }).notNull(),
  partnerEarnings: decimal("partner_earnings", { precision: 8, scale: 2 }),
  platformCommission: decimal("platform_commission", { precision: 8, scale: 2 }),
  tips: decimal("tips", { precision: 8, scale: 2 }).default("0.00"),
  
  // Quality & Feedback
  customerRating: integer("customer_rating"), // 1-5 stars
  customerFeedback: text("customer_feedback"),
  partnerRating: integer("partner_rating"), // Partner rates customer
  partnerFeedback: text("partner_feedback"),
  issuesReported: jsonb("issues_reported").$type<{
    type: string;
    description: string;
    reportedBy: string;
    timestamp: string;
  }[]>(),
  
  // Proof of Delivery
  deliveryPhotos: jsonb("delivery_photos").$type<string[]>(),
  customerSignature: text("customer_signature"),
  deliveryConfirmationCode: varchar("delivery_confirmation_code", { length: 10 }),
  
  // Timestamps
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

// Partner Availability Table
export const partnerAvailability = pgTable("partner_availability", {
  id: uuid("id").primaryKey().defaultRandom(),
  partnerId: uuid("partner_id").notNull().references(() => dispatchPartners.id, { onDelete: "cascade" }),
  
  date: timestamp("date").notNull(),
  isAvailable: boolean("is_available").default(true),
  startTime: varchar("start_time", { length: 8 }), // HH:MM format
  endTime: varchar("end_time", { length: 8 }),
  
  // Capacity Management
  maxDeliveries: integer("max_deliveries").default(10),
  currentDeliveries: integer("current_deliveries").default(0),
  
  // Break Periods
  breakPeriods: jsonb("break_periods").$type<{
    startTime: string;
    endTime: string;
    type: string; // lunch, rest, maintenance
  }[]>(),
  
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

// Partner Earnings Table
export const partnerEarnings = pgTable("partner_earnings", {
  id: uuid("id").primaryKey().defaultRandom(),
  partnerId: uuid("partner_id").notNull().references(() => dispatchPartners.id, { onDelete: "cascade" }),
  deliveryOrderId: uuid("delivery_order_id").references(() => deliveryOrders.id),
  
  // Earnings Breakdown
  baseEarnings: decimal("base_earnings", { precision: 8, scale: 2 }).notNull(),
  distanceBonus: decimal("distance_bonus", { precision: 8, scale: 2 }).default("0.00"),
  timeBonus: decimal("time_bonus", { precision: 8, scale: 2 }).default("0.00"),
  priorityBonus: decimal("priority_bonus", { precision: 8, scale: 2 }).default("0.00"),
  performanceBonus: decimal("performance_bonus", { precision: 8, scale: 2 }).default("0.00"),
  tips: decimal("tips", { precision: 8, scale: 2 }).default("0.00"),
  totalEarnings: decimal("total_earnings", { precision: 8, scale: 2 }).notNull(),
  
  // Deductions
  platformCommission: decimal("platform_commission", { precision: 8, scale: 2 }).notNull(),
  fuelDeduction: decimal("fuel_deduction", { precision: 8, scale: 2 }).default("0.00"),
  otherDeductions: decimal("other_deductions", { precision: 8, scale: 2 }).default("0.00"),
  netEarnings: decimal("net_earnings", { precision: 8, scale: 2 }).notNull(),
  
  // Payment Information
  paymentStatus: varchar("payment_status", { length: 20 }).default("pending"), // pending, paid, failed
  paymentDate: timestamp("payment_date"),
  paymentMethod: varchar("payment_method", { length: 30 }),
  paymentReference: varchar("payment_reference", { length: 100 }),
  
  // Period Information
  earningsDate: timestamp("earnings_date").notNull(),
  payoutPeriod: varchar("payout_period", { length: 20 }), // daily, weekly, monthly
  
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

// Relations
export const dispatchPartnersRelations = relations(dispatchPartners, ({ one, many }) => ({
  user: one(users, {
    fields: [dispatchPartners.userId],
    references: [users.id],
  }),
  deliveryOrders: many(deliveryOrders),
  availability: many(partnerAvailability),
  earnings: many(partnerEarnings),
}));

export const deliveryOrdersRelations = relations(deliveryOrders, ({ one }) => ({
  partner: one(dispatchPartners, {
    fields: [deliveryOrders.partnerId],
    references: [dispatchPartners.id],
  }),
  customer: one(users, {
    fields: [deliveryOrders.customerId],
    references: [users.id],
  }),
  seller: one(users, {
    fields: [deliveryOrders.sellerId],
    references: [users.id],
  }),
}));

export const partnerAvailabilityRelations = relations(partnerAvailability, ({ one }) => ({
  partner: one(dispatchPartners, {
    fields: [partnerAvailability.partnerId],
    references: [dispatchPartners.id],
  }),
}));

export const partnerEarningsRelations = relations(partnerEarnings, ({ one }) => ({
  partner: one(dispatchPartners, {
    fields: [partnerEarnings.partnerId],
    references: [dispatchPartners.id],
  }),
  deliveryOrder: one(deliveryOrders, {
    fields: [partnerEarnings.deliveryOrderId],
    references: [deliveryOrders.id],
  }),
}));
