import React, { createContext, useContext, ReactNode } from 'react';
import { useLiveContent, LiveStreamData } from '@/hooks/use-live-content';

interface LiveContentContextType {
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

const LiveContentContext = createContext<LiveContentContextType | undefined>(undefined);

export function LiveContentProvider({ children }: { children: ReactNode }) {
  const liveContentData = useLiveContent();

  return (
    <LiveContentContext.Provider value={liveContentData}>
      {children}
    </LiveContentContext.Provider>
  );
}

export function useLiveContentContext() {
  const context = useContext(LiveContentContext);
  if (context === undefined) {
    throw new Error('useLiveContentContext must be used within a LiveContentProvider');
  }
  return context;
}
