import { useNavigate } from "react-router-dom";
import { useCallback } from "react";
import {
  startFreelanceChat,
  startMarketplaceChat,
  startP2PChat,
  startSocialChat,
  getOrCreateChat,
} from "./startChat";
import { ChatType, ChatContextData } from "@/types/chat";

// Hook for chat integration across the app
export const useChatIntegration = () => {
  const navigate = useNavigate();

  const openFreelanceChat = useCallback(
    async (
      jobId: string,
      jobTitle: string,
      clientId: string,
      freelancerId: string,
      jobBudget?: number,
    ) => {
      try {
        const thread = await startFreelanceChat(
          jobId,
          clientId,
          freelancerId,
          jobTitle,
          jobBudget,
        );
        navigate(`/messages/${thread.id}`);
        return thread;
      } catch (error) {
        console.error("Failed to start freelance chat:", error);
        return null;
      }
    },
    [navigate],
  );

  const openMarketplaceChat = useCallback(
    async (
      productId: string,
      productName: string,
      productPrice: number,
      sellerId: string,
      buyerId: string,
      productImage?: string,
    ) => {
      try {
        const thread = await startMarketplaceChat(
          productId,
          buyerId,
          sellerId,
          productName,
          productPrice,
          productImage,
        );
        navigate(`/messages/${thread.id}`);
        return thread;
      } catch (error) {
        console.error("Failed to start marketplace chat:", error);
        return null;
      }
    },
    [navigate],
  );

  const openP2PChat = useCallback(
    async (
      tradeId: string,
      tradeAmount: number,
      cryptoType: string,
      buyerId: string,
      sellerId: string,
    ) => {
      try {
        const thread = await startP2PChat(
          tradeId,
          buyerId,
          sellerId,
          tradeAmount,
          cryptoType,
        );
        navigate(`/messages/${thread.id}`);
        return thread;
      } catch (error) {
        console.error("Failed to start P2P chat:", error);
        return null;
      }
    },
    [navigate],
  );

  const openSocialChat = useCallback(
    async (
      otherUserId: string,
      currentUserId: string,
      relationshipType?: "friend" | "follower" | "family",
    ) => {
      try {
        const thread = await startSocialChat(
          currentUserId,
          otherUserId,
          relationshipType,
        );
        navigate(`/messages/${thread.id}`);
        return thread;
      } catch (error) {
        console.error("Failed to start social chat:", error);
        return null;
      }
    },
    [navigate],
  );

  const openExistingChat = useCallback(
    (threadId: string) => {
      navigate(`/messages/${threadId}`);
    },
    [navigate],
  );

  const openChatOrCreate = useCallback(
    async (
      type: ChatType,
      referenceId: string | null,
      participants: string[],
      contextData?: ChatContextData,
    ) => {
      try {
        const thread = await getOrCreateChat(
          type,
          referenceId,
          participants,
          contextData,
        );
        navigate(`/messages/${thread.id}`);
        return thread;
      } catch (error) {
        console.error("Failed to open/create chat:", error);
        return null;
      }
    },
    [navigate],
  );

  return {
    openFreelanceChat,
    openMarketplaceChat,
    openP2PChat,
    openSocialChat,
    openExistingChat,
    openChatOrCreate,
    goToInbox: () => navigate("/messages"),
  };
};

// Utility functions for quick chat button components
export const createChatButton = (
  type: "freelance" | "marketplace" | "p2p" | "social",
  data: any,
  className?: string,
) => {
  const baseClass =
    "inline-flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors";
  const finalClass = className
    ? `${baseClass} ${className}`
    : `${baseClass} bg-primary text-primary-foreground hover:bg-primary/90`;

  const buttonProps = {
    className: finalClass,
    "data-chat-type": type,
    "data-chat-data": JSON.stringify(data),
  };

  return buttonProps;
};

// Quick integration helpers for existing components
export const freelanceChatButton = (
  jobId: string,
  jobTitle: string,
  clientId: string,
  freelancerId: string,
) => createChatButton("freelance", { jobId, jobTitle, clientId, freelancerId });

export const marketplaceChatButton = (
  productId: string,
  productData: any,
  buyerId: string,
) => createChatButton("marketplace", { productId, ...productData, buyerId });

export const p2pChatButton = (
  tradeId: string,
  tradeData: any,
  buyerId: string,
) => createChatButton("p2p", { tradeId, ...tradeData, buyerId });

export const socialChatButton = (userId: string, relationshipType?: string) =>
  createChatButton("social", { userId, relationshipType });

// Context-aware chat suggestions
export const getChatSuggestions = (currentPage: string, pageData?: any) => {
  const suggestions = [];

  switch (currentPage) {
    case "freelance-job":
      if (pageData?.job) {
        suggestions.push({
          type: "freelance" as ChatType,
          label: "Contact about this job",
          data: pageData.job,
        });
      }
      break;

    case "marketplace-product":
      if (pageData?.product) {
        suggestions.push({
          type: "marketplace" as ChatType,
          label: "Ask seller a question",
          data: pageData.product,
        });
      }
      break;

    case "crypto-trade":
      if (pageData?.trade) {
        suggestions.push({
          type: "p2p" as ChatType,
          label: "Chat with trader",
          data: pageData.trade,
        });
      }
      break;

    case "profile":
      if (pageData?.userId) {
        suggestions.push({
          type: "social" as ChatType,
          label: "Send message",
          data: { userId: pageData.userId },
        });
      }
      break;
  }

  return suggestions;
};

// Auto-chat creation for workflows
export const autoCreateWorkflowChat = async (
  workflow:
    | "job-application"
    | "product-inquiry"
    | "trade-initiation"
    | "friend-request",
  data: any,
) => {
  switch (workflow) {
    case "job-application":
      return startFreelanceChat(
        data.jobId,
        data.clientId,
        data.freelancerId,
        data.jobTitle,
        data.jobBudget,
      );

    case "product-inquiry":
      return startMarketplaceChat(
        data.productId,
        data.buyerId,
        data.sellerId,
        data.productName,
        data.productPrice,
        data.productImage,
      );

    case "trade-initiation":
      return startP2PChat(
        data.tradeId,
        data.buyerId,
        data.sellerId,
        data.amount,
        data.cryptoType,
      );

    case "friend-request":
      return startSocialChat(data.senderId, data.receiverId, "friend");

    default:
      throw new Error(`Unknown workflow: ${workflow}`);
  }
};
