import express from "express";
import multer from "multer";
import { z } from "zod";
import { eq, and, or, desc, asc, sql, like, inArray, count } from "drizzle-orm";
import { db } from "../db";
import {
  authenticateToken,
  requireRole,
  createRateLimitMiddleware,
  AppError,
} from "../config/security";
import { fileService } from "../services/fileService";
import { 
  videos,
  videoViews,
  videoLikes,
  videoComments,
  videoShares,
  videoReports,
  videoAnalytics,
  liveStreams,
  streamViewers,
  streamChatMessages,
  streamGifts,
  videoBattles,
  battleVotes,
  videoStories,
  storyViews,
  videoPlaylists,
  playlistItems,
  videoProcessingJobs,
  videoVersions,
  videoCollaborations,
  videoModerationQueue,
  creatorEarnings
} from "../../shared/enhanced-schema";
import { users, profiles } from "../../shared/schema";

const router = express.Router();

// Rate limiters
const uploadLimiter = createRateLimitMiddleware(10); // 10 uploads per 15 minutes
const apiLimiter = createRateLimitMiddleware(100);

// Multer configuration for video uploads
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 500 * 1024 * 1024, // 500MB limit
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = [
      'video/mp4', 'video/webm', 'video/quicktime', 'video/x-msvideo',
      'image/jpeg', 'image/png', 'image/gif', 'image/webp'
    ];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only videos and images are allowed.'));
    }
  },
});

// Validation schemas
const uploadVideoSchema = z.object({
  caption: z.string().max(2200).optional(),
  hashtags: z.array(z.string()).max(10).optional(),
  mentions: z.array(z.string()).optional(),
  location: z.string().optional(),
  isPrivate: z.boolean().default(false),
  allowComments: z.boolean().default(true),
  allowDuets: z.boolean().default(true),
  allowStitch: z.boolean().default(true),
  duetSettings: z.object({
    originalVideoId: z.string().uuid().optional(),
    duetStyle: z.enum(['side-by-side', 'react-respond', 'picture-in-picture']).optional(),
    audioSource: z.enum(['original', 'voiceover', 'both']).optional(),
  }).optional(),
  battleSettings: z.object({
    opponentId: z.string().uuid().optional(),
    battleType: z.enum(['dance', 'comedy', 'talent', 'custom']).optional(),
    duration: z.number().min(30).max(300).optional(),
  }).optional(),
  monetization: z.object({
    enableTips: z.boolean().default(false),
    enableGifts: z.boolean().default(false),
    pricePerView: z.number().min(0).optional(),
  }).optional(),
});

const feedQuerySchema = z.object({
  type: z.enum(['for-you', 'following', 'trending', 'battles', 'live']).default('for-you'),
  limit: z.number().min(1).max(50).default(20),
  offset: z.number().min(0).default(0),
  category: z.string().optional(),
  hashtag: z.string().optional(),
  location: z.string().optional(),
});

// =============================================================================
// VIDEO UPLOAD & PROCESSING
// =============================================================================

/**
 * POST /api/videos/upload
 * Upload and process video content
 */
router.post("/upload", authenticateToken, uploadLimiter, upload.fields([
  { name: 'video', maxCount: 1 },
  { name: 'thumbnail', maxCount: 1 },
  { name: 'duetOriginal', maxCount: 1 }
]), async (req, res, next) => {
  try {
    const userId = req.user!.userId;
    const files = req.files as { [fieldname: string]: Express.Multer.File[] };
    const videoData = uploadVideoSchema.parse(JSON.parse(req.body.metadata || '{}'));

    if (!files.video?.[0]) {
      throw new AppError("Video file is required", 400);
    }

    const videoFile = files.video[0];
    const thumbnailFile = files.thumbnail?.[0];

    // Upload video to storage
    const videoUrl = await fileService.uploadVideo(videoFile.buffer, {
      userId,
      originalName: videoFile.originalname,
      mimeType: videoFile.mimetype,
      size: videoFile.size,
    });

    // Upload thumbnail if provided, otherwise generate one
    let thumbnailUrl: string;
    if (thumbnailFile) {
      thumbnailUrl = await fileService.uploadImage(thumbnailFile.buffer, {
        userId,
        originalName: thumbnailFile.originalname,
        mimeType: thumbnailFile.mimetype,
      });
    } else {
      // Generate thumbnail from video (implement video processing service)
      thumbnailUrl = await fileService.generateVideoThumbnail(videoUrl);
    }

    // Process duet if applicable
    let processedVideoUrl = videoUrl;
    let duetData = null;
    
    if (videoData.duetSettings?.originalVideoId) {
      const [originalVideo] = await db
        .select()
        .from(videos)
        .where(eq(videos.id, videoData.duetSettings.originalVideoId))
        .limit(1);

      if (!originalVideo) {
        throw new AppError("Original video not found for duet", 404);
      }

      // Process duet video (combine with original)
      processedVideoUrl = await fileService.processDuetVideo({
        originalVideoUrl: originalVideo.videoUrl,
        newVideoUrl: videoUrl,
        style: videoData.duetSettings.duetStyle || 'side-by-side',
        audioSource: videoData.duetSettings.audioSource || 'both',
      });

      duetData = {
        originalVideoId: originalVideo.id,
        originalCreatorId: originalVideo.creatorId,
        duetStyle: videoData.duetSettings.duetStyle,
        audioSource: videoData.duetSettings.audioSource,
      };
    }

    // Create video record
    const [video] = await db.transaction(async (tx) => {
      // Insert video
      const [newVideo] = await tx
        .insert(videos)
        .values({
          creatorId: userId,
          caption: videoData.caption,
          videoUrl: processedVideoUrl,
          thumbnailUrl,
          duration: 0, // Will be updated after processing
          hashtags: videoData.hashtags,
          mentions: videoData.mentions,
          location: videoData.location,
          isPrivate: videoData.isPrivate,
          allowComments: videoData.allowComments,
          allowDuets: videoData.allowDuets,
          allowStitch: videoData.allowStitch,
          isDuet: !!duetData,
          duetOriginalId: duetData?.originalVideoId,
          duetStyle: duetData?.duetStyle,
          audioSource: duetData?.audioSource,
          processingStatus: 'processing',
          monetizationSettings: videoData.monetization,
        })
        .returning();

      // Create processing job
      await tx.insert(videoProcessingJobs).values({
        videoId: newVideo.id,
        jobType: 'video_processing',
        status: 'queued',
        inputUrl: videoUrl,
        outputUrl: processedVideoUrl,
        parameters: {
          generateThumbnail: !thumbnailFile,
          extractDuration: true,
          generatePreviews: true,
          transcodeFormats: ['mp4', 'webm'],
          generateCaptions: true,
          isDuet: !!duetData,
          duetSettings: duetData,
        },
      });

      // Initialize analytics
      await tx.insert(videoAnalytics).values({
        videoId: newVideo.id,
        views: 0,
        uniqueViews: 0,
        likes: 0,
        comments: 0,
        shares: 0,
        completionRate: 0,
        averageWatchTime: 0,
        engagementRate: 0,
      });

      return [newVideo];
    });

    // Start background processing
    // This would typically be handled by a queue system
    setImmediate(async () => {
      try {
        await processVideoInBackground(video.id);
      } catch (error) {
        console.error('Background video processing failed:', error);
      }
    });

    res.status(201).json({
      success: true,
      video: {
        id: video.id,
        videoUrl: video.videoUrl,
        thumbnailUrl: video.thumbnailUrl,
        processingStatus: video.processingStatus,
        isDuet: video.isDuet,
      },
      message: "Video uploaded successfully. Processing in background.",
    });
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/videos/feed
 * Get video feed with personalized algorithm
 */
router.get("/feed", authenticateToken, apiLimiter, async (req, res, next) => {
  try {
    const userId = req.user!.userId;
    const query = feedQuerySchema.parse(req.query);

    let baseQuery = db
      .select({
        id: videos.id,
        caption: videos.caption,
        videoUrl: videos.videoUrl,
        thumbnailUrl: videos.thumbnailUrl,
        duration: videos.duration,
        hashtags: videos.hashtags,
        mentions: videos.mentions,
        location: videos.location,
        isDuet: videos.isDuet,
        duetOriginalId: videos.duetOriginalId,
        duetStyle: videos.duetStyle,
        createdAt: videos.createdAt,
        views: videoAnalytics.views,
        likes: videoAnalytics.likes,
        comments: videoAnalytics.comments,
        shares: videoAnalytics.shares,
        engagementRate: videoAnalytics.engagementRate,
        creator: {
          id: profiles.userId,
          username: profiles.username,
          fullName: profiles.fullName,
          avatar: profiles.avatar,
          isVerified: profiles.isVerified,
        },
      })
      .from(videos)
      .innerJoin(profiles, eq(profiles.userId, videos.creatorId))
      .leftJoin(videoAnalytics, eq(videoAnalytics.videoId, videos.id))
      .where(
        and(
          eq(videos.processingStatus, 'completed'),
          eq(videos.isPrivate, false),
          eq(videos.isDeleted, false)
        )
      );

    // Apply feed type filters
    switch (query.type) {
      case 'following':
        // Get videos from followed users
        baseQuery = baseQuery.where(
          sql`${videos.creatorId} IN (
            SELECT following_id FROM user_follows 
            WHERE follower_id = ${userId} AND is_active = true
          )`
        );
        break;
        
      case 'trending':
        // Sort by engagement and recency
        baseQuery = baseQuery.where(
          gte(videos.createdAt, sql`NOW() - INTERVAL '24 hours'`)
        );
        break;
        
      case 'battles':
        // Get battle videos
        baseQuery = baseQuery.where(eq(videos.isBattle, true));
        break;
        
      case 'for-you':
      default:
        // Personalized algorithm (simplified)
        // In production, this would use ML recommendations
        break;
    }

    // Apply additional filters
    if (query.hashtag) {
      baseQuery = baseQuery.where(
        sql`${query.hashtag} = ANY(${videos.hashtags})`
      );
    }

    if (query.category) {
      baseQuery = baseQuery.where(eq(videos.category, query.category));
    }

    if (query.location) {
      baseQuery = baseQuery.where(like(videos.location, `%${query.location}%`));
    }

    // Apply ordering based on feed type
    switch (query.type) {
      case 'trending':
        baseQuery = baseQuery.orderBy(
          desc(sql`(${videoAnalytics.likes} + ${videoAnalytics.comments} * 2 + ${videoAnalytics.shares} * 3)`),
          desc(videos.createdAt)
        );
        break;
      case 'following':
        baseQuery = baseQuery.orderBy(desc(videos.createdAt));
        break;
      default:
        // For You feed - mix of recency and engagement
        baseQuery = baseQuery.orderBy(
          desc(sql`(${videoAnalytics.engagementRate} * 0.7 + EXTRACT(EPOCH FROM (NOW() - ${videos.createdAt})) / -86400 * 0.3)`),
          desc(videos.createdAt)
        );
    }

    const videosResult = await baseQuery
      .limit(query.limit)
      .offset(query.offset);

    // Check user's interaction with each video
    const videoIds = videosResult.map(v => v.id);
    const userInteractions = videoIds.length > 0 ? await db
      .select({
        videoId: videoLikes.videoId,
        hasLiked: sql<boolean>`true`,
      })
      .from(videoLikes)
      .where(
        and(
          eq(videoLikes.userId, userId),
          inArray(videoLikes.videoId, videoIds)
        )
      ) : [];

    const likedVideoIds = new Set(userInteractions.map(i => i.videoId));

    // Format response
    const formattedVideos = videosResult.map(video => ({
      ...video,
      hasLiked: likedVideoIds.has(video.id),
      hasFollowed: false, // Would need to check user_follows table
    }));

    res.json({
      success: true,
      videos: formattedVideos,
      pagination: {
        limit: query.limit,
        offset: query.offset,
        hasMore: videosResult.length === query.limit,
      },
    });
  } catch (error) {
    next(error);
  }
});

/**
 * POST /api/videos/:videoId/view
 * Record video view
 */
router.post("/:videoId/view", authenticateToken, async (req, res, next) => {
  try {
    const userId = req.user!.userId;
    const { videoId } = req.params;
    const { watchTime, watchPercentage, deviceInfo } = req.body;

    // Check if video exists
    const [video] = await db
      .select()
      .from(videos)
      .where(eq(videos.id, videoId))
      .limit(1);

    if (!video) {
      throw new AppError("Video not found", 404);
    }

    // Record view
    await db.transaction(async (tx) => {
      // Insert view record
      await tx.insert(videoViews).values({
        videoId,
        userId,
        watchTime: watchTime || 0,
        watchPercentage: watchPercentage || 0,
        deviceInfo,
        ipAddress: req.ip,
        userAgent: req.get('User-Agent'),
      });

      // Update analytics
      await tx
        .update(videoAnalytics)
        .set({
          views: sql`views + 1`,
          totalWatchTime: sql`total_watch_time + ${watchTime || 0}`,
          averageWatchTime: sql`total_watch_time / views`,
          completionRate: sql`
            (SELECT AVG(watch_percentage) FROM video_views WHERE video_id = ${videoId})
          `,
          updatedAt: new Date(),
        })
        .where(eq(videoAnalytics.videoId, videoId));

      // Award creator earnings for view
      if (video.creatorId !== userId && watchPercentage >= 50) {
        const viewEarning = 0.001; // $0.001 per qualified view
        await tx.insert(creatorEarnings).values({
          userId: video.creatorId,
          sourceType: 'views',
          contentId: videoId,
          contentType: 'video',
          amount: viewEarning.toString(),
          currency: 'USDT',
          softPointsEarned: '1',
          fromUserId: userId,
          description: `View earning for video ${videoId}`,
        });
      }
    });

    res.json({
      success: true,
      message: "View recorded successfully",
    });
  } catch (error) {
    next(error);
  }
});

/**
 * POST /api/videos/:videoId/like
 * Like/unlike a video
 */
router.post("/:videoId/like", authenticateToken, async (req, res, next) => {
  try {
    const userId = req.user!.userId;
    const { videoId } = req.params;

    // Check if video exists
    const [video] = await db
      .select()
      .from(videos)
      .where(eq(videos.id, videoId))
      .limit(1);

    if (!video) {
      throw new AppError("Video not found", 404);
    }

    // Check if already liked
    const [existingLike] = await db
      .select()
      .from(videoLikes)
      .where(and(eq(videoLikes.videoId, videoId), eq(videoLikes.userId, userId)))
      .limit(1);

    let isLiked: boolean;

    await db.transaction(async (tx) => {
      if (existingLike) {
        // Unlike
        await tx
          .delete(videoLikes)
          .where(and(eq(videoLikes.videoId, videoId), eq(videoLikes.userId, userId)));

        await tx
          .update(videoAnalytics)
          .set({
            likes: sql`likes - 1`,
            engagementRate: sql`
              ((likes - 1) + comments + shares) * 100.0 / GREATEST(views, 1)
            `,
            updatedAt: new Date(),
          })
          .where(eq(videoAnalytics.videoId, videoId));

        isLiked = false;
      } else {
        // Like
        await tx.insert(videoLikes).values({
          videoId,
          userId,
        });

        await tx
          .update(videoAnalytics)
          .set({
            likes: sql`likes + 1`,
            engagementRate: sql`
              (likes + 1 + comments + shares) * 100.0 / GREATEST(views, 1)
            `,
            updatedAt: new Date(),
          })
          .where(eq(videoAnalytics.videoId, videoId));

        // Award creator engagement points
        if (video.creatorId !== userId) {
          await tx.insert(creatorEarnings).values({
            userId: video.creatorId,
            sourceType: 'engagement',
            contentId: videoId,
            contentType: 'video',
            amount: '0',
            currency: 'SOFT_POINTS',
            softPointsEarned: '2',
            fromUserId: userId,
            description: `Like on video ${videoId}`,
          });
        }

        isLiked = true;
      }
    });

    res.json({
      success: true,
      isLiked,
      message: isLiked ? "Video liked" : "Video unliked",
    });
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/videos/:videoId/comments
 * Get video comments with replies
 */
router.get("/:videoId/comments", authenticateToken, async (req, res, next) => {
  try {
    const { videoId } = req.params;
    const { limit = 20, offset = 0, sortBy = 'recent' } = req.query;

    let orderBy;
    switch (sortBy) {
      case 'popular':
        orderBy = [desc(videoComments.likesCount), desc(videoComments.createdAt)];
        break;
      case 'oldest':
        orderBy = [asc(videoComments.createdAt)];
        break;
      default:
        orderBy = [desc(videoComments.createdAt)];
    }

    const comments = await db
      .select({
        id: videoComments.id,
        content: videoComments.content,
        likesCount: videoComments.likesCount,
        repliesCount: videoComments.repliesCount,
        createdAt: videoComments.createdAt,
        author: {
          id: profiles.userId,
          username: profiles.username,
          fullName: profiles.fullName,
          avatar: profiles.avatar,
          isVerified: profiles.isVerified,
        },
      })
      .from(videoComments)
      .innerJoin(profiles, eq(profiles.userId, videoComments.userId))
      .where(
        and(
          eq(videoComments.videoId, videoId),
          isNull(videoComments.parentCommentId)
        )
      )
      .orderBy(...orderBy)
      .limit(parseInt(limit as string))
      .offset(parseInt(offset as string));

    res.json({
      success: true,
      comments,
      pagination: {
        limit: parseInt(limit as string),
        offset: parseInt(offset as string),
        hasMore: comments.length === parseInt(limit as string),
      },
    });
  } catch (error) {
    next(error);
  }
});

/**
 * POST /api/videos/:videoId/comments
 * Add comment to video
 */
router.post("/:videoId/comments", authenticateToken, async (req, res, next) => {
  try {
    const userId = req.user!.userId;
    const { videoId } = req.params;
    const { content, parentCommentId } = req.body;

    if (!content || content.trim().length === 0) {
      throw new AppError("Comment content is required", 400);
    }

    if (content.length > 500) {
      throw new AppError("Comment too long", 400);
    }

    // Check if video exists and allows comments
    const [video] = await db
      .select()
      .from(videos)
      .where(eq(videos.id, videoId))
      .limit(1);

    if (!video) {
      throw new AppError("Video not found", 404);
    }

    if (!video.allowComments) {
      throw new AppError("Comments are disabled for this video", 403);
    }

    const [comment] = await db.transaction(async (tx) => {
      // Insert comment
      const [newComment] = await tx
        .insert(videoComments)
        .values({
          videoId,
          userId,
          content: content.trim(),
          parentCommentId,
        })
        .returning();

      // Update parent comment replies count if this is a reply
      if (parentCommentId) {
        await tx
          .update(videoComments)
          .set({
            repliesCount: sql`replies_count + 1`,
          })
          .where(eq(videoComments.id, parentCommentId));
      }

      // Update video analytics
      await tx
        .update(videoAnalytics)
        .set({
          comments: sql`comments + 1`,
          engagementRate: sql`
            (likes + comments + 1 + shares) * 100.0 / GREATEST(views, 1)
          `,
          updatedAt: new Date(),
        })
        .where(eq(videoAnalytics.videoId, videoId));

      // Award creator engagement points
      if (video.creatorId !== userId) {
        await tx.insert(creatorEarnings).values({
          userId: video.creatorId,
          sourceType: 'engagement',
          contentId: videoId,
          contentType: 'video',
          amount: '0',
          currency: 'SOFT_POINTS',
          softPointsEarned: '3',
          fromUserId: userId,
          description: `Comment on video ${videoId}`,
        });
      }

      return [newComment];
    });

    // Get comment with author info
    const [commentWithAuthor] = await db
      .select({
        id: videoComments.id,
        content: videoComments.content,
        likesCount: videoComments.likesCount,
        repliesCount: videoComments.repliesCount,
        createdAt: videoComments.createdAt,
        author: {
          id: profiles.userId,
          username: profiles.username,
          fullName: profiles.fullName,
          avatar: profiles.avatar,
          isVerified: profiles.isVerified,
        },
      })
      .from(videoComments)
      .innerJoin(profiles, eq(profiles.userId, videoComments.userId))
      .where(eq(videoComments.id, comment.id))
      .limit(1);

    res.status(201).json({
      success: true,
      comment: commentWithAuthor,
      message: "Comment added successfully",
    });
  } catch (error) {
    next(error);
  }
});

// Background processing function
async function processVideoInBackground(videoId: string) {
  try {
    // Update processing status
    await db
      .update(videos)
      .set({
        processingStatus: 'processing',
        updatedAt: new Date(),
      })
      .where(eq(videos.id, videoId));

    // Simulate video processing (extract duration, generate previews, etc.)
    // In production, this would use a video processing service like FFmpeg
    await new Promise(resolve => setTimeout(resolve, 5000));

    // Update as completed
    await db
      .update(videos)
      .set({
        processingStatus: 'completed',
        duration: 30, // Placeholder duration
        updatedAt: new Date(),
      })
      .where(eq(videos.id, videoId));

    console.log(`Video ${videoId} processed successfully`);
  } catch (error) {
    console.error(`Video processing failed for ${videoId}:`, error);
    
    await db
      .update(videos)
      .set({
        processingStatus: 'failed',
        updatedAt: new Date(),
      })
      .where(eq(videos.id, videoId));
  }
}

export default router;
