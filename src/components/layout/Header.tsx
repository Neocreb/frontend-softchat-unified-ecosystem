
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Search, Menu, X, User, Bell, Home, TrendingUp, Wallet, Award, Video, MessageCircle, ShoppingBag } from "lucide-react";
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
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container max-w-7xl flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-2">
          {isMobile && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          )}

          <Link to="/feed" className="flex items-center gap-2">
            <SoftchatLogo className="h-8 w-8" />
            <span className="font-bold text-xl hidden sm:inline-block text-softchat-primary">Softchat</span>
          </Link>
        </div>

        {/* Desktop Search */}
        <div className="hidden md:flex items-center mx-4 flex-1 max-w-md">
          <form onSubmit={handleSearchSubmit} className="w-full relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search"
              className="pl-9 bg-muted/40 border-none rounded-full"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </form>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          <Link to="/feed" className="flex items-center gap-1 text-muted-foreground hover:text-foreground transition-colors">
            <Home className="h-5 w-5" />
          </Link>
          <Link to="/videos" className="flex items-center gap-1 text-muted-foreground hover:text-foreground transition-colors">
            <Video className="h-5 w-5" />
          </Link>
          <Link to="/marketplace" className="flex items-center gap-1 text-muted-foreground hover:text-foreground transition-colors">
            <ShoppingBag className="h-5 w-5" />
          </Link>
          <Link to="/crypto" className="flex items-center gap-1 text-muted-foreground hover:text-foreground transition-colors">
            <TrendingUp className="h-5 w-5" />
          </Link>
          <Link to="/explore" className="flex items-center gap-1 text-muted-foreground hover:text-foreground transition-colors">
            <Search className="h-5 w-5" />
          </Link>
        </nav>

        <div className="flex items-center gap-3">
          {/* Mobile Search Trigger */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            aria-label="Search"
            onClick={() => setSearchOpen(!searchOpen)}
          >
            <Search className="h-5 w-5" />
          </Button>

          <NotificationsDropdown />

          {/* Chat Button */}
          <Link to="/chat">
            <Button variant="ghost" size="icon" aria-label="Messages">
              <MessageCircle className="h-5 w-5" />
            </Button>
          </Link>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={user?.avatar || "/placeholder.svg"} alt={user?.name || "@user"} />
                  <AvatarFallback>{user?.name?.substring(0, 2).toUpperCase() || "SC"}</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">{user?.name || "User"}</p>
                  <p className="text-xs leading-none text-muted-foreground">
                    {user?.email || "user@example.com"}
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link to="/profile" className="flex items-center w-full">
                  <User className="mr-2 h-4 w-4" />
                  <span>Profile</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to="/wallet" className="flex items-center w-full">
                  <Wallet className="mr-2 h-4 w-4" />
                  <span>Wallet</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to="/rewards" className="flex items-center w-full">
                  <Award className="mr-2 h-4 w-4" />
                  <span>Rewards</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link to="/settings" className="flex items-center w-full">
                  Settings
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={logout}>
                Log out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Mobile Search Bar */}
      {searchOpen && (
        <div className="md:hidden p-2 border-t">
          <form onSubmit={handleSearchSubmit} className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search"
              className="pl-9 bg-muted/40 border-none rounded-full"
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
          "fixed inset-0 top-16 z-50 grid h-[calc(100vh-4rem)] grid-flow-row auto-rows-max overflow-auto p-6 pb-32 shadow-md animate-in slide-in-from-bottom-80 md:hidden bg-background",
          mobileMenuOpen ? "block" : "hidden"
        )}
      >
        <div className="relative z-20 grid gap-6 rounded-md bg-background p-4">
          <Link to="/feed" className="flex items-center gap-2 text-lg font-semibold" onClick={() => setMobileMenuOpen(false)}>
            <Home className="h-5 w-5" />
            <span>Feed</span>
          </Link>
          <Link to="/videos" className="flex items-center gap-2 text-lg font-semibold" onClick={() => setMobileMenuOpen(false)}>
            <Video className="h-5 w-5" />
            <span>Videos</span>
          </Link>
          <Link to="/marketplace" className="flex items-center gap-2 text-lg font-semibold" onClick={() => setMobileMenuOpen(false)}>
            <ShoppingBag className="h-5 w-5" />
            <span>Marketplace</span>
          </Link>
          <Link to="/crypto" className="flex items-center gap-2 text-lg font-semibold" onClick={() => setMobileMenuOpen(false)}>
            <TrendingUp className="h-5 w-5" />
            <span>Crypto</span>
          </Link>
          <Link to="/explore" className="flex items-center gap-2 text-lg font-semibold" onClick={() => setMobileMenuOpen(false)}>
            <Search className="h-5 w-5" />
            <span>Explore</span>
          </Link>
          <Link to="/wallet" className="flex items-center gap-2 text-lg font-semibold" onClick={() => setMobileMenuOpen(false)}>
            <Wallet className="h-5 w-5" />
            <span>Wallet</span>
          </Link>
          <Link to="/chat" className="flex items-center gap-2 text-lg font-semibold" onClick={() => setMobileMenuOpen(false)}>
            <MessageCircle className="h-5 w-5" />
            <span>Chat</span>
          </Link>
          <Link to="/rewards" className="flex items-center gap-2 text-lg font-semibold" onClick={() => setMobileMenuOpen(false)}>
            <Award className="h-5 w-5" />
            <span>Rewards</span>
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Header;
