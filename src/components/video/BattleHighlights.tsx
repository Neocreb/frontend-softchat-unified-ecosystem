import React, { useState, useEffect, useRef } from "react";
import {
  Play,
  Pause,
  Download,
  Share2,
  Edit,
  Scissors,
  Sparkles,
  Clock,
  Eye,
  Heart,
  MessageCircle,
  Star,
  TrendingUp,
  Zap,
  Film,
  Settings,
  Volume2,
  VolumeX,
  SkipBack,
  SkipForward,
  RotateCcw,
  CheckCircle,
  X,
  Upload,
  Loader2,
  Award,
  Crown,
  Fire,
  Target,
  Plus,
  Trash2,
  Copy,
  ExternalLink,
  Bookmark,
  Flag,
  Info,
  Calendar,
  Users,
  Trophy,
  Flame,
  Timer,
  ArrowRight,
  ChevronDown,
  ChevronUp,
  Maximize,
  Minimize,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { formatDistanceToNow } from "date-fns";

interface BattleHighlight {
  id: string;
  battleId: string;
  title: string;
  description?: string;
  highlightType: "auto_generated" | "manual" | "user_requested";
  videoUrl: string;
  thumbnailUrl?: string;
  duration: number;
  startTime: number;
  endTime: number;
  featuredMoments: {
    timestamp: number;
    type: "tip" | "reaction" | "combo" | "milestone" | "victory";
    description: string;
    intensity: number;
  }[];
  participants: string[];
  generatedBy: "ai" | "admin" | "user";
  generationAlgorithm?: string;
  confidence?: number;
  isPublic: boolean;
  allowSharing: boolean;
  tags: string[];
  viewCount: number;
  shareCount: number;
  likeCount: number;
  monetizationEnabled: boolean;
  revenueGenerated: number;
  status: "active" | "hidden" | "processing" | "failed";
  processingStatus?: "queued" | "processing" | "completed" | "failed";
  createdAt: string;
  updatedAt: string;
}

interface BattleReplay {
  id: string;
  battleId: string;
  title: string;
  description?: string;
  videoUrl: string;
  thumbnailUrl?: string;
  duration: number;
  participants: {
    id: string;
    username: string;
    displayName: string;
    avatar: string;
    finalScore: number;
    isWinner: boolean;
  }[];
  battleStats: {
    totalTips: number;
    totalViewers: number;
    peakViewers: number;
    totalBets: number;
    engagementRate: number;
  };
  highlights: BattleHighlight[];
  createdAt: string;
}

interface BattleHighlightsProps {
  battleId: string;
  battleReplay?: BattleReplay;
  onClose: () => void;
  isOpen: boolean;
  canEdit?: boolean;
}

const BattleHighlights: React.FC<BattleHighlightsProps> = ({
  battleId,
  battleReplay,
  onClose,
  isOpen,
  canEdit = false,
}) => {
  const { toast } = useToast();
  
  // State
  const [highlights, setHighlights] = useState<BattleHighlight[]>([]);
  const [selectedHighlight, setSelectedHighlight] = useState<BattleHighlight | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [showShareDialog, setShowShareDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [generationProgress, setGenerationProgress] = useState(0);
  
  // Video player state
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(80);
  const [isMuted, setIsMuted] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [isFullscreen, setIsFullscreen] = useState(false);
  
  // Edit state
  const [editData, setEditData] = useState({
    title: "",
    description: "",
    tags: [] as string[],
    isPublic: true,
    allowSharing: true,
    monetizationEnabled: false,
  });
  
  // Video ref
  const videoRef = useRef<HTMLVideoElement>(null);
  const playerContainerRef = useRef<HTMLDivElement>(null);
  
  // Load highlights when component opens
  useEffect(() => {
    if (isOpen) {
      loadBattleHighlights();
    }
  }, [isOpen, battleId]);
  
  // Update video time
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    
    const updateTime = () => setCurrentTime(video.currentTime);
    const updateDuration = () => setDuration(video.duration);
    
    video.addEventListener("timeupdate", updateTime);
    video.addEventListener("loadedmetadata", updateDuration);
    video.addEventListener("ended", () => setIsPlaying(false));
    
    return () => {
      video.removeEventListener("timeupdate", updateTime);
      video.removeEventListener("loadedmetadata", updateDuration);
    };
  }, [selectedHighlight]);
  
  const loadBattleHighlights = async () => {
    try {
      // Mock API call - replace with actual service
      const mockHighlights: BattleHighlight[] = [
        {
          id: "h1",
          battleId,
          title: "Epic Tip Combo",
          description: "Amazing 10-tip combo that changed the battle",
          highlightType: "auto_generated",
          videoUrl: "https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4",
          thumbnailUrl: "https://images.unsplash.com/photo-1611605698335-8b1569810432?w=400",
          duration: 15,
          startTime: 45,
          endTime: 60,
          featuredMoments: [
            {
              timestamp: 47,
              type: "tip",
              description: "First crown gift",
              intensity: 8,
            },
            {
              timestamp: 52,
              type: "combo",
              description: "5-tip combo started",
              intensity: 9,
            },
            {
              timestamp: 58,
              type: "milestone",
              description: "1000 SP milestone reached",
              intensity: 10,
            },
          ],
          participants: ["p1", "p2"],
          generatedBy: "ai",
          generationAlgorithm: "engagement_peak_detection",
          confidence: 92,
          isPublic: true,
          allowSharing: true,
          tags: ["epic", "combo", "tips"],
          viewCount: 1240,
          shareCount: 89,
          likeCount: 567,
          monetizationEnabled: true,
          revenueGenerated: 45.50,
          status: "active",
          processingStatus: "completed",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          id: "h2",
          battleId,
          title: "Victory Moment",
          description: "The final moments that decided the winner",
          highlightType: "auto_generated",
          videoUrl: "https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_2mb.mp4",
          thumbnailUrl: "https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=400",
          duration: 20,
          startTime: 160,
          endTime: 180,
          featuredMoments: [
            {
              timestamp: 165,
              type: "tip",
              description: "Game-changing super rocket",
              intensity: 10,
            },
            {
              timestamp: 175,
              type: "victory",
              description: "Winner announced",
              intensity: 10,
            },
          ],
          participants: ["p1", "p2"],
          generatedBy: "ai",
          generationAlgorithm: "battle_conclusion_detection",
          confidence: 98,
          isPublic: true,
          allowSharing: true,
          tags: ["victory", "finale", "winner"],
          viewCount: 2100,
          shareCount: 156,
          likeCount: 890,
          monetizationEnabled: true,
          revenueGenerated: 78.20,
          status: "active",
          processingStatus: "completed",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      ];
      
      setHighlights(mockHighlights);
      
      // Auto-select first highlight
      if (mockHighlights.length > 0) {
        setSelectedHighlight(mockHighlights[0]);
      }
    } catch (error) {
      console.error("Failed to load battle highlights:", error);
      toast({
        title: "Failed to Load Highlights",
        description: "Please try again later.",
        variant: "destructive",
      });
    }
  };
  
  const generateHighlight = async (type: "auto" | "custom", options?: {
    startTime?: number;
    endTime?: number;
    title?: string;
    description?: string;
  }) => {
    setIsGenerating(true);
    setGenerationProgress(0);
    
    try {
      // Simulate highlight generation progress
      const progressInterval = setInterval(() => {
        setGenerationProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return prev;
          }
          return prev + Math.random() * 15;
        });
      }, 500);
      
      // Mock API call - replace with actual service
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      clearInterval(progressInterval);
      setGenerationProgress(100);
      
      // Add new highlight
      const newHighlight: BattleHighlight = {
        id: `h${Date.now()}`,
        battleId,
        title: options?.title || "Custom Highlight",
        description: options?.description || "User-generated highlight",
        highlightType: "user_requested",
        videoUrl: "https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4",
        thumbnailUrl: "https://images.unsplash.com/photo-1611605698335-8b1569810432?w=400",
        duration: (options?.endTime || 30) - (options?.startTime || 0),
        startTime: options?.startTime || 0,
        endTime: options?.endTime || 30,
        featuredMoments: [],
        participants: ["p1", "p2"],
        generatedBy: "user",
        confidence: 85,
        isPublic: true,
        allowSharing: true,
        tags: ["custom"],
        viewCount: 0,
        shareCount: 0,
        likeCount: 0,
        monetizationEnabled: false,
        revenueGenerated: 0,
        status: "active",
        processingStatus: "completed",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      
      setHighlights(prev => [newHighlight, ...prev]);
      setSelectedHighlight(newHighlight);
      
      toast({
        title: "Highlight Generated!",
        description: "Your custom highlight has been created successfully.",
      });
      
    } catch (error) {
      console.error("Failed to generate highlight:", error);
      toast({
        title: "Generation Failed",
        description: "Failed to generate highlight. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
      setGenerationProgress(0);
    }
  };
  
  const togglePlayback = () => {
    const video = videoRef.current;
    if (!video) return;
    
    if (isPlaying) {
      video.pause();
    } else {
      video.play();
    }
    setIsPlaying(!isPlaying);
  };
  
  const handleSeek = (time: number) => {
    const video = videoRef.current;
    if (!video) return;
    
    video.currentTime = time;
    setCurrentTime(time);
  };
  
  const handleVolumeChange = (value: number[]) => {
    const video = videoRef.current;
    if (!video) return;
    
    const volume = value[0];
    video.volume = volume / 100;
    setVolume(volume);
    setIsMuted(volume === 0);
  };
  
  const toggleMute = () => {
    const video = videoRef.current;
    if (!video) return;
    
    if (isMuted) {
      video.volume = volume / 100;
      setIsMuted(false);
    } else {
      video.volume = 0;
      setIsMuted(true);
    }
  };
  
  const handleSpeedChange = (speed: string) => {
    const video = videoRef.current;
    if (!video) return;
    
    const newSpeed = parseFloat(speed);
    video.playbackRate = newSpeed;
    setPlaybackSpeed(newSpeed);
  };
  
  const toggleFullscreen = () => {
    const container = playerContainerRef.current;
    if (!container) return;
    
    if (!document.fullscreenElement) {
      container.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };
  
  const shareHighlight = (highlight: BattleHighlight) => {
    if (navigator.share) {
      navigator.share({
        title: highlight.title,
        text: highlight.description,
        url: `${window.location.origin}/highlights/${highlight.id}`,
      });
    } else {
      navigator.clipboard.writeText(`${window.location.origin}/highlights/${highlight.id}`);
      toast({
        title: "Link Copied",
        description: "Highlight link copied to clipboard!",
      });
    }
  };
  
  const downloadHighlight = (highlight: BattleHighlight) => {
    const link = document.createElement("a");
    link.href = highlight.videoUrl;
    link.download = `${highlight.title.replace(/\s+/g, "_")}.mp4`;
    link.click();
    
    toast({
      title: "Download Started",
      description: "Your highlight video is downloading...",
    });
  };
  
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };
  
  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };
  
  const getMomentIcon = (type: string) => {
    switch (type) {
      case "tip": return <Crown className="w-4 h-4 text-yellow-400" />;
      case "reaction": return <Heart className="w-4 h-4 text-pink-400" />;
      case "combo": return <Zap className="w-4 h-4 text-purple-400" />;
      case "milestone": return <Target className="w-4 h-4 text-blue-400" />;
      case "victory": return <Trophy className="w-4 h-4 text-green-400" />;
      default: return <Star className="w-4 h-4 text-gray-400" />;
    }
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-gray-900 border-gray-800 text-white max-w-6xl max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Film className="w-5 h-5 text-purple-400" />
            Battle Highlights & Replays
            {battleReplay && (
              <Badge variant="secondary" className="bg-purple-500/20 text-purple-400">
                {highlights.length} highlights
              </Badge>
            )}
          </DialogTitle>
          <DialogDescription>
            Watch auto-generated highlights and create custom clips from the battle
          </DialogDescription>
        </DialogHeader>
        
        <div className="flex gap-4 h-[600px]">
          {/* Video Player */}
          <div className="flex-1 flex flex-col">
            <div
              ref={playerContainerRef}
              className="relative bg-black rounded-lg overflow-hidden flex-1"
            >
              {selectedHighlight ? (
                <>
                  <video
                    ref={videoRef}
                    src={selectedHighlight.videoUrl}
                    className="w-full h-full object-contain"
                    onPlay={() => setIsPlaying(true)}
                    onPause={() => setIsPlaying(false)}
                  />
                  
                  {/* Video Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
                  
                  {/* Play/Pause Button */}
                  {!isPlaying && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Button
                        onClick={togglePlayback}
                        size="icon"
                        className="w-16 h-16 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-sm"
                      >
                        <Play className="w-8 h-8 text-white fill-white ml-1" />
                      </Button>
                    </div>
                  )}
                  
                  {/* Featured Moments Overlay */}
                  {selectedHighlight.featuredMoments.map((moment) => {
                    const position = (moment.timestamp / duration) * 100;
                    return (
                      <TooltipProvider key={moment.timestamp}>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <div
                              className="absolute bottom-16 w-2 h-2 bg-yellow-400 rounded-full cursor-pointer animate-pulse"
                              style={{ left: `${position}%` }}
                              onClick={() => handleSeek(moment.timestamp)}
                            />
                          </TooltipTrigger>
                          <TooltipContent>
                            <div className="flex items-center gap-2">
                              {getMomentIcon(moment.type)}
                              <span>{moment.description}</span>
                            </div>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    );
                  })}
                  
                  {/* Video Controls */}
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
                    {/* Progress Bar */}
                    <div className="mb-3">
                      <Slider
                        value={[currentTime]}
                        onValueChange={(value) => handleSeek(value[0])}
                        max={duration}
                        step={0.1}
                        className="w-full"
                      />
                      <div className="flex justify-between text-xs text-gray-400 mt-1">
                        <span>{formatTime(currentTime)}</span>
                        <span>{formatTime(duration)}</span>
                      </div>
                    </div>
                    
                    {/* Control Buttons */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Button
                          onClick={togglePlayback}
                          variant="ghost"
                          size="icon"
                          className="text-white hover:bg-white/20"
                        >
                          {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
                        </Button>
                        
                        <Button
                          onClick={toggleMute}
                          variant="ghost"
                          size="icon"
                          className="text-white hover:bg-white/20"
                        >
                          {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
                        </Button>
                        
                        <div className="w-20">
                          <Slider
                            value={[isMuted ? 0 : volume]}
                            onValueChange={handleVolumeChange}
                            max={100}
                            step={1}
                            className="w-full"
                          />
                        </div>
                        
                        <Select value={playbackSpeed.toString()} onValueChange={handleSpeedChange}>
                          <SelectTrigger className="w-16 h-8 bg-transparent border-gray-600 text-white text-xs">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="0.5">0.5x</SelectItem>
                            <SelectItem value="0.75">0.75x</SelectItem>
                            <SelectItem value="1">1x</SelectItem>
                            <SelectItem value="1.25">1.25x</SelectItem>
                            <SelectItem value="1.5">1.5x</SelectItem>
                            <SelectItem value="2">2x</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Button
                          onClick={() => shareHighlight(selectedHighlight)}
                          variant="ghost"
                          size="icon"
                          className="text-white hover:bg-white/20"
                        >
                          <Share2 className="w-5 h-5" />
                        </Button>
                        
                        <Button
                          onClick={() => downloadHighlight(selectedHighlight)}
                          variant="ghost"
                          size="icon"
                          className="text-white hover:bg-white/20"
                        >
                          <Download className="w-5 h-5" />
                        </Button>
                        
                        <Button
                          onClick={toggleFullscreen}
                          variant="ghost"
                          size="icon"
                          className="text-white hover:bg-white/20"
                        >
                          {isFullscreen ? <Minimize className="w-5 h-5" /> : <Maximize className="w-5 h-5" />}
                        </Button>
                      </div>
                    </div>
                  </div>
                  
                  {/* Highlight Info */}
                  <div className="absolute top-4 left-4 right-4">
                    <div className="bg-black/60 backdrop-blur-sm rounded-lg p-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-semibold">{selectedHighlight.title}</h3>
                          {selectedHighlight.description && (
                            <p className="text-sm text-gray-400">{selectedHighlight.description}</p>
                          )}
                        </div>
                        
                        <div className="flex items-center gap-4 text-sm">
                          <div className="flex items-center gap-1">
                            <Eye className="w-4 h-4" />
                            <span>{formatNumber(selectedHighlight.viewCount)}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Heart className="w-4 h-4" />
                            <span>{formatNumber(selectedHighlight.likeCount)}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Share2 className="w-4 h-4" />
                            <span>{formatNumber(selectedHighlight.shareCount)}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                <div className="flex items-center justify-center h-full">
                  <div className="text-center">
                    <Film className="w-16 h-16 text-gray-500 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">No Highlight Selected</h3>
                    <p className="text-gray-400">Select a highlight from the list to watch</p>
                  </div>
                </div>
              )}
            </div>
          </div>
          
          {/* Highlights Sidebar */}
          <div className="w-80 flex flex-col">
            <Tabs defaultValue="highlights" className="w-full">
              <TabsList className="grid w-full grid-cols-2 bg-gray-800">
                <TabsTrigger value="highlights">Highlights</TabsTrigger>
                <TabsTrigger value="create">Create</TabsTrigger>
              </TabsList>
              
              {/* Highlights List */}
              <TabsContent value="highlights" className="flex-1">
                <ScrollArea className="h-[520px]">
                  <div className="space-y-3 pr-4">
                    {highlights.map((highlight) => (
                      <Card
                        key={highlight.id}
                        className={cn(
                          "cursor-pointer transition-all",
                          selectedHighlight?.id === highlight.id
                            ? "bg-purple-500/20 border-purple-500"
                            : "bg-gray-800 border-gray-700 hover:bg-gray-750"
                        )}
                        onClick={() => setSelectedHighlight(highlight)}
                      >
                        <CardContent className="p-3">
                          <div className="flex gap-3">
                            <div className="relative w-16 h-12 bg-gray-700 rounded overflow-hidden flex-shrink-0">
                              {highlight.thumbnailUrl && (
                                <img
                                  src={highlight.thumbnailUrl}
                                  alt={highlight.title}
                                  className="w-full h-full object-cover"
                                />
                              )}
                              <div className="absolute bottom-1 right-1 bg-black/80 text-white text-xs px-1 rounded">
                                {formatTime(highlight.duration)}
                              </div>
                            </div>
                            
                            <div className="flex-1 min-w-0">
                              <h4 className="font-medium text-sm line-clamp-1">{highlight.title}</h4>
                              {highlight.description && (
                                <p className="text-xs text-gray-400 line-clamp-2 mt-1">
                                  {highlight.description}
                                </p>
                              )}
                              
                              <div className="flex items-center gap-3 mt-2 text-xs text-gray-500">
                                <div className="flex items-center gap-1">
                                  <Eye className="w-3 h-3" />
                                  <span>{formatNumber(highlight.viewCount)}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <Heart className="w-3 h-3" />
                                  <span>{formatNumber(highlight.likeCount)}</span>
                                </div>
                                {highlight.confidence && (
                                  <div className="flex items-center gap-1">
                                    <Sparkles className="w-3 h-3" />
                                    <span>{highlight.confidence}%</span>
                                  </div>
                                )}
                              </div>
                              
                              <div className="flex items-center gap-2 mt-2">
                                <Badge
                                  variant="secondary"
                                  className={cn(
                                    "text-xs",
                                    highlight.highlightType === "auto_generated" && "bg-blue-500/20 text-blue-400",
                                    highlight.highlightType === "user_requested" && "bg-purple-500/20 text-purple-400",
                                    highlight.highlightType === "manual" && "bg-green-500/20 text-green-400"
                                  )}
                                >
                                  {highlight.highlightType === "auto_generated" && "AI"}
                                  {highlight.highlightType === "user_requested" && "Custom"}
                                  {highlight.highlightType === "manual" && "Manual"}
                                </Badge>
                                
                                {highlight.featuredMoments.length > 0 && (
                                  <Badge variant="secondary" className="bg-yellow-500/20 text-yellow-400 text-xs">
                                    {highlight.featuredMoments.length} moments
                                  </Badge>
                                )}
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                    
                    {highlights.length === 0 && (
                      <div className="text-center py-8">
                        <Film className="w-12 h-12 text-gray-500 mx-auto mb-3" />
                        <h4 className="font-medium mb-2">No Highlights Yet</h4>
                        <p className="text-sm text-gray-400 mb-4">
                          Generate highlights from this battle to get started
                        </p>
                        <Button
                          onClick={() => generateHighlight("auto")}
                          className="bg-purple-600 hover:bg-purple-700"
                          disabled={isGenerating}
                        >
                          <Sparkles className="w-4 h-4 mr-2" />
                          Generate Highlights
                        </Button>
                      </div>
                    )}
                  </div>
                </ScrollArea>
              </TabsContent>
              
              {/* Create Highlights */}
              <TabsContent value="create" className="flex-1">
                <div className="space-y-4 p-4">
                  <div>
                    <h3 className="font-semibold mb-3">Create Custom Highlight</h3>
                    
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="highlight-title">Title</Label>
                        <Input
                          id="highlight-title"
                          value={editData.title}
                          onChange={(e) => setEditData(prev => ({ ...prev, title: e.target.value }))}
                          placeholder="Amazing battle moment"
                          className="mt-1 bg-gray-800 border-gray-700"
                        />
                      </div>
                      
                      <div>
                        <Label htmlFor="highlight-description">Description</Label>
                        <Textarea
                          id="highlight-description"
                          value={editData.description}
                          onChange={(e) => setEditData(prev => ({ ...prev, description: e.target.value }))}
                          placeholder="Describe what makes this moment special..."
                          className="mt-1 bg-gray-800 border-gray-700"
                          rows={3}
                        />
                      </div>
                      
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <Label>Start Time</Label>
                          <Input
                            type="number"
                            placeholder="0"
                            className="mt-1 bg-gray-800 border-gray-700"
                          />
                        </div>
                        <div>
                          <Label>End Time</Label>
                          <Input
                            type="number"
                            placeholder="30"
                            className="mt-1 bg-gray-800 border-gray-700"
                          />
                        </div>
                      </div>
                      
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <Label htmlFor="public">Make Public</Label>
                          <Switch
                            id="public"
                            checked={editData.isPublic}
                            onCheckedChange={(checked) => setEditData(prev => ({ ...prev, isPublic: checked }))}
                          />
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <Label htmlFor="sharing">Allow Sharing</Label>
                          <Switch
                            id="sharing"
                            checked={editData.allowSharing}
                            onCheckedChange={(checked) => setEditData(prev => ({ ...prev, allowSharing: checked }))}
                          />
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <Label htmlFor="monetization">Enable Monetization</Label>
                          <Switch
                            id="monetization"
                            checked={editData.monetizationEnabled}
                            onCheckedChange={(checked) => setEditData(prev => ({ ...prev, monetizationEnabled: checked }))}
                          />
                        </div>
                      </div>
                      
                      <Button
                        onClick={() => generateHighlight("custom", {
                          title: editData.title,
                          description: editData.description,
                          startTime: 0,
                          endTime: 30,
                        })}
                        className="w-full bg-purple-600 hover:bg-purple-700"
                        disabled={isGenerating || !editData.title}
                      >
                        {isGenerating ? (
                          <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            Creating... {generationProgress.toFixed(0)}%
                          </>
                        ) : (
                          <>
                            <Plus className="w-4 h-4 mr-2" />
                            Create Highlight
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                  
                  <Separator className="bg-gray-700" />
                  
                  <div>
                    <h4 className="font-medium mb-3">Quick Generate</h4>
                    <div className="space-y-2">
                      <Button
                        onClick={() => generateHighlight("auto")}
                        variant="outline"
                        className="w-full justify-start"
                        disabled={isGenerating}
                      >
                        <Sparkles className="w-4 h-4 mr-2" />
                        Auto-Generate Best Moments
                      </Button>
                      
                      <Button
                        onClick={() => generateHighlight("auto")}
                        variant="outline"
                        className="w-full justify-start"
                        disabled={isGenerating}
                      >
                        <Crown className="w-4 h-4 mr-2" />
                        Generate Tip Highlights
                      </Button>
                      
                      <Button
                        onClick={() => generateHighlight("auto")}
                        variant="outline"
                        className="w-full justify-start"
                        disabled={isGenerating}
                      >
                        <Trophy className="w-4 h-4 mr-2" />
                        Generate Victory Moments
                      </Button>
                    </div>
                  </div>
                  
                  {isGenerating && (
                    <div className="mt-4">
                      <div className="text-sm text-gray-400 mb-2">Generating highlight...</div>
                      <Progress value={generationProgress} className="h-2" />
                      <div className="text-xs text-gray-500 mt-1 text-center">
                        {generationProgress.toFixed(0)}%
                      </div>
                    </div>
                  )}
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default BattleHighlights;
