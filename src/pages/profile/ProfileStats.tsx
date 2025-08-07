import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  Users,
  MessageSquare,
  Eye,
  DollarSign,
  Star,
  ShoppingBag,
  Briefcase,
  TrendingUp,
  Truck,
  Heart,
  Share,
} from "lucide-react";

interface StatCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon: React.ReactNode;
  gradient: string;
  onClick?: () => void;
}

const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  description,
  icon,
  gradient,
  onClick,
}) => (
  <Card 
    className={`cursor-pointer hover:shadow-lg transition-all duration-300 hover:scale-105 ${gradient} border-0 text-white`}
    onClick={onClick}
  >
    <CardContent className="p-4 sm:p-6">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            {icon}
            <h3 className="font-semibold text-sm sm:text-base">{title}</h3>
          </div>
          <div className="text-2xl sm:text-3xl font-bold mb-1">{value}</div>
          {description && (
            <p className="text-xs sm:text-sm opacity-90">{description}</p>
          )}
        </div>
      </div>
    </CardContent>
  </Card>
);

const ProfileStats: React.FC = () => {
  const navigate = useNavigate();
  const { username } = useParams<{ username: string }>();

  // Mock profile data
  const mockProfile = {
    username: username || "sarah_johnson",
    displayName: "Sarah Johnson",
    avatar: "/placeholder.svg",
    verified: true,
    bio: "UI/UX Designer passionate about creating beautiful experiences",
    posts: 247,
    followers: 12400,
    following: 892,
    profileViews: 45200,
    walletBalance: 1250.75,
    trustLevel: 4.8,
    marketplaceSales: 89,
    freelanceProjects: 23,
    cryptoTrades: 156,
    deliveryRating: 4.9,
    likes: 89400,
    shares: 12300,
  };

  const stats = [
    {
      title: "Posts",
      value: mockProfile.posts,
      description: "Content shared",
      icon: <MessageSquare className="h-5 w-5" />,
      gradient: "bg-gradient-to-br from-blue-500 to-blue-600",
      onClick: () => navigate(`/app/profile/${username}/posts`),
    },
    {
      title: "Followers",
      value: mockProfile.followers.toLocaleString(),
      description: "People following you",
      icon: <Users className="h-5 w-5" />,
      gradient: "bg-gradient-to-br from-purple-500 to-purple-600",
      onClick: () => navigate(`/app/profile/${username}/followers`),
    },
    {
      title: "Following",
      value: mockProfile.following.toLocaleString(),
      description: "People you follow",
      icon: <Users className="h-5 w-5" />,
      gradient: "bg-gradient-to-br from-indigo-500 to-indigo-600",
      onClick: () => navigate(`/app/profile/${username}/following`),
    },
    {
      title: "Profile Views",
      value: mockProfile.profileViews.toLocaleString(),
      description: "Times viewed",
      icon: <Eye className="h-5 w-5" />,
      gradient: "bg-gradient-to-br from-emerald-500 to-emerald-600",
      onClick: () => navigate(`/app/profile/${username}/views`),
    },
    {
      title: "Wallet Balance",
      value: `$${mockProfile.walletBalance}`,
      description: "Available funds",
      icon: <DollarSign className="h-5 w-5" />,
      gradient: "bg-gradient-to-br from-amber-500 to-amber-600",
      onClick: () => navigate(`/app/wallet`),
    },
    {
      title: "Trust Level",
      value: `${mockProfile.trustLevel}/5`,
      description: "Community rating",
      icon: <Star className="h-5 w-5" />,
      gradient: "bg-gradient-to-br from-orange-500 to-orange-600",
      onClick: () => navigate(`/app/profile/${username}/trust`),
    },
    {
      title: "Marketplace Sales",
      value: mockProfile.marketplaceSales,
      description: "Items sold",
      icon: <ShoppingBag className="h-5 w-5" />,
      gradient: "bg-gradient-to-br from-pink-500 to-pink-600",
      onClick: () => navigate(`/app/marketplace/seller/${username}`),
    },
    {
      title: "Freelance Projects",
      value: mockProfile.freelanceProjects,
      description: "Completed projects",
      icon: <Briefcase className="h-5 w-5" />,
      gradient: "bg-gradient-to-br from-violet-500 to-violet-600",
      onClick: () => navigate(`/app/freelance/profile/${username}`),
    },
    {
      title: "Crypto Trades",
      value: mockProfile.cryptoTrades,
      description: "Successful trades",
      icon: <TrendingUp className="h-5 w-5" />,
      gradient: "bg-gradient-to-br from-cyan-500 to-cyan-600",
      onClick: () => navigate(`/app/crypto/profile/${username}`),
    },
    {
      title: "Delivery Rating",
      value: `${mockProfile.deliveryRating}/5`,
      description: "Service quality",
      icon: <Truck className="h-5 w-5" />,
      gradient: "bg-gradient-to-br from-teal-500 to-teal-600",
      onClick: () => navigate(`/app/delivery/profile/${username}`),
    },
    {
      title: "Total Likes",
      value: mockProfile.likes.toLocaleString(),
      description: "Across all content",
      icon: <Heart className="h-5 w-5" />,
      gradient: "bg-gradient-to-br from-rose-500 to-rose-600",
      onClick: () => navigate(`/app/profile/${username}/likes`),
    },
    {
      title: "Shares",
      value: mockProfile.shares.toLocaleString(),
      description: "Content shared by others",
      icon: <Share className="h-5 w-5" />,
      gradient: "bg-gradient-to-br from-slate-500 to-slate-600",
      onClick: () => navigate(`/app/profile/${username}/shares`),
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate(`/app/profile/${username}`)}
              className="p-2"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            
            <div className="flex items-center gap-3 flex-1">
              <Avatar className="h-8 w-8 sm:h-10 sm:w-10">
                <AvatarImage src={mockProfile.avatar} alt={mockProfile.displayName} />
                <AvatarFallback>
                  {mockProfile.displayName.split(" ").map(n => n[0]).join("")}
                </AvatarFallback>
              </Avatar>
              
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h1 className="text-lg sm:text-xl font-bold">{mockProfile.displayName}</h1>
                  {mockProfile.verified && (
                    <Badge variant="secondary" className="text-xs">
                      Verified
                    </Badge>
                  )}
                </div>
                <p className="text-sm text-gray-600">@{mockProfile.username}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Profile Statistics</h2>
          <p className="text-gray-600">Comprehensive overview of your platform activity</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {stats.map((stat, index) => (
            <StatCard key={index} {...stat} />
          ))}
        </div>

        {/* Summary Section */}
        <Card className="mt-8 border-0 bg-gradient-to-r from-blue-50 to-purple-50">
          <CardHeader>
            <CardTitle className="text-lg sm:text-xl">Activity Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-blue-600">{mockProfile.posts + mockProfile.marketplaceSales}</div>
                <div className="text-sm text-gray-600">Total Content</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-purple-600">{(mockProfile.followers + mockProfile.following).toLocaleString()}</div>
                <div className="text-sm text-gray-600">Network Size</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-emerald-600">{(mockProfile.likes + mockProfile.shares).toLocaleString()}</div>
                <div className="text-sm text-gray-600">Engagement</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-amber-600">{mockProfile.freelanceProjects + mockProfile.cryptoTrades}</div>
                <div className="text-sm text-gray-600">Transactions</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ProfileStats;
