import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Bell,
  TrendingDown,
  UserCheck,
  Clock,
  TrendingUp,
  MessageSquare,
  DollarSign,
  AlertTriangle,
  CheckCircle,
  Settings,
  X,
  Filter,
  Zap,
  Target,
  Calendar,
  Mail,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/components/ui/use-toast";

interface SmartNotification {
  id: string;
  type:
    | "price-drop"
    | "availability"
    | "deadline"
    | "market-opportunity"
    | "project-update"
    | "payment";
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  priority: "low" | "medium" | "high" | "urgent";
  actionable: boolean;
  actionUrl?: string;
  actionLabel?: string;
  metadata?: {
    freelancerId?: string;
    projectId?: string;
    amount?: number;
    skill?: string;
    oldPrice?: number;
    newPrice?: number;
  };
  icon: React.ReactNode;
}

interface NotificationSettings {
  priceDropAlerts: {
    enabled: boolean;
    threshold: number; // percentage drop
    watchedFreelancers: string[];
  };
  availabilityNotifications: {
    enabled: boolean;
    topTalentOnly: boolean;
    skills: string[];
  };
  deadlineReminders: {
    enabled: boolean;
    advanceWarning: number; // days
    milestoneTracking: boolean;
  };
  marketOpportunities: {
    enabled: boolean;
    skillCategories: string[];
    budgetRange: { min: number; max: number };
  };
  digestEmails: {
    enabled: boolean;
    frequency: "daily" | "weekly" | "monthly";
    timeOfDay: string;
  };
}

const mockNotifications: SmartNotification[] = [
  {
    id: "1",
    type: "price-drop",
    title: "Price Drop Alert",
    message:
      "Sarah Johnson lowered her React development rate from $90 to $75/hr",
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
    read: false,
    priority: "medium",
    actionable: true,
    actionUrl: "/freelancers/sarah-johnson",
    actionLabel: "View Profile",
    metadata: {
      freelancerId: "sarah-johnson",
      skill: "React",
      oldPrice: 90,
      newPrice: 75,
    },
    icon: <TrendingDown className="h-5 w-5 text-red-500" />,
  },
  {
    id: "2",
    type: "availability",
    title: "Top Talent Available",
    message: "Alex Developer (5.0★) just became available for Node.js projects",
    timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000),
    read: false,
    priority: "high",
    actionable: true,
    actionUrl: "/freelancers/alex-developer",
    actionLabel: "Hire Now",
    metadata: {
      freelancerId: "alex-developer",
      skill: "Node.js",
    },
    icon: <UserCheck className="h-5 w-5 text-green-500" />,
  },
  {
    id: "3",
    type: "deadline",
    title: "Project Deadline Approaching",
    message: "E-commerce Platform milestone due in 2 days - UI Design phase",
    timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000),
    read: true,
    priority: "urgent",
    actionable: true,
    actionUrl: "/projects/ecommerce-platform",
    actionLabel: "Review Progress",
    metadata: {
      projectId: "ecommerce-platform",
    },
    icon: <Clock className="h-5 w-5 text-orange-500" />,
  },
  {
    id: "4",
    type: "market-opportunity",
    title: "High-Value Project Alert",
    message:
      "New AI/ML project posted with $25,000 budget - matches your skills",
    timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000),
    read: false,
    priority: "high",
    actionable: true,
    actionUrl: "/jobs/ai-ml-project",
    actionLabel: "View Job",
    metadata: {
      skill: "AI/ML",
      amount: 25000,
    },
    icon: <TrendingUp className="h-5 w-5 text-blue-500" />,
  },
  {
    id: "5",
    type: "payment",
    title: "Payment Released",
    message:
      "Milestone payment of $2,500 has been released for Website Redesign",
    timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000),
    read: true,
    priority: "medium",
    actionable: false,
    metadata: {
      projectId: "website-redesign",
      amount: 2500,
    },
    icon: <DollarSign className="h-5 w-5 text-green-500" />,
  },
];

const mockDigestData = {
  weeklyStats: {
    newJobs: 45,
    avgBudget: 15000,
    topSkills: ["React", "Node.js", "Python", "AWS"],
    competitionLevel: "medium",
  },
  personalizedRecommendations: [
    "Consider raising your React rate by 15% based on current market demand",
    "You have 3 previous clients looking for similar services",
    "New certification in AWS could increase your project opportunities by 40%",
  ],
  upcomingDeadlines: [
    { project: "E-commerce Platform", days: 2, milestone: "UI Design" },
    { project: "Mobile App", days: 7, milestone: "Backend API" },
  ],
};

export const SmartFreelanceNotifications: React.FC = () => {
  const [notifications, setNotifications] = useState(mockNotifications);
  const [settings, setSettings] = useState<NotificationSettings>({
    priceDropAlerts: {
      enabled: true,
      threshold: 10,
      watchedFreelancers: ["sarah-johnson", "alex-developer"],
    },
    availabilityNotifications: {
      enabled: true,
      topTalentOnly: true,
      skills: ["React", "Node.js", "Python"],
    },
    deadlineReminders: {
      enabled: true,
      advanceWarning: 3,
      milestoneTracking: true,
    },
    marketOpportunities: {
      enabled: true,
      skillCategories: ["Frontend", "Backend", "Full Stack"],
      budgetRange: { min: 5000, max: 50000 },
    },
    digestEmails: {
      enabled: true,
      frequency: "weekly",
      timeOfDay: "09:00",
    },
  });
  const [activeFilter, setActiveFilter] = useState<string>("all");

  const { user } = useAuth();
  const { toast } = useToast();

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "urgent":
        return "text-red-600 bg-red-50 border-red-200";
      case "high":
        return "text-orange-600 bg-orange-50 border-orange-200";
      case "medium":
        return "text-blue-600 bg-blue-50 border-blue-200";
      case "low":
        return "text-gray-600 bg-gray-50 border-gray-200";
      default:
        return "text-gray-600 bg-gray-50 border-gray-200";
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "price-drop":
        return <TrendingDown className="h-4 w-4" />;
      case "availability":
        return <UserCheck className="h-4 w-4" />;
      case "deadline":
        return <Clock className="h-4 w-4" />;
      case "market-opportunity":
        return <TrendingUp className="h-4 w-4" />;
      case "payment":
        return <DollarSign className="h-4 w-4" />;
      default:
        return <Bell className="h-4 w-4" />;
    }
  };

  const filteredNotifications = notifications.filter((notification) => {
    if (activeFilter === "all") return true;
    if (activeFilter === "unread") return !notification.read;
    return notification.type === activeFilter;
  });

  const markAsRead = (notificationId: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === notificationId ? { ...n, read: true } : n)),
    );
  };

  const deleteNotification = (notificationId: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== notificationId));
    toast({
      title: "Notification deleted",
      description: "The notification has been removed.",
    });
  };

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    toast({
      title: "All notifications marked as read",
      description: "You're all caught up!",
    });
  };

  const handleNotificationAction = (notification: SmartNotification) => {
    if (notification.actionable && notification.actionUrl) {
      // In a real app, this would navigate to the URL
      console.log("Navigate to:", notification.actionUrl);
      markAsRead(notification.id);
      toast({
        title: "Opening...",
        description: `Navigating to ${notification.actionLabel}`,
      });
    }
  };

  const updateSettings = (
    category: keyof NotificationSettings,
    updates: any,
  ) => {
    setSettings((prev) => ({
      ...prev,
      [category]: { ...prev[category], ...updates },
    }));
    toast({
      title: "Settings updated",
      description: "Your notification preferences have been saved.",
    });
  };

  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diffInHours = Math.floor(
      (now.getTime() - date.getTime()) / (1000 * 60 * 60),
    );

    if (diffInHours < 1) return "Just now";
    if (diffInHours < 24) return `${diffInHours}h ago`;
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays}d ago`;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Bell className="h-6 w-6 text-blue-600" />
            Smart Notifications
          </h2>
          <p className="text-muted-foreground">
            Stay ahead with intelligent alerts and insights
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={markAllAsRead}>
            <CheckCircle className="h-4 w-4 mr-2" />
            Mark All Read
          </Button>
        </div>
      </div>

      <Tabs defaultValue="notifications" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="digest">Weekly Digest</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="notifications" className="space-y-4">
          {/* Filter Bar */}
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2 flex-wrap">
                <Filter className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">Filter:</span>
                {[
                  { key: "all", label: "All", count: notifications.length },
                  {
                    key: "unread",
                    label: "Unread",
                    count: notifications.filter((n) => !n.read).length,
                  },
                  {
                    key: "price-drop",
                    label: "Price Drops",
                    count: notifications.filter((n) => n.type === "price-drop")
                      .length,
                  },
                  {
                    key: "availability",
                    label: "Availability",
                    count: notifications.filter(
                      (n) => n.type === "availability",
                    ).length,
                  },
                  {
                    key: "deadline",
                    label: "Deadlines",
                    count: notifications.filter((n) => n.type === "deadline")
                      .length,
                  },
                  {
                    key: "market-opportunity",
                    label: "Opportunities",
                    count: notifications.filter(
                      (n) => n.type === "market-opportunity",
                    ).length,
                  },
                ].map((filter) => (
                  <Button
                    key={filter.key}
                    variant={
                      activeFilter === filter.key ? "default" : "outline"
                    }
                    size="sm"
                    onClick={() => setActiveFilter(filter.key)}
                  >
                    {filter.label} ({filter.count})
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Notifications List */}
          <div className="space-y-3">
            {filteredNotifications.length === 0 ? (
              <Card>
                <CardContent className="p-8 text-center">
                  <Bell className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="text-lg font-medium mb-2">No notifications</h3>
                  <p className="text-muted-foreground">You're all caught up!</p>
                </CardContent>
              </Card>
            ) : (
              filteredNotifications.map((notification) => (
                <Card
                  key={notification.id}
                  className={`relative overflow-hidden ${!notification.read ? "border-l-4 border-l-blue-500 bg-blue-50/30" : ""}`}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0">{notification.icon}</div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-medium text-sm">
                            {notification.title}
                          </h4>
                          <Badge
                            className={`text-xs ${getPriorityColor(notification.priority)}`}
                          >
                            {notification.priority}
                          </Badge>
                          {!notification.read && (
                            <Badge variant="outline" className="text-xs">
                              New
                            </Badge>
                          )}
                        </div>

                        <p className="text-sm text-muted-foreground mb-2">
                          {notification.message}
                        </p>

                        <div className="flex items-center justify-between">
                          <span className="text-xs text-muted-foreground">
                            {formatTimeAgo(notification.timestamp)}
                          </span>

                          <div className="flex items-center gap-2">
                            {notification.actionable && (
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() =>
                                  handleNotificationAction(notification)
                                }
                              >
                                {notification.actionLabel || "View"}
                              </Button>
                            )}
                            {!notification.read && (
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => markAsRead(notification.id)}
                              >
                                <CheckCircle className="h-4 w-4" />
                              </Button>
                            )}
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() =>
                                deleteNotification(notification.id)
                              }
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>

                        {/* Metadata Display */}
                        {notification.metadata && (
                          <div className="mt-2 flex flex-wrap gap-2">
                            {notification.metadata.amount && (
                              <Badge variant="secondary" className="text-xs">
                                ${notification.metadata.amount.toLocaleString()}
                              </Badge>
                            )}
                            {notification.metadata.skill && (
                              <Badge variant="secondary" className="text-xs">
                                {notification.metadata.skill}
                              </Badge>
                            )}
                            {notification.metadata.oldPrice &&
                              notification.metadata.newPrice && (
                                <Badge variant="secondary" className="text-xs">
                                  ${notification.metadata.oldPrice} → $
                                  {notification.metadata.newPrice}
                                </Badge>
                              )}
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </TabsContent>

        <TabsContent value="digest" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Mail className="h-5 w-5 text-purple-600" />
                  Weekly Market Digest
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-3 bg-blue-50 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">
                      {mockDigestData.weeklyStats.newJobs}
                    </div>
                    <div className="text-sm text-blue-700">New Jobs Posted</div>
                  </div>
                  <div className="text-center p-3 bg-green-50 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">
                      ${mockDigestData.weeklyStats.avgBudget.toLocaleString()}
                    </div>
                    <div className="text-sm text-green-700">Avg Budget</div>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium mb-2">Trending Skills</h4>
                  <div className="flex flex-wrap gap-1">
                    {mockDigestData.weeklyStats.topSkills.map((skill, i) => (
                      <Badge key={i} variant="outline" className="text-xs">
                        #{skill}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="font-medium mb-2">
                    Personalized Recommendations
                  </h4>
                  <ul className="space-y-2">
                    {mockDigestData.personalizedRecommendations.map(
                      (rec, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm">
                          <Lightbulb className="h-4 w-4 text-yellow-500 mt-0.5 flex-shrink-0" />
                          {rec}
                        </li>
                      ),
                    )}
                  </ul>
                </div>

                <div>
                  <h4 className="font-medium mb-2">Upcoming Deadlines</h4>
                  {mockDigestData.upcomingDeadlines.map((deadline, i) => (
                    <div
                      key={i}
                      className="flex justify-between items-center p-2 border rounded text-sm"
                    >
                      <div>
                        <div className="font-medium">{deadline.project}</div>
                        <div className="text-muted-foreground">
                          {deadline.milestone}
                        </div>
                      </div>
                      <Badge
                        variant={
                          deadline.days <= 2 ? "destructive" : "secondary"
                        }
                      >
                        {deadline.days} days
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Market Insights</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg">
                  <h4 className="font-medium mb-2">📈 Market Trend</h4>
                  <p className="text-sm text-muted-foreground">
                    React development rates have increased by 12% this month.
                    Consider updating your pricing.
                  </p>
                </div>

                <div className="p-4 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg">
                  <h4 className="font-medium mb-2">🎯 Opportunity Alert</h4>
                  <p className="text-sm text-muted-foreground">
                    3 of your previous clients have posted new projects. You
                    have a higher chance of winning these bids.
                  </p>
                </div>

                <div className="p-4 bg-gradient-to-r from-orange-50 to-red-50 rounded-lg">
                  <h4 className="font-medium mb-2">⚠️ Competition Update</h4>
                  <p className="text-sm text-muted-foreground">
                    Competition level: Medium. Consider specializing in niche
                    skills to stand out.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="settings" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5 text-gray-600" />
                  Notification Preferences
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium">Price Drop Alerts</div>
                      <div className="text-sm text-muted-foreground">
                        Get notified when freelancers lower their rates
                      </div>
                    </div>
                    <Switch
                      checked={settings.priceDropAlerts.enabled}
                      onCheckedChange={(checked) =>
                        updateSettings("priceDropAlerts", { enabled: checked })
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium">
                        Availability Notifications
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Know when top talent becomes available
                      </div>
                    </div>
                    <Switch
                      checked={settings.availabilityNotifications.enabled}
                      onCheckedChange={(checked) =>
                        updateSettings("availabilityNotifications", {
                          enabled: checked,
                        })
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium">Deadline Reminders</div>
                      <div className="text-sm text-muted-foreground">
                        Project and milestone deadline alerts
                      </div>
                    </div>
                    <Switch
                      checked={settings.deadlineReminders.enabled}
                      onCheckedChange={(checked) =>
                        updateSettings("deadlineReminders", {
                          enabled: checked,
                        })
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium">Market Opportunities</div>
                      <div className="text-sm text-muted-foreground">
                        High-value projects matching your skills
                      </div>
                    </div>
                    <Switch
                      checked={settings.marketOpportunities.enabled}
                      onCheckedChange={(checked) =>
                        updateSettings("marketOpportunities", {
                          enabled: checked,
                        })
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium">Weekly Digest Emails</div>
                      <div className="text-sm text-muted-foreground">
                        Personalized weekly market insights
                      </div>
                    </div>
                    <Switch
                      checked={settings.digestEmails.enabled}
                      onCheckedChange={(checked) =>
                        updateSettings("digestEmails", { enabled: checked })
                      }
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Advanced Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="font-medium mb-2">Price Drop Threshold</div>
                  <div className="text-sm text-muted-foreground mb-2">
                    Notify when rates drop by at least{" "}
                    {settings.priceDropAlerts.threshold}%
                  </div>
                  <input
                    type="range"
                    min="5"
                    max="30"
                    value={settings.priceDropAlerts.threshold}
                    onChange={(e) =>
                      updateSettings("priceDropAlerts", {
                        threshold: parseInt(e.target.value),
                      })
                    }
                    className="w-full"
                  />
                </div>

                <div>
                  <div className="font-medium mb-2">Deadline Warning</div>
                  <div className="text-sm text-muted-foreground mb-2">
                    Alert {settings.deadlineReminders.advanceWarning} days
                    before deadlines
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="14"
                    value={settings.deadlineReminders.advanceWarning}
                    onChange={(e) =>
                      updateSettings("deadlineReminders", {
                        advanceWarning: parseInt(e.target.value),
                      })
                    }
                    className="w-full"
                  />
                </div>

                <div>
                  <div className="font-medium mb-2">Digest Frequency</div>
                  <select
                    className="w-full p-2 border rounded-md"
                    value={settings.digestEmails.frequency}
                    onChange={(e) =>
                      updateSettings("digestEmails", {
                        frequency: e.target.value,
                      })
                    }
                  >
                    <option value="daily">Daily</option>
                    <option value="weekly">Weekly</option>
                    <option value="monthly">Monthly</option>
                  </select>
                </div>

                <div className="p-4 bg-blue-50 rounded-lg">
                  <h4 className="font-medium mb-2 flex items-center gap-2">
                    <Zap className="h-4 w-4 text-blue-600" />
                    Smart Features
                  </h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• AI-powered opportunity matching</li>
                    <li>• Predictive deadline reminders</li>
                    <li>• Market trend analysis</li>
                    <li>• Personalized recommendations</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};
