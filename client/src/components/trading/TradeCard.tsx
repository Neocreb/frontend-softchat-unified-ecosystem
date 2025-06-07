
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { formatDistanceToNow } from 'date-fns';
import { Trade } from '@/services/tradingService';

interface TradeCardProps {
  trade: Trade;
  onAction: (trade: Trade, action: string) => void;
  currentUserId: string;
}

const TradeCard: React.FC<TradeCardProps> = ({ trade, onAction, currentUserId }) => {
  const isBuyer = trade.buyer_id === currentUserId;
  const role = isBuyer ? 'Buyer' : 'Seller';
  const otherParty = isBuyer ? 'Seller' : 'Buyer';

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-500';
      case 'in_progress': return 'bg-blue-500';
      case 'completed': return 'bg-green-500';
      case 'cancelled': return 'bg-gray-500';
      case 'disputed': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getAvailableActions = () => {
    const actions = [];
    
    if (trade.status === 'pending') {
      if (isBuyer) {
        actions.push('confirm_payment');
      } else {
        actions.push('accept_trade', 'decline_trade');
      }
    }
    
    if (trade.status === 'in_progress') {
      actions.push('mark_complete');
      if (!trade.dispute_id) {
        actions.push('raise_dispute');
      }
    }
    
    if (trade.status === 'completed' && !trade.dispute_id) {
      actions.push('rate_trader');
    }
    
    return actions;
  };

  const getActionLabel = (action: string) => {
    switch (action) {
      case 'confirm_payment': return 'Confirm Payment';
      case 'accept_trade': return 'Accept Trade';
      case 'decline_trade': return 'Decline Trade';
      case 'mark_complete': return 'Mark Complete';
      case 'raise_dispute': return 'Raise Dispute';
      case 'rate_trader': return 'Rate Trader';
      default: return action;
    }
  };

  return (
    <Card className="w-full">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">
            Trade #{trade.id.slice(0, 8)}
          </CardTitle>
          <Badge className={`${getStatusColor(trade.status)} text-white`}>
            {trade.status.replace('_', ' ').toUpperCase()}
          </Badge>
        </div>
        <div className="text-sm text-muted-foreground">
          {formatDistanceToNow(new Date(trade.created_at), { addSuffix: true })}
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="font-medium">Amount</p>
            <p className="text-muted-foreground">{trade.amount} BTC</p>
          </div>
          <div>
            <p className="font-medium">Price per Unit</p>
            <p className="text-muted-foreground">${trade.price_per_unit.toLocaleString()}</p>
          </div>
          <div>
            <p className="font-medium">Total Amount</p>
            <p className="text-muted-foreground">${trade.total_amount.toLocaleString()}</p>
          </div>
          <div>
            <p className="font-medium">Payment Method</p>
            <p className="text-muted-foreground">{trade.payment_method}</p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <Avatar className="h-8 w-8">
            <AvatarImage src="/placeholder.svg" />
            <AvatarFallback>{otherParty[0]}</AvatarFallback>
          </Avatar>
          <div>
            <p className="text-sm font-medium">Trading with</p>
            <p className="text-xs text-muted-foreground">{otherParty}</p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <Badge variant="outline" className="text-xs">
            Your Role: {role}
          </Badge>
          {trade.escrow_id && (
            <Badge variant="outline" className="text-xs bg-green-50">
              Escrow Protected
            </Badge>
          )}
        </div>

        <div className="flex flex-wrap gap-2">
          {getAvailableActions().map((action) => (
            <Button
              key={action}
              size="sm"
              variant={action === 'raise_dispute' ? 'destructive' : 'default'}
              onClick={() => onAction(trade, action)}
            >
              {getActionLabel(action)}
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default TradeCard;
