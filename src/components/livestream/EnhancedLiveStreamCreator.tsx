import React, { useState, useRef, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Video,
  VideoOff,
  Mic,
  MicOff,
  Settings,
  Users,
  Eye,
  Heart,
  Share2,
  Radio,
  Square,
  Play,
  Camera,
  Loader2,
  CheckCircle,
  AlertCircle,
  Crown,
  Zap,
  Monitor,
  Smartphone,
  RotateCcw,
  Settings2,
  UserCheck,
  UserX,
  Volume2,
  VolumeX,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

interface MediaConstraints {
  video: {
    width: { ideal: number };
    height: { ideal: number };
    facingMode: "user" | "environment";
    frameRate: { ideal: number };
  };
  audio: {
    echoCancellation: boolean;
    noiseSuppression: boolean;
    autoGainControl: boolean;
  };
}

interface StreamSettings {
  quality: "low" | "medium" | "high" | "ultra";
  privacy: "public" | "unlisted" | "private";
  chatEnabled: boolean;
  recordingEnabled: boolean;
  guestsEnabled: boolean;
  moderationEnabled: boolean;
}

interface GuestRequest {
  id: string;
  user: {
    id: string;
    name: string;
    username: string;
    avatar: string;
    verified: boolean;
  };
  timestamp: Date;
  status: "pending" | "approved" | "rejected";
}

export function EnhancedLiveStreamCreator() {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  // Refs
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Stream state
  const [isStreaming, setIsStreaming] = useState(false);
  const [isPreviewing, setIsPreviewing] = useState(false);
  const [isInitializing, setIsInitializing] = useState(false);
  const [videoEnabled, setVideoEnabled] = useState(true);
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [cameraReady, setCameraReady] = useState(false);
  const [permissionStatus, setPermissionStatus] = useState<"granted" | "denied" | "prompt">("prompt");

  // Stream data
  const [streamTitle, setStreamTitle] = useState("");
  const [streamDescription, setStreamDescription] = useState("");
  const [streamCategory, setStreamCategory] = useState("");
  const [streamTags, setStreamTags] = useState("");

  // Settings
  const [settings, setSettings] = useState<StreamSettings>({
    quality: "high",
    privacy: "public",
    chatEnabled: true,
    recordingEnabled: false,
    guestsEnabled: true,
    moderationEnabled: true,
  });

  // Live stats
  const [viewerCount, setViewerCount] = useState(0);
  const [likes, setLikes] = useState(0);
  const [streamDuration, setStreamDuration] = useState(0);
  const [guestRequests, setGuestRequests] = useState<GuestRequest[]>([]);

  // UI state
  const [showEndStreamDialog, setShowEndStreamDialog] = useState(false);
  const [showGuestModal, setShowGuestModal] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [deviceError, setDeviceError] = useState<string | null>(null);

  // Media constraints based on quality
  const getMediaConstraints = useCallback((): MediaConstraints => {
    const qualitySettings = {
      low: { width: 640, height: 480, frameRate: 15 },
      medium: { width: 1280, height: 720, frameRate: 24 },
      high: { width: 1280, height: 720, frameRate: 30 },
      ultra: { width: 1920, height: 1080, frameRate: 30 },
    };

    const quality = qualitySettings[settings.quality];

    return {
      video: {
        width: { ideal: quality.width },
        height: { ideal: quality.height },
        facingMode: "user",
        frameRate: { ideal: quality.frameRate },
      },
      audio: {
        echoCancellation: true,
        noiseSuppression: true,
        autoGainControl: true,
      },
    };
  }, [settings.quality]);

  // Initialize camera stream
  const initializeCamera = useCallback(async () => {
    try {
      setIsInitializing(true);
      setDeviceError(null);

      // Check permissions first
      const permissions = await navigator.permissions.query({ name: 'camera' as PermissionName });
      setPermissionStatus(permissions.state);

      if (permissions.state === 'denied') {
        throw new Error('Camera permission denied. Please enable camera access in your browser settings.');
      }

      const constraints = getMediaConstraints();
      console.log('Requesting media with constraints:', constraints);

      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        streamRef.current = stream;
        setCameraReady(true);
        setIsPreviewing(true);

        // Wait for video to load metadata
        await new Promise((resolve) => {
          if (videoRef.current) {
            videoRef.current.onloadedmetadata = resolve;
          }
        });

        toast({
          title: "Camera Ready! 📹",
          description: "Your camera preview is now active.",
        });
      }
    } catch (error) {
      console.error("Camera initialization error:", error);
      const errorMessage = error instanceof Error ? error.message : "Failed to access camera";
      setDeviceError(errorMessage);
      
      toast({
        title: "Camera Access Failed",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsInitializing(false);
    }
  }, [getMediaConstraints, toast]);

  // Stop camera stream
  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => {
        track.stop();
        console.log(`Stopped ${track.kind} track`);
      });
      streamRef.current = null;
    }
    
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    
    setCameraReady(false);
    setIsPreviewing(false);
  }, []);

  // Toggle video track
  const toggleVideo = useCallback(async () => {
    if (!streamRef.current) return;

    const videoTrack = streamRef.current.getVideoTracks()[0];
    if (videoTrack) {
      videoTrack.enabled = !videoEnabled;
      setVideoEnabled(!videoEnabled);
      
      toast({
        title: videoEnabled ? "Camera Off" : "Camera On",
        description: videoEnabled ? "Your camera is now disabled" : "Your camera is now enabled",
      });
    }
  }, [videoEnabled, toast]);

  // Toggle audio track
  const toggleAudio = useCallback(async () => {
    if (!streamRef.current) return;

    const audioTrack = streamRef.current.getAudioTracks()[0];
    if (audioTrack) {
      audioTrack.enabled = !audioEnabled;
      setAudioEnabled(!audioEnabled);
      
      toast({
        title: audioEnabled ? "Microphone Off" : "Microphone On",
        description: audioEnabled ? "Your microphone is now muted" : "Your microphone is now unmuted",
      });
    }
  }, [audioEnabled, toast]);

  // Start live stream
  const startStream = async () => {
    if (!streamTitle.trim()) {
      toast({
        title: "Title Required",
        description: "Please enter a title for your stream.",
        variant: "destructive",
      });
      return;
    }

    if (!cameraReady) {
      await initializeCamera();
      if (!cameraReady) return;
    }

    try {
      setIsStreaming(true);
      setViewerCount(1);
      setLikes(0);
      setStreamDuration(0);

      // Mock stream creation - in real app, this would call your streaming service
      const streamData = {
        title: streamTitle,
        description: streamDescription,
        category: streamCategory || "general",
        tags: streamTags.split(",").map(tag => tag.trim()).filter(Boolean),
        settings,
        streamerId: user?.id,
        streamerName: user?.name,
      };

      console.log("Stream started with data:", streamData);

      toast({
        title: "🔴 Stream Started!",
        description: "You're now live! Viewers can join your stream.",
      });

      // Navigate to live/battle tab to show live stream
      navigate("/app/live");
    } catch (error) {
      console.error("Error starting stream:", error);
      toast({
        title: "Stream Error",
        description: "Failed to start stream. Please try again.",
        variant: "destructive",
      });
      setIsStreaming(false);
    }
  };

  // End stream with confirmation
  const endStream = async () => {
    try {
      setIsStreaming(false);
      stopCamera();
      
      toast({
        title: "Stream Ended",
        description: `Your stream lasted ${formatDuration(streamDuration)} with ${viewerCount} viewers.`,
      });

      // Reset form
      setStreamTitle("");
      setStreamDescription("");
      setStreamCategory("");
      setStreamTags("");
      setViewerCount(0);
      setLikes(0);
      setStreamDuration(0);
      setGuestRequests([]);
    } catch (error) {
      console.error("Error ending stream:", error);
    }
  };

  // Stream duration timer
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isStreaming) {
      interval = setInterval(() => {
        setStreamDuration((prev) => prev + 1);
        // Simulate viewer changes
        setViewerCount((prev) => Math.max(0, prev + Math.floor(Math.random() * 5) - 2));
        // Simulate occasional likes
        if (Math.random() < 0.1) {
          setLikes((prev) => prev + 1);
        }
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isStreaming]);

  // Simulate guest requests
  useEffect(() => {
    if (!isStreaming || !settings.guestsEnabled) return;

    const interval = setInterval(() => {
      if (Math.random() < 0.3 && guestRequests.length < 3) {
        const mockGuest: GuestRequest = {
          id: `guest-${Date.now()}`,
          user: {
            id: `user-${Date.now()}`,
            name: `User ${Math.floor(Math.random() * 1000)}`,
            username: `user${Math.floor(Math.random() * 1000)}`,
            avatar: `https://i.pravatar.cc/150?u=${Math.random()}`,
            verified: Math.random() > 0.7,
          },
          timestamp: new Date(),
          status: "pending",
        };
        setGuestRequests(prev => [...prev, mockGuest]);
      }
    }, 10000); // Check every 10 seconds

    return () => clearInterval(interval);
  }, [isStreaming, settings.guestsEnabled, guestRequests.length]);

  // Handle guest request
  const handleGuestRequest = (guestId: string, action: "approve" | "reject") => {
    setGuestRequests(prev => 
      prev.map(guest => 
        guest.id === guestId 
          ? { ...guest, status: action === "approve" ? "approved" : "rejected" }
          : guest
      )
    );

    const guest = guestRequests.find(g => g.id === guestId);
    if (guest) {
      toast({
        title: action === "approve" ? "Guest Approved ✅" : "Guest Rejected ❌",
        description: `${guest.user.name} ${action === "approve" ? "can now join" : "was rejected"}`,
      });
    }
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, [stopCamera]);

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    const hours = Math.floor(mins / 60);
    
    if (hours > 0) {
      return `${hours}:${(mins % 60).toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const formatViewerCount = (count: number) => {
    if (count >= 1000) return `${(count / 1000).toFixed(1)}K`;
    return count.toString();
  };

  const categories = [
    "Technology", "Gaming", "Music", "Art", "Education", "Business",
    "Finance", "Fitness", "Cooking", "Travel", "Lifestyle", "Other"
  ];

  const pendingGuests = guestRequests.filter(g => g.status === "pending");

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Radio className="h-5 w-5" />
            {isStreaming ? "Live Streaming" : "Start Live Stream"}
            {isStreaming && (
              <Badge className="bg-red-500 text-white animate-pulse">
                LIVE • {formatDuration(streamDuration)}
              </Badge>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Camera Preview */}
          <div className="relative bg-gray-900 rounded-lg overflow-hidden aspect-video">
            <video
              ref={videoRef}
              autoPlay
              muted
              playsInline
              className="w-full h-full object-cover"
            />
            <canvas ref={canvasRef} className="hidden" />

            {/* Camera not ready overlay */}
            {!isPreviewing && !isInitializing && (
              <div className="absolute inset-0 flex items-center justify-center bg-gray-800">
                <div className="text-center text-white">
                  <Camera className="h-16 w-16 mx-auto mb-4 opacity-50" />
                  <p className="text-lg mb-4">Camera Preview</p>
                  {deviceError && (
                    <div className="mb-4 p-3 bg-red-500/20 border border-red-500 rounded-lg max-w-md">
                      <div className="flex items-center gap-2 text-red-400 mb-2">
                        <AlertCircle className="w-4 h-4" />
                        <span className="font-medium">Camera Error</span>
                      </div>
                      <p className="text-sm text-red-300">{deviceError}</p>
                    </div>
                  )}
                  <Button onClick={initializeCamera} disabled={isInitializing}>
                    {isInitializing ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Initializing...
                      </>
                    ) : (
                      <>
                        <Play className="w-4 h-4 mr-2" />
                        Start Camera Preview
                      </>
                    )}
                  </Button>
                </div>
              </div>
            )}

            {/* Loading overlay */}
            {isInitializing && (
              <div className="absolute inset-0 flex items-center justify-center bg-gray-800/90">
                <div className="text-center text-white">
                  <Loader2 className="h-12 w-12 mx-auto mb-4 animate-spin" />
                  <p className="text-lg">Setting up camera...</p>
                  <p className="text-sm opacity-75">Please allow camera access</p>
                </div>
              </div>
            )}

            {/* Stream overlay controls */}
            {isPreviewing && (
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/30">
                {/* Live stats */}
                {isStreaming && (
                  <div className="absolute top-4 left-4 right-4 flex justify-between items-start">
                    <div className="flex items-center gap-2">
                      <Badge className="bg-red-500 text-white animate-pulse">
                        🔴 LIVE
                      </Badge>
                      <Badge variant="secondary" className="flex items-center gap-1">
                        <Eye className="h-3 w-3" />
                        {formatViewerCount(viewerCount)}
                      </Badge>
                      <Badge variant="secondary" className="flex items-center gap-1">
                        <Heart className="h-3 w-3" />
                        {likes}
                      </Badge>
                    </div>
                    {pendingGuests.length > 0 && settings.guestsEnabled && (
                      <Button
                        onClick={() => setShowGuestModal(true)}
                        size="sm"
                        className="bg-yellow-500 hover:bg-yellow-600 text-black"
                      >
                        <Users className="w-4 h-4 mr-1" />
                        {pendingGuests.length} Guest{pendingGuests.length > 1 ? 's' : ''}
                      </Button>
                    )}
                  </div>
                )}

                {/* Bottom controls */}
                <div className="absolute bottom-4 left-4 right-4 flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <Button
                      onClick={toggleVideo}
                      variant="secondary"
                      size="sm"
                      className={cn(
                        "opacity-90 backdrop-blur-sm",
                        !videoEnabled && "bg-red-500 text-white hover:bg-red-600"
                      )}
                    >
                      {videoEnabled ? <Video className="h-4 w-4" /> : <VideoOff className="h-4 w-4" />}
                    </Button>
                    <Button
                      onClick={toggleAudio}
                      variant="secondary"
                      size="sm"
                      className={cn(
                        "opacity-90 backdrop-blur-sm",
                        !audioEnabled && "bg-red-500 text-white hover:bg-red-600"
                      )}
                    >
                      {audioEnabled ? <Mic className="h-4 w-4" /> : <MicOff className="h-4 w-4" />}
                    </Button>
                  </div>

                  <div className="flex items-center gap-2">
                    <Button
                      onClick={() => setShowSettingsModal(true)}
                      variant="secondary"
                      size="sm"
                      className="opacity-90 backdrop-blur-sm"
                    >
                      <Settings className="h-4 w-4" />
                    </Button>
                    {isStreaming && (
                      <Button
                        onClick={() => setShowEndStreamDialog(true)}
                        variant="destructive"
                        size="sm"
                        className="opacity-90 backdrop-blur-sm"
                      >
                        <Square className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Stream Information Form */}
          {!isStreaming && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="title" className="text-sm font-medium mb-2 block">
                  Stream Title *
                </Label>
                <Input
                  id="title"
                  value={streamTitle}
                  onChange={(e) => setStreamTitle(e.target.value)}
                  placeholder="What's your stream about?"
                  maxLength={100}
                  className="text-base"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  {streamTitle.length}/100 characters
                </p>
              </div>

              <div>
                <Label htmlFor="description" className="text-sm font-medium mb-2 block">
                  Description
                </Label>
                <Textarea
                  id="description"
                  value={streamDescription}
                  onChange={(e) => setStreamDescription(e.target.value)}
                  placeholder="Tell viewers what to expect..."
                  rows={3}
                  maxLength={500}
                  className="text-base resize-none"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  {streamDescription.length}/500 characters
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="category" className="text-sm font-medium mb-2 block">
                    Category
                  </Label>
                  <Select value={streamCategory} onValueChange={setStreamCategory}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category} value={category.toLowerCase()}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="tags" className="text-sm font-medium mb-2 block">
                    Tags
                  </Label>
                  <Input
                    id="tags"
                    value={streamTags}
                    onChange={(e) => setStreamTags(e.target.value)}
                    placeholder="tag1, tag2, tag3"
                    className="text-base"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Stream Info (when live) */}
          {isStreaming && (
            <Card className="bg-gradient-to-r from-red-500/10 to-purple-500/10 border-red-500/20">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-lg text-red-400">
                      🔴 {streamTitle}
                    </h3>
                    <p className="text-gray-400 text-sm">{streamDescription}</p>
                    <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                      <span className="flex items-center gap-1">
                        <Users className="h-4 w-4" />
                        {formatViewerCount(viewerCount)} viewers
                      </span>
                      <span className="flex items-center gap-1">
                        <Heart className="h-4 w-4" />
                        {likes} likes
                      </span>
                      <span>Duration: {formatDuration(streamDuration)}</span>
                    </div>
                  </div>
                  <Badge className="bg-red-500 text-white text-lg px-4 py-2">
                    LIVE
                  </Badge>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-2">
            {!isStreaming ? (
              <>
                {!isPreviewing ? (
                  <Button
                    onClick={initializeCamera}
                    variant="outline"
                    className="flex-1"
                    disabled={isInitializing}
                  >
                    {isInitializing ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Initializing...
                      </>
                    ) : (
                      <>
                        <Play className="h-4 w-4 mr-2" />
                        Start Camera Preview
                      </>
                    )}
                  </Button>
                ) : (
                  <Button
                    onClick={stopCamera}
                    variant="outline"
                    className="flex-1"
                  >
                    <Square className="h-4 w-4 mr-2" />
                    Stop Preview
                  </Button>
                )}
                <Button
                  onClick={startStream}
                  className="flex-1 bg-red-500 hover:bg-red-600"
                  disabled={!streamTitle.trim() || !cameraReady}
                >
                  <Radio className="h-4 w-4 mr-2" />
                  Go Live
                </Button>
              </>
            ) : (
              <Button
                onClick={() => setShowEndStreamDialog(true)}
                variant="destructive"
                className="flex-1"
              >
                <Square className="h-4 w-4 mr-2" />
                End Stream
              </Button>
            )}
          </div>

          {/* Quick Tips */}
          <div className="bg-blue-50 dark:bg-blue-950/30 rounded-lg p-4">
            <div className="flex items-start gap-2">
              <Zap className="h-5 w-5 text-blue-500 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-1">
                  Streaming Tips
                </h4>
                <ul className="text-sm text-blue-700 dark:text-blue-300 space-y-1">
                  <li>• Ensure good lighting and stable internet connection</li>
                  <li>• Test your camera and microphone before going live</li>
                  <li>• Interact with your audience through chat</li>
                  <li>• Choose a clear, descriptive title for better discovery</li>
                </ul>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* End Stream Confirmation Dialog */}
      <AlertDialog open={showEndStreamDialog} onOpenChange={setShowEndStreamDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>End Live Stream?</AlertDialogTitle>
            <AlertDialogDescription>
              Your stream will end immediately. You currently have {viewerCount} viewers watching.
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={endStream} className="bg-red-600 hover:bg-red-700">
              End Stream
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Guest Requests Modal */}
      <Dialog open={showGuestModal} onOpenChange={setShowGuestModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Guest Requests</DialogTitle>
            <DialogDescription>
              Approve or reject viewers who want to join your stream
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3 max-h-64 overflow-y-auto">
            {pendingGuests.map((guest) => (
              <div key={guest.id} className="flex items-center gap-3 p-3 border rounded-lg">
                <img
                  src={guest.user.avatar}
                  alt={guest.user.name}
                  className="w-10 h-10 rounded-full"
                />
                <div className="flex-1">
                  <div className="flex items-center gap-1">
                    <span className="font-medium">{guest.user.name}</span>
                    {guest.user.verified && (
                      <Badge variant="secondary" className="text-xs">✓</Badge>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground">@{guest.user.username}</p>
                </div>
                <div className="flex gap-1">
                  <Button
                    onClick={() => handleGuestRequest(guest.id, "approve")}
                    size="sm"
                    className="bg-green-600 hover:bg-green-700 px-2"
                  >
                    <UserCheck className="w-4 h-4" />
                  </Button>
                  <Button
                    onClick={() => handleGuestRequest(guest.id, "reject")}
                    size="sm"
                    variant="destructive"
                    className="px-2"
                  >
                    <UserX className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
            {pendingGuests.length === 0 && (
              <div className="text-center py-6 text-muted-foreground">
                <Users className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p>No pending guest requests</p>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Settings Modal */}
      <Dialog open={showSettingsModal} onOpenChange={setShowSettingsModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Stream Settings</DialogTitle>
            <DialogDescription>
              Configure your stream quality and features
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label className="text-sm font-medium">Quality</Label>
              <Select
                value={settings.quality}
                onValueChange={(value: any) => setSettings(prev => ({ ...prev, quality: value }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low (480p)</SelectItem>
                  <SelectItem value="medium">Medium (720p)</SelectItem>
                  <SelectItem value="high">High (720p 30fps)</SelectItem>
                  <SelectItem value="ultra">Ultra (1080p)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label className="text-sm font-medium">Privacy</Label>
              <Select
                value={settings.privacy}
                onValueChange={(value: any) => setSettings(prev => ({ ...prev, privacy: value }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="public">Public</SelectItem>
                  <SelectItem value="unlisted">Unlisted</SelectItem>
                  <SelectItem value="private">Private</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label htmlFor="chat">Enable Chat</Label>
                <Switch
                  id="chat"
                  checked={settings.chatEnabled}
                  onCheckedChange={(checked) => setSettings(prev => ({ ...prev, chatEnabled: checked }))}
                />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="recording">Allow Recording</Label>
                <Switch
                  id="recording"
                  checked={settings.recordingEnabled}
                  onCheckedChange={(checked) => setSettings(prev => ({ ...prev, recordingEnabled: checked }))}
                />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="guests">Enable Guests</Label>
                <Switch
                  id="guests"
                  checked={settings.guestsEnabled}
                  onCheckedChange={(checked) => setSettings(prev => ({ ...prev, guestsEnabled: checked }))}
                />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="moderation">Auto Moderation</Label>
                <Switch
                  id="moderation"
                  checked={settings.moderationEnabled}
                  onCheckedChange={(checked) => setSettings(prev => ({ ...prev, moderationEnabled: checked }))}
                />
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default EnhancedLiveStreamCreator;
