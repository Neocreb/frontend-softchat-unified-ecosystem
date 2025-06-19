// Community Events Service
// Handles API calls and data management for live community events

export interface LiveEvent {
  id: string;
  title: string;
  description: string;
  type:
    | "trading"
    | "marketplace"
    | "workshop"
    | "freelance"
    | "challenge"
    | "social";
  hostId: string;
  host: {
    id: string;
    name: string;
    avatar: string;
    verified: boolean;
  };
  startTime: string;
  endTime: string;
  duration: number; // in minutes
  participants: number;
  maxParticipants: number;
  isLive: boolean;
  isPremium: boolean;
  tags: string[];
  thumbnail: string;
  category: string;
  status: "scheduled" | "live" | "ended" | "cancelled";
  rewards?: {
    type: "points" | "crypto" | "nft" | "discount";
    amount: number;
    description: string;
  };
  requirements?: string[];
  featured?: boolean;
  recording?: {
    available: boolean;
    url?: string;
    duration?: number;
  };
  analytics?: {
    totalViews: number;
    peakViewers: number;
    engagementScore: number;
    averageWatchTime: number;
  };
}

export interface EventParticipant {
  id: string;
  eventId: string;
  userId: string;
  user: {
    id: string;
    name: string;
    avatar: string;
    verified: boolean;
  };
  role: "host" | "moderator" | "speaker" | "viewer";
  joinedAt: string;
  leftAt?: string;
  isActive: boolean;
  permissions: {
    canSpeak: boolean;
    canShare: boolean;
    canModerate: boolean;
  };
  status: {
    isVideoOn: boolean;
    isAudioOn: boolean;
    handRaised: boolean;
    isScreenSharing: boolean;
  };
}

export interface EventMessage {
  id: string;
  eventId: string;
  userId: string;
  userName: string;
  userAvatar: string;
  message: string;
  timestamp: string;
  type: "message" | "reaction" | "system" | "poll" | "announcement";
  metadata?: {
    reactionType?: string;
    pollOptions?: string[];
    systemAction?: string;
  };
}

export interface EventStats {
  eventId: string;
  currentViewers: number;
  totalJoined: number;
  messagesCount: number;
  reactionsCount: number;
  engagementRate: number;
  averageWatchTime: number;
  revenueGenerated?: number;
}

class CommunityEventsService {
  private baseUrl = "/api/events";

  // Event Management
  async getEvents(filters?: {
    type?: string;
    category?: string;
    status?: string;
    featured?: boolean;
    hostId?: string;
    limit?: number;
    offset?: number;
  }): Promise<{ events: LiveEvent[]; total: number; hasMore: boolean }> {
    try {
      const params = new URLSearchParams();
      if (filters) {
        Object.entries(filters).forEach(([key, value]) => {
          if (value !== undefined) {
            params.append(key, value.toString());
          }
        });
      }

      const response = await fetch(`${this.baseUrl}?${params}`);
      if (!response.ok) throw new Error("Failed to fetch events");

      return await response.json();
    } catch (error) {
      console.error("Error fetching events:", error);
      throw error;
    }
  }

  async getEvent(eventId: string): Promise<LiveEvent> {
    try {
      const response = await fetch(`${this.baseUrl}/${eventId}`);
      if (!response.ok) throw new Error("Failed to fetch event");

      return await response.json();
    } catch (error) {
      console.error("Error fetching event:", error);
      throw error;
    }
  }

  async createEvent(eventData: Partial<LiveEvent>): Promise<LiveEvent> {
    try {
      const response = await fetch(this.baseUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(eventData),
      });

      if (!response.ok) throw new Error("Failed to create event");

      return await response.json();
    } catch (error) {
      console.error("Error creating event:", error);
      throw error;
    }
  }

  async updateEvent(
    eventId: string,
    eventData: Partial<LiveEvent>,
  ): Promise<LiveEvent> {
    try {
      const response = await fetch(`${this.baseUrl}/${eventId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(eventData),
      });

      if (!response.ok) throw new Error("Failed to update event");

      return await response.json();
    } catch (error) {
      console.error("Error updating event:", error);
      throw error;
    }
  }

  async deleteEvent(eventId: string): Promise<void> {
    try {
      const response = await fetch(`${this.baseUrl}/${eventId}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Failed to delete event");
    } catch (error) {
      console.error("Error deleting event:", error);
      throw error;
    }
  }

  // Participation Management
  async joinEvent(
    eventId: string,
  ): Promise<{ success: boolean; participantId: string }> {
    try {
      const response = await fetch(`${this.baseUrl}/${eventId}/join`, {
        method: "POST",
      });

      if (!response.ok) throw new Error("Failed to join event");

      return await response.json();
    } catch (error) {
      console.error("Error joining event:", error);
      throw error;
    }
  }

  async leaveEvent(eventId: string): Promise<{ success: boolean }> {
    try {
      const response = await fetch(`${this.baseUrl}/${eventId}/leave`, {
        method: "POST",
      });

      if (!response.ok) throw new Error("Failed to leave event");

      return await response.json();
    } catch (error) {
      console.error("Error leaving event:", error);
      throw error;
    }
  }

  async getParticipants(eventId: string): Promise<EventParticipant[]> {
    try {
      const response = await fetch(`${this.baseUrl}/${eventId}/participants`);
      if (!response.ok) throw new Error("Failed to fetch participants");

      return await response.json();
    } catch (error) {
      console.error("Error fetching participants:", error);
      throw error;
    }
  }

  async updateParticipantStatus(
    eventId: string,
    participantId: string,
    status: Partial<EventParticipant["status"]>,
  ): Promise<{ success: boolean }> {
    try {
      const response = await fetch(
        `${this.baseUrl}/${eventId}/participants/${participantId}/status`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(status),
        },
      );

      if (!response.ok) throw new Error("Failed to update participant status");

      return await response.json();
    } catch (error) {
      console.error("Error updating participant status:", error);
      throw error;
    }
  }

  // Chat and Messaging
  async getEventMessages(
    eventId: string,
    limit = 50,
    offset = 0,
  ): Promise<EventMessage[]> {
    try {
      const response = await fetch(
        `${this.baseUrl}/${eventId}/messages?limit=${limit}&offset=${offset}`,
      );
      if (!response.ok) throw new Error("Failed to fetch messages");

      return await response.json();
    } catch (error) {
      console.error("Error fetching messages:", error);
      throw error;
    }
  }

  async sendMessage(
    eventId: string,
    message: string,
    type: EventMessage["type"] = "message",
  ): Promise<EventMessage> {
    try {
      const response = await fetch(`${this.baseUrl}/${eventId}/messages`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message, type }),
      });

      if (!response.ok) throw new Error("Failed to send message");

      return await response.json();
    } catch (error) {
      console.error("Error sending message:", error);
      throw error;
    }
  }

  async sendReaction(
    eventId: string,
    reactionType: string,
  ): Promise<{ success: boolean }> {
    try {
      const response = await fetch(`${this.baseUrl}/${eventId}/reactions`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ reactionType }),
      });

      if (!response.ok) throw new Error("Failed to send reaction");

      return await response.json();
    } catch (error) {
      console.error("Error sending reaction:", error);
      throw error;
    }
  }

  // Analytics and Stats
  async getEventStats(eventId: string): Promise<EventStats> {
    try {
      const response = await fetch(`${this.baseUrl}/${eventId}/stats`);
      if (!response.ok) throw new Error("Failed to fetch event stats");

      return await response.json();
    } catch (error) {
      console.error("Error fetching event stats:", error);
      throw error;
    }
  }

  async getHostAnalytics(
    hostId: string,
    period = "30d",
  ): Promise<{
    totalEvents: number;
    totalViewers: number;
    averageEngagement: number;
    revenue: number;
    topEvents: LiveEvent[];
  }> {
    try {
      const response = await fetch(
        `${this.baseUrl}/analytics/host/${hostId}?period=${period}`,
      );
      if (!response.ok) throw new Error("Failed to fetch host analytics");

      return await response.json();
    } catch (error) {
      console.error("Error fetching host analytics:", error);
      throw error;
    }
  }

  // Real-time Features
  async startLiveStream(
    eventId: string,
  ): Promise<{ streamKey: string; streamUrl: string }> {
    try {
      const response = await fetch(`${this.baseUrl}/${eventId}/stream/start`, {
        method: "POST",
      });

      if (!response.ok) throw new Error("Failed to start live stream");

      return await response.json();
    } catch (error) {
      console.error("Error starting live stream:", error);
      throw error;
    }
  }

  async stopLiveStream(
    eventId: string,
  ): Promise<{ success: boolean; recordingUrl?: string }> {
    try {
      const response = await fetch(`${this.baseUrl}/${eventId}/stream/stop`, {
        method: "POST",
      });

      if (!response.ok) throw new Error("Failed to stop live stream");

      return await response.json();
    } catch (error) {
      console.error("Error stopping live stream:", error);
      throw error;
    }
  }

  // Event-Specific Features
  async createTradingSession(
    eventId: string,
    tradingData: {
      portfolioSharing: boolean;
      priceAlerts: boolean;
      allowedAssets: string[];
    },
  ): Promise<{ success: boolean }> {
    try {
      const response = await fetch(`${this.baseUrl}/${eventId}/trading/setup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(tradingData),
      });

      if (!response.ok) throw new Error("Failed to setup trading session");

      return await response.json();
    } catch (error) {
      console.error("Error setting up trading session:", error);
      throw error;
    }
  }

  async createMarketplaceEvent(
    eventId: string,
    marketplaceData: {
      products: string[];
      discountPercentage: number;
      flashSaleDuration: number;
      groupBuyingEnabled: boolean;
    },
  ): Promise<{ success: boolean }> {
    try {
      const response = await fetch(
        `${this.baseUrl}/${eventId}/marketplace/setup`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(marketplaceData),
        },
      );

      if (!response.ok) throw new Error("Failed to setup marketplace event");

      return await response.json();
    } catch (error) {
      console.error("Error setting up marketplace event:", error);
      throw error;
    }
  }

  async issueEventRewards(
    eventId: string,
    participantIds: string[],
  ): Promise<{ success: boolean; rewardsIssued: number }> {
    try {
      const response = await fetch(`${this.baseUrl}/${eventId}/rewards/issue`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ participantIds }),
      });

      if (!response.ok) throw new Error("Failed to issue rewards");

      return await response.json();
    } catch (error) {
      console.error("Error issuing rewards:", error);
      throw error;
    }
  }

  // Search and Discovery
  async searchEvents(
    query: string,
    filters?: {
      type?: string;
      category?: string;
      startDate?: string;
      endDate?: string;
    },
  ): Promise<LiveEvent[]> {
    try {
      const params = new URLSearchParams({ q: query });
      if (filters) {
        Object.entries(filters).forEach(([key, value]) => {
          if (value) params.append(key, value);
        });
      }

      const response = await fetch(`${this.baseUrl}/search?${params}`);
      if (!response.ok) throw new Error("Failed to search events");

      return await response.json();
    } catch (error) {
      console.error("Error searching events:", error);
      throw error;
    }
  }

  async getTrendingEvents(limit = 10): Promise<LiveEvent[]> {
    try {
      const response = await fetch(`${this.baseUrl}/trending?limit=${limit}`);
      if (!response.ok) throw new Error("Failed to fetch trending events");

      return await response.json();
    } catch (error) {
      console.error("Error fetching trending events:", error);
      throw error;
    }
  }

  async getRecommendedEvents(userId: string, limit = 10): Promise<LiveEvent[]> {
    try {
      const response = await fetch(
        `${this.baseUrl}/recommended/${userId}?limit=${limit}`,
      );
      if (!response.ok) throw new Error("Failed to fetch recommended events");

      return await response.json();
    } catch (error) {
      console.error("Error fetching recommended events:", error);
      throw error;
    }
  }
}

export const communityEventsService = new CommunityEventsService();
