import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Shield,
  CheckCircle,
  AlertTriangle,
  Lock,
  Eye,
  EyeOff,
  CreditCard,
  FileText,
  Camera,
  Phone,
  Mail,
  MapPin,
  Star,
  TrendingUp,
  DollarSign,
  Clock,
  Users,
  AlertCircle,
  Settings,
  Zap,
  Ban,
  Flag,
  Award,
  Fingerprint,
  Key,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/components/ui/use-toast";

interface IdentityVerification {
  id: string;
  type: "id-document" | "address" | "phone" | "email" | "payment";
  status: "pending" | "verified" | "rejected" | "expired";
  verifiedAt?: Date;
  expiresAt?: Date;
  rejectionReason?: string;
  documents?: string[];
}

interface TrustMetric {
  category: string;
  score: number;
  maxScore: number;
  factors: Array<{
    name: string;
    value: number;
    weight: number;
    description: string;
  }>;
}

interface EscrowTransaction {
  id: string;
  projectId: string;
  amount: number;
  status: "held" | "released" | "disputed" | "refunded";
  createdAt: Date;
  releasedAt?: Date;
  disputeReason?: string;
  clientId: string;
  freelancerId: string;
}

interface FraudAlert {
  id: string;
  type:
    | "suspicious-payment"
    | "unusual-activity"
    | "fake-profile"
    | "spam-behavior";
  severity: "low" | "medium" | "high" | "critical";
  description: string;
  timestamp: Date;
  status: "active" | "investigating" | "resolved" | "false-positive";
  affectedUsers: string[];
}

interface PrivacySetting {
  category: string;
  setting: string;
  enabled: boolean;
  description: string;
}

const mockVerifications: IdentityVerification[] = [
  {
    id: "1",
    type: "email",
    status: "verified",
    verifiedAt: new Date("2024-01-10"),
  },
  {
    id: "2",
    type: "phone",
    status: "verified",
    verifiedAt: new Date("2024-01-12"),
  },
  {
    id: "3",
    type: "id-document",
    status: "pending",
    documents: ["passport-front.jpg", "passport-back.jpg"],
  },
  {
    id: "4",
    type: "address",
    status: "rejected",
    rejectionReason: "Document not clear enough",
    documents: ["utility-bill.pdf"],
  },
  {
    id: "5",
    type: "payment",
    status: "verified",
    verifiedAt: new Date("2024-01-15"),
  },
];

const mockTrustMetrics: TrustMetric[] = [
  {
    category: "Identity Verification",
    score: 85,
    maxScore: 100,
    factors: [
      {
        name: "Email Verified",
        value: 20,
        weight: 20,
        description: "Email address confirmed",
      },
      {
        name: "Phone Verified",
        value: 20,
        weight: 20,
        description: "Phone number confirmed",
      },
      {
        name: "ID Document",
        value: 25,
        weight: 30,
        description: "Government ID verified",
      },
      {
        name: "Address Proof",
        value: 0,
        weight: 20,
        description: "Address verification pending",
      },
      {
        name: "Payment Method",
        value: 20,
        weight: 10,
        description: "Payment method verified",
      },
    ],
  },
  {
    category: "Professional Track Record",
    score: 92,
    maxScore: 100,
    factors: [
      {
        name: "Client Reviews",
        value: 25,
        weight: 25,
        description: "4.9/5 average rating",
      },
      {
        name: "Project Success",
        value: 23,
        weight: 25,
        description: "95% completion rate",
      },
      {
        name: "Response Time",
        value: 22,
        weight: 20,
        description: "Average 2-hour response",
      },
      {
        name: "Repeat Clients",
        value: 15,
        weight: 20,
        description: "67% repeat client rate",
      },
      {
        name: "Portfolio Quality",
        value: 7,
        weight: 10,
        description: "Verified work samples",
      },
    ],
  },
  {
    category: "Platform Behavior",
    score: 88,
    maxScore: 100,
    factors: [
      {
        name: "Account Age",
        value: 20,
        weight: 20,
        description: "2+ years on platform",
      },
      {
        name: "Activity Level",
        value: 25,
        weight: 30,
        description: "Regular platform usage",
      },
      {
        name: "Communication",
        value: 23,
        weight: 25,
        description: "Professional communication",
      },
      {
        name: "Compliance",
        value: 20,
        weight: 25,
        description: "No policy violations",
      },
    ],
  },
];

const mockEscrowTransactions: EscrowTransaction[] = [
  {
    id: "1",
    projectId: "proj-1",
    amount: 2500,
    status: "released",
    createdAt: new Date("2024-01-10"),
    releasedAt: new Date("2024-01-25"),
    clientId: "client-1",
    freelancerId: "freelancer-1",
  },
  {
    id: "2",
    projectId: "proj-2",
    amount: 3500,
    status: "held",
    createdAt: new Date("2024-01-20"),
    clientId: "client-2",
    freelancerId: "freelancer-1",
  },
];

const mockFraudAlerts: FraudAlert[] = [
  {
    id: "1",
    type: "suspicious-payment",
    severity: "medium",
    description:
      "Unusual payment pattern detected from IP address in different country",
    timestamp: new Date("2024-01-20"),
    status: "investigating",
    affectedUsers: ["user-1"],
  },
  {
    id: "2",
    type: "unusual-activity",
    severity: "low",
    description: "Multiple rapid profile updates detected",
    timestamp: new Date("2024-01-19"),
    status: "resolved",
    affectedUsers: ["user-2"],
  },
];

const mockPrivacySettings: PrivacySetting[] = [
  {
    category: "Profile Visibility",
    setting: "Show real name to clients",
    enabled: true,
    description: "Display your real name in proposals and contracts",
  },
  {
    category: "Profile Visibility",
    setting: "Show location to public",
    enabled: false,
    description: "Make your location visible to all platform users",
  },
  {
    category: "Data Sharing",
    setting: "Analytics data sharing",
    enabled: true,
    description: "Share anonymized data to improve platform features",
  },
  {
    category: "Communication",
    setting: "Allow direct contact",
    enabled: false,
    description: "Allow clients to contact you outside platform",
  },
  {
    category: "Marketing",
    setting: "Promotional emails",
    enabled: true,
    description: "Receive emails about platform updates and opportunities",
  },
];

export const FreelanceSecurityCenter: React.FC = () => {
  const [verifications, setVerifications] = useState(mockVerifications);
  const [trustMetrics, setTrustMetrics] = useState(mockTrustMetrics);
  const [escrowTransactions, setEscrowTransactions] = useState(
    mockEscrowTransactions,
  );
  const [fraudAlerts, setFraudAlerts] = useState(mockFraudAlerts);
  const [privacySettings, setPrivacySettings] = useState(mockPrivacySettings);
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);

  const { user } = useAuth();
  const { toast } = useToast();

  const getVerificationIcon = (type: string) => {
    switch (type) {
      case "email":
        return <Mail className="h-5 w-5" />;
      case "phone":
        return <Phone className="h-5 w-5" />;
      case "id-document":
        return <FileText className="h-5 w-5" />;
      case "address":
        return <MapPin className="h-5 w-5" />;
      case "payment":
        return <CreditCard className="h-5 w-5" />;
      default:
        return <Shield className="h-5 w-5" />;
    }
  };

  const getVerificationColor = (status: string) => {
    switch (status) {
      case "verified":
        return "text-green-600 bg-green-50 border-green-200";
      case "pending":
        return "text-yellow-600 bg-yellow-50 border-yellow-200";
      case "rejected":
        return "text-red-600 bg-red-50 border-red-200";
      case "expired":
        return "text-gray-600 bg-gray-50 border-gray-200";
      default:
        return "text-gray-600 bg-gray-50 border-gray-200";
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "critical":
        return "text-red-600 bg-red-50 border-red-200";
      case "high":
        return "text-orange-600 bg-orange-50 border-orange-200";
      case "medium":
        return "text-yellow-600 bg-yellow-50 border-yellow-200";
      case "low":
        return "text-blue-600 bg-blue-50 border-blue-200";
      default:
        return "text-gray-600 bg-gray-50 border-gray-200";
    }
  };

  const getEscrowStatusColor = (status: string) => {
    switch (status) {
      case "released":
        return "text-green-600 bg-green-50";
      case "held":
        return "text-blue-600 bg-blue-50";
      case "disputed":
        return "text-red-600 bg-red-50";
      case "refunded":
        return "text-gray-600 bg-gray-50";
      default:
        return "text-gray-600 bg-gray-50";
    }
  };

  const calculateOverallTrustScore = () => {
    const totalScore = trustMetrics.reduce(
      (sum, metric) => sum + metric.score,
      0,
    );
    const maxPossible = trustMetrics.reduce(
      (sum, metric) => sum + metric.maxScore,
      0,
    );
    return Math.round((totalScore / maxPossible) * 100);
  };

  const startVerification = (type: string) => {
    toast({
      title: "Verification Started",
      description: `${type} verification process has been initiated.`,
    });

    // Update verification status to pending
    setVerifications((prev) =>
      prev.map((v) => (v.type === type ? { ...v, status: "pending" } : v)),
    );
  };

  const toggleTwoFactor = () => {
    setTwoFactorEnabled(!twoFactorEnabled);
    toast({
      title: twoFactorEnabled ? "2FA Disabled" : "2FA Enabled",
      description: twoFactorEnabled
        ? "Two-factor authentication has been disabled."
        : "Two-factor authentication has been enabled for enhanced security.",
    });
  };

  const updatePrivacySetting = (index: number, enabled: boolean) => {
    setPrivacySettings((prev) =>
      prev.map((setting, i) =>
        i === index ? { ...setting, enabled } : setting,
      ),
    );
    toast({
      title: "Privacy Setting Updated",
      description: "Your privacy preferences have been saved.",
    });
  };

  const overallTrustScore = calculateOverallTrustScore();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Shield className="h-6 w-6 text-blue-600" />
            Security & Trust Center
          </h2>
          <p className="text-muted-foreground">
            Manage your security settings and trust metrics
          </p>
        </div>
      </div>

      {/* Overall Trust Score */}
      <Card className="bg-gradient-to-r from-blue-50 to-purple-50">
        <CardContent className="p-6">
          <div className="flex items-center gap-6">
            <div className="text-center">
              <div className="relative w-24 h-24 mx-auto mb-3">
                <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 p-1">
                  <div className="w-full h-full rounded-full bg-white flex items-center justify-center">
                    <span className="text-2xl font-bold text-blue-600">
                      {overallTrustScore}
                    </span>
                  </div>
                </div>
              </div>
              <h3 className="font-semibold text-lg">Trust Score</h3>
              <p className="text-sm text-muted-foreground">
                Platform Reputation
              </p>
            </div>

            <div className="flex-1 space-y-2">
              <div className="flex items-center gap-2">
                <Award className="h-5 w-5 text-yellow-500" />
                <span className="font-medium">Verified Professional</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-500" />
                <span className="text-sm">Identity verified</span>
              </div>
              <div className="flex items-center gap-2">
                <Star className="h-5 w-5 text-yellow-500" />
                <span className="text-sm">Top-rated freelancer</span>
              </div>
              <div className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-blue-500" />
                <span className="text-sm">Enhanced security enabled</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="verification" className="space-y-4">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="verification">Verification</TabsTrigger>
          <TabsTrigger value="trust">Trust Metrics</TabsTrigger>
          <TabsTrigger value="escrow">Escrow Services</TabsTrigger>
          <TabsTrigger value="fraud">Fraud Detection</TabsTrigger>
          <TabsTrigger value="privacy">Privacy Controls</TabsTrigger>
        </TabsList>

        <TabsContent value="verification" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Fingerprint className="h-5 w-5 text-blue-600" />
                  Identity Verification
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {verifications.map((verification) => (
                  <div
                    key={verification.id}
                    className="flex items-center justify-between p-3 border rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`p-2 rounded-lg ${getVerificationColor(verification.status)}`}
                      >
                        {getVerificationIcon(verification.type)}
                      </div>
                      <div>
                        <h4 className="font-medium capitalize">
                          {verification.type.replace("-", " ")} Verification
                        </h4>
                        <p className="text-sm text-muted-foreground">
                          {verification.status === "verified" &&
                            verification.verifiedAt &&
                            `Verified ${verification.verifiedAt.toLocaleDateString()}`}
                          {verification.status === "pending" &&
                            "Verification in progress"}
                          {verification.status === "rejected" &&
                            verification.rejectionReason}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Badge
                        className={getVerificationColor(verification.status)}
                      >
                        {verification.status}
                      </Badge>
                      {verification.status !== "verified" && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => startVerification(verification.type)}
                        >
                          {verification.status === "pending"
                            ? "Retry"
                            : "Verify"}
                        </Button>
                      )}
                    </div>
                  </div>
                ))}

                <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                  <h4 className="font-medium mb-2">
                    Complete Your Verification
                  </h4>
                  <p className="text-sm text-muted-foreground mb-3">
                    Verified accounts earn more trust and get priority in client
                    searches.
                  </p>
                  <div className="flex items-center gap-2">
                    <span className="text-sm">Progress:</span>
                    <Progress
                      value={
                        (verifications.filter((v) => v.status === "verified")
                          .length /
                          verifications.length) *
                        100
                      }
                      className="flex-1"
                    />
                    <span className="text-sm font-medium">
                      {
                        verifications.filter((v) => v.status === "verified")
                          .length
                      }
                      /{verifications.length}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Key className="h-5 w-5 text-green-600" />
                  Account Security
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <h4 className="font-medium">Two-Factor Authentication</h4>
                    <p className="text-sm text-muted-foreground">
                      Add an extra layer of security to your account
                    </p>
                  </div>
                  <Switch
                    checked={twoFactorEnabled}
                    onCheckedChange={toggleTwoFactor}
                  />
                </div>

                <div className="space-y-3">
                  <div>
                    <Label htmlFor="current-password">Current Password</Label>
                    <Input
                      id="current-password"
                      type="password"
                      placeholder="Enter current password"
                    />
                  </div>
                  <div>
                    <Label htmlFor="new-password">New Password</Label>
                    <Input
                      id="new-password"
                      type="password"
                      placeholder="Enter new password"
                    />
                  </div>
                  <div>
                    <Label htmlFor="confirm-password">
                      Confirm New Password
                    </Label>
                    <Input
                      id="confirm-password"
                      type="password"
                      placeholder="Confirm new password"
                    />
                  </div>
                  <Button className="w-full">Update Password</Button>
                </div>

                <div className="p-3 bg-yellow-50 rounded-lg">
                  <h4 className="font-medium text-yellow-800 mb-1">
                    Security Tips
                  </h4>
                  <ul className="text-sm text-yellow-700 space-y-1">
                    <li>• Use a unique, strong password</li>
                    <li>• Enable two-factor authentication</li>
                    <li>• Don't share your login credentials</li>
                    <li>• Log out from shared computers</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="trust" className="space-y-4">
          <div className="space-y-6">
            {trustMetrics.map((metric, index) => (
              <Card key={index}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>{metric.category}</CardTitle>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-blue-600">
                        {metric.score}/{metric.maxScore}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {Math.round((metric.score / metric.maxScore) * 100)}%
                        Complete
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <Progress
                      value={(metric.score / metric.maxScore) * 100}
                      className="h-2"
                    />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {metric.factors.map((factor, i) => (
                        <div
                          key={i}
                          className="flex items-center justify-between p-3 border rounded-lg"
                        >
                          <div>
                            <h4 className="font-medium text-sm">
                              {factor.name}
                            </h4>
                            <p className="text-xs text-muted-foreground">
                              {factor.description}
                            </p>
                          </div>
                          <div className="text-right">
                            <div className="font-bold text-sm">
                              {factor.value}/{factor.weight}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              points
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="escrow" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lock className="h-5 w-5 text-green-600" />
                  Escrow Overview
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-3 bg-green-50 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">
                      $
                      {escrowTransactions
                        .filter((t) => t.status === "released")
                        .reduce((sum, t) => sum + t.amount, 0)
                        .toLocaleString()}
                    </div>
                    <div className="text-sm text-green-700">Total Released</div>
                  </div>
                  <div className="text-center p-3 bg-blue-50 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">
                      $
                      {escrowTransactions
                        .filter((t) => t.status === "held")
                        .reduce((sum, t) => sum + t.amount, 0)
                        .toLocaleString()}
                    </div>
                    <div className="text-sm text-blue-700">Currently Held</div>
                  </div>
                </div>

                <div className="p-4 bg-blue-50 rounded-lg">
                  <h4 className="font-medium mb-2">How Escrow Works</h4>
                  <ul className="text-sm text-blue-700 space-y-1">
                    <li>• Client deposits funds when hiring</li>
                    <li>• Funds held securely during project</li>
                    <li>• Released upon milestone completion</li>
                    <li>• Dispute resolution available</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Recent Transactions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {escrowTransactions.map((transaction) => (
                    <div
                      key={transaction.id}
                      className="flex items-center justify-between p-3 border rounded-lg"
                    >
                      <div>
                        <div className="font-medium">
                          ${transaction.amount.toLocaleString()}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          Project: {transaction.projectId}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {transaction.createdAt.toLocaleDateString()}
                        </div>
                      </div>
                      <Badge
                        className={getEscrowStatusColor(transaction.status)}
                      >
                        {transaction.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="fraud" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="h-5 w-5 text-orange-600" />
                  Fraud Detection System
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 bg-green-50 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <h4 className="font-medium text-green-800">
                      AI Protection Active
                    </h4>
                  </div>
                  <p className="text-sm text-green-700">
                    Our AI system continuously monitors for suspicious
                    activities and protects your account.
                  </p>
                </div>

                <div className="space-y-3">
                  <h4 className="font-medium">Protected Against:</h4>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="flex items-center gap-2 text-sm">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span>Identity theft</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span>Payment fraud</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span>Fake profiles</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span>Spam behavior</span>
                    </div>
                  </div>
                </div>

                <div className="p-3 bg-yellow-50 rounded-lg">
                  <h4 className="font-medium text-yellow-800 mb-1">
                    Report Suspicious Activity
                  </h4>
                  <p className="text-sm text-yellow-700 mb-2">
                    Help us keep the platform safe by reporting any suspicious
                    behavior.
                  </p>
                  <Button size="sm" variant="outline">
                    <Flag className="h-4 w-4 mr-1" />
                    Report Issue
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Security Alerts</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {fraudAlerts.map((alert) => (
                    <div key={alert.id} className="p-3 border rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <Badge className={getSeverityColor(alert.severity)}>
                          {alert.severity} risk
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          {alert.timestamp.toLocaleDateString()}
                        </span>
                      </div>
                      <h4 className="font-medium text-sm mb-1 capitalize">
                        {alert.type.replace("-", " ")}
                      </h4>
                      <p className="text-sm text-muted-foreground mb-2">
                        {alert.description}
                      </p>
                      <div className="flex items-center justify-between">
                        <Badge variant="outline" className="text-xs">
                          {alert.status}
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          {alert.affectedUsers.length} user(s) affected
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="privacy" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Eye className="h-5 w-5 text-purple-600" />
                  Privacy Controls
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {privacySettings.map((setting, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 border rounded-lg"
                  >
                    <div className="flex-1">
                      <h4 className="font-medium text-sm">{setting.setting}</h4>
                      <p className="text-xs text-muted-foreground">
                        {setting.description}
                      </p>
                      <Badge variant="outline" className="text-xs mt-1">
                        {setting.category}
                      </Badge>
                    </div>
                    <Switch
                      checked={setting.enabled}
                      onCheckedChange={(checked) =>
                        updatePrivacySetting(index, checked)
                      }
                    />
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Data Management</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <Button variant="outline" className="w-full justify-start">
                    <FileText className="h-4 w-4 mr-2" />
                    Download My Data
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Settings className="h-4 w-4 mr-2" />
                    Cookie Preferences
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Eye className="h-4 w-4 mr-2" />
                    Activity Log
                  </Button>
                </div>

                <div className="p-4 bg-red-50 rounded-lg">
                  <h4 className="font-medium text-red-800 mb-2">
                    Delete Account
                  </h4>
                  <p className="text-sm text-red-700 mb-3">
                    Permanently delete your account and all associated data.
                    This action cannot be undone.
                  </p>
                  <Button variant="destructive" size="sm">
                    <Ban className="h-4 w-4 mr-1" />
                    Delete Account
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};
