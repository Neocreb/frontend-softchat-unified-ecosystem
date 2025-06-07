import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ProfileHeader } from '@/components/profile/ProfileHeader';
import { ProfileTabs } from '@/components/profile/ProfileTabs';
import { EditProfileModal } from '@/components/profile/EditProfileModal';
import { Progress } from '@/components/ui/progress';
import { 
  Settings, 
  Calendar, 
  MapPin, 
  Link, 
  Users, 
  Heart, 
  MessageSquare, 
  Star,
  TrendingUp,
  Award,
  Camera,
  Globe,
  Mail,
  Phone,
  Briefcase,
  GraduationCap,
  Gift,
  Shield,
  Verified
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

const Profile = () => {
  const { user } = useAuth();
  const [showEditModal, setShowEditModal] = useState(false);
  const [activeTab, setActiveTab] = useState('posts');

  const mockProfile = {
    id: '1',
    username: 'john_doe',
    displayName: 'John Doe',
    bio: 'Software Developer | Tech Enthusiast | Coffee Lover ☕\nBuilding the future one line of code at a time 🚀',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    banner: 'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?ixlib=rb-1.2.1&auto=format&fit=crop&w=2070&q=80',
    location: 'San Francisco, CA',
    website: 'https://johndoe.dev',
    email: 'john@example.com',
    phone: '+1 (555) 123-4567',
    company: 'Tech Innovations Inc.',
    education: 'Stanford University',
    joinedDate: new Date('2021-01-15'),
    followers: 1234,
    following: 567,
    posts: 89,
    verified: true,
    level: 'Gold',
    reputation: 4.8,
    completedTasks: 67,
    totalTasks: 100,
    skills: ['JavaScript', 'React', 'Node.js', 'Python', 'AI/ML'],
    achievements: [
      { name: 'Early Adopter', icon: '🚀', description: 'Joined in the first month' },
      { name: 'Top Contributor', icon: '⭐', description: '100+ helpful posts' },
      { name: 'Community Leader', icon: '👑', description: 'Helped 500+ users' }
    ],
    socialStats: {
      totalLikes: 2456,
      totalShares: 567,
      totalComments: 890,
      profileViews: 12340
    }
  };

  const mockPosts = [
    {
      id: '1',
      content: 'Just shipped a new feature! Really excited about the possibilities 🚀\n\nThis update includes:\n✨ Dark mode improvements\n🔥 Performance optimizations\n🎨 New UI components',
      images: ['https://images.unsplash.com/photo-1517077304055-6e89abbf09b0?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'],
      createdAt: new Date('2024-01-15T10:30:00Z'),
      likes: 124,
      comments: 23,
      shares: 12,
      type: 'post'
    },
    {
      id: '2',
      content: 'Working on something amazing. Can\'t wait to share it with everyone!\n\n#TechLife #Innovation #BuildingTheFuture',
      images: ['https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'],
      createdAt: new Date('2024-01-14T15:45:00Z'),
      likes: 89,
      comments: 15,
      shares: 8,
      type: 'post'
    },
    {
      id: '3',
      content: 'Attended an amazing tech conference today! Learned so much about AI and machine learning trends for 2024.',
      images: [],
      createdAt: new Date('2024-01-13T18:20:00Z'),
      likes: 67,
      comments: 11,
      shares: 5,
      type: 'post'
    }
  ];

  const mockMedia = [
    { id: '1', url: 'https://images.unsplash.com/photo-1517077304055-6e89abbf09b0?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80', type: 'image' },
    { id: '2', url: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80', type: 'image' },
    { id: '3', url: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80', type: 'image' },
    { id: '4', url: 'https://images.unsplash.com/photo-1551434678-e076c223a692?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80', type: 'image' },
    { id: '5', url: 'https://images.unsplash.com/photo-1518085250350-d8e8c328c70e?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80', type: 'image' },
    { id: '6', url: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80', type: 'image' }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Enhanced Banner Section */}
      <div className="relative h-64 md:h-80 bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-50"
          style={{ backgroundImage: `url(${mockProfile.banner})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />

        {/* Profile Avatar and Info */}
        <div className="absolute bottom-0 left-0 right-0 p-4 md:p-6">
          <div className="container mx-auto">
            <div className="flex flex-col md:flex-row items-start md:items-end gap-4">
              <div className="relative">
                <Avatar className="h-24 w-24 md:h-32 md:w-32 border-4 border-white shadow-lg">
                  <AvatarImage src={mockProfile.avatar} alt={mockProfile.displayName} />
                  <AvatarFallback className="text-2xl">{mockProfile.displayName.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                </Avatar>
                <Button size="icon" variant="secondary" className="absolute bottom-0 right-0 h-8 w-8 rounded-full">
                  <Camera className="h-4 w-4" />
                </Button>
              </div>

              <div className="flex-1 text-white">
                <div className="flex items-center gap-2 mb-2">
                  <h1 className="text-2xl md:text-3xl font-bold">{mockProfile.displayName}</h1>
                  {mockProfile.verified && (
                    <Badge variant="secondary" className="bg-blue-600 text-white">
                      <Verified className="h-3 w-3 mr-1" fill="currentColor" />
                      Verified
                    </Badge>
                  )}
                  <Badge variant="outline" className="border-yellow-400 text-yellow-400">
                    <Star className="h-3 w-3 mr-1" fill="currentColor" />
                    {mockProfile.level}
                  </Badge>
                </div>
                <p className="text-blue-100 mb-2">@{mockProfile.username}</p>
                <div className="flex items-center gap-4 text-sm text-blue-200">
                  <div className="flex items-center gap-1">
                    <Users className="h-4 w-4" />
                    <span>{mockProfile.followers} followers</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <MessageSquare className="h-4 w-4" />
                    <span>{mockProfile.posts} posts</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4" />
                    <span>{mockProfile.reputation}/5.0</span>
                  </div>
                </div>
              </div>

              <div className="flex gap-2">
                <Button variant="outline" className="bg-white/10 border-white/20 text-white hover:bg-white/20">
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Message
                </Button>
                <Button 
                  variant="outline" 
                  className="bg-white/10 border-white/20 text-white hover:bg-white/20"
                  onClick={() => setShowEditModal(true)}
                >
                  <Settings className="h-4 w-4 mr-2" />
                  Edit Profile
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Enhanced Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Bio and Info Card */}
            <Card>
              <CardContent className="p-6 space-y-4">
                <div>
                  <h3 className="font-semibold text-lg mb-2">About</h3>
                  <p className="text-sm text-muted-foreground whitespace-pre-line">{mockProfile.bio}</p>
                </div>

                <div className="space-y-3 text-sm">
                  {mockProfile.location && (
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <MapPin className="w-4 h-4" />
                      <span>{mockProfile.location}</span>
                    </div>
                  )}

                  {mockProfile.company && (
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Briefcase className="w-4 h-4" />
                      <span>{mockProfile.company}</span>
                    </div>
                  )}

                  {mockProfile.education && (
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <GraduationCap className="w-4 h-4" />
                      <span>{mockProfile.education}</span>
                    </div>
                  )}

                  {mockProfile.website && (
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Globe className="w-4 h-4" />
                      <a href={mockProfile.website} className="text-blue-500 hover:underline" target="_blank" rel="noopener noreferrer">
                        {mockProfile.website}
                      </a>
                    </div>
                  )}

                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Calendar className="w-4 h-4" />
                    <span>Joined {formatDistanceToNow(mockProfile.joinedDate)} ago</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Stats Card */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Stats</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div>
                    <div className="text-2xl font-bold text-blue-600">{mockProfile.socialStats.totalLikes}</div>
                    <div className="text-xs text-muted-foreground">Total Likes</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-green-600">{mockProfile.socialStats.profileViews}</div>
                    <div className="text-xs text-muted-foreground">Profile Views</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-purple-600">{mockProfile.socialStats.totalShares}</div>
                    <div className="text-xs text-muted-foreground">Total Shares</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-orange-600">{mockProfile.socialStats.totalComments}</div>
                    <div className="text-xs text-muted-foreground">Comments</div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span>Profile Completion</span>
                    <span>{Math.round((mockProfile.completedTasks / mockProfile.totalTasks) * 100)}%</span>
                  </div>
                  <Progress value={(mockProfile.completedTasks / mockProfile.totalTasks) * 100} className="h-2" />
                </div>
              </CardContent>
            </Card>

            {/* Skills Card */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Skills</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {mockProfile.skills.map((skill, index) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Achievements Card */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Achievements</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {mockProfile.achievements.map((achievement, index) => (
                  <div key={index} className="flex items-center gap-3 p-2 bg-muted/50 rounded-lg">
                    <div className="text-2xl">{achievement.icon}</div>
                    <div className="flex-1">
                      <div className="font-medium text-sm">{achievement.name}</div>
                      <div className="text-xs text-muted-foreground">{achievement.description}</div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="posts" className="flex items-center gap-2">
                  <MessageSquare className="h-4 w-4" />
                  Posts
                </TabsTrigger>
                <TabsTrigger value="media" className="flex items-center gap-2">
                  <Camera className="h-4 w-4" />
                  Media
                </TabsTrigger>
                <TabsTrigger value="activity" className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4" />
                  Activity
                </TabsTrigger>
                <TabsTrigger value="about" className="flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  About
                </TabsTrigger>
              </TabsList>

              <TabsContent value="posts" className="space-y-4">
                {mockPosts.map((post) => (
                  <Card key={post.id}>
                    <CardContent className="p-6">
                      <div className="flex items-start gap-3">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={mockProfile.avatar} alt={mockProfile.displayName} />
                          <AvatarFallback>{mockProfile.displayName.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="font-semibold">{mockProfile.displayName}</span>
                            {mockProfile.verified && <Verified className="h-4 w-4 text-blue-500" fill="currentColor" />}
                            <span className="text-muted-foreground text-sm">@{mockProfile.username}</span>
                            <span className="text-muted-foreground text-sm">•</span>
                            <span className="text-muted-foreground text-sm">{formatDistanceToNow(post.createdAt)} ago</span>
                          </div>
                          <p className="text-sm mb-3 whitespace-pre-line">{post.content}</p>
                          {post.images.length > 0 && (
                            <div className="mb-3">
                              <img 
                                src={post.images[0]} 
                                alt="Post content" 
                                className="rounded-lg max-w-full h-auto border"
                              />
                            </div>
                          )}
                          <div className="flex items-center gap-6 text-sm text-muted-foreground">
                            <button className="flex items-center gap-1 hover:text-red-500 transition-colors">
                              <Heart className="h-4 w-4" />
                              <span>{post.likes}</span>
                            </button>
                            <button className="flex items-center gap-1 hover:text-blue-500 transition-colors">
                              <MessageSquare className="h-4 w-4" />
                              <span>{post.comments}</span>
                            </button>
                            <button className="flex items-center gap-1 hover:text-green-500 transition-colors">
                              <TrendingUp className="h-4 w-4" />
                              <span>{post.shares}</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </TabsContent>

              <TabsContent value="media" className="space-y-4">
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {mockMedia.map((media) => (
                    <div key={media.id} className="aspect-square rounded-lg overflow-hidden bg-muted">
                      <img 
                        src={media.url} 
                        alt="Media content" 
                        className="w-full h-full object-cover hover:scale-105 transition-transform cursor-pointer"
                      />
                    </div>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="activity" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Recent Activity</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                      <Heart className="h-5 w-5 text-red-500" />
                      <div className="flex-1">
                        <p className="text-sm">Liked a post by <span className="font-medium">@tech_guru</span></p>
                        <p className="text-xs text-muted-foreground">2 hours ago</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                      <Users className="h-5 w-5 text-blue-500" />
                      <div className="flex-1">
                        <p className="text-sm">Started following <span className="font-medium">@design_pro</span></p>
                        <p className="text-xs text-muted-foreground">4 hours ago</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                      <MessageSquare className="h-5 w-5 text-green-500" />
                      <div className="flex-1">
                        <p className="text-sm">Commented on a post about AI trends</p>
                        <p className="text-xs text-muted-foreground">6 hours ago</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="about" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Detailed Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div>
                      <h4 className="font-medium mb-2">Contact Information</h4>
                      <div className="space-y-2 text-sm text-muted-foreground">
                        <div className="flex items-center gap-2">
                          <Mail className="h-4 w-4" />
                          <span>{mockProfile.email}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Phone className="h-4 w-4" />
                          <span>{mockProfile.phone}</span>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-medium mb-2">Professional Background</h4>
                      <div className="space-y-2 text-sm text-muted-foreground">
                        <div className="flex items-center gap-2">
                          <Briefcase className="h-4 w-4" />
                          <span>Software Developer at {mockProfile.company}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <GraduationCap className="h-4 w-4" />
                          <span>Computer Science, {mockProfile.education}</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>

      <EditProfileModal 
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        profile={mockProfile}
      />
    </div>
  );
};

export default Profile;