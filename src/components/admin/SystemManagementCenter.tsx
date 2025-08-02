import React, { useState, useEffect } from 'react';
import { 
  Server, 
  Database, 
  Cpu, 
  HardDrive, 
  Memory, 
  Network, 
  Activity,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Clock,
  Refresh,
  Settings,
  Download,
  Upload,
  Zap,
  Shield,
  Monitor,
  Globe,
  FileText,
  TrendingUp,
  TrendingDown,
  Minus,
  Play,
  Pause,
  RotateCcw,
  Power,
  Wifi
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import { LineChart, Line, AreaChart, Area, ResponsiveContainer, XAxis, YAxis, Tooltip, BarChart, Bar } from 'recharts';
import { formatDistanceToNow, format } from 'date-fns';

interface SystemMetric {
  id: string;
  name: string;
  value: number;
  unit: string;
  status: 'healthy' | 'warning' | 'critical';
  threshold: { warning: number; critical: number };
  trend: 'up' | 'down' | 'stable';
  change: number;
}

interface ServiceStatus {
  id: string;
  name: string;
  status: 'running' | 'stopped' | 'error' | 'starting' | 'stopping';
  uptime: string;
  lastRestart: string;
  memoryUsage: number;
  cpuUsage: number;
  port?: number;
  version?: string;
  dependencies: string[];
}

interface SystemAlert {
  id: string;
  type: 'performance' | 'security' | 'storage' | 'network' | 'service';
  severity: 'info' | 'warning' | 'error' | 'critical';
  title: string;
  description: string;
  timestamp: string;
  acknowledged: boolean;
  resolvedAt?: string;
  metadata: Record<string, any>;
}

interface BackupStatus {
  id: string;
  type: 'database' | 'files' | 'configuration';
  status: 'completed' | 'running' | 'failed' | 'scheduled';
  lastBackup: string;
  nextScheduled: string;
  size: string;
  location: string;
  retention: string;
}

export const SystemManagementCenter: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [systemMetrics, setSystemMetrics] = useState<SystemMetric[]>([]);
  const [services, setServices] = useState<ServiceStatus[]>([]);
  const [alerts, setAlerts] = useState<SystemAlert[]>([]);
  const [backups, setBackups] = useState<BackupStatus[]>([]);
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [refreshInterval, setRefreshInterval] = useState(30);
  
  // Mock data - would be fetched from API
  useEffect(() => {
    const mockSystemMetrics: SystemMetric[] = [
      {
        id: 'cpu',
        name: 'CPU Usage',
        value: 45,
        unit: '%',
        status: 'healthy',
        threshold: { warning: 70, critical: 90 },
        trend: 'stable',
        change: 0.2
      },
      {
        id: 'memory',
        name: 'Memory Usage',
        value: 68,
        unit: '%',
        status: 'warning',
        threshold: { warning: 75, critical: 90 },
        trend: 'up',
        change: 5.3
      },
      {
        id: 'disk',
        name: 'Disk Usage',
        value: 82,
        unit: '%',
        status: 'warning',
        threshold: { warning: 80, critical: 95 },
        trend: 'up',
        change: 2.1
      },
      {
        id: 'network',
        name: 'Network I/O',
        value: 34,
        unit: 'Mbps',
        status: 'healthy',
        threshold: { warning: 80, critical: 95 },
        trend: 'down',
        change: -1.2
      }
    ];
    
    const mockServices: ServiceStatus[] = [
      {
        id: 'api-server',
        name: 'API Server',
        status: 'running',
        uptime: '12d 4h 32m',
        lastRestart: new Date(Date.now() - 1036800000).toISOString(),
        memoryUsage: 512,
        cpuUsage: 15,
        port: 3000,
        version: '1.2.3',
        dependencies: ['database', 'redis']
      },
      {
        id: 'database',
        name: 'PostgreSQL Database',
        status: 'running',
        uptime: '25d 2h 15m',
        lastRestart: new Date(Date.now() - 2160000000).toISOString(),
        memoryUsage: 2048,
        cpuUsage: 8,
        port: 5432,
        version: '15.2',
        dependencies: []
      },
      {
        id: 'redis',
        name: 'Redis Cache',
        status: 'running',
        uptime: '15d 8h 45m',
        lastRestart: new Date(Date.now() - 1324800000).toISOString(),
        memoryUsage: 128,
        cpuUsage: 2,
        port: 6379,
        version: '7.0',
        dependencies: []
      },
      {
        id: 'file-processor',
        name: 'File Processing Service',
        status: 'error',
        uptime: '0s',
        lastRestart: new Date(Date.now() - 3600000).toISOString(),
        memoryUsage: 0,
        cpuUsage: 0,
        dependencies: ['api-server']
      }
    ];
    
    const mockAlerts: SystemAlert[] = [
      {
        id: 'alert-1',
        type: 'storage',
        severity: 'warning',
        title: 'High Disk Usage',
        description: 'Disk usage has exceeded 80% threshold',
        timestamp: new Date(Date.now() - 1800000).toISOString(),
        acknowledged: false,
        metadata: { currentUsage: 82, threshold: 80 }
      },
      {
        id: 'alert-2',
        type: 'service',
        severity: 'error',
        title: 'Service Down',
        description: 'File Processing Service has stopped responding',
        timestamp: new Date(Date.now() - 3600000).toISOString(),
        acknowledged: false,
        metadata: { service: 'file-processor', attempts: 3 }
      },
      {
        id: 'alert-3',
        type: 'performance',
        severity: 'info',
        title: 'High Memory Usage',
        description: 'Memory usage is approaching warning threshold',
        timestamp: new Date(Date.now() - 7200000).toISOString(),
        acknowledged: true,
        metadata: { currentUsage: 68, threshold: 75 }
      }
    ];
    
    const mockBackups: BackupStatus[] = [
      {
        id: 'db-backup',
        type: 'database',
        status: 'completed',
        lastBackup: new Date(Date.now() - 86400000).toISOString(),
        nextScheduled: new Date(Date.now() + 86400000).toISOString(),
        size: '2.5 GB',
        location: 's3://backups/database/',
        retention: '30 days'
      },
      {
        id: 'files-backup',
        type: 'files',
        status: 'running',
        lastBackup: new Date(Date.now() - 172800000).toISOString(),
        nextScheduled: new Date(Date.now() + 604800000).toISOString(),
        size: '15.8 GB',
        location: 's3://backups/files/',
        retention: '90 days'
      },
      {
        id: 'config-backup',
        type: 'configuration',
        status: 'completed',
        lastBackup: new Date(Date.now() - 259200000).toISOString(),
        nextScheduled: new Date(Date.now() + 604800000).toISOString(),
        size: '45 MB',
        location: 's3://backups/config/',
        retention: '180 days'
      }
    ];
    
    setSystemMetrics(mockSystemMetrics);
    setServices(mockServices);
    setAlerts(mockAlerts);
    setBackups(mockBackups);
  }, []);
  
  // Auto-refresh functionality
  useEffect(() => {
    if (!autoRefresh) return;
    
    const interval = setInterval(() => {
      // Refresh system metrics
      console.log('Auto-refreshing system metrics...');
    }, refreshInterval * 1000);
    
    return () => clearInterval(interval);
  }, [autoRefresh, refreshInterval]);
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy':
      case 'running':
      case 'completed': return 'text-green-600 bg-green-50';
      case 'warning': return 'text-yellow-600 bg-yellow-50';
      case 'error':
      case 'critical':
      case 'failed':
      case 'stopped': return 'text-red-600 bg-red-50';
      case 'starting':
      case 'stopping':
      case 'running': return 'text-blue-600 bg-blue-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };
  
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'healthy':
      case 'running':
      case 'completed': return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'warning': return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      case 'error':
      case 'critical':
      case 'failed':
      case 'stopped': return <XCircle className="h-4 w-4 text-red-500" />;
      case 'starting':
      case 'stopping': return <Clock className="h-4 w-4 text-blue-500" />;
      default: return <Minus className="h-4 w-4 text-gray-500" />;
    }
  };
  
  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return <TrendingUp className="h-3 w-3 text-red-500" />;
      case 'down': return <TrendingDown className="h-3 w-3 text-green-500" />;
      default: return <Minus className="h-3 w-3 text-gray-500" />;
    }
  };
  
  // Mock performance data for charts
  const performanceData = Array.from({ length: 24 }, (_, i) => ({
    time: `${i}:00`,
    cpu: Math.random() * 60 + 20,
    memory: Math.random() * 40 + 40,
    disk: Math.random() * 20 + 70,
    network: Math.random() * 50 + 10
  }));
  
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">System Management</h2>
          <p className="text-muted-foreground">Monitor and manage system health</p>
        </div>
        
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2 text-sm">
            <Switch 
              checked={autoRefresh} 
              onCheckedChange={setAutoRefresh}
              id="auto-refresh"
            />
            <Label htmlFor="auto-refresh">Auto-refresh</Label>
          </div>
          
          <Select value={refreshInterval.toString()} onValueChange={(value) => setRefreshInterval(Number(value))}>
            <SelectTrigger className="w-20">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="15">15s</SelectItem>
              <SelectItem value="30">30s</SelectItem>
              <SelectItem value="60">1m</SelectItem>
              <SelectItem value="300">5m</SelectItem>
            </SelectContent>
          </Select>
          
          <Button variant="outline" size="sm">
            <Refresh className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>
      
      {/* Maintenance Mode Alert */}
      {maintenanceMode && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            Maintenance mode is enabled. New users cannot access the platform.
            <Button 
              variant="outline" 
              size="sm" 
              className="ml-4"
              onClick={() => setMaintenanceMode(false)}
            >
              Disable Maintenance Mode
            </Button>
          </AlertDescription>
        </Alert>
      )}
      
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="services">Services</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="alerts">Alerts</TabsTrigger>
          <TabsTrigger value="backups">Backups</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-6">
          {/* System Metrics Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {systemMetrics.map((metric) => (
              <Card key={metric.id}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-medium text-sm">{metric.name}</h3>
                    {getTrendIcon(metric.trend)}
                  </div>
                  
                  <div className="space-y-2">
                    <div className="text-2xl font-bold">
                      {metric.value}{metric.unit}
                    </div>
                    
                    <Progress 
                      value={metric.value} 
                      className={`h-2 ${
                        metric.value >= metric.threshold.critical ? 'bg-red-100' :
                        metric.value >= metric.threshold.warning ? 'bg-yellow-100' : 'bg-green-100'
                      }`}
                    />
                    
                    <div className="flex items-center justify-between text-xs">
                      <span className={`px-2 py-1 rounded-full ${getStatusColor(metric.status)}`}>
                        {metric.status}
                      </span>
                      <span className="text-muted-foreground">
                        {metric.change > 0 ? '+' : ''}{metric.change}%
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          
          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-green-100 rounded-full">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Services Running</p>
                    <p className="text-xl font-bold">
                      {services.filter(s => s.status === 'running').length}/{services.length}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-yellow-100 rounded-full">
                    <AlertTriangle className="h-5 w-5 text-yellow-600" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Active Alerts</p>
                    <p className="text-xl font-bold">
                      {alerts.filter(a => !a.acknowledged).length}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-100 rounded-full">
                    <HardDrive className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Last Backup</p>
                    <p className="text-sm font-medium">
                      {formatDistanceToNow(new Date(backups[0]?.lastBackup || Date.now()), { addSuffix: true })}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Recent Alerts */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Recent Alerts</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {alerts.slice(0, 5).map((alert) => (
                  <div key={alert.id} className="flex items-center gap-3 p-3 border rounded-lg">
                    {getStatusIcon(alert.severity)}
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h4 className="font-medium">{alert.title}</h4>
                        <Badge variant={alert.severity === 'critical' ? 'destructive' : 'secondary'}>
                          {alert.severity}
                        </Badge>
                        {!alert.acknowledged && <Badge variant="outline">Unacknowledged</Badge>}
                      </div>
                      <p className="text-sm text-muted-foreground">{alert.description}</p>
                      <p className="text-xs text-muted-foreground">
                        {formatDistanceToNow(new Date(alert.timestamp), { addSuffix: true })}
                      </p>
                    </div>
                    {!alert.acknowledged && (
                      <Button variant="outline" size="sm">
                        Acknowledge
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="services" className="space-y-4">
          <div className="space-y-3">
            {services.map((service) => (
              <ServiceCard key={service.id} service={service} />
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="performance" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">CPU & Memory Usage</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={performanceData}>
                      <XAxis dataKey="time" />
                      <YAxis />
                      <Tooltip />
                      <Line type="monotone" dataKey="cpu" stroke="#ef4444" name="CPU %" />
                      <Line type="monotone" dataKey="memory" stroke="#3b82f6" name="Memory %" />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Disk & Network Usage</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={performanceData}>
                      <XAxis dataKey="time" />
                      <YAxis />
                      <Tooltip />
                      <Area type="monotone" dataKey="disk" stackId="1" stroke="#f59e0b" fill="#fef3c7" name="Disk %" />
                      <Area type="monotone" dataKey="network" stackId="2" stroke="#10b981" fill="#d1fae5" name="Network Mbps" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="alerts" className="space-y-4">
          <div className="space-y-3">
            {alerts.map((alert) => (
              <AlertCard key={alert.id} alert={alert} />
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="backups" className="space-y-4">
          <div className="space-y-3">
            {backups.map((backup) => (
              <BackupCard key={backup.id} backup={backup} />
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="settings" className="space-y-4">
          <SystemSettings 
            maintenanceMode={maintenanceMode}
            onMaintenanceModeChange={setMaintenanceMode}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

// Service Card Component
const ServiceCard: React.FC<{ service: ServiceStatus }> = ({ service }) => {
  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              {getStatusIcon(service.status)}
              <h3 className="font-medium">{service.name}</h3>
              <Badge variant={service.status === 'running' ? 'default' : 'destructive'}>
                {service.status}
              </Badge>
              {service.version && (
                <Badge variant="outline">v{service.version}</Badge>
              )}
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div>
                <span className="text-muted-foreground">Uptime:</span>
                <div>{service.uptime}</div>
              </div>
              <div>
                <span className="text-muted-foreground">Memory:</span>
                <div>{service.memoryUsage} MB</div>
              </div>
              <div>
                <span className="text-muted-foreground">CPU:</span>
                <div>{service.cpuUsage}%</div>
              </div>
              {service.port && (
                <div>
                  <span className="text-muted-foreground">Port:</span>
                  <div>{service.port}</div>
                </div>
              )}
            </div>
            
            {service.dependencies.length > 0 && (
              <div className="mt-2">
                <span className="text-xs text-muted-foreground">Dependencies: </span>
                {service.dependencies.map(dep => (
                  <Badge key={dep} variant="outline" className="ml-1 text-xs">
                    {dep}
                  </Badge>
                ))}
              </div>
            )}
          </div>
          
          <div className="flex gap-2">
            {service.status === 'running' ? (
              <>
                <Button variant="outline" size="sm">
                  <Pause className="h-4 w-4 mr-2" />
                  Stop
                </Button>
                <Button variant="outline" size="sm">
                  <RotateCcw className="h-4 w-4 mr-2" />
                  Restart
                </Button>
              </>
            ) : (
              <Button size="sm">
                <Play className="h-4 w-4 mr-2" />
                Start
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

// Alert Card Component
const AlertCard: React.FC<{ alert: SystemAlert }> = ({ alert }) => {
  return (
    <Card className={alert.severity === 'critical' ? 'border-red-500' : ''}>
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              {getStatusIcon(alert.severity)}
              <h3 className="font-medium">{alert.title}</h3>
              <Badge variant={alert.severity === 'critical' ? 'destructive' : 'secondary'}>
                {alert.severity}
              </Badge>
              <Badge variant="outline">{alert.type}</Badge>
              {!alert.acknowledged && <Badge variant="outline">Unacknowledged</Badge>}
            </div>
            
            <p className="text-sm text-muted-foreground mb-2">{alert.description}</p>
            
            <div className="flex items-center gap-4 text-xs text-muted-foreground">
              <span>{formatDistanceToNow(new Date(alert.timestamp), { addSuffix: true })}</span>
              {alert.resolvedAt && (
                <span>Resolved: {formatDistanceToNow(new Date(alert.resolvedAt), { addSuffix: true })}</span>
              )}
            </div>
          </div>
          
          <div className="flex gap-2">
            {!alert.acknowledged && (
              <Button variant="outline" size="sm">
                Acknowledge
              </Button>
            )}
            <Button variant="outline" size="sm">
              View Details
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

// Backup Card Component
const BackupCard: React.FC<{ backup: BackupStatus }> = ({ backup }) => {
  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              {getStatusIcon(backup.status)}
              <h3 className="font-medium">{backup.type.charAt(0).toUpperCase() + backup.type.slice(1)} Backup</h3>
              <Badge variant={backup.status === 'completed' ? 'default' : backup.status === 'failed' ? 'destructive' : 'secondary'}>
                {backup.status}
              </Badge>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div>
                <span className="text-muted-foreground">Last Backup:</span>
                <div>{formatDistanceToNow(new Date(backup.lastBackup), { addSuffix: true })}</div>
              </div>
              <div>
                <span className="text-muted-foreground">Next Scheduled:</span>
                <div>{formatDistanceToNow(new Date(backup.nextScheduled), { addSuffix: true })}</div>
              </div>
              <div>
                <span className="text-muted-foreground">Size:</span>
                <div>{backup.size}</div>
              </div>
              <div>
                <span className="text-muted-foreground">Retention:</span>
                <div>{backup.retention}</div>
              </div>
            </div>
            
            <div className="mt-2 text-xs text-muted-foreground">
              Location: {backup.location}
            </div>
          </div>
          
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Download
            </Button>
            <Button variant="outline" size="sm">
              Run Now
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

// System Settings Component
const SystemSettings: React.FC<{
  maintenanceMode: boolean;
  onMaintenanceModeChange: (enabled: boolean) => void;
}> = ({ maintenanceMode, onMaintenanceModeChange }) => {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">General Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="maintenance-mode" className="font-medium">Maintenance Mode</Label>
              <p className="text-sm text-muted-foreground">Prevent new users from accessing the platform</p>
            </div>
            <Switch 
              id="maintenance-mode"
              checked={maintenanceMode}
              onCheckedChange={onMaintenanceModeChange}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <Label className="font-medium">Auto Scaling</Label>
              <p className="text-sm text-muted-foreground">Automatically scale resources based on demand</p>
            </div>
            <Switch defaultChecked />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <Label className="font-medium">Debug Logging</Label>
              <p className="text-sm text-muted-foreground">Enable detailed logging for troubleshooting</p>
            </div>
            <Switch />
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Performance Thresholds</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="text-sm">CPU Warning (%)</Label>
              <Select defaultValue="70">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="60">60%</SelectItem>
                  <SelectItem value="70">70%</SelectItem>
                  <SelectItem value="80">80%</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-sm">CPU Critical (%)</Label>
              <Select defaultValue="90">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="85">85%</SelectItem>
                  <SelectItem value="90">90%</SelectItem>
                  <SelectItem value="95">95%</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
