import React, { useState, useEffect } from 'react';
import { 
  Users, 
  MessageSquare, 
  UserPlus, 
  Settings, 
  Clock, 
  CheckCircle, 
  AlertCircle,
  Send,
  Filter,
  Search,
  Star,
  MoreVertical,
  Calendar,
  Target,
  Activity
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAdminWebSocket } from '@/hooks/use-admin-websocket';
import { useAdmin } from '@/contexts/AdminContext';
import { formatDistanceToNow } from 'date-fns';

interface AdminTeam {
  id: string;
  name: string;
  description: string;
  members: TeamMember[];
  lead: string;
  createdAt: string;
  isActive: boolean;
  permissions: string[];
}

interface TeamMember {
  id: string;
  name: string;
  role: string;
  avatar?: string;
  status: 'online' | 'away' | 'busy' | 'offline';
  lastActive: string;
  expertise: string[];
  currentWorkload: number;
}

interface CaseAssignment {
  id: string;
  type: 'moderation' | 'dispute' | 'verification' | 'support' | 'investigation';
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'assigned' | 'in_progress' | 'review' | 'completed' | 'escalated';
  assignedTo: string;
  assignedBy: string;
  teamId?: string;
  dueDate?: string;
  createdAt: string;
  updatedAt: string;
  metadata: Record<string, any>;
}

interface TeamMessage {
  id: string;
  teamId: string;
  senderId: string;
  senderName: string;
  message: string;
  type: 'message' | 'assignment' | 'update' | 'alert';
  timestamp: string;
  mentions?: string[];
  attachments?: any[];
}

export const AdminCollaborationHub: React.FC = () => {
  const [activeTab, setActiveTab] = useState('teams');
  const [teams, setTeams] = useState<AdminTeam[]>([]);
  const [assignments, setAssignments] = useState<CaseAssignment[]>([]);
  const [messages, setMessages] = useState<TeamMessage[]>([]);
  const [selectedTeam, setSelectedTeam] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  const { adminUser } = useAdmin();
  const { sendAlert, onlineAdmins } = useAdminWebSocket();
  
  // Mock data - would be fetched from API
  useEffect(() => {
    const mockTeams: AdminTeam[] = [
      {
        id: 'team-1',
        name: 'Content Moderation',
        description: 'Handles content review and moderation cases',
        lead: 'admin-1',
        createdAt: '2024-01-15T10:00:00Z',
        isActive: true,
        permissions: ['content.moderate', 'content.delete', 'user.warn'],
        members: [
          {
            id: 'admin-1',
            name: 'Sarah Johnson',
            role: 'Senior Moderator',
            status: 'online',
            lastActive: new Date().toISOString(),
            expertise: ['content-moderation', 'policy-enforcement'],
            currentWorkload: 75
          },
          {
            id: 'admin-2',
            name: 'Mike Chen',
            role: 'Moderator',
            status: 'online',
            lastActive: new Date().toISOString(),
            expertise: ['content-moderation', 'user-disputes'],
            currentWorkload: 60
          }
        ]
      },
      {
        id: 'team-2',
        name: 'Financial Operations',
        description: 'Handles payment disputes and financial oversight',
        lead: 'admin-3',
        createdAt: '2024-01-10T10:00:00Z',
        isActive: true,
        permissions: ['finance.view', 'finance.disputes', 'finance.refunds'],
        members: [
          {
            id: 'admin-3',
            name: 'David Wilson',
            role: 'Finance Admin',
            status: 'away',
            lastActive: new Date(Date.now() - 300000).toISOString(),
            expertise: ['financial-analysis', 'fraud-detection'],
            currentWorkload: 40
          }
        ]
      }
    ];
    
    const mockAssignments: CaseAssignment[] = [
      {
        id: 'case-1',
        type: 'moderation',
        title: 'Inappropriate Content Report',
        description: 'Multiple reports for offensive post content',
        priority: 'high',
        status: 'assigned',
        assignedTo: 'admin-1',
        assignedBy: 'admin-0',
        teamId: 'team-1',
        dueDate: new Date(Date.now() + 86400000).toISOString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        metadata: { reportCount: 5, postId: 'post-123' }
      },
      {
        id: 'case-2',
        type: 'dispute',
        title: 'Payment Dispute Resolution',
        description: 'Freelancer claims client refused payment',
        priority: 'medium',
        status: 'in_progress',
        assignedTo: 'admin-3',
        assignedBy: 'admin-0',
        teamId: 'team-2',
        createdAt: new Date(Date.now() - 3600000).toISOString(),
        updatedAt: new Date(Date.now() - 1800000).toISOString(),
        metadata: { amount: 500, projectId: 'proj-456' }
      }
    ];
    
    const mockMessages: TeamMessage[] = [
      {
        id: 'msg-1',
        teamId: 'team-1',
        senderId: 'admin-1',
        senderName: 'Sarah Johnson',
        message: 'Working on the content moderation case. Found multiple policy violations.',
        type: 'message',
        timestamp: new Date(Date.now() - 900000).toISOString()
      },
      {
        id: 'msg-2',
        teamId: 'team-1',
        senderId: 'admin-2',
        senderName: 'Mike Chen',
        message: 'Case-1 has been escalated due to severity.',
        type: 'update',
        timestamp: new Date(Date.now() - 600000).toISOString()
      }
    ];
    
    setTeams(mockTeams);
    setAssignments(mockAssignments);
    setMessages(mockMessages);
    setIsLoading(false);
  }, []);
  
  const getWorkloadColor = (workload: number) => {
    if (workload >= 80) return 'text-red-500';
    if (workload >= 60) return 'text-yellow-500';
    return 'text-green-500';
  };
  
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'bg-red-500';
      case 'high': return 'bg-orange-500';
      case 'medium': return 'bg-yellow-500';
      case 'low': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };
  
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'in_progress': return <Clock className="h-4 w-4 text-blue-500" />;
      case 'escalated': return <AlertCircle className="h-4 w-4 text-red-500" />;
      default: return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Admin Collaboration Hub</h2>
          <p className="text-muted-foreground">Manage teams, assignments, and communication</p>
        </div>
        
        <div className="flex items-center gap-2">
          <CreateTeamDialog />
          <CreateAssignmentDialog teams={teams} />
        </div>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="teams">Teams</TabsTrigger>
          <TabsTrigger value="assignments">Assignments</TabsTrigger>
          <TabsTrigger value="chat">Team Chat</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>
        
        <TabsContent value="teams" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {teams.map((team) => (
              <Card key={team.id} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{team.name}</CardTitle>
                    <Badge variant={team.isActive ? 'default' : 'secondary'}>
                      {team.isActive ? 'Active' : 'Inactive'}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">{team.description}</p>
                </CardHeader>
                
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Members</span>
                      <span className="font-medium">{team.members.length}</span>
                    </div>
                    
                    <div className="space-y-2">
                      {team.members.slice(0, 3).map((member) => (
                        <div key={member.id} className="flex items-center gap-2">
                          <Avatar className="h-6 w-6">
                            <AvatarFallback className="text-xs">
                              {member.name.split(' ').map(n => n[0]).join('')}
                            </AvatarFallback>
                          </Avatar>
                          <span className="text-sm flex-1 truncate">{member.name}</span>
                          <div className={`w-2 h-2 rounded-full ${
                            member.status === 'online' ? 'bg-green-500' :
                            member.status === 'away' ? 'bg-yellow-500' :
                            member.status === 'busy' ? 'bg-red-500' : 'bg-gray-500'
                          }`} />
                        </div>
                      ))}
                      {team.members.length > 3 && (
                        <div className="text-xs text-muted-foreground">
                          +{team.members.length - 3} more
                        </div>
                      )}
                    </div>
                    
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" className="flex-1">
                        View Details
                      </Button>
                      <Button size="sm" onClick={() => setSelectedTeam(team.id)}>
                        Join Chat
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="assignments" className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <Input placeholder="Search assignments..." />
            </div>
            <Select>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="assigned">Assigned</SelectItem>
                <SelectItem value="in_progress">In Progress</SelectItem>
                <SelectItem value="review">Review</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
              </SelectContent>
            </Select>
            <Select>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Priority</SelectItem>
                <SelectItem value="urgent">Urgent</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="low">Low</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-3">
            {assignments.map((assignment) => (
              <Card key={assignment.id}>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        {getStatusIcon(assignment.status)}
                        <h3 className="font-medium">{assignment.title}</h3>
                        <div className={`w-2 h-2 rounded-full ${getPriorityColor(assignment.priority)}`} />
                        <Badge variant="outline" className="text-xs">
                          {assignment.type}
                        </Badge>
                      </div>
                      
                      <p className="text-sm text-muted-foreground mb-3">
                        {assignment.description}
                      </p>
                      
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Users className="h-3 w-3" />
                          Assigned to: {assignment.assignedTo}
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {formatDistanceToNow(new Date(assignment.createdAt), { addSuffix: true })}
                        </div>
                        {assignment.dueDate && (
                          <div className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            Due: {formatDistanceToNow(new Date(assignment.dueDate), { addSuffix: true })}
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Button size="sm" variant="outline">
                        View
                      </Button>
                      {assignment.assignedTo === adminUser?.id && (
                        <Button size="sm">
                          Update
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="chat" className="space-y-4">
          <TeamChatInterface 
            teams={teams}
            messages={messages}
            selectedTeam={selectedTeam}
            onTeamChange={setSelectedTeam}
          />
        </TabsContent>
        
        <TabsContent value="analytics" className="space-y-4">
          <TeamAnalytics teams={teams} assignments={assignments} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

// Create Team Dialog
const CreateTeamDialog: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    permissions: [] as string[]
  });
  
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <UserPlus className="h-4 w-4 mr-2" />
          Create Team
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create New Team</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium">Team Name</label>
            <Input 
              placeholder="Enter team name"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
            />
          </div>
          <div>
            <label className="text-sm font-medium">Description</label>
            <Textarea 
              placeholder="Enter team description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
            />
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button onClick={() => setOpen(false)}>
              Create Team
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

// Create Assignment Dialog
const CreateAssignmentDialog: React.FC<{ teams: AdminTeam[] }> = ({ teams }) => {
  const [open, setOpen] = useState(false);
  
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <Target className="h-4 w-4 mr-2" />
          New Assignment
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create Assignment</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium">Type</label>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="moderation">Moderation</SelectItem>
                <SelectItem value="dispute">Dispute</SelectItem>
                <SelectItem value="verification">Verification</SelectItem>
                <SelectItem value="support">Support</SelectItem>
                <SelectItem value="investigation">Investigation</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="text-sm font-medium">Title</label>
            <Input placeholder="Enter assignment title" />
          </div>
          <div>
            <label className="text-sm font-medium">Description</label>
            <Textarea placeholder="Enter assignment description" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium">Priority</label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="urgent">Urgent</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium">Team</label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select team" />
                </SelectTrigger>
                <SelectContent>
                  {teams.map(team => (
                    <SelectItem key={team.id} value={team.id}>
                      {team.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button onClick={() => setOpen(false)}>
              Create Assignment
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

// Team Chat Interface
const TeamChatInterface: React.FC<{
  teams: AdminTeam[];
  messages: TeamMessage[];
  selectedTeam: string | null;
  onTeamChange: (teamId: string) => void;
}> = ({ teams, messages, selectedTeam, onTeamChange }) => {
  const [newMessage, setNewMessage] = useState('');
  
  const selectedTeamData = teams.find(t => t.id === selectedTeam);
  const teamMessages = messages.filter(m => m.teamId === selectedTeam);
  
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
      <Card className="lg:col-span-1">
        <CardHeader>
          <CardTitle className="text-lg">Teams</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {teams.map(team => (
              <div
                key={team.id}
                className={`p-3 rounded-md cursor-pointer transition-colors ${
                  selectedTeam === team.id ? 'bg-primary text-primary-foreground' : 'hover:bg-muted'
                }`}
                onClick={() => onTeamChange(team.id)}
              >
                <div className="font-medium">{team.name}</div>
                <div className="text-xs opacity-70">{team.members.length} members</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
      
      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle className="text-lg">
            {selectedTeamData ? selectedTeamData.name : 'Select a team'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {selectedTeam ? (
            <div className="space-y-4">
              <ScrollArea className="h-64 border rounded-md p-4">
                <div className="space-y-3">
                  {teamMessages.map(message => (
                    <div key={message.id} className="flex gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback className="text-xs">
                          {message.senderName.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-medium text-sm">{message.senderName}</span>
                          <span className="text-xs text-muted-foreground">
                            {formatDistanceToNow(new Date(message.timestamp), { addSuffix: true })}
                          </span>
                          {message.type !== 'message' && (
                            <Badge variant="secondary" className="text-xs">
                              {message.type}
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm">{message.message}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
              
              <div className="flex gap-2">
                <Input
                  placeholder="Type a message..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      // Handle send message
                      setNewMessage('');
                    }
                  }}
                />
                <Button size="sm">
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ) : (
            <div className="text-center text-muted-foreground py-8">
              Select a team to start chatting
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

// Team Analytics
const TeamAnalytics: React.FC<{
  teams: AdminTeam[];
  assignments: CaseAssignment[];
}> = ({ teams, assignments }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Total Teams</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{teams.length}</div>
          <p className="text-xs text-muted-foreground">
            {teams.filter(t => t.isActive).length} active
          </p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Active Assignments</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {assignments.filter(a => a.status !== 'completed').length}
          </div>
          <p className="text-xs text-muted-foreground">
            {assignments.filter(a => a.priority === 'urgent').length} urgent
          </p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Team Members</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {teams.reduce((acc, team) => acc + team.members.length, 0)}
          </div>
          <p className="text-xs text-muted-foreground">
            Across all teams
          </p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Completion Rate</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {Math.round((assignments.filter(a => a.status === 'completed').length / assignments.length) * 100)}%
          </div>
          <p className="text-xs text-muted-foreground">
            This week
          </p>
        </CardContent>
      </Card>
    </div>
  );
};
