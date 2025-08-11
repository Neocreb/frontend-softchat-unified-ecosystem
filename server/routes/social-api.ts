import express from "express";
import multer from "multer";
import { z } from "zod";
import { eq, and, or, desc, asc, sql, like, inArray, count, exists, not } from "drizzle-orm";
import { db } from "../db";
import {
  authenticateToken,
  requireRole,
  createRateLimitMiddleware,
  AppError,
} from "../config/security";
import { FileService } from "../services/fileService";
import { 
  posts,
  postLikes,
  postComments,
  postShares,
  postViews,
  postReports,
  stories,
  storyViews,
  storyReactions,
  userFollows,
  userBlocks,
  friendRequests,
  notifications,
  polls,
  pollVotes,
  hashtags,
  hashtagFollows,
  mentions,
  postBookmarks,
  postCollections,
  collectionItems,
  userInterests,
  suggestedUsers,
  socialAnalytics,
  postAnalytics,
  engagementMetrics,
  contentFlags,
  moderationQueue,
  creatorEarnings,
  activityLogs,
} from "../../shared/enhanced-schema";
import { users, profiles } from "../../shared/schema";

const router = express.Router();

// Rate limiters
const postLimiter = createRateLimitMiddleware(20); // 20 posts per 15 minutes
const commentLimiter = createRateLimitMiddleware(50); // 50 comments per 15 minutes
const interactionLimiter = createRateLimitMiddleware(200); // 200 interactions per 15 minutes
const apiLimiter = createRateLimitMiddleware(100);

// Multer configuration for media uploads
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 100 * 1024 * 1024, // 100MB limit
    files: 10, // Max 10 files per upload
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = [
      'image/jpeg', 'image/png', 'image/gif', 'image/webp',
      'video/mp4', 'video/webm', 'video/quicktime'
    ];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type'));
    }
  },
});

// Validation schemas
const createPostSchema = z.object({
  content: z.string().max(2200).optional(),
  mediaUrls: z.array(z.string().url()).max(10).optional(),
  type: z.enum(['text', 'image', 'video', 'poll', 'story']).default('text'),
  visibility: z.enum(['public', 'followers', 'friends', 'private']).default('public'),
  allowComments: z.boolean().default(true),
  allowShares: z.boolean().default(true),
  location: z.string().optional(),
  hashtags: z.array(z.string()).max(10).optional(),
  mentions: z.array(z.string()).max(20).optional(),
  poll: z.object({
    question: z.string().max(500),
    options: z.array(z.string().max(100)).min(2).max(4),
    duration: z.number().min(1).max(168).default(24), // hours
    allowMultipleAnswers: z.boolean().default(false),
  }).optional(),
  scheduledAt: z.string().datetime().optional(),
  isPromoted: z.boolean().default(false),
  crossPostTo: z.array(z.enum(['facebook', 'twitter', 'instagram'])).optional(),
});

const createStorySchema = z.object({
  content: z.string().max(500).optional(),
  mediaUrl: z.string().url(),
  mediaType: z.enum(['image', 'video']),
  duration: z.number().min(1).max(30).default(24), // hours
  backgroundColor: z.string().optional(),
  textOverlay: z.object({
    text: z.string().max(200),
    position: z.object({ x: z.number(), y: z.number() }),
    style: z.object({
      fontSize: z.number(),
      color: z.string(),
      fontFamily: z.string().optional(),
    }),
  }).optional(),
  stickers: z.array(z.object({
    type: z.string(),
    position: z.object({ x: z.number(), y: z.number() }),
    data: z.record(z.any()),
  })).optional(),
  music: z.object({
    trackId: z.string(),
    startTime: z.number(),
    duration: z.number(),
  }).optional(),
  viewersList: z.enum(['everyone', 'followers', 'close_friends']).default('followers'),
});

const feedQuerySchema = z.object({
  type: z.enum(['home', 'following', 'explore', 'trending']).default('home'),
  limit: z.number().min(1).max(50).default(20),
  offset: z.number().min(0).default(0),
  hashtag: z.string().optional(),
  location: z.string().optional(),
  mediaType: z.enum(['all', 'image', 'video', 'text']).default('all'),
});

// =============================================================================
// POST MANAGEMENT
// =============================================================================

/**
 * POST /api/social/posts
 * Create a new post
 */
router.post("/posts", authenticateToken, postLimiter, upload.array('media', 10), async (req, res, next) => {
  try {
    const userId = req.user!.userId;
    const files = req.files as Express.Multer.File[];
    const postData = createPostSchema.parse(JSON.parse(req.body.metadata || '{}'));

    // Upload media files
    const mediaUrls: string[] = [];
    if (files && files.length > 0) {
      for (const file of files) {
        let url: string;
        if (file.mimetype.startsWith('image/')) {
          url = await fileService.uploadImage(file.buffer, {
            userId,
            originalName: file.originalname,
            mimeType: file.mimetype,
          });
        } else if (file.mimetype.startsWith('video/')) {
          url = await fileService.uploadVideo(file.buffer, {
            userId,
            originalName: file.originalname,
            mimeType: file.mimetype,
            size: file.size,
          });
        } else {
          continue; // Skip unsupported files
        }
        mediaUrls.push(url);
      }
    }

    // Extract hashtags and mentions from content
    const extractedHashtags = postData.content ? 
      Array.from(postData.content.matchAll(/#(\w+)/g)).map(match => match[1].toLowerCase()) : [];
    const extractedMentions = postData.content ?
      Array.from(postData.content.matchAll(/@(\w+)/g)).map(match => match[1].toLowerCase()) : [];

    const allHashtags = [...(postData.hashtags || []), ...extractedHashtags];
    const allMentions = [...(postData.mentions || []), ...extractedMentions];

    const [post] = await db.transaction(async (tx) => {
      // Create post
      const [newPost] = await tx
        .insert(posts)
        .values({
          userId,
          content: postData.content,
          mediaUrls,
          type: postData.type,
          visibility: postData.visibility,
          allowComments: postData.allowComments,
          allowShares: postData.allowShares,
          location: postData.location,
          hashtags: allHashtags,
          mentions: allMentions,
          scheduledAt: postData.scheduledAt ? new Date(postData.scheduledAt) : null,
          isPromoted: postData.isPromoted,
          status: postData.scheduledAt ? 'scheduled' : 'published',
        })
        .returning();

      // Create poll if included
      if (postData.poll) {
        await tx.insert(polls).values({
          postId: newPost.id,
          question: postData.poll.question,
          options: postData.poll.options,
          endDate: new Date(Date.now() + postData.poll.duration * 60 * 60 * 1000),
          allowMultipleAnswers: postData.poll.allowMultipleAnswers,
        });
      }

      // Initialize post analytics
      await tx.insert(postAnalytics).values({
        postId: newPost.id,
        views: 0,
        uniqueViews: 0,
        likes: 0,
        comments: 0,
        shares: 0,
        saves: 0,
        clickThroughs: 0,
        engagementRate: 0,
      });

      // Process hashtags
      for (const hashtag of allHashtags) {
        // Upsert hashtag
        await tx.insert(hashtags).values({
          name: hashtag,
          postCount: 1,
        }).onConflictDoUpdate({
          target: hashtags.name,
          set: {
            postCount: sql`${hashtags.postCount} + 1`,
            updatedAt: new Date(),
          },
        });
      }

      // Process mentions and create notifications
      for (const mentionUsername of allMentions) {
        const [mentionedUser] = await tx
          .select()
          .from(profiles)
          .where(eq(profiles.username, mentionUsername))
          .limit(1);

        if (mentionedUser) {
          await tx.insert(mentions).values({
            postId: newPost.id,
            mentionedUserId: mentionedUser.userId,
            mentionedByUserId: userId,
          });

          // Create notification
          await tx.insert(notifications).values({
            userId: mentionedUser.userId,
            type: 'mention',
            title: 'You were mentioned in a post',
            message: `@${req.user?.username || 'someone'} mentioned you in a post`,
            data: {
              postId: newPost.id,
              mentionedBy: userId,
            },
            actionUrl: `/app/posts/${newPost.id}`,
          });
        }
      }

      // Log activity
      await tx.insert(activityLogs).values({
        userId,
        actionType: 'post_created',
        targetId: newPost.id,
        targetType: 'post',
        metadata: {
          type: postData.type,
          hasMedia: mediaUrls.length > 0,
          hashtagCount: allHashtags.length,
          mentionCount: allMentions.length,
        },
      });

      return [newPost];
    });

    res.status(201).json({
      success: true,
      post: {
        id: post.id,
        content: post.content,
        mediaUrls: post.mediaUrls,
        type: post.type,
        visibility: post.visibility,
        createdAt: post.createdAt,
        status: post.status,
      },
      message: "Post created successfully",
    });
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/social/feed
 * Get personalized social media feed
 */
router.get("/feed", authenticateToken, apiLimiter, async (req, res, next) => {
  try {
    const userId = req.user!.userId;
    const query = feedQuerySchema.parse(req.query);

    let baseQuery = db
      .select({
        id: posts.id,
        content: posts.content,
        mediaUrls: posts.mediaUrls,
        type: posts.type,
        visibility: posts.visibility,
        location: posts.location,
        hashtags: posts.hashtags,
        mentions: posts.mentions,
        createdAt: posts.createdAt,
        updatedAt: posts.updatedAt,
        // Analytics
        views: postAnalytics.views,
        likes: postAnalytics.likes,
        comments: postAnalytics.comments,
        shares: postAnalytics.shares,
        saves: postAnalytics.saves,
        engagementRate: postAnalytics.engagementRate,
        // Author info
        author: {
          id: profiles.userId,
          username: profiles.username,
          fullName: profiles.fullName,
          avatar: profiles.avatar,
          isVerified: profiles.isVerified,
          followerCount: profiles.followerCount,
        },
      })
      .from(posts)
      .innerJoin(profiles, eq(profiles.userId, posts.userId))
      .leftJoin(postAnalytics, eq(postAnalytics.postId, posts.id))
      .where(
        and(
          eq(posts.status, 'published'),
          eq(posts.isDeleted, false),
          or(
            eq(posts.visibility, 'public'),
            and(
              eq(posts.visibility, 'followers'),
              exists(
                db.select().from(userFollows).where(
                  and(
                    eq(userFollows.followerId, userId),
                    eq(userFollows.followingId, posts.userId),
                    eq(userFollows.isActive, true)
                  )
                )
              )
            ),
            eq(posts.userId, userId) // User's own posts
          ),
          // Exclude blocked users
          not(exists(
            db.select().from(userBlocks).where(
              and(
                eq(userBlocks.blockerId, userId),
                eq(userBlocks.blockedUserId, posts.userId),
                eq(userBlocks.isActive, true)
              )
            )
          ))
        )
      );

    // Apply feed type filters
    switch (query.type) {
      case 'following':
        baseQuery = baseQuery.where(
          exists(
            db.select().from(userFollows).where(
              and(
                eq(userFollows.followerId, userId),
                eq(userFollows.followingId, posts.userId),
                eq(userFollows.isActive, true)
              )
            )
          )
        );
        break;
        
      case 'trending':
        baseQuery = baseQuery.where(
          and(
            gte(posts.createdAt, sql`NOW() - INTERVAL '24 hours'`),
            gte(postAnalytics.engagementRate, 5)
          )
        );
        break;
        
      case 'explore':
        // Show posts from users not followed
        baseQuery = baseQuery.where(
          and(
            not(exists(
              db.select().from(userFollows).where(
                and(
                  eq(userFollows.followerId, userId),
                  eq(userFollows.followingId, posts.userId),
                  eq(userFollows.isActive, true)
                )
              )
            )),
            not(eq(posts.userId, userId))
          )
        );
        break;
    }

    // Apply additional filters
    if (query.hashtag) {
      baseQuery = baseQuery.where(
        sql`${query.hashtag} = ANY(${posts.hashtags})`
      );
    }

    if (query.location) {
      baseQuery = baseQuery.where(like(posts.location, `%${query.location}%`));
    }

    if (query.mediaType !== 'all') {
      if (query.mediaType === 'text') {
        baseQuery = baseQuery.where(eq(posts.type, 'text'));
      } else {
        baseQuery = baseQuery.where(eq(posts.type, query.mediaType));
      }
    }

    // Apply ordering based on feed type
    switch (query.type) {
      case 'trending':
        baseQuery = baseQuery.orderBy(
          desc(postAnalytics.engagementRate),
          desc(posts.createdAt)
        );
        break;
      case 'following':
        baseQuery = baseQuery.orderBy(desc(posts.createdAt));
        break;
      default:
        // Personalized algorithm mixing recency and engagement
        baseQuery = baseQuery.orderBy(
          desc(sql`(
            ${postAnalytics.engagementRate} * 0.6 + 
            EXTRACT(EPOCH FROM (NOW() - ${posts.createdAt})) / -3600 * 0.4
          )`),
          desc(posts.createdAt)
        );
    }

    const feedPosts = await baseQuery
      .limit(query.limit)
      .offset(query.offset);

    // Get user interactions for these posts
    const postIds = feedPosts.map(p => p.id);
    const userInteractions = postIds.length > 0 ? await db
      .select({
        postId: postLikes.postId,
        hasLiked: sql<boolean>`true`,
      })
      .from(postLikes)
      .where(
        and(
          eq(postLikes.userId, userId),
          inArray(postLikes.postId, postIds)
        )
      ) : [];

    const userSaves = postIds.length > 0 ? await db
      .select({
        postId: postBookmarks.postId,
        hasSaved: sql<boolean>`true`,
      })
      .from(postBookmarks)
      .where(
        and(
          eq(postBookmarks.userId, userId),
          inArray(postBookmarks.postId, postIds)
        )
      ) : [];

    const likedPostIds = new Set(userInteractions.map(i => i.postId));
    const savedPostIds = new Set(userSaves.map(s => s.postId));

    // Format response with user interactions
    const formattedPosts = feedPosts.map(post => ({
      ...post,
      hasLiked: likedPostIds.has(post.id),
      hasSaved: savedPostIds.has(post.id),
      hasFollowed: false, // Would check userFollows table
    }));

    res.json({
      success: true,
      posts: formattedPosts,
      pagination: {
        limit: query.limit,
        offset: query.offset,
        hasMore: feedPosts.length === query.limit,
      },
      algorithm: query.type,
    });
  } catch (error) {
    next(error);
  }
});

/**
 * POST /api/social/posts/:postId/like
 * Like/unlike a post
 */
router.post("/posts/:postId/like", authenticateToken, interactionLimiter, async (req, res, next) => {
  try {
    const userId = req.user!.userId;
    const { postId } = req.params;

    // Check if post exists
    const [post] = await db
      .select()
      .from(posts)
      .where(eq(posts.id, postId))
      .limit(1);

    if (!post) {
      throw new AppError("Post not found", 404);
    }

    // Check if already liked
    const [existingLike] = await db
      .select()
      .from(postLikes)
      .where(and(eq(postLikes.postId, postId), eq(postLikes.userId, userId)))
      .limit(1);

    let isLiked: boolean;

    await db.transaction(async (tx) => {
      if (existingLike) {
        // Unlike
        await tx
          .delete(postLikes)
          .where(and(eq(postLikes.postId, postId), eq(postLikes.userId, userId)));

        await tx
          .update(postAnalytics)
          .set({
            likes: sql`likes - 1`,
            engagementRate: sql`
              (likes - 1 + comments + shares + saves) * 100.0 / GREATEST(views, 1)
            `,
            updatedAt: new Date(),
          })
          .where(eq(postAnalytics.postId, postId));

        isLiked = false;
      } else {
        // Like
        await tx.insert(postLikes).values({
          postId,
          userId,
        });

        await tx
          .update(postAnalytics)
          .set({
            likes: sql`likes + 1`,
            engagementRate: sql`
              (likes + 1 + comments + shares + saves) * 100.0 / GREATEST(views, 1)
            `,
            updatedAt: new Date(),
          })
          .where(eq(postAnalytics.postId, postId));

        // Award creator engagement points
        if (post.userId !== userId) {
          await tx.insert(creatorEarnings).values({
            userId: post.userId,
            sourceType: 'engagement',
            contentId: postId,
            contentType: 'post',
            amount: '0',
            currency: 'SOFT_POINTS',
            softPointsEarned: '2',
            fromUserId: userId,
            description: `Like on post ${postId}`,
          });

          // Create notification
          await tx.insert(notifications).values({
            userId: post.userId,
            type: 'like',
            title: 'New like on your post',
            message: `Someone liked your post`,
            data: {
              postId,
              likedBy: userId,
            },
            actionUrl: `/app/posts/${postId}`,
          });
        }

        isLiked = true;
      }

      // Log activity
      await tx.insert(activityLogs).values({
        userId,
        actionType: isLiked ? 'post_liked' : 'post_unliked',
        targetId: postId,
        targetType: 'post',
        metadata: {
          postAuthor: post.userId,
        },
      });
    });

    res.json({
      success: true,
      isLiked,
      message: isLiked ? "Post liked" : "Post unliked",
    });
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/social/posts/:postId/comments
 * Get post comments
 */
router.get("/posts/:postId/comments", authenticateToken, async (req, res, next) => {
  try {
    const { postId } = req.params;
    const { limit = 20, offset = 0, sortBy = 'recent' } = req.query;

    let orderBy;
    switch (sortBy) {
      case 'popular':
        orderBy = [desc(postComments.likesCount), desc(postComments.createdAt)];
        break;
      case 'oldest':
        orderBy = [asc(postComments.createdAt)];
        break;
      default:
        orderBy = [desc(postComments.createdAt)];
    }

    const comments = await db
      .select({
        id: postComments.id,
        content: postComments.content,
        likesCount: postComments.likesCount,
        repliesCount: postComments.repliesCount,
        createdAt: postComments.createdAt,
        parentCommentId: postComments.parentCommentId,
        author: {
          id: profiles.userId,
          username: profiles.username,
          fullName: profiles.fullName,
          avatar: profiles.avatar,
          isVerified: profiles.isVerified,
        },
      })
      .from(postComments)
      .innerJoin(profiles, eq(profiles.userId, postComments.userId))
      .where(eq(postComments.postId, postId))
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
 * POST /api/social/posts/:postId/comments
 * Add comment to post
 */
router.post("/posts/:postId/comments", authenticateToken, commentLimiter, async (req, res, next) => {
  try {
    const userId = req.user!.userId;
    const { postId } = req.params;
    const { content, parentCommentId } = req.body;

    if (!content || content.trim().length === 0) {
      throw new AppError("Comment content is required", 400);
    }

    if (content.length > 500) {
      throw new AppError("Comment too long", 400);
    }

    // Check if post exists and allows comments
    const [post] = await db
      .select()
      .from(posts)
      .where(eq(posts.id, postId))
      .limit(1);

    if (!post) {
      throw new AppError("Post not found", 404);
    }

    if (!post.allowComments) {
      throw new AppError("Comments are disabled for this post", 403);
    }

    const [comment] = await db.transaction(async (tx) => {
      // Insert comment
      const [newComment] = await tx
        .insert(postComments)
        .values({
          postId,
          userId,
          content: content.trim(),
          parentCommentId,
        })
        .returning();

      // Update parent comment replies count if this is a reply
      if (parentCommentId) {
        await tx
          .update(postComments)
          .set({
            repliesCount: sql`replies_count + 1`,
          })
          .where(eq(postComments.id, parentCommentId));
      }

      // Update post analytics
      await tx
        .update(postAnalytics)
        .set({
          comments: sql`comments + 1`,
          engagementRate: sql`
            (likes + comments + 1 + shares + saves) * 100.0 / GREATEST(views, 1)
          `,
          updatedAt: new Date(),
        })
        .where(eq(postAnalytics.postId, postId));

      // Award creator engagement points
      if (post.userId !== userId) {
        await tx.insert(creatorEarnings).values({
          userId: post.userId,
          sourceType: 'engagement',
          contentId: postId,
          contentType: 'post',
          amount: '0',
          currency: 'SOFT_POINTS',
          softPointsEarned: '3',
          fromUserId: userId,
          description: `Comment on post ${postId}`,
        });

        // Create notification
        await tx.insert(notifications).values({
          userId: post.userId,
          type: 'comment',
          title: 'New comment on your post',
          message: `Someone commented on your post`,
          data: {
            postId,
            commentId: newComment.id,
            commentedBy: userId,
          },
          actionUrl: `/app/posts/${postId}#comment-${newComment.id}`,
        });
      }

      // Log activity
      await tx.insert(activityLogs).values({
        userId,
        actionType: 'comment_created',
        targetId: postId,
        targetType: 'post',
        metadata: {
          commentId: newComment.id,
          postAuthor: post.userId,
          isReply: !!parentCommentId,
        },
      });

      return [newComment];
    });

    // Get comment with author info
    const [commentWithAuthor] = await db
      .select({
        id: postComments.id,
        content: postComments.content,
        likesCount: postComments.likesCount,
        repliesCount: postComments.repliesCount,
        createdAt: postComments.createdAt,
        author: {
          id: profiles.userId,
          username: profiles.username,
          fullName: profiles.fullName,
          avatar: profiles.avatar,
          isVerified: profiles.isVerified,
        },
      })
      .from(postComments)
      .innerJoin(profiles, eq(profiles.userId, postComments.userId))
      .where(eq(postComments.id, comment.id))
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

// =============================================================================
// STORIES MANAGEMENT
// =============================================================================

/**
 * POST /api/social/stories
 * Create a new story
 */
router.post("/stories", authenticateToken, postLimiter, upload.single('media'), async (req, res, next) => {
  try {
    const userId = req.user!.userId;
    const file = req.file;
    const storyData = createStorySchema.parse(JSON.parse(req.body.metadata || '{}'));

    if (!file) {
      throw new AppError("Media file is required for stories", 400);
    }

    // Upload media
    let mediaUrl: string;
    if (file.mimetype.startsWith('image/')) {
      mediaUrl = await fileService.uploadImage(file.buffer, {
        userId,
        originalName: file.originalname,
        mimeType: file.mimetype,
      });
    } else {
      mediaUrl = await fileService.uploadVideo(file.buffer, {
        userId,
        originalName: file.originalname,
        mimeType: file.mimetype,
        size: file.size,
      });
    }

    const [story] = await db.transaction(async (tx) => {
      // Create story
      const [newStory] = await tx
        .insert(stories)
        .values({
          userId,
          content: storyData.content,
          mediaUrl,
          mediaType: storyData.mediaType,
          duration: storyData.duration,
          backgroundColor: storyData.backgroundColor,
          textOverlay: storyData.textOverlay,
          stickers: storyData.stickers,
          music: storyData.music,
          viewersList: storyData.viewersList,
          expiresAt: new Date(Date.now() + storyData.duration * 60 * 60 * 1000),
        })
        .returning();

      // Log activity
      await tx.insert(activityLogs).values({
        userId,
        actionType: 'story_created',
        targetId: newStory.id,
        targetType: 'story',
        metadata: {
          mediaType: storyData.mediaType,
          duration: storyData.duration,
          hasTextOverlay: !!storyData.textOverlay,
          hasStickers: !!storyData.stickers?.length,
          hasMusic: !!storyData.music,
        },
      });

      return [newStory];
    });

    res.status(201).json({
      success: true,
      story: {
        id: story.id,
        mediaUrl: story.mediaUrl,
        mediaType: story.mediaType,
        expiresAt: story.expiresAt,
        createdAt: story.createdAt,
      },
      message: "Story created successfully",
    });
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/social/stories
 * Get stories feed
 */
router.get("/stories", authenticateToken, async (req, res, next) => {
  try {
    const userId = req.user!.userId;
    const { limit = 20 } = req.query;

    const storiesQuery = await db
      .select({
        id: stories.id,
        content: stories.content,
        mediaUrl: stories.mediaUrl,
        mediaType: stories.mediaType,
        createdAt: stories.createdAt,
        expiresAt: stories.expiresAt,
        viewCount: sql<number>`(SELECT COUNT(*) FROM story_views WHERE story_id = ${stories.id})`,
        author: {
          id: profiles.userId,
          username: profiles.username,
          fullName: profiles.fullName,
          avatar: profiles.avatar,
          isVerified: profiles.isVerified,
        },
      })
      .from(stories)
      .innerJoin(profiles, eq(profiles.userId, stories.userId))
      .where(
        and(
          gt(stories.expiresAt, new Date()),
          eq(stories.isDeleted, false),
          or(
            eq(stories.viewersList, 'everyone'),
            and(
              eq(stories.viewersList, 'followers'),
              exists(
                db.select().from(userFollows).where(
                  and(
                    eq(userFollows.followerId, userId),
                    eq(userFollows.followingId, stories.userId),
                    eq(userFollows.isActive, true)
                  )
                )
              )
            ),
            eq(stories.userId, userId)
          )
        )
      )
      .orderBy(desc(stories.createdAt))
      .limit(parseInt(limit as string));

    // Group stories by user
    const storiesByUser = storiesQuery.reduce((acc, story) => {
      const userId = story.author.id;
      if (!acc[userId]) {
        acc[userId] = {
          user: story.author,
          stories: [],
        };
      }
      acc[userId].stories.push({
        id: story.id,
        content: story.content,
        mediaUrl: story.mediaUrl,
        mediaType: story.mediaType,
        createdAt: story.createdAt,
        expiresAt: story.expiresAt,
        viewCount: story.viewCount,
      });
      return acc;
    }, {} as Record<string, any>);

    res.json({
      success: true,
      stories: Object.values(storiesByUser),
    });
  } catch (error) {
    next(error);
  }
});

/**
 * POST /api/social/stories/:storyId/view
 * Record story view
 */
router.post("/stories/:storyId/view", authenticateToken, async (req, res, next) => {
  try {
    const userId = req.user!.userId;
    const { storyId } = req.params;

    // Check if story exists and is not expired
    const [story] = await db
      .select()
      .from(stories)
      .where(
        and(
          eq(stories.id, storyId),
          gt(stories.expiresAt, new Date())
        )
      )
      .limit(1);

    if (!story) {
      throw new AppError("Story not found or expired", 404);
    }

    // Check if already viewed by this user
    const [existingView] = await db
      .select()
      .from(storyViews)
      .where(
        and(
          eq(storyViews.storyId, storyId),
          eq(storyViews.userId, userId)
        )
      )
      .limit(1);

    if (!existingView) {
      await db.insert(storyViews).values({
        storyId,
        userId,
        viewedAt: new Date(),
      });

      // Award creator view points
      if (story.userId !== userId) {
        await db.insert(creatorEarnings).values({
          userId: story.userId,
          sourceType: 'views',
          contentId: storyId,
          contentType: 'story',
          amount: '0',
          currency: 'SOFT_POINTS',
          softPointsEarned: '1',
          fromUserId: userId,
          description: `Story view ${storyId}`,
        });
      }
    }

    res.json({
      success: true,
      message: "Story view recorded",
    });
  } catch (error) {
    next(error);
  }
});

export default router;
