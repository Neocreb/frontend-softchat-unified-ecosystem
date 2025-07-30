import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  Camera,
  Mic,
  MicOff,
  Video,
  VideoOff,
  Users,
  MessageCircle,
  Gift,
  Target,
  Crown,
  Trophy,
  Clock,
  Settings,
  Share2,
  Heart,
  X,
  Volume2,
  VolumeX,
  Maximize,
  Phone,
  PhoneCall,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import EnhancedLiveBattle from '@/components/battles/EnhancedLiveBattle';
import { TouchOptimizedComponents } from '@/components/mobile/TouchOptimizedComponents';

interface LiveContent {
  id: string;
  type: 'stream' | 'battle';
  title: string;
  description: string;
  user: {
    id: string;
    username: string;
    displayName: string;
    avatar: string;
    verified: boolean;
  };
  isUserOwned?: boolean;
  viewerCount?: number;
  category?: string;
  battleData?: {
    type: 'dance' | 'rap' | 'comedy' | 'general';
    timeRemaining: number;
    scores: {
      user1: number;
      user2: number;
    };
    opponent?: {
      id: string;
      username: string;
      displayName: string;
      avatar: string;
    };
  };
}

interface EnhancedLiveContentCardProps {
  content: LiveContent;
  isActive: boolean;
  isUserOwned?: boolean;
  onEndStream?: () => void;
}

const EnhancedLiveContentCard: React.FC<EnhancedLiveContentCardProps> = ({
  content,
  isActive,
  isUserOwned = false,
  onEndStream,
}) => {
  const { toast } = useToast();
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  
  // Camera and stream state
  const [cameraReady, setCameraReady] = useState(false);
  const [isStreaming, setIsStreaming] = useState(false);
  const [videoEnabled, setVideoEnabled] = useState(true);
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [isInitializing, setIsInitializing] = useState(false);
  const [deviceError, setDeviceError] = useState<string | null>(null);
  
  // UI state
  const [showControls, setShowControls] = useState(true);
  const [chatMessage, setChatMessage] = useState('');
  const [comments, setComments] = useState<any[]>([]);
  
  // Initialize camera for user's own stream
  const initializeCamera = useCallback(async () => {
    if (!isUserOwned || !isActive) return;
    
    try {
      setIsInitializing(true);
      setDeviceError(null);
      
      const constraints = {
        video: {
          width: { ideal: 1280 },
          height: { ideal: 720 },
          facingMode: 'user',
          frameRate: { ideal: 30 }
        },
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true
        }
      };
      
      console.log('Requesting camera access for live content:', constraints);
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        streamRef.current = stream;
        setCameraReady(true);
        setIsStreaming(true);
        
        // Auto-play for user's own feed
        videoRef.current.onloadedmetadata = () => {
          videoRef.current?.play().catch(console.error);
        };
        
        toast({
          title: "🔴 You're Live!",
          description: "Your camera is streaming to viewers",
        });
      }
    } catch (error) {
      console.error('Camera initialization error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to access camera';
      setDeviceError(errorMessage);
      
      toast({
        title: "Camera Access Failed",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsInitializing(false);
    }
  }, [isUserOwned, isActive, toast]);
  
  // Stop camera stream
  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => {
        track.stop();
        console.log(`Stopped ${track.kind} track`);
      });
      streamRef.current = null;
    }
    
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    
    setCameraReady(false);
    setIsStreaming(false);
  }, []);
  
  // Toggle video/audio
  const toggleVideo = useCallback(() => {
    if (!streamRef.current) return;
    
    const videoTrack = streamRef.current.getVideoTracks()[0];
    if (videoTrack) {
      videoTrack.enabled = !videoEnabled;
      setVideoEnabled(!videoEnabled);
    }
  }, [videoEnabled]);
  
  const toggleAudio = useCallback(() => {
    if (!streamRef.current) return;
    
    const audioTrack = streamRef.current.getAudioTracks()[0];
    if (audioTrack) {
      audioTrack.enabled = !audioEnabled;
      setAudioEnabled(!audioEnabled);
    }
  }, [audioEnabled]);
  
  // Initialize camera when component becomes active
  useEffect(() => {
    if (isActive && isUserOwned) {
      initializeCamera();
    } else {
      stopCamera();
    }
    
    return () => {
      stopCamera();
    };
  }, [isActive, isUserOwned, initializeCamera, stopCamera]);
  
  // Auto-hide controls
  useEffect(() => {
    let timeout: NodeJS.Timeout;
    if (showControls) {
      timeout = setTimeout(() => {
        setShowControls(false);
      }, 3000);
    }
    return () => clearTimeout(timeout);
  }, [showControls]);
  
  const sendMessage = () => {
    if (!chatMessage.trim()) return;
    
    const newComment = {
      id: Date.now().toString(),
      user: {
        username: 'you',
        avatar: 'https://i.pravatar.cc/150?u=current',
        verified: false,
      },
      message: chatMessage,
      timestamp: new Date(),
      type: 'message' as const,
    };
    
    setComments(prev => [...prev, newComment]);
    setChatMessage('');
  };

  // Render battle view
  if (content.type === 'battle' && content.battleData) {
    return (
      <div className="relative h-screen w-full bg-black snap-start snap-always">
        <EnhancedLiveBattle
          battleId={content.id}
          creator1={{
            id: content.user.id,
            username: content.user.username,
            displayName: content.user.displayName,
            avatar: content.user.avatar,
            verified: content.user.verified,
            tier: 'pro_creator',
            score: content.battleData.scores.user1,
          }}
          creator2={{
            id: content.battleData.opponent?.id || 'opponent',
            username: content.battleData.opponent?.username || 'opponent',
            displayName: content.battleData.opponent?.displayName || 'Challenger',
            avatar: content.battleData.opponent?.avatar || 'https://i.pravatar.cc/150?img=5',
            verified: false,
            tier: 'rising_star',
            score: content.battleData.scores.user2,
          }}
          battleType={content.battleData.type}
          timeRemaining={content.battleData.timeRemaining}
          isUserOwned={isUserOwned}
          creator1VideoRef={isUserOwned ? videoRef : undefined}
          onEndBattle={onEndStream}
        />
      </div>
    );
  }

  // Render live stream view
  return (
    <div className="relative h-screen w-full bg-black snap-start snap-always"
         onClick={() => setShowControls(!showControls)}>
      
      {/* Video Stream */}
      <div className="absolute inset-0">
        {isUserOwned && cameraReady ? (
          <video
            ref={videoRef}
            className="w-full h-full object-cover"
            autoPlay
            muted
            playsInline
          />
        ) : (
          <div className="w-full h-full bg-gray-900 flex items-center justify-center">
            <div className="text-center text-white">
              <Avatar className="w-24 h-24 mx-auto mb-4">
                <AvatarImage src={content.user.avatar} />
                <AvatarFallback>{content.user.displayName[0]}</AvatarFallback>
              </Avatar>
              <div className="text-lg font-semibold mb-2">{content.user.displayName}</div>
              <div className="text-sm opacity-75">
                {isUserOwned ? 'Setting up your camera...' : 'Live Stream'}
              </div>
              {deviceError && (
                <div className="text-red-400 text-sm mt-2">{deviceError}</div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Stream Info Overlay */}
      <div className="absolute top-4 left-4 right-4">
        <div className="flex justify-between items-start">
          <div className="bg-black/70 rounded-lg p-3 backdrop-blur-sm">
            <div className="flex items-center gap-2 mb-2">
              <Avatar className="w-8 h-8">
                <AvatarImage src={content.user.avatar} />
                <AvatarFallback>{content.user.displayName[0]}</AvatarFallback>
              </Avatar>
              <div>
                <div className="text-white font-medium text-sm">{content.user.displayName}</div>
                <div className="text-gray-300 text-xs">@{content.user.username}</div>
              </div>
              {content.user.verified && <Crown className="w-4 h-4 text-yellow-400" />}
            </div>
            
            <div className="text-white text-sm mb-1">{content.title}</div>
            {content.description && (
              <div className="text-gray-300 text-xs">{content.description}</div>
            )}
            
            <div className="flex items-center gap-3 mt-2 text-xs">
              <Badge variant="secondary" className="bg-red-500/20 text-red-400 animate-pulse">
                LIVE
              </Badge>
              <div className="flex items-center gap-1 text-white">
                <Users className="w-3 h-3" />
                <span>{content.viewerCount || 0}</span>
              </div>
            </div>
          </div>
          
          {!isUserOwned && (
            <Button 
              size="sm" 
              variant="outline"
              className="bg-black/70 border-white/20 text-white hover:bg-white/20"
            >
              Follow
            </Button>
          )}
        </div>
      </div>

      {/* Live Stream Controls */}
      {isUserOwned && showControls && (
        <div className="absolute bottom-20 left-4 right-4">
          <div className="bg-black/70 rounded-lg p-4 backdrop-blur-sm">
            <div className="flex items-center justify-between mb-3">
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant={videoEnabled ? "default" : "destructive"}
                  onClick={toggleVideo}
                >
                  {videoEnabled ? <Video className="w-4 h-4" /> : <VideoOff className="w-4 h-4" />}
                </Button>
                <Button
                  size="sm"
                  variant={audioEnabled ? "default" : "destructive"}
                  onClick={toggleAudio}
                >
                  {audioEnabled ? <Mic className="w-4 h-4" /> : <MicOff className="w-4 h-4" />}
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setIsMuted(!isMuted)}
                >
                  {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                </Button>
              </div>
              
              <div className="flex gap-2">
                <Button size="sm" variant="outline">
                  <Share2 className="w-4 h-4" />
                </Button>
                <Button size="sm" variant="outline">
                  <Settings className="w-4 h-4" />
                </Button>
                {onEndStream && (
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={onEndStream}
                  >
                    End Stream
                  </Button>
                )}
              </div>
            </div>
            
            <div className="text-white text-sm">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1">
                  <Users className="w-4 h-4" />
                  <span>{content.viewerCount || 0} viewers</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  <span>Live for 5:30</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Chat Section for viewers */}
      {!isUserOwned && (
        <TouchOptimizedComponents.MobileChat
          comments={comments}
          newMessage={chatMessage}
          onMessageChange={setChatMessage}
          onSendMessage={sendMessage}
          className="absolute bottom-4 right-4 w-80 max-w-[calc(100vw-2rem)]"
        />
      )}

      {/* Interactive Features for viewers */}
      {!isUserOwned && (
        <div className="absolute right-4 bottom-32 flex flex-col gap-3">
          <Button
            size="icon"
            variant="ghost"
            className="w-12 h-12 rounded-full bg-black/70 hover:bg-black/80 text-white"
          >
            <Heart className="w-6 h-6" />
          </Button>
          <Button
            size="icon"
            variant="ghost"
            className="w-12 h-12 rounded-full bg-black/70 hover:bg-black/80 text-white"
          >
            <Gift className="w-6 h-6" />
          </Button>
          <Button
            size="icon"
            variant="ghost"
            className="w-12 h-12 rounded-full bg-black/70 hover:bg-black/80 text-white"
          >
            <Share2 className="w-6 h-6" />
          </Button>
        </div>
      )}

      {/* Loading state */}
      {isInitializing && (
        <div className="absolute inset-0 bg-black/80 flex items-center justify-center">
          <div className="text-center text-white">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-500 mx-auto mb-4"></div>
            <p>Setting up your camera...</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default EnhancedLiveContentCard;
