
export interface AdminRoleData {
  name: string;
  displayName: string;
  description: string;
  permissions: string[];
  priority: number;
  id?: string;
  createdAt?: Date | null;
  updatedAt?: Date | null;
  isActive?: boolean;
}

export const DEFAULT_ADMIN_ROLES: AdminRoleData[] = [
  {
    name: "super_admin",
    displayName: "Super Administrator",
    description: "Full system access with all permissions",
    permissions: [
      "view_users", "create_users", "edit_users", "delete_users", "ban_users",
      "verify_users", "view_content", "moderate_content", "delete_content",
      "feature_content", "view_analytics", "export_data", "view_marketplace",
      "manage_marketplace", "approve_products", "manage_orders", "view_crypto",
      "manage_crypto", "process_withdrawals", "kyc_verification", "view_freelance",
      "manage_freelance", "approve_jobs", "manage_disputes", "view_settings",
      "manage_settings", "view_logs", "manage_backups", "server_management",
      "manage_admins", "assign_roles", "view_security", "manage_security"
    ],
    priority: 1000,
  },
  {
    name: "admin",
    displayName: "Administrator",
    description: "Full platform management access",
    permissions: [
      "view_users", "create_users", "edit_users", "ban_users", "verify_users",
      "view_content", "moderate_content", "delete_content", "feature_content",
      "view_analytics", "view_marketplace", "manage_marketplace", "approve_products",
      "view_crypto", "manage_crypto", "kyc_verification", "view_freelance",
      "manage_freelance", "approve_jobs", "view_settings"
    ],
    priority: 800,
  },
  {
    name: "content_moderator",
    displayName: "Content Moderator",
    description: "Content moderation and user management",
    permissions: [
      "view_users", "ban_users", "view_content", "moderate_content",
      "delete_content", "feature_content"
    ],
    priority: 600,
  },
  {
    name: "marketplace_manager",
    displayName: "Marketplace Manager",
    description: "Marketplace and product management",
    permissions: [
      "view_marketplace", "manage_marketplace", "approve_products",
      "manage_orders", "view_analytics"
    ],
    priority: 500,
  },
  {
    name: "crypto_manager",
    displayName: "Crypto Manager",
    description: "Cryptocurrency and trading management",
    permissions: [
      "view_crypto", "manage_crypto", "process_withdrawals", "kyc_verification"
    ],
    priority: 400,
  },
];
