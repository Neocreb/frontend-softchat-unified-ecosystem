import { pgTable, text, timestamp, integer, boolean, uuid, decimal, jsonb, varchar, index } from 'drizzle-orm/pg-core';
import { sql } from 'drizzle-orm';

// Social posts
export const socialPosts = pgTable('social_posts', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id').notNull(),
  content: text('content'),
  type: varchar('type', { length: 20 }).notNull().default('text'), // text, image, video, link, poll
  visibility: varchar('visibility', { length: 20 }).notNull().default('public'), // public, friends, private
  mediaUrls: jsonb('media_urls').$type<string[]>().default([]),
  mentions: jsonb('mentions').$type<string[]>().default([]),
  hashtags: jsonb('hashtags').$type<string[]>().default([]),
  location: text('location'),
  likeCount: integer('like_count').notNull().default(0),
  commentCount: integer('comment_count').notNull().default(0),
  shareCount: integer('share_count').notNull().default(0),
  reachCount: integer('reach_count').notNull().default(0),
  impressionCount: integer('impression_count').notNull().default(0),
  allowComments: boolean('allow_comments').notNull().default(true),
  pinned: boolean('pinned').default(false),
  edited: boolean('edited').default(false),
  scheduledFor: timestamp('scheduled_for'),
  originalPostId: uuid('original_post_id'), // for reposts/shares
  groupId: uuid('group_id'),
  pageId: uuid('page_id'),
  pollData: jsonb('poll_data').$type<any>(),
  linkData: jsonb('link_data').$type<any>(),
  metadata: jsonb('metadata').$type<any>(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
}, (table) => ({
  userIdx: index('social_posts_user_idx').on(table.userId),
  typeIdx: index('social_posts_type_idx').on(table.type),
  visibilityIdx: index('social_posts_visibility_idx').on(table.visibility),
  createdAtIdx: index('social_posts_created_at_idx').on(table.createdAt),
  groupIdx: index('social_posts_group_idx').on(table.groupId),
  pageIdx: index('social_posts_page_idx').on(table.pageId),
}));

// Post likes
export const postLikes = pgTable('post_likes', {
  id: uuid('id').defaultRandom().primaryKey(),
  postId: uuid('post_id').notNull(),
  userId: uuid('user_id').notNull(),
  reactionType: varchar('reaction_type', { length: 20 }).notNull().default('like'), // like, love, laugh, angry, sad
  createdAt: timestamp('created_at').defaultNow().notNull(),
}, (table) => ({
  postUserIdx: index('post_likes_post_user_idx').on(table.postId, table.userId),
  userIdx: index('post_likes_user_idx').on(table.userId),
}));

// Post comments
export const postComments = pgTable('post_comments', {
  id: uuid('id').defaultRandom().primaryKey(),
  postId: uuid('post_id').notNull(),
  userId: uuid('user_id').notNull(),
  content: text('content').notNull(),
  parentId: uuid('parent_id'), // for replies
  likeCount: integer('like_count').notNull().default(0),
  replyCount: integer('reply_count').notNull().default(0),
  mentions: jsonb('mentions').$type<string[]>().default([]),
  mediaUrls: jsonb('media_urls').$type<string[]>().default([]),
  edited: boolean('edited').default(false),
  pinned: boolean('pinned').default(false),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
}, (table) => ({
  postIdx: index('post_comments_post_idx').on(table.postId),
  userIdx: index('post_comments_user_idx').on(table.userId),
  parentIdx: index('post_comments_parent_idx').on(table.parentId),
  createdAtIdx: index('post_comments_created_at_idx').on(table.createdAt),
}));

// Comment likes
export const commentLikes = pgTable('comment_likes', {
  id: uuid('id').defaultRandom().primaryKey(),
  commentId: uuid('comment_id').notNull(),
  userId: uuid('user_id').notNull(),
  reactionType: varchar('reaction_type', { length: 20 }).notNull().default('like'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
}, (table) => ({
  commentUserIdx: index('comment_likes_comment_user_idx').on(table.commentId, table.userId),
}));

// Stories
export const stories = pgTable('stories', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id').notNull(),
  content: text('content'),
  type: varchar('type', { length: 20 }).notNull().default('image'), // image, video, text
  mediaUrl: text('media_url'),
  backgroundColor: varchar('background_color', { length: 7 }),
  textColor: varchar('text_color', { length: 7 }),
  font: varchar('font', { length: 30 }),
  duration: integer('duration').default(5), // seconds
  viewCount: integer('view_count').notNull().default(0),
  likeCount: integer('like_count').notNull().default(0),
  replyCount: integer('reply_count').notNull().default(0),
  music: text('music'),
  location: text('location'),
  mentions: jsonb('mentions').$type<string[]>().default([]),
  hashtags: jsonb('hashtags').$type<string[]>().default([]),
  allowReplies: boolean('allow_replies').notNull().default(true),
  allowScreenshot: boolean('allow_screenshot').notNull().default(true),
  highlighted: boolean('highlighted').default(false),
  expiresAt: timestamp('expires_at').notNull().default(sql`NOW() + INTERVAL '24 hours'`),
  createdAt: timestamp('created_at').defaultNow().notNull(),
}, (table) => ({
  userIdx: index('stories_user_idx').on(table.userId),
  typeIdx: index('stories_type_idx').on(table.type),
  expiresAtIdx: index('stories_expires_at_idx').on(table.expiresAt),
  createdAtIdx: index('stories_created_at_idx').on(table.createdAt),
}));

// Story views
export const storyViews = pgTable('story_views', {
  id: uuid('id').defaultRandom().primaryKey(),
  storyId: uuid('story_id').notNull(),
  userId: uuid('user_id').notNull(),
  viewDuration: integer('view_duration').default(0), // milliseconds
  completed: boolean('completed').default(false),
  createdAt: timestamp('created_at').defaultNow().notNull(),
}, (table) => ({
  storyUserIdx: index('story_views_story_user_idx').on(table.storyId, table.userId),
  storyIdx: index('story_views_story_idx').on(table.storyId),
}));

// Story likes
export const storyLikes = pgTable('story_likes', {
  id: uuid('id').defaultRandom().primaryKey(),
  storyId: uuid('story_id').notNull(),
  userId: uuid('user_id').notNull(),
  reactionType: varchar('reaction_type', { length: 20 }).notNull().default('like'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
}, (table) => ({
  storyUserIdx: index('story_likes_story_user_idx').on(table.storyId, table.userId),
}));

// Story replies
export const storyReplies = pgTable('story_replies', {
  id: uuid('id').defaultRandom().primaryKey(),
  storyId: uuid('story_id').notNull(),
  userId: uuid('user_id').notNull(),
  content: text('content'),
  type: varchar('type', { length: 20 }).notNull().default('text'), // text, image, video
  mediaUrl: text('media_url'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
}, (table) => ({
  storyIdx: index('story_replies_story_idx').on(table.storyId),
  userIdx: index('story_replies_user_idx').on(table.userId),
}));

// User follows/followers
export const userFollows = pgTable('user_follows', {
  id: uuid('id').defaultRandom().primaryKey(),
  followerId: uuid('follower_id').notNull(),
  followingId: uuid('following_id').notNull(),
  status: varchar('status', { length: 20 }).notNull().default('active'), // active, pending, blocked
  notificationsEnabled: boolean('notifications_enabled').notNull().default(true),
  createdAt: timestamp('created_at').defaultNow().notNull(),
}, (table) => ({
  followerFollowingIdx: index('user_follows_follower_following_idx').on(table.followerId, table.followingId),
  followerIdx: index('user_follows_follower_idx').on(table.followerId),
  followingIdx: index('user_follows_following_idx').on(table.followingId),
}));

// User blocks
export const userBlocks = pgTable('user_blocks', {
  id: uuid('id').defaultRandom().primaryKey(),
  blockerId: uuid('blocker_id').notNull(),
  blockedId: uuid('blocked_id').notNull(),
  reason: varchar('reason', { length: 50 }),
  createdAt: timestamp('created_at').defaultNow().notNull(),
}, (table) => ({
  blockerBlockedIdx: index('user_blocks_blocker_blocked_idx').on(table.blockerId, table.blockedId),
}));

// Hashtags tracking
export const hashtags = pgTable('hashtags', {
  id: uuid('id').defaultRandom().primaryKey(),
  tag: varchar('tag', { length: 100 }).notNull().unique(),
  usageCount: integer('usage_count').notNull().default(1),
  trendingScore: decimal('trending_score', { precision: 10, scale: 2 }).default('0.00'),
  category: varchar('category', { length: 50 }),
  language: varchar('language', { length: 10 }),
  isBlocked: boolean('is_blocked').default(false),
  lastUsed: timestamp('last_used').defaultNow().notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
}, (table) => ({
  tagIdx: index('hashtags_tag_idx').on(table.tag),
  usageCountIdx: index('hashtags_usage_count_idx').on(table.usageCount),
  trendingScoreIdx: index('hashtags_trending_score_idx').on(table.trendingScore),
  lastUsedIdx: index('hashtags_last_used_idx').on(table.lastUsed),
}));

// Groups
export const groups = pgTable('groups', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: text('name').notNull(),
  description: text('description'),
  avatar: text('avatar'),
  cover: text('cover'),
  privacy: varchar('privacy', { length: 20 }).notNull().default('public'), // public, private, secret
  memberCount: integer('member_count').notNull().default(0),
  postCount: integer('post_count').notNull().default(0),
  adminIds: jsonb('admin_ids').$type<string[]>().default([]),
  moderatorIds: jsonb('moderator_ids').$type<string[]>().default([]),
  rules: jsonb('rules').$type<any>(),
  tags: jsonb('tags').$type<string[]>().default([]),
  category: varchar('category', { length: 50 }),
  location: text('location'),
  website: text('website'),
  joinApprovalRequired: boolean('join_approval_required').default(false),
  postApprovalRequired: boolean('post_approval_required').default(false),
  allowEvents: boolean('allow_events').default(true),
  verified: boolean('verified').default(false),
  createdBy: uuid('created_by').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
}, (table) => ({
  nameIdx: index('groups_name_idx').on(table.name),
  privacyIdx: index('groups_privacy_idx').on(table.privacy),
  categoryIdx: index('groups_category_idx').on(table.category),
  memberCountIdx: index('groups_member_count_idx').on(table.memberCount),
}));

// Group members
export const groupMembers = pgTable('group_members', {
  id: uuid('id').defaultRandom().primaryKey(),
  groupId: uuid('group_id').notNull(),
  userId: uuid('user_id').notNull(),
  role: varchar('role', { length: 20 }).notNull().default('member'), // member, moderator, admin
  status: varchar('status', { length: 20 }).notNull().default('active'), // active, pending, banned
  joinedAt: timestamp('joined_at').defaultNow().notNull(),
  invitedBy: uuid('invited_by'),
  muteNotifications: boolean('mute_notifications').default(false),
}, (table) => ({
  groupUserIdx: index('group_members_group_user_idx').on(table.groupId, table.userId),
  groupIdx: index('group_members_group_idx').on(table.groupId),
  userIdx: index('group_members_user_idx').on(table.userId),
}));

// Pages (Business/Brand pages)
export const pages = pgTable('pages', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: text('name').notNull(),
  username: varchar('username', { length: 50 }).unique(),
  description: text('description'),
  avatar: text('avatar'),
  cover: text('cover'),
  category: varchar('category', { length: 50 }).notNull(),
  subCategory: varchar('sub_category', { length: 50 }),
  website: text('website'),
  email: text('email'),
  phone: text('phone'),
  address: text('address'),
  location: text('location'),
  businessHours: jsonb('business_hours').$type<any>(),
  followerCount: integer('follower_count').notNull().default(0),
  postCount: integer('post_count').notNull().default(0),
  rating: decimal('rating', { precision: 3, scale: 2 }).default('0.00'),
  reviewCount: integer('review_count').notNull().default(0),
  verified: boolean('verified').default(false),
  claimed: boolean('claimed').default(false),
  ownerId: uuid('owner_id').notNull(),
  adminIds: jsonb('admin_ids').$type<string[]>().default([]),
  settings: jsonb('settings').$type<any>(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
}, (table) => ({
  nameIdx: index('pages_name_idx').on(table.name),
  usernameIdx: index('pages_username_idx').on(table.username),
  categoryIdx: index('pages_category_idx').on(table.category),
  ownerIdx: index('pages_owner_idx').on(table.ownerId),
}));

// Page followers
export const pageFollows = pgTable('page_follows', {
  id: uuid('id').defaultRandom().primaryKey(),
  pageId: uuid('page_id').notNull(),
  userId: uuid('user_id').notNull(),
  notificationsEnabled: boolean('notifications_enabled').notNull().default(true),
  createdAt: timestamp('created_at').defaultNow().notNull(),
}, (table) => ({
  pageUserIdx: index('page_follows_page_user_idx').on(table.pageId, table.userId),
  pageIdx: index('page_follows_page_idx').on(table.pageId),
  userIdx: index('page_follows_user_idx').on(table.userId),
}));

// Page reviews
export const pageReviews = pgTable('page_reviews', {
  id: uuid('id').defaultRandom().primaryKey(),
  pageId: uuid('page_id').notNull(),
  userId: uuid('user_id').notNull(),
  rating: integer('rating').notNull(), // 1-5
  review: text('review'),
  images: jsonb('images').$type<string[]>().default([]),
  response: text('response'), // page owner response
  respondedAt: timestamp('responded_at'),
  verified: boolean('verified').default(false),
  helpful: integer('helpful').notNull().default(0),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
}, (table) => ({
  pageIdx: index('page_reviews_page_idx').on(table.pageId),
  userIdx: index('page_reviews_user_idx').on(table.userId),
  ratingIdx: index('page_reviews_rating_idx').on(table.rating),
}));

// Mentions tracking
export const mentions = pgTable('mentions', {
  id: uuid('id').defaultRandom().primaryKey(),
  mentionerId: uuid('mentioner_id').notNull(),
  mentionedId: uuid('mentioned_id').notNull(),
  contentType: varchar('content_type', { length: 20 }).notNull(), // post, comment, story
  contentId: uuid('content_id').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
}, (table) => ({
  mentionedIdx: index('mentions_mentioned_idx').on(table.mentionedId),
  contentIdx: index('mentions_content_idx').on(table.contentType, table.contentId),
}));

// Content reports
export const contentReports = pgTable('content_reports', {
  id: uuid('id').defaultRandom().primaryKey(),
  reporterId: uuid('reporter_id').notNull(),
  contentType: varchar('content_type', { length: 20 }).notNull(), // post, comment, story, video, user
  contentId: uuid('content_id').notNull(),
  reason: varchar('reason', { length: 50 }).notNull(),
  description: text('description'),
  status: varchar('status', { length: 20 }).notNull().default('pending'), // pending, reviewing, resolved, dismissed
  reviewedBy: uuid('reviewed_by'),
  reviewedAt: timestamp('reviewed_at'),
  action: varchar('action', { length: 30 }), // warning, content_removed, user_suspended, etc.
  createdAt: timestamp('created_at').defaultNow().notNull(),
}, (table) => ({
  reporterIdx: index('content_reports_reporter_idx').on(table.reporterId),
  contentIdx: index('content_reports_content_idx').on(table.contentType, table.contentId),
  statusIdx: index('content_reports_status_idx').on(table.status),
}));
