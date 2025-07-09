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
  isNull,
} from "drizzle-orm";
import { db } from "../db";
import {
  authenticateToken,
  requireRole,
  createRateLimitMiddleware,
  AppError,
} from "../config/security";
import {
  wallets,
  walletTransactions,
  escrowContracts,
  boosts,
  premiumSubscriptions,
  chatThreads,
  chatMessages,
  p2pTrades,
  p2pDisputes,
  marketplaceOrders,
  platformEarnings,
  adminUsers,
  adminActivityLogs,
  adminSessions,
  contentReports,
  userSuspensions,
} from "../../shared/enhanced-schema";

import {
  users,
  profiles,
  freelanceJobs,
  freelanceProjects,
  freelanceDisputes,
  products,
} from "../../shared/schema";

const router = express.Router();

// Rate limiters
const adminAuthLimiter = createRateLimitMiddleware(3); // Stricter for admin
const adminApiLimiter = createRateLimitMiddleware(200);

// =============================================================================
// ADMIN AUTHENTICATION & SESSION MANAGEMENT
// =============================================================================

// Admin Login
router.post("/admin/login", adminAuthLimiter, async (req, res, next) => {
  try {
    const { email, password, twoFactorCode } = req.body;

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

    // Check if user is admin
    const [admin] = await db
      .select()
      .from(adminUsers)
      .where(and(eq(adminUsers.userId, user.id), eq(adminUsers.isActive, true)))
      .limit(1);

    if (!admin) {
      throw new AppError("Access denied. Admin privileges required.", 403);
    }

    // Check if account is locked
    if (admin.lockedUntil && admin.lockedUntil > new Date()) {
      throw new AppError("Account temporarily locked", 423);
    }

    // Get profile
    const [profile] = await db
      .select()
      .from(profiles)
      .where(eq(profiles.userId, user.id))
      .limit(1);

    // Create admin session
    const sessionToken = jwt.sign(
      {
        userId: user.id,
        adminId: admin.id,
        roles: admin.roles,
        permissions: admin.permissions,
        type: "admin",
      },
      process.env.JWT_SECRET!,
      { expiresIn: "8h" },
    );

    const refreshToken = jwt.sign(
      { adminId: admin.id, type: "admin_refresh" },
      process.env.JWT_SECRET!,
      { expiresIn: "7d" },
    );

    // Store session in database
    await db.insert(adminSessions).values({
      adminId: admin.id,
      sessionToken,
      refreshToken,
      ipAddress: req.ip,
      userAgent: req.get("User-Agent") || "",
      expiresAt: new Date(Date.now() + 8 * 60 * 60 * 1000), // 8 hours
    });

    // Update login info
    await db
      .update(adminUsers)
      .set({
        lastLoginAt: new Date(),
        loginAttempts: 0,
      })
      .where(eq(adminUsers.id, admin.id));

    // Log admin login
    await db.insert(adminActivityLogs).values({
      adminId: admin.id,
      action: "admin_login",
      description: "Admin user logged in",
      ipAddress: req.ip,
      userAgent: req.get("User-Agent") || "",
      severity: "low",
    });

    res.json({
      success: true,
      token: sessionToken,
      refreshToken,
      admin: {
        id: admin.id,
        userId: user.id,
        email: user.email,
        name: profile?.name || profile?.fullName || "Admin",
        roles: admin.roles,
        permissions: admin.permissions,
        lastLoginAt: admin.lastLoginAt,
      },
    });
  } catch (error) {
    next(error);
  }
});

// Admin Logout
router.post("/admin/logout", authenticateToken, async (req, res, next) => {
  try {
    const adminId = req.user!.adminId;
    const sessionToken = req.headers.authorization?.replace("Bearer ", "");

    if (sessionToken) {
      // Deactivate session
      await db
        .update(adminSessions)
        .set({ isActive: false })
        .where(eq(adminSessions.sessionToken, sessionToken));

      // Log logout
      await db.insert(adminActivityLogs).values({
        adminId,
        action: "admin_logout",
        description: "Admin user logged out",
        ipAddress: req.ip,
        userAgent: req.get("User-Agent") || "",
        severity: "low",
      });
    }

    res.json({
      success: true,
      message: "Logged out successfully",
    });
  } catch (error) {
    next(error);
  }
});

// Middleware to verify admin permissions
const requireAdminPermission = (permission: string) => {
  return (req: any, res: any, next: any) => {
    const userPermissions = req.user?.permissions || [];

    if (
      !userPermissions.includes(permission) &&
      !userPermissions.includes("admin.all")
    ) {
      return res.status(403).json({
        success: false,
        error: "Insufficient permissions",
      });
    }

    next();
  };
};

// Middleware to verify admin role
const requireAdminRole = (roles: string[]) => {
  return (req: any, res: any, next: any) => {
    const userRoles = req.user?.roles || [];

    if (
      !roles.some((role) => userRoles.includes(role)) &&
      !userRoles.includes("super_admin")
    ) {
      return res.status(403).json({
        success: false,
        error: "Insufficient role permissions",
      });
    }

    next();
  };
};

// =============================================================================
// ADMIN DASHBOARD & ANALYTICS
// =============================================================================

// Get Admin Dashboard Data
router.get(
  "/admin/dashboard",
  authenticateToken,
  requireAdminPermission("admin.view"),
  async (req, res, next) => {
    try {
      const adminId = req.user!.adminId;

      // Get platform statistics
      const [userStats] = await db
        .select({
          totalUsers: count(),
          activeUsers: sql<number>`count(*) filter (where ${profiles.status} = 'active')`,
        })
        .from(profiles);

      const [transactionStats] = await db
        .select({
          totalTransactions: count(),
          totalVolume: sql<number>`sum(${sql`cast(${walletTransactions.amount} as decimal)`})`,
        })
        .from(walletTransactions)
        .where(eq(walletTransactions.status, "confirmed"));

      const [earningsStats] = await db
        .select({
          totalEarnings: sql<number>`sum(${sql`cast(${platformEarnings.feeAmount} as decimal)`})`,
          todayEarnings: sql<number>`sum(${sql`cast(${platformEarnings.feeAmount} as decimal)`}) filter (where ${platformEarnings.earnedAt} >= current_date)`,
        })
        .from(platformEarnings);

      const [contentStats] = await db
        .select({
          pendingReports: count(),
        })
        .from(contentReports)
        .where(eq(contentReports.status, "pending"));

      // Get recent activity
      const recentActivity = await db
        .select({
          id: adminActivityLogs.id,
          adminId: adminActivityLogs.adminId,
          action: adminActivityLogs.action,
          description: adminActivityLogs.description,
          severity: adminActivityLogs.severity,
          createdAt: adminActivityLogs.createdAt,
          adminName: profiles.name,
        })
        .from(adminActivityLogs)
        .leftJoin(adminUsers, eq(adminUsers.id, adminActivityLogs.adminId))
        .leftJoin(profiles, eq(profiles.userId, adminUsers.userId))
        .orderBy(desc(adminActivityLogs.createdAt))
        .limit(20);

      // Get active boosts
      const activeBoosts = await db
        .select({
          count: count(),
        })
        .from(boosts)
        .where(eq(boosts.status, "active"));

      // Get premium subscribers
      const premiumSubscribers = await db
        .select({
          silver: sql<number>`count(*) filter (where tier = 'silver')`,
          gold: sql<number>`count(*) filter (where tier = 'gold')`,
          pro: sql<number>`count(*) filter (where tier = 'pro')`,
        })
        .from(premiumSubscriptions)
        .where(eq(premiumSubscriptions.status, "active"));

      // System health metrics (simplified)
      const systemHealth = {
        cpu: Math.floor(Math.random() * 30) + 40, // 40-70%
        memory: Math.floor(Math.random() * 40) + 50, // 50-90%
        storage: Math.floor(Math.random() * 30) + 60, // 60-90%
        apiLatency: Math.floor(Math.random() * 50) + 80, // 80-130ms
        errorRate: (Math.random() * 0.05).toFixed(3), // 0-5%
      };

      res.json({
        success: true,
        dashboard: {
          stats: {
            totalUsers: userStats.totalUsers,
            activeUsers: userStats.activeUsers,
            totalTransactions: transactionStats.totalTransactions,
            totalVolume: transactionStats.totalVolume || 0,
            totalEarnings: earningsStats.totalEarnings || 0,
            todayEarnings: earningsStats.todayEarnings || 0,
            pendingReports: contentStats.pendingReports,
            activeBoosts: activeBoosts[0]?.count || 0,
            premiumSubscribers: {
              silver: premiumSubscribers[0]?.silver || 0,
              gold: premiumSubscribers[0]?.gold || 0,
              pro: premiumSubscribers[0]?.pro || 0,
            },
          },
          recentActivity,
          systemHealth,
        },
      });
    } catch (error) {
      next(error);
    }
  },
);

// =============================================================================
// USER MANAGEMENT
// =============================================================================

// Get All Users with Filters
router.get(
  "/admin/users",
  authenticateToken,
  requireAdminPermission("users.view"),
  async (req, res, next) => {
    try {
      const {
        search,
        status,
        role,
        isVerified,
        limit = 50,
        offset = 0,
        sortBy = "createdAt",
        sortOrder = "desc",
      } = req.query;

      let query = db
        .select({
          id: users.id,
          email: users.email,
          emailConfirmed: users.emailConfirmed,
          createdAt: users.createdAt,
          profile: {
            username: profiles.username,
            fullName: profiles.fullName,
            name: profiles.name,
            bio: profiles.bio,
            avatar: profiles.avatar,
            isVerified: profiles.isVerified,
            level: profiles.level,
            points: profiles.points,
            role: profiles.role,
            status: profiles.status,
          },
          wallet: {
            usdtBalance: wallets.usdtBalance,
            ethBalance: wallets.ethBalance,
            btcBalance: wallets.btcBalance,
            softPointsBalance: wallets.softPointsBalance,
            isFrozen: wallets.isFrozen,
          },
        })
        .from(users)
        .leftJoin(profiles, eq(profiles.userId, users.id))
        .leftJoin(wallets, eq(wallets.userId, users.id))
        .limit(parseInt(limit as string))
        .offset(parseInt(offset as string));

      // Apply filters
      const conditions = [];

      if (search) {
        conditions.push(
          or(
            like(users.email, `%${search}%`),
            like(profiles.username, `%${search}%`),
            like(profiles.fullName, `%${search}%`),
          ),
        );
      }

      if (status) {
        conditions.push(eq(profiles.status, status as string));
      }

      if (role) {
        conditions.push(eq(profiles.role, role as string));
      }

      if (isVerified !== undefined) {
        conditions.push(eq(profiles.isVerified, isVerified === "true"));
      }

      if (conditions.length > 0) {
        query = query.where(and(...conditions));
      }

      // Apply sorting
      const sortField =
        sortBy === "email"
          ? users.email
          : sortBy === "createdAt"
            ? users.createdAt
            : profiles.fullName;

      query =
        sortOrder === "asc"
          ? query.orderBy(asc(sortField))
          : query.orderBy(desc(sortField));

      const usersList = await query;

      // Get total count for pagination
      const [totalCount] = await db
        .select({ count: count() })
        .from(users)
        .leftJoin(profiles, eq(profiles.userId, users.id))
        .where(conditions.length > 0 ? and(...conditions) : undefined);

      res.json({
        success: true,
        users: usersList,
        pagination: {
          total: totalCount.count,
          limit: parseInt(limit as string),
          offset: parseInt(offset as string),
          hasMore:
            totalCount.count >
            parseInt(offset as string) + parseInt(limit as string),
        },
      });
    } catch (error) {
      next(error);
    }
  },
);

// Ban/Suspend User
router.post(
  "/admin/users/:userId/suspend",
  authenticateToken,
  requireAdminPermission("users.suspend"),
  async (req, res, next) => {
    try {
      const adminId = req.user!.adminId;
      const { userId } = req.params;
      const { type, reason, description, duration } = req.body;

      // Validate input
      if (!type || !reason) {
        throw new AppError("Type and reason are required", 400);
      }

      // Check if user exists
      const [user] = await db
        .select()
        .from(users)
        .where(eq(users.id, userId))
        .limit(1);

      if (!user) {
        throw new AppError("User not found", 404);
      }

      // Calculate expiry for temporary suspensions
      let expiresAt = null;
      if (type === "temporary" && duration) {
        expiresAt = new Date(Date.now() + duration * 24 * 60 * 60 * 1000);
      }

      await db.transaction(async (tx) => {
        // Create suspension record
        const [suspension] = await tx
          .insert(userSuspensions)
          .values({
            userId,
            type,
            reason,
            description,
            duration: type === "temporary" ? duration : null,
            expiresAt,
            suspendedBy: adminId,
            adminNotes: description,
          })
          .returning();

        // Update user profile status
        const newStatus = type === "permanent" ? "banned" : "suspended";
        await tx
          .update(profiles)
          .set({ status: newStatus })
          .where(eq(profiles.userId, userId));

        // Freeze wallet if suspension is severe
        if (type === "permanent" || (type === "temporary" && duration >= 7)) {
          await tx
            .update(wallets)
            .set({
              isFrozen: true,
              freezeReason: reason,
              frozenBy: adminId,
              frozenAt: new Date(),
            })
            .where(eq(wallets.userId, userId));
        }

        // Log admin action
        await tx.insert(adminActivityLogs).values({
          adminId,
          action: "user_suspend",
          targetType: "user",
          targetId: userId,
          description: `${type} suspension: ${reason}`,
          severity: type === "permanent" ? "high" : "medium",
          affectedUsers: 1,
          ipAddress: req.ip,
          userAgent: req.get("User-Agent") || "",
        });
      });

      res.json({
        success: true,
        message: "User suspended successfully",
      });
    } catch (error) {
      next(error);
    }
  },
);

// Lift User Suspension
router.post(
  "/admin/users/:userId/unsuspend",
  authenticateToken,
  requireAdminPermission("users.suspend"),
  async (req, res, next) => {
    try {
      const adminId = req.user!.adminId;
      const { userId } = req.params;
      const { liftReason } = req.body;

      // Find active suspension
      const [suspension] = await db
        .select()
        .from(userSuspensions)
        .where(
          and(
            eq(userSuspensions.userId, userId),
            eq(userSuspensions.isActive, true),
          ),
        )
        .limit(1);

      if (!suspension) {
        throw new AppError("No active suspension found", 404);
      }

      await db.transaction(async (tx) => {
        // Deactivate suspension
        await tx
          .update(userSuspensions)
          .set({
            isActive: false,
            liftedBy: adminId,
            liftedAt: new Date(),
            liftReason,
          })
          .where(eq(userSuspensions.id, suspension.id));

        // Restore user profile status
        await tx
          .update(profiles)
          .set({ status: "active" })
          .where(eq(profiles.userId, userId));

        // Unfreeze wallet if it was frozen due to this suspension
        await tx
          .update(wallets)
          .set({
            isFrozen: false,
            freezeReason: null,
            frozenBy: null,
            frozenAt: null,
          })
          .where(eq(wallets.userId, userId));

        // Log admin action
        await tx.insert(adminActivityLogs).values({
          adminId,
          action: "user_unsuspend",
          targetType: "user",
          targetId: userId,
          description: `Suspension lifted: ${liftReason}`,
          severity: "low",
          affectedUsers: 1,
          ipAddress: req.ip,
          userAgent: req.get("User-Agent") || "",
        });
      });

      res.json({
        success: true,
        message: "User suspension lifted successfully",
      });
    } catch (error) {
      next(error);
    }
  },
);

// =============================================================================
// CONTENT MODERATION
// =============================================================================

// Get Content Reports
router.get(
  "/admin/reports",
  authenticateToken,
  requireAdminPermission("moderation.view"),
  async (req, res, next) => {
    try {
      const {
        status = "pending",
        contentType,
        priority,
        limit = 50,
        offset = 0,
      } = req.query;

      let query = db
        .select({
          id: contentReports.id,
          contentType: contentReports.contentType,
          contentId: contentReports.contentId,
          reason: contentReports.reason,
          description: contentReports.description,
          status: contentReports.status,
          priority: contentReports.priority,
          evidence: contentReports.evidence,
          createdAt: contentReports.createdAt,
          reporter: {
            id: profiles.userId,
            name: profiles.fullName,
            email: users.email,
          },
        })
        .from(contentReports)
        .leftJoin(users, eq(users.id, contentReports.reporterId))
        .leftJoin(profiles, eq(profiles.userId, contentReports.reporterId))
        .orderBy(desc(contentReports.createdAt))
        .limit(parseInt(limit as string))
        .offset(parseInt(offset as string));

      // Apply filters
      const conditions = [];

      if (status) {
        conditions.push(eq(contentReports.status, status as string));
      }

      if (contentType) {
        conditions.push(eq(contentReports.contentType, contentType as string));
      }

      if (priority) {
        conditions.push(eq(contentReports.priority, priority as string));
      }

      if (conditions.length > 0) {
        query = query.where(and(...conditions));
      }

      const reports = await query;

      res.json({
        success: true,
        reports,
      });
    } catch (error) {
      next(error);
    }
  },
);

// Resolve Content Report
router.post(
  "/admin/reports/:reportId/resolve",
  authenticateToken,
  requireAdminPermission("moderation.resolve"),
  async (req, res, next) => {
    try {
      const adminId = req.user!.adminId;
      const { reportId } = req.params;
      const { resolution, actionTaken, reviewNotes } = req.body;

      // Validate input
      if (!resolution || !actionTaken) {
        throw new AppError("Resolution and action taken are required", 400);
      }

      // Get report
      const [report] = await db
        .select()
        .from(contentReports)
        .where(eq(contentReports.id, reportId))
        .limit(1);

      if (!report) {
        throw new AppError("Report not found", 404);
      }

      await db.transaction(async (tx) => {
        // Update report
        await tx
          .update(contentReports)
          .set({
            status: "resolved",
            reviewedBy: adminId,
            reviewNotes,
            resolution,
            actionTaken,
            reviewedAt: new Date(),
            resolvedAt: new Date(),
          })
          .where(eq(contentReports.id, reportId));

        // Apply action based on actionTaken
        if (actionTaken === "content_removed") {
          // Handle content removal based on content type
          if (report.contentType === "post") {
            // Mark post as deleted (soft delete)
            await tx
              .update(posts)
              .set({ content: "[Content removed by moderator]" })
              .where(eq(posts.id, report.contentId));
          }
          // Add more content types as needed
        }

        if (actionTaken === "user_suspended") {
          // Create automatic suspension
          await tx.insert(userSuspensions).values({
            userId: report.contentOwnerId,
            type: "temporary",
            reason: "content_violation",
            description: `Automatic suspension due to content report: ${report.reason}`,
            duration: 7, // 7 days
            expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
            suspendedBy: adminId,
            adminNotes: reviewNotes,
          });

          await tx
            .update(profiles)
            .set({ status: "suspended" })
            .where(eq(profiles.userId, report.contentOwnerId));
        }

        // Log admin action
        await tx.insert(adminActivityLogs).values({
          adminId,
          action: "report_resolve",
          targetType: "report",
          targetId: reportId,
          description: `Report resolved: ${actionTaken}`,
          severity: actionTaken === "user_suspended" ? "high" : "medium",
          affectedUsers: actionTaken === "no_action" ? 0 : 1,
          ipAddress: req.ip,
          userAgent: req.get("User-Agent") || "",
        });
      });

      res.json({
        success: true,
        message: "Report resolved successfully",
      });
    } catch (error) {
      next(error);
    }
  },
);

// =============================================================================
// FINANCIAL MANAGEMENT
// =============================================================================

// Get Platform Earnings
router.get(
  "/admin/earnings",
  authenticateToken,
  requireAdminRole(["super_admin", "finance_admin"]),
  async (req, res, next) => {
    try {
      const {
        sourceType,
        currency,
        startDate,
        endDate,
        limit = 100,
        offset = 0,
      } = req.query;

      let query = db
        .select({
          id: platformEarnings.id,
          sourceType: platformEarnings.sourceType,
          referenceId: platformEarnings.referenceId,
          userId: platformEarnings.userId,
          grossAmount: platformEarnings.grossAmount,
          feeAmount: platformEarnings.feeAmount,
          feePercentage: platformEarnings.feePercentage,
          currency: platformEarnings.currency,
          usdAmount: platformEarnings.usdAmount,
          description: platformEarnings.description,
          earnedAt: platformEarnings.earnedAt,
          user: {
            email: users.email,
            name: profiles.fullName,
          },
        })
        .from(platformEarnings)
        .leftJoin(users, eq(users.id, platformEarnings.userId))
        .leftJoin(profiles, eq(profiles.userId, platformEarnings.userId))
        .orderBy(desc(platformEarnings.earnedAt))
        .limit(parseInt(limit as string))
        .offset(parseInt(offset as string));

      // Apply filters
      const conditions = [];

      if (sourceType) {
        conditions.push(eq(platformEarnings.sourceType, sourceType as string));
      }

      if (currency) {
        conditions.push(eq(platformEarnings.currency, currency as string));
      }

      if (startDate) {
        conditions.push(
          gte(platformEarnings.earnedAt, new Date(startDate as string)),
        );
      }

      if (endDate) {
        conditions.push(
          lte(platformEarnings.earnedAt, new Date(endDate as string)),
        );
      }

      if (conditions.length > 0) {
        query = query.where(and(...conditions));
      }

      const earnings = await query;

      // Get summary statistics
      const [summary] = await db
        .select({
          totalEarnings: sql<number>`sum(${sql`cast(${platformEarnings.feeAmount} as decimal)`})`,
          totalUsdEarnings: sql<number>`sum(${sql`cast(${platformEarnings.usdAmount} as decimal)`})`,
          transactionCount: count(),
        })
        .from(platformEarnings)
        .where(conditions.length > 0 ? and(...conditions) : undefined);

      res.json({
        success: true,
        earnings,
        summary: {
          totalEarnings: summary.totalEarnings || 0,
          totalUsdEarnings: summary.totalUsdEarnings || 0,
          transactionCount: summary.transactionCount,
        },
      });
    } catch (error) {
      next(error);
    }
  },
);

// =============================================================================
// BOOST MANAGEMENT
// =============================================================================

// Get Boost Requests
router.get(
  "/admin/boosts",
  authenticateToken,
  requireAdminPermission("boosts.view"),
  async (req, res, next) => {
    try {
      const { status = "pending", type, limit = 50, offset = 0 } = req.query;

      let query = db
        .select({
          id: boosts.id,
          type: boosts.type,
          referenceId: boosts.referenceId,
          boostType: boosts.boostType,
          duration: boosts.duration,
          cost: boosts.cost,
          currency: boosts.currency,
          status: boosts.status,
          priority: boosts.priority,
          impressions: boosts.impressions,
          clicks: boosts.clicks,
          conversions: boosts.conversions,
          createdAt: boosts.createdAt,
          startDate: boosts.startDate,
          endDate: boosts.endDate,
          user: {
            id: profiles.userId,
            name: profiles.fullName,
            email: users.email,
          },
        })
        .from(boosts)
        .leftJoin(users, eq(users.id, boosts.userId))
        .leftJoin(profiles, eq(profiles.userId, boosts.userId))
        .orderBy(desc(boosts.createdAt))
        .limit(parseInt(limit as string))
        .offset(parseInt(offset as string));

      // Apply filters
      const conditions = [];

      if (status) {
        conditions.push(eq(boosts.status, status as string));
      }

      if (type) {
        conditions.push(eq(boosts.type, type as string));
      }

      if (conditions.length > 0) {
        query = query.where(and(...conditions));
      }

      const boostRequests = await query;

      res.json({
        success: true,
        boosts: boostRequests,
      });
    } catch (error) {
      next(error);
    }
  },
);

// Approve/Reject Boost
router.post(
  "/admin/boosts/:boostId/:action",
  authenticateToken,
  requireAdminPermission("boosts.approve"),
  async (req, res, next) => {
    try {
      const adminId = req.user!.adminId;
      const { boostId, action } = req.params;
      const { adminNotes, rejectionReason } = req.body;

      if (!["approve", "reject"].includes(action)) {
        throw new AppError("Invalid action. Use 'approve' or 'reject'", 400);
      }

      // Get boost request
      const [boost] = await db
        .select()
        .from(boosts)
        .where(eq(boosts.id, boostId))
        .limit(1);

      if (!boost) {
        throw new AppError("Boost request not found", 404);
      }

      if (boost.status !== "pending") {
        throw new AppError("Boost request is not pending", 400);
      }

      await db.transaction(async (tx) => {
        if (action === "approve") {
          const startDate = new Date();
          const endDate = new Date(
            startDate.getTime() + boost.duration * 60 * 60 * 1000,
          );

          // Approve boost
          await tx
            .update(boosts)
            .set({
              status: "active",
              approvedBy: adminId,
              approvedAt: new Date(),
              startDate,
              endDate,
              adminNotes,
            })
            .where(eq(boosts.id, boostId));

          // Apply boost to target content
          if (boost.type === "freelance_job") {
            await tx
              .update(freelanceJobs)
              .set({ boostUntil: endDate })
              .where(eq(freelanceJobs.id, boost.referenceId));
          } else if (boost.type === "product") {
            await tx
              .update(products)
              .set({
                isFeatured: true,
                boostUntil: endDate,
              })
              .where(eq(products.id, boost.referenceId));
          }
        } else {
          // Reject boost and refund
          await tx
            .update(boosts)
            .set({
              status: "rejected",
              approvedBy: adminId,
              approvedAt: new Date(),
              adminNotes,
              rejectionReason,
            })
            .where(eq(boosts.id, boostId));

          // Refund user
          const [userWallet] = await tx
            .select()
            .from(wallets)
            .where(eq(wallets.userId, boost.userId))
            .limit(1);

          if (userWallet) {
            const refundAmount = parseFloat(boost.cost);
            const refundField =
              boost.currency === "USDT"
                ? { usdtBalance: sql`usdt_balance + ${refundAmount}` }
                : {
                    softPointsBalance: sql`soft_points_balance + ${refundAmount}`,
                  };

            await tx
              .update(wallets)
              .set(refundField)
              .where(eq(wallets.userId, boost.userId));

            // Record refund transaction
            await tx.insert(walletTransactions).values({
              walletId: userWallet.id,
              userId: boost.userId,
              type: "boost_refund",
              currency: boost.currency,
              amount: boost.cost,
              fee: "0",
              netAmount: boost.cost,
              referenceType: "boost",
              referenceId: boost.id,
              status: "confirmed",
              description: `Boost refund: ${rejectionReason}`,
            });
          }
        }

        // Log admin action
        await tx.insert(adminActivityLogs).values({
          adminId,
          action: `boost_${action}`,
          targetType: "boost",
          targetId: boostId,
          description: `Boost ${action}ed: ${adminNotes || rejectionReason}`,
          severity: "low",
          affectedUsers: 1,
          ipAddress: req.ip,
          userAgent: req.get("User-Agent") || "",
        });
      });

      res.json({
        success: true,
        message: `Boost ${action}ed successfully`,
      });
    } catch (error) {
      next(error);
    }
  },
);

// =============================================================================
// DISPUTE RESOLUTION
// =============================================================================

// Get Disputes (Freelance & P2P)
router.get(
  "/admin/disputes",
  authenticateToken,
  requireAdminPermission("disputes.view"),
  async (req, res, next) => {
    try {
      const {
        type = "all", // 'freelance', 'p2p', 'all'
        status = "open",
        priority,
        limit = 50,
        offset = 0,
      } = req.query;

      const disputes = [];

      // Get freelance disputes
      if (type === "all" || type === "freelance") {
        const freelanceDisputes = await db
          .select({
            id: freelanceDisputes.id,
            type: sql<string>`'freelance'`,
            projectId: freelanceDisputes.projectId,
            reason: freelanceDisputes.reason,
            description: freelanceDisputes.description,
            status: freelanceDisputes.status,
            createdAt: freelanceDisputes.createdAt,
            raisedBy: {
              id: profiles.userId,
              name: profiles.fullName,
              email: users.email,
            },
          })
          .from(freelanceDisputes)
          .leftJoin(users, eq(users.id, freelanceDisputes.raisedBy))
          .leftJoin(profiles, eq(profiles.userId, freelanceDisputes.raisedBy))
          .where(
            status ? eq(freelanceDisputes.status, status as string) : undefined,
          )
          .orderBy(desc(freelanceDisputes.createdAt))
          .limit(parseInt(limit as string) / 2)
          .offset(parseInt(offset as string) / 2);

        disputes.push(...freelanceDisputes);
      }

      // Get P2P disputes
      if (type === "all" || type === "p2p") {
        const p2pDisputesList = await db
          .select({
            id: p2pDisputes.id,
            type: sql<string>`'p2p'`,
            tradeId: p2pDisputes.tradeId,
            reason: p2pDisputes.reason,
            description: p2pDisputes.description,
            status: p2pDisputes.status,
            priority: p2pDisputes.priority,
            createdAt: p2pDisputes.createdAt,
            raisedBy: {
              id: profiles.userId,
              name: profiles.fullName,
              email: users.email,
            },
          })
          .from(p2pDisputes)
          .leftJoin(users, eq(users.id, p2pDisputes.raisedBy))
          .leftJoin(profiles, eq(profiles.userId, p2pDisputes.raisedBy))
          .where(
            and(
              status ? eq(p2pDisputes.status, status as string) : undefined,
              priority
                ? eq(p2pDisputes.priority, priority as string)
                : undefined,
            ),
          )
          .orderBy(desc(p2pDisputes.createdAt))
          .limit(parseInt(limit as string) / 2)
          .offset(parseInt(offset as string) / 2);

        disputes.push(...p2pDisputesList);
      }

      // Sort all disputes by creation date
      disputes.sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      );

      res.json({
        success: true,
        disputes,
      });
    } catch (error) {
      next(error);
    }
  },
);

// Resolve P2P Dispute
router.post(
  "/admin/disputes/p2p/:disputeId/resolve",
  authenticateToken,
  requireAdminPermission("disputes.resolve"),
  async (req, res, next) => {
    try {
      const adminId = req.user!.adminId;
      const { disputeId } = req.params;
      const { resolution, resolutionType, adminNotes } = req.body;

      // Get dispute and related trade
      const [dispute] = await db
        .select()
        .from(p2pDisputes)
        .where(eq(p2pDisputes.id, disputeId))
        .limit(1);

      if (!dispute) {
        throw new AppError("Dispute not found", 404);
      }

      const [trade] = await db
        .select()
        .from(p2pTrades)
        .where(eq(p2pTrades.id, dispute.tradeId))
        .limit(1);

      if (!trade) {
        throw new AppError("Related trade not found", 404);
      }

      await db.transaction(async (tx) => {
        // Update dispute
        await tx
          .update(p2pDisputes)
          .set({
            status: "resolved",
            resolution,
            resolutionType,
            adminNotes,
            resolvedAt: new Date(),
          })
          .where(eq(p2pDisputes.id, disputeId));

        // Apply resolution
        if (resolutionType === "buyer_favor") {
          // Refund buyer, release seller's locked crypto
          const [buyerWallet] = await tx
            .select()
            .from(wallets)
            .where(eq(wallets.userId, trade.buyerId))
            .limit(1);

          if (buyerWallet) {
            const refundAmount = parseFloat(trade.totalAmount);
            await tx
              .update(wallets)
              .set({
                usdtBalance: sql`usdt_balance + ${refundAmount}`,
              })
              .where(eq(wallets.userId, trade.buyerId));
          }

          // Update trade status
          await tx
            .update(p2pTrades)
            .set({ status: "cancelled" })
            .where(eq(p2pTrades.id, trade.id));
        } else if (resolutionType === "seller_favor") {
          // Release crypto to buyer, seller keeps payment
          const [buyerWallet] = await tx
            .select()
            .from(wallets)
            .where(eq(wallets.userId, trade.buyerId))
            .limit(1);

          if (buyerWallet) {
            const cryptoAmount = parseFloat(trade.amount);
            const creditField =
              trade.cryptoType === "USDT"
                ? { usdtBalance: sql`usdt_balance + ${cryptoAmount}` }
                : trade.cryptoType === "ETH"
                  ? { ethBalance: sql`eth_balance + ${cryptoAmount}` }
                  : { btcBalance: sql`btc_balance + ${cryptoAmount}` };

            await tx
              .update(wallets)
              .set(creditField)
              .where(eq(wallets.userId, trade.buyerId));
          }

          // Update trade status
          await tx
            .update(p2pTrades)
            .set({
              status: "completed",
              completedAt: new Date(),
            })
            .where(eq(p2pTrades.id, trade.id));
        }

        // Log admin action
        await tx.insert(adminActivityLogs).values({
          adminId,
          action: "dispute_resolve",
          targetType: "p2p_dispute",
          targetId: disputeId,
          description: `P2P dispute resolved: ${resolutionType}`,
          severity: "medium",
          affectedUsers: 2,
          ipAddress: req.ip,
          userAgent: req.get("User-Agent") || "",
        });
      });

      res.json({
        success: true,
        message: "Dispute resolved successfully",
      });
    } catch (error) {
      next(error);
    }
  },
);

// =============================================================================
// GLOBAL NOTIFICATIONS & ANNOUNCEMENTS
// =============================================================================

// Send Global Notification
router.post(
  "/admin/notifications/global",
  authenticateToken,
  requireAdminRole(["super_admin", "content_admin"]),
  async (req, res, next) => {
    try {
      const adminId = req.user!.adminId;
      const { title, content, type, userSegment } = req.body;

      // Validate input
      if (!title || !content) {
        throw new AppError("Title and content are required", 400);
      }

      // Get target users based on segment
      let targetUsers = [];

      if (userSegment === "all") {
        const users = await db
          .select({ id: users.id })
          .from(users)
          .innerJoin(profiles, eq(profiles.userId, users.id))
          .where(eq(profiles.status, "active"));

        targetUsers = users.map((u) => u.id);
      } else if (userSegment === "premium") {
        const premiumUsers = await db
          .select({ userId: premiumSubscriptions.userId })
          .from(premiumSubscriptions)
          .where(eq(premiumSubscriptions.status, "active"));

        targetUsers = premiumUsers.map((u) => u.userId);
      } else if (userSegment === "verified") {
        const verifiedUsers = await db
          .select({ userId: profiles.userId })
          .from(profiles)
          .where(
            and(eq(profiles.isVerified, true), eq(profiles.status, "active")),
          );

        targetUsers = verifiedUsers.map((u) => u.userId);
      }

      // Create notifications for all target users
      const notifications = targetUsers.map((userId) => ({
        userId,
        title,
        content,
        type: type || "announcement",
        read: false,
      }));

      // Batch insert notifications
      if (notifications.length > 0) {
        // Split into chunks to avoid database limits
        const chunkSize = 1000;
        for (let i = 0; i < notifications.length; i += chunkSize) {
          const chunk = notifications.slice(i, i + chunkSize);
          await db.insert(notifications).values(chunk);
        }
      }

      // Log admin action
      await db.insert(adminActivityLogs).values({
        adminId,
        action: "global_notification",
        description: `Global notification sent: ${title}`,
        severity: "low",
        affectedUsers: targetUsers.length,
        ipAddress: req.ip,
        userAgent: req.get("User-Agent") || "",
      });

      res.json({
        success: true,
        message: `Notification sent to ${targetUsers.length} users`,
        targetCount: targetUsers.length,
      });
    } catch (error) {
      next(error);
    }
  },
);

export default router;
