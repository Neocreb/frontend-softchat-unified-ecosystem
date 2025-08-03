import { pgTable, text, timestamp, integer, boolean, uuid, decimal, jsonb, varchar, index } from 'drizzle-orm/pg-core';
import { sql } from 'drizzle-orm';

// Videos table - Main video content
export const videos = pgTable('videos', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id').notNull(),
  title: text('title').notNull(),
  description: text('description'),
  filename: text('filename').notNull(),
  originalFilename: text('original_filename').notNull(),
  fileSize: integer('file_size').notNull(),
  duration: integer('duration'), // in seconds
  thumbnail: text('thumbnail'),
  status: varchar('status', { length: 20 }).notNull().default('processing'), // processing, ready, failed
  visibility: varchar('visibility', { length: 20 }).notNull().default('public'), // public, private, unlisted
  category: varchar('category', { length: 50 }),
  tags: jsonb('tags').$type<string[]>().default([]),
  hashtags: jsonb('hashtags').$type<string[]>().default([]),
  viewCount: integer('view_count').notNull().default(0),
  likeCount: integer('like_count').notNull().default(0),
  commentCount: integer('comment_count').notNull().default(0),
  shareCount: integer('share_count').notNull().default(0),
  allowComments: boolean('allow_comments').notNull().default(true),
  allowDuets: boolean('allow_duets').notNull().default(true),
  allowDownloads: boolean('allow_downloads').notNull().default(false),
  location: text('location'),
  musicId: uuid('music_id'),
  aspectRatio: varchar('aspect_ratio', { length: 10 }).default('9:16'), // 9:16, 16:9, 1:1
  quality: varchar('quality', { length: 10 }).default('720p'), // 480p, 720p, 1080p, 4k
  contentWarning: boolean('content_warning').default(false),
  ageRestricted: boolean('age_restricted').default(false),
  monetizationEnabled: boolean('monetization_enabled').default(false),
  processingData: jsonb('processing_data').$type<any>(),
  metadata: jsonb('metadata').$type<any>(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
}, (table) => ({
  userIdx: index('videos_user_idx').on(table.userId),
  statusIdx: index('videos_status_idx').on(table.status),
  visibilityIdx: index('videos_visibility_idx').on(table.visibility),
  categoryIdx: index('videos_category_idx').on(table.category),
  createdAtIdx: index('videos_created_at_idx').on(table.createdAt),
}));

// Video views tracking
export const videoViews = pgTable('video_views', {
  id: uuid('id').defaultRandom().primaryKey(),
  videoId: uuid('video_id').notNull(),
  userId: uuid('user_id'), // null for anonymous views
  ipAddress: varchar('ip_address', { length: 45 }),
  userAgent: text('user_agent'),
  watchDuration: integer('watch_duration').notNull().default(0), // in seconds
  watchPercentage: decimal('watch_percentage', { precision: 5, scale: 2 }).default('0.00'),
  completed: boolean('completed').default(false),
  deviceType: varchar('device_type', { length: 20 }), // mobile, desktop, tablet
  referrer: text('referrer'),
  location: text('location'),
  timestamp: timestamp('timestamp').defaultNow().notNull(),
}, (table) => ({
  videoIdx: index('video_views_video_idx').on(table.videoId),
  userIdx: index('video_views_user_idx').on(table.userId),
  timestampIdx: index('video_views_timestamp_idx').on(table.timestamp),
}));

// Video likes
export const videoLikes = pgTable('video_likes', {
  id: uuid('id').defaultRandom().primaryKey(),
  videoId: uuid('video_id').notNull(),
  userId: uuid('user_id').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
}, (table) => ({
  videoUserIdx: index('video_likes_video_user_idx').on(table.videoId, table.userId),
  userIdx: index('video_likes_user_idx').on(table.userId),
}));

// Video comments
export const videoComments = pgTable('video_comments', {
  id: uuid('id').defaultRandom().primaryKey(),
  videoId: uuid('video_id').notNull(),
  userId: uuid('user_id').notNull(),
  content: text('content').notNull(),
  parentId: uuid('parent_id'), // for replies
  likeCount: integer('like_count').notNull().default(0),
  replyCount: integer('reply_count').notNull().default(0),
  pinned: boolean('pinned').default(false),
  edited: boolean('edited').default(false),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
}, (table) => ({
  videoIdx: index('video_comments_video_idx').on(table.videoId),
  userIdx: index('video_comments_user_idx').on(table.userId),
  parentIdx: index('video_comments_parent_idx').on(table.parentId),
  createdAtIdx: index('video_comments_created_at_idx').on(table.createdAt),
}));

// Video comment likes
export const videoCommentLikes = pgTable('video_comment_likes', {
  id: uuid('id').defaultRandom().primaryKey(),
  commentId: uuid('comment_id').notNull(),
  userId: uuid('user_id').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
}, (table) => ({
  commentUserIdx: index('video_comment_likes_comment_user_idx').on(table.commentId, table.userId),
}));

// Video shares tracking
export const videoShares = pgTable('video_shares', {
  id: uuid('id').defaultRandom().primaryKey(),
  videoId: uuid('video_id').notNull(),
  userId: uuid('user_id'),
  platform: varchar('platform', { length: 30 }).notNull(), // internal, facebook, twitter, etc.
  shareType: varchar('share_type', { length: 20 }).notNull(), // link, embed, download
  metadata: jsonb('metadata').$type<any>(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
}, (table) => ({
  videoIdx: index('video_shares_video_idx').on(table.videoId),
  platformIdx: index('video_shares_platform_idx').on(table.platform),
}));

// Live streams
export const liveStreams = pgTable('live_streams', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id').notNull(),
  title: text('title').notNull(),
  description: text('description'),
  thumbnail: text('thumbnail'),
  status: varchar('status', { length: 20 }).notNull().default('waiting'), // waiting, live, ended, error
  viewerCount: integer('viewer_count').notNull().default(0),
  maxViewers: integer('max_viewers').notNull().default(0),
  streamKey: text('stream_key').notNull(),
  streamUrl: text('stream_url'),
  playbackUrl: text('playback_url'),
  category: varchar('category', { length: 50 }),
  tags: jsonb('tags').$type<string[]>().default([]),
  allowChat: boolean('allow_chat').notNull().default(true),
  allowGifts: boolean('allow_gifts').notNull().default(true),
  monetizationEnabled: boolean('monetization_enabled').default(false),
  scheduledStartTime: timestamp('scheduled_start_time'),
  actualStartTime: timestamp('actual_start_time'),
  endTime: timestamp('end_time'),
  duration: integer('duration'), // in seconds
  recordingEnabled: boolean('recording_enabled').default(true),
  recordingUrl: text('recording_url'),
  settings: jsonb('settings').$type<any>(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
}, (table) => ({
  userIdx: index('live_streams_user_idx').on(table.userId),
  statusIdx: index('live_streams_status_idx').on(table.status),
  scheduledStartIdx: index('live_streams_scheduled_start_idx').on(table.scheduledStartTime),
}));

// Live stream viewers
export const liveStreamViewers = pgTable('live_stream_viewers', {
  id: uuid('id').defaultRandom().primaryKey(),
  streamId: uuid('stream_id').notNull(),
  userId: uuid('user_id'), // null for anonymous viewers
  joinedAt: timestamp('joined_at').defaultNow().notNull(),
  leftAt: timestamp('left_at'),
  watchDuration: integer('watch_duration').default(0), // in seconds
  deviceType: varchar('device_type', { length: 20 }),
  ipAddress: varchar('ip_address', { length: 45 }),
}, (table) => ({
  streamIdx: index('live_stream_viewers_stream_idx').on(table.streamId),
  userIdx: index('live_stream_viewers_user_idx').on(table.userId),
}));

// Video duets
export const videoDuets = pgTable('video_duets', {
  id: uuid('id').defaultRandom().primaryKey(),
  originalVideoId: uuid('original_video_id').notNull(),
  duetVideoId: uuid('duet_video_id').notNull(),
  userId: uuid('user_id').notNull(),
  duetType: varchar('duet_type', { length: 20 }).notNull().default('split'), // split, reaction, stitch
  splitPosition: varchar('split_position', { length: 10 }).default('right'), // left, right, top, bottom
  syncOffset: integer('sync_offset').default(0), // milliseconds offset for sync
  approved: boolean('approved').default(true),
  createdAt: timestamp('created_at').defaultNow().notNull(),
}, (table) => ({
  originalIdx: index('video_duets_original_idx').on(table.originalVideoId),
  duetIdx: index('video_duets_duet_idx').on(table.duetVideoId),
  userIdx: index('video_duets_user_idx').on(table.userId),
}));

// Video battles
export const videoBattles = pgTable('video_battles', {
  id: uuid('id').defaultRandom().primaryKey(),
  creatorId: uuid('creator_id').notNull(),
  challengerId: uuid('challenger_id'),
  video1Id: uuid('video1_id').notNull(),
  video2Id: uuid('video2_id'),
  title: text('title').notNull(),
  description: text('description'),
  category: varchar('category', { length: 50 }),
  status: varchar('status', { length: 20 }).notNull().default('open'), // open, ongoing, completed, cancelled
  startTime: timestamp('start_time'),
  endTime: timestamp('end_time'),
  duration: integer('duration').notNull().default(7), // days
  votingEnabled: boolean('voting_enabled').notNull().default(true),
  video1Votes: integer('video1_votes').notNull().default(0),
  video2Votes: integer('video2_votes').notNull().default(0),
  winnerId: uuid('winner_id'),
  prizePool: decimal('prize_pool', { precision: 10, scale: 2 }).default('0.00'),
  entryFee: decimal('entry_fee', { precision: 10, scale: 2 }).default('0.00'),
  rules: jsonb('rules').$type<any>(),
  judgeIds: jsonb('judge_ids').$type<string[]>().default([]),
  publicVoting: boolean('public_voting').default(true),
  minFollowers: integer('min_followers').default(0),
  ageRestricted: boolean('age_restricted').default(false),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
}, (table) => ({
  creatorIdx: index('video_battles_creator_idx').on(table.creatorId),
  challengerIdx: index('video_battles_challenger_idx').on(table.challengerId),
  statusIdx: index('video_battles_status_idx').on(table.status),
  categoryIdx: index('video_battles_category_idx').on(table.category),
}));

// Battle votes
export const battleVotes = pgTable('battle_votes', {
  id: uuid('id').defaultRandom().primaryKey(),
  battleId: uuid('battle_id').notNull(),
  userId: uuid('user_id').notNull(),
  videoId: uuid('video_id').notNull(), // which video they voted for
  voteWeight: decimal('vote_weight', { precision: 3, scale: 2 }).default('1.00'),
  isJudgeVote: boolean('is_judge_vote').default(false),
  createdAt: timestamp('created_at').defaultNow().notNull(),
}, (table) => ({
  battleUserIdx: index('battle_votes_battle_user_idx').on(table.battleId, table.userId),
  battleIdx: index('battle_votes_battle_idx').on(table.battleId),
}));

// Video processing jobs
export const videoProcessingJobs = pgTable('video_processing_jobs', {
  id: uuid('id').defaultRandom().primaryKey(),
  videoId: uuid('video_id').notNull(),
  jobType: varchar('job_type', { length: 30 }).notNull(), // transcode, thumbnail, analysis
  status: varchar('status', { length: 20 }).notNull().default('pending'), // pending, processing, completed, failed
  priority: integer('priority').notNull().default(5), // 1-10, higher = more priority
  inputData: jsonb('input_data').$type<any>(),
  outputData: jsonb('output_data').$type<any>(),
  errorMessage: text('error_message'),
  progress: decimal('progress', { precision: 5, scale: 2 }).default('0.00'), // 0.00 to 100.00
  startedAt: timestamp('started_at'),
  completedAt: timestamp('completed_at'),
  retryCount: integer('retry_count').notNull().default(0),
  maxRetries: integer('max_retries').notNull().default(3),
  processingNode: varchar('processing_node', { length: 50 }),
  estimatedDuration: integer('estimated_duration'), // seconds
  actualDuration: integer('actual_duration'), // seconds
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
}, (table) => ({
  videoIdx: index('video_processing_jobs_video_idx').on(table.videoId),
  statusIdx: index('video_processing_jobs_status_idx').on(table.status),
  jobTypeIdx: index('video_processing_jobs_job_type_idx').on(table.jobType),
  priorityIdx: index('video_processing_jobs_priority_idx').on(table.priority),
}));

// Video playlists
export const videoPlaylists = pgTable('video_playlists', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id').notNull(),
  name: text('name').notNull(),
  description: text('description'),
  thumbnail: text('thumbnail'),
  visibility: varchar('visibility', { length: 20 }).notNull().default('public'), // public, private, unlisted
  videoCount: integer('video_count').notNull().default(0),
  totalDuration: integer('total_duration').notNull().default(0), // seconds
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
}, (table) => ({
  userIdx: index('video_playlists_user_idx').on(table.userId),
  visibilityIdx: index('video_playlists_visibility_idx').on(table.visibility),
}));

// Playlist items
export const playlistItems = pgTable('playlist_items', {
  id: uuid('id').defaultRandom().primaryKey(),
  playlistId: uuid('playlist_id').notNull(),
  videoId: uuid('video_id').notNull(),
  position: integer('position').notNull(),
  addedBy: uuid('added_by').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
}, (table) => ({
  playlistIdx: index('playlist_items_playlist_idx').on(table.playlistId),
  playlistPositionIdx: index('playlist_items_playlist_position_idx').on(table.playlistId, table.position),
}));

// Video analytics summary (for performance)
export const videoAnalytics = pgTable('video_analytics', {
  id: uuid('id').defaultRandom().primaryKey(),
  videoId: uuid('video_id').notNull(),
  date: timestamp('date').notNull(),
  views: integer('views').notNull().default(0),
  uniqueViews: integer('unique_views').notNull().default(0),
  likes: integer('likes').notNull().default(0),
  comments: integer('comments').notNull().default(0),
  shares: integer('shares').notNull().default(0),
  avgWatchTime: decimal('avg_watch_time', { precision: 8, scale: 2 }).default('0.00'),
  completionRate: decimal('completion_rate', { precision: 5, scale: 2 }).default('0.00'),
  engagement: decimal('engagement', { precision: 5, scale: 2 }).default('0.00'),
  revenue: decimal('revenue', { precision: 10, scale: 2 }).default('0.00'),
  impressions: integer('impressions').notNull().default(0),
  clickThroughRate: decimal('click_through_rate', { precision: 5, scale: 2 }).default('0.00'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
}, (table) => ({
  videoDateIdx: index('video_analytics_video_date_idx').on(table.videoId, table.date),
  dateIdx: index('video_analytics_date_idx').on(table.date),
}));

// Music library for videos
export const musicLibrary = pgTable('music_library', {
  id: uuid('id').defaultRandom().primaryKey(),
  title: text('title').notNull(),
  artist: text('artist').notNull(),
  duration: integer('duration').notNull(), // seconds
  fileUrl: text('file_url').notNull(),
  genre: varchar('genre', { length: 50 }),
  mood: varchar('mood', { length: 30 }),
  bpm: integer('bpm'),
  key: varchar('key', { length: 10 }),
  copyrightFree: boolean('copyright_free').notNull().default(false),
  licenseCost: decimal('license_cost', { precision: 8, scale: 2 }).default('0.00'),
  popularityScore: integer('popularity_score').notNull().default(0),
  tags: jsonb('tags').$type<string[]>().default([]),
  waveformData: jsonb('waveform_data').$type<any>(),
  approved: boolean('approved').notNull().default(false),
  createdAt: timestamp('created_at').defaultNow().notNull(),
}, (table) => ({
  genreIdx: index('music_library_genre_idx').on(table.genre),
  artistIdx: index('music_library_artist_idx').on(table.artist),
  popularityIdx: index('music_library_popularity_idx').on(table.popularityScore),
}));
