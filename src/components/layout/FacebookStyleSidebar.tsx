import React from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Users,
  BarChart3,
  UserPlus,
  Megaphone,
  Rss,
  ShoppingCart,
  Video,
  Clock,
  BookMarked,
  HelpCircle,
  FileText,
  Calendar,
  TrendingUp,
  Briefcase,
  Radio,
  Award,
  Settings,
  Wallet,
} from "lucide-react";

interface MenuItemProps {
  icon: React.ReactNode;
  label: string;
  href: string;
  isActive?: boolean;
}

const MenuItem: React.FC<MenuItemProps> = ({ icon, label, href, isActive }) => (
  <Link
    to={href}
    className={`flex items-center gap-3 p-3 rounded-lg hover:bg-gray-100 transition-colors ${
      isActive ? "bg-blue-50 text-blue-600" : "text-gray-700"
    }`}
  >
    <div className="flex-shrink-0">{icon}</div>
    <span className="font-medium">{label}</span>
  </Link>
);

interface ShortcutItemProps {
  icon: React.ReactNode;
  label: string;
  href: string;
  badge?: string;
}

const ShortcutItem: React.FC<ShortcutItemProps> = ({
  icon,
  label,
  href,
  badge,
}) => (
  <Link
    to={href}
    className="flex flex-col items-center gap-2 p-3 rounded-lg hover:bg-gray-50 transition-colors min-w-[80px] relative"
  >
    <div className="relative">
      {icon}
      {badge && (
        <div className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
          {badge}
        </div>
      )}
    </div>
    <span className="text-xs text-center font-medium text-gray-600 truncate w-full">
      {label}
    </span>
  </Link>
);

const FacebookStyleSidebar: React.FC = () => {
  const { user } = useAuth();
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  const shortcuts = [
    {
      icon: <Calendar className="w-8 h-8 text-blue-600" />,
      label: "Events",
      href: "/events",
      badge: "3",
    },
    {
      icon: <Radio className="w-8 h-8 text-red-600" />,
      label: "Live",
      href: "/live-streaming",
    },
    {
      icon: <TrendingUp className="w-8 h-8 text-green-600" />,
      label: "Crypto",
      href: "/crypto",
    },
    {
      icon: <BarChart3 className="w-8 h-8 text-purple-600" />,
      label: "Creator Studio",
      href: "/creator-studio",
    },
    {
      icon: <Award className="w-8 h-8 text-blue-600" />,
      label: "Verification",
      href: "/premium",
    },
  ];

  const menuItems = [
    {
      icon: <Users className="w-6 h-6 text-blue-600" />,
      label: "Friends",
      href: "/friends",
    },
    {
      icon: <BarChart3 className="w-6 h-6 text-purple-600" />,
      label: "Professional dashboard",
      href: "/creator-studio",
    },
    {
      icon: <UserPlus className="w-6 h-6 text-blue-500" />,
      label: "Groups",
      href: "/groups",
    },
    {
      icon: <Megaphone className="w-6 h-6 text-blue-400" />,
      label: "Ad Center",
      href: "/ads",
    },
    {
      icon: <Rss className="w-6 h-6 text-blue-600" />,
      label: "Feeds",
      href: "/feed",
    },
    {
      icon: <ShoppingCart className="w-6 h-6 text-blue-600" />,
      label: "Marketplace",
      href: "/marketplace",
    },
    {
      icon: <Video className="w-6 h-6 text-blue-600" />,
      label: "Reels",
      href: "/videos",
    },
    {
      icon: <Clock className="w-6 h-6 text-blue-600" />,
      label: "Memories",
      href: "/memories",
    },
    {
      icon: <BookMarked className="w-6 h-6 text-purple-600" />,
      label: "Saved",
      href: "/saved",
    },
    {
      icon: <HelpCircle className="w-6 h-6 text-blue-600" />,
      label: "Support",
      href: "/support",
    },
    {
      icon: <FileText className="w-6 h-6 text-orange-600" />,
      label: "Pages",
      href: "/pages",
    },
    {
      icon: <Briefcase className="w-6 h-6 text-blue-600" />,
      label: "Freelance",
      href: "/freelance",
    },
    {
      icon: <Wallet className="w-6 h-6 text-green-600" />,
      label: "Wallet",
      href: "/wallet",
    },
    {
      icon: <Settings className="w-6 h-6 text-gray-600" />,
      label: "Settings",
      href: "/settings",
    },
  ];

  return (
    <div className="w-80 bg-white border-r border-gray-200 h-full overflow-y-auto">
      <div className="p-4 space-y-6">
        {/* Profile Section */}
        <Link
          to="/profile"
          className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
        >
          <Avatar className="w-9 h-9">
            <AvatarImage src={user?.avatar} />
            <AvatarFallback className="bg-blue-100 text-blue-600">
              {user?.name?.substring(0, 2).toUpperCase() || "SC"}
            </AvatarFallback>
          </Avatar>
          <span className="font-semibold text-gray-900 truncate">
            {user?.name || "Your Profile"}
          </span>
        </Link>

        {/* Your Shortcuts Section */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-3">
            Your shortcuts
          </h3>
          <div className="flex gap-2 overflow-x-auto pb-2">
            {shortcuts.map((shortcut, index) => (
              <ShortcutItem
                key={index}
                icon={shortcut.icon}
                label={shortcut.label}
                href={shortcut.href}
                badge={shortcut.badge}
              />
            ))}
          </div>
        </div>

        {/* Main Menu Items */}
        <div className="grid grid-cols-2 gap-2">
          {menuItems.map((item, index) => (
            <div
              key={index}
              className="bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition-colors"
            >
              <Link
                to={item.href}
                className={`flex flex-col items-start gap-2 ${
                  isActive(item.href) ? "text-blue-600" : "text-gray-700"
                }`}
              >
                <div className="flex-shrink-0">{item.icon}</div>
                <span className="font-medium text-sm leading-tight">
                  {item.label}
                </span>
              </Link>
            </div>
          ))}
        </div>

        {/* Privacy & Terms Footer */}
        <div className="text-xs text-gray-500 space-y-1 pb-4">
          <div className="flex flex-wrap gap-2">
            <Link to="/privacy" className="hover:underline">
              Privacy
            </Link>
            <span>·</span>
            <Link to="/terms" className="hover:underline">
              Terms
            </Link>
            <span>·</span>
            <Link to="/advertising" className="hover:underline">
              Advertising
            </Link>
            <span>·</span>
            <Link to="/ad-choices" className="hover:underline">
              Ad Choices
            </Link>
          </div>
          <div className="flex flex-wrap gap-2">
            <Link to="/cookies" className="hover:underline">
              Cookies
            </Link>
            <span>·</span>
            <Link to="/help" className="hover:underline">
              More
            </Link>
            <span>·</span>
            <span>SoftChat © 2024</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FacebookStyleSidebar;
