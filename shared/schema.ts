import { pgTable, uuid, text, timestamp, boolean, jsonb, numeric, integer, varchar, primaryKey } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

// Users table
export const users = pgTable('users', {
  id: uuid('id').primaryKey().defaultRandom(),
  email: text('email').unique().notNull(),
  username: text('username').unique(),
  full_name: text('full_name'),
  avatar_url: text('avatar_url'),
  banner_url: text('banner_url'),
  bio: text('bio'),
  location: text('location'),
  website: text('website'),
  phone: text('phone'),
  date_of_birth: text('date_of_birth'),
  gender: text('gender'),
  is_verified: boolean('is_verified').default(false),
  points: integer('points').default(0),
  level: text('level').default('bronze'),
  role: text('role').default('user'),
  reputation: integer('reputation').default(0),
  followers_count: integer('followers_count').default(0),
  following_count: integer('following_count').default(0),
  posts_count: integer('posts_count').default(0),
  profile_views: integer('profile_views').default(0),
  is_online: boolean('is_online').default(false),
  last_active: timestamp('last_active'),
  profile_visibility: text('profile_visibility').default('public'),
  allow_direct_messages: boolean('allow_direct_messages').default(true),
  allow_notifications: boolean('allow_notifications').default(true),
  preferred_currency: text('preferred_currency').default('USD'),
  timezone: text('timezone'),
  created_at: timestamp('created_at').defaultNow(),
  updated_at: timestamp('updated_at').defaultNow(),
});

// Posts table
export const posts = pgTable('posts', {
  id: uuid('id').primaryKey().defaultRandom(),
  user_id: uuid('user_id').notNull(),
  content: text('content'),
  media_urls: jsonb('media_urls'),
  type: text('type').default('text'),
  privacy: text('privacy').default('public'),
  location: text('location'),
  hashtags: text('hashtags').array(),
  mentions: text('mentions').array(),
  likes_count: integer('likes_count').default(0),
  comments_count: integer('comments_count').default(0),
  shares_count: integer('shares_count').default(0),
  views_count: integer('views_count').default(0),
  is_pinned: boolean('is_pinned').default(false),
  is_featured: boolean('is_featured').default(false),
  is_deleted: boolean('is_deleted').default(false),
  deleted_at: timestamp('deleted_at'),
  scheduled_at: timestamp('scheduled_at'),
  created_at: timestamp('created_at').defaultNow(),
  updated_at: timestamp('updated_at').defaultNow(),
});

// Followers table
export const followers = pgTable('followers', {
  id: uuid('id').primaryKey().defaultRandom(),
  follower_id: uuid('follower_id').notNull(),
  following_id: uuid('following_id').notNull(),
  created_at: timestamp('created_at').defaultNow(),
});

// Post likes table
export const post_likes = pgTable('post_likes', {
  id: uuid('id').primaryKey().defaultRandom(),
  post_id: uuid('post_id').notNull(),
  user_id: uuid('user_id').notNull(),
  created_at: timestamp('created_at').defaultNow(),
});

// Post comments table
export const post_comments = pgTable('post_comments', {
  id: uuid('id').primaryKey().defaultRandom(),
  post_id: uuid('post_id').notNull(),
  user_id: uuid('user_id').notNull(),
  content: text('content').notNull(),
  parent_id: uuid('parent_id'),
  likes_count: integer('likes_count').default(0),
  replies_count: integer('replies_count').default(0),
  is_deleted: boolean('is_deleted').default(false),
  deleted_at: timestamp('deleted_at'),
  created_at: timestamp('created_at').defaultNow(),
  updated_at: timestamp('updated_at').defaultNow(),
});

// User sessions table
export const user_sessions = pgTable('user_sessions', {
  id: uuid('id').primaryKey().defaultRandom(),
  user_id: uuid('user_id').notNull(),
  session_token: text('session_token').unique().notNull(),
  refresh_token: text('refresh_token').unique(),
  ip_address: text('ip_address'),
  user_agent: text('user_agent'),
  is_active: boolean('is_active').default(true),
  expires_at: timestamp('expires_at').notNull(),
  created_at: timestamp('created_at').defaultNow(),
});

// User preferences table
export const user_preferences = pgTable('user_preferences', {
  id: uuid('id').primaryKey().defaultRandom(),
  user_id: uuid('user_id').notNull(),
  theme: text('theme').default('light'),
  language: text('language').default('en'),
  notifications: jsonb('notifications'),
  privacy: jsonb('privacy'),
  feed_preferences: jsonb('feed_preferences'),
  created_at: timestamp('created_at').defaultNow(),
  updated_at: timestamp('updated_at').defaultNow(),
});

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  posts: many(posts),
  followers: many(followers, { relationName: 'userFollowers' }),
  following: many(followers, { relationName: 'userFollowing' }),
  postLikes: many(post_likes),
  postComments: many(post_comments),
  sessions: many(user_sessions),
  preferences: many(user_preferences),
}));

export const postsRelations = relations(posts, ({ one, many }) => ({
  user: one(users, {
    fields: [posts.user_id],
    references: [users.id],
  }),
  likes: many(post_likes),
  comments: many(post_comments),
}));

export const followersRelations = relations(followers, ({ one }) => ({
  follower: one(users, {
    fields: [followers.follower_id],
    references: [users.id],
    relationName: 'userFollowers',
  }),
  following: one(users, {
    fields: [followers.following_id],
    references: [users.id],
    relationName: 'userFollowing',
  }),
}));

export const postLikesRelations = relations(post_likes, ({ one }) => ({
  post: one(posts, {
    fields: [post_likes.post_id],
    references: [posts.id],
  }),
  user: one(users, {
    fields: [post_likes.user_id],
    references: [users.id],
  }),
}));

export const postCommentsRelations = relations(post_comments, ({ one, many }) => ({
  post: one(posts, {
    fields: [post_comments.post_id],
    references: [posts.id],
  }),
  user: one(users, {
    fields: [post_comments.user_id],
    references: [users.id],
  }),
  parent: one(post_comments, {
    fields: [post_comments.parent_id],
    references: [post_comments.id],
    relationName: 'commentReplies',
  }),
  replies: many(post_comments, { relationName: 'commentReplies' }),
}));

export const userSessionsRelations = relations(user_sessions, ({ one }) => ({
  user: one(users, {
    fields: [user_sessions.user_id],
    references: [users.id],
  }),
}));

export const userPreferencesRelations = relations(user_preferences, ({ one }) => ({
  user: one(users, {
    fields: [user_preferences.user_id],
    references: [users.id],
  }),
}));
