import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
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
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { walletService } from "@/services/walletService";
import { useToast } from "@/components/ui/use-toast";
// import { useI18n } from "@/contexts/I18nContext"; // Temporarily disabled
// import { RegionalPaymentMethods } from "@/components/i18n/LanguageCurrencySelector"; // Temporarily disabled
import {
  Loader2,
  Plus,
  CreditCard,
  ShoppingCart,
  Bitcoin,
  Gift,
  Briefcase,
  Wallet,
  Building,
  Smartphone,
} from "lucide-react";

interface DepositModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const DepositModal = ({ isOpen, onClose, onSuccess }: DepositModalProps) => {
  const [amount, setAmount] = useState("");
  const [method, setMethod] = useState<
    "card" | "bank" | "crypto" | "mobile" | "ewallet"
  >("card");
  const [source, setSource] = useState<
    "ecommerce" | "crypto" | "rewards" | "freelance"
  >("ecommerce");
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("");
  const [description, setDescription] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  // const { currentCurrency, availablePaymentMethods, formatCurrency } = useI18n(); // Temporarily disabled

  const paymentMethods = [
    {
      value: "card",
      label: "Credit/Debit Card",
      icon: CreditCard,
      color: "text-blue-600",
    },
    {
      value: "bank",
      label: "Bank Transfer",
      icon: Wallet,
      color: "text-green-600",
    },
    {
      value: "crypto",
      label: "Cryptocurrency",
      icon: Bitcoin,
      color: "text-orange-600",
    },
  ];

  const depositSources = [
    {
      value: "ecommerce",
      label: "E-Commerce Wallet",
      icon: <ShoppingCart className="w-5 h-5" />,
      description: "For marketplace purchases",
    },
    {
      value: "crypto",
      label: "Crypto Portfolio",
      icon: <Bitcoin className="w-5 h-5" />,
      description: "For crypto trading",
    },
    {
      value: "rewards",
      label: "Rewards Account",
      icon: <Gift className="w-5 h-5" />,
      description: "For reward programs",
    },
    {
      value: "freelance",
      label: "Freelance Wallet",
      icon: <Briefcase className="w-5 h-5" />,
      description: "For freelance payments",
    },
  ];

  const getMethodInfo = () => {
    return paymentMethods.find((m) => m.value === method);
  };

  const getSourceInfo = () => {
    return depositSources.find((s) => s.value === source);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const depositAmount = parseFloat(amount);

    if (!depositAmount || depositAmount <= 0) {
      toast({
        title: "Invalid Amount",
        description: "Please enter a valid deposit amount",
        variant: "destructive",
      });
      return;
    }

    if (depositAmount < 1) {
      toast({
        title: "Minimum Deposit",
        description: "Minimum deposit amount is $1.00",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      const result = await walletService.processDeposit({
        amount: depositAmount,
        method,
        source,
        description: description || undefined,
      });

      if (result.success) {
        toast({
          title: "Deposit Successful",
          description: result.message,
        });
        onSuccess();
        onClose();
        resetForm();
      } else {
        toast({
          title: "Deposit Failed",
          description: result.message,
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to process deposit",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setAmount("");
    setMethod("card");
    setSource("ecommerce");
    setDescription("");
  };

  const methodInfo = getMethodInfo();
  const sourceInfo = getSourceInfo();

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <div className="p-2 rounded-full bg-green-100">
              <Plus className="h-5 w-5 text-green-600" />
            </div>
            Add Funds
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Amount Input */}
          <div className="space-y-2">
            <Label htmlFor="amount">Deposit Amount</Label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                $
              </span>
              <Input
                id="amount"
                type="number"
                step="0.01"
                min="1.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.00"
                className="pl-8"
                required
              />
            </div>
            <p className="text-sm text-gray-500">Minimum deposit: $1.00</p>
          </div>

          {/* Payment Method Selection */}
          <div className="space-y-3">
            <Label htmlFor="method">Payment Method</Label>
            <div className="grid grid-cols-1 gap-2">
              {paymentMethods.map((paymentMethod) => (
                <Card
                  key={paymentMethod.value}
                  className={`cursor-pointer transition-all ${
                    method === paymentMethod.value
                      ? "ring-2 ring-blue-500 bg-blue-50"
                      : "hover:bg-gray-50"
                  }`}
                  onClick={() => setMethod(paymentMethod.value as any)}
                >
                  <CardContent className="p-3">
                    <div className="flex items-center gap-3">
                      <paymentMethod.icon
                        className={`h-5 w-5 ${paymentMethod.color}`}
                      />
                      <span className="font-medium">{paymentMethod.label}</span>
                      {method === paymentMethod.value && (
                        <Badge className="ml-auto">Selected</Badge>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Destination Selection */}
          <div className="space-y-3">
            <Label htmlFor="source">Add To</Label>
            <Select
              value={source}
              onValueChange={(value: any) => setSource(value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select destination wallet" />
              </SelectTrigger>
              <SelectContent>
                {depositSources.map((depositSource) => (
                  <SelectItem
                    key={depositSource.value}
                    value={depositSource.value}
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{depositSource.icon}</span>
                      <div>
                        <div className="font-medium">{depositSource.label}</div>
                        <div className="text-xs text-gray-500">
                          {depositSource.description}
                        </div>
                      </div>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Selected Destination Info */}
            {sourceInfo && (
              <Card className="border-l-4 border-l-green-500">
                <CardContent className="p-4">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{sourceInfo.icon}</span>
                    <div>
                      <span className="font-medium">{sourceInfo.label}</span>
                      <p className="text-sm text-gray-500">
                        {sourceInfo.description}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Payment Method Specific Info */}
          {methodInfo && (
            <Card className="bg-gray-50">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <methodInfo.icon className={`h-5 w-5 ${methodInfo.color}`} />
                  <div>
                    <p className="font-medium text-sm">{methodInfo.label}</p>
                    <p className="text-xs text-gray-500">
                      {method === "card" && "Instant processing, 2.9% fee"}
                      {method === "bank" && "1-3 business days, no fee"}
                      {method === "crypto" &&
                        "Network fees apply, varies by blockchain"}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Description (Optional)</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Add a note for this deposit..."
              rows={2}
            />
          </div>

          <DialogFooter className="flex-col sm:flex-row gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="w-full sm:w-auto"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full sm:w-auto bg-green-600 hover:bg-green-700"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  Processing...
                </>
              ) : (
                `Deposit $${amount || "0.00"}`
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default DepositModal;
