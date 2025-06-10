import { Transaction } from "@/types/wallet";
import { Badge } from "@/components/ui/badge";
import { formatDistanceToNow } from "date-fns";

interface TransactionItemProps {
  transaction: Transaction;
}

const TransactionItem = ({ transaction }: TransactionItemProps) => {
  const isPositive = transaction.amount > 0;
  const amount = Math.abs(transaction.amount);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-700 border-green-200";
      case "pending":
        return "bg-yellow-100 text-yellow-700 border-yellow-200";
      case "failed":
        return "bg-red-100 text-red-700 border-red-200";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "earned":
        return "text-green-600";
      case "deposit":
        return "text-blue-600";
      case "withdrawal":
        return "text-red-600";
      case "transfer":
        return "text-purple-600";
      default:
        return "text-gray-600";
    }
  };

  return (
    <div className="flex items-center justify-between p-4 border-b border-gray-100 hover:bg-gray-50 transition-colors">
      <div className="flex items-center space-x-4">
        <div className="flex-shrink-0">
          <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center text-2xl">
            {transaction.sourceIcon}
          </div>
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-gray-900 truncate">
            {transaction.description}
          </p>
          <div className="flex items-center space-x-2 mt-1">
            <Badge
              variant="outline"
              className={`text-xs ${getStatusColor(transaction.status)}`}
            >
              {transaction.status}
            </Badge>
            <span className="text-xs text-gray-500">
              {formatDistanceToNow(new Date(transaction.timestamp), {
                addSuffix: true,
              })}
            </span>
          </div>
        </div>
      </div>
      <div className="flex flex-col items-end">
        <span
          className={`text-lg font-semibold ${getTypeColor(transaction.type)}`}
        >
          {isPositive ? "+" : "-"}${amount.toFixed(2)}
        </span>
        <span className="text-xs text-gray-500 capitalize">
          {transaction.type}
        </span>
      </div>
    </div>
  );
};

export default TransactionItem;
