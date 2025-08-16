import React, { useState } from 'react';
import { Watch2EarnPlayer } from '../components/video/Watch2EarnPlayer';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { useRewardService } from '../services/rewardService';
import { Play, TrendingUp, Clock, Coins } from 'lucide-react';

// This would come from your API
const featuredVideos = [
  {
    id: 'video-1',
    title: 'Crypto Market Analysis 2024',
    thumbnail: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?q=80&w=800&auto=format&fit=crop',
    duration: 480, // 8 minutes
    creator: 'Mike Thompson',
    views: 15420,
    earning_potential: 0.25,
    category: 'Finance'
  },
  {
    id: 'video-2', 
    title: 'How to Build React Apps',
    thumbnail: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?q=80&w=800&auto=format&fit=crop',
    duration: 720, // 12 minutes
    creator: 'Alex Rodriguez',
    views: 8900,
    earning_potential: 0.35,
    category: 'Technology'
  },
  {
    id: 'video-3',
    title: 'Digital Art Masterclass',
    thumbnail: 'https://images.unsplash.com/photo-1547891654-e66ed7ebb968?q=80&w=800&auto=format&fit=crop',
    duration: 600, // 10 minutes
    creator: 'Emma Wilson',
    views: 12300,
    earning_potential: 0.30,
    category: 'Creative'
  }
];

const trendingVideos = [
  {
    id: 'video-4',
    title: 'AI Revolution in 2024',
    thumbnail: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?q=80&w=800&auto=format&fit=crop',
    duration: 420,
    creator: 'Tech Insights',
    views: 45600,
    earning_potential: 0.40,
    category: 'AI & Tech'
  },
  {
    id: 'video-5',
    title: 'Startup Success Stories',
    thumbnail: 'https://images.unsplash.com/photo-1556761175-b413da4baf72?q=80&w=800&auto=format&fit=crop',
    duration: 540,
    creator: 'Business Hub',
    views: 28700,
    earning_potential: 0.28,
    category: 'Business'
  }
];

export default function Watch2EarnVideosPage() {
  const [selectedVideo, setSelectedVideo] = useState<string | null>(null);
  const [totalEarned, setTotalEarned] = useState(0);
  const { getUserRewardData } = useRewardService();

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleVideoSelect = (videoId: string) => {
    setSelectedVideo(videoId);
  };

  const handleRewardEarned = (amount: number, type: string) => {
    setTotalEarned(prev => prev + amount);
    console.log(`Earned ${amount} from ${type}`);
  };

  const renderVideoCard = (video: any) => (
    <Card 
      key={video.id}
      className="cursor-pointer hover:shadow-md transition-shadow"
      onClick={() => handleVideoSelect(video.id)}
    >
      <div className="relative">
        <img 
          src={video.thumbnail} 
          alt={video.title}
          className="w-full h-48 object-cover rounded-t-lg"
        />
        <div className="absolute bottom-2 right-2 bg-black/80 text-white text-xs px-2 py-1 rounded">
          {formatDuration(video.duration)}
        </div>
        <div className="absolute top-2 left-2">
          <Badge className="bg-green-600 text-white">
            <Coins className="w-3 h-3 mr-1" />
            +${video.earning_potential}
          </Badge>
        </div>
        <div className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 hover:opacity-100 transition-opacity">
          <Play className="w-12 h-12 text-white" />
        </div>
      </div>
      <CardContent className="p-4">
        <h3 className="font-semibold text-sm line-clamp-2 mb-2">{video.title}</h3>
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>{video.creator}</span>
          <span>{video.views.toLocaleString()} views</span>
        </div>
        <Badge variant="secondary" className="mt-2 text-xs">
          {video.category}
        </Badge>
      </CardContent>
    </Card>
  );

  if (selectedVideo) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-6">
          <div className="mb-4">
            <Button 
              variant="outline" 
              onClick={() => setSelectedVideo(null)}
              className="mb-4"
            >
              ← Back to Videos
            </Button>
          </div>
          
          <Watch2EarnPlayer 
            videoId={selectedVideo}
            onRewardEarned={handleRewardEarned}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-6">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2">Watch2Earn Videos</h1>
          <p className="text-muted-foreground">
            Watch videos and earn rewards! The longer you watch, the more you earn.
          </p>
        </div>

        {/* Earnings Summary */}
        <Card className="mb-6 bg-gradient-to-r from-green-50 to-blue-50 border-green-200">
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  ${totalEarned.toFixed(2)}
                </div>
                <div className="text-sm text-muted-foreground">Today's Earnings</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">
                  ${getUserRewardData()?.totalEarned.toFixed(2) || '0.00'}
                </div>
                <div className="text-sm text-muted-foreground">Total Earned</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">
                  {Math.floor((getUserRewardData()?.totalEarned || 0) / 0.25)}
                </div>
                <div className="text-sm text-muted-foreground">Videos Watched</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Video Tabs */}
        <Tabs defaultValue="featured" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="featured">Featured</TabsTrigger>
            <TabsTrigger value="trending">
              <TrendingUp className="w-4 h-4 mr-2" />
              Trending
            </TabsTrigger>
            <TabsTrigger value="recent">
              <Clock className="w-4 h-4 mr-2" />
              Recent
            </TabsTrigger>
          </TabsList>

          <TabsContent value="featured" className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">Featured Videos</h2>
              <Badge variant="secondary">High Earning Potential</Badge>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredVideos.map(renderVideoCard)}
            </div>
          </TabsContent>

          <TabsContent value="trending" className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">Trending Now</h2>
              <Badge variant="secondary">Most Popular</Badge>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {trendingVideos.map(renderVideoCard)}
            </div>
          </TabsContent>

          <TabsContent value="recent" className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">Recently Added</h2>
              <Badge variant="secondary">Fresh Content</Badge>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...featuredVideos, ...trendingVideos].map(renderVideoCard)}
            </div>
          </TabsContent>
        </Tabs>

        {/* How It Works */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>How Watch2Earn Works</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Play className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="font-semibold mb-2">1. Watch Videos</h3>
                <p className="text-sm text-muted-foreground">
                  Choose from featured, trending, or recent videos
                </p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Clock className="w-6 h-6 text-green-600" />
                </div>
                <h3 className="font-semibold mb-2">2. Watch Ads</h3>
                <p className="text-sm text-muted-foreground">
                  Watch short ads during videos to earn rewards
                </p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Coins className="w-6 h-6 text-yellow-600" />
                </div>
                <h3 className="font-semibold mb-2">3. Earn Rewards</h3>
                <p className="text-sm text-muted-foreground">
                  Get paid instantly to your wallet after watching
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
