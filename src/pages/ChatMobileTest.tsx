import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ArrowLeft, MoreVertical, Phone, Video } from "lucide-react";
import WhatsAppChatInput from "@/components/chat/WhatsAppChatInput";
import { useNavigate } from "react-router-dom";
import { StickerData } from "@/types/sticker";

interface ChatMessage {
  id: string;
  content: string;
  type: "text" | "sticker" | "voice" | "media";
  sender: "user" | "contact";
  timestamp: Date;
  metadata?: any;
}

export const ChatMobileTest: React.FC = () => {
  const navigate = useNavigate();
  const [messageInput, setMessageInput] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "1",
      content: "Hey! How was your weekend?",
      type: "text",
      sender: "contact",
      timestamp: new Date(Date.now() - 60000),
    },
    {
      id: "2",
      content: "It was great! Check out this sticker",
      type: "text",
      sender: "user",
      timestamp: new Date(Date.now() - 30000),
    },
  ]);

  const handleSendMessage = (
    type: "text" | "voice" | "sticker" | "media",
    content: string,
    metadata?: any
  ) => {
    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      content,
      type,
      sender: "user",
      timestamp: new Date(),
      metadata,
    };

    setMessages(prev => [...prev, newMessage]);
    setMessageInput("");

    // Simulate a response after a short delay
    setTimeout(() => {
      const responses = {
        text: "That's awesome! 😊",
        sticker: "Nice sticker! 👍",
        voice: "Got your voice message!",
        media: "Cool photo!",
      };

      const responseMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        content: responses[type],
        type: "text",
        sender: "contact",
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, responseMessage]);
    }, 1000);
  };

  const formatMessageTime = (timestamp: Date) => {
    return timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const renderMessageContent = (message: ChatMessage) => {
    switch (message.type) {
      case "sticker":
        if (message.metadata?.stickerType === "emoji" || (message.metadata?.animated === false && !message.metadata?.stickerUrl)) {
          return (
            <div className="text-4xl p-2 bg-transparent">
              {message.content}
            </div>
          );
        } else if (message.metadata?.stickerUrl) {
          return (
            <div className="p-1">
              <img
                src={message.metadata.stickerUrl}
                alt={message.metadata?.stickerName || "Sticker"}
                className="w-32 h-32 object-contain rounded-lg"
              />
            </div>
          );
        } else {
          return (
            <div className="text-4xl p-2 bg-transparent">
              {message.content}
            </div>
          );
        }
      case "voice":
        return (
          <div className="flex items-center gap-2 p-3 bg-blue-100 dark:bg-blue-900 rounded-lg">
            <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
              🎵
            </div>
            <div className="flex-1">
              <div className="text-sm font-medium">Voice Message</div>
              <div className="text-xs text-muted-foreground">
                {message.metadata?.duration || 0}s
              </div>
            </div>
          </div>
        );
      case "media":
        return (
          <div className="p-1">
            <img
              src={message.content}
              alt="Media"
              className="max-w-48 rounded-lg"
            />
          </div>
        );
      default:
        return <span>{message.content}</span>;
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50 dark:bg-gray-900">
      {/* Chat Header */}
      <div className="flex items-center gap-3 p-4 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate(-1)}
          className="h-10 w-10"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        
        <Avatar className="h-10 w-10">
          <AvatarImage src="https://images.unsplash.com/photo-1494790108755-2616b612b47c?w=150&h=150&fit=crop&crop=face" />
          <AvatarFallback>SA</AvatarFallback>
        </Avatar>
        
        <div className="flex-1">
          <h2 className="font-semibold">Sarah Anderson</h2>
          <p className="text-sm text-muted-foreground">Online</p>
        </div>
        
        <Button variant="ghost" size="icon" className="h-10 w-10">
          <Video className="h-5 w-5" />
        </Button>
        <Button variant="ghost" size="icon" className="h-10 w-10">
          <Phone className="h-5 w-5" />
        </Button>
        <Button variant="ghost" size="icon" className="h-10 w-10">
          <MoreVertical className="h-5 w-5" />
        </Button>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[85%] rounded-2xl px-4 py-2 ${
                message.sender === "user"
                  ? "bg-blue-500 text-white"
                  : "bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
              }`}
            >
              {renderMessageContent(message)}
              <div
                className={`text-xs mt-1 ${
                  message.sender === "user"
                    ? "text-blue-100"
                    : "text-gray-500 dark:text-gray-400"
                }`}
              >
                {formatMessageTime(message.timestamp)}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Enhanced WhatsApp-style Chat Input */}
      <WhatsAppChatInput
        messageInput={messageInput}
        setMessageInput={setMessageInput}
        onSendMessage={handleSendMessage}
        isMobile={true}
        placeholder="Message Sarah..."
      />
    </div>
  );
};

export default ChatMobileTest;
