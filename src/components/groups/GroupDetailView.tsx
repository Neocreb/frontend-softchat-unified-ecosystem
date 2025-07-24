import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { formatNumber } from "@/utils/formatters";
import { useToast } from "@/hooks/use-toast";
import {
  ArrowLeft,
  Users,
  Lock,
  Globe,
  Crown,
  Shield,
  UserPlus,
  UserMinus,
  Settings,
  Plus,
  Heart,
  MessageSquare,
  Share2,
  MoreHorizontal,
  Image as ImageIcon,
  Video,
  Calendar,
  MapPin,
  ThumbsUp,
  Send,
  Bookmark,
  Flag,
  Edit,
  Trash2,
  Camera,
  Paperclip,
  Smile,
  Search,
  Filter,
  SortDesc,
  Pin,
  Star,
  Clock,
} from "lucide-react";

interface Group {
  id: string;
  name: string;
  members: number;
  category: string;
  cover: string;
  description?: string;
  privacy: "public" | "private";
  isJoined?: boolean;
  isOwner?: boolean;
  isAdmin?: boolean;
  location?: string;
  createdAt?: string;
  admins?: Member[];
  rules?: string[];
}

interface Member {
  id: string;
  name: string;
  avatar: string;
  role: "owner" | "admin" | "member";
  joinedAt: string;
}

interface Post {
  id: string;
  author: Member;
  content: string;
  images?: string[];
  video?: string;
  timestamp: string;
  likes: number;
  comments: Comment[];
  isLiked: boolean;
  isPinned?: boolean;
  isEdited?: boolean;
}

interface Comment {
  id: string;
  author: Member;
  content: string;
  timestamp: string;
  likes: number;
  isLiked: boolean;
  replies?: Comment[];
}

interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  location?: string;
  attendees: number;
  isAttending: boolean;
  cover?: string;
}

const GroupDetailView = () => {
  const { groupId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [activeTab, setActiveTab] = useState("posts");
  const [showCreatePost, setShowCreatePost] = useState(false);
  const [showCreateEvent, setShowCreateEvent] = useState(false);
  const [newPostContent, setNewPostContent] = useState("");
  const [newPostImages, setNewPostImages] = useState<string[]>([]);
  const [newComment, setNewComment] = useState("");
  const [expandedPost, setExpandedPost] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("recent");

  // Import the groups data
  import { groups } from "@/data/mockExploreData";

  // Find the specific group based on the route parameter
  const group = groups.find(g => g.id === groupId);

  // If group not found, redirect or show error
  if (!group) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">Group Not Found</h2>
          <p className="text-muted-foreground mb-4">The group you're looking for doesn't exist.</p>
          <Button onClick={() => navigate("/app/groups")}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Groups
          </Button>
        </div>
      </div>
    );
  }

  // Extend the group data with additional properties for the detail view
  const extendedGroup: Group = {
    ...group,
    rules: [
      "Be respectful to all members",
      "No spam or self-promotion without permission",
      "Share knowledge and help others learn",
      `Keep discussions relevant to ${group.category}`,
      "No harassment or offensive content"
    ]
  };

  // Mock posts data
  const [posts, setPosts] = useState<Post[]>([
    {
      id: "1",
      author: {
        id: "1",
        name: "Alex Chen",
        avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100",
        role: "admin",
        joinedAt: "2023-01-15"
      },
      content: "🚀 Just deployed my first DeFi protocol on Ethereum! It's been an incredible journey learning about smart contracts, security audits, and gas optimization. \n\nKey learnings:\n• Always test extensively on testnets\n• Security is paramount - multiple audits needed\n• Gas optimization can save users significant costs\n\nWould love to hear about your DeFi experiences! What challenges did you face?",
      images: ["https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=400"],
      timestamp: "2024-01-15T10:30:00Z",
      likes: 124,
      isLiked: false,
      isPinned: true,
      comments: [
        {
          id: "1",
          author: {
            id: "2",
            name: "Sarah Kim",
            avatar: "https://images.unsplash.com/photo-1494790108755-2616b2bab1d3?w=100",
            role: "member",
            joinedAt: "2023-02-01"
          },
          content: "Congratulations! Security audits are definitely crucial. Which auditing firm did you use?",
          timestamp: "2024-01-15T11:00:00Z",
          likes: 12,
          isLiked: false
        },
        {
          id: "2",
          author: {
            id: "3",
            name: "Mike Johnson",
            avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100",
            role: "member", 
            joinedAt: "2023-03-10"
          },
          content: "Gas optimization is so important! Have you tried using CREATE2 for contract deployment?",
          timestamp: "2024-01-15T11:15:00Z",
          likes: 8,
          isLiked: true
        }
      ]
    },
    {
      id: "2",
      author: {
        id: "4",
        name: "Emma Wilson",
        avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100",
        role: "member",
        joinedAt: "2023-04-20"
      },
      content: "Question for the community: What's your favorite Web3 development framework and why? \n\nI've been using Hardhat for Ethereum development, but curious about alternatives for other chains like Solana or Polygon.",
      timestamp: "2024-01-14T15:45:00Z",
      likes: 67,
      isLiked: true,
      comments: [
        {
          id: "3",
          author: {
            id: "5",
            name: "David Lee",
            avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100",
            role: "member",
            joinedAt: "2023-05-15"
          },
          content: "For Solana, I highly recommend Anchor! It makes smart contract development much more intuitive.",
          timestamp: "2024-01-14T16:00:00Z",
          likes: 15,
          isLiked: false
        }
      ]
    }
  ]);

  // Mock events data
  const [events, setEvents] = useState<Event[]>([
    {
      id: "1",
      title: "Web3 Security Workshop",
      description: "Learn about smart contract security best practices and common vulnerabilities",
      date: "2024-01-25",
      time: "14:00",
      location: "Virtual Event",
      attendees: 89,
      isAttending: false,
      cover: "https://images.unsplash.com/photo-1556075798-4825dfaaf498?w=400"
    },
    {
      id: "2", 
      title: "DeFi Protocol Demo Day",
      description: "Community members showcase their latest DeFi projects and innovations",
      date: "2024-02-10",
      time: "18:00",
      location: "San Francisco, CA",
      attendees: 156,
      isAttending: true,
      cover: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400"
    }
  ]);

  // Mock members data
  const members: Member[] = [
    {
      id: "1",
      name: "Alex Chen",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100",
      role: "owner",
      joinedAt: "2023-01-15"
    },
    {
      id: "2",
      name: "Sarah Kim", 
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b2bab1d3?w=100",
      role: "admin",
      joinedAt: "2023-02-01"
    },
    {
      id: "3",
      name: "Mike Johnson",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100",
      role: "member",
      joinedAt: "2023-03-10"
    }
  ];

  const handleCreatePost = () => {
    if (!newPostContent.trim()) {
      toast({
        title: "Error",
        description: "Please write something to post",
        variant: "destructive"
      });
      return;
    }

    const newPost: Post = {
      id: Date.now().toString(),
      author: {
        id: "current",
        name: "You",
        avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100",
        role: "member",
        joinedAt: "2023-06-01"
      },
      content: newPostContent,
      images: newPostImages,
      timestamp: new Date().toISOString(),
      likes: 0,
      isLiked: false,
      comments: []
    };

    setPosts(prev => [newPost, ...prev]);
    setNewPostContent("");
    setNewPostImages([]);
    setShowCreatePost(false);

    toast({
      title: "Post Created",
      description: "Your post has been shared with the group!"
    });
  };

  const handleLikePost = (postId: string) => {
    setPosts(prev => prev.map(post => 
      post.id === postId 
        ? { 
            ...post, 
            likes: post.isLiked ? post.likes - 1 : post.likes + 1,
            isLiked: !post.isLiked 
          }
        : post
    ));
  };

  const handleAddComment = (postId: string) => {
    if (!newComment.trim()) return;

    const comment: Comment = {
      id: Date.now().toString(),
      author: {
        id: "current",
        name: "You",
        avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100",
        role: "member",
        joinedAt: "2023-06-01"
      },
      content: newComment,
      timestamp: new Date().toISOString(),
      likes: 0,
      isLiked: false
    };

    setPosts(prev => prev.map(post =>
      post.id === postId
        ? { ...post, comments: [...post.comments, comment] }
        : post
    ));

    setNewComment("");
  };

  const handleJoinEvent = (eventId: string) => {
    setEvents(prev => prev.map(event =>
      event.id === eventId
        ? { 
            ...event, 
            isAttending: !event.isAttending,
            attendees: event.isAttending ? event.attendees - 1 : event.attendees + 1
          }
        : event
    ));
  };

  const renderPost = (post: Post) => (
    <Card key={post.id} className="w-full">
      <CardContent className="p-4">
        {/* Post Header */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10">
              <AvatarImage src={post.author.avatar} alt={post.author.name} />
              <AvatarFallback>{post.author.name.substring(0, 2)}</AvatarFallback>
            </Avatar>
            <div>
              <div className="flex items-center gap-2">
                <h4 className="font-semibold text-sm">{post.author.name}</h4>
                {post.author.role === "owner" && (
                  <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
                    <Crown className="w-3 h-3 mr-1" />
                    Owner
                  </Badge>
                )}
                {post.author.role === "admin" && (
                  <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                    <Shield className="w-3 h-3 mr-1" />
                    Admin
                  </Badge>
                )}
                {post.isPinned && (
                  <Badge variant="secondary" className="bg-green-100 text-green-800">
                    <Pin className="w-3 h-3 mr-1" />
                    Pinned
                  </Badge>
                )}
              </div>
              <p className="text-xs text-muted-foreground">
                {new Date(post.timestamp).toLocaleDateString()} at {new Date(post.timestamp).toLocaleTimeString()}
                {post.isEdited && " (edited)"}
              </p>
            </div>
          </div>
          <Button variant="ghost" size="icon">
            <MoreHorizontal className="w-4 h-4" />
          </Button>
        </div>

        {/* Post Content */}
        <div className="mb-3">
          <p className="text-sm whitespace-pre-wrap mb-3">{post.content}</p>
          
          {/* Post Images */}
          {post.images && post.images.length > 0 && (
            <div className="grid gap-2 mb-3">
              {post.images.map((image, index) => (
                <img
                  key={index}
                  src={image}
                  alt="Post content"
                  className="rounded-lg max-h-96 w-full object-cover"
                />
              ))}
            </div>
          )}
        </div>

        {/* Post Actions */}
        <div className="flex items-center justify-between border-t pt-3">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleLikePost(post.id)}
              className={`gap-2 ${post.isLiked ? 'text-blue-600' : ''}`}
            >
              <ThumbsUp className={`w-4 h-4 ${post.isLiked ? 'fill-current' : ''}`} />
              {post.likes}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setExpandedPost(expandedPost === post.id ? null : post.id)}
              className="gap-2"
            >
              <MessageSquare className="w-4 h-4" />
              {post.comments.length}
            </Button>
            <Button variant="ghost" size="sm" className="gap-2">
              <Share2 className="w-4 h-4" />
              Share
            </Button>
          </div>
          <Button variant="ghost" size="sm">
            <Bookmark className="w-4 h-4" />
          </Button>
        </div>

        {/* Comments Section */}
        {expandedPost === post.id && (
          <div className="mt-4 space-y-3 border-t pt-3">
            {/* Add Comment */}
            <div className="flex gap-3">
              <Avatar className="h-8 w-8">
                <AvatarImage src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100" alt="You" />
                <AvatarFallback>YO</AvatarFallback>
              </Avatar>
              <div className="flex-1 flex gap-2">
                <Input
                  placeholder="Write a comment..."
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleAddComment(post.id)}
                  className="flex-1"
                />
                <Button size="icon" onClick={() => handleAddComment(post.id)}>
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Comments List */}
            {post.comments.map((comment) => (
              <div key={comment.id} className="flex gap-3">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={comment.author.avatar} alt={comment.author.name} />
                  <AvatarFallback>{comment.author.name.substring(0, 2)}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="bg-gray-50 rounded-lg p-3">
                    <div className="flex items-center gap-2 mb-1">
                      <h5 className="font-semibold text-sm">{comment.author.name}</h5>
                      {comment.author.role === "admin" && (
                        <Badge variant="secondary" className="bg-blue-100 text-blue-800 text-xs">
                          <Shield className="w-2 h-2 mr-1" />
                          Admin
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm">{comment.content}</p>
                  </div>
                  <div className="flex items-center gap-4 mt-1 text-xs text-muted-foreground">
                    <span>{new Date(comment.timestamp).toLocaleDateString()}</span>
                    <Button variant="ghost" size="sm" className="h-auto p-0 text-xs">
                      Like ({comment.likes})
                    </Button>
                    <Button variant="ghost" size="sm" className="h-auto p-0 text-xs">
                      Reply
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );

  const renderEvent = (event: Event) => (
    <Card key={event.id} className="w-full">
      <div className="relative h-32 overflow-hidden">
        {event.cover && (
          <img
            src={event.cover}
            alt={event.title}
            className="w-full h-full object-cover"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
        <div className="absolute bottom-3 left-3 text-white">
          <h3 className="font-bold text-lg">{event.title}</h3>
        </div>
      </div>
      <CardContent className="p-4">
        <div className="space-y-3">
          <p className="text-sm text-muted-foreground">{event.description}</p>
          
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              {new Date(event.date).toLocaleDateString()}
            </div>
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              {event.time}
            </div>
            {event.location && (
              <div className="flex items-center gap-1">
                <MapPin className="w-4 h-4" />
                {event.location}
              </div>
            )}
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              <span className="text-sm">{event.attendees} attending</span>
            </div>
            <Button
              size="sm"
              variant={event.isAttending ? "outline" : "default"}
              onClick={() => handleJoinEvent(event.id)}
            >
              {event.isAttending ? "Can't Go" : "Attend"}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Group Header */}
      <div className="relative h-64 overflow-hidden">
        <img
          src={extendedGroup.cover}
          alt={extendedGroup.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
        
        <div className="absolute top-4 left-4">
          <Button
            variant="secondary"
            onClick={() => navigate(-1)}
            className="gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </Button>
        </div>

        <div className="absolute bottom-6 left-6 right-6 text-white">
          <div className="flex items-end justify-between">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-3xl font-bold">{extendedGroup.name}</h1>
                {extendedGroup.privacy === "private" ? (
                  <Lock className="w-6 h-6" />
                ) : (
                  <Globe className="w-6 h-6" />
                )}
              </div>
              <div className="flex items-center gap-4 text-sm opacity-90">
                <div className="flex items-center gap-1">
                  <Users className="w-4 h-4" />
                  {formatNumber(extendedGroup.members)} members
                </div>
                <span>•</span>
                <span>{extendedGroup.category}</span>
                {extendedGroup.location && (
                  <>
                    <span>•</span>
                    <div className="flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      {extendedGroup.location}
                    </div>
                  </>
                )}
              </div>
            </div>

            <div className="flex gap-2">
              {!extendedGroup.isJoined ? (
                <Button className="gap-2">
                  <UserPlus className="w-4 h-4" />
                  Join Group
                </Button>
              ) : (
                <>
                  {(extendedGroup.isOwner || extendedGroup.isAdmin) && (
                    <Button variant="secondary" className="gap-2">
                      <Settings className="w-4 h-4" />
                      Manage
                    </Button>
                  )}
                  <Button variant="outline" className="gap-2 bg-white/20 border-white/30 text-white hover:bg-white/30">
                    <UserMinus className="w-4 h-4" />
                    Leave
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-4">
            {/* About Section */}
            <Card>
              <CardHeader>
                <h3 className="font-semibold">About</h3>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-sm text-muted-foreground">{extendedGroup.description}</p>

                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-muted-foreground" />
                    <span>{formatNumber(extendedGroup.members)} members</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-muted-foreground" />
                    <span>Created {new Date(extendedGroup.createdAt!).toLocaleDateString()}</span>
                  </div>
                  {extendedGroup.privacy === "public" ? (
                    <div className="flex items-center gap-2">
                      <Globe className="w-4 h-4 text-green-600" />
                      <span>Public group</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <Lock className="w-4 h-4 text-gray-600" />
                      <span>Private group</span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Group Rules */}
            <Card>
              <CardHeader>
                <h3 className="font-semibold">Group Rules</h3>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {extendedGroup.rules?.map((rule, index) => (
                    <div key={index} className="flex gap-2 text-sm">
                      <span className="font-semibold text-muted-foreground">{index + 1}.</span>
                      <span>{rule}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Recent Members */}
            <Card>
              <CardHeader>
                <h3 className="font-semibold">Recent Members</h3>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {members.slice(0, 5).map((member) => (
                    <div key={member.id} className="flex items-center gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={member.avatar} alt={member.name} />
                        <AvatarFallback>{member.name.substring(0, 2)}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-medium">{member.name}</p>
                          {member.role === "owner" && (
                            <Crown className="w-3 h-3 text-yellow-600" />
                          )}
                          {member.role === "admin" && (
                            <Shield className="w-3 h-3 text-blue-600" />
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground">
                          Joined {new Date(member.joinedAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  ))}
                  <Button variant="outline" size="sm" className="w-full">
                    View All Members
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3 space-y-6">
            {/* Create Post Section */}
            {group.isJoined && (
              <Card>
                <CardContent className="p-4">
                  <div className="flex gap-3">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100" alt="You" />
                      <AvatarFallback>YO</AvatarFallback>
                    </Avatar>
                    <Dialog open={showCreatePost} onOpenChange={setShowCreatePost}>
                      <DialogTrigger asChild>
                        <Button variant="outline" className="flex-1 justify-start text-muted-foreground">
                          What's on your mind?
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-2xl">
                        <DialogHeader>
                          <DialogTitle>Create Post</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4">
                          <Textarea
                            placeholder="What would you like to share with the group?"
                            value={newPostContent}
                            onChange={(e) => setNewPostContent(e.target.value)}
                            rows={4}
                          />
                          <div className="flex justify-between items-center">
                            <div className="flex gap-2">
                              <Button variant="outline" size="sm">
                                <ImageIcon className="w-4 h-4 mr-2" />
                                Photo
                              </Button>
                              <Button variant="outline" size="sm">
                                <Video className="w-4 h-4 mr-2" />
                                Video
                              </Button>
                              <Button variant="outline" size="sm">
                                <Calendar className="w-4 h-4 mr-2" />
                                Event
                              </Button>
                            </div>
                            <Button onClick={handleCreatePost}>
                              Post
                            </Button>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Tabs */}
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="posts">Posts</TabsTrigger>
                <TabsTrigger value="events">Events</TabsTrigger>
                <TabsTrigger value="members">Members</TabsTrigger>
                <TabsTrigger value="files">Files</TabsTrigger>
              </TabsList>

              <TabsContent value="posts" className="space-y-4">
                {/* Posts Filter */}
                <div className="flex justify-between items-center">
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      <Filter className="w-4 h-4 mr-2" />
                      Filter
                    </Button>
                    <Button variant="outline" size="sm">
                      <SortDesc className="w-4 h-4 mr-2" />
                      Recent
                    </Button>
                  </div>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      placeholder="Search posts..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10 w-64"
                    />
                  </div>
                </div>

                {/* Posts Feed */}
                <div className="space-y-4">
                  {posts.map(renderPost)}
                </div>
              </TabsContent>

              <TabsContent value="events" className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold">Upcoming Events</h3>
                  {(group.isOwner || group.isAdmin) && (
                    <Button>
                      <Plus className="w-4 h-4 mr-2" />
                      Create Event
                    </Button>
                  )}
                </div>
                <div className="grid gap-4">
                  {events.map(renderEvent)}
                </div>
              </TabsContent>

              <TabsContent value="members" className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold">Members ({formatNumber(group.members)})</h3>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      placeholder="Search members..."
                      className="pl-10 w-64"
                    />
                  </div>
                </div>
                <div className="grid gap-3">
                  {members.map((member) => (
                    <Card key={member.id}>
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <Avatar className="h-12 w-12">
                              <AvatarImage src={member.avatar} alt={member.name} />
                              <AvatarFallback>{member.name.substring(0, 2)}</AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="flex items-center gap-2">
                                <h4 className="font-semibold">{member.name}</h4>
                                {member.role === "owner" && (
                                  <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
                                    <Crown className="w-3 h-3 mr-1" />
                                    Owner
                                  </Badge>
                                )}
                                {member.role === "admin" && (
                                  <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                                    <Shield className="w-3 h-3 mr-1" />
                                    Admin
                                  </Badge>
                                )}
                              </div>
                              <p className="text-sm text-muted-foreground">
                                Joined {new Date(member.joinedAt).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                          <Button variant="outline" size="sm">
                            <MessageSquare className="w-4 h-4 mr-2" />
                            Message
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="files" className="space-y-4">
                <div className="text-center py-12">
                  <div className="flex flex-col items-center gap-4">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
                      <Paperclip className="w-8 h-8 text-gray-400" />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-2">No files shared yet</h3>
                      <p className="text-muted-foreground">Files and documents shared in this group will appear here</p>
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GroupDetailView;
