import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import {
  Radio,
  Users,
  Video,
  VideoOff,
  Mic,
  MicOff,
  Settings,
  Square,
  Play,
  Crown,
  Target,
  Flame,
  Eye,
  Heart,
  MessageCircle,
  Gift,
  Share2,
  Volume2,
  VolumeX,
  Plus,
  ArrowLeft,
  Camera,
  Loader2,
  AlertCircle,
  CheckCircle,
  Zap,
  Sparkles,
  Trophy,
  Coins,
  UserCheck,
  UserX,
  X,
  Maximize,
  Minimize,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import EnhancedLiveBattle from '@/components/battles/EnhancedLiveBattle';
import { MobileBattleControls, GiftRecipientSelector, AnimalGiftGrid, QuickReactions, MobileChat, MobileBattleProgress, MobileStreamControls } from '@/components/mobile/TouchOptimizedComponents';

// Mock data for live content
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
  viewerCount: number;
  isActive: boolean;
  startedAt: Date;
  thumbnail?: string;
  battleData?: {
    opponent?: {
      id: string;
      username: string;
      displayName: string;
      avatar: string;
      verified: boolean;
    };
    scores?: {
      user1: number;
      user2: number;
    };
    timeRemaining?: number;
  };
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
  status: 'pending' | 'approved' | 'rejected';
}

const mockLiveContent: LiveContent[] = [
  {
    id: 'live-1',
    type: 'stream',
    title: 'Crypto Trading Tips & Analysis 🚀',
    description: 'Live market analysis and trading strategies for beginners',
    user: {
      id: 'user-1',
      username: 'crypto_king',
      displayName: 'Crypto King',
      avatar: 'https://i.pravatar.cc/150?img=1',
      verified: true,
    },
    viewerCount: 1247,
    isActive: true,
    startedAt: new Date(Date.now() - 30 * 60 * 1000),
    thumbnail: 'https://images.unsplash.com/photo-1640340434855-6084b1f4901c?w=800',
  },
  {
    id: 'battle-1',
    type: 'battle',
    title: 'Epic Creator Battle 🔥',
    description: 'Two creators compete for the ultimate crown!',
    user: {
      id: 'user-2',
      username: 'creator_one',
      displayName: 'Creator One',
      avatar: 'https://i.pravatar.cc/150?img=2',
      verified: true,
    },
    viewerCount: 2891,
    isActive: true,
    startedAt: new Date(Date.now() - 15 * 60 * 1000),
    battleData: {
      opponent: {
        id: 'user-3',
        username: 'creator_two',
        displayName: 'Creator Two',
        avatar: 'https://i.pravatar.cc/150?img=3',
        verified: false,
      },
      scores: {
        user1: 1250,
        user2: 980,
      },
      timeRemaining: 180,
    },
  },
];

const animalGifts = [
  { id: '1', name: 'Lion', icon: '🦁', value: 10, rarity: 'common' as const, color: 'text-yellow-500', effect: 'roar' },
  { id: '2', name: 'Dragon', icon: '🐉', value: 50, rarity: 'rare' as const, color: 'text-red-500', effect: 'fire' },
  { id: '3', name: 'Tiger', icon: '🐅', value: 25, rarity: 'common' as const, color: 'text-orange-500', effect: 'prowl' },
  { id: '4', name: 'Eagle', icon: '🦅', value: 75, rarity: 'epic' as const, color: 'text-blue-500', effect: 'soar' },
  { id: '5', name: 'Panda', icon: '🐼', value: 100, rarity: 'rare' as const, color: 'text-green-500', effect: 'bamboo' },
  { id: '6', name: 'Unicorn', icon: '🦄', value: 500, rarity: 'mythic' as const, color: 'text-purple-500', effect: 'magic' },
];

const Live: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  
  // Refs for stream management
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  
  // Main state
  const [activeTab, setActiveTab] = useState(searchParams.get('tab') || 'browse');
  const [selectedContent, setSelectedContent] = useState<LiveContent | null>(null);
  const [showBattle, setShowBattle] = useState(false);
  
  // Camera and streaming state
  const [isStreaming, setIsStreaming] = useState(false);
  const [isPreviewing, setIsPreviewing] = useState(false);
  const [isInitializing, setIsInitializing] = useState(false);
  const [cameraReady, setCameraReady] = useState(false);
  const [videoEnabled, setVideoEnabled] = useState(true);
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [deviceError, setDeviceError] = useState<string | null>(null);
  
  // Stream setup
  const [streamTitle, setStreamTitle] = useState('');
  const [streamDescription, setStreamDescription] = useState('');
  const [streamType, setStreamType] = useState<'stream' | 'battle'>('stream');
  const [showStreamSetup, setShowStreamSetup] = useState(false);
  const [showEndStreamDialog, setShowEndStreamDialog] = useState(false);
  
  // Guest management
  const [guestRequests, setGuestRequests] = useState<GuestRequest[]>([]);
  const [showGuestModal, setShowGuestModal] = useState(false);
  
  // Live stats
  const [viewerCount, setViewerCount] = useState(0);
  const [streamDuration, setStreamDuration] = useState(0);
  
  // Mobile state
  const [isMobile] = useState(window.innerWidth < 768);
  
  // Initialize camera for streaming
  const initializeCamera = useCallback(async () => {
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
      
      console.log('Requesting camera access:', constraints);
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        streamRef.current = stream;
        setCameraReady(true);
        setIsPreviewing(true);
        
        // Wait for video metadata
        videoRef.current.onloadedmetadata = () => {
          videoRef.current?.play().catch(console.error);
        };
        
        toast({
          title: "Camera Ready! 📹",
          description: "Your camera preview is active",
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
  }, [toast]);
  
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
    setIsPreviewing(false);
  }, []);
  
  // Toggle video/audio
  const toggleVideo = useCallback(() => {
    if (!streamRef.current) return;
    
    const videoTrack = streamRef.current.getVideoTracks()[0];
    if (videoTrack) {
      videoTrack.enabled = !videoEnabled;
      setVideoEnabled(!videoEnabled);
      
      toast({
        title: videoEnabled ? "Camera Off" : "Camera On",
        description: videoEnabled ? "Camera disabled" : "Camera enabled",
      });
    }
  }, [videoEnabled, toast]);
  
  const toggleAudio = useCallback(() => {
    if (!streamRef.current) return;
    
    const audioTrack = streamRef.current.getAudioTracks()[0];
    if (audioTrack) {
      audioTrack.enabled = !audioEnabled;
      setAudioEnabled(!audioEnabled);
      
      toast({
        title: audioEnabled ? "Microphone Off" : "Microphone On",
        description: audioEnabled ? "Microphone muted" : "Microphone enabled",
      });
    }
  }, [audioEnabled, toast]);
  
  // Start live stream
  const startStream = async () => {
    if (!streamTitle.trim()) {
      toast({
        title: "Title Required",
        description: "Please enter a title for your stream",
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
      setStreamDuration(0);
      setShowStreamSetup(false);
      
      toast({
        title: "🔴 Stream Started!",
        description: "You're now live!",
      });
      
      // Switch to appropriate tab
      setActiveTab(streamType === 'battle' ? 'battle' : 'my-stream');
    } catch (error) {
      console.error('Error starting stream:', error);
      toast({
        title: "Stream Error",
        description: "Failed to start stream",
        variant: "destructive",
      });
      setIsStreaming(false);
    }
  };
  
  // End stream
  const endStream = async () => {
    try {
      setIsStreaming(false);
      stopCamera();
      setShowEndStreamDialog(false);
      
      toast({
        title: "Stream Ended",
        description: `Stream lasted ${formatDuration(streamDuration)} with ${viewerCount} viewers`,
      });
      
      // Reset form
      setStreamTitle('');
      setStreamDescription('');
      setViewerCount(0);
      setStreamDuration(0);
      setGuestRequests([]);
      setActiveTab('browse');
    } catch (error) {
      console.error('Error ending stream:', error);
    }
  };
  
  // Handle guest request
  const handleGuestRequest = (guestId: string, action: 'approve' | 'reject') => {
    setGuestRequests(prev => 
      prev.map(guest => 
        guest.id === guestId 
          ? { ...guest, status: action === 'approve' ? 'approved' : 'rejected' }
          : guest
      )
    );
    
    const guest = guestRequests.find(g => g.id === guestId);
    if (guest) {
      toast({
        title: action === 'approve' ? "Guest Approved ✅" : "Guest Rejected ❌",
        description: `${guest.user.name} ${action === 'approve' ? 'can now join' : 'was rejected'}`,
      });
    }
  };
  
  // Stream duration timer
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isStreaming) {
      interval = setInterval(() => {
        setStreamDuration(prev => prev + 1);
        setViewerCount(prev => Math.max(1, prev + Math.floor(Math.random() * 5) - 2));
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isStreaming]);
  
  // Simulate guest requests
  useEffect(() => {
    if (!isStreaming) return;
    
    const interval = setInterval(() => {
      if (Math.random() < 0.2 && guestRequests.length < 3) {
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
          status: 'pending',
        };
        setGuestRequests(prev => [...prev, mockGuest]);
      }
    }, 10000);
    
    return () => clearInterval(interval);
  }, [isStreaming, guestRequests.length]);
  
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
  
  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };
  
  const pendingGuests = guestRequests.filter(g => g.status === 'pending');

  // Show battle if selected
  if (showBattle && selectedContent?.type === 'battle' && selectedContent.battleData) {
    return (
      <EnhancedLiveBattle
        battleId={selectedContent.id}
        creator1={{
          id: selectedContent.user.id,
          username: selectedContent.user.username,
          displayName: selectedContent.user.displayName,
          avatar: selectedContent.user.avatar,
          verified: selectedContent.user.verified,
          tier: 'pro_creator',
          score: selectedContent.battleData.scores?.user1 || 0,
        }}
        creator2={{
          id: selectedContent.battleData.opponent?.id || 'opponent',
          username: selectedContent.battleData.opponent?.username || 'opponent',
          displayName: selectedContent.battleData.opponent?.displayName || 'Opponent',
          avatar: selectedContent.battleData.opponent?.avatar || '',
          verified: selectedContent.battleData.opponent?.verified || false,
          tier: 'pro_creator',
          score: selectedContent.battleData.scores?.user2 || 0,
        }}
        duration={selectedContent.battleData.timeRemaining || 300}
        onBattleEnd={(winnerId) => {
          console.log('Battle ended, winner:', winnerId);
          setShowBattle(false);
          setSelectedContent(null);
        }}
        onExit={() => {
          setShowBattle(false);
          setSelectedContent(null);
        }}
      />
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <Helmet>
        <title>Live & Battles | SoftChat</title>
        <meta name="description" content="Watch live streams and epic creator battles" />
      </Helmet>
      
      {/* Header */}
      <div className="sticky top-0 z-40 bg-black/90 backdrop-blur-md border-b border-gray-800">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate('/app/feed')}
              className="text-white hover:bg-white/10"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div>
              <h1 className="text-white font-semibold text-xl">Live & Battles</h1>
              <p className="text-gray-400 text-sm">Watch or create live content</p>
            </div>
          </div>
          
          <Button
            onClick={() => setShowStreamSetup(true)}
            className="bg-red-500 hover:bg-red-600 text-white"
          >
            <Radio className="w-4 h-4 mr-2" />
            Go Live
          </Button>
        </div>
      </div>
      
      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="w-full bg-gray-900 border-b border-gray-800 rounded-none">
          <TabsTrigger value="browse" className="flex-1">Browse Live</TabsTrigger>
          <TabsTrigger value="battles" className="flex-1">Battles</TabsTrigger>
          {isStreaming && (
            <TabsTrigger value="my-stream" className="flex-1">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                My Stream
              </div>
            </TabsTrigger>
          )}
        </TabsList>
        
        {/* Browse Live Content */}
        <TabsContent value="browse" className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {mockLiveContent.filter(c => c.type === 'stream').map((content) => (
              <Card key={content.id} className="bg-gray-900 border-gray-700 overflow-hidden cursor-pointer hover:bg-gray-800 transition-colors">
                <div className="relative aspect-video">
                  <img 
                    src={content.thumbnail} 
                    alt={content.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <Badge className="absolute top-2 left-2 bg-red-500 text-white animate-pulse">
                    <Radio className="w-3 h-3 mr-1" />
                    LIVE
                  </Badge>
                  <div className="absolute bottom-2 right-2 bg-black/70 px-2 py-1 rounded text-sm">
                    <Eye className="w-3 h-3 inline mr-1" />
                    {formatNumber(content.viewerCount)}
                  </div>
                </div>
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <Avatar className="w-10 h-10">
                      <AvatarImage src={content.user.avatar} />
                      <AvatarFallback>{content.user.displayName[0]}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-white line-clamp-2">{content.title}</h3>
                      <div className="flex items-center gap-1 mt-1">
                        <span className="text-gray-400 text-sm">{content.user.username}</span>
                        {content.user.verified && (
                          <CheckCircle className="w-4 h-4 text-blue-500" />
                        )}
                      </div>
                      <p className="text-gray-500 text-sm mt-1 line-clamp-1">{content.description}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
        
        {/* Battles */}
        <TabsContent value="battles" className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {mockLiveContent.filter(c => c.type === 'battle').map((content) => (
              <Card 
                key={content.id} 
                className="bg-gray-900 border-gray-700 overflow-hidden cursor-pointer hover:bg-gray-800 transition-colors"
                onClick={() => {
                  setSelectedContent(content);
                  setShowBattle(true);
                }}
              >
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-4">
                    <Badge className="bg-red-500 text-white animate-pulse">
                      <Target className="w-3 h-3 mr-1" />
                      LIVE BATTLE
                    </Badge>
                    <div className="text-yellow-400 font-bold">
                      {formatDuration((content.battleData?.timeRemaining || 0))}
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <Avatar className="w-12 h-12 border-2 border-red-400">
                        <AvatarImage src={content.user.avatar} />
                        <AvatarFallback>{content.user.displayName[0]}</AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium">{content.user.displayName}</div>
                        <div className="text-red-400 text-sm">{content.battleData?.scores?.user1 || 0} SP</div>
                      </div>
                    </div>
                    
                    <div className="text-white font-bold text-lg">VS</div>
                    
                    <div className="flex items-center gap-2">
                      <div className="text-right">
                        <div className="font-medium">{content.battleData?.opponent?.displayName}</div>
                        <div className="text-blue-400 text-sm">{content.battleData?.scores?.user2 || 0} SP</div>
                      </div>
                      <Avatar className="w-12 h-12 border-2 border-blue-400">
                        <AvatarImage src={content.battleData?.opponent?.avatar} />
                        <AvatarFallback>{content.battleData?.opponent?.displayName[0]}</AvatarFallback>
                      </Avatar>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between text-sm text-gray-400">
                    <div className="flex items-center gap-1">
                      <Users className="w-4 h-4" />
                      {formatNumber(content.viewerCount)} watching
                    </div>
                    <Button size="sm" className="bg-green-600 hover:bg-green-700">
                      Join Battle
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
        
        {/* My Stream */}
        {isStreaming && (
          <TabsContent value="my-stream" className="p-0">
            <div className="relative h-[calc(100vh-140px)] bg-black">
              {/* Camera Preview */}
              <video
                ref={videoRef}
                autoPlay
                muted
                playsInline
                className="w-full h-full object-cover"
              />
              
              {!isPreviewing && (
                <div className="absolute inset-0 flex items-center justify-center bg-gray-800">
                  <div className="text-center text-white">
                    <Camera className="h-16 w-16 mx-auto mb-4 opacity-50" />
                    <p className="text-lg mb-4">Camera Preview</p>
                    {deviceError && (
                      <div className="mb-4 p-3 bg-red-500/20 border border-red-500 rounded-lg max-w-md mx-auto">
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
                          Start Camera
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              )}
              
              {/* Stream Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/30">
                {/* Top Stats */}
                <div className="absolute top-4 left-4 right-4 flex justify-between items-start">
                  <div className="flex items-center gap-2">
                    <Badge className="bg-red-500 text-white animate-pulse">
                      🔴 LIVE • {formatDuration(streamDuration)}
                    </Badge>
                    <Badge variant="secondary" className="flex items-center gap-1">
                      <Eye className="h-3 w-3" />
                      {formatNumber(viewerCount)}
                    </Badge>
                  </div>
                  {pendingGuests.length > 0 && (
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
                
                {/* Stream Info */}
                <div className="absolute bottom-4 left-4 right-4">
                  <div className="bg-black/70 rounded-lg p-4 backdrop-blur-sm">
                    <h3 className="font-semibold text-lg text-white mb-1">{streamTitle}</h3>
                    <p className="text-gray-300 text-sm">{streamDescription}</p>
                  </div>
                </div>
              </div>
              
              {/* Mobile Stream Controls */}
              {isMobile && isPreviewing && (
                <MobileStreamControls
                  videoEnabled={videoEnabled}
                  audioEnabled={audioEnabled}
                  onToggleVideo={toggleVideo}
                  onToggleAudio={toggleAudio}
                  onEndStream={() => setShowEndStreamDialog(true)}
                  onSettings={() => {}}
                  guestRequests={pendingGuests.length}
                  onGuestRequests={() => setShowGuestModal(true)}
                />
              )}
              
              {/* Desktop Controls */}
              {!isMobile && isPreviewing && (
                <div className="absolute bottom-4 right-4 flex gap-2">
                  <Button
                    onClick={toggleVideo}
                    variant="secondary"
                    size="sm"
                    className={cn(
                      "opacity-90",
                      !videoEnabled && "bg-red-500 text-white"
                    )}
                  >
                    {videoEnabled ? <Video className="h-4 w-4" /> : <VideoOff className="h-4 w-4" />}
                  </Button>
                  <Button
                    onClick={toggleAudio}
                    variant="secondary"
                    size="sm"
                    className={cn(
                      "opacity-90",
                      !audioEnabled && "bg-red-500 text-white"
                    )}
                  >
                    {audioEnabled ? <Mic className="h-4 w-4" /> : <MicOff className="h-4 w-4" />}
                  </Button>
                  <Button
                    onClick={() => setShowEndStreamDialog(true)}
                    variant="destructive"
                    size="sm"
                    className="opacity-90"
                  >
                    <Square className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </div>
          </TabsContent>
        )}
      </Tabs>
      
      {/* Stream Setup Dialog */}
      <Dialog open={showStreamSetup} onOpenChange={setShowStreamSetup}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Start Live Stream</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="title">Stream Title *</Label>
              <Input
                id="title"
                value={streamTitle}
                onChange={(e) => setStreamTitle(e.target.value)}
                placeholder="What's your stream about?"
                className="mt-1"
              />
            </div>
            
            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={streamDescription}
                onChange={(e) => setStreamDescription(e.target.value)}
                placeholder="Tell viewers what to expect..."
                rows={3}
                className="mt-1"
              />
            </div>
            
            <div>
              <Label>Stream Type</Label>
              <div className="grid grid-cols-2 gap-2 mt-2">
                <Button
                  variant={streamType === 'stream' ? 'default' : 'outline'}
                  onClick={() => setStreamType('stream')}
                  className="justify-start"
                >
                  <Radio className="w-4 h-4 mr-2" />
                  Live Stream
                </Button>
                <Button
                  variant={streamType === 'battle' ? 'default' : 'outline'}
                  onClick={() => setStreamType('battle')}
                  className="justify-start"
                >
                  <Target className="w-4 h-4 mr-2" />
                  Battle
                </Button>
              </div>
            </div>
            
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                onClick={() => setShowStreamSetup(false)}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button 
                onClick={startStream}
                disabled={!streamTitle.trim()}
                className="flex-1 bg-red-500 hover:bg-red-600"
              >
                <Radio className="w-4 h-4 mr-2" />
                Go Live
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
      
      {/* End Stream Confirmation */}
      <AlertDialog open={showEndStreamDialog} onOpenChange={setShowEndStreamDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>End Live Stream?</AlertDialogTitle>
            <AlertDialogDescription>
              Your stream will end immediately. You currently have {viewerCount} viewers watching.
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
          </DialogHeader>
          <div className="space-y-3 max-h-64 overflow-y-auto">
            {pendingGuests.map((guest) => (
              <div key={guest.id} className="flex items-center gap-3 p-3 border rounded-lg">
                <Avatar className="w-10 h-10">
                  <AvatarImage src={guest.user.avatar} />
                  <AvatarFallback>{guest.user.name[0]}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="flex items-center gap-1">
                    <span className="font-medium">{guest.user.name}</span>
                    {guest.user.verified && (
                      <CheckCircle className="w-4 h-4 text-blue-500" />
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground">@{guest.user.username}</p>
                </div>
                <div className="flex gap-1">
                  <Button
                    onClick={() => handleGuestRequest(guest.id, 'approve')}
                    size="sm"
                    className="bg-green-600 hover:bg-green-700 px-2"
                  >
                    <UserCheck className="w-4 h-4" />
                  </Button>
                  <Button
                    onClick={() => handleGuestRequest(guest.id, 'reject')}
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
    </div>
  );
};

export default Live;
