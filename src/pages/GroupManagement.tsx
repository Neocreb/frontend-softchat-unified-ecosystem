import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import {
  ArrowLeft,
  Settings,
  Users,
  MessageSquare,
  Calendar,
  BarChart3,
  Shield,
  Crown,
  UserMinus,
  UserPlus,
  Save,
  Eye,
  EyeOff,
  Trash2,
  Globe,
  Lock,
} from "lucide-react";

const GroupManagement = () => {
  const { groupId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [groupSettings, setGroupSettings] = useState({
    name: "Tech Enthusiasts",
    description: "A community for technology enthusiasts to share knowledge and discuss the latest trends in tech.",
    privacy: "public",
    category: "Technology",
    location: "San Francisco, CA",
    rules: [
      "Be respectful to all members",
      "No spam or self-promotion without permission",
      "Share knowledge and help others learn",
      "Keep discussions relevant to Technology",
      "No harassment or offensive content"
    ]
  });

  const [pendingRequests] = useState([
    { id: "1", name: "Alice Johnson", avatar: "https://images.unsplash.com/photo-1494790108755-2616b2bab1d3?w=100", requestedAt: "2024-01-15" },
    { id: "2", name: "Bob Smith", avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100", requestedAt: "2024-01-14" },
  ]);

  const [members] = useState([
    { id: "1", name: "Sarah Chen", avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100", role: "owner", joinedAt: "2023-06-01" },
    { id: "2", name: "Mike Rodriguez", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100", role: "admin", joinedAt: "2023-07-15" },
    { id: "3", name: "Lisa Wong", avatar: "https://images.unsplash.com/photo-1494790108755-2616b2bab1d3?w=100", role: "member", joinedAt: "2023-08-20" },
  ]);

  const handleSaveSettings = () => {
    toast({
      title: "Settings Saved",
      description: "Group settings have been updated successfully!"
    });
  };

  const handleApproveRequest = (requestId: string, userName: string) => {
    toast({
      title: "Request Approved",
      description: `${userName} has been added to the group!`
    });
  };

  const handleRejectRequest = (requestId: string, userName: string) => {
    toast({
      title: "Request Rejected",
      description: `${userName}'s request to join has been rejected.`
    });
  };

  const handleChangeRole = (memberId: string, memberName: string, newRole: string) => {
    toast({
      title: "Role Changed",
      description: `${memberName} is now a ${newRole}.`
    });
  };

  const handleRemoveMember = (memberId: string, memberName: string) => {
    toast({
      title: "Member Removed",
      description: `${memberName} has been removed from the group.`,
      variant: "destructive"
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-6">
        {/* Header */}
        <div className="mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-4">
            <Button
              variant="ghost"
              onClick={() => navigate(`/app/groups/${groupId}`)}
              className="flex items-center gap-2 self-start"
              size="sm"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="hidden sm:inline">Back to Group</span>
              <span className="sm:hidden">Back</span>
            </Button>
            <div className="min-w-0 flex-1">
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold flex items-center gap-2">
                <Settings className="w-6 h-6 sm:w-8 sm:h-8" />
                <span className="truncate">Group Management</span>
              </h1>
              <p className="text-sm sm:text-base text-muted-foreground">
                Manage your group settings, members, and content
              </p>
            </div>
          </div>
        </div>

        <Tabs defaultValue="settings" className="w-full">
          <TabsList className="grid w-full grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 mb-6">
            <TabsTrigger value="settings" className="text-xs sm:text-sm">Settings</TabsTrigger>
            <TabsTrigger value="members" className="text-xs sm:text-sm">Members</TabsTrigger>
            <TabsTrigger value="requests" className="text-xs sm:text-sm lg:inline hidden">Requests</TabsTrigger>
            <TabsTrigger value="content" className="text-xs sm:text-sm">Content</TabsTrigger>
            <TabsTrigger value="analytics" className="text-xs sm:text-sm">Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="settings" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Basic Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="groupName">Group Name</Label>
                  <Input
                    id="groupName"
                    value={groupSettings.name}
                    onChange={(e) => setGroupSettings(prev => ({ ...prev, name: e.target.value }))}
                  />
                </div>
                
                <div>
                  <Label htmlFor="groupDescription">Description</Label>
                  <Textarea
                    id="groupDescription"
                    value={groupSettings.description}
                    onChange={(e) => setGroupSettings(prev => ({ ...prev, description: e.target.value }))}
                    rows={3}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="groupPrivacy">Privacy</Label>
                    <select
                      id="groupPrivacy"
                      value={groupSettings.privacy}
                      onChange={(e) => setGroupSettings(prev => ({ ...prev, privacy: e.target.value }))}
                      className="w-full p-2 border rounded-md"
                    >
                      <option value="public">Public</option>
                      <option value="private">Private</option>
                    </select>
                  </div>

                  <div>
                    <Label htmlFor="groupLocation">Location</Label>
                    <Input
                      id="groupLocation"
                      value={groupSettings.location}
                      onChange={(e) => setGroupSettings(prev => ({ ...prev, location: e.target.value }))}
                    />
                  </div>
                </div>

                <Button onClick={handleSaveSettings}>
                  <Save className="w-4 h-4 mr-2" />
                  Save Settings
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Group Rules</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {groupSettings.rules.map((rule, index) => (
                    <div key={index} className="flex gap-2 text-sm">
                      <span className="font-semibold text-muted-foreground">{index + 1}.</span>
                      <span>{rule}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="members" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Group Members ({members.length})</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {members.map((member) => (
                    <div key={member.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <img
                          src={member.avatar}
                          alt={member.name}
                          className="w-10 h-10 rounded-full"
                        />
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="font-semibold">{member.name}</h4>
                            {member.role === "owner" && (
                              <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
                                <Crown className="w-3 h-3 mr-1" />
                                Owner
                              </Badge>
                            )}
                            {member.role === "admin" && (
                              <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                                <Shield className="w-3 h-3 mr-1" />
                                Admin
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground">
                            Joined {new Date(member.joinedAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      
                      {member.role !== "owner" && (
                        <div className="flex gap-2">
                          <select
                            value={member.role}
                            onChange={(e) => handleChangeRole(member.id, member.name, e.target.value)}
                            className="text-sm border rounded px-2 py-1"
                          >
                            <option value="member">Member</option>
                            <option value="admin">Admin</option>
                          </select>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleRemoveMember(member.id, member.name)}
                          >
                            <UserMinus className="w-4 h-4" />
                          </Button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="requests" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Pending Join Requests ({pendingRequests.length})</CardTitle>
              </CardHeader>
              <CardContent>
                {pendingRequests.length > 0 ? (
                  <div className="space-y-4">
                    {pendingRequests.map((request) => (
                      <div key={request.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center gap-3">
                          <img
                            src={request.avatar}
                            alt={request.name}
                            className="w-10 h-10 rounded-full"
                          />
                          <div>
                            <h4 className="font-semibold">{request.name}</h4>
                            <p className="text-sm text-muted-foreground">
                              Requested {new Date(request.requestedAt).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            onClick={() => handleApproveRequest(request.id, request.name)}
                          >
                            <UserPlus className="w-4 h-4 mr-2" />
                            Approve
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleRejectRequest(request.id, request.name)}
                          >
                            Reject
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Users className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
                    <h3 className="text-lg font-semibold mb-2">No pending requests</h3>
                    <p className="text-muted-foreground">All join requests have been processed.</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="content" className="space-y-6">
            <Alert>
              <MessageSquare className="h-4 w-4" />
              <AlertDescription>
                Content moderation tools allow you to manage posts, comments, and events in your group.
              </AlertDescription>
            </Alert>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Recent Posts</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center">
                    <MessageSquare className="w-12 h-12 mx-auto text-muted-foreground mb-2" />
                    <p className="text-sm text-muted-foreground">15 posts this week</p>
                    <Button variant="outline" size="sm" className="mt-2">
                      <Eye className="w-4 h-4 mr-2" />
                      Review Posts
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Events</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center">
                    <Calendar className="w-12 h-12 mx-auto text-muted-foreground mb-2" />
                    <p className="text-sm text-muted-foreground">3 upcoming events</p>
                    <Button variant="outline" size="sm" className="mt-2">
                      <Eye className="w-4 h-4 mr-2" />
                      Manage Events
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Reported Content</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center">
                    <Shield className="w-12 h-12 mx-auto text-muted-foreground mb-2" />
                    <p className="text-sm text-muted-foreground">0 reports pending</p>
                    <Button variant="outline" size="sm" className="mt-2">
                      <Eye className="w-4 h-4 mr-2" />
                      Review Reports
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Total Members</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-blue-600">1,234</div>
                    <p className="text-sm text-muted-foreground">+15% this month</p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Active Members</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-green-600">892</div>
                    <p className="text-sm text-muted-foreground">72% engagement</p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Posts This Month</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-purple-600">156</div>
                    <p className="text-sm text-muted-foreground">+8% from last month</p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Events Hosted</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-orange-600">12</div>
                    <p className="text-sm text-muted-foreground">This year</p>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Detailed Analytics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <BarChart3 className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Advanced Analytics</h3>
                  <p className="text-muted-foreground mb-4">
                    Get detailed insights about your group's performance and member engagement.
                  </p>
                  <Button>
                    <BarChart3 className="w-4 h-4 mr-2" />
                    View Full Analytics
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default GroupManagement;
