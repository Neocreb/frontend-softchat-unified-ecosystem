import React, { useState, useEffect } from 'react';
import { Bell, AlertTriangle, Info, CheckCircle, X, Users, Clock, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Separator } from '@/components/ui/separator';
import { useAdminWebSocket, AdminWebSocketMessage } from '@/hooks/use-admin-websocket';
import { formatDistanceToNow } from 'date-fns';

interface AdminNotification {
  id: string;
  type: AdminWebSocketMessage['type'];
  title: string;
  message: string;
  priority: AdminWebSocketMessage['priority'];
  timestamp: string;
  isRead: boolean;
  actionUrl?: string;
  from?: string;
}

export const RealtimeAdminNotifications: React.FC = () => {
  const [notifications, setNotifications] = useState<AdminNotification[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  
  const { unreadAlerts, lastMessage, markAlertsRead } = useAdminWebSocket();
  
  const priorityConfig = {
    urgent: { icon: AlertTriangle, color: 'text-red-500', bgColor: 'bg-red-50' },
    high: { icon: AlertTriangle, color: 'text-orange-500', bgColor: 'bg-orange-50' },
    medium: { icon: Info, color: 'text-blue-500', bgColor: 'bg-blue-50' },
    low: { icon: CheckCircle, color: 'text-green-500', bgColor: 'bg-green-50' }
  };
  
  // Process incoming WebSocket messages
  useEffect(() => {
    if (lastMessage) {
      const notification: AdminNotification = {
        id: `${Date.now()}-${Math.random()}`,
        type: lastMessage.type,
        title: getNotificationTitle(lastMessage),
        message: getNotificationMessage(lastMessage),
        priority: lastMessage.priority,
        timestamp: lastMessage.timestamp,
        isRead: false,
        from: lastMessage.from
      };
      
      setNotifications(prev => [notification, ...prev.slice(0, 49)]); // Keep last 50
    }
  }, [lastMessage]);
  
  const getNotificationTitle = (message: AdminWebSocketMessage): string => {
    switch (message.type) {
      case 'admin_alert':
        return 'Admin Alert';
      case 'moderation_update':
        return 'Moderation Update';
      case 'user_action':
        return 'User Action Required';
      case 'system_alert':
        return 'System Alert';
      case 'collaboration_update':
        return 'Team Update';
      default:
        return 'Notification';
    }
  };
  
  const getNotificationMessage = (message: AdminWebSocketMessage): string => {
    if (typeof message.data === 'string') {
      return message.data;
    }
    
    switch (message.type) {
      case 'admin_alert':
        return message.data.message || 'New admin alert received';
      case 'moderation_update':
        return `${message.data.count || 0} items pending moderation`;
      case 'user_action':
        return message.data.description || 'User action required';
      case 'system_alert':
        return message.data.message || 'System alert triggered';
      case 'collaboration_update':
        const collab = message.data;
        if (collab.type === 'case_assigned') {
          return `New case assigned: ${collab.caseId}`;
        }
        return collab.message || 'Team collaboration update';
      default:
        return 'New notification received';
    }
  };
  
  const markAsRead = (notificationId: string) => {
    setNotifications(prev =>
      prev.map(n => n.id === notificationId ? { ...n, isRead: true } : n)
    );
  };
  
  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
    markAlertsRead();
  };
  
  const clearAll = () => {
    setNotifications([]);
    markAlertsRead();
  };
  
  const unreadCount = notifications.filter(n => !n.isRead).length;
  
  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="relative"
          onClick={() => setIsOpen(!isOpen)}
        >
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <Badge 
              variant="destructive" 
              className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 text-xs flex items-center justify-center"
            >
              {unreadCount > 99 ? '99+' : unreadCount}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>
      
      <PopoverContent className="w-96 p-0" align="end">
        <Card className="border-0 shadow-lg">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Notifications</CardTitle>
              <div className="flex items-center gap-2">
                {unreadCount > 0 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={markAllAsRead}
                    className="text-xs"
                  >
                    Mark all read
                  </Button>
                )}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearAll}
                  className="text-xs"
                >
                  Clear all
                </Button>
              </div>
            </div>
            {unreadCount > 0 && (
              <div className="text-sm text-muted-foreground">
                {unreadCount} unread notification{unreadCount !== 1 ? 's' : ''}
              </div>
            )}
          </CardHeader>
          
          <Separator />
          
          <ScrollArea className="h-96">
            <CardContent className="p-0">
              {notifications.length === 0 ? (
                <div className="p-6 text-center text-muted-foreground">
                  <Bell className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p>No notifications yet</p>
                </div>
              ) : (
                <div className="divide-y">
                  {notifications.map((notification) => {
                    const config = priorityConfig[notification.priority];
                    const Icon = config.icon;
                    
                    return (
                      <div
                        key={notification.id}
                        className={`p-4 hover:bg-muted/50 cursor-pointer transition-colors ${
                          !notification.isRead ? 'bg-muted/30' : ''
                        }`}
                        onClick={() => markAsRead(notification.id)}
                      >
                        <div className="flex items-start gap-3">
                          <div className={`p-1 rounded-full ${config.bgColor}`}>
                            <Icon className={`h-4 w-4 ${config.color}`} />
                          </div>
                          
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                              <p className="font-medium text-sm truncate">
                                {notification.title}
                              </p>
                              <div className="flex items-center gap-1">
                                <Badge
                                  variant={notification.priority === 'urgent' ? 'destructive' : 'secondary'}
                                  className="text-xs"
                                >
                                  {notification.priority}
                                </Badge>
                                {!notification.isRead && (
                                  <div className="w-2 h-2 bg-blue-500 rounded-full" />
                                )}
                              </div>
                            </div>
                            
                            <p className="text-sm text-muted-foreground mt-1">
                              {notification.message}
                            </p>
                            
                            <div className="flex items-center justify-between mt-2">
                              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                <Clock className="h-3 w-3" />
                                {formatDistanceToNow(new Date(notification.timestamp), { addSuffix: true })}
                              </div>
                              
                              {notification.from && (
                                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                  <Users className="h-3 w-3" />
                                  {notification.from}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </ScrollArea>
        </Card>
      </PopoverContent>
    </Popover>
  );
};

// Admin Presence Indicator Component
export const AdminPresenceIndicator: React.FC = () => {
  const { onlineAdmins, isConnected } = useAdminWebSocket();
  
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="sm" className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`} />
          <Users className="h-4 w-4" />
          <span className="text-sm">{onlineAdmins.length}</span>
        </Button>
      </PopoverTrigger>
      
      <PopoverContent className="w-64" align="end">
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="font-medium">Online Admins</h4>
            <Badge variant="secondary">{onlineAdmins.length} online</Badge>
          </div>
          
          <Separator />
          
          <ScrollArea className="max-h-48">
            <div className="space-y-2">
              {onlineAdmins.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-4">
                  No admins online
                </p>
              ) : (
                onlineAdmins.map((admin) => (
                  <div key={admin.adminId} className="flex items-center gap-3">
                    <div className={`w-2 h-2 rounded-full ${
                      admin.status === 'online' ? 'bg-green-500' :
                      admin.status === 'away' ? 'bg-yellow-500' :
                      admin.status === 'busy' ? 'bg-red-500' : 'bg-gray-500'
                    }`} />
                    
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{admin.name}</p>
                      <p className="text-xs text-muted-foreground">{admin.role}</p>
                    </div>
                    
                    <div className="text-xs text-muted-foreground">
                      {admin.currentSection && (
                        <div className="truncate max-w-20">
                          {admin.currentSection.split('/').pop()}
                        </div>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </ScrollArea>
        </div>
      </PopoverContent>
    </Popover>
  );
};

// Live Connection Status
export const AdminConnectionStatus: React.FC = () => {
  const { isConnected } = useAdminWebSocket();
  
  return (
    <div className="flex items-center gap-2 text-xs text-muted-foreground">
      <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`} />
      <span>{isConnected ? 'Connected' : 'Disconnected'}</span>
    </div>
  );
};
