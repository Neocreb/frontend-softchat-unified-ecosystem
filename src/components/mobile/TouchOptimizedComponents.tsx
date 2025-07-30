import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Heart,
  MessageCircle,
  Gift,
  Users,
  Share2,
  Volume2,
  VolumeX,
  Crown,
  Sword,
  Shield,
  Sparkles,
  Zap,
  Star,
  Trophy,
  Target,
  Send,
  X,
  ChevronUp,
  ChevronDown,
  MoreHorizontal,
  Settings,
  Flag,
  Camera,
  Mic,
  MicOff,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

// Touch-optimized button sizes for mobile
const MOBILE_BUTTON_SIZE = {
  small: "w-8 h-8",
  medium: "w-10 h-10", 
  large: "w-12 h-12",
  xl: "w-16 h-16"
};

// Compact mobile controls for battles
interface MobileBattleControlsProps {
  onSendGift: () => void;
  onShowReactions: () => void;
  onToggleChat: () => void;
  onShowVoting: () => void;
  onShare: () => void;
  showNotifications?: boolean;
}

export const MobileBattleControls: React.FC<MobileBattleControlsProps> = ({
  onSendGift,
  onShowReactions,
  onToggleChat,
  onShowVoting,
  onShare,
  showNotifications = false,
}) => {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-gradient-to-t from-black via-black/95 to-transparent">
      <div className="flex items-center justify-between p-2 safe-area-inset-bottom">
        {/* Left controls */}
        <div className="flex items-center gap-1">
          <Button
            onClick={onToggleChat}
            variant="ghost"
            className={cn(MOBILE_BUTTON_SIZE.medium, "text-white bg-white/10 hover:bg-white/20 rounded-full")}
          >
            <MessageCircle className="w-5 h-5" />
          </Button>
          <Button
            onClick={onShowReactions}
            variant="ghost"
            className={cn(MOBILE_BUTTON_SIZE.medium, "text-white bg-white/10 hover:bg-white/20 rounded-full")}
          >
            <Heart className="w-5 h-5" />
          </Button>
        </div>

        {/* Center gift button - prominent */}
        <Button
          onClick={onSendGift}
          className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 px-6 py-3 rounded-full shadow-lg"
        >
          <Gift className="w-5 h-5 mr-2" />
          Send Gift
        </Button>

        {/* Right controls */}
        <div className="flex items-center gap-1">
          <Button
            onClick={onShowVoting}
            className="bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded-full text-sm"
          >
            <Target className="w-4 h-4 mr-1" />
            Vote
          </Button>
          <Button
            onClick={onShare}
            variant="ghost"
            className={cn(MOBILE_BUTTON_SIZE.medium, "text-white bg-white/10 hover:bg-white/20 rounded-full")}
          >
            <Share2 className="w-5 h-5" />
          </Button>
        </div>
      </div>
      
      {/* Safe area padding for devices with home indicators */}
      <div className="h-4 bg-black" />
    </div>
  );
};

// Enhanced gift recipient selector with visual feedback
interface GiftRecipientSelectorProps {
  creator1: {
    id: string;
    displayName: string;
    avatar: string;
    verified: boolean;
  };
  creator2: {
    id: string;
    displayName: string;
    avatar: string;
    verified: boolean;
  };
  selectedRecipient: string | null;
  onSelectRecipient: (creatorId: string) => void;
  onCancel: () => void;
}

export const GiftRecipientSelector: React.FC<GiftRecipientSelectorProps> = ({
  creator1,
  creator2,
  selectedRecipient,
  onSelectRecipient,
  onCancel,
}) => {
  return (
    <div className="bg-black/95 backdrop-blur-sm p-4 border-t border-gray-700">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-white font-semibold text-center flex-1">
          Choose recipient for your gift 🎁
        </h3>
        <Button
          variant="ghost"
          size="sm"
          onClick={onCancel}
          className="text-white p-1"
        >
          <X className="w-4 h-4" />
        </Button>
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <Button
          onClick={() => onSelectRecipient(creator1.id)}
          className={cn(
            "flex flex-col items-center gap-3 p-4 h-auto border-2 transition-all duration-200",
            selectedRecipient === creator1.id 
              ? "bg-red-600 hover:bg-red-700 border-red-400 scale-105" 
              : "bg-red-600/20 hover:bg-red-600/40 border-red-600/50"
          )}
        >
          <div className="flex items-center gap-2">
            <Crown className="w-5 h-5 text-yellow-400" />
            <span className="text-lg">👑</span>
          </div>
          <Avatar className="w-12 h-12 border-2 border-white">
            <AvatarImage src={creator1.avatar} />
            <AvatarFallback>{creator1.displayName[0]}</AvatarFallback>
          </Avatar>
          <div className="text-center">
            <div className="font-medium text-white">{creator1.displayName}</div>
            <div className="text-xs text-red-200">Team Red</div>
          </div>
        </Button>
        
        <Button
          onClick={() => onSelectRecipient(creator2.id)}
          className={cn(
            "flex flex-col items-center gap-3 p-4 h-auto border-2 transition-all duration-200",
            selectedRecipient === creator2.id 
              ? "bg-blue-600 hover:bg-blue-700 border-blue-400 scale-105" 
              : "bg-blue-600/20 hover:bg-blue-600/40 border-blue-600/50"
          )}
        >
          <div className="flex items-center gap-2">
            <Sword className="w-5 h-5 text-blue-300" />
            <span className="text-lg">⚔️</span>
          </div>
          <Avatar className="w-12 h-12 border-2 border-white">
            <AvatarImage src={creator2.avatar} />
            <AvatarFallback>{creator2.displayName[0]}</AvatarFallback>
          </Avatar>
          <div className="text-center">
            <div className="font-medium text-white">{creator2.displayName}</div>
            <div className="text-xs text-blue-200">Team Blue</div>
          </div>
        </Button>
      </div>
      
      <div className="text-center mt-3">
        <p className="text-gray-400 text-sm">
          Tap a creator to send them a gift and boost their score! 🚀
        </p>
      </div>
    </div>
  );
};

// Enhanced animal gift grid with rarity effects
interface AnimalGift {
  id: string;
  name: string;
  icon: string;
  value: number;
  rarity: 'common' | 'rare' | 'epic' | 'mythic';
  color: string;
  effect: string;
}

interface AnimalGiftGridProps {
  gifts: AnimalGift[];
  onSendGift: (gift: AnimalGift) => void;
  recipientName?: string;
}

export const AnimalGiftGrid: React.FC<AnimalGiftGridProps> = ({
  gifts,
  onSendGift,
  recipientName,
}) => {
  const { toast } = useToast();
  
  const handleGiftSelect = (gift: AnimalGift) => {
    // Add haptic feedback for mobile
    if ('vibrate' in navigator) {
      navigator.vibrate(gift.rarity === 'mythic' ? [100, 50, 100] : 50);
    }
    
    onSendGift(gift);
    
    toast({
      title: `${gift.icon} ${gift.name} sent!`,
      description: `${recipientName ? `Sent to ${recipientName}` : 'Gift sent!'} (+${gift.value} SP)`,
    });
  };

  const getRarityBorderColor = (rarity: string) => {
    switch (rarity) {
      case 'mythic': return 'border-purple-500 shadow-lg shadow-purple-500/50';
      case 'epic': return 'border-blue-500 shadow-lg shadow-blue-500/30';
      case 'rare': return 'border-yellow-500 shadow-lg shadow-yellow-500/30';
      default: return 'border-gray-500';
    }
  };

  return (
    <div className="bg-black/95 backdrop-blur-sm p-4 border-t border-gray-700">
      <div className="mb-4">
        <h3 className="text-white font-semibold text-center mb-1">
          {recipientName ? `Send gift to ${recipientName}` : 'Choose your gift'}
        </h3>
        <p className="text-gray-400 text-sm text-center">
          Tap an animal to send it and boost their battle score! 🎯
        </p>
      </div>
      
      <div className="grid grid-cols-3 gap-3">
        {gifts.map((gift) => (
          <Button
            key={gift.id}
            onClick={() => handleGiftSelect(gift)}
            className={cn(
              "flex flex-col items-center gap-2 p-3 h-auto border-2 transition-all duration-200 hover:scale-105",
              getRarityBorderColor(gift.rarity),
              gift.rarity === 'mythic' && "animate-pulse",
              "bg-gray-800/50 hover:bg-gray-700/50"
            )}
            variant="outline"
          >
            <div className="relative">
              <div className="text-3xl">{gift.icon}</div>
              {gift.rarity === 'mythic' && (
                <div className="absolute -inset-1 animate-ping">
                  <Sparkles className="w-6 h-6 text-purple-400" />
                </div>
              )}
            </div>
            <div className="text-center">
              <div className="text-xs font-medium text-white">{gift.name}</div>
              <div className={cn("text-xs font-bold", gift.color)}>
                {gift.value} SP
              </div>
              <Badge 
                variant="secondary" 
                className={cn(
                  "text-xs mt-1",
                  gift.rarity === 'mythic' && "bg-purple-600 text-white",
                  gift.rarity === 'epic' && "bg-blue-600 text-white",
                  gift.rarity === 'rare' && "bg-yellow-600 text-black",
                  gift.rarity === 'common' && "bg-gray-600 text-white"
                )}
              >
                {gift.rarity}
              </Badge>
            </div>
          </Button>
        ))}
      </div>
      
      <div className="mt-4 text-center">
        <p className="text-gray-500 text-xs">
          💡 Mythic gifts create screen effects and give the most points!
        </p>
      </div>
    </div>
  );
};

// Quick emoji reactions with floating animations
interface QuickReactionsProps {
  emojis: string[];
  onReaction: (emoji: string) => void;
  onClose: () => void;
}

export const QuickReactions: React.FC<QuickReactionsProps> = ({
  emojis,
  onReaction,
  onClose,
}) => {
  const [selectedEmoji, setSelectedEmoji] = useState<string | null>(null);

  const handleReaction = (emoji: string) => {
    setSelectedEmoji(emoji);
    
    // Add haptic feedback
    if ('vibrate' in navigator) {
      navigator.vibrate(25);
    }
    
    onReaction(emoji);
    
    // Auto-close after selection with small delay for visual feedback
    setTimeout(() => {
      onClose();
    }, 300);
  };

  return (
    <div className="bg-black/90 backdrop-blur-sm p-4 border-t border-gray-700">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-white font-semibold">Quick Reactions</h3>
        <Button
          variant="ghost"
          size="sm"
          onClick={onClose}
          className="text-white p-1"
        >
          <X className="w-4 h-4" />
        </Button>
      </div>
      
      <div className="grid grid-cols-6 gap-3">
        {emojis.map((emoji, index) => (
          <Button
            key={index}
            onClick={() => handleReaction(emoji)}
            className={cn(
              "text-3xl hover:scale-125 transition-all duration-200 p-3 h-auto bg-white/10 hover:bg-white/20 rounded-xl",
              selectedEmoji === emoji && "scale-110 bg-white/30"
            )}
            variant="ghost"
          >
            {emoji}
          </Button>
        ))}
      </div>
      
      <div className="mt-3 text-center">
        <p className="text-gray-400 text-sm">
          React to the battle and show your support! 💪
        </p>
      </div>
    </div>
  );
};

// Compact mobile chat with optimized height
interface MobileChatProps {
  messages: Array<{
    id: string;
    user: {
      username: string;
      avatar: string;
      verified?: boolean;
    };
    message: string;
    timestamp: Date;
    type?: 'message' | 'gift' | 'vote' | 'reaction';
  }>;
  newMessage: string;
  onMessageChange: (message: string) => void;
  onSendMessage: () => void;
  onClose: () => void;
  maxHeight?: string;
}

export const MobileChat: React.FC<MobileChatProps> = ({
  messages,
  newMessage,
  onMessageChange,
  onSendMessage,
  onClose,
  maxHeight = "max-h-64",
}) => {
  const messagesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (messagesRef.current) {
      messagesRef.current.scrollTop = messagesRef.current.scrollHeight;
    }
  }, [messages]);

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      onSendMessage();
    }
  };

  return (
    <div className="bg-black/95 backdrop-blur-sm border-t border-gray-700">
      <div className="p-3">
        {/* Header */}
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-white font-semibold flex items-center gap-2">
            <MessageCircle className="w-4 h-4" />
            Live Chat
          </h3>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="text-white p-1"
          >
            <ChevronDown className="w-4 h-4" />
          </Button>
        </div>

        {/* Messages */}
        <div 
          ref={messagesRef}
          className={cn("overflow-y-auto space-y-2 mb-3", maxHeight)}
        >
          {messages.length > 0 ? (
            messages.slice(-10).map((msg) => (
              <div key={msg.id} className="flex items-start gap-2 text-sm">
                <Avatar className="w-6 h-6 flex-shrink-0">
                  <AvatarImage src={msg.user.avatar} />
                  <AvatarFallback className="text-xs">
                    {msg.user.username[0]}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1">
                    <span className="text-yellow-400 font-medium">
                      {msg.user.username}
                    </span>
                    {msg.user.verified && (
                      <div className="w-3 h-3 bg-blue-500 rounded-full" />
                    )}
                    {msg.type === 'gift' && (
                      <Badge variant="secondary" className="text-xs bg-purple-600">
                        🎁
                      </Badge>
                    )}
                    {msg.type === 'vote' && (
                      <Badge variant="secondary" className="text-xs bg-green-600">
                        🎯
                      </Badge>
                    )}
                  </div>
                  <span className="text-white break-words">{msg.message}</span>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-6 text-gray-400">
              <MessageCircle className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">No messages yet. Be the first to chat!</p>
            </div>
          )}
        </div>

        {/* Input */}
        <div className="flex gap-2">
          <Input
            value={newMessage}
            onChange={(e) => onMessageChange(e.target.value)}
            placeholder="Say something..."
            className="bg-gray-800 border-gray-600 text-white text-sm h-9"
            onKeyPress={handleKeyPress}
          />
          <Button 
            onClick={onSendMessage}
            disabled={!newMessage.trim()}
            size="sm" 
            className="h-9 px-3"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

// Mobile-optimized battle progress bar
interface MobileBattleProgressProps {
  creator1: {
    name: string;
    score: number;
    avatar: string;
  };
  creator2: {
    name: string;
    score: number;
    avatar: string;
  };
  timeRemaining: number;
  className?: string;
}

export const MobileBattleProgress: React.FC<MobileBattleProgressProps> = ({
  creator1,
  creator2,
  timeRemaining,
  className,
}) => {
  const totalScore = creator1.score + creator2.score;
  const creator1Percentage = totalScore > 0 ? (creator1.score / totalScore) * 100 : 50;
  const creator2Percentage = totalScore > 0 ? (creator2.score / totalScore) * 100 : 50;
  
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getLeadingCreator = () => {
    return creator1.score > creator2.score ? creator1 : creator2;
  };

  return (
    <div className={cn("bg-black/70 backdrop-blur-sm rounded-lg p-3", className)}>
      {/* Time remaining */}
      <div className="text-center mb-3">
        <div className="text-2xl font-bold text-white">
          {formatTime(timeRemaining)}
        </div>
        {timeRemaining <= 30 && (
          <div className="text-yellow-400 text-sm animate-pulse">
            Final moments!
          </div>
        )}
      </div>

      {/* Scores */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <Avatar className="w-8 h-8 border-2 border-red-400">
            <AvatarImage src={creator1.avatar} />
            <AvatarFallback>{creator1.name[0]}</AvatarFallback>
          </Avatar>
          <span className="text-white font-medium text-sm">{creator1.score}</span>
        </div>
        <div className="text-white font-bold text-lg">VS</div>
        <div className="flex items-center gap-2">
          <span className="text-white font-medium text-sm">{creator2.score}</span>
          <Avatar className="w-8 h-8 border-2 border-blue-400">
            <AvatarImage src={creator2.avatar} />
            <AvatarFallback>{creator2.name[0]}</AvatarFallback>
          </Avatar>
        </div>
      </div>

      {/* Progress bar */}
      <div className="relative h-6 bg-gray-600 rounded-full overflow-hidden">
        <div 
          className="absolute left-0 top-0 h-full bg-red-500 transition-all duration-1000"
          style={{ width: `${creator1Percentage}%` }}
        />
        <div 
          className="absolute right-0 top-0 h-full bg-blue-500 transition-all duration-1000"
          style={{ width: `${creator2Percentage}%` }}
        />
        
        {/* Leader indicator */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="bg-yellow-400 text-black px-2 py-1 rounded-full text-xs font-bold">
            {getLeadingCreator().name} LEADS
          </div>
        </div>
      </div>
    </div>
  );
};

// Stream owner controls for mobile
interface MobileStreamControlsProps {
  videoEnabled: boolean;
  audioEnabled: boolean;
  onToggleVideo: () => void;
  onToggleAudio: () => void;
  onEndStream: () => void;
  onSettings: () => void;
  guestRequests?: number;
  onGuestRequests?: () => void;
}

export const MobileStreamControls: React.FC<MobileStreamControlsProps> = ({
  videoEnabled,
  audioEnabled,
  onToggleVideo,
  onToggleAudio,
  onEndStream,
  onSettings,
  guestRequests = 0,
  onGuestRequests,
}) => {
  return (
    <div className="fixed bottom-20 left-4 z-40 flex flex-col gap-2">
      <Button
        onClick={onToggleVideo}
        size="icon"
        className={cn(
          MOBILE_BUTTON_SIZE.medium,
          "rounded-full transition-all",
          !videoEnabled && "bg-red-500 hover:bg-red-600 scale-110"
        )}
        variant={videoEnabled ? "secondary" : "destructive"}
      >
        <Camera className="w-4 h-4" />
      </Button>
      
      <Button
        onClick={onToggleAudio}
        size="icon"
        className={cn(
          MOBILE_BUTTON_SIZE.medium,
          "rounded-full transition-all",
          !audioEnabled && "bg-red-500 hover:bg-red-600 scale-110"
        )}
        variant={audioEnabled ? "secondary" : "destructive"}
      >
        {audioEnabled ? <Mic className="w-4 h-4" /> : <MicOff className="w-4 h-4" />}
      </Button>
      
      {guestRequests > 0 && onGuestRequests && (
        <Button
          onClick={onGuestRequests}
          size="icon"
          className={cn(
            MOBILE_BUTTON_SIZE.medium,
            "rounded-full bg-yellow-500 hover:bg-yellow-600 relative animate-pulse"
          )}
        >
          <Users className="w-4 h-4" />
          <Badge className="absolute -top-1 -right-1 bg-red-500 text-white text-xs px-1 min-w-5 h-5 flex items-center justify-center">
            {guestRequests}
          </Badge>
        </Button>
      )}
      
      <Button
        onClick={onSettings}
        size="icon"
        variant="secondary"
        className={cn(MOBILE_BUTTON_SIZE.medium, "rounded-full")}
      >
        <Settings className="w-4 h-4" />
      </Button>
      
      <Button
        onClick={onEndStream}
        size="icon"
        variant="destructive"
        className={cn(MOBILE_BUTTON_SIZE.medium, "rounded-full")}
      >
        <X className="w-4 h-4" />
      </Button>
    </div>
  );
};

export {
  MOBILE_BUTTON_SIZE,
};
