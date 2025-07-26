import {
  pgTable,
  text,
  serial,
  integer,
  boolean,
  timestamp,
  uuid,
  decimal,
  jsonb,
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Users table - for auth.users equivalent
export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  emailConfirmed: boolean("email_confirmed").default(false),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Profiles table - user profile information
export const profiles = pgTable("profiles", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  username: text("username").unique(),
  fullName: text("full_name"),
  name: text("name"),
  bio: text("bio"),
  avatar: text("avatar"),
  avatarUrl: text("avatar_url"),
  isVerified: boolean("is_verified").default(false),
  level: text("level").default("bronze"),
  points: integer("points").default(0),
  role: text("role").default("user"),
  status: text("status").default("active"),
  bankAccountName: text("bank_account_name"),
  bankAccountNumber: text("bank_account_number"),
  bankName: text("bank_name"),
  preferences: jsonb("preferences"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Posts table
export const posts = pgTable("posts", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  content: text("content").notNull(),
  imageUrl: text("image_url"),
  videoUrl: text("video_url"),
  type: text("type").default("post"),
  filter: text("filter"),
  tags: text("tags").array(),
  softpoints: integer("softpoints"),

  // Duet metadata
  isDuet: boolean("is_duet").default(false),
  duetOfPostId: uuid("duet_of_post_id").references(() => posts.id),
  originalCreatorId: uuid("original_creator_id").references(() => users.id),
  originalCreatorUsername: text("original_creator_username"),
  duetStyle: text("duet_style"), // 'side-by-side', 'react-respond', 'picture-in-picture'
  audioSource: text("audio_source").default("both"), // 'original', 'both', 'voiceover'
  duetVideoUrl: text("duet_video_url"), // The merged duet video
  originalVideoUrl: text("original_video_url"), // Original video URL for reference

  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Post likes table
export const postLikes = pgTable("post_likes", {
  id: uuid("id").primaryKey().defaultRandom(),
  postId: uuid("post_id")
    .notNull()
    .references(() => posts.id, { onDelete: "cascade" }),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  createdAt: timestamp("created_at").defaultNow(),
});

// Post comments table
export const postComments = pgTable("post_comments", {
  id: uuid("id").primaryKey().defaultRandom(),
  postId: uuid("post_id")
    .notNull()
    .references(() => posts.id, { onDelete: "cascade" }),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  content: text("content").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Products table
export const products = pgTable("products", {
  id: uuid("id").primaryKey().defaultRandom(),
  sellerId: uuid("seller_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  description: text("description").notNull(),
  price: decimal("price", { precision: 10, scale: 2 }).notNull(),
  discountPrice: decimal("discount_price", { precision: 10, scale: 2 }),
  category: text("category"),
  imageUrl: text("image_url"),
  inStock: boolean("in_stock").default(true),
  isFeatured: boolean("is_featured").default(false),
  isSponsored: boolean("is_sponsored").default(false),
  rating: decimal("rating", { precision: 3, scale: 2 }),
  reviewCount: integer("review_count").default(0),
  boostUntil: timestamp("boost_until"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Followers table
export const followers = pgTable("followers", {
  id: uuid("id").primaryKey().defaultRandom(),
  followerId: uuid("follower_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  followingId: uuid("following_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  createdAt: timestamp("created_at").defaultNow(),
});

// Chat conversations table
export const chatConversations = pgTable("chat_conversations", {
  id: uuid("id").primaryKey().defaultRandom(),
  participants: text("participants").array().notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Chat messages table
export const chatMessages = pgTable("chat_messages", {
  id: uuid("id").primaryKey().defaultRandom(),
  conversationId: uuid("conversation_id")
    .notNull()
    .references(() => chatConversations.id, { onDelete: "cascade" }),
  senderId: uuid("sender_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  content: text("content").notNull(),
  read: boolean("read").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

// Notifications table
export const notifications = pgTable("notifications", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  title: text("title").notNull(),
  content: text("content").notNull(),
  type: text("type").notNull(),
  read: boolean("read").default(false),
  relatedUserId: uuid("related_user_id").references(() => users.id),
  relatedPostId: uuid("related_post_id").references(() => posts.id),
  createdAt: timestamp("created_at").defaultNow(),
});

// P2P offers table
export const p2pOffers = pgTable("p2p_offers", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").references(() => users.id, { onDelete: "cascade" }),
  offerType: text("offer_type").notNull(),
  cryptoType: text("crypto_type").notNull(),
  amount: decimal("amount", { precision: 15, scale: 8 }).notNull(),
  pricePerUnit: decimal("price_per_unit", {
    precision: 10,
    scale: 2,
  }).notNull(),
  paymentMethod: text("payment_method").notNull(),
  status: text("status").default("active"),
  notes: text("notes"),
  expiresAt: timestamp("expires_at").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

// Trades table
export const trades = pgTable("trades", {
  id: uuid("id").primaryKey().defaultRandom(),
  offerId: uuid("offer_id").references(() => p2pOffers.id),
  buyerId: uuid("buyer_id")
    .notNull()
    .references(() => users.id),
  sellerId: uuid("seller_id")
    .notNull()
    .references(() => users.id),
  amount: decimal("amount", { precision: 15, scale: 8 }).notNull(),
  pricePerUnit: decimal("price_per_unit", {
    precision: 10,
    scale: 2,
  }).notNull(),
  totalAmount: decimal("total_amount", { precision: 15, scale: 2 }).notNull(),
  paymentMethod: text("payment_method").notNull(),
  status: text("status").default("pending"),
  escrowId: uuid("escrow_id"),
  disputeId: uuid("dispute_id"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
  completedAt: timestamp("completed_at"),
  cancelledAt: timestamp("cancelled_at"),
});

// Freelance job postings table
export const freelanceJobs = pgTable("freelance_jobs", {
  id: uuid("id").primaryKey().defaultRandom(),
  clientId: uuid("client_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  title: text("title").notNull(),
  description: text("description").notNull(),
  category: text("category").notNull(),
  subcategory: text("subcategory"),
  budgetType: text("budget_type").notNull(), // 'fixed' or 'hourly'
  budgetMin: decimal("budget_min", { precision: 10, scale: 2 }),
  budgetMax: decimal("budget_max", { precision: 10, scale: 2 }),
  budgetAmount: decimal("budget_amount", { precision: 10, scale: 2 }),
  deadline: timestamp("deadline"),
  duration: text("duration"), // e.g., "1-3 months"
  experienceLevel: text("experience_level").notNull(), // 'entry', 'intermediate', 'expert'
  skills: text("skills").array().notNull(),
  status: text("status").default("open"), // 'open', 'in-progress', 'completed', 'cancelled'
  visibility: text("visibility").default("public"), // 'public', 'invite-only'
  attachments: text("attachments").array(),
  applicationsCount: integer("applications_count").default(0),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Freelance proposals table
export const freelanceProposals = pgTable("freelance_proposals", {
  id: uuid("id").primaryKey().defaultRandom(),
  jobId: uuid("job_id")
    .notNull()
    .references(() => freelanceJobs.id, { onDelete: "cascade" }),
  freelancerId: uuid("freelancer_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  coverLetter: text("cover_letter").notNull(),
  proposedRateType: text("proposed_rate_type").notNull(), // 'fixed' or 'hourly'
  proposedAmount: decimal("proposed_amount", {
    precision: 10,
    scale: 2,
  }).notNull(),
  deliveryTime: text("delivery_time").notNull(),
  milestones: jsonb("milestones"), // Array of milestone objects
  attachments: text("attachments").array(),
  status: text("status").default("pending"), // 'pending', 'accepted', 'rejected', 'withdrawn'
  submittedAt: timestamp("submitted_at").defaultNow(),
  respondedAt: timestamp("responded_at"),
});

// Freelance projects table (active contracts)
export const freelanceProjects = pgTable("freelance_projects", {
  id: uuid("id").primaryKey().defaultRandom(),
  jobId: uuid("job_id")
    .notNull()
    .references(() => freelanceJobs.id),
  proposalId: uuid("proposal_id")
    .notNull()
    .references(() => freelanceProposals.id),
  freelancerId: uuid("freelancer_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  clientId: uuid("client_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  status: text("status").default("active"), // 'active', 'completed', 'cancelled', 'disputed'
  agreedBudget: decimal("agreed_budget", { precision: 10, scale: 2 }).notNull(),
  paidAmount: decimal("paid_amount", { precision: 10, scale: 2 }).default("0"),
  remainingAmount: decimal("remaining_amount", {
    precision: 10,
    scale: 2,
  }).notNull(),
  escrowId: uuid("escrow_id"), // Reference to escrow contract
  startDate: timestamp("start_date").defaultNow(),
  endDate: timestamp("end_date"),
  deadline: timestamp("deadline"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Project milestones table
export const projectMilestones = pgTable("project_milestones", {
  id: uuid("id").primaryKey().defaultRandom(),
  projectId: uuid("project_id")
    .notNull()
    .references(() => freelanceProjects.id, { onDelete: "cascade" }),
  title: text("title").notNull(),
  description: text("description").notNull(),
  amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
  dueDate: timestamp("due_date").notNull(),
  status: text("status").default("pending"), // 'pending', 'in-progress', 'submitted', 'approved', 'paid'
  deliverables: text("deliverables").array(),
  submittedAt: timestamp("submitted_at"),
  approvedAt: timestamp("approved_at"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Project files table
export const projectFiles = pgTable("project_files", {
  id: uuid("id").primaryKey().defaultRandom(),
  projectId: uuid("project_id")
    .notNull()
    .references(() => freelanceProjects.id, { onDelete: "cascade" }),
  milestoneId: uuid("milestone_id").references(() => projectMilestones.id),
  uploadedBy: uuid("uploaded_by")
    .notNull()
    .references(() => users.id),
  name: text("name").notNull(),
  url: text("url").notNull(),
  size: integer("size").notNull(),
  type: text("type").notNull(),
  version: integer("version").default(1),
  createdAt: timestamp("created_at").defaultNow(),
});

// Freelance reviews table
export const freelanceReviews = pgTable("freelance_reviews", {
  id: uuid("id").primaryKey().defaultRandom(),
  projectId: uuid("project_id")
    .notNull()
    .references(() => freelanceProjects.id, { onDelete: "cascade" }),
  reviewerId: uuid("reviewer_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  revieweeId: uuid("reviewee_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  overallRating: integer("overall_rating").notNull(), // 1-5 stars
  communicationRating: integer("communication_rating").notNull(),
  qualityRating: integer("quality_rating").notNull(),
  timelineRating: integer("timeline_rating").notNull(),
  comment: text("comment"),
  isClientReview: boolean("is_client_review").notNull(), // true if client reviewing freelancer
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Escrow table for secure payments
export const freelanceEscrow = pgTable("freelance_escrow", {
  id: uuid("id").primaryKey().defaultRandom(),
  projectId: uuid("project_id")
    .notNull()
    .references(() => freelanceProjects.id, { onDelete: "cascade" }),
  clientId: uuid("client_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  freelancerId: uuid("freelancer_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  amount: decimal("amount", { precision: 15, scale: 8 }).notNull(),
  cryptoType: text("crypto_type").notNull(), // 'USDT', 'BTC', 'ETH'
  contractAddress: text("contract_address"), // Smart contract address
  transactionHash: text("transaction_hash"), // Blockchain transaction hash
  status: text("status").default("pending"), // 'pending', 'locked', 'released', 'disputed', 'refunded'
  lockedAt: timestamp("locked_at"),
  releasedAt: timestamp("released_at"),
  disputeId: uuid("dispute_id"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Freelance disputes table
export const freelanceDisputes = pgTable("freelance_disputes", {
  id: uuid("id").primaryKey().defaultRandom(),
  projectId: uuid("project_id")
    .notNull()
    .references(() => freelanceProjects.id, { onDelete: "cascade" }),
  escrowId: uuid("escrow_id").references(() => freelanceEscrow.id),
  raisedBy: uuid("raised_by")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  againstUserId: uuid("against_user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  reason: text("reason").notNull(),
  description: text("description").notNull(),
  evidence: text("evidence").array(), // File URLs or other evidence
  status: text("status").default("open"), // 'open', 'investigating', 'resolved', 'closed'
  adminNotes: text("admin_notes"),
  resolution: text("resolution"), // Admin decision
  resolvedBy: uuid("resolved_by").references(() => users.id),
  resolvedAt: timestamp("resolved_at"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Freelance messages table (project-specific messaging)
export const freelanceMessages = pgTable("freelance_messages", {
  id: uuid("id").primaryKey().defaultRandom(),
  projectId: uuid("project_id")
    .notNull()
    .references(() => freelanceProjects.id, { onDelete: "cascade" }),
  senderId: uuid("sender_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  content: text("content").notNull(),
  attachments: text("attachments").array(),
  messageType: text("message_type").default("text"), // 'text', 'file', 'milestone', 'payment'
  read: boolean("read").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

// Create insert schemas
export const insertUserSchema = createInsertSchema(users).pick({
  email: true,
  password: true,
});

export const insertProfileSchema = createInsertSchema(profiles).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertPostSchema = createInsertSchema(posts).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertProductSchema = createInsertSchema(products).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertFreelanceJobSchema = createInsertSchema(freelanceJobs).omit({
  id: true,
  applicationsCount: true,
  createdAt: true,
  updatedAt: true,
});

export const insertFreelanceProposalSchema = createInsertSchema(
  freelanceProposals,
).omit({
  id: true,
  submittedAt: true,
  respondedAt: true,
});

export const insertFreelanceProjectSchema = createInsertSchema(
  freelanceProjects,
).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertProjectMilestoneSchema = createInsertSchema(
  projectMilestones,
).omit({
  id: true,
  submittedAt: true,
  approvedAt: true,
  createdAt: true,
  updatedAt: true,
});

export const insertFreelanceReviewSchema = createInsertSchema(
  freelanceReviews,
).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertFreelanceEscrowSchema = createInsertSchema(
  freelanceEscrow,
).omit({
  id: true,
  lockedAt: true,
  releasedAt: true,
  createdAt: true,
  updatedAt: true,
});

// Admin permissions table
export const adminPermissions = pgTable("admin_permissions", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  role: text("role").notNull(), // 'super_admin', 'content_admin', 'user_admin', 'marketplace_admin', 'crypto_admin', 'freelance_admin', 'support_admin'
  permissions: jsonb("permissions").notNull(), // Array of specific permissions
  isActive: boolean("is_active").default(true),
  grantedBy: uuid("granted_by")
    .notNull()
    .references(() => users.id),
  expiresAt: timestamp("expires_at"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Admin activity logs table
export const adminActivityLogs = pgTable("admin_activity_logs", {
  id: uuid("id").primaryKey().defaultRandom(),
  adminId: uuid("admin_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  action: text("action").notNull(), // 'create', 'update', 'delete', 'suspend', 'activate', etc.
  targetType: text("target_type").notNull(), // 'user', 'post', 'product', 'job', etc.
  targetId: uuid("target_id"),
  details: jsonb("details"), // Additional action details
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Platform settings table (for admin control)
export const platformSettings = pgTable("platform_settings", {
  id: uuid("id").primaryKey().defaultRandom(),
  category: text("category").notNull(), // 'general', 'marketplace', 'crypto', 'freelance', 'content'
  key: text("key").notNull(),
  value: jsonb("value").notNull(),
  description: text("description"),
  isPublic: boolean("is_public").default(false), // Whether setting is visible to users
  lastModifiedBy: uuid("last_modified_by")
    .notNull()
    .references(() => users.id),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Admin sessions table (for tracking admin logins)
export const adminSessions = pgTable("admin_sessions", {
  id: uuid("id").primaryKey().defaultRandom(),
  adminId: uuid("admin_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  sessionToken: text("session_token").notNull().unique(),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  lastActivity: timestamp("last_activity").defaultNow(),
  expiresAt: timestamp("expires_at").notNull(),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

// Content moderation queue
export const contentModerationQueue = pgTable("content_moderation_queue", {
  id: uuid("id").primaryKey().defaultRandom(),
  contentType: text("content_type").notNull(), // 'post', 'comment', 'product', 'job'
  contentId: uuid("content_id").notNull(),
  reportedBy: uuid("reported_by").references(() => users.id),
  reason: text("reason").notNull(),
  description: text("description"),
  priority: text("priority").default("medium"), // 'low', 'medium', 'high', 'urgent'
  status: text("status").default("pending"), // 'pending', 'reviewed', 'approved', 'rejected', 'removed'
  assignedTo: uuid("assigned_to").references(() => users.id),
  reviewedBy: uuid("reviewed_by").references(() => users.id),
  reviewNotes: text("review_notes"),
  autoDetected: boolean("auto_detected").default(false),
  confidence: decimal("confidence", { precision: 3, scale: 2 }), // AI confidence score
  reviewedAt: timestamp("reviewed_at"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Insert schemas for admin tables
export const insertAdminPermissionSchema = createInsertSchema(
  adminPermissions,
).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertAdminActivityLogSchema = createInsertSchema(
  adminActivityLogs,
).omit({
  id: true,
  createdAt: true,
});

export const insertPlatformSettingSchema = createInsertSchema(
  platformSettings,
).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertContentModerationSchema = createInsertSchema(
  contentModerationQueue,
).omit({
  id: true,
  reviewedAt: true,
  createdAt: true,
  updatedAt: true,
});

// Type exports
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type InsertProfile = z.infer<typeof insertProfileSchema>;
export type Profile = typeof profiles.$inferSelect;
export type InsertPost = z.infer<typeof insertPostSchema>;
export type Post = typeof posts.$inferSelect;
export type InsertProduct = z.infer<typeof insertProductSchema>;
export type Product = typeof products.$inferSelect;
export type FreelanceJob = typeof freelanceJobs.$inferSelect;
export type InsertFreelanceJob = z.infer<typeof insertFreelanceJobSchema>;
export type FreelanceProposal = typeof freelanceProposals.$inferSelect;
export type InsertFreelanceProposal = z.infer<
  typeof insertFreelanceProposalSchema
>;
export type FreelanceProject = typeof freelanceProjects.$inferSelect;
export type InsertFreelanceProject = z.infer<
  typeof insertFreelanceProjectSchema
>;
export type ProjectMilestone = typeof projectMilestones.$inferSelect;
export type InsertProjectMilestone = z.infer<
  typeof insertProjectMilestoneSchema
>;
export type FreelanceReview = typeof freelanceReviews.$inferSelect;
export type InsertFreelanceReview = z.infer<typeof insertFreelanceReviewSchema>;
export type FreelanceEscrow = typeof freelanceEscrow.$inferSelect;
export type InsertFreelanceEscrow = z.infer<typeof insertFreelanceEscrowSchema>;
export type FreelanceDispute = typeof freelanceDisputes.$inferSelect;
export type FreelanceMessage = typeof freelanceMessages.$inferSelect;
export type ProjectFile = typeof projectFiles.$inferSelect;

// Admin types
export type AdminPermission = typeof adminPermissions.$inferSelect;
export type InsertAdminPermission = z.infer<typeof insertAdminPermissionSchema>;
export type AdminActivityLog = typeof adminActivityLogs.$inferSelect;
export type InsertAdminActivityLog = z.infer<
  typeof insertAdminActivityLogSchema
>;
export type PlatformSetting = typeof platformSettings.$inferSelect;
export type InsertPlatformSetting = z.infer<typeof insertPlatformSettingSchema>;
export type AdminSession = typeof adminSessions.$inferSelect;
export type ContentModerationItem = typeof contentModerationQueue.$inferSelect;
export type InsertContentModerationItem = z.infer<
  typeof insertContentModerationSchema
>;
