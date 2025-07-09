import express from "express";
import { z } from "zod";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import {
  eq,
  and,
  or,
  desc,
  asc,
  count,
  sql,
  like,
  gte,
  lte,
  inArray,
} from "drizzle-orm";
import { db } from "../db";
import {
  authenticateToken,
  requireRole,
  createRateLimitMiddleware,
  sanitizeInput,
  validateEmail,
  validatePassword,
  AppError,
} from "../config/security";
import {
  wallets,
  walletTransactions,
  escrowContracts,
  escrowMilestones,
  boosts,
  premiumSubscriptions,
  chatThreads,
  chatMessages,
  p2pTrades,
  p2pDisputes,
  marketplaceOrders,
  marketplaceReviews,
  platformEarnings,
  adminUsers,
  adminActivityLogs,
  contentReports,
  userSuspensions,
} from "../../shared/enhanced-schema";

import {
  users,
  profiles,
  freelanceJobs,
  freelanceProposals,
  freelanceProjects,
  products,
} from "../../shared/schema";

const router = express.Router();

// Rate limiters
const authLimiter = createRateLimitMiddleware(5);
const apiLimiter = createRateLimitMiddleware(100);
const uploadLimiter = createRateLimitMiddleware(20);

// =============================================================================
// AUTHENTICATION & USER MANAGEMENT
// =============================================================================

// User Registration
router.post("/auth/register", authLimiter, async (req, res, next) => {
  try {
    const { email, password, fullName, username } = req.body;

    // Validate input
    if (!validateEmail(email)) {
      throw new AppError("Invalid email format", 400);
    }
    if (!validatePassword(password)) {
      throw new AppError("Password must be at least 8 characters", 400);
    }

    // Check if user exists
    const existingUser = await db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1);

    if (existingUser.length > 0) {
      throw new AppError("User already exists", 409);
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create user and profile
    const [newUser] = await db
      .insert(users)
      .values({
        email,
        password: hashedPassword,
        emailConfirmed: false,
      })
      .returning();

    const [profile] = await db
      .insert(profiles)
      .values({
        userId: newUser.id,
        fullName,
        username,
        name: fullName,
      })
      .returning();

    // Create wallet
    await db.insert(wallets).values({
      userId: newUser.id,
    });

    // Generate JWT
    const token = jwt.sign(
      { userId: newUser.id, email: newUser.email },
      process.env.JWT_SECRET!,
      { expiresIn: "7d" },
    );

    res.status(201).json({
      success: true,
      token,
      user: {
        id: newUser.id,
        email: newUser.email,
        profile,
      },
    });
  } catch (error) {
    next(error);
  }
});

// User Login
router.post("/auth/login", authLimiter, async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Find user
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1);

    if (!user) {
      throw new AppError("Invalid credentials", 401);
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      throw new AppError("Invalid credentials", 401);
    }

    // Get profile
    const [profile] = await db
      .select()
      .from(profiles)
      .where(eq(profiles.userId, user.id))
      .limit(1);

    // Generate JWT
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.JWT_SECRET!,
      { expiresIn: "7d" },
    );

    res.json({
      success: true,
      token,
      user: {
        id: user.id,
        email: user.email,
        emailConfirmed: user.emailConfirmed,
        profile,
      },
    });
  } catch (error) {
    next(error);
  }
});

// Get Current User
router.get("/users/me", authenticateToken, async (req, res, next) => {
  try {
    const userId = req.user!.userId;

    const [profile] = await db
      .select()
      .from(profiles)
      .where(eq(profiles.userId, userId))
      .limit(1);

    const [wallet] = await db
      .select()
      .from(wallets)
      .where(eq(wallets.userId, userId))
      .limit(1);

    res.json({
      success: true,
      user: {
        id: userId,
        profile,
        wallet,
      },
    });
  } catch (error) {
    next(error);
  }
});

// =============================================================================
// WALLET SYSTEM
// =============================================================================

// Get Wallet Balance
router.get("/wallet", authenticateToken, async (req, res, next) => {
  try {
    const userId = req.user!.userId;

    const [wallet] = await db
      .select()
      .from(wallets)
      .where(eq(wallets.userId, userId))
      .limit(1);

    if (!wallet) {
      throw new AppError("Wallet not found", 404);
    }

    res.json({
      success: true,
      wallet,
    });
  } catch (error) {
    next(error);
  }
});

// Send Money
router.post("/wallet/send", authenticateToken, async (req, res, next) => {
  try {
    const userId = req.user!.userId;
    const { recipientId, amount, currency, description } = req.body;

    // Validate inputs
    if (!recipientId || !amount || !currency) {
      throw new AppError("Missing required fields", 400);
    }

    const amountDecimal = parseFloat(amount);
    if (amountDecimal <= 0) {
      throw new AppError("Amount must be greater than 0", 400);
    }

    // Get sender wallet
    const [senderWallet] = await db
      .select()
      .from(wallets)
      .where(eq(wallets.userId, userId))
      .limit(1);

    if (!senderWallet || senderWallet.isFrozen) {
      throw new AppError("Wallet not available", 400);
    }

    // Check balance
    const currentBalance = parseFloat(
      currency === "USDT"
        ? senderWallet.usdtBalance
        : currency === "ETH"
          ? senderWallet.ethBalance
          : currency === "BTC"
            ? senderWallet.btcBalance
            : senderWallet.softPointsBalance,
    );

    if (currentBalance < amountDecimal) {
      throw new AppError("Insufficient balance", 400);
    }

    // Get recipient wallet
    const [recipientWallet] = await db
      .select()
      .from(wallets)
      .where(eq(wallets.userId, recipientId))
      .limit(1);

    if (!recipientWallet) {
      throw new AppError("Recipient wallet not found", 404);
    }

    // Calculate platform fee (0.1% for transfers)
    const feePercentage = 0.001;
    const fee = amountDecimal * feePercentage;
    const netAmount = amountDecimal - fee;

    // Start database transaction
    await db.transaction(async (tx) => {
      // Debit sender
      const updateField =
        currency === "USDT"
          ? { usdtBalance: sql`usdt_balance - ${amountDecimal}` }
          : currency === "ETH"
            ? { ethBalance: sql`eth_balance - ${amountDecimal}` }
            : currency === "BTC"
              ? { btcBalance: sql`btc_balance - ${amountDecimal}` }
              : {
                  softPointsBalance: sql`soft_points_balance - ${amountDecimal}`,
                };

      await tx
        .update(wallets)
        .set(updateField)
        .where(eq(wallets.userId, userId));

      // Credit recipient
      const creditField =
        currency === "USDT"
          ? { usdtBalance: sql`usdt_balance + ${netAmount}` }
          : currency === "ETH"
            ? { ethBalance: sql`eth_balance + ${netAmount}` }
            : currency === "BTC"
              ? { btcBalance: sql`btc_balance + ${netAmount}` }
              : { softPointsBalance: sql`soft_points_balance + ${netAmount}` };

      await tx
        .update(wallets)
        .set(creditField)
        .where(eq(wallets.userId, recipientId));

      // Record sender transaction
      await tx.insert(walletTransactions).values({
        walletId: senderWallet.id,
        userId: userId,
        type: "transfer",
        currency,
        amount: amountDecimal.toString(),
        fee: fee.toString(),
        netAmount: amountDecimal.toString(),
        relatedUserId: recipientId,
        status: "confirmed",
        description: description || "Transfer",
      });

      // Record recipient transaction
      await tx.insert(walletTransactions).values({
        walletId: recipientWallet.id,
        userId: recipientId,
        type: "transfer",
        currency,
        amount: netAmount.toString(),
        fee: "0",
        netAmount: netAmount.toString(),
        relatedUserId: userId,
        status: "confirmed",
        description: description || "Transfer received",
      });

      // Record platform earnings
      if (fee > 0) {
        await tx.insert(platformEarnings).values({
          sourceType: "transfer",
          referenceId: senderWallet.id,
          userId: userId,
          grossAmount: amountDecimal.toString(),
          feeAmount: fee.toString(),
          feePercentage: (feePercentage * 100).toString(),
          currency,
          description: "Transfer fee",
        });
      }
    });

    res.json({
      success: true,
      message: "Transfer completed successfully",
      transactionId: `txn_${Date.now()}`,
    });
  } catch (error) {
    next(error);
  }
});

// Get Wallet History
router.get("/wallet/history", authenticateToken, async (req, res, next) => {
  try {
    const userId = req.user!.userId;
    const { limit = 50, offset = 0, type, currency } = req.query;

    let query = db
      .select()
      .from(walletTransactions)
      .where(eq(walletTransactions.userId, userId))
      .orderBy(desc(walletTransactions.createdAt))
      .limit(parseInt(limit as string))
      .offset(parseInt(offset as string));

    if (type) {
      query = query.where(
        and(
          eq(walletTransactions.userId, userId),
          eq(walletTransactions.type, type as string),
        ),
      );
    }

    if (currency) {
      query = query.where(
        and(
          eq(walletTransactions.userId, userId),
          eq(walletTransactions.currency, currency as string),
        ),
      );
    }

    const transactions = await query;

    res.json({
      success: true,
      transactions,
    });
  } catch (error) {
    next(error);
  }
});

// =============================================================================
// FREELANCE MODULE
// =============================================================================

// Create Job Posting
router.post("/jobs", authenticateToken, async (req, res, next) => {
  try {
    const userId = req.user!.userId;
    const jobData = req.body;

    const [job] = await db
      .insert(freelanceJobs)
      .values({
        ...jobData,
        clientId: userId,
      })
      .returning();

    res.status(201).json({
      success: true,
      job,
    });
  } catch (error) {
    next(error);
  }
});

// Get Jobs (with filters)
router.get("/jobs", async (req, res, next) => {
  try {
    const {
      category,
      budgetMin,
      budgetMax,
      experienceLevel,
      limit = 20,
      offset = 0,
      search,
    } = req.query;

    let query = db
      .select({
        id: freelanceJobs.id,
        title: freelanceJobs.title,
        description: freelanceJobs.description,
        category: freelanceJobs.category,
        budgetType: freelanceJobs.budgetType,
        budgetMin: freelanceJobs.budgetMin,
        budgetMax: freelanceJobs.budgetMax,
        budgetAmount: freelanceJobs.budgetAmount,
        deadline: freelanceJobs.deadline,
        duration: freelanceJobs.duration,
        experienceLevel: freelanceJobs.experienceLevel,
        skills: freelanceJobs.skills,
        status: freelanceJobs.status,
        applicationsCount: freelanceJobs.applicationsCount,
        createdAt: freelanceJobs.createdAt,
        client: {
          id: profiles.userId,
          name: profiles.fullName,
          avatar: profiles.avatar,
          isVerified: profiles.isVerified,
        },
      })
      .from(freelanceJobs)
      .innerJoin(profiles, eq(profiles.userId, freelanceJobs.clientId))
      .where(eq(freelanceJobs.status, "open"))
      .orderBy(desc(freelanceJobs.createdAt))
      .limit(parseInt(limit as string))
      .offset(parseInt(offset as string));

    // Apply filters
    if (category) {
      query = query.where(
        and(
          eq(freelanceJobs.status, "open"),
          eq(freelanceJobs.category, category as string),
        ),
      );
    }

    if (experienceLevel) {
      query = query.where(
        and(
          eq(freelanceJobs.status, "open"),
          eq(freelanceJobs.experienceLevel, experienceLevel as string),
        ),
      );
    }

    if (search) {
      query = query.where(
        and(
          eq(freelanceJobs.status, "open"),
          or(
            like(freelanceJobs.title, `%${search}%`),
            like(freelanceJobs.description, `%${search}%`),
          ),
        ),
      );
    }

    if (budgetMin) {
      query = query.where(
        and(
          eq(freelanceJobs.status, "open"),
          gte(freelanceJobs.budgetMin, budgetMin as string),
        ),
      );
    }

    if (budgetMax) {
      query = query.where(
        and(
          eq(freelanceJobs.status, "open"),
          lte(freelanceJobs.budgetMax, budgetMax as string),
        ),
      );
    }

    const jobs = await query;

    res.json({
      success: true,
      jobs,
    });
  } catch (error) {
    next(error);
  }
});

// Apply to Job
router.post("/jobs/:jobId/apply", authenticateToken, async (req, res, next) => {
  try {
    const userId = req.user!.userId;
    const { jobId } = req.params;
    const proposalData = req.body;

    // Check if job exists and is open
    const [job] = await db
      .select()
      .from(freelanceJobs)
      .where(and(eq(freelanceJobs.id, jobId), eq(freelanceJobs.status, "open")))
      .limit(1);

    if (!job) {
      throw new AppError("Job not found or no longer available", 404);
    }

    // Check if user already applied
    const existingProposal = await db
      .select()
      .from(freelanceProposals)
      .where(
        and(
          eq(freelanceProposals.jobId, jobId),
          eq(freelanceProposals.freelancerId, userId),
        ),
      )
      .limit(1);

    if (existingProposal.length > 0) {
      throw new AppError("You have already applied to this job", 409);
    }

    // Create proposal
    const [proposal] = await db
      .insert(freelanceProposals)
      .values({
        ...proposalData,
        jobId,
        freelancerId: userId,
      })
      .returning();

    // Update applications count
    await db
      .update(freelanceJobs)
      .set({
        applicationsCount: sql`applications_count + 1`,
      })
      .where(eq(freelanceJobs.id, jobId));

    res.status(201).json({
      success: true,
      proposal,
    });
  } catch (error) {
    next(error);
  }
});

// Accept Job Proposal
router.post(
  "/jobs/:jobId/accept",
  authenticateToken,
  async (req, res, next) => {
    try {
      const userId = req.user!.userId;
      const { jobId } = req.params;
      const { proposalId } = req.body;

      // Verify job ownership
      const [job] = await db
        .select()
        .from(freelanceJobs)
        .where(
          and(eq(freelanceJobs.id, jobId), eq(freelanceJobs.clientId, userId)),
        )
        .limit(1);

      if (!job) {
        throw new AppError("Job not found or unauthorized", 404);
      }

      // Get proposal
      const [proposal] = await db
        .select()
        .from(freelanceProposals)
        .where(
          and(
            eq(freelanceProposals.id, proposalId),
            eq(freelanceProposals.jobId, jobId),
          ),
        )
        .limit(1);

      if (!proposal) {
        throw new AppError("Proposal not found", 404);
      }

      await db.transaction(async (tx) => {
        // Update proposal status
        await tx
          .update(freelanceProposals)
          .set({
            status: "accepted",
            respondedAt: new Date(),
          })
          .where(eq(freelanceProposals.id, proposalId));

        // Create project
        const [project] = await tx
          .insert(freelanceProjects)
          .values({
            jobId,
            proposalId,
            freelancerId: proposal.freelancerId,
            clientId: userId,
            agreedBudget: proposal.proposedAmount,
            remainingAmount: proposal.proposedAmount,
            status: "active",
          })
          .returning();

        // Create escrow contract
        const [escrow] = await tx
          .insert(escrowContracts)
          .values({
            payerId: userId,
            payeeId: proposal.freelancerId,
            type: "freelance",
            referenceId: project.id,
            currency: "USDT", // Default to USDT
            amount: proposal.proposedAmount,
            terms: `Freelance project: ${job.title}`,
            autoReleaseHours: 72,
          })
          .returning();

        // Update project with escrow ID
        await tx
          .update(freelanceProjects)
          .set({ escrowId: escrow.id })
          .where(eq(freelanceProjects.id, project.id));

        // Update job status
        await tx
          .update(freelanceJobs)
          .set({ status: "in-progress" })
          .where(eq(freelanceJobs.id, jobId));

        // Create chat thread for the project
        await tx.insert(chatThreads).values({
          type: "freelance",
          referenceId: project.id,
          participants: [userId, proposal.freelancerId],
          createdBy: userId,
          title: `Project: ${job.title}`,
        });
      });

      res.json({
        success: true,
        message: "Proposal accepted and project created",
      });
    } catch (error) {
      next(error);
    }
  },
);

// Release Escrow (Complete Job)
router.post(
  "/jobs/:jobId/release-escrow",
  authenticateToken,
  async (req, res, next) => {
    try {
      const userId = req.user!.userId;
      const { jobId } = req.params;
      const { releaseNotes, rating } = req.body;

      // Get project and verify ownership
      const [project] = await db
        .select()
        .from(freelanceProjects)
        .where(
          and(
            eq(freelanceProjects.jobId, jobId),
            eq(freelanceProjects.clientId, userId),
          ),
        )
        .limit(1);

      if (!project) {
        throw new AppError("Project not found or unauthorized", 404);
      }

      // Get escrow contract
      const [escrow] = await db
        .select()
        .from(escrowContracts)
        .where(eq(escrowContracts.id, project.escrowId!))
        .limit(1);

      if (!escrow || escrow.status !== "funded") {
        throw new AppError("Escrow not found or not funded", 400);
      }

      await db.transaction(async (tx) => {
        // Update escrow status
        await tx
          .update(escrowContracts)
          .set({
            status: "released",
            releasedAt: new Date(),
            releaseApprovedBy: userId,
            releaseNotes,
          })
          .where(eq(escrowContracts.id, escrow.id));

        // Update project status
        await tx
          .update(freelanceProjects)
          .set({
            status: "completed",
            endDate: new Date(),
          })
          .where(eq(freelanceProjects.id, project.id));

        // Update job status
        await tx
          .update(freelanceJobs)
          .set({ status: "completed" })
          .where(eq(freelanceJobs.id, jobId));

        // Transfer funds to freelancer
        const [freelancerWallet] = await tx
          .select()
          .from(wallets)
          .where(eq(wallets.userId, project.freelancerId))
          .limit(1);

        if (freelancerWallet) {
          // Calculate platform fee (10% for freelance)
          const grossAmount = parseFloat(escrow.amount);
          const feePercentage = 0.1;
          const feeAmount = grossAmount * feePercentage;
          const netAmount = grossAmount - feeAmount;

          // Credit freelancer wallet
          await tx
            .update(wallets)
            .set({
              usdtBalance: sql`usdt_balance + ${netAmount}`,
            })
            .where(eq(wallets.userId, project.freelancerId));

          // Record transaction
          await tx.insert(walletTransactions).values({
            walletId: freelancerWallet.id,
            userId: project.freelancerId,
            type: "escrow_release",
            currency: escrow.currency,
            amount: netAmount.toString(),
            fee: feeAmount.toString(),
            netAmount: netAmount.toString(),
            referenceType: "freelance_job",
            referenceId: jobId,
            relatedUserId: userId,
            status: "confirmed",
            description: `Freelance payment for: ${releaseNotes || "Project completed"}`,
          });

          // Record platform earnings
          await tx.insert(platformEarnings).values({
            sourceType: "freelance",
            referenceId: project.id,
            userId: project.freelancerId,
            grossAmount: grossAmount.toString(),
            feeAmount: feeAmount.toString(),
            feePercentage: (feePercentage * 100).toString(),
            currency: escrow.currency,
            description: "Freelance platform fee",
          });
        }
      });

      res.json({
        success: true,
        message: "Escrow released successfully",
      });
    } catch (error) {
      next(error);
    }
  },
);

// =============================================================================
// MARKETPLACE MODULE
// =============================================================================

// Create Product
router.post("/products", authenticateToken, async (req, res, next) => {
  try {
    const userId = req.user!.userId;
    const productData = req.body;

    const [product] = await db
      .insert(products)
      .values({
        ...productData,
        sellerId: userId,
      })
      .returning();

    res.status(201).json({
      success: true,
      product,
    });
  } catch (error) {
    next(error);
  }
});

// Get Products
router.get("/products", async (req, res, next) => {
  try {
    const {
      category,
      minPrice,
      maxPrice,
      search,
      limit = 20,
      offset = 0,
      featured,
    } = req.query;

    let query = db
      .select({
        id: products.id,
        name: products.name,
        description: products.description,
        price: products.price,
        discountPrice: products.discountPrice,
        category: products.category,
        imageUrl: products.imageUrl,
        inStock: products.inStock,
        isFeatured: products.isFeatured,
        isSponsored: products.isSponsored,
        rating: products.rating,
        reviewCount: products.reviewCount,
        createdAt: products.createdAt,
        seller: {
          id: profiles.userId,
          name: profiles.fullName,
          avatar: profiles.avatar,
          isVerified: profiles.isVerified,
        },
      })
      .from(products)
      .innerJoin(profiles, eq(profiles.userId, products.sellerId))
      .where(eq(products.inStock, true))
      .orderBy(desc(products.createdAt))
      .limit(parseInt(limit as string))
      .offset(parseInt(offset as string));

    // Apply filters
    const conditions = [eq(products.inStock, true)];

    if (category) {
      conditions.push(eq(products.category, category as string));
    }

    if (featured === "true") {
      conditions.push(eq(products.isFeatured, true));
    }

    if (search) {
      conditions.push(
        or(
          like(products.name, `%${search}%`),
          like(products.description, `%${search}%`),
        ),
      );
    }

    if (minPrice) {
      conditions.push(gte(products.price, minPrice as string));
    }

    if (maxPrice) {
      conditions.push(lte(products.price, maxPrice as string));
    }

    if (conditions.length > 1) {
      query = query.where(and(...conditions));
    }

    const productList = await query;

    res.json({
      success: true,
      products: productList,
    });
  } catch (error) {
    next(error);
  }
});

// Create Order
router.post("/orders", authenticateToken, async (req, res, next) => {
  try {
    const userId = req.user!.userId;
    const { items, shippingAddress, paymentMethod } = req.body;

    // Validate items and calculate totals
    let subtotal = 0;
    const orderItems = [];

    for (const item of items) {
      const [product] = await db
        .select()
        .from(products)
        .where(eq(products.id, item.productId))
        .limit(1);

      if (!product || !product.inStock) {
        throw new AppError(`Product ${item.productId} not available`, 400);
      }

      const itemTotal = parseFloat(product.price) * item.quantity;
      subtotal += itemTotal;

      orderItems.push({
        productId: product.id,
        productName: product.name,
        price: product.price,
        quantity: item.quantity,
        total: itemTotal,
        sellerId: product.sellerId,
      });
    }

    const shippingCost = 10.0; // Fixed shipping cost
    const tax = subtotal * 0.08; // 8% tax
    const total = subtotal + shippingCost + tax;

    // Check buyer wallet balance
    const [buyerWallet] = await db
      .select()
      .from(wallets)
      .where(eq(wallets.userId, userId))
      .limit(1);

    if (!buyerWallet) {
      throw new AppError("Wallet not found", 404);
    }

    const walletBalance = parseFloat(
      paymentMethod === "USDT"
        ? buyerWallet.usdtBalance
        : paymentMethod === "soft_points"
          ? buyerWallet.softPointsBalance
          : buyerWallet.usdtBalance,
    );

    if (walletBalance < total) {
      throw new AppError("Insufficient wallet balance", 400);
    }

    // Create order and process payment
    await db.transaction(async (tx) => {
      // Create order
      const [order] = await tx
        .insert(marketplaceOrders)
        .values({
          buyerId: userId,
          sellerId: orderItems[0].sellerId, // Simplified for single seller
          orderNumber: `ORD-${Date.now()}`,
          items: orderItems,
          subtotal: subtotal.toString(),
          shippingCost: shippingCost.toString(),
          tax: tax.toString(),
          total: total.toString(),
          paymentMethod,
          paymentStatus: "paid",
          shippingAddress,
          status: "confirmed",
        })
        .returning();

      // Create escrow for the order
      const [escrow] = await tx
        .insert(escrowContracts)
        .values({
          payerId: userId,
          payeeId: orderItems[0].sellerId,
          type: "marketplace",
          referenceId: order.id,
          currency: paymentMethod === "soft_points" ? "SOFT_POINTS" : "USDT",
          amount: total.toString(),
          terms: `Marketplace order: ${order.orderNumber}`,
          autoReleaseHours: 168, // 7 days for marketplace
        })
        .returning();

      // Update order with escrow ID
      await tx
        .update(marketplaceOrders)
        .set({ escrowId: escrow.id })
        .where(eq(marketplaceOrders.id, order.id));

      // Deduct from buyer wallet
      const deductField =
        paymentMethod === "soft_points"
          ? { softPointsBalance: sql`soft_points_balance - ${total}` }
          : { usdtBalance: sql`usdt_balance - ${total}` };

      await tx
        .update(wallets)
        .set(deductField)
        .where(eq(wallets.userId, userId));

      // Record transaction
      await tx.insert(walletTransactions).values({
        walletId: buyerWallet.id,
        userId: userId,
        type: "marketplace_purchase",
        currency: paymentMethod === "soft_points" ? "SOFT_POINTS" : "USDT",
        amount: total.toString(),
        fee: "0",
        netAmount: total.toString(),
        referenceType: "marketplace_order",
        referenceId: order.id,
        relatedUserId: orderItems[0].sellerId,
        status: "confirmed",
        description: `Purchase: ${order.orderNumber}`,
      });

      // Create chat thread for order
      await tx.insert(chatThreads).values({
        type: "marketplace",
        referenceId: order.id,
        participants: [userId, orderItems[0].sellerId],
        createdBy: userId,
        title: `Order: ${order.orderNumber}`,
      });
    });

    res.status(201).json({
      success: true,
      message: "Order created successfully",
      orderId: `ORD-${Date.now()}`,
    });
  } catch (error) {
    next(error);
  }
});

// =============================================================================
// P2P CRYPTO TRADING
// =============================================================================

// Create P2P Trade Offer
router.post("/p2p/offers", authenticateToken, async (req, res, next) => {
  try {
    const userId = req.user!.userId;
    const offerData = req.body;

    // Validate KYC status
    const [profile] = await db
      .select()
      .from(profiles)
      .where(eq(profiles.userId, userId))
      .limit(1);

    if (!profile || !profile.isVerified) {
      throw new AppError("KYC verification required for trading", 403);
    }

    const [offer] = await db
      .insert(p2pOffers)
      .values({
        ...offerData,
        userId,
      })
      .returning();

    res.status(201).json({
      success: true,
      offer,
    });
  } catch (error) {
    next(error);
  }
});

// Start P2P Trade
router.post(
  "/p2p/trades/:offerId/start",
  authenticateToken,
  async (req, res, next) => {
    try {
      const userId = req.user!.userId;
      const { offerId } = req.params;
      const { amount, paymentMethod } = req.body;

      // Get offer
      const [offer] = await db
        .select()
        .from(p2pOffers)
        .where(and(eq(p2pOffers.id, offerId), eq(p2pOffers.status, "active")))
        .limit(1);

      if (!offer) {
        throw new AppError("Offer not found or inactive", 404);
      }

      if (offer.userId === userId) {
        throw new AppError("Cannot trade with your own offer", 400);
      }

      // Calculate trade details
      const tradeAmount = parseFloat(amount);
      const pricePerUnit = parseFloat(offer.pricePerUnit);
      const totalAmount = tradeAmount * pricePerUnit;

      // Determine buyer and seller
      const isBuyOffer = offer.offerType === "buy";
      const buyerId = isBuyOffer ? offer.userId : userId;
      const sellerId = isBuyOffer ? userId : offer.userId;

      // Create trade and escrow
      await db.transaction(async (tx) => {
        // Create trade
        const [trade] = await tx
          .insert(p2pTrades)
          .values({
            offerId,
            buyerId,
            sellerId,
            cryptoType: offer.cryptoType,
            amount: tradeAmount.toString(),
            pricePerUnit: pricePerUnit.toString(),
            totalAmount: totalAmount.toString(),
            paymentMethod,
            paymentWindow: 30, // 30 minutes
            paymentDeadline: new Date(Date.now() + 30 * 60 * 1000),
            releaseDeadline: new Date(Date.now() + 2 * 60 * 60 * 1000), // 2 hours
          })
          .returning();

        // Create escrow contract
        const [escrow] = await tx
          .insert(escrowContracts)
          .values({
            payerId: buyerId,
            payeeId: sellerId,
            type: "p2p_trade",
            referenceId: trade.id,
            currency: offer.cryptoType,
            amount: tradeAmount.toString(),
            terms: `P2P Trade: ${tradeAmount} ${offer.cryptoType} at ${pricePerUnit} each`,
            autoReleaseHours: 2,
          })
          .returning();

        // Update trade with escrow ID
        await tx
          .update(p2pTrades)
          .set({ escrowId: escrow.id })
          .where(eq(p2pTrades.id, trade.id));

        // Create chat thread for trade
        await tx.insert(chatThreads).values({
          type: "p2p_trade",
          referenceId: trade.id,
          participants: [buyerId, sellerId],
          createdBy: userId,
          title: `P2P Trade: ${tradeAmount} ${offer.cryptoType}`,
        });

        // Lock seller's crypto in escrow (simplified)
        if (!isBuyOffer) {
          // User is seller
          const [sellerWallet] = await tx
            .select()
            .from(wallets)
            .where(eq(wallets.userId, sellerId))
            .limit(1);

          if (sellerWallet) {
            const balanceField =
              offer.cryptoType === "USDT"
                ? "usdtBalance"
                : offer.cryptoType === "ETH"
                  ? "ethBalance"
                  : "btcBalance";

            const currentBalance = parseFloat(
              sellerWallet[balanceField as keyof typeof sellerWallet] as string,
            );

            if (currentBalance >= tradeAmount) {
              const updateField =
                offer.cryptoType === "USDT"
                  ? { usdtBalance: sql`usdt_balance - ${tradeAmount}` }
                  : offer.cryptoType === "ETH"
                    ? { ethBalance: sql`eth_balance - ${tradeAmount}` }
                    : { btcBalance: sql`btc_balance - ${tradeAmount}` };

              await tx
                .update(wallets)
                .set(updateField)
                .where(eq(wallets.userId, sellerId));

              // Mark escrow as funded
              await tx
                .update(escrowContracts)
                .set({
                  status: "funded",
                  fundedAt: new Date(),
                })
                .where(eq(escrowContracts.id, escrow.id));
            }
          }
        }
      });

      res.status(201).json({
        success: true,
        message: "Trade started successfully",
        tradeId: `trade_${Date.now()}`,
      });
    } catch (error) {
      next(error);
    }
  },
);

// Release P2P Trade Funds
router.post(
  "/p2p/trades/:tradeId/release",
  authenticateToken,
  async (req, res, next) => {
    try {
      const userId = req.user!.userId;
      const { tradeId } = req.params;

      // Get trade details
      const [trade] = await db
        .select()
        .from(p2pTrades)
        .where(eq(p2pTrades.id, tradeId))
        .limit(1);

      if (!trade) {
        throw new AppError("Trade not found", 404);
      }

      // Only seller can release funds
      if (trade.sellerId !== userId) {
        throw new AppError("Only seller can release funds", 403);
      }

      if (trade.status !== "payment_confirmed") {
        throw new AppError("Payment must be confirmed before release", 400);
      }

      // Get escrow
      const [escrow] = await db
        .select()
        .from(escrowContracts)
        .where(eq(escrowContracts.id, trade.escrowId!))
        .limit(1);

      if (!escrow || escrow.status !== "funded") {
        throw new AppError("Escrow not funded", 400);
      }

      await db.transaction(async (tx) => {
        // Release escrow
        await tx
          .update(escrowContracts)
          .set({
            status: "released",
            releasedAt: new Date(),
            releaseApprovedBy: userId,
          })
          .where(eq(escrowContracts.id, escrow.id));

        // Update trade status
        await tx
          .update(p2pTrades)
          .set({
            status: "completed",
            cryptoReleasedAt: new Date(),
            completedAt: new Date(),
          })
          .where(eq(p2pTrades.id, tradeId));

        // Transfer crypto to buyer
        const [buyerWallet] = await tx
          .select()
          .from(wallets)
          .where(eq(wallets.userId, trade.buyerId))
          .limit(1);

        if (buyerWallet) {
          const cryptoAmount = parseFloat(trade.amount);
          const feePercentage = 0.003; // 0.3% platform fee
          const feeAmount = cryptoAmount * feePercentage;
          const netAmount = cryptoAmount - feeAmount;

          const creditField =
            trade.cryptoType === "USDT"
              ? { usdtBalance: sql`usdt_balance + ${netAmount}` }
              : trade.cryptoType === "ETH"
                ? { ethBalance: sql`eth_balance + ${netAmount}` }
                : { btcBalance: sql`btc_balance + ${netAmount}` };

          await tx
            .update(wallets)
            .set(creditField)
            .where(eq(wallets.userId, trade.buyerId));

          // Record transaction
          await tx.insert(walletTransactions).values({
            walletId: buyerWallet.id,
            userId: trade.buyerId,
            type: "p2p_trade",
            currency: trade.cryptoType,
            amount: netAmount.toString(),
            fee: feeAmount.toString(),
            netAmount: netAmount.toString(),
            referenceType: "p2p_trade",
            referenceId: tradeId,
            relatedUserId: trade.sellerId,
            status: "confirmed",
            description: `P2P trade completed: ${netAmount} ${trade.cryptoType}`,
          });

          // Record platform earnings
          await tx.insert(platformEarnings).values({
            sourceType: "p2p_trade",
            referenceId: tradeId,
            userId: trade.sellerId,
            grossAmount: trade.amount,
            feeAmount: feeAmount.toString(),
            feePercentage: (feePercentage * 100).toString(),
            currency: trade.cryptoType,
            description: "P2P trading fee",
          });
        }
      });

      res.json({
        success: true,
        message: "Funds released successfully",
      });
    } catch (error) {
      next(error);
    }
  },
);

// =============================================================================
// BOOST & PREMIUM SYSTEM
// =============================================================================

// Request Boost
router.post("/boost/request", authenticateToken, async (req, res, next) => {
  try {
    const userId = req.user!.userId;
    const { type, referenceId, boostType, duration, paymentMethod } = req.body;

    // Calculate boost cost based on type and duration
    const baseCosts = {
      featured: 100,
      top_listing: 200,
      premium_placement: 300,
      highlight: 50,
    };

    const baseCost = baseCosts[boostType as keyof typeof baseCosts] || 100;
    const cost = baseCost * (duration / 24); // Cost per day

    // Check user balance
    const [wallet] = await db
      .select()
      .from(wallets)
      .where(eq(wallets.userId, userId))
      .limit(1);

    if (!wallet) {
      throw new AppError("Wallet not found", 404);
    }

    const balance = parseFloat(
      paymentMethod === "USDT" ? wallet.usdtBalance : wallet.softPointsBalance,
    );

    if (balance < cost) {
      throw new AppError("Insufficient balance", 400);
    }

    // Create boost request
    await db.transaction(async (tx) => {
      const [boost] = await tx
        .insert(boosts)
        .values({
          userId,
          type,
          referenceId,
          boostType,
          duration,
          cost: cost.toString(),
          currency: paymentMethod === "USDT" ? "USDT" : "SOFT_POINTS",
          paymentMethod,
          status: "pending", // Requires admin approval
        })
        .returning();

      // Deduct payment
      const deductField =
        paymentMethod === "USDT"
          ? { usdtBalance: sql`usdt_balance - ${cost}` }
          : { softPointsBalance: sql`soft_points_balance - ${cost}` };

      await tx
        .update(wallets)
        .set(deductField)
        .where(eq(wallets.userId, userId));

      // Record transaction
      await tx.insert(walletTransactions).values({
        walletId: wallet.id,
        userId: userId,
        type: "boost_payment",
        currency: paymentMethod === "USDT" ? "USDT" : "SOFT_POINTS",
        amount: cost.toString(),
        fee: "0",
        netAmount: cost.toString(),
        referenceType: "boost",
        referenceId: boost.id,
        status: "confirmed",
        description: `Boost payment: ${boostType} for ${duration} hours`,
      });
    });

    res.status(201).json({
      success: true,
      message: "Boost request submitted for approval",
    });
  } catch (error) {
    next(error);
  }
});

// Subscribe to Premium
router.post("/premium/subscribe", authenticateToken, async (req, res, next) => {
  try {
    const userId = req.user!.userId;
    const { tier, billingType } = req.body;

    // Define premium pricing
    const pricing = {
      silver: { monthly: 9.99, yearly: 99.99 },
      gold: { monthly: 19.99, yearly: 199.99 },
      pro: { monthly: 39.99, yearly: 399.99 },
    };

    const price =
      pricing[tier as keyof typeof pricing][
        billingType as keyof typeof pricing.silver
      ];
    const duration = billingType === "monthly" ? 30 : 365; // days

    // Check if user already has active subscription
    const existingSubscription = await db
      .select()
      .from(premiumSubscriptions)
      .where(
        and(
          eq(premiumSubscriptions.userId, userId),
          eq(premiumSubscriptions.status, "active"),
        ),
      )
      .limit(1);

    if (existingSubscription.length > 0) {
      throw new AppError("User already has an active subscription", 409);
    }

    // Check wallet balance
    const [wallet] = await db
      .select()
      .from(wallets)
      .where(eq(wallets.userId, userId))
      .limit(1);

    if (!wallet) {
      throw new AppError("Wallet not found", 404);
    }

    const balance = parseFloat(wallet.usdtBalance);
    if (balance < price) {
      throw new AppError("Insufficient USDT balance", 400);
    }

    // Create subscription
    await db.transaction(async (tx) => {
      const startDate = new Date();
      const endDate = new Date(
        startDate.getTime() + duration * 24 * 60 * 60 * 1000,
      );
      const nextBillingDate = new Date(endDate);

      const [subscription] = await tx
        .insert(premiumSubscriptions)
        .values({
          userId,
          tier,
          billingType,
          price: price.toString(),
          currency: "USDT",
          startDate,
          endDate,
          nextBillingDate,
          monthlyBoostCredits:
            tier === "silver" ? 5 : tier === "gold" ? 15 : 50,
          feeDiscountPercentage:
            tier === "silver" ? "5" : tier === "gold" ? "10" : "20",
          lastPaymentAt: startDate,
        })
        .returning();

      // Deduct payment
      await tx
        .update(wallets)
        .set({
          usdtBalance: sql`usdt_balance - ${price}`,
        })
        .where(eq(wallets.userId, userId));

      // Record transaction
      await tx.insert(walletTransactions).values({
        walletId: wallet.id,
        userId: userId,
        type: "premium_payment",
        currency: "USDT",
        amount: price.toString(),
        fee: "0",
        netAmount: price.toString(),
        referenceType: "premium",
        referenceId: subscription.id,
        status: "confirmed",
        description: `Premium subscription: ${tier} (${billingType})`,
      });

      // Update user profile with premium status
      await tx
        .update(profiles)
        .set({
          role: tier,
        })
        .where(eq(profiles.userId, userId));

      // Record platform earnings
      await tx.insert(platformEarnings).values({
        sourceType: "premium",
        referenceId: subscription.id,
        userId: userId,
        grossAmount: price.toString(),
        feeAmount: "0", // No platform fee for direct premium payments
        feePercentage: "0",
        currency: "USDT",
        description: `Premium subscription: ${tier}`,
      });
    });

    res.status(201).json({
      success: true,
      message: "Premium subscription activated",
    });
  } catch (error) {
    next(error);
  }
});

export default router;
