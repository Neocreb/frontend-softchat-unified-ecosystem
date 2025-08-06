import {
  pgTable,
  text,
  uuid,
  boolean,
  timestamp,
  integer,
  decimal,
  jsonb,
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Sticker packs table
export const stickerPacks = pgTable("sticker_packs", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  description: text("description"),
  coverImageUrl: text("cover_image_url"),
  creatorId: uuid("creator_id").notNull(),
  isPublic: boolean("is_public").default(true),
  isPremium: boolean("is_premium").default(false),
  isOfficial: boolean("is_official").default(false),
  downloadCount: integer("download_count").default(0),
  rating: decimal("rating", { precision: 3, scale: 2 }).default("0"),
  ratingCount: integer("rating_count").default(0),
  tags: text("tags").array(),
  category: text("category").notNull(), // 'emotions', 'memes', 'business', 'custom', etc.
  status: text("status").default("active"), // 'active', 'pending', 'rejected', 'banned'
  moderationNotes: text("moderation_notes"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Individual stickers table
export const stickers = pgTable("stickers", {
  id: uuid("id").primaryKey().defaultRandom(),
  packId: uuid("pack_id")
    .notNull()
    .references(() => stickerPacks.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  fileUrl: text("file_url").notNull(),
  thumbnailUrl: text("thumbnail_url"),
  type: text("type").notNull(), // 'static', 'animated', 'gif'
  fileSize: integer("file_size").notNull(),
  width: integer("width").notNull(),
  height: integer("height").notNull(),
  mimeType: text("mime_type").notNull(), // 'image/png', 'image/webp', 'image/gif'
  usageCount: integer("usage_count").default(0),
  tags: text("tags").array(),
  metadata: jsonb("metadata"), // Additional sticker data
  isOriginal: boolean("is_original").default(true), // True if user-created
  sourceUrl: text("source_url"), // Original source if imported
  status: text("status").default("active"), // 'active', 'pending', 'rejected'
  moderationNotes: text("moderation_notes"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// User sticker library (saved/favorite stickers)
export const userStickerLibrary = pgTable("user_sticker_library", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").notNull(),
  stickerId: uuid("sticker_id")
    .notNull()
    .references(() => stickers.id, { onDelete: "cascade" }),
  packId: uuid("pack_id")
    .notNull()
    .references(() => stickerPacks.id, { onDelete: "cascade" }),
  isFavorite: boolean("is_favorite").default(false),
  addedAt: timestamp("added_at").defaultNow(),
});

// User sticker pack downloads
export const userStickerPacks = pgTable("user_sticker_packs", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").notNull(),
  packId: uuid("pack_id")
    .notNull()
    .references(() => stickerPacks.id, { onDelete: "cascade" }),
  downloadedAt: timestamp("downloaded_at").defaultNow(),
  isActive: boolean("is_active").default(true),
});

// Sticker usage analytics
export const stickerUsage = pgTable("sticker_usage", {
  id: uuid("id").primaryKey().defaultRandom(),
  stickerId: uuid("sticker_id")
    .notNull()
    .references(() => stickers.id, { onDelete: "cascade" }),
  userId: uuid("user_id").notNull(),
  usedInConversation: uuid("used_in_conversation"),
  timestamp: timestamp("timestamp").defaultNow(),
  metadata: jsonb("metadata"), // Context data
});

// Sticker pack ratings
export const stickerPackRatings = pgTable("sticker_pack_ratings", {
  id: uuid("id").primaryKey().defaultRandom(),
  packId: uuid("pack_id")
    .notNull()
    .references(() => stickerPacks.id, { onDelete: "cascade" }),
  userId: uuid("user_id").notNull(),
  rating: integer("rating").notNull(), // 1-5 stars
  review: text("review"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Sticker reports (for moderation)
export const stickerReports = pgTable("sticker_reports", {
  id: uuid("id").primaryKey().defaultRandom(),
  stickerId: uuid("sticker_id")
    .references(() => stickers.id, { onDelete: "cascade" }),
  packId: uuid("pack_id")
    .references(() => stickerPacks.id, { onDelete: "cascade" }),
  reportedBy: uuid("reported_by").notNull(),
  reason: text("reason").notNull(), // 'inappropriate', 'spam', 'copyright', 'other'
  description: text("description"),
  status: text("status").default("pending"), // 'pending', 'reviewed', 'resolved', 'dismissed'
  reviewedBy: uuid("reviewed_by"),
  reviewNotes: text("review_notes"),
  actionTaken: text("action_taken"), // 'none', 'warning', 'removal', 'ban'
  createdAt: timestamp("created_at").defaultNow(),
  reviewedAt: timestamp("reviewed_at"),
});

// Recently used stickers (for quick access)
export const recentStickers = pgTable("recent_stickers", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").notNull(),
  stickerId: uuid("sticker_id")
    .notNull()
    .references(() => stickers.id, { onDelete: "cascade" }),
  lastUsed: timestamp("last_used").defaultNow(),
});

// Sticker creation requests (for user-generated content)
export const stickerCreationRequests = pgTable("sticker_creation_requests", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").notNull(),
  packName: text("pack_name").notNull(),
  description: text("description"),
  category: text("category").notNull(),
  isPublic: boolean("is_public").default(false),
  files: jsonb("files").notNull(), // Array of uploaded file data
  status: text("status").default("pending"), // 'pending', 'processing', 'approved', 'rejected'
  rejectionReason: text("rejection_reason"),
  processedPackId: uuid("processed_pack_id")
    .references(() => stickerPacks.id),
  createdAt: timestamp("created_at").defaultNow(),
  processedAt: timestamp("processed_at"),
});

// Export schemas for validation
export const insertStickerPackSchema = createInsertSchema(stickerPacks).omit({
  id: true,
  downloadCount: true,
  rating: true,
  ratingCount: true,
  createdAt: true,
  updatedAt: true,
});

export const insertStickerSchema = createInsertSchema(stickers).omit({
  id: true,
  usageCount: true,
  createdAt: true,
  updatedAt: true,
});

export const insertUserStickerLibrarySchema = createInsertSchema(userStickerLibrary).omit({
  id: true,
  addedAt: true,
});

export const insertStickerReportSchema = createInsertSchema(stickerReports).omit({
  id: true,
  status: true,
  reviewedBy: true,
  reviewNotes: true,
  actionTaken: true,
  createdAt: true,
  reviewedAt: true,
});

export const insertStickerCreationRequestSchema = createInsertSchema(stickerCreationRequests).omit({
  id: true,
  status: true,
  rejectionReason: true,
  processedPackId: true,
  createdAt: true,
  processedAt: true,
});

// Types
export type StickerPack = typeof stickerPacks.$inferSelect;
export type InsertStickerPack = z.infer<typeof insertStickerPackSchema>;
export type Sticker = typeof stickers.$inferSelect;
export type InsertSticker = z.infer<typeof insertStickerSchema>;
export type UserStickerLibrary = typeof userStickerLibrary.$inferSelect;
export type StickerReport = typeof stickerReports.$inferSelect;
export type StickerCreationRequest = typeof stickerCreationRequests.$inferSelect;
export type RecentSticker = typeof recentStickers.$inferSelect;
export type StickerUsage = typeof stickerUsage.$inferSelect;
export type StickerPackRating = typeof stickerPackRatings.$inferSelect;
export type UserStickerPack = typeof userStickerPacks.$inferSelect;
