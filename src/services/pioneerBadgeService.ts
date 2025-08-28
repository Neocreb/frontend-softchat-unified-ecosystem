import { fetchWithAuth } from '@/lib/fetch-utils';

export interface PioneerBadge {
  id: string;
  user_id: string;
  badge_number: number;
  earned_at: string;
  eligibility_score: number;
  activity_metrics: {
    total_sessions: number;
    total_time_minutes: number;
    activities_count: number;
    quality_interactions: number;
    days_active: number;
    engagement_score: number;
    content_created: number;
    community_participation: number;
  };
  verification_data: {
    account_age_days: number;
    verified_activities: string[];
    anti_abuse_score: number;
    device_consistency: number;
  };
  is_verified: boolean;
  created_at: string;
}

export interface PioneerEligibility {
  isEligible: boolean;
  currentScore: number;
  requiredScore: number;
  remainingSlots: number;
  currentRank: number;
  improvements: {
    category: string;
    description: string;
    weight: number;
    currentValue: number;
    targetValue: number;
  }[];
}

export interface PioneerActivitySession {
  id: string;
  user_id: string;
  session_start: string;
  session_end?: string;
  total_time_minutes: number;
  activities_count: number;
  quality_interactions: number;
  device_info: Record<string, any>;
  engagement_score: number;
  created_at: string;
}

export class PioneerBadgeService {
  private static apiBase = "/api";

  /**
   * Track user activity session for pioneer badge calculation
   */
  static async trackSession(params: {
    sessionStart: Date;
    sessionEnd?: Date;
    activitiesCount: number;
    qualityInteractions: number;
    deviceInfo?: Record<string, any>;
  }): Promise<{ success: boolean; sessionId?: string; engagementScore?: number; error?: string }> {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        return { success: false, error: "No authentication token" };
      }

      const response = await fetchWithAuth("/api/pioneer/track-session", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          sessionStart: params.sessionStart.toISOString(),
          sessionEnd: params.sessionEnd?.toISOString(),
          activitiesCount: params.activitiesCount,
          qualityInteractions: params.qualityInteractions,
          deviceInfo: params.deviceInfo || {
            userAgent: navigator.userAgent,
            screenResolution: `${screen.width}x${screen.height}`,
            timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
            language: navigator.language
          }
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: response.statusText }));
        return { success: false, error: errorData.error || response.statusText };
      }

      const result = await response.json();
      return result;
    } catch (error) {
      console.error("Error tracking session:", error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : "Unknown error" 
      };
    }
  }

  /**
   * Check user's eligibility for pioneer badge
   */
  static async checkEligibility(): Promise<PioneerEligibility | null> {
    try {
      const token = localStorage.getItem("token");
      if (!token) return null;

      const response = await fetchWithAuth("/api/pioneer/eligibility");

      if (!response.ok) {
        throw new Error("Failed to check pioneer eligibility");
      }

      const result = await response.json();
      return result.data;
    } catch (error) {
      console.error("Error checking pioneer eligibility:", error);
      return null;
    }
  }

  /**
   * Get user's pioneer badge if they have one
   */
  static async getPioneerBadge(): Promise<PioneerBadge | null> {
    try {
      const token = localStorage.getItem("token");
      if (!token) return null;

      const response = await fetchWithAuth("/api/pioneer/badge");

      if (!response.ok) {
        if (response.status === 404) {
          return null; // User doesn't have a pioneer badge
        }
        throw new Error("Failed to fetch pioneer badge");
      }

      const result = await response.json();
      return result.data;
    } catch (error) {
      console.error("Error fetching pioneer badge:", error);
      return null;
    }
  }

  /**
   * Claim pioneer badge if eligible
   */
  static async claimPioneerBadge(): Promise<{ 
    success: boolean; 
    badge?: PioneerBadge; 
    badgeNumber?: number;
    error?: string 
  }> {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        return { success: false, error: "No authentication token" };
      }

      const response = await fetchWithAuth("/api/pioneer/claim", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: response.statusText }));
        return { success: false, error: errorData.error || response.statusText };
      }

      const result = await response.json();
      
      if (result.success && result.badge) {
        console.log(`🏆 Pioneer Badge #${result.badge.badge_number} earned!`);
      }

      return result;
    } catch (error) {
      console.error("Error claiming pioneer badge:", error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : "Unknown error" 
      };
    }
  }

  /**
   * Get pioneer badge leaderboard
   */
  static async getLeaderboard(limit: number = 100): Promise<{
    badges: (PioneerBadge & { username: string; avatar_url?: string })[];
    total: number;
  } | null> {
    try {
      const response = await fetchWithAuth(`/api/pioneer/leaderboard?limit=${limit}`);

      if (!response.ok) {
        throw new Error("Failed to fetch pioneer leaderboard");
      }

      const result = await response.json();
      return result.data;
    } catch (error) {
      console.error("Error fetching pioneer leaderboard:", error);
      return null;
    }
  }

  /**
   * Get available pioneer badge slots
   */
  static async getAvailableSlots(): Promise<{ 
    totalSlots: number; 
    awardedSlots: number; 
    remainingSlots: number;
    nextBadgeNumber: number;
  } | null> {
    try {
      const response = await fetchWithAuth("/api/pioneer/slots");

      if (!response.ok) {
        throw new Error("Failed to fetch pioneer slots");
      }

      const result = await response.json();
      return result.data;
    } catch (error) {
      console.error("Error fetching pioneer slots:", error);
      return null;
    }
  }

  /**
   * Calculate activity session score
   */
  static calculateSessionScore(
    sessionDurationMinutes: number,
    activitiesCount: number,
    qualityInteractions: number
  ): number {
    // Base score for session duration (max 30 points for 60+ minutes)
    const durationScore = Math.min(sessionDurationMinutes / 2, 30);
    
    // Activity count score (max 25 points for 50+ activities)
    const activityScore = Math.min(activitiesCount * 0.5, 25);
    
    // Quality interaction score (max 45 points for 15+ quality interactions)
    const qualityScore = Math.min(qualityInteractions * 3, 45);
    
    return Math.round((durationScore + activityScore + qualityScore) * 100) / 100;
  }

  /**
   * Check if user qualifies as a real/non-abusive user
   */
  static isQualityUser(metrics: {
    accountAgeDays: number;
    totalSessions: number;
    averageSessionMinutes: number;
    contentCreated: number;
    communityParticipation: number;
  }): { isQuality: boolean; score: number; reasons: string[] } {
    const reasons: string[] = [];
    let score = 0;

    // Account age requirement (min 7 days)
    if (metrics.accountAgeDays >= 7) {
      score += 20;
    } else {
      reasons.push("Account too new (minimum 7 days required)");
    }

    // Session count (min 10 sessions)
    if (metrics.totalSessions >= 10) {
      score += 20;
    } else {
      reasons.push("Not enough active sessions (minimum 10 required)");
    }

    // Average session time (min 5 minutes)
    if (metrics.averageSessionMinutes >= 5) {
      score += 20;
    } else {
      reasons.push("Sessions too short (minimum 5 minutes average required)");
    }

    // Content creation (min 3 pieces of content)
    if (metrics.contentCreated >= 3) {
      score += 20;
    } else {
      reasons.push("Insufficient content creation (minimum 3 posts/content required)");
    }

    // Community participation (comments, likes, shares)
    if (metrics.communityParticipation >= 10) {
      score += 20;
    } else {
      reasons.push("Low community participation (minimum 10 interactions required)");
    }

    return {
      isQuality: score >= 80, // Need 80/100 to qualify
      score,
      reasons
    };
  }

  /**
   * Format pioneer badge achievement notification
   */
  static formatBadgeNotification(badgeNumber: number): string {
    return `🏆 Congratulations! You've earned Pioneer Badge #${badgeNumber}! You're one of the first ${badgeNumber} verified active users on Eloity.`;
  }

  /**
   * Get user's activity summary for pioneer calculation
   */
  static async getActivitySummary(): Promise<{
    totalSessions: number;
    totalTimeMinutes: number;
    activitiesCount: number;
    qualityInteractions: number;
    daysActive: number;
    averageEngagementScore: number;
  } | null> {
    try {
      const token = localStorage.getItem("token");
      if (!token) return null;

      const response = await fetchWithAuth("/api/pioneer/activity-summary");

      if (!response.ok) {
        throw new Error("Failed to fetch activity summary");
      }

      const result = await response.json();
      return result.data;
    } catch (error) {
      console.error("Error fetching activity summary:", error);
      return null;
    }
  }
}

// Auto-tracker for session management
export class PioneerSessionTracker {
  private static sessionStart: Date | null = null;
  private static activityCount = 0;
  private static qualityInteractionCount = 0;
  private static sessionInterval: NodeJS.Timeout | null = null;

  static startSession(): void {
    if (this.sessionStart) return; // Session already active

    this.sessionStart = new Date();
    this.activityCount = 0;
    this.qualityInteractionCount = 0;

    // Track session every 5 minutes
    this.sessionInterval = setInterval(() => {
      this.updateSession();
    }, 5 * 60 * 1000);

    console.log("🏆 Pioneer session tracking started");
  }

  static endSession(): void {
    if (!this.sessionStart) return;

    const sessionEnd = new Date();
    this.updateSession(sessionEnd);
    
    this.sessionStart = null;
    if (this.sessionInterval) {
      clearInterval(this.sessionInterval);
      this.sessionInterval = null;
    }

    console.log("🏆 Pioneer session tracking ended");
  }

  static trackActivity(isQualityInteraction: boolean = false): void {
    this.activityCount++;
    if (isQualityInteraction) {
      this.qualityInteractionCount++;
    }
  }

  private static async updateSession(sessionEnd?: Date): Promise<void> {
    if (!this.sessionStart) return;

    try {
      await PioneerBadgeService.trackSession({
        sessionStart: this.sessionStart,
        sessionEnd,
        activitiesCount: this.activityCount,
        qualityInteractions: this.qualityInteractionCount,
      });
    } catch (error) {
      console.error("Error updating pioneer session:", error);
    }
  }
}
