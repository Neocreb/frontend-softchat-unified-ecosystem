
import { toast } from "@/hooks/use-toast";

type NotificationType = "success" | "error" | "warning" | "info";

interface NotificationOptions {
  description?: string;
  duration?: number;
}

export const useNotification = () => {
  const notify = (
    title: string,
    type: NotificationType = "info",
    options?: NotificationOptions
  ) => {
    toast({
      title,
      description: options?.description,
      duration: options?.duration || 3000,
      variant: type === "error" ? "destructive" : undefined,
    });
  };

  return {
    success: (title: string, options?: NotificationOptions) => 
      notify(title, "success", options),
    error: (title: string, options?: NotificationOptions) => 
      notify(title, "error", options),
    warning: (title: string, options?: NotificationOptions) => 
      notify(title, "warning", options),
    info: (title: string, options?: NotificationOptions) => 
      notify(title, "info", options),
  };
};
