export interface LiveStream {
  id: string;
  title: string;
  description: string;
  streamerId: string;
  streamerName: string;
  streamerAvatar: string;
  category: string;
  thumbnailUrl: string;
  streamUrl: string;
  viewerCount: number;
  isLive: boolean;
  startedAt: Date;
  endedAt?: Date;
  tags: string[];
  chatEnabled: boolean;
  settings: {
    quality: "low" | "medium" | "high" | "ultra";
    privacy: "public" | "unlisted" | "private";
    allowRecording: boolean;
    moderationEnabled: boolean;
  };
  stats: {
    peakViewers: number;
    totalViews: number;
    duration: number;
    likes: number;
    shares: number;
  };
}

export interface StreamMessage {
  id: string;
  streamId: string;
  userId: string;
  username: string;
  userAvatar: string;
  message: string;
  timestamp: Date;
  type: "message" | "gift" | "follow" | "system";
  metadata?: {
    giftType?: string;
    giftValue?: number;
    isModerated?: boolean;
  };
}

export interface StreamAnalytics {
  streamId: string;
  viewerHistory: { timestamp: Date; count: number }[];
  engagement: {
    likes: number;
    shares: number;
    comments: number;
    averageWatchTime: number;
  };
  demographics: {
    countries: { [key: string]: number };
    ageGroups: { [key: string]: number };
    devices: { [key: string]: number };
  };
  revenue: {
    gifts: number;
    donations: number;
    subscriptions: number;
  };
}

// Mock live streaming data
const mockLiveStreams: LiveStream[] = [
  {
    id: "stream-1",
    title: "Crypto Trading Live Analysis",
    description: "Real-time market analysis and trading strategies",
    streamerId: "user-1",
    streamerName: "CryptoExpert",
    streamerAvatar:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face",
    category: "finance",
    thumbnailUrl:
      "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=400&h=300&fit=crop",
    streamUrl: "wss://stream.example.com/stream-1",
    viewerCount: 1247,
    isLive: true,
    startedAt: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
    tags: ["crypto", "trading", "bitcoin", "analysis"],
    chatEnabled: true,
    settings: {
      quality: "high",
      privacy: "public",
      allowRecording: true,
      moderationEnabled: true,
    },
    stats: {
      peakViewers: 1847,
      totalViews: 5420,
      duration: 120, // minutes
      likes: 892,
      shares: 156,
    },
  },
  {
    id: "stream-2",
    title: "Building the Future: Web3 Development",
    description: "Live coding session - building a DeFi application",
    streamerId: "user-2",
    streamerName: "DevMaster",
    streamerAvatar:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face",
    category: "technology",
    thumbnailUrl:
      "https://images.unsplash.com/photo-1517077304055-6e89abbf09b0?w=400&h=300&fit=crop",
    streamUrl: "wss://stream.example.com/stream-2",
    viewerCount: 856,
    isLive: true,
    startedAt: new Date(Date.now() - 45 * 60 * 1000), // 45 minutes ago
    tags: ["coding", "web3", "blockchain", "development"],
    chatEnabled: true,
    settings: {
      quality: "ultra",
      privacy: "public",
      allowRecording: true,
      moderationEnabled: true,
    },
    stats: {
      peakViewers: 1200,
      totalViews: 2840,
      duration: 45,
      likes: 567,
      shares: 89,
    },
  },
  {
    id: "stream-3",
    title: "Digital Art Creation Process",
    description: "Creating NFT artwork live with community",
    streamerId: "user-3",
    streamerName: "ArtistPro",
    streamerAvatar:
      "https://images.unsplash.com/photo-1494790108755-2616b9e7af93?w=100&h=100&fit=crop&crop=face",
    category: "art",
    thumbnailUrl:
      "https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=400&h=300&fit=crop",
    streamUrl: "wss://stream.example.com/stream-3",
    viewerCount: 432,
    isLive: true,
    startedAt: new Date(Date.now() - 30 * 60 * 1000), // 30 minutes ago
    tags: ["art", "nft", "digital", "creative"],
    chatEnabled: true,
    settings: {
      quality: "high",
      privacy: "public",
      allowRecording: false,
      moderationEnabled: true,
    },
    stats: {
      peakViewers: 650,
      totalViews: 1560,
      duration: 30,
      likes: 324,
      shares: 45,
    },
  },
];

class LiveStreamingService {
  private streams: Map<string, LiveStream> = new Map();
  private messages: Map<string, StreamMessage[]> = new Map();
  private analytics: Map<string, StreamAnalytics> = new Map();

  constructor() {
    // Initialize with mock data
    mockLiveStreams.forEach((stream) => {
      this.streams.set(stream.id, stream);
      this.messages.set(stream.id, this.generateMockMessages(stream.id));
      this.analytics.set(stream.id, this.generateMockAnalytics(stream.id));
    });
  }

  // Get all live streams
  async getLiveStreams(category?: string): Promise<LiveStream[]> {
    const streams = Array.from(this.streams.values())
      .filter((stream) => stream.isLive)
      .filter((stream) => !category || stream.category === category)
      .sort((a, b) => b.viewerCount - a.viewerCount);

    return streams;
  }

  // Get stream by ID
  async getStream(streamId: string): Promise<LiveStream | null> {
    return this.streams.get(streamId) || null;
  }

  // Start a new live stream
  async startStream(
    streamData: Omit<LiveStream, "id" | "isLive" | "startedAt" | "stats">,
  ): Promise<LiveStream> {
    const newStream: LiveStream = {
      ...streamData,
      id: `stream-${Date.now()}`,
      isLive: true,
      startedAt: new Date(),
      stats: {
        peakViewers: 0,
        totalViews: 0,
        duration: 0,
        likes: 0,
        shares: 0,
      },
    };

    this.streams.set(newStream.id, newStream);
    this.messages.set(newStream.id, []);
    this.analytics.set(newStream.id, this.generateMockAnalytics(newStream.id));

    return newStream;
  }

  // End a live stream
  async endStream(streamId: string): Promise<void> {
    const stream = this.streams.get(streamId);
    if (stream) {
      stream.isLive = false;
      stream.endedAt = new Date();
      stream.stats.duration = Math.floor(
        (stream.endedAt.getTime() - stream.startedAt.getTime()) / 60000,
      );
      this.streams.set(streamId, stream);
    }
  }

  // Update stream settings
  async updateStreamSettings(
    streamId: string,
    settings: Partial<LiveStream["settings"]>,
  ): Promise<void> {
    const stream = this.streams.get(streamId);
    if (stream) {
      stream.settings = { ...stream.settings, ...settings };
      this.streams.set(streamId, stream);
    }
  }

  // Get stream messages/chat
  async getStreamMessages(
    streamId: string,
    limit: number = 50,
  ): Promise<StreamMessage[]> {
    const messages = this.messages.get(streamId) || [];
    return messages.slice(-limit);
  }

  // Send message to stream chat
  async sendMessage(
    streamId: string,
    message: Omit<StreamMessage, "id" | "timestamp">,
  ): Promise<StreamMessage> {
    const newMessage: StreamMessage = {
      ...message,
      id: `msg-${Date.now()}`,
      timestamp: new Date(),
    };

    const messages = this.messages.get(streamId) || [];
    messages.push(newMessage);
    this.messages.set(streamId, messages);

    return newMessage;
  }

  // Get stream analytics
  async getStreamAnalytics(streamId: string): Promise<StreamAnalytics | null> {
    return this.analytics.get(streamId) || null;
  }

  // Search live streams
  async searchStreams(query: string, category?: string): Promise<LiveStream[]> {
    const streams = Array.from(this.streams.values())
      .filter((stream) => stream.isLive)
      .filter((stream) => !category || stream.category === category)
      .filter(
        (stream) =>
          stream.title.toLowerCase().includes(query.toLowerCase()) ||
          stream.description.toLowerCase().includes(query.toLowerCase()) ||
          stream.tags.some((tag) =>
            tag.toLowerCase().includes(query.toLowerCase()),
          ),
      );

    return streams;
  }

  // Get recommended streams for user
  async getRecommendedStreams(userId: string): Promise<LiveStream[]> {
    // Mock recommendation logic
    const streams = Array.from(this.streams.values())
      .filter((stream) => stream.isLive)
      .sort((a, b) => b.viewerCount - a.viewerCount)
      .slice(0, 6);

    return streams;
  }

  // Get stream categories
  async getStreamCategories(): Promise<
    { category: string; count: number; thumbnail: string }[]
  > {
    const categories = new Map<string, number>();

    Array.from(this.streams.values())
      .filter((stream) => stream.isLive)
      .forEach((stream) => {
        categories.set(
          stream.category,
          (categories.get(stream.category) || 0) + 1,
        );
      });

    return Array.from(categories.entries()).map(([category, count]) => ({
      category,
      count,
      thumbnail: `https://images.unsplash.com/photo-${Math.random().toString().slice(2, 15)}?w=200&h=150&fit=crop`,
    }));
  }

  // Join stream as viewer
  async joinStream(streamId: string, userId: string): Promise<void> {
    const stream = this.streams.get(streamId);
    if (stream) {
      stream.viewerCount += 1;
      stream.stats.totalViews += 1;
      stream.stats.peakViewers = Math.max(
        stream.stats.peakViewers,
        stream.viewerCount,
      );
      this.streams.set(streamId, stream);

      // Send system message
      await this.sendMessage(streamId, {
        streamId,
        userId: "system",
        username: "System",
        userAvatar: "",
        message: `${userId} joined the stream`,
        type: "system",
      });
    }
  }

  // Leave stream
  async leaveStream(streamId: string, userId: string): Promise<void> {
    const stream = this.streams.get(streamId);
    if (stream && stream.viewerCount > 0) {
      stream.viewerCount -= 1;
      this.streams.set(streamId, stream);
    }
  }

  // React to stream (like, share)
  async reactToStream(
    streamId: string,
    action: "like" | "share",
  ): Promise<void> {
    const stream = this.streams.get(streamId);
    if (stream) {
      if (action === "like") {
        stream.stats.likes += 1;
      } else if (action === "share") {
        stream.stats.shares += 1;
      }
      this.streams.set(streamId, stream);
    }
  }

  // Get trending streams
  async getTrendingStreams(): Promise<LiveStream[]> {
    const now = Date.now();
    const streams = Array.from(this.streams.values())
      .filter((stream) => stream.isLive)
      .map((stream) => {
        // Calculate trending score based on viewers, growth, and engagement
        const hoursSinceStart =
          (now - stream.startedAt.getTime()) / (1000 * 60 * 60);
        const viewerGrowthRate =
          stream.viewerCount / Math.max(hoursSinceStart, 0.5);
        const engagementRate =
          (stream.stats.likes + stream.stats.shares) /
          Math.max(stream.stats.totalViews, 1);

        const trendingScore =
          stream.viewerCount * 0.4 +
          viewerGrowthRate * 0.3 +
          engagementRate * 1000 * 0.3;

        return { ...stream, trendingScore };
      })
      .sort((a, b) => (b as any).trendingScore - (a as any).trendingScore)
      .slice(0, 10);

    return streams;
  }

  private generateMockMessages(streamId: string): StreamMessage[] {
    const messages: StreamMessage[] = [];
    const usernames = [
      "CryptoFan",
      "TechGuru",
      "Artist123",
      "Viewer1",
      "StreamLover",
      "CodeMaster",
    ];
    const sampleMessages = [
      "Great stream!",
      "Love this content",
      "Thanks for sharing!",
      "Very informative",
      "Keep up the good work!",
      "Amazing skills!",
      "Learning so much",
      "This is awesome!",
    ];

    for (let i = 0; i < 20; i++) {
      messages.push({
        id: `msg-${streamId}-${i}`,
        streamId,
        userId: `user-${i}`,
        username: usernames[i % usernames.length],
        userAvatar: `https://images.unsplash.com/photo-${Math.random().toString().slice(2, 15)}?w=40&h=40&fit=crop&crop=face`,
        message: sampleMessages[i % sampleMessages.length],
        timestamp: new Date(Date.now() - Math.random() * 60 * 60 * 1000),
        type: "message",
      });
    }

    return messages.sort(
      (a, b) => a.timestamp.getTime() - b.timestamp.getTime(),
    );
  }

  private generateMockAnalytics(streamId: string): StreamAnalytics {
    return {
      streamId,
      viewerHistory: Array.from({ length: 24 }, (_, i) => ({
        timestamp: new Date(Date.now() - (23 - i) * 60 * 60 * 1000),
        count: Math.floor(Math.random() * 1000) + 100,
      })),
      engagement: {
        likes: Math.floor(Math.random() * 1000),
        shares: Math.floor(Math.random() * 100),
        comments: Math.floor(Math.random() * 500),
        averageWatchTime: Math.floor(Math.random() * 30) + 5,
      },
      demographics: {
        countries: { US: 40, UK: 20, CA: 15, AU: 10, DE: 15 },
        ageGroups: { "18-24": 30, "25-34": 35, "35-44": 20, "45+": 15 },
        devices: { mobile: 60, desktop: 30, tablet: 10 },
      },
      revenue: {
        gifts: Math.floor(Math.random() * 500),
        donations: Math.floor(Math.random() * 200),
        subscriptions: Math.floor(Math.random() * 1000),
      },
    };
  }
}

export const liveStreamingService = new LiveStreamingService();
