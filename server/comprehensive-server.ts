import dotenv from "dotenv";
dotenv.config();

import express from "express";
import { createServer } from "http";
import compression from "compression";
import helmet from "helmet";
import cors from "cors";
import rateLimit from "express-rate-limit";
import session from "express-session";
import ConnectPgSimple from "connect-pg-simple";
import winston from "winston";
import path from "path";
import { fileURLToPath } from "url";

// Import routes
import { registerEnhancedRoutes } from "./routes/enhanced";
import comprehensiveApiRoutes from "./routes/comprehensive-api";
import adminComprehensiveRoutes from "./routes/admin-comprehensive";
import marketplaceApiRoutes from "./routes/marketplace-api";
import activityEconomyApiRoutes from "./routes/activity-economy-api";
import duetApiRoutes from "./routes/duet-api";
import videoApiRoutes from "./routes/video-api";
import socialApiRoutes from "./routes/social-api";
import aiApiRoutes from "./routes/ai-api";
import notificationsApiRoutes from "./routes/notifications-api";
import analyticsApiRoutes from "./routes/analytics-api";
import deliveryApiRoutes from "./routes/delivery-api";

// Import services
import { initializeWebSocketService } from "./services/websocketService";
import { emailService } from "./services/emailService";
import { cacheService } from "./services/cacheService";

// Import database and security
import { db } from "./db";
import { sql, eq, or, lte } from "drizzle-orm";
import { freelanceJobs, products } from "../shared/schema";
import { adminSessions, adminActivityLogs } from "../shared/enhanced-schema";
import {
  authenticateToken,
  requireRole,
  securityHeaders,
  corsOptions,
  globalErrorHandler,
} from "./config/security";

// Configure Winston logger
const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || "info",
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json(),
  ),
  defaultMeta: { service: "softchat-comprehensive" },
  transports: [
    new winston.transports.File({ filename: "logs/error.log", level: "error" }),
    new winston.transports.File({ filename: "logs/combined.log" }),
  ],
});

// Add console transport in development
if (process.env.NODE_ENV !== "production") {
  logger.add(
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple(),
      ),
    }),
  );
}

const app = express();
const server = createServer(app);

// =============================================================================
// SECURITY & MIDDLEWARE SETUP
// =============================================================================

// Basic security headers
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
        fontSrc: ["'self'", "https://fonts.gstatic.com"],
        imgSrc: ["'self'", "data:", "https:", "blob:"],
        scriptSrc: ["'self'", "'unsafe-eval'"],
        connectSrc: ["'self'", "ws:", "wss:", "https:"],
      },
    },
  }),
);

// CORS configuration
app.use(cors(corsOptions));

// Compression
app.use(compression());

// Rate limiting
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 1000, // Limit each IP to 1000 requests per windowMs
  message: {
    error: "Too many requests from this IP, please try again later.",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

app.use(globalLimiter);

// Body parsing
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Session configuration
const PgSession = ConnectPgSimple(session);

app.use(
  session({
    store: new PgSession({
      conObject: {
        connectionString: process.env.DATABASE_URL,
      },
      tableName: "session",
      createTableIfMissing: true,
    }),
    secret: process.env.SESSION_SECRET || "your-secret-key",
    resave: false,
    saveUninitialized: false,
    rolling: true,
    cookie: {
      secure: process.env.NODE_ENV === "production",
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
      sameSite: "lax",
    },
  }),
);

// Request logging middleware
app.use((req, res, next) => {
  const start = Date.now();

  res.on("finish", () => {
    const duration = Date.now() - start;
    logger.info("HTTP Request", {
      method: req.method,
      url: req.url,
      status: res.statusCode,
      duration: `${duration}ms`,
      ip: req.ip,
      userAgent: req.get("User-Agent"),
    });
  });

  next();
});

// =============================================================================
// HEALTH CHECK & STATUS ENDPOINTS
// =============================================================================

app.get("/health", async (req, res) => {
  let dbStatus = "disconnected";
  let cacheStatus = false;
  let overallHealthy = true;

  // Check database connection
  try {
    await db.execute(sql`SELECT 1`);
    dbStatus = "connected";
  } catch (error) {
    logger.error("Database health check failed:", error);
    dbStatus = "disconnected";
    overallHealthy = false;
  }

  // Check cache service (non-critical)
  try {
    cacheStatus = await cacheService.ping();
  } catch (error) {
    logger.error("Cache health check failed:", error);
    cacheStatus = false;
    // Cache is non-critical, don't fail health check
  }

  const response = {
    status: overallHealthy ? "healthy" : "unhealthy",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    version: process.env.npm_package_version || "1.0.0",
    environment: process.env.NODE_ENV || "development",
    services: {
      database: dbStatus,
      cache: cacheStatus ? "connected" : "disconnected",
      email: emailService.isConfigured() ? "configured" : "not_configured",
    },
    memory: {
      used: Math.round(process.memoryUsage().heapUsed / 1024 / 1024),
      total: Math.round(process.memoryUsage().heapTotal / 1024 / 1024),
      rss: Math.round(process.memoryUsage().rss / 1024 / 1024),
    },
  };

  res.status(overallHealthy ? 200 : 503).json(response);
});

app.get("/status", async (req, res) => {
  const stats = {
    server: {
      startTime: new Date(Date.now() - process.uptime() * 1000).toISOString(),
      uptime: process.uptime(),
      nodeVersion: process.version,
      platform: process.platform,
      architecture: process.arch,
    },
    memory: process.memoryUsage(),
    cpu: process.cpuUsage(),
    environment: {
      nodeEnv: process.env.NODE_ENV,
      port: process.env.PORT,
    },
  };

  res.json(stats);
});

// =============================================================================
// API ROUTES REGISTRATION
// =============================================================================

// V1 API Routes (Comprehensive)
app.use("/api/v1", comprehensiveApiRoutes);

// Activity Economy API Routes
app.use("/api/v1", activityEconomyApiRoutes);

// Marketplace API Routes
app.use("/api/marketplace", marketplaceApiRoutes);

// Admin API Routes
app.use("/api", adminComprehensiveRoutes);

// Duet API Routes
app.use("/api/duets", duetApiRoutes);

// Video API Routes
app.use("/api/videos", videoApiRoutes);

// Social API Routes
app.use("/api/social", socialApiRoutes);

// AI API Routes
app.use("/api/ai", aiApiRoutes);

// Notifications API Routes
app.use("/api/notifications", notificationsApiRoutes);

// Analytics API Routes
app.use("/api/analytics", analyticsApiRoutes);

// Delivery API Routes
app.use("/api/delivery", deliveryApiRoutes);

// Legacy Enhanced Routes (for backward compatibility)
await registerEnhancedRoutes(app);

// =============================================================================
// WEBSOCKET INITIALIZATION
// =============================================================================

const websocketService = initializeWebSocketService(server);
logger.info("WebSocket service initialized");

// =============================================================================
// BACKGROUND SERVICES & SCHEDULED TASKS
// =============================================================================

// Auto-release expired escrows
setInterval(
  async () => {
    try {
      const { escrowOperations } = await import(
        "./database/enhanced-operations"
      );
      const expiredEscrows = await escrowOperations.getExpiredEscrows();

      for (const escrow of expiredEscrows) {
        if (escrow.releaseCondition === "auto") {
          await escrowOperations.updateStatus(escrow.id, "released", {
            releasedAt: new Date(),
            releaseNotes: "Auto-released due to expiry",
          });

          logger.info(`Auto-released expired escrow: ${escrow.id}`);

          // Notify parties via WebSocket
          websocketService.sendEscrowUpdate(escrow.id, {
            status: "released",
            reason: "auto_release",
            message: "Escrow auto-released due to expiry",
          });
        }
      }
    } catch (error) {
      logger.error("Error in auto-release escrow task:", error);
    }
  },
  60 * 60 * 1000,
); // Every hour

// Expire completed boosts
setInterval(
  async () => {
    try {
      const { boostOperations } = await import(
        "./database/enhanced-operations"
      );
      const expiredBoosts = await boostOperations.getExpiredBoosts();

      for (const boost of expiredBoosts) {
        await boostOperations.updateBoostStatus(boost.id, "completed", {
          endDate: new Date(),
        });

        // Revert boost effects
        if (boost.type === "freelance_job") {
          await db
            .update(freelanceJobs)
            .set({ boostUntil: null })
            .where(eq(freelanceJobs.id, boost.referenceId));
        } else if (boost.type === "product") {
          await db
            .update(products)
            .set({
              isFeatured: false,
              boostUntil: null,
            })
            .where(eq(products.id, boost.referenceId));
        }

        logger.info(`Expired boost: ${boost.id}`);
      }
    } catch (error) {
      logger.error("Error in expire boost task:", error);
    }
  },
  30 * 60 * 1000,
); // Every 30 minutes

// Cleanup old sessions and logs
setInterval(
  async () => {
    try {
      // Clean up old admin sessions
      await db
        .delete(adminSessions)
        .where(
          or(
            lte(adminSessions.expiresAt, new Date()),
            eq(adminSessions.isActive, false),
          ),
        );

      // Clean up old activity logs (keep 6 months)
      const sixMonthsAgo = new Date();
      sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

      await db
        .delete(adminActivityLogs)
        .where(lte(adminActivityLogs.createdAt, sixMonthsAgo));

      logger.info("Cleanup tasks completed");
    } catch (error) {
      logger.error("Error in cleanup task:", error);
    }
  },
  24 * 60 * 60 * 1000,
); // Daily

// =============================================================================
// STATIC FILE SERVING (PRODUCTION)
// =============================================================================

// Serve static files in both development and production
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const staticPath = path.join(__dirname, "../dist");

// Check if dist directory exists before serving
import fs from 'fs';
if (fs.existsSync(staticPath)) {
  app.use(express.static(staticPath));

  // Serve index.html for all unmatched routes (SPA support)
  app.get("*", (req, res) => {
    const indexPath = path.join(staticPath, "index.html");
    if (fs.existsSync(indexPath)) {
      res.sendFile(indexPath);
    } else {
      res.status(404).json({ error: "Frontend not built. Run 'npm run build:frontend' first." });
    }
  });
} else {
  // Fallback route when frontend is not built
  app.get("*", (req, res) => {
    res.status(404).json({ error: "Frontend not built. Run 'npm run build:frontend' first." });
  });
}

// =============================================================================
// ERROR HANDLING
// =============================================================================

// 404 handler for API routes
app.use("/api", (req, res) => {
  res.status(404).json({
    success: false,
    error: "API endpoint not found",
    path: req.path,
  });
});

// Global error handler
app.use(globalErrorHandler);

// =============================================================================
// SERVER STARTUP
// =============================================================================

const PORT = process.env.PORT || 3000;

// Graceful shutdown handler
const gracefulShutdown = (signal: string) => {
  logger.info(`${signal} received, shutting down gracefully`);

  server.close(() => {
    logger.info("HTTP server closed");

    // Close database connections
    // db.end(); // Uncomment if using a connection pool

    // Close cache connections
    cacheService.disconnect();

    logger.info("All connections closed, exiting");
    process.exit(0);
  });

  // Force close after 10 seconds
  setTimeout(() => {
    logger.error(
      "Could not close connections in time, forcefully shutting down",
    );
    process.exit(1);
  }, 10000);
};

// Handle shutdown signals
process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));
process.on("SIGINT", () => gracefulShutdown("SIGINT"));

// Handle uncaught exceptions
process.on("uncaughtException", (error) => {
  logger.error("Uncaught Exception:", error);
  process.exit(1);
});

process.on("unhandledRejection", (reason, promise) => {
  logger.error("Unhandled Rejection at:", promise, "reason:", reason);
  process.exit(1);
});

// Start server
server.listen(PORT, () => {
  logger.info(`🚀 SoftChat Comprehensive Server running on port ${PORT}`);
  logger.info(`📊 Environment: ${process.env.NODE_ENV || "development"}`);
  logger.info(
    `💾 Database: ${process.env.DATABASE_URL ? "Connected" : "Not configured"}`,
  );
  logger.info(
    `📧 Email: ${process.env.SMTP_HOST ? "Configured" : "Not configured"}`,
  );
  logger.info(`🔗 WebSocket: Enabled on /ws`);

  if (process.env.NODE_ENV === "development") {
    logger.info(`🌐 Health check: http://localhost:${PORT}/health`);
    logger.info(`📋 API docs: http://localhost:${PORT}/api/docs`);
  }
});

export default app;
export { server, websocketService };
