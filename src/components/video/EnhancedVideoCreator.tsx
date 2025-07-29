import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Slider } from '@/components/ui/slider';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Camera, 
  Square, 
  Play, 
  Pause, 
  RotateCcw, 
  Scissors, 
  Music, 
  Type, 
  Sparkles, 
  Users, 
  Timer,
  Download,
  Upload,
  Volume2,
  VolumeX,
  Mic,
  MicOff
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { requestCameraPermission, stopCameraStream, CameraError } from '@/utils/cameraPermissions';
import CameraPermissionDialog from '@/components/ui/camera-permission-dialog';

interface VideoSegment {
  id: string;
  blob: Blob;
  duration: number;
  startTime: number;
}

interface Filter {
  id: string;
  name: string;
  thumbnail: string;
  effect: string;
}

interface Effect {
  id: string;
  name: string;
  type: 'beauty' | 'ar' | 'background' | 'text';
  thumbnail: string;
}

interface SoundTrack {
  id: string;
  title: string;
  artist: string;
  duration: number;
  url: string;
  thumbnail: string;
  trending: boolean;
}

const EnhancedVideoCreator: React.FC = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [recordedSegments, setRecordedSegments] = useState<VideoSegment[]>([]);
  const [currentFilter, setCurrentFilter] = useState<string | null>(null);
  const [selectedEffects, setSelectedEffects] = useState<string[]>([]);
  const [selectedSound, setSelectedSound] = useState<SoundTrack | null>(null);
  const [recordingTime, setRecordingTime] = useState(0);
  const [maxDuration] = useState(60); // 60 seconds max
  const [cameraFacing, setCameraFacing] = useState<'user' | 'environment'>('user');
  const [isMuted, setIsMuted] = useState(false);
  const [micEnabled, setMicEnabled] = useState(true);
  const [speed, setSpeed] = useState(1);
  const [timer, setTimer] = useState(0);
  const [isTimerActive, setIsTimerActive] = useState(false);
  const [cameraError, setCameraError] = useState<CameraError | null>(null);
  const [showPermissionDialog, setShowPermissionDialog] = useState(false);
  const [isInitializingCamera, setIsInitializingCamera] = useState(false);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { toast } = useToast();

  const filters: Filter[] = [
    { id: '1', name: 'Original', thumbnail: '/api/placeholder/60/60', effect: 'none' },
    { id: '2', name: 'Vintage', thumbnail: '/api/placeholder/60/60', effect: 'sepia(1)' },
    { id: '3', name: 'Cool', thumbnail: '/api/placeholder/60/60', effect: 'hue-rotate(180deg)' },
    { id: '4', name: 'Warm', thumbnail: '/api/placeholder/60/60', effect: 'hue-rotate(30deg)' },
    { id: '5', name: 'Dramatic', thumbnail: '/api/placeholder/60/60', effect: 'contrast(1.5) brightness(0.8)' }
  ];

  const effects: Effect[] = [
    { id: '1', name: 'Beauty', type: 'beauty', thumbnail: '/api/placeholder/60/60' },
    { id: '2', name: 'Sparkles', type: 'ar', thumbnail: '/api/placeholder/60/60' },
    { id: '3', name: 'Hearts', type: 'ar', thumbnail: '/api/placeholder/60/60' },
    { id: '4', name: 'Blur BG', type: 'background', thumbnail: '/api/placeholder/60/60' },
    { id: '5', name: 'Text Overlay', type: 'text', thumbnail: '/api/placeholder/60/60' },
    { id: '6', name: 'Rainbow', type: 'ar', thumbnail: '/api/placeholder/60/60' },
    { id: '7', name: 'Glow', type: 'beauty', thumbnail: '/api/placeholder/60/60' },
    { id: '8', name: 'Vintage', type: 'beauty', thumbnail: '/api/placeholder/60/60' }
  ];

  const soundTracks: SoundTrack[] = [
    {
      id: '1',
      title: 'Trending Beat #1',
      artist: 'Various Artists',
      duration: 30,
      url: '/api/placeholder/audio',
      thumbnail: '/api/placeholder/60/60',
      trending: true
    },
    {
      id: '2',
      title: 'Chill Vibes',
      artist: 'Lo-Fi Creator',
      duration: 45,
      url: '/api/placeholder/audio',
      thumbnail: '/api/placeholder/60/60',
      trending: false
    }
  ];

  useEffect(() => {
    initializeCamera();
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRecording && !isPaused) {
      interval = setInterval(() => {
        setRecordingTime(prev => {
          if (prev >= maxDuration) {
            handleStopRecording();
            return maxDuration;
          }
          return prev + 0.1;
        });
      }, 100);
    }
    return () => clearInterval(interval);
  }, [isRecording, isPaused, maxDuration]);

  const initializeCamera = async () => {
    setIsInitializingCamera(true);
    setCameraError(null);

    try {
      const constraints = {
        video: {
          facingMode: cameraFacing,
          width: { ideal: 720 },
          height: { ideal: 1280 }
        },
        audio: micEnabled
      };

      const result = await requestCameraPermission(constraints);

      if (result.error) {
        setCameraError(result.error);
        setShowPermissionDialog(true);
        return;
      }

      if (result.stream) {
        streamRef.current = result.stream;
        if (videoRef.current) {
          videoRef.current.srcObject = result.stream;
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

  const handleStartRecording = () => {
    if (!streamRef.current) return;

    try {
      const mediaRecorder = new MediaRecorder(streamRef.current);
      mediaRecorderRef.current = mediaRecorder;
      
      const chunks: Blob[] = [];
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunks.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunks, { type: 'video/webm' });
        const segment: VideoSegment = {
          id: Date.now().toString(),
          blob,
          duration: recordingTime,
          startTime: recordedSegments.reduce((acc, seg) => acc + seg.duration, 0)
        };
        setRecordedSegments(prev => [...prev, segment]);
        setRecordingTime(0);
      };

      mediaRecorder.start();
      setIsRecording(true);
      setIsPaused(false);
    } catch (error) {
      toast({
        title: "Recording Error",
        description: "Failed to start recording",
        variant: "destructive"
      });
    }
  };

  const handleStopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      setIsPaused(false);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getTotalDuration = () => {
    return recordedSegments.reduce((acc, seg) => acc + seg.duration, 0) + recordingTime;
  };

  const handleRetryCamera = () => {
    setShowPermissionDialog(false);
    setCameraError(null);
    initializeCamera();
  };

  const handleCancelCamera = () => {
    setShowPermissionDialog(false);
    // Close the video creator modal/component
  };

  return (
    <div className="flex flex-col h-screen bg-black text-white">
      <div className="flex-1 relative overflow-hidden">
        <video
          ref={videoRef}
          autoPlay
          muted={isMuted}
          playsInline
          className="w-full h-full object-cover"
          style={{ transform: cameraFacing === 'user' ? 'scaleX(-1)' : 'none' }}
        />
        
        <canvas ref={canvasRef} className="hidden" />
        
        {isRecording && (
          <div className="absolute top-4 left-4 flex items-center gap-2">
            <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
            <span className="text-sm font-medium">{formatTime(recordingTime)}</span>
          </div>
        )}
        
        <div className="absolute bottom-32 left-4 right-4">
          <div className="w-full bg-gray-600 rounded-full h-1">
            <div 
              className="bg-red-500 h-1 rounded-full transition-all duration-100"
              style={{ width: `${(getTotalDuration() / maxDuration) * 100}%` }}
            />
          </div>
          <div className="text-xs text-center mt-1">
            {formatTime(getTotalDuration())} / {formatTime(maxDuration)}
          </div>
        </div>
      </div>
      
      <div className="p-4 bg-black space-y-4">
        {/* Quick Actions Row */}
        <div className="flex items-center justify-between">
          <Button variant="ghost" size="sm" onClick={() => setCameraFacing(cameraFacing === 'user' ? 'environment' : 'user')}>
            <RotateCcw className="w-4 h-4 mr-1" />
            Flip
          </Button>
          
          <Button variant="ghost" size="sm" onClick={() => setMicEnabled(!micEnabled)}>
            {micEnabled ? <Mic className="w-4 h-4 mr-1" /> : <MicOff className="w-4 h-4 mr-1" />}
            Mic
          </Button>
          
          <Button variant="ghost" size="sm" onClick={() => setTimer(timer === 0 ? 3 : 0)}>
            <Timer className="w-4 h-4 mr-1" />
            {timer > 0 ? `${timer}s` : 'Timer'}
          </Button>
        </div>

        {/* Filters Row */}
        <div className="flex gap-2 overflow-x-auto no-scrollbar">
          {filters.map(filter => (
            <Button
              key={filter.id}
              variant={currentFilter === filter.id ? "default" : "ghost"}
              size="sm"
              className="flex-shrink-0 text-xs"
              onClick={() => setCurrentFilter(currentFilter === filter.id ? null : filter.id)}
            >
              {filter.name}
            </Button>
          ))}
        </div>

        {/* Main Controls */}
        <div className="flex items-center justify-between">
          <div className="flex flex-col items-center">
            <span className="text-xs mb-2 text-gray-400">Speed</span>
            <div className="flex gap-1">
              {[0.5, 1, 1.5, 2].map(speedValue => (
                <Button
                  key={speedValue}
                  variant={speed === speedValue ? "default" : "ghost"}
                  size="sm"
                  className="text-xs px-2 py-1"
                  onClick={() => setSpeed(speedValue)}
                >
                  {speedValue}x
                </Button>
              ))}
            </div>
          </div>
          
          <div className="flex flex-col items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              className={`w-20 h-20 rounded-full border-4 transition-all duration-200 ${
                isRecording 
                  ? 'border-red-500 bg-red-500 scale-110' 
                  : 'border-white bg-white hover:scale-105'
              }`}
              onClick={isRecording ? handleStopRecording : handleStartRecording}
              disabled={getTotalDuration() >= maxDuration}
            >
              {isRecording ? (
                <Square className="w-8 h-8 text-white" />
              ) : (
                <div className="w-6 h-6 bg-red-500 rounded-full" />
              )}
            </Button>
            {isRecording && (
              <div className="text-xs text-red-400 animate-pulse">Recording...</div>
            )}
          </div>
          
          <div className="flex flex-col items-center gap-2">
            <Button variant="ghost" size="sm" className="text-xs">
              <Sparkles className="w-4 h-4 mr-1" />
              Effects
            </Button>
            <Button variant="ghost" size="sm" className="text-xs">
              <Music className="w-4 h-4 mr-1" />
              Sounds
            </Button>
          </div>
        </div>

        {/* Effects Grid (when effects button is pressed) */}
        <div className="grid grid-cols-4 gap-2">
          {effects.slice(0, 8).map(effect => (
            <Button
              key={effect.id}
              variant={selectedEffects.includes(effect.id) ? "default" : "ghost"}
              size="sm"
              className="aspect-square text-xs flex flex-col"
              onClick={() => {
                setSelectedEffects(prev => 
                  prev.includes(effect.id) 
                    ? prev.filter(id => id !== effect.id)
                    : [...prev, effect.id]
                );
              }}
            >
              <div className="text-lg mb-1">
                {effect.type === 'beauty' && '✨'}
                {effect.type === 'ar' && '🦄'}
                {effect.type === 'background' && '🌈'}
                {effect.type === 'text' && '📝'}
              </div>
              <span className="text-xs">{effect.name}</span>
            </Button>
          ))}
        </div>
      </div>

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

export default EnhancedVideoCreator;
