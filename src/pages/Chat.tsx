import React from "react";
import { Helmet } from "react-helmet-async";
import { UnifiedChatInterface } from "@/components/chat/UnifiedChatInterface";

const Chat = () => {
  return (
    <>
      <Helmet>
        <title>Messages | Softchat</title>
        <meta
          name="description"
          content="Unified messaging for social chats, freelance projects, marketplace communications, crypto P2P trading, and AI assistance"
        />
      </Helmet>
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-6">
          <div className="mb-6">
            <h1 className="text-2xl font-bold tracking-tight">Messages</h1>
            <p className="text-muted-foreground">
              Your unified inbox for social chats, freelance projects,
              marketplace communications, crypto P2P trading, and AI assistance.
            </p>
          </div>
          <UnifiedChatInterface />
        </div>
      </div>
    </>
  );
};

export default Chat;
