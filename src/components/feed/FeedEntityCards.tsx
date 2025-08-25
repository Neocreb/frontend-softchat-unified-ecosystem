import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CompactFollowButton } from './FollowButton';
import { 
  Users, 
  MapPin, 
  Globe, 
  Calendar, 
  Shield, 
  Building, 
  Verified,
  Crown,
  Star,
  ExternalLink
} from 'lucide-react';
import { cn } from '@/lib/utils';

// User card for feed
export interface FeedUserCardProps {
  user: {
    id: string;
    name: string;
    username: string;
    avatar: string;
    verified?: boolean;
    isFollowing: boolean;
    followers?: number;
    mutualConnections?: number;
    bio?: string;
    location?: string;
    joinedDate?: string;
    isOnline?: boolean;
  };
  onToggleFollow: (userId: string, currentlyFollowing: boolean) => void;
  className?: string;
}

export const FeedUserCard: React.FC<FeedUserCardProps> = ({ 
  user, 
  onToggleFollow, 
  className 
}) => {
  const navigate = useNavigate();

  const handleProfileClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigate(`/app/profile/${user.username}`);
  };

  const handleFollowToggle = () => {
    onToggleFollow(user.id, user.isFollowing);
  };

  return (
    <Card className={cn("overflow-hidden hover:shadow-md transition-shadow", className)}>
      <CardHeader className="p-4 pb-3">
        <div className="flex items-start gap-3">
          <div className="relative">
            <Avatar
              className="h-12 w-12 cursor-pointer hover:opacity-80 transition-opacity ring-2 ring-white"
              onClick={handleProfileClick}
            >
              <AvatarImage src={user.avatar} alt={user.name} />
              <AvatarFallback className="font-semibold">
                {user.name.substring(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            {user.isOnline && (
              <div className="absolute -bottom-1 -right-1 h-4 w-4 bg-green-500 border-2 border-white rounded-full" />
            )}
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <h3
                className="font-semibold cursor-pointer hover:underline truncate"
                onClick={handleProfileClick}
              >
                {user.name}
              </h3>
              {user.verified && (
                <Badge variant="outline" className="bg-blue-500 border-blue-500 p-0 h-4 w-4">
                  <Verified className="h-2.5 w-2.5 text-white" />
                </Badge>
              )}
            </div>
            
            <p
              className="text-sm text-muted-foreground cursor-pointer hover:underline"
              onClick={handleProfileClick}
            >
              @{user.username}
            </p>
            
            {user.bio && (
              <p className="text-sm text-gray-600 mt-1 line-clamp-2">{user.bio}</p>
            )}
            
            <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
              {user.followers && (
                <span className="flex items-center gap-1">
                  <Users className="h-3 w-3" />
                  {user.followers.toLocaleString()} followers
                </span>
              )}
              {user.mutualConnections && (
                <span>{user.mutualConnections} mutual</span>
              )}
              {user.location && (
                <span className="flex items-center gap-1">
                  <MapPin className="h-3 w-3" />
                  {user.location}
                </span>
              )}
            </div>
          </div>
          
          <CompactFollowButton
            type="user"
            isFollowing={user.isFollowing}
            onToggleFollow={handleFollowToggle}
          />
        </div>
      </CardHeader>
    </Card>
  );
};

// Group card for feed
export interface FeedGroupCardProps {
  group: {
    id: string;
    name: string;
    members: number;
    category: string;
    cover: string;
    description: string;
    privacy: 'public' | 'private';
    location?: string;
    isJoined: boolean;
    isOwner?: boolean;
    isAdmin?: boolean;
    recentActivity?: string;
  };
  onToggleJoin: (groupId: string, currentlyJoined: boolean) => void;
  className?: string;
}

export const FeedGroupCard: React.FC<FeedGroupCardProps> = ({ 
  group, 
  onToggleJoin, 
  className 
}) => {
  const navigate = useNavigate();

  const handleGroupClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigate(`/app/groups/${group.id}`);
  };

  const handleJoinToggle = () => {
    onToggleJoin(group.id, group.isJoined);
  };

  return (
    <Card className={cn("overflow-hidden hover:shadow-md transition-shadow", className)}>
      <div 
        className="h-24 bg-cover bg-center cursor-pointer"
        style={{ backgroundImage: `url(${group.cover})` }}
        onClick={handleGroupClick}
      >
        <div className="h-full bg-black bg-opacity-40 flex items-end p-3">
          <Badge variant="secondary" className="bg-white bg-opacity-90 text-black">
            {group.category}
          </Badge>
        </div>
      </div>
      
      <CardHeader className="p-4 pb-3">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h3
                className="font-semibold cursor-pointer hover:underline truncate"
                onClick={handleGroupClick}
              >
                {group.name}
              </h3>
              {group.privacy === 'private' && (
                <Shield className="h-4 w-4 text-gray-500" />
              )}
              {group.isOwner && (
                <Crown className="h-4 w-4 text-yellow-500" />
              )}
              {group.isAdmin && !group.isOwner && (
                <Star className="h-4 w-4 text-blue-500" />
              )}
            </div>
            
            <div className="flex items-center gap-4 text-xs text-muted-foreground mb-2">
              <span className="flex items-center gap-1">
                <Users className="h-3 w-3" />
                {group.members.toLocaleString()} members
              </span>
              {group.location && (
                <span className="flex items-center gap-1">
                  <MapPin className="h-3 w-3" />
                  {group.location}
                </span>
              )}
            </div>
            
            <p className="text-sm text-gray-600 line-clamp-2">{group.description}</p>
            
            {group.recentActivity && (
              <p className="text-xs text-green-600 mt-2">Recent: {group.recentActivity}</p>
            )}
          </div>
          
          <CompactFollowButton
            type="group"
            isFollowing={group.isJoined}
            onToggleFollow={handleJoinToggle}
          />
        </div>
      </CardHeader>
    </Card>
  );
};

// Page card for feed
export interface FeedPageCardProps {
  page: {
    id: string;
    name: string;
    followers: number;
    category: string;
    verified: boolean;
    avatar: string;
    description: string;
    pageType: 'brand' | 'business' | 'organization' | 'public_figure';
    isFollowing: boolean;
    isOwner?: boolean;
    website?: string;
    location?: string;
    posts?: number;
    engagement?: number;
  };
  onToggleFollow: (pageId: string, currentlyFollowing: boolean) => void;
  className?: string;
}

export const FeedPageCard: React.FC<FeedPageCardProps> = ({ 
  page, 
  onToggleFollow, 
  className 
}) => {
  const navigate = useNavigate();

  const handlePageClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigate(`/app/pages/${page.id}`);
  };

  const handleFollowToggle = () => {
    onToggleFollow(page.id, page.isFollowing);
  };

  const getPageTypeIcon = () => {
    switch (page.pageType) {
      case 'brand':
      case 'business':
        return Building;
      case 'organization':
        return Users;
      case 'public_figure':
        return Star;
      default:
        return Building;
    }
  };

  const PageTypeIcon = getPageTypeIcon();

  return (
    <Card className={cn("overflow-hidden hover:shadow-md transition-shadow", className)}>
      <CardHeader className="p-4 pb-3">
        <div className="flex items-start gap-3">
          <Avatar
            className="h-12 w-12 cursor-pointer hover:opacity-80 transition-opacity"
            onClick={handlePageClick}
          >
            <AvatarImage src={page.avatar} alt={page.name} />
            <AvatarFallback className="font-semibold">
              {page.name.substring(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h3
                className="font-semibold cursor-pointer hover:underline truncate"
                onClick={handlePageClick}
              >
                {page.name}
              </h3>
              {page.verified && (
                <Badge variant="outline" className="bg-blue-500 border-blue-500 p-0 h-4 w-4">
                  <Verified className="h-2.5 w-2.5 text-white" />
                </Badge>
              )}
              <Badge variant="outline" className="text-xs">
                <PageTypeIcon className="h-3 w-3 mr-1" />
                {page.pageType.replace('_', ' ')}
              </Badge>
            </div>
            
            <div className="flex items-center gap-4 text-xs text-muted-foreground mb-2">
              <span className="flex items-center gap-1">
                <Users className="h-3 w-3" />
                {page.followers.toLocaleString()} followers
              </span>
              <span className="capitalize">{page.category}</span>
              {page.location && (
                <span className="flex items-center gap-1">
                  <MapPin className="h-3 w-3" />
                  {page.location}
                </span>
              )}
            </div>
            
            <p className="text-sm text-gray-600 line-clamp-2 mb-2">{page.description}</p>
            
            <div className="flex items-center gap-4 text-xs text-muted-foreground">
              {page.posts && (
                <span>{page.posts.toLocaleString()} posts</span>
              )}
              {page.engagement && (
                <span>{page.engagement}% engagement</span>
              )}
              {page.website && (
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="h-auto p-0 text-blue-600 hover:bg-transparent"
                  onClick={(e) => {
                    e.stopPropagation();
                    window.open(page.website, '_blank');
                  }}
                >
                  <ExternalLink className="h-3 w-3 mr-1" />
                  Website
                </Button>
              )}
            </div>
          </div>
          
          <CompactFollowButton
            type="page"
            isFollowing={page.isFollowing}
            onToggleFollow={handleFollowToggle}
          />
        </div>
      </CardHeader>
    </Card>
  );
};

export default {
  FeedUserCard,
  FeedGroupCard,
  FeedPageCard
};
