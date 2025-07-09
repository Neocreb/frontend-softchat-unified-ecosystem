import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Shield,
  Upload,
  CheckCircle,
  Clock,
  XCircle,
  AlertTriangle,
  Camera,
  FileText,
  Smartphone,
  MapPin,
  Eye,
  Star,
  Award,
  Lock,
  Zap,
} from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { kycService, KYCDocument } from "@/services/kycService";
import {
  fraudDetectionService,
  FraudRiskAssessment,
  IdentityVerification,
} from "@/services/fraudDetectionService";
import { useAuth } from "@/contexts/AuthContext";

interface EnhancedKYCVerificationProps {
  userId: string;
  currentLevel: number;
  onLevelUpdate: (newLevel: number) => void;
}

const EnhancedKYCVerification: React.FC<EnhancedKYCVerificationProps> = ({
  userId,
  currentLevel,
  onLevelUpdate,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");
  const [selectedDocType, setSelectedDocType] = useState<string>("");
  const [uploading, setUploading] = useState(false);
  const [documents, setDocuments] = useState<KYCDocument[]>([]);
  const [riskAssessment, setRiskAssessment] =
    useState<FraudRiskAssessment | null>(null);
  const [identityVerifications, setIdentityVerifications] = useState<
    IdentityVerification[]
  >([]);
  const [biometricVerifying, setBiometricVerifying] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  useEffect(() => {
    if (isOpen) {
      loadUserData();
      performRiskAssessment();
    }
  }, [isOpen, userId]);

  const loadUserData = async () => {
    try {
      const [userDocs, verifications] = await Promise.all([
        kycService.getUserKYCDocuments(userId),
        fraudDetectionService.getIdentityVerifications(userId),
      ]);
      setDocuments(userDocs);
      setIdentityVerifications(verifications);
    } catch (error) {
      console.error("Error loading user data:", error);
    }
  };

  const performRiskAssessment = async () => {
    try {
      const assessment = await fraudDetectionService.assessRisk(userId, {
        action: "kyc_verification",
        ipAddress: "192.168.1.1", // In real app, get actual IP
        userAgent: navigator.userAgent,
        location: { country: "US", city: "New York" }, // In real app, get actual location
      });
      setRiskAssessment(assessment);
    } catch (error) {
      console.error("Error performing risk assessment:", error);
    }
  };

  const handleFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];
    if (!file || !selectedDocType) {
      toast({
        title: "Error",
        description: "Please select a document type and file.",
        variant: "destructive",
      });
      return;
    }

    // Check file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Please select a file smaller than 10MB.",
        variant: "destructive",
      });
      return;
    }

    setUploading(true);
    try {
      // Create file URL for preview
      const fileUrl = URL.createObjectURL(file);

      // Verify document authenticity
      const authCheck = await fraudDetectionService.verifyDocumentAuthenticity(
        fileUrl,
        selectedDocType,
      );

      if (!authCheck.authentic) {
        toast({
          title: "Document verification failed",
          description: `Issues detected: ${authCheck.issues.join(", ")}`,
          variant: "destructive",
        });
        setUploading(false);
        return;
      }

      // Upload document
      const newDoc = await kycService.uploadKYCDocument({
        user_id: userId,
        document_type: selectedDocType as any,
        document_url: fileUrl,
        verification_status: "pending",
      });

      if (newDoc) {
        setDocuments((prev) => [newDoc, ...prev]);

        // Create identity verification record
        await fraudDetectionService.createIdentityVerification({
          userId,
          verificationType: "document",
          status: "pending",
          verificationData: {
            documentType: selectedDocType,
            confidence: authCheck.confidence,
            fileSize: file.size,
            fileName: file.name,
          },
        });

        toast({
          title: "Document uploaded successfully",
          description: `Your ${selectedDocType.replace("_", " ")} has been submitted for verification.`,
        });
        setSelectedDocType("");
        await loadUserData();
      }
    } catch (error) {
      console.error("Error uploading document:", error);
      toast({
        title: "Upload failed",
        description: "Please try again later.",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  const handleBiometricVerification = async () => {
    setBiometricVerifying(true);
    try {
      // Simulate biometric verification (in real app, use camera/face detection)
      const result = await fraudDetectionService.verifyBiometric(
        userId,
        "biometric_data",
      );

      if (result.success) {
        toast({
          title: "Biometric verification successful",
          description: `Verification completed with ${(result.confidence * 100).toFixed(1)}% confidence.`,
        });
        await loadUserData();
      } else {
        toast({
          title: "Biometric verification failed",
          description: "Please try again with better lighting and positioning.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error in biometric verification:", error);
    } finally {
      setBiometricVerifying(false);
    }
  };

  const getKYCLevelInfo = (level: number) => {
    const levels = {
      0: {
        name: "Unverified",
        color: "bg-gray-500",
        limits: "$1,000/day",
        icon: Lock,
        description: "Basic account with limited features",
      },
      1: {
        name: "Basic",
        color: "bg-blue-500",
        limits: "$5,000/day",
        icon: Shield,
        description: "ID verified account with standard features",
      },
      2: {
        name: "Intermediate",
        color: "bg-green-500",
        limits: "$25,000/day",
        icon: Star,
        description: "Address verified with enhanced features",
      },
      3: {
        name: "Advanced",
        color: "bg-purple-500",
        limits: "$100,000/day",
        icon: Award,
        description: "Fully verified with premium features",
      },
    };
    return levels[level as keyof typeof levels] || levels[0];
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "verified":
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case "pending":
        return <Clock className="h-4 w-4 text-yellow-500" />;
      case "rejected":
      case "failed":
        return <XCircle className="h-4 w-4 text-red-500" />;
      default:
        return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };

  const getRiskBadgeColor = (level: string) => {
    switch (level) {
      case "low":
        return "bg-green-500";
      case "medium":
        return "bg-yellow-500";
      case "high":
        return "bg-orange-500";
      case "critical":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };

  const calculateCompletionProgress = () => {
    const requiredVerifications = ["document", "email", "phone"];
    const completedVerifications = identityVerifications.filter(
      (v) =>
        v.status === "verified" &&
        requiredVerifications.includes(v.verificationType),
    );
    return (completedVerifications.length / requiredVerifications.length) * 100;
  };

  const levelInfo = getKYCLevelInfo(currentLevel);
  const LevelIcon = levelInfo.icon;
  const completionProgress = calculateCompletionProgress();

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="flex items-center gap-2">
          <LevelIcon className="h-4 w-4" />
          KYC Level {currentLevel}
          {completionProgress > 0 && completionProgress < 100 && (
            <Badge variant="secondary" className="ml-1">
              {Math.round(completionProgress)}%
            </Badge>
          )}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Enhanced KYC Verification
          </DialogTitle>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-5 w-full">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="documents">Documents</TabsTrigger>
            <TabsTrigger value="biometric">Biometric</TabsTrigger>
            <TabsTrigger value="security">Security</TabsTrigger>
            <TabsTrigger value="badges">Badges</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Current Level Status */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <LevelIcon className="h-5 w-5" />
                  Current Verification Level
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Badge className={`${levelInfo.color} text-white mb-2`}>
                        Level {currentLevel}: {levelInfo.name}
                      </Badge>
                      <p className="text-sm text-muted-foreground">
                        {levelInfo.description}
                      </p>
                      <p className="text-sm font-medium mt-1">
                        Trading Limit: {levelInfo.limits}
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-primary">
                        {Math.round(completionProgress)}%
                      </div>
                      <p className="text-xs text-muted-foreground">Complete</p>
                    </div>
                  </div>
                  <Progress value={completionProgress} className="w-full" />
                </div>
              </CardContent>
            </Card>

            {/* Risk Assessment */}
            {riskAssessment && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Eye className="h-5 w-5" />
                    Security Assessment
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span>Risk Level</span>
                      <Badge
                        className={`${getRiskBadgeColor(riskAssessment.riskLevel)} text-white`}
                      >
                        {riskAssessment.riskLevel.toUpperCase()}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Risk Score</span>
                      <span className="font-bold">
                        {riskAssessment.riskScore}/100
                      </span>
                    </div>
                    {riskAssessment.recommendations.length > 0 && (
                      <Alert>
                        <AlertTriangle className="h-4 w-4" />
                        <AlertDescription>
                          <strong>Recommendations:</strong>
                          <ul className="mt-1 list-disc list-inside">
                            {riskAssessment.recommendations.map(
                              (rec, index) => (
                                <li key={index} className="text-sm">
                                  {rec}
                                </li>
                              ),
                            )}
                          </ul>
                        </AlertDescription>
                      </Alert>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Button
                variant="outline"
                onClick={() => setActiveTab("documents")}
                className="h-auto py-4 flex flex-col items-center gap-2"
              >
                <FileText className="h-6 w-6" />
                <span>Upload Documents</span>
              </Button>
              <Button
                variant="outline"
                onClick={() => setActiveTab("biometric")}
                className="h-auto py-4 flex flex-col items-center gap-2"
              >
                <Camera className="h-6 w-6" />
                <span>Biometric Scan</span>
              </Button>
              <Button
                variant="outline"
                onClick={() => setActiveTab("badges")}
                className="h-auto py-4 flex flex-col items-center gap-2"
              >
                <Award className="h-6 w-6" />
                <span>View Badges</span>
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="documents" className="space-y-6">
            {/* Upload New Document */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">
                  Upload Verification Document
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="docType">Document Type</Label>
                  <Select
                    value={selectedDocType}
                    onValueChange={setSelectedDocType}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select document type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="passport">🛂 Passport</SelectItem>
                      <SelectItem value="driver_license">
                        🚗 Driver's License
                      </SelectItem>
                      <SelectItem value="national_id">
                        🆔 National ID Card
                      </SelectItem>
                      <SelectItem value="utility_bill">
                        📄 Utility Bill
                      </SelectItem>
                      <SelectItem value="bank_statement">
                        �� Bank Statement
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="document">Document File (Max 10MB)</Label>
                  <Input
                    id="document"
                    type="file"
                    accept="image/*,.pdf"
                    onChange={handleFileUpload}
                    disabled={uploading || !selectedDocType}
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Supported formats: JPG, PNG, PDF. Ensure document is clear
                    and fully visible.
                  </p>
                </div>

                {uploading && (
                  <div className="text-center py-4">
                    <div className="animate-spin w-6 h-6 border-2 border-primary border-t-transparent rounded-full mx-auto mb-2"></div>
                    <p className="text-sm text-muted-foreground">
                      Verifying and uploading document...
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Uploaded Documents */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Your Documents</CardTitle>
              </CardHeader>
              <CardContent>
                {documents.length === 0 ? (
                  <p className="text-muted-foreground text-center py-4">
                    No documents uploaded yet
                  </p>
                ) : (
                  <div className="space-y-3">
                    {documents.map((doc) => (
                      <div
                        key={doc.id}
                        className="flex items-center justify-between p-3 border rounded-lg"
                      >
                        <div className="flex items-center gap-3">
                          {getStatusIcon(doc.verification_status)}
                          <div>
                            <p className="font-medium capitalize">
                              {doc.document_type.replace("_", " ")}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              Uploaded{" "}
                              {new Date(doc.created_at).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        <Badge variant="outline" className="capitalize">
                          {doc.verification_status}
                        </Badge>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="biometric" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Camera className="h-5 w-5" />
                  Biometric Verification
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Alert>
                  <Zap className="h-4 w-4" />
                  <AlertDescription>
                    Biometric verification provides the highest level of
                    security and can instantly upgrade your account.
                  </AlertDescription>
                </Alert>

                <div className="text-center py-8">
                  <div className="w-32 h-32 border-4 border-dashed border-gray-300 rounded-full mx-auto mb-4 flex items-center justify-center">
                    <Camera className="h-12 w-12 text-gray-400" />
                  </div>

                  <h3 className="text-lg font-semibold mb-2">
                    Facial Recognition Scan
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    Position your face within the circle and follow the
                    on-screen instructions
                  </p>

                  <Button
                    onClick={handleBiometricVerification}
                    disabled={biometricVerifying}
                    className="w-full max-w-sm"
                  >
                    {biometricVerifying ? (
                      <>
                        <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2"></div>
                        Scanning...
                      </>
                    ) : (
                      <>
                        <Camera className="w-4 h-4 mr-2" />
                        Start Biometric Scan
                      </>
                    )}
                  </Button>
                </div>

                {/* Biometric verification history */}
                <div className="space-y-2">
                  <h4 className="font-medium">Recent Scans</h4>
                  {identityVerifications
                    .filter((v) => v.verificationType === "biometric")
                    .map((verification, index) => (
                      <div
                        key={verification.id}
                        className="flex items-center justify-between p-2 border rounded"
                      >
                        <div className="flex items-center gap-2">
                          {getStatusIcon(verification.status)}
                          <span className="text-sm">
                            Biometric scan #{index + 1}
                          </span>
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {new Date(
                            verification.createdAt,
                          ).toLocaleDateString()}
                        </div>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="security" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Security Status
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {riskAssessment && (
                    <>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-muted-foreground">
                            Risk Score
                          </p>
                          <p className="text-2xl font-bold">
                            {riskAssessment.riskScore}/100
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">
                            Risk Level
                          </p>
                          <Badge
                            className={`${getRiskBadgeColor(riskAssessment.riskLevel)} text-white`}
                          >
                            {riskAssessment.riskLevel.toUpperCase()}
                          </Badge>
                        </div>
                      </div>

                      {riskAssessment.reasons.length > 0 && (
                        <div>
                          <h4 className="font-medium mb-2">Risk Factors</h4>
                          <ul className="space-y-1">
                            {riskAssessment.reasons.map((reason, index) => (
                              <li
                                key={index}
                                className="text-sm text-muted-foreground flex items-center gap-2"
                              >
                                <AlertTriangle className="h-3 w-3" />
                                {reason}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="badges" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="h-5 w-5" />
                  Identity Verification Badges
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Email Verification Badge */}
                  <div
                    className={`p-4 border rounded-lg ${
                      identityVerifications.some(
                        (v) =>
                          v.verificationType === "email" &&
                          v.status === "verified",
                      )
                        ? "bg-green-50 border-green-200"
                        : "bg-gray-50 border-gray-200"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`p-2 rounded-full ${
                          identityVerifications.some(
                            (v) =>
                              v.verificationType === "email" &&
                              v.status === "verified",
                          )
                            ? "bg-green-500"
                            : "bg-gray-400"
                        }`}
                      >
                        <CheckCircle className="h-4 w-4 text-white" />
                      </div>
                      <div>
                        <h3 className="font-medium">Email Verified</h3>
                        <p className="text-xs text-muted-foreground">
                          Email address confirmed
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Phone Verification Badge */}
                  <div
                    className={`p-4 border rounded-lg ${
                      identityVerifications.some(
                        (v) =>
                          v.verificationType === "phone" &&
                          v.status === "verified",
                      )
                        ? "bg-blue-50 border-blue-200"
                        : "bg-gray-50 border-gray-200"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`p-2 rounded-full ${
                          identityVerifications.some(
                            (v) =>
                              v.verificationType === "phone" &&
                              v.status === "verified",
                          )
                            ? "bg-blue-500"
                            : "bg-gray-400"
                        }`}
                      >
                        <Smartphone className="h-4 w-4 text-white" />
                      </div>
                      <div>
                        <h3 className="font-medium">Phone Verified</h3>
                        <p className="text-xs text-muted-foreground">
                          Phone number confirmed
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Document Verification Badge */}
                  <div
                    className={`p-4 border rounded-lg ${
                      documents.some(
                        (d) => d.verification_status === "verified",
                      )
                        ? "bg-purple-50 border-purple-200"
                        : "bg-gray-50 border-gray-200"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`p-2 rounded-full ${
                          documents.some(
                            (d) => d.verification_status === "verified",
                          )
                            ? "bg-purple-500"
                            : "bg-gray-400"
                        }`}
                      >
                        <FileText className="h-4 w-4 text-white" />
                      </div>
                      <div>
                        <h3 className="font-medium">ID Verified</h3>
                        <p className="text-xs text-muted-foreground">
                          Official document verified
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Biometric Verification Badge */}
                  <div
                    className={`p-4 border rounded-lg ${
                      identityVerifications.some(
                        (v) =>
                          v.verificationType === "biometric" &&
                          v.status === "verified",
                      )
                        ? "bg-orange-50 border-orange-200"
                        : "bg-gray-50 border-gray-200"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`p-2 rounded-full ${
                          identityVerifications.some(
                            (v) =>
                              v.verificationType === "biometric" &&
                              v.status === "verified",
                          )
                            ? "bg-orange-500"
                            : "bg-gray-400"
                        }`}
                      >
                        <Eye className="h-4 w-4 text-white" />
                      </div>
                      <div>
                        <h3 className="font-medium">Biometric Verified</h3>
                        <p className="text-xs text-muted-foreground">
                          Facial recognition confirmed
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default EnhancedKYCVerification;
