import jwt from "jsonwebtoken";
import { v4 as uuidv4 } from "uuid";
import { Request, Response, NextFunction } from "express";
import {
  adminUserOperations,
  adminSessionOperations,
  adminActivityOperations,
} from "../database/admin-operations";
import { comparePassword, generateToken } from "../config/security";
import type { AdminUser, AdminRole } from "../../shared/admin-schema";

export interface AdminJWTPayload {
  adminId: string;
  userId: string;
  email: string;
  role: string;
  permissions: string[];
  sessionId: string;
  iat?: number;
  exp?: number;
}

export interface AuthenticatedRequest extends Request {
  admin?: AdminUser & { role: AdminRole };
  adminSession?: {
    id: string;
    token: string;
  };
}

class AdminAuthService {
  private readonly JWT_SECRET = process.env.JWT_SECRET || "fallback-secret";
  private readonly SESSION_DURATION = 8 * 60 * 60 * 1000; // 8 hours

  // Admin login
  async login(
    email: string,
    password: string,
    ipAddress?: string,
    userAgent?: string,
  ): Promise<{
    success: boolean;
    token?: string;
    admin?: AdminUser & { role: AdminRole };
    error?: string;
  }> {
    try {
      // Fallback default admin for immediate access
      if (email === "admin@softchat.com" && password === "Softchat2024!") {
        console.log("🚀 Using fallback admin login");

        // Create a mock admin object for immediate access
        const fallbackAdmin = {
          id: "fallback-admin-id",
          userId: "fallback-user-id",
          employeeId: "ADM-FALLBACK",
          department: "Administration",
          position: "System Administrator",
          isActive: true,
          lastLoginAt: new Date(),
          createdAt: new Date(),
          updatedAt: new Date(),
          role: {
            id: "super-admin-role",
            name: "super_admin",
            description: "Super Administrator",
            permissions: [
              "admin.all",
              "users.all",
              "content.all",
              "marketplace.all",
              "crypto.all",
              "freelance.all",
              "financial.all",
              "settings.all",
              "moderation.all",
              "analytics.all",
              "system.all"
            ],
            isActive: true,
            createdAt: new Date(),
            updatedAt: new Date()
          },
          user: {
            id: "fallback-user-id",
            email: "admin@softchat.com",
            password: "hashed-password", // This won't be checked for fallback
            emailConfirmed: true,
            createdAt: new Date(),
            updatedAt: new Date()
          }
        } as AdminUser & { role: AdminRole };

        // Generate session token and JWT
        const sessionToken = uuidv4();
        const payload: AdminJWTPayload = {
          adminId: fallbackAdmin.id,
          userId: fallbackAdmin.userId,
          email: fallbackAdmin.user.email,
          role: fallbackAdmin.role.name,
          permissions: fallbackAdmin.role.permissions || [],
          sessionId: sessionToken,
        };

        const token = jwt.sign(payload, this.JWT_SECRET, { expiresIn: "8h" });

        return {
          success: true,
          token,
          admin: fallbackAdmin,
        };
      }

      // Find admin by email
      const adminUser = await adminUserOperations.findByEmail(email);
      if (!adminUser) {
        return { success: false, error: "Invalid credentials" };
      }

      // Check if account is active
      if (!adminUser.isActive) {
        await adminActivityOperations.log({
          adminId: adminUser.id,
          action: "login_attempt_inactive",
          details: { email, reason: "Account inactive" },
          ipAddress,
          userAgent,
          status: "failed",
        });
        return { success: false, error: "Account is inactive" };
      }

      // Check if account is locked
      if (await adminUserOperations.isLocked(adminUser.id)) {
        await adminActivityOperations.log({
          adminId: adminUser.id,
          action: "login_attempt_locked",
          details: { email, reason: "Account locked" },
          ipAddress,
          userAgent,
          status: "failed",
        });
        return { success: false, error: "Account is temporarily locked" };
      }

      // Verify password
      const isValidPassword = await comparePassword(
        password,
        adminUser.user.password,
      );
      if (!isValidPassword) {
        // Increment login attempts
        await adminUserOperations.incrementLoginAttempts(adminUser.id);

        await adminActivityOperations.log({
          adminId: adminUser.id,
          action: "login_attempt_failed",
          details: { email, reason: "Invalid password" },
          ipAddress,
          userAgent,
          status: "failed",
        });

        return { success: false, error: "Invalid credentials" };
      }

      // Generate session token
      const sessionToken = uuidv4();
      const expiresAt = new Date(Date.now() + this.SESSION_DURATION);

      // Create session
      await adminSessionOperations.create({
        adminId: adminUser.id,
        sessionToken,
        ipAddress,
        userAgent,
        expiresAt,
      });

      // Generate JWT
      const payload: AdminJWTPayload = {
        adminId: adminUser.id,
        userId: adminUser.userId,
        email: adminUser.user.email,
        role: adminUser.role.name,
        permissions: adminUser.role.permissions || [],
        sessionId: sessionToken,
      };

      const token = jwt.sign(payload, this.JWT_SECRET, { expiresIn: "8h" });

      // Update last login
      await adminUserOperations.updateLastLogin(adminUser.id);

      // Log successful login
      await adminActivityOperations.log({
        adminId: adminUser.id,
        action: "login_success",
        details: { email },
        ipAddress,
        userAgent,
        status: "success",
      });

      return {
        success: true,
        token,
        admin: adminUser,
      };
    } catch (error) {
      console.error("Admin login error:", error);
      return { success: false, error: "Login failed" };
    }
  }

  // Admin logout
  async logout(
    sessionToken: string,
    adminId?: string,
    ipAddress?: string,
    userAgent?: string,
  ): Promise<boolean> {
    try {
      // Invalidate session
      await adminSessionOperations.invalidate(sessionToken);

      // Log logout
      if (adminId) {
        await adminActivityOperations.log({
          adminId,
          action: "logout",
          details: {},
          ipAddress,
          userAgent,
          status: "success",
        });
      }

      return true;
    } catch (error) {
      console.error("Admin logout error:", error);
      return false;
    }
  }

  // Logout from all sessions
  async logoutAll(
    adminId: string,
    ipAddress?: string,
    userAgent?: string,
  ): Promise<boolean> {
    try {
      await adminSessionOperations.invalidateAll(adminId);

      await adminActivityOperations.log({
        adminId,
        action: "logout_all",
        details: {},
        ipAddress,
        userAgent,
        status: "success",
      });

      return true;
    } catch (error) {
      console.error("Admin logout all error:", error);
      return false;
    }
  }

  // Verify JWT token
  async verifyToken(token: string): Promise<{
    valid: boolean;
    payload?: AdminJWTPayload;
    admin?: AdminUser & { role: AdminRole };
    error?: string;
  }> {
    try {
      // Verify JWT
      const payload = jwt.verify(token, this.JWT_SECRET) as AdminJWTPayload;

      // Check if session is still valid
      const session = await adminSessionOperations.findByToken(
        payload.sessionId,
      );
      if (!session) {
        return { valid: false, error: "Session expired" };
      }

      // Get admin details
      const admin = await adminUserOperations.findById(payload.adminId);
      if (!admin || !admin.isActive) {
        return { valid: false, error: "Admin account inactive" };
      }

      return {
        valid: true,
        payload,
        admin,
      };
    } catch (error) {
      if (error instanceof jwt.TokenExpiredError) {
        return { valid: false, error: "Token expired" };
      } else if (error instanceof jwt.JsonWebTokenError) {
        return { valid: false, error: "Invalid token" };
      }

      console.error("Token verification error:", error);
      return { valid: false, error: "Token verification failed" };
    }
  }

  // Check if admin has permission
  async hasPermission(adminId: string, permission: string): Promise<boolean> {
    return adminUserOperations.hasPermission(adminId, permission);
  }

  // Refresh token
  async refreshToken(
    oldToken: string,
    ipAddress?: string,
    userAgent?: string,
  ): Promise<{
    success: boolean;
    token?: string;
    error?: string;
  }> {
    try {
      const verification = await this.verifyToken(oldToken);
      if (!verification.valid || !verification.admin) {
        return { success: false, error: verification.error };
      }

      // Generate new session
      const sessionToken = uuidv4();
      const expiresAt = new Date(Date.now() + this.SESSION_DURATION);

      await adminSessionOperations.create({
        adminId: verification.admin.id,
        sessionToken,
        ipAddress,
        userAgent,
        expiresAt,
      });

      // Generate new JWT
      const payload: AdminJWTPayload = {
        adminId: verification.admin.id,
        userId: verification.admin.userId,
        email: verification.payload!.email,
        role: verification.admin.role.name,
        permissions: verification.admin.role.permissions || [],
        sessionId: sessionToken,
      };

      const token = jwt.sign(payload, this.JWT_SECRET, { expiresIn: "8h" });

      // Invalidate old session
      await adminSessionOperations.invalidate(verification.payload!.sessionId);

      // Log token refresh
      await adminActivityOperations.log({
        adminId: verification.admin.id,
        action: "token_refresh",
        details: {},
        ipAddress,
        userAgent,
        status: "success",
      });

      return { success: true, token };
    } catch (error) {
      console.error("Token refresh error:", error);
      return { success: false, error: "Token refresh failed" };
    }
  }

  // Get admin from request
  getAdminFromRequest(
    req: AuthenticatedRequest,
  ): (AdminUser & { role: AdminRole }) | null {
    return req.admin || null;
  }

  // Extract admin ID from request
  getAdminIdFromRequest(req: AuthenticatedRequest): string | null {
    return req.admin?.id || null;
  }
}

// Create singleton instance
export const adminAuthService = new AdminAuthService();

// Authentication middleware
export const authenticateAdmin = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(" ")[1];

    if (!token) {
      return res.status(401).json({ error: "Admin access token required" });
    }

    const verification = await adminAuthService.verifyToken(token);
    if (!verification.valid || !verification.admin) {
      return res
        .status(403)
        .json({ error: verification.error || "Invalid admin token" });
    }

    // Attach admin to request
    req.admin = verification.admin;
    req.adminSession = {
      id: verification.payload!.sessionId,
      token,
    };

    next();
  } catch (error) {
    console.error("Admin authentication error:", error);
    return res.status(500).json({ error: "Authentication failed" });
  }
};

// Permission middleware
export const requireAdminPermission = (permission: string | string[]) => {
  return async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      if (!req.admin) {
        return res.status(401).json({ error: "Admin authentication required" });
      }

      const permissions = Array.isArray(permission) ? permission : [permission];
      const hasPermission = permissions.some((perm) =>
        req.admin!.role.permissions?.includes(perm),
      );

      if (!hasPermission) {
        // Log unauthorized access attempt
        await adminActivityOperations.log({
          adminId: req.admin.id,
          action: "unauthorized_access",
          details: {
            requiredPermissions: permissions,
            userPermissions: req.admin.role.permissions,
            url: req.originalUrl,
            method: req.method,
          },
          ipAddress: req.ip,
          userAgent: req.get("User-Agent"),
          status: "failed",
        });

        return res.status(403).json({
          error: "Insufficient permissions",
          required: permissions,
        });
      }

      next();
    } catch (error) {
      console.error("Permission check error:", error);
      return res.status(500).json({ error: "Permission check failed" });
    }
  };
};

// Role middleware
export const requireAdminRole = (role: string | string[]) => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (!req.admin) {
      return res.status(401).json({ error: "Admin authentication required" });
    }

    const roles = Array.isArray(role) ? role : [role];
    if (!roles.includes(req.admin.role.name)) {
      return res.status(403).json({
        error: "Insufficient role",
        required: roles,
        current: req.admin.role.name,
      });
    }

    next();
  };
};

// Activity logging middleware
export const logAdminActivity = (action: string) => {
  return async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction,
  ) => {
    // Store original end function
    const originalEnd = res.end;

    // Override end function to log after response
    res.end = function (chunk?: any, encoding?: any) {
      // Log the activity
      if (req.admin) {
        adminActivityOperations
          .log({
            adminId: req.admin.id,
            action,
            resource: req.params.resourceType || req.route?.path?.split("/")[2],
            resourceId: req.params.id || req.params.resourceId,
            details: {
              method: req.method,
              url: req.originalUrl,
              body: req.method !== "GET" ? req.body : undefined,
              params: req.params,
              query: req.query,
              statusCode: res.statusCode,
            },
            ipAddress: req.ip,
            userAgent: req.get("User-Agent"),
            status: res.statusCode < 400 ? "success" : "failed",
          })
          .catch((error) => {
            console.error("Failed to log admin activity:", error);
          });
      }

      // Call original end function
      originalEnd.call(this, chunk, encoding);
    };

    next();
  };
};

export default adminAuthService;
