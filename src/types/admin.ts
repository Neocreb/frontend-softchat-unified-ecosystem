// Type definitions for admin-related components

export type User = {
  id: string;
  name: string;
  email: string;
  role: string;
  status: string;
};

export type AdminRole =
  | "super_admin"
  | "content_admin"
  | "user_admin"
  | "marketplace_admin"
  | "crypto_admin"
  | "freelance_admin"
  | "support_admin";

export type AdminPermission = {
  id: string;
  userId: string;
  role: AdminRole;
  permissions: string[];
  isActive: boolean;
  grantedBy: string;
  expiresAt?: string;
  createdAt: string;
  updatedAt: string;
};

export type AdminUser = {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  roles: AdminRole[];
  permissions: string[];
  lastLogin?: string;
  isActive: boolean;
  createdAt: string;
};

export type AdminStats = {
  totalUsers: number;
  activeUsers: number;
  totalPosts: number;
  totalProducts: number;
  totalJobs: number;
  totalTrades: number;
  pendingModeration: number;
  revenueToday: number;
  revenueMonth: number;
};

export type ContentModerationItem = {
  id: string;
  contentType: "post" | "comment" | "product" | "job";
  contentId: string;
  reportedBy?: string;
  reason: string;
  description?: string;
  priority: "low" | "medium" | "high" | "urgent";
  status: "pending" | "reviewed" | "approved" | "rejected" | "removed";
  assignedTo?: string;
  reviewedBy?: string;
  reviewNotes?: string;
  autoDetected: boolean;
  confidence?: number;
  reviewedAt?: string;
  createdAt: string;
  updatedAt: string;
};

export type AdminActivityLog = {
  id: string;
  adminId: string;
  adminName: string;
  action: string;
  targetType: string;
  targetId?: string;
  details?: any;
  ipAddress?: string;
  userAgent?: string;
  createdAt: string;
};

export type PlatformSetting = {
  id: string;
  category: "general" | "marketplace" | "crypto" | "freelance" | "content";
  key: string;
  value: any;
  description?: string;
  isPublic: boolean;
  lastModifiedBy: string;
  createdAt: string;
  updatedAt: string;
};

export type AdminDashboardData = {
  stats: AdminStats;
  recentActivity: AdminActivityLog[];
  pendingModeration: ContentModerationItem[];
  activeAdmins: AdminUser[];
  systemHealth: {
    cpu: number;
    memory: number;
    storage: number;
    apiLatency: number;
    errorRate: number;
  };
};

export type AdminLoginCredentials = {
  email: string;
  password: string;
  mfaCode?: string;
};

export type AdminSession = {
  id: string;
  adminId: string;
  sessionToken: string;
  ipAddress?: string;
  userAgent?: string;
  lastActivity: string;
  expiresAt: string;
  isActive: boolean;
  createdAt: string;
};

export const ADMIN_PERMISSIONS = {
  // User Management
  VIEW_USERS: "view_users",
  CREATE_USERS: "create_users",
  EDIT_USERS: "edit_users",
  DELETE_USERS: "delete_users",
  BAN_USERS: "ban_users",
  VERIFY_USERS: "verify_users",

  // Content Management
  VIEW_CONTENT: "view_content",
  MODERATE_CONTENT: "moderate_content",
  DELETE_CONTENT: "delete_content",
  FEATURE_CONTENT: "feature_content",

  // Analytics
  VIEW_ANALYTICS: "view_analytics",
  EXPORT_DATA: "export_data",

  // Marketplace
  VIEW_MARKETPLACE: "view_marketplace",
  MANAGE_MARKETPLACE: "manage_marketplace",
  APPROVE_PRODUCTS: "approve_products",
  MANAGE_ORDERS: "manage_orders",

  // Crypto
  VIEW_CRYPTO: "view_crypto",
  MANAGE_CRYPTO: "manage_crypto",
  PROCESS_WITHDRAWALS: "process_withdrawals",
  KYC_VERIFICATION: "kyc_verification",

  // Freelance
  VIEW_FREELANCE: "view_freelance",
  MANAGE_FREELANCE: "manage_freelance",
  APPROVE_JOBS: "approve_jobs",
  MANAGE_DISPUTES: "manage_disputes",

  // Settings
  VIEW_SETTINGS: "view_settings",
  MANAGE_SETTINGS: "manage_settings",

  // System
  VIEW_LOGS: "view_logs",
  MANAGE_BACKUPS: "manage_backups",
  SERVER_MANAGEMENT: "server_management",

  // Admin Management
  MANAGE_ADMINS: "manage_admins",
  ASSIGN_ROLES: "assign_roles",

  // Security
  VIEW_SECURITY: "view_security",
  MANAGE_SECURITY: "manage_security",
} as const;
