import React, { useState, useEffect } from 'react';
import { 
  TrendingUp, 
  Users, 
  Clock, 
  Target, 
  Award, 
  Activity,
  CheckCircle,
  AlertTriangle,
  Calendar,
  Download,
  Filter,
  BarChart3,
  PieChart,
  LineChart,
  Settings,
  Star,
  Zap,
  Crown,
  Trophy
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DatePickerWithRange } from '@/components/ui/date-picker';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  ResponsiveContainer, 
  LineChart as RechartsLineChart, 
  Line, 
  AreaChart, 
  Area, 
  BarChart, 
  Bar, 
  PieChart as RechartsPieChart, 
  Cell, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend,
  RadialBarChart,
  RadialBar
} from 'recharts';
import { formatDistanceToNow, format, subDays, subWeeks, subMonths } from 'date-fns';

interface AdminPerformanceMetric {
  adminId: string;
  adminName: string;
  role: string;
  avatar?: string;
  metrics: {
    tasksCompleted: number;
    avgResponseTime: number; // in minutes
    accuracyRate: number; // percentage
    userSatisfaction: number; // rating out of 5
    activeHours: number;
    escalations: number;
    resolutionRate: number; // percentage
  };
  trends: {
    tasksCompletedTrend: number; // percentage change
    responseTimeTrend: number;
    accuracyTrend: number;
    satisfactionTrend: number;
  };
  achievements: string[];
  lastActive: string;
}

interface TeamMetric {
  teamId: string;
  teamName: string;
  memberCount: number;
  metrics: {
    totalTasks: number;
    completionRate: number;
    avgResponseTime: number;
    teamSatisfaction: number;
    collaborationScore: number;
  };
  performance: 'excellent' | 'good' | 'average' | 'needs_improvement';
}

interface ActivityTrend {
  date: string;
  tasks: number;
  responseTime: number;
  satisfaction: number;
  accuracy: number;
}

export const AdminPerformanceAnalytics: React.FC = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('7d');
  const [selectedMetric, setSelectedMetric] = useState('tasks');
  const [adminMetrics, setAdminMetrics] = useState<AdminPerformanceMetric[]>([]);
  const [teamMetrics, setTeamMetrics] = useState<TeamMetric[]>([]);
  const [activityTrends, setActivityTrends] = useState<ActivityTrend[]>([]);
  const [activeTab, setActiveTab] = useState('overview');
  
  // Mock data - would be fetched from API
  useEffect(() => {
    const mockAdminMetrics: AdminPerformanceMetric[] = [
      {
        adminId: 'admin-1',
        adminName: 'Sarah Johnson',
        role: 'Super Admin',
        metrics: {
          tasksCompleted: 156,
          avgResponseTime: 12,
          accuracyRate: 96,
          userSatisfaction: 4.8,
          activeHours: 42,
          escalations: 3,
          resolutionRate: 94
        },
        trends: {
          tasksCompletedTrend: 15,
          responseTimeTrend: -8,
          accuracyTrend: 2,
          satisfactionTrend: 0.3
        },
        achievements: ['speed_demon', 'accuracy_expert', 'user_favorite'],
        lastActive: new Date(Date.now() - 300000).toISOString()
      },
      {
        adminId: 'admin-2',
        adminName: 'Mike Chen',
        role: 'Content Moderator',
        metrics: {
          tasksCompleted: 234,
          avgResponseTime: 8,
          accuracyRate: 92,
          userSatisfaction: 4.6,
          activeHours: 38,
          escalations: 7,
          resolutionRate: 89
        },
        trends: {
          tasksCompletedTrend: 23,
          responseTimeTrend: -12,
          accuracyTrend: -1,
          satisfactionTrend: 0.1
        },
        achievements: ['volume_champion', 'fast_responder'],
        lastActive: new Date(Date.now() - 600000).toISOString()
      },
      {
        adminId: 'admin-3',
        adminName: 'Emily Davis',
        role: 'Finance Admin',
        metrics: {
          tasksCompleted: 89,
          avgResponseTime: 15,
          accuracyRate: 98,
          userSatisfaction: 4.9,
          activeHours: 35,
          escalations: 1,
          resolutionRate: 97
        },
        trends: {
          tasksCompletedTrend: 5,
          responseTimeTrend: 2,
          accuracyTrend: 1,
          satisfactionTrend: 0.2
        },
        achievements: ['accuracy_expert', 'user_favorite', 'quality_assurance'],
        lastActive: new Date(Date.now() - 900000).toISOString()
      }
    ];
    
    const mockTeamMetrics: TeamMetric[] = [
      {
        teamId: 'team-1',
        teamName: 'Content Moderation',
        memberCount: 8,
        metrics: {
          totalTasks: 892,
          completionRate: 94,
          avgResponseTime: 10,
          teamSatisfaction: 4.7,
          collaborationScore: 88
        },
        performance: 'excellent'
      },
      {
        teamId: 'team-2',
        teamName: 'Customer Support',
        memberCount: 12,
        metrics: {
          totalTasks: 1456,
          completionRate: 91,
          avgResponseTime: 15,
          teamSatisfaction: 4.5,
          collaborationScore: 82
        },
        performance: 'good'
      },
      {
        teamId: 'team-3',
        teamName: 'Financial Operations',
        memberCount: 4,
        metrics: {
          totalTasks: 324,
          completionRate: 97,
          avgResponseTime: 18,
          teamSatisfaction: 4.8,
          collaborationScore: 92
        },
        performance: 'excellent'
      }
    ];
    
    // Generate mock activity trends
    const mockActivityTrends: ActivityTrend[] = Array.from({ length: 30 }, (_, i) => {
      const date = subDays(new Date(), 29 - i);
      return {
        date: format(date, 'MMM dd'),
        tasks: Math.floor(Math.random() * 50) + 100,
        responseTime: Math.floor(Math.random() * 10) + 8,
        satisfaction: Math.random() * 0.5 + 4.5,
        accuracy: Math.random() * 5 + 92
      };
    });
    
    setAdminMetrics(mockAdminMetrics);
    setTeamMetrics(mockTeamMetrics);
    setActivityTrends(mockActivityTrends);
  }, [selectedPeriod]);
  
  const getPerformanceColor = (performance: string) => {
    switch (performance) {
      case 'excellent': return 'text-green-600 bg-green-50';
      case 'good': return 'text-blue-600 bg-blue-50';
      case 'average': return 'text-yellow-600 bg-yellow-50';
      case 'needs_improvement': return 'text-red-600 bg-red-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };
  
  const getAchievementIcon = (achievement: string) => {
    switch (achievement) {
      case 'speed_demon': return <Zap className="h-4 w-4 text-yellow-500" />;
      case 'accuracy_expert': return <Target className="h-4 w-4 text-green-500" />;
      case 'user_favorite': return <Star className="h-4 w-4 text-blue-500" />;
      case 'volume_champion': return <Trophy className="h-4 w-4 text-purple-500" />;
      case 'fast_responder': return <Clock className="h-4 w-4 text-orange-500" />;
      case 'quality_assurance': return <Award className="h-4 w-4 text-green-600" />;
      default: return <CheckCircle className="h-4 w-4 text-gray-500" />;
    }
  };
  
  const getAchievementName = (achievement: string) => {
    switch (achievement) {
      case 'speed_demon': return 'Speed Demon';
      case 'accuracy_expert': return 'Accuracy Expert';
      case 'user_favorite': return 'User Favorite';
      case 'volume_champion': return 'Volume Champion';
      case 'fast_responder': return 'Fast Responder';
      case 'quality_assurance': return 'Quality Assurance';
      default: return achievement.replace('_', ' ');
    }
  };
  
  const getTrendIcon = (trend: number) => {
    if (trend > 0) return <TrendingUp className="h-3 w-3 text-green-500" />;
    if (trend < 0) return <TrendingUp className="h-3 w-3 text-red-500 rotate-180" />;
    return <span className="text-gray-500">—</span>;
  };
  
  const topPerformers = adminMetrics
    .sort((a, b) => b.metrics.tasksCompleted - a.metrics.tasksCompleted)
    .slice(0, 3);
  
  const overallMetrics = {
    totalTasks: adminMetrics.reduce((sum, admin) => sum + admin.metrics.tasksCompleted, 0),
    avgResponseTime: adminMetrics.reduce((sum, admin) => sum + admin.metrics.avgResponseTime, 0) / adminMetrics.length,
    avgAccuracy: adminMetrics.reduce((sum, admin) => sum + admin.metrics.accuracyRate, 0) / adminMetrics.length,
    avgSatisfaction: adminMetrics.reduce((sum, admin) => sum + admin.metrics.userSatisfaction, 0) / adminMetrics.length
  };
  
  const performanceDistribution = [
    { name: 'Excellent', value: teamMetrics.filter(t => t.performance === 'excellent').length, color: '#10b981' },
    { name: 'Good', value: teamMetrics.filter(t => t.performance === 'good').length, color: '#3b82f6' },
    { name: 'Average', value: teamMetrics.filter(t => t.performance === 'average').length, color: '#f59e0b' },
    { name: 'Needs Improvement', value: teamMetrics.filter(t => t.performance === 'needs_improvement').length, color: '#ef4444' }
  ];
  
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Performance Analytics</h2>
          <p className="text-muted-foreground">Admin and team performance insights</p>
        </div>
        
        <div className="flex items-center gap-2">
          <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="90d">Last 90 days</SelectItem>
              <SelectItem value="1y">Last year</SelectItem>
            </SelectContent>
          </Select>
          
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export Report
          </Button>
        </div>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="individual">Individual Performance</TabsTrigger>
          <TabsTrigger value="teams">Team Analytics</TabsTrigger>
          <TabsTrigger value="trends">Trends & Insights</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-6">
          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-100 rounded-full">
                    <CheckCircle className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Total Tasks</p>
                    <p className="text-2xl font-bold">{overallMetrics.totalTasks}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-green-100 rounded-full">
                    <Clock className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Avg Response Time</p>
                    <p className="text-2xl font-bold">{Math.round(overallMetrics.avgResponseTime)}m</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-purple-100 rounded-full">
                    <Target className="h-5 w-5 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Avg Accuracy</p>
                    <p className="text-2xl font-bold">{Math.round(overallMetrics.avgAccuracy)}%</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-yellow-100 rounded-full">
                    <Star className="h-5 w-5 text-yellow-600" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Avg Satisfaction</p>
                    <p className="text-2xl font-bold">{overallMetrics.avgSatisfaction.toFixed(1)}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Top Performers */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Top Performers</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {topPerformers.map((admin, index) => (
                    <div key={admin.adminId} className="flex items-center gap-3">
                      <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-r from-yellow-400 to-orange-500 text-white font-bold text-sm">
                        {index + 1}
                      </div>
                      
                      <Avatar className="h-10 w-10">
                        <AvatarFallback>
                          {admin.adminName.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h4 className="font-medium">{admin.adminName}</h4>
                          <Badge variant="outline">{admin.role}</Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {admin.metrics.tasksCompleted} tasks • {admin.metrics.accuracyRate}% accuracy
                        </p>
                      </div>
                      
                      <div className="flex gap-1">
                        {admin.achievements.slice(0, 2).map(achievement => (
                          <div key={achievement} className="p-1">
                            {getAchievementIcon(achievement)}
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Team Performance Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartsPieChart>
                      <Pie
                        data={performanceDistribution}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        label={({ name, value }) => `${name}: ${value}`}
                      >
                        {performanceDistribution.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </RechartsPieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="individual" className="space-y-4">
          <div className="space-y-4">
            {adminMetrics.map((admin) => (
              <AdminPerformanceCard key={admin.adminId} admin={admin} />
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="teams" className="space-y-4">
          <div className="space-y-4">
            {teamMetrics.map((team) => (
              <TeamPerformanceCard key={team.teamId} team={team} />
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="trends" className="space-y-6">
          {/* Activity Trends Chart */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">Activity Trends</CardTitle>
                <Select value={selectedMetric} onValueChange={setSelectedMetric}>
                  <SelectTrigger className="w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="tasks">Tasks Completed</SelectItem>
                    <SelectItem value="responseTime">Response Time</SelectItem>
                    <SelectItem value="satisfaction">User Satisfaction</SelectItem>
                    <SelectItem value="accuracy">Accuracy Rate</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={activityTrends}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Area 
                      type="monotone" 
                      dataKey={selectedMetric} 
                      stroke="#3b82f6" 
                      fill="#3b82f6" 
                      fillOpacity={0.3}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
          
          {/* Performance Insights */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Performance Insights</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <TrendingUp className="h-5 w-5 text-green-500 mt-1" />
                    <div>
                      <h4 className="font-medium">Response Time Improving</h4>
                      <p className="text-sm text-muted-foreground">
                        Average response time decreased by 15% this week
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <Award className="h-5 w-5 text-blue-500 mt-1" />
                    <div>
                      <h4 className="font-medium">High Accuracy Maintained</h4>
                      <p className="text-sm text-muted-foreground">
                        Team accuracy consistently above 95% for 3 weeks
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="h-5 w-5 text-yellow-500 mt-1" />
                    <div>
                      <h4 className="font-medium">Workload Distribution</h4>
                      <p className="text-sm text-muted-foreground">
                        Consider balancing tasks between Mike and Sarah
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Achievement Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Zap className="h-4 w-4 text-yellow-500" />
                      <span className="text-sm">Speed Demon</span>
                    </div>
                    <Badge variant="secondary">3 admins</Badge>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Target className="h-4 w-4 text-green-500" />
                      <span className="text-sm">Accuracy Expert</span>
                    </div>
                    <Badge variant="secondary">2 admins</Badge>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Star className="h-4 w-4 text-blue-500" />
                      <span className="text-sm">User Favorite</span>
                    </div>
                    <Badge variant="secondary">4 admins</Badge>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Trophy className="h-4 w-4 text-purple-500" />
                      <span className="text-sm">Volume Champion</span>
                    </div>
                    <Badge variant="secondary">1 admin</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

// Admin Performance Card Component
const AdminPerformanceCard: React.FC<{ admin: AdminPerformanceMetric }> = ({ admin }) => {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-4">
            <Avatar className="h-12 w-12">
              <AvatarFallback>
                {admin.adminName.split(' ').map(n => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
            
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-medium text-lg">{admin.adminName}</h3>
                <Badge variant="outline">{admin.role}</Badge>
              </div>
              <p className="text-sm text-muted-foreground">
                Last active {formatDistanceToNow(new Date(admin.lastActive), { addSuffix: true })}
              </p>
            </div>
          </div>
          
          <div className="flex gap-1">
            {admin.achievements.map(achievement => (
              <div key={achievement} className="p-2" title={getAchievementName(achievement)}>
                {getAchievementIcon(achievement)}
              </div>
            ))}
          </div>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-6">
          <div>
            <div className="flex items-center gap-2">
              <p className="text-sm text-muted-foreground">Tasks Completed</p>
              {getTrendIcon(admin.trends.tasksCompletedTrend)}
            </div>
            <p className="text-2xl font-bold">{admin.metrics.tasksCompleted}</p>
            <p className="text-xs text-muted-foreground">
              {admin.trends.tasksCompletedTrend > 0 ? '+' : ''}{admin.trends.tasksCompletedTrend}% from last period
            </p>
          </div>
          
          <div>
            <div className="flex items-center gap-2">
              <p className="text-sm text-muted-foreground">Response Time</p>
              {getTrendIcon(-admin.trends.responseTimeTrend)} {/* Negative is good for response time */}
            </div>
            <p className="text-2xl font-bold">{admin.metrics.avgResponseTime}m</p>
            <p className="text-xs text-muted-foreground">
              {admin.trends.responseTimeTrend > 0 ? '+' : ''}{admin.trends.responseTimeTrend}% from last period
            </p>
          </div>
          
          <div>
            <div className="flex items-center gap-2">
              <p className="text-sm text-muted-foreground">Accuracy Rate</p>
              {getTrendIcon(admin.trends.accuracyTrend)}
            </div>
            <p className="text-2xl font-bold">{admin.metrics.accuracyRate}%</p>
            <Progress value={admin.metrics.accuracyRate} className="mt-1" />
          </div>
          
          <div>
            <div className="flex items-center gap-2">
              <p className="text-sm text-muted-foreground">Satisfaction</p>
              {getTrendIcon(admin.trends.satisfactionTrend)}
            </div>
            <p className="text-2xl font-bold">{admin.metrics.userSatisfaction}/5</p>
            <div className="flex gap-1 mt-1">
              {Array.from({ length: 5 }, (_, i) => (
                <Star
                  key={i}
                  className={`h-3 w-3 ${
                    i < Math.floor(admin.metrics.userSatisfaction)
                      ? 'text-yellow-400 fill-current'
                      : 'text-gray-300'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

// Team Performance Card Component
const TeamPerformanceCard: React.FC<{ team: TeamMetric }> = ({ team }) => {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-medium text-lg">{team.teamName}</h3>
            <p className="text-sm text-muted-foreground">{team.memberCount} members</p>
          </div>
          
          <Badge className={getPerformanceColor(team.performance)}>
            {team.performance.replace('_', ' ')}
          </Badge>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <div>
            <p className="text-sm text-muted-foreground">Total Tasks</p>
            <p className="text-xl font-bold">{team.metrics.totalTasks}</p>
          </div>
          
          <div>
            <p className="text-sm text-muted-foreground">Completion Rate</p>
            <p className="text-xl font-bold">{team.metrics.completionRate}%</p>
            <Progress value={team.metrics.completionRate} className="mt-1" />
          </div>
          
          <div>
            <p className="text-sm text-muted-foreground">Response Time</p>
            <p className="text-xl font-bold">{team.metrics.avgResponseTime}m</p>
          </div>
          
          <div>
            <p className="text-sm text-muted-foreground">Satisfaction</p>
            <p className="text-xl font-bold">{team.metrics.teamSatisfaction}/5</p>
          </div>
          
          <div>
            <p className="text-sm text-muted-foreground">Collaboration</p>
            <p className="text-xl font-bold">{team.metrics.collaborationScore}%</p>
            <Progress value={team.metrics.collaborationScore} className="mt-1" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
