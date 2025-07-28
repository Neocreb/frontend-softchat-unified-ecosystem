import { useState, useEffect, useCallback } from 'react';

export interface LiveStreamData {
  id: string;
  type: 'live' | 'battle';
  user: {
    id: string;
    username: string;
    displayName: string;
    avatar: string;
    verified: boolean;
    followerCount: number;
  };
  title: string;
  description: string;
  viewerCount: number;
  isActive: boolean;
  startedAt: Date;
  category?: string;
  streamKey?: string;
  battleData?: {
    opponent?: {
      id: string;
      username: string;
      displayName: string;
      avatar: string;
    };
    type: 'dance' | 'rap' | 'comedy' | 'general';
    timeRemaining?: number;
    scores?: {
      user1: number;
      user2: number;
    };
  };
}

interface UseLiveContentReturn {
  liveStreams: LiveStreamData[];
  activeBattles: LiveStreamData[];
  allLiveContent: LiveStreamData[];
  addLiveStream: (stream: Omit<LiveStreamData, 'id' | 'startedAt' | 'isActive'>) => string;
  addBattle: (battle: Omit<LiveStreamData, 'id' | 'startedAt' | 'isActive' | 'type'> & { battleData: NonNullable<LiveStreamData['battleData']> }) => string;
  removeLiveContent: (id: string) => void;
  updateViewerCount: (id: string, count: number) => void;
  getLiveContentById: (id: string) => LiveStreamData | undefined;
  isUserLive: (userId: string) => boolean;
}

// Mock data for initial state
const mockLiveContent: LiveStreamData[] = [
  {
    id: "live1",
    type: "live",
    user: {
      id: "user1",
      username: "crypto_guru",
      displayName: "Crypto Guru",
      avatar: "https://i.pravatar.cc/150?img=10",
      verified: true,
      followerCount: 50000,
    },
    title: "Bitcoin Analysis Live",
    description: "LIVE: Bitcoin analysis and market predictions! 🔴 Join the discussion",
    viewerCount: 1250,
    isActive: true,
    startedAt: new Date(Date.now() - 1800000), // Started 30 mins ago
    category: "crypto",
  },
  {
    id: "battle1",
    type: "battle",
    user: {
      id: "user2",
      username: "dance_master",
      displayName: "Dance Master",
      avatar: "https://i.pravatar.cc/150?img=3",
      verified: true,
      followerCount: 892000,
    },
    title: "Epic Dance Battle",
    description: "🔥 LIVE BATTLE: Epic Dance Battle vs @melody_queen! Vote with gifts! ⚡",
    viewerCount: 2480,
    isActive: true,
    startedAt: new Date(Date.now() - 900000), // Started 15 mins ago
    category: "dance",
    battleData: {
      opponent: {
        id: "user3",
        username: "melody_queen",
        displayName: "Melody Queen",
        avatar: "https://i.pravatar.cc/150?img=5",
      },
      type: "dance",
      timeRemaining: 180, // 3 minutes left
      scores: {
        user1: 2450,
        user2: 3120,
      },
    },
  },
  {
    id: "battle2",
    type: "battle",
    user: {
      id: "user4",
      username: "rap_king",
      displayName: "Rap King",
      avatar: "https://i.pravatar.cc/150?img=8",
      verified: true,
      followerCount: 567000,
    },
    title: "Freestyle Rap Battle",
    description: "🎤 LIVE RAP BATTLE: Freestyle showdown! Drop bars and win SoftPoints! 💰",
    viewerCount: 1520,
    isActive: true,
    startedAt: new Date(Date.now() - 600000), // Started 10 mins ago
    category: "music",
    battleData: {
      opponent: {
        id: "user5",
        username: "lyric_legend",
        displayName: "Lyric Legend",
        avatar: "https://i.pravatar.cc/150?img=12",
      },
      type: "rap",
      timeRemaining: 240, // 4 minutes left
      scores: {
        user1: 1890,
        user2: 1650,
      },
    },
  },
];

export function useLiveContent(): UseLiveContentReturn {
  const [liveContent, setLiveContent] = useState<LiveStreamData[]>(mockLiveContent);

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setLiveContent(prev => prev.map(content => ({
        ...content,
        viewerCount: content.viewerCount + Math.floor(Math.random() * 10 - 3), // Random viewer changes
        battleData: content.battleData ? {
          ...content.battleData,
          timeRemaining: Math.max(0, (content.battleData.timeRemaining || 0) - 1),
          scores: {
            user1: content.battleData.scores!.user1 + Math.floor(Math.random() * 20),
            user2: content.battleData.scores!.user2 + Math.floor(Math.random() * 20),
          },
        } : undefined,
      })));
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  const addLiveStream = useCallback((streamData: Omit<LiveStreamData, 'id' | 'startedAt' | 'isActive'>) => {
    const id = `live_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const newStream: LiveStreamData = {
      ...streamData,
      id,
      type: 'live',
      startedAt: new Date(),
      isActive: true,
    };

    setLiveContent(prev => [newStream, ...prev]);
    return id;
  }, []);

  const addBattle = useCallback((battleData: Omit<LiveStreamData, 'id' | 'startedAt' | 'isActive' | 'type'> & { battleData: NonNullable<LiveStreamData['battleData']> }) => {
    const id = `battle_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const newBattle: LiveStreamData = {
      ...battleData,
      id,
      type: 'battle',
      startedAt: new Date(),
      isActive: true,
    };

    setLiveContent(prev => [newBattle, ...prev]);
    return id;
  }, []);

  const removeLiveContent = useCallback((id: string) => {
    setLiveContent(prev => prev.filter(content => content.id !== id));
  }, []);

  const updateViewerCount = useCallback((id: string, count: number) => {
    setLiveContent(prev => prev.map(content => 
      content.id === id ? { ...content, viewerCount: count } : content
    ));
  }, []);

  const getLiveContentById = useCallback((id: string) => {
    return liveContent.find(content => content.id === id);
  }, [liveContent]);

  const isUserLive = useCallback((userId: string) => {
    return liveContent.some(content => content.user.id === userId && content.isActive);
  }, [liveContent]);

  const liveStreams = liveContent.filter(content => content.type === 'live');
  const activeBattles = liveContent.filter(content => content.type === 'battle');

  return {
    liveStreams,
    activeBattles,
    allLiveContent: liveContent,
    addLiveStream,
    addBattle,
    removeLiveContent,
    updateViewerCount,
    getLiveContentById,
    isUserLive,
  };
}
