import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Search,
  ShoppingBag,
  Heart,
  User,
  Store,
  Home,
  Grid3x3,
  Menu,
  X,
  Bell,
  MessageCircle,
  Package,
} from "lucide-react";

interface MobileMarketplaceNavProps {
  cartItemCount?: number;
  wishlistItemCount?: number;
  unreadMessages?: number;
  isSellerMode?: boolean;
  onToggleSellerMode?: () => void;
}

export const MobileMarketplaceNav: React.FC<MobileMarketplaceNavProps> = ({
  cartItemCount = 0,
  wishlistItemCount = 0,
  unreadMessages = 0,
  isSellerMode = false,
  onToggleSellerMode,
}) => {
  const [showMenu, setShowMenu] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  const buyerNavItems = [
    {
      icon: Home,
      label: "Home",
      path: "/marketplace",
      badge: null,
    },
    {
      icon: Grid3x3,
      label: "Browse",
      path: "/marketplace/browse",
      badge: null,
    },
    {
      icon: ShoppingBag,
      label: "Cart",
      path: "/marketplace/cart",
      badge: cartItemCount > 0 ? cartItemCount : null,
    },
    {
      icon: Heart,
      label: "Wishlist",
      path: "/marketplace/wishlist",
      badge: wishlistItemCount > 0 ? wishlistItemCount : null,
    },
    {
      icon: User,
      label: "Profile",
      path: "/marketplace/profile",
      badge: null,
    },
  ];

  const sellerNavItems = [
    {
      icon: Home,
      label: "Dashboard",
      path: "/marketplace/seller",
      badge: null,
    },
    {
      icon: Store,
      label: "Products",
      path: "/marketplace/seller/products",
      badge: null,
    },
    {
      icon: ShoppingBag,
      label: "Orders",
      path: "/marketplace/seller/orders",
      badge: null,
    },
    {
      icon: MessageCircle,
      label: "Messages",
      path: "/marketplace/seller/messages",
      badge: unreadMessages > 0 ? unreadMessages : null,
    },
    {
      icon: User,
      label: "Account",
      path: "/marketplace/seller/account",
      badge: null,
    },
  ];

  const currentNavItems = isSellerMode ? sellerNavItems : buyerNavItems;

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // Navigate to search results
      window.location.href = `/marketplace/search?q=${encodeURIComponent(searchQuery)}`;
      setShowSearch(false);
      setSearchQuery("");
    }
  };

  return (
    <>
      {/* Top Bar */}
      <div className="lg:hidden bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setShowMenu(true)}
            className="p-2 -ml-2 rounded-lg hover:bg-gray-100"
          >
            <Menu className="w-6 h-6 text-gray-600" />
          </button>
          <Link to="/marketplace" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <Store className="w-5 h-5 text-white" />
            </div>
            <span className="text-lg font-bold text-gray-900">Marketplace</span>
          </Link>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => setShowSearch(true)}
            className="p-2 rounded-lg hover:bg-gray-100"
          >
            <Search className="w-6 h-6 text-gray-600" />
          </button>
          <Link
            to="/marketplace/notifications"
            className="p-2 rounded-lg hover:bg-gray-100 relative"
          >
            <Bell className="w-6 h-6 text-gray-600" />
            {unreadMessages > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                {unreadMessages > 9 ? "9+" : unreadMessages}
              </span>
            )}
          </Link>
        </div>
      </div>

      {/* Search Overlay */}
      {showSearch && (
        <div className="lg:hidden fixed inset-0 bg-white z-50">
          <div className="flex items-center p-4 border-b border-gray-200">
            <button
              onClick={() => setShowSearch(false)}
              className="p-2 -ml-2 mr-3 rounded-lg hover:bg-gray-100"
            >
              <X className="w-6 h-6 text-gray-600" />
            </button>
            <form onSubmit={handleSearch} className="flex-1">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search products..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                autoFocus
              />
            </form>
          </div>
          <div className="p-4">
            <div className="text-sm text-gray-500 mb-3">Recent Searches</div>
            <div className="space-y-2">
              {["Electronics", "Fashion", "Home & Garden"].map((term) => (
                <button
                  key={term}
                  onClick={() => {
                    setSearchQuery(term);
                    handleSearch({
                      preventDefault: () => {},
                    } as React.FormEvent);
                  }}
                  className="block w-full text-left px-3 py-2 hover:bg-gray-100 rounded-lg"
                >
                  {term}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Side Menu */}
      {showMenu && (
        <div className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-50">
          <div className="w-80 bg-white h-full">
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Menu</h2>
              <button
                onClick={() => setShowMenu(false)}
                className="p-2 rounded-lg hover:bg-gray-100"
              >
                <X className="w-6 h-6 text-gray-600" />
              </button>
            </div>

            <div className="p-4">
              {/* Mode Toggle */}
              {onToggleSellerMode && (
                <div className="mb-6 p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700">
                      {isSellerMode ? "Seller Mode" : "Buyer Mode"}
                    </span>
                    <button
                      onClick={() => {
                        onToggleSellerMode();
                        setShowMenu(false);
                      }}
                      className="px-3 py-1 text-xs bg-blue-600 text-white rounded-full hover:bg-blue-700"
                    >
                      Switch to {isSellerMode ? "Buyer" : "Seller"}
                    </button>
                  </div>
                </div>
              )}

              {/* Navigation Items */}
              <nav className="space-y-2">
                {currentNavItems.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setShowMenu(false)}
                    className={`flex items-center justify-between p-3 rounded-lg transition-colors ${
                      isActive(item.path)
                        ? "bg-blue-50 text-blue-600"
                        : "text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <item.icon className="w-5 h-5" />
                      <span className="font-medium">{item.label}</span>
                    </div>
                    {item.badge && (
                      <span className="px-2 py-1 text-xs bg-red-500 text-white rounded-full">
                        {item.badge > 9 ? "9+" : item.badge}
                      </span>
                    )}
                  </Link>
                ))}
              </nav>

              {/* Additional Links */}
              <div className="mt-8 pt-6 border-t border-gray-200">
                <div className="space-y-2">
                  <Link
                    to="/marketplace/help"
                    onClick={() => setShowMenu(false)}
                    className="block p-3 text-gray-700 hover:bg-gray-100 rounded-lg"
                  >
                    Help & Support
                  </Link>
                  <Link
                    to="/marketplace/settings"
                    onClick={() => setShowMenu(false)}
                    className="block p-3 text-gray-700 hover:bg-gray-100 rounded-lg"
                  >
                    Settings
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Bottom Navigation */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-2 py-1">
        <div className="flex items-center justify-around">
          {currentNavItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex flex-col items-center p-2 min-w-0 flex-1 relative ${
                isActive(item.path) ? "text-blue-600" : "text-gray-600"
              }`}
            >
              <item.icon className="w-5 h-5 mb-1" />
              <span className="text-xs font-medium truncate">{item.label}</span>
              {item.badge && (
                <span className="absolute -top-1 left-1/2 transform -translate-x-1/2 translate-x-2 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                  {item.badge > 9 ? "9+" : item.badge}
                </span>
              )}
            </Link>
          ))}
        </div>
      </div>

      {/* Bottom padding for fixed navigation */}
      <div className="lg:hidden h-16" />
    </>
  );
};
