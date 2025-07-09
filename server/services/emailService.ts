import nodemailer from "nodemailer";
import { User, Profile } from "@shared/schema";

interface EmailConfig {
  smtp: {
    host: string;
    port: number;
    secure: boolean;
    auth: {
      user: string;
      pass: string;
    };
  };
  from: {
    name: string;
    email: string;
  };
}

// Email configuration
const emailConfig: EmailConfig = {
  smtp: {
    host: process.env.SMTP_HOST || "smtp.gmail.com",
    port: parseInt(process.env.SMTP_PORT || "587"),
    secure: process.env.SMTP_SECURE === "true",
    auth: {
      user: process.env.SMTP_USER || "",
      pass: process.env.SMTP_PASS || "",
    },
  },
  from: {
    name: process.env.EMAIL_FROM_NAME || "Softchat",
    email: process.env.EMAIL_FROM_EMAIL || "noreply@softchat.com",
  },
};

// Create transporter
const createTransporter = () => {
  return nodemailer.createTransport({
    host: emailConfig.smtp.host,
    port: emailConfig.smtp.port,
    secure: emailConfig.smtp.secure,
    auth: emailConfig.smtp.auth,
  });
};

// Email templates
const emailTemplates = {
  welcome: (user: User, profile: Profile) => ({
    subject: "Welcome to Softchat! 🎉",
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Welcome to Softchat</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
          .button { display: inline-block; background: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
          .features { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin: 20px 0; }
          .feature { background: white; padding: 20px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
          .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Welcome to Softchat!</h1>
            <p>The AI-powered everything platform</p>
          </div>
          <div class="content">
            <h2>Hi ${profile?.name || user.email}! 👋</h2>
            <p>Welcome to the most advanced social platform with AI recommendations, comprehensive analytics, and full accessibility. We're excited to have you join our community of creators, traders, sellers, and innovators!</p>

            <a href="${process.env.FRONTEND_URL}/app" class="button">Get Started Now</a>

            <div class="features">
              <div class="feature">
                <h3>🤖 AI-Powered</h3>
                <p>Smart recommendations and content analysis</p>
              </div>
              <div class="feature">
                <h3>💰 Crypto Trading</h3>
                <p>P2P trading and portfolio management</p>
              </div>
              <div class="feature">
                <h3>🛒 Marketplace</h3>
                <p>Buy and sell products with ease</p>
              </div>
              <div class="feature">
                <h3>💼 Freelancing</h3>
                <p>Find jobs or hire talented freelancers</p>
              </div>
            </div>

            <h3>What's next?</h3>
            <ul>
              <li>Complete your profile to get personalized recommendations</li>
              <li>Follow interesting creators and join communities</li>
              <li>Explore the marketplace and crypto trading features</li>
              <li>Start earning SoftPoints through platform engagement</li>
            </ul>

            <p>If you have any questions, our support team is here to help. Just reply to this email!</p>

            <p>Happy creating! 🚀<br>The Softchat Team</p>
          </div>
          <div class="footer">
            <p>© 2024 Softchat. All rights reserved.</p>
            <p>If you didn't create this account, please ignore this email.</p>
          </div>
        </div>
      </body>
      </html>
    `,
  }),

  emailVerification: (user: User, verificationToken: string) => ({
    subject: "Verify your Softchat email address",
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Verify Email</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #667eea; color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
          .button { display: inline-block; background: #667eea; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; font-weight: bold; }
          .code { background: #e8f4f8; padding: 15px; border-radius: 5px; font-family: monospace; font-size: 18px; letter-spacing: 2px; text-align: center; margin: 20px 0; }
          .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🔐 Verify Your Email</h1>
          </div>
          <div class="content">
            <h2>Almost there!</h2>
            <p>Please verify your email address to complete your Softchat account setup.</p>

            <a href="${process.env.FRONTEND_URL}/verify-email?token=${verificationToken}" class="button">Verify Email Address</a>

            <p>Or enter this verification code manually:</p>
            <div class="code">${verificationToken.slice(0, 6).toUpperCase()}</div>

            <p><strong>Security tip:</strong> This link will expire in 24 hours for your security.</p>

            <p>If you didn't create a Softchat account, please ignore this email.</p>
          </div>
          <div class="footer">
            <p>© 2024 Softchat. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `,
  }),

  passwordReset: (user: User, resetToken: string) => ({
    subject: "Reset your Softchat password",
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Password Reset</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #e74c3c; color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
          .button { display: inline-block; background: #e74c3c; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; font-weight: bold; }
          .warning { background: #fff3cd; border: 1px solid #ffeaa7; padding: 15px; border-radius: 5px; margin: 20px 0; }
          .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🔑 Password Reset</h1>
          </div>
          <div class="content">
            <h2>Reset your password</h2>
            <p>We received a request to reset your Softchat password. Click the button below to set a new password:</p>

            <a href="${process.env.FRONTEND_URL}/reset-password?token=${resetToken}" class="button">Reset Password</a>

            <div class="warning">
              <strong>⚠️ Security Notice:</strong>
              <ul>
                <li>This link will expire in 1 hour</li>
                <li>If you didn't request this reset, please ignore this email</li>
                <li>Your current password remains unchanged until you set a new one</li>
              </ul>
            </div>

            <p>For your security, we recommend choosing a strong password that includes:</p>
            <ul>
              <li>At least 8 characters</li>
              <li>Uppercase and lowercase letters</li>
              <li>Numbers and special characters</li>
            </ul>
          </div>
          <div class="footer">
            <p>© 2024 Softchat. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `,
  }),

  notification: (
    user: User,
    title: string,
    content: string,
    actionUrl?: string,
  ) => ({
    subject: `Softchat: ${title}`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${title}</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #667eea; color: white; padding: 20px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
          .button { display: inline-block; background: #667eea; color: white; padding: 12px 25px; text-decoration: none; border-radius: 5px; margin: 15px 0; }
          .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>${title}</h1>
          </div>
          <div class="content">
            <p>${content}</p>
            ${actionUrl ? `<a href="${actionUrl}" class="button">View on Softchat</a>` : ""}
            <p>Stay connected with your Softchat community!</p>
          </div>
          <div class="footer">
            <p>© 2024 Softchat. All rights reserved.</p>
            <p><a href="${process.env.FRONTEND_URL}/settings/notifications">Manage email preferences</a></p>
          </div>
        </div>
      </body>
      </html>
    `,
  }),
};

export class EmailService {
  private transporter: nodemailer.Transporter;

  constructor() {
    this.transporter = createTransporter();
  }

  // Send welcome email
  async sendWelcomeEmail(user: User, profile: Profile): Promise<boolean> {
    try {
      const template = emailTemplates.welcome(user, profile);

      await this.transporter.sendMail({
        from: `${emailConfig.from.name} <${emailConfig.from.email}>`,
        to: user.email,
        subject: template.subject,
        html: template.html,
      });

      console.log(`Welcome email sent to ${user.email}`);
      return true;
    } catch (error) {
      console.error("Failed to send welcome email:", error);
      return false;
    }
  }

  // Send email verification
  async sendEmailVerification(
    user: User,
    verificationToken: string,
  ): Promise<boolean> {
    try {
      const template = emailTemplates.emailVerification(
        user,
        verificationToken,
      );

      await this.transporter.sendMail({
        from: `${emailConfig.from.name} <${emailConfig.from.email}>`,
        to: user.email,
        subject: template.subject,
        html: template.html,
      });

      console.log(`Verification email sent to ${user.email}`);
      return true;
    } catch (error) {
      console.error("Failed to send verification email:", error);
      return false;
    }
  }

  // Send password reset email
  async sendPasswordReset(user: User, resetToken: string): Promise<boolean> {
    try {
      const template = emailTemplates.passwordReset(user, resetToken);

      await this.transporter.sendMail({
        from: `${emailConfig.from.name} <${emailConfig.from.email}>`,
        to: user.email,
        subject: template.subject,
        html: template.html,
      });

      console.log(`Password reset email sent to ${user.email}`);
      return true;
    } catch (error) {
      console.error("Failed to send password reset email:", error);
      return false;
    }
  }

  // Send notification email
  async sendNotificationEmail(
    user: User,
    title: string,
    content: string,
    actionUrl?: string,
  ): Promise<boolean> {
    try {
      const template = emailTemplates.notification(
        user,
        title,
        content,
        actionUrl,
      );

      await this.transporter.sendMail({
        from: `${emailConfig.from.name} <${emailConfig.from.email}>`,
        to: user.email,
        subject: template.subject,
        html: template.html,
      });

      console.log(`Notification email sent to ${user.email}`);
      return true;
    } catch (error) {
      console.error("Failed to send notification email:", error);
      return false;
    }
  }

  // Send custom email
  async sendCustomEmail(
    to: string,
    subject: string,
    html: string,
    text?: string,
  ): Promise<boolean> {
    try {
      await this.transporter.sendMail({
        from: `${emailConfig.from.name} <${emailConfig.from.email}>`,
        to,
        subject,
        html,
        text,
      });

      console.log(`Custom email sent to ${to}`);
      return true;
    } catch (error) {
      console.error("Failed to send custom email:", error);
      return false;
    }
  }

  // Send bulk emails
  async sendBulkEmails(
    recipients: { email: string; data: any }[],
    template: "welcome" | "notification",
    templateData: any,
  ): Promise<{ success: number; failed: number }> {
    let success = 0;
    let failed = 0;

    for (const recipient of recipients) {
      try {
        let emailTemplate;

        switch (template) {
          case "welcome":
            emailTemplate = emailTemplates.welcome(
              { email: recipient.email } as User,
              recipient.data.profile,
            );
            break;
          case "notification":
            emailTemplate = emailTemplates.notification(
              { email: recipient.email } as User,
              templateData.title,
              templateData.content,
              templateData.actionUrl,
            );
            break;
          default:
            throw new Error("Invalid template");
        }

        await this.transporter.sendMail({
          from: `${emailConfig.from.name} <${emailConfig.from.email}>`,
          to: recipient.email,
          subject: emailTemplate.subject,
          html: emailTemplate.html,
        });

        success++;
      } catch (error) {
        console.error(`Failed to send email to ${recipient.email}:`, error);
        failed++;
      }
    }

    console.log(`Bulk email completed: ${success} success, ${failed} failed`);
    return { success, failed };
  }

  // Verify email configuration
  async verifyConnection(): Promise<boolean> {
    try {
      await this.transporter.verify();
      console.log("Email service connection verified");
      return true;
    } catch (error) {
      console.error("Email service connection failed:", error);
      return false;
    }
  }
}

// Export singleton instance
export const emailService = new EmailService();

// Email queue for background processing
interface EmailJob {
  id: string;
  type:
    | "welcome"
    | "verification"
    | "password-reset"
    | "notification"
    | "custom";
  recipient: string;
  data: any;
  attempts: number;
  maxAttempts: number;
  createdAt: Date;
}

class EmailQueue {
  private queue: EmailJob[] = [];
  private processing = false;

  // Add email to queue
  add(job: Omit<EmailJob, "id" | "attempts" | "createdAt">): void {
    this.queue.push({
      ...job,
      id: `email_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      attempts: 0,
      createdAt: new Date(),
    });

    if (!this.processing) {
      this.process();
    }
  }

  // Process email queue
  private async process(): Promise<void> {
    if (this.processing || this.queue.length === 0) {
      return;
    }

    this.processing = true;

    while (this.queue.length > 0) {
      const job = this.queue.shift()!;

      try {
        await this.executeJob(job);
        console.log(`Email job ${job.id} completed successfully`);
      } catch (error) {
        job.attempts++;

        if (job.attempts < job.maxAttempts) {
          console.log(
            `Email job ${job.id} failed, retrying (${job.attempts}/${job.maxAttempts})`,
          );
          this.queue.push(job); // Retry
        } else {
          console.error(`Email job ${job.id} failed permanently:`, error);
        }
      }
    }

    this.processing = false;
  }

  // Execute individual email job
  private async executeJob(job: EmailJob): Promise<void> {
    switch (job.type) {
      case "welcome":
        await emailService.sendWelcomeEmail(job.data.user, job.data.profile);
        break;
      case "verification":
        await emailService.sendEmailVerification(job.data.user, job.data.token);
        break;
      case "password-reset":
        await emailService.sendPasswordReset(job.data.user, job.data.token);
        break;
      case "notification":
        await emailService.sendNotificationEmail(
          job.data.user,
          job.data.title,
          job.data.content,
          job.data.actionUrl,
        );
        break;
      case "custom":
        await emailService.sendCustomEmail(
          job.recipient,
          job.data.subject,
          job.data.html,
          job.data.text,
        );
        break;
    }
  }

  // Get queue status
  getStatus(): { pending: number; processing: boolean } {
    return {
      pending: this.queue.length,
      processing: this.processing,
    };
  }
}

export const emailQueue = new EmailQueue();
