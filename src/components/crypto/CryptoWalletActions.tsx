
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/components/ui/use-toast";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowRight, Copy, Check, Wallet, Info } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import CryptoKYCModal from "./CryptoKYCModal";
import { useNavigate } from "react-router-dom";

interface WalletProps {
  onKYCSubmit: (data: any) => Promise<{success: boolean, error?: any}>;
}

interface WalletBalance {
  currency: string;
  symbol: string;
  balance: number;
  usdValue: number;
  address?: string;
  icon: string;
}

const CryptoWalletActions = ({ onKYCSubmit }: WalletProps) => {
  const [activeTab, setActiveTab] = useState<string>("balances");
  const [copied, setCopied] = useState<string | null>(null);
  const [depositDialogOpen, setDepositDialogOpen] = useState(false);
  const [withdrawDialogOpen, setWithdrawDialogOpen] = useState(false);
  const [kycModalOpen, setKycModalOpen] = useState(false);
  const [withdrawAmount, setWithdrawAmount] = useState("");
  const [withdrawAddress, setWithdrawAddress] = useState("");
  const [selectedCurrency, setSelectedCurrency] = useState<WalletBalance | null>(null);
  const [isWithdrawing, setIsWithdrawing] = useState(false);
  const [walletBalances, setWalletBalances] = useState<WalletBalance[]>([]);
  const [isVerified, setIsVerified] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Mock wallet data
    const mockWallet: WalletBalance[] = [
      {
        currency: "Bitcoin",
        symbol: "BTC",
        balance: 0.05,
        usdValue: 0.05 * 52800,
        address: "bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh",
        icon: "₿",
      },
      {
        currency: "Ethereum",
        symbol: "ETH",
        balance: 1.2,
        usdValue: 1.2 * 3145,
        address: "0x71C7656EC7ab88b098defB751B7401B5f6d8976F",
        icon: "Ξ",
      },
      {
        currency: "Tether",
        symbol: "USDT",
        balance: 250,
        usdValue: 250,
        address: "0xdAC17F958D2ee523a2206206994597C13D831ec7",
        icon: "₮",
      },
      {
        currency: "Solana",
        symbol: "SOL",
        balance: 10,
        usdValue: 10 * 157.83,
        address: "83astBRguLMdt2h5U1Tpdq5tjFoJ6noeGwaY3mDLVcri",
        icon: "◎",
      },
      {
        currency: "SoftPoints",
        symbol: "SP",
        balance: 5000,
        usdValue: 5000 * 0.01,
        icon: "🔮",
      },
    ];

    setWalletBalances(mockWallet);
    
    // Simulate fetching KYC status
    setTimeout(() => {
      setIsVerified(Math.random() > 0.5);
    }, 1000);
  }, []);

  const copyToClipboard = (text: string, currency: string) => {
    navigator.clipboard.writeText(text);
    setCopied(currency);
    
    toast({
      title: "Address Copied",
      description: `${currency} address copied to clipboard`,
    });
    
    setTimeout(() => {
      setCopied(null);
    }, 3000);
  };

  const openDepositDialog = (currency: WalletBalance) => {
    setSelectedCurrency(currency);
    setDepositDialogOpen(true);
  };

  const openWithdrawDialog = (currency: WalletBalance) => {
    if (!isVerified) {
      toast({
        title: "Verification Required",
        description: "You need to complete KYC verification before withdrawing funds.",
        variant: "destructive",
      });
      return;
    }
    
    setSelectedCurrency(currency);
    setWithdrawDialogOpen(true);
  };

  const handleWithdraw = () => {
    if (!selectedCurrency) return;
    
    const amount = parseFloat(withdrawAmount);
    if (isNaN(amount) || amount <= 0) {
      toast({
        title: "Invalid Amount",
        description: "Please enter a valid amount to withdraw.",
        variant: "destructive",
      });
      return;
    }
    
    if (amount > selectedCurrency.balance) {
      toast({
        title: "Insufficient Balance",
        description: `You don't have enough ${selectedCurrency.symbol} to withdraw.`,
        variant: "destructive",
      });
      return;
    }
    
    if (!withdrawAddress) {
      toast({
        title: "Missing Address",
        description: "Please enter a withdrawal address.",
        variant: "destructive",
      });
      return;
    }
    
    setIsWithdrawing(true);
    
    // Simulating withdrawal process
    setTimeout(() => {
      setIsWithdrawing(false);
      setWithdrawDialogOpen(false);
      setWithdrawAmount("");
      setWithdrawAddress("");
      
      toast({
        title: "Withdrawal Initiated",
        description: `Your withdrawal of ${amount} ${selectedCurrency.symbol} is being processed.`,
      });
    }, 2000);
  };

  const handleStartKYC = () => {
    setKycModalOpen(true);
  };

  const handleKYCSubmit = async (data: any) => {
    const result = await onKYCSubmit(data);
    
    if (result.success) {
      setKycModalOpen(false);
      setIsVerified(true);
    }
    
    return result;
  };

  const totalUsdValue = walletBalances.reduce((sum, wallet) => sum + wallet.usdValue, 0);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="col-span-1 md:col-span-3">
          <CardHeader>
            <CardTitle className="text-xl">Your Wallet</CardTitle>
            <CardDescription>
              Manage your crypto assets and SoftPoints
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="balances">Balances</TabsTrigger>
                <TabsTrigger value="transactions">Transactions</TabsTrigger>
              </TabsList>
              
              <TabsContent value="balances">
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Total Balance</p>
                      <h3 className="text-2xl font-bold">${totalUsdValue.toFixed(2)}</h3>
                    </div>
                    
                    {isVerified ? (
                      <Badge className="bg-green-500">Verified</Badge>
                    ) : (
                      <Button variant="outline" onClick={handleStartKYC}>
                        Verify Wallet (KYC)
                      </Button>
                    )}
                  </div>
                  
                  <div className="space-y-4">
                    {walletBalances.map((wallet) => (
                      <div key={wallet.symbol} className="flex justify-between items-center p-4 rounded-lg border">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-xl">
                            {wallet.icon}
                          </div>
                          <div>
                            <p className="font-medium">{wallet.currency}</p>
                            <p className="text-sm text-muted-foreground">{wallet.symbol}</p>
                          </div>
                        </div>
                        
                        <div className="text-right">
                          <p className="font-medium">{wallet.balance} {wallet.symbol}</p>
                          <p className="text-sm text-muted-foreground">${wallet.usdValue.toFixed(2)}</p>
                        </div>
                        
                        <div className="flex gap-2">
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => openDepositDialog(wallet)}
                          >
                            Deposit
                          </Button>
                          <Button 
                            variant={isVerified ? "default" : "outline"} 
                            size="sm"
                            onClick={() => openWithdrawDialog(wallet)}
                            disabled={!isVerified}
                          >
                            Withdraw
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="transactions">
                <div className="py-8 text-center text-muted-foreground">
                  <Wallet className="mx-auto h-12 w-12 mb-4 text-muted-foreground/60" />
                  <p className="text-lg font-medium">No recent transactions</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Deposit or convert crypto to see your transaction history
                  </p>
                  <Button 
                    variant="outline" 
                    className="mt-4"
                    onClick={() => setActiveTab("balances")}
                  >
                    View Balances
                  </Button>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
        
        <div className="col-span-1">
          <Card className="h-full">
            <CardHeader>
              <CardTitle className="text-lg">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button 
                variant="outline" 
                className="w-full justify-start" 
                onClick={() => navigate("/marketplace")}
              >
                <ArrowRight className="mr-2 h-4 w-4" /> Marketplace
              </Button>
              <Button 
                variant="outline" 
                className="w-full justify-start"
                onClick={() => navigate("/wallet")}
              >
                <ArrowRight className="mr-2 h-4 w-4" /> SoftPoints
              </Button>
              <Button 
                variant="outline" 
                className="w-full justify-start"
                onClick={() => navigate("/rewards")}
              >
                <ArrowRight className="mr-2 h-4 w-4" /> Rewards
              </Button>
              <Button 
                variant="outline" 
                className="w-full justify-start"
                onClick={() => setActiveTab("transactions")}
              >
                <ArrowRight className="mr-2 h-4 w-4" /> Transaction History
              </Button>
            </CardContent>
            
            <CardFooter className="flex-col items-start border-t pt-4">
              <p className="text-sm font-medium">Need Help?</p>
              <p className="text-xs text-muted-foreground mb-2">
                Check out our guides on using crypto in Softchat
              </p>
              <Button variant="link" className="h-auto p-0">
                View Crypto Documentation
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
      
      {/* Deposit Dialog */}
      <Dialog open={depositDialogOpen} onOpenChange={setDepositDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              Deposit {selectedCurrency?.currency} ({selectedCurrency?.symbol})
            </DialogTitle>
            <DialogDescription>
              Send {selectedCurrency?.symbol} to your wallet address below
            </DialogDescription>
          </DialogHeader>
          
          {selectedCurrency?.address && (
            <>
              <div className="grid gap-4 py-4">
                <div className="relative">
                  <Input
                    readOnly
                    value={selectedCurrency.address}
                    className="pr-10"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-0 top-0 h-full"
                    onClick={() => copyToClipboard(selectedCurrency.address!, selectedCurrency.symbol)}
                  >
                    {copied === selectedCurrency.symbol ? (
                      <Check className="h-4 w-4" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </Button>
                </div>
                
                <div className="bg-muted p-4 rounded-md">
                  <div className="flex items-center gap-2">
                    <Info className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-medium">Important</span>
                  </div>
                  <ul className="text-sm text-muted-foreground mt-2 space-y-1 list-disc pl-5">
                    <li>Only send {selectedCurrency.symbol} to this address</li>
                    <li>Minimum deposit: 0.001 {selectedCurrency.symbol}</li>
                    <li>Deposits usually confirm within 30 minutes</li>
                  </ul>
                </div>
              </div>
              
              <DialogFooter>
                <Button onClick={() => setDepositDialogOpen(false)}>Close</Button>
              </DialogFooter>
            </>
          )}
          
          {!selectedCurrency?.address && (
            <>
              <div className="py-6 text-center">
                <p>Deposit is not available for {selectedCurrency?.symbol}.</p>
              </div>
              
              <DialogFooter>
                <Button onClick={() => setDepositDialogOpen(false)}>Close</Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
      
      {/* Withdraw Dialog */}
      <Dialog open={withdrawDialogOpen} onOpenChange={setWithdrawDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              Withdraw {selectedCurrency?.currency} ({selectedCurrency?.symbol})
            </DialogTitle>
            <DialogDescription>
              Enter the amount and address for withdrawal
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="flex justify-between items-center">
              <Label htmlFor="amount">Available Balance:</Label>
              <span className="font-medium">
                {selectedCurrency?.balance} {selectedCurrency?.symbol}
              </span>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="amount">Amount</Label>
              <div className="relative">
                <Input
                  id="amount"
                  type="number"
                  placeholder="0.00"
                  step="any"
                  min="0"
                  value={withdrawAmount}
                  onChange={(e) => setWithdrawAmount(e.target.value)}
                />
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-sm text-muted-foreground">
                  {selectedCurrency?.symbol}
                </div>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="address">Withdrawal Address</Label>
              <Input
                id="address"
                placeholder="Enter recipient address"
                value={withdrawAddress}
                onChange={(e) => setWithdrawAddress(e.target.value)}
              />
            </div>
            
            <div className="bg-muted p-4 rounded-md">
              <div className="flex items-center gap-2">
                <Info className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">Important</span>
              </div>
              <ul className="text-sm text-muted-foreground mt-2 space-y-1 list-disc pl-5">
                <li>Minimum withdrawal: 0.001 {selectedCurrency?.symbol}</li>
                <li>Network fee: 0.0001 {selectedCurrency?.symbol}</li>
                <li>Please double-check the address before confirming</li>
              </ul>
            </div>
          </div>
          
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setWithdrawDialogOpen(false)}
              disabled={isWithdrawing}
            >
              Cancel
            </Button>
            <Button 
              onClick={handleWithdraw}
              disabled={isWithdrawing || !withdrawAmount || !withdrawAddress}
            >
              {isWithdrawing ? "Processing..." : "Withdraw"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* KYC Modal */}
      <CryptoKYCModal 
        isOpen={kycModalOpen}
        onClose={() => setKycModalOpen(false)}
        onSubmit={handleKYCSubmit}
      />
    </div>
  );
};

export default CryptoWalletActions;
