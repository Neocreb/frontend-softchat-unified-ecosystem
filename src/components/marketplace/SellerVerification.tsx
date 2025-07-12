import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Shield,
  CheckCircle,
  XCircle,
  Clock,
  Upload,
  FileText,
  CreditCard,
  Phone,
  MapPin,
  Building,
  Star,
  Award,
  AlertTriangle,
  ExternalLink,
  Camera,
  Eye,
  Lock,
  Zap,
} from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { useMarketplace } from "@/contexts/MarketplaceContext";
import { useAuth } from "@/contexts/AuthContext";
import { cn } from "@/lib/utils";

interface VerificationStep {
  id: string;
  title: string;
  description: string;
  status: "pending" | "in_progress" | "completed" | "failed";
  required: boolean;
  documents?: string[];
}

interface SellerVerificationProps {
  sellerId?: string;
  showBadgeOnly?: boolean;
}

const SellerVerification = ({
  sellerId,
  showBadgeOnly = false,
}: SellerVerificationProps) => {
  const [verificationSteps, setVerificationSteps] = useState<
    VerificationStep[]
  >([
    {
      id: "identity",
      title: "Identity Verification",
      description: "Verify your identity with government-issued ID",
      status: "completed",
      required: true,
      documents: ["passport", "drivers_license", "national_id"],
    },
    {
      id: "business",
      title: "Business Verification",
      description: "Verify your business registration and tax information",
      status: "in_progress",
      required: true,
      documents: ["business_license", "tax_certificate", "bank_statement"],
    },
    {
      id: "address",
      title: "Address Verification",
      description: "Confirm your business or residential address",
      status: "pending",
      required: true,
      documents: ["utility_bill", "bank_statement", "lease_agreement"],
    },
    {
      id: "bank",
      title: "Bank Account Verification",
      description: "Link and verify your bank account for payouts",
      status: "completed",
      required: true,
    },
    {
      id: "phone",
      title: "Phone Verification",
      description: "Verify your phone number with SMS code",
      status: "completed",
      required: true,
    },
    {
      id: "email",
      title: "Email Verification",
      description: "Verify your email address",
      status: "completed",
      required: true,
    },
    {
      id: "enhanced",
      title: "Enhanced Verification",
      description: "Additional verification for premium seller status",
      status: "pending",
      required: false,
      documents: ["professional_license", "insurance_certificate"],
    },
  ]);

  const [isVerificationOpen, setIsVerificationOpen] = useState(false);
  const [selectedStep, setSelectedStep] = useState<string>("identity");
  const [uploadedFiles, setUploadedFiles] = useState<{ [key: string]: File[] }>(
    {},
  );

  const { user } = useAuth();
  const { toast } = useToast();

  const getVerificationProgress = () => {
    const completedSteps = verificationSteps.filter(
      (step) => step.status === "completed",
    ).length;
    const totalSteps = verificationSteps.filter((step) => step.required).length;
    return Math.round((completedSteps / totalSteps) * 100);
  };

  const getVerificationLevel = () => {
    const progress = getVerificationProgress();
    const allRequiredCompleted = verificationSteps
      .filter((step) => step.required)
      .every((step) => step.status === "completed");
    const enhancedCompleted =
      verificationSteps.find((step) => step.id === "enhanced")?.status ===
      "completed";

    if (enhancedCompleted) return "premium";
    if (allRequiredCompleted) return "verified";
    if (progress >= 50) return "partial";
    return "unverified";
  };

  const getVerificationBadge = () => {
    const level = getVerificationLevel();

    switch (level) {
      case "premium":
        return (
          <Badge className="bg-gradient-to-r from-purple-600 to-purple-700 text-white">
            <Award className="w-3 h-3 mr-1" />
            Premium Verified
          </Badge>
        );
      case "verified":
        return (
          <Badge className="bg-green-600 text-white">
            <Shield className="w-3 h-3 mr-1" />
            Verified Seller
          </Badge>
        );
      case "partial":
        return (
          <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
            <Clock className="w-3 h-3 mr-1" />
            Verification in Progress
          </Badge>
        );
      default:
        return (
          <Badge variant="outline" className="text-muted-foreground">
            <AlertTriangle className="w-3 h-3 mr-1" />
            Unverified
          </Badge>
        );
    }
  };

  const handleFileUpload = (stepId: string, files: FileList) => {
    const fileArray = Array.from(files);
    setUploadedFiles((prev) => ({
      ...prev,
      [stepId]: [...(prev[stepId] || []), ...fileArray],
    }));

    toast({
      title: "Files Uploaded",
      description: `${fileArray.length} file(s) uploaded for verification`,
    });
  };

  const handleSubmitVerification = async (stepId: string) => {
    setVerificationSteps((prev) =>
      prev.map((step) =>
        step.id === stepId ? { ...step, status: "in_progress" } : step,
      ),
    );

    // Simulate verification process
    setTimeout(() => {
      setVerificationSteps((prev) =>
        prev.map((step) =>
          step.id === stepId
            ? { ...step, status: Math.random() > 0.2 ? "completed" : "failed" }
            : step,
        ),
      );

      toast({
        title: "Verification Submitted",
        description:
          "Your documents are being reviewed. We'll notify you of the results.",
      });
    }, 2000);
  };

  const getStepIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case "failed":
        return <XCircle className="w-5 h-5 text-red-600" />;
      case "in_progress":
        return <Clock className="w-5 h-5 text-yellow-600 animate-pulse" />;
      default:
        return (
          <div className="w-5 h-5 border-2 border-gray-300 rounded-full" />
        );
    }
  };

  if (showBadgeOnly) {
    return getVerificationBadge();
  }

  const currentStep = verificationSteps.find(
    (step) => step.id === selectedStep,
  );

  return (
    <div className="space-y-6">
      {/* Verification Status Overview */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-6 h-6" />
                Seller Verification Status
              </CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                Complete verification to build trust with buyers and unlock
                premium features
              </p>
            </div>
            {getVerificationBadge()}
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Verification Progress</span>
              <span>{getVerificationProgress()}%</span>
            </div>
            <Progress value={getVerificationProgress()} className="h-3" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {
                  verificationSteps.filter((s) => s.status === "completed")
                    .length
                }
              </div>
              <div className="text-sm text-muted-foreground">Completed</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-600">
                {
                  verificationSteps.filter((s) => s.status === "in_progress")
                    .length
                }
              </div>
              <div className="text-sm text-muted-foreground">In Progress</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-600">
                {verificationSteps.filter((s) => s.status === "pending").length}
              </div>
              <div className="text-sm text-muted-foreground">Pending</div>
            </div>
          </div>

          <Dialog
            open={isVerificationOpen}
            onOpenChange={setIsVerificationOpen}
          >
            <DialogTrigger asChild>
              <Button className="w-full">
                <Shield className="w-4 h-4 mr-2" />
                Manage Verification
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Seller Verification Center</DialogTitle>
                <DialogDescription>
                  Complete these steps to verify your seller account and build
                  trust with buyers
                </DialogDescription>
              </DialogHeader>

              <Tabs
                value={selectedStep}
                onValueChange={setSelectedStep}
                className="w-full"
              >
                <TabsList className="grid w-full grid-cols-4 lg:grid-cols-7">
                  {verificationSteps.map((step) => (
                    <TabsTrigger
                      key={step.id}
                      value={step.id}
                      className={cn(
                        "flex flex-col items-center gap-1 h-auto py-2",
                        step.status === "completed" &&
                          "bg-green-50 text-green-700",
                        step.status === "failed" && "bg-red-50 text-red-700",
                      )}
                    >
                      {getStepIcon(step.status)}
                      <span className="text-xs text-center">
                        {step.title.split(" ")[0]}
                      </span>
                    </TabsTrigger>
                  ))}
                </TabsList>

                {verificationSteps.map((step) => (
                  <TabsContent
                    key={step.id}
                    value={step.id}
                    className="space-y-6"
                  >
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            {getStepIcon(step.status)}
                            {step.title}
                          </div>
                          <div className="flex items-center gap-2">
                            {step.required && (
                              <Badge variant="destructive" className="text-xs">
                                Required
                              </Badge>
                            )}
                            {step.status === "completed" && (
                              <Badge
                                variant="secondary"
                                className="text-xs bg-green-100 text-green-800"
                              >
                                Verified
                              </Badge>
                            )}
                          </div>
                        </CardTitle>
                        <p className="text-sm text-muted-foreground">
                          {step.description}
                        </p>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        {step.status === "completed" ? (
                          <div className="text-center py-8 space-y-2">
                            <CheckCircle className="w-16 h-16 text-green-600 mx-auto" />
                            <h3 className="text-lg font-semibold text-green-900">
                              Verification Complete
                            </h3>
                            <p className="text-sm text-green-700">
                              This step has been successfully verified
                            </p>
                          </div>
                        ) : step.status === "failed" ? (
                          <div className="text-center py-8 space-y-4">
                            <XCircle className="w-16 h-16 text-red-600 mx-auto" />
                            <h3 className="text-lg font-semibold text-red-900">
                              Verification Failed
                            </h3>
                            <p className="text-sm text-red-700">
                              There was an issue with your submitted documents.
                              Please review and resubmit.
                            </p>
                            <Button
                              variant="outline"
                              onClick={() =>
                                setVerificationSteps((prev) =>
                                  prev.map((s) =>
                                    s.id === step.id
                                      ? { ...s, status: "pending" }
                                      : s,
                                  ),
                                )
                              }
                            >
                              Try Again
                            </Button>
                          </div>
                        ) : step.status === "in_progress" ? (
                          <div className="text-center py-8 space-y-2">
                            <div className="w-16 h-16 mx-auto mb-4">
                              <div className="w-16 h-16 border-4 border-yellow-200 border-t-yellow-600 rounded-full animate-spin" />
                            </div>
                            <h3 className="text-lg font-semibold text-yellow-900">
                              Under Review
                            </h3>
                            <p className="text-sm text-yellow-700">
                              Your documents are being reviewed. This usually
                              takes 1-3 business days.
                            </p>
                          </div>
                        ) : (
                          <div className="space-y-6">
                            {/* Document Upload Section */}
                            {step.documents && (
                              <div className="space-y-4">
                                <h4 className="font-medium">
                                  Required Documents
                                </h4>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                  {step.documents.map((docType) => (
                                    <div
                                      key={docType}
                                      className="border rounded-lg p-4 space-y-3"
                                    >
                                      <div className="flex items-center gap-2">
                                        <FileText className="w-4 h-4" />
                                        <span className="text-sm font-medium capitalize">
                                          {docType.replace("_", " ")}
                                        </span>
                                      </div>
                                      <div className="text-xs text-muted-foreground">
                                        Upload a clear photo or scan of your{" "}
                                        {docType.replace("_", " ")}
                                      </div>
                                      <Input
                                        type="file"
                                        accept="image/*,.pdf"
                                        multiple
                                        onChange={(e) =>
                                          e.target.files &&
                                          handleFileUpload(
                                            step.id,
                                            e.target.files,
                                          )
                                        }
                                        className="text-sm"
                                      />
                                      {uploadedFiles[step.id]?.length > 0 && (
                                        <div className="text-xs text-green-600">
                                          {uploadedFiles[step.id].length}{" "}
                                          file(s) uploaded
                                        </div>
                                      )}
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}

                            {/* Additional Information */}
                            {step.id === "business" && (
                              <div className="space-y-4">
                                <h4 className="font-medium">
                                  Business Information
                                </h4>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                  <div className="space-y-2">
                                    <Label htmlFor="businessName">
                                      Legal Business Name
                                    </Label>
                                    <Input
                                      id="businessName"
                                      placeholder="Enter your legal business name"
                                    />
                                  </div>
                                  <div className="space-y-2">
                                    <Label htmlFor="taxId">Tax ID / EIN</Label>
                                    <Input
                                      id="taxId"
                                      placeholder="Enter your tax ID or EIN"
                                    />
                                  </div>
                                  <div className="space-y-2">
                                    <Label htmlFor="businessType">
                                      Business Type
                                    </Label>
                                    <Input
                                      id="businessType"
                                      placeholder="LLC, Corporation, etc."
                                    />
                                  </div>
                                  <div className="space-y-2">
                                    <Label htmlFor="registrationDate">
                                      Registration Date
                                    </Label>
                                    <Input id="registrationDate" type="date" />
                                  </div>
                                </div>
                              </div>
                            )}

                            {step.id === "address" && (
                              <div className="space-y-4">
                                <h4 className="font-medium">
                                  Address Information
                                </h4>
                                <div className="space-y-4">
                                  <div className="space-y-2">
                                    <Label htmlFor="address">
                                      Business Address
                                    </Label>
                                    <Textarea
                                      id="address"
                                      placeholder="Enter your complete business address"
                                      rows={3}
                                    />
                                  </div>
                                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div className="space-y-2">
                                      <Label htmlFor="city">City</Label>
                                      <Input
                                        id="city"
                                        placeholder="Enter city"
                                      />
                                    </div>
                                    <div className="space-y-2">
                                      <Label htmlFor="state">
                                        State/Province
                                      </Label>
                                      <Input
                                        id="state"
                                        placeholder="Enter state or province"
                                      />
                                    </div>
                                    <div className="space-y-2">
                                      <Label htmlFor="zipCode">
                                        ZIP/Postal Code
                                      </Label>
                                      <Input
                                        id="zipCode"
                                        placeholder="Enter ZIP or postal code"
                                      />
                                    </div>
                                  </div>
                                </div>
                              </div>
                            )}

                            {/* Submit Button */}
                            <Button
                              onClick={() => handleSubmitVerification(step.id)}
                              className="w-full"
                              disabled={
                                step.documents &&
                                (!uploadedFiles[step.id] ||
                                  uploadedFiles[step.id].length === 0)
                              }
                            >
                              <Upload className="w-4 h-4 mr-2" />
                              Submit for Verification
                            </Button>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </TabsContent>
                ))}
              </Tabs>
            </DialogContent>
          </Dialog>
        </CardContent>
      </Card>

      {/* Verification Benefits */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="w-5 h-5" />
            Verification Benefits
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="flex items-start gap-3 p-3 border rounded-lg">
              <Shield className="w-5 h-5 text-blue-600 mt-1" />
              <div>
                <h4 className="font-medium text-sm">Trust Badge</h4>
                <p className="text-xs text-muted-foreground">
                  Display verification badges to build buyer confidence
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 border rounded-lg">
              <Star className="w-5 h-5 text-yellow-600 mt-1" />
              <div>
                <h4 className="font-medium text-sm">Higher Rankings</h4>
                <p className="text-xs text-muted-foreground">
                  Verified sellers appear higher in search results
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 border rounded-lg">
              <CreditCard className="w-5 h-5 text-green-600 mt-1" />
              <div>
                <h4 className="font-medium text-sm">Faster Payouts</h4>
                <p className="text-xs text-muted-foreground">
                  Receive payments faster with verified status
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 border rounded-lg">
              <Eye className="w-5 h-5 text-purple-600 mt-1" />
              <div>
                <h4 className="font-medium text-sm">Increased Visibility</h4>
                <p className="text-xs text-muted-foreground">
                  Get featured in verified seller promotions
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 border rounded-lg">
              <Lock className="w-5 h-5 text-red-600 mt-1" />
              <div>
                <h4 className="font-medium text-sm">Enhanced Security</h4>
                <p className="text-xs text-muted-foreground">
                  Protected against fraud and chargebacks
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 border rounded-lg">
              <Award className="w-5 h-5 text-orange-600 mt-1" />
              <div>
                <h4 className="font-medium text-sm">Premium Features</h4>
                <p className="text-xs text-muted-foreground">
                  Access to advanced seller tools and analytics
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SellerVerification;
