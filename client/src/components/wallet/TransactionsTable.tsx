
import { FileText, CreditCard } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const TransactionsTable = () => {
  return (
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
  );
};

export default TransactionsTable;
