import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Shield,
  Clock,
  CheckCircle,
  AlertTriangle,
  User,
  Lock,
  Unlock,
  MessageCircle,
  Flag,
  Timer,
  DollarSign,
  CreditCard,
  Banknote,
} from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { cn } from "@/lib/utils";

interface EscrowTrade {
  id: string;
  buyerId: string;
  sellerId: string;
  asset: string;
  amount: number;
  fiatAmount: number;
  fiatCurrency: string;
  price: number;
  paymentMethod: string;
  status:
    | "INITIATED"
    | "FUNDED"
    | "PAYMENT_PENDING"
    | "PAYMENT_CONFIRMED"
    | "RELEASED"
    | "DISPUTED"
    | "CANCELLED";
  escrowStatus: "PENDING" | "LOCKED" | "RELEASED" | "DISPUTED" | "REFUNDED";
  timeRemaining: number; // minutes
  autoReleaseTime: string;
  buyer: {
    id: string;
    username: string;
    avatar?: string;
    rating: number;
    completedTrades: number;
  };
  seller: {
    id: string;
    username: string;
    avatar?: string;
    rating: number;
    completedTrades: number;
  };
  steps: EscrowStep[];
  createdAt: string;
  updatedAt: string;
}

interface EscrowStep {
  id: string;
  title: string;
  description: string;
  status: "PENDING" | "IN_PROGRESS" | "COMPLETED" | "FAILED";
  completedAt?: string;
  estimatedTime?: number; // minutes
}

interface Props {
  trade: EscrowTrade;
  currentUserId: string;
  isOpen: boolean;
  onClose: () => void;
  onAction: (action: string, data?: any) => void;
}

export default function P2PEscrowSystem({
  trade,
  currentUserId,
  isOpen,
  onClose,
  onAction,
}: Props) {
  const [timeLeft, setTimeLeft] = useState(trade.timeRemaining);
  const [currentStep, setCurrentStep] = useState(0);
  const { toast } = useToast();

  const isUserBuyer = trade.buyerId === currentUserId;
  const isUserSeller = trade.sellerId === currentUserId;
  const counterparty = isUserBuyer ? trade.seller : trade.buyer;

  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft((prev) => Math.max(0, prev - 1));
      }, 60000); // Update every minute

      return () => clearInterval(timer);
    }
  }, [timeLeft]);

  useEffect(() => {
    const completedSteps = trade.steps.filter(
      (step) => step.status === "COMPLETED",
    ).length;
    setCurrentStep(completedSteps);
  }, [trade.steps]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "COMPLETED":
        return "text-green-600";
      case "IN_PROGRESS":
        return "text-blue-600";
      case "FAILED":
        return "text-red-600";
      default:
        return "text-gray-500";
    }
  };

  const getEscrowStatusBadge = (status: string) => {
    const configs = {
      PENDING: {
        variant: "outline" as const,
        color: "text-yellow-600",
        icon: Clock,
      },
      LOCKED: {
        variant: "default" as const,
        color: "text-blue-600",
        icon: Lock,
      },
      RELEASED: {
        variant: "default" as const,
        color: "text-green-600",
        icon: Unlock,
      },
      DISPUTED: {
        variant: "destructive" as const,
        color: "text-red-600",
        icon: AlertTriangle,
      },
      REFUNDED: {
        variant: "secondary" as const,
        color: "text-gray-600",
        icon: Unlock,
      },
    };

    const config = configs[status as keyof typeof configs] || configs.PENDING;
    const Icon = config.icon;

    return (
      <Badge variant={config.variant} className="flex items-center gap-1">
        <Icon className="h-3 w-3" />
        {status.replace("_", " ")}
      </Badge>
    );
  };

  const formatTime = (minutes: number) => {
    if (minutes <= 0) return "Expired";
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

  const handlePaymentMade = () => {
    onAction("payment_made", { tradeId: trade.id });
    toast({
      title: "Payment Marked",
      description:
        "You've marked the payment as made. Waiting for seller confirmation.",
    });
  };

  const handleConfirmPayment = () => {
    onAction("confirm_payment", { tradeId: trade.id });
    toast({
      title: "Payment Confirmed",
      description: "Payment confirmed. Crypto will be released automatically.",
    });
  };

  const handleReleaseFunds = () => {
    onAction("release_funds", { tradeId: trade.id });
    toast({
      title: "Funds Released",
      description: "Cryptocurrency has been released to the buyer.",
    });
  };

  const handleDispute = () => {
    onAction("open_dispute", { tradeId: trade.id });
    toast({
      title: "Dispute Opened",
      description: "A dispute has been opened. Support will review this case.",
      variant: "destructive",
    });
  };

  const handleCancel = () => {
    onAction("cancel_trade", { tradeId: trade.id });
    toast({
      title: "Trade Cancelled",
      description: "The trade has been cancelled and funds will be refunded.",
    });
  };

  const progress = (currentStep / trade.steps.length) * 100;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-blue-600" />
            Escrow Trade #{trade.id.slice(-6)}
          </DialogTitle>
          <DialogDescription>
            Secure P2P trade with escrow protection
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Trade Overview */}
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">Trade Details</CardTitle>
                {getEscrowStatusBadge(trade.escrowStatus)}
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold">
                    {trade.amount} {trade.asset}
                  </div>
                  <div className="text-sm text-gray-600">Amount</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold">
                    {trade.fiatAmount.toLocaleString()} {trade.fiatCurrency}
                  </div>
                  <div className="text-sm text-gray-600">Total Price</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold">
                    {trade.price.toLocaleString()} {trade.fiatCurrency}
                  </div>
                  <div className="text-sm text-gray-600">
                    Rate per {trade.asset}
                  </div>
                </div>
              </div>

              <Separator />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Buyer Info */}
                <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                  <Avatar>
                    <AvatarImage src={trade.buyer.avatar} />
                    <AvatarFallback>
                      {trade.buyer.username.slice(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="font-semibold text-green-800">
                      Buyer: {trade.buyer.username}
                      {isUserBuyer && " (You)"}
                    </div>
                    <div className="text-sm text-green-600">
                      ⭐ {trade.buyer.rating}/5 • {trade.buyer.completedTrades}{" "}
                      trades
                    </div>
                  </div>
                </div>

                {/* Seller Info */}
                <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                  <Avatar>
                    <AvatarImage src={trade.seller.avatar} />
                    <AvatarFallback>
                      {trade.seller.username.slice(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="font-semibold text-blue-800">
                      Seller: {trade.seller.username}
                      {isUserSeller && " (You)"}
                    </div>
                    <div className="text-sm text-blue-600">
                      ⭐ {trade.seller.rating}/5 •{" "}
                      {trade.seller.completedTrades} trades
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Timer and Status */}
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Timer className="h-4 w-4 text-orange-500" />
                  <span className="font-medium">Auto-release Timer</span>
                </div>
                <div
                  className={cn(
                    "text-lg font-bold",
                    timeLeft <= 60
                      ? "text-red-600"
                      : timeLeft <= 300
                        ? "text-orange-600"
                        : "text-green-600",
                  )}
                >
                  {formatTime(timeLeft)}
                </div>
              </div>
              <Progress
                value={Math.max(0, (timeLeft / trade.timeRemaining) * 100)}
                className="h-2"
              />
              <div className="text-xs text-gray-500 mt-1">
                Auto-release at:{" "}
                {new Date(trade.autoReleaseTime).toLocaleString()}
              </div>
            </CardContent>
          </Card>

          {/* Escrow Steps */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Escrow Process
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="mb-4">
                <div className="flex justify-between text-sm mb-2">
                  <span>Progress</span>
                  <span>
                    {currentStep}/{trade.steps.length} steps completed
                  </span>
                </div>
                <Progress value={progress} className="h-2" />
              </div>

              <div className="space-y-4">
                {trade.steps.map((step, index) => (
                  <div key={step.id} className="flex items-start gap-3">
                    <div
                      className={cn(
                        "flex-shrink-0 w-8 h-8 rounded-full border-2 flex items-center justify-center text-sm font-medium",
                        step.status === "COMPLETED" &&
                          "bg-green-100 border-green-500 text-green-700",
                        step.status === "IN_PROGRESS" &&
                          "bg-blue-100 border-blue-500 text-blue-700",
                        step.status === "FAILED" &&
                          "bg-red-100 border-red-500 text-red-700",
                        step.status === "PENDING" &&
                          "bg-gray-100 border-gray-300 text-gray-500",
                      )}
                    >
                      {step.status === "COMPLETED" ? (
                        <CheckCircle className="h-4 w-4" />
                      ) : (
                        index + 1
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h4 className="font-medium">{step.title}</h4>
                        <Badge
                          variant="outline"
                          className={getStatusColor(step.status)}
                        >
                          {step.status.replace("_", " ")}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600 mt-1">
                        {step.description}
                      </p>
                      {step.completedAt && (
                        <p className="text-xs text-gray-500 mt-1">
                          Completed:{" "}
                          {new Date(step.completedAt).toLocaleString()}
                        </p>
                      )}
                      {step.estimatedTime && step.status === "PENDING" && (
                        <p className="text-xs text-blue-600 mt-1">
                          Estimated time: {step.estimatedTime} minutes
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Payment Instructions */}
          {trade.status === "PAYMENT_PENDING" && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5" />
                  Payment Instructions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Alert className="mb-4">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>
                    {isUserBuyer
                      ? `Please make payment of ${trade.fiatAmount} ${trade.fiatCurrency} using ${trade.paymentMethod}. Mark as paid when done.`
                      : `Waiting for buyer to make payment of ${trade.fiatAmount} ${trade.fiatCurrency} via ${trade.paymentMethod}.`}
                  </AlertDescription>
                </Alert>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-3 border rounded-lg">
                    <div className="font-medium mb-2">Payment Method</div>
                    <div className="flex items-center gap-2">
                      <Banknote className="h-4 w-4" />
                      {trade.paymentMethod}
                    </div>
                  </div>
                  <div className="p-3 border rounded-lg">
                    <div className="font-medium mb-2">Amount Due</div>
                    <div className="text-lg font-bold">
                      {trade.fiatAmount.toLocaleString()} {trade.fiatCurrency}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Action Buttons */}
          <Card>
            <CardContent className="p-4">
              <div className="flex flex-wrap gap-2 justify-center">
                {/* Buyer Actions */}
                {isUserBuyer && trade.status === "PAYMENT_PENDING" && (
                  <Button
                    onClick={handlePaymentMade}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    <DollarSign className="h-4 w-4 mr-2" />
                    I've Made Payment
                  </Button>
                )}

                {/* Seller Actions */}
                {isUserSeller && trade.status === "PAYMENT_CONFIRMED" && (
                  <Button
                    onClick={handleReleaseFunds}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    <Unlock className="h-4 w-4 mr-2" />
                    Release Funds
                  </Button>
                )}

                {isUserSeller && trade.status === "PAYMENT_PENDING" && (
                  <Button onClick={handleConfirmPayment} variant="outline">
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Confirm Payment Received
                  </Button>
                )}

                {/* Common Actions */}
                <Button
                  variant="outline"
                  onClick={() => onAction("open_chat", { tradeId: trade.id })}
                >
                  <MessageCircle className="h-4 w-4 mr-2" />
                  Chat with {counterparty.username}
                </Button>

                {(trade.status === "PAYMENT_PENDING" ||
                  trade.status === "PAYMENT_CONFIRMED") && (
                  <Button
                    variant="outline"
                    onClick={handleDispute}
                    className="text-red-600 border-red-200 hover:bg-red-50"
                  >
                    <Flag className="h-4 w-4 mr-2" />
                    Open Dispute
                  </Button>
                )}

                {trade.status === "INITIATED" && (
                  <Button
                    variant="outline"
                    onClick={handleCancel}
                    className="text-gray-600"
                  >
                    Cancel Trade
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Security Features */}
          <Card className="border-green-200 bg-green-50">
            <CardContent className="p-4">
              <h4 className="font-medium text-green-800 mb-2 flex items-center gap-2">
                <Shield className="h-4 w-4" />
                Escrow Protection Features
              </h4>
              <div className="text-sm text-green-700 space-y-1">
                <div>
                  • Funds are securely locked in escrow until payment
                  confirmation
                </div>
                <div>• Automatic release timer prevents indefinite holds</div>
                <div>• Dispute resolution available if issues arise</div>
                <div>• 24/7 support monitoring for suspicious activity</div>
                <div>• Full transaction history and audit trail</div>
              </div>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
}
