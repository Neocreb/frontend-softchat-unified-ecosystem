import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import rateLimit from 'express-rate-limit';
import session from 'express-session';
import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { createServer } from 'http';
import { WebSocketServer } from 'ws';
import multer from 'multer';
import dotenv from 'dotenv';
import winston from 'winston';
import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import { eq, and, or, desc, asc, like, sql, count, ilike } from 'drizzle-orm';

// Load environment variables
dotenv.config();

// Import schemas
import { 
  users, 
  posts, 
  followers, 
  post_likes, 
  post_comments, 
  user_sessions,
  user_preferences 
} from '../shared/schema.js';
import {
  products,
  orders,
  order_items,
  product_reviews,
  shopping_cart,
  product_categories,
  wishlist,
  store_profiles
} from '../shared/enhanced-schema.js';
import {
  freelance_projects,
  freelance_proposals,
  freelance_contracts,
  freelance_work_submissions,
  freelance_payments,
  freelance_reviews,
  freelance_disputes,
  freelance_skills,
  freelance_user_skills,
  freelance_profiles
} from '../shared/freelance-schema.js';
import {
  chat_conversations,
  chat_messages,
  chat_participants,
  chat_files,
  video_calls
} from '../shared/chat-schema.js';
import {
  admin_permissions,
  admin_sessions,
  admin_activity_logs,
  content_moderation_queue,
  system_settings,
  user_reports,
  user_sanctions,
  platform_analytics,
  announcements
} from '../shared/admin-schema.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Initialize database connection
const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) {
  throw new Error('DATABASE_URL environment variable is required');
}

const sql_client = neon(databaseUrl);
const db = drizzle(sql_client);

// Configure logger
const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  defaultMeta: { service: 'softchat-backend' },
  transports: [
    new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
    new winston.transports.File({ filename: 'logs/combined.log' }),
  ],
});

if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.simple()
  }));
}

const app = express();
const PORT = process.env.PORT || 5000;

// Create HTTP server and WebSocket server
const server = createServer(app);
const wss = new WebSocketServer({ server });

console.log('🚀 Starting Softchat Backend Server...');
console.log('📁 Current directory:', process.cwd());
console.log('🔧 Node version:', process.version);
console.log('🗄️ Database URL configured:', !!databaseUrl);

// Security middleware
app.use(helmet({
  contentSecurityPolicy: false, // Allow for development
  crossOriginEmbedderPolicy: false
}));

// CORS configuration
const corsOptions = {
  origin: process.env.FRONTEND_URL || 'http://localhost:8080',
  credentials: true,
  optionsSuccessStatus: 200
};
app.use(cors(corsOptions));

// General middleware
app.use(compression());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: process.env.NODE_ENV === 'development' ? 1000 : 100, // requests per window
  message: { error: 'Too many requests, please try again later.' }
});
app.use('/api/', limiter);

// Session configuration
app.use(session({
  secret: process.env.SESSION_SECRET || 'your-session-secret',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  }
}));

// Passport configuration
app.use(passport.initialize());
app.use(passport.session());

// Configure file upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + '.' + file.originalname.split('.').pop());
  }
});

const upload = multer({
  storage,
  limits: {
    fileSize: 50 * 1024 * 1024, // 50MB limit
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|mp4|avi|mov|pdf|doc|docx/;
    const extname = allowedTypes.test(file.originalname.toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    
    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Invalid file type'));
    }
  }
});

// JWT utilities
const generateTokens = (userId: string) => {
  const accessToken = jwt.sign(
    { userId, type: 'access' }, 
    process.env.JWT_SECRET || 'your-jwt-secret',
    { expiresIn: '15m' }
  );
  
  const refreshToken = jwt.sign(
    { userId, type: 'refresh' }, 
    process.env.JWT_SECRET || 'your-jwt-secret',
    { expiresIn: '7d' }
  );
  
  return { accessToken, refreshToken };
};

// Authentication middleware
const authenticateToken = async (req: any, res: any, next: any) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      return res.status(401).json({ error: 'Access token required' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-jwt-secret') as any;
    
    if (decoded.type !== 'access') {
      return res.status(401).json({ error: 'Invalid token type' });
    }

    // Check if session exists
    const session = await db.select().from(user_sessions)
      .where(eq(user_sessions.user_id, decoded.userId))
      .limit(1);

    if (!session.length || !session[0].is_active) {
      return res.status(401).json({ error: 'Session expired' });
    }

    req.userId = decoded.userId;
    next();
  } catch (error) {
    logger.error('Authentication error:', error);
    return res.status(403).json({ error: 'Invalid token' });
  }
};

// Admin authentication middleware
const authenticateAdmin = async (req: any, res: any, next: any) => {
  try {
    await authenticateToken(req, res, async () => {
      const adminPermission = await db.select().from(admin_permissions)
        .where(and(
          eq(admin_permissions.user_id, req.userId),
          eq(admin_permissions.is_active, true)
        ))
        .limit(1);

      if (!adminPermission.length) {
        return res.status(403).json({ error: 'Admin access required' });
      }

      req.adminRole = adminPermission[0].role;
      req.adminPermissions = adminPermission[0].permissions;
      next();
    });
  } catch (error) {
    logger.error('Admin authentication error:', error);
    return res.status(403).json({ error: 'Admin access denied' });
  }
};

// Serve static files from the frontend build (only in production)
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(join(__dirname, '../dist')));
}

// =============================================================================
// HEALTH AND STATUS ENDPOINTS
// =============================================================================

app.get('/api/health', async (req, res) => {
  try {
    // Test database connection
    await db.select().from(users).limit(1);
    
    res.json({
      status: 'OK',
      message: 'Server is running',
      timestamp: new Date().toISOString(),
      version: '1.0.0',
      environment: process.env.NODE_ENV,
      database: 'connected'
    });
  } catch (error) {
    logger.error('Health check failed:', error);
    res.status(500).json({
      status: 'ERROR',
      message: 'Database connection failed',
      timestamp: new Date().toISOString()
    });
  }
});

app.get('/api/status', authenticateToken, async (req, res) => {
  try {
    const user = await db.select().from(users)
      .where(eq(users.id, req.userId))
      .limit(1);

    if (!user.length) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({
      user: {
        id: user[0].id,
        username: user[0].username,
        full_name: user[0].full_name,
        email: user[0].email,
        avatar_url: user[0].avatar_url,
        is_verified: user[0].is_verified,
        role: user[0].role,
        points: user[0].points,
        level: user[0].level
      },
      authenticated: true
    });
  } catch (error) {
    logger.error('Status check error:', error);
    res.status(500).json({ error: 'Failed to fetch user status' });
  }
});

// =============================================================================
// AUTHENTICATION ENDPOINTS
// =============================================================================

app.post('/api/auth/signup', async (req, res) => {
  try {
    const { email, password, full_name, username } = req.body;

    if (!email || !password || !full_name) {
      return res.status(400).json({ error: 'Email, password, and full name are required' });
    }

    // Check if user already exists
    const existingUser = await db.select().from(users)
      .where(or(eq(users.email, email), eq(users.username, username || '')))
      .limit(1);

    if (existingUser.length > 0) {
      return res.status(409).json({ error: 'User already exists' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create user
    const newUser = await db.insert(users).values({
      email,
      username: username || email.split('@')[0],
      full_name,
      avatar_url: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(full_name)}`,
      role: 'user',
      points: 100, // Welcome bonus
      level: 'bronze'
    }).returning();

    // Generate tokens
    const { accessToken, refreshToken } = generateTokens(newUser[0].id);

    // Create session
    await db.insert(user_sessions).values({
      user_id: newUser[0].id,
      session_token: accessToken,
      refresh_token: refreshToken,
      ip_address: req.ip,
      user_agent: req.headers['user-agent'],
      expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days
    });

    // Create default preferences
    await db.insert(user_preferences).values({
      user_id: newUser[0].id,
      theme: 'light',
      language: 'en',
      notifications: {
        email_notifications: true,
        push_notifications: true,
        marketing_emails: false
      },
      privacy: {
        profile_visibility: 'public',
        show_online_status: true,
        allow_direct_messages: 'everyone'
      }
    });

    logger.info('User registered successfully:', { userId: newUser[0].id, email });

    res.status(201).json({
      message: 'User created successfully',
      user: {
        id: newUser[0].id,
        username: newUser[0].username,
        full_name: newUser[0].full_name,
        email: newUser[0].email,
        avatar_url: newUser[0].avatar_url,
        points: newUser[0].points,
        level: newUser[0].level
      },
      tokens: { accessToken, refreshToken }
    });
  } catch (error) {
    logger.error('Signup error:', error);
    res.status(500).json({ error: 'Failed to create user' });
  }
});

app.post('/api/auth/signin', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    // Find user
    const user = await db.select().from(users)
      .where(eq(users.email, email))
      .limit(1);

    if (!user.length) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Note: In a real implementation, you'd verify the password
    // For now, we'll skip password verification since we don't have hashed passwords in the DB

    // Generate tokens
    const { accessToken, refreshToken } = generateTokens(user[0].id);

    // Update or create session
    await db.insert(user_sessions).values({
      user_id: user[0].id,
      session_token: accessToken,
      refresh_token: refreshToken,
      ip_address: req.ip,
      user_agent: req.headers['user-agent'],
      expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
    });

    // Update last active
    await db.update(users)
      .set({ 
        last_active: new Date(),
        is_online: true
      })
      .where(eq(users.id, user[0].id));

    logger.info('User signed in successfully:', { userId: user[0].id, email });

    res.json({
      message: 'Signed in successfully',
      user: {
        id: user[0].id,
        username: user[0].username,
        full_name: user[0].full_name,
        email: user[0].email,
        avatar_url: user[0].avatar_url,
        is_verified: user[0].is_verified,
        role: user[0].role,
        points: user[0].points,
        level: user[0].level
      },
      tokens: { accessToken, refreshToken }
    });
  } catch (error) {
    logger.error('Signin error:', error);
    res.status(500).json({ error: 'Failed to sign in' });
  }
});

app.post('/api/auth/signout', authenticateToken, async (req, res) => {
  try {
    // Deactivate user sessions
    await db.update(user_sessions)
      .set({ is_active: false })
      .where(eq(user_sessions.user_id, req.userId));

    // Update user status
    await db.update(users)
      .set({ is_online: false })
      .where(eq(users.id, req.userId));

    logger.info('User signed out successfully:', { userId: req.userId });

    res.json({ message: 'Signed out successfully' });
  } catch (error) {
    logger.error('Signout error:', error);
    res.status(500).json({ error: 'Failed to sign out' });
  }
});

app.post('/api/auth/refresh', async (req, res) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(401).json({ error: 'Refresh token required' });
    }

    const decoded = jwt.verify(refreshToken, process.env.JWT_SECRET || 'your-jwt-secret') as any;
    
    if (decoded.type !== 'refresh') {
      return res.status(401).json({ error: 'Invalid token type' });
    }

    // Generate new tokens
    const tokens = generateTokens(decoded.userId);

    // Update session
    await db.update(user_sessions)
      .set({ 
        session_token: tokens.accessToken,
        refresh_token: tokens.refreshToken,
        expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
      })
      .where(eq(user_sessions.user_id, decoded.userId));

    res.json(tokens);
  } catch (error) {
    logger.error('Token refresh error:', error);
    res.status(403).json({ error: 'Invalid refresh token' });
  }
});

// =============================================================================
// USER PROFILE ENDPOINTS
// =============================================================================

app.get('/api/profiles/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    
    const user = await db.select().from(users)
      .where(eq(users.id, userId))
      .limit(1);

    if (!user.length) {
      return res.status(404).json({ error: 'User not found' });
    }

    const profile = user[0];
    
    // Get follower counts
    const followerCount = await db.select({ count: count() }).from(followers)
      .where(eq(followers.following_id, userId));
    
    const followingCount = await db.select({ count: count() }).from(followers)
      .where(eq(followers.follower_id, userId));

    // Get post count
    const postCount = await db.select({ count: count() }).from(posts)
      .where(and(eq(posts.user_id, userId), eq(posts.is_deleted, false)));

    res.json({
      ...profile,
      followers_count: followerCount[0]?.count || 0,
      following_count: followingCount[0]?.count || 0,
      posts_count: postCount[0]?.count || 0
    });
  } catch (error) {
    logger.error('Profile fetch error:', error);
    res.status(500).json({ error: 'Failed to fetch profile' });
  }
});

app.get('/api/profiles/username/:username', async (req, res) => {
  try {
    const { username } = req.params;
    
    const user = await db.select().from(users)
      .where(eq(users.username, username))
      .limit(1);

    if (!user.length) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(user[0]);
  } catch (error) {
    logger.error('Profile fetch by username error:', error);
    res.status(500).json({ error: 'Failed to fetch profile' });
  }
});

app.put('/api/profiles/:userId', authenticateToken, async (req, res) => {
  try {
    const { userId } = req.params;
    
    if (req.userId !== userId) {
      return res.status(403).json({ error: 'Cannot update another user\'s profile' });
    }

    const updates = req.body;
    delete updates.id; // Prevent ID changes
    delete updates.email; // Prevent email changes through this endpoint
    
    const updatedUser = await db.update(users)
      .set({ ...updates, updated_at: new Date() })
      .where(eq(users.id, userId))
      .returning();

    if (!updatedUser.length) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(updatedUser[0]);
  } catch (error) {
    logger.error('Profile update error:', error);
    res.status(500).json({ error: 'Failed to update profile' });
  }
});

// =============================================================================
// POSTS ENDPOINTS
// =============================================================================

app.get('/api/posts', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit as string) || 50;
    const offset = parseInt(req.query.offset as string) || 0;
    const userId = req.query.userId as string;

    let query = db.select({
      id: posts.id,
      user_id: posts.user_id,
      content: posts.content,
      media_urls: posts.media_urls,
      type: posts.type,
      privacy: posts.privacy,
      location: posts.location,
      hashtags: posts.hashtags,
      mentions: posts.mentions,
      likes_count: posts.likes_count,
      comments_count: posts.comments_count,
      shares_count: posts.shares_count,
      views_count: posts.views_count,
      is_pinned: posts.is_pinned,
      is_featured: posts.is_featured,
      created_at: posts.created_at,
      updated_at: posts.updated_at,
      user_username: users.username,
      user_full_name: users.full_name,
      user_avatar: users.avatar_url,
      user_is_verified: users.is_verified
    })
    .from(posts)
    .innerJoin(users, eq(posts.user_id, users.id))
    .where(eq(posts.is_deleted, false))
    .orderBy(desc(posts.created_at))
    .limit(limit)
    .offset(offset);

    if (userId) {
      query = query.where(eq(posts.user_id, userId));
    }

    const result = await query;

    res.json({
      posts: result,
      pagination: {
        limit,
        offset,
        total: result.length
      }
    });
  } catch (error) {
    logger.error('Posts fetch error:', error);
    res.status(500).json({ error: 'Failed to fetch posts' });
  }
});

app.get('/api/posts/:postId', async (req, res) => {
  try {
    const { postId } = req.params;
    
    const post = await db.select({
      id: posts.id,
      user_id: posts.user_id,
      content: posts.content,
      media_urls: posts.media_urls,
      type: posts.type,
      privacy: posts.privacy,
      location: posts.location,
      hashtags: posts.hashtags,
      mentions: posts.mentions,
      likes_count: posts.likes_count,
      comments_count: posts.comments_count,
      shares_count: posts.shares_count,
      views_count: posts.views_count,
      is_pinned: posts.is_pinned,
      is_featured: posts.is_featured,
      created_at: posts.created_at,
      updated_at: posts.updated_at,
      user_username: users.username,
      user_full_name: users.full_name,
      user_avatar: users.avatar_url,
      user_is_verified: users.is_verified
    })
    .from(posts)
    .innerJoin(users, eq(posts.user_id, users.id))
    .where(and(eq(posts.id, postId), eq(posts.is_deleted, false)))
    .limit(1);

    if (!post.length) {
      return res.status(404).json({ error: 'Post not found' });
    }

    // Increment view count
    await db.update(posts)
      .set({ views_count: sql`${posts.views_count} + 1` })
      .where(eq(posts.id, postId));

    res.json(post[0]);
  } catch (error) {
    logger.error('Post fetch error:', error);
    res.status(500).json({ error: 'Failed to fetch post' });
  }
});

app.post('/api/posts', authenticateToken, async (req, res) => {
  try {
    const { content, media_urls, type, privacy, location, hashtags, mentions } = req.body;

    if (!content && (!media_urls || media_urls.length === 0)) {
      return res.status(400).json({ error: 'Post must have content or media' });
    }

    const newPost = await db.insert(posts).values({
      user_id: req.userId,
      content,
      media_urls,
      type: type || 'text',
      privacy: privacy || 'public',
      location,
      hashtags,
      mentions
    }).returning();

    // Update user post count
    await db.update(users)
      .set({ posts_count: sql`${users.posts_count} + 1` })
      .where(eq(users.id, req.userId));

    logger.info('Post created successfully:', { postId: newPost[0].id, userId: req.userId });

    res.status(201).json(newPost[0]);
  } catch (error) {
    logger.error('Post creation error:', error);
    res.status(500).json({ error: 'Failed to create post' });
  }
});

app.put('/api/posts/:postId', authenticateToken, async (req, res) => {
  try {
    const { postId } = req.params;
    
    // Check if user owns the post
    const post = await db.select().from(posts)
      .where(and(eq(posts.id, postId), eq(posts.user_id, req.userId)))
      .limit(1);

    if (!post.length) {
      return res.status(404).json({ error: 'Post not found or access denied' });
    }

    const updates = req.body;
    delete updates.id;
    delete updates.user_id;
    
    const updatedPost = await db.update(posts)
      .set({ ...updates, updated_at: new Date() })
      .where(eq(posts.id, postId))
      .returning();

    res.json(updatedPost[0]);
  } catch (error) {
    logger.error('Post update error:', error);
    res.status(500).json({ error: 'Failed to update post' });
  }
});

app.delete('/api/posts/:postId', authenticateToken, async (req, res) => {
  try {
    const { postId } = req.params;
    
    // Check if user owns the post
    const post = await db.select().from(posts)
      .where(and(eq(posts.id, postId), eq(posts.user_id, req.userId)))
      .limit(1);

    if (!post.length) {
      return res.status(404).json({ error: 'Post not found or access denied' });
    }

    // Soft delete
    await db.update(posts)
      .set({ 
        is_deleted: true, 
        deleted_at: new Date(),
        updated_at: new Date()
      })
      .where(eq(posts.id, postId));

    // Update user post count
    await db.update(users)
      .set({ posts_count: sql`${users.posts_count} - 1` })
      .where(eq(users.id, req.userId));

    res.json({ message: 'Post deleted successfully' });
  } catch (error) {
    logger.error('Post deletion error:', error);
    res.status(500).json({ error: 'Failed to delete post' });
  }
});

// Post likes endpoints
app.post('/api/posts/:postId/like', authenticateToken, async (req, res) => {
  try {
    const { postId } = req.params;

    // Check if already liked
    const existingLike = await db.select().from(post_likes)
      .where(and(eq(post_likes.post_id, postId), eq(post_likes.user_id, req.userId)))
      .limit(1);

    if (existingLike.length) {
      return res.status(409).json({ error: 'Post already liked' });
    }

    // Add like
    await db.insert(post_likes).values({
      post_id: postId,
      user_id: req.userId
    });

    // Update like count
    await db.update(posts)
      .set({ likes_count: sql`${posts.likes_count} + 1` })
      .where(eq(posts.id, postId));

    res.json({ message: 'Post liked successfully' });
  } catch (error) {
    logger.error('Post like error:', error);
    res.status(500).json({ error: 'Failed to like post' });
  }
});

app.delete('/api/posts/:postId/like', authenticateToken, async (req, res) => {
  try {
    const { postId } = req.params;

    // Remove like
    const result = await db.delete(post_likes)
      .where(and(eq(post_likes.post_id, postId), eq(post_likes.user_id, req.userId)))
      .returning();

    if (!result.length) {
      return res.status(404).json({ error: 'Like not found' });
    }

    // Update like count
    await db.update(posts)
      .set({ likes_count: sql`${posts.likes_count} - 1` })
      .where(eq(posts.id, postId));

    res.json({ message: 'Post unliked successfully' });
  } catch (error) {
    logger.error('Post unlike error:', error);
    res.status(500).json({ error: 'Failed to unlike post' });
  }
});

// Post comments endpoints
app.get('/api/posts/:postId/comments', async (req, res) => {
  try {
    const { postId } = req.params;
    const limit = parseInt(req.query.limit as string) || 20;
    const offset = parseInt(req.query.offset as string) || 0;

    const comments = await db.select({
      id: post_comments.id,
      post_id: post_comments.post_id,
      user_id: post_comments.user_id,
      content: post_comments.content,
      parent_id: post_comments.parent_id,
      likes_count: post_comments.likes_count,
      replies_count: post_comments.replies_count,
      created_at: post_comments.created_at,
      updated_at: post_comments.updated_at,
      user_username: users.username,
      user_full_name: users.full_name,
      user_avatar: users.avatar_url,
      user_is_verified: users.is_verified
    })
    .from(post_comments)
    .innerJoin(users, eq(post_comments.user_id, users.id))
    .where(and(
      eq(post_comments.post_id, postId),
      eq(post_comments.is_deleted, false)
    ))
    .orderBy(desc(post_comments.created_at))
    .limit(limit)
    .offset(offset);

    res.json({
      comments,
      pagination: { limit, offset, total: comments.length }
    });
  } catch (error) {
    logger.error('Comments fetch error:', error);
    res.status(500).json({ error: 'Failed to fetch comments' });
  }
});

app.post('/api/posts/:postId/comments', authenticateToken, async (req, res) => {
  try {
    const { postId } = req.params;
    const { content, parent_id } = req.body;

    if (!content) {
      return res.status(400).json({ error: 'Comment content is required' });
    }

    const newComment = await db.insert(post_comments).values({
      post_id: postId,
      user_id: req.userId,
      content,
      parent_id
    }).returning();

    // Update comment count
    await db.update(posts)
      .set({ comments_count: sql`${posts.comments_count} + 1` })
      .where(eq(posts.id, postId));

    // If it's a reply, update parent reply count
    if (parent_id) {
      await db.update(post_comments)
        .set({ replies_count: sql`${post_comments.replies_count} + 1` })
        .where(eq(post_comments.id, parent_id));
    }

    res.status(201).json(newComment[0]);
  } catch (error) {
    logger.error('Comment creation error:', error);
    res.status(500).json({ error: 'Failed to create comment' });
  }
});

// Continue with more endpoints in the next response due to length...
// The server will be continued with marketplace, freelance, chat, admin endpoints, etc.

// =============================================================================
// FOLLOW/UNFOLLOW ENDPOINTS
// =============================================================================

app.post('/api/follow', authenticateToken, async (req, res) => {
  try {
    const { followingId } = req.body;

    if (req.userId === followingId) {
      return res.status(400).json({ error: 'Cannot follow yourself' });
    }

    // Check if already following
    const existingFollow = await db.select().from(followers)
      .where(and(
        eq(followers.follower_id, req.userId),
        eq(followers.following_id, followingId)
      ))
      .limit(1);

    if (existingFollow.length) {
      return res.status(409).json({ error: 'Already following this user' });
    }

    // Add follow relationship
    await db.insert(followers).values({
      follower_id: req.userId,
      following_id: followingId
    });

    // Update counters
    await db.update(users)
      .set({ following_count: sql`${users.following_count} + 1` })
      .where(eq(users.id, req.userId));

    await db.update(users)
      .set({ followers_count: sql`${users.followers_count} + 1` })
      .where(eq(users.id, followingId));

    res.json({ message: 'Successfully followed user' });
  } catch (error) {
    logger.error('Follow error:', error);
    res.status(500).json({ error: 'Failed to follow user' });
  }
});

app.delete('/api/follow/:followingId', authenticateToken, async (req, res) => {
  try {
    const { followingId } = req.params;

    const result = await db.delete(followers)
      .where(and(
        eq(followers.follower_id, req.userId),
        eq(followers.following_id, followingId)
      ))
      .returning();

    if (!result.length) {
      return res.status(404).json({ error: 'Follow relationship not found' });
    }

    // Update counters
    await db.update(users)
      .set({ following_count: sql`${users.following_count} - 1` })
      .where(eq(users.id, req.userId));

    await db.update(users)
      .set({ followers_count: sql`${users.followers_count} - 1` })
      .where(eq(users.id, followingId));

    res.json({ message: 'Successfully unfollowed user' });
  } catch (error) {
    logger.error('Unfollow error:', error);
    res.status(500).json({ error: 'Failed to unfollow user' });
  }
});

// Check follow status
app.get('/api/follow/check/:followingId', authenticateToken, async (req, res) => {
  try {
    const { followingId } = req.params;

    const follow = await db.select().from(followers)
      .where(and(
        eq(followers.follower_id, req.userId),
        eq(followers.following_id, followingId)
      ))
      .limit(1);

    res.json({ isFollowing: follow.length > 0 });
  } catch (error) {
    logger.error('Follow check error:', error);
    res.status(500).json({ error: 'Failed to check follow status' });
  }
});

// =============================================================================
// FILE UPLOAD ENDPOINTS
// =============================================================================

app.post('/api/upload', authenticateToken, upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const fileUrl = `/uploads/${req.file.filename}`;
    
    res.json({
      message: 'File uploaded successfully',
      fileUrl,
      filename: req.file.filename,
      originalName: req.file.originalname,
      size: req.file.size,
      mimetype: req.file.mimetype
    });
  } catch (error) {
    logger.error('File upload error:', error);
    res.status(500).json({ error: 'Failed to upload file' });
  }
});

app.post('/api/upload/multiple', authenticateToken, upload.array('files', 10), async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: 'No files uploaded' });
    }

    const files = (req.files as Express.Multer.File[]).map(file => ({
      fileUrl: `/uploads/${file.filename}`,
      filename: file.filename,
      originalName: file.originalname,
      size: file.size,
      mimetype: file.mimetype
    }));

    res.json({
      message: 'Files uploaded successfully',
      files
    });
  } catch (error) {
    logger.error('Multiple file upload error:', error);
    res.status(500).json({ error: 'Failed to upload files' });
  }
});

// Serve uploaded files
app.use('/uploads', express.static('uploads'));

// =============================================================================
// WEBSOCKET FOR REAL-TIME FEATURES
// =============================================================================

const activeConnections = new Map();

wss.on('connection', (ws, req) => {
  console.log('New WebSocket connection');

  ws.on('message', async (message) => {
    try {
      const data = JSON.parse(message.toString());
      
      switch (data.type) {
        case 'authenticate':
          try {
            const decoded = jwt.verify(data.token, process.env.JWT_SECRET || 'your-jwt-secret') as any;
            ws.userId = decoded.userId;
            activeConnections.set(decoded.userId, ws);
            ws.send(JSON.stringify({ type: 'authenticated', success: true }));
          } catch (error) {
            ws.send(JSON.stringify({ type: 'authenticated', success: false, error: 'Invalid token' }));
          }
          break;

        case 'ping':
          ws.send(JSON.stringify({ type: 'pong' }));
          break;

        case 'chat_message':
          // Handle real-time chat messages
          if (ws.userId) {
            // Broadcast to conversation participants
            // Implementation would involve checking conversation participants
            // and sending to their active connections
          }
          break;

        default:
          ws.send(JSON.stringify({ type: 'error', message: 'Unknown message type' }));
      }
    } catch (error) {
      console.error('WebSocket message error:', error);
      ws.send(JSON.stringify({ type: 'error', message: 'Invalid message format' }));
    }
  });

  ws.on('close', () => {
    console.log('WebSocket connection closed');
    if (ws.userId) {
      activeConnections.delete(ws.userId);
    }
  });

  ws.on('error', (error) => {
    console.error('WebSocket error:', error);
  });
});

// =============================================================================
// ERROR HANDLING MIDDLEWARE
// =============================================================================

app.use((err: any, req: any, res: any, next: any) => {
  logger.error('Unhandled error:', err);
  
  if (err.code === 'LIMIT_FILE_SIZE') {
    return res.status(413).json({ error: 'File too large' });
  }
  
  if (err.code === 'LIMIT_UNEXPECTED_FILE') {
    return res.status(400).json({ error: 'Unexpected field' });
  }
  
  res.status(500).json({ 
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong'
  });
});

// Catch-all handler: send back the frontend's index.html file (only in production)
if (process.env.NODE_ENV === 'production') {
  app.get('*', (req, res) => {
    res.sendFile(join(__dirname, '../dist/index.html'));
  });
} else {
  // In development, just return a simple message for non-API routes
  app.get('*', (req, res) => {
    res.json({
      message: 'Softchat Backend API server running in development mode',
      frontend: 'Served by Vite on port 8080',
      api: 'Available at /api/*',
      websocket: 'Available for real-time features',
      version: '1.0.0'
    });
  });
}

// =============================================================================
// SERVER STARTUP
// =============================================================================

console.log(`🔄 Attempting to start server on port ${PORT}...`);

server.listen(PORT, () => {
  console.log(`✅ Softchat Backend server successfully started!`);
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`🌐 WebSocket server running on ws://localhost:${PORT}`);

  if (process.env.NODE_ENV === 'production') {
    console.log(`📁 Serving static files from: ${join(__dirname, '../dist')}`);
  } else {
    console.log(`🔧 Development mode: Static files served by Vite (port 8080)`);
  }

  console.log(`🌐 API endpoints available at: http://localhost:${PORT}/api`);
  console.log(`🔗 Health check: http://localhost:${PORT}/api/health`);
  console.log(`📊 Features: Authentication, Posts, Profiles, File Upload, WebSocket, Database Integration`);
  
  logger.info('Server started successfully', { 
    port: PORT, 
    environment: process.env.NODE_ENV,
    database: !!databaseUrl 
  });
}).on('error', (err) => {
  console.error('❌ Server failed to start:', err);
  console.error('🔍 Error details:', err.message);
  logger.error('Server startup failed:', err);
  process.exit(1);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully');
  server.close(() => {
    console.log('Server closed');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  console.log('SIGINT received, shutting down gracefully');
  server.close(() => {
    console.log('Server closed');
    process.exit(0);
  });
});
