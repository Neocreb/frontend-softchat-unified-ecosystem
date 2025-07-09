import React from "react";
import { useCryptoChat } from "@/hooks/use-chat-integration";
import { CryptoChatButton } from "@/components/chat/ChatActionButtons";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  MessageCircle,
  Coins,
  TrendingUp,
  TrendingDown,
  Shield,
} from "lucide-react";

interface CryptoP2PChatIntegrationProps {
  offerId: string;
  crypto: string;
  amount: number;
  price: number;
  currency: string;
  traderId: string;
  traderName: string;
  traderRating: number;
  totalTrades: number;
  tradeType: "buy" | "sell";
  paymentMethods: string[];
  isOwner?: boolean;
}

export const CryptoP2PChatIntegration: React.FC<
  CryptoP2PChatIntegrationProps
> = ({
  offerId,
  crypto,
  amount,
  price,
  currency,
  traderId,
  traderName,
  traderRating,
  totalTrades,
  tradeType,
  paymentMethods,
  isOwner = false,
}) => {
  const { initiateTrade, isCreatingChat } = useCryptoChat();

  const handleInitiateTrade = () => {
    const tradeDetails = {
      tradeAmount: amount,
      cryptoType: crypto,
      tradeType: tradeType === "buy" ? "sell" : "buy", // Opposite of offer type
      fiatCurrency: currency,
      fiatAmount: price * amount,
    };

    initiateTrade(traderId, tradeDetails);
  };

  const handleQuickTrade = (customAmount?: number) => {
    const finalAmount = customAmount || amount;
    const tradeDetails = {
      tradeAmount: finalAmount,
      cryptoType: crypto,
      tradeType: tradeType === "buy" ? "sell" : "buy",
      fiatCurrency: currency,
      fiatAmount: price * finalAmount,
    };

    initiateTrade(traderId, tradeDetails);
  };

  const getTradeIcon = () => {
    return tradeType === "buy" ? (
      <TrendingUp className="w-4 h-4 text-green-600" />
    ) : (
      <TrendingDown className="w-4 h-4 text-red-600" />
    );
  };

  const getTradeVerb = () => {
    return tradeType === "buy" ? "Sell to" : "Buy from";
  };

  if (isOwner) {
    return (
      <div className="space-y-2">
        <div className="text-sm text-muted-foreground">
          Traders can message you about this offer
        </div>
        <Button variant="outline" disabled className="w-full">
          <Coins className="w-4 h-4 mr-2" />
          Your Offer
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {/* Trader info */}
      <div className="flex items-center justify-between text-sm">
        <div className="flex items-center gap-2">
          <span className="font-medium">{traderName}</span>
          <Badge variant="outline" className="text-xs">
            ⭐ {traderRating.toFixed(1)}
          </Badge>
        </div>
        <div className="text-muted-foreground">{totalTrades} trades</div>
      </div>

      {/* Primary trade button */}
      <CryptoChatButton
        tradeType={tradeType === "buy" ? "sell" : "buy"}
        crypto={crypto}
        amount={amount}
        loading={isCreatingChat}
        onClick={handleInitiateTrade}
        className="w-full"
      >
        {getTradeIcon()}
        {getTradeVerb()} {traderName}
      </CryptoChatButton>

      {/* Quick trade amounts */}
      <div className="grid grid-cols-3 gap-2">
        {[0.25, 0.5, 0.75].map((multiplier) => {
          const quickAmount = amount * multiplier;
          return (
            <Button
              key={multiplier}
              variant="outline"
              size="sm"
              onClick={() => handleQuickTrade(quickAmount)}
              disabled={isCreatingChat}
              className="text-xs"
            >
              {quickAmount.toFixed(4)}
            </Button>
          );
        })}
      </div>

      {/* Payment methods */}
      <div className="space-y-1">
        <div className="text-xs text-muted-foreground">Payment methods:</div>
        <div className="flex flex-wrap gap-1">
          {paymentMethods.map((method) => (
            <Badge key={method} variant="secondary" className="text-xs">
              {method}
            </Badge>
          ))}
        </div>
      </div>

      {/* Trade info */}
      <div className="text-xs text-muted-foreground space-y-1">
        <div className="flex items-center gap-1">
          <Shield className="w-3 h-3" />
          Escrow protection included
        </div>
        <div>💬 Discuss terms and payment details</div>
        <div>
          Total: {(price * amount).toLocaleString()} {currency}
        </div>
      </div>
    </div>
  );
};

// Quick trade component for offer lists
interface QuickTradeProps {
  offerId: string;
  crypto: string;
  amount: number;
  traderId: string;
  tradeType: "buy" | "sell";
  compact?: boolean;
}

export const QuickTrade: React.FC<QuickTradeProps> = ({
  offerId,
  crypto,
  amount,
  traderId,
  tradeType,
  compact = false,
}) => {
  const { initiateTrade, isCreatingChat } = useCryptoChat();

  const handleQuickTrade = () => {
    const tradeDetails = {
      tradeAmount: amount,
      cryptoType: crypto,
      tradeType: tradeType === "buy" ? "sell" : "buy",
    };

    initiateTrade(traderId, tradeDetails);
  };

  if (compact) {
    return (
      <Button
        variant="default"
        size="sm"
        onClick={handleQuickTrade}
        disabled={isCreatingChat}
        className="h-8"
      >
        <Coins className="w-3 h-3 mr-1" />
        Trade
      </Button>
    );
  }

  return (
    <Button
      variant="default"
      onClick={handleQuickTrade}
      disabled={isCreatingChat}
      className="flex items-center gap-2"
    >
      <Coins className="w-4 h-4" />
      {tradeType === "buy" ? "Sell" : "Buy"} {crypto}
    </Button>
  );
};

// Trading status component for active trades
interface TradingStatusProps {
  tradeId: string;
  status: "initiated" | "payment_pending" | "escrow" | "completed" | "disputed";
  counterparty: string;
  amount: number;
  crypto: string;
}

export const TradingStatus: React.FC<TradingStatusProps> = ({
  tradeId,
  status,
  counterparty,
  amount,
  crypto,
}) => {
  const getStatusColor = () => {
    switch (status) {
      case "initiated":
        return "text-blue-600 bg-blue-50";
      case "payment_pending":
        return "text-yellow-600 bg-yellow-50";
      case "escrow":
        return "text-purple-600 bg-purple-50";
      case "completed":
        return "text-green-600 bg-green-50";
      case "disputed":
        return "text-red-600 bg-red-50";
      default:
        return "text-gray-600 bg-gray-50";
    }
  };

  const getStatusText = () => {
    switch (status) {
      case "initiated":
        return "Trade Started";
      case "payment_pending":
        return "Awaiting Payment";
      case "escrow":
        return "In Escrow";
      case "completed":
        return "Completed";
      case "disputed":
        return "Disputed";
      default:
        return status;
    }
  };

  const handleOpenChat = () => {
    window.location.href = `/chat?type=p2p&thread=${tradeId}`;
  };

  return (
    <div className="flex items-center justify-between p-3 border rounded-lg">
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <Badge className={getStatusColor()}>{getStatusText()}</Badge>
          <span className="text-sm font-medium">
            {amount} {crypto}
          </span>
        </div>
        <div className="text-sm text-muted-foreground">with {counterparty}</div>
      </div>

      <Button variant="outline" size="sm" onClick={handleOpenChat}>
        <MessageCircle className="w-3 h-3 mr-1" />
        Chat
      </Button>
    </div>
  );
};
