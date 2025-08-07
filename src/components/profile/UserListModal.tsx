import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import {
  Search,
  UserPlus,
  Check,
  Clock,
  Eye,
  MessageCircle,
  Send,
  Users,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useNavigate } from "react-router-dom";

interface User {
  id: string;
  username: string;
  displayName: string;
  avatar: string;
  verified: boolean;
  isFollowing?: boolean;
  followsBack?: boolean;
  isOnline?: boolean;
  lastSeen?: string;
  bio?: string;
  followers?: number;
}

interface UserListModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  type: "followers" | "following" | "viewers";
  users: User[];
  currentUser?: string;
}

const UserListModal: React.FC<UserListModalProps> = ({
  isOpen,
  onClose,
  title,
  type,
  users,
  currentUser,
}) => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredUsers, setFilteredUsers] = useState<User[]>(users);
  const [followingStates, setFollowingStates] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const filtered = users.filter(
      (user) =>
        user.displayName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.username.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredUsers(filtered);
  }, [users, searchQuery]);

  useEffect(() => {
    // Initialize following states
    const states: Record<string, boolean> = {};
    users.forEach((user) => {
      states[user.id] = user.isFollowing || false;
    });
    setFollowingStates(states);
  }, [users]);

  const handleFollowToggle = (userId: string) => {
    setFollowingStates((prev) => ({
      ...prev,
      [userId]: !prev[userId],
    }));
  };

  const handleUserClick = (username: string) => {
    navigate(`/app/profile/${username}`);
    onClose();
  };

  const handleMessage = (username: string) => {
    navigate(`/app/chat?user=${username}`);
    onClose();
  };

  const handleSendMoney = (username: string) => {
    navigate(`/app/wallet?action=send&recipient=${username}`);
    onClose();
  };

  const getIcon = () => {
    switch (type) {
      case "followers":
        return <UserPlus className="h-5 w-5" />;
      case "following":
        return <Users className="h-5 w-5" />;
      case "viewers":
        return <Eye className="h-5 w-5" />;
      default:
        return <Users className="h-5 w-5" />;
    }
  };

  const getEmptyMessage = () => {
    switch (type) {
      case "followers":
        return "No followers yet";
      case "following":
        return "Not following anyone yet";
      case "viewers":
        return "No recent profile views";
      default:
        return "No users found";
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md max-h-[80vh] p-0">
        <DialogHeader className="p-6 pb-4 border-b">
          <DialogTitle className="flex items-center gap-2">
            {getIcon()}
            {title}
            <Badge variant="secondary" className="ml-auto">
              {filteredUsers.length}
            </Badge>
          </DialogTitle>
        </DialogHeader>

        {/* Search */}
        <div className="px-6 pt-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search users..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* User List */}
        <ScrollArea className="flex-1 px-6 pb-6">
          <div className="space-y-3 mt-4">
            {filteredUsers.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  {getIcon()}
                </div>
                <h3 className="text-lg font-medium mb-2">{getEmptyMessage()}</h3>
                <p className="text-muted-foreground text-sm">
                  {searchQuery ? "No users match your search" : "Start connecting with people!"}
                </p>
              </div>
            ) : (
              filteredUsers.map((user) => (
                <div
                  key={user.id}
                  className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  {/* Avatar with online status */}
                  <div className="relative">
                    <Avatar
                      className="h-12 w-12 cursor-pointer"
                      onClick={() => handleUserClick(user.username)}
                    >
                      <AvatarImage src={user.avatar} alt={user.displayName} />
                      <AvatarFallback>
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
                      className="flex items-center gap-2 cursor-pointer"
                      onClick={() => handleUserClick(user.username)}
                    >
                      <span className="font-medium truncate">{user.displayName}</span>
                      {user.verified && (
                        <div className="w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center">
                          <Check className="w-2.5 h-2.5 text-white" />
                        </div>
                      )}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      @{user.username}
                      {user.followsBack && (
                        <Badge variant="secondary" className="ml-2 text-xs">
                          Follows you
                        </Badge>
                      )}
                    </div>
                    {type === "viewers" && user.lastSeen && (
                      <div className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                        <Clock className="h-3 w-3" />
                        Viewed {user.lastSeen}
                      </div>
                    )}
                    {user.bio && (
                      <p className="text-xs text-muted-foreground mt-1 truncate">
                        {user.bio}
                      </p>
                    )}
                    {user.followers && (
                      <p className="text-xs text-muted-foreground mt-1">
                        {user.followers.toLocaleString()} followers
                      </p>
                    )}
                  </div>

                  {/* Action Buttons */}
                  {user.username !== currentUser && (
                    <div className="flex items-center gap-2">
                      {type !== "viewers" && (
                        <Button
                          variant={followingStates[user.id] ? "secondary" : "default"}
                          size="sm"
                          onClick={() => handleFollowToggle(user.id)}
                          className="text-xs"
                        >
                          {followingStates[user.id] ? (
                            <>
                              <Check className="h-3 w-3 mr-1" />
                              Following
                            </>
                          ) : (
                            <>
                              <UserPlus className="h-3 w-3 mr-1" />
                              Follow
                            </>
                          )}
                        </Button>
                      )}
                      
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleMessage(user.username)}
                        className="text-xs"
                      >
                        <MessageCircle className="h-3 w-3" />
                      </Button>
                      
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleSendMoney(user.username)}
                        className="text-xs"
                      >
                        <Send className="h-3 w-3" />
                      </Button>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default UserListModal;
