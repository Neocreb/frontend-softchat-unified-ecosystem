import { api } from "@/lib/api";

export interface ContentModerationAction {
  id: string;
  contentType: "duet" | "battle" | "battle_message" | "highlight" | "comment" | "profile";
  contentId: string;
  contentOwnerId: string;
  action: "flag" | "remove" | "age_restrict" | "demonetize" | "ban_user" | "shadow_ban" | "warning";
  reason: string;
  description?: string;
  severity: "low" | "medium" | "high" | "critical";
  autoDetected: boolean;
  aiConfidence?: number;
  moderatorId?: string;
  moderatorType: "human" | "ai" | "community";
  appealable: boolean;
  appealSubmitted: boolean;
  appealedAt?: string;
  appealReason?: string;
  appealStatus?: "pending" | "approved" | "denied";
  status: "active" | "appealed" | "reversed" | "expired";
  expiresAt?: string;
  createdAt: string;
  updatedAt: string;
  
  // Populated data
  content?: any;
  contentOwner?: {
    id: string;
    username: string;
    displayName: string;
    avatar: string;
  };
  moderator?: {
    id: string;
    username: string;
    displayName: string;
  };
}

export interface UserBehaviorLog {
  id: string;
  userId: string;
  action: "duet_created" | "battle_joined" | "tip_sent" | "bet_placed" | "message_sent" | "content_shared" | "user_followed" | "content_liked";
  frequency: number;
  timeWindow: "minute" | "hour" | "day";
  hourlyCount: number;
  dailyCount: number;
  weeklyCount: number;
  suspiciousPattern: boolean;
  riskScore: number; // 0-100
  relatedContentId?: string;
  relatedUserId?: string;
  ipAddress?: string;
  userAgent?: string;
  deviceFingerprint?: string;
  metadata?: any;
  createdAt: string;
  windowStart: string;
  windowEnd?: string;
}

export interface RateLimitRule {
  id: string;
  actionType: "duet_creation" | "battle_participation" | "tip_sending" | "bet_placing" | "message_sending" | "content_sharing" | "user_following";
  userTier?: "rising_star" | "pro_creator" | "legend";
  maxPerMinute: number;
  maxPerHour: number;
  maxPerDay: number;
  maxPerWeek: number;
  trustedUserMultiplier: number;
  verifiedUserMultiplier: number;
  description?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface UserSuspension {
  id: string;
  userId: string;
  type: "warning" | "temporary" | "permanent" | "shadow_ban";
  reason: string;
  description?: string;
  duration?: number; // Days for temporary suspension
  expiresAt?: string;
  restrictions: {
    canCreateContent: boolean;
    canJoinBattles: boolean;
    canSendTips: boolean;
    canPlaceBets: boolean;
    canSendMessages: boolean;
    canFollowUsers: boolean;
    canComment: boolean;
    canShare: boolean;
  };
  suspendedBy: string;
  adminNotes?: string;
  isActive: boolean;
  liftedBy?: string;
  liftedAt?: string;
  liftReason?: string;
  appealCount: number;
  createdAt: string;
  updatedAt: string;
  
  // Populated data
  user?: {
    id: string;
    username: string;
    displayName: string;
    avatar: string;
  };
  suspendedByUser?: {
    id: string;
    username: string;
    displayName: string;
  };
}

export interface ContentReport {
  id: string;
  reporterId: string;
  contentType: "duet" | "battle" | "highlight" | "comment" | "profile" | "message";
  contentId: string;
  contentOwnerId: string;
  reason: "spam" | "harassment" | "inappropriate" | "fraud" | "copyright" | "violence" | "hate_speech" | "misinformation" | "other";
  description?: string;
  evidence?: string[]; // URLs to screenshots, etc.
  status: "pending" | "reviewing" | "resolved" | "dismissed";
  priority: "low" | "medium" | "high" | "urgent";
  assignedTo?: string;
  reviewedBy?: string;
  reviewNotes?: string;
  resolution?: string;
  actionTaken?: string;
  reviewedAt?: string;
  resolvedAt?: string;
  createdAt: string;
  updatedAt: string;
  
  // Populated data
  reporter?: {
    id: string;
    username: string;
    displayName: string;
    avatar: string;
  };
  contentOwner?: {
    id: string;
    username: string;
    displayName: string;
    avatar: string;
  };
  content?: any;
}

export interface TrustScore {
  userId: string;
  overallScore: number; // 0-100
  factors: {
    accountAge: number;
    verificationStatus: number;
    communityStanding: number;
    contentQuality: number;
    engagementHistory: number;
    reportHistory: number;
    behaviorPattern: number;
  };
  riskLevel: "very_low" | "low" | "medium" | "high" | "very_high";
  restrictions: string[];
  lastCalculatedAt: string;
  history: {
    date: string;
    score: number;
    reason?: string;
  }[];
}

export interface AIContentAnalysis {
  contentId: string;
  contentType: string;
  analysisResults: {
    toxicity: { score: number; confidence: number };
    spam: { score: number; confidence: number };
    harassment: { score: number; confidence: number };
    inappropriate: { score: number; confidence: number };
    copyright: { score: number; confidence: number };
    violence: { score: number; confidence: number };
    hateSpeech: { score: number; confidence: number };
  };
  overallRiskScore: number;
  recommendedAction: "approve" | "flag" | "remove" | "review";
  confidence: number;
  flags: string[];
  analyzedAt: string;
}

class AbusePreventionService {
  // ===== CONTENT MODERATION =====
  
  // Report content
  async reportContent(data: {
    contentType: "duet" | "battle" | "highlight" | "comment" | "profile" | "message";
    contentId: string;
    reason: string;
    description?: string;
    evidence?: string[];
  }): Promise<ContentReport> {
    try {
      const response = await api.post("/api/moderation/report", data);
      return response.data;
    } catch (error: any) {
      console.error("Failed to report content:", error);
      throw new Error(error.response?.data?.message || "Failed to report content");
    }
  }
  
  // Get user's reports
  async getUserReports(
    userId?: string,
    status?: "pending" | "reviewing" | "resolved" | "dismissed"
  ): Promise<ContentReport[]> {
    try {
      const response = await api.get("/api/user/reports", {
        params: { userId, status }
      });
      return response.data;
    } catch (error) {
      console.error("Failed to fetch user reports:", error);
      throw new Error("Failed to fetch reports");
    }
  }
  
  // Appeal a moderation action
  async appealModerationAction(
    actionId: string,
    reason: string,
    evidence?: string[]
  ): Promise<void> {
    try {
      await api.post(`/api/moderation/actions/${actionId}/appeal`, {
        reason,
        evidence
      });
    } catch (error: any) {
      console.error("Failed to appeal moderation action:", error);
      throw new Error(error.response?.data?.message || "Failed to submit appeal");
    }
  }
  
  // Get moderation actions for user
  async getUserModerationActions(userId?: string): Promise<ContentModerationAction[]> {
    try {
      const response = await api.get("/api/user/moderation-actions", {
        params: { userId }
      });
      return response.data;
    } catch (error) {
      console.error("Failed to fetch moderation actions:", error);
      throw new Error("Failed to fetch moderation actions");
    }
  }
  
  // ===== RATE LIMITING =====
  
  // Check rate limits for an action
  async checkRateLimit(
    action: string,
    userId?: string
  ): Promise<{
    allowed: boolean;
    remaining: number;
    resetTime: string;
    limitType: string;
  }> {
    try {
      const response = await api.get("/api/rate-limit/check", {
        params: { action, userId }
      });
      return response.data;
    } catch (error: any) {
      console.error("Failed to check rate limit:", error);
      throw new Error(error.response?.data?.message || "Failed to check rate limit");
    }
  }
  
  // Record user action for rate limiting
  async recordUserAction(
    action: string,
    metadata?: any
  ): Promise<void> {
    try {
      await api.post("/api/user/actions", { action, metadata });
    } catch (error: any) {
      console.error("Failed to record user action:", error);
      // Don't throw error for logging failures
    }
  }
  
  // Get rate limit rules
  async getRateLimitRules(): Promise<RateLimitRule[]> {
    try {
      const response = await api.get("/api/rate-limit/rules");
      return response.data;
    } catch (error) {
      console.error("Failed to fetch rate limit rules:", error);
      throw new Error("Failed to fetch rate limit rules");
    }
  }
  
  // ===== USER BEHAVIOR MONITORING =====
  
  // Get user behavior analysis
  async getUserBehaviorAnalysis(
    userId?: string,
    timeframe: "1h" | "24h" | "7d" | "30d" = "24h"
  ): Promise<{
    riskScore: number;
    riskLevel: "very_low" | "low" | "medium" | "high" | "very_high";
    suspiciousPatterns: string[];
    actionFrequency: { action: string; count: number; trend: "increasing" | "stable" | "decreasing" }[];
    recommendations: string[];
  }> {
    try {
      const response = await api.get("/api/user/behavior-analysis", {
        params: { userId, timeframe }
      });
      return response.data;
    } catch (error) {
      console.error("Failed to fetch behavior analysis:", error);
      throw new Error("Failed to fetch behavior analysis");
    }
  }
  
  // Get user trust score
  async getUserTrustScore(userId?: string): Promise<TrustScore> {
    try {
      const response = await api.get("/api/user/trust-score", {
        params: { userId }
      });
      return response.data;
    } catch (error) {
      console.error("Failed to fetch trust score:", error);
      throw new Error("Failed to fetch trust score");
    }
  }
  
  // ===== SUSPENSIONS & RESTRICTIONS =====
  
  // Get user suspensions
  async getUserSuspensions(
    userId?: string,
    includeExpired = false
  ): Promise<UserSuspension[]> {
    try {
      const response = await api.get("/api/user/suspensions", {
        params: { userId, includeExpired }
      });
      return response.data;
    } catch (error) {
      console.error("Failed to fetch user suspensions:", error);
      throw new Error("Failed to fetch suspensions");
    }
  }
  
  // Check if user can perform action
  async canPerformAction(
    action: string,
    userId?: string
  ): Promise<{
    allowed: boolean;
    reason?: string;
    restriction?: UserSuspension;
    rateLimitReached?: boolean;
  }> {
    try {
      const response = await api.get("/api/user/can-perform", {
        params: { action, userId }
      });
      return response.data;
    } catch (error: any) {
      console.error("Failed to check action permission:", error);
      throw new Error(error.response?.data?.message || "Failed to check permissions");
    }
  }
  
  // ===== AI CONTENT ANALYSIS =====
  
  // Analyze content for policy violations
  async analyzeContent(
    contentType: string,
    contentData: {
      text?: string;
      imageUrls?: string[];
      videoUrl?: string;
      metadata?: any;
    }
  ): Promise<AIContentAnalysis> {
    try {
      const response = await api.post("/api/ai/analyze-content", {
        contentType,
        ...contentData
      });
      return response.data;
    } catch (error: any) {
      console.error("Failed to analyze content:", error);
      throw new Error(error.response?.data?.message || "Failed to analyze content");
    }
  }
  
  // Get content analysis history
  async getContentAnalysisHistory(
    contentId: string
  ): Promise<AIContentAnalysis[]> {
    try {
      const response = await api.get(`/api/content/${contentId}/analysis-history`);
      return response.data;
    } catch (error) {
      console.error("Failed to fetch analysis history:", error);
      throw new Error("Failed to fetch analysis history");
    }
  }
  
  // ===== ADMIN FUNCTIONS =====
  
  // Get moderation queue (admin only)
  async getModerationQueue(
    filters?: {
      status?: "pending" | "reviewing" | "resolved";
      priority?: "low" | "medium" | "high" | "urgent";
      contentType?: string;
      assignedTo?: string;
    }
  ): Promise<ContentReport[]> {
    try {
      const response = await api.get("/api/admin/moderation-queue", {
        params: filters
      });
      return response.data;
    } catch (error) {
      console.error("Failed to fetch moderation queue:", error);
      throw new Error("Failed to fetch moderation queue");
    }
  }
  
  // Take moderation action (admin only)
  async takeModerationAction(data: {
    reportId?: string;
    contentId: string;
    contentType: string;
    action: string;
    reason: string;
    duration?: number;
    notes?: string;
  }): Promise<ContentModerationAction> {
    try {
      const response = await api.post("/api/admin/moderation-action", data);
      return response.data;
    } catch (error: any) {
      console.error("Failed to take moderation action:", error);
      throw new Error(error.response?.data?.message || "Failed to take action");
    }
  }
  
  // Suspend user (admin only)
  async suspendUser(data: {
    userId: string;
    type: "warning" | "temporary" | "permanent" | "shadow_ban";
    reason: string;
    duration?: number;
    restrictions?: any;
    notes?: string;
  }): Promise<UserSuspension> {
    try {
      const response = await api.post("/api/admin/suspend-user", data);
      return response.data;
    } catch (error: any) {
      console.error("Failed to suspend user:", error);
      throw new Error(error.response?.data?.message || "Failed to suspend user");
    }
  }
  
  // Get platform moderation stats (admin only)
  async getModerationStats(
    period: "1d" | "7d" | "30d" = "7d"
  ): Promise<{
    totalReports: number;
    resolvedReports: number;
    pendingReports: number;
    actionsTaken: { action: string; count: number }[];
    topReasons: { reason: string; count: number }[];
    aiAccuracy: number;
    averageResolutionTime: number;
    moderatorPerformance: {
      moderatorId: string;
      username: string;
      reportsHandled: number;
      averageTime: number;
      accuracy: number;
    }[];
  }> {
    try {
      const response = await api.get("/api/admin/moderation-stats", {
        params: { period }
      });
      return response.data;
    } catch (error) {
      console.error("Failed to fetch moderation stats:", error);
      throw new Error("Failed to fetch moderation stats");
    }
  }
  
  // ===== USER SAFETY TOOLS =====
  
  // Block user
  async blockUser(userId: string, reason?: string): Promise<void> {
    try {
      await api.post("/api/user/block", { userId, reason });
    } catch (error: any) {
      console.error("Failed to block user:", error);
      throw new Error(error.response?.data?.message || "Failed to block user");
    }
  }
  
  // Unblock user
  async unblockUser(userId: string): Promise<void> {
    try {
      await api.delete(`/api/user/block/${userId}`);
    } catch (error: any) {
      console.error("Failed to unblock user:", error);
      throw new Error(error.response?.data?.message || "Failed to unblock user");
    }
  }
  
  // Get blocked users
  async getBlockedUsers(): Promise<{
    id: string;
    username: string;
    displayName: string;
    avatar: string;
    blockedAt: string;
    reason?: string;
  }[]> {
    try {
      const response = await api.get("/api/user/blocked-users");
      return response.data;
    } catch (error) {
      console.error("Failed to fetch blocked users:", error);
      throw new Error("Failed to fetch blocked users");
    }
  }
  
  // Update privacy settings
  async updatePrivacySettings(settings: {
    allowDirectMessages: boolean;
    allowBattleInvites: boolean;
    allowMentions: boolean;
    allowTagging: boolean;
    restrictToFollowers: boolean;
    contentFiltering: "strict" | "moderate" | "off";
  }): Promise<void> {
    try {
      await api.patch("/api/user/privacy-settings", settings);
    } catch (error: any) {
      console.error("Failed to update privacy settings:", error);
      throw new Error(error.response?.data?.message || "Failed to update settings");
    }
  }
  
  // Get privacy settings
  async getPrivacySettings(): Promise<{
    allowDirectMessages: boolean;
    allowBattleInvites: boolean;
    allowMentions: boolean;
    allowTagging: boolean;
    restrictToFollowers: boolean;
    contentFiltering: "strict" | "moderate" | "off";
  }> {
    try {
      const response = await api.get("/api/user/privacy-settings");
      return response.data;
    } catch (error) {
      console.error("Failed to fetch privacy settings:", error);
      throw new Error("Failed to fetch privacy settings");
    }
  }
}

// Utility functions for abuse prevention
export const AbusePreventionUtils = {
  // Calculate risk score based on user behavior
  calculateRiskScore(behaviorLogs: UserBehaviorLog[]): number {
    if (behaviorLogs.length === 0) return 0;
    
    let riskScore = 0;
    let totalActions = 0;
    
    behaviorLogs.forEach(log => {
      totalActions += log.frequency;
      
      // High frequency in short time windows increases risk
      if (log.timeWindow === "minute" && log.frequency > 10) {
        riskScore += 30;
      } else if (log.timeWindow === "hour" && log.frequency > 100) {
        riskScore += 20;
      }
      
      // Suspicious patterns increase risk
      if (log.suspiciousPattern) {
        riskScore += 25;
      }
      
      // Existing risk score
      riskScore += log.riskScore * 0.1;
    });
    
    // Normalize based on total actions
    if (totalActions > 1000) {
      riskScore += 15; // Very high activity
    } else if (totalActions > 500) {
      riskScore += 5; // High activity
    }
    
    return Math.min(100, Math.max(0, riskScore));
  },
  
  // Determine if action should be rate limited
  shouldRateLimit(
    action: string,
    userTier: string,
    actionCount: number,
    timeWindow: string,
    rule: RateLimitRule
  ): boolean {
    let limit = 0;
    
    switch (timeWindow) {
      case "minute":
        limit = rule.maxPerMinute;
        break;
      case "hour":
        limit = rule.maxPerHour;
        break;
      case "day":
        limit = rule.maxPerDay;
        break;
      case "week":
        limit = rule.maxPerWeek;
        break;
    }
    
    // Apply tier multipliers
    if (userTier === "legend") {
      limit *= rule.trustedUserMultiplier;
    } else if (userTier === "pro_creator") {
      limit *= rule.verifiedUserMultiplier;
    }
    
    return actionCount >= limit;
  },
  
  // Detect suspicious patterns
  detectSuspiciousPatterns(actions: { action: string; timestamp: string }[]): string[] {
    const patterns: string[] = [];
    
    if (actions.length < 2) return patterns;
    
    // Sort by timestamp
    const sortedActions = actions.sort((a, b) => 
      new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
    );
    
    // Check for rapid consecutive actions
    let consecutiveCount = 1;
    let lastAction = sortedActions[0];
    
    for (let i = 1; i < sortedActions.length; i++) {
      const current = sortedActions[i];
      const timeDiff = new Date(current.timestamp).getTime() - new Date(lastAction.timestamp).getTime();
      
      if (current.action === lastAction.action && timeDiff < 1000) { // Less than 1 second
        consecutiveCount++;
      } else {
        if (consecutiveCount >= 5) {
          patterns.push(`rapid_consecutive_${lastAction.action}`);
        }
        consecutiveCount = 1;
      }
      
      lastAction = current;
    }
    
    // Check final sequence
    if (consecutiveCount >= 5) {
      patterns.push(`rapid_consecutive_${lastAction.action}`);
    }
    
    // Check for bot-like timing patterns
    const intervals = [];
    for (let i = 1; i < sortedActions.length; i++) {
      const interval = new Date(sortedActions[i].timestamp).getTime() - 
                      new Date(sortedActions[i-1].timestamp).getTime();
      intervals.push(interval);
    }
    
    // If most intervals are very similar, it might be automated
    if (intervals.length >= 5) {
      const avgInterval = intervals.reduce((sum, interval) => sum + interval, 0) / intervals.length;
      const variance = intervals.reduce((sum, interval) => sum + Math.pow(interval - avgInterval, 2), 0) / intervals.length;
      
      if (variance < avgInterval * 0.1) { // Very low variance
        patterns.push("bot_like_timing");
      }
    }
    
    return patterns;
  },
  
  // Calculate trust score factors
  calculateTrustFactors(user: {
    createdAt: string;
    isVerified: boolean;
    reportCount: number;
    contentCreated: number;
    positiveEngagement: number;
    negativeEngagement: number;
  }): TrustScore["factors"] {
    const now = new Date();
    const accountAge = (now.getTime() - new Date(user.createdAt).getTime()) / (1000 * 60 * 60 * 24); // Days
    
    return {
      accountAge: Math.min(100, (accountAge / 365) * 100), // 100% after 1 year
      verificationStatus: user.isVerified ? 100 : 0,
      communityStanding: Math.max(0, 100 - (user.reportCount * 10)), // -10 per report
      contentQuality: Math.min(100, (user.contentCreated / 10) * 100), // 100% after 10 pieces of content
      engagementHistory: Math.min(100, (user.positiveEngagement / Math.max(1, user.positiveEngagement + user.negativeEngagement)) * 100),
      reportHistory: Math.max(0, 100 - (user.reportCount * 20)), // -20 per report for this factor
      behaviorPattern: 80, // Default, would be calculated based on behavior analysis
    };
  },
  
  // Determine content filtering level
  getContentFilteringLevel(userAge?: number, userPreference?: string): "strict" | "moderate" | "off" {
    if (userPreference) return userPreference as "strict" | "moderate" | "off";
    if (userAge && userAge < 18) return "strict";
    return "moderate";
  },
  
  // Format moderation reason for display
  formatModerationReason(reason: string, action: string): string {
    const reasonMap: Record<string, string> = {
      spam: "Spam or repetitive content",
      harassment: "Harassment or bullying",
      inappropriate: "Inappropriate content",
      fraud: "Fraudulent activity",
      copyright: "Copyright violation",
      violence: "Violence or dangerous content",
      hate_speech: "Hate speech",
      misinformation: "Misinformation",
      other: "Community guidelines violation",
    };
    
    const actionMap: Record<string, string> = {
      flag: "flagged for review",
      remove: "removed",
      age_restrict: "age-restricted",
      demonetize: "demonetized",
      ban_user: "resulted in user suspension",
      shadow_ban: "resulted in limited visibility",
      warning: "resulted in a warning",
    };
    
    const reasonText = reasonMap[reason] || reason;
    const actionText = actionMap[action] || action;
    
    return `Content ${actionText} due to: ${reasonText}`;
  },
  
  // Validate report submission
  validateReport(data: {
    contentType: string;
    contentId: string;
    reason: string;
    description?: string;
  }): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];
    
    if (!data.contentType) {
      errors.push("Content type is required");
    }
    
    if (!data.contentId) {
      errors.push("Content ID is required");
    }
    
    if (!data.reason) {
      errors.push("Reason is required");
    }
    
    if (data.description && data.description.length > 1000) {
      errors.push("Description cannot exceed 1000 characters");
    }
    
    const validReasons = ["spam", "harassment", "inappropriate", "fraud", "copyright", "violence", "hate_speech", "misinformation", "other"];
    if (data.reason && !validReasons.includes(data.reason)) {
      errors.push("Invalid reason provided");
    }
    
    return {
      isValid: errors.length === 0,
      errors,
    };
  },
};

export default new AbusePreventionService();
