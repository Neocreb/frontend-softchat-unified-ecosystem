import express from "express";
import { z } from "zod";
import { eq, and, or, desc, asc, sql, like, inArray, count, gte, lte, isNull } from "drizzle-orm";
import { db } from "../db";
import {
  authenticateToken,
  requireRole,
  createRateLimitMiddleware,
  AppError,
} from "../config/security";
import { emailService } from "../services/emailService";
import {
  notifications,
  notificationSettings,
  pushSubscriptions,
  emailNotificationQueue,
  smsNotificationQueue,
  notificationTemplates,
  notificationBatches,
  realTimeNotifications,
  notificationAnalytics,
  userNotificationPreferences,
  notificationChannels,
  automatedNotifications,
  notificationSchedules,
  notificationGroups,
  inAppNotifications,
  systemAlerts,
  marketingNotifications,
  transactionalNotifications,
  emergencyAlerts,
  notificationDeliveryLog,
  webhookNotifications,
  notificationFilters,
  quietHours,
  notificationFrequencyLimits,
  smartNotifications,
  behaviorTriggeredNotifications,
  contextualNotifications,
  personalizedNotifications,
  notificationCampaigns,
  abTestNotifications,
  notificationSegmentation,
  geoTargetedNotifications,
  timeZoneNotifications,
  deviceSpecificNotifications,
  notificationRetry,
  deliveryFailures,
} from "../../shared/enhanced-schema";
import { users, profiles } from "../../shared/schema";

const router = express.Router();

// Rate limiters
const notificationLimiter = createRateLimitMiddleware(100);
const sendLimiter = createRateLimitMiddleware(20);
const subscribeLimiter = createRateLimitMiddleware(10);

// Validation schemas
const createNotificationSchema = z.object({
  userId: z.string().uuid(),
  type: z.enum([
    'like', 'comment', 'follow', 'mention', 'share', 'message',
    'order_update', 'payment', 'trade_update', 'price_alert',
    'job_application', 'project_update', 'milestone',
    'system', 'security', 'marketing', 'achievement',
    'community', 'live_stream', 'story_view', 'battle_invite'
  ]),
  title: z.string().min(1).max(100),
  message: z.string().min(1).max(500),
  data: z.record(z.any()).optional(),
  actionUrl: z.string().url().optional(),
  actionText: z.string().max(50).optional(),
  imageUrl: z.string().url().optional(),
  priority: z.enum(['low', 'medium', 'high', 'urgent']).default('medium'),
  channels: z.array(z.enum(['in_app', 'push', 'email', 'sms', 'webhook'])).default(['in_app']),
  scheduledFor: z.string().datetime().optional(),
  expiresAt: z.string().datetime().optional(),
  groupId: z.string().optional(),
  campaignId: z.string().optional(),
  segmentId: z.string().optional(),
  personalizedContent: z.record(z.any()).optional(),
});

const bulkNotificationSchema = z.object({
  userIds: z.array(z.string().uuid()).max(1000),
  type: z.string(),
  title: z.string().min(1).max(100),
  message: z.string().min(1).max(500),
  data: z.record(z.any()).optional(),
  actionUrl: z.string().url().optional(),
  channels: z.array(z.enum(['in_app', 'push', 'email', 'sms'])).default(['in_app']),
  scheduledFor: z.string().datetime().optional(),
  priority: z.enum(['low', 'medium', 'high', 'urgent']).default('medium'),
  segmentation: z.object({
    criteria: z.record(z.any()).optional(),
    excludeUserIds: z.array(z.string().uuid()).optional(),
  }).optional(),
});

const subscriptionSchema = z.object({
  endpoint: z.string().url(),
  keys: z.object({
    p256dh: z.string(),
    auth: z.string(),
  }),
  deviceInfo: z.object({
    userAgent: z.string(),
    platform: z.string(),
    deviceType: z.enum(['mobile', 'desktop', 'tablet']),
  }).optional(),
});

const preferencesSchema = z.object({
  emailNotifications: z.boolean().default(true),
  pushNotifications: z.boolean().default(true),
  smsNotifications: z.boolean().default(false),
  marketingEmails: z.boolean().default(true),
  productUpdates: z.boolean().default(true),
  socialActivity: z.boolean().default(true),
  tradingAlerts: z.boolean().default(true),
  orderUpdates: z.boolean().default(true),
  securityAlerts: z.boolean().default(true),
  communityUpdates: z.boolean().default(true),
  liveStreamAlerts: z.boolean().default(false),
  achievementNotifications: z.boolean().default(true),
  quietHours: z.object({
    enabled: z.boolean().default(false),
    startTime: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/),
    endTime: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/),
    timezone: z.string(),
  }).optional(),
  frequency: z.object({
    immediate: z.array(z.string()).default(['security', 'urgent']),
    hourly: z.array(z.string()).default(['social']),
    daily: z.array(z.string()).default(['marketing', 'updates']),
    weekly: z.array(z.string()).default(['summary']),
  }).optional(),
});

// =============================================================================
// NOTIFICATION MANAGEMENT
// =============================================================================

/**
 * POST /api/notifications/send
 * Send notification to user(s)
 */
router.post("/send", authenticateToken, sendLimiter, async (req, res, next) => {
  try {
    const senderId = req.user!.userId;
    const notificationData = createNotificationSchema.parse(req.body);

    // Check if user exists and preferences
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.id, notificationData.userId))
      .limit(1);

    if (!user) {
      throw new AppError("User not found", 404);
    }

    // Get user notification preferences
    const [preferences] = await db
      .select()
      .from(userNotificationPreferences)
      .where(eq(userNotificationPreferences.userId, notificationData.userId))
      .limit(1);

    // Check if user wants this type of notification
    if (preferences && !shouldSendNotification(notificationData.type, preferences)) {
      return res.json({
        success: true,
        skipped: true,
        reason: "User preferences disabled this notification type",
      });
    }

    // Check quiet hours
    if (preferences?.quietHours && isInQuietHours(preferences.quietHours)) {
      // Schedule for later if not urgent
      if (notificationData.priority !== 'urgent') {
        const scheduledTime = getNextDeliveryTime(preferences.quietHours);
        notificationData.scheduledFor = scheduledTime.toISOString();
      }
    }

    const [notification] = await db.transaction(async (tx) => {
      // Create base notification
      const [newNotification] = await tx
        .insert(notifications)
        .values({
          userId: notificationData.userId,
          senderId,
          type: notificationData.type,
          title: notificationData.title,
          message: notificationData.message,
          data: notificationData.data,
          actionUrl: notificationData.actionUrl,
          actionText: notificationData.actionText,
          imageUrl: notificationData.imageUrl,
          priority: notificationData.priority,
          channels: notificationData.channels,
          scheduledFor: notificationData.scheduledFor ? new Date(notificationData.scheduledFor) : null,
          expiresAt: notificationData.expiresAt ? new Date(notificationData.expiresAt) : null,
          groupId: notificationData.groupId,
          campaignId: notificationData.campaignId,
          status: notificationData.scheduledFor ? 'scheduled' : 'pending',
        })
        .returning();

      // Create in-app notification if requested
      if (notificationData.channels.includes('in_app')) {
        await tx.insert(inAppNotifications).values({
          notificationId: newNotification.id,
          userId: notificationData.userId,
          title: notificationData.title,
          message: notificationData.message,
          data: notificationData.data,
          actionUrl: notificationData.actionUrl,
          priority: notificationData.priority,
          isRead: false,
        });
      }

      // Queue for other channels if not scheduled
      if (!notificationData.scheduledFor) {
        if (notificationData.channels.includes('email') && preferences?.emailNotifications !== false) {
          await tx.insert(emailNotificationQueue).values({
            notificationId: newNotification.id,
            userId: notificationData.userId,
            to: user.email,
            subject: notificationData.title,
            template: getEmailTemplate(notificationData.type),
            data: {
              title: notificationData.title,
              message: notificationData.message,
              actionUrl: notificationData.actionUrl,
              actionText: notificationData.actionText,
              ...notificationData.data,
            },
            priority: notificationData.priority,
            status: 'queued',
          });
        }

        if (notificationData.channels.includes('push') && preferences?.pushNotifications !== false) {
          await queuePushNotification(tx, newNotification.id, notificationData);
        }

        if (notificationData.channels.includes('sms') && preferences?.smsNotifications === true) {
          await queueSMSNotification(tx, newNotification.id, notificationData, user);
        }
      }

      // Update analytics
      await tx.insert(notificationAnalytics).values({
        notificationId: newNotification.id,
        userId: notificationData.userId,
        type: notificationData.type,
        channels: notificationData.channels,
        priority: notificationData.priority,
        sent: !notificationData.scheduledFor,
        scheduled: !!notificationData.scheduledFor,
        metadata: {
          senderId,
          timestamp: new Date().toISOString(),
        },
      });

      return [newNotification];
    });

    // Send immediately if not scheduled
    if (!notificationData.scheduledFor) {
      setImmediate(async () => {
        await processNotificationDelivery(notification.id);
      });
    }

    res.status(201).json({
      success: true,
      notification: {
        id: notification.id,
        status: notification.status,
        scheduledFor: notification.scheduledFor,
        channels: notification.channels,
      },
      message: notificationData.scheduledFor ? 
        "Notification scheduled successfully" : 
        "Notification sent successfully",
    });
  } catch (error) {
    next(error);
  }
});

/**
 * POST /api/notifications/bulk-send
 * Send bulk notifications
 */
router.post("/bulk-send", authenticateToken, requireRole(['admin', 'marketing']), async (req, res, next) => {
  try {
    const senderId = req.user!.userId;
    const bulkData = bulkNotificationSchema.parse(req.body);

    // Apply segmentation if provided
    let targetUserIds = bulkData.userIds;
    if (bulkData.segmentation) {
      targetUserIds = await applySegmentation(bulkData.userIds, bulkData.segmentation);
    }

    // Create batch record
    const [batch] = await db
      .insert(notificationBatches)
      .values({
        senderId,
        type: bulkData.type,
        title: bulkData.title,
        message: bulkData.message,
        targetUserIds,
        channels: bulkData.channels,
        scheduledFor: bulkData.scheduledFor ? new Date(bulkData.scheduledFor) : null,
        priority: bulkData.priority,
        status: 'processing',
        totalRecipients: targetUserIds.length,
      })
      .returning();

    // Process notifications in background
    setImmediate(async () => {
      await processBulkNotifications(batch.id, {
        ...bulkData,
        userIds: targetUserIds,
        senderId,
      });
    });

    res.status(201).json({
      success: true,
      batchId: batch.id,
      totalRecipients: targetUserIds.length,
      message: "Bulk notification processing started",
    });
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/notifications
 * Get user's notifications
 */
router.get("/", authenticateToken, notificationLimiter, async (req, res, next) => {
  try {
    const userId = req.user!.userId;
    const { 
      type, 
      unreadOnly = false, 
      limit = 20, 
      offset = 0,
      priority,
      startDate,
      endDate 
    } = req.query;

    let query = db
      .select({
        id: inAppNotifications.id,
        title: inAppNotifications.title,
        message: inAppNotifications.message,
        data: inAppNotifications.data,
        actionUrl: inAppNotifications.actionUrl,
        priority: inAppNotifications.priority,
        isRead: inAppNotifications.isRead,
        createdAt: inAppNotifications.createdAt,
        readAt: inAppNotifications.readAt,
        type: notifications.type,
        imageUrl: notifications.imageUrl,
        actionText: notifications.actionText,
        sender: {
          id: profiles.userId,
          username: profiles.username,
          fullName: profiles.fullName,
          avatar: profiles.avatar,
        },
      })
      .from(inAppNotifications)
      .innerJoin(notifications, eq(notifications.id, inAppNotifications.notificationId))
      .leftJoin(profiles, eq(profiles.userId, notifications.senderId))
      .where(eq(inAppNotifications.userId, userId));

    // Apply filters
    const conditions = [eq(inAppNotifications.userId, userId)];

    if (type) {
      conditions.push(eq(notifications.type, type as string));
    }

    if (unreadOnly === 'true') {
      conditions.push(eq(inAppNotifications.isRead, false));
    }

    if (priority) {
      conditions.push(eq(inAppNotifications.priority, priority as string));
    }

    if (startDate) {
      conditions.push(gte(inAppNotifications.createdAt, new Date(startDate as string)));
    }

    if (endDate) {
      conditions.push(lte(inAppNotifications.createdAt, new Date(endDate as string)));
    }

    if (conditions.length > 1) {
      query = query.where(and(...conditions));
    }

    const notificationsList = await query
      .orderBy(desc(inAppNotifications.createdAt))
      .limit(parseInt(limit as string))
      .offset(parseInt(offset as string));

    // Get unread count
    const [unreadCount] = await db
      .select({ count: count() })
      .from(inAppNotifications)
      .where(
        and(
          eq(inAppNotifications.userId, userId),
          eq(inAppNotifications.isRead, false)
        )
      );

    res.json({
      success: true,
      notifications: notificationsList,
      unreadCount: unreadCount.count,
      pagination: {
        limit: parseInt(limit as string),
        offset: parseInt(offset as string),
        hasMore: notificationsList.length === parseInt(limit as string),
      },
    });
  } catch (error) {
    next(error);
  }
});

/**
 * PUT /api/notifications/:notificationId/read
 * Mark notification as read
 */
router.put("/:notificationId/read", authenticateToken, async (req, res, next) => {
  try {
    const userId = req.user!.userId;
    const { notificationId } = req.params;

    // Update notification as read
    const [updated] = await db
      .update(inAppNotifications)
      .set({
        isRead: true,
        readAt: new Date(),
      })
      .where(
        and(
          eq(inAppNotifications.id, notificationId),
          eq(inAppNotifications.userId, userId)
        )
      )
      .returning();

    if (!updated) {
      throw new AppError("Notification not found", 404);
    }

    // Update analytics
    await db
      .update(notificationAnalytics)
      .set({
        read: true,
        readAt: new Date(),
      })
      .where(eq(notificationAnalytics.notificationId, updated.notificationId));

    res.json({
      success: true,
      message: "Notification marked as read",
    });
  } catch (error) {
    next(error);
  }
});

/**
 * PUT /api/notifications/mark-all-read
 * Mark all notifications as read
 */
router.put("/mark-all-read", authenticateToken, async (req, res, next) => {
  try {
    const userId = req.user!.userId;

    const result = await db
      .update(inAppNotifications)
      .set({
        isRead: true,
        readAt: new Date(),
      })
      .where(
        and(
          eq(inAppNotifications.userId, userId),
          eq(inAppNotifications.isRead, false)
        )
      );

    res.json({
      success: true,
      message: "All notifications marked as read",
      updatedCount: result.rowCount || 0,
    });
  } catch (error) {
    next(error);
  }
});

// =============================================================================
// PUSH NOTIFICATION MANAGEMENT
// =============================================================================

/**
 * POST /api/notifications/subscribe-push
 * Subscribe to push notifications
 */
router.post("/subscribe-push", authenticateToken, subscribeLimiter, async (req, res, next) => {
  try {
    const userId = req.user!.userId;
    const subscriptionData = subscriptionSchema.parse(req.body);

    // Check if subscription already exists
    const [existing] = await db
      .select()
      .from(pushSubscriptions)
      .where(
        and(
          eq(pushSubscriptions.userId, userId),
          eq(pushSubscriptions.endpoint, subscriptionData.endpoint)
        )
      )
      .limit(1);

    if (existing) {
      // Update existing subscription
      await db
        .update(pushSubscriptions)
        .set({
          keys: subscriptionData.keys,
          deviceInfo: subscriptionData.deviceInfo,
          isActive: true,
          updatedAt: new Date(),
        })
        .where(eq(pushSubscriptions.id, existing.id));

      return res.json({
        success: true,
        subscriptionId: existing.id,
        message: "Push subscription updated",
      });
    }

    // Create new subscription
    const [subscription] = await db
      .insert(pushSubscriptions)
      .values({
        userId,
        endpoint: subscriptionData.endpoint,
        keys: subscriptionData.keys,
        deviceInfo: subscriptionData.deviceInfo,
        isActive: true,
      })
      .returning();

    res.status(201).json({
      success: true,
      subscriptionId: subscription.id,
      message: "Push subscription created",
    });
  } catch (error) {
    next(error);
  }
});

/**
 * DELETE /api/notifications/unsubscribe-push/:subscriptionId
 * Unsubscribe from push notifications
 */
router.delete("/unsubscribe-push/:subscriptionId", authenticateToken, async (req, res, next) => {
  try {
    const userId = req.user!.userId;
    const { subscriptionId } = req.params;

    await db
      .update(pushSubscriptions)
      .set({
        isActive: false,
        updatedAt: new Date(),
      })
      .where(
        and(
          eq(pushSubscriptions.id, subscriptionId),
          eq(pushSubscriptions.userId, userId)
        )
      );

    res.json({
      success: true,
      message: "Push subscription disabled",
    });
  } catch (error) {
    next(error);
  }
});

// =============================================================================
// NOTIFICATION PREFERENCES
// =============================================================================

/**
 * GET /api/notifications/preferences
 * Get user notification preferences
 */
router.get("/preferences", authenticateToken, async (req, res, next) => {
  try {
    const userId = req.user!.userId;

    const [preferences] = await db
      .select()
      .from(userNotificationPreferences)
      .where(eq(userNotificationPreferences.userId, userId))
      .limit(1);

    // Return default preferences if none exist
    const defaultPreferences = {
      emailNotifications: true,
      pushNotifications: true,
      smsNotifications: false,
      marketingEmails: true,
      productUpdates: true,
      socialActivity: true,
      tradingAlerts: true,
      orderUpdates: true,
      securityAlerts: true,
      communityUpdates: true,
      liveStreamAlerts: false,
      achievementNotifications: true,
    };

    res.json({
      success: true,
      preferences: preferences || defaultPreferences,
    });
  } catch (error) {
    next(error);
  }
});

/**
 * PUT /api/notifications/preferences
 * Update notification preferences
 */
router.put("/preferences", authenticateToken, async (req, res, next) => {
  try {
    const userId = req.user!.userId;
    const preferencesData = preferencesSchema.parse(req.body);

    // Upsert preferences
    await db
      .insert(userNotificationPreferences)
      .values({
        userId,
        ...preferencesData,
      })
      .onConflictDoUpdate({
        target: userNotificationPreferences.userId,
        set: {
          ...preferencesData,
          updatedAt: new Date(),
        },
      });

    res.json({
      success: true,
      message: "Notification preferences updated",
    });
  } catch (error) {
    next(error);
  }
});

// =============================================================================
// NOTIFICATION ANALYTICS
// =============================================================================

/**
 * GET /api/notifications/analytics
 * Get notification analytics (admin only)
 */
router.get("/analytics", authenticateToken, requireRole(['admin']), async (req, res, next) => {
  try {
    const { 
      startDate = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
      endDate = new Date().toISOString(),
      type,
      groupBy = 'day'
    } = req.query;

    const analytics = await db
      .select({
        date: sql<string>`DATE_TRUNC(${groupBy}, ${notificationAnalytics.createdAt})`,
        type: notificationAnalytics.type,
        totalSent: count(notificationAnalytics.id),
        totalRead: sql<number>`COUNT(CASE WHEN ${notificationAnalytics.read} THEN 1 END)`,
        totalClicked: sql<number>`COUNT(CASE WHEN ${notificationAnalytics.clicked} THEN 1 END)`,
        avgDeliveryTime: sql<number>`AVG(EXTRACT(EPOCH FROM (${notificationAnalytics.deliveredAt} - ${notificationAnalytics.createdAt})))`,
      })
      .from(notificationAnalytics)
      .where(
        and(
          gte(notificationAnalytics.createdAt, new Date(startDate as string)),
          lte(notificationAnalytics.createdAt, new Date(endDate as string)),
          type ? eq(notificationAnalytics.type, type as string) : undefined
        )
      )
      .groupBy(
        sql`DATE_TRUNC(${groupBy}, ${notificationAnalytics.createdAt})`,
        notificationAnalytics.type
      )
      .orderBy(sql`DATE_TRUNC(${groupBy}, ${notificationAnalytics.createdAt})`);

    res.json({
      success: true,
      analytics,
      summary: {
        totalSent: analytics.reduce((sum, item) => sum + item.totalSent, 0),
        totalRead: analytics.reduce((sum, item) => sum + item.totalRead, 0),
        totalClicked: analytics.reduce((sum, item) => sum + item.totalClicked, 0),
        readRate: analytics.length > 0 ? 
          analytics.reduce((sum, item) => sum + item.totalRead, 0) / 
          analytics.reduce((sum, item) => sum + item.totalSent, 0) * 100 : 0,
        clickRate: analytics.length > 0 ? 
          analytics.reduce((sum, item) => sum + item.totalClicked, 0) / 
          analytics.reduce((sum, item) => sum + item.totalSent, 0) * 100 : 0,
      },
    });
  } catch (error) {
    next(error);
  }
});

// =============================================================================
// HELPER FUNCTIONS
// =============================================================================

function shouldSendNotification(type: string, preferences: any): boolean {
  const typeMapping: Record<string, string[]> = {
    'like': ['socialActivity'],
    'comment': ['socialActivity'],
    'follow': ['socialActivity'],
    'mention': ['socialActivity'],
    'share': ['socialActivity'],
    'message': ['pushNotifications'],
    'order_update': ['orderUpdates'],
    'payment': ['orderUpdates'],
    'trade_update': ['tradingAlerts'],
    'price_alert': ['tradingAlerts'],
    'job_application': ['orderUpdates'],
    'project_update': ['orderUpdates'],
    'milestone': ['orderUpdates'],
    'system': ['productUpdates'],
    'security': ['securityAlerts'],
    'marketing': ['marketingEmails'],
    'achievement': ['achievementNotifications'],
    'community': ['communityUpdates'],
    'live_stream': ['liveStreamAlerts'],
  };

  const preferenceKeys = typeMapping[type] || ['pushNotifications'];
  return preferenceKeys.some(key => preferences[key] !== false);
}

function isInQuietHours(quietHours: any): boolean {
  if (!quietHours?.enabled) return false;
  
  const now = new Date();
  const currentTime = now.toTimeString().slice(0, 5);
  
  // Handle cross-midnight quiet hours
  if (quietHours.startTime > quietHours.endTime) {
    return currentTime >= quietHours.startTime || currentTime <= quietHours.endTime;
  }
  
  return currentTime >= quietHours.startTime && currentTime <= quietHours.endTime;
}

function getNextDeliveryTime(quietHours: any): Date {
  const now = new Date();
  const [endHour, endMinute] = quietHours.endTime.split(':').map(Number);
  
  const nextDelivery = new Date(now);
  nextDelivery.setHours(endHour, endMinute, 0, 0);
  
  // If end time is tomorrow (cross-midnight)
  if (quietHours.startTime > quietHours.endTime && now.getHours() < endHour) {
    // Already tomorrow, use current date
  } else if (nextDelivery <= now) {
    // Add a day if time has passed
    nextDelivery.setDate(nextDelivery.getDate() + 1);
  }
  
  return nextDelivery;
}

function getEmailTemplate(type: string): string {
  const templateMapping: Record<string, string> = {
    'like': 'social_engagement',
    'comment': 'social_engagement',
    'follow': 'social_follow',
    'order_update': 'order_status',
    'payment': 'payment_confirmation',
    'security': 'security_alert',
    'welcome': 'welcome_email',
    'achievement': 'achievement_earned',
  };
  
  return templateMapping[type] || 'generic_notification';
}

async function queuePushNotification(tx: any, notificationId: string, data: any) {
  // Implementation would queue push notification for processing
  console.log(`Queuing push notification ${notificationId}`);
}

async function queueSMSNotification(tx: any, notificationId: string, data: any, user: any) {
  // Implementation would queue SMS notification for processing
  console.log(`Queuing SMS notification ${notificationId} for ${user.phone}`);
}

async function processNotificationDelivery(notificationId: string) {
  // Background processing of notification delivery
  console.log(`Processing delivery for notification ${notificationId}`);
}

async function applySegmentation(userIds: string[], segmentation: any): Promise<string[]> {
  // Apply user segmentation logic
  return userIds;
}

async function processBulkNotifications(batchId: string, data: any) {
  // Process bulk notifications in background
  console.log(`Processing bulk notifications for batch ${batchId}`);
}

export default router;
