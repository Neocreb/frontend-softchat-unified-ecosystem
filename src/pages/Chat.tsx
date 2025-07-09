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
      <div className="h-screen bg-background flex flex-col">
        {/* Header section - more compact on desktop */}
        <div
          className={`border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 ${isMobile ? "px-4 py-4" : "px-6 py-3"}`}
        >
          <div className="max-w-none">
            <div className="flex items-center justify-between">
              <div>
                <h1
                  className={`font-bold tracking-tight ${isMobile ? "text-2xl" : "text-xl"}`}
                >
                  Messages
                </h1>
                <p
                  className={`text-muted-foreground ${isMobile ? "text-sm mt-1" : "text-xs"}`}
                >
                  Unified inbox for all your conversations
                </p>
              </div>
              {/* Desktop status indicator */}
              {!isMobile && (
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-xs text-muted-foreground">Online</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Chat interface - full height */}
        <div className="flex-1 overflow-hidden">
          <UnifiedChatInterface className="h-full" />
        </div>
      </div>
    </>
  );
};

export default Chat;
