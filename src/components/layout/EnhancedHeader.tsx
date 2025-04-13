
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import SoftchatLogo from "@/components/shared/SoftchatLogo";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Bell,
  Home,
  MessageSquare,
  ShoppingBag,
  Search,
  User,
  Wallet,
  Award,
  LogOut,
  Settings,
  Moon,
  Sun,
  CoinsIcon,
  Users,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/AuthContext";
import { useState } from "react";

const EnhancedHeader = () => {
  const [darkMode, setDarkMode] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    // In a real app, this would toggle the dark mode class on the body
  };

  return (
    <header className="border-b sticky top-0 z-50 bg-background">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-6">
          <Link to="/" className="flex items-center gap-2">
            <SoftchatLogo className="h-6 w-6" />
            <span className="font-bold hidden sm:inline-block">Softchat</span>
          </Link>

          <nav className="hidden md:flex items-center gap-5">
            <Link
              to="/"
              className="text-sm font-medium flex items-center gap-1 hover:text-primary transition-colors"
            >
              <Home className="h-4 w-4" />
              Feed
            </Link>
            <Link
              to="/marketplace"
              className="text-sm font-medium flex items-center gap-1 hover:text-primary transition-colors"
            >
              <ShoppingBag className="h-4 w-4" />
              Marketplace
            </Link>
            <Link
              to="/crypto"
              className="text-sm font-medium flex items-center gap-1 hover:text-primary transition-colors"
            >
              <CoinsIcon className="h-4 w-4" />
              Crypto
            </Link>
            <Link
              to="/rewards"
              className="text-sm font-medium flex items-center gap-1 hover:text-primary transition-colors"
            >
              <Award className="h-4 w-4" />
              Rewards
            </Link>
          </nav>
        </div>

        <div className="hidden sm:flex flex-1 max-w-md mx-6">
          <div className="relative w-full">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search..."
              className="w-full pl-9 rounded-full bg-muted border-none"
            />
          </div>
        </div>

        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            className="relative hover:bg-muted"
            aria-label="Notifications"
          >
            <Bell className="h-5 w-5" />
            <Badge
              className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 bg-primary"
              variant="default"
            >
              3
            </Badge>
          </Button>

          <Button
            variant="ghost"
            size="icon"
            className="relative hover:bg-muted"
            aria-label="Messages"
          >
            <MessageSquare className="h-5 w-5" />
            <Badge
              className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 bg-primary"
              variant="default"
            >
              5
            </Badge>
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="hover:bg-muted">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={user?.avatar || "/placeholder.svg"} alt={user?.name || "User"} />
                  <AvatarFallback>
                    {user?.name?.charAt(0) || "U"}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium">{user?.name}</p>
                  <p className="text-xs text-muted-foreground">@{user?.username}</p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              
              <DropdownMenuItem onClick={() => navigate("/profile")}>
                <User className="mr-2 h-4 w-4" />
                <span>Profile</span>
              </DropdownMenuItem>
              
              <DropdownMenuItem onClick={() => navigate("/wallet")}>
                <Wallet className="mr-2 h-4 w-4" />
                <span>Wallet</span>
              </DropdownMenuItem>
              
              <DropdownMenuItem onClick={() => navigate("/rewards")}>
                <Award className="mr-2 h-4 w-4" />
                <span>Rewards</span>
                <Badge variant="secondary" className="ml-auto">
                  {user?.points.toLocaleString()}
                </Badge>
              </DropdownMenuItem>
              
              <DropdownMenuItem>
                <Users className="mr-2 h-4 w-4" />
                <span>Referrals</span>
              </DropdownMenuItem>
              
              <DropdownMenuSeparator />
              
              <DropdownMenuItem onClick={toggleDarkMode}>
                {darkMode ? (
                  <>
                    <Sun className="mr-2 h-4 w-4" />
                    <span>Light mode</span>
                  </>
                ) : (
                  <>
                    <Moon className="mr-2 h-4 w-4" />
                    <span>Dark mode</span>
                  </>
                )}
              </DropdownMenuItem>
              
              <DropdownMenuItem>
                <Settings className="mr-2 h-4 w-4" />
                <span>Settings</span>
              </DropdownMenuItem>
              
              <DropdownMenuSeparator />
              
              <DropdownMenuItem onClick={logout}>
                <LogOut className="mr-2 h-4 w-4" />
                <span>Logout</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
};

export default EnhancedHeader;
