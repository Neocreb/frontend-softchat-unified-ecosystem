import express from "express";
import { authenticateToken } from "../middleware/auth";
import { db } from "../db";
import { eq, and, desc, asc, sql, or, like, gte, lte, inArray } from "drizzle-orm";
import {
  deliveryProviders,
  deliveryAssignments,
  deliveryTrackingEvents,
  deliveryReviews,
  deliveryZones,
  deliveryDisputes,
  marketplaceOrders,
  users,
  profiles,
  insertDeliveryProviderSchema,
  insertDeliveryAssignmentSchema,
  insertDeliveryTrackingEventSchema,
  insertDeliveryReviewSchema,
  insertDeliveryZoneSchema,
  insertDeliveryDisputeSchema,
} from "../../shared/enhanced-schema";
import { z } from "zod";
import { v4 as uuidv4 } from "uuid";

const router = express.Router();

// =============================================================================
// DELIVERY PROVIDER REGISTRATION & MANAGEMENT
// =============================================================================

// Register as a delivery provider
router.post("/providers/register", authenticateToken, async (req, res) => {
  try {
    const validatedData = insertDeliveryProviderSchema.parse({
      ...req.body,
      providerId: req.user!.id,
    });

    // Check if user is already a delivery provider
    const existingProvider = await db
      .select()
      .from(deliveryProviders)
      .where(eq(deliveryProviders.providerId, req.user!.id))
      .limit(1);

    if (existingProvider.length > 0) {
      return res.status(400).json({ 
        error: "User is already registered as a delivery provider" 
      });
    }

    const [provider] = await db
      .insert(deliveryProviders)
      .values(validatedData)
      .returning();

    res.status(201).json(provider);
  } catch (error) {
    console.error("Error registering delivery provider:", error);
    res.status(500).json({ error: "Failed to register delivery provider" });
  }
});

// Get delivery provider profile
router.get("/providers/profile", authenticateToken, async (req, res) => {
  try {
    const provider = await db
      .select()
      .from(deliveryProviders)
      .where(eq(deliveryProviders.providerId, req.user!.id))
      .limit(1);

    if (provider.length === 0) {
      return res.status(404).json({ error: "Delivery provider not found" });
    }

    res.json(provider[0]);
  } catch (error) {
    console.error("Error fetching delivery provider profile:", error);
    res.status(500).json({ error: "Failed to fetch provider profile" });
  }
});

// Update delivery provider profile
router.put("/providers/profile", authenticateToken, async (req, res) => {
  try {
    const updateData = { ...req.body, updatedAt: new Date() };
    delete updateData.id;
    delete updateData.providerId;
    delete updateData.createdAt;

    const [provider] = await db
      .update(deliveryProviders)
      .set(updateData)
      .where(eq(deliveryProviders.providerId, req.user!.id))
      .returning();

    if (!provider) {
      return res.status(404).json({ error: "Delivery provider not found" });
    }

    res.json(provider);
  } catch (error) {
    console.error("Error updating delivery provider profile:", error);
    res.status(500).json({ error: "Failed to update provider profile" });
  }
});

// Get available delivery providers for a location
router.post("/providers/available", async (req, res) => {
  try {
    const { pickupAddress, deliveryAddress, serviceType, packageDetails } = req.body;

    // This is a simplified version - in production, you'd use proper geospatial queries
    const providers = await db
      .select({
        id: deliveryProviders.id,
        businessName: deliveryProviders.businessName,
        rating: deliveryProviders.rating,
        reviewCount: deliveryProviders.reviewCount,
        baseRate: deliveryProviders.baseRate,
        ratePerKm: deliveryProviders.ratePerKm,
        servicesOffered: deliveryProviders.servicesOffered,
        vehicleTypes: deliveryProviders.vehicleTypes,
        onTimeRate: deliveryProviders.onTimeRate,
        operatingHours: deliveryProviders.operatingHours,
        contactPhone: deliveryProviders.contactPhone,
      })
      .from(deliveryProviders)
      .where(
        and(
          eq(deliveryProviders.isActive, true),
          eq(deliveryProviders.isAvailable, true),
          eq(deliveryProviders.verificationStatus, "verified")
        )
      )
      .orderBy(desc(deliveryProviders.rating), asc(deliveryProviders.baseRate));

    // Calculate estimated delivery fee for each provider
    const providersWithPricing = providers.map(provider => {
      const distance = calculateDistance(pickupAddress, deliveryAddress); // You'd implement this
      const estimatedFee = calculateDeliveryFee(provider, distance, serviceType, packageDetails);
      
      return {
        ...provider,
        estimatedDistance: distance,
        estimatedFee,
        estimatedDeliveryTime: getEstimatedDeliveryTime(provider, serviceType),
      };
    });

    res.json(providersWithPricing);
  } catch (error) {
    console.error("Error fetching available providers:", error);
    res.status(500).json({ error: "Failed to fetch available providers" });
  }
});

// =============================================================================
// DELIVERY ASSIGNMENTS
// =============================================================================

// Create delivery assignment
router.post("/assignments", authenticateToken, async (req, res) => {
  try {
    const assignmentData = {
      ...req.body,
      trackingNumber: generateTrackingNumber(),
    };

    const validatedData = insertDeliveryAssignmentSchema.parse(assignmentData);

    const [assignment] = await db
      .insert(deliveryAssignments)
      .values(validatedData)
      .returning();

    // Create initial tracking event
    await db.insert(deliveryTrackingEvents).values({
      assignmentId: assignment.id,
      eventType: "created",
      description: "Delivery assignment created",
      createdBy: req.user!.id,
    });

    res.status(201).json(assignment);
  } catch (error) {
    console.error("Error creating delivery assignment:", error);
    res.status(500).json({ error: "Failed to create delivery assignment" });
  }
});

// Get delivery assignments for provider
router.get("/assignments/provider", authenticateToken, async (req, res) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;
    const offset = (parseInt(page as string) - 1) * parseInt(limit as string);

    // Get provider ID
    const provider = await db
      .select({ id: deliveryProviders.id })
      .from(deliveryProviders)
      .where(eq(deliveryProviders.providerId, req.user!.id))
      .limit(1);

    if (provider.length === 0) {
      return res.status(404).json({ error: "Delivery provider not found" });
    }

    let query = db
      .select({
        assignment: deliveryAssignments,
        order: {
          id: marketplaceOrders.id,
          orderNumber: marketplaceOrders.orderNumber,
          total: marketplaceOrders.total,
        },
      })
      .from(deliveryAssignments)
      .leftJoin(marketplaceOrders, eq(deliveryAssignments.orderId, marketplaceOrders.id))
      .where(eq(deliveryAssignments.providerId, provider[0].id))
      .orderBy(desc(deliveryAssignments.createdAt))
      .limit(parseInt(limit as string))
      .offset(offset);

    if (status) {
      query = query.where(
        and(
          eq(deliveryAssignments.providerId, provider[0].id),
          eq(deliveryAssignments.status, status as string)
        )
      );
    }

    const assignments = await query;

    res.json(assignments);
  } catch (error) {
    console.error("Error fetching delivery assignments:", error);
    res.status(500).json({ error: "Failed to fetch delivery assignments" });
  }
});

// Update assignment status
router.put("/assignments/:id/status", authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { status, location, notes, photos } = req.body;

    // Verify the assignment belongs to this provider
    const provider = await db
      .select({ id: deliveryProviders.id })
      .from(deliveryProviders)
      .where(eq(deliveryProviders.providerId, req.user!.id))
      .limit(1);

    if (provider.length === 0) {
      return res.status(404).json({ error: "Delivery provider not found" });
    }

    const assignment = await db
      .select()
      .from(deliveryAssignments)
      .where(
        and(
          eq(deliveryAssignments.id, id),
          eq(deliveryAssignments.providerId, provider[0].id)
        )
      )
      .limit(1);

    if (assignment.length === 0) {
      return res.status(404).json({ error: "Assignment not found" });
    }

    // Update assignment
    const updateData: any = { status, updatedAt: new Date() };
    
    if (status === "picked_up") {
      updateData.actualPickupTime = new Date();
    } else if (status === "delivered") {
      updateData.actualDeliveryTime = new Date();
    }

    if (notes) {
      updateData.driverNotes = notes;
    }

    if (photos) {
      if (status === "picked_up") {
        updateData.pickupPhotos = photos;
      } else if (status === "delivered") {
        updateData.deliveryPhotos = photos;
      }
    }

    const [updatedAssignment] = await db
      .update(deliveryAssignments)
      .set(updateData)
      .where(eq(deliveryAssignments.id, id))
      .returning();

    // Create tracking event
    await db.insert(deliveryTrackingEvents).values({
      assignmentId: id,
      eventType: status,
      description: getStatusDescription(status),
      location: location || null,
      photos: photos || null,
      createdBy: req.user!.id,
    });

    res.json(updatedAssignment);
  } catch (error) {
    console.error("Error updating assignment status:", error);
    res.status(500).json({ error: "Failed to update assignment status" });
  }
});

// =============================================================================
// TRACKING & CUSTOMER ENDPOINTS
// =============================================================================

// Track delivery by tracking number
router.get("/track/:trackingNumber", async (req, res) => {
  try {
    const { trackingNumber } = req.params;

    const assignment = await db
      .select({
        assignment: deliveryAssignments,
        provider: {
          businessName: deliveryProviders.businessName,
          contactPhone: deliveryProviders.contactPhone,
        },
      })
      .from(deliveryAssignments)
      .leftJoin(deliveryProviders, eq(deliveryAssignments.providerId, deliveryProviders.id))
      .where(eq(deliveryAssignments.trackingNumber, trackingNumber))
      .limit(1);

    if (assignment.length === 0) {
      return res.status(404).json({ error: "Tracking number not found" });
    }

    // Get tracking events
    const trackingEvents = await db
      .select()
      .from(deliveryTrackingEvents)
      .where(eq(deliveryTrackingEvents.assignmentId, assignment[0].assignment.id))
      .orderBy(desc(deliveryTrackingEvents.timestamp));

    res.json({
      assignment: assignment[0].assignment,
      provider: assignment[0].provider,
      trackingEvents,
    });
  } catch (error) {
    console.error("Error tracking delivery:", error);
    res.status(500).json({ error: "Failed to track delivery" });
  }
});

// Get customer's delivery history
router.get("/customer/history", authenticateToken, async (req, res) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    const offset = (parseInt(page as string) - 1) * parseInt(limit as string);

    const deliveries = await db
      .select({
        assignment: deliveryAssignments,
        provider: {
          businessName: deliveryProviders.businessName,
          rating: deliveryProviders.rating,
        },
        order: {
          orderNumber: marketplaceOrders.orderNumber,
          total: marketplaceOrders.total,
        },
      })
      .from(deliveryAssignments)
      .leftJoin(deliveryProviders, eq(deliveryAssignments.providerId, deliveryProviders.id))
      .leftJoin(marketplaceOrders, eq(deliveryAssignments.orderId, marketplaceOrders.id))
      .where(eq(marketplaceOrders.buyerId, req.user!.id))
      .orderBy(desc(deliveryAssignments.createdAt))
      .limit(parseInt(limit as string))
      .offset(offset);

    res.json(deliveries);
  } catch (error) {
    console.error("Error fetching delivery history:", error);
    res.status(500).json({ error: "Failed to fetch delivery history" });
  }
});

// =============================================================================
// REVIEWS
// =============================================================================

// Create delivery review
router.post("/reviews", authenticateToken, async (req, res) => {
  try {
    const reviewData = {
      ...req.body,
      reviewerId: req.user!.id,
    };

    const validatedData = insertDeliveryReviewSchema.parse(reviewData);

    // Check if review already exists
    const existingReview = await db
      .select()
      .from(deliveryReviews)
      .where(
        and(
          eq(deliveryReviews.assignmentId, validatedData.assignmentId),
          eq(deliveryReviews.reviewerId, req.user!.id)
        )
      )
      .limit(1);

    if (existingReview.length > 0) {
      return res.status(400).json({ error: "Review already submitted" });
    }

    const [review] = await db
      .insert(deliveryReviews)
      .values(validatedData)
      .returning();

    // Update provider's rating
    await updateProviderRating(validatedData.providerId);

    res.status(201).json(review);
  } catch (error) {
    console.error("Error creating delivery review:", error);
    res.status(500).json({ error: "Failed to create delivery review" });
  }
});

// Get reviews for a provider
router.get("/providers/:providerId/reviews", async (req, res) => {
  try {
    const { providerId } = req.params;
    const { page = 1, limit = 20 } = req.query;
    const offset = (parseInt(page as string) - 1) * parseInt(limit as string);

    const reviews = await db
      .select({
        review: deliveryReviews,
        reviewer: {
          username: profiles.username,
          fullName: profiles.fullName,
          avatar: profiles.avatar,
        },
      })
      .from(deliveryReviews)
      .leftJoin(users, eq(deliveryReviews.reviewerId, users.id))
      .leftJoin(profiles, eq(users.id, profiles.userId))
      .where(eq(deliveryReviews.providerId, providerId))
      .orderBy(desc(deliveryReviews.createdAt))
      .limit(parseInt(limit as string))
      .offset(offset);

    res.json(reviews);
  } catch (error) {
    console.error("Error fetching provider reviews:", error);
    res.status(500).json({ error: "Failed to fetch provider reviews" });
  }
});

// =============================================================================
// HELPER FUNCTIONS
// =============================================================================

function generateTrackingNumber(): string {
  const prefix = "SC";
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `${prefix}${timestamp}${random}`;
}

function calculateDistance(pickup: any, delivery: any): number {
  // Simplified distance calculation - in production, use proper geospatial functions
  // or external APIs like Google Maps
  return Math.random() * 20 + 1; // Mock distance between 1-21 km
}

function calculateDeliveryFee(provider: any, distance: number, serviceType: string, packageDetails: any): number {
  let fee = provider.baseRate + (distance * provider.ratePerKm);
  
  if (serviceType === "express") {
    fee *= provider.expressMultiplier || 1.5;
  }
  
  if (packageDetails?.weight > 5) {
    fee += (packageDetails.weight - 5) * (provider.ratePerKg || 1);
  }
  
  return Math.round(fee * 100) / 100;
}

function getEstimatedDeliveryTime(provider: any, serviceType: string): number {
  // Return estimated delivery time in hours
  if (serviceType === "express") {
    return 2;
  } else if (serviceType === "same_day") {
    return 8;
  }
  return 24;
}

function getStatusDescription(status: string): string {
  const descriptions: { [key: string]: string } = {
    pending: "Delivery request created",
    accepted: "Delivery accepted by provider",
    picked_up: "Package picked up from sender",
    in_transit: "Package is on the way",
    delivered: "Package delivered successfully",
    failed: "Delivery failed",
    cancelled: "Delivery cancelled",
  };
  return descriptions[status] || "Status updated";
}

async function updateProviderRating(providerId: string) {
  try {
    const stats = await db
      .select({
        avgRating: sql<number>`AVG(${deliveryReviews.overallRating})`,
        reviewCount: sql<number>`COUNT(*)`,
      })
      .from(deliveryReviews)
      .where(eq(deliveryReviews.providerId, providerId));

    if (stats.length > 0 && stats[0].reviewCount > 0) {
      await db
        .update(deliveryProviders)
        .set({
          rating: Math.round(stats[0].avgRating * 100) / 100,
          reviewCount: stats[0].reviewCount,
          updatedAt: new Date(),
        })
        .where(eq(deliveryProviders.id, providerId));
    }
  } catch (error) {
    console.error("Error updating provider rating:", error);
  }
}

export default router;
