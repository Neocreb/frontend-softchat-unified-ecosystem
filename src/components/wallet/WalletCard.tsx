
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Wallet, ArrowDown, ArrowUp, Plus, TrendingUp } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";

const WalletCard = () => {
  const [balance, setBalance] = useState(2450.75);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleAddFunds = () => {
    setIsLoading(true);
    
    // Simulate adding funds
    setTimeout(() => {
      setBalance(prev => prev + 100);
      setIsLoading(false);
      toast({
        title: "Funds added",
        description: "$100.00 has been added to your wallet",
      });
    }, 1500);
  };

  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-3 bg-gradient-to-r from-softchat-primary to-softchat-accent text-white">
        <CardTitle className="flex items-center gap-2">
          <Wallet className="h-5 w-5" />
          Your Wallet
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="flex justify-between items-center mb-5">
          <div>
            <div className="text-sm text-muted-foreground">Total Balance</div>
            <div className="text-3xl font-bold">${balance.toFixed(2)}</div>
          </div>
          <Button onClick={handleAddFunds} disabled={isLoading}>
            {isLoading ? "Processing..." : (
              <>
                <Plus className="mr-2 h-4 w-4" />
                Add Funds
              </>
            )}
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="rounded-lg border p-3">
            <div className="text-sm text-muted-foreground mb-1">Rewards</div>
            <div className="text-lg font-semibold">$120.50</div>
          </div>
          <div className="rounded-lg border p-3">
            <div className="text-sm text-muted-foreground mb-1">Marketplace</div>
            <div className="text-lg font-semibold">$830.25</div>
          </div>
          <div className="rounded-lg border p-3">
            <div className="text-sm text-muted-foreground mb-1">Crypto Profit</div>
            <div className="text-lg font-semibold text-green-500">+$1,500.00</div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex justify-between items-center border-b pb-4">
            <div className="text-sm font-medium">Recent Transactions</div>
            <Button variant="link" size="sm" className="h-auto p-0">
              View All
            </Button>
          </div>

          {[
            {
              type: "deposit",
              description: "Crypto Trade Profit",
              amount: 245.75,
              date: "Apr 12, 2025",
              icon: TrendingUp,
            },
            {
              type: "withdrawal",
              description: "Marketplace Purchase",
              amount: -120.00,
              date: "Apr 10, 2025",
              icon: ArrowUp,
            },
            {
              type: "deposit",
              description: "Rewards Redemption",
              amount: 35.50,
              date: "Apr 8, 2025",
              icon: ArrowDown,
            },
          ].map((transaction, index) => (
            <div key={index} className="flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className={`h-8 w-8 rounded-full flex items-center justify-center ${
                  transaction.type === "deposit" ? "bg-green-100" : "bg-red-100"
                }`}>
                  <transaction.icon className={`h-4 w-4 ${
                    transaction.type === "deposit" ? "text-green-600" : "text-red-600"
                  }`} />
                </div>
                <div>
                  <div className="text-sm font-medium">{transaction.description}</div>
                  <div className="text-xs text-muted-foreground">{transaction.date}</div>
                </div>
              </div>
              <div className={`font-medium ${
                transaction.type === "deposit" ? "text-green-600" : "text-red-600"
              }`}>
                {transaction.type === "deposit" ? "+" : ""}{transaction.amount.toFixed(2)}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default WalletCard;
