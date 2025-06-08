
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { CircleCheck } from "lucide-react";
import { P2POffer } from "@/types/user";

interface P2POfferCardProps {
  offer: P2POffer;
  onAction: (offer: P2POffer) => void;
}

const P2POfferCard = ({ offer, onAction }: P2POfferCardProps) => {
  const formatPrice = (price: number) => 
    new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: offer.fiat_currency,
      minimumFractionDigits: 2
    }).format(price);

  const formatCrypto = (amount: number) => 
    new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 6,
      maximumFractionDigits: 6
    }).format(amount);

  return (
    <Card className="p-4 hover:shadow-md transition-shadow duration-200">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Price and Limit Section */}
        <div className="space-y-2">
          <div className="text-lg font-semibold">
            {formatPrice(offer.fiat_price)}
            <span className="text-sm text-muted-foreground ml-1">
              per {offer.crypto_symbol}
            </span>
          </div>
          <div className="text-sm text-muted-foreground">
            Limit: {formatPrice(offer.min_order)} - {formatPrice(offer.max_order)}
          </div>
          <div className="text-sm">
            <span className="font-medium">
              {formatCrypto(offer.crypto_amount)} {offer.crypto_symbol}
            </span>
            <span className="text-muted-foreground ml-1">available</span>
          </div>
        </div>

        {/* Seller and Payment Methods Section */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Avatar className="h-8 w-8">
              <AvatarImage src={offer.seller.avatar} alt={offer.seller.name} />
              <AvatarFallback>{offer.seller.name.substring(0, 2)}</AvatarFallback>
            </Avatar>
            <div className="flex items-center gap-1">
              <span className="font-medium">{offer.seller.name}</span>
              {offer.seller.is_verified && (
                <CircleCheck className="h-4 w-4 text-green-500" />
              )}
            </div>
          </div>
          <div className="flex flex-wrap gap-1">
            {offer.payment_methods.map((method, index) => (
              <Badge key={index} variant="outline" className="text-xs">
                {method}
              </Badge>
            ))}
          </div>
          <div className="text-sm text-muted-foreground">
            {offer.seller.total_trades} trades • {offer.seller.rating.toFixed(1)} rating
          </div>
        </div>

        {/* Action Button Section */}
        <div className="flex items-center justify-end">
          <Button
            onClick={() => onAction(offer)}
            size="lg"
            className={offer.type === 'sell' ? 'bg-green-500 hover:bg-green-600' : 'bg-blue-500 hover:bg-blue-600'}
          >
            {offer.type === 'sell' ? 'Buy' : 'Sell'} {offer.crypto_symbol}
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default P2POfferCard;
