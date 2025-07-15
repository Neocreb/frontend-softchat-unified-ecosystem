import { useState, useEffect } from "react";
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
import { WalletBalance, BankAccount } from "@/types/wallet";
import { walletService } from "@/services/walletService";
import { useToast } from "@/components/ui/use-toast";
import {
  Loader2,
  CreditCard,
  AlertCircle,
  Wallet,
  ShoppingCart,
  Bitcoin,
  DollarSign,
  Briefcase,
} from "lucide-react";

interface WithdrawModalProps {
  isOpen: boolean;
  onClose: () => void;
  walletBalance: WalletBalance | null;
  onSuccess: () => void;
}

const WithdrawModal = ({
  isOpen,
  onClose,
  walletBalance,
  onSuccess,
}: WithdrawModalProps) => {
  const [amount, setAmount] = useState("");
  const [source, setSource] = useState<
    "total" | "ecommerce" | "crypto" | "creator_economy" | "freelance"
  >("total");
  const [selectedBank, setSelectedBank] = useState("");
  const [description, setDescription] = useState("");
  const [bankAccounts, setBankAccounts] = useState<BankAccount[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingBanks, setIsLoadingBanks] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (isOpen) {
      loadBankAccounts();
    }
  }, [isOpen]);

  const loadBankAccounts = async () => {
    setIsLoadingBanks(true);
    try {
      const accounts = await walletService.getBankAccounts();
      setBankAccounts(accounts);

      // Auto-select default bank
      const defaultBank = accounts.find((acc) => acc.isDefault);
      if (defaultBank) {
        setSelectedBank(defaultBank.id);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load bank accounts",
        variant: "destructive",
      });
    } finally {
      setIsLoadingBanks(false);
    }
  };

  const getAvailableBalance = () => {
    if (!walletBalance) return 0;
    if (source === "total") return walletBalance.total;
    return walletBalance[source];
  };

  const getSourceInfo = () => {
    const sources = {
      total: {
        name: "Total Balance",
        icon: <Wallet className="w-4 h-4" />,
        color: "bg-blue-500",
      },
      ecommerce: {
        name: "E-Commerce Earnings",
        icon: <ShoppingCart className="w-4 h-4" />,
        color: "bg-green-500",
      },
      crypto: {
        name: "Crypto Portfolio",
        icon: <Bitcoin className="w-4 h-4" />,
        color: "bg-orange-500",
      },
      creator_economy: {
        name: "Creator Economy",
        icon: <DollarSign className="w-4 h-4" />,
        color: "bg-purple-500",
      },
      freelance: {
        name: "Freelance Income",
        icon: <Briefcase className="w-4 h-4" />,
        color: "bg-indigo-500",
      },
    };
    return sources[source];
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const withdrawAmount = parseFloat(amount);
    const availableBalance = getAvailableBalance();

    if (!withdrawAmount || withdrawAmount <= 0) {
      toast({
        title: "Invalid Amount",
        description: "Please enter a valid withdrawal amount",
        variant: "destructive",
      });
      return;
    }

    if (withdrawAmount > availableBalance) {
      toast({
        title: "Insufficient Funds",
        description: `You only have $${availableBalance.toFixed(2)} available`,
        variant: "destructive",
      });
      return;
    }

    if (!selectedBank) {
      toast({
        title: "Bank Account Required",
        description: "Please select a bank account for withdrawal",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      await walletService.withdraw({
        amount: withdrawAmount,
        source,
        bankAccountId: selectedBank,
        description:
          description.trim() || `Withdrawal from ${getSourceInfo().name}`,
      });

      toast({
        title: "Withdrawal Initiated",
        description: `$${withdrawAmount.toFixed(2)} withdrawal request submitted`,
      });

      onSuccess();
      onClose();
      setAmount("");
      setDescription("");
    } catch (error) {
      toast({
        title: "Withdrawal Failed",
        description: "There was an error processing your withdrawal",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setAmount("");
    setSource("total");
    setDescription("");
    setSelectedBank("");
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const availableBalance = getAvailableBalance();
  const sourceInfo = getSourceInfo();

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            Withdraw Funds
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Source Selection */}
          <div className="space-y-2">
            <Label htmlFor="source">Source</Label>
            <Select
              value={source}
              onValueChange={(value: any) => setSource(value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select withdrawal source" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="total">
                  <div className="flex items-center gap-2">
                    <Wallet className="w-4 h-4" />
                    Total Balance
                  </div>
                </SelectItem>
                <SelectItem value="ecommerce">
                  <div className="flex items-center gap-2">
                    <ShoppingCart className="w-4 h-4" />
                    E-Commerce Earnings
                  </div>
                </SelectItem>
                <SelectItem value="crypto">
                  <div className="flex items-center gap-2">
                    <Bitcoin className="w-4 h-4" />
                    Crypto Portfolio
                  </div>
                </SelectItem>
                <SelectItem value="creator_economy">
                  <div className="flex items-center gap-2">
                    <DollarSign className="w-4 h-4" />
                    Creator Economy
                  </div>
                </SelectItem>
                <SelectItem value="freelance">
                  <div className="flex items-center gap-2">
                    <Briefcase className="w-4 h-4" />
                    Freelance Income
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Available Balance Display */}
          <Card>
            <CardContent className="pt-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className={`p-2 rounded-full ${sourceInfo.color}`}>
                    {sourceInfo.icon}
                  </div>
                  <div>
                    <p className="text-sm font-medium">{sourceInfo.name}</p>
                    <p className="text-xs text-muted-foreground">
                      Available Balance
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-lg font-semibold">
                    ${availableBalance.toFixed(2)}
                  </p>
                  <Badge variant="outline" className="text-xs">
                    Available
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Amount Input */}
          <div className="space-y-2">
            <Label htmlFor="amount">Amount (USD)</Label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">
                $
              </span>
              <Input
                id="amount"
                type="number"
                step="0.01"
                min="0.01"
                max={availableBalance}
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.00"
                className="pl-8"
                required
              />
            </div>
            {parseFloat(amount) > availableBalance && (
              <div className="flex items-center gap-1 text-sm text-destructive">
                <AlertCircle className="w-4 h-4" />
                Insufficient funds
              </div>
            )}
          </div>

          {/* Bank Account Selection */}
          <div className="space-y-2">
            <Label htmlFor="bank">Bank Account</Label>
            {isLoadingBanks ? (
              <div className="flex items-center gap-2 p-3 border rounded-md">
                <Loader2 className="w-4 h-4 animate-spin" />
                Loading bank accounts...
              </div>
            ) : (
              <Select
                value={selectedBank}
                onValueChange={setSelectedBank}
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select bank account" />
                </SelectTrigger>
                <SelectContent>
                  {bankAccounts.map((account) => (
                    <SelectItem key={account.id} value={account.id}>
                      <div className="flex items-center gap-2">
                        <CreditCard className="w-4 h-4" />
                        <div>
                          <span className="font-medium">
                            {account.bankName}
                          </span>
                          <span className="text-muted-foreground ml-2">
                            •••• {account.accountNumber.slice(-4)}
                          </span>
                          {account.isDefault && (
                            <Badge variant="secondary" className="ml-2 text-xs">
                              Default
                            </Badge>
                          )}
                        </div>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </div>

          {/* Description (Optional) */}
          <div className="space-y-2">
            <Label htmlFor="description">Description (Optional)</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Add a note for this withdrawal..."
              rows={2}
            />
          </div>

          <DialogFooter className="gap-2">
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={
                isLoading ||
                !amount ||
                parseFloat(amount) <= 0 ||
                parseFloat(amount) > availableBalance ||
                !selectedBank
              }
            >
              {isLoading && <Loader2 className="w-4 h-4 animate-spin mr-2" />}
              Withdraw ${amount || "0.00"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default WithdrawModal;
