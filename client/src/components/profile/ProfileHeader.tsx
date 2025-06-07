
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Calendar, MapPin, Link, Edit, UserPlus, UserMinus, Check } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import EditProfileModal from "./EditProfileModal";
import { ExtendedUser } from "@/types/user";

interface ProfileHeaderProps {
  profileUser: ExtendedUser;
  isOwnProfile: boolean;
  followerCount: number;
  followingCount: number;
  isFollowing: boolean;
  onFollowToggle: () => void;
}

const ProfileHeader = ({ 
  profileUser, 
  isOwnProfile, 
  followerCount, 
  followingCount,
  isFollowing,
  onFollowToggle
}: ProfileHeaderProps) => {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  return (
    <div className="space-y-6">
      {/* Cover Image */}
      <div className="h-40 md:h-60 bg-gradient-to-r from-blue-400 to-purple-500 rounded-xl overflow-hidden relative">
        <img
          src="https://images.unsplash.com/photo-1579546929518-9e396f3cc809?q=80&w=1920&auto=format&fit=crop"
          alt="Cover"
          className="w-full h-full object-cover opacity-75"
        />
        
        {/* Edit Profile Button - Only visible if viewing own profile */}
        {isOwnProfile && (
          <Button 
            variant="secondary" 
            size="sm" 
            className="absolute top-4 right-4"
            onClick={() => setIsEditModalOpen(true)}
          >
            <Edit className="h-4 w-4 mr-1" />
            Edit Profile
          </Button>
        )}

        {/* Follow Button - Only visible if viewing other profile */}
        {!isOwnProfile && (
          <Button 
            variant={isFollowing ? "outline" : "secondary"} 
            size="sm" 
            className="absolute top-4 right-4"
            onClick={onFollowToggle}
          >
            {isFollowing ? (
              <>
                <UserMinus className="h-4 w-4 mr-1" />
                Unfollow
              </>
            ) : (
              <>
                <UserPlus className="h-4 w-4 mr-1" />
                Follow
              </>
            )}
          </Button>
        )}
      </div>
      
      {/* Profile Info */}
      <div className="flex flex-col md:flex-row gap-4 items-start">
        <Avatar className="h-24 w-24 border-4 border-background relative -mt-12 md:-mt-16 ml-4">
          <AvatarImage src={profileUser?.profile?.avatar_url || "/placeholder.svg"} alt={profileUser?.profile?.full_name || "User"} />
          <AvatarFallback className="text-2xl font-bold">
            {profileUser?.profile?.full_name?.substring(0, 2).toUpperCase() || "U"}
          </AvatarFallback>
          
          {profileUser?.profile?.is_verified && (
            <div className="absolute bottom-0 right-0 bg-blue-500 text-white rounded-full p-1 border-2 border-background">
              <Check className="h-3 w-3" />
            </div>
          )}
          
          {profileUser?.level && (
            <Badge variant="outline" className="absolute -bottom-2 -right-2 bg-gradient-to-r from-yellow-400 to-yellow-600 text-white border-2 border-background">
              {profileUser.level}
            </Badge>
          )}
        </Avatar>
        
        <div className="flex-1 space-y-3 md:space-y-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold flex items-center gap-2">
              {profileUser?.profile?.full_name || "User"}
              {profileUser?.profile?.is_verified && (
                <Badge variant="outline" className="bg-blue-500">
                  <Check className="h-3 w-3 text-white" />
                </Badge>
              )}
            </h1>
            <p className="text-muted-foreground">@{profileUser?.profile?.username || profileUser?.email?.split('@')[0]}</p>
          </div>
          
          <p className="md:text-lg">
            {profileUser?.profile?.bio || "No bio yet."}
          </p>
          
          <div className="flex flex-wrap gap-3 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              <span>Joined {new Date(profileUser.created_at || Date.now()).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</span>
            </div>
          </div>
          
          <div className="flex gap-6">
            <div>
              <span className="font-bold">{followingCount}</span> <span className="text-muted-foreground">Following</span>
            </div>
            <div>
              <span className="font-bold">{followerCount}</span> <span className="text-muted-foreground">Followers</span>
            </div>
            <div>
              <span className="font-bold">{profileUser?.points || 0}</span> <span className="text-muted-foreground">Points</span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Edit Profile Modal */}
      <EditProfileModal open={isEditModalOpen} onOpenChange={setIsEditModalOpen} />
    </div>
  );
};

export default ProfileHeader;
