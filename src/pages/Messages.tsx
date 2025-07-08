import { Helmet } from "react-helmet-async";
import { Search, MessageCircle, Phone, Video } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const Messages = () => {
  const mockConversations = [
    {
      id: "edith-ai",
      user: {
        name: "Edith - AI Assistant",
        avatar: "/placeholder.svg",
        isAI: true,
      },
      lastMessage:
        "Hi! I'm here to help you with anything on SoftChat. Ask me about trading, content creation, earning tips, or anything else!",
      time: "now",
      unread: 0,
      online: true,
    },
    {
      id: "1",
      user: { name: "Alice Johnson", avatar: "/placeholder.svg" },
      lastMessage: "Hey! How are you doing?",
      time: "2m",
      unread: 2,
      online: true,
    },
    {
      id: "2",
      user: { name: "Bob Smith", avatar: "/placeholder.svg" },
      lastMessage: "Thanks for the crypto tips!",
      time: "1h",
      unread: 0,
      online: false,
    },
    {
      id: "3",
      user: { name: "Charlie Wilson", avatar: "/placeholder.svg" },
      lastMessage: "Let's catch up soon",
      time: "3h",
      unread: 1,
      online: true,
    },
  ];

  return (
    <>
      <Helmet>
        <title>Messages | Softchat</title>
      </Helmet>

      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">Messages</h1>
          <Button>
            <MessageCircle className="h-4 w-4 mr-2" />
            New Chat
          </Button>
        </div>

        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search conversations..." className="pl-10" />
          </div>
        </div>

        <div className="space-y-2">
          {mockConversations.map((conversation) => (
            <Card
              key={conversation.id}
              className={`cursor-pointer hover:bg-muted/50 transition-colors ${
                conversation.user.isAI
                  ? "border-purple-200 bg-gradient-to-r from-purple-50 to-blue-50"
                  : ""
              }`}
            >
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <Avatar
                      className={`h-12 w-12 ${
                        conversation.user.isAI
                          ? "border-2 border-purple-300"
                          : ""
                      }`}
                    >
                      <AvatarImage src={conversation.user.avatar} />
                      <AvatarFallback
                        className={
                          conversation.user.isAI
                            ? "bg-gradient-to-r from-purple-500 to-blue-500 text-white"
                            : ""
                        }
                      >
                        {conversation.user.isAI
                          ? "🤖"
                          : conversation.user.name.substring(0, 2)}
                      </AvatarFallback>
                    </Avatar>
                    {conversation.online && (
                      <div
                        className={`absolute -bottom-1 -right-1 h-4 w-4 border-2 border-background rounded-full ${
                          conversation.user.isAI
                            ? "bg-purple-500"
                            : "bg-green-500"
                        }`}
                      ></div>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <h3
                          className={`font-medium truncate ${
                            conversation.user.isAI ? "text-purple-700" : ""
                          }`}
                        >
                          {conversation.user.name}
                        </h3>
                        {conversation.user.isAI && (
                          <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded-full">
                            AI
                          </span>
                        )}
                      </div>
                      <span className="text-xs text-muted-foreground">
                        {conversation.time}
                      </span>
                    </div>
                    <p
                      className={`text-sm truncate ${
                        conversation.user.isAI
                          ? "text-purple-600"
                          : "text-muted-foreground"
                      }`}
                    >
                      {conversation.lastMessage}
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    {conversation.unread > 0 && (
                      <div className="bg-primary text-primary-foreground text-xs rounded-full h-5 w-5 flex items-center justify-center">
                        {conversation.unread}
                      </div>
                    )}

                    <div className="flex gap-1">
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <Phone className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <Video className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center mt-8">
          <p className="text-muted-foreground">
            End-to-end encrypted messaging coming soon!
          </p>
        </div>
      </div>
    </>
  );
};

export default Messages;
