import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ArrowRight,
  Wallet,
  Star,
  Shield,
  AlertCircle,
  CheckCircle,
  Clock,
  DollarSign,
} from "lucide-react";
import { formatCurrency, formatNumber } from "@/utils/formatters";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

interface WithdrawalModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentSoftPoints: number;
  availableToWithdraw: number;
  trustScore: {
    current: number;
    level: string;
    multiplier: number;
  };
  currency?: string;
  onWithdrawalSuccess?: (amount: number, method: string) => void;
}

const WithdrawalModal: React.FC<WithdrawalModalProps> = ({
  isOpen,
  onClose,
  currentSoftPoints,
  availableToWithdraw,
  trustScore,
  currency = "USD",
  onWithdrawalSuccess,
}) => {
  const { toast } = useToast();
  const [withdrawalAmount, setWithdrawalAmount] = useState("");
  const [withdrawalMethod, setWithdrawalMethod] = useState("unified-wallet");
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingStep, setProcessingStep] = useState(0);

  const processingSteps = [
    "Validating withdrawal...",
    "Converting SoftPoints...",
    "Processing transaction...",
    "Updating wallet balance...",
    "Finalizing transfer...",
  ];

  const conversionRate = 100; // 100 SP = 1 USD (adjust as needed)
  const withdrawalAmountNumber = parseFloat(withdrawalAmount) || 0;
  const requiredSoftPoints = withdrawalAmountNumber * conversionRate;
  const fees = Math.max(withdrawalAmountNumber * 0.02, 0.5); // 2% fee, minimum $0.50
  const netAmount = withdrawalAmountNumber - fees;

  const canWithdraw = 
    withdrawalAmountNumber > 0 && 
    withdrawalAmountNumber <= availableToWithdraw &&
    withdrawalAmountNumber >= 5; // Minimum $5 withdrawal

  const handleWithdraw = async () => {
    if (!canWithdraw) return;

    setIsProcessing(true);
    setProcessingStep(0);

    try {
      // Simulate processing steps
      for (let i = 0; i < processingSteps.length; i++) {
        setProcessingStep(i);
        await new Promise(resolve => setTimeout(resolve, 1000));
      }

      // Here you would make the actual API call to process the withdrawal
      // const response = await fetch('/api/rewards/withdraw', { ... });

      toast({
        title: "Withdrawal Successful!",
        description: `${formatCurrency(netAmount, currency)} has been transferred to your unified wallet. Check the Rewards section in your wallet.`,
      });

      onWithdrawalSuccess?.(netAmount, withdrawalMethod);
      onClose();
      setWithdrawalAmount("");
    } catch (error) {
      toast({
        title: "Withdrawal Failed",
        description: "Please try again later or contact support.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
      setProcessingStep(0);
    }
  };

  const quickAmounts = [5, 10, 25, 50, 100];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[95vw] sm:max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader className="flex-shrink-0">
          <DialogTitle className="flex items-center gap-2">
            <Wallet className="h-5 w-5 text-softchat-primary" />
            Withdraw Rewards
          </DialogTitle>
          <DialogDescription>
            Convert your SoftPoints to cash and transfer to your unified wallet
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col min-h-0 max-h-[60vh]">
          {isProcessing ? (
            <div className="space-y-6 py-4">
              <div className="text-center space-y-4">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-softchat-primary/10 rounded-full">
                  <Clock className="h-8 w-8 text-softchat-primary animate-spin" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">Processing Withdrawal</h3>
                  <p className="text-sm text-muted-foreground">
                    {processingSteps[processingStep]}
                  </p>
                </div>
              </div>
              <Progress value={(processingStep + 1) / processingSteps.length * 100} />
            </div>
          ) : (
            <>
              <div className="flex-1 overflow-y-auto space-y-4 pr-2">
                {/* Current Balance Display */}
                <div className="bg-gradient-to-r from-softchat-primary/10 to-purple-500/10 rounded-lg p-3 sm:p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Star className="h-4 w-4 sm:h-5 sm:w-5 text-yellow-500" />
                      <span className="font-semibold text-sm sm:text-base">{formatNumber(currentSoftPoints)} SP</span>
                    </div>
                    <Badge variant="secondary" className="flex items-center gap-1 text-xs">
                      <Shield className="h-3 w-3" />
                      {trustScore.level}
                    </Badge>
                  </div>
                  <div className="text-xs sm:text-sm text-muted-foreground">
                    Available to withdraw: {formatCurrency(availableToWithdraw, currency)}
                  </div>
                </div>

                {/* Withdrawal Amount */}
                <div className="space-y-3">
                  <Label htmlFor="amount" className="text-sm">Withdrawal Amount ({currency})</Label>
                  <div className="space-y-2">
                    <Input
                      id="amount"
                      type="number"
                      placeholder="0.00"
                      value={withdrawalAmount}
                      onChange={(e) => setWithdrawalAmount(e.target.value)}
                      className="text-base sm:text-lg font-semibold"
                      min="5"
                      max={availableToWithdraw}
                      step="0.01"
                    />
                    <div className="grid grid-cols-3 sm:flex gap-2">
                      {quickAmounts.map((amount) => (
                        <Button
                          key={amount}
                          variant="outline"
                          size="sm"
                          onClick={() => setWithdrawalAmount(String(amount))}
                          disabled={amount > availableToWithdraw}
                          className="text-xs"
                        >
                          {formatCurrency(amount, currency)}
                        </Button>
                      ))}
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setWithdrawalAmount(String(availableToWithdraw))}
                        className="text-xs col-span-3 sm:col-span-1"
                      >
                        Max
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Conversion Info */}
                {withdrawalAmountNumber > 0 && (
                  <div className="bg-gray-50 rounded-lg p-3 space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>SoftPoints Required:</span>
                      <span className="font-medium">{formatNumber(requiredSoftPoints)} SP</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Processing Fee (2%):</span>
                      <span className="font-medium">{formatCurrency(fees, currency)}</span>
                    </div>
                    <div className="flex justify-between font-semibold border-t pt-2">
                      <span>You'll receive:</span>
                      <span className="text-green-600">{formatCurrency(netAmount, currency)}</span>
                    </div>
                  </div>
                )}

                {/* Withdrawal Method */}
                <div className="space-y-3">
                  <Label htmlFor="method" className="text-sm">Transfer To</Label>
                  <Select value={withdrawalMethod} onValueChange={setWithdrawalMethod}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select withdrawal method" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="unified-wallet">
                        <div className="flex items-center gap-2">
                          <Wallet className="h-4 w-4" />
                          <span>Unified Wallet</span>
                          <Badge variant="secondary" className="text-xs">Instant</Badge>
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Validation Messages */}
                {withdrawalAmountNumber > 0 && (
                  <div className="space-y-2">
                    {withdrawalAmountNumber < 5 && (
                      <div className="flex items-center gap-2 text-amber-600 text-sm">
                        <AlertCircle className="h-4 w-4 flex-shrink-0" />
                        <span>Minimum withdrawal amount is {formatCurrency(5, currency)}</span>
                      </div>
                    )}
                    {withdrawalAmountNumber > availableToWithdraw && (
                      <div className="flex items-center gap-2 text-red-600 text-sm">
                        <AlertCircle className="h-4 w-4 flex-shrink-0" />
                        <span>Insufficient balance. Maximum: {formatCurrency(availableToWithdraw, currency)}</span>
                      </div>
                    )}
                    {canWithdraw && (
                      <div className="flex items-center gap-2 text-green-600 text-sm">
                        <CheckCircle className="h-4 w-4 flex-shrink-0" />
                        <span>Ready to withdraw</span>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Action Buttons - Fixed at bottom */}
              <div className="flex gap-3 pt-4 border-t mt-4 flex-shrink-0">
                <Button variant="outline" onClick={onClose} className="flex-1">
                  Cancel
                </Button>
                <Button
                  onClick={handleWithdraw}
                  disabled={!canWithdraw}
                  className="flex-1 bg-softchat-primary hover:bg-softchat-700"
                >
                  <DollarSign className="h-4 w-4 mr-2" />
                  <span className="hidden sm:inline">Withdraw</span>
                  <ArrowRight className="h-4 w-4 sm:ml-2" />
                </Button>
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default WithdrawalModal;
