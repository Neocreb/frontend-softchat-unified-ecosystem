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
