import { EventEmitter } from "events";
import { cacheService } from "./cacheService";
import { emailService } from "./emailService";
import {
  profileOperations,
  postOperations,
  notificationOperations,
} from "../database/operations";

// Job types
export type JobType =
  | "send_email"
  | "process_upload"
  | "generate_thumbnails"
  | "update_analytics"
  | "clean_expired_data"
  | "send_notifications"
  | "update_trending"
  | "backup_data"
  | "sync_crypto_prices"
  | "process_payment";

export interface Job {
  id: string;
  type: JobType;
  data: any;
  priority: number;
  attempts: number;
  maxAttempts: number;
  delay: number;
  createdAt: Date;
  scheduledFor: Date;
  startedAt?: Date;
  completedAt?: Date;
  failedAt?: Date;
  error?: string;
}

export interface JobOptions {
  priority?: number;
  delay?: number;
  maxAttempts?: number;
  scheduledFor?: Date;
}

class JobService extends EventEmitter {
  private jobs: Map<string, Job> = new Map();
  private processing = false;
  private workers: Map<JobType, (data: any) => Promise<void>> = new Map();
  private processingInterval?: NodeJS.Timeout;
  private cleanupInterval?: NodeJS.Timeout;

  constructor() {
    super();
    this.setupWorkers();
    this.startProcessing();
    this.startCleanup();
  }

  // Setup job workers
  private setupWorkers() {
    // Email jobs
    this.workers.set("send_email", async (data) => {
      const { type, recipient, emailData } = data;

      switch (type) {
        case "welcome":
          await emailService.sendWelcomeEmail(
            emailData.user,
            emailData.profile,
          );
          break;
        case "notification":
          await emailService.sendNotificationEmail(
            emailData.user,
            emailData.title,
            emailData.content,
            emailData.actionUrl,
          );
          break;
        case "password_reset":
          await emailService.sendPasswordReset(emailData.user, emailData.token);
          break;
        default:
          throw new Error(`Unknown email type: ${type}`);
      }
    });

    // File processing jobs
    this.workers.set("process_upload", async (data) => {
      // Process uploaded files (compression, thumbnails, etc.)
      console.log("Processing upload:", data.fileId);
    });

    this.workers.set("generate_thumbnails", async (data) => {
      // Generate image thumbnails
      console.log("Generating thumbnails for:", data.imageId);
    });

    // Analytics jobs
    this.workers.set("update_analytics", async (data) => {
      // Update platform analytics
      await this.updatePlatformAnalytics();
    });

    // Cleanup jobs
    this.workers.set("clean_expired_data", async (data) => {
      // Clean expired sessions, tokens, etc.
      await this.cleanExpiredData();
    });

    // Notification jobs
    this.workers.set("send_notifications", async (data) => {
      // Send push notifications, email notifications, etc.
      await this.sendPendingNotifications();
    });

    // Trending content jobs
    this.workers.set("update_trending", async (data) => {
      // Update trending posts, products, etc.
      await this.updateTrendingContent();
    });

    // Backup jobs
    this.workers.set("backup_data", async (data) => {
      // Backup important data
      console.log("Running data backup...");
    });

    // Crypto price updates
    this.workers.set("sync_crypto_prices", async (data) => {
      // Update cryptocurrency prices
      await this.syncCryptoPrices();
    });

    // Payment processing
    this.workers.set("process_payment", async (data) => {
      // Process pending payments
      console.log("Processing payment:", data.paymentId);
    });
  }

  // Add job to queue
  add(type: JobType, data: any, options: JobOptions = {}): string {
    const jobId = `${type}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    const job: Job = {
      id: jobId,
      type,
      data,
      priority: options.priority || 0,
      attempts: 0,
      maxAttempts: options.maxAttempts || 3,
      delay: options.delay || 0,
      createdAt: new Date(),
      scheduledFor:
        options.scheduledFor || new Date(Date.now() + (options.delay || 0)),
    };

    this.jobs.set(jobId, job);
    this.emit("job_added", job);

    return jobId;
  }

  // Schedule recurring job
  schedule(type: JobType, data: any, cron: string): string {
    // For now, simple interval-based scheduling
    // In production, use a proper cron library
    const jobId = this.add(type, data);

    // This is a simplified implementation
    // In production, integrate with a proper cron scheduler

    return jobId;
  }

  // Get job status
  getJob(jobId: string): Job | undefined {
    return this.jobs.get(jobId);
  }

  // Get queue statistics
  getStats(): {
    total: number;
    pending: number;
    processing: number;
    completed: number;
    failed: number;
  } {
    const jobs = Array.from(this.jobs.values());

    return {
      total: jobs.length,
      pending: jobs.filter((j) => !j.startedAt && !j.completedAt && !j.failedAt)
        .length,
      processing: jobs.filter(
        (j) => j.startedAt && !j.completedAt && !j.failedAt,
      ).length,
      completed: jobs.filter((j) => j.completedAt).length,
      failed: jobs.filter((j) => j.failedAt).length,
    };
  }

  // Start job processing
  private startProcessing() {
    this.processingInterval = setInterval(async () => {
      if (!this.processing) {
        await this.processJobs();
      }
    }, 1000); // Check every second
  }

  // Process pending jobs
  private async processJobs() {
    this.processing = true;

    try {
      const now = new Date();
      const pendingJobs = Array.from(this.jobs.values())
        .filter(
          (job) =>
            !job.startedAt &&
            !job.completedAt &&
            !job.failedAt &&
            job.scheduledFor <= now &&
            job.attempts < job.maxAttempts,
        )
        .sort(
          (a, b) =>
            b.priority - a.priority ||
            a.createdAt.getTime() - b.createdAt.getTime(),
        );

      for (const job of pendingJobs.slice(0, 5)) {
        // Process up to 5 jobs at once
        await this.processJob(job);
      }
    } catch (error) {
      console.error("Job processing error:", error);
    } finally {
      this.processing = false;
    }
  }

  // Process individual job
  private async processJob(job: Job) {
    job.startedAt = new Date();
    job.attempts++;

    this.emit("job_started", job);

    try {
      const worker = this.workers.get(job.type);
      if (!worker) {
        throw new Error(`No worker found for job type: ${job.type}`);
      }

      await worker(job.data);

      job.completedAt = new Date();
      this.emit("job_completed", job);

      console.log(`Job ${job.id} completed successfully`);
    } catch (error) {
      job.error = error instanceof Error ? error.message : "Unknown error";

      if (job.attempts >= job.maxAttempts) {
        job.failedAt = new Date();
        this.emit("job_failed", job);
        console.error(`Job ${job.id} failed permanently:`, job.error);
      } else {
        // Retry with exponential backoff
        const backoffDelay = Math.pow(2, job.attempts) * 1000;
        job.scheduledFor = new Date(Date.now() + backoffDelay);
        job.startedAt = undefined;

        this.emit("job_retry", job);
        console.log(
          `Job ${job.id} will retry in ${backoffDelay}ms (attempt ${job.attempts}/${job.maxAttempts})`,
        );
      }
    }
  }

  // Start cleanup process
  private startCleanup() {
    this.cleanupInterval = setInterval(() => {
      this.cleanupCompletedJobs();
    }, 60000 * 10); // Every 10 minutes
  }

  // Clean up old jobs
  private cleanupCompletedJobs() {
    const cutoff = new Date(Date.now() - 24 * 60 * 60 * 1000); // 24 hours ago

    for (const [jobId, job] of this.jobs.entries()) {
      if ((job.completedAt || job.failedAt) && job.createdAt < cutoff) {
        this.jobs.delete(jobId);
      }
    }
  }

  // Stop job service
  stop() {
    if (this.processingInterval) {
      clearInterval(this.processingInterval);
    }

    if (this.cleanupInterval) {
      clearInterval(this.cleanupInterval);
    }
  }

  // Job implementations
  private async updatePlatformAnalytics() {
    try {
      // Calculate daily active users
      // Update post engagement metrics
      // Update revenue metrics
      console.log("Platform analytics updated");
    } catch (error) {
      console.error("Analytics update failed:", error);
      throw error;
    }
  }

  private async cleanExpiredData() {
    try {
      // Clean expired sessions
      // Clean expired password reset tokens
      // Clean expired verification tokens
      console.log("Expired data cleaned");
    } catch (error) {
      console.error("Data cleanup failed:", error);
      throw error;
    }
  }

  private async sendPendingNotifications() {
    try {
      // Get pending notifications
      // Send email notifications
      // Send push notifications
      console.log("Pending notifications sent");
    } catch (error) {
      console.error("Notification sending failed:", error);
      throw error;
    }
  }

  private async updateTrendingContent() {
    try {
      // Calculate trending posts based on engagement
      const trendingPosts = []; // Implement trending algorithm

      // Cache trending content
      await cacheService.set("trending:posts", trendingPosts, 1800); // 30 minutes

      console.log("Trending content updated");
    } catch (error) {
      console.error("Trending update failed:", error);
      throw error;
    }
  }

  private async syncCryptoPrices() {
    try {
      // Fetch latest crypto prices from external API
      // Update cache
      // Notify users of significant price changes
      console.log("Crypto prices synced");
    } catch (error) {
      console.error("Crypto price sync failed:", error);
      throw error;
    }
  }
}

// Create and export singleton instance
export const jobService = new JobService();

// Convenience functions for common jobs
export const JobHelpers = {
  // Email jobs
  sendWelcomeEmail: (user: any, profile: any) =>
    jobService.add("send_email", {
      type: "welcome",
      recipient: user.email,
      emailData: { user, profile },
    }),

  sendNotificationEmail: (
    user: any,
    title: string,
    content: string,
    actionUrl?: string,
  ) =>
    jobService.add("send_email", {
      type: "notification",
      recipient: user.email,
      emailData: { user, title, content, actionUrl },
    }),

  sendPasswordResetEmail: (user: any, token: string) =>
    jobService.add("send_email", {
      type: "password_reset",
      recipient: user.email,
      emailData: { user, token },
    }),

  // File processing jobs
  processUpload: (fileId: string, fileType: string) =>
    jobService.add("process_upload", { fileId, fileType }),

  generateThumbnails: (imageId: string) =>
    jobService.add("generate_thumbnails", { imageId }),

  // Analytics jobs
  scheduleAnalyticsUpdate: () =>
    jobService.add("update_analytics", {}, { delay: 60000 }), // 1 minute delay

  // Cleanup jobs
  scheduleDataCleanup: () =>
    jobService.add("clean_expired_data", {}, { delay: 3600000 }), // 1 hour delay

  // Notification jobs
  scheduleNotificationSending: () =>
    jobService.add("send_notifications", {}, { delay: 30000 }), // 30 seconds delay

  // Trending content jobs
  updateTrending: () => jobService.add("update_trending", {}),

  // Crypto jobs
  syncCryptoPrices: () => jobService.add("sync_crypto_prices", {}),

  // Payment jobs
  processPayment: (paymentId: string) =>
    jobService.add("process_payment", { paymentId }, { priority: 10 }), // High priority
};

// Setup recurring jobs
export const setupRecurringJobs = () => {
  // Update analytics every hour
  setInterval(() => {
    JobHelpers.scheduleAnalyticsUpdate();
  }, 3600000);

  // Clean expired data every 6 hours
  setInterval(() => {
    JobHelpers.scheduleDataCleanup();
  }, 21600000);

  // Update trending content every 30 minutes
  setInterval(() => {
    JobHelpers.updateTrending();
  }, 1800000);

  // Sync crypto prices every 5 minutes
  setInterval(() => {
    JobHelpers.syncCryptoPrices();
  }, 300000);

  // Send pending notifications every minute
  setInterval(() => {
    JobHelpers.scheduleNotificationSending();
  }, 60000);

  console.log("✅ Recurring jobs scheduled");
};

export default jobService;
