
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import FooterNav from "@/components/layout/FooterNav";
import VideoPlayer from "@/components/videos/VideoPlayer";
import AdCard from "@/components/videos/AdCard";
import EnhancedVideoCreator from "@/components/video/EnhancedVideoCreator";
import { useVideos } from "@/hooks/use-videos";
import { VideoItem, AdItem } from "@/types/video";
import { ArrowUpIcon, Plus, Compass, TrendingUp, User, Heart, Music } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Videos = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'feed' | 'discover' | 'create' | 'profile'>('feed');
  const [showCreator, setShowCreator] = useState(false);
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const {
    currentItem,
    swipeHandlers,
    handleNextVideo,
    handlePrevVideo,
    allItems
  } = useVideos();

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowUp') {
        e.preventDefault();
        handlePrevVideo();
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        handleNextVideo();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleNextVideo, handlePrevVideo]);

  const renderTikTokInterface = () => {
    if (!currentItem) {
      return (
        <div className="h-screen bg-black flex items-center justify-center text-white">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-white border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p>Loading videos...</p>
          </div>
        </div>
      );
    }

    return (
      <div className="h-screen bg-black overflow-hidden relative touch-pan-y" {...swipeHandlers}>
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

        {/* TikTok-style Right Side Actions */}
        <div className="absolute right-3 bottom-32 md:bottom-24 flex flex-col gap-6 z-20">
          <Button
            size="icon"
            className="w-14 h-14 rounded-full bg-white/20 backdrop-blur-sm border-0 text-white hover:bg-white/30 transition-all duration-200 hover:scale-110"
            onClick={() => setShowCreator(true)}
          >
            <Plus className="w-7 h-7" />
          </Button>
          
          <div className="flex flex-col items-center">
            <Button
              size="icon"
              className="w-14 h-14 rounded-full bg-white/20 backdrop-blur-sm border-0 text-white hover:bg-red-500/80 transition-all duration-200 hover:scale-110"
            >
              <Heart className="w-7 h-7" />
            </Button>
            <span className="text-white text-xs mt-1 font-medium">1.2K</span>
          </div>

          <div className="flex flex-col items-center">
            <Button
              size="icon"
              className="w-14 h-14 rounded-full bg-white/20 backdrop-blur-sm border-0 text-white hover:bg-white/30 transition-all duration-200 hover:scale-110"
              onClick={() => setActiveTab('discover')}
            >
              <Music className="w-7 h-7" />
            </Button>
            <span className="text-white text-xs mt-1 font-medium">Sound</span>
          </div>

          <div className="flex flex-col items-center">
            <Button
              size="icon"
              className="w-14 h-14 rounded-full bg-white/20 backdrop-blur-sm border-0 text-white hover:bg-white/30 transition-all duration-200 hover:scale-110"
              onClick={() => setActiveTab('profile')}
            >
              <User className="w-7 h-7" />
            </Button>
            <span className="text-white text-xs mt-1 font-medium">Profile</span>
          </div>
        </div>

        {/* Progress Indicators */}
        <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex flex-col gap-1 z-10">
          {allItems.map((_, index) => (
            <div
              key={index}
              className={`w-1 h-8 rounded-full transition-all duration-300 ${
                index === currentVideoIndex ? 'bg-white' : 'bg-white/30'
              }`}
            />
          ))}
        </div>

        {/* Top Navigation indicators */}
        <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-b from-black/70 to-transparent pointer-events-none z-10">
          <div className="flex justify-center pt-6">
            <div className="flex items-center gap-2 text-white/80 text-sm animate-pulse">
              <ArrowUpIcon className="w-4 h-4" />
              <span>Swipe up for next</span>
            </div>
          </div>
        </div>

        {/* Bottom Gradient */}
        <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-black/70 to-transparent pointer-events-none z-10" />
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
            className="text-white mb-4 hover:bg-white/10"
          >
            ← Back to Videos
          </Button>
          <EnhancedVideoCreator />
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen bg-black relative">
      <Tabs value={activeTab} onValueChange={setActiveTab as any} className="h-full">
        {/* TikTok-style Top Tab Navigation */}
        <div className="absolute top-6 left-1/2 transform -translate-x-1/2 z-30">
          <TabsList className="bg-black/50 backdrop-blur-sm border-0 rounded-full">
            <TabsTrigger 
              value="feed" 
              className="text-white data-[state=active]:bg-white data-[state=active]:text-black rounded-full px-6"
            >
              For You
            </TabsTrigger>
            <TabsTrigger 
              value="discover" 
              className="text-white data-[state=active]:bg-white data-[state=active]:text-black rounded-full px-6"
            >
              <TrendingUp className="w-4 h-4 mr-1" />
              Trending
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="feed" className="h-full m-0">
          {renderTikTokInterface()}
        </TabsContent>

        <TabsContent value="discover" className="h-full m-0">
          <div className="h-full bg-black text-white overflow-y-auto">
            <div className="pt-20 p-6 space-y-8">
              {/* Trending Challenges */}
              <div>
                <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                  <TrendingUp className="w-6 h-6 text-pink-500" />
                  Trending Challenges
                </h2>
                <div className="grid grid-cols-2 gap-4">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <div key={i} className="bg-gray-900 rounded-xl overflow-hidden group hover:scale-105 transition-transform duration-300">
                      <div className="w-full h-40 bg-gradient-to-br from-pink-500 to-purple-600 flex items-center justify-center relative">
                        <div className="text-4xl">🔥</div>
                        <div className="absolute bottom-2 right-2 bg-black/70 rounded-full px-2 py-1">
                          <span className="text-xs">{(Math.random() * 1000).toFixed(0)}K</span>
                        </div>
                      </div>
                      <div className="p-4">
                        <h3 className="font-bold text-lg">#Challenge{i + 1}</h3>
                        <p className="text-sm text-gray-400">{(Math.random() * 1000).toFixed(0)}K videos</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Trending Sounds */}
              <div>
                <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                  <Music className="w-6 h-6 text-green-500" />
                  Trending Sounds
                </h2>
                <div className="space-y-4">
                  {Array.from({ length: 8 }).map((_, i) => (
                    <div key={i} className="flex items-center gap-4 bg-gray-900 rounded-xl p-4 hover:bg-gray-800 transition-colors duration-200">
                      <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-blue-600 rounded-xl flex items-center justify-center">
                        <Music className="w-8 h-8 text-white" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-bold text-lg">Trending Sound {i + 1}</h4>
                        <p className="text-sm text-gray-400">{(Math.random() * 500).toFixed(0)}K videos created</p>
                        <div className="flex items-center gap-2 mt-1">
                          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                          <span className="text-xs text-green-400">Trending now</span>
                        </div>
                      </div>
                      <Button size="sm" className="bg-white text-black hover:bg-gray-200 rounded-full px-6">
                        Use Sound
                      </Button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Popular Creators */}
              <div>
                <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                  <User className="w-6 h-6 text-purple-500" />
                  Popular Creators
                </h2>
                <div className="grid grid-cols-2 gap-4">
                  {Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="bg-gray-900 rounded-xl p-6 text-center hover:bg-gray-800 transition-colors duration-200">
                      <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full mx-auto mb-4"></div>
                      <h3 className="font-bold text-lg">Creator {i + 1}</h3>
                      <p className="text-sm text-gray-400 mb-3">{(Math.random() * 500).toFixed(0)}K followers</p>
                      <Button size="sm" variant="outline" className="rounded-full">
                        Follow
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="profile" className="h-full m-0">
          <div className="h-full bg-black text-white overflow-y-auto">
            <div className="pt-20 p-6 text-center space-y-6">
              <div className="w-32 h-32 bg-gradient-to-br from-purple-600 to-pink-600 rounded-full mx-auto flex items-center justify-center text-4xl">
                {user?.user_metadata?.full_name?.charAt(0) || '👤'}
              </div>
              
              <div>
                <h2 className="text-2xl font-bold">{user?.user_metadata?.full_name || 'Creator'}</h2>
                <p className="text-gray-400">@{user?.email?.split('@')[0] || 'username'}</p>
              </div>
              
              <div className="flex justify-center gap-12">
                <div className="text-center">
                  <div className="text-2xl font-bold">125</div>
                  <div className="text-sm text-gray-400">Following</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold">8.9K</div>
                  <div className="text-sm text-gray-400">Followers</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold">2.1M</div>
                  <div className="text-sm text-gray-400">Likes</div>
                </div>
              </div>
              
              <div className="space-y-4">
                <Button 
                  onClick={() => setShowCreator(true)} 
                  className="w-full bg-pink-600 hover:bg-pink-700 rounded-full py-3"
                >
                  <Plus className="w-5 h-5 mr-2" />
                  Create Video
                </Button>
                
                <Button 
                  variant="outline" 
                  className="w-full rounded-full py-3 border-gray-600 text-white hover:bg-gray-800"
                >
                  Edit Profile
                </Button>
              </div>

              {/* User's Videos Grid */}
              <div className="mt-8">
                <h3 className="text-lg font-bold mb-4 text-left">Your Videos</h3>
                <div className="grid grid-cols-3 gap-2">
                  {Array.from({ length: 9 }).map((_, i) => (
                    <div key={i} className="aspect-[9/16] bg-gray-800 rounded-lg relative overflow-hidden">
                      <div className="absolute bottom-2 right-2 bg-black/70 rounded px-1 text-xs">
                        {(Math.random() * 100).toFixed(0)}K
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>

      {/* Hide FooterNav for immersive experience */}
      <div className="md:block hidden">
        <FooterNav />
      </div>
    </div>
  );
};

export default Videos;
