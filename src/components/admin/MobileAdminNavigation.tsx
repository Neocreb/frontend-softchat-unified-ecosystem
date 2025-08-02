import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Menu, 
  X, 
  ChevronDown, 
  ChevronRight,
  Search,
  Bell,
  Users,
  Settings,
  Home,
  BarChart3,
  Shield,
  Eye,
  Briefcase,
  ShoppingCart,
  Bitcoin,
  MessageSquare,
  Activity,
  Database,
  CreditCard,
  Zap,
  FileText,
  AlertTriangle,
  UserCog,
  Globe,
  Star,
  Flag
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import { useAdmin } from '@/contexts/AdminContext';
import { RealtimeAdminNotifications, AdminPresenceIndicator } from './RealtimeAdminNotifications';

interface AdminNavItem {
  id: string;
  title: string;
  href?: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
  children?: AdminNavItem[];
  permissions?: string[];
  description?: string;
  isNew?: boolean;
  isImportant?: boolean;
}

const adminNavItems: AdminNavItem[] = [
  {
    id: 'dashboard',
    title: 'Dashboard',
    href: '/admin/dashboard',
    icon: BarChart3,
    description: 'Platform overview and analytics'
  },
  {
    id: 'users',
    title: 'User Management',
    icon: Users,
    badge: '12',
    description: 'Manage users and permissions',
    children: [
      { id: 'users-list', title: 'All Users', href: '/admin/users', icon: Users },
      { id: 'users-pending', title: 'Pending Verification', href: '/admin/users?status=pending', icon: Clock, badge: '8' },
      { id: 'users-suspended', title: 'Suspended Users', href: '/admin/users?status=suspended', icon: UserX },
      { id: 'users-roles', title: 'Roles & Permissions', href: '/admin/users/roles', icon: Shield }
    ]
  },
  {
    id: 'content',
    title: 'Content & Moderation',
    icon: Eye,
    badge: '5',
    isImportant: true,
    description: 'Monitor and moderate platform content',
    children: [
      { id: 'moderation', title: 'Moderation Queue', href: '/admin/moderation', icon: Eye, badge: '5', isImportant: true },
      { id: 'reports', title: 'User Reports', href: '/admin/reports', icon: Flag, badge: '3' },
      { id: 'content-policy', title: 'Content Policies', href: '/admin/content/policies', icon: FileText },
      { id: 'auto-mod', title: 'Auto Moderation', href: '/admin/content/auto-mod', icon: Bot }
    ]
  },
  {
    id: 'business',
    title: 'Business Operations',
    icon: Briefcase,
    description: 'Manage business features',
    children: [
      { id: 'freelance', title: 'Freelance Platform', href: '/admin/freelance', icon: Briefcase },
      { id: 'marketplace', title: 'Marketplace', href: '/admin/marketplace', icon: ShoppingCart },
      { id: 'crypto', title: 'Crypto Trading', href: '/admin/crypto', icon: Bitcoin },
      { id: 'campaigns', title: 'Ad Campaigns', href: '/admin/campaigns', icon: Zap }
    ]
  },
  {
    id: 'financial',
    title: 'Financial',
    icon: CreditCard,
    description: 'Financial oversight and transactions',
    children: [
      { id: 'earnings', title: 'Platform Earnings', href: '/admin/financial/earnings', icon: DollarSign },
      { id: 'transactions', title: 'Transactions', href: '/admin/financial/transactions', icon: CreditCard },
      { id: 'disputes', title: 'Payment Disputes', href: '/admin/financial/disputes', icon: AlertTriangle, badge: '2' },
      { id: 'wallets', title: 'Wallet Management', href: '/admin/financial/wallets', icon: Wallet }
    ]
  },
  {
    id: 'communication',
    title: 'Communication',
    icon: MessageSquare,
    description: 'Messaging and notifications',
    children: [
      { id: 'messages', title: 'Chat Monitoring', href: '/admin/chat', icon: MessageSquare },
      { id: 'notifications', title: 'Push Notifications', href: '/admin/notifications', icon: Bell },
      { id: 'email-campaigns', title: 'Email Campaigns', href: '/admin/email', icon: Mail },
      { id: 'announcements', title: 'Announcements', href: '/admin/announcements', icon: Megaphone }
    ]
  },
  {
    id: 'analytics',
    title: 'Analytics & Reports',
    icon: Activity,
    description: 'Platform analytics and insights',
    children: [
      { id: 'analytics-overview', title: 'Overview', href: '/admin/analytics', icon: Activity },
      { id: 'user-analytics', title: 'User Analytics', href: '/admin/analytics/users', icon: Users },
      { id: 'revenue-analytics', title: 'Revenue Analytics', href: '/admin/analytics/revenue', icon: DollarSign },
      { id: 'performance', title: 'Performance Metrics', href: '/admin/analytics/performance', icon: TrendingUp }
    ]
  },
  {
    id: 'system',
    title: 'System Management',
    icon: Database,
    description: 'System health and configuration',
    children: [
      { id: 'system-health', title: 'System Health', href: '/admin/system/health', icon: Database },
      { id: 'logs', title: 'System Logs', href: '/admin/logs', icon: FileText },
      { id: 'security', title: 'Security Center', href: '/admin/security', icon: Shield },
      { id: 'backups', title: 'Backups', href: '/admin/system/backups', icon: HardDrive }
    ]
  },
  {
    id: 'admin-management',
    title: 'Admin Management',
    icon: UserCog,
    description: 'Manage admin users and teams',
    children: [
      { id: 'admin-users', title: 'Admin Users', href: '/admin/management/users', icon: UserCog },
      { id: 'admin-roles', title: 'Admin Roles', href: '/admin/management/roles', icon: Shield },
      { id: 'admin-teams', title: 'Teams', href: '/admin/management/teams', icon: Users },
      { id: 'admin-activity', title: 'Admin Activity', href: '/admin/management/activity', icon: Activity }
    ]
  },
  {
    id: 'settings',
    title: 'Platform Settings',
    icon: Settings,
    description: 'Platform configuration',
    children: [
      { id: 'general-settings', title: 'General Settings', href: '/admin/settings/general', icon: Settings },
      { id: 'feature-flags', title: 'Feature Flags', href: '/admin/settings/features', icon: Flag },
      { id: 'integrations', title: 'Integrations', href: '/admin/settings/integrations', icon: Globe },
      { id: 'maintenance', title: 'Maintenance Mode', href: '/admin/settings/maintenance', icon: AlertTriangle }
    ]
  }
];

export const MobileAdminNavigation: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedItems, setExpandedItems] = useState<string[]>([]);
  const location = useLocation();
  const { adminUser } = useAdmin();
  
  // Auto-expand current section
  useEffect(() => {
    const currentPath = location.pathname;
    adminNavItems.forEach(item => {
      if (item.children?.some(child => child.href === currentPath)) {
        setExpandedItems(prev => [...prev.filter(id => id !== item.id), item.id]);
      }
    });
  }, [location.pathname]);
  
  const toggleExpanded = (itemId: string) => {
    setExpandedItems(prev => 
      prev.includes(itemId) 
        ? prev.filter(id => id !== itemId)
        : [...prev, itemId]
    );
  };
  
  const filteredItems = adminNavItems.filter(item => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      item.title.toLowerCase().includes(query) ||
      item.description?.toLowerCase().includes(query) ||
      item.children?.some(child => 
        child.title.toLowerCase().includes(query)
      )
    );
  });
  
  const isCurrentPath = (href: string) => location.pathname === href;
  
  const hasActiveChild = (item: AdminNavItem) => {
    return item.children?.some(child => child.href && isCurrentPath(child.href)) || false;
  };
  
  return (
    <>
      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-background border-b">
        <div className="flex items-center justify-between p-4">
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="sm" className="p-0">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            
            <SheetContent side="left" className="w-80 p-0">
              <div className="flex flex-col h-full">
                <SheetHeader className="p-4 border-b">
                  <div className="flex items-center justify-between">
                    <SheetTitle className="text-left">
                      Admin Panel
                    </SheetTitle>
                    <AdminPresenceIndicator />
                  </div>
                  
                  {adminUser && (
                    <div className="text-left">
                      <p className="text-sm font-medium">{adminUser.name}</p>
                      <p className="text-xs text-muted-foreground">{adminUser.role}</p>
                    </div>
                  )}
                </SheetHeader>
                
                {/* Search */}
                <div className="p-4 border-b">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search admin functions..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                
                {/* Navigation */}
                <ScrollArea className="flex-1 px-2">
                  <div className="space-y-1 py-2">
                    {filteredItems.map((item) => (
                      <NavItem
                        key={item.id}
                        item={item}
                        isExpanded={expandedItems.includes(item.id)}
                        onToggleExpanded={() => toggleExpanded(item.id)}
                        isCurrentPath={isCurrentPath}
                        hasActiveChild={hasActiveChild(item)}
                        onItemClick={() => setIsOpen(false)}
                      />
                    ))}
                  </div>
                </ScrollArea>
                
                {/* Quick Actions */}
                <div className="p-4 border-t bg-muted/50">
                  <div className="grid grid-cols-2 gap-2">
                    <Button size="sm" variant="outline" className="justify-start">
                      <AlertTriangle className="h-4 w-4 mr-2" />
                      Emergency
                    </Button>
                    <Button size="sm" variant="outline" className="justify-start">
                      <Settings className="h-4 w-4 mr-2" />
                      Settings
                    </Button>
                  </div>
                </div>
              </div>
            </SheetContent>
          </Sheet>
          
          <div className="flex items-center gap-2">
            <h1 className="font-semibold truncate">Admin Dashboard</h1>
          </div>
          
          <RealtimeAdminNotifications />
        </div>
      </div>
      
      {/* Mobile spacing */}
      <div className="h-16 lg:hidden" />
    </>
  );
};

// Navigation Item Component
const NavItem: React.FC<{
  item: AdminNavItem;
  isExpanded: boolean;
  onToggleExpanded: () => void;
  isCurrentPath: (href: string) => boolean;
  hasActiveChild: boolean;
  onItemClick: () => void;
}> = ({ item, isExpanded, onToggleExpanded, isCurrentPath, hasActiveChild, onItemClick }) => {
  const Icon = item.icon;
  const hasChildren = item.children && item.children.length > 0;
  const isCurrent = item.href ? isCurrentPath(item.href) : false;
  const isActive = isCurrent || hasActiveChild;
  
  return (
    <div className="space-y-1">
      {hasChildren ? (
        <Collapsible open={isExpanded} onOpenChange={onToggleExpanded}>
          <CollapsibleTrigger asChild>
            <Button
              variant="ghost"
              className={cn(
                "w-full justify-between text-left h-auto p-3",
                isActive && "bg-accent text-accent-foreground"
              )}
            >
              <div className="flex items-center gap-3">
                <Icon className="h-4 w-4 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-medium truncate">{item.title}</span>
                    {item.badge && (
                      <Badge 
                        variant={item.isImportant ? "destructive" : "secondary"} 
                        className="text-xs h-4 px-1"
                      >
                        {item.badge}
                      </Badge>
                    )}
                    {item.isNew && (
                      <Badge variant="default" className="text-xs h-4 px-1">
                        New
                      </Badge>
                    )}
                  </div>
                  {item.description && (
                    <p className="text-xs text-muted-foreground truncate mt-1">
                      {item.description}
                    </p>
                  )}
                </div>
              </div>
              
              {isExpanded ? (
                <ChevronDown className="h-4 w-4 flex-shrink-0" />
              ) : (
                <ChevronRight className="h-4 w-4 flex-shrink-0" />
              )}
            </Button>
          </CollapsibleTrigger>
          
          <CollapsibleContent className="space-y-1 ml-4">
            {item.children?.map((child) => {
              const ChildIcon = child.icon;
              const isChildCurrent = child.href ? isCurrentPath(child.href) : false;
              
              return (
                <Button
                  key={child.id}
                  variant="ghost"
                  asChild
                  className={cn(
                    "w-full justify-start text-left h-auto p-2 pl-6",
                    isChildCurrent && "bg-accent text-accent-foreground"
                  )}
                >
                  <Link to={child.href || '#'} onClick={onItemClick}>
                    <ChildIcon className="h-4 w-4 mr-3 flex-shrink-0" />
                    <span className="flex-1 truncate">{child.title}</span>
                    {child.badge && (
                      <Badge 
                        variant={child.isImportant ? "destructive" : "secondary"} 
                        className="text-xs h-4 px-1 ml-2"
                      >
                        {child.badge}
                      </Badge>
                    )}
                  </Link>
                </Button>
              );
            })}
          </CollapsibleContent>
        </Collapsible>
      ) : (
        <Button
          variant="ghost"
          asChild
          className={cn(
            "w-full justify-start text-left h-auto p-3",
            isCurrent && "bg-accent text-accent-foreground"
          )}
        >
          <Link to={item.href || '#'} onClick={onItemClick}>
            <Icon className="h-4 w-4 mr-3 flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="font-medium truncate">{item.title}</span>
                {item.badge && (
                  <Badge 
                    variant={item.isImportant ? "destructive" : "secondary"} 
                    className="text-xs h-4 px-1"
                  >
                    {item.badge}
                  </Badge>
                )}
                {item.isNew && (
                  <Badge variant="default" className="text-xs h-4 px-1">
                    New
                  </Badge>
                )}
              </div>
              {item.description && (
                <p className="text-xs text-muted-foreground truncate mt-1">
                  {item.description}
                </p>
              )}
            </div>
          </Link>
        </Button>
      )}
    </div>
  );
};

// Quick Action FAB for Mobile
export const MobileAdminFAB: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  
  const quickActions = [
    { id: 'emergency', title: 'Emergency Mode', icon: AlertTriangle, href: '/admin/emergency' },
    { id: 'moderation', title: 'Quick Moderate', icon: Eye, href: '/admin/moderation' },
    { id: 'user-lookup', title: 'User Lookup', icon: Search, href: '/admin/users/search' },
    { id: 'system-status', title: 'System Status', icon: Database, href: '/admin/system/health' }
  ];
  
  return (
    <div className="lg:hidden fixed bottom-6 right-6 z-50">
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger asChild>
          <Button size="lg" className="rounded-full h-14 w-14 shadow-lg">
            <Settings className="h-6 w-6" />
          </Button>
        </SheetTrigger>
        
        <SheetContent side="bottom" className="h-auto">
          <SheetHeader>
            <SheetTitle>Quick Actions</SheetTitle>
          </SheetHeader>
          
          <div className="grid grid-cols-2 gap-4 mt-4">
            {quickActions.map((action) => {
              const Icon = action.icon;
              return (
                <Button
                  key={action.id}
                  variant="outline"
                  asChild
                  className="h-20 flex-col gap-2"
                >
                  <Link to={action.href} onClick={() => setIsOpen(false)}>
                    <Icon className="h-6 w-6" />
                    <span className="text-sm">{action.title}</span>
                  </Link>
                </Button>
              );
            })}
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
};

// Emergency Alert Banner
export const EmergencyAlertBanner: React.FC<{
  isVisible: boolean;
  message: string;
  onDismiss: () => void;
}> = ({ isVisible, message, onDismiss }) => {
  if (!isVisible) return null;
  
  return (
    <div className="lg:hidden fixed top-16 left-0 right-0 z-40 bg-red-500 text-white p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <AlertTriangle className="h-5 w-5" />
          <span className="font-medium">{message}</span>
        </div>
        <Button variant="ghost" size="sm" onClick={onDismiss} className="text-white">
          <X className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};
