import { useState, useEffect, useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize,
  Minimize,
  Heart,
  Share2,
  Users,
  Send,
  Settings,
  MoreVertical,
  Gift,
  Flag,
  UserPlus,
  Eye,
  Dot,
} from "lucide-react";
import {
  LiveStream,
  StreamMessage,
  liveStreamingService,
} from "@/services/liveStreamingService";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/components/ui/use-toast";
import { cn } from "@/lib/utils";

interface LiveStreamPlayerProps {
  stream: LiveStream;
  autoplay?: boolean;
  showChat?: boolean;
  className?: string;
}

export function LiveStreamPlayer({
  stream,
  autoplay = false,
  showChat = true,
  className,
}: LiveStreamPlayerProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(autoplay);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [volume, setVolume] = useState(1);
  const [isLiked, setIsLiked] = useState(false);
  const [isFollowing, setIsFollowing] = useState(false);
  const [messages, setMessages] = useState<StreamMessage[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [viewerCount, setViewerCount] = useState(stream.viewerCount);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Load initial messages
    loadMessages();

    // Join stream
    if (user?.id) {
      liveStreamingService.joinStream(stream.id, user.id);
    }

    // Simulate real-time updates
    const interval = setInterval(() => {
      // Simulate viewer count changes
      setViewerCount((prev) => prev + Math.floor(Math.random() * 10) - 5);

      // Simulate new messages
      if (Math.random() < 0.3) {
        const mockMessage: StreamMessage = {
          id: `msg-${Date.now()}`,
          streamId: stream.id,
          userId: `user-${Math.random()}`,
          username: `Viewer${Math.floor(Math.random() * 1000)}`,
          userAvatar: "",
          message: ["Great stream!", "Amazing!", "Keep it up!", "Love this!"][
            Math.floor(Math.random() * 4)
          ],
          timestamp: new Date(),
          type: "message",
        };
        setMessages((prev) => [...prev, mockMessage]);
      }
    }, 5000);

    return () => {
      clearInterval(interval);
      if (user?.id) {
        liveStreamingService.leaveStream(stream.id, user.id);
      }
    };
  }, [stream.id, user?.id]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const loadMessages = async () => {
    try {
      const streamMessages = await liveStreamingService.getStreamMessages(
        stream.id,
      );
      setMessages(streamMessages);
    } catch (error) {
      console.error("Error loading messages:", error);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      videoRef.current?.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  const handleVolumeChange = (newVolume: number) => {
    if (videoRef.current) {
      videoRef.current.volume = newVolume;
      setVolume(newVolume);
      setIsMuted(newVolume === 0);
    }
  };

  const handleLike = async () => {
    try {
      await liveStreamingService.reactToStream(stream.id, "like");
      setIsLiked(!isLiked);
      toast({
        title: isLiked ? "Like removed" : "Stream liked!",
        description: isLiked ? "" : "Thanks for your support!",
      });
    } catch (error) {
      console.error("Error liking stream:", error);
    }
  };

  const handleShare = async () => {
    try {
      await liveStreamingService.reactToStream(stream.id, "share");
      if (navigator.share) {
        await navigator.share({
          title: stream.title,
          text: `Check out this live stream: ${stream.title}`,
          url: window.location.href,
        });
      } else {
        navigator.clipboard.writeText(window.location.href);
        toast({
          title: "Link copied!",
          description: "Stream link copied to clipboard",
        });
      }
    } catch (error) {
      console.error("Error sharing stream:", error);
    }
  };

  const handleFollow = () => {
    setIsFollowing(!isFollowing);
    toast({
      title: isFollowing ? "Unfollowed" : "Following!",
      description: isFollowing
        ? ""
        : `You're now following ${stream.streamerName}`,
    });
  };

  const sendMessage = async () => {
    if (!newMessage.trim() || !user) return;

    try {
      const message = await liveStreamingService.sendMessage(stream.id, {
        streamId: stream.id,
        userId: user.id,
        username: user.name || "Anonymous",
        userAvatar: user.avatar || "",
        message: newMessage.trim(),
        type: "message",
      });

      setMessages((prev) => [...prev, message]);
      setNewMessage("");
    } catch (error) {
      console.error("Error sending message:", error);
      toast({
        title: "Error",
        description: "Failed to send message",
      });
    }
  };

  const formatViewerCount = (count: number) => {
    if (count >= 1000000) return `${(count / 1000000).toFixed(1)}M`;
    if (count >= 1000) return `${(count / 1000).toFixed(1)}K`;
    return count.toString();
  };

  const formatDuration = (startTime: Date) => {
    const minutes = Math.floor((Date.now() - startTime.getTime()) / 60000);
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0
      ? `${hours}:${mins.toString().padStart(2, "0")}`
      : `${mins}m`;
  };

  return (
    <div className={cn("bg-black rounded-lg overflow-hidden", className)}>
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-0 h-[600px]">
        {/* Video Player */}
        <div className="lg:col-span-3 relative bg-black">
          {/* Video Element */}
          <video
            ref={videoRef}
            className="w-full h-full object-cover"
            autoPlay={autoplay}
            muted={isMuted}
            poster={stream.thumbnailUrl}
          >
            <source src={stream.streamUrl} type="application/x-mpegURL" />
            Your browser does not support the video tag.
          </video>

          {/* Video Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/30">
            {/* Top Controls */}
            <div className="absolute top-4 left-4 right-4 flex justify-between items-start">
              <div className="flex items-center gap-2">
                <Badge className="bg-red-500 text-white flex items-center gap-1">
                  <Dot className="h-4 w-4 animate-pulse" />
                  LIVE
                </Badge>
                <Badge variant="secondary" className="flex items-center gap-1">
                  <Eye className="h-3 w-3" />
                  {formatViewerCount(viewerCount)}
                </Badge>
                <Badge variant="secondary">
                  {formatDuration(stream.startedAt)}
                </Badge>
              </div>
              <Button variant="secondary" size="sm" className="opacity-80">
                <Settings className="h-4 w-4" />
              </Button>
            </div>

            {/* Center Play Button */}
            {!isPlaying && (
              <div className="absolute inset-0 flex items-center justify-center">
                <Button
                  onClick={togglePlay}
                  size="lg"
                  className="rounded-full w-16 h-16 bg-white/20 hover:bg-white/30 backdrop-blur-sm"
                >
                  <Play className="h-8 w-8" />
                </Button>
              </div>
            )}

            {/* Bottom Controls */}
            <div className="absolute bottom-4 left-4 right-4 flex justify-between items-end">
              {/* Stream Info */}
              <div className="flex-1 min-w-0">
                <h2 className="text-white font-semibold text-lg truncate mb-1">
                  {stream.title}
                </h2>
                <div className="flex items-center gap-2">
                  <Avatar className="h-8 w-8 border-2 border-white">
                    <AvatarImage src={stream.streamerAvatar} />
                    <AvatarFallback>
                      {stream.streamerName.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-white font-medium">
                    {stream.streamerName}
                  </span>
                  <Button
                    onClick={handleFollow}
                    variant={isFollowing ? "secondary" : "default"}
                    size="sm"
                    className="ml-2"
                  >
                    <UserPlus className="h-3 w-3 mr-1" />
                    {isFollowing ? "Following" : "Follow"}
                  </Button>
                </div>
              </div>

              {/* Player Controls */}
              <div className="flex items-center gap-2 ml-4">
                <Button
                  onClick={togglePlay}
                  variant="secondary"
                  size="sm"
                  className="opacity-80"
                >
                  {isPlaying ? (
                    <Pause className="h-4 w-4" />
                  ) : (
                    <Play className="h-4 w-4" />
                  )}
                </Button>
                <Button
                  onClick={toggleMute}
                  variant="secondary"
                  size="sm"
                  className="opacity-80"
                >
                  {isMuted ? (
                    <VolumeX className="h-4 w-4" />
                  ) : (
                    <Volume2 className="h-4 w-4" />
                  )}
                </Button>
                <Button
                  onClick={toggleFullscreen}
                  variant="secondary"
                  size="sm"
                  className="opacity-80"
                >
                  {isFullscreen ? (
                    <Minimize className="h-4 w-4" />
                  ) : (
                    <Maximize className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Chat Sidebar */}
        {showChat && (
          <div className="bg-white border-l flex flex-col">
            {/* Chat Header */}
            <div className="p-4 border-b">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold">Live Chat</h3>
                <div className="flex items-center gap-2">
                  <Button
                    onClick={handleLike}
                    variant="ghost"
                    size="sm"
                    className={cn(isLiked && "text-red-500")}
                  >
                    <Heart
                      className={cn("h-4 w-4", isLiked && "fill-current")}
                    />
                  </Button>
                  <Button onClick={handleShare} variant="ghost" size="sm">
                    <Share2 className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Users className="h-4 w-4" />
                {formatViewerCount(viewerCount)} viewers
              </div>
            </div>

            {/* Messages */}
            <ScrollArea className="flex-1 p-4">
              <div className="space-y-3">
                {messages.map((message) => (
                  <div key={message.id} className="flex gap-2">
                    <Avatar className="h-6 w-6 flex-shrink-0">
                      <AvatarImage src={message.userAvatar} />
                      <AvatarFallback className="text-xs">
                        {message.username.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-baseline gap-2">
                        <span className="font-medium text-sm text-gray-900">
                          {message.username}
                        </span>
                        <span className="text-xs text-gray-500">
                          {message.timestamp.toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                      </div>
                      <p className="text-sm text-gray-700 break-words">
                        {message.message}
                      </p>
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>
            </ScrollArea>

            {/* Message Input */}
            <div className="p-4 border-t">
              <div className="flex gap-2">
                <Input
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Say something..."
                  onKeyPress={(e) => e.key === "Enter" && sendMessage()}
                  className="flex-1"
                />
                <Button
                  onClick={sendMessage}
                  size="sm"
                  disabled={!newMessage.trim()}
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex items-center gap-2 mt-2">
                <Button variant="outline" size="sm" className="flex-1 gap-1">
                  <Gift className="h-3 w-3" />
                  Gift
                </Button>
                <Button variant="outline" size="sm">
                  <Flag className="h-3 w-3" />
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
