import { useCallback } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { PlatformRewardIntegration } from "@/services/platformRewardIntegration";
import { ActivityRewardService } from "@/services/activityRewardService";

interface RewardHookOptions {
  showNotifications?: boolean;
  module?: string;
}

export const useRewardIntegration = (options: RewardHookOptions = {}) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const { showNotifications = true, module } = options;

  const showRewardNotification = useCallback(
    (reward: any, actionDescription: string) => {
      if (!showNotifications) return;

      if (reward.success && reward.softPoints > 0) {
        toast({
          title: "🎉 Reward Earned!",
          description: `+${reward.softPoints} SoftPoints for ${actionDescription}${
            reward.walletBonus > 0
              ? ` (+$${reward.walletBonus.toFixed(4)} bonus)`
              : ""
          }`,
        });
      }
    },
    [showNotifications, toast],
  );

  // =============================================================================
  // MARKETPLACE REWARDS
  // =============================================================================

  const trackPurchase = useCallback(
    async (params: {
      productId: string;
      sellerId: string;
      amount: number;
      category: string;
    }) => {
      if (!user?.id) return null;

      const result = await PlatformRewardIntegration.trackMarketplacePurchase({
        userId: user.id,
        ...params,
      });

      if (result?.buyerReward) {
        showRewardNotification(result.buyerReward, "making a purchase");
      }

      return result;
    },
    [user, showRewardNotification],
  );

  const trackProductListing = useCallback(
    async (params: { productId: string; category: string; price: number }) => {
      if (!user?.id) return null;

      const result = await PlatformRewardIntegration.trackProductListing({
        userId: user.id,
        ...params,
      });

      showRewardNotification(result, "listing a product");
      return result;
    },
    [user, showRewardNotification],
  );

  // =============================================================================
  // FREELANCE REWARDS
  // =============================================================================

  const trackJobPosting = useCallback(
    async (params: { jobId: string; budget: number; category: string }) => {
      if (!user?.id) return null;

      const result = await PlatformRewardIntegration.trackJobPosting({
        userId: user.id,
        ...params,
      });

      showRewardNotification(result, "posting a job");
      return result;
    },
    [user, showRewardNotification],
  );

  const trackJobBid = useCallback(
    async (params: { jobId: string; bidAmount: number; clientId: string }) => {
      if (!user?.id) return null;

      const result = await PlatformRewardIntegration.trackJobBid({
        userId: user.id,
        ...params,
      });

      showRewardNotification(result, "placing a bid");
      return result;
    },
    [user, showRewardNotification],
  );

  // =============================================================================
  // CRYPTO REWARDS
  // =============================================================================

  const trackCryptoTrade = useCallback(
    async (params: {
      tradeId: string;
      fromCurrency: string;
      toCurrency: string;
      amount: number;
      tradeType: "buy" | "sell" | "convert";
    }) => {
      if (!user?.id) return null;

      const result = await PlatformRewardIntegration.trackCryptoTrade({
        userId: user.id,
        ...params,
      });

      showRewardNotification(result, `${params.tradeType}ing crypto`);
      return result;
    },
    [user, showRewardNotification],
  );

  // =============================================================================
  // VIDEO/CONTENT REWARDS
  // =============================================================================

  const trackVideoCreation = useCallback(
    async (params: {
      videoId: string;
      duration: number;
      category: string;
      isLive?: boolean;
    }) => {
      if (!user?.id) return null;

      const result = await PlatformRewardIntegration.trackVideoCreation({
        userId: user.id,
        ...params,
      });

      showRewardNotification(
        result,
        params.isLive ? "starting a livestream" : "creating a video",
      );
      return result;
    },
    [user, showRewardNotification],
  );

  const trackVideoView = useCallback(
    async (params: {
      creatorId: string;
      videoId: string;
      watchTime: number;
      totalDuration: number;
    }) => {
      if (!user?.id) return null;

      const result = await PlatformRewardIntegration.trackVideoView({
        viewerId: user.id,
        ...params,
      });

      const watchPercentage = (params.watchTime / params.totalDuration) * 100;
      if (result?.viewerReward && watchPercentage > 50) {
        showRewardNotification(result.viewerReward, "watching a video");
      }

      return result;
    },
    [user, showRewardNotification],
  );

  // =============================================================================
  // SOCIAL REWARDS
  // =============================================================================

  const trackSubscription = useCallback(
    async (params: {
      creatorId: string;
      subscriptionType: "free" | "paid";
      amount?: number;
    }) => {
      if (!user?.id) return null;

      const result = await PlatformRewardIntegration.trackSubscription({
        subscriberId: user.id,
        ...params,
      });

      if (result?.subscriberReward) {
        showRewardNotification(
          result.subscriberReward,
          "subscribing to a creator",
        );
      }

      return result;
    },
    [user, showRewardNotification],
  );

  const trackTip = useCallback(
    async (params: {
      recipientId: string;
      targetId: string;
      targetType: string;
      amount: number;
      currency: string;
    }) => {
      if (!user?.id) return null;

      const result = await PlatformRewardIntegration.trackTip({
        tipperId: user.id,
        ...params,
      });

      if (result?.tipperReward) {
        showRewardNotification(result.tipperReward, "giving a tip");
      }

      return result;
    },
    [user, showRewardNotification],
  );

  // =============================================================================
  // GENERAL ACTIVITIES
  // =============================================================================

  const trackPostCreation = useCallback(
    async (postId: string, metadata?: any) => {
      if (!user?.id) return null;

      const result = await ActivityRewardService.logPostCreated(
        user.id,
        postId,
        metadata,
      );
      showRewardNotification(result, "creating a post");
      return result;
    },
    [user, showRewardNotification],
  );

  const trackLike = useCallback(
    async (targetId: string, timeSpent?: number) => {
      if (!user?.id) return null;

      const result = await ActivityRewardService.logPostLiked(
        user.id,
        targetId,
        timeSpent,
      );
      if (result.success && result.softPoints > 0) {
        showRewardNotification(result, "liking content");
      }
      return result;
    },
    [user, showRewardNotification],
  );

  const trackComment = useCallback(
    async (targetId: string, commentLength?: number) => {
      if (!user?.id) return null;

      const result = await ActivityRewardService.logComment(
        user.id,
        targetId,
        commentLength,
      );
      showRewardNotification(result, "commenting");
      return result;
    },
    [user, showRewardNotification],
  );

  const trackShare = useCallback(
    async (targetId: string, targetType: string) => {
      if (!user?.id) return null;

      const result = await ActivityRewardService.logShare(
        user.id,
        targetId,
        targetType,
      );
      showRewardNotification(result, "sharing content");
      return result;
    },
    [user, showRewardNotification],
  );

  const trackCommunityJoin = useCallback(
    async (params: { communityId: string; communityType: string }) => {
      if (!user?.id) return null;

      const result = await PlatformRewardIntegration.trackCommunityJoin({
        userId: user.id,
        ...params,
      });

      showRewardNotification(result, "joining a community");
      return result;
    },
    [user, showRewardNotification],
  );

  const trackProfileCompletion = useCallback(
    async (params: {
      completionPercentage: number;
      sectionsCompleted: string[];
    }) => {
      if (!user?.id) return null;

      const result = await PlatformRewardIntegration.trackProfileCompletion({
        userId: user.id,
        ...params,
      });

      if (result) {
        showRewardNotification(result, "completing your profile");
      }

      return result;
    },
    [user, showRewardNotification],
  );

  const trackDailyLogin = useCallback(async () => {
    if (!user?.id) return null;

    const result = await PlatformRewardIntegration.trackDailyLogin(user.id);

    if (result.success && result.softPoints > 0) {
      showRewardNotification(result, "daily login");
    }

    return result;
  }, [user, showRewardNotification]);

  // =============================================================================
  // BATCH OPERATIONS
  // =============================================================================

  const trackBatchActivities = useCallback(
    async (
      activities: Array<{
        actionType: string;
        targetId?: string;
        targetType?: string;
        value?: number;
        metadata?: any;
      }>,
    ) => {
      if (!user?.id) return [];

      const activitiesWithUser = activities.map((activity) => ({
        userId: user.id,
        ...activity,
      }));

      const results =
        await PlatformRewardIntegration.trackBatchActivities(
          activitiesWithUser,
        );

      // Show summary notification for batch activities
      const totalPoints = results.reduce(
        (sum, result) => sum + (result.softPoints || 0),
        0,
      );
      if (totalPoints > 0 && showNotifications) {
        toast({
          title: "🎉 Batch Rewards!",
          description: `+${totalPoints} SoftPoints for ${activities.length} activities`,
        });
      }

      return results;
    },
    [user, showNotifications, toast],
  );

  // =============================================================================
  // DATA FETCHING
  // =============================================================================

  const getModuleEarnings = useCallback(
    async (moduleType: string, timeRange: string = "7d") => {
      if (!user?.id) return null;
      return PlatformRewardIntegration.getModuleEarnings(
        user.id,
        moduleType,
        timeRange,
      );
    },
    [user],
  );

  const getActivitySummary = useCallback(async () => {
    if (!user?.id) return null;
    return PlatformRewardIntegration.getUserActivitySummary(user.id);
  }, [user]);

  // Return all tracking functions
  return {
    // Marketplace
    trackPurchase,
    trackProductListing,

    // Freelance
    trackJobPosting,
    trackJobBid,

    // Crypto
    trackCryptoTrade,

    // Video/Content
    trackVideoCreation,
    trackVideoView,

    // Social
    trackSubscription,
    trackTip,

    // General activities
    trackPostCreation,
    trackLike,
    trackComment,
    trackShare,
    trackCommunityJoin,
    trackProfileCompletion,
    trackDailyLogin,

    // Batch operations
    trackBatchActivities,

    // Data fetching
    getModuleEarnings,
    getActivitySummary,

    // User info
    isAuthenticated: !!user,
    userId: user?.id,
    module,
  };
};

// Convenience hooks for specific modules
export const useMarketplaceRewards = () =>
  useRewardIntegration({ module: "marketplace" });
export const useFreelanceRewards = () =>
  useRewardIntegration({ module: "freelance" });
export const useCryptoRewards = () =>
  useRewardIntegration({ module: "crypto" });
export const useVideoRewards = () => useRewardIntegration({ module: "video" });
export const useSocialRewards = () =>
  useRewardIntegration({ module: "social" });
