import React, { useState } from "react";
import { Helmet } from "react-helmet-async";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  MessageCircle,
  Users,
  Briefcase,
  ShoppingBag,
  Coins,
  Bot,
} from "lucide-react";

const Chat = () => {
  const [error, setError] = useState<string | null>(null);

  try {
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
                marketplace communications, crypto P2P trading, and AI
                assistance.
              </p>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Chat Types</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                  <Button
                    variant="outline"
                    className="flex flex-col items-center gap-2 h-20"
                  >
                    <Users className="w-6 h-6" />
                    <span className="text-sm">Social</span>
                  </Button>
                  <Button
                    variant="outline"
                    className="flex flex-col items-center gap-2 h-20"
                  >
                    <Briefcase className="w-6 h-6" />
                    <span className="text-sm">Freelance</span>
                  </Button>
                  <Button
                    variant="outline"
                    className="flex flex-col items-center gap-2 h-20"
                  >
                    <ShoppingBag className="w-6 h-6" />
                    <span className="text-sm">Marketplace</span>
                  </Button>
                  <Button
                    variant="outline"
                    className="flex flex-col items-center gap-2 h-20"
                  >
                    <Coins className="w-6 h-6" />
                    <span className="text-sm">Crypto P2P</span>
                  </Button>
                  <Button
                    variant="outline"
                    className="flex flex-col items-center gap-2 h-20"
                  >
                    <Bot className="w-6 h-6" />
                    <span className="text-sm">Edith AI</span>
                  </Button>
                </div>

                <div className="mt-8 text-center">
                  <p className="text-muted-foreground">
                    Unified chat interface is being loaded...
                  </p>
                  <Button
                    className="mt-4"
                    onClick={() => {
                      // This will help us identify if the issue is with the import
                      import("@/components/chat/UnifiedChatInterface")
                        .then((module) => {
                          console.log(
                            "UnifiedChatInterface loaded successfully",
                            module,
                          );
                        })
                        .catch((err) => {
                          console.error(
                            "Failed to load UnifiedChatInterface:",
                            err,
                          );
                          setError(err.message);
                        });
                    }}
                  >
                    Test Load Chat Interface
                  </Button>

                  {error && (
                    <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                      <p className="text-red-700 text-sm">Error: {error}</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </>
    );
  } catch (err) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card>
          <CardHeader>
            <CardTitle>Chat Page Error</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-red-700">
              Error loading chat page:{" "}
              {err instanceof Error ? err.message : "Unknown error"}
            </p>
            <Button className="mt-4" onClick={() => window.location.reload()}>
              Refresh Page
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }
};

export default Chat;
