import React, { useState, useEffect, useMemo } from "react";
import { Helmet } from "react-helmet-async";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Bell,
  Search,
  Settings,
  Check,
  CheckCircle2,
  X,
  Trash2,
  Archive,
  Star,
  Filter,
  SortDesc,
  MessageSquare,
  Heart,
  Users,
  ShoppingCart,
  TrendingUp,
  Briefcase,
  Gift,
  Coins,
  Calendar,
  Zap,
  AlertTriangle,
  Info,
  Crown,
  Camera,
  Video,
  UserPlus,
  ThumbsUp,
  Share,
  DollarSign,
  Package,
  CreditCard,
  Wallet,
  Target,
  Award,
  Clock,
  ChevronDown,
  MoreVertical,
  Eye,
  EyeOff,
  Volume2,
  VolumeX,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import {
  useUnifiedNotifications,
  type UnifiedNotification as EnhancedNotification,
  type NotificationCategory
} from "@/contexts/UnifiedNotificationContext";

type ViewMode = "all" | "unread" | "starred" | "archived";
type SortMode = "newest" | "oldest" | "priority" | "category";

// No need for mock data as it's provided by the context

const UnifiedNotifications: React.FC = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const {
    notifications,
    unreadCount,
    loading: isLoading,
    markAsRead,
    markAsUnread,
    markAllAsRead,
    deleteNotification,
    archiveNotification,
    toggleStar,
    bulkMarkAsRead,
    bulkArchive,
    bulkDelete,
  } = useUnifiedNotifications();

  const [activeCategory, setActiveCategory] = useState<NotificationCategory>("all");
  const [viewMode, setViewMode] = useState<ViewMode>("all");
  const [sortMode, setSortMode] = useState<SortMode>("newest");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedNotifications, setSelectedNotifications] = useState<Set<string>>(new Set());
  const [showSettings, setShowSettings] = useState(false);

  // Notification categories with counts
  const notificationCategories = useMemo(() => {
    const categories = [
      { id: "all", name: "All", icon: Bell },
      { id: "social", name: "Social", icon: Users },
      { id: "chat", name: "Chat", icon: MessageSquare },
      { id: "marketplace", name: "Market", icon: ShoppingCart },
      { id: "freelance", name: "Freelance", icon: Briefcase },
      { id: "crypto", name: "Crypto", icon: TrendingUp },
      { id: "rewards", name: "Rewards", icon: Gift },
      { id: "videos", name: "Videos", icon: Video },
      { id: "payments", name: "Payments", icon: CreditCard },
      { id: "security", name: "Security", icon: AlertTriangle },
      { id: "system", name: "System", icon: Settings },
    ] as const;

    return categories.map(category => {
      const count = category.id === "all" 
        ? notifications.filter(n => !n.read && !n.archived).length
        : notifications.filter(n => n.category === category.id && !n.read && !n.archived).length;
      
      return { ...category, count };
    });
  }, [notifications]);

  // Filtered and sorted notifications
  const filteredNotifications = useMemo(() => {
    let filtered = notifications;

    // Filter by category
    if (activeCategory !== "all") {
      filtered = filtered.filter(n => n.category === activeCategory);
    }

    // Filter by view mode
    switch (viewMode) {
      case "unread":
        filtered = filtered.filter(n => !n.read);
        break;
      case "starred":
        filtered = filtered.filter(n => n.starred);
        break;
      case "archived":
        filtered = filtered.filter(n => n.archived);
        break;
      default:
        filtered = filtered.filter(n => !n.archived);
    }

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(n => 
        n.title.toLowerCase().includes(query) ||
        n.message.toLowerCase().includes(query)
      );
    }

    // Sort notifications
    filtered.sort((a, b) => {
      switch (sortMode) {
        case "oldest":
          return a.timestamp.getTime() - b.timestamp.getTime();
        case "priority":
          const priorityOrder = { urgent: 4, high: 3, medium: 2, low: 1 };
          return priorityOrder[b.priority] - priorityOrder[a.priority];
        case "category":
          return a.category.localeCompare(b.category);
        default: // newest
          return b.timestamp.getTime() - a.timestamp.getTime();
      }
    });

    return filtered;
  }, [notifications, activeCategory, viewMode, searchQuery, sortMode]);

  // Utility functions using context methods
  const handleArchive = (id: string) => {
    archiveNotification(id);
    toast({ title: "Notification archived" });
  };

  const handleDelete = (id: string) => {
    deleteNotification(id);
    toast({ title: "Notification deleted" });
  };

  const handleMarkAllAsRead = () => {
    markAllAsRead();
    toast({ title: "All notifications marked as read" });
  };

  const handleBulkAction = (action: "read" | "unread" | "star" | "archive" | "delete") => {
    const ids = Array.from(selectedNotifications);

    switch (action) {
      case "read":
        bulkMarkAsRead(ids);
        break;
      case "unread":
        ids.forEach(id => markAsUnread(id));
        break;
      case "star":
        ids.forEach(id => toggleStar(id));
        break;
      case "archive":
        bulkArchive(ids);
        break;
      case "delete":
        bulkDelete(ids);
        break;
    }

    setSelectedNotifications(new Set());
    toast({ title: `${ids.length} notifications ${action === "delete" ? "deleted" : action === "read" ? "marked as read" : action === "unread" ? "marked as unread" : action === "star" ? "starred" : "archived"}` });
  };

  const getNotificationIcon = (notification: EnhancedNotification) => {
    switch (notification.category) {
      case "social":
        if (notification.title.includes("Follower")) return <UserPlus className="w-4 h-4 text-blue-500" />;
        if (notification.title.includes("Liked")) return <Heart className="w-4 h-4 text-red-500" />;
        if (notification.title.includes("Comment")) return <MessageSquare className="w-4 h-4 text-green-500" />;
        return <Users className="w-4 h-4 text-blue-500" />;
      case "chat":
        return <MessageSquare className="w-4 h-4 text-blue-500" />;
      case "marketplace":
        return <ShoppingCart className="w-4 h-4 text-purple-500" />;
      case "freelance":
        return <Briefcase className="w-4 h-4 text-orange-500" />;
      case "crypto":
        return <TrendingUp className="w-4 h-4 text-green-500" />;
      case "rewards":
        return <Gift className="w-4 h-4 text-pink-500" />;
      case "videos":
        return <Video className="w-4 h-4 text-red-500" />;
      case "payments":
        return <CreditCard className="w-4 h-4 text-green-500" />;
      case "security":
        return <AlertTriangle className="w-4 h-4 text-red-500" />;
      case "system":
        return <Settings className="w-4 h-4 text-gray-500" />;
      default:
        return <Bell className="w-4 h-4 text-gray-500" />;
    }
  };

  const getPriorityColor = (priority: EnhancedNotification["priority"]) => {
    switch (priority) {
      case "urgent": return "border-l-red-500 bg-red-50/50";
      case "high": return "border-l-orange-500 bg-orange-50/50";
      case "medium": return "border-l-blue-500 bg-blue-50/50";
      case "low": return "border-l-gray-400 bg-gray-50/50";
      default: return "border-l-gray-400 bg-gray-50/50";
    }
  };

  const formatTimestamp = (timestamp: Date) => {
    const now = new Date();
    const diff = now.getTime() - timestamp.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return "Just now";
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
    return timestamp.toLocaleDateString();
  };

  // unreadCount is already provided by the context

  return (
    <>
      <Helmet>
        <title>{unreadCount > 0 ? `(${unreadCount}) ` : ""}Notifications | SoftChat</title>
      </Helmet>

      <div className="min-h-screen bg-gray-50/50 dark:bg-gray-900/50">
        <div className="max-w-7xl mx-auto p-4 space-y-6">
          {/* Header */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl lg:text-3xl font-bold flex items-center gap-3">
                <Bell className="w-6 h-6 lg:w-8 lg:h-8 text-primary" />
                Notifications
                {unreadCount > 0 && (
                  <Badge variant="destructive" className="ml-2">
                    {unreadCount > 99 ? "99+" : unreadCount}
                  </Badge>
                )}
              </h1>
              <p className="text-muted-foreground mt-1">
                Stay updated with all your platform activities
              </p>
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search notifications..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 w-48 sm:w-52"
                />
              </div>

              {/* Sort & Filter */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm">
                    <SortDesc className="w-4 h-4 sm:mr-2" />
                    <span className="hidden sm:inline">Sort</span>
                    <ChevronDown className="w-4 h-4 sm:ml-2" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem onClick={() => setSortMode("newest")}>
                    Newest First
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setSortMode("oldest")}>
                    Oldest First
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setSortMode("priority")}>
                    By Priority
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setSortMode("category")}>
                    By Category
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              {/* View Mode */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm">
                    <Filter className="w-4 h-4 sm:mr-2" />
                    <span className="hidden sm:inline">View</span>
                    <ChevronDown className="w-4 h-4 sm:ml-2" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem onClick={() => setViewMode("all")}>
                    All Notifications
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setViewMode("unread")}>
                    Unread Only
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setViewMode("starred")}>
                    Starred
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setViewMode("archived")}>
                    Archived
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Bulk Actions */}
              {selectedNotifications.size > 0 && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm">
                      {selectedNotifications.size} selected
                      <ChevronDown className="w-4 h-4 ml-2" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem onClick={() => handleBulkAction("read")}>
                      <Check className="w-4 h-4 mr-2" />
                      Mark as Read
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleBulkAction("unread")}>
                      <Eye className="w-4 h-4 mr-2" />
                      Mark as Unread
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleBulkAction("star")}>
                      <Star className="w-4 h-4 mr-2" />
                      Star
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => handleBulkAction("archive")}>
                      <Archive className="w-4 h-4 mr-2" />
                      Archive
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      onClick={() => handleBulkAction("delete")}
                      className="text-destructive"
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}

              {/* Actions */}
              <Button
                variant="outline"
                size="sm"
                onClick={handleMarkAllAsRead}
                disabled={unreadCount === 0}
              >
                <CheckCircle2 className="w-4 h-4 mr-2" />
                Mark All Read
              </Button>

              {/* Settings */}
              <Dialog open={showSettings} onOpenChange={setShowSettings}>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm">
                    <Settings className="w-4 h-4" />
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-md">
                  <DialogHeader>
                    <DialogTitle>Notification Settings</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <p className="text-sm text-muted-foreground">
                      Configure your notification preferences here.
                    </p>
                    <Button className="w-full" onClick={() => setShowSettings(false)}>
                      Open Full Settings
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>

          {/* Main Content */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Categories Sidebar */}
            <div className="lg:col-span-1">
              <Card>
                <CardHeader className="pb-3">
                  <h3 className="font-semibold">Categories</h3>
                </CardHeader>
                <CardContent className="space-y-1">
                  {notificationCategories.map((category) => (
                    <Button
                      key={category.id}
                      variant={activeCategory === category.id ? "default" : "ghost"}
                      className="w-full justify-start"
                      onClick={() => setActiveCategory(category.id as NotificationCategory)}
                    >
                      <category.icon className="w-4 h-4 mr-3" />
                      <span className="flex-1 text-left">{category.name}</span>
                      {category.count > 0 && (
                        <Badge variant="secondary" className="ml-2">
                          {category.count}
                        </Badge>
                      )}
                    </Button>
                  ))}
                </CardContent>
              </Card>
            </div>

            {/* Notifications List */}
            <div className="lg:col-span-3">
              <Card>
                <CardContent className="p-0">
                  {filteredNotifications.length === 0 ? (
                    <div className="p-12 text-center">
                      <Bell className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                      <h3 className="text-lg font-semibold mb-2">No notifications found</h3>
                      <p className="text-muted-foreground">
                        {searchQuery 
                          ? "Try adjusting your search terms" 
                          : "You're all caught up! Check back later for updates."}
                      </p>
                    </div>
                  ) : (
                    <ScrollArea className="h-[70vh]">
                      <div className="divide-y">
                        {filteredNotifications.map((notification) => (
                          <div
                            key={notification.id}
                            className={cn(
                              "p-4 hover:bg-muted/50 transition-colors border-l-4",
                              !notification.read ? getPriorityColor(notification.priority) : "border-l-transparent",
                              selectedNotifications.has(notification.id) && "bg-muted/70"
                            )}
                          >
                            <div className="flex items-start gap-4">
                              {/* Selection Checkbox */}
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-8 w-8 p-0 rounded-sm border border-muted-foreground/20"
                                onClick={() => {
                                  const newSelected = new Set(selectedNotifications);
                                  if (newSelected.has(notification.id)) {
                                    newSelected.delete(notification.id);
                                  } else {
                                    newSelected.add(notification.id);
                                  }
                                  setSelectedNotifications(newSelected);
                                }}
                              >
                                {selectedNotifications.has(notification.id) && (
                                  <Check className="w-3 h-3" />
                                )}
                              </Button>

                              {/* Avatar or Icon */}
                              <div className="flex-shrink-0">
                                {notification.avatar ? (
                                  <Avatar className="w-10 h-10">
                                    <AvatarImage src={notification.avatar} />
                                    <AvatarFallback>
                                      {getNotificationIcon(notification)}
                                    </AvatarFallback>
                                  </Avatar>
                                ) : (
                                  <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                                    {getNotificationIcon(notification)}
                                  </div>
                                )}
                              </div>

                              {/* Content */}
                              <div className="flex-1 min-w-0">
                                <div className="flex items-start justify-between">
                                  <div className="flex-1 pr-2">
                                    <h4 className={cn(
                                      "text-sm font-medium line-clamp-1",
                                      !notification.read && "font-semibold"
                                    )}>
                                      {notification.title}
                                    </h4>
                                    <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
                                      {notification.message}
                                    </p>
                                    <div className="flex items-center gap-2 mt-2">
                                      <span className="text-xs text-muted-foreground">
                                        {formatTimestamp(notification.timestamp)}
                                      </span>
                                      <Badge variant="outline" className="text-xs">
                                        {notification.category}
                                      </Badge>
                                      {notification.priority === "urgent" && (
                                        <Badge variant="destructive" className="text-xs">
                                          Urgent
                                        </Badge>
                                      )}
                                      {notification.starred && (
                                        <Star className="w-3 h-3 text-yellow-500 fill-current" />
                                      )}
                                    </div>
                                  </div>

                                  {/* Actions */}
                                  <div className="flex items-center gap-1">
                                    {!notification.read && (
                                      <div className="w-2 h-2 bg-blue-500 rounded-full" />
                                    )}
                                    
                                    <DropdownMenu>
                                      <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                          <MoreVertical className="w-4 h-4" />
                                        </Button>
                                      </DropdownMenuTrigger>
                                      <DropdownMenuContent align="end">
                                        <DropdownMenuItem 
                                          onClick={() => notification.read ? markAsUnread(notification.id) : markAsRead(notification.id)}
                                        >
                                          {notification.read ? (
                                            <>
                                              <EyeOff className="w-4 h-4 mr-2" />
                                              Mark as Unread
                                            </>
                                          ) : (
                                            <>
                                              <Eye className="w-4 h-4 mr-2" />
                                              Mark as Read
                                            </>
                                          )}
                                        </DropdownMenuItem>
                                        <DropdownMenuItem onClick={() => toggleStar(notification.id)}>
                                          <Star className={cn(
                                            "w-4 h-4 mr-2",
                                            notification.starred && "text-yellow-500 fill-current"
                                          )} />
                                          {notification.starred ? "Unstar" : "Star"}
                                        </DropdownMenuItem>
                                        <DropdownMenuSeparator />
                                        <DropdownMenuItem onClick={() => handleArchive(notification.id)}>
                                          <Archive className="w-4 h-4 mr-2" />
                                          Archive
                                        </DropdownMenuItem>
                                        <DropdownMenuItem
                                          onClick={() => handleDelete(notification.id)}
                                          className="text-destructive"
                                        >
                                          <Trash2 className="w-4 h-4 mr-2" />
                                          Delete
                                        </DropdownMenuItem>
                                      </DropdownMenuContent>
                                    </DropdownMenu>
                                  </div>
                                </div>

                                {/* Action Button */}
                                {notification.actionUrl && notification.actionLabel && (
                                  <Button 
                                    variant="outline" 
                                    size="sm" 
                                    className="mt-3"
                                    onClick={() => {
                                      window.location.href = notification.actionUrl!;
                                      markAsRead(notification.id);
                                    }}
                                  >
                                    {notification.actionLabel}
                                  </Button>
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </ScrollArea>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default UnifiedNotifications;
