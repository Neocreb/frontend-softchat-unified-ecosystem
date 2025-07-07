import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import {
  insertUserSchema,
  insertProfileSchema,
  insertPostSchema,
  insertProductSchema,
} from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // Blog RSS Feed endpoint
  app.get("/api/blog/rss", async (req, res) => {
    try {
      // Mock RSS feed XML for crypto learning blog
      const currentDate = new Date().toUTCString();

      const rssXml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:content="http://purl.org/rss/1.0/modules/content/" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>SoftChat Crypto Learning Blog</title>
    <link>https://softchat.com/blog</link>
    <description>Educational content about cryptocurrency, blockchain technology, and trading strategies from SoftChat</description>
    <language>en-us</language>
    <lastBuildDate>${currentDate}</lastBuildDate>
    <atom:link href="https://softchat.com/api/blog/rss" rel="self" type="application/rss+xml"/>
    <generator>SoftChat Blog System</generator>
    <managingEditor>team@softchat.com (SoftChat Team)</managingEditor>
    <webMaster>tech@softchat.com (SoftChat Tech)</webMaster>
    <copyright>Copyright ${new Date().getFullYear()} SoftChat. All rights reserved.</copyright>
    <category>Cryptocurrency</category>
    <category>Blockchain</category>
    <category>Trading</category>
    <category>Education</category>
    <ttl>60</ttl>

    <item>
      <title><![CDATA[Understanding Bitcoin: A Beginner's Guide to Digital Gold]]></title>
      <link>https://softchat.com/blog/understanding-bitcoin-beginners-guide</link>
      <guid isPermaLink="true">https://softchat.com/blog/understanding-bitcoin-beginners-guide</guid>
      <description><![CDATA[Learn the fundamentals of Bitcoin, how it works, and why it's considered digital gold in the cryptocurrency world.]]></description>
      <pubDate>Mon, 15 Jan 2024 10:00:00 GMT</pubDate>
      <author><![CDATA[Sarah Chen]]></author>
      <category><![CDATA[Crypto Education, Bitcoin, Cryptocurrency, Blockchain, Beginner]]></category>
      <difficulty>BEGINNER</difficulty>
      <readingTime>8</readingTime>
      <relatedAsset>BTC</relatedAsset>
    </item>

    <item>
      <title><![CDATA[Advanced Trading Patterns: Mastering Technical Analysis]]></title>
      <link>https://softchat.com/blog/advanced-trading-patterns-technical-analysis</link>
      <guid isPermaLink="true">https://softchat.com/blog/advanced-trading-patterns-technical-analysis</guid>
      <description><![CDATA[Dive deep into advanced technical analysis patterns that professional traders use to identify market opportunities.]]></description>
      <pubDate>Fri, 12 Jan 2024 14:30:00 GMT</pubDate>
      <author><![CDATA[Marcus Rodriguez]]></author>
      <category><![CDATA[Trading Strategies, Trading, Technical Analysis, Chart Patterns, Advanced]]></category>
      <difficulty>ADVANCED</difficulty>
      <readingTime>12</readingTime>
      <relatedAsset>BTC</relatedAsset>
      <relatedAsset>ETH</relatedAsset>
      <relatedAsset>ADA</relatedAsset>
    </item>

    <item>
      <title><![CDATA[DeFi Yield Farming: Opportunities and Risks]]></title>
      <link>https://softchat.com/blog/defi-yield-farming-opportunities-risks</link>
      <guid isPermaLink="true">https://softchat.com/blog/defi-yield-farming-opportunities-risks</guid>
      <description><![CDATA[Explore the world of decentralized finance yield farming, understanding both the potential rewards and associated risks.]]></description>
      <pubDate>Wed, 10 Jan 2024 09:15:00 GMT</pubDate>
      <author><![CDATA[Emma Thompson]]></author>
      <category><![CDATA[DeFi Insights, DeFi, Yield Farming, Passive Income, Risk Management]]></category>
      <difficulty>INTERMEDIATE</difficulty>
      <readingTime>10</readingTime>
      <relatedAsset>ETH</relatedAsset>
      <relatedAsset>UNI</relatedAsset>
      <relatedAsset>AAVE</relatedAsset>
    </item>

    <item>
      <title><![CDATA[Ethereum 2.0: The Future of Smart Contracts]]></title>
      <link>https://softchat.com/blog/ethereum-2-future-smart-contracts</link>
      <guid isPermaLink="true">https://softchat.com/blog/ethereum-2-future-smart-contracts</guid>
      <description><![CDATA[Explore the improvements and benefits that Ethereum 2.0 brings to the smart contract ecosystem.]]></description>
      <pubDate>Thu, 03 Jan 2024 13:30:00 GMT</pubDate>
      <author><![CDATA[Sarah Chen]]></author>
      <category><![CDATA[Crypto Education, Ethereum, Smart Contracts, Blockchain, Technology]]></category>
      <difficulty>INTERMEDIATE</difficulty>
      <readingTime>11</readingTime>
      <relatedAsset>ETH</relatedAsset>
    </item>

    <item>
      <title><![CDATA[Platform Update: New AI-Powered Trading Features]]></title>
      <link>https://softchat.com/blog/platform-update-ai-powered-trading-features</link>
      <guid isPermaLink="true">https://softchat.com/blog/platform-update-ai-powered-trading-features</guid>
      <description><![CDATA[Discover our latest AI-powered trading features designed to help you make smarter investment decisions.]]></description>
      <pubDate>Fri, 05 Jan 2024 11:20:00 GMT</pubDate>
      <author><![CDATA[Alex Johnson]]></author>
      <category><![CDATA[Platform Updates, Platform Update, AI, Trading, New Features]]></category>
      <difficulty>BEGINNER</difficulty>
      <readingTime>6</readingTime>
    </item>
  </channel>
</rss>`;

      res.set({
        "Content-Type": "application/rss+xml; charset=utf-8",
        "Cache-Control": "public, max-age=3600", // Cache for 1 hour
      });

      res.send(rssXml);
    } catch (error) {
      res.status(500).json({ error: "Failed to generate RSS feed" });
    }
  });

  // Blog API endpoints for frontend consumption
  app.get("/api/blog/posts", async (req, res) => {
    try {
      const limit = parseInt(req.query.limit as string) || 10;
      const category = req.query.category as string;
      const difficulty = req.query.difficulty as string;

      // Mock blog posts data
      const mockBlogPosts = [
        {
          id: "1",
          title: "Understanding Bitcoin: A Beginner's Guide to Digital Gold",
          slug: "understanding-bitcoin-beginners-guide",
          excerpt:
            "Learn the fundamentals of Bitcoin, how it works, and why it's considered digital gold in the cryptocurrency world.",
          author: {
            id: "1",
            name: "Sarah Chen",
            avatar:
              "https://images.unsplash.com/photo-1494790108755-2616b612b786?auto=format&fit=crop&q=80&w=150",
            bio: "Crypto educator and blockchain enthusiast with 5+ years of experience",
          },
          publishedAt: "2024-01-15T10:00:00Z",
          tags: ["Bitcoin", "Cryptocurrency", "Blockchain", "Beginner"],
          category: {
            id: "1",
            name: "Crypto Education",
            slug: "crypto-education",
            color: "bg-blue-500",
          },
          featuredImage:
            "https://images.unsplash.com/photo-1518546305927-5a555bb7020d?auto=format&fit=crop&q=80&w=800",
          readingTime: 8,
          likes: 245,
          views: 1520,
          difficulty: "BEGINNER",
          relatedAssets: ["BTC"],
        },
        {
          id: "2",
          title: "Advanced Trading Patterns: Mastering Technical Analysis",
          slug: "advanced-trading-patterns-technical-analysis",
          excerpt:
            "Dive deep into advanced technical analysis patterns that professional traders use to identify market opportunities.",
          author: {
            id: "2",
            name: "Marcus Rodriguez",
            avatar:
              "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=150",
            bio: "Professional trader with 10+ years of experience in crypto markets",
          },
          publishedAt: "2024-01-12T14:30:00Z",
          tags: ["Trading", "Technical Analysis", "Chart Patterns", "Advanced"],
          category: {
            id: "2",
            name: "Trading Strategies",
            slug: "trading-strategies",
            color: "bg-green-500",
          },
          featuredImage:
            "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&q=80&w=800",
          readingTime: 12,
          likes: 189,
          views: 987,
          difficulty: "ADVANCED",
          relatedAssets: ["BTC", "ETH", "ADA"],
        },
        {
          id: "3",
          title: "DeFi Yield Farming: Opportunities and Risks",
          slug: "defi-yield-farming-opportunities-risks",
          excerpt:
            "Explore the world of decentralized finance yield farming, understanding both the potential rewards and associated risks.",
          author: {
            id: "3",
            name: "Emma Thompson",
            avatar:
              "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=150",
            bio: "DeFi researcher and protocol analyst",
          },
          publishedAt: "2024-01-10T09:15:00Z",
          tags: ["DeFi", "Yield Farming", "Passive Income", "Risk Management"],
          category: {
            id: "3",
            name: "DeFi Insights",
            slug: "defi-insights",
            color: "bg-purple-500",
          },
          featuredImage:
            "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?auto=format&fit=crop&q=80&w=800",
          readingTime: 10,
          likes: 167,
          views: 756,
          difficulty: "INTERMEDIATE",
          relatedAssets: ["ETH", "UNI", "AAVE"],
        },
      ];

      let filteredPosts = mockBlogPosts;

      if (category) {
        filteredPosts = filteredPosts.filter(
          (post) => post.category.slug === category,
        );
      }

      if (difficulty) {
        filteredPosts = filteredPosts.filter(
          (post) => post.difficulty === difficulty,
        );
      }

      const posts = filteredPosts.slice(0, limit);

      res.json({
        posts,
        total: filteredPosts.length,
        hasMore: filteredPosts.length > limit,
      });
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch blog posts" });
    }
  });

  // Auth routes
  app.post("/api/auth/signup", async (req, res) => {
    try {
      const { email, password, name } = req.body;

      // Check if user already exists
      const existingUser = await storage.getUserByEmail(email);
      if (existingUser) {
        return res.status(400).json({ error: "User already exists" });
      }

      // Create user
      const user = await storage.createUser({ email, password });

      // Create profile
      const profile = await storage.createProfile({
        userId: user.id,
        name,
        username: email.split("@")[0], // Use email prefix as default username
      });

      res.json({ user, profile });
    } catch (error) {
      res.status(500).json({ error: "Failed to create user" });
    }
  });

  app.post("/api/auth/signin", async (req, res) => {
    try {
      const { email, password } = req.body;

      const user = await storage.getUserByEmail(email);
      if (!user || user.password !== password) {
        return res.status(401).json({ error: "Invalid credentials" });
      }

      const profile = await storage.getProfileByUserId(user.id);

      res.json({ user, profile });
    } catch (error) {
      res.status(500).json({ error: "Failed to sign in" });
    }
  });

  // Profile routes
  app.get("/api/profiles/:userId", async (req, res) => {
    try {
      const profile = await storage.getProfileByUserId(req.params.userId);
      if (!profile) {
        return res.status(404).json({ error: "Profile not found" });
      }
      res.json(profile);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch profile" });
    }
  });

  app.get("/api/profiles/username/:username", async (req, res) => {
    try {
      const profile = await storage.getProfileByUsername(req.params.username);
      if (!profile) {
        return res.status(404).json({ error: "Profile not found" });
      }
      res.json(profile);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch profile" });
    }
  });

  app.put("/api/profiles/:userId", async (req, res) => {
    try {
      const profile = await storage.updateProfile(req.params.userId, req.body);
      if (!profile) {
        return res.status(404).json({ error: "Profile not found" });
      }
      res.json(profile);
    } catch (error) {
      res.status(500).json({ error: "Failed to update profile" });
    }
  });

  // Posts routes
  app.get("/api/posts", async (req, res) => {
    try {
      const limit = parseInt(req.query.limit as string) || 50;
      const offset = parseInt(req.query.offset as string) || 0;
      const posts = await storage.getPosts(limit, offset);
      res.json(posts);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch posts" });
    }
  });

  app.get("/api/posts/:id", async (req, res) => {
    try {
      const post = await storage.getPostById(req.params.id);
      if (!post) {
        return res.status(404).json({ error: "Post not found" });
      }
      res.json(post);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch post" });
    }
  });

  app.get("/api/posts/user/:userId", async (req, res) => {
    try {
      const posts = await storage.getPostsByUserId(req.params.userId);
      res.json(posts);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch user posts" });
    }
  });

  app.post("/api/posts", async (req, res) => {
    try {
      const post = await storage.createPost(req.body);
      res.json(post);
    } catch (error) {
      res.status(500).json({ error: "Failed to create post" });
    }
  });

  app.put("/api/posts/:id", async (req, res) => {
    try {
      const post = await storage.updatePost(req.params.id, req.body);
      if (!post) {
        return res.status(404).json({ error: "Post not found" });
      }
      res.json(post);
    } catch (error) {
      res.status(500).json({ error: "Failed to update post" });
    }
  });

  app.delete("/api/posts/:id", async (req, res) => {
    try {
      const success = await storage.deletePost(req.params.id);
      if (!success) {
        return res.status(404).json({ error: "Post not found" });
      }
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Failed to delete post" });
    }
  });

  // Products routes
  app.get("/api/products", async (req, res) => {
    try {
      const limit = parseInt(req.query.limit as string) || 50;
      const offset = parseInt(req.query.offset as string) || 0;
      const products = await storage.getProducts(limit, offset);
      res.json(products);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch products" });
    }
  });

  app.get("/api/products/:id", async (req, res) => {
    try {
      const product = await storage.getProductById(req.params.id);
      if (!product) {
        return res.status(404).json({ error: "Product not found" });
      }
      res.json(product);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch product" });
    }
  });

  app.get("/api/products/seller/:sellerId", async (req, res) => {
    try {
      const products = await storage.getProductsBySellerId(req.params.sellerId);
      res.json(products);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch seller products" });
    }
  });

  app.post("/api/products", async (req, res) => {
    try {
      const product = await storage.createProduct(req.body);
      res.json(product);
    } catch (error) {
      res.status(500).json({ error: "Failed to create product" });
    }
  });

  app.put("/api/products/:id", async (req, res) => {
    try {
      const product = await storage.updateProduct(req.params.id, req.body);
      if (!product) {
        return res.status(404).json({ error: "Product not found" });
      }
      res.json(product);
    } catch (error) {
      res.status(500).json({ error: "Failed to update product" });
    }
  });

  app.delete("/api/products/:id", async (req, res) => {
    try {
      const success = await storage.deleteProduct(req.params.id);
      if (!success) {
        return res.status(404).json({ error: "Product not found" });
      }
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Failed to delete product" });
    }
  });

  // Follow routes
  app.post("/api/follow", async (req, res) => {
    try {
      const { followerId, followingId } = req.body;
      const success = await storage.followUser(followerId, followingId);
      res.json({ success });
    } catch (error) {
      res.status(500).json({ error: "Failed to follow user" });
    }
  });

  app.delete("/api/follow", async (req, res) => {
    try {
      const { followerId, followingId } = req.body;
      const success = await storage.unfollowUser(followerId, followingId);
      res.json({ success });
    } catch (error) {
      res.status(500).json({ error: "Failed to unfollow user" });
    }
  });

  app.get("/api/follow/followers/:userId", async (req, res) => {
    try {
      const followers = await storage.getFollowers(req.params.userId);
      res.json(followers);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch followers" });
    }
  });

  app.get("/api/follow/following/:userId", async (req, res) => {
    try {
      const following = await storage.getFollowing(req.params.userId);
      res.json(following);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch following" });
    }
  });

  app.get("/api/follow/check/:followerId/:followingId", async (req, res) => {
    try {
      const isFollowing = await storage.isFollowing(
        req.params.followerId,
        req.params.followingId,
      );
      res.json({ isFollowing });
    } catch (error) {
      res.status(500).json({ error: "Failed to check follow status" });
    }
  });

  // Community Events API endpoints
  app.get("/api/events", async (req, res) => {
    try {
      const {
        type,
        category,
        status,
        featured,
        limit = 50,
        offset = 0,
      } = req.query;

      // Mock events data
      const mockEvents = [
        {
          id: "1",
          title: "Live Crypto Trading Session: DeFi Strategies",
          description:
            "Join expert traders as we analyze DeFi opportunities in real-time. Learn advanced trading strategies and see live portfolio management.",
          type: "trading",
          hostId: "1",
          host: {
            id: "1",
            name: "Alex Rivera",
            avatar:
              "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100",
            verified: true,
          },
          startTime: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(), // 2 hours from now
          endTime: new Date(Date.now() + 4 * 60 * 60 * 1000).toISOString(),
          duration: 120,
          participants: 234,
          maxParticipants: 500,
          isLive: true,
          isPremium: true,
          tags: ["DeFi", "Trading", "Crypto", "Live"],
          thumbnail:
            "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=400",
          category: "Finance",
          status: "live",
          rewards: {
            type: "crypto",
            amount: 50,
            description: "50 SOFT tokens for active participants",
          },
          featured: true,
        },
        {
          id: "2",
          title: "Flash Marketplace Sale: Tech Gadgets",
          description:
            "Limited-time group buying event with exclusive discounts. Bid together, save together!",
          type: "marketplace",
          hostId: "2",
          host: {
            id: "2",
            name: "TechDeals Store",
            avatar:
              "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=100",
            verified: true,
          },
          startTime: new Date(Date.now() + 6 * 60 * 60 * 1000).toISOString(),
          endTime: new Date(Date.now() + 7 * 60 * 60 * 1000).toISOString(),
          duration: 60,
          participants: 89,
          maxParticipants: 200,
          isLive: false,
          isPremium: false,
          tags: ["Shopping", "Deals", "Tech", "Flash Sale"],
          thumbnail:
            "https://images.unsplash.com/photo-1498049794561-7780e7231661?w=400",
          category: "Shopping",
          status: "scheduled",
          rewards: {
            type: "discount",
            amount: 25,
            description: "Up to 25% group discount",
          },
        },
        {
          id: "3",
          title: "AI Art Creation Workshop",
          description:
            "Learn to create stunning AI art with industry experts. Interactive session with live demonstrations.",
          type: "workshop",
          hostId: "3",
          host: {
            id: "3",
            name: "Sarah Chen",
            avatar:
              "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100",
            verified: true,
          },
          startTime: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
          endTime: new Date(Date.now() + 25.5 * 60 * 60 * 1000).toISOString(),
          duration: 90,
          participants: 156,
          maxParticipants: 300,
          isLive: false,
          isPremium: false,
          tags: ["AI", "Art", "Workshop", "Creative"],
          thumbnail:
            "https://images.unsplash.com/photo-1547036967-23d11aacaee0?w=400",
          category: "Creative",
          status: "scheduled",
          requirements: [
            "Basic Photoshop knowledge",
            "Stable internet connection",
          ],
        },
      ];

      let filteredEvents = mockEvents;

      // Apply filters
      if (type) {
        filteredEvents = filteredEvents.filter((event) => event.type === type);
      }
      if (category) {
        filteredEvents = filteredEvents.filter(
          (event) => event.category === category,
        );
      }
      if (status) {
        filteredEvents = filteredEvents.filter(
          (event) => event.status === status,
        );
      }
      if (featured === "true") {
        filteredEvents = filteredEvents.filter((event) => event.featured);
      }

      const total = filteredEvents.length;
      const events = filteredEvents.slice(
        Number(offset),
        Number(offset) + Number(limit),
      );

      res.json({
        events,
        total,
        hasMore: total > Number(offset) + Number(limit),
      });
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch events" });
    }
  });

  app.get("/api/events/:id", async (req, res) => {
    try {
      const eventId = req.params.id;

      // Mock single event response
      const mockEvent = {
        id: eventId,
        title: "Live Crypto Trading Session: DeFi Strategies",
        description:
          "Join expert traders as we analyze DeFi opportunities in real-time.",
        type: "trading",
        hostId: "1",
        host: {
          id: "1",
          name: "Alex Rivera",
          avatar:
            "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100",
          verified: true,
        },
        startTime: new Date().toISOString(),
        endTime: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(),
        duration: 120,
        participants: 234,
        maxParticipants: 500,
        isLive: true,
        isPremium: true,
        tags: ["DeFi", "Trading", "Crypto", "Live"],
        thumbnail:
          "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=400",
        category: "Finance",
        status: "live",
      };

      res.json(mockEvent);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch event" });
    }
  });

  app.post("/api/events", async (req, res) => {
    try {
      const eventData = req.body;

      // Mock creation response
      const newEvent = {
        id: `event_${Date.now()}`,
        ...eventData,
        hostId: "current-user-id",
        host: {
          id: "current-user-id",
          name: "Current User",
          avatar:
            "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100",
          verified: false,
        },
        participants: 0,
        isLive: false,
        status: "scheduled",
        createdAt: new Date().toISOString(),
      };

      res.json(newEvent);
    } catch (error) {
      res.status(500).json({ error: "Failed to create event" });
    }
  });

  app.post("/api/events/:id/join", async (req, res) => {
    try {
      const eventId = req.params.id;

      res.json({
        success: true,
        participantId: `participant_${Date.now()}`,
        message: "Successfully joined the event",
      });
    } catch (error) {
      res.status(500).json({ error: "Failed to join event" });
    }
  });

  app.post("/api/events/:id/leave", async (req, res) => {
    try {
      const eventId = req.params.id;

      res.json({
        success: true,
        message: "Successfully left the event",
      });
    } catch (error) {
      res.status(500).json({ error: "Failed to leave event" });
    }
  });

  app.get("/api/events/:id/participants", async (req, res) => {
    try {
      const eventId = req.params.id;

      // Mock participants data
      const mockParticipants = [
        {
          id: "1",
          eventId,
          userId: "1",
          user: {
            id: "1",
            name: "Alex Rivera",
            avatar:
              "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100",
            verified: true,
          },
          role: "host",
          joinedAt: new Date().toISOString(),
          isActive: true,
          permissions: {
            canSpeak: true,
            canShare: true,
            canModerate: true,
          },
          status: {
            isVideoOn: true,
            isAudioOn: true,
            handRaised: false,
            isScreenSharing: false,
          },
        },
        {
          id: "2",
          eventId,
          userId: "2",
          user: {
            id: "2",
            name: "Sarah Chen",
            avatar:
              "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100",
            verified: true,
          },
          role: "speaker",
          joinedAt: new Date(Date.now() - 300000).toISOString(),
          isActive: true,
          permissions: {
            canSpeak: true,
            canShare: false,
            canModerate: false,
          },
          status: {
            isVideoOn: true,
            isAudioOn: true,
            handRaised: false,
            isScreenSharing: false,
          },
        },
      ];

      res.json(mockParticipants);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch participants" });
    }
  });

  app.get("/api/events/:id/messages", async (req, res) => {
    try {
      const eventId = req.params.id;
      const { limit = 50, offset = 0 } = req.query;

      // Mock messages data
      const mockMessages = [
        {
          id: "1",
          eventId,
          userId: "1",
          userName: "Alex Rivera",
          userAvatar:
            "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100",
          message:
            "Welcome everyone! Let's start with today's DeFi strategies.",
          timestamp: new Date(Date.now() - 300000).toISOString(),
          type: "message",
        },
        {
          id: "2",
          eventId,
          userId: "2",
          userName: "Sarah Chen",
          userAvatar:
            "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100",
          message:
            "Great presentation! The yield farming section was very insightful.",
          timestamp: new Date(Date.now() - 240000).toISOString(),
          type: "message",
        },
      ];

      const messages = mockMessages.slice(
        Number(offset),
        Number(offset) + Number(limit),
      );
      res.json(messages);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch messages" });
    }
  });

  app.post("/api/events/:id/messages", async (req, res) => {
    try {
      const eventId = req.params.id;
      const { message, type = "message" } = req.body;

      const newMessage = {
        id: `msg_${Date.now()}`,
        eventId,
        userId: "current-user-id",
        userName: "Current User",
        userAvatar:
          "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100",
        message,
        timestamp: new Date().toISOString(),
        type,
      };

      res.json(newMessage);
    } catch (error) {
      res.status(500).json({ error: "Failed to send message" });
    }
  });

  app.get("/api/events/:id/stats", async (req, res) => {
    try {
      const eventId = req.params.id;

      // Mock stats data
      const mockStats = {
        eventId,
        currentViewers: 234,
        totalJoined: 567,
        messagesCount: 89,
        reactionsCount: 456,
        engagementRate: 78.5,
        averageWatchTime: 45.2,
        revenueGenerated: 1250,
      };

      res.json(mockStats);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch event stats" });
    }
  });

  app.get("/api/events/trending", async (req, res) => {
    try {
      const { limit = 10 } = req.query;

      // Mock trending events (same as regular events but sorted by popularity)
      const trendingEvents = [
        {
          id: "1",
          title: "Live Crypto Trading Session: DeFi Strategies",
          type: "trading",
          host: { name: "Alex Rivera", verified: true },
          participants: 234,
          isLive: true,
          thumbnail:
            "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=400",
        },
      ];

      res.json(trendingEvents.slice(0, Number(limit)));
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch trending events" });
    }
  });

  // Freelance API endpoints
  app.get("/api/freelance/jobs", async (req, res) => {
    try {
      const {
        category,
        skills,
        budgetMin,
        budgetMax,
        experienceLevel,
        sortBy,
        limit = 50,
        offset = 0,
      } = req.query;

      // Mock freelance jobs data
      const mockJobs = [
        {
          id: "1",
          title: "Full-Stack Web Application Development",
          description:
            "Looking for an experienced developer to build a comprehensive e-commerce platform with React, Node.js, and MongoDB. Must have experience with payment integration and user authentication.",
          category: "Web Development",
          subcategory: "Full-Stack Development",
          budget: { type: "fixed", amount: 5000 },
          deadline: "2024-02-15",
          duration: "2-3 months",
          experienceLevel: "expert",
          skills: ["React", "Node.js", "MongoDB", "Payment Integration"],
          client: {
            id: "1",
            name: "TechCorp Solutions",
            email: "contact@techcorp.com",
            avatar:
              "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=100&h=100&fit=crop",
            location: "San Francisco, CA",
            timezone: "PST",
            verified: true,
            joinedDate: "2023-01-01",
            companyName: "TechCorp Solutions",
            totalSpent: 47500,
            jobsPosted: 12,
            hireRate: 85.5,
            rating: 4.8,
            paymentVerified: true,
          },
          proposals: [],
          status: "open",
          postedDate: "2024-01-10T10:00:00Z",
          applicationsCount: 12,
          visibility: "public",
        },
        {
          id: "2",
          title: "Mobile App UI/UX Design",
          description:
            "Need a talented designer to create a modern, user-friendly mobile app interface for a fitness tracking application.",
          category: "Design",
          subcategory: "Mobile Design",
          budget: { type: "hourly", min: 60, max: 80 },
          deadline: "2024-01-30",
          duration: "3-4 weeks",
          experienceLevel: "intermediate",
          skills: ["UI/UX Design", "Figma", "Mobile Design", "Prototyping"],
          client: {
            id: "2",
            name: "FitLife Startup",
            email: "hello@fitlife.com",
            avatar:
              "https://images.unsplash.com/photo-1551836022-deb4988cc6c0?w=100&h=100&fit=crop",
            location: "New York, NY",
            timezone: "EST",
            verified: true,
            joinedDate: "2023-06-15",
            companyName: "FitLife Inc.",
            totalSpent: 23400,
            jobsPosted: 8,
            hireRate: 90.2,
            rating: 4.6,
            paymentVerified: true,
          },
          proposals: [],
          status: "open",
          postedDate: "2024-01-08T14:30:00Z",
          applicationsCount: 8,
          visibility: "public",
        },
      ];

      let filteredJobs = mockJobs;

      // Apply filters
      if (category) {
        filteredJobs = filteredJobs.filter((job) => job.category === category);
      }
      if (skills) {
        const skillsArray = Array.isArray(skills) ? skills : [skills];
        filteredJobs = filteredJobs.filter((job) =>
          skillsArray.some((skill) =>
            job.skills.some((jobSkill) =>
              jobSkill.toLowerCase().includes(skill.toLowerCase()),
            ),
          ),
        );
      }
      if (experienceLevel) {
        const levels = Array.isArray(experienceLevel)
          ? experienceLevel
          : [experienceLevel];
        filteredJobs = filteredJobs.filter((job) =>
          levels.includes(job.experienceLevel),
        );
      }

      const total = filteredJobs.length;
      const jobs = filteredJobs.slice(
        Number(offset),
        Number(offset) + Number(limit),
      );

      res.json({
        jobs,
        total,
        hasMore: total > Number(offset) + Number(limit),
      });
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch freelance jobs" });
    }
  });

  app.get("/api/freelance/jobs/:id", async (req, res) => {
    try {
      const jobId = req.params.id;
      // Mock job details - in real app would fetch from database
      const mockJob = {
        id: jobId,
        title: "Full-Stack Web Application Development",
        description:
          "Looking for an experienced developer to build a comprehensive e-commerce platform with React, Node.js, and MongoDB. Must have experience with payment integration and user authentication.",
        category: "Web Development",
        subcategory: "Full-Stack Development",
        budget: { type: "fixed", amount: 5000 },
        deadline: "2024-02-15",
        duration: "2-3 months",
        experienceLevel: "expert",
        skills: ["React", "Node.js", "MongoDB", "Payment Integration"],
        client: {
          id: "1",
          name: "TechCorp Solutions",
          email: "contact@techcorp.com",
          avatar:
            "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=100&h=100&fit=crop",
          location: "San Francisco, CA",
          timezone: "PST",
          verified: true,
          joinedDate: "2023-01-01",
          companyName: "TechCorp Solutions",
          totalSpent: 47500,
          jobsPosted: 12,
          hireRate: 85.5,
          rating: 4.8,
          paymentVerified: true,
        },
        proposals: [],
        status: "open",
        postedDate: "2024-01-10T10:00:00Z",
        applicationsCount: 12,
        visibility: "public",
      };

      res.json(mockJob);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch job details" });
    }
  });

  app.post("/api/freelance/proposals", async (req, res) => {
    try {
      const proposalData = req.body;

      // Mock proposal creation
      const newProposal = {
        id: `proposal_${Date.now()}`,
        ...proposalData,
        submittedDate: new Date().toISOString(),
        status: "pending",
      };

      res.json(newProposal);
    } catch (error) {
      res.status(500).json({ error: "Failed to submit proposal" });
    }
  });

  app.get("/api/freelance/projects", async (req, res) => {
    try {
      const { userId, userType, status } = req.query;

      // Mock projects data
      const mockProjects = [
        {
          id: "project_1",
          job: {
            id: "1",
            title: "E-commerce Platform Development",
            category: "Web Development",
          },
          freelancer: {
            id: "freelancer_1",
            name: "John Smith",
            avatar:
              "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100",
          },
          client: {
            id: "client_1",
            name: "Alice Johnson",
            avatar:
              "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100",
          },
          status: "active",
          startDate: "2024-01-15T00:00:00Z",
          deadline: "2024-02-15T00:00:00Z",
          budget: {
            agreed: 5000,
            paid: 1500,
            remaining: 3500,
          },
          milestones: [
            {
              id: "1",
              title: "Project Setup & Architecture",
              description:
                "Set up development environment and project architecture",
              amount: 1500,
              dueDate: "2024-01-22",
              status: "approved",
            },
            {
              id: "2",
              title: "Frontend Development",
              description: "Build React frontend with responsive design",
              amount: 2000,
              dueDate: "2024-02-05",
              status: "in-progress",
            },
          ],
        },
      ];

      let filteredProjects = mockProjects;

      if (userType === "freelancer") {
        filteredProjects = filteredProjects.filter(
          (p) => p.freelancer.id === userId,
        );
      } else if (userType === "client") {
        filteredProjects = filteredProjects.filter(
          (p) => p.client.id === userId,
        );
      }

      if (status) {
        filteredProjects = filteredProjects.filter((p) => p.status === status);
      }

      res.json(filteredProjects);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch projects" });
    }
  });

  app.get("/api/freelance/stats/:userId", async (req, res) => {
    try {
      const userId = req.params.userId;

      // Mock freelance stats
      const mockStats = {
        totalEarnings: 24750,
        activeProjects: 3,
        completedProjects: 12,
        totalProjects: 15,
        rating: 4.8,
        successRate: 96,
        repeatClients: 67,
      };

      res.json(mockStats);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch freelance stats" });
    }
  });

  app.get("/api/freelance/categories", async (req, res) => {
    try {
      const categories = [
        "Web Development",
        "Mobile Development",
        "Design",
        "Writing & Content",
        "Digital Marketing",
        "Data Science",
        "DevOps & Cloud",
        "AI & Machine Learning",
      ];
      res.json(categories);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch categories" });
    }
  });

  app.get("/api/freelance/skills", async (req, res) => {
    try {
      const skills = [
        "React",
        "Node.js",
        "Python",
        "TypeScript",
        "Vue.js",
        "Angular",
        "Figma",
        "Adobe XD",
        "Photoshop",
        "Illustrator",
        "Content Writing",
        "SEO",
        "Social Media Marketing",
        "AWS",
        "Docker",
        "Kubernetes",
        "PostgreSQL",
        "MongoDB",
      ];
      res.json(skills);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch skills" });
    }
  });

  // Escrow API endpoints
  app.post("/api/escrow", async (req, res) => {
    try {
      const { projectId, clientId, freelancerId, amount, cryptoType } =
        req.body;

      // Mock escrow creation
      const newEscrow = {
        id: `escrow_${Date.now()}`,
        projectId,
        clientId,
        freelancerId,
        amount: amount.toString(),
        cryptoType,
        contractAddress: `0x${Math.random().toString(16).substr(2, 32)}`,
        transactionHash: `0x${Math.random().toString(16).substr(2, 64)}`,
        status: "pending",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      res.json(newEscrow);
    } catch (error) {
      res.status(500).json({ error: "Failed to create escrow" });
    }
  });

  app.post("/api/escrow/:id/release", async (req, res) => {
    try {
      const escrowId = req.params.id;
      const { clientId, milestoneId } = req.body;

      // Mock fund release
      const transactionHash = `0x${Math.random().toString(16).substr(2, 64)}`;

      res.json({
        success: true,
        transactionHash,
        message: "Funds released successfully",
      });
    } catch (error) {
      res.status(500).json({ error: "Failed to release funds" });
    }
  });

  app.post("/api/disputes", async (req, res) => {
    try {
      const { projectId, escrowId, reason, description, evidence } = req.body;

      // Mock dispute creation
      const disputeId = `dispute_${Date.now()}`;

      res.json({
        success: true,
        disputeId,
        message:
          "Dispute created successfully. Admin will review within 24 hours.",
      });
    } catch (error) {
      res.status(500).json({ error: "Failed to create dispute" });
    }
  });

  // Freelance messaging endpoints
  app.get("/api/freelance/projects/:projectId/messages", async (req, res) => {
    try {
      const projectId = req.params.projectId;
      const { limit = 50, offset = 0 } = req.query;

      // Mock messages
      const mockMessages = [
        {
          id: "msg_1",
          projectId,
          senderId: "client_1",
          content:
            "Hi! I'm excited to start working on this project. When can we schedule a kickoff call?",
          attachments: [],
          messageType: "text",
          read: true,
          createdAt: "2024-01-15T09:00:00Z",
          sender: {
            id: "client_1",
            name: "Alice Johnson",
            avatar:
              "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100",
          },
        },
        {
          id: "msg_2",
          projectId,
          senderId: "freelancer_1",
          content:
            "Hello Alice! I'm excited too. I'm available for a call today or tomorrow. What time works best for you?",
          attachments: [],
          messageType: "text",
          read: true,
          createdAt: "2024-01-15T09:15:00Z",
          sender: {
            id: "freelancer_1",
            name: "John Smith",
            avatar:
              "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100",
          },
        },
      ];

      const messages = mockMessages.slice(
        Number(offset),
        Number(offset) + Number(limit),
      );
      res.json({
        messages,
        total: mockMessages.length,
        hasMore: mockMessages.length > Number(offset) + Number(limit),
      });
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch messages" });
    }
  });

  app.post("/api/freelance/projects/:projectId/messages", async (req, res) => {
    try {
      const projectId = req.params.projectId;
      const { senderId, content, attachments, messageType = "text" } = req.body;

      // Mock message creation
      const newMessage = {
        id: `msg_${Date.now()}`,
        projectId,
        senderId,
        content,
        attachments: attachments || [],
        messageType,
        read: false,
        createdAt: new Date().toISOString(),
        sender: {
          id: senderId,
          name: "Current User",
          avatar: "/placeholder.svg",
        },
      };

      res.json(newMessage);
    } catch (error) {
      res.status(500).json({ error: "Failed to send message" });
    }
  });

  // Wallet API endpoints
  app.get("/api/wallet", async (req, res) => {
    try {
      // Mock wallet balance for now
      const walletBalance = {
        total: 23847.65,
        ecommerce: 8450.32,
        crypto: 12245.18,
        rewards: 1876.5,
        freelance: 1275.65,
      };
      res.json(walletBalance);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch wallet balance" });
    }
  });

  app.get("/api/wallet/transactions", async (req, res) => {
    try {
      const source = req.query.source as string;
      const limit = parseInt(req.query.limit as string) || 50;

      // Mock transactions data
      const mockTransactions = [
        {
          id: "1",
          type: "earned",
          amount: 245.75,
          source: "crypto",
          description: "Bitcoin trading profit",
          timestamp: "2024-01-15T10:30:00Z",
          status: "completed",
          sourceIcon: "💹",
        },
        {
          id: "2",
          type: "earned",
          amount: 125.0,
          source: "freelance",
          description: "Web design project completion",
          timestamp: "2024-01-14T16:45:00Z",
          status: "completed",
          sourceIcon: "💼",
        },
        {
          id: "3",
          type: "earned",
          amount: 89.5,
          source: "ecommerce",
          description: "Product sale commission",
          timestamp: "2024-01-14T09:15:00Z",
          status: "completed",
          sourceIcon: "🛒",
        },
        {
          id: "4",
          type: "earned",
          amount: 35.5,
          source: "rewards",
          description: "Daily check-in bonus",
          timestamp: "2024-01-13T12:00:00Z",
          status: "completed",
          sourceIcon: "🎁",
        },
        {
          id: "5",
          type: "withdrawal",
          amount: -500.0,
          source: "bank",
          description: "Bank withdrawal",
          timestamp: "2024-01-12T14:20:00Z",
          status: "completed",
          sourceIcon: "🏦",
        },
      ];

      let transactions = [...mockTransactions];

      if (source && source !== "all") {
        transactions = transactions.filter((t) => t.source === source);
      }

      transactions = transactions.slice(0, limit);

      res.json(transactions);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch transactions" });
    }
  });

  app.post("/api/wallet/withdraw", async (req, res) => {
    try {
      const { amount, source, bankAccount, description } = req.body;

      // Mock validation
      if (!amount || amount <= 0) {
        return res.status(400).json({ error: "Invalid withdrawal amount" });
      }

      if (!bankAccount) {
        return res.status(400).json({ error: "Bank account is required" });
      }

      // Mock processing delay
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const transactionId = `withdrawal_${Date.now()}`;

      res.json({
        success: true,
        transactionId,
        message: "Withdrawal request submitted successfully",
      });
    } catch (error) {
      res.status(500).json({ error: "Failed to process withdrawal" });
    }
  });

  app.post("/api/wallet/deposit", async (req, res) => {
    try {
      const { amount, method, source, description } = req.body;

      // Mock validation
      if (!amount || amount <= 0) {
        return res.status(400).json({ error: "Invalid deposit amount" });
      }

      if (!method || !source) {
        return res
          .status(400)
          .json({ error: "Payment method and source are required" });
      }

      // Mock processing delay
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const transactionId = `deposit_${Date.now()}`;

      res.json({
        success: true,
        transactionId,
        message: "Deposit processed successfully",
      });
    } catch (error) {
      res.status(500).json({ error: "Failed to process deposit" });
    }
  });

  app.get("/api/wallet/bank-accounts", async (req, res) => {
    try {
      // Mock bank accounts
      const mockBankAccounts = [
        {
          id: "1",
          name: "Primary Checking",
          accountNumber: "****1234",
          routingNumber: "123456789",
          bankName: "Chase Bank",
          isDefault: true,
        },
        {
          id: "2",
          name: "Savings Account",
          accountNumber: "****5678",
          routingNumber: "987654321",
          bankName: "Bank of America",
          isDefault: false,
        },
      ];

      res.json(mockBankAccounts);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch bank accounts" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
