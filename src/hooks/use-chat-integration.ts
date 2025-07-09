import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import {
  chatIntegrationService,
  type ChatIntegrationOptions,
} from "@/services/chatIntegrationService";
import { UnifiedChatType } from "@/types/unified-chat";

interface UseChatIntegrationReturn {
  // Core chat actions
  startFreelanceChat: (
    jobId: string,
    freelancerId: string,
    jobTitle: string,
    jobBudget?: number,
  ) => Promise<void>;
  startMarketplaceChat: (
    productId: string,
    sellerId: string,
    productName: string,
    productPrice: number,
  ) => Promise<void>;
  startCryptoP2PChat: (
    tradeId: string,
    counterpartyId: string,
    tradeDetails: any,
  ) => Promise<void>;
  startSocialChat: (userId: string, context?: any) => Promise<void>;

  // Quick actions
  contactSeller: (
    sellerId: string,
    productId: string,
    productName: string,
    productPrice: number,
  ) => Promise<void>;
  contactFreelancer: (
    freelancerId: string,
    jobId: string,
    jobTitle: string,
  ) => Promise<void>;
  replyToPost: (userId: string, postId: string) => Promise<void>;
  initiateTrade: (counterpartyId: string, tradeDetails: any) => Promise<void>;

  // Navigation
  openChatTab: (type: UnifiedChatType) => void;

  // State
  isCreatingChat: boolean;
  error: string | null;
}

export const useChatIntegration = (): UseChatIntegrationReturn => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isCreatingChat, setIsCreatingChat] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChatCreation = async (
    chatCreationFn: () => Promise<string>,
    chatType: UnifiedChatType,
    successMessage: string,
  ) => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please log in to start a chat",
        variant: "destructive",
      });
      return;
    }

    setIsCreatingChat(true);
    setError(null);

    try {
      const threadId = await chatCreationFn();

      toast({
        title: "Chat started!",
        description: successMessage,
      });

      // Navigate to the chat
      chatIntegrationService.navigateToChat(threadId, chatType);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to start chat";
      setError(errorMessage);

      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsCreatingChat(false);
    }
  };

  const startFreelanceChat = async (
    jobId: string,
    freelancerId: string,
    jobTitle: string,
    jobBudget?: number,
  ) => {
    await handleChatCreation(
      () =>
        chatIntegrationService.startFreelanceChat({
          jobId,
          jobTitle,
          jobBudget,
          clientId: user!.id,
          freelancerId,
        }),
      "freelance",
      `Started discussion about "${jobTitle}"`,
    );
  };

  const startMarketplaceChat = async (
    productId: string,
    sellerId: string,
    productName: string,
    productPrice: number,
  ) => {
    await handleChatCreation(
      () =>
        chatIntegrationService.startMarketplaceChat({
          productId,
          productName,
          productPrice,
          sellerId,
          buyerId: user!.id,
        }),
      "marketplace",
      `Started inquiry about "${productName}"`,
    );
  };

  const startCryptoP2PChat = async (
    tradeId: string,
    counterpartyId: string,
    tradeDetails: any,
  ) => {
    await handleChatCreation(
      () =>
        chatIntegrationService.startCryptoP2PChat({
          tradeId,
          counterpartyId,
          traderId: user!.id,
          ...tradeDetails,
        }),
      "p2p",
      "Started trade discussion",
    );
  };

  const startSocialChat = async (userId: string, context?: any) => {
    await handleChatCreation(
      () => chatIntegrationService.startSocialChat(userId, context),
      "social",
      "Started conversation",
    );
  };

  // Quick action convenience methods
  const contactSeller = async (
    sellerId: string,
    productId: string,
    productName: string,
    productPrice: number,
  ) => {
    await startMarketplaceChat(productId, sellerId, productName, productPrice);
  };

  const contactFreelancer = async (
    freelancerId: string,
    jobId: string,
    jobTitle: string,
  ) => {
    await startFreelanceChat(jobId, freelancerId, jobTitle);
  };

  const replyToPost = async (userId: string, postId: string) => {
    await startSocialChat(userId, {
      postId,
      interactionType: "comment_reply",
    });
  };

  const initiateTrade = async (counterpartyId: string, tradeDetails: any) => {
    const tradeId = `trade_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    await startCryptoP2PChat(tradeId, counterpartyId, tradeDetails);
  };

  const openChatTab = (type: UnifiedChatType) => {
    window.location.href = `/chat?type=${type}`;
  };

  return {
    // Core chat actions
    startFreelanceChat,
    startMarketplaceChat,
    startCryptoP2PChat,
    startSocialChat,

    // Quick actions
    contactSeller,
    contactFreelancer,
    replyToPost,
    initiateTrade,

    // Navigation
    openChatTab,

    // State
    isCreatingChat,
    error,
  };
};

// Convenience hooks for specific use cases
export const useFreelanceChat = () => {
  const { startFreelanceChat, contactFreelancer, isCreatingChat } =
    useChatIntegration();
  return { startFreelanceChat, contactFreelancer, isCreatingChat };
};

export const useMarketplaceChat = () => {
  const { startMarketplaceChat, contactSeller, isCreatingChat } =
    useChatIntegration();
  return { startMarketplaceChat, contactSeller, isCreatingChat };
};

export const useCryptoChat = () => {
  const { startCryptoP2PChat, initiateTrade, isCreatingChat } =
    useChatIntegration();
  return { startCryptoP2PChat, initiateTrade, isCreatingChat };
};

export const useSocialChat = () => {
  const { startSocialChat, replyToPost, isCreatingChat } = useChatIntegration();
  return { startSocialChat, replyToPost, isCreatingChat };
};
