
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Search, TrendingUp, Hash, Users } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import FooterNav from "@/components/layout/FooterNav";

// Mock trending topics
const trendingTopics = [
  {
    id: "1",
    name: "AI Revolution",
    posts: 24560,
    category: "Technology",
  },
  {
    id: "2",
    name: "SoftchatToken",
    posts: 18435,
    category: "Crypto",
  },
  {
    id: "3",
    name: "WorldCup2026",
    posts: 15234,
    category: "Sports",
  },
  {
    id: "4",
    name: "ClimateAction",
    posts: 12789,
    category: "Environment",
  },
  {
    id: "5",
    name: "NewMusic",
    posts: 9876,
    category: "Entertainment",
  },
];

// Mock suggested users
const suggestedUsers = [
  {
    id: "1",
    name: "Emma Watson",
    username: "emmawatson",
    avatar: "https://randomuser.me/api/portraits/women/63.jpg",
    bio: "Actress, activist, and book lover",
    verified: true,
    followers: 25800000,
  },
  {
    id: "2",
    name: "Tech Insider",
    username: "techinsider",
    avatar: "https://randomuser.me/api/portraits/men/51.jpg",
    bio: "Breaking tech news and analysis",
    verified: true,
    followers: 5600000,
  },
  {
    id: "3",
    name: "John Green",
    username: "johngreen",
    avatar: "https://randomuser.me/api/portraits/men/37.jpg",
    bio: "Author, educator, and content creator",
    verified: true,
    followers: 4300000,
  },
  {
    id: "4",
    name: "Nature Photography",
    username: "naturepics",
    avatar: "https://randomuser.me/api/portraits/women/21.jpg",
    bio: "Stunning photos from around the world",
    verified: false,
    followers: 2100000,
  },
  {
    id: "5",
    name: "Science Daily",
    username: "sciencedaily",
    avatar: "https://randomuser.me/api/portraits/men/92.jpg",
    bio: "Your daily dose of science news",
    verified: true,
    followers: 3800000,
  },
];

// Mock hashtags
const popularHashtags = [
  { id: "1", tag: "technology", posts: 28500000 },
  { id: "2", tag: "crypto", posts: 15600000 },
  { id: "3", tag: "softchat", posts: 9800000 },
  { id: "4", tag: "nft", posts: 7500000 },
  { id: "5", tag: "motivation", posts: 12400000 },
  { id: "6", tag: "health", posts: 18900000 },
  { id: "7", tag: "success", posts: 10300000 },
  { id: "8", tag: "photography", posts: 22700000 },
  { id: "9", tag: "travel", posts: 25100000 },
  { id: "10", tag: "fitness", posts: 19600000 },
];

const formatNumber = (num: number) => {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + "M";
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + "K";
  }
  return num.toString();
};

const Explore = () => {
  const [searchQuery, setSearchQuery] = useState("");
  
  const filteredTopics = trendingTopics.filter(topic => 
    topic.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    topic.category.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  const filteredUsers = suggestedUsers.filter(user => 
    user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.bio.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  const filteredHashtags = popularHashtags.filter(hashtag => 
    hashtag.tag.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="container pb-16 md:pb-0 pt-4">
      <div className="space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input 
            placeholder="Search for topics, people, or hashtags" 
            className="pl-9 bg-gray-100 border-none rounded-full"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <Tabs defaultValue="trending" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="trending" className="flex items-center gap-1">
              <TrendingUp className="h-4 w-4" />
              <span>Trending</span>
            </TabsTrigger>
            <TabsTrigger value="people" className="flex items-center gap-1">
              <Users className="h-4 w-4" />
              <span>People</span>
            </TabsTrigger>
            <TabsTrigger value="hashtags" className="flex items-center gap-1">
              <Hash className="h-4 w-4" />
              <span>Hashtags</span>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="trending" className="mt-4 space-y-4">
            {filteredTopics.length > 0 ? (
              filteredTopics.map((topic) => (
                <div key={topic.id} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg cursor-pointer">
                  <div>
                    <p className="text-xs text-muted-foreground">{topic.category}</p>
                    <h3 className="font-semibold">#{topic.name}</h3>
                    <p className="text-sm text-muted-foreground">{formatNumber(topic.posts)} posts</p>
                  </div>
                  <TrendingUp className="h-5 w-5 text-muted-foreground" />
                </div>
              ))
            ) : (
              <div className="text-center py-8">
                <p className="text-muted-foreground">No trending topics found</p>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="people" className="mt-4 space-y-4">
            {filteredUsers.length > 0 ? (
              filteredUsers.map((user) => (
                <div key={user.id} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg cursor-pointer">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <Avatar className="h-12 w-12">
                        <AvatarImage src={user.avatar} alt={user.name} />
                        <AvatarFallback>{user.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                      </Avatar>
                      {user.verified && (
                        <div className="absolute bottom-0 right-0 bg-blue-500 text-white rounded-full p-0.5 border-2 border-white">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        </div>
                      )}
                    </div>
                    
                    <div>
                      <div className="flex items-center">
                        <span className="font-semibold">{user.name}</span>
                        {user.verified && (
                          <Badge variant="outline" className="ml-1 bg-blue-500 p-0">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-white" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">@{user.username}</p>
                      <p className="text-xs text-muted-foreground">{formatNumber(user.followers)} followers</p>
                    </div>
                  </div>
                  <button className="text-sm font-semibold text-blue-500">Follow</button>
                </div>
              ))
            ) : (
              <div className="text-center py-8">
                <p className="text-muted-foreground">No users found</p>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="hashtags" className="mt-4">
            <div className="grid grid-cols-2 gap-3">
              {filteredHashtags.length > 0 ? (
                filteredHashtags.map((hashtag) => (
                  <div key={hashtag.id} className="p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100">
                    <h3 className="font-semibold">#{hashtag.tag}</h3>
                    <p className="text-sm text-muted-foreground">{formatNumber(hashtag.posts)} posts</p>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 col-span-2">
                  <p className="text-muted-foreground">No hashtags found</p>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
      
      <FooterNav />
    </div>
  );
};

export default Explore;
