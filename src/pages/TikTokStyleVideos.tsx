import React, { useState, useEffect } from 'react';
import {
  Heart,
  MessageCircle,
  Share2,
  Gift,
  Users,
  Flame,
  Crown,
  Trophy,
  Zap,
  Coins,
  Play,
  Volume2,
  VolumeX,
  MoreHorizontal,
  Plus,
  Search,
  Home,
  Compass,
  PlusSquare,
  User,
  Bell,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import TikTokStyleBattle from '@/components/battles/TikTokStyleBattle';

interface Creator {
  id: string;
  username: string;
  displayName: string;
  avatar: string;
  verified: boolean;
  followers: number;
  isLive: boolean;
}

interface Video {
  id: string;
  creator: Creator;
  title: string;
  description: string;
  likes: number;
  comments: number;
  shares: number;
  duration: number;
  thumbnail: string;
  isLiked: boolean;
}

interface LiveBattle {
  id: string;
  creator1: Creator;
  creator2: Creator;
  viewers: number;
  duration: number;
  isLive: boolean;
  startTime: Date;
}

const TikTokStyleVideos: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'fyp' | 'live' | 'battles'>('fyp');
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [showBattle, setShowBattle] = useState(false);
  const [selectedBattle, setSelectedBattle] = useState<LiveBattle | null>(null);

  // Mock data
  const videos: Video[] = [
    {
      id: '1',
      creator: {
        id: 'creator1',
        username: 'originallaw',
        displayName: 'Originallaw...',
        avatar: 'https://i.pravatar.cc/100?u=creator1',
        verified: true,
        followers: 11000,
        isLive: false,
      },
      title: 'good cooking 😂😂😂',
      description: 'Amazing cooking skills! #cooking #funny',
      likes: 234,
      comments: 12,
      shares: 8,
      duration: 30,
      thumbnail: 'https://i.pravatar.cc/400?u=video1',
      isLiked: false,
    },
    {
      id: '2',
      creator: {
        id: 'creator2',
        username: 'emmycee',
        displayName: 'EMMY CEE',
        avatar: 'https://i.pravatar.cc/100?u=creator2',
        verified: true,
        followers: 34200,
        isLive: true,
      },
      title: 'Live Battle Challenge',
      description: 'Join the epic battle! #battle #live',
      likes: 1200,
      comments: 89,
      shares: 45,
      duration: 0, // Live
      thumbnail: 'https://i.pravatar.cc/400?u=video2',
      isLiked: true,
    },
  ];

  const liveBattles: LiveBattle[] = [
    {
      id: 'battle1',
      creator1: {
        id: 'creator1',
        username: 'originallaw',
        displayName: 'Originallaw',
        avatar: 'https://i.pravatar.cc/100?u=creator1',
        verified: true,
        followers: 11000,
        isLive: true,
      },
      creator2: {
        id: 'creator2',
        username: 'emmycee',
        displayName: 'EMMY CEE',
        avatar: 'https://i.pravatar.cc/100?u=creator2',
        verified: true,
        followers: 34200,
        isLive: true,
      },
      viewers: 741,
      duration: 300,
      isLive: true,
      startTime: new Date(Date.now() - 120000), // Started 2 minutes ago
    },
    {
      id: 'battle2',
      creator1: {
        id: 'creator3',
        username: 'kenzgirl',
        displayName: 'KENZ Girl',
        avatar: 'https://i.pravatar.cc/100?u=creator3',
        verified: false,
        followers: 8500,
        isLive: true,
      },
      creator2: {
        id: 'creator4',
        username: 'ajejunior',
        displayName: 'Aje Junior',
        avatar: 'https://i.pravatar.cc/100?u=creator4',
        verified: false,
        followers: 5200,
        isLive: true,
      },
      viewers: 342,
      duration: 300,
      isLive: true,
      startTime: new Date(Date.now() - 45000), // Started 45 seconds ago
    },
  ];

  const currentVideo = videos[currentVideoIndex];

  const handleLike = () => {
    // Toggle like state
  };

  const handleShare = () => {
    // Share functionality
  };

  const handleComment = () => {
    // Open comments
  };

  const joinBattle = (battle: LiveBattle) => {
    setSelectedBattle(battle);
    setShowBattle(true);
  };

  if (showBattle && selectedBattle) {
    return (
      <TikTokStyleBattle
        battleId={selectedBattle.id}
        creator1={selectedBattle.creator1}
        creator2={selectedBattle.creator2}
        duration={selectedBattle.duration}
        onExit={() => {
          setShowBattle(false);
          setSelectedBattle(null);
        }}
      />
    );
  }

  return (
    <div className="h-screen bg-black flex flex-col relative">
      {/* Status Bar */}
      <div className="flex items-center justify-between p-3 text-white text-sm bg-black/50 absolute top-0 left-0 right-0 z-20">
        <div className="flex items-center gap-1">
          <span>3:27</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1">
            <div className="w-1 h-1 bg-white rounded-full"></div>
            <div className="w-1 h-1 bg-white rounded-full"></div>
            <div className="w-1 h-1 bg-white rounded-full"></div>
            <span>LTE</span>
          </div>
          <div className="bg-white/20 rounded px-1 text-xs">24</div>
        </div>
      </div>

      {/* Top Navigation */}
      <div className="flex items-center justify-center gap-8 pt-12 pb-4 bg-gradient-to-b from-black/50 to-transparent absolute top-0 left-0 right-0 z-10">
        <Button
          variant="ghost"
          className={cn(
            "text-white font-medium text-lg",
            activeTab === 'fyp' && "border-b-2 border-white"
          )}
          onClick={() => setActiveTab('fyp')}
        >
          For You
        </Button>
        <Button
          variant="ghost"
          className={cn(
            "text-white font-medium text-lg flex items-center gap-1",
            activeTab === 'live' && "border-b-2 border-white"
          )}
          onClick={() => setActiveTab('live')}
        >
          <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
          LIVE
        </Button>
        <Button
          variant="ghost"
          className={cn(
            "text-white font-medium text-lg flex items-center gap-1",
            activeTab === 'battles' && "border-b-2 border-white"
          )}
          onClick={() => setActiveTab('battles')}
        >
          <Trophy className="w-4 h-4" />
          Battles
        </Button>
      </div>

      {/* Main Content */}
      <div className="flex-1 relative">
        {activeTab === 'fyp' && (
          <div className="h-full relative">
            {/* Video Background */}
            <div className="absolute inset-0 bg-gradient-to-b from-gray-800 to-gray-900 flex items-center justify-center">
              <Avatar className="w-48 h-48">
                <AvatarImage src={currentVideo.creator.avatar} />
                <AvatarFallback className="text-6xl">{currentVideo.creator.displayName[0]}</AvatarFallback>
              </Avatar>
            </div>

            {/* Video Overlay Content */}
            <div className="absolute inset-0 flex">
              {/* Left Side - Video Info */}
              <div className="flex-1 flex flex-col justify-end p-4 pb-24">
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <Avatar className="w-12 h-12">
                      <AvatarImage src={currentVideo.creator.avatar} />
                      <AvatarFallback>{currentVideo.creator.displayName[0]}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="text-white font-semibold">{currentVideo.creator.displayName}</div>
                      <div className="text-white/70 text-sm">@{currentVideo.creator.username}</div>
                    </div>
                    <Button size="sm" className="bg-red-500 hover:bg-red-600 text-white px-4 rounded-full">
                      + Follow
                    </Button>
                  </div>

                  <div className="text-white">
                    <div className="font-medium mb-1">{currentVideo.title}</div>
                    <div className="text-sm text-white/80">{currentVideo.description}</div>
                  </div>

                  {currentVideo.creator.isLive && (
                    <Badge className="bg-red-500 text-white w-fit animate-pulse">
                      🔴 LIVE
                    </Badge>
                  )}
                </div>
              </div>

              {/* Right Side - Actions */}
              <div className="flex flex-col items-center justify-end gap-6 p-4 pb-24">
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-white hover:bg-white/10 rounded-full w-12 h-12"
                  onClick={handleLike}
                >
                  <Heart className={cn("w-8 h-8", currentVideo.isLiked && "fill-red-500 text-red-500")} />
                </Button>
                <div className="text-white text-sm text-center">{currentVideo.likes}</div>

                <Button
                  variant="ghost"
                  size="icon"
                  className="text-white hover:bg-white/10 rounded-full w-12 h-12"
                  onClick={handleComment}
                >
                  <MessageCircle className="w-8 h-8" />
                </Button>
                <div className="text-white text-sm text-center">{currentVideo.comments}</div>

                <Button
                  variant="ghost"
                  size="icon"
                  className="text-white hover:bg-white/10 rounded-full w-12 h-12"
                  onClick={handleShare}
                >
                  <Share2 className="w-8 h-8" />
                </Button>
                <div className="text-white text-sm text-center">{currentVideo.shares}</div>

                <Button
                  variant="ghost"
                  size="icon"
                  className="text-white hover:bg-white/10 rounded-full w-12 h-12"
                >
                  <Gift className="w-8 h-8" />
                </Button>

                <Button
                  variant="ghost"
                  size="icon"
                  className="text-white hover:bg-white/10 rounded-full w-12 h-12"
                  onClick={() => setIsMuted(!isMuted)}
                >
                  {isMuted ? <VolumeX className="w-8 h-8" /> : <Volume2 className="w-8 h-8" />}
                </Button>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'live' && (
          <div className="h-full p-4 pt-20">
            <div className="text-white text-center mb-6">
              <h2 className="text-2xl font-bold mb-2">���� Live Streams</h2>
              <p className="text-white/70">Join live creators now!</p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {videos.filter(v => v.creator.isLive).map((video) => (
                <div key={video.id} className="relative bg-gray-800 rounded-lg overflow-hidden">
                  <div className="aspect-[3/4] bg-gradient-to-b from-gray-700 to-gray-900 flex items-center justify-center">
                    <Avatar className="w-16 h-16">
                      <AvatarImage src={video.creator.avatar} />
                      <AvatarFallback>{video.creator.displayName[0]}</AvatarFallback>
                    </Avatar>
                  </div>
                  <div className="absolute top-2 left-2">
                    <Badge className="bg-red-500 text-white text-xs animate-pulse">🔴 LIVE</Badge>
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-3">
                    <div className="text-white text-sm font-medium">{video.creator.displayName}</div>
                    <div className="text-white/70 text-xs">{video.likes} viewers</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'battles' && (
          <div className="h-full p-4 pt-20">
            <div className="text-white text-center mb-6">
              <h2 className="text-2xl font-bold mb-2 flex items-center justify-center gap-2">
                <Trophy className="w-8 h-8 text-yellow-400" />
                Live Battles
              </h2>
              <p className="text-white/70">Vote for your favorite creator!</p>
            </div>

            <div className="space-y-4">
              {liveBattles.map((battle) => (
                <div
                  key={battle.id}
                  className="bg-gray-900/80 backdrop-blur-sm rounded-2xl p-4 border border-gray-700 cursor-pointer hover:bg-gray-800/80 transition-all"
                  onClick={() => joinBattle(battle)}
                >
                  <div className="flex items-center justify-between mb-4">
                    <Badge className="bg-red-500 text-white animate-pulse">
                      <Flame className="w-3 h-3 mr-1" />
                      LIVE BATTLE
                    </Badge>
                    <div className="flex items-center gap-1 text-white text-sm">
                      <Users className="w-4 h-4" />
                      {battle.viewers}
                    </div>
                  </div>

                  <div className="flex items-center gap-4 mb-4">
                    {/* Creator 1 */}
                    <div className="flex-1 text-center">
                      <Avatar className="w-16 h-16 mx-auto mb-2">
                        <AvatarImage src={battle.creator1.avatar} />
                        <AvatarFallback>{battle.creator1.displayName[0]}</AvatarFallback>
                      </Avatar>
                      <div className="text-white font-medium text-sm">{battle.creator1.displayName}</div>
                      <div className="text-blue-400 text-xs">
                        {battle.creator1.followers.toLocaleString()} followers
                      </div>
                    </div>

                    {/* VS */}
                    <div className="text-2xl font-bold text-yellow-400">VS</div>

                    {/* Creator 2 */}
                    <div className="flex-1 text-center">
                      <Avatar className="w-16 h-16 mx-auto mb-2">
                        <AvatarImage src={battle.creator2.avatar} />
                        <AvatarFallback>{battle.creator2.displayName[0]}</AvatarFallback>
                      </Avatar>
                      <div className="text-white font-medium text-sm">{battle.creator2.displayName}</div>
                      <div className="text-blue-400 text-xs">
                        {battle.creator2.followers.toLocaleString()} followers
                      </div>
                    </div>
                  </div>

                  <div className="text-center">
                    <Button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-6 rounded-full">
                      <Zap className="w-4 h-4 mr-2" />
                      Join Battle
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Bottom Navigation */}
      <div className="bg-black border-t border-gray-800 px-4 py-2">
        <div className="flex items-center justify-around">
          <Button variant="ghost" size="icon" className="text-white hover:bg-white/10">
            <Home className="w-6 h-6" />
          </Button>
          <Button variant="ghost" size="icon" className="text-white hover:bg-white/10">
            <Compass className="w-6 h-6" />
          </Button>
          <Button variant="ghost" size="icon" className="text-white hover:bg-white/10">
            <PlusSquare className="w-6 h-6" />
          </Button>
          <Button variant="ghost" size="icon" className="text-white hover:bg-white/10">
            <Bell className="w-6 h-6" />
          </Button>
          <Button variant="ghost" size="icon" className="text-white hover:bg-white/10">
            <User className="w-6 h-6" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default TikTokStyleVideos;
