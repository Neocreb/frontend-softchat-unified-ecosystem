import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/components/ui/use-toast";
import { africanPaymentService } from "@/services/africanPaymentService";
import {
  CheckCircle,
  Clock,
  AlertCircle,
  XCircle,
  RefreshCw,
  Copy,
  ExternalLink,
  Smartphone,
  Building,
  CreditCard,
  ArrowUpRight,
  ArrowDownLeft,
} from "lucide-react";

interface PaymentStatusProps {
  transactionId: string;
  type: "deposit" | "withdrawal" | "transfer" | "bill_payment" | "top_up";
  amount: number;
  method: string;
  provider?: string;
  onClose: () => void;
}

interface StatusStep {
  id: string;
  label: string;
  status: "completed" | "current" | "pending";
  timestamp?: string;
  description?: string;
}

const PaymentStatusDisplay = ({
  transactionId,
  type,
  amount,
  method,
  provider,
  onClose,
}: PaymentStatusProps) => {
  const { toast } = useToast();
  const [currentStatus, setCurrentStatus] = useState<"pending" | "processing" | "completed" | "failed">("pending");
  const [statusMessage, setStatusMessage] = useState("");
  const [progress, setProgress] = useState(0);
  const [isChecking, setIsChecking] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(new Date().toISOString());

  // Status steps based on transaction type
  const getStatusSteps = (): StatusStep[] => {
    const baseSteps: StatusStep[] = [];

    switch (type) {
      case "deposit":
        return [
          { id: "initiated", label: "Payment Initiated", status: "completed", timestamp: lastUpdated },
          { id: "processing", label: "Processing Payment", status: currentStatus === "pending" ? "current" : "completed" },
          { id: "verification", label: "Verifying Transaction", status: currentStatus === "processing" ? "current" : currentStatus === "completed" ? "completed" : "pending" },
          { id: "completed", label: "Funds Added to Wallet", status: currentStatus === "completed" ? "completed" : "pending" },
        ];

      case "withdrawal":
        return [
          { id: "initiated", label: "Withdrawal Requested", status: "completed", timestamp: lastUpdated },
          { id: "verification", label: "Verifying Account Details", status: currentStatus === "pending" ? "current" : "completed" },
          { id: "processing", label: "Processing Transfer", status: currentStatus === "processing" ? "current" : currentStatus === "completed" ? "completed" : "pending" },
          { id: "completed", label: "Funds Sent to Bank", status: currentStatus === "completed" ? "completed" : "pending" },
        ];

      case "bill_payment":
        return [
          { id: "initiated", label: "Payment Initiated", status: "completed", timestamp: lastUpdated },
          { id: "routing", label: "Routing to Provider", status: currentStatus === "pending" ? "current" : "completed" },
          { id: "processing", label: "Processing Payment", status: currentStatus === "processing" ? "current" : currentStatus === "completed" ? "completed" : "pending" },
          { id: "confirmation", label: "Awaiting Confirmation", status: currentStatus === "completed" ? "completed" : "pending" },
        ];

      case "top_up":
        return [
          { id: "initiated", label: "Top-up Initiated", status: "completed", timestamp: lastUpdated },
          { id: "validation", label: "Validating Phone Number", status: currentStatus === "pending" ? "current" : "completed" },
          { id: "processing", label: "Processing Airtime", status: currentStatus === "processing" ? "current" : currentStatus === "completed" ? "completed" : "pending" },
          { id: "completed", label: "Airtime Added", status: currentStatus === "completed" ? "completed" : "pending" },
        ];

      default:
        return [
          { id: "initiated", label: "Transaction Initiated", status: "completed", timestamp: lastUpdated },
          { id: "processing", label: "Processing", status: currentStatus === "pending" ? "current" : "completed" },
          { id: "completed", label: "Completed", status: currentStatus === "completed" ? "completed" : "pending" },
        ];
    }
  };

  const checkStatus = async () => {
    setIsChecking(true);
    try {
      const result = await africanPaymentService.checkTransactionStatus(transactionId);
      setCurrentStatus(result.status);
      setStatusMessage(result.message);
      setLastUpdated(result.updatedAt);

      // Update progress based on status
      switch (result.status) {
        case "pending":
          setProgress(25);
          break;
        case "processing":
          setProgress(60);
          break;
        case "completed":
          setProgress(100);
          break;
        case "failed":
          setProgress(0);
          break;
      }
    } catch (error) {
      toast({
        title: "Status Check Failed",
        description: "Unable to check transaction status. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsChecking(false);
    }
  };

  // Auto-check status every 10 seconds for active transactions
  useEffect(() => {
    if (currentStatus === "pending" || currentStatus === "processing") {
      const interval = setInterval(checkStatus, 10000);
      return () => clearInterval(interval);
    }
  }, [currentStatus, transactionId]);

  // Initial status check
  useEffect(() => {
    checkStatus();
  }, []);

  const copyTransactionId = () => {
    navigator.clipboard.writeText(transactionId);
    toast({
      title: "Copied",
      description: "Transaction ID copied to clipboard",
    });
  };

  const getStatusIcon = () => {
    switch (currentStatus) {
      case "completed":
        return <CheckCircle className="h-8 w-8 text-green-600" />;
      case "processing":
        return <Clock className="h-8 w-8 text-blue-600 animate-pulse" />;
      case "failed":
        return <XCircle className="h-8 w-8 text-red-600" />;
      default:
        return <Clock className="h-8 w-8 text-orange-600" />;
    }
  };

  const getStatusColor = () => {
    switch (currentStatus) {
      case "completed":
        return "text-green-600 bg-green-50 border-green-200";
      case "processing":
        return "text-blue-600 bg-blue-50 border-blue-200";
      case "failed":
        return "text-red-600 bg-red-50 border-red-200";
      default:
        return "text-orange-600 bg-orange-50 border-orange-200";
    }
  };

  const getTypeIcon = () => {
    switch (type) {
      case "deposit":
        return <ArrowDownLeft className="h-5 w-5 text-green-600" />;
      case "withdrawal":
        return <ArrowUpRight className="h-5 w-5 text-red-600" />;
      case "bill_payment":
        return <CreditCard className="h-5 w-5 text-purple-600" />;
      case "top_up":
        return <Smartphone className="h-5 w-5 text-indigo-600" />;
      default:
        return <Building className="h-5 w-5 text-gray-600" />;
    }
  };

  const getMethodIcon = () => {
    if (method === "mobile") return <Smartphone className="h-4 w-4" />;
    if (method === "bank") return <Building className="h-4 w-4" />;
    if (method === "card") return <CreditCard className="h-4 w-4" />;
    return <Building className="h-4 w-4" />;
  };

  const getExpectedTime = () => {
    switch (method) {
      case "mobile":
        return "Usually instant - 5 minutes";
      case "bank":
        return "2-5 hours for local banks, 1-2 days international";
      case "card":
        return "Instant - 2 minutes";
      case "ewallet":
        return "Instant - 1 minute";
      default:
        return "Processing time varies";
    }
  };

  const statusSteps = getStatusSteps();

  return (
    <div className="space-y-6">
      {/* Status Header */}
      <Card className={`border-2 ${getStatusColor()}`}>
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              {getStatusIcon()}
              <div>
                <h2 className="text-xl font-semibold capitalize">
                  {type.replace("_", " ")} {currentStatus}
                </h2>
                <p className="text-sm text-gray-600">{statusMessage}</p>
              </div>
            </div>
            <Badge variant="outline" className={getStatusColor()}>
              {currentStatus.toUpperCase()}
            </Badge>
          </div>

          {/* Progress Bar */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span>Progress</span>
              <span>{progress}%</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
        </CardContent>
      </Card>

      {/* Transaction Details */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {getTypeIcon()}
            Transaction Details
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-600">Amount</p>
              <p className="font-semibold">${amount.toFixed(2)}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Method</p>
              <div className="flex items-center gap-1">
                {getMethodIcon()}
                <span className="font-semibold capitalize">{method}</span>
              </div>
            </div>
            {provider && (
              <div>
                <p className="text-sm text-gray-600">Provider</p>
                <p className="font-semibold">{provider}</p>
              </div>
            )}
            <div>
              <p className="text-sm text-gray-600">Expected Time</p>
              <p className="text-sm">{getExpectedTime()}</p>
            </div>
          </div>

          <div className="border-t pt-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Transaction ID</p>
                <p className="font-mono text-sm">{transactionId}</p>
              </div>
              <Button
                size="sm"
                variant="outline"
                onClick={copyTransactionId}
                className="gap-1"
              >
                <Copy className="h-3 w-3" />
                Copy
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Status Timeline */}
      <Card>
        <CardHeader>
          <CardTitle>Transaction Progress</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {statusSteps.map((step, index) => (
              <div key={step.id} className="flex items-center gap-4">
                <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                  step.status === "completed" 
                    ? "bg-green-100 text-green-600" 
                    : step.status === "current"
                    ? "bg-blue-100 text-blue-600"
                    : "bg-gray-100 text-gray-400"
                }`}>
                  {step.status === "completed" ? (
                    <CheckCircle className="h-4 w-4" />
                  ) : step.status === "current" ? (
                    <Clock className="h-4 w-4 animate-pulse" />
                  ) : (
                    <div className="w-2 h-2 rounded-full bg-current" />
                  )}
                </div>
                <div className="flex-1">
                  <p className={`font-medium ${
                    step.status === "completed" ? "text-green-800" 
                    : step.status === "current" ? "text-blue-800"
                    : "text-gray-500"
                  }`}>
                    {step.label}
                  </p>
                  {step.timestamp && (
                    <p className="text-xs text-gray-500">
                      {new Date(step.timestamp).toLocaleTimeString()}
                    </p>
                  )}
                  {step.description && (
                    <p className="text-sm text-gray-600">{step.description}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex gap-2">
        <Button
          variant="outline"
          onClick={checkStatus}
          disabled={isChecking}
          className="flex-1"
        >
          {isChecking ? (
            <>
              <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
              Checking...
            </>
          ) : (
            <>
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh Status
            </>
          )}
        </Button>
        
        {currentStatus === "completed" || currentStatus === "failed" ? (
          <Button onClick={onClose} className="flex-1">
            Done
          </Button>
        ) : (
          <Button variant="outline" onClick={onClose} className="flex-1">
            Continue in Background
          </Button>
        )}
      </div>

      {/* Help Text */}
      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5" />
            <div className="text-sm">
              <p className="font-medium text-blue-800 mb-1">Need Help?</p>
              <p className="text-blue-700">
                {currentStatus === "failed" 
                  ? "If your transaction failed, please check your payment method and try again. Contact support if the issue persists."
                  : "Your transaction is being processed. You'll receive a notification when it's complete."
                }
              </p>
              {(currentStatus === "pending" || currentStatus === "processing") && (
                <p className="text-blue-700 mt-2">
                  • Keep this page open to track progress
                  • You can safely close and check back later
                  • Contact support if transaction takes longer than expected
                </p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PaymentStatusDisplay;
