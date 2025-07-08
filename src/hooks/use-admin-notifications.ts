import { useState, useEffect } from "react";
import { AdminService } from "@/services/adminService";
import { ContentModerationItem } from "@/types/admin";

export interface AdminNotification {
  id: string;
  type: "moderation" | "user_report" | "system_alert" | "security";
  title: string;
  message: string;
  priority: "low" | "medium" | "high" | "urgent";
  timestamp: string;
  read: boolean;
  actionUrl?: string;
}

export const useAdminNotifications = () => {
  const [notifications, setNotifications] = useState<AdminNotification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchNotifications();

    // Poll for new notifications every 30 seconds
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchNotifications = async () => {
    try {
      setIsLoading(true);

      // Fetch pending moderation items as notifications
      const moderationItems = await AdminService.getPendingModeration();

      // Convert moderation items to notifications
      const moderationNotifications: AdminNotification[] = moderationItems.map(
        (item) => ({
          id: `moderation-${item.id}`,
          type: "moderation",
          title: `Content Moderation Required`,
          message: `${item.contentType} reported for ${item.reason}`,
          priority: item.priority as "low" | "medium" | "high" | "urgent",
          timestamp: item.createdAt,
          read: false,
          actionUrl: `/admin/moderation`,
        }),
      );

      // TODO: Add other notification types (user reports, system alerts, etc.)

      const allNotifications = [
        ...moderationNotifications,
        // Add other notification types here
      ];

      setNotifications(allNotifications);
      setUnreadCount(allNotifications.filter((n) => !n.read).length);
    } catch (error) {
      console.error("Error fetching admin notifications:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const markAsRead = (notificationId: string) => {
    setNotifications((prev) =>
      prev.map((notification) =>
        notification.id === notificationId
          ? { ...notification, read: true }
          : notification,
      ),
    );
    setUnreadCount((prev) => Math.max(0, prev - 1));
  };

  const markAllAsRead = () => {
    setNotifications((prev) =>
      prev.map((notification) => ({ ...notification, read: true })),
    );
    setUnreadCount(0);
  };

  const getNotificationsByType = (type: AdminNotification["type"]) => {
    return notifications.filter((n) => n.type === type);
  };

  const getNotificationsByPriority = (
    priority: AdminNotification["priority"],
  ) => {
    return notifications.filter((n) => n.priority === priority);
  };

  const getUrgentNotifications = () => {
    return notifications.filter((n) => n.priority === "urgent" && !n.read);
  };

  return {
    notifications,
    unreadCount,
    isLoading,
    fetchNotifications,
    markAsRead,
    markAllAsRead,
    getNotificationsByType,
    getNotificationsByPriority,
    getUrgentNotifications,
  };
};
