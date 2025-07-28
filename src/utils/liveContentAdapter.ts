import { LiveStreamData } from '../hooks/use-live-content';

// Convert LiveStreamData to VideoData format for compatibility with existing VideoCard
export function liveContentToVideoData(content: LiveStreamData) {
  return {
    id: content.id,
    user: {
      ...content.user,
      isFollowing: false,
    },
    description: content.description,
    music: { 
      title: content.type === 'battle' ? "Battle Theme" : "Live Stream", 
      artist: content.type === 'battle' ? "Epic Beats" : "Real Time" 
    },
    stats: { 
      likes: Math.floor(content.viewerCount * 0.8), 
      comments: Math.floor(content.viewerCount * 0.3), 
      shares: Math.floor(content.viewerCount * 0.1), 
      views: `${content.viewerCount} watching` 
    },
    hashtags: content.type === 'battle' 
      ? [`livebattle`, content.battleData?.type || 'general', 'epic', 'compete']
      : ['live', content.category || 'streaming', 'realtime'],
    videoUrl: "https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4",
    thumbnail: content.type === 'battle' 
      ? "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400"
      : "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=400",
    duration: 0, // Live content doesn't have fixed duration
    timestamp: content.type === 'battle' ? "BATTLE" : "LIVE",
    isLiveStream: true,
    allowDuets: false,
    allowComments: true,
    category: content.category,
  };
}

export function getTimeElapsed(startedAt: Date): string {
  const elapsed = Date.now() - startedAt.getTime();
  const minutes = Math.floor(elapsed / 60000);
  const hours = Math.floor(minutes / 60);
  
  if (hours > 0) {
    return `${hours}h ${minutes % 60}m`;
  }
  return `${minutes}m`;
}

export function formatBattleTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}
