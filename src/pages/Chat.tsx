import React from "react";
import { Helmet } from "react-helmet-async";
import { UnifiedChatInterface } from "@/components/chat/UnifiedChatInterface";
import { useIsMobile } from "@/hooks/use-mobile";
import { Button } from "@/components/ui/button";
import { Phone, Video } from "lucide-react";
import { useIncomingCalls } from "@/hooks/useIncomingCalls";

const Chat = () => {
  const isMobile = useIsMobile();
  const { simulateIncomingCall } = useIncomingCalls();

  const handleTestVoiceCall = () => {
    simulateIncomingCall({
      callerId: 'test-caller',
      callerName: 'Sarah Johnson',
      callerAvatar: 'https://images.unsplash.com/photo-1494790108755-2616b2bab1d3?w=100',
      type: 'voice',
      isGroup: false,
    });
  };

  const handleTestVideoCall = () => {
    simulateIncomingCall({
      callerId: 'test-caller-2',
      callerName: 'Mike Chen',
      callerAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100',
      type: 'video',
      isGroup: false,
    });
  };

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

              {/* Status indicator and demo call buttons - responsive */}
              <div className="flex items-center gap-2 ml-3">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span
                  className={`text-muted-foreground ${isMobile ? "text-xs" : "text-sm"}`}
                >
                  {isMobile ? "" : "Online"}
                </span>

                {/* Demo call buttons for testing */}
                {!isMobile && (
                  <div className="flex gap-1 ml-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleTestVoiceCall}
                      title="Test incoming voice call"
                    >
                      <Phone className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleTestVideoCall}
                      title="Test incoming video call"
                    >
                      <Video className="w-4 h-4" />
                    </Button>
                  </div>
                )}
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
