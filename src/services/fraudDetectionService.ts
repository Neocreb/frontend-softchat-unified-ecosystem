import { supabase } from "@/lib/supabase/client";

export interface FraudRiskAssessment {
  userId: string;
  riskScore: number; // 0-100, higher is riskier
  riskLevel: "low" | "medium" | "high" | "critical";
  reasons: string[];
  recommendations: string[];
  blockedActions?: string[];
  createdAt: string;
}

export interface SecurityEvent {
  id: string;
  userId: string;
  eventType:
    | "login"
    | "transaction"
    | "profile_change"
    | "document_upload"
    | "withdrawal"
    | "suspicious_activity";
  severity: "info" | "warning" | "critical";
  details: Record<string, any>;
  ipAddress: string;
  userAgent: string;
  location?: {
    country: string;
    city: string;
    coordinates?: [number, number];
  };
  createdAt: string;
}

export interface IdentityVerification {
  id: string;
  userId: string;
  verificationType: "email" | "phone" | "document" | "biometric" | "address";
  status: "pending" | "verified" | "failed" | "expired";
  verificationData: Record<string, any>;
  verifiedAt?: string;
  expiresAt?: string;
  createdAt: string;
}

class FraudDetectionService {
  private async recordSecurityEvent(
    event: Omit<SecurityEvent, "id" | "createdAt">,
  ): Promise<void> {
    try {
      await (supabase as any).from("security_events").insert({
        ...event,
        created_at: new Date().toISOString(),
      });
    } catch (error) {
      console.error("Error recording security event:", error);
    }
  }

  async assessRisk(
    userId: string,
    context: {
      action: string;
      amount?: number;
      ipAddress: string;
      userAgent: string;
      location?: any;
    },
  ): Promise<FraudRiskAssessment> {
    let riskScore = 0;
    const reasons: string[] = [];
    const recommendations: string[] = [];
    const blockedActions: string[] = [];

    try {
      // Check user history and patterns
      const userMetrics = await this.getUserMetrics(userId);
      const recentEvents = await this.getRecentSecurityEvents(userId);

      // Risk factor 1: New user (higher risk)
      if (userMetrics.accountAge < 7) {
        riskScore += 20;
        reasons.push("New account (less than 7 days old)");
        recommendations.push("Complete identity verification");
      }

      // Risk factor 2: High transaction volume
      if (
        context.amount &&
        context.amount > userMetrics.averageTransactionAmount * 5
      ) {
        riskScore += 25;
        reasons.push("Transaction amount significantly higher than usual");
        recommendations.push("Additional verification required");
      }

      // Risk factor 3: Location anomalies
      if (
        context.location &&
        userMetrics.usualCountry &&
        context.location.country !== userMetrics.usualCountry
      ) {
        riskScore += 15;
        reasons.push("Login from unusual location");
        recommendations.push("Verify device and location");
      }

      // Risk factor 4: Rapid succession of actions
      const recentActionsCount = recentEvents.filter(
        (e) => new Date(e.createdAt).getTime() > Date.now() - 15 * 60 * 1000, // 15 minutes
      ).length;

      if (recentActionsCount > 10) {
        riskScore += 30;
        reasons.push("High frequency of actions in short time");
        recommendations.push("Rate limiting applied");
      }

      // Risk factor 5: Failed verification attempts
      const failedVerifications = recentEvents.filter(
        (e) => e.eventType === "document_upload" && e.severity === "warning",
      ).length;

      if (failedVerifications > 2) {
        riskScore += 35;
        reasons.push("Multiple failed document verification attempts");
        blockedActions.push("document_upload", "withdrawal");
      }

      // Risk factor 6: Suspicious patterns
      const suspiciousPatterns = await this.detectSuspiciousPatterns(
        userId,
        recentEvents,
      );
      if (suspiciousPatterns.length > 0) {
        riskScore += 40;
        reasons.push(...suspiciousPatterns);
        recommendations.push("Manual review required");
      }

      // Determine risk level
      let riskLevel: FraudRiskAssessment["riskLevel"];
      if (riskScore >= 80) {
        riskLevel = "critical";
        blockedActions.push("withdrawal", "trading", "large_transactions");
      } else if (riskScore >= 60) {
        riskLevel = "high";
        blockedActions.push("withdrawal");
      } else if (riskScore >= 30) {
        riskLevel = "medium";
        recommendations.push("Complete additional verification");
      } else {
        riskLevel = "low";
      }

      // Record the assessment
      const assessment: FraudRiskAssessment = {
        userId,
        riskScore: Math.min(riskScore, 100),
        riskLevel,
        reasons,
        recommendations,
        blockedActions: blockedActions.length > 0 ? blockedActions : undefined,
        createdAt: new Date().toISOString(),
      };

      // Log security event
      await this.recordSecurityEvent({
        userId,
        eventType: "suspicious_activity",
        severity:
          riskLevel === "critical"
            ? "critical"
            : riskLevel === "high"
              ? "warning"
              : "info",
        details: { assessment, context },
        ipAddress: context.ipAddress,
        userAgent: context.userAgent,
        location: context.location,
      });

      return assessment;
    } catch (error) {
      console.error("Error assessing fraud risk:", error);
      return {
        userId,
        riskScore: 50,
        riskLevel: "medium",
        reasons: ["Error occurred during risk assessment"],
        recommendations: ["Manual review recommended"],
        createdAt: new Date().toISOString(),
      };
    }
  }

  private async getUserMetrics(userId: string) {
    try {
      // This would typically query your database for user metrics
      // For now, return mock data
      return {
        accountAge: 30, // days
        averageTransactionAmount: 1000,
        usualCountry: "US",
        totalTransactions: 25,
        successfulVerifications: 3,
        failedVerifications: 0,
      };
    } catch (error) {
      console.error("Error getting user metrics:", error);
      return {
        accountAge: 0,
        averageTransactionAmount: 0,
        usualCountry: null,
        totalTransactions: 0,
        successfulVerifications: 0,
        failedVerifications: 0,
      };
    }
  }

  private async getRecentSecurityEvents(
    userId: string,
  ): Promise<SecurityEvent[]> {
    try {
      const { data, error } = await (supabase as any)
        .from("security_events")
        .select("*")
        .eq("user_id", userId)
        .gte(
          "created_at",
          new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
        ) // Last 24 hours
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error("Error getting recent security events:", error);
      return [];
    }
  }

  private async detectSuspiciousPatterns(
    userId: string,
    events: SecurityEvent[],
  ): Promise<string[]> {
    const patterns: string[] = [];

    // Pattern 1: Multiple login attempts from different locations
    const loginEvents = events.filter((e) => e.eventType === "login");
    const uniqueLocations = new Set(
      loginEvents.map((e) => e.location?.country).filter(Boolean),
    );
    if (uniqueLocations.size > 3) {
      patterns.push("Multiple login attempts from different countries");
    }

    // Pattern 2: Rapid profile changes
    const profileChanges = events.filter(
      (e) => e.eventType === "profile_change",
    );
    if (profileChanges.length > 5) {
      patterns.push("Frequent profile modifications");
    }

    // Pattern 3: Large transactions after recent document uploads
    const documentUploads = events.filter(
      (e) => e.eventType === "document_upload",
    );
    const transactions = events.filter((e) => e.eventType === "transaction");
    if (documentUploads.length > 0 && transactions.length > 0) {
      const latestUpload = new Date(documentUploads[0].createdAt);
      const recentTransactions = transactions.filter(
        (t) =>
          new Date(t.createdAt) > latestUpload &&
          new Date(t.createdAt).getTime() - latestUpload.getTime() <
            60 * 60 * 1000, // 1 hour
      );
      if (recentTransactions.length > 0) {
        patterns.push("Large transactions shortly after document upload");
      }
    }

    return patterns;
  }

  async createIdentityVerification(
    verification: Omit<IdentityVerification, "id" | "createdAt">,
  ): Promise<IdentityVerification | null> {
    try {
      const { data, error } = await (supabase as any)
        .from("identity_verifications")
        .insert({
          ...verification,
          created_at: new Date().toISOString(),
        })
        .select("*")
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error("Error creating identity verification:", error);
      return null;
    }
  }

  async getIdentityVerifications(
    userId: string,
  ): Promise<IdentityVerification[]> {
    try {
      const { data, error } = await (supabase as any)
        .from("identity_verifications")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error("Error getting identity verifications:", error);
      return [];
    }
  }

  async updateVerificationStatus(
    verificationId: string,
    status: IdentityVerification["status"],
    verifiedAt?: string,
  ): Promise<boolean> {
    try {
      const updateData: any = { status };
      if (verifiedAt) {
        updateData.verified_at = verifiedAt;
      }

      const { error } = await (supabase as any)
        .from("identity_verifications")
        .update(updateData)
        .eq("id", verificationId);

      return !error;
    } catch (error) {
      console.error("Error updating verification status:", error);
      return false;
    }
  }

  // Biometric verification simulation
  async verifyBiometric(
    userId: string,
    biometricData: string,
  ): Promise<{ success: boolean; confidence: number }> {
    // In a real app, this would integrate with biometric verification services
    // For demo purposes, we'll simulate the verification
    const confidence = Math.random() * 0.3 + 0.7; // 70-100% confidence
    const success = confidence > 0.8;

    if (success) {
      await this.createIdentityVerification({
        userId,
        verificationType: "biometric",
        status: "verified",
        verificationData: { confidence },
        verifiedAt: new Date().toISOString(),
      });
    }

    return { success, confidence };
  }

  // Document authenticity check
  async verifyDocumentAuthenticity(
    documentUrl: string,
    documentType: string,
  ): Promise<{
    authentic: boolean;
    confidence: number;
    issues: string[];
  }> {
    // Simulate document verification AI
    const confidence = Math.random() * 0.4 + 0.6; // 60-100%
    const authentic = confidence > 0.75;
    const issues: string[] = [];

    if (!authentic) {
      issues.push("Document quality too low");
      if (Math.random() > 0.5) issues.push("Potential tampering detected");
      if (Math.random() > 0.7) issues.push("Document format not recognized");
    }

    return { authentic, confidence, issues };
  }
}

export const fraudDetectionService = new FraudDetectionService();
