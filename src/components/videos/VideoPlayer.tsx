
import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Heart, MessageCircle, Share2, VolumeX, Volume2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { VideoItem } from "@/types/video";

interface VideoPlayerProps {
  video: VideoItem;
  onNext: () => void;
}

const VideoPlayer = ({ video, onNext }: VideoPlayerProps) => {
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

export default VideoPlayer;
