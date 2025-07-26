import { api } from "@/lib/api";

export interface BattleHighlight {
  id: string;
  battleId: string;
  title: string;
  description?: string;
  highlightType: "auto_generated" | "manual" | "user_requested";
  videoUrl: string;
  thumbnailUrl?: string;
  duration: number;
  startTime: number;
  endTime: number;
  featuredMoments: FeaturedMoment[];
  participants: string[];
  generatedBy: "ai" | "admin" | "user";
  generationAlgorithm?: string;
  confidence?: number;
  isPublic: boolean;
  allowSharing: boolean;
  tags: string[];
  viewCount: number;
  shareCount: number;
  likeCount: number;
  monetizationEnabled: boolean;
  revenueGenerated: number;
  status: "active" | "hidden" | "processing" | "failed";
  processingStatus?: "queued" | "processing" | "completed" | "failed";
  createdAt: string;
  updatedAt: string;
}

export interface FeaturedMoment {
  timestamp: number;
  type: "tip" | "reaction" | "combo" | "milestone" | "victory" | "entrance" | "celebration";
  description: string;
  intensity: number; // 1-10 scale
  participantId?: string;
  metadata?: {
    tipAmount?: number;
    reactionType?: string;
    comboCount?: number;
    milestoneValue?: number;
  };
}

export interface BattleReplay {
  id: string;
  battleId: string;
  title: string;
  description?: string;
  videoUrl: string;
  thumbnailUrl?: string;
  duration: number;
  participants: ReplayParticipant[];
  battleStats: BattleReplayStats;
  highlights: BattleHighlight[];
  chapters: ReplayChapter[];
  isPublic: boolean;
  viewCount: number;
  likeCount: number;
  shareCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface ReplayParticipant {
  id: string;
  username: string;
  displayName: string;
  avatar: string;
  finalScore: number;
  isWinner: boolean;
  totalTipsReceived: number;
  totalTipsSent: number;
  peakMoment?: {
    timestamp: number;
    description: string;
  };
}

export interface BattleReplayStats {
  totalTips: number;
  totalViewers: number;
  peakViewers: number;
  totalBets: number;
  totalMessages: number;
  engagementRate: number;
  averageViewTime: number;
  revenueGenerated: number;
  mostUsedReaction: string;
  biggestTip: {
    amount: number;
    sender: string;
    recipient: string;
    timestamp: number;
  };
}

export interface ReplayChapter {
  id: string;
  title: string;
  startTime: number;
  endTime: number;
  thumbnailUrl?: string;
  description?: string;
  keyMoments: string[];
}

export interface HighlightGenerationOptions {
  type: "auto" | "custom" | "tip_moments" | "victory_moments" | "engagement_peaks";
  title?: string;
  description?: string;
  startTime?: number;
  endTime?: number;
  maxDuration?: number;
  minIntensity?: number;
  focusParticipant?: string;
  includeAudio?: boolean;
  qualityLevel?: "low" | "medium" | "high" | "ultra";
  tags?: string[];
  isPublic?: boolean;
  allowSharing?: boolean;
  monetizationEnabled?: boolean;
}

export interface HighlightAnalytics {
  highlightId: string;
  views: number;
  uniqueViews: number;
  averageWatchTime: number;
  completionRate: number;
  shares: number;
  likes: number;
  comments: number;
  revenue: number;
  viewerRetention: number[];
  trafficSources: { source: string; count: number }[];
  demographics: {
    ageGroups: { group: string; percentage: number }[];
    genders: { gender: string; percentage: number }[];
    locations: { country: string; count: number }[];
  };
  engagementHeatmap: { timestamp: number; engagement: number }[];
}

class BattleHighlightsService {
  // Get highlights for a specific battle
  async getBattleHighlights(battleId: string): Promise<BattleHighlight[]> {
    try {
      const response = await api.get(`/api/battles/${battleId}/highlights`);
      return response.data;
    } catch (error: any) {
      console.error("Failed to fetch battle highlights:", error);
      throw new Error(error.response?.data?.message || "Failed to fetch highlights");
    }
  }
  
  // Get a specific highlight
  async getHighlight(highlightId: string): Promise<BattleHighlight> {
    try {
      const response = await api.get(`/api/highlights/${highlightId}`);
      return response.data;
    } catch (error: any) {
      console.error("Failed to fetch highlight:", error);
      throw new Error(error.response?.data?.message || "Failed to fetch highlight");
    }
  }
  
  // Generate highlights from a battle
  async generateHighlights(
    battleId: string,
    options: HighlightGenerationOptions
  ): Promise<{
    jobId: string;
    estimatedTime: number;
    status: string;
  }> {
    try {
      const response = await api.post(`/api/battles/${battleId}/generate-highlights`, options);
      return response.data;
    } catch (error: any) {
      console.error("Failed to generate highlights:", error);
      throw new Error(error.response?.data?.message || "Failed to generate highlights");
    }
  }
  
  // Check highlight generation status
  async getGenerationStatus(jobId: string): Promise<{
    status: "queued" | "processing" | "completed" | "failed";
    progress: number;
    estimatedTime?: number;
    highlights?: BattleHighlight[];
    error?: string;
  }> {
    try {
      const response = await api.get(`/api/highlight-generation/${jobId}`);
      return response.data;
    } catch (error: any) {
      console.error("Failed to get generation status:", error);
      throw new Error(error.response?.data?.message || "Failed to get status");
    }
  }
  
  // Create custom highlight
  async createCustomHighlight(data: {
    battleId: string;
    title: string;
    description?: string;
    startTime: number;
    endTime: number;
    tags?: string[];
    isPublic?: boolean;
    allowSharing?: boolean;
    monetizationEnabled?: boolean;
  }): Promise<BattleHighlight> {
    try {
      const response = await api.post("/api/highlights", data);
      return response.data;
    } catch (error: any) {
      console.error("Failed to create custom highlight:", error);
      throw new Error(error.response?.data?.message || "Failed to create highlight");
    }
  }
  
  // Update highlight
  async updateHighlight(
    highlightId: string,
    data: Partial<BattleHighlight>
  ): Promise<BattleHighlight> {
    try {
      const response = await api.patch(`/api/highlights/${highlightId}`, data);
      return response.data;
    } catch (error: any) {
      console.error("Failed to update highlight:", error);
      throw new Error(error.response?.data?.message || "Failed to update highlight");
    }
  }
  
  // Delete highlight
  async deleteHighlight(highlightId: string): Promise<void> {
    try {
      await api.delete(`/api/highlights/${highlightId}`);
    } catch (error: any) {
      console.error("Failed to delete highlight:", error);
      throw new Error(error.response?.data?.message || "Failed to delete highlight");
    }
  }
  
  // Like/unlike highlight
  async toggleLike(highlightId: string): Promise<{ liked: boolean; likeCount: number }> {
    try {
      const response = await api.post(`/api/highlights/${highlightId}/like`);
      return response.data;
    } catch (error: any) {
      console.error("Failed to toggle like:", error);
      throw new Error(error.response?.data?.message || "Failed to like highlight");
    }
  }
  
  // Share highlight
  async shareHighlight(highlightId: string, platform?: string): Promise<{ shareUrl: string }> {
    try {
      const response = await api.post(`/api/highlights/${highlightId}/share`, {
        platform,
      });
      return response.data;
    } catch (error: any) {
      console.error("Failed to share highlight:", error);
      throw new Error(error.response?.data?.message || "Failed to share highlight");
    }
  }
  
  // Get trending highlights
  async getTrendingHighlights(
    period: "1h" | "24h" | "7d" | "30d" = "24h",
    limit = 20
  ): Promise<BattleHighlight[]> {
    try {
      const response = await api.get("/api/highlights/trending", {
        params: { period, limit },
      });
      return response.data;
    } catch (error) {
      console.error("Failed to fetch trending highlights:", error);
      throw new Error("Failed to fetch trending highlights");
    }
  }
  
  // Get user's highlights
  async getUserHighlights(
    userId?: string,
    limit = 20,
    offset = 0
  ): Promise<{
    highlights: BattleHighlight[];
    total: number;
    hasMore: boolean;
  }> {
    try {
      const response = await api.get("/api/user/highlights", {
        params: { userId, limit, offset },
      });
      return response.data;
    } catch (error) {
      console.error("Failed to fetch user highlights:", error);
      throw new Error("Failed to fetch user highlights");
    }
  }
  
  // ===== BATTLE REPLAYS =====
  
  // Get battle replay
  async getBattleReplay(battleId: string): Promise<BattleReplay> {
    try {
      const response = await api.get(`/api/battles/${battleId}/replay`);
      return response.data;
    } catch (error: any) {
      console.error("Failed to fetch battle replay:", error);
      throw new Error(error.response?.data?.message || "Failed to fetch replay");
    }
  }
  
  // Generate battle replay
  async generateBattleReplay(
    battleId: string,
    options?: {
      includeHighlights?: boolean;
      qualityLevel?: "low" | "medium" | "high" | "ultra";
      maxDuration?: number;
      chaptersEnabled?: boolean;
    }
  ): Promise<{
    jobId: string;
    estimatedTime: number;
  }> {
    try {
      const response = await api.post(`/api/battles/${battleId}/generate-replay`, options);
      return response.data;
    } catch (error: any) {
      console.error("Failed to generate battle replay:", error);
      throw new Error(error.response?.data?.message || "Failed to generate replay");
    }
  }
  
  // Get popular replays
  async getPopularReplays(
    period: "1d" | "7d" | "30d" = "7d",
    limit = 10
  ): Promise<BattleReplay[]> {
    try {
      const response = await api.get("/api/replays/popular", {
        params: { period, limit },
      });
      return response.data;
    } catch (error) {
      console.error("Failed to fetch popular replays:", error);
      throw new Error("Failed to fetch popular replays");
    }
  }
  
  // ===== ANALYTICS =====
  
  // Get highlight analytics
  async getHighlightAnalytics(
    highlightId: string,
    period: "1d" | "7d" | "30d" = "7d"
  ): Promise<HighlightAnalytics> {
    try {
      const response = await api.get(`/api/highlights/${highlightId}/analytics`, {
        params: { period },
      });
      return response.data;
    } catch (error: any) {
      console.error("Failed to fetch highlight analytics:", error);
      throw new Error(error.response?.data?.message || "Failed to fetch analytics");
    }
  }
  
  // Get user's highlight performance summary
  async getUserHighlightStats(userId?: string): Promise<{
    totalHighlights: number;
    totalViews: number;
    totalShares: number;
    totalLikes: number;
    totalRevenue: number;
    averageViewTime: number;
    averageCompletionRate: number;
    mostPopularHighlight: BattleHighlight;
    recentPerformance: {
      date: string;
      views: number;
      revenue: number;
    }[];
  }> {
    try {
      const response = await api.get("/api/user/highlight-stats", {
        params: { userId },
      });
      return response.data;
    } catch (error) {
      console.error("Failed to fetch user highlight stats:", error);
      throw new Error("Failed to fetch highlight stats");
    }
  }
  
  // ===== UTILITY FUNCTIONS =====
  
  // Download highlight video
  async downloadHighlight(highlightId: string, quality?: "low" | "medium" | "high"): Promise<Blob> {
    try {
      const response = await api.get(`/api/highlights/${highlightId}/download`, {
        params: { quality },
        responseType: "blob",
      });
      return response.data;
    } catch (error: any) {
      console.error("Failed to download highlight:", error);
      throw new Error(error.response?.data?.message || "Failed to download highlight");
    }
  }
  
  // Report highlight
  async reportHighlight(
    highlightId: string,
    reason: string,
    description?: string
  ): Promise<void> {
    try {
      await api.post(`/api/highlights/${highlightId}/report`, {
        reason,
        description,
      });
    } catch (error: any) {
      console.error("Failed to report highlight:", error);
      throw new Error(error.response?.data?.message || "Failed to report highlight");
    }
  }
  
  // Get recommended highlights for user
  async getRecommendedHighlights(
    userId?: string,
    limit = 10
  ): Promise<BattleHighlight[]> {
    try {
      const response = await api.get("/api/highlights/recommended", {
        params: { userId, limit },
      });
      return response.data;
    } catch (error) {
      console.error("Failed to fetch recommended highlights:", error);
      throw new Error("Failed to fetch recommendations");
    }
  }
  
  // Search highlights
  async searchHighlights(
    query: string,
    filters?: {
      tags?: string[];
      participantId?: string;
      minDuration?: number;
      maxDuration?: number;
      dateRange?: { start: string; end: string };
      sortBy?: "relevance" | "views" | "likes" | "recent";
    },
    limit = 20,
    offset = 0
  ): Promise<{
    highlights: BattleHighlight[];
    total: number;
    hasMore: boolean;
  }> {
    try {
      const response = await api.get("/api/highlights/search", {
        params: { query, ...filters, limit, offset },
      });
      return response.data;
    } catch (error) {
      console.error("Failed to search highlights:", error);
      throw new Error("Failed to search highlights");
    }
  }
}

// Utility functions for highlight processing
export const HighlightUtils = {
  // Calculate highlight engagement score
  calculateEngagementScore(highlight: BattleHighlight): number {
    const viewWeight = 1;
    const likeWeight = 5;
    const shareWeight = 10;
    const revenueWeight = 0.1;
    
    const engagementScore = 
      (highlight.viewCount * viewWeight) +
      (highlight.likeCount * likeWeight) +
      (highlight.shareCount * shareWeight) +
      (highlight.revenueGenerated * revenueWeight);
    
    // Normalize based on age (newer highlights get a boost)
    const ageInDays = (Date.now() - new Date(highlight.createdAt).getTime()) / (1000 * 60 * 60 * 24);
    const ageFactor = Math.max(0.1, 1 - (ageInDays / 30)); // Decrease over 30 days
    
    return Math.round(engagementScore * ageFactor);
  },
  
  // Get optimal highlight duration based on content type
  getOptimalDuration(momentTypes: string[]): number {
    const durationMap: Record<string, number> = {
      tip: 10,
      reaction: 5,
      combo: 15,
      milestone: 12,
      victory: 20,
      entrance: 8,
      celebration: 15,
    };
    
    const baseDuration = momentTypes.reduce((sum, type) => {
      return sum + (durationMap[type] || 10);
    }, 0);
    
    // Cap between 5-60 seconds
    return Math.max(5, Math.min(60, baseDuration));
  },
  
  // Generate highlight title suggestions
  generateTitleSuggestions(moments: FeaturedMoment[], participants: string[]): string[] {
    const suggestions: string[] = [];
    
    if (moments.some(m => m.type === "combo")) {
      suggestions.push("Epic Tip Combo!", "Unstoppable Combo Streak", "Combo Master");
    }
    
    if (moments.some(m => m.type === "victory")) {
      suggestions.push("Victory Moment", "The Winning Play", "Champion's Glory");
    }
    
    if (moments.some(m => m.type === "milestone")) {
      suggestions.push("Milestone Achievement", "Breaking Records", "Historic Moment");
    }
    
    if (moments.length > 3) {
      suggestions.push("Highlight Reel", "Best Moments", "Action Packed");
    }
    
    const highIntensityMoments = moments.filter(m => m.intensity >= 8);
    if (highIntensityMoments.length > 0) {
      suggestions.push("Insane Moments", "Mind-Blowing Action", "Unbelievable Play");
    }
    
    return suggestions.slice(0, 5);
  },
  
  // Format duration for display
  formatDuration(seconds: number): string {
    if (seconds < 60) {
      return `${seconds}s`;
    } else {
      const minutes = Math.floor(seconds / 60);
      const remainingSeconds = seconds % 60;
      return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
    }
  },
  
  // Calculate video quality requirements
  calculateQualityRequirements(
    duration: number,
    expectedViews: number,
    monetizationEnabled: boolean
  ): {
    recommendedQuality: "low" | "medium" | "high" | "ultra";
    storageEstimate: number; // MB
    processingTime: number; // seconds
  } {
    let quality: "low" | "medium" | "high" | "ultra" = "medium";
    
    if (monetizationEnabled || expectedViews > 10000) {
      quality = "high";
    } else if (expectedViews > 1000) {
      quality = "medium";
    } else {
      quality = "low";
    }
    
    // Estimate storage (MB)
    const qualityMultipliers = { low: 1, medium: 2.5, high: 5, ultra: 8 };
    const storageEstimate = duration * qualityMultipliers[quality] * 0.5; // ~0.5MB per second for medium quality
    
    // Estimate processing time
    const processingTime = duration * (quality === "ultra" ? 3 : quality === "high" ? 2 : 1);
    
    return {
      recommendedQuality: quality,
      storageEstimate: Math.round(storageEstimate),
      processingTime,
    };
  },
  
  // Extract thumbnail from video at optimal timestamp
  getOptimalThumbnailTimestamp(moments: FeaturedMoment[], duration: number): number {
    if (moments.length === 0) {
      return duration * 0.3; // 30% through if no moments
    }
    
    // Find highest intensity moment
    const bestMoment = moments.reduce((best, current) => {
      return current.intensity > best.intensity ? current : best;
    });
    
    return bestMoment.timestamp;
  },
  
  // Validate highlight creation parameters
  validateHighlightCreation(options: HighlightGenerationOptions): {
    isValid: boolean;
    errors: string[];
  } {
    const errors: string[] = [];
    
    if (options.startTime !== undefined && options.endTime !== undefined) {
      if (options.startTime >= options.endTime) {
        errors.push("Start time must be before end time");
      }
      
      const duration = options.endTime - options.startTime;
      if (duration < 3) {
        errors.push("Highlight must be at least 3 seconds long");
      }
      
      if (duration > 300) {
        errors.push("Highlight cannot be longer than 5 minutes");
      }
    }
    
    if (options.title && options.title.length > 100) {
      errors.push("Title cannot exceed 100 characters");
    }
    
    if (options.description && options.description.length > 500) {
      errors.push("Description cannot exceed 500 characters");
    }
    
    if (options.tags && options.tags.length > 10) {
      errors.push("Cannot have more than 10 tags");
    }
    
    return {
      isValid: errors.length === 0,
      errors,
    };
  },
};

export default new BattleHighlightsService();
