import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Bell,
  X,
  Trophy,
  DollarSign,
  Target,
  Star,
  Gift,
  Zap,
  TrendingUp,
  Award
} from "lucide-react";
import { formatCurrency } from "@/utils/formatters";
import { cn } from "@/lib/utils";

interface Notification {
  id: string;
  type: 'earning' | 'achievement' | 'battle' | 'challenge' | 'goal' | 'bonus';
  title: string;
  message: string;
  amount?: number;
  timestamp: Date;
  read: boolean;
  priority: 'low' | 'medium' | 'high';
}

interface NotificationSystemProps {
  className?: string;
}

const NotificationSystem = ({ className }: NotificationSystemProps) => {
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: "1",
      type: "earning",
      title: "Battle Vote Won! 🎯",
      message: "Your vote on Alex Dance vs Music Mike was successful!",
      amount: 87.50,
      timestamp: new Date(Date.now() - 2 * 60 * 1000), // 2 minutes ago
      read: false,
      priority: "high"
    },
    {
      id: "2",
      type: "achievement",
      title: "Achievement Unlocked! 🏆",
      message: "Battle Master - Win 5 battle votes in a row",
      timestamp: new Date(Date.now() - 5 * 60 * 1000), // 5 minutes ago
      read: false,
      priority: "medium"
    },
    {
      id: "3",
      type: "earning",
      title: "Gift Received! 🎁",
      message: "Received Crown gift during live stream",
      amount: 25.0,
      timestamp: new Date(Date.now() - 15 * 60 * 1000), // 15 minutes ago
      read: false,
      priority: "medium"
    },
    {
      id: "4",
      type: "challenge",
      title: "Challenge Completed! ⭐",
      message: "Daily streak challenge - 7 days completed",
      amount: 12.5,
      timestamp: new Date(Date.now() - 30 * 60 * 1000), // 30 minutes ago
      read: true,
      priority: "low"
    },
    {
      id: "5",
      type: "goal",
      title: "Goal Progress! 📈",
      message: "You've reached 75% of your weekly earning goal",
      timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000), // 1 hour ago
      read: true,
      priority: "low"
    }
  ]);

  const [showNotifications, setShowNotifications] = useState(false);

  // Simulate real-time notifications
  useEffect(() => {
    const interval = setInterval(() => {
      // Randomly add new notifications
      if (Math.random() > 0.95) { // 5% chance every 3 seconds
        const newNotification: Notification = {
          id: Date.now().toString(),
          type: ["earning", "achievement", "battle", "challenge"][Math.floor(Math.random() * 4)] as any,
          title: "New Reward Earned! ⚡",
          message: "You earned points for engaging with content",
          amount: Math.floor(Math.random() * 50) + 5,
          timestamp: new Date(),
          read: false,
          priority: "medium"
        };
        
        setNotifications(prev => [newNotification, ...prev.slice(0, 9)]); // Keep only latest 10
      }
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const unreadCount = notifications.filter(n => !n.read).length;

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'earning': return <DollarSign className="h-4 w-4 text-green-500" />;
      case 'achievement': return <Trophy className="h-4 w-4 text-yellow-500" />;
      case 'battle': return <Target className="h-4 w-4 text-blue-500" />;
      case 'challenge': return <Star className="h-4 w-4 text-purple-500" />;
      case 'goal': return <TrendingUp className="h-4 w-4 text-orange-500" />;
      case 'bonus': return <Gift className="h-4 w-4 text-pink-500" />;
      default: return <Bell className="h-4 w-4 text-gray-500" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'border-l-red-500 bg-red-50';
      case 'medium': return 'border-l-yellow-500 bg-yellow-50';
      case 'low': return 'border-l-blue-500 bg-blue-50';
      default: return 'border-l-gray-500 bg-gray-50';
    }
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

  const formatTimeAgo = (timestamp: Date) => {
    const now = new Date();
    const diff = now.getTime() - timestamp.getTime();
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    
    if (minutes < 1) return "Just now";
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return timestamp.toLocaleDateString();
  };

  return (
    <div className={cn("relative", className)}>
      {/* Notification Bell */}
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setShowNotifications(!showNotifications)}
        className="relative"
      >
        <Bell className="h-5 w-5" />
        {unreadCount > 0 && (
          <Badge
            variant="destructive"
            className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs"
          >
            {unreadCount > 9 ? '9+' : unreadCount}
          </Badge>
        )}
      </Button>

      {/* Notifications Dropdown */}
      {showNotifications && (
        <Card className="absolute right-0 top-12 z-50 w-80 max-h-96 shadow-lg border">
          <CardContent className="p-0">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b">
              <div className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                <h3 className="font-semibold">Notifications</h3>
                {unreadCount > 0 && (
                  <Badge variant="secondary" className="text-xs">
                    {unreadCount} new
                  </Badge>
                )}
              </div>
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
                  size="icon"
                  onClick={() => setShowNotifications(false)}
                  className="h-6 w-6"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Notifications List */}
            <div className="max-h-80 overflow-y-auto">
              {notifications.length > 0 ? (
                <div className="space-y-1">
                  {notifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={cn(
                        "p-3 border-l-4 hover:bg-gray-50 cursor-pointer transition-colors",
                        getPriorityColor(notification.priority),
                        !notification.read && "font-medium"
                      )}
                      onClick={() => markAsRead(notification.id)}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-start gap-2 flex-1">
                          {getNotificationIcon(notification.type)}
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium truncate">
                              {notification.title}
                            </p>
                            <p className="text-xs text-muted-foreground mt-1">
                              {notification.message}
                            </p>
                            {notification.amount && (
                              <p className="text-xs text-green-600 font-medium mt-1">
                                +{formatCurrency(notification.amount)}
                              </p>
                            )}
                            <p className="text-xs text-gray-400 mt-1">
                              {formatTimeAgo(notification.timestamp)}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-1">
                          {!notification.read && (
                            <div className="w-2 h-2 bg-blue-500 rounded-full" />
                          )}
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={(e) => {
                              e.stopPropagation();
                              removeNotification(notification.id);
                            }}
                            className="h-6 w-6 hover:bg-red-100"
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-8 text-center">
                  <Bell className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground">
                    No notifications yet
                  </p>
                </div>
              )}
            </div>

            {/* Footer */}
            {notifications.length > 0 && (
              <div className="p-3 border-t bg-gray-50">
                <Button variant="ghost" className="w-full text-sm">
                  View all notifications
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Toast-style notifications for real-time updates */}
      <div className="fixed top-20 right-4 z-50 space-y-2">
        {notifications
          .filter(n => !n.read && (new Date().getTime() - n.timestamp.getTime()) < 10000) // Show for 10 seconds
          .slice(0, 3) // Maximum 3 toasts
          .map((notification) => (
            <Card
              key={`toast-${notification.id}`}
              className={cn(
                "w-80 shadow-lg border-l-4 animate-in slide-in-from-right",
                getPriorityColor(notification.priority)
              )}
            >
              <CardContent className="p-3">
                <div className="flex items-start gap-2">
                  {getNotificationIcon(notification.type)}
                  <div className="flex-1">
                    <p className="text-sm font-medium">{notification.title}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {notification.message}
                    </p>
                    {notification.amount && (
                      <p className="text-xs text-green-600 font-medium mt-1">
                        +{formatCurrency(notification.amount)}
                      </p>
                    )}
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => markAsRead(notification.id)}
                    className="h-6 w-6"
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
      </div>
    </div>
  );
};

export default NotificationSystem;
