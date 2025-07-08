import React, { useState, useRef, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  ArrowLeft,
  Send,
  Paperclip,
  Smile,
  MoreVertical,
  Phone,
  Video,
  Info,
  Search,
  Star,
  Volume2,
  VolumeX,
  Trash2,
  Image as ImageIcon,
  File,
  Download,
  Reply,
  Copy,
  Forward,
} from "lucide-react";
import { ChatMessage } from "@/types/chat";
import { useChatThread } from "@/chat/hooks/useChatThread";
import { useSendMessage } from "@/chat/hooks/useSendMessage";
import {
  formatChatTitle,
  formatContextSubtitle,
  getChatTypeIcon,
  getChatTypeLabel,
  getChatTypeBadgeColor,
  shouldGroupMessages,
  formatMessageTime,
} from "@/chat/utils/chatHelpers";
import { useAuth } from "@/contexts/AuthContext";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";

export const ChatRoom: React.FC = () => {
  const { threadId } = useParams<{ threadId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();

  const [messageInput, setMessageInput] = useState("");
  const [replyingTo, setReplyingTo] = useState<ChatMessage | null>(null);
  const [showScrollToBottom, setShowScrollToBottom] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const {
    thread,
    messages,
    loading,
    error,
    sendMessage,
    sendFile,
    addReaction,
    deleteMessage,
    sendTypingIndicator,
  } = useChatThread(threadId);

  const { sending, uploading, sendTextMessage, sendFiles } = useSendMessage(
    threadId || "",
  );

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Handle scroll to show/hide scroll-to-bottom button
  useEffect(() => {
    const container = messagesContainerRef.current;
    if (!container) return;

    const handleScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = container;
      const isNearBottom = scrollHeight - scrollTop - clientHeight < 100;
      setShowScrollToBottom(!isNearBottom && messages.length > 0);
    };

    container.addEventListener("scroll", handleScroll);
    return () => container.removeEventListener("scroll", handleScroll);
  }, [messages.length]);

  const handleSendMessage = async () => {
    if (!messageInput.trim() || sending) return;

    const content = messageInput.trim();
    setMessageInput("");

    if (replyingTo) {
      // Handle reply
      const replyContent = `Replying to: "${replyingTo.content.substring(0, 50)}${replyingTo.content.length > 50 ? "..." : ""}"\n\n${content}`;
      await sendMessage(replyContent);
      setReplyingTo(null);
    } else {
      await sendMessage(content);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    await sendFiles(files);

    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleReaction = async (messageId: string, emoji: string) => {
    await addReaction(messageId, emoji);
  };

  const handleDeleteMessage = async (messageId: string) => {
    if (window.confirm("Are you sure you want to delete this message?")) {
      await deleteMessage(messageId);
    }
  };

  const handleCopyMessage = (content: string) => {
    navigator.clipboard.writeText(content);
    toast({
      title: "Copied",
      description: "Message copied to clipboard",
    });
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const formatMessageTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const isToday = date.toDateString() === now.toDateString();
    const isYesterday =
      new Date(now.getTime() - 24 * 60 * 60 * 1000).toDateString() ===
      date.toDateString();

    if (isToday) {
      return date.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });
    } else if (isYesterday) {
      return (
        "Yesterday " +
        date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
      );
    } else {
      return (
        date.toLocaleDateString() +
        " " +
        date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
      );
    }
  };

  const MessageBubble: React.FC<{ message: ChatMessage; index: number }> = ({
    message,
    index,
  }) => {
    const isOwn = message.senderId === user?.id;
    const previousMessage = index > 0 ? messages[index - 1] : null;
    const isGrouped = shouldGroupMessages(message, previousMessage);

    return (
      <div className={`flex ${isOwn ? "justify-end" : "justify-start"} mb-2`}>
        <div
          className={`flex ${isOwn ? "flex-row-reverse" : "flex-row"} items-end gap-2 max-w-[70%]`}
        >
          {!isOwn && !isGrouped && (
            <Avatar className="w-8 h-8 flex-shrink-0">
              <AvatarImage src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100" />
              <AvatarFallback>
                {message.senderId.slice(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
          )}
          {!isOwn && isGrouped && <div className="w-8" />}

          <div className={`group relative ${isOwn ? "ml-8" : "mr-8"}`}>
            <div
              className={`px-4 py-2 rounded-lg ${
                isOwn ? "bg-primary text-primary-foreground" : "bg-muted"
              } ${isGrouped ? "mb-1" : "mb-2"}`}
            >
              {message.replyTo && (
                <div className="mb-2 p-2 border-l-2 border-border bg-background/50 rounded text-xs opacity-75">
                  Replying to previous message
                </div>
              )}

              <div className="text-sm">{message.content}</div>

              {message.attachments && message.attachments.length > 0 && (
                <div className="mt-2 space-y-1">
                  {message.attachments.map((attachment, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-xs">
                      {message.messageType === "image" ? (
                        <ImageIcon className="w-3 h-3" />
                      ) : (
                        <File className="w-3 h-3" />
                      )}
                      <span className="truncate">Attachment</span>
                      <Button variant="ghost" size="sm" className="h-auto p-1">
                        <Download className="w-3 h-3" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}

              {message.reactions && message.reactions.length > 0 && (
                <div className="flex gap-1 mt-2">
                  {message.reactions.map((reaction, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleReaction(message.id, reaction.emoji)}
                      className="text-xs bg-background/50 px-1 rounded hover:bg-background/75 transition-colors"
                    >
                      {reaction.emoji} {reaction.count}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div
              className={`text-xs text-muted-foreground ${isOwn ? "text-right" : "text-left"}`}
            >
              {formatMessageTimestamp(message.timestamp)}
            </div>

            {/* Message actions */}
            <div
              className={`absolute top-0 ${isOwn ? "left-0" : "right-0"} opacity-0 group-hover:opacity-100 transition-opacity`}
            >
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                    <MoreVertical className="w-3 h-3" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align={isOwn ? "start" : "end"}>
                  <DropdownMenuItem onClick={() => setReplyingTo(message)}>
                    <Reply className="w-4 h-4 mr-2" />
                    Reply
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => handleCopyMessage(message.content)}
                  >
                    <Copy className="w-4 h-4 mr-2" />
                    Copy
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Forward className="w-4 h-4 mr-2" />
                    Forward
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => handleReaction(message.id, "👍")}
                  >
                    <Star className="w-4 h-4 mr-2" />
                    React
                  </DropdownMenuItem>
                  {isOwn && (
                    <DropdownMenuItem
                      onClick={() => handleDeleteMessage(message.id)}
                      className="text-red-600"
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Delete
                    </DropdownMenuItem>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex flex-col h-screen">
        <div className="p-4 border-b">
          <Skeleton className="h-12 w-full" />
        </div>
        <div className="flex-1 p-4 space-y-4">
          {Array.from({ length: 10 }).map((_, i) => (
            <div
              key={i}
              className={`flex ${i % 2 === 0 ? "justify-end" : "justify-start"}`}
            >
              <Skeleton className="h-16 w-64" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error || !thread) {
    return (
      <div className="flex flex-col h-screen items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="py-12 text-center">
            <h3 className="text-lg font-medium">Chat not found</h3>
            <p className="text-muted-foreground mb-4">
              {error || "This conversation doesn't exist"}
            </p>
            <Button onClick={() => navigate("/messages")}>
              Back to Messages
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const chatTitle = formatChatTitle(thread, user?.id || "");
  const chatSubtitle = formatContextSubtitle(thread);

  return (
    <div className="flex flex-col h-screen">
      {/* Header */}
      <div className="p-4 border-b bg-background/95 backdrop-blur">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate("/messages")}
              className="md:hidden"
            >
              <ArrowLeft className="w-4 h-4" />
            </Button>

            <Avatar className="w-10 h-10">
              <AvatarImage
                src={
                  thread.groupAvatar ||
                  "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100"
                }
              />
              <AvatarFallback>{thread.isGroup ? "👥" : "💬"}</AvatarFallback>
            </Avatar>

            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <h2 className="font-semibold truncate">{chatTitle}</h2>
                <Badge
                  className={`text-xs ${getChatTypeBadgeColor(thread.type)}`}
                >
                  {getChatTypeIcon(thread.type)} {getChatTypeLabel(thread.type)}
                </Badge>
              </div>
              {chatSubtitle && (
                <p className="text-sm text-muted-foreground truncate">
                  {chatSubtitle}
                </p>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2">
            {thread.type === "social" && (
              <>
                <Button variant="ghost" size="sm">
                  <Phone className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="sm">
                  <Video className="w-4 h-4" />
                </Button>
              </>
            )}
            <Button variant="ghost" size="sm">
              <Search className="w-4 h-4" />
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm">
                  <MoreVertical className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>
                  <Info className="w-4 h-4 mr-2" />
                  Chat Info
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <VolumeX className="w-4 h-4 mr-2" />
                  Mute Chat
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Star className="w-4 h-4 mr-2" />
                  Star Chat
                </DropdownMenuItem>
                <Separator />
                <DropdownMenuItem className="text-red-600">
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete Chat
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div
        ref={messagesContainerRef}
        className="flex-1 overflow-y-auto p-4 space-y-2"
      >
        {messages.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <div className="text-4xl mb-4">
                {getChatTypeIcon(thread.type)}
              </div>
              <h3 className="text-lg font-medium mb-2">
                Start the conversation
              </h3>
              <p className="text-muted-foreground">
                Send a message to begin chatting
              </p>
            </div>
          </div>
        ) : (
          <>
            {messages.map((message, index) => (
              <MessageBubble key={message.id} message={message} index={index} />
            ))}
            <div ref={messagesEndRef} />
          </>
        )}
      </div>

      {/* Scroll to bottom button */}
      {showScrollToBottom && (
        <div className="absolute bottom-20 right-6">
          <Button
            onClick={scrollToBottom}
            size="sm"
            className="rounded-full shadow-lg"
          >
            ↓
          </Button>
        </div>
      )}

      {/* Reply indicator */}
      {replyingTo && (
        <div className="px-4 py-2 bg-muted border-t">
          <div className="flex items-center justify-between">
            <div className="text-sm">
              <span className="text-muted-foreground">Replying to:</span>
              <span className="ml-2">
                {replyingTo.content.substring(0, 50)}...
              </span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setReplyingTo(null)}
              className="h-6 w-6 p-0"
            >
              ×
            </Button>
          </div>
        </div>
      )}

      {/* Message Input */}
      <div className="p-4 border-t bg-background">
        <div className="flex items-end gap-2">
          <input
            ref={fileInputRef}
            type="file"
            multiple
            onChange={handleFileUpload}
            className="hidden"
            accept="image/*,.pdf,.doc,.docx,.txt"
          />

          <Button
            variant="ghost"
            size="sm"
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
          >
            <Paperclip className="w-4 h-4" />
          </Button>

          <div className="flex-1">
            <Input
              placeholder="Type a message..."
              value={messageInput}
              onChange={(e) => {
                setMessageInput(e.target.value);
                sendTypingIndicator();
              }}
              onKeyPress={handleKeyPress}
              disabled={sending || uploading}
            />
          </div>

          <Button variant="ghost" size="sm">
            <Smile className="w-4 h-4" />
          </Button>

          <Button
            onClick={handleSendMessage}
            disabled={!messageInput.trim() || sending || uploading}
            size="sm"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ChatRoom;
