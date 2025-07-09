import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Search,
  Menu,
  X,
  User,
  Bell,
  Home,
  TrendingUp,
  Wallet,
  Award,
  Video,
  MessageCircle,
  ShoppingCart,
  Briefcase,
  Settings,
  BarChart3,
  Bot,
  Globe,
  Calendar,
} from "lucide-react";
import { cn } from "@/utils/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useIsMobile } from "@/hooks/use-mobile";
import { useAuth } from "@/contexts/AuthContext";
import SoftchatLogo from "../shared/SoftchatLogo";
import NotificationsDropdown from "./NotificationsDropdown";
import { ThemeToggle } from "@/components/ui/theme-toggle";

const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const isMobile = useIsMobile();
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/explore?q=${encodeURIComponent(searchQuery)}`);
      setSearchOpen(false);
      setSearchQuery("");
    }
  };

  return (
    <header className="fixed top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div
        className={`w-full max-w-full flex h-14 items-center justify-between ${isMobile ? "px-3" : "px-4"}`}
      >
        <div className="flex items-center gap-2 min-w-0 flex-1">
          {isMobile && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden h-8 w-8 flex-shrink-0"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? (
                <X className="h-4 w-4" />
              ) : (
                <Menu className="h-4 w-4" />
              )}
            </Button>
          )}

          <Link to="/" className="flex items-center gap-2 min-w-0 flex-1">
            <SoftchatLogo
              className={`${isMobile ? "h-6 w-6" : "h-8 w-8"} flex-shrink-0`}
            />
            <span
              className={`font-bold text-softchat-primary truncate ${isMobile ? "text-lg" : "text-xl"}`}
            >
              Softchat
            </span>
          </Link>
        </div>

        {/* Desktop Search */}
        <div className="hidden md:flex items-center mx-2 lg:mx-4 flex-1 max-w-md">
          <form onSubmit={handleSearchSubmit} className="w-full relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search"
              className="pl-9 bg-muted/40 border-none rounded-full text-sm"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </form>
        </div>

        {/* Creator Studio Quick Link */}
        <div className="hidden lg:flex items-center">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate("/creator-studio")}
            className="text-sm font-medium"
          >
            <BarChart3 className="w-4 h-4 mr-2" />
            Creator Studio
          </Button>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-2 lg:gap-4 xl:gap-6">
          <Link
            to="/feed"
            className="flex items-center gap-1 text-muted-foreground hover:text-foreground transition-colors px-2 py-1 rounded-md hover:bg-muted/50"
          >
            <Home className="h-4 w-4 lg:h-5 lg:w-5" />
            <span className="text-sm hidden lg:inline">Feed</span>
          </Link>
          <Link
            to="/explore"
            className="flex items-center gap-1 text-muted-foreground hover:text-foreground transition-colors px-2 py-1 rounded-md hover:bg-muted/50"
          >
            <Search className="h-4 w-4 lg:h-5 lg:w-5" />
            <span className="text-sm hidden lg:inline">Explore</span>
          </Link>
          <Link
            to="/videos"
            className="flex items-center gap-1 text-muted-foreground hover:text-foreground transition-colors px-2 py-1 rounded-md hover:bg-muted/50"
          >
            <Video className="h-4 w-4 lg:h-5 lg:w-5" />
            <span className="text-sm hidden lg:inline">Videos</span>
          </Link>
          <Link
            to="/marketplace"
            className="flex items-center gap-1 text-muted-foreground hover:text-foreground transition-colors px-2 py-1 rounded-md hover:bg-muted/50"
          >
            <ShoppingCart className="h-4 w-4 lg:h-5 lg:w-5" />
            <span className="text-sm hidden lg:inline">Market</span>
          </Link>
          <Link
            to="/crypto"
            className="flex items-center gap-1 text-muted-foreground hover:text-foreground transition-colors px-2 py-1 rounded-md hover:bg-muted/50"
          >
            <TrendingUp className="h-4 w-4 lg:h-5 lg:w-5" />
            <span className="text-sm hidden lg:inline">Crypto</span>
          </Link>
          <Link
            to="/freelance"
            className="flex items-center gap-1 text-muted-foreground hover:text-foreground transition-colors px-2 py-1 rounded-md hover:bg-muted/50"
          >
            <Briefcase className="h-4 w-4 lg:h-5 lg:w-5" />
            <span className="text-sm hidden lg:inline">Freelance</span>
          </Link>
          <Link
            to="/rewards"
            className="flex items-center gap-1 text-muted-foreground hover:text-foreground transition-colors px-2 py-1 rounded-md hover:bg-muted/50"
          >
            <Award className="h-4 w-4 lg:h-5 lg:w-5" />
            <span className="text-sm hidden lg:inline">Rewards</span>
          </Link>
          <Link
            to="/creator-studio"
            className="flex items-center gap-1 text-muted-foreground hover:text-foreground transition-colors px-2 py-1 rounded-md hover:bg-muted/50"
          >
            <BarChart3 className="h-4 w-4 lg:h-5 lg:w-5" />
            <span className="text-sm hidden lg:inline">Creator Studio</span>
          </Link>
          <Link
            to="/events"
            className="flex items-center gap-1 text-muted-foreground hover:text-foreground transition-colors px-2 py-1 rounded-md hover:bg-muted/50"
          >
            <Calendar className="h-4 w-4 lg:h-5 lg:w-5" />
            <span className="text-sm hidden lg:inline">Events</span>
          </Link>
          <Link
            to="/live-streaming"
            className="flex items-center gap-1 text-muted-foreground hover:text-foreground transition-colors px-2 py-1 rounded-md hover:bg-muted/50"
          >
            <Video className="h-4 w-4 lg:h-5 lg:w-5" />
            <span className="text-sm hidden lg:inline">Live</span>
          </Link>
          <Link
            to="/ai-assistant"
            className="flex items-center gap-1 text-muted-foreground hover:text-foreground transition-colors px-2 py-1 rounded-md hover:bg-muted/50"
          >
            <Bot className="h-4 w-4 lg:h-5 lg:w-5" />
            <span className="text-sm hidden xl:inline">AI Assistant</span>
          </Link>
        </nav>

        <div className="flex items-center gap-1 min-w-0">
          {/* Search Button - Mobile only */}
          {isMobile && (
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 flex-shrink-0"
              aria-label="Search"
              onClick={() => setSearchOpen(!searchOpen)}
            >
              <Search className="h-4 w-4" />
            </Button>
          )}

          {/* Chat Button - Mobile only */}
          {isMobile && (
            <Link to="/chat">
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 flex-shrink-0"
                aria-label="Messages"
              >
                <MessageCircle className="h-4 w-4" />
              </Button>
            </Link>
          )}

          {/* Language and Currency Selectors - Desktop only - Temporarily disabled */}
          {/* <div className="hidden lg:flex items-center gap-1">
            <QuickLanguageSelector />
            <QuickCurrencySelector />
          </div> */}

          {/* Notifications */}
          <NotificationsDropdown />

          {/* Theme Toggle - Hidden on mobile to save space */}
          <div className="hidden lg:block">
            <ThemeToggle />
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className={`relative rounded-full flex-shrink-0 ${isMobile ? "h-8 w-8" : "h-9 w-9"}`}
              >
                <Avatar className={isMobile ? "h-7 w-7" : "h-8 w-8"}>
                  <AvatarImage
                    src={user?.avatar || "/placeholder.svg"}
                    alt={user?.name || "@user"}
                  />
                  <AvatarFallback className="text-xs">
                    {user?.name?.substring(0, 2).toUpperCase() || "SC"}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              className="w-48 sm:w-56"
              align="end"
              forceMount
            >
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">
                    {user?.name || "User"}
                  </p>
                  <p className="text-xs leading-none text-muted-foreground">
                    {user?.email || "user@example.com"}
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link
                  to="/profile"
                  className="flex items-center w-full font-medium"
                >
                  <User className="mr-2 h-4 w-4" />
                  <span>Profile</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link
                  to="/ai-assistant"
                  className="flex items-center w-full font-medium"
                >
                  <Bot className="mr-2 h-4 w-4" />
                  <span>AI Assistant</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link
                  to="/settings"
                  className="flex items-center w-full font-medium"
                >
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Settings</span>
                </Link>
              </DropdownMenuItem>
              {/* Temporarily disabled - Language & Region */}
              {/* <DropdownMenuItem asChild>
                <div className="flex items-center w-full font-medium lg:hidden">
                  <Globe className="mr-2 h-4 w-4" />
                  <span>Language & Region</span>
                </div>
              </DropdownMenuItem> */}
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link to="/wallet" className="flex items-center w-full">
                  <Wallet className="mr-2 h-4 w-4" />
                  <span>Wallet</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to="/chat" className="flex items-center w-full">
                  <MessageCircle className="mr-2 h-4 w-4" />
                  <span>Messages</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link
                  to="/premium"
                  className="flex items-center w-full font-medium text-purple-600"
                >
                  <Award className="mr-2 h-4 w-4" />
                  <span>Premium</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to="/kyc" className="flex items-center w-full">
                  <ShoppingCart className="mr-2 h-4 w-4" />
                  <span>KYC Verification</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to="/notifications" className="flex items-center w-full">
                  <Bell className="mr-2 h-4 w-4" />
                  <span>Notifications</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={logout}>Log out</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Mobile Search Bar */}
      {searchOpen && (
        <div className="p-3 border-t w-full bg-background">
          <form
            onSubmit={handleSearchSubmit}
            className="relative w-full max-w-full"
          >
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search SoftChat"
              className="pl-9 bg-muted/40 border-none rounded-full w-full focus:bg-background"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              autoFocus
            />
          </form>
        </div>
      )}

      {/* Mobile Menu */}
      <div
        className={cn(
          "fixed inset-0 top-14 z-[100] grid h-[calc(100vh-3.5rem)] grid-flow-row auto-rows-max overflow-auto p-4 pb-20 shadow-md animate-in slide-in-from-bottom-80 md:hidden bg-background",
          mobileMenuOpen ? "block" : "hidden",
        )}
      >
        <div className="relative z-20 grid gap-4 rounded-md bg-background p-4 w-full max-w-full mx-auto">
          <Link
            to="/feed"
            className="flex items-center gap-3 text-lg font-semibold p-3 rounded-lg hover:bg-muted/50 transition-colors"
            onClick={() => setMobileMenuOpen(false)}
          >
            <Home className="h-5 w-5" />
            <span>Feed</span>
          </Link>
          <Link
            to="/videos"
            className="flex items-center gap-3 text-lg font-semibold p-3 rounded-lg hover:bg-muted/50 transition-colors"
            onClick={() => setMobileMenuOpen(false)}
          >
            <Video className="h-5 w-5" />
            <span>Videos</span>
          </Link>
          <Link
            to="/explore"
            className="flex items-center gap-3 text-lg font-semibold p-3 rounded-lg hover:bg-muted/50 transition-colors"
            onClick={() => setMobileMenuOpen(false)}
          >
            <Search className="h-5 w-5" />
            <span>Explore</span>
          </Link>
          <Link
            to="/crypto"
            className="flex items-center gap-3 text-lg font-semibold p-3 rounded-lg hover:bg-muted/50 transition-colors"
            onClick={() => setMobileMenuOpen(false)}
          >
            <TrendingUp className="h-5 w-5" />
            <span>Crypto</span>
          </Link>
          <Link
            to="/marketplace"
            className="flex items-center gap-3 text-lg font-semibold p-3 rounded-lg hover:bg-muted/50 transition-colors"
            onClick={() => setMobileMenuOpen(false)}
          >
            <ShoppingCart className="h-5 w-5" />
            <span>Marketplace</span>
          </Link>
          <Link
            to="/freelance"
            className="flex items-center gap-3 text-lg font-semibold p-3 rounded-lg hover:bg-muted/50 transition-colors"
            onClick={() => setMobileMenuOpen(false)}
          >
            <Briefcase className="h-5 w-5" />
            <span>Freelance</span>
          </Link>
          <Link
            to="/wallet"
            className="flex items-center gap-3 text-lg font-semibold p-3 rounded-lg hover:bg-muted/50 transition-colors"
            onClick={() => setMobileMenuOpen(false)}
          >
            <Wallet className="h-5 w-5" />
            <span>Wallet</span>
          </Link>
          <Link
            to="/rewards"
            className="flex items-center gap-3 text-lg font-semibold p-3 rounded-lg hover:bg-muted/50 transition-colors"
            onClick={() => setMobileMenuOpen(false)}
          >
            <Award className="h-5 w-5" />
            <span>Rewards</span>
          </Link>
          <Link
            to="/ai-assistant"
            className="flex items-center gap-3 text-lg font-semibold p-3 rounded-lg hover:bg-muted/50 transition-colors"
            onClick={() => setMobileMenuOpen(false)}
          >
            <Bot className="h-5 w-5" />
            <span>AI Assistant</span>
          </Link>
          <Link
            to="/creator-studio"
            className="flex items-center gap-3 text-lg font-semibold p-3 rounded-lg hover:bg-muted/50 transition-colors"
            onClick={() => setMobileMenuOpen(false)}
          >
            <BarChart3 className="h-5 w-5" />
            <span>Creator Studio</span>
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Header;
