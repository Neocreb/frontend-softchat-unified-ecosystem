import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  MessageCircle,
  Menu,
  X,
  User,
  ShoppingCart,
  Home,
  TrendingUp,
  Wallet,
  Award,
  Search,
} from "lucide-react";
import { AdvancedSearch } from "../search/AdvancedSearch";
import { cn } from "@/utils/utils";
import { Button } from "@/components/ui/button";
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

const EnhancedHeader = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const isMobile = useIsMobile();
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleChatClick = () => {
    navigate("/chat");
  };

  return (
    <header
      className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur
    supports-[backdrop-filter]:bg-background/60 shadow-md"
    >
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-2">
          <Link to="/" className="flex items-center gap-2">
            <SoftchatLogo className="h-8 w-8" />
            <span className="font-bold text-xl hidden sm:inline-block text-softchat-primary">
              Softchat
            </span>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          <Link
            to="/"
            className="flex items-center gap-1 text-muted-foreground hover:text-foreground transition-colors"
          >
            <Home className="h-4 w-4" />
            <span>Feed</span>
          </Link>
          <Link
            to="/marketplace"
            className="flex items-center gap-1 text-muted-foreground hover:text-foreground transition-colors"
          >
            <ShoppingCart className="h-4 w-4" />
            <span>Marketplace</span>
          </Link>
          <Link
            to="/crypto"
            className="flex items-center gap-1 text-muted-foreground hover:text-foreground transition-colors"
          >
            <TrendingUp className="h-4 w-4" />
            <span>Crypto</span>
          </Link>
          <Link
            to="/wallet"
            className="flex items-center gap-1 text-muted-foreground hover:text-foreground transition-colors"
          >
            <Wallet className="h-4 w-4" />
            <span>Wallet</span>
          </Link>
          <Link
            to="/rewards"
            className="flex items-center gap-1 text-muted-foreground hover:text-foreground transition-colors"
          >
            <Award className="h-4 w-4" />
            <span>Rewards</span>
          </Link>
        </nav>

        <div className="flex items-center gap-3">
          <NotificationsDropdown />

          <Button
            variant="ghost"
            size="icon"
            aria-label="Messages"
            onClick={handleChatClick}
          >
            <MessageCircle className="h-5 w-5" />
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                <Avatar className="h-8 w-8">
                  <AvatarImage
                    src={user?.user_metadata?.avatar || "/placeholder.svg"}
                    alt={user?.user_metadata?.name || "@user"}
                  />
                  <AvatarFallback>
                    {user?.user_metadata?.name?.substring(0, 2).toUpperCase() ||
                      "SC"}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">
                    {user?.user_metadata?.name || "User"}
                  </p>
                  <p className="text-xs leading-none text-muted-foreground">
                    {user?.email || "user@example.com"}
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <Link to="/profile" className="flex items-center w-full">
                  <User className="mr-2 h-4 w-4" />
                  <span>Profile</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Link to="/wallet" className="flex items-center w-full">
                  <Wallet className="mr-2 h-4 w-4" />
                  <span>Wallet</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Link to="/rewards" className="flex items-center w-full">
                  <Award className="mr-2 h-4 w-4" />
                  <span>Rewards</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <Link to="/settings" className="flex items-center w-full">
                  Settings
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={logout}>Log out</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={cn(
          "fixed inset-0 top-16 z-50 grid h-[calc(100vh-4rem)] grid-flow-row auto-rows-max overflow-auto p-6 pb-32 shadow-md animate-in slide-in-from-bottom-80 md:hidden bg-background shadow-md",
          mobileMenuOpen ? "block" : "hidden",
        )}
      >
        <div className="relative z-20 grid gap-6 rounded-md bg-background p-4">
          <Link
            to="/"
            className="flex items-center gap-2 text-lg font-semibold"
            onClick={() => setMobileMenuOpen(false)}
          >
            <Home className="h-5 w-5" />
            <span>Feed</span>
          </Link>
          <Link
            to="/marketplace"
            className="flex items-center gap-2 text-lg font-semibold"
            onClick={() => setMobileMenuOpen(false)}
          >
            <ShoppingCart className="h-5 w-5" />
            <span>Marketplace</span>
          </Link>
          <Link
            to="/crypto"
            className="flex items-center gap-2 text-lg font-semibold"
            onClick={() => setMobileMenuOpen(false)}
          >
            <TrendingUp className="h-5 w-5" />
            <span>Crypto</span>
          </Link>
          <Link
            to="/wallet"
            className="flex items-center gap-2 text-lg font-semibold"
            onClick={() => setMobileMenuOpen(false)}
          >
            <Wallet className="h-5 w-5" />
            <span>Wallet</span>
          </Link>
          <Link
            to="/rewards"
            className="flex items-center gap-2 text-lg font-semibold"
            onClick={() => setMobileMenuOpen(false)}
          >
            <Award className="h-5 w-5" />
            <span>Rewards</span>
          </Link>
          <Link
            to="/chat"
            className="flex items-center gap-2 text-lg font-semibold"
            onClick={() => setMobileMenuOpen(false)}
          >
            <MessageCircle className="h-5 w-5" />
            <span>Chat</span>
          </Link>
        </div>
      </div>
    </header>
  );
};

export default EnhancedHeader;
