import React, { useState, useRef, useEffect, useCallback } from "react";
import {
  Camera,
  Square,
  Play,
  Pause,
  RotateCcw,
  Volume2,
  VolumeX,
  Mic,
  MicOff,
  Settings,
  X,
  Check,
  ArrowLeft,
  Download,
  Upload,
  Users,
  Layers,
  Video,
  VideoOff,
  Timer,
  Sparkles,
  Gift,
  Star,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogTitle, DialogHeader } from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { requestCameraAccess, stopCameraStream, switchCamera, CameraError } from "@/utils/cameraPermissions";
import CameraPermissionDialog from "@/components/ui/camera-permission-dialog";

interface OriginalVideo {
  id: string;
  url: string;
  duration: number;
  creatorId: string;
  creatorUsername: string;
  title: string;
  thumbnail: string;
  allowDuets: boolean;
}

interface DuetConfig {
  duetType: "side_by_side" | "split_screen" | "reaction" | "green_screen";
  layoutPosition: "left" | "right" | "top" | "bottom";
  audioMix: "original_only" | "duet_only" | "both" | "custom";
  revenueSharePercentage: number; // 0-100, percentage to original creator
  allowTips: boolean;
  allowComments: boolean;
}

interface VideoDuetRecorderProps {
  originalVideo: OriginalVideo;
  onClose: () => void;
  onDuetCreated: (duet: any) => void;
}

const duetTypes = [
  {
    id: "side_by_side",
    name: "Side by Side",
    description: "Split screen with original and duet videos side by side",
    icon: <Layers className="w-5 h-5" />,
    preview: "📱📱",
  },
  {
    id: "split_screen",
    name: "Split Screen",
    description: "Top/bottom split screen layout",
    icon: <Video className="w-5 h-5" />,
    preview: "📺",
  },
  {
    id: "reaction",
    name: "Reaction",
    description: "Small duet video overlay on original",
    icon: <Users className="w-5 h-5" />,
    preview: "🎭",
  },
  {
    id: "green_screen",
    name: "Green Screen",
    description: "Use original video as background",
    icon: <Sparkles className="w-5 h-5" />,
    preview: "🌟",
  },
];

const audioMixOptions = [
  { id: "both", name: "Both Audio", description: "Mix original and duet audio" },
  { id: "original_only", name: "Original Only", description: "Only original video audio" },
  { id: "duet_only", name: "Duet Only", description: "Only your audio" },
  { id: "custom", name: "Custom Mix", description: "Custom audio balance" },
];

const VideoDuetRecorder: React.FC<VideoDuetRecorderProps> = ({
  originalVideo,
  onClose,
  onDuetCreated,
}) => {
  // Recording states
  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  // Camera states
  const [cameraFacing, setCameraFacing] = useState<"user" | "environment">("user");
  const [isCameraOn, setIsCameraOn] = useState(true);
  const [isMicOn, setIsMicOn] = useState(true);
  const [isMuted, setIsMuted] = useState(false);

  // Duet configuration
  const [duetConfig, setDuetConfig] = useState<DuetConfig>({
    duetType: "side_by_side",
    layoutPosition: "right",
    audioMix: "both",
    revenueSharePercentage: 50,
    allowTips: true,
    allowComments: true,
  });

  // UI states
  const [currentStep, setCurrentStep] = useState<"setup" | "record" | "preview" | "publish">("setup");
  const [showSettings, setShowSettings] = useState(false);
  const [cameraError, setCameraError] = useState<CameraError | null>(null);
  const [showPermissionDialog, setShowPermissionDialog] = useState(false);
  const [isInitializingCamera, setIsInitializingCamera] = useState(false);

  // Processing states
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingProgress, setProcessingProgress] = useState(0);
  const [processingStatus, setProcessingStatus] = useState("");

  // Publishing states
  const [duetTitle, setDuetTitle] = useState(`Duet with @${originalVideo.creatorUsername}`);
  const [duetDescription, setDuetDescription] = useState("");
  const [isPublic, setIsPublic] = useState(true);

  // Refs
  const originalVideoRef = useRef<HTMLVideoElement>(null);
  const duetVideoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const recordedVideoRef = useRef<Blob | null>(null);

  const { toast } = useToast();

  // Initialize camera when step changes to record
  useEffect(() => {
    if (currentStep === "record") {
      initializeCamera();
    } else {
      cleanup();
    }
    return () => cleanup();
  }, [currentStep, cameraFacing, isMicOn]);

  // Recording timer
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRecording && !isPaused) {
      interval = setInterval(() => {
        setRecordingTime((prev) => {
          if (prev >= originalVideo.duration) {
            handleStopRecording();
            return originalVideo.duration;
          }
          return prev + 0.1;
        });
      }, 100);
    }
    return () => clearInterval(interval);
  }, [isRecording, isPaused, originalVideo.duration]);

  // Sync original video with recording
  useEffect(() => {
    if (originalVideoRef.current && isRecording && !isPaused) {
      const currentTime = recordingTime;
      const videoCurrentTime = originalVideoRef.current.currentTime;
      
      // Keep videos in sync
      if (Math.abs(currentTime - videoCurrentTime) > 0.5) {
        originalVideoRef.current.currentTime = currentTime;
      }
    }
  }, [recordingTime, isRecording, isPaused]);

  const cleanup = useCallback(() => {
    stopCameraStream(streamRef.current);
    streamRef.current = null;

    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
    }
  }, [isRecording]);

  const initializeCamera = async () => {
    setIsInitializingCamera(true);
    setCameraError(null);

    try {
      cleanup();

      const constraints = {
        video: {
          facingMode: cameraFacing,
          width: { ideal: 1080 },
          height: { ideal: 1920 },
          frameRate: { ideal: 30 },
        },
        audio: isMicOn,
      };

      const result = await requestCameraAccess(constraints);

      if (result.error) {
        setCameraError(result.error);
        setShowPermissionDialog(true);
        return;
      }

      if (result.stream) {
        streamRef.current = result.stream;

        if (duetVideoRef.current) {
          duetVideoRef.current.srcObject = result.stream;
        }

        toast({
          title: "Camera Ready",
          description: "Camera initialized successfully",
        });
      }
    } catch (error) {
      console.error("Unexpected camera error:", error);
      setCameraError({
        type: 'unknown',
        message: 'Unexpected error occurred',
        userAction: 'Please try refreshing the page'
      });
      setShowPermissionDialog(true);
    } finally {
      setIsInitializingCamera(false);
    }
  };

  const handleStartRecording = async () => {
    if (!streamRef.current) {
      toast({
        title: "Camera Error",
        description: "Camera not initialized",
        variant: "destructive",
      });
      return;
    }

    try {
      chunksRef.current = [];
      const mediaRecorder = new MediaRecorder(streamRef.current, {
        mimeType: "video/webm;codecs=vp9",
      });

      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: "video/webm" });
        recordedVideoRef.current = blob;
        setCurrentStep("preview");
      };

      // Start original video playback
      if (originalVideoRef.current) {
        originalVideoRef.current.currentTime = 0;
        originalVideoRef.current.play();
        setIsPlaying(true);
      }

      mediaRecorder.start(100);
      setIsRecording(true);
      setIsPaused(false);
      setRecordingTime(0);

      toast({
        title: "Recording Started",
        description: "Duet recording in progress",
      });
    } catch (error) {
      toast({
        title: "Recording Error",
        description: "Failed to start recording",
        variant: "destructive",
      });
    }
  };

  const handleStopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      setIsPaused(false);

      // Stop original video
      if (originalVideoRef.current) {
        originalVideoRef.current.pause();
        setIsPlaying(false);
      }

      toast({
        title: "Recording Complete",
        description: "Processing your duet video",
      });
    }
  };

  const handlePauseRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      if (isPaused) {
        mediaRecorderRef.current.resume();
        if (originalVideoRef.current) {
          originalVideoRef.current.play();
        }
        setIsPaused(false);
      } else {
        mediaRecorderRef.current.pause();
        if (originalVideoRef.current) {
          originalVideoRef.current.pause();
        }
        setIsPaused(true);
      }
    }
  };

  const handleCameraSwitch = async () => {
    setIsInitializingCamera(true);

    try {
      const result = await switchCamera(streamRef.current, cameraFacing, isMicOn);

      if (result.error) {
        setCameraError(result.error);
        setShowPermissionDialog(true);
        return;
      }

      if (result.stream) {
        streamRef.current = result.stream;
        setCameraFacing(result.facing);

        if (duetVideoRef.current) {
          duetVideoRef.current.srcObject = result.stream;
        }

        toast({
          title: "Camera Switched",
          description: `Switched to ${result.facing === 'user' ? 'front' : 'back'} camera`,
        });
      }
    } catch (error) {
      toast({
        title: "Switch Failed",
        description: "Could not switch camera",
        variant: "destructive",
      });
    } finally {
      setIsInitializingCamera(false);
    }
  };

  const processAndMergeDuet = async () => {
    if (!recordedVideoRef.current) return;

    setIsProcessing(true);
    setProcessingProgress(0);
    setProcessingStatus("Preparing videos...");

    try {
      // Simulate video processing steps
      const steps = [
        "Analyzing original video...",
        "Processing duet recording...",
        "Applying layout configuration...",
        "Mixing audio tracks...",
        "Rendering final video...",
        "Optimizing for upload...",
      ];

      for (let i = 0; i < steps.length; i++) {
        setProcessingStatus(steps[i]);
        setProcessingProgress(((i + 1) / steps.length) * 100);
        
        // Simulate processing time
        await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 1000));
      }

      setProcessingStatus("Processing complete!");
      setCurrentStep("publish");

      toast({
        title: "Duet Ready",
        description: "Your duet video has been processed successfully",
      });
    } catch (error) {
      toast({
        title: "Processing Error",
        description: "Failed to process duet video",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const publishDuet = async () => {
    try {
      const duetData = {
        originalVideoId: originalVideo.id,
        originalCreatorId: originalVideo.creatorId,
        duetCreatorId: "current-user-id", // This would come from auth context
        duetTitle,
        duetDescription,
        duetType: duetConfig.duetType,
        layoutPosition: duetConfig.layoutPosition,
        audioMix: duetConfig.audioMix,
        revenueSharePercentage: duetConfig.revenueSharePercentage,
        isPublic,
        allowComments: duetConfig.allowComments,
        isMonetized: duetConfig.allowTips,
        originalDuration: originalVideo.duration,
        duetDuration: recordingTime,
        videoBlob: recordedVideoRef.current,
      };

      // Here you would upload the video and create the duet record
      // For now, we'll simulate the API call
      await new Promise(resolve => setTimeout(resolve, 2000));

      toast({
        title: "Duet Published!",
        description: "Your duet has been shared successfully",
      });

      onDuetCreated(duetData);
      onClose();
    } catch (error) {
      toast({
        title: "Publish Error",
        description: "Failed to publish duet",
        variant: "destructive",
      });
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const handleRetryCamera = () => {
    setShowPermissionDialog(false);
    setCameraError(null);
    initializeCamera();
  };

  const handleCancelCamera = () => {
    setShowPermissionDialog(false);
    onClose();
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case "setup":
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-white mb-2">Create Duet</h2>
              <p className="text-gray-400">
                Duet with @{originalVideo.creatorUsername}'s video
              </p>
            </div>

            {/* Original Video Preview */}
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Video className="w-5 h-5" />
                  Original Video
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="aspect-[9/16] bg-black rounded-lg overflow-hidden mb-4">
                  <video
                    src={originalVideo.url}
                    poster={originalVideo.thumbnail}
                    className="w-full h-full object-cover"
                    muted
                  />
                </div>
                <div className="flex items-center justify-between text-sm text-gray-400">
                  <span>{originalVideo.title}</span>
                  <span>{formatTime(originalVideo.duration)}</span>
                </div>
              </CardContent>
            </Card>

            {/* Duet Type Selection */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white">Choose Duet Style</h3>
              <div className="grid grid-cols-2 gap-3">
                {duetTypes.map((type) => (
                  <Button
                    key={type.id}
                    variant={duetConfig.duetType === type.id ? "default" : "outline"}
                    className="h-auto p-4 flex flex-col items-center gap-2 text-left"
                    onClick={() => setDuetConfig({ ...duetConfig, duetType: type.id as any })}
                  >
                    <div className="flex items-center gap-2">
                      {type.icon}
                      <span className="text-lg">{type.preview}</span>
                    </div>
                    <div>
                      <div className="font-medium">{type.name}</div>
                      <div className="text-xs text-gray-400 mt-1">
                        {type.description}
                      </div>
                    </div>
                  </Button>
                ))}
              </div>
            </div>

            {/* Audio Mix Selection */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white">Audio Mix</h3>
              <div className="space-y-2">
                {audioMixOptions.map((option) => (
                  <Button
                    key={option.id}
                    variant={duetConfig.audioMix === option.id ? "default" : "outline"}
                    className="w-full justify-start"
                    onClick={() => setDuetConfig({ ...duetConfig, audioMix: option.id as any })}
                  >
                    <div>
                      <div className="font-medium">{option.name}</div>
                      <div className="text-xs text-gray-400">{option.description}</div>
                    </div>
                  </Button>
                ))}
              </div>
            </div>

            {/* Revenue Sharing */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white">Revenue Sharing</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-gray-300">Original Creator Share</span>
                  <span className="text-white">{duetConfig.revenueSharePercentage}%</span>
                </div>
                <Slider
                  value={[duetConfig.revenueSharePercentage]}
                  onValueChange={([value]) => 
                    setDuetConfig({ ...duetConfig, revenueSharePercentage: value })
                  }
                  min={0}
                  max={100}
                  step={5}
                  className="w-full"
                />
                <div className="flex items-center justify-between text-sm text-gray-400">
                  <span>Your Share: {100 - duetConfig.revenueSharePercentage}%</span>
                  <span>Creator Share: {duetConfig.revenueSharePercentage}%</span>
                </div>
              </div>
            </div>

            {/* Monetization Options */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white">Monetization</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Gift className="w-4 h-4 text-yellow-400" />
                    <span className="text-gray-300">Allow Tips & Gifts</span>
                  </div>
                  <Switch
                    checked={duetConfig.allowTips}
                    onCheckedChange={(checked) => 
                      setDuetConfig({ ...duetConfig, allowTips: checked })
                    }
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Star className="w-4 h-4 text-blue-400" />
                    <span className="text-gray-300">Allow Comments</span>
                  </div>
                  <Switch
                    checked={duetConfig.allowComments}
                    onCheckedChange={(checked) => 
                      setDuetConfig({ ...duetConfig, allowComments: checked })
                    }
                  />
                </div>
              </div>
            </div>

            <Button
              onClick={() => setCurrentStep("record")}
              className="w-full bg-purple-600 hover:bg-purple-700"
              size="lg"
            >
              Start Recording
            </Button>
          </div>
        );

      case "record":
        return (
          <div className="space-y-4">
            {/* Video Layout */}
            <div className="relative aspect-[9/16] bg-black rounded-lg overflow-hidden">
              {duetConfig.duetType === "side_by_side" && (
                <div className="flex h-full">
                  {/* Original Video */}
                  <div className={cn(
                    "flex-1",
                    duetConfig.layoutPosition === "right" ? "order-1" : "order-2"
                  )}>
                    <video
                      ref={originalVideoRef}
                      src={originalVideo.url}
                      className="w-full h-full object-cover"
                      muted={isMuted}
                      playsInline
                    />
                    <div className="absolute top-2 left-2 bg-black/60 rounded px-2 py-1">
                      <span className="text-white text-xs">@{originalVideo.creatorUsername}</span>
                    </div>
                  </div>

                  {/* Duet Video */}
                  <div className={cn(
                    "flex-1 border-l border-gray-600",
                    duetConfig.layoutPosition === "right" ? "order-2" : "order-1"
                  )}>
                    <video
                      ref={duetVideoRef}
                      autoPlay
                      muted={isMuted}
                      playsInline
                      className={cn(
                        "w-full h-full object-cover",
                        cameraFacing === "user" && "scale-x-[-1]"
                      )}
                    />
                    <div className="absolute top-2 right-2 bg-black/60 rounded px-2 py-1">
                      <span className="text-white text-xs">You</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Recording indicator */}
              {isRecording && (
                <div className="absolute top-4 left-4 flex items-center gap-2">
                  <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse" />
                  <span className="text-white font-medium text-sm">
                    {formatTime(recordingTime)} / {formatTime(originalVideo.duration)}
                  </span>
                </div>
              )}

              {/* Progress bar */}
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/20">
                <div
                  className="h-full bg-red-500 transition-all duration-100"
                  style={{
                    width: `${(recordingTime / originalVideo.duration) * 100}%`,
                  }}
                />
              </div>
            </div>

            {/* Controls */}
            <div className="flex items-center justify-between">
              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleCameraSwitch}
                  disabled={isInitializingCamera}
                  className="text-white"
                >
                  <RotateCcw className="w-4 h-4 mr-1" />
                  {isInitializingCamera ? "Switching..." : "Flip"}
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsMicOn(!isMicOn)}
                  className="text-white"
                >
                  {isMicOn ? (
                    <Mic className="w-4 h-4 mr-1" />
                  ) : (
                    <MicOff className="w-4 h-4 mr-1" />
                  )}
                  Mic
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsMuted(!isMuted)}
                  className="text-white"
                >
                  {isMuted ? (
                    <VolumeX className="w-4 h-4 mr-1" />
                  ) : (
                    <Volume2 className="w-4 h-4 mr-1" />
                  )}
                  Audio
                </Button>
              </div>
            </div>

            {/* Main recording controls */}
            <div className="flex items-center justify-center gap-6 pt-4">
              <Button
                variant="ghost"
                size="sm"
                className="text-white"
                onClick={() => setCurrentStep("setup")}
              >
                <ArrowLeft className="w-4 h-4 mr-1" />
                Back
              </Button>

              <Button
                variant="ghost"
                size="icon"
                className={cn(
                  "w-20 h-20 rounded-full border-4 transition-all duration-200",
                  isRecording
                    ? "border-red-500 bg-red-500/20"
                    : "border-white bg-white/10 hover:bg-white/20",
                )}
                onClick={isRecording ? handleStopRecording : handleStartRecording}
                disabled={recordingTime >= originalVideo.duration}
              >
                {isRecording ? (
                  <Square className="w-8 h-8 text-white" fill="white" />
                ) : (
                  <div className="w-6 h-6 bg-red-500 rounded-full" />
                )}
              </Button>

              {isRecording && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handlePauseRecording}
                  className="text-white"
                >
                  {isPaused ? (
                    <Play className="w-4 h-4" />
                  ) : (
                    <Pause className="w-4 h-4" />
                  )}
                </Button>
              )}
            </div>
          </div>
        );

      case "preview":
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-white mb-2">Preview Your Duet</h2>
              <p className="text-gray-400">Review your duet before publishing</p>
            </div>

            {/* Preview Player */}
            <div className="aspect-[9/16] bg-black rounded-lg overflow-hidden">
              {recordedVideoRef.current && (
                <video
                  src={URL.createObjectURL(recordedVideoRef.current)}
                  controls
                  className="w-full h-full object-cover"
                />
              )}
            </div>

            {/* Processing Status */}
            {!isProcessing && (
              <Card className="bg-gray-800 border-gray-700">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <Sparkles className="w-5 h-5 text-purple-400" />
                    <div>
                      <p className="text-white font-medium">Ready to merge</p>
                      <p className="text-gray-400 text-sm">Process your duet with the original video</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Action Buttons */}
            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={() => setCurrentStep("record")}
                className="flex-1"
              >
                Re-record
              </Button>
              <Button
                onClick={processAndMergeDuet}
                disabled={isProcessing}
                className="flex-1 bg-purple-600 hover:bg-purple-700"
              >
                {isProcessing ? "Processing..." : "Process Duet"}
              </Button>
            </div>
          </div>
        );

      case "publish":
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-white mb-2">Publish Your Duet</h2>
              <p className="text-gray-400">Add details and share your duet</p>
            </div>

            {/* Publishing Form */}
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-white">Title</label>
                <Input
                  value={duetTitle}
                  onChange={(e) => setDuetTitle(e.target.value)}
                  placeholder="Give your duet a title"
                  className="bg-gray-800 border-gray-600 text-white"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-white">Description</label>
                <Textarea
                  value={duetDescription}
                  onChange={(e) => setDuetDescription(e.target.value)}
                  placeholder="Describe your duet (optional)"
                  className="bg-gray-800 border-gray-600 text-white"
                  rows={3}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Star className="w-4 h-4 text-yellow-400" />
                  <span className="text-gray-300">Make Public</span>
                </div>
                <Switch
                  checked={isPublic}
                  onCheckedChange={setIsPublic}
                />
              </div>
            </div>

            {/* Monetization Summary */}
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Zap className="w-5 h-5 text-yellow-400" />
                  Monetization Settings
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-gray-300">Tips & Gifts</span>
                  <Badge variant={duetConfig.allowTips ? "default" : "secondary"}>
                    {duetConfig.allowTips ? "Enabled" : "Disabled"}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-300">Revenue Share</span>
                  <span className="text-white">
                    You: {100 - duetConfig.revenueSharePercentage}% | 
                    Creator: {duetConfig.revenueSharePercentage}%
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-300">Comments</span>
                  <Badge variant={duetConfig.allowComments ? "default" : "secondary"}>
                    {duetConfig.allowComments ? "Enabled" : "Disabled"}
                  </Badge>
                </div>
              </CardContent>
            </Card>

            {/* Publish Button */}
            <Button
              onClick={publishDuet}
              className="w-full bg-purple-600 hover:bg-purple-700"
              size="lg"
            >
              <Upload className="w-4 h-4 mr-2" />
              Publish Duet
            </Button>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 bg-black z-50 flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 bg-black/80 backdrop-blur-sm">
        <Button
          variant="ghost"
          size="icon"
          onClick={onClose}
          className="text-white"
        >
          <X className="w-6 h-6" />
        </Button>

        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="bg-purple-500/20 text-purple-400">
            {currentStep.charAt(0).toUpperCase() + currentStep.slice(1)}
          </Badge>
        </div>

        {currentStep === "record" && (
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setShowSettings(true)}
            className="text-white"
          >
            <Settings className="w-6 h-6" />
          </Button>
        )}
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="container max-w-md mx-auto p-4">
          {renderStepContent()}
        </div>
      </div>

      {/* Processing Dialog */}
      <Dialog open={isProcessing} onOpenChange={() => {}}>
        <DialogContent className="bg-gray-900 border-gray-700 text-white">
          <DialogHeader>
            <DialogTitle>Processing Duet</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="text-center">
              <div className="animate-spin w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full mx-auto mb-4" />
              <p className="text-gray-400">{processingStatus}</p>
            </div>
            <Progress value={processingProgress} className="w-full" />
            <p className="text-center text-sm text-gray-500">
              {processingProgress.toFixed(0)}% Complete
            </p>
          </div>
        </DialogContent>
      </Dialog>

      {/* Camera Permission Dialog */}
      <CameraPermissionDialog
        open={showPermissionDialog}
        onOpenChange={setShowPermissionDialog}
        error={cameraError}
        onRetry={handleRetryCamera}
        onCancel={handleCancelCamera}
      />
    </div>
  );
};

export default VideoDuetRecorder;
