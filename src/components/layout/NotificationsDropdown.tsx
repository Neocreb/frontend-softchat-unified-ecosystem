
import { useState } from "react";
import { Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";

interface Notification {
  id: string;
  title: string;
  description: string;
  time: string;
  read: boolean;
  type: "like" | "comment" | "follow" | "system" | "reward";
}

const mockNotifications: Notification[] = [
  {
    id: "1",
    title: "New like",
    description: "Sarah Johnson liked your post",
    time: "5 minutes ago",
    read: false,
    type: "like",
  },
  {
    id: "2",
    title: "Comment on your post",
    description: "Alex Rivera commented on your post",
    time: "1 hour ago",
    read: false,
    type: "comment",
  },
  {
    id: "3",
    title: "New follower",
    description: "Michael Chen started following you",
    time: "3 hours ago",
    read: true,
    type: "follow",
  },
  {
    id: "4",
    title: "Reward earned",
    description: "You earned 100 points for daily login",
    time: "1 day ago",
    read: true,
    type: "reward",
  },
  {
    id: "5",
    title: "System notification",
    description: "Your account was successfully verified",
    time: "2 days ago",
    read: true,
    type: "system",
  },
];

const NotificationsDropdown = () => {
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications);
  const unreadCount = notifications.filter(n => !n.read).length;

  const handleRead = (id: string) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === id ? { ...notification, read: true } : notification
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notification => ({ ...notification, read: true }))
    );
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative" aria-label="Notifications">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <Badge className="absolute -right-1 -top-1 h-5 w-5 rounded-full p-0 flex items-center justify-center bg-red-500 text-white">
              {unreadCount}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-80" align="end">
        <DropdownMenuLabel className="flex items-center justify-between">
          <span>Notifications</span>
          {unreadCount > 0 && (
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-xs h-8"
              onClick={markAllAsRead}
            >
              Mark all as read
            </Button>
          )}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup className="max-h-[300px] overflow-y-auto">
          {notifications.length > 0 ? (
            notifications.map((notification) => (
              <DropdownMenuItem
                key={notification.id}
                className={`flex flex-col items-start p-3 ${!notification.read ? 'bg-muted/50' : ''}`}
                onClick={() => handleRead(notification.id)}
              >
                <div className="w-full">
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-medium text-sm">{notification.title}</span>
                    <span className="text-xs text-muted-foreground">{notification.time}</span>
                  </div>
                  <p className="text-sm text-muted-foreground">{notification.description}</p>
                </div>
              </DropdownMenuItem>
            ))
          ) : (
            <div className="text-center p-4 text-muted-foreground">
              No notifications yet
            </div>
          )}
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="justify-center text-sm text-muted-foreground">
          View all notifications
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default NotificationsDropdown;
