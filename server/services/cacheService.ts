import Redis from "redis";

// Redis configuration
const redisConfig = {
  url: process.env.REDIS_URL || "redis://localhost:6379",
  retryDelayOnFailover: 100,
  maxRetriesPerRequest: 3,
  lazyConnect: true,
};

// Cache key prefixes
export const CacheKeys = {
  USER_PROFILE: "user:profile:",
  USER_POSTS: "user:posts:",
  POST_LIKES: "post:likes:",
  POST_COMMENTS: "post:comments:",
  PRODUCT_DETAILS: "product:",
  CRYPTO_PRICES: "crypto:prices",
  TRENDING_POSTS: "trending:posts",
  SEARCH_RESULTS: "search:",
  USER_FEED: "user:feed:",
  FREELANCE_JOBS: "freelance:jobs",
  NOTIFICATIONS: "notifications:",
  SESSION: "session:",
  RATE_LIMIT: "rate_limit:",
} as const;

// Cache TTL (Time To Live) in seconds
export const CacheTTL = {
  SHORT: 300, // 5 minutes
  MEDIUM: 1800, // 30 minutes
  LONG: 3600, // 1 hour
  DAILY: 86400, // 24 hours
  WEEKLY: 604800, // 7 days
} as const;

class CacheService {
  private redis: Redis.RedisClientType | null = null;
  private isConnected = false;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 10;

  constructor() {
    this.initializeRedis();
  }

  private async initializeRedis() {
    try {
      this.redis = Redis.createClient(redisConfig);

      this.redis.on("connect", () => {
        console.log("🔗 Redis: Connecting...");
      });

      this.redis.on("ready", () => {
        console.log("✅ Redis: Connected and ready");
        this.isConnected = true;
        this.reconnectAttempts = 0;
      });

      this.redis.on("error", (error) => {
        console.error("❌ Redis error:", error);
        this.isConnected = false;
      });

      this.redis.on("end", () => {
        console.log("🔌 Redis: Connection ended");
        this.isConnected = false;
      });

      this.redis.on("reconnecting", () => {
        this.reconnectAttempts++;
        console.log(
          `🔄 Redis: Reconnecting... (attempt ${this.reconnectAttempts})`,
        );

        if (this.reconnectAttempts >= this.maxReconnectAttempts) {
          console.error("❌ Redis: Max reconnection attempts reached");
          this.redis?.disconnect();
        }
      });

      await this.redis.connect();
    } catch (error) {
      console.error("❌ Redis initialization failed:", error);
      this.redis = null;
      this.isConnected = false;
    }
  }

  // Check if Redis is available
  isAvailable(): boolean {
    return this.isConnected && this.redis !== null;
  }

  // Get value from cache
  async get<T>(key: string): Promise<T | null> {
    if (!this.isAvailable()) return null;

    try {
      const value = await this.redis!.get(key);
      if (value === null) return null;

      return JSON.parse(value);
    } catch (error) {
      console.error(`Cache get error for key ${key}:`, error);
      return null;
    }
  }

  // Set value in cache
  async set(
    key: string,
    value: any,
    ttl: number = CacheTTL.MEDIUM,
  ): Promise<boolean> {
    if (!this.isAvailable()) return false;

    try {
      const serialized = JSON.stringify(value);
      await this.redis!.setEx(key, ttl, serialized);
      return true;
    } catch (error) {
      console.error(`Cache set error for key ${key}:`, error);
      return false;
    }
  }

  // Delete key from cache
  async del(key: string | string[]): Promise<boolean> {
    if (!this.isAvailable()) return false;

    try {
      const keys = Array.isArray(key) ? key : [key];
      await this.redis!.del(keys);
      return true;
    } catch (error) {
      console.error(`Cache delete error for keys ${key}:`, error);
      return false;
    }
  }

  // Check if key exists
  async exists(key: string): Promise<boolean> {
    if (!this.isAvailable()) return false;

    try {
      const result = await this.redis!.exists(key);
      return result === 1;
    } catch (error) {
      console.error(`Cache exists error for key ${key}:`, error);
      return false;
    }
  }

  // Get multiple keys
  async mget<T>(keys: string[]): Promise<(T | null)[]> {
    if (!this.isAvailable()) return keys.map(() => null);

    try {
      const values = await this.redis!.mGet(keys);
      return values.map((value) => {
        if (value === null) return null;
        try {
          return JSON.parse(value);
        } catch {
          return null;
        }
      });
    } catch (error) {
      console.error(`Cache mget error for keys ${keys}:`, error);
      return keys.map(() => null);
    }
  }

  // Set multiple keys
  async mset(
    keyValues: Record<string, any>,
    ttl: number = CacheTTL.MEDIUM,
  ): Promise<boolean> {
    if (!this.isAvailable()) return false;

    try {
      const pipeline = this.redis!.multi();

      Object.entries(keyValues).forEach(([key, value]) => {
        const serialized = JSON.stringify(value);
        pipeline.setEx(key, ttl, serialized);
      });

      await pipeline.exec();
      return true;
    } catch (error) {
      console.error("Cache mset error:", error);
      return false;
    }
  }

  // Increment counter
  async incr(key: string, by: number = 1): Promise<number | null> {
    if (!this.isAvailable()) return null;

    try {
      if (by === 1) {
        return await this.redis!.incr(key);
      } else {
        return await this.redis!.incrBy(key, by);
      }
    } catch (error) {
      console.error(`Cache incr error for key ${key}:`, error);
      return null;
    }
  }

  // Set with expiration
  async setex(key: string, seconds: number, value: any): Promise<boolean> {
    return this.set(key, value, seconds);
  }

  // Get and set pattern (cache-aside)
  async getOrSet<T>(
    key: string,
    fetcher: () => Promise<T>,
    ttl: number = CacheTTL.MEDIUM,
  ): Promise<T | null> {
    // Try to get from cache first
    const cached = await this.get<T>(key);
    if (cached !== null) {
      return cached;
    }

    try {
      // Fetch from source
      const fresh = await fetcher();

      // Store in cache
      await this.set(key, fresh, ttl);

      return fresh;
    } catch (error) {
      console.error(`Cache getOrSet error for key ${key}:`, error);
      return null;
    }
  }

  // Get keys by pattern
  async getKeysByPattern(pattern: string): Promise<string[]> {
    if (!this.isAvailable()) return [];

    try {
      return await this.redis!.keys(pattern);
    } catch (error) {
      console.error(`Cache keys error for pattern ${pattern}:`, error);
      return [];
    }
  }

  // Delete keys by pattern
  async deleteByPattern(pattern: string): Promise<boolean> {
    if (!this.isAvailable()) return false;

    try {
      const keys = await this.getKeysByPattern(pattern);
      if (keys.length > 0) {
        await this.del(keys);
      }
      return true;
    } catch (error) {
      console.error(
        `Cache deleteByPattern error for pattern ${pattern}:`,
        error,
      );
      return false;
    }
  }

  // Hash operations
  async hget(key: string, field: string): Promise<any> {
    if (!this.isAvailable()) return null;

    try {
      const value = await this.redis!.hGet(key, field);
      if (value === null) return null;
      return JSON.parse(value);
    } catch (error) {
      console.error(`Cache hget error for key ${key}, field ${field}:`, error);
      return null;
    }
  }

  async hset(key: string, field: string, value: any): Promise<boolean> {
    if (!this.isAvailable()) return false;

    try {
      const serialized = JSON.stringify(value);
      await this.redis!.hSet(key, field, serialized);
      return true;
    } catch (error) {
      console.error(`Cache hset error for key ${key}, field ${field}:`, error);
      return false;
    }
  }

  async hgetall(key: string): Promise<Record<string, any> | null> {
    if (!this.isAvailable()) return null;

    try {
      const hash = await this.redis!.hGetAll(key);
      const result: Record<string, any> = {};

      for (const [field, value] of Object.entries(hash)) {
        try {
          result[field] = JSON.parse(value);
        } catch {
          result[field] = value;
        }
      }

      return result;
    } catch (error) {
      console.error(`Cache hgetall error for key ${key}:`, error);
      return null;
    }
  }

  // List operations
  async lpush(key: string, ...values: any[]): Promise<boolean> {
    if (!this.isAvailable()) return false;

    try {
      const serialized = values.map((v) => JSON.stringify(v));
      await this.redis!.lPush(key, serialized);
      return true;
    } catch (error) {
      console.error(`Cache lpush error for key ${key}:`, error);
      return false;
    }
  }

  async lrange(
    key: string,
    start: number = 0,
    stop: number = -1,
  ): Promise<any[]> {
    if (!this.isAvailable()) return [];

    try {
      const values = await this.redis!.lRange(key, start, stop);
      return values.map((value) => {
        try {
          return JSON.parse(value);
        } catch {
          return value;
        }
      });
    } catch (error) {
      console.error(`Cache lrange error for key ${key}:`, error);
      return [];
    }
  }

  // Set operations
  async sadd(key: string, ...members: any[]): Promise<boolean> {
    if (!this.isAvailable()) return false;

    try {
      const serialized = members.map((m) => JSON.stringify(m));
      await this.redis!.sAdd(key, serialized);
      return true;
    } catch (error) {
      console.error(`Cache sadd error for key ${key}:`, error);
      return false;
    }
  }

  async smembers(key: string): Promise<any[]> {
    if (!this.isAvailable()) return [];

    try {
      const members = await this.redis!.sMembers(key);
      return members.map((member) => {
        try {
          return JSON.parse(member);
        } catch {
          return member;
        }
      });
    } catch (error) {
      console.error(`Cache smembers error for key ${key}:`, error);
      return [];
    }
  }

  // Flush all data
  async flushall(): Promise<boolean> {
    if (!this.isAvailable()) return false;

    try {
      await this.redis!.flushAll();
      return true;
    } catch (error) {
      console.error("Cache flushall error:", error);
      return false;
    }
  }

  // Get cache info
  async info(): Promise<any> {
    if (!this.isAvailable()) return null;

    try {
      const info = await this.redis!.info();
      return info;
    } catch (error) {
      console.error("Cache info error:", error);
      return null;
    }
  }

  // Disconnect
  async disconnect(): Promise<void> {
    if (this.redis) {
      await this.redis.disconnect();
      this.isConnected = false;
    }
  }
}

// Create and export singleton instance
export const cacheService = new CacheService();

// Helper functions for common cache patterns
export const CacheHelpers = {
  // User profile cache
  getUserProfile: (userId: string) =>
    cacheService.get(`${CacheKeys.USER_PROFILE}${userId}`),

  setUserProfile: (userId: string, profile: any) =>
    cacheService.set(
      `${CacheKeys.USER_PROFILE}${userId}`,
      profile,
      CacheTTL.LONG,
    ),

  // Post cache
  getPost: (postId: string) => cacheService.get(`post:${postId}`),

  setPost: (postId: string, post: any) =>
    cacheService.set(`post:${postId}`, post, CacheTTL.MEDIUM),

  // User feed cache
  getUserFeed: (userId: string) =>
    cacheService.get(`${CacheKeys.USER_FEED}${userId}`),

  setUserFeed: (userId: string, feed: any[]) =>
    cacheService.set(`${CacheKeys.USER_FEED}${userId}`, feed, CacheTTL.SHORT),

  // Trending posts cache
  getTrendingPosts: () => cacheService.get(CacheKeys.TRENDING_POSTS),

  setTrendingPosts: (posts: any[]) =>
    cacheService.set(CacheKeys.TRENDING_POSTS, posts, CacheTTL.MEDIUM),

  // Search results cache
  getSearchResults: (query: string) =>
    cacheService.get(`${CacheKeys.SEARCH_RESULTS}${query}`),

  setSearchResults: (query: string, results: any) =>
    cacheService.set(
      `${CacheKeys.SEARCH_RESULTS}${query}`,
      results,
      CacheTTL.SHORT,
    ),

  // Crypto prices cache
  getCryptoPrices: () => cacheService.get(CacheKeys.CRYPTO_PRICES),

  setCryptoPrices: (prices: any) =>
    cacheService.set(CacheKeys.CRYPTO_PRICES, prices, 60), // 1 minute for crypto prices

  // Rate limiting
  getRateLimit: (key: string) =>
    cacheService.get(`${CacheKeys.RATE_LIMIT}${key}`),

  setRateLimit: (key: string, count: number, ttl: number) =>
    cacheService.setex(`${CacheKeys.RATE_LIMIT}${key}`, ttl, count),

  // Session cache
  getSession: (sessionId: string) =>
    cacheService.get(`${CacheKeys.SESSION}${sessionId}`),

  setSession: (sessionId: string, session: any, ttl: number = CacheTTL.DAILY) =>
    cacheService.set(`${CacheKeys.SESSION}${sessionId}`, session, ttl),

  // Invalidate user-related caches
  invalidateUserCache: async (userId: string) => {
    const patterns = [
      `${CacheKeys.USER_PROFILE}${userId}`,
      `${CacheKeys.USER_POSTS}${userId}`,
      `${CacheKeys.USER_FEED}${userId}`,
      `${CacheKeys.NOTIFICATIONS}${userId}`,
    ];

    for (const pattern of patterns) {
      await cacheService.del(pattern);
    }
  },

  // Invalidate post-related caches
  invalidatePostCache: async (postId: string) => {
    const patterns = [
      `post:${postId}`,
      `${CacheKeys.POST_LIKES}${postId}`,
      `${CacheKeys.POST_COMMENTS}${postId}`,
      CacheKeys.TRENDING_POSTS,
    ];

    for (const pattern of patterns) {
      await cacheService.del(pattern);
    }
  },
};

export default cacheService;
