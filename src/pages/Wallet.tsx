
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import WalletCard from "@/components/wallet/WalletCard";
import CryptoWidget from "@/components/wallet/CryptoWidget";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Award, ArrowDown, Copy, RefreshCw, CreditCard, FileText } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";

const Wallet = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const { toast } = useToast();

  const copyReferralLink = () => {
    navigator.clipboard.writeText("https://softchat.com/ref/johndoe123");
    toast({
      title: "Referral link copied",
      description: "Share it with friends to earn rewards!",
    });
  };

  return (
    <div className="container py-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Financial Hub</h1>
          <p className="text-muted-foreground">Manage your wallet, rewards, and investments</p>
        </div>
        <div className="mt-4 md:mt-0">
          <TabsList>
            <TabsTrigger value="overview" onClick={() => setActiveTab("overview")}>Overview</TabsTrigger>
            <TabsTrigger value="rewards" onClick={() => setActiveTab("rewards")}>Rewards</TabsTrigger>
            <TabsTrigger value="transactions" onClick={() => setActiveTab("transactions")}>Transactions</TabsTrigger>
          </TabsList>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsContent value="overview" className="mt-0">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <WalletCard />
            </div>
            <div>
              <CryptoWidget />
            </div>
          </div>
        </TabsContent>

        <TabsContent value="rewards" className="mt-0">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base font-medium flex items-center gap-2">
                  <Award className="h-4 w-4" />
                  Your Rewards
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="mb-6">
                  <div className="mb-4 flex items-center gap-4">
                    <div className="h-16 w-16 rounded-full bg-gradient-to-br from-softchat-primary to-softchat-accent flex items-center justify-center">
                      <Award className="h-8 w-8 text-white" />
                    </div>
                    <div>
                      <div className="text-lg font-semibold">Bronze Level</div>
                      <div className="text-sm text-muted-foreground">2,450 points earned</div>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span>Progress to Silver</span>
                      <span className="font-medium">2,450 / 5,000</span>
                    </div>
                    <div className="h-2 rounded-full bg-muted">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-softchat-primary to-softchat-accent"
                        style={{ width: "49%" }}
                      ></div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="border rounded-lg p-3">
                    <div className="text-sm font-medium mb-2">Rewards History</div>
                    <div className="space-y-3">
                      {[
                        { action: "Created a post", amount: "+10", date: "Apr 12, 2025" },
                        { action: "Made a purchase", amount: "+50", date: "Apr 10, 2025" },
                        { action: "Referred a friend", amount: "+200", date: "Apr 8, 2025" },
                      ].map((reward, index) => (
                        <div key={index} className="flex justify-between items-center text-sm">
                          <div>
                            <div>{reward.action}</div>
                            <div className="text-xs text-muted-foreground">{reward.date}</div>
                          </div>
                          <div className="font-medium text-green-500">{reward.amount}</div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <Button className="w-full">
                    <ArrowDown className="mr-2 h-4 w-4" />
                    Redeem Points
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base font-medium">Referral Program</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="rounded-lg border p-4">
                  <div className="text-sm font-medium mb-2">Your Referral Link</div>
                  <div className="flex">
                    <div className="flex-1 bg-muted rounded-l-md px-3 py-2 text-sm overflow-hidden text-ellipsis">
                      https://softchat.com/ref/johndoe123
                    </div>
                    <Button 
                      variant="secondary" 
                      className="rounded-l-none" 
                      onClick={copyReferralLink}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="rounded-lg border p-3 text-center">
                    <div className="text-2xl font-bold">3</div>
                    <div className="text-sm text-muted-foreground">Friends Referred</div>
                  </div>
                  <div className="rounded-lg border p-3 text-center">
                    <div className="text-2xl font-bold">600</div>
                    <div className="text-sm text-muted-foreground">Points Earned</div>
                  </div>
                </div>

                <div className="rounded-lg bg-muted p-4">
                  <div className="text-sm font-medium mb-2">How it Works</div>
                  <ol className="space-y-2 text-sm pl-5 list-decimal">
                    <li>Share your unique referral link with friends</li>
                    <li>Friends sign up using your link</li>
                    <li>You earn 200 points for each friend who joins</li>
                    <li>Your friend gets 100 bonus points</li>
                  </ol>
                </div>

                <div className="flex justify-center">
                  <Button variant="outline" className="gap-2">
                    <RefreshCw className="h-4 w-4" />
                    Refresh Referral Stats
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="transactions" className="mt-0">
          <div className="space-y-6">
            <Card>
              <CardHeader className="pb-3">
                <div className="flex justify-between items-center">
                  <CardTitle className="text-base font-medium flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    Transaction History
                  </CardTitle>
                  <Button variant="outline" size="sm">
                    <CreditCard className="mr-2 h-4 w-4" />
                    Link Bank Account
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="rounded-lg border overflow-hidden">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-muted border-b">
                        <th className="text-left py-2 px-4 font-medium">Transaction</th>
                        <th className="text-left py-2 px-4 font-medium">Date</th>
                        <th className="text-left py-2 px-4 font-medium">Type</th>
                        <th className="text-right py-2 px-4 font-medium">Amount</th>
                      </tr>
                    </thead>
                    <tbody>
                      {[
                        { description: "Crypto Trade Profit", date: "Apr 12, 2025", type: "deposit", amount: 245.75 },
                        { description: "Marketplace Purchase", date: "Apr 10, 2025", type: "withdrawal", amount: -120.00 },
                        { description: "Rewards Redemption", date: "Apr 8, 2025", type: "deposit", amount: 35.50 },
                        { description: "Wallet Funding", date: "Apr 5, 2025", type: "deposit", amount: 500.00 },
                        { description: "Marketplace Purchase", date: "Apr 2, 2025", type: "withdrawal", amount: -89.99 },
                      ].map((transaction, index) => (
                        <tr key={index} className={index % 2 === 0 ? "bg-background" : "bg-muted/30"}>
                          <td className="py-3 px-4">{transaction.description}</td>
                          <td className="py-3 px-4">{transaction.date}</td>
                          <td className="py-3 px-4">
                            <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs ${
                              transaction.type === "deposit" 
                                ? "bg-green-100 text-green-700"
                                : "bg-red-100 text-red-700"
                            }`}>
                              {transaction.type === "deposit" ? "Deposit" : "Withdrawal"}
                            </span>
                          </td>
                          <td className={`py-3 px-4 text-right font-medium ${
                            transaction.type === "deposit" ? "text-green-600" : "text-red-600"
                          }`}>
                            {transaction.type === "deposit" ? "+" : ""}{transaction.amount.toFixed(2)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="mt-4 flex justify-center">
                  <Button variant="outline">Load More Transactions</Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Wallet;
