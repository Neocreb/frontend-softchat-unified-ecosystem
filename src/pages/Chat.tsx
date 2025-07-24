import React from "react";
import { Helmet } from "react-helmet-async";
import { UnifiedChatInterface } from "@/components/chat/UnifiedChatInterface";
import { useIsMobile } from "@/hooks/use-mobile";

const Chat = () => {
  const isMobile = useIsMobile();

  return (
    <>
      <Helmet>
        <title>Messages | Softchat</title>
        <meta
          name="description"
          content="Unified messaging for social chats, freelance projects, marketplace communications, crypto P2P trading, and AI assistance"
        />
      </Helmet>
      <div className="h-screen bg-background flex flex-col overflow-hidden">
        {/* Header section - responsive design */}
        <div
          className={`
            border-b bg-background/95 backdrop-blur
            supports-[backdrop-filter]:bg-background/60
            sticky top-0 z-10
            ${isMobile ? "px-3 py-3" : "px-6 py-4"}
          `}
        >
          <div className="max-w-none">
            <div className="flex items-center justify-between">
              <div className="min-w-0 flex-1">
                <h1
                  className={`
                    font-bold tracking-tight truncate
                    ${isMobile ? "text-xl" : "text-2xl"}
                  `}
                >
                  Messages
                </h1>
                <p
                  className={`
                    text-muted-foreground truncate
                    ${isMobile ? "text-xs mt-0.5" : "text-sm mt-1"}
                  `}
                >
                  {isMobile
                    ? "Unified inbox"
                    : "Unified inbox for all your conversations"}
                </p>
              </div>

              {/* Status indicator - responsive */}
              <div className="flex items-center gap-2 ml-3">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span
                  className={`text-muted-foreground ${isMobile ? "text-xs" : "text-sm"}`}
                >
                  {isMobile ? "" : "Online"}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Chat interface - responsive full height */}
        <div className="flex-1 overflow-hidden min-h-0">
          <UnifiedChatInterface className="h-full" />
        </div>
      </div>
    </>
  );
};

export default Chat;
