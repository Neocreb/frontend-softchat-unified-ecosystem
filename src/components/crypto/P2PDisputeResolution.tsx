import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Flag,
  Clock,
  MessageCircle,
  Upload,
  FileText,
  Image as ImageIcon,
  AlertTriangle,
  CheckCircle,
  User,
  Shield,
  Scale,
  Eye,
  Download,
  Camera,
} from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { cn } from "@/lib/utils";

interface Dispute {
  id: string;
  tradeId: string;
  complainantId: string;
  respondentId: string;
  moderatorId?: string;
  reason: string;
  category:
    | "PAYMENT_ISSUE"
    | "NON_DELIVERY"
    | "FAKE_PAYMENT"
    | "COMMUNICATION"
    | "OTHER";
  status:
    | "OPEN"
    | "UNDER_REVIEW"
    | "AWAITING_RESPONSE"
    | "RESOLVED"
    | "ESCALATED"
    | "CLOSED";
  priority: "LOW" | "MEDIUM" | "HIGH" | "URGENT";
  description: string;
  evidence: DisputeEvidence[];
  messages: DisputeMessage[];
  resolution?: DisputeResolution;
  createdAt: string;
  updatedAt: string;
  deadlineAt: string;
  trade: {
    asset: string;
    amount: number;
    fiatAmount: number;
    fiatCurrency: string;
    paymentMethod: string;
  };
  complainant: {
    id: string;
    username: string;
    avatar?: string;
    rating: number;
  };
  respondent: {
    id: string;
    username: string;
    avatar?: string;
    rating: number;
  };
  moderator?: {
    id: string;
    username: string;
    avatar?: string;
    expertise: string[];
  };
}

interface DisputeEvidence {
  id: string;
  type: "IMAGE" | "DOCUMENT" | "SCREENSHOT" | "VIDEO";
  url: string;
  filename: string;
  description: string;
  uploadedBy: string;
  uploadedAt: string;
  isVerified: boolean;
}

interface DisputeMessage {
  id: string;
  senderId: string;
  senderType: "COMPLAINANT" | "RESPONDENT" | "MODERATOR" | "SYSTEM";
  content: string;
  timestamp: string;
  isInternal: boolean;
}

interface DisputeResolution {
  decision:
    | "FAVOR_COMPLAINANT"
    | "FAVOR_RESPONDENT"
    | "PARTIAL_REFUND"
    | "NO_ACTION";
  reasoning: string;
  compensation?: {
    amount: number;
    currency: string;
    recipient: string;
  };
  resolvedBy: string;
  resolvedAt: string;
}

interface Props {
  dispute: Dispute;
  currentUserId: string;
  isOpen: boolean;
  onClose: () => void;
  onSubmitEvidence: (evidence: any) => void;
  onSendMessage: (message: string) => void;
  onAcceptResolution: () => void;
  onAppealResolution: () => void;
}

export default function P2PDisputeResolution({
  dispute,
  currentUserId,
  isOpen,
  onClose,
  onSubmitEvidence,
  onSendMessage,
  onAcceptResolution,
  onAppealResolution,
}: Props) {
  const [activeTab, setActiveTab] = useState("overview");
  const [newMessage, setNewMessage] = useState("");
  const [evidenceForm, setEvidenceForm] = useState({
    type: "IMAGE" as const,
    description: "",
    file: null as File | null,
  });
  const [isUploading, setIsUploading] = useState(false);

  const { toast } = useToast();

  const isComplainant = dispute.complainantId === currentUserId;
  const isRespondent = dispute.respondentId === currentUserId;
  const isModerator = dispute.moderatorId === currentUserId;

  const getStatusBadge = (status: string) => {
    const configs = {
      OPEN: { variant: "outline" as const, color: "text-blue-600", icon: Flag },
      UNDER_REVIEW: {
        variant: "default" as const,
        color: "text-yellow-600",
        icon: Eye,
      },
      AWAITING_RESPONSE: {
        variant: "outline" as const,
        color: "text-orange-600",
        icon: Clock,
      },
      RESOLVED: {
        variant: "default" as const,
        color: "text-green-600",
        icon: CheckCircle,
      },
      ESCALATED: {
        variant: "destructive" as const,
        color: "text-red-600",
        icon: AlertTriangle,
      },
      CLOSED: {
        variant: "secondary" as const,
        color: "text-gray-600",
        icon: CheckCircle,
      },
    };

    const config = configs[status as keyof typeof configs] || configs.OPEN;
    const Icon = config.icon;

    return (
      <Badge variant={config.variant} className="flex items-center gap-1">
        <Icon className="h-3 w-3" />
        {status.replace("_", " ")}
      </Badge>
    );
  };

  const getPriorityBadge = (priority: string) => {
    const configs = {
      LOW: { variant: "outline" as const, color: "text-gray-600" },
      MEDIUM: { variant: "outline" as const, color: "text-yellow-600" },
      HIGH: { variant: "outline" as const, color: "text-orange-600" },
      URGENT: { variant: "destructive" as const, color: "text-red-600" },
    };

    const config = configs[priority as keyof typeof configs] || configs.LOW;

    return (
      <Badge variant={config.variant} className={config.color}>
        {priority}
      </Badge>
    );
  };

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;

    onSendMessage(newMessage);
    setNewMessage("");
    toast({
      title: "Message Sent",
      description: "Your message has been added to the dispute.",
    });
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setEvidenceForm((prev) => ({ ...prev, file }));
    }
  };

  const handleSubmitEvidence = async () => {
    if (!evidenceForm.file || !evidenceForm.description.trim()) {
      toast({
        title: "Missing Information",
        description: "Please provide both a file and description.",
        variant: "destructive",
      });
      return;
    }

    setIsUploading(true);
    try {
      await onSubmitEvidence({
        type: evidenceForm.type,
        file: evidenceForm.file,
        description: evidenceForm.description,
      });

      setEvidenceForm({
        type: "IMAGE",
        description: "",
        file: null,
      });

      toast({
        title: "Evidence Uploaded",
        description: "Your evidence has been submitted successfully.",
      });
    } catch (error) {
      toast({
        title: "Upload Failed",
        description: "Failed to upload evidence. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  const getTimeRemaining = () => {
    const deadline = new Date(dispute.deadlineAt);
    const now = new Date();
    const diff = deadline.getTime() - now.getTime();

    if (diff <= 0) return "Expired";

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));

    if (days > 0) return `${days}d ${hours}h`;
    return `${hours}h ${Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))}m`;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Flag className="h-5 w-5 text-red-600" />
            Dispute #{dispute.id.slice(-6)} - Trade #{dispute.tradeId.slice(-6)}
          </DialogTitle>
          <DialogDescription>
            Dispute resolution for P2P trade
          </DialogDescription>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="evidence">Evidence</TabsTrigger>
            <TabsTrigger value="communication">Messages</TabsTrigger>
            <TabsTrigger value="resolution">Resolution</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            {/* Status and Priority */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Dispute Status</CardTitle>
                  <div className="flex items-center gap-2">
                    {getStatusBadge(dispute.status)}
                    {getPriorityBadge(dispute.priority)}
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label className="text-sm font-medium">Category</Label>
                    <div className="mt-1 text-sm">
                      {dispute.category.replace("_", " ")}
                    </div>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Created</Label>
                    <div className="mt-1 text-sm">
                      {formatDateTime(dispute.createdAt)}
                    </div>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">
                      Response Deadline
                    </Label>
                    <div
                      className={cn(
                        "mt-1 text-sm font-medium",
                        getTimeRemaining() === "Expired"
                          ? "text-red-600"
                          : "text-orange-600",
                      )}
                    >
                      {getTimeRemaining()}
                    </div>
                  </div>
                </div>

                <Separator />

                <div>
                  <Label className="text-sm font-medium">Reason</Label>
                  <div className="mt-1 text-sm">{dispute.reason}</div>
                </div>

                <div>
                  <Label className="text-sm font-medium">Description</Label>
                  <div className="mt-1 text-sm p-3 bg-gray-50 rounded-lg">
                    {dispute.description}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Trade Details */}
            <Card>
              <CardHeader>
                <CardTitle>Trade Information</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Asset:</span>
                      <span className="text-sm font-medium">
                        {dispute.trade.asset}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Amount:</span>
                      <span className="text-sm font-medium">
                        {dispute.trade.amount}
                      </span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">
                        Fiat Amount:
                      </span>
                      <span className="text-sm font-medium">
                        {dispute.trade.fiatAmount.toLocaleString()}{" "}
                        {dispute.trade.fiatCurrency}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">
                        Payment Method:
                      </span>
                      <span className="text-sm font-medium">
                        {dispute.trade.paymentMethod}
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Parties Involved */}
            <Card>
              <CardHeader>
                <CardTitle>Parties Involved</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Complainant */}
                  <div className="flex items-center gap-3 p-3 bg-red-50 rounded-lg">
                    <Avatar>
                      <AvatarImage src={dispute.complainant.avatar} />
                      <AvatarFallback>
                        {dispute.complainant.username.slice(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="font-semibold text-red-800">
                        Complainant: {dispute.complainant.username}
                        {isComplainant && " (You)"}
                      </div>
                      <div className="text-sm text-red-600">
                        ⭐ {dispute.complainant.rating}/5
                      </div>
                    </div>
                  </div>

                  {/* Respondent */}
                  <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                    <Avatar>
                      <AvatarImage src={dispute.respondent.avatar} />
                      <AvatarFallback>
                        {dispute.respondent.username.slice(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="font-semibold text-blue-800">
                        Respondent: {dispute.respondent.username}
                        {isRespondent && " (You)"}
                      </div>
                      <div className="text-sm text-blue-600">
                        ⭐ {dispute.respondent.rating}/5
                      </div>
                    </div>
                  </div>
                </div>

                {/* Moderator */}
                {dispute.moderator && (
                  <div className="mt-4">
                    <div className="flex items-center gap-3 p-3 bg-purple-50 rounded-lg">
                      <Avatar>
                        <AvatarImage src={dispute.moderator.avatar} />
                        <AvatarFallback>
                          {dispute.moderator.username.slice(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="font-semibold text-purple-800 flex items-center gap-2">
                          <Shield className="h-4 w-4" />
                          Moderator: {dispute.moderator.username}
                          {isModerator && " (You)"}
                        </div>
                        <div className="text-sm text-purple-600">
                          Expertise: {dispute.moderator.expertise.join(", ")}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Evidence Tab */}
          <TabsContent value="evidence" className="space-y-6">
            {/* Upload Evidence */}
            {(isComplainant || isRespondent) && dispute.status !== "CLOSED" && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Upload className="h-5 w-5" />
                    Submit Evidence
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="evidence-type">Evidence Type</Label>
                      <Select
                        value={evidenceForm.type}
                        onValueChange={(value: any) =>
                          setEvidenceForm((prev) => ({ ...prev, type: value }))
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="IMAGE">
                            Image/Screenshot
                          </SelectItem>
                          <SelectItem value="DOCUMENT">Document</SelectItem>
                          <SelectItem value="VIDEO">Video</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="evidence-file">File</Label>
                      <Input
                        id="evidence-file"
                        type="file"
                        accept={
                          evidenceForm.type === "IMAGE"
                            ? "image/*"
                            : evidenceForm.type === "VIDEO"
                              ? "video/*"
                              : "*"
                        }
                        onChange={handleFileUpload}
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="evidence-description">Description</Label>
                    <Textarea
                      id="evidence-description"
                      placeholder="Describe what this evidence shows and how it supports your case..."
                      value={evidenceForm.description}
                      onChange={(e) =>
                        setEvidenceForm((prev) => ({
                          ...prev,
                          description: e.target.value,
                        }))
                      }
                      rows={3}
                    />
                  </div>
                  <Button
                    onClick={handleSubmitEvidence}
                    disabled={
                      isUploading ||
                      !evidenceForm.file ||
                      !evidenceForm.description.trim()
                    }
                  >
                    {isUploading ? "Uploading..." : "Submit Evidence"}
                  </Button>
                </CardContent>
              </Card>
            )}

            {/* Evidence List */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Submitted Evidence
                </CardTitle>
              </CardHeader>
              <CardContent>
                {dispute.evidence.length > 0 ? (
                  <div className="space-y-4">
                    {dispute.evidence.map((evidence) => (
                      <div key={evidence.id} className="border rounded-lg p-4">
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex items-center gap-2">
                            {evidence.type === "IMAGE" && (
                              <ImageIcon className="h-4 w-4" />
                            )}
                            {evidence.type === "DOCUMENT" && (
                              <FileText className="h-4 w-4" />
                            )}
                            {evidence.type === "VIDEO" && (
                              <Camera className="h-4 w-4" />
                            )}
                            <span className="font-medium">
                              {evidence.filename}
                            </span>
                            {evidence.isVerified && (
                              <Badge
                                variant="outline"
                                className="text-green-600"
                              >
                                <CheckCircle className="h-3 w-3 mr-1" />
                                Verified
                              </Badge>
                            )}
                          </div>
                          <div className="flex items-center gap-2">
                            <Button variant="outline" size="sm">
                              <Eye className="h-3 w-3 mr-1" />
                              View
                            </Button>
                            <Button variant="outline" size="sm">
                              <Download className="h-3 w-3 mr-1" />
                              Download
                            </Button>
                          </div>
                        </div>
                        <p className="text-sm text-gray-600 mb-2">
                          {evidence.description}
                        </p>
                        <div className="text-xs text-gray-500">
                          Uploaded by {evidence.uploadedBy} on{" "}
                          {formatDateTime(evidence.uploadedAt)}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center text-gray-500 py-8">
                    <FileText className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                    <p>No evidence submitted yet</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Communication Tab */}
          <TabsContent value="communication" className="space-y-6">
            {/* Messages */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageCircle className="h-5 w-5" />
                  Dispute Messages
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4 max-h-96 overflow-y-auto">
                  {dispute.messages.map((message) => (
                    <div
                      key={message.id}
                      className={cn(
                        "p-3 rounded-lg",
                        message.senderType === "SYSTEM" &&
                          "bg-gray-100 border-l-4 border-gray-400",
                        message.senderType === "MODERATOR" &&
                          "bg-purple-50 border-l-4 border-purple-400",
                        message.senderId === currentUserId &&
                          "bg-blue-50 border-l-4 border-blue-400",
                        message.senderId !== currentUserId &&
                          message.senderType !== "SYSTEM" &&
                          message.senderType !== "MODERATOR" &&
                          "bg-gray-50 border-l-4 border-gray-300",
                      )}
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium text-sm">
                          {message.senderType === "SYSTEM"
                            ? "System"
                            : message.senderType === "MODERATOR"
                              ? "Moderator"
                              : message.senderId === currentUserId
                                ? "You"
                                : "Other Party"}
                        </span>
                        <span className="text-xs text-gray-500">
                          {formatDateTime(message.timestamp)}
                        </span>
                        {message.isInternal && (
                          <Badge variant="outline" className="text-xs">
                            Internal
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm">{message.content}</p>
                    </div>
                  ))}
                </div>

                {/* Send Message */}
                {(isComplainant || isRespondent) &&
                  dispute.status !== "CLOSED" && (
                    <div className="mt-4 space-y-2">
                      <Textarea
                        placeholder="Type your message..."
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        rows={3}
                      />
                      <Button
                        onClick={handleSendMessage}
                        disabled={!newMessage.trim()}
                      >
                        Send Message
                      </Button>
                    </div>
                  )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Resolution Tab */}
          <TabsContent value="resolution" className="space-y-6">
            {dispute.resolution ? (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Scale className="h-5 w-5 text-green-600" />
                    Dispute Resolution
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                    <div className="font-medium text-green-800 mb-2">
                      Decision: {dispute.resolution.decision.replace("_", " ")}
                    </div>
                    <p className="text-sm text-green-700 mb-2">
                      {dispute.resolution.reasoning}
                    </p>
                    {dispute.resolution.compensation && (
                      <div className="text-sm text-green-700">
                        Compensation: {dispute.resolution.compensation.amount}{" "}
                        {dispute.resolution.compensation.currency}
                        to {dispute.resolution.compensation.recipient}
                      </div>
                    )}
                    <div className="text-xs text-green-600 mt-2">
                      Resolved by {dispute.resolution.resolvedBy} on{" "}
                      {formatDateTime(dispute.resolution.resolvedAt)}
                    </div>
                  </div>

                  {dispute.status !== "CLOSED" && (
                    <div className="flex gap-2">
                      <Button
                        onClick={onAcceptResolution}
                        className="bg-green-600 hover:bg-green-700"
                      >
                        Accept Resolution
                      </Button>
                      <Button onClick={onAppealResolution} variant="outline">
                        Appeal Decision
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardContent className="p-8 text-center">
                  <Scale className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                  <h3 className="text-lg font-semibold mb-2">
                    Awaiting Resolution
                  </h3>
                  <p className="text-gray-600">
                    This dispute is currently under review. A moderator will
                    provide a resolution soon.
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
