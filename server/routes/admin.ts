import express from "express";
import {
  adminAuthService,
  authenticateAdmin,
  requireAdminPermission,
  requireAdminRole,
  logAdminActivity,
  type AuthenticatedRequest,
} from "../services/adminAuthService";
import {
  adminUserOperations,
  adminRoleOperations,
  adminActivityOperations,
  adminNotificationOperations,
  systemSettingsOperations,
  moderationOperations,
  initializeAdminSystem,
} from "../database/admin-operations";
import {
  userOperations,
  profileOperations,
  postOperations,
  productOperations,
} from "../database/operations";
import { ADMIN_PERMISSIONS } from "../../shared/admin-schema";
import {
  createRateLimitMiddleware,
  sanitizeInput,
  AppError,
} from "../config/security";

const router = express.Router();

// Rate limiting for admin routes
const adminAuthLimiter = createRateLimitMiddleware(10); // 10 attempts per window
const adminApiLimiter = createRateLimitMiddleware(300); // 300 requests per window

// Apply rate limiting to all admin routes
router.use(adminApiLimiter);

// ============================================================================
// ADMIN AUTHENTICATION ROUTES
// ============================================================================

// Admin login
router.post(
  "/auth/login",
  adminAuthLimiter,
  async (req: AuthenticatedRequest, res, next) => {
    try {
      const { email, password } = sanitizeInput(req.body);

      if (!email || !password) {
        throw new AppError("Email and password are required", 400);
      }

      const result = await adminAuthService.login(
        email,
        password,
        req.ip,
        req.get("User-Agent"),
      );

      if (!result.success) {
        return res.status(401).json({ error: result.error });
      }

      res.json({
        message: "Admin login successful",
        token: result.token,
        admin: {
          id: result.admin!.id,
          employeeId: result.admin!.employeeId,
          department: result.admin!.department,
          position: result.admin!.position,
          role: result.admin!.role,
          lastLoginAt: result.admin!.lastLoginAt,
        },
      });
    } catch (error) {
      next(error);
    }
  },
);

// Admin logout
router.post(
  "/auth/logout",
  authenticateAdmin,
  async (req: AuthenticatedRequest, res, next) => {
    try {
      const success = await adminAuthService.logout(
        req.adminSession!.token,
        req.admin!.id,
        req.ip,
        req.get("User-Agent"),
      );

      res.json({ message: "Logout successful", success });
    } catch (error) {
      next(error);
    }
  },
);

// Admin logout from all sessions
router.post(
  "/auth/logout-all",
  authenticateAdmin,
  async (req: AuthenticatedRequest, res, next) => {
    try {
      const success = await adminAuthService.logoutAll(
        req.admin!.id,
        req.ip,
        req.get("User-Agent"),
      );

      res.json({ message: "Logged out from all sessions", success });
    } catch (error) {
      next(error);
    }
  },
);

// Refresh admin token
router.post(
  "/auth/refresh",
  adminAuthLimiter,
  async (req: AuthenticatedRequest, res, next) => {
    try {
      const { token } = req.body;

      if (!token) {
        throw new AppError("Token is required", 400);
      }

      const result = await adminAuthService.refreshToken(
        token,
        req.ip,
        req.get("User-Agent"),
      );

      if (!result.success) {
        return res.status(401).json({ error: result.error });
      }

      res.json({ token: result.token });
    } catch (error) {
      next(error);
    }
  },
);

// Get current admin profile
router.get(
  "/auth/me",
  authenticateAdmin,
  async (req: AuthenticatedRequest, res, next) => {
    try {
      res.json({
        admin: req.admin,
        permissions: req.admin!.role.permissions,
      });
    } catch (error) {
      next(error);
    }
  },
);

// ============================================================================
// DASHBOARD & ANALYTICS
// ============================================================================

// Admin dashboard overview
router.get(
  "/dashboard",
  authenticateAdmin,
  requireAdminPermission([ADMIN_PERMISSIONS.VIEW_ANALYTICS]),
  async (req: AuthenticatedRequest, res, next) => {
    try {
      // Get various statistics
      const [
        userStats,
        contentStats,
        moderationStats,
        recentActivity,
        notifications,
      ] = await Promise.all([
        // User statistics (you'll implement these)
        getUserStats(),
        getContentStats(),
        moderationOperations.getStats(),
        adminActivityOperations.getRecent(24, 20),
        adminNotificationOperations.getForAdmin(req.admin!.id),
      ]);

      res.json({
        userStats,
        contentStats,
        moderationStats,
        recentActivity,
        notifications: notifications.slice(0, 5),
        unreadNotifications: await adminNotificationOperations.getUnreadCount(
          req.admin!.id,
        ),
      });
    } catch (error) {
      next(error);
    }
  },
);

// ============================================================================
// ADMIN USER MANAGEMENT
// ============================================================================

// Get all admin users
router.get(
  "/admins",
  authenticateAdmin,
  requireAdminPermission([ADMIN_PERMISSIONS.VIEW_ADMINS]),
  async (req: AuthenticatedRequest, res, next) => {
    try {
      const filters = {
        roleId: req.query.roleId as string,
        department: req.query.department as string,
        isActive:
          req.query.isActive === "true"
            ? true
            : req.query.isActive === "false"
              ? false
              : undefined,
        search: req.query.search as string,
        limit: parseInt(req.query.limit as string) || 50,
        offset: parseInt(req.query.offset as string) || 0,
      };

      const admins = await adminUserOperations.list(filters);

      res.json(admins);
    } catch (error) {
      next(error);
    }
  },
);

// Create new admin user
router.post(
  "/admins",
  authenticateAdmin,
  requireAdminPermission([ADMIN_PERMISSIONS.CREATE_ADMINS]),
  logAdminActivity("create_admin"),
  async (req: AuthenticatedRequest, res, next) => {
    try {
      const adminData = sanitizeInput(req.body);

      const { user, profile } = await adminUserOperations.create({
        ...adminData,
        createdBy: req.admin!.id,
      });

      res.status(201).json({ user, profile });
    } catch (error) {
      next(error);
    }
  },
);

// Update admin user
router.put(
  "/admins/:id",
  authenticateAdmin,
  requireAdminPermission([ADMIN_PERMISSIONS.EDIT_ADMINS]),
  logAdminActivity("update_admin"),
  async (req: AuthenticatedRequest, res, next) => {
    try {
      const { id } = req.params;
      const updates = sanitizeInput(req.body);

      const admin = await adminUserOperations.update(id, updates);

      if (!admin) {
        throw new AppError("Admin not found", 404);
      }

      res.json(admin);
    } catch (error) {
      next(error);
    }
  },
);

// Deactivate admin user
router.patch(
  "/admins/:id/deactivate",
  authenticateAdmin,
  requireAdminPermission([ADMIN_PERMISSIONS.DELETE_ADMINS]),
  logAdminActivity("deactivate_admin"),
  async (req: AuthenticatedRequest, res, next) => {
    try {
      const { id } = req.params;

      // Prevent self-deactivation
      if (id === req.admin!.id) {
        throw new AppError("Cannot deactivate your own account", 400);
      }

      const admin = await adminUserOperations.update(id, { isActive: false });

      if (!admin) {
        throw new AppError("Admin not found", 404);
      }

      res.json({ message: "Admin deactivated successfully" });
    } catch (error) {
      next(error);
    }
  },
);

// ============================================================================
// ROLE MANAGEMENT
// ============================================================================

// Get all roles
router.get(
  "/roles",
  authenticateAdmin,
  requireAdminPermission([ADMIN_PERMISSIONS.VIEW_ADMINS]),
  async (req: AuthenticatedRequest, res, next) => {
    try {
      const roles = await adminRoleOperations.list();
      res.json(roles);
    } catch (error) {
      next(error);
    }
  },
);

// Create new role
router.post(
  "/roles",
  authenticateAdmin,
  requireAdminPermission([ADMIN_PERMISSIONS.MANAGE_ROLES]),
  logAdminActivity("create_role"),
  async (req: AuthenticatedRequest, res, next) => {
    try {
      const roleData = sanitizeInput(req.body);
      const role = await adminRoleOperations.create(roleData);

      res.status(201).json(role);
    } catch (error) {
      next(error);
    }
  },
);

// Update role
router.put(
  "/roles/:id",
  authenticateAdmin,
  requireAdminPermission([ADMIN_PERMISSIONS.MANAGE_ROLES]),
  logAdminActivity("update_role"),
  async (req: AuthenticatedRequest, res, next) => {
    try {
      const { id } = req.params;
      const updates = sanitizeInput(req.body);

      const role = await adminRoleOperations.update(id, updates);

      if (!role) {
        throw new AppError("Role not found", 404);
      }

      res.json(role);
    } catch (error) {
      next(error);
    }
  },
);

// ============================================================================
// USER MANAGEMENT
// ============================================================================

// Get all platform users
router.get(
  "/users",
  authenticateAdmin,
  requireAdminPermission([ADMIN_PERMISSIONS.VIEW_USERS]),
  async (req: AuthenticatedRequest, res, next) => {
    try {
      const { search, limit = 50, offset = 0, status, verified } = req.query;

      // Implementation would depend on your user operations
      const users = await getUsersWithFilters({
        search: search as string,
        limit: parseInt(limit as string),
        offset: parseInt(offset as string),
        status: status as string,
        verified: verified === "true",
      });

      res.json(users);
    } catch (error) {
      next(error);
    }
  },
);

// Ban/unban user
router.patch(
  "/users/:id/ban",
  authenticateAdmin,
  requireAdminPermission([ADMIN_PERMISSIONS.BAN_USERS]),
  logAdminActivity("ban_user"),
  async (req: AuthenticatedRequest, res, next) => {
    try {
      const { id } = req.params;
      const { banned, reason } = req.body;

      // Implementation for banning user
      await banUser(id, banned, reason);

      res.json({
        message: `User ${banned ? "banned" : "unbanned"} successfully`,
      });
    } catch (error) {
      next(error);
    }
  },
);

// ============================================================================
// CONTENT MODERATION
// ============================================================================

// Get moderation queue
router.get(
  "/moderation",
  authenticateAdmin,
  requireAdminPermission([ADMIN_PERMISSIONS.MODERATE_CONTENT]),
  async (req: AuthenticatedRequest, res, next) => {
    try {
      const filters = {
        status: req.query.status as string,
        assignedTo: req.query.assignedTo as string,
        priority: req.query.priority
          ? parseInt(req.query.priority as string)
          : undefined,
        resourceType: req.query.resourceType as string,
        limit: parseInt(req.query.limit as string) || 50,
        offset: parseInt(req.query.offset as string) || 0,
      };

      const items = await moderationOperations.getQueue(filters);
      const stats = await moderationOperations.getStats();

      res.json({ items, stats });
    } catch (error) {
      next(error);
    }
  },
);

// Assign moderation item
router.patch(
  "/moderation/:id/assign",
  authenticateAdmin,
  requireAdminPermission([ADMIN_PERMISSIONS.MODERATE_CONTENT]),
  logAdminActivity("assign_moderation"),
  async (req: AuthenticatedRequest, res, next) => {
    try {
      const { id } = req.params;

      const success = await moderationOperations.assign(id, req.admin!.id);

      if (!success) {
        throw new AppError("Moderation item not found", 404);
      }

      res.json({ message: "Item assigned successfully" });
    } catch (error) {
      next(error);
    }
  },
);

// Resolve moderation item
router.patch(
  "/moderation/:id/resolve",
  authenticateAdmin,
  requireAdminPermission([ADMIN_PERMISSIONS.MODERATE_CONTENT]),
  logAdminActivity("resolve_moderation"),
  async (req: AuthenticatedRequest, res, next) => {
    try {
      const { id } = req.params;
      const { decision, notes, actions } = sanitizeInput(req.body);

      const success = await moderationOperations.resolve(
        id,
        req.admin!.id,
        decision,
        notes,
        actions,
      );

      if (!success) {
        throw new AppError("Moderation item not found", 404);
      }

      res.json({ message: "Item resolved successfully" });
    } catch (error) {
      next(error);
    }
  },
);

// ============================================================================
// SYSTEM SETTINGS
// ============================================================================

// Get system settings
router.get(
  "/settings",
  authenticateAdmin,
  requireAdminPermission([ADMIN_PERMISSIONS.VIEW_SETTINGS]),
  async (req: AuthenticatedRequest, res, next) => {
    try {
      const { category } = req.query;

      const settings = category
        ? await systemSettingsOperations.getByCategory(category as string)
        : await systemSettingsOperations.getByCategory("general");

      res.json(settings);
    } catch (error) {
      next(error);
    }
  },
);

// Update system setting
router.put(
  "/settings/:category/:key",
  authenticateAdmin,
  requireAdminPermission([ADMIN_PERMISSIONS.EDIT_SETTINGS]),
  logAdminActivity("update_setting"),
  async (req: AuthenticatedRequest, res, next) => {
    try {
      const { category, key } = req.params;
      const { value } = req.body;

      const setting = await systemSettingsOperations.set(
        key,
        value,
        category,
        req.admin!.id,
      );

      res.json(setting);
    } catch (error) {
      next(error);
    }
  },
);

// ============================================================================
// ACTIVITY LOGS
// ============================================================================

// Get activity logs
router.get(
  "/logs",
  authenticateAdmin,
  requireAdminPermission([ADMIN_PERMISSIONS.VIEW_LOGS]),
  async (req: AuthenticatedRequest, res, next) => {
    try {
      const { adminId, action, hours = 24, limit = 100 } = req.query;

      let logs;
      if (adminId) {
        logs = await adminActivityOperations.getByAdmin(
          adminId as string,
          parseInt(limit as string),
          0,
        );
      } else if (action) {
        logs = await adminActivityOperations.getByAction(
          action as string,
          parseInt(limit as string),
        );
      } else {
        logs = await adminActivityOperations.getRecent(
          parseInt(hours as string),
          parseInt(limit as string),
        );
      }

      res.json(logs);
    } catch (error) {
      next(error);
    }
  },
);

// ============================================================================
// NOTIFICATIONS
// ============================================================================

// Get admin notifications
router.get(
  "/notifications",
  authenticateAdmin,
  async (req: AuthenticatedRequest, res, next) => {
    try {
      const notifications = await adminNotificationOperations.getForAdmin(
        req.admin!.id,
      );
      const unreadCount = await adminNotificationOperations.getUnreadCount(
        req.admin!.id,
      );

      res.json({ notifications, unreadCount });
    } catch (error) {
      next(error);
    }
  },
);

// Mark notification as read
router.patch(
  "/notifications/:id/read",
  authenticateAdmin,
  async (req: AuthenticatedRequest, res, next) => {
    try {
      const { id } = req.params;

      const success = await adminNotificationOperations.markAsRead(
        id,
        req.admin!.id,
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

// Create broadcast notification
router.post(
  "/notifications/broadcast",
  authenticateAdmin,
  requireAdminPermission([ADMIN_PERMISSIONS.MANAGE_ADMINS]),
  logAdminActivity("broadcast_notification"),
  async (req: AuthenticatedRequest, res, next) => {
    try {
      const { title, message, type, priority, actionUrl } = sanitizeInput(
        req.body,
      );

      const notification = await adminNotificationOperations.broadcast({
        title,
        message,
        type,
        priority,
        actionUrl,
        createdBy: req.admin!.id,
      });

      res.status(201).json(notification);
    } catch (error) {
      next(error);
    }
  },
);

// ============================================================================
// HELPER FUNCTIONS (implement based on your existing operations)
// ============================================================================

async function getUserStats() {
  // Implement user statistics
  return {
    total: 1000,
    active: 800,
    verified: 600,
    newToday: 10,
  };
}

async function getContentStats() {
  // Implement content statistics
  return {
    posts: 5000,
    products: 1200,
    comments: 8000,
    reportsToday: 5,
  };
}

async function getUsersWithFilters(filters: any) {
  // Implement user filtering logic
  return [];
}

async function banUser(userId: string, banned: boolean, reason?: string) {
  // Implement user banning logic
}

// Initialize admin system when routes are loaded
initializeAdminSystem().catch(console.error);

export default router;
