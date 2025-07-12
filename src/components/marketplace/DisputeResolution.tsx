import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  AlertCircle,
  MessageCircle,
  Clock,
  CheckCircle,
  XCircle,
  FileText,
  Upload,
  User,
  Calendar,
  Gavel,
  Shield,
  RefreshCw,
  Mail,
  Phone,
  Award,
  AlertTriangle,
} from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { useMarketplace } from "@/contexts/MarketplaceContext";
import { useAuth } from "@/contexts/AuthContext";
import { cn, formatDate } from "@/lib/utils";

interface Dispute {
  id: string;
  orderId: string;
  productName: string;
  buyerName: string;
  sellerName: string;
  type:
    | "product_not_received"
    | "item_not_as_described"
    | "return_request"
    | "refund_request"
    | "other";
  status: "open" | "in_review" | "resolved" | "closed";
  priority: "low" | "medium" | "high";
  amount: number;
  description: string;
  buyerEvidence: string[];
  sellerResponse?: string;
  sellerEvidence?: string[];
  mediatorNotes?: string;
  resolution?: string;
  resolutionAmount?: number;
  createdAt: string;
  updatedAt: string;
  messages: DisputeMessage[];
}

interface DisputeMessage {
  id: string;
  senderId: string;
  senderName: string;
  senderType: "buyer" | "seller" | "mediator";
  message: string;
  attachments?: string[];
  timestamp: string;
}

interface DisputeResolutionProps {
  orderId?: string;
  disputeId?: string;
  userRole?: "buyer" | "seller" | "mediator";
}

const DisputeResolution = ({
  orderId,
  disputeId,
  userRole = "buyer",
}: DisputeResolutionProps) => {
  const [disputes, setDisputes] = useState<Dispute[]>([]);
  const [selectedDispute, setSelectedDispute] = useState<Dispute | null>(null);
  const [isCreateDisputeOpen, setIsCreateDisputeOpen] = useState(false);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);

  const { user } = useAuth();
  const { orders } = useMarketplace();
  const { toast } = useToast();

  // Mock dispute data
  const mockDisputes: Dispute[] = [
    {
      id: "dispute_1",
      orderId: "order_123",
      productName: "Wireless Noise Cancelling Headphones",
      buyerName: "John Doe",
      sellerName: "AudioTech",
      type: "item_not_as_described",
      status: "in_review",
      priority: "medium",
      amount: 249.99,
      description:
        "Product received does not match the description. The noise cancelling feature is not working properly and the build quality is poor.",
      buyerEvidence: ["photo1.jpg", "video1.mp4"],
      sellerResponse:
        "We apologize for the issue. This seems to be a defective unit. We would like to offer a replacement or full refund.",
      sellerEvidence: ["warranty_info.pdf"],
      createdAt: "2024-01-15T10:30:00Z",
      updatedAt: "2024-01-16T14:45:00Z",
      messages: [
        {
          id: "msg_1",
          senderId: "buyer_1",
          senderName: "John Doe",
          senderType: "buyer",
          message:
            "The headphones I received don't match what was advertised. The noise cancelling doesn't work at all.",
          attachments: ["headphones_photo.jpg"],
          timestamp: "2024-01-15T10:30:00Z",
        },
        {
          id: "msg_2",
          senderId: "seller_1",
          senderName: "AudioTech",
          senderType: "seller",
          message:
            "We sincerely apologize for this issue. This appears to be a manufacturing defect. We'd like to offer you a full replacement or refund.",
          timestamp: "2024-01-15T16:20:00Z",
        },
        {
          id: "msg_3",
          senderId: "mediator_1",
          senderName: "Support Team",
          senderType: "mediator",
          message:
            "Thank you both for providing details. Based on the evidence, we'll proceed with the seller's offer for a full refund.",
          timestamp: "2024-01-16T14:45:00Z",
        },
      ],
    },
    {
      id: "dispute_2",
      orderId: "order_456",
      productName: "Smart Watch Series 5",
      buyerName: "Jane Smith",
      sellerName: "TechGear Pro",
      type: "product_not_received",
      status: "open",
      priority: "high",
      amount: 199.99,
      description:
        "Order was marked as delivered but I never received the package. Tracking shows it was delivered to the wrong address.",
      buyerEvidence: ["tracking_screenshot.png"],
      createdAt: "2024-01-18T09:15:00Z",
      updatedAt: "2024-01-18T09:15:00Z",
      messages: [
        {
          id: "msg_4",
          senderId: "buyer_2",
          senderName: "Jane Smith",
          senderType: "buyer",
          message:
            "My order shows as delivered but I never received it. The tracking information shows it was delivered to the wrong address.",
          attachments: ["tracking_info.png"],
          timestamp: "2024-01-18T09:15:00Z",
        },
      ],
    },
  ];

  const [formData, setFormData] = useState({
    orderId: orderId || "",
    type: "item_not_as_described",
    description: "",
    evidence: [] as File[],
  });

  useEffect(() => {
    const loadDisputes = async () => {
      setLoading(true);
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setDisputes(mockDisputes);

      if (disputeId) {
        const dispute = mockDisputes.find((d) => d.id === disputeId);
        setSelectedDispute(dispute || null);
      }

      setLoading(false);
    };

    loadDisputes();
  }, [disputeId]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "open":
        return "bg-blue-100 text-blue-800";
      case "in_review":
        return "bg-yellow-100 text-yellow-800";
      case "resolved":
        return "bg-green-100 text-green-800";
      case "closed":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-800";
      case "medium":
        return "bg-yellow-100 text-yellow-800";
      case "low":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getDisputeTypeLabel = (type: string) => {
    switch (type) {
      case "product_not_received":
        return "Product Not Received";
      case "item_not_as_described":
        return "Item Not as Described";
      case "return_request":
        return "Return Request";
      case "refund_request":
        return "Refund Request";
      case "other":
        return "Other";
      default:
        return type;
    }
  };

  const handleCreateDispute = async () => {
    if (!formData.orderId || !formData.description) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    const newDispute: Dispute = {
      id: `dispute_${Date.now()}`,
      orderId: formData.orderId,
      productName: "Sample Product",
      buyerName: user?.username || "Current User",
      sellerName: "Sample Seller",
      type: formData.type as any,
      status: "open",
      priority: "medium",
      amount: 100,
      description: formData.description,
      buyerEvidence: formData.evidence.map((file) => file.name),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      messages: [],
    };

    setDisputes((prev) => [newDispute, ...prev]);
    setFormData({
      orderId: "",
      type: "item_not_as_described",
      description: "",
      evidence: [],
    });
    setIsCreateDisputeOpen(false);

    toast({
      title: "Dispute Created",
      description: "Your dispute has been submitted and is under review",
    });
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !selectedDispute) return;

    const message: DisputeMessage = {
      id: `msg_${Date.now()}`,
      senderId: user?.id || "current_user",
      senderName: user?.username || "Current User",
      senderType: userRole,
      message: newMessage,
      timestamp: new Date().toISOString(),
    };

    setSelectedDispute((prev) =>
      prev
        ? {
            ...prev,
            messages: [...prev.messages, message],
            updatedAt: new Date().toISOString(),
          }
        : null,
    );

    setNewMessage("");

    toast({
      title: "Message Sent",
      description: "Your message has been added to the dispute",
    });
  };

  const renderDisputeList = () => (
    <div className="space-y-4">
      {disputes.map((dispute) => (
        <Card
          key={dispute.id}
          className={cn(
            "cursor-pointer transition-all hover:shadow-md",
            selectedDispute?.id === dispute.id && "ring-2 ring-primary",
          )}
          onClick={() => setSelectedDispute(dispute)}
        >
          <CardContent className="p-4">
            <div className="flex items-start justify-between">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <h3 className="font-medium">{dispute.productName}</h3>
                  <Badge className={getStatusColor(dispute.status)}>
                    {dispute.status.replace("_", " ")}
                  </Badge>
                  <Badge className={getPriorityColor(dispute.priority)}>
                    {dispute.priority}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">
                  {dispute.description}
                </p>
                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                  <span>Order: {dispute.orderId}</span>
                  <span>Amount: ${dispute.amount}</span>
                  <span>Created: {formatDate(dispute.createdAt)}</span>
                </div>
              </div>
              <div className="text-sm text-muted-foreground">
                {getDisputeTypeLabel(dispute.type)}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );

  const renderDisputeDetails = () => {
    if (!selectedDispute) {
      return (
        <div className="text-center py-12">
          <FileText className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium mb-2">No Dispute Selected</h3>
          <p className="text-muted-foreground">
            Select a dispute from the list to view details
          </p>
        </div>
      );
    }

    return (
      <div className="space-y-6">
        {/* Dispute Header */}
        <div className="space-y-4">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-xl font-semibold">
                {selectedDispute.productName}
              </h2>
              <p className="text-muted-foreground">
                {getDisputeTypeLabel(selectedDispute.type)}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Badge className={getStatusColor(selectedDispute.status)}>
                {selectedDispute.status.replace("_", " ")}
              </Badge>
              <Badge className={getPriorityColor(selectedDispute.priority)}>
                {selectedDispute.priority} priority
              </Badge>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-1">
              <Label className="text-xs text-muted-foreground">Order ID</Label>
              <p className="font-medium">{selectedDispute.orderId}</p>
            </div>
            <div className="space-y-1">
              <Label className="text-xs text-muted-foreground">
                Dispute Amount
              </Label>
              <p className="font-medium">${selectedDispute.amount}</p>
            </div>
            <div className="space-y-1">
              <Label className="text-xs text-muted-foreground">Created</Label>
              <p className="font-medium">
                {formatDate(selectedDispute.createdAt)}
              </p>
            </div>
          </div>
        </div>

        <Separator />

        {/* Dispute Details */}
        <div className="space-y-4">
          <h3 className="font-medium">Dispute Description</h3>
          <p className="text-muted-foreground">{selectedDispute.description}</p>

          {selectedDispute.buyerEvidence.length > 0 && (
            <div>
              <h4 className="font-medium mb-2">Evidence Provided</h4>
              <div className="flex gap-2">
                {selectedDispute.buyerEvidence.map((evidence, index) => (
                  <Badge key={index} variant="outline" className="text-xs">
                    <FileText className="w-3 h-3 mr-1" />
                    {evidence}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </div>

        <Separator />

        {/* Messages */}
        <div className="space-y-4">
          <h3 className="font-medium">Dispute Messages</h3>
          <div className="space-y-4 max-h-96 overflow-y-auto">
            {selectedDispute.messages.map((message) => (
              <div
                key={message.id}
                className={cn(
                  "flex gap-3 p-3 rounded-lg",
                  message.senderType === "mediator"
                    ? "bg-blue-50 border border-blue-200"
                    : message.senderType === userRole
                      ? "bg-primary/5 border border-primary/20 ml-8"
                      : "bg-muted mr-8",
                )}
              >
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                  {message.senderType === "mediator" ? (
                    <Gavel className="w-4 h-4" />
                  ) : (
                    <User className="w-4 h-4" />
                  )}
                </div>
                <div className="flex-1 space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-sm">
                      {message.senderName}
                    </span>
                    <Badge
                      variant="outline"
                      className={cn(
                        "text-xs",
                        message.senderType === "mediator" &&
                          "bg-blue-100 text-blue-800",
                      )}
                    >
                      {message.senderType}
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                      {formatDate(message.timestamp)}
                    </span>
                  </div>
                  <p className="text-sm">{message.message}</p>
                  {message.attachments && message.attachments.length > 0 && (
                    <div className="flex gap-1">
                      {message.attachments.map((attachment, index) => (
                        <Badge
                          key={index}
                          variant="outline"
                          className="text-xs"
                        >
                          <FileText className="w-3 h-3 mr-1" />
                          {attachment}
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Send Message */}
          {selectedDispute.status !== "closed" && (
            <div className="space-y-3">
              <Textarea
                placeholder="Type your message..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                rows={3}
              />
              <div className="flex justify-between items-center">
                <Button variant="outline" size="sm">
                  <Upload className="w-4 h-4 mr-2" />
                  Attach Files
                </Button>
                <Button
                  onClick={handleSendMessage}
                  disabled={!newMessage.trim()}
                >
                  <MessageCircle className="w-4 h-4 mr-2" />
                  Send Message
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center space-y-4">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-muted-foreground">Loading disputes...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Dispute Resolution Center</h2>
          <p className="text-muted-foreground">
            Manage and resolve order disputes
          </p>
        </div>

        <Dialog
          open={isCreateDisputeOpen}
          onOpenChange={setIsCreateDisputeOpen}
        >
          <DialogTrigger asChild>
            <Button>
              <AlertCircle className="w-4 h-4 mr-2" />
              Create Dispute
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Create New Dispute</DialogTitle>
              <DialogDescription>
                Report an issue with your order and we'll help resolve it
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="orderId">Order ID</Label>
                <Input
                  id="orderId"
                  placeholder="Enter your order ID"
                  value={formData.orderId}
                  onChange={(e) =>
                    setFormData({ ...formData, orderId: e.target.value })
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="type">Dispute Type</Label>
                <Select
                  value={formData.type}
                  onValueChange={(value) =>
                    setFormData({ ...formData, type: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="item_not_as_described">
                      Item Not as Described
                    </SelectItem>
                    <SelectItem value="product_not_received">
                      Product Not Received
                    </SelectItem>
                    <SelectItem value="return_request">
                      Return Request
                    </SelectItem>
                    <SelectItem value="refund_request">
                      Refund Request
                    </SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Describe the issue in detail..."
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  rows={4}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="evidence">Evidence (Optional)</Label>
                <Input
                  id="evidence"
                  type="file"
                  multiple
                  accept="image/*,.pdf"
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      evidence: e.target.files
                        ? Array.from(e.target.files)
                        : [],
                    })
                  }
                />
                <p className="text-xs text-muted-foreground">
                  Upload photos, videos, or documents that support your case
                </p>
              </div>

              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={() => setIsCreateDisputeOpen(false)}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button onClick={handleCreateDispute} className="flex-1">
                  Create Dispute
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Disputes List */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Your Disputes</CardTitle>
            </CardHeader>
            <CardContent>
              {disputes.length === 0 ? (
                <div className="text-center py-8">
                  <FileText className="w-8 h-8 mx-auto text-muted-foreground mb-2" />
                  <p className="text-sm text-muted-foreground">
                    No disputes found
                  </p>
                </div>
              ) : (
                renderDisputeList()
              )}
            </CardContent>
          </Card>
        </div>

        {/* Dispute Details */}
        <div className="lg:col-span-2">
          <Card>
            <CardContent className="p-6">{renderDisputeDetails()}</CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default DisputeResolution;
