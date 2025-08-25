import React, { useState } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { 
  History, 
  Search, 
  Play,
  Clock,
  Eye,
  Calendar,
  Filter,
  Trash2,
  MoreHorizontal,
  PlayCircle,
  FileText,
  ExternalLink
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

interface WatchHistoryItem {
  id: string;
  title: string;
  content: string;
  author: {
    name: string;
    username: string;
    avatar: string;
    verified: boolean;
  };
  watchedAt: string;
  type: 'video' | 'article' | 'live';
  duration?: string;
  watchedDuration?: string;
  progress?: number; // percentage watched
  thumbnail?: string;
  views: number;
  category?: string;
  completed: boolean;
}

const WatchHistory: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterBy, setFilterBy] = useState<'all' | 'video' | 'article' | 'live'>('all');
  const [sortBy, setSortBy] = useState<'recent' | 'oldest' | 'progress'>('recent');

  // Mock watch history data
  const [watchHistory] = useState<WatchHistoryItem[]>([
    {
      id: '1',
      title: 'Complete Guide to Crypto Trading',
      content: 'Learn advanced trading strategies, technical analysis, and risk management in cryptocurrency markets.',
      author: {
        name: 'Crypto Expert',
        username: 'cryptoexpert',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
        verified: true,
      },
      watchedAt: '2 hours ago',
      type: 'video',
      duration: '15:32',
      watchedDuration: '12:45',
      progress: 82,
      thumbnail: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=500',
      views: 15420,
      category: 'Education',
      completed: false,
    },
    {
      id: '2',
      title: 'React 18 New Features Deep Dive',
      content: 'Exploring concurrent features, automatic batching, and new hooks in React 18.',
      author: {
        name: 'Dev Tutorial',
        username: 'devtutorial',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150',
        verified: true,
      },
      watchedAt: '5 hours ago',
      type: 'article',
      views: 8934,
      category: 'Programming',
      completed: true,
      progress: 100,
    },
    {
      id: '3',
      title: 'Live: Market Analysis & Trading Session',
      content: 'Join our live trading session with real-time market analysis and trading decisions.',
      author: {
        name: 'Trading Pro',
        username: 'tradingpro',
        avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150',
        verified: false,
      },
      watchedAt: '1 day ago',
      type: 'live',
      duration: '2:15:00',
      watchedDuration: '45:30',
      progress: 34,
      thumbnail: 'https://images.unsplash.com/photo-1559445368-92d4e08c5e8f?w=500',
      views: 2340,
      category: 'Finance',
      completed: false,
    },
    {
      id: '4',
      title: 'UI/UX Design Principles for 2024',
      content: 'Modern design trends, accessibility best practices, and user experience optimization.',
      author: {
        name: 'Design Master',
        username: 'designmaster',
        avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150',
        verified: true,
      },
      watchedAt: '2 days ago',
      type: 'video',
      duration: '28:15',
      watchedDuration: '28:15',
      progress: 100,
      thumbnail: 'https://images.unsplash.com/photo-1586717791821-3f44a563fa4c?w=500',
      views: 12650,
      category: 'Design',
      completed: true,
    },
    {
      id: '5',
      title: 'Building Scalable Microservices',
      content: 'Architecture patterns, deployment strategies, and monitoring for microservices at scale.',
      author: {
        name: 'System Architect',
        username: 'sysarchitect',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
        verified: false,
      },
      watchedAt: '3 days ago',
      type: 'article',
      views: 5670,
      category: 'Architecture',
      completed: false,
      progress: 65,
    },
  ]);

  // Filter and sort history
  const filteredHistory = watchHistory
    .filter(item => {
      const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           item.author.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           item.content.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesFilter = filterBy === 'all' || item.type === filterBy;
      return matchesSearch && matchesFilter;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'progress':
          return (b.progress || 0) - (a.progress || 0);
        case 'oldest':
          return 1; // Would implement proper date sorting in real app
        case 'recent':
        default:
          return -1; // Would implement proper date sorting in real app
      }
    });

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'video': return <PlayCircle className="h-4 w-4" />;
      case 'live': return <div className="h-4 w-4 bg-red-500 rounded-full animate-pulse" />;
      case 'article': return <FileText className="h-4 w-4" />;
      default: return <Eye className="h-4 w-4" />;
    }
  };

  const getTypeBadgeColor = (type: string) => {
    switch (type) {
      case 'video': return 'bg-purple-500';
      case 'live': return 'bg-red-500';
      case 'article': return 'bg-blue-500';
      default: return 'bg-gray-500';
    }
  };

  const formatDuration = (duration: string) => {
    return duration;
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <History className="h-6 w-6 text-primary" />
          <h1 className="text-2xl font-bold">Watch History</h1>
          <Badge variant="secondary">{filteredHistory.length} items</Badge>
        </div>
        
        <Button variant="outline" size="sm" className="text-red-500 hover:text-red-600">
          <Trash2 className="h-4 w-4 mr-2" />
          Clear History
        </Button>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search history..."
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
                  <SelectItem value="video">Videos</SelectItem>
                  <SelectItem value="article">Articles</SelectItem>
                  <SelectItem value="live">Live Streams</SelectItem>
                </SelectContent>
              </Select>

              <Select value={sortBy} onValueChange={(value) => setSortBy(value as any)}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="recent">Recent</SelectItem>
                  <SelectItem value="oldest">Oldest</SelectItem>
                  <SelectItem value="progress">By Progress</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* History Items */}
      {filteredHistory.length === 0 ? (
        <Card className="p-12 text-center">
          <History className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
          <h3 className="text-lg font-semibold mb-2">No watch history found</h3>
          <p className="text-muted-foreground">
            {searchQuery || filterBy !== 'all' 
              ? "Try adjusting your search or filters" 
              : "Start watching videos and reading articles to see your history here!"
            }
          </p>
        </Card>
      ) : (
        <div className="space-y-4">
          {filteredHistory.map((item) => (
            <Card key={item.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex gap-4">
                  {/* Thumbnail */}
                  <div className="relative flex-shrink-0 w-32 h-20 bg-muted rounded-lg overflow-hidden">
                    {item.thumbnail ? (
                      <img
                        src={item.thumbnail}
                        alt={item.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-muted">
                        {getTypeIcon(item.type)}
                      </div>
                    )}
                    
                    {/* Duration overlay */}
                    {item.duration && (
                      <div className="absolute bottom-1 right-1 bg-black/70 text-white text-xs px-1.5 py-0.5 rounded">
                        {formatDuration(item.duration)}
                      </div>
                    )}
                    
                    {/* Play button overlay */}
                    <div className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 hover:opacity-100 transition-opacity">
                      <Play className="h-8 w-8 text-white" />
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <h3 className="font-semibold text-sm leading-tight line-clamp-2 mb-1">
                          {item.title}
                        </h3>
                        
                        <div className="flex items-center gap-2 mb-2">
                          <Avatar className="h-6 w-6">
                            <AvatarImage src={item.author.avatar} alt={item.author.name} />
                            <AvatarFallback className="text-xs">{item.author.name[0]}</AvatarFallback>
                          </Avatar>
                          <span className="text-sm text-muted-foreground">{item.author.name}</span>
                          {item.author.verified && (
                            <Badge variant="default" className="px-1 py-0 h-3 bg-blue-500 text-xs">
                              ✓
                            </Badge>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2 ml-4">
                        <Badge 
                          className={cn("px-2 py-0.5 text-xs text-white", getTypeBadgeColor(item.type))}
                        >
                          {getTypeIcon(item.type)}
                          <span className="ml-1 capitalize">{item.type}</span>
                        </Badge>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>

                    <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                      {item.content}
                    </p>

                    {/* Progress Bar */}
                    {item.progress !== undefined && (
                      <div className="mb-2">
                        <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
                          <span>
                            {item.watchedDuration && item.duration 
                              ? `${formatDuration(item.watchedDuration)} / ${formatDuration(item.duration)}`
                              : `${item.progress}% complete`
                            }
                          </span>
                          {item.completed && (
                            <Badge variant="outline" className="text-green-600 border-green-600">
                              Completed
                            </Badge>
                          )}
                        </div>
                        <Progress value={item.progress} className="h-1" />
                      </div>
                    )}

                    {/* Meta info */}
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1">
                          <Eye className="h-3 w-3" />
                          {item.views.toLocaleString()} views
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          Watched {item.watchedAt}
                        </div>
                        {item.category && (
                          <Badge variant="outline" className="text-xs">
                            {item.category}
                          </Badge>
                        )}
                      </div>
                      
                      <Button variant="ghost" size="sm" className="text-primary">
                        <ExternalLink className="h-3 w-3 mr-1" />
                        Continue
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default WatchHistory;
