import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import rateLimit from "rate-limiter-flexible";
import helmet from "helmet";
import cors from "cors";
import { Request, Response, NextFunction } from "express";
import { User } from "@shared/schema";

// Environment variables with defaults
export const config = {
  jwtSecret: process.env.JWT_SECRET || "fallback-secret-change-in-production",
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || "24h",
  bcryptSaltRounds: parseInt(process.env.BCRYPT_SALT_ROUNDS || "12"),
  rateLimitWindow: parseInt(process.env.RATE_LIMIT_WINDOW || "900000"), // 15 minutes
  rateLimitMax: parseInt(process.env.RATE_LIMIT_MAX || "100"),
};

// Password hashing utilities
export const hashPassword = async (password: string): Promise<string> => {
  return bcrypt.hash(password, config.bcryptSaltRounds);
};

export const comparePassword = async (
  password: string,
  hash: string,
): Promise<boolean> => {
  return bcrypt.compare(password, hash);
};

// JWT utilities
export interface JWTPayload {
  userId: string;
  email: string;
  role: string;
  iat?: number;
  exp?: number;
}

export const generateToken = (user: User & { role?: string }): string => {
  const payload: JWTPayload = {
    userId: user.id,
    email: user.email,
    role: user.role || "user",
  };

  return jwt.sign(payload, config.jwtSecret, {
    expiresIn: config.jwtExpiresIn,
  });
};

export const verifyToken = (token: string): JWTPayload => {
  return jwt.verify(token, config.jwtSecret) as JWTPayload;
};

// Rate limiting
export const rateLimiter = new rateLimit.RateLimiterMemory({
  keyGenerator: (req: Request) => req.ip || "unknown",
  points: config.rateLimitMax,
  duration: config.rateLimitWindow / 1000, // Convert to seconds
});

export const createRateLimitMiddleware = (
  points: number = config.rateLimitMax,
) => {
  const limiter = new rateLimit.RateLimiterMemory({
    keyGenerator: (req: Request) => req.ip || "unknown",
    points,
    duration: config.rateLimitWindow / 1000,
  });

  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await limiter.consume(req.ip || "unknown");
      next();
    } catch (rateLimiterRes) {
      res.status(429).json({
        error: "Too many requests",
        retryAfter: Math.round(rateLimiterRes.msBeforeNext) || 1,
      });
    }
  };
};

// Authentication middleware
export const authenticateToken = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(" ")[1];

    if (!token) {
      return res.status(401).json({ error: "Access token required" });
    }

    const payload = verifyToken(token);
    req.user = payload;
    next();
  } catch (error) {
    return res.status(403).json({ error: "Invalid or expired token" });
  }
};

// Role-based authorization middleware
export const requireRole = (roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ error: "Authentication required" });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ error: "Insufficient permissions" });
    }

    next();
  };
};

// Security headers
export const securityHeaders = helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https:"],
      scriptSrc: ["'self'", "https:"],
      imgSrc: ["'self'", "data:", "https:"],
      connectSrc: ["'self'", "https:", "wss:"],
      fontSrc: ["'self'", "https:"],
      objectSrc: ["'none'"],
      mediaSrc: ["'self'", "https:"],
      frameSrc: ["'self'", "https:"],
    },
  },
  crossOriginEmbedderPolicy: false,
});

// CORS configuration
export const corsOptions = {
  origin: (
    origin: string | undefined,
    callback: (err: Error | null, allow?: boolean) => void,
  ) => {
    const allowedOrigins = [
      "http://localhost:3000",
      "http://localhost:5000",
      "https://yourdomain.com",
      process.env.FRONTEND_URL,
    ].filter(Boolean);

    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
};

// Input validation helpers
export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePassword = (
  password: string,
): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];

  if (password.length < 8) {
    errors.push("Password must be at least 8 characters long");
  }

  if (!/(?=.*[a-z])/.test(password)) {
    errors.push("Password must contain at least one lowercase letter");
  }

  if (!/(?=.*[A-Z])/.test(password)) {
    errors.push("Password must contain at least one uppercase letter");
  }

  if (!/(?=.*\d)/.test(password)) {
    errors.push("Password must contain at least one number");
  }

  if (!/(?=.*[@$!%*?&])/.test(password)) {
    errors.push("Password must contain at least one special character");
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

// Request sanitization
export const sanitizeInput = (input: any): any => {
  if (typeof input === "string") {
    return input
      .trim()
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "");
  }

  if (Array.isArray(input)) {
    return input.map(sanitizeInput);
  }

  if (typeof input === "object" && input !== null) {
    const sanitized: any = {};
    for (const [key, value] of Object.entries(input)) {
      sanitized[key] = sanitizeInput(value);
    }
    return sanitized;
  }

  return input;
};

// Error handling
export class AppError extends Error {
  statusCode: number;
  isOperational: boolean;

  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

export const globalErrorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  let statusCode = 500;
  let message = "Internal server error";

  if (err instanceof AppError) {
    statusCode = err.statusCode;
    message = err.message;
  } else if (err.name === "ValidationError") {
    statusCode = 400;
    message = "Validation error";
  } else if (err.name === "JsonWebTokenError") {
    statusCode = 401;
    message = "Invalid token";
  } else if (err.name === "TokenExpiredError") {
    statusCode = 401;
    message = "Token expired";
  }

  console.error(`Error ${statusCode}:`, err);

  res.status(statusCode).json({
    error: message,
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  });
};
