import express from 'express';
import multer from 'multer';
import { z } from 'zod';
import { db } from '../db.js';
import { posts, users, profiles } from '../../shared/schema.js';
import { eq, and } from 'drizzle-orm';
import { authenticateToken as authMiddleware } from '../middleware/auth.js';
import { fileService } from '../services/fileService.js';

const router = express.Router();

// Multer configuration for video uploads
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 100 * 1024 * 1024, // 100MB limit
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('video/') || file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only video and image files are allowed'));
    }
  },
});

// Validation schemas
const createDuetSchema = z.object({
  originalPostId: z.string().uuid(),
  duetStyle: z.enum(['side-by-side', 'react-respond', 'picture-in-picture']),
  audioSource: z.enum(['original', 'both', 'voiceover']),
  caption: z.string().max(500),
  tags: z.array(z.string()).optional(),
});

const getDuetDataSchema = z.object({
  postId: z.string().uuid(),
});

/**
 * GET /api/duets/original/:postId
 * Get original video data for duet creation
 */
router.get('/original/:postId', authMiddleware, async (req, res) => {
  try {
    const { postId } = getDuetDataSchema.parse({ postId: req.params.postId });

    // Get original post data
    const originalPost = await db
      .select({
        id: posts.id,
        videoUrl: posts.videoUrl,
        content: posts.content,
        userId: posts.userId,
        createdAt: posts.createdAt,
        isDuet: posts.isDuet,
        duetOfPostId: posts.duetOfPostId,
        originalCreatorId: posts.originalCreatorId,
        originalCreatorUsername: posts.originalCreatorUsername,
      })
      .from(posts)
      .where(eq(posts.id, postId))
      .limit(1);

    if (!originalPost.length) {
      return res.status(404).json({ error: 'Original post not found' });
    }

    const post = originalPost[0];

    if (!post.videoUrl) {
      return res.status(400).json({ error: 'Original post does not contain a video' });
    }

    // Get creator profile
    const creatorProfile = await db
      .select({
        username: profiles.username,
        fullName: profiles.fullName,
        avatar: profiles.avatar,
        isVerified: profiles.isVerified,
      })
      .from(profiles)
      .where(eq(profiles.userId, post.userId))
      .limit(1);

    const creator = creatorProfile[0];

    // Return video data for duet creation
    res.json({
      success: true,
      data: {
        originalPost: {
          id: post.id,
          videoUrl: post.videoUrl,
          content: post.content,
          createdAt: post.createdAt,
          isDuet: post.isDuet,
          duetOfPostId: post.duetOfPostId,
          originalCreatorId: post.originalCreatorId,
          originalCreatorUsername: post.originalCreatorUsername,
        },
        creator: {
          id: post.userId,
          username: creator?.username || 'unknown',
          fullName: creator?.fullName || 'Unknown User',
          avatar: creator?.avatar,
          isVerified: creator?.isVerified || false,
        },
      },
    });
  } catch (error) {
    console.error('Error fetching original video data:', error);
    res.status(500).json({ error: 'Failed to fetch original video data' });
  }
});

/**
 * POST /api/duets/create
 * Create a new duet video
 */
router.post('/create', authMiddleware, upload.fields([
  { name: 'duetVideo', maxCount: 1 },
  { name: 'thumbnail', maxCount: 1 }
]), async (req, res) => {
  try {
    const userId = req.user!.id;
    const files = req.files as { [fieldname: string]: Express.Multer.File[] };
    
    // Validate request body
    const {
      originalPostId,
      duetStyle,
      audioSource,
      caption,
      tags = [],
    } = createDuetSchema.parse(req.body);

    // Check if files are uploaded
    if (!files.duetVideo || !files.duetVideo[0]) {
      return res.status(400).json({ error: 'Duet video file is required' });
    }

    const duetVideoFile = files.duetVideo[0];
    const thumbnailFile = files.thumbnail?.[0];

    // Get original post
    const originalPost = await db
      .select({
        id: posts.id,
        userId: posts.userId,
        videoUrl: posts.videoUrl,
        content: posts.content,
        isDuet: posts.isDuet,
        originalCreatorId: posts.originalCreatorId,
        originalCreatorUsername: posts.originalCreatorUsername,
      })
      .from(posts)
      .where(eq(posts.id, originalPostId))
      .limit(1);

    if (!originalPost.length) {
      return res.status(404).json({ error: 'Original post not found' });
    }

    const original = originalPost[0];

    // Get original creator info
    const originalCreatorProfile = await db
      .select({
        username: profiles.username,
        fullName: profiles.fullName,
      })
      .from(profiles)
      .where(eq(profiles.userId, original.userId))
      .limit(1);

    const originalCreator = originalCreatorProfile[0];

    // Upload duet video to storage
    const duetVideoUrl = await fileService.uploadFile({
      buffer: duetVideoFile.buffer,
      mimetype: duetVideoFile.mimetype,
      originalname: duetVideoFile.originalname,
      folder: 'duets',
    });

    // Upload thumbnail if provided
    let thumbnailUrl = null;
    if (thumbnailFile) {
      thumbnailUrl = await fileService.uploadFile({
        buffer: thumbnailFile.buffer,
        mimetype: thumbnailFile.mimetype,
        originalname: thumbnailFile.originalname,
        folder: 'thumbnails',
      });
    }

    // Determine the root original creator for duet chains
    const rootOriginalCreatorId = original.isDuet && original.originalCreatorId 
      ? original.originalCreatorId 
      : original.userId;
    
    const rootOriginalCreatorUsername = original.isDuet && original.originalCreatorUsername
      ? original.originalCreatorUsername
      : originalCreator?.username || 'unknown';

    // Create duet post
    const newDuetPost = await db
      .insert(posts)
      .values({
        userId,
        content: caption,
        videoUrl: duetVideoUrl,
        imageUrl: thumbnailUrl,
        type: 'video',
        tags: tags.length > 0 ? tags : null,
        isDuet: true,
        duetOfPostId: originalPostId,
        originalCreatorId: rootOriginalCreatorId,
        originalCreatorUsername: rootOriginalCreatorUsername,
        duetStyle,
        audioSource,
        duetVideoUrl: duetVideoUrl,
        originalVideoUrl: original.videoUrl,
        softpoints: 0,
      })
      .returning({
        id: posts.id,
        userId: posts.userId,
        content: posts.content,
        videoUrl: posts.videoUrl,
        imageUrl: posts.imageUrl,
        isDuet: posts.isDuet,
        duetOfPostId: posts.duetOfPostId,
        originalCreatorId: posts.originalCreatorId,
        originalCreatorUsername: posts.originalCreatorUsername,
        duetStyle: posts.duetStyle,
        audioSource: posts.audioSource,
        createdAt: posts.createdAt,
      });

    const duetPost = newDuetPost[0];

    // Get current user profile for response
    const userProfile = await db
      .select({
        username: profiles.username,
        fullName: profiles.fullName,
        avatar: profiles.avatar,
        isVerified: profiles.isVerified,
      })
      .from(profiles)
      .where(eq(profiles.userId, userId))
      .limit(1);

    const user = userProfile[0];

    res.status(201).json({
      success: true,
      data: {
        duetPost: {
          ...duetPost,
          creator: {
            id: userId,
            username: user?.username || 'unknown',
            fullName: user?.fullName || 'Unknown User',
            avatar: user?.avatar,
            isVerified: user?.isVerified || false,
          },
        },
        message: 'Duet created successfully!',
      },
    });

  } catch (error) {
    console.error('Error creating duet:', error);
    
    if (error instanceof z.ZodError) {
      return res.status(400).json({ 
        error: 'Invalid request data',
        details: error.errors,
      });
    }

    res.status(500).json({ error: 'Failed to create duet' });
  }
});

/**
 * GET /api/duets/chain/:postId
 * Get duet chain for a post (all duets of a video)
 */
router.get('/chain/:postId', async (req, res) => {
  try {
    const { postId } = getDuetDataSchema.parse({ postId: req.params.postId });

    // Get all duets of this post
    const duets = await db
      .select({
        id: posts.id,
        userId: posts.userId,
        content: posts.content,
        videoUrl: posts.videoUrl,
        imageUrl: posts.imageUrl,
        duetStyle: posts.duetStyle,
        audioSource: posts.audioSource,
        createdAt: posts.createdAt,
        username: profiles.username,
        fullName: profiles.fullName,
        avatar: profiles.avatar,
        isVerified: profiles.isVerified,
      })
      .from(posts)
      .leftJoin(profiles, eq(posts.userId, profiles.userId))
      .where(eq(posts.duetOfPostId, postId))
      .orderBy(posts.createdAt);

    // Also find if this post is a duet itself
    const originalPost = await db
      .select({
        id: posts.id,
        isDuet: posts.isDuet,
        duetOfPostId: posts.duetOfPostId,
        originalCreatorId: posts.originalCreatorId,
        originalCreatorUsername: posts.originalCreatorUsername,
      })
      .from(posts)
      .where(eq(posts.id, postId))
      .limit(1);

    let rootPostId = postId;
    if (originalPost.length && originalPost[0].isDuet && originalPost[0].duetOfPostId) {
      rootPostId = originalPost[0].duetOfPostId;
    }

    res.json({
      success: true,
      data: {
        rootPostId,
        duetCount: duets.length,
        duets: duets.map(duet => ({
          id: duet.id,
          content: duet.content,
          videoUrl: duet.videoUrl,
          thumbnailUrl: duet.imageUrl,
          duetStyle: duet.duetStyle,
          audioSource: duet.audioSource,
          createdAt: duet.createdAt,
          creator: {
            id: duet.userId,
            username: duet.username || 'unknown',
            fullName: duet.fullName || 'Unknown User',
            avatar: duet.avatar,
            isVerified: duet.isVerified || false,
          },
        })),
      },
    });

  } catch (error) {
    console.error('Error fetching duet chain:', error);
    res.status(500).json({ error: 'Failed to fetch duet chain' });
  }
});

/**
 * GET /api/duets/user/:userId
 * Get all duets created by a specific user
 */
router.get('/user/:userId', async (req, res) => {
  try {
    const { userId } = req.params;

    // Get user's duets
    const userDuets = await db
      .select({
        id: posts.id,
        content: posts.content,
        videoUrl: posts.videoUrl,
        imageUrl: posts.imageUrl,
        duetOfPostId: posts.duetOfPostId,
        originalCreatorUsername: posts.originalCreatorUsername,
        duetStyle: posts.duetStyle,
        audioSource: posts.audioSource,
        createdAt: posts.createdAt,
      })
      .from(posts)
      .where(and(eq(posts.userId, userId), eq(posts.isDuet, true)))
      .orderBy(posts.createdAt);

    res.json({
      success: true,
      data: {
        duetCount: userDuets.length,
        duets: userDuets,
      },
    });

  } catch (error) {
    console.error('Error fetching user duets:', error);
    res.status(500).json({ error: 'Failed to fetch user duets' });
  }
});

/**
 * DELETE /api/duets/:postId
 * Delete a duet post
 */
router.delete('/:postId', authMiddleware, async (req, res) => {
  try {
    const userId = req.user!.id;
    const { postId } = req.params;

    // Check if post exists and belongs to user
    const post = await db
      .select({
        id: posts.id,
        userId: posts.userId,
        isDuet: posts.isDuet,
        videoUrl: posts.videoUrl,
        imageUrl: posts.imageUrl,
      })
      .from(posts)
      .where(and(eq(posts.id, postId), eq(posts.userId, userId), eq(posts.isDuet, true)))
      .limit(1);

    if (!post.length) {
      return res.status(404).json({ error: 'Duet post not found or not owned by user' });
    }

    const duetPost = post[0];

    // Delete files from storage
    if (duetPost.videoUrl) {
      await fileService.deleteFile(duetPost.videoUrl);
    }
    if (duetPost.imageUrl) {
      await fileService.deleteFile(duetPost.imageUrl);
    }

    // Delete post from database
    await db.delete(posts).where(eq(posts.id, postId));

    res.json({
      success: true,
      message: 'Duet deleted successfully',
    });

  } catch (error) {
    console.error('Error deleting duet:', error);
    res.status(500).json({ error: 'Failed to delete duet' });
  }
});

/**
 * GET /api/duets/stats/:postId
 * Get duet statistics for a post
 */
router.get('/stats/:postId', async (req, res) => {
  try {
    const { postId } = req.params;

    // Count total duets
    const duetCount = await db
      .select({ count: posts.id })
      .from(posts)
      .where(eq(posts.duetOfPostId, postId));

    // Count by duet style
    const styleStats = await db
      .select({
        style: posts.duetStyle,
        count: posts.id,
      })
      .from(posts)
      .where(eq(posts.duetOfPostId, postId))
      .groupBy(posts.duetStyle);

    // Count by audio source
    const audioStats = await db
      .select({
        audioSource: posts.audioSource,
        count: posts.id,
      })
      .from(posts)
      .where(eq(posts.duetOfPostId, postId))
      .groupBy(posts.audioSource);

    res.json({
      success: true,
      data: {
        totalDuets: duetCount.length,
        styleBreakdown: styleStats.reduce((acc: any, stat) => {
          acc[stat.style || 'unknown'] = stat.count;
          return acc;
        }, {}),
        audioBreakdown: audioStats.reduce((acc: any, stat) => {
          acc[stat.audioSource || 'unknown'] = stat.count;
          return acc;
        }, {}),
      },
    });

  } catch (error) {
    console.error('Error fetching duet stats:', error);
    res.status(500).json({ error: 'Failed to fetch duet statistics' });
  }
});

export default router;
