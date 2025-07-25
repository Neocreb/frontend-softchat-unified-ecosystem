import { useState, useEffect } from "react";
import { formatNumber } from "@/utils/formatters";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import EnhancedPostCard from "@/components/feed/EnhancedPostCard";
import { Post } from "@/types/post";
import { 
  Plus, 
  Users, 
  Settings, 
  Crown, 
  UserPlus, 
  MessageSquare, 
  Calendar,
  MapPin,
  Globe,
  Lock,
  Shield,
  Eye,
  UserMinus,
  Ban,
  Edit
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Group {
  id: string;
  name: string;
  members: number;
  category: string;
  cover: string;
  description?: string;
  privacy: 'public' | 'private';
  isJoined?: boolean;
  isOwner?: boolean;
  isAdmin?: boolean;
  location?: string;
  createdAt?: string;
}

interface GroupPost extends Post {
  groupId: string;
  groupName: string;
  groupAvatar: string;
}

interface ExploreGroupsProps {
  groups: Group[];
}

const ExploreGroups = ({ groups }: ExploreGroupsProps) => {
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showManageDialog, setShowManageDialog] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState<Group | null>(null);
  const [activeTab, setActiveTab] = useState("posts");
  const [joinedGroups, setJoinedGroups] = useState<Group[]>([]);
  const [myGroups, setMyGroups] = useState<Group[]>([]);
  const [groupPosts, setGroupPosts] = useState<GroupPost[]>([]);
  const [loading, setLoading] = useState(false);
  const [groupForm, setGroupForm] = useState({
    name: '',
    description: '',
    category: '',
    privacy: 'public',
    location: '',
    cover: ''
  });
  const { toast } = useToast();

  // Mock user groups data
  const mockJoinedGroups: Group[] = [
    {
      id: 'joined-1',
      name: 'Tech Enthusiasts',
      members: 15420,
      category: 'Technology',
      cover: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=400',
      isJoined: true,
      description: 'Discussion about latest tech trends'
    },
    {
      id: 'joined-2',
      name: 'Crypto Traders',
      members: 8340,
      category: 'Finance',
      cover: 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=400',
      isJoined: true,
      description: 'Cryptocurrency trading strategies and tips'
    }
  ];

  const mockMyGroups: Group[] = [
    {
      id: 'my-1',
      name: 'Web3 Developers',
      members: 2350,
      category: 'Technology',
      cover: 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=400',
      isOwner: true,
      description: 'Building the future of web3'
    }
  ];

  // Load group posts on component mount
  useEffect(() => {
    loadGroupPosts();
  }, []);

  const loadGroupPosts = async () => {
    setLoading(true);

    // Mock group posts data - in real app, this would come from API
    const mockGroupPosts: GroupPost[] = [
      {
        id: "group-post-1",
        author: {
          name: "Alex Chen",
          username: "alexchen",
          avatar: "https://randomuser.me/api/portraits/men/1.jpg",
          verified: false
        },
        content: "Just deployed my first dApp on Ethereum! The future of decentralized applications is here. Who else is building on web3? 🚀",
        image: "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=500",
        createdAt: "2 hours ago",
        likes: 45,
        comments: 12,
        shares: 8,
        liked: false,
        groupId: "joined-1",
        groupName: "Tech Enthusiasts",
        groupAvatar: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=100"
      },
      {
        id: "group-post-2",
        author: {
          name: "Sarah Williams",
          username: "sarahw",
          avatar: "https://randomuser.me/api/portraits/women/2.jpg",
          verified: true
        },
        content: "Bitcoin hits new resistance level. Technical analysis suggests a potential breakout incoming. What are your thoughts on the current market trend? 📈",
        createdAt: "4 hours ago",
        likes: 78,
        comments: 23,
        shares: 15,
        liked: true,
        groupId: "joined-2",
        groupName: "Crypto Traders",
        groupAvatar: "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=100"
      },
      {
        id: "group-post-3",
        author: {
          name: "Mike Johnson",
          username: "mikej",
          avatar: "https://randomuser.me/api/portraits/men/3.jpg",
          verified: false
        },
        content: "Amazing conference today! Learned so much about the latest ML algorithms and their real-world applications. The AI revolution is accelerating faster than ever.",
        image: "https://images.unsplash.com/photo-1555255707-c07966088b7b?w=500",
        createdAt: "6 hours ago",
        likes: 34,
        comments: 7,
        shares: 4,
        liked: false,
        groupId: "1",
        groupName: "Web Development Hub",
        groupAvatar: "https://images.unsplash.com/photo-1556075798-4825dfaaf498?w=100"
      },
      {
        id: "group-post-4",
        author: {
          name: "Emma Davis",
          username: "emmad",
          avatar: "https://randomuser.me/api/portraits/women/4.jpg",
          verified: false
        },
        content: "Check out this amazing traditional recipe I tried from my grandmother's cookbook! The flavors are absolutely incredible. Food truly brings people together ❤️",
        image: "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=500",
        createdAt: "8 hours ago",
        likes: 67,
        comments: 18,
        shares: 12,
        liked: true,
        groupId: "joined-4",
        groupName: "Foodies United",
        groupAvatar: "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=100"
      }
    ];

    // Sort posts: prioritize joined groups first, then by engagement
    const joinedGroupIds = [...mockJoinedGroups, ...joinedGroups].map(g => g.id);
    const sortedPosts = mockGroupPosts.sort((a, b) => {
      const aIsJoined = joinedGroupIds.includes(a.groupId);
      const bIsJoined = joinedGroupIds.includes(b.groupId);

      if (aIsJoined && !bIsJoined) return -1;
      if (!aIsJoined && bIsJoined) return 1;

      // If both are joined or both are not joined, sort by engagement
      return (b.likes + b.comments + b.shares) - (a.likes + a.comments + a.shares);
    });

    setGroupPosts(sortedPosts);
    setLoading(false);
  };

  const handleCreateGroup = () => {
    if (!groupForm.name || !groupForm.category) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    const newGroup: Group = {
      id: `group-${Date.now()}`,
      name: groupForm.name,
      description: groupForm.description,
      category: groupForm.category,
      privacy: groupForm.privacy as 'public' | 'private',
      location: groupForm.location,
      cover: groupForm.cover || 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=400',
      members: 1,
      isOwner: true
    };

    setMyGroups(prev => [...prev, newGroup]);
    setGroupForm({
      name: '',
      description: '',
      category: '',
      privacy: 'public',
      location: '',
      cover: ''
    });
    setShowCreateDialog(false);

    toast({
      title: "Group Created",
      description: `${newGroup.name} has been created successfully!`
    });
  };

  const handleJoinGroup = (group: Group) => {
    if (group.isJoined) return;

    const updatedGroup = { ...group, isJoined: true };
    setJoinedGroups(prev => [...prev, updatedGroup]);

    toast({
      title: "Joined Group",
      description: `You've successfully joined ${group.name}!`
    });
  };

  const handleLeaveGroup = (groupId: string) => {
    setJoinedGroups(prev => prev.filter(g => g.id !== groupId));
    toast({
      title: "Left Group",
      description: "You've left the group successfully"
    });
  };

  const categories = [
    'Technology', 'Finance', 'Gaming', 'Art & Design', 'Music', 
    'Sports', 'Education', 'Travel', 'Food', 'Health & Fitness'
  ];

  const renderGroupCard = (group: Group, showManageButton = false) => (
    <Card key={group.id} className="overflow-hidden hover:shadow-md transition-shadow">
      <div className="h-32 overflow-hidden relative">
        <img src={group.cover} alt={group.name} className="w-full h-full object-cover" />
        <div className="absolute top-2 left-2 flex gap-1">
          {group.privacy === 'private' && (
            <Badge variant="secondary" className="bg-gray-800 text-white">
              <Lock className="w-3 h-3 mr-1" />
              Private
            </Badge>
          )}
          {group.isOwner && (
            <Badge variant="secondary" className="bg-yellow-600 text-white">
              <Crown className="w-3 h-3 mr-1" />
              Owner
            </Badge>
          )}
          {group.isAdmin && (
            <Badge variant="secondary" className="bg-blue-600 text-white">
              <Shield className="w-3 h-3 mr-1" />
              Admin
            </Badge>
          )}
        </div>
      </div>
      <CardContent className="p-3">
        <div className="space-y-2">
          <div>
            <h3 className="font-semibold text-sm md:text-base">{group.name}</h3>
            <p className="text-xs text-muted-foreground">
              {group.category} • {formatNumber(group.members)} members
            </p>
          </div>
          
          {group.description && (
            <p className="text-xs text-muted-foreground line-clamp-2">
              {group.description}
            </p>
          )}
          
          {group.location && (
            <div className="flex items-center text-xs text-muted-foreground">
              <MapPin className="w-3 h-3 mr-1" />
              {group.location}
            </div>
          )}

          <div className="flex gap-2">
            {!group.isJoined && !group.isOwner ? (
              <Button 
                onClick={() => handleJoinGroup(group)}
                size="sm" 
                className="flex-1 text-xs"
              >
                <UserPlus className="w-3 h-3 mr-1" />
                Join Group
              </Button>
            ) : group.isJoined ? (
              <div className="flex gap-1 flex-1">
                <Button size="sm" variant="outline" className="flex-1 text-xs">
                  <MessageSquare className="w-3 h-3 mr-1" />
                  View
                </Button>
                <Button 
                  size="sm" 
                  variant="outline" 
                  onClick={() => handleLeaveGroup(group.id)}
                  className="text-xs"
                >
                  <UserMinus className="w-3 h-3" />
                </Button>
              </div>
            ) : null}
            
            {showManageButton && (group.isOwner || group.isAdmin) && (
              <Button 
                size="sm" 
                variant="outline"
                onClick={() => {
                  setSelectedGroup(group);
                  setShowManageDialog(true);
                }}
                className="text-xs"
              >
                <Settings className="w-3 h-3" />
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-4">
      {/* Header with Create Button */}
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold">Groups</h2>
        <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
          <DialogTrigger asChild>
            <Button size="sm">
              <Plus className="w-4 h-4 mr-1" />
              Create Group
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Create New Group</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="groupName">Group Name *</Label>
                <Input
                  id="groupName"
                  value={groupForm.name}
                  onChange={(e) => setGroupForm(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Enter group name"
                />
              </div>
              
              <div>
                <Label htmlFor="groupDescription">Description</Label>
                <Textarea
                  id="groupDescription"
                  value={groupForm.description}
                  onChange={(e) => setGroupForm(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Describe your group"
                  rows={3}
                />
              </div>
              
              <div>
                <Label htmlFor="groupCategory">Category *</Label>
                <Select 
                  value={groupForm.category} 
                  onValueChange={(value) => setGroupForm(prev => ({ ...prev, category: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map(cat => (
                      <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="groupPrivacy">Privacy</Label>
                <Select 
                  value={groupForm.privacy} 
                  onValueChange={(value) => setGroupForm(prev => ({ ...prev, privacy: value }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="public">
                      <div className="flex items-center">
                        <Globe className="w-4 h-4 mr-2" />
                        Public - Anyone can join
                      </div>
                    </SelectItem>
                    <SelectItem value="private">
                      <div className="flex items-center">
                        <Lock className="w-4 h-4 mr-2" />
                        Private - Invite only
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="groupLocation">Location (Optional)</Label>
                <Input
                  id="groupLocation"
                  value={groupForm.location}
                  onChange={(e) => setGroupForm(prev => ({ ...prev, location: e.target.value }))}
                  placeholder="City, Country"
                />
              </div>
              
              <div className="flex gap-2">
                <Button onClick={handleCreateGroup} className="flex-1">
                  Create Group
                </Button>
                <Button variant="outline" onClick={() => setShowCreateDialog(false)}>
                  Cancel
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Group Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="posts">Posts</TabsTrigger>
          <TabsTrigger value="discover">Discover</TabsTrigger>
          <TabsTrigger value="joined">My Groups</TabsTrigger>
          <TabsTrigger value="owned">Created</TabsTrigger>
        </TabsList>

        <TabsContent value="posts" className="space-y-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-semibold">Posts from Groups</h3>
              {groupPosts.length > 0 && (
                <Badge variant="secondary" className="text-xs">
                  {groupPosts.length} posts
                </Badge>
              )}
            </div>
            <div className="text-sm text-muted-foreground">
              Showing posts from your joined groups first
            </div>
          </div>

          {loading ? (
            <div className="space-y-4">
              {Array.from({ length: 3 }).map((_, i) => (
                <Card key={i} className="animate-pulse">
                  <CardContent className="p-4">
                    <div className="flex gap-3">
                      <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
                      <div className="flex-1 space-y-2">
                        <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                        <div className="h-32 bg-gray-200 rounded"></div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : groupPosts.length > 0 ? (
            <div className="space-y-4">
              {groupPosts.map((post) => (
                <div key={post.id} className="space-y-2">
                  {/* Group context header */}
                  <div className="flex items-center gap-2 text-sm text-muted-foreground px-2">
                    <Avatar className="h-5 w-5">
                      <AvatarImage src={post.groupAvatar} alt={post.groupName} />
                      <AvatarFallback>{post.groupName.substring(0, 2).toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <span>Posted in</span>
                    <span className="font-semibold text-primary">{post.groupName}</span>
                    {[...mockJoinedGroups, ...joinedGroups].some(g => g.id === post.groupId) && (
                      <Badge variant="secondary" className="text-xs">Joined</Badge>
                    )}
                  </div>
                  <EnhancedPostCard post={post} />
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <Users className="w-12 h-12 mx-auto text-muted-foreground mb-2" />
              <p className="text-muted-foreground mb-2">No group posts found</p>
              <p className="text-sm text-muted-foreground mb-4">
                Join some groups to see posts from communities you're interested in
              </p>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setActiveTab("discover")}
              >
                Discover Groups
              </Button>
            </div>
          )}
        </TabsContent>

        <TabsContent value="discover" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {groups.length > 0 ? (
              groups.map((group) => renderGroupCard(group))
            ) : (
              <div className="col-span-full text-center py-8">
                <Users className="w-12 h-12 mx-auto text-muted-foreground mb-2" />
                <p className="text-muted-foreground">No groups found</p>
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="joined" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...joinedGroups, ...mockJoinedGroups].length > 0 ? (
              [...joinedGroups, ...mockJoinedGroups].map((group) => renderGroupCard(group, true))
            ) : (
              <div className="col-span-full text-center py-8">
                <Users className="w-12 h-12 mx-auto text-muted-foreground mb-2" />
                <p className="text-muted-foreground">You haven't joined any groups yet</p>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="mt-2"
                  onClick={() => setActiveTab("discover")}
                >
                  Discover Groups
                </Button>
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="owned" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...myGroups, ...mockMyGroups].length > 0 ? (
              [...myGroups, ...mockMyGroups].map((group) => renderGroupCard(group, true))
            ) : (
              <div className="col-span-full text-center py-8">
                <Users className="w-12 h-12 mx-auto text-muted-foreground mb-2" />
                <p className="text-muted-foreground">You haven't created any groups yet</p>
                <Button 
                  size="sm" 
                  onClick={() => setShowCreateDialog(true)}
                  className="mt-2"
                >
                  <Plus className="w-4 h-4 mr-1" />
                  Create Your First Group
                </Button>
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>

      {/* Group Management Dialog */}
      <Dialog open={showManageDialog} onOpenChange={setShowManageDialog}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Manage {selectedGroup?.name}</DialogTitle>
          </DialogHeader>
          {selectedGroup && (
            <Tabs defaultValue="overview" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="members">Members</TabsTrigger>
                <TabsTrigger value="settings">Settings</TabsTrigger>
                <TabsTrigger value="analytics">Analytics</TabsTrigger>
              </TabsList>
              
              <TabsContent value="overview" className="space-y-4">
                <div className="space-y-2">
                  <h3 className="font-medium">Group Statistics</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <Card className="p-4">
                      <div className="text-2xl font-bold">{formatNumber(selectedGroup.members)}</div>
                      <p className="text-sm text-muted-foreground">Total Members</p>
                    </Card>
                    <Card className="p-4">
                      <div className="text-2xl font-bold">156</div>
                      <p className="text-sm text-muted-foreground">Posts This Week</p>
                    </Card>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="members" className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="font-medium">Members ({selectedGroup.members})</h3>
                  <Button size="sm">
                    <UserPlus className="w-4 h-4 mr-1" />
                    Invite Members
                  </Button>
                </div>
                <div className="space-y-2">
                  {/* Mock member list */}
                  {[1, 2, 3].map(i => (
                    <div key={i} className="flex items-center justify-between p-2 border rounded">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
                        <div>
                          <p className="font-medium text-sm">User {i}</p>
                          <p className="text-xs text-muted-foreground">Member</p>
                        </div>
                      </div>
                      <div className="flex gap-1">
                        <Button size="sm" variant="outline">
                          <Shield className="w-3 h-3" />
                        </Button>
                        <Button size="sm" variant="outline">
                          <Ban className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </TabsContent>
              
              <TabsContent value="settings" className="space-y-4">
                <div className="space-y-4">
                  <div>
                    <Label>Group Name</Label>
                    <Input defaultValue={selectedGroup.name} />
                  </div>
                  <div>
                    <Label>Description</Label>
                    <Textarea defaultValue={selectedGroup.description} rows={3} />
                  </div>
                  <div className="flex gap-2">
                    <Button>Save Changes</Button>
                    <Button variant="outline">Cancel</Button>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="analytics" className="space-y-4">
                <div className="text-center py-8">
                  <BarChart3 className="w-12 h-12 mx-auto text-muted-foreground mb-2" />
                  <p className="text-muted-foreground">Analytics dashboard coming soon</p>
                </div>
              </TabsContent>
            </Tabs>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ExploreGroups;
