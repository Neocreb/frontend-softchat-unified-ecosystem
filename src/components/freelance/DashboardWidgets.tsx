import React, { useState, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  DollarSign,
  TrendingUp,
  Clock,
  Star,
  Target,
  BarChart3,
  Calendar,
  Users,
  FileText,
  Trophy,
  Zap,
  Settings,
  GripVertical,
  MoreVertical,
  Eye,
  EyeOff,
  ArrowUp,
  ArrowDown,
} from "lucide-react";
import { cn } from "@/lib/utils";

export interface Widget {
  id: string;
  type: string;
  title: string;
  size: "small" | "medium" | "large";
  position: { x: number; y: number };
  visible: boolean;
  data?: any;
}

interface WidgetComponentProps {
  widget: Widget;
  onResize?: (id: string, size: Widget["size"]) => void;
  onToggleVisibility?: (id: string) => void;
  onMove?: (id: string, direction: "up" | "down") => void;
  isDragging?: boolean;
  dragProps?: any;
}

const WidgetComponent: React.FC<WidgetComponentProps> = ({
  widget,
  onResize,
  onToggleVisibility,
  onMove,
  isDragging,
  dragProps,
}) => {
  const renderWidgetContent = () => {
    switch (widget.type) {
      case "earnings_summary":
        return (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-green-600">$5,240</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">This month</p>
              </div>
              <div className="p-3 bg-green-100 dark:bg-green-900/20 rounded-full">
                <DollarSign className="w-6 h-6 text-green-600" />
              </div>
            </div>
            <div className="flex items-center text-sm">
              <ArrowUp className="w-4 h-4 mr-1 text-green-500" />
              <span className="text-green-600">+12% from last month</span>
            </div>
          </div>
        );

      case "active_projects":
        return (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <p className="text-2xl font-bold">3</p>
              <FileText className="w-6 h-6 text-blue-600" />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>E-commerce Platform</span>
                <span className="text-blue-600">75%</span>
              </div>
              <Progress value={75} className="h-1" />
            </div>
          </div>
        );

      case "recent_activity":
        return (
          <div className="space-y-3">
            {[
              { action: "Payment received", time: "2h ago", type: "payment" },
              { action: "New message", time: "4h ago", type: "message" },
              { action: "Milestone approved", time: "1d ago", type: "milestone" },
            ].map((activity, index) => (
              <div key={index} className="flex items-center gap-3">
                <div className={cn(
                  "w-2 h-2 rounded-full",
                  activity.type === "payment" && "bg-green-500",
                  activity.type === "message" && "bg-blue-500",
                  activity.type === "milestone" && "bg-purple-500"
                )} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{activity.action}</p>
                  <p className="text-xs text-gray-500">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        );

      case "performance_metrics":
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center">
                <p className="text-lg font-bold">4.9</p>
                <p className="text-xs text-gray-600">Rating</p>
              </div>
              <div className="text-center">
                <p className="text-lg font-bold">98%</p>
                <p className="text-xs text-gray-600">On-time</p>
              </div>
            </div>
            <div className="flex items-center gap-1 justify-center">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} className="w-3 h-3 fill-yellow-400 text-yellow-400" />
              ))}
            </div>
          </div>
        );

      case "quick_stats":
        return (
          <div className="grid grid-cols-2 gap-4">
            <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg text-center">
              <p className="text-xl font-bold text-blue-600">12</p>
              <p className="text-xs text-gray-600">Proposals</p>
            </div>
            <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg text-center">
              <p className="text-xl font-bold text-green-600">8</p>
              <p className="text-xs text-gray-600">Completed</p>
            </div>
          </div>
        );

      case "deadline_tracker":
        return (
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-orange-600" />
              <span className="text-sm font-medium">Upcoming Deadlines</span>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Website Mockups</span>
                <Badge variant="destructive" className="text-xs">2 days</Badge>
              </div>
              <div className="flex justify-between text-sm">
                <span>Logo Design</span>
                <Badge variant="secondary" className="text-xs">1 week</Badge>
              </div>
            </div>
          </div>
        );

      default:
        return <div className="text-center text-gray-500">Widget content</div>;
    }
  };

  return (
    <Card 
      className={cn(
        "transition-all duration-200 hover:shadow-md",
        isDragging && "opacity-50 rotate-2",
        widget.size === "small" && "h-32",
        widget.size === "medium" && "h-48",
        widget.size === "large" && "h-64"
      )}
      {...dragProps}
    >
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{widget.title}</CardTitle>
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="sm"
            className="h-6 w-6 p-0 cursor-grab active:cursor-grabbing"
          >
            <GripVertical className="h-3 w-3" />
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                <MoreVertical className="h-3 w-3" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onResize?.(widget.id, "small")}>
                Small size
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onResize?.(widget.id, "medium")}>
                Medium size
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onResize?.(widget.id, "large")}>
                Large size
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onMove?.(widget.id, "up")}>
                Move up
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onMove?.(widget.id, "down")}>
                Move down
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onToggleVisibility?.(widget.id)}>
                {widget.visible ? (
                  <>
                    <EyeOff className="w-4 h-4 mr-2" />
                    Hide widget
                  </>
                ) : (
                  <>
                    <Eye className="w-4 h-4 mr-2" />
                    Show widget
                  </>
                )}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      <CardContent>
        {renderWidgetContent()}
      </CardContent>
    </Card>
  );
};

interface CustomizableDashboardProps {
  userType: "freelancer" | "client";
}

export const CustomizableDashboard: React.FC<CustomizableDashboardProps> = ({ userType }) => {
  const [widgets, setWidgets] = useState<Widget[]>(() => {
    const defaultWidgets: Widget[] = userType === "freelancer" ? [
      {
        id: "earnings",
        type: "earnings_summary",
        title: "Earnings Summary",
        size: "medium",
        position: { x: 0, y: 0 },
        visible: true,
      },
      {
        id: "projects",
        type: "active_projects",
        title: "Active Projects",
        size: "medium",
        position: { x: 1, y: 0 },
        visible: true,
      },
      {
        id: "activity",
        type: "recent_activity",
        title: "Recent Activity",
        size: "medium",
        position: { x: 2, y: 0 },
        visible: true,
      },
      {
        id: "performance",
        type: "performance_metrics",
        title: "Performance",
        size: "small",
        position: { x: 0, y: 1 },
        visible: true,
      },
      {
        id: "deadlines",
        type: "deadline_tracker",
        title: "Deadlines",
        size: "medium",
        position: { x: 1, y: 1 },
        visible: true,
      },
    ] : [
      {
        id: "spending",
        type: "earnings_summary",
        title: "Total Spending",
        size: "medium",
        position: { x: 0, y: 0 },
        visible: true,
      },
      {
        id: "projects",
        type: "active_projects",
        title: "Active Projects",
        size: "medium",
        position: { x: 1, y: 0 },
        visible: true,
      },
      {
        id: "stats",
        type: "quick_stats",
        title: "Quick Stats",
        size: "small",
        position: { x: 2, y: 0 },
        visible: true,
      },
    ];

    return defaultWidgets;
  });

  const [isCustomizing, setIsCustomizing] = useState(false);

  const handleResize = (id: string, size: Widget["size"]) => {
    setWidgets(prev => prev.map(w => w.id === id ? { ...w, size } : w));
  };

  const handleToggleVisibility = (id: string) => {
    setWidgets(prev => prev.map(w => w.id === id ? { ...w, visible: !w.visible } : w));
  };

  const handleMove = (id: string, direction: "up" | "down") => {
    setWidgets(prev => {
      const index = prev.findIndex(w => w.id === id);
      if (index === -1) return prev;
      
      const newIndex = direction === "up" ? Math.max(0, index - 1) : Math.min(prev.length - 1, index + 1);
      const newWidgets = [...prev];
      [newWidgets[index], newWidgets[newIndex]] = [newWidgets[newIndex], newWidgets[index]];
      
      return newWidgets;
    });
  };

  const visibleWidgets = widgets.filter(w => w.visible);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold">Dashboard Overview</h2>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Customize your dashboard to show what matters most to you
          </p>
        </div>
        <Button
          variant={isCustomizing ? "default" : "outline"}
          onClick={() => setIsCustomizing(!isCustomizing)}
          className="flex items-center gap-2"
        >
          <Settings className="w-4 h-4" />
          {isCustomizing ? "Done Customizing" : "Customize"}
        </Button>
      </div>

      {isCustomizing && (
        <Card className="border-dashed border-2 border-blue-300 bg-blue-50/50 dark:bg-blue-900/10">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400">
              <Settings className="w-4 h-4" />
              <span className="text-sm font-medium">Customization Mode</span>
            </div>
            <p className="text-xs text-blue-600/80 dark:text-blue-400/80 mt-1">
              Drag widgets to reorder, resize them, or hide/show using the menu in each widget's header.
            </p>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {visibleWidgets.map((widget) => (
          <div
            key={widget.id}
            className={cn(
              widget.size === "large" && "md:col-span-2 lg:col-span-2",
              widget.size === "medium" && "md:col-span-1 lg:col-span-1",
              widget.size === "small" && "md:col-span-1 lg:col-span-1"
            )}
          >
            <WidgetComponent
              widget={widget}
              onResize={isCustomizing ? handleResize : undefined}
              onToggleVisibility={isCustomizing ? handleToggleVisibility : undefined}
              onMove={isCustomizing ? handleMove : undefined}
            />
          </div>
        ))}
      </div>

      {visibleWidgets.length === 0 && (
        <Card className="border-dashed border-2">
          <CardContent className="p-12 text-center">
            <div className="p-4 bg-gray-100 dark:bg-gray-800 rounded-full w-16 h-16 mx-auto mb-4">
              <BarChart3 className="w-8 h-8 text-gray-400 mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              All widgets are hidden
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Enable customization mode to show your widgets again
            </p>
            <Button onClick={() => setIsCustomizing(true)}>
              <Settings className="w-4 h-4 mr-2" />
              Customize Dashboard
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default CustomizableDashboard;
