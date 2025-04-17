import { useState } from "react";
import { TabsContent } from "@/components/ui/tabs";
import FooterNav from "@/components/layout/FooterNav";
import SearchBar from "@/components/explore/SearchBar";
import ExploreTabs from "@/components/explore/ExploreTabs";
import TrendingTopics from "@/components/explore/TrendingTopics";
import SuggestedUsers from "@/components/explore/SuggestedUsers";
import PopularHashtags from "@/components/explore/PopularHashtags";
import ExploreGroups from "@/components/explore/ExploreGroups";
import ExplorePages from "@/components/explore/ExplorePages";

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

// Mock groups
const groups = [
  {
    id: "1",
    name: "Web Development Hub",
    members: 254000,
    category: "Technology",
    cover: "https://images.unsplash.com/photo-1556075798-4825dfaaf498?q=80&w=800&auto=format&fit=crop",
  },
  {
    id: "2",
    name: "Crypto Enthusiasts",
    members: 180000,
    category: "Finance",
    cover: "https://images.unsplash.com/photo-1621761191319-c6fb62004040?q=80&w=800&auto=format&fit=crop",
  },
  {
    id: "3",
    name: "Travel Addicts",
    members: 320000,
    category: "Travel",
    cover: "https://images.unsplash.com/photo-1523906921802-b5d2d899e93b?q=80&w=800&auto=format&fit=crop",
  },
  {
    id: "4",
    name: "Foodies United",
    members: 275000,
    category: "Food",
    cover: "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?q=80&w=800&auto=format&fit=crop",
  },
];

// Mock pages
const pages = [
  {
    id: "1",
    name: "National Geographic",
    followers: 50000000,
    category: "Media",
    verified: true,
    avatar: "https://randomuser.me/api/portraits/men/1.jpg",
  },
  {
    id: "2",
    name: "Tesla",
    followers: 15000000,
    category: "Automotive",
    verified: true,
    avatar: "https://randomuser.me/api/portraits/men/2.jpg",
  },
  {
    id: "3",
    name: "NASA",
    followers: 35000000,
    category: "Science",
    verified: true,
    avatar: "https://randomuser.me/api/portraits/men/3.jpg",
  },
  {
    id: "4",
    name: "Netflix",
    followers: 70000000,
    category: "Entertainment",
    verified: true,
    avatar: "https://randomuser.me/api/portraits/men/4.jpg",
  },
];

const Explore = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("trending");
  
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
  
  const filteredGroups = groups.filter(group => 
    group.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    group.category.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  const filteredPages = pages.filter(page => 
    page.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    page.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="container max-w-[680px] pb-16 md:pb-0 pt-4">
      <div className="space-y-4">
        <SearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
        
        <ExploreTabs defaultValue={activeTab} onValueChange={setActiveTab} />
        
        <TabsContent value="trending">
          <TrendingTopics topics={filteredTopics} />
        </TabsContent>
        
        <TabsContent value="people">
          <SuggestedUsers users={filteredUsers} />
        </TabsContent>
        
        <TabsContent value="hashtags">
          <PopularHashtags hashtags={filteredHashtags} />
        </TabsContent>
        
        <TabsContent value="groups">
          <ExploreGroups groups={filteredGroups} />
        </TabsContent>
        
        <TabsContent value="pages">
          <ExplorePages pages={filteredPages} />
        </TabsContent>
      </div>
      
      <FooterNav />
    </div>
  );
};

export default Explore;
