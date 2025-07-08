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
  adminRoles,
  adminUsers,
  adminSessions,
  adminActivityLogs,
  adminNotifications,
  systemSettings,
  adminApiKeys,
  moderationQueue,
  type AdminRole,
  type AdminUser,
  type AdminSession,
  type AdminActivityLog,
  type AdminNotification,
  type SystemSetting,
  type ModerationItem,
  type InsertAdminRole,
  type InsertAdminUser,
  type InsertAdminSession,
  type InsertAdminActivityLog,
  type InsertAdminNotification,
  type InsertSystemSetting,
  type InsertModerationItem,
  ADMIN_PERMISSIONS,
  DEFAULT_ROLES,
} from "../../shared/admin-schema";
import { users, profiles } from "../../shared/schema";
import {
  hashPassword,
  comparePassword,
  generateToken,
} from "../config/security";
import { v4 as uuidv4 } from "uuid";

// Admin Role Operations
export const adminRoleOperations = {
  async create(roleData: InsertAdminRole): Promise<AdminRole> {
    const [role] = await db.insert(adminRoles).values(roleData).returning();
    return role;
  },

  async findById(id: string): Promise<AdminRole | undefined> {
    const [role] = await db
      .select()
      .from(adminRoles)
      .where(eq(adminRoles.id, id));
    return role;
  },

  async findByName(name: string): Promise<AdminRole | undefined> {
    const [role] = await db
      .select()
      .from(adminRoles)
      .where(eq(adminRoles.name, name));
    return role;
  },

  async list(includeInactive = false): Promise<AdminRole[]> {
    const query = db.select().from(adminRoles);

    if (!includeInactive) {
      query.where(eq(adminRoles.isActive, true));
    }

    return query.orderBy(desc(adminRoles.priority), asc(adminRoles.name));
  },

  async update(
    id: string,
    updates: Partial<AdminRole>,
  ): Promise<AdminRole | undefined> {
    const [role] = await db
      .update(adminRoles)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(adminRoles.id, id))
      .returning();
    return role;
  },

  async delete(id: string): Promise<boolean> {
    const result = await db.delete(adminRoles).where(eq(adminRoles.id, id));
    return result.rowCount > 0;
  },

  async hasPermission(roleId: string, permission: string): Promise<boolean> {
    const role = await this.findById(roleId);
    return role?.permissions?.includes(permission) || false;
  },

  async initializeDefaultRoles(): Promise<void> {
    for (const [key, roleData] of Object.entries(DEFAULT_ROLES)) {
      const existingRole = await this.findByName(roleData.name);
      if (!existingRole) {
        await this.create(roleData);
        console.log(`✅ Created default role: ${roleData.displayName}`);
      }
    }
  },
};

// Admin User Operations
export const adminUserOperations = {
  async create(userData: {
    email: string;
    password: string;
    name: string;
    roleId: string;
    employeeId?: string;
    department?: string;
    position?: string;
    createdBy?: string;
  }): Promise<{ user: AdminUser; profile: any }> {
    // Create regular user first
    const hashedPassword = await hashPassword(userData.password);
    const [user] = await db
      .insert(users)
      .values({
        email: userData.email,
        password: hashedPassword,
        emailConfirmed: true, // Admins are pre-confirmed
      })
      .returning();

    // Create profile
    const [profile] = await db
      .insert(profiles)
      .values({
        userId: user.id,
        name: userData.name,
        username: userData.email.split("@")[0],
        role: "admin",
      })
      .returning();

    // Create admin user
    const [adminUser] = await db
      .insert(adminUsers)
      .values({
        userId: user.id,
        roleId: userData.roleId,
        employeeId: userData.employeeId,
        department: userData.department,
        position: userData.position,
        createdBy: userData.createdBy,
      })
      .returning();

    // Log the creation
    if (userData.createdBy) {
      await adminActivityOperations.log({
        adminId: userData.createdBy,
        action: "create_admin",
        resource: "admin_user",
        resourceId: adminUser.id,
        details: { email: userData.email, role: userData.roleId },
      });
    }

    return { user: adminUser, profile };
  },

  async findById(
    id: string,
  ): Promise<(AdminUser & { role: AdminRole; profile: any }) | undefined> {
    const [result] = await db
      .select({
        admin: adminUsers,
        role: adminRoles,
        profile: profiles,
      })
      .from(adminUsers)
      .leftJoin(adminRoles, eq(adminUsers.roleId, adminRoles.id))
      .leftJoin(profiles, eq(adminUsers.userId, profiles.userId))
      .where(eq(adminUsers.id, id));

    if (!result) return undefined;

    return {
      ...result.admin,
      role: result.role!,
      profile: result.profile,
    };
  },

  async findByUserId(
    userId: string,
  ): Promise<(AdminUser & { role: AdminRole }) | undefined> {
    const [result] = await db
      .select({
        admin: adminUsers,
        role: adminRoles,
      })
      .from(adminUsers)
      .leftJoin(adminRoles, eq(adminUsers.roleId, adminRoles.id))
      .where(eq(adminUsers.userId, userId));

    if (!result) return undefined;

    return {
      ...result.admin,
      role: result.role!,
    };
  },

  async findByEmail(
    email: string,
  ): Promise<(AdminUser & { role: AdminRole; user: any }) | undefined> {
    const [result] = await db
      .select({
        admin: adminUsers,
        role: adminRoles,
        user: users,
      })
      .from(adminUsers)
      .leftJoin(adminRoles, eq(adminUsers.roleId, adminRoles.id))
      .leftJoin(users, eq(adminUsers.userId, users.id))
      .where(eq(users.email, email));

    if (!result) return undefined;

    return {
      ...result.admin,
      role: result.role!,
      user: result.user,
    };
  },

  async list(
    filters: {
      roleId?: string;
      department?: string;
      isActive?: boolean;
      search?: string;
      limit?: number;
      offset?: number;
    } = {},
  ): Promise<(AdminUser & { role: AdminRole; profile: any })[]> {
    const {
      roleId,
      department,
      isActive,
      search,
      limit = 50,
      offset = 0,
    } = filters;

    let query = db
      .select({
        admin: adminUsers,
        role: adminRoles,
        profile: profiles,
      })
      .from(adminUsers)
      .leftJoin(adminRoles, eq(adminUsers.roleId, adminRoles.id))
      .leftJoin(profiles, eq(adminUsers.userId, profiles.userId));

    const conditions = [];

    if (roleId) conditions.push(eq(adminUsers.roleId, roleId));
    if (department) conditions.push(eq(adminUsers.department, department));
    if (isActive !== undefined)
      conditions.push(eq(adminUsers.isActive, isActive));
    if (search) {
      conditions.push(
        or(
          like(profiles.name, `%${search}%`),
          like(adminUsers.employeeId, `%${search}%`),
          like(adminUsers.position, `%${search}%`),
        ),
      );
    }

    if (conditions.length > 0) {
      query = query.where(and(...conditions));
    }

    const results = await query
      .orderBy(desc(adminUsers.createdAt))
      .limit(limit)
      .offset(offset);

    return results.map((result) => ({
      ...result.admin,
      role: result.role!,
      profile: result.profile,
    }));
  },

  async update(
    id: string,
    updates: Partial<AdminUser>,
  ): Promise<AdminUser | undefined> {
    const [adminUser] = await db
      .update(adminUsers)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(adminUsers.id, id))
      .returning();
    return adminUser;
  },

  async updateLastLogin(id: string): Promise<void> {
    await db
      .update(adminUsers)
      .set({
        lastLoginAt: new Date(),
        loginAttempts: 0,
        lockedUntil: null,
      })
      .where(eq(adminUsers.id, id));
  },

  async incrementLoginAttempts(id: string): Promise<void> {
    const adminUser = await this.findById(id);
    if (!adminUser) return;

    const attempts = (adminUser.loginAttempts || 0) + 1;
    const updates: Partial<AdminUser> = { loginAttempts: attempts };

    // Lock account after 5 failed attempts for 30 minutes
    if (attempts >= 5) {
      updates.lockedUntil = new Date(Date.now() + 30 * 60 * 1000);
    }

    await this.update(id, updates);
  },

  async isLocked(id: string): Promise<boolean> {
    const adminUser = await this.findById(id);
    if (!adminUser?.lockedUntil) return false;

    return new Date() < adminUser.lockedUntil;
  },

  async hasPermission(id: string, permission: string): Promise<boolean> {
    const adminUser = await this.findById(id);
    if (!adminUser?.isActive) return false;

    return adminUser.role.permissions?.includes(permission) || false;
  },

  async delete(id: string): Promise<boolean> {
    const result = await db.delete(adminUsers).where(eq(adminUsers.id, id));
    return result.rowCount > 0;
  },
};

// Admin Session Operations
export const adminSessionOperations = {
  async create(sessionData: InsertAdminSession): Promise<AdminSession> {
    const [session] = await db
      .insert(adminSessions)
      .values(sessionData)
      .returning();
    return session;
  },

  async findByToken(sessionToken: string): Promise<AdminSession | undefined> {
    const [session] = await db
      .select()
      .from(adminSessions)
      .where(
        and(
          eq(adminSessions.sessionToken, sessionToken),
          eq(adminSessions.isActive, true),
          gte(adminSessions.expiresAt, new Date()),
        ),
      );
    return session;
  },

  async invalidate(sessionToken: string): Promise<boolean> {
    const result = await db
      .update(adminSessions)
      .set({ isActive: false })
      .where(eq(adminSessions.sessionToken, sessionToken));
    return result.rowCount > 0;
  },

  async invalidateAll(adminId: string): Promise<void> {
    await db
      .update(adminSessions)
      .set({ isActive: false })
      .where(eq(adminSessions.adminId, adminId));
  },

  async cleanup(): Promise<void> {
    await db
      .delete(adminSessions)
      .where(
        or(
          eq(adminSessions.isActive, false),
          lte(adminSessions.expiresAt, new Date()),
        ),
      );
  },

  async getActiveSessions(adminId: string): Promise<AdminSession[]> {
    return db
      .select()
      .from(adminSessions)
      .where(
        and(
          eq(adminSessions.adminId, adminId),
          eq(adminSessions.isActive, true),
          gte(adminSessions.expiresAt, new Date()),
        ),
      )
      .orderBy(desc(adminSessions.createdAt));
  },
};

// Admin Activity Log Operations
export const adminActivityOperations = {
  async log(logData: InsertAdminActivityLog): Promise<AdminActivityLog> {
    const [log] = await db
      .insert(adminActivityLogs)
      .values(logData)
      .returning();
    return log;
  },

  async getByAdmin(
    adminId: string,
    limit = 50,
    offset = 0,
  ): Promise<AdminActivityLog[]> {
    return db
      .select()
      .from(adminActivityLogs)
      .where(eq(adminActivityLogs.adminId, adminId))
      .orderBy(desc(adminActivityLogs.createdAt))
      .limit(limit)
      .offset(offset);
  },

  async getByAction(action: string, limit = 50): Promise<AdminActivityLog[]> {
    return db
      .select()
      .from(adminActivityLogs)
      .where(eq(adminActivityLogs.action, action))
      .orderBy(desc(adminActivityLogs.createdAt))
      .limit(limit);
  },

  async getRecent(hours = 24, limit = 100): Promise<AdminActivityLog[]> {
    const since = new Date(Date.now() - hours * 60 * 60 * 1000);

    return db
      .select()
      .from(adminActivityLogs)
      .where(gte(adminActivityLogs.createdAt, since))
      .orderBy(desc(adminActivityLogs.createdAt))
      .limit(limit);
  },

  async getActivityStats(
    adminId?: string,
    days = 30,
  ): Promise<Record<string, number>> {
    const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000);

    let query = db
      .select({
        action: adminActivityLogs.action,
        count: count(),
      })
      .from(adminActivityLogs)
      .where(gte(adminActivityLogs.createdAt, since))
      .groupBy(adminActivityLogs.action);

    if (adminId) {
      query = query.where(eq(adminActivityLogs.adminId, adminId));
    }

    const results = await query;

    return results.reduce(
      (acc, row) => {
        acc[row.action] = row.count;
        return acc;
      },
      {} as Record<string, number>,
    );
  },
};

// Admin Notification Operations
export const adminNotificationOperations = {
  async create(
    notificationData: InsertAdminNotification,
  ): Promise<AdminNotification> {
    const [notification] = await db
      .insert(adminNotifications)
      .values(notificationData)
      .returning();
    return notification;
  },

  async broadcast(data: {
    title: string;
    message: string;
    type: string;
    priority?: number;
    actionUrl?: string;
    createdBy?: string;
  }): Promise<AdminNotification> {
    return this.create({
      ...data,
      adminId: null, // Broadcast to all
    });
  },

  async getForAdmin(
    adminId: string,
    includeRead = false,
  ): Promise<AdminNotification[]> {
    const conditions = [
      eq(adminNotifications.isActive, true),
      or(
        eq(adminNotifications.adminId, adminId),
        isNull(adminNotifications.adminId), // Broadcast notifications
      ),
    ];

    if (!includeRead) {
      conditions.push(
        or(
          isNull(adminNotifications.readBy),
          sql`NOT (${adminNotifications.readBy} ? ${adminId})`,
        ),
      );
    }

    return db
      .select()
      .from(adminNotifications)
      .where(and(...conditions))
      .orderBy(
        desc(adminNotifications.priority),
        desc(adminNotifications.createdAt),
      );
  },

  async markAsRead(id: string, adminId: string): Promise<boolean> {
    const notification = await db
      .select()
      .from(adminNotifications)
      .where(eq(adminNotifications.id, id))
      .limit(1);

    if (!notification[0]) return false;

    const readBy = notification[0].readBy || [];
    if (!readBy.includes(adminId)) {
      readBy.push(adminId);

      await db
        .update(adminNotifications)
        .set({ readBy })
        .where(eq(adminNotifications.id, id));
    }

    return true;
  },

  async getUnreadCount(adminId: string): Promise<number> {
    const [result] = await db
      .select({ count: count() })
      .from(adminNotifications)
      .where(
        and(
          eq(adminNotifications.isActive, true),
          or(
            eq(adminNotifications.adminId, adminId),
            isNull(adminNotifications.adminId),
          ),
          or(
            isNull(adminNotifications.readBy),
            sql`NOT (${adminNotifications.readBy} ? ${adminId})`,
          ),
        ),
      );

    return result.count;
  },
};

// System Settings Operations
export const systemSettingsOperations = {
  async set(
    key: string,
    value: any,
    category = "general",
    adminId?: string,
  ): Promise<SystemSetting> {
    const existingSetting = await this.get(key, category);

    if (existingSetting) {
      const [setting] = await db
        .update(systemSettings)
        .set({
          value,
          lastModifiedBy: adminId,
          modifiedAt: new Date(),
        })
        .where(
          and(
            eq(systemSettings.key, key),
            eq(systemSettings.category, category),
          ),
        )
        .returning();
      return setting;
    } else {
      const [setting] = await db
        .insert(systemSettings)
        .values({
          key,
          value,
          category,
          lastModifiedBy: adminId,
        })
        .returning();
      return setting;
    }
  },

  async get(
    key: string,
    category = "general",
  ): Promise<SystemSetting | undefined> {
    const [setting] = await db
      .select()
      .from(systemSettings)
      .where(
        and(eq(systemSettings.key, key), eq(systemSettings.category, category)),
      );
    return setting;
  },

  async getValue(
    key: string,
    category = "general",
    defaultValue?: any,
  ): Promise<any> {
    const setting = await this.get(key, category);
    return setting?.value ?? defaultValue;
  },

  async getByCategory(category: string): Promise<SystemSetting[]> {
    return db
      .select()
      .from(systemSettings)
      .where(eq(systemSettings.category, category))
      .orderBy(asc(systemSettings.key));
  },

  async getPublicSettings(): Promise<SystemSetting[]> {
    return db
      .select()
      .from(systemSettings)
      .where(eq(systemSettings.isPublic, true))
      .orderBy(asc(systemSettings.category), asc(systemSettings.key));
  },

  async delete(key: string, category = "general"): Promise<boolean> {
    const result = await db
      .delete(systemSettings)
      .where(
        and(eq(systemSettings.key, key), eq(systemSettings.category, category)),
      );
    return result.rowCount > 0;
  },
};

// Moderation Operations
export const moderationOperations = {
  async create(itemData: InsertModerationItem): Promise<ModerationItem> {
    const [item] = await db
      .insert(moderationQueue)
      .values(itemData)
      .returning();
    return item;
  },

  async getQueue(
    filters: {
      status?: string;
      assignedTo?: string;
      priority?: number;
      resourceType?: string;
      limit?: number;
      offset?: number;
    } = {},
  ): Promise<ModerationItem[]> {
    const {
      status,
      assignedTo,
      priority,
      resourceType,
      limit = 50,
      offset = 0,
    } = filters;

    let query = db.select().from(moderationQueue);
    const conditions = [];

    if (status) conditions.push(eq(moderationQueue.status, status));
    if (assignedTo) conditions.push(eq(moderationQueue.assignedTo, assignedTo));
    if (priority) conditions.push(eq(moderationQueue.priority, priority));
    if (resourceType)
      conditions.push(eq(moderationQueue.resourceType, resourceType));

    if (conditions.length > 0) {
      query = query.where(and(...conditions));
    }

    return query
      .orderBy(desc(moderationQueue.priority), desc(moderationQueue.createdAt))
      .limit(limit)
      .offset(offset);
  },

  async assign(id: string, adminId: string): Promise<boolean> {
    const result = await db
      .update(moderationQueue)
      .set({
        assignedTo: adminId,
        status: "reviewing",
        updatedAt: new Date(),
      })
      .where(eq(moderationQueue.id, id));

    return result.rowCount > 0;
  },

  async resolve(
    id: string,
    adminId: string,
    decision: string,
    notes?: string,
    actions?: string[],
  ): Promise<boolean> {
    const result = await db
      .update(moderationQueue)
      .set({
        status: decision,
        reviewedBy: adminId,
        reviewNotes: notes,
        actions: actions || [],
        reviewedAt: new Date(),
        updatedAt: new Date(),
      })
      .where(eq(moderationQueue.id, id));

    return result.rowCount > 0;
  },

  async getStats(): Promise<Record<string, number>> {
    const [result] = await db
      .select({
        pending: sql<number>`count(*) filter (where status = 'pending')`,
        reviewing: sql<number>`count(*) filter (where status = 'reviewing')`,
        approved: sql<number>`count(*) filter (where status = 'approved')`,
        rejected: sql<number>`count(*) filter (where status = 'rejected')`,
        escalated: sql<number>`count(*) filter (where status = 'escalated')`,
      })
      .from(moderationQueue);

    return {
      pending: Number(result.pending),
      reviewing: Number(result.reviewing),
      approved: Number(result.approved),
      rejected: Number(result.rejected),
      escalated: Number(result.escalated),
    };
  },
};

// Initialize admin system
export const initializeAdminSystem = async (): Promise<void> => {
  console.log("🔧 Initializing admin system...");

  // Initialize default roles
  await adminRoleOperations.initializeDefaultRoles();

  // Clean up expired sessions
  await adminSessionOperations.cleanup();

  console.log("✅ Admin system initialized");
};
