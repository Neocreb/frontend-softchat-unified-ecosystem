import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import { eq, sql } from 'drizzle-orm';
import { referral_links, referral_events } from '../../shared/enhanced-schema.js';
import { users } from '../../shared/schema.js';
import { logger } from '../utils/logger.js';

// Initialize database connection
const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  throw new Error('DATABASE_URL environment variable is not set');
}

const sql_client = neon(connectionString);
const db = drizzle(sql_client);

export interface ShareResult {
  referrerCredit: number;
  refereeShare: number;
  sharePercentage: number;
  originalAmount: number;
}

/**
 * Process revenue sharing between referrer and referee
 * @param event - The referral event containing reward amount
 * @param referralLink - The referral link with revenue share percentage
 * @returns Promise<ShareResult> - Details of the sharing calculation
 */
export async function processRevenueShare(
  event: any,
  referralLink: any
): Promise<ShareResult> {
  const originalAmount = Number(event.reward_amount || 0);
  const sharePercentage = Number(referralLink.revenue_share_percentage || 0);
  
  if (sharePercentage <= 0 || !event.referee_id) {
    // No sharing, credit full amount to referrer
    return {
      referrerCredit: originalAmount,
      refereeShare: 0,
      sharePercentage: 0,
      originalAmount
    };
  }

  // Calculate share amounts with proper rounding
  const refereeShare = Math.round((originalAmount * sharePercentage) / 100 * 100) / 100;
  const referrerCredit = originalAmount - refereeShare;

  return {
    referrerCredit,
    refereeShare,
    sharePercentage,
    originalAmount
  };
}

/**
 * Credit revenue sharing rewards to both referrer and referee
 * @param event - The referral event
 * @param referralLink - The referral link
 * @returns Promise<boolean> - Success status
 */
export async function creditRevenueSharing(
  event: any,
  referralLink: any
): Promise<boolean> {
  try {
    const shareResult = await processRevenueShare(event, referralLink);
    
    if (shareResult.sharePercentage === 0) {
      // No sharing, credit full amount to referrer only
      await db.update(users)
        .set({
          points: sql`COALESCE(${users.points}, 0) + ${shareResult.referrerCredit}`,
          updated_at: new Date()
        })
        .where(eq(users.id, event.referrer_id));

      // Mark reward as claimed
      await db.update(referral_events)
        .set({
          is_reward_claimed: true,
          metadata: sql`jsonb_set(COALESCE(${referral_events.metadata}, '{}'::jsonb), '{validatedAt}', to_jsonb(now()::text)) || jsonb_build_object('validationPassed', true, 'refereeActive', true)`
        })
        .where(eq(referral_events.id, event.id));

      return true;
    }

    // Process sharing in a transaction
    await db.transaction(async (tx) => {
      // Credit referrer (after sharing)
      await tx.update(users)
        .set({
          points: sql`COALESCE(${users.points}, 0) + ${shareResult.referrerCredit}`,
          updated_at: new Date()
        })
        .where(eq(users.id, event.referrer_id));

      // Credit referee (their share)
      await tx.update(users)
        .set({
          points: sql`COALESCE(${users.points}, 0) + ${shareResult.refereeShare}`,
          updated_at: new Date()
        })
        .where(eq(users.id, event.referee_id));

      // Create a revenue share event for audit trail
      await tx.insert(referral_events).values({
        referral_link_id: event.referral_link_id,
        referrer_id: event.referrer_id,
        referee_id: event.referee_id,
        event_type: 'revenue_share',
        reward_amount: shareResult.refereeShare,
        reward_currency: event.reward_currency || 'SP',
        is_reward_claimed: true,
        metadata: {
          sourceEventId: event.id,
          sharePercentage: shareResult.sharePercentage,
          originalAmount: shareResult.originalAmount,
          referrerCredit: shareResult.referrerCredit,
          refereeShare: shareResult.refereeShare,
          timestamp: new Date().toISOString(),
          type: 'automatic_revenue_share'
        }
      });

      // Mark original event as processed with sharing details
      await tx.update(referral_events)
        .set({
          is_reward_claimed: true,
          metadata: sql`jsonb_set(COALESCE(${referral_events.metadata}, '{}'::jsonb), '{validatedAt}', to_jsonb(now()::text)) || jsonb_build_object('validationPassed', true, 'refereeActive', true, 'revenueShared', true, 'shareDetails', ${JSON.stringify(shareResult)}::jsonb)`
        })
        .where(eq(referral_events.id, event.id));
    });

    logger.info('Revenue sharing processed successfully', {
      eventId: event.id,
      referrerId: event.referrer_id,
      refereeId: event.referee_id,
      shareResult
    });

    return true;
  } catch (error) {
    logger.error('Error processing revenue sharing:', error);
    throw error;
  }
}

/**
 * Update revenue share percentage for a referral link
 * @param linkId - The referral link ID
 * @param userId - The user requesting the update (must be the link owner)
 * @param percentage - The new revenue share percentage (0-100)
 * @returns Promise<boolean> - Success status
 */
export async function updateRevenueSharePercentage(
  linkId: string,
  userId: string,
  percentage: number
): Promise<boolean> {
  try {
    // Validate percentage
    if (percentage < 0 || percentage > 100) {
      throw new Error('Revenue share percentage must be between 0 and 100');
    }

    // Verify the user owns this link
    const link = await db.select().from(referral_links)
      .where(eq(referral_links.id, linkId))
      .limit(1);

    if (link.length === 0) {
      throw new Error('Referral link not found');
    }

    if (link[0].referrer_id !== userId) {
      throw new Error('Unauthorized: You can only update your own referral links');
    }

    // Update the revenue share percentage
    await db.update(referral_links)
      .set({
        revenue_share_percentage: percentage,
        updated_at: new Date()
      })
      .where(eq(referral_links.id, linkId));

    logger.info('Revenue share percentage updated', {
      linkId,
      userId,
      oldPercentage: Number(link[0].revenue_share_percentage),
      newPercentage: percentage
    });

    return true;
  } catch (error) {
    logger.error('Error updating revenue share percentage:', error);
    throw error;
  }
}

/**
 * Get revenue sharing statistics for a user
 * @param userId - The user ID
 * @returns Promise<object> - Sharing statistics
 */
export async function getRevenueSharingStats(userId: string) {
  try {
    // Get sharing stats as a referrer (money shared to others)
    const sharedStats = await db.select({
      totalShared: sql`COALESCE(SUM(${referral_events.reward_amount}), 0)`,
      shareCount: sql`COUNT(*)`
    }).from(referral_events)
      .where(eq(referral_events.referrer_id, userId))
      .where(eq(referral_events.event_type, 'revenue_share'));

    // Get receiving stats as a referee (money received from referrers)
    const receivedStats = await db.select({
      totalReceived: sql`COALESCE(SUM(${referral_events.reward_amount}), 0)`,
      receiveCount: sql`COUNT(*)`
    }).from(referral_events)
      .where(eq(referral_events.referee_id, userId))
      .where(eq(referral_events.event_type, 'revenue_share'));

    // Get current sharing settings from active links
    const sharingSettings = await db.select({
      linkId: referral_links.id,
      revenueSharePercentage: referral_links.revenue_share_percentage,
      description: referral_links.description
    }).from(referral_links)
      .where(eq(referral_links.referrer_id, userId))
      .where(eq(referral_links.is_active, true));

    return {
      shared: {
        total: Number(sharedStats[0]?.totalShared || 0),
        count: Number(sharedStats[0]?.shareCount || 0)
      },
      received: {
        total: Number(receivedStats[0]?.totalReceived || 0),
        count: Number(receivedStats[0]?.receiveCount || 0)
      },
      settings: sharingSettings.map(setting => ({
        linkId: setting.linkId,
        revenueSharePercentage: Number(setting.revenueSharePercentage),
        description: setting.description
      }))
    };
  } catch (error) {
    logger.error('Error getting revenue sharing stats:', error);
    throw error;
  }
}
