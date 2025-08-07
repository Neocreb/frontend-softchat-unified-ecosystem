import { Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { useNotificationCount } from "@/contexts/UnifiedNotificationContext";

const NotificationsDropdown = () => {
  const navigate = useNavigate();
  const unreadCount = useNotificationCount();

  const handleNotificationClick = () => {
    navigate("/app/notifications");
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      className="relative h-8 w-8 sm:h-10 sm:w-10"
      aria-label="Notifications"
      onClick={handleNotificationClick}
    >
      <Bell className="h-4 w-4 sm:h-5 sm:w-5" />
      {unreadCount > 0 && (
        <Badge className="absolute -right-1 -top-1 h-4 w-4 sm:h-5 sm:w-5 rounded-full p-0 flex items-center justify-center bg-red-500 text-white text-xs">
          {unreadCount > 99 ? "99+" : unreadCount}
        </Badge>
      )}
    </Button>
  );
};

export default NotificationsDropdown;
