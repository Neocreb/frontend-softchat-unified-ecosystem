import { api } from "@/lib/api";

export interface BattleBet {
  id: string;
  battleId: string;
  userId: string;
  betOnParticipant: string;
  betAmount: number;
  currency: "SOFT_POINTS" | "USDT";
  oddsWhenPlaced: number;
  potentialPayout: number;
  status: "active" | "won" | "lost" | "cancelled" | "refunded";
  isWinning?: boolean;
  actualPayout: number;
  payoutProcessed: boolean;
  placedAt: string;
  lockedAt?: string;
  metadata?: any;
}

export interface BattleBetOdds {
  participant1Odds: number;
  participant2Odds: number;
  totalPool: number;
  participant1Pool: number;
  participant2Pool: number;
  participant1Percentage: number;
  participant2Percentage: number;
}

export interface BettingStats {
  totalBetsPlaced: number;
  totalAmountBet: number;
  winRate: number;
  totalWinnings: number;
  biggestWin: number;
  currentStreak: number;
  longestStreak: number;
}

export interface LiveBattleOdds {
  battleId: string;
  odds: BattleBetOdds;
  bettingLocked: boolean;
  timeUntilLock: number; // seconds
  minimumBet: number;
  maximumBet: number;
  platformFeePercentage: number;
}

class BattleBettingService {
  private wsConnection: WebSocket | null = null;
  private oddsUpdateCallbacks: ((odds: LiveBattleOdds) => void)[] = [];
  
  // Get current battle odds
  async getBattleOdds(battleId: string): Promise<LiveBattleOdds> {
    try {
      const response = await api.get(`/api/battles/${battleId}/odds`);
      return response.data;
    } catch (error) {
      console.error("Failed to fetch battle odds:", error);
      throw new Error("Failed to fetch betting odds");
    }
  }
  
  // Place a bet on a battle
  async placeBet(
    battleId: string,
    participantId: string,
    amount: number,
    currency: "SOFT_POINTS" | "USDT" = "SOFT_POINTS"
  ): Promise<BattleBet> {
    try {
      const response = await api.post(`/api/battles/${battleId}/bets`, {
        betOnParticipant: participantId,
        betAmount: amount,
        currency,
      });
      
      return response.data;
    } catch (error: any) {
      console.error("Failed to place bet:", error);
      throw new Error(error.response?.data?.message || "Failed to place bet");
    }
  }
  
  // Get user's bet for a specific battle
  async getUserBet(battleId: string): Promise<BattleBet | null> {
    try {
      const response = await api.get(`/api/battles/${battleId}/my-bet`);
      return response.data;
    } catch (error: any) {
      if (error.response?.status === 404) {
        return null; // No bet placed
      }
      console.error("Failed to fetch user bet:", error);
      throw new Error("Failed to fetch your bet");
    }
  }
  
  // Get all bets for a battle (admin/moderator only)
  async getBattleBets(battleId: string): Promise<BattleBet[]> {
    try {
      const response = await api.get(`/api/battles/${battleId}/bets`);
      return response.data;
    } catch (error) {
      console.error("Failed to fetch battle bets:", error);
      throw new Error("Failed to fetch battle bets");
    }
  }
  
  // Get user's betting history
  async getUserBettingHistory(limit = 20, offset = 0): Promise<{
    bets: BattleBet[];
    total: number;
    stats: BettingStats;
  }> {
    try {
      const response = await api.get("/api/user/betting-history", {
        params: { limit, offset }
      });
      return response.data;
    } catch (error) {
      console.error("Failed to fetch betting history:", error);
      throw new Error("Failed to fetch betting history");
    }
  }
  
  // Calculate optimal bet amount based on Kelly Criterion
  calculateOptimalBet(
    bankroll: number,
    odds: number,
    winProbability: number,
    maxBetPercentage = 0.25 // Never bet more than 25% of bankroll
  ): number {
    const b = odds - 1; // Net odds received on the bet
    const p = winProbability;
    const q = 1 - p; // Probability of losing
    
    // Kelly fraction: f = (bp - q) / b
    const kellyFraction = (b * p - q) / b;
    
    // Apply safety margin and cap
    const safeFraction = Math.max(0, Math.min(kellyFraction * 0.5, maxBetPercentage));
    
    return Math.floor(bankroll * safeFraction);
  }
  
  // Get betting recommendations based on historical data
  async getBettingRecommendations(battleId: string): Promise<{
    recommendation: "participant1" | "participant2" | "no_bet";
    confidence: number;
    reasoning: string[];
    suggestedAmount?: number;
  }> {
    try {
      const response = await api.get(`/api/battles/${battleId}/betting-recommendations`);
      return response.data;
    } catch (error) {
      console.error("Failed to fetch betting recommendations:", error);
      throw new Error("Failed to fetch recommendations");
    }
  }
  
  // Subscribe to live odds updates via WebSocket
  subscribeToOddsUpdates(battleId: string, callback: (odds: LiveBattleOdds) => void): void {
    this.oddsUpdateCallbacks.push(callback);
    
    if (!this.wsConnection) {
      this.connectToOddsWebSocket();
    }
    
    // Subscribe to specific battle
    if (this.wsConnection?.readyState === WebSocket.OPEN) {
      this.wsConnection.send(JSON.stringify({
        type: "subscribe_odds",
        battleId,
      }));
    }
  }
  
  // Unsubscribe from odds updates
  unsubscribeFromOddsUpdates(callback: (odds: LiveBattleOdds) => void): void {
    this.oddsUpdateCallbacks = this.oddsUpdateCallbacks.filter(cb => cb !== callback);
    
    if (this.oddsUpdateCallbacks.length === 0 && this.wsConnection) {
      this.wsConnection.close();
      this.wsConnection = null;
    }
  }
  
  private connectToOddsWebSocket(): void {
    try {
      const wsUrl = `${process.env.VITE_WS_URL || "ws://localhost:3001"}/ws/battle-odds`;
      this.wsConnection = new WebSocket(wsUrl);
      
      this.wsConnection.onopen = () => {
        console.log("Connected to battle odds WebSocket");
      };
      
      this.wsConnection.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          
          if (data.type === "odds_update") {
            this.oddsUpdateCallbacks.forEach(callback => {
              callback(data.payload);
            });
          }
        } catch (error) {
          console.error("Failed to parse WebSocket message:", error);
        }
      };
      
      this.wsConnection.onerror = (error) => {
        console.error("WebSocket error:", error);
      };
      
      this.wsConnection.onclose = () => {
        console.log("Battle odds WebSocket connection closed");
        // Attempt to reconnect after 3 seconds
        setTimeout(() => {
          if (this.oddsUpdateCallbacks.length > 0) {
            this.connectToOddsWebSocket();
          }
        }, 3000);
      };
    } catch (error) {
      console.error("Failed to connect to odds WebSocket:", error);
    }
  }
  
  // Cancel a bet (only allowed before battle starts)
  async cancelBet(betId: string): Promise<void> {
    try {
      await api.delete(`/api/bets/${betId}`);
    } catch (error: any) {
      console.error("Failed to cancel bet:", error);
      throw new Error(error.response?.data?.message || "Failed to cancel bet");
    }
  }
  
  // Process battle result and distribute winnings (admin only)
  async processBattleResult(
    battleId: string,
    winnerId: string
  ): Promise<{
    totalWinners: number;
    totalPayout: number;
    platformFee: number;
  }> {
    try {
      const response = await api.post(`/api/battles/${battleId}/process-result`, {
        winnerId,
      });
      return response.data;
    } catch (error: any) {
      console.error("Failed to process battle result:", error);
      throw new Error(error.response?.data?.message || "Failed to process battle result");
    }
  }
  
  // Get betting leaderboard
  async getBettingLeaderboard(
    period: "daily" | "weekly" | "monthly" | "all_time" = "weekly",
    limit = 50
  ): Promise<{
    leaderboard: {
      userId: string;
      username: string;
      displayName: string;
      avatar: string;
      totalWinnings: number;
      winRate: number;
      betsPlaced: number;
      rank: number;
    }[];
    userRank?: number;
  }> {
    try {
      const response = await api.get("/api/betting/leaderboard", {
        params: { period, limit }
      });
      return response.data;
    } catch (error) {
      console.error("Failed to fetch betting leaderboard:", error);
      throw new Error("Failed to fetch leaderboard");
    }
  }
  
  // Get betting analytics for admin dashboard
  async getBettingAnalytics(
    startDate: string,
    endDate: string
  ): Promise<{
    totalBets: number;
    totalVolume: number;
    totalPlatformFees: number;
    averageBetSize: number;
    popularBettingHours: number[];
    winRateDistribution: { winRate: number; userCount: number }[];
    topBettors: { userId: string; username: string; totalVolume: number }[];
  }> {
    try {
      const response = await api.get("/api/admin/betting-analytics", {
        params: { startDate, endDate }
      });
      return response.data;
    } catch (error) {
      console.error("Failed to fetch betting analytics:", error);
      throw new Error("Failed to fetch betting analytics");
    }
  }
  
  // Responsible gambling features
  async setBettingLimits(limits: {
    dailyLimit?: number;
    weeklyLimit?: number;
    monthlyLimit?: number;
    maxBetSize?: number;
  }): Promise<void> {
    try {
      await api.post("/api/user/betting-limits", limits);
    } catch (error: any) {
      console.error("Failed to set betting limits:", error);
      throw new Error(error.response?.data?.message || "Failed to set betting limits");
    }
  }
  
  async getBettingLimits(): Promise<{
    dailyLimit: number;
    weeklyLimit: number;
    monthlyLimit: number;
    maxBetSize: number;
    currentDailySpent: number;
    currentWeeklySpent: number;
    currentMonthlySpent: number;
  }> {
    try {
      const response = await api.get("/api/user/betting-limits");
      return response.data;
    } catch (error) {
      console.error("Failed to fetch betting limits:", error);
      throw new Error("Failed to fetch betting limits");
    }
  }
  
  // Self-exclusion features
  async setSelfExclusion(duration: "24h" | "7d" | "30d" | "permanent"): Promise<void> {
    try {
      await api.post("/api/user/self-exclusion", { duration });
    } catch (error: any) {
      console.error("Failed to set self-exclusion:", error);
      throw new Error(error.response?.data?.message || "Failed to set self-exclusion");
    }
  }
  
  // Validate bet before placing
  validateBet(
    amount: number,
    userBalance: number,
    limits: {
      minimumBet: number;
      maximumBet: number;
      dailyLimit: number;
      currentDailySpent: number;
    }
  ): {
    isValid: boolean;
    errors: string[];
  } {
    const errors: string[] = [];
    
    if (amount < limits.minimumBet) {
      errors.push(`Minimum bet is ${limits.minimumBet} SoftPoints`);
    }
    
    if (amount > limits.maximumBet) {
      errors.push(`Maximum bet is ${limits.maximumBet} SoftPoints`);
    }
    
    if (amount > userBalance) {
      errors.push("Insufficient balance");
    }
    
    if (limits.currentDailySpent + amount > limits.dailyLimit) {
      const remaining = limits.dailyLimit - limits.currentDailySpent;
      errors.push(`Daily limit exceeded. Remaining: ${remaining} SoftPoints`);
    }
    
    return {
      isValid: errors.length === 0,
      errors,
    };
  }
}

// Utility functions for betting calculations
export const BettingUtils = {
  // Calculate implied probability from odds
  calculateImpliedProbability(odds: number): number {
    return 1 / odds;
  },
  
  // Calculate potential payout
  calculatePayout(betAmount: number, odds: number): number {
    return betAmount * odds;
  },
  
  // Calculate net profit
  calculateProfit(betAmount: number, odds: number): number {
    return betAmount * (odds - 1);
  },
  
  // Format odds display
  formatOdds(odds: number): string {
    return `${odds.toFixed(2)}x`;
  },
  
  // Calculate house edge
  calculateHouseEdge(participant1Odds: number, participant2Odds: number): number {
    const impliedProb1 = 1 / participant1Odds;
    const impliedProb2 = 1 / participant2Odds;
    return (impliedProb1 + impliedProb2 - 1) * 100; // Convert to percentage
  },
  
  // Calculate fair odds (without house edge)
  calculateFairOdds(
    participant1Pool: number,
    participant2Pool: number
  ): { participant1Odds: number; participant2Odds: number } {
    const totalPool = participant1Pool + participant2Pool;
    
    if (totalPool === 0) {
      return { participant1Odds: 2.0, participant2Odds: 2.0 };
    }
    
    const participant1Odds = totalPool / participant2Pool || 1.01;
    const participant2Odds = totalPool / participant1Pool || 1.01;
    
    return { participant1Odds, participant2Odds };
  },
  
  // Calculate ROI
  calculateROI(totalWinnings: number, totalBets: number): number {
    if (totalBets === 0) return 0;
    return ((totalWinnings - totalBets) / totalBets) * 100;
  },
  
  // Risk assessment
  assessRisk(
    winRate: number,
    averageBetSize: number,
    bankroll: number
  ): "low" | "medium" | "high" | "very_high" {
    const bankrollPercentage = averageBetSize / bankroll;
    
    if (bankrollPercentage > 0.5) return "very_high";
    if (bankrollPercentage > 0.25) return "high";
    if (bankrollPercentage > 0.1) return "medium";
    return "low";
  },
};

export default new BattleBettingService();
