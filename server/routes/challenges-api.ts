import express from 'express';
import { eq, desc, asc, and, sql } from 'drizzle-orm';
import { db } from '../db.js';
import { duetChallenges, challengeSubmissions, creatorTiers } from '../../shared/engagement-schema.js';
import { posts, users } from '../../shared/schema.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Get all challenges with filtering and sorting
router.get('/challenges', async (req, res) => {
  try {
    const { 
      status, 
      featured, 
      sponsored, 
      sortBy = 'recent', 
      limit = 20, 
      offset = 0,
      search 
    } = req.query;

    let query = db
      .select({
        id: duetChallenges.id,
        title: duetChallenges.title,
        description: duetChallenges.description,
        hashtag: duetChallenges.hashtag,
        originalPostId: duetChallenges.originalPostId,
        createdBy: {
          id: users.id,
          username: users.username,
          displayName: users.displayName,
          avatar: users.avatar,
          verified: users.verified,
        },
        startDate: duetChallenges.startDate,
        endDate: duetChallenges.endDate,
        status: duetChallenges.status,
        isSponsored: duetChallenges.isSponsored,
        isFeatured: duetChallenges.isFeatured,
        firstPrize: duetChallenges.firstPrize,
        secondPrize: duetChallenges.secondPrize,
        thirdPrize: duetChallenges.thirdPrize,
        participationReward: duetChallenges.participationReward,
        totalSubmissions: duetChallenges.totalSubmissions,
        totalViews: duetChallenges.totalViews,
        totalLikes: duetChallenges.totalLikes,
        bannerUrl: duetChallenges.bannerUrl,
        rules: duetChallenges.rules,
        tags: duetChallenges.tags,
        createdAt: duetChallenges.createdAt,
        updatedAt: duetChallenges.updatedAt,
      })
      .from(duetChallenges)
      .leftJoin(users, eq(duetChallenges.createdBy, users.id));

    // Apply filters
    const conditions = [];
    
    if (status) {
      conditions.push(eq(duetChallenges.status, status as string));
    }
    
    if (featured === 'true') {
      conditions.push(eq(duetChallenges.isFeatured, true));
    }
    
    if (sponsored === 'true') {
      conditions.push(eq(duetChallenges.isSponsored, true));
    }

    if (search) {
      conditions.push(
        sql`(${duetChallenges.title} ILIKE ${'%' + search + '%'} OR 
             ${duetChallenges.description} ILIKE ${'%' + search + '%'} OR 
             ${duetChallenges.hashtag} ILIKE ${'%' + search + '%'})`
      );
    }

    if (conditions.length > 0) {
      query = query.where(and(...conditions));
    }

    // Apply sorting
    switch (sortBy) {
      case 'popularity':
        query = query.orderBy(desc(duetChallenges.totalSubmissions));
        break;
      case 'prize':
        query = query.orderBy(desc(duetChallenges.firstPrize));
        break;
      case 'ending':
        query = query.orderBy(asc(duetChallenges.endDate));
        break;
      case 'recent':
      default:
        query = query.orderBy(desc(duetChallenges.createdAt));
        break;
    }

    const challenges = await query
      .limit(parseInt(limit as string))
      .offset(parseInt(offset as string));

    res.json({
      success: true,
      data: challenges,
      pagination: {
        limit: parseInt(limit as string),
        offset: parseInt(offset as string),
        total: challenges.length // You might want to do a separate count query
      }
    });
  } catch (error) {
    console.error('Error fetching challenges:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch challenges'
    });
  }
});

// Get challenge by ID with submissions
router.get('/challenges/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const challenge = await db
      .select({
        id: duetChallenges.id,
        title: duetChallenges.title,
        description: duetChallenges.description,
        hashtag: duetChallenges.hashtag,
        originalPostId: duetChallenges.originalPostId,
        createdBy: {
          id: users.id,
          username: users.username,
          displayName: users.displayName,
          avatar: users.avatar,
          verified: users.verified,
        },
        startDate: duetChallenges.startDate,
        endDate: duetChallenges.endDate,
        status: duetChallenges.status,
        isSponsored: duetChallenges.isSponsored,
        isFeatured: duetChallenges.isFeatured,
        firstPrize: duetChallenges.firstPrize,
        secondPrize: duetChallenges.secondPrize,
        thirdPrize: duetChallenges.thirdPrize,
        participationReward: duetChallenges.participationReward,
        totalSubmissions: duetChallenges.totalSubmissions,
        totalViews: duetChallenges.totalViews,
        totalLikes: duetChallenges.totalLikes,
        bannerUrl: duetChallenges.bannerUrl,
        rules: duetChallenges.rules,
        tags: duetChallenges.tags,
        createdAt: duetChallenges.createdAt,
        updatedAt: duetChallenges.updatedAt,
      })
      .from(duetChallenges)
      .leftJoin(users, eq(duetChallenges.createdBy, users.id))
      .where(eq(duetChallenges.id, id))
      .limit(1);

    if (!challenge.length) {
      return res.status(404).json({
        success: false,
        error: 'Challenge not found'
      });
    }

    // Get top submissions for this challenge
    const submissions = await db
      .select({
        id: challengeSubmissions.id,
        challengeId: challengeSubmissions.challengeId,
        postId: challengeSubmissions.postId,
        user: {
          id: users.id,
          username: users.username,
          displayName: users.displayName,
          avatar: users.avatar,
          verified: users.verified,
        },
        score: challengeSubmissions.score,
        ranking: challengeSubmissions.ranking,
        views: challengeSubmissions.views,
        likes: challengeSubmissions.likes,
        comments: challengeSubmissions.comments,
        shares: challengeSubmissions.shares,
        status: challengeSubmissions.status,
        rewardEarned: challengeSubmissions.rewardEarned,
        submittedAt: challengeSubmissions.submittedAt,
      })
      .from(challengeSubmissions)
      .leftJoin(users, eq(challengeSubmissions.userId, users.id))
      .where(eq(challengeSubmissions.challengeId, id))
      .orderBy(asc(challengeSubmissions.ranking))
      .limit(50);

    res.json({
      success: true,
      data: {
        ...challenge[0],
        submissions
      }
    });
  } catch (error) {
    console.error('Error fetching challenge:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch challenge'
    });
  }
});

// Create new challenge
router.post('/challenges', authenticateToken, async (req, res) => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      return res.status(401).json({
        success: false,
        error: 'Authentication required'
      });
    }

    const {
      title,
      description,
      hashtag,
      originalPostId,
      startDate,
      endDate,
      firstPrize,
      secondPrize,
      thirdPrize,
      participationReward,
      bannerUrl,
      rules,
      tags,
      isSponsored = false,
      isFeatured = false
    } = req.body;

    // Validate required fields
    if (!title || !description || !hashtag || !originalPostId || !startDate || !endDate || !rules) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields'
      });
    }

    // Validate dates
    const start = new Date(startDate);
    const end = new Date(endDate);
    if (end <= start) {
      return res.status(400).json({
        success: false,
        error: 'End date must be after start date'
      });
    }

    // Check if hashtag is unique
    const existingChallenge = await db
      .select({ id: duetChallenges.id })
      .from(duetChallenges)
      .where(eq(duetChallenges.hashtag, hashtag))
      .limit(1);

    if (existingChallenge.length > 0) {
      return res.status(400).json({
        success: false,
        error: 'Hashtag already exists'
      });
    }

    // Create the challenge
    const newChallenge = await db
      .insert(duetChallenges)
      .values({
        title,
        description,
        hashtag,
        originalPostId,
        createdBy: userId,
        startDate: start,
        endDate: end,
        status: 'active',
        isSponsored,
        isFeatured,
        firstPrize: firstPrize.toString(),
        secondPrize: secondPrize.toString(),
        thirdPrize: thirdPrize.toString(),
        participationReward: participationReward.toString(),
        bannerUrl,
        rules,
        tags: tags || [],
      })
      .returning();

    res.status(201).json({
      success: true,
      data: newChallenge[0]
    });
  } catch (error) {
    console.error('Error creating challenge:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create challenge'
    });
  }
});

// Submit to challenge
router.post('/challenges/:id/submit', authenticateToken, async (req, res) => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      return res.status(401).json({
        success: false,
        error: 'Authentication required'
      });
    }

    const { id: challengeId } = req.params;
    const { postId } = req.body;

    if (!postId) {
      return res.status(400).json({
        success: false,
        error: 'Post ID is required'
      });
    }

    // Check if challenge exists and is active
    const challenge = await db
      .select({
        id: duetChallenges.id,
        status: duetChallenges.status,
        endDate: duetChallenges.endDate
      })
      .from(duetChallenges)
      .where(eq(duetChallenges.id, challengeId))
      .limit(1);

    if (!challenge.length) {
      return res.status(404).json({
        success: false,
        error: 'Challenge not found'
      });
    }

    if (challenge[0].status !== 'active') {
      return res.status(400).json({
        success: false,
        error: 'Challenge is not active'
      });
    }

    if (new Date() > challenge[0].endDate) {
      return res.status(400).json({
        success: false,
        error: 'Challenge has ended'
      });
    }

    // Check if user already submitted
    const existingSubmission = await db
      .select({ id: challengeSubmissions.id })
      .from(challengeSubmissions)
      .where(
        and(
          eq(challengeSubmissions.challengeId, challengeId),
          eq(challengeSubmissions.userId, userId)
        )
      )
      .limit(1);

    if (existingSubmission.length > 0) {
      return res.status(400).json({
        success: false,
        error: 'You have already submitted to this challenge'
      });
    }

    // Create submission
    const submission = await db
      .insert(challengeSubmissions)
      .values({
        challengeId,
        postId,
        userId,
        status: 'submitted'
      })
      .returning();

    // Update challenge submission count
    await db
      .update(duetChallenges)
      .set({
        totalSubmissions: sql`${duetChallenges.totalSubmissions} + 1`,
        updatedAt: new Date()
      })
      .where(eq(duetChallenges.id, challengeId));

    res.status(201).json({
      success: true,
      data: submission[0]
    });
  } catch (error) {
    console.error('Error submitting to challenge:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to submit to challenge'
    });
  }
});

// Get challenge leaderboard
router.get('/challenges/:id/leaderboard', async (req, res) => {
  try {
    const { id } = req.params;
    const { limit = 50 } = req.query;

    const leaderboard = await db
      .select({
        id: challengeSubmissions.id,
        user: {
          id: users.id,
          username: users.username,
          displayName: users.displayName,
          avatar: users.avatar,
          verified: users.verified,
        },
        score: challengeSubmissions.score,
        ranking: challengeSubmissions.ranking,
        views: challengeSubmissions.views,
        likes: challengeSubmissions.likes,
        comments: challengeSubmissions.comments,
        shares: challengeSubmissions.shares,
        status: challengeSubmissions.status,
        rewardEarned: challengeSubmissions.rewardEarned,
        submittedAt: challengeSubmissions.submittedAt,
      })
      .from(challengeSubmissions)
      .leftJoin(users, eq(challengeSubmissions.userId, users.id))
      .where(eq(challengeSubmissions.challengeId, id))
      .orderBy(asc(challengeSubmissions.ranking))
      .limit(parseInt(limit as string));

    res.json({
      success: true,
      data: leaderboard
    });
  } catch (error) {
    console.error('Error fetching leaderboard:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch leaderboard'
    });
  }
});

// Get user's challenge submissions
router.get('/user/challenges', authenticateToken, async (req, res) => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      return res.status(401).json({
        success: false,
        error: 'Authentication required'
      });
    }

    const submissions = await db
      .select({
        submission: challengeSubmissions,
        challenge: {
          id: duetChallenges.id,
          title: duetChallenges.title,
          hashtag: duetChallenges.hashtag,
          status: duetChallenges.status,
          endDate: duetChallenges.endDate,
          firstPrize: duetChallenges.firstPrize,
          secondPrize: duetChallenges.secondPrize,
          thirdPrize: duetChallenges.thirdPrize,
          participationReward: duetChallenges.participationReward,
        }
      })
      .from(challengeSubmissions)
      .leftJoin(duetChallenges, eq(challengeSubmissions.challengeId, duetChallenges.id))
      .where(eq(challengeSubmissions.userId, userId))
      .orderBy(desc(challengeSubmissions.submittedAt));

    res.json({
      success: true,
      data: submissions
    });
  } catch (error) {
    console.error('Error fetching user challenges:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch user challenges'
    });
  }
});

// Update challenge (only by creator or admin)
router.put('/challenges/:id', authenticateToken, async (req, res) => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      return res.status(401).json({
        success: false,
        error: 'Authentication required'
      });
    }

    const { id } = req.params;
    const updates = req.body;

    // Check if user is the creator
    const challenge = await db
      .select({ createdBy: duetChallenges.createdBy })
      .from(duetChallenges)
      .where(eq(duetChallenges.id, id))
      .limit(1);

    if (!challenge.length) {
      return res.status(404).json({
        success: false,
        error: 'Challenge not found'
      });
    }

    if (challenge[0].createdBy !== userId) {
      return res.status(403).json({
        success: false,
        error: 'Not authorized to update this challenge'
      });
    }

    const updatedChallenge = await db
      .update(duetChallenges)
      .set({
        ...updates,
        updatedAt: new Date()
      })
      .where(eq(duetChallenges.id, id))
      .returning();

    res.json({
      success: true,
      data: updatedChallenge[0]
    });
  } catch (error) {
    console.error('Error updating challenge:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update challenge'
    });
  }
});

// Delete challenge (only by creator or admin)
router.delete('/challenges/:id', authenticateToken, async (req, res) => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      return res.status(401).json({
        success: false,
        error: 'Authentication required'
      });
    }

    const { id } = req.params;

    // Check if user is the creator
    const challenge = await db
      .select({ createdBy: duetChallenges.createdBy })
      .from(duetChallenges)
      .where(eq(duetChallenges.id, id))
      .limit(1);

    if (!challenge.length) {
      return res.status(404).json({
        success: false,
        error: 'Challenge not found'
      });
    }

    if (challenge[0].createdBy !== userId) {
      return res.status(403).json({
        success: false,
        error: 'Not authorized to delete this challenge'
      });
    }

    await db
      .delete(duetChallenges)
      .where(eq(duetChallenges.id, id));

    res.json({
      success: true,
      message: 'Challenge deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting challenge:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to delete challenge'
    });
  }
});

export default router;
