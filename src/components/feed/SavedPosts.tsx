import React, { useState } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { 
  Bookmark, 
  Search, 
  Heart,
  MessageCircle,
  Share2,
  Calendar,
  Filter,
  Grid,
  List,
  MoreHorizontal
} from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface SavedPost {
  id: string;
  content: string;
  author: {
    name: string;
    username: string;
    avatar: string;
    verified: boolean;
  };
  savedAt: string;
  originalDate: string;
  likes: number;
  comments: number;
  shares: number;
  type: 'text' | 'image' | 'video' | 'link';
  media?: string;
  category?: string;
}

const SavedPosts: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterBy, setFilterBy] = useState<'all' | 'text' | 'image' | 'video' | 'link'>('all');
  const [sortBy, setSortBy] = useState<'recent' | 'oldest' | 'popular'>('recent');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list');

  // Mock saved posts data
  const [savedPosts] = useState<SavedPost[]>([
    {
      id: '1',
      content: 'Amazing insights on crypto trading strategies. This breakdown of DeFi protocols really helped me understand the market better! 📈',
      author: {
        name: 'Alex Chen',
        username: 'alexcrypto',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
        verified: true,
      },
      savedAt: '2 hours ago',
      originalDate: '1 day ago',
      likes: 234,
      comments: 45,
      shares: 67,
      type: 'text',
      category: 'Crypto',
    },
    {
      id: '2',
      content: 'Beautiful sunset timelapse from the mountains. Nature never fails to amaze! 🌅',
      author: {
        name: 'Sarah Williams',
        username: 'naturephotography',
        avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150',
        verified: false,
      },
      savedAt: '5 hours ago',
      originalDate: '3 days ago',
      likes: 892,
      comments: 156,
      shares: 234,
      type: 'video',
      media: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=500',
      category: 'Photography',
    },
    {
      id: '3',
      content: 'Complete guide to React best practices in 2024. Essential reading for every developer! 💻',
      author: {
        name: 'Dev Master',
        username: 'devmaster',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150',
        verified: true,
      },
      savedAt: '1 day ago',
      originalDate: '5 days ago',
      likes: 567,
      comments: 89,
      shares: 123,
      type: 'link',
      category: 'Development',
    },
    {
      id: '4',
      content: 'Just finished my latest digital art piece! What do you think? 🎨',
      author: {
        name: 'Artist Maya',
        username: 'mayaart',
        avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150',
        verified: false,
      },
      savedAt: '2 days ago',
      originalDate: '1 week ago',
      likes: 445,
      comments: 78,
      shares: 89,
      type: 'image',
      media: 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=500',
      category: 'Art',
    },
  ]);

  // Filter and sort posts
  const filteredPosts = savedPosts
    .filter(post => {
      const matchesSearch = post.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           post.author.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesFilter = filterBy === 'all' || post.type === filterBy;
      return matchesSearch && matchesFilter;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'popular':
          return (b.likes + b.comments + b.shares) - (a.likes + a.comments + a.shares);
        case 'oldest':
          return 1; // Would implement proper date sorting in real app
        case 'recent':
        default:
          return -1; // Would implement proper date sorting in real app
      }
    });

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'video': return '🎥';
      case 'image': return '🖼️';
      case 'link': return '🔗';
      default: return '📝';
    }
  };

  const getTypeBadgeColor = (type: string) => {
    switch (type) {
      case 'video': return 'bg-purple-500';
      case 'image': return 'bg-green-500';
      case 'link': return 'bg-blue-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Bookmark className="h-6 w-6 text-primary" />
          <h1 className="text-2xl font-bold">Saved Posts</h1>
          <Badge variant="secondary">{filteredPosts.length} saved</Badge>
        </div>
        
        <div className="flex items-center gap-2">
          <Button
            variant={viewMode === 'list' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('list')}
          >
            <List className="h-4 w-4" />
          </Button>
          <Button
            variant={viewMode === 'grid' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('grid')}
          >
            <Grid className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search saved posts..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>
            
            <div className="flex gap-2">
              <Select value={filterBy} onValueChange={(value) => setFilterBy(value as any)}>
                <SelectTrigger className="w-32">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="text">Text</SelectItem>
                  <SelectItem value="image">Images</SelectItem>
                  <SelectItem value="video">Videos</SelectItem>
                  <SelectItem value="link">Links</SelectItem>
                </SelectContent>
              </Select>

              <Select value={sortBy} onValueChange={(value) => setSortBy(value as any)}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="recent">Recent</SelectItem>
                  <SelectItem value="oldest">Oldest</SelectItem>
                  <SelectItem value="popular">Popular</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Posts */}
      {filteredPosts.length === 0 ? (
        <Card className="p-12 text-center">
          <Bookmark className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
          <h3 className="text-lg font-semibold mb-2">No saved posts found</h3>
          <p className="text-muted-foreground">
            {searchQuery || filterBy !== 'all' 
              ? "Try adjusting your search or filters" 
              : "Start bookmarking posts to see them here!"
            }
          </p>
        </Card>
      ) : (
        <div className={cn(
          "space-y-4",
          viewMode === 'grid' && "grid grid-cols-1 md:grid-cols-2 gap-4 space-y-0"
        )}>
          {filteredPosts.map((post) => (
            <Card key={post.id} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={post.author.avatar} alt={post.author.name} />
                      <AvatarFallback>{post.author.name[0]}</AvatarFallback>
                    </Avatar>
                    
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold">{post.author.name}</span>
                        {post.author.verified && (
                          <Badge variant="default" className="px-1 py-0 h-4 bg-blue-500">
                            ✓
                          </Badge>
                        )}
                        <Badge 
                          className={cn("px-2 py-0.5 text-xs text-white", getTypeBadgeColor(post.type))}
                        >
                          {getTypeIcon(post.type)} {post.type}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        @{post.author.username} • {post.originalDate}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <div className="text-xs text-muted-foreground">
                      <Calendar className="h-3 w-3 inline mr-1" />
                      Saved {post.savedAt}
                    </div>
                    <Button variant="ghost" size="sm">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="px-4 py-0">
                <p className="mb-3 text-sm leading-relaxed">{post.content}</p>
                
                {post.media && (
                  <div className="mb-3 overflow-hidden rounded-lg">
                    <img
                      src={post.media}
                      alt="Post media"
                      className="w-full h-48 object-cover"
                    />
                  </div>
                )}

                {post.category && (
                  <Badge variant="outline" className="mb-3">
                    {post.category}
                  </Badge>
                )}

                {/* Post Actions */}
                <div className="flex items-center justify-between py-3 border-t">
                  <div className="flex items-center gap-4">
                    <Button variant="ghost" size="sm" className="text-muted-foreground">
                      <Heart className="h-4 w-4 mr-1" />
                      {post.likes}
                    </Button>
                    <Button variant="ghost" size="sm" className="text-muted-foreground">
                      <MessageCircle className="h-4 w-4 mr-1" />
                      {post.comments}
                    </Button>
                    <Button variant="ghost" size="sm" className="text-muted-foreground">
                      <Share2 className="h-4 w-4 mr-1" />
                      {post.shares}
                    </Button>
                  </div>
                  
                  <Button variant="ghost" size="sm" className="text-primary">
                    <Bookmark className="h-4 w-4 fill-current" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default SavedPosts;
