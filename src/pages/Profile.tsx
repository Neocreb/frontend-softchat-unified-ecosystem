import React, { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ProfileHeader } from "@/components/profile/ProfileHeader";
import { ProfileTabs } from "@/components/profile/ProfileTabs";
import { EditProfileModal } from "@/components/profile/EditProfileModal";
import { Progress } from "@/components/ui/progress";
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
  Verified,
  Edit,
  Share2,
  MoreHorizontal,
  UserPlus,
  MessageCircle,
  Image as ImageIcon,
  Upload,
  Check,
  X,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { cn } from "@/lib/utils";
import { useToast } from "@/components/ui/use-toast";

const Profile = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [showEditModal, setShowEditModal] = useState(false);
  const [activeTab, setActiveTab] = useState("posts");
  const [isEditingCover, setIsEditingCover] = useState(false);
  const [isEditingAvatar, setIsEditingAvatar] = useState(false);
  const [coverPhotoUrl, setCoverPhotoUrl] = useState("");

  const mockProfile = {
    id: "1",
    username: "john_doe",
    displayName: "John Doe",
    bio: "Software Developer | Tech Enthusiast | Coffee Lover ☕\nBuilding the future one line of code at a time 🚀\n\n🌟 Passionate about creating amazing user experiences\n📱 Mobile-first developer\n🎯 Always learning new technologies",
    avatar:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
    banner:
      "https://images.unsplash.com/photo-1579546929518-9e396f3cc809?ixlib=rb-1.2.1&auto=format&fit=crop&w=2070&q=80",
    location: "San Francisco, CA",
    website: "https://johndoe.dev",
    email: "john@example.com",
    phone: "+1 (555) 123-4567",
    company: "Tech Innovations Inc.",
    education: "Stanford University",
    jobTitle: "Senior Full Stack Developer",
    joinedDate: new Date("2021-01-15"),
    followers: 12340,
    following: 567,
    posts: 189,
    verified: true,
    level: "Gold",
    reputation: 4.8,
    completedTasks: 87,
    totalTasks: 100,
    isOnline: true,
    lastSeen: new Date(),
    skills: [
      "JavaScript",
      "React",
      "Node.js",
      "Python",
      "AI/ML",
      "TypeScript",
      "GraphQL",
      "AWS",
    ],
    achievements: [
      {
        name: "Early Adopter",
        icon: "🚀",
        description: "Joined in the first month",
        date: "2021-01-15",
      },
      {
        name: "Top Contributor",
        icon: "⭐",
        description: "100+ helpful posts",
        date: "2023-06-15",
      },
      {
        name: "Community Leader",
        icon: "👑",
        description: "Helped 500+ users",
        date: "2023-12-01",
      },
      {
        name: "Coding Streak",
        icon: "🔥",
        description: "30-day coding streak",
        date: "2024-01-01",
      },
    ],
    socialStats: {
      totalLikes: 24560,
      totalShares: 5670,
      totalComments: 8900,
      profileViews: 123400,
    },
    relationshipStatus: "Single",
    languages: ["English", "Spanish", "French"],
    interests: ["Technology", "Photography", "Travel", "Music", "Gaming"],
  };

  const mockPosts = [
    {
      id: "1",
      content:
        "Just shipped a new feature! Really excited about the possibilities 🚀\n\nThis update includes:\n✨ Dark mode improvements\n🔥 Performance optimizations\n🎨 New UI components\n📱 Better mobile experience",
      images: [
        "https://images.unsplash.com/photo-1517077304055-6e89abbf09b0?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
      ],
      createdAt: new Date("2024-01-15T10:30:00Z"),
      likes: 124,
      comments: 23,
      shares: 12,
      type: "post",
    },
    {
      id: "2",
      content:
        "Working on something amazing with the team. Can't wait to share it with everyone! 🎯\n\nBeen focusing on:\n🎨 User experience improvements\n⚡ Performance optimizations\n🛡️ Security enhancements\n\n#TechLife #Innovation #BuildingTheFuture",
      images: [
        "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
      ],
      createdAt: new Date("2024-01-14T15:45:00Z"),
      likes: 189,
      comments: 35,
      shares: 18,
      type: "post",
    },
    {
      id: "3",
      content:
        "Attended an amazing tech conference today! 🎤 Learned so much about AI and machine learning trends for 2024. The future is incredibly bright! 🌟\n\nKey takeaways:\n🤖 AI integration in everyday apps\n📊 Better data visualization\n🔮 Predictive analytics improvements",
      images: [],
      createdAt: new Date("2024-01-13T18:20:00Z"),
      likes: 267,
      comments: 41,
      shares: 25,
      type: "post",
    },
  ];

  const mockMedia = [
    {
      id: "1",
      url: "https://images.unsplash.com/photo-1517077304055-6e89abbf09b0?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80",
      type: "image",
    },
    {
      id: "2",
      url: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80",
      type: "image",
    },
    {
      id: "3",
      url: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80",
      type: "image",
    },
    {
      id: "4",
      url: "https://images.unsplash.com/photo-1551434678-e076c223a692?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80",
      type: "image",
    },
    {
      id: "5",
      url: "https://images.unsplash.com/photo-1518085250350-d8e8c328c70e?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80",
      type: "image",
    },
    {
      id: "6",
      url: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80",
      type: "image",
    },
  ];

  const handleCoverPhotoUpload = () => {
    toast({
      title: "Cover Photo Updated",
      description: "Your cover photo has been updated successfully.",
    });
    setIsEditingCover(false);
  };

  const handleAvatarUpload = () => {
    toast({
      title: "Profile Picture Updated",
      description: "Your profile picture has been updated successfully.",
    });
    setIsEditingAvatar(false);
  };

  const handleFollowUser = () => {
    toast({
      title: "Following",
      description: "You are now following this user.",
    });
  };

  const handleMessageUser = () => {
    toast({
      title: "Message Sent",
      description: "Opening chat conversation...",
    });
  };

  return (
    <div className="min-h-screen bg-background mobile-container">
      {/* Enhanced Facebook-Style Cover Photo Section */}
      <div className="relative">
        {/* Cover Photo */}
        <div className="relative h-48 sm:h-56 md:h-72 lg:h-80 bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 overflow-hidden rounded-b-lg">
          <div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{
              backgroundImage: `url(${coverPhotoUrl || mockProfile.banner})`,
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/20" />

          {/* Cover Photo Actions */}
          <div className="absolute top-3 right-3 sm:top-4 sm:right-4 flex gap-2">
            <Button
              size="sm"
              variant="secondary"
              className="bg-white/90 text-black hover:bg-white"
              onClick={() => setIsEditingCover(true)}
            >
              <Camera className="h-4 w-4 mr-1" />
              <span className="hidden sm:inline">Edit Cover</span>
            </Button>
            <Button
              size="sm"
              variant="secondary"
              className="bg-white/90 text-black hover:bg-white"
            >
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </div>

          {/* Edit Cover Photo Modal */}
          {isEditingCover && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center p-4">
              <Card className="w-full max-w-md">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Upload className="h-5 w-5" />
                    Update Cover Photo
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex flex-col gap-3">
                    <Button className="w-full">
                      <Upload className="h-4 w-4 mr-2" />
                      Upload Photo
                    </Button>
                    <Button variant="outline" className="w-full">
                      <ImageIcon className="h-4 w-4 mr-2" />
                      Choose from Gallery
                    </Button>
                  </div>
                  <div className="flex gap-2">
                    <Button onClick={handleCoverPhotoUpload} className="flex-1">
                      <Check className="h-4 w-4 mr-2" />
                      Save
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => setIsEditingCover(false)}
                      className="flex-1"
                    >
                      <X className="h-4 w-4 mr-2" />
                      Cancel
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>

        {/* Profile Information Section */}
        <div className="px-3 sm:px-4 md:px-6">
          <div className="relative">
            {/* Profile Avatar */}
            <div className="relative -mt-12 sm:-mt-16 md:-mt-20 mb-4">
              <div className="relative inline-block">
                <Avatar className="h-24 w-24 sm:h-28 sm:w-28 md:h-32 md:w-32 lg:h-36 lg:w-36 border-4 border-white shadow-xl">
                  <AvatarImage
                    src={mockProfile.avatar}
                    alt={mockProfile.displayName}
                    className="object-cover"
                  />
                  <AvatarFallback className="text-xl sm:text-2xl font-bold">
                    {mockProfile.displayName
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>

                {/* Online Status Indicator */}
                {mockProfile.isOnline && (
                  <div className="absolute bottom-2 right-2 h-4 w-4 sm:h-5 sm:w-5 bg-green-500 border-2 border-white rounded-full"></div>
                )}

                {/* Avatar Edit Button */}
                <Button
                  size="icon"
                  variant="secondary"
                  className="absolute bottom-0 right-0 h-7 w-7 sm:h-8 sm:w-8 rounded-full bg-white shadow-md hover:bg-gray-50"
                  onClick={() => setIsEditingAvatar(true)}
                >
                  <Camera className="h-3 w-3 sm:h-4 sm:w-4" />
                </Button>
              </div>
            </div>

            {/* Profile Info */}
            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-6">
              <div className="space-y-3">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold">
                      {mockProfile.displayName}
                    </h1>
                    {mockProfile.verified && (
                      <Verified className="h-5 w-5 sm:h-6 sm:w-6 text-blue-500 fill-current" />
                    )}
                  </div>
                  <p className="text-gray-600 text-sm sm:text-base">
                    @{mockProfile.username}
                  </p>
                  {mockProfile.jobTitle && (
                    <p className="text-gray-700 font-medium text-sm sm:text-base">
                      {mockProfile.jobTitle}
                    </p>
                  )}
                </div>

                {/* Stats */}
                <div className="flex items-center gap-4 sm:gap-6 text-sm sm:text-base">
                  <div className="text-center">
                    <div className="font-bold text-lg">{mockProfile.posts}</div>
                    <div className="text-gray-600 text-xs sm:text-sm">
                      Posts
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="font-bold text-lg">
                      {(mockProfile.followers / 1000).toFixed(1)}K
                    </div>
                    <div className="text-gray-600 text-xs sm:text-sm">
                      Followers
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="font-bold text-lg">
                      {mockProfile.following}
                    </div>
                    <div className="text-gray-600 text-xs sm:text-sm">
                      Following
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="font-bold text-lg flex items-center gap-1">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      {mockProfile.reputation}
                    </div>
                    <div className="text-gray-600 text-xs sm:text-sm">
                      Rating
                    </div>
                  </div>
                </div>

                {/* Level and Badges */}
                <div className="flex items-center gap-2 flex-wrap">
                  <Badge
                    variant="outline"
                    className="border-yellow-400 text-yellow-600"
                  >
                    <Star className="h-3 w-3 mr-1 fill-current" />
                    {mockProfile.level}
                  </Badge>
                  <Badge
                    variant="outline"
                    className="border-green-400 text-green-600"
                  >
                    <Shield className="h-3 w-3 mr-1" />
                    Verified
                  </Badge>
                  {mockProfile.isOnline && (
                    <Badge
                      variant="outline"
                      className="border-green-400 text-green-600"
                    >
                      <div className="h-2 w-2 bg-green-500 rounded-full mr-1"></div>
                      Online
                    </Badge>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2 sm:gap-3">
                <Button
                  className="flex-1 sm:flex-none"
                  onClick={handleFollowUser}
                >
                  <UserPlus className="h-4 w-4 mr-2" />
                  Follow
                </Button>
                <Button
                  variant="outline"
                  className="flex-1 sm:flex-none"
                  onClick={handleMessageUser}
                >
                  <MessageCircle className="h-4 w-4 mr-2" />
                  Message
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setShowEditModal(true)}
                >
                  <Edit className="h-4 w-4 mr-2" />
                  <span className="hidden sm:inline">Edit Profile</span>
                </Button>
                <Button variant="outline" size="icon">
                  <Share2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="px-3 sm:px-4 md:px-6 pb-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 md:gap-6">
          {/* Enhanced Sidebar */}
          <div className="lg:col-span-1 space-y-4 order-2 lg:order-1">
            {/* Bio and Info Card */}
            <Card>
              <CardContent className="p-4 sm:p-6 space-y-4">
                <div>
                  <h3 className="font-semibold text-lg mb-2">About</h3>
                  <p className="text-sm text-muted-foreground whitespace-pre-line leading-relaxed">
                    {mockProfile.bio}
                  </p>
                </div>

                <div className="space-y-3 text-sm">
                  {mockProfile.location && (
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <MapPin className="w-4 h-4 flex-shrink-0" />
                      <span>{mockProfile.location}</span>
                    </div>
                  )}

                  {mockProfile.company && (
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Briefcase className="w-4 h-4 flex-shrink-0" />
                      <span>{mockProfile.company}</span>
                    </div>
                  )}

                  {mockProfile.education && (
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <GraduationCap className="w-4 h-4 flex-shrink-0" />
                      <span>{mockProfile.education}</span>
                    </div>
                  )}

                  {mockProfile.website && (
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Globe className="w-4 h-4 flex-shrink-0" />
                      <a
                        href={mockProfile.website}
                        className="text-blue-500 hover:underline break-all"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {mockProfile.website}
                      </a>
                    </div>
                  )}

                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Calendar className="w-4 h-4 flex-shrink-0" />
                    <span>
                      Joined {formatDistanceToNow(mockProfile.joinedDate)} ago
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Enhanced Stats Card */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Activity Stats</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div>
                    <div className="text-xl font-bold text-blue-600">
                      {(mockProfile.socialStats.totalLikes / 1000).toFixed(1)}K
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Total Likes
                    </div>
                  </div>
                  <div>
                    <div className="text-xl font-bold text-green-600">
                      {(mockProfile.socialStats.profileViews / 1000).toFixed(0)}
                      K
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Profile Views
                    </div>
                  </div>
                  <div>
                    <div className="text-xl font-bold text-purple-600">
                      {(mockProfile.socialStats.totalShares / 1000).toFixed(1)}K
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Total Shares
                    </div>
                  </div>
                  <div>
                    <div className="text-xl font-bold text-orange-600">
                      {(mockProfile.socialStats.totalComments / 1000).toFixed(
                        1,
                      )}
                      K
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Comments
                    </div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span>Profile Completion</span>
                    <span>
                      {Math.round(
                        (mockProfile.completedTasks / mockProfile.totalTasks) *
                          100,
                      )}
                      %
                    </span>
                  </div>
                  <Progress
                    value={
                      (mockProfile.completedTasks / mockProfile.totalTasks) *
                      100
                    }
                    className="h-2"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Enhanced Skills Card */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Skills & Expertise</CardTitle>
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

            {/* Enhanced Achievements Card */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Achievements</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {mockProfile.achievements.map((achievement, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg hover:bg-muted/70 transition-colors"
                  >
                    <div className="text-2xl">{achievement.icon}</div>
                    <div className="flex-1">
                      <div className="font-medium text-sm">
                        {achievement.name}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {achievement.description}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {formatDistanceToNow(new Date(achievement.date))} ago
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Languages Card */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Languages</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {mockProfile.languages.map((language, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {language}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Interests Card */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Interests</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {mockProfile.interests.map((interest, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {interest}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3 order-1 lg:order-2">
            <Tabs
              value={activeTab}
              onValueChange={setActiveTab}
              className="space-y-4 md:space-y-6"
            >
              <div className="mobile-tabs">
                <TabsList className="grid w-full grid-cols-4 mobile-grid-4">
                  <TabsTrigger
                    value="posts"
                    className="mobile-tab touch-target"
                  >
                    <MessageSquare className="h-4 w-4 mr-1" />
                    <span className="hidden sm:inline">Posts</span>
                  </TabsTrigger>
                  <TabsTrigger
                    value="media"
                    className="mobile-tab touch-target"
                  >
                    <Camera className="h-4 w-4 mr-1" />
                    <span className="hidden sm:inline">Media</span>
                  </TabsTrigger>
                  <TabsTrigger
                    value="activity"
                    className="mobile-tab touch-target"
                  >
                    <TrendingUp className="h-4 w-4 mr-1" />
                    <span className="hidden sm:inline">Activity</span>
                  </TabsTrigger>
                  <TabsTrigger
                    value="about"
                    className="mobile-tab touch-target"
                  >
                    <Users className="h-4 w-4 mr-1" />
                    <span className="hidden sm:inline">About</span>
                  </TabsTrigger>
                </TabsList>
              </div>

              <TabsContent value="posts" className="space-y-4">
                {mockPosts.map((post) => (
                  <Card
                    key={post.id}
                    className="hover:shadow-md transition-shadow"
                  >
                    <CardContent className="p-4 sm:p-6">
                      <div className="flex items-start gap-3">
                        <Avatar className="h-10 w-10 flex-shrink-0">
                          <AvatarImage
                            src={mockProfile.avatar}
                            alt={mockProfile.displayName}
                          />
                          <AvatarFallback>
                            {mockProfile.displayName
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-2 flex-wrap">
                            <span className="font-semibold">
                              {mockProfile.displayName}
                            </span>
                            {mockProfile.verified && (
                              <Verified
                                className="h-4 w-4 text-blue-500 flex-shrink-0"
                                fill="currentColor"
                              />
                            )}
                            <span className="text-muted-foreground text-sm break-all">
                              @{mockProfile.username}
                            </span>
                            <span className="text-muted-foreground text-sm">
                              •
                            </span>
                            <span className="text-muted-foreground text-sm">
                              {formatDistanceToNow(post.createdAt)} ago
                            </span>
                          </div>
                          <p className="text-sm mb-3 whitespace-pre-line leading-relaxed">
                            {post.content}
                          </p>
                          {post.images.length > 0 && (
                            <div className="mb-4">
                              <img
                                src={post.images[0]}
                                alt="Post content"
                                className="rounded-lg max-w-full h-auto border"
                              />
                            </div>
                          )}
                          <div className="flex items-center gap-6 text-sm text-muted-foreground">
                            <button className="flex items-center gap-1 hover:text-red-500 transition-colors touch-target">
                              <Heart className="h-4 w-4" />
                              <span>{post.likes}</span>
                            </button>
                            <button className="flex items-center gap-1 hover:text-blue-500 transition-colors touch-target">
                              <MessageSquare className="h-4 w-4" />
                              <span>{post.comments}</span>
                            </button>
                            <button className="flex items-center gap-1 hover:text-green-500 transition-colors touch-target">
                              <Share2 className="h-4 w-4" />
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
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-3 gap-2 sm:gap-4">
                  {mockMedia.map((media) => (
                    <div
                      key={media.id}
                      className="aspect-square rounded-lg overflow-hidden bg-muted hover:scale-105 transition-transform cursor-pointer"
                    >
                      <img
                        src={media.url}
                        alt="Media content"
                        className="w-full h-full object-cover"
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
                      <Heart className="h-5 w-5 text-red-500 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm">
                          Liked a post by{" "}
                          <span className="font-medium">@tech_guru</span>
                        </p>
                        <p className="text-xs text-muted-foreground">
                          2 hours ago
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                      <Users className="h-5 w-5 text-blue-500 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm">
                          Started following{" "}
                          <span className="font-medium">@design_pro</span>
                        </p>
                        <p className="text-xs text-muted-foreground">
                          4 hours ago
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                      <MessageSquare className="h-5 w-5 text-green-500 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm">
                          Commented on a post about AI trends
                        </p>
                        <p className="text-xs text-muted-foreground">
                          6 hours ago
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                      <Award className="h-5 w-5 text-purple-500 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm">
                          Earned the "Community Leader" achievement
                        </p>
                        <p className="text-xs text-muted-foreground">
                          1 day ago
                        </p>
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
                      <h4 className="font-medium mb-3">Contact Information</h4>
                      <div className="space-y-3 text-sm text-muted-foreground">
                        <div className="flex items-center gap-2">
                          <Mail className="h-4 w-4 flex-shrink-0" />
                          <span className="break-all">{mockProfile.email}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Phone className="h-4 w-4 flex-shrink-0" />
                          <span>{mockProfile.phone}</span>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-medium mb-3">
                        Professional Background
                      </h4>
                      <div className="space-y-3 text-sm text-muted-foreground">
                        <div className="flex items-start gap-2">
                          <Briefcase className="h-4 w-4 flex-shrink-0 mt-0.5" />
                          <div>
                            <div className="font-medium text-foreground">
                              {mockProfile.jobTitle}
                            </div>
                            <div>{mockProfile.company}</div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <GraduationCap className="h-4 w-4 flex-shrink-0" />
                          <span>Computer Science, {mockProfile.education}</span>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-medium mb-3">Personal Information</h4>
                      <div className="space-y-3 text-sm text-muted-foreground">
                        <div className="flex items-center gap-2">
                          <Users className="h-4 w-4 flex-shrink-0" />
                          <span>
                            Relationship Status:{" "}
                            {mockProfile.relationshipStatus}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Globe className="h-4 w-4 flex-shrink-0" />
                          <span>
                            Languages: {mockProfile.languages.join(", ")}
                          </span>
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
