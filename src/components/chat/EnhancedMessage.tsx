import React, { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Download,
  FileText,
  Image,
  Video,
  Mic,
  Clock,
  CheckCheck,
  Eye,
  Copy,
  Reply,
  MoreVertical,
  Heart,
  ThumbsUp,
  Laugh,
  Angry,
  Sad,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { useToast } from "@/components/ui/use-toast";
import { format } from "date-fns";

export interface EnhancedChatMessage {
  id: string;
  senderId: string;
  senderName: string;
  senderAvatar?: string;
  content: string;
  type: "text" | "voice" | "sticker" | "media";
  timestamp: string;
  metadata?: {
    duration?: number;
    transcription?: string;
    fileName?: string;
    fileSize?: number;
    fileType?: string;
    mediaType?: "image" | "video" | "file";
    stickerName?: string;
  };
  status: "sending" | "sent" | "delivered" | "read";
  reactions?: {
    userId: string;
    emoji: string;
    timestamp: string;
  }[];
  isEdited?: boolean;
  replyTo?: {
    messageId: string;
    content: string;
    senderName: string;
  };
}

interface EnhancedMessageProps {
  message: EnhancedChatMessage;
  isCurrentUser: boolean;
  isMobile?: boolean;
  onReply?: (message: EnhancedChatMessage) => void;
  onReact?: (messageId: string, emoji: string) => void;
  onEdit?: (messageId: string, newContent: string) => void;
  onDelete?: (messageId: string) => void;
  showAvatar?: boolean;
  groupWithPrevious?: boolean;
}

const reactionEmojis = [
  { emoji: "❤️", name: "heart" },
  { emoji: "👍", name: "thumbs_up" },
  { emoji: "😂", name: "laugh" },
  { emoji: "😮", name: "wow" },
  { emoji: "😢", name: "sad" },
  { emoji: "😡", name: "angry" },
];

export const EnhancedMessage: React.FC<EnhancedMessageProps> = ({
  message,
  isCurrentUser,
  isMobile = false,
  onReply,
  onReact,
  onEdit,
  onDelete,
  showAvatar = true,
  groupWithPrevious = false,
}) => {
  const { toast } = useToast();
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioProgress, setAudioProgress] = useState(0);
  const [showTranscription, setShowTranscription] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(message.content);
  const audioRef = useRef<HTMLAudioElement>(null);

  // Audio playback handling
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateProgress = () => {
      const progress = (audio.currentTime / audio.duration) * 100;
      setAudioProgress(progress);
    };

    const handleEnded = () => {
      setIsPlaying(false);
      setAudioProgress(0);
    };

    audio.addEventListener("timeupdate", updateProgress);
    audio.addEventListener("ended", handleEnded);

    return () => {
      audio.removeEventListener("timeupdate", updateProgress);
      audio.removeEventListener("ended", handleEnded);
    };
  }, []);

  const handlePlayPause = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
    } else {
      audio.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleReaction = (emoji: string) => {
    onReact?.(message.id, emoji);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(message.content);
    toast({
      title: "Copied",
      description: "Message copied to clipboard",
    });
  };

  const handleSaveEdit = () => {
    if (editContent.trim() !== message.content) {
      onEdit?.(message.id, editContent.trim());
    }
    setIsEditing(false);
  };

  const formatFileSize = (bytes: number) => {
    const sizes = ["Bytes", "KB", "MB", "GB"];
    if (bytes === 0) return "0 Bytes";
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return Math.round((bytes / Math.pow(1024, i)) * 100) / 100 + " " + sizes[i];
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const getStatusIcon = () => {
    switch (message.status) {
      case "sending":
        return <Clock className="w-3 h-3 text-gray-400" />;
      case "sent":
        return <CheckCheck className="w-3 h-3 text-gray-400" />;
      case "delivered":
        return <CheckCheck className="w-3 h-3 text-blue-500" />;
      case "read":
        return <CheckCheck className="w-3 h-3 text-blue-600" />;
      default:
        return null;
    }
  };

  const renderMessageContent = () => {
    switch (message.type) {
      case "sticker":
        return (
          <div className="text-6xl p-2 bg-transparent">{message.content}</div>
        );

      case "voice":
        return (
          <Card
            className={cn(
              "max-w-xs",
              isCurrentUser ? "bg-primary text-primary-foreground" : "",
            )}
          >
            <CardContent className="p-3">
              <div className="flex items-center gap-3">
                <Button
                  onClick={handlePlayPause}
                  size="icon"
                  variant={isCurrentUser ? "secondary" : "ghost"}
                  className="rounded-full h-10 w-10 flex-shrink-0"
                >
                  {isPlaying ? (
                    <Pause className="w-4 h-4" />
                  ) : (
                    <Play className="w-4 h-4" />
                  )}
                </Button>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <Mic className="w-3 h-3" />
                    <span className="text-sm font-medium">Voice message</span>
                    {message.metadata?.duration && (
                      <span className="text-xs opacity-70">
                        {formatDuration(message.metadata.duration)}
                      </span>
                    )}
                  </div>

                  {/* Audio progress bar */}
                  <div className="w-full bg-white/20 rounded-full h-1">
                    <div
                      className="bg-white rounded-full h-1 transition-all duration-200"
                      style={{ width: `${audioProgress}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Transcription toggle */}
              {message.metadata?.transcription && (
                <div className="mt-2 pt-2 border-t border-white/20">
                  <Button
                    onClick={() => setShowTranscription(!showTranscription)}
                    variant="ghost"
                    size="sm"
                    className="text-xs h-6 px-2"
                  >
                    {showTranscription ? "Hide" : "Show"} transcription
                  </Button>
                  {showTranscription && (
                    <p className="text-xs mt-1 opacity-80">
                      "{message.metadata.transcription}"
                    </p>
                  )}
                </div>
              )}

              <audio ref={audioRef} src={message.content} preload="metadata" />
            </CardContent>
          </Card>
        );

      case "media":
        const { metadata } = message;

        if (metadata?.mediaType === "image") {
          return (
            <div className="max-w-sm">
              <img
                src={message.content}
                alt="Shared image"
                className="rounded-lg max-w-full h-auto"
                loading="lazy"
              />
              {metadata?.fileName && (
                <p className="text-xs text-gray-500 mt-1 truncate">
                  {metadata.fileName}
                </p>
              )}
            </div>
          );
        }

        if (metadata?.mediaType === "video") {
          return (
            <div className="max-w-sm">
              <video
                src={message.content}
                controls
                className="rounded-lg max-w-full h-auto"
                preload="metadata"
              />
              {metadata?.fileName && (
                <p className="text-xs text-gray-500 mt-1 truncate">
                  {metadata.fileName}
                </p>
              )}
            </div>
          );
        }

        if (metadata?.mediaType === "file") {
          return (
            <Card className="max-w-xs">
              <CardContent className="p-3">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-gray-100 rounded-lg">
                    <FileText className="w-6 h-6 text-gray-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm truncate">
                      {metadata?.fileName || "File"}
                    </p>
                    {metadata?.fileSize && (
                      <p className="text-xs text-gray-500">
                        {formatFileSize(metadata.fileSize)}
                      </p>
                    )}
                  </div>
                  <Button size="icon" variant="ghost" className="h-8 w-8">
                    <Download className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        }

        return null;

      case "text":
      default:
        return (
          <div
            className={cn(
              "px-3 py-2 rounded-2xl max-w-sm break-words",
              isCurrentUser
                ? "bg-primary text-primary-foreground ml-auto"
                : "bg-muted",
            )}
          >
            {message.replyTo && (
              <div className="border-l-2 border-white/30 pl-2 mb-2 text-xs opacity-80">
                <p className="font-medium">{message.replyTo.senderName}</p>
                <p className="truncate">{message.replyTo.content}</p>
              </div>
            )}

            {isEditing ? (
              <div className="space-y-2">
                <input
                  value={editContent}
                  onChange={(e) => setEditContent(e.target.value)}
                  className="w-full bg-transparent border-none outline-none"
                  onKeyPress={(e) => {
                    if (e.key === "Enter") handleSaveEdit();
                    if (e.key === "Escape") setIsEditing(false);
                  }}
                  autoFocus
                />
                <div className="flex gap-1">
                  <Button
                    size="sm"
                    onClick={handleSaveEdit}
                    className="h-6 text-xs"
                  >
                    Save
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => setIsEditing(false)}
                    className="h-6 text-xs"
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            ) : (
              <>
                <p className="whitespace-pre-wrap">{message.content}</p>
                {message.isEdited && (
                  <span className="text-xs opacity-60"> (edited)</span>
                )}
              </>
            )}
          </div>
        );
    }
  };

  return (
    <TooltipProvider>
      <div
        className={cn(
          "flex group",
          isCurrentUser ? "justify-end" : "justify-start",
          groupWithPrevious ? "mt-1" : "mt-4",
        )}
      >
        <div
          className={cn(
            "flex items-end gap-2 max-w-[80%]",
            isCurrentUser ? "flex-row-reverse" : "flex-row",
          )}
        >
          {/* Avatar */}
          {showAvatar && !groupWithPrevious && !isCurrentUser && (
            <Avatar className="w-8 h-8 flex-shrink-0">
              <AvatarImage src={message.senderAvatar} />
              <AvatarFallback className="text-xs">
                {message.senderName?.charAt(0) || "?"}
              </AvatarFallback>
            </Avatar>
          )}

          {/* Message container */}
          <div
            className={cn(
              "relative",
              isCurrentUser ? "items-end" : "items-start",
            )}
          >
            {/* Sender name (for group chats) */}
            {!isCurrentUser && !groupWithPrevious && (
              <p className="text-xs text-gray-500 mb-1 px-3">
                {message.senderName || "Unknown"}
              </p>
            )}

            {/* Message content */}
            <div className="relative">
              {renderMessageContent()}

              {/* Message options (visible on hover) */}
              <div
                className={cn(
                  "absolute -top-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity",
                  isCurrentUser ? "-left-20" : "-right-20",
                )}
              >
                {/* Quick reactions */}
                <div className="flex bg-background border rounded-full p-1 shadow-lg">
                  {reactionEmojis.slice(0, 3).map((reaction) => (
                    <Button
                      key={reaction.name}
                      onClick={() => handleReaction(reaction.emoji)}
                      size="icon"
                      variant="ghost"
                      className="h-6 w-6 text-sm hover:bg-muted"
                    >
                      {reaction.emoji}
                    </Button>
                  ))}

                  {/* More options */}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button size="icon" variant="ghost" className="h-6 w-6">
                        <MoreVertical className="w-3 h-3" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      {onReply && (
                        <DropdownMenuItem onClick={() => onReply(message)}>
                          <Reply className="w-4 h-4 mr-2" />
                          Reply
                        </DropdownMenuItem>
                      )}
                      <DropdownMenuItem onClick={handleCopy}>
                        <Copy className="w-4 h-4 mr-2" />
                        Copy
                      </DropdownMenuItem>
                      {reactionEmojis.slice(3).map((reaction) => (
                        <DropdownMenuItem
                          key={reaction.name}
                          onClick={() => handleReaction(reaction.emoji)}
                        >
                          {reaction.emoji} {reaction.name}
                        </DropdownMenuItem>
                      ))}
                      <DropdownMenuSeparator />
                      {isCurrentUser && onEdit && message.type === "text" && (
                        <DropdownMenuItem onClick={() => setIsEditing(true)}>
                          Edit
                        </DropdownMenuItem>
                      )}
                      {isCurrentUser && onDelete && (
                        <DropdownMenuItem
                          onClick={() => onDelete(message.id)}
                          className="text-destructive"
                        >
                          Delete
                        </DropdownMenuItem>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            </div>

            {/* Message metadata */}
            <div
              className={cn(
                "flex items-center gap-1 mt-1 text-xs text-gray-500",
                isCurrentUser ? "justify-end" : "justify-start",
              )}
            >
              <Tooltip>
                <TooltipTrigger>
                  <span>{format(new Date(message.timestamp), "HH:mm")}</span>
                </TooltipTrigger>
                <TooltipContent>
                  {format(new Date(message.timestamp), "MMM d, HH:mm")}
                </TooltipContent>
              </Tooltip>

              {isCurrentUser && getStatusIcon()}
            </div>

            {/* Reactions */}
            {message.reactions && message.reactions.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-1">
                {message.reactions
                  .reduce(
                    (acc, reaction) => {
                      const existing = acc.find(
                        (r) => r.emoji === reaction.emoji,
                      );
                      if (existing) {
                        existing.count++;
                      } else {
                        acc.push({ emoji: reaction.emoji, count: 1 });
                      }
                      return acc;
                    },
                    [] as { emoji: string; count: number }[],
                  )
                  .map((reaction) => (
                    <Button
                      key={reaction.emoji}
                      onClick={() => handleReaction(reaction.emoji)}
                      variant="secondary"
                      size="sm"
                      className="h-6 px-2 text-xs rounded-full"
                    >
                      {reaction.emoji} {reaction.count}
                    </Button>
                  ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
};

export default EnhancedMessage;
