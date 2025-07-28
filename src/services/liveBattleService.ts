import { api } from '../lib/api';

// =============================================================================
// TYPES
// =============================================================================

export interface LiveSession {
  id: string;
  creatorId: string;
  title: string;
  description?: string;
  category?: string;
  maxParticipants: number;
  currentParticipants: number;
  isPrivate: boolean;
  status: 'waiting' | 'live' | 'ended' | 'cancelled';
  startedAt?: Date;
  endedAt?: Date;
  peakViewers: number;
  totalViews: number;
  totalLikes: number;
  totalGifts: number;
  totalGiftValue: number;
  enableGifts: boolean;
  enableTips: boolean;
  chatEnabled: boolean;
  streamUrl?: string;
  recordingUrl?: string;
}

export interface LiveParticipant {
  id: string;
  sessionId: string;
  userId: string;
  role: 'host' | 'co-host' | 'guest' | 'viewer';
  canSpeak: boolean;
  canVideo: boolean;
  isActive: boolean;
  micEnabled: boolean;
  videoEnabled: boolean;
  joinedAt: Date;
  messagesCount: number;
}

export interface LiveChatMessage {
  id: string;
  sessionId: string;
  userId: string;
  message: string;
  messageType: 'text' | 'emoji' | 'sticker' | 'system';
  isSystemMessage: boolean;
  isPinned: boolean;
  replyToMessageId?: string;
  createdAt: Date;
}

export interface GiftType {
  id: string;
  name: string;
  emoji: string;
  softPointsValue: number;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  color?: string;
  hasAnimation: boolean;
  animationType?: string;
  comboMultiplier: number;
  isActive: boolean;
  addsToScore: boolean;
  scoreMultiplier: number;
}

export interface LiveGift {
  id: string;
  sessionId: string;
  giftTypeId: string;
  senderId: string;
  recipientId: string;
  quantity: number;
  totalValue: number;
  isCombo: boolean;
  comboCount: number;
  message?: string;
  isAnonymous: boolean;
  battleId?: string;
  addedToScore: number;
  createdAt: Date;
}

export interface BattleVote {
  id: string;
  battleId: string;
  voterId: string;
  votedFor: string;
  amountSP: number;
  oddsAtTimeOfVote: number;
  potentialPayout: number;
  status: 'active' | 'won' | 'lost' | 'refunded';
  actualPayout: number;
  confidence?: 'low' | 'medium' | 'high';
  createdAt: Date;
}

export interface VotingPool {
  creator1Total: number;
  creator2Total: number;
  totalPool: number;
  totalVoters: number;
}

// =============================================================================
// LIVE SESSION MANAGEMENT
// =============================================================================

export const liveBattleService = {
  // Live Sessions
  async createLiveSession(data: {
    title: string;
    description?: string;
    category?: string;
    maxParticipants?: number;
    isPrivate?: boolean;
    enableGifts?: boolean;
    enableTips?: boolean;
    chatEnabled?: boolean;
  }): Promise<LiveSession> {
    const response = await api.post('/live-sessions', data);
    return response.data;
  },

  async startLiveSession(sessionId: string): Promise<LiveSession> {
    const response = await api.post(`/live-sessions/${sessionId}/start`);
    return response.data;
  },

  async endLiveSession(sessionId: string): Promise<LiveSession> {
    const response = await api.post(`/live-sessions/${sessionId}/end`);
    return response.data;
  },

  async getLiveSession(sessionId: string): Promise<LiveSession> {
    const response = await api.get(`/live-sessions/${sessionId}`);
    return response.data;
  },

  async getActiveLiveSessions(category?: string, limit = 20): Promise<LiveSession[]> {
    const params = new URLSearchParams();
    if (category) params.append('category', category);
    params.append('limit', limit.toString());
    
    const response = await api.get(`/live-sessions/active?${params}`);
    return response.data;
  },

  async updateLiveSession(sessionId: string, data: Partial<LiveSession>): Promise<LiveSession> {
    const response = await api.patch(`/live-sessions/${sessionId}`, data);
    return response.data;
  },

  // Participants Management
  async joinLiveSession(sessionId: string): Promise<LiveParticipant> {
    const response = await api.post(`/live-sessions/${sessionId}/join`);
    return response.data;
  },

  async leaveLiveSession(sessionId: string): Promise<void> {
    await api.post(`/live-sessions/${sessionId}/leave`);
  },

  async inviteToLiveSession(sessionId: string, userId: string, role: 'co-host' | 'guest' = 'guest'): Promise<void> {
    await api.post(`/live-sessions/${sessionId}/invite`, { userId, role });
  },

  async updateParticipantRole(sessionId: string, participantId: string, role: string): Promise<LiveParticipant> {
    const response = await api.patch(`/live-sessions/${sessionId}/participants/${participantId}`, { role });
    return response.data;
  },

  async updateParticipantPermissions(
    sessionId: string, 
    participantId: string, 
    permissions: {
      canSpeak?: boolean;
      canVideo?: boolean;
      micEnabled?: boolean;
      videoEnabled?: boolean;
    }
  ): Promise<LiveParticipant> {
    const response = await api.patch(`/live-sessions/${sessionId}/participants/${participantId}`, permissions);
    return response.data;
  },

  async getSessionParticipants(sessionId: string): Promise<LiveParticipant[]> {
    const response = await api.get(`/live-sessions/${sessionId}/participants`);
    return response.data;
  },

  async kickParticipant(sessionId: string, participantId: string): Promise<void> {
    await api.delete(`/live-sessions/${sessionId}/participants/${participantId}`);
  },

  // =============================================================================
  // CHAT MANAGEMENT
  // =============================================================================

  async sendChatMessage(sessionId: string, message: string, replyToMessageId?: string): Promise<LiveChatMessage> {
    const response = await api.post(`/live-sessions/${sessionId}/chat`, {
      message,
      replyToMessageId,
    });
    return response.data;
  },

  async getChatMessages(sessionId: string, limit = 50, before?: string): Promise<LiveChatMessage[]> {
    const params = new URLSearchParams();
    params.append('limit', limit.toString());
    if (before) params.append('before', before);
    
    const response = await api.get(`/live-sessions/${sessionId}/chat?${params}`);
    return response.data;
  },

  async deleteChatMessage(sessionId: string, messageId: string, reason?: string): Promise<void> {
    await api.delete(`/live-sessions/${sessionId}/chat/${messageId}`, {
      data: { reason },
    });
  },

  async pinChatMessage(sessionId: string, messageId: string): Promise<LiveChatMessage> {
    const response = await api.post(`/live-sessions/${sessionId}/chat/${messageId}/pin`);
    return response.data;
  },

  async unpinChatMessage(sessionId: string, messageId: string): Promise<void> {
    await api.delete(`/live-sessions/${sessionId}/chat/${messageId}/pin`);
  },

  // =============================================================================
  // GIFT SYSTEM
  // =============================================================================

  async getGiftTypes(): Promise<GiftType[]> {
    const response = await api.get('/gifts/types');
    return response.data;
  },

  async sendGift(data: {
    sessionId: string;
    giftTypeId: string;
    recipientId: string;
    quantity?: number;
    message?: string;
    isAnonymous?: boolean;
  }): Promise<LiveGift> {
    const response = await api.post('/gifts/send', data);
    return response.data;
  },

  async getSessionGifts(sessionId: string, limit = 20): Promise<LiveGift[]> {
    const response = await api.get(`/live-sessions/${sessionId}/gifts?limit=${limit}`);
    return response.data;
  },

  async getUserGiftHistory(userId: string, limit = 20): Promise<LiveGift[]> {
    const response = await api.get(`/users/${userId}/gifts?limit=${limit}`);
    return response.data;
  },

  // =============================================================================
  // BATTLE VOTING SYSTEM
  // =============================================================================

  async placeBattleVote(data: {
    battleId: string;
    votedFor: string;
    amountSP: number;
    confidence?: 'low' | 'medium' | 'high';
  }): Promise<BattleVote> {
    const response = await api.post('/battles/vote', data);
    return response.data;
  },

  async getBattleVotes(battleId: string): Promise<BattleVote[]> {
    const response = await api.get(`/battles/${battleId}/votes`);
    return response.data;
  },

  async getUserBattleVotes(battleId: string): Promise<BattleVote[]> {
    const response = await api.get(`/battles/${battleId}/my-votes`);
    return response.data;
  },

  async getBattleVotingPool(battleId: string): Promise<VotingPool> {
    const response = await api.get(`/battles/${battleId}/voting-pool`);
    return response.data;
  },

  async getBattleOdds(battleId: string): Promise<{ creator1: number; creator2: number }> {
    const response = await api.get(`/battles/${battleId}/odds`);
    return response.data;
  },

  // =============================================================================
  // BATTLE MANAGEMENT
  // =============================================================================

  async initiateBattle(sessionId: string, participantIds: string[]): Promise<LiveSession> {
    const response = await api.post(`/live-sessions/${sessionId}/initiate-battle`, {
      participantIds,
    });
    return response.data;
  },

  async endBattle(sessionId: string): Promise<{
    winnerId: string;
    finalScores: Record<string, number>;
    totalPool: number;
    payouts: Array<{ userId: string; amount: number }>;
  }> {
    const response = await api.post(`/battles/${sessionId}/end`);
    return response.data;
  },

  async getBattleResults(battleId: string): Promise<{
    winnerId: string;
    finalScores: Record<string, number>;
    totalPool: number;
    winningCreatorBonus: number;
    platformFee: number;
    payouts: Array<{ userId: string; amount: number; status: string }>;
  }> {
    const response = await api.get(`/battles/${battleId}/results`);
    return response.data;
  },

  // =============================================================================
  // ANALYTICS
  // =============================================================================

  async getSessionAnalytics(sessionId: string): Promise<{
    averageViewTime: number;
    chatMessagesPerMinute: number;
    giftsPerMinute: number;
    uniqueViewers: number;
    peakConcurrentViewers: number;
    totalRevenue: number;
    topGifters: Array<{ userId: string; totalGifts: number; totalValue: number }>;
  }> {
    const response = await api.get(`/live-sessions/${sessionId}/analytics`);
    return response.data;
  },

  async getCreatorRankings(
    type: 'weekly' | 'monthly' | 'all_time' = 'weekly',
    category?: string,
    limit = 20
  ): Promise<Array<{
    userId: string;
    rank: number;
    totalStreams: number;
    totalViewers: number;
    totalRevenue: number;
    battlesWon: number;
    battlesLost: number;
    winRate: number;
    totalScore: number;
  }>> {
    const params = new URLSearchParams();
    params.append('type', type);
    params.append('limit', limit.toString());
    if (category) params.append('category', category);
    
    const response = await api.get(`/rankings/creators?${params}`);
    return response.data;
  },

  async getUserRanking(userId: string, type: 'weekly' | 'monthly' | 'all_time' = 'weekly'): Promise<{
    rank: number;
    totalScore: number;
    category: string;
    percentile: number;
  }> {
    const response = await api.get(`/rankings/users/${userId}?type=${type}`);
    return response.data;
  },

  // =============================================================================
  // REAL-TIME EVENTS (WebSocket helpers)
  // =============================================================================

  subscribeToSession(sessionId: string, callbacks: {
    onParticipantJoined?: (participant: LiveParticipant) => void;
    onParticipantLeft?: (participantId: string) => void;
    onChatMessage?: (message: LiveChatMessage) => void;
    onGiftSent?: (gift: LiveGift) => void;
    onVotePlaced?: (vote: BattleVote) => void;
    onSessionUpdate?: (session: Partial<LiveSession>) => void;
    onBattleUpdate?: (battleData: any) => void;
  }): () => void {
    // This would typically use WebSocket connection
    // For now, return a cleanup function
    const ws = new WebSocket(`${process.env.REACT_APP_WS_URL}/live-sessions/${sessionId}`);
    
    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      
      switch (data.type) {
        case 'participant_joined':
          callbacks.onParticipantJoined?.(data.participant);
          break;
        case 'participant_left':
          callbacks.onParticipantLeft?.(data.participantId);
          break;
        case 'chat_message':
          callbacks.onChatMessage?.(data.message);
          break;
        case 'gift_sent':
          callbacks.onGiftSent?.(data.gift);
          break;
        case 'vote_placed':
          callbacks.onVotePlaced?.(data.vote);
          break;
        case 'session_update':
          callbacks.onSessionUpdate?.(data.session);
          break;
        case 'battle_update':
          callbacks.onBattleUpdate?.(data.battleData);
          break;
      }
    };

    return () => {
      ws.close();
    };
  },

  // =============================================================================
  // UTILITY FUNCTIONS
  // =============================================================================

  calculateOdds(votingPool: VotingPool): { creator1: number; creator2: number } {
    const total = votingPool.creator1Total + votingPool.creator2Total;
    if (total === 0) return { creator1: 1.5, creator2: 1.5 };

    const creator1Odds = Math.max(1.1, (total / Math.max(votingPool.creator1Total, 1)) * 0.9);
    const creator2Odds = Math.max(1.1, (total / Math.max(votingPool.creator2Total, 1)) * 0.9);

    return { creator1: creator1Odds, creator2: creator2Odds };
  },

  calculatePayout(vote: BattleVote, isWinner: boolean, totalWinnersPool: number, totalWinningVotes: number): number {
    if (!isWinner) return 0;
    
    const shareOfWinningPool = vote.amountSP / totalWinningVotes;
    return shareOfWinningPool * totalWinnersPool * 0.7; // 70% to winners
  },

  formatStreamDuration(seconds: number): string {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  },

  formatNumber(num: number): string {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num.toString();
  },
};

export default liveBattleService;
