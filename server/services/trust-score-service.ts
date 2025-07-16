import { eq, and, desc, gte, lte, sql, count, avg } from "drizzle-orm";
import { db } from "../db";
import {
  trustScores,
  activityLogs,
  fraudDetectionLogs,
  dailyActivitySummaries,
  type ActivityType,
} from "../../shared/activity-economy-schema";

// =============================================================================
// TRUST SCORE CALCULATION SERVICE
// =============================================================================

export class TrustScoreService {
  /**
   * Calculate comprehensive trust score for a user
   */
  static async calculateTrustScore(userId: string): Promise<number> {
    try {
      // Get user's activity history (last 30 days)
      const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

      const activities = await db
        .select()
        .from(activityLogs)
        .where(
          and(
            eq(activityLogs.userId, userId),
            gte(activityLogs.createdAt, thirtyDaysAgo),
            eq(activityLogs.status, "confirmed"),
          ),
        )
        .orderBy(desc(activityLogs.createdAt));

      // Calculate component scores
      const consistencyScore = this.calculateConsistencyScore(activities);
      const diversityScore = this.calculateDiversityScore(activities);
      const qualityScore = this.calculateQualityScore(activities);
      const behaviorScore = this.calculateBehaviorScore(activities);
      const fraudScore = await this.calculateFraudScore(userId);

      // Weighted combination
      const trustScore =
        consistencyScore * 0.25 +
        diversityScore * 0.2 +
        qualityScore * 0.25 +
        behaviorScore * 0.2 +
        fraudScore * 0.1;

      return Math.max(0, Math.min(100, trustScore));
    } catch (error) {
      console.error("Error calculating trust score:", error);
      return 50; // Default neutral score
    }
  }

  /**
   * Calculate consistency score based on activity patterns
   */
  private static calculateConsistencyScore(activities: any[]): number {
    if (activities.length < 3) return 40; // Not enough data

    // Group activities by day
    const dailyActivities = new Map<string, number>();
    activities.forEach((activity) => {
      const day = activity.createdAt.toISOString().split("T")[0];
      dailyActivities.set(day, (dailyActivities.get(day) || 0) + 1);
    });

    const activeDays = dailyActivities.size;
    const maxDays = 30;
    const averageActivitiesPerDay = activities.length / activeDays;

    // Consistency is based on:
    // 1. Number of active days (regularity)
    // 2. Variance in daily activity (stability)
    const regularityScore = (activeDays / maxDays) * 100;

    const dailyCounts = Array.from(dailyActivities.values());
    const variance = this.calculateVariance(dailyCounts);
    const stabilityScore = Math.max(
      0,
      100 - (variance / averageActivitiesPerDay) * 10,
    );

    return regularityScore * 0.6 + stabilityScore * 0.4;
  }

  /**
   * Calculate diversity score based on variety of activities
   */
  private static calculateDiversityScore(activities: any[]): number {
    if (activities.length === 0) return 0;

    const actionTypes = new Set(activities.map((a) => a.actionType));
    const maxPossibleTypes = 15; // Approximate number of action types

    // Bonus for balanced activity distribution
    const actionCounts = new Map<string, number>();
    activities.forEach((activity) => {
      actionCounts.set(
        activity.actionType,
        (actionCounts.get(activity.actionType) || 0) + 1,
      );
    });

    const counts = Array.from(actionCounts.values());
    const entropy = this.calculateEntropy(counts);
    const maxEntropy = Math.log2(actionTypes.size);
    const entropyScore = maxEntropy > 0 ? (entropy / maxEntropy) * 100 : 0;

    const varietyScore = (actionTypes.size / maxPossibleTypes) * 100;

    return Math.min(100, varietyScore * 0.7 + entropyScore * 0.3);
  }

  /**
   * Calculate quality score based on activity quality metrics
   */
  private static calculateQualityScore(activities: any[]): number {
    if (activities.length === 0) return 50;

    const qualityScores = activities
      .map((a) => parseFloat(a.qualityScore))
      .filter((score) => !isNaN(score));

    if (qualityScores.length === 0) return 50;

    const averageQuality =
      qualityScores.reduce((sum, score) => sum + score, 0) /
      qualityScores.length;

    // Convert quality score (0.1-2.0) to 0-100 scale
    return Math.min(100, ((averageQuality - 0.1) / 1.9) * 100);
  }

  /**
   * Calculate behavior score based on interaction patterns
   */
  private static calculateBehaviorScore(activities: any[]): number {
    if (activities.length === 0) return 50;

    let behaviorScore = 70; // Start with neutral score

    // Check for suspicious patterns
    const timeIntervals = this.calculateTimeIntervals(activities);
    const suspiciouslyFastActions = timeIntervals.filter(
      (interval) => interval < 2000,
    ).length; // < 2 seconds

    if (suspiciouslyFastActions > activities.length * 0.3) {
      behaviorScore -= 30; // Too many fast actions
    }

    // Check for repetitive behavior
    const actionSequences = this.findRepetitiveSequences(activities);
    if (actionSequences.length > 0) {
      behaviorScore -= 20; // Repetitive patterns detected
    }

    // Check for unusual activity spikes
    const hourlyDistribution = this.calculateHourlyDistribution(activities);
    const isUnusualDistribution =
      this.isUnusualTimeDistribution(hourlyDistribution);
    if (isUnusualDistribution) {
      behaviorScore -= 15; // Unusual time patterns
    }

    return Math.max(0, Math.min(100, behaviorScore));
  }

  /**
   * Calculate fraud score (inverted - lower is better)
   */
  private static async calculateFraudScore(userId: string): Promise<number> {
    try {
      const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

      const recentFlags = await db
        .select()
        .from(fraudDetectionLogs)
        .where(
          and(
            eq(fraudDetectionLogs.userId, userId),
            gte(fraudDetectionLogs.createdAt, sevenDaysAgo),
          ),
        );

      if (recentFlags.length === 0) return 100; // No fraud flags = good

      const averageRiskScore =
        recentFlags.reduce((sum, flag) => sum + parseFloat(flag.riskScore), 0) /
        recentFlags.length;

      // Invert risk score (high risk = low fraud score)
      return Math.max(0, 100 - averageRiskScore);
    } catch (error) {
      console.error("Error calculating fraud score:", error);
      return 70; // Neutral score on error
    }
  }

  /**
   * Update trust score and related metrics
   */
  static async updateUserTrustScore(userId: string): Promise<void> {
    try {
      const newScore = await this.calculateTrustScore(userId);

      // Get current trust score record
      const [currentTrustScore] = await db
        .select()
        .from(trustScores)
        .where(eq(trustScores.userId, userId))
        .limit(1);

      if (!currentTrustScore) {
        // Create new trust score record
        await db.insert(trustScores).values({
          userId,
          currentScore: newScore.toString(),
          rewardMultiplier: this.calculateRewardMultiplier(newScore).toString(),
          trustLevel: this.calculateTrustLevel(newScore),
          dailySoftPointsCap: this.calculateDailyCap(newScore),
        });
      } else {
        // Update existing record
        const scoreHistory = currentTrustScore.scoreHistory || [];
        scoreHistory.push({
          date: new Date().toISOString(),
          score: newScore,
          reason: "Automatic recalculation",
        });

        // Keep only last 30 score history entries
        const trimmedHistory = scoreHistory.slice(-30);

        await db
          .update(trustScores)
          .set({
            previousScore: currentTrustScore.currentScore,
            currentScore: newScore.toString(),
            rewardMultiplier:
              this.calculateRewardMultiplier(newScore).toString(),
            trustLevel: this.calculateTrustLevel(newScore),
            dailySoftPointsCap: this.calculateDailyCap(newScore),
            scoreHistory: trimmedHistory,
            lastCalculatedAt: new Date(),
            updatedAt: new Date(),
          })
          .where(eq(trustScores.userId, userId));
      }
    } catch (error) {
      console.error("Error updating trust score:", error);
    }
  }

  /**
   * Calculate reward multiplier based on trust score
   */
  private static calculateRewardMultiplier(trustScore: number): number {
    if (trustScore >= 90) return 1.2;
    if (trustScore >= 75) return 1.0;
    if (trustScore >= 60) return 0.8;
    if (trustScore >= 40) return 0.5;
    return 0.2;
  }

  /**
   * Calculate trust level based on score
   */
  private static calculateTrustLevel(trustScore: number): string {
    if (trustScore >= 90) return "diamond";
    if (trustScore >= 75) return "platinum";
    if (trustScore >= 60) return "gold";
    if (trustScore >= 40) return "silver";
    return "bronze";
  }

  /**
   * Calculate daily SoftPoints cap based on trust score
   */
  private static calculateDailyCap(trustScore: number): number {
    if (trustScore >= 90) return 500;
    if (trustScore >= 75) return 300;
    if (trustScore >= 60) return 200;
    if (trustScore >= 40) return 100;
    return 50;
  }

  // =============================================================================
  // UTILITY FUNCTIONS
  // =============================================================================

  private static calculateVariance(numbers: number[]): number {
    if (numbers.length === 0) return 0;
    const mean = numbers.reduce((sum, n) => sum + n, 0) / numbers.length;
    const squaredDiffs = numbers.map((n) => Math.pow(n - mean, 2));
    return squaredDiffs.reduce((sum, sq) => sum + sq, 0) / numbers.length;
  }

  private static calculateEntropy(counts: number[]): number {
    const total = counts.reduce((sum, count) => sum + count, 0);
    if (total === 0) return 0;

    return -counts.reduce((entropy, count) => {
      if (count === 0) return entropy;
      const probability = count / total;
      return entropy + probability * Math.log2(probability);
    }, 0);
  }

  private static calculateTimeIntervals(activities: any[]): number[] {
    if (activities.length < 2) return [];

    const intervals = [];
    for (let i = 1; i < activities.length; i++) {
      const timeDiff =
        activities[i - 1].createdAt.getTime() -
        activities[i].createdAt.getTime();
      intervals.push(Math.abs(timeDiff));
    }
    return intervals;
  }

  private static findRepetitiveSequences(activities: any[]): string[] {
    const sequences = new Map<string, number>();

    for (let i = 0; i < activities.length - 2; i++) {
      const sequence = [
        activities[i].actionType,
        activities[i + 1].actionType,
        activities[i + 2].actionType,
      ].join("-");

      sequences.set(sequence, (sequences.get(sequence) || 0) + 1);
    }

    // Return sequences that appear more than twice
    return Array.from(sequences.entries())
      .filter(([_, count]) => count > 2)
      .map(([sequence, _]) => sequence);
  }

  private static calculateHourlyDistribution(activities: any[]): number[] {
    const hourCounts = new Array(24).fill(0);

    activities.forEach((activity) => {
      const hour = activity.createdAt.getHours();
      hourCounts[hour]++;
    });

    return hourCounts;
  }

  private static isUnusualTimeDistribution(
    hourlyDistribution: number[],
  ): boolean {
    const total = hourlyDistribution.reduce((sum, count) => sum + count, 0);
    if (total === 0) return false;

    // Check if more than 70% of activity happens in a 4-hour window
    for (let i = 0; i < 24; i++) {
      const windowSum = [0, 1, 2, 3].reduce((sum, offset) => {
        return sum + hourlyDistribution[(i + offset) % 24];
      }, 0);

      if (windowSum / total > 0.7) {
        return true; // Suspicious concentration
      }
    }

    return false;
  }
}

// =============================================================================
// FRAUD DETECTION SERVICE
// =============================================================================

export class FraudDetectionService {
  /**
   * Analyze activity for fraud patterns
   */
  static async analyzeActivity(
    userId: string,
    actionType: ActivityType,
    context: any,
    dailyCount: number,
  ): Promise<{ riskScore: number; riskFactors: any[]; patterns: any[] }> {
    const riskFactors = [];
    const patterns = [];
    let riskScore = 0;

    // 1. Frequency Analysis
    const frequencyRisk = this.analyzeFrequency(dailyCount, actionType);
    riskScore += frequencyRisk.score;
    if (frequencyRisk.factor) riskFactors.push(frequencyRisk.factor);

    // 2. Context Analysis
    const contextRisk = this.analyzeContext(context);
    riskScore += contextRisk.score;
    if (contextRisk.factor) riskFactors.push(contextRisk.factor);

    // 3. Temporal Patterns
    const temporalRisk = await this.analyzeTemporalPatterns(userId, actionType);
    riskScore += temporalRisk.score;
    if (temporalRisk.pattern) patterns.push(temporalRisk.pattern);

    // 4. Device/IP Analysis
    const deviceRisk = await this.analyzeDevicePatterns(userId, context);
    riskScore += deviceRisk.score;
    if (deviceRisk.factor) riskFactors.push(deviceRisk.factor);

    // 5. Behavioral Anomalies
    const behaviorRisk = await this.analyzeBehavioralAnomalies(
      userId,
      actionType,
    );
    riskScore += behaviorRisk.score;
    if (behaviorRisk.pattern) patterns.push(behaviorRisk.pattern);

    return {
      riskScore: Math.min(100, riskScore),
      riskFactors,
      patterns,
    };
  }

  private static analyzeFrequency(
    dailyCount: number,
    actionType: ActivityType,
  ): { score: number; factor?: any } {
    const limits: Record<string, number> = {
      like_post: 100,
      comment_post: 50,
      post_content: 10,
      share_content: 20,
      purchase_product: 5,
      default: 50,
    };

    const limit = limits[actionType] || limits.default;
    const ratio = dailyCount / limit;

    if (ratio > 2) {
      return {
        score: 40,
        factor: {
          factor: "excessive_frequency",
          weight: 0.4,
          description: `${dailyCount} ${actionType} actions today (limit: ${limit})`,
        },
      };
    } else if (ratio > 1.5) {
      return {
        score: 20,
        factor: {
          factor: "high_frequency",
          weight: 0.2,
          description: `High frequency: ${dailyCount} actions today`,
        },
      };
    }

    return { score: 0 };
  }

  private static analyzeContext(context: any): { score: number; factor?: any } {
    let score = 0;
    let factor = null;

    // Missing context indicators
    if (!context?.ip) score += 10;
    if (!context?.deviceId) score += 10;
    if (!context?.userAgent) score += 15;

    // Suspicious user agent
    if (context?.userAgent) {
      const suspiciousPatterns = ["bot", "crawler", "spider", "scraper"];
      if (
        suspiciousPatterns.some((pattern) =>
          context.userAgent.toLowerCase().includes(pattern),
        )
      ) {
        score += 30;
        factor = {
          factor: "suspicious_user_agent",
          weight: 0.3,
          description: "User agent suggests automated activity",
        };
      }
    }

    // Very fast interactions
    if (context?.timeSpent && context.timeSpent < 1) {
      score += 25;
      factor = {
        factor: "rapid_interaction",
        weight: 0.25,
        description: `Very fast interaction: ${context.timeSpent}s`,
      };
    }

    return { score, factor };
  }

  private static async analyzeTemporalPatterns(
    userId: string,
    actionType: ActivityType,
  ): Promise<{ score: number; pattern?: any }> {
    try {
      const lastHour = new Date(Date.now() - 60 * 60 * 1000);

      const recentActivities = await db
        .select()
        .from(activityLogs)
        .where(
          and(
            eq(activityLogs.userId, userId),
            eq(activityLogs.actionType, actionType),
            gte(activityLogs.createdAt, lastHour),
          ),
        );

      if (recentActivities.length < 2) return { score: 0 };

      // Check for too regular intervals (bot-like behavior)
      const intervals = [];
      for (let i = 1; i < recentActivities.length; i++) {
        const interval =
          recentActivities[i - 1].createdAt.getTime() -
          recentActivities[i].createdAt.getTime();
        intervals.push(Math.abs(interval));
      }

      // Check if intervals are suspiciously regular
      const avgInterval =
        intervals.reduce((sum, i) => sum + i, 0) / intervals.length;
      const variance =
        intervals.reduce((sum, i) => sum + Math.pow(i - avgInterval, 2), 0) /
        intervals.length;
      const stdDev = Math.sqrt(variance);
      const coefficientOfVariation = stdDev / avgInterval;

      if (coefficientOfVariation < 0.1 && intervals.length > 5) {
        return {
          score: 35,
          pattern: {
            pattern: "regular_intervals",
            confidence: 0.8,
            description: "Suspiciously regular activity intervals detected",
          },
        };
      }

      return { score: 0 };
    } catch (error) {
      console.error("Error analyzing temporal patterns:", error);
      return { score: 0 };
    }
  }

  private static async analyzeDevicePatterns(
    userId: string,
    context: any,
  ): Promise<{ score: number; factor?: any }> {
    // This would analyze device fingerprints, IP patterns, etc.
    // For now, basic implementation

    if (!context?.ip && !context?.deviceId) {
      return {
        score: 20,
        factor: {
          factor: "missing_device_info",
          weight: 0.2,
          description: "Missing device identification",
        },
      };
    }

    return { score: 0 };
  }

  private static async analyzeBehavioralAnomalies(
    userId: string,
    actionType: ActivityType,
  ): Promise<{ score: number; pattern?: any }> {
    // This would use ML models to detect behavioral anomalies
    // For now, basic rule-based detection

    try {
      const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

      const recentActivities = await db
        .select()
        .from(activityLogs)
        .where(
          and(
            eq(activityLogs.userId, userId),
            gte(activityLogs.createdAt, sevenDaysAgo),
          ),
        );

      // Check for sudden behavior change
      const actionCounts = new Map<string, number>();
      recentActivities.forEach((activity) => {
        actionCounts.set(
          activity.actionType,
          (actionCounts.get(activity.actionType) || 0) + 1,
        );
      });

      const currentActionCount = actionCounts.get(actionType) || 0;
      const totalActions = recentActivities.length;
      const actionRatio = currentActionCount / totalActions;

      if (actionRatio > 0.8 && totalActions > 20) {
        return {
          score: 30,
          pattern: {
            pattern: "single_action_dominance",
            confidence: 0.7,
            description: `${actionType} represents ${(actionRatio * 100).toFixed(1)}% of recent activity`,
          },
        };
      }

      return { score: 0 };
    } catch (error) {
      console.error("Error analyzing behavioral anomalies:", error);
      return { score: 0 };
    }
  }

  /**
   * Log fraud detection result
   */
  static async logFraudDetection(
    userId: string,
    riskScore: number,
    riskFactors: any[],
    patterns: any[],
    actionTaken: string = "none",
  ): Promise<void> {
    try {
      const riskLevel =
        riskScore > 80
          ? "critical"
          : riskScore > 60
            ? "high"
            : riskScore > 40
              ? "medium"
              : "low";

      await db.insert(fraudDetectionLogs).values({
        userId,
        riskScore: riskScore.toString(),
        riskLevel,
        detectionMethod: "rule_based",
        riskFactors,
        patterns,
        actionTaken,
      });
    } catch (error) {
      console.error("Error logging fraud detection:", error);
    }
  }
}
