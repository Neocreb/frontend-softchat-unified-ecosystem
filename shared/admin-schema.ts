import {
  pgTable,
  text,
  uuid,
  boolean,
  timestamp,
  jsonb,
  integer,
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { users } from "./schema";

// Admin roles and permissions
export const adminRoles = pgTable("admin_roles", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull().unique(), // 'super_admin', 'admin', 'moderator', 'support'
  displayName: text("display_name").notNull(),
  description: text("description"),
  permissions: jsonb("permissions").$type<string[]>().notNull(), // Array of permission strings
  priority: integer("priority").default(0), // Higher number = higher priority
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Admin users table
export const adminUsers = pgTable("admin_users", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  roleId: uuid("role_id")
    .notNull()
    .references(() => adminRoles.id),
  employeeId: text("employee_id").unique(),
  department: text("department"),
  position: text("position"),
  isActive: boolean("is_active").default(true),
  lastLoginAt: timestamp("last_login_at"),
  loginAttempts: integer("login_attempts").default(0),
  lockedUntil: timestamp("locked_until"),
  settings: jsonb("settings").$type<Record<string, any>>(),
  createdBy: uuid("created_by").references(() => adminUsers.id),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Admin sessions for tracking
export const adminSessions = pgTable("admin_sessions", {
  id: uuid("id").primaryKey().defaultRandom(),
  adminId: uuid("admin_id")
    .notNull()
    .references(() => adminUsers.id, { onDelete: "cascade" }),
  sessionToken: text("session_token").notNull().unique(),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  isActive: boolean("is_active").default(true),
  expiresAt: timestamp("expires_at").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

// Admin activity logs
export const adminActivityLogs = pgTable("admin_activity_logs", {
  id: uuid("id").primaryKey().defaultRandom(),
  adminId: uuid("admin_id")
    .notNull()
    .references(() => adminUsers.id),
  action: text("action").notNull(), // 'login', 'logout', 'create_user', 'delete_post', etc.
  resource: text("resource"), // 'user', 'post', 'product', etc.
  resourceId: text("resource_id"), // ID of the affected resource
  details: jsonb("details").$type<Record<string, any>>(), // Action details
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  status: text("status").default("success"), // 'success', 'failed', 'unauthorized'
  createdAt: timestamp("created_at").defaultNow(),
});

// Admin notifications
export const adminNotifications = pgTable("admin_notifications", {
  id: uuid("id").primaryKey().defaultRandom(),
  adminId: uuid("admin_id").references(() => adminUsers.id), // null = broadcast to all
  title: text("title").notNull(),
  message: text("message").notNull(),
  type: text("type").notNull(), // 'info', 'warning', 'error', 'urgent'
  priority: integer("priority").default(1), // 1=low, 2=medium, 3=high, 4=urgent
  actionUrl: text("action_url"),
  metadata: jsonb("metadata").$type<Record<string, any>>(),
  readBy: jsonb("read_by").$type<string[]>().default([]), // Array of admin IDs who read it
  isActive: boolean("is_active").default(true),
  expiresAt: timestamp("expires_at"),
  createdBy: uuid("created_by").references(() => adminUsers.id),
  createdAt: timestamp("created_at").defaultNow(),
});

// System settings managed by admins
export const systemSettings = pgTable("system_settings", {
  id: uuid("id").primaryKey().defaultRandom(),
  category: text("category").notNull(), // 'general', 'security', 'email', 'payments', etc.
  key: text("key").notNull(),
  value: jsonb("value").$type<any>().notNull(),
  description: text("description"),
  isPublic: boolean("is_public").default(false), // Can regular users see this setting?
  isEditable: boolean("is_editable").default(true),
  requiredPermission: text("required_permission"), // Permission needed to edit
  lastModifiedBy: uuid("last_modified_by").references(() => adminUsers.id),
  modifiedAt: timestamp("modified_at").defaultNow(),
  createdAt: timestamp("created_at").defaultNow(),
});

// Admin API keys for external integrations
export const adminApiKeys = pgTable("admin_api_keys", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  description: text("description"),
  keyHash: text("key_hash").notNull(), // Hashed API key
  permissions: jsonb("permissions").$type<string[]>().notNull(),
  createdBy: uuid("created_by")
    .notNull()
    .references(() => adminUsers.id),
  lastUsedAt: timestamp("last_used_at"),
  expiresAt: timestamp("expires_at"),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

// Content moderation queue
export const moderationQueue = pgTable("moderation_queue", {
  id: uuid("id").primaryKey().defaultRandom(),
  resourceType: text("resource_type").notNull(), // 'post', 'comment', 'user', 'product'
  resourceId: text("resource_id").notNull(),
  reportedBy: uuid("reported_by").references(() => users.id),
  reason: text("reason").notNull(),
  description: text("description"),
  priority: integer("priority").default(1),
  status: text("status").default("pending"), // 'pending', 'reviewing', 'approved', 'rejected', 'escalated'
  assignedTo: uuid("assigned_to").references(() => adminUsers.id),
  reviewedBy: uuid("reviewed_by").references(() => adminUsers.id),
  reviewNotes: text("review_notes"),
  actions: jsonb("actions").$type<string[]>(), // Actions taken
  evidence: jsonb("evidence").$type<Record<string, any>>(), // Screenshots, URLs, etc.
  reviewedAt: timestamp("reviewed_at"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Export types
export type AdminRole = typeof adminRoles.$inferSelect;
export type AdminUser = typeof adminUsers.$inferSelect;
export type AdminSession = typeof adminSessions.$inferSelect;
export type AdminActivityLog = typeof adminActivityLogs.$inferSelect;
export type AdminNotification = typeof adminNotifications.$inferSelect;
export type SystemSetting = typeof systemSettings.$inferSelect;
export type AdminApiKey = typeof adminApiKeys.$inferSelect;
export type ModerationItem = typeof moderationQueue.$inferSelect;

export type InsertAdminRole = typeof adminRoles.$inferInsert;
export type InsertAdminUser = typeof adminUsers.$inferInsert;
export type InsertAdminSession = typeof adminSessions.$inferInsert;
export type InsertAdminActivityLog = typeof adminActivityLogs.$inferInsert;
export type InsertAdminNotification = typeof adminNotifications.$inferInsert;
export type InsertSystemSetting = typeof systemSettings.$inferInsert;
export type InsertAdminApiKey = typeof adminApiKeys.$inferInsert;
export type InsertModerationItem = typeof moderationQueue.$inferInsert;

// Permission constants
export const ADMIN_PERMISSIONS = {
  // User management
  VIEW_USERS: "view_users",
  CREATE_USERS: "create_users",
  EDIT_USERS: "edit_users",
  DELETE_USERS: "delete_users",
  BAN_USERS: "ban_users",
  VERIFY_USERS: "verify_users",

  // Content management
  VIEW_CONTENT: "view_content",
  MODERATE_CONTENT: "moderate_content",
  DELETE_CONTENT: "delete_content",
  FEATURE_CONTENT: "feature_content",

  // Admin management
  VIEW_ADMINS: "view_admins",
  CREATE_ADMINS: "create_admins",
  EDIT_ADMINS: "edit_admins",
  DELETE_ADMINS: "delete_admins",
  MANAGE_ROLES: "manage_roles",

  // System settings
  VIEW_SETTINGS: "view_settings",
  EDIT_SETTINGS: "edit_settings",

  // Analytics and reports
  VIEW_ANALYTICS: "view_analytics",
  EXPORT_DATA: "export_data",

  // Financial management
  VIEW_PAYMENTS: "view_payments",
  PROCESS_REFUNDS: "process_refunds",
  MANAGE_TRANSACTIONS: "manage_transactions",

  // Security
  VIEW_LOGS: "view_logs",
  MANAGE_SECURITY: "manage_security",

  // Support
  MANAGE_SUPPORT: "manage_support",
  VIEW_TICKETS: "view_tickets",

  // Marketplace
  MANAGE_PRODUCTS: "manage_products",
  MANAGE_ORDERS: "manage_orders",

  // Freelance platform
  MANAGE_JOBS: "manage_jobs",
  MANAGE_PROPOSALS: "manage_proposals",
  MANAGE_PROJECTS: "manage_projects",

  // System administration
  SYSTEM_MAINTENANCE: "system_maintenance",
  DATABASE_ACCESS: "database_access",
  SERVER_MANAGEMENT: "server_management",
} as const;

// Default role configurations
export const DEFAULT_ROLES = {
  super_admin: {
    name: "super_admin",
    displayName: "Super Administrator",
    description: "Full system access with all permissions",
    permissions: Object.values(ADMIN_PERMISSIONS),
    priority: 1000,
  },
  admin: {
    name: "admin",
    displayName: "Administrator",
    description: "Full platform management access",
    permissions: [
      ADMIN_PERMISSIONS.VIEW_USERS,
      ADMIN_PERMISSIONS.CREATE_USERS,
      ADMIN_PERMISSIONS.EDIT_USERS,
      ADMIN_PERMISSIONS.BAN_USERS,
      ADMIN_PERMISSIONS.VERIFY_USERS,
      ADMIN_PERMISSIONS.VIEW_CONTENT,
      ADMIN_PERMISSIONS.MODERATE_CONTENT,
      ADMIN_PERMISSIONS.DELETE_CONTENT,
      ADMIN_PERMISSIONS.FEATURE_CONTENT,
      ADMIN_PERMISSIONS.VIEW_ANALYTICS,
      ADMIN_PERMISSIONS.VIEW_PAYMENTS,
      ADMIN_PERMISSIONS.MANAGE_PRODUCTS,
      ADMIN_PERMISSIONS.MANAGE_ORDERS,
      ADMIN_PERMISSIONS.MANAGE_JOBS,
      ADMIN_PERMISSIONS.MANAGE_PROPOSALS,
      ADMIN_PERMISSIONS.VIEW_SETTINGS,
    ],
    priority: 800,
  },
  moderator: {
    name: "moderator",
    displayName: "Content Moderator",
    description: "Content moderation and user management",
    permissions: [
      ADMIN_PERMISSIONS.VIEW_USERS,
      ADMIN_PERMISSIONS.BAN_USERS,
      ADMIN_PERMISSIONS.VIEW_CONTENT,
      ADMIN_PERMISSIONS.MODERATE_CONTENT,
      ADMIN_PERMISSIONS.DELETE_CONTENT,
      ADMIN_PERMISSIONS.MANAGE_SUPPORT,
      ADMIN_PERMISSIONS.VIEW_TICKETS,
    ],
    priority: 600,
  },
  support: {
    name: "support",
    displayName: "Customer Support",
    description: "Customer support and basic user assistance",
    permissions: [
      ADMIN_PERMISSIONS.VIEW_USERS,
      ADMIN_PERMISSIONS.MANAGE_SUPPORT,
      ADMIN_PERMISSIONS.VIEW_TICKETS,
      ADMIN_PERMISSIONS.VIEW_CONTENT,
    ],
    priority: 400,
  },
  analyst: {
    name: "analyst",
    displayName: "Data Analyst",
    description: "Analytics and reporting access",
    permissions: [
      ADMIN_PERMISSIONS.VIEW_ANALYTICS,
      ADMIN_PERMISSIONS.EXPORT_DATA,
      ADMIN_PERMISSIONS.VIEW_USERS,
      ADMIN_PERMISSIONS.VIEW_CONTENT,
      ADMIN_PERMISSIONS.VIEW_PAYMENTS,
    ],
    priority: 300,
  },
} as const;

// Insert schemas
export const insertAdminRoleSchema = createInsertSchema(adminRoles);
export const insertAdminUserSchema = createInsertSchema(adminUsers);
export const insertAdminSessionSchema = createInsertSchema(adminSessions);
export const insertAdminActivityLogSchema =
  createInsertSchema(adminActivityLogs);
export const insertAdminNotificationSchema =
  createInsertSchema(adminNotifications);
export const insertSystemSettingSchema = createInsertSchema(systemSettings);
export const insertModerationItemSchema = createInsertSchema(moderationQueue);
