import React, { useState, useEffect } from "react";
import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  ArrowLeft,
  Search,
  UserPlus,
  Check,
  MessageCircle,
  Send,
  Users,
  Filter,
} from "lucide-react";

interface User {
  id: string;
  username: string;
  displayName: string;
  avatar: string;
  verified: boolean;
  isFollowing?: boolean;
  followsBack?: boolean;
  isOnline?: boolean;
  bio?: string;
  followers?: number;
  followedDate?: string;
}

const ProfileFollowers: React.FC = () => {
  const navigate = useNavigate();
  const { username } = useParams<{ username: string }>();
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [followingStates, setFollowingStates] = useState<Record<string, boolean>>({});
  const [filter, setFilter] = useState<"all" | "mutual" | "verified">("all");

  // Mock followers data
  const mockFollowers: User[] = [
    {
      id: "1",
      username: "mike_chen",
      displayName: "Mike Chen",
      avatar: "/placeholder.svg",
      verified: true,
      isFollowing: false,
      followsBack: true,
      isOnline: true,
      bio: "Full-stack developer and crypto enthusiast",
      followers: 5670,
      followedDate: "2 days ago",
    },
    {
      id: "2",
      username: "emma_davis",
      displayName: "Emma Davis",
      avatar: "/placeholder.svg",
      verified: true,
      isFollowing: true,
      followsBack: true,
      isOnline: false,
      bio: "Product Manager | Tech Leader | Coffee Addict",
      followers: 12340,
      followedDate: "1 week ago",
    },
    {
      id: "3",
      username: "alex_wilson",
      displayName: "Alex Wilson",
      avatar: "/placeholder.svg",
      verified: false,
      isFollowing: false,
      followsBack: false,
      isOnline: true,
      bio: "Freelance developer building the future",
      followers: 890,
      followedDate: "3 days ago",
    },
    {
      id: "4",
      username: "lisa_brown",
      displayName: "Lisa Brown",
      avatar: "/placeholder.svg",
      verified: true,
      isFollowing: true,
      followsBack: false,
      isOnline: false,
      bio: "Designer & Creative Director",
      followers: 8900,
      followedDate: "5 days ago",
    },
    {
      id: "5",
      username: "david_martinez",
      displayName: "David Martinez",
      avatar: "/placeholder.svg",
      verified: false,
      isFollowing: false,
      followsBack: true,
      isOnline: true,
      bio: "Marketing specialist and content creator",
      followers: 3450,
      followedDate: "1 day ago",
    },
  ];

  useEffect(() => {
    let filtered = mockFollowers.filter(
      (user) =>
        user.displayName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (user.bio && user.bio.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    // Apply filters
    if (filter === "mutual") {
      filtered = filtered.filter(user => user.followsBack);
    } else if (filter === "verified") {
      filtered = filtered.filter(user => user.verified);
    }

    setFilteredUsers(filtered);
  }, [searchQuery, filter]);

  useEffect(() => {
    // Initialize following states
    const states: Record<string, boolean> = {};
    mockFollowers.forEach((user) => {
      states[user.id] = user.isFollowing || false;
    });
    setFollowingStates(states);
  }, []);

  const handleFollowToggle = (userId: string) => {
    setFollowingStates((prev) => ({
      ...prev,
      [userId]: !prev[userId],
    }));
  };

  const handleUserClick = (userUsername: string) => {
    navigate(`/app/profile/${userUsername}`);
  };

  const handleMessage = (userUsername: string) => {
    navigate(`/app/chat?user=${userUsername}`);
  };

  const handleSendMoney = (userUsername: string) => {
    navigate(`/app/wallet?action=send&recipient=${userUsername}`);
  };

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
            
            <div className="flex items-center gap-2 flex-1">
              <Users className="h-5 w-5 text-purple-600" />
              <h1 className="text-lg sm:text-xl font-bold">Followers</h1>
              <Badge variant="secondary" className="text-xs">
                {filteredUsers.length}
              </Badge>
            </div>
          </div>

          {/* Search and Filters */}
          <div className="mt-4 flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search followers..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <div className="flex gap-2">
              <Button
                variant={filter === "all" ? "default" : "outline"}
                size="sm"
                onClick={() => setFilter("all")}
                className="text-xs"
              >
                All
              </Button>
              <Button
                variant={filter === "mutual" ? "default" : "outline"}
                size="sm"
                onClick={() => setFilter("mutual")}
                className="text-xs"
              >
                Mutual
              </Button>
              <Button
                variant={filter === "verified" ? "default" : "outline"}
                size="sm"
                onClick={() => setFilter("verified")}
                className="text-xs"
              >
                Verified
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6">
        {filteredUsers.length === 0 ? (
          <Card className="text-center py-12">
            <CardContent>
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium mb-2">
                {searchQuery ? "No followers match your search" : "No followers yet"}
              </h3>
              <p className="text-gray-600 text-sm">
                {searchQuery ? "Try adjusting your search terms" : "Start connecting with people!"}
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3">
            {filteredUsers.map((user) => (
              <Card key={user.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    {/* Avatar with online status */}
                    <div className="relative flex-shrink-0">
                      <Avatar
                        className="h-12 w-12 sm:h-14 sm:w-14 cursor-pointer"
                        onClick={() => handleUserClick(user.username)}
                      >
                        <AvatarImage src={user.avatar} alt={user.displayName} />
                        <AvatarFallback className="text-sm">
                          {user.displayName
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      {user.isOnline && (
                        <div className="absolute bottom-0 right-0 w-4 h-4 bg-green-500 border-2 border-white rounded-full" />
                      )}
                    </div>

                    {/* User Info */}
                    <div className="flex-1 min-w-0">
                      <div
                        className="cursor-pointer"
                        onClick={() => handleUserClick(user.username)}
                      >
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-semibold text-sm sm:text-base truncate">
                            {user.displayName}
                          </span>
                          {user.verified && (
                            <div className="w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
                              <Check className="w-2.5 h-2.5 text-white" />
                            </div>
                          )}
                          {user.followsBack && (
                            <Badge variant="secondary" className="text-xs px-2 py-0 h-5">
                              Mutual
                            </Badge>
                          )}
                        </div>
                        <div className="text-sm text-gray-600 mb-1">@{user.username}</div>
                        {user.bio && (
                          <p className="text-sm text-gray-700 mb-2 line-clamp-2">{user.bio}</p>
                        )}
                        <div className="flex items-center gap-4 text-xs text-gray-500">
                          <span>{user.followers?.toLocaleString()} followers</span>
                          <span>Followed {user.followedDate}</span>
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row items-center gap-2 flex-shrink-0">
                      <Button
                        variant={followingStates[user.id] ? "secondary" : "default"}
                        size="sm"
                        onClick={() => handleFollowToggle(user.id)}
                        className="text-xs px-3 py-2 w-full sm:w-auto"
                      >
                        {followingStates[user.id] ? (
                          <>
                            <Check className="h-3 w-3 sm:mr-1" />
                            <span className="hidden sm:inline">Following</span>
                          </>
                        ) : (
                          <>
                            <UserPlus className="h-3 w-3 sm:mr-1" />
                            <span className="hidden sm:inline">Follow</span>
                          </>
                        )}
                      </Button>

                      <div className="flex gap-1 sm:gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleMessage(user.username)}
                          className="p-2"
                          title="Message"
                        >
                          <MessageCircle className="h-3 w-3" />
                        </Button>

                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleSendMoney(user.username)}
                          className="p-2"
                          title="Send Money"
                        >
                          <Send className="h-3 w-3" />
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
    </div>
  );
};

export default ProfileFollowers;
