import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Activity, 
  DollarSign, 
  TrendingUp, 
  AlertTriangle,
  Eye,
  MessageSquare,
  ShoppingCart,
  Bitcoin,
  Briefcase,
  ChevronRight,
  Refresh,
  Calendar,
  Filter,
  Download
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ScrollArea } from '@/components/ui/scroll-area';
import { LineChart, Line, AreaChart, Area, ResponsiveContainer, XAxis, YAxis, Tooltip } from 'recharts';
import { formatDistanceToNow } from 'date-fns';

interface DashboardMetric {
  id: string;
  title: string;
  value: string;
  change: string;
  trend: 'up' | 'down' | 'neutral';
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  priority: 'high' | 'medium' | 'low';
}

interface QuickAction {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  href: string;
  badge?: string;
  isUrgent?: boolean;
}

interface RecentActivity {
  id: string;
  type: 'user' | 'content' | 'financial' | 'system';
  title: string;
  description: string;
  timestamp: string;
  status: 'success' | 'warning' | 'error' | 'info';
  actionRequired?: boolean;
}

export const MobileAdminDashboard: React.FC = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('24h');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [metrics, setMetrics] = useState<DashboardMetric[]>([]);
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([]);
  
  // Mock data - would be fetched from API
  useEffect(() => {
    const mockMetrics: DashboardMetric[] = [
      {
        id: 'total-users',
        title: 'Total Users',
        value: '12,543',
        change: '+8.2%',
        trend: 'up',
        icon: Users,
        color: 'text-blue-600',
        priority: 'medium'
      },
      {
        id: 'pending-moderation',
        title: 'Pending Moderation',
        value: '23',
        change: '+15%',
        trend: 'up',
        icon: Eye,
        color: 'text-red-600',
        priority: 'high'
      },
      {
        id: 'revenue',
        title: 'Revenue (24h)',
        value: '$8,432',
        change: '+12.3%',
        trend: 'up',
        icon: DollarSign,
        color: 'text-green-600',
        priority: 'medium'
      },
      {
        id: 'active-disputes',
        title: 'Active Disputes',
        value: '7',
        change: '-2%',
        trend: 'down',
        icon: AlertTriangle,
        color: 'text-yellow-600',
        priority: 'high'
      }
    ];
    
    const mockActivity: RecentActivity[] = [
      {
        id: 'act-1',
        type: 'content',
        title: 'Content Reported',
        description: 'Inappropriate post reported by 5 users',
        timestamp: new Date(Date.now() - 300000).toISOString(),
        status: 'warning',
        actionRequired: true
      },
      {
        id: 'act-2',
        type: 'user',
        title: 'New User Registration',
        description: '15 new users registered in the last hour',
        timestamp: new Date(Date.now() - 600000).toISOString(),
        status: 'success'
      },
      {
        id: 'act-3',
        type: 'financial',
        title: 'Payment Dispute Resolved',
        description: 'Dispute #4321 resolved in favor of freelancer',
        timestamp: new Date(Date.now() - 900000).toISOString(),
        status: 'success'
      },
      {
        id: 'act-4',
        type: 'system',
        title: 'High CPU Usage Alert',
        description: 'Server CPU usage exceeded 85% threshold',
        timestamp: new Date(Date.now() - 1200000).toISOString(),
        status: 'error',
        actionRequired: true
      }
    ];
    
    setMetrics(mockMetrics);
    setRecentActivity(mockActivity);
  }, [selectedPeriod]);
  
  const quickActions: QuickAction[] = [
    {
      id: 'moderation-queue',
      title: 'Moderation Queue',
      description: 'Review pending content',
      icon: Eye,
      href: '/admin/moderation',
      badge: '23',
      isUrgent: true
    },
    {
      id: 'user-lookup',
      title: 'User Lookup',
      description: 'Find and manage users',
      icon: Users,
      href: '/admin/users'
    },
    {
      id: 'financial-overview',
      title: 'Financial Overview',
      description: 'Check platform earnings',
      icon: DollarSign,
      href: '/admin/financial'
    },
    {
      id: 'system-health',
      title: 'System Health',
      description: 'Monitor system status',
      icon: Activity,
      href: '/admin/system/health'
    },
    {
      id: 'recent-disputes',
      title: 'Active Disputes',
      description: 'Resolve ongoing disputes',
      icon: AlertTriangle,
      href: '/admin/disputes',
      badge: '7'
    },
    {
      id: 'marketplace-orders',
      title: 'Marketplace Orders',
      description: 'Monitor recent orders',
      icon: ShoppingCart,
      href: '/admin/marketplace/orders'
    }
  ];
  
  const handleRefresh = async () => {
    setIsRefreshing(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsRefreshing(false);
  };
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success': return 'text-green-600';
      case 'warning': return 'text-yellow-600';
      case 'error': return 'text-red-600';
      default: return 'text-blue-600';
    }
  };
  
  const getTrendIcon = (trend: string) => {
    return trend === 'up' ? '↗' : trend === 'down' ? '↘' : '→';
  };
  
  // Mock chart data
  const chartData = [
    { time: '00:00', users: 1200, revenue: 2400 },
    { time: '04:00', users: 1100, revenue: 2200 },
    { time: '08:00', users: 1800, revenue: 3200 },
    { time: '12:00', users: 2100, revenue: 4100 },
    { time: '16:00', users: 1900, revenue: 3800 },
    { time: '20:00', users: 2300, revenue: 4500 },
    { time: '24:00', users: 2000, revenue: 4200 }
  ];
  
  return (
    <div className="space-y-6 pb-20"> {/* Extra bottom padding for mobile navigation */}
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">Platform overview and key metrics</p>
        </div>
        
        <div className="flex items-center gap-2">
          <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
            <SelectTrigger className="w-20">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1h">1H</SelectItem>
              <SelectItem value="24h">24H</SelectItem>
              <SelectItem value="7d">7D</SelectItem>
              <SelectItem value="30d">30D</SelectItem>
            </SelectContent>
          </Select>
          
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleRefresh}
            disabled={isRefreshing}
          >
            <Refresh className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
          </Button>
        </div>
      </div>
      
      {/* Key Metrics - Mobile Optimized Grid */}
      <div className="grid grid-cols-2 gap-3">
        {metrics.map((metric) => {
          const Icon = metric.icon;
          return (
            <Card key={metric.id} className="relative overflow-hidden">
              {metric.priority === 'high' && (
                <div className="absolute top-0 right-0 w-0 h-0 border-l-8 border-l-transparent border-t-8 border-t-red-500" />
              )}
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground">{metric.title}</p>
                    <p className="text-xl font-bold">{metric.value}</p>
                    <div className="flex items-center gap-1">
                      <span className={`text-xs ${metric.trend === 'up' ? 'text-green-600' : metric.trend === 'down' ? 'text-red-600' : 'text-muted-foreground'}`}>
                        {getTrendIcon(metric.trend)} {metric.change}
                      </span>
                    </div>
                  </div>
                  <div className={`p-2 rounded-md bg-muted ${metric.color}`}>
                    <Icon className="h-4 w-4" />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
      
      {/* Quick Actions */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-3">
            {quickActions.slice(0, 6).map((action) => {
              const Icon = action.icon;
              return (
                <Button
                  key={action.id}
                  variant="outline"
                  className="h-auto p-3 justify-start relative"
                  asChild
                >
                  <a href={action.href}>
                    {action.isUrgent && (
                      <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse" />
                    )}
                    <div className="flex items-start gap-3 w-full">
                      <Icon className="h-5 w-5 mt-0.5 flex-shrink-0" />
                      <div className="flex-1 text-left">
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-sm">{action.title}</span>
                          {action.badge && (
                            <Badge variant={action.isUrgent ? "destructive" : "secondary"} className="text-xs h-4 px-1">
                              {action.badge}
                            </Badge>
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">{action.description}</p>
                      </div>
                      <ChevronRight className="h-4 w-4 flex-shrink-0" />
                    </div>
                  </a>
                </Button>
              );
            })}
          </div>
        </CardContent>
      </Card>
      
      {/* Charts - Mobile Optimized */}
      <Tabs defaultValue="activity" className="space-y-4">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="activity">Activity</TabsTrigger>
          <TabsTrigger value="revenue">Revenue</TabsTrigger>
        </TabsList>
        
        <TabsContent value="activity">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">User Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData}>
                    <defs>
                      <linearGradient id="userGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="time" hide />
                    <YAxis hide />
                    <Tooltip 
                      contentStyle={{ 
                        background: 'hsl(var(--background))', 
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '6px'
                      }}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="users" 
                      stroke="#3b82f6" 
                      fillOpacity={1} 
                      fill="url(#userGradient)" 
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="revenue">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Revenue Trend</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData}>
                    <XAxis dataKey="time" hide />
                    <YAxis hide />
                    <Tooltip 
                      contentStyle={{ 
                        background: 'hsl(var(--background))', 
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '6px'
                      }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="revenue" 
                      stroke="#10b981" 
                      strokeWidth={2}
                      dot={{ fill: '#10b981', strokeWidth: 2, r: 4 }}
                      activeDot={{ r: 6 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      {/* Recent Activity */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">Recent Activity</CardTitle>
            <Button variant="ghost" size="sm">
              View All
              <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-64">
            <div className="space-y-3">
              {recentActivity.map((activity) => (
                <div key={activity.id} className="flex items-start gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors">
                  <div className={`w-2 h-2 rounded-full mt-2 ${getStatusColor(activity.status)} bg-current`} />
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="font-medium text-sm">{activity.title}</p>
                      {activity.actionRequired && (
                        <Badge variant="destructive" className="text-xs h-4 px-1">
                          Action Required
                        </Badge>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">{activity.description}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {formatDistanceToNow(new Date(activity.timestamp), { addSuffix: true })}
                    </p>
                  </div>
                  
                  {activity.actionRequired && (
                    <Button variant="outline" size="sm">
                      View
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
      
      {/* System Health - Mobile Summary */}
      <div className="grid grid-cols-1 gap-3">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">System Health</p>
                <p className="text-xs text-muted-foreground">All systems operational</p>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                <span className="text-sm text-green-600">Healthy</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

// Mobile Stats Widget
export const MobileStatsWidget: React.FC<{
  title: string;
  value: string;
  change: string;
  trend: 'up' | 'down' | 'neutral';
  icon: React.ComponentType<{ className?: string }>;
}> = ({ title, value, change, trend, icon: Icon }) => {
  return (
    <div className="bg-card rounded-lg p-4 border">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs text-muted-foreground">{title}</p>
          <p className="text-lg font-bold">{value}</p>
          <span className={`text-xs ${
            trend === 'up' ? 'text-green-600' : 
            trend === 'down' ? 'text-red-600' : 
            'text-muted-foreground'
          }`}>
            {trend === 'up' ? '↗' : trend === 'down' ? '↘' : '→'} {change}
          </span>
        </div>
        <Icon className="h-6 w-6 text-muted-foreground" />
      </div>
    </div>
  );
};
