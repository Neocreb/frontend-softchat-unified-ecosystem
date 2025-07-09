import React from "react";
import { useMarketplaceChat } from "@/hooks/use-chat-integration";
import { MarketplaceChatButton } from "@/components/chat/ChatActionButtons";
import { Button } from "@/components/ui/button";
import { MessageCircle, ShoppingCart, Heart } from "lucide-react";

interface ProductChatIntegrationProps {
  productId: string;
  productName: string;
  productPrice: number;
  sellerId: string;
  sellerName: string;
  isOwner?: boolean;
}

export const ProductChatIntegration: React.FC<ProductChatIntegrationProps> = ({
  productId,
  productName,
  productPrice,
  sellerId,
  sellerName,
  isOwner = false,
}) => {
  const { contactSeller, isCreatingChat } = useMarketplaceChat();

  const handleContactSeller = () => {
    contactSeller(sellerId, productId, productName, productPrice);
  };

  const handleBuyNowChat = () => {
    // This would integrate with buy now flow and create chat
    contactSeller(sellerId, productId, productName, productPrice);
  };

  const handleMakeOffer = () => {
    // This would open offer modal and create chat
    contactSeller(sellerId, productId, productName, productPrice);
  };

  if (isOwner) {
    return (
      <div className="space-y-2">
        <div className="text-sm text-muted-foreground">
          Customers can message you about this product
        </div>
        <Button variant="outline" disabled className="w-full">
          <MessageCircle className="w-4 h-4 mr-2" />
          Your Product
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {/* Primary action buttons */}
      <div className="space-y-2">
        <MarketplaceChatButton
          productName={productName}
          price={productPrice}
          action="inquire"
          loading={isCreatingChat}
          onClick={handleContactSeller}
          className="w-full"
        >
          <MessageCircle className="w-4 h-4" />
          Ask {sellerName}
        </MarketplaceChatButton>

        <div className="grid grid-cols-2 gap-2">
          <MarketplaceChatButton
            productName={productName}
            price={productPrice}
            action="buy_now"
            variant="default"
            loading={isCreatingChat}
            onClick={handleBuyNowChat}
          >
            <ShoppingCart className="w-4 h-4" />
            Buy Now
          </MarketplaceChatButton>

          <MarketplaceChatButton
            productName={productName}
            price={productPrice}
            action="make_offer"
            variant="outline"
            loading={isCreatingChat}
            onClick={handleMakeOffer}
          >
            <Heart className="w-4 h-4" />
            Make Offer
          </MarketplaceChatButton>
        </div>
      </div>

      {/* Chat info */}
      <div className="text-xs text-muted-foreground text-center">
        💬 Start a conversation about this product
      </div>
    </div>
  );
};

// Quick contact component for product lists
interface QuickContactProps {
  productId: string;
  productName: string;
  productPrice: number;
  sellerId: string;
  compact?: boolean;
}

export const QuickContact: React.FC<QuickContactProps> = ({
  productId,
  productName,
  productPrice,
  sellerId,
  compact = false,
}) => {
  const { contactSeller, isCreatingChat } = useMarketplaceChat();

  const handleContact = () => {
    contactSeller(sellerId, productId, productName, productPrice);
  };

  if (compact) {
    return (
      <Button
        variant="ghost"
        size="sm"
        onClick={handleContact}
        disabled={isCreatingChat}
        className="h-8 w-8 p-0"
      >
        <MessageCircle className="w-4 h-4" />
      </Button>
    );
  }

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={handleContact}
      disabled={isCreatingChat}
      className="flex items-center gap-1"
    >
      <MessageCircle className="w-3 h-3" />
      Contact
    </Button>
  );
};
