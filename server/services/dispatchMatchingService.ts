import { eq, and, sql, desc, asc } from "drizzle-orm";
import { db } from "../db";
import { dispatchPartners, deliveryOrders } from "../../shared/dispatch-schema";
import { PartnerMatchingCriteria, DispatchPartner, LocationUpdate } from "../../types/dispatch";

interface DistanceCalculation {
  partnerId: string;
  distance: number;
  estimatedTime: number;
}

interface MatchingResult {
  partner: DispatchPartner;
  distance: number;
  estimatedTime: number;
  score: number;
  cost: number;
}

export class DispatchMatchingService {
  private static instance: DispatchMatchingService;

  static getInstance(): DispatchMatchingService {
    if (!DispatchMatchingService.instance) {
      DispatchMatchingService.instance = new DispatchMatchingService();
    }
    return DispatchMatchingService.instance;
  }

  /**
   * Calculate distance between two points using Haversine formula
   */
  private calculateDistance(
    lat1: number, lng1: number, 
    lat2: number, lng2: number
  ): number {
    const R = 6371; // Earth's radius in kilometers
    const dLat = this.degreesToRadians(lat2 - lat1);
    const dLng = this.degreesToRadians(lng2 - lng1);
    
    const a = 
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.degreesToRadians(lat1)) * 
      Math.cos(this.degreesToRadians(lat2)) * 
      Math.sin(dLng / 2) * Math.sin(dLng / 2);
    
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  private degreesToRadians(degrees: number): number {
    return degrees * (Math.PI / 180);
  }

  /**
   * Estimate delivery time based on distance and vehicle type
   */
  private estimateDeliveryTime(distance: number, vehicleType: string): number {
    const baseSpeedKmH: Record<string, number> = {
      bicycle: 15,
      motorcycle: 35,
      car: 25,
      van: 22,
      truck: 18,
    };

    const speed = baseSpeedKmH[vehicleType] || 25;
    const timeInHours = distance / speed;
    const timeInMinutes = timeInHours * 60;
    
    // Add buffer time for pickup/dropoff (10-15 minutes)
    return Math.round(timeInMinutes + 12);
  }

  /**
   * Calculate delivery cost based on distance, vehicle type, and priority
   */
  private calculateDeliveryCost(
    distance: number, 
    vehicleType: string, 
    priority: string
  ): number {
    const baseCost = 500; // Base cost in Naira
    const distanceCost = distance * 50; // Cost per km
    
    const vehicleMultiplier: Record<string, number> = {
      bicycle: 0.8,
      motorcycle: 1.0,
      car: 1.3,
      van: 1.6,
      truck: 2.0,
    };

    const priorityMultiplier: Record<string, number> = {
      standard: 1.0,
      express: 1.8,
      scheduled: 0.9,
    };

    const vehicleFactor = vehicleMultiplier[vehicleType] || 1.0;
    const priorityFactor = priorityMultiplier[priority] || 1.0;

    return Math.round((baseCost + distanceCost) * vehicleFactor * priorityFactor);
  }

  /**
   * Calculate matching score based on various factors
   */
  private calculateMatchingScore(
    partner: DispatchPartner,
    criteria: PartnerMatchingCriteria,
    distance: number
  ): number {
    let score = 0;

    // Distance score (closer is better, max 30 points)
    const maxDistance = criteria.maxDistance || 20;
    const distanceScore = Math.max(0, 30 - (distance / maxDistance) * 30);
    score += distanceScore;

    // Rating score (max 25 points)
    const ratingScore = (partner.averageRating / 5) * 25;
    score += ratingScore;

    // Experience score based on total deliveries (max 20 points)
    const experienceScore = Math.min(20, (partner.totalDeliveries / 100) * 20);
    score += experienceScore;

    // On-time delivery rate score (max 15 points)
    const onTimeScore = (partner.onTimeDeliveryRate / 100) * 15;
    score += onTimeScore;

    // Verification bonus (max 10 points)
    if (partner.isVerified) {
      const verificationBonus = partner.verificationLevel === "premium" ? 10 : 
                              partner.verificationLevel === "standard" ? 7 : 5;
      score += verificationBonus;
    }

    // Vehicle type preference bonus
    if (criteria.vehicleType && partner.vehicleType === criteria.vehicleType) {
      score += 5;
    }

    // Specialization bonus
    if (criteria.specializations && partner.specializations) {
      const matchingSpecs = criteria.specializations.filter(spec => 
        partner.specializations?.includes(spec)
      );
      score += matchingSpecs.length * 3;
    }

    // Online status bonus
    if (partner.isOnline) {
      score += 5;
    }

    return Math.round(score);
  }

  /**
   * Find the best matching partners for a delivery request
   */
  async findNearestPartners(
    criteria: PartnerMatchingCriteria
  ): Promise<MatchingResult[]> {
    try {
      // Get all active and online partners
      const partners = await db
        .select()
        .from(dispatchPartners)
        .where(and(
          eq(dispatchPartners.applicationStatus, "approved"),
          eq(dispatchPartners.isActive, true),
          eq(dispatchPartners.isOnline, true),
          sql`${dispatchPartners.averageRating} >= ${criteria.requiredRating || 4.0}`
        ));

      const results: MatchingResult[] = [];

      for (const partner of partners) {
        // Skip if no current location
        if (!partner.currentLocation) continue;

        // Calculate distance from partner to pickup location
        const distance = this.calculateDistance(
          partner.currentLocation.lat,
          partner.currentLocation.lng,
          criteria.location.lat,
          criteria.location.lng
        );

        // Skip if too far
        if (distance > (criteria.maxDistance || 20)) continue;

        // Skip if vehicle type doesn't match (if specified)
        if (criteria.vehicleType && partner.vehicleType !== criteria.vehicleType) continue;

        // Check if partner can handle the delivery type
        if (criteria.deliveryType && partner.serviceAreas) {
          const canDeliver = partner.serviceAreas.some(area => 
            area.radius >= distance
          );
          if (!canDeliver) continue;
        }

        // Calculate estimated delivery time
        const estimatedTime = this.estimateDeliveryTime(distance, partner.vehicleType);

        // Calculate matching score
        const score = this.calculateMatchingScore(partner, criteria, distance);

        // Calculate delivery cost
        const cost = this.calculateDeliveryCost(
          distance, 
          partner.vehicleType, 
          criteria.priority || "standard"
        );

        results.push({
          partner,
          distance,
          estimatedTime,
          score,
          cost,
        });
      }

      // Sort by score (highest first) and distance (closest first)
      results.sort((a, b) => {
        if (Math.abs(a.score - b.score) < 5) {
          return a.distance - b.distance; // If scores are close, prefer closer partner
        }
        return b.score - a.score; // Higher score first
      });

      return results.slice(0, 10); // Return top 10 matches
    } catch (error) {
      console.error("Error finding nearest partners:", error);
      throw new Error("Failed to find matching partners");
    }
  }

  /**
   * Check partner availability for a specific time slot
   */
  async checkPartnerAvailability(
    partnerId: string,
    timeSlot: { start: string; end: string }
  ): Promise<boolean> {
    try {
      // Check if partner exists and is active
      const partner = await db
        .select()
        .from(dispatchPartners)
        .where(and(
          eq(dispatchPartners.id, partnerId),
          eq(dispatchPartners.isActive, true)
        ))
        .limit(1);

      if (partner.length === 0) return false;

      // Check if partner has conflicting deliveries in the time slot
      const conflictingDeliveries = await db
        .select()
        .from(deliveryOrders)
        .where(and(
          eq(deliveryOrders.partnerId, partnerId),
          sql`${deliveryOrders.status} IN ('assigned', 'pickup_in_progress', 'picked_up', 'delivery_in_progress')`,
          sql`(
            (${deliveryOrders.pickupWindowStart} <= ${timeSlot.end} AND ${deliveryOrders.pickupWindowEnd} >= ${timeSlot.start}) OR
            (${deliveryOrders.deliveryWindowStart} <= ${timeSlot.end} AND ${deliveryOrders.deliveryWindowEnd} >= ${timeSlot.start})
          )`
        ));

      return conflictingDeliveries.length === 0;
    } catch (error) {
      console.error("Error checking partner availability:", error);
      return false;
    }
  }

  /**
   * Optimize delivery route for multiple deliveries
   */
  async optimizeDeliveryRoute(
    partnerId: string,
    deliveries: string[]
  ): Promise<{ optimizedOrder: string[]; totalDistance: number; estimatedTime: number }> {
    try {
      // Get partner location
      const partner = await db
        .select()
        .from(dispatchPartners)
        .where(eq(dispatchPartners.id, partnerId))
        .limit(1);

      if (partner.length === 0) {
        throw new Error("Partner not found");
      }

      // Get delivery orders
      const orders = await db
        .select()
        .from(deliveryOrders)
        .where(sql`${deliveryOrders.id} = ANY(${deliveries})`);

      if (orders.length === 0) {
        return { optimizedOrder: [], totalDistance: 0, estimatedTime: 0 };
      }

      // Simple nearest neighbor algorithm for route optimization
      // In production, use more sophisticated algorithms like genetic algorithm or Christofides algorithm
      const unvisited = [...orders];
      const optimizedOrder: string[] = [];
      let currentLocation = partner[0].currentLocation;
      let totalDistance = 0;

      while (unvisited.length > 0) {
        let nearestIndex = 0;
        let nearestDistance = Infinity;

        // Find nearest unvisited delivery
        for (let i = 0; i < unvisited.length; i++) {
          const order = unvisited[i];
          const pickupLocation = order.pickupLocation;
          
          if (pickupLocation && currentLocation) {
            const distance = this.calculateDistance(
              currentLocation.lat,
              currentLocation.lng,
              pickupLocation.lat,
              pickupLocation.lng
            );

            if (distance < nearestDistance) {
              nearestDistance = distance;
              nearestIndex = i;
            }
          }
        }

        // Add nearest delivery to route
        const nearestOrder = unvisited.splice(nearestIndex, 1)[0];
        optimizedOrder.push(nearestOrder.id);
        
        // Update current location to delivery location
        currentLocation = nearestOrder.deliveryLocation;
        totalDistance += nearestDistance;

        // Add distance from pickup to delivery
        if (nearestOrder.pickupLocation && nearestOrder.deliveryLocation) {
          const deliveryDistance = this.calculateDistance(
            nearestOrder.pickupLocation.lat,
            nearestOrder.pickupLocation.lng,
            nearestOrder.deliveryLocation.lat,
            nearestOrder.deliveryLocation.lng
          );
          totalDistance += deliveryDistance;
        }
      }

      // Estimate total time
      const estimatedTime = this.estimateDeliveryTime(
        totalDistance, 
        partner[0].vehicleType
      );

      return {
        optimizedOrder,
        totalDistance: Math.round(totalDistance * 100) / 100,
        estimatedTime,
      };
    } catch (error) {
      console.error("Error optimizing delivery route:", error);
      throw new Error("Failed to optimize delivery route");
    }
  }

  /**
   * Calculate dynamic pricing based on demand and availability
   */
  calculateDynamicPricing(
    basePrice: number,
    demand: number,
    availablePartners: number,
    priority: string,
    timeOfDay: number
  ): number {
    let multiplier = 1.0;

    // Demand factor (higher demand = higher price)
    const demandMultiplier = Math.min(2.0, 1 + (demand / 10));
    multiplier *= demandMultiplier;

    // Supply factor (fewer partners = higher price)
    const supplyMultiplier = Math.max(0.8, 2 - (availablePartners / 5));
    multiplier *= supplyMultiplier;

    // Priority factor
    const priorityMultipliers: Record<string, number> = {
      standard: 1.0,
      express: 1.8,
      scheduled: 0.9,
    };
    multiplier *= priorityMultipliers[priority] || 1.0;

    // Time of day factor (peak hours = higher price)
    const peakHours = [8, 9, 12, 13, 17, 18, 19]; // Rush hours
    if (peakHours.includes(timeOfDay)) {
      multiplier *= 1.2;
    }

    // Late night/early morning factor
    if (timeOfDay < 6 || timeOfDay > 22) {
      multiplier *= 1.5;
    }

    return Math.round(basePrice * multiplier);
  }

  /**
   * Update partner location in real-time
   */
  async updatePartnerLocation(locationUpdate: LocationUpdate): Promise<void> {
    try {
      await db
        .update(dispatchPartners)
        .set({
          currentLocation: locationUpdate.location,
          lastLocationUpdate: locationUpdate.timestamp,
          updatedAt: new Date().toISOString(),
        })
        .where(eq(dispatchPartners.id, locationUpdate.partnerId));
    } catch (error) {
      console.error("Error updating partner location:", error);
      throw new Error("Failed to update partner location");
    }
  }

  /**
   * Get real-time delivery statistics
   */
  async getDeliveryStatistics(): Promise<{
    activeDeliveries: number;
    onlinePartners: number;
    averageDeliveryTime: number;
    completionRate: number;
  }> {
    try {
      const activeDeliveries = await db
        .select({ count: sql<number>`COUNT(*)` })
        .from(deliveryOrders)
        .where(sql`${deliveryOrders.status} IN ('assigned', 'pickup_in_progress', 'picked_up', 'delivery_in_progress')`);

      const onlinePartners = await db
        .select({ count: sql<number>`COUNT(*)` })
        .from(dispatchPartners)
        .where(and(
          eq(dispatchPartners.isActive, true),
          eq(dispatchPartners.isOnline, true)
        ));

      const deliveryStats = await db
        .select({
          totalDeliveries: sql<number>`COUNT(*)`,
          completedDeliveries: sql<number>`COUNT(CASE WHEN status = 'delivered' THEN 1 END)`,
          averageTime: sql<number>`AVG(EXTRACT(EPOCH FROM (actual_delivery_time - created_at))/60)`,
        })
        .from(deliveryOrders)
        .where(sql`created_at >= NOW() - INTERVAL '7 days'`);

      const stats = deliveryStats[0];
      const completionRate = stats.totalDeliveries > 0 
        ? (stats.completedDeliveries / stats.totalDeliveries) * 100 
        : 0;

      return {
        activeDeliveries: activeDeliveries[0].count,
        onlinePartners: onlinePartners[0].count,
        averageDeliveryTime: Math.round(stats.averageTime || 0),
        completionRate: Math.round(completionRate * 100) / 100,
      };
    } catch (error) {
      console.error("Error getting delivery statistics:", error);
      throw new Error("Failed to get delivery statistics");
    }
  }
}

export default DispatchMatchingService;
