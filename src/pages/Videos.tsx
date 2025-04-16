import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Heart, MessageCircle, Share2, VolumeX, Volume2 } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import FooterNav from "@/components/layout/FooterNav";

type VideoItem = {
  id: string;
  url: string;
  thumbnail: string;
  description: string;
  likes: number;
  comments: number;
  shares: number;
  author: {
    name: string;
    username: string;
    avatar: string;
    verified: boolean;
  };
  isFollowing: boolean;
};

type AdItem = {
  isAd: true;
  ad: {
    id: string;
    title: string;
    description: string;
    cta: string;
    image: string;
    url: string;
    sponsor: string;
  };
};

type ContentItem = VideoItem | AdItem;

const videos: VideoItem[] = [
  {
    id: "1",
    url: "https://assets.mixkit.co/videos/preview/mixkit-waves-in-the-water-1164-large.mp4",
    thumbnail: "https://images.unsplash.com/photo-1620118373803-9cb777efcfba?q=80&w=800&auto=format&fit=crop",
    description: "Amazing ocean views 🌊 #nature #ocean #waves",
    likes: 12543,
    comments: 432,
    shares: 129,
    author: {
      name: "Sarah Johnson",
      username: "sarahj",
      avatar: "https://randomuser.me/api/portraits/women/44.jpg",
      verified: true,
    },
    isFollowing: true,
  },
  {
    id: "2",
    url: "https://assets.mixkit.co/videos/preview/mixkit-tree-with-yellow-flowers-1173-large.mp4",
    thumbnail: "https://images.unsplash.com/photo-1596993100471-c3905dae0b84?q=80&w=800&auto=format&fit=crop",
    description: "Spring has arrived! 🌸 #spring #flowers #nature",
    likes: 8432,
    comments: 256,
    shares: 78,
    author: {
      name: "Michael Chen",
      username: "mikechen",
      avatar: "https://randomuser.me/api/portraits/men/32.jpg",
      verified: false,
    },
    isFollowing: false,
  },
  {
    id: "3",
    url: "https://assets.mixkit.co/videos/preview/mixkit-woman-running-through-the-city-32952-large.mp4",
    thumbnail: "https://images.unsplash.com/photo-1504593811423-6dd665756598?q=80&w=800&auto=format&fit=crop",
    description: "Morning run through the city 🏙️ #fitness #running #citylife",
    likes: 5672,
    comments: 187,
    shares: 42,
    author: {
      name: "Jessica Williams",
      username: "jesswill",
      avatar: "https://randomuser.me/api/portraits/women/28.jpg",
      verified: true,
    },
    isFollowing: true,
  },
];

const adData = {
  id: "ad1",
  title: "Try our new fitness app!",
  description: "Get in shape with personalized workouts and nutrition plans.",
  cta: "Download Now",
  image: "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?q=80&w=1000&auto=format&fit=crop",
  url: "#",
  sponsor: "FitLife Pro",
};

const VideoPlayer = ({ video, onNext }: { video: VideoItem; onNext: () => void }) => {
  const [liked, setLiked] = useState(false);
  const [muted, setMuted] = useState(true);
  const [following, setFollowing] = useState(video.isFollowing);

  return (
    <div className="relative h-full w-full">
      <div className="absolute inset-0 bg-black">
        <video
          src={video.url}
          poster={video.thumbnail}
          className="h-full w-full object-cover"
          autoPlay
          loop
          muted={muted}
          playsInline
          onClick={() => setMuted(!muted)}
        />
      </div>

      <div className="absolute inset-0 flex flex-col justify-between p-4 bg-gradient-to-b from-transparent via-transparent to-black/50">
        <div className="self-end">
          <Button variant="ghost" size="icon" className="text-white" onClick={() => setMuted(!muted)}>
            {muted ? <VolumeX className="h-6 w-6" /> : <Volume2 className="h-6 w-6" />}
          </Button>
        </div>

        <div className="flex items-end justify-between">
          <div className="flex-1 text-white">
            <div className="flex items-center gap-2 mb-2">
              <Avatar className="h-10 w-10 border-2 border-white">
                <AvatarImage src={video.author.avatar} alt={video.author.name} />
                <AvatarFallback>{video.author.name.substring(0, 2).toUpperCase()}</AvatarFallback>
              </Avatar>
              <div>
                <div className="flex items-center">
                  <span className="font-semibold">{video.author.name}</span>
                  {video.author.verified && (
                    <Badge variant="outline" className="ml-1 bg-blue-500 p-0">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-white" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </Badge>
                  )}
                </div>
                <Button 
                  variant={following ? "outline" : "default"} 
                  size="sm" 
                  className="h-7 text-xs"
                  onClick={() => setFollowing(!following)}
                >
                  {following ? "Following" : "Follow"}
                </Button>
              </div>
            </div>
            <p className="text-sm mb-4">{video.description}</p>
          </div>

          <div className="flex flex-col items-center gap-4">
            <div className="flex flex-col items-center">
              <Button
                variant="ghost"
                size="icon"
                className="text-white h-12 w-12 rounded-full bg-black/20"
                onClick={() => setLiked(!liked)}
              >
                <Heart className={`h-6 w-6 ${liked ? "fill-red-500 text-red-500" : ""}`} />
              </Button>
              <span className="text-white text-xs mt-1">{liked ? video.likes + 1 : video.likes}</span>
            </div>
            <div className="flex flex-col items-center">
              <Button variant="ghost" size="icon" className="text-white h-12 w-12 rounded-full bg-black/20">
                <MessageCircle className="h-6 w-6" />
              </Button>
              <span className="text-white text-xs mt-1">{video.comments}</span>
            </div>
            <div className="flex flex-col items-center">
              <Button variant="ghost" size="icon" className="text-white h-12 w-12 rounded-full bg-black/20">
                <Share2 className="h-6 w-6" />
              </Button>
              <span className="text-white text-xs mt-1">{video.shares}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const AdCard = ({ ad }: { ad: typeof adData }) => {
  return (
    <div className="relative h-full w-full">
      <div className="absolute inset-0">
        <img src={ad.image} className="h-full w-full object-cover" alt={ad.title} />
      </div>
      <div className="absolute inset-0 flex flex-col justify-end p-4 bg-gradient-to-b from-transparent to-black/70">
        <div className="text-white">
          <div className="text-xs uppercase mb-1">Ad · {ad.sponsor}</div>
          <h3 className="text-xl font-bold mb-2">{ad.title}</h3>
          <p className="text-sm mb-4">{ad.description}</p>
          <Button size="sm">{ad.cta}</Button>
        </div>
      </div>
    </div>
  );
};

const Videos = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const { user } = useAuth();

  const handleNextVideo = () => {
    if (currentIndex < videos.length + 1) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      setCurrentIndex(0);
    }
  };

  const allItems: ContentItem[] = [
    ...videos.slice(0, 2), 
    { isAd: true, ad: adData } as AdItem, 
    ...videos.slice(2)
  ];

  const currentItem = allItems[currentIndex % allItems.length];

  return (
    <div className="h-[calc(100vh-4rem)] pb-16 md:pb-0 bg-black overflow-hidden">
      {'isAd' in currentItem ? (
        <AdCard ad={currentItem.ad} />
      ) : (
        <VideoPlayer video={currentItem} onNext={handleNextVideo} />
      )}
      <FooterNav />
    </div>
  );
};

export default Videos;
