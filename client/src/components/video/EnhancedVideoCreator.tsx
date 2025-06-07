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
    { id: '5', name: 'Text Overlay', type: 'text', thumbnail: '/api/placeholder/60/60' }
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
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { 
          facingMode: cameraFacing,
          width: { ideal: 720 },
          height: { ideal: 1280 }
        },
        audio: micEnabled
      });
      
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (error) {
      toast({
        title: "Camera Access Error",
        description: "Unable to access camera. Please check permissions.",
        variant: "destructive"
      });
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
      
      <div className="p-4 bg-black">
        <div className="flex items-center justify-between">
          <div className="flex flex-col items-center">
            <span className="text-xs mb-1">Speed</span>
            <div className="flex gap-1">
              {[0.5, 1, 1.5, 2].map(speedValue => (
                <Button
                  key={speedValue}
                  variant={speed === speedValue ? "default" : "ghost"}
                  size="sm"
                  className="text-xs"
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
              className="w-20 h-20 rounded-full border-4 border-white bg-red-500"
              onClick={isRecording ? handleStopRecording : handleStartRecording}
              disabled={getTotalDuration() >= maxDuration}
            >
              {isRecording ? (
                <Square className="w-8 h-8" />
              ) : (
                <div className="w-6 h-6 bg-white rounded-full" />
              )}
            </Button>
          </div>
          
          <div className="flex flex-col items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              className="text-xs"
              onClick={() => setTimer(3)}
            >
              <Timer className="w-3 h-3 mr-1" />
              3s
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EnhancedVideoCreator;