import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  ArrowUpRight,
  DollarSign,
  Wallet,
  CreditCard,
  Building,
  AlertCircle,
  CheckCircle,
} from "lucide-react";
import { formatCurrency } from "@/utils/formatters";
import { useToast } from "@/hooks/use-toast";

interface WithdrawEarningsProps {
  availableBalance: number;
  userId: string;
  onWithdraw: () => void;
}

const WithdrawEarnings = ({
  availableBalance,
  userId,
  onWithdraw,
}: WithdrawEarningsProps) => {
  const [amount, setAmount] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");
  const [accountDetails, setAccountDetails] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();

  const minWithdrawAmount = 50; // $50 minimum
  const processingFee = 0.02; // 2% processing fee

  const handleWithdraw = async () => {
    const withdrawAmount = parseFloat(amount);

    if (withdrawAmount < minWithdrawAmount) {
      toast({
        title: "Invalid Amount",
        description: `Minimum withdrawal amount is ${formatCurrency(minWithdrawAmount)}`,
        variant: "destructive",
      });
      return;
    }

    if (withdrawAmount > availableBalance) {
      toast({
        title: "Insufficient Balance",
        description: "Withdrawal amount exceeds available balance",
        variant: "destructive",
      });
      return;
    }

    if (!paymentMethod || !accountDetails) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    setIsProcessing(true);

    try {
      // Here you would call the API
      await new Promise((resolve) => setTimeout(resolve, 2000)); // Simulate API call

      toast({
        title: "Withdrawal Requested",
        description:
          "Your withdrawal request has been submitted for processing",
      });

      setAmount("");
      setPaymentMethod("");
      setAccountDetails("");
      onWithdraw();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to process withdrawal request",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const calculateFee = () => {
    const withdrawAmount = parseFloat(amount) || 0;
    return withdrawAmount * processingFee;
  };

  const calculateNetAmount = () => {
    const withdrawAmount = parseFloat(amount) || 0;
    return withdrawAmount - calculateFee();
  };

  return (
    <div className="space-y-6">
      {/* Balance Overview */}
      <Card className="bg-gradient-to-r from-green-50 to-blue-50 border-green-200">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-green-100 rounded-full">
                <Wallet className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <h3 className="font-semibold text-green-900">
                  Available Balance
                </h3>
                <p className="text-2xl font-bold text-green-800">
                  {formatCurrency(availableBalance)}
                </p>
                <p className="text-sm text-green-700">Ready for withdrawal</p>
              </div>
            </div>
            <Badge variant="secondary" className="bg-green-100 text-green-800">
              Verified Account
            </Badge>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Withdrawal Form */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ArrowUpRight className="w-5 h-5" />
              Withdraw Earnings
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="amount">Withdrawal Amount</Label>
              <div className="relative mt-1">
                <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  id="amount"
                  type="number"
                  placeholder="0.00"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="pl-10"
                  min={minWithdrawAmount}
                  max={availableBalance}
                />
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Minimum: {formatCurrency(minWithdrawAmount)} • Maximum:{" "}
                {formatCurrency(availableBalance)}
              </p>
            </div>

            <div>
              <Label htmlFor="payment-method">Payment Method</Label>
              <Select value={paymentMethod} onValueChange={setPaymentMethod}>
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Select payment method" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="bank_transfer">
                    <div className="flex items-center gap-2">
                      <Building className="w-4 h-4" />
                      Bank Transfer
                    </div>
                  </SelectItem>
                  <SelectItem value="unified_wallet">
                    <div className="flex items-center gap-2">
                      <Wallet className="w-4 h-4" />
                      Unified Wallet
                    </div>
                  </SelectItem>
                  <SelectItem value="crypto_wallet">
                    <div className="flex items-center gap-2">
                      <Wallet className="w-4 h-4" />
                      Crypto Wallet
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="account-details">Account Details</Label>
              <Textarea
                id="account-details"
                placeholder="Enter your account details (bank account number, PayPal email, wallet address, etc.)"
                value={accountDetails}
                onChange={(e) => setAccountDetails(e.target.value)}
                className="mt-1"
                rows={3}
              />
            </div>

            {parseFloat(amount) > 0 && (
              <div className="bg-muted p-4 rounded-lg space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Withdrawal Amount:</span>
                  <span>{formatCurrency(parseFloat(amount))}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Processing Fee (2%):</span>
                  <span className="text-red-600">
                    -{formatCurrency(calculateFee())}
                  </span>
                </div>
                <div className="flex justify-between font-medium border-t pt-2">
                  <span>Net Amount:</span>
                  <span className="text-green-600">
                    {formatCurrency(calculateNetAmount())}
                  </span>
                </div>
              </div>
            )}

            <Button
              onClick={handleWithdraw}
              disabled={
                isProcessing || !amount || !paymentMethod || !accountDetails
              }
              className="w-full"
            >
              {isProcessing ? (
                "Processing..."
              ) : (
                <>
                  <ArrowUpRight className="w-4 h-4 mr-2" />
                  Request Withdrawal
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Withdrawal Info */}
        <Card>
          <CardHeader>
            <CardTitle>Withdrawal Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
                <div>
                  <p className="font-medium text-sm">Processing Time</p>
                  <p className="text-xs text-muted-foreground">
                    Withdrawals are typically processed within 3-5 business days
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
                <div>
                  <p className="font-medium text-sm">Minimum Amount</p>
                  <p className="text-xs text-muted-foreground">
                    Minimum withdrawal amount is{" "}
                    {formatCurrency(minWithdrawAmount)}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-amber-500 mt-0.5" />
                <div>
                  <p className="font-medium text-sm">Processing Fee</p>
                  <p className="text-xs text-muted-foreground">
                    A 2% processing fee applies to all withdrawals
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
                <div>
                  <p className="font-medium text-sm">Security</p>
                  <p className="text-xs text-muted-foreground">
                    All withdrawals go through secure verification processes
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
              <h4 className="font-medium text-blue-900 mb-2">Need Help?</h4>
              <p className="text-sm text-blue-800 mb-3">
                Contact our support team if you have questions about
                withdrawals.
              </p>
              <Button
                variant="outline"
                size="sm"
                className="border-blue-300 text-blue-700 hover:bg-blue-100"
              >
                Contact Support
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default WithdrawEarnings;
