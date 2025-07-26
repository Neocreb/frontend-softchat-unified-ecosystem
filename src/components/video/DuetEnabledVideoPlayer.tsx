import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Play, 
  Pause, 
  Heart, 
  MessageCircle, 
  Share2, 
  Volume2, 
  VolumeX,
  MoreHorizontal,
  Flag,
  BookmarkPlus,
  Copy,
  Download,
  ExternalLink,
  Loader2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import DuetRecorder from './DuetRecorder';
import InteractiveFeatures from './InteractiveFeatures';

interface VideoData {
  id: string;
  url: string;
  thumbnail?: string;
  duration: number;
  title: string;
  description: string;
  author: {
    id: string;
    name: string;
    username: string;
    avatar: string;
    verified: boolean;
  };
  stats: {
    likes: number;
    comments: number;
    shares: number;
    duets: number;
  };
  isDuet?: boolean;
  duetOfPostId?: string;
  originalCreatorUsername?: string;
  duetStyle?: 'side-by-side' | 'react-respond' | 'picture-in-picture';
  audioSource?: 'original' | 'both' | 'voiceover';
}

interface DuetEnabledVideoPlayerProps {
  video: VideoData;
  allowDuets?: boolean;
  autoPlay?: boolean;
  showControls?: boolean;
  className?: string;
  onLike?: (videoId: string) => void;
  onComment?: (videoId: string) => void;
  onShare?: (videoId: string) => void;
  onDuetComplete?: (duetData: any) => void;
}

const DuetEnabledVideoPlayer: React.FC<DuetEnabledVideoPlayerProps> = ({
  video,
  allowDuets = true,
  autoPlay = false,
  showControls = true,
  className,
  onLike,
  onComment,
  onShare,
  onDuetComplete,
}) => {
  // Video state
  const [isPlaying, setIsPlaying] = useState(autoPlay);
  const [isMuted, setIsMuted] = useState(true);
  const [isLiked, setIsLiked] = useState(false);
  const [isFollowing, setIsFollowing] = useState(false);
  
  // Duet state
  const [showDuetDialog, setShowDuetDialog] = useState(false);
  const [showDuetRecorder, setShowDuetRecorder] = useState(false);
  const [selectedDuetStyle, setSelectedDuetStyle] = useState<'side-by-side' | 'react-respond' | 'picture-in-picture'>('side-by-side');
  const [isLoadingOriginalData, setIsLoadingOriginalData] = useState(false);
  const [originalVideoData, setOriginalVideoData] = useState<any>(null);
  
  // Share dialog state
  const [showShareDialog, setShowShareDialog] = useState(false);
  const [showReportDialog, setShowReportDialog] = useState(false);
  
  const { toast } = useToast();
  const videoRef = React.useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.play();
      } else {
        videoRef.current.pause();
      }
    }
  }, [isPlaying]);

  const handleVideoClick = () => {
    setIsPlaying(!isPlaying);
  };

  const handleMuteToggle = () => {
    setIsMuted(!isMuted);
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
    }
  };

  const handleLike = () => {
    setIsLiked(!isLiked);
    if (onLike) {
      onLike(video.id);
    }
    toast({
      title: isLiked ? 'Removed from likes' : 'Added to likes',
      duration: 2000,
    });
  };

  const handleFollow = () => {
    setIsFollowing(!isFollowing);
    toast({
      title: isFollowing ? `Unfollowed @${video.author.username}` : `Following @${video.author.username}`,
      duration: 2000,
    });
  };

  const handleDuetRequest = async (style: 'side-by-side' | 'react-respond' | 'picture-in-picture') => {
    setSelectedDuetStyle(style);
    setIsLoadingOriginalData(true);
    
    try {
      // Fetch original video data for duet creation
      const response = await fetch(`/api/duets/original/${video.id}`);
      const data = await response.json();
      
      if (data.success) {
        setOriginalVideoData({
          id: video.id,
          url: video.url,
          duration: video.duration,
          creatorUsername: video.author.username,
          creatorId: video.author.id,
          title: video.title,
          thumbnail: video.thumbnail,
        });
        setShowDuetDialog(false);
        setShowDuetRecorder(true);
      } else {
        throw new Error(data.error || 'Failed to load original video data');
      }
    } catch (error) {
      console.error('Error loading original video data:', error);
      toast({
        title: 'Error',
        description: 'Failed to load video for duet creation',
        variant: 'destructive',
      });
    } finally {
      setIsLoadingOriginalData(false);
    }
  };

  const handleDuetComplete = async (duetData: {
    videoBlob: Blob;
    duetVideoUrl: string;
    audioSource: 'original' | 'both' | 'voiceover';
    caption: string;
    tags: string[];
  }) => {
    try {
      // Prepare form data for upload
      const formData = new FormData();
      formData.append('duetVideo', duetData.videoBlob, 'duet-video.webm');
      formData.append('originalPostId', video.id);
      formData.append('duetStyle', selectedDuetStyle);
      formData.append('audioSource', duetData.audioSource);
      formData.append('caption', duetData.caption);
      
      // Add tags
      duetData.tags.forEach(tag => {
        formData.append('tags', tag);
      });

      // Upload duet
      const response = await fetch('/api/duets/create', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();

      if (result.success) {
        toast({
          title: 'Duet Created!',
          description: 'Your duet has been posted successfully.',
        });
        
        setShowDuetRecorder(false);
        
        if (onDuetComplete) {
          onDuetComplete(result.data.duetPost);
        }
      } else {
        throw new Error(result.error || 'Failed to create duet');
      }
    } catch (error) {
      console.error('Error creating duet:', error);
      toast({
        title: 'Upload Failed',
        description: 'Failed to upload your duet. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const handleShare = () => {
    setShowShareDialog(true);
  };

  const shareOptions = [
    {
      id: 'copy',
      name: 'Copy Link',
      icon: <Copy className="w-4 h-4" />,
      action: () => {
        navigator.clipboard.writeText(`${window.location.origin}/video/${video.id}`);
        toast({ title: 'Link copied to clipboard!' });
        setShowShareDialog(false);
      },
    },
    {
      id: 'download',
      name: 'Download Video',
      icon: <Download className="w-4 h-4" />,
      action: () => {
        // Create a temporary link to download
        const link = document.createElement('a');
        link.href = video.url;
        link.download = `${video.title || 'video'}.mp4`;
        link.click();
        toast({ title: 'Download started' });
        setShowShareDialog(false);
      },
    },
    {
      id: 'external',
      name: 'Share External',
      icon: <ExternalLink className="w-4 h-4" />,
      action: () => {
        if (navigator.share) {
          navigator.share({
            title: video.title,
            text: video.description,
            url: `${window.location.origin}/video/${video.id}`,
          });
        }
        setShowShareDialog(false);
      },
    },
  ];

  if (showDuetRecorder && originalVideoData) {
    return (
      <DuetRecorder
        originalVideo={originalVideoData}
        duetStyle={selectedDuetStyle}
        onCancel={() => setShowDuetRecorder(false)}
        onComplete={handleDuetComplete}
      />
    );
  }

  return (
    <>
      <Card className={cn("relative overflow-hidden bg-black", className)}>
        {/* Video Container */}
        <div className="relative aspect-[9/16] w-full">
          <video
            ref={videoRef}
            src={video.url}
            poster={video.thumbnail}
            className="h-full w-full object-cover cursor-pointer"
            loop
            muted={isMuted}
            playsInline
            onClick={handleVideoClick}
            onLoadedMetadata={() => {
              if (autoPlay && videoRef.current) {
                videoRef.current.play();
              }
            }}
          />
          
          {/* Play/Pause Overlay */}
          {!isPlaying && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/20">
              <Button
                size="icon"
                variant="ghost"
                className="w-16 h-16 rounded-full bg-white/20 hover:bg-white/30"
                onClick={handleVideoClick}
              >
                <Play className="w-8 h-8 text-white" />
              </Button>
            </div>
          )}

          {/* Video Controls Overlay */}
          {showControls && (
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/50">
              {/* Top Controls */}
              <div className="absolute top-4 right-4 flex gap-2">
                <Button
                  size="icon"
                  variant="ghost"
                  className="w-10 h-10 rounded-full bg-white/20 hover:bg-white/30"
                  onClick={handleMuteToggle}
                >
                  {isMuted ? (
                    <VolumeX className="w-5 h-5 text-white" />
                  ) : (
                    <Volume2 className="w-5 h-5 text-white" />
                  )}
                </Button>
                
                <Button
                  size="icon"
                  variant="ghost"
                  className="w-10 h-10 rounded-full bg-white/20 hover:bg-white/30"
                >
                  <MoreHorizontal className="w-5 h-5 text-white" />
                </Button>
              </div>

              {/* Bottom Content */}
              <div className="absolute bottom-0 left-0 right-0 p-4">
                <div className="flex items-end justify-between">
                  {/* Creator Info */}
                  <div className="flex-1 text-white">
                    <div className="flex items-center gap-3 mb-3">
                      <Avatar className="w-12 h-12 border-2 border-white">
                        <AvatarImage src={video.author.avatar} alt={video.author.name} />
                        <AvatarFallback>{video.author.name[0]}</AvatarFallback>
                      </Avatar>
                      
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold">{video.author.username}</span>
                          {video.author.verified && (
                            <div className="w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center">
                              <div className="w-2 h-2 bg-white rounded-full" />
                            </div>
                          )}
                        </div>
                        
                        <Button
                          size="sm"
                          variant={isFollowing ? "outline" : "default"}
                          className="mt-1 h-7 text-xs"
                          onClick={handleFollow}
                        >
                          {isFollowing ? 'Following' : 'Follow'}
                        </Button>
                      </div>
                    </div>

                    {/* Video Info */}
                    <div className="space-y-1">
                      <p className="text-sm font-medium">{video.title}</p>
                      <p className="text-xs text-gray-300 line-clamp-2">{video.description}</p>
                      
                      {/* Duet Badge */}
                      {video.isDuet && video.originalCreatorUsername && (
                        <Badge variant="secondary" className="text-xs">
                          Duet with @{video.originalCreatorUsername}
                        </Badge>
                      )}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-col items-center gap-4 ml-4">
                    {/* Like */}
                    <div className="flex flex-col items-center">
                      <Button
                        size="icon"
                        variant="ghost"
                        className="w-12 h-12 rounded-full bg-white/20 hover:bg-white/30"
                        onClick={handleLike}
                      >
                        <Heart className={cn(
                          "w-6 h-6",
                          isLiked ? "fill-red-500 text-red-500" : "text-white"
                        )} />
                      </Button>
                      <span className="text-xs text-white mt-1">
                        {(video.stats.likes + (isLiked ? 1 : 0)).toLocaleString()}
                      </span>
                    </div>

                    {/* Comments */}
                    <div className="flex flex-col items-center">
                      <Button
                        size="icon"
                        variant="ghost"
                        className="w-12 h-12 rounded-full bg-white/20 hover:bg-white/30"
                        onClick={() => onComment?.(video.id)}
                      >
                        <MessageCircle className="w-6 h-6 text-white" />
                      </Button>
                      <span className="text-xs text-white mt-1">
                        {video.stats.comments.toLocaleString()}
                      </span>
                    </div>

                    {/* Duet */}
                    {allowDuets && (
                      <div className="flex flex-col items-center">
                        <Button
                          size="icon"
                          variant="ghost"
                          className="w-12 h-12 rounded-full bg-white/20 hover:bg-white/30"
                          onClick={() => setShowDuetDialog(true)}
                          disabled={isLoadingOriginalData}
                        >
                          {isLoadingOriginalData ? (
                            <Loader2 className="w-6 h-6 text-white animate-spin" />
                          ) : (
                            <Users className="w-6 h-6 text-white" />
                          )}
                        </Button>
                        <span className="text-xs text-white mt-1">
                          {video.stats.duets.toLocaleString()}
                        </span>
                      </div>
                    )}

                    {/* Share */}
                    <div className="flex flex-col items-center">
                      <Button
                        size="icon"
                        variant="ghost"
                        className="w-12 h-12 rounded-full bg-white/20 hover:bg-white/30"
                        onClick={handleShare}
                      >
                        <Share2 className="w-6 h-6 text-white" />
                      </Button>
                      <span className="text-xs text-white mt-1">
                        {video.stats.shares.toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </Card>

      {/* Duet Style Selection Dialog */}
      <Dialog open={showDuetDialog} onOpenChange={setShowDuetDialog}>
        <DialogContent className="bg-black border-gray-800 text-white">
          <DialogHeader>
            <DialogTitle>Create Duet</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-gray-400">
              Create a duet video alongside this original content. Choose your style:
            </p>
            <div className="space-y-2">
              <Button
                variant="ghost"
                className="w-full justify-start p-4 h-auto"
                onClick={() => handleDuetRequest('side-by-side')}
                disabled={isLoadingOriginalData}
              >
                <div className="flex items-center gap-3">
                  <Users className="w-5 h-5" />
                  <div className="text-left">
                    <div className="font-medium">Side-by-side Duet</div>
                    <div className="text-sm text-gray-400">Record alongside the original video</div>
                  </div>
                </div>
              </Button>
              
              <Button
                variant="ghost"
                className="w-full justify-start p-4 h-auto"
                onClick={() => handleDuetRequest('react-respond')}
                disabled={isLoadingOriginalData}
              >
                <div className="flex items-center gap-3">
                  <Play className="w-5 h-5" />
                  <div className="text-left">
                    <div className="font-medium">React & Respond</div>
                    <div className="text-sm text-gray-400">Original on top, your reaction below</div>
                  </div>
                </div>
              </Button>
              
              <Button
                variant="ghost"
                className="w-full justify-start p-4 h-auto"
                onClick={() => handleDuetRequest('picture-in-picture')}
                disabled={isLoadingOriginalData}
              >
                <div className="flex items-center gap-3">
                  <div className="w-5 h-5 border border-current rounded flex items-center justify-center">
                    <div className="w-2 h-2 border border-current rounded" />
                  </div>
                  <div className="text-left">
                    <div className="font-medium">Picture-in-Picture</div>
                    <div className="text-sm text-gray-400">Small overlay on the original video</div>
                  </div>
                </div>
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Share Dialog */}
      <Dialog open={showShareDialog} onOpenChange={setShowShareDialog}>
        <DialogContent className="bg-black border-gray-800 text-white">
          <DialogHeader>
            <DialogTitle>Share Video</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            {shareOptions.map((option) => (
              <Button
                key={option.id}
                variant="ghost"
                className="w-full justify-start"
                onClick={option.action}
              >
                {option.icon}
                <span className="ml-3">{option.name}</span>
              </Button>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default DuetEnabledVideoPlayer;
