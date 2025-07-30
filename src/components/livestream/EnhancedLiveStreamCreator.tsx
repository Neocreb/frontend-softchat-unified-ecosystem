import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Switch } from "@/components/ui/switch";
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
  Video,
  VideoOff,
  Mic,
  MicOff,
  Settings,
  Users,
  Eye,
  Heart,
  Share2,
  Monitor,
  Smartphone,
  Globe,
  Lock,
  Radio,
  Square,
  Play,
  Camera,
  Upload,
  Zap,
  AlertCircle,
  CheckCircle,
  Calendar,
  Crown,
  BarChart3,
  Volume2,
  VolumeX,
  MessageCircle,
  Gift,
  X,
  Maximize,
  RotateCcw,
  Sun,
  Aperture,
  Focus,
  Palette,
  Sliders,
  Filter,
  Layers,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

interface LiveStream {
  id?: string;
  title: string;
  description: string;
  category?: string;
  isPrivate?: boolean;
  scheduledTime?: Date;
}

interface EnhancedLiveStreamCreatorProps {
  onStreamStart?: (stream: LiveStream) => void;
  onStreamEnd?: () => void;
  className?: string;
}

export function EnhancedLiveStreamCreator({
  onStreamStart,
  onStreamEnd,
  className,
}: EnhancedLiveStreamCreatorProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  
  // Stream setup state
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("general");
  const [isPrivate, setIsPrivate] = useState(false);
  const [isScheduled, setIsScheduled] = useState(false);
  const [scheduledTime, setScheduledTime] = useState("");
  
  // Live streaming state
  const [isStreaming, setIsStreaming] = useState(false);
  const [isSettingUp, setIsSettingUp] = useState(false);
  const [streamDuration, setStreamDuration] = useState(0);
  const [viewerCount, setViewerCount] = useState(0);
  const [likeCount, setLikeCount] = useState(0);
  
  // Media controls
  const [isVideoOn, setIsVideoOn] = useState(true);
  const [isAudioOn, setIsAudioOn] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [stream, setStream] = useState<MediaStream | null>(null);
  
  // Camera settings
  const [selectedCamera, setSelectedCamera] = useState<string>("");
  const [selectedMicrophone, setSelectedMicrophone] = useState<string>("");
  const [resolution, setResolution] = useState("1080p");
  const [frameRate, setFrameRate] = useState("30");
  const [brightness, setBrightness] = useState([50]);
  const [contrast, setContrast] = useState([50]);
  const [saturation, setSaturation] = useState([50]);
  
  // Live stream interface state
  const [showSettings, setShowSettings] = useState(false);
  const [showStats, setShowStats] = useState(false);
  const [comments, setComments] = useState<Array<{
    id: string;
    user: string;
    text: string;
    timestamp: Date;
  }>>([]);
  const [newComment, setNewComment] = useState("");
  
  // Refs
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  // Available devices
  const [cameras, setCameras] = useState<MediaDeviceInfo[]>([]);
  const [microphones, setMicrophones] = useState<MediaDeviceInfo[]>([]);

  // Initialize media devices
  useEffect(() => {
    const getDevices = async () => {
      try {
        const devices = await navigator.mediaDevices.enumerateDevices();
        const videoDevices = devices.filter(device => device.kind === 'videoinput');
        const audioDevices = devices.filter(device => device.kind === 'audioinput');
        
        setCameras(videoDevices);
        setMicrophones(audioDevices);
        
        if (videoDevices.length > 0) setSelectedCamera(videoDevices[0].deviceId);
        if (audioDevices.length > 0) setSelectedMicrophone(audioDevices[0].deviceId);
      } catch (error) {
        console.error('Error getting devices:', error);
      }
    };

    getDevices();
  }, []);

  // Start camera preview
  useEffect(() => {
    const startPreview = async () => {
      if (!selectedCamera) return;
      
      try {
        const mediaStream = await navigator.mediaDevices.getUserMedia({
          video: {
            deviceId: selectedCamera,
            width: { ideal: 1920 },
            height: { ideal: 1080 },
            frameRate: { ideal: parseInt(frameRate) }
          },
          audio: {
            deviceId: selectedMicrophone,
            echoCancellation: true,
            noiseSuppression: true,
          }
        });
        
        setStream(mediaStream);
        if (videoRef.current) {
          videoRef.current.srcObject = mediaStream;
        }
      } catch (error) {
        console.error('Error starting preview:', error);
        toast({
          title: "Camera Error",
          description: "Failed to access camera and microphone",
          variant: "destructive",
        });
      }
    };

    if (selectedCamera && selectedMicrophone) {
      startPreview();
    }

    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [selectedCamera, selectedMicrophone, frameRate]);

  // Stream timer
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isStreaming) {
      interval = setInterval(() => {
        setStreamDuration(prev => prev + 1);
        // Simulate viewer growth
        setViewerCount(prev => prev + Math.floor(Math.random() * 3));
        setLikeCount(prev => prev + Math.floor(Math.random() * 2));
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isStreaming]);

  const handleStartStream = async () => {
    if (!title.trim()) {
      toast({
        title: "Title Required",
        description: "Please enter a stream title",
        variant: "destructive",
      });
      return;
    }

    setIsSettingUp(true);
    
    try {
      // Simulate stream setup
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setIsStreaming(true);
      setIsSettingUp(false);
      setViewerCount(1);
      
      const streamData: LiveStream = {
        title,
        description,
        category,
        isPrivate,
        scheduledTime: isScheduled ? new Date(scheduledTime) : undefined,
      };

      onStreamStart?.(streamData);
      
      toast({
        title: "Stream Started! 🔴",
        description: "You're now live!",
      });
    } catch (error) {
      setIsSettingUp(false);
      toast({
        title: "Failed to Start Stream",
        description: "Please try again",
        variant: "destructive",
      });
    }
  };

  const handleEndStream = () => {
    setIsStreaming(false);
    setStreamDuration(0);
    setViewerCount(0);
    setLikeCount(0);
    
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
    }
    
    onStreamEnd?.();
    
    toast({
      title: "Stream Ended",
      description: `You were live for ${formatDuration(streamDuration)}`,
    });
  };

  const toggleVideo = () => {
    if (stream) {
      const videoTrack = stream.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = !videoTrack.enabled;
        setIsVideoOn(videoTrack.enabled);
      }
    }
  };

  const toggleAudio = () => {
    if (stream) {
      const audioTrack = stream.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !audioTrack.enabled;
        setIsAudioOn(audioTrack.enabled);
      }
    }
  };

  const addComment = () => {
    if (!newComment.trim()) return;
    
    const comment = {
      id: Date.now().toString(),
      user: 'StreamViewer' + Math.floor(Math.random() * 1000),
      text: newComment,
      timestamp: new Date(),
    };
    
    setComments(prev => [comment, ...prev.slice(0, 9)]); // Keep last 10 comments
    setNewComment("");
  };

  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  // Live streaming interface
  if (isStreaming) {
    return (
      <div className="fixed inset-0 bg-black z-50 flex flex-col">
        {/* Live Stream Header */}
        <div className="bg-gradient-to-r from-red-600 to-pink-600 p-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Badge className="bg-red-500 text-white animate-pulse">
              <Radio className="w-3 h-3 mr-1" />
              LIVE
            </Badge>
            <div className="text-white">
              <div className="font-bold">{title}</div>
              <div className="text-sm opacity-90">{formatDuration(streamDuration)}</div>
            </div>
          </div>
          
          <div className="flex items-center gap-4 text-white">
            <div className="flex items-center gap-2">
              <Eye className="w-4 h-4" />
              <span>{viewerCount}</span>
            </div>
            <div className="flex items-center gap-2">
              <Heart className="w-4 h-4" />
              <span>{likeCount}</span>
            </div>
            <Button
              onClick={handleEndStream}
              variant="destructive"
              size="sm"
            >
              <Square className="w-4 h-4 mr-2" />
              End Stream
            </Button>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex">
          {/* Video Preview */}
          <div className="flex-1 relative bg-gray-900">
            <video
              ref={videoRef}
              autoPlay
              muted
              className="w-full h-full object-cover"
              style={{
                filter: `brightness(${brightness[0]}%) contrast(${contrast[0]}%) saturate(${saturation[0]}%)`
              }}
            />
            
            {!isVideoOn && (
              <div className="absolute inset-0 bg-gray-800 flex items-center justify-center">
                <VideoOff className="w-16 h-16 text-gray-400" />
              </div>
            )}

            {/* Stream Controls Overlay */}
            <div className="absolute bottom-4 left-4 flex gap-2">
              <Button
                onClick={toggleVideo}
                size="sm"
                variant={isVideoOn ? "default" : "destructive"}
              >
                {isVideoOn ? <Video className="w-4 h-4" /> : <VideoOff className="w-4 h-4" />}
              </Button>
              
              <Button
                onClick={toggleAudio}
                size="sm"
                variant={isAudioOn ? "default" : "destructive"}
              >
                {isAudioOn ? <Mic className="w-4 h-4" /> : <MicOff className="w-4 h-4" />}
              </Button>
              
              <Button
                onClick={() => setIsMuted(!isMuted)}
                size="sm"
                variant="ghost"
                className="text-white"
              >
                {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
              </Button>
              
              <Button
                onClick={() => setShowSettings(!showSettings)}
                size="sm"
                variant="ghost"
                className="text-white"
              >
                <Settings className="w-4 h-4" />
              </Button>
            </div>

            {/* Stream Stats */}
            {showStats && (
              <div className="absolute top-4 right-4 bg-black/70 text-white p-4 rounded-lg">
                <div className="text-sm space-y-1">
                  <div>Duration: {formatDuration(streamDuration)}</div>
                  <div>Viewers: {viewerCount}</div>
                  <div>Likes: {likeCount}</div>
                  <div>Resolution: {resolution}</div>
                  <div>FPS: {frameRate}</div>
                </div>
              </div>
            )}
          </div>

          {/* Live Chat Panel */}
          <div className="w-80 bg-gray-900 border-l border-gray-800 flex flex-col">
            <div className="p-4 border-b border-gray-800">
              <h3 className="text-white font-bold">Live Chat</h3>
            </div>
            
            {/* Comments */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {comments.map((comment) => (
                <div key={comment.id} className="text-sm">
                  <div className="text-blue-400 font-medium">{comment.user}</div>
                  <div className="text-white">{comment.text}</div>
                </div>
              ))}
              
              {comments.length === 0 && (
                <div className="text-gray-400 text-center">
                  No comments yet. Start the conversation!
                </div>
              )}
            </div>

            {/* Chat Input */}
            <div className="p-4 border-t border-gray-800">
              <div className="flex gap-2">
                <Input
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Say something..."
                  className="bg-gray-800 border-gray-700 text-white"
                  onKeyPress={(e) => e.key === 'Enter' && addComment()}
                />
                <Button onClick={addComment} size="sm">
                  <MessageCircle className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Settings Panel */}
        {showSettings && (
          <div className="absolute right-80 top-16 bottom-0 w-80 bg-gray-900 border-l border-gray-800 p-4 overflow-y-auto">
            <div className="space-y-6 text-white">
              <div>
                <h4 className="font-bold mb-3">Camera Settings</h4>
                <div className="space-y-3">
                  <div>
                    <label className="text-sm">Brightness</label>
                    <input
                      type="range"
                      min="0"
                      max="200"
                      value={brightness[0]}
                      onChange={(e) => setBrightness([parseInt(e.target.value)])}
                      className="w-full mt-1"
                    />
                  </div>
                  <div>
                    <label className="text-sm">Contrast</label>
                    <input
                      type="range"
                      min="0"
                      max="200"
                      value={contrast[0]}
                      onChange={(e) => setContrast([parseInt(e.target.value)])}
                      className="w-full mt-1"
                    />
                  </div>
                  <div>
                    <label className="text-sm">Saturation</label>
                    <input
                      type="range"
                      min="0"
                      max="200"
                      value={saturation[0]}
                      onChange={(e) => setSaturation([parseInt(e.target.value)])}
                      className="w-full mt-1"
                    />
                  </div>
                </div>
              </div>
              
              <div>
                <h4 className="font-bold mb-3">Stream Quality</h4>
                <div className="space-y-3">
                  <Select value={resolution} onValueChange={setResolution}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="720p">720p</SelectItem>
                      <SelectItem value="1080p">1080p</SelectItem>
                      <SelectItem value="1440p">1440p</SelectItem>
                    </SelectContent>
                  </Select>
                  
                  <Select value={frameRate} onValueChange={setFrameRate}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="24">24 FPS</SelectItem>
                      <SelectItem value="30">30 FPS</SelectItem>
                      <SelectItem value="60">60 FPS</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // Stream setup interface
  return (
    <div className={cn("max-w-4xl mx-auto p-6", className)}>
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Camera Preview */}
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Camera className="w-5 h-5" />
                Camera Preview
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="relative bg-gray-900 rounded-lg overflow-hidden aspect-video">
                <video
                  ref={videoRef}
                  autoPlay
                  muted
                  className="w-full h-full object-cover"
                  style={{
                    filter: `brightness(${brightness[0]}%) contrast(${contrast[0]}%) saturate(${saturation[0]}%)`
                  }}
                />
                
                {!isVideoOn && (
                  <div className="absolute inset-0 bg-gray-800 flex items-center justify-center">
                    <VideoOff className="w-12 h-12 text-gray-400" />
                  </div>
                )}
                
                <div className="absolute bottom-4 left-4 flex gap-2">
                  <Button
                    onClick={toggleVideo}
                    size="sm"
                    variant={isVideoOn ? "default" : "destructive"}
                  >
                    {isVideoOn ? <Video className="w-4 h-4" /> : <VideoOff className="w-4 h-4" />}
                  </Button>
                  
                  <Button
                    onClick={toggleAudio}
                    size="sm"
                    variant={isAudioOn ? "default" : "destructive"}
                  >
                    {isAudioOn ? <Mic className="w-4 h-4" /> : <MicOff className="w-4 h-4" />}
                  </Button>
                </div>
              </div>
              
              {/* Device Selection */}
              <div className="mt-4 space-y-3">
                <div>
                  <label className="text-sm font-medium">Camera</label>
                  <Select value={selectedCamera} onValueChange={setSelectedCamera}>
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Select camera" />
                    </SelectTrigger>
                    <SelectContent>
                      {cameras.map((camera) => (
                        <SelectItem key={camera.deviceId} value={camera.deviceId}>
                          {camera.label || `Camera ${camera.deviceId.slice(0, 8)}`}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <label className="text-sm font-medium">Microphone</label>
                  <Select value={selectedMicrophone} onValueChange={setSelectedMicrophone}>
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Select microphone" />
                    </SelectTrigger>
                    <SelectContent>
                      {microphones.map((mic) => (
                        <SelectItem key={mic.deviceId} value={mic.deviceId}>
                          {mic.label || `Microphone ${mic.deviceId.slice(0, 8)}`}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Stream Configuration */}
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Radio className="w-5 h-5" />
                Stream Configuration
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium">Title</label>
                <Input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Enter stream title"
                  className="mt-1"
                />
              </div>
              
              <div>
                <label className="text-sm font-medium">Description</label>
                <Textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe your stream"
                  className="mt-1"
                />
              </div>
              
              <div>
                <label className="text-sm font-medium">Category</label>
                <Select value={category} onValueChange={setCategory}>
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="general">General</SelectItem>
                    <SelectItem value="gaming">Gaming</SelectItem>
                    <SelectItem value="music">Music</SelectItem>
                    <SelectItem value="education">Education</SelectItem>
                    <SelectItem value="fitness">Fitness</SelectItem>
                    <SelectItem value="cooking">Cooking</SelectItem>
                    <SelectItem value="art">Art & Crafts</SelectItem>
                    <SelectItem value="tech">Technology</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium">Private Stream</label>
                <Switch checked={isPrivate} onCheckedChange={setIsPrivate} />
              </div>
              
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium">Schedule Stream</label>
                <Switch checked={isScheduled} onCheckedChange={setIsScheduled} />
              </div>
              
              {isScheduled && (
                <div>
                  <label className="text-sm font-medium">Scheduled Time</label>
                  <Input
                    type="datetime-local"
                    value={scheduledTime}
                    onChange={(e) => setScheduledTime(e.target.value)}
                    className="mt-1"
                  />
                </div>
              )}
            </CardContent>
          </Card>

          {/* Advanced Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="w-5 h-5" />
                Advanced Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Resolution</label>
                  <Select value={resolution} onValueChange={setResolution}>
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="720p">720p</SelectItem>
                      <SelectItem value="1080p">1080p</SelectItem>
                      <SelectItem value="1440p">1440p</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <label className="text-sm font-medium">Frame Rate</label>
                  <Select value={frameRate} onValueChange={setFrameRate}>
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="24">24 FPS</SelectItem>
                      <SelectItem value="30">30 FPS</SelectItem>
                      <SelectItem value="60">60 FPS</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div>
                <label className="text-sm font-medium">Brightness</label>
                <input
                  type="range"
                  min="0"
                  max="200"
                  value={brightness[0]}
                  onChange={(e) => setBrightness([parseInt(e.target.value)])}
                  className="w-full mt-2"
                />
              </div>

              <div>
                <label className="text-sm font-medium">Contrast</label>
                <input
                  type="range"
                  min="0"
                  max="200"
                  value={contrast[0]}
                  onChange={(e) => setContrast([parseInt(e.target.value)])}
                  className="w-full mt-2"
                />
              </div>

              <div>
                <label className="text-sm font-medium">Saturation</label>
                <input
                  type="range"
                  min="0"
                  max="200"
                  value={saturation[0]}
                  onChange={(e) => setSaturation([parseInt(e.target.value)])}
                  className="w-full mt-2"
                />
              </div>
            </CardContent>
          </Card>

          {/* Start Stream Button */}
          <Button
            onClick={handleStartStream}
            disabled={!title.trim() || isSettingUp}
            className="w-full bg-red-600 hover:bg-red-700"
            size="lg"
          >
            {isSettingUp ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                Setting up stream...
              </>
            ) : (
              <>
                <Radio className="w-4 h-4 mr-2" />
                Start Live Stream
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}

export default EnhancedLiveStreamCreator;
