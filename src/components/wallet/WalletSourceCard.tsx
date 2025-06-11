import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Transaction } from "@/types/wallet";
import TransactionItem from "./TransactionItem";
import { ArrowUpRight, TrendingUp } from "lucide-react";

interface WalletSourceCardProps {
  title: string;
  balance: number;
  icon: string;
  color: string;
  transactions: Transaction[];
  onViewAll: () => void;
}

const WalletSourceCard = ({
  title,
  balance,
  icon,
  color,
  transactions,
  onViewAll,
}: WalletSourceCardProps) => {
  const recentTransactions = transactions.slice(0, 3);
  const totalEarned = transactions
    .filter((t) => t.amount > 0)
    .reduce((sum, t) => sum + t.amount, 0);

  return (
    <Card className="overflow-hidden">
      <CardHeader className={`${color} text-white`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="text-2xl">{icon}</div>
            <div>
              <CardTitle className="text-lg font-semibold">{title}</CardTitle>
              <p className="text-white/80 text-sm">Available Balance</p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold">${balance.toFixed(2)}</div>
            {totalEarned > 0 && (
              <div className="flex items-center text-white/80 text-sm">
                <TrendingUp className="w-3 h-3 mr-1" />
                +${totalEarned.toFixed(2)} earned
              </div>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-0">
        {recentTransactions.length > 0 ? (
          <>
            <div className="divide-y divide-gray-100">
              {recentTransactions.map((transaction) => (
                <TransactionItem
                  key={transaction.id}
                  transaction={transaction}
                />
              ))}
            </div>
            {transactions.length > 3 && (
              <div className="p-4 border-t bg-gray-50">
                <Button
                  variant="ghost"
                  onClick={onViewAll}
                  className="w-full text-sm hover:bg-gray-100"
                >
                  View All {transactions.length} Transactions
                  <ArrowUpRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            )}
          </>
        ) : (
          <div className="p-8 text-center text-gray-500">
            <div className="text-3xl mb-2">💸</div>
            <p className="text-sm">No transactions yet</p>
            <p className="text-xs text-gray-400 mt-1">
              Start earning from {title.toLowerCase()} to see activity here
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default WalletSourceCard;
