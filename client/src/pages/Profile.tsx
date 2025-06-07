
import { useParams } from "react-router-dom";
import ProfileHeader from "@/components/profile/ProfileHeader";
import ProfileTabs from "@/components/profile/ProfileTabs";
import { useProfile } from "@/hooks/use-profile";
import { Skeleton } from "@/components/ui/skeleton";
import { useState } from "react";

const Profile = () => {
  const { username } = useParams<{ username: string }>();
  const {
    profileUser,
    isLoading,
    isOwnProfile,
    posts,
    products,
    isFollowing,
    followerCount,
    followingCount,
    toggleFollow,
    handleAddToCart,
    handleAddToWishlist,
    handleDeleteProduct,
  } = useProfile({ username });
  
  const [activeTab, setActiveTab] = useState("posts");

  // Loading skeleton
  if (isLoading) {
    return (
      <div className="container py-6 space-y-6">
        <div className="space-y-4">
          <div className="h-40 bg-muted rounded-xl animate-pulse" />
          <div className="flex items-start gap-4">
            <div className="h-24 w-24 rounded-full bg-muted animate-pulse" />
            <div className="space-y-2 flex-1">
              <div className="h-6 w-1/3 bg-muted rounded animate-pulse" />
              <div className="h-4 w-1/2 bg-muted rounded animate-pulse" />
              <div className="h-4 w-3/4 bg-muted rounded animate-pulse" />
            </div>
          </div>
        </div>
        
        <div className="space-y-4">
          <div className="h-10 w-full bg-muted rounded animate-pulse" />
          <div className="grid gap-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-40 bg-muted rounded-lg animate-pulse" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  // If profile not found
  if (!profileUser) {
    return (
      <div className="container py-6">
        <div className="text-center py-12">
          <h1 className="text-2xl font-bold">Profile not found</h1>
          <p className="text-muted-foreground">This user profile does not exist or has been removed.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-6">
      <ProfileHeader 
        profileUser={profileUser} 
        isOwnProfile={isOwnProfile} 
        followerCount={followerCount}
        followingCount={followingCount}
        isFollowing={isFollowing}
        onFollowToggle={toggleFollow}
      />
      
      <div className="mt-6">
        <ProfileTabs
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          posts={posts}
          products={products}
          profileUser={profileUser}
          isOwnProfile={isOwnProfile}
          onAddToCart={handleAddToCart}
          onAddToWishlist={handleAddToWishlist}
          onDeleteProduct={isOwnProfile ? handleDeleteProduct : undefined}
        />
      </div>
    </div>
  );
};

export default Profile;
