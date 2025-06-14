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
