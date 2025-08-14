import type { Express } from "express";
import { createServer, type Server } from "http";
import { WebSocketServer } from "ws";
import compression from "compression";
import {
  authenticateToken,
  requireRole,
  createRateLimitMiddleware,
  securityHeaders,
  corsOptions,
  globalErrorHandler,
  sanitizeInput,
  validateEmail,
  validatePassword,
  AppError,
} from "../config/security";
import {
  userOperations,
  profileOperations,
  postOperations,
  productOperations,
  followOperations,
  freelanceOperations,
  notificationOperations,
  searchOperations,
} from "../database/operations";
import {
  walletOperations,
  escrowOperations,
  chatOperations,
  p2pOperations,
  marketplaceOperations,
  boostOperations,
  premiumOperations,
  adminOperations,
} from "../database/enhanced-operations";
import { FileService, uploadMiddleware } from "../services/fileService";
import { emailService, emailQueue } from "../services/emailService";
import { PaymentService, FeeCalculator } from "../services/paymentService";
import cors from "cors";

// Rate limiting configurations
const authLimiter = createRateLimitMiddleware(5); // 5 attempts per window
const uploadLimiter = createRateLimitMiddleware(20); // 20 uploads per window
const apiLimiter = createRateLimitMiddleware(100); // 100 API calls per window

export async function registerEnhancedRoutes(app: Express): Promise<Server> {
  // Global middleware
  app.use(compression());
  app.use(securityHeaders);
  app.use(cors(corsOptions));
  app.use(apiLimiter);

  // Health check endpoint
  app.get("/health", (req, res) => {
    res.json({
      status: "ok",
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      features: {
        freelance: true,
        marketplace: true,
        p2pTrading: true,
        multiCurrencyWallet: true,
        boostSystem: true,
        premiumSubscriptions: true,
        multiAdminSystem: true,
        realTimeChat: true,
      },
      memory: process.memoryUsage(),
    });
  });

  // ============================================================================
  // AUTHENTICATION ROUTES
  // ============================================================================

  // User registration
  app.post("/api/auth/register", authLimiter, async (req, res, next) => {
    try {
      const { name, email, password } = sanitizeInput(req.body);

      // Validation
      if (!name || !email || !password) {
        throw new AppError("Name, email, and password are required", 400);
      }

      if (!validateEmail(email)) {
        throw new AppError("Invalid email format", 400);
      }

      const passwordValidation = validatePassword(password);
      if (!passwordValidation.isValid) {
        throw new AppError(passwordValidation.errors.join(", "), 400);
      }

      // Check if user exists
      const existingUser = await userOperations.findByEmail(email);
      if (existingUser) {
        throw new AppError("User already exists with this email", 409);
      }

      // Create user and profile
      const user = await userOperations.create({ email, password });
      const profile = await profileOperations.create({
        userId: user.id,
        name,
        username: email.split("@")[0],
      });

      // Send welcome email
      emailQueue.add({
        type: "welcome",
        recipient: email,
        data: { user, profile },
        maxAttempts: 3,
      });

      res.status(201).json({
        message: "User created successfully",
        user: { id: user.id, email: user.email },
        profile: {
          id: profile.id,
          name: profile.name,
          username: profile.username,
        },
      });
    } catch (error) {
      next(error);
    }
  });

  // User login
  app.post("/api/auth/login", authLimiter, async (req, res, next) => {
    try {
      const { email, password } = sanitizeInput(req.body);

      if (!email || !password) {
        throw new AppError("Email and password are required", 400);
      }

      const user = await userOperations.findByEmail(email);
      if (!user) {
        throw new AppError("Invalid credentials", 401);
      }

      // Compare password (you'll implement comparePassword in security.ts)
      // const isValidPassword = await comparePassword(password, user.password);
      // For now, direct comparison (INSECURE - FIX THIS)
      if (user.password !== password) {
        throw new AppError("Invalid credentials", 401);
      }

      const profile = await profileOperations.findByUserId(user.id);

      // Generate JWT token
      const { generateToken } = await import("../config/security");
      const token = generateToken({ ...user, role: profile?.role });

      res.json({
        message: "Login successful",
        token,
        user: { id: user.id, email: user.email },
        profile,
      });
    } catch (error) {
      next(error);
    }
  });

  // Get current user
  app.get("/api/auth/me", authenticateToken, async (req, res, next) => {
    try {
      const user = await userOperations.findById(req.user.userId);
      const profile = await profileOperations.findByUserId(req.user.userId);

      if (!user) {
        throw new AppError("User not found", 404);
      }

      res.json({ user, profile });
    } catch (error) {
      next(error);
    }
  });

  // ============================================================================
  // USER PROFILE ROUTES
  // ============================================================================

  // Get user profile
  app.get("/api/profiles/:userId", async (req, res, next) => {
    try {
      const profile = await profileOperations.findByUserId(req.params.userId);
      if (!profile) {
        throw new AppError("Profile not found", 404);
      }

      const followCounts = await followOperations.getFollowCounts(
        req.params.userId,
      );

      res.json({ ...profile, ...followCounts });
    } catch (error) {
      next(error);
    }
  });

  // Update user profile
  app.put(
    "/api/profiles/:userId",
    authenticateToken,
    async (req, res, next) => {
      try {
        const { userId } = req.params;

        // Check if user can update this profile
        if (req.user.userId !== userId && req.user.role !== "admin") {
          throw new AppError("Unauthorized to update this profile", 403);
        }

        const updates = sanitizeInput(req.body);
        const profile = await profileOperations.update(userId, updates);

        if (!profile) {
          throw new AppError("Profile not found", 404);
        }

        res.json(profile);
      } catch (error) {
        next(error);
      }
    },
  );

  // Upload avatar
  app.post(
    "/api/profiles/:userId/avatar",
    authenticateToken,
    uploadLimiter,
    uploadMiddleware.avatar,
    async (req, res, next) => {
      try {
        const { userId } = req.params;

        if (req.user.userId !== userId && req.user.role !== "admin") {
          throw new AppError("Unauthorized", 403);
        }

        if (!req.file) {
          throw new AppError("No file uploaded", 400);
        }

        const uploadResult = await FileService.uploadAvatar(req.file);

        // Update profile with new avatar URL
        await profileOperations.update(userId, {
          avatarUrl: uploadResult.variants?.medium || uploadResult.url,
        });

        res.json({
          message: "Avatar uploaded successfully",
          avatar: uploadResult,
        });
      } catch (error) {
        next(error);
      }
    },
  );

  // ============================================================================
  // SOCIAL FEED ROUTES
  // ============================================================================

  // Get feed posts
  app.get("/api/posts", async (req, res, next) => {
    try {
      const { limit = 50, offset = 0, userId } = req.query;
      const posts = await postOperations.getFeed(
        userId as string,
        parseInt(limit as string),
        parseInt(offset as string),
      );

      // Enhance posts with user data and engagement metrics
      const enhancedPosts = await Promise.all(
        posts.map(async (post) => {
          const [profile, likes, isLiked, comments] = await Promise.all([
            profileOperations.findByUserId(post.userId),
            postOperations.getLikes(post.id),
            userId ? postOperations.isLiked(post.id, userId as string) : false,
            postOperations.getComments(post.id),
          ]);

          return {
            ...post,
            user: profile,
            likes,
            isLiked,
            comments: comments.slice(0, 3), // First 3 comments
            totalComments: comments.length,
          };
        }),
      );

      res.json(enhancedPosts);
    } catch (error) {
      next(error);
    }
  });

  // Create post
  app.post(
    "/api/posts",
    authenticateToken,
    uploadMiddleware.postMedia,
    async (req, res, next) => {
      try {
        const { content, type = "post", tags } = sanitizeInput(req.body);

        if (!content && !req.file) {
          throw new AppError("Post must have content or media", 400);
        }

        let mediaUrl = null;
        if (req.file) {
          const uploadResult = await FileService.uploadPostMedia(req.file);
          mediaUrl = uploadResult.url;
        }

        const postData = {
          userId: req.user.userId,
          content: content || "",
          type,
          tags: tags ? JSON.parse(tags) : null,
          imageUrl: req.file?.mimetype.startsWith("image/") ? mediaUrl : null,
          videoUrl: req.file?.mimetype.startsWith("video/") ? mediaUrl : null,
        };

        const post = await postOperations.create(postData);

        // Award points for posting
        await profileOperations.updatePoints(req.user.userId, 10);

        res.status(201).json(post);
      } catch (error) {
        next(error);
      }
    },
  );

  // Like/unlike post
  app.post(
    "/api/posts/:postId/like",
    authenticateToken,
    async (req, res, next) => {
      try {
        const { postId } = req.params;
        const { userId } = req.user;

        const isLiked = await postOperations.isLiked(postId, userId);

        if (isLiked) {
          await postOperations.unlike(postId, userId);
        } else {
          await postOperations.like(postId, userId);

          // Create notification for post owner
          const post = await postOperations.findById(postId);
          if (post && post.userId !== userId) {
            await notificationOperations.create({
              userId: post.userId,
              title: "New Like",
              content: "Someone liked your post",
              type: "like",
              relatedUserId: userId,
              relatedPostId: postId,
            });
          }
        }

        const likes = await postOperations.getLikes(postId);
        res.json({ likes, isLiked: !isLiked });
      } catch (error) {
        next(error);
      }
    },
  );

  // Comment on post
  app.post(
    "/api/posts/:postId/comments",
    authenticateToken,
    async (req, res, next) => {
      try {
        const { postId } = req.params;
        const { content } = sanitizeInput(req.body);

        if (!content?.trim()) {
          throw new AppError("Comment content is required", 400);
        }

        const comment = await postOperations.addComment(
          postId,
          req.user.userId,
          content,
        );

        // Create notification for post owner
        const post = await postOperations.findById(postId);
        if (post && post.userId !== req.user.userId) {
          await notificationOperations.create({
            userId: post.userId,
            title: "New Comment",
            content: `Someone commented on your post: ${content.slice(0, 50)}...`,
            type: "comment",
            relatedUserId: req.user.userId,
            relatedPostId: postId,
          });
        }

        res.status(201).json(comment);
      } catch (error) {
        next(error);
      }
    },
  );

  // ============================================================================
  // MARKETPLACE ROUTES
  // ============================================================================

  // Get products
  app.get("/api/products", async (req, res, next) => {
    try {
      const filters = {
        category: req.query.category as string,
        minPrice: req.query.minPrice
          ? parseFloat(req.query.minPrice as string)
          : undefined,
        maxPrice: req.query.maxPrice
          ? parseFloat(req.query.maxPrice as string)
          : undefined,
        search: req.query.search as string,
        limit: parseInt(req.query.limit as string) || 50,
        offset: parseInt(req.query.offset as string) || 0,
      };

      const products = await productOperations.search(filters);

      // Enhance with seller info
      const enhancedProducts = await Promise.all(
        products.map(async (product) => {
          const seller = await profileOperations.findByUserId(product.sellerId);
          return { ...product, seller };
        }),
      );

      res.json(enhancedProducts);
    } catch (error) {
      next(error);
    }
  });

  // Create product
  app.post(
    "/api/products",
    authenticateToken,
    uploadMiddleware.productImages,
    async (req, res, next) => {
      try {
        const productData = sanitizeInput(req.body);

        if (
          !productData.name ||
          !productData.description ||
          !productData.price
        ) {
          throw new AppError("Name, description, and price are required", 400);
        }

        let imageUrl = null;
        if (req.files && Array.isArray(req.files) && req.files.length > 0) {
          const uploadResults = await FileService.uploadProductImages(
            req.files,
          );
          imageUrl = uploadResults[0].variants?.large || uploadResults[0].url;
        }

        const product = await productOperations.create({
          ...productData,
          sellerId: req.user.userId,
          imageUrl,
          price: parseFloat(productData.price),
        });

        res.status(201).json(product);
      } catch (error) {
        next(error);
      }
    },
  );

  // Purchase product
  app.post(
    "/api/products/:productId/purchase",
    authenticateToken,
    async (req, res, next) => {
      try {
        const { productId } = req.params;
        const { quantity = 1, paymentMethodId } = req.body;

        const product = await productOperations.findById(productId);
        if (!product) {
          throw new AppError("Product not found", 404);
        }

        const totalAmount = parseFloat(product.price) * quantity;
        const feePercentage = FeeCalculator.getFeePercentage(
          "marketplace_purchase",
        );

        const paymentIntent = await PaymentService.createPaymentIntent({
          userId: req.user.userId,
          type: "marketplace_purchase",
          amount: totalAmount,
          currency: "usd",
          description: `Purchase: ${product.name}`,
          feePercentage,
          metadata: {
            productId,
            sellerId: product.sellerId,
            quantity: quantity.toString(),
          },
        });

        res.json(paymentIntent);
      } catch (error) {
        next(error);
      }
    },
  );

  // ============================================================================
  // FREELANCE ROUTES
  // ============================================================================

  // Get freelance jobs
  app.get("/api/freelance/jobs", async (req, res, next) => {
    try {
      const filters = {
        category: req.query.category as string,
        experienceLevel: req.query.experienceLevel
          ? (req.query.experienceLevel as string).split(",")
          : undefined,
        budgetMin: req.query.budgetMin
          ? parseFloat(req.query.budgetMin as string)
          : undefined,
        budgetMax: req.query.budgetMax
          ? parseFloat(req.query.budgetMax as string)
          : undefined,
        skills: req.query.skills
          ? (req.query.skills as string).split(",")
          : undefined,
        search: req.query.search as string,
        limit: parseInt(req.query.limit as string) || 50,
        offset: parseInt(req.query.offset as string) || 0,
      };

      const jobs = await freelanceOperations.searchJobs(filters);

      // Enhance with client info
      const enhancedJobs = await Promise.all(
        jobs.map(async (job) => {
          const client = await profileOperations.findByUserId(job.clientId);
          return { ...job, client };
        }),
      );

      res.json(enhancedJobs);
    } catch (error) {
      next(error);
    }
  });

  // Create freelance job
  app.post("/api/freelance/jobs", authenticateToken, async (req, res, next) => {
    try {
      const jobData = sanitizeInput(req.body);

      if (!jobData.title || !jobData.description || !jobData.category) {
        throw new AppError(
          "Title, description, and category are required",
          400,
        );
      }

      const job = await freelanceOperations.createJob({
        ...jobData,
        clientId: req.user.userId,
        skills: Array.isArray(jobData.skills)
          ? jobData.skills
          : [jobData.skills],
      });

      res.status(201).json(job);
    } catch (error) {
      next(error);
    }
  });

  // Submit proposal
  app.post(
    "/api/freelance/jobs/:jobId/proposals",
    authenticateToken,
    async (req, res, next) => {
      try {
        const { jobId } = req.params;
        const proposalData = sanitizeInput(req.body);

        if (!proposalData.coverLetter || !proposalData.proposedAmount) {
          throw new AppError(
            "Cover letter and proposed amount are required",
            400,
          );
        }

        const proposal = await freelanceOperations.submitProposal({
          ...proposalData,
          jobId,
          freelancerId: req.user.userId,
          proposedAmount: parseFloat(proposalData.proposedAmount),
        });

        res.status(201).json(proposal);
      } catch (error) {
        next(error);
      }
    },
  );

  // ============================================================================
  // FILE UPLOAD ROUTES
  // ============================================================================

  // Generic file upload
  app.post(
    "/api/upload",
    authenticateToken,
    uploadLimiter,
    uploadMiddleware.single("file"),
    async (req, res, next) => {
      try {
        if (!req.file) {
          throw new AppError("No file uploaded", 400);
        }

        const folder = (req.query.folder as string) || "uploads";
        const generateVariants = req.query.variants === "true";

        const uploadResult = await FileService.uploadFile(
          req.file,
          folder,
          generateVariants,
        );

        res.json(uploadResult);
      } catch (error) {
        next(error);
      }
    },
  );

  // ============================================================================
  // SEARCH ROUTES
  // ============================================================================

  // Global search
  app.get("/api/search", async (req, res, next) => {
    try {
      const { q: query, limit = 20 } = req.query;

      if (!query || typeof query !== "string") {
        throw new AppError("Search query is required", 400);
      }

      const results = await searchOperations.searchAll(
        query,
        parseInt(limit as string),
      );

      res.json(results);
    } catch (error) {
      next(error);
    }
  });

  // ============================================================================
  // NOTIFICATION ROUTES
  // ============================================================================

  // Get user notifications
  app.get("/api/notifications", authenticateToken, async (req, res, next) => {
    try {
      const { limit = 50 } = req.query;

      const notifications = await notificationOperations.getUserNotifications(
        req.user.userId,
        parseInt(limit as string),
      );

      const unreadCount = await notificationOperations.getUnreadCount(
        req.user.userId,
      );

      res.json({ notifications, unreadCount });
    } catch (error) {
      next(error);
    }
  });

  // Mark notification as read
  app.put(
    "/api/notifications/:notificationId/read",
    authenticateToken,
    async (req, res, next) => {
      try {
        const { notificationId } = req.params;

        const success = await notificationOperations.markAsRead(
          notificationId,
          req.user.userId,
        );

        if (!success) {
          throw new AppError("Notification not found", 404);
        }

        res.json({ message: "Notification marked as read" });
      } catch (error) {
        next(error);
      }
    },
  );

  // ============================================================================
  // PAYMENT WEBHOOK
  // ============================================================================

  // Stripe webhook
  app.post("/api/webhooks/stripe", async (req, res, next) => {
    try {
      const signature = req.headers["stripe-signature"] as string;

      await PaymentService.handleWebhook(req.body, signature);

      res.json({ received: true });
    } catch (error) {
      next(error);
    }
  });

  // ============================================================================
  // ADMIN ROUTES
  // ============================================================================

  // Get platform analytics (admin only)
  app.get(
    "/api/admin/analytics",
    authenticateToken,
    requireRole(["admin"]),
    async (req, res, next) => {
      try {
        const { startDate, endDate } = req.query;

        const analytics = await PaymentService.getPaymentAnalytics(
          new Date(startDate as string),
          new Date(endDate as string),
        );

        res.json(analytics);
      } catch (error) {
        next(error);
      }
    },
  );

  // ============================================================================
  // ERROR HANDLING
  // ============================================================================

  // Global error handler
  app.use(globalErrorHandler);

  // 404 handler - commented out to allow static file serving in comprehensive server
  // app.use((req, res) => {
  //   res.status(404).json({ error: "Route not found" });
  // });

  // =============================================================================
  // COMPREHENSIVE PLATFORM ROUTES
  // =============================================================================

  // Get wallet balance
  app.get("/api/wallet", authenticateToken, async (req, res, next) => {
    try {
      const userId = (req as any).user.userId;

      // Mock wallet data
      const wallet = {
        id: `wallet-${userId}`,
        userId,
        usdtBalance: "1500.00",
        ethBalance: "6.8", // Match centralized portfolio data
        btcBalance: "2.5", // Match centralized portfolio data
        softPointsBalance: "5000.00",
        isFrozen: false,
        createdAt: new Date().toISOString(),
      };

      res.json({ success: true, wallet });
    } catch (error) {
      next(error);
    }
  });

  // Send money
  app.post("/api/wallet/send", authenticateToken, async (req, res, next) => {
    try {
      const userId = (req as any).user.userId;
      const { recipientId, amount, currency, description } = req.body;

      if (!recipientId || !amount || !currency) {
        return res.status(400).json({
          success: false,
          error: "Missing required fields: recipientId, amount, currency",
        });
      }

      res.json({
        success: true,
        message: "Transfer completed successfully",
        transactionId: `txn-${Date.now()}`,
      });
    } catch (error) {
      next(error);
    }
  });

  // Get transaction history
  app.get("/api/wallet/history", authenticateToken, async (req, res, next) => {
    try {
      const transactions = [
        {
          id: "txn-1",
          type: "transfer",
          currency: "SOFT_POINTS",
          amount: "100.00",
          description: "Transfer to John",
          status: "confirmed",
          createdAt: new Date().toISOString(),
        },
        {
          id: "txn-2",
          type: "boost_payment",
          currency: "SOFT_POINTS",
          amount: "-50.00",
          description: "Boost payment",
          status: "confirmed",
          createdAt: new Date(Date.now() - 86400000).toISOString(),
        },
      ];

      res.json({ success: true, transactions });
    } catch (error) {
      next(error);
    }
  });

  // Request boost
  app.post("/api/boost/request", authenticateToken, async (req, res, next) => {
    try {
      const userId = (req as any).user.userId;
      const { type, referenceId, boostType, duration, paymentMethod } =
        req.body;

      const baseCosts = {
        featured: 100,
        top_listing: 200,
        premium_placement: 300,
        highlight: 50,
      };
      const cost =
        (baseCosts[boostType as keyof typeof baseCosts] || 100) *
        (duration / 24);

      res.status(201).json({
        success: true,
        message: "Boost request submitted for approval",
        boostId: `boost-${Date.now()}`,
      });
    } catch (error) {
      next(error);
    }
  });

  // Get user boosts
  app.get("/api/boosts", authenticateToken, async (req, res, next) => {
    try {
      const boosts = [
        {
          id: "boost-1",
          type: "freelance_job",
          boostType: "featured",
          duration: 72,
          cost: "300",
          status: "active",
          startDate: new Date().toISOString(),
          endDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
        },
      ];

      res.json({ success: true, boosts });
    } catch (error) {
      next(error);
    }
  });

  // Subscribe to premium
  app.post(
    "/api/premium/subscribe",
    authenticateToken,
    async (req, res, next) => {
      try {
        const { tier, billingType } = req.body;

        const pricing = {
          silver: { monthly: 9.99, yearly: 99.99 },
          gold: { monthly: 19.99, yearly: 199.99 },
          pro: { monthly: 39.99, yearly: 399.99 },
        };

        const price =
          pricing[tier as keyof typeof pricing][
            billingType as keyof typeof pricing.silver
          ];

        res.status(201).json({
          success: true,
          message: "Premium subscription activated",
          subscription: {
            id: `sub-${Date.now()}`,
            tier,
            billingType,
            price: price.toString(),
            status: "active",
          },
        });
      } catch (error) {
        next(error);
      }
    },
  );

  // Get premium status
  app.get("/api/premium/status", authenticateToken, async (req, res, next) => {
    try {
      const subscription = {
        id: "sub-demo",
        tier: "gold",
        status: "active",
        monthlyBoostCredits: 15,
        usedBoostCredits: 3,
        endDate: new Date(Date.now() + 25 * 24 * 60 * 60 * 1000).toISOString(),
      };

      res.json({
        success: true,
        subscription,
        isPremium: true,
      });
    } catch (error) {
      next(error);
    }
  });

  // Admin login
  app.post("/api/admin/login", async (req, res, next) => {
    try {
      const { email, password } = req.body;

      if (email === "admin@softchat.com" && password === "SoftChat2024!") {
        const token = "demo-admin-token-" + Date.now();
        const admin = {
          id: "demo-admin-001",
          name: "Demo Administrator",
          email: "admin@softchat.com",
          roles: ["super_admin"],
          permissions: ["admin.all"],
        };

        res.json({ success: true, token, admin });
        return;
      }

      res.status(401).json({
        success: false,
        error: "Invalid credentials. Use admin@softchat.com / SoftChat2024!",
      });
    } catch (error) {
      next(error);
    }
  });

  // Admin dashboard data
  app.get("/api/admin/dashboard", async (req, res, next) => {
    try {
      const dashboard = {
        stats: {
          totalUsers: 1247,
          activeUsers: 892,
          totalProducts: 156,
          totalJobs: 89,
          totalTrades: 234,
          pendingModeration: 12,
          revenueMonth: 48500,
          activeBoosts: 27,
          premiumSubscribers: { silver: 45, gold: 23, pro: 8 },
        },
        recentActivity: [
          {
            id: "1",
            adminName: "Demo Admin",
            action: "user_verification",
            description: "Verified user account",
            createdAt: new Date().toISOString(),
          },
        ],
        activeAdmins: [
          {
            id: "demo-admin-001",
            name: "Demo Administrator",
            email: "admin@softchat.com",
            roles: ["super_admin"],
          },
        ],
        systemHealth: {
          cpu: 45,
          memory: 62,
          storage: 78,
          apiLatency: 120,
          errorRate: 0.02,
        },
      };

      res.json({ success: true, dashboard });
    } catch (error) {
      next(error);
    }
  });

  // Admin user management
  app.get("/api/admin/users", async (req, res, next) => {
    try {
      const mockUsers = [
        {
          id: "user-1",
          email: "john@example.com",
          emailConfirmed: true,
          createdAt: new Date().toISOString(),
          profile: {
            fullName: "John Doe",
            username: "johndoe",
            status: "active",
            isVerified: true,
            role: "user",
            level: "silver",
            points: 1250,
          },
          wallet: {
            usdtBalance: "500.00",
            ethBalance: "0.1",
            btcBalance: "0.005",
            softPointsBalance: "2500.00",
            isFrozen: false,
          },
        },
        {
          id: "user-2",
          email: "jane@example.com",
          emailConfirmed: true,
          createdAt: new Date(Date.now() - 86400000).toISOString(),
          profile: {
            fullName: "Jane Smith",
            username: "janesmith",
            status: "active",
            isVerified: true,
            role: "premium",
            level: "gold",
            points: 3450,
          },
          wallet: {
            usdtBalance: "1200.00",
            ethBalance: "0.5",
            btcBalance: "0.02",
            softPointsBalance: "5000.00",
            isFrozen: false,
          },
        },
      ];

      res.json({
        success: true,
        users: mockUsers,
        pagination: {
          total: mockUsers.length,
          limit: 50,
          offset: 0,
          hasMore: false,
        },
      });
    } catch (error) {
      next(error);
    }
  });

  // Suspend user
  app.post("/api/admin/users/:userId/suspend", async (req, res, next) => {
    try {
      const { userId } = req.params;
      const { type, reason } = req.body;
      console.log(`Suspending user ${userId}: ${type} - ${reason}`);
      res.json({ success: true, message: "User suspended successfully" });
    } catch (error) {
      next(error);
    }
  });

  // Get boost requests for admin
  app.get("/api/admin/boosts", async (req, res, next) => {
    try {
      const boosts = [
        {
          id: "boost-1",
          type: "freelance_job",
          referenceId: "job-123",
          boostType: "featured",
          duration: 72,
          cost: "300",
          currency: "SOFT_POINTS",
          status: "pending",
          createdAt: new Date().toISOString(),
          user: { name: "John Doe", email: "john@example.com" },
        },
      ];

      res.json({ success: true, boosts });
    } catch (error) {
      next(error);
    }
  });

  // Approve/reject boost
  app.post("/api/admin/boosts/:boostId/:action", async (req, res, next) => {
    try {
      const { boostId, action } = req.params;

      if (!["approve", "reject"].includes(action)) {
        return res.status(400).json({
          success: false,
          error: "Invalid action. Use 'approve' or 'reject'",
        });
      }

      res.json({ success: true, message: `Boost ${action}ed successfully` });
    } catch (error) {
      next(error);
    }
  });

  // Platform earnings
  app.get("/api/admin/earnings", async (req, res, next) => {
    try {
      const earnings = [
        {
          id: "earn-1",
          sourceType: "freelance",
          feeAmount: "250.00",
          currency: "USDT",
          description: "Freelance platform fee",
          earnedAt: new Date().toISOString(),
          user: { email: "freelancer@example.com", name: "Alice Johnson" },
        },
      ];

      const summary = {
        totalEarnings: 15420.8,
        totalUsdEarnings: 15420.8,
        transactionCount: 127,
      };

      res.json({ success: true, earnings, summary });
    } catch (error) {
      next(error);
    }
  });

  // ============================================================================
  // WEBSOCKET SERVER
  // ============================================================================

  const httpServer = createServer(app);
  const wss = new WebSocketServer({ server: httpServer });

  wss.on("connection", (ws, req) => {
    console.log("New WebSocket connection");

    ws.on("message", async (data) => {
      try {
        const message = JSON.parse(data.toString());

        switch (message.type) {
          case "subscribe_notifications":
            // Subscribe to user notifications
            ws.userId = message.userId;
            break;
          case "subscribe_chat":
            // Subscribe to chat messages
            ws.chatId = message.chatId;
            break;
          default:
            console.log("Unknown message type:", message.type);
        }
      } catch (error) {
        console.error("WebSocket message error:", error);
      }
    });

    ws.on("close", () => {
      console.log("WebSocket connection closed");
    });
  });

  // WebSocket notification broadcaster
  global.broadcastNotification = (userId: string, notification: any) => {
    wss.clients.forEach((client: any) => {
      if (client.userId === userId && client.readyState === client.OPEN) {
        client.send(
          JSON.stringify({
            type: "notification",
            data: notification,
          }),
        );
      }
    });
  };

  return httpServer;
}
