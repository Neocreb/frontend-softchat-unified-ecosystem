import { Router } from "express";
import multer from "multer";
import { z } from "zod";
import { db } from "../db";
import {
  stickerPacks,
  stickers,
  userStickerLibrary,
  userStickerPacks,
  stickerUsage,
  stickerPackRatings,
  stickerReports,
  recentStickers,
  stickerCreationRequests,
} from "../../shared/sticker-schema";
import { eq, and, desc, asc, sql, like, inArray } from "drizzle-orm";

const router = Router();

// Configure multer for file uploads
const upload = multer({
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
    files: 20, // Max 20 files per pack
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['image/png', 'image/jpeg', 'image/gif', 'image/webp'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only PNG, JPEG, GIF, and WebP are allowed.'));
    }
  },
});

// Validation schemas
const createPackSchema = z.object({
  packName: z.string().min(1).max(50),
  description: z.string().max(200).optional(),
  category: z.enum(['emotions', 'gestures', 'memes', 'business', 'food', 'animals', 'sports', 'travel', 'custom']),
  isPublic: z.boolean().default(false),
  files: z.array(z.object({
    id: z.string(),
    originalName: z.string(),
    fileUrl: z.string(),
    type: z.string(),
    size: z.number(),
    width: z.number(),
    height: z.number(),
  })),
});

const reportSchema = z.object({
  stickerId: z.string().optional(),
  packId: z.string().optional(),
  reason: z.enum(['inappropriate', 'spam', 'copyright', 'hate_speech', 'violence', 'nudity', 'harassment', 'other']),
  description: z.string().max(500).optional(),
});

// GET /api/stickers/library/:userId - Get user's sticker library
router.get('/library/:userId', async (req, res) => {
  try {
    const { userId } = req.params;

    // Get recent stickers
    const recentResult = await db
      .select({
        sticker: stickers,
        pack: stickerPacks,
      })
      .from(recentStickers)
      .innerJoin(stickers, eq(recentStickers.stickerId, stickers.id))
      .innerJoin(stickerPacks, eq(stickers.packId, stickerPacks.id))
      .where(eq(recentStickers.userId, userId))
      .orderBy(desc(recentStickers.lastUsed))
      .limit(20);

    // Get favorite stickers
    const favoritesResult = await db
      .select({
        sticker: stickers,
        pack: stickerPacks,
      })
      .from(userStickerLibrary)
      .innerJoin(stickers, eq(userStickerLibrary.stickerId, stickers.id))
      .innerJoin(stickerPacks, eq(stickers.packId, stickerPacks.id))
      .where(and(
        eq(userStickerLibrary.userId, userId),
        eq(userStickerLibrary.isFavorite, true)
      ))
      .orderBy(desc(userStickerLibrary.addedAt));

    // Get downloaded packs
    const downloadedPacksResult = await db
      .select({
        pack: stickerPacks,
        stickers: sql<any[]>`json_agg(${stickers})`,
      })
      .from(userStickerPacks)
      .innerJoin(stickerPacks, eq(userStickerPacks.packId, stickerPacks.id))
      .leftJoin(stickers, eq(stickers.packId, stickerPacks.id))
      .where(and(
        eq(userStickerPacks.userId, userId),
        eq(userStickerPacks.isActive, true)
      ))
      .groupBy(stickerPacks.id)
      .orderBy(desc(userStickerPacks.downloadedAt));

    // Get custom packs created by user
    const customPacksResult = await db
      .select({
        pack: stickerPacks,
        stickers: sql<any[]>`json_agg(${stickers})`,
      })
      .from(stickerPacks)
      .leftJoin(stickers, eq(stickers.packId, stickerPacks.id))
      .where(eq(stickerPacks.creatorId, userId))
      .groupBy(stickerPacks.id)
      .orderBy(desc(stickerPacks.createdAt));

    const library = {
      recentStickers: recentResult.map(r => ({
        ...r.sticker,
        packName: r.pack.name,
      })),
      favoriteStickers: favoritesResult.map(r => ({
        ...r.sticker,
        packName: r.pack.name,
      })),
      downloadedPacks: downloadedPacksResult.map(r => ({
        ...r.pack,
        stickers: r.stickers.filter(Boolean),
      })),
      customPacks: customPacksResult.map(r => ({
        ...r.pack,
        stickers: r.stickers.filter(Boolean),
      })),
    };

    res.json(library);
  } catch (error) {
    console.error('Error fetching user library:', error);
    res.status(500).json({ error: 'Failed to fetch user library' });
  }
});

// POST /api/stickers/library/:userId/favorites - Add sticker to favorites
router.post('/library/:userId/favorites', async (req, res) => {
  try {
    const { userId } = req.params;
    const { stickerId } = req.body;

    // Get sticker details
    const sticker = await db
      .select()
      .from(stickers)
      .where(eq(stickers.id, stickerId))
      .limit(1);

    if (sticker.length === 0) {
      return res.status(404).json({ error: 'Sticker not found' });
    }

    // Add to user library
    await db.insert(userStickerLibrary).values({
      userId,
      stickerId,
      packId: sticker[0].packId,
      isFavorite: true,
    }).onConflictDoUpdate({
      target: [userStickerLibrary.userId, userStickerLibrary.stickerId],
      set: { isFavorite: true },
    });

    res.json({ success: true });
  } catch (error) {
    console.error('Error adding to favorites:', error);
    res.status(500).json({ error: 'Failed to add to favorites' });
  }
});

// DELETE /api/stickers/library/:userId/favorites/:stickerId - Remove from favorites
router.delete('/library/:userId/favorites/:stickerId', async (req, res) => {
  try {
    const { userId, stickerId } = req.params;

    await db
      .update(userStickerLibrary)
      .set({ isFavorite: false })
      .where(and(
        eq(userStickerLibrary.userId, userId),
        eq(userStickerLibrary.stickerId, stickerId)
      ));

    res.json({ success: true });
  } catch (error) {
    console.error('Error removing from favorites:', error);
    res.status(500).json({ error: 'Failed to remove from favorites' });
  }
});

// GET /api/stickers/packs - Get available sticker packs
router.get('/packs', async (req, res) => {
  try {
    const { category, premium, animated, sortBy, tags } = req.query;

    let query = db
      .select({
        pack: stickerPacks,
        stickerCount: sql<number>`count(${stickers.id})`,
      })
      .from(stickerPacks)
      .leftJoin(stickers, eq(stickers.packId, stickerPacks.id))
      .where(eq(stickerPacks.status, 'active'))
      .groupBy(stickerPacks.id);

    // Apply filters
    if (category) {
      query = query.where(eq(stickerPacks.category, category as string));
    }
    if (premium !== undefined) {
      query = query.where(eq(stickerPacks.isPremium, premium === 'true'));
    }

    // Apply sorting
    if (sortBy === 'popularity') {
      query = query.orderBy(desc(stickerPacks.downloadCount));
    } else if (sortBy === 'rating') {
      query = query.orderBy(desc(stickerPacks.rating));
    } else if (sortBy === 'name') {
      query = query.orderBy(asc(stickerPacks.name));
    } else {
      query = query.orderBy(desc(stickerPacks.createdAt));
    }

    const packs = await query.limit(50);

    // Get stickers for each pack
    const packsWithStickers = await Promise.all(
      packs.map(async (pack) => {
        const packStickers = await db
          .select()
          .from(stickers)
          .where(and(
            eq(stickers.packId, pack.pack.id),
            eq(stickers.status, 'active')
          ))
          .orderBy(asc(stickers.createdAt));

        return {
          ...pack.pack,
          stickers: packStickers,
        };
      })
    );

    res.json(packsWithStickers);
  } catch (error) {
    console.error('Error fetching sticker packs:', error);
    res.status(500).json({ error: 'Failed to fetch sticker packs' });
  }
});

// POST /api/stickers/packs/:packId/download - Download a sticker pack
router.post('/packs/:packId/download', async (req, res) => {
  try {
    const { packId } = req.params;
    const { userId } = req.body;

    // Check if pack exists
    const pack = await db
      .select()
      .from(stickerPacks)
      .where(eq(stickerPacks.id, packId))
      .limit(1);

    if (pack.length === 0) {
      return res.status(404).json({ error: 'Pack not found' });
    }

    // Add to user's downloaded packs
    await db.insert(userStickerPacks).values({
      userId,
      packId,
    }).onConflictDoUpdate({
      target: [userStickerPacks.userId, userStickerPacks.packId],
      set: { isActive: true, downloadedAt: new Date() },
    });

    // Increment download count
    await db
      .update(stickerPacks)
      .set({
        downloadCount: sql`${stickerPacks.downloadCount} + 1`,
      })
      .where(eq(stickerPacks.id, packId));

    res.json({ success: true });
  } catch (error) {
    console.error('Error downloading pack:', error);
    res.status(500).json({ error: 'Failed to download pack' });
  }
});

// POST /api/stickers/usage - Record sticker usage
router.post('/usage', async (req, res) => {
  try {
    const { userId, stickerId, packId, conversationId } = req.body;

    // Record usage
    await db.insert(stickerUsage).values({
      stickerId,
      userId,
      usedInConversation: conversationId,
    });

    // Update usage count
    await db
      .update(stickers)
      .set({
        usageCount: sql`${stickers.usageCount} + 1`,
      })
      .where(eq(stickers.id, stickerId));

    // Add to recent stickers
    await db.insert(recentStickers).values({
      userId,
      stickerId,
    }).onConflictDoUpdate({
      target: [recentStickers.userId, recentStickers.stickerId],
      set: { lastUsed: new Date() },
    });

    res.json({ success: true });
  } catch (error) {
    console.error('Error recording usage:', error);
    res.status(500).json({ error: 'Failed to record usage' });
  }
});

// POST /api/stickers/reports - Report a sticker or pack
router.post('/reports', async (req, res) => {
  try {
    const validatedData = reportSchema.parse(req.body);
    const reportedBy = req.user?.id; // Assuming auth middleware

    if (!reportedBy) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    await db.insert(stickerReports).values({
      ...validatedData,
      reportedBy,
    });

    res.json({ success: true });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: 'Invalid request data', details: error.errors });
    }
    console.error('Error creating report:', error);
    res.status(500).json({ error: 'Failed to create report' });
  }
});

// POST /api/stickers/create - Create sticker pack request
router.post('/create', async (req, res) => {
  try {
    const validatedData = createPackSchema.parse(req.body);
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({ error: 'User ID required' });
    }

    const [request] = await db.insert(stickerCreationRequests).values({
      userId,
      packName: validatedData.packName,
      description: validatedData.description,
      category: validatedData.category,
      isPublic: validatedData.isPublic,
      files: validatedData.files,
    }).returning();

    res.json({ requestId: request.id, success: true });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: 'Invalid request data', details: error.errors });
    }
    console.error('Error creating sticker pack request:', error);
    res.status(500).json({ error: 'Failed to create sticker pack request' });
  }
});

// POST /api/stickers/upload - Upload sticker files
router.post('/upload', upload.array('files', 20), async (req, res) => {
  try {
    const files = req.files as Express.Multer.File[];
    const { requestId } = req.body;

    if (!files || files.length === 0) {
      return res.status(400).json({ error: 'No files uploaded' });
    }

    // In production, you would upload files to S3/CloudFlare/etc.
    // For now, we'll simulate file URLs
    const fileUrls = files.map((file, index) => ({
      originalName: file.originalname,
      fileUrl: `/uploads/stickers/${requestId}/${index}.${file.mimetype.split('/')[1]}`,
      size: file.size,
      type: file.mimetype,
    }));

    res.json({ files: fileUrls, success: true });
  } catch (error) {
    console.error('Error uploading files:', error);
    res.status(500).json({ error: 'Failed to upload files' });
  }
});

// GET /api/stickers/trending - Get trending stickers
router.get('/trending', async (req, res) => {
  try {
    const { limit = 20 } = req.query;

    const trending = await db
      .select({
        sticker: stickers,
        pack: stickerPacks,
        usageCount: sql<number>`count(${stickerUsage.id})`,
      })
      .from(stickers)
      .innerJoin(stickerPacks, eq(stickers.packId, stickerPacks.id))
      .leftJoin(stickerUsage, and(
        eq(stickerUsage.stickerId, stickers.id),
        sql`${stickerUsage.timestamp} > NOW() - INTERVAL '7 days'`
      ))
      .where(eq(stickers.status, 'active'))
      .groupBy(stickers.id, stickerPacks.id)
      .orderBy(desc(sql`count(${stickerUsage.id})`))
      .limit(Number(limit));

    const result = trending.map(t => ({
      ...t.sticker,
      packName: t.pack.name,
      trendingScore: t.usageCount,
    }));

    res.json(result);
  } catch (error) {
    console.error('Error fetching trending stickers:', error);
    res.status(500).json({ error: 'Failed to fetch trending stickers' });
  }
});

// Search stickers
router.get('/search', async (req, res) => {
  try {
    const { q, category, premium, animated, sortBy } = req.query;

    if (!q) {
      return res.status(400).json({ error: 'Search query required' });
    }

    let query = db
      .select({
        sticker: stickers,
        pack: stickerPacks,
      })
      .from(stickers)
      .innerJoin(stickerPacks, eq(stickers.packId, stickerPacks.id))
      .where(and(
        eq(stickers.status, 'active'),
        sql`(${stickers.name} ILIKE ${`%${q}%`} OR array_to_string(${stickers.tags}, ' ') ILIKE ${`%${q}%`})`
      ));

    if (category) {
      query = query.where(eq(stickerPacks.category, category as string));
    }
    if (premium !== undefined) {
      query = query.where(eq(stickerPacks.isPremium, premium === 'true'));
    }

    if (sortBy === 'popularity') {
      query = query.orderBy(desc(stickers.usageCount));
    } else {
      query = query.orderBy(desc(stickers.createdAt));
    }

    const results = await query.limit(50);

    const searchResults = results.map(r => ({
      ...r.sticker,
      packName: r.pack.name,
    }));

    res.json(searchResults);
  } catch (error) {
    console.error('Error searching stickers:', error);
    res.status(500).json({ error: 'Failed to search stickers' });
  }
});

export default router;
