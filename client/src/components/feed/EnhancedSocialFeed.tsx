import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Heart, 
  MessageCircle, 
  Share2, 
  Bookmark, 
  MoreVertical,
  Camera,
  Video,
  MapPin,
  Smile,
  Image as ImageIcon,
  Calendar,
  Users,
  Globe,
  Lock,
  UserPlus,
  ThumbsUp,
  Laugh,
  Angry,
  Sad
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Reaction {
  type: 'like' | 'love' | 'laugh' | 'angry' | 'sad' | 'wow';
  count: number;
  userReacted: boolean;
}

interface Comment {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  content: string;
  timestamp: string;
  likes: number;
  replies: Comment[];
  userLiked: boolean;
}

interface Post {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  userVerified: boolean;
  content: string;
  images: string[];
  video?: string;
  location?: string;
  timestamp: string;
  reactions: Record<string, Reaction>;
  comments: Comment[];
  shares: number;
  privacy: 'public' | 'friends' | 'private';
  type: 'text' | 'photo' | 'video' | 'event' | 'poll' | 'link';
  taggedUsers?: string[];
  event?: {
    title: string;
    date: string;
    location: string;
    attendees: number;
    userAttending: boolean;
  };
  poll?: {
    question: string;
    options: Array<{
      id: string;
      text: string;
      votes: number;
      userVoted: boolean;
    }>;
    totalVotes: number;
  };
  link?: {
    url: string;
    title: string;
    description: string;
    image: string;
  };
}

interface Story {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  image: string;
  timestamp: string;
  viewed: boolean;
}

const EnhancedSocialFeed: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [stories, setStories] = useState<Story[]>([]);
  const [newPostContent, setNewPostContent] = useState('');
  const [newPostImages, setNewPostImages] = useState<string[]>([]);
  const [newPostLocation, setNewPostLocation] = useState('');
  const [newPostPrivacy, setNewPostPrivacy] = useState<'public' | 'friends' | 'private'>('public');
  const [selectedPostType, setSelectedPostType] = useState<'text' | 'photo' | 'event' | 'poll'>('text');
  const [showReactionPicker, setShowReactionPicker] = useState<string | null>(null);
  const [expandedComments, setExpandedComments] = useState<Set<string>>(new Set());
  const { toast } = useToast();

  const reactionEmojis = {
    like: '👍',
    love: '❤️',
    laugh: '😂',
    angry: '😠',
    sad: '😢',
    wow: '😮'
  };

  useEffect(() => {
    loadFeedData();
  }, []);

  const loadFeedData = () => {
    // Sample stories data
    const sampleStories: Story[] = [
      {
        id: 'story-1',
        userId: 'user-1',
        userName: 'Sarah Johnson',
        userAvatar: '/api/placeholder/40/40',
        image: '/api/placeholder/300/400',
        timestamp: '2h',
        viewed: false
      },
      {
        id: 'story-2',
        userId: 'user-2',
        userName: 'Mike Chen',
        userAvatar: '/api/placeholder/40/40',
        image: '/api/placeholder/300/400',
        timestamp: '4h',
        viewed: true
      },
      {
        id: 'story-3',
        userId: 'user-3',
        userName: 'Alex Kim',
        userAvatar: '/api/placeholder/40/40',
        image: '/api/placeholder/300/400',
        timestamp: '6h',
        viewed: false
      }
    ];

    // Sample posts data
    const samplePosts: Post[] = [
      {
        id: 'post-1',
        userId: 'user-1',
        userName: 'Sarah Johnson',
        userAvatar: '/api/placeholder/40/40',
        userVerified: true,
        content: 'Just finished an amazing workout session! Feeling energized and ready to take on the day. Who else is staying active today? 💪',
        images: ['/api/placeholder/500/400'],
        timestamp: '2 hours ago',
        reactions: {
          like: { type: 'like', count: 24, userReacted: true },
          love: { type: 'love', count: 8, userReacted: false }
        },
        comments: [
          {
            id: 'comment-1',
            userId: 'user-2',
            userName: 'Mike Chen',
            userAvatar: '/api/placeholder/40/40',
            content: 'Great job! Your dedication is inspiring 🔥',
            timestamp: '1 hour ago',
            likes: 5,
            replies: [],
            userLiked: false
          }
        ],
        shares: 3,
        privacy: 'public',
        type: 'photo',
        location: 'Fitness Center Downtown'
      },
      {
        id: 'post-2',
        userId: 'user-3',
        userName: 'Alex Kim',
        userAvatar: '/api/placeholder/40/40',
        userVerified: false,
        content: 'What should we have for our team lunch tomorrow?',
        images: [],
        timestamp: '4 hours ago',
        reactions: {
          like: { type: 'like', count: 12, userReacted: false }
        },
        comments: [],
        shares: 1,
        privacy: 'public',
        type: 'poll',
        poll: {
          question: 'What should we have for our team lunch tomorrow?',
          options: [
            { id: 'option-1', text: 'Pizza', votes: 8, userVoted: false },
            { id: 'option-2', text: 'Sushi', votes: 15, userVoted: true },
            { id: 'option-3', text: 'Burgers', votes: 6, userVoted: false },
            { id: 'option-4', text: 'Salads', votes: 3, userVoted: false }
          ],
          totalVotes: 32
        }
      },
      {
        id: 'post-3',
        userId: 'user-4',
        userName: 'Jessica Martinez',
        userAvatar: '/api/placeholder/40/40',
        userVerified: true,
        content: 'Join us for a community cleanup event this Saturday! Let\'s make our neighborhood beautiful together.',
        images: ['/api/placeholder/500/300'],
        timestamp: '1 day ago',
        reactions: {
          like: { type: 'like', count: 45, userReacted: false },
          love: { type: 'love', count: 12, userReacted: false }
        },
        comments: [
          {
            id: 'comment-2',
            userId: 'user-5',
            userName: 'David Wilson',
            userAvatar: '/api/placeholder/40/40',
            content: 'Count me in! What time should we meet?',
            timestamp: '8 hours ago',
            likes: 3,
            replies: [
              {
                id: 'reply-1',
                userId: 'user-4',
                userName: 'Jessica Martinez',
                userAvatar: '/api/placeholder/40/40',
                content: 'We start at 9 AM. See you there!',
                timestamp: '7 hours ago',
                likes: 2,
                replies: [],
                userLiked: false
              }
            ],
            userLiked: true
          }
        ],
        shares: 8,
        privacy: 'public',
        type: 'event',
        event: {
          title: 'Community Cleanup Day',
          date: 'Saturday, Dec 30, 2024 at 9:00 AM',
          location: 'Central Park',
          attendees: 34,
          userAttending: false
        }
      }
    ];

    setStories(sampleStories);
    setPosts(samplePosts);
  };

  const handleCreatePost = () => {
    if (!newPostContent.trim()) {
      toast({
        title: "Empty Post",
        description: "Please write something to share",
        variant: "destructive"
      });
      return;
    }

    const newPost: Post = {
      id: `post-${Date.now()}`,
      userId: 'current-user',
      userName: 'You',
      userAvatar: '/api/placeholder/40/40',
      userVerified: false,
      content: newPostContent,
      images: newPostImages,
      location: newPostLocation,
      timestamp: 'Just now',
      reactions: {},
      comments: [],
      shares: 0,
      privacy: newPostPrivacy,
      type: selectedPostType
    };

    setPosts(prev => [newPost, ...prev]);
    setNewPostContent('');
    setNewPostImages([]);
    setNewPostLocation('');
    
    toast({
      title: "Post Created",
      description: "Your post has been shared successfully"
    });
  };

  const handleReaction = (postId: string, reactionType: keyof typeof reactionEmojis) => {
    setPosts(prev => prev.map(post => {
      if (post.id === postId) {
        const currentReaction = post.reactions[reactionType];
        const updatedReactions = { ...post.reactions };
        
        if (currentReaction?.userReacted) {
          // Remove reaction
          updatedReactions[reactionType] = {
            ...currentReaction,
            count: Math.max(0, currentReaction.count - 1),
            userReacted: false
          };
        } else {
          // Add reaction
          updatedReactions[reactionType] = {
            type: reactionType,
            count: (currentReaction?.count || 0) + 1,
            userReacted: true
          };
        }
        
        return { ...post, reactions: updatedReactions };
      }
      return post;
    }));
    
    setShowReactionPicker(null);
  };

  const handleComment = (postId: string, content: string) => {
    if (!content.trim()) return;

    const newComment: Comment = {
      id: `comment-${Date.now()}`,
      userId: 'current-user',
      userName: 'You',
      userAvatar: '/api/placeholder/40/40',
      content,
      timestamp: 'Just now',
      likes: 0,
      replies: [],
      userLiked: false
    };

    setPosts(prev => prev.map(post => {
      if (post.id === postId) {
        return { ...post, comments: [...post.comments, newComment] };
      }
      return post;
    }));
  };

  const handleVotePoll = (postId: string, optionId: string) => {
    setPosts(prev => prev.map(post => {
      if (post.id === postId && post.poll) {
        const updatedOptions = post.poll.options.map(option => {
          if (option.id === optionId) {
            return { ...option, votes: option.votes + 1, userVoted: true };
          }
          return { ...option, userVoted: false };
        });
        
        return {
          ...post,
          poll: {
            ...post.poll,
            options: updatedOptions,
            totalVotes: post.poll.totalVotes + 1
          }
        };
      }
      return post;
    }));
  };

  const toggleComments = (postId: string) => {
    setExpandedComments(prev => {
      const newSet = new Set(prev);
      if (newSet.has(postId)) {
        newSet.delete(postId);
      } else {
        newSet.add(postId);
      }
      return newSet;
    });
  };

  const formatReactionCount = (reactions: Record<string, Reaction>) => {
    const totalCount = Object.values(reactions).reduce((sum, reaction) => sum + reaction.count, 0);
    if (totalCount === 0) return '';
    
    const topReactions = Object.entries(reactions)
      .filter(([_, reaction]) => reaction.count > 0)
      .sort(([_, a], [__, b]) => b.count - a.count)
      .slice(0, 3);
    
    return (
      <div className="flex items-center gap-1 text-sm text-gray-500">
        <div className="flex">
          {topReactions.map(([type, _]) => (
            <span key={type} className="text-lg -ml-1 first:ml-0">
              {reactionEmojis[type as keyof typeof reactionEmojis]}
            </span>
          ))}
        </div>
        <span>{totalCount}</span>
      </div>
    );
  };

  return (
    <div className="max-w-2xl mx-auto p-4 space-y-6">
      {/* Stories Section */}
      <Card>
        <CardContent className="p-4">
          <div className="flex gap-4 overflow-x-auto pb-2">
            {/* Add Story */}
            <div className="flex-shrink-0 text-center cursor-pointer">
              <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mb-2 border-2 border-dashed border-gray-300">
                <Camera className="w-6 h-6 text-gray-500" />
              </div>
              <span className="text-xs text-gray-600">Your Story</span>
            </div>
            
            {/* Stories */}
            {stories.map(story => (
              <div key={story.id} className="flex-shrink-0 text-center cursor-pointer">
                <div className={`w-16 h-16 rounded-full p-0.5 ${story.viewed ? 'bg-gray-300' : 'bg-gradient-to-r from-purple-500 to-pink-500'}`}>
                  <img
                    src={story.userAvatar}
                    alt={story.userName}
                    className="w-full h-full rounded-full border-2 border-white object-cover"
                  />
                </div>
                <span className="text-xs text-gray-600 block mt-1 truncate w-16">
                  {story.userName.split(' ')[0]}
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Create Post */}
      <Card>
        <CardContent className="p-4">
          <div className="flex gap-3 mb-4">
            <img
              src="/api/placeholder/40/40"
              alt="Your avatar"
              className="w-10 h-10 rounded-full"
            />
            <div className="flex-1">
              <Textarea
                placeholder="What's on your mind?"
                value={newPostContent}
                onChange={(e) => setNewPostContent(e.target.value)}
                className="min-h-[80px] resize-none border-none shadow-none text-lg placeholder:text-gray-500"
              />
            </div>
          </div>
          
          {newPostLocation && (
            <div className="flex items-center gap-2 mb-3 text-sm text-gray-600">
              <MapPin className="w-4 h-4" />
              <span>{newPostLocation}</span>
            </div>
          )}
          
          <div className="flex items-center justify-between pt-3 border-t">
            <div className="flex gap-4">
              <Button variant="ghost" size="sm" className="flex items-center gap-2 text-gray-600">
                <ImageIcon className="w-4 h-4" />
                Photo
              </Button>
              <Button variant="ghost" size="sm" className="flex items-center gap-2 text-gray-600">
                <Video className="w-4 h-4" />
                Video
              </Button>
              <Button variant="ghost" size="sm" className="flex items-center gap-2 text-gray-600">
                <Calendar className="w-4 h-4" />
                Event
              </Button>
              <Button 
                variant="ghost" 
                size="sm" 
                className="flex items-center gap-2 text-gray-600"
                onClick={() => setNewPostLocation(newPostLocation || 'Current Location')}
              >
                <MapPin className="w-4 h-4" />
                Location
              </Button>
            </div>
            
            <div className="flex items-center gap-2">
              <select
                value={newPostPrivacy}
                onChange={(e) => setNewPostPrivacy(e.target.value as any)}
                className="text-sm border rounded px-2 py-1"
              >
                <option value="public">🌍 Public</option>
                <option value="friends">👥 Friends</option>
                <option value="private">🔒 Only me</option>
              </select>
              <Button onClick={handleCreatePost} disabled={!newPostContent.trim()}>
                Post
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Posts */}
      {posts.map(post => (
        <Card key={post.id}>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <img
                  src={post.userAvatar}
                  alt={post.userName}
                  className="w-10 h-10 rounded-full"
                />
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold">{post.userName}</span>
                    {post.userVerified && (
                      <Badge variant="secondary" className="text-xs px-1 py-0">
                        ✓
                      </Badge>
                    )}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <span>{post.timestamp}</span>
                    {post.privacy === 'public' && <Globe className="w-3 h-3" />}
                    {post.privacy === 'friends' && <Users className="w-3 h-3" />}
                    {post.privacy === 'private' && <Lock className="w-3 h-3" />}
                    {post.location && (
                      <>
                        <span>•</span>
                        <MapPin className="w-3 h-3" />
                        <span>{post.location}</span>
                      </>
                    )}
                  </div>
                </div>
              </div>
              <Button variant="ghost" size="icon">
                <MoreVertical className="w-4 h-4" />
              </Button>
            </div>
          </CardHeader>
          
          <CardContent className="pt-0">
            {/* Content */}
            <p className="mb-4 whitespace-pre-wrap">{post.content}</p>
            
            {/* Event */}
            {post.event && (
              <div className="mb-4 p-4 border rounded-lg bg-blue-50">
                <div className="flex items-center gap-3 mb-3">
                  <Calendar className="w-5 h-5 text-blue-600" />
                  <div>
                    <h4 className="font-semibold">{post.event.title}</h4>
                    <p className="text-sm text-gray-600">{post.event.date}</p>
                    <p className="text-sm text-gray-600">{post.event.location}</p>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">
                    {post.event.attendees} people interested
                  </span>
                  <Button 
                    variant={post.event.userAttending ? "default" : "outline"}
                    size="sm"
                  >
                    {post.event.userAttending ? 'Going' : 'Interested'}
                  </Button>
                </div>
              </div>
            )}
            
            {/* Poll */}
            {post.poll && (
              <div className="mb-4 p-4 border rounded-lg">
                <h4 className="font-semibold mb-3">{post.poll.question}</h4>
                <div className="space-y-2">
                  {post.poll.options.map(option => {
                    const percentage = post.poll!.totalVotes > 0 
                      ? (option.votes / post.poll!.totalVotes) * 100 
                      : 0;
                    
                    return (
                      <div
                        key={option.id}
                        className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                          option.userVoted 
                            ? 'bg-blue-100 border-blue-300' 
                            : 'hover:bg-gray-50'
                        }`}
                        onClick={() => !option.userVoted && handleVotePoll(post.id, option.id)}
                      >
                        <div className="flex justify-between items-center">
                          <span>{option.text}</span>
                          <span className="text-sm text-gray-600">
                            {option.votes} ({Math.round(percentage)}%)
                          </span>
                        </div>
                        <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
                <p className="text-sm text-gray-500 mt-3">
                  {post.poll.totalVotes} total votes
                </p>
              </div>
            )}
            
            {/* Images */}
            {post.images.length > 0 && (
              <div className="mb-4 -mx-4">
                <div className="grid grid-cols-1 gap-1">
                  {post.images.map((image, index) => (
                    <img
                      key={index}
                      src={image}
                      alt={`Post image ${index + 1}`}
                      className="w-full object-cover rounded"
                    />
                  ))}
                </div>
              </div>
            )}
            
            {/* Reactions & Stats */}
            {(Object.keys(post.reactions).length > 0 || post.comments.length > 0 || post.shares > 0) && (
              <div className="flex items-center justify-between py-2 border-b">
                <div className="flex items-center gap-4">
                  {formatReactionCount(post.reactions)}
                </div>
                <div className="flex items-center gap-4 text-sm text-gray-500">
                  {post.comments.length > 0 && (
                    <span>{post.comments.length} comments</span>
                  )}
                  {post.shares > 0 && (
                    <span>{post.shares} shares</span>
                  )}
                </div>
              </div>
            )}
            
            {/* Action Buttons */}
            <div className="flex items-center justify-between pt-2">
              <div className="flex items-center gap-1">
                <div className="relative">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="flex items-center gap-2"
                    onClick={() => setShowReactionPicker(showReactionPicker === post.id ? null : post.id)}
                  >
                    <Heart className="w-4 h-4" />
                    Like
                  </Button>
                  
                  {showReactionPicker === post.id && (
                    <div className="absolute bottom-full left-0 mb-2 flex gap-1 p-2 bg-white border rounded-lg shadow-lg z-10">
                      {Object.entries(reactionEmojis).map(([type, emoji]) => (
                        <button
                          key={type}
                          className="text-2xl hover:scale-125 transition-transform"
                          onClick={() => handleReaction(post.id, type as keyof typeof reactionEmojis)}
                        >
                          {emoji}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
                
                <Button
                  variant="ghost"
                  size="sm"
                  className="flex items-center gap-2"
                  onClick={() => toggleComments(post.id)}
                >
                  <MessageCircle className="w-4 h-4" />
                  Comment
                </Button>
                
                <Button variant="ghost" size="sm" className="flex items-center gap-2">
                  <Share2 className="w-4 h-4" />
                  Share
                </Button>
              </div>
              
              <Button variant="ghost" size="icon">
                <Bookmark className="w-4 h-4" />
              </Button>
            </div>
            
            {/* Comments */}
            {expandedComments.has(post.id) && (
              <div className="mt-4 space-y-3">
                {post.comments.map(comment => (
                  <div key={comment.id} className="flex gap-3">
                    <img
                      src={comment.userAvatar}
                      alt={comment.userName}
                      className="w-8 h-8 rounded-full"
                    />
                    <div className="flex-1">
                      <div className="bg-gray-100 rounded-lg p-3">
                        <div className="font-semibold text-sm">{comment.userName}</div>
                        <p className="text-sm">{comment.content}</p>
                      </div>
                      <div className="flex items-center gap-4 mt-1 text-xs text-gray-500">
                        <button className="hover:underline">Like</button>
                        <button className="hover:underline">Reply</button>
                        <span>{comment.timestamp}</span>
                        {comment.likes > 0 && (
                          <span className="flex items-center gap-1">
                            <ThumbsUp className="w-3 h-3" />
                            {comment.likes}
                          </span>
                        )}
                      </div>
                      
                      {/* Replies */}
                      {comment.replies.map(reply => (
                        <div key={reply.id} className="flex gap-3 mt-3 ml-4">
                          <img
                            src={reply.userAvatar}
                            alt={reply.userName}
                            className="w-6 h-6 rounded-full"
                          />
                          <div className="flex-1">
                            <div className="bg-gray-100 rounded-lg p-2">
                              <div className="font-semibold text-xs">{reply.userName}</div>
                              <p className="text-xs">{reply.content}</p>
                            </div>
                            <div className="flex items-center gap-4 mt-1 text-xs text-gray-500">
                              <button className="hover:underline">Like</button>
                              <span>{reply.timestamp}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
                
                {/* Add Comment */}
                <div className="flex gap-3">
                  <img
                    src="/api/placeholder/40/40"
                    alt="Your avatar"
                    className="w-8 h-8 rounded-full"
                  />
                  <div className="flex-1">
                    <Input
                      placeholder="Write a comment..."
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          handleComment(post.id, e.currentTarget.value);
                          e.currentTarget.value = '';
                        }
                      }}
                      className="bg-gray-100 border-none"
                    />
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default EnhancedSocialFeed;