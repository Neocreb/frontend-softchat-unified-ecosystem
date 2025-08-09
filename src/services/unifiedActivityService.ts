import { ActivityRewardService, ActivityRewardResponse } from './activityRewardService';
import { useNotification } from '@/hooks/use-notification';

export interface ActivityContext {
  source?: string;
  timeSpent?: number;
  metadata?: Record<string, any>;
}

export class UnifiedActivityService {
  
  // Social Media Activities
  static async trackLike(userId: string, postId: string, timeSpent?: number): Promise<ActivityRewardResponse> {
    return ActivityRewardService.logPostLiked(userId, postId, timeSpent);
  }

  static async trackComment(userId: string, postId: string, commentLength?: number): Promise<ActivityRewardResponse> {
    return ActivityRewardService.logComment(userId, postId, commentLength);
  }

  static async trackShare(userId: string, postId: string, shareType: string): Promise<ActivityRewardResponse> {
    return ActivityRewardService.logShare(userId, postId, shareType);
  }

  static async trackPost(userId: string, postId: string, metadata?: Record<string, any>): Promise<ActivityRewardResponse> {
    return ActivityRewardService.logPostCreated(userId, postId, metadata);
  }

  // Marketplace Activities
  static async trackProductPurchase(userId: string, productId: string, amount: number, metadata?: Record<string, any>): Promise<ActivityRewardResponse> {
    // Only award if payment is completed or this is a payment completion call
    if (!metadata?.paymentCompleted && !metadata?.paymentStatus) {
      return {
        success: false,
        status: "pending_payment",
        softPoints: 0,
        walletBonus: 0,
        newTrustScore: 0,
        riskScore: 0,
        message: "Reward pending payment completion"
      };
    }

    return ActivityRewardService.logPurchase(userId, productId, amount, metadata);
  }

  // New method for payment completion tracking
  static async trackPaymentCompletion(
    userId: string,
    productId: string,
    amount: number,
    paymentMethod: string,
    transactionId: string
  ): Promise<ActivityRewardResponse> {
    return this.trackProductPurchase(userId, productId, amount, {
      paymentCompleted: true,
      paymentStatus: 'completed',
      paymentMethod,
      transactionId,
      timestamp: new Date().toISOString()
    });
  }

  static async trackProductListing(userId: string, productId: string, metadata?: Record<string, any>): Promise<ActivityRewardResponse> {
    return ActivityRewardService.logActivity({
      userId,
      actionType: 'list_product',
      targetId: productId,
      targetType: 'product',
      metadata
    });
  }

  // Freelance Activities
  static async trackJobApplication(userId: string, jobId: string, metadata?: Record<string, any>): Promise<ActivityRewardResponse> {
    return ActivityRewardService.logActivity({
      userId,
      actionType: 'bid_job',
      targetId: jobId,
      targetType: 'job',
      metadata
    });
  }

  static async trackFreelancerHire(userId: string, freelancerId: string, metadata?: Record<string, any>): Promise<ActivityRewardResponse> {
    return ActivityRewardService.logActivity({
      userId,
      actionType: 'hire_freelancer',
      targetId: freelancerId,
      targetType: 'freelancer',
      metadata
    });
  }

  static async trackMilestoneComplete(userId: string, projectId: string, metadata?: Record<string, any>): Promise<ActivityRewardResponse> {
    return ActivityRewardService.logActivity({
      userId,
      actionType: 'complete_freelance_milestone',
      targetId: projectId,
      targetType: 'project',
      metadata
    });
  }

  // Community Activities
  static async trackEventJoin(userId: string, eventId: string, metadata?: Record<string, any>): Promise<ActivityRewardResponse> {
    return ActivityRewardService.logActivity({
      userId,
      actionType: 'join_community',
      targetId: eventId,
      targetType: 'event',
      metadata
    });
  }

  static async trackVideoWatch(userId: string, videoId: string, metadata?: Record<string, any>): Promise<ActivityRewardResponse> {
    return ActivityRewardService.logActivity({
      userId,
      actionType: 'watch_video',
      targetId: videoId,
      targetType: 'video',
      metadata
    });
  }

  static async trackCreatorSubscribe(userId: string, creatorId: string, metadata?: Record<string, any>): Promise<ActivityRewardResponse> {
    return ActivityRewardService.logActivity({
      userId,
      actionType: 'subscribe_creator',
      targetId: creatorId,
      targetType: 'creator',
      metadata
    });
  }

  static async trackCreatorTip(userId: string, creatorId: string, amount: number, metadata?: Record<string, any>): Promise<ActivityRewardResponse> {
    return ActivityRewardService.logActivity({
      userId,
      actionType: 'tip_creator',
      targetId: creatorId,
      targetType: 'creator',
      value: amount,
      metadata
    });
  }

  // Trading Activities
  static async trackCryptoTrade(userId: string, tradeId: string, amount: number, metadata?: Record<string, any>): Promise<ActivityRewardResponse> {
    return ActivityRewardService.logActivity({
      userId,
      actionType: 'p2p_trade',
      targetId: tradeId,
      targetType: 'trade',
      value: amount,
      metadata
    });
  }

  static async trackCryptoConversion(userId: string, conversionId: string, amount: number, metadata?: Record<string, any>): Promise<ActivityRewardResponse> {
    return ActivityRewardService.logActivity({
      userId,
      actionType: 'convert_crypto',
      targetId: conversionId,
      targetType: 'conversion',
      value: amount,
      metadata
    });
  }

  // Referral Activities
  static async trackReferral(userId: string, referralId: string, metadata?: Record<string, any>): Promise<ActivityRewardResponse> {
    return ActivityRewardService.logActivity({
      userId,
      actionType: 'refer_user',
      targetId: referralId,
      targetType: 'referral',
      metadata
    });
  }

  // Daily Activities
  static async trackDailyLogin(userId: string): Promise<ActivityRewardResponse> {
    return ActivityRewardService.logDailyLogin(userId);
  }

  static async trackProfileComplete(userId: string, metadata?: Record<string, any>): Promise<ActivityRewardResponse> {
    return ActivityRewardService.logActivity({
      userId,
      actionType: 'complete_profile',
      targetId: userId,
      targetType: 'profile',
      metadata
    });
  }

  // Challenge Activities
  static async trackChallengeParticipation(userId: string, challengeId: string, metadata?: Record<string, any>): Promise<ActivityRewardResponse> {
    return ActivityRewardService.logActivity({
      userId,
      actionType: 'participate_challenge',
      targetId: challengeId,
      targetType: 'challenge',
      metadata
    });
  }

  // Utility method to show reward notifications
  static showRewardNotification(reward: ActivityRewardResponse, customMessage?: string) {
    if (reward.success && reward.softPoints > 0) {
      // This would integrate with your notification system
      console.log(`🎉 +${reward.softPoints} SoftPoints earned! ${customMessage || reward.message}`);
      
      // You can integrate with react-hot-toast or your existing notification system
      // notification.success(`🎉 +${reward.softPoints} SoftPoints earned!`, {
      //   description: customMessage || reward.message
      // });
    }
  }

  // Bulk activity tracking for complex actions
  static async trackMultipleActivities(
    activities: Array<{
      userId: string;
      actionType: string;
      targetId?: string;
      targetType?: string;
      value?: number;
      metadata?: Record<string, any>;
    }>
  ): Promise<ActivityRewardResponse[]> {
    const results = await Promise.allSettled(
      activities.map(activity => ActivityRewardService.logActivity(activity))
    );

    return results.map(result => 
      result.status === 'fulfilled' 
        ? result.value 
        : {
            success: false,
            status: 'error',
            softPoints: 0,
            walletBonus: 0,
            newTrustScore: 0,
            riskScore: 0,
            message: 'Failed to track activity'
          }
    );
  }

  // Get activity summary for user
  static async getActivitySummary(userId: string, period: string = '7d') {
    return ActivityRewardService.getRewardSummary(period);
  }

  // Get activity history for user
  static async getActivityHistory(userId: string, page: number = 1, limit: number = 20) {
    return ActivityRewardService.getRewardHistory(page, limit);
  }
}

// Export commonly used functions for backward compatibility
export const {
  trackLike,
  trackComment,
  trackShare,
  trackPost,
  trackProductPurchase,
  trackJobApplication,
  trackFreelancerHire,
  trackEventJoin,
  trackVideoWatch,
  trackDailyLogin,
  showRewardNotification
} = UnifiedActivityService;
