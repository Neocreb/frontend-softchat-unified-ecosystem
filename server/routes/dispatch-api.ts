import { Router, Request, Response } from "express";
import { z } from "zod";
import { eq, and, desc, asc, count, sql, inArray } from "drizzle-orm";
import { db } from "../db";
import { 
  dispatchPartners, 
  deliveryOrders, 
  partnerAvailability, 
  partnerEarnings 
} from "../../shared/dispatch-schema";
import { users } from "../../shared/schema";
import { requireAuth } from "../middleware/auth";
import { requireAdmin } from "../middleware/admin";
import rateLimit from "express-rate-limit";

const router = Router();

// Rate limiting for API endpoints
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: "Too many requests from this IP, please try again later."
});

const applicationLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 3, // limit each IP to 3 application submissions per hour
  message: "Too many application submissions, please try again later."
});

// Apply rate limiting to all routes
router.use(generalLimiter);

// Validation schemas
const dispatchApplicationSchema = z.object({
  fullName: z.string().min(2).max(100),
  phoneNumber: z.string().regex(/^[+]?[\d\s-()]+$/),
  dateOfBirth: z.string(),
  idNumber: z.string().min(1),
  address: z.string().min(5),
  city: z.string().min(2),
  state: z.string().min(2),
  postalCode: z.string().optional(),
  vehicleType: z.enum(["motorcycle", "bicycle", "car", "van", "truck"]),
  vehicleModel: z.string().min(2),
  vehicleYear: z.number().min(1990).max(new Date().getFullYear() + 1),
  licensePlate: z.string().min(3),
  driverLicenseNumber: z.string().min(5),
  insuranceNumber: z.string().min(5),
  serviceAreas: z.array(z.string()).min(1),
  deliveryTypes: z.array(z.string()).min(1),
  maxDeliveryDistance: z.number().min(1).max(50),
  bankAccountName: z.string().min(2),
  bankAccountNumber: z.string().min(10),
  bankName: z.string().min(2),
  emergencyContactName: z.string().min(2),
  emergencyContactRelationship: z.string().min(2),
  emergencyContactPhone: z.string().regex(/^[+]?[\d\s-()]+$/),
  agreeToTerms: z.boolean().refine(val => val === true),
  agreeToBackgroundCheck: z.boolean().refine(val => val === true),
});

const deliveryStatusUpdateSchema = z.object({
  status: z.enum([
    "pending", "assigned", "pickup_in_progress", "picked_up", 
    "delivery_in_progress", "delivered", "cancelled", "failed"
  ]),
  location: z.object({
    lat: z.number(),
    lng: z.number(),
  }).optional(),
  note: z.string().optional(),
  proofPhotos: z.array(z.string()).optional(),
});

const availabilityUpdateSchema = z.object({
  isOnline: z.boolean(),
  currentLocation: z.object({
    lat: z.number(),
    lng: z.number(),
  }).optional(),
});

const partnerMatchingSchema = z.object({
  pickupLocation: z.object({
    lat: z.number(),
    lng: z.number(),
  }),
  deliveryLocation: z.object({
    lat: z.number(),
    lng: z.number(),
  }),
  deliveryType: z.string(),
  priority: z.enum(["express", "standard", "scheduled"]),
  vehicleType: z.enum(["motorcycle", "bicycle", "car", "van", "truck"]).optional(),
  maxDistance: z.number().default(20),
  requiredRating: z.number().min(0).max(5).default(4.0),
});

// === PARTNER APPLICATION ENDPOINTS ===

// Submit dispatch partner application
router.post("/apply", requireAuth, applicationLimiter, async (req: Request, res: Response) => {
  try {
    const validatedData = dispatchApplicationSchema.parse(req.body);
    const userId = (req as any).user.id;

    // Check if user already has an application
    const existingApplication = await db
      .select()
      .from(dispatchPartners)
      .where(eq(dispatchPartners.userId, userId))
      .limit(1);

    if (existingApplication.length > 0) {
      return res.status(400).json({ 
        error: "You already have a dispatch partner application" 
      });
    }

    // Create new application
    const newApplication = await db
      .insert(dispatchPartners)
      .values({
        userId,
        applicationStatus: "pending",
        fullName: validatedData.fullName,
        phoneNumber: validatedData.phoneNumber,
        dateOfBirth: validatedData.dateOfBirth,
        idNumber: validatedData.idNumber,
        address: validatedData.address,
        city: validatedData.city,
        state: validatedData.state,
        postalCode: validatedData.postalCode,
        country: "Nigeria",
        vehicleType: validatedData.vehicleType,
        vehicleModel: validatedData.vehicleModel,
        vehicleYear: validatedData.vehicleYear,
        licensePlate: validatedData.licensePlate,
        driverLicenseNumber: validatedData.driverLicenseNumber,
        insuranceNumber: validatedData.insuranceNumber,
        serviceAreas: validatedData.serviceAreas.map(area => ({
          city: area,
          areas: [area],
          radius: validatedData.maxDeliveryDistance,
        })),
        deliveryTypes: validatedData.deliveryTypes,
        maxDeliveryDistance: validatedData.maxDeliveryDistance,
        bankAccountDetails: {
          accountName: validatedData.bankAccountName,
          accountNumber: validatedData.bankAccountNumber,
          bankName: validatedData.bankName,
          bankCode: "", // To be filled during verification
        },
        emergencyContact: {
          name: validatedData.emergencyContactName,
          relationship: validatedData.emergencyContactRelationship,
          phone: validatedData.emergencyContactPhone,
        },
      })
      .returning();

    res.status(201).json({
      message: "Application submitted successfully",
      application: newApplication[0],
    });
  } catch (error) {
    console.error("Error submitting application:", error);
    res.status(500).json({ error: "Failed to submit application" });
  }
});

// Get application status
router.get("/application", requireAuth, async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;

    const application = await db
      .select()
      .from(dispatchPartners)
      .where(eq(dispatchPartners.userId, userId))
      .limit(1);

    if (application.length === 0) {
      return res.status(404).json({ error: "No application found" });
    }

    res.json({ application: application[0] });
  } catch (error) {
    console.error("Error fetching application:", error);
    res.status(500).json({ error: "Failed to fetch application" });
  }
});

// === PARTNER MANAGEMENT ENDPOINTS ===

// Get partner dashboard data
router.get("/dashboard", requireAuth, async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;

    // Get partner profile
    const partner = await db
      .select()
      .from(dispatchPartners)
      .where(and(
        eq(dispatchPartners.userId, userId),
        eq(dispatchPartners.applicationStatus, "approved")
      ))
      .limit(1);

    if (partner.length === 0) {
      return res.status(404).json({ error: "Partner not found or not approved" });
    }

    const partnerId = partner[0].id;

    // Get recent deliveries
    const recentDeliveries = await db
      .select()
      .from(deliveryOrders)
      .where(eq(deliveryOrders.partnerId, partnerId))
      .orderBy(desc(deliveryOrders.createdAt))
      .limit(10);

    // Get earnings summary
    const earningsData = await db
      .select({
        totalEarnings: sql<number>`COALESCE(SUM(${partnerEarnings.totalEarnings}), 0)`,
        thisMonthEarnings: sql<number>`
          COALESCE(SUM(CASE 
            WHEN ${partnerEarnings.earningsDate} >= date_trunc('month', CURRENT_DATE) 
            THEN ${partnerEarnings.totalEarnings} 
            ELSE 0 
          END), 0)
        `,
        pendingPayouts: sql<number>`
          COALESCE(SUM(CASE 
            WHEN ${partnerEarnings.paymentStatus} = 'pending' 
            THEN ${partnerEarnings.totalEarnings} 
            ELSE 0 
          END), 0)
        `,
      })
      .from(partnerEarnings)
      .where(eq(partnerEarnings.partnerId, partnerId));

    // Get performance stats
    const performanceStats = {
      totalDeliveries: partner[0].totalDeliveries,
      completedDeliveries: partner[0].completedDeliveries,
      averageRating: partner[0].averageRating,
      onTimeRate: partner[0].onTimeDeliveryRate,
      activeOrders: recentDeliveries.filter(order => 
        ["assigned", "pickup_in_progress", "picked_up", "delivery_in_progress"].includes(order.status)
      ).length,
    };

    res.json({
      partner: partner[0],
      stats: {
        ...performanceStats,
        ...earningsData[0],
      },
      recentDeliveries,
    });
  } catch (error) {
    console.error("Error fetching dashboard data:", error);
    res.status(500).json({ error: "Failed to fetch dashboard data" });
  }
});

// Update partner availability
router.put("/availability", requireAuth, async (req: Request, res: Response) => {
  try {
    const validatedData = availabilityUpdateSchema.parse(req.body);
    const userId = (req as any).user.id;

    // Get partner ID
    const partner = await db
      .select({ id: dispatchPartners.id })
      .from(dispatchPartners)
      .where(and(
        eq(dispatchPartners.userId, userId),
        eq(dispatchPartners.applicationStatus, "approved")
      ))
      .limit(1);

    if (partner.length === 0) {
      return res.status(404).json({ error: "Partner not found" });
    }

    // Update partner availability
    await db
      .update(dispatchPartners)
      .set({
        isOnline: validatedData.isOnline,
        currentLocation: validatedData.currentLocation,
        lastLocationUpdate: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      })
      .where(eq(dispatchPartners.id, partner[0].id));

    res.json({ message: "Availability updated successfully" });
  } catch (error) {
    console.error("Error updating availability:", error);
    res.status(500).json({ error: "Failed to update availability" });
  }
});

// === DELIVERY MANAGEMENT ENDPOINTS ===

// Get available delivery requests
router.get("/delivery-requests", requireAuth, async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;

    // Get partner info
    const partner = await db
      .select()
      .from(dispatchPartners)
      .where(and(
        eq(dispatchPartners.userId, userId),
        eq(dispatchPartners.applicationStatus, "approved"),
        eq(dispatchPartners.isActive, true)
      ))
      .limit(1);

    if (partner.length === 0) {
      return res.status(404).json({ error: "Partner not found or not active" });
    }

    // Get pending delivery orders in partner's service area
    const pendingOrders = await db
      .select()
      .from(deliveryOrders)
      .where(and(
        eq(deliveryOrders.status, "pending"),
        sql`${deliveryOrders.partnerId} IS NULL`
      ))
      .orderBy(desc(deliveryOrders.createdAt))
      .limit(20);

    res.json({ deliveryRequests: pendingOrders });
  } catch (error) {
    console.error("Error fetching delivery requests:", error);
    res.status(500).json({ error: "Failed to fetch delivery requests" });
  }
});

// Accept delivery request
router.post("/delivery/:orderId/accept", requireAuth, async (req: Request, res: Response) => {
  try {
    const { orderId } = req.params;
    const userId = (req as any).user.id;

    // Get partner info
    const partner = await db
      .select()
      .from(dispatchPartners)
      .where(and(
        eq(dispatchPartners.userId, userId),
        eq(dispatchPartners.applicationStatus, "approved"),
        eq(dispatchPartners.isActive, true)
      ))
      .limit(1);

    if (partner.length === 0) {
      return res.status(404).json({ error: "Partner not found or not active" });
    }

    // Check if order is still available
    const order = await db
      .select()
      .from(deliveryOrders)
      .where(and(
        eq(deliveryOrders.id, orderId),
        eq(deliveryOrders.status, "pending"),
        sql`${deliveryOrders.partnerId} IS NULL`
      ))
      .limit(1);

    if (order.length === 0) {
      return res.status(404).json({ error: "Order not found or already assigned" });
    }

    // Assign order to partner
    await db
      .update(deliveryOrders)
      .set({
        partnerId: partner[0].id,
        status: "assigned",
        updatedAt: new Date().toISOString(),
      })
      .where(eq(deliveryOrders.id, orderId));

    res.json({ message: "Delivery accepted successfully", orderId });
  } catch (error) {
    console.error("Error accepting delivery:", error);
    res.status(500).json({ error: "Failed to accept delivery" });
  }
});

// Update delivery status
router.put("/delivery/:orderId/status", requireAuth, async (req: Request, res: Response) => {
  try {
    const { orderId } = req.params;
    const validatedData = deliveryStatusUpdateSchema.parse(req.body);
    const userId = (req as any).user.id;

    // Verify partner owns this delivery
    const delivery = await db
      .select()
      .from(deliveryOrders)
      .innerJoin(dispatchPartners, eq(deliveryOrders.partnerId, dispatchPartners.id))
      .where(and(
        eq(deliveryOrders.id, orderId),
        eq(dispatchPartners.userId, userId)
      ))
      .limit(1);

    if (delivery.length === 0) {
      return res.status(404).json({ error: "Delivery not found or not assigned to you" });
    }

    // Update delivery status
    const updateData: any = {
      status: validatedData.status,
      updatedAt: new Date().toISOString(),
    };

    // Add timestamp for specific status updates
    if (validatedData.status === "picked_up") {
      updateData.actualPickupTime = new Date().toISOString();
    } else if (validatedData.status === "delivered") {
      updateData.actualDeliveryTime = new Date().toISOString();
      if (validatedData.proofPhotos) {
        updateData.deliveryPhotos = validatedData.proofPhotos;
      }
    }

    await db
      .update(deliveryOrders)
      .set(updateData)
      .where(eq(deliveryOrders.id, orderId));

    // Add tracking update
    const currentOrder = delivery[0].delivery_orders;
    const trackingUpdates = currentOrder.trackingUpdates || [];
    trackingUpdates.push({
      timestamp: new Date().toISOString(),
      status: validatedData.status,
      location: validatedData.location,
      note: validatedData.note,
    });

    await db
      .update(deliveryOrders)
      .set({ trackingUpdates })
      .where(eq(deliveryOrders.id, orderId));

    res.json({ message: "Delivery status updated successfully" });
  } catch (error) {
    console.error("Error updating delivery status:", error);
    res.status(500).json({ error: "Failed to update delivery status" });
  }
});

// Get partner's active deliveries
router.get("/deliveries", requireAuth, async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    const { status, limit = 20, offset = 0 } = req.query;

    // Get partner info
    const partner = await db
      .select({ id: dispatchPartners.id })
      .from(dispatchPartners)
      .where(eq(dispatchPartners.userId, userId))
      .limit(1);

    if (partner.length === 0) {
      return res.status(404).json({ error: "Partner not found" });
    }

    let query = db
      .select()
      .from(deliveryOrders)
      .where(eq(deliveryOrders.partnerId, partner[0].id));

    if (status && typeof status === 'string') {
      query = query.where(eq(deliveryOrders.status, status as any));
    }

    const deliveries = await query
      .orderBy(desc(deliveryOrders.createdAt))
      .limit(parseInt(limit as string))
      .offset(parseInt(offset as string));

    res.json({ deliveries });
  } catch (error) {
    console.error("Error fetching deliveries:", error);
    res.status(500).json({ error: "Failed to fetch deliveries" });
  }
});

// === PARTNER MATCHING ENDPOINTS ===

// Find available partners for delivery
router.post("/match-partners", async (req: Request, res: Response) => {
  try {
    const validatedData = partnerMatchingSchema.parse(req.body);

    // Find partners within range and available
    const availablePartners = await db
      .select()
      .from(dispatchPartners)
      .where(and(
        eq(dispatchPartners.applicationStatus, "approved"),
        eq(dispatchPartners.isActive, true),
        eq(dispatchPartners.isOnline, true),
        sql`${dispatchPartners.averageRating} >= ${validatedData.requiredRating}`
      ))
      .orderBy(desc(dispatchPartners.averageRating));

    // Filter by distance (simplified - in production, use proper geospatial queries)
    const nearbyPartners = availablePartners.filter(partner => {
      if (!partner.currentLocation) return false;
      
      // Simple distance calculation (should use proper geospatial functions)
      const distance = Math.sqrt(
        Math.pow(partner.currentLocation.lat - validatedData.pickupLocation.lat, 2) +
        Math.pow(partner.currentLocation.lng - validatedData.pickupLocation.lng, 2)
      ) * 111; // Rough conversion to km

      return distance <= validatedData.maxDistance;
    });

    res.json({ 
      partners: nearbyPartners.slice(0, 10),
      totalFound: nearbyPartners.length,
    });
  } catch (error) {
    console.error("Error matching partners:", error);
    res.status(500).json({ error: "Failed to find available partners" });
  }
});

// === PUBLIC ENDPOINTS ===

// Get public partner directory
router.get("/partners", async (req: Request, res: Response) => {
  try {
    const { 
      city, 
      vehicleType, 
      minRating = 4.0, 
      isOnline,
      limit = 20, 
      offset = 0 
    } = req.query;

    let query = db
      .select({
        id: dispatchPartners.id,
        fullName: dispatchPartners.fullName,
        city: dispatchPartners.city,
        state: dispatchPartners.state,
        vehicleType: dispatchPartners.vehicleType,
        vehicleModel: dispatchPartners.vehicleModel,
        isOnline: dispatchPartners.isOnline,
        totalDeliveries: dispatchPartners.totalDeliveries,
        averageRating: dispatchPartners.averageRating,
        totalRatings: dispatchPartners.totalRatings,
        onTimeDeliveryRate: dispatchPartners.onTimeDeliveryRate,
        isVerified: dispatchPartners.isVerified,
        verificationLevel: dispatchPartners.verificationLevel,
        specializations: dispatchPartners.specializations,
        languages: dispatchPartners.languages,
        bio: dispatchPartners.bio,
      })
      .from(dispatchPartners)
      .where(and(
        eq(dispatchPartners.applicationStatus, "approved"),
        eq(dispatchPartners.isActive, true),
        sql`${dispatchPartners.averageRating} >= ${parseFloat(minRating as string)}`
      ));

    if (city && typeof city === 'string') {
      query = query.where(eq(dispatchPartners.city, city));
    }

    if (vehicleType && typeof vehicleType === 'string') {
      query = query.where(eq(dispatchPartners.vehicleType, vehicleType as any));
    }

    if (isOnline !== undefined) {
      query = query.where(eq(dispatchPartners.isOnline, isOnline === 'true'));
    }

    const partners = await query
      .orderBy(desc(dispatchPartners.averageRating))
      .limit(parseInt(limit as string))
      .offset(parseInt(offset as string));

    // Get total count for pagination
    const totalCountResult = await db
      .select({ count: count() })
      .from(dispatchPartners)
      .where(and(
        eq(dispatchPartners.applicationStatus, "approved"),
        eq(dispatchPartners.isActive, true)
      ));

    res.json({ 
      partners,
      total: totalCountResult[0].count,
      hasMore: partners.length === parseInt(limit as string),
    });
  } catch (error) {
    console.error("Error fetching partners:", error);
    res.status(500).json({ error: "Failed to fetch partners" });
  }
});

// Get partner public profile
router.get("/partners/:partnerId", async (req: Request, res: Response) => {
  try {
    const { partnerId } = req.params;

    const partner = await db
      .select({
        id: dispatchPartners.id,
        fullName: dispatchPartners.fullName,
        city: dispatchPartners.city,
        state: dispatchPartners.state,
        vehicleType: dispatchPartners.vehicleType,
        vehicleModel: dispatchPartners.vehicleModel,
        vehicleYear: dispatchPartners.vehicleYear,
        isOnline: dispatchPartners.isOnline,
        totalDeliveries: dispatchPartners.totalDeliveries,
        completedDeliveries: dispatchPartners.completedDeliveries,
        averageRating: dispatchPartners.averageRating,
        totalRatings: dispatchPartners.totalRatings,
        onTimeDeliveryRate: dispatchPartners.onTimeDeliveryRate,
        isVerified: dispatchPartners.isVerified,
        verificationLevel: dispatchPartners.verificationLevel,
        complianceScore: dispatchPartners.complianceScore,
        specializations: dispatchPartners.specializations,
        languages: dispatchPartners.languages,
        bio: dispatchPartners.bio,
        createdAt: dispatchPartners.createdAt,
      })
      .from(dispatchPartners)
      .where(and(
        eq(dispatchPartners.id, partnerId),
        eq(dispatchPartners.applicationStatus, "approved"),
        eq(dispatchPartners.isActive, true)
      ))
      .limit(1);

    if (partner.length === 0) {
      return res.status(404).json({ error: "Partner not found" });
    }

    res.json({ partner: partner[0] });
  } catch (error) {
    console.error("Error fetching partner profile:", error);
    res.status(500).json({ error: "Failed to fetch partner profile" });
  }
});

// === ADMIN ENDPOINTS ===

// Get all partners (admin only)
router.get("/admin/partners", requireAuth, requireAdmin, async (req: Request, res: Response) => {
  try {
    const { 
      status, 
      city, 
      verificationLevel,
      limit = 50, 
      offset = 0 
    } = req.query;

    let query = db
      .select()
      .from(dispatchPartners)
      .innerJoin(users, eq(dispatchPartners.userId, users.id));

    const conditions = [];

    if (status && typeof status === 'string') {
      conditions.push(eq(dispatchPartners.applicationStatus, status as any));
    }

    if (city && typeof city === 'string') {
      conditions.push(eq(dispatchPartners.city, city));
    }

    if (verificationLevel && typeof verificationLevel === 'string') {
      conditions.push(eq(dispatchPartners.verificationLevel, verificationLevel as any));
    }

    if (conditions.length > 0) {
      query = query.where(and(...conditions));
    }

    const partners = await query
      .orderBy(desc(dispatchPartners.createdAt))
      .limit(parseInt(limit as string))
      .offset(parseInt(offset as string));

    res.json({ partners });
  } catch (error) {
    console.error("Error fetching admin partners:", error);
    res.status(500).json({ error: "Failed to fetch partners" });
  }
});

// Approve/reject partner application (admin only)
router.put("/admin/partners/:partnerId/status", requireAuth, requireAdmin, async (req: Request, res: Response) => {
  try {
    const { partnerId } = req.params;
    const { status, rejectionReason } = req.body;

    if (!["approved", "rejected", "suspended"].includes(status)) {
      return res.status(400).json({ error: "Invalid status" });
    }

    const updateData: any = {
      applicationStatus: status,
      updatedAt: new Date().toISOString(),
    };

    if (status === "approved") {
      updateData.approvalDate = new Date().toISOString();
      updateData.isActive = true;
      updateData.isVerified = true;
    } else if (status === "rejected") {
      updateData.rejectionReason = rejectionReason;
      updateData.isActive = false;
    } else if (status === "suspended") {
      updateData.isActive = false;
      updateData.isOnline = false;
    }

    await db
      .update(dispatchPartners)
      .set(updateData)
      .where(eq(dispatchPartners.id, partnerId));

    res.json({ message: `Partner ${status} successfully` });
  } catch (error) {
    console.error("Error updating partner status:", error);
    res.status(500).json({ error: "Failed to update partner status" });
  }
});

// Get admin dashboard stats
router.get("/admin/stats", requireAuth, requireAdmin, async (req: Request, res: Response) => {
  try {
    const stats = await db
      .select({
        totalPartners: count(),
        activePartners: sql<number>`COUNT(CASE WHEN ${dispatchPartners.isActive} = true THEN 1 END)`,
        onlinePartners: sql<number>`COUNT(CASE WHEN ${dispatchPartners.isOnline} = true THEN 1 END)`,
        pendingApplications: sql<number>`COUNT(CASE WHEN ${dispatchPartners.applicationStatus} = 'pending' THEN 1 END)`,
        averageRating: sql<number>`AVG(${dispatchPartners.averageRating})`,
        totalDeliveries: sql<number>`SUM(${dispatchPartners.totalDeliveries})`,
      })
      .from(dispatchPartners);

    const deliveryStats = await db
      .select({
        totalOrders: count(),
        completedOrders: sql<number>`COUNT(CASE WHEN ${deliveryOrders.status} = 'delivered' THEN 1 END)`,
        activeOrders: sql<number>`COUNT(CASE WHEN ${deliveryOrders.status} IN ('assigned', 'pickup_in_progress', 'picked_up', 'delivery_in_progress') THEN 1 END)`,
      })
      .from(deliveryOrders);

    res.json({
      partners: stats[0],
      deliveries: deliveryStats[0],
    });
  } catch (error) {
    console.error("Error fetching admin stats:", error);
    res.status(500).json({ error: "Failed to fetch admin stats" });
  }
});

export default router;
