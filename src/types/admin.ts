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
