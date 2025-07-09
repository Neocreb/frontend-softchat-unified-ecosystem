import React, { useState, useRef, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Send,
  Bot,
  Sparkles,
  Copy,
  ExternalLink,
  ThumbsUp,
  ThumbsDown,
  RotateCcw,
  Zap,
} from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import {
  AIAssistantMessage,
  AIAction,
  AI_ASSISTANT_CONFIG,
} from "@/types/unified-chat";
import { intelligentAIService } from "@/services/intelligentAIService";
import { realTimeAIService } from "@/services/realTimeAIService";
import { cn } from "@/lib/utils";

interface AIAssistantChatProps {
  className?: string;
  isMinimized?: boolean;
}

export const AIAssistantChat: React.FC<AIAssistantChatProps> = ({
  className,
  isMinimized = false,
}) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [messages, setMessages] = useState<AIAssistantMessage[]>([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [conversationContext, setConversationContext] = useState<string[]>([]);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  // Initialize AI assistant with welcome message
  useEffect(() => {
    if (user && messages.length === 0) {
      // Generate personalized welcome message
      const welcomeResponse = intelligentAIService.generateIntelligentResponse(
        "welcome to softchat platform overview",
        user,
      );

      const welcomeMessage: AIAssistantMessage = {
        id: "welcome-msg",
        threadId: "ai_assistant",
        senderId: "ai_assistant",
        content: welcomeResponse.message,
        timestamp: new Date().toISOString(),
        readBy: [],
        messageType: "text",
        aiContext: {
          confidence: welcomeResponse.confidence,
          sources: welcomeResponse.sources,
          suggestedActions: welcomeResponse.suggestedActions,
          followUpQuestions: welcomeResponse.followUpQuestions,
          relatedTopics: welcomeResponse.relatedTopics,
        },
      };
      setMessages([welcomeMessage]);
    }
  }, [user]);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (scrollAreaRef.current) {
      const scrollContainer = scrollAreaRef.current.querySelector(
        "[data-radix-scroll-area-viewport]",
      );
      if (scrollContainer) {
        scrollContainer.scrollTop = scrollContainer.scrollHeight;
      }
    }
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || !user || isTyping) return;

    const userMessage: AIAssistantMessage = {
      id: `user-${Date.now()}`,
      threadId: "ai_assistant",
      senderId: user.id,
      content: input.trim(),
      timestamp: new Date().toISOString(),
      readBy: [user.id],
      messageType: "text",
    };

    setMessages((prev) => [...prev, userMessage]);
    const currentInput = input;
    setInput("");
    setIsTyping(true);

    // Add to conversation context
    setConversationContext((prev) => [...prev.slice(-4), currentInput]);

    try {
      // Track interaction (temporarily disabled)
      // await aiPersonalAssistantService.trackInteraction(user.id, "chat", {
      //   message: currentInput,
      // });

      // Generate AI response with context
      const contextualInput =
        conversationContext.length > 0
          ? `Previous context: ${conversationContext.slice(-2).join(". ")}. Current: ${currentInput}`
          : currentInput;

      // const smartResponse = enhancedAIService.generateSmartResponse(
      //   contextualInput,
      //   user,
      // );

      // Generate real-time intelligent AI response
      const smartResponse = await realTimeAIService.generateRealTimeResponse(
        contextualInput,
        user,
        conversationContext,
      );

      // Simulate realistic response time
      const responseDelay = Math.min(800 + currentInput.length * 15, 3000);

      setTimeout(() => {
        const aiResponse: AIAssistantMessage = {
          id: `ai-${Date.now()}`,
          threadId: "ai_assistant",
          senderId: "ai_assistant",
          content: smartResponse.message,
          timestamp: new Date().toISOString(),
          readBy: [],
          messageType: "text",
          aiContext: {
            confidence: smartResponse.confidence || 85,
            suggestedActions: smartResponse.suggestedActions?.slice(0, 3) || [],
            followUpQuestions:
              smartResponse.followUpQuestions?.slice(0, 3) || [],
            relatedTopics: smartResponse.relatedTopics?.slice(0, 4) || [],
            sources: smartResponse.sources,
          },
        };

        setMessages((prev) => [...prev, aiResponse]);
        setIsTyping(false);
      }, responseDelay);
    } catch (error) {
      console.error("Error sending message to AI:", error);
      setIsTyping(false);
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleActionClick = (action: AIAction) => {
    switch (action.action) {
      case "navigate":
        if (action.url) {
          window.location.href = action.url;
        }
        break;
      case "copy":
        if (action.data) {
          navigator.clipboard.writeText(action.data);
          toast({
            title: "Copied!",
            description: "Content copied to clipboard",
          });
        }
        break;
      case "execute":
        // Handle custom actions
        toast({
          title: "Action executed",
          description: action.label,
        });
        break;
    }
  };

  const handleFollowUpQuestion = (question: string) => {
    setInput(question);
  };

  const handleReaction = async (
    messageId: string,
    type: "like" | "dislike",
  ) => {
    if (user) {
      // await aiPersonalAssistantService.trackInteraction(
      //   user.id,
      //   "ai_feedback",
      //   {
      //     messageId,
      //     reaction: type,
      //   },
      // );

      toast({
        title: "Thanks for your feedback!",
        description: "This helps me improve my responses.",
      });
    }
  };

  if (isMinimized) {
    return (
      <div
        className={cn(
          "flex items-center gap-2 p-2 bg-purple-50 rounded-lg",
          className,
        )}
      >
        <Avatar className="h-6 w-6">
          <AvatarImage src={AI_ASSISTANT_CONFIG.avatar} />
          <AvatarFallback className="bg-purple-500 text-white text-xs">
            <Bot className="h-3 w-3" />
          </AvatarFallback>
        </Avatar>
        <span className="text-sm font-medium text-purple-700">
          {AI_ASSISTANT_CONFIG.name} is available
        </span>
        <Sparkles className="h-4 w-4 text-purple-500" />
      </div>
    );
  }

  return (
    <div className={cn("flex flex-col h-full", className)}>
      {/* AI Assistant Header */}
      <div className="flex items-center gap-3 p-4 border-b bg-purple-50/50">
        <Avatar className="h-10 w-10">
          <AvatarImage src={AI_ASSISTANT_CONFIG.avatar} />
          <AvatarFallback className="bg-purple-500 text-white">
            <Bot className="h-5 w-5" />
          </AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h3 className="font-medium text-purple-900">
              {AI_ASSISTANT_CONFIG.name}
            </h3>
            <Badge
              variant="secondary"
              className="text-xs bg-purple-100 text-purple-700"
            >
              AI Assistant
            </Badge>
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
          </div>
          <p className="text-xs text-purple-600">
            Always here to help • Responds instantly
          </p>
        </div>
        <Button variant="ghost" size="sm" className="text-purple-600">
          <Zap className="h-4 w-4" />
        </Button>
      </div>

      {/* Chat Messages */}
      <ScrollArea ref={scrollAreaRef} className="flex-1 p-4">
        <div className="space-y-4">
          {messages.map((message) => (
            <div key={message.id} className="space-y-2">
              <div
                className={cn(
                  "flex",
                  message.senderId === "ai_assistant"
                    ? "justify-start"
                    : "justify-end",
                )}
              >
                <div
                  className={cn(
                    "max-w-[85%] space-y-2",
                    message.senderId === "ai_assistant"
                      ? "items-start"
                      : "items-end",
                  )}
                >
                  <div className="flex items-start gap-2">
                    {message.senderId === "ai_assistant" && (
                      <Avatar className="h-6 w-6 mt-1">
                        <AvatarImage src={AI_ASSISTANT_CONFIG.avatar} />
                        <AvatarFallback className="bg-purple-500 text-white text-xs">
                          <Bot className="h-3 w-3" />
                        </AvatarFallback>
                      </Avatar>
                    )}

                    <div
                      className={cn(
                        "rounded-lg px-3 py-2 max-w-full",
                        message.senderId === "ai_assistant"
                          ? "bg-purple-50 border border-purple-200"
                          : "bg-primary text-primary-foreground",
                      )}
                    >
                      <div className="text-sm whitespace-pre-wrap leading-relaxed">
                        {message.content}
                      </div>

                      {/* AI Confidence indicator */}
                      {message.senderId === "ai_assistant" &&
                        message.aiContext?.confidence && (
                          <div className="flex items-center gap-1 mt-1">
                            <div className="text-xs text-purple-600 opacity-70">
                              {message.aiContext.confidence}% confident
                            </div>
                          </div>
                        )}
                    </div>
                  </div>

                  {/* AI Response Actions */}
                  {message.senderId === "ai_assistant" &&
                    message.aiContext?.suggestedActions &&
                    message.aiContext.suggestedActions.length > 0 && (
                      <div className="flex flex-wrap gap-1 ml-8">
                        {message.aiContext.suggestedActions.map((action) => (
                          <Button
                            key={action.id}
                            variant="outline"
                            size="sm"
                            className="h-6 text-xs border-purple-200 text-purple-700 hover:bg-purple-50"
                            onClick={() => handleActionClick(action)}
                          >
                            {action.action === "navigate" && (
                              <ExternalLink className="h-3 w-3 mr-1" />
                            )}
                            {action.action === "copy" && (
                              <Copy className="h-3 w-3 mr-1" />
                            )}
                            {action.label}
                          </Button>
                        ))}
                      </div>
                    )}

                  {/* Follow-up Questions */}
                  {message.senderId === "ai_assistant" &&
                    message.aiContext?.followUpQuestions &&
                    message.aiContext.followUpQuestions.length > 0 && (
                      <div className="ml-8 space-y-1">
                        <p className="text-xs text-purple-600 font-medium">
                          You might also ask:
                        </p>
                        {message.aiContext.followUpQuestions.map(
                          (question, index) => (
                            <button
                              key={index}
                              className="block text-xs text-purple-600 hover:text-purple-800 underline text-left"
                              onClick={() => handleFollowUpQuestion(question)}
                            >
                              "{question}"
                            </button>
                          ),
                        )}
                      </div>
                    )}

                  {/* Message timestamp and reactions */}
                  <div className="flex items-center gap-2 text-xs text-muted-foreground ml-8">
                    <span>
                      {new Date(message.timestamp).toLocaleTimeString()}
                    </span>
                    {message.senderId === "ai_assistant" && (
                      <div className="flex items-center gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-4 w-4 p-0 text-muted-foreground hover:text-green-600"
                          onClick={() => handleReaction(message.id, "like")}
                        >
                          <ThumbsUp className="h-3 w-3" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-4 w-4 p-0 text-muted-foreground hover:text-red-600"
                          onClick={() => handleReaction(message.id, "dislike")}
                        >
                          <ThumbsDown className="h-3 w-3" />
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}

          {/* Typing Indicator */}
          {isTyping && (
            <div className="flex justify-start">
              <div className="flex items-start gap-2">
                <Avatar className="h-6 w-6">
                  <AvatarImage src={AI_ASSISTANT_CONFIG.avatar} />
                  <AvatarFallback className="bg-purple-500 text-white text-xs">
                    <Bot className="h-3 w-3" />
                  </AvatarFallback>
                </Avatar>
                <div className="bg-purple-50 border border-purple-200 rounded-lg px-3 py-2">
                  <div className="flex items-center space-x-1">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce"></div>
                      <div
                        className="w-2 h-2 bg-purple-500 rounded-full animate-bounce"
                        style={{ animationDelay: "0.1s" }}
                      ></div>
                      <div
                        className="w-2 h-2 bg-purple-500 rounded-full animate-bounce"
                        style={{ animationDelay: "0.2s" }}
                      ></div>
                    </div>
                    <span className="text-xs text-purple-600 ml-2">
                      {AI_ASSISTANT_CONFIG.name} is thinking...
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </ScrollArea>

      {/* Input Area */}
      <div className="p-4 border-t bg-background">
        <form onSubmit={handleSendMessage} className="space-y-2">
          <div className="flex gap-2">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={`Ask ${AI_ASSISTANT_CONFIG.name} anything about SoftChat...`}
              className="flex-1 border-purple-200 focus:border-purple-400 focus:ring-purple-400"
              disabled={isTyping}
            />
            <Button
              type="submit"
              size="sm"
              disabled={!input.trim() || isTyping}
              className="bg-purple-600 hover:bg-purple-700"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>

          {/* AI Capabilities hint */}
          <div className="flex items-center gap-1 text-xs text-purple-600">
            <Sparkles className="h-3 w-3" />
            <span>
              I can help with content, trading, marketplace, freelancing & more!
            </span>
          </div>
        </form>
      </div>
    </div>
  );
};
