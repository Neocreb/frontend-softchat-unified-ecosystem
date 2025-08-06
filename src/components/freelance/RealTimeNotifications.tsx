import React, { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  Bell,
  MessageCircle,
  DollarSign,
  FileText,
  CheckCircle,
  Clock,
  AlertTriangle,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface Notification {
  id: string;
  type: "message" | "payment" | "proposal" | "milestone" | "deadline" | "system";
  title: string;
  description: string;
  timestamp: Date;
  read: boolean;
  actionUrl?: string;
}

interface NotificationBadgeProps {
  count: number;
  className?: string;
}

export const NotificationBadge: React.FC<NotificationBadgeProps> = ({ count, className }) => {
  if (count === 0) return null;
  
  return (
    <Badge 
      variant="destructive" 
      className={cn(
        "absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center text-xs min-w-5 rounded-full animate-pulse",
        className
      )}
    >
      {count > 99 ? "99+" : count}
    </Badge>
  );
};

interface RealTimeNotificationsProps {
  userType: "freelancer" | "client";
}

export const RealTimeNotifications: React.FC<RealTimeNotificationsProps> = ({ userType }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  // Mock real-time notifications - in real app, this would be WebSocket/SSE
  useEffect(() => {
    const mockNotifications: Notification[] = [
      {
        id: "1",
        type: "message",
        title: "New message from Sarah Johnson",
        description: "Regarding the e-commerce project timeline",
        timestamp: new Date(Date.now() - 5 * 60 * 1000), // 5 minutes ago
        read: false,
        actionUrl: "/app/chat",
      },
      {
        id: "2", 
        type: "payment",
        title: "Payment received",
        description: "$1,500 milestone payment processed",
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
        read: false,
      },
      {
        id: "3",
        type: "proposal",
        title: userType === "client" ? "New proposal received" : "Proposal viewed",
        description: userType === "client" 
          ? "Marcus Chen submitted a proposal for Mobile App Design"
          : "Client Alice viewed your proposal for Website Redesign",
        timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000), // 4 hours ago
        read: true,
      },
      {
        id: "4",
        type: "deadline",
        title: "Deadline approaching",
        description: "E-commerce wireframes due in 2 days",
        timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000), // 6 hours ago
        read: false,
      },
      {
        id: "5",
        type: "milestone",
        title: "Milestone completed",
        description: "Initial design phase approved by client",
        timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
        read: true,
      },
    ];

    setNotifications(mockNotifications);

    // Simulate real-time updates
    const interval = setInterval(() => {
      if (Math.random() > 0.8) { // 20% chance every 10 seconds
        const newNotification: Notification = {
          id: `${Date.now()}`,
          type: ["message", "payment", "proposal"][Math.floor(Math.random() * 3)] as any,
          title: "New activity",
          description: "Something happened in your account",
          timestamp: new Date(),
          read: false,
        };
        setNotifications(prev => [newNotification, ...prev.slice(0, 9)]); // Keep last 10
      }
    }, 10000);

    return () => clearInterval(interval);
  }, [userType]);

  const unreadCount = notifications.filter(n => !n.read).length;

  const getNotificationIcon = (type: Notification["type"]) => {
    switch (type) {
      case "message":
        return <MessageCircle className="w-4 h-4 text-blue-600" />;
      case "payment":
        return <DollarSign className="w-4 h-4 text-green-600" />;
      case "proposal":
        return <FileText className="w-4 h-4 text-purple-600" />;
      case "milestone":
        return <CheckCircle className="w-4 h-4 text-emerald-600" />;
      case "deadline":
        return <Clock className="w-4 h-4 text-orange-600" />;
      case "system":
        return <AlertTriangle className="w-4 h-4 text-yellow-600" />;
      default:
        return <Bell className="w-4 h-4 text-gray-600" />;
    }
  };

  const formatTimestamp = (timestamp: Date) => {
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - timestamp.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return "Just now";
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours}h ago`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays}d ago`;
  };

  const markAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(n => n.id === id ? { ...n, read: true } : n)
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const removeNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="relative">
          <Bell className="h-5 w-5" />
          <NotificationBadge count={unreadCount} />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80 max-h-96 overflow-y-auto">
        <div className="flex items-center justify-between p-4 border-b">
          <h3 className="font-semibold">Notifications</h3>
          {unreadCount > 0 && (
            <Button variant="ghost" size="sm" onClick={markAllAsRead}>
              Mark all read
            </Button>
          )}
        </div>
        
        {notifications.length === 0 ? (
          <div className="p-4 text-center text-gray-500">
            <Bell className="w-8 h-8 mx-auto mb-2 text-gray-400" />
            <p>No notifications yet</p>
          </div>
        ) : (
          <div className="max-h-80 overflow-y-auto">
            {notifications.map((notification) => (
              <div
                key={notification.id}
                className={cn(
                  "flex items-start gap-3 p-4 border-b hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer",
                  !notification.read && "bg-blue-50/50 dark:bg-blue-900/10"
                )}
                onClick={() => {
                  markAsRead(notification.id);
                  if (notification.actionUrl) {
                    // Navigate to action URL
                    window.location.href = notification.actionUrl;
                  }
                }}
              >
                <div className="flex-shrink-0 p-2 bg-gray-100 dark:bg-gray-700 rounded-full">
                  {getNotificationIcon(notification.type)}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between">
                    <p className={cn(
                      "text-sm font-medium truncate",
                      !notification.read && "font-semibold"
                    )}>
                      {notification.title}
                    </p>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100"
                      onClick={(e) => {
                        e.stopPropagation();
                        removeNotification(notification.id);
                      }}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                  <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                    {notification.description}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    {formatTimestamp(notification.timestamp)}
                  </p>
                </div>
                
                {!notification.read && (
                  <div className="w-2 h-2 bg-blue-600 rounded-full flex-shrink-0 mt-2" />
                )}
              </div>
            ))}
          </div>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

// Activity indicator for live updates
interface ActivityIndicatorProps {
  isActive: boolean;
  label: string;
}

export const ActivityIndicator: React.FC<ActivityIndicatorProps> = ({ isActive, label }) => {
  return (
    <div className="flex items-center gap-2">
      <div 
        className={cn(
          "w-2 h-2 rounded-full",
          isActive ? "bg-green-500 animate-pulse" : "bg-gray-400"
        )}
      />
      <span className="text-xs text-gray-600 dark:text-gray-400">{label}</span>
    </div>
  );
};

export default RealTimeNotifications;
