import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  Search, 
  Filter, 
  TrendingUp, 
  Music, 
  Hash, 
  User, 
  Video, 
  Sparkles,
  Clock,
  Eye,
  Heart,
  MessageCircle,
  Share2,
  Mic,
  Camera,
  Globe,
  Calendar,
  Target,
  Play,
  X,
  ChevronRight,
  Star,
  Bookmark,
  BarChart3,
  Zap
} from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

interface SearchFilters {
  category: string;
  duration: [number, number];
  uploadDate: string;
  engagement: string;
  quality: string;
  language: string;
  hasCaption: boolean;
  isLive: boolean;
  allowDuets: boolean;
}

interface SearchResult {
  id: string;
  type: 'video' | 'user' | 'hashtag' | 'sound' | 'challenge';
  title: string;
  description?: string;
  thumbnail?: string;
  avatar?: string;
  stats?: {
    views?: number;
    likes?: number;
    uses?: number;
    participants?: number;
  };
  tags?: string[];
  verified?: boolean;
  trending?: boolean;
  duration?: number;
  uploadDate?: string;
}

interface TrendingData {
  hashtags: Array<{ tag: string; uses: number; growth: number }>;
  sounds: Array<{ id: string; title: string; artist: string; uses: number; trending: boolean }>;
  challenges: Array<{ id: string; title: string; description: string; participants: number; prize?: string }>;
  creators: Array<{ id: string; username: string; avatar: string; followers: number; verified: boolean }>;
}

const EnhancedSearchDiscovery: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [trendingData, setTrendingData] = useState<TrendingData | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [searchFilters, setSearchFilters] = useState<SearchFilters>({
    category: 'all',
    duration: [0, 300],
    uploadDate: 'any',
    engagement: 'any',
    quality: 'any',
    language: 'any',
    hasCaption: false,
    isLive: false,
    allowDuets: false
  });
  const [showFilters, setShowFilters] = useState(false);
  const [selectedType, setSelectedType] = useState<'all' | 'videos' | 'users' | 'hashtags' | 'sounds' | 'challenges'>('all');
  const [voiceSearchActive, setVoiceSearchActive] = useState(false);
  const [searchHistory, setSearchHistory] = useState<string[]>([]);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const recognitionRef = useRef<SpeechRecognition | null>(null);

  // Initialize voice search
  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      
      if (recognitionRef.current) {
        recognitionRef.current.continuous = false;
        recognitionRef.current.interimResults = false;
        recognitionRef.current.lang = 'en-US';
        
        recognitionRef.current.onresult = (event: any) => {
          const query = event.results[0][0].transcript;
          setSearchQuery(query);
          performSearch(query);
          setVoiceSearchActive(false);
        };
        
        recognitionRef.current.onerror = () => {
          setVoiceSearchActive(false);
        };
        
        recognitionRef.current.onend = () => {
          setVoiceSearchActive(false);
        };
      }
    }
  }, []);

  // Load trending data
  useEffect(() => {
    loadTrendingData();
  }, []);

  // Generate search suggestions
  useEffect(() => {
    if (searchQuery.length > 2) {
      generateSuggestions(searchQuery);
    } else {
      setSuggestions([]);
    }
  }, [searchQuery]);

  const loadTrendingData = async () => {
    // Simulated trending data - in real app, this would come from API
    const mockTrending: TrendingData = {
      hashtags: [
        { tag: 'AIRevolution', uses: 2456000, growth: 156.3 },
        { tag: 'CryptoLife', uses: 1890000, growth: 89.7 },
        { tag: 'TechTok', uses: 1234000, growth: 234.5 },
        { tag: 'FutureNow', uses: 987000, growth: 67.8 },
        { tag: 'DigitalArt', uses: 756000, growth: 123.4 },
        { tag: 'Innovation', uses: 654000, growth: 45.6 },
        { tag: 'WebThree', uses: 543000, growth: 189.2 },
        { tag: 'Metaverse', uses: 432000, growth: 78.9 }
      ],
      sounds: [
        { id: '1', title: 'AI Dreams', artist: 'Synth Wave', uses: 45000, trending: true },
        { id: '2', title: 'Digital Echoes', artist: 'Future Beats', uses: 38000, trending: true },
        { id: '3', title: 'Crypto Anthem', artist: 'Block Chain', uses: 32000, trending: false },
        { id: '4', title: 'Tech Vibes', artist: 'Innovation Mix', uses: 28000, trending: true },
        { id: '5', title: 'Virtual Reality', artist: 'Meta Sounds', uses: 25000, trending: false }
      ],
      challenges: [
        { id: '1', title: 'AI Art Challenge', description: 'Create art using AI tools', participants: 125000, prize: '$10,000' },
        { id: '2', title: 'Crypto Explain Challenge', description: 'Explain crypto in 60 seconds', participants: 89000 },
        { id: '3', title: 'Tech Life Hack', description: 'Share your best tech tips', participants: 67000, prize: 'MacBook Pro' },
        { id: '4', title: 'Future Prediction', description: 'Predict tech trends for 2025', participants: 54000 },
        { id: '5', title: 'Code in 30', description: 'Explain coding concepts quickly', participants: 43000 }
      ],
      creators: [
        { id: '1', username: 'ai_innovator', avatar: 'https://i.pravatar.cc/150?img=11', followers: 2340000, verified: true },
        { id: '2', username: 'crypto_guru', avatar: 'https://i.pravatar.cc/150?img=12', followers: 1890000, verified: true },
        { id: '3', username: 'tech_wizard', avatar: 'https://i.pravatar.cc/150?img=13', followers: 1456000, verified: false },
        { id: '4', username: 'future_dev', avatar: 'https://i.pravatar.cc/150?img=14', followers: 987000, verified: true },
        { id: '5', username: 'digital_artist', avatar: 'https://i.pravatar.cc/150?img=15', followers: 756000, verified: false }
      ]
    };
    
    setTrendingData(mockTrending);
  };

  const generateSuggestions = (query: string) => {
    const suggestions = [
      `${query} tutorial`,
      `${query} challenge`,
      `${query} trends`,
      `${query} compilation`,
      `${query} tips`,
      `${query} review`,
      `${query} explained`,
      `${query} 2024`
    ];
    setSuggestions(suggestions.slice(0, 5));
  };

  const performSearch = async (query: string) => {
    if (!query.trim()) return;
    
    setIsSearching(true);
    
    // Add to search history
    setSearchHistory(prev => {
      const filtered = prev.filter(item => item !== query);
      return [query, ...filtered].slice(0, 10);
    });
    
    // Simulated search results
    setTimeout(() => {
      const mockResults: SearchResult[] = [
        {
          id: '1',
          type: 'video',
          title: `${query} - Complete Guide`,
          description: `Everything you need to know about ${query}`,
          thumbnail: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=400',
          stats: { views: 234000, likes: 15600 },
          tags: [query, 'tutorial', 'guide'],
          duration: 180
        },
        {
          id: '2',
          type: 'user',
          title: `${query}_expert`,
          description: `Leading creator in ${query} content`,
          avatar: 'https://i.pravatar.cc/150?img=16',
          stats: { views: 2340000 },
          verified: true
        },
        {
          id: '3',
          type: 'hashtag',
          title: `#${query}Challenge`,
          description: 'Join the trending challenge',
          stats: { uses: 456000 },
          trending: true
        },
        {
          id: '4',
          type: 'sound',
          title: `${query} Beats`,
          description: 'Trending audio for your videos',
          stats: { uses: 34000 },
          trending: true
        },
        {
          id: '5',
          type: 'challenge',
          title: `Ultimate ${query} Challenge`,
          description: `Show off your ${query} skills`,
          stats: { participants: 67000 }
        }
      ];
      
      setSearchResults(mockResults);
      setIsSearching(false);
    }, 1500);
  };

  const startVoiceSearch = () => {
    if (recognitionRef.current && !voiceSearchActive) {
      setVoiceSearchActive(true);
      recognitionRef.current.start();
    }
  };

  const formatNumber = (num: number): string => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  const getResultIcon = (type: string) => {
    switch (type) {
      case 'video': return <Video className="h-4 w-4" />;
      case 'user': return <User className="h-4 w-4" />;
      case 'hashtag': return <Hash className="h-4 w-4" />;
      case 'sound': return <Music className="h-4 w-4" />;
      case 'challenge': return <Target className="h-4 w-4" />;
      default: return <Search className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Enhanced Search Header */}
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              ref={searchInputRef}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && performSearch(searchQuery)}
              placeholder="Search videos, creators, sounds, hashtags..."
              className="pl-10 pr-20 py-3 text-lg bg-background border-2 border-border focus:border-primary"
            />
            <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={startVoiceSearch}
                disabled={voiceSearchActive}
                className={voiceSearchActive ? 'text-red-500 animate-pulse' : ''}
              >
                <Mic className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowFilters(!showFilters)}
              >
                <Filter className="h-4 w-4" />
              </Button>
            </div>
          </div>
          <Button 
            onClick={() => performSearch(searchQuery)}
            disabled={isSearching}
            className="px-6"
          >
            {isSearching ? 'Searching...' : 'Search'}
          </Button>
        </div>

        {/* Search Suggestions */}
        {suggestions.length > 0 && searchQuery && (
          <Card className="absolute z-10 w-full max-w-md">
            <CardContent className="p-2">
              {suggestions.map((suggestion, index) => (
                <button
                  key={index}
                  onClick={() => {
                    setSearchQuery(suggestion);
                    setSuggestions([]);
                    performSearch(suggestion);
                  }}
                  className="w-full text-left px-3 py-2 hover:bg-muted rounded-md text-sm"
                >
                  <Search className="h-3 w-3 inline mr-2" />
                  {suggestion}
                </button>
              ))}
            </CardContent>
          </Card>
        )}

        {/* Search Type Filters */}
        <div className="flex items-center gap-2 overflow-x-auto">
          {['all', 'videos', 'users', 'hashtags', 'sounds', 'challenges'].map((type) => (
            <Button
              key={type}
              variant={selectedType === type ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedType(type as any)}
              className="capitalize whitespace-nowrap"
            >
              {type}
            </Button>
          ))}
        </div>

        {/* Advanced Filters */}
        {showFilters && (
          <Card>
            <CardContent className="p-4 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>Category</Label>
                  <Select
                    value={searchFilters.category}
                    onValueChange={(value) => setSearchFilters(prev => ({ ...prev, category: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Categories</SelectItem>
                      <SelectItem value="entertainment">Entertainment</SelectItem>
                      <SelectItem value="education">Education</SelectItem>
                      <SelectItem value="technology">Technology</SelectItem>
                      <SelectItem value="finance">Finance</SelectItem>
                      <SelectItem value="lifestyle">Lifestyle</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Upload Date</Label>
                  <Select
                    value={searchFilters.uploadDate}
                    onValueChange={(value) => setSearchFilters(prev => ({ ...prev, uploadDate: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="any">Any Time</SelectItem>
                      <SelectItem value="hour">Last Hour</SelectItem>
                      <SelectItem value="day">Last 24 Hours</SelectItem>
                      <SelectItem value="week">Last Week</SelectItem>
                      <SelectItem value="month">Last Month</SelectItem>
                      <SelectItem value="year">Last Year</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Video Quality</Label>
                  <Select
                    value={searchFilters.quality}
                    onValueChange={(value) => setSearchFilters(prev => ({ ...prev, quality: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="any">Any Quality</SelectItem>
                      <SelectItem value="hd">HD (720p+)</SelectItem>
                      <SelectItem value="fullhd">Full HD (1080p+)</SelectItem>
                      <SelectItem value="4k">4K Ultra HD</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Duration: {searchFilters.duration[0]}s - {searchFilters.duration[1]}s</Label>
                <Slider
                  value={searchFilters.duration}
                  onValueChange={(value) => setSearchFilters(prev => ({ ...prev, duration: value as [number, number] }))}
                  max={600}
                  min={0}
                  step={30}
                  className="w-full"
                />
              </div>

              <div className="flex flex-wrap gap-4">
                <div className="flex items-center space-x-2">
                  <Switch
                    id="has-caption"
                    checked={searchFilters.hasCaption}
                    onCheckedChange={(checked) => setSearchFilters(prev => ({ ...prev, hasCaption: checked }))}
                  />
                  <Label htmlFor="has-caption">Has Captions</Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id="is-live"
                    checked={searchFilters.isLive}
                    onCheckedChange={(checked) => setSearchFilters(prev => ({ ...prev, isLive: checked }))}
                  />
                  <Label htmlFor="is-live">Live Streams Only</Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id="allow-duets"
                    checked={searchFilters.allowDuets}
                    onCheckedChange={(checked) => setSearchFilters(prev => ({ ...prev, allowDuets: checked }))}
                  />
                  <Label htmlFor="allow-duets">Duets Allowed</Label>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Search Results & Trending Content */}
      <Tabs defaultValue={searchResults.length > 0 ? "results" : "trending"} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="results" disabled={searchResults.length === 0}>
            Results {searchResults.length > 0 && `(${searchResults.length})`}
          </TabsTrigger>
          <TabsTrigger value="trending">Trending</TabsTrigger>
          <TabsTrigger value="history">History</TabsTrigger>
          <TabsTrigger value="saved">Saved</TabsTrigger>
        </TabsList>

        {/* Search Results */}
        <TabsContent value="results" className="space-y-4">
          {isSearching ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <Search className="h-8 w-8 animate-spin mx-auto mb-4" />
                <p>Searching across millions of videos...</p>
              </div>
            </div>
          ) : searchResults.length > 0 ? (
            <div className="space-y-4">
              {searchResults.map((result) => (
                <Card key={result.id} className="hover:shadow-md transition-shadow cursor-pointer">
                  <CardContent className="p-4">
                    <div className="flex items-start gap-4">
                      {result.thumbnail ? (
                        <img 
                          src={result.thumbnail} 
                          alt={result.title}
                          className="w-16 h-16 rounded-lg object-cover"
                        />
                      ) : result.avatar ? (
                        <Avatar className="w-16 h-16">
                          <AvatarImage src={result.avatar} />
                          <AvatarFallback>{result.title[0]}</AvatarFallback>
                        </Avatar>
                      ) : (
                        <div className="w-16 h-16 bg-muted rounded-lg flex items-center justify-center">
                          {getResultIcon(result.type)}
                        </div>
                      )}
                      
                      <div className="flex-1 space-y-2">
                        <div className="flex items-start justify-between">
                          <div>
                            <div className="flex items-center gap-2">
                              {getResultIcon(result.type)}
                              <h3 className="font-semibold">{result.title}</h3>
                              {result.verified && (
                                <Badge variant="secondary" className="bg-blue-500/20 text-blue-400">
                                  Verified
                                </Badge>
                              )}
                              {result.trending && (
                                <Badge variant="secondary" className="bg-orange-500/20 text-orange-400">
                                  <TrendingUp className="h-3 w-3 mr-1" />
                                  Trending
                                </Badge>
                              )}
                            </div>
                            {result.description && (
                              <p className="text-muted-foreground text-sm">{result.description}</p>
                            )}
                          </div>
                          <Button variant="ghost" size="sm">
                            <ChevronRight className="h-4 w-4" />
                          </Button>
                        </div>
                        
                        {result.stats && (
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            {result.stats.views && (
                              <span className="flex items-center gap-1">
                                <Eye className="h-3 w-3" />
                                {formatNumber(result.stats.views)}
                              </span>
                            )}
                            {result.stats.likes && (
                              <span className="flex items-center gap-1">
                                <Heart className="h-3 w-3" />
                                {formatNumber(result.stats.likes)}
                              </span>
                            )}
                            {result.stats.uses && (
                              <span className="flex items-center gap-1">
                                <Music className="h-3 w-3" />
                                {formatNumber(result.stats.uses)} uses
                              </span>
                            )}
                            {result.stats.participants && (
                              <span className="flex items-center gap-1">
                                <User className="h-3 w-3" />
                                {formatNumber(result.stats.participants)} participants
                              </span>
                            )}
                            {result.duration && (
                              <span className="flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                {Math.floor(result.duration / 60)}:{(result.duration % 60).toString().padStart(2, '0')}
                              </span>
                            )}
                          </div>
                        )}
                        
                        {result.tags && (
                          <div className="flex flex-wrap gap-1">
                            {result.tags.slice(0, 3).map((tag) => (
                              <Badge key={tag} variant="outline" className="text-xs">
                                #{tag}
                              </Badge>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Search className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-semibold mb-2">Ready to search</h3>
              <p className="text-muted-foreground">Enter a search term to find videos, creators, and more</p>
            </div>
          )}
        </TabsContent>

        {/* Trending Content */}
        <TabsContent value="trending" className="space-y-6">
          {trendingData && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Trending Hashtags */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Hash className="h-5 w-5 text-blue-500" />
                    Trending Hashtags
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {trendingData.hashtags.slice(0, 5).map((hashtag, index) => (
                    <div key={hashtag.tag} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Badge variant="outline" className="w-6 h-6 rounded-full text-xs">
                          {index + 1}
                        </Badge>
                        <div>
                          <span className="font-medium">#{hashtag.tag}</span>
                          <p className="text-sm text-muted-foreground">
                            {formatNumber(hashtag.uses)} uses
                          </p>
                        </div>
                      </div>
                      <Badge variant="secondary" className="bg-green-500/20 text-green-400">
                        +{hashtag.growth}%
                      </Badge>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Trending Sounds */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Music className="h-5 w-5 text-purple-500" />
                    Trending Sounds
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {trendingData.sounds.map((sound, index) => (
                    <div key={sound.id} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                          <Music className="h-4 w-4 text-white" />
                        </div>
                        <div className="flex-1">
                          <p className="font-medium">{sound.title}</p>
                          <p className="text-sm text-muted-foreground">{sound.artist}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium">{formatNumber(sound.uses)}</p>
                        {sound.trending && (
                          <Badge variant="secondary" className="bg-orange-500/20 text-orange-400 text-xs">
                            Trending
                          </Badge>
                        )}
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Active Challenges */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="h-5 w-5 text-red-500" />
                    Active Challenges
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {trendingData.challenges.slice(0, 3).map((challenge) => (
                    <div key={challenge.id} className="space-y-2">
                      <div className="flex items-start justify-between">
                        <div>
                          <h4 className="font-medium">{challenge.title}</h4>
                          <p className="text-sm text-muted-foreground">{challenge.description}</p>
                        </div>
                        {challenge.prize && (
                          <Badge variant="secondary" className="bg-yellow-500/20 text-yellow-400">
                            {challenge.prize}
                          </Badge>
                        )}
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">
                          {formatNumber(challenge.participants)} participants
                        </span>
                        <Button size="sm" variant="outline">
                          Join Challenge
                        </Button>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Rising Creators */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Star className="h-5 w-5 text-yellow-500" />
                    Rising Creators
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {trendingData.creators.slice(0, 4).map((creator) => (
                    <div key={creator.id} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Avatar className="w-10 h-10">
                          <AvatarImage src={creator.avatar} />
                          <AvatarFallback>{creator.username[0]}</AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="flex items-center gap-1">
                            <span className="font-medium">@{creator.username}</span>
                            {creator.verified && (
                              <div className="w-3 h-3 bg-blue-500 rounded-full flex items-center justify-center">
                                <div className="w-1.5 h-1.5 bg-white rounded-full" />
                              </div>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {formatNumber(creator.followers)} followers
                          </p>
                        </div>
                      </div>
                      <Button size="sm" variant="outline">
                        Follow
                      </Button>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          )}
        </TabsContent>

        {/* Search History */}
        <TabsContent value="history" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Recent Searches
              </CardTitle>
            </CardHeader>
            <CardContent>
              {searchHistory.length > 0 ? (
                <div className="space-y-2">
                  {searchHistory.map((query, index) => (
                    <div key={index} className="flex items-center justify-between p-2 hover:bg-muted rounded-lg">
                      <button
                        onClick={() => {
                          setSearchQuery(query);
                          performSearch(query);
                        }}
                        className="flex items-center gap-3 flex-1 text-left"
                      >
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <span>{query}</span>
                      </button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setSearchHistory(prev => prev.filter((_, i) => i !== index))}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  ))}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSearchHistory([])}
                    className="w-full mt-4"
                  >
                    Clear All History
                  </Button>
                </div>
              ) : (
                <div className="text-center py-8">
                  <Clock className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  <p className="text-muted-foreground">No search history yet</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Saved Searches */}
        <TabsContent value="saved" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bookmark className="h-5 w-5" />
                Saved Searches
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <Bookmark className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <p className="text-muted-foreground">No saved searches yet</p>
                <p className="text-sm text-muted-foreground mt-2">
                  Save frequently used searches for quick access
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default EnhancedSearchDiscovery;
