import React, { useState, useEffect } from 'react';
import { 
  Grid, 
  Layout, 
  Settings, 
  Plus, 
  Trash2, 
  Edit3, 
  Move, 
  Eye, 
  EyeOff,
  Save,
  RotateCcw,
  Download,
  Upload,
  Monitor,
  Smartphone,
  Tablet
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { useAdmin } from '@/contexts/AdminContext';
import { useAdminWebSocket } from '@/hooks/use-admin-websocket';

// Import existing dashboard components
import { MobileAdminDashboard } from './MobileAdminDashboard';
import { RealtimeAdminNotifications, AdminPresenceIndicator } from './RealtimeAdminNotifications';

interface DashboardWidget {
  id: string;
  type: 'metric' | 'chart' | 'table' | 'alert' | 'activity' | 'quick-action';
  title: string;
  description?: string;
  size: 'small' | 'medium' | 'large' | 'full';
  position: { x: number; y: number };
  isVisible: boolean;
  config: Record<string, any>;
  permissions?: string[];
}

interface DashboardLayout {
  id: string;
  name: string;
  description?: string;
  isDefault: boolean;
  isPublic: boolean;
  widgets: DashboardWidget[];
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

interface DashboardTheme {
  id: string;
  name: string;
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    surface: string;
  };
  typography: {
    fontSize: string;
    fontFamily: string;
  };
}

export const EnhancedAdminDashboard: React.FC = () => {
  const [currentLayout, setCurrentLayout] = useState<DashboardLayout | null>(null);
  const [availableLayouts, setAvailableLayouts] = useState<DashboardLayout[]>([]);
  const [isCustomizing, setIsCustomizing] = useState(false);
  const [viewMode, setViewMode] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [selectedWidget, setSelectedWidget] = useState<string | null>(null);
  const [showLayoutDialog, setShowLayoutDialog] = useState(false);
  const [showWidgetDialog, setShowWidgetDialog] = useState(false);
  
  const { adminUser } = useAdmin();
  const { isConnected, onlineAdmins } = useAdminWebSocket();
  
  // Mock data - would be fetched from API
  useEffect(() => {
    const mockLayouts: DashboardLayout[] = [
      {
        id: 'default',
        name: 'Default Layout',
        description: 'Standard admin dashboard layout',
        isDefault: true,
        isPublic: true,
        createdBy: 'system',
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z',
        widgets: [
          {
            id: 'widget-1',
            type: 'metric',
            title: 'Total Users',
            size: 'small',
            position: { x: 0, y: 0 },
            isVisible: true,
            config: { metric: 'users', showTrend: true }
          },
          {
            id: 'widget-2',
            type: 'metric',
            title: 'Revenue',
            size: 'small',
            position: { x: 1, y: 0 },
            isVisible: true,
            config: { metric: 'revenue', showTrend: true }
          },
          {
            id: 'widget-3',
            type: 'chart',
            title: 'User Activity',
            size: 'medium',
            position: { x: 0, y: 1 },
            isVisible: true,
            config: { chartType: 'line', metric: 'activity', period: '24h' }
          },
          {
            id: 'widget-4',
            type: 'alert',
            title: 'System Alerts',
            size: 'medium',
            position: { x: 2, y: 1 },
            isVisible: true,
            config: { showCritical: true, limit: 5 }
          },
          {
            id: 'widget-5',
            type: 'activity',
            title: 'Recent Admin Activity',
            size: 'large',
            position: { x: 0, y: 2 },
            isVisible: true,
            config: { limit: 10, showDetails: true }
          }
        ]
      },
      {
        id: 'executive',
        name: 'Executive Summary',
        description: 'High-level overview for executives',
        isDefault: false,
        isPublic: true,
        createdBy: 'admin-1',
        createdAt: '2024-01-15T00:00:00Z',
        updatedAt: '2024-01-20T00:00:00Z',
        widgets: [
          {
            id: 'exec-1',
            type: 'metric',
            title: 'Revenue (MTD)',
            size: 'large',
            position: { x: 0, y: 0 },
            isVisible: true,
            config: { metric: 'revenue', period: 'month', format: 'currency' }
          },
          {
            id: 'exec-2',
            type: 'chart',
            title: 'Growth Trends',
            size: 'large',
            position: { x: 2, y: 0 },
            isVisible: true,
            config: { chartType: 'area', metrics: ['users', 'revenue'], period: '30d' }
          }
        ]
      }
    ];
    
    setAvailableLayouts(mockLayouts);
    setCurrentLayout(mockLayouts[0]);
  }, []);
  
  const availableWidgetTypes = [
    {
      type: 'metric',
      name: 'Metric Card',
      description: 'Display a single key metric with trend',
      icon: '📊',
      sizes: ['small', 'medium']
    },
    {
      type: 'chart',
      name: 'Chart Widget',
      description: 'Visual data representation',
      icon: '📈',
      sizes: ['medium', 'large', 'full']
    },
    {
      type: 'table',
      name: 'Data Table',
      description: 'Tabular data display',
      icon: '📋',
      sizes: ['medium', 'large', 'full']
    },
    {
      type: 'alert',
      name: 'Alert Panel',
      description: 'System alerts and notifications',
      icon: '🚨',
      sizes: ['small', 'medium', 'large']
    },
    {
      type: 'activity',
      name: 'Activity Feed',
      description: 'Recent activities and logs',
      icon: '📝',
      sizes: ['medium', 'large']
    },
    {
      type: 'quick-action',
      name: 'Quick Actions',
      description: 'Frequently used admin actions',
      icon: '⚡',
      sizes: ['small', 'medium']
    }
  ];
  
  const handleSaveLayout = () => {
    if (currentLayout) {
      console.log('Saving layout:', currentLayout);
      // API call to save layout
      setIsCustomizing(false);
    }
  };
  
  const handleAddWidget = (type: string, size: string) => {
    if (!currentLayout) return;
    
    const newWidget: DashboardWidget = {
      id: `widget-${Date.now()}`,
      type: type as any,
      title: `New ${type} Widget`,
      size: size as any,
      position: { x: 0, y: 0 },
      isVisible: true,
      config: {}
    };
    
    setCurrentLayout({
      ...currentLayout,
      widgets: [...currentLayout.widgets, newWidget]
    });
    setShowWidgetDialog(false);
  };
  
  const handleRemoveWidget = (widgetId: string) => {
    if (!currentLayout) return;
    
    setCurrentLayout({
      ...currentLayout,
      widgets: currentLayout.widgets.filter(w => w.id !== widgetId)
    });
  };
  
  const handleToggleWidgetVisibility = (widgetId: string) => {
    if (!currentLayout) return;
    
    setCurrentLayout({
      ...currentLayout,
      widgets: currentLayout.widgets.map(w =>
        w.id === widgetId ? { ...w, isVisible: !w.isVisible } : w
      )
    });
  };
  
  const getGridSize = () => {
    switch (viewMode) {
      case 'mobile': return 'grid-cols-1';
      case 'tablet': return 'grid-cols-2 lg:grid-cols-3';
      default: return 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4';
    }
  };
  
  const getWidgetSpan = (size: string) => {
    if (viewMode === 'mobile') return 'col-span-1';
    
    switch (size) {
      case 'small': return 'col-span-1';
      case 'medium': return 'col-span-2';
      case 'large': return 'col-span-3';
      case 'full': return 'col-span-full';
      default: return 'col-span-1';
    }
  };
  
  // Render mobile view
  if (viewMode === 'mobile') {
    return <MobileAdminDashboard />;
  }
  
  return (
    <div className="space-y-6">
      {/* Dashboard Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold">Admin Dashboard</h1>
            <p className="text-muted-foreground">
              {currentLayout?.name || 'Custom Layout'}
              {isCustomizing && <Badge variant="secondary" className="ml-2">Editing</Badge>}
            </p>
          </div>
          
          {/* Connection Status */}
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`} />
            <span>{isConnected ? 'Connected' : 'Disconnected'}</span>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          {/* View Mode Selector */}
          <div className="flex items-center gap-1 border rounded-md p-1">
            <Button
              variant={viewMode === 'desktop' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('desktop')}
            >
              <Monitor className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === 'tablet' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('tablet')}
            >
              <Tablet className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === 'mobile' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('mobile')}
            >
              <Smartphone className="h-4 w-4" />
            </Button>
          </div>
          
          <AdminPresenceIndicator />
          <RealtimeAdminNotifications />
          
          {/* Layout Controls */}
          <Dialog open={showLayoutDialog} onOpenChange={setShowLayoutDialog}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm">
                <Layout className="h-4 w-4 mr-2" />
                Layouts
              </Button>
            </DialogTrigger>
            <LayoutSelector
              layouts={availableLayouts}
              currentLayout={currentLayout}
              onLayoutChange={setCurrentLayout}
              onClose={() => setShowLayoutDialog(false)}
            />
          </Dialog>
          
          {isCustomizing ? (
            <div className="flex items-center gap-2">
              <Dialog open={showWidgetDialog} onOpenChange={setShowWidgetDialog}>
                <DialogTrigger asChild>
                  <Button size="sm">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Widget
                  </Button>
                </DialogTrigger>
                <WidgetSelector
                  availableTypes={availableWidgetTypes}
                  onAddWidget={handleAddWidget}
                  onClose={() => setShowWidgetDialog(false)}
                />
              </Dialog>
              
              <Button variant="outline" size="sm" onClick={handleSaveLayout}>
                <Save className="h-4 w-4 mr-2" />
                Save
              </Button>
              
              <Button variant="outline" size="sm" onClick={() => setIsCustomizing(false)}>
                Cancel
              </Button>
            </div>
          ) : (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsCustomizing(true)}
            >
              <Edit3 className="h-4 w-4 mr-2" />
              Customize
            </Button>
          )}
        </div>
      </div>
      
      {/* Dashboard Grid */}
      {currentLayout && (
        <div className={`grid gap-4 ${getGridSize()}`}>
          {currentLayout.widgets
            .filter(widget => widget.isVisible || isCustomizing)
            .map((widget) => (
              <div
                key={widget.id}
                className={`${getWidgetSpan(widget.size)} ${
                  !widget.isVisible ? 'opacity-50' : ''
                } ${
                  isCustomizing ? 'relative group' : ''
                }`}
              >
                {isCustomizing && (
                  <div className="absolute top-2 right-2 z-10 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleToggleWidgetVisibility(widget.id)}
                    >
                      {widget.isVisible ? (
                        <Eye className="h-3 w-3" />
                      ) : (
                        <EyeOff className="h-3 w-3" />
                      )}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setSelectedWidget(widget.id)}
                    >
                      <Settings className="h-3 w-3" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleRemoveWidget(widget.id)}
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                )}
                
                <DashboardWidget widget={widget} isCustomizing={isCustomizing} />
              </div>
            ))}
        </div>
      )}
      
      {/* Widget Configuration Dialog */}
      {selectedWidget && (
        <WidgetConfigDialog
          widget={currentLayout?.widgets.find(w => w.id === selectedWidget)}
          onSave={(updatedWidget) => {
            if (currentLayout) {
              setCurrentLayout({
                ...currentLayout,
                widgets: currentLayout.widgets.map(w =>
                  w.id === selectedWidget ? updatedWidget : w
                )
              });
            }
            setSelectedWidget(null);
          }}
          onClose={() => setSelectedWidget(null)}
        />
      )}
    </div>
  );
};

// Dashboard Widget Component
const DashboardWidget: React.FC<{
  widget: DashboardWidget;
  isCustomizing: boolean;
}> = ({ widget, isCustomizing }) => {
  const renderWidgetContent = () => {
    switch (widget.type) {
      case 'metric':
        return <MetricWidget config={widget.config} />;
      case 'chart':
        return <ChartWidget config={widget.config} />;
      case 'alert':
        return <AlertWidget config={widget.config} />;
      case 'activity':
        return <ActivityWidget config={widget.config} />;
      case 'quick-action':
        return <QuickActionWidget config={widget.config} />;
      default:
        return <div className="p-4 text-center text-muted-foreground">Widget type not implemented</div>;
    }
  };
  
  return (
    <Card className={`h-full ${isCustomizing ? 'cursor-move border-dashed' : ''}`}>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm">{widget.title}</CardTitle>
        {widget.description && (
          <p className="text-xs text-muted-foreground">{widget.description}</p>
        )}
      </CardHeader>
      <CardContent className="p-4 pt-0">
        {renderWidgetContent()}
      </CardContent>
    </Card>
  );
};

// Widget Components
const MetricWidget: React.FC<{ config: any }> = ({ config }) => (
  <div className="text-center">
    <div className="text-2xl font-bold">12,543</div>
    <div className="text-xs text-green-600">+8.2% from last week</div>
  </div>
);

const ChartWidget: React.FC<{ config: any }> = ({ config }) => (
  <div className="h-32 bg-muted rounded flex items-center justify-center text-muted-foreground">
    Chart placeholder
  </div>
);

const AlertWidget: React.FC<{ config: any }> = ({ config }) => (
  <div className="space-y-2">
    <div className="flex items-center gap-2 text-sm">
      <div className="w-2 h-2 bg-red-500 rounded-full" />
      <span>High CPU usage detected</span>
    </div>
    <div className="flex items-center gap-2 text-sm">
      <div className="w-2 h-2 bg-yellow-500 rounded-full" />
      <span>Disk space running low</span>
    </div>
  </div>
);

const ActivityWidget: React.FC<{ config: any }> = ({ config }) => (
  <div className="space-y-2 text-sm">
    <div>User suspended by admin</div>
    <div>New admin user created</div>
    <div>System backup completed</div>
  </div>
);

const QuickActionWidget: React.FC<{ config: any }> = ({ config }) => (
  <div className="grid grid-cols-2 gap-2">
    <Button size="sm" variant="outline">Users</Button>
    <Button size="sm" variant="outline">Reports</Button>
    <Button size="sm" variant="outline">Settings</Button>
    <Button size="sm" variant="outline">Backup</Button>
  </div>
);

// Layout Selector Dialog
const LayoutSelector: React.FC<{
  layouts: DashboardLayout[];
  currentLayout: DashboardLayout | null;
  onLayoutChange: (layout: DashboardLayout) => void;
  onClose: () => void;
}> = ({ layouts, currentLayout, onLayoutChange, onClose }) => (
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Select Dashboard Layout</DialogTitle>
    </DialogHeader>
    <div className="space-y-3">
      {layouts.map((layout) => (
        <div
          key={layout.id}
          className={`p-3 border rounded-lg cursor-pointer transition-colors ${
            currentLayout?.id === layout.id ? 'border-primary bg-primary/5' : 'hover:bg-muted'
          }`}
          onClick={() => {
            onLayoutChange(layout);
            onClose();
          }}
        >
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium">{layout.name}</h3>
              {layout.description && (
                <p className="text-sm text-muted-foreground">{layout.description}</p>
              )}
            </div>
            <div className="flex gap-1">
              {layout.isDefault && <Badge variant="secondary">Default</Badge>}
              {layout.isPublic && <Badge variant="outline">Public</Badge>}
            </div>
          </div>
          <div className="mt-2 text-xs text-muted-foreground">
            {layout.widgets.length} widgets
          </div>
        </div>
      ))}
    </div>
  </DialogContent>
);

// Widget Selector Dialog
const WidgetSelector: React.FC<{
  availableTypes: any[];
  onAddWidget: (type: string, size: string) => void;
  onClose: () => void;
}> = ({ availableTypes, onAddWidget, onClose }) => {
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [selectedSize, setSelectedSize] = useState<string>('medium');
  
  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Add Widget</DialogTitle>
      </DialogHeader>
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          {availableTypes.map((type) => (
            <div
              key={type.type}
              className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                selectedType === type.type ? 'border-primary bg-primary/5' : 'hover:bg-muted'
              }`}
              onClick={() => setSelectedType(type.type)}
            >
              <div className="text-2xl mb-2">{type.icon}</div>
              <h3 className="font-medium">{type.name}</h3>
              <p className="text-xs text-muted-foreground">{type.description}</p>
            </div>
          ))}
        </div>
        
        {selectedType && (
          <div>
            <Label>Size</Label>
            <Select value={selectedSize} onValueChange={setSelectedSize}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {availableTypes
                  .find(t => t.type === selectedType)
                  ?.sizes.map((size: string) => (
                    <SelectItem key={size} value={size}>
                      {size.charAt(0).toUpperCase() + size.slice(1)}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
          </div>
        )}
        
        <div className="flex gap-2">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            onClick={() => {
              if (selectedType) {
                onAddWidget(selectedType, selectedSize);
              }
            }}
            disabled={!selectedType}
          >
            Add Widget
          </Button>
        </div>
      </div>
    </DialogContent>
  );
};

// Widget Configuration Dialog
const WidgetConfigDialog: React.FC<{
  widget?: DashboardWidget;
  onSave: (widget: DashboardWidget) => void;
  onClose: () => void;
}> = ({ widget, onSave, onClose }) => {
  const [title, setTitle] = useState(widget?.title || '');
  const [description, setDescription] = useState(widget?.description || '');
  
  if (!widget) return null;
  
  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Configure Widget</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label>Title</Label>
            <Input value={title} onChange={(e) => setTitle(e.target.value)} />
          </div>
          
          <div>
            <Label>Description</Label>
            <Textarea value={description} onChange={(e) => setDescription(e.target.value)} />
          </div>
          
          <div className="flex gap-2">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button
              onClick={() => {
                onSave({
                  ...widget,
                  title,
                  description
                });
              }}
            >
              Save Changes
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
