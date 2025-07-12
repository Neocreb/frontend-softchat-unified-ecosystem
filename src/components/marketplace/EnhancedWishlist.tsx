import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Heart,
  ShoppingCart,
  Share2,
  MoreHorizontal,
  X,
  Bell,
  DollarSign,
  TrendingDown,
  TrendingUp,
  Star,
  Package,
  Plus,
  Edit,
  Trash2,
  Copy,
  AlertCircle,
  CheckCircle,
  Filter,
  Eye,
  Archive,
  BookmarkPlus,
} from "lucide-react";
import { useEnhancedMarketplace } from "@/contexts/EnhancedMarketplaceContext";
import { useToast } from "@/components/ui/use-toast";
import { WishlistItem, Wishlist, Product } from "@/types/enhanced-marketplace";

const EnhancedWishlist: React.FC = () => {
  const {
    getWishlists,
    createWishlist,
    addToWishlist,
    removeFromWishlist,
    moveToCart,
    shareWishlist,
    setPriceAlert,
    getPriceHistory,
  } = useEnhancedMarketplace();

  const { toast } = useToast();

  const [wishlists] = useState<Wishlist[]>([
    {
      id: "default",
      userId: "user1",
      name: "My Wishlist",
      description: "Items I want to buy later",
      isPublic: false,
      isDefault: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: "wishlist2",
      userId: "user1",
      name: "Birthday Gifts",
      description: "Gift ideas for upcoming birthdays",
      isPublic: true,
      isDefault: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ]);

  const [wishlistItems] = useState<WishlistItem[]>([
    {
      id: "item1",
      wishlistId: "default",
      productId: "1",
      notifyOnSale: true,
      notifyOnRestock: false,
      targetPrice: 200,
      priceWhenAdded: 249.99,
      lowestPriceSeen: 229.99,
      priority: 5,
      addedAt: new Date().toISOString(),
      product: {
        id: "1",
        name: "Wireless Noise Cancelling Headphones",
        description:
          "Premium wireless headphones with active noise cancellation",
        shortDescription: "Premium wireless headphones with ANC",
        productType: "physical",
        category: "electronics",
        price: 299.99,
        discountPrice: 249.99,
        image:
          "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&auto=format&fit=crop&q=60",
        inStock: true,
        status: "active",
        isDigital: false,
        isFeatured: true,
        isSponsored: true,
        rating: 4.8,
        averageRating: 4.8,
        totalReviews: 124,
        totalSales: 89,
        viewCount: 1247,
        clickCount: 398,
        favoriteCount: 67,
        sellerId: "seller1",
        sellerName: "AudioTech",
        sellerAvatar: "https://randomuser.me/api/portraits/men/32.jpg",
        sellerVerified: true,
        boostLevel: 2,
        createdAt: "2023-01-15T10:30:00Z",
        updatedAt: "2023-01-15T10:30:00Z",
      },
    },
    {
      id: "item2",
      wishlistId: "default",
      productId: "2",
      notifyOnSale: false,
      notifyOnRestock: true,
      priority: 3,
      addedAt: new Date().toISOString(),
      product: {
        id: "2",
        name: "Smart Watch Series 5",
        description: "Track your fitness and stay connected",
        productType: "physical",
        category: "electronics",
        price: 199.99,
        image:
          "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&auto=format&fit=crop&q=60",
        inStock: false,
        status: "active",
        isDigital: false,
        isFeatured: true,
        isSponsored: false,
        rating: 4.5,
        averageRating: 4.5,
        totalReviews: 89,
        totalSales: 156,
        viewCount: 892,
        clickCount: 234,
        favoriteCount: 45,
        sellerId: "seller2",
        sellerName: "TechGadgets",
        sellerAvatar: "https://randomuser.me/api/portraits/women/44.jpg",
        sellerVerified: true,
        boostLevel: 0,
        createdAt: "2023-02-20T14:45:00Z",
        updatedAt: "2023-02-20T14:45:00Z",
      },
    },
  ]);

  const [activeWishlistId, setActiveWishlistId] = useState("default");
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showPriceAlertDialog, setShowPriceAlertDialog] = useState(false);
  const [selectedItem, setSelectedItem] = useState<WishlistItem | null>(null);
  const [newWishlistName, setNewWishlistName] = useState("");
  const [newWishlistDescription, setNewWishlistDescription] = useState("");
  const [targetPrice, setTargetPrice] = useState("");
  const [filterInStock, setFilterInStock] = useState<boolean | null>(null);
  const [filterOnSale, setFilterOnSale] = useState<boolean | null>(null);
  const [sortBy, setSortBy] = useState<
    "recent" | "price-low" | "price-high" | "priority"
  >("recent");

  const activeWishlist =
    wishlists.find((w) => w.id === activeWishlistId) || wishlists[0];
  const filteredItems = wishlistItems
    .filter((item) => item.wishlistId === activeWishlistId)
    .filter((item) => {
      if (filterInStock !== null && item.product?.inStock !== filterInStock)
        return false;
      if (filterOnSale !== null) {
        const isOnSale =
          item.product?.discountPrice &&
          item.product.discountPrice < item.product.price;
        if (isOnSale !== filterOnSale) return false;
      }
      return true;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "price-low":
          return (
            (a.product?.discountPrice || a.product?.price || 0) -
            (b.product?.discountPrice || b.product?.price || 0)
          );
        case "price-high":
          return (
            (b.product?.discountPrice || b.product?.price || 0) -
            (a.product?.discountPrice || a.product?.price || 0)
          );
        case "priority":
          return b.priority - a.priority;
        case "recent":
        default:
          return new Date(b.addedAt).getTime() - new Date(a.addedAt).getTime();
      }
    });

  const handleCreateWishlist = async () => {
    if (!newWishlistName.trim()) return;

    try {
      await createWishlist(newWishlistName, newWishlistDescription);
      toast({
        title: "Wishlist Created",
        description: `"${newWishlistName}" has been created successfully`,
      });
      setShowCreateDialog(false);
      setNewWishlistName("");
      setNewWishlistDescription("");
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create wishlist",
        variant: "destructive",
      });
    }
  };

  const handleMoveToCart = async (item: WishlistItem) => {
    if (!item.product?.inStock) {
      toast({
        title: "Out of Stock",
        description: "This item is currently out of stock",
        variant: "destructive",
      });
      return;
    }

    try {
      await moveToCart(item.id);
      toast({
        title: "Added to Cart",
        description: `${item.product?.name} has been added to your cart`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add item to cart",
        variant: "destructive",
      });
    }
  };

  const handleRemoveFromWishlist = (itemId: string) => {
    removeFromWishlist(itemId);
    toast({
      title: "Removed from Wishlist",
      description: "Item has been removed from your wishlist",
    });
  };

  const handleShareWishlist = async (wishlistId: string) => {
    try {
      const shareUrl = await shareWishlist(wishlistId);
      await navigator.clipboard.writeText(shareUrl);
      toast({
        title: "Wishlist Shared",
        description: "Share link has been copied to clipboard",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to share wishlist",
        variant: "destructive",
      });
    }
  };

  const handleSetPriceAlert = async () => {
    if (!selectedItem || !targetPrice) return;

    try {
      await setPriceAlert(selectedItem.productId, parseFloat(targetPrice));
      toast({
        title: "Price Alert Set",
        description: `You'll be notified when the price drops to $${targetPrice}`,
      });
      setShowPriceAlertDialog(false);
      setTargetPrice("");
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to set price alert",
        variant: "destructive",
      });
    }
  };

  const getPriceChangeColor = (item: WishlistItem) => {
    if (!item.priceWhenAdded || !item.product) return "text-gray-500";
    const currentPrice = item.product.discountPrice || item.product.price;
    if (currentPrice < item.priceWhenAdded) return "text-green-600";
    if (currentPrice > item.priceWhenAdded) return "text-red-600";
    return "text-gray-500";
  };

  const getPriceChangeIcon = (item: WishlistItem) => {
    if (!item.priceWhenAdded || !item.product) return null;
    const currentPrice = item.product.discountPrice || item.product.price;
    if (currentPrice < item.priceWhenAdded)
      return <TrendingDown className="h-3 w-3" />;
    if (currentPrice > item.priceWhenAdded)
      return <TrendingUp className="h-3 w-3" />;
    return null;
  };

  return (
    <div className="container py-6 space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">My Wishlists</h1>
          <p className="text-muted-foreground">Save items you love for later</p>
        </div>

        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => handleShareWishlist(activeWishlistId)}
          >
            <Share2 className="h-4 w-4 mr-2" />
            Share
          </Button>
          <Button onClick={() => setShowCreateDialog(true)}>
            <Plus className="h-4 w-4 mr-2" />
            New Wishlist
          </Button>
        </div>
      </div>

      {/* Wishlist Tabs */}
      <Tabs value={activeWishlistId} onValueChange={setActiveWishlistId}>
        <TabsList className="mb-6">
          {wishlists.map((wishlist) => (
            <TabsTrigger
              key={wishlist.id}
              value={wishlist.id}
              className="flex items-center gap-2"
            >
              <Heart className="h-4 w-4" />
              {wishlist.name}
              {wishlist.isDefault && (
                <Badge variant="secondary" className="text-xs">
                  Default
                </Badge>
              )}
            </TabsTrigger>
          ))}
        </TabsList>

        {wishlists.map((wishlist) => (
          <TabsContent key={wishlist.id} value={wishlist.id}>
            {/* Filters and Sort */}
            <Card className="mb-6">
              <CardContent className="p-4">
                <div className="flex flex-wrap items-center gap-4">
                  <div className="flex items-center gap-2">
                    <Filter className="h-4 w-4" />
                    <Label>Filters:</Label>
                  </div>
                  <Select
                    value={filterInStock?.toString() || "all"}
                    onValueChange={(value) =>
                      setFilterInStock(
                        value === "all" ? null : value === "true",
                      )
                    }
                  >
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Items</SelectItem>
                      <SelectItem value="true">In Stock</SelectItem>
                      <SelectItem value="false">Out of Stock</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select
                    value={filterOnSale?.toString() || "all"}
                    onValueChange={(value) =>
                      setFilterOnSale(value === "all" ? null : value === "true")
                    }
                  >
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Prices</SelectItem>
                      <SelectItem value="true">On Sale</SelectItem>
                      <SelectItem value="false">Regular Price</SelectItem>
                    </SelectContent>
                  </Select>
                  <div className="flex items-center gap-2">
                    <Label>Sort by:</Label>
                    <Select
                      value={sortBy}
                      onValueChange={(value: any) => setSortBy(value)}
                    >
                      <SelectTrigger className="w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="recent">Recently Added</SelectItem>
                        <SelectItem value="priority">Priority</SelectItem>
                        <SelectItem value="price-low">
                          Price: Low to High
                        </SelectItem>
                        <SelectItem value="price-high">
                          Price: High to Low
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Wishlist Content */}
            {filteredItems.length === 0 ? (
              <Card className="bg-gray-50">
                <CardContent className="pt-6 text-center">
                  <div className="py-8 space-y-4">
                    <Heart className="h-16 w-16 text-gray-400 mx-auto" />
                    <h3 className="text-lg font-medium">
                      {wishlistItems.filter(
                        (i) => i.wishlistId === activeWishlistId,
                      ).length === 0
                        ? "Your wishlist is empty"
                        : "No items match your filters"}
                    </h3>
                    <p className="text-muted-foreground max-w-md mx-auto">
                      {wishlistItems.filter(
                        (i) => i.wishlistId === activeWishlistId,
                      ).length === 0
                        ? "Start adding products you love to see them here"
                        : "Try adjusting your filters to see more items"}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredItems.map((item) => (
                  <Card key={item.id} className="overflow-hidden">
                    <div className="relative h-48">
                      <img
                        src={item.product?.image}
                        alt={item.product?.name}
                        className="w-full h-full object-cover"
                      />

                      {/* Action buttons */}
                      <div className="absolute top-2 right-2 flex gap-2">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 bg-white/70 backdrop-blur-sm hover:bg-white/90"
                            >
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              onClick={() => {
                                setSelectedItem(item);
                                setShowPriceAlertDialog(true);
                              }}
                            >
                              <Bell className="h-4 w-4 mr-2" />
                              Set Price Alert
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Eye className="h-4 w-4 mr-2" />
                              View Product
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Copy className="h-4 w-4 mr-2" />
                              Copy to Another List
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              onClick={() => handleRemoveFromWishlist(item.id)}
                              className="text-red-500"
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              Remove from Wishlist
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>

                      {/* Status badges */}
                      <div className="absolute top-2 left-2 flex flex-col gap-1">
                        {!item.product?.inStock && (
                          <Badge variant="destructive">Out of Stock</Badge>
                        )}
                        {item.product?.discountPrice &&
                          item.product.discountPrice < item.product.price && (
                            <Badge className="bg-red-500 text-white">
                              Sale
                            </Badge>
                          )}
                        {item.priority >= 4 && (
                          <Badge className="bg-yellow-500 text-white">
                            High Priority
                          </Badge>
                        )}
                      </div>

                      {/* Price tracking indicator */}
                      {item.targetPrice && (
                        <div className="absolute bottom-2 right-2">
                          <Badge className="bg-blue-500 text-white text-xs">
                            <Bell className="h-3 w-3 mr-1" />
                            Alert: ${item.targetPrice}
                          </Badge>
                        </div>
                      )}
                    </div>

                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-start">
                        <h3 className="font-medium text-base line-clamp-2">
                          {item.product?.name}
                        </h3>
                        <div className="text-right">
                          <div className="flex items-center gap-1">
                            <span className="font-semibold text-lg">
                              $
                              {(
                                item.product?.discountPrice ||
                                item.product?.price ||
                                0
                              ).toFixed(2)}
                            </span>
                            {getPriceChangeIcon(item) && (
                              <span className={getPriceChangeColor(item)}>
                                {getPriceChangeIcon(item)}
                              </span>
                            )}
                          </div>
                          {item.product?.discountPrice &&
                            item.product.price && (
                              <p className="text-sm text-muted-foreground line-through">
                                ${item.product.price.toFixed(2)}
                              </p>
                            )}
                          {item.priceWhenAdded && (
                            <p
                              className={`text-xs ${getPriceChangeColor(item)}`}
                            >
                              Added at: ${item.priceWhenAdded.toFixed(2)}
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="flex items-center gap-1">
                          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                          <span className="text-sm">
                            {item.product?.rating}
                          </span>
                        </div>
                        <span className="text-sm text-muted-foreground">
                          by {item.product?.sellerName}
                        </span>
                        {item.product?.sellerVerified && (
                          <CheckCircle className="h-4 w-4 text-blue-500" />
                        )}
                      </div>
                    </CardHeader>

                    <CardContent className="pb-3">
                      {/* Notifications */}
                      <div className="flex flex-wrap gap-1 mb-3">
                        {item.notifyOnSale && (
                          <Badge variant="outline" className="text-xs">
                            <Bell className="h-3 w-3 mr-1" />
                            Sale Alert
                          </Badge>
                        )}
                        {item.notifyOnRestock && (
                          <Badge variant="outline" className="text-xs">
                            <Package className="h-3 w-3 mr-1" />
                            Restock Alert
                          </Badge>
                        )}
                      </div>

                      {/* Price tracking */}
                      {item.lowestPriceSeen &&
                        item.lowestPriceSeen < (item.product?.price || 0) && (
                          <div className="text-sm text-green-600 mb-2">
                            <TrendingDown className="h-3 w-3 inline mr-1" />
                            Lowest seen: ${item.lowestPriceSeen.toFixed(2)}
                          </div>
                        )}

                      {/* Notes */}
                      {item.notes && (
                        <div className="text-sm text-muted-foreground bg-gray-50 p-2 rounded">
                          {item.notes}
                        </div>
                      )}
                    </CardContent>

                    <CardFooter className="border-t bg-gray-50 p-3 flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleRemoveFromWishlist(item.id)}
                        className="flex-1"
                      >
                        <X className="h-4 w-4 mr-1" />
                        Remove
                      </Button>
                      <Button
                        size="sm"
                        onClick={() => handleMoveToCart(item)}
                        className="flex-1"
                        disabled={!item.product?.inStock}
                      >
                        <ShoppingCart className="h-4 w-4 mr-1" />
                        {item.product?.inStock ? "Add to Cart" : "Out of Stock"}
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        ))}
      </Tabs>

      {/* Create Wishlist Dialog */}
      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Create New Wishlist</DialogTitle>
            <DialogDescription>
              Create a new wishlist to organize your favorite products
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <Label htmlFor="name">Wishlist Name</Label>
              <Input
                id="name"
                placeholder="e.g., Birthday Gifts, Home Decor"
                value={newWishlistName}
                onChange={(e) => setNewWishlistName(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="description">Description (Optional)</Label>
              <Textarea
                id="description"
                placeholder="What's this wishlist for?"
                value={newWishlistDescription}
                onChange={(e) => setNewWishlistDescription(e.target.value)}
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowCreateDialog(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={handleCreateWishlist}
              disabled={!newWishlistName.trim()}
            >
              <BookmarkPlus className="h-4 w-4 mr-2" />
              Create Wishlist
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Price Alert Dialog */}
      <Dialog
        open={showPriceAlertDialog}
        onOpenChange={setShowPriceAlertDialog}
      >
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Set Price Alert</DialogTitle>
            <DialogDescription>
              Get notified when the price drops to your target amount
            </DialogDescription>
          </DialogHeader>

          {selectedItem && (
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <img
                  src={selectedItem.product?.image}
                  alt={selectedItem.product?.name}
                  className="w-16 h-16 rounded object-cover"
                />
                <div>
                  <h4 className="font-medium">{selectedItem.product?.name}</h4>
                  <p className="text-sm text-muted-foreground">
                    Current price: $
                    {(
                      selectedItem.product?.discountPrice ||
                      selectedItem.product?.price ||
                      0
                    ).toFixed(2)}
                  </p>
                </div>
              </div>

              <div>
                <Label htmlFor="targetPrice">Target Price</Label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="targetPrice"
                    type="number"
                    placeholder="0.00"
                    className="pl-9"
                    value={targetPrice}
                    onChange={(e) => setTargetPrice(e.target.value)}
                    step="0.01"
                    min="0"
                  />
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  You'll receive a notification when the price drops to this
                  amount or lower
                </p>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowPriceAlertDialog(false)}
            >
              Cancel
            </Button>
            <Button onClick={handleSetPriceAlert} disabled={!targetPrice}>
              <Bell className="h-4 w-4 mr-2" />
              Set Alert
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default EnhancedWishlist;
