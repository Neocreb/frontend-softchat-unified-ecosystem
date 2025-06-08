import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import FooterNav from "@/components/layout/FooterNav";
import VideoPlayer from "@/components/videos/VideoPlayer";
import AdCard from "@/components/videos/AdCard";
import EnhancedVideoCreator from "@/components/video/EnhancedVideoCreator";
import { useVideos } from "@/hooks/use-videos";
import { VideoItem, AdItem } from "@/types/video";
import { ArrowUpIcon, Plus, Compass, TrendingUp, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Videos = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'feed' | 'discover' | 'create' | 'profile'>('feed');
  const [showCreator, setShowCreator] = useState(false);
  const {
    currentItem,
    swipeHandlers,
    handleNextVideo,
    handlePrevVideo
  } = useVideos();

  const renderTikTokInterface = () => {
    if (!currentItem) {
      return (
        <div className="h-[calc(92vh-4rem)] pb-16 md:pb-0 bg-black flex items-center overflow-hidden justify-center text-white">
          <p>No videos available</p>
        </div>
      );
    }

    return (
      <div className="h-[calc(92vh-4rem)] pb-16 md:pb-0 bg-black overflow-hidden relative" {...swipeHandlers}>
        {'isAd' in currentItem ? (
          <AdCard
            ad={(currentItem as AdItem).ad}
            onNext={handleNextVideo}
            onPrev={handlePrevVideo}
          />
        ) : (
          <VideoPlayer
            video={currentItem as VideoItem}
            onNext={handleNextVideo}
            onPrev={handlePrevVideo}
          />
        )}

        {/* TikTok-style Navigation */}
        <div className="absolute right-4 bottom-24 flex flex-col gap-4 z-10">
          <Button
            size="icon"
            className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm border-0 text-white hover:bg-white/30"
            onClick={() => setShowCreator(true)}
          >
            <Plus className="w-6 h-6" />
          </Button>
          <Button
            size="icon"
            className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm border-0 text-white hover:bg-white/30"
            onClick={() => setActiveTab('discover')}
          >
            <Compass className="w-6 h-6" />
          </Button>
          <Button
            size="icon"
            className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm border-0 text-white hover:bg-white/30"
            onClick={() => setActiveTab('profile')}
          >
            <User className="w-6 h-6" />
          </Button>
        </div>

        {/* Navigation indicators */}
        <div className="absolute top-0 left-0 w-full h-20 bg-gradient-to-b from-black/70 to-transparent pointer-events-none">
          <div className="flex justify-center pt-4">
            <span className="flex gap-2 text-gray-400 text-sm animate-bounce">Swipe up for next <ArrowUpIcon /></span>
          </div>
        </div>
      </div>
    );
  };

  if (showCreator) {
    return (
      <div className="h-screen bg-black">
        <div className="p-4">
          <Button 
            variant="ghost" 
            onClick={() => setShowCreator(false)}
            className="text-white mb-4"
          >
            ← Back
          </Button>
          <EnhancedVideoCreator />
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen bg-black">
      <Tabs value={activeTab} onValueChange={setActiveTab as any} className="h-full">
        {/* TikTok-style Tab Navigation */}
        <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-20">
          <TabsList className="bg-black/50 backdrop-blur-sm border-0">
            <TabsTrigger value="feed" className="text-white data-[state=active]:bg-white data-[state=active]:text-black">
              For You
            </TabsTrigger>
            <TabsTrigger value="discover" className="text-white data-[state=active]:bg-white data-[state=active]:text-black">
              <TrendingUp className="w-4 h-4 mr-1" />
              Trending
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="feed" className="h-full m-0">
          {renderTikTokInterface()}
        </TabsContent>

        <TabsContent value="discover" className="h-full m-0">
          <div className="h-full bg-black text-white p-4 pt-16">
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-bold mb-4">Trending Challenges</h2>
                <div className="grid grid-cols-2 gap-4">
                  {Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="bg-gray-800 rounded-lg p-4">
                      <div className="w-full h-32 bg-gray-700 rounded mb-2"></div>
                      <h3 className="font-semibold">#Challenge{i + 1}</h3>
                      <p className="text-sm text-gray-400">{(Math.random() * 1000).toFixed(0)}K videos</p>
                    </div>
                  ))}
                </div>
              </div>
              
              <div>
                <h2 className="text-xl font-bold mb-4">Popular Sounds</h2>
                <div className="space-y-3">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <div key={i} className="flex items-center gap-3 bg-gray-800 rounded-lg p-3">
                      <div className="w-12 h-12 bg-gray-700 rounded"></div>
                      <div className="flex-1">
                        <h4 className="font-medium">Trending Sound {i + 1}</h4>
                        <p className="text-sm text-gray-400">{(Math.random() * 500).toFixed(0)}K videos</p>
                      </div>
                      <Button size="sm" variant="outline">Use</Button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="profile" className="h-full m-0">
          <div className="h-full bg-black text-white p-4 pt-16">
            <div className="text-center space-y-4">
              <div className="w-24 h-24 bg-gray-700 rounded-full mx-auto"></div>
              <div>
                <h2 className="text-xl font-bold">{user?.user_metadata?.full_name || 'Creator'}</h2>
                <p className="text-gray-400">@{user?.email?.split('@')[0] || 'username'}</p>
              </div>
              
              <div className="flex justify-center gap-8">
                <div className="text-center">
                  <div className="font-bold">12.5K</div>
                  <div className="text-sm text-gray-400">Following</div>
                </div>
                <div className="text-center">
                  <div className="font-bold">890K</div>
                  <div className="text-sm text-gray-400">Followers</div>
                </div>
                <div className="text-center">
                  <div className="font-bold">2.1M</div>
                  <div className="text-sm text-gray-400">Likes</div>
                </div>
              </div>
              
              <Button onClick={() => setShowCreator(true)} className="w-full">
                <Plus className="w-4 h-4 mr-2" />
                Create Video
              </Button>
            </div>
          </div>
        </TabsContent>
      </Tabs>

      <FooterNav />
    </div>
  );
};

export default Videos;