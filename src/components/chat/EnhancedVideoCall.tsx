import React, { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Video,
  VideoOff,
  Mic,
  MicOff,
  Phone,
  PhoneOff,
  Settings,
  Monitor,
  Volume2,
  VolumeX,
  MessageSquare,
  Users,
  Maximize,
  Minimize,
  Camera,
  CameraOff,
  MoreVertical,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";

interface CallParticipant {
  id: string;
  name: string;
  avatar: string;
  isVideoEnabled: boolean;
  isAudioEnabled: boolean;
  isScreenSharing: boolean;
  isHost: boolean;
}

interface CallState {
  isActive: boolean;
  isIncoming: boolean;
  isOutgoing: boolean;
  startTime: Date | null;
  participants: CallParticipant[];
  callType: 'voice' | 'video';
  isGroupCall: boolean;
}

interface EnhancedVideoCallProps {
  isOpen: boolean;
  onClose: () => void;
  callData: {
    participant?: {
      id: string;
      name: string;
      avatar: string;
    };
    type: 'voice' | 'video';
    isIncoming?: boolean;
    isGroup?: boolean;
    groupName?: string;
    participants?: CallParticipant[];
  };
  onAccept?: () => void;
  onDecline?: () => void;
  onMute?: (muted: boolean) => void;
  onVideoToggle?: (enabled: boolean) => void;
  onScreenShare?: (sharing: boolean) => void;
}

export const EnhancedVideoCall: React.FC<EnhancedVideoCallProps> = ({
  isOpen,
  onClose,
  callData,
  onAccept,
  onDecline,
  onMute,
  onVideoToggle,
  onScreenShare,
}) => {
  const { toast } = useToast();
  const [callState, setCallState] = useState<CallState>({
    isActive: false,
    isIncoming: callData.isIncoming || false,
    isOutgoing: !callData.isIncoming || false,
    startTime: null,
    participants: callData.participants || [],
    callType: callData.type,
    isGroupCall: callData.isGroup || false,
  });

  const [localControls, setLocalControls] = useState({
    isVideoEnabled: callData.type === 'video',
    isAudioEnabled: true,
    isScreenSharing: false,
    isSpeakerOn: true,
    isFullscreen: false,
  });

  const [callDuration, setCallDuration] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);

  // Call duration timer
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (callState.isActive && callState.startTime) {
      interval = setInterval(() => {
        const now = new Date().getTime();
        const start = callState.startTime!.getTime();
        setCallDuration(Math.floor((now - start) / 1000));
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [callState.isActive, callState.startTime]);

  // Format call duration
  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  const handleAcceptCall = () => {
    setCallState(prev => ({
      ...prev,
      isActive: true,
      isIncoming: false,
      isOutgoing: false,
      startTime: new Date(),
    }));
    onAccept?.();
    toast({
      title: "Call Connected",
      description: `${callData.type === 'video' ? 'Video' : 'Voice'} call started`,
    });
  };

  const handleDeclineCall = () => {
    setCallState(prev => ({
      ...prev,
      isActive: false,
      isIncoming: false,
      isOutgoing: false,
    }));
    onDecline?.();
    onClose();
    toast({
      title: "Call Declined",
      description: "Call has been declined",
    });
  };

  const handleEndCall = () => {
    setCallState(prev => ({
      ...prev,
      isActive: false,
    }));
    onClose();
    
    const duration = callDuration > 0 ? formatDuration(callDuration) : "0:00";
    toast({
      title: "Call Ended",
      description: `Call duration: ${duration}`,
    });
  };

  const toggleVideo = () => {
    const newState = !localControls.isVideoEnabled;
    setLocalControls(prev => ({ ...prev, isVideoEnabled: newState }));
    onVideoToggle?.(newState);
  };

  const toggleAudio = () => {
    const newState = !localControls.isAudioEnabled;
    setLocalControls(prev => ({ ...prev, isAudioEnabled: newState }));
    onMute?.(!newState);
  };

  const toggleScreenShare = () => {
    const newState = !localControls.isScreenSharing;
    setLocalControls(prev => ({ ...prev, isScreenSharing: newState }));
    onScreenShare?.(newState);
    
    toast({
      title: newState ? "Screen Sharing Started" : "Screen Sharing Stopped",
      description: newState ? "Your screen is now being shared" : "Screen sharing has stopped",
    });
  };

  const toggleSpeaker = () => {
    setLocalControls(prev => ({ ...prev, isSpeakerOn: !prev.isSpeakerOn }));
  };

  const toggleFullscreen = () => {
    setLocalControls(prev => ({ ...prev, isFullscreen: !prev.isFullscreen }));
  };

  const renderIncomingCall = () => (
    <div className="flex flex-col items-center justify-center h-full p-8 bg-gradient-to-br from-blue-500 to-purple-600 text-white">
      <div className="text-center mb-8">
        <Avatar className="w-32 h-32 mx-auto mb-4 border-4 border-white">
          <AvatarImage src={callData.participant?.avatar} />
          <AvatarFallback className="text-2xl">
            {callData.participant?.name.substring(0, 2)}
          </AvatarFallback>
        </Avatar>
        <h2 className="text-2xl font-bold mb-2">
          {callData.isGroup ? callData.groupName : callData.participant?.name}
        </h2>
        <p className="text-blue-100 mb-4">
          Incoming {callData.type} call...
        </p>
        <div className="animate-pulse">
          {callData.type === 'video' ? (
            <Video className="w-8 h-8 mx-auto" />
          ) : (
            <Phone className="w-8 h-8 mx-auto" />
          )}
        </div>
      </div>

      <div className="flex gap-6">
        <Button
          onClick={handleDeclineCall}
          size="lg"
          className="bg-red-500 hover:bg-red-600 rounded-full w-16 h-16 p-0"
        >
          <PhoneOff className="w-6 h-6" />
        </Button>
        <Button
          onClick={handleAcceptCall}
          size="lg"
          className="bg-green-500 hover:bg-green-600 rounded-full w-16 h-16 p-0"
        >
          <Phone className="w-6 h-6" />
        </Button>
      </div>
    </div>
  );

  const renderActiveCall = () => (
    <div className="relative h-full bg-black">
      {/* Video Display */}
      {callData.type === 'video' && (
        <div className="relative w-full h-full">
          {/* Remote video */}
          <video
            ref={remoteVideoRef}
            className="w-full h-full object-cover"
            autoPlay
            playsInline
          />
          
          {/* Local video (Picture-in-Picture) */}
          <div className="absolute top-4 right-4 w-48 h-36 bg-gray-800 rounded-lg overflow-hidden border-2 border-white">
            <video
              ref={videoRef}
              className="w-full h-full object-cover"
              autoPlay
              playsInline
              muted
            />
            {!localControls.isVideoEnabled && (
              <div className="absolute inset-0 bg-gray-800 flex items-center justify-center">
                <CameraOff className="w-8 h-8 text-gray-400" />
              </div>
            )}
          </div>

          {/* Screen sharing indicator */}
          {localControls.isScreenSharing && (
            <div className="absolute top-4 left-4">
              <Badge className="bg-red-500">
                <Monitor className="w-3 h-3 mr-1" />
                Sharing Screen
              </Badge>
            </div>
          )}
        </div>
      )}

      {/* Voice call display */}
      {callData.type === 'voice' && (
        <div className="flex flex-col items-center justify-center h-full p-8 bg-gradient-to-br from-gray-800 to-gray-900 text-white">
          <Avatar className="w-32 h-32 mb-6 border-4 border-white">
            <AvatarImage src={callData.participant?.avatar} />
            <AvatarFallback className="text-2xl">
              {callData.participant?.name.substring(0, 2)}
            </AvatarFallback>
          </Avatar>
          <h2 className="text-2xl font-bold mb-2">
            {callData.isGroup ? callData.groupName : callData.participant?.name}
          </h2>
          <p className="text-gray-300 mb-4">
            Voice call in progress
          </p>
          <div className="text-lg font-mono">
            {formatDuration(callDuration)}
          </div>
        </div>
      )}

      {/* Call info overlay */}
      <div className="absolute top-4 left-4 right-4 flex justify-between items-start">
        <div className="bg-black/50 rounded-lg p-3 text-white">
          <h3 className="font-semibold">
            {callData.isGroup ? callData.groupName : callData.participant?.name}
          </h3>
          {callState.isActive && (
            <p className="text-sm text-gray-300">
              {formatDuration(callDuration)}
            </p>
          )}
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="bg-black/50 text-white hover:bg-black/70">
              <MoreVertical className="w-4 h-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={toggleFullscreen}>
              {localControls.isFullscreen ? <Minimize className="w-4 h-4 mr-2" /> : <Maximize className="w-4 h-4 mr-2" />}
              {localControls.isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Settings className="w-4 h-4 mr-2" />
              Settings
            </DropdownMenuItem>
            <DropdownMenuItem>
              <MessageSquare className="w-4 h-4 mr-2" />
              Open Chat
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Call controls */}
      <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2">
        <div className="bg-black/70 rounded-full p-4 flex items-center gap-4">
          <Button
            onClick={toggleAudio}
            variant="ghost"
            size="lg"
            className={`rounded-full w-12 h-12 p-0 ${
              localControls.isAudioEnabled 
                ? 'bg-gray-600 hover:bg-gray-700' 
                : 'bg-red-500 hover:bg-red-600'
            } text-white`}
          >
            {localControls.isAudioEnabled ? (
              <Mic className="w-5 h-5" />
            ) : (
              <MicOff className="w-5 h-5" />
            )}
          </Button>

          {callData.type === 'video' && (
            <Button
              onClick={toggleVideo}
              variant="ghost"
              size="lg"
              className={`rounded-full w-12 h-12 p-0 ${
                localControls.isVideoEnabled 
                  ? 'bg-gray-600 hover:bg-gray-700' 
                  : 'bg-red-500 hover:bg-red-600'
              } text-white`}
            >
              {localControls.isVideoEnabled ? (
                <Camera className="w-5 h-5" />
              ) : (
                <CameraOff className="w-5 h-5" />
              )}
            </Button>
          )}

          <Button
            onClick={toggleScreenShare}
            variant="ghost"
            size="lg"
            className={`rounded-full w-12 h-12 p-0 ${
              localControls.isScreenSharing 
                ? 'bg-blue-500 hover:bg-blue-600' 
                : 'bg-gray-600 hover:bg-gray-700'
            } text-white`}
          >
            <Monitor className="w-5 h-5" />
          </Button>

          <Button
            onClick={toggleSpeaker}
            variant="ghost"
            size="lg"
            className={`rounded-full w-12 h-12 p-0 ${
              localControls.isSpeakerOn 
                ? 'bg-gray-600 hover:bg-gray-700' 
                : 'bg-yellow-500 hover:bg-yellow-600'
            } text-white`}
          >
            {localControls.isSpeakerOn ? (
              <Volume2 className="w-5 h-5" />
            ) : (
              <VolumeX className="w-5 h-5" />
            )}
          </Button>

          <Button
            onClick={handleEndCall}
            size="lg"
            className="bg-red-500 hover:bg-red-600 rounded-full w-12 h-12 p-0 text-white"
          >
            <PhoneOff className="w-5 h-5" />
          </Button>
        </div>
      </div>
    </div>
  );

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl h-[80vh] p-0 overflow-hidden">
        {callState.isIncoming ? renderIncomingCall() : renderActiveCall()}
      </DialogContent>
    </Dialog>
  );
};

export default EnhancedVideoCall;
