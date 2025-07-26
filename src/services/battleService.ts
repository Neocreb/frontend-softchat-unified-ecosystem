import { api } from "@/lib/api";

export interface LiveBattle {
  id: string;
  participant1Id: string;
  participant2Id: string;
  title?: string;
  description?: string;
  battleType: "live_stream" | "video_submission" | "talent_show";
  duration: number;
  maxViewers?: number;
  requiresInvite: boolean;
  roomId: string;
  streamKey1?: string;
  streamKey2?: string;
  status: "pending" | "live" | "completed" | "cancelled" | "abandoned";
  scheduledFor?: string;
  startedAt?: string;
  endedAt?: string;
  scoringMethod: "tips" | "votes" | "judges" | "hybrid";
  participant1Score: number;
  participant2Score: number;
  winnerId?: string;
  winnerDetermined: boolean;
  winMethod?: "score" | "forfeit" | "time_limit" | "admin_decision";
  peakViewerCount: number;
  totalViews: number;
  totalTips: number;
  totalBets: number;
  platformFee: number;
  feePercentage: number;
  replayUrl?: string;
  highlightsUrl?: string;
  thumbnailUrl?: string;
  isFlagged: boolean;
  flaggedReason?: string;
  moderatedBy?: string;
  metadata?: any;
  createdAt: string;
  updatedAt: string;
  
  // Populated data
  participant1?: BattleParticipant;
  participant2?: BattleParticipant;
  viewers?: BattleViewer[];
  currentViewerCount?: number;
}

export interface BattleParticipant {
  id: string;
  username: string;
  displayName: string;
  avatar: string;
  isVerified: boolean;
  level: number;
  tier: "rising_star" | "pro_creator" | "legend";
  battlesWon: number;
  battlesLost: number;
  totalEarnings: number;
  isReady: boolean;
  isLive: boolean;
  streamKey?: string;
  connectionStatus: "connected" | "disconnected" | "connecting";
}

export interface BattleViewer {
  id: string;
  userId?: string;
  sessionId: string;
  username?: string;
  avatar?: string;
  joinedAt: string;
  leftAt?: string;
  watchDuration: number;
  tipsGiven: number;
  betsPlaced: number;
  messagesPosted: number;
  reactionsGiven: number;
  deviceType?: "desktop" | "mobile" | "tablet";
  platform?: "web" | "ios" | "android";
}

export interface BattleTip {
  id: string;
  battleId: string;
  fromUserId: string;
  toParticipantId: string;
  amount: number;
  currency: "SOFT_POINTS" | "USDT";
  giftType?: string;
  giftName?: string;
  message?: string;
  isAnonymous: boolean;
  showInStream: boolean;
  animationType: "standard" | "fireworks" | "confetti";
  effectDuration: number;
  scoreContribution: number;
  multiplier: number;
  comboCount: number;
  comboMultiplier: number;
  processed: boolean;
  processedAt?: string;
  sentAt: string;
}

export interface BattleInvite {
  id: string;
  fromUserId: string;
  toUserId: string;
  battleType: "live_stream" | "video_submission" | "talent_show";
  scheduledFor?: string;
  duration: number;
  message?: string;
  status: "pending" | "accepted" | "declined" | "expired";
  expiresAt: string;
  createdAt: string;
}

export interface BattleLeaderboard {
  userId: string;
  username: string;
  displayName: string;
  avatar: string;
  period: "daily" | "weekly" | "monthly" | "all_time";
  battlesParticipated: number;
  battlesWon: number;
  battlesLost: number;
  winRate: number;
  totalEarnings: number;
  totalTipsReceived: number;
  averageEarningsPerBattle: number;
  totalViewersAttracted: number;
  averageViewerCount: number;
  totalWatchTime: number;
  currentRank: number;
  previousRank?: number;
  rankChange: number;
  currentWinStreak: number;
  longestWinStreak: number;
  creatorTier: "rising_star" | "pro_creator" | "legend";
  tierProgress: number;
  achievements: string[];
}

class BattleService {
  private wsConnection: WebSocket | null = null;
  private battleUpdateCallbacks: ((battle: LiveBattle) => void)[] = [];
  
  // Create a new battle
  async createBattle(data: {
    opponentId?: string;
    battleType: "live_stream" | "video_submission" | "talent_show";
    duration: number;
    scheduledFor?: string;
    title?: string;
    description?: string;
    requiresInvite?: boolean;
    maxViewers?: number;
  }): Promise<LiveBattle> {
    try {
      const response = await api.post("/api/battles", data);
      return response.data;
    } catch (error: any) {
      console.error("Failed to create battle:", error);
      throw new Error(error.response?.data?.message || "Failed to create battle");
    }
  }
  
  // Join an existing battle
  async joinBattle(battleId: string): Promise<LiveBattle> {
    try {
      const response = await api.post(`/api/battles/${battleId}/join`);
      return response.data;
    } catch (error: any) {
      console.error("Failed to join battle:", error);
      throw new Error(error.response?.data?.message || "Failed to join battle");
    }
  }
  
  // Start a battle (host only)
  async startBattle(battleId: string): Promise<LiveBattle> {
    try {
      const response = await api.post(`/api/battles/${battleId}/start`);
      return response.data;
    } catch (error: any) {
      console.error("Failed to start battle:", error);
      throw new Error(error.response?.data?.message || "Failed to start battle");
    }
  }
  
  // End a battle
  async endBattle(battleId: string, winnerId?: string): Promise<LiveBattle> {
    try {
      const response = await api.post(`/api/battles/${battleId}/end`, { winnerId });
      return response.data;
    } catch (error: any) {
      console.error("Failed to end battle:", error);
      throw new Error(error.response?.data?.message || "Failed to end battle");
    }
  }
  
  // Get battle details
  async getBattle(battleId: string): Promise<LiveBattle> {
    try {
      const response = await api.get(`/api/battles/${battleId}`);
      return response.data;
    } catch (error: any) {
      console.error("Failed to fetch battle:", error);
      throw new Error(error.response?.data?.message || "Failed to fetch battle");
    }
  }
  
  // Get list of battles
  async getBattles(params: {
    status?: "pending" | "live" | "completed";
    limit?: number;
    offset?: number;
    userId?: string;
  } = {}): Promise<{
    battles: LiveBattle[];
    total: number;
    hasMore: boolean;
  }> {
    try {
      const response = await api.get("/api/battles", { params });
      return response.data;
    } catch (error) {
      console.error("Failed to fetch battles:", error);
      throw new Error("Failed to fetch battles");
    }
  }
  
  // Send a battle invite
  async sendBattleInvite(data: {
    toUserId: string;
    battleType: "live_stream" | "video_submission" | "talent_show";
    scheduledFor?: string;
    duration: number;
    message?: string;
  }): Promise<BattleInvite> {
    try {
      const response = await api.post("/api/battle-invites", data);
      return response.data;
    } catch (error: any) {
      console.error("Failed to send battle invite:", error);
      throw new Error(error.response?.data?.message || "Failed to send invite");
    }
  }
  
  // Respond to a battle invite
  async respondToBattleInvite(
    inviteId: string,
    response: "accept" | "decline"
  ): Promise<BattleInvite> {
    try {
      const result = await api.post(`/api/battle-invites/${inviteId}/respond`, {
        response,
      });
      return result.data;
    } catch (error: any) {
      console.error("Failed to respond to battle invite:", error);
      throw new Error(error.response?.data?.message || "Failed to respond to invite");
    }
  }
  
  // Get user's battle invites
  async getBattleInvites(status?: "pending" | "accepted" | "declined"): Promise<BattleInvite[]> {
    try {
      const response = await api.get("/api/battle-invites", {
        params: { status },
      });
      return response.data;
    } catch (error) {
      console.error("Failed to fetch battle invites:", error);
      throw new Error("Failed to fetch invites");
    }
  }
  
  // Send a tip during battle
  async sendTip(data: {
    battleId: string;
    toParticipantId: string;
    amount: number;
    currency?: "SOFT_POINTS" | "USDT";
    giftType?: string;
    giftName?: string;
    message?: string;
    isAnonymous?: boolean;
  }): Promise<BattleTip> {
    try {
      const response = await api.post("/api/battle-tips", {
        ...data,
        currency: data.currency || "SOFT_POINTS",
      });
      return response.data;
    } catch (error: any) {
      console.error("Failed to send tip:", error);
      throw new Error(error.response?.data?.message || "Failed to send tip");
    }
  }
  
  // Get battle tips
  async getBattleTips(
    battleId: string,
    participantId?: string
  ): Promise<BattleTip[]> {
    try {
      const response = await api.get(`/api/battles/${battleId}/tips`, {
        params: { participantId },
      });
      return response.data;
    } catch (error) {
      console.error("Failed to fetch battle tips:", error);
      throw new Error("Failed to fetch tips");
    }
  }
  
  // Update participant ready status
  async updateReadyStatus(battleId: string, isReady: boolean): Promise<void> {
    try {
      await api.patch(`/api/battles/${battleId}/ready`, { isReady });
    } catch (error: any) {
      console.error("Failed to update ready status:", error);
      throw new Error(error.response?.data?.message || "Failed to update status");
    }
  }
  
  // Report battle or participant
  async reportBattle(
    battleId: string,
    reason: string,
    description?: string
  ): Promise<void> {
    try {
      await api.post(`/api/battles/${battleId}/report`, {
        reason,
        description,
      });
    } catch (error: any) {
      console.error("Failed to report battle:", error);
      throw new Error(error.response?.data?.message || "Failed to report battle");
    }
  }
  
  // Get battle leaderboard
  async getBattleLeaderboard(
    period: "daily" | "weekly" | "monthly" | "all_time" = "weekly",
    limit = 50
  ): Promise<{
    leaderboard: BattleLeaderboard[];
    userRank?: number;
  }> {
    try {
      const response = await api.get("/api/battles/leaderboard", {
        params: { period, limit },
      });
      return response.data;
    } catch (error) {
      console.error("Failed to fetch battle leaderboard:", error);
      throw new Error("Failed to fetch leaderboard");
    }
  }
  
  // Get user's battle stats
  async getUserBattleStats(userId?: string): Promise<{
    battlesParticipated: number;
    battlesWon: number;
    battlesLost: number;
    winRate: number;
    totalEarnings: number;
    totalTipsReceived: number;
    averageViewerCount: number;
    currentWinStreak: number;
    longestWinStreak: number;
    favoriteOpponents: { userId: string; username: string; battlesAgainst: number }[];
    recentBattles: LiveBattle[];
  }> {
    try {
      const response = await api.get("/api/user/battle-stats", {
        params: { userId },
      });
      return response.data;
    } catch (error) {
      console.error("Failed to fetch battle stats:", error);
      throw new Error("Failed to fetch battle stats");
    }
  }
  
  // Subscribe to live battle updates
  subscribeToBattleUpdates(battleId: string, callback: (battle: LiveBattle) => void): void {
    this.battleUpdateCallbacks.push(callback);
    
    if (!this.wsConnection) {
      this.connectToBattleWebSocket();
    }
    
    if (this.wsConnection?.readyState === WebSocket.OPEN) {
      this.wsConnection.send(JSON.stringify({
        type: "subscribe_battle",
        battleId,
      }));
    }
  }
  
  // Unsubscribe from battle updates
  unsubscribeFromBattleUpdates(callback: (battle: LiveBattle) => void): void {
    this.battleUpdateCallbacks = this.battleUpdateCallbacks.filter(cb => cb !== callback);
    
    if (this.battleUpdateCallbacks.length === 0 && this.wsConnection) {
      this.wsConnection.close();
      this.wsConnection = null;
    }
  }
  
  private connectToBattleWebSocket(): void {
    try {
      const wsUrl = `${process.env.VITE_WS_URL || "ws://localhost:3001"}/ws/battles`;
      this.wsConnection = new WebSocket(wsUrl);
      
      this.wsConnection.onopen = () => {
        console.log("Connected to battle WebSocket");
      };
      
      this.wsConnection.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          
          if (data.type === "battle_update") {
            this.battleUpdateCallbacks.forEach(callback => {
              callback(data.payload);
            });
          }
        } catch (error) {
          console.error("Failed to parse WebSocket message:", error);
        }
      };
      
      this.wsConnection.onerror = (error) => {
        console.error("Battle WebSocket error:", error);
      };
      
      this.wsConnection.onclose = () => {
        console.log("Battle WebSocket connection closed");
        // Attempt to reconnect after 3 seconds
        setTimeout(() => {
          if (this.battleUpdateCallbacks.length > 0) {
            this.connectToBattleWebSocket();
          }
        }, 3000);
      };
    } catch (error) {
      console.error("Failed to connect to battle WebSocket:", error);
    }
  }
  
  // Get trending battles
  async getTrendingBattles(limit = 10): Promise<LiveBattle[]> {
    try {
      const response = await api.get("/api/battles/trending", {
        params: { limit },
      });
      return response.data;
    } catch (error) {
      console.error("Failed to fetch trending battles:", error);
      throw new Error("Failed to fetch trending battles");
    }
  }
  
  // Get recommended opponents
  async getRecommendedOpponents(limit = 20): Promise<BattleParticipant[]> {
    try {
      const response = await api.get("/api/battles/recommended-opponents", {
        params: { limit },
      });
      return response.data;
    } catch (error) {
      console.error("Failed to fetch recommended opponents:", error);
      throw new Error("Failed to fetch recommendations");
    }
  }
  
  // Search for potential opponents
  async searchOpponents(query: string, filters?: {
    tier?: "rising_star" | "pro_creator" | "legend";
    minLevel?: number;
    maxLevel?: number;
    winRateMin?: number;
    winRateMax?: number;
  }): Promise<BattleParticipant[]> {
    try {
      const response = await api.get("/api/battles/search-opponents", {
        params: { query, ...filters },
      });
      return response.data;
    } catch (error) {
      console.error("Failed to search opponents:", error);
      throw new Error("Failed to search opponents");
    }
  }
  
  // Get battle analytics (admin/creator)
  async getBattleAnalytics(
    battleId: string
  ): Promise<{
    viewerAnalytics: {
      peakViewers: number;
      averageViewTime: number;
      viewerRetention: number[];
      geographicDistribution: { country: string; count: number }[];
      deviceBreakdown: { device: string; percentage: number }[];
    };
    engagementAnalytics: {
      totalMessages: number;
      totalTips: number;
      totalBets: number;
      messagesPerMinute: number[];
      tipsPerMinute: number[];
    };
    revenueAnalytics: {
      totalRevenue: number;
      tipRevenue: number;
      betRevenue: number;
      platformFees: number;
      participantEarnings: { participantId: string; earnings: number }[];
    };
  }> {
    try {
      const response = await api.get(`/api/battles/${battleId}/analytics`);
      return response.data;
    } catch (error) {
      console.error("Failed to fetch battle analytics:", error);
      throw new Error("Failed to fetch analytics");
    }
  }
  
  // Cancel a battle
  async cancelBattle(battleId: string, reason?: string): Promise<void> {
    try {
      await api.post(`/api/battles/${battleId}/cancel`, { reason });
    } catch (error: any) {
      console.error("Failed to cancel battle:", error);
      throw new Error(error.response?.data?.message || "Failed to cancel battle");
    }
  }
  
  // Leave a battle (before it starts)
  async leaveBattle(battleId: string): Promise<void> {
    try {
      await api.post(`/api/battles/${battleId}/leave`);
    } catch (error: any) {
      console.error("Failed to leave battle:", error);
      throw new Error(error.response?.data?.message || "Failed to leave battle");
    }
  }
  
  // Generate stream keys for participants
  async generateStreamKeys(battleId: string): Promise<{
    participant1StreamKey: string;
    participant2StreamKey: string;
    rtmpUrl: string;
  }> {
    try {
      const response = await api.post(`/api/battles/${battleId}/stream-keys`);
      return response.data;
    } catch (error: any) {
      console.error("Failed to generate stream keys:", error);
      throw new Error(error.response?.data?.message || "Failed to generate stream keys");
    }
  }
}

// Utility functions for battle management
export const BattleUtils = {
  // Calculate battle rank based on performance
  calculateBattleRank(
    battlesWon: number,
    battlesLost: number,
    totalEarnings: number,
    averageViewerCount: number
  ): {
    rank: number;
    tier: "rising_star" | "pro_creator" | "legend";
    nextTierRequirement: string;
  } {
    const winRate = battlesWon / (battlesWon + battlesLost) || 0;
    const totalBattles = battlesWon + battlesLost;
    
    // Calculate rank score
    const rankScore = 
      (winRate * 100) + 
      (Math.min(totalBattles, 100) * 0.5) + 
      (Math.min(totalEarnings / 1000, 50) * 2) + 
      (Math.min(averageViewerCount / 100, 20) * 1);
    
    let tier: "rising_star" | "pro_creator" | "legend";
    let nextTierRequirement: string;
    
    if (rankScore < 50) {
      tier = "rising_star";
      nextTierRequirement = "Win 5 battles or reach 1000 total views";
    } else if (rankScore < 150) {
      tier = "pro_creator";
      nextTierRequirement = "Win 20 battles and maintain 70% win rate";
    } else {
      tier = "legend";
      nextTierRequirement = "You've reached the highest tier!";
    }
    
    return {
      rank: Math.floor(rankScore),
      tier,
      nextTierRequirement,
    };
  },
  
  // Format battle duration
  formatBattleDuration(seconds: number): string {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  },
  
  // Calculate expected earnings
  calculateExpectedEarnings(
    averageViewerCount: number,
    averageTipPerViewer: number = 2,
    battleDuration: number = 180
  ): number {
    const baseEarnings = averageViewerCount * averageTipPerViewer;
    const durationMultiplier = Math.min(battleDuration / 180, 2); // Cap at 2x for longer battles
    return Math.floor(baseEarnings * durationMultiplier);
  },
  
  // Determine battle outcome probability
  calculateWinProbability(
    participant1: Pick<BattleParticipant, "battlesWon" | "battlesLost" | "level" | "tier">,
    participant2: Pick<BattleParticipant, "battlesWon" | "battlesLost" | "level" | "tier">
  ): { participant1WinProb: number; participant2WinProb: number } {
    const p1WinRate = participant1.battlesWon / (participant1.battlesWon + participant1.battlesLost) || 0.5;
    const p2WinRate = participant2.battlesWon / (participant2.battlesWon + participant2.battlesLost) || 0.5;
    
    const p1Score = p1WinRate * 100 + participant1.level * 2;
    const p2Score = p2WinRate * 100 + participant2.level * 2;
    
    const totalScore = p1Score + p2Score;
    
    return {
      participant1WinProb: p1Score / totalScore,
      participant2WinProb: p2Score / totalScore,
    };
  },
  
  // Validate battle creation
  validateBattleCreation(data: {
    duration: number;
    scheduledFor?: string;
    opponentId?: string;
    userLevel: number;
    userBattlesWon: number;
    userBattlesLost: number;
  }): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];
    
    if (data.duration < 60) {
      errors.push("Battle duration must be at least 1 minute");
    }
    
    if (data.duration > 1800) {
      errors.push("Battle duration cannot exceed 30 minutes");
    }
    
    if (data.scheduledFor) {
      const scheduledDate = new Date(data.scheduledFor);
      const now = new Date();
      const maxScheduleAhead = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000); // 7 days
      
      if (scheduledDate <= now) {
        errors.push("Scheduled time must be in the future");
      }
      
      if (scheduledDate > maxScheduleAhead) {
        errors.push("Cannot schedule battles more than 7 days in advance");
      }
    }
    
    // Level restrictions for new users
    if (data.userLevel < 3 && (data.userBattlesWon + data.userBattlesLost) === 0) {
      errors.push("Complete the tutorial and reach level 3 before creating battles");
    }
    
    return {
      isValid: errors.length === 0,
      errors,
    };
  },
};

export default new BattleService();
