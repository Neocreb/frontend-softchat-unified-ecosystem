import dotenv from "dotenv";
dotenv.config();

import express from "express";
import { createServer } from "http";
import { registerEnhancedRoutes } from "./routes/enhanced";
import { setupVite, serveStatic, log } from "./vite";
import { emailService } from "./services/emailService";
import winston from "winston";
import path from "path";

// Configure Winston logger
const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || "info",
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json(),
  ),
  defaultMeta: { service: "softchat-backend" },
  transports: [
    new winston.transports.File({ filename: "logs/error.log", level: "error" }),
    new winston.transports.File({ filename: "logs/combined.log" }),
  ],
});

// Add console transport in development
if (process.env.NODE_ENV !== "production") {
  logger.add(
    new winston.transports.Console({
      format: winston.format.simple(),
    }),
  );
}

// Graceful shutdown handler
const gracefulShutdown = (signal: string) => {
  logger.info(`${signal} received, shutting down gracefully`);

  process.exit(0);
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

(async () => {
  try {
    log("🚀 Starting Softchat enhanced server...");

    const app = express();

    // Trust proxy for correct IP addresses
    app.set("trust proxy", 1);

    // ============================================================================
    // ENVIRONMENT VALIDATION
    // ============================================================================

    const requiredEnvVars = ["DATABASE_URL", "JWT_SECRET"];

    const missingEnvVars = requiredEnvVars.filter(
      (varName) => !process.env[varName],
    );

    if (missingEnvVars.length > 0) {
      logger.error(
        `Missing required environment variables: ${missingEnvVars.join(", ")}`,
      );
      process.exit(1);
    }

    // Warn about optional environment variables
    const optionalEnvVars = [
      "SMTP_HOST",
      "SMTP_USER",
      "SMTP_PASS",
      "AWS_ACCESS_KEY_ID",
      "AWS_SECRET_ACCESS_KEY",
      "AWS_S3_BUCKET",
      "STRIPE_SECRET_KEY",
      "REDIS_URL",
    ];

    const missingOptionalVars = optionalEnvVars.filter(
      (varName) => !process.env[varName],
    );
    if (missingOptionalVars.length > 0) {
      logger.warn(
        `Optional environment variables not set: ${missingOptionalVars.join(", ")}`,
      );
      logger.warn(
        "Some features may not work correctly without these variables",
      );
    }

    // ============================================================================
    // SERVICE INITIALIZATION
    // ============================================================================

    // Verify email service
    try {
      const emailVerified = await emailService.verifyConnection();
      if (emailVerified) {
        log("✅ Email service connected successfully");
      } else {
        log("⚠️ Email service connection failed - using fallback mode");
      }
    } catch (error) {
      log("⚠️ Email service unavailable - continuing without email features");
    }

    // ============================================================================
    // MIDDLEWARE SETUP
    // ============================================================================

    // Body parsing middleware
    app.use(express.json({ limit: "10mb" }));
    app.use(express.urlencoded({ extended: true, limit: "10mb" }));

    // Raw body for Stripe webhooks
    app.use("/api/webhooks/stripe", express.raw({ type: "application/json" }));

    // ============================================================================
    // ROUTES REGISTRATION
    // ============================================================================

    // Register enhanced API routes
    const server = await registerEnhancedRoutes(app);

    log("✅ Enhanced API routes registered");

    // ============================================================================
    // DEVELOPMENT/PRODUCTION SETUP
    // ============================================================================

    const isDevelopment = process.env.NODE_ENV !== "production";

    if (isDevelopment) {
      log("🔧 Setting up development environment...");
      try {
        await setupVite(app, server);
        log("✅ Vite development server configured");
      } catch (error) {
        log(
          `❌ Vite setup failed: ${error instanceof Error ? error.message : "Unknown error"}`,
        );
        log("🔄 Continuing without Vite...");
      }
    } else {
      log("🏭 Setting up production environment...");
      serveStatic(app);
      log("✅ Static file serving configured");
    }

    // ============================================================================
    // SERVER STARTUP
    // ============================================================================

    const port = parseInt(process.env.PORT || "5000");
    const host = process.env.HOST || "0.0.0.0";

    server.listen(port, host, () => {
      log(`🎉 Softchat server running on ${host}:${port}`);
      log(`📱 Environment: ${process.env.NODE_ENV || "development"}`);
      log(`🔗 Health check: http://localhost:${port}/health`);

      if (isDevelopment) {
        log(`🛠️ Frontend: http://localhost:${port}`);
        log(`⚡ API: http://localhost:${port}/api`);
      }

      logger.info("Server started successfully", {
        port,
        host,
        environment: process.env.NODE_ENV || "development",
        nodeVersion: process.version,
        platform: process.platform,
      });
    });

    server.on("error", (err: any) => {
      if (err.code === "EADDRINUSE") {
        logger.error(`Port ${port} is already in use`);
        log(`❌ Port ${port} is already in use. Please try a different port.`);
      } else {
        logger.error("Server error:", err);
        log(`❌ Server error: ${err.message}`);
      }
      process.exit(1);
    });

    // ============================================================================
    // BACKGROUND JOBS & CLEANUP
    // ============================================================================

    // Setup cleanup intervals
    setInterval(() => {
      // Clean up expired tokens, sessions, etc.
      logger.debug("Running background cleanup tasks");
    }, 60000 * 60); // Every hour

    // Log server metrics periodically
    setInterval(() => {
      const memUsage = process.memoryUsage();
      logger.info("Server metrics", {
        uptime: process.uptime(),
        memory: {
          rss: Math.round(memUsage.rss / 1024 / 1024) + "MB",
          heapUsed: Math.round(memUsage.heapUsed / 1024 / 1024) + "MB",
          heapTotal: Math.round(memUsage.heapTotal / 1024 / 1024) + "MB",
        },
        pid: process.pid,
      });
    }, 60000 * 10); // Every 10 minutes

    log("✅ Enhanced Softchat server startup complete!");
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    const errorStack = error instanceof Error ? error.stack : "No stack trace";

    logger.error("Server startup failed:", {
      message: errorMessage,
      stack: errorStack,
    });

    log(`❌ Server startup failed: ${errorMessage}`);
    log(`📋 Stack trace: ${errorStack}`);

    process.exit(1);
  }
})();
