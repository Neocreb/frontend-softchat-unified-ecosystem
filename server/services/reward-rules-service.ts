import { eq, and } from "drizzle-orm";
import { db } from "../db";
import {
  rewardRules,
  type InsertRewardRule,
} from "../../shared/activity-economy-schema";

// =============================================================================
// DEFAULT REWARD RULES
// =============================================================================

export const DEFAULT_REWARD_RULES: InsertRewardRule[] = [
  // Social Activities
  {
    actionType: "sign_up",
    displayName: "Sign Up",
    description: "New user registration",
    baseSoftPoints: "10",
    baseWalletBonus: "0",
    currency: "USDT",
    dailyLimit: 1,
    minimumTrustScore: "0",
    decayEnabled: false,
    decayStart: 1,
    decayRate: "0",
    minMultiplier: "1",
    requiresModeration: false,
    qualityThreshold: "0",
    isActive: true,
  },
  {
    actionType: "daily_login",
    displayName: "Daily Login",
    description: "User logs in daily",
    baseSoftPoints: "2",
    baseWalletBonus: "0",
    currency: "USDT",
    dailyLimit: 1,
    minimumTrustScore: "0",
    decayEnabled: false,
    decayStart: 1,
    decayRate: "0",
    minMultiplier: "1",
    requiresModeration: false,
    qualityThreshold: "0",
    isActive: true,
  },
  {
    actionType: "complete_profile",
    displayName: "Complete Profile",
    description: "User completes their profile",
    baseSoftPoints: "5",
    baseWalletBonus: "0",
    currency: "USDT",
    dailyLimit: 1,
    minimumTrustScore: "0",
    decayEnabled: false,
    decayStart: 1,
    decayRate: "0",
    minMultiplier: "1",
    requiresModeration: false,
    qualityThreshold: "0",
    isActive: true,
  },
  {
    actionType: "post_content",
    displayName: "Create Post",
    description: "User creates a new post or reel",
    baseSoftPoints: "3",
    baseWalletBonus: "0",
    currency: "USDT",
    dailyLimit: null, // Removed daily limit
    minimumTrustScore: "20",
    decayEnabled: true,
    decayStart: 1, // Start decay after 1st post in time window
    decayRate: "0.3", // Faster decay to encourage quality over quantity
    minMultiplier: "0.1", // Lower minimum to discourage spam
    requiresModeration: true,
    qualityThreshold: "0.8",
    isActive: true,
  },
  {
    actionType: "like_post",
    displayName: "Like Post",
    description: "User likes a post",
    baseSoftPoints: "0.5",
    baseWalletBonus: "0",
    currency: "USDT",
    dailyLimit: 100,
    minimumTrustScore: "0",
    decayEnabled: true,
    decayStart: 20,
    decayRate: "0.1",
    minMultiplier: "0.1",
    requiresModeration: false,
    qualityThreshold: "0",
    isActive: true,
  },
  {
    actionType: "comment_post",
    displayName: "Comment on Post",
    description: "User comments on a post",
    baseSoftPoints: "1",
    baseWalletBonus: "0",
    currency: "USDT",
    dailyLimit: 50,
    minimumTrustScore: "10",
    decayEnabled: true,
    decayStart: 10,
    decayRate: "0.15",
    minMultiplier: "0.1",
    requiresModeration: false,
    qualityThreshold: "0.5",
    isActive: true,
  },
  {
    actionType: "share_content",
    displayName: "Share Content",
    description: "User shares content externally",
    baseSoftPoints: "1",
    baseWalletBonus: "0",
    currency: "USDT",
    dailyLimit: 5,
    minimumTrustScore: "30",
    decayEnabled: true,
    decayStart: 3,
    decayRate: "0.2",
    minMultiplier: "0.2",
    requiresModeration: true,
    qualityThreshold: "0.8",
    isActive: true,
  },
  {
    actionType: "receive_like",
    displayName: "Receive Like",
    description: "User's content receives a like",
    baseSoftPoints: "0.1",
    baseWalletBonus: "0",
    currency: "USDT",
    minimumTrustScore: "0",
    decayEnabled: false,
    decayStart: 1,
    decayRate: "0",
    minMultiplier: "1",
    requiresModeration: false,
    qualityThreshold: "0",
    isActive: true,
  },
  {
    actionType: "receive_comment",
    displayName: "Receive Comment",
    description: "User's content receives a comment",
    baseSoftPoints: "0.2",
    baseWalletBonus: "0",
    currency: "USDT",
    minimumTrustScore: "0",
    decayEnabled: false,
    decayStart: 1,
    decayRate: "0",
    minMultiplier: "1",
    requiresModeration: false,
    qualityThreshold: "0",
    isActive: true,
  },

  // Commercial Activities
  {
    actionType: "list_product",
    displayName: "List Product",
    description: "User lists a product for sale",
    baseSoftPoints: "2",
    baseWalletBonus: "0",
    currency: "USDT",
    dailyLimit: 3,
    minimumTrustScore: "40",
    decayEnabled: false,
    decayStart: 1,
    decayRate: "0",
    minMultiplier: "1",
    requiresModeration: true,
    qualityThreshold: "0.8",
    isActive: true,
  },
  {
    actionType: "purchase_product",
    displayName: "Purchase Product",
    description: "User makes a purchase",
    baseSoftPoints: "5",
    baseWalletBonus: "0.01",
    currency: "USDT",
    minimumValue: "1000", // ₦1,000 minimum
    minimumTrustScore: "30",
    decayEnabled: false,
    decayStart: 1,
    decayRate: "0",
    minMultiplier: "1",
    requiresModeration: false,
    qualityThreshold: "0",
    isActive: true,
  },
  {
    actionType: "sell_product",
    displayName: "Sell Product",
    description: "User successfully sells a product",
    baseSoftPoints: "10",
    baseWalletBonus: "0.001", // 10 SP per ₦1,000 sold
    currency: "USDT",
    minimumTrustScore: "40",
    decayEnabled: false,
    decayStart: 1,
    decayRate: "0",
    minMultiplier: "1",
    requiresModeration: false,
    qualityThreshold: "0",
    isActive: true,
  },

  // Freelance Activities
  {
    actionType: "bid_job",
    displayName: "Bid on Job",
    description: "User submits a job proposal",
    baseSoftPoints: "2", // Increased base reward
    baseWalletBonus: "0",
    currency: "USDT",
    dailyLimit: null, // Removed daily limit
    minimumTrustScore: "50",
    decayEnabled: true,
    decayStart: 1, // Start decay after 1st bid in time window
    decayRate: "0.2", // Moderate decay to encourage quality
    minMultiplier: "0.2",
    requiresModeration: false,
    qualityThreshold: "0.7",
    isActive: true,
  },
  {
    actionType: "complete_freelance_milestone",
    displayName: "Complete Freelance Milestone",
    description: "User completes a freelance milestone (payment required)",
    baseSoftPoints: "20", // Increased for completion rewards
    baseWalletBonus: "0.005", // 0.5% of milestone value as bonus
    currency: "USDT",
    minimumValue: "5000", // ₦5,000 minimum milestone value
    minimumTrustScore: "60",
    decayEnabled: false, // No decay for legitimate completions
    decayStart: 1,
    decayRate: "0",
    minMultiplier: "1",
    requiresModeration: true, // Require verification
    qualityThreshold: "0.8", // High quality threshold
    isActive: true,
  },
  {
    actionType: "hire_freelancer",
    displayName: "Hire Freelancer",
    description: "User hires a freelancer (contract confirmed)",
    baseSoftPoints: "8", // Increased for hiring action
    baseWalletBonus: "0",
    currency: "USDT",
    minimumTrustScore: "40",
    decayEnabled: false,
    decayStart: 1,
    decayRate: "0",
    minMultiplier: "1",
    requiresModeration: false,
    qualityThreshold: "0",
    isActive: true,
  },
  {
    actionType: "freelance_project_completion",
    displayName: "Complete Freelance Project",
    description: "User successfully completes entire freelance project",
    baseSoftPoints: "50", // High reward for project completion
    baseWalletBonus: "0.01", // 1% of project value
    currency: "USDT",
    minimumValue: "10000", // ₦10,000 minimum project value
    minimumTrustScore: "70",
    decayEnabled: false,
    decayStart: 1,
    decayRate: "0",
    minMultiplier: "1",
    requiresModeration: true,
    qualityThreshold: "0.9", // Very high quality threshold
    isActive: true,
  },

  // Crypto & Trading Activities
  {
    actionType: "p2p_trade",
    displayName: "P2P Trade",
    description: "User completes a P2P crypto trade (confirmed transaction)",
    baseSoftPoints: "8", // Increased base reward
    baseWalletBonus: "0.001", // 0.1% of trade value
    currency: "USDT",
    minimumValue: "10000", // ₦10,000 minimum trade value
    dailyLimit: null, // Removed daily limit for legitimate trades
    minimumTrustScore: "75", // Higher trust requirement
    decayEnabled: true, // Add decay for excessive trading
    decayStart: 1, // Start decay after 1st trade in time window
    decayRate: "0.15", // Moderate decay rate
    minMultiplier: "0.3", // Higher minimum to allow legitimate trading
    requiresModeration: true, // Require verification for large trades
    qualityThreshold: "0.8", // High quality threshold
    isActive: true,
  },
  {
    actionType: "p2p_trade_create_offer",
    displayName: "Create P2P Offer",
    description: "User creates a P2P trading offer",
    baseSoftPoints: "3",
    baseWalletBonus: "0",
    currency: "USDT",
    dailyLimit: null, // No limit on offer creation
    minimumTrustScore: "60",
    decayEnabled: true,
    decayStart: 2, // Allow 2 offers before decay
    decayRate: "0.2",
    minMultiplier: "0.2",
    requiresModeration: false,
    qualityThreshold: "0.6",
    isActive: true,
  },
  {
    actionType: "convert_crypto",
    displayName: "Convert Crypto",
    description: "User converts cryptocurrency",
    baseSoftPoints: "3", // Increased base reward
    baseWalletBonus: "0",
    currency: "USDT",
    dailyLimit: null, // No daily limit
    minimumTrustScore: "50",
    decayEnabled: true,
    decayStart: 1, // Start decay after 1st conversion
    decayRate: "0.15", // Moderate decay
    minMultiplier: "0.4", // Allow multiple conversions
    requiresModeration: false,
    qualityThreshold: "0",
    isActive: true,
  },
  {
    actionType: "crypto_deposit",
    displayName: "Crypto Deposit",
    description: "User deposits cryptocurrency to platform",
    baseSoftPoints: "5",
    baseWalletBonus: "0",
    currency: "USDT",
    minimumValue: "5000", // ₦5,000 minimum deposit
    minimumTrustScore: "40",
    decayEnabled: false, // No decay for deposits
    decayStart: 1,
    decayRate: "0",
    minMultiplier: "1",
    requiresModeration: false,
    qualityThreshold: "0",
    isActive: true,
  },
  {
    actionType: "crypto_withdrawal",
    displayName: "Crypto Withdrawal",
    description: "User withdraws cryptocurrency from platform",
    baseSoftPoints: "3",
    baseWalletBonus: "0",
    currency: "USDT",
    minimumValue: "5000", // ₦5,000 minimum withdrawal
    minimumTrustScore: "60", // Higher trust for withdrawals
    decayEnabled: false, // No decay for withdrawals
    decayStart: 1,
    decayRate: "0",
    minMultiplier: "1",
    requiresModeration: true, // Require verification
    qualityThreshold: "0",
    isActive: true,
  },

  // Referral Activities
  {
    actionType: "refer_user",
    displayName: "Refer User",
    description: "User successfully refers someone who completes 3 actions",
    baseSoftPoints: "25", // Significantly increased for quality referrals
    baseWalletBonus: "0.005", // 0.5% bonus for successful referrals
    currency: "USDT",
    minimumTrustScore: "40", // Higher trust requirement
    decayEnabled: true, // Add decay to prevent referral farms
    decayStart: 1,
    decayRate: "0.1", // Moderate decay
    minMultiplier: "0.3",
    requiresModeration: true, // Require verification of legitimate referrals
    qualityThreshold: "0.8", // High quality threshold
    isActive: true,
  },

  // Creator Economy Activities
  {
    actionType: "subscribe_creator",
    displayName: "Subscribe to Creator",
    description: "User subscribes to a creator",
    baseSoftPoints: "15", // Increased base reward
    baseWalletBonus: "0",
    currency: "USDT",
    minimumTrustScore: "20",
    decayEnabled: true, // Add decay for mass subscribing
    decayStart: 2, // Allow 2 subscriptions before decay
    decayRate: "0.1",
    minMultiplier: "0.4",
    requiresModeration: false,
    qualityThreshold: "0.5", // Moderate quality threshold
    isActive: true,
  },
  {
    actionType: "tip_creator",
    displayName: "Tip Creator",
    description: "User tips a creator",
    baseSoftPoints: "2", // Increased base reward
    baseWalletBonus: "0",
    currency: "USDT",
    minimumValue: "100", // ₦100 minimum tip
    dailyLimit: null, // Remove daily limit
    minimumTrustScore: "10",
    decayEnabled: true,
    decayStart: 1, // Start decay after 1st tip in time window
    decayRate: "0.1", // Moderate decay
    minMultiplier: "0.3",
    requiresModeration: false,
    qualityThreshold: "0",
    isActive: true,
  },
  {
    actionType: "create_content_premium",
    displayName: "Create Premium Content",
    description: "User creates premium/paid content",
    baseSoftPoints: "15",
    baseWalletBonus: "0.01", // 1% of content value
    currency: "USDT",
    minimumValue: "1000", // ₦1,000 minimum content value
    minimumTrustScore: "60",
    decayEnabled: false, // No decay for premium content
    decayStart: 1,
    decayRate: "0",
    minMultiplier: "1",
    requiresModeration: true, // Require content approval
    qualityThreshold: "0.9", // Very high quality threshold
    isActive: true,
  },
  {
    actionType: "live_stream_host",
    displayName: "Host Live Stream",
    description: "User hosts a live streaming session",
    baseSoftPoints: "10",
    baseWalletBonus: "0",
    currency: "USDT",
    minimumTrustScore: "50",
    decayEnabled: true,
    decayStart: 1,
    decayRate: "0.15",
    minMultiplier: "0.3",
    requiresModeration: false,
    qualityThreshold: "0.7",
    isActive: true,
  },
  {
    actionType: "community_moderation",
    displayName: "Community Moderation",
    description: "User performs community moderation actions",
    baseSoftPoints: "5",
    baseWalletBonus: "0",
    currency: "USDT",
    minimumTrustScore: "80", // Very high trust requirement
    decayEnabled: false, // No decay for moderation
    decayStart: 1,
    decayRate: "0",
    minMultiplier: "1",
    requiresModeration: false,
    qualityThreshold: "0.8",
    isActive: true,
  },
];

// =============================================================================
// REWARD RULES SERVICE
// =============================================================================

export class RewardRulesService {
  /**
   * Initialize default reward rules in the database
   */
  static async initializeDefaultRules(): Promise<void> {
    try {
      console.log("Initializing default reward rules...");

      for (const rule of DEFAULT_REWARD_RULES) {
        // Check if rule already exists
        const existing = await db
          .select()
          .from(rewardRules)
          .where(eq(rewardRules.actionType, rule.actionType))
          .limit(1);

        if (existing.length === 0) {
          await db.insert(rewardRules).values(rule);
          console.log(`Created reward rule for: ${rule.actionType}`);
        }
      }

      console.log("Default reward rules initialization complete");
    } catch (error) {
      console.error("Error initializing default reward rules:", error);
      throw error;
    }
  }

  /**
   * Get active reward rule for an action
   */
  static async getRewardRule(actionType: string): Promise<any | null> {
    try {
      const [rule] = await db
        .select()
        .from(rewardRules)
        .where(
          and(
            eq(rewardRules.actionType, actionType),
            eq(rewardRules.isActive, true),
          ),
        )
        .limit(1);

      return rule || null;
    } catch (error) {
      console.error(`Error getting reward rule for ${actionType}:`, error);
      return null;
    }
  }

  /**
   * Update reward rule
   */
  static async updateRewardRule(
    actionType: string,
    updates: Partial<InsertRewardRule>,
  ): Promise<boolean> {
    try {
      await db
        .update(rewardRules)
        .set({
          ...updates,
          updatedAt: new Date(),
        })
        .where(eq(rewardRules.actionType, actionType));

      console.log(`Updated reward rule for: ${actionType}`);
      return true;
    } catch (error) {
      console.error(`Error updating reward rule for ${actionType}:`, error);
      return false;
    }
  }

  /**
   * Toggle reward rule active status
   */
  static async toggleRewardRule(actionType: string): Promise<boolean> {
    try {
      const [rule] = await db
        .select()
        .from(rewardRules)
        .where(eq(rewardRules.actionType, actionType))
        .limit(1);

      if (!rule) {
        throw new Error(`Reward rule not found: ${actionType}`);
      }

      await db
        .update(rewardRules)
        .set({
          isActive: !rule.isActive,
          updatedAt: new Date(),
        })
        .where(eq(rewardRules.actionType, actionType));

      console.log(
        `Toggled reward rule ${actionType}: ${!rule.isActive ? "enabled" : "disabled"}`,
      );
      return true;
    } catch (error) {
      console.error(`Error toggling reward rule for ${actionType}:`, error);
      return false;
    }
  }

  /**
   * Get all reward rules
   */
  static async getAllRewardRules(): Promise<any[]> {
    try {
      return await db.select().from(rewardRules);
    } catch (error) {
      console.error("Error getting all reward rules:", error);
      return [];
    }
  }

  /**
   * Validate reward rule configuration
   */
  static validateRewardRule(rule: Partial<InsertRewardRule>): {
    valid: boolean;
    errors: string[];
  } {
    const errors: string[] = [];

    if (!rule.actionType) {
      errors.push("Action type is required");
    }

    if (!rule.displayName) {
      errors.push("Display name is required");
    }

    if (rule.baseSoftPoints && parseFloat(rule.baseSoftPoints) < 0) {
      errors.push("Base SoftPoints cannot be negative");
    }

    if (rule.baseWalletBonus && parseFloat(rule.baseWalletBonus) < 0) {
      errors.push("Base wallet bonus cannot be negative");
    }

    if (rule.dailyLimit && rule.dailyLimit < 0) {
      errors.push("Daily limit cannot be negative");
    }

    if (
      rule.minimumTrustScore &&
      (parseFloat(rule.minimumTrustScore) < 0 ||
        parseFloat(rule.minimumTrustScore) > 100)
    ) {
      errors.push("Minimum trust score must be between 0 and 100");
    }

    if (
      rule.decayRate &&
      (parseFloat(rule.decayRate) < 0 || parseFloat(rule.decayRate) > 1)
    ) {
      errors.push("Decay rate must be between 0 and 1");
    }

    if (
      rule.minMultiplier &&
      (parseFloat(rule.minMultiplier) < 0 || parseFloat(rule.minMultiplier) > 1)
    ) {
      errors.push("Minimum multiplier must be between 0 and 1");
    }

    if (
      rule.qualityThreshold &&
      (parseFloat(rule.qualityThreshold) < 0 ||
        parseFloat(rule.qualityThreshold) > 2)
    ) {
      errors.push("Quality threshold must be between 0 and 2");
    }

    return {
      valid: errors.length === 0,
      errors,
    };
  }
}
