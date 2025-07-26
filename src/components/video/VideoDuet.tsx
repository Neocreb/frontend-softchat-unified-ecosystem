import React, { useState, useRef, useEffect, useCallback } from "react";
import {
  Play,
  Pause,
  Square,
  RotateCcw,
  Volume2,
  VolumeX,
  Camera,
  CameraOff,
  Mic,
  MicOff,
  Settings,
  X,
  Upload,
  Download,
  Share2,
  CheckCircle,
  AlertCircle,
  Loader2,
  MoreHorizontal,
  Users,
  Sparkles,
  Timer,
  Grid3X3,
  Maximize,
  Minimize,
  SwitchCamera,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

interface OriginalVideo {
  id: string;
  url: string;
  thumbnail: string;
  duration: number;
  title: string;
  creator: {
    id: string;
    username: string;
    displayName: string;
    avatar: string;
  };
}

interface DuetSettings {
  layout: "original_left" | "original_right" | "original_top" | "original_bottom";
  duetType: "side_by_side" | "react_respond" | "picture_in_picture";
  audioMix: "original_only" | "duet_only" | "both" | "mixed";
  originalAudioVolume: number;
  duetAudioVolume: number;
  syncToOriginal: boolean;
  startOffset: number;
  allowComments: boolean;
  allowDuets: boolean;
}

interface VideoDuetProps {
  originalVideo: OriginalVideo;
  onClose: () => void;
  onDuetCreated?: (duetData: any) => void;
}

const VideoDuet: React.FC<VideoDuetProps> = ({
  originalVideo,
  onClose,
  onDuetCreated,
}) => {
  const { toast } = useToast();
  
  // Video refs
  const originalVideoRef = useRef<HTMLVideoElement>(null);
  const userVideoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  
  // Recording state
  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [recordedChunks, setRecordedChunks] = useState<Blob[]>([]);
  const [recordedVideoUrl, setRecordedVideoUrl] = useState<string | null>(null);
  
  // Camera and audio state
  const [hasCamera, setHasCamera] = useState(false);
  const [hasMicrophone, setHasMicrophone] = useState(false);
  const [isCameraOn, setIsCameraOn] = useState(false);
  const [isMicrophoneOn, setIsMicrophoneOn] = useState(false);
  const [facingMode, setFacingMode] = useState<"user" | "environment">("user");
  
  // Original video playback
  const [originalIsPlaying, setOriginalIsPlaying] = useState(false);
  const [originalCurrentTime, setOriginalCurrentTime] = useState(0);
  const [originalMuted, setOriginalMuted] = useState(false);
  
  // UI state
  const [showSettings, setShowSettings] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [step, setStep] = useState<"setup" | "recording" | "preview" | "publish">("setup");
  
  // Duet settings
  const [duetSettings, setDuetSettings] = useState<DuetSettings>({
    layout: "original_left",
    duetType: "side_by_side",
    audioMix: "both",
    originalAudioVolume: 0.5,
    duetAudioVolume: 0.8,
    syncToOriginal: true,
    startOffset: 0,
    allowComments: true,
    allowDuets: true,
  });
  
  // Publish data
  const [publishData, setPublishData] = useState({
    title: `Duet with @${originalVideo.creator.username}`,
    description: "",
    hashtags: ["duet", originalVideo.creator.username],
    isPublic: true,
  });
  
  // Initialize camera and microphone access
  useEffect(() => {
    checkMediaDevices();
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, []);
  
  // Recording timer
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRecording && !isPaused) {
      interval = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRecording, isPaused]);
  
  const checkMediaDevices = async () => {
    try {
      const devices = await navigator.mediaDevices.enumerateDevices();
      setHasCamera(devices.some(device => device.kind === "videoinput"));
      setHasMicrophone(devices.some(device => device.kind === "audioinput"));
    } catch (error) {
      console.error("Error checking media devices:", error);
      toast({
        title: "Device Access Error",
        description: "Unable to check camera and microphone availability.",
        variant: "destructive",
      });
    }
  };
  
  const startCamera = async () => {
    try {
      const constraints: MediaStreamConstraints = {
        video: {
          facingMode,
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
        audio: isMicrophoneOn,
      };
      
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      streamRef.current = stream;
      
      if (userVideoRef.current) {
        userVideoRef.current.srcObject = stream;
      }
      
      setIsCameraOn(true);
      toast({
        title: "Camera Started",
        description: "Ready to record your duet!",
      });
    } catch (error) {
      console.error("Error starting camera:", error);
      toast({
        title: "Camera Error",
        description: "Unable to start camera. Please check permissions.",
        variant: "destructive",
      });
    }
  };
  
  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setIsCameraOn(false);
  };
  
  const toggleCamera = () => {
    if (isCameraOn) {
      stopCamera();
    } else {
      startCamera();
    }
  };
  
  const switchCameraFacing = async () => {
    const newFacingMode = facingMode === "user" ? "environment" : "user";
    setFacingMode(newFacingMode);
    
    if (isCameraOn) {
      stopCamera();
      // Wait a bit before restarting with new facing mode
      setTimeout(() => {
        setFacingMode(newFacingMode);
        startCamera();
      }, 100);
    }
  };
  
  const startRecording = async () => {
    if (!isCameraOn || !streamRef.current) {
      toast({
        title: "Camera Required",
        description: "Please start your camera before recording.",
        variant: "destructive",
      });
      return;
    }
    
    try {
      // Setup canvas for combined recording
      const canvas = canvasRef.current;
      if (!canvas) return;
      
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      
      // Set canvas dimensions based on layout
      const width = duetSettings.layout.includes("top") || duetSettings.layout.includes("bottom") ? 720 : 1280;
      const height = duetSettings.layout.includes("left") || duetSettings.layout.includes("right") ? 720 : 1280;
      
      canvas.width = width;
      canvas.height = height;
      
      // Create canvas stream for recording
      const canvasStream = canvas.captureStream(30);
      
      // Add audio from user's stream
      if (isMicrophoneOn && streamRef.current.getAudioTracks().length > 0) {
        const audioTrack = streamRef.current.getAudioTracks()[0];
        canvasStream.addTrack(audioTrack);
      }
      
      // Start MediaRecorder
      const mediaRecorder = new MediaRecorder(canvasStream, {
        mimeType: "video/webm;codecs=vp9",
      });
      
      mediaRecorderRef.current = mediaRecorder;
      
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          setRecordedChunks(prev => [...prev, event.data]);
        }
      };
      
      mediaRecorder.onstop = () => {
        finishRecording();
      };
      
      mediaRecorder.start(100); // Collect data every 100ms
      
      // Start original video if sync is enabled
      if (duetSettings.syncToOriginal && originalVideoRef.current) {
        originalVideoRef.current.currentTime = duetSettings.startOffset;
        originalVideoRef.current.play();
        setOriginalIsPlaying(true);
      }
      
      setIsRecording(true);
      setRecordingTime(0);
      setStep("recording");
      
      // Start rendering loop
      renderCombinedVideo();
      
      toast({
        title: "Recording Started",
        description: "Creating your duet video...",
      });
    } catch (error) {
      console.error("Error starting recording:", error);
      toast({
        title: "Recording Error",
        description: "Failed to start recording. Please try again.",
        variant: "destructive",
      });
    }
  };
  
  const renderCombinedVideo = () => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    const originalVideo = originalVideoRef.current;
    const userVideo = userVideoRef.current;
    
    if (!canvas || !ctx || !originalVideo || !userVideo) return;
    
    const render = () => {
      if (!isRecording) return;
      
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Calculate dimensions based on layout
      const canvasWidth = canvas.width;
      const canvasHeight = canvas.height;
      
      let originalX = 0, originalY = 0, originalW = 0, originalH = 0;
      let userX = 0, userY = 0, userW = 0, userH = 0;
      
      switch (duetSettings.layout) {
        case "original_left":
          originalW = canvasWidth / 2;
          originalH = canvasHeight;
          userX = canvasWidth / 2;
          userW = canvasWidth / 2;
          userH = canvasHeight;
          break;
        case "original_right":
          originalX = canvasWidth / 2;
          originalW = canvasWidth / 2;
          originalH = canvasHeight;
          userW = canvasWidth / 2;
          userH = canvasHeight;
          break;
        case "original_top":
          originalW = canvasWidth;
          originalH = canvasHeight / 2;
          userY = canvasHeight / 2;
          userW = canvasWidth;
          userH = canvasHeight / 2;
          break;
        case "original_bottom":
          originalY = canvasHeight / 2;
          originalW = canvasWidth;
          originalH = canvasHeight / 2;
          userW = canvasWidth;
          userH = canvasHeight / 2;
          break;
      }
      
      // Draw original video
      ctx.drawImage(originalVideo, originalX, originalY, originalW, originalH);
      
      // Draw user video
      ctx.drawImage(userVideo, userX, userY, userW, userH);
      
      // Add border between videos
      ctx.strokeStyle = "#ffffff";
      ctx.lineWidth = 2;
      if (duetSettings.layout.includes("left") || duetSettings.layout.includes("right")) {
        ctx.beginPath();
        ctx.moveTo(canvasWidth / 2, 0);
        ctx.lineTo(canvasWidth / 2, canvasHeight);
        ctx.stroke();
      } else {
        ctx.beginPath();
        ctx.moveTo(0, canvasHeight / 2);
        ctx.lineTo(canvasWidth, canvasHeight / 2);
        ctx.stroke();
      }
      
      // Add watermark
      ctx.fillStyle = "rgba(255, 255, 255, 0.8)";
      ctx.font = "16px Inter, sans-serif";
      ctx.fillText("Duet on Softchat", 10, canvasHeight - 10);
      
      requestAnimationFrame(render);
    };
    
    render();
  };
  
  const pauseRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.pause();
      setIsPaused(true);
      
      if (originalVideoRef.current) {
        originalVideoRef.current.pause();
        setOriginalIsPlaying(false);
      }
    }
  };
  
  const resumeRecording = () => {
    if (mediaRecorderRef.current && isPaused) {
      mediaRecorderRef.current.resume();
      setIsPaused(false);
      
      if (duetSettings.syncToOriginal && originalVideoRef.current) {
        originalVideoRef.current.play();
        setOriginalIsPlaying(true);
      }
    }
  };
  
  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      setIsPaused(false);
      
      if (originalVideoRef.current) {
        originalVideoRef.current.pause();
        setOriginalIsPlaying(false);
      }
    }
  };
  
  const finishRecording = () => {
    if (recordedChunks.length > 0) {
      const blob = new Blob(recordedChunks, { type: "video/webm" });
      const url = URL.createObjectURL(blob);
      setRecordedVideoUrl(url);
      setStep("preview");
      
      toast({
        title: "Recording Complete",
        description: "Your duet video is ready for preview!",
      });
    }
  };
  
  const retakeRecording = () => {
    setRecordedChunks([]);
    setRecordedVideoUrl(null);
    setRecordingTime(0);
    setStep("recording");
  };
  
  const publishDuet = async () => {
    if (!recordedVideoUrl) return;
    
    setIsProcessing(true);
    setStep("publish");
    
    try {
      // Convert blob to file for upload
      const response = await fetch(recordedVideoUrl);
      const blob = await response.blob();
      const file = new File([blob], `duet-${Date.now()}.webm`, { type: "video/webm" });
      
      // Simulate upload progress
      const uploadSimulation = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 90) {
            clearInterval(uploadSimulation);
            return prev;
          }
          return prev + 10;
        });
      }, 200);
      
      // Here you would normally upload to your backend
      // const duetData = await uploadDuetVideo(file, publishData, duetSettings);
      
      // Simulate successful upload
      setTimeout(() => {
        clearInterval(uploadSimulation);
        setUploadProgress(100);
        
        const duetData = {
          id: `duet-${Date.now()}`,
          originalVideoId: originalVideo.id,
          videoUrl: recordedVideoUrl,
          settings: duetSettings,
          publishData,
          duration: recordingTime,
        };
        
        toast({
          title: "Duet Published!",
          description: "Your duet video has been shared successfully.",
        });
        
        onDuetCreated?.(duetData);
        onClose();
      }, 1000);
      
    } catch (error) {
      console.error("Error publishing duet:", error);
      toast({
        title: "Publishing Failed",
        description: "Failed to publish your duet. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };
  
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };
  
  const handleSettingsChange = (key: keyof DuetSettings, value: any) => {
    setDuetSettings(prev => ({ ...prev, [key]: value }));
  };
  
  return (
    <div className="fixed inset-0 bg-black z-50 flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 bg-gray-900 border-b border-gray-800">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="text-white hover:bg-gray-800"
          >
            <X className="w-5 h-5" />
          </Button>
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-purple-400" />
            <span className="text-white font-semibold">Create Duet</span>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="bg-purple-500/20 text-purple-400">
            {step === "setup" && "Setup"}
            {step === "recording" && "Recording"}
            {step === "preview" && "Preview"}
            {step === "publish" && "Publishing"}
          </Badge>
          
          {step === "recording" && (
            <Badge variant="secondary" className="bg-red-500/20 text-red-400">
              <Timer className="w-3 h-3 mr-1" />
              {formatTime(recordingTime)}
            </Badge>
          )}
          
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setShowSettings(true)}
            className="text-white hover:bg-gray-800"
          >
            <Settings className="w-5 h-5" />
          </Button>
        </div>
      </div>
      
      {/* Main Content */}
      <div className="flex-1 flex">
        {/* Video Preview Area */}
        <div className="flex-1 flex items-center justify-center p-4">
          {step === "setup" || step === "recording" ? (
            <div className="grid grid-cols-2 gap-4 w-full max-w-4xl">
              {/* Original Video */}
              <div className="relative aspect-video bg-gray-900 rounded-lg overflow-hidden">
                <video
                  ref={originalVideoRef}
                  src={originalVideo.url}
                  className="w-full h-full object-cover"
                  muted={originalMuted}
                  onTimeUpdate={(e) => setOriginalCurrentTime(e.currentTarget.currentTime)}
                />
                
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                
                <div className="absolute bottom-3 left-3 right-3">
                  <div className="flex items-center gap-2">
                    <img
                      src={originalVideo.creator.avatar}
                      alt={originalVideo.creator.displayName}
                      className="w-8 h-8 rounded-full"
                    />
                    <div className="text-white text-sm">
                      <div className="font-medium">@{originalVideo.creator.username}</div>
                      <div className="text-xs text-gray-300">{originalVideo.title}</div>
                    </div>
                  </div>
                </div>
                
                <div className="absolute top-3 left-3">
                  <Badge className="bg-blue-500/20 text-blue-400">Original</Badge>
                </div>
                
                <div className="absolute top-3 right-3">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setOriginalMuted(!originalMuted)}
                    className="text-white hover:bg-black/50"
                  >
                    {originalMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                  </Button>
                </div>
              </div>
              
              {/* User Video */}
              <div className="relative aspect-video bg-gray-900 rounded-lg overflow-hidden">
                <video
                  ref={userVideoRef}
                  autoPlay
                  muted
                  className="w-full h-full object-cover scale-x-[-1]"
                />
                
                {!isCameraOn && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
                    <CameraOff className="w-12 h-12 mb-3 text-gray-500" />
                    <p className="text-lg font-medium mb-2">Camera Off</p>
                    <p className="text-sm text-gray-400 mb-4">Turn on your camera to start recording</p>
                    <Button onClick={startCamera} className="bg-purple-600 hover:bg-purple-700">
                      <Camera className="w-4 h-4 mr-2" />
                      Start Camera
                    </Button>
                  </div>
                )}
                
                <div className="absolute top-3 left-3">
                  <Badge className="bg-purple-500/20 text-purple-400">You</Badge>
                </div>
                
                <div className="absolute top-3 right-3 flex gap-2">
                  {hasCamera && (
                    <>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={switchCameraFacing}
                        className="text-white hover:bg-black/50"
                      >
                        <SwitchCamera className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={toggleCamera}
                        className="text-white hover:bg-black/50"
                      >
                        {isCameraOn ? <Camera className="w-4 h-4" /> : <CameraOff className="w-4 h-4" />}
                      </Button>
                    </>
                  )}
                  
                  {hasMicrophone && (
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setIsMicrophoneOn(!isMicrophoneOn)}
                      className="text-white hover:bg-black/50"
                    >
                      {isMicrophoneOn ? <Mic className="w-4 h-4" /> : <MicOff className="w-4 h-4" />}
                    </Button>
                  )}
                </div>
                
                {isCameraOn && (
                  <div className="absolute bottom-3 right-3">
                    <Badge variant="secondary" className={cn(
                      "text-xs",
                      isMicrophoneOn ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400"
                    )}>
                      {isMicrophoneOn ? <Mic className="w-3 h-3 mr-1" /> : <MicOff className="w-3 h-3 mr-1" />}
                      {isMicrophoneOn ? "Audio On" : "Audio Off"}
                    </Badge>
                  </div>
                )}
              </div>
            </div>
          ) : step === "preview" ? (
            <div className="w-full max-w-2xl">
              <div className="relative aspect-video bg-gray-900 rounded-lg overflow-hidden mb-4">
                {recordedVideoUrl && (
                  <video
                    src={recordedVideoUrl}
                    controls
                    className="w-full h-full object-cover"
                  />
                )}
                
                <div className="absolute top-3 left-3">
                  <Badge className="bg-green-500/20 text-green-400">
                    <CheckCircle className="w-3 h-3 mr-1" />
                    Duet Complete
                  </Badge>
                </div>
              </div>
              
              <div className="space-y-4">
                <div>
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    value={publishData.title}
                    onChange={(e) => setPublishData(prev => ({ ...prev, title: e.target.value }))}
                    className="mt-1"
                  />
                </div>
                
                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={publishData.description}
                    onChange={(e) => setPublishData(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Tell viewers about your duet..."
                    className="mt-1"
                    rows={3}
                  />
                </div>
                
                <div>
                  <Label htmlFor="hashtags">Hashtags</Label>
                  <Input
                    id="hashtags"
                    value={publishData.hashtags.join(", ")}
                    onChange={(e) => setPublishData(prev => ({
                      ...prev,
                      hashtags: e.target.value.split(",").map(tag => tag.trim()).filter(Boolean)
                    }))}
                    placeholder="duet, dance, funny"
                    className="mt-1"
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <Label htmlFor="public">Make Public</Label>
                  <Switch
                    id="public"
                    checked={publishData.isPublic}
                    onCheckedChange={(checked) => setPublishData(prev => ({ ...prev, isPublic: checked }))}
                  />
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center">
              <Loader2 className="w-12 h-12 animate-spin text-purple-400 mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">Publishing Your Duet</h3>
              <p className="text-gray-400 mb-4">Please wait while we process your video...</p>
              <Progress value={uploadProgress} className="w-64 mx-auto" />
              <p className="text-sm text-gray-500 mt-2">{uploadProgress}%</p>
            </div>
          )}
        </div>
      </div>
      
      {/* Controls */}
      <div className="p-4 bg-gray-900 border-t border-gray-800">
        <div className="flex items-center justify-center gap-4">
          {step === "setup" && (
            <Button
              onClick={startRecording}
              disabled={!isCameraOn}
              className="bg-red-600 hover:bg-red-700 text-white px-8"
            >
              <div className="w-4 h-4 bg-white rounded-full mr-2" />
              Start Recording
            </Button>
          )}
          
          {step === "recording" && (
            <>
              {!isPaused ? (
                <Button
                  onClick={pauseRecording}
                  variant="secondary"
                  className="px-6"
                >
                  <Pause className="w-4 h-4 mr-2" />
                  Pause
                </Button>
              ) : (
                <Button
                  onClick={resumeRecording}
                  className="bg-green-600 hover:bg-green-700 px-6"
                >
                  <Play className="w-4 h-4 mr-2" />
                  Resume
                </Button>
              )}
              
              <Button
                onClick={stopRecording}
                className="bg-red-600 hover:bg-red-700 px-6"
              >
                <Square className="w-4 h-4 mr-2" />
                Stop
              </Button>
            </>
          )}
          
          {step === "preview" && (
            <>
              <Button
                onClick={retakeRecording}
                variant="outline"
                className="px-6"
              >
                <RotateCcw className="w-4 h-4 mr-2" />
                Retake
              </Button>
              
              <Button
                onClick={publishDuet}
                disabled={isProcessing}
                className="bg-purple-600 hover:bg-purple-700 px-8"
              >
                {isProcessing ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <Upload className="w-4 h-4 mr-2" />
                )}
                Publish Duet
              </Button>
            </>
          )}
        </div>
      </div>
      
      {/* Hidden canvas for recording */}
      <canvas ref={canvasRef} className="hidden" />
      
      {/* Settings Dialog */}
      <Dialog open={showSettings} onOpenChange={setShowSettings}>
        <DialogContent className="bg-gray-900 border-gray-800 text-white max-w-md">
          <DialogHeader>
            <DialogTitle>Duet Settings</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <Label>Layout</Label>
              <Select
                value={duetSettings.layout}
                onValueChange={(value: any) => handleSettingsChange("layout", value)}
              >
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="original_left">Original Left</SelectItem>
                  <SelectItem value="original_right">Original Right</SelectItem>
                  <SelectItem value="original_top">Original Top</SelectItem>
                  <SelectItem value="original_bottom">Original Bottom</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label>Audio Mix</Label>
              <Select
                value={duetSettings.audioMix}
                onValueChange={(value: any) => handleSettingsChange("audioMix", value)}
              >
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="both">Both Audio</SelectItem>
                  <SelectItem value="original_only">Original Only</SelectItem>
                  <SelectItem value="duet_only">Your Audio Only</SelectItem>
                  <SelectItem value="mixed">Mixed</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label>Original Audio Volume: {Math.round(duetSettings.originalAudioVolume * 100)}%</Label>
              <Slider
                value={[duetSettings.originalAudioVolume]}
                onValueChange={(value) => handleSettingsChange("originalAudioVolume", value[0])}
                max={1}
                min={0}
                step={0.1}
                className="mt-2"
              />
            </div>
            
            <div>
              <Label>Your Audio Volume: {Math.round(duetSettings.duetAudioVolume * 100)}%</Label>
              <Slider
                value={[duetSettings.duetAudioVolume]}
                onValueChange={(value) => handleSettingsChange("duetAudioVolume", value[0])}
                max={1}
                min={0}
                step={0.1}
                className="mt-2"
              />
            </div>
            
            <div className="flex items-center justify-between">
              <Label>Sync to Original</Label>
              <Switch
                checked={duetSettings.syncToOriginal}
                onCheckedChange={(checked) => handleSettingsChange("syncToOriginal", checked)}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <Label>Allow Comments</Label>
              <Switch
                checked={duetSettings.allowComments}
                onCheckedChange={(checked) => handleSettingsChange("allowComments", checked)}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <Label>Allow Duets</Label>
              <Switch
                checked={duetSettings.allowDuets}
                onCheckedChange={(checked) => handleSettingsChange("allowDuets", checked)}
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button onClick={() => setShowSettings(false)}>Done</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default VideoDuet;
