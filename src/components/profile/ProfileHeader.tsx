
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Calendar, MapPin, Link, Edit } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/AuthContext";
import { useState } from "react";
import EditProfileModal from "./EditProfileModal";

const ProfileHeader = () => {
  const { user } = useAuth();
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
        
        {/* Edit Profile Button */}
        <Button 
          variant="secondary" 
          size="sm" 
          className="absolute top-4 right-4"
          onClick={() => setIsEditModalOpen(true)}
        >
          <Edit className="h-4 w-4 mr-1" />
          Edit Profile
        </Button>
      </div>
      
      {/* Profile Info */}
      <div className="flex flex-col md:flex-row gap-4 items-start">
        <Avatar className="h-24 w-24 border-4 border-background relative -mt-12 md:-mt-16 ml-4">
          <AvatarImage src={user?.profile?.avatar_url || "/placeholder.svg"} alt={user?.profile?.full_name || "User"} />
          <AvatarFallback className="text-2xl font-bold">
            {user?.profile?.full_name?.substring(0, 2).toUpperCase() || "U"}
          </AvatarFallback>
          
          {user?.profile?.is_verified && (
            <div className="absolute bottom-0 right-0 bg-blue-500 text-white rounded-full p-1 border-2 border-background">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            </div>
          )}
          
          {user?.level && (
            <Badge variant="outline" className="absolute -bottom-2 -right-2 bg-gradient-to-r from-yellow-400 to-yellow-600 text-white border-2 border-background">
              {user.level}
            </Badge>
          )}
        </Avatar>
        
        <div className="flex-1 space-y-3 md:space-y-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold flex items-center gap-2">
              {user?.profile?.full_name || "User"}
              {user?.profile?.is_verified && (
                <Badge variant="outline" className="bg-blue-500">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-white" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </Badge>
              )}
            </h1>
            <p className="text-muted-foreground">@{user?.profile?.username || user?.email?.split('@')[0]}</p>
          </div>
          
          <p className="md:text-lg">
            {user?.profile?.bio || "No bio yet."}
          </p>
          
          <div className="flex flex-wrap gap-3 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <MapPin className="h-4 w-4" />
              <span>San Francisco, CA</span>
            </div>
            <div className="flex items-center gap-1">
              <Link className="h-4 w-4" />
              <a href="#" className="hover:underline text-blue-500">softchat.io/profile</a>
            </div>
            <div className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              <span>Joined April 2023</span>
            </div>
          </div>
          
          <div className="flex gap-6">
            <div>
              <span className="font-bold">256</span> <span className="text-muted-foreground">Following</span>
            </div>
            <div>
              <span className="font-bold">4.2K</span> <span className="text-muted-foreground">Followers</span>
            </div>
            <div>
              <span className="font-bold">{user?.points || 0}</span> <span className="text-muted-foreground">Points</span>
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
