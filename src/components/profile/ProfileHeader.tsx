
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { MapPin, Calendar, MessageCircle, User, Settings, Shield, ChevronRight } from "lucide-react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";

const ProfileHeader = () => {
  const [isFollowing, setIsFollowing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleFollowToggle = () => {
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsFollowing(!isFollowing);
      setIsLoading(false);
      
      toast({
        title: isFollowing ? "Unfollowed" : "Followed",
        description: isFollowing 
          ? "You are no longer following this user" 
          : "You are now following this user",
      });
    }, 1000);
  };

  return (
    <div className="space-y-6">
      <div className="relative">
        {/* Cover Image */}
        <div className="h-48 w-full bg-gradient-to-r from-softchat-primary via-softchat-secondary to-softchat-accent rounded-lg overflow-hidden">
          <div className="absolute bottom-4 right-4">
            <Button variant="secondary" size="sm" className="bg-white/20 backdrop-blur-md border-white/20 text-white">
              <Settings className="mr-2 h-4 w-4" />
              Edit Profile
            </Button>
          </div>
        </div>
        
        {/* Profile Details */}
        <div className="sm:flex sm:items-end sm:space-x-5 px-4 sm:px-6">
          <div className="relative -mt-12 sm:-mt-16 flex">
            <Avatar className="h-24 w-24 ring-4 ring-white sm:h-32 sm:w-32">
              <AvatarImage src="/placeholder.svg" alt="John Doe" />
              <AvatarFallback className="text-lg">JD</AvatarFallback>
            </Avatar>
          </div>
          
          <div className="mt-4 sm:mt-0 sm:flex-1 min-w-0 flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="flex items-center">
                <h1 className="text-xl font-bold">John Doe</h1>
                <Badge variant="default" className="ml-2 px-1.5 py-0.5 bg-softchat-primary hover:bg-softchat-primary/90">
                  <Shield className="mr-1 h-3 w-3" />
                  Verified
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground">@johndoe</p>
              
              <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground">
                <div className="flex items-center">
                  <MapPin className="mr-1 h-4 w-4" />
                  New York, USA
                </div>
                <div className="flex items-center">
                  <Calendar className="mr-1 h-4 w-4" />
                  Joined April 2023
                </div>
              </div>
              
              <div className="mt-3 flex space-x-4">
                <div>
                  <span className="font-semibold">1,248</span>{" "}
                  <span className="text-muted-foreground">Posts</span>
                </div>
                <div>
                  <span className="font-semibold">4,519</span>{" "}
                  <span className="text-muted-foreground">Followers</span>
                </div>
                <div>
                  <span className="font-semibold">892</span>{" "}
                  <span className="text-muted-foreground">Following</span>
                </div>
              </div>
            </div>
            
            <div className="mt-4 sm:mt-0 flex space-x-2">
              <Button 
                onClick={handleFollowToggle}
                disabled={isLoading}
                variant={isFollowing ? "outline" : "default"}
              >
                {isLoading ? "Loading..." : isFollowing ? "Following" : "Follow"}
              </Button>
              <Button variant="outline">
                <MessageCircle className="mr-2 h-4 w-4" />
                Message
              </Button>
            </div>
          </div>
        </div>
      </div>
      
      <div className="px-4 sm:px-6">
        <p className="text-sm">
          Full-stack developer passionate about creating amazing user experiences.
          Cryptocurrency enthusiast and early Web3 adopter. Love to travel and discover new places.
        </p>
      </div>
      
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="h-10 w-10 rounded-full bg-gradient-to-br from-softchat-primary to-softchat-accent flex items-center justify-center">
                <User className="h-5 w-5 text-white" />
              </div>
              <div className="ml-4">
                <div className="text-sm font-medium">Bronze Level</div>
                <div className="text-xs text-muted-foreground">2,450 / 5,000 points</div>
              </div>
            </div>
            <Button variant="ghost" size="sm" className="gap-1">
              View Rewards
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
          <div className="mt-3 h-2 w-full rounded-full bg-muted">
            <div
              className="h-full rounded-full bg-gradient-to-r from-softchat-primary to-softchat-accent"
              style={{ width: "49%" }}
            ></div>
          </div>
        </CardContent>
      </Card>
      
      <Tabs defaultValue="posts">
        <TabsList className="w-full justify-start border-b rounded-none h-auto p-0">
          <TabsTrigger
            value="posts"
            className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:shadow-none py-3 px-4"
          >
            Posts
          </TabsTrigger>
          <TabsTrigger
            value="marketplace"
            className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:shadow-none py-3 px-4"
          >
            Marketplace
          </TabsTrigger>
          <TabsTrigger
            value="crypto"
            className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:shadow-none py-3 px-4"
          >
            Crypto
          </TabsTrigger>
        </TabsList>
      </Tabs>
    </div>
  );
};

export default ProfileHeader;
