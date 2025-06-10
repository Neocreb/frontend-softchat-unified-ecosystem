import { Helmet } from "react-helmet-async";
import { Bell, Heart, MessageCircle, UserPlus } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

const Notifications = () => {
  const mockNotifications = [
    {
      id: "1",
      type: "like",
      user: { name: "Alice Johnson", avatar: "/placeholder.svg" },
      content: "liked your post",
      time: "2 minutes ago",
      read: false,
    },
    {
      id: "2",
      type: "comment",
      user: { name: "Bob Smith", avatar: "/placeholder.svg" },
      content: "commented on your post: Great content!",
      time: "1 hour ago",
      read: false,
    },
    {
      id: "3",
      type: "follow",
      user: { name: "Charlie Wilson", avatar: "/placeholder.svg" },
      content: "started following you",
      time: "3 hours ago",
      read: true,
    },
  ];

  const getIcon = (type: string) => {
    switch (type) {
      case "like":
        return <Heart className="h-4 w-4 text-red-500" />;
      case "comment":
        return <MessageCircle className="h-4 w-4 text-blue-500" />;
      case "follow":
        return <UserPlus className="h-4 w-4 text-green-500" />;
      default:
        return <Bell className="h-4 w-4" />;
    }
  };

  return (
    <>
      <Helmet>
        <title>Notifications | Softchat</title>
      </Helmet>

      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Notifications</h1>

        <div className="space-y-4">
          {mockNotifications.map((notification) => (
            <Card
              key={notification.id}
              className={
                !notification.read ? "border-l-4 border-l-primary" : ""
              }
            >
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={notification.user.avatar} />
                    <AvatarFallback>
                      {notification.user.name.substring(0, 2)}
                    </AvatarFallback>
                  </Avatar>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      {getIcon(notification.type)}
                      <p className="text-sm">
                        <span className="font-medium">
                          {notification.user.name}
                        </span>{" "}
                        {notification.content}
                      </p>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      {notification.time}
                    </p>
                  </div>

                  {!notification.read && (
                    <div className="h-2 w-2 bg-primary rounded-full"></div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center mt-8">
          <Button variant="outline">Load More</Button>
        </div>
      </div>
    </>
  );
};

export default Notifications;
