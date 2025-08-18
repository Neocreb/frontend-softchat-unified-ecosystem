import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { 
  Play, 
  Heart, 
  Share2, 
  MessageCircle, 
  Eye,
  ArrowLeft,
  Download,
  MoreHorizontal,
  Flag
} from 'lucide-react';

const VideoDetail: React.FC = () => {
  const { videoId } = useParams();
  const navigate = useNavigate();

  // TODO: Replace with real API call
  const video = {
    id: videoId,
    title: 'Amazing Video Content',
    description: 'This is a detailed description of the video content that provides context and information about what viewers can expect.',
    creator: {
      id: 'creator_1',
      username: 'amazing_creator',
      displayName: 'Amazing Creator',
      avatar: '/placeholder.svg',
      verified: true,
      followers: 125000
    },
    views: 45230,
    likes: 3420,
    comments: 156,
    shares: 89,
    duration: '2:34',
    uploadDate: '2024-01-15',
    thumbnail: '/placeholder.svg',
    videoUrl: '/placeholder-video.mp4',
    tags: ['entertainment', 'viral', 'trending'],
    category: 'Entertainment'
  };

  return (
    <div className="container mx-auto px-4 py-6 max-w-6xl">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Video Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Back Button */}
          <Button
            variant="ghost"
            onClick={() => navigate(-1)}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Videos
          </Button>

          {/* Video Player */}
          <Card>
            <CardContent className="p-0">
              <div className="relative aspect-video bg-black rounded-lg overflow-hidden">
                <img 
                  src={video.thumbnail}
                  alt={video.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <Button size="lg" className="rounded-full w-16 h-16">
                    <Play className="w-8 h-8" />
                  </Button>
                </div>
                <Badge className="absolute top-4 right-4 bg-black/70">
                  {video.duration}
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* Video Info */}
          <Card>
            <CardHeader>
              <div className="flex justify-between items-start gap-4">
                <div className="flex-1">
                  <h1 className="text-2xl font-bold mb-2">{video.title}</h1>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                    <span className="flex items-center gap-1">
                      <Eye className="w-4 h-4" />
                      {video.views.toLocaleString()} views
                    </span>
                    <span>•</span>
                    <span>{new Date(video.uploadDate).toLocaleDateString()}</span>
                  </div>
                </div>
                <Button variant="outline" size="sm">
                  <MoreHorizontal className="w-4 h-4" />
                </Button>
              </div>

              {/* Creator Info & Actions */}
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <Avatar className="w-10 h-10">
                    <AvatarImage src={video.creator.avatar} />
                    <AvatarFallback>
                      {video.creator.displayName.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold">{video.creator.displayName}</h3>
                      {video.creator.verified && (
                        <Badge variant="secondary" className="text-xs">Verified</Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {video.creator.followers.toLocaleString()} followers
                    </p>
                  </div>
                </div>
                <Button>Follow</Button>
              </div>

              {/* Engagement Actions */}
              <div className="flex items-center gap-2">
                <Button variant="outline" className="flex items-center gap-2">
                  <Heart className="w-4 h-4" />
                  {video.likes.toLocaleString()}
                </Button>
                <Button variant="outline" className="flex items-center gap-2">
                  <MessageCircle className="w-4 h-4" />
                  {video.comments}
                </Button>
                <Button variant="outline" className="flex items-center gap-2">
                  <Share2 className="w-4 h-4" />
                  Share
                </Button>
                <Button variant="outline" size="icon">
                  <Download className="w-4 h-4" />
                </Button>
                <Button variant="outline" size="icon">
                  <Flag className="w-4 h-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-muted-foreground">{video.description}</p>
                <div className="flex flex-wrap gap-2">
                  {video.tags.map((tag) => (
                    <Badge key={tag} variant="secondary">
                      #{tag}
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Comments Section */}
          <Card>
            <CardHeader>
              <h3 className="text-lg font-semibold">
                Comments ({video.comments})
              </h3>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="text-center py-8 text-muted-foreground">
                  <MessageCircle className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>Comments will be loaded here</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Related Videos */}
          <Card>
            <CardHeader>
              <h3 className="text-lg font-semibold">Related Videos</h3>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex gap-3 cursor-pointer hover:bg-gray-50 p-2 rounded">
                    <div className="relative w-24 h-16 bg-gray-200 rounded overflow-hidden flex-shrink-0">
                      <img 
                        src="/placeholder.svg" 
                        alt="Related video"
                        className="w-full h-full object-cover"
                      />
                      <Badge className="absolute bottom-1 right-1 text-xs bg-black/70">
                        1:45
                      </Badge>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-sm line-clamp-2 mb-1">
                        Related Video Title {i}
                      </h4>
                      <p className="text-xs text-muted-foreground">Creator Name</p>
                      <p className="text-xs text-muted-foreground">1.2K views</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Video Stats */}
          <Card>
            <CardHeader>
              <h3 className="text-lg font-semibold">Video Statistics</h3>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Views</span>
                  <span className="font-medium">{video.views.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Likes</span>
                  <span className="font-medium">{video.likes.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Comments</span>
                  <span className="font-medium">{video.comments}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Shares</span>
                  <span className="font-medium">{video.shares}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Category</span>
                  <span className="font-medium">{video.category}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default VideoDetail;
