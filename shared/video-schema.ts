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
  unique,
  index,
} from "drizzle-orm/pg-core";
import { users, profiles } from "./schema";

// =============================================================================
// VIDEO CONTENT SYSTEM
// =============================================================================

export const videos = pgTable("videos", {
  id: uuid("id").primaryKey().defaultRandom(),
  creatorId: uuid("creator_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),

  // Video content
  caption: text("caption"),
  videoUrl: text("video_url").notNull(),
  thumbnailUrl: text("thumbnail_url"),
  duration: integer("duration").default(0), // in seconds
  
  // Metadata
  hashtags: jsonb("hashtags").$type<string[]>().default([]),
  mentions: jsonb("mentions").$type<string[]>().default([]),
  location: text("location"),
  
  // Privacy and permissions
  isPrivate: boolean("is_private").default(false),
  allowComments: boolean("allow_comments").default(true),
  allowDuets: boolean("allow_duets").default(true),
  allowStitch: boolean("allow_stitch").default(true),
  
  // Duet information
  isDuet: boolean("is_duet").default(false),
  duetOriginalId: uuid("duet_original_id").references(() => videos.id),
  duetStyle: text("duet_style"), // 'side-by-side', 'react-respond', 'picture-in-picture'
  audioSource: text("audio_source"), // 'original', 'voiceover', 'both'
  
  // Battle information
  isBattle: boolean("is_battle").default(false),
  battleOpponentId: uuid("battle_opponent_id").references(() => users.id),
  battleType: text("battle_type"),
  
  // Processing status
  processingStatus: text("processing_status").default("pending"), // 'pending', 'processing', 'completed', 'failed'
  qualityVersions: jsonb("quality_versions"), // Different quality URLs
  
  // Monetization
  monetizationSettings: jsonb("monetization_settings"),
  
  // Moderation
  isDeleted: boolean("is_deleted").default(false),
  deletedAt: timestamp("deleted_at"),
  deletedBy: uuid("deleted_by").references(() => users.id),
  
  // Category and tags
  category: text("category"),
  ageRating: text("age_rating").default("all"), // 'all', '13+', '16+', '18+'
  
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
}, (table) => {
  return {
    creatorIdIdx: index("videos_creator_id_idx").on(table.creatorId),
    duetOriginalIdIdx: index("videos_duet_original_id_idx").on(table.duetOriginalId),
    categoryIdx: index("videos_category_idx").on(table.category),
    createdAtIdx: index("videos_created_at_idx").on(table.createdAt),
  };
});

export const videoViews = pgTable("video_views", {
  id: uuid("id").primaryKey().defaultRandom(),
  videoId: uuid("video_id")
    .notNull()
    .references(() => videos.id, { onDelete: "cascade" }),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
    
  watchTime: integer("watch_time").default(0), // seconds watched
  watchPercentage: decimal("watch_percentage", { precision: 5, scale: 2 }).default("0"),
  completedView: boolean("completed_view").default(false),
  
  // Device and session info
  deviceInfo: jsonb("device_info"),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  sessionId: text("session_id"),
  
  createdAt: timestamp("created_at").defaultNow(),
}, (table) => {
  return {
    videoUserIdx: index("video_views_video_user_idx").on(table.videoId, table.userId),
    videoIdIdx: index("video_views_video_id_idx").on(table.videoId),
    userIdIdx: index("video_views_user_id_idx").on(table.userId),
    uniqueView: unique("unique_video_view").on(table.videoId, table.userId),
  };
});

export const videoLikes = pgTable("video_likes", {
  id: uuid("id").primaryKey().defaultRandom(),
  videoId: uuid("video_id")
    .notNull()
    .references(() => videos.id, { onDelete: "cascade" }),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
    
  createdAt: timestamp("created_at").defaultNow(),
}, (table) => {
  return {
    videoUserIdx: index("video_likes_video_user_idx").on(table.videoId, table.userId),
    uniqueLike: unique("unique_video_like").on(table.videoId, table.userId),
  };
});

export const videoComments = pgTable("video_comments", {
  id: uuid("id").primaryKey().defaultRandom(),
  videoId: uuid("video_id")
    .notNull()
    .references(() => videos.id, { onDelete: "cascade" }),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  parentCommentId: uuid("parent_comment_id").references(() => videoComments.id),
  
  content: text("content").notNull(),
  likesCount: integer("likes_count").default(0),
  repliesCount: integer("replies_count").default(0),
  
  isDeleted: boolean("is_deleted").default(false),
  deletedAt: timestamp("deleted_at"),
  
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
}, (table) => {
  return {
    videoIdIdx: index("video_comments_video_id_idx").on(table.videoId),
    userIdIdx: index("video_comments_user_id_idx").on(table.userId),
    parentCommentIdIdx: index("video_comments_parent_id_idx").on(table.parentCommentId),
  };
});

export const videoShares = pgTable("video_shares", {
  id: uuid("id").primaryKey().defaultRandom(),
  videoId: uuid("video_id")
    .notNull()
    .references(() => videos.id, { onDelete: "cascade" }),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
    
  shareType: text("share_type").notNull(), // 'platform', 'external', 'download'
  platform: text("platform"), // 'facebook', 'twitter', 'instagram', 'whatsapp'
  
  createdAt: timestamp("created_at").defaultNow(),
}, (table) => {
  return {
    videoIdIdx: index("video_shares_video_id_idx").on(table.videoId),
    userIdIdx: index("video_shares_user_id_idx").on(table.userId),
  };
});

export const videoAnalytics = pgTable("video_analytics", {
  id: uuid("id").primaryKey().defaultRandom(),
  videoId: uuid("video_id")
    .notNull()
    .references(() => videos.id, { onDelete: "cascade" }),
    
  // View metrics
  views: integer("views").default(0),
  uniqueViews: integer("unique_views").default(0),
  totalWatchTime: integer("total_watch_time").default(0), // in seconds
  averageWatchTime: decimal("average_watch_time", { precision: 10, scale: 2 }).default("0"),
  completionRate: decimal("completion_rate", { precision: 5, scale: 2 }).default("0"),
  
  // Engagement metrics
  likes: integer("likes").default(0),
  comments: integer("comments").default(0),
  shares: integer("shares").default(0),
  saves: integer("saves").default(0),
  duets: integer("duets").default(0),
  
  // Performance metrics
  engagementRate: decimal("engagement_rate", { precision: 5, scale: 2 }).default("0"),
  reachRate: decimal("reach_rate", { precision: 5, scale: 2 }).default("0"),
  viralScore: decimal("viral_score", { precision: 10, scale: 2 }).default("0"),
  
  // Demographics
  viewerDemographics: jsonb("viewer_demographics"),
  geographicData: jsonb("geographic_data"),
  deviceBreakdown: jsonb("device_breakdown"),
  
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
}, (table) => {
  return {
    videoIdIdx: index("video_analytics_video_id_idx").on(table.videoId),
  };
});

// =============================================================================
// LIVE STREAMING
// =============================================================================

export const liveStreams = pgTable("live_streams", {
  id: uuid("id").primaryKey().defaultRandom(),
  streamerId: uuid("streamer_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
    
  title: text("title").notNull(),
  description: text("description"),
  thumbnailUrl: text("thumbnail_url"),
  
  // Stream configuration
  streamKey: text("stream_key").notNull(),
  streamUrl: text("stream_url"),
  quality: text("quality").default("720p"), // '480p', '720p', '1080p', '4K'
  frameRate: integer("frame_rate").default(30),
  bitrate: integer("bitrate").default(2500),
  
  // Status
  status: text("status").default("scheduled"), // 'scheduled', 'live', 'ended', 'cancelled'
  scheduledFor: timestamp("scheduled_for"),
  startedAt: timestamp("started_at"),
  endedAt: timestamp("ended_at"),
  
  // Settings
  isPrivate: boolean("is_private").default(false),
  allowChat: boolean("allow_chat").default(true),
  allowGifts: boolean("allow_gifts").default(true),
  allowRecording: boolean("allow_recording").default(true),
  
  // Monetization
  enableTips: boolean("enable_tips").default(false),
  minTipAmount: decimal("min_tip_amount", { precision: 10, scale: 2 }).default("1"),
  
  // Analytics
  peakViewers: integer("peak_viewers").default(0),
  totalViewers: integer("total_viewers").default(0),
  duration: integer("duration").default(0), // in seconds
  
  category: text("category"),
  tags: jsonb("tags").$type<string[]>().default([]),
  
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
}, (table) => {
  return {
    streamerIdIdx: index("live_streams_streamer_id_idx").on(table.streamerId),
    statusIdx: index("live_streams_status_idx").on(table.status),
    scheduledForIdx: index("live_streams_scheduled_for_idx").on(table.scheduledFor),
  };
});

export const streamViewers = pgTable("stream_viewers", {
  id: uuid("id").primaryKey().defaultRandom(),
  streamId: uuid("stream_id")
    .notNull()
    .references(() => liveStreams.id, { onDelete: "cascade" }),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
    
  joinedAt: timestamp("joined_at").defaultNow(),
  leftAt: timestamp("left_at"),
  watchTime: integer("watch_time").default(0), // in seconds
  
  // Interaction tracking
  messagesSent: integer("messages_sent").default(0),
  giftsSent: integer("gifts_sent").default(0),
  tipAmount: decimal("tip_amount", { precision: 10, scale: 2 }).default("0"),
  
  isActive: boolean("is_active").default(true),
  
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
}, (table) => {
  return {
    streamUserIdx: index("stream_viewers_stream_user_idx").on(table.streamId, table.userId),
    streamIdIdx: index("stream_viewers_stream_id_idx").on(table.streamId),
    uniqueViewer: unique("unique_stream_viewer").on(table.streamId, table.userId),
  };
});

export const streamChatMessages = pgTable("stream_chat_messages", {
  id: uuid("id").primaryKey().defaultRandom(),
  streamId: uuid("stream_id")
    .notNull()
    .references(() => liveStreams.id, { onDelete: "cascade" }),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
    
  content: text("content").notNull(),
  messageType: text("message_type").default("chat"), // 'chat', 'gift', 'tip', 'system'
  
  // Gift/tip data
  giftData: jsonb("gift_data"),
  tipAmount: decimal("tip_amount", { precision: 10, scale: 2 }),
  
  // Moderation
  isDeleted: boolean("is_deleted").default(false),
  deletedBy: uuid("deleted_by").references(() => users.id),
  deletedAt: timestamp("deleted_at"),
  
  createdAt: timestamp("created_at").defaultNow(),
}, (table) => {
  return {
    streamIdIdx: index("stream_chat_messages_stream_id_idx").on(table.streamId),
    userIdIdx: index("stream_chat_messages_user_id_idx").on(table.userId),
    createdAtIdx: index("stream_chat_messages_created_at_idx").on(table.createdAt),
  };
});

export const streamGifts = pgTable("stream_gifts", {
  id: uuid("id").primaryKey().defaultRandom(),
  streamId: uuid("stream_id")
    .notNull()
    .references(() => liveStreams.id, { onDelete: "cascade" }),
  senderId: uuid("sender_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
    
  giftType: text("gift_type").notNull(), // 'rose', 'heart', 'diamond', 'rocket'
  giftValue: decimal("gift_value", { precision: 10, scale: 2 }).notNull(),
  quantity: integer("quantity").default(1),
  totalValue: decimal("total_value", { precision: 10, scale: 2 }).notNull(),
  
  message: text("message"),
  
  createdAt: timestamp("created_at").defaultNow(),
}, (table) => {
  return {
    streamIdIdx: index("stream_gifts_stream_id_idx").on(table.streamId),
    senderIdIdx: index("stream_gifts_sender_id_idx").on(table.senderId),
  };
});

// =============================================================================
// VIDEO BATTLES
// =============================================================================

export const videoBattles = pgTable("video_battles", {
  id: uuid("id").primaryKey().defaultRandom(),
  video1Id: uuid("video1_id")
    .notNull()
    .references(() => videos.id, { onDelete: "cascade" }),
  video2Id: uuid("video2_id")
    .notNull()
    .references(() => videos.id, { onDelete: "cascade" }),
    
  battleType: text("battle_type").notNull(), // 'dance', 'comedy', 'talent', 'custom'
  title: text("title"),
  description: text("description"),
  
  // Battle configuration
  duration: integer("duration").default(300), // 5 minutes default
  votingEndTime: timestamp("voting_end_time").notNull(),
  
  // Results
  status: text("status").default("active"), // 'active', 'completed', 'cancelled'
  winnerId: uuid("winner_id").references(() => users.id),
  video1Votes: integer("video1_votes").default(0),
  video2Votes: integer("video2_votes").default(0),
  totalVotes: integer("total_votes").default(0),
  
  // Prize information
  prizePool: decimal("prize_pool", { precision: 10, scale: 2 }).default("0"),
  prizeCurrency: text("prize_currency").default("SOFT_POINTS"),
  
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
}, (table) => {
  return {
    video1IdIdx: index("video_battles_video1_id_idx").on(table.video1Id),
    video2IdIdx: index("video_battles_video2_id_idx").on(table.video2Id),
    statusIdx: index("video_battles_status_idx").on(table.status),
    votingEndTimeIdx: index("video_battles_voting_end_time_idx").on(table.votingEndTime),
  };
});

export const battleVotes = pgTable("battle_votes", {
  id: uuid("id").primaryKey().defaultRandom(),
  battleId: uuid("battle_id")
    .notNull()
    .references(() => videoBattles.id, { onDelete: "cascade" }),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  videoId: uuid("video_id")
    .notNull()
    .references(() => videos.id, { onDelete: "cascade" }),
    
  voteWeight: integer("vote_weight").default(1), // Premium users might have higher weight
  
  createdAt: timestamp("created_at").defaultNow(),
}, (table) => {
  return {
    battleUserIdx: index("battle_votes_battle_user_idx").on(table.battleId, table.userId),
    uniqueVote: unique("unique_battle_vote").on(table.battleId, table.userId),
  };
});

// =============================================================================
// VIDEO PROCESSING
// =============================================================================

export const videoProcessingJobs = pgTable("video_processing_jobs", {
  id: uuid("id").primaryKey().defaultRandom(),
  videoId: uuid("video_id")
    .notNull()
    .references(() => videos.id, { onDelete: "cascade" }),
    
  jobType: text("job_type").notNull(), // 'video_processing', 'thumbnail_generation', 'duet_merge'
  status: text("status").default("queued"), // 'queued', 'processing', 'completed', 'failed'
  priority: integer("priority").default(5), // 1-10, higher = more priority
  
  inputUrl: text("input_url"),
  outputUrl: text("output_url"),
  parameters: jsonb("parameters"),
  
  progress: integer("progress").default(0), // 0-100
  errorMessage: text("error_message"),
  
  startedAt: timestamp("started_at"),
  completedAt: timestamp("completed_at"),
  
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
}, (table) => {
  return {
    videoIdIdx: index("video_processing_jobs_video_id_idx").on(table.videoId),
    statusIdx: index("video_processing_jobs_status_idx").on(table.status),
    priorityIdx: index("video_processing_jobs_priority_idx").on(table.priority),
  };
});

export const videoVersions = pgTable("video_versions", {
  id: uuid("id").primaryKey().defaultRandom(),
  videoId: uuid("video_id")
    .notNull()
    .references(() => videos.id, { onDelete: "cascade" }),
    
  quality: text("quality").notNull(), // '240p', '360p', '480p', '720p', '1080p'
  format: text("format").notNull(), // 'mp4', 'webm', 'mov'
  videoUrl: text("video_url").notNull(),
  fileSize: integer("file_size"), // in bytes
  bitrate: integer("bitrate"),
  frameRate: integer("frame_rate"),
  
  isDefault: boolean("is_default").default(false),
  
  createdAt: timestamp("created_at").defaultNow(),
}, (table) => {
  return {
    videoIdIdx: index("video_versions_video_id_idx").on(table.videoId),
    qualityIdx: index("video_versions_quality_idx").on(table.quality),
  };
});
