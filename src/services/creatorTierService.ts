import { api } from "@/lib/api";

export interface CreatorTier {
  id: string;
  userId: string;
  currentTier: "rising_star" | "pro_creator" | "legend";
  tierLevel: number;
  progressToNextTier: number;
  totalViews: number;
  duetsCreated: number;
  battlesWon: number;
  battlesParticipated: number;
  totalEarnings: number;
  followerCount: number;
  engagementRate: number;
  isVerified: boolean;
  hasBlueCheckmark: boolean;
  specialBadges: string[];
  benefits: any;
  softPointsBonus: number;
  prioritySupport: boolean;
  earlyAccess: boolean;
  previousTier?: string;
  tierUpgradeDate?: string;
  daysInCurrentTier: number;
  tierRewardsEarned: number;
  lifetimeRewards: number;
  nextTierRequirements: any;
  lastCalculatedAt: string;
  createdAt: string;
  updatedAt: string;
}

export interface DuetChallenge {
  id: string;
  title: string;
  description: string;
  hashtag: string;
  originalVideoId: string;
  createdBy: string;
  isActive: boolean;
  featuredOnHomepage: boolean;
  maxParticipants?: number;
  startDate: string;
  endDate: string;
  topParticipantReward: number;
  participationReward: number;
  currency: "SOFT_POINTS" | "USDT";
  bannerImage?: string;
  promoVideo?: string;
  totalParticipants: number;
  totalViews: number;
  totalEngagement: number;
  requiresApproval: boolean;
  moderatedBy?: string;
  createdAt: string;
  updatedAt: string;
  
  // Populated data
  originalVideo?: any;
  creator?: any;
  participants?: ChallengeParticipant[];
  leaderboard?: ChallengeParticipant[];
}

export interface ChallengeParticipant {
  id: string;
  challengeId: string;
  duetId: string;
  userId: string;
  viewCount: number;
  likeCount: number;
  engagementScore: number;
  currentRank?: number;
  bestRank?: number;
  rewardEarned: number;
  rewardPaid: boolean;
  status: "active" | "disqualified" | "winner";
  participatedAt: string;
  updatedAt: string;
  
  // Populated data
  user?: {
    id: string;
    username: string;
    displayName: string;
    avatar: string;
    isVerified: boolean;
  };
  duet?: any;
}

export interface TierUpgradeHistory {
  id: string;
  userId: string;
  fromTier?: string;
  toTier: string;
  upgradeReason?: string;
  metricsSnapshot: any;
  rewardAmount: number;
  rewardCurrency: string;
  specialRewards?: any;
  celebrationShown: boolean;
  celebrationData?: any;
  upgradedAt: string;
}

export interface TierBenefits {
  tier: "rising_star" | "pro_creator" | "legend";
  benefits: {
    softPointsMultiplier: number;
    maxDuetsPerHour: number;
    maxBattlesPerDay: number;
    prioritySupport: boolean;
    earlyAccess: boolean;
    customBadges: string[];
    monetizationAccess: boolean;
    advancedAnalytics: boolean;
    featuredContentBoost: boolean;
    exclusiveEvents: boolean;
  };
  requirements: {
    minViews: number;
    minDuets: number;
    minBattlesWon: number;
    minFollowers: number;
    minEngagementRate: number;
    minEarnings: number;
  };
  upgradeReward: {
    amount: number;
    currency: string;
    specialItems: string[];
  };
}

class CreatorTierService {
  // Get user's current tier status
  async getUserTier(userId?: string): Promise<CreatorTier> {
    try {
      const response = await api.get("/api/creator-tier", {
        params: { userId }
      });
      return response.data;
    } catch (error: any) {
      console.error("Failed to fetch user tier:", error);
      throw new Error(error.response?.data?.message || "Failed to fetch tier information");
    }
  }
  
  // Calculate and update user's tier
  async calculateUserTier(userId?: string): Promise<CreatorTier> {
    try {
      const response = await api.post("/api/creator-tier/calculate", {
        userId
      });
      return response.data;
    } catch (error: any) {
      console.error("Failed to calculate tier:", error);
      throw new Error(error.response?.data?.message || "Failed to calculate tier");
    }
  }
  
  // Get tier upgrade history
  async getTierUpgradeHistory(userId?: string): Promise<TierUpgradeHistory[]> {
    try {
      const response = await api.get("/api/creator-tier/history", {
        params: { userId }
      });
      return response.data;
    } catch (error) {
      console.error("Failed to fetch tier history:", error);
      throw new Error("Failed to fetch tier upgrade history");
    }
  }
  
  // Get all tier benefits information
  async getTierBenefits(): Promise<TierBenefits[]> {
    try {
      const response = await api.get("/api/creator-tier/benefits");
      return response.data;
    } catch (error) {
      console.error("Failed to fetch tier benefits:", error);
      throw new Error("Failed to fetch tier benefits");
    }
  }
  
  // Mark tier upgrade celebration as shown
  async markCelebrationShown(upgradeId: string): Promise<void> {
    try {
      await api.patch(`/api/creator-tier/celebration/${upgradeId}`);
    } catch (error: any) {
      console.error("Failed to mark celebration as shown:", error);
      throw new Error(error.response?.data?.message || "Failed to update celebration status");
    }
  }
  
  // Get leaderboard for creator tiers
  async getTierLeaderboard(
    tier?: "rising_star" | "pro_creator" | "legend",
    period: "daily" | "weekly" | "monthly" | "all_time" = "weekly",
    limit = 50
  ): Promise<{
    leaderboard: {
      userId: string;
      username: string;
      displayName: string;
      avatar: string;
      tier: string;
      tierLevel: number;
      totalViews: number;
      duetsCreated: number;
      battlesWon: number;
      totalEarnings: number;
      followerCount: number;
      rank: number;
    }[];
    userRank?: number;
  }> {
    try {
      const response = await api.get("/api/creator-tier/leaderboard", {
        params: { tier, period, limit }
      });
      return response.data;
    } catch (error) {
      console.error("Failed to fetch tier leaderboard:", error);
      throw new Error("Failed to fetch leaderboard");
    }
  }
  
  // ===== DUET CHALLENGES =====
  
  // Get active duet challenges
  async getActiveChallenges(limit = 20): Promise<DuetChallenge[]> {
    try {
      const response = await api.get("/api/duet-challenges", {
        params: { status: "active", limit }
      });
      return response.data;
    } catch (error) {
      console.error("Failed to fetch active challenges:", error);
      throw new Error("Failed to fetch challenges");
    }
  }
  
  // Get featured challenges for homepage
  async getFeaturedChallenges(limit = 5): Promise<DuetChallenge[]> {
    try {
      const response = await api.get("/api/duet-challenges/featured", {
        params: { limit }
      });
      return response.data;
    } catch (error) {
      console.error("Failed to fetch featured challenges:", error);
      throw new Error("Failed to fetch featured challenges");
    }
  }
  
  // Get challenge details with leaderboard
  async getChallenge(challengeId: string): Promise<DuetChallenge> {
    try {
      const response = await api.get(`/api/duet-challenges/${challengeId}`);
      return response.data;
    } catch (error: any) {
      console.error("Failed to fetch challenge:", error);
      throw new Error(error.response?.data?.message || "Failed to fetch challenge");
    }
  }
  
  // Join a duet challenge
  async joinChallenge(challengeId: string, duetId: string): Promise<ChallengeParticipant> {
    try {
      const response = await api.post(`/api/duet-challenges/${challengeId}/join`, {
        duetId
      });
      return response.data;
    } catch (error: any) {
      console.error("Failed to join challenge:", error);
      throw new Error(error.response?.data?.message || "Failed to join challenge");
    }
  }
  
  // Get challenge leaderboard
  async getChallengeLeaderboard(
    challengeId: string,
    limit = 50
  ): Promise<ChallengeParticipant[]> {
    try {
      const response = await api.get(`/api/duet-challenges/${challengeId}/leaderboard`, {
        params: { limit }
      });
      return response.data;
    } catch (error) {
      console.error("Failed to fetch challenge leaderboard:", error);
      throw new Error("Failed to fetch leaderboard");
    }
  }
  
  // Get user's challenge participation
  async getUserChallengeParticipation(
    challengeId: string,
    userId?: string
  ): Promise<ChallengeParticipant | null> {
    try {
      const response = await api.get(`/api/duet-challenges/${challengeId}/participation`, {
        params: { userId }
      });
      return response.data;
    } catch (error: any) {
      if (error.response?.status === 404) {
        return null; // User hasn't participated
      }
      console.error("Failed to fetch challenge participation:", error);
      throw new Error("Failed to fetch participation status");
    }
  }
  
  // Get user's challenge history
  async getUserChallengeHistory(
    userId?: string,
    limit = 20
  ): Promise<{
    participations: ChallengeParticipant[];
    stats: {
      totalChallengesJoined: number;
      challengesWon: number;
      totalRewardsEarned: number;
      bestRank: number;
      averageRank: number;
    };
  }> {
    try {
      const response = await api.get("/api/user/challenge-history", {
        params: { userId, limit }
      });
      return response.data;
    } catch (error) {
      console.error("Failed to fetch challenge history:", error);
      throw new Error("Failed to fetch challenge history");
    }
  }
  
  // Create a new duet challenge (admin only)
  async createChallenge(data: {
    title: string;
    description: string;
    hashtag: string;
    originalVideoId: string;
    startDate: string;
    endDate: string;
    topParticipantReward?: number;
    participationReward?: number;
    currency?: "SOFT_POINTS" | "USDT";
    maxParticipants?: number;
    featuredOnHomepage?: boolean;
    bannerImage?: string;
    promoVideo?: string;
    requiresApproval?: boolean;
  }): Promise<DuetChallenge> {
    try {
      const response = await api.post("/api/admin/duet-challenges", data);
      return response.data;
    } catch (error: any) {
      console.error("Failed to create challenge:", error);
      throw new Error(error.response?.data?.message || "Failed to create challenge");
    }
  }
  
  // Update challenge (admin only)
  async updateChallenge(
    challengeId: string,
    data: Partial<DuetChallenge>
  ): Promise<DuetChallenge> {
    try {
      const response = await api.patch(`/api/admin/duet-challenges/${challengeId}`, data);
      return response.data;
    } catch (error: any) {
      console.error("Failed to update challenge:", error);
      throw new Error(error.response?.data?.message || "Failed to update challenge");
    }
  }
  
  // End challenge and distribute rewards (admin only)
  async endChallenge(challengeId: string): Promise<{
    winners: ChallengeParticipant[];
    totalRewardsDistributed: number;
    participantsRewarded: number;
  }> {
    try {
      const response = await api.post(`/api/admin/duet-challenges/${challengeId}/end`);
      return response.data;
    } catch (error: any) {
      console.error("Failed to end challenge:", error);
      throw new Error(error.response?.data?.message || "Failed to end challenge");
    }
  }
  
  // Get challenge analytics (admin/creator)
  async getChallengeAnalytics(challengeId: string): Promise<{
    overview: {
      totalParticipants: number;
      totalViews: number;
      totalEngagement: number;
      averageEngagementPerParticipant: number;
      participationGrowth: number[];
    };
    demographics: {
      tierDistribution: { tier: string; count: number }[];
      geographicDistribution: { country: string; count: number }[];
      ageDistribution: { ageGroup: string; count: number }[];
    };
    performance: {
      topPerformers: ChallengeParticipant[];
      engagementTrends: number[];
      viralityScore: number;
      reachMultiplier: number;
    };
    revenue: {
      totalRewardsDistributed: number;
      platformFeesCollected: number;
      additionalRevenueGenerated: number;
    };
  }> {
    try {
      const response = await api.get(`/api/duet-challenges/${challengeId}/analytics`);
      return response.data;
    } catch (error) {
      console.error("Failed to fetch challenge analytics:", error);
      throw new Error("Failed to fetch analytics");
    }
  }
  
  // Report challenge or participant (moderation)
  async reportChallenge(
    challengeId: string,
    reason: string,
    description?: string
  ): Promise<void> {
    try {
      await api.post(`/api/duet-challenges/${challengeId}/report`, {
        reason,
        description
      });
    } catch (error: any) {
      console.error("Failed to report challenge:", error);
      throw new Error(error.response?.data?.message || "Failed to report challenge");
    }
  }
  
  // Search challenges
  async searchChallenges(
    query: string,
    filters?: {
      status?: "active" | "ended" | "upcoming";
      category?: string;
      minReward?: number;
      maxParticipants?: number;
    }
  ): Promise<DuetChallenge[]> {
    try {
      const response = await api.get("/api/duet-challenges/search", {
        params: { query, ...filters }
      });
      return response.data;
    } catch (error) {
      console.error("Failed to search challenges:", error);
      throw new Error("Failed to search challenges");
    }
  }
}

// Utility functions for tier and challenge management
export const CreatorTierUtils = {
  // Calculate tier progress percentage
  calculateTierProgress(currentMetrics: any, requirements: any): number {
    const progressFactors = [
      currentMetrics.totalViews / requirements.minViews,
      currentMetrics.duetsCreated / requirements.minDuets,
      currentMetrics.battlesWon / requirements.minBattlesWon,
      currentMetrics.followerCount / requirements.minFollowers,
      currentMetrics.engagementRate / requirements.minEngagementRate,
      currentMetrics.totalEarnings / requirements.minEarnings,
    ];
    
    const averageProgress = progressFactors.reduce((sum, factor) => sum + Math.min(1, factor), 0) / progressFactors.length;
    return Math.min(100, averageProgress * 100);
  },
  
  // Get tier color
  getTierColor(tier: string): string {
    switch (tier) {
      case "legend": return "#FFD700"; // Gold
      case "pro_creator": return "#9333EA"; // Purple
      case "rising_star": return "#3B82F6"; // Blue
      default: return "#6B7280"; // Gray
    }
  },
  
  // Get tier icon
  getTierIcon(tier: string): string {
    switch (tier) {
      case "legend": return "👑";
      case "pro_creator": return "⭐";
      case "rising_star": return "⚡";
      default: return "🔰";
    }
  },
  
  // Format tier display name
  formatTierName(tier: string): string {
    return tier.split("_").map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(" ");
  },
  
  // Calculate engagement score for challenges
  calculateEngagementScore(
    views: number,
    likes: number,
    comments: number,
    shares: number,
    participantFollowers: number
  ): number {
    const engagementRate = (likes + comments * 2 + shares * 3) / Math.max(views, 1);
    const reachScore = views / Math.max(participantFollowers, 1);
    const viralityBonus = shares > 50 ? Math.log(shares / 50) : 0;
    
    return Math.round((engagementRate * 100) + (reachScore * 50) + (viralityBonus * 25));
  },
  
  // Validate challenge creation
  validateChallengeCreation(data: {
    title: string;
    description: string;
    hashtag: string;
    startDate: string;
    endDate: string;
    originalVideoId: string;
  }): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];
    
    if (!data.title || data.title.length < 5) {
      errors.push("Title must be at least 5 characters long");
    }
    
    if (!data.description || data.description.length < 20) {
      errors.push("Description must be at least 20 characters long");
    }
    
    if (!data.hashtag || !data.hashtag.startsWith("#")) {
      errors.push("Hashtag must start with #");
    }
    
    if (data.hashtag && data.hashtag.includes(" ")) {
      errors.push("Hashtag cannot contain spaces");
    }
    
    const startDate = new Date(data.startDate);
    const endDate = new Date(data.endDate);
    const now = new Date();
    
    if (startDate <= now) {
      errors.push("Start date must be in the future");
    }
    
    if (endDate <= startDate) {
      errors.push("End date must be after start date");
    }
    
    const duration = endDate.getTime() - startDate.getTime();
    const maxDuration = 30 * 24 * 60 * 60 * 1000; // 30 days
    const minDuration = 24 * 60 * 60 * 1000; // 1 day
    
    if (duration > maxDuration) {
      errors.push("Challenge cannot last longer than 30 days");
    }
    
    if (duration < minDuration) {
      errors.push("Challenge must last at least 1 day");
    }
    
    return {
      isValid: errors.length === 0,
      errors,
    };
  },
  
  // Get recommended challenges for user
  getRecommendedChallenges(
    userTier: string,
    userInterests: string[],
    userSkillLevel: number,
    availableChallenges: DuetChallenge[]
  ): DuetChallenge[] {
    return availableChallenges
      .filter(challenge => {
        // Filter by user's skill level and tier
        const isAppropriateLevel = true; // Implement skill-based filtering
        const hasRelevantContent = userInterests.some(interest => 
          challenge.description.toLowerCase().includes(interest.toLowerCase()) ||
          challenge.hashtag.toLowerCase().includes(interest.toLowerCase())
        );
        
        return isAppropriateLevel && (hasRelevantContent || Math.random() > 0.7);
      })
      .sort((a, b) => {
        // Sort by relevance and potential rewards
        const aScore = (a.topParticipantReward || 0) + (a.totalParticipants * 0.1);
        const bScore = (b.topParticipantReward || 0) + (b.totalParticipants * 0.1);
        return bScore - aScore;
      })
      .slice(0, 10);
  },
  
  // Calculate tier upgrade requirements
  calculateUpgradeRequirements(
    currentTier: string,
    currentMetrics: any
  ): { [key: string]: { current: number; required: number; progress: number } } {
    const tierRequirements = {
      rising_star: {
        totalViews: 1000,
        duetsCreated: 5,
        battlesWon: 1,
        followerCount: 100,
        engagementRate: 2.0,
        totalEarnings: 100,
      },
      pro_creator: {
        totalViews: 10000,
        duetsCreated: 25,
        battlesWon: 10,
        followerCount: 1000,
        engagementRate: 5.0,
        totalEarnings: 1000,
      },
      legend: {
        totalViews: 100000,
        duetsCreated: 100,
        battlesWon: 50,
        followerCount: 10000,
        engagementRate: 10.0,
        totalEarnings: 10000,
      },
    };
    
    const nextTierRequirements = currentTier === "rising_star" ? tierRequirements.pro_creator :
                                currentTier === "pro_creator" ? tierRequirements.legend :
                                null;
    
    if (!nextTierRequirements) {
      return {}; // Already at max tier
    }
    
    const requirements: any = {};
    
    Object.keys(nextTierRequirements).forEach(key => {
      const required = (nextTierRequirements as any)[key];
      const current = currentMetrics[key] || 0;
      const progress = Math.min(100, (current / required) * 100);
      
      requirements[key] = {
        current,
        required,
        progress,
      };
    });
    
    return requirements;
  },
};

export default new CreatorTierService();
