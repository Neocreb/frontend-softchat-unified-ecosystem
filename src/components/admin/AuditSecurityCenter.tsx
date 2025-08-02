import React, { useState, useEffect } from 'react';
import { 
  Shield, 
  Activity, 
  AlertTriangle, 
  Clock, 
  Eye, 
  User, 
  Lock, 
  Unlock,
  Ban,
  CheckCircle,
  XCircle,
  Search,
  Filter,
  Download,
  Calendar,
  MapPin,
  Smartphone,
  Monitor,
  Globe,
  Key,
  FileText,
  AlertCircle
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { DatePickerWithRange } from '@/components/ui/date-picker';
import { formatDistanceToNow, format } from 'date-fns';

interface SecurityEvent {
  id: string;
  type: 'login_attempt' | 'permission_denied' | 'data_access' | 'system_change' | 'security_violation';
  severity: 'low' | 'medium' | 'high' | 'critical';
  title: string;
  description: string;
  userId?: string;
  adminId?: string;
  ipAddress: string;
  userAgent: string;
  location?: string;
  timestamp: string;
  status: 'open' | 'investigating' | 'resolved' | 'false_positive';
  metadata: Record<string, any>;
}

interface AuditLog {
  id: string;
  adminId: string;
  adminName: string;
  action: string;
  resource: string;
  resourceId?: string;
  details: Record<string, any>;
  ipAddress: string;
  userAgent: string;
  timestamp: string;
  success: boolean;
  changes?: Record<string, { old: any; new: any }>;
}

interface SecurityMetric {
  id: string;
  title: string;
  value: number;
  unit: string;
  trend: 'up' | 'down' | 'neutral';
  change: string;
  severity: 'info' | 'warning' | 'error';
  threshold?: number;
}

interface AdminSession {
  id: string;
  adminId: string;
  adminName: string;
  role: string;
  ipAddress: string;
  userAgent: string;
  location?: string;
  loginTime: string;
  lastActivity: string;
  isActive: boolean;
  isCurrent?: boolean;
}

export const AuditSecurityCenter: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [securityEvents, setSecurityEvents] = useState<SecurityEvent[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [adminSessions, setAdminSessions] = useState<AdminSession[]>([]);
  const [securityMetrics, setSecurityMetrics] = useState<SecurityMetric[]>([]);
  const [filters, setFilters] = useState({
    dateRange: { from: undefined, to: undefined },
    severity: 'all',
    type: 'all',
    status: 'all'
  });
  
  // Mock data - would be fetched from API
  useEffect(() => {
    const mockSecurityEvents: SecurityEvent[] = [
      {
        id: 'sec-1',
        type: 'login_attempt',
        severity: 'high',
        title: 'Multiple Failed Login Attempts',
        description: 'Admin account locked after 5 failed login attempts',
        adminId: 'admin-123',
        ipAddress: '192.168.1.100',
        userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        location: 'New York, US',
        timestamp: new Date(Date.now() - 300000).toISOString(),
        status: 'investigating',
        metadata: { attempts: 5, lockDuration: 1800 }
      },
      {
        id: 'sec-2',
        type: 'permission_denied',
        severity: 'medium',
        title: 'Unauthorized Access Attempt',
        description: 'Moderator tried to access super admin functions',
        adminId: 'admin-456',
        ipAddress: '10.0.1.50',
        userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
        location: 'London, UK',
        timestamp: new Date(Date.now() - 900000).toISOString(),
        status: 'resolved',
        metadata: { attemptedAction: 'delete_user', requiredRole: 'super_admin' }
      },
      {
        id: 'sec-3',
        type: 'security_violation',
        severity: 'critical',
        title: 'Suspicious Data Export',
        description: 'Large user data export from unusual location',
        adminId: 'admin-789',
        ipAddress: '203.0.113.42',
        userAgent: 'curl/7.68.0',
        location: 'Unknown',
        timestamp: new Date(Date.now() - 1800000).toISOString(),
        status: 'open',
        metadata: { recordsExported: 50000, exportSize: '125MB' }
      }
    ];
    
    const mockAuditLogs: AuditLog[] = [
      {
        id: 'audit-1',
        adminId: 'admin-123',
        adminName: 'Sarah Johnson',
        action: 'user_suspension',
        resource: 'user',
        resourceId: 'user-456',
        details: { reason: 'Policy violation', duration: '7 days' },
        ipAddress: '192.168.1.100',
        userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        timestamp: new Date(Date.now() - 600000).toISOString(),
        success: true,
        changes: {
          status: { old: 'active', new: 'suspended' },
          suspendedUntil: { old: null, new: '2024-02-01T00:00:00Z' }
        }
      },
      {
        id: 'audit-2',
        adminId: 'admin-456',
        adminName: 'Mike Chen',
        action: 'content_moderation',
        resource: 'post',
        resourceId: 'post-789',
        details: { action: 'remove', reason: 'Inappropriate content' },
        ipAddress: '10.0.1.50',
        userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
        timestamp: new Date(Date.now() - 1200000).toISOString(),
        success: true
      }
    ];
    
    const mockAdminSessions: AdminSession[] = [
      {
        id: 'session-1',
        adminId: 'admin-123',
        adminName: 'Sarah Johnson',
        role: 'Super Admin',
        ipAddress: '192.168.1.100',
        userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        location: 'New York, US',
        loginTime: new Date(Date.now() - 7200000).toISOString(),
        lastActivity: new Date(Date.now() - 300000).toISOString(),
        isActive: true,
        isCurrent: true
      },
      {
        id: 'session-2',
        adminId: 'admin-456',
        adminName: 'Mike Chen',
        role: 'Moderator',
        ipAddress: '10.0.1.50',
        userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
        location: 'London, UK',
        loginTime: new Date(Date.now() - 3600000).toISOString(),
        lastActivity: new Date(Date.now() - 120000).toISOString(),
        isActive: true
      }
    ];
    
    const mockSecurityMetrics: SecurityMetric[] = [
      {
        id: 'failed-logins',
        title: 'Failed Login Attempts',
        value: 12,
        unit: 'attempts',
        trend: 'up',
        change: '+20%',
        severity: 'warning',
        threshold: 10
      },
      {
        id: 'active-sessions',
        title: 'Active Admin Sessions',
        value: 5,
        unit: 'sessions',
        trend: 'neutral',
        change: '0%',
        severity: 'info'
      },
      {
        id: 'security-events',
        title: 'Security Events (24h)',
        value: 3,
        unit: 'events',
        trend: 'down',
        change: '-25%',
        severity: 'warning'
      },
      {
        id: 'audit-entries',
        title: 'Audit Entries (24h)',
        value: 156,
        unit: 'entries',
        trend: 'up',
        change: '+15%',
        severity: 'info'
      }
    ];
    
    setSecurityEvents(mockSecurityEvents);
    setAuditLogs(mockAuditLogs);
    setAdminSessions(mockAdminSessions);
    setSecurityMetrics(mockSecurityMetrics);
  }, []);
  
  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'text-red-600 bg-red-50';
      case 'high': return 'text-red-500 bg-red-50';
      case 'medium': return 'text-yellow-600 bg-yellow-50';
      case 'low': return 'text-blue-600 bg-blue-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };
  
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'open': return <AlertCircle className="h-4 w-4 text-red-500" />;
      case 'investigating': return <Eye className="h-4 w-4 text-yellow-500" />;
      case 'resolved': return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'false_positive': return <XCircle className="h-4 w-4 text-gray-500" />;
      default: return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };
  
  const getDeviceIcon = (userAgent: string) => {
    if (userAgent.includes('Mobile')) return <Smartphone className="h-4 w-4" />;
    if (userAgent.includes('curl')) return <Globe className="h-4 w-4" />;
    return <Monitor className="h-4 w-4" />;
  };
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Security & Audit Center</h2>
          <p className="text-muted-foreground">Monitor security events and admin activities</p>
        </div>
        
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export Report
          </Button>
          <Button variant="outline" size="sm">
            <Shield className="h-4 w-4 mr-2" />
            Security Scan
          </Button>
        </div>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="events">Security Events</TabsTrigger>
          <TabsTrigger value="audit">Audit Logs</TabsTrigger>
          <TabsTrigger value="sessions">Admin Sessions</TabsTrigger>
          <TabsTrigger value="compliance">Compliance</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-6">
          {/* Security Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {securityMetrics.map((metric) => (
              <Card key={metric.id}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">{metric.title}</p>
                      <p className="text-2xl font-bold">
                        {metric.value} {metric.unit}
                      </p>
                      <div className="flex items-center gap-1 mt-1">
                        <span className={`text-xs ${
                          metric.trend === 'up' ? 'text-red-600' : 
                          metric.trend === 'down' ? 'text-green-600' : 
                          'text-muted-foreground'
                        }`}>
                          {metric.trend === 'up' ? '↗' : metric.trend === 'down' ? '↘' : '→'} {metric.change}
                        </span>
                      </div>
                    </div>
                    
                    {metric.threshold && metric.value > metric.threshold && (
                      <AlertTriangle className="h-5 w-5 text-yellow-500" />
                    )}
                  </div>
                  
                  {metric.threshold && (
                    <div className="mt-3">
                      <Progress 
                        value={(metric.value / (metric.threshold * 1.5)) * 100} 
                        className="h-2"
                      />
                      <p className="text-xs text-muted-foreground mt-1">
                        Threshold: {metric.threshold}
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
          
          {/* Recent Critical Events */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Critical Security Events</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {securityEvents.filter(e => e.severity === 'critical' || e.severity === 'high').slice(0, 5).map((event) => (
                  <div key={event.id} className="flex items-start gap-3 p-3 border rounded-lg">
                    <div className={`p-1 rounded-full ${getSeverityColor(event.severity)}`}>
                      {getStatusIcon(event.status)}
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h4 className="font-medium">{event.title}</h4>
                        <Badge variant={event.severity === 'critical' ? 'destructive' : 'secondary'}>
                          {event.severity}
                        </Badge>
                        <Badge variant="outline">
                          {event.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">{event.description}</p>
                      <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                        <span>{formatDistanceToNow(new Date(event.timestamp), { addSuffix: true })}</span>
                        <span>{event.ipAddress}</span>
                        {event.location && <span>{event.location}</span>}
                      </div>
                    </div>
                    
                    <Button variant="outline" size="sm">
                      Investigate
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
          
          {/* Security Health Score */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Security Health Score</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-600 mb-2">87%</div>
                  <p className="text-sm text-muted-foreground mb-4">Overall security health</p>
                  <Progress value={87} className="mb-4" />
                  
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Authentication Security</span>
                      <span className="text-green-600">95%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Access Controls</span>
                      <span className="text-green-600">90%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Data Protection</span>
                      <span className="text-yellow-600">75%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Monitoring Coverage</span>
                      <span className="text-green-600">88%</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Threat Intelligence</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <Alert>
                    <AlertTriangle className="h-4 w-4" />
                    <AlertDescription>
                      3 suspicious IP addresses detected in the last 24 hours
                    </AlertDescription>
                  </Alert>
                  
                  <Alert>
                    <Shield className="h-4 w-4" />
                    <AlertDescription>
                      Password policy compliance: 92% of admin accounts
                    </AlertDescription>
                  </Alert>
                  
                  <Alert>
                    <Key className="h-4 w-4" />
                    <AlertDescription>
                      2 admin accounts require 2FA setup
                    </AlertDescription>
                  </Alert>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="events" className="space-y-4">
          {/* Filters */}
          <Card>
            <CardContent className="p-4">
              <div className="flex flex-wrap items-center gap-4">
                <div className="flex-1 min-w-64">
                  <Input
                    placeholder="Search events..."
                    className="w-full"
                  />
                </div>
                
                <Select value={filters.severity} onValueChange={(value) => setFilters(prev => ({ ...prev, severity: value }))}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Severity" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Severity</SelectItem>
                    <SelectItem value="critical">Critical</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="low">Low</SelectItem>
                  </SelectContent>
                </Select>
                
                <Select value={filters.status} onValueChange={(value) => setFilters(prev => ({ ...prev, status: value }))}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="open">Open</SelectItem>
                    <SelectItem value="investigating">Investigating</SelectItem>
                    <SelectItem value="resolved">Resolved</SelectItem>
                    <SelectItem value="false_positive">False Positive</SelectItem>
                  </SelectContent>
                </Select>
                
                <DatePickerWithRange
                  date={filters.dateRange}
                  onDateChange={(range) => setFilters(prev => ({ ...prev, dateRange: range }))}
                />
              </div>
            </CardContent>
          </Card>
          
          {/* Security Events List */}
          <div className="space-y-3">
            {securityEvents.map((event) => (
              <SecurityEventCard key={event.id} event={event} />
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="audit" className="space-y-4">
          <div className="space-y-3">
            {auditLogs.map((log) => (
              <AuditLogCard key={log.id} log={log} />
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="sessions" className="space-y-4">
          <div className="space-y-3">
            {adminSessions.map((session) => (
              <AdminSessionCard key={session.id} session={session} />
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="compliance" className="space-y-4">
          <ComplianceOverview />
        </TabsContent>
      </Tabs>
    </div>
  );
};

// Security Event Card Component
const SecurityEventCard: React.FC<{ event: SecurityEvent }> = ({ event }) => {
  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <div className={`p-1 rounded-full ${getSeverityColor(event.severity)}`}>
                {getStatusIcon(event.status)}
              </div>
              <h3 className="font-medium">{event.title}</h3>
              <Badge variant={event.severity === 'critical' ? 'destructive' : 'secondary'}>
                {event.severity}
              </Badge>
              <Badge variant="outline">
                {event.status}
              </Badge>
            </div>
            
            <p className="text-sm text-muted-foreground mb-3">{event.description}</p>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div>
                <span className="text-muted-foreground">Time:</span>
                <div>{formatDistanceToNow(new Date(event.timestamp), { addSuffix: true })}</div>
              </div>
              <div>
                <span className="text-muted-foreground">IP Address:</span>
                <div className="font-mono">{event.ipAddress}</div>
              </div>
              <div>
                <span className="text-muted-foreground">Location:</span>
                <div>{event.location || 'Unknown'}</div>
              </div>
              <div>
                <span className="text-muted-foreground">Device:</span>
                <div className="flex items-center gap-1">
                  {getDeviceIcon(event.userAgent)}
                  <span className="truncate">{event.userAgent.split(' ')[0]}</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              View Details
            </Button>
            {event.status === 'open' && (
              <Button size="sm">
                Investigate
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

// Audit Log Card Component
const AuditLogCard: React.FC<{ log: AuditLog }> = ({ log }) => {
  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <div className={`w-2 h-2 rounded-full ${log.success ? 'bg-green-500' : 'bg-red-500'}`} />
              <h3 className="font-medium">{log.action.replace('_', ' ').toUpperCase()}</h3>
              <Badge variant="outline">{log.resource}</Badge>
            </div>
            
            <p className="text-sm text-muted-foreground mb-3">
              {log.adminName} performed {log.action.replace('_', ' ')} on {log.resource}
              {log.resourceId && ` (ID: ${log.resourceId})`}
            </p>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div>
                <span className="text-muted-foreground">Admin:</span>
                <div>{log.adminName}</div>
              </div>
              <div>
                <span className="text-muted-foreground">Time:</span>
                <div>{format(new Date(log.timestamp), 'MMM dd, HH:mm')}</div>
              </div>
              <div>
                <span className="text-muted-foreground">IP Address:</span>
                <div className="font-mono">{log.ipAddress}</div>
              </div>
              <div>
                <span className="text-muted-foreground">Status:</span>
                <div className={log.success ? 'text-green-600' : 'text-red-600'}>
                  {log.success ? 'Success' : 'Failed'}
                </div>
              </div>
            </div>
            
            {log.changes && (
              <div className="mt-3 p-2 bg-muted rounded text-sm">
                <span className="font-medium">Changes:</span>
                <pre className="mt-1 text-xs overflow-x-auto">
                  {JSON.stringify(log.changes, null, 2)}
                </pre>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

// Admin Session Card Component
const AdminSessionCard: React.FC<{ session: AdminSession }> = ({ session }) => {
  return (
    <Card className={session.isCurrent ? 'ring-2 ring-blue-500' : ''}>
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <div className={`w-2 h-2 rounded-full ${session.isActive ? 'bg-green-500' : 'bg-gray-500'}`} />
              <h3 className="font-medium">{session.adminName}</h3>
              <Badge variant="outline">{session.role}</Badge>
              {session.isCurrent && <Badge variant="default">Current Session</Badge>}
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div>
                <span className="text-muted-foreground">Login Time:</span>
                <div>{format(new Date(session.loginTime), 'MMM dd, HH:mm')}</div>
              </div>
              <div>
                <span className="text-muted-foreground">Last Activity:</span>
                <div>{formatDistanceToNow(new Date(session.lastActivity), { addSuffix: true })}</div>
              </div>
              <div>
                <span className="text-muted-foreground">IP Address:</span>
                <div className="font-mono">{session.ipAddress}</div>
              </div>
              <div>
                <span className="text-muted-foreground">Location:</span>
                <div>{session.location || 'Unknown'}</div>
              </div>
            </div>
            
            <div className="flex items-center gap-1 mt-2 text-sm text-muted-foreground">
              {getDeviceIcon(session.userAgent)}
              <span className="truncate">{session.userAgent}</span>
            </div>
          </div>
          
          {!session.isCurrent && (
            <Button variant="outline" size="sm" className="text-red-600">
              <Ban className="h-4 w-4 mr-2" />
              Terminate
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

// Compliance Overview Component
const ComplianceOverview: React.FC = () => {
  const complianceItems = [
    {
      id: 'data-retention',
      title: 'Data Retention Policy',
      status: 'compliant',
      description: 'User data retained according to policy (7 years)',
      lastReview: '2024-01-15'
    },
    {
      id: 'audit-logging',
      title: 'Audit Logging',
      status: 'compliant',
      description: 'All admin actions are logged and retained',
      lastReview: '2024-01-20'
    },
    {
      id: 'access-controls',
      title: 'Access Controls',
      status: 'warning',
      description: '2 admin accounts missing 2FA',
      lastReview: '2024-01-18'
    },
    {
      id: 'data-encryption',
      title: 'Data Encryption',
      status: 'compliant',
      description: 'All sensitive data encrypted at rest and in transit',
      lastReview: '2024-01-22'
    }
  ];
  
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">94%</div>
              <p className="text-sm text-muted-foreground">Compliance Score</p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <div className="text-2xl font-bold">3</div>
              <p className="text-sm text-muted-foreground">Compliant Areas</p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-600">1</div>
              <p className="text-sm text-muted-foreground">Needs Attention</p>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="space-y-3">
        {complianceItems.map((item) => (
          <Card key={item.id}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-medium">{item.title}</h3>
                    <Badge variant={
                      item.status === 'compliant' ? 'default' : 
                      item.status === 'warning' ? 'secondary' : 'destructive'
                    }>
                      {item.status}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">{item.description}</p>
                  <p className="text-xs text-muted-foreground mt-2">
                    Last reviewed: {format(new Date(item.lastReview), 'MMM dd, yyyy')}
                  </p>
                </div>
                
                <Button variant="outline" size="sm">
                  Review
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

// Helper functions
const getSeverityColor = (severity: string) => {
  switch (severity) {
    case 'critical': return 'text-red-600 bg-red-50';
    case 'high': return 'text-red-500 bg-red-50';
    case 'medium': return 'text-yellow-600 bg-yellow-50';
    case 'low': return 'text-blue-600 bg-blue-50';
    default: return 'text-gray-600 bg-gray-50';
  }
};

const getStatusIcon = (status: string) => {
  switch (status) {
    case 'open': return <AlertCircle className="h-4 w-4 text-red-500" />;
    case 'investigating': return <Eye className="h-4 w-4 text-yellow-500" />;
    case 'resolved': return <CheckCircle className="h-4 w-4 text-green-500" />;
    case 'false_positive': return <XCircle className="h-4 w-4 text-gray-500" />;
    default: return <Clock className="h-4 w-4 text-gray-500" />;
  }
};

const getDeviceIcon = (userAgent: string) => {
  if (userAgent.includes('Mobile')) return <Smartphone className="h-4 w-4" />;
  if (userAgent.includes('curl')) return <Globe className="h-4 w-4" />;
  return <Monitor className="h-4 w-4" />;
};
